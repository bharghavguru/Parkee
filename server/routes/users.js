import { Router } from 'express';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

// ─── Helper: sign a JWT ───────────────────────────────────────────────────────
const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, phone: user.phone, user_type: user.user_type },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

// ─── POST /api/users/signup ───────────────────────────────────────────────────
router.post('/signup', (req, res) => {
  const { full_name, email, phone, country_code = '+91', user_type = 'parker' } = req.body;

  if (!full_name || (!email && !phone)) {
    return res.status(400).json({ error: 'full_name and email or phone are required' });
  }

  try {
    const existing = db.prepare(
      'SELECT id FROM users WHERE email = ? OR phone = ?'
    ).get(email || null, phone || null);

    if (existing) {
      return res.status(409).json({ error: 'A user with that email or phone already exists' });
    }

    const result = db.prepare(
      `INSERT INTO users (full_name, email, phone, country_code, user_type)
       VALUES (?, ?, ?, ?, ?)`
    ).run(full_name, email || null, phone || null, country_code, user_type);

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    const token = signToken(user);

    return res.status(201).json({ user, token });
  } catch (err) {
    console.error('signup error:', err);
    return res.status(500).json({ error: 'Server error during signup' });
  }
});

// ─── POST /api/users/login/email ─────────────────────────────────────────────
router.post('/login/email', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email is required' });

  try {
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      const name = email.split('@')[0];
      const result = db.prepare(
        `INSERT INTO users (full_name, email, user_type) VALUES (?, ?, 'parker')`
      ).run(name, email);
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    }

    const token = signToken(user);
    return res.json({ user, token });
  } catch (err) {
    console.error('email login error:', err);
    return res.status(500).json({ error: 'Server error during email login' });
  }
});

// ─── POST /api/users/guest ────────────────────────────────────────────────────
router.post('/guest', (req, res) => {
  try {
    let user = db.prepare(`SELECT * FROM users WHERE email = 'guest@parkee.com' LIMIT 1`).get();
    if (!user) {
      const result = db.prepare(
        `INSERT INTO users (full_name, email, phone, user_type, is_guest) VALUES ('Guest User', 'guest@parkee.com', '+91 99999 99999', 'parker', 1)`
      ).run();
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    }
    const token = signToken(user);
    return res.json({ user, token });
  } catch (err) {
    console.error('guest login error:', err);
    return res.status(500).json({ error: 'Server error during guest login' });
  }
});

// ─── GET /api/users/me ────────────────────────────────────────────────────────
router.get('/me', authMiddleware, (req, res) => {
  try {
    const user = db.prepare(
      'SELECT id, full_name, email, phone, country_code, user_type, created_at FROM users WHERE id = ?'
    ).get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (err) {
    console.error('get /me error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ─── PATCH /api/users/me ──────────────────────────────────────────────────────
router.patch('/me', authMiddleware, (req, res) => {
  const { full_name, email, phone, user_type } = req.body;
  const fields = [];
  const values = [];

  if (full_name) { fields.push('full_name = ?'); values.push(full_name); }
  if (email)     { fields.push('email = ?');     values.push(email); }
  if (phone)     { fields.push('phone = ?');     values.push(phone); }
  if (user_type) { fields.push('user_type = ?'); values.push(user_type); }

  if (!fields.length) return res.status(400).json({ error: 'No fields to update' });

  values.push(req.user.id);
  try {
    db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    return res.json(user);
  } catch (err) {
    console.error('patch /me error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
