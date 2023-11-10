import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import reactToPost from '../reactToPost/ReactToPost';
import Comment from '../comment/Comment';
import { Card } from 'react-bootstrap';

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(`https://nf-api.onrender.com/api/v1/social/posts/${id}?_comments=true&_author=true&_reactions=true`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setPost(data);
          setComments(data.comments || []);
          setLoading(false);
        } else {
          throw new Error('Error fetching post details: ' + response.statusText);
        }
      } catch (error) {
        throw new Error('Error fetching post details: ' + error.message);
      }
    };

    fetchPostDetails();

    const intervalId = setInterval(fetchPostDetails, 5000);

    return () => clearInterval(intervalId);
  }, [id]);

  const handleCommentSubmit = (e) => {
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-sm text-center">
      {post && (
        <div className="card-container justify-content-center align-items-center">
          <h3><Link to={`/profiles/${post.author.name}`}>{post.author.name}</Link></h3>
          <Card>
            <Card.Body>
              <h2>{post.title}</h2>
              {post.media && <img src={post.media} alt="Post" className="card-image" />}
              <p>{post.body}</p>
              <p>Reactions: {post.reactions.map(reaction => reaction.symbol).join(', ')}</p>
              <button className="btn btn-secondary" onClick={() => reactToPost(post.id, '👍')}>👍</button>
              <button className="btn btn-secondary" onClick={() => reactToPost(post.id, '😄')}>😄</button>
              <button className="btn btn-secondary" onClick={() => reactToPost(post.id, '😢')}>😢</button>
              <Comment postId={id} onCommentSubmit={handleCommentSubmit} />
              <p>Comments:</p>
              {comments.map(comment => (
                <Card key={comment.id} className="mt-2">
                  <Card.Body>
                    <Card.Text><h4><Link to={`/profiles/${comment.author.name}`}>{comment.author.name}</Link></h4></Card.Text>
                    <Card.Text>{comment.body}</Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SinglePost;
