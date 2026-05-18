const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, 'Please add a quantity'],
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        default: 0.0
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: false, // Changed to false so it doesn't block your save
        default: 'General'
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Product', productSchema);