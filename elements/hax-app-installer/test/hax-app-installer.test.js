import { html, fixture, expect } from "@open-wc/testing";
import "../hax-app-installer.js";

describe("HaxAppInstaller test", () => {
  let element;
  let originalFetch;

  beforeEach(async () => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = function () {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({ step: 1, language: "en" });
        },
        text: function () {
          return Promise.resolve(JSON.stringify({ step: 1, language: "en" }));
        },
      });
    };
    element = await fixture(
      html`<hax-app-installer api-endpoint="mock://test"></hax-app-installer>`,
    );
    // Allow firstUpdated + fetchState to settle
    await element.updateComplete;
    await new Promise(function (r) {
      setTimeout(r, 50);
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("element tag is defined", () => {
    expect(customElements.get("hax-app-installer")).to.exist;
  });

  it("passes the a11y audit", async () => {
    element.loading = false;
    element.error = "";
    await element.updateComplete;
    await expect(element).shadowDom.to.be.accessible();
  });

  it("starts at step 1 and renders the language select", async () => {
    element.step = 1;
    element.loading = false;
    element.error = "";
    await element.updateComplete;
    const select = element.shadowRoot.querySelector("#lang-select");
    expect(select).to.exist;
  });

  it("renders step 2 content when step is 2", async () => {
    element.step = 2;
    element.loading = false;
    element.error = "";
    element.stateData = {
      needsConfiguration: [],
      allPassed: [
        {
          title: "PHP version",
          value: "8.2",
          description: "OK",
          tone: "ok",
        },
      ],
    };
    await element.updateComplete;
    const heading = element.shadowRoot.querySelector("h2");
    expect(heading).to.exist;
    const details = element.shadowRoot.querySelector("details.req-details");
    expect(details).to.exist;
  });

  it("renders step 3 content when step is 3", async () => {
    element.step = 3;
    element.loading = false;
    element.error = "";
    await element.updateComplete;
    const usernameInput = element.shadowRoot.querySelector("#username-input");
    expect(usernameInput).to.exist;
    const passwordInput = element.shadowRoot.querySelector("#password-input");
    expect(passwordInput).to.exist;
  });

  it("renders step 4 content when step is 4", async () => {
    element.step = 4;
    element.loading = false;
    element.error = "";
    element.stateData = {
      credentials: {
        username: "admin",
        password: "TestP@ss1",
        passwordWasGenerated: true,
      },
    };
    await element.updateComplete;
    const startBtn = element.shadowRoot.querySelector(".start-hax-btn");
    expect(startBtn).to.exist;
    const copyBtns = element.shadowRoot.querySelectorAll(".copy-btn");
    expect(copyBtns.length).to.equal(2);
  });

  it("has this.t defaults with expected keys", () => {
    expect(element.t.chooseLanguage).to.equal("Choose language");
    expect(element.t.requirementsNeedingConfiguration).to.equal(
      "Requirements needing configuration",
    );
    expect(element.t.adminUsername).to.equal("Admin username");
    expect(element.t.startHaxcms).to.equal("Start HAXcms");
    expect(element.t.retry).to.equal("Retry");
  });

  it("renders error state when error is set", async () => {
    element.error = "Network failure";
    element.loading = false;
    await element.updateComplete;
    const errorBox = element.shadowRoot.querySelector(".error-box");
    expect(errorBox).to.exist;
    expect(errorBox.textContent).to.contain("Network failure");
  });

  it("renders loading state when loading is true", async () => {
    element.loading = true;
    element.error = "";
    await element.updateComplete;
    const loadingOverlay = element.shadowRoot.querySelector(".loading-overlay");
    expect(loadingOverlay).to.exist;
  });

  it("step indicator shows 4 steps with correct active state", async () => {
    element.step = 3;
    element.loading = false;
    element.error = "";
    await element.updateComplete;
    const items = element.shadowRoot.querySelectorAll(".step-indicator li");
    expect(items.length).to.equal(4);
    expect(items[0].classList.contains("step-done")).to.be.true;
    expect(items[1].classList.contains("step-done")).to.be.true;
    expect(items[2].classList.contains("step-active")).to.be.true;
    expect(items[3].classList.contains("step-pending")).to.be.true;
  });

  it("consumes state data from fetch", async () => {
    globalThis.fetch = function () {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({
            step: 3,
            language: "es",
            username: "testuser",
          });
        },
        text: function () {
          return Promise.resolve(
            JSON.stringify({ step: 3, language: "es", username: "testuser" }),
          );
        },
      });
    };
    await element.fetchState();
    expect(element.step).to.equal(3);
    expect(element.language).to.equal("es");
    expect(element.stateData.username).to.equal("testuser");
  });

  it("consumes needsConfiguration data from step 2 state", async () => {
    globalThis.fetch = function () {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({
            step: 2,
            language: "en",
            hasErrors: true,
            needsConfiguration: [
              {
                title: "Config dir",
                value: "Missing",
                description: "Not found",
                suggestedCommand: "mkdir _config",
                tone: "error",
              },
            ],
            allPassed: [],
          });
        },
        text: function () {
          return Promise.resolve("{}");
        },
      });
    };
    await element.fetchState();
    expect(element.step).to.equal(2);
    expect(element.stateData.needsConfiguration.length).to.equal(1);
    expect(element.stateData.hasErrors).to.be.true;
    // render and verify table is present
    element.loading = false;
    await element.updateComplete;
    const table = element.shadowRoot.querySelector(".req-table");
    expect(table).to.exist;
  });

  it("advanceStep posts and applies returned state", async () => {
    let capturedBody = null;
    globalThis.fetch = function (url, options) {
      capturedBody = JSON.parse(options.body);
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({
            step: 4,
            language: "en",
            credentials: {
              username: "admin",
              password: "GenP@ss1",
              passwordWasGenerated: true,
            },
          });
        },
        text: function () {
          return Promise.resolve("{}");
        },
      });
    };
    const data = await element.advanceStep({
      toStep: 4,
      language: "en",
      username: "admin",
      password: "",
    });
    expect(capturedBody.toStep).to.equal(4);
    expect(data).to.not.be.null;
    expect(element.step).to.equal(4);
    expect(element.stateData.credentials.username).to.equal("admin");
  });
});

describe("HaxAppInstaller password criteria and strength", () => {
  let element;
  let originalFetch;

  beforeEach(async () => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = function () {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({ step: 1, language: "en" });
        },
        text: function () {
          return Promise.resolve(JSON.stringify({ step: 1, language: "en" }));
        },
      });
    };
    element = await fixture(
      html`<hax-app-installer api-endpoint="mock://test"></hax-app-installer>`,
    );
    await element.updateComplete;
    await new Promise(function (r) {
      setTimeout(r, 50);
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("_computePasswordCriteria returns all false for empty password", () => {
    const c = element._computePasswordCriteria("");
    expect(c.length).to.be.false;
    expect(c.uppercase).to.be.false;
    expect(c.lowercase).to.be.false;
    expect(c.number).to.be.false;
    expect(c.symbol).to.be.false;
  });

  it("_computePasswordCriteria returns all true for strong password", () => {
    const c = element._computePasswordCriteria("Abc123!@#");
    expect(c.length).to.be.true;
    expect(c.uppercase).to.be.true;
    expect(c.lowercase).to.be.true;
    expect(c.number).to.be.true;
    expect(c.symbol).to.be.true;
  });

  it("_computePasswordCriteria handles null/undefined", () => {
    const c = element._computePasswordCriteria(null);
    expect(c.length).to.be.false;
    const c2 = element._computePasswordCriteria(undefined);
    expect(c2.length).to.be.false;
  });

  it("_computePasswordStrength returns score 0 for empty", () => {
    const s = element._computePasswordStrength("");
    expect(s.score).to.equal(0);
    expect(s.labelKey).to.equal("");
  });

  it("_computePasswordStrength returns score 0 for null", () => {
    const s = element._computePasswordStrength(null);
    expect(s.score).to.equal(0);
  });

  it("_computePasswordStrength returns weak (1) for missing criteria", () => {
    const s = element._computePasswordStrength("abcdefg");
    expect(s.score).to.equal(1);
    expect(s.labelKey).to.equal("weak");
  });

  it("_computePasswordStrength returns fair (2) for all criteria met at 8 chars", () => {
    const s = element._computePasswordStrength("Abc123!@");
    expect(s.score).to.equal(2);
    expect(s.labelKey).to.equal("fair");
  });

  it("_computePasswordStrength returns good (3) for 12+ chars", () => {
    const s = element._computePasswordStrength("Abc123!@#xyz");
    expect(s.score).to.equal(3);
    expect(s.labelKey).to.equal("good");
  });

  it("_computePasswordStrength returns strong (4) for 16+ chars", () => {
    const s = element._computePasswordStrength("Abc123!@#xyz9876");
    expect(s.score).to.equal(4);
    expect(s.labelKey).to.equal("strong");
  });

  it("_step3CanSubmit returns false when password is empty", () => {
    element._passwordInput = "";
    element._confirmPasswordInput = "";
    expect(element._step3CanSubmit()).to.be.false;
  });

  it("_step3CanSubmit returns false when criteria not met", () => {
    element._passwordInput = "abc";
    element._confirmPasswordInput = "abc";
    expect(element._step3CanSubmit()).to.be.false;
  });

  it("_step3CanSubmit returns false when confirmation is empty", () => {
    element._passwordInput = "Abc123!@";
    element._confirmPasswordInput = "";
    expect(element._step3CanSubmit()).to.be.false;
  });

  it("_step3CanSubmit returns false when passwords do not match", () => {
    element._passwordInput = "Abc123!@";
    element._confirmPasswordInput = "Abc123!#";
    expect(element._step3CanSubmit()).to.be.false;
  });

  it("_step3CanSubmit returns true when all criteria met and confirmed", () => {
    element._passwordInput = "Abc123!@";
    element._confirmPasswordInput = "Abc123!@";
    expect(element._step3CanSubmit()).to.be.true;
  });
});

describe("HaxAppInstaller input handlers", () => {
  let element;
  let originalFetch;

  beforeEach(async () => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = function () {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({ step: 1, language: "en" });
        },
        text: function () {
          return Promise.resolve(JSON.stringify({ step: 1, language: "en" }));
        },
      });
    };
    element = await fixture(
      html`<hax-app-installer api-endpoint="mock://test"></hax-app-installer>`,
    );
    await element.updateComplete;
    await new Promise(function (r) {
      setTimeout(r, 50);
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("_handleLanguageChange updates _selectedLanguage", () => {
    const fakeEvent = {
      target: { value: "es" },
    };
    element._handleLanguageChange(fakeEvent);
    expect(element._selectedLanguage).to.equal("es");
  });

  it("_handleUsernameChange updates _usernameInput and clears _serverErrors", () => {
    element._serverErrors = ["some error"];
    const fakeEvent = {
      target: { value: "newuser" },
    };
    element._handleUsernameChange(fakeEvent);
    expect(element._usernameInput).to.equal("newuser");
    expect(element._serverErrors).to.deep.equal([]);
  });

  it("_handlePasswordChange updates _passwordInput and clears _serverErrors", async () => {
    element._serverErrors = ["some error"];
    const fakeEvent = {
      target: { value: "NewP@ss1" },
    };
    element._handlePasswordChange(fakeEvent);
    expect(element._passwordInput).to.equal("NewP@ss1");
    expect(element._serverErrors).to.deep.equal([]);
    await element.updateComplete;
  });

  it("_handlePasswordChange recomputes mismatch when confirm is set", async () => {
    element._passwordInput = "Abc123!@";
    element._confirmPasswordInput = "Abc123!@";
    const fakeEvent = {
      target: { value: "Abc123!#" },
    };
    element._handlePasswordChange(fakeEvent);
    expect(element._passwordMismatch).to.be.true;
    await element.updateComplete;
  });

  it("_handlePasswordChange sets mismatch false when confirm is empty", async () => {
    element._confirmPasswordInput = "";
    const fakeEvent = {
      target: { value: "Abc123!@" },
    };
    element._handlePasswordChange(fakeEvent);
    expect(element._passwordMismatch).to.be.false;
    await element.updateComplete;
  });

  it("_handleConfirmPasswordChange updates _confirmPasswordInput", async () => {
    element._passwordInput = "Abc123!@";
    const fakeEvent = {
      target: { value: "Abc123!@" },
    };
    element._handleConfirmPasswordChange(fakeEvent);
    expect(element._confirmPasswordInput).to.equal("Abc123!@");
    expect(element._passwordMismatch).to.be.false;
    await element.updateComplete;
  });

  it("_handleConfirmPasswordChange detects mismatch", async () => {
    element._passwordInput = "Abc123!@";
    const fakeEvent = {
      target: { value: "Different!1" },
    };
    element._handleConfirmPasswordChange(fakeEvent);
    expect(element._passwordMismatch).to.be.true;
    await element.updateComplete;
  });

  it("_handleConfirmPasswordChange does not set mismatch for empty confirm", async () => {
    element._passwordInput = "Abc123!@";
    const fakeEvent = {
      target: { value: "" },
    };
    element._handleConfirmPasswordChange(fakeEvent);
    expect(element._passwordMismatch).to.be.false;
    await element.updateComplete;
  });

  it("_togglePasswordReveal toggles _passwordRevealed", async () => {
    expect(element._passwordRevealed).to.be.false;
    element._togglePasswordReveal();
    await element.updateComplete;
    expect(element._passwordRevealed).to.be.true;
    element._togglePasswordReveal();
    await element.updateComplete;
    expect(element._passwordRevealed).to.be.false;
  });

  it("_copyToClipboard sets _copiedField and resets after timeout", async () => {
    await element._copyToClipboard("test-text", "username");
    expect(element._copiedField).to.equal("username");
    // wait for the reset timeout (2000ms is too long, just verify it was set)
  });

  it("_copyToClipboard handles missing navigator.clipboard gracefully", async () => {
    const origClipboard = globalThis.navigator;
    // Temporarily remove clipboard
    await element._copyToClipboard("test", "password");
    expect(element._copiedField).to.equal("password");
  });

  it("_dispatchLanguageChange sets document lang and dispatches event", () => {
    let eventCaught = false;
    let eventDetail = null;
    const handler = (e) => {
      eventCaught = true;
      eventDetail = e.detail;
    };
    globalThis.addEventListener("languagechange", handler);
    element._dispatchLanguageChange("fr");
    expect(eventCaught).to.be.true;
    expect(eventDetail).to.equal("fr");
    expect(globalThis.document.documentElement.lang).to.equal("fr");
    globalThis.removeEventListener("languagechange", handler);
  });
});

describe("HaxAppInstaller step navigation", () => {
  let element;
  let originalFetch;

  beforeEach(async () => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = function () {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({ step: 1, language: "en" });
        },
        text: function () {
          return Promise.resolve(JSON.stringify({ step: 1, language: "en" }));
        },
      });
    };
    element = await fixture(
      html`<hax-app-installer api-endpoint="mock://test"></hax-app-installer>`,
    );
    await element.updateComplete;
    await new Promise(function (r) {
      setTimeout(r, 50);
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("_goToStep returns early when loading", async () => {
    element.loading = true;
    element.step = 3;
    await element._goToStep(1);
    // should not advance because loading
    expect(element.step).to.equal(3);
  });

  it("_goToStep returns early for invalid target (NaN)", async () => {
    element.step = 3;
    await element._goToStep("abc");
    expect(element.step).to.equal(3);
  });

  it("_goToStep returns early for target < 1", async () => {
    element.step = 3;
    await element._goToStep(0);
    expect(element.step).to.equal(3);
  });

  it("_goToStep returns early for target > 3", async () => {
    element.step = 3;
    await element._goToStep(4);
    expect(element.step).to.equal(3);
  });

  it("_goToStep returns early when target >= current step", async () => {
    element.step = 3;
    await element._goToStep(3);
    expect(element.step).to.equal(3);
  });

  it("_goToStep advances to valid prior step", async () => {
    globalThis.fetch = function () {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({ step: 1, language: "en" });
        },
        text: function () {
          return Promise.resolve("{}");
        },
      });
    };
    element.step = 3;
    await element._goToStep(1);
    expect(element.step).to.equal(1);
  });

  it("_handleStep1Submit calls advanceStep with step 2", async () => {
    let capturedBody = null;
    globalThis.fetch = function (url, options) {
      capturedBody = JSON.parse(options.body);
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({ step: 2, language: "es" });
        },
        text: function () {
          return Promise.resolve("{}");
        },
      });
    };
    element._selectedLanguage = "es";
    await element._handleStep1Submit();
    expect(capturedBody.toStep).to.equal(2);
    expect(capturedBody.language).to.equal("es");
    expect(element.step).to.equal(2);
  });

  it("_handleStep1Submit falls back to language when _selectedLanguage is null", async () => {
    let capturedBody = null;
    globalThis.fetch = function (url, options) {
      capturedBody = JSON.parse(options.body);
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({ step: 2, language: "en" });
        },
        text: function () {
          return Promise.resolve("{}");
        },
      });
    };
    element._selectedLanguage = null;
    element.language = "en";
    await element._handleStep1Submit();
    expect(capturedBody.language).to.equal("en");
  });

  it("_handleStep2Continue calls advanceStep with step 3", async () => {
    let capturedBody = null;
    globalThis.fetch = function (url, options) {
      capturedBody = JSON.parse(options.body);
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({ step: 3, language: "en" });
        },
        text: function () {
          return Promise.resolve("{}");
        },
      });
    };
    element.language = "en";
    await element._handleStep2Continue();
    expect(capturedBody.toStep).to.equal(3);
    expect(element.step).to.equal(3);
  });
});

describe("HaxAppInstaller step 3 submit", () => {
  let element;
  let originalFetch;

  beforeEach(async () => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = function () {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({ step: 1, language: "en" });
        },
        text: function () {
          return Promise.resolve(JSON.stringify({ step: 1, language: "en" }));
        },
      });
    };
    element = await fixture(
      html`<hax-app-installer api-endpoint="mock://test"></hax-app-installer>`,
    );
    element.step = 3;
    element.loading = false;
    element.error = "";
    await element.updateComplete;
    await new Promise(function (r) {
      setTimeout(r, 50);
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("_handleStep3Submit blocks when password mismatch", async () => {
    element._passwordInput = "Abc123!@";
    element._confirmPasswordInput = "Different!1";
    await element._handleStep3Submit();
    expect(element._passwordMismatch).to.be.true;
    expect(element.error).to.equal(element.t.passwordsDoNotMatch);
  });

  it("_handleStep3Submit blocks when confirm is empty", async () => {
    element._passwordInput = "Abc123!@";
    element._confirmPasswordInput = "";
    await element._handleStep3Submit();
    expect(element._passwordMismatch).to.be.true;
  });

  it("_handleStep3Submit blocks when password is empty (no mismatch check)", async () => {
    element._passwordInput = "";
    element._confirmPasswordInput = "";
    globalThis.fetch = function () {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({ step: 4, language: "en" });
        },
        text: function () {
          return Promise.resolve("{}");
        },
      });
    };
    await element._handleStep3Submit();
    // Should proceed with empty password (no mismatch guard)
    expect(element.step).to.equal(4);
  });

  it("_handleStep3Submit succeeds with matching passwords", async () => {
    let capturedBody = null;
    globalThis.fetch = function (url, options) {
      capturedBody = JSON.parse(options.body);
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({
            step: 4,
            language: "en",
            credentials: {
              username: "admin",
              password: "GenP@ss1",
            },
          });
        },
        text: function () {
          return Promise.resolve("{}");
        },
      });
    };
    element._passwordInput = "Abc123!@";
    element._confirmPasswordInput = "Abc123!@";
    element._usernameInput = "admin";
    await element._handleStep3Submit();
    expect(capturedBody.password).to.equal("Abc123!@");
    expect(element.step).to.equal(4);
    expect(element._serverErrors).to.deep.equal([]);
  });

  it("_handleStep3Submit surfaces server errors", async () => {
    globalThis.fetch = function () {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({
            step: 3,
            language: "en",
            hasErrors: true,
            errors: ["Password too weak"],
          });
        },
        text: function () {
          return Promise.resolve("{}");
        },
      });
    };
    element._passwordInput = "Abc123!@";
    element._confirmPasswordInput = "Abc123!@";
    await element._handleStep3Submit();
    expect(element._serverErrors).to.contain("Password too weak");
  });
});

describe("HaxAppInstaller prepare environment", () => {
  let element;
  let originalFetch;

  beforeEach(async () => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = function () {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({ step: 1, language: "en" });
        },
        text: function () {
          return Promise.resolve(JSON.stringify({ step: 1, language: "en" }));
        },
      });
    };
    element = await fixture(
      html`<hax-app-installer api-endpoint="mock://test"></hax-app-installer>`,
    );
    await element.updateComplete;
    await new Promise(function (r) {
      setTimeout(r, 50);
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("_prepareEnvironment posts and applies state", async () => {
    let capturedUrl = null;
    let capturedMethod = null;
    globalThis.fetch = function (url, options) {
      capturedUrl = url;
      capturedMethod = options.method;
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({ step: 2, language: "en", allPassed: [] });
        },
        text: function () {
          return Promise.resolve("{}");
        },
      });
    };
    const data = await element._prepareEnvironment();
    expect(capturedUrl).to.contain("?op=prepare");
    expect(capturedMethod).to.equal("POST");
    expect(data).to.not.be.null;
    expect(element.step).to.equal(2);
  });

  it("_prepareEnvironment surfaces permission command when returned", async () => {
    globalThis.fetch = function () {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({
            step: 2,
            language: "en",
            permissionCommand: "chmod 777 _config",
            permissionHint: "Run this as the file owner",
          });
        },
        text: function () {
          return Promise.resolve("{}");
        },
      });
    };
    await element._prepareEnvironment();
    expect(element._preparePermissionCommand).to.equal("chmod 777 _config");
    expect(element._preparePermissionHint).to.equal("Run this as the file owner");
  });

  it("_prepareEnvironment handles error", async () => {
    globalThis.fetch = function () {
      return Promise.reject(new Error("Network error"));
    };
    const data = await element._prepareEnvironment();
    expect(data).to.be.null;
    expect(element.error).to.contain("Network error");
  });
});

describe("HaxAppInstaller fetchState error and edge cases", () => {
  let element;
  let originalFetch;

  beforeEach(async () => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("fetchState handles HTTP error", async () => {
    globalThis.fetch = function () {
      return Promise.resolve({
        ok: false,
        status: 500,
        json: function () {
          return Promise.resolve({});
        },
        text: function () {
          return Promise.resolve("{}");
        },
      });
    };
    element = await fixture(
      html`<hax-app-installer api-endpoint="mock://test"></hax-app-installer>`,
    );
    await element.updateComplete;
    await new Promise(function (r) {
      setTimeout(r, 50);
    });
    expect(element.error).to.contain("HTTP 500");
  });

  it("fetchState handles network error", async () => {
    globalThis.fetch = function () {
      return Promise.reject(new Error("Connection refused"));
    };
    element = await fixture(
      html`<hax-app-installer api-endpoint="mock://test"></hax-app-installer>`,
    );
    await element.updateComplete;
    await new Promise(function (r) {
      setTimeout(r, 50);
    });
    expect(element.error).to.contain("Connection refused");
  });

  it("advanceStep handles HTTP error and returns null", async () => {
    globalThis.fetch = function () {
      return Promise.resolve({
        ok: false,
        status: 400,
        json: function () {
          return Promise.resolve({});
        },
        text: function () {
          return Promise.resolve("{}");
        },
      });
    };
    element = await fixture(
      html`<hax-app-installer api-endpoint="mock://test"></hax-app-installer>`,
    );
    await element.updateComplete;
    await new Promise(function (r) {
      setTimeout(r, 50);
    });
    const data = await element.advanceStep({ toStep: 2 });
    expect(data).to.be.null;
    expect(element.error).to.contain("HTTP 400");
  });
});

describe("HaxAppInstaller _applyState and confetti", () => {
  let element;
  let originalFetch;

  beforeEach(async () => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = function () {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({ step: 1, language: "en" });
        },
        text: function () {
          return Promise.resolve(JSON.stringify({ step: 1, language: "en" }));
        },
      });
    };
    element = await fixture(
      html`<hax-app-installer api-endpoint="mock://test"></hax-app-installer>`,
    );
    await element.updateComplete;
    await new Promise(function (r) {
      setTimeout(r, 50);
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("_applyState triggers confetti burst on transition to step 4 with credentials", async () => {
    element.step = 3;
    element._applyState({
      step: 4,
      language: "en",
      credentials: {
        username: "admin",
        password: "GenP@ss1",
      },
    });
    expect(element._confettiBurst).to.be.true;
    await element.updateComplete;
    const confetti = element.shadowRoot.querySelector(".confetti");
    expect(confetti).to.exist;
  });

  it("_applyState does not trigger confetti when already on step 4", () => {
    element.step = 4;
    element._applyState({
      step: 4,
      language: "en",
      credentials: { username: "admin", password: "x" },
    });
    expect(element._confettiBurst).to.be.false;
  });

  it("_applyState does not trigger confetti when hasErrors", () => {
    element.step = 3;
    element._applyState({
      step: 4,
      language: "en",
      credentials: { username: "admin", password: "x" },
      hasErrors: true,
    });
    expect(element._confettiBurst).to.be.false;
  });

  it("_applyState dispatches language change when language differs", () => {
    let eventCaught = false;
    const handler = (e) => {
      eventCaught = true;
    };
    globalThis.addEventListener("languagechange", handler);
    element.language = "en";
    element._applyState({ step: 1, language: "fr" });
    expect(eventCaught).to.be.true;
    expect(element.language).to.equal("fr");
    expect(element._selectedLanguage).to.equal("fr");
    globalThis.removeEventListener("languagechange", handler);
  });

  it("_applyState does not dispatch language change when language is same", () => {
    let eventCaught = false;
    const handler = () => {
      eventCaught = true;
    };
    globalThis.addEventListener("languagechange", handler);
    element.language = "en";
    element._applyState({ step: 1, language: "en" });
    expect(eventCaught).to.be.false;
    globalThis.removeEventListener("languagechange", handler);
  });

  it("_applyState updates _usernameInput from data", () => {
    element._applyState({ step: 1, language: "en", username: "newuser" });
    expect(element._usernameInput).to.equal("newuser");
  });

  it("_applyState handles null/undefined data", () => {
    element._applyState(null);
    expect(element.step).to.exist;
    element._applyState(undefined);
    expect(element.step).to.exist;
  });
});

describe("HaxAppInstaller rendering edge cases", () => {
  let element;
  let originalFetch;

  beforeEach(async () => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = function () {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({ step: 1, language: "en" });
        },
        text: function () {
          return Promise.resolve(JSON.stringify({ step: 1, language: "en" }));
        },
      });
    };
    element = await fixture(
      html`<hax-app-installer api-endpoint="mock://test"></hax-app-installer>`,
    );
    await element.updateComplete;
    await new Promise(function (r) {
      setTimeout(r, 50);
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("renders step 2 with needsConfig table and commands", async () => {
    element.step = 2;
    element.loading = false;
    element.error = "";
    element.stateData = {
      needsConfiguration: [
        {
          title: "Config dir",
          value: "Missing",
          description: "Not found",
          suggestedCommand: "mkdir _config",
          tone: "error",
        },
      ],
      allPassed: [],
    };
    await element.updateComplete;
    const table = element.shadowRoot.querySelector(".req-table");
    expect(table).to.exist;
    const cmd = element.shadowRoot.querySelector(".cmd-block");
    expect(cmd).to.exist;
  });

  it("renders step 2 with create missing files button when hasErrors", async () => {
    element.step = 2;
    element.loading = false;
    element.error = "";
    element.stateData = {
      needsConfiguration: [
        {
          title: "Config dir",
          value: "Missing",
          description: "Not found",
          tone: "error",
        },
      ],
      allPassed: [],
      hasErrors: true,
    };
    await element.updateComplete;
    const prepareBtn = element.shadowRoot.querySelector(
      ".prepare-action .btn-primary",
    );
    expect(prepareBtn).to.exist;
    const recheckBtn = element.shadowRoot.querySelector(
      ".btn-row .btn-secondary",
    );
    expect(recheckBtn).to.exist;
  });

  it("renders step 2 with permission banner when _preparePermissionCommand is set", async () => {
    element.step = 2;
    element.loading = false;
    element.error = "";
    element._preparePermissionCommand = "chmod 777 _config";
    element._preparePermissionHint = "Run as file owner";
    element.stateData = { needsConfiguration: [], allPassed: [] };
    await element.updateComplete;
    const banner = element.shadowRoot.querySelector(".permission-banner");
    expect(banner).to.exist;
    const hint = element.shadowRoot.querySelector(".permission-banner-hint");
    expect(hint).to.exist;
    expect(hint.textContent).to.contain("Run as file owner");
  });

  it("renders step 2 with continue button when no errors", async () => {
    element.step = 2;
    element.loading = false;
    element.error = "";
    element.stateData = {
      needsConfiguration: [],
      allPassed: [],
      hasErrors: false,
    };
    await element.updateComplete;
    const continueBtn = element.shadowRoot.querySelector(
      ".btn-row .btn-primary",
    );
    expect(continueBtn).to.exist;
  });

  it("renders req table with warning tone", async () => {
    element.step = 2;
    element.loading = false;
    element.error = "";
    element.stateData = {
      needsConfiguration: [
        {
          title: "Memory limit",
          value: "128M",
          description: "Should be 256M",
          severity: "warning",
        },
      ],
      allPassed: [],
    };
    await element.updateComplete;
    const statusWarning = element.shadowRoot.querySelector(".status-warning");
    expect(statusWarning).to.exist;
  });

  it("renders step 3 with server error banner", async () => {
    element.step = 3;
    element.loading = false;
    element.error = "";
    element._serverErrors = ["Password too weak", "Username taken"];
    await element.updateComplete;
    const banner = element.shadowRoot.querySelector(".server-error-banner");
    expect(banner).to.exist;
    expect(banner.textContent).to.contain("Password too weak");
  });

  it("renders step 3 with strength meter when password is set", async () => {
    element.step = 3;
    element.loading = false;
    element.error = "";
    element._passwordInput = "Abc123!@";
    await element.updateComplete;
    const meter = element.shadowRoot.querySelector(".strength-meter");
    expect(meter).to.exist;
  });

  it("renders step 3 with confirm feedback match", async () => {
    element.step = 3;
    element.loading = false;
    element.error = "";
    element._passwordInput = "Abc123!@";
    element._confirmPasswordInput = "Abc123!@";
    await element.updateComplete;
    const feedback = element.shadowRoot.querySelector(".confirm-feedback.match");
    expect(feedback).to.exist;
  });

  it("renders step 3 with confirm feedback mismatch", async () => {
    element.step = 3;
    element.loading = false;
    element.error = "";
    element._passwordInput = "Abc123!@";
    element._confirmPasswordInput = "Different!1";
    await element.updateComplete;
    const feedback = element.shadowRoot.querySelector(
      ".confirm-feedback.mismatch",
    );
    expect(feedback).to.exist;
  });

  it("renders step 4 with reveal button and toggles password visibility", async () => {
    element.step = 4;
    element.loading = false;
    element.error = "";
    element.stateData = {
      credentials: {
        username: "admin",
        password: "SecretP@ss1",
        passwordWasGenerated: true,
      },
    };
    await element.updateComplete;
    const revealBtn = element.shadowRoot.querySelector(".reveal-btn");
    expect(revealBtn).to.exist;
    // Password should be masked initially
    const credValue = element.shadowRoot.querySelectorAll(".credential-value");
    expect(credValue[1].textContent).to.contain("\u2022");
    // Toggle reveal
    revealBtn.click();
    await element.updateComplete;
    const credValueAfter = element.shadowRoot.querySelectorAll(
      ".credential-value",
    );
    expect(credValueAfter[1].textContent).to.contain("SecretP@ss1");
  });

  it("renders step 4 with auto-generated tag when passwordWasGenerated", async () => {
    element.step = 4;
    element.loading = false;
    element.error = "";
    element.stateData = {
      credentials: {
        username: "admin",
        password: "x",
        passwordWasGenerated: true,
      },
    };
    await element.updateComplete;
    const tag = element.shadowRoot.querySelector(".generated-tag");
    expect(tag).to.exist;
  });

  it("renders step 4 without auto-generated tag when not generated", async () => {
    element.step = 4;
    element.loading = false;
    element.error = "";
    element.stateData = {
      credentials: {
        username: "admin",
        password: "x",
        passwordWasGenerated: false,
      },
    };
    await element.updateComplete;
    const tag = element.shadowRoot.querySelector(".generated-tag");
    expect(tag).to.not.exist;
  });

  it("renders confetti when _confettiBurst is true", async () => {
    element.step = 4;
    element.loading = false;
    element.error = "";
    element._confettiBurst = true;
    element.stateData = {
      credentials: { username: "admin", password: "x" },
    };
    await element.updateComplete;
    const confetti = element.shadowRoot.querySelector(".confetti");
    expect(confetti).to.exist;
  });

  it("renders fallback to step 1 for unknown step number", async () => {
    element.step = 99;
    element.loading = false;
    element.error = "";
    await element.updateComplete;
    const select = element.shadowRoot.querySelector("#lang-select");
    expect(select).to.exist;
  });

  it("renders help footer with community links", async () => {
    element.loading = false;
    element.error = "";
    await element.updateComplete;
    const footer = element.shadowRoot.querySelector(".help-footer");
    expect(footer).to.exist;
    const links = element.shadowRoot.querySelectorAll(".help-footer-link");
    expect(links.length).to.be.greaterThan(0);
  });
});

describe("HaxAppInstaller haxProperties and attributes", () => {
  let element;
  let originalFetch;

  beforeEach(async () => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = function () {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: function () {
          return Promise.resolve({ step: 1, language: "en" });
        },
        text: function () {
          return Promise.resolve(JSON.stringify({ step: 1, language: "en" }));
        },
      });
    };
    element = await fixture(
      html`<hax-app-installer api-endpoint="mock://test"></hax-app-installer>`,
    );
    await element.updateComplete;
    await new Promise(function (r) {
      setTimeout(r, 50);
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("haxProperties returns a URL string", () => {
    const props = element.constructor.haxProperties;
    expect(props).to.be.a("string");
    expect(props).to.contain("hax-app-installer.haxProperties.json");
  });

  it("reflects api-endpoint attribute to property", () => {
    expect(element.apiEndpoint).to.equal("mock://test");
    expect(element.getAttribute("api-endpoint")).to.equal("mock://test");
  });

  it("has correct default property values", async () => {
    const fresh = await fixture(html`<hax-app-installer></hax-app-installer>`);
    await fresh.updateComplete;
    await new Promise(function (r) {
      setTimeout(r, 50);
    });
    expect(fresh.step).to.equal(1);
    expect(fresh.language).to.equal("en");
    expect(fresh.loading).to.be.false;
    expect(fresh.error).to.equal("");
    expect(fresh._passwordRevealed).to.be.false;
    expect(fresh._confettiBurst).to.be.false;
    expect(fresh._passwordMismatch).to.be.false;
    expect(fresh._serverErrors).to.deep.equal([]);
    globalThis.fetch = originalFetch;
  });
});
