import express from 'express';
import { query, getClient } from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 * Body: { email, password, lastName, firstName, middleName, birthDate, gender, province, city, barangay, street, phone }
 */
router.post('/register', async (req, res) => {
  const client = await getClient();
  
  try {
    // Extract and validate input data
    const {
      email,
      password,
      lastName,
      firstName,
      middleName,
      birthDate,
      gender,
      province,
      city,
      barangay,
      street,
      phone
    } = req.body;

    // Validate required fields
    if (!email || !password || !lastName || !firstName || !birthDate || !gender) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email, password, lastName, firstName, birthDate, and gender are required',
      });
    }

    // Validate email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Validate password length (minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Start transaction
    await client.query('BEGIN');

    try {
      // Check if email already exists
      const emailCheck = await client.query(
        'SELECT user_id FROM user_account WHERE email_address = $1',
        [email]
      );

      if (emailCheck.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          success: false,
          message: 'Email address already registered',
        });
      }

      // Combine address fields into a single TEXT field
      const addressParts = [];
      if (street) addressParts.push(street);
      if (barangay) addressParts.push(barangay);
      if (city) addressParts.push(city);
      if (province) addressParts.push(province);
      const fullAddress = addressParts.join(', ');

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create member record
      const memberResult = await client.query(
        `INSERT INTO member (
          last_name, first_name, middle_name, 
          birthdate, gender, contact_number, 
          email_address, address
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING member_id`,
        [
          lastName,
          firstName,
          middleName || null,
          birthDate,
          gender.charAt(0).toUpperCase(), // Store as single character (M/F)
          phone || null,
          email,
          fullAddress || null,
        ]
      );

      const memberId = memberResult.rows[0].member_id;

      // Create user_account record with Member role (default role for new registrations)
      const userResult = await client.query(
        `INSERT INTO user_account (member_id, email_address, password_hash, role, is_active)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING user_id`,
        [memberId, email, passwordHash, 'Member', true]
      );

      const userId = userResult.rows[0].user_id;

      // Commit transaction
      await client.query('COMMIT');

      // Return success response (don't send password or sensitive data)
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user_id: userId,
          email: email,
        },
      });
    } catch (error) {
      // Rollback transaction on error
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Registration error:', error);

    // Handle specific database errors
    if (error.code === '23505') {
      // Unique constraint violation
      return res.status(409).json({
        success: false,
        message: 'Email address already registered',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * POST /api/auth/login
 * Login user and return JWT token
 * Body: { email, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user by email
    const userResult = await query(
      `SELECT ua.user_id, ua.email_address, ua.password_hash, ua.is_active, ua.member_id, ua.role,
              m.first_name, m.last_name
       FROM user_account ua
       LEFT JOIN member m ON ua.member_id = m.member_id
       WHERE ua.email_address = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = userResult.rows[0];

    // Check if account is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive. Please contact administrator.',
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Get user role (stored directly in user_account table)
    const role = user.role;

    // Generate JWT token
    const tokenPayload = {
      user_id: user.user_id,
      email: user.email_address,
      member_id: user.member_id,
      role: role,
    };

    const token = generateToken(tokenPayload);

    // Return token and user info
    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token: token,
        user: {
          user_id: user.user_id,
          email: user.email_address,
          member_id: user.member_id,
          first_name: user.first_name,
          last_name: user.last_name,
          role: role,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user info
 * Requires: Authentication middleware
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const userId = req.user.user_id;

    // Get user info with member details
    const userResult = await query(
      `SELECT ua.user_id, ua.email_address, ua.is_active, ua.member_id, ua.role,
              m.first_name, m.last_name, m.middle_name, m.birthdate, 
              m.gender, m.contact_number, m.email_address as member_email, m.address
       FROM user_account ua
       LEFT JOIN member m ON ua.member_id = m.member_id
       WHERE ua.user_id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const user = userResult.rows[0];

    // Return user info
    return res.json({
      success: true,
      data: {
        user_id: user.user_id,
        email: user.email_address,
        member_id: user.member_id,
        first_name: user.first_name,
        last_name: user.last_name,
        middle_name: user.middle_name,
        birthdate: user.birthdate,
        gender: user.gender,
        contact_number: user.contact_number,
        address: user.address,
        role: user.role,
        is_active: user.is_active,
      },
    });
  } catch (error) {
    console.error('Get user info error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user information',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router;

