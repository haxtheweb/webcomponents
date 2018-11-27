/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/STIX/General/Bold/CombDiactForSymbols.js
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
  MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["STIXGeneral-bold"],
  {
    0x20d0: [846, -637, 0, -470, 14], // COMBINING LEFT HARPOON ABOVE
    0x20d1: [846, -637, 0, -470, 14], // COMBINING RIGHT HARPOON ABOVE
    0x20d2: [662, 156, 0, -298, -223], // COMBINING LONG VERTICAL LINE OVERLAY
    0x20d6: [846, -508, 0, -500, -16], // COMBINING LEFT ARROW ABOVE
    0x20d7: [846, -508, 0, -470, 14], // COMBINING RIGHT ARROW ABOVE
    0x20db: [666, -537, 0, -512, 37], // COMBINING THREE DOTS ABOVE
    0x20dc: [666, -537, 0, -627, 132], // COMBINING FOUR DOTS ABOVE
    0x20dd: [760, 254, 0, -753, 256], // COMBINING ENCLOSING CIRCLE
    0x20e1: [846, -508, 0, -515, 79], // COMBINING LEFT RIGHT ARROW ABOVE
    0x20e4: [1055, 169, 0, -998, 519], // COMBINING ENCLOSING UPWARD POINTING TRIANGLE
    0x20e5: [662, 155, 0, -470, 12], // COMBINING REVERSE SOLIDUS OVERLAY
    0x20e6: [662, 156, 0, -390, -111], // COMBINING DOUBLE VERTICAL STROKE OVERLAY
    0x20e7: [760, 172, 0, -643, 200], // COMBINING ANNUITY SYMBOL
    0x20e8: [-109, 238, 0, -512, 37], // COMBINING TRIPLE UNDERDOT
    0x20e9: [717, -544, 0, -510, 54], // COMBINING WIDE BRIDGE ABOVE
    0x20ea: [441, -65, 0, -688, 148], // COMBINING LEFTWARDS ARROW OVERLAY
    0x20eb: [775, 235, 0, -505, 208], // COMBINING LONG DOUBLE SOLIDUS OVERLAY
    0x20ec: [-166, 375, 0, -470, 14], // COMBINING RIGHTWARDS HARPOON WITH BARB DOWNWARDS
    0x20ed: [-166, 375, 0, -470, 14], // COMBINING LEFTWARDS HARPOON WITH BARB DOWNWARDS
    0x20ee: [-35, 373, 0, -490, -6], // COMBINING LEFT ARROW BELOW
    0x20ef: [-35, 373, 0, -470, 14], // COMBINING RIGHT ARROW BELOW
    0x20f0: [845, -543, 0, -385, -115] // COMBINING ASTERISK ABOVE
  }
);

MathJax.Ajax.loadComplete(
  MathJax.OutputJax["HTML-CSS"].fontDir + "/General/Bold/CombDiactForSymbols.js"
);
