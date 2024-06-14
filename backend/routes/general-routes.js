const express = require('express');
const router = express.Router();

const { getAllTutors, filterTutors, tutorProfile, getTutorReviews } = require('../controllers/general');

router.get('/getAllTutors', getAllTutors);
router.get('/filterTutors', filterTutors);
router.get('/tutorProfile/:tutorId', tutorProfile)
router.get('/getTutorReviews/:tutorId', getTutorReviews)

module.exports = router;