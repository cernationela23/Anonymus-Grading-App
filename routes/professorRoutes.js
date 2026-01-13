const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');
const professorController = require('../controllers/professorController');

router.get('/projects', authenticate, authorize(['PROFESOR']), professorController.getProjects);
router.get('/projects/:projectId/results', authenticate, authorize(['PROFESOR']), professorController.getProjectResults);

module.exports = router;
