# Contributing

- [Contributing](#contributing)
  - [What is HAX and this Project?](#what-is-hax-and-this-project)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Development Setup](#development-setup)
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

Before contributing, ensure you have:
- **Node.js** version 22.0 or higher ([Install Node.js](https://nodejs.org/))
- **Yarn** package manager ([Install Yarn](https://yarnpkg.com/getting-started/install))
- **Git** for version control
- A **GitHub account** for submitting contributions

### Development Setup

1. **Fork and Clone the Repository**
   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/webcomponents.git
   cd webcomponents
   
   # Add upstream remote for syncing
   git remote add upstream https://github.com/haxtheweb/webcomponents.git
   ```

2. **Install Dependencies**
   ```bash
   # Install HAX CLI globally
   npm install --global @haxtheweb/create
   
   # Install web component analyzer
   yarn global add web-component-analyzer
   
   # Install project dependencies (this may take a few minutes)
   yarn install
   ```

3. **Start the Development Server**
   ```bash
   # Start the main development server
   yarn start
   ```
   This will start the development environment at `http://localhost:8001/elements/haxcms-elements/demo/`

### First-time Setup Verification

Verify your setup is working:

1. **Check that the development server runs:**
   - Navigate to `http://localhost:8001/elements/haxcms-elements/demo/` in your browser
   - You should see the HAX development interface

2. **Test building components:**
   ```bash
   # Build all components (this may take several minutes first time)
   yarn run build
   ```

3. **Browse component demos:**
   - Navigate to `http://localhost:8001/elements/` to see available components
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
   - Join our [Discord](https://bit.ly/hax-discord) and introduce yourself
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

## Common Issues

New contributors often encounter these issues. Here are solutions to the most common problems:

### Setup and Installation Issues

**"Port 8001 already in use" error:**
```bash
# Find and kill processes using port 8001
kill -9 $(lsof -t -i:8001)
# Or try a different port range
PORT=8002 yarn start
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
2. **Ask on Discord:** Join https://bit.ly/hax-discord and describe your problem
3. **Include helpful details:**
   - Your operating system and version
   - Node.js version (`node --version`)
   - Yarn version (`yarn --version`)
   - Full error message (use code blocks in Discord/GitHub)
   - What you were trying to do when the error occurred

## Communication

Reporting issues? Our unified issue queue is a good place for this: https://github.com/haxtheweb/issues/issues
Need to discuss something via chat? Our [Discord can be joined here](https://bit.ly/hax-discord).

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

Note: if your pull request isn't getting enough attention, you can use our [Discord channel](https://bit.ly/hax-discord) to get help finding reviewers.

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

## Security

If you discover what you deem to be a critical security issue  please reach out on our Discord channel privately to discuss whether this should be resolved in the open prior or if disclosure should happen after a solution has been crafted.
