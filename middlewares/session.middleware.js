const Session = require('../models/session.model');

module.exports = async (req, res, next) => {
  const { sessionId } = req.signedCookies;
  if(!sessionId) {
    const session = await Session.create({});
    res.cookie('sessionId', session.id, {signed: true});
  }

  // Show totalCart
  const session = await Session.findById(sessionId) || {};
  const cart = session.cart;
  let totalCart = 0;
  for (const product in cart) {
    totalCart += cart[product];
  };
  res.locals.cart = totalCart;

  next();
}