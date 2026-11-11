import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import "../chartist-render.js";

// The observer getter used to build a new MutationObserver on every read,
// so disconnectedCallback stopped a fresh one and the observing one kept
// the element alive. The HAX editor moves blocks by removing and re-adding
// them, so a reconnected element must observe again.
describe("chartist-render MutationObserver across removal and moves", () => {
  // queued records prove the observer still watches (takeRecords drains them)
  const watching = (el, observer) => {
    el.appendChild(globalThis.document.createElement("span"));
    const n = observer.takeRecords().length;
    el.lastElementChild.remove();
    observer.takeRecords();
    return n > 0;
  };

  it("keeps one observer per instance, stops it on removal and restarts it on reconnect", async () => {
    const wrap = await fixture(
      html`<div><chartist-render type="bar"></chartist-render></div>`,
    );
    const el = wrap.querySelector("chartist-render");
    await el.updateComplete;
    expect(el.observer).to.equal(el.observer);
    expect(watching(el, el.observer)).to.equal(true);

    el.remove();
    expect(watching(el, el.observer)).to.equal(false);

    wrap.appendChild(el);
    await el.updateComplete;
    expect(watching(el, el.observer)).to.equal(true);
  });
});

describe("chartist-render chart across removal and moves", () => {
  it("detaches the Chartist chart (and its window resize listener) on removal and redraws on reconnect", async () => {
    const wrap = await fixture(
      html`<div>
        <chartist-render type="bar">
          <table>
            <tbody>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
              </tr>
            </tbody>
          </table>
        </chartist-render>
      </div>`,
    );
    const el = wrap.querySelector("chartist-render");
    // Chartist draws its svg a tick after the chart object exists, so wait
    // for the drawing itself, not just el.chart
    const drawn = () =>
      el.shadowRoot.querySelector("#chart") &&
      el.shadowRoot.querySelector("#chart").querySelector("svg");
    await waitUntil(() => el.chart && drawn(), "chart never drew", {
      timeout: 10000,
    });
    const first = el.chart;
    let detached = false;
    const detach = first.detach.bind(first);
    first.detach = () => {
      detached = true;
      return detach();
    };
    el.remove();
    expect(detached).to.equal(true);
    expect(el.chart).to.equal(null);

    wrap.appendChild(el);
    expect(el.chart).to.exist;
    expect(el.chart).to.not.equal(first);
    // the new chart redraws on its own next tick
    await waitUntil(drawn, "chart did not redraw on reconnect", {
      timeout: 5000,
    });
  });
});
