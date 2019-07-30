const Transfer = require('../models/transfer.model');

module.exports.create = (req, res) => {
  res.render('transfer/create', { csrfToken: req.csrfToken() });
}

module.exports.postCreate = async (req, res) => {
  const { email, amount } = req.body;
  const userId = req.user.id;
  await Transfer.create({
    email,
    amount,
    userId
  });

  req.flash('success_msg', 'Transfer Success');
  res.redirect('/transfer/create');
}