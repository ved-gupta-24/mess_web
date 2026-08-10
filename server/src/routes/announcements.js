import { Router } from 'express';
import pool from '../db/pool.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT * FROM announcements
     WHERE (expires_at IS NULL OR expires_at > NOW())
     ORDER BY
       CASE priority WHEN 'urgent' THEN 0 WHEN 'important' THEN 1 ELSE 2 END,
       published_at DESC`
  );
  res.json(rows);
});

router.post('/', requireAdmin, async (req, res) => {
  const { title, body, priority = 'normal', expires_at } = req.body;
  if (!title || !body) {
    return res.status(400).json({ error: 'title and body required' });
  }

  const { rows } = await pool.query(
    `INSERT INTO announcements (title, body, priority, expires_at, created_by)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, body, priority, expires_at || null, req.admin.id]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', requireAdmin, async (req, res) => {
  const { title, body, priority, expires_at } = req.body;
  const { rows } = await pool.query(
    `UPDATE announcements
     SET title = COALESCE($1, title),
         body = COALESCE($2, body),
         priority = COALESCE($3, priority),
         expires_at = $4
     WHERE id = $5 RETURNING *`,
    [title, body, priority, expires_at ?? null, req.params.id]
  );
  res.json(rows[0]);
});

router.delete('/:id', requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM announcements WHERE id = $1', [req.params.id]);
  res.json({ ok: true });
});

export default router;
