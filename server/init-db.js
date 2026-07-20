/**
 * Initializes the SQLite database — creates tables if they don't exist
 * and seeds sample data on the first run.
 */
export function initDatabase(db) {
  // ─── Create tables ──────────────────────────────────────────────────────
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name    TEXT    NOT NULL,
      email        TEXT    UNIQUE,
      phone        TEXT    UNIQUE,
      country_code TEXT    NOT NULL DEFAULT '+91',
      user_type    TEXT    NOT NULL DEFAULT 'parker' CHECK(user_type IN ('parker','host','both')),
      is_guest     INTEGER NOT NULL DEFAULT 0,
      created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS parking_spots (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      host_id           INTEGER NOT NULL,
      title             TEXT    NOT NULL,
      address           TEXT    NOT NULL,
      spot_type         TEXT    NOT NULL DEFAULT 'Driveway',
      suitable_for      TEXT    NOT NULL DEFAULT 'both',
      price_per_hr      REAL    NOT NULL,
      rating            REAL    NOT NULL DEFAULT 5.0,
      review_count      INTEGER NOT NULL DEFAULT 0,
      has_cctv          INTEGER NOT NULL DEFAULT 0,
      has_security      INTEGER NOT NULL DEFAULT 0,
      is_verified       INTEGER NOT NULL DEFAULT 0,
      status            TEXT    NOT NULL DEFAULT 'PENDING REVIEW',
      distance_km       REAL,
      primary_image_url TEXT,
      bookings_mtd      INTEGER NOT NULL DEFAULT 0,
      total_earned      REAL    NOT NULL DEFAULT 0.0,
      created_at        TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at        TEXT    NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS spot_photos (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      spot_id    INTEGER NOT NULL,
      photo_url  TEXT    NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (spot_id) REFERENCES parking_spots(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      spot_id       INTEGER NOT NULL,
      user_id       INTEGER NOT NULL,
      booking_date  TEXT    NOT NULL,
      start_time    TEXT    NOT NULL,
      end_time      TEXT    NOT NULL,
      duration_hrs  REAL    NOT NULL,
      total_price   REAL    NOT NULL,
      status        TEXT    NOT NULL DEFAULT 'confirmed',
      created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at    TEXT    NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (spot_id) REFERENCES parking_spots(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      spot_id     INTEGER NOT NULL,
      user_id     INTEGER NOT NULL,
      booking_id  INTEGER,
      rating      INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      comment     TEXT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (spot_id)    REFERENCES parking_spots(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id)    REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS otp_sessions (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      phone      TEXT    NOT NULL,
      otp_code   TEXT    NOT NULL,
      expires_at TEXT    NOT NULL,
      used       INTEGER NOT NULL DEFAULT 0,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `);

  console.log('✅ Database tables ready');

  // ─── Seed if empty ──────────────────────────────────────────────────────
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    console.log('📦 Seeding initial data...');

    // Users
    db.prepare(`INSERT INTO users (full_name, email, phone, country_code, user_type) VALUES (?, ?, ?, ?, ?)`)
      .run('Alex Johnson', 'alex@example.com', '+91 98765 43210', '+91', 'both');
    db.prepare(`INSERT INTO users (full_name, email, phone, country_code, user_type) VALUES (?, ?, ?, ?, ?)`)
      .run('Priya Sharma', 'priya@parkee.com', '+91 99887 76655', '+91', 'parker');
    db.prepare(`INSERT INTO users (full_name, email, phone, country_code, user_type) VALUES (?, ?, ?, ?, ?)`)
      .run('Rajan Mehta', 'rajan@parkee.com', '+91 98000 11223', '+91', 'host');
    db.prepare(`INSERT INTO users (full_name, email, phone, country_code, user_type, is_guest) VALUES (?, ?, ?, ?, ?, ?)`)
      .run('Guest User', 'guest@parkee.com', '+91 99999 99999', '+91', 'parker', 1);

    // Parking Spots
    db.prepare(`INSERT INTO parking_spots
      (host_id, title, address, spot_type, suitable_for, price_per_hr,
       rating, review_count, has_cctv, has_security, is_verified,
       status, distance_km, primary_image_url, bookings_mtd, total_earned)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(1, '12 Khader Nawaz Khan Road',
        '12 Khader Nawaz Khan Road, Nungambakkam, Chennai, Tamil Nadu 600006',
        'Driveway', 'both', 80.00,
        4.90, 156, 1, 1, 1,
        'ACTIVE', 0.20,
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=600',
        28, 22400.00);

    db.prepare(`INSERT INTO parking_spots
      (host_id, title, address, spot_type, suitable_for, price_per_hr,
       rating, review_count, has_cctv, has_security, is_verified,
       status, distance_km, primary_image_url, bookings_mtd, total_earned)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(3, 'T. Nagar Multi-Level Parking',
        'T. Nagar, Chennai, Tamil Nadu 600017',
        'Underground', 'both', 120.00,
        4.70, 89, 1, 1, 0,
        'PENDING REVIEW', 0.50,
        'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=600',
        0, 0.00);

    db.prepare(`INSERT INTO parking_spots
      (host_id, title, address, spot_type, suitable_for, price_per_hr,
       rating, review_count, has_cctv, has_security, is_verified,
       status, distance_km, primary_image_url, bookings_mtd, total_earned)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(3, 'Adyar Private Car Park',
        'Adyar, Chennai, Tamil Nadu 600020',
        'Private Lot', '4-wheeler', 60.00,
        4.50, 210, 0, 0, 0,
        'HIDDEN', 0.80,
        'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=600',
        12, 7200.00);

    // Bookings
    db.prepare(`INSERT INTO bookings (spot_id, user_id, booking_date, start_time, end_time, duration_hrs, total_price, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(1, 2, '2024-10-24', '10:00', '13:00', 3.00, 240.00, 'completed');
    db.prepare(`INSERT INTO bookings (spot_id, user_id, booking_date, start_time, end_time, duration_hrs, total_price, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(1, 1, '2024-10-25', '09:00', '12:00', 3.00, 240.00, 'completed');
    db.prepare(`INSERT INTO bookings (spot_id, user_id, booking_date, start_time, end_time, duration_hrs, total_price, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(3, 2, '2024-10-20', '14:00', '16:00', 2.00, 120.00, 'completed');

    // Reviews
    db.prepare(`INSERT INTO reviews (spot_id, user_id, booking_id, rating, comment) VALUES (?, ?, ?, ?, ?)`)
      .run(1, 2, 1, 5, 'Excellent spot! Clean, safe, and very easy to access.');
    db.prepare(`INSERT INTO reviews (spot_id, user_id, booking_id, rating, comment) VALUES (?, ?, ?, ?, ?)`)
      .run(1, 1, 2, 5, 'Perfect location. The host was responsive and the CCTV gave me peace of mind.');
    db.prepare(`INSERT INTO reviews (spot_id, user_id, booking_id, rating, comment) VALUES (?, ?, ?, ?, ?)`)
      .run(3, 2, 3, 4, 'Decent parking, a bit hard to find at first but good value for money.');

    console.log('✅ Seed data loaded: 4 users, 3 spots, 3 bookings, 3 reviews');
  }
}
