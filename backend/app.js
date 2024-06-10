const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const connectDB = require('./db/connect');
const app = express();
const server = createServer(app);

const registerRoutes = require('./routes/register-routes')
const loginRoutes = require('./routes/login-routes')
const studentRoutes = require('./routes/student-routes')
const tutorRoutes = require('./routes/tutor-routes')

const {isAuthenticated} = require('./auth/authenticate')

app.use(bodyParser.json());
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST', 'PATCH']
  }
});

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
  socket.on('joinRoom', ({ studentId, tutorId }) => {
    const room = `${studentId}-${tutorId}`;
    socket.join(room);
  });

  socket.on('sendMessage', ({ studentId, tutorId, message }) => {
    const room = `${studentId}-${tutorId}`;
    io.to(room).emit('receiveMessage', { message, timestamp: new Date().toISOString() });
  });
});


app.use('/api/register', registerRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/student', studentRoutes)
app.use('/api/tutor', tutorRoutes)


app.get('/api/general/getAllTutors', getAllTutors);
app.get('/api/general/getAllTutors', getAllTutors);
app.get('/api/general/filterTutors', filterTutors);
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
