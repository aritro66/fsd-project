const express = require('express');
const router = express.Router();
const { landing, home, myaccount, doctor, about, myorder } = require('../controllers/othercontroller')

router.get('/', landing);

router.get('/home', home);

router.get('/myaccount', myaccount);

router.get('/doctor', doctor);

router.get('/about', about);

router.get('/myorder', myorder);

module.exports = router;