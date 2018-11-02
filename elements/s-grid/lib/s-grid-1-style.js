var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="s-grid-1-style">
  <template>
    <style>

      :host,
      :host ::content {
        /* The width for an item is: (100% - subPixelAdjustment - gutter * columns) / columns */
        --s-grid-1-total-right-gutter: (var(--s-grid-1-gutter, 0px) * var(--s-grid-1-items, 1));
        --s-grid-1-item-width: calc((100% - 0.1px - var(--s-grid-1-total-right-gutter)) / var(--s-grid-1-items, 1));

        /**
         * The width for the expandible item is:
         * ((100% - subPixelAdjustment) / columns * itemColumns - gutter
         *
         * - subPixelAdjustment: 0.1px (Required for IE 11)
         * - gutter: var(--s-grid-1-gutter)
         * - columns: var(--s-grid-1-items)
         * - itemColumn: var(--s-grid-1-expandible-item-items)
         */
        --s-grid-1-expandible-item-width: calc((100% - 0.1px) / var(--s-grid-1-items, 1) * var(--s-grid-1-expandible-item-items, 1) - var(--s-grid-1-gutter, 0px));
        --s-grid-1-expandible-item: {
          -webkit-flex-basis: var(--s-grid-1-expandible-item-width) !important;
          flex-basis: var(--s-grid-1-expandible-item-width) !important;
          max-width: var(--s-grid-1-expandible-item-width) !important;
        };
      }

      .s-grid-1,
      :host ::content .s-grid-1 {
        -ms-flex-direction: var(--s-grid-1-direction, row);
        -webkit-flex-direction: var(--s-grid-1-direction, row);
        flex-direction: var(--s-grid-1-direction, row);

        padding-top: var(--s-grid-1-gutter, 0px);
        padding-left: var(--s-grid-1-gutter, 0px);
      }

      .s-grid-1 > *,
      :host ::content .s-grid-1 > * {
        -webkit-flex-basis: var(--s-grid-1-item-width);
        flex-basis: var(--s-grid-1-item-width);

        max-width: var(--s-grid-1-item-width);
        height: var(--s-grid-1-item-height, auto);

        margin-bottom: var(--s-grid-1-gutter, 0px);
        margin-right: var(--s-grid-1-gutter, 0px);
      }

      .s-grid-1[has-aspect-ratio] > *:before,
      :host ::content .s-grid-1[has-aspect-ratio] > *:before {
        padding-top: var(--s-grid-1-item-height, 100%);
      }

    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer);

/**
@license
Copyright (c) 2017 The StartPolymer Project Authors. All rights reserved.
This code may only be used under the MIT License found at https://github.com/StartPolymer/license
The complete set of authors may be found at https://github.com/StartPolymer/authors
The complete set of contributors may be found at https://github.com/StartPolymer/contributors
*/
/**
@group App Elements
@pseudoElement s-grid-1
@demo demo/index.html
*/
