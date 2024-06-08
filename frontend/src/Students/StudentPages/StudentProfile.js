import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../StudentStyling/StudentProfile.css';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    class: '',
    subjectsInterested: '',
    location: '',
    contactInfo: ''
  });

  const studentId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/student/my-profile/${studentId}`);
        setProfile(response.data);
        setFormData({
          bio: response.data.bio,
          class: response.data.class,
          subjectsInterested: response.data.subjectsInterested.join(', '), 
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
  }, [studentId]);

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
        subjectsInterested: formData.subjectsInterested.split(',').map(subject => subject.trim()) 
      };
      const response = await axios.patch(`http://localhost:5000/api/student/updateStudentProfile/${studentId}`, updatedProfile);
      setProfile(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setError('Failed to update profile');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="profile-container">
      {isEditing ? (
        <form onSubmit={handleFormSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="bio">Bio:</label>
            <input
              type="text"
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="class">Class:</label>
            <input
              type="text"
              id="class"
              name="class"
              value={formData.class}
              onChange={handleInputChange}

            />
          </div>
          <div className="form-group">
            <label htmlFor="subjectsInterested">Subjects Interested:</label>
            <input
              type="text"
              id="subjectsInterested"
              name="subjectsInterested"
              value={formData.subjectsInterested}
              onChange={handleInputChange}

            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactInfo">Contact Info:</label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={handleEditToggle}>Cancel</button>
          </div>
        </form>
      ) : (
        <div>
          <h2>{profile.name}'s Profile</h2>
          <p><strong>Bio:</strong> {profile.bio}</p>
          <p><strong>Class:</strong> {profile.class}</p>
          <p><strong>Subjects Interested:</strong> {profile.subjectsInterested.join(', ')}</p>
          <p><strong>Location:</strong> {profile.location}</p>
          <p><strong>Contact Info:</strong> {profile.contactInfo}</p>
          <button onClick={handleEditToggle}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;