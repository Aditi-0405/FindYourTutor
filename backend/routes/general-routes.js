const express = require('express');
const router = express.Router();

const { getAllTutors, filterTutors, tutorProfile } = require('../controllers/general');

router.get('/getAllTutors', getAllTutors);
router.get('/filterTutors', filterTutors);
router.get('/tutorProfile/:tutorId', tutorProfile)

module.exports = router;