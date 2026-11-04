import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../lib/core/haxcms-site-editor-ui.js";

// The editor menu's logout must not reload until jwt-login reports that the
// server answered the logout; reloading on jwt-logged-in false raced the
// logout request and could leave the refresh cookie alive
// (haxtheweb/issues#3209 item 5).
describe("haxcms-site-editor-ui logout waits for the server", () => {
  let el;
  let reloads;
  let logouts;
  const onLogout = (e) => logouts.push(e.detail);

  beforeEach(async () => {
    el = await fixture(html`<haxcms-site-editor-ui></haxcms-site-editor-ui>`);
    await aTimeout(0);
    reloads = 0;
    logouts = [];
    const mine = el;
    // count only this element's reloads; waits left by other tests are
    // flushed in afterEach
    mine._reloadAfterLogout = () => {
      mine.__logoutReloadPending = false;
      if (mine === el) reloads += 1;
    };
    globalThis.addEventListener("jwt-login-logout", onLogout);
  });

  afterEach(async () => {
    globalThis.removeEventListener("jwt-login-logout", onLogout);
    // settle any wait this test left pending so it cannot fire in the next
    el = null;
    globalThis.dispatchEvent(new CustomEvent("jwt-login-logout-complete"));
    await aTimeout(0);
  });

  it("asks jwt-login to log out without a redirect", () => {
    el._logout();
    expect(logouts).to.deep.equal([{ redirect: false }]);
  });

  it("does not reload when the local token is cleared", async () => {
    el._logout();
    globalThis.dispatchEvent(
      new CustomEvent("jwt-logged-in", { detail: false }),
    );
    await aTimeout(200);
    expect(reloads).to.equal(0);
  });

  it("reloads once jwt-login-logout-complete arrives", async () => {
    el._logout();
    globalThis.dispatchEvent(
      new CustomEvent("jwt-login-logout-complete", {
        detail: { ok: true, status: 200 },
      }),
    );
    await aTimeout(0);
    expect(reloads).to.equal(1);
    // a second completion does not reload again
    globalThis.dispatchEvent(new CustomEvent("jwt-login-logout-complete"));
    await aTimeout(0);
    expect(reloads).to.equal(1);
  });

  it("a second click while waiting does not send a second logout", () => {
    el._logout();
    el._logout();
    expect(logouts.length).to.equal(1);
  });
});
