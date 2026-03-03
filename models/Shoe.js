const mongoose = require('mongoose');

const shoeSchema = new mongoose.Schema({
    modelName: {
        type: String,
        required: [true, 'שם הדגם הוא חובה']
    },
    brand: {
        type: String,
        required: true,
        enum: ['Grishko', 'Bloch', 'Gaynor Minden', 'Russian Pointe', 'Capezio','Sansha']
    },
    price: {
        type: Number,
        required: [true, 'נא להזין מחיר'],
        min: 0
    },
    image: {
        type: String,
        default: 'https://placehold.co/400x600/black/white?text=No+Image'
    },
    description: String,
    
    stockInventory: [{
        size: Number,
        width: String,
        quantity: {
            type: Number,
            default: 0,
            min: 0
        }
    }],
    availableShanks: {
        type: [String],
        default: ['SS', 'S', 'M', 'H', 'SH']
    }
}, { timestamps: true });

module.exports = mongoose.model('Shoe', shoeSchema);