const db = require('../db');

const products = db.get('products').value();

module.exports.index = (req, res) => {
  let page = parseInt(req.query.page) || 1;
  const perPage = 8;
  const maxPage = Math.ceil(products.length / perPage);

  if(page < 1) {
    page = 1;
  }
  if(page > maxPage) {
    page = maxPage;
  }

  const start = (page - 1) * perPage;
  const end = page * perPage;

  let arrPage = [page - 1, page, page + 1];
  if(page === 1) {
    arrPage = [1, 2, 3];
  }
  if(page === maxPage) {
    arrPage = [maxPage - 2, maxPage - 1, maxPage];
  }

  const prevPage = (page === maxPage) ? arrPage[1] : arrPage[0];
  const nextPage = (page === 1) ? 2 : arrPage[2];

  res.render('products/index', {
    title: 'Products',
    products: products.slice(start, end),
    pagination: true,
    page,
    arrPage,
    maxPage,
    prevPage,
    nextPage
  });
}

module.exports.search = (req, res) => {
  const { q } = req.query;
  const filtered = products.filter(
    product => product.name.toLowerCase().indexOf(q.toLowerCase()) !== -1);
  res.render('products/index', {
    pagination: false,
    products: filtered,
    value: q
  });
}

module.exports.view = (req, res) => {
  const { productId } = req.params;
  const product = db.get('products').find({ id: productId }).value();
  res.render('products/view', {
    title: product.name,
    product
  });
}