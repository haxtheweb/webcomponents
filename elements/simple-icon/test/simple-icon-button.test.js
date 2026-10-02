import { fixture, expect, html } from "@open-wc/testing";

// Explicit imports so istanbul instruments each lib file
import "../lib/simple-icon-button.js";
import "../lib/simple-icon-button-lite.js";
import { SimpleIconButton } from "../lib/simple-icon-button.js";
import { SimpleIconButtonLite } from "../lib/simple-icon-button-lite.js";

describe("simple-icon-button-lite", () => {
  it("has the correct tag name", () => {
    expect(SimpleIconButtonLite.tag).to.equal("simple-icon-button-lite");
  });

  it("instantiates as a SimpleIconButtonLite", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite></simple-icon-button-lite>`,
    );
    expect(el instanceof SimpleIconButtonLite).to.be.true;
  });

  it("defaults type to button", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite></simple-icon-button-lite>`,
    );
    expect(el.type).to.equal("button");
  });

  it("renders a button with part button in shadow DOM", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite></simple-icon-button-lite>`,
    );
    const btn = el.shadowRoot.querySelector("button");
    expect(!!btn).to.be.true;
    expect(btn.getAttribute("part")).to.equal("button");
  });

  it("passes the a11y audit with a label", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite label="Search"></simple-icon-button-lite>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  it("maps label to aria-label and label attribute on the button", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite label="Search"></simple-icon-button-lite>`,
    );
    const btn = el.shadowRoot.querySelector("button");
    expect(btn.getAttribute("aria-label")).to.equal("Search");
    expect(btn.getAttribute("label")).to.equal("Search");
  });

  it("maps controls to aria-controls on the button", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite
        controls="target-id"
      ></simple-icon-button-lite>`,
    );
    const btn = el.shadowRoot.querySelector("button");
    expect(btn.getAttribute("aria-controls")).to.equal("target-id");
  });

  // fixed: the render binds `nothing` for unused features, which removes
  // the attribute entirely (lit 3.3.3 commits plain undefined as '')
  it("omits aria-controls when not supplied", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite></simple-icon-button-lite>`,
    );
    const btn = el.shadowRoot.querySelector("button");
    expect(btn.getAttribute("aria-controls")).to.equal(null);
  });

  it("maps aria-labelledby to the button", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite
        aria-labelledby="label-id"
      ></simple-icon-button-lite>`,
    );
    const btn = el.shadowRoot.querySelector("button");
    expect(btn.getAttribute("aria-labelledby")).to.equal("label-id");
  });

  it("maps field-name to the name attribute on the button", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite
        field-name="my-field"
      ></simple-icon-button-lite>`,
    );
    const btn = el.shadowRoot.querySelector("button");
    expect(btn.getAttribute("name")).to.equal("my-field");
  });

  it("maps form to the form attribute on the button", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite form="my-form"></simple-icon-button-lite>`,
    );
    const btn = el.shadowRoot.querySelector("button");
    expect(btn.getAttribute("form")).to.equal("my-form");
  });

  it("sets the value attribute on the button and reflects to host", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite value="yes"></simple-icon-button-lite>`,
    );
    const btn = el.shadowRoot.querySelector("button");
    expect(btn.getAttribute("value")).to.equal("yes");
    expect(el.getAttribute("value")).to.equal("yes");
  });

  it("sets autofocus on the button", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite autofocus></simple-icon-button-lite>`,
    );
    const btn = el.shadowRoot.querySelector("button");
    expect(btn.hasAttribute("autofocus")).to.be.true;
  });

  it("disables the button when disabled", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite disabled></simple-icon-button-lite>`,
    );
    const btn = el.shadowRoot.querySelector("button");
    expect(el.disabled).to.be.true;
    expect(btn.hasAttribute("disabled")).to.be.true;
  });

  it("sets aria-pressed true when toggles and toggled", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite toggles toggled></simple-icon-button-lite>`,
    );
    const btn = el.shadowRoot.querySelector("button");
    expect(btn.getAttribute("aria-pressed")).to.equal("true");
  });

  it("sets aria-pressed false when toggles and not toggled", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite toggles></simple-icon-button-lite>`,
    );
    const btn = el.shadowRoot.querySelector("button");
    expect(btn.getAttribute("aria-pressed")).to.equal("false");
  });

  // fixed: the render binds `nothing` when toggles is not used, which
  // removes the attribute instead of committing an invalid empty value
  it("omits aria-pressed when not a toggle button", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite toggled></simple-icon-button-lite>`,
    );
    const btn = el.shadowRoot.querySelector("button");
    expect(btn.getAttribute("aria-pressed")).to.equal(null);
  });

  // a11y follow-up: buttons without a label used to render an empty
  // aria-labelledby/aria-label and get no accessible name at all; the
  // attributes only render when there is a value and the icon name is
  // used as the accessible-name fallback
  it("gives unlabeled buttons an accessible name from the icon", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite
        icon="icons:home"
      ></simple-icon-button-lite>`,
    );
    const btn = el.shadowRoot.querySelector("button");
    expect(btn.getAttribute("aria-label")).to.equal("icons:home");
    // empty idrefs are no longer rendered either
    expect(btn.getAttribute("aria-labelledby")).to.equal(null);
    await expect(el).shadowDom.to.be.accessible();
  });

  it("omits aria-label when there is nothing to name the button", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite></simple-icon-button-lite>`,
    );
    const btn = el.shadowRoot.querySelector("button");
    expect(btn.getAttribute("aria-label")).to.equal(null);
  });

  it("reflects toggles and toggled to host attributes", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite toggles toggled></simple-icon-button-lite>`,
    );
    expect(el.hasAttribute("toggles")).to.be.true;
    expect(el.hasAttribute("toggled")).to.be.true;
  });

  it("passes icon to the nested simple-icon-lite", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite
        icon="icons:home"
      ></simple-icon-button-lite>`,
    );
    const icon = el.shadowRoot.querySelector("simple-icon-lite");
    expect(!!icon).to.be.true;
    expect(icon.getAttribute("icon")).to.equal("icons:home");
    expect(icon.getAttribute("part")).to.equal("icon");
  });

  // fixed: SimpleIconButtonBehaviors declares noColorize, so the host
  // no-colorize attribute reaches the nested icon
  it("no-colorize on the host reaches the nested icon", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite
        icon="icons:home"
        no-colorize
      ></simple-icon-button-lite>`,
    );
    const icon = el.shadowRoot.querySelector("simple-icon-lite");
    expect(icon.hasAttribute("no-colorize")).to.be.true;
  });

  it("reflects icon to the host attribute", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite
        icon="icons:home"
      ></simple-icon-button-lite>`,
    );
    expect(el.getAttribute("icon")).to.equal("icons:home");
  });

  it("slots light DOM content inside the button", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite label="Go"
        ><span id="slotted">hi</span></simple-icon-button-lite
      >`,
    );
    const slotted = el.querySelector("#slotted");
    expect(!!slotted).to.be.true;
    expect(slotted.textContent).to.equal("hi");
    const slot = el.shadowRoot.querySelector("button slot");
    expect(!!slot).to.be.true;
  });

  it("declares all button properties with attribute mappings", () => {
    const props = SimpleIconButtonLite.properties;
    expect(props).to.have.property("autofocus");
    expect(props.ariaLabelledby.attribute).to.equal("aria-labelledby");
    expect(props).to.have.property("controls");
    expect(props).to.have.property("disabled");
    expect(props.fieldName.attribute).to.equal("field-name");
    expect(props).to.have.property("form");
    expect(props).to.have.property("icon");
    expect(props.icon.reflect).to.equal(true);
    expect(props).to.have.property("label");
    expect(props).to.have.property("type");
    expect(props.value.reflect).to.equal(true);
    expect(props.toggles.reflect).to.equal(true);
    expect(props.toggled.reflect).to.equal(true);
    // #3107 role pass-through forwarding properties
    expect(props.buttonRole.attribute).to.equal("button-role");
    expect(props.ariaChecked.attribute).to.equal("aria-checked");
    expect(props.buttonTabindex.attribute).to.equal("button-tabindex");
  });

  // haxtheweb/issues#3107 role pass-through: consumers can put widget
  // semantics on the internal native button while the host stays a
  // semantic-free wrapper (axe nested-interactive stays clean)
  it("forwards button-role to the internal button without a host role", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite
        icon="icons:home"
        label="Home"
        button-role="radio"
      ></simple-icon-button-lite>`,
    );
    const btn = el.shadowRoot.querySelector("button");
    expect(btn.getAttribute("role")).to.equal("radio");
    expect(el.hasAttribute("role")).to.equal(false);
  });

  it("forwards aria-checked only when defined", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite
        icon="icons:home"
        label="Home"
        button-role="radio"
      ></simple-icon-button-lite>`,
    );
    const btn = el.shadowRoot.querySelector("button");
    expect(btn.getAttribute("aria-checked")).to.equal(null);
    el.ariaChecked = true;
    await el.updateComplete;
    expect(btn.getAttribute("aria-checked")).to.equal("true");
    el.ariaChecked = false;
    await el.updateComplete;
    expect(btn.getAttribute("aria-checked")).to.equal("false");
  });

  it("forwards button-tabindex only when defined", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite
        icon="icons:home"
        label="Home"
      ></simple-icon-button-lite>`,
    );
    const btn = el.shadowRoot.querySelector("button");
    expect(btn.getAttribute("tabindex")).to.equal(null);
    el.buttonTabindex = -1;
    await el.updateComplete;
    expect(btn.getAttribute("tabindex")).to.equal("-1");
    el.buttonTabindex = 0;
    await el.updateComplete;
    expect(btn.getAttribute("tabindex")).to.equal("0");
  });

  it("delegates focus() to the internal button", async () => {
    const el = await fixture(
      html`<simple-icon-button-lite
        icon="icons:home"
        label="Home"
      ></simple-icon-button-lite>`,
    );
    el.focus();
    expect(el.shadowRoot.activeElement).to.equal(
      el.shadowRoot.querySelector("button"),
    );
  });

  it("returns an array of styles", () => {
    expect(Array.isArray(SimpleIconButtonLite.styles)).to.be.true;
    expect(SimpleIconButtonLite.styles.length).to.be.greaterThan(0);
  });
});

describe("simple-icon-button", () => {
  it("has the correct tag name", () => {
    expect(SimpleIconButton.tag).to.equal("simple-icon-button");
  });

  it("instantiates as a SimpleIconButton", async () => {
    const el = await fixture(html`<simple-icon-button></simple-icon-button>`);
    expect(el instanceof SimpleIconButton).to.be.true;
  });

  it("defaults accentColor to grey, contrast to 4, and dark to false", async () => {
    const el = await fixture(html`<simple-icon-button></simple-icon-button>`);
    expect(el.accentColor).to.equal("grey");
    expect(el.contrast).to.equal(4);
    expect(el.dark).to.be.false;
  });

  it("passes the a11y audit with a label", async () => {
    const el = await fixture(
      html`<simple-icon-button
        icon="icons:home"
        label="Home"
      ></simple-icon-button>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  it("renders a nested simple-icon with the default theme", async () => {
    const el = await fixture(
      html`<simple-icon-button
        icon="icons:home"
        label="Home"
      ></simple-icon-button>`,
    );
    const icon = el.shadowRoot.querySelector("button simple-icon");
    expect(!!icon).to.be.true;
    expect(icon.getAttribute("accent-color")).to.equal("grey");
    expect(icon.getAttribute("contrast")).to.equal("4");
    expect(icon.getAttribute("icon")).to.equal("icons:home");
    expect(icon.hasAttribute("dark")).to.be.false;
  });

  it("passes accent-color, contrast, and dark to the icon", async () => {
    const el = await fixture(
      html`<simple-icon-button
        icon="icons:home"
        label="Home"
        accent-color="blue"
        contrast="3"
        dark
      ></simple-icon-button>`,
    );
    const icon = el.shadowRoot.querySelector("button simple-icon");
    expect(icon.getAttribute("accent-color")).to.equal("blue");
    expect(icon.getAttribute("contrast")).to.equal("3");
    expect(icon.hasAttribute("dark")).to.be.true;
  });

  // fixed: the inherited noColorize declaration reaches the nested icon
  it("no-colorize on the host reaches the nested icon", async () => {
    const el = await fixture(
      html`<simple-icon-button
        icon="icons:home"
        label="Home"
        no-colorize
      ></simple-icon-button>`,
    );
    const icon = el.shadowRoot.querySelector("button simple-icon");
    expect(icon.hasAttribute("no-colorize")).to.be.true;
  });

  it("gives unlabeled full buttons an accessible name from the icon", async () => {
    const el = await fixture(
      html`<simple-icon-button icon="icons:home"></simple-icon-button>`,
    );
    const btn = el.shadowRoot.querySelector("button");
    expect(btn.getAttribute("aria-label")).to.equal("icons:home");
    await expect(el).shadowDom.to.be.accessible();
  });

  it("reflects contrast to the host attribute", async () => {
    const el = await fixture(
      html`<simple-icon-button contrast="2"></simple-icon-button>`,
    );
    expect(el.contrast).to.equal(2);
    expect(el.getAttribute("contrast")).to.equal("2");
  });

  it("sets aria-pressed on the button when toggles and toggled", async () => {
    const el = await fixture(
      html`<simple-icon-button
        icon="icons:home"
        label="Home"
        toggles
        toggled
      ></simple-icon-button>`,
    );
    const btn = el.shadowRoot.querySelector("button");
    expect(btn.getAttribute("aria-pressed")).to.equal("true");
  });

  it("disables the button when disabled", async () => {
    const el = await fixture(
      html`<simple-icon-button
        icon="icons:home"
        label="Home"
        disabled
      ></simple-icon-button>`,
    );
    const btn = el.shadowRoot.querySelector("button");
    expect(btn.hasAttribute("disabled")).to.be.true;
  });

  it("updates the nested icon when properties change", async () => {
    const el = await fixture(
      html`<simple-icon-button
        icon="icons:home"
        label="Home"
      ></simple-icon-button>`,
    );
    el.accentColor = "red";
    el.contrast = 1;
    el.dark = true;
    await el.updateComplete;
    const icon = el.shadowRoot.querySelector("button simple-icon");
    expect(icon.getAttribute("accent-color")).to.equal("red");
    expect(icon.getAttribute("contrast")).to.equal("1");
    expect(icon.hasAttribute("dark")).to.equal(true);
  });

  // haxtheweb/issues#3107 role pass-through on the full button too
  it("forwards button-role, aria-checked and button-tabindex to the internal button", async () => {
    const el = await fixture(
      html`<simple-icon-button
        icon="icons:home"
        label="Home"
        button-role="radio"
        button-tabindex="0"
      ></simple-icon-button>`,
    );
    const btn = el.shadowRoot.querySelector("button");
    expect(btn.getAttribute("role")).to.equal("radio");
    expect(btn.getAttribute("tabindex")).to.equal("0");
    el.ariaChecked = true;
    await el.updateComplete;
    expect(btn.getAttribute("aria-checked")).to.equal("true");
    // the host carries no interactive role itself
    expect(el.hasAttribute("role")).to.equal(false);
  });
});
