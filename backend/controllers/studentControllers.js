const TutorProfile = require('../models/Profile/Tutor-profile');
const StudentProfile = require('../models/Profile/Student-profile');
const TutorChat = require('../models/Chats/Tutor-chat');
const StudentChat = require('../models/Chats/Student-chat');

const updateStudentProfile = async (req, res) => {
    const { studentId } = req.params;
    const { bio, subjectsInterested, class: studentClass, location, contactInfo } = req.body;
  
    try {
      const studentProfile = await StudentProfile.findOne({ studentId });
      if (!studentProfile) {
        return res.status(404).json({ message: 'Student profile not found' });
      }
      studentProfile.bio = bio !== undefined ? bio : studentProfile.bio;
      studentProfile.class = studentClass !== undefined ? studentClass : studentProfile.class;
      studentProfile.location = location !== undefined ? location : studentProfile.location;
      studentProfile.contactInfo = contactInfo !== undefined ? contactInfo : studentProfile.contactInfo;
      if (subjectsInterested !== undefined) {
        subjectsInterested.forEach(subject => {
            subject=subject.toLowerCase()
          if (!studentProfile.subjectsInterested.includes(subject)) {
            studentProfile.subjectsInterested.push(subject);
          }
        });
      }
      await studentProfile.save();
      res.status(200).json(studentProfile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

const getSubjectsTaughtByTutor = async (req, res) => {
  const { tutorId } = req.params;

  try {
    const tutorProfile = await TutorProfile.findOne({ tutorId });
    if (!tutorProfile) {
      return res.status(404).json({ message: 'Tutor profile not found' });
    }
    const subjectsTaught = Array.from(tutorProfile.subjectsTaught.keys());

    res.status(200).json({ subjectsTaught });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



const sendMessageFromStudentToTutor = async (req, res) => {
  const { tutorId, studentId } = req.params;
  const { message } = req.body;

  try {

    let tutorChat = await TutorChat.findOne({ tutorId });
    if (!tutorChat) {
      tutorChat = new TutorChat({ tutorId, chats: {} });
    }

    if (!tutorChat.chats.has(studentId)) {
      tutorChat.chats.set(studentId, []);
    }

    tutorChat.chats.get(studentId).push({ message, timestamp: new Date() });

    await tutorChat.save();

    let studentChat = await StudentChat.findOne({ studentId });
    if (!studentChat) {
      studentChat = new StudentChat({ studentId, chats: {} });
    }

    if (!studentChat.chats.has(tutorId)) {
      studentChat.chats.set(tutorId, []);
    }
    
    studentChat.chats.get(tutorId).push({ message, timestamp: new Date(), isSentBySelf:true });

    await studentChat.save();


    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


  module.exports = {
    updateStudentProfile,getSubjectsTaughtByTutor,sendMessageFromStudentToTutor
  };
  