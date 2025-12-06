const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// creare notă
router.post('/', authenticate, authorize(['JURAT', 'MP']), gradeController.createGrade);

// toate notele unui deliverable
router.get('/:deliverableId', authenticate, gradeController.getGradesForDeliverable);

module.exports = router;
