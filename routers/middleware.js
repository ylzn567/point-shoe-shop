const User = require('../models/User');
const Shoe = require('../models/Shoe');
const Order = require('../models/Order');

const validateUserId = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next({ status: 404, message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (err) {
        next({ status: 500, message: err.message });
    }
};

const validateShoeId = async (req, res, next) => {
    try {
        const shoe = await Shoe.findById(req.params.id);
        if (!shoe) {
            return next({ status: 404, message: 'Shoe not found' });
        }
        req.shoe = shoe;
        next();
    } catch (err) {
        next({ status: 500, message: err.message });
    }
};

const validateOrderId = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return next({ status: 404, message: 'Order not found' });
        }
        req.order = order;
        next();
    } catch (err) {
        next({ status: 500, message: err.message });
    }
};

const authenticateToken = (req, res, next) => {
    if (!req.userData) {
        return next({ status: 401, message: 'Access token required' });
    }
    next();
};

const requireAdmin = (req, res, next) => {
    if (req.isAdmin) {
        return next();
    }
    if (req.accepts('html')) {
        return res.status(403).render('login', { error: 'Admin access required' });
    }
    return res.status(403).json({ message: 'Admin access required' });
};

module.exports = {
    validateUserId,
    validateShoeId,
    validateOrderId,
    authenticateToken,
    requireAdmin
};
