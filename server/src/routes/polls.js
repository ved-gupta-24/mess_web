import { Router } from 'express';
import pool from '../db/pool.js';
import { requireAdmin } from '../middleware/auth.js';
import { isValidRoll, normalizeRoll } from '../utils/roll.js';

const router = Router();

router.get('/', async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT p.*,
       COALESCE(
         (SELECT json_agg(json_build_object('option_index', pv.option_index))
          FROM poll_votes pv WHERE pv.poll_id = p.id),
         '[]'
       ) AS votes
     FROM polls p
     WHERE p.is_active = TRUE
       AND (p.closes_at IS NULL OR p.closes_at > NOW())
     ORDER BY p.created_at DESC`
  );

  const polls = rows.map((p) => {
    const voteCounts = new Array(p.options.length).fill(0);
    for (const v of p.votes || []) {
      if (v.option_index >= 0 && v.option_index < voteCounts.length) {
        voteCounts[v.option_index]++;
      }
    }
    const { votes, ...rest } = p;
    return { ...rest, voteCounts };
  });

  res.json(polls);
});

router.post('/:id/vote', async (req, res) => {
  const { rollNo, optionIndex } = req.body;
  if (!isValidRoll(rollNo)) {
    return res.json({ ok: true });
  }

  const roll = normalizeRoll(rollNo);
  const idx = Number(optionIndex);
  if (!Number.isInteger(idx) || idx < 0) {
    return res.json({ ok: true });
  }

  const { rows: polls } = await pool.query(
    'SELECT * FROM polls WHERE id = $1 AND is_active = TRUE',
    [req.params.id]
  );
  const poll = polls[0];
  if (!poll || idx >= poll.options.length) {
    return res.json({ ok: true });
  }

  try {
    await pool.query(
      'INSERT INTO poll_votes (poll_id, roll_no, option_index) VALUES ($1, $2, $3)',
      [poll.id, roll, idx]
    );
  } catch {
    // duplicate vote — silent
  }

  res.json({ ok: true });
});

router.post('/', requireAdmin, async (req, res) => {
  const { question, options, closes_at } = req.body;
  if (!question || !Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ error: 'question and at least 2 options required' });
  }

  const { rows } = await pool.query(
    `INSERT INTO polls (question, options, closes_at, created_by)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [question, JSON.stringify(options), closes_at || null, req.admin.id]
  );
  res.status(201).json(rows[0]);
});

router.patch('/:id/close', requireAdmin, async (req, res) => {
  const { rows } = await pool.query(
    'UPDATE polls SET is_active = FALSE WHERE id = $1 RETURNING *',
    [req.params.id]
  );
  res.json(rows[0]);
});

export default router;
