const shortid = require('shortid');

const db = require('../db');
const products = db.get('products').value();

module.exports.index = (req, res) => {
  const { userId } = req.signedCookies;
  const user = db.get('users').find({id: userId}).value();
  const productsOfUser = products.filter(product => product.userId === userId);

  res.render('admin/index', {
    title: 'Admin',
    user,
    products: productsOfUser
  });
}

module.exports.createProduct = (req, res) => {
  res.render('admin/create-product', {title: 'Create Product'});
}
module.exports.postCreateProduct = (req, res) => {
  const user = db.get('users').find({id: req.signedCookies.userId}).value();
  const { name, price, description } = req.body;
  let images = [];
  req.files.forEach(image => images.push('/uploads/products/' + image.filename));
  db.get('products').push({
    id: shortid.generate(),
    name,
    price,
    description,
    images,
    userId: user.id
  }).write();
  res.redirect('/admin');
}

module.exports.searchProduct = (req, res) => {
  const { q } = req.query;
  const { userId } = req.signedCookies;
  const productsOfUser = products.filter(product => product.userId === userId);

  const filtered = productsOfUser.filter(
    product => product.name.toLowerCase().indexOf(q.toLowerCase()) !== -1);
  
  res.render('admin/index', {
    products: filtered,
    value: q
  });
}

module.exports.editProduct = (req, res) => {
  const { productId } = req.params;
  const product = db.get('products').find({id: productId}).value();
  res.render('admin/create-product', {
    title: 'Edit Product',
    product
  })
}
// module.exports.putEditProduct = (req, res) => {

// }

// module.exports.deleteProduct = (req, res) => {
  
// }