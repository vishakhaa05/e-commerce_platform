import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

dotenv.config({ override: true });

const main = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bigmarket';
    console.log(`Connecting to database: ${mongoURI}`);
    await mongoose.connect(mongoURI);
    console.log('Connected successfully!');

    const args = process.argv.slice(2);
    const command = args[0];

    // Command: Reset password
    if (command === 'reset' && args.length >= 2) {
      const email = args[1].toLowerCase().trim();
      const newPassword = args[2] || 'Password@123';
      
      console.log(`Attempting to reset password for user: ${email}...`);
      const user = await User.findOne({ email });
      if (!user) {
        console.error(`Error: User with email "${email}" not found.`);
        process.exit(1);
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);
      
      user.passwordHash = passwordHash;
      user.isVerified = true; // Ensure they can log in
      await user.save();
      
      console.log(`Successfully reset password for "${email}" to "${newPassword}".`);
      process.exit(0);
    }

    // Command: Promote user to admin
    if (command === 'promote' && args.length >= 2) {
      const email = args[1].toLowerCase().trim();
      
      console.log(`Promoting user to admin: ${email}...`);
      const user = await User.findOne({ email });
      if (!user) {
        console.error(`Error: User with email "${email}" not found.`);
        process.exit(1);
      }

      user.role = 'admin';
      user.isVerified = true;
      await user.save();
      
      console.log(`Successfully promoted "${email}" to admin.`);
      process.exit(0);
    }

    // Command: Create a new user or admin
    if (command === 'create' && args.length >= 4) {
      const name = args[1];
      const email = args[2].toLowerCase().trim();
      const password = args[3];
      const role = (args[4] || 'user') as 'user' | 'admin';

      console.log(`Creating user "${name}" (${email}) with role "${role}"...`);
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.error(`Error: User with email "${email}" already exists.`);
        process.exit(1);
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      await User.create({
        name,
        email,
        passwordHash,
        role,
        isVerified: true,
      });

      console.log(`Successfully created user "${email}" with password "${password}" and role "${role}".`);
      process.exit(0);
    }

    // Default action: List all users
    console.log('\n--- Registered Users ---');
    const users = await User.find({}, 'name email role isVerified createdAt');
    if (users.length === 0) {
      console.log('No users found in the database.');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Verified: ${user.isVerified}`);
        console.log(`   Created At: ${user.createdAt}`);
        console.log('------------------------');
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error running script:', error);
    process.exit(1);
  }
};

main();
