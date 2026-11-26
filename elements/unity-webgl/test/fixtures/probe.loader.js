// A hostile "Unity build" loader used by the tests. It tries to reach the
// page that embeds it and reports what it could touch through the error
// path of createUnityInstance.
// eslint-disable-next-line no-unused-vars
function createUnityInstance() {
  const found = [];
  try {
    found.push(parent.document ? "parent-dom" : "no-parent-dom");
  } catch (e) {
    found.push("no-parent-dom");
  }
  try {
    parent.__unityProbeRan = true;
    found.push("parent-global");
  } catch (e) {
    found.push("no-parent-global");
  }
  try {
    found.push(document.cookie === "" ? "no-cookie" : "cookie");
  } catch (e) {
    found.push("no-cookie");
  }
  try {
    found.push(globalThis.localStorage.length >= 0 ? "storage" : "no-storage");
  } catch (e) {
    found.push("no-storage");
  }
  found.push("origin:" + globalThis.location.origin);
  return Promise.reject(new Error(found.join(",")));
}
