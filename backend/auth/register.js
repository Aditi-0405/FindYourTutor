const Student = require('../models/User/Student');
const StudentProfile = require('../models/Profile/Student-profile');
const Tutor = require('../models/User/Tutor');
const TutorProfile = require('../models/Profile/Tutor-profile');

const registerStudent = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const student = new Student({ username, email, password });
    await student.save();

    const studentProfile = new StudentProfile({ studentId: student._id, name:student.username });
    await studentProfile.save();

    res.status(201).json({ message: 'Student registered successfully', student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const registerTutor = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const tutor = new Tutor({ username, email, password });
    await tutor.save();

    const tutorProfile = new TutorProfile({ tutorId: tutor._id, name:tutor.username });
    await tutorProfile.save();

    res.status(201).json({ message: 'Tutor registered successfully', tutor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  registerStudent,registerTutor
};
