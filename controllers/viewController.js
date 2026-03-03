const Shoe = require('../models/Shoe');
const Order = require('../models/Order');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const renderShoes = async (req, res) => {
    try {
        let shoes = await Shoe.find();
        res.render('shoes', { shoes, isAdmin: req.isAdmin });
    } catch (err) {
        res.status(500).render('error', { status: 500, message: 'Failed to load shoes', details: err.message });
    }
};

const renderShoeDetails = async (req, res) => {
    try {
        res.render('shoe-details', { shoe: req.shoe });
    } catch (err) {
        res.status(500).render('error', { status: 500, message: 'Failed to load shoe details', details: err.message });
    }
};

const renderUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.render('users', { users });
    } catch (err) {
        res.status(500).render('error', { status: 500, message: 'Failed to load users', details: err.message });
    }
};

const renderOrdersPage = async (req, res, errorMessage = null) => {
    if (!req.userData) {
        return res.status(401).render('login', { error: 'Please log in' });
    }

    const query = req.isAdmin ? {} : { userId: req.userData.id };
    const orders = await Order.find(query).lean();
    
    // עיבוד כל הזמנה
    for (const order of orders) {
        // טען משתמש
        if (order.userId) {
            const user = await User.findById(order.userId).lean();
            order.userId = user || { firstName: 'Deleted', lastName: 'User' };
        } else {
            order.userId = { firstName: 'Unknown', lastName: 'User' };
        }
        
        // ברירות מחדל
        order.items = order.items || [];
        order.status = order.status || 'Pending';
        order.orderType = order.orderType || 'stock';
        order.createdAt = order.createdAt || new Date();
        order.totalPrice = order.totalPrice || 0;
        
        // חישוב כמות
        order.totalQuantity = 0;
        for (const item of order.items) {
            if (item && item.quantity) {
                order.totalQuantity += Number(item.quantity) || 0;
            }
        }
        
        // חישוב מחיר אם חסר
        if (order.totalPrice === 0 && order.items.length > 0) {
            for (const item of order.items) {
                if (item && item.price && item.quantity) {
                    order.totalPrice += (Number(item.price) || 0) * (Number(item.quantity) || 1);
                }
            }
        }
    }
    
    res.render('orders', { orders, error: errorMessage, isAdmin: req.isAdmin });
};

const registerUserView = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('register', { error: 'Email already exists', success: false });
        }

        const user = new User({
            firstName,
            lastName,
            email,
            password
        });

        await user.save();
        res.redirect('/login');
    } catch (err) {
        res.render('register', { error: err.message, success: false });
    }
};

const loginUserView = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.render('login', { error: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id.toString(), isAdmin: !!user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });

        res.redirect('/shoes-view');
    } catch (err) {
        res.render('login', { error: err.message });
    }
};

const createShoeView = async (req, res) => {
    try {
        const shoe = new Shoe(req.body);
        await shoe.save();
        res.redirect('/shoes-view');
    } catch (err) {
        res.render('shoes', { shoes: [], error: err.message, isAdmin: req.isAdmin });
    }
};

const updateShoeView = async (req, res) => {
    try {
        const updatedShoe = await Shoe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.redirect('/shoes-view');
    } catch (err) {
        res.render('shoe-details', { shoe: req.shoe, error: err.message });
    }
};

const deleteShoeView = async (req, res) => {
    try {
        await Shoe.findByIdAndDelete(req.params.id);
        res.redirect('/shoes-view');
    } catch (err) {
        res.render('shoe-details', { shoe: req.shoe, error: err.message });
    }
};

const createOrderView = async (req, res) => {
    try {
        if (!req.userData) {
            return res.status(401).render('login', { error: 'Please log in to create orders' });
        }

        const {
            shoeId,
            quantity,
            orderType,
            stockSize,
            stockWidth,
            customSize,
            customWidth,
            customShank,
            customAddRibbons,
            customAddElastic
        } = req.body;
        const userId = req.userData.id;
        const qty = Number(quantity) || 1;

        const user = await User.findById(userId);
        const shoe = await Shoe.findById(shoeId);

        if (!user || !shoe) {
            return res.status(400).render('error', { status: 400, message: 'Invalid request', details: 'Please log in and select a valid shoe.' });
        }

        const isCustomOrder = orderType === 'custom';
        const rawSize = isCustomOrder ? customSize : stockSize;
        const sizeValue = rawSize !== undefined && rawSize !== '' ? Number(rawSize) : undefined;
        const widthValue = isCustomOrder ? customWidth : stockWidth;
        const orderItem = {
            shoeId: shoe._id,
            modelName: shoe.modelName,
            price: shoe.price,
            quantity: qty,
            size: Number.isFinite(sizeValue) ? sizeValue : undefined,
            width: widthValue || undefined,
            isCustomOrder,
            shank: isCustomOrder ? (customShank || 'M') : 'M',
            addRibbons: isCustomOrder ? Boolean(customAddRibbons) : false,
            addElastic: isCustomOrder ? Boolean(customAddElastic) : false
        };

        const order = new Order({
            userId: user._id,
            items: [orderItem],
            totalPrice: shoe.price * qty,
            orderType: isCustomOrder ? 'custom' : 'stock'
        });

        await order.save();
        res.redirect('/orders-view');
    } catch (err) {
        return res.status(500).render('error', { status: 500, message: 'Failed to create order', details: err.message });
    }
};

const updateOrderView = async (req, res) => {
    try {
        if (!req.userData) {
            return res.status(401).render('login', { error: 'Please log in to update orders' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).render('error', { status: 404, message: 'Order not found', details: null });
        }

        Object.assign(order, req.body);
        await order.save();
        res.redirect('/orders-view');
    } catch (err) {
        return res.status(500).render('error', { status: 500, message: 'Failed to update order', details: err.message });
    }
};

const deleteOrderView = async (req, res) => {
    try {
        if (!req.userData) {
            return res.status(401).render('login', { error: 'Please log in to delete orders' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).render('error', { status: 404, message: 'Order not found', details: null });
        }

        await Order.findByIdAndDelete(req.params.id);
        res.redirect('/orders-view');
    } catch (err) {
        return res.status(500).render('error', { status: 500, message: 'Failed to delete order', details: err.message });
    }
};

module.exports = {
    renderShoes,
    renderShoeDetails,
    renderUsers,
    renderOrdersPage,
    registerUserView,
    loginUserView,
    createShoeView,
    updateShoeView,
    deleteShoeView,
    createOrderView,
    updateOrderView,
    deleteOrderView
};
