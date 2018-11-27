/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/STIX/IntegralsUpD/Regular/All.js
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
  MathJax.OutputJax["HTML-CSS"].FONTDATA.FONTS["STIXIntegralsUpD"],
  {
    0x20: [0, 0, 250, 0, 0], // SPACE
    0xa0: [0, 0, 250, 0, 0], // NO-BREAK SPACE
    0x222c: [2000, 269, 787, 58, 832], // DOUBLE INTEGRAL
    0x222d: [2000, 269, 1107, 58, 1152], // TRIPLE INTEGRAL
    0x222f: [2000, 269, 849, 39, 849], // SURFACE INTEGRAL
    0x2230: [2000, 269, 1161, 36, 1172], // VOLUME INTEGRAL
    0x2231: [2000, 269, 608, 47, 736], // CLOCKWISE INTEGRAL
    0x2232: [2000, 269, 616, 56, 746], // CLOCKWISE CONTOUR INTEGRAL
    0x2233: [2000, 269, 605, 56, 785], // ANTICLOCKWISE CONTOUR INTEGRAL
    0x2a0b: [2000, 269, 914, 58, 856], // SUMMATION WITH INTEGRAL
    0x2a0c: [2000, 269, 1397, 58, 1442], // QUADRUPLE INTEGRAL OPERATOR
    0x2a0d: [2000, 269, 609, 35, 647], // FINITE PART INTEGRAL
    0x2a0e: [1999, 270, 609, 35, 647], // INTEGRAL WITH DOUBLE STROKE
    0x2a0f: [1999, 270, 658, 25, 734], // INTEGRAL AVERAGE WITH SLASH
    0x2a10: [2000, 269, 629, 56, 635], // CIRCULATION FUNCTION
    0x2a11: [2000, 269, 608, 47, 736], // ANTICLOCKWISE INTEGRATION
    0x2a12: [2000, 269, 568, 58, 597], // LINE INTEGRATION WITH RECTANGULAR PATH AROUND POLE
    0x2a13: [2000, 269, 530, 58, 599], // LINE INTEGRATION WITH SEMICIRCULAR PATH AROUND POLE
    0x2a14: [2000, 269, 695, 58, 776], // LINE INTEGRATION NOT INCLUDING THE POLE
    0x2a15: [2000, 269, 615, 56, 684], // INTEGRAL AROUND A POINT OPERATOR
    0x2a16: [2000, 269, 653, 56, 682], // QUATERNION INTEGRAL OPERATOR
    0x2a17: [2000, 269, 945, 24, 1039], // INTEGRAL WITH LEFTWARDS ARROW WITH HOOK
    0x2a18: [2000, 269, 597, 62, 608], // INTEGRAL WITH TIMES SIGN
    0x2a19: [2000, 269, 735, 65, 801], // INTEGRAL WITH INTERSECTION
    0x2a1a: [2000, 269, 735, 65, 801], // INTEGRAL WITH UNION
    0x2a1b: [2157, 269, 701, 0, 741], // INTEGRAL WITH OVERBAR
    0x2a1c: [2000, 426, 467, 58, 799] // INTEGRAL WITH UNDERBAR
  }
);

MathJax.Ajax.loadComplete(
  MathJax.OutputJax["HTML-CSS"].fontDir + "/IntegralsUpD/Regular/All.js"
);
