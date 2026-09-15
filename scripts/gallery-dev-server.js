#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

console.log('🎨 Starting Gallery Development Server...');

// Files to watch for changes
const WATCH_FILES = [
  'scripts/build-component-gallery.js',
  'wc-registry.json'
];

// Directories to watch for changes
const WATCH_DIRS = [
  'elements/*/package.json',
  'elements/*/demo/**/*.html'
];

// Track if we're currently rebuilding to avoid multiple concurrent builds
let isRebuilding = false;
let devServer = null;

// Function to build the gallery
function buildGallery() {
  return new Promise((resolve, reject) => {
    if (isRebuilding) {
      console.log('⏸️  Build already in progress, skipping...');
      return resolve();
    }

    isRebuilding = true;
    console.log('\n🔄 Rebuilding gallery...');
    
    const buildProcess = spawn('node', ['scripts/build-component-gallery.js'], {
      stdio: 'inherit'
    });
    
    buildProcess.on('close', (code) => {
      isRebuilding = false;
      if (code === 0) {
        console.log('✅ Gallery rebuilt successfully');
        resolve();
      } else {
        console.error('❌ Gallery build failed');
        reject(new Error(`Build failed with code ${code}`));
      }
    });

    buildProcess.on('error', (err) => {
      isRebuilding = false;
      console.error('❌ Build error:', err);
      reject(err);
    });
  });
}

// Function to start the dev server
function startDevServer() {
  console.log('🚀 Starting @web/dev-server...');
  
  devServer = spawn('npx', ['@web/dev-server', '--open', 'index.html', '--root-dir', '.', '--port', '3333'], {
    stdio: 'inherit',
    detached: false
  });

  devServer.on('error', (err) => {
    console.error('❌ Dev server error:', err);
  });

  devServer.on('close', (code) => {
    if (code !== 0) {
      console.log(`Dev server exited with code ${code}`);
    }
  });
}

// Function to watch for file changes
function setupWatcher() {
  console.log('👀 Setting up file watchers...');
  
  // Watch specific files
  WATCH_FILES.forEach(file => {
    if (fs.existsSync(file)) {
      fs.watch(file, { persistent: true }, (eventType) => {
        if (eventType === 'change') {
          console.log(`\n📝 ${file} changed`);
          buildGallery().catch(err => console.error('Build failed:', err));
        }
      });
      console.log(`   👁️  Watching: ${file}`);
    }
  });

  // Watch elements directory for package.json changes
  if (fs.existsSync('elements')) {
    const elementDirs = fs.readdirSync('elements', { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    elementDirs.forEach(elementName => {
      const packageJsonPath = path.join('elements', elementName, 'package.json');
      const demoDir = path.join('elements', elementName, 'demo');
      
      // Watch package.json
      if (fs.existsSync(packageJsonPath)) {
        fs.watch(packageJsonPath, { persistent: true }, (eventType) => {
          if (eventType === 'change') {
            console.log(`\n📦 ${elementName}/package.json changed`);
            buildGallery().catch(err => console.error('Build failed:', err));
          }
        });
      }
      
      // Watch demo directory
      if (fs.existsSync(demoDir)) {
        fs.watch(demoDir, { persistent: true, recursive: true }, (eventType, filename) => {
          if (eventType === 'change' && filename && filename.endsWith('.html')) {
            console.log(`\n🎬 ${elementName}/demo/${filename} changed`);
            buildGallery().catch(err => console.error('Build failed:', err));
          }
        });
      }
    });

    console.log(`   👁️  Watching: ${elementDirs.length} element directories`);
  }
}

// Cleanup function
function cleanup() {
  console.log('\n🧹 Cleaning up...');
  if (devServer) {
    devServer.kill();
  }
  process.exit(0);
}

// Handle process termination
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Main execution
async function main() {
  try {
    // Initial build
    await buildGallery();
    
    // Setup file watchers
    setupWatcher();
    
    // Start dev server
    startDevServer();
    
    console.log('\n🎉 Gallery development server is running!');
    console.log('📄 Gallery: http://localhost:3333/index.html');
    console.log('🔄 Auto-rebuilding on file changes...');
    console.log('⏹️  Press Ctrl+C to stop');
    
  } catch (error) {
    console.error('❌ Failed to start development server:', error);
    process.exit(1);
  }
}

main();
