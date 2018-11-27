/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/TeX/Size4/Regular/Main.js
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

MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["MathJax_Size4"] = {
  directory: "Size4/Regular",
  family: "MathJax_Size4",
  testString: "() [] {}",
  0x20: [0, 0, 250, 0, 0], // SPACE
  0x28: [1750, 1249, 792, 237, 758], // LEFT PARENTHESIS
  0x29: [1750, 1249, 792, 33, 554], // RIGHT PARENTHESIS
  0x2f: [1750, 1249, 1278, 56, 1221], // SOLIDUS
  0x5b: [1750, 1249, 583, 269, 577], // LEFT SQUARE BRACKET
  0x5c: [1750, 1249, 1278, 56, 1221], // REVERSE SOLIDUS
  0x5d: [1750, 1249, 583, 5, 313], // RIGHT SQUARE BRACKET
  0x7b: [1750, 1249, 806, 144, 661], // LEFT CURLY BRACKET
  0x7d: [1750, 1249, 806, 144, 661], // RIGHT CURLY BRACKET
  0xa0: [0, 0, 250, 0, 0], // NO-BREAK SPACE
  0x2c6: [845, -561, 1889, -14, 1902], // MODIFIER LETTER CIRCUMFLEX ACCENT
  0x2dc: [823, -583, 1889, 1, 1885], // SMALL TILDE
  0x302: [845, -561, 0, -1903, 13], // COMBINING CIRCUMFLEX ACCENT
  0x303: [823, -583, 0, -1888, -4], // COMBINING TILDE
  0x221a: [1750, 1250, 1000, 111, 1020], // SQUARE ROOT
  0x2308: [1750, 1249, 639, 269, 633], // LEFT CEILING
  0x2309: [1750, 1249, 639, 5, 369], // RIGHT CEILING
  0x230a: [1750, 1249, 639, 269, 633], // LEFT FLOOR
  0x230b: [1750, 1249, 639, 5, 369], // RIGHT FLOOR
  0x239b: [1154, 655, 875, 291, 843], // LEFT PARENTHESIS UPPER HOOK
  0x239c: [610, 10, 875, 291, 417], // LEFT PARENTHESIS EXTENSION
  0x239d: [1165, 644, 875, 291, 843], // LEFT PARENTHESIS LOWER HOOK
  0x239e: [1154, 655, 875, 31, 583], // RIGHT PARENTHESIS UPPER HOOK
  0x239f: [610, 10, 875, 457, 583], // RIGHT PARENTHESIS EXTENSION
  0x23a0: [1165, 644, 875, 31, 583], // RIGHT PARENTHESIS LOWER HOOK
  0x23a1: [1154, 645, 667, 319, 666], // LEFT SQUARE BRACKET UPPER CORNER
  0x23a2: [602, 0, 667, 319, 403], // LEFT SQUARE BRACKET EXTENSION
  0x23a3: [1155, 644, 667, 319, 666], // LEFT SQUARE BRACKET LOWER CORNER
  0x23a4: [1154, 645, 667, 0, 347], // RIGHT SQUARE BRACKET UPPER CORNER
  0x23a5: [602, 0, 667, 263, 347], // RIGHT SQUARE BRACKET EXTENSION
  0x23a6: [1155, 644, 667, 0, 347], // RIGHT SQUARE BRACKET LOWER CORNER
  0x23a7: [899, 10, 889, 384, 718], // LEFT CURLY BRACKET UPPER HOOK
  0x23a8: [1160, 660, 889, 170, 504], // LEFT CURLY BRACKET MIDDLE PIECE
  0x23a9: [10, 899, 889, 384, 718], // LEFT CURLY BRACKET LOWER HOOK
  0x23aa: [310, 10, 889, 384, 504], // CURLY BRACKET EXTENSION
  0x23ab: [899, 10, 889, 170, 504], // RIGHT CURLY BRACKET UPPER HOOK
  0x23ac: [1160, 660, 889, 384, 718], // RIGHT CURLY BRACKET MIDDLE PIECE
  0x23ad: [10, 899, 889, 170, 504], // RIGHT CURLY BRACKET LOWER HOOK
  0x23b7: [935, 885, 1056, 111, 742], // RADICAL SYMBOL BOTTOM
  0x27e8: [1750, 1248, 806, 140, 703], // MATHEMATICAL LEFT ANGLE BRACKET
  0x27e9: [1750, 1248, 806, 103, 665], // MATHEMATICAL RIGHT ANGLE BRACKET
  0xe000: [625, 14, 1056, 702, 742], // stix-radical symbol vertical extender
  0xe001: [605, 14, 1056, 702, 1076], // stix-radical symbol top corner piece
  0xe150: [120, 213, 450, -24, 460], // stix-horizontal brace, down left piece
  0xe151: [120, 213, 450, -10, 474], // stix-horizontal brace, down right piece
  0xe152: [333, 0, 450, -24, 460], // stix-horizontal brace, upper left piece
  0xe153: [333, 0, 450, -10, 474], // stix-horizontal brace, upper right piece
  0xe154: [120, 0, 400, -10, 410] // stix-oblique open face capital letter A
};

MathJax.Callback.Queue(
  ["initFont", MathJax.OutputJax["HTML-CSS"], "MathJax_Size4"],
  [
    "loadComplete",
    MathJax.Ajax,
    MathJax.OutputJax["HTML-CSS"].fontDir + "/Size4/Regular/Main.js"
  ]
);
