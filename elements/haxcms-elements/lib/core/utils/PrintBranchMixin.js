import { html } from "lit";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import {  b64toBlob } from "@lrnwebcomponents/utils/utils.js";
import { MicroFrontendRegistry } from "@lrnwebcomponents/micro-frontend-registry/micro-frontend-registry.js";
import { HAXCMSI18NMixin } from "./HAXCMSI18NMixin.js";
import { toJS } from "mobx";
import { enableServices } from '@lrnwebcomponents/micro-frontend-registry/lib/microServices.js';

export const PrintBranchMixin = function (SuperClass) {
  return class extends HAXCMSI18NMixin(SuperClass) {
    constructor() {
      super();
      enableServices(['core']);
      this.t = this.t || {};
      this.t = {
        ...this.t,
        printBranch: "Print Branch",
      };
    }

    PrintBranchButton() {
      return html`
      ${MicroFrontendRegistry.has('@haxcms/siteToHtml') ? html`
      <div class="print-branch-btn" part="${this.editMode ? `edit-mode-active` : ``}">
        <simple-icon-button-lite
          part="print-branch-btn"
          label="${this.t.printBranch}"
          icon="print"
          @click="${this.printBranchOfSite}"
          show-text-label
          icon-position="top"
        >
        </simple-icon-button-lite>
      </div>` : ``}
      `;
    }
  /**
   * Download PDF, via microservice
   */
   async printBranchOfSite(e) {
    let activeAncestor = toJS(store.activeAncestor);
    // base helps w/ calculating URLs in content
    var base = '';
    if (document.querySelector('base')) {
      base = document.querySelector('base').href;
    }
    const response = await MicroFrontendRegistry.call('@haxcms/siteToHtml', { ancestor: activeAncestor });
    if (response.status == 200 && response.data) {
      const link = document.createElement("a");
      // click link to download file
      // @todo this downloads but claims to be corrupt.
      link.href = window.URL.createObjectURL(b64toBlob(response.data, "application/pdf"));
      link.download = `${toJS(store.activeTitle)}.pdf`;
      link.target = "_blank";
      this.appendChild(link);
      link.click();
      this.removeChild(link);
    }
  }
  };
};