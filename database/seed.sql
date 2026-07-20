-- =============================================================
--  PARKEE — Seed Data
--  Run AFTER schema.sql
--  Mirrors the default data in App.jsx
-- =============================================================

-- =============================================================
-- USERS
-- =============================================================
INSERT INTO users (full_name, email, phone, country_code, user_type) VALUES
  ('Alex Johnson',  'alex@example.com',   '+91 98765 43210', '+91', 'both'),
  ('Priya Sharma',  'priya@parkee.com',   '+91 99887 76655', '+91', 'parker'),
  ('Rajan Mehta',   'rajan@parkee.com',   '+91 98000 11223', '+91', 'host'),
  ('Guest User',    'guest@parkee.com',   '+91 99999 99999', '+91', 'parker');


-- =============================================================
-- PARKING SPOTS  (host_id = 1 → Alex Johnson, host_id = 3 → Rajan Mehta)
-- =============================================================
INSERT INTO parking_spots
  (host_id, title, address, spot_type, suitable_for, price_per_hr,
   rating, review_count, has_cctv, has_security, is_verified,
   status, distance_km, primary_image_url, bookings_mtd, total_earned)
VALUES
  (
    1,
    '12 Khader Nawaz Khan Road',
    '12 Khader Nawaz Khan Road, Nungambakkam, Chennai, Tamil Nadu 600006',
    'Driveway', 'both', 80.00,
    4.90, 156, TRUE, TRUE, TRUE,
    'ACTIVE', 0.20,
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=600',
    28, 22400.00
  ),
  (
    3,
    'T. Nagar Multi-Level Parking',
    'T. Nagar, Chennai, Tamil Nadu 600017',
    'Underground', 'both', 120.00,
    4.70, 89, TRUE, TRUE, FALSE,
    'PENDING REVIEW', 0.50,
    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=600',
    0, 0.00
  ),
  (
    3,
    'Adyar Private Car Park',
    'Adyar, Chennai, Tamil Nadu 600020',
    'Private Lot', '4-wheeler', 60.00,
    4.50, 210, FALSE, FALSE, FALSE,
    'HIDDEN', 0.80,
    'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=600',
    12, 7200.00
  );


-- =============================================================
-- SPOT PHOTOS  (primary image already set on parking_spots)
-- =============================================================
INSERT INTO spot_photos (spot_id, photo_url, sort_order) VALUES
  -- Spot 1: 2 additional photos
  (1, 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=400', 1),
  (1, 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=400', 2),
  -- Spot 2: 1 additional photo
  (2, 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=400', 1),
  -- Spot 3: 1 additional photo
  (3, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400', 1);


-- =============================================================
-- BOOKINGS  (user_id = 2 → Priya, user_id = 1 → Alex)
-- =============================================================
INSERT INTO bookings
  (spot_id, user_id, booking_date, start_time, end_time,
   duration_hrs, total_price, status)
VALUES
  (1, 2, '2024-10-24', '10:00:00', '13:00:00', 3.00, 240.00, 'completed'),
  (1, 1, '2024-10-25', '09:00:00', '12:00:00', 3.00, 240.00, 'completed'),
  (3, 2, '2024-10-20', '14:00:00', '16:00:00', 2.00, 120.00, 'completed'),
  (1, 2, '2024-11-01', '10:00:00', '11:00:00', 1.00,  80.00, 'confirmed');


-- =============================================================
-- REVIEWS
-- =============================================================
INSERT INTO reviews (spot_id, user_id, booking_id, rating, comment) VALUES
  (1, 2, 1, 5, 'Excellent spot! Clean, safe, and very easy to access. Highly recommended.'),
  (1, 1, 2, 5, 'Perfect location. The host was responsive and the CCTV gave me peace of mind.'),
  (3, 2, 3, 4, 'Decent parking, a bit hard to find at first but good value for money.');


-- =============================================================
-- OTP SESSIONS  (example expired session — safe for testing)
-- =============================================================
INSERT INTO otp_sessions (phone, otp_code, expires_at, used) VALUES
  ('+91 98765 43210', '482910', '2024-10-24 10:10:00', TRUE),
  ('+91 99887 76655', '736421', '2024-10-24 11:05:00', TRUE);
