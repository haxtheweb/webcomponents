/*************************************************************
 *
 *  MathJax/jax/output/CommonHTML/fonts/TeX/Typewriter-Regular.js
 *
 *  Copyright (c) 2015-2018 The MathJax Consortium
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

(function(CHTML) {
  var font = "MathJax_Typewriter";

  CHTML.FONTDATA.FONTS[font] = {
    className: CHTML.FONTDATA.familyName(font),
    centerline: 233,
    ascent: 694,
    descent: 229,

    0x20: [0, 0, 250, 0, 0], // SPACE
    0x21: [622, 0, 525, 206, 320], // EXCLAMATION MARK
    0x22: [623, -333, 525, 122, 402], // QUOTATION MARK
    0x23: [611, 0, 525, 36, 489], // NUMBER SIGN
    0x24: [694, 82, 525, 58, 466], // DOLLAR SIGN
    0x25: [694, 83, 525, 35, 489], // PERCENT SIGN
    0x26: [622, 11, 525, 28, 490], // AMPERSAND
    0x27: [611, -287, 525, 175, 349], // APOSTROPHE
    0x28: [694, 82, 525, 166, 437], // LEFT PARENTHESIS
    0x29: [694, 82, 525, 87, 358], // RIGHT PARENTHESIS
    0x2a: [520, -90, 525, 68, 456], // ASTERISK
    0x2b: [531, -81, 525, 38, 487], // PLUS SIGN
    0x2c: [140, 139, 525, 173, 353], // COMMA
    0x2d: [341, -271, 525, 57, 468], // HYPHEN-MINUS
    0x2e: [140, -1, 525, 193, 332], // FULL STOP
    0x2f: [694, 83, 525, 58, 466], // SOLIDUS
    0x30: [621, 10, 525, 42, 482], // DIGIT ZERO
    0x31: [622, -1, 525, 99, 450], // DIGIT ONE
    0x32: [622, -1, 525, 52, 472], // DIGIT TWO
    0x33: [622, 11, 525, 44, 479], // DIGIT THREE
    0x34: [624, -1, 525, 29, 495], // DIGIT FOUR
    0x35: [611, 10, 525, 52, 472], // DIGIT FIVE
    0x36: [622, 11, 525, 45, 479], // DIGIT SIX
    0x37: [627, 10, 525, 44, 480], // DIGIT SEVEN
    0x38: [621, 10, 525, 45, 479], // DIGIT EIGHT
    0x39: [622, 11, 525, 46, 479], // DIGIT NINE
    0x3a: [431, -1, 525, 193, 332], // COLON
    0x3b: [431, 139, 525, 175, 337], // SEMICOLON
    0x3c: [557, -55, 525, 57, 468], // LESS-THAN SIGN
    0x3d: [417, -195, 525, 38, 487], // EQUALS SIGN
    0x3e: [557, -55, 525, 57, 468], // GREATER-THAN SIGN
    0x3f: [617, 0, 525, 62, 462], // QUESTION MARK
    0x40: [617, 6, 525, 44, 481], // COMMERCIAL AT
    0x41: [623, -1, 525, 28, 496], // LATIN CAPITAL LETTER A
    0x42: [611, -1, 525, 17, 482], // LATIN CAPITAL LETTER B
    0x43: [622, 11, 525, 40, 484], // LATIN CAPITAL LETTER C
    0x44: [611, -1, 525, 16, 485], // LATIN CAPITAL LETTER D
    0x45: [611, -1, 525, 19, 502], // LATIN CAPITAL LETTER E
    0x46: [611, -1, 525, 22, 490], // LATIN CAPITAL LETTER F
    0x47: [622, 11, 525, 38, 496], // LATIN CAPITAL LETTER G
    0x48: [611, -1, 525, 16, 508], // LATIN CAPITAL LETTER H
    0x49: [611, -1, 525, 72, 452], // LATIN CAPITAL LETTER I
    0x4a: [611, 11, 525, 57, 479], // LATIN CAPITAL LETTER J
    0x4b: [611, -1, 525, 18, 495], // LATIN CAPITAL LETTER K
    0x4c: [611, 0, 525, 25, 488], // LATIN CAPITAL LETTER L
    0x4d: [611, -1, 525, 12, 512], // LATIN CAPITAL LETTER M
    0x4e: [611, 0, 525, 20, 504], // LATIN CAPITAL LETTER N
    0x4f: [621, 10, 525, 56, 468], // LATIN CAPITAL LETTER O
    0x50: [611, -1, 525, 19, 480], // LATIN CAPITAL LETTER P
    0x51: [621, 138, 525, 56, 468], // LATIN CAPITAL LETTER Q
    0x52: [611, 11, 525, 16, 522], // LATIN CAPITAL LETTER R
    0x53: [622, 11, 525, 52, 472], // LATIN CAPITAL LETTER S
    0x54: [611, -1, 525, 26, 498], // LATIN CAPITAL LETTER T
    0x55: [611, 11, 525, -3, 528], // LATIN CAPITAL LETTER U
    0x56: [611, 7, 525, 19, 505], // LATIN CAPITAL LETTER V
    0x57: [611, 7, 525, 12, 512], // LATIN CAPITAL LETTER W
    0x58: [611, -1, 525, 28, 495], // LATIN CAPITAL LETTER X
    0x59: [611, -1, 525, 20, 505], // LATIN CAPITAL LETTER Y
    0x5a: [611, -1, 525, 48, 481], // LATIN CAPITAL LETTER Z
    0x5b: [694, 82, 525, 214, 483], // LEFT SQUARE BRACKET
    0x5c: [694, 83, 525, 58, 466], // REVERSE SOLIDUS
    0x5d: [694, 82, 525, 41, 310], // RIGHT SQUARE BRACKET
    0x5e: [611, -460, 525, 96, 428], // CIRCUMFLEX ACCENT
    0x5f: [-25, 95, 525, 57, 468], // LOW LINE
    0x60: [681, -357, 525, 176, 350], // GRAVE ACCENT
    0x61: [439, 6, 525, 48, 524], // LATIN SMALL LETTER A
    0x62: [611, 6, 525, 4, 492], // LATIN SMALL LETTER B
    0x63: [440, 6, 525, 66, 466], // LATIN SMALL LETTER C
    0x64: [611, 6, 525, 31, 520], // LATIN SMALL LETTER D
    0x65: [440, 6, 525, 48, 464], // LATIN SMALL LETTER E
    0x66: [617, -1, 525, 35, 437], // LATIN SMALL LETTER F
    0x67: [442, 229, 525, 28, 509], // LATIN SMALL LETTER G
    0x68: [611, -1, 525, 4, 520], // LATIN SMALL LETTER H
    0x69: [612, -1, 525, 72, 462], // LATIN SMALL LETTER I
    0x6a: [612, 228, 525, 48, 376], // LATIN SMALL LETTER J
    0x6b: [611, -1, 525, 13, 507], // LATIN SMALL LETTER K
    0x6c: [611, -1, 525, 51, 474], // LATIN SMALL LETTER L
    0x6d: [436, -1, 525, -12, 536], // LATIN SMALL LETTER M
    0x6e: [436, -1, 525, 4, 520], // LATIN SMALL LETTER N
    0x6f: [440, 6, 525, 52, 472], // LATIN SMALL LETTER O
    0x70: [437, 221, 525, 4, 492], // LATIN SMALL LETTER P
    0x71: [437, 221, 525, 34, 545], // LATIN SMALL LETTER Q
    0x72: [437, -1, 525, 24, 487], // LATIN SMALL LETTER R
    0x73: [440, 6, 525, 72, 458], // LATIN SMALL LETTER S
    0x74: [554, 6, 525, 25, 448], // LATIN SMALL LETTER T
    0x75: [431, 5, 525, 4, 520], // LATIN SMALL LETTER U
    0x76: [431, 4, 525, 24, 500], // LATIN SMALL LETTER V
    0x77: [431, 4, 525, 16, 508], // LATIN SMALL LETTER W
    0x78: [431, -1, 525, 29, 495], // LATIN SMALL LETTER X
    0x79: [431, 228, 525, 26, 500], // LATIN SMALL LETTER Y
    0x7a: [431, -1, 525, 34, 475], // LATIN SMALL LETTER Z
    0x7b: [694, 83, 525, 50, 475], // LEFT CURLY BRACKET
    0x7c: [694, 82, 525, 228, 297], // VERTICAL LINE
    0x7d: [694, 83, 525, 49, 475], // RIGHT CURLY BRACKET
    0x7e: [611, -466, 525, 87, 437], // TILDE
    0x7f: [612, -519, 525, 104, 421], // ??
    0xa0: [0, 0, 250, 0, 0], // NO-BREAK SPACE
    0x131: [431, -1, 525, 72, 462], // LATIN SMALL LETTER DOTLESS I
    0x237: [431, 228, 525, 48, 376], // LATIN SMALL LETTER DOTLESS J
    0x300: [611, -485, 0, -409, -195], // COMBINING GRAVE ACCENT
    0x301: [611, -485, 0, -331, -117], // COMBINING ACUTE ACCENT
    0x302: [611, -460, 0, -429, -97], // COMBINING CIRCUMFLEX ACCENT
    0x303: [611, -466, 0, -438, -88], // COMBINING TILDE
    0x304: [577, -500, 0, -452, -74], // COMBINING MACRON
    0x306: [611, -504, 0, -446, -79], // COMBINING BREVE
    0x308: [612, -519, 0, -421, -104], // COMBINING DIAERESIS
    0x30a: [619, -499, 0, -344, -182], // COMBINING RING ABOVE
    0x30c: [577, -449, 0, -427, -99], // COMBINING CARON
    0x393: [611, 0, 525, 25, 488], // GREEK CAPITAL LETTER GAMMA
    0x394: [623, 0, 525, 35, 489], // GREEK CAPITAL LETTER DELTA
    0x398: [621, 10, 525, 56, 468], // GREEK CAPITAL LETTER THETA
    0x39b: [623, -1, 525, 30, 495], // GREEK CAPITAL LETTER LAMDA
    0x39e: [611, -1, 525, 33, 491], // GREEK CAPITAL LETTER XI
    0x3a0: [611, -1, 525, 16, 508], // GREEK CAPITAL LETTER PI
    0x3a3: [611, -1, 525, 40, 484], // GREEK CAPITAL LETTER SIGMA
    0x3a5: [622, -1, 525, 38, 486], // GREEK CAPITAL LETTER UPSILON
    0x3a6: [611, -1, 525, 41, 483], // GREEK CAPITAL LETTER PHI
    0x3a8: [611, -1, 525, 37, 487], // GREEK CAPITAL LETTER PSI
    0x3a9: [622, -1, 525, 32, 492], // GREEK CAPITAL LETTER OMEGA
    0x7e2: [611, -287, 525, 175, 349], // ??
    0x7e3: [681, -357, 525, 176, 350], // ??
    0x2032: [623, -334, 525, 211, 313] // PRIME
  };

  CHTML.fontLoaded("TeX/" + font.substr(8));
})(MathJax.OutputJax.CommonHTML);
