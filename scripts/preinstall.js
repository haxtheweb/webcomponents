const fs = require("fs");
const path = require("path");

// where am i? move to where I am. This ensures source is properly sourced
const dir = __dirname;

// go back a level so we can snag everything
const elementsDir = path.join(dir, "../elements");
const entries = fs.readdirSync(elementsDir, { withFileTypes: true });

// walk each directory and blow away node modules in case we installed incorrectly
for (const entry of entries) {
  if (entry.isDirectory()) {
    const projectPath = path.join(elementsDir, entry.name);
    const nodeModulesPath = path.join(projectPath, "node_modules");

    if (fs.existsSync(nodeModulesPath)) {
      fs.rmSync(nodeModulesPath, { recursive: true, force: true });
    }
  }
}