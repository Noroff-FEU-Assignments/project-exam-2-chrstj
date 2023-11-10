import React, { useState, useEffect } from 'react';

const PostDetails = ({ match }) => {
  const postId = match.params.id;
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [reactionSymbol, setReactionSymbol] = useState('');

  useEffect(() => {
    // Retrieve access token from localStorage
    const accessToken = localStorage.getItem('accessToken');

    // Check if the user is authenticated (access token exists)
    if (accessToken) {
      // Make a GET request to the specific post endpoint after authentication
      fetch(`https://nf-api.onrender.com/api/v1/social/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => response.json())
        .then(data => {
          // Update state with the received post data
          setPost(data);
        })
        .catch(error => {
          console.error('Error fetching post:', error);
        });
    } else {
      // Redirect the user to the login page if not authenticated
      // For example: history.push('/login');
    }
  }, [postId]); // Re-run effect when postId changes

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // Make a POST request to the comment endpoint
    fetch(`https://nf-api.onrender.com/api/v1/social/posts/${postId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({ body: comment })
    })
      .then(response => response.json())
      .then(data => {
        // Handle successful comment submission, e.g., update UI
        console.log('Comment posted successfully:', data);
      })
      .catch(error => {
        console.error('Error posting comment:', error);
      });
  };

  const handleReact = () => {
    // Make a PUT request to the react endpoint
    fetch(`https://nf-api.onrender.com/api/v1/social/posts/${postId}/react/${reactionSymbol}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        // Handle successful reaction submission, e.g., update UI
        console.log('Post reacted successfully:', data);
      })
      .catch(error => {
        console.error('Error reacting to post:', error);
      });
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <p>{post.comments.body}</p>

      {/* Comment Form */}
      <form onSubmit={handleCommentSubmit}>
        <textarea
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button type="submit">Post Comment</button>
      </form>

      {/* Reaction Form */}
      <label>
        Reaction Symbol:
        <input type="text" value={reactionSymbol} onChange={(e) => setReactionSymbol(e.target.value)} />
      </label>
      <button onClick={handleReact}>React</button>
    </div>
  );
};

export default PostDetails;
