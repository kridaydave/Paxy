'use strict';
// Deterministic smoke test for the Paxy CLI.
// Reproducibility claim: a fixed sequence of `paxy` commands must always
// produce byte-identical .paxy and PNG output. We verify (1) the run is
// internally deterministic (run twice, compare) and (2) it matches the
// committed golden fixtures. Tolerance: BIT-IDENTICAL (SHA-256 must match).
const { execFileSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CLI = path.join(ROOT, 'paxy.js');
const FIX = path.join(ROOT, 'test', 'fixtures');

function run(args) {
  execFileSync(process.execPath, [CLI, ...args], { cwd: ROOT, stdio: 'ignore' });
}

function build(project, png) {
  run(['create', '--size', '32', '--output', project]);
  run(['template', '--name', 'Heart', '--project', project]);
  run(['circle', '--cx', '16', '--cy', '16', '--r', '5', '--color', '#00e436', '--filled', '--project', project]);
  run(['export', 'png', '--scale', '4', '--output', png, '--project', project]);
}

const OUT = fs.mkdtempSync(path.join(os.tmpdir(), 'paxy-smoke-'));
const aPaxy = path.join(OUT, 'a.paxy'), aPng = path.join(OUT, 'a.png');
const bPaxy = path.join(OUT, 'b.paxy'), bPng = path.join(OUT, 'b.png');
build(aPaxy, aPng);
build(bPaxy, bPng);

const failures = [];
const aPaxyBuf = fs.readFileSync(aPaxy);
const bPaxyBuf = fs.readFileSync(bPaxy);
const aPngBuf = fs.readFileSync(aPng);
const bPngBuf = fs.readFileSync(bPng);

if (!aPaxyBuf.equals(bPaxyBuf)) failures.push('.paxy is not byte-identical across runs');
if (!aPngBuf.equals(bPngBuf)) failures.push('PNG is not byte-identical across runs');

const goldenPng = path.join(FIX, 'smoke.png');
const goldenPaxy = path.join(FIX, 'smoke.paxy');
if (!fs.existsSync(goldenPng) || !fs.existsSync(goldenPaxy)) {
  fs.mkdirSync(FIX, { recursive: true });
  fs.copyFileSync(aPng, goldenPng);
  fs.copyFileSync(aPaxy, goldenPaxy);
  console.log('Seeded golden fixtures (first run):', goldenPng, goldenPaxy);
} else {
  const gPng = fs.readFileSync(goldenPng);
  const gPaxy = fs.readFileSync(goldenPaxy);
  if (!aPngBuf.equals(gPng)) failures.push('PNG differs from committed golden fixture');
  if (!aPaxyBuf.equals(gPaxy)) failures.push('.paxy differs from committed golden fixture');
}

const sha = crypto.createHash('sha256').update(aPngBuf).digest('hex');
console.log('Result PNG SHA-256:', sha, '(128x128)');

if (failures.length) {
  console.error('SMOKE TEST FAILED:');
  failures.forEach((f) => console.error('  - ' + f));
  process.exit(1);
}
console.log('SMOKE TEST PASSED: deterministic and matches golden fixture.');
