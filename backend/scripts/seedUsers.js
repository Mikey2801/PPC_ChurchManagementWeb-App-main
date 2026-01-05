import { query, getClient } from "../config/database.js";
import { hashPassword } from "../utils/password.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Seed initial users: Admin, Treasurer, and Secretary
 */
const seedUsers = async () => {
  try {
    console.log("========================================");
    console.log("Seeding initial users...");
    console.log("========================================\n");

    const usersToSeed = [
      {
        email: "admin@church.local",
        password: "admin123",
        role: "Admin",
        firstName: "Super",
        lastName: "Admin",
        birthDate: "1980-01-01",
        gender: "M",
        contactNumber: "09123456789",
        address: "Admin Street, Admin City, Admin Province",
      },
      {
        email: "treasurer@church.local",
        password: "treasurer123",
        role: "Treasurer",
        firstName: "Rich",
        lastName: "Treasurer",
        birthDate: "1985-05-10",
        gender: "F",
        contactNumber: "09987654321",
        address: "Treasurer Lane, Treasurer City, Treasurer Province",
      },
      {
        email: "secretary@church.local",
        password: "secretary123",
        role: "Secretary",
        firstName: "Organized",
        lastName: "Secretary",
        birthDate: "1990-03-15",
        gender: "F",
        contactNumber: "09876543210",
        address: "Secretary Avenue, Secretary City, Secretary Province",
      },
    ];

    for (const userData of usersToSeed) {
      const {
        email,
        password,
        role,
        firstName,
        lastName,
        birthDate,
        gender,
        contactNumber,
        address,
      } = userData;
      const client = await getClient();

      try {
        await client.query("BEGIN");

        // Check if member already exists
        let memberResult = await client.query(
          "SELECT member_id FROM member WHERE email_address = $1",
          [email]
        );

        let memberId;
        if (memberResult.rows.length === 0) {
          // Create member record
          memberResult = await client.query(
            `INSERT INTO member (
              last_name, first_name, birthdate, gender, 
              contact_number, email_address, address
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING member_id`,
            [
              lastName,
              firstName,
              birthDate,
              gender,
              contactNumber,
              email,
              address,
            ]
          );
          memberId = memberResult.rows[0].member_id;
          console.log(`✓ Created member record for ${email}`);
        } else {
          memberId = memberResult.rows[0].member_id;
          console.log(`✓ Member record already exists for ${email}`);
        }

        // Check if user_account already exists
        const userCheck = await client.query(
          "SELECT user_id FROM user_account WHERE email_address = $1",
          [email]
        );

        if (userCheck.rows.length === 0) {
          // Hash password
          const passwordHash = await hashPassword(password);

          // Create user_account record
          await client.query(
            `INSERT INTO user_account (member_id, email_address, password_hash, role, is_active)
             VALUES ($1, $2, $3, $4, $5)`,
            [memberId, email, passwordHash, role, true]
          );
          console.log(`✓ Created user account for ${email} with role ${role}`);
        } else {
          // Update existing user account with role and password
          const passwordHash = await hashPassword(password);
          await client.query(
            `UPDATE user_account 
             SET password_hash = $1, role = $2, is_active = $3
             WHERE email_address = $4`,
            [passwordHash, role, true, email]
          );
          console.log(`✓ Updated user account for ${email} with role ${role}`);
        }

        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    }

    console.log("\n========================================");
    console.log("Users seeded successfully!");
    console.log("========================================\n");
    console.log("Seeded users:");
    console.log("  - admin@church.local / admin123 / Admin");
    console.log("  - treasurer@church.local / treasurer123 / Treasurer");
    console.log("  - secretary@church.local / secretary123 / Secretary\n");

    process.exit(0);
  } catch (error) {
    console.error("\n========================================");
    console.error("Error seeding users:", error.message);
    console.error("========================================");
    process.exit(1);
  }
};

// Run the function
seedUsers();
