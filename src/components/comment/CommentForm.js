import React, { useState } from 'react';

const CommentForm = ({ postId, onCommentSubmit }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText) {
      onCommentSubmit(postId, commentText);
      setCommentText('');
    }
  };

  return (
    <div className="card-container justify-content-center align-items-center">
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        required
      />
      <div>
      <button className="btn btn-info mb-4">Comment</button>
      </div>
    </form>
    </div>
  );
};

export default CommentForm;