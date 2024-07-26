import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import UnifiedAuth from './components/UnifiedAuth';
import TaskForm from './components/TaskForm';
import AdminTask from './components/AdminTask'; // Adjust path as necessary
import TaskList from './components/TaskList'; // Adjust path as necessary
import AdminTaskManagement from './components/AdminTaskManagement';

const App = () => {
  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<UnifiedAuth />} />
        <Route path="/register" element={<UnifiedAuth />} />
        
        <Route path="/task-form" element={
          <PrivateRoute>
            <TaskForm />
          </PrivateRoute>
        } />

        <Route path="/admin-task" element={
          <PrivateRoute>
            <AdminTask />
          </PrivateRoute>
        } />

        <Route path="/task-list" element={
          <PrivateRoute>
            <TaskList />
          </PrivateRoute>
        } />
        <Route path="/adminTask" element={
          <PrivateRoute>
            <AdminTaskManagement />
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
