const express = require('express');
const router = express.Router();
const { addtocartget, addtocartpost, deletecart, inc, dec } = require('../controllers/cartcontroller');

router.get('/addtocart',addtocartget)

router.post('/addtocart',addtocartpost)

router.post('/deletecart', deletecart)

router.post('/descquantity', dec)

router.post('/incquantity', inc)

module.exports=router