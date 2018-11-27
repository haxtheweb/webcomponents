/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/STIX-Web/Arrows/Bold/Main.js
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

MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["STIXMathJax_Arrows-bold"] = {
  directory: "Arrows/Bold",
  family: "STIXMathJax_Arrows",
  weight: "bold",
  testString:
    "\u00A0\u219C\u219D\u219F\u21A1\u21A4\u21A5\u21A7\u21A8\u21AF\u21B2\u21B3\u21B4\u21B5\u21B8",
  0x20: [0, 0, 250, 0, 0],
  0xa0: [0, 0, 250, 0, 0],
  0x219c: [462, -72, 956, 66, 890],
  0x219d: [462, -72, 956, 66, 890],
  0x219f: [676, 165, 568, 86, 482],
  0x21a1: [676, 165, 568, 86, 482],
  0x21a4: [451, -55, 977, 68, 909],
  0x21a5: [676, 165, 584, 94, 490],
  0x21a7: [676, 165, 584, 94, 490],
  0x21a8: [732, 196, 584, 94, 490],
  0x21af: [683, 154, 562, 68, 494],
  0x21b2: [686, 170, 584, 45, 503],
  0x21b3: [686, 170, 584, 81, 539],
  0x21b4: [686, 162, 960, 66, 894],
  0x21b5: [686, 171, 960, 56, 904],
  0x21b8: [768, 170, 977, 68, 911],
  0x21b9: [618, 114, 977, 68, 909],
  0x21c5: [676, 165, 864, 66, 798],
  0x21d6: [662, 156, 926, 54, 872],
  0x21d7: [662, 156, 926, 54, 872],
  0x21d8: [662, 156, 926, 54, 872],
  0x21d9: [662, 156, 926, 54, 872],
  0x21dc: [451, -55, 977, 62, 914],
  0x21e6: [551, 45, 926, 60, 866],
  0x21e7: [662, 156, 685, 45, 641],
  0x21e8: [551, 45, 926, 60, 866],
  0x21e9: [662, 156, 685, 45, 641],
  0x21ea: [705, 201, 685, 45, 641],
  0x21f5: [676, 165, 864, 66, 798],
  0xe0b4: [555, -209, 282, 42, 239],
  0xe0b5: [555, -209, 282, 43, 240],
  0xe0b6: [478, -56, 0, 15, 142]
};

MathJax.Callback.Queue(
  ["initFont", MathJax.OutputJax["HTML-CSS"], "STIXMathJax_Arrows-bold"],
  [
    "loadComplete",
    MathJax.Ajax,
    MathJax.OutputJax["HTML-CSS"].fontDir + "/Arrows/Bold/Main.js"
  ]
);
