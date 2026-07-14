const project = require('../lib/project');

module.exports = function (args) {
  if (!args || !args.size) {
    throw new Error('create requires --size');
  }

  let gridSize;
  if (typeof args.size === 'string' && args.size.indexOf('x') !== -1) {
    gridSize = parseInt(args.size.split('x')[0], 10);
  } else {
    gridSize = parseInt(args.size, 10);
  }

  if (!Number.isInteger(gridSize) || gridSize <= 0) {
    throw new Error('invalid --size: must be a positive integer (e.g. "32" or "32x32")');
  }

  const output = args.output || 'untitled.paxy';
  const p = project.createProject(gridSize);
  project.saveProject(output, p);

  return { ok: true, path: output, gridSize };
};
