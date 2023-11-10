import React, { useState } from 'react';

const Follow = ({ name }) => {
  const [error, setError] = useState(null);

  const handleFollow = async (name) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      try {
        const response = await fetch(`https://nf-api.onrender.com/api/v1/social/profiles/${name}/follow`, {
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
          setError(`Error following profile: ${response.statusText}`);
        }
      } catch (error) {
        setError(`Error following profile: ${error.message}`);
      }
    } else {
      setError('Unauthorized user');
    }
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      <button className="btn btn-info" onClick={() => handleFollow(name)}>Follow</button>
    </div>
  );
};

export default Follow;
