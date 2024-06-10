
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TutorCard from '../SharedComponents/TutorCard'; 
import '../../Shared/SharedStyling/Home.css'; 

const Home = ({isLoggedIn}) => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subjects: '',
    class: '',
    minRating: '',
    location: ''
  });

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/general/getAllTutors');
        setTutors(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

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
    <div className="home-container">
      <div className="filter-container">
        <label htmlFor="subjects">Subjects:</label>
        <input type="text" id="subjects" value={filters.subjects} onChange={(e) => handleFilterChange('subjects', e.target.value)} />
        
        <label htmlFor="class">Class:</label>
        <input type="text" id="class" value={filters.class} onChange={(e) => handleFilterChange('class', e.target.value)} />
        
        <label htmlFor="minRating">Minimum Rating:</label>
        <input type="number" id="minRating" value={filters.minRating} onChange={(e) => handleFilterChange('minRating', e.target.value)} />
        
        <label htmlFor="location">Location:</label>
        <input type="text" id="location" value={filters.location} onChange={(e) => handleFilterChange('location', e.target.value)} />
        
        <button onClick={applyFilters}>Apply Filters</button>
      </div>

      <div className="tutor-container-home">
        <h2>Tutors</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="tutor-list-home">
            {tutors.map(tutor => (
              <TutorCard key={tutor._id} tutor={tutor} isLoggedIn={isLoggedIn}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
