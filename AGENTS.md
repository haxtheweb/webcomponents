# AGENTS.md

> **Agents start here (webcomponents monorepo)**
> - Read `llms.txt` in this folder, then the `hax-webcomponent-dev` skill: <https://github.com/haxtheweb/create/blob/main/src/skills/hax-webcomponent-dev/SKILL.md>.
> - Before writing a new element, search the existing ones: `hax wc --search <words>` or `elements-catalog.json` (tag, title, description, package, import path, HAX type, tags). Prefer composing existing elements.
> - Create new elements only with `hax webcomponent <name> --y --no-i` (the global `hax`, never `npx hax`), and run `hax audit` in the element folder before you finish. Never pass `--no-docs` here: every element's build must end with `node ../../scripts/extract-element-docs.mjs --write .` so its `lib/<tag>.docs.json` ships for `<documentation-player>`. After changing an element's properties, HAX settings, slots or events, run `yarn run build` in its folder and commit the refreshed docs data.
> - Never run the ubiquity script and never run a build at the top of this monorepo.

This file provides comprehensive instructions for AI coding agents working within the HAX ecosystem. HAX (Headless Authoring eXperience) is a comprehensive web development ecosystem that enables rapid creation of accessible, performant web components and static sites. Follow these guidelines to set up, develop, test, and contribute effectively to HAX projects.

## Ecosystem context (maintained in PRAW)

Shared HAX ecosystem guidance (repo map, pillars, rules, scoped rules, skills) lives in one place,
https://github.com/haxtheweb/praw, and is read from there instead of being copied into each repo:

- Always-on rules and ecosystem index: <https://github.com/haxtheweb/praw/blob/main/WARP.md>
- Rule registry, by Rule ID: <https://github.com/haxtheweb/praw/blob/main/RULES.md>
- Scoped rules: [webcomponents](https://github.com/haxtheweb/praw/blob/main/webcomponents/WARP.md), [HAXcms backends](https://github.com/haxtheweb/praw/blob/main/haxcms/WARP.md), [DDD design system](https://github.com/haxtheweb/praw/blob/main/design-system/WARP.md)
- What HAX is, pillars, and the repo map: <https://github.com/haxtheweb/praw/blob/main/what-is-hax.md>
- Workflow skills: <https://github.com/haxtheweb/praw/tree/main/skills>; interface skills: <https://github.com/haxtheweb/create/tree/main/src/skills>
- Machine-readable index: <https://raw.githubusercontent.com/haxtheweb/praw/main/llms.txt>
- Work queue: <https://github.com/haxtheweb/issues> (`gh issue list --repo haxtheweb/issues`)
- CLI options: `hax help`, `hax <command> --help`, or `man hax`

## Development Environment Setup

### Issue Management
Before starting any work, check the unified issue queue:
- All HAX ecosystem issues are tracked at `haxtheweb/issues`
- Use GitHub CLI to check issues: `gh issue list`
- Reference existing issues when making contributions

## Setup Commands

- **Install HAX CLI globally**:
  ```bash
  npm install @haxtheweb/create --global
  ```
- **Install project dependencies** (run from the project root):
  ```bash
  npm install
  ```
- **Start interactive CLI** (for web components or HAXsites):
  ```bash
  hax start
  ```
  - Launches an interactive CLI with ASCII art (via Clack).
- **Start development server** (for HAXsites):
  ```bash
  hax serve
  ```
  - Launches the site in development mode at `http://localhost`.
- **Create a new web component**:
  ```bash
  hax webcomponent my-element --y
  ```
  - Creates a LitElement-based web component with DDD design system and i18n support.
  - In a monorepo, places the component in the correct location and inherits settings.
- **Create a new HAXsite**:
  ```bash
  hax site mysite --y
  ```
  - Generates a HAXcms-based static site with templated files.
- **Update HAX CLI**:
  ```bash
  hax update
  ```
- **Alternative usage** (one-time execution without global install):
  ```bash
  npx @haxtheweb/create
  ```
  or
  ```bash
  npm init @haxtheweb
  ```
- **Windows-specific setup**:
  - If issues occur, set a custom npm cache path:
    ```bash
    npm config set cache C:\tmp\nodejs\npm-cache --global
    ```
  - For PowerShell, check execution policy to allow scripts:
    ```bash
    Get-ExecutionPolicy
    ```
    Adjust if needed using `Set-ExecutionPolicy` (see [Microsoft documentation](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-7.4)).

## Code Style & Standards

### JavaScript-Only Architecture
- **Language**: Pure JavaScript with LitElement for web components
- **NO TypeScript**: HAX strictly avoids TypeScript to eliminate compilation requirements
- **Unbundled Approach**: Components ship as native JS/HTML/CSS for maximum compatibility
- **Third-party Libraries**: When using libraries written in TypeScript, always import the pre-compiled JavaScript distribution

### JavaScript Standards
- **Global References**: Use `globalThis` instead of `window` for consistency across environments
- **Formatting**:
  - Use single quotes (`'`)
  - Avoid semicolons where possible
  - Prefer functional programming patterns
  - Use Prettier for consistent formatting
- **ES Modules**: Use standard ES6 import/export syntax
- **Modern JavaScript**: Leverage ES2018+ features while maintaining browser compatibility
- **CSS template literals**: Never write a backtick (`` ` ``) character inside a `css` comment block (or anywhere else in a LitElement `css\`...\`` tagged template), including in prose like "don't" or "it's". A stray backtick terminates the template literal early and breaks the build/parse.

### Design System Integration
- **DDD System**: All components MUST adhere to the DDD (Design, Develop, Destroy) design system
  - Location: `elements/d-d-d` in the webcomponents repository
  - Use DDD for fonts, colors, padding, spacing, margins, and other design tokens
  - Inherit from `DDDSuper` class for automatic DDD integration
  - Reference `.dddignore` file to exclude irrelevant files during audits

### Component Architecture
- **HAX Properties**: Include `haxProperties` in web components for HAX compatibility (use `--writeHaxProperties` flag)
- **Theme Development**: HAXcms themes should extend `HAXCMSLitElement` class
- **File Structure**:
  - Web components: Place source files in `src/` or `lib/` directories
  - HAXsites: Pages in `pages/`, themes in `theme/`, assets in `assets/`
  - Monorepo: Each component gets its own directory in `elements/`

### Naming Conventions
- **Web Components**: Use hyphenated names (e.g., `my-element`)
- **Package Names**: Match component/site name in `package.json`
- **CSS Classes**: Follow BEM methodology when not using DDD tokens

### Internationalization (i18n)
- Use provided i18n wiring for web components (automatically included with `hax webcomponent`)
- Support multiple languages from the start

## Build System & Testing

### Build Process Understanding
The HAX ecosystem uses a sophisticated build pipeline optimized for unbundled JavaScript delivery:

1. **Gulp**: Handles asset compilation and processing
2. **Prettier**: Ensures consistent code formatting  
3. **CEM (Custom Elements Manifest)**: Generates `custom-elements.json` for component metadata
4. **Lerna**: Manages monorepo dependencies and publishing
5. **No TypeScript Compilation**: Pure JavaScript workflow eliminates build complexity

### Build Commands
- **Standard build** (from component root):
  ```bash
  yarn run build
  ```
  - Compiles assets, formats code, generates custom-elements.json
  - **CRITICAL**: Always run this after changes to HAXCMSLitElement themes
  - Do NOT manually edit `custom-elements.json` - it's auto-generated

- **Development build with watching**:
  ```bash
  yarn run dev
  ```

### Testing Instructions

- **Run tests** (from project or component root):
  ```bash
  npm test
  ```

- **Monorepo testing**:
  ```bash
  npm run test --filter <component_name>
  ```
  - Tests specific component in monorepo
  - Use Lerna for more complex filtering

### DDD Compliance Auditing
- **Audit web components for DDD compliance**:
  ```bash
  hax audit
  ```
  - Checks CSS and structure against DDD design system standards
  - Ignores files listed in `.dddignore`
  - Run from component root for accurate results
  - **Required** before submitting theme components

### Code Quality
- **Linting**:
  ```bash
  npm run lint
  ```
  - Ensures code style compliance before committing
  - Uses ESLint, Prettier, and Stylelint

- **Fix issues automatically**:
  ```bash
  npm run lint:fix
  ```

### Example `.dddignore` Template
```plaintext
/node_modules
/dist
/build
/public
/test
/.github
/.vscode
/.idea
/locales
LICENSE
.dddignore
.editorconfig
.gitignore
.npmignore
*.md
*.yml
*.json
*.png
*.svg
```

## Pull Request Instructions

- **PR Title Format**: `[<project_name>] <Descriptive Title>`
  - Example: `[my-element] Add dynamic property binding`
- **Pre-commit checks**:
  - Run `yarn precheck` before every push or PR. It runs the Prettier, Stylelint, ESLint and DDD token checks CI runs, on the files you changed. Fix everything it reports and re-run until it passes (`yarn precheck:fix` auto-fixes formatting and fixable lint). A Claude Code hook in `.claude/` blocks `git push` and `gh pr create` until it passes.
  - Run `npm test` to ensure all tests pass.
  - Run `npm run lint` to verify code style.
  - Run `hax audit` for web components to confirm DDD compliance.
- **Commit Guidelines**:
  - Use clear, descriptive commit messages (e.g., "Add i18n support to my-element").
  - Include relevant changes to tests or documentation.
- **HAXsite PRs**:
  - Test locally with `hax serve` to verify page rendering.
  - Ensure new pages or content updates align with `site.json` and JSON Outline Schema.

## Security Considerations

- **Security Audits**: For recurring security audits of this repo, start with `SECURITY-AUDIT.md` — it defines the read order, scope, commands, regression guards, and reporting convention
- **Dependencies**: Keep dependencies updated before running `npm install`
- **Sensitive Data**: Avoid committing API keys or sensitive data to `package.json`, `site.json`, or public files
- **Site Imports**: Validate source URLs when using `--import-site` to prevent malicious content
- **File Permissions**: Ensure scripts have correct execution permissions (`chmod +x script.sh`)
- **Component Security**: Sanitize user inputs in custom components
- **Schema Validation**: Validate against JSON schemas before processing content
- **Library Security**: Only import from trusted, well-maintained JavaScript distributions

## Troubleshooting Common Issues

### Build Failures
- **Missing custom-elements.json**: Run `yarn run build` from component root
- **DDD Audit Failures**: Check `.dddignore` and fix CSS token usage
- **Lerna Issues**: Run `lerna clean && lerna bootstrap`

### Development Environment
- **CLI Not Found**: Ensure `@haxtheweb/create` is globally installed
- **Permission Errors**: Check file permissions and ownership

### Component Issues
- **Theme Not Loading**: Verify HAXCMSLitElement inheritance and build process
- **DDD Tokens Missing**: Import DDD properly and use CSS custom properties
- **HAX Integration**: Ensure `haxProperties` are defined correctly
- **Library Import Errors**: Verify you're importing JavaScript distributions, not TypeScript sources

### Performance Issues
- **Slow Loading**: Check for unnecessary dependencies or large imports
- **Bundle Size**: HAX's unbundled approach should keep individual files small
- **Memory Usage**: Monitor component lifecycle and cleanup

---

*This AGENTS.md file is maintained across all HAX ecosystem repositories to ensure consistent development experience regardless of entry point.*

## Monorepo (Lerna)

```bash
# Run command across all components
lerna run build

# Publish components (maintainers only)
lerna publish

# Add dependency to specific component
lerna add package-name --scope=@haxtheweb/component-name
```

## Community & Support

- **HAX Community**: Run `hax party` for involvement opportunities
- **Discord**: https://discord.gg/aCGxmRHEJP
- **Issue Reporting**: Use `haxtheweb/issues` or GitHub interface
- **Merlin Integration**: Use "Issue" command in HAX spaces for automated reporting
- **Documentation**: Run `man hax` (Linux/macOS) for comprehensive CLI docs
- **Educational Resources**: Complete documentation at https://haxtheweb.org/
