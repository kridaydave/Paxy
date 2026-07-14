'use strict';

function bresenhamLine(x1, y1, x2, y2) {
  const points = [];
  let dx = Math.abs(x2 - x1);
  let dy = Math.abs(y2 - y1);
  let sx = x1 < x2 ? 1 : -1;
  let sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;
  let x = x1;
  let y = y1;
  while (true) {
    points.push({ x, y });
    if (x === x2 && y === y2) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
  return points;
}

function rectPoints(x1, y1, x2, y2, filled) {
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  const points = [];

  if (!filled) {
    for (let x = minX; x <= maxX; x++) {
      points.push({ x, y: minY });
      if (maxY !== minY) points.push({ x, y: maxY });
    }
    for (let y = minY + 1; y < maxY; y++) {
      points.push({ x: minX, y });
      points.push({ x: maxX, y });
    }
  } else {
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        points.push({ x, y });
      }
    }
  }
  return points;
}

function circlePoints(cx, cy, r, filled) {
  const points = [];

  if (!filled) {
    let x = r;
    let y = 0;
    let err = 1 - r;
    while (x >= y) {
      points.push({ x: cx + x, y: cy + y });
      points.push({ x: cx + y, y: cy + x });
      points.push({ x: cx - y, y: cy + x });
      points.push({ x: cx - x, y: cy + y });
      points.push({ x: cx - x, y: cy - y });
      points.push({ x: cx - y, y: cy - x });
      points.push({ x: cx + y, y: cy - x });
      points.push({ x: cx + x, y: cy - y });
      y++;
      if (err < 0) {
        err += 2 * y + 1;
      } else {
        x--;
        err += 2 * (y - x) + 1;
      }
    }
    return points;
  }

  const r2 = r * r;
  for (let dy = -r; dy <= r; dy++) {
    const halfWidth = Math.floor(Math.sqrt(r2 - dy * dy));
    for (let dx = -halfWidth; dx <= halfWidth; dx++) {
      points.push({ x: cx + dx, y: cy + dy });
    }
  }
  return points;
}

function floodFill(grid, size, x, y, newColor) {
  if (x < 0 || y < 0 || x >= size || y >= size) return 0;
  const target = grid[y][x];
  if (target === newColor) return 0;

  const stack = [[x, y]];
  let changed = 0;

  while (stack.length > 0) {
    const [cx, cy] = stack.pop();
    if (cx < 0 || cy < 0 || cx >= size || cy >= size) continue;
    if (grid[cy][cx] !== target) continue;
    grid[cy][cx] = newColor;
    changed++;
    stack.push([cx + 1, cy]);
    stack.push([cx - 1, cy]);
    stack.push([cx, cy + 1]);
    stack.push([cx, cy - 1]);
  }

  return changed;
}

module.exports = {
  bresenhamLine,
  rectPoints,
  circlePoints,
  floodFill
};
