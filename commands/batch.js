const fs = require('fs');
const project = require('../lib/project');
const draw = require('../lib/draw');

function toInt(v) {
  return parseInt(v, 10);
}

function requireInt(v, field) {
  const n = toInt(v);
  if (!Number.isInteger(n)) {
    throw new Error('missing or invalid integer field: ' + field);
  }
  return n;
}

module.exports = function (args) {
  let ops;
  if (args.file) {
    ops = JSON.parse(fs.readFileSync(args.file, 'utf8'));
  } else if (args.json) {
    ops = JSON.parse(args.json);
  } else {
    throw new Error('batch requires --file or --json');
  }

  if (!Array.isArray(ops)) {
    throw new Error('batch ops must be an array');
  }

  const path = args.project || 'untitled.paxy';
  const p = project.loadProject(path);
  const grid = project.getActiveGrid(p);
  const size = grid.length;

  for (const op of ops) {
    if (!op || typeof op.op !== 'string') {
      throw new Error('each op must be an object with an "op" string');
    }

    switch (op.op) {
      case 'pixel': {
        const x = requireInt(op.x, 'x');
        const y = requireInt(op.y, 'y');
        if (typeof op.color !== 'string') {
          throw new Error('pixel op requires "color"');
        }
        if (project.inBounds(size, x, y)) {
          grid[y][x] = op.color;
        }
        break;
      }
      case 'line': {
        const x1 = requireInt(op.x1, 'x1');
        const y1 = requireInt(op.y1, 'y1');
        const x2 = requireInt(op.x2, 'x2');
        const y2 = requireInt(op.y2, 'y2');
        if (typeof op.color !== 'string') {
          throw new Error('line op requires "color"');
        }
        const pts = draw.bresenhamLine(x1, y1, x2, y2);
        for (const pt of pts) {
          if (project.inBounds(size, pt.x, pt.y)) {
            grid[pt.y][pt.x] = op.color;
          }
        }
        break;
      }
      case 'rect': {
        const x1 = requireInt(op.x1, 'x1');
        const y1 = requireInt(op.y1, 'y1');
        const x2 = requireInt(op.x2, 'x2');
        const y2 = requireInt(op.y2, 'y2');
        if (typeof op.color !== 'string') {
          throw new Error('rect op requires "color"');
        }
        const pts = draw.rectPoints(x1, y1, x2, y2, !!op.filled);
        for (const pt of pts) {
          if (project.inBounds(size, pt.x, pt.y)) {
            grid[pt.y][pt.x] = op.color;
          }
        }
        break;
      }
      case 'circle': {
        const cx = requireInt(op.cx, 'cx');
        const cy = requireInt(op.cy, 'cy');
        const r = requireInt(op.r, 'r');
        if (typeof op.color !== 'string') {
          throw new Error('circle op requires "color"');
        }
        const pts = draw.circlePoints(cx, cy, r, !!op.filled);
        for (const pt of pts) {
          if (project.inBounds(size, pt.x, pt.y)) {
            grid[pt.y][pt.x] = op.color;
          }
        }
        break;
      }
      case 'fill': {
        const x = requireInt(op.x, 'x');
        const y = requireInt(op.y, 'y');
        if (typeof op.color !== 'string') {
          throw new Error('fill op requires "color"');
        }
        if (project.inBounds(size, x, y)) {
          draw.floodFill(grid, size, x, y, op.color);
        }
        break;
      }
      case 'erase': {
        const x = requireInt(op.x, 'x');
        const y = requireInt(op.y, 'y');
        if (project.inBounds(size, x, y)) {
          grid[y][x] = null;
        }
        break;
      }
      default:
        throw new Error('unknown op type: ' + op.op);
    }
  }

  project.saveProject(path, p);

  return { ok: true, ops: ops.length };
};
