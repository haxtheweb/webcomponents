import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";

class LockedBadge extends LitElement {
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
          /* greys migrate to a DDD light-dark pair so the placeholder
             stays scheme-safe */
          background: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-coalyGray)
          );
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          font-size: var(--ddd-font-size-xs);
          line-height: var(--ddd-lh-140);
          border: var(--ddd-border-size-sm) dashed
            light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-white)
            );
          box-shadow: 0 0 0 4px
              light-dark(
                var(--ddd-theme-default-limestoneGray),
                var(--ddd-theme-default-slateGray)
              ),
            var(--ddd-boxShadow-md);
          position: relative;
        }

        .badgepic {
          --simple-icon-height: var(--ddd-icon-2xl);
          --simple-icon-width: var(--ddd-icon-2xl);
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
          aria-label="Locked badge"
        ></simple-icon-lite>
      </div>
    `;
  }
}

globalThis.customElements.define(LockedBadge.tag, LockedBadge);
export { LockedBadge };
