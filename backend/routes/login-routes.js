const express = require('express');
const router = express.Router();

const { tutorLogin, studentLogin } = require('../auth/login');

router.post('/tutor', tutorLogin);
router.post('/student', studentLogin)

module.exports = router;