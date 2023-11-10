import React, { useState } from 'react';

const CreatePostForm = () => {
  const [postData, setPostData] = useState({
    title: '',
    body: '',
    media: '',
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData({
      ...postData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      fetch('https://nf-api.onrender.com/api/v1/social/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(postData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.errors) {
            setError(`Error creating post: ${data.errors}`);
          } else {
            setError(null);
          }
        })
        .catch((error) => {
          setError(`Error creating post: ${error.message}`);
        });
    } else {
      setError('Unauthorized user');
    }
  };

  return (
    <div className="card-container justify-content-center align-items-center">
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" name="title" placeholder="Title" value={postData.title} onChange={handleInputChange} />
        </div>
        <div>
          <textarea name="body" placeholder="Body" value={postData.body} onChange={handleInputChange} />
        </div>
        <div>
          <input type="text" name="media" placeholder="Media URL" value={postData.media} onChange={handleInputChange} />
        </div>
        <button className="btn btn-info" type="submit">Post</button>
      </form>
    </div>
  );
};

export default CreatePostForm;
