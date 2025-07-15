import { css } from "lit";
export const JourneySidebarThemeStyles = css`
  :host {
    --sidebar-bg: var(--ddd-theme-accent);
    --content-bg: var(--ddd-theme-default-coalyGray);
    --text-heading: var(--ddd-theme-deault-nittanyNavy);
    --text-body: var(--ddd-theme-default-coalyDark);
    --accent-color: var(--ddd-theme-primary-9);
    font-family: var(--ddd-font-body, sans-serif);
    background-color: var(--content-bg);
  }

  nav {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 250px;
    padding: var(--ddd-spacing-4);
    z-index: 1000;
    background-image: url("../assets/blurry-gradient-haikei.jpg");
    background-size: cover;
    background-position: center;
    border-right: 2px solid var(--text-primary);
  }

  ul {
    list-style: none;
    padding: var(--ddd-spacing-2);
    margin: 0;
    /* display: flex;
    flex-direction: column; */
  }

  ul li a {
    display: block;
    padding: var(--ddd-spacing-2) 0;
    color: var(--text-primary);
    text-decoration: none;
    font-size: var(--ddd-font-size-m);
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
    padding: var(--ddd-spacing-6);
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
