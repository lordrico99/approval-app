// File: seed.js
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');       // make sure these models exist
const Request = require('./models/Request'); // adjust path if needed

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/approvalapp';

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Request.deleteMany({});

    // Create users
    const users = await User.insertMany([
      {
        name: 'Richard Okoro',
        email: 'richard@example.com',
        password: 'hashedpassword1', // You should hash passwords for real apps
        role: 'requester',
      },
      {
        name: 'Jane Approver',
        email: 'jane@example.com',
        password: 'hashedpassword2',
        role: 'approver',
      },
    ]);

    // Create requests
    const requests = await Request.insertMany([
      {
        title: 'Buy new laptops',
        description: 'We need 5 new laptops for the dev team.',
        department: 'IT',
        status: 'Pending',
        requesterEmail: users[0].email,
      },
      {
        title: 'Office party budget',
        description: 'Budget approval for Q2 office party.',
        department: 'HR',
        status: 'Approved',
        requesterEmail: users[0].email,
      },
    ]);

    console.log('Seed data inserted');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seed();
