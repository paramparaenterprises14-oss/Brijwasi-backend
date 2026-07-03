const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['Appetizers', 'Tandoori', 'Main-Course', 'Biryani', 'Desserts'],
    required: true,
  },
  isVeg: {
    type: Boolean,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isChefSpecial: {
    type: Boolean,
    default: false,
  },
  imageUrl: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);