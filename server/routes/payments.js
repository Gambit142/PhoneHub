const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../utils/authUtils');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

// Get user's payment methods
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.stripeCustomerId) {
            return res.json([]);
        }

        const paymentMethods = await stripe.paymentMethods.list({
            customer: user.stripeCustomerId,
            type: 'card'
        });

        const formattedMethods = paymentMethods.data.map(pm => ({
            id: pm.id,
            type: pm.card.brand,
            last4: pm.card.last4,
            expiryMonth: String(pm.card.exp_month).padStart(2, '0'),
            expiryYear: String(pm.card.exp_year),
            isDefault: user.defaultPaymentMethod === pm.id
        }));

        res.json(formattedMethods);
    } catch (err) {
        console.error('Fetch Payment Methods Error:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Add a new payment method
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { paymentMethodId } = req.body;
        let user = await User.findById(req.user.id);

        if (!user.stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: { userId: user._id.toString() }
            });
            user.stripeCustomerId = customer.id;
            await user.save();
        }

        const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
            customer: user.stripeCustomerId
        });

        if (!user.defaultPaymentMethod) {
            await stripe.customers.update(user.stripeCustomerId, {
                invoice_settings: { default_payment_method: paymentMethodId }
            });
            user.defaultPaymentMethod = paymentMethodId;
            await user.save();
        }

        const formattedMethod = {
            id: paymentMethod.id,
            type: paymentMethod.card.brand,
            last4: paymentMethod.card.last4,
            expiryMonth: String(paymentMethod.card.exp_month).padStart(2, '0'),
            expiryYear: String(paymentMethod.card.exp_year),
            isDefault: user.defaultPaymentMethod === paymentMethod.id
        };

        res.json(formattedMethod);
    } catch (err) {
        console.error('Add Payment Method Error:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Delete a payment method
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.stripeCustomerId) {
            return res.status(404).json({ msg: 'No payment methods found' });
        }

        await stripe.paymentMethods.detach(req.params.id);
        if (user.defaultPaymentMethod === req.params.id) {
            user.defaultPaymentMethod = null;
            await user.save();
        }

        res.json({ msg: 'Payment method deleted' });
    } catch (err) {
        console.error('Delete Payment Method Error:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Set default payment method
router.put('/:id/default', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.stripeCustomerId) {
            return res.status(404).json({ msg: 'No payment methods found' });
        }

        await stripe.customers.update(user.stripeCustomerId, {
            invoice_settings: { default_payment_method: req.params.id }
        });

        user.defaultPaymentMethod = req.params.id;
        await user.save();

        const paymentMethods = await stripe.paymentMethods.list({
            customer: user.stripeCustomerId,
            type: 'card'
        });

        const formattedMethods = paymentMethods.data.map(pm => ({
            id: pm.id,
            type: pm.card.brand,
            last4: pm.card.last4,
            expiryMonth: String(pm.card.exp_month).padStart(2, '0'),
            expiryYear: String(pm.card.exp_year),
            isDefault: user.defaultPaymentMethod === pm.id
        }));

        res.json(formattedMethods);
    } catch (err) {
        console.error('Set Default Payment Method Error:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

module.exports = router;