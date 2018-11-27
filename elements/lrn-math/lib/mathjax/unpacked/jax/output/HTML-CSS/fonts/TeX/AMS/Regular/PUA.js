/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/TeX/AMS/Regular/PUA.js
 *
 *  Copyright (c) 2009-2018 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

MathJax.Hub.Insert(
  MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["MathJax_AMS"],
  {
    0xe006: [430, 23, 222, -20, 240], // ??
    0xe007: [431, 24, 389, -20, 407], // ??
    0xe008: [605, 85, 778, 55, 719], // ??
    0xe009: [434, 6, 667, 37, 734], // ??
    0xe00c: [752, 284, 778, 82, 693], // ??
    0xe00d: [752, 284, 778, 82, 693], // ??
    0xe00e: [919, 421, 778, 82, 694], // stix-not greater, double equals
    0xe00f: [801, 303, 778, 82, 694], // stix-not greater-or-equal, slanted
    0xe010: [801, 303, 778, 82, 694], // stix-not less-or-equal, slanted
    0xe011: [919, 421, 778, 82, 694], // stix-not less, double equals
    0xe016: [828, 330, 778, 82, 694], // stix-not subset, double equals
    0xe017: [752, 332, 778, 82, 694], // ??
    0xe018: [828, 330, 778, 82, 694], // stix-not superset, double equals
    0xe019: [752, 333, 778, 82, 693], // ??
    0xe01a: [634, 255, 778, 84, 693], // ??
    0xe01b: [634, 254, 778, 82, 691] // ??
  }
);

MathJax.Ajax.loadComplete(
  MathJax.OutputJax["HTML-CSS"].fontDir + "/AMS/Regular/PUA.js"
);
