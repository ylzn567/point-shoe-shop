const Order = require('../models/Order');

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId').populate('items.shoeId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = req.order;
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createOrder = async (req, res) => {
    try {
        const order = new Order(req.body);
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateOrder = async (req, res) => {
    try {
        const order = req.order;

        if (order.status === 'Shipped') {
            return res.status(400).json({ message: 'Cannot update an order that has already been shipped' });
        }

        Object.assign(order, req.body);
        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = req.order;
        await order.deleteOne();
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};
