import { query } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Create attendance table
 */
const createAttendanceTable = async () => {
  try {
    console.log('========================================');
    console.log('Creating attendance table...');
    console.log('========================================\n');

    await query(`
      CREATE TABLE IF NOT EXISTS attendance (
        attendance_id BIGSERIAL PRIMARY KEY,
        member_id BIGINT NOT NULL REFERENCES member(member_id) ON DELETE CASCADE,
        mass_schedule_id BIGINT REFERENCES mass_schedule(schedule_id) ON DELETE SET NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'Pending',
        verified_by BIGINT REFERENCES user_account(user_id) ON DELETE SET NULL,
        verified_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT check_status CHECK (status IN ('Pending', 'Verified', 'Absent')),
        CONSTRAINT unique_member_schedule UNIQUE (member_id, mass_schedule_id)
      )
    `);
    console.log('✓ Attendance table created');

    // Create indexes for faster queries
    await query(`
      CREATE INDEX IF NOT EXISTS idx_attendance_member ON attendance(member_id)
    `);
    console.log('✓ Index on member_id created');

    await query(`
      CREATE INDEX IF NOT EXISTS idx_attendance_schedule ON attendance(mass_schedule_id)
    `);
    console.log('✓ Index on mass_schedule_id created');

    await query(`
      CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status)
    `);
    console.log('✓ Index on status created');

    console.log('\n========================================');
    console.log('Attendance table created successfully!');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\n========================================');
    console.error('Error creating attendance table:', error.message);
    console.error('========================================');
    process.exit(1);
  }
};

// Run the function
createAttendanceTable();

