import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewRequest = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState('');


  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/requests/${id}`);
        setRequest(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching request');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequest();
  }, [id]);

//   const handleCommentSubmit = (e) => {
//     e.preventDefault();
//     if (newComment.trim()) {
//       setComments([...comments, { text: newComment, date: new Date().toLocaleString() }]);
//       setNewComment('');
//     }
//   };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' ,marginTop:'20px', padding: '50px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>Item Details</h1>
      <div style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
        <h3>{request.itemName}</h3>
        <p><strong>Serial No:</strong> {request.serialNo}</p>
        <p><strong>Category:</strong> {request.category}</p>
        <p><strong>Description:</strong> {request.description}</p>
        <p><strong>Returnable:</strong> {request.returnable}</p>
        <p><strong>Created At: </strong>{new Date(request.createdAt).toLocaleString()}</p>
      </div>
      
      {/* <div style={{ marginTop: '20px' }}>
        <h3>Comment</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {comments.map((comment, index) => (
            <li key={index} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
              <p>{comment.text}</p>
              <small style={{ color: 'gray' }}>{comment.date}</small>
            </li>
          ))}
        </ul>
        
        <form onSubmit={handleCommentSubmit} style={{ marginTop: '20px' }}>
          <textarea 
            value={newComment} 
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '5px' }}
          />
          <br />
          <button type="submit" style={{ marginTop: '10px', padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
            Post Comment
          </button>
        </form>
      </div> */}
    </div>
  );
};

export default ViewRequest;
