
const express = require('express');
const router = express.Router();

const {
    updateTutorProfile, subjectsInterested, sendMessageFromTutorToStudent, getMyChatsTutor, getMessagesTutor,
    getStudentsInterestedInSubjects, getAllStudents, filterStudents, myProfileTutor, getNotifications, updateNotifications,
    incrementStudentNotifications, getIndividualNotifications, updateStudentNotifications,
    resetNotifications
} = require('../controllers/tutorControllers');

router.patch('/updateTutorProfile/:tutorId', updateTutorProfile);
router.get('/subjectsInterested/:studentId', subjectsInterested);
router.patch('/sendMessageFromTutorToStudent/:tutorId/student/:studentId', sendMessageFromTutorToStudent);
router.get('/getMyChats/:tutorId', getMyChatsTutor);
router.get('/getMessages/:tutorId/student/:studentId', getMessagesTutor);
router.get('/getStudentsInterestedInSubjects/:tutorId', getStudentsInterestedInSubjects);
router.get('/getAllStudents', getAllStudents);
router.get('/filterStudents', filterStudents);
router.get('/my-profile/:tutorId', myProfileTutor);
router.get('/notifications/:tutorId', getNotifications)
router.patch('/updateNotifications/:tutorId/student/:studentId', updateNotifications)
router.patch('/incrementStudentNotifications/:studentId', incrementStudentNotifications)
router.get('/getIndividualNotifications/:tutorId/student/:studentId', getIndividualNotifications)
router.patch('/updateStudentNotifications/:studentId/tutor/:tutorId', updateStudentNotifications)
router.patch('/resetNotifications/:tutorId/student/:studentId', resetNotifications)

module.exports = router;