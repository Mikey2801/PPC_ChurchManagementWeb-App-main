import { query } from "../config/database.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Create mass_schedule table
 */
const createMassScheduleTable = async () => {
  try {
    console.log("========================================");
    console.log("Creating mass_schedule table...");
    console.log("========================================\n");

    await query(`
      CREATE TABLE IF NOT EXISTS mass_schedule (
        schedule_id BIGSERIAL PRIMARY KEY,
        date DATE NOT NULL,
        time TIME NOT NULL,
        title VARCHAR(200) NOT NULL,
        pastor VARCHAR(100),
        description TEXT,
        created_by BIGINT REFERENCES user_account(user_id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT unique_date_time UNIQUE (date, time)
      )
    `);
    console.log("✓ Mass_schedule table created");

    // Create index on date for faster queries
    await query(`
      CREATE INDEX IF NOT EXISTS idx_mass_schedule_date ON mass_schedule(date)
    `);
    console.log("✓ Index on date created");

    console.log("\n========================================");
    console.log("Mass_schedule table created successfully!");
    console.log("========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("\n========================================");
    console.error("Error creating mass_schedule table:", error.message);
    console.error("========================================");
    process.exit(1);
  }
};

// Run the function
createMassScheduleTable();
