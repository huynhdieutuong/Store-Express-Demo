const Product = require('../models/product.model');
const cloudinary = require('cloudinary');

module.exports.index = async (req, res) => {
  const userId = req.user.id;
  const products = await Product.find({ userId });

  res.render('admin/index', {
    title: 'Admin',
    user: req.user,
    products
  });
}

module.exports.createProduct = (req, res) => {
  res.render('admin/create-product', { title: 'Create Product' });
}
module.exports.postCreateProduct = async (req, res) => {
  const userId = req.user.id;
  const { name, price, description } = req.body;
  const files = req.files.images;

  let res_promises = files.map(image => new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(image.tempFilePath, { public_id: "store/products/" + Date.now() }, function (error, result) {
      if (error) reject(error)
      else resolve(result.url)
    })
  })
  );
  const result = await Promise.all(res_promises);
  await Product.create({
    name,
    price,
    description,
    images: result,
    userId
  });

  req.flash('success_msg', `Added ${name}`);
  res.redirect('/admin');
}

module.exports.searchProduct = async (req, res) => {
  const userId = req.user.id;
  const products = await Product.find({ userId });
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

  if (product.userId !== req.user.id) {
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
  const files = req.files.images;

  let res_promises = files.map(image => new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(image.tempFilePath, { public_id: "store/products/" + Date.now() }, function (error, result) {
      if (error) reject(error)
      else resolve(result.url)
    })
  })
  );
  const result = await Promise.all(res_promises);
  await Product.findByIdAndUpdate(productId, {
    name,
    price,
    description,
    images: result.length ? result : product.images
  })

  req.flash('success_msg', 'Updated Product');
  res.redirect('/admin');
}

module.exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;
  await Product.findByIdAndDelete(productId);
  req.flash('error_msg', 'Deleted Product');
  res.redirect('/admin');
}