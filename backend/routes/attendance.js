import express from 'express';
import { query } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';

const router = express.Router();

/**
 * GET /api/attendance
 * Get all attendance records (with optional filtering)
 * Query params: memberId, massScheduleId, status, startDate, endDate
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { memberId, massScheduleId, status, startDate, endDate } = req.query;
    const userRole = req.user.role;
    
    // Members can only see their own attendance
    // Secretary and Admin can see all attendance
    let queryText = `
      SELECT 
        a.attendance_id,
        a.member_id,
        a.mass_schedule_id,
        a.status,
        a.verified_by,
        a.verified_at,
        a.created_at,
        m.first_name,
        m.last_name,
        m.email_address as member_email,
        ms.date as schedule_date,
        ms.time as schedule_time,
        ms.title as schedule_title,
        ua.email_address as verified_by_email
      FROM attendance a
      INNER JOIN member m ON a.member_id = m.member_id
      LEFT JOIN mass_schedule ms ON a.mass_schedule_id = ms.schedule_id
      LEFT JOIN user_account ua ON a.verified_by = ua.user_id
    `;
    
    const params = [];
    const conditions = [];
    
    // If user is Member, only show their own attendance
    if (userRole === 'Member') {
      params.push(req.user.member_id);
      conditions.push(`a.member_id = $${params.length}`);
    }
    
    if (memberId) {
      params.push(memberId);
      conditions.push(`a.member_id = $${params.length}`);
    }
    
    if (massScheduleId) {
      params.push(massScheduleId);
      conditions.push(`a.mass_schedule_id = $${params.length}`);
    }
    
    if (status) {
      params.push(status);
      conditions.push(`a.status = $${params.length}`);
    }
    
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
    
    queryText += ` ORDER BY ms.date DESC, a.created_at DESC`;
    
    const result = await query(queryText, params);
    
    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance records',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /api/attendance/:id
 * Get a specific attendance record by ID
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    
    let queryText = `
      SELECT 
        a.attendance_id,
        a.member_id,
        a.mass_schedule_id,
        a.status,
        a.verified_by,
        a.verified_at,
        a.created_at,
        m.first_name,
        m.last_name,
        m.email_address as member_email,
        ms.date as schedule_date,
        ms.time as schedule_time,
        ms.title as schedule_title,
        ua.email_address as verified_by_email
      FROM attendance a
      INNER JOIN member m ON a.member_id = m.member_id
      LEFT JOIN mass_schedule ms ON a.mass_schedule_id = ms.schedule_id
      LEFT JOIN user_account ua ON a.verified_by = ua.user_id
      WHERE a.attendance_id = $1
    `;
    
    const params = [id];
    
    // If user is Member, only allow access to their own attendance
    if (userRole === 'Member') {
      queryText += ` AND a.member_id = $2`;
      params.push(req.user.member_id);
    }
    
    const result = await query(queryText, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found',
      });
    }
    
    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching attendance record:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance record',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * POST /api/attendance
 * Create a new attendance record (for members to mark their attendance)
 * Body: { massScheduleId }
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const { massScheduleId } = req.body;
    const memberId = req.user.member_id;
    
    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: 'Member ID not found in user account',
      });
    }
    
    if (!massScheduleId) {
      return res.status(400).json({
        success: false,
        message: 'Mass schedule ID is required',
      });
    }
    
    // Check if mass schedule exists
    const scheduleCheck = await query(
      'SELECT schedule_id FROM mass_schedule WHERE schedule_id = $1',
      [massScheduleId]
    );
    
    if (scheduleCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mass schedule not found',
      });
    }
    
    // Insert attendance record
    const result = await query(
      `INSERT INTO attendance (member_id, mass_schedule_id, status)
       VALUES ($1, $2, 'Pending')
       ON CONFLICT (member_id, mass_schedule_id) 
       DO UPDATE SET status = 'Pending', created_at = NOW()
       RETURNING attendance_id, member_id, mass_schedule_id, status, created_at`,
      [memberId, massScheduleId]
    );
    
    return res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating attendance record:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark attendance',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * POST /api/attendance/verify/:id
 * Verify an attendance record (Secretary or Admin only)
 * Body: { status } - 'Verified' or 'Absent'
 */
router.post('/verify/:id', authenticate, requireRole(['Secretary', 'Admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const verifiedBy = req.user.user_id;
    
    if (!status || !['Verified', 'Absent'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "Verified" or "Absent"',
      });
    }
    
    // Check if attendance record exists
    const checkResult = await query(
      'SELECT attendance_id FROM attendance WHERE attendance_id = $1',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found',
      });
    }
    
    // Update attendance record
    const result = await query(
      `UPDATE attendance
       SET status = $1, verified_by = $2, verified_at = NOW()
       WHERE attendance_id = $3
       RETURNING attendance_id, member_id, mass_schedule_id, status, verified_by, verified_at`,
      [status, verifiedBy, id]
    );
    
    return res.json({
      success: true,
      message: `Attendance ${status.toLowerCase()} successfully`,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error verifying attendance:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify attendance',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /api/attendance/stats
 * Get attendance statistics (Secretary or Admin only)
 * Query params: startDate, endDate
 */
router.get('/stats/overview', authenticate, requireRole(['Secretary', 'Admin']), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateCondition = '';
    const params = [];
    
    if (startDate && endDate) {
      params.push(startDate, endDate);
      dateCondition = `WHERE ms.date BETWEEN $1 AND $2`;
    } else if (startDate) {
      params.push(startDate);
      dateCondition = `WHERE ms.date >= $1`;
    } else if (endDate) {
      params.push(endDate);
      dateCondition = `WHERE ms.date <= $1`;
    }
    
    // Get total attendance count
    const totalResult = await query(
      `SELECT COUNT(*) as total
       FROM attendance a
       LEFT JOIN mass_schedule ms ON a.mass_schedule_id = ms.schedule_id
       ${dateCondition}`,
      params
    );
    
    // Get verified count
    const verifiedResult = await query(
      `SELECT COUNT(*) as verified
       FROM attendance a
       LEFT JOIN mass_schedule ms ON a.mass_schedule_id = ms.schedule_id
       ${dateCondition}
       AND a.status = 'Verified'`,
      params
    );
    
    // Get pending count
    const pendingResult = await query(
      `SELECT COUNT(*) as pending
       FROM attendance a
       LEFT JOIN mass_schedule ms ON a.mass_schedule_id = ms.schedule_id
       ${dateCondition}
       AND a.status = 'Pending'`,
      params
    );
    
    // Get absent count
    const absentResult = await query(
      `SELECT COUNT(*) as absent
       FROM attendance a
       LEFT JOIN mass_schedule ms ON a.mass_schedule_id = ms.schedule_id
       ${dateCondition}
       AND a.status = 'Absent'`,
      params
    );
    
    return res.json({
      success: true,
      data: {
        total: parseInt(totalResult.rows[0].total),
        verified: parseInt(verifiedResult.rows[0].verified),
        pending: parseInt(pendingResult.rows[0].pending),
        absent: parseInt(absentResult.rows[0].absent),
      },
    });
  } catch (error) {
    console.error('Error fetching attendance statistics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router;

