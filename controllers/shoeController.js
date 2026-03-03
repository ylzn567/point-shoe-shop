const Shoe = require('../models/Shoe');

const getAllShoes = async (req, res) => {
    try {
        const shoes = await Shoe.find();
        res.json(shoes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getShoeById = async (req, res) => {
    try {
        const shoe = req.shoe;
        res.json(shoe);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createShoe = async (req, res) => {
    try {
        const shoe = new Shoe(req.body);
        const newShoe = await shoe.save();
        res.status(201).json(newShoe);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateShoe = async (req, res) => {
    try {
        const shoe = req.shoe;

        Object.assign(shoe, req.body);
        const updatedShoe = await shoe.save();

        res.json(updatedShoe);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteShoe = async (req, res) => {
    try {
        const shoe = req.shoe;
        await shoe.deleteOne();
        res.json({ message: 'Shoe deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllShoes,
    getShoeById,
    createShoe,
    updateShoe,
    deleteShoe
};
