/**
 * Copyright 2021
 * @license MIT, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import { IntersectionObserverMixin } from "@lrnwebcomponents/intersection-element/lib/IntersectionObserverMixin.js";
/**
 * `github-preview`
 * `A simple element that displays information about a github repository.`
 * @demo demo/index.html
 * @element github-preview
 */
class GithubPreview extends IntersectionObserverMixin(LitElement) {
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
      css`
        :host {
          display: inline-flex;
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

        a {
          display: inline-flex;
          text-decoration: none;
          color: var(--github-preview-link-text-color, white);
        }

        :host([extended]) .container {
          width: var(--github-preview-container-width, 800px);
          padding: var(--github-preview-container-padding, 10px);
        }

        .container {
          background-color: var(--github-preview-bg-color, black);
          border-radius: var(--github-preview-container-border-radius, 10px);
          width: var(--github-preview-container-width, 400px);
          padding: var(--github-preview-container-padding, 5px);
        }

        .header-container {
          display: flex;
          align-items: center;
        }

        .header-container div {
          margin-left: 10px;
          font-size: var(--github-preview-header-font-size, 22px);
          font-weight: bold;
        }

        .header-container div a:hover {
          font-size: var(--github-preview-header-hover-font-size, 24px);
        }

        .stats-container {
          display: flex;
          align-items: center;
        }

        .lang-circle {
          height: 15px;
          width: 15px;
          background-color: grey;
          border-radius: 50%;
          margin: 0px 5px 0px 5px;
        }

        div {
          color: var(--github-preview-div-text-color, white);
        }

        .description {
          padding: 8px 0px 8px 0px;
        }

        .stats-text {
          margin: 0px 5px 0px 5px;
        }

        :host([readme-extended]) .readme-container {
          overflow-y: scroll;
        }

        .readme-container {
          overflow-y: hidden;
          overflow-x: hidden;
          max-height: var(--github-preview-readme-container-max-height, 300px);
        }

        .readme-btn {
          display: inline-block;
          padding: 0.3em 2em;
          border-radius: 2em;
          box-sizing: border-box;
          text-align: center;
        }

        .readme-btn-container {
          display: flex;
          justify-content: center;
        }
      `,
    ];
  }

  static get haxProperties() {
    return {
      canScale: false,
      canPosition: false,
      canEditSource: true,
      gizmo: {
        title: "Github Preview",
        description: "Accessible figure with long description",
        icon: "mdi-social:github-circle",
        color: "grey",
        groups: ["developer", "code"],
        handles: [],
        meta: {
          author: "collinkleest",
          owner: "ELMS:LN",
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
        ],
        advanced: [],
      },
      demoSchema: [
        {
          tag: "github-preview",
          properties: {
            org: "elmsln",
            repo: "lrnwebcomponents",
          },
          content: "",
        },
      ],
    };
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "github-preview";
  }

  render() {
    return this.__assetAvailable && this.elementVisible
      ? this.extended
        ? html`
            <div class="container">
              <div class="header-container">
                <simple-icon-lite icon="book"></simple-icon-lite>
                <div>
                  <a
                    href="${this.url}/${this.org}"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ${this.org}
                  </a>
                  /
                  <a
                    href="${this.url}/${this.org}/${this.repo}"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ${this.repo}
                  </a>
                </div>
              </div>
              <hr />
              <div>${this.__description}</div>
              <hr />
              <div class="readme-container">
                <wc-markdown>
                  <script type="wc-content">
                    ${this.__readmeText}
                  </script>
                </wc-markdown>
              </div>
              <div class="readme-btn-container">
                <button @click=${this.readmeViewMoreHandler} class="readme-btn">
                  ${this.viewMoreText}
                </button>
              </div>
              <div class="stats-container">
                <span
                  class="lang-circle"
                  part="github-preview-lang-circle"
                ></span>
                <div class="stats-text">${this.repoLang}</div>
                <simple-icon-lite icon="star"></simple-icon-lite>
                <div class="stats-text">${this.__stars}</div>
                <simple-icon-lite icon="social:share"></simple-icon-lite>
                <div class="stats-text">${this.__forks}</div>
              </div>
            </div>
          `
        : html`
            <a
              href="${this.url}/${this.org}/${this.repo}"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div class="container">
                <div class="header-container">
                  <simple-icon-lite icon="book"></simple-icon-lite>
                  <div>${this.repo}</div>
                </div>

                <div class="description">${this.__description}</div>

                <div class="stats-container">
                  <span class="lang-circle"></span>
                  <div class="stats-text">${this.repoLang}</div>
                  <simple-icon-lite icon="star"></simple-icon-lite>
                  <div class="stats-text">${this.__stars}</div>
                  <simple-icon-lite icon="social:share"></simple-icon-lite>
                  <div class="stats-text">${this.__forks}</div>
                </div>
              </div>
            </a>
          `
      : html`
          <div class="container">
            <h1>${this.notFoundText}</h1>
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
    this.viewMoreText = "View More";
    this.notFoundText = "Asset not found";
    this.headers = {
      cache: "force-cache",
    };
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
    extended
  ) {
    if (extended) {
      fetch(`${rawUrl}/${org}/${repo}/${branch}/${readMe}`, headers)
        .then((response) => {
          if (response.ok) {
            return response.text();
          }
        })
        .then((responseText) => {
          this.__readmeText = responseText;
        })
        .catch((error) => {
          console.error(error);
        });
    }
    fetch(`${apiUrl}/repos/${org}/${repo}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((json) => {
        this.handleResponse(json);
      })
      .catch((error) => {
        this.__assetAvailable = false;
        console.error(error);
      });
  }

  /*
   * enables overflow-y property by setting readmeExtended to true
   * removes 'show more' button from the dom
   */
  readmeViewMoreHandler(event) {
    this.readmeExtended = true;
    this.shadowRoot.querySelector(".readme-btn").remove();
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

  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    if (!this.repo || !this.org || !this.url) {
      this.__assetAvailable = false;
    }
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // only make the fetch after we get everything setup
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
        this[propName]
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
            this.extended
          );
        }, 0);
      }
      // if extended is set them import wc-markdown
      if (this.extended && propName === "extended") {
        import("./lib/wc-markdown.js");
      }
    });
  }
}

customElements.define(GithubPreview.tag, GithubPreview);
export { GithubPreview };
