const Student = require('../models/User/Student');
const StudentProfile = require('../models/Profile/Student-profile');
const Tutor = require('../models/User/Tutor');
const TutorProfile = require('../models/Profile/Tutor-profile');

const registerStudent = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const student = new Student({ username, email, password });
    await student.save();

    const studentProfile = new StudentProfile({ studentId: student._id, name: student.username });
    await studentProfile.save();

    res.status(201).json({ message: 'Student registered successfully', student });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(400).json({ message: 'Email address is already in use' });
    }
    res.status(500).json({ message: 'Could not register. Try after some time!' });
  }
};

const registerTutor = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const tutor = new Tutor({ username, email, password });
    await tutor.save();

    const tutorProfile = new TutorProfile({ tutorId: tutor._id, name: tutor.username });
    await tutorProfile.save();

    res.status(201).json({ message: 'Tutor registered successfully', tutor });
  } catch (error) {
    console.log(error);
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(400).json({ message: 'Email address is already in use' });
    }
    res.status(500).json({ message: 'Could not register. Try after some time' });
  }
};

module.exports = {
  registerStudent, registerTutor
};
