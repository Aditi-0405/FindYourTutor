const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db/connect');

const app = express();
app.use(bodyParser.json());
app.use(cors());


const {registerStudent, registerTutor} = require('./auth/register')
const {updateTutorProfile, subjectsInterested, sendMessageFromTutorToStudent,getMyChatsTutor} = require('./controllers/tutorControllers')
const {updateStudentProfile, getSubjectsTaughtByTutor, sendMessageFromStudentToTutor, getMyChatsStudent} = require('./controllers/studentControllers')


connectDB().then(() => {
  app.listen(5000, () => {
    console.log('Server started on port 5000');
  });
});

app.post('/register/tutor', registerTutor)
app.post('/register/student', registerStudent)
app.patch('/api/tutor/updateTutorProfile/:tutorId', updateTutorProfile)
app.patch('/api/student/updateStudentProfile/:studentId', updateStudentProfile)
app.get('/api/student/getSubjectsTaughtByTutor/:tutorId', getSubjectsTaughtByTutor)
app.get('/api/tutor/subjectsInterested/:studentId', subjectsInterested)
app.patch('/api/tutor/sendMessageFromTutorToStudent/:tutorId/student/:studentId', sendMessageFromTutorToStudent)
app.patch('/api/tutor/sendMessageFromStudentToTutor/:studentId/tutor/:tutorId', sendMessageFromStudentToTutor)
app.get('/api/tutor/getMyChats/:tutorId', getMyChatsTutor)
app.get('/api/student/getMyChats/:studentId', getMyChatsStudent)