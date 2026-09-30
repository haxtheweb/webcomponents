import { fixture, expect, html } from "@open-wc/testing";
import "../user-scaffold.js";

describe("elementName test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<user-scaffold></user-scaffold>`);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("UserScaffold tag and singleton", () => {
  it("has correct tag name", () => {
    expect(globalThis.customElements.get("user-scaffold")).to.exist;
  });

  it("requestAvailability returns a singleton instance", () => {
    const inst1 = globalThis.UserScaffold.requestAvailability();
    const inst2 = globalThis.UserScaffold.requestAvailability();
    expect(inst1).to.equal(inst2);
  });
});

describe("UserScaffold memory operations", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<user-scaffold></user-scaffold>`);
  });
  afterEach(() => {
    element.disconnectedCallback();
  });

  it("writes and reads short-term memory", () => {
    element.writeMemory("testKey", "testValue");
    expect(element.readMemory("testKey")).to.equal("testValue");
  });

  it("increments short-term memory", () => {
    element.writeMemory("counter", 5);
    element.incrementWriteMemory("counter", 3);
    expect(element.readMemory("counter")).to.equal(8);
  });

  it("deletes short-term memory", () => {
    element.writeMemory("tempKey", "tempValue");
    element.deleteMemory("tempKey");
    expect(element.readMemory("tempKey")).to.be.null;
  });

  it("writes and reads long-term memory", () => {
    element.writeMemory("ltKey", "ltValue", "long");
    expect(element.readMemory("ltKey")).to.equal("ltValue");
  });

  it("increments long-term memory", () => {
    element.writeMemory("ltCounter", 10, "long");
    element.incrementWriteMemory("ltCounter", 5, "long");
    expect(element.readMemory("ltCounter")).to.equal(15);
  });

  it("deletes long-term memory", () => {
    element.writeMemory("ltDelete", "val", "long");
    element.deleteMemory("ltDelete", "long");
    expect(element.readMemory("ltDelete")).to.be.null;
  });

  it("readMemory returns null for missing keys", () => {
    expect(element.readMemory("nonexistent")).to.be.null;
  });

  it("memory getter merges long and short term with short overriding", () => {
    element.writeMemory("stOnly", "st", "short");
    element.writeMemory("shared", "st", "short");
    element.writeMemory("shared", "lt", "long");
    const mem = element.memory;
    expect(mem.stOnly).to.equal("st");
    expect(mem.shared).to.equal("st");
  });
});

describe("UserScaffold isBase64", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<user-scaffold></user-scaffold>`);
  });
  afterEach(() => {
    element.disconnectedCallback();
  });

  it("returns false for non-base64 strings", () => {
    expect(element.isBase64("hello world")).to.be.false;
  });

  it("returns true for empty string (atob/btoa round-trip)", () => {
    // btoa(atob("")) === "" so isBase64 returns true for empty string
    expect(element.isBase64("")).to.be.true;
  });

  it("returns true for valid base64 strings", () => {
    expect(element.isBase64("dGVzdA==")).to.be.true;
  });
});

describe("UserScaffold user action handlers", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<user-scaffold></user-scaffold>`);
  });
  afterEach(() => {
    element.disconnectedCallback();
  });

  it("userMouseAction records click and resets delay", () => {
    const fakeEvent = {
      isTrusted: true,
      target: globalThis.document.body,
    };
    element.userMouseAction(fakeEvent);
    expect(element.action.type).to.equal("click");
    expect(element.action.architype).to.equal("input");
    // BUG: readMemory returns null for 0 because `if (this.memory[key])` is falsy for 0
    // writeMemory stores 0, but readMemory treats it as missing
    expect(element.readMemory("interactionDelay")).to.be.null;
    expect(element.readMemory("interactionCount")).to.equal(1);
  });

  it("userMouseAction ignores synthetic events", () => {
    const fakeEvent = {
      isTrusted: false,
      target: globalThis.document.body,
    };
    element.userMouseAction(fakeEvent);
    expect(element.action.type).to.not.equal("click");
  });

  it("userMouseAction increments interactionCount on each click", () => {
    const fakeEvent = {
      isTrusted: true,
      target: globalThis.document.body,
    };
    element.userMouseAction(fakeEvent);
    element.userMouseAction(fakeEvent);
    element.userMouseAction(fakeEvent);
    expect(element.readMemory("interactionCount")).to.equal(3);
  });

  it("userKeyDownAction records key input", () => {
    const fakeEvent = {
      isTrusted: true,
      key: "a",
      target: globalThis.document.body,
    };
    element.userKeyDownAction(fakeEvent);
    expect(element.action.type).to.equal("key");
    expect(element.action.architype).to.equal("input");
    expect(element.data.value).to.equal("a");
    expect(element.data.raw).to.equal("a");
    expect(element.data.architype).to.equal("text");
    // BUG: readMemory returns null for 0 because `if (this.memory[key])` is falsy for 0
    expect(element.readMemory("interactionDelay")).to.be.null;
  });

  it("userKeyDownAction ignores synthetic events", () => {
    const fakeEvent = {
      isTrusted: false,
      key: "a",
      target: globalThis.document.body,
    };
    element.userKeyDownAction(fakeEvent);
    expect(element.action.type).to.not.equal("key");
  });

  it("userDragAction records drag with items", () => {
    const fakeEvent = {
      isTrusted: true,
      dataTransfer: {
        items: [{ kind: "file", type: "text/plain" }],
      },
    };
    element.userDragAction(fakeEvent);
    expect(element.action.type).to.equal("drag");
    expect(element.data.raw).to.equal("text/plain");
    expect(element.data.architype).to.equal("file");
  });

  it("userDragAction ignores synthetic events", () => {
    const fakeEvent = {
      isTrusted: false,
      dataTransfer: {
        items: [{ kind: "file", type: "text/plain" }],
      },
    };
    element.userDragAction(fakeEvent);
    expect(element.action.type).to.not.equal("drag");
  });

  it("userDragAction ignores events without dataTransfer items", () => {
    const fakeEvent = {
      isTrusted: true,
      dataTransfer: { items: [] },
    };
    element.userDragAction(fakeEvent);
    expect(element.action.type).to.not.equal("drag");
  });

  it("userDropAction records file drop via items interface", () => {
    const fakeFile = { name: "test.txt" };
    const fakeEvent = {
      isTrusted: true,
      preventDefault: () => {},
      stopPropagation: () => {},
      stopImmediatePropagation: () => {},
      dataTransfer: {
        items: [
          { kind: "file", getAsFile: () => fakeFile, type: "text/plain" },
        ],
      },
    };
    element.userDropAction(fakeEvent);
    expect(element.action.type).to.equal("drop");
    expect(element.action.architype).to.equal("input");
    expect(element.data.file.name).to.equal("test.txt");
    expect(element.data.raw).to.equal("text/plain");
    expect(element.data.architype).to.equal("file");
  });

  it("userDropAction ignores non-file items", () => {
    const fakeEvent = {
      isTrusted: true,
      preventDefault: () => {},
      stopPropagation: () => {},
      stopImmediatePropagation: () => {},
      dataTransfer: {
        items: [{ kind: "string", type: "text/plain" }],
      },
    };
    element.userDropAction(fakeEvent);
    expect(element.action.type).to.not.equal("drop");
  });

  it("userDropAction ignores synthetic events", () => {
    const fakeEvent = {
      isTrusted: false,
      preventDefault: () => {},
      stopPropagation: () => {},
      stopImmediatePropagation: () => {},
      dataTransfer: {
        items: [{ kind: "file", getAsFile: () => ({}), type: "text/plain" }],
      },
    };
    element.userDropAction(fakeEvent);
    expect(element.action.type).to.not.equal("drop");
  });

  it("userDropAction calls preventDefault, stopPropagation, stopImmediatePropagation", () => {
    let prevented = false;
    let stopped = false;
    let immediateStopped = false;
    const fakeEvent = {
      isTrusted: true,
      preventDefault: () => { prevented = true; },
      stopPropagation: () => { stopped = true; },
      stopImmediatePropagation: () => { immediateStopped = true; },
      dataTransfer: { items: [] },
    };
    element.userDropAction(fakeEvent);
    expect(prevented).to.be.true;
    expect(stopped).to.be.true;
    expect(immediateStopped).to.be.true;
  });

  it("userPasteAction records plain text paste", () => {
    const fakeEvent = {
      isTrusted: true,
      clipboardData: {
        getData: (type) => (type === "text/html" ? "" : "Hello paste"),
        files: [],
      },
    };
    element.userPasteAction(fakeEvent);
    expect(element.action.type).to.equal("paste");
    expect(element.action.architype).to.equal("input");
    expect(element.data.value).to.equal("Hello paste");
    expect(element.data.architype).to.equal("text");
  });

  it("userPasteAction records html paste", () => {
    const fakeEvent = {
      isTrusted: true,
      clipboardData: {
        getData: (type) =>
          type === "text/html"
            ? '<div style="color:red;">Hello</div>'
            : "",
        files: [],
      },
    };
    element.userPasteAction(fakeEvent);
    expect(element.action.type).to.equal("paste");
    expect(element.data.architype).to.equal("text/html");
    // div should be converted to p, style should be stripped (regex requires trailing ;)
    expect(element.data.value).to.contain("<p");
    expect(element.data.value).to.not.contain("style=");
  });

  it("userPasteAction cleans empty span tags", () => {
    const fakeEvent = {
      isTrusted: true,
      clipboardData: {
        getData: (type) =>
          type === "text/html" ? "<span></span>text" : "",
        files: [],
      },
    };
    element.userPasteAction(fakeEvent);
    expect(element.data.value).to.not.contain("<span></span>");
  });

  it("userPasteAction ignores synthetic events", () => {
    const fakeEvent = {
      isTrusted: false,
      clipboardData: {
        getData: () => "text",
        files: [],
      },
    };
    element.userPasteAction(fakeEvent);
    expect(element.action.type).to.not.equal("paste");
  });
});

describe("UserScaffold disconnectedCallback", () => {
  it("clears the interaction interval", async () => {
    const element = await fixture(html`<user-scaffold></user-scaffold>`);
    expect(element.interactionInterval).to.not.be.null;
    element.disconnectedCallback();
    expect(element.interactionInterval).to.be.null;
  });

  it("aborts window controllers", async () => {
    const element = await fixture(html`<user-scaffold></user-scaffold>`);
    let aborted = false;
    element.windowControllers.signal.addEventListener("abort", () => {
      aborted = true;
    });
    element.disconnectedCallback();
    expect(aborted).to.be.true;
  });
});

describe("UserScaffold debug mode", () => {
  it("debug=true triggers console.trace via autorun", async () => {
    const element = await fixture(html`<user-scaffold></user-scaffold>`);
    let traced = false;
    const originalTrace = console.trace;
    console.trace = () => {
      traced = true;
    };
    element.debug = true;
    expect(traced).to.be.true;
    console.trace = originalTrace;
    element.debug = false;
    element.disconnectedCallback();
  });
});

describe("UserScaffold interval polling", () => {
  it("has an interaction interval set in constructor", async () => {
    const element = await fixture(html`<user-scaffold></user-scaffold>`);
    expect(element.interactionInterval).to.not.be.null;
    expect(typeof element.interactionInterval).to.equal("number");
    element.disconnectedCallback();
  });

  it("increments interactionDelay when active", async () => {
    const element = await fixture(html`<user-scaffold></user-scaffold>`);
    const before = element.readMemory("interactionDelay") || 0;
 // trigger a manual increment
    element.incrementWriteMemory(
      "interactionDelay",
      300,
    );
    expect(element.readMemory("interactionDelay")).to.equal(before + 300);
    element.disconnectedCallback();
  });
});

describe("UserScaffold paste architype detection", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<user-scaffold></user-scaffold>`);
  });
  afterEach(() => {
    element.disconnectedCallback();
  });

  it("userPasteAction detects base64 content", () => {
    const fakeEvent = {
      isTrusted: true,
      clipboardData: {
        getData: (type) => (type === "text/html" ? "" : "dGVzdA=="),
        files: [],
      },
    };
    element.userPasteAction(fakeEvent);
    expect(element.data.architype).to.equal("base64");
    expect(element.data.raw).to.equal("dGVzdA==");
    // BUG: user-scaffold.js:192 assigns `safe = this.isBase64(pasteContent)`
    // which stores the boolean true instead of the pasted string as data.value
    expect(element.data.value).to.equal(true);
  });

  it("userPasteAction detects single file", () => {
    const fakeEvent = {
      isTrusted: true,
      clipboardData: {
        getData: (type) => (type === "text/html" ? "" : "pasted file text"),
        files: [{ name: "a.txt" }],
      },
    };
    element.userPasteAction(fakeEvent);
    expect(element.data.architype).to.equal("file");
    expect(element.data.value).to.equal("pasted file text");
  });

  it("userPasteAction detects multiple files", () => {
    const fakeEvent = {
      isTrusted: true,
      clipboardData: {
        getData: (type) => (type === "text/html" ? "" : "pasted files text"),
        files: [{ name: "a.txt" }, { name: "b.txt" }],
      },
    };
    element.userPasteAction(fakeEvent);
    expect(element.data.architype).to.equal("files");
    expect(element.data.value).to.equal("pasted files text");
  });

  it("userPasteAction detects url", () => {
    const fakeEvent = {
      isTrusted: true,
      clipboardData: {
        getData: (type) => (type === "text/html" ? "" : "https://example.com"),
        files: [],
      },
    };
    element.userPasteAction(fakeEvent);
    expect(element.data.architype).to.equal("url");
    expect(element.data.value).to.equal("https://example.com");
  });

  it("userPasteAction falls back to globalThis.clipboardData when event has none", () => {
    // IE-style path: event lacks clipboardData entirely
    globalThis.clipboardData = {
      getData: () => "dGVzdA==",
    };
    const fakeEvent = {
      isTrusted: true,
      clipboardData: undefined,
      originalEvent: { clipboardData: undefined },
    };
    element.userPasteAction(fakeEvent);
    expect(element.action.type).to.equal("paste");
    expect(element.data.architype).to.equal("base64");
    expect(element.data.raw).to.equal("dGVzdA==");
    // BUG: same as above, data.value is boolean true instead of the string
    expect(element.data.value).to.equal(true);
    delete globalThis.clipboardData;
  });
});

describe("UserScaffold drop via DataTransfer files interface", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<user-scaffold></user-scaffold>`);
  });
  afterEach(() => {
    element.disconnectedCallback();
  });

  it("userDropAction with no items and empty files does nothing", () => {
    const fakeEvent = {
      isTrusted: true,
      preventDefault: () => {},
      stopPropagation: () => {},
      stopImmediatePropagation: () => {},
      dataTransfer: { files: [] },
    };
    element.userDropAction(fakeEvent);
    expect(element.action.type).to.not.equal("drop");
  });

  it("userDropAction with files and no items throws reading items[0]", () => {
    // BUG: user-scaffold.js:244-246 the files-fallback branch reads
    // e.dataTransfer.items[0].type/kind, but this branch only runs when
    // e.dataTransfer.items is absent, so it throws a TypeError
    const fakeEvent = {
      isTrusted: true,
      preventDefault: () => {},
      stopPropagation: () => {},
      stopImmediatePropagation: () => {},
      dataTransfer: { files: [{ name: "test.txt" }] },
    };
    expect(() => element.userDropAction(fakeEvent)).to.throw();
    // the action assignment happens before the failing data assignment
    expect(element.action.type).to.equal("drop");
    expect(element.action.architype).to.equal("input");
  });
});
