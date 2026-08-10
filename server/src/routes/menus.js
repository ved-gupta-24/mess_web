import { Router } from 'express';
import pool from '../db/pool.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  const { from, to, date } = req.query;

  if (date) {
    const { rows } = await pool.query(
      'SELECT * FROM menus WHERE date = $1 ORDER BY meal_type',
      [date]
    );
    return res.json(rows);
  }

  const start = from || new Date().toISOString().slice(0, 10);
  const end = to || start;

  const { rows } = await pool.query(
    'SELECT * FROM menus WHERE date BETWEEN $1 AND $2 ORDER BY date, meal_type',
    [start, end]
  );
  res.json(rows);
});

router.post('/', requireAdmin, async (req, res) => {
  const { date, meal_type, items } = req.body;
  if (!date || !meal_type || !Array.isArray(items)) {
    return res.status(400).json({ error: 'date, meal_type, and items required' });
  }

  const { rows } = await pool.query(
    `INSERT INTO menus (date, meal_type, items, created_by)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (date, meal_type)
     DO UPDATE SET items = $3, updated_at = NOW(), created_by = $4
     RETURNING *`,
    [date, meal_type, items, req.admin.id]
  );
  res.status(201).json(rows[0]);
});

router.delete('/:id', requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM menus WHERE id = $1', [req.params.id]);
  res.json({ ok: true });
});

export default router;
