import { Router } from 'express';
import db from '../db.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

// ─── GET /api/reviews/spot/:spotId ───────────────────────────────────────────
router.get('/spot/:spotId', (req, res) => {
  try {
    const rows = db.prepare(
      `SELECT r.*, u.full_name AS reviewer_name
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.spot_id = ?
       ORDER BY r.created_at DESC`
    ).all(req.params.spotId);
    return res.json(rows);
  } catch (err) {
    console.error('GET /reviews/spot error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ─── POST /api/reviews ────────────────────────────────────────────────────────
router.post('/', authMiddleware, (req, res) => {
  const { spot_id, booking_id, rating, comment } = req.body;

  if (!spot_id || !rating) {
    return res.status(400).json({ error: 'spot_id and rating are required' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'rating must be between 1 and 5' });
  }

  try {
    const result = db.prepare(
      `INSERT INTO reviews (spot_id, user_id, booking_id, rating, comment)
       VALUES (?, ?, ?, ?, ?)`
    ).run(spot_id, req.user.id, booking_id || null, rating, comment || null);

    // Update spot rating and review count
    const stats = db.prepare(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE spot_id = ?'
    ).get(spot_id);
    db.prepare(
      'UPDATE parking_spots SET rating = ?, review_count = ? WHERE id = ?'
    ).run(stats.avg_rating, stats.count, spot_id);

    const newReview = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json(newReview);
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'You have already reviewed this booking' });
    }
    console.error('POST /reviews error:', err);
    return res.status(500).json({ error: 'Server error posting review' });
  }
});

// ─── DELETE /api/reviews/:id ──────────────────────────────────────────────────
router.delete('/:id', authMiddleware, (req, res) => {
  const review = db.prepare('SELECT id, user_id, spot_id FROM reviews WHERE id = ?').get(req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  if (review.user_id !== req.user.id) {
    return res.status(403).json({ error: 'You can only delete your own reviews' });
  }

  try {
    db.prepare('DELETE FROM reviews WHERE id = ?').run(req.params.id);

    // Update spot rating after deletion
    const stats = db.prepare(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE spot_id = ?'
    ).get(review.spot_id);
    db.prepare(
      'UPDATE parking_spots SET rating = COALESCE(?, 5.0), review_count = ? WHERE id = ?'
    ).run(stats.avg_rating, stats.count, review.spot_id);

    return res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error('DELETE /reviews error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
