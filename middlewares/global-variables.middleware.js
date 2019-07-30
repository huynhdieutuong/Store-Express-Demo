module.exports = (req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
 
  res.locals.user = req.user;

  next();
}