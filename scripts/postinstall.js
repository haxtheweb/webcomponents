const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Is this a Bash Shell running on Windows?
let isWinBash = false;
try {
  const unameOut = execSync("uname -s", { stdio: "pipe" }).toString().trim();
  // Set to true if the uname includes CYGWIN or MINGW
  isWinBash = /CYGWIN|MINGW/.test(unameOut);
} catch(e) {
  // ignore otherwise
}

const dir = __dirname;

// where am i? move to where I am. This ensures source is properly sourced
const haxModulesDir = path.resolve(dir, "../node_modules/@haxtheweb");
process.chdir(haxModulesDir);

// ensure our node modules are not nested in _deprecated dependencies
for (const project of listDirs(".")) {
  const sourcePath = path.join(haxModulesDir, project);
  const localModules = path.join(sourcePath, "node_modules");
  remove(localModules);
}

// go back a level so we can snag everything
const elementsDir = path.resolve(haxModulesDir, "../../elements");
process.chdir(elementsDir);

// walk each directory and update it's demo automatically
for (const project of listDirs(".")) {
  const sourcePath = path.join(elementsDir, project);
  const p = project;

  process.chdir(sourcePath);

  remove("node_modules");

  const symlinkRoot = path.resolve(sourcePath, "../../node_modules/@haxtheweb", p);
  // drop symlink but NOT actual directories
  unlink(symlinkRoot);
  // if it was a folder, then this will just fail without an issue
  mkdir(symlinkRoot);

  symlinkFile(`${p}.js`, symlinkRoot);
  symlinkFile("package.json", symlinkRoot);

  symlinkDir("lib", symlinkRoot);
  symlinkDir("locales", symlinkRoot);
  symlinkDir("server", symlinkRoot);
  symlinkDir("build", symlinkRoot);
  symlinkDir("dist", symlinkRoot);

  // remove nested lib/lib
  if (fs.existsSync("lib/lib")) {
    console.log(`Found nested lib/lib in ${p}, deleting...`);
    unlink("lib/lib");
  }

  if (fs.existsSync("locales/locales")) {
    console.log(`Found nested locales/locales in ${p}, deleting...`);
    unlink("locales/locales");
  }

  process.chdir(elementsDir);
}

// ensure haxcms-elements/demo/node_modules symlink is valid
process.chdir("..")
const demoDir = path.resolve(dir, "../elements/haxcms-elements/demo/")
unlink(`${demoDir}/node_modules`)
symlinkDir("node_modules", demoDir)

// this ensures that the storybook tooling works
const storybookDir = path.resolve(dir, "../node_modules/storybook-prebuilt");

process.chdir(storybookDir);

execSync("yarn install --prod", {
  stdio: "inherit",
});

console.log("Done.");

// Helper functions
function remove(target) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

function unlink(target) {
  try {
    const stat = fs.lstatSync(target);
    if (stat.isSymbolicLink()) {
      fs.unlinkSync(target);
    }
  } catch (e) {
    // ignore if not a symlink or doesn't exist
  }
}

function mkdir(target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
}

function listDirs(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .map((dir) => dir.name);
}

function symlinkFile(name, symlinkRoot) {
  if(!fs.existsSync(name)) return;

  const src = path.resolve(process.cwd(), name);
  const dest = path.join(symlinkRoot, name);
  const relativeSrc = path.relative(path.dirname(dest), src);

  try {
    if (!fs.existsSync(dest)) {
      // Node:FS still calls Windows-native symlinks when running in Git Bash/Cygwin
      // We override this because the Unix utility works without an Administrator shell
      isWinBash ? execSync(`ln -s "${relativeSrc}" "${dest}"`) : fs.symlinkSync(relativeSrc, dest, "file");
    }
  } catch (e) {
    console.warn("Symlink failed:", dest);
  }
}

function symlinkDir(name, symlinkRoot) {
  if (!fs.existsSync(name)) return;
  if (!fs.lstatSync(name).isDirectory()) return;

  const src = path.resolve(process.cwd(), name);
  const dest = path.join(symlinkRoot, name);
  const relativeSrc = path.relative(path.dirname(dest), src);

  try {
    if (!fs.existsSync(dest)) {
      // Node:FS still calls Windows-native symlinks when running in Git Bash/Cygwin
      // We override this because the Unix utility works without an Administrator shell
      isWinBash ? execSync(`ln -s "${relativeSrc}" "${dest}"`) : fs.symlinkSync(relativeSrc, dest, "dir");
    }
  } catch (e) {
    console.warn("Symlink failed:", dest);
  }  
}