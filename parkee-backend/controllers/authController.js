const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'parkee_super_secret_jwt_key_2026';

class AuthController {
  static async signup(req, res) {
    try {
      const { name, email, phone, password } = req.body;

      // 1. Basic validation
      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Full Name is required.' });
      }

      if (!email || !email.includes('@')) {
        return res.status(400).json({ success: false, message: 'Valid Email address is required.' });
      }

      if (!phone || phone.trim().length < 8) {
        return res.status(400).json({ success: false, message: 'Valid Mobile phone number is required.' });
      }

      if (!password || password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
      }

      // 2. Check existing email or phone
      const existingEmail = await UserModel.findUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }

      const existingPhone = await UserModel.findUserByPhone(phone);
      if (existingPhone) {
        return res.status(400).json({ success: false, message: 'An account with this phone number already exists.' });
      }

      // 3. Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // 4. Insert user into database
      const newUser = await UserModel.createUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        passwordHash,
        role: 'parker'
      });

      // 5. Generate JWT Token
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: `Welcome to PARKEE, ${newUser.name}! Your account has been created.`,
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role
        }
      });
    } catch (error) {
      console.error('[Signup Error]', error);
      return res.status(500).json({ success: false, message: 'Server error during user registration.' });
    }
  }

  static async getUsers(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      return res.status(200).json({
        success: true,
        count: users.length,
        users
      });
    } catch (error) {
      console.error('[Get Users Error]', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch registered users.' });
    }
  }
}

module.exports = AuthController;
