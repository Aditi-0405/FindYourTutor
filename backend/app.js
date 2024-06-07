const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db/connect');

const app = express();
app.use(bodyParser.json());
app.use(cors());


const {registerStudent, registerTutor} = require('./auth/register')
const {studentLogin, tutorLogin} = require('./auth/login')
const {updateTutorProfile, subjectsInterested, sendMessageFromTutorToStudent,getMyChatsTutor,getMessagesTutor,
  getStudentsInterestedInSubjects, getAllStudents, filterStudents, myProfileTutor} = require('./controllers/tutorControllers')
const {updateStudentProfile, getSubjectsTaughtByTutor, sendMessageFromStudentToTutor, 
  getMyChatsStudent, getMessagesStudent, getTutorsTeachingSubjects, myProfileStudent} = require('./controllers/studentControllers')
const{getAllTutors,filterTutors}= require('./controllers/general')


connectDB().then(() => {
  app.listen(5000, () => {
    console.log('Server started on port 5000');
  });
});

app.post('/api/register/tutor', registerTutor)
app.post('/api/register/student', registerStudent)
app.post('/api/login/tutor', tutorLogin)
app.post('/api/login/student', studentLogin)
app.patch('/api/tutor/updateTutorProfile/:tutorId', updateTutorProfile)
app.patch('/api/student/updateStudentProfile/:studentId', updateStudentProfile)
app.get('/api/student/getSubjectsTaughtByTutor/:tutorId', getSubjectsTaughtByTutor)
app.get('/api/tutor/subjectsInterested/:studentId', subjectsInterested)
app.patch('/api/tutor/sendMessageFromTutorToStudent/:tutorId/student/:studentId', sendMessageFromTutorToStudent)
app.patch('/api/tutor/sendMessageFromStudentToTutor/:studentId/tutor/:tutorId', sendMessageFromStudentToTutor)
app.get('/api/tutor/getMyChats/:tutorId', getMyChatsTutor)
app.get('/api/student/getMyChats/:studentId', getMyChatsStudent)
app.get('/api/tutor/getMessages/:tutorId/student/:studentId', getMessagesTutor)
app.get('/api/student/getMessages/:studentId/tutor/:tutorId', getMessagesStudent)
app.get('/api/tutor/getStudentsInterestedInSubjects/:tutorId', getStudentsInterestedInSubjects)
app.get('/api/student/getTutorsTeachingSubjects/:studentId', getTutorsTeachingSubjects)
app.get('/api/tutor/getAllStudents', getAllStudents)
app.get('/api/tutor/getAllStudents', getAllTutors)
app.get('/api/tutor/filterStudents', filterStudents)
app.get('/api/student/filterTutors', filterTutors)
app.get('/api/general/getAllTutors', getAllTutors)
app.get('/api/general/filterTutors', filterTutors)
app.get('/api/tutor/my-profile/:tutorId', myProfileTutor)
app.get('/api/student/my-profile/:studentId', myProfileStudent)
