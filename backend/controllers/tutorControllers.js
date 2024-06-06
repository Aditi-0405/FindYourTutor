const TutorProfile = require('../models/Profile/Tutor-profile');
const StudentProfile = require('../models/Profile/Student-profile');
const TutorChat = require('../models/Chats/Tutor-chat');
const StudentChat = require('../models/Chats/Student-chat');


const updateTutorProfile = async (req, res) => {
  const { tutorId } = req.params;
  const { bio, subjectsTaught, rate, location, contactInfo } = req.body;

  try {
    const tutorProfile = await TutorProfile.findOne({ tutorId });
    if (!tutorProfile) {
      return res.status(404).json({ message: 'Tutor profile not found' });
    }

    tutorProfile.bio = bio !== undefined ? bio : tutorProfile.bio;
    tutorProfile.location = location !== undefined ? location : tutorProfile.location;
    tutorProfile.contactInfo = contactInfo !== undefined ? contactInfo : tutorProfile.contactInfo;
    if (subjectsTaught) {
      for (let [subject, classes] of Object.entries(subjectsTaught)) {
        subject = subject.toLowerCase();
        if (tutorProfile.subjectsTaught.has(subject)) {
          const existingClasses = tutorProfile.subjectsTaught.get(subject);
          const updatedClasses = Array.from(new Set([...existingClasses, ...classes]));
          tutorProfile.subjectsTaught.set(subject, updatedClasses);
        } else {
          tutorProfile.subjectsTaught.set(subject, classes);
        }
      }
    }

    await tutorProfile.save();
    res.status(200).json(tutorProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const subjectsInterested = async (req, res) => {
  const { studentId } = req.params;

  try {
    const studentProfile = await StudentProfile.findOne({ studentId });
    if (!studentProfile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    const subjectsInterested = studentProfile.subjectsInterested;

    res.status(200).json({ subjectsInterested });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



const sendMessageFromTutorToStudent = async (req, res) => {
  const { tutorId, studentId } = req.params;
  const { message } = req.body;

  try {
    let studentChat = await StudentChat.findOne({ studentId });
    if (!studentChat) {
      studentChat = new StudentChat({ studentId, chats: {} });
    }

    if (!studentChat.chats.has(tutorId)) {
      studentChat.chats.set(tutorId, []);
    }
    
    studentChat.chats.get(tutorId).push({ message, timestamp: new Date() });

    await studentChat.save();
    let tutorChat = await TutorChat.findOne({ tutorId });
    if (!tutorChat) {
      tutorChat = new TutorChat({ tutorId, chats: {} });
    }

    if (!tutorChat.chats.has(studentId)) {
      tutorChat.chats.set(studentId, []);
    }

    tutorChat.chats.get(studentId).push({ message, timestamp: new Date(), isSentBySelf:true });

    await tutorChat.save();

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getMyChatsTutor = async (req, res) => {
  const { tutorId } = req.params;

  try {
    const tutorChats = await TutorChat.findOne({ tutorId });
    if (!tutorChats) {
      return res.status(404).json({ message: 'No chats found for the tutor' });
    }
    const chatsArray = Array.from(tutorChats.chats, ([studentId, messages]) => ({ studentId, messages }));
    const studentIds = chatsArray.map(chat => chat.studentId);
    const students = await StudentProfile.find({ studentId: { $in: studentIds } }, 'studentId name');
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const getMessagesTutor = async (req, res) => {
  const { tutorId , studentId} = req.params;

  try {
    let tutorChat = await TutorChat.findOne({ tutorId });
    if (!tutorChat) {
      return res.status(404).json({ message: 'User Not Found' });
    }
    else{
      let messages=[]
      if (tutorChat.chats.has(studentId)) {
        messages=tutorChat.chats.get(studentId)
      }
      res.status(200).json(messages);
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getStudentsInterestedInSubjects = async (req, res) => {
  const { tutorId } = req.params;

  try {
    const tutorProfile = await TutorProfile.findOne({ tutorId });
    if (!tutorProfile) {
      return res.status(404).json({ message: 'Tutor profile not found' });
    }
    const subjectsTaught = Array.from(tutorProfile.subjectsTaught.keys());
    const students = await StudentProfile.find();
    const interestedStudents = students.filter(student => {
      return student.subjectsInterested.some(subject => subjectsTaught.includes(subject));
    });

    res.status(200).json(interestedStudents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const getAllStudents = async (req, res) => {

  try {
    const students = await StudentProfile.find();
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const filterStudents = async (req, res) => {
  const { subjects, class: studentClass, minRating, location } = req.query;

  try {
    let query = {};

    if (subjects) {
      query.subjectsInterested = { $in: subjects.split(',') };
    }

    if (studentClass) {
      query.class = { $in: studentClass.split(',') };
    }


    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const students = await StudentProfile.find(query);

    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = {
  updateTutorProfile,subjectsInterested, sendMessageFromTutorToStudent,getMyChatsTutor,getMessagesTutor,
  getStudentsInterestedInSubjects, getAllStudents, filterStudents
};
