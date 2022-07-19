import { html } from "lit";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import { b64toBlob } from "@lrnwebcomponents/utils/utils.js";
import { MicroFrontendRegistry } from "@lrnwebcomponents/micro-frontend-registry/micro-frontend-registry.js";
import { HAXCMSI18NMixin } from "./HAXCMSI18NMixin.js";
import { toJS } from "mobx";
import { enableServices } from '@lrnwebcomponents/micro-frontend-registry/lib/microServices.js';

export const PrintBranchMixin = function (SuperClass) {
  return class extends HAXCMSI18NMixin(SuperClass) {
    constructor() {
      super();
      enableServices(['haxcms']);
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
    let ancestorItem = toJS(store.ancestorItem);
    // base helps w/ calculating URLs in content
    var base = '';
    if (document.querySelector('base')) {
      base = document.querySelector('base').href;
    }
    const site = toJS(store.manifest);
    const params = {
      type: 'site',
      site: {
        file: base,
        id: site.id,
        title: site.title,
        author:site.author,
        description: site.description,
        license: site.license,
        metadata: site.metadata,
        items: site.items,
      },
      ancestor: ancestorItem ? ancestorItem.id : toJS(store.activeId),
      link: base,
      magic: window.__appCDN,
      base: base,
    };
    const response = await MicroFrontendRegistry.call('@haxcms/siteToHtml', params);
    if (response.status == 200 && response.data) {
      const link = document.createElement("a");
      // click link to download file
      // @todo this downloads but claims to be corrupt.
      link.href = window.URL.createObjectURL(b64toBlob(btoa(response.data), "text/html"));
      link.download = `${toJS(store.ancestorTitle)}.html`;
      link.target = "_blank";
      this.appendChild(link);
      link.click();
      this.removeChild(link);
    }
    else {
      // fallback in case the service fails
      window.open(
        window.location.href + "?format=print-page",
        "",
        "left=0,top=0,width=800,height=800,toolbar=0,scrollbars=0,status=0,noopener=1,noreferrer=1"
      );
    }
  }
  };
};