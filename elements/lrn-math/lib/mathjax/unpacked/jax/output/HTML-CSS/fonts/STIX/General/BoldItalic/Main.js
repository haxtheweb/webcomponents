/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/STIX/General/BoldItalic/Main.js
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

MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["STIXGeneral-bold-italic"] = {
  directory: "General/BoldItalic",
  family: "STIXGeneral",
  weight: "bold",
  style: "italic",
  Ranges: [
    [0x0, 0x7f, "BasicLatin"],
    [0xa0, 0xff, "Latin1Supplement"],
    [0x100, 0x17f, "LatinExtendedA"],
    [0x180, 0x24f, "LatinExtendedB"],
    [0x250, 0x2af, "IPAExtensions"],
    [0x2b0, 0x2ff, "SpacingModLetters"],
    [0x370, 0x3ff, "GreekAndCoptic"],
    [0x400, 0x4ff, "Cyrillic"],
    [0x1e00, 0x1eff, "LatinExtendedAdditional"],
    [0x2000, 0x206f, "GeneralPunctuation"],
    [0x20a0, 0x20cf, "CurrencySymbols"],
    [0x20d0, 0x20ff, "CombDiactForSymbols"],
    [0x2100, 0x214f, "LetterlikeSymbols"],
    [0x2200, 0x22ff, "MathOperators"],
    [0x2400, 0x243f, "ControlPictures"],
    [0x2460, 0x24ff, "EnclosedAlphanum"],
    [0x2500, 0x257f, "BoxDrawing"],
    [0xfb00, 0xfb4f, "AlphaPresentForms"],
    [0x1d468, 0x1d49b, "MathBoldItalic"],
    [0x1d4d0, 0x1d503, "MathBoldScript"],
    [0x1d63c, 0x1d66f, "MathSSItalicBold"],
    [0x1d71c, 0x1d755, "GreekBoldItalic"],
    [0x1d790, 0x1d7c9, "GreekSSBoldItalic"]
  ]
};

MathJax.OutputJax["HTML-CSS"].initFont("STIXGeneral-bold-italic");

MathJax.Ajax.loadComplete(
  MathJax.OutputJax["HTML-CSS"].fontDir + "/General/BoldItalic/Main.js"
);
