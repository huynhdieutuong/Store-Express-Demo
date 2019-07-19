const express = require('express');
const router = express.Router();

const controllers = require('../controllers/admin.controller');
const validateCreateProduct = require('../validates/create-product.validate');

const upload = require('../upload');

router.get('/', controllers.index);

router.get('/search-product', controllers.searchProduct);

router.get('/create-product', controllers.createProduct);
router.post('/create-product', upload.array('images', 5), validateCreateProduct, controllers.postCreateProduct);

// router.get('/edit-product/:productId', controllers.editProduct);
// router.put('/edit-product/:productId', controllers.putEditProduct);

// router.delete('/delete-product/:productId', controllers.deleteProduct);

module.exports = router;