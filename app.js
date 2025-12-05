const express = require('express');
const sequelize = require('./config/sequelize'); 

const app = express();

sequelize.authenticate()
  .then(() => console.log('DB conectata!'))
  .catch(err => console.error('Eroare DB:', err.message));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server + DB functioneaza');
});

module.exports = app;
