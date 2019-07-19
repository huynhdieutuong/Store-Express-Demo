const uuid = require('uuid');

const db = require('../db');

module.exports = (req, res, next) => {
  const { sessionId } = req.signedCookies;
  if(!sessionId) {
    const sessionId = uuid();
    res.cookie('sessionId', sessionId, {signed: true});
    db.get('sessions').push({ id: sessionId }).write();
  }

  // Show totalCart
  const cart = db.get('sessions').find({id: sessionId}).get('cart').value();
  let totalCart = 0;
  for (const product in cart) {
    totalCart += cart[product];
  };
  res.locals.cart = totalCart;

  next();
}