import React, { useState } from 'react';
import CommentForm from '../comment/CommentForm';

const Comment = ({ postId }) => {
  const [error, setError] = useState(null);

  const handleCommentSubmit = async (postId, commentText) => {
    try {
      const response = await fetch(`https://nf-api.onrender.com/api/v1/social/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ body: commentText })
      });

      if (response.ok) {
        setError(null); 
      } else {
        setError(`Error posting comment: ${response.statusText}`);
      }
    } catch (error) {
      setError(`Error posting comment: ${error.message}`);
    }
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      <CommentForm postId={postId} onCommentSubmit={handleCommentSubmit} />
    </div>
  );
};

export default Comment;
