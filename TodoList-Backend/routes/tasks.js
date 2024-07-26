const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const Task = require('../models/Task');
const User = require('../models/User');

// Admins can create tasks
router.post('/api/tasks', authorize(['Admin']), async (req, res) => {
  try {
    const task = new Task({ ...req.body, createdBy: req.user._id });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});

// Get tasks assigned to or created by the user
router.get('/api/tasks', authorize(['Admin', 'Manager', 'User']), async (req, res) => {
  try {
    const tasks = await Task.find({ $or: [{ assignedTo: req.user._id }, { createdBy: req.user._id }] })
                            .populate('assignedTo createdBy');
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

// Update a task
router.put('/api/tasks/:id', authorize(['Admin', 'Manager']), async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});

// Delete a task
router.delete('/api/tasks/:id', authorize(['Admin']), async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

// Managers can assign tasks to users within their team
router.post('/api/tasks/:id/assign', authorize(['Manager']), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const user = await User.findById(req.body.userId);
    if (!task || !user) return res.status(404).json({ message: 'Task or User not found' });

    if (req.user.role === 'Manager' && !user.team.includes(req.user._id)) {
      return res.status(403).json({ message: 'You cannot assign tasks to users outside your team' });
    }

    task.assignedTo = user._id;
    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({ message: 'Error assigning task', error: error.message });
  }
});

module.exports = router;
