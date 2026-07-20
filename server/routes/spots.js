import { Router } from 'express';
import db from '../db.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

// ─── GET /api/spots ───────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  const { status, type, suitable_for } = req.query;

  let query = `
    SELECT ps.*,
      u.full_name AS host_name
    FROM parking_spots ps
    JOIN users u ON u.id = ps.host_id
    WHERE 1=1
  `;
  const params = [];

  if (status)       { query += ' AND ps.status = ?';    params.push(status); }
  if (type)         { query += ' AND ps.spot_type = ?';  params.push(type); }
  if (suitable_for) { query += " AND (ps.suitable_for = ? OR ps.suitable_for = 'both')"; params.push(suitable_for); }

  query += ' ORDER BY ps.rating DESC, ps.review_count DESC';

  try {
    const rows = db.prepare(query).all(...params);
    return res.json(rows);
  } catch (err) {
    console.error('GET /spots error:', err);
    return res.status(500).json({ error: 'Server error fetching spots' });
  }
});

// ─── GET /api/spots/mine ──────────────────────────────────────────────────────
router.get('/mine', authMiddleware, (req, res) => {
  try {
    const rows = db.prepare(
      `SELECT * FROM parking_spots WHERE host_id = ? ORDER BY created_at DESC`
    ).all(req.user.id);
    return res.json(rows);
  } catch (err) {
    console.error('GET /spots/mine error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ─── GET /api/spots/:id ───────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const { id } = req.params;
  try {
    const spot = db.prepare(
      `SELECT ps.*, u.full_name AS host_name
       FROM parking_spots ps
       JOIN users u ON u.id = ps.host_id
       WHERE ps.id = ?`
    ).get(id);
    if (!spot) return res.status(404).json({ error: 'Spot not found' });

    const photos = db.prepare(
      'SELECT * FROM spot_photos WHERE spot_id = ? ORDER BY sort_order'
    ).all(id);
    const reviews = db.prepare(
      `SELECT r.*, u.full_name AS reviewer_name
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.spot_id = ?
       ORDER BY r.created_at DESC`
    ).all(id);

    return res.json({ ...spot, photos, reviews });
  } catch (err) {
    console.error('GET /spots/:id error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// ─── POST /api/spots ──────────────────────────────────────────────────────────
router.post('/', authMiddleware, (req, res) => {
  const {
    title, address, spot_type = 'Driveway', suitable_for = 'both',
    price_per_hr, has_cctv = false, has_security = false,
    primary_image_url, photos = []
  } = req.body;

  if (!title || !address || !price_per_hr) {
    return res.status(400).json({ error: 'title, address and price_per_hr are required' });
  }

  try {
    const result = db.prepare(
      `INSERT INTO parking_spots
        (host_id, title, address, spot_type, suitable_for, price_per_hr,
         has_cctv, has_security, primary_image_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING REVIEW')`
    ).run(req.user.id, title, address, spot_type, suitable_for,
       parseFloat(price_per_hr), has_cctv ? 1 : 0, has_security ? 1 : 0, primary_image_url || null);

    const spotId = result.lastInsertRowid;

    if (photos.length > 0) {
      const insert = db.prepare('INSERT INTO spot_photos (spot_id, photo_url, sort_order) VALUES (?, ?, ?)');
      for (let i = 0; i < photos.length; i++) {
        insert.run(spotId, photos[i], i + 1);
      }
    }

    const newSpot = db.prepare('SELECT * FROM parking_spots WHERE id = ?').get(spotId);
    return res.status(201).json(newSpot);
  } catch (err) {
    console.error('POST /spots error:', err);
    return res.status(500).json({ error: 'Server error creating spot' });
  }
});

// ─── PATCH /api/spots/:id ─────────────────────────────────────────────────────
router.patch('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { title, address, spot_type, suitable_for, price_per_hr,
          has_cctv, has_security, status, primary_image_url } = req.body;

  const spot = db.prepare('SELECT id, host_id FROM parking_spots WHERE id = ?').get(id);
  if (!spot) return res.status(404).json({ error: 'Spot not found' });
  if (spot.host_id !== req.user.id) {
    return res.status(403).json({ error: 'You can only edit your own spots' });
  }

  const fields = [];
  const values = [];
  if (title !== undefined)            { fields.push('title = ?');             values.push(title); }
  if (address !== undefined)          { fields.push('address = ?');           values.push(address); }
  if (spot_type !== undefined)        { fields.push('spot_type = ?');         values.push(spot_type); }
  if (suitable_for !== undefined)     { fields.push('suitable_for = ?');      values.push(suitable_for); }
  if (price_per_hr !== undefined)     { fields.push('price_per_hr = ?');      values.push(parseFloat(price_per_hr)); }
  if (has_cctv !== undefined)         { fields.push('has_cctv = ?');          values.push(has_cctv ? 1 : 0); }
  if (has_security !== undefined)     { fields.push('has_security = ?');      values.push(has_security ? 1 : 0); }
  if (status !== undefined)           { fields.push('status = ?');            values.push(status); }
  if (primary_image_url !== undefined){ fields.push('primary_image_url = ?'); values.push(primary_image_url); }

  if (!fields.length) return res.status(400).json({ error: 'No fields to update' });

  values.push(id);
  try {
    db.prepare(`UPDATE parking_spots SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    const updated = db.prepare('SELECT * FROM parking_spots WHERE id = ?').get(id);
    return res.json(updated);
  } catch (err) {
    console.error('PATCH /spots/:id error:', err);
    return res.status(500).json({ error: 'Server error updating spot' });
  }
});

// ─── DELETE /api/spots/:id ────────────────────────────────────────────────────
router.delete('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const spot = db.prepare('SELECT id, host_id FROM parking_spots WHERE id = ?').get(id);
  if (!spot) return res.status(404).json({ error: 'Spot not found' });
  if (spot.host_id !== req.user.id) {
    return res.status(403).json({ error: 'You can only delete your own spots' });
  }

  try {
    db.prepare('DELETE FROM parking_spots WHERE id = ?').run(id);
    return res.json({ message: 'Spot deleted successfully' });
  } catch (err) {
    console.error('DELETE /spots/:id error:', err);
    return res.status(500).json({ error: 'Server error deleting spot' });
  }
});

export default router;
