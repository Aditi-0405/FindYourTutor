const TutorProfile = require('../models/Profile/Tutor-profile');
const StudentProfile = require('../models/Profile/Student-profile')

const getAllTutors = async (req, res) => {
  const { page, perPage } = req.query;

  try {
    const pageNumber = parseInt(page) || 1;
    const limit = parseInt(perPage) || 10; 

    const tutors = await TutorProfile.find()
      .sort({ rating: -1 })
      .skip((pageNumber - 1) * limit)
      .limit(limit);

    res.status(200).json(tutors, );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const filterTutors = async (req, res) => {
  const { subjects, class: studentClass, minRating, location, rate, page, perPage } = req.query;
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
      } else if (subjectsArray.length > 0) {
        query.$or = subjectsArray.map(subject => ({
          [`subjectsTaught.${subject.toLowerCase()}`]: { $exists: true }
        }));
      } else if (classArray.length > 0) {
        const allTutors = await TutorProfile.find();
        const allSubjectsTaught = allTutors.map(tutor => Array.from(tutor.subjectsTaught.keys())).flat();
        query.$or = allSubjectsTaught.map(subject => ({
          [`subjectsTaught.${subject.toLowerCase()}`]: { $in: classArray }
        }));
      }
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }


    if (rate) {
      query.rate = { $lte: parseInt(rate) };
    }

    const pageNumber = parseInt(page) || 1;
    const limit = parseInt(perPage) || 10; 

    const tutors = await TutorProfile.find(query)
      .sort({ rating: -1 })
      .skip((pageNumber - 1) * limit)
      .limit(limit);

    res.status(200).json(tutors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const tutorProfile = async (req, res) => {
  try {
    const { tutorId } = req.params
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

const getTutorReviews = async (req, res) => {
  const { tutorId } = req.params;

  try {
    const tutor = await TutorProfile.findOne({ tutorId });

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor profile not found' });
    }
    let reviews = []
    reviews = await Promise.all(
      Array.from(tutor.reviews.entries()).map(async ([studentId, review]) => {
        const student = await StudentProfile.findOne({ studentId });
        return {
          username: student ? student.name : 'Unknown',
          rating: review.rating,
          comment: review.comment
        };
      })
    );

    res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = {
  getAllTutors, filterTutors, tutorProfile, getTutorReviews
};