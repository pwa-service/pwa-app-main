#!/usr/bin/env node
const { spawnSync } = require('child_process');
const { join } = require('path');
const schema = join(__dirname, '..', 'prisma', 'schema.prisma');
const args = process.argv.slice(2);
const res = spawnSync('npx', ['prisma', ...args, `--schema=${schema}`], { stdio: 'inherit' });
process.exit(res.status ?? 0);

