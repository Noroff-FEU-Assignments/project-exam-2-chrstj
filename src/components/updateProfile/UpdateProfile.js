import React, { useState } from 'react';

const UpdateProfile = () => {
  const [bannerUrl, setBannerUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isFieldsVisible, setIsFieldsVisible] = useState(false); 
  const name = localStorage.getItem('name');
  const accessToken = localStorage.getItem('accessToken');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleMediaUpdate = async (e) => {
    e.preventDefault();

    const mediaData = {
      banner: bannerUrl,
      avatar: avatarUrl,
    };

    try {
      const response = await fetch(`https://nf-api.onrender.com/api/v1/social/profiles/${name}/media`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(mediaData),
      });

      if (response.ok) {
        setSuccessMessage('Media updated successfully');
      } else {
        throw new Error('Error updating media ' + response.statusText);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container-sm text-center">
      <button className="btn btn-primary" onClick={() => setIsFieldsVisible(!isFieldsVisible)}>Update Media</button>

      {isFieldsVisible && (
        <form onSubmit={handleMediaUpdate}>
          <div>
            <input type="text" placeholder="Banner Url" value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} />
          </div>
          <div>
            <input type="text" placeholder="Avatar Url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
          </div>
          <button className="btn btn-info">Update</button>
        </form>
      )}

      {error && <div className="text-danger mt-3">{error}</div>}
      {successMessage && <div className="text-success mt-3">{successMessage}</div>}
    </div>
  );
};

export default UpdateProfile;
