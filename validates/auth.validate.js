const md5 = require('md5');
const User = require('../models/user.model');

module.exports.postRegister = async (req, res, next) => {
  let errors = [];
  const { name, email, password, password2 } = req.body;
  const user = await User.findOne({ email });
  if(!name) {
    errors.push('Name is required!');
  }
  if(!email) {
    errors.push('Email is required!');
  } else if(user) {
    errors.push('Email already in use!');
  }
  if(!password) {
    errors.push('Password is required!');
  } else if(password !== password2) {
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

module.exports.postLogin = async (req, res, next) => {
  let errors = [];
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if(!email) {
    errors.push('Email is required!');
  } else if(!user) {
    errors.push('Email does not register!');
  } else if(!password) {
    errors.push('Password is required!');
  } else if(md5(password) !== user.password) {
    errors.push('Password wrong!');
  }

  if(errors.length) {
    return res.render('auth/login', {
      errors,
      values: req.body
    })
  }

  res.locals.user = user;
  next();
}