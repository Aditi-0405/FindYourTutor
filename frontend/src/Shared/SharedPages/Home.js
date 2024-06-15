import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TutorCard from '../SharedComponents/TutorCard';
import '../../Shared/SharedStyling/Home.css';

const Home = ({ isLoggedIn }) => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    subjects: '',
    class: '',
    minRating: '',
    location: '',
    rate: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10
  });

  useEffect(() => {
    fetchTutors();
  }, [pagination]);

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/general/filterTutors`, {
        params: { ...filters, ...pagination }
      });
      setTutors(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tutors:', error);
      setError('Failed to load tutors. Please try again later.');
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const applyFilters = () => {
    setPagination({ ...pagination, page: 1 });
    fetchTutors();
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  return (
    <div className="home-container">
      <div className="filter-container">
        <label htmlFor="subjects">Subjects:</label>
        <input type="text" id="subjects" value={filters.subjects} onChange={(e) => handleFilterChange('subjects', e.target.value)} />

        <label htmlFor="class">Class:</label>
        <input type="text" id="class" value={filters.class} onChange={(e) => handleFilterChange('class', e.target.value)} />

        <label htmlFor="minRating">Min Rating:</label>
        <input type="number" id="minRating" value={filters.minRating} onChange={(e) => handleFilterChange('minRating', e.target.value)} />

        <label htmlFor="rate">Rate</label>
        <input type="number" id="rate" value={filters.rate} onChange={(e) => handleFilterChange('rate', e.target.value)} />

        <label htmlFor="location">Location:</label>
        <input type="text" id="location" value={filters.location} onChange={(e) => handleFilterChange('location', e.target.value)} />

        <button onClick={applyFilters}>Filter</button>
      </div>

      <div className="tutor-container-home">
        <h2>Tutors</h2>
        {loading ? (
          <p className='loading-message'>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <div className="tutor-list-home">
              {tutors.map(tutor => (
                <TutorCard key={tutor._id} tutor={tutor} isLoggedIn={isLoggedIn} />
              ))}
            </div>
            <div className="pagination-container">
              <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1}>
                Previous
              </button>
              <span>{pagination.page}</span>
              <button onClick={() => handlePageChange(pagination.page + 1)} disabled={tutors.length < pagination.perPage || tutors.length === 0}>
                Next
              </button>
            </div>


          </>
        )}
      </div>
    </div>
  );
};

export default Home;
