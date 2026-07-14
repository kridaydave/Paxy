const project = require('../lib/project');
const draw = require('../lib/draw');

module.exports = function (args) {
  const path = args.project || 'untitled.paxy';
  const p = project.loadProject(path);
  const grid = project.getActiveGrid(p);
  const size = grid.length;

  const x1 = parseInt(args.x1, 10);
  const y1 = parseInt(args.y1, 10);
  const x2 = parseInt(args.x2, 10);
  const y2 = parseInt(args.y2, 10);

  if (![x1, y1, x2, y2].every(Number.isInteger)) {
    throw new Error('--x1, --y1, --x2, --y2 must be integers');
  }
  if (typeof args.color !== 'string') {
    throw new Error('--color is required');
  }

  const pts = draw.rectPoints(x1, y1, x2, y2, !!args.filled);
  for (const pt of pts) {
    if (project.inBounds(size, pt.x, pt.y)) {
      grid[pt.y][pt.x] = args.color;
    }
  }

  project.saveProject(path, p);

  return { ok: true, points: pts.length };
};
