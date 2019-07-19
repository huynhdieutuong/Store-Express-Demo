module.exports = (req, res, next) => {
  let errors = [];
  const { name, price, description } = req.body;
  if(!name) {
    errors.push('Name is required!');
  }
  if(!price) {
    errors.push('Price is required!');
  }
  if(!description) {
    errors.push('Description is required!');
  }
  if(!req.files) {
    errors.push('Images is required!');
  }

  if(errors.length) {
    return res.render('admin/create-product', {
      errors,
      values: req.body
    })
  }
  
  next();
}