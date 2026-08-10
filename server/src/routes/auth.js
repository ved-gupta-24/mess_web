import { Router } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db/pool.js';
import { signToken } from '../utils/jwt.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const { rows } = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
  const admin = rows[0];
  if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken({ id: admin.id, email: admin.email, role: 'admin' });
  res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
});

router.get('/me', requireAdmin, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, email, name FROM admins WHERE id = $1',
    [req.admin.id]
  );
  res.json(rows[0] || null);
});

export default router;
