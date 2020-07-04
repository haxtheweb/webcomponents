/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { css } from "lit-element";

const ElmslnStudioStyles = function(SuperClass) {
  return class extends SuperClass {
    static get styles() {
      return [
        css`
          :host {
            font-family: var(
              --elmsln-studio-secondary-FontFamily,
              "Helvetica Neue",
              sans-serif
            );
            font-family: var(--elmsln-studio-FontFamily, "Roboto", sans-serif);
            font-size: var(--elmsln-studio-FontSize, 16px);
          }
          *[hidden] {
            display: none !important;
          }
          .sr-only {
            position: absolute;
            left: -9999999px;
            width: 0;
            overflow: hidden;
          }
          .filters {
            padding-bottom: calc(0.5 * var(--elmsln-studio-margin, 20px));
            margin-bottom: calc(0.5 * var(--elmsln-studio-margin, 20px));
            border-bottom: 1px solid #ddd;
            height: calc(2 * var(--elmsln-studio-FontSize, 16px));
            line-height: calc(1.5 * var(--elmsln-studio-FontSize, 16px));
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
          }
          simple-fields-field {
            color: #95989a;
            --simple-fields-border-color: transparent;
            --simple-fields-font-size: var(--elmsln-studio-FontSize, 16px);
            --simple-fields-detail-font-size: var(--elmsln-studio-FontSize, 16px);
            --simple-fields-line-height: calc(
              1.5 * var(--elmsln-studio-FontSize, 16px)
            );
            --simple-fields-detail-line-height: calc(
              1.5 * var(--elmsln-studio-FontSize, 16px)
            );
            --simple-fields-font-family: var(
              --elmsln-studio-FontFamily,
              "Roboto",
              sans-serif
            );
            --simple-fields-detail-font-family: var(
              --elmsln-studio-FontFamily,
              "Roboto",
              sans-serif
            );
          }
          accent-card [slot="image-corner"] {
            display: inline-flex;
            right: 5px;
            bottom: 10px;
            position: absolute;
            border-radius: 3px;
            background-color: rgba(0, 0, 0, 0.25);
          }
          accent-card [slot="image-corner"]:focus-within,
          accent-card [slot="image-corner"]:hover {
            background-color: rgba(0, 0, 0, 0.5);
          }
          accent-card button {
            padding: calc(0.5 * var(--elmsln-studio-margin, 20px));
            background-color: transparent;
            border: none;
            padding: 0;
            flex: 1 1 auto;
          }
          accent-card button:last-child {
            text-align: right;
          }
          .load-more {
            text-align: center;
            display: block;
            padding: 10px;
            margin: 0;
            border-radius: 3px;
            border: none;
            background-color: var(--simple-colors-default-theme-grey-2, #eee);
            color: var(--simple-colors-default-theme-grey11, #222);
            width: 100%;
          }
          .load-more:focus,
          .load-more:hover {
            background-color: var(--simple-colors-default-theme-grey-3, #ddd);
            color: var(--simple-colors-default-theme-grey12, #000);
          }
          @media screen and (min-width: 900px) {
            #primary {
              flex: 0 0 calc(66.66666667% - var(--elmsln-studio-margin, 20px));
            }
            #secondary {
              flex: 0 0 calc(33.33333333% - var(--elmsln-studio-margin, 20px));
            }
          }
        `
      ];
    };
  };
};
export { ElmslnStudioStyles };
