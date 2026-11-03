import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

class LockedBadge extends I18NMixin(LitElement) {
  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      lockedBadge: "Locked badge",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
  }
  static get tag() {
    return "locked-badge";
  }
  static get styles() {
    return [
      css`
        .badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 200px;
          height: 200px;
          border-radius: var(--ddd-radius-circle);
          padding: var(--ddd-spacing-5);
          margin: var(--ddd-spacing-5);
          /* locked state: an empty dashed circle with a muted lock, so it
             reads as a slot still to fill in both schemes */
          background: transparent;
          color: light-dark(
            var(--ddd-theme-default-slateGray, #314d64),
            var(--ddd-theme-default-limestoneLight, #e4e5e7)
          );
          font-size: var(--ddd-font-size-xs);
          line-height: var(--ddd-lh-140);
          border: var(--ddd-border-size-sm, 2px) dashed
            light-dark(
              var(--ddd-theme-default-limestoneGray, #a2aaad),
              var(--ddd-theme-default-slateLight, #ccdae6)
            );
          position: relative;
        }

        .badgepic {
          --simple-icon-color: currentColor;
          --simple-icon-height: var(--ddd-icon-lg, 56px);
          --simple-icon-width: var(--ddd-icon-lg, 56px);
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="badge">
        <!-- local icon instead of the remote flaticon asset so nothing
             loads off-premises -->
        <simple-icon-lite
          class="badgepic"
          icon="icons:lock"
          role="img"
          aria-label="${this.t.lockedBadge}"
        ></simple-icon-lite>
      </div>
    `;
  }
}

globalThis.customElements.define(LockedBadge.tag, LockedBadge);
export { LockedBadge };
