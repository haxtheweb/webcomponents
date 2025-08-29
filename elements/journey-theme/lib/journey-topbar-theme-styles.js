import { css, unsafeCSS } from "lit";

export const JourneyTopbarThemeStyles = css`
  :host {
    --sidebar-bg: var(--ddd-theme-accent);
    --content-bg: var(--ddd-theme-default-white);
    --text-heading: var(--ddd-theme-default-nittanyNavy);
    --text-body: var(--ddd-theme-default-nittanyNavy);
    --accent-color: var(--ddd-theme-primary-9);
    font-family: var(--ddd-font-body, sans-serif);
    background-color: var(--content-bg);
  }

  site-active-title {
    color: var(--ddd-theme-default-white);
    font-size: var(--ddd-font-size-s);
  }

  .site-title {
    color: white;
    font-size: var(--ddd-font-size-2xl);
    font-weight: 600;
    margin-right: var(--ddd-spacing-4);
  }

  .topbar-container {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: var(--ddd-theme-default-gradient-footer);
    padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
  }

  .active button {
    background-color: light-dark(
      var(--my-theme-low-tone),
      var(--my-theme-high-tone)
    );
    color: light-dark(var(--my-theme-high-tone), var(--my-theme-low-tone));
    font-weight: bold;
  }
  main {
    margin-top: 0px;
    padding: var(--ddd-spacing-8);
    background-color: var(--ddd-theme-default-coalyGray);
    color: var(--text-body);
    min-height: 100vh;
  }

  article {
    background-color: var(--ddd-theme-default-white);
    padding: var(--ddd-spacing-4);
    border-radius: var(--ddd-radius-md);
    box-shadow: var(--ddd-box-shadow-md);
    max-width: 2000px;
    margin: 0 auto;
  }

  nav {
    display: inline-block;
    width: max-content;
  }

  nav ul {
    display: inline-flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--ddd-spacing-4);
    padding: 0;
    margin: 0;
    list-style: none;
  }

  nav ul li {
    margin-right: var(--ddd-spacing-4);
  }

  nav ul li a {
    display: inline-block;
    padding: 6px 12px;
    color: var(--ddd-theme-default-white);
    font-size: var(--ddd-font-size-s);
    white-space: nowrap;
    font-weight: 500;
    text-decoration: none;
  }

  nav ul li.active a {
    text-decoration: underline;
  }

  nav.topbar-scroll {
    display: flex;
    flex-wrap: wrap;
    white-space: normal;
    gap: var(--ddd-spacing-4);
    max-height: 100px;
    width: max-content;
  }

  nav.topbar-scroll ul {
    display: flex;
    flex-direction: row;
    gap: var(--ddd-spacing-4);
    padding: 0;
    margin: 0;
    list-style: none;
    flex-wrap: wrap;
  }

  nav.topbar-scroll li {
    white-space: nowrap;
  }

  nav.topbar-scroll a {
    display: inline-block;
    padding: 6px 12px;
    color: var(--ddd-theme-default-white);
    font-size: var(--ddd-font-size-s);
    font-weight: 500;
    text-decoration: none;
  }

  nav.topbar-scroll li.active a {
    text-decoration: underline;
  }

  nav.topbar-scroll::-webkit-scrollbar {
    height: 8px;
  }

  nav.topbar-scroll::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.4);
    border-radius: 4px;
  }

  scroll-button {
    position: fixed;
    bottom: var(--ddd-spacing-4);
    right: var(--ddd-spacing-4);
    z-index: 1000;
  }
`;
