/**
 * copy to clipboard w/ toast and authorization
 * based on https://www.freecodecamp.org/news/copy-text-to-clipboard-javascript/
 */
export async function copyToClipboard(value, msg = null) {
  if (!msg) {
    msg = `Copied ${value} to clipboard`;
  }
  // the official way but they have to authorize it in navigator hence async
  try {
    await globalThis.navigator.clipboard.writeText(value);
  } catch (err) {
    msg = "Failed to authorize copy, refresh and authorize action";
  }
  let toastShowEventName = globalThis.HAXCMSToast
    ? "haxcms-toast-show"
    : "simple-toast-show";
  // gets it all the way to the top immediately
  globalThis.dispatchEvent(
    new CustomEvent(toastShowEventName, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        text: msg,
        duration: 5000,
      },
    }),
  );
}
