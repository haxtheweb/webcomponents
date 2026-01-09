#!/usr/bin/env node

/**
 * HAX Theme Screenshot Automation with Puppeteer
 *
 * This script automates the process of taking screenshots of all available HAX themes
 * using Puppeteer directly, without requiring MCP integration.
 */

import puppeteer from "puppeteer";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { spawn, execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
  baseUrl: "http://localhost:8000/elements/haxcms-elements/demo/",
  serverPort: 8000,
  webcomponentsDir: path.join(__dirname, "..", "..", ".."), // webcomponents root
  screenshotDir: path.join(__dirname, "..", "lib", "theme-screenshots"),
  themesConfigPath: path.join(__dirname, "..", "lib", "themes.json"),
  viewport: {
    width: 1440,
    height: 900, // Maintain 16:10 aspect ratio
  },
  thumbnailSize: {
    width: 300,
    height: 188, // Maintain same aspect ratio as large
  },
  themeLoadDelay: 3000, // Wait time after theme change for rendering
  uiSetupDelay: 2000, // Wait time after setting user scaffolding
  headless: true, // Set to false for debugging
  timeout: 30000,
  debugMode: process.argv.includes("--debug"), // Only process first 3 themes in debug mode
  maxThemesInDebug: 3,
};

// Ensure screenshot directory exists
if (!fs.existsSync(CONFIG.screenshotDir)) {
  fs.mkdirSync(CONFIG.screenshotDir, { recursive: true });
}

// Load themes configuration
let themesConfig;
try {
  themesConfig = JSON.parse(fs.readFileSync(CONFIG.themesConfigPath, "utf8"));
} catch (error) {
  console.error("Error loading themes.json:", error.message);
  process.exit(1);
}

/**
 * Check if server is running
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
async function waitForServer(url, timeout = 30000) {
  const startTime = Date.now();
  let attempts = 0;

  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log(`\n✓ Server ready at ${url}`);
        return true;
      }
    } catch (error) {
      // Server not ready yet, continue waiting
    }

    attempts++;
    if (attempts % 3 === 0) {
      process.stdout.write("."); // Show progress every 3 seconds
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`Server failed to start within ${timeout}ms`);
}

/**
 * Start development server
 */
async function startServer() {
  console.log("🚀 Starting development server...");

  if (await isServerRunning(CONFIG.serverPort)) {
    console.log(`✓ Server already running on port ${CONFIG.serverPort}`);
    return null;
  }

  // Run web-dev-server directly with flags to prevent browser opening
  const serverProcess = spawn(
    "npx",
    [
      "@web/dev-server",
      "--config",
      "web-dev-server.haxcms.config.cjs",
      "--open",
      "false", // Prevent browser from opening
      "--port",
      CONFIG.serverPort.toString(),
      "--root-dir",
      ".",
      "--app-index",
      "elements/haxcms-elements/demo/index.html",
    ],
    {
      cwd: CONFIG.webcomponentsDir,
      stdio: ["pipe", "pipe", "pipe"],
      detached: false,
    },
  );

  // Handle server output - look for startup confirmation
  let serverReady = false;

  serverProcess.stdout.on("data", (data) => {
    const output = data.toString();
    // Look for the "Local:" or "started" message that indicates server is ready
    if (
      (output.includes("Local:") && output.includes("8000")) ||
      output.includes("Web Dev Server started")
    ) {
      console.log("Server output:", output.trim());
      serverReady = true;
    }
  });

  serverProcess.stderr.on("data", (data) => {
    const error = data.toString();
    // Only log actual errors, not webpack noise
    if (
      !error.includes("webpack") &&
      !error.includes("deprecation") &&
      !error.includes("concurrently")
    ) {
      console.error("Server error:", error.trim());
    }
  });

  process.stdout.write("Waiting for server to start");
  await waitForServer(CONFIG.baseUrl);

  return serverProcess;
}

/**
 * Stop server and cleanup processes
 */
function stopServer(serverProcess) {
  if (serverProcess && !serverProcess.killed) {
    console.log("\n🛑 Stopping development server...");

    try {
      // Try graceful shutdown first
      serverProcess.kill("SIGTERM");
      console.log("  → Sent SIGTERM to server process");
    } catch (e) {
      console.log("  ⚠️ Error sending SIGTERM:", e.message);
    }

    // Force kill after 1 second if still running
    setTimeout(() => {
      if (serverProcess && !serverProcess.killed) {
        try {
          console.log("  → Force killing server process with SIGKILL...");
          serverProcess.kill("SIGKILL");
        } catch (e) {
          console.log("  ⚠️ Error with SIGKILL:", e.message);
        }
      }
    }, 1000);
  }

  // Always try to cleanup any remaining processes
  setTimeout(() => {
    try {
      console.log(
        "  → Cleaning up remaining processes on port",
        CONFIG.serverPort,
        "...",
      );

      // Kill any web-dev-server processes
      execSync('pkill -f "web-dev-server" || true', { stdio: "ignore" });

      // Kill any processes using the port
      execSync(`lsof -ti:${CONFIG.serverPort} | xargs -r kill -9 || true`, {
        stdio: "ignore",
      });

      console.log("  ✓ Server cleanup completed");
    } catch (e) {
      console.log(
        "  ⚠️ Cleanup error (process may have already stopped):",
        e.message,
      );
    }
  }, 2000);
}

/**
 * Update themes.json with new screenshot timestamp
 */
function updateThemeScreenshot(themeKey) {
  if (themesConfig[themeKey]) {
    themesConfig[themeKey].screenshotGenerated = new Date().toISOString();
    try {
      fs.writeFileSync(
        CONFIG.themesConfigPath,
        JSON.stringify(themesConfig, null, 2),
      );
      console.log(`    ✓ Updated timestamp for ${themeKey}`);
    } catch (error) {
      console.error(
        `    ✗ Failed to update timestamp for ${themeKey}:`,
        error.message,
      );
    }
  }
}

/**
 * Setup the page to hide editing UI by removing the editor element
 */
async function setupNonEditingView(page) {
  console.log("    → Setting up non-editing view (removing editor UI)...");

  try {
    // Wait 3 seconds for the page to fully load
    console.log("    → Waiting 3 seconds for page to fully load...");
    await page.waitForTimeout(3000);

    // Remove the haxcms-site-editor-ui element from the DOM
    const removed = await page.evaluate(() => {
      const editorUI = document.querySelector("haxcms-site-editor-ui");
      if (editorUI) {
        editorUI.remove();
        console.log("Successfully removed haxcms-site-editor-ui element");
        return true;
      } else {
        console.log("haxcms-site-editor-ui element not found");
        return false;
      }
    });

    if (removed) {
      console.log("    ✓ Editor UI element removed from DOM");
    } else {
      console.log("    ⚠ Editor UI element not found (may already be hidden)");
    }

    // Wait a moment for any visual changes to take effect
    await page.waitForTimeout(1000);
    console.log("    ✓ Non-editing view configured");
    return true;
  } catch (error) {
    console.error("    ✗ Error setting up non-editing view:", error.message);
    return false;
  }
}

/**
 * Take screenshot of a specific theme in both large and thumbnail sizes
 */
async function captureThemeScreenshot(page, themeElement) {
  const themeConfig = themesConfig[themeElement];
  const themeName = (themeConfig && themeConfig.name) || "Unknown";

  console.log(`\n📸 Processing theme: ${themeElement}`);
  console.log(`    Theme name: ${themeName}`);

  try {
    // Switch to the theme
    console.log(`    → Switching to theme: ${themeElement}`);
    await page.evaluate((theme) => {
      if (
        typeof globalThis.HAXCMS !== "undefined" &&
        globalThis.HAXCMS.setTheme
      ) {
        globalThis.HAXCMS.setTheme(theme);
        console.log(`Theme switched to: ${theme}`);
        return true;
      } else {
        console.error("HAXCMS.setTheme not available");
        return false;
      }
    }, themeElement);

    // Wait for theme to load and render
    console.log(
      `    → Waiting ${CONFIG.themeLoadDelay}ms for theme rendering...`,
    );
    await page.waitForTimeout(CONFIG.themeLoadDelay);

    // Ensure we're using the desktop viewport for both screenshots
    await page.setViewport(CONFIG.viewport);

    // Take large screenshot (desktop rendering)
    const largeScreenshotPath = path.join(
      CONFIG.screenshotDir,
      `theme-${themeElement}.jpg`,
    );
    console.log(
      `    → Taking large screenshot (${CONFIG.viewport.width}x${CONFIG.viewport.height}): ${largeScreenshotPath}`,
    );

    await page.screenshot({
      path: largeScreenshotPath,
      fullPage: false,
      type: "jpeg",
      quality: 60,
    });

    // Take full-size screenshot and resize to create thumbnail
    // This ensures thumbnail shows desktop rendering, not mobile
    const thumbnailScreenshotPath = path.join(
      CONFIG.screenshotDir,
      `theme-${themeElement}-thumb.jpg`,
    );
    console.log(
      `    → Creating thumbnail (${CONFIG.thumbnailSize.width}x${CONFIG.thumbnailSize.height}) from desktop rendering...`,
    );

    // Capture full desktop screenshot as buffer
    const screenshotBuffer = await page.screenshot({
      fullPage: false,
      type: "jpeg",
      quality: 60,
    });

    // Resize using Sharp to create thumbnail while maintaining desktop layout
    try {
      await sharp(screenshotBuffer)
        .resize(CONFIG.thumbnailSize.width, CONFIG.thumbnailSize.height, {
          fit: "cover",
          position: "top",
        })
        .jpeg({
          quality: 60,
          progressive: true,
        })
        .toFile(thumbnailScreenshotPath);

      console.log(`    ✓ Thumbnail created from desktop rendering`);
    } catch (resizeError) {
      console.error(`    ✗ Error creating thumbnail:`, resizeError.message);
      throw resizeError;
    }

    // Verify both screenshots were created and have content
    const largeStats = fs.statSync(largeScreenshotPath);
    const thumbStats = fs.statSync(thumbnailScreenshotPath);

    if (largeStats.size > 0 && thumbStats.size > 0) {
      console.log(
        `    ✓ Large screenshot saved (${Math.round(largeStats.size / 1024)}KB)`,
      );
      console.log(
        `    ✓ Thumbnail screenshot saved (${Math.round(thumbStats.size / 1024)}KB)`,
      );
      updateThemeScreenshot(themeElement);

      // Refresh browser to clear any residual theme styling/DOM elements
      console.log(`    → Refreshing browser to clear theme residuals...`);
      await page.reload({ waitUntil: "networkidle2" });

      // Wait for HAXCMS to be available again after reload
      await page.waitForFunction(
        () => {
          return (
            typeof globalThis.HAXCMS !== "undefined" &&
            globalThis.HAXCMS.setTheme
          );
        },
        { timeout: CONFIG.timeout },
      );

      // Re-remove the editor UI after refresh
      await page.evaluate(() => {
        const editorUI = document.querySelector("haxcms-site-editor-ui");
        if (editorUI) {
          editorUI.remove();
        }
      });

      console.log(`    ✓ Browser refreshed and cleaned for next theme`);
      return true;
    } else {
      console.error(`    ✗ One or more screenshot files are empty`);
      console.error(
        `    ✗ Large: ${largeStats.size} bytes, Thumbnail: ${thumbStats.size} bytes`,
      );
      return false;
    }
  } catch (error) {
    console.error(`    ✗ Error capturing ${themeElement}:`, error.message);
    return false;
  }
}

/**
 * Main automation function
 */
async function runThemeAutomation() {
  console.log(
    "🚀 Starting HAX Theme Screenshot Automation with Server Management\n",
  );
  console.log(`Configuration:`);
  console.log(`  Base URL: ${CONFIG.baseUrl}`);
  console.log(`  Screenshot directory: ${CONFIG.screenshotDir}`);
  console.log(`  Viewport: ${CONFIG.viewport.width}x${CONFIG.viewport.height}`);
  console.log(`  Theme load delay: ${CONFIG.themeLoadDelay}ms`);
  console.log(`  Headless mode: ${CONFIG.headless}`);

  let themes = Object.keys(themesConfig);

  if (CONFIG.debugMode) {
    themes = themes.slice(0, CONFIG.maxThemesInDebug);
    console.log(`\n🐛 Debug mode: Processing only ${themes.length} themes`);
  }

  console.log(`\n📋 Found ${themes.length} themes to process\n`);

  let browser;
  let serverProcess = null;

  try {
    // Start server first
    serverProcess = await startServer();

    // Launch browser
    console.log("🌐 Launching browser...");
    browser = await puppeteer.launch({
      headless: CONFIG.headless,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
      ],
      defaultViewport: CONFIG.viewport,
    });

    const page = await browser.newPage();

    // Set viewport
    await page.setViewport(CONFIG.viewport);

    // Navigate to HAX demo
    console.log(`🔗 Navigating to: ${CONFIG.baseUrl}`);
    await page.goto(CONFIG.baseUrl, {
      waitUntil: "networkidle2",
      timeout: CONFIG.timeout,
    });

    // Wait for HAXCMS to be available
    console.log("⏳ Waiting for HAXCMS to load...");
    await page.waitForFunction(
      () => {
        return (
          typeof globalThis.HAXCMS !== "undefined" && globalThis.HAXCMS.setTheme
        );
      },
      { timeout: CONFIG.timeout },
    );

    console.log("✓ HAXCMS loaded successfully");

    // Setup non-editing view (hide UI) before taking screenshots
    console.log("\n🔒 Setting up non-editing view...");
    const uiSetupSuccess = await setupNonEditingView(page);
    if (!uiSetupSuccess) {
      console.error("✗ Failed to setup non-editing view - continuing anyway");
    }

    console.log("\n🎨 Starting theme screenshot generation...");

    // Process each theme
    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < themes.length; i++) {
      const themeElement = themes[i];
      const progress = `[${i + 1}/${themes.length}]`;

      console.log(`\n${progress} ==========================================`);

      const success = await captureThemeScreenshot(page, themeElement);

      if (success) {
        successCount++;
        console.log(`    ✅ SUCCESS`);
      } else {
        failureCount++;
        console.log(`    ❌ FAILED`);
      }

      // Small delay between themes
      if (i < themes.length - 1) {
        await page.waitForTimeout(1000);
      }
    }

    // Summary
    console.log(`\n🏁 Automation Complete!`);
    console.log(`==========================================`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failureCount}`);
    console.log(`📁 Screenshots saved to: ${CONFIG.screenshotDir}`);

    if (successCount > 0) {
      console.log(`📊 Screenshots generated for:`);
      themes.forEach((theme) => {
        const largeScreenshotPath = path.join(
          CONFIG.screenshotDir,
          `theme-${theme}.jpg`,
        );
        const thumbScreenshotPath = path.join(
          CONFIG.screenshotDir,
          `theme-${theme}-thumb.jpg`,
        );

        const largeExists = fs.existsSync(largeScreenshotPath);
        const thumbExists = fs.existsSync(thumbScreenshotPath);

        if (largeExists || thumbExists) {
          let sizeInfo = "";
          if (largeExists && thumbExists) {
            const largeStats = fs.statSync(largeScreenshotPath);
            const thumbStats = fs.statSync(thumbScreenshotPath);
            sizeInfo = `(${Math.round(largeStats.size / 1024)}KB + ${Math.round(thumbStats.size / 1024)}KB thumb)`;
          } else if (largeExists) {
            const largeStats = fs.statSync(largeScreenshotPath);
            sizeInfo = `(${Math.round(largeStats.size / 1024)}KB, missing thumb)`;
          } else {
            const thumbStats = fs.statSync(thumbScreenshotPath);
            sizeInfo = `(missing large, ${Math.round(thumbStats.size / 1024)}KB thumb)`;
          }
          console.log(`  • ${theme} ${sizeInfo}`);
        }
      });
    }
  } catch (error) {
    console.error("\n💥 Fatal error during automation:", error.message);
    process.exit(1);
  } finally {
    if (browser) {
      console.log("\n🔒 Closing browser...");
      await browser.close();
    }

    // Stop server if we started it
    stopServer(serverProcess);
  }
}

// Handle process termination gracefully
process.on("SIGINT", async () => {
  console.log("\n\n⏹️  Automation interrupted by user");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n\n⏹️  Automation terminated");
  process.exit(0);
});

// Run the automation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runThemeAutomation().catch((error) => {
    console.error("\n💥 Unhandled error:", error);
    process.exit(1);
  });
}

export default {
  runThemeAutomation,
  captureThemeScreenshot,
  CONFIG,
};
