
const express = require('express');
const router = express.Router();

const {
    updateTutorProfile, subjectsInterested, sendMessageToStudent, getMyChats, getMessages,
    getStudentsInterestedInSubjects, getAllStudents, filterStudents, myProfileTutor, getNotifications, updateNotifications,
    incrementStudentNotifications, getIndividualNotifications, updateStudentNotifications,
    resetNotifications
} = require('../controllers/tutorControllers');

router.patch('/updateTutorProfile', updateTutorProfile);
router.get('/subjectsInterested/:studentId', subjectsInterested);
router.patch('/sendMessageToStudent/:studentId', sendMessageToStudent);
router.get('/getMyChats', getMyChats);
router.get('/getMessages/:studentId', getMessages);
router.get('/getStudentsInterestedInSubjects', getStudentsInterestedInSubjects);
router.get('/getAllStudents', getAllStudents);
router.get('/filterStudents', filterStudents);
router.get('/my-profile', myProfileTutor);
router.get('/notifications', getNotifications)
router.patch('/updateNotifications/:studentId', updateNotifications)
router.patch('/incrementStudentNotifications/:studentId', incrementStudentNotifications)
router.get('/getIndividualNotifications/:studentId', getIndividualNotifications)
router.patch('/updateStudentNotifications/:studentId', updateStudentNotifications)
router.patch('/resetNotifications/:studentId', resetNotifications)

module.exports = router;