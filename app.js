const express = require('express');
require('./models');
const sequelize = require('./config/sequelize');
const projectRoutes = require('./routes/projectRoutes');
const deliverableRoutes = require('./routes/deliverableRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());

sequelize.sync({ alter: true })
  .then(() => console.log(' Toate modelele sincronizate!'))
  .catch(err => console.error(' Eroare sync:', err.message));

app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/projects/:projectId/deliverables', deliverableRoutes);

app.get('/', (req, res) => {
  res.send('Server + DB + Toate modelele');
});

module.exports = app;
