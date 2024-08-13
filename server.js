const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); 

const employeesRoutes = require('./routes/employeesRoutes');
const reportsRoutes = require('./routes/reportsRoutes');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(employeesRoutes);
app.use(reportsRoutes);


// Connect to MongoDB
mongoose.connect('mongodb+srv://ofritavorprogramming:V9xNSdorzqelb3KT@cluster0.nwvoasb.mongodb.net/?appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(error => {
  console.error('Connection error', error);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



