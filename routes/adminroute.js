const express = require('express');
const router = express.Router();
const { admin, block, unblock } = require('../controllers/admincontroller');

router.get('/admin', admin);

router.post('/block', block);

router.post('/unblock', unblock);

module.exports = router;