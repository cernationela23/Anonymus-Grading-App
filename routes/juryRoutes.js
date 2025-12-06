const express = require('express');
const router = require('express').Router({ mergeParams: true });
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { Student, Deliverable, JuryAssignment } = require('../models');

router.post('/', authenticate, authorize(['MP', 'PROFESOR']), async (req, res) => {
  try {
    const { deliverableId } = req.params;

    const deliverable = await Deliverable.findByPk(deliverableId);
    if (!deliverable) return res.status(404).json({ error: 'Deliverable not found' });

    const projectId = deliverable.projectId;
    const allStudents = await Student.findAll({
      where: { role: 'JURAT' } 
    });

    const shuffled = allStudents.sort(() => 0.5 - Math.random());

    const selectedJurors = shuffled.slice(0, 3);

    const assignments = await Promise.all(
      selectedJurors.map(s => JuryAssignment.create({
        deliverableId: deliverable.id,
        studentId: s.id
      }))
    );

    res.status(201).json({ message: 'Jurors assigned', assignments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
