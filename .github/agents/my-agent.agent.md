---
# Fill in the fields below to create a basic custom agent for your repository.
# The Copilot CLI can be used for local testing: https://gh.io/customagents/cli
# To make this agent available, merge this file into the default repository branch.
# For format details, see: https://gh.io/customagents/config

name: PRAW
description: HAX agent
---

# PRAW - HAX Ecosystem Warp Rules
These rules stem from https://github.com/haxtheweb/praw . Use it for full context as far as file references below.

**PRAW** (Warp spelled backwards) is a repository containing comprehensive Warp AI agent rules for the HAX ecosystem. These rules codify years of development experience, best practices, and conventions to help Warp users work more effectively with HAX projects.

## What is this?

This repository contains:
- **`RULES.md`** - Centralized registry of all HAX ecosystem rules with unique IDs and categorization
- **`KNOWLEDGE.md`** - Log of emergent knowledge, decisions, and conventions that inform rule development
- **`WORLDVIEW.md`** - Curated worldview synthesis from long-form ecosystem writing
- **`WARP.md`** files - Detailed context-specific rules for different project types
- **`programs/`** - Utility programs for LinkedIn posting and issue management automation
- **Rule Management System** - Scripts and tools for adding, searching, and managing rules
- **Cross-references** - Connections between rules and related documentation

These rules ensure consistency, quality, and proper integration across all HAX projects and web components.

## Quick Start - New to HAX?

**🚀 For complete newcomers**, we've created an automated onboarding script that sets up your entire HAX development environment with Warp optimization:

```bash
# Run the onboarding script from anywhere
curl -fsSL https://raw.githubusercontent.com/haxtheweb/praw/main/hax-onboarding.sh | bash

# Or if you've already cloned this repo:
cd ~/Documents/git/haxtheweb/praw
./hax-onboarding.sh
```

This script will:
- ✅ Clone all necessary HAX ecosystem repositories
- ✅ Install and configure the HAX CLI (@haxtheweb/create)
- ✅ Set up Warp with HAX-specific rules and optimizations
- ✅ Create helpful development aliases and shortcuts
- ✅ Generate curated Warp agent prompts for HAX development
- ✅ Configure your development environment following HAX best practices

**Recommended for**: First-time contributors, developers new to HAX, or anyone wanting a fresh, optimized setup.

---

## Manual Setup - Existing HAX Developers

If you already have a HAX development environment and just want to add these rules:

### For Individual Projects

1. **Copy the main WARP.md** to your HAX project root:
   ```bash
   cp WARP.md /path/to/your/hax-project/
   ```

2. **Use specialized rules** by copying relevant subdirectory WARP.md files:
   ```bash
   cp webcomponents/WARP.md /path/to/your/project/elements/
   cp haxcms/WARP.md /path/to/your/haxcms-site/
   ```

### For the Entire HAX Ecosystem

If you're working across multiple HAX repositories, you can:

1. **Clone this repo** to your local HAX development area:
   ```bash
   cd ~/Documents/git/haxtheweb/
   git clone https://github.com/haxtheweb/praw.git
   ```

2. **Symlink the main WARP.md** to your primary working directories:
   ```bash
   ln -s ~/Documents/git/haxtheweb/praw/WARP.md ~/Documents/git/haxtheweb/webcomponents/
   ```

3. **Let Warp automatically detect** the rules when working in HAX directories

## 🎓 Faculty Resource Management **NEW!**

**For non-technical faculty**: Create course resource repositories that AI agents use for grounded content generation.

### Quick Faculty Setup
```bash
# Set up a course resource folder
faculty-setup "Your Course Name"

# Add web resources
add-url-resource "Course Name" "https://example.com" "Description"

# Find course materials
find-course "Course Name"
```

### Faculty Workflow
1. **Setup**: Run one command to create course folder
2. **Add materials**: Drag-and-drop PDFs, docs, images
3. **Request content**: "Create a HAX site for [Course Name]"
4. **AI generates**: Grounded content using YOUR materials

**Benefits**: Zero technical knowledge required, natural language interface, authoritative content

📖 **[See complete faculty guide →](FACULTY_RESOURCES.md)**

## 🤖 Agent Automation Programs **NEW!**

**For agents helping users**: Pre-built automation tools for social media posting and project management.

### LinkedIn Posting Automation
```bash
cd programs/linkedin/

# First-time setup
node setup-linkedin.js

# Post custom content
node post-to-linkedin.js --custom "Great discussion about web components!"

# Automated issue summaries
./linkedin
```

### GitHub Issue Management
```bash
cd programs/issue-management/

# Fetch and cache all issues
./fetch_issues.sh

# Analyze project statistics
./query_issues.sh stats

# Weekly automation
./weekly-post.sh
```

**Benefits**: Streamlined social media presence, data-driven content, productivity tracking

📖 **[See complete programs guide →](programs/README.md)**

---

## Rule Categories

### 🏗️ Architecture & File Structure
- HAXcms site organization (`docs/`, `files/`, `pages/`)
- Web component registry system
- Reserved routing patterns

### 🎨 Design System Standards  
- DDD (primary design system) usage guidelines
- SimpleColors (legacy) integration
- Consistent styling approaches

### 🧩 Web Component Development
- HAX capability implementation
- Accessibility audit procedures
- JavaScript coding standards
- Educational content creation

### ⚙️ Build & Development Workflow
- Command usage patterns
- Version control integration
- Testing philosophy
- Tool configuration

### 📝 Content Creation Guidelines
- HAX site content authoring
- Documentation standards
- Quality assurance procedures

## Rule Management System

### Quick Setup

1. **Install the management system**:
   ```bash
   cd ~/Documents/git/haxtheweb/praw
   ./scripts/setup.sh
   ```

2. **Restart your terminal** or source your shell config:
   ```bash
   source ~/.zshrc  # or ~/.bashrc
   ```

### Usage Commands

```bash
# Add a new rule interactively
praw-add

# Add a rule via command line
praw-add webcomponent "New Component Rule" "Always include proper documentation"

# List all rules
praw-list

# List rules in a specific category
praw-list design-system

# Search for rules containing specific terms
praw-search "DDD"

# Show details for a specific rule ID
praw-show rHQ7lLRZmZlnFveLrWslUN

# Show rule statistics
praw-stats

# Validate RULES.md structure
praw-validate

# Export rules to different formats
praw-export json
praw-export csv

# Get help
praw-help
```

### Rule Categories

- **🏗️ Architecture** (`architecture`) - Site structure, routing, file organization
- **🎨 Design System** (`design-system`) - DDD, SimpleColors, theming guidelines  
- **🧩 Web Components** (`webcomponent`) - HAX capability, accessibility, JavaScript standards
- **⚙️ Build & Workflow** (`build-workflow`) - CLI usage, build commands, version control
- **📝 Documentation** (`documentation`) - Content creation, documentation structure
- **🗂️ Project-Specific** (`project-specific`) - Rules for specific projects or directories

## Contributing

This repository evolves with the HAX ecosystem. To contribute:

### Adding New Rules
1. **Use the management system**: `praw-add` for interactive rule creation
2. **Follow the categorization system** - choose appropriate category and provide context
3. **Test new rules** in your local development environment
4. **Validate structure**: `praw-validate` before committing
5. **Document knowledge**: Log decisions and rationale in `KNOWLEDGE.md`

### Updating Existing Rules
1. **Locate the rule** using `praw-search` or `praw-list`
2. **Edit RULES.md directly** or use the management system
3. **Maintain rule precedence** - ensure changes align with precedence hierarchy
4. **Update related WARP.md files** if necessary
5. **Record context**: Add insights about the change to `KNOWLEDGE.md`

## Rule Precedence

When using these rules, Warp follows this precedence order:
1. **Subdirectory WARP.md** (most specific)
2. **Root project WARP.md** 
3. **Global Warp rules** (least specific)

This ensures project-specific needs take priority while maintaining ecosystem consistency.

## Repository Structure

```
praw/
├── RULES.md                    # Central registry of all rules
├── KNOWLEDGE.md                # Log of emergent knowledge and decisions
├── WORLDVIEW.md                # Curated worldview profile and thematic priorities
├── WARP.md                     # Master HAX ecosystem rules
├── README.md                   # This file
├── FACULTY_RESOURCES.md        # Faculty resource management guide
├── scripts/                    # Management scripts
│   ├── setup.sh               # Setup the rule management system
│   ├── add-rule.sh            # Add new rules
│   ├── manage-rules.sh        # Search, list, and manage rules
│   ├── faculty-setup.sh       # Create course resource folders
│   ├── find-course-resources.sh # Locate course materials  
│   └── add-url-resource.sh    # Add web resources to courses
├── webcomponents/WARP.md      # Web component specific rules
├── haxcms/WARP.md             # HAXcms specific rules
├── design-system/WARP.md      # Design system specific rules
├── exports/                   # Rule exports (JSON, CSV, etc.)
└── backups/                   # Automatic backups
```

## Benefits

Using these rules provides:

- ✅ **Consistency** across HAX projects
- 🚀 **Faster development** with established patterns
- 🛡️ **Quality assurance** through automated validation
- 🎯 **Focused AI assistance** tailored to HAX conventions
- 📚 **Knowledge sharing** across the HAX community
- 🔍 **Searchable rules** with unique IDs and categorization
- 📊 **Rule analytics** and usage tracking

## Maintenance

These rules are actively maintained by the HAX core team and community contributors. They reflect current best practices and are updated as the ecosystem evolves.

---

**Made with ❤️ by the HAX Community**

*PRAW ensures that every Warp user working with HAX gets the benefit of collective ecosystem knowledge and established best practices.*
