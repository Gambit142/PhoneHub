const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { authMiddleware } = require('../utils/authUtils');
const Order = require('../models/Order');
const Phone = require('../models/Phone');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-08-16', typescript: true });

// ID validation middleware for order routes
const validateOrderId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ msg: 'Invalid ID format' });
  }
  next();
};

// Create payment intent
router.post('/create-payment-intent', authMiddleware, async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, shippingPrice } = req.body;
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ msg: 'No order items' });
    }
    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
      return res.status(400).json({ msg: 'Invalid shipping address' });
    }
    if (!paymentMethod) {
      return res.status(400).json({ msg: 'Payment method is required' });
    }

    // Parse and validate shippingPrice
    let parsedShippingPrice = parseFloat(shippingPrice);
    if (isNaN(parsedShippingPrice) || parsedShippingPrice < 0) {
      console.warn('Invalid shippingPrice, defaulting to 0:', shippingPrice);
      parsedShippingPrice = 0;
    }

    for (const item of orderItems) {
      if (!mongoose.Types.ObjectId.isValid(item.phone)) {
        return res.status(400).json({ msg: `Invalid phone ID: ${item.phone}` });
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return res.status(400).json({ msg: `Invalid quantity for phone ${item.phone}` });
      }
    }

    // Calculate prices
    const items = await Promise.all(
      orderItems.map(async item => {
        const phone = await Phone.findById(item.phone);
        if (!phone) {
          throw new Error(`Phone not found: ${item.phone}`);
        }
        return {
          phone: item.phone,
          quantity: item.quantity,
          price: phone.price,
          selectedColor: item.selectedColor,
          selectedStorage: item.selectedStorage,
          selectedRam: item.selectedRam
        };
      })
    );

    const itemsPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxPrice = itemsPrice * 0.13;
    const totalPrice = itemsPrice + taxPrice + parsedShippingPrice;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: 'cad',
      metadata: { userId: req.user.id }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Payment Intent Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Create new order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, shippingPrice, paymentResult } = req.body;
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ msg: 'No order items' });
    }
    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
      return res.status(400).json({ msg: 'Invalid shipping address' });
    }
    if (!paymentMethod) {
      return res.status(400).json({ msg: 'Payment method is required' });
    }

    // Parse and validate shippingPrice
    let parsedShippingPrice = parseFloat(shippingPrice);
    if (isNaN(parsedShippingPrice) || parsedShippingPrice < 0) {
      console.warn('Invalid shippingPrice, defaulting to 0:', shippingPrice);
      parsedShippingPrice = 0;
    }

    for (const item of orderItems) {
      if (!mongoose.Types.ObjectId.isValid(item.phone)) {
        return res.status(400).json({ msg: `Invalid phone ID: ${item.phone}` });
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return res.status(400).json({ msg: `Invalid quantity for phone ${item.phone}` });
      }
    }

    // Calculate prices
    const items = await Promise.all(
      orderItems.map(async item => {
        const phone = await Phone.findById(item.phone);
        if (!phone) {
          throw new Error(`Phone not found: ${item.phone}`);
        }
        return {
          phone: item.phone,
          quantity: item.quantity,
          price: phone.price,
          selectedColor: item.selectedColor,
          selectedStorage: item.selectedStorage,
          selectedRam: item.selectedRam
        };
      })
    );

    const itemsPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxPrice = itemsPrice * 0.13;
    const totalPrice = itemsPrice + taxPrice + parsedShippingPrice;

    const order = new Order({
      user: req.user.id,
      orderItems: items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice: parsedShippingPrice,
      totalPrice,
      status: 'pending',
      isPaid: paymentResult.status === 'succeeded',
      paidAt: paymentResult.status === 'succeeded' ? Date.now() : null,
      paymentResult
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (err) {
    console.error('Order Creation Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get logged in user orders
router.get('/myorders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('orderItems.phone');
    res.json(orders);
  } catch (err) {
    console.error('Fetch Orders Error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;