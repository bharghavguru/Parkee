-- =============================================================
--  PARKEE — SQL Database Schema
--  Compatible with: MySQL 8+ / MariaDB 10.3+
--  For PostgreSQL: replace AUTO_INCREMENT → SERIAL, ENUM → VARCHAR with CHECK
--  For SQLite:    remove ENGINE/CHARSET clauses, use INTEGER PRIMARY KEY
-- =============================================================

-- Drop tables in reverse dependency order (safe re-run)
DROP TABLE IF EXISTS otp_sessions;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS spot_photos;
DROP TABLE IF EXISTS parking_spots;
DROP TABLE IF EXISTS users;

-- =============================================================
-- 1. USERS
--    Covers: SignUp, PhoneLogin, EmailLogin, UserProfile
-- =============================================================
CREATE TABLE users (
  id           INT           NOT NULL AUTO_INCREMENT,
  full_name    VARCHAR(100)  NOT NULL,
  email        VARCHAR(150)  UNIQUE,
  phone        VARCHAR(20)   UNIQUE,
  country_code VARCHAR(5)    NOT NULL DEFAULT '+91',
  user_type    ENUM('parker','host','both') NOT NULL DEFAULT 'parker',
  is_guest     BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  -- At least one of email or phone must be provided
  CONSTRAINT chk_contact CHECK (email IS NOT NULL OR phone IS NOT NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =============================================================
-- 2. PARKING SPOTS
--    Covers: HomeNearbySpots spots array, ListYourSpace form,
--            RenterDashboard host listings
-- =============================================================
CREATE TABLE parking_spots (
  id                INT           NOT NULL AUTO_INCREMENT,
  host_id           INT           NOT NULL,
  title             VARCHAR(200)  NOT NULL,
  address           TEXT          NOT NULL,
  spot_type         ENUM(
                      'Driveway',
                      'Underground',
                      'Private Lot',
                      'Garage',
                      'Driveway (Scooter)'
                    ) NOT NULL DEFAULT 'Driveway',
  suitable_for      ENUM('2-wheeler','4-wheeler','both') NOT NULL DEFAULT 'both',
  price_per_hr      DECIMAL(10,2) NOT NULL,
  rating            DECIMAL(3,2)  NOT NULL DEFAULT 5.00,
  review_count      INT           NOT NULL DEFAULT 0,
  has_cctv          BOOLEAN       NOT NULL DEFAULT FALSE,
  has_security      BOOLEAN       NOT NULL DEFAULT FALSE,
  is_verified       BOOLEAN       NOT NULL DEFAULT FALSE,
  status            ENUM('ACTIVE','HIDDEN','PENDING REVIEW') NOT NULL DEFAULT 'PENDING REVIEW',
  distance_km       DECIMAL(5,2),                -- relative to a search origin
  primary_image_url TEXT,
  bookings_mtd      INT           NOT NULL DEFAULT 0,  -- bookings month-to-date (cached count)
  total_earned      DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  created_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_price   CHECK (price_per_hr >= 0),
  CONSTRAINT chk_rating  CHECK (rating BETWEEN 0.00 AND 5.00)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =============================================================
-- 3. SPOT PHOTOS
--    Covers: ListYourSpace — up to 5 photos per spot
-- =============================================================
CREATE TABLE spot_photos (
  id         INT  NOT NULL AUTO_INCREMENT,
  spot_id    INT  NOT NULL,
  photo_url  TEXT NOT NULL,
  sort_order TINYINT NOT NULL DEFAULT 0,   -- 0 = primary/cover photo

  PRIMARY KEY (id),
  FOREIGN KEY (spot_id) REFERENCES parking_spots(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =============================================================
-- 4. BOOKINGS
--    Covers: BookingForm — date, time range, total price
-- =============================================================
CREATE TABLE bookings (
  id            INT           NOT NULL AUTO_INCREMENT,
  spot_id       INT           NOT NULL,
  user_id       INT           NOT NULL,
  booking_date  DATE          NOT NULL,
  start_time    TIME          NOT NULL,
  end_time      TIME          NOT NULL,
  duration_hrs  DECIMAL(4,2)  NOT NULL,
  total_price   DECIMAL(10,2) NOT NULL,
  status        ENUM('confirmed','cancelled','completed') NOT NULL DEFAULT 'confirmed',
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  FOREIGN KEY (spot_id) REFERENCES parking_spots(id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id) REFERENCES users(id)         ON DELETE RESTRICT,
  CONSTRAINT chk_times       CHECK (end_time > start_time),
  CONSTRAINT chk_duration    CHECK (duration_hrs > 0),
  CONSTRAINT chk_total_price CHECK (total_price >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =============================================================
-- 5. REVIEWS
--    Covers: SpotDetails — rating, comment, linked to a booking
-- =============================================================
CREATE TABLE reviews (
  id          INT     NOT NULL AUTO_INCREMENT,
  spot_id     INT     NOT NULL,
  user_id     INT     NOT NULL,
  booking_id  INT,                          -- nullable: review may exist without booking ref
  rating      TINYINT NOT NULL,
  comment     TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  FOREIGN KEY (spot_id)    REFERENCES parking_spots(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)    REFERENCES users(id)         ON DELETE CASCADE,
  FOREIGN KEY (booking_id) REFERENCES bookings(id)      ON DELETE SET NULL,
  CONSTRAINT chk_rating_range CHECK (rating BETWEEN 1 AND 5),
  -- One review per user per booking
  UNIQUE KEY uq_user_booking_review (user_id, booking_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =============================================================
-- 6. OTP SESSIONS
--    Covers: PhoneLogin / OTPVerification — 6-digit code + expiry
-- =============================================================
CREATE TABLE otp_sessions (
  id         INT         NOT NULL AUTO_INCREMENT,
  phone      VARCHAR(20) NOT NULL,
  otp_code   VARCHAR(6)  NOT NULL,
  expires_at TIMESTAMP   NOT NULL,
  used       BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_otp_phone (phone)        -- fast lookup by phone number
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- =============================================================
-- TRIGGER: Auto-update spot rating & review_count after INSERT
-- =============================================================
DELIMITER $$

CREATE TRIGGER trg_update_spot_rating
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
  UPDATE parking_spots
  SET
    rating       = (SELECT AVG(rating) FROM reviews WHERE spot_id = NEW.spot_id),
    review_count = (SELECT COUNT(*)    FROM reviews WHERE spot_id = NEW.spot_id)
  WHERE id = NEW.spot_id;
END$$

DELIMITER ;
