const { Project, Deliverable, Grade } = require('../models');

function computeAverage(values) {
  if (values.length < 3) return null;

  const sorted = [...values].sort((a, b) => a - b);
  sorted.shift(); // remove min
  sorted.pop();   // remove max

  const sum = sorted.reduce((a, b) => a + b, 0);
  return Number((sum / sorted.length).toFixed(2));
}

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      attributes: ['id', 'title', 'description']
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProjectResults = async (req, res) => {
  try {
    const { projectId } = req.params;

    const deliverables = await Deliverable.findAll({
      where: { projectId }
    });

    const results = [];

    for (const d of deliverables) {
      const grades = await Grade.findAll({
        where: { deliverableId: d.id },
        attributes: ['value'] // anonim
      });

      const values = grades.map(g => g.value);
      const avg = computeAverage(values);

      results.push({
        deliverableId: d.id,
        deadline: d.deadline,
        videoUrl: d.videoUrl,
        deploymentUrl: d.deploymentUrl,
        grades: values,
        average: avg
      });
    }

    // optional: media pe proiect
    const validAverages = results
      .map(r => r.average)
      .filter(a => a !== null);

    const projectAverage =
      validAverages.length > 0
        ? Number((validAverages.reduce((a, b) => a + b, 0) / validAverages.length).toFixed(2))
        : null;

    res.json({
      projectId,
      deliverables: results,
      projectAverage
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
