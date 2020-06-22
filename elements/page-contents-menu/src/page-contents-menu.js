/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";

/**
 * `page-contents-menu`
 * `Links that jump you to the right place in the page&#39;s content`
 * @demo demo/index.html
 * @element page-contents-menu
 */
class PageContentsMenu extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }
      `
    ];
  }

  // render function
  render() {
    return html`
      <div class="reset-3c756112--pageSideSection-542f1fd5">
        <div
          class="reset-3c756112--menu-5b8a7448--pageToc-16c35922--pageTocLive-542f1fd5"
        >
          <div
            class="reset-3c756112--withScrollbar-39338630--scrollAxisY-7680295e--menuItems-2e6f017b--pageTocLiveItems-67c61496"
          >
            <div
              class="reset-3c756112--menuHeader-342906de--menuHeaderLight-2c5d8183"
            >
              <div class="reset-3c756112--menuHeaderIcon-0c3ed569">
                <svg
                  preserveAspectRatio="xMidYMid meet"
                  height="1em"
                  width="1em"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke="currentColor"
                  class="icon-7f6730be--text-3f89f380"
                >
                  <g>
                    <line x1="21" y1="10" x2="7" y2="10"></line>
                    <line x1="21" y1="6" x2="3" y2="6"></line>
                    <line x1="21" y1="14" x2="3" y2="14"></line>
                    <line x1="21" y1="18" x2="7" y2="18"></line>
                  </g>
                </svg>
              </div>
              <div class="reset-3c756112">
                <span
                  class="text-4505230f--InfoH100-1e92e1d1--textContentFamily-49a318e1"
                  >Contents</span
                >
              </div>
            </div>
            <a
              class="reset-3c756112--menuItem-aa02f6ec--menuItemLight-757d5235--menuItemInline-173bdf97--pageTocItem-f4427024"
              href="#i-have-a-github-sync-error"
              style=""
              ><div class="reset-3c756112--menuItemContent-c44ec79e">
                <span
                  class="text-4505230f--UIH300-2063425d--textContentFamily-49a318e1"
                  ><span
                    class="text-4505230f--UIH200-50ead35f--textContentFamily-49a318e1"
                  >
                    I have a GitHub sync error</span
                  ></span
                >
              </div></a
            ><a
              class="reset-3c756112--menuItem-aa02f6ec--menuItemLight-757d5235--menuItemInline-173bdf97--pageTocItem-f4427024"
              href="#gitbook-is-not-using-my-docs-folder"
              style=""
              ><div class="reset-3c756112--menuItemContent-c44ec79e">
                <span
                  class="text-4505230f--UIH300-2063425d--textContentFamily-49a318e1"
                  ><span
                    class="text-4505230f--UIH200-50ead35f--textContentFamily-49a318e1"
                    >&#8203; GitBook is not using my docs folder?</span
                  ></span
                >
              </div></a
            ><a
              class="reset-3c756112--menuItem-aa02f6ec--menuItemLight-757d5235--menuItemInline-173bdf97--pageTocItem-f4427024"
              href="#gitbook-is-creating-new-markdown-files"
              style=""
              ><div class="reset-3c756112--menuItemContent-c44ec79e">
                <span
                  class="text-4505230f--UIH300-2063425d--textContentFamily-49a318e1"
                  ><span
                    class="text-4505230f--UIH200-50ead35f--textContentFamily-49a318e1"
                  >
                    GitBook is creating new markdown files?</span
                  ></span
                >
              </div></a
            ><a
              class="reset-3c756112--menuItem-aa02f6ec--menuItemLight-757d5235--menuItemInline-173bdf97--pageTocItem-f4427024"
              href="#my-repository-is-not-listed"
              style=""
              ><div class="reset-3c756112--menuItemContent-c44ec79e">
                <span
                  class="text-4505230f--UIH300-2063425d--textContentFamily-49a318e1"
                  ><span
                    class="text-4505230f--UIH200-50ead35f--textContentFamily-49a318e1"
                    >&#8203; My repository is not listed?</span
                  ></span
                >
              </div></a
            ><a
              class="reset-3c756112--menuItem-aa02f6ec--menuItemLight-757d5235--menuItemInline-173bdf97--pageTocItem-f4427024"
              href="#nothing-happens-on-gitbook-after-adding-a-new-file-to-my-repository"
              style=""
              ><div class="reset-3c756112--menuItemContent-c44ec79e">
                <span
                  class="text-4505230f--UIH300-2063425d--textContentFamily-49a318e1"
                  ><span
                    class="text-4505230f--UIH200-50ead35f--textContentFamily-49a318e1"
                    >&#8203; Nothing happens on GitBook after adding a new file
                    to my repository</span
                  ></span
                >
              </div></a
            >
          </div>
        </div>
      </div>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Page contents-menu",
        description:
          "Links that jump you to the right place in the page's content",
        icon: "icons:android",
        color: "green",
        groups: ["Contents"],
        handles: [
          {
            type: "todo:read-the-docs-for-usage"
          }
        ],
        meta: {
          author: "btopro",
          owner: "The Pennsylvania State University"
        }
      },
      settings: {
        quick: [],
        configure: [],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      contentContainer: {
        type: Object
      },
      relationship: {
        type: String
      },
      _items: {
        type: Array
      }
    };
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "page-contents-menu";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    // default is to use the parent container unless a content container
    // is defined otherwise. This would imply usage of placing this at the TOP of
    // content area though next, pervious and none are valid
    this.relationship = "parent";
    this._items = [];
    this.contentContainer = null;
  }
  firstUpdated() {
    // if we are told to use the parent and we're connected...
    if (this.relationship == "parent") {
      // which will kick that off
      this.contentContainer = this.parentElement;
    } else if (this.relationship == "next") {
      // which will kick that off
      this.contentContainer = this.nextElementSibling;
    } else if (this.relationship == "previous") {
      // which will kick that off
      this.contentContainer = this.previousElementSibling;
    }
    // anything else we ignore sot hat contentContainer can be set manually
    else {
    }
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
      if (propName == "contentContainer") {
        this._contentContainerChanged(this[propName]);
      }
      /* computed example
      if (['id', 'selected'].includes(propName)) {
        this.__selectedChanged(this.selected, this.id);
      }
      */
    });
  }
  /**
   * When our content container changes, process the hierarchy in question
   */
  _contentContainerChanged(newValue) {
    if (newValue && newValue.innerHTML) {
      // @todo use HAX element scrappign thing to take a blob of content
      // and convert it into a hierarchy, much like the map does
      this._items = [];
    }
  }
}
customElements.define(PageContentsMenu.tag, PageContentsMenu);
export { PageContentsMenu };
