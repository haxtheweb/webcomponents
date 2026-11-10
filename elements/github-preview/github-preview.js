/**
 * Copyright 2021
 * @license MIT, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";

// fill {key} placeholders in a translated string
const fill = (str, values) =>
  String(str).replace(/\{([a-zA-Z]+)\}/g, (m, k) =>
    Object.prototype.hasOwnProperty.call(values, k) ? String(values[k]) : m,
  );

/**
 * `github-preview`
 * `A simple element that displays information about a github repository.`
 *
 * A DDD block: GitHub chip, "GitHub · Repository" label, "org / repo"
 * title and an open-on-GitHub header action; the description in the body
 * (and the README in extended mode); language, stars and forks in the
 * footer. Fluid up to its column; the --github-preview-* properties still
 * override the defaults.
 *
 * @demo demo/index.html
 * @element github-preview
 */
class GithubPreview extends I18NMixin(
  IntersectionObserverMixin(DDDSuper(LitElement)),
) {
  static get properties() {
    let props = {};
    if (super.properties) {
      props = super.properties;
    }
    return {
      ...props,
      // The target repository
      repo: {
        type: String,
      },
      // The target github organization or user
      org: {
        type: String,
      },
      // data from the github api, short summary of the repository
      __description: {
        type: String,
      },
      // The most used language in the repository, this gets fetched from the github api
      repoLang: {
        type: String,
        attribute: "repo-lang",
        reflect: true,
      },
      // amount of stars a repository has, this is fetched from the github api
      __stars: {
        type: Number,
      },
      // amount of forks a repository has, this is fetched from the github api
      __forks: {
        type: Number,
      },
      // used for error handling in api calls
      __assetAvailable: {
        type: Boolean,
      },
      // a request really failed (not just still loading)
      __failed: {
        type: Boolean,
      },
      // allows for an extended card that previews the repository readme
      extended: {
        type: Boolean,
        reflect: true,
      },
      // used for enabling a scrollable readme
      readmeExtended: {
        type: Boolean,
        attribute: "readme-extended",
        reflect: true,
      },
      // headers for advanced cache handling to reduce calls to the API
      headers: {
        type: Object,
      },
      viewMoreText: {
        type: String,
        attribute: "view-more-text",
      },
      notFoundText: {
        type: String,
        attribute: "not-found-text",
      },
      // raw readme text from github api
      __readmeText: {
        type: String,
      },
      branch: {
        type: String,
      },
      url: {
        type: String,
      },
      apiUrl: {
        type: String,
        attribute: "api-url",
      },
      rawUrl: {
        type: String,
        attribute: "raw-url",
      },
      readMe: {
        type: String,
        attribute: "read-me",
      },
    };
  }

  static get styles() {
    return [
      super.styles,
      DDDBlockStyles,
      css`
        :host {
          display: block;
          max-width: 100%;
        }

        :host([hidden]) {
          display: none;
        }

        :host([repo-lang="JavaScript"]) .lang-circle {
          background-color: #f1e05a;
        }

        :host([repo-lang="C"]) .lang-circle {
          background-color: #555555;
        }

        :host([repo-lang="C#"]) .lang-circle {
          background-color: #178600;
        }

        :host([repo-lang="C++"]) .lang-circle {
          background-color: #f34b7d;
        }

        :host([repo-lang="CSS"]) .lang-circle {
          background-color: #563d7c;
        }

        :host([repo-lang="Dart"]) .lang-circle {
          background-color: #00b4ab;
        }

        :host([repo-lang="Go"]) .lang-circle {
          background-color: #00add8;
        }

        :host([repo-lang="Java"]) .lang-circle {
          background-color: #b07219;
        }

        :host([repo-lang="Kotlin"]) .lang-circle {
          background-color: #f18e33;
        }

        :host([repo-lang="Markdown"]) .lang-circle {
          background-color: #083fa1;
        }

        :host([repo-lang="Python"]) .lang-circle {
          background-color: #3572a5;
        }

        :host([repo-lang="Sass"]) .lang-circle {
          background-color: #a53b70;
        }

        :host([repo-lang="Scala"]) .lang-circle {
          background-color: #c22d40;
        }

        :host([repo-lang="SCSS"]) .lang-circle {
          background-color: #c6538c;
        }

        :host([repo-lang="Rust"]) .lang-circle {
          background-color: #dea584;
        }

        :host([repo-lang="Swift"]) .lang-circle {
          background-color: #ffac45;
        }

        :host([repo-lang="TypeScript"]) .lang-circle {
          background-color: #2b7489;
        }

        :host([repo-lang="Vue"]) .lang-circle {
          background-color: #2c3e50;
        }

        :host([repo-lang="PHP"]) .lang-circle {
          background-color: #4f5d95;
        }

        :host([repo-lang="HTML"]) .lang-circle {
          background-color: #e34c26;
        }

        :host([repo-lang="Lua"]) .lang-circle {
          background-color: #000080;
        }

        .ddd-block {
          width: var(--github-preview-container-width, 100%);
          max-width: 100%;
          padding: var(--github-preview-container-padding, 0);
          border-radius: var(
            --github-preview-container-border-radius,
            var(--ddd-radius-md)
          );
          --ddd-block-background: var(--github-preview-bg-color, transparent);
          color: var(--github-preview-div-text-color, inherit);
        }
        .ddd-block[aria-busy="true"] {
          --ddd-block-chip-background: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            color-mix(
              in srgb,
              var(--ddd-theme-default-slateGray) 22%,
              var(--ddd-theme-default-potentialMidnight)
            )
          );
          --ddd-block-chip-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        .ddd-block-title {
          font-size: var(
            --github-preview-header-font-size,
            var(--ddd-font-size-xs)
          );
        }
        .ddd-block-title a {
          color: var(--github-preview-link-text-color, inherit);
          text-decoration: none;
        }
        /* no size jump on hover unless a hover size is set */
        .ddd-block-title a:hover {
          text-decoration: underline;
          font-size: var(--github-preview-header-hover-font-size, inherit);
        }
        .ddd-block-title a:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .ddd-block-body {
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
        }
        .description,
        .message {
          margin: var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
          overflow-wrap: anywhere;
        }
        .skeleton {
          display: block;
          height: var(--ddd-spacing-2);
          width: 80%;
          border-radius: var(--ddd-radius-sm);
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            color-mix(
              in srgb,
              var(--ddd-theme-default-slateGray) 22%,
              var(--ddd-theme-default-potentialMidnight)
            )
          );
        }
        .skeleton + .skeleton {
          width: 55%;
          margin-top: var(--ddd-spacing-2);
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          margin: -1px;
          padding: var(--ddd-spacing-0);
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
          border: 0;
        }
        .readme-container {
          margin-top: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-3);
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-sm);
          overflow-y: hidden;
          overflow-x: hidden;
          max-height: var(--github-preview-readme-container-max-height, 300px);
        }
        :host([readme-extended]) .readme-container {
          overflow-y: auto;
        }
        .readme-btn-container {
          display: flex;
          margin-top: var(--ddd-spacing-3);
        }
        .stats-container {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-4);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
          --simple-icon-color: currentColor;
        }
        .stat {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
        }
        .lang-circle {
          height: var(--ddd-spacing-3);
          width: var(--ddd-spacing-3);
          flex: none;
          background-color: var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-circle);
          box-shadow: inset 0 0 0 1px
            color-mix(
              in srgb,
              var(--ddd-theme-default-coalyGray) 25%,
              transparent
            );
        }
      `,
    ];
  }

  static get haxProperties() {
    return {
      canScale: false,
      // element ships its own styling (github language colors) and does not
      // consume DDD design tokens
      designSystem: false,

      canEditSource: true,
      gizmo: {
        title: "Github Preview",
        description:
          "Preview a GitHub repository: description, language, stars and forks.",
        icon: "mdi-social:github-circle",
        color: "grey",
        tags: ["Other", "git", "code", "github", "repo", "organization"],
        handles: [
          {
            type: "github",
            type_exclusive: true,
            repo: "repo",
            org: "org",
          },
        ],
        meta: {
          author: "collinkleest",
          owner: "The Pennsylvania State University",
        },
      },
      settings: {
        configure: [
          {
            property: "org",
            title: "Organization",
            description: "Github organization machine name",
            inputMethod: "textfield",
          },
          {
            property: "repo",
            title: "Repository",
            description: "Repo machine name",
            inputMethod: "textfield",
          },
          {
            property: "extended",
            title: "Extended View",
            description: "Includes readme in element",
            inputMethod: "boolean",
          },
        ],
        advanced: [],
      },
      demoSchema: [
        {
          tag: "github-preview",
          properties: {
            org: "haxtheweb",
            repo: "webcomponents",
          },
          content: "",
        },
      ],
    };
  }

  get haxAppDetails() {
    return {
      details: {
        title: "Github",
        icon: "mdi-social:github-circle",
        color: "grey",
        description: "Preview a github repository.",
        status: "available",
        tags: ["Other", "git", "code", "github", "repo", "organization"],
      },
      connection: {
        protocol: "https",
        url: "api.github.com",
        data: {
          format: "json",
          origin: "*",
        },
        operations: {
          browse: {
            method: "GET",
            endPoint: "search/repositories",
            pagination: {
              style: "offset",
            },
            search: {
              q: {
                title: "Search",
                type: "string",
              },
            },
            data: {},
            resultMap: {
              image:
                "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
              defaultGizmoType: "github",
              items: "items",
              preview: {
                title: "name",
                details: "description",
                id: "id",
              },
              gizmo: {
                id: "id",
                repo: "name",
                org: "owner.login",
              },
            },
          },
        },
      },
    };
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "github-preview";
  }

  /**
   * Data arrived and the card can show it
   */
  get ready() {
    return Boolean(this.__assetAvailable && this.elementVisible);
  }

  _stats() {
    return html`<div class="ddd-block-footer stats-container">
      <span class="stat">
        <span class="lang-circle" part="github-preview-lang-circle"></span>
        <span class="stats-text">${this.repoLang}</span>
      </span>
      <span class="stat">
        <simple-icon-lite
          icon="star-border"
          aria-hidden="true"
        ></simple-icon-lite>
        <span class="stats-text">${this.__stars} ${this.t.stars}</span>
      </span>
      <span class="stat">
        <simple-icon-lite
          icon="communication:call-split"
          aria-hidden="true"
        ></simple-icon-lite>
        <span class="stats-text">${this.__forks} ${this.t.forks}</span>
      </span>
    </div>`;
  }

  _title() {
    if (this.ready && this.extended) {
      return html`<a
          href="${this.url}/${this.org}"
          target="_blank"
          rel="noopener noreferrer"
          @click="${this._clickLink}"
          >${this.org}</a
        >
        /
        <a
          href="${this.url}/${this.org}/${this.repo}"
          target="_blank"
          rel="noopener noreferrer"
          @click="${this._clickLink}"
          >${this.repo}</a
        >`;
    }
    if (!this.org && !this.repo) {
      return "";
    }
    return `${this.org || ""} / ${this.repo || ""}`;
  }

  _body() {
    if (this.ready) {
      return html`<p class="description">${this.__description}</p>
        ${
          this.extended
            ? html`<div
                  class="readme-container"
                  tabindex="${this.readmeExtended ? "0" : "-1"}"
                >
                  <wc-markdown>
                    <script type="wc-content">
                      ${this.__readmeText}
                    </script>
                  </wc-markdown>
                </div>
                ${
                  this.readmeExtended
                    ? nothing
                    : html`<div class="readme-btn-container">
                        <button
                          type="button"
                          @click=${this.readmeViewMoreHandler}
                          class="readme-btn ddd-block-action has-text"
                        >
                          ${this.viewMoreText}
                        </button>
                      </div>`
                }`
            : nothing
        }`;
    }
    if (this.__failed) {
      return html`<p class="message" role="status">${this.notFoundText}</p>`;
    }
    return html`<span class="skeleton" aria-hidden="true"></span
      ><span class="skeleton" aria-hidden="true"></span
      ><span class="sr-only" role="status">${this.t.loading}</span>`;
  }

  render() {
    const ready = this.ready;
    const loading = !ready && !this.__failed;
    const openLabel = fill(this.t.openOnGitHub, {
      org: this.org,
      repo: this.repo,
    });
    return html`
      <div
        class="ddd-block container"
        role="group"
        aria-labelledby="hdr"
        aria-busy="${loading ? "true" : "false"}"
      >
        ${renderDDDBlockHeader({
          id: "hdr",
          icon: "mdi-social:github-circle",
          label: `${this.t.github} · ${this.t.repository}`,
          title: this._title(),
          actions:
            ready && !this.extended
              ? html`<a
                  class="ddd-block-action open-link"
                  href="${this.url}/${this.org}/${this.repo}"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="${openLabel}"
                  title="${openLabel}"
                  @click="${this._clickLink}"
                  ><simple-icon-lite
                    icon="icons:open-in-new"
                    aria-hidden="true"
                  ></simple-icon-lite
                ></a>`
              : nothing,
        })}
        <div class="ddd-block-body">${this._body()}</div>
        ${ready ? this._stats() : nothing}
      </div>
    `;
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.url = "https://github.com";
    this.apiUrl = "https://api.github.com";
    this.rawUrl = "https://raw.githubusercontent.com";
    this.extended = false;
    this.readMe = "README.md";
    this.branch = "master";
    this.__failed = false;
    this.headers = {
      cache: "force-cache",
    };
    this.t = {
      github: "GitHub",
      repository: "Repository",
      stars: "stars",
      forks: "forks",
      loading: "Loading",
      viewMore: "View More",
      notFound: "Asset not found",
      openOnGitHub: "Open {org}/{repo} on GitHub",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
    });
    // translated defaults; view-more-text / not-found-text still win
    this.i18nDefault("viewMoreText", "viewMore");
    this.i18nDefault("notFoundText", "notFound");
  }

  /*
   * If element is in extended form, fetch repo readme text and repo information
   * If element is not in extended form just fetch the repo information for the smaller card
   */
  fetchGithubData(
    repo,
    org,
    headers,
    branch,
    rawUrl,
    apiUrl,
    readMe,
    extended,
  ) {
    if (extended) {
      fetch(`${rawUrl}/${org}/${repo}/${branch}/${readMe}`, headers)
        .then((response) => {
          if (response.ok) {
            return response.text();
          }
        })
        .then((responseText) => {
          // don't re-render markdown if it's the same text
          if (this.__readmeText !== responseText) {
            this.__readmeText = responseText;
            // if we don't have wc-markdown instance yet don't re-render wc-markdown
            if (this.wcmarkdown) {
              this.wcmarkdown.value = this.__readmeText;
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    this.__failed = false;
    fetch(`${apiUrl}/repos/${org}/${repo}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        // a real failure (404, rate limit): say so instead of loading on
        this.__assetAvailable = false;
        this.__failed = true;
      })
      .then((json) => {
        this.handleResponse(json);
      })
      .catch((_error) => {
        this.__assetAvailable = false;
        this.__failed = true;
      });
  }

  /*
   * enables overflow-y property by setting readmeExtended to true
   * removes 'show more' button from the dom
   */
  readmeViewMoreHandler(_event) {
    this.readmeExtended = true;
  }

  /*
   * Takes fetched repo information and element properties
   */
  handleResponse(response) {
    if (response) {
      this.__assetAvailable = true;
      this.__description = response.description;
      this.repoLang = response.language;
      this.__stars = response.stargazers_count;
      this.__forks = response.forks;
    }
  }

  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
      gizmoRegistration: "haxgizmoRegistration",
    };
  }

  haxgizmoRegistration(store) {
    store.validGizmoTypes.push("github");
    if (
      store.appList.filter((el, _i) => {
        // ensure we don't double load the endpoint if already defined
        if (el.connection.url === "api.github.com") {
          return true;
        }
        return false;
      }).length === 0
    ) {
      globalThis.dispatchEvent(
        new CustomEvent("hax-register-app", {
          bubbles: false,
          composed: false,
          cancelable: false,
          detail: this.haxAppDetails,
        }),
      );
    }
  }

  haxactiveElementChanged(element, value) {
    if (value) {
      this._haxstate = value;
    }
  }

  haxeditModeChanged(value) {
    this._haxstate = value;
  }

  _clickLink(event) {
    if (this._haxstate) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }
  }

  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    if (!this.repo || !this.org || !this.url) {
      this.__assetAvailable = false;
      this.__failed = true;
    }
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // only make the fetch after we get everything setup; gate on repo and
      // org actually being set so an unconfigured element never fires a
      // request for .../repos/undefined/undefined on mount
      if (
        [
          "repo",
          "org",
          "headers",
          "branch",
          "rawUrl",
          "apiUrl",
          "readMe",
          "extended",
        ].includes(propName) &&
        this[propName] &&
        this.repo &&
        this.org
      ) {
        clearTimeout(this.__debounce);
        this.__debounce = setTimeout(() => {
          this.fetchGithubData(
            this.repo,
            this.org,
            this.headers,
            this.branch,
            this.rawUrl,
            this.apiUrl,
            this.readMe,
            this.extended,
          );
        }, 0);
      }
      // if extended is set them import wc-markdown
      if (this.extended && propName === "extended") {
        import("./lib/wc-markdown.js");
      }
      // if visible and extended get wc-markdown element for re-rendering;
      // also re-lookup once the fetched data settles because the intersection
      // observer can flip elementVisible before the debounced fetch resolves,
      // which renders the not-found branch and leaves no wc-markdown to find
      if (
        this.elementVisible &&
        this.extended &&
        (propName === "elementVisible" ||
          propName === "__assetAvailable" ||
          propName === "__readmeText")
      ) {
        this.wcmarkdown = this.shadowRoot.querySelector(
          ".readme-container wc-markdown",
        );
      }
    });
  }
}

globalThis.customElements.define(GithubPreview.tag, GithubPreview);
export { GithubPreview };
