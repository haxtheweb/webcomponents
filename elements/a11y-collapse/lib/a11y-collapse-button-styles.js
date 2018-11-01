var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="a11y-collapse-button-styles">
    <template>
      <custom-style>
        <style is="custom-style">
            :host #heading {
                display: flex;
                justify-content: stretch;
                align-items: center;
                padding: 0em var(--a11y-collapse-horizontal-padding, 1em);
                font-weight: bold;
                @apply --a11y-collapse-heading;
            }
            :host #text {
                flex-grow: 1;
                @apply --a11y-collapse-heading-text;
            }
            :host #expand {
                transition: transform 0.5s;
                @apply --a11y-collapse-icon;
            }
            :host #expand[rotated] {
                transform: rotate(-90deg);
                @apply --a11y-collapse-icon-rotated;
            }
            :host [aria-controls] {
                cursor: pointer;
            }
            :host([disabled]) [aria-controls] {
                cursor: not-allowed;
            }
            :host([expanded]) #heading {
                @apply --a11y-collapse-heading-expanded;
            }
            :host([expanded]) #text {
                @apply --a11y-collapse-heading-text-expanded;
            }
            :host([expanded]) #expand {
                @apply --a11y-collapse-icon-expanded;
            }
        </style>
      </custom-style>
    </template>
  </dom-module>`;

document.head.appendChild($_documentContainer);

/**
`a11y-collapse-button-styles`
Styling for buttons on a11y-collapse

@demo demo/index.html
*/
