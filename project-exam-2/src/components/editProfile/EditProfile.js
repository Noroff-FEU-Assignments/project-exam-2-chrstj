import React, { useState } from 'react';

const EditProfile = ({ name, accessToken, onUpdateProfile }) => {
  const [banner, setBanner] = useState('');
  const [avatar, setAvatar] = useState('');

  const handleUpdateProfile = () => {
    // Make a PUT request to update user's banner and avatar
    fetch(`https://nf-api.onrender.com/api/v1/social/profiles/${name}/media`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ banner, avatar }),
    })
      .then(response => response.json())
      .then(data => {
        onUpdateProfile(data); // Pass updated profile data to the parent component
      })
      .catch(error => {
        console.error('Error updating profile:', error);
      });
  };

  return (
    <div>
      <label>
        Banner URL:
        <input type="text" value={banner} onChange={e => setBanner(e.target.value)} />
      </label>
      <br />
      <label>
        Avatar URL:
        <input type="text" value={avatar} onChange={e => setAvatar(e.target.value)} />
      </label>
      <br />
      <button onClick={handleUpdateProfile}>Update Profile</button>
    </div>
  );
};

export default EditProfile;
