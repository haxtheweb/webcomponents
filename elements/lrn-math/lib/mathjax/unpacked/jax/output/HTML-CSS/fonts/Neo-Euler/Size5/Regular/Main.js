/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/Neo-Euler/Size5/Regular/Main.js
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

MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["NeoEulerMathJax_Size5"] = {
  directory: "Size5/Regular",
  family: "NeoEulerMathJax_Size5",
  testString:
    "\u00A0\u2225\u27E8\u27E9\uE000\uE001\uE002\uE003\uE004\uE005\uE006\uE007\uE008\uE009\uE00A",
  0x20: [0, 0, 333, 0, 0],
  0xa0: [0, 0, 333, 0, 0],
  0x2225: [3098, 208, 403, 86, 316],
  0x27e8: [2730, 228, 803, 137, 694],
  0x27e9: [2730, 228, 859, 109, 666],
  0xe000: [3098, 208, 213, 86, 126],
  0xe001: [138, 167, 213, 86, 126],
  0xe002: [3098, 208, 403, 86, 316],
  0xe003: [138, 167, 403, 86, 316],
  0xe004: [635, -595, 150, 0, 150],
  0xe005: [-65, 105, 150, 0, 150],
  0xe006: [1820, 0, 1055, 111, 742],
  0xe007: [572, -2, 1055, 702, 742],
  0xe008: [583, 2, 1055, 702, 1076],
  0xe009: [827, -276, 1799, 0, 1809],
  0xe00a: [828, -718, 600, -10, 610],
  0xe00b: [828, -277, 1799, -10, 1799],
  0xe00c: [280, 271, 1799, 0, 1809],
  0xe00d: [-160, 271, 600, -10, 610],
  0xe00e: [281, 270, 1799, -10, 1799],
  0xe00f: [758, -436, 450, -24, 460],
  0xe010: [758, -660, 300, -10, 310],
  0xe011: [983, -661, 1800, -10, 1810],
  0xe012: [758, -436, 450, -10, 474],
  0xe013: [120, 202, 450, -24, 460],
  0xe014: [-106, 202, 300, -10, 310],
  0xe015: [-106, 428, 1800, -10, 1810],
  0xe016: [120, 202, 450, -10, 474]
};

MathJax.Callback.Queue(
  ["initFont", MathJax.OutputJax["HTML-CSS"], "NeoEulerMathJax_Size5"],
  [
    "loadComplete",
    MathJax.Ajax,
    MathJax.OutputJax["HTML-CSS"].fontDir + "/Size5/Regular/Main.js"
  ]
);
