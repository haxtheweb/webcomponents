/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

// register globally so we can make sure there is only one
window.AnchorBehavior = window.AnchorBehavior || {};
// request if this exists. This helps invoke the el existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.AnchorBehavior.requestAvailability = () => {
  window.AnchorBehavior.instance = () => {
    let str =
        window.location.hash.substring(1).replace(/^(.+)&?/, "id=$1") ||
        window.location.search.substring(1),
      params = JSON.parse(
        '{"' +
          decodeURI(str)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
          '"}'
      ),
      target =
        params.id && document.getElementById(params.id)
          ? document.getElementById(params.id)
          : document.querySelector(`[resource="#${params.id}"]`);
    console.log("params", params, target);
    if (target && target.resolveAnchor) target.resolveAnchor(params);
  };
  if (!window.AnchorBehavior.instance) {
    if (document.readyState === "complete") {
      window.AnchorBehavior.instance();
    }
    window.onload = window.AnchorBehavior.instance();
  }
  return window.AnchorBehavior.instance;
};
