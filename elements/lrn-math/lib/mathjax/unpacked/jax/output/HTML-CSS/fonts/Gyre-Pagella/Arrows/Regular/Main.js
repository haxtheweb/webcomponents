/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/Gyre-Pagella/Arrows/Regular/Main.js
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

MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["GyrePagellaMathJax_Arrows"] = {
  directory: "Arrows/Regular",
  family: "GyrePagellaMathJax_Arrows",
  testString:
    "\u00A0\u219F\u21A1\u21A4\u21A5\u21A7\u21B2\u21B3\u21B4\u21B5\u21C5\u21D6\u21D7\u21D8\u21D9",
  0x20: [0, 0, 250, 0, 0],
  0xa0: [0, 0, 250, 0, 0],
  0x219f: [673, 162, 460, 80, 380],
  0x21a1: [662, 173, 460, 80, 380],
  0x21a4: [400, -100, 920, 80, 840],
  0x21a5: [635, 125, 460, 80, 380],
  0x21a7: [625, 135, 460, 80, 380],
  0x21b2: [572, 73, 530, 80, 450],
  0x21b3: [572, 72, 530, 80, 450],
  0x21b4: [471, -19, 723, 80, 643],
  0x21b5: [531, 31, 613, 80, 533],
  0x21c5: [635, 135, 800, 80, 720],
  0x21d6: [522, 100, 782, 80, 702],
  0x21d7: [522, 100, 782, 80, 702],
  0x21d8: [600, 22, 782, 80, 702],
  0x21d9: [600, 22, 782, 80, 702],
  0x21dc: [400, -100, 920, 80, 840],
  0x21e6: [450, -50, 1047, 80, 967],
  0x21e7: [705, 182, 560, 80, 480],
  0x21e8: [450, -50, 1047, 80, 967],
  0x21e9: [682, 205, 560, 80, 480],
  0x21f3: [705, 205, 560, 80, 480],
  0x21f5: [635, 135, 800, 80, 720],
  0x21f6: [740, 240, 920, 80, 840],
  0x27f4: [568, 68, 1130, 80, 1050],
  0x27fb: [400, -100, 1370, 80, 1290],
  0x27fd: [450, -50, 1445, 80, 1365],
  0x27fe: [450, -50, 1445, 80, 1365],
  0x27ff: [400, -100, 1370, 80, 1290],
  0x2906: [450, -50, 995, 80, 915],
  0x2907: [450, -50, 995, 80, 915]
};

MathJax.Callback.Queue(
  ["initFont", MathJax.OutputJax["HTML-CSS"], "GyrePagellaMathJax_Arrows"],
  [
    "loadComplete",
    MathJax.Ajax,
    MathJax.OutputJax["HTML-CSS"].fontDir + "/Arrows/Regular/Main.js"
  ]
);
