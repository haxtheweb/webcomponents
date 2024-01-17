// generate the light/dark link elements so that we style things correctly when used
export function generateStyleLinkEls() {
  // ensure we only have the 2 we need
  if (
    globalThis.document.head &&
    globalThis.document.head.querySelector("#showlace-light") &&
    globalThis.document.head.querySelector("#showlace-dark")
  ) {
    return false;
  }

  const light = new URL("./light.css", import.meta.url).href;
  let link = globalThis.document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("media", "(prefers-color-scheme:light)");
  link.setAttribute("href", light);
  link.setAttribute("id", "showlace-light");
  globalThis.document.head.appendChild(link);

  const dark = new URL("./dark.css", import.meta.url).href;
  link = globalThis.document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("media", "(prefers-color-scheme:dark)");
  link.onload = () => {
    globalThis.document.documentElement.classList.add("sl-theme-dark");
  };
  link.setAttribute("href", dark);
  link.setAttribute("id", "showlace-dark");
  globalThis.document.head.appendChild(link);
  return true;
}
