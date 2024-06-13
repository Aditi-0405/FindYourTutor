const TutorProfile = require('../models/Profile/Tutor-profile');
const StudentProfile = require('../models/Profile/Student-profile');
const TutorChat = require('../models/Chats/Tutor-chat');
const StudentChat = require('../models/Chats/Student-chat');
const studentNotifications = require('../models/Notifications/StudentNotifications');
const tutorNotifications = require('../models/Notifications/TutorNotifications');

const updateStudentProfile = async (req, res) => {
  const studentId = req.user.userId

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
    studentProfile.subjectsInterested = subjectsInterested !== undefined ? subjectsInterested : studentProfile.subjectsInterested;
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



const sendMessageToTutor = async (req, res) => {
  const { tutorId } = req.params;
  const studentId = req.user.userId

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

    studentChat.chats.get(tutorId).push({ message, timestamp: new Date(), isSentBySelf: true });

    await studentChat.save();


    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const getMyChats = async (req, res) => {
  const studentId = req.user.userId

  try {
    const studentChats = await StudentChat.findOne({ studentId: studentId });
    if (!studentChats) {
      return res.status(200).json([]);
    }
    const chatsArray = Array.from(studentChats.chats, ([tutorId, messages]) => ({ tutorId, messages }));
    const tutorIds = chatsArray.map(chat => chat.tutorId);
    const tutors = await TutorProfile.find({ tutorId: { $in: tutorIds } }, 'tutorId name');
    res.status(200).json(tutors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getMessages = async (req, res) => {
  const { tutorId } = req.params;
  const studentId = req.user.userId

  try {
    let studentChat = await StudentChat.findOne({ studentId });
    if (!studentChat) {
      return res.status(404).json({ message: 'User Not Found' });
    }
    else {
      let messages = []
      if (studentChat.chats.has(tutorId)) {
        messages = studentChat.chats.get(tutorId)
      }
      res.status(200).json(messages);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getTutorsTeachingSubjects = async (req, res) => {
  const studentId = req.user.userId

  try {
    const studentProfile = await StudentProfile.findOne({ studentId: studentId });
    if (!studentProfile) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    const subjectsInterested = studentProfile.subjectsInterested
    const tutors = await TutorProfile.find();
    const matchingTutors = tutors.filter(tutor => {
      const subjectsTaught = Array.from(tutor.subjectsTaught.keys());
      return subjectsTaught.some(subject => subjectsInterested.includes(subject));
    });

    res.status(200).json(matchingTutors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const myProfileStudent = async (req, res) => {
  try {
    const studentId = req.user.userId

    const student = await StudentProfile.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


const getNotifications = async (req, res) => {
  const studentId = req.user.userId

  try {
    let notification = await studentNotifications.findOne({ studentId });
    if (!notification) {
      notification = new studentNotifications({ studentId });
    }
    await notification.save()
    res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const updateNotifications = async (req, res) => {
  const { tutorId } = req.params;
  const studentId = req.user.userId

  try {
    let notification = await studentNotifications.findOne({ studentId });
    if (!notification) {
      notification = new studentNotifications({ studentId });
    }
    else {


      const individualChatCounts = notification.individualChatCount;
      const mapKeys = Array.from(individualChatCounts.keys());

      const countForTutor = mapKeys.includes(tutorId)
        ? individualChatCounts.get(tutorId).count
        : 0;
      notification.count = notification.count - countForTutor;
    }
    await notification.save();
    res.status(200).json(notification);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const incrementTutorNotifications = async (req, res) => {
  const { tutorId } = req.params;

  try {
    let notification = await tutorNotifications.findOne({ tutorId });
    if (!notification) {
      notification = new tutorNotifications({ tutorId });
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
  const { tutorId } = req.params;
  const studentId = req.user.userId

  try {
    const notifications = await studentNotifications.findOne({ studentId });

    if (!notifications) {
      return res.status(404).json({ message: 'Student notifications not found' });
    }

    const individualChatCounts = notifications.individualChatCount;
    const mapKeys = Array.from(individualChatCounts.keys());

    const countForTutor = mapKeys.includes(tutorId)
      ? individualChatCounts.get(tutorId).count
      : 0;

    const response = {
      studentId: notifications.studentId,
      tutorId,
      unreadCount: countForTutor
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateTutorNotifications = async (req, res) => {
  const { tutorId } = req.params;
  const studentId = req.user.userId

  try {
    let notification = await tutorNotifications.findOne({ tutorId });
    if (!notification) {
      notification = new tutorNotifications({
        tutorId,
        count: 0,
      });
    }
    if (!notification.individualChatCount.has(studentId)) {
      notification.individualChatCount.set(studentId, { count: 1 });
    } else {
      notification.individualChatCount.get(studentId).count++;
    }
    await notification.save();

    res.status(200).json({ success: true, message: 'Tutor notifications updated successfully.', count: notification.individualChatCount.get(studentId).count });
  } catch (error) {
    console.error('Error updating tutor notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to update tutor notifications.' });
  }
};


const resetNotifications = async (req, res) => {
  const { tutorId } = req.params;
  const studentId = req.user.userId

  try {
    let notification = await studentNotifications.findOne({ studentId });
    if (!notification) {
      notification = new studentNotifications({
        studentId,
        count: 0,
      });
    }
    if (!notification.individualChatCount.has(tutorId)) {
      notification.individualChatCount.set(tutorId, { count: 0 });
    } else {
      notification.individualChatCount.get(tutorId).count = 0;
    }
    await notification.save();

    res.status(200).json({ success: true, message: 'Student notifications reset successfully.', count: notification.individualChatCount.get(tutorId).count });
  } catch (error) {
    console.error('Error updating student notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to reset student notifications.' });
  }
};
const rateTutor = async (req, res) => {
  const { tutorId } = req.params;
  const studentId = req.user.userId;
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({ message: 'Rating and comment are required' });
  }

  try {
    const tutor = await TutorProfile.findOne({ tutorId });

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor profile not found' });
    } else {
      if (!tutor.reviews.has(studentId)) {
        tutor.reviews.set(studentId, { rating, comment });
        tutor.rating = ((tutor.rating * tutor.review_cnt) + rating) / (tutor.review_cnt + 1);
        tutor.review_cnt++;
      } else {
        const initial_rating = tutor.reviews.get(studentId).rating;
        tutor.rating = ((tutor.review_cnt * tutor.rating) - initial_rating + rating) / tutor.review_cnt;
        tutor.reviews.get(studentId).rating = rating;
        tutor.reviews.get(studentId).comment = comment;
      }

      await tutor.save();
      return res.status(200).json({ message: 'Review added successfully' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  updateStudentProfile, getSubjectsTaughtByTutor, sendMessageToTutor, getMyChats,
  getMessages, getTutorsTeachingSubjects, myProfileStudent, getNotifications, updateNotifications,
  incrementTutorNotifications, getIndividualNotifications,
  updateTutorNotifications, resetNotifications, rateTutor
};
