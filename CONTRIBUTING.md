# Contributing

> **New to the HAX ecosystem?** Start with the [ecosystem-wide developer onboarding](https://github.com/haxtheweb/issues/blob/master/CONTRIBUTING.md) — it covers prerequisites, cloning the core repos, and getting a local environment running. The guide below is specific to the webcomponents monorepo.

- [Contributing](#contributing)
  - [What is HAX and this Project?](#what-is-hax-and-this-project)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Install: w/ Dev Containers](#install-w-dev-containers)
    - [Install: w/ Bash script (supporting Git Bash/WSL/macOS/Linux)](#install-w-bash-script-supporting-git-bashwslmacoslinux)
    - [Windows Support](#windows-support)
    - [Manual Install](#manual-install)
    - [First-time Setup Verification](#first-time-setup-verification)
  - [Finding Issues to Work On](#finding-issues-to-work-on)
  - [Development Workflow](#development-workflow)
    - [Working on Web Components](#working-on-web-components)
    - [Code Standards](#code-standards)
  - [Common Issues](#common-issues)
  - [Communication](#communication)
  - [GitHub workflow](#github-workflow)
  - [Opening a Pull Request](#opening-a-pull-request)
  - [Code Review](#code-review)
  - [Best practices](#best-practices)
  - [Testing](#testing)
  - [Security](#security)

HAX is open source, but many of the people working on it do so as their day job.
In order to avoid forcing people to be "at work" effectively 24/7, we want to establish some semi-formal protocols around development.
Hopefully, these rules make things go more smoothly.

As a potential contributor, your changes and ideas are welcome at any hour of the day or night, weekdays, weekends, and holidays.
Please do not ever hesitate to ask a question or send a pull request.

## What is HAX and this Project?

HAX is an authoring experience that enables rapid creation of fast, static websites. This webcomponents monorepo contains reusable web components built with [Lit](https://lit.dev/) that power the HAX ecosystem. These components work standalone or as part of the broader HAX authoring platform.

**Key Technologies:**
- **Lit** - Modern web components library
- **Lerna** - Monorepo management
- **Yarn** - Package management
- **Node.js** - Runtime environment
- **Web Components** - Standards-based component architecture

This project contains 200+ web components in the `elements/` directory, each designed to be lightweight, accessible, and framework-agnostic.

## Getting Started

### Prerequisites
Before setting up your development environment, ensure you have:
- **Git** or **GitHub Desktop** for version control
- A **GitHub account** for submitting contributions

### Install: w/ Dev Containers
Our project follows the [Dev Container specification](https://containers.dev/implementors/spec/) to provide a consistent, UX-focused experience across operating systems. The container isolation ensures that users on Windows, macOS, and Linux can all develop with the same curated environment. <u>If</u> you're interested in **Dev Containers** (but want a more personalized setup), follow along these general steps: 
1. Install [Docker](https://docs.docker.com/get-started/get-docker/) (or another container runtime)
    * **Dev Containers** are broadly supported across OCI-compliant runtimes like Docker, [Podman](https://podman.io/docs/installation), and [OrbStack](https://docs.orbstack.dev/quick-start).
2. Install the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension for **VS Code**
    * Open **VS Code**, then select **Install Recommended Extensions** 
    * Accepting the alert will automatically download this with other helpful extensions
3. Afterwards, another alert will pop up in the **bottom right** corner of **VS Code**
    * Select **Reopen in Container**

Wait a few minutes for your **Dev Container** to be built, then you're ready to go!

Otherwise, please check out the [Quick install](README.md#getting-started) section in our README. This is a full, step-by-step walkthrough of a **Dev Container** installation (using simple applications and sane defaults)!

### Install: w/ Bash script (supporting Git Bash/WSL/macOS/Linux)
```bash
curl -fsSL https://raw.githubusercontent.com/haxtheweb/webcomponents/master/scripts/haxthewebme.sh -o haxthewebme.sh && sh haxthewebme.sh
```

### Windows Support
[Docker](https://docs.docker.com/desktop/setup/install/windows-install/), [Git Bash](https://git-scm.com/install/windows), or [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install) are recommended for the best cross-compatibility with HAX's developer tooling. We also support **PowerShell** for Windows contributors, although certain utilities may experience instability.

#### Windows Developer Mode
The monorepo uses symlinks in many parts of its local environment. This allows us to emulate the functionality of a live HAXsite without running the full system. On Windows, symlinks normally require running the shell as *Administrator*.

Enable **Developer Mode** to remove this *Administrator* requirement for common development tasks. Start by opening your **Windows Settings**:
* On Windows 10: Update and Security -> For developers -> Developer Mode
* On Windows 11: System -> Advanced -> For developers -> Developer Mode

#### Install: w/ PowerShell script (Windows)
```powershell
irm https://raw.githubusercontent.com/haxtheweb/webcomponents/master/scripts/haxthewebme.ps1 | iex
```

### Manual Install
*Notice: You will need to use [Node](https://nodejs.org/en/) version 6.0 or higher. Verify that you have yarn enabled — if not [install yarn globally](https://yarnpkg.com/lang/en/docs/install/). These web components are written in [ES6](https://tc39.es/ecma262/) and build routines compile to es5 to encompass legacy browsers.*

1. **Install Node.js**

   Visit [nodejs.org](https://nodejs.org/), then install **Node.js version 22.0** or higher
   * We recommend **fnm** as a cross-platform Node.js manager

2. **Fork and Clone the Repository**
   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/webcomponents.git
   cd webcomponents
   
   # Add upstream remote for syncing
   git remote add upstream https://github.com/haxtheweb/webcomponents.git
   ```

3. **Install Dependencies**
   ```bash
   # Install HAX CLI and yarn globally
   npm install --global @haxtheweb/create yarn
   
   # Install web component analyzer
   yarn global add web-component-analyzer
   
   # Install project dependencies (this may take a few minutes)
   yarn install
   ```

4. **Start the Development Server**
   ```bash
   # Start the main development server
   yarn start
   ```
   This will start the development environment at `http://localhost:8000/elements/haxcms-elements/demo/`

### First-time Setup Verification

Verify your setup is working:

1. **Check that the development server runs:**
   - Navigate to `http://localhost:8000/elements/haxcms-elements/demo/` in your browser
   - You should see the HAX development interface

2. **Test building components:**
   ```bash
   # Build all components (this may take several minutes first time)
   yarn run build
   ```

3. **Browse component demos:**
   - Navigate to `http://localhost:8000/elements/` to see available components
   - Click into individual component directories to view their demos

## Finding Issues to Work On

**New Contributors - Start Here:**

1. **Browse the unified issue queue:** https://github.com/haxtheweb/issues/issues
   - Look for issues labeled with `good first issue` or `help wanted`
   - Issues labeled `documentation` are often beginner-friendly

2. **Component-specific issues:**
   - Each component in `elements/` may have its own issues
   - Look for small bug fixes or feature enhancements

3. **Documentation improvements:**
   - Update component README files
   - Improve JSDoc comments
   - Enhance demo pages in component `demo/` directories

4. **Ask for guidance:**
   - Join our [Discord](https://discord.gg/aCGxmRHEJP) and introduce yourself
   - Ask "What's a good first issue for someone new to the project?"

**Before starting work:**
- Comment on the issue saying you'd like to work on it
- Wait for maintainer acknowledgment to avoid duplicate work
- Ask questions if the requirements aren't clear

## Development Workflow

### Working on Web Components

**To work on an existing component:**

1. **Navigate to the component:**
   ```bash
   cd elements/COMPONENT_NAME  # e.g., cd elements/simple-button
   ```

2. **Start component development:**
   ```bash
   yarn start  # Starts dev server for this specific component
   ```

3. **File structure:**
   ```
   elements/component-name/
   ├── lib/                    # Supporting files and utilities
   ├── component-name.js       # Main component source code
   ├── demo/                   # Demo HTML files
   ├── test/                   # Test files
   └── package.json           # Component-specific dependencies
   ```

4. **Making changes:**
   - Edit `component-name.js` for the main component logic
   - Update `demo/` files to test your changes
   - Modify files in `lib/` for supporting utilities
   - The dev server will auto-reload on changes

**To create a new component:**
```bash
# From the project root
hax webcomponent my-new-element --y
cd elements/my-new-element
yarn start
```

### Code Standards

**JavaScript/Lit:**
- Follow existing code style in the project
- Use Lit's best practices for web components
- Ensure components are accessible (ARIA attributes, keyboard navigation)
- Components should work in all modern browsers

**Formatting:**
- Code is automatically formatted with Prettier on commit
- CSS is formatted with Stylelint
- Run `yarn run format` to format all files

**Documentation:**
- Add JSDoc comments to all public methods and properties
- Update component README files
- Create comprehensive demo pages showing component usage

**Testing:**
- Write unit tests for new functionality when possible
- Ensure existing tests still pass: `yarn test`
- Test in multiple browsers if making significant changes

### i18n layout check (pseudo-locale and RTL)

Invariant: a HAX-capable element keeps a usable layout when its strings get longer (translations run ~30-40% longer than English) and when it sits in a right-to-left language (Arabic, Hebrew, Persian, Urdu). Translation files cannot show this, so the check renders the elements.

- **Which tags**: tags in `hax-elements-registry.json` whose class carries a HAXSchema (`haxProperties` on the class or an ancestor, or a `setHaxProperties(schema, "<tag>")` call), the same set the API snapshot covers. Each is rendered from its first `demoSchema` entry in Chromium in a 360px content column.
- **Scenarios**: English left-to-right (the control), a pseudo-locale, `dir="rtl" lang="ar"` on the column, and both. The pseudo-locale exists only in memory during the test: `i18n-manager` loads it through its normal path (the translation manifest, then `<namespace>.qps-ploc.json`), answered in the test page from each element's English `this.t` defaults with accents, ~40% padding and `⟦ ⟧` markers. No locale file is written, so the locale guard and the nightly translations never see it.
- **Checks** (each scenario reports only what differs from the control): `overflow-*` text wider or taller than its box (truncated or spilling; scrollable regions excluded), `outside-*` shadow-DOM parts rendered outside the host box, `rtl-unusable` a control visible in left-to-right that leaves the column in right-to-left, and `rtl-css` physical left/right CSS in `css` templates (`margin-left`, `padding-right`, `left:`, `text-align: left`, `border-left`, `float: right`, asymmetric 4-value `margin`/`padding`) that should be logical (`margin-inline-start`, `inset-inline-start`, `text-align: start`...). Symmetric pairs, `left: 50%` centering and rules scoped with `[dir=rtl]` or `:dir()` are not reported.
- **Advisory only**: visible shadow-DOM text or `aria-label`/`title`/`placeholder`/`alt` without pseudo markers that is not demo content (a hard-coded string candidate: move it into `this.t`), tags that ignore `dir="rtl"`, and tags that fail to render.
- **Run locally**: `yarn test:i18n-layout` checks the tags in element folders changed against the base branch (`--base <ref>` to pick another, `--tags a,b` for specific tags, `--all` for every tag). Exit 1 means a new failure. The full run takes about a minute.
- **Baseline**: `scripts/i18n-layout.baseline.json` records today's failures per tag and check. A failing check is new when the tag has no entry for it (or, for `rtl-css`, more findings than recorded). After fixing or intentionally accepting a result, run `yarn test:i18n-layout:baseline --tags <tag>` and commit the baseline; without `--tags` it re-runs every tag.
- **CI**: the `i18n-layout` workflow runs on pull requests touching `elements/**`, Chromium only, and blocks on new failures in the elements the pull request changes. Baselined failures in those elements are listed in the job summary so they can be worked down.

### Lerna
This monorepo has configuration settings for lerna. Lerna is for the core team, but to bulk run commands against the monorepo consider things like `npx lerna run build` to run build against all elements. This is useful when getting ready to ship.

## Common Issues

New contributors often encounter these issues. Here are solutions to the most common problems:

### Setup and Installation Issues

**"Port 8000 already in use" error:**
```bash
# Find and kill processes using port 8000
kill -9 $(lsof -t -i:8000)
# Or try a different port range
PORT=8001 yarn start
```

**Yarn install fails or hangs:**
```bash
# Clear cache and reinstall
rm -rf node_modules yarn.lock
yarn cache clean
yarn install
```

**Permission errors on global installs:**
```bash
# Configure npm to use a different directory
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
# Add the export line to your ~/.bashrc or ~/.zshrc
```

**Node version issues:**
```bash
# Check your Node version
node --version
# If using nvm, switch to Node 22+
nvm install 22
nvm use 22
```

### Development Issues

**Build errors after pulling latest changes:**
```bash
# Update dependencies after pulling
yarn install
# If that doesn't work, clean and reinstall
rm -rf node_modules yarn.lock
yarn install
yarn run build
```

**"Component not found" or import errors:**
- Ensure you're in the correct component directory: `cd elements/component-name`
- Check that the component name matches the directory name
- Verify the main component file exists: `ls component-name.js`

**Hot reload not working:**
- Make sure you're editing the correct files (`component-name.js`, not files in `dist/` or `build/`)
- Try restarting the dev server: `Ctrl+C` then `yarn start`
- Clear browser cache or try an incognito window

**Lerna-related errors:**
```bash
# Bootstrap all packages
npx lerna bootstrap
# Or clean and rebuild everything
npx lerna clean
yarn install
```

### Testing Issues

**Tests failing locally:**
```bash
# Run tests for a specific component
cd elements/component-name
yarn test
# Run tests with browser open for debugging
yarn test -- -p
```

**"Chromium not found" test errors:**
```bash
# On Ubuntu/Debian
sudo apt-get install chromium-browser
# On macOS
brew install chromium
```

### Git and GitHub Issues

**Fork is out of sync:**
```bash
# Sync your fork with upstream
git fetch upstream
git checkout master
git merge upstream/master
git push origin master
```

**Accidentally committed to master instead of a branch:**
```bash
# Create a new branch with your changes
git branch feature-branch-name
# Reset master to upstream
git reset --hard upstream/master
# Switch to your feature branch
git checkout feature-branch-name
```

### Performance Issues

**Slow build times:**
- Close unnecessary applications to free up memory
- Build specific components instead of everything: `cd elements/component-name && yarn build`
- Consider increasing Node's memory limit: `export NODE_OPTIONS="--max-old-space-size=4096"`

### Still Having Issues?

1. **Check if it's a known issue:** Search https://github.com/haxtheweb/issues/issues
2. **Ask on Discord:** Join https://discord.gg/aCGxmRHEJP and describe your problem
3. **Include helpful details:**
   - Your operating system and version
   - Node.js version (`node --version`)
   - Yarn version (`yarn --version`)
   - Full error message (use code blocks in Discord/GitHub)
   - What you were trying to do when the error occurred

## Communication

Reporting issues? Our unified issue queue is a good place for this: https://github.com/haxtheweb/issues/issues
Need to discuss something via chat? Our [Discord can be joined here](https://discord.gg/aCGxmRHEJP).

## GitHub workflow

We work primarily using pull requests and forks. In order to work most effectively, we ask that you FORK any project you are wanting to contribute to in our ecosystem. After taking a fork, submit a pull request while pointing to the associated issue tied to this pull request.

## Opening a Pull Request

Pull requests are often called a "PR".
HAX generally follows the standard [github pull request](https://help.github.com/articles/about-pull-requests/) process.

Common new contributor PR issues are:
- Not referencing the issue that the PR resolves
- Not describing the scope of the solution effectively
- Include mentions (like @person) and [keywords](https://help.github.com/en/articles/closing-issues-using-keywords) which could close the issue (like fixes #xxxx) in commit messages.

## Code Review

To make it easier for your PR to receive reviews, consider the reviewers will need you to:

- Write [good commit messages](https://chris.beams.io/posts/git-commit/)
- Break large changes into a logical series of smaller patches which individually make easily understandable changes, and in aggregate solve a broader issue

When reviewing PRs from others [The Gentle Art of Patch Review](http://sage.thesharps.us/2014/09/01/the-gentle-art-of-patch-review/) suggests an iterative series of focuses which is designed to lead new contributors to positive collaboration without inundating them initially with nuances:

- Is the idea behind the contribution sound?
- Is the contribution architected correctly?
- Is the contribution polished?

Note: if your pull request isn't getting enough attention, you can use our [Discord channel](https://discord.gg/aCGxmRHEJP) to get help finding reviewers.

## Best practices

- Write clear and meaningful git commit messages.
- If the PR will *completely* fix a specific issue, include `fixes #123` in the PR body (where 123 is the specific issue number the PR will fix. This will automatically close the issue when the PR is merged.
- Make sure you don't include `@mentions` or `fixes` keywords in your git commit messages. These should be included in the PR body instead.
- When you make a PR for small change (such as fixing a typo, style change, or grammar fix), please squash your commits so that we can maintain a cleaner git history.
- Make sure you include a clear and detailed PR description explaining the reasons for the changes, and ensuring there is sufficient information for the reviewer to understand your PR.
- Additional Readings: 
    - [chris.beams.io/posts/git-commit/](https://chris.beams.io/posts/git-commit/)
    - [github.com/blog/1506-closing-issues-via-pull-requests ](https://github.com/blog/1506-closing-issues-via-pull-requests)
    - [davidwalsh.name/squash-commits-git ](https://davidwalsh.name/squash-commits-git)
    - [https://mtlynch.io/code-review-love/](https://mtlynch.io/code-review-love/)

## Testing

Unit tests are ideal but not required to be written for proposed changes and enhancements.

### Render benchmarks

`yarn bench` times first render and a common update of hax-body, video-player, grid-plate, outline-designer, site-menu and simple-icon, comparing your working tree with `origin/master` in the same browser and reporting confidence intervals. It keeps those hot paths from getting slower unnoticed. CI runs it on pull requests labeled `perf` or touching those elements, as an advisory job summary that never fails the build. See [benchmarks/README.md](benchmarks/README.md).

### Mutation testing (outline-designer)

outline-designer's data logic (adding, moving, indenting, outdenting and deleting pages, sibling order, and the items Save Outline sends) changes a whole site in one save, so its tests have to notice a wrong condition or an off-by-one, not just run the code. [Stryker](https://stryker-mutator.io) checks that: it changes that code one small thing at a time (a `<` to `<=`, a `true` to `false`, a removed branch) and runs the outline tests against each change. A change the tests catch is "killed"; one they miss "survives" and points at an untested behavior.

- **Weekly, report only**: `.github/workflows/mutation-outline-designer.yml` runs Sundays (and on demand from the Actions tab). It never fails a build and opens nothing; read the score and surviving mutants in the run's job summary, and the full HTML report in its `mutation-report-outline-designer` artifact.
- **Locally**: `yarn test:mutation:outline` (under an hour on 2 CPUs), then open `reports/mutation/outline-designer/index.html`, or `node scripts/mutation/summarize.mjs reports/mutation/outline-designer/mutation.json` for the summary. The run writes the instrumented code over `elements/outline-designer/outline-designer.js` and restores it at the end (Stryker `inPlace`; a backup is kept in `.stryker-tmp/` until then), so do not edit that file while it runs.
- **What it covers**: `scripts/mutation/stryker.outline-designer.config.mjs` lists the line ranges (`mutate`) and the test files. When that code moves, update the ranges in the same PR. Stryker has no web-test-runner plugin, so its command runner starts web-test-runner with `scripts/mutation/wtr-outline-designer.config.mjs`, which passes the active mutant to the browser and leaves out the slow seeded random edits.
- **Surviving mutants**: kill one by adding a test that asserts the behavior it changed. If a mutant cannot change behavior (an equivalent mutant), leave it; to stop Stryker making it, put `// Stryker disable next-line <Mutator>: <why>` above the line.

### Memory-leak check

Invariant: removing a HAX-capable element from the page releases what it set up. Adding and removing it again and again must not leave growing global listeners, observers, intervals or animation-frame loops behind, must not grow `globalThis` stores, and the removed instances must be garbage-collectable. HAX adds and removes elements constantly (editing, previews, the outline designer, theme switches), so a leak per instance adds up over a session.

- **Which tags**: tags in `hax-elements-registry.json` whose class carries a HAXSchema (`haxProperties` on the class or an ancestor, or a `setHaxProperties(schema, "<tag>")` call), the same set the API snapshot covers. Each is built from its first `demoSchema` entry in Chromium, attached, awaited and removed 2 warm-up times, then 12 measured times (`LEAK_CHECK_CYCLES` to change it).
- **Checks**: `listeners` on `window`, `document`, `<html>`, `<body>` or a `matchMedia` list still registered; `observers` (`ResizeObserver`, `IntersectionObserver`, `MutationObserver`) still observing and alive after garbage collection; `intervals` never cleared; `raf-loops` (more `requestAnimationFrame` callbacks per frame for every cycle); `global-stores` (an array, map, set, plain-object registry or MobX observer count reachable from `globalThis` that grows); `retained` (removed instances alive after forced garbage collection). Each finding names the `file:line` that added it.
- **Singletons are fine**: only what grew with at least half of the measured cycles counts. Something created once (one store, a shared audio context, a listener registered once per tag) lands in the warm-up and is never reported.
- **Run locally**: `yarn test:leaks` checks the tags in element folders changed against the base branch (`--base <ref>` to pick another, `--tags a,b` for specific tags, `--all` for every tag). Exit 1 means a new leak. `yarn test:leaks --self-test` proves the check still finds each kind of leak in a known-leaky fixture and none in a clean one. If the Chromium Playwright downloaded does not match the installed one, point `LEAK_CHECK_CHROMIUM` at a Chromium binary.
- **Baseline**: `scripts/leak-check.baseline.json` records today's leaks per tag and check. A leak is new when the tag has no entry for that check. Updating it runs every tag twice (batched, then each tag alone in its page) and keeps both results, since what is already loaded changes what a tag leaves behind. In CI a new leak only fails the job when a second run of that tag sees it again. After fixing or intentionally accepting a result, run `yarn test:leaks:baseline --tags <tag>` and commit the baseline; without `--tags` it re-runs every tag.
- **Fixing a leak**: undo in `disconnectedCallback` what `connectedCallback` / `firstUpdated` set up (remove the listener, `disconnect()` the observer, `clearInterval`, `cancelAnimationFrame`, drop the instance from any global registry), or register with an `AbortController` signal and abort it on disconnect.
- **CI**: the `leak-check` workflow runs on pull requests touching `elements/**`, Chromium only, and blocks on new leaks in the elements the pull request changes. Baselined leaks in those elements are listed in the job summary so they can be worked down.

### HAX element API snapshot

Invariant: content authored with a HAX-capable element keeps working. An authorable tag never loses or renames an attribute, slot, HAX setting (property, attribute or slot name), gizmo, demoSchema tag, dispatched event, CSS part or documented CSS custom property unless the pull request says so on purpose.

- **Which tags**: custom element tags in `hax-elements-registry.json` whose class carries a HAXSchema (`static get haxProperties()` on the class or an ancestor, or a `setHaxProperties(schema, "<tag>")` call). Registry entries without one (app shells like `app-hax-site-bar`) and native HTML tags are not covered.
- **Snapshot**: `api-snapshot/elements/<tag>.json`, one file per tag, generated (never edited by hand). Attributes come from the custom elements manifest analyzer run in memory, including inherited and `attribute: "x"` mappings; HAX settings come from the element's haxProperties.
- **Check locally**: `yarn api:check --base origin/master`. It exits 1 when something snapshotted on the base branch or in the committed snapshot is gone. Additions only warn.
- **After adding API**: `yarn api:snapshot` and commit the changed `api-snapshot/elements/*.json`, so the new items are protected too.
- **Intended breaking change**: add an entry to `api-snapshot/allowed-removals.json` in the same pull request, then run `yarn api:snapshot`:

  ```json
  { "removals": [{ "tag": "video-player", "kind": "attributes", "item": "dark", "reason": "why existing content may break, and the migration" }] }
  ```

  `kind` is `tag` (the whole element; no `item`) or one of `attributes`, `slots`, `events`, `cssParts`, `cssProperties`, `hax.gizmo`, `hax.properties`, `hax.attributes`, `hax.slots`, `hax.demoTags`. Regenerating the snapshot alone does not pass the check, because CI also compares with the base branch's snapshot. Delete an entry once its pull request has merged.
- **CI**: the `api-snapshot` workflow runs on pull requests that touch `elements/**`, the registry or the snapshot, and is blocking. `node scripts/api-snapshot.mjs --report` lists skipped registry tags and oddities (HAX settings naming properties the element does not have).

### Unused code report

`yarn knip` runs [knip](https://knip.dev) over every workspace in `elements/` and lists imports of packages that an element's own `package.json` does not declare, dependencies nothing imports, files nothing loads and exports nothing uses. The rule it protects: every package a published element imports is declared in that element's `package.json`, so installing the element from npm brings what it needs. `node scripts/knip-report.mjs` prints the same findings as a short markdown summary, with unlisted dependencies in shipping code (not demos, tests or tooling) first.

CI runs it on pull requests and weekly on Sunday as an advisory job summary; it never fails the build.

Elements are loaded by tag at runtime as well as by import, so [`knip.config.js`](knip.config.js) treats each element's main file, `lib/*.js`, `demo/`, `test/` and every file listed in `wc-registry.json` as entry points. When knip reports something that is in fact loaded another way (by path from a script, a build step or a vendored library), add it to `extraEntries` or `vendored` in `knip.config.js` with a comment saying how it is loaded, rather than deleting it.

## Security

If you discover what you deem to be a critical security issue  please reach out on our Discord channel privately to discuss whether this should be resolved in the open prior or if disclosure should happen after a solution has been crafted.
