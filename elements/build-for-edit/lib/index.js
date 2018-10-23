import "./src/build-app/build-app.js";
const $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
$_documentContainer.innerHTML = `<title>build</title><build-app></build-app>`;
document.head.appendChild($_documentContainer);

/* See https://goo.gl/OOhYW5 */
