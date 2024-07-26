import React from 'react';
import { useUser } from '../components/UserContext';

const Home = () => {
  const { userRole } = useUser() || {};

  if (!userRole) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {userRole}!</h1>
    </div>
  );
};

export default Home;
