const project = require('../lib/project');
const draw = require('../lib/draw');

module.exports = function (args) {
  const path = args.project || 'untitled.paxy';
  const p = project.loadProject(path);
  const grid = project.getActiveGrid(p);
  const size = grid.length;

  const x = parseInt(args.x, 10);
  const y = parseInt(args.y, 10);

  if (!Number.isInteger(x) || !Number.isInteger(y)) {
    throw new Error('--x and --y must be integers');
  }
  if (typeof args.color !== 'string') {
    throw new Error('--color is required');
  }
  if (!project.inBounds(size, x, y)) {
    throw new Error('out of bounds');
  }

  const count = draw.floodFill(grid, size, x, y, args.color);
  project.saveProject(path, p);

  return { ok: true, filled: count };
};
