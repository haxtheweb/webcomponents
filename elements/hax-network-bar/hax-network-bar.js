/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  merlinTraveler,
  MerlinWandStyles,
} from "@haxtheweb/super-daemon/lib/super-daemon-hax-ui.js";

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
  {
    id: "demo",
    label: "demo",
    href: "https://webcomponents.hax.cloud/elements/haxcms-elements/demo/index.html",
  },
  { id: "rpg", label: "rpg", href: "https://rpg-me.hax.cloud" },
  { id: "docs", label: "docs", href: "https://haxtheweb.org" },
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
    icon: "hax:git",
  },
];

/**
 * `hax-network-bar`
 * The thin strip across the top of every hax.cloud site (hax.cloud, the
 * element portfolio, the live demo, RPG me) that links them as one network
 * and marks the one you are on. Each site keeps its own header under it.
 *
 * Merlin sits in the strip too: it opens HAX's command palette with every
 * place in the network to jump to. Merlin loads the first time it is opened,
 * so a page that never asks for it never downloads it. A page can add its
 * own places: listen for `hax-network-merlin` and call `detail.add(option)`
 * with `{title, href, about, icon, tags}` (hax.cloud adds every web and tour).
 *
 * @demo demo/index.html
 * @element hax-network-bar
 * @fires hax-network-merlin - {merlin, add(option)} the first time Merlin opens
 */
export class HaxNetworkBar extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "hax-network-bar";
  }

  constructor() {
    super();
    this.current = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      network: "HAX network",
      cloud: "hax.cloud",
      elements: "Elements",
      demo: "Live demo",
      rpg: "RPG me",
      docs: "Docs",
      github: "GitHub",
      merlin: "Merlin",
      merlinHint: "Jump anywhere",
      merlinWhere: " in the HAX network",
      networkPath: "HAX network",
      goCloud: "hax.cloud: the HAX ecosystem web",
      goCloudAbout:
        "Every part of HAX and everyone who builds it, in one interactive web.",
      goTours: "Tours of the ecosystem",
      goToursAbout:
        "Step-by-step walks through the web for faculty, students, developers and more.",
      goElements: "Elements: every HAX web component",
      goElementsAbout: "Browse, search and try the elements HAX authors with.",
      goDemo: "Live demo: try the HAX editor",
      goDemoAbout: "Edit a HAX site in your browser, nothing to install.",
      goRpg: "RPG me: make your character",
      goRpgAbout: "Design the character that stands for you across HAX.",
      goDocs: "Docs: learn HAX",
      goDocsAbout: "Guides, tutorials and the documentation for HAX.",
      goGithub: "GitHub: the code",
      goGithubAbout: "Every HAX repository, issue and pull request.",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Which site this is: cloud, elements, demo, rpg or docs.
       */
      current: { type: String, reflect: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      MerlinWandStyles,
      css`
        :host {
          display: block;
          background-color: var(--ddd-theme-default-potentialMidnight);
          border-bottom: var(--ddd-border-xs);
          border-bottom-color: var(--ddd-theme-default-beaverBlue);
          color: var(--ddd-theme-default-white);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          color-scheme: dark;
        }
        nav {
          display: flex;
          align-items: center;
          gap: 0 var(--ddd-spacing-6);
          max-width: var(--hax-network-bar-max-width, 1440px);
          min-height: var(--ddd-spacing-11);
          margin: 0 auto;
          padding: 0 var(--hax-network-bar-gutter, var(--ddd-spacing-8));
          white-space: nowrap;
        }
        .label {
          color: var(--ddd-theme-default-pughBlue);
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-4xs);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .sites {
          display: flex;
          flex: 0 1 auto;
          gap: 0 var(--ddd-spacing-6);
          min-width: 0;
          overflow-x: auto;
        }
        nav .sites a,
        nav a.end {
          display: inline-block;
          padding: var(--ddd-spacing-2) 0;
          border-bottom: var(--ddd-border-size-md) solid transparent;
          color: var(--ddd-theme-default-white);
          font-weight: var(--ddd-font-weight-regular);
          text-decoration: none;
        }
        nav .sites a:hover,
        nav a.end:hover {
          border-bottom-color: var(--ddd-theme-default-pughBlue);
        }
        nav .sites a[aria-current="page"] {
          font-weight: var(--ddd-font-weight-bold);
          border-bottom-color: var(--ddd-theme-default-keystoneYellow);
        }
        nav a:focus-visible,
        .merlin:focus-visible {
          outline: var(--ddd-border-size-md) solid
            var(--ddd-theme-default-linkLight);
          outline-offset: var(--ddd-spacing-1);
        }
        /* Merlin: the same dark field the HAX top bar opens him from, with
           the Future Traveler at its start */
        .merlin {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          flex: none;
          margin-inline-start: auto;
          min-height: var(--ddd-spacing-8);
          padding: 0 var(--ddd-spacing-4) 0 var(--ddd-spacing-2);
          border: var(--ddd-border-xs);
          border-color: var(--ddd-theme-default-slateGray);
          border-radius: var(--ddd-radius-rounded);
          background-color: var(--ddd-theme-default-coalyGray);
          color: var(--ddd-theme-default-white);
          font: inherit;
          cursor: pointer;
          --merlin-traveler-size: var(--ddd-icon-3xs, 20px);
        }
        .merlin:hover {
          border-color: var(--ddd-theme-default-pughBlue);
        }
        .merlin .name {
          font-weight: var(--ddd-font-weight-bold);
        }
        .merlin .hint {
          color: var(--ddd-theme-default-limestoneLight);
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
        @media (max-width: 767px) {
          nav {
            gap: 0 var(--ddd-spacing-4);
            padding: 0 var(--ddd-spacing-4);
          }
          .label,
          .merlin .hint {
            display: none;
          }
        }
        /* on the narrowest screens Merlin takes a row of his own, so the
           links never run under him */
        @media (max-width: 479px) {
          nav {
            flex-wrap: wrap;
            padding-block: var(--ddd-spacing-1) var(--ddd-spacing-2);
          }
          .sites {
            flex: 1 1 100%;
          }
          nav a.end {
            display: none;
          }
        }
        @media (forced-colors: active) {
          .merlin {
            border-color: ButtonText;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <nav aria-label="${this.t.network}">
        <span class="label" aria-hidden="true">${this.t.network}</span>
        <div class="sites">
          ${HAX_NETWORK_SITES.map(
            (s) =>
              html`<a
                href="${s.href}"
                aria-current="${s.id === this.current ? "page" : "false"}"
                >${this.t[s.label]}</a
              >`,
          )}
        </div>
        <button
          class="merlin merlin-wand-host"
          type="button"
          aria-haspopup="dialog"
          @click="${this.openMerlin}"
        >
          ${merlinTraveler()}<span class="name">${this.t.merlin}</span>
          <span class="hint">${this.t.merlinHint}</span
          ><span class="sr-only">${this.t.merlinWhere}</span>
        </button>
        <a class="end" href="https://github.com/haxtheweb">${this.t.github}</a>
      </nav>
    `;
  }

  /**
   * Open Merlin with the network's places. The first time, Merlin loads, the
   * places are added and the page is asked (hax-network-merlin) for its own.
   */
  async openMerlin() {
    const merlin = await HaxNetworkBar.loadMerlin();
    if (!merlin) return;
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
