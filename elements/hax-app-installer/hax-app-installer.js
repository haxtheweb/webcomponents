/**
 * Copyright 2026 The Pennsylvania State University
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import {
  HaxUiAdminStyles,
  HaxUiAdminIcons,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js";
import { HaxUiDialogTitlebarStyles } from "@haxtheweb/d-d-d/lib/HaxUiDialogFrame.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
// the shared, searchable language list (reads the canonical language registry)
import "@haxtheweb/haxcms-elements/lib/core/haxcms-language-picker.js";
import {
  retroKitKey,
  retroKitInField,
} from "@haxtheweb/retro-tv/lib/retro-kit.js";
// Tips: stacked stop-notes
import "@haxtheweb/stop-note/lib/stop-note-group.js";

/**
 * HAX TV (the set, its programs and the kit) is not on the critical path:
 * it loads after the installer's form has painted, so the page is usable
 * at once. Until then its tags sit in the DOM undefined and the installer
 * leaves them alone.
 * @returns {Promise}
 */
export function loadHaxTv() {
  return Promise.all([
    import("@haxtheweb/retro-tv/retro-tv.js"),
    import("@haxtheweb/retro-tv/lib/programs/retro-tv-sign-on.js"),
    import("@haxtheweb/retro-tv/lib/programs/retro-tv-blocks.js"),
    import("@haxtheweb/retro-tv/lib/programs/retro-tv-title-sequence.js"),
    import("@haxtheweb/retro-tv/lib/programs/retro-tv-hax-tv.js"),
    import("@haxtheweb/retro-tv/lib/programs/retro-tv-credits.js"),
    import("@haxtheweb/retro-tv/lib/programs/retro-tv-static.js"),
    import("@haxtheweb/retro-tv/lib/programs/retro-tv-home-computer.js"),
    import("@haxtheweb/retro-tv/lib/programs/retro-tv-handheld.js"),
    import("@haxtheweb/retro-tv/lib/programs/retro-tv-pc.js"),
    import("@haxtheweb/retro-tv/lib/programs/retro-tv-disc.js"),
    // the HAX TV kit: a VCR on the set, the HAX 64 and its controller below
    import("@haxtheweb/retro-tv/lib/retro-vcr.js"),
    import("@haxtheweb/retro-tv/lib/retro-console.js"),
    import("@haxtheweb/retro-tv/lib/retro-controller.js"),
  ]);
}

/** HAX TV channels: what plays while each request runs */
const TV = {
  idle: 4,
  credits: 5,
  language: 7,
  prepare: 9,
  continue: 8,
  install: 10,
};
/** a loading screen stays on at least this long, so a fast server still shows it */
const TV_MIN_MS = 1600;
/** the HAX 64 plays HAX Blocks on this channel */
const TV_GAME = 2;
/** which tip each step opens on */
const TIP_START = { 1: 0, 2: 1, 3: 4, 4: 0 };
/** the kit's colorways, from the Future Traveler */
const KITS = ["helmet", "goggle", "bulb"];
/** where the viewer's TV choices are kept */
const TV_MIN_KEY = "hax-app-installer-tv-min";
const KIT_KEY = "hax-app-installer-kit";

/**
 * `hax-app-installer`
 *  4-step HAXcms installation wizard, drawn in HAX UI (the admin layer of
 *  DDD): a titlebar, the steps as a rail, one action bar that owns Back and
 *  the step's main action, and HAX TV (retro-tv) beside the form, which
 *  plays a loading screen from an old system while each request runs and
 *  rolls credits once HAXcms is installed.
 * Steps: Choose language, Verify requirements, Configure system, Start HAXcms.
 * @demo index.html
 * @element hax-app-installer
 */
export class HaxAppInstaller extends I18NMixin(LitElement) {
  static get tag() {
    return "hax-app-installer";
  }

  constructor() {
    super();
    /** resolves once HAX TV (set, programs, kit) has loaded */
    this.haxTvReady = Promise.resolve(false);
    this._haxTvLoaded = false;
    this.step = 1;
    this.language = "en";
    this.apiEndpoint = "install.php";
    this.stateData = {};
    this.loading = false;
    this.error = "";
    this._selectedLanguage = "en";
    this._usernameInput = "admin";
    this._passwordInput = "";
    this._copiedField = "";
    this._passwordRevealed = false;
    this._celebrate = false;
    this._confirmPasswordInput = "";
    this._passwordMismatch = false;
    this._serverErrors = [];
    this._preparePermissionCommand = "";
    this._preparePermissionHint = "";
    this._shortcutsOpen = false;
    this._tvChannel = TV.idle;
    this._tvBusy = "";
    this._tvPower = true;
    this._tvMin = false;
    this._kit = "helmet";
    this.__lastShow = TV.idle;
    this.__tvReturn = TV.idle;
    this.__tvTimer = null;
    this.__focusHeading = false;
    this.__onKeydown = this._onKeydown.bind(this);
    this.t = this.t || {};
    this.t = {
      ...this.t,
      haxcmsInstaller: "HAXcms Installer",
      loading: "Loading…",
      chooseLanguage: "Choose language",
      selectLanguageDescription:
        "Select the language for the installation process and the default site language.",
      saveAndContinue: "Save and continue",
      back: "Back",
      verifyRequirements: "Verify requirements",
      verifyRequirementsDescription:
        "Check that your server environment meets the requirements for running HAX.",
      requirementsNeedingConfiguration: "Requirements needing configuration",
      passedChecks: "Passed checks",
      recheckRequirements: "Re-check requirements",
      createMissingFiles: "Create missing files",
      permissionRequired: "Permission required",
      continue: "Continue",
      allRequirementsMet:
        "All requirements are met. You can continue to the next step.",
      requirement: "Requirement",
      value: "Value",
      description: "Description",
      suggestedCommand: "Suggested command",
      configureSystem: "Configure system",
      configureSystemDescription:
        "Set up your administrator account for the new HAX site.",
      adminUsername: "Admin username",
      adminPassword: "Admin password",
      passwordHelp:
        "Enter a password that meets all the requirements below, then confirm it to enable installation.",
      confirmPassword: "Confirm password",
      passwordsDoNotMatch: "Passwords do not match.",
      passwordsMatch: "Passwords match.",
      weak: "Weak",
      fair: "Fair",
      good: "Good",
      strong: "Strong",
      passwordStrength: "Password strength",
      passwordRequirements: "Password requirements",
      requirementLength: "At least 8 characters",
      requirementUppercase: "One uppercase letter",
      requirementLowercase: "One lowercase letter",
      requirementNumber: "One number",
      requirementSymbol: "One symbol",
      saveAndInstall: "Save and install",
      startHaxcms: "Start HAXcms",
      installationComplete: "Installation complete! Here are your credentials.",
      username: "Username",
      password: "Password",
      copy: "Copy",
      copied: "Copied!",
      show: "Show",
      hide: "Hide",
      saveCredentialsWarning:
        "Important: Save these credentials now. This is the only time they will be displayed.",
      autoGenerated: "Auto-generated",
      needHelp: "Need help?",
      documentation: "Documentation",
      reportIssues: "Report Issues",
      discord: "Discord",
      githubRepository: "GitHub Repository",
      anErrorOccurred: "An error occurred",
      retry: "Retry",
      haxcmsMascotAlt: "Future Traveler, the HAX mascot",
      installationSteps: "Installation steps",
      stepCount: "Step {current} of {total}",
      language: "Language",
      languageHelp: "Type a name, native name or code.",
      usernameHelp: "Letters, numbers, dot, dash and underscore.",
      metCount: "{met} of {total} met",
      met: "met",
      notYetMet: "not yet met",
      readyToInstall: "Ready to install",
      versionAfterSignIn:
        "The HAXcms version and full server paths show in system admin after you sign in.",
      foreverTitle: "Your HAX is yours, forever",
      foreverFiles:
        "Your sites are plain files in _sites, tracked with git from day one.",
      foreverStandards:
        "Built on web standards, so what you make keeps working as HAXcms updates.",
      foreverPortable:
        "Take a site anywhere: it runs on HAXcms in PHP or Node, or as static files.",
      foreverPillar: "Sustainable: built to last, light on the planet.",
      haxTv: "HAX TV",
      nowPlaying: "Now playing:",
      tvIsOff: "The TV is off",
      nextChannel: "Next channel",
      previousChannel: "Previous channel",
      channelDown: "CH −",
      channelUp: "CH +",
      turnTvOn: "Turn the TV on",
      turnTvOff: "Turn the TV off",
      powerOn: "Power on",
      powerOff: "Power off",
      whileInstallerWorks: "while the installer works",
      tvArtCredit:
        "Future Traveler art from haxtheweb/art. The TV looks the same in light and dark.",
      keyboardShortcuts: "Keyboard shortcuts",
      shortcutMainAction: "Run the step's main action",
      shortcutFinishedStep: "Return to a finished step",
      shortcutChannel: "Change the TV channel",
      shortcutList: "Show this list",
      shortcutClose: "Close this list",
      close: "Close",
      channel: "CH",
      titleSequenceFor: "Title sequence for",
      presents: "presents",
      runningTime: "Running time",
      min: "min",
      play: "Play",
      installingHaxcms: "Installing HAXcms",
      haxcmsInstalled: "HAXcms installed",
      minimize: "Minimize",
      showTv: "Show TV",
      tvPower: "Power",
      installed: "Installed",
      bannerStep: "STEP {current}/4 · {what}",
      bannerWorking: "WORKING…",
      banner1: "PICK A LANGUAGE",
      banner2: "CHECKING YOUR SERVER",
      banner3: "MAKE YOUR ADMIN ACCOUNT",
      banner4: "SAVE YOUR LOGIN",
      vcr: "VCR",
      topLoad: "Top load",
      eject: "Eject",
      rew: "Rew",
      ff: "FF",
      previousChannelHint: "previous channel",
      replayChannel: "replay this channel",
      nextChannelHint: "next channel",
      consoleLabel: "HAX 64 console",
      consolePower: "Console power",
      consoleReset: "Reset the game",
      consoleColor: "Console color",
      colorHelmet: "Helmet red",
      colorGoggle: "Goggle cyan",
      colorBulb: "Bulb yellow",
      gameController: "Game controller",
      padUp: "Up: grab",
      padDown: "Down: take back",
      padLeft: "Left",
      padRight: "Right",
      padSelect: "Select: remix your fighter",
      padStart: "Start: publish your page",
      padB: "B: take back the last block",
      padA: "A: grab a block",
      padNote:
        "HAX Blocks on channel 2: race three rivals for the HAX blocks. A grabs (or bonks a rival next to you), B takes one back, Select remixes your fighter, Start publishes. Your keyboard works too: arrows, A and B light up the button they press.",
      tips: "Tips",
      tipDifferenceTitle: "The HAX difference: what you make keeps working",
      tipDifference:
        "Your pages are web-standard HTML in plain files you own, tracked with git. Nearly every site built with HAX since 2020 still works today, and a site moves between HAXcms in PHP, in Node or static hosting as it is. Built to last, light on the planet.",
      pillarAccessible: "Accessible",
      pillarEfficient: "Efficient",
      pillarExtensible: "Extensible",
      pillarOpen: "Free and open",
      pillarAgnostic: "Platform agnostic",
      pillarRemixable: "Remixable",
      pillarSustainable: "Sustainable",
      tipFilesTitle: "Bring your files and make them HAX",
      tipFiles:
        "After install, Import on the dashboard turns these into a HAX site you can edit, remix and take anywhere.",
      htmlFile: "HTML file",
      tipSitesTitle: "Move a whole website in",
      tipSites:
        "Point Import at a site's address and its pages come in as HAX pages and blocks.",
      anyWebPage: "Any web page",
      tipBooksTitle: "Books and docs come in too",
      tipBooks:
        "Open textbooks and docs-as-code repos become a HAX site with their outline intact.",
      tipPasswordTitle: "Your password shows once",
      tipPassword:
        "The last step shows your new login one time. Keep it in a password manager before you start HAXcms.",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
    });
  }

  static get properties() {
    return {
      ...super.properties,
      step: { type: Number },
      language: { type: String },
      apiEndpoint: { type: String, attribute: "api-endpoint" },
      stateData: { type: Object },
      loading: { type: Boolean },
      error: { type: String },
      _shortcutsOpen: { type: Boolean, state: true },
      _tvChannel: { type: Number, state: true },
      _tvBusy: { type: String, state: true },
      _tvPower: { type: Boolean, state: true },
      _tvMin: { type: Boolean, state: true },
      _kit: { type: String, state: true },
    };
  }

  static get styles() {
    return [
      ...HaxUiAdminStyles,
      ...HaxUiDialogTitlebarStyles,
      css`
        :host {
          display: block;
          color-scheme: light dark;
          box-sizing: border-box;
          min-height: 100vh;
          min-height: 100dvh;
          padding: clamp(0px, 2vw - 8px, 32px);
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
          background: var(--hax-ui-sunken);
        }
        * {
          box-sizing: border-box;
        }
        p,
        li,
        td,
        th,
        label,
        a,
        button {
          font-family: var(--hax-ui-admin-font-family);
        }
        :focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        simple-icon-lite {
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
          flex: none;
        }

        /* one admin frame */
        .frame {
          position: relative;
          max-width: 1280px;
          margin: 0 auto;
          height: calc(100dvh - 2 * clamp(0px, 2vw - 8px, 32px));
          min-height: 560px;
          display: grid;
          grid-template-rows:
            var(--hax-ui-titlebar-height)
            minmax(0, 1fr)
            var(--hax-ui-action-bar-height);
          background: var(--hax-ui-surface);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg);
          box-shadow: var(--hax-ui-shadow-popover);
          overflow: hidden;
          container-type: inline-size;
          container-name: installer;
        }
        .installer-logo {
          width: 28px;
          height: 28px;
          object-fit: contain;
          flex: none;
        }
        .crumb {
          color: var(--hax-ui-on-titlebar);
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          min-width: 0;
        }
        .crumb .sep,
        .crumb .now {
          color: var(--hax-ui-on-titlebar);
          font-weight: var(--ddd-font-weight-regular, 400);
          font-size: var(--hax-ui-admin-font-size);
          opacity: 0.8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tb-tools {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          margin-left: auto;
        }
        .lang-chip {
          font-size: var(--hax-ui-admin-font-size-xs);
          padding: 2px var(--hax-ui-gap-md);
          border-radius: var(--hax-ui-radius-pill);
          border: 1px solid
            color-mix(in srgb, var(--hax-ui-on-titlebar) 40%, transparent);
          white-space: nowrap;
        }
        .shortcuts {
          position: absolute;
          right: var(--hax-ui-gap-lg);
          top: calc(var(--hax-ui-titlebar-height) - 4px);
          z-index: 3;
          width: min(320px, calc(100% - 24px));
          padding: var(--hax-ui-gap-lg);
          color: var(--hax-ui-text);
          background: var(--hax-ui-surface);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius-lg);
          box-shadow: var(--hax-ui-shadow-popover);
        }
        .shortcuts-head {
          display: flex;
          align-items: center;
          margin-bottom: var(--hax-ui-gap-md);
        }
        .shortcuts h2 {
          margin: 0;
          font-size: var(--hax-ui-admin-font-size);
          flex: 1;
        }
        .shortcuts dl {
          margin: 0;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
        }
        .shortcuts dt {
          white-space: nowrap;
        }
        .shortcuts dd {
          margin: 0;
          color: var(--hax-ui-text-muted);
        }

        .body {
          display: grid;
          grid-template-columns: var(--hax-ui-rail-width) minmax(0, 1fr) 360px;
          min-height: 0;
        }

        /* the steps, as the section rail */
        .rail {
          background: var(--hax-ui-sunken);
          border-right: 1px solid var(--hax-ui-line);
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow: auto;
        }
        .step-indicator {
          list-style: none;
          margin: 0;
          padding: var(--hax-ui-gap-md);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .step-link,
        .step-static {
          all: unset;
          box-sizing: border-box;
          width: 100%;
          height: var(--hax-ui-row-height-roomy);
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          padding: 0 var(--hax-ui-gap-md);
          border-radius: var(--hax-ui-radius);
          color: var(--hax-ui-text);
        }
        .step-link {
          cursor: pointer;
        }
        .step-link:hover {
          background: var(--hax-ui-hover);
        }
        .step-link:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: -2px;
        }
        .step-pending .step-static {
          color: var(--hax-ui-text-muted);
        }
        .step-active .step-static {
          background: var(--hax-ui-selected);
          font-weight: var(--ddd-font-weight-bold, 700);
          box-shadow: inset 3px 0 0 var(--hax-ui-accent-strong);
        }
        .step-num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: inline-grid;
          place-items: center;
          flex: none;
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-bold, 700);
          border: 1px solid var(--hax-ui-line-strong);
          --simple-icon-width: 14px;
          --simple-icon-height: 14px;
        }
        .step-active .step-num {
          background: var(--hax-ui-accent-strong);
          color: var(--hax-ui-on-accent);
          border-color: transparent;
        }
        .step-done .step-num {
          color: var(--hax-ui-success);
          border-color: currentColor;
        }
        .step-label {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .help-footer {
          margin-top: auto;
          padding: var(--hax-ui-gap-md);
          border-top: 1px solid var(--hax-ui-line);
        }
        .help-footer-label {
          display: block;
          margin: 0 0 var(--hax-ui-gap) var(--hax-ui-gap-md);
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--hax-ui-text-muted);
        }
        .help-footer-links {
          display: flex;
          flex-direction: column;
        }
        .help-footer-link {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          height: var(--hax-ui-row-height);
          padding: 0 var(--hax-ui-gap-md);
          border-radius: var(--hax-ui-radius);
          color: var(--hax-ui-text);
          text-decoration: none;
        }
        .help-footer-link:hover {
          background: var(--hax-ui-hover);
        }
        .help-footer-link .ext {
          margin-left: auto;
          opacity: 0.6;
          --simple-icon-width: 12px;
          --simple-icon-height: 12px;
        }

        /* the main column */
        .main {
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 0;
        }
        .ph {
          padding: var(--ddd-spacing-4, 16px) var(--ddd-spacing-6, 24px)
            var(--hax-ui-gap-lg);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        .ph-top {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
        }
        .ph h2 {
          margin: 0;
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-bold, 700);
          outline: none;
          flex: 1;
        }
        .ph p {
          margin: 2px 0 0;
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .content {
          flex: 1;
          overflow: auto;
          padding: var(--hax-ui-gap-lg) var(--ddd-spacing-6, 24px)
            var(--ddd-spacing-6, 24px);
        }
        .content > * + * {
          margin-top: var(--hax-ui-gap-lg);
        }
        .section-title {
          margin: var(--ddd-spacing-4, 16px) 0 var(--hax-ui-gap);
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-bold, 700);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--hax-ui-text-muted);
        }
        haxcms-language-picker {
          --haxcms-language-picker-font-size: var(--hax-ui-admin-font-size);
          --haxcms-language-picker-option-font-size: var(
            --hax-ui-admin-font-size
          );
          --haxcms-language-picker-input-height: var(--hax-ui-field-height);
          --haxcms-language-picker-border: 1px solid;
          --haxcms-language-picker-border-color: var(--hax-ui-line-strong);
          --haxcms-language-picker-radius: var(--hax-ui-radius);
        }

        /* requirement rows */
        .req-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        .req-table th {
          text-align: left;
          height: var(--hax-ui-row-height);
          padding: 0 var(--hax-ui-gap-md);
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--hax-ui-text-muted);
          border-bottom: 1px solid var(--hax-ui-line-strong);
        }
        .req-table td {
          vertical-align: top;
          padding: var(--hax-ui-gap-md);
          border-bottom: 1px solid var(--hax-ui-line);
          overflow-wrap: anywhere;
        }
        .req-table .req-title {
          font-weight: var(--ddd-font-weight-medium, 500);
        }
        .req-table .req-desc {
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .req-status {
          gap: var(--hax-ui-gap);
          --simple-icon-width: 12px;
          --simple-icon-height: 12px;
        }
        .cmd {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap);
          margin-top: var(--hax-ui-gap);
        }
        .cmd-block {
          flex: 1;
          min-width: 0;
          margin: 0;
          padding: 2px var(--hax-ui-gap-md);
          font-family: var(--ddd-font-mono, "Roboto Mono", monospace);
          font-size: var(--hax-ui-admin-font-size-xs);
          line-height: 1.5;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          background: var(--hax-ui-sunken);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius);
        }
        details.req-details {
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg);
        }
        details.req-details summary {
          cursor: pointer;
          height: var(--hax-ui-row-height-roomy);
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          padding: 0 var(--hax-ui-gap-lg);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        details.req-details[open] summary {
          border-bottom: 1px solid var(--hax-ui-line);
        }
        .no-issues {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          border-radius: var(--hax-ui-radius);
          color: var(--hax-ui-success);
          background: var(--hax-ui-success-soft);
          font-weight: var(--ddd-font-weight-medium, 500);
        }
        .permission-banner .cmd {
          margin-top: var(--hax-ui-gap-md);
        }
        .permission-banner-hint {
          margin: var(--hax-ui-gap) 0 0;
        }
        .server-error-banner ul {
          margin: 0;
          padding-left: var(--hax-ui-gap-lg);
        }

        /* password */
        .pw {
          display: flex;
          gap: var(--hax-ui-gap);
        }
        .pw .hax-ui-input {
          flex: 1;
          min-width: 0;
        }
        .strength-meter {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
        }
        .strength-bars {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 3px;
          flex: 1;
        }
        .strength-bars span {
          height: 6px;
          border-radius: 3px;
          background: var(--hax-ui-line);
        }
        .strength-bars span.on {
          background: var(--hax-ui-accent-strong);
        }
        .strength-1 .strength-bars span.on {
          background: repeating-linear-gradient(
            135deg,
            var(--hax-ui-warning) 0 3px,
            transparent 3px 6px
          );
          background-color: var(--hax-ui-warning-soft);
        }
        .strength-label {
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .password-criteria {
          list-style: none;
          margin: 0;
          padding: var(--hax-ui-gap-md);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px var(--hax-ui-gap-lg);
          background: var(--hax-ui-sunken);
          border-radius: var(--hax-ui-radius);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .criteria-item {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap);
          color: var(--hax-ui-text-muted);
          --simple-icon-width: 14px;
          --simple-icon-height: 14px;
        }
        .criteria-item.met {
          color: var(--hax-ui-success);
          font-weight: var(--ddd-font-weight-medium, 500);
        }
        .confirm-feedback {
          font-weight: var(--ddd-font-weight-medium, 500);
        }
        .confirm-feedback.match {
          color: var(--hax-ui-success);
          background: var(--hax-ui-success-soft);
        }
        /* a mismatch is "incorrect": purple, an icon, words and a texture */
        .confirm-feedback.mismatch {
          color: var(--hax-ui-incorrect);
          background:
            repeating-linear-gradient(
              135deg,
              var(--hax-ui-incorrect-soft) 0 4px,
              transparent 4px 8px
            ),
            var(--hax-ui-incorrect-soft);
        }

        /* credentials */
        .cred {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap);
        }
        .credential-value {
          flex: 1;
          min-width: 0;
          height: var(--hax-ui-field-height);
          line-height: var(--hax-ui-field-height);
          padding: 0 var(--hax-ui-gap-lg);
          font-family: var(--ddd-font-mono, "Roboto Mono", monospace);
          font-size: var(--hax-ui-admin-font-size);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          background: var(--hax-ui-sunken);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .generated-tag {
          margin-left: var(--hax-ui-gap-md);
        }
        .forever {
          display: grid;
          grid-template-columns: 56px 1fr;
          gap: var(--hax-ui-gap-lg);
          align-items: start;
          padding: var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg);
        }
        .forever img {
          width: 56px;
          height: auto;
        }
        .forever h3 {
          margin: 0 0 var(--hax-ui-gap);
          font-size: var(--hax-ui-admin-font-size);
        }
        .forever ul {
          margin: 0;
          padding-left: var(--hax-ui-gap-lg);
          color: var(--hax-ui-text-muted);
          line-height: 1.6;
        }
        .forever p {
          margin: var(--hax-ui-gap) 0 0;
          font-style: italic;
        }
        .error-box {
          margin-top: var(--ddd-spacing-6, 24px);
        }
        .error-box h3 {
          margin: 0;
          color: var(--hax-ui-text);
        }
        .error-box p {
          margin: 0;
        }

        /* the action bar */
        .ftr {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          padding: 0 var(--ddd-spacing-4, 16px);
          border-top: 1px solid var(--hax-ui-line);
          background: var(--hax-ui-surface);
          min-width: 0;
        }
        .st {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          min-width: 0;
          color: var(--hax-ui-text-muted);
        }
        .st-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex: none;
          background: var(--hax-ui-line-strong);
        }
        .dot.busy {
          background: var(--hax-ui-accent-strong);
        }
        .dot.err {
          background: var(--hax-ui-danger);
        }
        .dot.ok {
          background: var(--hax-ui-success);
        }
        .acts {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
        }
        .acts .hax-ui-kbd {
          margin-left: var(--hax-ui-gap);
          color: inherit;
          background: transparent;
          border-color: color-mix(in srgb, currentColor 40%, transparent);
        }

        /* HAX TV */
        .tvpanel {
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap-md);
          min-height: 0;
          overflow: auto;
          padding: var(--hax-ui-gap-lg);
          background: var(--hax-ui-sunken);
          border-left: 1px solid var(--hax-ui-line);
        }
        .tvpanel h2 {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          margin: 0;
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-bold, 700);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--hax-ui-text-muted);
        }
        retro-tv {
          --retro-tv-padding: 12px;
          --retro-tv-gap: 10px;
          --retro-tv-radius: 16px;
          --retro-tv-bezel-padding: 10px;
          --retro-tv-bezel-radius: 12px;
          --retro-tv-side-width: 40px;
          --retro-tv-side-padding: 6px;
          --retro-tv-knob-size: 30px;
          --retro-tv-knob-mark-top: 4px;
          --retro-tv-knob-mark-width: 3px;
          --retro-tv-knob-mark-height: 9px;
          --retro-tv-knob-mark-origin: 11px;
          --retro-tv-grille-width: 30px;
          --retro-tv-grille-min-height: 50px;
          --retro-tv-led-size: 8px;
          --retro-tv-osd-size: 22px;
          --retro-tv-screen-radius: 22px / 28px;
          --retro-tv-shadow:
            0 14px 30px rgba(0, 0, 0, 0.45),
            inset 0 2px 0 rgba(255, 255, 255, 0.12);
          --retro-tv-program-text: 13px;
          --retro-tv-program-small: 9px;
          --retro-tv-program-title: 28px;
          --retro-tv-title-size: 32px;
          --retro-tv-kicker-size: 10px;
        }
        .tv-side {
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap-md);
          min-width: 0;
        }
        .tv-controls {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--hax-ui-gap-md);
        }
        .now,
        .tv-credit {
          margin: 0;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
          line-height: 1.4;
        }
        .now b {
          color: var(--hax-ui-text);
        }

        /* narrower: the rail folds to icons, the TV narrows */
        @container installer (max-width: 980px) {
          .body {
            grid-template-columns:
              var(--hax-ui-rail-width-collapsed)
              minmax(0, 1fr)
              280px;
          }
          .step-label,
          .help-footer-label,
          .help-footer-link span,
          .help-footer-link .ext {
            display: none;
          }
          .step-link,
          .step-static,
          .help-footer-link {
            justify-content: center;
            padding: 0;
          }
        }
        /* phones: the steps become a strip, the TV a band above the form */
        @container installer (max-width: 620px) {
          .body {
            grid-template-columns: minmax(0, 1fr);
            grid-template-rows: auto minmax(0, 1fr) auto;
          }
          .rail {
            flex-direction: row;
            border-right: 0;
            border-bottom: 1px solid var(--hax-ui-line);
            overflow: visible;
          }
          .step-indicator {
            flex-direction: row;
            justify-content: space-around;
            flex: 1;
          }
          .step-link,
          .step-static {
            width: auto;
            padding: 0 var(--hax-ui-gap-md);
          }
          .step-active .step-static {
            box-shadow: inset 0 -3px 0 var(--hax-ui-accent-strong);
          }
          .help-footer {
            display: none;
          }
          .tvpanel {
            grid-row: 3;
            flex-direction: row;
            align-items: center;
            border-left: 0;
            border-top: 1px solid var(--hax-ui-line);
            padding: var(--hax-ui-gap-md);
            overflow: visible;
          }
          .tvpanel h2,
          .tv-credit {
            display: none;
          }
          retro-tv {
            width: 168px;
            flex: none;
            --retro-tv-padding: 6px;
            --retro-tv-bezel-padding: 5px;
            --retro-tv-side-width: 0px;
            --retro-tv-osd-size: 14px;
            --retro-tv-program-text: 7px;
            --retro-tv-program-small: 5px;
            --retro-tv-program-title: 14px;
            --retro-tv-title-size: 14px;
            --retro-tv-kicker-size: 5px;
          }
          .main {
            grid-row: 2;
          }
          .ph,
          .content {
            padding-left: var(--ddd-spacing-4, 16px);
            padding-right: var(--ddd-spacing-4, 16px);
          }
          .ph-top .hax-ui-pill,
          .crumb .sep,
          .crumb .now,
          .lang-chip,
          .st-text,
          .acts .hax-ui-kbd {
            display: none;
          }
          .password-criteria {
            grid-template-columns: 1fr;
          }
          .req-table thead {
            display: none;
          }
          .req-table,
          .req-table tbody,
          .req-table tr,
          .req-table td {
            display: block;
            width: 100%;
          }
          .req-table tr {
            margin-bottom: var(--hax-ui-gap-md);
            border: 1px solid var(--hax-ui-line);
            border-radius: var(--hax-ui-radius);
          }
          .acts .hax-ui-btn:not(.primary) .btn-label {
            position: absolute;
            width: 1px;
            height: 1px;
            overflow: hidden;
            clip: rect(0 0 0 0);
            white-space: nowrap;
          }
          .st {
            display: none;
          }
          .hax-ui-field-row {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        /* the Future Traveler, top right as in every HAX interface */
        .ft-mark {
          display: inline-grid;
          place-items: center;
          width: 32px;
          height: 32px;
          --simple-icon-width: 28px;
          --simple-icon-height: 28px;
        }
        /* the step's actions again, right under the steps */
        .rail-acts {
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap-md);
          margin: 0 var(--hax-ui-gap-md);
          padding: var(--hax-ui-gap-md) 0 var(--hax-ui-gap-lg);
          border-top: 1px solid var(--hax-ui-line);
        }
        .rail-acts .hax-ui-btn {
          width: 100%;
          box-sizing: border-box;
          justify-content: center;
        }
        .rail-acts .hax-ui-btn.ghost {
          order: 2;
        }
        button.help-footer-link {
          box-sizing: border-box;
          width: 100%;
          border: 0;
          background: none;
          font: inherit;
          cursor: pointer;
          text-align: start;
        }
        .help-footer-link:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        /* installing: the meter in the page header on every step */
        .inst {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
          white-space: nowrap;
        }
        .inst-lbl {
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--hax-ui-text);
        }
        .inst .segs {
          display: inline-grid;
          grid-template-columns: repeat(4, 22px);
          gap: 3px;
        }
        .inst .segs i {
          height: 6px;
          border-radius: 3px;
          background: var(--hax-ui-line);
        }
        .inst .segs i.done {
          background: var(--hax-ui-success);
        }
        .inst .segs i.now {
          background: repeating-linear-gradient(
            135deg,
            var(--hax-ui-accent-strong) 0 4px,
            color-mix(in srgb, var(--hax-ui-accent-strong) 55%, transparent) 4px
              8px
          );
        }
        /* tips */
        /* stop-notes at the admin layer's size */
        .tips {
          margin-top: var(--ddd-spacing-6, 24px);
          --ddd-theme-h5-font-size: 16px;
        }
        .tips p {
          margin: 0;
          font-size: var(--hax-ui-admin-font-size);
          line-height: 1.5;
        }
        .tips .chips {
          list-style: none;
          margin: var(--hax-ui-gap-md) 0 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .tips .chips li {
          padding: 2px 10px;
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius-pill);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        /* HAX TV: minimize, the kit, real buttons */
        .tvpanel h2 .tvmin {
          margin-left: auto;
          height: 28px;
          text-transform: none;
          letter-spacing: 0;
          color: var(--hax-ui-text);
        }
        .tvmini {
          margin: 0;
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .tvmini b {
          color: var(--hax-ui-text);
        }
        .dotlive {
          flex: none;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--hax-ui-success);
        }
        .tvbody {
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap-md);
          min-width: 0;
        }
        .tvbody[hidden] {
          display: none;
        }
        retro-vcr {
          zoom: 0.6;
          margin-top: 40px;
        }
        retro-tv {
          --retro-tv-side-width: 64px;
          --retro-tv-side-padding: 0px;
          --retro-tv-dial-size: 62px;
          --retro-tv-knob-size: 30px;
          --retro-tv-power-size: 30px;
          --retro-tv-dial-number-size: 6px;
          --retro-tv-side-label-size: 7px;
        }
        /* the banner over every channel: the install is what is on */
        .bnr {
          position: absolute;
          z-index: 4;
          left: 0;
          right: 0;
          top: 0;
          bottom: auto;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          column-gap: 8px;
          padding: 5% 9% 4%;
          background: linear-gradient(
            180deg,
            rgba(0, 3, 33, 0.88),
            rgba(0, 3, 33, 0.65) 70%,
            transparent
          );
          font-family: "VT323", monospace;
          color: #ffffff;
          text-transform: uppercase;
          pointer-events: none;
        }
        .bnr b {
          font-weight: 400;
          font-size: 14px;
          white-space: nowrap;
          color: #5dff8a;
          text-shadow: 0 0 6px rgba(93, 255, 138, 0.7);
          letter-spacing: 0.06em;
        }
        .bnr .bsub {
          grid-column: 1 / -1;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          letter-spacing: 0.04em;
        }
        .bnr .bsegs {
          grid-row: 1;
          grid-column: 2;
          display: inline-grid;
          grid-template-columns: repeat(4, 14px);
          gap: 2px;
        }
        .bnr .bsegs i {
          height: 6px;
          background: rgba(255, 255, 255, 0.25);
        }
        .bnr .bsegs i.done {
          background: #5dff8a;
        }
        .bnr .bsegs i.now {
          background: #ffd100;
        }
        .kit {
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap-md);
        }
        .deckrow {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: var(--hax-ui-gap-md);
        }
        .kitpick {
          display: inline-flex;
          gap: 4px;
          margin-bottom: 4px;
        }
        .kitpick button {
          all: unset;
          cursor: pointer;
          width: 24px;
          height: 24px;
          display: grid;
          place-items: center;
          border-radius: 50%;
        }
        .kitpick button[aria-pressed="true"] {
          box-shadow: 0 0 0 2px var(--hax-ui-text);
        }
        .kitpick button:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .sw {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.35);
        }
        .sw-helmet {
          background: #bc204b;
        }
        .sw-goggle {
          background: #2fd3e0;
        }
        .sw-bulb {
          background: #ffd100;
        }
        .padnote {
          margin: 0;
          font-size: var(--hax-ui-admin-font-size-xs);
          line-height: 1.4;
          color: var(--hax-ui-text-muted);
        }
        .tv-controls {
          gap: 8px;
        }
        .chbtns {
          display: inline-flex;
          flex: none;
          overflow: hidden;
          border-radius: var(--hax-ui-radius);
          box-shadow: 0 0 0 1px var(--hax-ui-line-strong);
        }
        .chb {
          box-sizing: border-box;
          height: 44px;
          min-width: 56px;
          padding: 0 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
          border: 0;
          border-bottom: 3px solid var(--hax-ui-line-strong);
          border-radius: 0;
          background: linear-gradient(
            180deg,
            var(--hax-ui-surface),
            color-mix(in srgb, var(--hax-ui-surface) 88%, var(--hax-ui-text))
          );
          color: var(--hax-ui-text);
          font: 700 13px var(--hax-ui-admin-font-family);
          letter-spacing: 0.04em;
          cursor: pointer;
          touch-action: manipulation;
          --simple-icon-width: 20px;
          --simple-icon-height: 20px;
        }
        .chbtns .chb + .chb {
          box-shadow: inset 1px 0 0 var(--hax-ui-line-strong);
        }
        .chb:hover {
          background: var(--hax-ui-hover);
        }
        .chb:active {
          border-bottom-width: 1px;
          padding-top: 2px;
        }
        .chb:focus-visible {
          position: relative;
          z-index: 1;
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .chb.pw {
          gap: 8px;
          padding: 0 12px;
          border-radius: var(--hax-ui-radius);
          box-shadow: 0 0 0 1px var(--hax-ui-line-strong);
        }
        .chb .lamp {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--hax-ui-line-strong);
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.35);
        }
        .chb.pw[aria-pressed="true"] .lamp {
          background: #1f9d55;
          box-shadow:
            0 0 0 2px color-mix(in srgb, #1f9d55 30%, transparent),
            0 0 8px #3ddc84;
        }
        .now {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }
        @container installer (max-width: 980px) {
          .rail-acts {
            display: none;
          }
          retro-vcr {
            zoom: 0.48;
          }
          .inst-n {
            display: none;
          }
        }
        @container installer (max-width: 620px) {
          .tvpanel {
            flex-direction: column;
            align-items: stretch;
          }
          .tvpanel h2 {
            display: flex;
          }
          .tvbody {
            display: grid;
            grid-template-columns: 168px minmax(0, 1fr);
            align-items: center;
            gap: var(--hax-ui-gap-md);
          }
          .tvbody[hidden] {
            display: none;
          }
          .tv-side {
            display: contents;
          }
          .tv-controls {
            grid-column: 2;
          }
          .tvbody .now {
            grid-column: 1 / -1;
          }
          retro-vcr,
          .kit {
            display: none;
          }
          .ph-top {
            flex-wrap: wrap;
          }
          .inst {
            margin-left: 0;
            width: 100%;
          }
          .inst .segs {
            flex: 1;
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
          .bnr b {
            font-size: 10px;
          }
          .bnr .bsub {
            font-size: 9px;
          }
          .bnr .bsegs {
            grid-template-columns: repeat(4, 8px);
          }
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener("keydown", this.__onKeydown);
    // the viewer's TV choices: minimized (phones start minimized) and colorway
    try {
      const min = globalThis.localStorage.getItem(TV_MIN_KEY);
      this._tvMin =
        min === null
          ? !!(
              globalThis.matchMedia &&
              globalThis.matchMedia("(max-width: 620px)").matches
            )
          : min === "1";
      const kit = globalThis.localStorage.getItem(KIT_KEY);
      if (KITS.includes(kit)) {
        this._kit = kit;
      }
    } catch {
      // storage can be missing or blocked; the defaults stand
    }
  }

  disconnectedCallback() {
    globalThis.removeEventListener("keydown", this.__onKeydown);
    clearTimeout(this.__tvTimer);
    clearTimeout(this.__ejectTimer);
    super.disconnectedCallback();
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.fetchState();
    // HAX TV after the first paint, when the browser has a moment
    const later =
      globalThis.requestIdleCallback || ((fn) => globalThis.setTimeout(fn, 1));
    this.haxTvReady = new Promise((resolve) => {
      later(() => {
        loadHaxTv().then(
          () => {
            this._haxTvLoaded = true;
            resolve(true);
          },
          () => resolve(false),
        );
      });
    });
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    // after a step changes, move focus to its heading so keyboard and screen
    // reader users start at the top of the new step
    if (this.__focusHeading && !this.loading) {
      this.__focusHeading = false;
      const heading = this.shadowRoot.querySelector("#step-title");
      if (heading) {
        heading.focus();
      }
    }
  }

  /**
   * Show a loading screen on HAX TV while a request runs.
   * @param {String} kind - key of TV (language, prepare, continue, install)
   */
  _tvStart(kind) {
    clearTimeout(this.__tvTimer);
    if (!this._tvBusy) {
      this.__tvReturn =
        this._tvChannel === TV.credits ? TV.idle : this._tvChannel;
    }
    this._tvBusy = kind;
    this.__tvStarted = Date.now();
    this._tvChannel = TV[kind] || TV.idle;
  }

  /**
   * The request is done: after the loading screen has had its moment, go
   * back to the channel the viewer was watching (or roll the credits).
   */
  _tvDone() {
    const wait = Math.max(0, TV_MIN_MS - (Date.now() - this.__tvStarted));
    clearTimeout(this.__tvTimer);
    this.__tvTimer = setTimeout(() => {
      this._tvBusy = "";
      this._tvChannel = this._celebrate ? TV.credits : this.__tvReturn;
    }, wait);
  }

  _onTvChannel(e) {
    if (e.detail && typeof e.detail.channel === "number") {
      this._tvChannel = e.detail.channel;
      if (e.detail.channel !== TV_GAME) {
        this.__lastShow = e.detail.channel;
      }
    }
  }

  /** the set, once HAX TV has loaded (null before that) */
  _tv() {
    if (!this._haxTvLoaded || !this.shadowRoot) {
      return null;
    }
    return this.shadowRoot.querySelector("retro-tv");
  }

  /** a controller button: wakes the set, puts the cartridge on, then plays */
  _onPad(e) {
    const tv = this._tv();
    const blocks = this.shadowRoot.querySelector("retro-tv-blocks");
    if (!tv || !blocks) {
      return;
    }
    if (!tv.power) {
      tv.togglePower();
    }
    if (tv.channel !== TV_GAME) {
      tv.tune(TV_GAME);
      return;
    }
    blocks.press(e.detail.button);
  }

  _onConsolePower(e) {
    const tv = this._tv();
    if (!tv) {
      return;
    }
    if (!tv.power) {
      tv.togglePower();
    }
    tv.tune(e.detail.power ? TV_GAME : this.__lastShow);
  }

  _onConsoleReset() {
    const tv = this._tv();
    const blocks = this.shadowRoot.querySelector("retro-tv-blocks");
    if (blocks) {
      blocks.reset();
    }
    if (tv) {
      if (!tv.power) {
        tv.togglePower();
      }
      tv.tune(TV_GAME);
    }
  }

  /** the VCR's keys: Rew and FF change channel, Play starts it over */
  _onVcrKey(e) {
    const tv = this._tv();
    if (!tv) {
      return;
    }
    const key = e.detail.key;
    if (key === "rew") {
      tv.previous();
    } else if (key === "ff") {
      tv.next();
    } else if (key === "play") {
      if (!tv.power) {
        tv.togglePower();
      }
      tv.replay();
    } else if (key === "eject") {
      const vcr = this.shadowRoot.querySelector("retro-vcr");
      vcr.phase = "lift";
      clearTimeout(this.__ejectTimer);
      this.__ejectTimer = setTimeout(() => {
        vcr.phase = this._tvPower ? "playing" : "idle";
      }, 1200);
    }
  }

  _setMin(min) {
    this._tvMin = min;
    try {
      globalThis.localStorage.setItem(TV_MIN_KEY, min ? "1" : "0");
    } catch {
      // storage can be missing or blocked
    }
  }

  _setKit(kit) {
    this._kit = kit;
    try {
      globalThis.localStorage.setItem(KIT_KEY, kit);
    } catch {
      // storage can be missing or blocked
    }
  }

  _onTvPower(e) {
    this._tvPower = !!(e.detail && e.detail.power);
  }

  _tvStep(dir) {
    const tv = this._tv();
    if (tv) {
      if (dir > 0) {
        tv.next();
      } else {
        tv.previous();
      }
    }
  }

  _tvTogglePower() {
    const tv = this._tv();
    if (tv) {
      tv.togglePower();
    }
  }

  /**
   * Keyboard shortcuts: Alt+Left goes back, Ctrl+Shift+1-3 returns to a
   * finished step, Ctrl+Shift+Up/Down changes channel, Ctrl+Shift+/ lists
   * them, Esc closes the list. Enter submits the step's form on its own.
   * @param {KeyboardEvent} e
   */
  _onKeydown(e) {
    // arrows, A and B light the controller (and play HAX Blocks): arrows only
    // at the TV, so they still scroll the page elsewhere; A and B anywhere
    // while the game is on. Never while typing or choosing.
    const pad =
      this.shadowRoot && this.shadowRoot.querySelector("retro-controller");
    const k = retroKitKey(e);
    if (k && pad && this._haxTvLoaded && !this._tvMin && !retroKitInField(e)) {
      const path = e.composedPath();
      const panel = this.shadowRoot.querySelector(".tvpanel");
      const tv = this._tv();
      const playing = tv && tv.power && tv.channel === TV_GAME;
      if (!path.includes(pad)) {
        const near = path.includes(panel);
        if (k === "a" || k === "b" ? near || playing : near) {
          e.preventDefault();
          pad.press(k);
          return;
        }
      }
    }
    if (e.key === "Escape" && this._shortcutsOpen) {
      this._toggleShortcuts();
      return;
    }
    if (e.altKey && !e.ctrlKey && e.key === "ArrowLeft") {
      if (this.step > 1 && this.step < 4) {
        e.preventDefault();
        this._goToStep(this.step - 1);
      }
      return;
    }
    if (!e.ctrlKey || !e.shiftKey) {
      return;
    }
    const digit = { Digit1: 1, Digit2: 2, Digit3: 3 }[e.code];
    if (digit && digit < this.step && this.step !== 4) {
      e.preventDefault();
      this._goToStep(digit);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      this._tvStep(1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      this._tvStep(-1);
    } else if (e.code === "Slash") {
      e.preventDefault();
      this._toggleShortcuts();
    }
  }

  _toggleShortcuts() {
    this._shortcutsOpen = !this._shortcutsOpen;
    if (!this._shortcutsOpen) {
      const btn = this.shadowRoot.querySelector("#shortcuts-button");
      if (btn) {
        btn.focus();
      }
    }
  }

  /**
   * GET ?op=state - fetch current installation state from the server.
   */
  async fetchState() {
    this.loading = true;
    this.error = "";
    // Re-check clears any prior permission notice; if permissions are still
    // wrong, ?op=prepare will re-surface it when clicked again.
    this._preparePermissionCommand = "";
    this._preparePermissionHint = "";
    try {
      const url = this.apiEndpoint + "?op=state";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      const data = await response.json();
      this._applyState(data);
    } catch (e) {
      this.error = e.message || String(e);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Re-check requirements: the same state read, with the PC on HAX TV.
   */
  async _recheck() {
    this._tvStart("prepare");
    await this.fetchState();
    this._tvDone();
  }

  /**
   * POST ?op=advance - validate, persist state, run side effects, advance step.
   * @param {Object} body - { toStep, language, username, password }
   */
  async advanceStep(body) {
    this.loading = true;
    this.error = "";
    try {
      const url = this.apiEndpoint + "?op=advance";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      const data = await response.json();
      this._applyState(data);
      return data;
    } catch (e) {
      this.error = e.message || String(e);
      return null;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Apply state data from server response to element properties.
   * @param {Object} data - state JSON from ?op=state or ?op=advance
   */
  _applyState(data) {
    if (!data) return;
    const prevStep = this.step;
    const prevLang = this.language;
    if (typeof data.step === "number") {
      this.step = data.step;
    }
    if (typeof data.language === "string") {
      this.language = data.language;
      this._selectedLanguage = data.language;
      // Issue #2974: when the language changes, tell the i18n-manager to
      // load the locale so the UI re-renders in the new language. Without
      // this, the wizard advances to the next step still showing English.
      if (prevLang !== data.language) {
        this._dispatchLanguageChange(data.language);
      }
    }
    if (typeof data.username === "string") {
      this._usernameInput = data.username;
    }
    this.stateData = data;
    if (this.step !== prevStep) {
      this.__focusHeading = true;
    }
    // a successful install (into step 4 with credentials) rolls the credits
    // on HAX TV
    if (
      this.step === 4 &&
      prevStep !== 4 &&
      data.credentials &&
      !data.hasErrors
    ) {
      this._celebrate = true;
      this._tvChannel = TV.credits;
      this.requestUpdate();
    }
  }

  /**
   * Toggle whether the generated password is shown in plaintext on step 4.
   * Password is masked by default; click to reveal one last time before
   * heading to the login screen.
   */
  _togglePasswordReveal() {
    this._passwordRevealed = !this._passwordRevealed;
    this.requestUpdate();
  }

  /**
   * Dispatch languagechange event so i18n-manager loads the locale.
   * @param {String} lang - language code
   */
  _dispatchLanguageChange(lang) {
    if (globalThis.document && globalThis.document.documentElement) {
      globalThis.document.documentElement.lang = lang;
    }
    globalThis.dispatchEvent(
      new CustomEvent("languagechange", {
        detail: lang,
      }),
    );
    // Safety net: the i18n-manager loads the locale file asynchronously
    // after the languagechange event. It calls requestUpdate() when done,
    // but timing issues can cause the re-render to be missed. Schedule a
    // delayed requestUpdate() so the translations are reflected even if
    // the i18n-manager's callback fires at an awkward time.
    setTimeout(() => {
      this.requestUpdate();
    }, 300);
  }

  /**
   * Copy text to clipboard and show copied feedback.
   * @param {String} text - text to copy
   * @param {String} field - field name for feedback
   */
  async _copyToClipboard(text, field) {
    try {
      if (globalThis.navigator && globalThis.navigator.clipboard) {
        await globalThis.navigator.clipboard.writeText(text);
      }
    } catch {
      // fallback - ignore
    }
    this._copiedField = field;
    this.requestUpdate();
    setTimeout(() => {
      this._copiedField = "";
      this.requestUpdate();
    }, 2000);
  }

  /**
   * Go back to a prior step. The backend ?op=advance accepts toStep 1-4,
   * and advancing to a lower step re-evaluates the environment (e.g.
   * re-running precondition checks on step 2). Step 4 (success) is never
   * a valid back-target because the install has already executed.
   * @param {Number} targetStep - step to return to (1-3)
   */
  async _goToStep(targetStep) {
    if (this.loading) {
      return;
    }
    const target = parseInt(targetStep, 10);
    if (isNaN(target) || target < 1 || target > 3 || target >= this.step) {
      return;
    }
    await this.advanceStep({
      toStep: target,
      language: this.language,
      username: this._usernameInput,
    });
  }

  /**
   * Handle step 1 submit - save language and advance to step 2.
   */
  async _handleStep1Submit() {
    const lang = this._selectedLanguage || this.language || "en";
    this._tvStart("language");
    await this.advanceStep({
      toStep: 2,
      language: lang,
    });
    this._tvDone();
    // _applyState (called inside advanceStep) now dispatches the
    // language change when the language differs from the previous one.
  }

  /**
   * Handle step 2 continue - advance to step 3.
   */
  async _handleStep2Continue() {
    this._tvStart("continue");
    await this.advanceStep({
      toStep: 3,
      language: this.language,
    });
    this._tvDone();
  }

  /**
   * POST ?op=prepare - ask the server to auto-create missing runtime
   * directories (no credentials), then re-render the step 2 checks.
   * This is the "run the script that automatically creates the required
   * missing files" resolution path for directory precondition errors.
   */
  async _prepareEnvironment() {
    this.loading = true;
    this.error = "";
    this._preparePermissionCommand = "";
    this._preparePermissionHint = "";
    this._tvStart("prepare");
    try {
      const url = this.apiEndpoint + "?op=prepare";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      const data = await response.json();
      this._applyState(data);
      // Issue #2974: if the server could not auto-create the _config tree
      // / boilerplate due to permissions, it returns a single SSH command
      // to run as the file owner. Surface it so the user has one call to
      // fix everything instead of toggling 777.
      if (data && data.permissionCommand) {
        this._preparePermissionCommand = data.permissionCommand;
        this._preparePermissionHint = data.permissionHint || "";
      }
      return data;
    } catch (e) {
      this.error = e.message || String(e);
      return null;
    } finally {
      this.loading = false;
      this._tvDone();
    }
  }

  /**
   * Handle step 3 submit - save credentials and run install (advance to step 4).
   */
  async _handleStep3Submit() {
    // Issue #2974: when the user supplies a password, require it to be
    // confirmed (typed twice) and matching before running the install.
    if (
      this._passwordInput !== "" &&
      (this._confirmPasswordInput === "" ||
        this._confirmPasswordInput !== this._passwordInput)
    ) {
      this._passwordMismatch = true;
      this.error = this.t.passwordsDoNotMatch;
      this.requestUpdate();
      return;
    }
    this.error = "";
    this._tvStart("install");
    const data = await this.advanceStep({
      toStep: 4,
      language: this.language,
      username: this._usernameInput,
      password: this._passwordInput,
    });
    this._tvDone();
    // The backend rejects a password that fails the minimum policy
    // (8+ chars, uppercase + lowercase + number + symbol) by keeping the
    // wizard on step 3 with hasErrors + errors. The disabled submit gate
    // above normally prevents this, but surface any server errors inline
    // as defense-in-depth (e.g. direct-install token path).
    if (
      data &&
      data.hasErrors &&
      Array.isArray(data.errors) &&
      data.errors.length
    ) {
      this._serverErrors = data.errors;
    } else {
      this._serverErrors = [];
    }
    this.requestUpdate();
  }

  /**
   * The step's form was submitted (button or Enter): run its main action.
   * @param {Event} e
   */
  _onSubmit(e) {
    e.preventDefault();
    if (this.loading) {
      return;
    }
    if (this.step === 1) {
      this._handleStep1Submit();
    } else if (this.step === 2) {
      if (this.stateData && this.stateData.hasErrors) {
        this._prepareEnvironment();
      } else {
        this._handleStep2Continue();
      }
    } else if (this.step === 3) {
      if (this._step3CanSubmit()) {
        this._handleStep3Submit();
      } else {
        // send people to the field that still needs work
        const c = this._computePasswordCriteria(this._passwordInput);
        const ok =
          c.length && c.uppercase && c.lowercase && c.number && c.symbol;
        const field = this.shadowRoot.querySelector(
          ok ? "#confirm-password-input" : "#password-input",
        );
        if (field) {
          field.focus();
        }
      }
    }
  }

  /**
   * Handle language picker change (value is the canonical registry code).
   * @param {Event} e - value-changed event from haxcms-language-picker
   */
  _handleLanguageChange(e) {
    const target = e.target;
    this._selectedLanguage = target.value;
    this.requestUpdate();
  }

  /**
   * Handle username input change.
   * @param {Event} e - input event
   */
  _handleUsernameChange(e) {
    const target = e.target;
    this._usernameInput = target.value;
    this._serverErrors = [];
  }

  /**
   * Handle password input change.
   * @param {Event} e - input event
   */
  _handlePasswordChange(e) {
    const target = e.target;
    this._passwordInput = target.value;
    this._serverErrors = [];
    // Recompute mismatch state as the user types the primary password.
    if (this._confirmPasswordInput !== "") {
      this._passwordMismatch = this._confirmPasswordInput !== target.value;
    } else {
      this._passwordMismatch = false;
    }
    // _passwordInput is internal state (not a reactive property), so the
    // criteria checklist, strength meter, and submit-disabled state won't
    // re-render on their own. Drive an update explicitly.
    this.requestUpdate();
  }

  /**
   * Handle confirm password input change.
   * @param {Event} e - input event
   */
  _handleConfirmPasswordChange(e) {
    const target = e.target;
    this._confirmPasswordInput = target.value;
    this._serverErrors = [];
    this._passwordMismatch =
      target.value !== "" && target.value !== this._passwordInput;
    // Drive an update so the match indicator and submit-disabled state
    // re-render as the user types the confirmation.
    this.requestUpdate();
  }

  /**
   * Compute per-criterion booleans for the password checklist. Mirrors the
   * backend haxcmsInstallerPasswordMeetsPolicy so the front-end only enables
   * submit when the backend will accept the password.
   * @param {String} password
   * @returns {Object} { length, uppercase, lowercase, number, symbol }
   */
  _computePasswordCriteria(password) {
    const pwd = password || "";
    return {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      symbol: /[^a-zA-Z0-9]/.test(pwd),
    };
  }

  /**
   * Whether all password criteria are met AND the confirmation matches.
   * Used to gate the "Save and install" button on step 3 so the wizard
   * never submits a password the backend would reject.
   * @returns {Boolean}
   */
  _step3CanSubmit() {
    const c = this._computePasswordCriteria(this._passwordInput);
    const criteriaMet =
      c.length && c.uppercase && c.lowercase && c.number && c.symbol;
    const confirmed =
      this._confirmPasswordInput !== "" &&
      this._confirmPasswordInput === this._passwordInput;
    return !!(criteriaMet && confirmed);
  }

  /**
   * Compute an interactive password strength score (0-4) and a label key.
   * Aligned to the policy: 0 = empty, 1 = weak (missing criteria),
   * 2 = fair (meets all criteria, 8+), 3 = good (12+), 4 = strong (16+).
   * @param {String} password
   * @returns {Object} { score: 0|1|2|3|4, labelKey: string }
   */
  _computePasswordStrength(password) {
    if (!password || password === "") {
      return { score: 0, labelKey: "" };
    }
    const c = this._computePasswordCriteria(password);
    const allMet =
      c.length && c.uppercase && c.lowercase && c.number && c.symbol;
    if (!allMet) {
      return { score: 1, labelKey: "weak" };
    }
    let score = 2;
    let labelKey = "fair";
    if (password.length >= 16) {
      score = 4;
      labelKey = "strong";
    } else if (password.length >= 12) {
      score = 3;
      labelKey = "good";
    }
    return { score, labelKey };
  }

  /**
   * Fill {name} placeholders in a translated string.
   * @param {String} text
   * @param {Object} values
   */
  _format(text, values) {
    return String(text || "").replace(/\{(\w+)\}/g, (m, key) =>
      Object.prototype.hasOwnProperty.call(values, key) ? values[key] : m,
    );
  }

  /**
   * Before sign-in, show paths relative to the HAXcms folder
   * ("_config/", not the server's full path).
   * @param {String} text
   */
  _relativePaths(text) {
    // a linear scan, word by word: an absolute path that reaches one of the
    // HAXcms runtime folders keeps only the part from that folder on
    const folders = ["/_config", "/_sites", "/_published", "/_archived"];
    return String(text || "")
      .split(" ")
      .map((word) => {
        const lead = word.charAt(0) === "'" || word.charAt(0) === '"' ? 1 : 0;
        if (word.charAt(lead) !== "/") {
          return word;
        }
        let cut = -1;
        folders.forEach((folder) => {
          const at = word.indexOf(folder + "/", lead);
          const end = word.indexOf(folder, lead);
          const hit =
            at !== -1
              ? at
              : end !== -1 &&
                  [undefined, "'", '"', ")"].indexOf(
                    word.charAt(end + folder.length) || undefined,
                  ) !== -1
                ? end
                : -1;
          if (hit !== -1 && (cut === -1 || hit < cut)) {
            cut = hit;
          }
        });
        return cut === -1 ? word : word.slice(0, lead) + word.slice(cut + 1);
      })
      .join(" ");
  }

  /**
   * Requirement rows to show: the HAXcms version row is not shown before
   * sign-in (system admin shows it).
   * @param {Array} rows
   */
  _visibleRows(rows) {
    return (rows || []).filter((row) => row && row.key !== "haxcms-version");
  }

  _steps() {
    return [
      {
        num: 1,
        label: this.t.chooseLanguage,
        desc: this.t.selectLanguageDescription,
      },
      {
        num: 2,
        label: this.t.verifyRequirements,
        desc: this.t.verifyRequirementsDescription,
      },
      {
        num: 3,
        label: this.t.configureSystem,
        desc: this.t.configureSystemDescription,
      },
      { num: 4, label: this.t.startHaxcms, desc: this.t.installationComplete },
    ];
  }

  /**
   * What the action bar's status says, and its tone.
   * @returns {Object} { text, tone }
   */
  _status() {
    if (this.loading) {
      return { text: this.t.loading, tone: "busy" };
    }
    if (this.error) {
      return { text: this.t.anErrorOccurred, tone: "err" };
    }
    if (this._copiedField) {
      return { text: this.t.copied, tone: "ok" };
    }
    if (this.step === 1) {
      return {
        text: this._format(this.t.stepCount, { current: 1, total: 4 }),
        tone: "",
      };
    }
    if (this.step === 2) {
      const needs = this._visibleRows(
        this.stateData && this.stateData.needsConfiguration,
      );
      if (this.stateData && this.stateData.hasErrors) {
        return {
          text: `${this.t.requirementsNeedingConfiguration}: ${needs.length}`,
          tone: "err",
        };
      }
      return { text: this.t.allRequirementsMet, tone: "ok" };
    }
    if (this.step === 3) {
      if (this._step3CanSubmit()) {
        return { text: this.t.readyToInstall, tone: "ok" };
      }
      const c = this._computePasswordCriteria(this._passwordInput);
      const met = Object.keys(c).filter((k) => c[k]).length;
      let text = `${this.t.passwordRequirements}: ${this._format(
        this.t.metCount,
        { met, total: 5 },
      )}`;
      if (this._passwordMismatch) {
        text += ` · ${this.t.passwordsDoNotMatch}`;
      }
      return { text, tone: "" };
    }
    return { text: this.t.installationComplete, tone: "ok" };
  }

  _languageLabel() {
    const picker =
      this.shadowRoot && this.shadowRoot.querySelector("#lang-select");
    const option =
      picker && picker._listedOptions
        ? picker._listedOptions.find(
            (o) => o.value === (this._selectedLanguage || this.language),
          )
        : null;
    return option ? option.label : this._selectedLanguage || this.language;
  }

  render() {
    const steps = this._steps();
    const current = steps[this.step - 1] || steps[0];
    const status = this._status();
    return html`
      <div class="frame">
        <header class="hax-ui-dialog-titlebar">
          <img
            src="${new URL("./lib/hax.png", import.meta.url).href}"
            alt="${this.t.haxcmsMascotAlt}"
            class="installer-logo"
          />
          <h1 class="hax-ui-dialog-title crumb">
            <span class="installer-name">${this.t.haxcmsInstaller}</span>
            <span class="sep" aria-hidden="true">›</span>
            <span class="now">${current.label}</span>
          </h1>
          <div class="tb-tools">
            <span class="lang-chip">${this._languageLabel()}</span>
            <!-- the HAX mark: decorative, it says you are in HAX -->
            <span class="ft-mark" aria-hidden="true">
              <simple-icon-lite
                icon="hax:world-traveler"
                no-colorize
              ></simple-icon-lite>
            </span>
          </div>
        </header>
        ${this._shortcutsOpen ? this.renderShortcuts() : ""}
        <div class="body">
          <nav class="rail" aria-label="${this.t.installationSteps}">
            ${this.renderStepIndicator()}
            <div class="rail-acts">${this.renderActions(true)}</div>
            ${this.renderHelpFooter()}
          </nav>
          <section class="main" aria-labelledby="step-title">
            <div class="ph">
              <div class="ph-top">
                <h2 id="step-title" tabindex="-1">${current.label}</h2>
                ${this.renderInstallMeter()}
              </div>
              <p>${current.desc}</p>
            </div>
            <form
              class="content"
              id="step-form"
              novalidate
              @submit="${this._onSubmit}"
            >
              ${
                this.error
                  ? this.renderError()
                  : this.loading && !this.stateData.step
                    ? this.renderLoading()
                    : html`${this.renderStepContent()} ${this.renderTips()}`
              }
            </form>
          </section>
          ${this.renderTv()}
        </div>
        <footer class="ftr">
          <div class="st" role="status" aria-live="polite">
            <span class="dot ${status.tone}"></span>
            <span class="st-text ${this.loading ? "loading-overlay" : ""}"
              >${status.text}</span
            >
          </div>
          <div class="acts">${this.renderActions()}</div>
        </footer>
      </div>
    `;
  }

  renderShortcuts() {
    return html`
      <div
        class="shortcuts"
        id="shortcuts"
        role="dialog"
        aria-label="${this.t.keyboardShortcuts}"
      >
        <div class="shortcuts-head">
          <h2>${this.t.keyboardShortcuts}</h2>
          <button
            class="hax-ui-icon-btn"
            type="button"
            aria-label="${this.t.close}"
            title="${this.t.close}"
            @click="${this._toggleShortcuts}"
          >
            <simple-icon-lite
              icon="${HaxUiAdminIcons.close}"
            ></simple-icon-lite>
          </button>
        </div>
        <dl>
          <dt><span class="hax-ui-kbd">Enter</span></dt>
          <dd>${this.t.shortcutMainAction}</dd>
          <dt>
            <span class="hax-ui-kbd">Alt</span>
            <span class="hax-ui-kbd">←</span>
          </dt>
          <dd>${this.t.back}</dd>
          <dt>
            <span class="hax-ui-kbd">Ctrl</span>
            <span class="hax-ui-kbd">⇧</span>
            <span class="hax-ui-kbd">1</span>–<span class="hax-ui-kbd">3</span>
          </dt>
          <dd>${this.t.shortcutFinishedStep}</dd>
          <dt>
            <span class="hax-ui-kbd">Ctrl</span>
            <span class="hax-ui-kbd">⇧</span>
            <span class="hax-ui-kbd">↑</span>
            <span class="hax-ui-kbd">↓</span>
          </dt>
          <dd>${this.t.shortcutChannel}</dd>
          <dt>
            <span class="hax-ui-kbd">Ctrl</span>
            <span class="hax-ui-kbd">⇧</span>
            <span class="hax-ui-kbd">/</span>
          </dt>
          <dd>${this.t.shortcutList}</dd>
          <dt><span class="hax-ui-kbd">Esc</span></dt>
          <dd>${this.t.shortcutClose}</dd>
        </dl>
      </div>
    `;
  }

  /** "Installing HAXcms" and four segments, in the page header on every step */
  renderInstallMeter() {
    const done = this.step === 4;
    return html`<div class="inst">
      <span class="inst-lbl"
        >${done ? this.t.haxcmsInstalled : this.t.installingHaxcms}</span
      >
      <span class="segs" aria-hidden="true">
        ${[1, 2, 3, 4].map(
          (n) =>
            html`<i
              class="${n < this.step || done ? "done" : n === this.step ? "now" : ""}"
            ></i>`,
        )}
      </span>
      <span class="inst-n"
        >${this._format(this.t.stepCount, { current: this.step, total: 4 })}</span
      >
    </div>`;
  }

  /** Tips: stacked stop-notes, opening on the one that fits the step */
  renderTips() {
    const chips = (list) =>
      html`<ul class="chips">
        ${list.map((x) => html`<li>${x}</li>`)}
      </ul>`;
    return html`<stop-note-group
      class="tips"
      label="${this.t.tips}"
      active="${TIP_START[this.step] || 0}"
    >
      <stop-note status="tip" title="${this.t.tipDifferenceTitle}">
        <div slot="message">
          <p>${this.t.tipDifference}</p>
          ${chips([
            this.t.pillarAccessible,
            this.t.pillarEfficient,
            this.t.pillarExtensible,
            this.t.pillarOpen,
            this.t.pillarAgnostic,
            this.t.pillarRemixable,
            this.t.pillarSustainable,
          ])}
        </div>
      </stop-note>
      <stop-note status="tip" title="${this.t.tipFilesTitle}">
        <div slot="message">
          <p>${this.t.tipFiles}</p>
          ${chips(["Word", "PDF", "PowerPoint", "Excel", this.t.htmlFile])}
        </div>
      </stop-note>
      <stop-note status="tip" title="${this.t.tipSitesTitle}">
        <div slot="message">
          <p>${this.t.tipSites}</p>
          ${chips([
            this.t.anyWebPage,
            "WordPress",
            "Drupal",
            "Plone",
            "Pressbooks",
            "HAXcms",
          ])}
        </div>
      </stop-note>
      <stop-note status="tip" title="${this.t.tipBooksTitle}">
        <div slot="message">
          <p>${this.t.tipBooks}</p>
          ${chips(["OpenStax", "GitBook", "Notion", "VitePress", "Quarto"])}
        </div>
      </stop-note>
      <stop-note status="warning" title="${this.t.tipPasswordTitle}">
        <p slot="message">${this.t.tipPassword}</p>
      </stop-note>
    </stop-note-group>`;
  }

  renderTv() {
    const credits = this._tvChannel === TV.credits;
    const now = new Date();
    const tape = `001 · ${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const program =
      this.shadowRoot &&
      this.shadowRoot.querySelector(
        `retro-tv > [channel="${this._tvChannel}"]`,
      );
    const what = this.t[`banner${this.step}`] || "";
    const kits = {
      helmet: this.t.colorHelmet,
      goggle: this.t.colorGoggle,
      bulb: this.t.colorBulb,
    };
    return html`
      <aside
        class="tvpanel ${this._tvMin ? "min" : ""}"
        aria-labelledby="tv-title"
      >
        <h2 id="tv-title">
          <simple-icon-lite
            icon="${HaxUiAdminIcons.preview}"
          ></simple-icon-lite>
          ${this.t.haxTv}
          <button
            type="button"
            class="hax-ui-btn ghost tvmin"
            aria-expanded="${this._tvMin ? "false" : "true"}"
            aria-controls="tvbody"
            @click="${() => this._setMin(!this._tvMin)}"
          >
            ${this._tvMin ? this.t.showTv : this.t.minimize}
          </button>
        </h2>
        ${
          this._tvMin
            ? html`<p class="tvmini">
                <span class="dotlive" aria-hidden="true"></span>
                <b>${this.t.haxTv}</b>
                <span
                  >${this.t.channel} ${String(this._tvChannel).padStart(2, "0")}
                  ·
                  ${
                    this.step === 4
                      ? this.t.installed
                      : this._format(this.t.stepCount, {
                          current: this.step,
                          total: 4,
                        })
                  }</span
                >
              </p>`
            : ""
        }
        <div class="tvbody" id="tvbody" ?hidden="${this._tvMin}">
          <retro-vcr
            colorway="${this._kit}"
            phase="${this._tvPower ? "playing" : "idle"}"
            tape-label="HAXcms"
            label="${this.t.vcr}"
            lid-label="${this.t.topLoad}"
            eject-label="${this.t.eject}"
            rew-label="${this.t.rew}"
            play-label="${this.t.play}"
            ff-label="${this.t.ff}"
            rew-hint="${this.t.previousChannelHint}"
            play-hint="${this.t.replayChannel}"
            ff-hint="${this.t.nextChannelHint}"
            @retro-vcr-key="${this._onVcrKey}"
          ></retro-vcr>
          <retro-tv
            channel="${this._tvChannel}"
            controls
            osd-fade
            remember-power="hax-app-installer-tv"
            channel-prefix="${this.t.channel}"
            next-channel-label="${this.t.nextChannel}"
            power-on-label="${this.t.turnTvOn}"
            power-off-label="${this.t.turnTvOff}"
            off-label="${this.t.tvIsOff}"
            @retro-tv-channel-changed="${this._onTvChannel}"
            @retro-tv-power-changed="${this._onTvPower}"
          >
            <div class="bnr" slot="overlay" aria-hidden="true">
              <b
                >${
                  this.step === 4
                    ? `${this.t.haxcmsInstalled.toUpperCase()} ✓`
                    : this.t.installingHaxcms.toUpperCase()
                }</b
              >
              <span class="bsegs">
                ${[1, 2, 3, 4].map(
                  (n) =>
                    html`<i
                      class="${
                        n < this.step || this.step === 4
                          ? "done"
                          : n === this.step
                            ? "now"
                            : ""
                      }"
                    ></i>`,
                )}
              </span>
              <span class="bsub"
                >${
                  this._tvBusy
                    ? this.t.bannerWorking
                    : this._format(this.t.bannerStep, {
                        current: this.step,
                        what,
                      })
                }</span
              >
            </div>
            <retro-tv-sign-on channel="1"></retro-tv-sign-on>
            <retro-tv-blocks channel="${TV_GAME}"></retro-tv-blocks>
            <retro-tv-title-sequence
              channel="3"
              crawl-title="${this.t.haxcmsInstaller}"
              presenter="HAX"
              kicker="${this.t.startHaxcms}"
              runtime="2"
              runtime-label="${this.t.runningTime}"
              min-label="${this.t.min}"
              play-label="${this.t.play}"
              sequence-label="${this.t.titleSequenceFor}"
              presents-label="${this.t.presents}"
            ></retro-tv-title-sequence>
            <retro-tv-hax-tv channel="4"></retro-tv-hax-tv>
            <retro-tv-credits
              channel="5"
              tape="${credits ? tape : ""}"
            ></retro-tv-credits>
            <retro-tv-static channel="6"></retro-tv-static>
            <retro-tv-home-computer
              channel="7"
              what="${this._selectedLanguage || this.language}"
              ?loading="${this._tvBusy === "language"}"
            ></retro-tv-home-computer>
            <retro-tv-handheld channel="8"></retro-tv-handheld>
            <retro-tv-pc
              channel="9"
              message="${
                this.stateData && this.stateData.hasErrors
                  ? this.t.createMissingFiles
                  : this.t.recheckRequirements
              }"
              ?loading="${this._tvBusy === "prepare"}"
            ></retro-tv-pc>
            <retro-tv-disc channel="10"></retro-tv-disc>
          </retro-tv>
          <div class="kit">
            <div class="deckrow">
              <retro-console
                colorway="${this._kit}"
                ?power="${this._tvPower && this._tvChannel === TV_GAME}"
                label="${this.t.consoleLabel}"
                power-label="${this.t.consolePower}"
                reset-label="${this.t.consoleReset}"
                @retro-console-power="${this._onConsolePower}"
                @retro-console-reset="${this._onConsoleReset}"
              ></retro-console>
              <span
                class="kitpick"
                role="group"
                aria-label="${this.t.consoleColor}"
              >
                ${KITS.map(
                  (k) =>
                    html`<button
                      type="button"
                      aria-pressed="${this._kit === k ? "true" : "false"}"
                      aria-label="${kits[k]}"
                      title="${kits[k]}"
                      @click="${() => this._setKit(k)}"
                    >
                      <span class="sw sw-${k}"></span>
                    </button>`,
                )}
              </span>
            </div>
            <retro-controller
              colorway="${this._kit}"
              label="${this.t.gameController}"
              up-label="${this.t.padUp}"
              down-label="${this.t.padDown}"
              left-label="${this.t.padLeft}"
              right-label="${this.t.padRight}"
              select-label="${this.t.padSelect}"
              start-label="${this.t.padStart}"
              b-label="${this.t.padB}"
              a-label="${this.t.padA}"
              @retro-controller-press="${this._onPad}"
            ></retro-controller>
            <p class="padnote">${this.t.padNote}</p>
          </div>
          <div class="tv-side">
            <div class="tv-controls">
              <span class="chbtns" role="group" aria-label="${this.t.channel}">
                <button
                  type="button"
                  class="chb"
                  title="${this.t.previousChannel}"
                  @click="${() => this._tvStep(-1)}"
                >
                  <simple-icon-lite
                    icon="hardware:keyboard-arrow-down"
                  ></simple-icon-lite>
                  ${this.t.channel}<span class="hax-ui-sr-only"
                    >: ${this.t.previousChannel}</span
                  >
                </button>
                <button
                  type="button"
                  class="chb"
                  title="${this.t.nextChannel}"
                  @click="${() => this._tvStep(1)}"
                >
                  ${this.t.channel}<span class="hax-ui-sr-only"
                    >: ${this.t.nextChannel}</span
                  >
                  <simple-icon-lite
                    icon="hardware:keyboard-arrow-up"
                  ></simple-icon-lite>
                </button>
              </span>
              <button
                type="button"
                class="chb pw"
                aria-pressed="${this._tvPower ? "true" : "false"}"
                @click="${this._tvTogglePower}"
              >
                <i class="lamp" aria-hidden="true"></i>${this.t.tvPower}
              </button>
            </div>
            <p class="now">
              ${
                this._tvPower && program
                  ? html`${this.t.nowPlaying}
                      <b>${program.programName}</b>
                      ${this._tvBusy ? this.t.whileInstallerWorks : ""}`
                  : this.t.tvIsOff
              }
            </p>
            <p class="tv-credit">${this.t.tvArtCredit}</p>
          </div>
        </div>
      </aside>
    `;
  }

  renderHelpFooter() {
    const links = [
      {
        href: "https://haxtheweb.org",
        icon: HaxUiAdminIcons.docs,
        label: this.t.documentation,
      },
      {
        href: "https://github.com/haxtheweb/issues",
        icon: HaxUiAdminIcons.issues,
        label: this.t.reportIssues,
      },
      {
        href: "https://discord.gg/aCGxmRHEJP",
        icon: HaxUiAdminIcons.community,
        label: this.t.discord,
      },
      {
        href: "https://github.com/haxtheweb/haxcms-php",
        icon: HaxUiAdminIcons.cms,
        label: this.t.githubRepository,
      },
    ];
    return html`
      <div class="help-footer">
        <span class="help-footer-label">${this.t.needHelp}</span>
        <div class="help-footer-links">
          <button
            id="shortcuts-button"
            class="help-footer-link"
            type="button"
            title="${this.t.keyboardShortcuts}"
            aria-expanded="${this._shortcutsOpen ? "true" : "false"}"
            aria-controls="shortcuts"
            @click="${this._toggleShortcuts}"
          >
            <simple-icon-lite
              icon="${HaxUiAdminIcons.shortcuts}"
            ></simple-icon-lite>
            <span>${this.t.keyboardShortcuts}</span>
          </button>
          ${links.map(
            (link) => html`
              <a
                class="help-footer-link"
                href="${link.href}"
                target="_blank"
                rel="noopener noreferrer"
                title="${link.label}"
              >
                <simple-icon-lite icon="${link.icon}"></simple-icon-lite>
                <span>${link.label}</span>
                <simple-icon-lite
                  class="ext"
                  icon="${HaxUiAdminIcons.external}"
                ></simple-icon-lite>
              </a>
            `,
          )}
        </div>
      </div>
    `;
  }

  renderStepIndicator() {
    return html`
      <ol class="step-indicator">
        ${this._steps().map((s) => {
          let state = "pending";
          if (s.num < this.step) {
            state = "done";
          } else if (s.num === this.step) {
            state = "active";
          }
          // finished steps go back (until the install has run)
          const canGoBack =
            !this.loading && s.num < this.step && this.step !== 4 && s.num < 4;
          const inner = html`
            <span class="step-num">
              ${
                s.num < this.step
                  ? html`<simple-icon-lite
                      icon="${HaxUiAdminIcons.check}"
                    ></simple-icon-lite>`
                  : s.num
              }
            </span>
            <span class="step-label">${s.label}</span>
            ${
              canGoBack
                ? html`<span class="hax-ui-kbd" aria-hidden="true"
                    >⇧${s.num}</span
                  >`
                : ""
            }
          `;
          return html`
            <li class="step-${state} ${canGoBack ? "step-clickable" : ""}">
              ${
                canGoBack
                  ? html`<button
                      class="step-link"
                      type="button"
                      @click="${() => this._goToStep(s.num)}"
                      title="${this.t.back}: ${s.label}"
                      aria-label="${this.t.back}: ${s.label}"
                    >
                      ${inner}
                    </button>`
                  : html`<span
                      class="step-static"
                      title="${s.label}"
                      aria-current="${state === "active" ? "step" : "false"}"
                      >${inner}</span
                    >`
              }
            </li>
          `;
        })}
      </ol>
    `;
  }

  renderActions(rail) {
    const busy = this.loading;
    const kbd = rail
      ? ""
      : html`<span class="hax-ui-kbd" aria-hidden="true">Enter</span>`;
    const back = html`<button
      type="button"
      class="hax-ui-btn ghost"
      ?disabled="${busy}"
      @click="${() => this._goToStep(this.step - 1)}"
    >
      <simple-icon-lite icon="${HaxUiAdminIcons.back}"></simple-icon-lite>
      <span class="btn-label">${this.t.back}</span>
      ${rail ? "" : html`<span class="hax-ui-kbd" aria-hidden="true">Alt ←</span>`}
    </button>`;
    if (this.error) {
      return html`<button
        type="button"
        class="hax-ui-btn primary"
        @click="${() => this.fetchState()}"
      >
        <simple-icon-lite icon="${HaxUiAdminIcons.refresh}"></simple-icon-lite>
        ${this.t.retry}
      </button>`;
    }
    if (this.step === 1) {
      return html`<button
        type="submit"
        form="step-form"
        class="hax-ui-btn primary"
        ?disabled="${busy}"
      >
        ${this.t.saveAndContinue} ${kbd}
      </button>`;
    }
    if (this.step === 2) {
      const hasErrors = !!(this.stateData && this.stateData.hasErrors);
      return html`
        ${back}
        ${
          hasErrors
            ? html`<button
                  type="button"
                  class="hax-ui-btn"
                  ?disabled="${busy}"
                  @click="${this._recheck}"
                >
                  <simple-icon-lite
                    icon="${HaxUiAdminIcons.refresh}"
                  ></simple-icon-lite>
                  <span class="btn-label">${this.t.recheckRequirements}</span>
                </button>
                <button
                  type="submit"
                  form="step-form"
                  class="hax-ui-btn primary"
                  ?disabled="${busy}"
                >
                  <simple-icon-lite
                    icon="${HaxUiAdminIcons.add}"
                  ></simple-icon-lite>
                  ${this.t.createMissingFiles} ${kbd}
                </button>`
            : html`<button
                type="submit"
                form="step-form"
                class="hax-ui-btn primary"
                ?disabled="${busy}"
              >
                ${this.t.continue} ${kbd}
              </button>`
        }
      `;
    }
    if (this.step === 3) {
      const ready = this._step3CanSubmit();
      return html`
        ${back}
        <button
          type="submit"
          form="step-form"
          class="hax-ui-btn primary"
          ?disabled="${busy}"
          aria-disabled="${ready ? "false" : "true"}"
        >
          ${this.t.saveAndInstall} ${kbd}
        </button>
      `;
    }
    return html`<a class="hax-ui-btn primary start-hax-btn" href="index.php">
      <simple-icon-lite icon="hax:world-traveler-plain"></simple-icon-lite>
      ${this.t.startHaxcms}
    </a>`;
  }

  renderStepContent() {
    if (this.step === 1) return this.renderStep1();
    if (this.step === 2) return this.renderStep2();
    if (this.step === 3) return this.renderStep3();
    if (this.step === 4) return this.renderStep4();
    return this.renderStep1();
  }

  renderStep1() {
    return html`
      <div class="hax-ui-field-row">
        <div class="hax-ui-field-label">
          <label for="lang-select">${this.t.language}</label>
          <p>${this.t.languageHelp}</p>
        </div>
        <div class="hax-ui-field-control">
          <haxcms-language-picker
            id="lang-select"
            .label="${this.t.chooseLanguage}"
            label-hidden
            .value="${this._selectedLanguage}"
            popular-first
            @value-changed="${this._handleLanguageChange}"
          ></haxcms-language-picker>
        </div>
      </div>
    `;
  }

  renderStep2() {
    const needsConfig = this._visibleRows(
      this.stateData && this.stateData.needsConfiguration,
    );
    const allPassed = this._visibleRows(
      this.stateData && this.stateData.allPassed,
    );
    return html`
      ${
        this._preparePermissionCommand
          ? html`
              <div
                class="hax-ui-callout permission-banner"
                data-tone="info"
                role="alert"
              >
                <simple-icon-lite
                  icon="${HaxUiAdminIcons.lock}"
                ></simple-icon-lite>
                <div>
                  <strong>${this.t.permissionRequired}</strong>
                  ${
                    this._preparePermissionHint
                      ? html`<p class="permission-banner-hint">
                          ${this._preparePermissionHint}
                        </p>`
                      : ""
                  }
                  ${this.renderCommand(this._preparePermissionCommand)}
                </div>
              </div>
            `
          : ""
      }
      ${
        needsConfig.length === 0
          ? html`
              <div class="no-issues">
                <simple-icon-lite
                  icon="${HaxUiAdminIcons.check}"
                ></simple-icon-lite>
                <span>${this.t.allRequirementsMet}</span>
              </div>
            `
          : html`
              <div class="hax-ui-callout" data-tone="danger">
                <simple-icon-lite
                  icon="${HaxUiAdminIcons.error}"
                ></simple-icon-lite>
                <span
                  ><strong
                    >${this.t.requirementsNeedingConfiguration}:
                    ${needsConfig.length}</strong
                  ></span
                >
              </div>
              <h3 class="section-title">
                ${this.t.requirementsNeedingConfiguration}
              </h3>
              ${this.renderReqTable(needsConfig, true)}
            `
      }
      ${
        allPassed.length > 0
          ? html`
              <details class="req-details" ?open="${needsConfig.length === 0}">
                <summary>${this.t.passedChecks} (${allPassed.length})</summary>
                ${this.renderReqTable(allPassed, false)}
              </details>
            `
          : ""
      }
      <p class="hax-ui-note">
        <simple-icon-lite icon="${HaxUiAdminIcons.lock}"></simple-icon-lite>
        ${this.t.versionAfterSignIn}
      </p>
    `;
  }

  renderCommand(command) {
    return html`<div class="cmd">
      <pre class="cmd-block">${command}</pre>
      <button
        type="button"
        class="hax-ui-icon-btn"
        aria-label="${this.t.copy}: ${command}"
        title="${this.t.copy}"
        @click="${() => this._copyToClipboard(command, "command")}"
      >
        <simple-icon-lite icon="${HaxUiAdminIcons.copy}"></simple-icon-lite>
      </button>
    </div>`;
  }

  renderReqTable(rows, showCommand) {
    const icons = {
      error: HaxUiAdminIcons.error,
      warning: HaxUiAdminIcons.warning,
      ok: HaxUiAdminIcons.check,
    };
    const tones = { error: "danger", warning: "warning", ok: "success" };
    return html`
      <table class="req-table">
        <thead>
          <tr>
            <th scope="col" style="width: 30%">${this.t.requirement}</th>
            <th scope="col" style="width: 22%">${this.t.value}</th>
            <th scope="col">
              ${this.t.description}${
                showCommand ? html` · ${this.t.suggestedCommand}` : ""
              }
            </th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => {
            const tone = row.tone || row.severity || "ok";
            return html`
              <tr>
                <td class="req-title">${row.title}</td>
                <td>
                  <span
                    class="hax-ui-pill req-status status-${tone}"
                    data-tone="${tones[tone] || "muted"}"
                  >
                    <simple-icon-lite
                      icon="${icons[tone] || HaxUiAdminIcons.info}"
                    ></simple-icon-lite>
                    ${row.value}
                  </span>
                </td>
                <td>
                  <div class="req-desc">
                    ${this._relativePaths(row.description)}
                  </div>
                  ${
                    showCommand && row.suggestedCommand
                      ? this.renderCommand(
                          this._relativePaths(row.suggestedCommand),
                        )
                      : ""
                  }
                </td>
              </tr>
            `;
          })}
        </tbody>
      </table>
    `;
  }

  renderStep3() {
    const strength = this._computePasswordStrength(this._passwordInput);
    const criteria = this._computePasswordCriteria(this._passwordInput);
    const confirmed =
      this._confirmPasswordInput !== "" &&
      this._confirmPasswordInput === this._passwordInput;
    const criteriaItems = [
      { met: criteria.length, label: this.t.requirementLength },
      { met: criteria.uppercase, label: this.t.requirementUppercase },
      { met: criteria.lowercase, label: this.t.requirementLowercase },
      { met: criteria.number, label: this.t.requirementNumber },
      { met: criteria.symbol, label: this.t.requirementSymbol },
    ];
    const metCount = criteriaItems.filter((i) => i.met).length;
    return html`
      ${
        this._serverErrors && this._serverErrors.length
          ? html`
              <div
                class="hax-ui-callout server-error-banner"
                data-tone="danger"
                role="alert"
              >
                <simple-icon-lite
                  icon="${HaxUiAdminIcons.error}"
                ></simple-icon-lite>
                <ul>
                  ${this._serverErrors.map((msg) => html`<li>${msg}</li>`)}
                </ul>
              </div>
            `
          : ""
      }
      <div class="hax-ui-field-row">
        <div class="hax-ui-field-label">
          <label for="username-input">${this.t.adminUsername}</label>
          <p>${this.t.usernameHelp}</p>
        </div>
        <div class="hax-ui-field-control">
          <input
            id="username-input"
            class="hax-ui-input"
            type="text"
            .value="${this._usernameInput}"
            @input="${this._handleUsernameChange}"
            autocomplete="username"
          />
        </div>
      </div>
      <div class="hax-ui-field-row">
        <div class="hax-ui-field-label">
          <label for="password-input">${this.t.adminPassword}</label>
          <p>${this.t.passwordHelp}</p>
        </div>
        <div class="hax-ui-field-control">
          <div class="pw">
            <input
              id="password-input"
              class="hax-ui-input"
              type="${this._passwordRevealed ? "text" : "password"}"
              .value="${this._passwordInput}"
              @input="${this._handlePasswordChange}"
              autocomplete="new-password"
              aria-describedby="password-criteria strength-label"
            />
            <button
              type="button"
              class="hax-ui-icon-btn reveal-btn"
              aria-pressed="${this._passwordRevealed ? "true" : "false"}"
              aria-label="${this._passwordRevealed ? this.t.hide : this.t.show}"
              title="${this._passwordRevealed ? this.t.hide : this.t.show}"
              @click="${this._togglePasswordReveal}"
            >
              <simple-icon-lite
                icon="${
                  this._passwordRevealed
                    ? HaxUiAdminIcons.hide
                    : HaxUiAdminIcons.preview
                }"
              ></simple-icon-lite>
            </button>
          </div>
          ${
            strength.score > 0
              ? html`
                  <div
                    class="strength-meter strength-${strength.score}"
                    role="meter"
                    aria-valuemin="0"
                    aria-valuemax="4"
                    aria-valuenow="${strength.score}"
                    aria-valuetext="${this.t[strength.labelKey]}"
                    aria-label="${this.t.passwordStrength}"
                  >
                    <div class="strength-bars" aria-hidden="true">
                      ${[1, 2, 3, 4].map(
                        (i) =>
                          html`<span
                            class="${i <= strength.score ? "on" : ""}"
                          ></span>`,
                      )}
                    </div>
                    <span class="strength-label" id="strength-label"
                      >${this.t.passwordStrength}:
                      ${this.t[strength.labelKey]}</span
                    >
                  </div>
                `
              : ""
          }
          <ul
            class="password-criteria"
            id="password-criteria"
            aria-label="${this.t.passwordRequirements}: ${this._format(
              this.t.metCount,
              { met: metCount, total: 5 },
            )}"
          >
            ${criteriaItems.map(
              (item) => html`
                <li class="criteria-item ${item.met ? "met" : "unmet"}">
                  <simple-icon-lite
                    icon="${
                      item.met
                        ? HaxUiAdminIcons.check
                        : "icons:radio-button-unchecked"
                    }"
                  ></simple-icon-lite>
                  <span
                    >${item.label}<span class="hax-ui-sr-only">
                      (${item.met ? this.t.met : this.t.notYetMet})</span
                    ></span
                  >
                </li>
              `,
            )}
          </ul>
        </div>
      </div>
      <div class="hax-ui-field-row">
        <div class="hax-ui-field-label">
          <label for="confirm-password-input">${this.t.confirmPassword}</label>
        </div>
        <div class="hax-ui-field-control">
          <input
            id="confirm-password-input"
            class="hax-ui-input"
            type="${this._passwordRevealed ? "text" : "password"}"
            .value="${this._confirmPasswordInput}"
            @input="${this._handleConfirmPasswordChange}"
            autocomplete="new-password"
            aria-invalid="${
              this._confirmPasswordInput !== "" && !confirmed ? "true" : "false"
            }"
            aria-describedby="confirm-feedback"
          />
          <div id="confirm-feedback">
            ${
              this._confirmPasswordInput !== ""
                ? html`
                    <div
                      class="hax-ui-message confirm-feedback ${
                        confirmed ? "match" : "mismatch"
                      }"
                    >
                      <simple-icon-lite
                        icon="${
                          confirmed
                            ? HaxUiAdminIcons.check
                            : HaxUiAdminIcons.close
                        }"
                      ></simple-icon-lite>
                      ${
                        confirmed
                          ? this.t.passwordsMatch
                          : this.t.passwordsDoNotMatch
                      }
                    </div>
                  `
                : ""
            }
          </div>
        </div>
      </div>
    `;
  }

  renderStep4() {
    const creds = (this.stateData && this.stateData.credentials) || {};
    const username = creds.username || this._usernameInput || "admin";
    const password = creds.password || "";
    const passwordWasGenerated = !!creds.passwordWasGenerated;
    return html`
      <div
        class="hax-ui-callout important-banner"
        data-tone="warning"
        role="note"
      >
        <simple-icon-lite icon="${HaxUiAdminIcons.warning}"></simple-icon-lite>
        <span>${this.t.saveCredentialsWarning}</span>
      </div>
      <div class="hax-ui-field-row">
        <div class="hax-ui-field-label">
          <span class="name">${this.t.username}</span>
        </div>
        <div class="hax-ui-field-control">
          <div class="cred">
            <span class="credential-value">${username}</span>
            <button
              type="button"
              class="hax-ui-icon-btn copy-btn ${
                this._copiedField === "username" ? "copied" : ""
              }"
              aria-label="${this.t.copy} ${this.t.username}"
              title="${this.t.copy}"
              @click="${() => this._copyToClipboard(username, "username")}"
            >
              <simple-icon-lite
                icon="${
                  this._copiedField === "username"
                    ? HaxUiAdminIcons.check
                    : HaxUiAdminIcons.copy
                }"
              ></simple-icon-lite>
            </button>
          </div>
        </div>
      </div>
      <div class="hax-ui-field-row">
        <div class="hax-ui-field-label">
          <span class="name"
            >${this.t.password}
            ${
              passwordWasGenerated
                ? html`<span class="hax-ui-pill generated-tag" data-tone="info"
                    >${this.t.autoGenerated}</span
                  >`
                : ""
            }</span
          >
        </div>
        <div class="hax-ui-field-control">
          <div class="cred">
            <span class="credential-value"
              >${this._passwordRevealed ? password : "••••••••••••"}</span
            >
            <button
              type="button"
              class="hax-ui-icon-btn reveal-btn"
              aria-pressed="${this._passwordRevealed ? "true" : "false"}"
              aria-label="${this._passwordRevealed ? this.t.hide : this.t.show}"
              title="${this._passwordRevealed ? this.t.hide : this.t.show}"
              @click="${this._togglePasswordReveal}"
            >
              <simple-icon-lite
                icon="${
                  this._passwordRevealed
                    ? HaxUiAdminIcons.hide
                    : HaxUiAdminIcons.preview
                }"
              ></simple-icon-lite>
            </button>
            <button
              type="button"
              class="hax-ui-icon-btn copy-btn ${
                this._copiedField === "password" ? "copied" : ""
              }"
              aria-label="${this.t.copy} ${this.t.password}"
              title="${this.t.copy}"
              @click="${() => this._copyToClipboard(password, "password")}"
            >
              <simple-icon-lite
                icon="${
                  this._copiedField === "password"
                    ? HaxUiAdminIcons.check
                    : HaxUiAdminIcons.copy
                }"
              ></simple-icon-lite>
            </button>
          </div>
        </div>
      </div>
      <div class="forever">
        <img
          src="${new URL("./lib/hax.png", import.meta.url).href}"
          alt=""
          width="56"
          height="56"
        />
        <div>
          <h3>${this.t.foreverTitle}</h3>
          <ul>
            <li>${this.t.foreverFiles}</li>
            <li>${this.t.foreverStandards}</li>
            <li>${this.t.foreverPortable}</li>
          </ul>
          <p>${this.t.foreverPillar}</p>
        </div>
      </div>
    `;
  }

  renderError() {
    return html`
      <div class="hax-ui-empty error-box" role="alert">
        <simple-icon-lite icon="${HaxUiAdminIcons.error}"></simple-icon-lite>
        <h3>${this.t.anErrorOccurred}</h3>
        <p>${this.error}</p>
      </div>
    `;
  }

  renderLoading() {
    return html`
      <div class="hax-ui-empty loading-overlay">
        <p>${this.t.loading}</p>
      </div>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(HaxAppInstaller.tag, HaxAppInstaller);
