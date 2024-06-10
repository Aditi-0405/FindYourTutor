const express = require('express');
const router = express.Router();

const { getAllTutors, filterTutors } = require('../controllers/general');

router.get('/getAllTutors', getAllTutors);
router.get('/filterTutors', filterTutors)

module.exports = router;