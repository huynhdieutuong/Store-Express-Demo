const express = require('express');
const router = express.Router();

const controllers = require('../controllers/products.controller');

router.get('/', controllers.index);

router.get('/search', controllers.search);

router.get('/:productId', controllers.view);

module.exports = router;