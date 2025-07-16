import { css, unsafeCSS } from "lit";
// const Sidebar_bg_image = new URL("./assets/sidebar_bg.png", import.meta.url)
// .href;
export const JourneySidebarThemeStyles = css`
  :host {
    --sidebar-bg: var(--ddd-theme-accent);
    --content-bg: var(--ddd-theme-default-white);
    --text-heading: var(--ddd-theme-deault-nittanyNavy);
    --text-body: var(--ddd-theme-default-nittanyNavy);
    --accent-color: var(--ddd-theme-primary-9);
    font-family: var(--ddd-font-body, sans-serif);
    background-color: var(--content-bg);
  }

  nav {
    position: fixed;
    top: 0px;
    bottom: 0;
    left: 0;
    overflow-y: auto;
    width: 250px;
    padding: var(--ddd-spacing-4);
    z-index: 1000;

    background: var(--ddd-theme-default-gradient-footer);
    background-size: cover;
    background-position: center;
  }

  ul {
    list-style: none;
    padding: var(--ddd-spacing-2);
    margin: 0;
  }

  ul li a {
    display: block;
    padding: var(--ddd-spacing-2) 0;
    color: var(--text-primary);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  ul li a:hover,
  ul li a:focus {
    color: var(--accent-color);
  }

  site-active-title {
    display: block;
    margin: var(--ddd-spacing-8) 0 var(--ddd-spacing-4) 0;
    border-bottom: 3px solid var(--text-primary);
    color: var(--text-primary);
    font-size: var(--ddd-font-size-5xl);
    font-weight: 600;
  }
  site-active-title h2 {
    font-size: var(--ddd-font-size-xl);
    color: var(--text-body);
    margin-top: var(--ddd-spacing-1);
  }

  main {
    margin-left: 340px;
    padding: var(--ddd-spacing-8);
    background-color: var(--content-bg);
    color: var(--text-body);
    min-height: 100vh;
  }
  main p,
  main li {
    font-size: var(--ddd-font-size-m);
    line-height: 1.6;
  }
  main a {
    color: var(--text-primary);
    text-decoration: none;
  }
  main a:hover {
    text-decoration: underline;
  }

  scroll-button {
    position: fixed;
    bottom: var(--ddd-spacing-4);
    right: var(--ddd-spacing-4);
    z-index: 1000;
  }
`;
