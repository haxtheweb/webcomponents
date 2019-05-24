/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * `lrndesign-gallery-shared-styles`
 * `a shared set of styles for lrndesign-gallery`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @pseudoElement
 * @polymer
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-flex-layout/iron-flex-layout.js";
const styleElement = document.createElement("dom-module");
const css = html`
  <style>
    :host {
      display: block;
      --lrndesign-gallery-color: var(--simple-colors-default-theme-grey-12);
      --lrndesign-gallery-background-color: var(
        --simple-colors-default-theme-grey-2
      );
      --lrndesign-gallery-focus-color: var(
        --simple-colors-default-theme-accent-9
      );
      --lrndesign-gallery-border-color: var(
        --simple-colors-default-theme-grey-4
      );
      --lrndesign-gallery-thumbnail-outline: 1px solid
        var(--simple-colors-default-theme-grey-12);

      --lrndesign-gallery-dialog-color: var(
        --simple-colors-default-theme-grey-12
      );
      --lrndesign-gallery-dialog-background-color: var(
        --simple-colors-default-theme-grey-1
      );
      --lrndesign-gallery-dialog-titlebar-color: var(
        --simple-colors-default-theme-grey-1
      );
      --lrndesign-gallery-dialog-titlebar-background-color: var(
        --simple-colors-default-theme-accent-9
      );
      --lrndesign-gallery-dialog-header-color: var(
        --simple-colors-default-theme-grey-12
      );
      --lrndesign-gallery-dialog-header-background-color: var(
        --simple-colors-default-theme-grey-2
      );
      --lrndesign-gallery-carousel-next-bg: linear-gradient(
        to right,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.5) 50%,
        rgba(255, 255, 255, 0.7) 70%,
        rgba(255, 255, 255, 0.9) 90%
      );
      --lrndesign-gallery-carousel-prev-bg: linear-gradient(
        to right,
        rgba(255, 255, 255, 0.9) 10%,
        rgba(255, 255, 255, 0.7) 30%,
        rgba(255, 255, 255, 0.5) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      --lrndesign-gallery-thumbnail-image: {
        display: block;
        border-radius: 3px;
        border: 2px solid transparent;
      }
      --lrndesign-gallery-thumbnail-image-focus: {
        opacity: 0.7;
        border: 2px solid var(--lrndesign-gallery-focus-color);
      }
      --lrndesign-gallery-thumbnail-image-selected: {
        opacity: 0.5;
        cursor: default;
      }
    }
    :host([dark]) {
      --lrndesign-gallery-border-color: var(
        --simple-colors-default-theme-grey-1
      );
      --lrndesign-gallery-carousel-next-bg: linear-gradient(
        to right,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0.5) 50%,
        rgba(0, 0, 0, 0.7) 70%,
        rgba(0, 0, 0, 0.9) 90%
      );
      --lrndesign-gallery-carousel-prev-bg: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.9) 10%,
        rgba(0, 0, 0, 0.7) 30%,
        rgba(0, 0, 0, 0.5) 50%,
        rgba(0, 0, 0, 0) 100%
      );
    }
    :host([hidden]) {
      display: none;
    }
    :host .sr-only {
      position: absolute;
      left: -999999;
      height: 0;
      width: 0;
      overflow: hidden;
    }
    :host .gallerythumb {
      min-width: unset;
      max-width: 100%;
      padding: 0;
      margin: 0;
      display: inline-block;
      transform: none !important;
      position: static !important;
      cursor: pointer;
    }
    :host .gallerythumb iron-image {
      @apply --lrndesign-gallery-thumbnail-image;
    }
    :host .gallerythumb:focus iron-image,
    :host .gallerythumb:hover iron-image {
      @apply --lrndesign-gallery-thumbnail-image-focus;
    }
    :host lrndesign-gallery-zoom iron-icon {
      width: 24px;
      height: 24px;
      opacity: 0.5;
      border-radius: 3px;
      color: var(--lrndesign-gallery-color);
      background-color: var(--lrndesign-gallery-dialog-background-color);
      transition: opacity 0.5s;
    }
    :host lrndesign-gallery-zoom:focus iron-icon,
    :host lrndesign-gallery-zoom:hover iron-icon {
      opacity: 1;
    }
    :host #galleryprint {
      display: none;
    }
    @media print {
      :host #galleryscreen {
        display: none;
      }
      :host #galleryprint {
        display: block;
      }
      :host #galleryprint section {
        margin-top: 15px;
        margin-bottom: 15px;
      }
      :host #galleryprint .print-image {
        max-width: 400px;
        max-height: 400px;
        display: block;
        border: 1px solid #ddd;
        page-break-inside: avoid;
      }
    }
  </style>
`;
styleElement.appendChild(css);

styleElement.register("lrndesign-gallery-shared-styles");
