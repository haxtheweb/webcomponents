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
      html`<hax-app-installer
        api-endpoint="mock://test"
      ></hax-app-installer>`,
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
    expect(element.t.step1_title).to.equal("Choose language");
    expect(element.t.step2_needsConfig).to.equal(
      "Requirements needing configuration",
    );
    expect(element.t.step3_username).to.equal("Admin username");
    expect(element.t.step4_startHax).to.equal("Start with HAX");
    expect(element.t.error_retry).to.equal("Retry");
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
