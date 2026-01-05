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
        CONSTRAINT check_role CHECK (role IN ('Admin', 'Treasurer', 'Member'))
      )
    `);
    console.log("✓ User_account table created (with role column)");

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
