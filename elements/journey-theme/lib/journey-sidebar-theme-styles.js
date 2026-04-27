import { css } from "lit";

export const JourneySidebarThemeStyles = css`
  :host {
    --sidebar-bg: var(--ddd-palette-color-2, var(--ddd-theme-accent));
    --content-bg: light-dark(
      var(--ddd-palette-color-5, var(--ddd-theme-default-white)),
      var(--ddd-palette-color-1, var(--ddd-theme-default-coalyGray))
    );
    --text-heading: light-dark(
      var(--ddd-palette-text-color-5, var(--ddd-theme-default-nittanyNavy)),
      var(--ddd-palette-text-color-1, var(--ddd-theme-default-white))
    );
    --text-body: var(--text-heading);
    --text-primary: var(--text-heading);
    --accent-color: var(
      --ddd-palette-color-7,
      var(--ddd-theme-default-keystoneYellow)
    );
    --nav-bg: light-dark(
      var(--sidebar-bg),
      linear-gradient(
        var(--ddd-palette-color-1, var(--ddd-theme-default-potentialMidnight))
          0%,
        var(--ddd-palette-color-4, var(--ddd-theme-default-coalyGray)) 65%,
        var(--ddd-palette-color-4, var(--ddd-theme-default-coalyGray)) 100%
      )
    );
    font-family: var(--ddd-font-primary, sans-serif);
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
    background: var(--nav-bg);
    background-size: cover;
    background-position: center;
    border-right: var(--ddd-border-sm);
    border-right-color: light-dark(
      var(--ddd-palette-color-5, var(--ddd-theme-default-limestoneLight)),
      var(--ddd-palette-color-6, var(--ddd-theme-default-potentialMidnight))
    );
  }

  ul {
    list-style: none;
    padding: var(--ddd-spacing-2);
    margin: 0;
  }

  ul li a {
    display: block;
    padding: var(--ddd-spacing-3) var(--ddd-spacing-2);
    color: var(--text-primary);
    text-decoration: none;
    transition: all var(--ddd-duration-rapid, 0.2s) ease;
    border-radius: var(--ddd-radius-xs);
    font-size: var(--ddd-font-size-s);
    font-weight: var(--ddd-font-weight-medium);
    border: 2px solid transparent;
  }

  ul li a:hover,
  ul li a:focus {
    color: var(--accent-color);
    background-color: color-mix(in srgb, var(--accent-color) 16%, transparent);
    text-decoration: underline;
    outline: none;
  }

  ul li a:focus {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--accent-color) 40%, transparent);
  }

  ul li a.active {
    color: var(--accent-color);
    font-weight: var(--ddd-font-weight-bold);
    background-color: color-mix(in srgb, var(--accent-color) 22%, transparent);
    border-left: var(--ddd-spacing-1) solid var(--accent-color);
  }

  site-active-title {
    display: block;
    margin: var(--ddd-spacing-8) 0 var(--ddd-spacing-4) 0;
    border-bottom: var(--ddd-border-md);
    border-bottom-color: var(--text-heading);
    color: var(--text-heading);
    font-size: var(--ddd-font-size-3xl);
    font-weight: var(--ddd-font-weight-bold);
    font-family: var(--ddd-font-primary);
  }
  site-active-title h2 {
    font-size: var(--ddd-font-size-xl);
    color: var(--text-body);
    margin-top: var(--ddd-spacing-2);
    font-weight: var(--ddd-font-weight-medium);
  }

  main {
    margin-left: 280px; /* Increased to account for border */
    padding: var(--ddd-spacing-8);
    background-color: var(--content-bg);
    color: var(--text-body);
    min-height: 100vh;
    transition: margin-left var(--ddd-duration-rapid, 0.3s) ease;
  }
  
  main p,
  main li {
    font-size: var(--ddd-font-size-s);
    line-height: var(--ddd-lh-150);
    font-family: var(--ddd-font-primary);
  }
  
  main a {
    color: light-dark(
      var(--ddd-palette-color-3, var(--ddd-theme-default-link)),
      var(--ddd-palette-color-7, var(--ddd-theme-default-linkLight))
    );
    text-decoration: none;
    transition: all var(--ddd-duration-rapid, 0.2s) ease;
    border-radius: var(--ddd-radius-xs);
    padding: var(--ddd-spacing-1) var(--ddd-spacing-1);
  }
  
  main a:hover,
  main a:focus {
    text-decoration: underline;
    background-color: color-mix(
      in srgb,
      var(--ddd-palette-color-3, var(--ddd-theme-default-link)) 15%,
      transparent
    );
    outline: 2px solid transparent;
  }
  
  main a:focus {
    outline: 2px solid
      light-dark(
        var(--ddd-palette-color-3, var(--ddd-theme-default-link)),
        var(--ddd-palette-color-7, var(--ddd-theme-default-linkLight))
      );
    outline-offset: 2px;
  }

  scroll-button {
    position: fixed;
    bottom: var(--ddd-spacing-4);
    right: var(--ddd-spacing-4);
    z-index: 1000;
  }

  /* Responsive design for smaller screens */
  @media (max-width: 768px) {
    nav {
      transform: translateX(-100%);
      transition: transform var(--ddd-duration-rapid, 0.3s) ease;
    }
    
    nav.open {
      transform: translateX(0);
    }
    
    main {
      margin-left: 0;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    nav,
    main,
    ul li a {
      transition: none;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    nav {
      border-right-width: var(--ddd-border-size-lg);
    }
    
    ul li a {
      border-width: 2px;
    }
    
    ul li a:focus {
      box-shadow: 0 0 0 4px currentColor;
    }
  }
`;
