import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Follow from '../followUnfollow/Follow';
import Unfollow from '../followUnfollow/Unfollow';
import ReactToPost from '../reactToPost/ReactToPost';
import Comment from '../comment/Comment';
import { Card } from 'react-bootstrap';

const SingleProfile = () => {
  const { name } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      fetch(`https://nf-api.onrender.com/api/v1/social/profiles/${name}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => response.json())
        .then(data => {
          setProfile(data);
        })
        .catch(error => {
          setError('Error fetching profile data. Please try again later.');
        })
        .finally(() => {
          setLoading(false);
        });

      fetch(`https://nf-api.onrender.com/api/v1/social/profiles/${name}/posts?_comments=true&_author=true&_reactions=true`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(response => response.json())
        .then(data => {
          setPosts(data || []);
        })
        .catch(error => {
          setError('Error fetching posts. Please try again later.');
        });
    } else {
      setLoading(false);
    }
  }, [name]);

  const handleComment = async (postId, commentText) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      try {
        const response = await fetch(`https://nf-api.onrender.com/api/v1/social/posts/${postId}/comment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ body: commentText })
        });

        if (!response.ok) {
          setError('Error posting comment');
        }
      } catch (error) {
        setError('Error posting comment');
      }
    } else {
      setError('Unauthorized user');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container-sm text-center">
      {profile.banner && (
        <img className="banner"
          src={profile.banner}
          alt="Banner"
          style={{ width: '100%', height: '200px', objectFit: 'cover', marginBottom: '10px' }}
        />
      )}
      {profile.avatar && (
        <div>
          <div>
            <img className="avatar"
              src={profile.avatar}
              alt="Avatar"
            />
          </div>
        </div>
      )}
      <h1>{profile.name}</h1>
      <Follow name={name} />
      <Unfollow name={name} />
      <p>Followers: {profile._count.followers}</p>
      <p>Following: {profile._count.following}</p>
      <p>Posts: {profile._count.posts}</p>
      <h2>Posts by {profile.name}</h2>
      <div className="card-container justify-content-center align-items-center">
        {posts.map(post => (
          <div key={post.id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>
                  <h2><Link to={`/posts/${post.id}`}>{post.title}</Link></h2>
                </Card.Title>
                {post.media && <img src={post.media} alt="Post" className="card-image" />}
                <Card.Text>{post.body}</Card.Text>
                <button className="btn btn-secondary" onClick={() => ReactToPost(post.id, '👍')}>👍</button>
                <button className="btn btn-secondary" onClick={() => ReactToPost(post.id, '😄')}>😄</button>
                <button className="btn btn-secondary" onClick={() => ReactToPost(post.id, '😢')}>😢</button>
                <Comment postId={post.id} onCommentSubmit={handleComment} />
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleProfile;
