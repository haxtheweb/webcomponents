/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/TeX/AMS/Regular/SuppMathOperators.js
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

MathJax.Hub.Insert(
  MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["MathJax_AMS"],
  {
    0x2a5e: [813, 97, 611, 55, 555], // LOGICAL AND WITH DOUBLE OVERBAR
    0x2a7d: [636, 138, 778, 83, 694], // LESS-THAN OR SLANTED EQUAL TO
    0x2a7e: [636, 138, 778, 83, 694], // GREATER-THAN OR SLANTED EQUAL TO
    0x2a85: [762, 290, 778, 55, 722], // LESS-THAN OR APPROXIMATE
    0x2a86: [762, 290, 778, 55, 722], // GREATER-THAN OR APPROXIMATE
    0x2a87: [635, 241, 778, 82, 693], // LESS-THAN AND SINGLE-LINE NOT EQUAL TO
    0x2a88: [635, 241, 778, 82, 693], // GREATER-THAN AND SINGLE-LINE NOT EQUAL TO
    0x2a89: [761, 387, 778, 57, 718], // LESS-THAN AND NOT APPROXIMATE
    0x2a8a: [761, 387, 778, 57, 718], // GREATER-THAN AND NOT APPROXIMATE
    0x2a8b: [1003, 463, 778, 83, 694], // LESS-THAN ABOVE DOUBLE-LINE EQUAL ABOVE GREATER-THAN
    0x2a8c: [1003, 463, 778, 83, 694], // GREATER-THAN ABOVE DOUBLE-LINE EQUAL ABOVE LESS-THAN
    0x2a95: [636, 138, 778, 83, 694], // SLANTED EQUAL TO OR LESS-THAN
    0x2a96: [636, 138, 778, 83, 694], // SLANTED EQUAL TO OR GREATER-THAN
    0x2ab5: [752, 286, 778, 82, 693], // PRECEDES ABOVE NOT EQUAL TO
    0x2ab6: [752, 286, 778, 82, 693], // SUCCEEDS ABOVE NOT EQUAL TO
    0x2ab7: [761, 294, 778, 57, 717], // PRECEDES ABOVE ALMOST EQUAL TO
    0x2ab8: [761, 294, 778, 57, 717], // SUCCEEDS ABOVE ALMOST EQUAL TO
    0x2ab9: [761, 337, 778, 57, 718], // PRECEDES ABOVE NOT ALMOST EQUAL TO
    0x2aba: [761, 337, 778, 57, 718], // SUCCEEDS ABOVE NOT ALMOST EQUAL TO
    0x2ac5: [753, 215, 778, 84, 694], // SUBSET OF ABOVE EQUALS SIGN
    0x2ac6: [753, 215, 778, 83, 694], // SUPERSET OF ABOVE EQUALS SIGN
    0x2acb: [783, 385, 778, 82, 693], // stix-subset not double equals, variant
    0x2acc: [783, 385, 778, 82, 693] // SUPERSET OF ABOVE NOT EQUAL TO
  }
);

MathJax.Ajax.loadComplete(
  MathJax.OutputJax["HTML-CSS"].fontDir + "/AMS/Regular/SuppMathOperators.js"
);
