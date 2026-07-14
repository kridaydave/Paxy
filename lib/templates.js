'use strict';

const { getActiveGrid } = require('./project');

const TEMPLATES = [
  { name: 'Humanoid', icon: '@', data: ['.....#.....','....###....','.....#.....','....###....','...#####...','...#.#.#...','..#..#..#..','.#...#...#.','.#...#...#.','.#..##.....','.##.#.#...']},
  { name: 'Tree', icon: '#', data: ['....#....','...###...','..#####..','.#######.','..#####..','.#######.','..#####..','...#.#...','...#.#...','..#####..']},
  { name: 'Sword', icon: '/', data: ['....#.....','....#.....','....#.....','....#.....','....#.....','...##.#...','..#..##...','.#...#....','##........']},
  { name: 'Potion', icon: '~', data: ['..###..','.#.#.#.','.#####.','.##.##.','.##.##.','.##.##.','.##.##.','.##.##.','.##.##.','.##.##.','..###..','..#.#..','.#.#.#.']},
  { name: 'Star', icon: '*', data: ['....#....','...###...','..#####..','.##.#.##.','#.##.##.#','...###...','.#..M..#.','.##.#.##.','..#...#..']},
  { name: 'Heart', icon: '<3', data: ['.#...#.','##..!##','#######','.#####.','..###..','...#...']},
  { name: 'Coin', icon: '$', data: ['..###..','.#OOO#.','#OOOOO#','#OOOOO#','#OOOOO#','.#OOO#.','..###..']},
  { name: 'Arrow', icon: '>', data: ['..#....','.###...','#####..','..######','.....##','.....#.','....#..']},
  { name: 'Crown', icon: '^', data: ['..#.#.#..','.##.##.##','#########','##.....##','.#...##..','..#####..']},
  { name: 'Chest', icon: '[]', data: ['#########','#O#OOO#O#','#########','##.....##','##.....##','##.....##','#########']},
  { name: 'Flag', icon: 'F', data: ['...#....','..###...','..#####.','..#####.','...#....','...#....','...#....','...#....','...#....']},
  { name: 'Flame', icon: '!', data: ['....#....','...###...','..#O##...','.#O####..','.##O###..','.#OO###..','.##O##...','..####...','...##....']}
];

const COLOR_MAP = { '#': '#000000', 'O': '#1d2b53', 'M': '#7e2553', '!': '#008751' };

function applyTemplate(project, name) {
  const template = TEMPLATES.find(t => t.name === name);
  if (!template) {
    const available = TEMPLATES.map(t => t.name).join(', ');
    throw new Error(`Template '${name}' not found. Available: ${available}`);
  }

  const grid = getActiveGrid(project);
  const size = project.gridSize;
  const data = template.data;

  const h = data.length;
  const w = Math.max(...data.map(r => r.length));
  const offsetX = Math.floor((size - w) / 2);
  const offsetY = Math.floor((size - h) / 2);

  let count = 0;
  for (let y = 0; y < h; y++) {
    const row = data[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.') continue;
      const dx = offsetX + x;
      const dy = offsetY + y;
      if (dx >= 0 && dx < size && dy >= 0 && dy < size) {
        grid[dy][dx] = COLOR_MAP[ch] || '#000000';
        count++;
      }
    }
  }

  return { ok: true, name, offset: { x: offsetX, y: offsetY }, placed: count };
}

module.exports = { TEMPLATES, COLOR_MAP, applyTemplate };
