require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/phones', require('./routes/phones'));  
app.use('/api/orders', require('./routes/orders'));  
app.use('/api/payments', require('./routes/payments')); 
app.use('/api/admin', require('./routes/admin'));
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));