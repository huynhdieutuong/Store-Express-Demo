const db = require('../db');

module.exports.index = (req, res) => {
  const { sessionId } = req.signedCookies;
  const objectCart = db.get('sessions')
    .find({ id: sessionId })
    .get('cart')
    .value();

  let arrCart = [];
  let totalMoney = 0;
  for (const productId in objectCart) {
    let product = db.get('products').find({id: productId}).value();
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

module.exports.add = (req, res) => {
  const { sessionId } = req.signedCookies;
  const { productId } = req.params;
  if(!sessionId) {
    return res.redirect('/products');
  }

  const count = db.get('sessions')
    .find({ id: sessionId })
    .get('cart.' + productId, 0)
    .value();

  db.get('sessions')
    .find({ id: sessionId })
    .set('cart.' + productId, count + 1)
    .write();
  
  res.redirect('/products');
}