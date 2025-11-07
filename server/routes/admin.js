const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../utils/authUtils');
const Phone = require('../models/Phone');
const Order = require('../models/Order');
const User = require('../models/User');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

// ============ Phone Admin Routes ============
// Create phone (Admin only)
router.post('/phones', [authMiddleware, adminMiddleware, upload.single('image')], async (req, res) => {
    try {
        const { name, brand, description, price, stock, colors, storages, 
            rams, batterySize, batteryType, displaySize, releaseDate, 
            frontCamera, backCamera, os } = req.body;

        // Parse arrays from JSON strings if necessary
        const parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors || [];
        const parsedStorages = typeof storages === 'string' ? JSON.parse(storages) : storages || [];
        const parsedRams = typeof rams === 'string' ? JSON.parse(rams) : rams || [];

        const image = req.file ? req.file.path : null;
        if (!image) {
            return res.status(400).json({ msg: 'Image is required' });
        }

        const phone = new Phone({
            id: name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(), // Generate unique ID
            name,
            brand,
            model: name,
            description,
            price,
            stock,
            colors: parsedColors,
            storage: parsedStorages,
            ramSize: parsedRams,
            batterySize,
            batteryType,
            displaySize,
            releaseDate,
            image,
            frontCamera,
            backCamera,
            os
        });

        await phone.save();
        res.json(phone);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update phone (Admin only)
router.put('/phones/:id', [authMiddleware, adminMiddleware, upload.single('image')], async (req, res) => {
    try {
        const { name, model, description, price, brand, stock, colors, storage, ramSize, batterySize, batteryType, displaySize, releaseDate, frontCamera, backCamera, os } = req.body;

        let phone = await Phone.findById(req.params.id);
        if (!phone) {
            return res.status(404).json({ msg: 'Phone not found' });
        }

        // Parse arrays from JSON strings if necessary
        const parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors;
        const parsedStorage = typeof storage === 'string' ? JSON.parse(storage) : storage;
        const parsedRamSize = typeof ramSize === 'string' ? JSON.parse(ramSize) : ramSize;

        const updateData = {
            name: name || phone.name,
            model: model || phone.model,
            description: description || phone.description,
            price: price || phone.price,
            brand: brand || phone.brand,
            stock: stock || phone.stock,
            colors: parsedColors || phone.colors,
            storage: parsedStorage || phone.storage,
            ramSize: parsedRamSize || phone.ramSize,
            batterySize: batterySize || phone.batterySize,
            batteryType: batteryType || phone.batteryType,
            displaySize: displaySize || phone.displaySize,
            releaseDate: releaseDate || phone.releaseDate,
            frontCamera: frontCamera || phone.frontCamera,
            backCamera: backCamera || phone.backCamera,
            os: os || phone.os
        };

        if (req.file) {
            updateData.image = req.file.path;
        }

        phone = await Phone.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json(phone);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete phone (Admin only)
router.delete('/phones/:id', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const phone = await Phone.findById(req.params.id);
        if (!phone) {
            return res.status(404).json({ msg: 'Phone not found' });
        }

        await phone.deleteOne();
        res.json({ msg: 'Phone removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// ============ Order Admin Routes ============
// Get all orders (Admin only)
router.get('/orders', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('orderItems.phone', 'name brand');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get order details (Admin only)
router.get('/orders/:id', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('orderItems.phone', 'name brand');
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update order status (Admin only)
router.put('/orders/:id/status', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const { status } = req.body;
        if (!['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).json({ msg: 'Invalid status' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('user', 'name email').populate('orderItems.phone', 'name brand');

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// ============ Stats Routes ============
// Get monthly sales data (Admin only)
router.get('/stats/sales', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const orders = await Order.find({ createdAt: { $gte: sixMonthsAgo } });
        const salesByMonth = {};

        orders.forEach(order => {
            const month = new Date(order.createdAt).toLocaleString('en-US', { month: 'short' });
            if (!salesByMonth[month]) {
                salesByMonth[month] = { sales: 0, orders: 0 };
            }
            salesByMonth[month].sales += order.totalPrice;
            salesByMonth[month].orders += 1;
        });

        const salesData = Object.keys(salesByMonth).map(month => ({
            month,
            sales: salesByMonth[month].sales,
            orders: salesByMonth[month].orders
        }));

        res.json(salesData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get brand sales data (Admin only)
router.get('/stats/brands', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const orders = await Order.find({}).populate('orderItems.phone', 'brand');
        const brandSales = {};

        orders.forEach(order => {
            order.orderItems.forEach(item => {
                const brand = item.phone.brand;
                if (!brandSales[brand]) {
                    brandSales[brand] = 0;
                }
                brandSales[brand] += item.price * item.quantity;
            });
        });

        const brandData = Object.keys(brandSales).map(brand => ({
            brand,
            sales: brandSales[brand]
        }));

        res.json(brandData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get total users (Admin only)
router.get('/stats/users', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        res.json({ totalUsers });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;