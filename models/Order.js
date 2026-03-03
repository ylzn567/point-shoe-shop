const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [{
        shoeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shoe' },
        modelName: String,
        price: Number,
        size: Number,
        width: String,
        quantity: { type: Number, default: 1 },
        isCustomOrder: { type: Boolean, default: false },
        shank: { type: String, default: 'M' },
        addRibbons: { type: Boolean, default: false },
        addElastic: { type: Boolean, default: false }
    }],

    totalPrice: { type: Number, required: true },

    orderType: {
        type: String,
        enum: ['stock', 'custom'],
        required: true
    },
    
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Shipped'],
        default: 'Pending'
    }
},
{ timestamps: true });

module.exports = mongoose.model('Order', orderSchema);