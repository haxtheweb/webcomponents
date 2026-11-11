/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */

/**
 * Draws what the page outline (hax-map) is doing onto the page itself, in a
 * layer of hax-body's shadow DOM that sits over the content:
 * - selected: blocks checked in the outline get a blue scrim
 * - tree: the block (a heading with its section) under the pointer or
 *   keyboard focus in the outline, with a bar down its left edge, as
 *   outline-designer draws a branch
 * - moving: the blocks a drag carries, outlined like in-page drag
 * - drop: where they would land, in the drop zone look of in-page drag
 * It also animates changes: moved blocks slide from where they were and
 * flash, deleted ones leave a fading hatch where they were.
 * Nothing here touches the content: marks are separate boxes positioned
 * from the content's rectangles, and the slide uses the Web Animations API,
 * which writes no attributes, so saving and undo never see it.
 */

const SLIDE_MS = 260;
const FADE_MS = 700;
// how far a scrim reaches past the block, like the active block's outline
const PAD = 4;

function reducedMotion() {
  return (
    !!globalThis.matchMedia &&
    globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function slotOf(node) {
  return (node && node.getAttribute && node.getAttribute("slot")) || "";
}

export class HaxOutlineMarks {
  constructor(host, layer) {
    this.host = host;
    this.layer = layer;
    this.marks = null;
    this.__frame = null;
    this.__resize = null;
  }

  /**
   * marks: { selected: [nodes], tree: [nodes], moving: [nodes],
   *   drop: { parent, slot, before, into } } or null to clear.
   */
  set(marks) {
    this.marks = marks;
    this._watch(!!marks);
    this.draw();
  }

  clear() {
    this.set(null);
  }

  // redraw on the next frame (layout changed under the marks)
  schedule() {
    if (this.__frame || !this.marks) {
      return;
    }
    this.__frame = requestAnimationFrame(() => {
      this.__frame = null;
      this.draw();
    });
  }

  _watch(on) {
    if (on && !this.__resize && globalThis.ResizeObserver) {
      this.__resize = new ResizeObserver(() => this.schedule());
      this.__resize.observe(this.host);
    } else if (!on && this.__resize) {
      this.__resize.disconnect();
      this.__resize = null;
    }
  }

  // the layer fills the host's padding box; measured from the host so it
  // holds even while the layer is not displayed
  _origin() {
    const r = this.host.getBoundingClientRect();
    return {
      x: r.left + (this.host.clientLeft || 0),
      y: r.top + (this.host.clientTop || 0),
    };
  }

  _box(rect, origin, pad = PAD) {
    return {
      left: rect.left - origin.x - pad,
      top: rect.top - origin.y - pad,
      width: rect.width + pad * 2,
      height: rect.height + pad * 2,
    };
  }

  _visible(node) {
    if (!node || !node.isConnected || !node.getBoundingClientRect) {
      return null;
    }
    const rect = node.getBoundingClientRect();
    return rect.width || rect.height ? rect : null;
  }

  _el(kind, box) {
    const el = globalThis.document.createElement("div");
    el.className = `mark ${kind}`;
    el.style.left = `${Math.round(box.left)}px`;
    el.style.top = `${Math.round(box.top)}px`;
    el.style.width = `${Math.max(0, Math.round(box.width))}px`;
    el.style.height = `${Math.max(0, Math.round(box.height))}px`;
    return el;
  }

  draw() {
    // fading marks (flash, ghost) live on until their animation ends
    const keep = [...this.layer.querySelectorAll(".mark.fading")];
    const out = [];
    const marks = this.marks;
    if (marks) {
      const origin = this._origin();
      const tree = (marks.tree || [])
        .map((n) => this._visible(n))
        .filter((r) => r);
      if (tree.length > 0) {
        tree.forEach((rect) =>
          out.push(this._el("tree", this._box(rect, origin))),
        );
        const top = Math.min(...tree.map((r) => r.top));
        const bottom = Math.max(...tree.map((r) => r.bottom));
        const left = Math.min(...tree.map((r) => r.left));
        out.push(
          this._el("tree-bar", {
            left: left - origin.x - PAD * 3,
            top: top - origin.y - PAD,
            width: 3,
            height: bottom - top + PAD * 2,
          }),
        );
      }
      (marks.selected || []).forEach((n) => {
        const rect = this._visible(n);
        if (rect) {
          out.push(this._el("selected", this._box(rect, origin)));
        }
      });
      (marks.moving || []).forEach((n) => {
        const rect = this._visible(n);
        if (rect) {
          out.push(this._el("moving", this._box(rect, origin)));
        }
      });
      const drop = marks.drop ? this._dropBox(marks.drop, origin) : null;
      if (drop) {
        out.push(this._el(drop.kind, drop.box));
      }
    }
    this.layer.replaceChildren(...out, ...keep);
  }

  // the part of a layout a slot fills, or the layout itself
  _slotRect(parent, slot) {
    if (parent === this.host) {
      return this.host.getBoundingClientRect();
    }
    const root = parent.shadowRoot;
    if (root && slot) {
      const region =
        root.querySelector(`[data-layout-slotname="${slot}"]`) ||
        (root.querySelector(`slot[name="${slot}"]`) || {}).parentElement;
      const rect = this._visible(region);
      if (rect) {
        return rect;
      }
    }
    return this._visible(parent);
  }

  _dropBox(drop, origin) {
    const { parent, before } = drop;
    if (!parent || !parent.isConnected) {
      return null;
    }
    const slot = drop.slot || "";
    const area = this._slotRect(parent, slot);
    if (!area) {
      return null;
    }
    if (drop.into) {
      return { kind: "drop-into", box: this._box(area, origin) };
    }
    const kids = [...parent.children].filter(
      (c) =>
        (parent === this.host ? true : slotOf(c) === slot) && this._visible(c),
    );
    let y = null;
    const beforeRect = this._visible(before);
    if (beforeRect) {
      y = beforeRect.top - PAD * 2;
    } else if (kids.length > 0) {
      y = this._visible(kids[kids.length - 1]).bottom + PAD * 2;
    } else {
      // an empty slot: the whole slot is the drop zone
      return { kind: "drop-into", box: this._box(area, origin) };
    }
    const line = PAD * 3;
    return {
      kind: "drop",
      box: {
        left: area.left - origin.x,
        top: y - origin.y - line / 2,
        width: area.width,
        height: line,
      },
    };
  }

  /**
   * Runs change() (which moves or removes content) so that the given nodes
   * slide from where they were to where they end up, and the ones in
   * options.flash light up as they land, options.gone leave a fading
   * hatch where they were. Returns what change() returns.
   */
  animate(nodes, change, options = {}) {
    const still = reducedMotion();
    const origin = this._origin();
    const before = new Map();
    nodes.forEach((n) => {
      const rect = this._visible(n);
      if (rect) {
        before.set(n, rect);
      }
    });
    const ghosts = (options.gone || [])
      .map((n) => before.get(n) || this._visible(n))
      .filter((r) => r)
      .map((rect) => this._box(rect, origin));
    const result = change();
    const flash = options.flash || [];
    const after = this._origin();
    ghosts.forEach((box) => this._fade("ghost", box, still));
    before.forEach((rect, n) => {
      const now = this._visible(n);
      if (!now) {
        return;
      }
      const dx = rect.left - now.left;
      const dy = rect.top - now.top;
      if (!still && (dx || dy) && typeof n.animate === "function") {
        n.animate(
          [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }],
          { duration: SLIDE_MS, easing: "cubic-bezier(0.2, 0, 0, 1)" },
        );
      }
      if (flash.includes(n)) {
        this._fade("flash", this._box(now, after), still, { dx, dy });
      }
    });
    this.draw();
    return result;
  }

  _fade(kind, box, still, from = { dx: 0, dy: 0 }) {
    const el = this._el(`${kind} fading`, box);
    this.layer.appendChild(el);
    const done = () => el.remove();
    if (typeof el.animate !== "function") {
      setTimeout(done, FADE_MS);
      return;
    }
    const slide = `translate(${from.dx}px, ${from.dy}px)`;
    const frames = still
      ? [{ opacity: 1 }, { opacity: 1, offset: 0.6 }, { opacity: 0 }]
      : [
          { opacity: 1, transform: slide },
          { opacity: 1, transform: "none", offset: SLIDE_MS / FADE_MS },
          { opacity: 0, transform: "none" },
        ];
    el.animate(frames, { duration: FADE_MS, easing: "ease-out" }).finished.then(
      done,
      done,
    );
  }
}
