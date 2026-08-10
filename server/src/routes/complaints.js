import { Router } from 'express';
import pool from '../db/pool.js';
import { requireAdmin } from '../middleware/auth.js';
import { isValidRoll, normalizeRoll, generateTrackingCode } from '../utils/roll.js';

const router = Router();

router.post('/', async (req, res) => {
  const { rollNo, category, description } = req.body;
  if (!isValidRoll(rollNo)) {
    return res.json({ ok: true, trackingCode: '------' });
  }

  const roll = normalizeRoll(rollNo);
  if (!category || !description?.trim()) {
    return res.json({ ok: true, trackingCode: '------' });
  }

  let trackingCode = generateTrackingCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const { rows } = await pool.query(
        `INSERT INTO complaints (roll_no, category, description, tracking_code)
         VALUES ($1, $2, $3, $4) RETURNING tracking_code`,
        [roll, category, description.trim(), trackingCode]
      );
      return res.json({ ok: true, trackingCode: rows[0].tracking_code });
    } catch {
      trackingCode = generateTrackingCode();
    }
  }

  res.json({ ok: true, trackingCode: '------' });
});

router.get('/track', async (req, res) => {
  const { rollNo, code } = req.query;
  if (!isValidRoll(rollNo) || !code) {
    return res.json(null);
  }

  const { rows } = await pool.query(
    `SELECT id, category, description, status, admin_reply, created_at, updated_at
     FROM complaints WHERE roll_no = $1 AND tracking_code = $2`,
    [normalizeRoll(rollNo), String(code).toUpperCase()]
  );

  res.json(rows[0] || null);
});

router.get('/admin', requireAdmin, async (_req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM complaints ORDER BY created_at DESC'
  );
  res.json(rows);
});

router.patch('/:id', requireAdmin, async (req, res) => {
  const { status, admin_reply } = req.body;
  const { rows } = await pool.query(
    `UPDATE complaints
     SET status = COALESCE($1, status),
         admin_reply = COALESCE($2, admin_reply),
         updated_at = NOW()
     WHERE id = $3 RETURNING *`,
    [status, admin_reply, req.params.id]
  );
  res.json(rows[0]);
});

export default router;
