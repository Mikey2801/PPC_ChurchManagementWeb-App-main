import { query } from "../config/database.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Create all required database tables
 */
const createTables = async () => {
  try {
    console.log("========================================");
    console.log("Creating database tables...");
    console.log("========================================\n");

    // Create member table
    console.log("Creating member table...");
    await query(`
      CREATE TABLE IF NOT EXISTS member (
        member_id BIGSERIAL PRIMARY KEY,
        last_name VARCHAR(30),
        first_name VARCHAR(30),
        middle_name VARCHAR(30),
        birthdate DATE,
        gender CHAR(1),
        contact_number VARCHAR(11),
        email_address VARCHAR(50),
        address TEXT
      )
    `);
    console.log("✓ Member table created");

    // Create user_account table with role column (simplified - one role per user)
    console.log("Creating user_account table...");
    await query(`
      CREATE TABLE IF NOT EXISTS user_account (
        user_id BIGSERIAL PRIMARY KEY,
        member_id BIGINT UNIQUE NOT NULL REFERENCES member(member_id) ON DELETE CASCADE,
        email_address VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(30) NOT NULL DEFAULT 'Member',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT check_role CHECK (role IN ('Administrative Pastor', 'Treasurer', 'Secretary', 'Member'))
      )
    `);
    console.log("✓ User_account table created (with role column)");

    // Create ministry table
    console.log("Creating ministry table...");
    await query(`
      CREATE TABLE IF NOT EXISTS ministry (
        ministry_id BIGSERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        leader_id BIGINT REFERENCES user_account(user_id) ON DELETE SET NULL,
        status VARCHAR(20) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP,
        CONSTRAINT check_status CHECK (status IN ('Active', 'Inactive'))
      )
    `);
    console.log("✓ Ministry table created");

    // Create ministry_application table
    console.log("Creating ministry_application table...");
    await query(`
      CREATE TABLE IF NOT EXISTS ministry_application (
        application_id BIGSERIAL PRIMARY KEY,
        member_id BIGINT NOT NULL REFERENCES member(member_id) ON DELETE CASCADE,
        ministry_id BIGINT NOT NULL REFERENCES ministry(ministry_id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'Pending',
        reason TEXT NOT NULL,
        experience TEXT,
        applied_at TIMESTAMP DEFAULT NOW(),
        reviewed_by BIGINT REFERENCES user_account(user_id) ON DELETE SET NULL,
        reviewed_at TIMESTAMP,
        rejection_reason TEXT,
        CONSTRAINT check_application_status CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Request Info')),
        CONSTRAINT unique_member_ministry UNIQUE (member_id, ministry_id)
      )
    `);
    console.log("✓ Ministry_application table created");

    // Create ministry_member table (junction table for roster)
    console.log("Creating ministry_member table...");
    await query(`
      CREATE TABLE IF NOT EXISTS ministry_member (
        ministry_member_id BIGSERIAL PRIMARY KEY,
        ministry_id BIGINT NOT NULL REFERENCES ministry(ministry_id) ON DELETE CASCADE,
        member_id BIGINT NOT NULL REFERENCES member(member_id) ON DELETE CASCADE,
        joined_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT unique_ministry_member UNIQUE (ministry_id, member_id)
      )
    `);
    console.log("✓ Ministry_member table created");

    // Create indexes for better query performance
    console.log("Creating indexes...");
    await query(
      `CREATE INDEX IF NOT EXISTS idx_ministry_application_member ON ministry_application(member_id)`
    );
    await query(
      `CREATE INDEX IF NOT EXISTS idx_ministry_application_ministry ON ministry_application(ministry_id)`
    );
    await query(
      `CREATE INDEX IF NOT EXISTS idx_ministry_application_status ON ministry_application(status)`
    );
    await query(
      `CREATE INDEX IF NOT EXISTS idx_ministry_member_ministry ON ministry_member(ministry_id)`
    );
    await query(
      `CREATE INDEX IF NOT EXISTS idx_ministry_member_member ON ministry_member(member_id)`
    );
    console.log("✓ Indexes created");

    console.log("\n========================================");
    console.log("All tables created successfully!");
    console.log("========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("\n========================================");
    console.error("Error creating tables:", error.message);
    console.error("========================================");
    process.exit(1);
  }
};

// Run the function
createTables();
