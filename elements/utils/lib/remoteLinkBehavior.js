export const remoteLinkBehavior = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
    }
    static get properties() {
      let prop = {};
      if (super.properties) {
        prop = super.properties;
      }
      // NOTE: remoteLinkTarget is intentionally NOT a reactive property.
      // Consumers assign DOM nodes to it in their firstUpdated(), which
      // just scheduled a redundant second update (Lit change-in-update
      // warning). It stays a plain instance field; remoteLinkURL stays
      // reactive so url changes still batch into one update cycle.
      prop.remoteLinkURL = {
        type: String,
      };
      return prop;
    }
    /**
     * LitElement specific. Subclasses resolve this.remoteLinkTarget in their
     * own firstUpdated() AFTER calling super, so defer the one-time
     * target/rel wiring (queueMicrotask) until those assignments have landed;
     * the plain-field assignment schedules no update (no change-in-update).
     */
    firstUpdated(changedProperties) {
      if (super.firstUpdated) {
        super.firstUpdated(changedProperties);
      }
      queueMicrotask(() => {
        this._remoteLinkURLTarget(this.remoteLinkTarget, this.remoteLinkURL);
      });
    }
    /**
     * Updated is LitElement specific but could use this without LitElement
     */
    updated(changedProperties) {
      if (super.updated) {
        super.updated(changedProperties);
      }
      changedProperties.forEach((oldValue, propName) => {
        if (propName == "remoteLinkURL") {
          this._remoteLinkURLTarget(this.remoteLinkTarget, this.remoteLinkURL);
        }
      });
    }
    /**
     * Evaluates url for correct targeting.
     */
    _remoteLinkURLTarget(target, url) {
      if (target && url && this.remoteLinkURLisExternalLink(url)) {
        target.setAttribute("target", "_blank");
        target.setAttribute("rel", "noopener noreferrer");
      } else if (target) {
        target.removeAttribute("target");
        target.removeAttribute("rel");
      }
    }
    /**
     * Internal function to check if a url is external
     */
    remoteLinkURLisExternalLink(url) {
      if (url.indexOf("http") != 0) return false;
      var root = globalThis.location.origin;
      return url.indexOf(root) != 0;
    }
  };
};
