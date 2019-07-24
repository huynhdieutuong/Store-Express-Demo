const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  images: [String],
  userId: String
});

const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;