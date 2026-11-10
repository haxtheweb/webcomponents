import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import {
  registerResponsiveElement,
  unregisterResponsiveElement,
  reregisterResponsiveElement,
} from "../responsive-utility.js";

// The utility keeps a ResizeObserver on every registered element, and that
// observer keeps the element alive. These pin the register / unregister /
// reregister contract that elements use from their lifecycle callbacks.

const utility = () => globalThis.ResponsiveUtility.requestAvailability();
const entriesFor = (el) => utility().details.filter((d) => d.element === el);

describe("ResponsiveUtility registration lifecycle", () => {
  let host;
  beforeEach(async () => {
    host = await fixture(html`<div style="width: 800px"></div>`);
  });

  it("registers an element and sets its size attribute", async () => {
    const el = document.createElement("div");
    host.appendChild(el);
    registerResponsiveElement({ element: el, attribute: "responsive-size" });
    expect(entriesFor(el).length).to.equal(1);
    expect(el.getAttribute("responsive-size")).to.be.a("string");
    unregisterResponsiveElement(el);
  });

  it("unregisters, disconnecting the element's ResizeObserver", () => {
    const el = document.createElement("div");
    host.appendChild(el);
    registerResponsiveElement({ element: el, attribute: "responsive-size" });
    const observer = entriesFor(el)[0].observer;
    let disconnected = false;
    const real = observer.disconnect.bind(observer);
    observer.disconnect = () => {
      disconnected = true;
      real();
    };
    unregisterResponsiveElement(el);
    expect(entriesFor(el).length).to.equal(0);
    expect(disconnected).to.equal(true);
  });

  it("re-registers with the remembered request after an unregister", () => {
    const el = document.createElement("div");
    host.appendChild(el);
    registerResponsiveElement({
      element: el,
      attribute: "data-size",
      sm: 10,
      md: 20,
      lg: 30,
      xl: 40,
    });
    unregisterResponsiveElement(el);
    reregisterResponsiveElement(el);
    const entries = entriesFor(el);
    expect(entries.length).to.equal(1);
    expect(entries[0].attribute).to.equal("data-size");
    expect(entries[0].sm).to.equal(10);
    expect(entries[0].xl).to.equal(40);
    unregisterResponsiveElement(el);
  });

  it("never stacks two registrations for one element", () => {
    const el = document.createElement("div");
    host.appendChild(el);
    registerResponsiveElement({ element: el });
    registerResponsiveElement({ element: el });
    globalThis.dispatchEvent(
      new CustomEvent("responsive-element", { detail: { element: el } }),
    );
    expect(entriesFor(el).length).to.equal(1);
    unregisterResponsiveElement(el);
  });

  it("defers registering an element that is not connected, until it is", () => {
    const el = document.createElement("div");
    registerResponsiveElement({ element: el, attribute: "responsive-size" });
    expect(entriesFor(el).length).to.equal(0);
    host.appendChild(el);
    reregisterResponsiveElement(el);
    expect(entriesFor(el).length).to.equal(1);
    unregisterResponsiveElement(el);
  });

  it("ignores calls for elements that never registered", () => {
    const before = utility().details.length;
    unregisterResponsiveElement(document.createElement("div"));
    reregisterResponsiveElement(document.createElement("div"));
    registerResponsiveElement(null);
    registerResponsiveElement({});
    expect(utility().details.length).to.equal(before);
  });

  it("does not grow over many register / unregister cycles", async () => {
    const before = utility().details.length;
    for (let i = 0; i < 50; i++) {
      const el = document.createElement("div");
      host.appendChild(el);
      registerResponsiveElement({ element: el });
      el.remove();
      unregisterResponsiveElement(el);
    }
    await aTimeout(0);
    expect(utility().details.length).to.equal(before);
  });

  it("can fire from the element with its own event flags, also on re-register", async () => {
    const el = document.createElement("div");
    host.appendChild(el);
    const seen = [];
    const listener = (e) => seen.push(e);
    document.addEventListener("responsive-element", listener);
    try {
      registerResponsiveElement(
        { element: el, attribute: "screen" },
        { target: el, eventInit: { bubbles: true, composed: true } },
      );
      unregisterResponsiveElement(el);
      reregisterResponsiveElement(el);
    } finally {
      document.removeEventListener("responsive-element", listener);
    }
    expect(seen.length).to.equal(2);
    seen.forEach((e) => {
      expect(e.target).to.equal(el);
      expect(e.bubbles).to.equal(true);
      expect(e.composed).to.equal(true);
      expect(e.detail.attribute).to.equal("screen");
    });
    expect(entriesFor(el).length).to.equal(1);
    unregisterResponsiveElement(el);
  });

  it("exposes the helpers on globalThis.ResponsiveUtility", () => {
    expect(globalThis.ResponsiveUtility.registerResponsiveElement).to.equal(
      registerResponsiveElement,
    );
    expect(globalThis.ResponsiveUtility.unregisterResponsiveElement).to.equal(
      unregisterResponsiveElement,
    );
    expect(globalThis.ResponsiveUtility.reregisterResponsiveElement).to.equal(
      reregisterResponsiveElement,
    );
  });
});
