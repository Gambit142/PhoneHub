// Generate a random secret key for the application

const crypto = require('crypto');
require('dotenv').config();

// Generate a 64-byte (512-bit) random string
const jwtSecret = crypto.randomBytes(64).toString('hex');

// Optionally write to .env file
const fs = require('fs');
fs.appendFileSync('.env', `\nJWT_SECRET=${jwtSecret}\n`);
