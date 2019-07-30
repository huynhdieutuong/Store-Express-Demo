module.exports.requireAuth = async (req, res, next) => {
  if(!req.isAuthenticated()) {
    req.flash('error_msg', 'Not Authorized');
    return res.redirect('/auth/login');
  }

  next();
}

module.exports.loggedIn = async (req, res, next) => {
  if(req.isAuthenticated()) {
    return res.redirect('/admin');
  }

  next();
}