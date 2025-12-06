const express = require('express');
const router = express.Router({ mergeParams: true });
const Deliverable = require('../models/Deliverable');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Creează un livrabil pentru proiect
router.post('/', authenticate, authorize(['MP']), async (req, res) => {
  try {
    const { projectId } = req.params;
    const { deadline, videoUrl, deploymentUrl } = req.body;

    const deliverable = await Deliverable.create({
      projectId,
      deadline,
      videoUrl,
      deploymentUrl
    });

    res.status(201).json(deliverable);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vezi toate livrabilele unui proiect
router.get('/', authenticate, async (req, res) => {
  try {
    const { projectId } = req.params;

    const deliverables = await Deliverable.findAll({
      where: { projectId }
    });

    res.json(deliverables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
