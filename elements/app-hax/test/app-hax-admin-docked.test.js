// System Settings docks below the dashboard bar, as Site Settings does in a
// site: the bar and its user menu stay usable above the dialog, Merlin stays
// above the bar, the dashboard behind is inert, and anything that would
// leave the dialog asks about unsaved changes first.
import { fixture, expect, html, aTimeout } from "@open-wc/testing";

// see app-hax.test.js: no demo session, so the backend does not reload the
// page mid-run
globalThis.appSettings = {};

const { store } = await import("../lib/v2/AppHaxStore.js");
await import("../app-hax.js");
await import("../lib/v2/admin/haxcms-system-settings.js");
await import("@haxtheweb/simple-modal/simple-modal.js");
const { HaxUiBaseStyles } =
  await import("@haxtheweb/hax-body/lib/hax-ui-styles.js");
const { SuperDaemonInstance } =
  await import("@haxtheweb/super-daemon/super-daemon.js");

const settle = (ms = 200) => aTimeout(ms);

// a System Settings dialog whose open panel has unsaved changes
function makeDirty(dialog) {
  dialog.__loadedPanelValues = { status: { a: 1 } };
  dialog.panelValues = { status: { a: 2 } };
}

function hideModal() {
  globalThis.dispatchEvent(
    new CustomEvent("simple-modal-hide", { detail: {} }),
  );
}

describe("haxcms-system-settings leave contract", () => {
  let dialog;

  beforeEach(async () => {
    dialog = document.createElement("haxcms-system-settings");
    document.body.appendChild(dialog);
    await dialog.updateComplete;
  });

  afterEach(() => {
    dialog.remove();
  });

  it("runs right away with nothing unsaved", () => {
    let ran = 0;
    expect(dialog.needsLeaveCheck).to.equal(false);
    expect(dialog.requestLeave(() => (ran += 1))).to.equal(true);
    expect(ran).to.equal(1);
    expect(dialog._pendingPanel).to.equal("");
  });

  it("asks first with unsaved changes; Stay runs nothing", async () => {
    makeDirty(dialog);
    let ran = 0;
    expect(dialog.needsLeaveCheck).to.equal(true);
    expect(dialog.requestLeave(() => (ran += 1))).to.equal(false);
    await dialog.updateComplete;
    expect(dialog.shadowRoot.querySelector(".leave")).to.not.equal(null);
    dialog._closeLeavePrompt();
    expect(ran).to.equal(0);
    expect(dialog.panelValues.status.a).to.equal(2);
  });

  it("Discard and continue restores the panel, then runs", () => {
    makeDirty(dialog);
    let ran = 0;
    dialog.requestLeave(() => (ran += 1));
    dialog._leaveDiscard();
    expect(ran).to.equal(1);
    expect(dialog.panelValues.status.a).to.equal(1);
    expect(dialog.activePanel).to.equal("status");
  });

  it("Save and continue runs only when the save worked", async () => {
    makeDirty(dialog);
    let ran = 0;
    dialog._saveActivePanel = async () => {
      dialog._saveTone = "error";
    };
    dialog.requestLeave(() => (ran += 1));
    await dialog._leaveSave();
    expect(ran).to.equal(0);
    dialog._saveActivePanel = async () => {
      dialog._saveTone = "saved";
    };
    dialog.requestLeave(() => (ran += 1));
    await dialog._leaveSave();
    expect(ran).to.equal(1);
  });

  it("switching panels still uses the prompt as before", () => {
    makeDirty(dialog);
    dialog._navigatePanel("themes");
    expect(dialog._pendingPanel).to.equal("themes");
    dialog._leaveDiscard();
    expect(dialog.activePanel).to.equal("themes");
  });
});

describe("app-hax with System Settings docked", () => {
  let el;
  let dialog;
  let pageStyles;
  const AppHaxClass = customElements.get("app-hax");
  const realLogin = AppHaxClass.prototype.login;

  before(() => {
    // no session in tests: keep the sign in dialog from replacing System
    // Settings in the shared modal
    AppHaxClass.prototype.login = function () {};
  });

  after(() => {
    AppHaxClass.prototype.login = realLogin;
  });

  beforeEach(async () => {
    if (store) {
      store.appMode = "home";
      store.appReady = false;
    }
    // the HAX editor's page styles pin every open modal high; the bar must
    // still win
    pageStyles = document.createElement("style");
    pageStyles.textContent = HaxUiBaseStyles.map((st) => st.cssText).join("");
    document.head.appendChild(pageStyles);
    el = await fixture(html`<app-hax base-path="/test/"></app-hax>`);
    await el.updateComplete;
    dialog = document.createElement("haxcms-system-settings");
    el.__systemSettingsDialog = dialog;
    // the dialog must be connected to count as the current one
    document.body.appendChild(dialog);
    el._showSystemSettingsModal(dialog, "status");
    await settle(400);
    await el.updateComplete;
  });

  afterEach(async () => {
    hideModal();
    await settle();
    pageStyles.remove();
    dialog.remove();
  });

  it("docks, makes the dashboard inert and restores it on close", async () => {
    const modal = document.querySelector("simple-modal");
    expect(modal.docked).to.equal(true);
    expect(el.adminDocked).to.equal(true);
    expect(el.hasAttribute("admin-docked")).to.equal(true);
    expect(el.shadowRoot.querySelector("main").inert).to.equal(true);
    expect(el.shadowRoot.querySelector(".bar-wrap").inert).to.equal(false);
    hideModal();
    await settle();
    await el.updateComplete;
    expect(el.adminDocked).to.equal(false);
    expect(el.shadowRoot.querySelector("main").inert).to.equal(false);
  });

  it("starts the dialog at the bar's bottom edge", () => {
    const modal = document.querySelector("simple-modal");
    const bar = el.shadowRoot.querySelector("app-hax-top-bar");
    expect(modal.style.getPropertyValue("--simple-modal-dock-top")).to.equal(
      `${Math.round(bar.getBoundingClientRect().height)}px`,
    );
  });

  it("paints the bar's user menu above the open dialog", async () => {
    const modal = document.querySelector("simple-modal");
    const modalZ = Number(getComputedStyle(modal).zIndex);
    const wrapZ = Number(
      getComputedStyle(el.shadowRoot.querySelector(".bar-wrap")).zIndex,
    );
    expect(modalZ, "hax-ui-styles pins the open modal").to.be.above(100000000);
    expect(wrapZ).to.be.above(modalZ);
    el.userMenuOpen = true;
    await el.updateComplete;
    const userMenu = el.shadowRoot.querySelector("#user-menu");
    await userMenu.updateComplete;
    const drop = userMenu.shadowRoot.querySelector(".user-menu.open");
    const r = drop.getBoundingClientRect();
    const dialogTop = modal.shadowRoot
      .querySelector("web-dialog")
      .shadowRoot.querySelector("#dialog")
      .getBoundingClientRect().top;
    const y = r.bottom - 8;
    expect(y, "probe point is over the dialog").to.be.above(dialogTop);
    // booleans, not elements: a failed match on DOM nodes stalls the runner
    const hitIsApp = document.elementFromPoint(r.left + r.width / 2, y) === el;
    expect(hitIsApp).to.equal(true);
    el.userMenuOpen = false;
  });

  it("gives Merlin a layer at or above the bar", () => {
    const z = getComputedStyle(SuperDaemonInstance)
      .getPropertyValue("--simple-modal-z-index")
      .trim();
    expect(Number(z)).to.be.at.least(
      Number(getComputedStyle(el.shadowRoot.querySelector(".bar-wrap")).zIndex),
    );
  });

  it("asks before Log out leaves unsaved settings", () => {
    let loggedOut = 0;
    el.logout = () => (loggedOut += 1);
    makeDirty(dialog);
    el._logoutGuarded();
    expect(loggedOut).to.equal(0);
    expect(dialog._pendingPanel).to.equal("status");
    dialog._leaveDiscard();
    expect(loggedOut).to.equal(1);
  });

  it("logs out right away with nothing unsaved", () => {
    let loggedOut = 0;
    el.logout = () => (loggedOut += 1);
    el._logoutGuarded();
    expect(loggedOut).to.equal(1);
  });

  describe("Merlin", () => {
    let commands;
    let hides;
    const onCommand = (e) => commands.push(e.detail);
    const onHide = () => (hides += 1);

    function selectRow(path) {
      const row = document.createElement("div");
      row.path = path;
      row.eventName = "test-merlin-command";
      row.value = { path };
      const evt = new CustomEvent("super-daemon-row-selected", {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: row,
      });
      document.body.appendChild(row);
      row.dispatchEvent(evt);
      row.remove();
      return evt;
    }

    beforeEach(() => {
      commands = [];
      hides = 0;
      globalThis.addEventListener("test-merlin-command", onCommand);
      globalThis.addEventListener("simple-modal-hide", onHide);
    });

    afterEach(() => {
      globalThis.removeEventListener("test-merlin-command", onCommand);
      globalThis.removeEventListener("simple-modal-hide", onHide);
    });

    it("lets System Settings move the dialog when nothing is unsaved", () => {
      const evt = selectRow("HAX/action/systemSettings");
      expect(evt.defaultPrevented).to.equal(false);
      expect(hides).to.equal(0);
    });

    it("closes the dialog before any other command runs", () => {
      const evt = selectRow("HAX/action/goToSite");
      expect(evt.defaultPrevented).to.equal(true);
      expect(hides).to.equal(1);
      expect(commands).to.deep.equal([{ path: "HAX/action/goToSite" }]);
    });

    it("asks first with unsaved changes, then closes and runs", () => {
      makeDirty(dialog);
      selectRow("HAX/action/goToSite");
      expect(commands).to.deep.equal([]);
      expect(dialog._pendingPanel).to.equal("status");
      dialog._leaveDiscard();
      expect(hides).to.equal(1);
      expect(commands).to.deep.equal([{ path: "HAX/action/goToSite" }]);
    });
  });
});

describe("app-hax opening System Settings from the user menu", () => {
  let el;
  const AppHaxClass = customElements.get("app-hax");
  const realLogin = AppHaxClass.prototype.login;
  const startUrl = globalThis.location.href;

  before(() => {
    AppHaxClass.prototype.login = function () {};
  });

  after(() => {
    AppHaxClass.prototype.login = realLogin;
  });

  beforeEach(async () => {
    el = await fixture(html`<app-hax base-path="/test/"></app-hax>`);
    await el.updateComplete;
    el._allowSystemSettings = () => true;
  });

  afterEach(async () => {
    hideModal();
    await settle();
    document
      .querySelectorAll("haxcms-system-settings")
      .forEach((node) => node.remove());
    globalThis.history.replaceState(globalThis.history.state, "", startUrl);
  });

  it("opens on the first click", async () => {
    el._openSystemSettingsMenuTap();
    await settle(400);
    expect(document.querySelector("simple-modal").opened).to.equal(true);
    expect(document.querySelector("haxcms-system-settings")).to.not.equal(null);
  });

  it("opens fresh when marked open but nothing is on screen", async () => {
    // a show that was never heard left the flag set with no dialog
    el.__systemSettingsModalOpen = true;
    el.__systemSettingsDialog = document.createElement(
      "haxcms-system-settings",
    );
    expect(el.openSystemSettings(false)).to.equal(true);
    await settle(400);
    expect(document.querySelector("simple-modal").opened).to.equal(true);
    expect(
      document.querySelector("haxcms-system-settings").isConnected,
    ).to.equal(true);
  });
});
