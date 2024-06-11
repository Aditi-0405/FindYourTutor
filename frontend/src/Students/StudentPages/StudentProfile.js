import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import '../StudentStyling/StudentProfile.css';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    class: '',
    subjectsInterested: [],
    location: '',
    contactInfo: ''
  });

  const studentId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const subjectOptions = [
    { value: 'Math', label: 'Math' },
    { value: 'Science', label: 'Science' },
    { value: 'History', label: 'History' },
    { value: 'English', label: 'English' },
    { value: 'Art', label: 'Art' },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_BASE_URL}/api/student/my-profile`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        setProfile(response.data);
        setFormData({
          bio: response.data.bio,
          class: response.data.class,
          subjectsInterested: response.data.subjectsInterested.map(subject => ({ value: subject, label: subject })),
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
  }, [studentId, token]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubjectChange = (selectedOptions) => {
    setFormData({ ...formData, subjectsInterested: selectedOptions });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = {
        ...formData,
        subjectsInterested: formData.subjectsInterested.map(subject => subject.value)
      };
      const response = await axios.patch(`http://${process.env.REACT_APP_BACKEND_BASE_URL}/api/student/updateStudentProfile`, updatedProfile, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setProfile(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setError('Failed to update profile');
    }
  };

  if (loading) return <p className="student-profile__loading">Loading...</p>;
  if (error) return <p className="student-profile__error">{error}</p>;

  return (
    <div className="student-profile__container">
      {!isEditing ? (
        <>
          <h2 className="student-profile__heading">{profile.name}</h2>
          <p className="student-profile__info"><strong>Bio:</strong> {profile.bio || 'N/A'}</p>
          <p className="student-profile__info"><strong>Class:</strong> {profile.class || 'N/A'}</p>
          <p className="student-profile__info"><strong>Subjects Interested:</strong> {profile.subjectsInterested.join(', ').toUpperCase()}</p>
          <p className="student-profile__info"><strong>Location:</strong> {profile.location || 'N/A'}</p>
          <p className="student-profile__info"><strong>Contact Info:</strong> {profile.contactInfo || 'N/A'}</p>
          <div className="student-profile__buttons">
            <button className="student-profile__edit-button" onClick={handleEditToggle}>Edit Profile</button>
          </div>
        </>
      ) : (
        <form className="student-profile__form" onSubmit={handleFormSubmit}>
          <h2 className="student-profile__heading">Edit Profile</h2>
          <div className="student-profile__form-group">
            <label htmlFor="bio">Bio:</label>
            <input
              type="text"
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
            />
          </div>
          <div className="student-profile__form-group">
            <label htmlFor="class">Class:</label>
            <input
              type="text"
              id="class"
              name="class"
              value={formData.class}
              onChange={handleInputChange}
            />
          </div>
          <div className="student-profile__form-group">
            <label htmlFor="subjectsInterested">Subjects Interested:</label>
            <CreatableSelect
              id="subjectsInterested"
              name="subjectsInterested"
              isMulti
              value={formData.subjectsInterested}
              options={subjectOptions}
              onChange={handleSubjectChange}
            />
          </div>
          <div className="student-profile__form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />
          </div>
          <div className="student-profile__form-group">
            <label htmlFor="contactInfo">Contact Info:</label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleInputChange}
            />
          </div>
          <div className="student-profile__buttons">
            <button className="student-profile__save-button" type="submit">Save</button>
            <button className="student-profile__cancel-button" type="button" onClick={handleEditToggle}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default StudentProfile;
