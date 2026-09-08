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
 * Drupal-style 4-step HAXcms installation wizard.
 * Steps: Choose language, Verify requirements, Configure system, Start HAXing.
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
    this.t = this.t || {};
    this.t = {
      ...this.t,
      installer_title: "HAX Installer",
      loading: "Loading…",
      step1_label: "Choose language",
      step1_title: "Choose language",
      step1_description:
        "Select the language for the installation process and the default site language.",
      step1_continue: "Save and continue",
      step2_label: "Verify requirements",
      step2_title: "Verify requirements",
      step2_description:
        "Check that your server environment meets the requirements for running HAX.",
      step2_needsConfig: "Requirements needing configuration",
      step2_allPassed: "Passed checks",
      step2_recheck: "Re-check requirements",
      step2_continue: "Continue",
      step2_noIssues:
        "All requirements are met. You can continue to the next step.",
      status_requirement: "Requirement",
      status_value: "Value",
      status_description: "Description",
      status_command: "Suggested command",
      step3_label: "Configure system",
      step3_title: "Configure system",
      step3_description:
        "Set up your administrator account for the new HAX site.",
      step3_username: "Admin username",
      step3_password: "Admin password",
      step3_passwordHelp:
        "Leave blank for an auto-generated secure password, or enter 10+ characters with at least one letter and one number.",
      step3_install: "Save and install",
      step4_label: "Start HAXing",
      step4_title: "Start HAXing the web",
      step4_success: "Installation complete! Here are your credentials.",
      step4_username: "Username",
      step4_password: "Password",
      step4_copy: "Copy",
      step4_copied: "Copied!",
      step4_important:
        "Important: Save these credentials now. This is the only time they will be displayed.",
      step4_startHax: "Start with HAX",
      step4_community: "Community",
      step4_docs: "Documentation",
      step4_issues: "Report Issues",
      step4_discord: "Discord",
      step4_github: "GitHub Repository",
      step4_passwordGenerated: "Auto-generated",
      error_title: "An error occurred",
      error_retry: "Retry",
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
          max-width: 600px;
          margin: 0 auto;
          background: light-dark(var(--ddd-accent-6), var(--ddd-primary-4));
          border-radius: var(--ddd-radius-lg);
          box-shadow: var(--ddd-boxShadow-lg);
          overflow: hidden;
        }

        .installer-header {
          background: light-dark(
            var(--ddd-primary-2),
            var(--ddd-primary-3)
          );
          color: var(--ddd-accent-6);
          padding: var(--ddd-spacing-6) var(--ddd-spacing-8);
          text-align: center;
        }

        .installer-header h1 {
          margin: 0;
          font-size: var(--ddd-font-size-m);
          font-weight: var(--ddd-font-weight-bold);
          font-family: var(--ddd-font-secondary);
        }

        .installer-header simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-xl);
          --simple-icon-height: var(--ddd-icon-xl);
          color: var(--ddd-accent-6);
          margin-bottom: var(--ddd-spacing-2);
        }

        .step-indicator {
          list-style: none;
          margin: 0;
          padding: var(--ddd-spacing-4) var(--ddd-spacing-6);
          display: flex;
          justify-content: space-between;
          background: light-dark(
            var(--ddd-accent-2),
            var(--ddd-primary-4)
          );
          border-bottom: var(--ddd-border-xs);
          gap: var(--ddd-spacing-2);
        }

        .step-indicator li {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          position: relative;
          font-size: var(--ddd-font-size-5xs);
        }

        .step-indicator li::after {
          content: "";
          position: absolute;
          top: 10px;
          left: 50%;
          width: 100%;
          height: 2px;
          background: light-dark(
            var(--ddd-primary-5),
            var(--ddd-accent-6)
          );
          z-index: 0;
        }

        .step-indicator li:last-child::after {
          display: none;
        }

        .step-num {
          width: var(--ddd-icon-3xs);
          height: var(--ddd-icon-3xs);
          border-radius: var(--ddd-radius-circle);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-5xs);
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
          margin-top: var(--ddd-spacing-1);
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

        .step-content {
          padding: var(--ddd-spacing-8);
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
          font-size: var(--ddd-font-size-5xs);
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
          color: var(--ddd-primary-22);
        }

        .status-warning {
          color: var(--ddd-primary-23);
        }

        .status-ok {
          color: var(--ddd-primary-25);
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
          color: var(--ddd-primary-25);
          font-weight: var(--ddd-font-weight-medium);
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          margin-bottom: var(--ddd-spacing-6);
        }

        .no-issues simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-sm);
          --simple-icon-height: var(--ddd-icon-sm);
          color: var(--ddd-primary-25);
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
          color: var(--ddd-primary-25);
        }

        .important-banner {
          background: light-dark(
            var(--ddd-theme-default-warningLight),
            var(--ddd-primary-23)
          );
          color: var(--ddd-primary-23);
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
          color: var(--ddd-primary-23);
          flex-shrink: 0;
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
          font-size: var(--ddd-font-size-5xs);
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
          background: var(--ddd-primary-17);
          color: var(--ddd-accent-6);
          border: none;
          border-radius: var(--ddd-radius-md);
          cursor: pointer;
          text-decoration: none;
          transition: all var(--ddd-duration-normal) var(--ddd-timing-ease);
        }

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
          color: var(--ddd-primary-22);
          margin-bottom: var(--ddd-spacing-4);
        }

        .error-box h2 {
          color: var(--ddd-primary-22);
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
          color: var(--ddd-primary-24);
          font-weight: var(--ddd-font-weight-bold);
          margin-left: var(--ddd-spacing-2);
        }

        @media (max-width: 600px) {
          .step-label {
            display: none;
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
   * Handle step 3 submit - save credentials and run install (advance to step 4).
   */
  async _handleStep3Submit() {
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
  }

  render() {
    return html`
      <div class="installer-card">
        <div class="installer-header">
          <simple-icon-lite icon="icons:language"></simple-icon-lite>
          <h1>${this.t.installer_title}</h1>
        </div>
        ${this.renderStepIndicator()}
        <div class="step-content">
          ${this.loading
            ? this.renderLoading()
            : this.error
              ? this.renderError()
              : this.renderStepContent()}
        </div>
      </div>
    `;
  }

  renderStepIndicator() {
    const steps = [
      { num: 1, label: this.t.step1_label },
      { num: 2, label: this.t.step2_label },
      { num: 3, label: this.t.step3_label },
      { num: 4, label: this.t.step4_label },
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
          return html`
            <li class="step-${state}">
              <span class="step-num">
                ${s.num < this.step ? html`✓` : s.num}
              </span>
              <span class="step-label">${s.label}</span>
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
      <h2>${this.t.step1_title}</h2>
      <p class="description">${this.t.step1_description}</p>
      <div class="field-group">
        <label for="lang-select">${this.t.step1_label}</label>
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
          ${this.t.step1_continue}
        </button>
      </div>
    `;
  }

  renderStep2() {
    const needsConfig =
      (this.stateData && this.stateData.needsConfiguration) || [];
    const allPassed = (this.stateData && this.stateData.allPassed) || [];
    return html`
      <h2>${this.t.step2_title}</h2>
      <p class="description">${this.t.step2_description}</p>
      ${needsConfig.length === 0
        ? html`
            <div class="no-issues">
              <simple-icon-lite icon="icons:check-circle"></simple-icon-lite>
              <span>${this.t.step2_noIssues}</span>
            </div>
          `
        : html`
            <div class="req-section">
              <h3>
                <simple-icon-lite
                  icon="icons:error"
                  class="status-error"
                ></simple-icon-lite>
                ${this.t.step2_needsConfig}
              </h3>
              ${this.renderReqTable(needsConfig, true)}
            </div>
          `}
      ${allPassed.length > 0
        ? html`
            <div class="req-section">
              <details class="req-details">
                <summary>
                  ${this.t.step2_allPassed} (${allPassed.length})
                </summary>
                ${this.renderReqTable(allPassed, false)}
              </details>
            </div>
          `
        : ""}
      <div class="btn-row">
        <button
          class="btn btn-secondary"
          @click="${() => this.fetchState()}"
        >
          <simple-icon-lite
            icon="icons:refresh"
            style="--simple-icon-width: var(--ddd-icon-4xs); --simple-icon-height: var(--ddd-icon-4xs);"
          ></simple-icon-lite>
          ${this.t.step2_recheck}
        </button>
        ${needsConfig.length === 0
          ? html`
              <button
                class="btn btn-primary"
                @click="${this._handleStep2Continue}"
              >
                ${this.t.step2_continue}
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
            <th>${this.t.status_requirement}</th>
            <th>${this.t.status_value}</th>
            <th>${this.t.status_description}</th>
            ${showCommand ? html`<th>${this.t.status_command}</th>` : ""}
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
                        ? html`<pre class="cmd-block">
                            ${row.suggestedCommand}
                          </pre>`
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
    return html`
      <h2>${this.t.step3_title}</h2>
      <p class="description">${this.t.step3_description}</p>
      <div class="field-group">
        <label for="username-input">${this.t.step3_username}</label>
        <input
          id="username-input"
          type="text"
          .value="${this._usernameInput}"
          @input="${this._handleUsernameChange}"
          autocomplete="username"
        />
      </div>
      <div class="field-group">
        <label for="password-input">${this.t.step3_password}</label>
        <input
          id="password-input"
          type="password"
          .value="${this._passwordInput}"
          @input="${this._handlePasswordChange}"
          autocomplete="new-password"
        />
        <div class="help-text">${this.t.step3_passwordHelp}</div>
      </div>
      <div class="btn-row">
        <button class="btn btn-primary" @click="${this._handleStep3Submit}">
          ${this.t.step3_install}
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
      <h2>${this.t.step4_title}</h2>
      <p class="description">${this.t.step4_success}</p>
      <div class="important-banner">
        <simple-icon-lite icon="icons:warning"></simple-icon-lite>
        <span>${this.t.step4_important}</span>
      </div>
      <div class="credentials-box">
        <div class="credential-row">
          <span class="credential-label">${this.t.step4_username}</span>
          <span class="credential-value">${username}</span>
          <button
            class="copy-btn ${this._copiedField === "username"
              ? "copied"
              : ""}"
            @click="${() => this._copyToClipboard(username, "username")}"
            title="${this.t.step4_copy}"
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
            ${this.t.step4_password}
            ${passwordWasGenerated
              ? html`<span class="generated-tag"
                  >${this.t.step4_passwordGenerated}</span
                >`
              : ""}
          </span>
          <span class="credential-value">${password}</span>
          <button
            class="copy-btn ${this._copiedField === "password"
              ? "copied"
              : ""}"
            @click="${() => this._copyToClipboard(password, "password")}"
            title="${this.t.step4_copy}"
          >
            <simple-icon-lite
              icon="${this._copiedField === "password"
                ? "icons:check"
                : "icons:content-copy"}"
            ></simple-icon-lite>
          </button>
        </div>
      </div>
      <div class="community-section">
        <h3>${this.t.step4_community}</h3>
        <div class="community-links">
          <a
            class="community-link"
            href="https://haxtheweb.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <simple-icon-lite icon="icons:menu-book"></simple-icon-lite>
            ${this.t.step4_docs}
          </a>
          <a
            class="community-link"
            href="https://github.com/haxtheweb/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            <simple-icon-lite icon="icons:bug-report"></simple-icon-lite>
            ${this.t.step4_issues}
          </a>
          <a
            class="community-link"
            href="https://discord.gg/aCGxmRHEJP"
            target="_blank"
            rel="noopener noreferrer"
          >
            <simple-icon-lite icon="icons:chat"></simple-icon-lite>
            ${this.t.step4_discord}
          </a>
          <a
            class="community-link"
            href="https://github.com/haxtheweb/haxcms-php"
            target="_blank"
            rel="noopener noreferrer"
          >
            <simple-icon-lite icon="icons:code"></simple-icon-lite>
            ${this.t.step4_github}
          </a>
        </div>
      </div>
      <a class="start-hax-btn" href="index.php">
        <simple-icon-lite icon="icons:rocket-launch"></simple-icon-lite>
        ${this.t.step4_startHax}
      </a>
    `;
  }

  renderError() {
    return html`
      <div class="error-box">
        <simple-icon-lite icon="icons:error"></simple-icon-lite>
        <h2>${this.t.error_title}</h2>
        <p>${this.error}</p>
        <button class="btn btn-primary" @click="${() => this.fetchState()}">
          <simple-icon-lite
            icon="icons:refresh"
            style="--simple-icon-width: var(--ddd-icon-4xs); --simple-icon-height: var(--ddd-icon-4xs);"
          ></simple-icon-lite>
          ${this.t.error_retry}
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
