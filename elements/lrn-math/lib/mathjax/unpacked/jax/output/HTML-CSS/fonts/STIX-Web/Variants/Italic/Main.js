/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/STIX-Web/Variants/Italic/Main.js
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

MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["STIXMathJax_Variants-italic"] = {
  directory: "Variants/Italic",
  family: "STIXMathJax_Variants",
  style: "italic",
  testString:
    "\u00A0\uE22D\uE22E\uE22F\uE230\uE231\uE232\uE233\uE234\uE235\uE236\uE237\uE238\uE239\uE23A",
  0x20: [0, 0, 250, 0, 0],
  0xa0: [0, 0, 250, 0, 0],
  0xe22d: [677, 45, 852, 43, 812],
  0xe22e: [670, 3, 724, 35, 709],
  0xe22f: [671, 11, 569, 43, 586],
  0xe230: [662, 0, 801, 34, 788],
  0xe231: [670, 4, 553, 40, 599],
  0xe232: [662, 0, 652, 43, 710],
  0xe233: [671, 131, 580, 40, 580],
  0xe234: [664, 21, 831, 41, 845],
  0xe235: [662, 0, 575, 38, 591],
  0xe236: [662, 120, 632, 31, 785],
  0xe237: [670, 13, 809, 30, 783],
  0xe238: [670, 7, 693, 30, 653],
  0xe239: [671, 45, 1166, 40, 1128],
  0xe23a: [795, 37, 957, 40, 1064],
  0xe23b: [669, 10, 737, 38, 729],
  0xe23c: [662, 0, 667, 38, 709],
  0xe23d: [671, 131, 744, 43, 704],
  0xe23e: [662, 3, 854, 38, 816],
  0xe23f: [671, 0, 634, 38, 671],
  0xe240: [721, 0, 509, 41, 730],
  0xe241: [672, 13, 817, 37, 950],
  0xe242: [677, 33, 638, 33, 680],
  0xe243: [685, 32, 956, 33, 998],
  0xe244: [672, 13, 692, 38, 739],
  0xe245: [675, 131, 719, 34, 763],
  0xe246: [664, 94, 752, 38, 714],
  0xe262: [460, 11, 570, 56, 514],
  0xe266: [460, 0, 570, 100, 415],
  0xe26a: [460, 0, 570, 59, 487],
  0xe26e: [461, 217, 570, 40, 513],
  0xe272: [450, 217, 570, 17, 542],
  0xe276: [450, 218, 570, 23, 536],
  0xe27a: [668, 10, 570, 28, 553],
  0xe27e: [450, 217, 570, 40, 543],
  0xe282: [668, 10, 570, 50, 519],
  0xe286: [460, 217, 570, 23, 526]
};

MathJax.Callback.Queue(
  ["initFont", MathJax.OutputJax["HTML-CSS"], "STIXMathJax_Variants-italic"],
  [
    "loadComplete",
    MathJax.Ajax,
    MathJax.OutputJax["HTML-CSS"].fontDir + "/Variants/Italic/Main.js"
  ]
);
