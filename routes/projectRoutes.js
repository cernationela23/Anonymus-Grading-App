const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { ProjectMember } = require('../models');


router.post('/', authenticate, authorize(['MP']), async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, ownerStudentId: req.user.id });
        await ProjectMember.create({
        projectId: project.id,
        studentId: req.user.id
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const studentId = req.user.id;

    // ia toate membership-urile studentului
    const memberships = await ProjectMember.findAll({
      where: { studentId },
      attributes: ['projectId']
    });

    const projectIds = memberships.map(m => m.projectId);

    // daca nu e membru in nimic, returneaza lista goala
    if (projectIds.length === 0) return res.json([]);

    // ia proiectele unde e membru
    const projects = await Project.findAll({
      where: { id: projectIds }
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
