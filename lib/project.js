'use strict';
const fs = require('fs');
const path = require('path');

const FORMAT_VERSION = 1;

// A layer's grid is grid[y][x] (rows indexed by Y, columns by X).
// Each cell is null (transparent) or a hex color string like "#ff004d".
function emptyGrid(size) {
  const grid = new Array(size);
  for (let y = 0; y < size; y++) grid[y] = new Array(size).fill(null);
  return grid;
}

function createLayer(name, size) {
  return {
    name: name || 'Layer 1',
    opacity: 1,
    visible: true,
    grid: emptyGrid(size),
  };
}

function createProject(gridSize) {
  const size = gridSize;
  if (!Number.isInteger(size) || size <= 0) {
    throw new Error('gridSize must be a positive integer');
  }
  return {
    version: FORMAT_VERSION,
    gridSize: size,
    currentFrame: 0,
    activeLayer: 0,
    frames: [[createLayer('Layer 1', size)]],
  };
}

function validate(project) {
  if (!project || typeof project !== 'object') {
    throw new Error('Invalid project: not an object');
  }
  if (typeof project.gridSize !== 'number' || project.gridSize <= 0) {
    throw new Error('Invalid project: bad gridSize');
  }
  if (!Array.isArray(project.frames) || project.frames.length === 0) {
    throw new Error('Invalid project: no frames');
  }
  const frame = project.frames[project.currentFrame];
  if (!frame || !Array.isArray(frame) || !frame[project.activeLayer]) {
    throw new Error('Invalid project: missing active layer');
  }
  return project;
}

function loadProject(filePath) {
  if (!fs.existsSync(filePath)) {
    const err = new Error(`File not found: ${filePath}. Use 'paxy create' first.`);
    err.code = 'ENOENT_PROJECT';
    throw err;
  }
  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    throw new Error(`Cannot read file: ${filePath}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Corrupt .paxy JSON in ${filePath}: ${e.message}`);
  }
  return validate(parsed);
}

function saveProject(filePath, project) {
  const dir = path.dirname(filePath);
  if (dir && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(project, null, 2));
}

function getActiveGrid(project) {
  const frame = project.frames[project.currentFrame];
  if (!frame) throw new Error('No active frame');
  const layer = frame[project.activeLayer];
  if (!layer) throw new Error('No active layer');
  return layer.grid;
}

function inBounds(size, x, y) {
  return (
    Number.isInteger(x) &&
    Number.isInteger(y) &&
    x >= 0 &&
    y >= 0 &&
    x < size &&
    y < size
  );
}

module.exports = {
  FORMAT_VERSION,
  emptyGrid,
  createLayer,
  createProject,
  validate,
  loadProject,
  saveProject,
  getActiveGrid,
  inBounds,
};
