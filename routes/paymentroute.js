const express = require('express');
const router = express.Router();
const { checkoutform, success } = require('../controllers/paymentcontroller');

router.post('/checkout', checkoutform);
router.get('/success', success)

module.exports = router;