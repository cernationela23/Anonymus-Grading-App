const Student = require('./Student');
const Project = require('./Project');
const Deliverable = require('./Deliverable');
const JuryAssignment = require('./JuryAssignment');
const Grade = require('./Grade');
const ProjectMember = require('./ProjectMember');

// owner project
Student.hasMany(Project, { foreignKey: 'ownerStudentId', as: 'projects' });
Project.belongsTo(Student, { foreignKey: 'ownerStudentId', as: 'owner' });

// deliverables
Project.hasMany(Deliverable, { foreignKey: 'projectId', as: 'deliverables' });
Deliverable.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// jury assignments
Deliverable.hasMany(JuryAssignment, { foreignKey: 'deliverableId', as: 'juryAssignments' });
JuryAssignment.belongsTo(Deliverable, { foreignKey: 'deliverableId', as: 'deliverable' });

Student.hasMany(JuryAssignment, { foreignKey: 'studentId', as: 'juryAssignments' });
JuryAssignment.belongsTo(Student, { foreignKey: 'studentId', as: 'juror' });

// grades
Deliverable.hasMany(Grade, { foreignKey: 'deliverableId', as: 'grades' });
Grade.belongsTo(Deliverable, { foreignKey: 'deliverableId', as: 'deliverable' });

Student.hasMany(Grade, { foreignKey: 'studentId', as: 'givenGrades' });
Grade.belongsTo(Student, { foreignKey: 'studentId', as: 'grader' });

// ✅ project members (ASTA iti trebuie pt include in GET)
Project.hasMany(ProjectMember, { foreignKey: 'projectId', as: 'memberships' });
ProjectMember.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

Student.hasMany(ProjectMember, { foreignKey: 'studentId', as: 'projectMemberships' });
ProjectMember.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

module.exports = {
  Student,
  Project,
  Deliverable,
  JuryAssignment,
  Grade,
  ProjectMember
};
