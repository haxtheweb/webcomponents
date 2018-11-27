/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/Gyre-Pagella/fontdata.js
 *  
 *  Initializes the HTML-CSS OutputJax to use the Gyre-Pagella fonts

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

(function(HTMLCSS, MML, AJAX) {
  var VERSION = "2.7.5";

  var ALPHABETS = "GyrePagellaMathJax_Alphabets",
    ARROWS = "GyrePagellaMathJax_Arrows",
    DOUBLESTRUCK = "GyrePagellaMathJax_DoubleStruck",
    FRAKTUR = "GyrePagellaMathJax_Fraktur",
    LATIN = "GyrePagellaMathJax_Latin",
    MAIN = "GyrePagellaMathJax_Main",
    MARKS = "GyrePagellaMathJax_Marks",
    MISC = "GyrePagellaMathJax_Misc",
    MONOSPACE = "GyrePagellaMathJax_Monospace",
    NONUNICODE = "GyrePagellaMathJax_NonUnicode",
    NORMAL = "GyrePagellaMathJax_Normal",
    OPERATORS = "GyrePagellaMathJax_Operators",
    SANSSERIF = "GyrePagellaMathJax_SansSerif",
    SCRIPT = "GyrePagellaMathJax_Script",
    SHAPES = "GyrePagellaMathJax_Shapes",
    SIZE1 = "GyrePagellaMathJax_Size1",
    SIZE2 = "GyrePagellaMathJax_Size2",
    SIZE3 = "GyrePagellaMathJax_Size3",
    SIZE4 = "GyrePagellaMathJax_Size4",
    SIZE5 = "GyrePagellaMathJax_Size5",
    SIZE6 = "GyrePagellaMathJax_Size6",
    SYMBOLS = "GyrePagellaMathJax_Symbols",
    VARIANTS = "GyrePagellaMathJax_Variants";

  var H = "H",
    V = "V",
    EXTRAH = { load: "extra", dir: H },
    EXTRAV = { load: "extra", dir: V };

  HTMLCSS.Augment({
    FONTDATA: {
      version: VERSION,

      TeX_factor: 1.057,
      baselineskip: 1.2,
      lineH: 0.8,
      lineD: 0.2,

      hasStyleChar: true, // char 0xEFFD encodes font style

      FONTS: {
        GyrePagellaMathJax_Alphabets: "Alphabets/Regular/Main.js",
        GyrePagellaMathJax_Arrows: "Arrows/Regular/Main.js",
        GyrePagellaMathJax_DoubleStruck: "DoubleStruck/Regular/Main.js",
        GyrePagellaMathJax_Fraktur: "Fraktur/Regular/Main.js",
        GyrePagellaMathJax_Latin: "Latin/Regular/Main.js",
        GyrePagellaMathJax_Main: "Main/Regular/Main.js",
        GyrePagellaMathJax_Marks: "Marks/Regular/Main.js",
        GyrePagellaMathJax_Misc: "Misc/Regular/Main.js",
        GyrePagellaMathJax_Monospace: "Monospace/Regular/Main.js",
        GyrePagellaMathJax_NonUnicode: "NonUnicode/Regular/Main.js",
        GyrePagellaMathJax_Normal: "Normal/Regular/Main.js",
        GyrePagellaMathJax_Operators: "Operators/Regular/Main.js",
        GyrePagellaMathJax_SansSerif: "SansSerif/Regular/Main.js",
        GyrePagellaMathJax_Script: "Script/Regular/Main.js",
        GyrePagellaMathJax_Shapes: "Shapes/Regular/Main.js",
        GyrePagellaMathJax_Size1: "Size1/Regular/Main.js",
        GyrePagellaMathJax_Size2: "Size2/Regular/Main.js",
        GyrePagellaMathJax_Size3: "Size3/Regular/Main.js",
        GyrePagellaMathJax_Size4: "Size4/Regular/Main.js",
        GyrePagellaMathJax_Size5: "Size5/Regular/Main.js",
        GyrePagellaMathJax_Size6: "Size6/Regular/Main.js",
        GyrePagellaMathJax_Symbols: "Symbols/Regular/Main.js",
        GyrePagellaMathJax_Variants: "Variants/Regular/Main.js"
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
        "-Gyre-Pagella-variant": {
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
            [0.828, MAIN],
            [0.988, SIZE1],
            [1.18, SIZE2],
            [1.41, SIZE3],
            [1.686, SIZE4],
            [2.018, SIZE5],
            [2.416, SIZE6],
            [2.612, SIZE6, 1.081]
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
            [0.828, MAIN],
            [0.988, SIZE1],
            [1.18, SIZE2],
            [1.41, SIZE3],
            [1.686, SIZE4],
            [2.018, SIZE5],
            [2.416, SIZE6],
            [2.612, SIZE6, 1.081]
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
            [0.8, MAIN],
            [1.048, SIZE1],
            [1.372, SIZE2],
            [1.798, SIZE3],
            [2.356, SIZE4],
            [3.086, SIZE5],
            [4.044, SIZE6]
          ]
        },
        0x3d: {
          dir: H,
          HW: [[0.6, MAIN]],
          stretch: {
            left: [0xe000, SIZE6],
            rep: [0xe001, SIZE6],
            right: [0xe002, SIZE6]
          }
        },
        0x5b: {
          dir: V,
          HW: [
            [0.84, MAIN],
            [1.0, SIZE1],
            [1.192, SIZE2],
            [1.422, SIZE3],
            [1.698, SIZE4],
            [2.03, SIZE5],
            [2.428, SIZE6],
            [2.612, SIZE6, 1.076]
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
            [0.8, MAIN],
            [1.048, SIZE1],
            [1.372, SIZE2],
            [1.798, SIZE3],
            [2.356, SIZE4],
            [3.086, SIZE5],
            [4.044, SIZE6]
          ]
        },
        0x5d: {
          dir: V,
          HW: [
            [0.84, MAIN],
            [1.0, SIZE1],
            [1.192, SIZE2],
            [1.422, SIZE3],
            [1.698, SIZE4],
            [2.03, SIZE5],
            [2.428, SIZE6],
            [2.612, SIZE6, 1.076]
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
            [0.838, MAIN],
            [0.998, SIZE1],
            [1.19, SIZE2],
            [1.42, SIZE3],
            [1.696, SIZE4],
            [2.028, SIZE5],
            [2.426, SIZE6],
            [2.612, SIZE6, 1.077]
          ],
          stretch: {
            bot: [0x23a9, SYMBOLS],
            ext: [0xe003, SIZE6],
            mid: [0x23a8, SYMBOLS],
            top: [0x23a7, SYMBOLS]
          }
        },
        0x7c: {
          dir: V,
          HW: [
            [0.8, MAIN],
            [0.96, SIZE1],
            [1.152, SIZE2],
            [1.382, SIZE3],
            [1.658, SIZE4],
            [1.99, SIZE5],
            [2.388, SIZE6]
          ],
          stretch: {
            bot: [0xe004, SIZE6],
            ext: [0xe005, SIZE6],
            top: [0xe006, SIZE6]
          }
        },
        0x7d: {
          dir: V,
          HW: [
            [0.838, MAIN],
            [0.998, SIZE1],
            [1.19, SIZE2],
            [1.42, SIZE3],
            [1.696, SIZE4],
            [2.028, SIZE5],
            [2.426, SIZE6],
            [2.612, SIZE6, 1.077]
          ],
          stretch: {
            bot: [0x23ad, SYMBOLS],
            ext: [0xe007, SIZE6],
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
            [0.348, MAIN],
            [0.613, SIZE1],
            [0.731, SIZE2],
            [0.874, SIZE3],
            [1.045, SIZE4],
            [1.251, SIZE5],
            [1.498, SIZE6]
          ]
        },
        0x303: {
          dir: H,
          HW: [
            [0.342, MAIN],
            [0.608, SIZE1],
            [0.727, SIZE2],
            [0.87, SIZE3],
            [1.042, SIZE4],
            [1.247, SIZE5],
            [1.496, SIZE6]
          ]
        },
        0x305: {
          dir: H,
          HW: [[0.333, MARKS], [0.5, SIZE1]],
          stretch: {
            left: [0xe0fb, SIZE6],
            rep: [0xe0fc, SIZE6],
            right: [0xe0fd, SIZE6]
          }
        },
        0x306: EXTRAH,
        0x30c: {
          dir: H,
          HW: [
            [0.348, MAIN],
            [0.613, SIZE1],
            [0.731, SIZE2],
            [0.874, SIZE3],
            [1.045, SIZE4],
            [1.251, SIZE5],
            [1.498, SIZE6]
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
          HW: [[0.333, MARKS], [0.5, SIZE1]],
          stretch: {
            left: [0xe0f5, SIZE6],
            rep: [0xe0f6, SIZE6],
            right: [0xe0f7, SIZE6]
          }
        },
        0x333: EXTRAH,
        0x33f: EXTRAH,
        0x2015: { alias: 0x2212, dir: H },
        0x2016: {
          dir: V,
          HW: [
            [0.8, MAIN],
            [0.96, SIZE1],
            [1.152, SIZE2],
            [1.382, SIZE3],
            [1.658, SIZE4],
            [1.99, SIZE5],
            [2.388, SIZE6]
          ],
          stretch: {
            bot: [0xe12a, SIZE6],
            ext: [0xe12b, SIZE6],
            top: [0xe12c, SIZE6]
          }
        },
        0x2017: { alias: 0x2212, dir: H },
        0x203e: { alias: 0x2212, dir: H },
        0x2044: {
          dir: V,
          HW: [
            [0.8, MAIN],
            [1.048, SIZE1],
            [1.372, SIZE2],
            [1.798, SIZE3],
            [2.356, SIZE4],
            [3.086, SIZE5],
            [4.044, SIZE6]
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
        0x2140: {
          dir: V,
          HW: [[1.0, DOUBLESTRUCK], [1.442, SIZE1]]
        },
        0x2190: {
          dir: H,
          HW: [[0.76, MAIN], [1.21, SIZE1]],
          stretch: {
            left: [0xe023, SIZE6],
            rep: [0xe024, SIZE6],
            right: [0xe025, SIZE6]
          }
        },
        0x2191: {
          dir: V,
          HW: [[0.76, MAIN], [1.21, SIZE1]],
          stretch: {
            bot: [0xe029, SIZE6],
            ext: [0xe02a, SIZE6],
            top: [0xe02b, SIZE6]
          }
        },
        0x2192: {
          dir: H,
          HW: [[0.76, MAIN], [1.21, SIZE1]],
          stretch: {
            left: [0xe026, SIZE6],
            rep: [0xe027, SIZE6],
            right: [0xe028, SIZE6]
          }
        },
        0x2193: {
          dir: V,
          HW: [[0.76, MAIN], [1.21, SIZE1]],
          stretch: {
            bot: [0xe02c, SIZE6],
            ext: [0xe02d, SIZE6],
            top: [0xe02e, SIZE6]
          }
        },
        0x2194: {
          dir: H,
          HW: [[0.845, MAIN], [1.295, SIZE1]],
          stretch: {
            left: [0xe037, SIZE6],
            rep: [0xe038, SIZE6],
            right: [0xe039, SIZE6]
          }
        },
        0x2195: {
          dir: V,
          HW: [[0.845, MAIN], [1.295, SIZE1]],
          stretch: {
            bot: [0xe03a, SIZE6],
            ext: [0xe03b, SIZE6],
            top: [0xe03c, SIZE6]
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
          HW: [[0.76, ARROWS], [1.21, SIZE1]],
          stretch: {
            left: [0xe053, SIZE6],
            rep: [0xe054, SIZE6],
            right: [0xe055, SIZE6]
          }
        },
        0x21a5: EXTRAV,
        0x21a6: {
          dir: H,
          HW: [[0.76, MAIN], [1.21, SIZE1]],
          stretch: {
            left: [0xe056, SIZE6],
            rep: [0xe057, SIZE6],
            right: [0xe058, SIZE6]
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
          HW: [[0.76, MAIN], [1.21, SIZE1]],
          stretch: {
            left: [0xe0a7, SIZE6],
            rep: [0xe0a8, SIZE6],
            right: [0xe0a9, SIZE6]
          }
        },
        0x21d1: {
          dir: V,
          HW: [[0.76, MAIN], [1.21, SIZE1]],
          stretch: {
            bot: [0xe0ad, SIZE6],
            ext: [0xe0ae, SIZE6],
            top: [0xe0af, SIZE6]
          }
        },
        0x21d2: {
          dir: H,
          HW: [[0.76, MAIN], [1.21, SIZE1]],
          stretch: {
            left: [0xe0aa, SIZE6],
            rep: [0xe0ab, SIZE6],
            right: [0xe0ac, SIZE6]
          }
        },
        0x21d3: {
          dir: V,
          HW: [[0.76, MAIN], [1.21, SIZE1]],
          stretch: {
            bot: [0xe0b0, SIZE6],
            ext: [0xe0b1, SIZE6],
            top: [0xe0b2, SIZE6]
          }
        },
        0x21d4: {
          dir: H,
          HW: [[0.845, MAIN], [1.295, SIZE1]],
          stretch: {
            left: [0xe0b3, SIZE6],
            rep: [0xe0b4, SIZE6],
            right: [0xe0b5, SIZE6]
          }
        },
        0x21d5: {
          dir: V,
          HW: [[0.845, MAIN], [1.295, SIZE1]],
          stretch: {
            bot: [0xe0b6, SIZE6],
            ext: [0xe0b7, SIZE6],
            top: [0xe0b8, SIZE6]
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
          HW: [],
          stretch: { rep: [0x2212, MAIN, 0, 0, 0, -0.27, -0.28] }
        },
        0x2215: { alias: 0x2044, dir: V },
        0x221a: {
          dir: V,
          HW: [
            [0.79, MAIN],
            [1.15, SIZE1],
            [1.51, SIZE2],
            [1.87, SIZE3],
            [2.23, SIZE4],
            [2.59, SIZE5],
            [2.95, SIZE6]
          ],
          stretch: {
            bot: [0x23b7, SYMBOLS],
            ext: [0xe133, SIZE6],
            top: [0xe134, SIZE6]
          }
        },
        0x2223: {
          dir: V,
          HW: [
            [0.8, MAIN],
            [0.96, SIZE1],
            [1.152, SIZE2],
            [1.382, SIZE3],
            [1.658, SIZE4],
            [1.99, SIZE5],
            [2.388, SIZE6]
          ],
          stretch: {
            bot: [0xe004, SIZE6],
            ext: [0xe005, SIZE6],
            top: [0xe006, SIZE6]
          }
        },
        0x2225: {
          dir: V,
          HW: [
            [0.8, MAIN],
            [0.96, SIZE1],
            [1.152, SIZE2],
            [1.382, SIZE3],
            [1.658, SIZE4],
            [1.99, SIZE5],
            [2.388, SIZE6]
          ],
          stretch: {
            bot: [0xe12a, SIZE6],
            ext: [0xe12b, SIZE6],
            top: [0xe12c, SIZE6]
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
            [0.82, MAIN],
            [0.98, SIZE1],
            [1.172, SIZE2],
            [1.402, SIZE3],
            [1.678, SIZE4],
            [2.01, SIZE5],
            [2.408, SIZE6],
            [2.612, SIZE6, 1.085]
          ],
          stretch: { ext: [0x23a2, SYMBOLS], top: [0x23a1, SYMBOLS] }
        },
        0x2309: {
          dir: V,
          HW: [
            [0.82, MAIN],
            [0.98, SIZE1],
            [1.172, SIZE2],
            [1.402, SIZE3],
            [1.678, SIZE4],
            [2.01, SIZE5],
            [2.408, SIZE6],
            [2.612, SIZE6, 1.085]
          ],
          stretch: { ext: [0x23a5, SYMBOLS], top: [0x23a4, SYMBOLS] }
        },
        0x230a: {
          dir: V,
          HW: [
            [0.82, MAIN],
            [0.98, SIZE1],
            [1.172, SIZE2],
            [1.402, SIZE3],
            [1.678, SIZE4],
            [2.01, SIZE5],
            [2.408, SIZE6],
            [2.612, SIZE6, 1.085]
          ],
          stretch: { bot: [0x23a3, SYMBOLS], ext: [0x23a2, SYMBOLS] }
        },
        0x230b: {
          dir: V,
          HW: [
            [0.82, MAIN],
            [0.98, SIZE1],
            [1.172, SIZE2],
            [1.402, SIZE3],
            [1.678, SIZE4],
            [2.01, SIZE5],
            [2.408, SIZE6],
            [2.612, SIZE6, 1.085]
          ],
          stretch: { bot: [0x23a6, SYMBOLS], ext: [0x23a5, SYMBOLS] }
        },
        0x2312: { alias: 0x23dc, dir: H },
        0x2322: { alias: 0x23dc, dir: H },
        0x2323: { alias: 0x23dd, dir: H },
        0x2329: {
          dir: V,
          HW: [
            [0.816, SYMBOLS],
            [1.062, SIZE1],
            [1.386, SIZE2],
            [1.81, SIZE3],
            [2.366, SIZE4],
            [3.095, SIZE5],
            [4.05, SIZE6]
          ]
        },
        0x232a: {
          dir: V,
          HW: [
            [0.816, SYMBOLS],
            [1.062, SIZE1],
            [1.386, SIZE2],
            [1.81, SIZE3],
            [2.366, SIZE4],
            [3.095, SIZE5],
            [4.05, SIZE6]
          ]
        },
        0x23aa: {
          dir: V,
          HW: [[0.596, SYMBOLS]],
          stretch: { ext: [0x23aa, SYMBOLS] }
        },
        0x23af: { alias: 0x2212, dir: H },
        0x23b0: {
          dir: V,
          HW: [[0.616, SYMBOLS, null, 0x23a7]],
          stretch: {
            top: [0x23a7, SYMBOLS],
            ext: [0x23aa, SYMBOLS],
            bot: [0x23ad, SYMBOLS]
          }
        },
        0x23b1: {
          dir: V,
          HW: [[0.616, SYMBOLS, null, 0x23ab]],
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
            [0.8, MAIN, null, 0x7c],
            [1.269, MAIN, 1.586, 0x7c],
            [1.717, MAIN, 2.146, 0x7c],
            [2.164, MAIN, 2.705, 0x7c],
            [2.612, MAIN, 3.265, 0x7c]
          ],
          stretch: { ext: [0x7c, MAIN] }
        },
        0x23dc: EXTRAH,
        0x23dd: EXTRAH,
        0x23de: {
          dir: H,
          HW: [
            [0.54, MAIN],
            [1.038, SIZE1],
            [1.538, SIZE2],
            [2.038, SIZE3],
            [2.538, SIZE4],
            [3.038, SIZE5],
            [3.538, SIZE6]
          ],
          stretch: {
            left: [0xe10d, SIZE6],
            rep: [0xe10e, SIZE6],
            mid: [0xe10f, SIZE6],
            right: [0xe110, SIZE6]
          }
        },
        0x23df: {
          dir: H,
          HW: [
            [0.54, MAIN],
            [1.038, SIZE1],
            [1.538, SIZE2],
            [2.038, SIZE3],
            [2.538, SIZE4],
            [3.038, SIZE5],
            [3.538, SIZE6]
          ],
          stretch: {
            left: [0xe111, SIZE6],
            rep: [0xe112, SIZE6],
            mid: [0xe113, SIZE6],
            right: [0xe114, SIZE6]
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
            [0.816, MAIN],
            [1.062, SIZE1],
            [1.386, SIZE2],
            [1.81, SIZE3],
            [2.366, SIZE4],
            [3.095, SIZE5],
            [4.05, SIZE6]
          ]
        },
        0x27e9: {
          dir: V,
          HW: [
            [0.816, MAIN],
            [1.062, SIZE1],
            [1.386, SIZE2],
            [1.81, SIZE3],
            [2.366, SIZE4],
            [3.095, SIZE5],
            [4.05, SIZE6]
          ]
        },
        0x27ea: EXTRAV,
        0x27eb: EXTRAV,
        0x27ee: {
          dir: V,
          HW: [
            [0.828, MAIN],
            [0.988, SIZE1],
            [1.18, SIZE2],
            [1.41, SIZE3],
            [1.686, SIZE4],
            [2.018, SIZE5],
            [2.416, SIZE6]
          ],
          stretch: {
            bot: [0xe101, SIZE6],
            ext: [0xe102, SIZE6],
            top: [0xe103, SIZE6]
          }
        },
        0x27ef: {
          dir: V,
          HW: [
            [0.828, MAIN],
            [0.988, SIZE1],
            [1.18, SIZE2],
            [1.41, SIZE3],
            [1.686, SIZE4],
            [2.018, SIZE5],
            [2.416, SIZE6]
          ],
          stretch: {
            bot: [0xe104, SIZE6],
            ext: [0xe105, SIZE6],
            top: [0xe106, SIZE6]
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
          HW: [[0.835, ARROWS], [1.285, SIZE1]],
          stretch: {
            left: [0xe0c5, SIZE6],
            rep: [0xe0c6, SIZE6],
            right: [0xe0c7, SIZE6]
          }
        },
        0x2907: {
          dir: H,
          HW: [[0.835, ARROWS], [1.285, SIZE1]],
          stretch: {
            left: [0xe0c8, SIZE6],
            rep: [0xe0c9, SIZE6],
            right: [0xe0ca, SIZE6]
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
    HTMLCSS.fontDir + "/Main/Regular/Main.js",
    function() {
      HTMLCSS.FONTDATA.FONTS[MAIN][0x2212][0] =
        HTMLCSS.FONTDATA.FONTS[MAIN][0x002b][0]; // - needs height and depth of +
      HTMLCSS.FONTDATA.FONTS[MAIN][0x2212][1] =
        HTMLCSS.FONTDATA.FONTS[MAIN][0x002b][1]; // - needs height and depth of +
    }
  );
  MathJax.Hub.Register.LoadHook(
    HTMLCSS.fontDir + "/Size1/Regular/Main.js",
    function() {
      var i;
      for (i = 0x222b; i <= 0x222d; i++) {
        HTMLCSS.FONTDATA.FONTS[SIZE1][i][2] -= 190;
        HTMLCSS.FONTDATA.FONTS[SIZE1][i][5] = { rfix: -190 };
      }
      for (i = 0x222e; i <= 0x2231; i++) {
        HTMLCSS.FONTDATA.FONTS[SIZE1][i][2] -= 100;
        HTMLCSS.FONTDATA.FONTS[SIZE1][i][5] = { rfix: -100 };
      }
    }
  );
  AJAX.loadComplete(HTMLCSS.fontDir + "/fontdata.js");
})(MathJax.OutputJax["HTML-CSS"], MathJax.ElementJax.mml, MathJax.Ajax);
