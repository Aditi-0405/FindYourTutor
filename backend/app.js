const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const connectDB = require('./db/connect');
const app = express();
const server = createServer(app);

app.use(bodyParser.json());
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST', 'PATCH']
  }
});

const { registerStudent, registerTutor } = require('./auth/register');
const { studentLogin, tutorLogin } = require('./auth/login');
const { 
  updateTutorProfile, subjectsInterested, sendMessageFromTutorToStudent, getMyChatsTutor, getMessagesTutor,
  getStudentsInterestedInSubjects, getAllStudents, filterStudents, myProfileTutor 
} = require('./controllers/tutorControllers');
const { 
  updateStudentProfile, getSubjectsTaughtByTutor, sendMessageFromStudentToTutor, 
  getMyChatsStudent, getMessagesStudent, getTutorsTeachingSubjects, myProfileStudent 
} = require('./controllers/studentControllers');
const { getAllTutors, filterTutors, getNotificationsTutor, getNotificationsStudent,
   updateNotificationsStudent, updateNotificationsTutor , incrementNotificationsStudent,
    incrementNotificationsTutor, getIndividualNotificationsTutor, getIndividualNotificationsStudent,updateStudentNotifications,
    updateTutorNotifications, resetStudentNotifications, resetTutorNotifications} = require('./controllers/general');

connectDB().then(() => {
  server.listen(5000, () => {
    console.log('Server started on port 5000');
  });
});

io.on('connection', (socket) => {
  // console.log('A user connected: ', socket.id);

  socket.on('joinRoom', ({ studentId, tutorId }) => {
    const room = `${studentId}-${tutorId}`;
    socket.join(room);
    // console.log(`User joined room: ${room}`);
  });

  socket.on('sendMessage', ({ studentId, tutorId, message }) => {
    const room = `${studentId}-${tutorId}`;
    io.to(room).emit('receiveMessage', { message, timestamp: new Date().toISOString() });
  });

  socket.on('disconnect', () => {
    // console.log('User disconnected: ', socket.id);
  });
});


app.post('/api/register/tutor', registerTutor);
app.post('/api/register/student', registerStudent);
app.post('/api/login/tutor', tutorLogin);
app.post('/api/login/student', studentLogin);
app.patch('/api/tutor/updateTutorProfile/:tutorId', updateTutorProfile);
app.patch('/api/student/updateStudentProfile/:studentId', updateStudentProfile);
app.get('/api/student/getSubjectsTaughtByTutor/:tutorId', getSubjectsTaughtByTutor);
app.get('/api/tutor/subjectsInterested/:studentId', subjectsInterested);
app.patch('/api/tutor/sendMessageFromTutorToStudent/:tutorId/student/:studentId', sendMessageFromTutorToStudent);
app.patch('/api/student/sendMessageFromStudentToTutor/:studentId/tutor/:tutorId', sendMessageFromStudentToTutor);
app.get('/api/tutor/getMyChats/:tutorId', getMyChatsTutor);
app.get('/api/student/getMyChats/:studentId', getMyChatsStudent);
app.get('/api/tutor/getMessages/:tutorId/student/:studentId', getMessagesTutor);
app.get('/api/student/getMessages/:studentId/tutor/:tutorId', getMessagesStudent);
app.get('/api/tutor/getStudentsInterestedInSubjects/:tutorId', getStudentsInterestedInSubjects);
app.get('/api/student/getTutorsTeachingSubjects/:studentId', getTutorsTeachingSubjects);
app.get('/api/tutor/getAllStudents', getAllStudents);
app.get('/api/general/getAllTutors', getAllTutors);
app.get('/api/tutor/filterStudents', filterStudents);
app.get('/api/student/filterTutors', filterTutors);
app.get('/api/general/getAllTutors', getAllTutors);
app.get('/api/general/filterTutors', filterTutors);
app.get('/api/tutor/my-profile/:tutorId', myProfileTutor);
app.get('/api/student/my-profile/:studentId', myProfileStudent);
app.get('/notifications/student/:studentId',getNotificationsStudent )
app.get('/notifications/tutor/:tutorId',getNotificationsTutor )
app.patch('/updateNotifications/student/:studentId/tutor/:tutorId',updateNotificationsStudent )
app.patch('/updateNotifications/tutor/:tutorId/student/:studentId',updateNotificationsTutor )
app.patch('/incrementNotifications/student/:studentId',incrementNotificationsStudent )
app.patch('/incrementNotifications/tutor/:tutorId',incrementNotificationsTutor )
app.get('/getIndividualNotificationsTutor/:tutorId/student/:studentId',getIndividualNotificationsTutor )
app.get('/getIndividualNotificationsStudent/:studentId/tutor/:tutorId',getIndividualNotificationsStudent )
app.patch('/updateStudentNotifications/:studentId/tutor/:tutorId',updateStudentNotifications )
app.patch('/updateTutorNotifications/:tutorId/student/:studentId',updateTutorNotifications )
app.patch('/resetTutorNotifications/:tutorId/student/:studentId',resetTutorNotifications )
app.patch('/resetStudentNotifications/:studentId/tutor/:tutorId',resetStudentNotifications )
