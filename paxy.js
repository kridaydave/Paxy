const { program } = require('commander');

const create = require('./commands/create');
const pixel = require('./commands/pixel');
const line = require('./commands/line');
const rect = require('./commands/rect');
const circle = require('./commands/circle');
const fill = require('./commands/fill');
const erase = require('./commands/erase');
const template = require('./commands/template');
const batch = require('./commands/batch');
const exportCmdHandler = require('./commands/export');

function run(handler, opts) {
  try {
    const r = handler(opts);
    console.log(JSON.stringify(r));
  } catch (e) {
    console.error(JSON.stringify({ error: e.message }));
    process.exit(1);
  }
}

program
  .name('paxy')
  .description('A command-line pixel art maker for AI agents')
  .version('0.1.0');

program
  .command('create')
  .requiredOption('--size <wxh>', 'grid size, e.g. "32" or "32x32"')
  .option('--output <path>', 'project file path')
  .action((opts) => run(create, opts));

program
  .command('pixel')
  .option('--x <n>', 'x coordinate')
  .option('--y <n>', 'y coordinate')
  .option('--color <hex>', 'color')
  .option('--project <path>', 'project file path')
  .action((opts) => run(pixel, opts));

program
  .command('line')
  .option('--x1 <n>', 'x1')
  .option('--y1 <n>', 'y1')
  .option('--x2 <n>', 'x2')
  .option('--y2 <n>', 'y2')
  .option('--color <hex>', 'color')
  .option('--project <path>', 'project file path')
  .option('--filled', 'fill the shape')
  .action((opts) => run(line, opts));

program
  .command('rect')
  .option('--x1 <n>', 'x1')
  .option('--y1 <n>', 'y1')
  .option('--x2 <n>', 'x2')
  .option('--y2 <n>', 'y2')
  .option('--color <hex>', 'color')
  .option('--project <path>', 'project file path')
  .option('--filled', 'fill the shape')
  .action((opts) => run(rect, opts));

program
  .command('circle')
  .option('--cx <n>', 'center x')
  .option('--cy <n>', 'center y')
  .option('--r <n>', 'radius')
  .option('--color <hex>', 'color')
  .option('--project <path>', 'project file path')
  .option('--filled', 'fill the shape')
  .action((opts) => run(circle, opts));

program
  .command('fill')
  .option('--x <n>', 'x coordinate')
  .option('--y <n>', 'y coordinate')
  .option('--color <hex>', 'color')
  .option('--project <path>', 'project file path')
  .action((opts) => run(fill, opts));

program
  .command('erase')
  .option('--x <n>', 'x coordinate')
  .option('--y <n>', 'y coordinate')
  .option('--project <path>', 'project file path')
  .action((opts) => run(erase, opts));

program
  .command('template')
  .requiredOption('--name <name>', 'template name')
  .option('--project <path>', 'project file path')
  .action((opts) => run(template, opts));

program
  .command('batch')
  .option('--file <path>', 'path to JSON ops file')
  .option('--json <string>', 'JSON ops string')
  .option('--project <path>', 'project file path')
  .action((opts) => run(batch, opts));

const exportCmd = program.command('export');
exportCmd
  .command('png')
  .option('--scale <n>', 'pixel scale factor')
  .option('--output <path>', 'output PNG path')
  .option('--project <path>', 'project file path')
  .action((opts) => run(exportCmdHandler, opts));

program.parseAsync(process.argv);
