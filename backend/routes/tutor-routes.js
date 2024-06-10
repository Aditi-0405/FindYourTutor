
const express = require('express');
const router = express.Router();

const {
    updateTutorProfile, subjectsInterested, sendMessageFromTutorToStudent, getMyChatsTutor, getMessagesTutor,
    getStudentsInterestedInSubjects, getAllStudents, filterStudents, myProfileTutor
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

module.exports = router;