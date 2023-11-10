import React, { useState, useEffect } from 'react';
import UpdateProfile from '../updateProfile/UpdateProfile';

const UserProfile = () => {
  const [bannerUrl, setBannerUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');

  const name = localStorage.getItem('name');
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    fetch(`https://nf-api.onrender.com/api/v1/social/profiles/${name}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Error fetching profile data');
      })
      .then(data => {
        setBannerUrl(data.banner);
        setAvatarUrl(data.avatar);
        setUserName(data.name);
      })
      .catch(error => {
        setError(error.message);
      });
  }, [name, accessToken]);

  return (
    <div>
      {bannerUrl && <img className="banner" src={bannerUrl} alt="Banner" />}
      {avatarUrl && <img className="avatar" src={avatarUrl} alt="Avatar" />}
      <h1>{userName}</h1>
      <UpdateProfile />
      {error && <div className="text-danger mt-3">{error}</div>}
    </div>
  );
};

export default UserProfile;
