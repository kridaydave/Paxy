const project = require('../lib/project');
const png = require('../lib/png');

module.exports = function (args) {
  if (typeof args.output !== 'string') {
    throw new Error('export png requires --output');
  }

  const path = args.project || 'untitled.paxy';
  const p = project.loadProject(path);
  const scale = parseInt(args.scale, 10) || 1;

  return png.exportPng(p, { scale, output: args.output });
};
