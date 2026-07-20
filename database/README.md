# Parkee — Database Setup Guide

This directory contains all SQL files for the Parkee parking app database.

| File | Purpose |
|---|---|
| `schema.sql` | Creates all 6 tables + trigger |
| `seed.sql` | Inserts sample data (mirrors app defaults) |

---

## Database Schema Overview

```
users
 └─< parking_spots (host_id)
       └─< spot_photos
       └─< bookings  (user_id)
             └─< reviews
otp_sessions  (standalone)
```

---

## Option 1 — MySQL / MariaDB

### Prerequisites
- MySQL 8+ or MariaDB 10.3+ installed

### Steps

```bash
# 1. Login to MySQL
mysql -u root -p

# 2. Create the database
CREATE DATABASE parkee CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE parkee;

# 3. Run schema (from project root)
mysql -u root -p parkee < database/schema.sql

# 4. Run seed data
mysql -u root -p parkee < database/seed.sql
```

### Verify
```sql
USE parkee;
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM parking_spots;
```

---

## Option 2 — PostgreSQL

The schema uses MySQL-specific syntax. Make these small changes to `schema.sql`:

| MySQL | PostgreSQL |
|---|---|
| `AUTO_INCREMENT` | `SERIAL` or `GENERATED ALWAYS AS IDENTITY` |
| `ENUM(...)` | `VARCHAR(50)` with `CHECK` constraint |
| `BOOLEAN` | `BOOLEAN` ✅ (same) |
| `ON UPDATE CURRENT_TIMESTAMP` | Use a trigger instead |
| `ENGINE=InnoDB DEFAULT CHARSET=utf8mb4` | Remove entirely |
| `DELIMITER $$` | Not needed — use `$$` in `DO $$` blocks |

```bash
# Create DB and run
psql -U postgres -c "CREATE DATABASE parkee;"
psql -U postgres -d parkee -f database/schema.sql
psql -U postgres -d parkee -f database/seed.sql
```

---

## Option 3 — SQLite (simplest, no server needed)

Make these changes to `schema.sql`:
- Remove `ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
- Replace `AUTO_INCREMENT` → _(remove, SQLite handles it automatically with `INTEGER PRIMARY KEY`)_
- Remove `DELIMITER $$` block — replace trigger with application logic

```bash
# Install SQLite (if not installed)
# Windows: https://sqlite.org/download.html

# Create DB and run schema
sqlite3 database/parkee.db < database/schema.sql
sqlite3 database/parkee.db < database/seed.sql

# Verify
sqlite3 database/parkee.db ".tables"
sqlite3 database/parkee.db "SELECT * FROM parking_spots;"
```

---

## Tables Reference

### `users`
| Column | Type | Notes |
|---|---|---|
| id | INT | Primary key |
| full_name | VARCHAR(100) | Required |
| email | VARCHAR(150) | Unique |
| phone | VARCHAR(20) | Unique |
| country_code | VARCHAR(5) | Default `+91` |
| user_type | ENUM | `parker`, `host`, `both` |
| is_guest | BOOLEAN | Guest login flag |

### `parking_spots`
| Column | Type | Notes |
|---|---|---|
| id | INT | Primary key |
| host_id | INT | FK → users |
| title | VARCHAR(200) | Display name |
| address | TEXT | Full address |
| spot_type | ENUM | Driveway / Underground / etc. |
| suitable_for | ENUM | 2-wheeler / 4-wheeler / both |
| price_per_hr | DECIMAL | ₹ per hour |
| rating | DECIMAL(3,2) | Auto-updated by trigger |
| has_cctv | BOOLEAN | |
| has_security | BOOLEAN | |
| is_verified | BOOLEAN | |
| status | ENUM | ACTIVE / HIDDEN / PENDING REVIEW |

### `bookings`
| Column | Type | Notes |
|---|---|---|
| id | INT | Primary key |
| spot_id | INT | FK → parking_spots |
| user_id | INT | FK → users |
| booking_date | DATE | |
| start_time | TIME | |
| end_time | TIME | Must be > start_time |
| duration_hrs | DECIMAL | |
| total_price | DECIMAL | |
| status | ENUM | confirmed / cancelled / completed |

### `reviews`
| Column | Type | Notes |
|---|---|---|
| id | INT | Primary key |
| spot_id | INT | FK → parking_spots |
| user_id | INT | FK → users |
| booking_id | INT | FK → bookings (nullable) |
| rating | TINYINT | 1–5 |
| comment | TEXT | |

### `spot_photos`
| Column | Type | Notes |
|---|---|---|
| id | INT | Primary key |
| spot_id | INT | FK → parking_spots |
| photo_url | TEXT | |
| sort_order | TINYINT | 0 = primary/cover photo |

### `otp_sessions`
| Column | Type | Notes |
|---|---|---|
| id | INT | Primary key |
| phone | VARCHAR(20) | |
| otp_code | VARCHAR(6) | 6-digit code |
| expires_at | TIMESTAMP | 10 min from creation |
| used | BOOLEAN | Consumed flag |
