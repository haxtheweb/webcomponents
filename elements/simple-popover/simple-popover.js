/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { AbsolutePositionBehavior } from "@haxtheweb/absolute-position-behavior/absolute-position-behavior.js";
/**
  * `simple-popover`
  * a popover alertdialog that is positioned next to a target element
  *
 ### Styling
 
 `<simple-popover>` provides the following custom properties
 for styling:
 
 Custom property | Description | Default
 ----------------|-------------|----------
 `--simple-popover-border-radius` | popover border-radius | 3px
 `--simple-popover-color` | popover text color| #222
 `--simple-popover-padding` | popover padding | 10px
 `--simple-popover-background-color` | popover background-color | white
 `--simple-popover-border-color` | popover border-color | #bbb
 `--simple-popover-box-shadow` | popover box-shadow | rgba(60, 64, 67, 0.3) 0px 4px 8px 3px;
  *
  * @element simple-popover
  * @demo ./demo/index.html
  * @demo ./demo/tour.html Tour
  */
class SimplePopover extends AbsolutePositionBehavior {
  //styles function
  static get styles() {
    return [
      super.styles,
      css`
        :host([hidden]) {
          display: none;
        }

        :host > div {
          display: flex;
          flex-direction: column-reverse;
          justify-content: stretch;
          z-index: 1;
        }

        :host([position="left"]) > div {
          justify-content: flex-start;
          flex-direction: row;
        }

        :host([position="right"]) > div {
          justify-content: flex-end;
          flex-direction: row-reverse;
        }

        :host([position="top"]) > div {
          flex-direction: column;
        }

        :host > div > * {
          width: 100%;
        }

        :host([position="left"]) > div > *,
        :host([position="right"]) > div > * {
          width: unset;
        }

        :host {
          pointer-events: none;
        }

        #content {
          margin: 0;
          pointer-events: all;
          padding: var(--simple-popover-padding, 10px);
          color: var(--simple-popover-color, #222);
          background-color: var(--simple-popover-background-color, white);
          border: var(
            --simple-popover-border,
            1px solid var(--simple-popover-border-color, #bbb)
          );
          border-radius: var(--simple-popover-border-radius, 3px);
          box-shadow: var(
            --simple-popover-box-shadow,
            rgba(60, 64, 67, 0.3) 0px 4px 8px 3px
          );
          min-height: var(--simple-popover-min-height, 20px);
          max-height: var(--simple-popover-max-height, 200px);
          scroll-behavior: smooth;
        }

        #pointer-outer {
          margin: -1px;
        }

        #pointer {
          width: 20px;
          height: 20px;
          position: relative;
          overflow: hidden;
          flex: 0 0 20px;
        }

        #pointer:after {
          content: "";
          position: absolute;
          width: 10px;
          height: 10px;
          background-color: var(--simple-popover-background-color, white);
          border: 1px solid var(--simple-popover-border-color, #bbb);
          transform: rotate(45deg);
          top: 15px;
          left: 5px;
        }

        :host([position="top"]) #pointer:after {
          top: -5px;
          left: 5px;
        }

        :host([position="right"]) #pointer:after {
          top: 5px;
          left: 15px;
        }

        :host([position="left"]) #pointer:after {
          top: 5px;
          left: -5px;
        }
      `,
    ];
  }

  // render function
  render() {
    return html` <div>
      <div id="content" role="alertdialog" part="simple-popover-content">
        <slot></slot>
      </div>
      <div id="pointer-outer">
        <div id="pointer" .style=${this._getMargins(this.__positions)}></div>
      </div>
    </div>`;
  }

  constructor() {
    super();
    this.offset = -10;
    this.fitToVisibleBounds = true;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-popover";
  }
  /**
   * sets pointer position based on popover and target middles
   *
   * @param {object} positions object that contains postions for popover and target
   * @returns {string} a string with margin styles to offset pointer
   */
  _getMargins(positions) {
    if (positions && positions.target) {
      let self = this.getBoundingClientRect(),
        h = this.position === "bottom" || this.position === "top",
        max = h ? self.width : self.height,
        sStart = h ? self.left : self.top,
        tStart = h ? positions.target.left : positions.target.top,
        tHalf = h ? positions.target.width / 2 : positions.target.height / 2,
        center = tStart + tHalf - 10,
        margin = Math.min(max - 20, Math.max(0, center - sStart)),
        style = h ? `margin: 0 0 0 ${margin}px;` : `margin: ${margin}px 0 0 0;`;
      return style;
    }
    return ``;
  }
}
customElements.define(SimplePopover.tag, SimplePopover);
export { SimplePopover };
