const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.post('/', authenticate, authorize(['MP']), async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, ownerStudentId: req.user.id });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
