const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/viewController');
const { updateUser, deleteUser } = require('../controllers/userController');
const { requireAdmin, validateShoeId, validateUserId } = require('./middleware');

// Async error handler
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/register', (req, res) => {
    res.render('register', { error: null, success: false });
});

router.post('/register', asyncHandler(registerUserView));

router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

router.post('/login', asyncHandler(loginUserView));

router.get('/shoes-view', asyncHandler(renderShoes));

router.get('/shoes-view/:id', validateShoeId, asyncHandler(renderShoeDetails));

router.post('/shoes-view', requireAdmin, asyncHandler(createShoeView));

router.put('/shoes-view/:id', requireAdmin, validateShoeId, asyncHandler(updateShoeView));

router.delete('/shoes-view/:id', requireAdmin, validateShoeId, asyncHandler(deleteShoeView));

router.get('/users-view', requireAdmin, asyncHandler(renderUsers));

router.put('/users-view/:id', requireAdmin, validateUserId, asyncHandler(updateUser));

router.delete('/users-view/:id', requireAdmin, validateUserId, asyncHandler(deleteUser));

router.get('/orders-view', (req, res, next) => {
    renderOrdersPage(req, res).catch(err => {
        res.status(500).render('error', { 
            status: 500, 
            message: 'Failed to load orders', 
            details: err.message 
        });
    });
});

router.post('/orders-view', asyncHandler(createOrderView));

router.put('/orders-view/:id', asyncHandler(updateOrderView));

router.delete('/orders-view/:id', asyncHandler(deleteOrderView));

module.exports = router;
