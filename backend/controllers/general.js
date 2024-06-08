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
        console.log("notification was null")
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
      console.log(notification.count)
      notification.count = notification.count+1;
      console.log(notification.count);
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
  
module.exports = {
getAllTutors, filterTutors, getNotificationsStudent,getNotificationsTutor, updateNotificationsTutor, updateNotificationsStudent, 
incrementNotificationsStudent, incrementNotificationsTutor
};