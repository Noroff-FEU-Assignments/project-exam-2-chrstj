const ReactToPost = async (postId, symbol) => {
  const accessToken = localStorage.getItem('accessToken');
  
  if (accessToken) {
    try {
      const response = await fetch(`https://nf-api.onrender.com/api/v1/social/posts/${postId}/react/${symbol}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error('Error reacting to post');
      }
    } catch (error) {
      throw new Error('Error reacting to post: ' + error.message);
    }
  } else {
    throw new Error('Access token not found');
  }
};

export default ReactToPost;
