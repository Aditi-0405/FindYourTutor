
const express = require('express');
const router = express.Router();

const {
    updateStudentProfile, getSubjectsTaughtByTutor, sendMessageToTutor,
    getMyChats, getMessages, getTutorsTeachingSubjects, myProfileStudent, getNotifications,
    updateNotifications, incrementTutorNotifications,
    getIndividualNotifications,
    updateTutorNotifications, resetNotifications,
} = require('../controllers/studentControllers');

router.patch('/updateStudentProfile', updateStudentProfile);
router.get('/getSubjectsTaughtByTutor/:tutorId', getSubjectsTaughtByTutor);
router.patch('/sendMessageToTutor/:tutorId', sendMessageToTutor);
router.get('/getMyChats', getMyChats);
router.get('/getMessages/:tutorId', getMessages);
router.get('/getTutorsTeachingSubjects', getTutorsTeachingSubjects);
router.get('/my-profile', myProfileStudent);
router.get('/notifications', getNotifications)
router.patch('/updateNotifications/:tutorId', updateNotifications)
router.patch('/incrementTutorNotifications/:tutorId', incrementTutorNotifications)
router.get('/getIndividualNotifications/:tutorId', getIndividualNotifications)
router.patch('/updateTutorNotifications/:tutorId', updateTutorNotifications)
router.patch('/resetNotifications/:tutorId', resetNotifications)

module.exports = router;