/*************************************************************
 *
 *  MathJax/jax/output/SVG/fonts/Latin-Modern/fontdata.js
 *  
 *  Initializes the SVG OutputJax to use the Latin-Modern fonts

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

(function(SVG, MML, AJAX, HUB) {
  var VERSION = "2.7.5";

  var ALPHABETS = "LatinModernMathJax_Alphabets",
    ARROWS = "LatinModernMathJax_Arrows",
    DOUBLESTRUCK = "LatinModernMathJax_DoubleStruck",
    FRAKTUR = "LatinModernMathJax_Fraktur",
    LATIN = "LatinModernMathJax_Latin",
    MAIN = "LatinModernMathJax_Main",
    MARKS = "LatinModernMathJax_Marks",
    MISC = "LatinModernMathJax_Misc",
    MONOSPACE = "LatinModernMathJax_Monospace",
    NONUNICODE = "LatinModernMathJax_NonUnicode",
    NORMAL = "LatinModernMathJax_Normal",
    OPERATORS = "LatinModernMathJax_Operators",
    SANSSERIF = "LatinModernMathJax_SansSerif",
    SCRIPT = "LatinModernMathJax_Script",
    SHAPES = "LatinModernMathJax_Shapes",
    SIZE1 = "LatinModernMathJax_Size1",
    SIZE2 = "LatinModernMathJax_Size2",
    SIZE3 = "LatinModernMathJax_Size3",
    SIZE4 = "LatinModernMathJax_Size4",
    SIZE5 = "LatinModernMathJax_Size5",
    SIZE6 = "LatinModernMathJax_Size6",
    SIZE7 = "LatinModernMathJax_Size7",
    SYMBOLS = "LatinModernMathJax_Symbols",
    VARIANTS = "LatinModernMathJax_Variants";

  var H = "H",
    V = "V",
    EXTRAH = { load: "extra", dir: H },
    EXTRAV = { load: "extra", dir: V };

  SVG.Augment({
    FONTDATA: {
      version: VERSION,

      baselineskip: 1200,
      lineH: 800,
      lineD: 200,

      FONTS: {
        LatinModernMathJax_Alphabets: "Alphabets/Regular/Main.js",
        LatinModernMathJax_Arrows: "Arrows/Regular/Main.js",
        LatinModernMathJax_DoubleStruck: "DoubleStruck/Regular/Main.js",
        LatinModernMathJax_Fraktur: "Fraktur/Regular/Main.js",
        LatinModernMathJax_Latin: "Latin/Regular/Main.js",
        LatinModernMathJax_Main: "Main/Regular/Main.js",
        LatinModernMathJax_Marks: "Marks/Regular/Main.js",
        LatinModernMathJax_Misc: "Misc/Regular/Main.js",
        LatinModernMathJax_Monospace: "Monospace/Regular/Main.js",
        LatinModernMathJax_NonUnicode: "NonUnicode/Regular/Main.js",
        LatinModernMathJax_Normal: "Normal/Regular/Main.js",
        LatinModernMathJax_Operators: "Operators/Regular/Main.js",
        LatinModernMathJax_SansSerif: "SansSerif/Regular/Main.js",
        LatinModernMathJax_Script: "Script/Regular/Main.js",
        LatinModernMathJax_Shapes: "Shapes/Regular/Main.js",
        LatinModernMathJax_Size1: "Size1/Regular/Main.js",
        LatinModernMathJax_Size2: "Size2/Regular/Main.js",
        LatinModernMathJax_Size3: "Size3/Regular/Main.js",
        LatinModernMathJax_Size4: "Size4/Regular/Main.js",
        LatinModernMathJax_Size5: "Size5/Regular/Main.js",
        LatinModernMathJax_Size6: "Size6/Regular/Main.js",
        LatinModernMathJax_Size7: "Size7/Regular/Main.js",
        LatinModernMathJax_Symbols: "Symbols/Regular/Main.js",
        LatinModernMathJax_Variants: "Variants/Regular/Main.js"
      },

      VARIANT: {
        normal: {
          fonts: [
            MAIN,
            NORMAL,
            MONOSPACE,
            LATIN,
            ALPHABETS,
            MARKS,
            ARROWS,
            OPERATORS,
            SYMBOLS,
            SHAPES,
            MISC,
            VARIANTS,
            NONUNICODE,
            SIZE1
          ]
        },
        bold: {
          fonts: [
            MAIN,
            NORMAL,
            MONOSPACE,
            LATIN,
            ALPHABETS,
            MARKS,
            ARROWS,
            OPERATORS,
            SYMBOLS,
            SHAPES,
            MISC,
            VARIANTS,
            NONUNICODE,
            SIZE1
          ],
          bold: true,
          offsetA: 0x1d400,
          offsetG: 0x1d6a8,
          offsetN: 0x1d7ce
        },
        italic: {
          fonts: [
            MAIN,
            NORMAL,
            MONOSPACE,
            LATIN,
            ALPHABETS,
            MARKS,
            ARROWS,
            OPERATORS,
            SYMBOLS,
            SHAPES,
            MISC,
            VARIANTS,
            NONUNICODE,
            SIZE1
          ],
          italic: true,
          offsetA: 0x1d434,
          offsetG: 0x1d6e2,
          remap: { 0x1d455: 0x210e }
        },
        "bold-italic": {
          fonts: [
            MAIN,
            NORMAL,
            MONOSPACE,
            LATIN,
            ALPHABETS,
            MARKS,
            ARROWS,
            OPERATORS,
            SYMBOLS,
            SHAPES,
            MISC,
            VARIANTS,
            NONUNICODE,
            SIZE1
          ],
          bold: true,
          italic: true,
          offsetA: 0x1d468,
          offsetG: 0x1d71c
        },
        "double-struck": {
          fonts: [DOUBLESTRUCK],
          offsetA: 0x1d538,
          offsetN: 0x1d7d8,
          remap: {
            0x1d53a: 0x2102,
            0x1d53f: 0x210d,
            0x1d545: 0x2115,
            0x1d547: 0x2119,
            0x1d548: 0x211a,
            0x1d549: 0x211d,
            0x1d551: 0x2124
          }
        },
        fraktur: {
          fonts: [FRAKTUR],
          offsetA: 0x1d504,
          remap: {
            0x1d506: 0x212d,
            0x1d50b: 0x210c,
            0x1d50c: 0x2111,
            0x1d515: 0x211c,
            0x1d51d: 0x2128
          }
        },
        "bold-fraktur": {
          fonts: [FRAKTUR],
          bold: true,
          offsetA: 0x1d56c
        },
        script: {
          fonts: [SCRIPT],
          italic: true,
          offsetA: 0x1d49c,
          remap: {
            0x1d49d: 0x212c,
            0x1d4a0: 0x2130,
            0x1d4a1: 0x2131,
            0x1d4a3: 0x210b,
            0x1d4a4: 0x2110,
            0x1d4a7: 0x2112,
            0x1d4a8: 0x2133,
            0x1d4ad: 0x211b,
            0x1d4ba: 0x212f,
            0x1d4bc: 0x210a,
            0x1d4c4: 0x2134
          }
        },
        "bold-script": {
          fonts: [SCRIPT],
          bold: true,
          italic: true,
          offsetA: 0x1d4d0
        },
        "sans-serif": {
          fonts: [SANSSERIF],
          offsetA: 0x1d5a0,
          offsetN: 0x1d7e2
        },
        "bold-sans-serif": {
          fonts: [SANSSERIF],
          bold: true,
          offsetA: 0x1d5d4,
          offsetN: 0x1d7ec,
          offsetG: 0x1d756
        },
        "sans-serif-italic": {
          fonts: [SANSSERIF],
          italic: true,
          offsetA: 0x1d608
        },
        "sans-serif-bold-italic": {
          fonts: [SANSSERIF],
          bold: true,
          italic: true,
          offsetA: 0x1d63c,
          offsetG: 0x1d790
        },
        monospace: {
          fonts: [MONOSPACE],
          offsetA: 0x1d670,
          offsetN: 0x1d7f6
        },
        "-Latin-Modern-variant": {
          fonts: [
            VARIANTS,
            MAIN,
            NORMAL,
            MONOSPACE,
            LATIN,
            ALPHABETS,
            MARKS,
            ARROWS,
            OPERATORS,
            SYMBOLS,
            SHAPES,
            MISC,
            NONUNICODE,
            SIZE1
          ]
        },
        "-tex-caligraphic": {
          fonts: [
            MAIN,
            NORMAL,
            MONOSPACE,
            LATIN,
            ALPHABETS,
            MARKS,
            ARROWS,
            OPERATORS,
            SYMBOLS,
            SHAPES,
            MISC,
            VARIANTS,
            NONUNICODE,
            SIZE1
          ],
          italic: true
        },
        "-tex-oldstyle": {
          fonts: [
            MAIN,
            NORMAL,
            MONOSPACE,
            LATIN,
            ALPHABETS,
            MARKS,
            ARROWS,
            OPERATORS,
            SYMBOLS,
            SHAPES,
            MISC,
            VARIANTS,
            NONUNICODE,
            SIZE1
          ]
        },
        "-tex-caligraphic-bold": {
          fonts: [
            MAIN,
            NORMAL,
            MONOSPACE,
            LATIN,
            ALPHABETS,
            MARKS,
            ARROWS,
            OPERATORS,
            SYMBOLS,
            SHAPES,
            MISC,
            VARIANTS,
            NONUNICODE,
            SIZE1
          ],
          italic: true,
          bold: true
        },
        "-tex-oldstyle-bold": {
          fonts: [
            MAIN,
            NORMAL,
            MONOSPACE,
            LATIN,
            ALPHABETS,
            MARKS,
            ARROWS,
            OPERATORS,
            SYMBOLS,
            SHAPES,
            MISC,
            VARIANTS,
            NONUNICODE,
            SIZE1
          ],
          bold: true
        },
        "-tex-mathit": {
          fonts: [
            MAIN,
            NORMAL,
            MONOSPACE,
            LATIN,
            ALPHABETS,
            MARKS,
            ARROWS,
            OPERATORS,
            SYMBOLS,
            SHAPES,
            MISC,
            VARIANTS,
            NONUNICODE,
            SIZE1
          ],
          italic: true,
          noIC: true
        },
        "-largeOp": { fonts: [SIZE1, MAIN] },
        "-smallOp": {}
      },

      RANGES: [
        { name: "alpha", low: 0x61, high: 0x7a, offset: "A", add: 26 },
        { name: "Alpha", low: 0x41, high: 0x5a, offset: "A" },
        { name: "number", low: 0x30, high: 0x39, offset: "N" },
        { name: "greek", low: 0x03b1, high: 0x03c9, offset: "G", add: 26 },
        {
          name: "Greek",
          low: 0x0391,
          high: 0x03f6,
          offset: "G",
          remap: {
            0x03f5: 52,
            0x03d1: 53,
            0x03f0: 54,
            0x03d5: 55,
            0x03f1: 56,
            0x03d6: 57,
            0x03f4: 17
          }
        }
      ],

      RULECHAR: 0x2212,

      REMAP: {
        0xa: 0x20,
        0x25c2: 0x25c0,
        0x3008: 0x27e8,
        0x3009: 0x27e9,
        0x2758: 0x2223,
        0x25b8: 0x25b6,
        0x03d2: 0x03a5,
        0x25b4: 0x25b2,
        0x25b5: 0x25b3,
        0xfe37: 0x23de,
        0xfe38: 0x23df,
        0x02b9: 0x2032,
        0x25fb: 0x25a1,
        0x25fc: 0x25a0,
        0x25be: 0x25bc,
        0x203e: 0x0305,
        0x25bf: 0x25bd
      },

      REMAPACCENT: {
        "\u007E": "\u0303",
        "\u2192": "\u20D7",
        "\u0060": "\u0300",
        "\u005E": "\u0302",
        "\u00B4": "\u0301",
        "\u2032": "\u0301",
        "\u2035": "\u0300"
      },

      REMAPACCENTUNDER: {},

      DELIMITERS: {
        0x28: {
          dir: V,
          HW: [
            [996, MAIN],
            [1094, SIZE1],
            [1194, SIZE2],
            [1444, SIZE3],
            [1792, SIZE4],
            [2092, SIZE5],
            [2392, SIZE6],
            [2990, SIZE7]
          ],
          stretch: {
            bot: [0x239d, SYMBOLS],
            ext: [0x239c, SYMBOLS],
            top: [0x239b, SYMBOLS]
          }
        },
        0x29: {
          dir: V,
          HW: [
            [996, MAIN],
            [1094, SIZE1],
            [1194, SIZE2],
            [1444, SIZE3],
            [1792, SIZE4],
            [2092, SIZE5],
            [2392, SIZE6],
            [2990, SIZE7]
          ],
          stretch: {
            bot: [0x23a0, SYMBOLS],
            ext: [0x239f, SYMBOLS],
            top: [0x239e, SYMBOLS]
          }
        },
        0x2d: { alias: 0x2212, dir: H },
        0x2f: {
          dir: V,
          HW: [
            [1000, MAIN],
            [1310, SIZE1],
            [1716, SIZE2],
            [1771, SIZE2, 1.032],
            [2248, SIZE3],
            [2944, SIZE4],
            [3858, SIZE5],
            [5054, SIZE6],
            [6620, SIZE7]
          ]
        },
        0x3d: {
          dir: H,
          HW: [[666, MAIN]],
          stretch: {
            left: [0xe000, SIZE7],
            rep: [0xe001, SIZE7],
            right: [0xe002, SIZE7]
          }
        },
        0x5b: {
          dir: V,
          HW: [
            [1000, MAIN],
            [1100, SIZE1],
            [1200, SIZE2],
            [1450, SIZE3],
            [1800, SIZE4],
            [2100, SIZE5],
            [2400, SIZE6],
            [3000, SIZE7]
          ],
          stretch: {
            bot: [0x23a3, SYMBOLS],
            ext: [0x23a2, SYMBOLS],
            top: [0x23a1, SYMBOLS]
          }
        },
        0x5c: {
          dir: V,
          HW: [
            [1000, MAIN],
            [1310, SIZE1],
            [1716, SIZE2],
            [1771, SIZE2, 1.032],
            [2248, SIZE3],
            [2944, SIZE4],
            [3858, SIZE5],
            [5054, SIZE6],
            [6620, SIZE7]
          ]
        },
        0x5d: {
          dir: V,
          HW: [
            [1000, MAIN],
            [1100, SIZE1],
            [1200, SIZE2],
            [1450, SIZE3],
            [1800, SIZE4],
            [2100, SIZE5],
            [2400, SIZE6],
            [3000, SIZE7]
          ],
          stretch: {
            bot: [0x23a6, SYMBOLS],
            ext: [0x23a5, SYMBOLS],
            top: [0x23a4, SYMBOLS]
          }
        },
        0x5e: { alias: 0x302, dir: H },
        0x5f: { alias: 0x332, dir: H },
        0x7b: {
          dir: V,
          HW: [
            [1000, MAIN],
            [1100, SIZE1],
            [1200, SIZE2],
            [1450, SIZE3],
            [1800, SIZE4],
            [2100, SIZE5],
            [2400, SIZE6],
            [3000, SIZE7]
          ],
          stretch: {
            bot: [0x23a9, SYMBOLS],
            ext: [0xe003, SIZE7],
            mid: [0x23a8, SYMBOLS],
            top: [0x23a7, SYMBOLS]
          }
        },
        0x7c: {
          dir: V,
          HW: [
            [1000, MAIN],
            [1202, SIZE1],
            [1444, SIZE2],
            [1734, SIZE3],
            [2084, SIZE4],
            [2502, SIZE5],
            [3004, SIZE6],
            [3606, SIZE7]
          ],
          stretch: {
            bot: [0xe004, SIZE7],
            ext: [0xe005, SIZE7],
            top: [0xe006, SIZE7]
          }
        },
        0x7d: {
          dir: V,
          HW: [
            [1000, MAIN],
            [1100, SIZE1],
            [1200, SIZE2],
            [1450, SIZE3],
            [1800, SIZE4],
            [2100, SIZE5],
            [2400, SIZE6],
            [3000, SIZE7]
          ],
          stretch: {
            bot: [0x23ad, SYMBOLS],
            ext: [0xe007, SIZE7],
            mid: [0x23ac, SYMBOLS],
            top: [0x23ab, SYMBOLS]
          }
        },
        0x7e: { alias: 0x303, dir: H },
        0xaf: { alias: 0x332, dir: H },
        0x2c6: { alias: 0x302, dir: H },
        0x2c9: { alias: 0x2212, dir: H },
        0x2dc: { alias: 0x303, dir: H },
        0x302: {
          dir: H,
          HW: [
            [364, MAIN],
            [644, SIZE1],
            [768, SIZE2],
            [919, SIZE3],
            [1100, SIZE4],
            [1320, SIZE5],
            [1581, SIZE6],
            [1896, SIZE7]
          ]
        },
        0x303: {
          dir: H,
          HW: [
            [370, MAIN],
            [652, SIZE1],
            [778, SIZE2],
            [931, SIZE3],
            [1115, SIZE4],
            [1335, SIZE5],
            [1599, SIZE6],
            [1915, SIZE7]
          ]
        },
        0x2212: {
          HW: [],
          stretch: { rep: [0x2212, MAIN, 0, 0, 0, -0.31, -0.31] }
        },
        0x306: EXTRAH,
        0x30c: {
          dir: H,
          HW: [
            [364, MAIN],
            [644, SIZE1],
            [768, SIZE2],
            [919, SIZE3],
            [1100, SIZE4],
            [1320, SIZE5],
            [1581, SIZE6],
            [1896, SIZE7]
          ]
        },
        0x311: EXTRAH,
        0x32c: EXTRAH,
        0x32d: EXTRAH,
        0x32e: EXTRAH,
        0x32f: EXTRAH,
        0x330: EXTRAH,
        0x332: {
          dir: H,
          HW: [[392, MARKS], [568, SIZE1]],
          stretch: {
            left: [0xe0f5, SIZE7],
            rep: [0xe0f6, SIZE7],
            right: [0xe0f7, SIZE7]
          }
        },
        0x333: EXTRAH,
        0x33f: EXTRAH,
        0x2015: { alias: 0x2212, dir: H },
        0x2016: {
          dir: V,
          HW: [
            [1000, MAIN],
            [1202, SIZE1],
            [1444, SIZE2],
            [1734, SIZE3],
            [2084, SIZE4],
            [2502, SIZE5],
            [3004, SIZE6],
            [3606, SIZE7]
          ],
          stretch: {
            bot: [0xe12a, SIZE7],
            ext: [0xe12b, SIZE7],
            top: [0xe12c, SIZE7]
          }
        },
        0x2017: { alias: 0x2212, dir: H },
        0x203e: { alias: 0x2212, dir: H },
        0x2044: {
          dir: V,
          HW: [
            [1000, MAIN],
            [1310, SIZE1],
            [1716, SIZE2],
            [2248, SIZE3],
            [2944, SIZE4],
            [3858, SIZE5],
            [5054, SIZE6],
            [6620, SIZE7]
          ]
        },
        0x20d0: EXTRAH,
        0x20d1: EXTRAH,
        0x20d6: EXTRAH,
        0x20d7: EXTRAH,
        0x20e1: EXTRAH,
        0x20e9: EXTRAH,
        0x20ec: EXTRAH,
        0x20ed: EXTRAH,
        0x20ee: EXTRAH,
        0x20ef: EXTRAH,
        0x2190: {
          dir: H,
          HW: [[885, MAIN], [1351, SIZE1]],
          stretch: {
            left: [0xe023, SIZE7],
            rep: [0xe024, SIZE7],
            right: [0xe025, SIZE7]
          }
        },
        0x2191: {
          dir: V,
          HW: [[882, MAIN], [1348, SIZE1]],
          stretch: {
            bot: [0xe029, SIZE7],
            ext: [0xe02a, SIZE7],
            top: [0xe02b, SIZE7]
          }
        },
        0x2192: {
          dir: H,
          HW: [[885, MAIN], [1351, SIZE1]],
          stretch: {
            left: [0xe026, SIZE7],
            rep: [0xe027, SIZE7],
            right: [0xe028, SIZE7]
          }
        },
        0x2193: {
          dir: V,
          HW: [[882, MAIN], [1348, SIZE1]],
          stretch: {
            bot: [0xe02c, SIZE7],
            ext: [0xe02d, SIZE7],
            top: [0xe02e, SIZE7]
          }
        },
        0x2194: {
          dir: H,
          HW: [[884, MAIN], [1330, SIZE1]],
          stretch: {
            left: [0xe037, SIZE7],
            rep: [0xe038, SIZE7],
            right: [0xe039, SIZE7]
          }
        },
        0x2195: {
          dir: V,
          HW: [[1014, MAIN], [1014, SIZE1]],
          stretch: {
            bot: [0xe03a, SIZE7],
            ext: [0xe03b, SIZE7],
            top: [0xe03c, SIZE7]
          }
        },
        0x2196: EXTRAV,
        0x2197: EXTRAV,
        0x2198: EXTRAV,
        0x2199: EXTRAV,
        0x219a: EXTRAH,
        0x219b: EXTRAH,
        0x219e: EXTRAH,
        0x219f: EXTRAV,
        0x21a0: EXTRAH,
        0x21a1: EXTRAV,
        0x21a2: EXTRAH,
        0x21a3: EXTRAH,
        0x21a4: {
          dir: H,
          HW: [[865, ARROWS], [1331, SIZE1]],
          stretch: {
            left: [0xe053, SIZE7],
            rep: [0xe054, SIZE7],
            right: [0xe055, SIZE7]
          }
        },
        0x21a5: EXTRAV,
        0x21a6: {
          dir: H,
          HW: [[865, MAIN], [1331, SIZE1]],
          stretch: {
            left: [0xe056, SIZE7],
            rep: [0xe057, SIZE7],
            right: [0xe058, SIZE7]
          }
        },
        0x21a7: EXTRAV,
        0x21a9: EXTRAH,
        0x21aa: EXTRAH,
        0x21ab: EXTRAH,
        0x21ac: EXTRAH,
        0x21ad: EXTRAH,
        0x21ae: EXTRAH,
        0x21b0: EXTRAV,
        0x21b1: EXTRAV,
        0x21b2: EXTRAV,
        0x21b3: EXTRAV,
        0x21b6: EXTRAH,
        0x21b7: EXTRAH,
        0x21bc: EXTRAH,
        0x21bd: EXTRAH,
        0x21be: EXTRAV,
        0x21bf: EXTRAV,
        0x21c0: EXTRAH,
        0x21c1: EXTRAH,
        0x21c2: EXTRAV,
        0x21c3: EXTRAV,
        0x21c4: EXTRAH,
        0x21c5: EXTRAV,
        0x21c6: EXTRAH,
        0x21c7: EXTRAH,
        0x21c8: EXTRAV,
        0x21c9: EXTRAH,
        0x21ca: EXTRAV,
        0x21cb: EXTRAH,
        0x21cc: EXTRAH,
        0x21cd: EXTRAH,
        0x21ce: EXTRAH,
        0x21cf: EXTRAH,
        0x21d0: {
          dir: H,
          HW: [[879, MAIN], [1345, SIZE1]],
          stretch: {
            left: [0xe0a7, SIZE7],
            rep: [0xe0a8, SIZE7],
            right: [0xe0a9, SIZE7]
          }
        },
        0x21d1: {
          dir: V,
          HW: [[879, MAIN], [1345, SIZE1]],
          stretch: {
            bot: [0xe0ad, SIZE7],
            ext: [0xe0ae, SIZE7],
            top: [0xe0af, SIZE7]
          }
        },
        0x21d2: {
          dir: H,
          HW: [[879, MAIN], [1345, SIZE1]],
          stretch: {
            left: [0xe0aa, SIZE7],
            rep: [0xe0ab, SIZE7],
            right: [0xe0ac, SIZE7]
          }
        },
        0x21d3: {
          dir: V,
          HW: [[879, MAIN], [1345, SIZE1]],
          stretch: {
            bot: [0xe0b0, SIZE7],
            ext: [0xe0b1, SIZE7],
            top: [0xe0b2, SIZE7]
          }
        },
        0x21d4: {
          dir: H,
          HW: [[956, MAIN], [1422, SIZE1]],
          stretch: {
            left: [0xe0b3, SIZE7],
            rep: [0xe0b4, SIZE7],
            right: [0xe0b5, SIZE7]
          }
        },
        0x21d5: {
          dir: V,
          HW: [[956, MAIN], [1422, SIZE1]],
          stretch: {
            bot: [0xe0b6, SIZE7],
            ext: [0xe0b7, SIZE7],
            top: [0xe0b8, SIZE7]
          }
        },
        0x21d6: EXTRAV,
        0x21d7: EXTRAV,
        0x21d8: EXTRAV,
        0x21d9: EXTRAV,
        0x21da: EXTRAH,
        0x21db: EXTRAH,
        0x21dc: EXTRAH,
        0x21dd: EXTRAH,
        0x21e6: EXTRAH,
        0x21e7: EXTRAV,
        0x21e8: EXTRAH,
        0x21e9: EXTRAV,
        0x21f3: EXTRAV,
        0x21f5: EXTRAV,
        0x21f6: EXTRAH,
        0x220f: EXTRAV,
        0x2210: EXTRAV,
        0x2211: EXTRAV,
        0x2212: {
          dir: H,
          HW: [[666, MAIN]],
          stretch: {
            left: [0xe127, SIZE7],
            rep: [0xe128, SIZE7],
            right: [0xe129, SIZE7]
          }
        },
        0x2215: { alias: 0x2044, dir: V },
        0x221a: {
          dir: V,
          HW: [
            [1000, MAIN],
            [1200, SIZE1],
            [1800, SIZE2],
            [2400, SIZE3],
            [3000, SIZE4]
          ],
          stretch: {
            bot: [0x23b7, SYMBOLS],
            ext: [0xe133, SIZE7],
            top: [0xe134, SIZE7]
          }
        },
        0x2223: {
          dir: V,
          HW: [
            [1000, MAIN],
            [1202, SIZE1],
            [1444, SIZE2],
            [1734, SIZE3],
            [2084, SIZE4],
            [2502, SIZE5],
            [3004, SIZE6],
            [3606, SIZE7]
          ],
          stretch: {
            bot: [0xe004, SIZE7],
            ext: [0xe005, SIZE7],
            top: [0xe006, SIZE7]
          }
        },
        0x2225: {
          dir: V,
          HW: [
            [1000, MAIN],
            [1202, SIZE1],
            [1444, SIZE2],
            [1734, SIZE3],
            [2084, SIZE4],
            [2502, SIZE5],
            [3004, SIZE6],
            [3606, SIZE7]
          ],
          stretch: {
            bot: [0xe12a, SIZE7],
            ext: [0xe12b, SIZE7],
            top: [0xe12c, SIZE7]
          }
        },
        0x222b: EXTRAV,
        0x222c: EXTRAV,
        0x222d: EXTRAV,
        0x222e: EXTRAV,
        0x222f: EXTRAV,
        0x2230: EXTRAV,
        0x2231: EXTRAV,
        0x2232: EXTRAV,
        0x2233: EXTRAV,
        0x2261: EXTRAH,
        0x2263: EXTRAH,
        0x22a2: EXTRAV,
        0x22a3: EXTRAV,
        0x22a4: EXTRAV,
        0x22a5: EXTRAV,
        0x22c0: EXTRAV,
        0x22c1: EXTRAV,
        0x22c2: EXTRAV,
        0x22c3: EXTRAV,
        0x2308: {
          dir: V,
          HW: [
            [1000, MAIN],
            [1100, SIZE1],
            [1200, SIZE2],
            [1450, SIZE3],
            [1800, SIZE4],
            [2100, SIZE5],
            [2400, SIZE6],
            [3000, SIZE7]
          ],
          stretch: { ext: [0x23a2, SYMBOLS], top: [0x23a1, SYMBOLS] }
        },
        0x2309: {
          dir: V,
          HW: [
            [1000, MAIN],
            [1100, SIZE1],
            [1200, SIZE2],
            [1450, SIZE3],
            [1800, SIZE4],
            [2100, SIZE5],
            [2400, SIZE6],
            [3000, SIZE7]
          ],
          stretch: { ext: [0x23a5, SYMBOLS], top: [0x23a4, SYMBOLS] }
        },
        0x230a: {
          dir: V,
          HW: [
            [1000, MAIN],
            [1100, SIZE1],
            [1200, SIZE2],
            [1450, SIZE3],
            [1800, SIZE4],
            [2100, SIZE5],
            [2400, SIZE6],
            [3000, SIZE7]
          ],
          stretch: { bot: [0x23a3, SYMBOLS], ext: [0x23a2, SYMBOLS] }
        },
        0x230b: {
          dir: V,
          HW: [
            [1000, MAIN],
            [1100, SIZE1],
            [1200, SIZE2],
            [1450, SIZE3],
            [1800, SIZE4],
            [2100, SIZE5],
            [2400, SIZE6],
            [3000, SIZE7]
          ],
          stretch: { bot: [0x23a6, SYMBOLS], ext: [0x23a5, SYMBOLS] }
        },
        0x2312: { alias: 0x23dc, dir: H },
        0x2322: { alias: 0x23dc, dir: H },
        0x2323: { alias: 0x23dd, dir: H },
        0x2329: {
          dir: V,
          HW: [
            [1000, SYMBOLS],
            [1100, SIZE1],
            [1200, SIZE2],
            [1450, SIZE3],
            [1800, SIZE4],
            [2100, SIZE5],
            [2400, SIZE6],
            [3000, SIZE7]
          ]
        },
        0x232a: {
          dir: V,
          HW: [
            [1000, SYMBOLS],
            [1100, SIZE1],
            [1200, SIZE2],
            [1450, SIZE3],
            [1800, SIZE4],
            [2100, SIZE5],
            [2400, SIZE6],
            [3000, SIZE7]
          ]
        },
        0x23aa: {
          dir: V,
          HW: [[748, SYMBOLS]],
          stretch: { ext: [0x23aa, SYMBOLS] }
        },
        0x23af: { alias: 0x2212, dir: H },
        0x23b0: {
          dir: V,
          HW: [[750, SYMBOLS, null, 0x23a7]],
          stretch: {
            top: [0x23a7, SYMBOLS],
            ext: [0x23aa, SYMBOLS],
            bot: [0x23ad, SYMBOLS]
          }
        },
        0x23b1: {
          dir: V,
          HW: [[750, SYMBOLS, null, 0x23ab]],
          stretch: {
            top: [0x23ab, SYMBOLS],
            ext: [0x23aa, SYMBOLS],
            bot: [0x23a9, SYMBOLS]
          }
        },
        0x23b4: EXTRAH,
        0x23b5: EXTRAH,
        0x23d0: {
          dir: V,
          HW: [
            [1000, MAIN, null, 0x7c],
            [1309, MAIN, 1.309, 0x7c],
            [1771, MAIN, 1.771, 0x7c],
            [2233, MAIN, 2.233, 0x7c],
            [2695, MAIN, 2.695, 0x7c]
          ],
          stretch: { ext: [0x7c, MAIN] }
        },
        0x23dc: EXTRAH,
        0x23dd: EXTRAH,
        0x23de: {
          dir: H,
          HW: [
            [492, MAIN],
            [993, SIZE1],
            [1494, SIZE2],
            [1996, SIZE3],
            [2498, SIZE4],
            [3000, SIZE5],
            [3502, SIZE6],
            [4006, SIZE7]
          ],
          stretch: {
            left: [0xe10d, SIZE7],
            rep: [0xe10e, SIZE7],
            mid: [0xe10f, SIZE7],
            right: [0xe110, SIZE7]
          }
        },
        0x23df: {
          dir: H,
          HW: [
            [492, MAIN],
            [993, SIZE1],
            [1494, SIZE2],
            [1996, SIZE3],
            [2498, SIZE4],
            [3000, SIZE5],
            [3502, SIZE6],
            [4006, SIZE7]
          ],
          stretch: {
            left: [0xe111, SIZE7],
            rep: [0xe112, SIZE7],
            mid: [0xe113, SIZE7],
            right: [0xe114, SIZE7]
          }
        },
        0x23e0: EXTRAH,
        0x23e1: EXTRAH,
        0x2500: { alias: 0x2212, dir: H },
        0x27a1: EXTRAH,
        0x27e6: EXTRAV,
        0x27e7: EXTRAV,
        0x27e8: {
          dir: V,
          HW: [
            [1000, MAIN],
            [1100, SIZE1],
            [1200, SIZE2],
            [1450, SIZE3],
            [1800, SIZE4],
            [2100, SIZE5],
            [2400, SIZE6],
            [3000, SIZE7]
          ]
        },
        0x27e9: {
          dir: V,
          HW: [
            [1000, MAIN],
            [1100, SIZE1],
            [1200, SIZE2],
            [1450, SIZE3],
            [1800, SIZE4],
            [2100, SIZE5],
            [2400, SIZE6],
            [3000, SIZE7]
          ]
        },
        0x27ea: EXTRAV,
        0x27eb: EXTRAV,
        0x27ee: {
          dir: V,
          HW: [
            [1024, MAIN],
            [1126, SIZE1],
            [1228, SIZE2],
            [1482, SIZE3],
            [1836, SIZE4],
            [2140, SIZE5],
            [2444, SIZE6],
            [3052, SIZE7]
          ],
          stretch: {
            bot: [0xe101, SIZE7],
            ext: [0xe102, SIZE7],
            top: [0xe103, SIZE7]
          }
        },
        0x27ef: {
          dir: V,
          HW: [
            [1024, MAIN],
            [1126, SIZE1],
            [1228, SIZE2],
            [1482, SIZE3],
            [1836, SIZE4],
            [2140, SIZE5],
            [2444, SIZE6],
            [3052, SIZE7]
          ],
          stretch: {
            bot: [0xe104, SIZE7],
            ext: [0xe105, SIZE7],
            top: [0xe106, SIZE7]
          }
        },
        0x27f5: { alias: 0x2190, dir: H },
        0x27f6: { alias: 0x2192, dir: H },
        0x27f7: { alias: 0x2194, dir: H },
        0x27f8: { alias: 0x21d0, dir: H },
        0x27f9: { alias: 0x21d2, dir: H },
        0x27fa: { alias: 0x21d4, dir: H },
        0x27fb: { alias: 0x21a4, dir: H },
        0x27fc: { alias: 0x21a6, dir: H },
        0x27fd: { alias: 0x2906, dir: H },
        0x27fe: { alias: 0x2907, dir: H },
        0x2906: {
          dir: H,
          HW: [[879, ARROWS], [1325, SIZE1]],
          stretch: {
            left: [0xe0c5, SIZE7],
            rep: [0xe0c6, SIZE7],
            right: [0xe0c7, SIZE7]
          }
        },
        0x2907: {
          dir: H,
          HW: [[879, ARROWS], [1325, SIZE1]],
          stretch: {
            left: [0xe0c8, SIZE7],
            rep: [0xe0c9, SIZE7],
            right: [0xe0ca, SIZE7]
          }
        },
        0x2a00: EXTRAV,
        0x2a01: EXTRAV,
        0x2a02: EXTRAV,
        0x2a03: EXTRAV,
        0x2a04: EXTRAV,
        0x2a05: EXTRAV,
        0x2a06: EXTRAV,
        0x2a09: EXTRAV,
        0x2a0c: EXTRAV,
        0x2a11: EXTRAV,
        0x2b04: EXTRAH,
        0x2b05: EXTRAH,
        0x2b06: EXTRAV,
        0x2b07: EXTRAV,
        0x2b0c: EXTRAH,
        0x2b0d: EXTRAV,
        0x2b31: EXTRAH,
        0x3008: { alias: 0x27e8, dir: V },
        0x3009: { alias: 0x27e9, dir: V },
        0xfe37: { alias: 0x23de, dir: H },
        0xfe38: { alias: 0x23df, dir: H }
      }
    }
  });
  MathJax.Hub.Register.LoadHook(
    SVG.fontDir + "/Main/Regular/Main.js",
    function() {
      SVG.FONTDATA.FONTS[MAIN][0x2212][0] = SVG.FONTDATA.FONTS[MAIN][0x002b][0]; // - needs height and depth of +
      SVG.FONTDATA.FONTS[MAIN][0x2212][1] = SVG.FONTDATA.FONTS[MAIN][0x002b][1]; // - needs height and depth of +
    }
  );
  MathJax.Hub.Register.LoadHook(
    SVG.fontDir + "/Size7/Regular/Main.js",
    function() {
      var u;
      u = SVG.FONTDATA.DELIMITERS[0x23de].stretch.rep[0];
      SVG.FONTDATA.FONTS[SIZE7][u][0] += 200; // adjust height for brace extender
      SVG.FONTDATA.FONTS[SIZE7][u][1] += 200; // adjust depth for brace extender
      u = SVG.FONTDATA.DELIMITERS[0x23df].stretch.rep[0];
      SVG.FONTDATA.FONTS[SIZE7][u][0] += 200; // adjust height for brace extender
      SVG.FONTDATA.FONTS[SIZE7][u][1] += 200; // adjust depth for brace extender
    }
  );
  MathJax.Hub.Register.LoadHook(
    SVG.fontDir + "/Size1/Regular/Main.js",
    function() {
      SVG.FONTDATA.FONTS[SIZE1][0x222b][2] -= 425;
      SVG.FONTDATA.FONTS[SIZE1][0x222c][2] -= 425;
      SVG.FONTDATA.FONTS[SIZE1][0x222d][2] -= 425;
      SVG.FONTDATA.FONTS[SIZE1][0x222e][2] -= 425;
      SVG.FONTDATA.FONTS[SIZE1][0x222f][2] -= 425;
      SVG.FONTDATA.FONTS[SIZE1][0x2230][2] -= 425;
      SVG.FONTDATA.FONTS[SIZE1][0x2231][2] -= 425;
      SVG.FONTDATA.FONTS[SIZE1][0x2232][2] -= 425;
      SVG.FONTDATA.FONTS[SIZE1][0x2233][2] -= 425;
      SVG.FONTDATA.FONTS[SIZE1][0x2a0c][2] -= 425;
      SVG.FONTDATA.FONTS[SIZE1][0x2a11][2] -= 425;
    }
  );
  AJAX.loadComplete(SVG.fontDir + "/fontdata.js");
})(MathJax.OutputJax.SVG, MathJax.ElementJax.mml, MathJax.Ajax, MathJax.Hub);
