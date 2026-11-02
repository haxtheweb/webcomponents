import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import { sendKeys, sendMouse, resetMouse } from "@web/test-runner-commands";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import "../lib/simple-context-menu.js";

// the HAX UI menu: the menu styles its items, names itself, marks its
// items and rules, and keeps its keyboard model
describe("simple-context-menu HAX UI design", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(
      html`<simple-context-menu title="Page actions">
        <simple-toolbar-button
          id="one"
          icon="hax:admin-edit"
          label="Rename"
          show-text-label
          data-shortcut="F2"
        ></simple-toolbar-button>
        <simple-toolbar-button
          id="two"
          icon="hax:admin-copy"
          label="Duplicate"
          show-text-label
        ></simple-toolbar-button>
        <simple-toolbar-button
          id="off"
          icon="hax:admin-history"
          label="Restore"
          show-text-label
          disabled
        ></simple-toolbar-button>
        <hr />
        <simple-toolbar-button
          id="del"
          class="danger"
          icon="hax:admin-delete"
          label="Delete"
          show-text-label
        ></simple-toolbar-button>
      </simple-context-menu>`,
    );
    await el.updateComplete;
  });
  afterEach(async () => {
    el.close();
    await resetMouse();
  });

  const item = (id) => el.querySelector(`#${id}`);
  const part = (id) => item(id).shadowRoot.querySelector("button");
  const css = (node) => globalThis.getComputedStyle(node);

  it("is a named menu of menuitems and a separator", async () => {
    const menu = el.shadowRoot.querySelector('[role="menu"]');
    expect(menu).to.exist;
    expect(menu.getAttribute("aria-label")).to.equal("Page actions");
    expect(item("one").getAttribute("role")).to.equal("menuitem");
    expect(el.querySelector("hr").getAttribute("role")).to.equal("separator");
    const header = el.shadowRoot.querySelector(".menu-header");
    expect(header.getAttribute("aria-hidden")).to.equal("true");
  });

  it("an item that sets its own role keeps it", async () => {
    const own = await fixture(
      html`<simple-context-menu>
        <button role="menuitemcheckbox" aria-checked="true">Wrap</button>
      </simple-context-menu>`,
    );
    await own.updateComplete;
    expect(own.querySelector("button").getAttribute("role")).to.equal(
      "menuitemcheckbox",
    );
  });

  it("draws the HAX UI panel and 32px rows", async () => {
    el.openMenu(null);
    await aTimeout(50);
    const dialog = el.shadowRoot.querySelector("dialog");
    expect(css(dialog).borderTopLeftRadius).to.equal("8px");
    expect(css(dialog).paddingTop).to.equal("4px");
    expect(css(dialog).backgroundColor).to.equal("rgb(255, 255, 255)");
    expect(item("one").getBoundingClientRect().height).to.equal(32);
    expect(item("two").getBoundingClientRect().width).to.be.greaterThan(150);
    const header = el.shadowRoot.querySelector(".menu-header");
    expect(css(header).textTransform).to.equal("uppercase");
    expect(css(header).fontSize).to.equal("11px");
  });

  it("danger items read red and the shortcut hint shows", async () => {
    el.openMenu(null);
    await aTimeout(50);
    // --hax-ui-danger in light is DDD original87Pink #b40000
    expect(css(part("del")).color).to.not.equal(css(part("two")).color);
    const hint = globalThis.getComputedStyle(item("one"), "::after");
    expect(hint.content).to.equal('"F2"');
  });

  it("hover tints the row and a disabled item stays muted", async () => {
    el.openMenu(null);
    await aTimeout(50);
    const r = item("two").getBoundingClientRect();
    await sendMouse({
      type: "move",
      position: [Math.round(r.x + 20), Math.round(r.y + r.height / 2)],
    });
    await aTimeout(400);
    expect(css(part("two")).backgroundColor).to.not.equal("rgba(0, 0, 0, 0)");
    expect(part("off").disabled).to.equal(true);
  });

  it("Home, End and the arrows move; the ring shows for keys only", async () => {
    el.openMenu(null);
    await aTimeout(50);
    await sendKeys({ press: "End" });
    expect(el.keyboard).to.equal(true);
    expect(item("del").shadowRoot.activeElement).to.exist;
    await sendKeys({ press: "Home" });
    expect(item("one").shadowRoot.activeElement).to.exist;
    await sendKeys({ press: "ArrowDown" });
    expect(item("two").shadowRoot.activeElement).to.exist;
    expect(css(item("two")).outlineStyle).to.equal("solid");
    // the pointer turns the ring off
    const r = item("one").getBoundingClientRect();
    await sendMouse({
      type: "move",
      position: [Math.round(r.x + 10), Math.round(r.y + 10)],
    });
    expect(el.keyboard).to.equal(false);
    await sendKeys({ press: "Escape" });
    expect(el.open).to.equal(false);
  });

  it("passes the a11y audit while open", async () => {
    el.openMenu(null);
    await aTimeout(50);
    await expect(el).to.be.accessible();
  });
});
