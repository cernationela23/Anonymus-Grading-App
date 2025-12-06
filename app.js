const express = require('express');
require('./models');
const sequelize = require('./config/sequelize');


const Student = require('./models/Student');
const Project = require('./models/Project');
const Deliverable = require('./models/Deliverable');
const JuryAssignment = require('./models/JuryAssignment');
const Grade = require('./models/Grade');
const projectRoutes = require('./routes/projectRoutes');

const app = express();
app.use(express.json());

sequelize.sync({ alter: true })
  .then(() => console.log(' Toate modelele sincronizate!'))
  .catch(err => console.error(' Eroare sync:', err.message));

app.use('/projects', projectRoutes);



const authRoutes = require('./routes/authRoutes');

app.use('/auth', authRoutes);


app.get('/', (req, res) => {
  res.send('Server + DB + Toate modelele ');
});

module.exports = app;

