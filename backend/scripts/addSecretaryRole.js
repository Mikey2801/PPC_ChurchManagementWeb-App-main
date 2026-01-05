import { query } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Migration script to add Secretary role to existing databases
 * This updates the CHECK constraint on the user_account table
 */
const addSecretaryRole = async () => {
  try {
    console.log('========================================');
    console.log('Adding Secretary role to database...');
    console.log('========================================\n');

    // Step 1: Drop the old constraint
    console.log('Dropping old role constraint...');
    await query(`
      ALTER TABLE user_account
      DROP CONSTRAINT IF EXISTS check_role
    `);
    console.log('✓ Old constraint dropped');

    // Step 2: Add new constraint with Secretary role
    console.log('Adding new constraint with Secretary role...');
    await query(`
      ALTER TABLE user_account
      ADD CONSTRAINT check_role CHECK (role IN ('Admin', 'Treasurer', 'Secretary', 'Member'))
    `);
    console.log('✓ New constraint added with Secretary role');

    console.log('\n========================================');
    console.log('Secretary role added successfully!');
    console.log('========================================\n');
    console.log('You can now create users with the Secretary role.\n');

    process.exit(0);
  } catch (error) {
    console.error('\n========================================');
    console.error('Error adding Secretary role:', error.message);
    console.error('========================================');
    process.exit(1);
  }
};

// Run the function
addSecretaryRole();

