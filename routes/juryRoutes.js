const express = require('express');
const router = express.Router({ mergeParams: true });
const { Op } = require('sequelize');

const { authenticate, authorize } = require('../middleware/authMiddleware');
const { Student, Deliverable, ProjectMember, JuryAssignment } = require('../models');

router.post('/', authenticate, authorize(['MP', 'PROFESOR']), async (req, res) => {
  try {
    const { deliverableId } = req.params;
    const JURORS_COUNT = 3;

    const deliverable = await Deliverable.findByPk(deliverableId);
    if (!deliverable) return res.status(404).json({ error: 'Deliverable not found' });

    // membrii proiectului (nu au voie jurati)
    const members = await ProjectMember.findAll({
      where: { projectId: deliverable.projectId }
    });
    const memberIds = members.map(m => m.studentId);

    // deja asignati la livrabil
    const existingAssignments = await JuryAssignment.findAll({
      where: { deliverableId }
    });
    const alreadyAssignedIds = existingAssignments.map(a => a.studentId);

    // eligibili: nu profesor, nu membru proiect, nu deja asignat
    const eligibleStudents = await Student.findAll({
      where: {
        role: { [Op.ne]: 'PROFESOR' },
        id: { [Op.notIn]: [...memberIds, ...alreadyAssignedIds] }
      }
    });

    if (eligibleStudents.length === 0) {
      return res.status(400).json({ error: 'No eligible students available for jury assignment' });
    }

    const shuffled = eligibleStudents.sort(() => 0.5 - Math.random());
    const selectedJurors = shuffled.slice(0, Math.min(JURORS_COUNT, shuffled.length));

    const assignments = await Promise.all(
      selectedJurors.map(s =>
        JuryAssignment.create({
          deliverableId: deliverable.id,
          studentId: s.id
        })
      )
    );

    res.status(201).json({ message: 'Jurors assigned', assignments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
