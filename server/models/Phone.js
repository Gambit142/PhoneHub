const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  storage: [{
    type: String,
    required: true
  }],
  colors: [{
    type: String,
    required: true
  }],
  batterySize: {
    type: String,
    required: true
  },
  batteryType: {
    type: String,
    required: true
  },
  ramSize: [{
    type: String,
    required: true
  }],
  displaySize: {
    type: String,
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  image: {
    type: String,
    required: true

  },
  frontCamera: {
    type: String,
    required: true
  },
  backCamera: {
    type: String,
    required: true
  },
  os: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
}, { timestamps: true });

module.exports = mongoose.model('Phone', phoneSchema, 'phones');