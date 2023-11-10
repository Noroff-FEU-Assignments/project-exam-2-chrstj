import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CreatePostForm from '../createPost/CreatePost';
import Comment from '../comment/Comment';
import ReactToPost from '../reactToPost/ReactToPost';
import { Card } from 'react-bootstrap';


const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isCreatePostFormVisible, setCreatePostFormVisible] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      const fetchPosts = async () => {
        try {
          const response = await fetch('https://nf-api.onrender.com/api/v1/social/posts?_comments=true&_author=true&_reactions=true', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setPosts(data);
          } else {
            setError('Error fetching posts: ' + response.statusText);
          }
        } catch (error) {
          setError('Error fetching posts: ' + error);
        }
      };

      fetchPosts();
      const intervalId = setInterval(fetchPosts, 5000);
      return () => clearInterval(intervalId);
    } 
  }, []);

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
          const updatedPostsResponse = await fetch('https://nf-api.onrender.com/api/v1/social/posts', {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          if (updatedPostsResponse.ok) {
            const data = await updatedPostsResponse.json();
            setPosts(data);
          } else {
            setError('Error fetching updated posts: ' + updatedPostsResponse.statusText);
          }
        } else {
          setError('Error posting comment: ' + response.statusText);
        }
      } catch (error) {
        setError('Error posting comment: ' + error);
      }
    } else {
      setError('Unauthorized user');
    }
  };

  const toggleCreatePostForm = () => {
    setCreatePostFormVisible(!isCreatePostFormVisible);
  };

  const [isCommentsVisible, setIsCommentsVisible] = useState(false);

  const toggleCommentsVisibility = () => {
    setIsCommentsVisible(!isCommentsVisible);
  };


  return (
    <div className="container-sm text-center">
      <h2>Latest Posts</h2>
      <div className="card-container justify-content-center align-items-center">
      <button className="btn btn-primary mb-3" onClick={toggleCreatePostForm}>Create New Post</button>
      {isCreatePostFormVisible && <CreatePostForm />} {/* Conditionally render CreatePostForm */}
        {posts.map(post => (
          <div key={post.id} className="mb-3">
            <Card>
              <Card.Body>
                <h3><Link to={`/profiles/${post.author.name}`}>{post.author.name}</Link></h3>
                <Card.Title><h2><Link to={`/posts/${post.id}`}>{post.title}</Link></h2></Card.Title>
                {post.media && <Link to={`/posts/${post.id}`}><img src={post.media} alt="Post" className="card-image" /></Link>}
              <Card.Text><Link to={`/posts/${post.id}`}>{post.body}</Link></Card.Text>
                <button className="btn btn-secondary" onClick={() => ReactToPost(post.id, '👍')}>👍</button>
                <button className="btn btn-secondary" onClick={() => ReactToPost(post.id, '😄')}>😄</button>
                <button className="btn btn-secondary" onClick={() => ReactToPost(post.id, '😢')}>😢</button>
                {/* Comment button */}
                <Comment postId={post.id} onCommentSubmit={handleComment} />
                <button className="btn btn-secondary" onClick={toggleCommentsVisibility}>See Comments</button>
                {isCommentsVisible && post.comments.map(comment => (
                  <Card key={comment.id} className="mt-2">
                    <Card.Body>
                      <h4><Link to={`/profiles/${comment.author.name}`}>{comment.author.name}</Link></h4>
                      <Card.Text>{comment.body}</Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Posts;





