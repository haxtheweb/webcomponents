/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/Latin-Modern/Arrows/Regular/Main.js
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

MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["LatinModernMathJax_Arrows"] = {
  directory: "Arrows/Regular",
  family: "LatinModernMathJax_Arrows",
  testString:
    "\u00A0\u219F\u21A1\u21A4\u21A5\u21A7\u21B2\u21B3\u21B4\u21B5\u21C5\u21D6\u21D7\u21D8\u21D9",
  0x20: [0, 0, 332, 0, 0],
  0xa0: [0, 0, 332, 0, 0],
  0x219f: [689, 213, 572, 56, 516],
  0x21a1: [713, 189, 572, 56, 516],
  0x21a4: [510, 10, 977, 56, 921],
  0x21a5: [679, 183, 632, 55, 576],
  0x21a7: [683, 179, 632, 55, 576],
  0x21b2: [679, 179, 564, 56, 508],
  0x21b3: [679, 179, 564, 56, 508],
  0x21b4: [530, 6, 882, 56, 826],
  0x21b5: [650, 150, 650, 56, 594],
  0x21c5: [703, 203, 896, 56, 840],
  0x21d6: [682, 272, 1066, 56, 1010],
  0x21d7: [682, 272, 1066, 56, 1010],
  0x21d8: [772, 182, 1066, 56, 1010],
  0x21d9: [772, 182, 1066, 56, 1010],
  0x21dc: [510, 10, 997, 56, 941],
  0x21e6: [520, 20, 1050, 56, 994],
  0x21e7: [725, 213, 652, 56, 596],
  0x21e8: [520, 20, 1050, 56, 994],
  0x21e9: [713, 225, 652, 56, 596],
  0x21f3: [725, 225, 652, 56, 596],
  0x21f5: [703, 203, 896, 56, 840],
  0x21f6: [990, 490, 997, 56, 941],
  0x27f4: [592, 92, 1121, 56, 1065],
  0x27fb: [510, 10, 1443, 56, 1387],
  0x27fd: [520, 20, 1437, 56, 1381],
  0x27fe: [520, 20, 1437, 56, 1381],
  0x27ff: [510, 10, 1463, 56, 1407],
  0x2906: [520, 20, 991, 56, 935],
  0x2907: [520, 20, 991, 56, 935]
};

MathJax.Callback.Queue(
  ["initFont", MathJax.OutputJax["HTML-CSS"], "LatinModernMathJax_Arrows"],
  [
    "loadComplete",
    MathJax.Ajax,
    MathJax.OutputJax["HTML-CSS"].fontDir + "/Arrows/Regular/Main.js"
  ]
);
