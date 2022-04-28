/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SimpleIconsetStore } from "@lrnwebcomponents/simple-icon/lib/simple-iconset.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
export const SimpleListboxIcon = Object.keys(SimpleIconsetStore.groupedIconlist || []).map((key,i) => {
  let id=`icon-${(key || i).toLowerCase()}`;
  return {
    id: id,
    group: key,
    itemsList: (SimpleIconsetStore.groupedIconlist[key] || []).map(icon=>{
      return {
        id: `icon-${icon.toLowerCase().replace(/\:/g,'-')}`,
        icon: icon,
        value: icon,
        tooltip: icon
      }
    })
  }
});