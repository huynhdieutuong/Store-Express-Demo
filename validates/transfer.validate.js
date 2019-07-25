const User = require('../models/user.model');

module.exports.postCreate = async (req, res, next) => {
  const { email, amount } = req.body;
  const you = await User.findById(req.signedCookies.userId);
  const user = await User.findOne({ email });
  
  let errors = [];
  if(!email) {
    errors.push('Email is required!');
  } else if (!user) {
    errors.push('Email does not exist!');
  } else if (you.email === email) {
    errors.push('Can not send to yourself!');
  } else if (!amount) {
    errors.push('Amount is required!');
  } else if (amount > 10000) {
    errors.push('Amount over 10000!');
  }

  if(errors.length) {
    return res.render('transfer/create', { 
      errors, 
      values: req.body, 
      csrfToken: req.csrfToken()
    });
  }

  next();

}