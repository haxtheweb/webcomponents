/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";

/**
 * `git-corner`
 * `display a quick link with styling to a repo to help with contributions`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-element
 * @demo demo/index.html
 */
class GitCorner extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "git-corner";
  }
  /**
   * Register CSS styles
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        :host([corner]) svg {
          z-index: var(--github-corner-z-index, 1);
          position: absolute;
          top: 0;
          border: 0;
          right: 0;
        }
        :host([circle]) svg {
          border-radius: 100px;
          transform: rotate(-45deg);
        }
        :host([size="micro"]) {
          --github-corner-size: 28px;
        }
        :host([size="small"]) {
          --github-corner-size: 50px;
        }
        :host([size="large"]) {
          --github-corner-size: 100px;
        }
        svg {
          fill: var(--github-corner-background, #24292e);
          color: var(--github-corner-color, #ffffff);
          width: var(--github-corner-size, 80px);
          height: var(--github-corner-size, 80px);
        }
        a {
          display: table;
          outline-color: var(--github-corner-background, #24292e);
          outline-width: 2px;
        }

        .github-corner:focus .octo-arm,
        .github-corner:hover .octo-arm {
          animation: octocat-wave 560ms ease-in-out;
        }

        @keyframes octocat-wave {
          0%,
          100% {
            transform: rotate(0);
          }
          20%,
          60% {
            transform: rotate(-25deg);
          }
          40%,
          80% {
            transform: rotate(10deg);
          }
        }
        @media (max-width: 500px) {
          .github-corner:hover .octo-arm {
            animation: none;
          }
          .github-corner .octo-arm {
            animation: octocat-wave 560ms ease-in-out;
          }
        }
      `
    ];
  }
  /**
   * runs on first go
   */
  firstUpdated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {});
  }
  /**
   * updated / notice property changes
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {});
  }
}
customElements.define(GitCorner.tag, GitCorner);
export { GitCorner };
