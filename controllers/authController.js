const jwt = require('jsonwebtoken');
const Student = require('../models/Student');


const SECRET = 'secret-test';

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;


    const newStudent = await Student.create({ name, email, password, role });

    res.status(201).json({ message: 'Utilizator inregistrat cu succes', student: newStudent });
  }catch (err) {
  console.log(err.errors);
  res.status(500).json({ error: err.message, details: err.errors });
}

};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

 
    const student = await Student.findOne({ where: { email, password } });

    if (!student) {
      return res.status(401).json({ error: 'Email sau parola invalida' });
    }


    const token = jwt.sign(
      { id: student.id, role: student.role },
      SECRET,
      { expiresIn: '2h' }
    );

    res.json({ message: 'Autentificare reusita', token, role: student.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
