// generate the light/dark link elements so that we style things correctly when used
export function generateStyleLinkEls() {
  // ensure we only have the 2 we need
  if (
    document.head &&
    document.head.querySelector("#showlace-light") &&
    document.head.querySelector("#showlace-dark")
  ) {
    return false;
  }

  const light = new URL(
    "../../../@shoelace-style/shoelace/dist/themes/light.css",
    import.meta.url
  );
  let link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("media", "(prefers-color-scheme:light)");
  link.setAttribute("href", light);
  link.setAttribute("id", "showlace-light");
  document.head.appendChild(link);

  const dark = new URL(
    "../../../@shoelace-style/shoelace/dist/themes/dark.css",
    import.meta.url
  );
  link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("media", "(prefers-color-scheme:dark)");
  link.onload = () => {
    document.documentElement.classList.add("sl-theme-dark");
  };
  link.setAttribute("href", dark);
  link.setAttribute("id", "showlace-dark");
  document.head.appendChild(link);
  return true;
}
