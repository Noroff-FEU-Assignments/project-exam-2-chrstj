import React from 'react';

const SearchProfiles = ({ searchTerm, onSearch }) => {
    const handleSearch = () => {
      onSearch(searchTerm);
    };

    return (
      <div>
        <input
          type="text"
          placeholder="Search Profiles"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>Search</button>
      </div>
    );
  };
  
export default SearchProfiles;
