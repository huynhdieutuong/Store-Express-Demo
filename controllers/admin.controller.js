const Product = require('../models/product.model');
const User = require('../models/user.model');

module.exports.index = async (req, res) => {
  const products = await Product.find();
  const { userId } = req.signedCookies;
  const user = await User.findById(userId);
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
module.exports.postCreateProduct = async (req, res) => {
  const { userId } = req.signedCookies;
  const { name, price, description } = req.body;
  let images = [];
  req.files.forEach(image => images.push('/uploads/products/' + image.filename));
  await Product.create({
    name,
    price,
    description,
    images,
    userId
  });
  res.redirect('/admin');
}

module.exports.searchProduct = async (req, res) => {
  const products = await Product.find();
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

module.exports.editProduct = async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  res.render('admin/create-product', {
    title: 'Edit Product',
    product
  })
}
module.exports.patchEditProduct = async (req, res) => {
  const { productId } = req.params;
  await Product.findByIdAndUpdate(productId, req.body);
  res.redirect('/admin');
}

module.exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;
  await Product.findByIdAndDelete(productId);
  res.redirect('/admin');
}