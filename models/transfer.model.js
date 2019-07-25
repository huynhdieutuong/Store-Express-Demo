const mongoose = require('mongoose');

const transferSchema = mongoose.Schema({
  email: String,
  amount: Number,
  userId: String
});

const Transfer = mongoose.model('Transfer', transferSchema, 'transfers');

module.exports = Transfer;