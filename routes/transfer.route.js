const express = require('express');
const router = express.Router();

const controllers = require('../controllers/transfer.controller');
const validates = require('../validates/transfer.validate');

router.get('/create', controllers.create);
router.post('/create', validates.postCreate, controllers.postCreate);

module.exports = router;