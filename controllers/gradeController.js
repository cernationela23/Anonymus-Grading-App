const Grade = require('../models/Grade');

exports.createGrade = async (req, res) => {
  try {
    const { deliverableId, studentId, value } = req.body;

    const grade = await Grade.create({ deliverableId, studentId, value });

    res.status(201).json(grade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Eroare la creare notă' });
  }
};

exports.getGradesForDeliverable = async (req, res) => {
  try {
    const { deliverableId } = req.params;

    const grades = await Grade.findAll({
      where: { deliverableId }
    });

    res.json(grades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Eroare la preluare note' });
  }
};
