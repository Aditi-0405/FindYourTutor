const TutorProfile = require('../models/Profile/Tutor-profile');

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
            { [`subjectsTaught.${subject.toLowerCase()}`]: { $exists: true } },
            { [`subjectsTaught.${subject.toLowerCase()}`]: { $in: classArray } }
          ]
        }));
      }
      else if (subjectsArray.length > 0) {
        query.$or = subjectsArray.map(subject => ({
          $and: [
            { [`subjectsTaught.${subject.toLowerCase()}`]: { $exists: true } },
          ]
        }));
      }
      else if (classArray.length > 0) {
        const allTutors = await TutorProfile.find();
        const allSubjectsTaught = allTutors.map(tutor => Array.from(tutor.subjectsTaught.keys())).flat();
        query.$or = allSubjectsTaught.map(subject => ({
          $and: [
            { [`subjectsTaught.${subject.toLowerCase()}`]: { $in: classArray } }
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
const tutorProfile = async (req, res) => {
  try {
    const {tutorId} = req.params
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

module.exports = {
  getAllTutors, filterTutors, tutorProfile
};