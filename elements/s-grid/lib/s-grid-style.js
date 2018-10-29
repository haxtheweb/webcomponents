var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="s-grid-style">
  <template>
    <style>

      .s-grid,
      :host ::content .s-grid {
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;

        -ms-flex-wrap: wrap;
        -webkit-flex-wrap: wrap;
        flex-wrap: wrap;

        box-sizing: border-box;
      }

      .s-grid > *,
      :host ::content .s-grid > * {
        /* Required for IE 10 */
        -ms-flex: 1 1 100%;
        -webkit-flex: 1;
        flex: 1;

        box-sizing: border-box;
      }

      .s-grid[has-aspect-ratio] > *,
      :host ::content .s-grid[has-aspect-ratio] > * {
        position: relative;
      }

      .s-grid[has-aspect-ratio] > *::before,
      :host ::content .s-grid[has-aspect-ratio] > *::before {
        display: block;
        content: "";
      }

      .s-grid[has-aspect-ratio] > * > *,
      :host ::content .s-grid[has-aspect-ratio] > * > * {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }

    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer);
