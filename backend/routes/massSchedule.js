import express from 'express';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = express.Router();

/**
 * GET /api/mass-schedules
 * Get all mass schedules (with optional date filtering)
 * Query params: startDate, endDate
 */
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let queryText = `
      SELECT 
        ms.schedule_id,
        ms.date,
        ms.time,
        ms.title,
        ms.pastor,
        ms.description,
        ms.created_at,
        ms.updated_at,
        ua.email_address as created_by_email
      FROM mass_schedule ms
      LEFT JOIN user_account ua ON ms.created_by = ua.user_id
    `;
    
    const params = [];
    const conditions = [];
    
    if (startDate) {
      params.push(startDate);
      conditions.push(`ms.date >= $${params.length}`);
    }
    
    if (endDate) {
      params.push(endDate);
      conditions.push(`ms.date <= $${params.length}`);
    }
    
    if (conditions.length > 0) {
      queryText += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    queryText += ` ORDER BY ms.date ASC, ms.time ASC`;
    
    const result = await query(queryText, params);
    
    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching mass schedules:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch mass schedules',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /api/mass-schedules/:id
 * Get a specific mass schedule by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(
      `SELECT 
        ms.schedule_id,
        ms.date,
        ms.time,
        ms.title,
        ms.pastor,
        ms.description,
        ms.created_at,
        ms.updated_at,
        ua.email_address as created_by_email
       FROM mass_schedule ms
       LEFT JOIN user_account ua ON ms.created_by = ua.user_id
       WHERE ms.schedule_id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mass schedule not found',
      });
    }
    
    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching mass schedule:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch mass schedule',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * POST /api/mass-schedules
 * Create a new mass schedule (Secretary or Admin only)
 * Body: { date, time, title, pastor, description }
 */
router.post('/', authenticate, requireRole(['Secretary', 'Administrative Pastor']), async (req, res) => {
  try {
    const { date, time, title, pastor, description } = req.body;
    const createdBy = req.user.user_id;
    
    // Validate required fields
    if (!date || !time || !title) {
      return res.status(400).json({
        success: false,
        message: 'Date, time, and title are required',
      });
    }
    
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD',
      });
    }
    
    // Validate time format
    const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;
    if (!timeRegex.test(time)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time format. Use HH:MM or HH:MM:SS',
      });
    }
    
    // Insert new mass schedule
    const result = await query(
      `INSERT INTO mass_schedule (date, time, title, pastor, description, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING schedule_id, date, time, title, pastor, description, created_at`,
      [date, time, title, pastor || null, description || null, createdBy]
    );
    
    return res.status(201).json({
      success: true,
      message: 'Mass schedule created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating mass schedule:', error);
    
    // Handle unique constraint violation
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'A mass schedule already exists for this date and time',
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to create mass schedule',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * PUT /api/mass-schedules/:id
 * Update a mass schedule (Secretary or Admin only)
 * Body: { date, time, title, pastor, description }
 */
router.put('/:id', authenticate, requireRole(['Secretary', 'Administrative Pastor']), async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, title, pastor, description } = req.body;
    
    // Validate required fields
    if (!date || !time || !title) {
      return res.status(400).json({
        success: false,
        message: 'Date, time, and title are required',
      });
    }
    
    // Check if schedule exists
    const checkResult = await query(
      'SELECT schedule_id FROM mass_schedule WHERE schedule_id = $1',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mass schedule not found',
      });
    }
    
    // Update mass schedule
    const result = await query(
      `UPDATE mass_schedule
       SET date = $1, time = $2, title = $3, pastor = $4, description = $5, updated_at = NOW()
       WHERE schedule_id = $6
       RETURNING schedule_id, date, time, title, pastor, description, updated_at`,
      [date, time, title, pastor || null, description || null, id]
    );
    
    return res.json({
      success: true,
      message: 'Mass schedule updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating mass schedule:', error);
    
    // Handle unique constraint violation
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'A mass schedule already exists for this date and time',
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to update mass schedule',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * DELETE /api/mass-schedules/:id
 * Delete a mass schedule (Secretary or Admin only)
 */
router.delete('/:id', authenticate, requireRole(['Secretary', 'Administrative Pastor']), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if schedule exists
    const checkResult = await query(
      'SELECT schedule_id FROM mass_schedule WHERE schedule_id = $1',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mass schedule not found',
      });
    }
    
    // Delete mass schedule
    await query('DELETE FROM mass_schedule WHERE schedule_id = $1', [id]);
    
    return res.json({
      success: true,
      message: 'Mass schedule deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting mass schedule:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete mass schedule',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router;

