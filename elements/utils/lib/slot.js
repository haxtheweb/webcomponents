/**
 * Wipe slotted content
 */
export function wipeSlot(element, slot = "*") {
  // 100% clean slate
  if (slot === "*") {
    while (element.firstChild !== null) {
      element.removeChild(element.firstChild);
    }
  } else {
    for (var i in element.childNodes) {
      // test for element nodes to be safe
      if (
        typeof element.childNodes[i] !== typeof undefined &&
        element.childNodes[i].slot === slot
      ) {
        element.removeChild(element.childNodes[i]);
      }
    }
  }
}
