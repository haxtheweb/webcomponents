#!/usr/bin/env node

/**
 * Console capture for a running demo page.
 *
 * Loads the page headless, progressively scrolls to the bottom so that
 * replace-tag IntersectionObservers fire (mimicking a user scrolling),
 * then dumps every console message / page error for triage.
 *
 * Usage: node console-capture.js [url]
 */

import puppeteer from "puppeteer";

const URL = process.argv[2] || "http://localhost:8000/elements/haxcms-elements/demo/welcome";

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const messages = [];
page.on("console", (msg) => {
  messages.push({
    type: msg.type(),
    text: msg.text(),
    location: msg.location(),
  });
});
page.on("pageerror", (err) => {
  messages.push({
    type: "pageerror",
    text: String(err),
    stack: err && err.stack ? err.stack : "",
    location: {},
  });
});
page.on("requestfailed", (req) => {
  const failure = req.failure() ? req.failure().errorText : "";
  messages.push({
    type: "requestfailed",
    text: `${req.method()} ${req.url()} ${failure}`,
    location: {},
  });
});

// instrument replaceWith so we can see which replace-tag replacements
// eject DOM nodes and where they live when Lit later complains
await page.evaluateOnNewDocument(() => {
  // wrap Lit update (found on the prototype chain) so that any render-time
  // throw reports WHICH element threw it (e.g. the ChildPart parentNode error)
  const patchedOwners = new WeakSet();
  const origDefine = customElements.define;
  customElements.define = function (name, ctor, opts) {
    try {
      let proto = ctor && ctor.prototype;
      while (proto) {
        if (Object.prototype.hasOwnProperty.call(proto, "update")) {
          if (!patchedOwners.has(proto)) {
            patchedOwners.add(proto);
            const origUpdate = proto.update;
            proto.update = function (...args) {
              try {
                return origUpdate.apply(this, args);
              } catch (e) {
                console.log(
                  "UPDATE-THROW in <" +
                    String(this.tagName || name).toLowerCase() +
                    ">: " +
                    (e && e.message ? e.message : e),
                );
                throw e;
              }
            };
          }
          break;
        }
        proto = Object.getPrototypeOf(proto);
      }
    } catch (e) {
      // never let instrumentation break definitions
    }
    if (name === "lrndesign-timeline" && ctor && ctor.prototype) {
      if (typeof ctor.prototype.updateTimeline === "function") {
        const origUT = ctor.prototype.updateTimeline;
        ctor.prototype.updateTimeline = function (...args) {
          try {
            const evEl =
              this.shadowRoot && this.shadowRoot.querySelector("#events");
            let evLen = "?";
            try {
              evLen = (this.eventsList || []).length;
            } catch (e) {
              evLen = "parse-error: " + e.message;
            }
            let chain = [];
            let cur = this;
            let hops = 0;
            while (cur && hops < 6) {
              let label = cur.tagName ? cur.tagName.toLowerCase() : "?";
              if (cur.getAttribute && cur.getAttribute("renderer")) {
                label += "[renderer=" + cur.getAttribute("renderer") + "]";
              }
              chain.push(label);
              if (cur.parentElement) {
                cur = cur.parentElement;
              } else {
                const root = cur.getRootNode();
                cur = root && root.host ? root.host : null;
              }
              hops++;
            }
            console.log(
              "TIMELINE updateTimeline: eventsList=" +
                evLen +
                " eventsAttrLen=" +
                (this.getAttribute("events") || "").length +
                " eventsChildren=" +
                (evEl ? evEl.children.length : "no-#events") +
                " | chain: " +
                chain.join(" <- "),
            );
          } catch (e) {
            // never break the page from logging
          }
          return origUT.apply(this, args);
        };
      }
    }
    return origDefine.call(this, name, ctor, opts);
  };
  const origReplaceWith = Element.prototype.replaceWith;
  Element.prototype.replaceWith = function (...args) {
    try {
      const path = [];
      let el = this;
      let guard = 0;
      while (el && guard < 8) {
        let label = el.tagName ? el.tagName.toLowerCase() : el.nodeName;
        if (el.getAttribute && el.getAttribute("with")) {
          label += "[with=" + el.getAttribute("with") + "]";
        }
        if (el.id) {
          label += "#" + el.id;
        }
        path.push(label);
        if (el.parentElement) {
          el = el.parentElement;
        } else {
          const root = el.getRootNode();
          el = root && root.host ? root.host : null;
        }
        guard++;
      }
      console.log(
        "REPLACEWITH: " +
          (this.tagName || "").toLowerCase() +
          " -> " +
          (args[0] && args[0].tagName ? args[0].tagName.toLowerCase() : "?") +
          " | chain: " +
          path.join(" <- "),
      );
    } catch (e) {
      // never let instrumentation break the page
    }
    return origReplaceWith.apply(this, args);
  };
});

console.log(`Loading ${URL} ...`);
await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
// allow initial render + autoload to settle
await new Promise((r) => setTimeout(r, 5000));

// progressively scroll down then back up to trigger visibility based imports
await page.evaluate(async () => {
  const step = 350;
  const getHeight = () =>
    Math.max(
      document.body ? document.body.scrollHeight : 0,
      document.documentElement.scrollHeight,
    );
  for (let y = 0; y < getHeight(); y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 200));
  }
  window.scrollTo(0, getHeight());
  await new Promise((r) => setTimeout(r, 2000));
  for (let y = getHeight(); y > 0; y -= step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 200));
  }
  window.scrollTo(0, 0);
});
// wait for lazy imports to settle and log anything they throw
await new Promise((r) => setTimeout(r, 10000));

console.log("=== RAW CONSOLE MESSAGES ===");
for (const m of messages) {
  const loc =
    m.location && m.location.url
      ? ` [${m.location.url}:${m.location.lineNumber}]`
      : "";
console.log(`${m.type.toUpperCase()}${loc}: ${m.text}`);
  if (m.stack) {
    console.log(m.stack);
  }
}
console.log(`=== ${messages.length} messages captured ===`);
await browser.close();
