import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Style/Auth.css';

const UnifiedAuth = () => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [role, setRole] = useState('User');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const endpoint = isRegistering 
        ? 'http://127.0.0.1:5001/api/user/register' 
        : 'http://127.0.0.1:5001/api/user/login';
      const data = isRegistering ? { ...formData, role } : formData;
      const response = await axios.post(endpoint, data, {
        headers: { 'Content-Type': 'application/json' }
      });
      localStorage.setItem('token', response.data.token);

      const userRole = isRegistering ? role : response.data.role;

      if (userRole === 'Admin') {
        navigate('/admin-task');
      } else if (userRole === 'Manager') {
        navigate('/manager-task');
      } else {
        navigate('/adminTask');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-switch">
        <button onClick={() => setIsRegistering(true)}>Register</button>
        <button onClick={() => setIsRegistering(false)}>Login</button>
      </div>
      <div className="auth-form">
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {isRegistering && (
            <select name="role" value={role} onChange={handleRoleChange}>
              <option value="User">User</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          )}
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : isRegistering ? 'Register' : 'Login'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default UnifiedAuth;
