const express = require('express');
const router = express.Router();

const controllers = require('../controllers/auth.controller');
const validates = require('../validates/auth.validate');
const { loggedIn } = require('../middlewares/auth.middleware');

router.get('/login', loggedIn, controllers.login);
router.post('/login', loggedIn, controllers.postLogin);

router.get('/logout', controllers.logout);

router.get('/register', controllers.register);
router.post('/register', validates.postRegister, controllers.postRegister);

module.exports = router;