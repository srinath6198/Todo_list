import React, { useState } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

const AdminTask = () => {
  const [selectedTask, setSelectedTask] = useState(null);

  const refreshTasks = () => {
    // Logic to refresh tasks
  };

  return (
    <div className="admin-task">
      <TaskForm
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        refreshTasks={refreshTasks}
      />
      <TaskList selectTask={setSelectedTask} />
    </div>
  );
};

export default AdminTask;
