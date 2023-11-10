import React, { useState, useEffect } from 'react';
import Comment from '../comment/Comment';
import ReactToPost from '../reactToPost/ReactToPost';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserProfile from '../userProfile/UserProfile';

const MyProfile = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedPost, setEditedPost] = useState(null);
  const name = localStorage.getItem('name');
  const accessToken = localStorage.getItem('accessToken');

  const handleDeletePost = (postId) => {
    fetch(`https://nf-api.onrender.com/api/v1/social/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        if (response.ok) {
          setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        } else {
          throw new Error('Failed to delete post');
        }
      })
      .catch(error => {
        setError('Error deleting post');
      });
  };

  const handleUpdatePost = (postId, updatedPost) => {
    fetch(`https://nf-api.onrender.com/api/v1/social/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updatedPost),
    })
      .then(response => {
        if (response.ok) {
          setPosts(prevPosts =>
            prevPosts.map(post => (post.id === postId ? updatedPost : post))
          );
          setEditedPost(null);
        } else {
          throw new Error('Failed to update post');
        }
      })
      .catch(error => {
        setError('Error updating post');
      });
  };

  useEffect(() => {
    if (accessToken && name) {
      fetch(`https://nf-api.onrender.com/api/v1/social/profiles/${name}/posts`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Unauthorized');
        })
        .then(data => {
          if (Array.isArray(data)) {
            setPosts(data);
          } else {
            throw new Error('Invalid API response');
          }
          setLoading(false);
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
        });
    } else {
      setError('Unauthorized');
      setLoading(false);
    }
  }, [name, accessToken]);

  const handleComment = async (postId) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const response = await fetch(`https://nf-api.onrender.com/api/v1/social/posts/${postId}/comment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ body: 'Your comment text here' })
        });

        if (response.ok) {
          const updatedPostsResponse = await fetch('https://nf-api.onrender.com/api/v1/social/posts?_comments=true&_author=true&_reactions=true', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          if (updatedPostsResponse.ok) {
            const data = await updatedPostsResponse.json();
            setPosts(data);
          } else {
            setError('Error fetching updated posts');
          }
        } else {
          setError('Error posting comment');
        }
      } catch (error) {
        setError('Error posting comment');
      }
    } else {
      setError('Unauthorized user');
    }
  };

  return (
    <div className="container-sm text-center">
      <UserProfile />
      <h2>My Posts</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            {editedPost && editedPost.id === post.id ? (
              <div>
                <input
                  type="text"
                  placeholder="Enter new title"
                  value={editedPost.title}
                  onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
                />
                <br />
                <textarea
                  placeholder="Enter new body"
                  value={editedPost.body}
                  onChange={(e) => setEditedPost({ ...editedPost, body: e.target.value })}
                  required
                />
                <br />
                <button className="btn btn-primary" onClick={() => handleUpdatePost(post.id, editedPost)}>Update</button>
                <button className="btn btn-secondary" onClick={() => setEditedPost(null)}>Cancel</button>
              </div>
            ) : (
              <div className="card-container justify-content-center align-items-center">
                <Card>
                  <Card.Body>
                    <Card.Title><h2><Link to={`/posts/${post.id}`}>{post.title}</Link></h2></Card.Title>
                    <p>{post.body}</p>
                    <button className="btn btn-secondary" onClick={() => ReactToPost(post.id, '👍')}>👍</button>
                    <button className="btn btn-secondary" onClick={() => ReactToPost(post.id, '😄')}>😄</button>
                    <button className="btn btn-secondary" onClick={() => ReactToPost(post.id, '😢')}>😢</button>
                    <Comment postId={post.id} onCommentSubmit={handleComment} />
                    <button className="btn btn-secondary" onClick={() => setEditedPost(post)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDeletePost(post.id)}>Delete</button>
                  </Card.Body>
                </Card>
              </div>
            )}
          </li>
        ))}
      </ul>
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default MyProfile;
