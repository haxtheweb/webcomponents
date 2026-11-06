import { expect } from "@open-wc/testing";
import {
  SITE_ADMIN_TITLEBAR_STYLES,
  SITE_ADMIN_MODAL_SIZE,
  SITE_ADMIN_MODAL_STYLES,
  SITE_ADMIN_CONFIRM_STYLES,
} from "../lib/core/admin/site-admin-sections.js";
import {
  HaxUiDialogTitlebar,
  HaxUiDialogFrame,
  HaxUiDialogConfirm,
} from "@haxtheweb/d-d-d/lib/HaxUiDialogFrame.js";
import { SimpleModalCssVars } from "@haxtheweb/simple-modal/simple-modal.js";

// The site admin maps as they were before they moved to the HAX UI dialog
// frame (haxtheweb/issues#3041). The site admin shell, and outline-designer
// inside it, must open with exactly these values.
const BEFORE = {
  SITE_ADMIN_TITLEBAR_STYLES: {
    "--simple-modal-titlebar-background":
      "var(--hax-ui-titlebar, light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-potentialMidnight)))",
    "--simple-modal-titlebar-color":
      "var(--hax-ui-on-titlebar, var(--ddd-theme-default-white))",
    "--simple-modal-titlebar-height": "var(--hax-ui-titlebar-height, 48px)",
    "--simple-modal-titlebar-mobile-height":
      "var(--hax-ui-titlebar-height, 48px)",
    "--simple-modal-titlebar-padding": "0 var(--ddd-spacing-3, 12px) 0 16px",
    "--simple-modal-titlebar-font-size": "16px",
    "--simple-modal-titlebar-font-weight": "var(--ddd-font-weight-bold, 700)",
    "--simple-modal-title-icon-size": "18px",
    "--simple-modal-breadcrumb-gap": "6px",
    "--simple-modal-breadcrumb-icon-gap": "6px",
    "--simple-modal-title-text-offset": "0",
    "--simple-modal-titlebar-icon-height": "20px",
    "--simple-modal-titlebar-icon-width": "20px",
  },
  SITE_ADMIN_MODAL_SIZE: {
    "--simple-modal-width": "calc(100vw - 2 * clamp(0px, 2vw - 8px, 32px))",
    "--simple-modal-max-width": "1680px",
    "--simple-modal-min-width": "300px",
    "--simple-modal-height": "calc(100dvh - 2 * clamp(0px, 2vw - 8px, 32px))",
    "--simple-modal-max-height": "100dvh",
    "--simple-modal-min-height": "360px",
    "--simple-modal-container-padding": "0",
    "--simple-modal-border-radius": "clamp(0px, 1vw - 4px, 8px)",
  },
  SITE_ADMIN_MODAL_STYLES: {
    "--simple-modal-titlebar-background":
      "var(--hax-ui-titlebar, light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-potentialMidnight)))",
    "--simple-modal-titlebar-color":
      "var(--hax-ui-on-titlebar, var(--ddd-theme-default-white))",
    "--simple-modal-titlebar-height": "var(--hax-ui-titlebar-height, 48px)",
    "--simple-modal-titlebar-mobile-height":
      "var(--hax-ui-titlebar-height, 48px)",
    "--simple-modal-titlebar-padding": "0 var(--ddd-spacing-3, 12px) 0 16px",
    "--simple-modal-titlebar-font-size": "16px",
    "--simple-modal-titlebar-font-weight": "var(--ddd-font-weight-bold, 700)",
    "--simple-modal-title-icon-size": "18px",
    "--simple-modal-breadcrumb-gap": "6px",
    "--simple-modal-breadcrumb-icon-gap": "6px",
    "--simple-modal-title-text-offset": "0",
    "--simple-modal-titlebar-icon-height": "20px",
    "--simple-modal-titlebar-icon-width": "20px",
    "--simple-modal-width": "calc(100vw - 2 * clamp(0px, 2vw - 8px, 32px))",
    "--simple-modal-max-width": "1680px",
    "--simple-modal-min-width": "300px",
    "--simple-modal-height": "calc(100dvh - 2 * clamp(0px, 2vw - 8px, 32px))",
    "--simple-modal-max-height": "100dvh",
    "--simple-modal-min-height": "360px",
    "--simple-modal-container-padding": "0",
    "--simple-modal-border-radius": "clamp(0px, 1vw - 4px, 8px)",
    "--simple-modal-z-index": "100000000",
    "--simple-modal-content-padding": "0",
    "--simple-modal-content-container-background":
      "light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray))",
  },
  SITE_ADMIN_CONFIRM_STYLES: {
    "--simple-modal-titlebar-background":
      "light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray))",
    "--simple-modal-titlebar-color":
      "light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white))",
    "--simple-modal-titlebar-height": "auto",
    "--simple-modal-titlebar-mobile-height": "auto",
    "--simple-modal-titlebar-padding": "16px 16px 0",
    "--simple-modal-titlebar-font-size": "15px",
    "--simple-modal-titlebar-font-size-mobile": "15px",
    "--simple-modal-titlebar-font-weight": "var(--ddd-font-weight-bold, 700)",
    "--simple-modal-title-text-offset": "0",
    "--simple-modal-title-align": "start",
    "--simple-modal-content-container-background":
      "light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray))",
    "--simple-modal-content-padding": "0",
    "--simple-modal-width": "460px",
    "--simple-modal-max-width": "calc(100vw - 32px)",
    "--simple-modal-min-width": "300px",
    "--simple-modal-height": "auto",
    "--simple-modal-min-height": "0",
    "--simple-modal-border-radius": "var(--ddd-radius-sm, 8px)",
    "--simple-modal-z-index": "100000000",
  },
};

describe("site admin modal styles come from the HAX UI dialog frame", () => {
  it("keeps every site admin map exactly as it was", () => {
    expect({ ...SITE_ADMIN_TITLEBAR_STYLES }).to.deep.equal(
      BEFORE.SITE_ADMIN_TITLEBAR_STYLES,
    );
    expect({ ...SITE_ADMIN_MODAL_SIZE }).to.deep.equal(
      BEFORE.SITE_ADMIN_MODAL_SIZE,
    );
    expect({ ...SITE_ADMIN_MODAL_STYLES }).to.deep.equal(
      BEFORE.SITE_ADMIN_MODAL_STYLES,
    );
    expect({ ...SITE_ADMIN_CONFIRM_STYLES }).to.deep.equal(
      BEFORE.SITE_ADMIN_CONFIRM_STYLES,
    );
  });

  it("is the frame, not a copy of it", () => {
    expect(SITE_ADMIN_TITLEBAR_STYLES).to.equal(HaxUiDialogTitlebar);
    expect(SITE_ADMIN_CONFIRM_STYLES).to.equal(HaxUiDialogConfirm);
  });

  it("frame only sets properties simple-modal reads", () => {
    Object.keys(HaxUiDialogFrame).forEach((prop) => {
      expect(SimpleModalCssVars, prop).to.include(prop);
    });
  });
});
