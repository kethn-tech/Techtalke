#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Ensure we're in the project directory
process.chdir(path.resolve(__dirname));

console.log('Installing dependencies...');
execSync('npm install', { stdio: 'inherit' });

console.log('Building project...');
try {
  execSync('node ./node_modules/.bin/vite build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
