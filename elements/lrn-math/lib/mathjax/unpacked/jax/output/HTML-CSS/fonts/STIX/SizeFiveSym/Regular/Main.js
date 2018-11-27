/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/STIX/SizeFiveSym/Regular/Main.js
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

MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["STIXSizeFiveSym"] = {
  directory: "SizeFiveSym/Regular",
  family: "STIXSizeFiveSym",
  Ranges: [
    [0x2b0, 0x2ff, "All"],
    [0x300, 0x338, "All"],
    [0x203e, 0x203e, "All"],
    [0x20d0, 0x20ef, "All"],
    [0x239b, 0x23b9, "All"],
    [0x23dc, 0x23e1, "All"]
  ],
  0x20: [0, 0, 250, 0, 0], // SPACE
  0x5f: [-127, 177, 3000, 0, 3000], // LOW LINE
  0xa0: [0, 0, 250, 0, 0], // NO-BREAK SPACE
  0x302: [816, -572, 0, -2485, -157], // COMBINING CIRCUMFLEX ACCENT
  0x303: [780, -617, 0, -2485, -157], // COMBINING TILDE
  0x23de: [181, 90, 3238, 0, 3238], // TOP CURLY BRACKET (mathematical use)
  0x23df: [844, -573, 3238, 0, 3238] // BOTTOM CURLY BRACKET (mathematical use)
};

MathJax.OutputJax["HTML-CSS"].initFont("STIXSizeFiveSym");

MathJax.Ajax.loadComplete(
  MathJax.OutputJax["HTML-CSS"].fontDir + "/SizeFiveSym/Regular/Main.js"
);
