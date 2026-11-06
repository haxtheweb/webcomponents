/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Target segmenter for instructional elements that let a learner point at
 * part of an authored reading: a sentence, a paragraph or a figure.
 *
 * It never touches the authored light DOM. It clones the authored nodes into
 * a container the element owns (its shadow root) and wraps targets there, so
 * nothing it adds can be saved back into content.
 */

// media a learner can point at as a whole; an img inside a figure belongs to
// the figure
export const MEDIA_SELECTOR =
  "figure, img, media-image, simple-img, video-player, audio-player, a11y-figure";
// blocks of running text
export const BLOCK_SELECTOR = "p, li, blockquote, dd";
// never copied into the reading
const DROP_SELECTOR =
  "script, style, template, iframe, object, embed, input, [slot]";

export function normalizeText(s) {
  return String(s == null ? "" : s)
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Sentences in text: [{ start, end }] that cover the text end to end.
 * Uses Intl.Segmenter where it exists, otherwise a punctuation rule.
 */
export function sentenceRanges(text, lang) {
  const str = String(text || "");
  const out = [];
  if (globalThis.Intl && typeof globalThis.Intl.Segmenter === "function") {
    let seg = null;
    try {
      seg = new globalThis.Intl.Segmenter(lang || undefined, {
        granularity: "sentence",
      });
    } catch {
      seg = new globalThis.Intl.Segmenter(undefined, {
        granularity: "sentence",
      });
    }
    for (const part of seg.segment(str)) {
      out.push({ start: part.index, end: part.index + part.segment.length });
    }
    return out;
  }
  // no Intl.Segmenter: one linear pass, a sentence ends after a run of
  // end punctuation, closing quotes or brackets, and the space after them
  const ends = ".!?。！？";
  const closers = "\"'”’)]";
  let start = 0;
  let i = 0;
  while (i < str.length) {
    if (ends.includes(str[i])) {
      let j = i;
      while (j < str.length && ends.includes(str[j])) {
        j++;
      }
      while (j < str.length && closers.includes(str[j])) {
        j++;
      }
      // "site.json" or "3.5" do not end a sentence: only space or the end
      // of the text after the punctuation does
      if (j < str.length && !/\s/.test(str[j])) {
        i = j;
        continue;
      }
      while (j < str.length && /\s/.test(str[j])) {
        j++;
      }
      out.push({ start, end: j });
      start = j;
      i = j;
    } else {
      i++;
    }
  }
  if (start < str.length) {
    out.push({ start, end: str.length });
  }
  return out;
}

// what a figure is called for xAPI and for the learner: its caption, else
// its alternative text, else the file name
export function mediaText(el) {
  const cap = el.querySelector && el.querySelector("figcaption");
  if (cap && normalizeText(cap.textContent)) {
    return normalizeText(cap.textContent);
  }
  const img =
    el.matches && el.matches("img") ? el : el.querySelector("img, [alt]");
  const alt =
    (el.getAttribute && el.getAttribute("alt")) ||
    (img && img.getAttribute && img.getAttribute("alt"));
  if (normalizeText(alt)) {
    return normalizeText(alt);
  }
  const title = el.getAttribute && el.getAttribute("title");
  if (normalizeText(title)) {
    return normalizeText(title);
  }
  const src =
    (el.getAttribute && el.getAttribute("source")) ||
    (el.getAttribute && el.getAttribute("src")) ||
    (img && img.getAttribute && img.getAttribute("src")) ||
    "";
  return normalizeText(String(src).split("/").pop()) || "figure";
}

// copy one authored node without anything that could run
function safeClone(node) {
  const copy = node.cloneNode(true);
  if (copy.nodeType !== 1) {
    return copy;
  }
  const all = [copy, ...copy.querySelectorAll("*")];
  all.forEach((el) => {
    Array.from(el.attributes).forEach((a) => {
      const n = a.name.toLowerCase();
      if (n.startsWith("on") || n === "contenteditable" || n === "tabindex") {
        el.removeAttribute(a.name);
      }
      if (
        (n === "href" || n === "src" || n === "xlink:href") &&
        /^\s*javascript:/i.test(a.value)
      ) {
        el.removeAttribute(a.name);
      }
    });
  });
  copy.querySelectorAll(DROP_SELECTOR).forEach((el) => el.remove());
  return copy;
}

// text nodes under root in order, skipping media
function textNodesIn(root) {
  const out = [];
  const walker = root.ownerDocument.createTreeWalker(root, 4, {
    acceptNode(n) {
      const p = n.parentElement;
      if (p && p.closest(MEDIA_SELECTOR)) {
        return 2;
      }
      return 1;
    },
  });
  let n = walker.nextNode();
  while (n) {
    out.push(n);
    n = walker.nextNode();
  }
  return out;
}

// outermost blocks only (an li inside a blockquote is not a second target)
function topBlocks(root) {
  return Array.from(root.querySelectorAll(BLOCK_SELECTOR)).filter(
    (el) =>
      !el.parentElement.closest(BLOCK_SELECTOR) &&
      !el.closest(MEDIA_SELECTOR) &&
      normalizeText(el.textContent),
  );
}

function topMedia(root) {
  return Array.from(root.querySelectorAll(MEDIA_SELECTOR)).filter(
    (el) => !el.parentElement || !el.parentElement.closest(MEDIA_SELECTOR),
  );
}

// wrap each sentence of a block in spans; a sentence that crosses inline
// markup becomes several spans that share one index
function wrapSentences(block, lang, startIndex) {
  const nodes = textNodesIn(block);
  let full = "";
  const offsets = nodes.map((n) => {
    const at = full.length;
    full += n.data;
    return at;
  });
  const ranges = sentenceRanges(full, lang).filter((r) =>
    normalizeText(full.slice(r.start, r.end)),
  );
  const found = ranges.map((r, i) => ({
    index: startIndex + i,
    text: normalizeText(full.slice(r.start, r.end)),
    els: [],
  }));
  nodes.forEach((node, ni) => {
    const nStart = offsets[ni];
    const nEnd = nStart + node.data.length;
    const frag = block.ownerDocument.createDocumentFragment();
    let cursor = nStart;
    ranges.forEach((r, ri) => {
      const s = Math.max(r.start, nStart);
      const e = Math.min(r.end, nEnd);
      if (e <= s) {
        return;
      }
      if (s > cursor) {
        frag.appendChild(
          block.ownerDocument.createTextNode(
            node.data.slice(cursor - nStart, s - nStart),
          ),
        );
      }
      const piece = node.data.slice(s - nStart, e - nStart);
      if (normalizeText(piece)) {
        const span = block.ownerDocument.createElement("span");
        span.className = "ra-t";
        span.setAttribute("data-ti", String(found[ri].index));
        span.textContent = piece;
        found[ri].els.push(span);
        frag.appendChild(span);
      } else {
        frag.appendChild(block.ownerDocument.createTextNode(piece));
      }
      cursor = e;
    });
    if (cursor < nEnd) {
      frag.appendChild(
        block.ownerDocument.createTextNode(node.data.slice(cursor - nStart)),
      );
    }
    node.parentNode.replaceChild(frag, node);
  });
  return found.filter((t) => t.els.length);
}

/**
 * Copy authored nodes into container and mark what a learner can point at.
 * @param {Node[]} sourceNodes authored nodes, in order
 * @param {Element} container where the copy goes (emptied first)
 * @param {string} unit "sentence", "paragraph" or "figure"
 * @param {string} [lang]
 * @returns {Array<{index:number, kind:string, text:string, els:Element[]}>}
 *   targets in reading order
 */
export function buildReading(sourceNodes, container, unit, lang) {
  container.textContent = "";
  (sourceNodes || []).forEach((n) => {
    if (n.nodeType === 1 && n.matches(DROP_SELECTOR)) {
      return;
    }
    if (n.nodeType === 1 || n.nodeType === 3) {
      container.appendChild(safeClone(n));
    }
  });
  const targets = [];
  let index = 0;
  if (unit === "sentence" || unit === "paragraph") {
    topBlocks(container).forEach((block) => {
      if (unit === "paragraph") {
        block.classList.add("ra-t");
        block.setAttribute("data-ti", String(index));
        targets.push({
          index,
          kind: "paragraph",
          text: normalizeText(block.textContent),
          els: [block],
        });
        index++;
      } else {
        wrapSentences(block, lang, index).forEach((t) => {
          targets.push({ ...t, kind: "sentence" });
          index = t.index + 1;
        });
      }
    });
  }
  // media get a wrapper: role="button" is not allowed on figure or img
  topMedia(container).forEach((el) => {
    const wrap = container.ownerDocument.createElement("div");
    wrap.className = "ra-t ra-media";
    wrap.setAttribute("data-ti", String(index));
    const text = mediaText(el);
    el.parentNode.insertBefore(wrap, el);
    wrap.appendChild(el);
    targets.push({ index, kind: "figure", text, els: [wrap] });
    index++;
  });
  // reading order: by position of each target's first element
  targets.sort((a, b) =>
    a.els[0] === b.els[0]
      ? 0
      : a.els[0].compareDocumentPosition(b.els[0]) & 4
        ? -1
        : 1,
  );
  return targets;
}
