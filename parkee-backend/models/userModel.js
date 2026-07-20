const db = require('../config/db');

class UserModel {
  static async createUser({ name, email, phone, passwordHash, role = 'parker' }) {
    const text = `
      INSERT INTO users (name, email, phone, password_hash, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, phone, role, created_at
    `;
    const params = [name, email.toLowerCase(), phone, passwordHash, role];
    const result = await db.query(text, params);
    return result.rows[0];
  }

  static async findUserByEmail(email) {
    const text = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(text, [email.toLowerCase()]);
    return result.rows[0] || null;
  }

  static async findUserByPhone(phone) {
    const text = 'SELECT * FROM users WHERE phone = $1';
    const result = await db.query(text, [phone]);
    return result.rows[0] || null;
  }

  static async getAllUsers() {
    const text = 'SELECT id, name, email, phone, role, created_at FROM users ORDER BY id DESC';
    const result = await db.query(text);
    return result.rows;
  }
}

module.exports = UserModel;
