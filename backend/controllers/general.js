const TutorProfile = require('../models/Profile/Tutor-profile');
const StudentProfile = require('../models/Profile/Student-profile');
const TutorChat = require('../models/Chats/Tutor-chat');
const StudentChat = require('../models/Chats/Student-chat');
const tutorNotifications = require('../models/Notifications/TutorNotifications');
const studentNotifications = require('../models/Notifications/StudentNotifications');

const getAllTutors = async (req, res) => {

    try {
        const tutors = await TutorProfile.find();
        res.status(200).json(tutors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const filterTutors = async (req, res) => {
    const { subjects, class: studentClass, minRating, location } = req.query;
  
    try {
      let query = {};
  
      if (subjects || studentClass) {
        const subjectsArray = subjects ? subjects.split(',') : [];
        const classArray = studentClass ? studentClass.split(',') : [];
  
        if (subjectsArray.length > 0 && classArray.length > 0) {
          query.$or = subjectsArray.map(subject => ({
            $and: [
              { [`subjectsTaught.${subject}`]: { $exists: true } },
              { [`subjectsTaught.${subject}`]: { $in: classArray } }
            ]
          }));
        } 
        else if(subjectsArray.length > 0){
          query.$or = subjectsArray.map(subject => ({
            $and: [
              { [`subjectsTaught.${subject}`]: { $exists: true } },
            ]
          }));
        }
        else if(classArray.length>0) {
          const allTutors = await TutorProfile.find();
          const allSubjectsTaught = allTutors.map(tutor => Array.from(tutor.subjectsTaught.keys())).flat();
          query.$or = allSubjectsTaught.map(subject =>({
            $and: [
              { [`subjectsTaught.${subject}`]: { $in: classArray } }
            ]
          }))
        }
      }
      if (minRating) {
        query.rate = { $gte: parseInt(minRating) };
      }
  
      if (location) {
        query.location = { $regex: location, $options: 'i' };
      }
  
      const tutors = await TutorProfile.find(query);
      res.status(200).json(tutors);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const getNotificationsStudent = async (req, res) => {
    const { studentId } = req.params;
  
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
  const getNotificationsTutor = async (req, res) => {
    const { tutorId } = req.params;
  
    try {
      let notification = await tutorNotifications.findOne({ tutorId });
      if (!notification) {
        notification = new tutorNotifications({tutorId})
      }
      await notification.save()
      res.status(200).json(notification);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  const updateNotificationsTutor = async (req, res) => {
    const { tutorId } = req.params;
  
    try {
      let notification = await tutorNotifications.findOne({ tutorId });
      if (!notification) {
        notification = new tutorNotifications({tutorId})
      }
      else{
        notification.count = 0;
      }
      await notification.save();
      res.status(200).json(notification);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  const updateNotificationsStudent = async (req, res) => {
    const { studentId } = req.params;
  
    try {
      let notification = await studentNotifications.findOne({ studentId });
      if (!notification) {
        notification = new studentNotifications({ studentId });
      }
      else{
        notification.count =0;
      }
      await notification.save();
      res.status(200).json(notification);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  const incrementNotificationsStudent = async (req, res) => {
    const { studentId } = req.params;
  
    try {
      let notification = await studentNotifications.findOne({ studentId });
      if (!notification) {
        notification = new studentNotifications({ studentId });
      }
      await notification.save();
      res.status(200).json(notification);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  const incrementNotificationsTutor = async (req, res) => {
    const { tutorId } = req.params;
  
    try {
      let notification = await tutorNotifications.findOne({ tutorId });
      if (!notification) {
        notification = new tutorNotifications({ tutorId });
      }
      notification.count = notification.count+1;
      await notification.save();
      res.status(200).json(notification);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const getIndividualNotificationsTutor = async (req, res) => {
    const { tutorId, studentId } = req.params;
  
    try {
      console.log(tutorId);
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

  const getIndividualNotificationsStudent = async (req, res) => {
    const { tutorId, studentId } = req.params;
  
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
  

const updateStudentNotifications = async (req, res) => {
    const { studentId, tutorId } = req.params;

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
        res.status(200).json({ success: true, message: 'Student notifications updated successfully.' ,count: notification.individualChatCount.get(tutorId).count});
    } catch (error) {
        console.error('Error updating student notifications:', error);
        res.status(500).json({ success: false, message: 'Failed to update student notifications.' });
    }
};

const updateTutorNotifications = async (req, res) => {
    const { tutorId, studentId } = req.params;

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

        res.status(200).json({ success: true, message: 'Tutor notifications updated successfully.' ,count: notification.individualChatCount.get(studentId).count});
    } catch (error) {
        console.error('Error updating tutor notifications:', error);
        res.status(500).json({ success: false, message: 'Failed to update tutor notifications.' });
    }
};


const resetStudentNotifications = async (req, res) => {
  const { studentId, tutorId } = req.params;

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

      res.status(200).json({ success: true, message: 'Student notifications reset successfully.' , count: notification.individualChatCount.get(tutorId).count});
  } catch (error) {
      console.error('Error updating student notifications:', error);
      res.status(500).json({ success: false, message: 'Failed to reset student notifications.' });
  }
};

const resetTutorNotifications = async (req, res) => {
  const { tutorId, studentId } = req.params;

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

      res.status(200).json({ success: true, message: 'Tutor notifications reset successfully.' , count: notification.individualChatCount.get(studentId).count});
  } catch (error) {
      console.error('Error updating tutor notifications:', error);
      res.status(500).json({ success: false, message: 'Failed to reset tutor notifications.' });
  }
};

module.exports = {
getAllTutors, filterTutors, getNotificationsStudent,getNotificationsTutor, updateNotificationsTutor, updateNotificationsStudent, 
incrementNotificationsStudent, incrementNotificationsTutor,getIndividualNotificationsTutor, getIndividualNotificationsStudent,updateStudentNotifications,
updateTutorNotifications, resetStudentNotifications, resetTutorNotifications
};