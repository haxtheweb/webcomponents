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
import {
  HAX_NETWORK,
  haxNetworkGlyph,
  HaxNetworkGlyphStyles,
} from "./lib/hax-network.js";

/** Where Install HAX lives: any network page opens it from #install. */
export const HAX_INSTALL_URL = "https://hax.cloud/#install";

/**
 * The sites in the HAX network, in the order the bar shows them, read from
 * the network's record (lib/hax-network.js). `id` is what `current` names;
 * `label` is a key into `this.t`.
 */
export const HAX_NETWORK_SITES = HAX_NETWORK.order.map((id) => ({
  id,
  label: id,
  href: HAX_NETWORK.properties[id].url,
}));

/** What `current` used to call two of the sites; both still work. */
const FORMER_SITE_IDS = { browser: "try", docs: "web" };

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
 * The community links at the foot of the properties menu, in order. Where
 * the properties fold into that menu, Discord and GitHub leave the bar's
 * right side, since the menu already holds them.
 */
export const HAX_MENU_COMMUNITY = ["linkedin", "discord", "github", "x"];

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
    title: "goLearn",
    about: "goLearnAbout",
    href: "https://learn.hax.cloud",
    icon: "hardware:tv",
  },
  {
    title: "goArt",
    about: "goArtAbout",
    href: "https://art.hax.cloud/",
    icon: "image:palette",
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
 * The top bar of every site in the HAX network, drawn like the HAX editor's
 * own top bar. Each property of the network is an icon in its own color: the
 * one you are on opens into a pill with its name, and hovering or focusing
 * any of them shows a card saying what it is for. A tool that lives within a
 * property is not in the bar: on RPG me, one of HAX Art's tools, Art is the
 * one lit up. Merlin sits in the middle; Discord, GitHub,
 * Install HAX and the Future Traveler on the right. Nothing in the bar
 * belongs to the site under it: a site draws its own header, links and
 * controls below.
 *
 * The bar is playful on purpose. On hover or focus Discord talks, GitHub
 * pushes, Install HAX drops in, and the Future Traveler tears through every
 * era he has been to (lib/hax-future-traveler.js, loaded the first time he
 * is touched); a click keeps the next one. Nothing moves for a visitor who
 * asks for less motion.
 *
 * What a property is called, its color, its icon and the sentence on its
 * card come from the network's record, lib/hax-network.js.
 *
 * The bar has two modes. The full bar is the one above. The mini bar
 * (`compact`) is for a page whose editor already has Merlin and the Future
 * Traveler (HAXcms in the browser): shorter, the same property icons, no
 * Merlin or Future Traveler of its own, and the `pre` slot in the
 * middle for the page's own status and functions. `demo` is the mini bar for
 * a HAXcms demo with no backend: it adds a notice that nothing is saved and
 * pins itself above the HAXcms editor bar.
 *
 * Merlin loads the first time he is opened (from the field or Alt⇧), so a
 * page that never asks for him never downloads him. A page can add its own
 * places: listen for `hax-network-merlin` and call `detail.add(option)` with
 * `{title, href, about, icon, tags}` (hax.cloud adds every web and tour).
 *
 * Install HAX opens in place: a tab for every way to get HAX with its quick
 * steps, and a link to haxtheweb.org for the rest. Any page with the bar
 * opens it from `#install` (or `#install/<way>`: browser, cli, nodejs, php,
 * desktop, agent).
 *
 * @demo demo/index.html
 * @element hax-network-bar
 * @slot pre - after the network's icons (in the middle in the mini bar: compact or demo), for the page's own controls
 * @slot post - before Install HAX; holds the GitHub link unless the page fills it
 * @fires hax-network-merlin - {merlin, add(option)} the first time Merlin opens
 */
export class HaxNetworkBar extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "hax-network-bar";
  }

  constructor() {
    super();
    this.current = "";
    this.travelerEra = "now";
    this._tearing = false;
    this._eras = null;
    this._remixTimer = null;
    this._eraPinned = false;
    this.installOpen = false;
    this.installMethod = "";
    this.menuOpen = false;
    this.demo = false;
    this.compact = false;
    this.hasPre = false;
    this._copied = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      network: "HAX network",
      web: "HAXTheWeb",
      webAbout: "Why HAX is for you, and every way to get it.",
      try: "Build now",
      tryAbout: "Use HAX right now in this browser tab. Nothing to install.",
      learn: "Learn",
      learnAbout: "Tutorials that teach HAX one flow at a time.",
      elements: "Web components",
      elementsAbout: "Every HAX element, with live demos and walkthroughs.",
      cloud: "PRAW",
      cloudAbout:
        "The brain of the HAX ecosystem: every person, pillar and project, and how they connect.",
      art: "Art",
      artAbout:
        "The HAX art movement: posters, the Future Traveler across time, and playful tools like RPG me.",
      here: "You are here",
      remix: "Remix the HAX Future Traveler",
      github: "GitHub",
      discord: "Discord",
      issues: "Issues",
      linkedin: "LinkedIn",
      x: "X",
      demoLabel: "About this demo",
      demoTag: "Demo",
      demoNotice: "There's no backend here, so nothing you change is saved.",
      demoNoticeShort: "Nothing is saved.",
      githubLink: "HAX on GitHub",
      sitesMenu: "HAX network sites",
      merlin: "Search",
      merlinHint: "Travel anywhere",
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
      installWays: "Ways to install",
      installDetails: "More details on haxtheweb.org",
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
      goCloud: "PRAW: the brain of the HAX ecosystem",
      goCloudAbout:
        "Every part of HAX and everyone who builds it, in one interactive web.",
      goTours: "Tours of the ecosystem",
      goToursAbout:
        "Step-by-step walks through the web for faculty, students, developers and more.",
      goElements: "Web components: every HAX element",
      goElementsAbout: "Browse, search and try the elements HAX authors with.",
      goBrowser: "Build now: HAXcms in your browser",
      goBrowserAbout:
        "Make and edit HAX sites in a browser tab, saved to a folder you pick.",
      goArt: "Art: the HAX art movement",
      goArtAbout:
        "Posters, the Future Traveler across time, and playful tools like RPG me.",
      goLearn: "Learn: tutorials for HAX",
      goLearnAbout: "Tutorials that teach HAX one flow at a time.",
      goDocs: "HAXTheWeb: why HAX, and how to get it",
      goDocsAbout:
        "Who HAX is for, how it compares and every way to install it.",
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
       * Which site this is: web, try, learn, elements, art or cloud (what it
       * was called before, browser and docs, still works). A tool that lives
       * within a property names itself and lights that property: rpg (RPG
       * me) lights Art.
       */
      current: { type: String, reflect: true },
      /** Install HAX is open */
      installOpen: { type: Boolean, attribute: "install-open", reflect: true },
      /** The way to install whose tab is open; empty is the first */
      installMethod: { type: String, attribute: "install-method" },
      /** The sites menu is open (narrow screens) */
      menuOpen: { type: Boolean, attribute: "menu-open", reflect: true },
      /**
       * A HAXcms demo with no backend (demo.hax.cloud, the haxcms-elements
       * demo): the mini bar (as compact) with a notice that nothing is
       * saved, pinned above the HAXcms editor bar. It keeps
       * --haxcms-top-offset on the page set to its height so the editor bar
       * sits under it.
       */
      demo: { type: Boolean, reflect: true },
      /**
       * The mini bar, for a page whose editor already has Merlin and the
       * Future Traveler (HAXcms in the browser): shorter, with the same
       * property icons but no Merlin or Future Traveler of its own, and the pre slot in the middle for the page's own status and
       * functions.
       */
      compact: { type: Boolean, reflect: true },
      /** the mini bar's pre slot holds something (a page's own controls) */
      hasPre: { type: Boolean, attribute: "has-pre", reflect: true },
      _copied: { type: String, state: true },
      /**
       * The era the Future Traveler is drawn in: now, steam, nouveau, deco,
       * tomorrow, rainbow, stripes, neon, handheld, web, polygon or terminal
       * (HAX_TRAVELER_ERAS in lib/hax-future-traveler.js).
       */
      travelerEra: { type: String, attribute: "traveler-era", reflect: true },
      /** the traveler is tearing between two eras */
      _tearing: { type: Boolean, state: true },
      /** the eras have loaded */
      _eras: { type: Object, state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminTokens,
      HaxUiDialogTitlebarStyles,
      MerlinWandStyles,
      HaxNetworkGlyphStyles,
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
          /* Merlin stays in the middle while there is room; when there is
             not, he gives way and the two sides keep their own width */
          grid-template-columns:
            minmax(max-content, 1fr) minmax(40px, auto)
            minmax(max-content, 1fr);
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
        /* DDD lays lists out as columns; the sites run in a row */
        nav.props ul,
        .net-menu ul,
        .install-foot .social,
        ol.steps {
          margin: 0;
          padding: 0;
        }
        nav.props li,
        .net-menu li,
        .install-foot .social li {
          margin: 0;
          padding: 0;
        }
        ::slotted([slot="pre"]) {
          white-space: nowrap;
        }
        /* Merlin: the editor's field, in a darker well than the bar, with
           the Future Traveler at its start and the shortcut chip at its end */
        .merlin {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          box-sizing: border-box;
          width: var(--hax-network-bar-merlin-width, clamp(280px, 28vw, 448px));
          min-width: 40px;
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
          line-height: var(--ddd-lh-100, 1);
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
        .github,
        .community {
          display: inline-grid;
          place-items: center;
          width: 40px;
          height: 40px;
          border-radius: var(--hax-ui-radius);
          --simple-icon-width: 28px;
          --simple-icon-height: 28px;
        }
        .github:hover,
        .community:hover {
          background-color: var(--hax-ui-hover);
        }
        /* the Future Traveler: decorative, top right as in every HAX UI */
        /* the Future Traveler: hover flips him through every era he has
           been to, a click keeps the next one */
        .traveler {
          flex: none;
          display: inline-grid;
          place-items: center;
          width: 40px;
          height: 40px;
          margin: 0;
          padding: 0;
          border: none;
          border-radius: var(--hax-ui-radius);
          background-color: transparent;
          cursor: pointer;
          --simple-icon-width: 36px;
          --simple-icon-height: 36px;
          --future-traveler-size: 36px;
        }
        .traveler:active {
          transform: translateY(1px);
        }

        /* ---------- play ---------- */
        /* Discord talks, GitHub pushes, Install HAX drops in */
        .community,
        .github,
        .install-btn {
          transition:
            color var(--hax-ui-duration) var(--hax-ui-easing),
            background-color var(--hax-ui-duration) var(--hax-ui-easing),
            box-shadow var(--hax-ui-duration) var(--hax-ui-easing);
        }
        .discord:hover,
        .discord:focus-visible {
          color: var(--ddd-theme-default-athertonViolet);
          --simple-icon-color: var(--ddd-theme-default-athertonViolet);
        }
        .github:hover,
        .github:focus-visible {
          color: var(--ddd-theme-default-futureLime);
          --simple-icon-color: var(--ddd-theme-default-futureLime);
        }
        .install-btn:hover,
        .install-btn:focus-visible {
          box-shadow:
            0 0 0 3px var(--ddd-theme-default-coalyGray),
            0 0 0 5px var(--ddd-theme-default-keystoneYellow);
        }
        @media (prefers-reduced-motion: no-preference) {
          .discord:hover simple-icon-lite,
          .discord:focus-visible simple-icon-lite {
            animation: net-talk 0.7s ease-in-out infinite;
          }
          .github:hover simple-icon-lite,
          .github:focus-visible simple-icon-lite {
            animation: net-push 0.8s ease-in-out infinite;
          }
          .install-btn:hover,
          .install-btn:focus-visible {
            animation: net-pop 0.4s ease-out;
          }
          .install-btn:hover simple-icon-lite,
          .install-btn:focus-visible simple-icon-lite {
            animation: net-drop 0.7s ease-in infinite;
          }
        }
        @keyframes net-talk {
          0%,
          100% {
            transform: rotate(0) scale(1);
          }
          20% {
            transform: rotate(-12deg) scale(1.12);
          }
          40% {
            transform: rotate(10deg) scale(1.12);
          }
          60% {
            transform: rotate(-6deg) scale(1.06);
          }
          80% {
            transform: rotate(4deg);
          }
        }
        @keyframes net-push {
          0%,
          100% {
            transform: translateY(0) scale(1, 1);
          }
          25% {
            transform: translateY(2px) scale(1.12, 0.86);
          }
          55% {
            transform: translateY(-5px) scale(0.94, 1.1);
          }
          80% {
            transform: translateY(0) scale(1.06, 0.94);
          }
        }
        @keyframes net-pop {
          0% {
            transform: scale(1);
          }
          45% {
            transform: scale(1.1) rotate(-2deg);
          }
          75% {
            transform: scale(0.97) rotate(1deg);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes net-drop {
          0% {
            transform: translateY(-5px);
            opacity: 0;
          }
          40% {
            transform: translateY(0);
            opacity: 1;
          }
          60% {
            transform: translateY(2px) scale(1.15, 0.85);
          }
          80%,
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }

        /* narrower screens: the full bar's own controls give way to Merlin */
        @media (max-width: 1279px) {
          :host(:not([compact]):not([demo])) slot[name="pre"] {
            display: none;
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
          .community,
          .traveler,
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
        .install-foot span {
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
          .install-foot .social {
            margin-left: 0;
          }
        }

        @media (forced-colors: active) {
          .merlin,
          .props a,
          .net-btn,
          .tabs button {
            border-color: ButtonText;
          }
        }

        /* an open card or menu hangs below the bar, over whatever the page
           puts there */
        :host([menu-open]),
        :host(:hover),
        :host(:focus-within) {
          z-index: var(--hax-network-bar-open-z-index, 1001);
        }
        /* ---------- the properties ---------- */
        /* an icon each, its color under it; the one you are on opens into a
           pill in its color with its name */
        nav.props ul {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: var(--ddd-spacing-1);
          list-style: none;
          white-space: nowrap;
        }
        .prop {
          position: relative;
        }
        .props a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-2);
          box-sizing: border-box;
          min-width: var(--ddd-target-comfortable, 44px);
          height: var(--ddd-target-comfortable, 44px);
          padding: 0 var(--ddd-spacing-2);
          border-radius: var(--hax-ui-radius);
          border-bottom: 3px solid var(--prop);
          font-size: var(--hax-ui-admin-font-size);
          line-height: 1.5;
          text-decoration: none;
          --glyph-accent: var(--hax-ui-text-muted);
        }
        .props a:hover,
        .props a:focus-visible {
          background-color: #111;
        }
        .props a .name {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
        .props a[aria-current="page"] {
          padding: 0 var(--ddd-spacing-3);
          border: 2px solid var(--ddd-theme-default-white);
          background-color: var(--prop);
          color: var(--on);
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-bold);
          --glyph-accent: var(--on);
          --glyph-lit: var(--on);
        }
        .props a[aria-current="page"] .name {
          position: static;
          width: auto;
          height: auto;
          overflow: visible;
          clip-path: none;
          font-size: var(--hax-ui-admin-font-size);
        }
        /* what a property is for, on hover or focus */
        .card {
          display: none;
          position: absolute;
          top: calc(100% + var(--ddd-spacing-2));
          left: 0;
          z-index: 6;
          width: 280px;
          box-sizing: border-box;
          padding: var(--ddd-spacing-3);
          border: 1px solid var(--hax-ui-line-strong);
          border-top: 4px solid var(--prop);
          border-radius: var(--hax-ui-radius);
          background-color: var(--ddd-theme-default-coalyGray);
          box-shadow: var(--hax-ui-shadow-popover);
          white-space: normal;
          text-align: start;
        }
        /* a bridge so the pointer can travel from the icon to its card */
        .card::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: calc(-1 * var(--ddd-spacing-3));
          height: var(--ddd-spacing-3);
        }
        .prop:hover .card,
        .prop:focus-within .card {
          display: grid;
          gap: var(--ddd-spacing-1);
        }
        .prop[data-away] .card {
          display: none;
        }
        .card,
        .card span {
          font-size: var(--hax-ui-admin-font-size);
          line-height: 1.4;
        }
        .card-head {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0 var(--ddd-spacing-2);
        }
        .card strong {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
        }
        .card .host {
          color: var(--hax-ui-text-muted);
        }
        .card .you {
          justify-self: start;
          padding: 0 var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-rounded);
          background-color: var(--prop);
          color: var(--on);
          font-weight: var(--ddd-font-weight-bold);
        }
        /* narrow screens and touch: the same properties as one menu, with
           each one's sentence in it */
        .net-btn {
          display: none;
          align-items: center;
          gap: var(--ddd-spacing-2);
          box-sizing: border-box;
          height: var(--ddd-target-comfortable, 44px);
          padding: 0 var(--ddd-spacing-2);
          border: 2px solid var(--ddd-theme-default-white);
          border-radius: var(--hax-ui-radius);
          background-color: var(--prop, transparent);
          color: var(--on, inherit);
          font: inherit;
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-bold);
          white-space: nowrap;
          cursor: pointer;
          --glyph-accent: var(--on, currentColor);
          --glyph-lit: var(--on, currentColor);
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
        }
        .net-btn:active {
          transform: translateY(1px);
        }
        .net-btn[aria-expanded="true"] .caret {
          transform: rotate(180deg);
        }
        .net-menu {
          position: absolute;
          top: 100%;
          left: var(--hax-network-bar-gutter, var(--ddd-spacing-3));
          z-index: 6;
          width: 320px;
          max-width: calc(
            100% - 2 * var(--hax-network-bar-gutter, var(--ddd-spacing-3))
          );
          box-sizing: border-box;
          padding: var(--ddd-spacing-2);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          background-color: var(--ddd-theme-default-coalyGray);
          box-shadow: var(--hax-ui-shadow-popover);
        }
        .net-menu[hidden] {
          display: none;
        }
        .net-menu ul {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: var(--ddd-spacing-1);
          list-style: none;
        }
        .net-menu ul.more {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: var(--ddd-spacing-2);
          padding-top: var(--ddd-spacing-2);
          border-top: 1px solid var(--hax-ui-line);
        }
        .net-menu ul.more li {
          min-width: 0;
        }
        .net-menu a {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          min-height: var(--ddd-target-comfortable, 44px);
          box-sizing: border-box;
          padding: var(--ddd-spacing-2);
          border: 2px solid transparent;
          border-radius: var(--hax-ui-radius);
          font-size: var(--hax-ui-admin-font-size);
          line-height: 1.5;
          text-decoration: none;
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
        }
        .net-menu a:hover {
          background-color: var(--hax-ui-hover);
        }
        .net-menu a[aria-current="page"] {
          border-color: var(--ddd-theme-default-white);
        }
        .net-menu .tile {
          flex: none;
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          border-radius: var(--hax-ui-radius);
          background-color: var(--prop);
          color: var(--on);
          --glyph-accent: var(--on);
          --glyph-lit: var(--on);
        }
        .net-menu .text {
          display: grid;
          font-size: var(--hax-ui-admin-font-size);
        }
        .net-menu .text span {
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-regular);
        }
        .community {
          --simple-icon-width: 24px;
          --simple-icon-height: 24px;
        }
        .install-btn:active,
        .copy:active,
        .tabs button:active {
          transform: translateY(1px);
        }

        /* ---------- compact: the bar over a full platform ---------- */
        :host([compact]),
        :host([demo]) {
          --hax-network-bar-height: 48px;
        }
        :host([compact]) .bar,
        :host([demo]) .bar {
          grid-template-columns: auto minmax(0, 1fr) auto;
        }
        :host([compact]) .props a,
        :host([demo]) .props a {
          min-width: var(--ddd-control-height-sm, 40px);
          height: var(--ddd-control-height-sm, 40px);
          --glyph-size: 22px;
        }
        :host([compact]) .net-btn,
        :host([demo]) .net-btn {
          height: var(--ddd-control-height-sm, 40px);
        }
        :host([compact]) .install-btn,
        :host([demo]) .install-btn {
          height: 32px;
          padding: 0 var(--ddd-spacing-3);
        }
        .app {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-1) var(--ddd-spacing-3);
          min-width: 0;
        }

        /* ---------- Install HAX: a tab for every way ---------- */
        .tabs {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-1);
          border-bottom: 1px solid var(--hax-ui-line-strong);
        }
        .tabs button {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          box-sizing: border-box;
          min-height: 40px;
          padding: 0 var(--ddd-spacing-3);
          border: 1px solid transparent;
          border-bottom: 3px solid transparent;
          border-radius: var(--hax-ui-radius) var(--hax-ui-radius) 0 0;
          background-color: transparent;
          color: inherit;
          font: inherit;
          font-size: var(--hax-ui-admin-font-size);
          white-space: nowrap;
          cursor: pointer;
          --simple-icon-width: 20px;
          --simple-icon-height: 20px;
          --merlin-traveler-size: 20px;
        }
        .tabs button:hover {
          background-color: var(--hax-ui-hover);
        }
        .tabs button[aria-selected="true"] {
          border-color: var(--hax-ui-line-strong);
          border-bottom-color: var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-sunken);
          font-weight: var(--ddd-font-weight-bold);
        }
        .detail {
          display: grid;
          gap: var(--ddd-spacing-4);
          min-width: 0;
          padding: var(--ddd-spacing-4) 0 0;
        }
        .detail:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .detail-about {
          margin: 0;
          font-size: var(--ddd-font-size-4xs);
          line-height: 1.5;
        }
        .detail-about .best {
          color: var(--hax-ui-text-muted);
        }
        .detail-more {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-3);
        }
        /* a link drawn as the Install button: DDD's a:any-link rule
           outranks .install-btn, so the fill and ink are set again here
           or the label is dark on the dark dialog */
        .detail-more a.install-btn {
          text-decoration: none;
          background-color: var(--ddd-theme-default-keystoneYellow);
          color: var(--ddd-theme-default-coalyGray);
        }
        .detail-more a.install-btn:hover,
        .detail-more a.install-btn:focus-visible {
          background-color: var(--ddd-theme-default-roarGolden);
          border-color: var(--ddd-theme-default-roarGolden);
          color: var(--ddd-theme-default-coalyGray);
        }
        a.more {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          min-height: 32px;
          color: var(--hax-ui-accent-text);
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-bold);
          --simple-icon-width: 18px;
          --simple-icon-height: 18px;
        }

        /* where the page's own controls (the pre slot) move to a second
           row: the demo strip's notice is long, so it moves sooner; the
           compact bar keeps one row (its icons fold into the menu at 900px,
           below) until a phone is too narrow for the three groups */
        @media (max-width: 1100px) {
          :host([demo]) .bar {
            height: auto;
            min-height: var(--hax-network-bar-height);
            grid-template-columns: minmax(0, 1fr) auto;
            padding-top: var(--ddd-spacing-2);
            padding-bottom: var(--ddd-spacing-2);
            row-gap: var(--ddd-spacing-2);
          }
          :host([demo]) .app {
            grid-row: 2;
            grid-column: 1 / -1;
          }
          :host([demo]) .start,
          :host([demo]) .end {
            height: auto;
          }
        }
        @media (max-width: 600px) {
          :host([compact]) .bar {
            height: auto;
            min-height: var(--hax-network-bar-height);
            grid-template-columns: minmax(0, 1fr) auto;
            padding-top: var(--ddd-spacing-2);
            padding-bottom: var(--ddd-spacing-2);
            row-gap: var(--ddd-spacing-2);
          }
          :host([compact]) .app {
            grid-row: 2;
            grid-column: 1 / -1;
          }
          :host([compact]) .start,
          :host([compact]) .end {
            height: auto;
          }
        }
        @media (max-width: 900px), (hover: none) {
          nav.props {
            display: none;
          }
          .net-btn {
            display: inline-flex;
          }
          /* the menu's foot holds them now; a page's own post content stays */
          .end .community,
          slot[name="post"] > a.github {
            display: none;
          }
        }
        @media (max-width: 900px) {
          :host(:not([compact]):not([demo])) .bar {
            grid-template-columns: auto minmax(40px, 1fr) auto;
          }
          .merlin {
            justify-self: end;
          }
          .net-btn .label {
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        @media (min-width: 600px) and (max-width: 900px) {
          .merlin {
            width: 100%;
            max-width: var(--hax-network-bar-merlin-width-narrow, 280px);
          }
        }
        @media (max-width: 599px) {
          .net-btn .label {
            max-width: 64px;
          }
          .code {
            flex-direction: column;
          }
          .code pre {
            width: 100%;
          }
        }
        @media (max-width: 380px) {
          .net-btn .label {
            display: none;
          }
        }

        /* ---------- demo: the mini bar, pinned above the editor ---------- */
        /* the frame is fixed over the page and the host holds its room in
           the flow (its height follows the frame), so it stays put as the
           page scrolls, as the editor bar under it does */
        .frame {
          position: relative;
        }
        /* the host is the bar's stacking context, so the host (not just the
           fixed frame) sits above the HAXcms editor bar under it
           (var(--ddd-z-modal, 10000)); otherwise the cards and the sites
           menu that drop below the bar open underneath the editor bar */
        :host([demo]) {
          z-index: calc(var(--ddd-z-modal, 10000) + 1);
          background-color: transparent;
          border-bottom: none;
        }
        :host([demo]) .frame {
          position: fixed;
          inset: 0 0 auto 0;
          z-index: calc(var(--ddd-z-modal, 10000) + 1);
          background-color: var(--ddd-theme-default-coalyGray);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        :host([demo]) ::slotted([slot="pre"]) {
          --haxcms-appearance-switcher-select-width: 116px;
        }
        .notice {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          min-width: 0;
          margin: 0;
          font-size: var(--hax-ui-admin-font-size);
          white-space: nowrap;
        }
        .notice .tag {
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
        .notice .short {
          display: none;
        }
        /* with the page's own controls beside it, the notice says it short */
        :host([has-pre]) .notice .long {
          display: none;
        }
        :host([has-pre]) .notice .short {
          display: inline;
        }
        /* at the narrowest it may take two lines; it is never cut off */
        @media (max-width: 380px) {
          .notice {
            white-space: normal;
            line-height: 1.15;
          }
        }
      `,
    ];
  }

  /**
   * The bar has two modes: the full bar, and the mini bar (compact) for a
   * page whose own editor already has Merlin and the Future Traveler. A demo
   * is the mini bar with a notice that nothing is saved, pinned above the
   * HAXcms editor bar.
   */
  get mini() {
    return this.compact || this.demo;
  }

  render() {
    const here = this._here();
    return html`
      <div class="frame">
        <div class="bar">
          <div class="start" @keydown="${this._menuKey}">
            <nav class="props" aria-label="${this.t.network}">
              <ul>
                ${HAX_NETWORK.order.map((id) => this._renderProperty(id, here))}
              </ul>
            </nav>
            ${this._renderMenu(here)}
            ${this.mini ? `` : html`<slot name="pre"></slot>`}
          </div>
          ${
            this.mini
              ? html`<div class="app">
                  <slot name="pre" @slotchange="${this._preSlotChanged}"></slot>
                  ${this.demo ? this._renderDemoNotice() : ``}
                </div>`
              : html`<button
                  class="merlin merlin-wand-host"
                  type="button"
                  aria-haspopup="dialog"
                  title="${this.t.merlin}"
                  @click="${this.openMerlin}"
                >
                  ${merlinTraveler()}
                  <span class="hint">${this.t.merlinHint}</span>
                  <span class="sr-only"
                    >${this.t.merlin}${this.t.merlinWhere}</span
                  >
                  ${
                    this._shortcutLabel()
                      ? html`<kbd class="chip" aria-hidden="true"
                          >${this._shortcutLabel()}</kbd
                        >`
                      : ``
                  }
                </button>`
          }
          <div class="end">
            <a
              class="community discord"
              href="${HAX_COMMUNITY_LINKS[0].href}"
              title="${this.t.discord}"
            >
              <simple-icon-lite icon="hax:discord"></simple-icon-lite>
              <span class="sr-only">${this.t.discord}</span>
            </a>
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
            ${
              this.mini
                ? ``
                : html`<button
                    class="traveler ft-host ${this._tearing ? "ft-glitch" : ""}"
                    type="button"
                    title="${this.t.remix}"
                    aria-label="${this.t.remix}"
                    aria-pressed="${this.travelerEra !== "now" ? "true" : "false"}"
                    @mouseenter="${this._remixStart}"
                    @focus="${this._remixStart}"
                    @mouseleave="${this._remixStop}"
                    @blur="${this._remixStop}"
                    @click="${this.remix}"
                  >
                    ${
                      this._eras && this.travelerEra !== "now"
                        ? this._eras.futureTraveler(this.travelerEra)
                        : html`<simple-icon-lite
                            icon="hax:future-traveler"
                            no-colorize
                          ></simple-icon-lite>`
                    }
                  </button>`
            }
          </div>
        </div>
      </div>
      ${this._renderInstall()}
    `;
  }

  /** the site this bar is on, by the name the network's record gives it */
  /**
   * The property this site is: its own id, or for a tool that lives within a
   * property (RPG me, within Art) that property, so it lights up.
   */
  _here() {
    const id = FORMER_SITE_IDS[this.current] || this.current || "";
    const p = HAX_NETWORK.properties[id];
    return p && p.within ? p.within : id;
  }

  /** a property's color and the ink that reads on it, as custom properties */
  _tint(id) {
    const p = HAX_NETWORK.properties[id];
    return p
      ? `--prop:var(--ddd-theme-default-${p.color});--on:var(--ddd-theme-default-${p.on})`
      : "";
  }

  /** the card a property shows on hover or focus: what it is, in a sentence */
  _renderCard(id, here) {
    const p = HAX_NETWORK.properties[id];
    return html`<div class="card" role="tooltip" id="card-${id}">
      <span class="card-head">
        <strong>${this.t[id]}</strong>
        <span class="host">${p.url.replace("https://", "")}</span>
      </span>
      <span class="purpose">${this.t[`${id}About`]}</span>
      ${id === here ? html`<span class="you">${this.t.here}</span>` : ``}
    </div>`;
  }

  _renderProperty(id, here) {
    const p = HAX_NETWORK.properties[id];
    return html`<li
      class="prop"
      style="${this._tint(id)}"
      @keydown="${this._cardKey}"
    >
      <a
        class="glyph-host"
        href="${p.url}"
        aria-current="${id === here ? "page" : "false"}"
        aria-describedby="card-${id}"
      >
        ${haxNetworkGlyph(id)}<span class="name">${this.t[id]}</span>
      </a>
      ${this._renderCard(id, here)}
    </li>`;
  }

  /** the same properties as one menu, for narrow screens and touch */
  _renderMenu(here) {
    return html`<button
        class="net-btn"
        type="button"
        style="${this._tint(here)}"
        aria-expanded="${this.menuOpen ? "true" : "false"}"
        aria-controls="net-menu"
        @click="${this.toggleMenu}"
      >
        ${
          HAX_NETWORK.properties[here]
            ? haxNetworkGlyph(here)
            : html`<simple-icon-lite icon="icons:menu"></simple-icon-lite>`
        }
        <span class="label">${this.t[here] || this.t.network}</span>
        <simple-icon-lite
          class="caret"
          icon="icons:expand-more"
        ></simple-icon-lite>
        <span class="sr-only">${this.t.sitesMenu}</span>
      </button>
      <div class="net-menu" id="net-menu" ?hidden="${!this.menuOpen}">
        <ul>
          ${HAX_NETWORK.order.map(
            (id) =>
              html`<li style="${this._tint(id)}">
                <a
                  class="glyph-host"
                  href="${HAX_NETWORK.properties[id].url}"
                  aria-current="${id === here ? "page" : "false"}"
                >
                  <span class="tile">${haxNetworkGlyph(id)}</span>
                  <span class="text"
                    ><strong>${this.t[id]}</strong
                    ><span>${this.t[`${id}About`]}</span></span
                  >
                </a>
              </li>`,
          )}
        </ul>
        <ul class="more">
          ${HAX_MENU_COMMUNITY.map((id) =>
            HAX_COMMUNITY_LINKS.find((l) => l.id === id),
          ).map(
            (l) =>
              html`<li>
                <a href="${l.href}">
                  <simple-icon-lite icon="${l.icon}"></simple-icon-lite
                  >${this.t[l.label]}
                </a>
              </li>`,
          )}
        </ul>
      </div>`;
  }

  /** Escape puts a card away until the pointer or focus leaves it */
  _cardKey(e) {
    if (e.key !== "Escape") return;
    const el = e.currentTarget;
    el.setAttribute("data-away", "");
    const back = () => {
      el.removeAttribute("data-away");
      el.removeEventListener("mouseleave", back);
      el.removeEventListener("focusout", back);
    };
    el.addEventListener("mouseleave", back);
    el.addEventListener("focusout", back);
  }

  /** Escape closes the properties menu and gives focus back to its button */
  _menuKey(e) {
    if (e.key === "Escape" && this.menuOpen) {
      this.menuOpen = false;
      const btn = this.shadowRoot.querySelector(".net-btn");
      if (btn) btn.focus();
    }
  }

  /** the way to install whose tab is open */
  _way() {
    return (
      HAX_INSTALL_METHODS.find((m) => m.id === this.installMethod) ||
      HAX_INSTALL_METHODS[0]
    );
  }

  _renderInstall() {
    const way = this._way();
    return html`
      <dialog
        aria-labelledby="install-title"
        @close="${this._dialogClosed}"
        @click="${this._dialogClick}"
      >
        <div class="hax-ui-dialog-titlebar">
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
          <p class="install-intro">${this.t.installIntro}</p>
          <div
            class="tabs"
            role="tablist"
            aria-label="${this.t.installWays}"
            @keydown="${this._tabKey}"
          >
            ${HAX_INSTALL_METHODS.map(
              (m) =>
                html`<button
                  type="button"
                  role="tab"
                  id="tab-${m.id}"
                  data-way="${m.id}"
                  aria-selected="${m.id === way.id ? "true" : "false"}"
                  aria-controls="way-panel"
                  tabindex="${m.id === way.id ? "0" : "-1"}"
                  @click="${() => this.showInstallMethod(m.id)}"
                >
                  ${this._wayIcon(m)}${this.t[m.title]}
                </button>`,
            )}
          </div>
          ${this._renderWay(way)}
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

  /** one way's tab panel: what it is, its quick steps, and a page for the rest */
  _renderWay(m) {
    return html`
      <div
        class="detail"
        id="way-panel"
        role="tabpanel"
        aria-labelledby="tab-${m.id}"
        tabindex="0"
        data-way="${m.id}"
      >
        <p class="detail-about">
          ${this.t[m.about]}
          ${m.beta ? html`<span class="beta">${this.t.installBeta}</span>` : ``}
          <span class="best">${this.t.installBestFor}: ${this.t[m.best]}.</span>
        </p>
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
        <div class="detail-more">
          ${
            m.id === "browser"
              ? html`<a class="install-btn" href="${m.links[0].href}"
                  >${this.t[m.links[0].text]}</a
                >`
              : ``
          }
          <a
            class="more"
            href="${HAX_NETWORK.install.details}#${m.id}"
            aria-label="${this.t.installDetails}: ${this.t[m.title]}"
            >${this.t.installDetails}
            <simple-icon-lite icon="hax:admin-external"></simple-icon-lite
          ></a>
        </div>
      </div>
    `;
  }

  /** arrow keys, Home and End move between the ways' tabs */
  _tabKey(e) {
    const ids = HAX_INSTALL_METHODS.map((m) => m.id);
    let i = ids.indexOf(this._way().id);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      i = (i + 1) % ids.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      i = (i - 1 + ids.length) % ids.length;
    } else if (e.key === "Home") {
      i = 0;
    } else if (e.key === "End") {
      i = ids.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    this.showInstallMethod(ids[i]);
    this.updateComplete.then(() => {
      const tab = this.shadowRoot.querySelector(`#tab-${ids[i]}`);
      if (tab) tab.focus();
    });
  }

  /** In a demo: nothing you change is saved (the whole sentence when there is room) */
  _renderDemoNotice() {
    return html`<p class="notice" role="note" aria-label="${this.t.demoLabel}">
      <span class="tag">${this.t.demoTag}</span>
      <span class="text"
        ><span class="long">${this.t.demoNotice}</span
        ><span class="short">${this.t.demoNoticeShort}</span></span
      >
    </p>`;
  }

  _preSlotChanged(e) {
    this.hasPre = e.target.assignedElements().length > 0;
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
    globalThis.clearInterval(this._remixTimer);
    this._remixTimer = null;
    super.disconnectedCallback();
  }

  /**
   * In a demo the bar is pinned above the HAXcms editor bar. It takes as
   * much room as it is tall (taller where the page's own controls wrap to a
   * second row), so the host holds that room in the page and the page's
   * --haxcms-top-offset says the same, which moves the editor bar under it.
   * Both go away with it.
   * @param {boolean} leaving the bar is being removed
   */
  _syncTopOffset(leaving = false) {
    const root = globalThis.document && globalThis.document.documentElement;
    if (!root) return;
    const frame = this.shadowRoot && this.shadowRoot.querySelector(".frame");
    if (this.demo && !leaving && frame) {
      const size = () => {
        const height = Math.ceil(frame.getBoundingClientRect().height);
        if (height > 0) {
          this.style.height = `${height}px`;
          root.style.setProperty("--haxcms-top-offset", `${height}px`);
          this._setOffset = true;
        }
      };
      if (!this._frameObserver && globalThis.ResizeObserver) {
        this._frameObserver = new globalThis.ResizeObserver(size);
        this._frameObserver.observe(frame);
      }
      size();
    } else {
      if (this._frameObserver) {
        this._frameObserver.disconnect();
        this._frameObserver = null;
      }
      if (this._setOffset) {
        root.style.removeProperty("--haxcms-top-offset");
        this.style.removeProperty("height");
        this._setOffset = false;
      }
    }
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    // an era the page asked for is his to keep: hovering does not undo it
    this._eraPinned = this.travelerEra !== "now";
    this._onHash();
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    if (changedProperties.has("demo")) {
      this._syncTopOffset();
    }
    if (
      changedProperties.has("travelerEra") &&
      this.travelerEra !== "now" &&
      !this._eras
    ) {
      this._loadEras();
    }
    if (changedProperties.has("installOpen")) {
      const dialog = this.shadowRoot.querySelector("dialog");
      if (this.installOpen && !dialog.open) {
        dialog.showModal();
      } else if (!this.installOpen && dialog.open) {
        dialog.close();
      }
    }
  }

  /**
   * The Future Traveler's eras load the first time he is touched, with their
   * styles, so a page that never touches him never downloads them.
   */
  async _loadEras() {
    if (!this._eras) {
      const eras = await import("./lib/hax-future-traveler.js");
      if (this.shadowRoot && eras.HaxFutureTravelerStyles.styleSheet) {
        this.shadowRoot.adoptedStyleSheets = [
          ...this.shadowRoot.adoptedStyleSheets,
          eras.HaxFutureTravelerStyles.styleSheet,
        ];
      }
      this._eras = eras;
    }
    return this._eras;
  }

  _nextEra() {
    const ids = this._eras.HAX_TRAVELER_ERAS.map((e) => e.id);
    return ids[(ids.indexOf(this.travelerEra) + 1) % ids.length];
  }

  /** tear from the era showing to another: the swap happens mid-glitch */
  _tearTo(era) {
    if (
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      this.travelerEra = era;
      return;
    }
    this._tearing = true;
    globalThis.setTimeout(() => {
      this.travelerEra = era;
    }, 150);
    globalThis.setTimeout(() => {
      this._tearing = false;
    }, 330);
  }

  /** hover or focus: he flips through every era he has been to */
  async _remixStart() {
    await this._loadEras();
    if (
      this._remixTimer ||
      (globalThis.matchMedia &&
        globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      return;
    }
    this._tearTo(this._nextEra());
    this._remixTimer = globalThis.setInterval(() => {
      this._tearTo(this._nextEra());
    }, 1200);
  }

  /** he goes back to today, unless a click chose the era he is in */
  _remixStop() {
    globalThis.clearInterval(this._remixTimer);
    this._remixTimer = null;
    if (!this._eraPinned && this.travelerEra !== "now") {
      this._tearTo("now");
    }
  }

  /** Click to remix: the next era, and he stays in it */
  async remix() {
    await this._loadEras();
    globalThis.clearInterval(this._remixTimer);
    this._remixTimer = null;
    const era = this._nextEra();
    this._eraPinned = era !== "now";
    this._tearTo(era);
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
    // the mini bar has no Merlin: the editor under it owns him and his shortcut
    if (this.mini || HaxNetworkBar._merlinReady || !e.shiftKey) return;
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

  /** Open or close the properties menu (narrow screens and touch) */
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  /**
   * Open Install HAX, on its first tab or on one way's.
   * @param {string} method browser, cli, nodejs, php, desktop or agent
   */
  openInstall(method = "") {
    this.menuOpen = false;
    this.installMethod = HAX_INSTALL_METHODS.some((m) => m.id === method)
      ? method
      : "";
    this.installOpen = true;
  }

  /** Show one way's tab, or the first when empty */
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
