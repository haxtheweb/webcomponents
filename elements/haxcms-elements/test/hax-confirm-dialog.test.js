import { fixture, expect, html } from "@open-wc/testing";
import "../lib/core/ui/hax-confirm-dialog.js";
import { SITE_ADMIN_CONFIRM_STYLES } from "../lib/core/admin/site-admin-sections.js";

describe("hax-confirm-dialog: the admin leave prompt look", () => {
  it("draws HAX UI buttons: cancel plain, confirm primary", async () => {
    const el = await fixture(
      html`<hax-confirm-dialog message="Leave?"></hax-confirm-dialog>`,
    );
    const cancel = el.shadowRoot.querySelector('[data-action="cancel"]');
    const confirm = el.shadowRoot.querySelector('[data-action="confirm"]');
    expect(cancel.classList.contains("hax-ui-btn")).to.equal(true);
    expect(cancel.classList.contains("ghost")).to.equal(true);
    expect(confirm.classList.contains("primary")).to.equal(true);
    expect(globalThis.getComputedStyle(confirm).height).to.equal("32px");
    // meaning channels: confirm and cancel each carry their own icon
    expect(
      cancel.querySelector("simple-icon-lite").getAttribute("icon"),
    ).to.equal("hax:admin-close");
    expect(
      confirm.querySelector("simple-icon-lite").getAttribute("icon"),
    ).to.equal("hax:admin-check");
    expect(el.shadowRoot.querySelector(".message").textContent).to.equal(
      "Leave?",
    );
  });

  it("a destructive confirm is the danger fill and still runs its callbacks", async () => {
    let confirmed = 0;
    let cancelled = 0;
    const el = await fixture(
      html`<hax-confirm-dialog
        destructive
        .confirmCallback=${() => confirmed++}
        .cancelCallback=${() => cancelled++}
        .closeOnConfirm=${false}
        .closeOnCancel=${false}
      ></hax-confirm-dialog>`,
    );
    const confirm = el.shadowRoot.querySelector('[data-action="confirm"]');
    expect(confirm.classList.contains("danger-fill")).to.equal(true);
    expect(
      confirm.querySelector("simple-icon-lite").getAttribute("icon"),
    ).to.equal("hax:admin-delete");
    confirm.click();
    el.shadowRoot.querySelector('[data-action="cancel"]').click();
    expect([confirmed, cancelled]).to.deep.equal([1, 1]);
  });

  it("opens in a compact surface panel, not a dark titlebar", () => {
    expect(SITE_ADMIN_CONFIRM_STYLES["--simple-modal-width"]).to.equal("460px");
    expect(SITE_ADMIN_CONFIRM_STYLES["--simple-modal-title-align"]).to.equal(
      "start",
    );
    expect(
      SITE_ADMIN_CONFIRM_STYLES["--simple-modal-titlebar-background"],
    ).to.contain("light-dark(");
  });
});
