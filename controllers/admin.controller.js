const Product = require('../models/product.model');
const cloudinary = require('cloudinary');

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
  // req.files.forEach(image => images.push('/uploads/products/' + image.filename));

  req.files.forEach(async image => {
    const result = await cloudinary.v2.uploader.upload(image.path, {public_id: "store/products/" + image.filename});
    images.push(result.url);
  });
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

  if(product.userId !== req.user.id) {
    req.flash('error_msg', 'Not Authorized');
    return res.redirect('/admin');
  }

  res.render('admin/edit-product', {
    title: 'Edit Product',
    product
  })
}
module.exports.putEditProduct = async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  const { name, price, description } = req.body;

  let images = [];
  req.files.forEach(image => images.push('/uploads/products/' + image.filename));

  const update = {
    name,
    price,
    description,
    images: images.length ? images : product.images
  };
  await Product.findByIdAndUpdate(productId, update);
  req.flash('success_msg', 'Updated Product');
  res.redirect('/admin');
}

module.exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;
  await Product.findByIdAndDelete(productId);
  req.flash('error_msg', 'Deleted Product');
  res.redirect('/admin');
}