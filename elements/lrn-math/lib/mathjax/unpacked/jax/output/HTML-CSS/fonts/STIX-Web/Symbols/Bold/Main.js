/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/STIX-Web/Symbols/Bold/Main.js
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

MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["STIXMathJax_Symbols-bold"] = {
  directory: "Symbols/Bold",
  family: "STIXMathJax_Symbols",
  weight: "bold",
  testString:
    "\u00A0\u2302\u2310\u2319\u2329\u232A\u2336\u233D\u233F\u23AF\u27C8\u27C9\u2980\u29B6\u29B7",
  0x20: [0, 0, 250, 0, 0],
  0xa0: [0, 0, 250, 0, 0],
  0x2302: [774, 0, 926, 55, 871],
  0x2310: [399, -108, 750, 65, 685],
  0x2319: [399, -108, 750, 65, 685],
  0x2329: [732, 193, 445, 69, 399],
  0x232a: [732, 193, 445, 46, 376],
  0x2336: [751, 156, 926, 85, 841],
  0x233d: [694, 190, 924, 80, 844],
  0x233f: [732, 200, 728, 55, 673],
  0x23af: [297, -209, 315, 0, 315],
  0x27c8: [547, 13, 1025, 62, 943],
  0x27c9: [547, 13, 1025, 62, 943],
  0x2980: [705, 200, 675, 105, 570],
  0x29b6: [634, 130, 864, 50, 814],
  0x29b7: [634, 130, 864, 50, 814],
  0x29b8: [634, 130, 864, 50, 814],
  0x29c0: [634, 130, 864, 50, 814],
  0x29c1: [634, 130, 864, 50, 814],
  0x29c4: [661, 158, 910, 45, 865],
  0x29c5: [661, 158, 910, 45, 865],
  0x29c6: [661, 158, 910, 45, 865],
  0x29c7: [661, 158, 910, 45, 865]
};

MathJax.Callback.Queue(
  ["initFont", MathJax.OutputJax["HTML-CSS"], "STIXMathJax_Symbols-bold"],
  [
    "loadComplete",
    MathJax.Ajax,
    MathJax.OutputJax["HTML-CSS"].fontDir + "/Symbols/Bold/Main.js"
  ]
);
