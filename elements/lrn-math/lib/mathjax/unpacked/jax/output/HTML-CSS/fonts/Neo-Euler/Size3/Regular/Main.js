/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/Neo-Euler/Size3/Regular/Main.js
 *
 *  Copyright (c) 2013-2018 The MathJax Consortium
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
 */

MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["NeoEulerMathJax_Size3"] = {
  directory: "Size3/Regular",
  family: "NeoEulerMathJax_Size3",
  testString:
    "\u00A0\u2016\u2044\u2215\u221A\u2223\u2225\u2308\u2309\u230A\u230B\u2329\u232A\u23DC\u23DD",
  0x20: [0, 0, 333, 0, 0],
  0x28: [2199, 199, 734, 208, 714],
  0x29: [2199, 199, 734, 20, 526],
  0x2f: [2199, 200, 1044, 54, 992],
  0x5b: [2274, 125, 527, 250, 513],
  0x5c: [2199, 200, 1044, 54, 992],
  0x5d: [2274, 125, 527, 14, 277],
  0x7b: [2199, 200, 750, 131, 618],
  0x7c: [2498, 208, 213, 86, 126],
  0x7d: [2199, 200, 750, 131, 618],
  0xa0: [0, 0, 333, 0, 0],
  0x2016: [2498, 208, 403, 86, 316],
  0x2044: [2199, 200, 1044, 54, 992],
  0x2215: [2199, 200, 1044, 54, 992],
  0x221a: [2402, 1, 1000, 111, 1025],
  0x2223: [2498, 208, 213, 86, 126],
  0x2225: [1897, 208, 403, 86, 316],
  0x2308: [2199, 200, 583, 250, 568],
  0x2309: [2199, 200, 583, 14, 332],
  0x230a: [2199, 200, 583, 250, 568],
  0x230b: [2199, 200, 583, 14, 332],
  0x2329: [2134, 232, 757, 123, 648],
  0x232a: [2134, 232, 818, 100, 625],
  0x23dc: [800, -308, 2511, 56, 2455],
  0x23dd: [248, 244, 2511, 56, 2455],
  0x23de: [944, -457, 2511, 56, 2455],
  0x23df: [97, 390, 2511, 56, 2455],
  0x27e8: [1536, 234, 629, 109, 520],
  0x27e9: [1536, 234, 693, 89, 500]
};

MathJax.Callback.Queue(
  ["initFont", MathJax.OutputJax["HTML-CSS"], "NeoEulerMathJax_Size3"],
  [
    "loadComplete",
    MathJax.Ajax,
    MathJax.OutputJax["HTML-CSS"].fontDir + "/Size3/Regular/Main.js"
  ]
);
