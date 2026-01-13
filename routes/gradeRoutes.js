const express = require('express');
const router = express.Router({ mergeParams: true });

const gradeController = require('../controllers/gradeController');
const { authenticate } = require('../middleware/authMiddleware');

// Juratul asignat adauga nota pentru deliverableId din URL
// POST /deliverables/:deliverableId/grades
router.post('/', authenticate, gradeController.createGrade);

// Juratul isi modifica nota (time limit)
// PUT /deliverables/:deliverableId/grades/:gradeId
router.put('/:gradeId', authenticate, gradeController.updateGrade);

// Profesor/MP pot vedea notele (anonime) ale unui deliverable
// GET /deliverables/:deliverableId/grades
router.get('/', authenticate, gradeController.getGradesForDeliverable);

module.exports = router;
