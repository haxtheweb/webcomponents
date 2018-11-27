/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/STIX/SizeFourSym/Regular/Main.js
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

MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["STIXSizeFourSym"] = {
  directory: "SizeFourSym/Regular",
  family: "STIXSizeFourSym",
  Ranges: [
    [0x2b0, 0x2ff, "All"],
    [0x300, 0x338, "All"],
    [0x203e, 0x203e, "All"],
    [0x20d0, 0x20ef, "All"],
    [0x221a, 0x221c, "All"],
    [0x239b, 0x23b9, "All"],
    [0x23dc, 0x23e1, "All"],
    [0x2772, 0x2773, "All"],
    [0x27e6, 0x27eb, "All"],
    [0x2983, 0x2986, "All"]
  ],
  0x20: [0, 0, 250, 0, 0], // SPACE
  0x28: [2566, 509, 808, 124, 732], // LEFT PARENTHESIS
  0x29: [2566, 509, 808, 76, 684], // RIGHT PARENTHESIS
  0x2f: [2566, 509, 1309, 16, 1293], // SOLIDUS
  0x5b: [2566, 509, 661, 295, 634], // LEFT SQUARE BRACKET
  0x5c: [2566, 509, 1309, 16, 1293], // REVERSE SOLIDUS
  0x5d: [2566, 509, 661, 27, 366], // RIGHT SQUARE BRACKET
  0x5f: [-127, 177, 2500, 0, 2500], // LOW LINE
  0x7b: [2566, 509, 1076, 173, 882], // LEFT CURLY BRACKET
  0x7d: [2566, 509, 1076, 194, 903], // RIGHT CURLY BRACKET
  0xa0: [0, 0, 250, 0, 0], // NO-BREAK SPACE
  0x302: [796, -573, 0, -2040, -154], // COMBINING CIRCUMFLEX ACCENT
  0x303: [771, -608, 0, -2040, -154], // COMBINING TILDE
  0x221a: [1510, 345, 1184, 112, 895], // SQUARE ROOT
  0x2308: [2566, 509, 682, 295, 655], // LEFT CEILING
  0x2309: [2566, 509, 682, 27, 387], // RIGHT CEILING
  0x230a: [2566, 509, 682, 295, 655], // LEFT FLOOR
  0x230b: [2566, 509, 682, 27, 387], // RIGHT FLOOR
  0x23de: [175, 90, 2328, 0, 2328], // TOP CURLY BRACKET (mathematical use)
  0x23df: [837, -572, 2328, 0, 2328], // BOTTOM CURLY BRACKET (mathematical use)
  0x27e8: [2566, 509, 908, 113, 796], // MATHEMATICAL LEFT ANGLE BRACKET
  0x27e9: [2566, 509, 908, 112, 795] // MATHEMATICAL RIGHT ANGLE BRACKET
};

MathJax.OutputJax["HTML-CSS"].initFont("STIXSizeFourSym");

MathJax.Ajax.loadComplete(
  MathJax.OutputJax["HTML-CSS"].fontDir + "/SizeFourSym/Regular/Main.js"
);
