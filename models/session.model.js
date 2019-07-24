const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
  cart: {}
})

const Session = mongoose.model('Session', sessionSchema, 'sessions');

module.exports = Session;