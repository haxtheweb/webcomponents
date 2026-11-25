/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/rpg-character/rpg-character.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import {
  marketingTokens,
  safeLink,
} from "@haxtheweb/hax-marketing-theme/lib/hax-marketing-blocks.js";
import "@haxtheweb/hax-marketing-theme/lib/hax-story-link.js";

const LINK = {
  github: { icon: "mdi-social:github-circle", on: "github" },
  linkedin: { icon: "mdi-social:linkedin", on: "linkedin" },
  site: { icon: "hax:globe", on: "ownSite" },
};

/**
 * `hax-contributors`
 * `Everyone who built HAX, as the rpg-characters HAX gives every user`
 *
 * Reads a JSON file made from the HAX Lab roster and the code contributor
 * list. `show` picks the view: `landed` (people with a known next step),
 * `lab` (the whole HAX Lab roster, newest first) or `code` (everyone with a
 * commit). Hover or focus a card and the person's GitHub picture takes the
 * character's place, when they have one.
 *
 * @element hax-contributors
 */
class HaxContributors extends I18NMixin(DDD) {
  static get tag() {
    return "hax-contributors";
  }

  static get properties() {
    return {
      ...super.properties,
      source: { type: String },
      show: { type: String, reflect: true },
      /** most people to draw; 0 means all */
      limit: { type: Number },
      _data: { type: Object },
      _faces: { type: Object },
    };
  }

  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }

  constructor() {
    super();
    this.source = "files/contributors.json";
    this.show = "lab";
    this.limit = 0;
    this._data = null;
    this._faces = {};
    this.t = {
      loading: "Loading the people.",
      now: "Now:",
      personOn: "{name} on {place}",
      github: "GitHub",
      linkedin: "LinkedIn",
      ownSite: "their own site",
      commit: "commit",
      commits: "commits",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("../locales/hax-contributors.en.json", import.meta.url).href +
        "/../",
    });
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    fetch(new URL(this.source, globalThis.document.baseURI))
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        if (json && Array.isArray(json.lab)) {
          this._data = json;
        }
      })
      .catch(() => {});
  }

  static get styles() {
    return [
      super.styles,
      marketingTokens,
      css`
        :host {
          display: block;
          margin: var(--ddd-spacing-6) var(--ddd-spacing-0);
        }
        ul {
          list-style: none;
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          display: grid;
          gap: var(--ddd-spacing-3);
          grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
          justify-content: center;
        }
        :host([show="landed"]) ul {
          grid-template-columns: repeat(auto-fit, minmax(220px, 280px));
          gap: var(--ddd-spacing-5);
        }
        :host([show="code"]) ul {
          grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
          gap: var(--ddd-spacing-2);
        }
        li {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--ddd-spacing-1);
          border: var(--ddd-border-size-md) solid var(--hm-edge, var(--hm-ink));
          border-radius: var(--ddd-radius-md);
          background-color: var(--hm-surface);
          padding: var(--ddd-spacing-3);
        }
        :host([show="landed"]) li {
          box-shadow: var(--ddd-spacing-2) var(--ddd-spacing-2)
            var(--ddd-spacing-0)
            var(--hm-shade, var(--ddd-theme-default-keystoneYellow));
          padding: var(--ddd-spacing-4);
        }
        :host([show="code"]) li {
          padding: var(--ddd-spacing-2) var(--ddd-spacing-1);
          border-width: var(--ddd-border-size-sm);
          gap: 0;
        }
        .face {
          position: relative;
          background-color: var(--hm-soft);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2)
            var(--ddd-spacing-0);
          line-height: 0;
          overflow: hidden;
        }
        .face img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        li:hover .face img,
        li:focus-within .face img {
          opacity: 1;
        }
        strong {
          display: block;
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-120);
          overflow-wrap: anywhere;
        }
        :host([show="landed"]) strong {
          font-size: var(--ddd-font-size-xxs);
        }
        .what,
        .when {
          display: block;
          font-size: var(--ddd-font-size-5xs);
          line-height: var(--ddd-lh-120);
        }
        .when {
          font-style: italic;
        }
        .now {
          display: inline-block;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-120);
          color: var(--hm-on-brand, var(--hm-surface));
          background-color: var(--hm-brand, var(--hm-ink));
          border-radius: var(--ddd-radius-xs);
        }
        .work {
          flex: 1 1 auto;
        }
        .links {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-1);
          margin-top: var(--ddd-spacing-1);
        }
        .links a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: var(--ddd-spacing-8);
          height: var(--ddd-spacing-8);
          color: inherit;
          border-radius: 50%;
        }
        .links a:hover {
          color: var(--hm-surface);
          background-color: var(--hm-ink);
        }
        simple-icon-lite {
          --simple-icon-height: var(--ddd-icon-xxs);
          --simple-icon-width: var(--ddd-icon-xxs);
        }
        a.login {
          display: inline-block;
          color: inherit;
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-120);
          overflow-wrap: anywhere;
          min-height: var(--ddd-spacing-6);
          padding-top: var(--ddd-spacing-1);
          box-sizing: border-box;
        }
        /* the whole card of someone with a commit opens their GitHub */
        li.coder {
          position: relative;
        }
        li.coder a.login::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
        }
        li.coder:hover {
          border-color: var(--hm-brand, currentColor);
          box-shadow: var(--ddd-spacing-1) var(--ddd-spacing-1)
            var(--ddd-spacing-0) var(--hm-shade, currentColor);
        }
        a:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
      `,
    ];
  }

  // the GitHub picture is an extra: fetched the first time a card is
  // hovered or focused, and simply not shown if it cannot load
  _face(login, photo) {
    const key = login || photo;
    if (!key || this._faces[key] !== undefined) {
      return;
    }
    this._faces = { ...this._faces, [key]: false };
    const github = login
      ? `https://github.com/${encodeURIComponent(login)}.png?size=160`
      : "";
    // a person's own photo first (the one they use on LinkedIn, say), then
    // their GitHub picture
    const sources = [safeLink(photo), github].filter((src) => src);
    const load = () => {
      if (!sources.length) {
        return;
      }
      const image = new globalThis.Image();
      image.onload = () => {
        this._faces = { ...this._faces, [key]: image.src };
      };
      image.onerror = load;
      image.src = sources.shift();
    };
    load();
  }

  _person(person) {
    const links = (person.links || []).filter(
      (link) => LINK[link.kind] && safeLink(link.url),
    );
    const size = this.show === "landed" ? [112, 90] : [78, 62];
    return html`
      <li
        @pointerenter="${() => this._face(person.github, person.photo)}"
        @focusin="${() => this._face(person.github, person.photo)}"
      >
        <div class="face" aria-hidden="true">
          <rpg-character
            seed="${person.name}"
            height="${size[0]}"
            width="${size[1]}"
          ></rpg-character>
          ${
            this._faces[person.github || person.photo]
              ? html`<img
                  src="${this._faces[person.github || person.photo]}"
                  alt=""
                />`
              : ``
          }
        </div>
        <strong>${person.name}</strong>
        ${
          person.landed
            ? html`<span class="now"
                >${this.t.now}
                ${person.landed.role ? `${person.landed.role}, ` : ``}${
                  person.landed.org
                }</span
              >`
            : ``
        }
        <div class="work">
          ${person.work.map(
            (work) =>
              html`<span class="what">${work.what}</span
                ><span class="when">${work.when}</span>`,
          )}
        </div>
        <div class="links">
          ${links.map(
            (link) =>
              html`<a
                href="${link.url}"
                aria-label="${this.t.personOn
                  .replace("{name}", person.name)
                  .replace("{place}", this.t[LINK[link.kind].on])}"
                title="${this.t[LINK[link.kind].on]}"
                ><simple-icon-lite
                  icon="${LINK[link.kind].icon}"
                  aria-hidden="true"
                ></simple-icon-lite
              ></a>`,
          )}
          ${
            person.story
              ? html`<hax-story-link
                  compact
                  story="${person.story}"
                  about="${person.name}"
                ></hax-story-link>`
              : ``
          }
        </div>
      </li>
    `;
  }

  _coder(coder) {
    return html`
      <li
        class="coder"
        @pointerenter="${() => this._face(coder.login)}"
        @focusin="${() => this._face(coder.login)}"
      >
        <div class="face" aria-hidden="true">
          <rpg-character
            seed="${coder.login}"
            height="52"
            width="42"
          ></rpg-character>
          ${
            this._faces[coder.login]
              ? html`<img src="${this._faces[coder.login]}" alt="" />`
              : ``
          }
        </div>
        <a
          class="login"
          href="https://github.com/${encodeURIComponent(coder.login)}"
          >${coder.login}</a
        >
        <span class="when"
          >${coder.commits}
          ${coder.commits === 1 ? this.t.commit : this.t.commits}</span
        >
      </li>
    `;
  }

  render() {
    if (!this._data) {
      return html`<p>${this.t.loading}</p>`;
    }
    const cut = (list) => (this.limit > 0 ? list.slice(0, this.limit) : list);
    if (this.show === "code") {
      return html`<ul>
        ${cut(this._data.code || []).map((coder) => this._coder(coder))}
      </ul>`;
    }
    const people =
      this.show === "landed"
        ? this._data.lab.filter((person) => person.landed)
        : this._data.lab;
    return html`<ul>
      ${cut(people).map((person) => this._person(person))}
    </ul>`;
  }
}
globalThis.customElements.define(HaxContributors.tag, HaxContributors);
export { HaxContributors };
