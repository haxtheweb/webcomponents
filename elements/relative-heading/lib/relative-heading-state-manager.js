import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

// register globally so we can make sure there is only one
window.RelativeHeadingStateManager = window.RelativeHeadingStateManager || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.RelativeHeadingStateManager.requestAvailability = () => {
  if (!window.RelativeHeadingStateManager.instance) {
    window.RelativeHeadingStateManager.instance = document.createElement(
      "relative-heading-state-manager"
    );
    document.body.appendChild(window.RelativeHeadingStateManager.instance);
  }
  return window.RelativeHeadingStateManager.instance;
};
/**
 * `relative-heading-state-manager`
 * ` A utility that determines headings relative to their parents.`
 * @element relative-heading-state-manager
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @polymer
 */
class RelativeHeadingStateManager extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "relative-heading-state-manager";
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * icon for copy link's toast's close button
       */
      closeIcon: {
        type: String,
      },
      /**
       * label for copy link's toast's close button
       */
      closeLabel: {
        type: String,
      },
      /**
       * active heading for copying link
       */
      copyHeading: {
        type: Object,
      },
      /**
       * message for copy link's toast
       */
      copyMessage: {
        type: String,
      },
      /**
       * Stores an array of all the players on the page.
       */
      headings: {
        type: Object,
      },
      /**
       * indicates is toast is already imported for copy link feature
       */
      usesCopyLink: {
        type: Boolean,
      },
    };
  }

  /**
   * Makes sure there is a utility ready and listening for elements.
   */
  constructor() {
    super();
    this.closeIcon = "close";
    this.closeLabel = "Close";
    this.copyMessage = "Copied to Clipboard";
    this.headings = [];
    this.copyHeading = {};
    this.usesCopyLink = false;
    // sets the instance to the current instance
    if (!window.RelativeHeadingStateManager.instance)
      window.RelativeHeadingStateManager.instance = this;
  }
  static get styles() {
    return [
      css`
        simple-toast:not(:defined) {
          display: none;
        }
      `,
    ];
  }

  render() {
    return html`
      <simple-toast
        id="relative-heading-toast"
        duration="5000"
        ?hidden="${!this.usesCopyLink}"
        ?disabled="${!this.usesCopyLink}"
        text="${this.copyHeading.copyMessage || this.copyMessage}: ${this
          .copyUrl}"
      >
        <simple-icon-button
          icon="${this.copyHeading.closeIcon || this.closeIcon}"
          label="${this.copyHeading.closeLabel || this.closeLabel}"
          title="${this.copyHeading.closeLabel || this.closeLabel}"
          @click="${this.closeCopyLink}"
        ></simple-icon-button>
      </simple-toast>
    `;
  }

  /**
   * gets URL to be copied
   * @readonly
   * @returns {string}
   */
  get copyUrl() {
    return `${window.location.href.replace(window.location.hash, "")}#${
      this.copyHeading && this.copyHeading.id ? this.copyHeading.id : ""
    }`;
  }

  /**
   * imports toast if needed and not already loaded
   */
  useCopyLink() {
    if (!this.usesCopyLink) {
      this.usesCopyLink = true;
      import("@lrnwebcomponents/simple-icon/simple-icon.js");
      import("@lrnwebcomponents/simple-icon/lib/simple-icons.js");
      import("@lrnwebcomponents/simple-icon/lib/simple-icon-button.js");
      import("@lrnwebcomponents/simple-toast/simple-toast.js");
    }
  }

  /**
   * handles copying the share link
   * @param {object} active heading
   */
  copyLink(heading) {
    this.copyHeading = heading;
    let el = document.createElement("textarea");
    el.value = this.copyUrl;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    if (
      this.shadowRoot.querySelector("#relative-heading-toast") &&
      this.shadowRoot.querySelector("#relative-heading-toast").open
    )
      this.shadowRoot.querySelector("#relative-heading-toast").open();
  }

  /**
   * handles closing link toast
   */
  closeCopyLink() {
    if (
      this.shadowRoot.querySelector("#relative-heading-toast") &&
      this.shadowRoot.querySelector("#relative-heading-toast").close
    )
      this.shadowRoot.querySelector("#relative-heading-toast").close();
  }

  /**
   * adds heading to manager data
   * @param {object} heading to be added
   */
  addHeading(heading) {
    if (heading) {
      this.addSubhead(heading);
      this.setHeading(heading.id, heading);
      this.updateLevel(heading);
    }
  }

  /**
   * adds heading from manager data
   * @param {object} heading to be removed
   */
  removeHeading(heading) {
    if (heading) {
      if (heading.id && this.headings[heading.id]) {
        this.headings[heading.id].heading = null;
        this.headings[heading.id].subheads.forEach((subhead) =>
          this.updateLevel(subhead)
        );
      }
      this.removeSubhead(heading.parent, heading);
    }
  }

  /**
   * updates heading id in manager data
   * @param {object} heading to be updated
   * @param {string} old heading id
   */
  updateId(heading, old = null) {
    if (heading) {
      if (old) this.setHeading(old, null);
      this.setHeading(heading.id, heading);
    }
  }

  /**
   * updates heading parent id in manager data
   * @param {object} heading to be updated
   * @param {string} old heading parent
   */
  updateParent(heading, old = null) {
    if (heading) {
      if (old) this.removeSubhead(old, heading);
      this.addSubhead(heading);
    }
  }

  /**
   * updates heading level based on default level
   * @param {object} heading to be updated
   */
  updateDefaultLevel(heading, old = null) {
    if (heading) this.updateLevel(heading);
  }

  /**
   * adds heading to subhead data
   * @param {object} heading to be added
   */
  addSubhead(heading) {
    if (heading) {
      if (heading.parent) {
        if (!this.headings[heading.parent])
          this.headings[heading.parent] = {
            heading: null,
            subheads: [],
          };
        if (!this.headings[heading.parent].subheads.includes(heading))
          this.headings[heading.parent].subheads.push(heading);
      }
      this.updateLevel(heading);
    }
  }

  /**
   * removes heading from subhead data
   * @param {string} id to be updated
   * @param {object} heading to be removed
   */
  removeSubhead(id, heading) {
    if (id && this.headings[id] && this.headings[id].subheads) {
      this.headings[id].subheads = this.headings[id].subheads.filter(
        (subhead) => subhead != heading
      );
    }
  }

  /**
   * sets manager's heading data
   * @param {string} id to be updated
   * @param {object} heading to be set
   */
  setHeading(id, heading) {
    if (id) {
      if (!this.headings[id])
        this.headings[id] = {
          heading: null,
          subheads: [],
        };
      this.headings[id].heading = heading;
    }
  }

  /**
   * updates heading level
   * @param {object} heading to be updated
   */
  updateLevel(heading) {
    if (heading) {
      let parent =
          heading.parent && this.headings[heading.parent].heading
            ? parseInt(this.headings[heading.parent].heading.__level)
            : null,
        plevel = parent ? Math.min(6, Math.max(parent + 1, 1)) : null,
        level = plevel ? plevel : heading.defaultLevel;
      heading._setLevel(level);
      if (this.headings[heading.id])
        this.headings[heading.id].subheads.forEach((subhead) =>
          this.updateLevel(subhead)
        );
    }
  }
}
window.customElements.define(
  RelativeHeadingStateManager.tag,
  RelativeHeadingStateManager
);
export { RelativeHeadingStateManager };
