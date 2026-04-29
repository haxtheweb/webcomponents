/**
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

const debug = false;

const validNodeTypes = globalThis.Node
  ? [
      globalThis.Node.ELEMENT_NODE,
      globalThis.Node.TEXT_NODE,
      globalThis.Node.DOCUMENT_FRAGMENT_NODE,
    ]
  : [];
function isValidNode(node) {
  return validNodeTypes.includes(node.nodeType);
}

function findNode(s, parentNode, isLeft) {
  const nodes = parentNode.childNodes || parentNode.children;
  if (!nodes) {
    return parentNode; // found it, probably text
  }

  for (let i = 0; i < nodes.length; ++i) {
    const j = isLeft ? i : nodes.length - 1 - i;
    const childNode = nodes[j];
    if (!isValidNode(childNode)) {
      continue;
    }

    debug && console.debug("checking child", childNode, "IsLeft", isLeft);
    if (s.containsNode(childNode, true)) {
      if (s.containsNode(childNode, false)) {
        debug && console.info("found child", childNode);
        return childNode;
      }
      debug && console.info("descending child", childNode);
      return findNode(s, childNode, isLeft);
    }
    debug && console.info(parentNode, "does NOT contain", childNode);
  }
  return parentNode;
}

/**
 * detect if an element is currently in the viewport / visible
 * @param {Node} el
 * @returns Boolean
 */
export function isElementInViewport(
  el,
  bounds = {
    top: 0,
    right: globalThis.innerWidth,
    bottom: globalThis.innerHeight,
    left: 0,
  },
) {
  var rect = el.getBoundingClientRect();
  return (
    rect.top >= bounds.top &&
    rect.left >= bounds.left &&
    rect.bottom <= bounds.bottom &&
    rect.right <= bounds.right
  );
}

/**
 * @param {!Selection} s the window selection to use
 * @param {!Node} node the node to walk from
 * @param {boolean} walkForward should this walk in natural direction
 * @return {boolean} whether the selection contains the following node (even partially)
 */
function containsNextElement(s, node, walkForward) {
  const start = node;
  while ((node = walkFromNode(node, walkForward))) {
    // walking (left) can contain our own parent, which we don't want
    if (!node.contains(start)) {
      break;
    }
  }
  if (!node) {
    return false;
  }
  // we look for Element as .containsNode says true for _every_ text node, and we only care about
  // elements themselves
  return node instanceof Element && s.containsNode(node, true);
}

/**
 * @param {!Selection} s the window selection to use
 * @param {!Node} leftNode the left node
 * @param {!Node} rightNode the right node
 * @return {boolean|undefined} whether this has natural direction
 */
function getSelectionDirection(s, leftNode, rightNode) {
  if (s.type !== "Range") {
    return undefined; // no direction
  }
  const measure = () => s.toString().length;

  const initialSize = measure();
  debug && console.info(`initial selection: "${s.toString()}"`);

  if (initialSize === 1 && leftNode === rightNode) {
    // nb. We need to reset a single selection as Safari _always_ tells us the cursor was dragged
    // left to right (maybe RTL on those devices).
    // To be fair, Chrome has the same bug.
    debug && console.debug("resetting size=1");
    s.extend(leftNode, 0);
    s.collapseToEnd();
    return undefined;
  }

  let updatedSize;

  // Try extending forward and seeing what happens.
  s.modify("extend", "forward", "character");
  updatedSize = measure();
  debug && console.info(`forward selection: "${s.toString()}"`);

  if (updatedSize > initialSize || containsNextElement(s, rightNode, true)) {
    debug && console.info("got forward >, moving right");
    s.modify("extend", "backward", "character");
    return true;
  } else if (updatedSize < initialSize || !s.containsNode(leftNode)) {
    debug && console.info("got forward <, moving left");
    s.modify("extend", "backward", "character");
    return false;
  }

  // Maybe we were at the end of something. Extend backwards.
  // TODO(samthor): We seem to be able to get away without the 'backwards' case.
  s.modify("extend", "backward", "character");
  updatedSize = measure();
  debug && console.info(`backward selection: "${s.toString()}"`);

  if (updatedSize > initialSize || containsNextElement(s, leftNode, false)) {
    debug && console.info("got backwards >, moving left");
    s.modify("extend", "forward", "character");
    return false;
  } else if (updatedSize < initialSize || !s.containsNode(rightNode)) {
    debug && console.info("got backwards <, moving right");
    s.modify("extend", "forward", "character");
    return true;
  }

  // This is likely a select-all.
  return undefined;
}

/**
 * Returns the next valid node (element or text). This is needed as Safari doesn't support
 * TreeWalker inside Shadow DOM. Don't escape shadow roots.
 *
 * @param {!Node} node to start from
 * @param {boolean} walkForward should this walk in natural direction
 * @return {Node} node found, if any
 */
function walkFromNode(node, walkForward) {
  if (!walkForward) {
    return node.previousSibling || node.parentNode || null;
  }
  while (node) {
    if (node.nextSibling) {
      return node.nextSibling;
    }
    node = node.parentNode;
  }
  return null;
}

/**
 * @param {!Node} node
 * @return {number} count of initial space
 */
function initialSpace(node) {
  if (node.nodeType !== Node.TEXT_NODE) {
    return 0;
  }
  return /^\s*/.exec(node.textContent)[0].length;
}

/**
 * @param {!Node} node
 * @return {number} count of ignored trailing space
 */
function ignoredTrailingSpace(node) {
  if (node.nodeType !== Node.TEXT_NODE) {
    return 0;
  }
  const trailingSpaceCount = /\s*$/.exec(node.textContent)[0].length;
  if (!trailingSpaceCount) {
    return 0;
  }
  return trailingSpaceCount - 1; // always allow single last
}

const cachedRange = new Map();
export function getRange(root) {
  if (root.getSelection) {
    const s = root.getSelection();
    return s.rangeCount ? s.getRangeAt(0) : null;
  }

  const thisFrame = cachedRange.get(root);
  if (thisFrame) {
    return thisFrame;
  }

  const initialText = globalThis.getSelection().toString();
  const result = internalGetShadowSelection(root);
  const rs = (result && result.range && result.range.toString()) || null;
  if (rs !== null && rs !== initialText) {
    // TODO: sometimes triggers on single-char hack etc

    if (rs.replace(/\s/g, "") !== initialText.replace(/\s/g, "")) {
      // nb. selection eats initial/ending space, range does not: if whitespace is the only
      // difference, then ignore
      console.warn("invalid range, initial text:", initialText);
      console.warn("vs", rs, result.mode, result.range);
    }
  }

  cachedRange.set(root, result.range);
  globalThis.setTimeout(() => {
    cachedRange.delete(root);
  }, 0);
  debug && console.debug("getRange got", result);
  return result.range;
}

export function internalGetShadowSelection(root) {
  const fakeSelectionNode = globalThis.document.createTextNode("");
  const range = globalThis.document.createRange();
  const s = globalThis.getSelection();
  if (s && root.host && !s.containsNode(root.host, true)) {
    return { range: null, mode: "none" };
  }

  // TODO: inserting fake nodes isn't ideal, but containsNode doesn't work on nearby adjacent
  // text nodes (in fact it returns true for all text nodes on the page?!).

  // insert a fake 'before' node to see if it's selected
  root.insertBefore(fakeSelectionNode, root.childNodes[0]);
  const includesBeforeRoot = s.containsNode(fakeSelectionNode);
  fakeSelectionNode.remove();
  if (includesBeforeRoot) {
    return { range: null, mode: "outside-before" };
  }

  // insert a fake 'after' node to see if it's selected
  root.appendChild(fakeSelectionNode);
  const includesAfterRoot = s.containsNode(fakeSelectionNode);
  fakeSelectionNode.remove();
  if (includesAfterRoot) {
    return { range: null, mode: "outside-after" };
  }

  const measure = () => s.toString().length;
  if (s.type === "None") {
    return null;
  }
  if (!(s.type === "Caret" || s.type === "Range")) {
    throw new TypeError("unexpected type: " + s.type);
  }

  const leftNode = findNode(s, root, true);
  let rightNode;
  let isNaturalDirection = undefined;
  if (s.type === "Range") {
    rightNode = findNode(s, root, false); // get right node here _before_ getSelectionDirection
    isNaturalDirection = getSelectionDirection(s, leftNode, rightNode);
    // isNaturalDirection means "going right"
  }

  if (s.type === "Caret") {
    // we might transition to being a caret, so don't check initial value
    s.extend(leftNode, 0);
    const at = measure();
    s.collapseToEnd();
    if (
      leftNode.nodeType === 1 &&
      leftNode.childNodes &&
      leftNode.childNodes.length > 0
    ) {
      range.setStart(leftNode.childNodes[0], at);
      range.setEnd(leftNode.childNodes[0], at);
    } else {
      range.setStart(leftNode, at);
      range.setEnd(leftNode, at);
    }
    return { range, mode: "caret" };
  } else if (isNaturalDirection === undefined) {
    if (s.type !== "Range") {
      throw new TypeError("unexpected type: " + s.type);
    }
    // This occurs when we can't move because we can't extend left or right to measure the
    // direction we're moving in. Good news though: we don't need to _change_ the selection
    // to measure it, so just return immediately.
    range.setStart(leftNode.childNodes[0], 0);
    range.setEnd(rightNode, rightNode.length);
    return { range, mode: "all" };
  }

  const size = measure();
  let offsetLeft, offsetRight;

  // only one newline/space char is cared about
  const validRightLength = rightNode.length - ignoredTrailingSpace(rightNode);

  if (isNaturalDirection) {
    // walk in the opposite direction first
    s.extend(leftNode, 0);
    offsetLeft = measure() + initialSpace(leftNode); // measure doesn't include initial space

    // then in our actual direction
    s.extend(rightNode, validRightLength);
    offsetRight = validRightLength - (measure() - size);

    // then revert to the original position
    s.extend(rightNode, offsetRight);
  } else {
    // walk in the opposite direction first
    s.extend(rightNode, validRightLength);
    offsetRight = validRightLength - measure();

    // then in our actual direction
    s.extend(leftNode, 0);
    offsetLeft = measure() - size + initialSpace(leftNode); // doesn't include initial space

    // then revert to the original position
    s.extend(leftNode, offsetLeft);
  }

  if (debug) {
    if (leftNode === rightNode) {
      console.info(
        "got string",
        leftNode.textContent.substr(offsetLeft, offsetRight - offsetLeft),
      );
    } else {
      console.info(">>> string", leftNode.textContent.substr(offsetLeft));
      console.info("<<< string", rightNode.textContent.substr(0, offsetRight));
    }
  }

  range.setStart(leftNode, offsetLeft);
  range.setEnd(rightNode, offsetRight);
  return {
    mode: isNaturalDirection ? "right" : "left",
    range,
  };
}

// polyfill from https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/replaceWith
export function ReplaceWithPolyfill() {
  "use-strict"; // For safari, and IE > 10
  var parent = this.parentNode,
    i = arguments.length,
    currentNode;
  if (!parent) return;
  if (!i)
    // if there are no arguments
    parent.removeChild(this);
  while (i--) {
    // i-- decrements i and returns the value of i before the decrement
    currentNode = arguments[i];
    if (typeof currentNode !== "object") {
      currentNode = this.ownerDocument.createTextNode(currentNode);
    } else if (currentNode.parentNode) {
      currentNode.parentNode.removeChild(currentNode);
    }
    // the value of "i" below is after the decrement
    if (!i)
      // if currentNode is the first argument (currentNode === arguments[0])
      parent.replaceChild(currentNode, this);
    // if currentNode isn't the first
    else parent.insertBefore(currentNode, this.nextSibling);
  }
}
