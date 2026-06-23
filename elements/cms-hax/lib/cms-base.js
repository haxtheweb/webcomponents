/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { wipeSlot } from "@haxtheweb/utils/lib/slot.js";

/**
 * `cms-base`
 * Shared base class for CMS elements that fetch remote content
 * and inject it into the light DOM.
 */
export class CMSBase extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        min-width: 112px;
        min-height: 112px;
        transition: 0.6s all ease;
        background-color: transparent;
      }
      :host([hax-edit-mode]) #replacementcontent {
        pointer-events: none;
      }
      #replacementcontent {
        visibility: visible;
        opacity: 1;
      }
      :host([loading]) {
        text-align: center;
      }
      :host([loading]) #replacementcontent {
        opacity: 0;
        visibility: hidden;
      }
    `;
  }

  render() {
    return html`<span id="replacementcontent"><slot></slot></span>`;
  }

  static get properties() {
    return {
      loading: {
        type: Boolean,
        reflect: true,
      },
      haxEditMode: {
        type: Boolean,
        attribute: "hax-edit-mode",
        reflect: true,
      },
    };
  }

  constructor() {
    super();
    this.loading = false;
    this.haxEditMode = false;
    this._requestPrefix = "";
    this._requestSuffix = "";
    this._globalEndPointVar = "";
    this._endPoint = null;
    this._bodyData = null;
  }

  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }

  haxactiveElementChanged(element, value) {
    if (value) {
      this.haxEditMode = value;
    }
  }

  haxeditModeChanged(value) {
    this.haxEditMode = value;
  }

  /**
   * Build request body data from identifiers.
   * Override in subclasses.
   */
  _buildBodyData() {
    return null;
  }

  /**
   * Resolve endpoint: prefer explicit property, then global fallback.
   */
  _resolveEndPoint() {
    if (this._endPoint) {
      return this._endPoint;
    }
    if (typeof globalThis[this._globalEndPointVar] !== typeof undefined) {
      return globalThis[this._globalEndPointVar];
    }
    return null;
  }

  /**
   * Kick off a fetch request if we have what we need and aren't already loading.
   */
  async _doRequest() {
    const bodyData = this._buildBodyData();
    if (!bodyData || this.loading) {
      return;
    }
    const endPoint = this._resolveEndPoint();
    if (!endPoint) {
      return;
    }
    this.loading = true;
    try {
      const url = new URL(endPoint, globalThis.location.href);
      Object.keys(bodyData).forEach((key) => {
        url.searchParams.set(key, bodyData[key]);
      });
      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        this._handleResponse(data);
      }
    } catch (e) {
      // fail silently
    }
  }

  /**
   * Handle parsed JSON response.
   * Override in subclasses.
   */
  _handleResponse(data) {
    if (data && typeof data.content !== typeof undefined) {
      this._updateEditLink(data);
      wipeSlot(this);
      let frag = globalThis.document.createElement("span");
      frag.innerHTML = data.content;
      this.appendChild(frag.cloneNode(true));
      setTimeout(() => {
        this.loading = false;
        if (globalThis.WCAutoload) {
          globalThis.WCAutoload.process();
        }
      }, 600);
    }
  }

  /**
   * Update edit-this link if the cmstokenidtolockonto element exists.
   */
  _updateEditLink(data) {
    if (
      data.editEndpoint &&
      globalThis.document.getElementById("cmstokenidtolockonto") != null
    ) {
      const link = globalThis.document.getElementById("cmstokenidtolockonto");
      link.setAttribute("href", data.editEndpoint);
      if (data.editText) {
        link.innerHTML = data.editText;
      }
    }
  }

  /**
   * Check if we should auto-load on connection.
   */
  connectedCallback() {
    super.connectedCallback();
    const nodes = this.querySelectorAll("*");
    if (nodes.length === 0 && !this.loading) {
      this._doRequest();
    }
  }
}
