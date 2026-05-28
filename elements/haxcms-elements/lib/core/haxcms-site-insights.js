import { store } from "./haxcms-site-store.js";
import { toJS } from "mobx";
import { LitElement, html, css } from "lit";
import { HAXCMSI18NMixin } from "./utils/HAXCMSI18NMixin.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { enableServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";
import "@haxtheweb/editable-table/lib/editable-table-display.js";
import "@haxtheweb/simple-fields/simple-fields.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/iframe-loader/lib/loading-indicator.js";
import { learningComponentTypes } from "@haxtheweb/d-d-d/lib/DDDStyles.js";

enableServices(["core"]);

/**
 * `haxcms-outline-editor-dialog`
 * `Dialog for presenting an editable outline`
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 */
class HAXCMSShareDialog extends HAXCMSI18NMixin(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          --haxcms-admin-panel-height: calc(
            var(--simple-modal-height, 80vh) - var(
                --simple-modal-titlebar-height,
                80px
              ) - var(--ddd-spacing-8, 32px)
          );
          --haxcms-insights-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --haxcms-insights-surface: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --haxcms-insights-surface-subtle: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
          --haxcms-insights-border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
          --haxcms-insights-link-color: light-dark(
            var(--ddd-theme-default-navy),
            var(--ddd-theme-default-linkLight)
          );
          --haxcms-insights-link-hover-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --haxcms-insights-focus-color: light-dark(
            var(--ddd-theme-default-skyBlue),
            var(--ddd-theme-default-keystoneYellow)
          );
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          font-family: var(--ddd-font-primary);
          min-height: min(60vh, var(--haxcms-admin-panel-height));
          height: var(--haxcms-admin-panel-height);
          max-height: var(--haxcms-admin-panel-height);
          overflow: hidden;
          padding: var(--ddd-spacing-4);
          color: var(--haxcms-insights-color);
          background: var(--haxcms-insights-surface);
          flex-shrink: 0;
        }
        .report-tabs {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          flex-wrap: wrap;
          margin-bottom: var(--ddd-spacing-2);
        }
        .report-tabs .report-tab-button {
          --simple-icon-button-border: var(--ddd-border-xs) solid
            var(--haxcms-insights-border-color);
          --simple-icon-button-border-radius: var(--ddd-radius-sm);
          --simple-icon-button-padding: var(--ddd-spacing-2)
            var(--ddd-spacing-3);
          --simple-icon-height: var(--ddd-icon-xs);
          --simple-icon-width: var(--ddd-icon-xs);
          --simple-icon-color: var(--haxcms-insights-color);
          --simple-icon-button-background-color: var(--haxcms-insights-surface);
          --simple-icon-button-focus-background-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-nittanyNavy)
          );
          color: var(--haxcms-insights-color);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-s);
        }
        .report-tabs .report-tab-button[toggled] {
          --simple-icon-button-border: var(--ddd-border-sm) solid
            var(--ddd-theme-default-navy);
          --simple-icon-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-white)
          );
          --simple-icon-button-background-color: light-dark(
            var(--ddd-theme-default-navy),
            var(--ddd-theme-default-potentialMidnight)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-white)
          );
        }
        .report-tabs .report-tab-button[toggled]::part(button) {
          font-weight: var(--ddd-font-weight-bold);
          box-shadow: inset 0 0 0 2px
            light-dark(
              var(--ddd-theme-default-limestoneLight),
              var(--ddd-theme-default-slateGray)
            );
        }
        .report-tabs .report-tab-button::part(button) {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }
        .report-tabs .report-tab-button:focus-within {
          outline: var(--ddd-border-sm) solid var(--haxcms-insights-focus-color);
          outline-offset: 2px;
          border-radius: var(--ddd-radius-sm);
        }
        .report-panel {
          display: flex;
          flex-direction: column;
          min-height: 0;
          flex: 1;
          border: var(--ddd-border-sm);
          border-color: var(--haxcms-insights-border-color);
          border-radius: var(--ddd-radius-md);
          background: var(--haxcms-insights-surface-subtle);
          padding: var(--ddd-spacing-4);
          gap: var(--ddd-spacing-3);
        }
        .report-filters {
          display: block;
        }
        .report-filters form {
          margin: 0;
        }
        .report-table-scroll {
          width: 100%;
          min-height: 0;
          overflow-x: auto;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .report-table-scroll editable-table-display {
          --ddd-theme-body-font-size: var(--ddd-font-size-6xs, 10px);
          --editable-table-font-family: var(--ddd-font-navigation);
          --editable-table-font-size: var(--ddd-font-size-6xs, 10px);
          display: block;
          min-width: 760px;
        }
        .report-table-scroll .report-native-table {
          width: 100%;
          min-width: 760px;
          border-collapse: collapse;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-6xs, 10px);
          background: var(--haxcms-insights-surface);
          color: var(--haxcms-insights-color);
        }
        .report-table-scroll .report-native-table caption {
          text-align: left;
          margin-bottom: var(--ddd-spacing-2);
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-xs);
        }
        .report-table-scroll .report-native-table th,
        .report-table-scroll .report-native-table td {
          border: var(--ddd-border-xs) solid var(--haxcms-insights-border-color);
          padding: var(--ddd-spacing-2);
          text-align: left;
          vertical-align: top;
        }
        .report-table-scroll .report-native-table thead th {
          background: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-nittanyNavy)
          );
          font-weight: var(--ddd-font-weight-bold);
        }
        .panel-shell {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          gap: var(--ddd-spacing-2);
        }
        .panel-scroll {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }
        .selector-wrapper {
          margin-bottom: var(--ddd-spacing-6);
          font-size: var(--ddd-font-size-m);
          line-height: var(--ddd-lh-120);
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          flex-wrap: wrap;
        }
        .selector-wrapper label {
          font-weight: var(--ddd-font-weight-bold);
          font-family: var(--ddd-font-navigation);
          color: var(--haxcms-insights-color);
        }
        .selector-wrapper select {
          font-size: var(--ddd-font-size-s);
          line-height: var(--ddd-lh-120);
          padding: var(--ddd-spacing-2);
          border: var(--ddd-border-xs);
          border-color: var(--haxcms-insights-border-color);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--haxcms-insights-surface);
          color: var(--haxcms-insights-color);
          font-family: var(--ddd-font-navigation);
        }
        .selector-wrapper select:focus-visible {
          outline: var(--ddd-border-sm) solid var(--haxcms-insights-focus-color);
          outline-offset: 2px;
        }
        .selector-wrapper simple-icon-button-lite {
          --simple-icon-button-border: var(--ddd-border-xs) solid
            var(--haxcms-insights-border-color);
          --simple-icon-button-border-radius: var(--ddd-radius-xs);
          --simple-icon-button-padding: var(--ddd-spacing-2)
            var(--ddd-spacing-3);
          --simple-icon-height: var(--ddd-icon-xs);
          --simple-icon-width: var(--ddd-icon-xs);
          --simple-icon-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-white)
          );
          --simple-icon-button-background-color: light-dark(
            var(--ddd-theme-default-skyBlue),
            var(--ddd-primary-4)
          );
          --simple-icon-button-focus-background-color: light-dark(
            var(--ddd-theme-default-original87Pink),
            var(--ddd-primary-5)
          );
          --simple-icon-button-focus-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-white)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-white)
          );
          font-family: var(--ddd-font-navigation);
        }
        .selector-wrapper simple-icon-button-lite:focus-within {
          outline: var(--ddd-border-sm) solid var(--haxcms-insights-focus-color);
          outline-offset: 2px;
          border-radius: var(--ddd-radius-xs);
        }
        .selector-wrapper simple-icon-button-lite::part(button) {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }
        .selector-wrapper simple-icon-button-lite:hover {
          --simple-icon-button-background-color: light-dark(
            var(--ddd-theme-default-original87Pink),
            var(--ddd-primary-5)
          );
        }
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .report-highlight-list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: var(--ddd-spacing-3);
          align-items: stretch;
        }
        .group-set {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-4);
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: var(--ddd-spacing-1);
        }
        details {
          max-width: 100%;
          min-width: 100%;
          box-sizing: border-box;
        }
        .group {
          margin: 0;
          border: var(--ddd-border-sm);
          border-color: var(--haxcms-insights-border-color);
          border-radius: var(--ddd-radius-md);
          background: var(--haxcms-insights-surface);
          padding: var(--ddd-spacing-4);
        }
        .group-summary {
          list-style: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: var(--ddd-spacing-3);
          margin-bottom: 0;
          font-size: var(--ddd-font-size-m);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--haxcms-insights-color);
          background-color: var(--haxcms-insights-surface-subtle);
          border-radius: var(--ddd-radius-sm);
          text-wrap: wrap;
          padding: var(--ddd-spacing-4);
          user-select: none;
          transition:
            background-color 0.2s ease-in-out,
            color 0.2s ease-in-out;
        }
        .group[open] .group-summary {
          margin-bottom: var(--ddd-spacing-3);
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .group-summary::-webkit-details-marker {
          display: none;
        }
        .group-summary::marker {
          content: "";
        }
        .group-summary::after {
          content: "";
        }
        .group-summary:focus,
        .group-summary:hover {
          background-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-nittanyNavy)
          );
        }
        .group-summary:focus-visible {
          outline: var(--ddd-border-sm) solid var(--haxcms-insights-focus-color);
          outline-offset: 2px;
          border-radius: var(--ddd-radius-xs);
        }
        .summary-leading {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }
        .summary-toggle-icon {
          display: inline-flex;
          align-items: center;
          margin-left: auto;
        }
        .summary-toggle-icon simple-icon-lite {
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-3xs, 20px);
          --simple-icon-height: var(--ddd-icon-3xs, 20px);
        }
        .group .group-summary .collapse-icon-expanded {
          display: none;
        }
        .group[open] .group-summary .collapse-icon-collapsed {
          display: none;
        }
        .group[open] .group-summary .collapse-icon-expanded {
          display: inline-flex;
        }
        .group-body {
          padding: 0;
          border-top: 0;
          background: transparent;
          color: var(--haxcms-insights-color);
        }
        h2 {
          margin: 0 0 var(--ddd-spacing-4) 0;
          font-size: var(--ddd-font-size-m);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--haxcms-insights-color);
        }
        .summary-leading simple-icon-lite {
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-3xs, 20px);
          --simple-icon-height: var(--ddd-icon-3xs, 20px);
        }
        .group-summary h3 {
          margin: 0;
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
        }
        .group-body a {
          color: var(--haxcms-insights-link-color);
        }
        .group-body a:hover,
        .group-body a:focus,
        .group-body a:active {
          color: var(--haxcms-insights-link-hover-color);
        }
        .group-body a:focus-visible {
          outline: var(--ddd-border-sm) solid var(--haxcms-insights-focus-color);
          outline-offset: 2px;
          border-radius: var(--ddd-radius-xs);
        }
        .group-body loading-indicator {
          --loading-indicator-color: var(--ddd-theme-default-skyBlue);
        }
        simple-fields {
          --simple-fields-color: var(--haxcms-insights-color);
          --simple-fields-background-color: transparent;
          --simple-fields-select-option-background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --simple-fields-select-option-selected-background-color: light-dark(
            var(--ddd-theme-default-skyBlue),
            var(--ddd-theme-default-potentialMidnight)
          );
          --simple-fields-button-background-color: transparent;
          --simple-icon-width: var(--ddd-icon-xs);
          --simple-icon-height: var(--ddd-icon-xs);
        }
        simple-fields-field[type="checkbox"],
        simple-fields-field[type="select"] {
          display: inline-block;
          margin: var(--ddd-spacing-2) var(--ddd-spacing-3) var(--ddd-spacing-2)
            0;
        }
        simple-icon {
          --simple-icon-height: var(--ddd-icon-4xs, 24px);
          --simple-icon-width: var(--ddd-icon-4xs, 24px);
          padding: 2px;
        }
        .content-item {
          min-height: 225px;
          width: 100%;
          max-width: 100%;
          border: var(--ddd-border-sm);
          border-color: var(--haxcms-insights-border-color);
          border-radius: var(--ddd-radius-md);
          background: var(--haxcms-insights-surface-subtle);
          padding: var(--ddd-spacing-4);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3);
        }
        .content-item .title-link {
          text-decoration: none;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--haxcms-insights-link-color);
          display: inline-flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-2);
        }
        .content-item-title {
          margin: 0;
          font-size: var(--ddd-font-size-s);
          line-height: var(--ddd-lh-120);
        }
        .content-item .title-link:hover,
        .content-item .title-link:focus,
        .content-item .title-link:active {
          text-decoration: underline;
          color: var(--haxcms-insights-link-hover-color);
        }
        .content-item .title-link:focus-visible {
          outline: var(--ddd-border-sm) solid var(--haxcms-insights-focus-color);
          outline-offset: 2px;
          border-radius: var(--ddd-radius-xs);
        }
        .content-item .meta {
          font-size: var(--ddd-font-size-xs, 12px);
          line-height: var(--ddd-lh-140, 1.4);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
        }
        .content-item .stats {
          margin: 0;
          padding: 0;
          display: grid;
          gap: var(--ddd-spacing-1);
        }
        .content-item .stats li {
          display: flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-2);
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .content-item .stats li simple-icon {
          --simple-icon-height: var(--ddd-icon-4xs, 20px);
          --simple-icon-width: var(--ddd-icon-4xs, 20px);
          padding: 0;
          flex-shrink: 0;
        }
        .content-list li {
          display: block;
          margin: 0;
          padding: 0;
          font-size: var(--ddd-font-size-xs, 12px);
        }
        .reports {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-4);
          padding: 0;
        }
        .reports lesson-highlight {
          --lesson-highlight-grid-template-columns: 3.5em
            var(--ddd-spacing-2, 8px) minmax(0, 1fr);
          --lesson-highlight-internal-margin: 0;
          --lesson-highlight-internal-padding: var(--ddd-spacing-3);
          --simple-colors-default-theme-accent-8: light-dark(
            var(--ddd-theme-default-navy),
            var(--ddd-theme-default-limestoneLight)
          );
          --simple-colors-default-theme-accent-9: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
          --simple-colors-default-theme-accent-10: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --simple-colors-default-theme-accent-11: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --simple-colors-default-theme-accent-12: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --simple-colors-default-theme-grey-1: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
          --simple-colors-default-theme-grey-4: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
          --simple-colors-default-theme-grey-8: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
          --simple-colors-default-theme-grey-10: var(--haxcms-insights-color);
          --simple-colors-default-theme-grey-12: var(--haxcms-insights-color);
          --lesson-highlight-icon-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --lesson-highlight-icon-border-color: light-dark(
            var(--ddd-theme-default-navy),
            var(--ddd-theme-default-limestoneLight)
          );
          --lesson-highlight-icon-background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-nittanyNavy)
          );
          --lesson-highlight-text-color: var(--haxcms-insights-color);
          --lesson-highlight-subtext-color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .reports .recently-updated-items {
          font-size: var(--ddd-font-size-s);
          line-height: var(--ddd-lh-140, 1.4);
          margin: 0;
          padding-left: var(--ddd-spacing-4);
        }
        .reports .recently-updated-items li {
          margin-bottom: var(--ddd-spacing-1);
        }
        .reports-wrapper,
        .linkchecker-wrapper,
        .contentbrowser-wrapper,
        .mediabrowser-wrapper {
          padding: var(--ddd-spacing-4);
        }
        .media-list li {
          margin: 0;
          display: block;
        }
        .media-item {
          width: 100%;
          max-width: 100%;
          border: var(--ddd-border-sm);
          border-color: var(--haxcms-insights-border-color);
          border-radius: var(--ddd-radius-md);
          background: var(--haxcms-insights-surface-subtle);
          padding: var(--ddd-spacing-4);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3);
          min-height: 100%;
        }
        .media-item-header {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
        }
        .media-item-title {
          margin: 0;
          font-size: var(--ddd-font-size-s);
          line-height: var(--ddd-lh-120);
          font-weight: var(--ddd-font-weight-bold);
          word-break: break-word;
        }
        .media-item-meta {
          margin: 0;
          font-size: var(--ddd-font-size-xs, 12px);
          line-height: var(--ddd-lh-120);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .media-item-preview {
          width: 100%;
          max-width: 100%;
        }
        .media-item-preview simple-img,
        .media-item-preview iframe,
        .media-item-preview video-player {
          width: 100%;
          max-width: 100%;
          border-radius: var(--ddd-radius-sm);
          overflow: hidden;
          border: 0;
        }
        .media-item-preview iframe,
        .media-item-preview video-player {
          min-height: 220px;
        }
        .media-item-preview simple-img {
          min-height: 180px;
        }
        .media-item-audit {
          margin-top: var(--ddd-spacing-2);
        }
        .content-list,
        .media-list {
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--ddd-spacing-4);
        }
        @media screen and (max-width: 900px) {
          :host {
            min-width: 0;
            width: 100%;
            padding: var(--ddd-spacing-3);
          }
          .group {
            padding: var(--ddd-spacing-3);
          }
          .report-highlight-list,
          .content-list,
          .media-list {
            grid-template-columns: 1fr;
          }
        }
      `,
    ];
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "activeTab" && this[propName]) {
        this.refreshData();
      }
    });
  }
  _activeSchema() {
    switch (this.activeTab) {
      case "linkchecker":
        return this.shadowRoot.querySelector("#linkchecker-schema");
      case "contentbrowser":
        return this.shadowRoot.querySelector("#contentbrowser-schema");
      case "mediabrowser":
        return this.shadowRoot.querySelector("#mediabrowser-schema");
      default:
        return null;
    }
  }
  _activeTabInternalEndpoint() {
    switch (this.activeTab) {
      case "reports":
        return toJS(store.appSettings.insightsPath) || null;
      case "linkchecker":
        return toJS(store.appSettings.linkCheckerPath) || null;
      case "contentbrowser":
        return toJS(store.appSettings.contentBrowserPath) || null;
      case "mediabrowser":
        return toJS(store.appSettings.mediaBrowserPath) || null;
      default:
        return null;
    }
  }
  async _callInternalReportEndpoint(endpoint, params) {
    const headers = {
      "Content-Type": "application/json",
    };
    let method;
    let jwt;
    if (store.appSettings.method) {
      method = toJS(store.appSettings.method);
    }
    if (store.appSettings.jwt) {
      jwt = store.appSettings.jwt;
    }
    if (
      (!jwt || jwt === "" || jwt === "null" || jwt === "undefined") &&
      store.jwt
    ) {
      jwt = toJS(store.jwt);
    }
    if (
      typeof jwt === "string" &&
      jwt !== "" &&
      jwt !== "null" &&
      jwt !== "undefined"
    ) {
      headers.Authorization = `Bearer ${jwt}`;
      params.jwt = jwt;
    }
    try {
      const response = await fetch(endpoint + (method === "GET" ? "?" + new URLSearchParams(params) : ""), {
        method: method || "POST",
        credentials: "same-origin",
        headers,
        body: (method === "GET" ? undefined : JSON.stringify(params)),
      });
      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }
      const data = await response.json();
      this._reportsResponse(data);
    } catch (error) {
      this.loading = false;
      console.warn(
        "haxcms-site-insights: failed internal report endpoint",
        endpoint,
        error,
      );
    }
  }
  _reportTabs() {
    return [
      { id: "reports", label: this.t.stats, icon: "hax:graph" },
      { id: "mediabrowser", label: this.t.media, icon: "icons:perm-media" },
      {
        id: "contentbrowser",
        label: this.t.content,
        icon: "icons:view-module",
      },
      { id: "linkchecker", label: this.t.links, icon: "icons:link" },
    ];
  }
  _activeReport() {
    const tabs = this._reportTabs();
    const current = tabs.find((tab) => tab.id === this.activeTab);
    return current ? current : tabs[0];
  }
  _reportTabClicked(e) {
    if (!e || !e.currentTarget) {
      return;
    }
    const tabId = e.currentTarget.getAttribute("data-tab");
    if (!tabId) {
      return;
    }
    if (this.activeTab !== tabId) {
      this.activeTab = tabId;
    } else {
      this.refreshData();
    }
  }

  _reportsResponse(data) {
    this.loading = false;
    const responseData =
      data && data.data && typeof data.data === "object" ? data.data : {};
    this.data = responseData;
    // for filtering purposes
    this._originalData = JSON.parse(JSON.stringify(responseData));
    this.filters = {};
    setTimeout(() => {
      const schema = this._activeSchema();
      if (!schema && this.activeTab !== "reports") {
        return;
      }
      switch (this.activeTab) {
        case "linkchecker":
          this.filters = { links: "all" };
          schema.value = this.filters;
          schema.values = this.filters;
          schema.fields = [
            {
              property: "links",
              title: "Link status",
              inputMethod: "select",
              options: {
                all: "All",
                error: "Error only",
                ok: "OK only",
              },
            },
          ];
          break;
        case "contentbrowser":
          this.filters = {
            sort: "title",
            title: "",
            hasVideo: false,
            hasH5P: false,
            hasAuthorNotes: false,
            hasLinks: false,
            hasImages: false,
            hasPlaceholders: false,
            hasSiteRemoteContent: false,
          };
          schema.value = this.filters;
          schema.fields = [
            {
              property: "title",
              title: "Title",
              inputMethod: "textfield",
            },
            {
              property: "pageType",
              title: "Page type",
              inputMethod: "select",
              options: {
                "": "",
                ...learningComponentTypes,
              },
            },
            {
              property: "sort",
              title: "Sort by",
              inputMethod: "select",
              options: {
                title: "Title",
                lastUpdated: "Last updated",
                contentLength: "Content length",
              },
            },
            {
              property: "hasAuthorNotes",
              title: "Author notes",
              description: "Includes content editor notes",
              inputMethod: "boolean",
            },
            {
              property: "hasVideo",
              title: "Video",
              description: "Includes video",
              inputMethod: "boolean",
            },
            {
              property: "hasH5P",
              title: "H5P",
              description: "Includes h5p",
              inputMethod: "boolean",
            },
            {
              property: "hasPlaceholders",
              title: "Placeholders",
              description: "Includes placeholders",
              inputMethod: "boolean",
            },
            {
              property: "hasSiteRemoteContent",
              title: "Remote content",
              description: "Includes remote content",
              inputMethod: "boolean",
            },
            {
              property: "hasLinks",
              title: "Links",
              description: "Includes external links",
              inputMethod: "boolean",
            },
            {
              property: "hasImages",
              title: "Images",
              description: "Includes images",
              inputMethod: "boolean",
            },
          ];
          break;
        case "mediabrowser":
          this.filters = { title: "", type: "all", location: "all" };
          schema.fields = [
            {
              property: "title",
              title: "Title",
              inputMethod: "textfield",
            },
            {
              property: "status",
              title: "Status",
              inputMethod: "select",
              options: {
                all: "All",
                info: "No issues",
                warning: "Warnings",
                error: "Errors",
              },
            },
            {
              property: "type",
              title: "Media type",
              inputMethod: "select",
              options: {
                all: "All",
                audio: this.t.audio,
                video: this.t.video,
                image: this.t.images,
                h5p: "H5P",
                document: "Document",
              },
            },
            {
              property: "location",
              title: "Location",
              inputMethod: "select",
              options: {
                all: "All",
                external: "External only",
                internal: "Internal only",
              },
            },
          ];
          schema.value = this.filters;
          schema.values = this.filters;
          break;
      }
    }, 0);
  }
  _normalizeReportSelectionValue(value) {
    if (value === null || typeof value === "undefined") {
      return "";
    }
    if (typeof value === "string") {
      return value.trim();
    }
    return `${value}`;
  }
  _reportSelectionChanged(e) {
    const value = e && e.currentTarget ? e.currentTarget.value : "";
    this.selectedReportId = this._normalizeReportSelectionValue(value);
    this.refreshData();
  }
  refreshData() {
    const site = toJS(store.manifest);
    const selector =
      this.shadowRoot && this.shadowRoot.querySelector
        ? this.shadowRoot.querySelector("#selector")
        : null;
    const jwt =
      store && store.jwt && typeof toJS(store.jwt) === "string"
        ? toJS(store.jwt)
        : "";
    const siteName =
      site &&
      site.metadata &&
      site.metadata.site &&
      site.metadata.site.name
        ? site.metadata.site.name
        : "";
    const params = {
      site: {
        name: siteName,
      },
      activeId: null,
      jwt: jwt,
    };
    const selectedReportId = this._normalizeReportSelectionValue(
      selector ? selector.value : this.selectedReportId,
    );
    this.selectedReportId = selectedReportId;
    if (selectedReportId !== "") {
      params.activeId = selectedReportId;
    }
    this.loading = true;
    const internalEndpoint = this._activeTabInternalEndpoint();
    if (!internalEndpoint) {
      this.loading = false;
      return;
    }
    this._callInternalReportEndpoint(internalEndpoint, params);
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    // Legacy custom element name retained for compatibility; this element renders Reports UI.
    return "haxcms-site-insights";
  }
  getReadingTime(value) {
    let readVal = [];
    var hours = Math.floor(value / 60);
    var minutes = Math.floor(value - hours * 60);
    // handle hours of reading
    if (hours === 1) {
      readVal.push(`${hours} ${this.t.hour}`);
    } else if (hours === 0) {
      // do nothing for 0
    } else {
      readVal.push(`${hours} ${this.t.hours}`);
    }
    // minutes
    if (minutes === 1) {
      readVal.push(`${minutes} ${this.t.minute}`);
    } else if (minutes === 0) {
      // do nothing for 0
    } else {
      readVal.push(`${minutes} ${this.t.minutes}`);
    }
    return readVal.join(", ");
  }
  closeModal() {
    globalThis.dispatchEvent(new CustomEvent("simple-modal-hide"));
  }
  linkFormChanged(e) {
    if (
      e &&
      e.detail &&
      e.detail.value &&
      typeof e.detail.value.links === "string"
    ) {
      this.filters.links = e.detail.value.links;
    } else {
      this.filters.links = "all";
    }
    this.requestUpdate();
  }
  contentBrowserFormChanged(e) {
    const baseData =
      this._originalData && typeof this._originalData === "object"
        ? this._originalData
        : {};
    this.data = JSON.parse(JSON.stringify(baseData));
    let val =
      e &&
      e.detail &&
      e.detail.value &&
      typeof e.detail.value === "object"
        ? e.detail.value
        : {};
    this.filters = {
      title: val.title ? val.title : "",
      sort: val.sort ? val.sort : "title",
      pageType: val.pageType ? val.pageType : "",
      hasVideo: val.hasVideo ? val.hasVideo : false,
      hasH5P: val.hasH5P ? val.hasH5P : false,
      hasAuthorNotes: val.hasAuthorNotes ? val.hasAuthorNotes : false,
      hasPlaceholders: val.hasPlaceholders ? val.hasPlaceholders : false,
      hasSiteRemoteContent: val.hasSiteRemoteContent
        ? val.hasSiteRemoteContent
        : false,
      hasLinks: val.hasLinks ? val.hasLinks : false,
      hasImages: val.hasImages ? val.hasImages : false,
    };
    if (this.data && this.data.contentData) {
      this.data.contentData = this.data.contentData.filter((item) => {
        if (this.filters.hasVideo === true && item.videos === 0) {
          return false;
        }
        if (this.filters.hasH5P === true && item.h5p === 0) {
          return false;
        }
        if (this.filters.hasAuthorNotes === true && item.authorNotes === 0) {
          return false;
        }
        if (this.filters.hasPlaceholders === true && item.placeholders === 0) {
          return false;
        }
        if (
          this.filters.hasSiteRemoteContent === true &&
          item.siteremotecontent === 0
        ) {
          return false;
        }
        if (this.filters.hasLinks === true && item.links === 0) {
          return false;
        }
        if (this.filters.hasImages === true && item.images === 0) {
          return false;
        }
        // skip type if not set or require exact match
        if (this.filters.pageType == "" || !this.filters.pageType) {
          return true;
        } else if (item.pageType != this.filters.pageType) {
          return false;
        }
        // no filtering, skip
        if (this.filters.title == "") {
          return true;
        } else if (
          !item.title.toLowerCase().includes(this.filters.title.toLowerCase())
        ) {
          return false;
        }
        return true;
      });
      this.data.contentData.sort((a, b) => {
        switch (this.filters.sort) {
          case "title":
            return a.title.localeCompare(b.title);
            break;
          case "contentLength":
            return b.readTime - a.readTime;
            break;
          case "lastUpdated":
            return new Date(b.updated) - new Date(a.updated);
            break;
        }
      });
    }
  }
  mediaBrowserFormChanged(e) {
    const baseData =
      this._originalData && typeof this._originalData === "object"
        ? this._originalData
        : {};
    this.data = JSON.parse(JSON.stringify(baseData));
    let val =
      e &&
      e.detail &&
      e.detail.value &&
      typeof e.detail.value === "object"
        ? e.detail.value
        : {};
    this.filters = {
      title: val.title ? val.title : "",
      type: val.type ? val.type : "all",
      status: val.status ? val.status : "all",
      location: val.location ? val.location : "all",
    };
    if (this.data && this.data.mediaData) {
      this.data.mediaData = this.data.mediaData.filter((item) => {
        if (this.filters.location != "all") {
          if (this.filters.location != item.locType) {
            return false;
          } else {
            return true;
          }
        }
        return true;
      });
      this.data.mediaData = this.data.mediaData.filter((item) => {
        if (this.filters.status != "all") {
          if (this.filters.status != item.status) {
            return false;
          } else {
            return true;
          }
        }
        return true;
      });
      this.data.mediaData = this.data.mediaData.filter((item) => {
        if (this.filters.type != "all") {
          if (this.filters.type != item.type) {
            return false;
          } else {
            return true;
          }
        }
        return true;
      });
      this.data.mediaData = this.data.mediaData.filter((item) => {
        // no filtering, skip
        if (!this.filters.title || this.filters.title == "") {
          return true;
        } else if (
          this.filters.title.toLowerCase &&
          !item.name.toLowerCase().includes(this.filters.title.toLowerCase())
        ) {
          return false;
        }
        return true;
      });
    }
  }
  _renderActiveFilters() {
    switch (this.activeTab) {
      case "linkchecker":
        return html`<div class="report-filters">
          <form>
            <simple-fields
              id="linkchecker-schema"
              autofocus
              @value-changed="${this.linkFormChanged}"
            ></simple-fields>
          </form>
        </div>`;
      case "contentbrowser":
        return html`<div class="report-filters">
          <form>
            <simple-fields
              id="contentbrowser-schema"
              autofocus
              @value-changed="${this.contentBrowserFormChanged}"
            ></simple-fields>
          </form>
        </div>`;
      case "mediabrowser":
        return html`<div class="report-filters">
          <form>
            <simple-fields
              id="mediabrowser-schema"
              autofocus
              @value-changed="${this.mediaBrowserFormChanged}"
            ></simple-fields>
          </form>
        </div>`;
      default:
        return html``;
    }
  }
  _activeEmptyStateMessage() {
    switch (this.activeTab) {
      case "linkchecker":
        return this.t.noLinksInSelectedPages;
      case "mediabrowser":
        return this.t.noMediaInSelectedPages;
      case "contentbrowser":
        return this.t.noContentInSelectedPages;
      default:
        return this.t.noReportData;
    }
  }
  _activeTableData(data) {
    switch (this.activeTab) {
      case "linkchecker":
        return this._buildLinkCheckerTableData(data);
      case "contentbrowser":
        return this._buildContentBrowserTableData(data);
      case "mediabrowser":
        return this._buildMediaBrowserTableData(data);
      case "reports":
      default:
        return this._buildSummaryTableData(data);
    }
  }
  _buildSummaryTableData(data) {
    const rows = [["Metric", "Value", "Details"]];
    rows.push([
      this.t.pages,
      this._toCellValue(data.pages),
      `${this._toCellValue(data.objectives)} ${this.t.learningObjectives}, ${this._toCellValue(data.authorNotes)} ${this.t.authorNotes}, ${this._toCellValue(data.specialTags)} ${this.t.specialElements}, ${this._toCellValue(data.dataTables)} ${this.t.dataTables}, ${this._toCellValue(data.headings)} ${this.t.headings}`,
    ]);
    rows.push([
      this.t.videos,
      this._toCellValue(data.video),
      data.videoLength ? toHHMMSS(data.videoLength) : "",
    ]);
    rows.push(["H5P", this._toCellValue(data.h5p), ""]);
    rows.push([this.t.audio, this._toCellValue(data.audio), ""]);
    rows.push([this.t.externalLinks, this._toCellValue(data.links), ""]);
    rows.push([
      this.t.ofReading,
      this.getReadingTime(data.readTime) !== ""
        ? this.getReadingTime(data.readTime)
        : `0 ${this.t.minutes}`,
      "",
    ]);
    if (data.readability && typeof data.readability === "object") {
      rows.push([
        "Readability",
        this._toCellValue(data.readability.gradeLevel),
        `Dale-Chall, ${this._toCellValue(data.readability.lexiconCount)} ${this.t.words}, ${this._toCellValue(data.readability.difficultWords)} ${this.t.longWords}`,
      ]);
    }
    rows.push([this.t.created, this._toCellValue(data.created), ""]);
    rows.push([this.t.lastUpdated, this._toCellValue(data.updated), ""]);
    if (Array.isArray(data.updatedItems)) {
      data.updatedItems.forEach((item) => {
        const updated =
          item && item.metadata && item.metadata.updated
            ? item.metadata.updated
            : "";
        rows.push([this.t.recentUpdates, this._toCellValue(item.title), updated]);
      });
    }
    return rows;
  }
  _buildLinkCheckerTableData(data) {
    const rows = [["Status", "Link", "Usage count", "Used on"]];
    const linkData =
      data && data.linkData && typeof data.linkData === "object"
        ? data.linkData
        : null;
    if (!linkData) {
      return rows;
    }
    this._ensureLinkValidationData(linkData);
    Object.keys(linkData).forEach((key) => {
      const usages = Array.isArray(linkData[key]) ? linkData[key] : [];
      const statusData = this.linkResponseData[key];
      if (this.filters && this.filters.links === "error") {
        if (!statusData || statusData.ok !== false) {
          return;
        }
      }
      if (this.filters && this.filters.links === "ok") {
        if (!statusData || statusData.ok !== true) {
          return;
        }
      }
      const usedOn = usages
        .map((usage) => {
          const usageTitle =
            usage && usage.linkTitle ? usage.linkTitle : this.t.onPage;
          const pageTitle =
            usage && usage.itemId ? this._itemTitleById(usage.itemId) : "";
          return pageTitle ? `${usageTitle} (${pageTitle})` : usageTitle;
        })
        .join("; ");
      rows.push([
        this._linkStatusLabel(key),
        key,
        this._toCellValue(usages.length),
        usedOn,
      ]);
    });
    return rows;
  }
  _buildContentBrowserTableData(data) {
    const rows = [
      [
        "Title",
        "Type",
        "Updated",
        "Read time",
        "Links",
        "Images",
        "Videos",
        "Audio",
        "H5P",
        "Objectives",
        "Author notes",
        "Special",
        "Data tables",
        "Placeholders",
        "Remote content",
      ],
    ];
    const contentData =
      data && Array.isArray(data.contentData) ? data.contentData : [];
    contentData.forEach((item) => {
      rows.push([
        this._toCellValue(item.title),
        this._toCellValue(item.pageType),
        this._toCellValue(item.updated),
        item.readTime ? this.getReadingTime(item.readTime) : "",
        this._toCellValue(item.links),
        this._toCellValue(item.images),
        this._toCellValue(item.videos),
        this._toCellValue(item.audio),
        this._toCellValue(item.h5p),
        this._toCellValue(item.objectives),
        this._toCellValue(item.authorNotes),
        this._toCellValue(item.specialTags),
        this._toCellValue(item.dataTables),
        this._toCellValue(item.placeholders),
        this._toCellValue(item.siteremotecontent),
      ]);
    });
    return rows;
  }
  _buildMediaBrowserTableData(data) {
    const rows = [
      ["Name", "Title", "Type", "Location", "Status", "Found under", "Page", "Alt"],
    ];
    const mediaData = data && Array.isArray(data.mediaData) ? data.mediaData : [];
    mediaData.forEach((item) => {
      rows.push([
        this._toCellValue(item.name),
        this._toCellValue(item.title),
        this._toCellValue(item.type),
        this._toCellValue(item.locType),
        this._toCellValue(item.status),
        this._mediaSourceCellValue(item),
        item && item.itemId ? this._itemTitleById(item.itemId) : "",
        this._toCellValue(item.alt),
      ]);
    });
    return rows;
  }
  _mediaSourceCellValue(item) {
    const mediaType = this._toCellValue(item && item.type ? item.type : "").toLowerCase();
    const sourceValue = this._toCellValue(item && item.source ? item.source : "");
    if (mediaType === "image" || mediaType === "video") {
      const foundTag = this._mediaFoundTagValue(item);
      if (foundTag !== "") {
        return foundTag;
      }
      if (mediaType === "video") {
        return "video-player";
      }
      return "img";
    }
    return sourceValue;
  }
  _mediaFoundTagValue(item) {
    if (!item || typeof item !== "object") {
      return "";
    }
    const fields = [
      "foundTag",
      "foundUnder",
      "foundUnderTag",
      "tag",
      "tagName",
      "nodeName",
      "elementTag",
      "sourceTag",
    ];
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (typeof item[field] === "string" && item[field].trim() !== "") {
        return item[field].trim();
      }
    }
    return "";
  }
  _itemTitleById(itemId) {
    if (itemId == null) {
      return "";
    }
    const item = toJS(store.findItem(itemId));
    if (item && item.title) {
      return item.title;
    }
    return "";
  }
  _linkStatusLabel(linkKey) {
    const statusData = this.linkResponseData[linkKey];
    if (!statusData || statusData.ok === "loading") {
      return "Loading";
    }
    if (statusData.ok === true) {
      return "OK";
    }
    if (statusData.ok === false) {
      return statusData.status ? `Error (${statusData.status})` : "Error";
    }
    return "Unknown";
  }
  _ensureLinkValidationData(linkData) {
    if (!linkData || typeof linkData !== "object") {
      return;
    }
    Object.keys(linkData).forEach((key) => {
      if (!this.linkResponseData[key]) {
        this.linkResponseData[key] = {
          ok: "loading",
        };
        MicroFrontendRegistry.call(
          "@core/linkValidator",
          { links: key },
          this.__linkValidationHandler,
        );
      }
    });
  }
  _toCellValue(value) {
    if (value === null || typeof value === "undefined") {
      return "";
    }
    return String(value);
  }
  _nativeReportTable(headerRow, bodyRows, caption) {
    return html`
      <table class="report-native-table">
        <caption>${caption} ${this.t.reports}</caption>
        <thead>
          <tr>
            ${headerRow.map(
              (header) => html`<th scope="col">${this._toCellValue(header)}</th>`,
            )}
          </tr>
        </thead>
        <tbody>
          ${bodyRows.map(
            (row) => html`
              <tr>
                ${row.map((cell) => html`<td>${this._toCellValue(cell)}</td>`)}
              </tr>
            `,
          )}
        </tbody>
      </table>
    `;
  }
  // render function
  render() {
    const data = {
      pages: 0,
      objectives: 0,
      authorNotes: 0,
      specialTags: 0,
      dataTables: 0,
      headings: 0,
      video: 0,
      videoLength: 0,
      h5p: 0,
      audio: 0,
      links: 0,
      readTime: 0,
      readability: null,
      updatedItems: [],
      created: "",
      updated: "",
      ...(this.data && typeof this.data === "object" ? this.data : {}),
    };
    const activeReport = this._activeReport();
    const tableData = this._activeTableData(data);
    const headerRow = tableData.length > 0 ? tableData[0] : [];
    const bodyRows = tableData.length > 1 ? tableData.slice(1) : [];
    const useNativeTable = this.activeTab === "linkchecker";
    return html`
      <div class="panel-shell">
        <div class="panel-scroll">
          ${this.pageSelector()}
          <div class="report-tabs" role="tablist" aria-label="${this.t.reports}">
            ${this._reportTabs().map(
              (tab) => html`
                <simple-icon-button-lite
                  class="report-tab-button"
                  data-tab="${tab.id}"
                  icon="${tab.icon}"
                  label="${tab.label}"
                  role="tab"
                  toggles
                  aria-controls="report-table-panel"
                  aria-selected="${this.activeTab === tab.id ? "true" : "false"}"
                  ?toggled="${this.activeTab === tab.id}"
                  @click="${this._reportTabClicked}"
                >
                  ${tab.label}
                </simple-icon-button-lite>
              `,
            )}
          </div>
          <section
            id="report-table-panel"
            class="report-panel"
            role="tabpanel"
            aria-label="${activeReport.label}"
          >
            <loading-indicator full ?loading="${this.loading}"></loading-indicator>
            ${this.loading
              ? html`<p role="status" aria-live="polite">
                  ${this.t.loading} ${activeReport.label}..
                </p>`
              : html`
                  ${this._renderActiveFilters()}
                  <div class="report-table-scroll">
                    ${bodyRows.length === 0
                      ? html`<p>${this._activeEmptyStateMessage()}</p>`
                      : useNativeTable
                        ? this._nativeReportTable(
                            headerRow,
                            bodyRows,
                            activeReport.label,
                          )
                        : html`
                          <editable-table-display
                            bordered
                            copyable
                            condensed
                            column-header
                            downloadable
                            printable
                            responsive
                            sort
                            striped
                            scroll
                          >
                            <table>
                              <caption>${activeReport.label} ${this.t.reports}</caption>
                              <thead>
                                <tr>
                                  ${headerRow.map(
                                    (header) =>
                                      html`<th>${this._toCellValue(header)}</th>`,
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                ${bodyRows.map(
                                  (row) => html`
                                    <tr>
                                      ${row.map(
                                        (cell) =>
                                          html`<td>${this._toCellValue(cell)}</td>`,
                                      )}
                                    </tr>
                                  `,
                                )}
                              </tbody>
                            </table>
                          </editable-table-display>
                        `}
                  </div>
                `}
          </section>
        </div>
      </div>
    `;
  }
  // response is key'ed object by link and response data
  linkValidationResponse(e) {
    if (e && e.data) {
      let keys = Object.keys(e.data);
      this.linkResponseData[keys[0]] = e.data[keys[0]];
      // basic debounce so we only update every 500ms if we had a lot of links
      clearTimeout(this.__interval);
      this.__interval = setTimeout(() => {
        this.requestUpdate();
      }, 500);
    }
  }

  constructor() {
    super();
    this.base = "";
    this.filters = {};
    this.linkResponseData = {};
    this.__linkValidationHandler = this.linkValidationResponse.bind(this);
    this.t = this.t || {};
    this.t = {
      ...this.t,
      stats: "Stats",
      media: "Media",
      content: "Content",
      pageToProvideReportsAbout: "Page to provide reports about",
      noLinksInSelectedPages: "No links in selected pages",
      noMediaInSelectedPages: "No media in selected pages",
      noContentInSelectedPages: "No content in selected pages",
      noReportData: "No report data available",
      recentUpdates: "Recent updates",
      created: "Created",
      lastUpdated: "Last updated",
      updateReports: "Update reports",
      onPage: "on page",
      learningObjectives: "learning objectives",
      specialElements: "Special elements",
      headings: "Headings",
      externalLinks: "External links",
      pages: "Pages",
      videos: "videos",
      authorNotes: "Author notes",
      placeholders: "Placeholders",
      video: "Video",
      audio: "Audio",
      selfChecks: "Self checks",
      openInNewTab: "Open in new tab",
      links: "Links",
      images: "Images",
      dataTables: "Data tables",
      ofReading: "of reading",
      basedGradeReadingLevel: "based grade reading level",
      words: "Words",
      longWords: "long words",
      linkReport: "Link report",
      loading: "Loading",
      fullSite: "Full site",
      summary: "Summary",
      reports: "Reports",
      linkChecker: "Link checker",
      mediaBrowser: "Media browser",
      contentBrowser: "Content browser",
      hour: "hour",
      hours: "hours",
      minute: "minute",
      minutes: "minutes",
    };
    this.data = {
      readability: {},
      updatedItems: [],
    };
    this.selectedReportId = "";
    this.activeTab = "reports";
    this.loading = false;
  }
  static get properties() {
    return {
      ...super.properties,
      data: {
        type: Object,
      },
      filters: {
        type: Object,
      },
      linkResponseData: {
        type: Object,
      },
      selectedReportId: {
        type: String,
        attribute: "selected-report-id",
      },
      activeTab: {
        type: String,
      },
      base: {
        type: String,
        reflect: true,
      },
      loading: { type: Boolean, reflect: true },
    };
  }
  pageSelector() {
    const itemManifest = store.getManifestItems(true);
    const selectedReportId = this._normalizeReportSelectionValue(
      this.selectedReportId,
    );
    // default to null parent as the whole site
    var items = [
      {
        text: `-- ${this.t.fullSite} --`,
        value: "",
      },
    ];
    itemManifest.forEach((el) => {
      // calculate -- depth so it looks like a tree
      let itemBuilder = el;
      // walk back through parent tree
      let distance = "- ";
      while (itemBuilder && itemBuilder.parent != null) {
        itemBuilder = itemManifest.find((i) => i.id == itemBuilder.parent);
        // double check structure is sound
        if (itemBuilder) {
          distance = "--" + distance;
        }
      }
      items.push({
        text: distance + el.title,
        value: this._normalizeReportSelectionValue(el.id),
      });
    });
    return html`<div class="selector-wrapper">
      <label for="selector">${this.t.pageToProvideReportsAbout}:</label>
      <select
        id="selector"
        .value="${selectedReportId}"
        @change="${this._reportSelectionChanged}"
      >
        ${items.map(
          (item) => html`
            <option .value="${this._normalizeReportSelectionValue(item.value)}">
              ${item.text}
            </option>
          `,
        )}
      </select>
      <simple-icon-button-lite
        @click="${this.refreshData}"
        icon="refresh"
        ?disabled="${this.loading}"
        label="${this.t.updateReports}"
      >
        ${this.t.updateReports}
      </simple-icon-button-lite>
    </div>`;
  }
}
globalThis.customElements.define(HAXCMSShareDialog.tag, HAXCMSShareDialog);
export { HAXCMSShareDialog };

// convert seconds back into full time stamp
function toHHMMSS(seconds) {
  var out = "";
  var snum = parseInt(seconds, 10);
  var hours = Math.floor(snum / 3600);
  var minutes = Math.floor((snum - hours * 3600) / 60);

  if (hours !== 0) {
    out += `${hours} hour`;
    if (hours !== 1) {
      out += "s";
    }
    out += ", ";
  }
  if (minutes !== 0) {
    out += `${minutes} minute`;
    if (hours !== 1) {
      out += "s";
    }
  }
  return out;
}
