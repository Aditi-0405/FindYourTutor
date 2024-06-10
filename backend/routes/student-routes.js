
const express = require('express');
const router = express.Router();

const {
    updateStudentProfile, getSubjectsTaughtByTutor, sendMessageFromStudentToTutor,
    getMyChatsStudent, getMessagesStudent, getTutorsTeachingSubjects, myProfileStudent, getNotifications,
    updateNotifications, incrementNotifications,
    getIndividualNotifications,
    updateTutorNotifications, resetNotifications,
} = require('../controllers/studentControllers');

router.patch('/updateStudentProfile/:studentId', updateStudentProfile);
router.get('/getSubjectsTaughtByTutor/:tutorId', getSubjectsTaughtByTutor);
router.patch('/sendMessageFromStudentToTutor/:studentId/tutor/:tutorId', sendMessageFromStudentToTutor);
router.get('/getMyChats/:studentId', getMyChatsStudent);
router.get('/getMessages/:studentId/tutor/:tutorId', getMessagesStudent);
router.get('/getTutorsTeachingSubjects/:studentId', getTutorsTeachingSubjects);
router.get('/my-profile/:studentId', myProfileStudent);
router.get('/notifications/:studentId', getNotifications)
router.patch('/updateNotifications/:studentId/tutor/:tutorId', updateNotifications)
router.patch('/incrementNotifications/tutor/:tutorId', incrementNotifications)
router.get('/getIndividualNotifications/:studentId/tutor/:tutorId', getIndividualNotifications)
router.patch('/updateTutorNotifications/:tutorId/student/:studentId', updateTutorNotifications)
router.patch('/resetNotifications/:studentId/tutor/:tutorId', resetNotifications)

module.exports = router;