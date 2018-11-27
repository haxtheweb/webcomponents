/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/Neo-Euler/Symbols/Regular/Main.js
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

MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["NeoEulerMathJax_Symbols"] = {
  directory: "Symbols/Regular",
  family: "NeoEulerMathJax_Symbols",
  testString:
    "\u00A0\u2320\u2321\u2329\u232A\u239B\u239C\u239D\u239E\u239F\u23A0\u23A1\u23A2\u23A3\u23A4",
  0x20: [0, 0, 333, 0, 0],
  0xa0: [0, 0, 333, 0, 0],
  0x2320: [915, 0, 444, 180, 452],
  0x2321: [925, 0, 444, -23, 265],
  0x2329: [737, 237, 388, 107, 330],
  0x232a: [737, 237, 388, 57, 280],
  0x239b: [1808, 0, 883, 292, 851],
  0x239c: [620, 0, 875, 292, 403],
  0x239d: [1808, 0, 883, 292, 851],
  0x239e: [1808, 0, 873, 22, 581],
  0x239f: [620, 0, 875, 472, 583],
  0x23a0: [1808, 0, 873, 22, 581],
  0x23a1: [1799, 0, 666, 326, 659],
  0x23a2: [602, 0, 666, 326, 395],
  0x23a3: [1800, -1, 666, 326, 659],
  0x23a4: [1799, 0, 666, 7, 340],
  0x23a5: [602, 0, 666, 271, 340],
  0x23a6: [1800, -1, 666, 7, 340],
  0x23a7: [909, 0, 889, 395, 718],
  0x23a8: [1820, 0, 889, 170, 492],
  0x23a9: [909, 0, 889, 395, 718],
  0x23aa: [320, 0, 889, 395, 492],
  0x23ab: [909, 0, 889, 170, 492],
  0x23ac: [1820, 0, 889, 395, 718],
  0x23ad: [909, 0, 889, 170, 492],
  0x23ae: [381, 0, 444, 181, 265]
};

MathJax.Callback.Queue(
  ["initFont", MathJax.OutputJax["HTML-CSS"], "NeoEulerMathJax_Symbols"],
  [
    "loadComplete",
    MathJax.Ajax,
    MathJax.OutputJax["HTML-CSS"].fontDir + "/Symbols/Regular/Main.js"
  ]
);
