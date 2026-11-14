/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Turns a Mermaid flowchart into the plain data the text alternative of
 * mermaid-diagram is written from:
 *
 *   { steps: [ { label, decision, links: [ { label, target } ] } ] }
 *
 * flowchartFromDb reads the graph Mermaid already parsed (the flowchart
 * db of mermaidAPI.getDiagramFromText). parseFlowchartSource is the small
 * tolerant reader used when that graph is not available: it understands
 * the common "A[Label] --> B{Decision}" and "-->|label|" forms and returns
 * null for anything else, so the element says the diagram is described by
 * its source instead of describing it wrongly.
 *
 * Both are pure functions of their input (no DOM, no globals) and every
 * scan below is a single pass over the text.
 */

/** the opening of a node shape and what closes it, longest first */
const SHAPES = [
  ["(((", ")))", false],
  ["((", "))", false],
  ["([", "])", false],
  ["[[", "]]", false],
  ["[(", ")]", false],
  ["[/", "/]", false],
  ["[\\", "\\]", false],
  ["{{", "}}", false],
  ["[", "]", false],
  ["(", ")", false],
  ["{", "}", true],
  [">", "]", false],
];

/** lines that style or wire the chart and say nothing about its steps */
const SKIPPED = [
  "subgraph",
  "end",
  "direction",
  "classDef",
  "class",
  "style",
  "linkStyle",
  "click",
  "accTitle",
  "accDescr",
];

const isIdChar = (ch) =>
  (ch >= "a" && ch <= "z") ||
  (ch >= "A" && ch <= "Z") ||
  (ch >= "0" && ch <= "9") ||
  ch === "_";

const isLineChar = (ch) => ch === "-" || ch === "=" || ch === ".";

/**
 * Text without markup: Mermaid labels may carry line breaks and inline
 * tags, which have no place in a sentence. One pass, no regex on tags.
 * @param {String} value
 * @returns {String}
 */
export function plainLabel(value) {
  const text = String(value === undefined || value === null ? "" : value);
  let out = "";
  let inTag = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inTag) {
      if (ch === ">") {
        inTag = false;
        out += " ";
      }
    } else if (ch === "<") {
      inTag = true;
    } else {
      out += ch;
    }
  }
  // quotes and markdown string ticks around a label are syntax, not text
  out = out.split(/\s+/).join(" ").trim();
  while (
    out.length > 1 &&
    (out[0] === '"' || out[0] === "`") &&
    out[out.length - 1] === out[0]
  ) {
    out = out.slice(1, -1).trim();
  }
  return out;
}

function makeGraph() {
  return { order: [], nodes: new Map(), links: [] };
}

function addNode(graph, id, label, decision) {
  let node = graph.nodes.get(id);
  if (!node) {
    node = { label: "", decision: false };
    graph.nodes.set(id, node);
    graph.order.push(id);
  }
  if (label) {
    node.label = label;
  }
  if (decision) {
    node.decision = true;
  }
}

function toSteps(graph) {
  if (!graph.order.length) {
    return null;
  }
  const name = (id) => graph.nodes.get(id).label || id;
  return {
    steps: graph.order.map((id) => ({
      label: name(id),
      decision: graph.nodes.get(id).decision,
      links: graph.links
        .filter((link) => link.from === id)
        .map((link) => ({ label: link.label, target: name(link.to) })),
    })),
  };
}

/**
 * The steps of a flowchart Mermaid parsed.
 * @param {Object} db the flowchart db (getVertices, getEdges)
 * @returns {Object|null} { steps } or null when db is not a flowchart db
 */
export function flowchartFromDb(db) {
  if (
    !db ||
    typeof db.getVertices !== "function" ||
    typeof db.getEdges !== "function"
  ) {
    return null;
  }
  const vertices = db.getVertices();
  const edges = db.getEdges();
  if (!vertices || !Array.isArray(edges)) {
    return null;
  }
  const list =
    typeof vertices.values === "function"
      ? Array.from(vertices.values())
      : Object.keys(vertices).map((key) => vertices[key]);
  const graph = makeGraph();
  list.forEach((vertex) => {
    if (vertex && vertex.id !== undefined) {
      addNode(
        graph,
        String(vertex.id),
        plainLabel(vertex.text),
        vertex.type === "diamond",
      );
    }
  });
  edges.forEach((edge) => {
    if (
      edge &&
      graph.nodes.has(String(edge.start)) &&
      graph.nodes.has(String(edge.end))
    ) {
      graph.links.push({
        from: String(edge.start),
        to: String(edge.end),
        label: plainLabel(edge.text),
      });
    }
  });
  return toSteps(graph);
}

/** read "id" or "id[label]" at pos; null when there is no node there */
function readNode(line, start) {
  let pos = start;
  while (pos < line.length && isIdChar(line[pos])) {
    pos++;
  }
  if (pos === start) {
    return null;
  }
  const id = line.slice(start, pos);
  for (let i = 0; i < SHAPES.length; i++) {
    const [open, close, decision] = SHAPES[i];
    if (line.startsWith(open, pos)) {
      const end = line.indexOf(close, pos + open.length);
      if (end === -1) {
        return null;
      }
      return {
        id,
        label: plainLabel(line.slice(pos + open.length, end)),
        decision,
        next: end + close.length,
      };
    }
  }
  return { id, label: "", decision: false, next: pos };
}

/** read "-->", "-->|label|" or "-- label -->" at pos; null when no link */
function readLink(line, start) {
  let pos = start;
  while (pos < line.length && isLineChar(line[pos])) {
    pos++;
  }
  const run = pos - start;
  if (run < 2) {
    return null;
  }
  let label = "";
  if (line[pos] === ">" || line[pos] === "x" || line[pos] === "o") {
    // the arrow head, cross or circle that ends the link
    pos++;
  } else if (run === 2) {
    // "A -- label --> B": the words run up to the closing arrow
    const close = ["-->", "==>", ".->"]
      .map((arrow) => line.indexOf(arrow, pos))
      .filter((at) => at !== -1)
      .sort((x, y) => x - y)[0];
    if (close === undefined) {
      return null;
    }
    label = plainLabel(line.slice(pos, close));
    pos = close + 3;
  }
  while (pos < line.length && line[pos] === " ") {
    pos++;
  }
  if (line[pos] === "|") {
    const end = line.indexOf("|", pos + 1);
    if (end === -1) {
      return null;
    }
    label = plainLabel(line.slice(pos + 1, end));
    pos = end + 1;
  }
  return { label, next: pos };
}

/**
 * The steps of a flowchart read straight from its source, for the common
 * forms only.
 * @param {String} source Mermaid text
 * @returns {Object|null} { steps }, or null when the text is not a
 *   flowchart or holds anything this reader does not understand
 */
export function parseFlowchartSource(source) {
  const lines = String(source === undefined || source === null ? "" : source)
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "" && !line.startsWith("%%"));
  if (!lines.length) {
    return null;
  }
  const head = lines[0].split(/\s+/)[0];
  if (head !== "flowchart" && head !== "graph") {
    return null;
  }
  const graph = makeGraph();
  for (let n = 1; n < lines.length; n++) {
    let line = lines[n];
    if (line.endsWith(";")) {
      line = line.slice(0, -1).trim();
    }
    const word = line.split(/\s+/)[0];
    if (line === "" || SKIPPED.includes(word)) {
      continue;
    }
    let pos = 0;
    let from = readNode(line, pos);
    if (!from) {
      return null;
    }
    addNode(graph, from.id, from.label, from.decision);
    pos = from.next;
    while (pos < line.length) {
      while (pos < line.length && line[pos] === " ") {
        pos++;
      }
      if (pos >= line.length) {
        break;
      }
      const link = readLink(line, pos);
      if (!link) {
        return null;
      }
      pos = link.next;
      while (pos < line.length && line[pos] === " ") {
        pos++;
      }
      const to = readNode(line, pos);
      if (!to) {
        return null;
      }
      addNode(graph, to.id, to.label, to.decision);
      graph.links.push({ from: from.id, to: to.id, label: link.label });
      from = to;
      pos = to.next;
    }
  }
  return toSteps(graph);
}
