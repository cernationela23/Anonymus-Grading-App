const Student = require('./Student');
const Project = require('./Project');
const Deliverable = require('./Deliverable');
const JuryAssignment = require('./JuryAssignment');
const Grade = require('./Grade');



Student.hasMany(Project, { 
  foreignKey: 'ownerStudentId',
  as: 'projects' 
});
Project.belongsTo(Student, { 
  foreignKey: 'ownerStudentId',
  as: 'owner' 
});

Project.hasMany(Deliverable, { 
  foreignKey: 'projectId',
  as: 'deliverables' 
});
Deliverable.belongsTo(Project, { 
  foreignKey: 'projectId',
  as: 'project' 
});

Deliverable.hasMany(JuryAssignment, { 
  foreignKey: 'deliverableId',
  as: 'juryAssignments' 
});
JuryAssignment.belongsTo(Deliverable, { 
  foreignKey: 'deliverableId',
  as: 'deliverable' 
});

Student.hasMany(JuryAssignment, { 
  foreignKey: 'studentId',
  as: 'juryAssignments' 
});
JuryAssignment.belongsTo(Student, { 
  foreignKey: 'studentId',
  as: 'juror' 
});

Deliverable.hasMany(Grade, { 
  foreignKey: 'deliverableId',
  as: 'grades' 
});
Grade.belongsTo(Deliverable, { 
  foreignKey: 'deliverableId',
  as: 'deliverable' 
});

Student.hasMany(Grade, { 
  foreignKey: 'studentId',
  as: 'givenGrades' 
});
Grade.belongsTo(Student, { 
  foreignKey: 'studentId',
  as: 'grader' 
});

module.exports = {
  Student,
  Project,
  Deliverable,
  JuryAssignment,
  Grade
};
