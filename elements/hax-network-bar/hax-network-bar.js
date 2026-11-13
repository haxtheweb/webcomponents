/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  HaxUiAdminTokens,
  HaxUiDarkChromeDeclarations,
  HaxUiDialogTitlebarStyles,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js";
import {
  merlinTraveler,
  MerlinWandStyles,
} from "@haxtheweb/super-daemon/lib/super-daemon-hax-ui.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";

/** Where Install HAX lives: any network page opens it from #install. */
export const HAX_INSTALL_URL = "https://hax.cloud/#install";

/**
 * The sites in the HAX network, in the order the bar shows them. `id` is what
 * `current` names; `label` is a key into `this.t`.
 */
export const HAX_NETWORK_SITES = [
  { id: "cloud", label: "cloud", href: "https://hax.cloud" },
  {
    id: "elements",
    label: "elements",
    href: "https://webcomponents.hax.cloud",
  },
  { id: "browser", label: "browser", href: "https://browser.hax.cloud" },
  { id: "rpg", label: "rpg", href: "https://rpg-me.hax.cloud" },
  { id: "docs", label: "docs", href: "https://haxtheweb.org" },
];

/** Where the HAX community talks, shares and files issues. */
export const HAX_COMMUNITY_LINKS = [
  {
    id: "discord",
    label: "discord",
    href: "https://discord.gg/aCGxmRHEJP",
    icon: "hax:discord",
  },
  {
    id: "issues",
    label: "issues",
    href: "https://github.com/haxtheweb/issues",
    icon: "hax:admin-issues",
  },
  {
    id: "linkedin",
    label: "linkedin",
    href: "https://www.linkedin.com/company/haxtheweb/",
    icon: "mdi-social:linkedin",
  },
  {
    id: "x",
    label: "x",
    href: "https://x.com/haxtheweb",
    icon: "mdi-social:x",
  },
  {
    id: "github",
    label: "github",
    href: "https://github.com/haxtheweb",
    icon: "mdi-social:github-circle",
  },
];

/**
 * Every way to get HAX, in the order Install HAX lists them. Text is keys
 * into `this.t`; commands are not translated. `beta` marks a way that is
 * still settling.
 */
export const HAX_INSTALL_METHODS = [
  {
    id: "browser",
    icon: "hax:globe",
    title: "installBrowser",
    about: "installBrowserAbout",
    best: "installBrowserBest",
    steps: [
      { text: "installBrowserStep1" },
      { text: "installBrowserStep2" },
      { text: "installBrowserStep3" },
    ],
    links: [{ text: "installBrowserGo", href: "https://browser.hax.cloud" }],
  },
  {
    id: "cli",
    icon: "hax:console-line",
    title: "installCli",
    about: "installCliAbout",
    best: "installCliBest",
    steps: [
      {
        text: "installCliStep1",
        code: "npm install @haxtheweb/create --global",
      },
      { text: "installCliStep2", code: "hax site my-hax-site --y" },
      { text: "installCliStep3", code: "cd my-hax-site && hax serve" },
      { text: "installCliStep4", code: "hax start" },
    ],
    links: [
      {
        text: "installCliRepo",
        href: "https://github.com/haxtheweb/create",
      },
      {
        text: "installCliNpm",
        href: "https://www.npmjs.com/package/@haxtheweb/create",
      },
    ],
  },
  {
    id: "nodejs",
    icon: "icons:dns",
    title: "installNode",
    about: "installNodeAbout",
    best: "installNodeBest",
    steps: [
      { text: "installNodeStep1", code: "npx @haxtheweb/haxcms-nodejs" },
      { text: "installNodeStep2" },
      {
        text: "installNodeStep3",
        code: "docker run -p 3000:3000 -v haxcms-sites:/app/_sites -v haxcms-config:/home/node/.haxcmsconfig haxcms-nodejs",
      },
    ],
    links: [
      {
        text: "installNodeRepo",
        href: "https://github.com/haxtheweb/haxcms-nodejs",
      },
    ],
  },
  {
    id: "php",
    icon: "icons:cloud",
    title: "installPhp",
    about: "installPhpAbout",
    best: "installPhpBest",
    steps: [
      { text: "installPhpStep1" },
      {
        text: "installPhpStep2",
        code: "curl -fsSL https://raw.githubusercontent.com/haxtheweb/haxcms/master/scripts/haxcmsme.sh -o haxcmsme.sh && sh haxcmsme.sh",
      },
      { text: "installPhpStep3" },
    ],
    links: [
      {
        text: "installPhpRepo",
        href: "https://github.com/haxtheweb/haxcms-php",
      },
      { text: "installPhpReclaim", href: "https://reclaimhosting.com/" },
      {
        text: "installPhpGuide",
        href: "https://haxtheweb.org/installation",
      },
    ],
  },
  {
    id: "desktop",
    icon: "hax:computer",
    title: "installDesktop",
    about: "installDesktopAbout",
    best: "installDesktopBest",
    beta: true,
    steps: [
      {
        text: "installDesktopStep1",
        code: "git clone https://github.com/haxtheweb/desktop.git",
      },
      {
        text: "installDesktopStep2",
        code: "cd desktop && npm install && npm start",
      },
      { text: "installDesktopStep3" },
    ],
    links: [
      {
        text: "installDesktopRepo",
        href: "https://github.com/haxtheweb/desktop",
      },
    ],
  },
  {
    id: "agent",
    icon: "hax:future-traveler-plain",
    title: "installAgent",
    about: "installAgentAbout",
    best: "installAgentBest",
    steps: [
      { text: "installAgentStep1", prompt: true },
      {
        text: "installAgentStep2",
        code: "/plugin marketplace add haxtheweb/praw\n/plugin install hax-onboarding@haxtheweb",
      },
    ],
    links: [
      { text: "installAgentPraw", href: "https://github.com/haxtheweb/praw" },
    ],
  },
];

/**
 * Where Merlin can take you across the network: each site, plus the places
 * in it people look for most. `title` and `about` are keys into `this.t`.
 */
export const HAX_NETWORK_DESTINATIONS = [
  {
    title: "goCloud",
    about: "goCloudAbout",
    href: "https://hax.cloud",
    icon: "hax:future-traveler-plain",
  },
  {
    title: "goTours",
    about: "goToursAbout",
    href: "https://hax.cloud/tours",
    icon: "maps:directions-walk",
  },
  {
    title: "goElements",
    about: "goElementsAbout",
    href: "https://webcomponents.hax.cloud",
    icon: "hax:blocks",
  },
  {
    title: "goBrowser",
    about: "goBrowserAbout",
    href: "https://browser.hax.cloud",
    icon: "hax:globe",
  },
  {
    title: "goDemo",
    about: "goDemoAbout",
    href: "https://webcomponents.hax.cloud/elements/haxcms-elements/demo/index.html",
    icon: "hax:wand",
  },
  {
    title: "goRpg",
    about: "goRpgAbout",
    href: "https://rpg-me.hax.cloud",
    icon: "face",
  },
  {
    title: "goDocs",
    about: "goDocsAbout",
    href: "https://haxtheweb.org",
    icon: "hax:lesson",
  },
  {
    title: "goGithub",
    about: "goGithubAbout",
    href: "https://github.com/haxtheweb",
    icon: "mdi-social:github-circle",
  },
  {
    title: "goIssues",
    about: "goIssuesAbout",
    href: "https://github.com/haxtheweb/issues",
    icon: "hax:admin-issues",
  },
  {
    title: "goDiscord",
    about: "goDiscordAbout",
    href: "https://discord.gg/aCGxmRHEJP",
    icon: "hax:discord",
  },
  {
    title: "goLinkedin",
    about: "goLinkedinAbout",
    href: "https://www.linkedin.com/company/haxtheweb/",
    icon: "mdi-social:linkedin",
  },
  {
    title: "goX",
    about: "goXAbout",
    href: "https://x.com/haxtheweb",
    icon: "mdi-social:x",
  },
];

/**
 * `hax-network-bar`
 * The top bar of every hax.cloud site (hax.cloud, the element portfolio,
 * HAXcms in the browser, RPG me), drawn like the HAX editor's own top bar:
 * your character and the network's sites on the left, Merlin in the middle,
 * Install HAX, GitHub and the Future Traveler on the right. Each site keeps
 * its own header under it.
 *
 * Merlin loads the first time he is opened (from the field or Alt⇧), so a
 * page that never asks for him never downloads him. A page can add its own
 * places: listen for `hax-network-merlin` and call `detail.add(option)` with
 * `{title, href, about, icon, tags}` (hax.cloud adds every web and tour).
 *
 * Install HAX opens a dialog listing every way to get HAX on one screen; each
 * opens the steps for that way. Any page with the bar opens it from
 * `#install` (or `#install/<way>`: browser, cli, nodejs, php, desktop, agent).
 *
 * @demo demo/index.html
 * @element hax-network-bar
 * @slot pre - after the network's links, for the page's own links
 * @slot post - before the Future Traveler; holds the GitHub link unless the page fills it
 * @fires hax-network-merlin - {merlin, add(option)} the first time Merlin opens
 */
export class HaxNetworkBar extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "hax-network-bar";
  }

  constructor() {
    super();
    this.current = "";
    this.character = "";
    this.installOpen = false;
    this.installMethod = "";
    this.menuOpen = false;
    this.demo = false;
    this._copied = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      network: "HAX network",
      cloud: "hax.cloud",
      elements: "Elements",
      browser: "Browser",
      rpg: "RPG me",
      docs: "Docs",
      github: "GitHub",
      discord: "Discord",
      issues: "Issues",
      linkedin: "LinkedIn",
      x: "X",
      demoLabel: "About this demo",
      demoTag: "Demo",
      demoNotice: "There's no backend here, so nothing you change is saved.",
      demoNoticeShort: "Nothing is saved.",
      demoBrowser: "Use HAXcms in your browser",
      demoBrowserShort: "Browser version",
      githubLink: "HAX on GitHub",
      sitesMenu: "HAX network sites",
      character: "Your character: make it in RPG me",
      merlin: "Merlin",
      merlinHint: "Jump anywhere",
      merlinWhere: " in the HAX network",
      networkPath: "HAX network",
      installPath: "Install HAX",
      install: "Install HAX",
      installShort: "Install",
      installTitle: "Install HAX",
      installIntro:
        "Every way to get HAX. Pick the one that fits how you work; you can move between them later, the sites are the same.",
      installBack: "All the ways to install HAX",
      installClose: "Close",
      installBeta: "Beta",
      installBestFor: "Best for",
      installSteps: "Steps",
      installMore: "More",
      installCopy: "Copy",
      installCopied: "Copied",
      installCommunity: "Questions? Ask in Discord or file an issue.",
      installBrowser: "In your browser",
      installBrowserAbout:
        "HAXcms running in this browser tab. Nothing to install.",
      installBrowserBest: "Trying HAX right now",
      installBrowserStep1: "Open browser.hax.cloud.",
      installBrowserStep2:
        "Pick a folder on your computer when it asks; your sites and uploads are saved there, never on our servers.",
      installBrowserStep3:
        "Make a site and edit it like any HAXcms site. When you outgrow the tab, open the same folder with any other way here.",
      installBrowserGo: "Open HAXcms in your browser",
      installCli: "HAX CLI",
      installCliAbout:
        "One command line for making, serving and publishing sites.",
      installCliBest: "Developers, scripts and publishing",
      installCliStep1: "Install the hax command (needs Node.js):",
      installCliStep2: "Make a site:",
      installCliStep3: "Start it, then open the address it prints:",
      installCliStep4: "Or explore everything it can do, step by step:",
      installCliRepo: "haxtheweb/create on GitHub",
      installCliNpm: "@haxtheweb/create on npm",
      installNode: "Node.js",
      installNodeAbout:
        "The HAXcms server on Node.js, for one person or a team.",
      installNodeBest: "Your own machine or a Node server",
      installNodeStep1:
        "Run HAXcms on your computer, signed in as you (needs Node.js):",
      installNodeStep2:
        "Open the address it prints (http://localhost:3000 by default). Sites are kept in a _sites folder.",
      installNodeStep3:
        "Or run it in a container. Set HAXCMS_RUNTIME_USERNAME and HAXCMS_RUNTIME_PASSWORD to choose the admin login:",
      installNodeRepo: "haxtheweb/haxcms-nodejs on GitHub",
      installPhp: "PHP",
      installPhpAbout:
        "HAXcms on PHP and Apache, the way most web hosts run it.",
      installPhpBest: "Web hosting and campus servers",
      installPhpStep1:
        "Needs PHP 8.3+ with curl, zip, gd and xml, and Apache 2.4. Reclaim Hosting installs it in one click.",
      installPhpStep2: "Or install it on your own server:",
      installPhpStep3:
        "Open the site in a browser and sign in with the password the installer gives you.",
      installPhpRepo: "haxtheweb/haxcms-php on GitHub",
      installPhpReclaim: "Reclaim Hosting, one-click install",
      installPhpGuide: "Every install guide on haxtheweb.org",
      installDesktop: "Desktop app",
      installDesktopAbout:
        "HAXcms as an app on your computer, no server to run.",
      installDesktopBest: "Working offline on your own computer",
      installDesktopStep1: "Get the app's code (needs Node.js and git):",
      installDesktopStep2: "Install and start it:",
      installDesktopStep3:
        "Your sites are kept in a _sites folder in your home folder.",
      installDesktopRepo: "haxtheweb/desktop on GitHub",
      installAgent: "Ask your agent",
      installAgentAbout:
        "Paste one prompt into Claude, Codex or any coding agent.",
      installAgentBest: "Letting AI set it up for you",
      installAgentStep1:
        "Give your agent this prompt. It installs the HAX CLI and its skills, makes a site and starts it:",
      installAgentStep2: "In Claude Code you can add the HAX plugins instead:",
      installAgentPraw: "PRAW: what agents read about HAX",
      installAgentPrompt:
        "Set up HAX (https://haxtheweb.org) on this computer. Install the HAX CLI with `npm install @haxtheweb/create --global`, then install its agent skills with `hax skills install --all`. Make a site with `hax site my-hax-site --y --no-i`, start it with `cd my-hax-site && hax serve`, and tell me the address it prints. Read the site's AGENTS.md and https://github.com/haxtheweb/praw before you change anything.",
      goCloud: "hax.cloud: the HAX ecosystem web",
      goCloudAbout:
        "Every part of HAX and everyone who builds it, in one interactive web.",
      goTours: "Tours of the ecosystem",
      goToursAbout:
        "Step-by-step walks through the web for faculty, students, developers and more.",
      goElements: "Elements: every HAX web component",
      goElementsAbout: "Browse, search and try the elements HAX authors with.",
      goBrowser: "Browser: HAXcms in your browser",
      goBrowserAbout:
        "Make and edit HAX sites in a browser tab, saved to a folder you pick.",
      goDemo: "Live demo: try the HAX editor",
      goDemoAbout: "Edit a HAX site in your browser, nothing to install.",
      goRpg: "RPG me: make your character",
      goRpgAbout: "Design the character that stands for you across HAX.",
      goDocs: "Docs: learn HAX",
      goDocsAbout: "Guides, tutorials and the documentation for HAX.",
      goGithub: "GitHub: the code",
      goGithubAbout: "Every HAX repository, issue and pull request.",
      goIssues: "Issues: report a bug or ask for a feature",
      goIssuesAbout: "One issue queue for every part of HAX.",
      goDiscord: "Discord: talk with the HAX community",
      goDiscordAbout: "Ask questions and show what you made.",
      goLinkedin: "LinkedIn: HAX The Web",
      goLinkedinAbout: "News and updates from the HAX team.",
      goX: "X: @haxtheweb",
      goXAbout: "News and updates from the HAX team.",
      installAll: "Install HAX: every way to get it",
      installAllAbout:
        "The browser, the HAX CLI, Node.js, PHP, the desktop app or a prompt for your agent.",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
    this._onHash = this._onHash.bind(this);
    this._onKey = this._onKey.bind(this);
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Which site this is: cloud, elements, browser, rpg or docs.
       */
      current: { type: String, reflect: true },
      /**
       * The character in the left corner, as an rpg-character code
       * (RPG me makes one). Empty draws HAX's own.
       */
      character: { type: String },
      /** Install HAX is open */
      installOpen: { type: Boolean, attribute: "install-open", reflect: true },
      /** The way to install whose steps are showing; empty lists them all */
      installMethod: { type: String, attribute: "install-method" },
      /** The sites menu is open (narrow screens) */
      menuOpen: { type: Boolean, attribute: "menu-open", reflect: true },
      /**
       * The demo strip: a thin bar for a HAXcms demo with no backend
       * (demo.hax.cloud). It says nothing is saved, links HAXcms in the
       * browser and Install HAX, and has no Merlin of its own (the editor
       * under it has him). It keeps --haxcms-top-offset on the page set to
       * its height so the HAXcms editor bar sits under it.
       */
      demo: { type: Boolean, reflect: true },
      _copied: { type: String, state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminTokens,
      HaxUiDialogTitlebarStyles,
      MerlinWandStyles,
      css`
        /* HAX UI dark chrome in every scheme: the same bar the HAX editor
           draws, so the network reads as one place */
        :host {
          ${HaxUiDarkChromeDeclarations}
          --hax-network-bar-height: 64px;
          display: block;
          position: relative;
          z-index: 2;
          background-color: var(--ddd-theme-default-coalyGray);
          border-bottom: 1px solid var(--hax-ui-line);
          color: var(--hax-ui-on-titlebar);
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
        }
        .bar {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          align-items: center;
          gap: 0 var(--ddd-spacing-4);
          max-width: var(--hax-network-bar-max-width, none);
          height: var(--hax-network-bar-height);
          margin: 0 auto;
          padding: 0 var(--hax-network-bar-gutter, var(--ddd-spacing-3));
          box-sizing: border-box;
        }
        .start,
        .end {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          min-width: 0;
          height: 100%;
        }
        .end {
          justify-content: flex-end;
        }
        .divider {
          flex: none;
          width: 1px;
          height: var(--ddd-spacing-6);
          background-color: var(--hax-ui-line);
        }
        a {
          color: inherit;
        }
        a:focus-visible,
        button:focus-visible {
          outline: var(--hax-ui-focus-width) solid
            var(--ddd-theme-default-keystoneYellow);
          outline-offset: 2px;
        }
        /* your character, in the same dark well as the editor's user menu */
        .character {
          flex: none;
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          overflow: hidden;
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--ddd-radius-sm);
          background-color: #111;
          transition: background-color var(--hax-ui-duration)
            var(--hax-ui-easing);
        }
        .character:hover {
          background-color: #222;
        }
        .character rpg-character {
          display: block;
          width: 40px;
          height: 46px;
          margin-top: 4px;
          pointer-events: none;
        }
        /* DDD lays lists out as columns; the sites run in a row */
        nav.sites ul,
        .ways,
        .install-foot .social,
        .detail-links,
        ol.steps {
          margin: 0;
          padding: 0;
        }
        nav.sites li,
        .ways li,
        .install-foot .social li,
        .detail-links li {
          margin: 0;
          padding: 0;
        }
        nav.sites ul {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0 var(--ddd-spacing-4);
          list-style: none;
          white-space: nowrap;
        }
        nav.sites ul,
        nav.sites li,
        nav.sites a {
          font-size: var(--hax-ui-admin-font-size);
          line-height: 1.5;
        }
        nav.sites a {
          display: inline-block;
          padding: var(--ddd-spacing-2) 0;
          border-bottom: var(--ddd-border-size-md) solid transparent;
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-regular);
          text-decoration: none;
        }
        nav.sites a:hover {
          border-bottom-color: var(--ddd-theme-default-pughBlue);
        }
        nav.sites a[aria-current="page"] {
          font-weight: var(--ddd-font-weight-bold);
          border-bottom-color: var(--ddd-theme-default-keystoneYellow);
        }
        ::slotted([slot="pre"]) {
          white-space: nowrap;
        }
        .icon-btn {
          flex: none;
          display: inline-grid;
          place-items: center;
          width: 40px;
          height: 40px;
          padding: 0;
          border: none;
          border-radius: var(--hax-ui-radius);
          background: transparent;
          color: inherit;
          cursor: pointer;
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
        }
        .icon-btn:hover {
          background-color: var(--hax-ui-hover);
        }
        .menu-btn {
          display: none;
        }
        /* Merlin: the editor's field, in a darker well than the bar, with
           the Future Traveler at its start and the shortcut chip at its end */
        .merlin {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          box-sizing: border-box;
          width: var(--hax-network-bar-merlin-width, clamp(280px, 28vw, 448px));
          max-width: 100%;
          height: var(--hax-ui-field-height);
          padding: 0 var(--hax-ui-gap-md) 0 var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          background-color: #111;
          color: var(--hax-ui-on-titlebar);
          font: inherit;
          text-align: start;
          cursor: text;
          --merlin-traveler-size: 24px;
        }
        .merlin:hover {
          border-color: var(--hax-ui-text-muted);
        }
        .merlin .hint {
          flex: 1 1 auto;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-style: italic;
          color: var(--hax-ui-text-muted);
        }
        .chip {
          flex: none;
          display: inline-grid;
          place-items: center;
          height: 20px;
          padding: 0 6px;
          font-family: inherit;
          font-size: 11px;
          font-weight: var(--ddd-font-weight-bold);
          line-height: 1;
          white-space: nowrap;
          border-radius: var(--hax-ui-radius);
          border: 1px solid var(--hax-ui-line-strong);
          color: var(--hax-ui-text-muted);
          background-color: var(--ddd-theme-default-coalyGray);
        }
        .install-btn {
          flex: none;
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          height: 40px;
          padding: 0 var(--ddd-spacing-4);
          border: var(--ddd-border-size-sm) solid
            var(--ddd-theme-default-keystoneYellow);
          border-radius: var(--ddd-radius-rounded);
          background-color: var(--ddd-theme-default-keystoneYellow);
          color: var(--ddd-theme-default-coalyGray);
          font: inherit;
          font-weight: var(--ddd-font-weight-bold);
          white-space: nowrap;
          cursor: pointer;
          --simple-icon-width: 20px;
          --simple-icon-height: 20px;
        }
        .install-btn:hover {
          background-color: var(--ddd-theme-default-roarGolden);
          border-color: var(--ddd-theme-default-roarGolden);
        }
        .install-btn .short {
          display: none;
        }
        .github {
          display: inline-grid;
          place-items: center;
          width: 40px;
          height: 40px;
          border-radius: var(--hax-ui-radius);
          --simple-icon-width: 28px;
          --simple-icon-height: 28px;
        }
        .github:hover {
          background-color: var(--hax-ui-hover);
        }
        /* the Future Traveler: decorative, top right as in every HAX UI */
        .traveler {
          flex: none;
          display: inline-grid;
          place-items: center;
          width: 40px;
          height: 40px;
          --simple-icon-width: 36px;
          --simple-icon-height: 36px;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }

        /* narrower screens: the sites fold into a menu under the bar */
        @media (max-width: 1279px) {
          nav.sites,
          slot[name="pre"] {
            display: none;
          }
          .menu-btn {
            display: inline-grid;
          }
          :host([menu-open]) nav.sites {
            display: block;
            position: absolute;
            inset: var(--hax-network-bar-height) 0 auto 0;
            padding: var(--ddd-spacing-2) var(--ddd-spacing-4)
              var(--ddd-spacing-4);
            background-color: var(--ddd-theme-default-coalyGray);
            border-bottom: 1px solid var(--hax-ui-line);
          }
          :host([menu-open]) nav.sites ul {
            flex-direction: column;
            align-items: stretch;
          }
          :host([menu-open]) nav.sites a {
            display: block;
            padding: var(--ddd-spacing-3) 0;
          }
          .merlin {
            width: var(--hax-network-bar-merlin-width-narrow, 280px);
          }
        }
        /* phones: no keyboard expected, so no shortcut chip (the same media
           as KEYBOARD_SHORTCUTS_HIDDEN_MEDIA in @haxtheweb/utils), and the
           buttons go to their icons */
        @media (max-width: 599px), (pointer: coarse) and (max-height: 599px) {
          .chip {
            display: none;
          }
        }
        @media (max-width: 599px) {
          .bar {
            gap: 0 var(--ddd-spacing-2);
            padding: 0 var(--ddd-spacing-2);
          }
          .start,
          .end {
            gap: var(--ddd-spacing-1);
          }
          .divider,
          .github,
          slot[name="post"] {
            display: none;
          }
          .merlin {
            width: 40px;
            padding: 0;
            justify-content: center;
          }
          .merlin .hint {
            display: none;
          }
          .install-btn {
            padding: 0 var(--ddd-spacing-3);
          }
          .install-btn .long {
            display: none;
          }
          .install-btn .short {
            display: inline;
          }
        }

        /* ---------- Install HAX ---------- */
        dialog {
          box-sizing: border-box;
          width: min(1040px, calc(100vw - var(--ddd-spacing-8)));
          max-height: calc(100dvh - var(--ddd-spacing-8));
          padding: 0;
          border: none;
          border-radius: var(--ddd-radius-sm);
          background-color: var(--hax-ui-surface);
          color: var(--hax-ui-text);
          box-shadow: var(--ddd-boxShadow-xl);
          overflow: hidden;
        }
        dialog[open] {
          display: flex;
          flex-direction: column;
        }
        dialog::backdrop {
          background-color: rgb(0 3 33 / 0.6);
        }
        .hax-ui-dialog-titlebar {
          flex: none;
          gap: var(--ddd-spacing-2);
        }
        .hax-ui-dialog-title {
          flex: 1 1 auto;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          margin: 0;
          --merlin-traveler-size: 22px;
        }
        .hax-ui-dialog-close {
          --simple-icon-width: 20px;
          --simple-icon-height: 20px;
        }
        .install-body {
          overflow: auto;
          padding: var(--ddd-spacing-5) var(--ddd-spacing-6)
            var(--ddd-spacing-6);
        }
        .install-intro {
          margin: 0 0 var(--ddd-spacing-4);
          max-width: 72ch;
          font-size: var(--ddd-font-size-4xs);
          line-height: 1.5;
          color: var(--hax-ui-text-muted);
        }
        .ways {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: var(--ddd-spacing-3);
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .way {
          box-sizing: border-box;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          grid-template-rows: auto 1fr auto;
          gap: var(--ddd-spacing-1) var(--ddd-spacing-3);
          width: 100%;
          height: 100%;
          padding: var(--ddd-spacing-4);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--ddd-radius-sm);
          background-color: transparent;
          color: inherit;
          font: inherit;
          text-align: start;
          cursor: pointer;
          transition:
            border-color var(--hax-ui-duration) var(--hax-ui-easing),
            background-color var(--hax-ui-duration) var(--hax-ui-easing);
        }
        .way:hover {
          border-color: var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-accent-soft);
        }
        .way:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-accent-strong);
          outline-offset: 2px;
        }
        .way-icon {
          grid-row: 1 / 4;
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border-radius: var(--ddd-radius-sm);
          background-color: var(--hax-ui-accent-soft);
          color: var(--hax-ui-accent-strong);
          --simple-icon-width: 28px;
          --simple-icon-height: 28px;
          --merlin-traveler-size: 30px;
        }
        .way-title {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-3xs);
          font-weight: var(--ddd-font-weight-bold);
        }
        .way-about {
          font-size: var(--ddd-font-size-4xs);
          line-height: 1.45;
          color: var(--hax-ui-text-muted);
        }
        .way-best {
          margin-top: var(--ddd-spacing-2);
          font-size: 12px;
          font-weight: var(--ddd-font-weight-bold);
          color: var(--hax-ui-accent-strong);
        }
        .beta {
          display: inline-block;
          padding: 2px 6px;
          border-radius: var(--hax-ui-radius);
          border: 1px dashed currentColor;
          font-size: 11px;
          font-weight: var(--ddd-font-weight-bold);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--hax-ui-text-muted);
        }
        .install-foot {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-2) var(--ddd-spacing-4);
          margin-top: var(--ddd-spacing-5);
          padding-top: var(--ddd-spacing-4);
          border-top: 1px solid var(--hax-ui-line);
          font-size: var(--ddd-font-size-4xs);
          color: var(--hax-ui-text-muted);
        }
        .install-foot .social {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-1);
          margin: 0 0 0 auto;
          padding: 0;
          list-style: none;
        }
        .install-foot .social a,
        .install-foot span,
        .detail-links a {
          font-size: var(--hax-ui-admin-font-size);
        }
        .install-foot .social a {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          border-radius: var(--hax-ui-radius);
          color: var(--hax-ui-text);
          text-decoration: none;
          --simple-icon-width: 18px;
          --simple-icon-height: 18px;
        }
        .install-foot .social a:hover {
          background-color: var(--hax-ui-hover);
        }
        .install-foot a:focus-visible,
        .detail a:focus-visible,
        .copy:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-accent-strong);
          outline-offset: 2px;
        }
        /* one way's steps */
        .detail-head {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 0 var(--ddd-spacing-4);
          align-items: center;
          margin-bottom: var(--ddd-spacing-4);
        }
        .detail-head h3 {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          margin: 0;
          font-size: var(--ddd-font-size-xs);
        }
        .detail-head h3:focus {
          outline: none;
        }
        .detail-head p {
          margin: var(--ddd-spacing-1) 0 0;
          color: var(--hax-ui-text-muted);
          font-size: var(--ddd-font-size-4xs);
        }
        ol.steps {
          display: grid;
          gap: var(--ddd-spacing-4);
          margin: 0;
          padding: 0;
          list-style: none;
          counter-reset: step;
        }
        ol.steps > li {
          display: grid;
          grid-template-columns: 28px minmax(0, 1fr);
          gap: var(--ddd-spacing-1) var(--ddd-spacing-3);
          counter-increment: step;
          font-size: var(--ddd-font-size-4xs);
          line-height: 1.5;
        }
        ol.steps > li::before {
          content: counter(step);
          grid-row: 1 / 3;
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: var(--hax-ui-accent-strong);
          color: var(--hax-ui-on-accent);
          font-weight: var(--ddd-font-weight-bold);
          font-size: 13px;
        }
        .code {
          display: flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-2);
          margin-top: var(--ddd-spacing-1);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-2)
            var(--ddd-spacing-2) var(--ddd-spacing-3);
          border-radius: var(--hax-ui-radius);
          background-color: #111;
          color: var(--ddd-theme-default-white);
        }
        .code pre {
          flex: 1 1 auto;
          min-width: 0;
          margin: 0;
          padding: var(--ddd-spacing-1) 0;
          border: none;
          background: transparent;
          color: inherit;
          overflow-x: auto;
          font-family: var(--ddd-font-mono, monospace);
          font-size: 13px;
          line-height: 1.5;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }
        .copy {
          flex: none;
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          height: 30px;
          padding: 0 var(--ddd-spacing-2);
          border: 1px solid
            color-mix(in srgb, var(--ddd-theme-default-white) 40%, transparent);
          border-radius: var(--hax-ui-radius);
          background-color: transparent;
          color: var(--ddd-theme-default-white);
          font: inherit;
          font-size: 12px;
          font-weight: var(--ddd-font-weight-bold);
          cursor: pointer;
          --simple-icon-width: 16px;
          --simple-icon-height: 16px;
        }
        .copy:hover {
          background-color: color-mix(
            in srgb,
            var(--ddd-theme-default-white) 12%,
            transparent
          );
        }
        .copy[data-copied] {
          border-color: var(--ddd-theme-default-opportunityGreen);
        }
        .detail-links {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2);
          margin: var(--ddd-spacing-5) 0 0;
          padding: 0;
          list-style: none;
        }
        .detail-links a {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--ddd-radius-rounded);
          color: var(--hax-ui-accent-strong);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          text-decoration: none;
          --simple-icon-width: 16px;
          --simple-icon-height: 16px;
        }
        .detail-links a:hover {
          background-color: var(--hax-ui-accent-soft);
        }
        .detail-links li:first-child a {
          background-color: var(--hax-ui-accent-strong);
          border-color: var(--hax-ui-accent-strong);
          color: var(--hax-ui-on-accent);
        }
        @media (max-width: 900px) {
          .ways {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 599px) {
          dialog {
            width: 100vw;
            max-width: 100vw;
            max-height: 100dvh;
            height: 100dvh;
            border-radius: 0;
          }
          .install-body {
            padding: var(--ddd-spacing-4);
          }
          .ways {
            grid-template-columns: minmax(0, 1fr);
            gap: var(--ddd-spacing-2);
          }
          .way {
            padding: var(--ddd-spacing-3);
          }
          .way-best {
            display: none;
          }
          .install-foot .social {
            margin-left: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .way,
          .character {
            transition: none;
          }
        }
        @media (forced-colors: active) {
          .merlin,
          .way,
          .character {
            border-color: ButtonText;
          }
        }

        /* ---------- demo strip ---------- */
        :host([demo]) {
          --hax-network-bar-height: 40px;
          height: var(--hax-network-bar-height);
          border-bottom: none;
          background-color: transparent;
        }
        /* fixed over the page, with the host holding its room in the flow,
           so it stays put as the page scrolls (as the editor bar does) */
        :host([demo]) .strip {
          position: fixed;
          inset: 0 0 auto 0;
          z-index: 10001;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-4);
          box-sizing: border-box;
          height: var(--hax-network-bar-height);
          padding: 0 var(--ddd-spacing-3);
          background-color: var(--ddd-theme-default-potentialMidnight);
          border-bottom: 1px solid var(--hax-ui-line);
          color: var(--hax-ui-on-titlebar);
        }
        .strip nav.sites a {
          padding: var(--ddd-spacing-1) 0;
        }
        .strip .notice {
          flex: 1 1 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-2);
          min-width: 0;
          margin: 0;
          font-size: var(--hax-ui-admin-font-size);
          white-space: nowrap;
          overflow: hidden;
        }
        .strip .tag {
          flex: none;
          padding: 2px var(--ddd-spacing-2);
          border-radius: var(--hax-ui-radius);
          background-color: var(--ddd-theme-default-keystoneYellow);
          color: var(--ddd-theme-default-coalyGray);
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-bold);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .strip .notice .text {
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .strip .short {
          display: none;
        }
        .strip .browser {
          flex: none;
          color: var(--ddd-theme-default-white);
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-bold);
          white-space: nowrap;
        }
        .strip .install-btn {
          height: 28px;
          padding: 0 var(--ddd-spacing-3);
          font-size: var(--hax-ui-admin-font-size);
          --simple-icon-width: 16px;
          --simple-icon-height: 16px;
        }
        .strip .icon-btn {
          width: 32px;
          height: 32px;
          --simple-icon-width: 20px;
          --simple-icon-height: 20px;
        }
        :host([demo][menu-open]) .strip nav.sites {
          position: fixed;
          inset: var(--hax-network-bar-height) 0 auto 0;
        }
        @media (max-width: 1279px) {
          .strip .long {
            display: none;
          }
          .strip .short {
            display: inline;
          }
        }
        @media (max-width: 599px) {
          .strip {
            gap: var(--ddd-spacing-2);
          }
          .strip .notice {
            justify-content: flex-start;
          }
          .strip .browser {
            display: none;
          }
        }
      `,
    ];
  }

  render() {
    if (this.demo) {
      return this._renderDemo();
    }
    return html`
      <div class="bar">
        <div class="start">
          <a
            class="character"
            href="${this._characterHref()}"
            title="${this.t.character}"
            aria-label="${this.t.character}"
          >
            <rpg-character
              height="46"
              width="40"
              seed="${this.character ? "" : "HAX"}"
              code="${this.character || ""}"
            ></rpg-character>
          </a>
          <button
            class="icon-btn menu-btn"
            type="button"
            aria-expanded="${this.menuOpen ? "true" : "false"}"
            aria-controls="sites"
            title="${this.t.sitesMenu}"
            @click="${this.toggleMenu}"
          >
            <simple-icon-lite
              icon="${this.menuOpen ? "icons:close" : "icons:menu"}"
            ></simple-icon-lite>
            <span class="sr-only">${this.t.sitesMenu}</span>
          </button>
          <span class="divider" aria-hidden="true"></span>
          <nav class="sites" id="sites" aria-label="${this.t.network}">
            <ul>
              ${HAX_NETWORK_SITES.map(
                (s) =>
                  html`<li>
                    <a
                      href="${s.href}"
                      aria-current="${s.id === this.current ? "page" : "false"}"
                      >${this.t[s.label]}</a
                    >
                  </li>`,
              )}
            </ul>
          </nav>
          <slot name="pre"></slot>
        </div>
        <button
          class="merlin merlin-wand-host"
          type="button"
          aria-haspopup="dialog"
          title="${this.t.merlin}"
          @click="${this.openMerlin}"
        >
          ${merlinTraveler()}
          <span class="hint">${this.t.merlinHint}</span>
          <span class="sr-only">${this.t.merlin}${this.t.merlinWhere}</span>
          ${
            this._shortcutLabel()
              ? html`<kbd class="chip" aria-hidden="true"
                  >${this._shortcutLabel()}</kbd
                >`
              : ``
          }
        </button>
        <div class="end">
          <button
            class="install-btn"
            type="button"
            aria-haspopup="dialog"
            @click="${() => this.openInstall()}"
          >
            <simple-icon-lite icon="hax:admin-download"></simple-icon-lite>
            <span class="long">${this.t.install}</span
            ><span class="short">${this.t.installShort}</span>
          </button>
          <slot name="post">
            <a
              class="github"
              href="https://github.com/haxtheweb"
              title="${this.t.githubLink}"
            >
              <simple-icon-lite
                icon="mdi-social:github-circle"
              ></simple-icon-lite>
              <span class="sr-only">${this.t.githubLink}</span>
            </a>
          </slot>
          <span class="traveler" aria-hidden="true">
            <simple-icon-lite
              icon="hax:future-traveler"
              no-colorize
            ></simple-icon-lite>
          </span>
        </div>
      </div>
      ${this._renderInstall()}
    `;
  }

  _renderInstall() {
    const way = HAX_INSTALL_METHODS.find((m) => m.id === this.installMethod);
    return html`
      <dialog
        aria-labelledby="install-title"
        @close="${this._dialogClosed}"
        @click="${this._dialogClick}"
      >
        <div class="hax-ui-dialog-titlebar">
          ${
            way
              ? html`<button
                  class="hax-ui-dialog-close back"
                  type="button"
                  title="${this.t.installBack}"
                  @click="${() => this.showInstallMethod("")}"
                >
                  <simple-icon-lite icon="icons:arrow-back"></simple-icon-lite>
                  <span class="sr-only">${this.t.installBack}</span>
                </button>`
              : ``
          }
          <h2 class="hax-ui-dialog-title" id="install-title">
            ${this.t.installTitle}
          </h2>
          <button
            class="hax-ui-dialog-close"
            type="button"
            title="${this.t.installClose}"
            @click="${this.closeInstall}"
          >
            <simple-icon-lite icon="hax:admin-close"></simple-icon-lite>
            <span class="sr-only">${this.t.installClose}</span>
          </button>
        </div>
        <div class="install-body">
          ${way ? this._renderWay(way) : this._renderWays()}
          <div class="install-foot">
            <span>${this.t.installCommunity}</span>
            <ul class="social">
              ${HAX_COMMUNITY_LINKS.map(
                (l) =>
                  html`<li>
                    <a href="${l.href}" target="_blank" rel="noopener">
                      <simple-icon-lite icon="${l.icon}"></simple-icon-lite
                      >${this.t[l.label]}
                    </a>
                  </li>`,
              )}
            </ul>
          </div>
        </div>
      </dialog>
    `;
  }

  _wayIcon(m) {
    return m.icon === "hax:future-traveler-plain"
      ? merlinTraveler()
      : html`<simple-icon-lite icon="${m.icon}"></simple-icon-lite>`;
  }

  _renderWays() {
    return html`
      <p class="install-intro">${this.t.installIntro}</p>
      <ul class="ways">
        ${HAX_INSTALL_METHODS.map(
          (m) =>
            html`<li>
              <button
                class="way"
                type="button"
                data-way="${m.id}"
                @click="${() => this.showInstallMethod(m.id)}"
              >
                <span class="way-icon" aria-hidden="true"
                  >${this._wayIcon(m)}</span
                >
                <span class="way-title"
                  >${this.t[m.title]}
                  ${
                    m.beta
                      ? html`<span class="beta">${this.t.installBeta}</span>`
                      : ``
                  }</span
                >
                <span class="way-about">${this.t[m.about]}</span>
                <span class="way-best"
                  >${this.t.installBestFor}: ${this.t[m.best]}</span
                >
              </button>
            </li>`,
        )}
      </ul>
    `;
  }

  _renderWay(m) {
    return html`
      <div class="detail" data-way="${m.id}">
        <div class="detail-head">
          <span class="way-icon" aria-hidden="true">${this._wayIcon(m)}</span>
          <div>
            <h3 tabindex="-1">
              ${this.t[m.title]}
              ${
                m.beta
                  ? html`<span class="beta">${this.t.installBeta}</span>`
                  : ``
              }
            </h3>
            <p>
              ${this.t[m.about]} ${this.t.installBestFor}: ${this.t[m.best]}.
            </p>
          </div>
        </div>
        <ol class="steps" aria-label="${this.t.installSteps}">
          ${m.steps.map((s, i) => {
            const code = s.prompt ? this.t.installAgentPrompt : s.code;
            const key = `${m.id}-${i}`;
            return html`<li>
              <span>${this.t[s.text]}</span>
              ${
                code
                  ? html`<div class="code">
                      <pre>${code}</pre>
                      <button
                        class="copy"
                        type="button"
                        ?data-copied="${this._copied === key}"
                        @click="${() => this.copy(code, key)}"
                      >
                        <simple-icon-lite
                          icon="${
                            this._copied === key
                              ? "icons:check"
                              : "hax:admin-copy"
                          }"
                        ></simple-icon-lite>
                        <span aria-live="polite"
                          >${
                            this._copied === key
                              ? this.t.installCopied
                              : this.t.installCopy
                          }</span
                        >
                      </button>
                    </div>`
                  : ``
              }
            </li>`;
          })}
        </ol>
        <ul class="detail-links" aria-label="${this.t.installMore}">
          ${m.links.map(
            (l) =>
              html`<li>
                <a href="${l.href}" target="_blank" rel="noopener"
                  >${this.t[l.text]}
                  <simple-icon-lite icon="hax:admin-external"></simple-icon-lite
                ></a>
              </li>`,
          )}
        </ul>
      </div>
    `;
  }

  /** The demo strip: sites, a notice that nothing is saved, the browser version and Install HAX */
  _renderDemo() {
    return html`
      <div class="strip" role="region" aria-label="${this.t.demoLabel}">
        <button
          class="icon-btn menu-btn"
          type="button"
          aria-expanded="${this.menuOpen ? "true" : "false"}"
          aria-controls="sites"
          title="${this.t.sitesMenu}"
          @click="${this.toggleMenu}"
        >
          <simple-icon-lite
            icon="${this.menuOpen ? "icons:close" : "icons:menu"}"
          ></simple-icon-lite>
          <span class="sr-only">${this.t.sitesMenu}</span>
        </button>
        <nav class="sites" id="sites" aria-label="${this.t.network}">
          <ul>
            ${HAX_NETWORK_SITES.map(
              (s) =>
                html`<li>
                  <a
                    href="${s.href}"
                    aria-current="${s.id === this.current ? "page" : "false"}"
                    >${this.t[s.label]}</a
                  >
                </li>`,
            )}
          </ul>
        </nav>
        <p class="notice">
          <span class="tag">${this.t.demoTag}</span>
          <span class="text"
            ><span class="long">${this.t.demoNotice}</span
            ><span class="short">${this.t.demoNoticeShort}</span></span
          >
        </p>
        <a class="browser" href="https://browser.hax.cloud"
          ><span class="long">${this.t.demoBrowser}</span
          ><span class="short">${this.t.demoBrowserShort}</span></a
        >
        <button
          class="install-btn"
          type="button"
          aria-haspopup="dialog"
          @click="${() => this.openInstall()}"
        >
          <simple-icon-lite icon="hax:admin-download"></simple-icon-lite>
          <span>${this.t.install}</span>
        </button>
      </div>
      ${this._renderInstall()}
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener("hashchange", this._onHash);
    globalThis.document.addEventListener("keydown", this._onKey);
    this._syncTopOffset();
  }

  disconnectedCallback() {
    globalThis.removeEventListener("hashchange", this._onHash);
    globalThis.document.removeEventListener("keydown", this._onKey);
    this._syncTopOffset(true);
    super.disconnectedCallback();
  }

  /**
   * In demo mode the strip sits above the HAXcms editor bar: the page's
   * --haxcms-top-offset says how much room it takes, and goes away with it.
   * @param {boolean} leaving the bar is being removed
   */
  _syncTopOffset(leaving = false) {
    const root = globalThis.document && globalThis.document.documentElement;
    if (!root) return;
    if (this.demo && !leaving) {
      root.style.setProperty("--haxcms-top-offset", "40px");
      this._setOffset = true;
    } else if (this._setOffset) {
      root.style.removeProperty("--haxcms-top-offset");
      this._setOffset = false;
    }
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    // the character is decoration on every network page, so it loads after
    // the bar has drawn
    if (!this.demo) {
      import("@haxtheweb/rpg-character/rpg-character.js");
    }
    this._onHash();
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    if (changedProperties.has("demo")) {
      this._syncTopOffset();
    }
    if (changedProperties.has("installOpen")) {
      const dialog = this.shadowRoot.querySelector("dialog");
      if (this.installOpen && !dialog.open) {
        dialog.showModal();
      } else if (!this.installOpen && dialog.open) {
        dialog.close();
      }
    }
    if (
      changedProperties.has("installMethod") &&
      changedProperties.get("installMethod") !== undefined &&
      this.installOpen
    ) {
      // moving between the list and a way: focus lands on what changed
      const target = this.installMethod
        ? this.shadowRoot.querySelector(".detail h3")
        : this.shadowRoot.querySelector(
            `.way[data-way="${changedProperties.get("installMethod")}"]`,
          );
      if (target) target.focus();
    }
  }

  /** RPG me, opened on this character when there is one */
  _characterHref() {
    return this.character
      ? `https://rpg-me.hax.cloud/?code=${encodeURIComponent(this.character)}`
      : "https://rpg-me.hax.cloud";
  }

  /** Merlin's open shortcut, written the way HAX writes it (Alt⇧, ⌘⇧ in Safari) */
  _shortcutLabel() {
    return globalThis.safari !== undefined ? "Meta⇧" : "Alt⇧";
  }

  /**
   * Alt⇧ (Meta⇧ in Safari, as Merlin does) opens Merlin before he has loaded;
   * once he has, his own shortcut takes over.
   */
  _onKey(e) {
    // in a demo the editor under the strip owns Merlin and his shortcut
    if (this.demo || HaxNetworkBar._merlinReady || !e.shiftKey) return;
    const mod =
      globalThis.safari !== undefined
        ? e.key === "Meta" || e.metaKey
        : e.altKey;
    if (mod && (e.key === "Shift" || e.key === "Alt" || e.key === "Meta")) {
      e.preventDefault();
      this.openMerlin();
    }
  }

  /** #install or #install/<way> opens Install HAX */
  _onHash() {
    const hash = String(globalThis.location.hash || "");
    const m = /^#install(?:\/([a-z]+))?$/.exec(hash);
    if (m) {
      this.openInstall(m[1] || "");
    }
  }

  /** Open or close the sites menu (narrow screens) */
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  /**
   * Open Install HAX, on the list or on one way's steps.
   * @param {string} method browser, cli, nodejs, php, desktop or agent
   */
  openInstall(method = "") {
    this.menuOpen = false;
    this.installMethod = HAX_INSTALL_METHODS.some((m) => m.id === method)
      ? method
      : "";
    this.installOpen = true;
  }

  /** Show one way's steps, or the list when empty */
  showInstallMethod(method) {
    this.installMethod = method || "";
  }

  closeInstall() {
    this.installOpen = false;
  }

  _dialogClosed() {
    this.installOpen = false;
    this._copied = "";
    if (/^#install/.test(String(globalThis.location.hash || ""))) {
      globalThis.history.replaceState(
        null,
        "",
        globalThis.location.pathname + globalThis.location.search,
      );
    }
  }

  /** a click on the backdrop (the dialog itself, outside its content) closes */
  _dialogClick(e) {
    if (e.target === e.currentTarget) {
      const r = e.currentTarget.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      ) {
        this.closeInstall();
      }
    }
  }

  /** Copy a command, and say so on its button for a moment */
  async copy(text, key) {
    try {
      await globalThis.navigator.clipboard.writeText(text);
      this._copied = key;
      clearTimeout(this._copyTimer);
      this._copyTimer = setTimeout(() => {
        this._copied = "";
      }, 2000);
    } catch {
      this._copied = "";
    }
  }

  /**
   * Open Merlin with the network's places. The first time, Merlin loads, the
   * places are added and the page is asked (hax-network-merlin) for its own.
   */
  async openMerlin() {
    const merlin = await HaxNetworkBar.loadMerlin();
    if (!merlin) return;
    HaxNetworkBar._merlinReady = true;
    if (!HaxNetworkBar._defined) {
      HaxNetworkBar._defined = true;
      const add = (o) => merlin.defineOption(this.networkOption(o));
      HAX_NETWORK_DESTINATIONS.forEach((d) =>
        add({
          title: this.t[d.title],
          about: this.t[d.about],
          href: d.href,
          icon: d.icon,
          tags: ["network", "hax"],
        }),
      );
      // Install HAX, and each way to install, run here
      merlin.defineOption(
        this.installOption({
          title: this.t.installAll,
          about: this.t.installAllAbout,
          icon: "hax:admin-download",
          method: "",
        }),
      );
      HAX_INSTALL_METHODS.forEach((m) =>
        merlin.defineOption(
          this.installOption({
            title: `${this.t.install}: ${this.t[m.title]}`,
            about: this.t[m.about],
            icon: m.icon,
            method: m.id,
          }),
        ),
      );
      this.dispatchEvent(
        new CustomEvent("hax-network-merlin", {
          bubbles: true,
          composed: true,
          detail: { merlin, add },
        }),
      );
    }
    // the full Merlin dialog, centered: the strip is too thin and too far
    // to the side to hang his popover from
    merlin.inlineMode = false;
    merlin.mini = false;
    merlin.wand = false;
    merlin.activeNode = null;
    merlin.runProgram("", "*");
    merlin.open();
  }

  /**
   * A Merlin option that goes to a page: {title, href, about, icon, tags}.
   * Only http(s) and same-site paths are followed.
   */
  networkOption(o) {
    return {
      title: o.title,
      icon: o.icon || "hax:future-traveler-plain",
      tags: o.tags || [],
      path: o.path || this.t.networkPath,
      context: "*",
      value: { target: this, method: "go", args: [o.href] },
      eventName: "super-daemon-element-method",
      textCharacter: "",
      description: o.about || "",
    };
  }

  /** A Merlin option that opens Install HAX: {title, about, icon, method} */
  installOption(o) {
    return {
      title: o.title,
      icon: o.icon,
      tags: ["install", "hax", "setup", "download", o.method || "all"],
      path: this.t.installPath,
      context: "*",
      value: { target: this, method: "openInstall", args: [o.method] },
      eventName: "super-daemon-element-method",
      textCharacter: "",
      description: o.about || "",
    };
  }

  /** Go to a place Merlin picked. */
  go(href) {
    const url = String(href || "");
    if (!/^(https?:\/\/|\/(?!\/))/.test(url)) return;
    globalThis.location.assign(url);
  }

  /** Merlin, loaded once for every bar on the page. */
  static loadMerlin() {
    if (!HaxNetworkBar._merlin) {
      // some of Merlin's parts read process.env, which a HAX site defines;
      // the other network sites may not, so it is filled in the same way
      globalThis.process = globalThis.process || {
        env: { NODE_ENV: "production" },
      };
      HaxNetworkBar._merlin =
        import("@haxtheweb/super-daemon/super-daemon.js").then(
          (m) => m.SuperDaemonInstance,
          () => null,
        );
    }
    return HaxNetworkBar._merlin;
  }
}

globalThis.customElements.define(HaxNetworkBar.tag, HaxNetworkBar);
