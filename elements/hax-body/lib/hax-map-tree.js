/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */

/**
 * The page outline's model: which rows the editor tray's Structure panel
 * shows for the blocks in a hax-body, what each row can do, and the rules
 * for moving blocks by drag and drop or the keyboard.
 *
 * - Top level blocks indent under the heading above them. A heading carries
 *   its section when it moves: the blocks after it up to the next heading
 *   at its level or higher (or a page break).
 * - A container is a layout (haxProperties type "grid", or grid-plate) that
 *   says which tags a slot takes: grid-plate columns take anything but
 *   another grid-plate; a slot setting with allowedSlotWrappers takes those
 *   tags; one with a slotWrapper (other than template) takes that tag.
 *   Layouts mark the slot they hold blocks in with such a setting, hidden
 *   when it is not for editing (image-gallery: images; media-playlist:
 *   video and audio). Blocks move into, out of and between containers.
 * - Other children (list items, text inside a card) are shown but move,
 *   lock and delete with their parent.
 * - Page breaks (Page details) and locked blocks do not move on their own;
 *   a locked block in a heading's section moves with the section.
 *
 * Every function takes a schemaFor(tag) lookup (HAXStore.haxSchemaFromTag
 * in the editor) so the rules can be tested without the store.
 */

const HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
// inline tags never get their own row
const INLINE = [
  "br",
  "span",
  "strong",
  "b",
  "sup",
  "sub",
  "i",
  "em",
  "div",
  "strike",
  "a",
  "u",
  "s",
  "code",
  "mark",
  "abbr",
  "small",
];

export function tagOf(node) {
  return node && node.tagName ? node.tagName.toLowerCase() : "";
}

export function headingLevel(node) {
  const tag = tagOf(node);
  return HEADINGS.includes(tag) ? parseInt(tag.substring(1), 10) : 0;
}

export function isPageBreak(node) {
  return tagOf(node) === "page-break";
}

/**
 * locked itself, or inside a locked block
 */
export function isLocked(node, body) {
  let n = node;
  while (n && n !== body && n.getAttribute) {
    if (n.getAttribute("data-hax-lock") != null) {
      return true;
    }
    n = n.parentElement;
  }
  return false;
}

function settingsSlots(schema) {
  const settings = (schema && schema.settings) || {};
  const seen = [];
  const slots = [];
  Object.keys(settings).forEach((group) => {
    (settings[group] || []).forEach((prop) => {
      if (
        prop &&
        (!!prop.slot || prop.slot === "") &&
        !seen.includes(prop.slot)
      ) {
        seen.push(prop.slot);
        slots.push(prop);
      }
    });
  });
  return slots;
}

/**
 * The slots a block takes other blocks into, or null when it is not a
 * container. Each slot: { slot, title, allowed (tags or null for any),
 * excluded (tags) }.
 */
export function containerSlots(node, schemaFor) {
  const tag = tagOf(node);
  if (!tag) {
    return null;
  }
  if (tag === "grid-plate") {
    const layout = (node.layout || node.getAttribute("layout") || "1-1").split(
      "-",
    );
    return layout.map((_item, num) => ({
      slot: `col-${num + 1}`,
      title: `${num + 1}`,
      allowed: null,
      excluded: ["grid-plate"],
    }));
  }
  const schema = schemaFor(tag);
  if (!schema || schema.type !== "grid") {
    return null;
  }
  const slots = [];
  settingsSlots(schema).forEach((prop) => {
    let allowed = null;
    if (Array.isArray(prop.allowedSlotWrappers)) {
      allowed = prop.allowedSlotWrappers;
    } else if (prop.slotWrapper && prop.slotWrapper !== "template") {
      allowed = [prop.slotWrapper];
    }
    // slots without a rule hold text for the element, not blocks
    if (allowed) {
      slots.push({
        slot: prop.slot,
        title: prop.title || prop.slot,
        allowed: allowed.map((t) => t.toLowerCase()),
        excluded: (prop.excludedSlotWrappers || []).map((t) => t.toLowerCase()),
      });
    }
  });
  return slots.length > 0 ? slots : null;
}

export function slotAccepts(slot, tag) {
  if (!slot || !tag) {
    return false;
  }
  if (slot.excluded && slot.excluded.includes(tag)) {
    return false;
  }
  return !slot.allowed || slot.allowed.includes(tag);
}

function slotOf(node) {
  return (node.getAttribute && node.getAttribute("slot")) || "";
}

function childRowsOf(node) {
  return [...(node.children || [])].filter(
    (child) => child.tagName && !INLINE.includes(tagOf(child)),
  );
}

/**
 * The outline's rows, in page order. Each row:
 * { node, tag, depth, kind, movable, selectable, level, slots, slot,
 *   container (the container a block or column belongs to) }
 * kind: "page" (page break), "block" (moves on its own), "column" (a
 * container's slot when it has more than one), "child" (moves with its
 * parent).
 */
export function buildRows(body, schemaFor) {
  const rows = [];
  if (!body || !body.children) {
    return rows;
  }
  const locked = (node) => isLocked(node, body);
  const addChildren = (parent, depth) => {
    const slots = containerSlots(parent, schemaFor);
    if (slots) {
      const kids = [...parent.children].filter((c) => c.tagName);
      if (slots.length > 1) {
        slots.forEach((slot) => {
          rows.push({
            node: parent,
            tag: tagOf(parent),
            depth,
            kind: "column",
            movable: false,
            selectable: false,
            slot: slot.slot,
            slotInfo: slot,
            container: parent,
          });
          kids
            .filter((kid) => slotOf(kid) === slot.slot)
            .forEach((kid) => addBlock(kid, depth + 1, parent));
        });
      } else {
        kids
          .filter((kid) => slotOf(kid) === slots[0].slot)
          .forEach((kid) => addBlock(kid, depth, parent));
      }
    } else {
      childRowsOf(parent).forEach((kid) => {
        rows.push({
          node: kid,
          tag: tagOf(kid),
          depth,
          kind: "child",
          movable: false,
          selectable: false,
          container: null,
        });
      });
    }
  };
  const addBlock = (node, depth, container) => {
    const pageBreak = isPageBreak(node);
    rows.push({
      node,
      tag: tagOf(node),
      depth,
      kind: pageBreak ? "page" : "block",
      movable: !pageBreak && !locked(node),
      selectable: !pageBreak,
      level: container ? 0 : headingLevel(node),
      slots: containerSlots(node, schemaFor),
      container: container || null,
    });
    if (!pageBreak) {
      addChildren(node, depth + 1);
    }
  };
  // headings nest the blocks after them: a stack of open heading levels
  let open = [];
  [...body.children].forEach((node) => {
    const tag = tagOf(node);
    if (!tag || tag === "br") {
      return;
    }
    if (isPageBreak(node)) {
      open = [];
      addBlock(node, 0, null);
      return;
    }
    const level = headingLevel(node);
    if (level) {
      open = open.filter((l) => l < level);
      addBlock(node, open.length, null);
      open.push(level);
    } else {
      addBlock(node, open.length, null);
    }
  });
  return rows;
}

/**
 * A top level heading and the blocks after it up to the next heading at
 * its level or higher (or a page break); any other block alone.
 */
export function sectionOf(node, body) {
  const level = node.parentElement === body ? headingLevel(node) : 0;
  const nodes = [node];
  if (!level) {
    return nodes;
  }
  let next = node.nextElementSibling;
  while (next) {
    const nextLevel = headingLevel(next);
    if (isPageBreak(next) || (nextLevel && nextLevel <= level)) {
      break;
    }
    nodes.push(next);
    next = next.nextElementSibling;
  }
  return nodes;
}

function inDocumentOrder(nodes) {
  return [...nodes].sort((a, b) => {
    if (a === b) return 0;
    return a.compareDocumentPosition(b) & 4 ? -1 : 1;
  });
}

/**
 * What actually moves when these blocks are dragged: headings bring their
 * sections (locked blocks in a section go with it, unchanged), blocks
 * inside another moving block go with it. A page break or a locked block
 * does not move on its own. In page order.
 */
export function nodesToMove(nodes, body) {
  let all = [];
  nodes
    .filter((node) => !isPageBreak(node) && !isLocked(node, body))
    .forEach((node) => {
      sectionOf(node, body).forEach((n) => {
        if (!all.includes(n)) {
          all.push(n);
        }
      });
    });
  all = all.filter(
    (n) => !all.some((other) => other !== n && other.contains(n)),
  );
  return inDocumentOrder(all);
}

/**
 * Can these nodes go to target { parent, slot, before }?
 * Returns "" when they can, otherwise a reason:
 * "locked", "self", "page", "slot".
 */
export function dropProblem(nodes, target, body, schemaFor) {
  if (!target || !target.parent || nodes.length === 0) {
    return "self";
  }
  const { parent, slot, before } = target;
  if (parent !== body && isLocked(parent, body)) {
    return "locked";
  }
  if (nodes.some((n) => n === parent || n.contains(parent))) {
    return "self";
  }
  if (before && nodes.includes(before) && nodes.length === 1) {
    return "self";
  }
  if (parent === body) {
    // nothing goes above the page's own page break
    const first = body.firstElementChild;
    if (first && isPageBreak(first) && before === first) {
      return "page";
    }
    return "";
  }
  const slots = containerSlots(parent, schemaFor) || [];
  const slotInfo = slots.find((s) => s.slot === (slot || ""));
  if (!slotInfo) {
    return "slot";
  }
  if (nodes.some((n) => !slotAccepts(slotInfo, tagOf(n)))) {
    return "slot";
  }
  return "";
}

/**
 * Moves the nodes, in order, to target { parent, slot, before }. Returns
 * true when it moved them. All DOM changes happen in one task, so the
 * editor's undo records one step.
 */
export function moveNodes(nodes, target, body, schemaFor) {
  if (dropProblem(nodes, target, body, schemaFor)) {
    return false;
  }
  let { parent, slot, before } = target;
  // dropping before a block that is itself moving: land before the first
  // block after it that stays
  while (before && nodes.includes(before)) {
    before = before.nextElementSibling;
  }
  nodes.forEach((node) => {
    if (parent === body || !slot) {
      node.removeAttribute("slot");
    } else {
      node.setAttribute("slot", slot);
    }
    parent.insertBefore(node, before || null);
  });
  return true;
}

/**
 * Where a keyboard move (Alt+Up / Alt+Down) of a block lands, or null.
 * - A block moves one step past its neighbor in the same parent and slot
 *   (past a heading it joins the section above or below).
 * - A heading moves with its section, past the previous heading at its
 *   level or higher (or above the blocks before the first heading), or
 *   past the next such heading's whole section.
 */
export function keyboardTarget(node, direction, body) {
  const parent = node.parentElement;
  const moving = nodesToMove([node], body);
  if (!parent || moving.length === 0 || moving[0] !== node) {
    return null;
  }
  const slot = slotOf(node);
  const sibling = (n, dir) => {
    let s = dir < 0 ? n.previousElementSibling : n.nextElementSibling;
    while (s && parent !== body && slotOf(s) !== slot) {
      s = dir < 0 ? s.previousElementSibling : s.nextElementSibling;
    }
    return s;
  };
  const level = parent === body ? headingLevel(node) : 0;
  if (direction < 0) {
    let prev = sibling(node, -1);
    if (!prev || isPageBreak(prev)) {
      return null;
    }
    if (level) {
      // back to the previous heading at this level or higher, or to the
      // first block after the page break when there is none
      let scan = prev;
      while (scan) {
        const l = headingLevel(scan);
        if (l && l <= level) {
          prev = scan;
          break;
        }
        const before = scan.previousElementSibling;
        if (!before || isPageBreak(before)) {
          prev = scan;
          break;
        }
        scan = before;
      }
    }
    return { parent, slot, before: prev };
  }
  const last = moving[moving.length - 1];
  const next = sibling(last, 1);
  if (!next || isPageBreak(next)) {
    return null;
  }
  let after = next;
  if (level) {
    // own section already ends at a heading at this level or higher
    const section = sectionOf(next, body);
    after = section[section.length - 1];
  }
  return { parent, slot, before: after.nextElementSibling };
}
