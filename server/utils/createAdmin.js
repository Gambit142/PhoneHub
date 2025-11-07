const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/User');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


// Database connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected for admin creation');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    // Validate environment variables
    const requiredEnvVars = ['MONGODB_URI', 'ADMIN_EMAIL', 'ADMIN_PASSWORD', 'JWT_SECRET'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    await connectDB();

    const adminData = {
      name: 'Super Administrator',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin'
    };

    const adminExists = await User.findOne({ email: adminData.email });
    
    if (!adminExists) {


      const admin = new User({
        name: adminData.name,
        email: adminData.email,
        password: adminData.password, // Use plain password for admin creation
        role: adminData.role
      });
      
      await admin.save();
      
      // Generate JWT token for testing
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { user: { id: admin.id, role: admin.role } },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      console.log('🔐 Sample JWT Token:', token);
    } else {
      console.log('ℹ️ Admin user already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Admin creation failed:', error.message);
    process.exit(1);
  }
};

createAdmin();