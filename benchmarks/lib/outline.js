/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE.md for full text.
 *
 * A site outline shaped like a real course: units, lessons, sub-pages.
 * Defaults give 12 + 96 + 192 = 300 pages, in JSON Outline Schema item form.
 */
export function bigOutline(units = 12, lessons = 8, subs = 2) {
  const items = [];
  let n = 0;
  function page(id, parent, indent, order) {
    n++;
    return {
      id,
      title: "Page " + n,
      slug: "page-" + n,
      location: "pages/" + id + "/index.html",
      order,
      parent,
      indent,
      contents: "<p>Page " + n + "</p>",
      metadata: {
        published: true,
        locked: false,
        status: "",
        created: 1,
        updated: 2,
      },
    };
  }
  for (let u = 0; u < units; u++) {
    const uid = "u" + u;
    items.push(page(uid, null, 0, u));
    for (let l = 0; l < lessons; l++) {
      const lid = uid + "l" + l;
      items.push(page(lid, uid, 1, l));
      for (let s = 0; s < subs; s++) {
        items.push(page(lid + "s" + s, lid, 2, s));
      }
    }
  }
  return items;
}
