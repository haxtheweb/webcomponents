import { css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { SimpleTagLiteSuper } from "./simple-tag-lite.js";
import {
  SimpleFieldsButtonStyles,
  SimpleFieldsTooltipStyles,
} from "./simple-fields-ui.js";

export class SimpleTag extends SimpleTagLiteSuper(SimpleColors) {
  static get styles() {
    return [
      ...super.styles,
      SimpleFieldsButtonStyles,
      SimpleFieldsTooltipStyles,
      css`
        :host {
          --simple-fields-button-color: var(
            --simple-colors-default-theme-accent-12,
            #222222
          );
          --simple-fields-fieldset-border-color: var(
            --simple-colors-default-theme-accent-3,
            #eeeeee
          );
          --simple-fields-button-background-color: var(
            --simple-colors-default-theme-accent-3,
            #eeeeee
          );
        }
      `,
    ];
  }
  static get tag() {
    return "simple-tag";
  }
}
customElements.define(SimpleTag.tag, SimpleTag);
