const express = require('express');
const routerShoe = express.Router();
const { getAllShoes, getShoeById, createShoe, updateShoe, deleteShoe } = require('../controllers/shoeController');
const { validateShoeId, requireAdmin } = require('./middleware');

routerShoe.get('/', getAllShoes);

routerShoe.post('/', createShoe);

routerShoe.get('/:id', validateShoeId, getShoeById);

routerShoe.put('/:id', requireAdmin, validateShoeId, updateShoe);

routerShoe.delete('/:id', requireAdmin, validateShoeId, deleteShoe);

module.exports = routerShoe;
