import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentCard from '../TutorComponents/StudentCard';
import '../TutorStyling/TutorDashboard.css';

const TutorDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subjects: '',
    class: '',
    location: '',
    minRating: ''
  });
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/tutor/getStudentsInterestedInSubjects`, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
      });
        setStudents(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const applyFilters = async () => {
    try {
      const response = await axios.get('https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/tutor/filterStudents', {
        params: filters, 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        
      });
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="tutor-dashboard-container">
      <div className="filter-container">
        <label htmlFor="tutor-subjects">Subjects:</label>
        <input type="text" id="tutor-subjects" value={filters.subjects} onChange={(e) => handleFilterChange('subjects', e.target.value)} />
        
        <label htmlFor="tutor-class">Class:</label>
        <input type="text" id="tutor-class" value={filters.class} onChange={(e) => handleFilterChange('class', e.target.value)} />
        
        <label htmlFor="tutor-location">Location:</label>
        <input type="text" id="tutor-location" value={filters.location} onChange={(e) => handleFilterChange('location', e.target.value)} />
        
        <label htmlFor="tutor-minRating">Minimum Rating:</label>
        <input type="number" id="tutor-minRating" value={filters.minRating} onChange={(e) => handleFilterChange('minRating', e.target.value)} />
        
        <button onClick={applyFilters} className="tutor-filter-button">Apply Filters</button>
      </div>
      <h2 className="tutor-students-heading">Students</h2>
      <div className="tutor-student-container">
        <div className="tutor-student-list">
          {loading ? (
            <p className="tutor-loading-message">Loading...</p>
          ) : students.length === 0 ? (
            <p className="tutor-no-matches-message">Oops! No matches found.</p>
          ) : (
            students.map(student => (
              <StudentCard key={student._id} student={student} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
