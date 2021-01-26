/**
 * Copyright 2021
 * @license MIT, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
/**
 * `github-preview`
 * `A simple element that displays information about a github repository.`
 * @demo demo/index.html
 * @element github-preview
 */
class GithubPreview extends LitElement {
  static get properties() {
    let props = {};
    if (super.properties) {
      props = super.properties;
    }
    return {
      ...props,
      repo: {
        type: String,
      },
      org: {
        type: String,
      },
      __description: {
        type: String,
      },
      repoLang: {
        type: String,
        attribute: "repo-lang",
        reflect: true,
      },
      __stars: {
        type: Number,
      },
      __forks: {
        type: Number,
      },
      __assetAvailable: {
        type: Boolean,
      },
      extended: {
        type: Boolean,
        reflect: true,
      },
      __readmeDesc: {
        type: String,
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

        :host([repo-lang="Sass"]) .lang-circle {
          background-color: #a53b70;
        }

        :host([repo-lang="Sass"]) .lang-circle {
          background-color: #a53b70;
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
          color: white;
        }

        :host([extended]) .container {
          width: var(--github-preview-container-width, 800px);
          padding: var(--github-preview-container-padding, 10px);
        }

        .container {
          background-color: black;
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
          font-size: 22px;
          font-weight: bold;
        }

        .header-container div a:hover {
          font-size: 24px;
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
          color: white;
        }

        .description {
          padding: 8px 0px 8px 0px;
        }

        .stats-text {
          margin: 0px 5px 0px 5px;
        }
        
        .readme-container-show {
          overflow-y: scroll;
          overflow-x: hidden;
          max-height: var(--github-preview-readme-container-max-height, 300px);
        }

        .readme-container-hide {
          overflow-y: hidden;
          overflow-x: hidden;
          max-height: var(--github-preview-readme-container-max-height, 300px);
        }
      `,
    ];
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "github-preview";
  }

  render() {
    return this.__assetAvailable
      ? this.extended
        ? html`
            <div class="container">
              <div class="header-container">
                <simple-icon-lite icon="book"></simple-icon-lite>
                <div>
                  <a href="https://github.com/${this.org}" target="_blank" rel="noopener noreferrer">
                    ${this.org}
                  </a>
                  /
                  <a href="https://github.com/${this.org}/${this.repo}" target="_blank" rel="noopener noreferrer">
                    ${this.repo}
                  </a>
                </div>
              </div>

              <hr />

              <div>${this.__description}</div>

              <hr />
              
              <div class="readme-container-hide">
                <wc-markdown>
                  <script type="wc-content">
                    ${this.__readmeDesc}
                  </script>
                </wc-markdown>
              </div>

              <button @click=${this.readmeViewMoreHandler} class="readme-btn">
                  View More
              </button>

              <div class="stats-container">
                <span class="lang-circle"></span>
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
              href="https://github.com/${this.org}/${this.repo}"
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
            <h1>Asset not found</h1>
          </div>
        `;
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.extended = false;
  }

  fetchRepo(repoName, orgName) {
    if (this.extended) {
      fetch(
        `https://raw.githubusercontent.com/${orgName}/${repoName}/master/README.md`
      )
        .then((response) => {
          if (response.ok) {
            return response.text();
          }
        })
        .then((responseText) => {
          this.__readmeDesc = this.handleReadmeText(responseText);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    fetch(`https://api.github.com/repos/${orgName}/${repoName}`)
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

  handleReadmeText(readmeText) {
    let lineArray = readmeText.split("\n");
    let finalStr = "";
    for (let i = 0; i < lineArray.length; i++) {
      finalStr += lineArray[i] + "\n";
    }
    return finalStr;
  }

  readmeViewMoreHandler(event){
    let readmeContainer = this.shadowRoot.querySelector(".readme-container-hide");
    readmeContainer.classList.remove("readme-container-hide");
    readmeContainer.classList.add("readme-container-show");
  }

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
    if (!this.repo || !this.org) {
      this.__assetAvailable = false;
    }
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (["repo", "org"].includes(propName) && this[propName]) {
        clearTimeout(this.__debounce);
        this.__debounce = setTimeout(() => {
          this.fetchRepo(this.repo, this.org);
        }, 0);
      }
      if (this.extended && propName === "extended") {
        import("./lib/wc-markdown.js");
      }
      /* notify example
      // notify
      if (propName == 'format') {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            }
          })
        );
      }
      */
      /* observer example
      if (propName == 'activeNode') {
        this._activeNodeChanged(this[propName], oldValue);
      }
      */
      /* computed example
      if (['id', 'selected'].includes(propName)) {
        this.__selectedChanged(this.selected, this.id);
      }
      */
    });
  }
}
customElements.define(GithubPreview.tag, GithubPreview);
export { GithubPreview };
