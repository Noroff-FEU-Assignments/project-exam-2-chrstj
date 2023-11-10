import React, { useState } from 'react';

const Unfollow = ({ name }) => {
  const [error, setError] = useState(null);

  const handleUnfollow = async (name) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      try {
        const response = await fetch(`https://nf-api.onrender.com/api/v1/social/profiles/${name}/unfollow`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({}) 
        });

        if (response.ok) {
          setError(null);
        } else {
          setError(`Error unfollowing profile: ${response.statusText}`);
        }
      } catch (error) {
        setError(`Error unfollowing profile: ${error.message}`);
      }
    } else {
      setError('Unauthorized user');
    }
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      <button className="btn btn-danger" onClick={() => handleUnfollow(name)}>Unfollow</button>
    </div>
  );
};

export default Unfollow;
