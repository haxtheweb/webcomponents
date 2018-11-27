/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/TeX/AMS/Regular/Main.js
 *
 *  Copyright (c) 2009-2018 The MathJax Consortium
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
 *
 */

MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["MathJax_AMS"] = {
  directory: "AMS/Regular",
  family: "MathJax_AMS",
  testString: "MATHJAX AMS \u02C6",
  Ranges: [
    [0x0, 0x7f, "BBBold"],
    [0x80, 0xff, "Latin1Supplement"],
    [0x100, 0x17f, "LatinExtendedA"],
    [0x2b0, 0x2ff, "SpacingModLetters"],
    [0x300, 0x36f, "CombDiacritMarks"],
    [0x370, 0x3ff, "GreekAndCoptic"],
    [0x2000, 0x206f, "GeneralPunctuation"],
    [0x2100, 0x214f, "LetterlikeSymbols"],
    [0x2190, 0x21ff, "Arrows"],
    [0x2200, 0x22ff, "MathOperators"],
    [0x2300, 0x23ff, "MiscTechnical"],
    [0x2460, 0x24ff, "EnclosedAlphanum"],
    [0x2500, 0x257f, "BoxDrawing"],
    [0x25a0, 0x25ff, "GeometricShapes"],
    [0x2600, 0x26ff, "MiscSymbols"],
    [0x2700, 0x27bf, "Dingbats"],
    [0x2980, 0x29ff, "MiscMathSymbolsB"],
    [0x2a00, 0x2aff, "SuppMathOperators"],
    [0xe000, 0xf8ff, "PUA"]
  ]
};

MathJax.Callback.Queue(
  ["initFont", MathJax.OutputJax["HTML-CSS"], "MathJax_AMS"],
  [
    "loadComplete",
    MathJax.Ajax,
    MathJax.OutputJax["HTML-CSS"].fontDir + "/AMS/Regular/Main.js"
  ]
);
