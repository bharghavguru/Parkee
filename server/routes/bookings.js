import { Router } from 'express';
import db from '../db.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

// ─── GET /api/bookings/mine ───────────────────────────────────────────────────
router.get('/mine', authMiddleware, (req, res) => {
  try {
    const rows = db.prepare(
      `SELECT b.*, ps.title AS spot_title, ps.address AS spot_address,
              ps.primary_image_url, ps.price_per_hr
       FROM bookings b
       JOIN parking_spots ps ON ps.id = b.spot_id
       WHERE b.user_id = ?
       ORDER BY b.booking_date DESC, b.start_time DESC`
    ).all(req.user.id);
    return res.json(rows);
  } catch (err) {
    console.error('GET /bookings/mine error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET /api/bookings/host ───────────────────────────────────────────────────
router.get('/host', authMiddleware, (req, res) => {
  try {
    const rows = db.prepare(
      `SELECT b.*, ps.title AS spot_title, u.full_name AS parker_name, u.phone AS parker_phone
       FROM bookings b
       JOIN parking_spots ps ON ps.id = b.spot_id
       JOIN users u ON u.id = b.user_id
       WHERE ps.host_id = ?
       ORDER BY b.booking_date DESC, b.start_time DESC`
    ).all(req.user.id);
    return res.json(rows);
  } catch (err) {
    console.error('GET /bookings/host error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET /api/bookings/:id ────────────────────────────────────────────────────
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const booking = db.prepare(
      `SELECT b.*, ps.title AS spot_title, ps.address, ps.price_per_hr,
              ps.primary_image_url, u.full_name AS parker_name
       FROM bookings b
       JOIN parking_spots ps ON ps.id = b.spot_id
       JOIN users u ON u.id = b.user_id
       WHERE b.id = ?`
    ).get(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const spot = db.prepare('SELECT host_id FROM parking_spots WHERE id = ?').get(booking.spot_id);
    if (booking.user_id !== req.user.id && spot.host_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this booking' });
    }

    return res.json(booking);
  } catch (err) {
    console.error('GET /bookings/:id error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ─── POST /api/bookings ───────────────────────────────────────────────────────
router.post('/', authMiddleware, (req, res) => {
  const { spot_id, booking_date, start_time, end_time } = req.body;
  if (!spot_id || !booking_date || !start_time || !end_time) {
    return res.status(400).json({ error: 'spot_id, booking_date, start_time, end_time are required' });
  }

  try {
    const spot = db.prepare(
      'SELECT id, price_per_hr, status FROM parking_spots WHERE id = ?'
    ).get(spot_id);
    if (!spot) return res.status(404).json({ error: 'Spot not found' });
    if (spot.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Spot is not available for booking' });
    }

    const [sh, sm] = start_time.split(':').map(Number);
    const [eh, em] = end_time.split(':').map(Number);
    const durationHrs = parseFloat(((eh * 60 + em - sh * 60 - sm) / 60).toFixed(2));
    if (durationHrs <= 0) {
      return res.status(400).json({ error: 'end_time must be after start_time' });
    }

    const totalPrice = parseFloat((spot.price_per_hr * durationHrs).toFixed(2));

    const result = db.prepare(
      `INSERT INTO bookings
        (spot_id, user_id, booking_date, start_time, end_time, duration_hrs, total_price, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')`
    ).run(spot_id, req.user.id, booking_date, start_time, end_time, durationHrs, totalPrice);

    db.prepare(
      `UPDATE parking_spots
       SET bookings_mtd = bookings_mtd + 1,
           total_earned = total_earned + ?
       WHERE id = ?`
    ).run(totalPrice, spot_id);

    const newBooking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json(newBooking);
  } catch (err) {
    console.error('POST /bookings error:', err);
    return res.status(500).json({ error: 'Server error creating booking' });
  }
});

// ─── PATCH /api/bookings/:id/cancel ──────────────────────────────────────────
router.patch('/:id/cancel', authMiddleware, (req, res) => {
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  if (booking.user_id !== req.user.id) {
    return res.status(403).json({ error: 'You can only cancel your own bookings' });
  }
  if (booking.status !== 'confirmed') {
    return res.status(400).json({ error: 'Only confirmed bookings can be cancelled' });
  }

  try {
    db.prepare(`UPDATE bookings SET status = 'cancelled' WHERE id = ?`).run(req.params.id);
    return res.json({ message: 'Booking cancelled' });
  } catch (err) {
    console.error('cancel booking error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
