const express = require('express');
const routerOrder = express.Router();
const { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder } = require('../controllers/orderController');
const { validateOrderId, authenticateToken } = require('./middleware');

routerOrder.get('/', authenticateToken, getAllOrders);

routerOrder.post('/', authenticateToken, createOrder);

routerOrder.get('/:id', authenticateToken, validateOrderId, getOrderById);

routerOrder.put('/:id', authenticateToken, validateOrderId, updateOrder);

routerOrder.delete('/:id', authenticateToken, validateOrderId, deleteOrder);

module.exports = routerOrder;
