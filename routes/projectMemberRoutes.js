const express = require('express');
const router = express.Router({ mergeParams: true });

const { authenticate } = require('../middleware/authMiddleware');
const { ProjectMember, Project, Student } = require('../models');

// ✅ GET /projects/:projectId/members  -> lista membri
router.get('/', authenticate, async (req, res) => {
  try {
    const { projectId } = req.params;

    const members = await ProjectMember.findAll({
      where: { projectId },
      include: [{
        model: Student,
        as: 'student',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST /projects/:projectId/members -> adauga membru
router.post('/', authenticate, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { studentId } = req.body;

    if (!studentId) return res.status(400).json({ error: 'studentId is required' });

    const project = await Project.findByPk(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // doar owner sau profesor
    if (project.ownerStudentId !== req.user.id && req.user.role !== 'PROFESOR') {
      return res.status(403).json({ error: 'Only project owner or professor can add members' });
    }

    const exists = await ProjectMember.findOne({ where: { projectId, studentId } });
    if (exists) return res.status(409).json({ error: 'Student already member of this project' });

    const member = await ProjectMember.create({ projectId, studentId });

    res.status(201).json({ message: 'Member added', member });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
