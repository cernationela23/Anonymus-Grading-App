const { Grade, JuryAssignment } = require('../models');

const EDIT_WINDOW_MINUTES = 120; // poti schimba la 1-2 min pentru demo

exports.createGrade = async (req, res) => {
  try {
    const { deliverableId } = req.params;
    const { value } = req.body;
    const studentId = req.user.id;

    if (!deliverableId) {
      return res.status(400).json({ error: 'Missing deliverableId in URL' });
    }

    if (value === undefined || value === null) {
      return res.status(400).json({ error: 'Missing grade value' });
    }

    const numericValue = Number(value);
    if (Number.isNaN(numericValue) || numericValue < 1 || numericValue > 10) {
      return res.status(400).json({ error: 'Grade must be between 1 and 10' });
    }

    // 1) trebuie sa fii jurat asignat pe livrabil
    const assignment = await JuryAssignment.findOne({
      where: { deliverableId, studentId }
    });

    if (!assignment) {
      return res.status(403).json({ error: 'You are not assigned as a juror for this deliverable' });
    }

    // 2) nu permit 2 note pe acelasi deliverable de la acelasi student
    const existing = await Grade.findOne({
      where: { deliverableId, studentId }
    });

    if (existing) {
      return res.status(409).json({ error: 'You already graded this deliverable' });
    }

    const grade = await Grade.create({
      deliverableId,
      studentId,
      value: numericValue
    });

    res.status(201).json({ message: 'Grade created', grade });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateGrade = async (req, res) => {
  try {
    const { deliverableId, gradeId } = req.params;
    const { value } = req.body;
    const studentId = req.user.id;

    if (!deliverableId) {
      return res.status(400).json({ error: 'Missing deliverableId in URL' });
    }

    const numericValue = Number(value);
    if (Number.isNaN(numericValue) || numericValue < 1 || numericValue > 10) {
      return res.status(400).json({ error: 'Grade must be between 1 and 10' });
    }

    const grade = await Grade.findByPk(gradeId);
    if (!grade) return res.status(404).json({ error: 'Grade not found' });

    // siguranta: grade-ul trebuie sa fie pentru deliverable-ul din URL
    if (String(grade.deliverableId) !== String(deliverableId)) {
      return res.status(400).json({ error: 'Grade does not belong to this deliverable' });
    }

    // doar autorul notei poate modifica
    if (grade.studentId !== studentId) {
      return res.status(403).json({ error: 'You can only modify your own grade' });
    }

    // (optional dar recomandat) trebuie sa fii jurat asignat (inca) pe deliverable
    const assignment = await JuryAssignment.findOne({
      where: { deliverableId, studentId }
    });

    if (!assignment) {
      return res.status(403).json({ error: 'You are not assigned as a juror for this deliverable' });
    }

    // limitare timp modificare
    const createdAtMs = new Date(grade.createdAt).getTime();
    const nowMs = Date.now();
    const diffMinutes = (nowMs - createdAtMs) / (1000 * 60);

    if (diffMinutes > EDIT_WINDOW_MINUTES) {
      return res.status(403).json({ error: `Edit window expired (${EDIT_WINDOW_MINUTES} minutes)` });
    }

    grade.value = numericValue;
    await grade.save();

    res.json({ message: 'Grade updated', grade });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGradesForDeliverable = async (req, res) => {
  try {
    const { deliverableId } = req.params;

    if (!deliverableId) {
      return res.status(400).json({ error: 'Missing deliverableId in URL' });
    }

    // anonimizat: nu trimitem studentId
    const grades = await Grade.findAll({
      where: { deliverableId },
      attributes: ['id', 'deliverableId', 'value', 'createdAt', 'updatedAt']
    });

    res.json(grades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
