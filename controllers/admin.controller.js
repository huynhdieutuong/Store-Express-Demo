const Product = require('../models/product.model');

module.exports.index = async (req, res) => {
  const userId = req.user.id;
  const products = await Product.find({userId});

  res.render('admin/index', {
    title: 'Admin',
    user: req.user,
    products
  });
}

module.exports.createProduct = (req, res) => {
  res.render('admin/create-product', {title: 'Create Product'});
}
module.exports.postCreateProduct = async (req, res) => {
  const userId = req.user.id;
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
  req.flash('success_msg', `Added ${name}`);
  res.redirect('/admin');
}

module.exports.searchProduct = async (req, res) => {
  const userId = req.user.id;
  const products = await Product.find({userId});
  const { q } = req.query;

  const filtered = products.filter(
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