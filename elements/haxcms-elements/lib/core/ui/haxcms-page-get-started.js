import { LitElement, html, css } from "lit";
import { HAXCMSI18NMixin } from "../utils/HAXCMSI18NMixin.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import "@haxtheweb/place-holder/place-holder.js";

/**
 * `haxcms-outline-editor-dialog`
 * `Dialog for presenting an editable outline`
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 */
class HAXCMSPageGetStarted extends HAXCMSI18NMixin(LitElement) {
  constructor() {
    super();
  }
  static get tag() {
    return "haxcms-page-get-started";
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
          position: absolute;
          top: 0;
          margin: 100px;
        }
        .wrapper {
          max-width: 800px;
          margin: 0 auto;
        }
        .row {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        .tile {
          background-color: #fff;
          border-radius: 2px;
          box-shadow:
            0 1px 3px rgba(0, 0, 0, 0.12),
            0 1px 2px rgba(0, 0, 0, 0.24);
          padding: 40px;
          margin-bottom: 20px;
          height: 200px;
          width: 200px;
          display: inline-block;
          text-align: center;
        }

        .pro-tip {
          display: block;
          border: 2px solid black;
          background-color: #fffeba;
        }

        simple-icon-button-lite,
        simple-icon-lite {
          display: block;
          --simple-icon-width: 72px;
          --simple-icon-height: 72px;
        }
      `,
    ];
  }
  handleWhoGotClicked(e) {
    console.log(e.target);
  }
  // render function
  render() {
    return html`
      <div class="wrapper" @click="${this.handleWhoGotClicked}">
        <h3>Choose a method of getting started quickly</h3>
        <div class="row">
          <div class="tile" data-action="file">
            <place-holder
              directions="Double click or drag and drop file to replace"
              text="Provide file"
            ></place-holder>
          </div>
          <div class="tile" data-action="video">
            <simple-icon-lite icon="hax:video"></simple-icon-lite>
            <div class="label">Video template</div>
          </div>
          <div class="tile" data-action="assignment">
            <simple-icon-lite icon="hax:lesson"></simple-icon-lite>
            <div class="label">Assignment template</div>
          </div>
        </div>

        <div class="row">
          <div class="tile" data-action="edit">
            <simple-icon-lite icon="hax:page-edit"></simple-icon-lite>
            <div class="label">Edit this page</div>
          </div>
          <div class="tile" data-action="outline">
            <simple-icon-lite icon="hax:site-map"></simple-icon-lite>
            <div class="label">Add a page outline</div>
          </div>
          <div class="tile" data-action="merlin">
            <simple-icon-lite icon="hax:wizard-hat"></simple-icon-lite>
            <div class="label">Help me decide</div>
          </div>
        </div>

        <div class="pro-tip">
          <simple-icon-button-lite
            icon="hax:wizard-hat"
          ></simple-icon-button-lite>
          <span class="tip"
            >Tip: Drag and drop files onto the first tile to get started</span
          >
        </div>
      </div>
    `;
  }
}

customElements.define(HAXCMSPageGetStarted.tag, HAXCMSPageGetStarted);
