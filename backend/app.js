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

const { isAuthenticated } = require('./auth/authenticate')

app.use(bodyParser.json());
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
});

const { getAllTutors, filterTutors } = require('./controllers/general');

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
app.get('/api/general/filterTutors', filterTutors);


