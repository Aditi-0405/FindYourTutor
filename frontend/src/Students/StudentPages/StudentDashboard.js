import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TutorCard from '../StudentComponents/TutorCard';
import '../StudentStyling/StudentDashboard.css';

const StudentDashboard = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subjects: '',
    location: '',
    minRating: ''
  });
  const studentId = localStorage.getItem('userId');
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/student/getTutorsTeachingSubjects`, {
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
      const response = await axios.get('http://localhost:5000/api/general/filterTutors', {
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
        <label htmlFor="student-subjects">Subjects:</label>
        <input type="text" id="student-subjects" value={filters.subjects} onChange={(e) => handleFilterChange('subjects', e.target.value)} />

        <label htmlFor="student-location">Location:</label>
        <input type="text" id="student-location" value={filters.location} onChange={(e) => handleFilterChange('location', e.target.value)} />

        <label htmlFor="student-minRating">Minimum Rating:</label>
        <input type="number" id="student-minRating" value={filters.minRating} onChange={(e) => handleFilterChange('minRating', e.target.value)} />

        <button onClick={applyFilters} className="student-filter-button">Apply Filters</button>
      </div>
      <h2 className="student-tutors-heading">Tutors</h2>
      <div className="student-tutor-container">
      <div className="student-tutor-list">
        {loading ? (
          <p className="student-loading-message">Loading...</p>
        ) : (
          tutors.map(tutor => (
            <TutorCard key={tutor._id} tutor={tutor} />
          ))
        )}
      </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
