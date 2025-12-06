const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// creare notă
router.post('/', authenticate, authorize(['JURAT', 'MP']), gradeController.createGrade);

// modificare notă
router.put('/update/:gradeId', authenticate, authorize(['JURAT', 'MP']), gradeController.updateGrade);

// toate notele unui deliverable
router.get('/deliverable/:deliverableId', authenticate, gradeController.getGradesForDeliverable);

module.exports = router;
