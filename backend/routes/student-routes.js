
const express = require('express');
const router = express.Router();

const {
    updateStudentProfile, getSubjectsTaughtByTutor, sendMessageFromStudentToTutor,
    getMyChatsStudent, getMessagesStudent, getTutorsTeachingSubjects, myProfileStudent
} = require('../controllers/studentControllers');

router.patch('/updateStudentProfile/:studentId', updateStudentProfile);
router.get('/getSubjectsTaughtByTutor/:tutorId', getSubjectsTaughtByTutor);
router.patch('/sendMessageFromStudentToTutor/:studentId/tutor/:tutorId', sendMessageFromStudentToTutor);
router.get('/getMyChats/:studentId', getMyChatsStudent);
router.get('/getMessages/:studentId/tutor/:tutorId', getMessagesStudent);
router.get('/getTutorsTeachingSubjects/:studentId', getTutorsTeachingSubjects);
router.get('/my-profile/:studentId', myProfileStudent);

module.exports = router;