/*************************************************************
 *
 *  MathJax/jax/output/SVG/fonts/Neo-Euler/fontdata.js
 *  
 *  Initializes the SVG OutputJax to use the Neo-Euler fonts

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

  var ALPHABETS = "NeoEulerMathJax_Alphabets",
    ARROWS = "NeoEulerMathJax_Arrows",
    FRAKTUR = "NeoEulerMathJax_Fraktur",
    MAIN = "NeoEulerMathJax_Main",
    MARKS = "NeoEulerMathJax_Marks",
    NONUNICODE = "NeoEulerMathJax_NonUnicode",
    NORMAL = "NeoEulerMathJax_Normal",
    OPERATORS = "NeoEulerMathJax_Operators",
    SCRIPT = "NeoEulerMathJax_Script",
    SHAPES = "NeoEulerMathJax_Shapes",
    SIZE1 = "NeoEulerMathJax_Size1",
    SIZE2 = "NeoEulerMathJax_Size2",
    SIZE3 = "NeoEulerMathJax_Size3",
    SIZE4 = "NeoEulerMathJax_Size4",
    SIZE5 = "NeoEulerMathJax_Size5",
    SYMBOLS = "NeoEulerMathJax_Symbols",
    VARIANTS = "NeoEulerMathJax_Variants",
    DOUBLESTRUCK = "NeoEulerMathJax_Normal",
    SANSSERIF = "NeoEulerMathJax_Normal",
    MONOSPACE = "NeoEulerMathJax_Normal";

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
        NeoEulerMathJax_Alphabets: "Alphabets/Regular/Main.js",
        NeoEulerMathJax_Arrows: "Arrows/Regular/Main.js",
        NeoEulerMathJax_Fraktur: "Fraktur/Regular/Main.js",
        NeoEulerMathJax_Main: "Main/Regular/Main.js",
        NeoEulerMathJax_Marks: "Marks/Regular/Main.js",
        NeoEulerMathJax_NonUnicode: "NonUnicode/Regular/Main.js",
        NeoEulerMathJax_Normal: "Normal/Regular/Main.js",
        NeoEulerMathJax_Operators: "Operators/Regular/Main.js",
        NeoEulerMathJax_Script: "Script/Regular/Main.js",
        NeoEulerMathJax_Shapes: "Shapes/Regular/Main.js",
        NeoEulerMathJax_Size1: "Size1/Regular/Main.js",
        NeoEulerMathJax_Size2: "Size2/Regular/Main.js",
        NeoEulerMathJax_Size3: "Size3/Regular/Main.js",
        NeoEulerMathJax_Size4: "Size4/Regular/Main.js",
        NeoEulerMathJax_Size5: "Size5/Regular/Main.js",
        NeoEulerMathJax_Symbols: "Symbols/Regular/Main.js",
        NeoEulerMathJax_Variants: "Variants/Regular/Main.js"
      },

      VARIANT: {
        normal: {
          fonts: [
            MAIN,
            NORMAL,
            ALPHABETS,
            MARKS,
            ARROWS,
            OPERATORS,
            SYMBOLS,
            SHAPES,
            VARIANTS,
            NONUNICODE,
            SIZE1
          ]
        },
        bold: {
          fonts: [
            MAIN,
            NORMAL,
            ALPHABETS,
            MARKS,
            ARROWS,
            OPERATORS,
            SYMBOLS,
            SHAPES,
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
            ALPHABETS,
            MARKS,
            ARROWS,
            OPERATORS,
            SYMBOLS,
            SHAPES,
            VARIANTS,
            NONUNICODE,
            SIZE1
          ],
          italic: true
        },
        "bold-italic": {
          fonts: [
            MAIN,
            NORMAL,
            ALPHABETS,
            MARKS,
            ARROWS,
            OPERATORS,
            SYMBOLS,
            SHAPES,
            VARIANTS,
            NONUNICODE,
            SIZE1
          ],
          bold: true,
          italic: true
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
        "-Neo-Euler-variant": {
          fonts: [
            VARIANTS,
            MAIN,
            NORMAL,
            ALPHABETS,
            MARKS,
            ARROWS,
            OPERATORS,
            SYMBOLS,
            SHAPES,
            NONUNICODE,
            SIZE1
          ]
        },
        "-tex-caligraphic": {
          fonts: [
            MAIN,
            NORMAL,
            ALPHABETS,
            MARKS,
            ARROWS,
            OPERATORS,
            SYMBOLS,
            SHAPES,
            VARIANTS,
            NONUNICODE,
            SIZE1
          ],
          italic: true
        },
        "-tex-oldstyle": {
          offsetN: 0xe200,
          fonts: [
            VARIANTS,
            MAIN,
            NORMAL,
            ALPHABETS,
            MARKS,
            ARROWS,
            OPERATORS,
            SYMBOLS,
            SHAPES,
            NONUNICODE,
            SIZE1
          ]
        },
        "-tex-caligraphic-bold": {
          fonts: [
            MAIN,
            NORMAL,
            ALPHABETS,
            MARKS,
            ARROWS,
            OPERATORS,
            SYMBOLS,
            SHAPES,
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
            ALPHABETS,
            MARKS,
            ARROWS,
            OPERATORS,
            SYMBOLS,
            SHAPES,
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
            ALPHABETS,
            MARKS,
            ARROWS,
            OPERATORS,
            SYMBOLS,
            SHAPES,
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
        0x20f0: 0x002a,
        0x2022: 0x2219,
        0x22e3: "\u2292\u0338",
        0x22e2: "\u2291\u0338",
        0x3008: 0x27e8,
        0x02c9: 0x00af,
        0x2017: 0x005f,
        0x20ec: 0x21c1,
        0x20ed: 0x21bd,
        0x2a2f: 0x00d7,
        0x20d0: 0x21bc,
        0x20d1: 0x21c0,
        0x03d2: 0x03a5,
        0x2014: 0x00af,
        0x2015: 0x00af,
        0x3009: 0x27e9,
        0xfe37: 0x23de,
        0xfe38: 0x23df,
        0x02b9: 0x2032,
        0x2758: 0x2223,
        0x203e: 0x00af
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
            [925, MAIN],
            [1198, SIZE1],
            [1798, SIZE2],
            [1961, SIZE2, 1.091],
            [2398, SIZE3],
            [2998, SIZE4]
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
            [925, MAIN],
            [1198, SIZE1],
            [1798, SIZE2],
            [1961, SIZE2, 1.091],
            [2398, SIZE3],
            [2998, SIZE4]
          ],
          stretch: {
            bot: [0x23a0, SYMBOLS],
            ext: [0x239f, SYMBOLS],
            top: [0x239e, SYMBOLS]
          }
        },
        0x2d: { alias: 0xaf, dir: H },
        0x2f: {
          dir: V,
          HW: [
            [912, MAIN],
            [1199, SIZE1],
            [1799, SIZE2],
            [1961, SIZE2, 1.09],
            [2399, SIZE3],
            [2999, SIZE4]
          ]
        },
        0x3d: {
          dir: H,
          HW: [[668, MAIN]],
          stretch: { rep: [0x3d, MAIN] }
        },
        0x5b: {
          dir: V,
          HW: [
            [866, MAIN],
            [1199, SIZE1],
            [1799, SIZE2],
            [1961, SIZE2, 1.09],
            [2399, SIZE3],
            [2999, SIZE4]
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
            [914, MAIN],
            [1199, SIZE1],
            [1799, SIZE2],
            [1961, SIZE2, 1.09],
            [2399, SIZE3],
            [2999, SIZE4]
          ]
        },
        0x5d: {
          dir: V,
          HW: [
            [866, MAIN],
            [1199, SIZE1],
            [1799, SIZE2],
            [1961, SIZE2, 1.09],
            [2399, SIZE3],
            [2999, SIZE4]
          ],
          stretch: {
            bot: [0x23a6, SYMBOLS],
            ext: [0x23a5, SYMBOLS],
            top: [0x23a4, SYMBOLS]
          }
        },
        0x5f: { alias: 0xaf, dir: H },
        0x7b: {
          dir: V,
          HW: [
            [908, MAIN],
            [1199, SIZE1],
            [1799, SIZE2],
            [1961, SIZE2, 1.09],
            [2399, SIZE3],
            [2999, SIZE4]
          ],
          stretch: {
            bot: [0x23a9, SYMBOLS],
            ext: [0x23aa, SYMBOLS],
            mid: [0x23a8, SYMBOLS],
            top: [0x23a7, SYMBOLS]
          }
        },
        0x7c: {
          dir: V,
          HW: [
            [905, MAIN],
            [1505, SIZE1],
            [2105, SIZE2],
            [2706, SIZE3],
            [3306, SIZE4]
          ],
          stretch: { bot: [0xe000, SIZE5], ext: [0xe001, SIZE5] }
        },
        0x7d: {
          dir: V,
          HW: [
            [908, MAIN],
            [1199, SIZE1],
            [1799, SIZE2],
            [1961, SIZE2, 1.09],
            [2399, SIZE3],
            [2999, SIZE4]
          ],
          stretch: {
            bot: [0x23ad, SYMBOLS],
            ext: [0x23aa, SYMBOLS],
            mid: [0x23ac, SYMBOLS],
            top: [0x23ab, SYMBOLS]
          }
        },
        0xaf: {
          dir: H,
          HW: [[312, MAIN]],
          stretch: { rep: [0xaf, MAIN] }
        },
        0xc9: { alias: 0xaf, dir: H },
        0x332: { alias: 0xaf, dir: H },
        0x2015: { alias: 0xaf, dir: H },
        0x2016: {
          dir: V,
          HW: [
            [905, MAIN],
            [1505, SIZE1],
            [2105, SIZE2],
            [2706, SIZE3],
            [3306, SIZE4]
          ],
          stretch: { bot: [0xe002, SIZE5], ext: [0xe003, SIZE5] }
        },
        0x2017: { alias: 0xaf, dir: H },
        0x203e: { alias: 0xaf, dir: H },
        0x2044: EXTRAV,
        0x20d6: {
          dir: H,
          HW: [[418, MARKS]],
          stretch: { left: [0x20d6, MARKS], rep: [0xe004, SIZE5] }
        },
        0x20d7: {
          dir: H,
          HW: [[418, MAIN]],
          stretch: { rep: [0xe004, SIZE5], right: [0x20d7, MAIN] }
        },
        0x20e1: EXTRAH,
        0x20ee: EXTRAH,
        0x20ef: EXTRAH,
        0x2190: { alias: 0x20d6, dir: H },
        0x2191: {
          dir: V,
          HW: [[887, MAIN]],
          stretch: { top: [0x2191, MAIN], ext: [0x7c, MAIN] }
        },
        0x2192: { alias: 0x20d7, dir: H },
        0x2193: {
          dir: V,
          HW: [[867, MAIN]],
          stretch: { ext: [0x7c, MAIN], bot: [0x2193, MAIN] }
        },
        0x2194: { alias: 0x20e1, dir: H },
        0x2195: {
          dir: V,
          HW: [[1042, MAIN]],
          stretch: {
            top: [0x2191, MAIN],
            ext: [0x7c, MAIN],
            bot: [0x2193, MAIN]
          }
        },
        0x21d0: {
          dir: H,
          HW: [[867, MAIN], [1567, SIZE1]]
        },
        0x21d1: {
          dir: H,
          HW: [[640, MAIN]],
          stretch: { top: [0x21d1, MAIN], ext: [0x2016, MAIN] }
        },
        0x21d2: {
          dir: H,
          HW: [[867, MAIN], [1567, SIZE1]]
        },
        0x21d3: {
          dir: H,
          HW: [[640, MAIN]],
          stretch: { ext: [0x2016, MAIN], bot: [0x21d3, MAIN] }
        },
        0x21d4: {
          dir: H,
          HW: [[867, MAIN, null, 0x21d0], [1632, SIZE1]]
        },
        0x21d5: {
          dir: H,
          HW: [[640, MAIN]],
          stretch: {
            top: [0x21d1, MAIN],
            ext: [0x2016, MAIN],
            bot: [0x21d3, MAIN]
          }
        },
        0x220f: EXTRAV,
        0x2210: EXTRAV,
        0x2211: EXTRAV,
        0x2212: {
          dir: H,
          HW: [],
          stretch: { rep: [0x2212, MAIN, 0, 0, 0, -0.31, -0.31] }
        },
        0x2215: {
          dir: V,
          HW: [
            [912, MAIN],
            [1199, SIZE1],
            [1799, SIZE2],
            [2399, SIZE3],
            [2999, SIZE4]
          ]
        },
        0x221a: {
          dir: V,
          HW: [
            [989, MAIN],
            [1209, SIZE1],
            [1801, SIZE2],
            [2403, SIZE3],
            [3003, SIZE4]
          ],
          stretch: {
            bot: [0xe006, SIZE5],
            ext: [0xe007, SIZE5],
            top: [0xe008, SIZE5]
          }
        },
        0x2223: {
          dir: V,
          HW: [
            [795, MAIN],
            [1505, SIZE1],
            [2105, SIZE2],
            [2706, SIZE3],
            [3306, SIZE4]
          ]
        },
        0x2225: {
          dir: V,
          HW: [
            [905, MAIN],
            [905, SIZE1],
            [1505, SIZE2],
            [2105, SIZE3],
            [2706, SIZE4],
            [3306, SIZE5]
          ],
          stretch: { bot: [0xe002, SIZE5], ext: [0xe003, SIZE5] }
        },
        0x2227: EXTRAV,
        0x2228: EXTRAV,
        0x2229: EXTRAV,
        0x222a: EXTRAV,
        0x222b: EXTRAV,
        0x222c: EXTRAV,
        0x222d: EXTRAV,
        0x222e: EXTRAV,
        0x228e: EXTRAV,
        0x22c0: EXTRAV,
        0x22c1: EXTRAV,
        0x22c2: EXTRAV,
        0x22c3: EXTRAV,
        0x2308: {
          dir: V,
          HW: [
            [980, MAIN],
            [1199, SIZE1],
            [1799, SIZE2],
            [1961, SIZE2, 1.09],
            [2399, SIZE3],
            [2999, SIZE4]
          ],
          stretch: { ext: [0x23a2, SYMBOLS], top: [0x23a1, SYMBOLS] }
        },
        0x2309: {
          dir: V,
          HW: [
            [980, MAIN],
            [1199, SIZE1],
            [1799, SIZE2],
            [1961, SIZE2, 1.09],
            [2399, SIZE3],
            [2999, SIZE4]
          ],
          stretch: { ext: [0x23a5, SYMBOLS], top: [0x23a4, SYMBOLS] }
        },
        0x230a: {
          dir: V,
          HW: [
            [980, MAIN],
            [1199, SIZE1],
            [1799, SIZE2],
            [1961, SIZE2, 1.09],
            [2399, SIZE3],
            [2999, SIZE4]
          ],
          stretch: { bot: [0x23a3, SYMBOLS], ext: [0x23a2, SYMBOLS] }
        },
        0x230b: {
          dir: V,
          HW: [
            [980, MAIN],
            [1199, SIZE1],
            [1799, SIZE2],
            [1961, SIZE2, 1.09],
            [2399, SIZE3],
            [2999, SIZE4]
          ],
          stretch: { bot: [0x23a6, SYMBOLS], ext: [0x23a5, SYMBOLS] }
        },
        0x2312: { alias: 0x23dc, dir: H },
        0x2322: { alias: 0x23dc, dir: H },
        0x2323: { alias: 0x23dd, dir: H },
        0x2329: {
          dir: V,
          HW: [
            [974, SYMBOLS],
            [1176, SIZE1],
            [1770, SIZE2],
            [2366, SIZE3],
            [2958, SIZE4]
          ]
        },
        0x232a: {
          dir: V,
          HW: [
            [974, SYMBOLS],
            [1176, SIZE1],
            [1770, SIZE2],
            [2366, SIZE3],
            [2958, SIZE4]
          ]
        },
        0x23aa: {
          dir: V,
          HW: [[320, SYMBOLS]],
          stretch: { ext: [0x23aa, SYMBOLS] }
        },
        0x23af: { alias: 0xaf, dir: H },
        0x23b0: {
          dir: V,
          HW: [[909, SYMBOLS, null, 0x23a7]],
          stretch: {
            top: [0x23a7, SYMBOLS],
            ext: [0x23aa, SYMBOLS],
            bot: [0x23ad, SYMBOLS]
          }
        },
        0x23b1: {
          dir: V,
          HW: [[909, SYMBOLS, null, 0x23ab]],
          stretch: {
            top: [0x23ab, SYMBOLS],
            ext: [0x23aa, SYMBOLS],
            bot: [0x23a9, SYMBOLS]
          }
        },
        0x23d0: {
          dir: V,
          HW: [
            [905, MAIN, null, 0x7c],
            [1150, MAIN, 1.271, 0x7c],
            [1556, MAIN, 1.719, 0x7c],
            [1961, MAIN, 2.167, 0x7c],
            [2367, MAIN, 2.615, 0x7c]
          ],
          stretch: { ext: [0x7c, MAIN] }
        },
        0x23dc: EXTRAH,
        0x23dd: EXTRAH,
        0x23de: {
          dir: H,
          HW: [
            [908, MAIN],
            [1199, SIZE1],
            [1799, SIZE2],
            [2399, SIZE3],
            [2999, SIZE4]
          ],
          stretch: {
            left: [0xe00f, SIZE5],
            rep: [0xe010, SIZE5],
            mid: [0xe011, SIZE5],
            right: [0xe012, SIZE5]
          }
        },
        0x23df: {
          dir: H,
          HW: [
            [908, MAIN],
            [1199, SIZE1],
            [1799, SIZE2],
            [2399, SIZE3],
            [2999, SIZE4]
          ],
          stretch: {
            left: [0xe013, SIZE5],
            rep: [0xe014, SIZE5],
            mid: [0xe015, SIZE5],
            right: [0xe016, SIZE5]
          }
        },
        0x2500: { alias: 0xaf, dir: H },
        0x2758: { alias: 0x23d0, dir: V },
        0x27e8: {
          dir: V,
          HW: [
            [974, MAIN],
            [974, SIZE1],
            [1176, SIZE2],
            [1770, SIZE3],
            [2366, SIZE4],
            [2958, SIZE5]
          ]
        },
        0x27e9: {
          dir: V,
          HW: [
            [974, MAIN],
            [974, SIZE1],
            [1176, SIZE2],
            [1770, SIZE3],
            [2366, SIZE4],
            [2958, SIZE5]
          ]
        },
        0x27ee: { alias: 0x28, dir: V },
        0x27ef: { alias: 0x29, dir: V },
        0x27f5: { alias: 0x20d6, dir: H },
        0x27f6: { alias: 0x20d7, dir: H },
        0x27f7: { alias: 0x20e1, dir: H },
        0x27f8: { alias: 0x21d0, dir: H },
        0x27f9: { alias: 0x21d2, dir: H },
        0x27fa: { alias: 0x21d4, dir: H },
        0x27fb: { alias: 0x20d6, dir: H },
        0x27fc: { alias: 0x20d7, dir: H },
        0x27fd: { alias: 0x21d0, dir: H },
        0x27fe: { alias: 0x21d2, dir: H },
        0x2a0c: EXTRAV,
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
    SVG.fontDir + "/Size5/Regular/Main.js",
    function() {
      var u;
      u = SVG.FONTDATA.DELIMITERS[0x23de].stretch.rep[0];
      SVG.FONTDATA.FONTS[SIZE5][u][0] += 200; // adjust height for brace extender
      SVG.FONTDATA.FONTS[SIZE5][u][1] += 200; // adjust depth for brace extender
      u = SVG.FONTDATA.DELIMITERS[0x23df].stretch.rep[0];
      SVG.FONTDATA.FONTS[SIZE5][u][0] += 200; // adjust height for brace extender
      SVG.FONTDATA.FONTS[SIZE5][u][1] += 200; // adjust depth for brace extender
    }
  );
  AJAX.loadComplete(SVG.fontDir + "/fontdata.js");
})(MathJax.OutputJax.SVG, MathJax.ElementJax.mml, MathJax.Ajax, MathJax.Hub);
