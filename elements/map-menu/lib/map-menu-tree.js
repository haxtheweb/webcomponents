/**
 * Turn a flat JSON Outline Schema item list into the nested tree map-menu
 * renders, in one pass over the data.
 *
 * Same result as map-menu's original _dataChanged/_setChildren (which ran a
 * full filter of the list for every item): the top level is every item
 * without a parent, in data order; each item reached from the top gets a
 * `children` array of the items whose parent is its id, in data order. Like
 * the original, it sets `children` on the item objects themselves and leaves
 * items that can't be reached from the top level untouched.
 *
 * @param {Array} data flat item list (each item: id, parent, ...)
 * @returns {Array} top-level items
 */
export function buildMenuTree(data) {
  if (!Array.isArray(data)) {
    return [];
  }
  const byParent = new Map();
  const roots = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (!item.parent) {
      roots.push(item);
    }
    let siblings = byParent.get(item.parent);
    if (!siblings) {
      siblings = [];
      byParent.set(item.parent, siblings);
    }
    siblings.push(item);
  }
  // walk down from the top level; a fresh array per item, as filter() gave.
  // `seen` only matters for malformed data (an item that is its own
  // ancestor), where the original recursed until the stack overflowed.
  const stack = roots.slice();
  const seen = new Set();
  while (stack.length) {
    const item = stack.pop();
    if (seen.has(item)) {
      continue;
    }
    seen.add(item);
    const children = byParent.get(item.id);
    item.children = children ? children.slice() : [];
    for (let i = 0; i < item.children.length; i++) {
      stack.push(item.children[i]);
    }
  }
  return roots;
}
