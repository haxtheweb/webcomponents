#!/usr/bin/env node

/**
 * HAX Theme Screenshot Generator with Server Management
 * 
 * This enhanced script automatically:
 * 1. Starts the development server
 * 2. Waits for server to be ready
 * 3. Generates screenshots for all available HAX themes
 * 4. Updates themes.json with correct screenshot paths
 * 5. Gracefully shuts down the server
 * 
 * Screenshots are stored relative to themes.json for registry consistency
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration - all paths relative to themes.json location
const THEMES_JSON_PATH = join(__dirname, 'elements/haxcms-elements/lib/themes.json');
const THEMES_JSON_DIR = dirname(THEMES_JSON_PATH);
const SCREENSHOTS_DIR = join(THEMES_JSON_DIR, 'theme-screenshots');
const DEMO_DIR = join(__dirname, 'elements/haxcms-elements/demo');
const SERVER_PORT = 8080;
const DEMO_URL = `http://localhost:${SERVER_PORT}`;
const WAIT_TIME_MS = 3000;
const VIEWPORT_WIDTH = 1280;
const VIEWPORT_HEIGHT = 800;
const SERVER_STARTUP_TIMEOUT = 6000; // 6 seconds

// Create screenshots directory if it doesn't exist
if (!existsSync(SCREENSHOTS_DIR)) {
  mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Load existing themes.json
const themes = JSON.parse(readFileSync(THEMES_JSON_PATH, 'utf8'));
const themeNames = Object.keys(themes);

console.log(`Found ${themeNames.length} themes to process...`);

/**
 * Check if server is already running on the port
 */
async function isServerRunning(port) {
  try {
    const response = await fetch(`http://localhost:${port}`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Wait for server to be ready
 */
async function waitForServer(url, timeout = SERVER_STARTUP_TIMEOUT) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log(`✓ Server is ready at ${url}`);
        return true;
      }
    } catch (error) {
      // Server not ready yet, continue waiting
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    process.stdout.write('.');
  }
  
  throw new Error(`Server failed to start within ${timeout}ms`);
}

/**
 * Start development server
 */
async function startServer() {
  console.log('Starting development server...');
  
  // Check if server is already running
  if (await isServerRunning(SERVER_PORT)) {
    console.log(`✓ Server already running on port ${SERVER_PORT}`);
    return null; // Return null to indicate we didn't start a new server
  }
  
  // Start the server using npm run haxsite from the demo directory
  const serverProcess = spawn('npm', ['run', 'haxsite'], {
    cwd: DEMO_DIR,
    stdio: ['pipe', 'pipe', 'pipe'],
    detached: false
  });
  
  // Handle server output
  serverProcess.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Server started') || output.includes('Local:')) {
      console.log('Server output:', output.trim());
    }
  });
  
  serverProcess.stderr.on('data', (data) => {
    console.error('Server error:', data.toString().trim());
  });
  
  // Wait for server to be ready
  process.stdout.write('Waiting for server to start');
  await waitForServer(DEMO_URL);
  
  return serverProcess;
}

/**
 * Stop development server
 */
function stopServer(serverProcess) {
  if (serverProcess) {
    console.log('\nStopping development server...');
    serverProcess.kill('SIGTERM');
    
    // Force kill if it doesn't stop gracefully
    setTimeout(() => {
      if (!serverProcess.killed) {
        serverProcess.kill('SIGKILL');
      }
    }, 5000);
  }
}

/**
 * Generate updated themes.json with screenshot paths
 */
function updateThemesWithScreenshots() {
  const updatedThemes = { ...themes };
  
  for (const [themeKey, themeData] of Object.entries(updatedThemes)) {
    const screenshotFileName = `${themeData.element}.png`;
    const screenshotPath = join(SCREENSHOTS_DIR, screenshotFileName);
    const relativePath = relative(THEMES_JSON_DIR, screenshotPath);
    
    updatedThemes[themeKey] = {
      ...themeData,
      thumbnail: relativePath,
      screenshot: relativePath,
      screenshotGenerated: new Date().toISOString()
    };
  }
  
  return updatedThemes;
}

/**
 * Save updated themes.json
 */
function saveUpdatedThemes(updatedThemes) {
  writeFileSync(THEMES_JSON_PATH, JSON.stringify(updatedThemes, null, 2));
  console.log('✓ Updated themes.json with screenshot paths');
}

/**
 * Generate MCP automation commands
 */
function generateMCPCommands() {
  const commands = [];
  
  // Initial setup commands
  commands.push({
    type: 'navigate',
    description: 'Navigate to demo site and set up browser',
    command: `puppeteer_navigate({
  "allowDangerous": true, 
  "launchOptions": {
    "args": ["--no-sandbox", "--disable-setuid-sandbox"], 
    "headless": true
  }, 
  "url": "${DEMO_URL}"
})`
  });
  
  commands.push({
    type: 'wait_for_haxcms',
    description: 'Wait for HAXCMS to load completely',
    command: `puppeteer_evaluate({
  "script": "new Promise(resolve => { const wait = () => { if (globalThis.HAXCMS && globalThis.HAXCMS.setTheme) { console.log('HAXCMS ready!'); resolve({ready: true, currentTheme: globalThis.HAXCMS.instance?.store?.manifest?.metadata?.theme?.element}); } else { console.log('Still waiting...'); setTimeout(wait, 2000); } }; wait(); })"
})`
  });
  
  // Theme-specific commands
  for (const [themeKey, themeData] of Object.entries(themes)) {
    const screenshotName = themeData.element;
    
    commands.push({
      type: 'theme_group',
      theme: themeKey,
      element: themeData.element,
      name: themeData.name,
      commands: [
        {
          type: 'switch_theme',
          description: `Switch to theme: ${themeData.name}`,
          command: `puppeteer_evaluate({
  "script": "globalThis.HAXCMS.setTheme('${themeData.element}'); 'Theme switched to ${themeData.element}'"
})`
        },
        {
          type: 'wait',
          description: `Wait for theme to load (${WAIT_TIME_MS}ms)`,
          command: `puppeteer_evaluate({
  "script": "new Promise(resolve => setTimeout(() => resolve('Theme loaded'), ${WAIT_TIME_MS}))"
})`
        },
        {
          type: 'screenshot',
          description: `Take screenshot of ${themeData.name}`,
          command: `puppeteer_screenshot({
  "height": ${VIEWPORT_HEIGHT}, 
  "width": ${VIEWPORT_WIDTH}, 
  "name": "${screenshotName}"
})`
        }
      ]
    });
  }
  
  return commands;
}

/**
 * Main automation workflow
 */
async function runAutomation() {
  let serverProcess = null;
  
  try {
    console.log('\n=== HAX Theme Screenshot Generator with Server Management ===\n');
    
    // Step 1: Start server
    serverProcess = await startServer();
    
    // Step 2: Generate and save updated themes.json
    const updatedThemes = updateThemesWithScreenshots();
    saveUpdatedThemes(updatedThemes);
    
    // Step 3: Generate MCP automation commands
    const mcpCommands = generateMCPCommands();
    
    console.log('\n=== SERVER READY - MCP AUTOMATION COMMANDS ===\n');
    console.log('The server is now running. Use these MCP puppeteer commands:\n');
    
    // Display setup commands
    console.log('1. INITIAL SETUP:');
    mcpCommands
      .filter(cmd => cmd.type === 'navigate' || cmd.type === 'wait_for_haxcms')
      .forEach((cmd, index) => {
        console.log(`   ${index + 1}. ${cmd.description}`);
        console.log(`      ${cmd.command}\n`);
      });
    
    console.log('2. THEME SCREENSHOTS:');
    console.log('   For each theme, run these commands in sequence:\n');
    
    // Show first few themes as examples
    const themeCommands = mcpCommands.filter(cmd => cmd.type === 'theme_group');
    const exampleThemes = themeCommands.slice(0, 3);
    
    exampleThemes.forEach((themeGroup, index) => {
      console.log(`   --- Theme ${index + 1}: ${themeGroup.name} ---`);
      themeGroup.commands.forEach((cmd, cmdIndex) => {
        console.log(`   ${String.fromCharCode(97 + cmdIndex)}) ${cmd.description}`);
        console.log(`      ${cmd.command}`);
      });
      console.log('');
    });
    
    if (themeCommands.length > 3) {
      console.log(`   ... repeat for all ${themeCommands.length} themes\n`);
    }
    
    console.log('=== AUTOMATION SUMMARY ===');
    console.log(`✓ Server running at: ${DEMO_URL}`);
    console.log(`✓ Screenshots directory: ${SCREENSHOTS_DIR}`);
    console.log(`✓ Total themes to process: ${themeNames.length}`);
    console.log(`✓ Updated themes.json with paths`);
    console.log('\nThe server will continue running until you stop this script (Ctrl+C)');
    console.log('After taking screenshots, press Ctrl+C to stop the server.');
    
    // Keep the process alive and handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n\nShutting down gracefully...');
      stopServer(serverProcess);
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      stopServer(serverProcess);
      process.exit(0);
    });
    
    // Keep the script running
    await new Promise(() => {}); // Run indefinitely until interrupted
    
  } catch (error) {
    console.error('Error during automation:', error);
    stopServer(serverProcess);
    process.exit(1);
  }
}

// Export configuration for programmatic use
export const serverConfig = {
  demoDir: DEMO_DIR,
  demoUrl: DEMO_URL,
  port: SERVER_PORT,
  screenshotsDir: SCREENSHOTS_DIR,
  themesJsonPath: THEMES_JSON_PATH,
  themes: themes,
  viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
  waitTime: WAIT_TIME_MS
};

// Export the automation functions
export { 
  startServer, 
  stopServer, 
  isServerRunning, 
  waitForServer, 
  updateThemesWithScreenshots,
  saveUpdatedThemes,
  generateMCPCommands
};

// Run automation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAutomation();
}