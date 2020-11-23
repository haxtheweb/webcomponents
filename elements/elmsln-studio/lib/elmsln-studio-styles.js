/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { css } from "lit-element";

const ElmslnStudioStyles = function (SuperClass) {
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
          #studio-nav {
            display: flex;
            align-items: stretch;
            justify-content: center;
            margin-bottom: var(--elmsln-studio-margin, 20px);
            flex-wrap: wrap;
          }
          #studio-nav elmsln-studio-link {
            font-family: var(--elmsln-studio-FontFamily, "Roboto", sans-serif);
            font-size: calc(1.25 * var(--elmsln-studio-FontSize, 16px));
            flex: 0 1 auto;
            color: #9d9d9d;
            padding: calc(0.25 * var(--elmsln-studio-margin, 20px))
              calc(0.25 * var(--elmsln-studio-margin, 20px));
          }
          #studio-nav elmsln-studio-link[active] {
            font-weight: bold;
            color: #000;
            --elmsln-studio-link-TextDecoration: underline !important;
            --elmsln-studio-link-TextDecorationThickness: 3px;
          }
          #studio-nav elmsln-studio-link:not([disabled]):focus-within,
          #studio-nav elmsln-studio-link:not([disabled]):hover {
            --elmsln-studio-link-TextDecoration: underline !important;
          }
          .primary-404 {
            min-height: 20vh;
            display: flex;
          }
          #message-404 {
            background-color: #ffffff;
            margin: 0 auto;
            padding: 20px;
          }
          #message-404 elmsln-studio-link {
            color: blue;
            display: inline;
          }
          #message-404 elmsln-studio-link:not([disabled]):hover,
          #message-404 elmsln-studio-link:not([disabled]):focus-within {
            text-decoration: underline;
          }
          .filters {
            padding-bottom: calc(0.5 * var(--elmsln-studio-margin, 20px));
            margin-bottom: calc(0.5 * var(--elmsln-studio-margin, 20px));
            border-bottom: 1px solid #ddd;
            line-height: calc(1.5 * var(--elmsln-studio-FontSize, 16px));
          }
          simple-fields-field {
            color: #95989a;
            --simple-fields-border-color: transparent;
            --simple-fields-font-size: var(--elmsln-studio-FontSize, 16px);
            --simple-fields-detail-font-size: var(
              --elmsln-studio-FontSize,
              16px
            );
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
          hexagon-loader {
            margin-bottom: calc(0.5 * var(--elmsln-studio-margin, 20px));
          }
          accent-card img-view-modal[slot="image-corner"] {
            float: right;
          }
          accent-card img-view-modal[slot="image-corner"],
          accent-card img-view-modal[slot="image-corner"]:focus-within,
          accent-card img-view-modal[slot="image-corner"]:hover {
            background-color: transparent;
          }
          .card elmsln-studio-link {
            --elmsln-studio-link-Color: var(--accent-card-color);
            --elmsln-studio-link-TextDecoration: none !important;
          }
          .card elmsln-studio-link:not([disabled]):focus,
          .card elmsln-studio-link:not([disabled]):focus-within,
          .card elmsln-studio-link:not([disabled]):hover {
            --elmsln-studio-link-TextDecoration: underline !important;
          }
          .card elmsln-studio-link[slot="subheading"] {
            --elmsln-studio-link-FontWeight: bold;
            --elmsln-studio-link-TextDecoration: underline !important;
          }
          .card elmsln-studio-link[slot="subheading"]:not([disabled]):focus,
          .card
            elmsln-studio-link[slot="subheading"]:not([disabled]):focus-within,
          .card elmsln-studio-link[slot="subheading"]:not([disabled]):hover {
            --elmsln-studio-link-TextDecoration: none !important;
          }
          button {
            background-color: transparent;
            border: none;
            text-align: center;
            display: block;
            color: #4b4b4b;
          }
          button[disabled] {
            cursor: not-allowed;
          }
          button:not([disabled]):focus,
          button:not([disabled]):hover {
            color: var(--simple-colors-default-theme-grey-11, #222);
          }
          button.load-more {
            text-align: center;
            display: block;
            padding: 10px;
            margin: 0;
            border-radius: 3px;
            border: none;
            width: 100%;
            color: var(--simple-colors-default-theme-grey-11, #222);
            background-color: var(--simple-colors-default-theme-grey-2, #eee);
          }
          button.load-more:not([disabled]):focus,
          button.load-more:not([disabled]):hover {
            color: var(--simple-colors-default-theme-grey-12, #000);
            background-color: var(--simple-colors-default-theme-grey-3, #ddd);
          }
          img-view-modal button {
            padding: 0;
            margin: 0;
          }
          img-view-modal simple-icon-lite {
            color: white;
            border-radius: 2px;
            --simple-icon-width: 24px;
            --simple-icon-height: 24px;
            background-color: rgba(0, 0, 0, 0.5);
          }
          img-view-modal:not([disabled]) button:hover simple-icon-lite,
          img-view-modal:not([disabled]) button:focus simple-icon-lite {
            background-color: rgba(0, 0, 0, 0.25);
          }

          img-view-modal.thumbnail {
            border-radius: 3px;
          }
          img-view-modal.thumbnail button {
            border-radius: 3px;
            position: relative;
            width: 150px;
            padding: 0;
            margin: 0;
          }
          img-view-modal.thumbnail button .imgbg {
            border-radius: 3px;
            width: 100%;
            padding-top: 100%;
            background-image: var(
              --elmsln-studio-image-button-backgroundImage,
              none
            );
            background-position: center;
            background-size: cover;
            margin: 0;
          }
          img-view-modal.thumbnail button simple-icon-lite {
            position: absolute;
            bottom: 5px;
            right: 5px;
            z-index: 2;
          }
          .thumbnail-grid {
            display: flex;
            flex-wrap: wrap;
          }
          .thumbnail-grid > * {
            flex: 0 0 50%;
            margin: calc(0.5 * var(--elmsln-studio-margin, 20px));
          }
          .rubric-table {
            border-collapse: collapse;
            margin: 0 0 calc(1 * var(--elmsln-studio-margin, 20px));
          }
          .rubric-table th,
          .rubric-table td {
            padding: 5px;
            border: 1px solid #eaeaea;
          }
          .rubric-table th {
            font-weight: normal;
          }
          .rubric-table caption {
            font-size: calc(1.25 * var(--elmsln-studio-FontSize, 16px));
            font-weight: normal;
            color: #555555;
          }
          .rubric-table thead th {
            border-bottom: 1px solid #95989a;
          }
          .rubric-table thead th:first-child,
          .rubric-table tbody th {
            border-right: 1px solid #95989a;
          }
          .rubric-table tbody tr:nth-child(2n + 1) > * {
            background-color: #f8f8f8;
          }
          #prev-next-nav {
            align-items: center;
            position: sticky;
            bottom: 0;
            margin: 0;
            background-color: #ffffff;
            -webkit-box-shadow: 0px -1px 5px 0px #b0b0b0;
            box-shadow: 0px -1px 5px 0px #b0b0b0;
          }
          #prev-next-nav {
            flex: 1 0 100%;
            display: flex;
            align-items: stretch;
            justify-content: space-between;
          }
          #prev-next-nav elmsln-studio-link {
            border: 1px solid #ddd;
            flex: 1 1 50%;
            padding: calc(0.5 * var(--elmsln-studio-margin, 20px));
          }
          #prev-next-nav elmsln-studio-link:not([disabled]):focus-within,
          #prev-next-nav elmsln-studio-link:not([disabled]):hover {
            border: 1px solid #000;
          }
          .prev-next-label span {
            display: block;
            font-weight: normal;
            text-align: center;
          }
          .prev-next-label span:first-child {
            flex: 1 0 auto;
            font-size: calc(1.25 * var(--elmsln-studio-FontSize, 16px));
            color: #4b4b4b;
          }
          .prev-next-label span:last-child {
            flex: 1 1 auto;
            font-size: calc(0.75 * var(--elmsln-studio-FontSize, 16px));
            color: #222;
          }
          @media screen and (min-width: 600px) {
            #studio-nav elmsln-studio-link {
              padding: calc(0.25 * var(--elmsln-studio-margin, 20px))
                calc(0.5 * var(--elmsln-studio-margin, 20px));
              font-size: calc(1.5 * var(--elmsln-studio-FontSize, 16px));
            }
            .thumbnail-grid > * {
              flex: 0 0 150px;
            }
          }
          @media screen and (min-width: 900px) {
            #studio-nav elmsln-studio-link {
              padding: calc(0.25 * var(--elmsln-studio-margin, 20px))
                calc(1 * var(--elmsln-studio-margin, 20px));
            }
            #primary {
              flex: 0 0 calc(66.66666667% - var(--elmsln-studio-margin, 20px));
            }
            #secondary {
              flex: 0 0 calc(33.33333333% - var(--elmsln-studio-margin, 20px));
            }
            .filters {
              display: flex;
              justify-content: space-between;
              flex-wrap: nowrap;
              height: calc(2 * var(--elmsln-studio-FontSize, 16px));
            }
          }
        `,
      ];
    }
  };
};
export { ElmslnStudioStyles };
