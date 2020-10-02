export const remoteLinkBehavior = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
    }
    static get properties() {
      let prop = {};
      if (super.prop) {
        prop = super.prop;
      }
      prop.remoteLinkTarget = {
        type: String,
      };
      prop.remoteLinkURL = {
        type: String,
      };
      return prop;
    }
    /**
     * Updated is LitElement specific but could use this without LitElement
     */
    updated(changedProperties) {
      if (super.updated) {
        super.updated(changedProperties);
      }
      changedProperties.forEach((oldValue, propName) => {
        if (propName == "remoteLinkTarget" || propName == "remoteLinkURL") {
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
      }
    }
    /**
     * Internal function to check if a url is external
     */
    remoteLinkURLisExternalLink(url) {
      if (url.indexOf("http") != 0) return false;
      var loc = location.href,
        path = location.pathname,
        root = loc.substring(0, loc.indexOf(path));
      return url.indexOf(root) != 0;
    }
  };
};
