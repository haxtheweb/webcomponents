/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/STIX/Variants/Regular/Main.js
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

MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["STIXVariants"] = {
  directory: "Variants/Regular",
  family: "STIXVariants",
  Ranges: [
    [0x20, 0x20, "All"],
    [0x77, 0x7c, "All"],
    [0xa0, 0xa0, "All"],
    [0x19b, 0x19b, "All"],
    [0x264, 0x264, "All"],
    [0x2032, 0x2057, "All"],
    [0x2140, 0x2140, "All"],
    [0x2190, 0x2193, "All"],
    [0x21d1, 0x21e2, "All"],
    [0x2205, 0x22ed, "All"],
    [0x2322, 0x2323, "All"],
    [0x2423, 0x2423, "All"],
    [0x25a9, 0x25a9, "All"],
    [0x2a3c, 0x2aee, "All"]
  ],
  0x2032: [565, -28, 340, 44, 295], // PRIME
  0x210f: [683, 10, 579, 47, 547], // stix-/hbar - Planck's over 2pi
  0x2205: [729, 74, 523, 28, 502], // EMPTY SET
  0x2216: [710, 222, 523, 46, 478], // SET MINUS
  0x221a: [943, 11, 737, 67, 767] // SQUARE ROOT
};

MathJax.OutputJax["HTML-CSS"].initFont("STIXVariants");

MathJax.Ajax.loadComplete(
  MathJax.OutputJax["HTML-CSS"].fontDir + "/Variants/Regular/Main.js"
);
