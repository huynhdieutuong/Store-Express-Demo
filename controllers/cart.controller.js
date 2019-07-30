const Session = require('../models/session.model');
const Product = require('../models/product.model');

module.exports.index = async (req, res) => {
  const { sessionId } = req.signedCookies;
  const session = await Session.findById(sessionId);
  const objectCart = session.cart;

  let arrCart = [];
  let totalMoney = 0;
  for (const productId in objectCart) {
    let product = await Product.findById(productId);
    product.quantity = objectCart[productId];
    product.total = product.price * product.quantity;
    totalMoney += product.total;
    arrCart.push(product);
  }

  res.render('cart/index', {
    title: 'Cart',
    arrCart,
    totalMoney
  });
}

module.exports.add = async (req, res) => {
  const { sessionId } = req.signedCookies;
  const { productId } = req.params;
  if(!sessionId) {
    return res.redirect('/products');
  }

  const session = await Session.findById(sessionId);
  if(!session.cart) {
    session.cart = {};
  };
  const cart = session.cart;
  const count = cart[productId] || 0;
  cart[productId] = count + 1;

  await Session.findByIdAndUpdate(sessionId, session);
  
  req.flash('success_msg', 'Added To Cart');
  res.redirect('/products');
}