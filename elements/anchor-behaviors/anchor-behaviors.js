/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

// register globally so we can make sure there is only one
globalThis.AnchorBehaviors = globalThis.AnchorBehaviors || {};
// request if this exists. This helps invoke the el existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
globalThis.AnchorBehaviors.getTarget = (element = null) => {
  /** gets and sets parameters */
  let getParams = () => {
      let str =
          globalThis.location.hash.substring(1).replace(/^(.+)&?/, "id=$1") ||
          globalThis.location.search.substring(1) ||
          "",
        uri = str
          ? `{"${decodeURI(str)
              .replace(/"/g, '\\"')
              .replace(/&/g, '","')
              .replace(/=/g, '":"')}"}`
          : "{}",
        isJSON = (json) => {
          try {
            JSON.parse(json);
          } catch (e) {
            return false;
          }
          return true;
        },
        params = uri && isJSON(uri) ? JSON.parse(uri) : {};
      globalThis.AnchorBehaviors.params = params;
    },
    testElement = (element, params) => {
      if (element && (params.id || params.resource)) {
        let eid = element.id ? element.id.replace(/#/g, "") : null,
          er = element.resource ? element.resource.replace(/#/g, "") : null,
          pid = params.id ? params.id.replace(/#/g, "") : null,
          pr = params.resource ? params.resource.replace(/#/g, "") : null;
        if (
          (eid && eid === pid) ||
          (eid && eid === pr) ||
          (er && er === pid) ||
          (er && er === pr)
        )
          return element;
      }
    };

  /** sets target element */
  if (!globalThis.AnchorBehaviors.target) {
    if (!globalThis.AnchorBehaviors.params) {
      if (globalThis.document.readyState === "complete") {
        getParams();
      }
      globalThis.onload = getParams();
    }
    /** search for all combos of id and resource id */
    globalThis.AnchorBehaviors.target =
      globalThis.document.getElementById(
        globalThis.AnchorBehaviors.params.id,
      ) ||
      globalThis.document.getElementById(
        `#${globalThis.AnchorBehaviors.params.id}`,
      ) ||
      globalThis.document.querySelector(
        `[resource="#${
          globalThis.AnchorBehaviors.params.id ||
          globalThis.AnchorBehaviors.params.resource
        }"]`,
      ) ||
      globalThis.document.querySelector(
        `[resource="${
          globalThis.AnchorBehaviors.params.id ||
          globalThis.AnchorBehaviors.params.resource
        }"]`,
      ) ||
      testElement(element, globalThis.AnchorBehaviors.params) ||
      null;
    if (globalThis.AnchorBehaviors.target)
      globalThis.AnchorBehaviors.target.scrollIntoView();
  }
  return globalThis.AnchorBehaviors.target;
};
