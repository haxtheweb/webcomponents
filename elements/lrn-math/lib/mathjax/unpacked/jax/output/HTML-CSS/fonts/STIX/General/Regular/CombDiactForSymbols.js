/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/STIX/General/Regular/CombDiactForSymbols.js
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
  MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["STIXGeneral"],
  {
    0x20d0: [760, -627, 0, -453, -17], // COMBINING LEFT HARPOON ABOVE
    0x20d1: [760, -627, 0, -453, -17], // COMBINING RIGHT HARPOON ABOVE
    0x20d2: [662, 156, 0, -242, -192], // COMBINING LONG VERTICAL LINE OVERLAY
    0x20d6: [760, -548, 0, -453, -17], // COMBINING LEFT ARROW ABOVE
    0x20db: [622, -523, 0, -462, 35], // COMBINING THREE DOTS ABOVE
    0x20dc: [622, -523, 0, -600, 96], // COMBINING FOUR DOTS ABOVE
    0x20dd: [725, 221, 0, -723, 223], // COMBINING ENCLOSING CIRCLE
    0x20de: [780, 180, 0, -730, 230], // COMBINING ENCLOSING SQUARE
    0x20df: [843, 341, 0, -840, 344], // COMBINING ENCLOSING DIAMOND
    0x20e1: [760, -548, 0, -453, 25], // COMBINING LEFT RIGHT ARROW ABOVE
    0x20e4: [1023, 155, 0, -970, 490], // COMBINING ENCLOSING UPWARD POINTING TRIANGLE
    0x20e5: [662, 156, 0, -430, -40], // COMBINING REVERSE SOLIDUS OVERLAY
    0x20e6: [662, 156, 0, -335, -102], // COMBINING DOUBLE VERTICAL STROKE OVERLAY
    0x20e7: [725, 178, 0, -650, 166], // COMBINING ANNUITY SYMBOL
    0x20e8: [-119, 218, 0, -462, 35], // COMBINING TRIPLE UNDERDOT
    0x20e9: [681, -538, 0, -480, 53], // COMBINING WIDE BRIDGE ABOVE
    0x20ea: [419, -87, 0, -658, 118], // COMBINING LEFTWARDS ARROW OVERLAY
    0x20eb: [756, 217, 0, -448, 193], // COMBINING LONG DOUBLE SOLIDUS OVERLAY
    0x20ec: [-119, 252, 0, -453, -17], // COMBINING RIGHTWARDS HARPOON WITH BARB DOWNWARDS
    0x20ed: [-119, 252, 0, -453, -17], // COMBINING LEFTWARDS HARPOON WITH BARB DOWNWARDS
    0x20ee: [-40, 252, 0, -453, -17], // COMBINING LEFT ARROW BELOW
    0x20ef: [-40, 252, 0, -453, -17], // COMBINING RIGHT ARROW BELOW
    0x20f0: [819, -517, 0, -357, -87] // COMBINING ASTERISK ABOVE
  }
);

MathJax.Ajax.loadComplete(
  MathJax.OutputJax["HTML-CSS"].fontDir +
    "/General/Regular/CombDiactForSymbols.js"
);
