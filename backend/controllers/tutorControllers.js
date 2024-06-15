const TutorProfile = require('../models/Profile/Tutor-profile');
const StudentProfile = require('../models/Profile/Student-profile');
const TutorChat = require('../models/Chats/Tutor-chat');
const StudentChat = require('../models/Chats/Student-chat');
const tutorNotifications = require('../models/Notifications/TutorNotifications');
const studentNotifications = require('../models/Notifications/StudentNotifications');


const updateTutorProfile = async (req, res) => {
  const tutorId = req.user.userId
  const { bio, subjectsTaught, rate, location, contactInfo } = req.body;

  try {
    const tutorProfile = await TutorProfile.findOne({ tutorId });
    if (!tutorProfile) {
      return res.status(404).json({ message: 'Tutor profile not found' });
    }

    tutorProfile.bio = bio !== undefined ? bio : tutorProfile.bio;
    tutorProfile.location = location !== undefined ? location : tutorProfile.location;
    tutorProfile.rate = rate !== undefined ? rate : tutorProfile.rate;
    tutorProfile.contactInfo = contactInfo !== undefined ? contactInfo : tutorProfile.contactInfo;
    if (subjectsTaught) {
      tutorProfile.subjectsTaught={}
      for (let [subject, classes] of Object.entries(subjectsTaught)) {
        subject = subject.toLowerCase();
        tutorProfile.subjectsTaught.set(subject, classes);
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



const sendMessageToStudent = async (req, res) => {
  const { studentId } = req.params;
  const tutorId = req.user.userId
  const { message } = req.body;

  try {
    let studentChat = await StudentChat.findOne({ studentId });
    if (!studentChat) {
      studentChat = new StudentChat({ studentId, chats: new Map() });
    }

    if (!studentChat.chats.has(tutorId)) {
      studentChat.chats.set(tutorId, {lastChatted: new Date(), messages: []});
    }
    studentChat.chats.get(tutorId).lastChatted= Date.now();
    studentChat.chats.get(tutorId).messages.push({ message, timestamp: new Date() });

    await studentChat.save();
    let tutorChat = await TutorChat.findOne({ tutorId });
    if (!tutorChat) {
      tutorChat = new TutorChat({ tutorId, chats: new Map() });
    }

    if (!tutorChat.chats.has(studentId)) {
      tutorChat.chats.set(studentId, {lastChatted: new Date(), messages: []});
    }
    tutorChat.chats.get(studentId).messages.push({ message, timestamp: new Date(), isSentBySelf: true });
    tutorChat.chats.get(studentId).lastChatted = Date.now()
    await tutorChat.save();

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getMyChats = async (req, res) => {
  const tutorId = req.user.userId

  try {
    const tutorChats = await TutorChat.findOne({ tutorId });
    if (!tutorChats) {
      return res.status(200).json([]);
    }
    const chatsArray = Array.from(tutorChats.chats, ([studentId, chat]) => ({
      studentId,
      lastChatted: chat.lastChatted
    }));
    const studentIds = chatsArray.map(chat => chat.studentId);
    const students = await StudentProfile.find({ studentId: { $in: studentIds } }, 'studentId name');
    const studentsWithChats = students.map(student => {
      const chat = chatsArray.find(chat => chat.studentId === student.studentId.toString());
      return {
        studentId: student.studentId,
        name: student.name,
        lastChatted: chat ? chat.lastChatted : null
      };
    });
    studentsWithChats.sort((a, b) => b.lastChatted - a.lastChatted);
    res.status(200).json(studentsWithChats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const getMessages = async (req, res) => {
  const { studentId } = req.params;
  const tutorId = req.user.userId
  let messages=[]

  try {
    let tutorChat = await TutorChat.findOne({ tutorId });
    if (!tutorChat) {
      return res.status(200).json(messages);
    }
    else {
      if (tutorChat.chats.has(studentId)) {
        messages = tutorChat.chats.get(studentId).messages
      }
      res.status(200).json(messages);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getStudentsInterestedInSubjects = async (req, res) => {
  const tutorId = req.user.userId
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

const myProfileTutor = async (req, res) => {
  try {
    const tutorId = req.user.userId
    const tutor = await TutorProfile.findOne({ tutorId });
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }
    res.status(200).json(tutor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

const getNotifications = async (req, res) => {
  const tutorId = req.user.userId

  try {
    let notification = await tutorNotifications.findOne({ tutorId });
    if (!notification) {
      notification = new tutorNotifications({ tutorId })
    }
    await notification.save()
    res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const updateNotifications = async (req, res) => {
  const { studentId } = req.params;
  const tutorId = req.user.userId

  try {
    let notification = await tutorNotifications.findOne({ tutorId });
    if (!notification) {
      notification = new tutorNotifications({ tutorId })
    }
    else {
      const individualChatCounts = notification.individualChatCount;
      const mapKeys = Array.from(individualChatCounts.keys());
      const countForStudent = mapKeys.includes(studentId) ? individualChatCounts.get(studentId).count : 0;
      notification.count = notification.count - countForStudent;
    }
    await notification.save();
    res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const incrementStudentNotifications = async (req, res) => {
  const { studentId } = req.params;

  try {
    let notification = await studentNotifications.findOne({ studentId });
    if (!notification) {
      notification = new studentNotifications({ studentId });
    }
    notification.count = notification.count + 1;
    await notification.save();
    res.status(200).json(notification);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getIndividualNotifications = async (req, res) => {
  const { studentId } = req.params;
  const tutorId = req.user.userId

  try {
    const notifications = await tutorNotifications.findOne({ tutorId });

    if (!notifications) {
      return res.status(404).json({ message: 'Tutor notifications not found' });
    }

    const individualChatCounts = notifications.individualChatCount;
    const mapKeys = Array.from(individualChatCounts.keys());

    const countForStudent = mapKeys.includes(studentId) ? individualChatCounts.get(studentId).count : 0;

    const response = {
      tutorId: notifications.tutorId,
      studentId,
      unreadCount: countForStudent
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateStudentNotifications = async (req, res) => {
  const { studentId } = req.params;
  const tutorId = req.user.userId

  try {
    let notification = await studentNotifications.findOne({ studentId });
    if (!notification) {
      notification = new studentNotifications({
        studentId,
        count: 0
      });
    }
    if (!notification.individualChatCount.has(tutorId)) {
      notification.individualChatCount.set(tutorId, { count: 1 });
    } else {
      notification.individualChatCount.get(tutorId).count++;
    }
    await notification.save();
    res.status(200).json({ success: true, message: 'Student notifications updated successfully.', count: notification.individualChatCount.get(tutorId).count });
  } catch (error) {
    console.error('Error updating student notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to update student notifications.' });
  }
};

const resetNotifications = async (req, res) => {
  const { studentId } = req.params;
  const tutorId = req.user.userId

  try {
    let notification = await tutorNotifications.findOne({ tutorId });
    if (!notification) {
      notification = new tutorNotifications({
        tutorId,
        count: 0,
      });
    }
    if (!notification.individualChatCount.has(studentId)) {
      notification.individualChatCount.set(studentId, { count: 0 });
    } else {
      notification.individualChatCount.get(studentId).count = 0;
    }
    await notification.save();

    res.status(200).json({ success: true, message: 'Tutor notifications reset successfully.', count: notification.individualChatCount.get(studentId).count });
  } catch (error) {
    console.error('Error updating tutor notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to reset tutor notifications.' });
  }
};

module.exports = {
  updateTutorProfile, subjectsInterested, sendMessageToStudent, getMyChats, getMessages,
  getStudentsInterestedInSubjects, getAllStudents, filterStudents, myProfileTutor, getNotifications, updateNotifications,
  incrementStudentNotifications, getIndividualNotifications, updateStudentNotifications,
  resetNotifications
};
