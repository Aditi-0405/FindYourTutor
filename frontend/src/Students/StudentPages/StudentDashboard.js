import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TutorCard from '../../Shared/SharedComponents/TutorCard';
import '../StudentStyling/StudentDashboard.css';


const StudentDashboard = ({isLoggedIn}) => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subjects: '',
    location: '',
    minRating: '',
    class: '',
    rate: ''
  });
  const studentId = localStorage.getItem('userId');
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axios.get(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/student/getTutorsTeachingSubjects`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        setTutors(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchTutors();
  }, [studentId]);

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const applyFilters = async () => {
    try {
      const response = await axios.get(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/general/filterTutors`, {
        params: filters
      });
      setTutors(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="student-dashboard-container">
      <div className="filter-container">
        <label htmlFor="subjects">Subjects:</label>
        <input type="text" id="subjects" value={filters.subjects} onChange={(e) => handleFilterChange('subjects', e.target.value)} />

        <label htmlFor="class">Class:</label>
        <input type="text" id="class" value={filters.class} onChange={(e) => handleFilterChange('class', e.target.value)} />

        <label htmlFor="minRating">Min Rating:</label>
        <input type="number" id="minRating" value={filters.minRating} onChange={(e) => handleFilterChange('minRating', e.target.value)} />

        <label htmlFor="class">Rate</label>
        <input type="number" id="class" value={filters.rate} onChange={(e) => handleFilterChange('rate', e.target.value)} />

        <label htmlFor="location">Location:</label>
        <input type="text" id="location" value={filters.location} onChange={(e) => handleFilterChange('location', e.target.value)} />

        <button onClick={applyFilters}>Filter</button>
      </div>
      <h2 className="student-tutors-heading">Tutors</h2>
      <div className="student-tutor-container">
        {loading ? (
          <p className="loading-message">Loading...</p>
        ) : tutors.length === 0 ? (
          <p className='tutor-no-matches-message'>No matches found.</p>
        ) : (
          <div className="student-tutor-list">
            {tutors.map(tutor => (
              <TutorCard key={tutor._id} tutor={tutor} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

};

export default StudentDashboard;
