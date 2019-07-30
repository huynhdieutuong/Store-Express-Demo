const User = require('../models/user.model');

module.exports.postRegister = async (req, res, next) => {
  let errors = [];
  const { name, email, password, password2 } = req.body;
  const user = await User.findOne({ email });
  if(user) {
    errors.push('Email already in use!');
  }
  if(password !== password2) {
    errors.push('Confirm Password wrong!');
  }

  if(errors.length) {
    return res.render('auth/register', {
      errors,
      values: req.body
    })
  }

  next();
}
