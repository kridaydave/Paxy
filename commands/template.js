const project = require('../lib/project');
const templates = require('../lib/templates');

module.exports = function (args) {
  if (typeof args.name !== 'string') {
    throw new Error('--name is required');
  }

  const path = args.project || 'untitled.paxy';
  const p = project.loadProject(path);
  const r = templates.applyTemplate(p, args.name);
  project.saveProject(path, p);

  return r;
};
