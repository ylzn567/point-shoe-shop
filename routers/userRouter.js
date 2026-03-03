const express = require('express');
const routerUser = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { validateUserId, authenticateToken } = require('./middleware');

routerUser.get('/', getAllUsers);

routerUser.get('/:id', authenticateToken, validateUserId, getUserById);

routerUser.put('/:id', authenticateToken, validateUserId, updateUser);

routerUser.delete('/:id', authenticateToken, validateUserId, deleteUser);

module.exports = routerUser;
