import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Style/TaskList.css'; // Ensure you have appropriate styles

const TaskList = ({ setSelectedTask }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:5001/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('An error occurred while fetching tasks.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:5001/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('An error occurred while deleting the task.');
    }
  };

  return (
    <div className="task-list">
      <h2>Task List</h2>
      {error && <p className="error-message">{error}</p>}
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Assigned to: {task.assignedTo.username}</p>
            <button onClick={() => setSelectedTask(task)}>Edit</button>
            <button onClick={() => handleDelete(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
