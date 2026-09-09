/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";

/**
 * Supported language codes mapped to native names.
 * Front-end-driven: user picks in step 1, element renders in that language.
 */
const SUPPORTED_LANGUAGES = {
  af: "Afrikaans",
  am: "አማርኛ",
  ar: "العربية",
  az: "Azərbaycan",
  be: "Беларуская",
  bg: "Български",
  bn: "বাংলা",
  bs: "Bosanski",
  ca: "Català",
  co: "Corsu",
  cs: "Čeština",
  cy: "Cymraeg",
  da: "Dansk",
  de: "Deutsch",
  el: "Ελληνικά",
  en: "English",
  eo: "Esperanto",
  es: "Español",
  et: "Eesti",
  eu: "Euskara",
  fa: "فارسی",
  fi: "Suomi",
  fo: "Føroyskt",
  fr: "Français",
  fy: "Frysk",
  ga: "Gaeilge",
  gl: "Galego",
  gn: "Avañe'ẽ",
  gu: "ગુજરાતી",
  ha: "Hausa",
  haw: "ʻŌlelo Hawaiʻi",
  he: "עברית",
  hi: "हिन्दी",
  hr: "Hrvatski",
  hu: "Magyar",
  hy: "Հայերեն",
  id: "Bahasa Indonesia",
  ig: "Igbo",
  is: "Íslenska",
  it: "Italiano",
  ja: "日本語",
  jv: "Basa Jawa",
  ka: "ქართული",
  kk: "Қазақ",
  km: "ខ្មែរ",
  kn: "ಕನ್ನಡ",
  ko: "한국어",
  ku: "Kurdî",
  ky: "Кыргызча",
  lb: "Lëtzebuergesch",
  lo: "ລາວ",
  lt: "Lietuvių",
  lv: "Latviešu",
  mi: "Māori",
  mk: "Македонски",
  ml: "മലയാളം",
  mn: "Монгол",
  mr: "मराठी",
  ms: "Bahasa Melayu",
  mt: "Malti",
  my: "မြန်မာ",
  nb: "Norsk Bokmål",
  ne: "नेपाली",
  nl: "Nederlands",
  no: "Norsk",
  ny: "Chichewa",
  om: "Oromoo",
  pa: "ਪੰਜਾਬੀ",
  pl: "Polski",
  pnb: "پنجابی",
  ps: "پښتو",
  pt: "Português",
  qu: "Runa Simi",
  ro: "Română",
  ru: "Русский",
  sd: "سنڌي",
  si: "සිංහල",
  sk: "Slovenčina",
  sl: "Slovenščina",
  sn: "ChiShona",
  so: "Soomaali",
  sq: "Shqip",
  sr: "Српски",
  sv: "Svenska",
  sw: "Kiswahili",
  ta: "தமிழ்",
  te: "తెలుగు",
  tg: "Тоҷикӣ",
  th: "ไทย",
  tk: "Türkmen",
  tl: "Filipino",
  tr: "Türkçe",
  tt: "Татар",
  uk: "Українська",
  ur: "اردو",
  uz: "O'zbek",
  vi: "Tiếng Việt",
  wuu: "吴语",
  xh: "isiXhosa",
  yi: "ייִדיש",
  yo: "Yorùbá",
  zh: "中文",
  zh_CN: "中文（简体）",
  zu: "isiZulu",
};

/**
 * `hax-app-installer`
 *  4-step HAXcms installation wizard.
 * Steps: Choose language, Verify requirements, Configure system, Start HAXcms.
 * @demo index.html
 * @element hax-app-installer
 */
export class HaxAppInstaller extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "hax-app-installer";
  }

  constructor() {
    super();
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
    this._confettiBurst = false;
    this._confirmPasswordInput = "";
    this._passwordMismatch = false;
    this._preparePermissionCommand = "";
    this._preparePermissionHint = "";
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
        "Leave blank for an auto-generated secure password, or enter 10+ characters with at least one letter and one number.",
      confirmPassword: "Confirm password",
      passwordsDoNotMatch: "Passwords do not match.",
      passwordsMatch: "Passwords match.",
      weak: "Weak",
      fair: "Fair",
      good: "Good",
      strong: "Strong",
      passwordStrength: "Password strength",
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
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color-scheme: light dark;
          font-family: var(--ddd-font-primary);
          color: light-dark(var(--ddd-primary-3), var(--ddd-accent-6));
          background: light-dark(
            var(--ddd-theme-default-background),
            var(--ddd-primary-3)
          );
          padding: var(--ddd-spacing-6);
          min-height: 100vh;
        }

        .installer-card {
          background: light-dark(var(--ddd-accent-6), var(--ddd-primary-4));
          border-radius: var(--ddd-radius-lg);
          box-shadow: var(--ddd-boxShadow-lg);
          overflow: hidden;
          position: relative;
        }

        .installer-header {
          background: light-dark(
            var(--ddd-primary-2),
            var(--ddd-primary-3)
          );
          color: var(--ddd-accent-6);
          padding: var(--ddd-spacing-4) var(--ddd-spacing-6);
          display: flex;
          gap: var(--ddd-spacing-3);
          border-bottom: var(--ddd-border-xs);
        }

        .installer-header .installer-name {
          margin: 0;
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
          font-family: var(--ddd-font-secondary);
          color: var(--ddd-accent-6);
          line-height: 1;
          display: flex;
          align-items: center;
        }

        .step-indicator {
          list-style: none;
          margin: 0;
          padding: var(--ddd-spacing-4) var(--ddd-spacing-6);
          display: inline-flex;
          justify-content: space-between;
          background: light-dark(
            var(--ddd-accent-2),
            var(--ddd-primary-4)
          );
          border-bottom: var(--ddd-border-xs);
          gap: var(--ddd-spacing-2);
        }

        .step-indicator li {
          position: relative;
          font-size: var(--ddd-font-size-6xs);
        }

        .step-num {
          width: var(--ddd-icon-3xs);
          height: var(--ddd-icon-3xs);
          border-radius: var(--ddd-radius-circle);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-6xs);
          background: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-5)
          );
          color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          border: 2px solid
            light-dark(var(--ddd-primary-5), var(--ddd-accent-6));
          z-index: 1;
          transition: all var(--ddd-duration-normal) var(--ddd-timing-ease);
        }

        .step-label {
          margin: 0 var(--ddd-spacing-3);
          text-align: center;
          color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          opacity: var(--ddd-opacity-60);
        }

        .step-done .step-num {
          background: var(--ddd-primary-17);
          color: var(--ddd-accent-6);
          border-color: var(--ddd-primary-17);
        }

        .step-done .step-label {
          opacity: var(--ddd-opacity-80);
        }

        .step-active .step-num {
          background: var(--ddd-primary-8);
          color: var(--ddd-accent-6);
          border-color: var(--ddd-primary-8);
          transform: scale(1.15);
          box-shadow: var(--ddd-boxShadow-sm);
        }

        .step-active .step-label {
          opacity: var(--ddd-opacity-100);
          font-weight: var(--ddd-font-weight-bold);
        }

        .step-link {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: row;
          align-items: center;
          cursor: pointer;
          font: inherit;
          color: inherit;
          width: 100%;
        }

        .step-link:hover .step-num,
        .step-link:focus-visible .step-num {
          outline: var(--ddd-focus-ring);
          outline-offset: 2px;
        }

        .step-static {
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        .step-content {
          padding: var(--ddd-spacing-8);
        }

        .step-container {
          display: inline-flex;
          flex-direction: column;
          padding: var(--ddd-spacing-4);
        }

        .step-content h2 {
          margin: 0 0 var(--ddd-spacing-2) 0;
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
          font-family: var(--ddd-font-secondary);
          color: light-dark(
            var(--ddd-primary-2),
            var(--ddd-accent-6)
          );
        }

        .step-content p.description {
          margin: 0 0 var(--ddd-spacing-6) 0;
          font-size: var(--ddd-font-size-4xs);
          color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          opacity: var(--ddd-opacity-80);
          line-height: var(--ddd-lh-150);
        }

        .field-group {
          margin-bottom: var(--ddd-spacing-6);
        }

        .field-group label {
          display: block;
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          margin-bottom: var(--ddd-spacing-2);
          color: light-dark(
            var(--ddd-primary-3),
            var(--ddd-accent-6)
          );
        }

        .field-group input,
        .field-group select {
          width: 100%;
          box-sizing: border-box;
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          font-size: var(--ddd-font-size-4xs);
          font-family: var(--ddd-font-primary);
          border: var(--ddd-border-sm);
          border-radius: var(--ddd-radius-sm);
          background: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-5)
          );
          color: light-dark(
            var(--ddd-primary-3),
            var(--ddd-accent-6)
          );
          border-color: light-dark(
            var(--ddd-primary-5),
            var(--ddd-accent-6)
          );
        }

        .field-group input:focus,
        .field-group select:focus {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
          border-color: var(--ddd-primary-8);
        }

        .field-group .help-text {
          margin-top: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-6xs);
          color: light-dark(
            var(--ddd-primary-5),
            var(--ddd-accent-6)
          );
          opacity: var(--ddd-opacity-80);
          line-height: var(--ddd-lh-140);
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-6);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          font-family: var(--ddd-font-navigation);
          border: none;
          border-radius: var(--ddd-radius-sm);
          cursor: pointer;
          text-decoration: none;
          transition: all var(--ddd-duration-normal) var(--ddd-timing-ease);
        }

        .btn-primary {
          background: var(--ddd-primary-8);
          color: var(--ddd-accent-6);
        }

        .btn-primary:hover {
          background: var(--ddd-primary-2);
          box-shadow: var(--ddd-boxShadow-sm);
        }

        .btn-secondary {
          background: light-dark(
            var(--ddd-accent-2),
            var(--ddd-primary-5)
          );
          color: light-dark(
            var(--ddd-primary-3),
            var(--ddd-accent-6)
          );
          border: var(--ddd-border-xs);
        }

        .btn-secondary:hover {
          background: light-dark(
            var(--ddd-accent-1),
            var(--ddd-primary-4)
          );
        }

        .btn-row {
          display: flex;
          gap: var(--ddd-spacing-3);
          flex-wrap: wrap;
          align-items: center;
          margin-top: var(--ddd-spacing-6);
        }

        .req-section {
          margin-bottom: var(--ddd-spacing-6);
        }

        .req-section h3 {
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          margin: 0 0 var(--ddd-spacing-3) 0;
          color: light-dark(
            var(--ddd-primary-3),
            var(--ddd-accent-6)
          );
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }

        .req-section h3 simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }

        .req-table {
          width: 100%;
          border-collapse: collapse;
          font-size: var(--ddd-font-size-6xs);
          /* fixed layout + wrapping cells keep long messages and commands
             from overflowing or forcing the card wider than the viewport */
          table-layout: fixed;
        }

        .req-table th,
        .req-table td {
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .req-table th {
          text-align: left;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          font-weight: var(--ddd-font-weight-bold);
          background: light-dark(
            var(--ddd-accent-2),
            var(--ddd-primary-5)
          );
          color: light-dark(
            var(--ddd-primary-3),
            var(--ddd-accent-6)
          );
          border-bottom: var(--ddd-border-xs);
        }

        .req-table td {
          padding: var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-6xs);
          border-bottom: var(--ddd-border-xs);
          vertical-align: top;
          color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
        }

        .req-table tr:last-child td {
          border-bottom: none;
        }

        .req-status {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          font-weight: var(--ddd-font-weight-bold);
        }

        .req-status simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }

        .status-error {
          color: light-dark(var(--ddd-primary-22), var(--ddd-theme-default-errorLight));
        }

        .status-warning {
          color: light-dark(var(--ddd-primary-23), var(--ddd-theme-default-warningLight));
        }

        .status-ok {
          color: light-dark(
            var(--ddd-primary-25),
            var(--ddd-theme-default-successLight)
          );
        }

        .cmd-block {
          margin: var(--ddd-spacing-2) 0 0 0;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          background: light-dark(
            var(--ddd-primary-3),
            var(--ddd-primary-2)
          );
          color: var(--ddd-accent-6);
          border-radius: var(--ddd-radius-xs);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-6xs);
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-all;
        }

        .no-issues {
          padding: var(--ddd-spacing-6);
          background: light-dark(
            var(--ddd-theme-default-successLight),
            var(--ddd-primary-25)
          );
          border-radius: var(--ddd-radius-md);
          color: light-dark(
            var(--ddd-primary-25),
            var(--ddd-theme-default-successLight)
          );
          font-weight: var(--ddd-font-weight-medium);
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          margin-bottom: var(--ddd-spacing-6);
        }

        .no-issues simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-sm);
          --simple-icon-height: var(--ddd-icon-sm);
          color: light-dark(
            var(--ddd-primary-25),
            var(--ddd-theme-default-successLight)
          );
        }

        details.req-details {
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-sm);
          overflow: hidden;
        }

        details.req-details summary {
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          cursor: pointer;
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-4xs);
          background: light-dark(
            var(--ddd-accent-2),
            var(--ddd-primary-5)
          );
          color: light-dark(
            var(--ddd-primary-3),
            var(--ddd-accent-6)
          );
          list-style: none;
        }

        details.req-details summary::-webkit-details-marker {
          display: none;
        }

        details.req-details[open] summary {
          border-bottom: var(--ddd-border-xs);
        }

        .credentials-box {
          background: light-dark(
            var(--ddd-accent-9),
            var(--ddd-primary-5)
          );
          border-radius: var(--ddd-radius-md);
          padding: var(--ddd-spacing-6);
          margin-bottom: var(--ddd-spacing-6);
        }

        .installer-logo {
          height: var(--ddd-icon-lg);
          width: var(--ddd-icon-lg);
        }

        .credential-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--ddd-spacing-3) 0;
          border-bottom: var(--ddd-border-xs);
          gap: var(--ddd-spacing-4);
        }

        .credential-row:last-child {
          border-bottom: none;
        }

        .credential-label {
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-4xs);
          color: light-dark(
            var(--ddd-primary-3),
            var(--ddd-accent-6)
          );
          flex-shrink: 0;
        }

        .credential-value {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          color: light-dark(
            var(--ddd-primary-2),
            var(--ddd-accent-6)
          );
          flex: 1;
          word-break: break-all;
          text-align: right;
        }

        .copy-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--ddd-spacing-1);
          color: light-dark(
            var(--ddd-primary-8),
            var(--ddd-accent-6)
          );
          flex-shrink: 0;
        }

        .copy-btn simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }

        .copy-btn.copied simple-icon-lite {
          color: light-dark(var(--ddd-primary-25), var(--ddd-theme-default-successLight));
        }

        .important-banner {
          background: light-dark(
            var(--ddd-theme-default-warningLight),
            var(--ddd-primary-23)
          );
          color: light-dark(
            var(--ddd-primary-23)
            var(--ddd-theme-default-warningLight)
          );
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-4);
          margin-bottom: var(--ddd-spacing-6);
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-medium);
          display: flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-3);
          line-height: var(--ddd-lh-140);
        }

        .important-banner simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-xs);
          --simple-icon-height: var(--ddd-icon-xs);
          color: light-dark(
            var(--ddd-primary-23)
            var(--ddd-theme-default-warningLight)
          );
          flex-shrink: 0;
        }

        .permission-banner {
          background: light-dark(
            var(--ddd-theme-default-infoLight),
            var(--ddd-primary-24)
          );
          color: light-dark(
            var(--ddd-primary-24)
            var(--ddd-accent-6)
          );
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-4);
          margin-bottom: var(--ddd-spacing-6);
          font-size: var(--ddd-font-size-5xs);
          line-height: var(--ddd-lh-140);
        }

        .permission-banner-head {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          margin-bottom: var(--ddd-spacing-2);
        }

        .permission-banner-head simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-xs);
          --simple-icon-height: var(--ddd-icon-xs);
          color: light-dark(
            var(--ddd-primary-24)
            var(--ddd-accent-6)
          );
        }

        .permission-banner-hint {
          margin: 0 0 var(--ddd-spacing-2) 0;
          opacity: var(--ddd-opacity-90);
        }

        .permission-cmd {
          margin: 0;
          white-space: pre-wrap;
          word-break: break-all;
        }

        .prepare-action {
          margin-bottom: var(--ddd-spacing-6);
        }

        .community-section h3 {
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          margin: 0 0 var(--ddd-spacing-3) 0;
          color: light-dark(
            var(--ddd-primary-3),
            var(--ddd-accent-6)
          );
        }

        .community-links {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-3);
          margin-bottom: var(--ddd-spacing-6);
        }

        .community-link {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          border-radius: var(--ddd-radius-sm);
          background: light-dark(
            var(--ddd-accent-2),
            var(--ddd-primary-5)
          );
          color: light-dark(
            var(--ddd-primary-8),
            var(--ddd-accent-6)
          );
          text-decoration: none;
          font-size: var(--ddd-font-size-6xs);
          font-weight: var(--ddd-font-weight-medium);
          font-family: var(--ddd-font-navigation);
          border: var(--ddd-border-xs);
          transition: all var(--ddd-duration-normal) var(--ddd-timing-ease);
        }

        .community-link:hover {
          background: light-dark(
            var(--ddd-accent-9),
            var(--ddd-primary-4)
          );
          box-shadow: var(--ddd-boxShadow-sm);
        }

        .community-link simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }

        .start-hax-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-3);
          width: 100%;
          box-sizing: border-box;
          padding: var(--ddd-spacing-4) var(--ddd-spacing-6);
          font-size: var(--ddd-font-size-3xs);
          font-weight: var(--ddd-font-weight-bold);
          font-family: var(--ddd-font-secondary);
          background-color: var(--ddd-primary-17) !important;
          color: var(--ddd-accent-6) !important;
          border: none;
          border-radius: var(--ddd-radius-md);
          cursor: pointer;
          text-decoration: none;
          transition: all var(--ddd-duration-normal) var(--ddd-timing-ease);
        }
        .start-hax-btn:focus,
        .start-hax-btn:hover {
          box-shadow: var(--ddd-boxShadow-lg);
          transform: translateY(-1px);
        }

        .start-hax-btn simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-sm);
          --simple-icon-height: var(--ddd-icon-sm);
          color: var(--ddd-accent-6);
        }

        .error-box {
          text-align: center;
          padding: var(--ddd-spacing-8);
        }

        .error-box simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-lg);
          --simple-icon-height: var(--ddd-icon-lg);
          color: light-dark(var(--ddd-primary-22), var(--ddd-theme-default-errorLight));
          margin-bottom: var(--ddd-spacing-4);
        }

        .error-box h2 {
          color: light-dark(var(--ddd-primary-22), var(--ddd-theme-default-errorLight));
          margin-bottom: var(--ddd-spacing-3);
        }

        .error-box p {
          font-size: var(--ddd-font-size-4xs);
          color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          margin-bottom: var(--ddd-spacing-6);
          line-height: var(--ddd-lh-150);
        }

        .loading-overlay {
          text-align: center;
          padding: var(--ddd-spacing-8);
        }

        .loading-overlay simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-lg);
          --simple-icon-height: var(--ddd-icon-lg);
          color: var(--ddd-primary-8);
          animation: spin 1s linear infinite;
        }

        .loading-overlay p {
          font-size: var(--ddd-font-size-4xs);
          color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          margin-top: var(--ddd-spacing-4);
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .generated-tag {
          display: inline-block;
          font-size: var(--ddd-font-size-6xs);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-xs);
          background: light-dark(
            var(--ddd-theme-default-infoLight),
            var(--ddd-primary-24)
          );
          color: light-dark(
            var(--ddd-primary-24),
            var(--ddd-theme-default-infoLight)
          );
          font-weight: var(--ddd-font-weight-bold);
          margin-left: var(--ddd-spacing-2);
        }

        .help-footer {
          padding: var(--ddd-spacing-4) var(--ddd-spacing-8);
          background: light-dark(
            var(--ddd-accent-2),
            var(--ddd-primary-4)
          );
          border-top: var(--ddd-border-xs);
        }

        .help-footer-label {
          display: block;
          font-size: var(--ddd-font-size-6xs);
          font-weight: var(--ddd-font-weight-bold);
          color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          opacity: var(--ddd-opacity-70);
          margin-bottom: var(--ddd-spacing-2);
        }

        .help-footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-3);
        }

        .help-footer-link {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border-radius: var(--ddd-radius-sm);
          background: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-5)
          );
          color: light-dark(
            var(--ddd-primary-8),
            var(--ddd-accent-6)
          );
          text-decoration: none;
          font-size: var(--ddd-font-size-6xs);
          font-weight: var(--ddd-font-weight-medium);
          font-family: var(--ddd-font-navigation);
          border: var(--ddd-border-xs);
          transition: all var(--ddd-duration-normal) var(--ddd-timing-ease);
        }

        .help-footer-link:hover {
          background: light-dark(
            var(--ddd-accent-9),
            var(--ddd-primary-4)
          );
          box-shadow: var(--ddd-boxShadow-sm);
        }

        .help-footer-link simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }

        .reveal-btn {
          margin-right: var(--ddd-spacing-1);
        }

        .strength-meter {
          margin-top: var(--ddd-spacing-2);
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }

        .strength-bar {
          flex: 1;
          height: 6px;
          border-radius: var(--ddd-radius-xs);
          background: light-dark(
            var(--ddd-primary-5),
            var(--ddd-primary-4)
          );
          transition: background var(--ddd-duration-normal) var(--ddd-timing-ease);
        }

        .strength-1 {
          background: light-dark(var(--ddd-primary-22), var(--ddd-theme-default-errorLight));
        }

        .strength-2 {
          background: light-dark(var(--ddd-primary-23), var(--ddd-theme-default-warningLight));
        }

        .strength-3 {
          background: light-dark(var(--ddd-primary-24), var(--ddd-theme-default-infoLight));
        }

        .strength-4 {
          background: light-dark(var(--ddd-primary-25), var(--ddd-theme-default-successLight));
        }

        .strength-label {
          font-size: var(--ddd-font-size-6xs);
          font-weight: var(--ddd-font-weight-bold);
          color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          flex-shrink: 0;
        }

        .confirm-feedback {
          margin-top: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-6xs);
          font-weight: var(--ddd-font-weight-bold);
        }

        .confirm-feedback.match {
          color: light-dark(var(--ddd-primary-25), var(--ddd-theme-default-successLight));
        }

        .confirm-feedback.mismatch {
          color: light-dark(var(--ddd-primary-22), var(--ddd-theme-default-errorLight));
        }

        .confetti {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 5;
        }

        .confetti-bit {
          position: absolute;
          top: -10px;
          width: 8px;
          height: 14px;
          border-radius: 2px;
          animation-name: confetti-fall;
          animation-timing-function: ease-in;
          animation-fill-mode: forwards;
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(420px) rotate(540deg);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .confetti-bit {
            animation: none;
            display: none;
          }
        }

        @media (max-width: 600px) {
          .step-label {
            display: none;
          }
          .installer-card {
            max-width: 100%;
          }
          .step-content {
            padding: var(--ddd-spacing-4);
          }
          .req-table {
            font-size: var(--ddd-font-size-6xs);
          }
          /* On narrow screens, stack the requirement table into a
             label/value list so commands and messages stay readable. */
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
            margin-bottom: var(--ddd-spacing-3);
            border: var(--ddd-border-xs);
            border-radius: var(--ddd-radius-sm);
          }
          .req-table td {
            border-bottom: var(--ddd-border-xs);
            padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          }
        }
      `,
    ];
  }

  firstUpdated() {
    this.fetchState();
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
    if (typeof data.step === "number") {
      this.step = data.step;
    }
    if (typeof data.language === "string") {
      this.language = data.language;
      this._selectedLanguage = data.language;
    }
    if (typeof data.username === "string") {
      this._usernameInput = data.username;
    }
    this.stateData = data;
    // Issue #2974: celebrate a successful install (transition into step 4
    // with credentials present) with a one-shot confetti burst.
    if (
      this.step === 4 &&
      prevStep !== 4 &&
      data.credentials &&
      !data.hasErrors
    ) {
      this._confettiBurst = true;
      this.requestUpdate();
      setTimeout(() => {
        this._confettiBurst = false;
        this.requestUpdate();
      }, 4000);
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
    } catch (e) {
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
    const data = await this.advanceStep({
      toStep: 2,
      language: lang,
    });
    if (data) {
      this._dispatchLanguageChange(lang);
    }
  }

  /**
   * Handle step 2 continue - advance to step 3.
   */
  async _handleStep2Continue() {
    await this.advanceStep({
      toStep: 3,
      language: this.language,
    });
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
    await this.advanceStep({
      toStep: 4,
      language: this.language,
      username: this._usernameInput,
      password: this._passwordInput,
    });
  }

  /**
   * Handle language select change.
   * @param {Event} e - select change event
   */
  _handleLanguageChange(e) {
    const target = e.target;
    this._selectedLanguage = target.value;
  }

  /**
   * Handle username input change.
   * @param {Event} e - input event
   */
  _handleUsernameChange(e) {
    const target = e.target;
    this._usernameInput = target.value;
  }

  /**
   * Handle password input change.
   * @param {Event} e - input event
   */
  _handlePasswordChange(e) {
    const target = e.target;
    this._passwordInput = target.value;
    // Recompute mismatch state as the user types the primary password.
    if (this._confirmPasswordInput !== "") {
      this._passwordMismatch = this._confirmPasswordInput !== target.value;
    } else {
      this._passwordMismatch = false;
    }
  }

  /**
   * Handle confirm password input change.
   * @param {Event} e - input event
   */
  _handleConfirmPasswordChange(e) {
    const target = e.target;
    this._confirmPasswordInput = target.value;
    this._passwordMismatch =
      target.value !== "" && target.value !== this._passwordInput;
  }

  /**
   * Compute an interactive password strength score (0-4) and a label key.
   * Mirrors the backend policy (10+ chars, letter + number) as the floor
   * for "fair", then rewards length, mixed case, and special characters.
   * @param {String} password
   * @returns {Object} { score: 0|1|2|3|4, labelKey: string }
   */
  _computePasswordStrength(password) {
    if (!password || password === "") {
      return { score: 0, labelKey: "" };
    }
    let score = 0;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    if (password.length >= 10) {
      score++;
    }
    if (hasLetter && hasNumber) {
      score++;
    }
    if (password.length >= 14) {
      score++;
    }
    if ((hasLower && hasUpper) || hasSpecial) {
      score++;
    }
    // cap at 4
    if (score > 4) {
      score = 4;
    }
    let labelKey = "weak";
    if (score >= 4) {
      labelKey = "strong";
    } else if (score === 3) {
      labelKey = "good";
    } else if (score === 2) {
      labelKey = "fair";
    }
    return { score, labelKey };
  }

  render() {
    return html`
      <div class="installer-card">
        ${this._confettiBurst ? this.renderConfetti() : ""}
        <div class="installer-header">
          <img src="${new URL('./lib/hax.png', import.meta.url).href}" alt="HAXcms World Traveler mascot" class="installer-logo" />
          <span class="installer-name">${this.t.haxcmsInstaller}</span>
        </div>
        <div class="step-content">
        ${this.renderStepIndicator()}
          <div class="step-container">
          ${this.loading
            ? this.renderLoading()
            : this.error
              ? this.renderError()
              : this.renderStepContent()}
          </div>
        </div>
        ${this.renderHelpFooter()}
      </div>
    `;
  }

  renderConfetti() {
    // Lightweight CSS-only confetti: a set of colored bits that fall and
    // fade. No external dependency, respects prefers-reduced-motion.
    const bits = Array.from({ length: 24 }, (_, i) => i);
    const colors = [
      "var(--ddd-primary-8)",
      "var(--ddd-primary-17)",
      "var(--ddd-primary-25)",
      "var(--ddd-primary-23)",
      "var(--ddd-primary-24)",
    ];
    return html`
      <div class="confetti" aria-hidden="true">
        ${bits.map(
          (i) => html`
            <span
              class="confetti-bit"
              style="left:${(i * 4.1) % 100}%;background:${colors[i % colors.length]};animation-delay:${(i % 6) * 0.12}s;animation-duration:${2.4 + (i % 5) * 0.3}s;"
            ></span>
          `,
        )}
      </div>
    `;
  }

  renderHelpFooter() {
    return html`
      <div class="help-footer">
        <span class="help-footer-label">${this.t.needHelp}</span>
        <div class="help-footer-links">
          <a
            class="help-footer-link"
            href="https://haxtheweb.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <simple-icon-lite icon="icons:book"></simple-icon-lite>
            ${this.t.documentation}
          </a>
          <a
            class="help-footer-link"
            href="https://github.com/haxtheweb/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            <simple-icon-lite icon="icons:bug-report"></simple-icon-lite>
            ${this.t.reportIssues}
          </a>
          <a
            class="help-footer-link"
            href="https://discord.gg/aCGxmRHEJP"
            target="_blank"
            rel="noopener noreferrer"
          >
            <simple-icon-lite icon="hax:discord"></simple-icon-lite>
            ${this.t.discord}
          </a>
          <a
            class="help-footer-link"
            href="https://github.com/haxtheweb/haxcms-php"
            target="_blank"
            rel="noopener noreferrer"
          >
            <simple-icon-lite icon="mdi-social:github-circle"></simple-icon-lite>
            ${this.t.githubRepository}
          </a>
        </div>
      </div>
    `;
  }

  renderStepIndicator() {
    const steps = [
      { num: 1, label: this.t.chooseLanguage },
      { num: 2, label: this.t.verifyRequirements },
      { num: 3, label: this.t.configureSystem },
      { num: 4, label: this.t.startHaxcms },
    ];
    return html`
      <ol class="step-indicator">
        ${steps.map((s) => {
          let state = "pending";
          if (s.num < this.step) {
            state = "done";
          } else if (s.num === this.step) {
            state = "active";
          }
          // Completed steps (and the active step that is not step 4) are
          // clickable to go back, e.g. to pick a different language.
          const canGoBack =
            !this.loading &&
            s.num < this.step &&
            this.step !== 4 &&
            s.num < 4;
          const inner = html`
            <span class="step-num">
              ${s.num < this.step ? html`✓` : s.num}
            </span>
            <span class="step-label">${s.label}</span>
          `;
          return html`
            <li class="step-${state} ${canGoBack ? "step-clickable" : ""}">
              ${canGoBack
                ? html`<button
                    class="step-link"
                    @click="${() => this._goToStep(s.num)}"
                    title="${this.t.back}"
                    aria-label="${this.t.back}: ${s.label}"
                  >
                    ${inner}
                  </button>`
                : html`<span class="step-static">${inner}</span>`}
            </li>
          `;
        })}
      </ol>
    `;
  }

  renderStepContent() {
    if (this.step === 1) return this.renderStep1();
    if (this.step === 2) return this.renderStep2();
    if (this.step === 3) return this.renderStep3();
    if (this.step === 4) return this.renderStep4();
    return this.renderStep1();
  }

  renderStep1() {
    const langCodes = Object.keys(SUPPORTED_LANGUAGES).sort((a, b) => {
      const nameA = SUPPORTED_LANGUAGES[a];
      const nameB = SUPPORTED_LANGUAGES[b];
      return nameA.localeCompare(nameB);
    });
    return html`
      <h2>${this.t.chooseLanguage}</h2>
      <p class="description">${this.t.selectLanguageDescription}</p>
      <div class="field-group">
        <label for="lang-select">${this.t.chooseLanguage}</label>
        <select
          id="lang-select"
          @change="${this._handleLanguageChange}"
          .value="${this._selectedLanguage}"
        >
          ${langCodes.map(
            (code) => html`
              <option
                value="${code}"
                ?selected="${code === this._selectedLanguage}"
              >
                ${SUPPORTED_LANGUAGES[code]}
              </option>
            `,
          )}
        </select>
      </div>
      <div class="btn-row">
        <button class="btn btn-primary" @click="${this._handleStep1Submit}">
          ${this.t.saveAndContinue}
        </button>
      </div>
    `;
  }

  renderStep2() {
    const needsConfig =
      (this.stateData && this.stateData.needsConfiguration) || [];
    const allPassed = (this.stateData && this.stateData.allPassed) || [];
    const hasErrors = !!(this.stateData && this.stateData.hasErrors);
    return html`
      <h2>${this.t.verifyRequirements}</h2>
      <p class="description">${this.t.verifyRequirementsDescription}</p>
      ${this._preparePermissionCommand
        ? html`
            <div class="permission-banner">
              <div class="permission-banner-head">
                <simple-icon-lite icon="icons:lock"></simple-icon-lite>
                <strong>${this.t.permissionRequired}</strong>
              </div>
              ${this._preparePermissionHint
                ? html`<p class="permission-banner-hint">
                    ${this._preparePermissionHint}
                  </p>`
                : ""}
              <pre class="cmd-block permission-cmd">${this._preparePermissionCommand}</pre>
            </div>
          `
        : ""}
      ${hasErrors
        ? html`
            <div class="prepare-action">
              <button
                class="btn btn-primary"
                @click="${this._prepareEnvironment}"
              >
                <simple-icon-lite
                  icon="icons:create-new-folder"
                  style="--simple-icon-width: var(--ddd-icon-4xs); --simple-icon-height: var(--ddd-icon-4xs);"
                ></simple-icon-lite>
                ${this.t.createMissingFiles}
              </button>
            </div>
          `
        : ""}
      ${needsConfig.length === 0
        ? html`
            <div class="no-issues">
              <simple-icon-lite icon="icons:check-circle"></simple-icon-lite>
              <span>${this.t.allRequirementsMet}</span>
            </div>
          `
        : html`
            <div class="req-section">
              <h3>
                <simple-icon-lite
                  icon="icons:error"
                  class="status-error"
                ></simple-icon-lite>
                ${this.t.requirementsNeedingConfiguration}
              </h3>
              ${this.renderReqTable(needsConfig, true)}
            </div>
          `}
      ${allPassed.length > 0
        ? html`
            <div class="req-section">
              <details class="req-details">
                <summary>
                  ${this.t.passedChecks} (${allPassed.length})
                </summary>
                ${this.renderReqTable(allPassed, false)}
              </details>
            </div>
          `
        : ""}
      <div class="btn-row">
        <button
          class="btn btn-secondary"
          @click="${() => this._goToStep(1)}"
        >
          <simple-icon-lite
            icon="icons:arrow-back"
            style="--simple-icon-width: var(--ddd-icon-4xs); --simple-icon-height: var(--ddd-icon-4xs);"
          ></simple-icon-lite>
          ${this.t.back}
        </button>
        ${hasErrors
          ? html`
              <button
                class="btn btn-secondary"
                @click="${() => this.fetchState()}"
              >
                <simple-icon-lite
                  icon="icons:refresh"
                  style="--simple-icon-width: var(--ddd-icon-4xs); --simple-icon-height: var(--ddd-icon-4xs);"
                ></simple-icon-lite>
                ${this.t.recheckRequirements}
              </button>
            `
          : ""}
        ${!hasErrors
          ? html`
              <button
                class="btn btn-primary"
                @click="${this._handleStep2Continue}"
              >
                ${this.t.continue}
                <simple-icon-lite
                  icon="icons:arrow-forward"
                  style="--simple-icon-width: var(--ddd-icon-4xs); --simple-icon-height: var(--ddd-icon-4xs);"
                ></simple-icon-lite>
              </button>
            `
          : ""}
      </div>
    `;
  }

  renderReqTable(rows, showCommand) {
    return html`
      <table class="req-table">
        <thead>
          <tr>
            <th>${this.t.requirement}</th>
            <th>${this.t.value}</th>
            <th>${this.t.description}</th>
            ${showCommand ? html`<th>${this.t.suggestedCommand}</th>` : ""}
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => {
            const tone = row.tone || row.severity || "ok";
            let icon = "icons:check-circle";
            if (tone === "error") {
              icon = "icons:cancel";
            } else if (tone === "warning") {
              icon = "icons:warning";
            }
            return html`
              <tr>
                <td>
                  <span class="req-status status-${tone}">
                    <simple-icon-lite icon="${icon}"></simple-icon-lite>
                    ${row.title}
                  </span>
                </td>
                <td>${row.value}</td>
                <td>${row.description}</td>
                ${showCommand
                  ? html`<td>
                      ${row.suggestedCommand
                        ? html`<code><pre class="cmd-block">${row.suggestedCommand}</pre></code>`
                        : ""}
                    </td>`
                  : ""}
              </tr>
            `;
          })}
        </tbody>
      </table>
    `;
  }

  renderStep3() {
    const strength = this._computePasswordStrength(this._passwordInput);
    return html`
      <h2>${this.t.configureSystem}</h2>
      <p class="description">${this.t.configureSystemDescription}</p>
      <div class="field-group">
        <label for="username-input">${this.t.adminUsername}</label>
        <input
          id="username-input"
          type="text"
          .value="${this._usernameInput}"
          @input="${this._handleUsernameChange}"
          autocomplete="username"
        />
      </div>
      <div class="field-group">
        <label for="password-input">${this.t.adminPassword}</label>
        <input
          id="password-input"
          type="password"
          .value="${this._passwordInput}"
          @input="${this._handlePasswordChange}"
          autocomplete="new-password"
        />
        <div class="help-text">${this.t.passwordHelp}</div>
        ${strength.score > 0
          ? html`
              <div
                class="strength-meter"
                role="meter"
                aria-valuemin="0"
                aria-valuemax="4"
                aria-valuenow="${strength.score}"
                aria-label="${this.t.passwordStrength}"
              >
                <div class="strength-bar strength-${strength.score}"></div>
                <span class="strength-label">${this.t[strength.labelKey]}</span>
              </div>
            `
          : ""}
      </div>
      <div class="field-group">
        <label for="confirm-password-input">${this.t.confirmPassword}</label>
        <input
          id="confirm-password-input"
          type="password"
          .value="${this._confirmPasswordInput}"
          @input="${this._handleConfirmPasswordChange}"
          autocomplete="new-password"
        />
        ${this._confirmPasswordInput !== ""
          ? html`
              <div
                class="confirm-feedback ${this._passwordMismatch
                  ? "mismatch"
                  : "match"}"
              >
                ${this._passwordMismatch
                  ? this.t.passwordsDoNotMatch
                  : this.t.passwordsMatch}
              </div>
            `
          : ""}
      </div>
      <div class="btn-row">
        <button
          class="btn btn-secondary"
          @click="${() => this._goToStep(2)}"
        >
          <simple-icon-lite
            icon="icons:arrow-back"
            style="--simple-icon-width: var(--ddd-icon-4xs); --simple-icon-height: var(--ddd-icon-4xs);"
          ></simple-icon-lite>
          ${this.t.back}
        </button>
        <button class="btn btn-primary" @click="${this._handleStep3Submit}">
          ${this.t.saveAndInstall}
        </button>
      </div>
    `;
  }

  renderStep4() {
    const creds =
      (this.stateData && this.stateData.credentials) || {};
    const username = creds.username || this._usernameInput || "admin";
    const password = creds.password || "";
    const passwordWasGenerated = !!creds.passwordWasGenerated;
    return html`
      <h2>${this.t.startHaxcms}</h2>
      <p class="description">${this.t.installationComplete}</p>
      <div class="important-banner">
        <simple-icon-lite icon="icons:warning"></simple-icon-lite>
        <span>${this.t.saveCredentialsWarning}</span>
      </div>
      <div class="credentials-box">
        <div class="credential-row">
          <span class="credential-label">${this.t.username}</span>
          <span class="credential-value">${username}</span>
          <button
            class="copy-btn ${this._copiedField === "username"
              ? "copied"
              : ""}"
            @click="${() => this._copyToClipboard(username, "username")}"
            title="${this.t.copy}"
          >
            <simple-icon-lite
              icon="${this._copiedField === "username"
                ? "icons:check"
                : "icons:content-copy"}"
            ></simple-icon-lite>
          </button>
        </div>
        <div class="credential-row">
          <span class="credential-label">
            ${this.t.password}
            ${passwordWasGenerated
              ? html`<span class="generated-tag"
                  >${this.t.autoGenerated}</span
                >`
              : ""}
          </span>
          <span class="credential-value"
            >${this._passwordRevealed ? password : "••••••••••••"}</span
          >
          <button
            class="copy-btn reveal-btn"
            @click="${this._togglePasswordReveal}"
            title="${this._passwordRevealed ? this.t.hide : this.t.show}"
            aria-label="${this._passwordRevealed ? this.t.hide : this.t.show}"
            aria-pressed="${this._passwordRevealed ? "true" : "false"}"
          >
            <simple-icon-lite
              icon="${this._passwordRevealed
                ? "icons:visibility-off"
                : "icons:visibility"}"
            ></simple-icon-lite>
          </button>
          <button
            class="copy-btn ${this._copiedField === "password"
              ? "copied"
              : ""}"
            @click="${() => this._copyToClipboard(password, "password")}"
            title="${this.t.copy}"
          >
            <simple-icon-lite
              icon="${this._copiedField === "password"
                ? "icons:check"
                : "icons:content-copy"}"
            ></simple-icon-lite>
          </button>
        </div>
      </div>
      <a class="start-hax-btn" href="index.php">
        <simple-icon-lite icon="hax:hax2022"></simple-icon-lite>
        ${this.t.startHaxcms}
      </a>
    `;
  }

  renderError() {
    return html`
      <div class="error-box">
        <simple-icon-lite icon="icons:error"></simple-icon-lite>
        <h2>${this.t.anErrorOccurred}</h2>
        <p>${this.error}</p>
        <button class="btn btn-primary" @click="${() => this.fetchState()}">
          <simple-icon-lite
            icon="icons:refresh"
            style="--simple-icon-width: var(--ddd-icon-4xs); --simple-icon-height: var(--ddd-icon-4xs);"
          ></simple-icon-lite>
          ${this.t.retry}
        </button>
      </div>
    `;
  }

  renderLoading() {
    return html`
      <div class="loading-overlay">
        <simple-icon-lite icon="icons:loop"></simple-icon-lite>
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
