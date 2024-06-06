const jwt = require('jsonwebtoken');

const Student = require('../models/User/Student');
const Tutor = require('../models/User/Tutor');

const studentLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const student = await Student.findOne({ email });
        if (!student || !(await student.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: student._id, role: 'student' }, 'secret', { expiresIn: '2h' });
        res.json({ token, userId: student._id, username: student.username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const tutorLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const tutor = await Tutor.findOne({ email });
        if (!tutor || !(await tutor.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: tutor._id, role: 'tutor' }, 'secret', { expiresIn: '2h' });
        res.json({ token, userId: tutor._id, username: tutor.username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { studentLogin, tutorLogin };
