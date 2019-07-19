const express = require('express');
const router = express.Router();

const controllers = require('../controllers/cart.controller');

router.get('/', controllers.index);

router.get('/add/:productId', controllers.add);

module.exports = router;