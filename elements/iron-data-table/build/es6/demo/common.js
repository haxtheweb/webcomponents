import "../lib/default-styles.js";
import "../iron-data-table.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
$_documentContainer.innerHTML = `<style is="custom-style">
  #forkongithub a {
    background: var(--default-primary-color);
    color: #fff;
    text-decoration: none;
    font-family: arial, sans-serif;
    text-align: center;
    font-weight: bold;
    padding: 5px 40px;
    font-size: 12.8px;
    line-height: 22.4px;
    position: relative;
    transition: 0.5s;
  }

  #forkongithub a::before,
  #forkongithub a::after {
    content: "";
    width: 100%;
    display: block;
    position: absolute;
    top: 1px;
    left: 0;
    height: 1px;
    background: #fff;
  }

  #forkongithub a::after {
    bottom: 1px;
    top: auto;
  }

  #forkongithub {
    position: absolute;
    display: block;
    top: 0;
    right: 0;
    width: 200px;
    overflow: hidden;
    height: 200px;
    z-index: 9999;
  }

  #forkongithub a {
    width: 200px;
    position: absolute;
    top: 60px;
    right: -60px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.8);
  }
</style><style is="custom-style" include="demo-pages-shared-styles">
  .vertical-section-container {
    max-width: 800px;
  }

  .centered {
    max-width: 800px;
  }

  nav {
    display: block;
  }

  nav.vertical-section {
    margin-left: 0;
    margin-right: 0;
    padding-top: 8px;
    padding-bottom: 0;
  }

  nav &gt; ul {
    padding: 0;
  }

  nav &gt; ul &gt; li {
    padding: 0 24px 8px 0;
    list-style: none;
  }

  nav a,
  nav b {
    @apply(--paper-font-button);
  }

  nav a {
    color: var(--primary-color);
    text-decoration: none;
  }

  nav b {
    color: var(--secondary-text-color);
  }

  paper-button {
    margin-left: 10px;
    margin-right: 10px;
  }

  iron-data-table {
    height: 400px;
  }
</style>`;
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
