/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/Latin-Modern/Shapes/Regular/Main.js
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

MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["LatinModernMathJax_Shapes"] = {
  directory: "Shapes/Regular",
  family: "LatinModernMathJax_Shapes",
  testString:
    "\u00A0\u2422\u2423\u2500\u2502\u251C\u2524\u252C\u2534\u253C\u2581\u2588\u2591\u2592\u2593",
  0x20: [0, 0, 332, 0, 0],
  0xa0: [0, 0, 332, 0, 0],
  0x2422: [694, 11, 556, 28, 521],
  0x2423: [249, 105, 500, 42, 458],
  0x2500: [270, -230, 666, -20, 686],
  0x2502: [770, 270, 666, 313, 353],
  0x251c: [770, -230, 666, 313, 686],
  0x2524: [270, 270, 666, -20, 353],
  0x252c: [270, 270, 666, 313, 686],
  0x2534: [770, -230, 666, -20, 353],
  0x253c: [770, 270, 666, -20, 686],
  0x2581: [83, 0, 664, 0, 664],
  0x2588: [664, 0, 664, 0, 664],
  0x2591: [664, 0, 664, 0, 664],
  0x2592: [664, 0, 664, 0, 664],
  0x2593: [664, 0, 664, 0, 664],
  0x25aa: [358, -142, 328, 56, 272],
  0x25ab: [358, -142, 328, 56, 272],
  0x25ac: [417, -84, 778, 56, 722],
  0x25ad: [417, -84, 778, 56, 722],
  0x25b7: [678, 178, 858, 56, 802],
  0x25c1: [678, 178, 858, 56, 802],
  0x25cb: [592, 92, 796, 56, 740],
  0x25cf: [592, 92, 796, 56, 740],
  0x25e6: [445, -55, 500, 55, 445],
  0x2664: [727, 130, 778, 56, 722],
  0x2665: [716, 33, 778, 56, 722],
  0x2666: [727, 163, 778, 56, 722],
  0x2667: [727, 130, 778, 28, 750],
  0x266a: [695, 29, 611, 55, 556],
  0x26ad: [467, -36, 500, -78, 577],
  0x26ae: [606, 104, 500, -189, 688],
  0x2b04: [520, 20, 1062, 56, 1006],
  0x2b05: [468, -31, 977, 56, 921],
  0x2b06: [672, 193, 612, 87, 524],
  0x2b07: [693, 172, 612, 87, 524],
  0x2b0c: [468, -31, 1022, 89, 933],
  0x2b0d: [672, 172, 549, 56, 492],
  0x2b1a: [640, 240, 960, 40, 920],
  0x2b31: [990, 490, 997, 56, 941],
  0x2b33: [510, 10, 1463, 56, 1407]
};

MathJax.Callback.Queue(
  ["initFont", MathJax.OutputJax["HTML-CSS"], "LatinModernMathJax_Shapes"],
  [
    "loadComplete",
    MathJax.Ajax,
    MathJax.OutputJax["HTML-CSS"].fontDir + "/Shapes/Regular/Main.js"
  ]
);
