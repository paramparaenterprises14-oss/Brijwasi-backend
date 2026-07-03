const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../controller/contactController');

router.post('/', submitContactForm);

module.exports = router;