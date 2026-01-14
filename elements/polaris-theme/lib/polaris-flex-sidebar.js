/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { PolarisFlexTheme } from "./polaris-flex-theme";
import "@haxtheweb/haxcms-elements/lib/ui-components/blocks/site-children-block.js";

/**
 * `psu-flex-sidebar`
 * `PSU theme based on modern flex design system`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A headless content management system
 *  - HAXCMSTheme - A super class that provides correct baseline wiring to build a new theme
 *
 * @haxcms-theme-category Website
 * @haxcms-theme-internal false
 * @demo demo/index.html
 * @element psu-flex-base
 */
class PolarisFlexSidebar extends PolarisFlexTheme {
  //styles function
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }
        aside {
          margin-top: var(--ddd-spacing-4);
          margin-left: var(--ddd-spacing-10);
          float: left;
          width: 240px;
        }

        aside section {
          margin-bottom: var(--ddd-spacing-10);
          padding-right: var(--ddd-spacing-10);
          padding-bottom: var(--ddd-spacing-10);
        }

        site-children-block {
          --site-children-block-border-bottom: var(--ddd-theme-default-pughBlue)
            var(--ddd-border-size-xs) solid;
          --site-children-block-li-padding: var(--ddd-spacing-2) 0;
          --site-children-block-link-color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          --site-children-block-link-hover-color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-skyBlue)
          );
          --site-children-block-link-active-bg: light-dark(
            rgba(0, 30, 68, 0.1),
            rgba(255, 255, 255, 0.1)
          );
          --site-children-block-active-border-left: light-dark(
              var(--ddd-theme-default-link),
              var(--ddd-theme-default-skyBlue)
            )
            var(--ddd-border-size-md) solid;
          --site-children-block-link-active-color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-skyBlue)
          );
          font-family: var(--ddd-font-navigation);
          --site-children-block-font-size: var(--ddd-font-size-4xs);
          --site-children-block-parent-active-padding: var(--ddd-spacing-2);
          --site-children-block-parent-font-weight: var(
            --ddd-font-weight-medium
          );
        }

        site-breadcrumb {
          --site-breadcrumb-color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-skyBlue)
          );
          --site-breadcrumb-color-hover: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-skyBlue)
          );
          --site-breadcrumb-decoration-color-hover: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-skyBlue)
          );
        }

        :host([responsive-size="xl"]) {
          aside {
            width: 320px;
            margin-left: var(--ddd-spacing-15);
          }
        }

        :host([responsive-size="lg"]) {
          aside {
            width: 280px;
          }
        }

        :host([responsive-size="sm"]) {
          .site-inner {
            flex-wrap: wrap;
          }
          aside {
            order: 2;
            margin-left: auto;
            margin-right: auto;
            width: 75%;
          }
          site-children-block {
            --site-children-block-font-size: 18px;
          }
          aside section {
            padding-right: 0;
          }
        }

        :host([responsive-size="xs"]) {
          .site-inner {
            flex-wrap: wrap;
          }
          aside {
            order: 2;
            margin-left: auto;
            margin-right: auto;
            width: 75%;
          }
          site-children-block {
            --site-children-block-font-size: 18px;
          }
          aside section {
            padding-right: 0;
          }
        }
      `,
    ];
  }

  /**
   * Overload methods for customization of slots from the base class
   */

  renderSideBar() {
    return html`
      <aside
        role="complementary"
        aria-label="Primary Sidebar"
        itemtype="http://schema.org/WPSideBar"
        part="page-primary-sidebar"
      >
        <section>
          <!-- <h4>Contents</h4> -->
          <site-children-block
            part="page-children-block"
            dynamic-methodology="ancestor"
          ></site-children-block>
        </section>
      </aside>
    `;
  }

  /**
   * Handle edit mode changes and force menu to close to prevent clipping
   */
  _editModeChanged(newValue, oldValue) {
    if (super._editModeChanged) {
      super._editModeChanged(newValue, oldValue);
    }
    // Force close the mobile menu when entering edit mode to prevent clipping
    if (newValue === true && this.menuOpen) {
      this.__HAXCMSMobileMenuToggle();
    }
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "polaris-flex-sidebar";
  }

  constructor() {
    super();
  }
}
globalThis.customElements.define(PolarisFlexSidebar.tag, PolarisFlexSidebar);
export { PolarisFlexSidebar };
