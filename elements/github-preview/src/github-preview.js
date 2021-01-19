/**
 * Copyright 2021
 * @license MIT, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
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
      __language: {
        type: String,
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
          background-color: #ffd500;
          border-radius: 50%;
          margin: 0px 5px 0px 5px;
        }

        div {
          color: white;
        }

        .stats-text {
          margin: 0px 5px 0px 5px;
        }

        .inverted-icon {
          filter: invert(100%);
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
            <span class="inverted-icon"
              ><img
                src="https://img.icons8.com/fluent-systems-regular/24/000000/book.png"
            /></span>
            <div>${this.repo}</div>
          </div>

          <div>${this.__description}</div>

          <div class="stats-container">
            <span class="lang-circle"></span>
            <div class="stats-text">${this.__language}</div>
            <span class="inverted-icon"
              ><img src="https://img.icons8.com/android/24/000000/star.png"
            /></span>
            <div class="stats-text">${this.__stars}</div>
            <span class="inverted-icon"
              ><img
                src="https://img.icons8.com/fluent-systems-regular/24/000000/code-fork.png"
            /></span>
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
    console.log(response);
    if (typeof response !== typeof undefined && response) {
      this.__description = response.description;
      this.__language = response.language;
      this.__stars = response.stargazers_count;
      this.__forks = response.forks;
    }
  }

  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    this.fetchRepo(this.repo, this.org);
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
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
