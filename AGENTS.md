# AGENTS.md

This file provides comprehensive instructions for AI coding agents working within the HAX ecosystem. HAX (Headless Authoring eXperience) is a comprehensive web development ecosystem that enables rapid creation of accessible, performant web components and static sites. Follow these guidelines to set up, develop, test, and contribute effectively to HAX projects.

## HAX Ecosystem Overview

The HAX ecosystem consists of multiple interconnected repositories, each serving specific purposes:

### Core Repositories

- **`webcomponents`** - The heart of HAX: a monorepo containing 250+ LitElement-based web components, themes, and the DDD design system. All components are built with accessibility, performance, and HAX compatibility in mind.

- **`create` (@haxtheweb/create)** - The HAX CLI tool for scaffolding new web components, HAXsites, and managing the development workflow. This is your primary interface for creating new HAX projects.

- **`haxcms-php`** - PHP backend implementation of HAXcms, providing content management capabilities, API endpoints, and server-side rendering for HAXsites.

- **`haxcms-nodejs`** - Node.js backend implementation of HAXcms, offering the same capabilities as the PHP version but in a JavaScript environment.

- **`desktop`** - Electron-based desktop application that provides a local development environment for HAX, combining the power of HAXcms with desktop convenience.

### Supporting Repositories

- **`hax11ty`** - Integration layer that bridges HAX components with Eleventy (11ty) static site generator, enabling HAX components in traditional static sites.

- **`json-outline-schema`** - Defines the JSON schema used by HAXcms for content structure, site navigation, and metadata management.

- **`hax-schema`** - Contains HAX property schemas that define how web components integrate with the HAX authoring interface.

- **`open-apis`** - Microservice APIs and shared infrastructure for HAXTheWeb ecosystem. Contains Express-based Vercel endpoints deployed at https://open-apis.hax.cloud/ providing advanced capabilities like content importing, parsing, analysis, site conversion, and migration services. Also hosts the pre-built Storybook documentation for HAX components.

- **`docs`** - Official HAX documentation site built as a HAXcms site. Contains comprehensive documentation about HAX philosophy, pillars, community guidelines, tutorials, and developer resources. Structure follows HAXcms conventions with site.json (JSON Outline Schema), pages/ directory for content, and files/ for assets.

- **`issues`** - Unified issue tracking repository for the entire HAX ecosystem, where all bugs, features, and discussions are centralized.

### Development Philosophy & Community Pillars

HAX is built on a foundation of community pillars that guide all development decisions and community interactions. These are not just technical specifications but ethical commitments:

#### Core Pillars
- **Accessible**: HAX maximizes accessibility while removing the knowledge required to maintain accessibility standards. Components adhere to WCAG 2.0 AA standards, with automated color contrast ratios and expert-audited implementations.
- **Extensible**: Built for sustainable extension through web standards, microservices, and modular architecture that grows with user needs.
- **Free and Open**: Open community welcoming all (Penn State and beyond), embracing the 5Rs of OER (Retain, Reuse, Revise, Remix, Redistribute) for content and code.
- **Efficient**: Optimized for performance through web standards over heavy libraries, lazy loading, offline capability, and minimal resource usage.
- **Platform Agnostic**: Works anywhere - standalone HAXsites, integrated HAXcms, static web pages, or existing CMS platforms.
- **Remixable**: Maximizes remix-ability through modular design, open licensing, and semantic content structures.
- **Sustainable**: Environmental (less data, lower battery usage), technological (web standards-based longevity), and community (inclusive, collaborative governance) sustainability.

#### Technical Emphasis
- **Rapid Development**: Scaffolding tools and design systems accelerate creation
- **Unbundled Delivery**: Pure JavaScript, HTML, CSS approach without compilation steps
- **Modularity**: Components work independently and compose together seamlessly
- **Ubiquitous Web**: The web needs a file format - content should "just work" regardless of how it was built

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
- **External Dependencies**: Leverage libraries like `vaadin-upload`, `shoelace-carousel`, etc. but always use their JS builds

### JavaScript Standards
- **Global References**: Use `globalThis` instead of `window` for consistency across environments
- **Formatting**:
  - Use single quotes (`'`)
  - Avoid semicolons where possible
  - Prefer functional programming patterns
  - Use Prettier for consistent formatting
- **ES Modules**: Use standard ES6 import/export syntax
- **Modern JavaScript**: Leverage ES2018+ features while maintaining browser compatibility

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

- **Monorepo build** (from webcomponents root):
  ```bash
  yarn run build
  ```
  - Builds all components in the monorepo

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
  - Run `npm test` to ensure all tests pass.
  - Run `npm run lint` to verify code style.
  - Run `hax audit` for web components to confirm DDD compliance.
- **Commit Guidelines**:
  - Use clear, descriptive commit messages (e.g., "Add i18n support to my-element").
  - Include relevant changes to tests or documentation.
- **HAXsite PRs**:
  - Test locally with `hax serve` to verify page rendering.
  - Ensure new pages or content updates align with `site.json` and JSON Outline Schema.

## CLI Command Options

The HAX CLI supports various options for fine-tuned control. Use `hax help`, `hax webcomponent --help`, or `hax site --help` for details. Key options include:
- `--v`: Verbose output.
- `--debug`: Developer-focused output.
- `--format <char>`: Output format (json, yaml; default: json).
- `--path <char>`: Directory to perform operation.
- `--name <char>`: Project or component name.
- `--npm-client <char>`: Package manager (npm, yarn, pnpm; default: npm).
- `--y` or `--auto`: Auto-accept all prompts.
- `--skip`: Skip animations for faster execution.
- `--quiet`: Suppress console logging.
- `--no-i`: Prevent interactive sub-processes (ideal for scripting).
- `--to-file <char>`: Redirect output to a file.
- `--no-extras`: Skip automatic command processing.
- `--root <char>`: Root directory for command execution.
- `--org <char>`: Organization for `package.json`.
- `--author <char>`: Author for site or `package.json`.
- `--writeHaxProperties`: Write `haxProperties` for web components.
- `--import-site <char>`: URL of site to import.
- `--import-structure <char>`: Import method (e.g., pressbooksToSite, htmlToSite).
- `--custom-theme-name <char>`: Custom theme name for HAXsites.
- `--custom-theme-template <char>`: Theme template (base, polaris-flex, polaris-sidebar).
- `--repos <char...>`: Repositories to clone.

## HAX Theme Development

### Theme Architecture
- **Base Class**: HAXcms themes extend `HAXCMSLitElement` class
- **Design Integration**: Themes inherit DDD design system automatically
- **Template Options**: Choose from `base`, `polaris-flex`, `polaris-sidebar`
- **Custom Themes**: Create entirely custom themes with full control
- **Pure JavaScript**: All theme code written in JavaScript, HTML, CSS only

### Theme Creation Workflow
1. **Create custom theme**:
   ```bash
   hax site --custom-theme-name my-theme --custom-theme-template base
   ```

2. **Modify theme files** in the generated theme directory
   - Edit JavaScript files directly (no TypeScript compilation needed)
   - Use standard HTML templates
   - Apply CSS with DDD tokens

3. **Build theme** (CRITICAL STEP):
   ```bash
   yarn run build
   ```
   - Generates `custom-elements.json`
   - Compiles styles and assets
   - Updates component metadata

4. **Test theme locally**:
   ```bash
   hax serve
   ```

### Theme Best Practices
- Use DDD tokens for consistent styling
- Import external libraries from their JavaScript distributions
- Implement responsive design patterns
- Ensure accessibility compliance
- Test across different content types
- Follow HAX component patterns

## Monorepo Navigation & Management

### Repository Structure
```
~/Documents/git/haxtheweb/
├── webcomponents/           # Component library & themes
│   └── elements/           # Individual components
│       ├── d-d-d/         # Design system
│       ├── clean-two/     # Example theme
│       └── [250+ more]/   # All other components
├── create/                 # HAX CLI tool
├── haxcms-php/            # PHP backend
├── haxcms-nodejs/         # Node.js backend  
├── desktop/               # Electron app
├── hax11ty/              # 11ty integration
├── json-outline-schema/   # Content schemas
├── hax-schema/           # HAX property schemas
├── open-apis/            # Microservice APIs & Storybook
│   ├── api/               # Express Vercel endpoints
│   │   ├── apps/         # HAXcms conversion services
│   │   ├── services/     # Media processing, analysis
│   │   ├── users/        # Authentication endpoints
│   │   └── utilities/    # Shared API helpers
│   └── storybook/        # Component documentation
├── docs/                 # Official HAX documentation
│   ├── site.json         # JSON Outline Schema structure
│   ├── pages/            # Documentation content (HTML)
│   └── files/            # Assets and media
└── issues/               # Unified issue tracking
```

### Working Across Repositories
- **Component Development**: Work in `webcomponents/elements/[component-name]/`
- **CLI Development**: Work in `create/`
- **Backend Development**: Choose `haxcms-php/` or `haxcms-nodejs/`
- **API/Microservices**: Develop Express endpoints in `open-apis/api/`
- **Documentation**: Update in `docs/` (HAXcms site format)
- **Schema Changes**: Update in `json-outline-schema/` or `hax-schema/`
- **Issues**: Always check `issues/` first

### Lerna Management (webcomponents repo)
```bash
# Run command across all components
lerna run build

# Publish components (maintainers only)
lerna publish

# Add dependency to specific component
lerna add package-name --scope=@haxtheweb/component-name
```

## Advanced HAX Patterns

### Content Import & Migration
- **Import from external sources**:
  ```bash
  hax site --import-site https://example.com --import-structure htmlToSite
  ```
  
- **Supported import methods**:
  - `pressbooksToSite` - Academic textbook platform
  - `elmslnToSite` - ELMS Learning Network
  - `haxcmsToSite` - Between HAXcms instances
  - `notionToSite` - Notion workspace
  - `gitbookToSite` - GitBook documentation
  - `evolutionToSite` - Evolution CMS
  - `htmlToSite` - Generic HTML import
  - `docxToSite` - Microsoft Word documents

### Site Management
- **Add pages programmatically**:
  ```bash
  hax site --title "New Page" --content "<p>Content</p>" --slug "new-page"
  ```
  
- **Advanced page options**:
  ```bash
  hax site --title "Page" --parent "parent-slug" --order 3 --theme "custom-theme" --hide-in-menu
  ```

### GitHub CLI Integration
- **Check issues**: `gh issue list`
- **Create issues**: `gh issue create`
- **Review PRs**: `gh pr review`
- **CLI is pre-installed** - use directly without verification

### External Library Integration
- **Vaadin Components**: Import from `@vaadin/[component]/[component].js`
- **Shoelace Components**: Import from `@shoelace-style/shoelace/dist/components/[component]/[component].js`
- **Other Libraries**: Always use the `/dist/` or compiled JavaScript version
- **Open APIs**: Leverage https://open-apis.hax.cloud/ for conversion, analysis, and processing services
- **Avoid**: Direct TypeScript imports or source files requiring compilation

## Additional Instructions

## HAX Cloud Infrastructure

### HAX.cloud Services
HAX leverages cloud infrastructure at https://hax.cloud for:
- **CDN**: Content delivery network for component libraries
- **AI Services**: Content analysis and processing capabilities
- **Documentation**: Centralized documentation and community resources
- **Open Infrastructure**: Publicly available APIs and services

### Microservice Architecture
- **open-apis.hax.cloud**: Conversion, analysis, and processing services
- **Stateless Design**: Services designed for scalability and reliability
- **REST APIs**: Standard HTTP interfaces for integration
- **Vercel Deployment**: Serverless functions for optimal performance

## Ecosystem-Specific Guidance

### Development Workflows
- **Monorepo Support**: Place additional `AGENTS.md` files in subproject folders for component-specific instructions
- **Schema Evolution**: Changes to JSON schemas require coordination across repositories
- **Component Dependencies**: Use `@haxtheweb/` scope for internal dependencies
- **Version Synchronization**: Components should maintain version alignment
- **No Compilation Step**: Pure JavaScript approach means faster development cycles
- **API Development**: Express endpoints in `open-apis/` deploy automatically to Vercel at https://open-apis.hax.cloud/

### Documentation Standards
- **HAXcms Format**: Documentation sites use HAXcms structure (site.json + pages/ + files/)
- **JSON Outline Schema**: All content structure follows standardized schema
- **Semantic HTML**: Content authored in semantic HTML for maximum portability
- **Asset Management**: Media files organized in files/ directory with proper metadata

### Community Governance
- **Pillar-Driven Development**: All decisions evaluated against community pillars
- **Inclusive Decision Making**: Community input welcomed on major changes
- **Issue-Driven Development**: Work organized through GitHub issues with pillar labels
- **Educational Mission**: Remember HAX's roots in empowering educators and learners

## Educational & Pedagogical Context

HAX has deep roots in educational technology, evolving from over a decade of work in online learning:

### Educational Heritage
- **ELMS:LN Legacy**: HAX evolved from ELMS Learning Network (2012-2022), a Next Generation Digital Learning Environment (NGDLE) that powered hundreds of online courses at Penn State and beyond
- **OER Commitment**: Embraces the 5Rs of Open Educational Resources (Retain, Reuse, Revise, Remix, Redistribute)
- **Instructional Design Focus**: Built-in support for pedagogical patterns through specialized components

### Educational Components
HAX includes purpose-built components for learning:
- **Question Types**: Multiple choice, fill-in-the-blanks, drag-and-drop, true/false, short answer, sorting, tagging
- **Instructional Tools**: Self-check activities, stop notes, timelines, math notation (MathML/LaTeX)
- **Assessment Features**: Immediate feedback, progressive disclosure, formative assessment patterns
- **Accessibility in Learning**: Screen reader compatibility, keyboard navigation, high contrast support

### Pedagogical Patterns
- **Chunked Content**: Break complex topics into digestible components
- **Active Learning**: Interactive elements encourage engagement over passive consumption
- **Universal Design for Learning**: Multiple means of representation, engagement, and expression
- **Evidence-Based Design**: Components based on learning science research

### Related Educational Projects
- **ELMS:LN**: Legacy platform still maintained but effectively replaced by HAX
- **Course Design Templates**: Pre-built pedagogical frameworks for common course structures
- **Learning Analytics**: Integration points for tracking learner engagement and progress

### Community & Support
- **HAX Community**: Run `hax party` for involvement opportunities
- **Discord**: https://bit.ly/hax-discord
- **Issue Reporting**: Use `haxtheweb/issues` or GitHub interface
- **Merlin Integration**: Use "Issue" command in HAX spaces for automated reporting
- **Documentation**: Run `man hax` (Linux/macOS) for comprehensive CLI docs
- **Educational Resources**: Complete documentation at https://haxtheweb.org/

## Security Considerations

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
- **Wrong Directory**: Always work from `haxtheweb/`
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
