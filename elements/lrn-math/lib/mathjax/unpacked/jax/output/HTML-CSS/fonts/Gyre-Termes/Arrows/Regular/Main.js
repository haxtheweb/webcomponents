/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/Gyre-Termes/Arrows/Regular/Main.js
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

MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["GyreTermesMathJax_Arrows"] = {
  directory: "Arrows/Regular",
  family: "GyreTermesMathJax_Arrows",
  testString:
    "\u00A0\u219F\u21A1\u21A4\u21A5\u21A7\u21B2\u21B3\u21B4\u21B5\u21C5\u21D6\u21D7\u21D8\u21D9",
  0x20: [0, 0, 250, 0, 0],
  0xa0: [0, 0, 250, 0, 0],
  0x219f: [690, 180, 520, 80, 440],
  0x21a1: [680, 190, 520, 80, 440],
  0x21a4: [430, -70, 850, 80, 770],
  0x21a5: [600, 90, 520, 80, 440],
  0x21a7: [590, 100, 520, 80, 440],
  0x21b2: [598, 98, 540, 80, 460],
  0x21b3: [598, 98, 540, 80, 460],
  0x21b4: [478, -12, 770, 80, 690],
  0x21b5: [555, 55, 626, 80, 546],
  0x21c5: [600, 100, 920, 80, 840],
  0x21d6: [497, 63, 720, 80, 640],
  0x21d7: [497, 63, 720, 80, 640],
  0x21d8: [563, -3, 720, 80, 640],
  0x21d9: [563, -3, 720, 80, 640],
  0x21dc: [430, -70, 850, 80, 770],
  0x21e6: [470, -30, 1073, 80, 993],
  0x21e7: [715, 198, 600, 80, 520],
  0x21e8: [470, -30, 1073, 80, 993],
  0x21e9: [698, 215, 600, 80, 520],
  0x21f3: [715, 215, 600, 80, 520],
  0x21f5: [600, 100, 920, 80, 840],
  0x21f6: [830, 330, 850, 80, 770],
  0x27f4: [568, 68, 1132, 80, 1052],
  0x27fb: [430, -70, 1170, 80, 1090],
  0x27fd: [470, -30, 1350, 80, 1270],
  0x27fe: [470, -30, 1350, 80, 1270],
  0x27ff: [430, -70, 1170, 80, 1090],
  0x2906: [470, -30, 1030, 80, 950],
  0x2907: [470, -30, 1030, 80, 950]
};

MathJax.Callback.Queue(
  ["initFont", MathJax.OutputJax["HTML-CSS"], "GyreTermesMathJax_Arrows"],
  [
    "loadComplete",
    MathJax.Ajax,
    MathJax.OutputJax["HTML-CSS"].fontDir + "/Arrows/Regular/Main.js"
  ]
);
