define(["../lib/default-styles.js", "../iron-data-table.js"], function() {
  "use strict";
  var $_documentContainer = document.createElement("div");
  $_documentContainer.setAttribute("style", "display: none;");
  $_documentContainer.innerHTML =
    '<style is="custom-style">\n  #forkongithub a {\n    background: var(--default-primary-color);\n    color: #fff;\n    text-decoration: none;\n    font-family: arial, sans-serif;\n    text-align: center;\n    font-weight: bold;\n    padding: 5px 40px;\n    font-size: 0.8rem;\n    line-height: 1.4rem;\n    position: relative;\n    transition: 0.5s;\n  }\n\n  #forkongithub a::before,\n  #forkongithub a::after {\n    content: "";\n    width: 100%;\n    display: block;\n    position: absolute;\n    top: 1px;\n    left: 0;\n    height: 1px;\n    background: #fff;\n  }\n\n  #forkongithub a::after {\n    bottom: 1px;\n    top: auto;\n  }\n\n  #forkongithub {\n    position: absolute;\n    display: block;\n    top: 0;\n    right: 0;\n    width: 200px;\n    overflow: hidden;\n    height: 200px;\n    z-index: 9999;\n  }\n\n  #forkongithub a {\n    width: 200px;\n    position: absolute;\n    top: 60px;\n    right: -60px;\n    transform: rotate(45deg);\n    -webkit-transform: rotate(45deg);\n    -ms-transform: rotate(45deg);\n    -moz-transform: rotate(45deg);\n    -o-transform: rotate(45deg);\n    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.8);\n  }\n</style><style is="custom-style" include="demo-pages-shared-styles">\n  .vertical-section-container {\n    max-width: 800px;\n  }\n\n  .centered {\n    max-width: 800px;\n  }\n\n  nav {\n    display: block;\n  }\n\n  nav.vertical-section {\n    margin-left: 0;\n    margin-right: 0;\n    padding-top: 8px;\n    padding-bottom: 0;\n  }\n\n  nav &gt; ul {\n    padding: 0;\n  }\n\n  nav &gt; ul &gt; li {\n    padding: 0 24px 8px 0;\n    list-style: none;\n  }\n\n  nav a,\n  nav b {\n    @apply(--paper-font-button);\n  }\n\n  nav a {\n    color: var(--primary-color);\n    text-decoration: none;\n  }\n\n  nav b {\n    color: var(--secondary-text-color);\n  }\n\n  paper-button {\n    margin-left: 10px;\n    margin-right: 10px;\n  }\n\n  iron-data-table {\n    height: 400px;\n  }\n</style>';
  document.head.appendChild($_documentContainer);
  var users,
    xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      if (200 == xhr.status) {
        var json = JSON.parse(xhr.responseText);
        users = json.results;
      }
    }
  };
  xhr.open("GET", "users.json", !0);
  xhr.send();
  for (
    var templates = document.querySelectorAll("#t"), i = 0;
    i < templates.length;
    i++
  ) {
    templates[i].users = users;
  }
});
