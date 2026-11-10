// The one admin dialog docks below the top bar: the bar stays live, the
// page behind the dialog is inert, and anything on the bar or in Merlin that
// would leave the dialog asks about unsaved changes first.
import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import "web-dialog/index.js";
import "@haxtheweb/simple-modal/simple-modal.js";
import { SimpleModalCssVars } from "@haxtheweb/simple-modal/simple-modal.js";
import "../lib/core/haxcms-site-editor-ui.js";
import {
  SITE_ADMIN_MODAL_STYLES,
  SITE_ADMIN_MODAL_DOCKED_SIZE,
  siteAdminDockedModalStyles,
} from "../lib/core/admin/site-admin-sections.js";

const settle = async (ms = 150) => {
  await aTimeout(ms);
};

// stands in for haxcms-site-admin: just what the editor UI asks of it
function makeShell(needsLeaveCheck = false) {
  const shell = globalThis.document.createElement("div");
  shell.needsLeaveCheck = needsLeaveCheck;
  shell.leaveRequests = [];
  shell.requestLeave = (proceed) => {
    shell.leaveRequests.push(proceed);
    return false;
  };
  return shell;
}

function showDocked(shell) {
  globalThis.dispatchEvent(
    new CustomEvent("simple-modal-show", {
      detail: {
        title: "Structure",
        elements: { content: shell },
        styles: siteAdminDockedModalStyles(66),
        modal: true,
        showClose: true,
        docked: true,
      },
    }),
  );
}

function hideModal() {
  globalThis.dispatchEvent(
    new CustomEvent("simple-modal-hide", { detail: {} }),
  );
}

describe("site admin docked styles", () => {
  it("keeps the floating dialog's values and adds only the docked size", () => {
    const docked = siteAdminDockedModalStyles(66);
    Object.keys(SITE_ADMIN_MODAL_STYLES).forEach((prop) => {
      if (
        !Object.prototype.hasOwnProperty.call(
          SITE_ADMIN_MODAL_DOCKED_SIZE,
          prop,
        )
      ) {
        expect(docked[prop], prop).to.equal(SITE_ADMIN_MODAL_STYLES[prop]);
      }
    });
    expect(docked["--simple-modal-dock-top"]).to.equal("66px");
    expect(docked["--simple-modal-height"]).to.contain(
      "var(--simple-modal-dock-top, 64px)",
    );
  });

  it("falls back to the bar's 64px for a missing or bad edge", () => {
    expect(siteAdminDockedModalStyles()["--simple-modal-dock-top"]).to.equal(
      "64px",
    );
    expect(siteAdminDockedModalStyles(-4)["--simple-modal-dock-top"]).to.equal(
      "64px",
    );
    expect(
      siteAdminDockedModalStyles("nope")["--simple-modal-dock-top"],
    ).to.equal("64px");
  });

  it("only sets properties simple-modal reads", () => {
    Object.keys(siteAdminDockedModalStyles(66)).forEach((prop) => {
      expect(SimpleModalCssVars, prop).to.include(prop);
    });
  });
});

describe("haxcms-site-editor-ui with the admin dialog docked", () => {
  let el;
  let builder;
  let shell;

  beforeEach(async () => {
    builder = globalThis.document.createElement("haxcms-site-builder");
    builder.innerHTML = "<a href='#x'>page link</a>";
    globalThis.document.body.appendChild(builder);
    el = await fixture(html`<haxcms-site-editor-ui></haxcms-site-editor-ui>`);
    await aTimeout(0);
    shell = makeShell(false);
    el.__siteAdminShell = shell;
  });

  afterEach(async () => {
    hideModal();
    await settle();
    builder.remove();
  });

  it("follows the modal: docked while it holds the admin dialog", async () => {
    expect(el.adminDocked).to.equal(false);
    showDocked(shell);
    await settle();
    await el.updateComplete;
    expect(el.adminDocked).to.equal(true);
    expect(el.hasAttribute("admin-docked")).to.equal(true);
    hideModal();
    await settle();
    await el.updateComplete;
    expect(el.adminDocked).to.equal(false);
  });

  it("is not docked for other modals", async () => {
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-show", {
        detail: {
          title: "Other",
          elements: { content: globalThis.document.createElement("p") },
          docked: true,
        },
      }),
    );
    await settle();
    expect(el.adminDocked).to.equal(false);
  });

  it("makes the site content inert, never the bar, and restores it", async () => {
    showDocked(shell);
    await settle();
    await el.updateComplete;
    expect(builder.inert).to.equal(true);
    expect(el.inert).to.equal(false);
    expect(el.closest("[inert]")).to.equal(null);
    hideModal();
    await settle();
    await el.updateComplete;
    expect(builder.inert).to.equal(false);
  });

  it("leaves content that was already inert alone", async () => {
    builder.inert = true;
    showDocked(shell);
    await settle();
    await el.updateComplete;
    hideModal();
    await settle();
    await el.updateComplete;
    expect(builder.inert).to.equal(true);
  });

  it("disables page actions on the bar and marks the house active", async () => {
    showDocked(shell);
    await settle();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("#editbutton").disabled).to.equal(true);
    expect(el.shadowRoot.querySelector("#lockbutton").disabled).to.equal(true);
    expect(
      el.shadowRoot.querySelector("#manifestbtn").hasAttribute("active"),
    ).to.equal(true);
  });

  it("asks before the site menu moves a dialog with unsaved changes", async () => {
    shell.needsLeaveCheck = true;
    showDocked(shell);
    await settle();
    const paths = [];
    el.setAdminPath = (route) => paths.push(route);
    el._adminRouteAllowed = () => true;
    const item = globalThis.document.createElement("button");
    item.setAttribute("data-route", "files");
    el._siteMenuItemTap({ currentTarget: item });
    expect(paths).to.deep.equal([]);
    expect(shell.leaveRequests.length).to.equal(1);
    shell.leaveRequests[0]();
    expect(paths).to.deep.equal(["files"]);
  });

  it("asks before the sites dashboard link leaves with unsaved changes", async () => {
    shell.needsLeaveCheck = true;
    showDocked(shell);
    await settle();
    await el.updateComplete;
    const link = el.shadowRoot.querySelector("a.mysiteslink");
    link.setAttribute("href", "#sites");
    let navigated = 0;
    link.addEventListener("click", (e) => {
      if (!e.defaultPrevented) {
        navigated += 1;
        e.preventDefault();
      }
    });
    link.click();
    expect(navigated).to.equal(0);
    expect(shell.leaveRequests.length).to.equal(1);
    shell.leaveRequests[0]();
    expect(navigated).to.equal(1);
  });
});

describe("Merlin with the admin dialog docked", () => {
  let el;
  let shell;
  let commands;
  let hides;
  const onCommand = (e) => commands.push(e.detail);
  const onHide = () => (hides += 1);

  function selectRow(path, eventName = "test-merlin-command") {
    const row = globalThis.document.createElement("div");
    row.path = path;
    row.eventName = eventName;
    row.value = { path };
    const evt = new CustomEvent("super-daemon-row-selected", {
      composed: true,
      bubbles: true,
      cancelable: true,
      detail: row,
    });
    globalThis.document.body.appendChild(row);
    row.dispatchEvent(evt);
    row.remove();
    return evt;
  }

  beforeEach(async () => {
    el = await fixture(html`<haxcms-site-editor-ui></haxcms-site-editor-ui>`);
    await aTimeout(0);
    shell = makeShell(false);
    el.__siteAdminShell = shell;
    showDocked(shell);
    await settle();
    await el.updateComplete;
    commands = [];
    hides = 0;
    globalThis.addEventListener("test-merlin-command", onCommand);
    globalThis.addEventListener("simple-modal-hide", onHide);
  });

  afterEach(async () => {
    globalThis.removeEventListener("test-merlin-command", onCommand);
    globalThis.removeEventListener("simple-modal-hide", onHide);
    hideModal();
    await settle();
  });

  it("lets an admin command move the dialog when nothing is unsaved", () => {
    const evt = selectRow("CMS/admin/files");
    expect(evt.defaultPrevented).to.equal(false);
    expect(hides).to.equal(0);
  });

  it("closes the dialog before any other command runs", () => {
    const evt = selectRow("CMS/action/edit");
    expect(evt.defaultPrevented).to.equal(true);
    expect(hides).to.equal(1);
    expect(commands).to.deep.equal([{ path: "CMS/action/edit" }]);
  });

  it("asks first with unsaved changes, then runs an admin command", () => {
    shell.needsLeaveCheck = true;
    const evt = selectRow("CMS/admin/files");
    expect(evt.defaultPrevented).to.equal(true);
    expect(commands).to.deep.equal([]);
    expect(shell.leaveRequests.length).to.equal(1);
    shell.leaveRequests[0]();
    expect(commands).to.deep.equal([{ path: "CMS/admin/files" }]);
    expect(hides).to.equal(0);
  });

  it("asks first with unsaved changes, then closes and runs another command", () => {
    shell.needsLeaveCheck = true;
    selectRow("CMS/action/edit");
    expect(commands).to.deep.equal([]);
    shell.leaveRequests[0]();
    expect(hides).to.equal(1);
    expect(commands).to.deep.equal([{ path: "CMS/action/edit" }]);
  });

  it("does nothing special when the dialog is not docked", async () => {
    hideModal();
    await settle();
    await el.updateComplete;
    const evt = selectRow("CMS/action/edit");
    expect(evt.defaultPrevented).to.equal(false);
  });
});

// what the keyboard can reach: Tab moves between the dialog and the bar,
// and never into the page behind the dialog
describe("keyboard reach with the admin dialog docked", () => {
  let el;
  let builder;
  let shell;
  let pageLink;

  // the deepest focused element, through shadow roots
  const deepActive = () => {
    let a = globalThis.document.activeElement;
    while (a && a.shadowRoot && a.shadowRoot.activeElement) {
      a = a.shadowRoot.activeElement;
    }
    return a;
  };
  const inBar = () => {
    let a = globalThis.document.activeElement;
    return a === el || (a && el.contains(a));
  };

  beforeEach(async () => {
    builder = globalThis.document.createElement("haxcms-site-builder");
    builder.innerHTML = "<a href='#behind'>page link</a>";
    pageLink = builder.querySelector("a");
    globalThis.document.body.appendChild(builder);
    el = await fixture(html`<haxcms-site-editor-ui></haxcms-site-editor-ui>`);
    await aTimeout(0);
    shell = makeShell(false);
    shell.innerHTML =
      "<button id='first'>first</button><button id='last'>last</button>";
    el.__siteAdminShell = shell;
  });

  afterEach(async () => {
    hideModal();
    await settle();
    builder.remove();
  });

  it("Tab past the dialog's last control reaches the bar, never the page", async () => {
    showDocked(shell);
    await settle();
    await el.updateComplete;
    shell.querySelector("#last").focus();
    let reachedBar = false;
    for (let i = 0; i < 6 && !reachedBar; i++) {
      await sendKeys({ press: "Tab" });
      expect(deepActive()).to.not.equal(pageLink);
      reachedBar = inBar();
    }
    expect(reachedBar).to.equal(true);
  });

  it("without docking, Tab stays inside the dialog (unchanged)", async () => {
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-show", {
        detail: {
          title: "Floating",
          elements: { content: shell },
          modal: true,
          showClose: true,
        },
      }),
    );
    await settle();
    shell.querySelector("#last").focus();
    for (let i = 0; i < 6; i++) {
      await sendKeys({ press: "Tab" });
      expect(inBar()).to.equal(false);
      expect(deepActive()).to.not.equal(pageLink);
    }
  });
});
