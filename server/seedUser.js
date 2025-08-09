import mongoose from 'mongoose';
import User from './models/User.js'; // Adjust path to your User model
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import readline from 'readline';

// Load environment variables
dotenv.config();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Sample data generators
const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Lisa', 'William', 'Amy'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'];
const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com'];

// Function to generate random user data
const generateUser = async (index) => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(`Password${index}`, salt);
  
  return {
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@${domain}`,
    password: hashedPassword,
    role: index % 10 === 0 ? 'admin' : 'user' // Make every 10th user an admin
  };
};

// Ask for confirmation
const askConfirm = (question) => {
  return new Promise((resolve) => {
    rl.question(question + ' (y/n) ', (answer) => {
      resolve(answer.toLowerCase() === 'y');
    });
  });
};

// Main seeding function
const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Check if we should clear existing users
    const shouldClear = await askConfirm('Clear all existing users before seeding?');
    
    if (shouldClear) {
      const count = await User.countDocuments();
      if (count > 0) {
        const confirm = await askConfirm(`This will delete ${count} existing users. Continue?`);
        if (!confirm) {
          console.log('Aborted seeding');
          await mongoose.disconnect();
          process.exit(0);
        }
      }
      await User.deleteMany({});
      console.log('Cleared existing users');
    }

    // Generate and insert users
    console.log('Generating users...');
    const users = [];
    for (let i = 1; i <= 100; i++) {
      users.push(await generateUser(i));
      process.stdout.write(`\rGenerated ${i} of 100 users`);
    }
    console.log('\nInserting users...');

    await User.insertMany(users);
    console.log(`\nSuccessfully seeded ${users.length} users`);

    // Disconnect
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('\nError seeding users:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
};

// Run the seeder
seedUsers();