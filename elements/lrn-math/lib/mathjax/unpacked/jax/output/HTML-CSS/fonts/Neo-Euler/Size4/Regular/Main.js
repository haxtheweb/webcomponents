/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/Neo-Euler/Size4/Regular/Main.js
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

MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["NeoEulerMathJax_Size4"] = {
  directory: "Size4/Regular",
  family: "NeoEulerMathJax_Size4",
  testString:
    "\u00A0\u2016\u2044\u2215\u221A\u2223\u2225\u2308\u2309\u230A\u230B\u2329\u232A\u23DC\u23DD",
  0x20: [0, 0, 333, 0, 0],
  0x28: [2799, 199, 790, 236, 768],
  0x29: [2799, 199, 790, 22, 554],
  0x2f: [2799, 200, 1277, 50, 1228],
  0x5b: [2874, 125, 583, 275, 571],
  0x5c: [2799, 200, 1277, 50, 1228],
  0x5d: [2874, 125, 583, 11, 307],
  0x7b: [2799, 200, 806, 144, 661],
  0x7c: [3098, 208, 213, 86, 126],
  0x7d: [2799, 200, 806, 144, 661],
  0xa0: [0, 0, 333, 0, 0],
  0x2016: [3098, 208, 403, 86, 316],
  0x2044: [2799, 200, 1277, 50, 1228],
  0x2215: [2799, 200, 1277, 50, 1228],
  0x221a: [3002, 1, 1000, 111, 1023],
  0x2223: [3098, 208, 213, 86, 126],
  0x2225: [2498, 208, 403, 86, 316],
  0x2308: [2799, 200, 638, 275, 627],
  0x2309: [2799, 200, 638, 11, 363],
  0x230a: [2799, 200, 638, 275, 627],
  0x230b: [2799, 200, 638, 11, 363],
  0x2329: [2730, 228, 803, 137, 694],
  0x232a: [2730, 228, 859, 109, 666],
  0x23dc: [814, -293, 3111, 56, 3055],
  0x23dd: [264, 257, 3111, 56, 3055],
  0x23de: [962, -445, 3111, 56, 3055],
  0x23df: [110, 407, 3111, 56, 3055],
  0x27e8: [2134, 232, 757, 123, 648],
  0x27e9: [2134, 232, 818, 100, 625]
};

MathJax.Callback.Queue(
  ["initFont", MathJax.OutputJax["HTML-CSS"], "NeoEulerMathJax_Size4"],
  [
    "loadComplete",
    MathJax.Ajax,
    MathJax.OutputJax["HTML-CSS"].fontDir + "/Size4/Regular/Main.js"
  ]
);
