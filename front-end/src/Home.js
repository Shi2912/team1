import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className='home-container'>
      <h2>Local Service Finder & Booking Platform</h2>
      <div>
        <Link to="/signup">
          <button>Go to Signup Page</button>
        </Link>
        <Link to="/login">
          <button>Go to Login Page</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
