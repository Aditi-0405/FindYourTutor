import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TutorCard from '../StudentComponents/TutorCard';
import '../../Shared/SharedStyling/Dashboard.css';

const StudentDashboard = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subjects: '',
    location: '',
    minRating: ''
  });
  const studentId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/student/getTutorsTeachingSubjects/${studentId}`);
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
      const response = await axios.get('http://localhost:5000/api/student/filterTutors', {
        params: filters
      });
      setTutors(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="filter-container">
        <label htmlFor="subjects">Subjects:</label>
        <input type="text" id="subjects" value={filters.subjects} onChange={(e) => handleFilterChange('subjects', e.target.value)} />
        
        <label htmlFor="location">Location:</label>
        <input type="text" id="location" value={filters.location} onChange={(e) => handleFilterChange('location', e.target.value)} />
        
        <label htmlFor="minRating">Minimum Rating:</label>
        <input type="number" id="minRating" value={filters.minRating} onChange={(e) => handleFilterChange('minRating', e.target.value)} />
        
        <button onClick={applyFilters} className="filter-button">Apply Filters</button>
      </div>
      <h2>Tutors</h2>

      <div className="list-container">
        {loading ? (
          <p className="loading-message">Loading...</p>
        ) : (
          tutors.map(tutor => (
            <TutorCard key={tutor._id} tutor={tutor} />
          ))
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
