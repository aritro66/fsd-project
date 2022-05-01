const express = require('express');
const router = express.Router();
const { productlist, productbyid } = require('../controllers/productcontroller');

router.get('/', productlist);

// singleproduct page route get method
router.get('/:id', productbyid);

module.exports = router;