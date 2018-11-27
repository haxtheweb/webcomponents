/*************************************************************
 *
 *  MathJax/jax/output/SVG/fonts/Asana-Math/fontdata.js
 *  
 *  Initializes the SVG OutputJax to use the Asana-Math fonts

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

  var ALPHABETS = "AsanaMathJax_Alphabets",
    ARROWS = "AsanaMathJax_Arrows",
    DOUBLESTRUCK = "AsanaMathJax_DoubleStruck",
    FRAKTUR = "AsanaMathJax_Fraktur",
    LATIN = "AsanaMathJax_Latin",
    MAIN = "AsanaMathJax_Main",
    MARKS = "AsanaMathJax_Marks",
    MISC = "AsanaMathJax_Misc",
    MONOSPACE = "AsanaMathJax_Monospace",
    NONUNICODE = "AsanaMathJax_NonUnicode",
    NORMAL = "AsanaMathJax_Normal",
    OPERATORS = "AsanaMathJax_Operators",
    SANSSERIF = "AsanaMathJax_SansSerif",
    SCRIPT = "AsanaMathJax_Script",
    SHAPES = "AsanaMathJax_Shapes",
    SIZE1 = "AsanaMathJax_Size1",
    SIZE2 = "AsanaMathJax_Size2",
    SIZE3 = "AsanaMathJax_Size3",
    SIZE4 = "AsanaMathJax_Size4",
    SIZE5 = "AsanaMathJax_Size5",
    SIZE6 = "AsanaMathJax_Size6",
    SYMBOLS = "AsanaMathJax_Symbols",
    VARIANTS = "AsanaMathJax_Variants";

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
        AsanaMathJax_Alphabets: "Alphabets/Regular/Main.js",
        AsanaMathJax_Arrows: "Arrows/Regular/Main.js",
        AsanaMathJax_DoubleStruck: "DoubleStruck/Regular/Main.js",
        AsanaMathJax_Fraktur: "Fraktur/Regular/Main.js",
        AsanaMathJax_Latin: "Latin/Regular/Main.js",
        AsanaMathJax_Main: "Main/Regular/Main.js",
        AsanaMathJax_Marks: "Marks/Regular/Main.js",
        AsanaMathJax_Misc: "Misc/Regular/Main.js",
        AsanaMathJax_Monospace: "Monospace/Regular/Main.js",
        AsanaMathJax_NonUnicode: "NonUnicode/Regular/Main.js",
        AsanaMathJax_Normal: "Normal/Regular/Main.js",
        AsanaMathJax_Operators: "Operators/Regular/Main.js",
        AsanaMathJax_SansSerif: "SansSerif/Regular/Main.js",
        AsanaMathJax_Script: "Script/Regular/Main.js",
        AsanaMathJax_Shapes: "Shapes/Regular/Main.js",
        AsanaMathJax_Size1: "Size1/Regular/Main.js",
        AsanaMathJax_Size2: "Size2/Regular/Main.js",
        AsanaMathJax_Size3: "Size3/Regular/Main.js",
        AsanaMathJax_Size4: "Size4/Regular/Main.js",
        AsanaMathJax_Size5: "Size5/Regular/Main.js",
        AsanaMathJax_Size6: "Size6/Regular/Main.js",
        AsanaMathJax_Symbols: "Symbols/Regular/Main.js",
        AsanaMathJax_Variants: "Variants/Regular/Main.js"
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
        "-Asana-Math-variant": {
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
        "-tex-caligraphic": {
          offsetA: 0xe20a,
          noLowerCase: 1,
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
          ],
          italic: true
        },
        "-tex-oldstyle": {
          offsetN: 0xe200,
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
        "-tex-caligraphic-bold": {
          offsetA: 0xe224,
          noLowerCase: 1,
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
        0x25c3: 0x25c1,
        0xfe38: 0x23df,
        0x3008: 0x27e8,
        0x3009: 0x27e9,
        0x25aa: 0x25a0,
        0x00af: 0x0304,
        0x20f0: 0x002a,
        0x2758: 0x2223,
        0x03d2: 0x03a5,
        0x25b4: 0x25b2,
        0x25b5: 0x25b3,
        0xfe37: 0x23de,
        0x25b8: 0x25b6,
        0x02b9: 0x2032,
        0x25be: 0x25bc,
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
            [941, MAIN],
            [1471, SIZE1],
            [2041, SIZE2],
            [2552, SIZE3],
            [2615, SIZE3, 1.025]
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
            [941, MAIN],
            [1471, SIZE1],
            [2041, SIZE2],
            [2552, SIZE3],
            [2615, SIZE3, 1.025]
          ],
          stretch: {
            bot: [0x23a0, SYMBOLS],
            ext: [0x239f, SYMBOLS],
            top: [0x239e, SYMBOLS]
          }
        },
        0x2d: { alias: 0x2212, dir: H },
        0x2f: { alias: 0x2044, dir: H },
        0x3d: {
          dir: H,
          HW: [[539, MAIN]],
          stretch: { rep: [0x3d, MAIN] }
        },
        0x5b: {
          dir: V,
          HW: [
            [910, MAIN],
            [1476, SIZE1],
            [2045, SIZE2],
            [2556, SIZE3],
            [2615, SIZE3, 1.023]
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
            [883, MAIN],
            [1270, MAIN, 1.439],
            [1719, MAIN, 1.946],
            [2167, MAIN, 2.454],
            [2615, MAIN, 2.961]
          ]
        },
        0x5d: {
          dir: V,
          HW: [
            [910, MAIN],
            [1476, SIZE1],
            [2045, SIZE2],
            [2556, SIZE3],
            [2615, SIZE3, 1.023]
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
            [901, MAIN],
            [1471, SIZE1],
            [2041, SIZE2],
            [2552, SIZE3],
            [2615, SIZE3, 1.025]
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
            [885, MAIN],
            [1275, SIZE1],
            [1555, SIZE2],
            [1897, SIZE3],
            [2315, SIZE4],
            [2712, SIZE5],
            [3177, SIZE6]
          ],
          stretch: { ext: [0xe000, SIZE6], top: [0xe000, SIZE6] }
        },
        0x7d: {
          dir: V,
          HW: [
            [901, MAIN],
            [1471, SIZE1],
            [2041, SIZE2],
            [2552, SIZE3],
            [2615, SIZE3, 1.025]
          ],
          stretch: {
            bot: [0x23ad, SYMBOLS],
            ext: [0x23aa, SYMBOLS],
            mid: [0x23ac, SYMBOLS],
            top: [0x23ab, SYMBOLS]
          }
        },
        0x7e: { alias: 0x303, dir: H },
        0xaf: { alias: 0x2212, dir: H },
        0x2c6: { alias: 0x302, dir: H },
        0x2c9: { alias: 0x2212, dir: H },
        0x2dc: { alias: 0x303, dir: H },
        0x302: {
          dir: H,
          HW: [
            [312, MAIN],
            [453, SIZE1],
            [633, SIZE2],
            [1055, SIZE3],
            [2017, SIZE4],
            [3026, SIZE5]
          ]
        },
        0x303: {
          dir: H,
          HW: [
            [330, MAIN],
            [701, SIZE1],
            [1053, SIZE2],
            [1403, SIZE3],
            [1865, SIZE4],
            [2797, SIZE5]
          ]
        },
        0x305: {
          dir: H,
          HW: [[433, MARKS], [511, SIZE1], [675, SIZE2], [1127, SIZE3]],
          stretch: { rep: [0xe001, SIZE6], right: [0xe001, SIZE6] }
        },
        0x306: EXTRAH,
        0x30c: {
          dir: H,
          HW: [
            [312, MAIN],
            [737, SIZE1],
            [1105, SIZE2],
            [1474, SIZE3],
            [1960, SIZE4],
            [2940, SIZE5]
          ]
        },
        0x332: {
          dir: H,
          HW: [[433, MARKS], [511, SIZE1], [675, SIZE2], [1127, SIZE3]],
          stretch: { rep: [0xe002, SIZE6], right: [0xe002, SIZE6] }
        },
        0x333: EXTRAH,
        0x33f: EXTRAH,
        0x2015: { alias: 0x2212, dir: H },
        0x2016: {
          dir: V,
          HW: [
            [885, MAIN],
            [1275, SIZE1],
            [1555, SIZE2],
            [1897, SIZE3],
            [2315, SIZE4]
          ],
          stretch: { ext: [0xe005, SIZE6], top: [0xe005, SIZE6] }
        },
        0x2017: { alias: 0x2212, dir: H },
        0x203e: { alias: 0x2212, dir: H },
        0x2044: {
          dir: V,
          HW: [
            [837, MAIN],
            [1205, SIZE1],
            [1471, SIZE2],
            [1795, SIZE3],
            [2189, SIZE4],
            [2615, SIZE4, 1.195]
          ]
        },
        0x2045: EXTRAV,
        0x2046: EXTRAV,
        0x20d0: EXTRAH,
        0x20d1: EXTRAH,
        0x20d6: EXTRAH,
        0x20d7: EXTRAH,
        0x20e1: EXTRAH,
        0x20e9: EXTRAH,
        0x20ee: EXTRAH,
        0x20ef: EXTRAH,
        0x2190: {
          dir: H,
          HW: [[884, MAIN]],
          stretch: {
            left: [0xe013, SIZE6],
            rep: [0x23af, SYMBOLS],
            right: [0xe014, SIZE6]
          }
        },
        0x2191: {
          dir: V,
          HW: [[885, MAIN]],
          stretch: { ext: [0xe015, SIZE6], top: [0x2191, MAIN] }
        },
        0x2192: {
          dir: H,
          HW: [[884, MAIN]],
          stretch: {
            left: [0xe016, SIZE6],
            rep: [0x23af, SYMBOLS],
            right: [0xe017, SIZE6]
          }
        },
        0x2193: {
          dir: V,
          HW: [[885, MAIN]],
          stretch: { bot: [0x2193, MAIN], ext: [0xe015, SIZE6] }
        },
        0x2194: {
          dir: H,
          HW: [[884, MAIN]],
          stretch: {
            left: [0xe013, SIZE6],
            rep: [0x23af, SYMBOLS],
            right: [0xe017, SIZE6]
          }
        },
        0x2195: {
          dir: V,
          HW: [[884, MAIN]],
          stretch: {
            top: [0x2191, MAIN],
            ext: [0xe015, SIZE6],
            bot: [0x2193, MAIN]
          }
        },
        0x21a4: {
          dir: H,
          HW: [[942, ARROWS]],
          stretch: {
            left: [0xe013, SIZE6],
            rep: [0x23af, SYMBOLS],
            right: [0xe018, SIZE6]
          }
        },
        0x21a6: {
          dir: H,
          HW: [[942, MAIN]],
          stretch: {
            left: [0xe019, SIZE6],
            rep: [0x23af, SYMBOLS],
            right: [0xe017, SIZE6]
          }
        },
        0x21a9: EXTRAH,
        0x21aa: EXTRAH,
        0x21d0: {
          dir: H,
          HW: [[884, MAIN]],
          stretch: {
            left: [0xe01c, SIZE6],
            rep: [0xe01d, SIZE6],
            right: [0xe01e, SIZE6]
          }
        },
        0x21d1: {
          dir: V,
          HW: [[885, MAIN]],
          stretch: { ext: [0xe01f, SIZE6], top: [0x21d1, MAIN] }
        },
        0x21d2: {
          dir: H,
          HW: [[884, MAIN]],
          stretch: {
            left: [0xe020, SIZE6],
            rep: [0xe01d, SIZE6],
            right: [0xe021, SIZE6]
          }
        },
        0x21d3: {
          dir: V,
          HW: [[885, MAIN]],
          stretch: { bot: [0x21d3, MAIN], ext: [0xe01f, SIZE6] }
        },
        0x21d4: {
          dir: H,
          HW: [[895, MAIN]],
          stretch: {
            left: [0xe01c, SIZE6],
            rep: [0xe01d, SIZE6],
            right: [0xe021, SIZE6]
          }
        },
        0x21d5: {
          dir: V,
          HW: [[884, MAIN, null, 0x2195]],
          stretch: {
            top: [0x21d1, MAIN],
            ext: [0xe01f, SIZE6],
            bot: [0x21d3, MAIN]
          }
        },
        0x220f: {
          dir: V,
          HW: [[937, OPERATORS], [1349, SIZE1], [1942, SIZE2], [2797, SIZE3]]
        },
        0x2210: EXTRAV,
        0x2211: EXTRAV,
        0x2212: {
          dir: H,
          HW: [],
          stretch: { rep: [0x2212, MAIN, 0, 0, 0, -0.23, -0.23] }
        },
        0x2215: { alias: 0x2044, dir: V },
        0x221a: {
          dir: V,
          HW: [
            [1138, MAIN],
            [1280, SIZE1],
            [1912, SIZE2],
            [2543, SIZE3],
            [3175, SIZE4]
          ],
          stretch: {
            bot: [0x23b7, SYMBOLS],
            ext: [0x20d3, MARKS],
            top: [0xe022, SIZE6]
          }
        },
        0x2223: {
          dir: V,
          HW: [[885, MAIN]],
          stretch: { ext: [0x2223, MAIN], top: [0x2223, MAIN] }
        },
        0x2225: {
          dir: V,
          HW: [[885, MAIN]],
          stretch: { ext: [0x2225, MAIN], top: [0x2225, MAIN] }
        },
        0x2229: EXTRAV,
        0x222b: EXTRAV,
        0x222c: EXTRAV,
        0x222d: EXTRAV,
        0x222e: EXTRAV,
        0x222f: EXTRAV,
        0x2230: EXTRAV,
        0x2231: EXTRAV,
        0x2232: EXTRAV,
        0x2233: EXTRAV,
        0x22c0: EXTRAV,
        0x22c1: EXTRAV,
        0x22c2: EXTRAV,
        0x22c3: EXTRAV,
        0x2308: {
          dir: V,
          HW: [
            [885, MAIN],
            [1470, SIZE1],
            [2041, SIZE2],
            [2552, SIZE3],
            [2615, SIZE3, 1.025]
          ],
          stretch: { ext: [0x23a2, SYMBOLS], top: [0x23a1, SYMBOLS] }
        },
        0x2309: {
          dir: V,
          HW: [
            [885, MAIN],
            [1470, SIZE1],
            [2041, SIZE2],
            [2552, SIZE3],
            [2615, SIZE3, 1.025]
          ],
          stretch: { ext: [0x23a5, SYMBOLS], top: [0x23a4, SYMBOLS] }
        },
        0x230a: {
          dir: V,
          HW: [
            [885, MAIN],
            [1470, SIZE1],
            [2041, SIZE2],
            [2552, SIZE3],
            [2615, SIZE3, 1.025]
          ],
          stretch: { bot: [0x23a3, SYMBOLS], ext: [0x23a2, SYMBOLS] }
        },
        0x230b: {
          dir: V,
          HW: [
            [885, MAIN],
            [1470, SIZE1],
            [2041, SIZE2],
            [2552, SIZE3],
            [2615, SIZE3, 1.025]
          ],
          stretch: { bot: [0x23a6, SYMBOLS], ext: [0x23a5, SYMBOLS] }
        },
        0x2312: { alias: 0x23dc, dir: H },
        0x2322: { alias: 0x23dc, dir: H },
        0x2323: { alias: 0x23dd, dir: H },
        0x2329: { alias: 0x27e8, dir: V },
        0x232a: { alias: 0x27e9, dir: V },
        0x23aa: {
          dir: V,
          HW: [[688, SYMBOLS]],
          stretch: { ext: [0x23aa, SYMBOLS] }
        },
        0x23af: {
          dir: H,
          HW: [[638, SYMBOLS]],
          stretch: { rep: [0x23af, SYMBOLS] }
        },
        0x23b0: { alias: 0x27c6, dir: V },
        0x23b1: { alias: 0x27c5, dir: V },
        0x23b4: EXTRAH,
        0x23b5: EXTRAH,
        0x23d0: {
          dir: V,
          HW: [
            [885, MAIN, null, 0x7c],
            [1270, MAIN, 1.435, 0x7c],
            [1719, MAIN, 1.942, 0x7c],
            [2167, MAIN, 2.448, 0x7c],
            [2615, MAIN, 2.955, 0x7c]
          ],
          stretch: { ext: [0x7c, MAIN] }
        },
        0x23dc: EXTRAH,
        0x23dd: EXTRAH,
        0x23de: {
          dir: H,
          HW: [[902, MAIN], [1471, SIZE1], [2041, SIZE2], [2552, SIZE3]],
          stretch: {
            left: [0xe026, SIZE6],
            rep: [0xe027, SIZE6],
            mid: [0xe02c, SIZE6],
            right: [0xe028, SIZE6]
          }
        },
        0x23df: {
          dir: H,
          HW: [[902, MAIN], [1471, SIZE1], [2041, SIZE2], [2552, SIZE3]],
          stretch: {
            left: [0xe029, SIZE6],
            rep: [0xe02a, SIZE6],
            mid: [0xe02d, SIZE6],
            right: [0xe02b, SIZE6]
          }
        },
        0x23e0: EXTRAH,
        0x23e1: EXTRAH,
        0x2500: { alias: 0x2212, dir: H },
        0x2758: { alias: 0x2223, dir: V },
        0x27c5: {
          dir: V,
          HW: [
            [910, SYMBOLS],
            [1020, SIZE1],
            [1531, SIZE2],
            [2041, SIZE3],
            [2552, SIZE4],
            [3063, SIZE5]
          ]
        },
        0x27c6: {
          dir: V,
          HW: [
            [910, SYMBOLS],
            [1020, SIZE1],
            [1531, SIZE2],
            [2041, SIZE3],
            [2552, SIZE4],
            [3063, SIZE5]
          ]
        },
        0x27e6: EXTRAV,
        0x27e7: EXTRAV,
        0x27e8: {
          dir: V,
          HW: [
            [885, MAIN],
            [1020, SIZE1],
            [1270, SIZE1, 1.244],
            [2041, SIZE2],
            [2552, SIZE3],
            [2615, SIZE3, 1.025]
          ]
        },
        0x27e9: {
          dir: V,
          HW: [
            [885, MAIN],
            [1020, SIZE1],
            [1270, SIZE1, 1.244],
            [2041, SIZE2],
            [2552, SIZE3],
            [2615, SIZE3, 1.025]
          ]
        },
        0x27ea: EXTRAV,
        0x27eb: EXTRAV,
        0x27ee: { alias: 0x28, dir: V },
        0x27ef: { alias: 0x29, dir: V },
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
          HW: [[884, ARROWS]],
          stretch: {
            left: [0xe01c, SIZE6],
            rep: [0xe01d, SIZE6],
            right: [0xe02e, SIZE6]
          }
        },
        0x2907: {
          dir: H,
          HW: [[884, ARROWS]],
          stretch: {
            left: [0xe02f, SIZE6],
            rep: [0xe01d, SIZE6],
            right: [0xe021, SIZE6]
          }
        },
        0x29fc: EXTRAV,
        0x29fd: EXTRAV,
        0x2a00: EXTRAV,
        0x2a01: EXTRAV,
        0x2a02: EXTRAV,
        0x2a03: EXTRAV,
        0x2a04: EXTRAV,
        0x2a05: EXTRAV,
        0x2a06: EXTRAV,
        0x2a07: EXTRAV,
        0x2a08: EXTRAV,
        0x2a09: EXTRAV,
        0x2a0c: EXTRAV,
        0x2a0d: EXTRAV,
        0x2a0e: EXTRAV,
        0x2a0f: EXTRAV,
        0x2a10: EXTRAV,
        0x2a11: EXTRAV,
        0x2a12: EXTRAV,
        0x2a13: EXTRAV,
        0x2a14: EXTRAV,
        0x2a15: EXTRAV,
        0x2a16: EXTRAV,
        0x2a17: EXTRAV,
        0x2a18: EXTRAV,
        0x2a19: EXTRAV,
        0x2a1a: EXTRAV,
        0x2a1b: EXTRAV,
        0x2a1c: EXTRAV,
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
    SVG.fontDir + "/Size6/Regular/Main.js",
    function() {
      var u;
      u = SVG.FONTDATA.DELIMITERS[0x23de].stretch.rep[0];
      SVG.FONTDATA.FONTS[SIZE6][u][0] += 100; // adjust height for brace extender
      SVG.FONTDATA.FONTS[SIZE6][u][1] += 100; // adjust depth for brace extender
      u = SVG.FONTDATA.DELIMITERS[0x23df].stretch.rep[0];
      SVG.FONTDATA.FONTS[SIZE6][u][0] += 100; // adjust height for brace extender
      SVG.FONTDATA.FONTS[SIZE6][u][1] += 100; // adjust depth for brace extender
    }
  );
  MathJax.Hub.Register.LoadHook(
    SVG.fontDir + "/Size1/Regular/Main.js",
    function() {
      var i;
      SVG.FONTDATA.FONTS[SIZE1][0x222b][2] -= 300;
      for (i = 0x222c; i <= 0x2233; i++) {
        SVG.FONTDATA.FONTS[SIZE1][i][2] -= 420;
      }
      for (i = 0x2a0c; i <= 0x2a1c; i++) {
        SVG.FONTDATA.FONTS[SIZE1][i][2] -= 420;
      }
    }
  );
  AJAX.loadComplete(SVG.fontDir + "/fontdata.js");
})(MathJax.OutputJax.SVG, MathJax.ElementJax.mml, MathJax.Ajax, MathJax.Hub);
