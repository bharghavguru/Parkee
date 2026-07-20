import { Router } from 'express';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = Router();

const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES || '10');

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ─── POST /api/otp/send ───────────────────────────────────────────────────────
router.post('/send', (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'phone is required' });

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();

  try {
    // Invalidate previous unused OTPs
    db.prepare(`UPDATE otp_sessions SET used = 1 WHERE phone = ? AND used = 0`).run(phone);

    db.prepare(
      `INSERT INTO otp_sessions (phone, otp_code, expires_at) VALUES (?, ?, ?)`
    ).run(phone, otp, expiresAt);

    return res.json({
      message: `OTP sent to ${phone}`,
      otp, // ⚠️ Remove in production
      expires_in_minutes: OTP_EXPIRY_MINUTES
    });
  } catch (err) {
    console.error('POST /otp/send error:', err);
    return res.status(500).json({ error: 'Server error sending OTP' });
  }
});

// ─── POST /api/otp/verify ─────────────────────────────────────────────────────
router.post('/verify', (req, res) => {
  const { phone, otp_code } = req.body;
  if (!phone || !otp_code) {
    return res.status(400).json({ error: 'phone and otp_code are required' });
  }

  try {
    const session = db.prepare(
      `SELECT * FROM otp_sessions
       WHERE phone = ? AND otp_code = ? AND used = 0 AND expires_at > datetime('now')
       ORDER BY created_at DESC LIMIT 1`
    ).get(phone, otp_code);

    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    db.prepare('UPDATE otp_sessions SET used = 1 WHERE id = ?').run(session.id);

    let user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
    if (!user) {
      const result = db.prepare(
        `INSERT INTO users (full_name, phone, user_type) VALUES ('New User', ?, 'parker')`
      ).run(phone);
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, phone: user.phone, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({ user, token });
  } catch (err) {
    console.error('POST /otp/verify error:', err);
    return res.status(500).json({ error: 'Server error verifying OTP' });
  }
});

export default router;
