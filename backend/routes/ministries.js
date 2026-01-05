import express from "express";
import { query, getClient } from "../config/database.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";

const router = express.Router();

/**
 * GET /api/ministries
 * Get all ministries (authenticated users)
 * Query params: status (optional filter)
 */
router.get("/", authenticate, async (req, res) => {
  try {
    const { status } = req.query;

    let queryText = `
      SELECT 
        m.ministry_id,
        m.name,
        m.description,
        m.leader_id,
        m.status,
        m.created_at,
        m.updated_at,
        ua.email_address as leader_email,
        CASE 
          WHEN ma.first_name IS NULL AND ma.last_name IS NULL THEN ''
          ELSE TRIM(COALESCE(CONCAT(ma.first_name, ' ', ma.last_name), ''))
        END as leader_name,
        COUNT(DISTINCT mm.member_id) as member_count
      FROM ministry m
      LEFT JOIN user_account ua ON m.leader_id = ua.user_id
      LEFT JOIN member ma ON ua.member_id = ma.member_id
      LEFT JOIN ministry_member mm ON m.ministry_id = mm.ministry_id
    `;

    const params = [];
    const conditions = [];

    if (status) {
      params.push(status);
      conditions.push(`m.status = $${params.length}`);
    }

    if (conditions.length > 0) {
      queryText += ` WHERE ${conditions.join(" AND ")}`;
    }

    queryText += ` GROUP BY m.ministry_id, m.name, m.description, m.leader_id, m.status, m.created_at, m.updated_at, ua.email_address, ma.first_name, ma.last_name`;
    queryText += ` ORDER BY m.name ASC`;

    const result = await query(queryText, params);

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching ministries:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch ministries",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * GET /api/ministries/my-ministries
 * Get ministries the current user is a member of (authenticated users)
 * NOTE: Must be defined before /:id route to avoid route conflict
 */
router.get("/my-ministries", authenticate, async (req, res) => {
  try {
    const member_id = req.user.member_id;

    if (!member_id) {
      return res.status(400).json({
        success: false,
        message: "User is not associated with a member account",
      });
    }

    const result = await query(
      `SELECT 
        m.ministry_id,
        m.name,
        m.description,
        m.leader_id,
        m.status,
        m.created_at,
        m.updated_at,
        ua.email_address as leader_email,
        CASE 
          WHEN ma.first_name IS NULL AND ma.last_name IS NULL THEN ''
          ELSE TRIM(COALESCE(CONCAT(ma.first_name, ' ', ma.last_name), ''))
        END as leader_name,
        mm.joined_at
      FROM ministry_member mm
      INNER JOIN ministry m ON mm.ministry_id = m.ministry_id
      LEFT JOIN user_account ua ON m.leader_id = ua.user_id
      LEFT JOIN member ma ON ua.member_id = ma.member_id
      WHERE mm.member_id = $1
      ORDER BY mm.joined_at DESC`,
      [member_id]
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching my ministries:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch my ministries",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * GET /api/ministries/:id
 * Get ministry details with member count (authenticated users)
 */
router.get("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT 
        m.ministry_id,
        m.name,
        m.description,
        m.leader_id,
        m.status,
        m.created_at,
        m.updated_at,
        ua.email_address as leader_email,
        CASE 
          WHEN ma.first_name IS NULL AND ma.last_name IS NULL THEN ''
          ELSE TRIM(COALESCE(CONCAT(ma.first_name, ' ', ma.last_name), ''))
        END as leader_name,
        COUNT(DISTINCT mm.member_id) as member_count
       FROM ministry m
       LEFT JOIN user_account ua ON m.leader_id = ua.user_id
       LEFT JOIN member ma ON ua.member_id = ma.member_id
       LEFT JOIN ministry_member mm ON m.ministry_id = mm.ministry_id
       WHERE m.ministry_id = $1
       GROUP BY m.ministry_id, m.name, m.description, m.leader_id, m.status, m.created_at, m.updated_at, ua.email_address, ma.first_name, ma.last_name`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Ministry not found",
      });
    }

    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching ministry:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch ministry",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * GET /api/ministries/:id/members
 * Get ministry roster (authenticated users)
 */
router.get("/:id/members", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ministry exists
    const ministryCheck = await query(
      "SELECT ministry_id FROM ministry WHERE ministry_id = $1",
      [id]
    );

    if (ministryCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Ministry not found",
      });
    }

    const result = await query(
      `SELECT 
        mm.ministry_member_id,
        mm.member_id,
        mm.joined_at,
        m.first_name,
        m.last_name,
        m.email_address,
        m.contact_number,
        ua.user_id
       FROM ministry_member mm
       INNER JOIN member m ON mm.member_id = m.member_id
       LEFT JOIN user_account ua ON m.member_id = ua.member_id
       WHERE mm.ministry_id = $1
       ORDER BY mm.joined_at DESC`,
      [id]
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching ministry members:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch ministry members",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * POST /api/ministries
 * Create ministry (Administrative Pastor only)
 * Body: { name, description, leader_id, status }
 */
router.post(
  "/",
  authenticate,
  requireRole(["Administrative Pastor"]),
  async (req, res) => {
    try {
      const { name, description, leader_id, status } = req.body;

      // Validate required fields
      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Ministry name is required",
        });
      }

      // Validate status if provided
      if (status && !["Active", "Inactive"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be either "Active" or "Inactive"',
        });
      }

      // Validate leader_id if provided (check if user exists)
      if (leader_id) {
        const leaderCheck = await query(
          "SELECT user_id FROM user_account WHERE user_id = $1",
          [leader_id]
        );

        if (leaderCheck.rows.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Leader user not found",
          });
        }
      }

      // Insert new ministry
      const result = await query(
        `INSERT INTO ministry (name, description, leader_id, status)
       VALUES ($1, $2, $3, $4)
       RETURNING ministry_id, name, description, leader_id, status, created_at`,
        [
          name.trim(),
          description || null,
          leader_id || null,
          status || "Active",
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Ministry created successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error creating ministry:", error);

      // Handle unique constraint violation
      if (error.code === "23505") {
        return res.status(409).json({
          success: false,
          message: "A ministry with this name already exists",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to create ministry",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

/**
 * PUT /api/ministries/:id
 * Update ministry (Administrative Pastor only)
 * Body: { name, description, leader_id, status }
 */
router.put(
  "/:id",
  authenticate,
  requireRole(["Administrative Pastor"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, leader_id, status } = req.body;

      // Check if ministry exists
      const checkResult = await query(
        "SELECT ministry_id FROM ministry WHERE ministry_id = $1",
        [id]
      );

      if (checkResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Ministry not found",
        });
      }

      // Validate name if provided
      if (name !== undefined && (!name || !name.trim())) {
        return res.status(400).json({
          success: false,
          message: "Ministry name cannot be empty",
        });
      }

      // Validate status if provided
      if (status && !["Active", "Inactive"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be either "Active" or "Inactive"',
        });
      }

      // Validate leader_id if provided (and not null/empty)
      if (leader_id !== undefined && leader_id !== null && leader_id !== "") {
        const leaderCheck = await query(
          "SELECT user_id FROM user_account WHERE user_id = $1",
          [leader_id]
        );

        if (leaderCheck.rows.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Leader user not found",
          });
        }
      }

      // Build update query dynamically based on provided fields
      const updates = [];
      const params = [];
      let paramIndex = 1;

      if (name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        params.push(name.trim());
      }

      if (description !== undefined) {
        updates.push(`description = $${paramIndex++}`);
        params.push(description || null);
      }

      if (leader_id !== undefined) {
        updates.push(`leader_id = $${paramIndex++}`);
        // Convert empty string to null
        params.push(leader_id === "" ? null : leader_id || null);
      }

      if (status !== undefined) {
        updates.push(`status = $${paramIndex++}`);
        params.push(status);
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No fields to update",
        });
      }

      updates.push(`updated_at = NOW()`);
      params.push(id);

      const result = await query(
        `UPDATE ministry
       SET ${updates.join(", ")}
       WHERE ministry_id = $${paramIndex}
       RETURNING ministry_id, name, description, leader_id, status, updated_at`,
        params
      );

      return res.json({
        success: true,
        message: "Ministry updated successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Error updating ministry:", error);

      // Handle unique constraint violation
      if (error.code === "23505") {
        return res.status(409).json({
          success: false,
          message: "A ministry with this name already exists",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to update ministry",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

/**
 * DELETE /api/ministries/:id
 * Delete ministry (Administrative Pastor only)
 * Cascade deletes applications and ministry_member records
 */
router.delete(
  "/:id",
  authenticate,
  requireRole(["Administrative Pastor"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Check if ministry exists
      const checkResult = await query(
        "SELECT ministry_id, name FROM ministry WHERE ministry_id = $1",
        [id]
      );

      if (checkResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Ministry not found",
        });
      }

      // Delete ministry (cascade will handle ministry_application and ministry_member)
      await query("DELETE FROM ministry WHERE ministry_id = $1", [id]);

      return res.json({
        success: true,
        message: "Ministry deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting ministry:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete ministry",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
);

export default router;
