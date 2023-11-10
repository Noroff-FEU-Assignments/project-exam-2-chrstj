import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Posts from './components/posts/Posts';
import SinglePost from './components/singlePost/SinglePost';
import MyProfile from './components/myProfile/MyProfile';
import Profiles from './components/profiles/Profiles';
import SingleProfile from './components/profile/Profile';
import CreatePostForm from './components/createPost/CreatePost';


const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (user) => {
    setUsername(user);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setUsername('');
    setLoggedIn(false);
    
  };

  return (
    <Router>
      {loggedIn && (
        <Navbar bg="dark" expand="lg">
          <LinkContainer to="/posts">
          <Navbar.Brand className="navbar-brand text-light">SOCIALIZE</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <LinkContainer to="/posts">
                <Nav.Link className="text-light">Posts</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/myProfile">
                <Nav.Link className="text-light">My Profile</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/profiles">
                <Nav.Link className="text-light">Profiles</Nav.Link>
              </LinkContainer>
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      )}
      <Routes>
        <Route
          path="/login"
          element={!loggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/posts" />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/posts"
          element={loggedIn ? <Posts username={username} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/myProfile"
          element={loggedIn ? <MyProfile username={username} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/profiles"
          element={loggedIn ? <Profiles username={username} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
  path="/posts/:id"
  element={loggedIn ? <SinglePost onLogout={handleLogout} /> : <Navigate to="/login" />}
/>
<Route
  path="/profiles/:name"
  element={loggedIn ? <SingleProfile onLogout={handleLogout} /> : <Navigate to="/login" />}
/>
        <Route path="/createPost" element={loggedIn ? <CreatePostForm /> : <Navigate to="/login" />} />
        <Route path="/*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;