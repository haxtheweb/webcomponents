/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/STIX-Web/Variants/BoldItalic/Main.js
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

MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS[
  "STIXMathJax_Variants-bold-italic"
] = {
  directory: "Variants/BoldItalic",
  family: "STIXMathJax_Variants",
  weight: "bold",
  style: "italic",
  testString:
    "\u00A0\uE247\uE248\uE249\uE24A\uE24B\uE24C\uE24D\uE24E\uE24F\uE250\uE251\uE252\uE253\uE254",
  0x20: [0, 0, 250, 0, 0],
  0xa0: [0, 0, 250, 0, 0],
  0xe247: [711, 47, 871, 38, 834],
  0xe248: [703, 10, 755, 33, 740],
  0xe249: [704, 12, 667, 36, 669],
  0xe24a: [696, 0, 802, 30, 808],
  0xe24b: [704, 8, 609, 41, 626],
  0xe24c: [696, 0, 645, 34, 738],
  0xe24d: [704, 144, 615, 43, 615],
  0xe24e: [696, 24, 849, 22, 858],
  0xe24f: [696, 0, 621, 36, 623],
  0xe250: [695, 116, 645, 36, 811],
  0xe251: [703, 14, 856, 38, 820],
  0xe252: [704, 8, 726, 38, 688],
  0xe253: [705, 45, 1186, 38, 1146],
  0xe254: [835, 39, 997, 36, 1098],
  0xe255: [707, 10, 772, 43, 782],
  0xe256: [696, 0, 645, 36, 731],
  0xe257: [704, 145, 778, 43, 737],
  0xe258: [697, 13, 869, 36, 831],
  0xe259: [705, 7, 667, 36, 699],
  0xe25a: [783, 0, 547, 33, 747],
  0xe25b: [700, 14, 787, 33, 936],
  0xe25c: [711, 31, 652, 36, 706],
  0xe25d: [711, 34, 956, 36, 1010],
  0xe25e: [710, 14, 720, 36, 781],
  0xe25f: [711, 144, 720, 36, 773],
  0xe260: [702, 98, 778, 36, 744],
  0xe264: [473, 10, 600, 47, 554],
  0xe268: [473, 0, 600, 95, 450],
  0xe26c: [473, 0, 600, 54, 531],
  0xe270: [463, 217, 600, 31, 547],
  0xe274: [450, 217, 600, 30, 564],
  0xe278: [450, 218, 600, 25, 561],
  0xe27c: [670, 10, 600, 55, 545],
  0xe280: [450, 217, 600, 24, 582],
  0xe284: [670, 10, 600, 41, 560],
  0xe288: [463, 217, 600, 49, 539]
};

MathJax.Callback.Queue(
  [
    "initFont",
    MathJax.OutputJax["HTML-CSS"],
    "STIXMathJax_Variants-bold-italic"
  ],
  [
    "loadComplete",
    MathJax.Ajax,
    MathJax.OutputJax["HTML-CSS"].fontDir + "/Variants/BoldItalic/Main.js"
  ]
);
