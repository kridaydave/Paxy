const project = require('../lib/project');
const draw = require('../lib/draw');

module.exports = function (args) {
  const path = args.project || 'untitled.paxy';
  const p = project.loadProject(path);
  const grid = project.getActiveGrid(p);
  const size = grid.length;

  const cx = parseInt(args.cx, 10);
  const cy = parseInt(args.cy, 10);
  const r = parseInt(args.r, 10);

  if (![cx, cy, r].every(Number.isInteger)) {
    throw new Error('--cx, --cy, --r must be integers');
  }
  if (typeof args.color !== 'string') {
    throw new Error('--color is required');
  }

  const pts = draw.circlePoints(cx, cy, r, !!args.filled);
  for (const pt of pts) {
    if (project.inBounds(size, pt.x, pt.y)) {
      grid[pt.y][pt.x] = args.color;
    }
  }

  project.saveProject(path, p);

  return { ok: true, points: pts.length };
};
