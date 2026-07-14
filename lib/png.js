'use strict';
const { PNG } = require('pngjs');
const { getActiveGrid } = require('./project');
const fs = require('fs');

function exportPng(project, opts) {
  const grid = getActiveGrid(project);
  const size = project.gridSize;

  const scale = opts.scale && !isNaN(opts.scale) ? parseInt(opts.scale, 10) : 1;

  const width = size * scale;
  const height = size * scale;

  const png = new PNG({ width, height });

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const color = grid[y][x];
      if (color == null) continue;

      const m = String(color).match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
      if (!m) continue;

      const r = parseInt(m[1], 16);
      const g = parseInt(m[2], 16);
      const b = parseInt(m[3], 16);

      for (let py = y * scale; py < y * scale + scale; py++) {
        for (let px = x * scale; px < x * scale + scale; px++) {
          const idx = (py * width + px) << 2;
          png.data[idx] = r;
          png.data[idx + 1] = g;
          png.data[idx + 2] = b;
          png.data[idx + 3] = 255;
        }
      }
    }
  }

  const buffer = PNG.sync.write(png);
  fs.writeFileSync(opts.output, buffer);

  return { ok: true, path: opts.output, width, height };
}

module.exports = { exportPng };
