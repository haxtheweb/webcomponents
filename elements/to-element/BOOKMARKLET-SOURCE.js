window.__haxClickEvent = (e) => {
  if (e.target.tagName !== "TO-ELEMENT") {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (!window.__first) {
      alert(
        'You\'ll now be asked to name this element. Make sure the element name has a hypthen in it like "cool-new-things".'
      );
      window.__first = true;
    }
    let name = prompt("Name for this element:", "cool-new-thing");
    if (name) {
      // ensure we remove the class
      e.target.classList.remove("hax-injected-highlighter");
      document
        .getElementById("haxallthethings")
        .downloadNewComponent(e.target, name);
    } else {
      document.body.removeEventListener("click", window.__haxClickEvent);
      document.body.removeEventListener("mouseover", function (e) {
        e.target.classList.add("hax-injected-highlighter");
      });
      document.body.removeEventListener("mouseout", function (e) {
        e.target.classList.remove("hax-injected-highlighter");
      });
    }
  }
};
let link = document.createElement("script");
link.type = "module";
link.src =
  "https://cdn.waxam.io/build/es6/node_modules/@lrnwebcomponents/to-element/to-element.js";
document.body.appendChild(link);
let toE = document.createElement("to-element");
toE.setAttribute("id", "haxallthethings");
document.body.appendChild(toE);
let style = document.createElement("style");
style.innerHTML = `.hax-injected-highlighter {
  outline: 4px dotted #34e79a !important;
  outline-offset: 4px !important;
}`;
document.body.appendChild(style);
alert(
  "Welcome to HAX Element creator. To get started, click on the thing you want to make a new element."
);
document.body.addEventListener("click", window.__haxClickEvent);
document.body.addEventListener("mouseover", function (e) {
  e.target.classList.add("hax-injected-highlighter");
});
document.body.addEventListener("mouseout", function (e) {
  e.target.classList.remove("hax-injected-highlighter");
});
