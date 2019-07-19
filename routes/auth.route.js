const express = require('express');
const router = express.Router();

const controllers = require('../controllers/auth.controller');
const validates = require('../validates/auth.validate');

router.get('/login', controllers.login);
router.post('/login', validates.postLogin, controllers.postLogin);

router.get('/register', controllers.register);
router.post('/register', validates.postRegister, controllers.postRegister);

module.exports = router;