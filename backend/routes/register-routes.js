const express = require('express');
const router = express.Router();

const { registerStudent, registerTutor } = require('../auth/register');

router.post('/tutor', registerTutor);
router.post('/student', registerStudent)

module.exports = router;