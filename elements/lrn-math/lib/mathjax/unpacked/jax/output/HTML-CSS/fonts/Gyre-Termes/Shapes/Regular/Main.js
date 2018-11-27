/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/Gyre-Termes/Shapes/Regular/Main.js
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

MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["GyreTermesMathJax_Shapes"] = {
  directory: "Shapes/Regular",
  family: "GyreTermesMathJax_Shapes",
  testString:
    "\u00A0\u2422\u2423\u2500\u2502\u251C\u2524\u252C\u2534\u253C\u2581\u2588\u2591\u2592\u2593",
  0x20: [0, 0, 250, 0, 0],
  0xa0: [0, 0, 250, 0, 0],
  0x2422: [683, 10, 500, 3, 468],
  0x2423: [160, 106, 500, 40, 460],
  0x2500: [276, -224, 500, 0, 500],
  0x2502: [650, 150, 500, 224, 276],
  0x251c: [650, 150, 500, 224, 500],
  0x2524: [650, 150, 500, 0, 276],
  0x252c: [276, 150, 500, 0, 500],
  0x2534: [650, -224, 500, 0, 500],
  0x253c: [650, 150, 500, 0, 500],
  0x2581: [100, 0, 800, 0, 800],
  0x2588: [800, 0, 800, 0, 800],
  0x2591: [800, 0, 800, 0, 800],
  0x2592: [800, 0, 800, 0, 800],
  0x2593: [800, 0, 800, 0, 800],
  0x25aa: [400, -100, 460, 80, 380],
  0x25ab: [400, -100, 460, 80, 380],
  0x25ac: [375, -125, 660, 80, 580],
  0x25ad: [375, -125, 660, 80, 580],
  0x25b7: [601, 101, 768, 80, 688],
  0x25c1: [601, 101, 768, 80, 688],
  0x25cb: [568, 68, 796, 80, 716],
  0x25cf: [568, 68, 796, 80, 716],
  0x25e6: [400, -100, 460, 80, 380],
  0x2664: [668, 0, 796, 80, 716],
  0x2665: [668, 0, 760, 80, 680],
  0x2666: [670, 0, 782, 80, 702],
  0x2667: [668, 0, 822, 80, 742],
  0x266a: [662, 14, 600, 66, 556],
  0x26ad: [475, -25, 500, -117, 617],
  0x26ae: [700, 200, 500, -171, 671],
  0x2b04: [470, -30, 1091, 80, 1011],
  0x2b05: [470, -30, 1030, 80, 950],
  0x2b06: [690, 180, 600, 80, 520],
  0x2b07: [680, 190, 600, 80, 520],
  0x2b0c: [470, -30, 1040, 80, 960],
  0x2b0d: [690, 190, 600, 80, 520],
  0x2b1a: [702, 202, 1008, 52, 956],
  0x2b31: [830, 330, 850, 80, 770],
  0x2b33: [430, -70, 1170, 80, 1090]
};

MathJax.Callback.Queue(
  ["initFont", MathJax.OutputJax["HTML-CSS"], "GyreTermesMathJax_Shapes"],
  [
    "loadComplete",
    MathJax.Ajax,
    MathJax.OutputJax["HTML-CSS"].fontDir + "/Shapes/Regular/Main.js"
  ]
);
