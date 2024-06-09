import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../TutorStyling/TutorProfile.css';

const TutorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    subjectsTaught: '',
    rate: '',
    location: '',
    contactInfo: ''
  });

  const tutorId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tutor/my-profile/${tutorId}`);
        setProfile(response.data);
        setFormData({
          bio: response.data.bio,
          subjectsTaught: JSON.stringify(response.data.subjectsTaught), 
          rate: response.data.rate,
          location: response.data.location,
          contactInfo: response.data.contactInfo
        });
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [tutorId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = {
        ...formData,
        subjectsTaught: JSON.parse(formData.subjectsTaught)
      };
      const response = await axios.patch(`http://localhost:5000/api/tutor/updateTutorProfile/${tutorId}`, updatedProfile);
      setProfile(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setError('Failed to update profile');
    }
  };

  if (loading) return <p className="tutor-profile__loading">Loading...</p>;
  if (error) return <p className="tutor-profile__error">{error}</p>;

  return (
    <div className="tutor-profile__container">
      {!isEditing ? (
        <>
          <h2 className="tutor-profile__heading">{profile.name}'s Profile</h2>
          <p className="tutor-profile__info"><strong>Bio:</strong> {profile.bio}</p>
          <p className="tutor-profile__info"><strong>Subjects Taught:</strong> {Object.entries(profile.subjectsTaught).map(([subject, details]) => (
            <span key={subject}>{subject} ({details.join(', ')})</span>
          )).reduce((prev, curr) => prev.length === 0 ? [curr] : [...prev, ', ', curr], [])}</p>
          <p className="tutor-profile__info"><strong>Rate:</strong> ${profile.rate} per hour</p>
          <p className="tutor-profile__info"><strong>Location:</strong> {profile.location}</p>
          <p className="tutor-profile__info"><strong>Contact Info:</strong> {profile.contactInfo}</p>
          <div className="tutor-profile__buttons">
            <button className="tutor-profile__edit-button" onClick={handleEditToggle}>Edit Profile</button>
          </div>
        </>
      ) : (
        <form className="tutor-profile__form" onSubmit={handleFormSubmit}>
          <h2 className="tutor-profile__heading">Edit Profile</h2>
          <div className="tutor-profile__form-group">
            <label htmlFor="bio">Bio:</label>
            <input
              type="text"
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
            />
          </div>
          <div className="tutor-profile__form-group">
            <label htmlFor="subjectsTaught">Subjects Taught:</label>
            <input
              type="text"
              id="subjectsTaught"
              name="subjectsTaught"
              value={formData.subjectsTaught}
              onChange={handleInputChange}
            />
          </div>
          <div className="tutor-profile__form-group">
            <label htmlFor="rate">Rate:</label>
            <input
              type="number"
              id="rate"
              name="rate"
              value={formData.rate}
              onChange={handleInputChange}
            />
          </div>
          <div className="tutor-profile__form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>
          <div className="tutor-profile__form-group">
            <label htmlFor="contactInfo">Contact Info:</label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleInputChange}
            />
          </div>
          <div className="tutor-profile__buttons">
            <button className="tutor-profile__save-button" type="submit">Save</button>
            <button className="tutor-profile__cancel-button" type="button" onClick={handleEditToggle}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TutorProfile;
