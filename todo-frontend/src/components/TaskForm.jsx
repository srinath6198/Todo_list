import React, { useEffect, useState } from 'react';
import '../Style/TaskForm.css';
import axios from 'axios';

const TaskForm = ({ selectedTask, setSelectedTask, refreshTasks }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    status: 'Pending',
    assignedTo: '',
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await axios.get('http://127.0.0.1:5001/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedTask) {
      setTaskData({
        title: selectedTask.title,
        description: selectedTask.description,
        status: selectedTask.status,
        assignedTo: selectedTask.assignedTo || '',
      });
    }
  }, [selectedTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (selectedTask) {
        await axios.put(`http://127.0.0.1:5001/api/tasks/${selectedTask._id}`, taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('http://127.0.0.1:5001/api/tasks', taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setSelectedTask(null);
      setTaskData({
        title: '',
        description: '',
        status: 'Pending',
        assignedTo: '',
      });
      refreshTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={taskData.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />
      <textarea
        name="description"
        value={taskData.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <select
        name="status"
        value={taskData.status}
        onChange={handleChange}
      >
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <select
        name="assignedTo"
        value={taskData.assignedTo}
        onChange={handleChange}
      >
        <option value="">Assign to</option>
        {users.map(user => (
          <option key={user._id} value={user._id}>{user.username}</option>
        ))}
      </select>
      <button type="submit">
        {selectedTask ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  );
};

export default TaskForm;
