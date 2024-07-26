import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const AdminTaskManagement = () => {
  const [taskData, setTaskData] = useState({ title: '', description: '', status: '', assignedUser: '' });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams(); // Get the task ID from URL

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5001/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTaskData(response.data);
      } catch (error) {
        console.error('Error fetching task:', error);
        setError('Failed to fetch task');
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5001/api/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
      }
    };

    fetchTask();
    fetchUsers();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.put(`http://127.0.0.1:5001/api/tasks/${id}`, taskData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Task updated successfully!');
      navigate('/task-list');
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.delete(`http://127.0.0.1:5001/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Task deleted successfully!');
      navigate('/task-list');
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`http://127.0.0.1:5001/api/tasks/${id}/assign`, { userId: taskData.assignedUser }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Task assigned successfully!');
      navigate('/task-list');
    } catch (error) {
      console.error('Error assigning task:', error);
      setError('Failed to assign task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleUpdate}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Title"
          value={taskData.title}
          onChange={handleChange}
          required
        />
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          placeholder="Description"
          value={taskData.description}
          onChange={handleChange}
          required
        />
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          name="status"
          value={taskData.status}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <label htmlFor="assignedUser">Assign to:</label>
        <select
          id="assignedUser"
          name="assignedUser"
          value={taskData.assignedUser}
          onChange={handleChange}
        >
          <option value="">Assign to</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.username}</option>
          ))}
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Task'}
        </button>
      </form>
      <button onClick={handleAssign} disabled={loading}>
        {loading ? 'Assigning...' : 'Assign Task'}
      </button>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? 'Deleting...' : 'Delete Task'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AdminTaskManagement;
