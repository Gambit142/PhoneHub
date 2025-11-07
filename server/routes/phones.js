const express = require('express');
const router = express.Router();
const Phone = require('../models/Phone');
const mongoose = require('mongoose');

// Get all phones (public) --> api/phones
// This route retrieves all phones from the database
router.get('/', async (req, res) => {
  try {
    const phones = await Phone.find({});
    res.json(phones);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get single phone with ID validation --> api/phones/:id
// This route retrieves a single phone by its ID
// It validates the ID format before querying the database
router.get('/:id', async (req, res) => {
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid ID format' });
    }

    const phone = await Phone.findById(req.params.id);
    if (!phone) {
      return res.status(404).json({ msg: 'Phone not found' });
    }
    res.json(phone);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;