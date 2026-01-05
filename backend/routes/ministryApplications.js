import express from "express";
import { query, getClient } from "../config/database.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = express.Router();

/**
 * POST /api/ministry-applications
 * Submit application (Member only)
 * Body: { ministry_id, reason, experience }
 */
router.post("/", authenticate, requireRole(["Member"]), async (req, res) => {
  const client = await getClient();

  try {
    const { ministry_id, reason, experience } = req.body;
    const member_id = req.user.member_id;

    // Validate required fields
    if (!ministry_id || !reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Ministry ID and reason are required",
      });
    }

    // Check if ministry exists and is active
    const ministryCheck = await query(
      "SELECT ministry_id, status FROM ministry WHERE ministry_id = $1",
      [ministry_id]
    );

    if (ministryCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Ministry not found",
      });
    }

    if (ministryCheck.rows[0].status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "Cannot apply to an inactive ministry",
      });
    }

    // Check if member already has an application for this ministry
    const existingApp = await query(
      "SELECT application_id, status FROM ministry_application WHERE member_id = $1 AND ministry_id = $2",
      [member_id, ministry_id]
    );

    if (existingApp.rows.length > 0) {
      const app = existingApp.rows[0];
      return res.status(409).json({
        success: false,
        message: `You already have an application for this ministry (Status: ${app.status})`,
        data: { application_id: app.application_id, status: app.status },
      });
    }

    // Check if member is already in this ministry
    const memberCheck = await query(
      "SELECT ministry_member_id FROM ministry_member WHERE member_id = $1 AND ministry_id = $2",
      [member_id, ministry_id]
    );

    if (memberCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "You are already a member of this ministry",
      });
    }

    // Start transaction
    await client.query("BEGIN");

    try {
      // Insert new application
      const result = await client.query(
        `INSERT INTO ministry_application (member_id, ministry_id, reason, experience, status)
         VALUES ($1, $2, $3, $4, 'Pending')
         RETURNING application_id, member_id, ministry_id, status, reason, experience, applied_at`,
        [member_id, ministry_id, reason.trim(), experience || null]
      );

      await client.query("COMMIT");

      return res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        data: result.rows[0],
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error submitting application:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit application",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * GET /api/ministry-applications
 * List applications (Members see own, Admins see all)
 * Query params: status, ministry_id, member_id (admin only)
 */
router.get("/", authenticate, async (req, res) => {
  try {
    const { status, ministry_id, member_id } = req.query;
    const userRole = req.user.role;
    const userMemberId = req.user.member_id;

    let queryText = `
      SELECT 
        ma.application_id,
        ma.member_id,
        ma.ministry_id,
        ma.status,
        ma.reason,
        ma.experience,
        ma.applied_at,
        ma.reviewed_by,
        ma.reviewed_at,
        ma.rejection_reason,
        m.first_name,
        m.last_name,
        m.email_address as member_email,
        m.contact_number,
        min.name as ministry_name,
        COALESCE(CONCAT(ua.first_name, ' ', ua.last_name), '') as reviewer_name
      FROM ministry_application ma
      INNER JOIN member m ON ma.member_id = m.member_id
      INNER JOIN ministry min ON ma.ministry_id = min.ministry_id
      LEFT JOIN user_account rev_ua ON ma.reviewed_by = rev_ua.user_id
      LEFT JOIN member ua ON rev_ua.member_id = ua.member_id
    `;

    const params = [];
    const conditions = [];

    // Members can only see their own applications
    // Admins can see all applications
    if (userRole === "Member") {
      params.push(userMemberId);
      conditions.push(`ma.member_id = $${params.length}`);
    } else if (member_id) {
      // Admin can filter by member_id
      params.push(member_id);
      conditions.push(`ma.member_id = $${params.length}`);
    }

    if (status) {
      params.push(status);
      conditions.push(`ma.status = $${params.length}`);
    }

    if (ministry_id) {
      params.push(ministry_id);
      conditions.push(`ma.ministry_id = $${params.length}`);
    }

    if (conditions.length > 0) {
      queryText += ` WHERE ${conditions.join(" AND ")}`;
    }

    queryText += ` ORDER BY ma.applied_at DESC`;

    const result = await query(queryText, params);

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * GET /api/ministry-applications/:id
 * Get application details
 */
router.get("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const userMemberId = req.user.member_id;

    const result = await query(
      `SELECT 
        ma.application_id,
        ma.member_id,
        ma.ministry_id,
        ma.status,
        ma.reason,
        ma.experience,
        ma.applied_at,
        ma.reviewed_by,
        ma.reviewed_at,
        ma.rejection_reason,
        m.first_name,
        m.last_name,
        m.email_address as member_email,
        m.contact_number,
        min.name as ministry_name,
        min.description as ministry_description,
        COALESCE(CONCAT(ua.first_name, ' ', ua.last_name), '') as reviewer_name
       FROM ministry_application ma
       INNER JOIN member m ON ma.member_id = m.member_id
       INNER JOIN ministry min ON ma.ministry_id = min.ministry_id
       LEFT JOIN user_account rev_ua ON ma.reviewed_by = rev_ua.user_id
       LEFT JOIN member ua ON rev_ua.member_id = ua.member_id
       WHERE ma.application_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const application = result.rows[0];

    // Members can only see their own applications
    if (userRole === "Member" && application.member_id !== userMemberId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("Error fetching application:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch application",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * PUT /api/ministry-applications/:id/approve
 * Approve application (Administrative Pastor only)
 * Adds member to ministry_member table
 */
router.put(
  "/:id/approve",
  authenticate,
  requireRole(["Administrative Pastor"]),
  async (req, res) => {
    const client = await getClient();

    try {
      const { id } = req.params;
      const reviewerId = req.user.user_id;

      // Start transaction
      await client.query("BEGIN");

      try {
        // Check if application exists and is pending
        const appCheck = await client.query(
          "SELECT application_id, member_id, ministry_id, status FROM ministry_application WHERE application_id = $1",
          [id]
        );

        if (appCheck.rows.length === 0) {
          await client.query("ROLLBACK");
          return res.status(404).json({
            success: false,
            message: "Application not found",
          });npm 
        }

        const application = appCheck.rows[0];

        if (
          application.status !== "Pending" &&
          application.status !== "Request Info"
        ) {
          await client.query("ROLLBACK");
          return res.status(400).json({
            success: false,
            message: `Cannot approve application with status: ${application.status}`,
          });
        }

        // Check if member is already in ministry
        const memberCheck = await client.query(
          "SELECT ministry_member_id FROM ministry_member WHERE member_id = $1 AND ministry_id = $2",
          [application.member_id, application.ministry_id]
        );

        if (memberCheck.rows.length > 0) {
          await client.query("ROLLBACK");
          return res.status(409).json({
            success: false,
            message: "Member is already in this ministry",
          });
        }

        // Update application status
        await client.query(
          `UPDATE ministry_application
         SET status = 'Approved', reviewed_by = $1, reviewed_at = NOW()
         WHERE application_id = $2`,
          [reviewerId, id]
        );

        // Add member to ministry_member table
        await client.query(
          `INSERT INTO ministry_member (ministry_id, member_id)
         VALUES ($1, $2)
         ON CONFLICT (ministry_id, member_id) DO NOTHING`,
          [application.ministry_id, application.member_id]
        );

        await client.query("COMMIT");

        return res.json({
          success: true,
          message: "Application approved and member added to ministry",
        });
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error approving application:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to approve application",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

/**
 * PUT /api/ministry-applications/:id/reject
 * Reject application (Administrative Pastor only)
 * Body: { rejection_reason }
 */
router.put(
  "/:id/reject",
  authenticate,
  requireRole(["Administrative Pastor"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { rejection_reason } = req.body;
      const reviewerId = req.user.user_id;

      // Validate rejection reason
      if (!rejection_reason || !rejection_reason.trim()) {
        return res.status(400).json({
          success: false,
          message: "Rejection reason is required",
        });
      }

      // Check if application exists
      const appCheck = await query(
        "SELECT application_id, status FROM ministry_application WHERE application_id = $1",
        [id]
      );

      if (appCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Application not found",
        });
      }

      if (
        appCheck.rows[0].status !== "Pending" &&
        appCheck.rows[0].status !== "Request Info"
      ) {
        return res.status(400).json({
          success: false,
          message: `Cannot reject application with status: ${appCheck.rows[0].status}`,
        });
      }

      // Update application status
      const result = await query(
        `UPDATE ministry_application
       SET status = 'Rejected', 
           reviewed_by = $1, 
           reviewed_at = NOW(),
           rejection_reason = $2
       WHERE application_id = $3
       RETURNING application_id, status, rejection_reason, reviewed_at`,
        [reviewerId, rejection_reason.trim(), id]
      );

      return res.json({
        success: true,
        message: "Application rejected",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error rejecting application:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to reject application",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

export default router;
