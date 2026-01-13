const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/authMiddleware');
const { JuryAssignment, Deliverable, Project, Grade } = require('../models');

// GET /jury/my  -> livrabilele la care userul logat e jurat
router.get('/my', authenticate, async (req, res) => {
  try {
    const studentId = req.user.id;

    const assignments = await JuryAssignment.findAll({
      where: { studentId },
      include: [
        {
          model: Deliverable,
          as: 'deliverable',
          include: [
            {
              model: Project,
              as: 'project'
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // map la un payload mai simplu
    const result = assignments.map(a => ({
      assignmentId: a.id,
      deliverableId: a.deliverableId,
      assignedAt: a.assignedAt,
      deliverable: a.deliverable
        ? {
            id: a.deliverable.id,
            projectId: a.deliverable.projectId,
            deadline: a.deliverable.deadline,
            videoUrl: a.deliverable.videoUrl,
            deploymentUrl: a.deliverable.deploymentUrl,
            project: a.deliverable.project
              ? {
                  id: a.deliverable.project.id,
                  title: a.deliverable.project.title,
                  description: a.deliverable.project.description
                }
              : null
          }
        : null
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (OPTIONAL) GET /jury/my/:deliverableId/grade -> nota mea pe livrabil (daca exista)
router.get('/my/:deliverableId/grade', authenticate, async (req, res) => {
  try {
    const studentId = req.user.id;
    const { deliverableId } = req.params;

    const grade = await Grade.findOne({
      where: { deliverableId, studentId }
    });

    if (!grade) return res.json(null);

    res.json({ id: grade.id, value: grade.value, createdAt: grade.createdAt, updatedAt: grade.updatedAt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
