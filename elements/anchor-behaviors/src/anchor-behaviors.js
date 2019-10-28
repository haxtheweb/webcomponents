/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

// register globally so we can make sure there is only one
window.AnchorBehaviors = window.AnchorBehaviors || {};
// request if this exists. This helps invoke the el existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.AnchorBehaviors.getTarget = () => {
  /** gets and sets parameters */
  let getParams = () => {
    let str =
        window.location.hash.substring(1).replace(/^(.+)&?/, "id=$1") ||
        window.location.search.substring(1) ||
        "",
      uri = str
        ? `{"${decodeURI(str)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"')}"}`
        : "{}",
      isJSON = json => {
        try {
          JSON.parse(json);
        } catch (e) {
          return false;
        }
        return true;
      },
      params = uri && isJSON(uri) ? JSON.parse(uri) : {};
    window.AnchorBehaviors.params = params;
  };

  /** sets target element */
  if (!window.AnchorBehaviors.target) {
    if (!window.AnchorBehaviors.params) {
      if (document.readyState === "complete") {
        getParams();
      }
      window.onload = getParams();
    }
    /** search for all combos of id and resource id */
    window.AnchorBehaviors.target =
      document.getElementById(window.AnchorBehaviors.params.id) ||
      document.getElementById(`#${window.AnchorBehaviors.params.id}`) ||
      document.querySelector(
        `[resource="#${window.AnchorBehaviors.params.id ||
          window.AnchorBehaviors.params.resource}"]`
      ) ||
      document.querySelector(
        `[resource="${window.AnchorBehaviors.params.id ||
          window.AnchorBehaviors.params.resource}"]`
      ) ||
      null;
  }
  return window.AnchorBehaviors.target;
};
