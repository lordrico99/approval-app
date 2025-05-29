const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const requestsRouter = require('./routes/requests');
app.use('/api/requests', requestsRouter);


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const userRoutes = require('./routes/users');
const requestRoutes = require('./routes/requests');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/test', (req, res) => {
  res.send('API is working!');
});

