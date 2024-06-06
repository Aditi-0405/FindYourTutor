
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
    minRating: '',
    location: ''
  });
  const tutorId = localStorage.getItem('userId')

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tutor/getStudentsInterestedInSubjects/${tutorId}`);
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
      const response = await axios.get('http://localhost:5000/api/tutor/filterStudents', {
        params: filters
      });
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="filter-container">
        <label htmlFor="subjects">Subjects:</label>
        <input type="text" id="subjects" value={filters.subjects} onChange={(e) => handleFilterChange('subjects', e.target.value)} />
        
        <label htmlFor="class">Class:</label>
        <input type="text" id="class" value={filters.class} onChange={(e) => handleFilterChange('class', e.target.value)} />
        
        <label htmlFor="location">Location:</label>
        <input type="text" id="location" value={filters.location} onChange={(e) => handleFilterChange('location', e.target.value)} />
        
        <button onClick={applyFilters} className="filter-button">Apply Filters</button>
      </div>
      <h2>Students</h2>

      <div className="tutor-list">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {students.map(student => (
              <StudentCard key={student._id} student={student} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorDashboard;
