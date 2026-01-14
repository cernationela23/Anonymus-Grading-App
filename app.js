const express = require('express');
require('./models');
const sequelize = require('./config/sequelize');

const deliverableRoutes = require('./routes/deliverableRoutes');
const authRoutes = require('./routes/authRoutes');
const juryRoutes = require('./routes/juryRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const juryMyRoutes = require('./routes/juryMyRoutes');
const projectRoutes = require('./routes/projectRoutes');
const professorRoutes = require('./routes/professorRoutes');
const projectMemberRoutes = require('./routes/projectMemberRoutes');

const cors = require('cors');
const app = express();
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));
app.use(express.json());

sequelize.sync({ alter: true })
  .then(() => console.log(' Toate modelele sincronizate!'))
  .catch(err => console.error(' Eroare sync:', err.message));

app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/projects/:projectId/deliverables', deliverableRoutes);
app.use('/projects/:projectId/deliverables/:deliverableId/jury', juryRoutes);
app.use('/deliverables/:deliverableId/grades', gradeRoutes);
app.use('/professor', professorRoutes);
app.use('/deliverables/:deliverableId/grades', gradeRoutes);
app.use('/jury', juryMyRoutes);
app.use('/projects/:projectId/members', projectMemberRoutes);


app.get('/', (req, res) => {
  res.send('Server + DB + Toate modelele');
});

module.exports = app;
