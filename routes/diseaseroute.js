const express = require('express');
const router = express.Router();
const { diseaselist, diseasebyid } = require('../controllers/diseasecontroller')

router.get('/', diseaselist);

// particular disease page route get method
// using params
router.get('/:id', diseasebyid);

module.exports=router;