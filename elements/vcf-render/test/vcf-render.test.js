import { html, fixture, expect, aTimeout, waitUntil } from "@open-wc/testing";
import "../vcf-render.js";

// two contacts, the first with an embedded AGENT card folded into it, so the
// assertions below cover the awkward shape the issue's own sample has
const SAMPLE = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  "N:Doe;John;Q.,Public",
  "FN;CHARSET=UTF-8:John Doe",
  "ORG:Example Corp;Teaching and Learning",
  "TITLE:Director of Teaching and Learning",
  "TEL;TYPE=WORK,VOICE:(111) 555-1212",
  "EMAIL;TYPE=PREF,INTERNET:forrestgump@example.com",
  "ADR;TYPE=HOME:;;42 Plantation St.;Baytown;LA;30314;United States of America",
  "URL:https://hax.psu.edu/",
  "NOTE:Supports faculty adopting open courseware.",
  "AGENT:BEGIN:VCARD",
  " VERSION:3.0",
  " FN:Jane Assistant",
  " EMAIL;TYPE=INTERNET:assistant@example.com",
  " END:VCARD",
  "END:VCARD",
  "BEGIN:VCARD",
  "VERSION:3.0",
  "FN:Jane Smith",
  "ORG:Example Corp;College of IST",
  "TITLE:Professor of Practice",
  "TEL;TYPE=WORK,VOICE:(111) 555-3434",
  "EMAIL;TYPE=INTERNET:jane.smith@example.com",
  "NOTE:Teaches the capstone sequence\\; office in Westgate.",
  "CATEGORIES:Faculty",
  "END:VCARD",
].join("\r\n");

async function render(mode, data = SAMPLE) {
  const element = await fixture(
    html`<vcf-render
      element-visible
      display-as="${mode}"
      .contactData="${data}"
    ></vcf-render>`,
  );
  await waitUntil(
    () => element.status === "ready",
    "the contacts should have been read",
  );
  await element.updateComplete;
  return element;
}

describe("VcfRender basics", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<vcf-render></vcf-render>`);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("vcf-render");
  });

  it("passes the a11y audit with nothing to show", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("starts idle, in cards mode, with no contacts", () => {
    expect(element.status).to.equal("idle");
    expect(element.displayAs).to.equal("cards");
    expect(element.contacts).to.deep.equal([]);
  });

  it("says nothing before a file has been read", () => {
    expect(element.shadowRoot.textContent.trim()).to.equal("");
  });

  it("names its display modes in the order Merlin offers them", () => {
    expect(element.constructor.displayModes).to.deep.equal([
      "cards",
      "quotes",
      "table",
      "list",
    ]);
  });

  it("points haxProperties at its own schema file", () => {
    const url = element.constructor.haxProperties;
    expect(url).to.be.a("string");
    expect(url).to.contain("lib/vcf-render.haxProperties.json");
  });
});

describe("VcfRender reading contacts", () => {
  it("reads the contacts out of contact-data", async () => {
    const element = await render("cards");
    expect(element.contacts.length).to.equal(2);
    expect(
      element.contacts.map((contact) => contact.displayName),
    ).to.deep.equal(["John Doe", "Jane Smith"]);
  });

  it("keeps an embedded AGENT card inside its contact", async () => {
    const element = await render("cards");
    expect(element.contacts.length).to.equal(2);
    expect(element.contacts[0].hasAgent).to.equal(true);
  });

  it("reports what it read", async () => {
    const element = await fixture(
      html`<vcf-render element-visible></vcf-render>`,
    );
    const heard = new Promise((resolve) => {
      element.addEventListener("vcf-render-parsed", (event) =>
        resolve(event.detail),
      );
    });
    element.contactData = SAMPLE;
    const detail = await heard;
    expect(detail.contacts.length).to.equal(2);
  });

  it("says so when the file holds no contacts", async () => {
    const element = await render("cards", "BEGIN:VCARD\r\nEND:VCARD");
    expect(element.contacts).to.deep.equal([]);
    expect(element.shadowRoot.textContent).to.contain(element.t.noContacts);
  });

  it("says so when the file is not a contact file at all", async () => {
    const element = await render("cards", "this is not a vcard");
    expect(element.shadowRoot.textContent).to.contain(element.t.noContacts);
  });

  it("goes back to idle when the data is taken away", async () => {
    const element = await render("cards");
    element.contactData = "";
    await element.updateComplete;
    expect(element.status).to.equal("idle");
    expect(element.contacts).to.deep.equal([]);
  });
});

describe("VcfRender display modes", () => {
  it("renders one person card per contact", async () => {
    const element = await render("cards");
    const cards = element.shadowRoot.querySelectorAll("person-testimonial");
    expect(cards.length).to.equal(2);
    expect(cards[0].getAttribute("name")).to.equal("John Doe");
    expect(cards[0].getAttribute("position")).to.equal(
      "Director of Teaching and Learning, Example Corp",
    );
    expect(cards[0].textContent.trim()).to.equal(
      "Supports faculty adopting open courseware.",
    );
  });

  it("exposes the cards as a list to assistive technology", async () => {
    const element = await render("cards");
    expect(
      element.shadowRoot.querySelector(".cards").getAttribute("role"),
    ).to.equal("list");
    expect(
      element.shadowRoot.querySelectorAll('[role="listitem"]').length,
    ).to.equal(2);
  });

  it("passes the a11y audit in cards mode", async () => {
    const element = await render("cards");
    await expect(element).shadowDom.to.be.accessible();
  });

  it("renders a quote per contact, through the quote property", async () => {
    const element = await render("quotes");
    const quotes = element.shadowRoot.querySelectorAll("media-quote");
    expect(quotes.length).to.equal(2);
    // media-quote takes the quote through a named slot whose fallback is the
    // property, so the text has to arrive as an attribute
    expect(quotes[1].getAttribute("quote")).to.equal(
      "Teaches the capstone sequence; office in Westgate.",
    );
    expect(quotes[1].getAttribute("author")).to.equal("Jane Smith");
    expect(quotes[1].getAttribute("author-detail")).to.equal(
      "Professor of Practice, Example Corp",
    );
  });

  it("passes the a11y audit in quotes mode", async () => {
    const element = await render("quotes");
    await expect(element).shadowDom.to.be.accessible();
  });

  it("renders a table of the contacts", async () => {
    const element = await render("table");
    const table = element.shadowRoot.querySelector("editable-table table");
    expect(table).to.exist;
    expect(table.querySelectorAll("thead th").length).to.equal(6);
    expect(table.querySelectorAll("tbody tr").length).to.equal(2);
    const cells = table.querySelectorAll("tbody tr")[0].querySelectorAll("td");
    expect(cells[0].textContent.trim()).to.equal("John Doe");
    expect(cells[1].textContent.trim()).to.equal(
      "Director of Teaching and Learning",
    );
    expect(cells[2].textContent.trim()).to.equal("Example Corp");
    expect(cells[3].textContent.trim()).to.equal("forrestgump@example.com");
    expect(cells[4].textContent.trim()).to.equal("(111) 555-1212");
    expect(cells[5].textContent).to.contain("42 Plantation St.");
  });

  it("passes the a11y audit in table mode", async () => {
    const element = await render("table");
    await expect(element).shadowDom.to.be.accessible();
  });

  it("renders a list of the contacts", async () => {
    const element = await render("list");
    const items = element.shadowRoot.querySelectorAll("collection-item");
    expect(items.length).to.equal(2);
    expect(items[0].getAttribute("line1")).to.equal("John Doe");
    expect(items[0].getAttribute("line2")).to.equal(
      "Director of Teaching and Learning, Example Corp",
    );
    expect(items[0].getAttribute("line3")).to.equal("forrestgump@example.com");
    expect(items[1].getAttribute("tags")).to.equal("Faculty");
  });

  it("links a list entry to the contact's own site, then to their email", async () => {
    const element = await render("list");
    const items = element.shadowRoot.querySelectorAll("collection-item");
    expect(items[0].getAttribute("url")).to.equal("https://hax.psu.edu/");
    expect(items[1].getAttribute("url")).to.equal(
      "mailto:jane.smith@example.com",
    );
  });

  it("passes the a11y audit in list mode", async () => {
    const element = await render("list");
    await expect(element).shadowDom.to.be.accessible();
  });

  it("switches modes without re-reading the file", async () => {
    const element = await render("cards");
    expect(
      element.shadowRoot.querySelectorAll("person-testimonial").length,
    ).to.equal(2);
    element.displayAs = "table";
    await element.updateComplete;
    expect(
      element.shadowRoot.querySelectorAll("person-testimonial").length,
    ).to.equal(0);
    expect(element.shadowRoot.querySelector("editable-table")).to.exist;
    expect(element.contacts.length).to.equal(2);
  });

  // an unimported custom element is still in the DOM, so the only proof a
  // lazy import ran is that the definition turns up. one test per mode, so a
  // single test never has to wait on four dependency graphs at once
  it("loads person-testimonial for cards mode", async () => {
    const element = await render("cards");
    await waitUntil(
      () => globalThis.customElements.get("person-testimonial"),
      "cards mode should have loaded person-testimonial",
      { timeout: 5000 },
    );
    expect(element.shadowRoot.querySelector("person-testimonial")).to.exist;
  });

  it("loads media-quote for quotes mode", async () => {
    const element = await render("quotes");
    await waitUntil(
      () => globalThis.customElements.get("media-quote"),
      "quotes mode should have loaded media-quote",
      { timeout: 5000 },
    );
    expect(element.shadowRoot.querySelector("media-quote")).to.exist;
  });

  it("loads editable-table for table mode", async () => {
    const element = await render("table");
    await waitUntil(
      () => globalThis.customElements.get("editable-table"),
      "table mode should have loaded editable-table",
      { timeout: 5000 },
    );
    expect(element.shadowRoot.querySelector("editable-table")).to.exist;
  });

  it("loads collection-item for list mode", async () => {
    const element = await render("list");
    await waitUntil(
      () => globalThis.customElements.get("collection-item"),
      "list mode should have loaded collection-item",
      { timeout: 5000 },
    );
    expect(element.shadowRoot.querySelector("collection-item")).to.exist;
  });

  it("falls back to cards for a mode it does not know", async () => {
    const element = await render("nonsense");
    expect(
      element.shadowRoot.querySelectorAll("person-testimonial").length,
    ).to.equal(2);
  });

  it("quotes the contact details when a card carries no note", async () => {
    const element = await render(
      "cards",
      [
        "BEGIN:VCARD",
        "FN:No Note",
        "EMAIL:nonote@example.com",
        "END:VCARD",
      ].join("\r\n"),
    );
    const card = element.shadowRoot.querySelector("person-testimonial");
    expect(card.textContent.trim()).to.equal("nonote@example.com");
  });

  it("refuses a photo that is not a safe image source", async () => {
    const element = await render(
      "cards",
      [
        "BEGIN:VCARD",
        "FN:Hostile Card",
        "PHOTO;VALUE=URL:javascript:alert(1)",
        "END:VCARD",
      ].join("\r\n"),
    );
    const card = element.shadowRoot.querySelector("person-testimonial");
    expect(card.getAttribute("image")).to.equal("");
  });
});

describe("VcfRender fetching contacts", () => {
  let originalFetch;
  let requested;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    requested = [];
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("fetches the file named by data-source and renders it", async () => {
    globalThis.fetch = async (url) => {
      requested.push(url);
      return new Response(SAMPLE, { status: 200 });
    };
    const element = await fixture(
      html`<vcf-render
        element-visible
        data-source="/files/directory.vcf"
        debounce-delay="0"
      ></vcf-render>`,
    );
    await waitUntil(() => element.status === "ready");
    await element.updateComplete;
    expect(requested).to.deep.equal(["/files/directory.vcf"]);
    expect(element.contacts.length).to.equal(2);
    expect(
      element.shadowRoot.querySelectorAll("person-testimonial").length,
    ).to.equal(2);
  });

  it("reports contacts it could not fetch", async () => {
    globalThis.fetch = async () => new Response("nope", { status: 404 });
    const element = await fixture(
      html`<vcf-render
        element-visible
        data-source="/files/missing.vcf"
        debounce-delay="0"
      ></vcf-render>`,
    );
    await waitUntil(() => element.status === "error");
    await element.updateComplete;
    expect(element.contacts).to.deep.equal([]);
    const alert = element.shadowRoot.querySelector('[role="alert"]');
    expect(alert).to.exist;
    expect(alert.textContent).to.contain(element.t.contactsUnavailable);
  });

  it("reports a request that failed outright", async () => {
    globalThis.fetch = async () => {
      throw new Error("offline");
    };
    const element = await fixture(
      html`<vcf-render
        element-visible
        data-source="/files/directory.vcf"
        debounce-delay="0"
      ></vcf-render>`,
    );
    await waitUntil(() => element.status === "error");
    expect(element.status).to.equal("error");
  });

  it("does not fetch without a data-source", async () => {
    globalThis.fetch = async (url) => {
      requested.push(url);
      return new Response(SAMPLE, { status: 200 });
    };
    const element = await fixture(
      html`<vcf-render element-visible debounce-delay="0"></vcf-render>`,
    );
    await element.updateComplete;
    await element.loadContactData();
    await aTimeout(20);
    expect(requested).to.deep.equal([]);
  });

  it("takes up a line while waiting, so it can become visible and load", async () => {
    const element = await fixture(
      html`<vcf-render
        data-source="/files/directory.vcf"
        debounce-delay="100000"
      ></vcf-render>`,
    );
    await element.updateComplete;
    expect(element.shadowRoot.textContent).to.contain(
      element.t.loadingContacts,
    );
    expect(element.offsetHeight).to.be.greaterThan(0);
  });

  it("takes up no space when there is nothing to load", async () => {
    const element = await fixture(html`<vcf-render></vcf-render>`);
    await element.updateComplete;
    expect(element.shadowRoot.textContent.trim()).to.equal("");
  });

  it("drops a pending load when it leaves the page", async () => {
    globalThis.fetch = async (url) => {
      requested.push(url);
      return new Response(SAMPLE, { status: 200 });
    };
    const element = await fixture(
      html`<vcf-render
        element-visible
        data-source="/files/directory.vcf"
        debounce-delay="30"
      ></vcf-render>`,
    );
    element.remove();
    await aTimeout(80);
    expect(requested).to.deep.equal([]);
  });
});

describe("VcfRender HAX wiring", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<vcf-render></vcf-render>`);
  });

  it("takes part in gizmo registration", () => {
    expect(element.haxHooks().gizmoRegistration).to.equal(
      "haxgizmoRegistration",
    );
  });

  it("registers vcf as a type HAX can hand to an element", () => {
    const store = { validGizmoTypes: ["image"] };
    element.haxgizmoRegistration(store);
    expect(store.validGizmoTypes).to.contain("vcf");
  });

  it("does not register the same type twice", () => {
    const store = { validGizmoTypes: ["image"] };
    element.haxgizmoRegistration(store);
    element.haxgizmoRegistration(store);
    expect(
      store.validGizmoTypes.filter((type) => type === "vcf").length,
    ).to.equal(1);
  });

  it("survives a store it does not recognise", () => {
    expect(() => element.haxgizmoRegistration(undefined)).to.not.throw();
    expect(() => element.haxgizmoRegistration({})).to.not.throw();
  });

  it("has a schema that matches the element", async () => {
    const schema = await (
      await fetch(element.constructor.haxProperties)
    ).json();
    expect(schema.gizmo.handles[0].type).to.equal("vcf");
    expect(schema.gizmo.handles[0].source).to.equal("dataSource");
    const configure = schema.settings.configure;
    const source = configure.find((field) => field.property === "dataSource");
    expect(source.inputMethod).to.equal("haxupload");
    expect(source.uploadRequirements.extensions).to.deep.equal([".vcf"]);
    // the modes offered in HAX have to be the modes the element can render
    const displayAs = configure.find((field) => field.property === "displayAs");
    expect(Object.keys(displayAs.options)).to.deep.equal(
      element.constructor.displayModes,
    );
    expect(schema.demoSchema[0].tag).to.equal("vcf-render");
  });

  it("has a demo schema that actually renders", async () => {
    const schema = await (
      await fetch(element.constructor.haxProperties)
    ).json();
    const demo = await fixture(html`<vcf-render element-visible></vcf-render>`);
    Object.keys(schema.demoSchema[0].properties).forEach((key) => {
      demo[key] = schema.demoSchema[0].properties[key];
    });
    await waitUntil(() => demo.status === "ready");
    await demo.updateComplete;
    expect(demo.contacts.length).to.be.greaterThan(0);
  });
});
