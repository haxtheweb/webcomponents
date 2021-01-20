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
    };
  }

  static get styles() {
    return [
      css`
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
          text-decoration: none;
        }

        .container {
          background-color: black;
          border-radius: 10px;
          width: var(--github-preview-container, 400px);
          padding: 5px;
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

        .stats-text {
          margin: 0px 5px 0px 5px;
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
    return html`
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

          <div>${this.__description}</div>

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
    `;
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
  }

  fetchRepo(repoName, orgName) {
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
        console.error(error);
      });
  }

  handleResponse(response) {
    if (response) {
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
    if (this.repo && this.org) {
      this.fetchRepo(this.repo, this.org);
    }
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "repo" || propName === "org") {
        this.fetchRepo(this.repo, this.org);
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
