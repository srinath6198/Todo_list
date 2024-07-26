const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/tasks');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use('/', userRoutes);
app.use('/', taskRoutes);

mongoose.connect('mongodb://localhost:27017/todolist', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
