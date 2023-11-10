import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchProfiles from '../filterProfiles/FilterProfiles';

const Profiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      const url = searchTerm
        ? `https://nf-api.onrender.com/api/v1/social/profiles/${searchTerm}`
        : 'https://nf-api.onrender.com/api/v1/social/profiles';

      fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setProfiles(data);
          } else {
            setProfiles([data]);
          }
        })
        .catch(error => {
          setError('Error fetching profiles. Please try again later.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [searchTerm]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container-sm text-center">
      <h2>Profiles</h2>
      <SearchProfiles 
        searchTerm={searchTerm} 
        onSearch={setSearchTerm} 
      />
      <ul>
        {profiles.map(profile => (
          <li key={profile.name}>
            <h3>
              <Link to={`/profiles/${profile.name}`}>{profile.name}</Link>
            </h3>
            {/* Display additional profile information if needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profiles;
