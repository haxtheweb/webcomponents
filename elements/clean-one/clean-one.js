/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { HAXCMSLitElementTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSThemeParts } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSThemeParts";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";

import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@lrnwebcomponents/simple-popover/simple-popover.js";
import "@lrnwebcomponents/scroll-button/scroll-button.js";

/**
 * `clean-one`
 * `Clean HAXcms theme, one.`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A headless content management system
 *  - HAXCMSTheme - A super class that provides correct baseline wiring to build a new theme
 *
 * @demo demo/index.html
 * @element clean-one
 */
class CleanOne extends HAXCMSThemeParts(HAXCMSLitElementTheme) {
  //styles function
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          color: #242A31;
          width: 100%;
          margin: 0;
          display: flex;
          padding: 0;
          background: #F5F7F9;
          min-height: 100vh;
          flex-direction: column;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          --haxcms-base-styles-body-font-size:14px;
          --hax-base-styles-a-font-size: 14px;
          --hax-base-styles-p-font-size: 14px;
          --hax-base-styles-list-font-size: 14px;
          --haxcms-base-styles-body-font-family: "Helvetica Neue",Helvetica,Arial,sans-serif
          --haxcms-base-styles-body-line-height: 1.7;
          --hax-base-styles-list-line-height: 1.7;
          --hax-base-styles-p-line-height: 1.7;
          --hax-base-styles-p-letter-spacing: .2px;
          --haxcms-base-styles-body-letter-spacing : .2px;
          --hax-base-styles-p-min-height: auto;
          --hax-base-styles-list-max-width: auto;
          --haxcms-base-styles-p-min-height: auto;
          --hax-base-styles-list-padding-bottom: auto;
          --hax-base-styles-h1-font-size: inherit;
          --hax-base-styles-h2-font-size: inherit;
          --hax-base-styles-h3-font-size: inherit;
          --hax-base-styles-h4-font-size: inherit;
          --hax-base-styles-h5-font-size: inherit;
          --hax-base-styles-h6-font-size: inherit;
          --simple-tooltip-background: #000000;
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: #ffffff;
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-border-radius: 0;
        }
        site-git-corner {
          --site-git-corner-background: black;
        }
        simple-tooltip {
          --simple-tooltip-background: var(
            --haxcms-tooltip-background-color,
            #000000
          );
          --simple-tooltip-text-color: var(
            --haxcms-tooltip-color,
            #ffffff
          );
          --simple-tooltip-opacity: 1;
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-border-radius: 0;
        }

        :host([font-family="0"]) {
          --haxcms-base-styles-body-font-family: Georgia, serif;
        }
        :host([font-family="1"]) {
          --haxcms-base-styles-body-font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }

        :host([font-size="0"]) {
          --haxcms-base-styles-body-font-size:1.2rem;
          --hax-base-styles-p-font-size: 1.2rem;
          --hax-base-styles-list-font-size: 1.2rem;
          --hax-base-styles-a-font-size: 1.2rem;
          --hax-base-styles-h1-font-size: 2.2rem;
          --hax-base-styles-h2-font-size: 2.0rem;
          --hax-base-styles-h3-font-size: 1.8rem;
          --hax-base-styles-h4-font-size: 1.6rem;
          --hax-base-styles-h5-font-size: 1.4rem;
          --hax-base-styles-h6-font-size: 1.2rem;
        }
        :host([font-size="1"]) {
          --haxcms-base-styles-body-font-size:1.4rem;
          --hax-base-styles-p-font-size: 1.4rem;
          --hax-base-styles-list-font-size: 1.4rem;
          --hax-base-styles-a-font-size: 1.4rem;
          --hax-base-styles-h1-font-size: 2.4rem;
          --hax-base-styles-h2-font-size: 2.2rem;
          --hax-base-styles-h3-font-size: 2.0rem;
          --hax-base-styles-h4-font-size: 1.8rem;
          --hax-base-styles-h5-font-size: 1.6rem;
          --hax-base-styles-h6-font-size: 1.4rem;
        }
        :host([font-size="2"]) {
          --haxcms-base-styles-body-font-size:1.6rem;
          --hax-base-styles-p-font-size: 1.6rem;
          --hax-base-styles-list-font-size: 1.6rem;
          --hax-base-styles-a-font-size: 1.6rem;
          --hax-base-styles-h1-font-size: 2.6rem;
          --hax-base-styles-h2-font-size: 2.4rem;
          --hax-base-styles-h3-font-size: 2.2rem;
          --hax-base-styles-h4-font-size: 2.0rem;
          --hax-base-styles-h5-font-size: 1.8rem;
          --hax-base-styles-h6-font-size: 1.6rem;
        }
        :host([font-size="3"]) {
          --haxcms-base-styles-body-font-size: 1.8rem;
          --hax-base-styles-p-font-size: 1.8rem;
          --hax-base-styles-list-font-size: 1.8rem;
          --hax-base-styles-a-font-size: 1.8rem;
          --hax-base-styles-h1-font-size: 2.8rem;
          --hax-base-styles-h2-font-size: 2.6rem;
          --hax-base-styles-h3-font-size: 2.4rem;
          --hax-base-styles-h4-font-size: 2.2rem;
          --hax-base-styles-h5-font-size: 2.0rem;
          --hax-base-styles-h6-font-size: 1.8rem;
        }
        :host([font-size="4"]) {
          --haxcms-base-styles-body-font-size:2rem;
          --hax-base-styles-p-font-size: 2rem;
          --hax-base-styles-list-font-size: 2rem;
          --hax-base-styles-a-font-size: 2rem;
          --hax-base-styles-h1-font-size: 3.0rem;
          --hax-base-styles-h2-font-size: 2.8rem;
          --hax-base-styles-h3-font-size: 2.6rem;
          --hax-base-styles-h4-font-size: 2.4rem;
          --hax-base-styles-h5-font-size: 2.2rem;
          --hax-base-styles-h6-font-size: 2.0rem;
        }

        :host([hidden]) {
          display: none;
        }
        [hidden] {
          display: none;
        }
        site-menu:not(:defined),
        site-menu-button:not(:defined),
        paper-icon-button:not(:defined),
        simple-popover:not(:defined) {
          display: none;
        }
        .btn-container {
          z-index: 2;
          height: 50px;
          padding: 6px;
        }
        site-menu {
          height: auto;
        }
        .site.color-theme-0 simple-tooltip {
          --simple-tooltip-background:#252737;
          --simple-tooltip-text-color:#F5F5F5;
        }
        .site.color-theme-0 site-menu {
          --site-menu-active-color: #F5F5F5;
          --site-menu-item-active-item-color: var(--simple-colors-default-theme-blue-8,
            #4183c4);
          --haxcms-tooltip-color: #F5F5F5;
          --haxcms-tooltip-background-color: #252737;
        }
        .site.color-theme-0 scroll-button {
          --scroll-button-color: #252737;
          --scroll-button-background-color: #F5F5F5;
          --scroll-button-tooltip-background-color:#252737;
          --scroll-button-tooltip-color:#F5F5F5;
        }
        .site.color-theme-0 paper-icon-button,
        .site.color-theme-0 site-rss-button,
        .site.color-theme-0 site-print-button,
        .site.color-theme-0 site-git-corner {
          --site-git-corner-background: #252737;
          --site-git-corner-color: #F5F5F5;
          --iron-icon-fill-color: #252737;
          --haxcms-tooltip-color: #F5F5F5;
          --haxcms-tooltip-background-color: #252737;
        }
        .site.color-theme-0 site-menu-button {
          --site-menu-button-icon-fill-color: #252737;
          --haxcms-tooltip-color: #F5F5F5;
          --haxcms-tooltip-background-color: #252737;
        }
        .site.color-theme-1 site-menu {
          --site-menu-active-color: #1C1C1C;
          --site-menu-item-active-item-color: #eee8e0;
          --haxcms-tooltip-color: #f3eacb;
          --haxcms-tooltip-background-color: #eee8e0;
        }
        .site.color-theme-1 simple-tooltip {
          --simple-tooltip-background:#eee8e0;
          --simple-tooltip-text-color:#f3eacb;
        }
        .site.color-theme-1 scroll-button {
          --scroll-button-color: #eee8e0;
          --scroll-button-background-color: #f3eacb;
          --scroll-button-tooltip-background-color:#704214;
          --scroll-button-tooltip-color:#f3eacb;
        }
        .site.color-theme-1 paper-icon-button,
        .site.color-theme-1 site-rss-button,
        .site.color-theme-1 site-print-button,
        .site.color-theme-1 site-git-corner {
          --site-git-corner-background: #704214;
          --site-git-corner-color: #f3eacb;
          --iron-icon-fill-color: #704214;
          --haxcms-tooltip-color: #f3eacb;
          --haxcms-tooltip-background-color: #704214;
        }
        .site.color-theme-1 site-menu-button {
          --site-menu-button-icon-fill-color: #704214;
          --haxcms-tooltip-color: #f3eacb;
          --haxcms-tooltip-background-color: #704214;
        }
        .site.color-theme-2 site-menu {
          --site-menu-active-color: #252737;
          --site-menu-item-active-item-color: #f4f4f5;
          --haxcms-tooltip-color: #a6a6a6;
          --haxcms-tooltip-background-color: #252737;
        }
        .site.color-theme-2 simple-tooltip {
          --simple-tooltip-background:#252737;
          --simple-tooltip-text-color:#a6a6a6;
        }
        .site.color-theme-2 paper-icon-button,
        .site.color-theme-2 site-rss-button,
        .site.color-theme-2 site-print-button,
        .site.color-theme-2 site-git-corner {
          --site-git-corner-background: #a6a6a6;
          --site-git-corner-color: #252737;
          --iron-icon-fill-color: #a6a6a6;
          --haxcms-tooltip-color: #a6a6a6;
          --haxcms-tooltip-background-color: #252737;
        }
        .site.color-theme-2 site-menu-button {
          --site-menu-button-icon-fill-color: #a6a6a6;
          --haxcms-tooltip-color: #a6a6a6;
          --haxcms-tooltip-background-color: #252737;
        }
        .site.color-theme-2 scroll-button {
          --scroll-button-color: #a6a6a6;
          --scroll-button-background-color: #252737;
          --scroll-button-tooltip-background-color:#252737;
          --scroll-button-tooltip-color:#a6a6a6;
        }
        /**
        * Hide the slotted content during edit mode. This must be here to work.
        */
        :host([edit-mode]) #slot {
          display: none;
        }
        #slot {
          min-height: 50vh;
        }
        * {
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          -webkit-overflow-scrolling: touch;
          -webkit-tap-highlight-color: transparent;
          -webkit-text-size-adjust: none;
          -webkit-touch-callout: none;
          -webkit-font-smoothing: antialiased;
        }
        /* links */
        :host([color-theme="0"]) {
          --hax-base-styles-a-color-visited: var(--simple-colors-default-theme-blue-7,
            #4183c4);
          --hax-base-styles-a-color: var(--simple-colors-default-theme-blue-7,
            #4183c4);
          --hax-base-styles-a-color-active: #000000;
        }
        :host([color-theme="1"]) {
          --hax-base-styles-a-color-visited: #704214;
          --hax-base-styles-a-color: #704214;
          --hax-base-styles-a-color-active: #000000;
        }
        :host([color-theme="2"]) {
          --hax-base-styles-a-color-visited: var(--simple-colors-default-theme-light-blue-2,
            #3eb1d0);
          --hax-base-styles-a-color: var(--simple-colors-default-theme-light-blue-2,
            #3eb1d0);
          --hax-base-styles-a-color-active:#FFFFFF;
        }
        a {
          text-decoration: none;
        }
        a:hover,
        a:focus,
        a:active {
          outline: thin dotted;
        }
        a:-webkit-any-link {
          color: -webkit-link;
          cursor: pointer;
          text-decoration: underline;
        }
        /* menu outline */
        .site.without-animation .menu-outline {
          transition: none !important;
        }

        .site.with-menu .menu-outline {
          left: 0;
        }
        :host([is-logged-in]) .site.with-menu .menu-outline {
          left: 48px;
        }
        .menu-outline {
          font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
          position: absolute;
          top: 0;
          left: -300px;
          bottom: 0;
          z-index: 1;
          overflow-y: auto;
          width: 300px;
          color: #364149;
          background: #fafafa;
          border-right: 1px solid rgba(0,0,0,.07);
          transition: left 250ms ease;
        }
        /* content */
        .main-content>:first-child {
          margin-top: 0!important;
        }
        .main-section h1 {
          font-size: 2em;
        }
        :host([edit-mode]) .main-section {
          outline: 1px solid grey;
          outline-offset: 20px;
        }
        :host([edit-mode]) {
          opacity: 1;
        }
        .main-content h1, .main-content h2, .main-content h3, .main-content h4, .main-content h5, .main-content h6 {
          margin-top: 1.275em;
          margin-bottom: .85em;
          font-weight: 700;
        }
        .main-content h1, .main-content h2, .main-content h3, .main-content h4, .main-content h5 {
          page-break-after: avoid;
        }
        .pull-right {
          float: right;
        }
        .main-content *,
        .main-content ::slotted(*) {
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          font-size: inherit;
        }
        .site.without-animation .site-body {
          transition: none!important;
        }

        .site.with-menu .site-body {
          left: 300px;
        }
        :host([is-logged-in]) .site.with-menu .site-body {
          left: 348px;
        }
        :host([is-logged-in]) .site .site-body {
          left: 48px;
        }
        .site-body {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          overflow-y: auto;
          color: #000;
          background: #fff;
          transition: left 250ms ease;
        }
        h1 {
          font-size: 2em;
          margin: .67em 0;
        }
        .main-content h2 {
          font-size: 1.75em;
        }
        .main-content h3 {
          font-size: 1.5em;
        }
        .main-content h4 {
          font-size: 1.25em;
        }
        .main-content h5 {
          font-size: 1em;
        }
        .main-content h6 {
          font-size: 1em;
          color: #777;
        }
        .main-content h1, .main-content h2, .main-content h3, .main-content h4, .main-content h5, .main-content h6 {
          margin-top: 1.275em;
          margin-bottom: .85em;
          font-weight: 700;
        }

        .main-content h1, .main-content h2, .main-content h3, .main-content h4, .main-content h5 {
          page-break-after: avoid;
        }
        .main-content h2, .main-content h3, .main-content h4, .main-content h5, .main-content p {
          orphans: 3;
          widows: 3;
        }
        .main-content blockquote, .main-content dl, .main-content ol, .main-content p, .main-content table, .main-content ul {
          margin-top: 0;
          margin-bottom: .85em;
        }
        .main-content ol, .main-content ul {
          padding: 0;
          margin: 0;
          margin-bottom: .85em;
          padding-left: 2em;
        }
        .main-content h2, .main-content h3, .main-content h4, .main-content h5, .main-content p {
          orphans: 3;
          widows: 3;
        }
        article, aside, details, figcaption, figure, footer, header, hgroup, main, nav, section, summary {
          display: block;
        }
        .site-header {
          font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
          overflow: visible;
          height: 50px;
          padding: 0 8px;
          z-index: 2;
          font-size: .85em;
          color: #7e888b;
          background: 0 0;
        }
        .site-header site-active-title h1 {
          color: inherit;
          text-decoration: none;
          position: absolute;
          z-index: 1;
          top: 0;
          left: 0;
          right: 0;
          margin: 10px 200px;
          font-size: 20px;
          font-weight: 200;
          text-align: center;
          line-height: 50px;
          opacity: 0;
          -webkit-transition: opacity ease .4s;
          -moz-transition: opacity ease .4s;
          -o-transition: opacity ease .4s;
          transition: opacity ease .4s;
          -webkit-transition: opacity .2s ease;
          -moz-transition: opacity .2s ease;
          -o-transition: opacity .2s ease;
          transition: opacity .2s ease;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .site-header site-active-title h1:hover {
          opacity: 1;
        }
        @media (max-width: 700px){
          .link-actions {
            display: none;
          }
        }
        @media (max-width: 1000px){
          .site-header site-active-title {
              display: none;
          }
        }
        @media (max-width: 1240px){
          .site-body .body-inner {
            position: static;
            min-height: calc(100% - 50px);
          }
        }
        @media (max-width: 1240px){
          .site-body {
            -webkit-transition: -webkit-transform 250ms ease;
            -moz-transition: -moz-transform 250ms ease;
            -o-transition: -o-transform 250ms ease;
            transition: transform 250ms ease;
            padding-bottom: 20px;
          }
        }
        .site-body .site-inner {
          position: relative;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          overflow-y: auto;
        }
        .main-content * {
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          font-size: inherit;
        }
        .page-wrapper {
          position: relative;
          outline: 0;
        }
        .page-inner {
          position: relative;
          max-width: 800px;
          margin: 0 auto;
          min-height: 90vh;
          padding: 20px 15px 40px 15px;
        }
        .main-section {
          display: block;
          word-wrap: break-word;
          color: #333;
          line-height: 1.7;
          text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
          -moz-text-size-adjust: 100%;
        }
        /* Navigation arrows */
        site-menu-button {
          --site-menu-button-icon-width: 64px;
          --site-menu-button-icon-height: 64px;
        }
        :host([is-logged-in]) .site.with-menu site-menu-button[type="prev"] {
          left: 348px;
        }
        :host([is-logged-in]) .site site-menu-button[type="prev"] {
          left: 48px;
        }
        .site.with-menu site-menu-button[type="prev"] {
          left: 300px;
        }
        .site site-menu-button[type="prev"] {
          left: 0;
        }
        site-menu-button[type="next"] {
          right: 0;
        }
        .navigation {
          position: fixed;
          top: 50px;
          bottom: 0;
          margin: 0;
          max-width: 150px;
          min-width: 90px;
          display: flex;
          justify-content: center;
          align-content: center;
          flex-direction: column;
          font-size: 40px;
          color: #ccc;
          text-align: center;
          transition: all .35s ease;
        }
        @media (max-width: 1240px) {
          .navigation {
            position: static;
            top: auto;
            max-width: 50%;
            width: 50%;
            display: inline-block;
            float: left;
          }
        }
        /* color,font,size switchers */
          /*
          * Theme 1
          */
          .color-theme-1 .dropdown-menu {
            background-color: #111111;
            border-color: #afa790;
          }
          .color-theme-1 simple-popover {
            --simple-popover-color: #afa790;
            --simple-popover-background-color: #111111;
          }
          .color-theme-1 .dropdown-menu .dropdown-caret .caret-inner {
            border-bottom: 9px solid #111111;
          }
          .color-theme-1 .dropdown-menu .buttons {
            border-color: #7e888b;
          }
          .color-theme-1 .dropdown-menu .button {
            color: #afa790;
          }
          .color-theme-1 .dropdown-menu .button:hover,
          .color-theme-1 .dropdown-menu .button:focus,
          .color-theme-1 .dropdown-menu .button:active {
            color: #eee8e0;
          }
          /*
          * Theme 2
          */
          .color-theme-2 simple-popover {
            --simple-popover-color: #CCCCCC;
            --simple-popover-background-color: #2d3143;
          }
          .color-theme-2 .dropdown-menu {
            background-color: #2d3143;
            border-color: #272a3a;
          }
          .color-theme-2 .dropdown-menu {
            background-color: #2d3143;
            border-color: #272a3a;
          }
          .color-theme-2 .dropdown-menu .dropdown-caret .caret-inner {
            border-bottom: 9px solid #2d3143;
          }
          .color-theme-2 .dropdown-menu .buttons {
            border-color: #272a3a;
          }
          .color-theme-2 .dropdown-menu .button {
            color: #CCCCCC;
          }
          .color-theme-2 .dropdown-menu .button:hover,
          .color-theme-2 .dropdown-menu .button:focus,
          .color-theme-2 .dropdown-menu .button:active {
            color: #f4f4f5;
          }
          .site .site-header .font-settings .font-enlarge {
            line-height: 30px;
            font-size: 1.4em;
          }
          .site .site-header .font-settings .font-reduce {
            line-height: 30px;
            font-size: 1em;
          }
          .site .site-header .font-settings .font-reduce {
            line-height: 30px;
            font-size: 1em;
          }

          .dropdown-menu .buttons .button.size-2 {
              width: 50%;
          }
          .color-theme-1 .dropdown-menu .button {
              color: #afa790;
          }
          .dropdown-menu .buttons .button {
            border: 0;
            background-color: transparent;
            color: #a6a6a6;
            width: 100%;
            text-align: center;
            float: left;
            line-height: 1.42857143;
            padding: 8px 4px;
          }
          .button.size-2 {
            width: 50%;
          }
          .dropdown-menu .buttons .button.size-3 {
            width: 33%;
          }
          .dropdown-menu.open {
            display: block;
          }
          .dropdown-menu {
            min-width: 160px;
            padding: 0;
            margin: 2px 0 0;
            list-style: none;
            font-size: 14px;
            background-color: #fafafa;
          }
          .color-theme-0 .dropdown-menu {
            background-color: #fafafa;
            border-color: #222222;
          }
          .color-theme-0 simple-popover {
            --simple-popover-color: #222222;
            --simple-popover-background-color: #fafafa;
          }
          .dropdown-menu .buttons:after, .dropdown-menu .buttons:before {
            content: " ";
            display: table;
            line-height: 0;
          }
          .buttons:after, .buttons:before {
            content: " ";
            display: table;
            line-height: 0;
          }
          .button {
            border: 0;
            background-color: transparent;
            background: #eee;
            color: #666;
            width: 100%;
            text-align: center;
            float: left;
            line-height: 1.42857143;
            padding: 8px 4px;
          }
          button, html input[type=button], input[type=reset], input[type=submit] {
            -webkit-appearance: button;
            cursor: pointer;
          }
          button, select {
            text-transform: none;
          }
          button, input {
            line-height: normal;
          }
          button, input, select, textarea {
            font-family: inherit;
            font-size: 100%;
            margin: 0;
          }
          .site.color-theme-1 .site-body {
            color: #704214;
            background: #f3eacb;
          }
          .site.color-theme-1 .site-body .page-wrapper .page-inner section {
            background: #f3eacb;
          }
          .site.color-theme-2 .site-body {
            color: var(--simple-colors-default-theme-light-blue-1,#CFD4E3);
            background: #1c1f2b;
          }
          .site.color-theme-2 .site-body .page-wrapper .page-inner section {
            background: #1c1f2b;
          }
          .site.font-size-0 .site-body .page-inner section ::slotted(*) {
            font-size: 1.2rem;
          }
          .site.font-size-1 .site-body .page-inner section ::slotted(*) {
            font-size: 1.4rem;
          }
          .site.font-size-2 .site-body .page-inner section ::slotted(*) {
            font-size: 1.6rem;
          }
          .site.font-size-3 .site-body .page-inner section ::slotted(*) {
            font-size: 2.2rem;
          }
          .site.font-size-4 .site-body .page-inner section ::slotted(*) {
            font-size: 4rem;
          }
          .site.font-family-0 {
            font-family: Georgia, serif;
          }
          .site.font-family-1 {
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          }
          .site.color-theme-1 .site-body .page-wrapper .page-inner section.normal {
            color: #704214;
          }
          .site.color-theme-1 .site-body .page-wrapper .page-inner section.normal a {
            color: inherit;
          }
          .site.color-theme-1 .site-body .page-wrapper .page-inner section.normal h1,
          .site.color-theme-1 .site-body .page-wrapper .page-inner section.normal h2,
          .site.color-theme-1 .site-body .page-wrapper .page-inner section.normal h3,
          .site.color-theme-1 .site-body .page-wrapper .page-inner section.normal h4,
          .site.color-theme-1 .site-body .page-wrapper .page-inner section.normal h5,
          .site.color-theme-1 .site-body .page-wrapper .page-inner section.normal h6 {
            color: inherit;
          }
          .site.color-theme-1 .site-body .page-wrapper .page-inner section.normal h1,
          .site.color-theme-1 .site-body .page-wrapper .page-inner section.normal h2 {
            border-color: inherit;
          }
          .site.color-theme-1 .site-body .page-wrapper .page-inner section.normal h6 {
            color: inherit;
          }
          .site.color-theme-1 .site-body .page-wrapper .page-inner section.normal hr {
            background-color: inherit;
          }
          .site.color-theme-1 .site-body .page-wrapper .page-inner section.normal blockquote {
            border-color: inherit;
          }
          .site.color-theme-1 .site-body .page-wrapper .page-inner section.normal pre,
          .site.color-theme-1 .site-body .page-wrapper .page-inner section.normal code {
            background: #fdf6e3;
            color: #657b83;
            border-color: #f8df9c;
          }
          .site.color-theme-1 .site-body .page-wrapper .page-inner section.normal .highlight {
            background-color: inherit;
          }
          .site.color-theme-1 .site-body .page-wrapper .page-inner section.normal table th,
          .site.color-theme-1 .site-body .page-wrapper .page-inner section.normal table td {
            border-color: #f5d06c;
          }
          .site.color-theme-1 .site-body .page-wrapper .page-inner section.normal table tr {
            color: inherit;
            background-color: #fdf6e3;
            border-color: #444444;
          }
          .site.color-theme-1 .site-body .page-wrapper .page-inner section.normal table tr:nth-child(2n) {
            background-color: #fbeecb;
          }
          .site.color-theme-2 .site-body .page-wrapper .page-inner section.normal {
            color: var(--simple-colors-default-theme-light-blue-1,#CFD4E3);
          }
          .site.color-theme-2 .site-body .page-wrapper .page-inner section.normal a {
            color: var(--simple-colors-default-theme-light-blue-2,
            #3eb1d0);
          }
          .site.color-theme-2 .site-body .page-wrapper .page-inner section.normal h1,
          .site.color-theme-2 .site-body .page-wrapper .page-inner section.normal h2,
          .site.color-theme-2 .site-body .page-wrapper .page-inner section.normal h3,
          .site.color-theme-2 .site-body .page-wrapper .page-inner section.normal h4,
          .site.color-theme-2 .site-body .page-wrapper .page-inner section.normal h5,
          .site.color-theme-2 .site-body .page-wrapper .page-inner section.normal h6 {
            color: #fffffa;
          }
          .site.color-theme-2 .site-body .page-wrapper .page-inner section.normal h1,
          .site.color-theme-2 .site-body .page-wrapper .page-inner section.normal h2 {
            border-color: #373b4e;
          }
          .site.color-theme-2 .site-body .page-wrapper .page-inner section.normal h6 {
            color: #373b4e;
          }
          .site.color-theme-2 .site-body .page-wrapper .page-inner section.normal hr {
            background-color: #373b4e;
          }
          .site.color-theme-2 .site-body .page-wrapper .page-inner section.normal blockquote {
            border-color: #373b4e;
          }
          .site.color-theme-2 .site-body .page-wrapper .page-inner section.normal pre,
          .site.color-theme-2 .site-body .page-wrapper .page-inner section.normal code {
            color: #9dbed8;
            background: #2d3143;
            border-color: #2d3143;
          }
          .site.color-theme-2 .site-body .page-wrapper .page-inner section.normal .highlight {
            background-color: #282a39;
          }
          .site.color-theme-2 .site-body .page-wrapper .page-inner section.normal table th,
          .site.color-theme-2 .site-body .page-wrapper .page-inner section.normal table td {
            border-color: #3b3f54;
          }
          .site.color-theme-2 .site-body .page-wrapper .page-inner section.normal table tr {
            color: #b6c2d2;
            background-color: #2d3143;
            border-color: #3b3f54;
          }
          .site.color-theme-2 .site-body .page-wrapper .page-inner section.normal table tr:nth-child(2n) {
            background-color: #35394b;
          }
          .site.color-theme-1 .site-header {
            color: #afa790;
            background: transparent;
          }
          .site.color-theme-1 .site-header .btn {
            color: #eee8e0;
          }
          .site.color-theme-1 .site-header .btn:hover,
          .site.color-theme-1 .site-header .btn:focus,
          .site.color-theme-1 .site-header .btn:active {
            color: #eee8e0;
            background: none;
          }
          .site.color-theme-1 .site-header site-active-title {
            color: #704214;
          }
          .site.color-theme-2 .site-header {
            color: #7e888b;
            background: transparent;
          }
          .site.color-theme-2 .site-header .btn {
            color: #3b3f54;
          }
          .site.color-theme-2 .site-header .btn:hover,
          .site.color-theme-2 .site-header .btn:focus,
          .site.color-theme-2 .site-header .btn:active {
            color: #fffff5;
            background: none;
          }
          .site.color-theme-2 .site-header site-active-title {
            color: var(--simple-colors-default-theme-light-blue-1,#CFD4E3);
          }
          .site.color-theme-1 .site-body .navigation {
            color: #afa790;
          }
          .site.color-theme-1 .site-body .navigation:hover,
          .site.color-theme-1 .site-body .navigation:focus,
          .site.color-theme-1 .site-body .navigation:active {
            color: #eee8e0;
          }
          .site.color-theme-2 .site-body .navigation {
            color: #383f52;
          }
          .site.color-theme-2 .site-body .navigation:hover,
          .site.color-theme-2 .site-body .navigation:focus,
          .site.color-theme-2 .site-body .navigation:active {
            color: #fffff5;
          }
          /*
          * Theme 1
          */
          .site.color-theme-1 .menu-outline {
            color: #afa790;
            background: #111111;
            border-right: 1px solid rgba(0, 0, 0, 0.07);
          }
          .site.color-theme-1 .menu-outline ul.summary li.divider {
            background: #7e888b;
            box-shadow: none;
          }
          .site.color-theme-1 .menu-outline ul.summary li.done > a {
            color: #877f6a;
          }
          .site.color-theme-1 .menu-outline ul.summary li a,
          .site.color-theme-1 .menu-outline ul.summary li span {
            color: #877f6a;
            background: transparent;
            font-weight: normal;
          }
          .site.color-theme-1 .menu-outline ul.summary li.active > a,
          .site.color-theme-1 .menu-outline ul.summary li a:hover,
          .site.color-theme-1 .menu-outline ul.summary li a:focus,
          .site.color-theme-1 .menu-outline ul.summary li a:active {
            color: #704214;
            background: transparent;
            font-weight: normal;
          }
          /*
          * Theme 2
          */
          .site.color-theme-2 .menu-outline {
            color: #bcc1d2;
            background: #2d3143;
            border-right: none;
          }
          .site.color-theme-2 .menu-outline ul.summary li.divider {
            background: #272a3a;
            box-shadow: none;
          }
          .site.color-theme-2 .menu-outline ul.summary li.done > a {
            color: #62687f;
          }
          .site.color-theme-2 .menu-outline ul.summary li a,
          .site.color-theme-2 .menu-outline ul.summary li span {
            color: #c1c6d7;
            background: transparent;
            font-weight: 600;
          }
          .site.color-theme-2 .menu-outline ul.summary li.active > a,
          .site.color-theme-2 .menu-outline ul.summary li a:hover,
          .site.color-theme-2 .menu-outline ul.summary li a:focus,
          .site.color-theme-2 .menu-outline ul.summary li a:active {
            color: #f4f4f5;
            background: #252737;
            font-weight: 600;
          }

          /* settings container */
          .settings-container[hidden] {
            display: none;
          }
          simple-popover {
            padding: 2px;
          }
          scroll-button {
            position: absolute;
            bottom: 0;
            right: 16px;
          }
          .link-actions {
            top: 0;
            right: 16px;
          }
          #site-search-input {
            padding: 6px;
            background: 0 0;
            transition: top .5s ease;
            background: #fff;
            border-bottom: 1px solid rgba(0,0,0,.07);
            border-top: 1px solid rgba(0,0,0,.07);
            margin-bottom: 10px;
            margin-top: -1px;
          }
          #site-search-input input, #site-search-input input:focus, #site-search-input input:hover {
            width: 100%;
            background: 0 0;
            border: 1px solid transparent;
            box-shadow: none;
            outline: 0;
            line-height: 22px;
            padding: 7px 7px;
            color: inherit;
          }
          site-search {
            height: auto;
            width: auto;
            font-size: inherit;
          }
          .site.color-theme-0 site-search {
            color: #252737;
            --site-search-result-background-color: transparent;
            --site-search-result-background-color-hover: #F5F5F5;
            --site-search-link-color-hover: #252737;
            --site-search-link-text-color: #252737;
            --site-search-link-color: #252737;
            --site-search-result-color: #252737;
          }
          .site.color-theme-1 site-search {
            color: #704214;
            --site-search-result-background-color: transparent;
            --site-search-result-background-color-hover: transparent;
            --site-search-link-color-hover: #704214;
            --site-search-link-text-color: #704214;
            --site-search-link-color: #704214;
            --site-search-result-color: #704214;
          }
          .site.color-theme-2 site-search {
            color: var(--simple-colors-default-theme-light-blue-1,#CFD4E3);
            --site-search-result-background-color: transparent;
            --site-search-result-background-color-hover: transparent;
            --site-search-link-color-hover: var(--simple-colors-default-theme-light-blue-1,#CFD4E3);
            --site-search-link-text-color: var(--simple-colors-default-theme-light-blue-1,#CFD4E3);
            --site-search-link-color: var(--simple-colors-default-theme-light-blue-1,#CFD4E3);
            --site-search-result-color: var(--simple-colors-default-theme-light-blue-1,#CFD4E3);
          }
      `
    ];
  }
  toggleMenu(e) {
    if (this.withMenu == "with-menu") {
      this.withMenu = "";
      this.shadowRoot.querySelector("#nav").setAttribute("tabindex", "-1");
    } else {
      this.withMenu = "with-menu";
      this.shadowRoot.querySelector("#nav").removeAttribute("tabindex");
    }
  }
  toggleSettings(e) {
    this.hideSettings = !this.hideSettings;
  }
  sizeDown(e) {
    if (this.fontSize > 0) {
      this.fontSize = this.fontSize - 1;
    }
  }
  sizeUp(e) {
    if (this.fontSize < 4) {
      this.fontSize = this.fontSize + 1;
    }
  }
  fontFamilyChange(e) {
    this.fontFamily = parseInt(e.path[0].getAttribute("data-font"));
  }
  colorThemeChange(e) {
    this.colorTheme = parseInt(e.path[0].getAttribute("data-theme"));
  }

  // render function
  render() {
    return html`
      <div
        class="site without-animation ${this.withMenu} font-size-${this
          .fontSize} font-family-${this.fontFamily} color-theme-${this
          .colorTheme}"
      >
        <div class="menu-outline">
          <div id="site-search-input" role="search">
            <input
              type="text"
              placeholder="Type to search"
              .value="${this.searchTerm}"
              id="search"
              @input="${this.searchChanged}"
            />
          </div>
          <nav id="nav" role="navigation" aria-labelledby="leftnavheading">
            <site-menu id="leftnavheading"></site-menu>
          </nav>
        </div>
        <div class="site-body">
          <div id="top"></div>
          <div class="site-inner">
            <div
              class="site-header"
              role="navigation"
              .part="${this.editMode ? `edit-mode-active` : ``}"
            >
              <div class="btn-container">
                <paper-icon-button
                  .part="${this.editMode ? `edit-mode-active` : ``}"
                  class="btn"
                  icon="icons:menu"
                  id="menubtn"
                  @click="${this.toggleMenu}"
                ></paper-icon-button>
                <simple-tooltip for="menubtn">
                  Toggle menu
                </simple-tooltip>
                <paper-icon-button
                  .part="${this.editMode ? `edit-mode-active` : ``}"
                  class="btn"
                  icon="editor:format-size"
                  @click="${this.toggleSettings}"
                  id="popovertarget"
                ></paper-icon-button>
                <simple-tooltip for="popovertarget">
                  Text settings
                </simple-tooltip>
                <simple-popover
                  class="dropdown pull-left font-settings js-toolbar-action settings-container"
                  ?hidden="${this.hideSettings}"
                  auto
                >
                  <div class="dropdown-menu dropdown-right open">
                    <div class="dropdown-caret">
                      <span class="caret-outer"></span>
                      <span class="caret-inner"></span>
                    </div>
                    <div class="buttons">
                      <button
                        class="button size-2 font-reduce"
                        @click="${this.sizeDown}"
                      >
                        A
                      </button>
                      <button
                        class="button size-2 font-enlarge"
                        @click="${this.sizeUp}"
                      >
                        A
                      </button>
                    </div>
                    <div class="buttons">
                      <button
                        class="button size-2"
                        data-font="0"
                        @click="${this.fontFamilyChange}"
                      >
                        Serif
                      </button>
                      <button
                        class="button size-2"
                        data-font="1"
                        @click="${this.fontFamilyChange}"
                      >
                        Sans
                      </button>
                    </div>
                    <div class="buttons">
                      <button
                        class="button size-3"
                        data-theme="0"
                        @click="${this.colorThemeChange}"
                      >
                        White
                      </button>
                      <button
                        class="button size-3"
                        data-theme="1"
                        @click="${this.colorThemeChange}"
                      >
                        Sepia
                      </button>
                      <button
                        class="button size-3"
                        data-theme="2"
                        @click="${this.colorThemeChange}"
                      >
                        Night
                      </button>
                    </div>
                  </div>
                </simple-popover>
                <div class="pull-right link-actions">
                  <site-print-button
                    class="btn js-toolbar-action"
                  ></site-print-button>
                  <site-print-button
                    type="site"
                    class="btn js-toolbar-action"
                  ></site-print-button>
                  <site-rss-button type="rss"></site-rss-button>
                  <site-git-corner size="small"></site-git-corner>
                </div>
              </div>
              <site-active-title></site-active-title>
            </div>
            <div class="page-wrapper" role="main">
              <div class="main-content page-inner">
                <section class="normal main-section">
                  <site-search
                    hide-input
                    search="${this.searchTerm}"
                    @search-item-selected="${this.searchItemSelected}"
                    ?hidden="${this.searchTerm != "" ? false : true}"
                  ></site-search>
                  <div
                    id="contentcontainer"
                    ?hidden="${this.searchTerm != "" ? true : false}"
                  >
                    <div id="slot">
                      <slot></slot>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
          <!-- These two buttons allow you to go left and right through the pages in the manifest -->
          <site-menu-button
            type="prev"
            position="right"
            class="navigation"
          ></site-menu-button>
          <site-menu-button
            type="next"
            position="left"
            class="navigation"
          ></site-menu-button>
        </div>
        <scroll-button
          .part="${this.editMode ? `edit-mode-active` : ``}"
        ></scroll-button>
      </div>
    `;
  }
  searchItemSelected(e) {
    // an item was picked, let's just make the UI jump to that item
    this.searchTerm = "";
  }
  searchChanged(e) {
    if (e.path[0].value) {
      import("@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-search.js").then(
        () => {
          this.searchTerm = e.path[0].value;
        }
      );
    } else {
      this.searchTerm = "";
    }
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      withMenu: {
        type: String
      },
      searchTerm: {
        type: String
      },
      hideSettings: {
        type: Boolean
      },
      fontSize: {
        type: Number,
        reflect: true,
        attribute: "font-size"
      },
      fontFamily: {
        type: Number,
        reflect: true,
        attribute: "font-family"
      },
      colorTheme: {
        type: Number,
        reflect: true,
        attribute: "color-theme"
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "clean-one";
  }
  /**
   * Add elements to cheat on initial paint here
   */
  constructor() {
    super();
    this.HAXCMSThemeSettings.autoScroll = true;
    this.hideSettings = true;
    this.fontSize = 1;
    this.fontFamily = 0;
    this.searchTerm = "";
    this.colorTheme = 0;
    this.withMenu = "with-menu";
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-title.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu-button.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-print-button.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-rss-button.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-git-corner.js");
    this.__disposer = this.__disposer ? this.__disposer : [];
    autorun(reaction => {
      this.activeManifestIndex = toJS(store.activeManifestIndex);
      this.__disposer.push(reaction);
    });
    this.addEventListener("click", this.checkMenuOpen.bind(this));
  }

  checkMenuOpen(e) {
    if (
      !this.hideSettings &&
      e.path &&
      !e.path.includes(this.__toggleTarget) &&
      !e.path.includes(this.shadowRoot.querySelector("simple-popover"))
    ) {
      this.hideSettings = true;
    }
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.__toggleTarget = this.shadowRoot.querySelector("#popovertarget");
    // hook up the scroll target
    this.shadowRoot.querySelector(
      "scroll-button"
    ).target = this.shadowRoot.querySelector("#top");
    // hook up the pop over menu
    this.shadowRoot.querySelector(
      "simple-popover"
    ).target = this.__toggleTarget;
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
  /**
   * Previous page to hook into when prev is hit
   */
  prevPage(e) {
    super.prevPage(e);
  }
  /**
   * Next page to hook into when next is hit
   */
  nextPage(e) {
    super.nextPage(e);
  }
}
window.customElements.define(CleanOne.tag, CleanOne);
export { CleanOne };
