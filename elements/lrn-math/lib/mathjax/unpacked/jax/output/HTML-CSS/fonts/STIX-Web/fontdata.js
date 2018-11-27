/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/STIX-Web/fontdata.js
 *  
 *  Initializes the HTML-CSS OutputJax to use the STIX-Web fonts

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

  var ALPHABETSBOLDITALIC = "STIXMathJax_Alphabets-bold-italic",
    ALPHABETSBOLD = "STIXMathJax_Alphabets-bold",
    ALPHABETSITALIC = "STIXMathJax_Alphabets-italic",
    ALPHABETS = "STIXMathJax_Alphabets",
    ARROWSBOLD = "STIXMathJax_Arrows-bold",
    ARROWS = "STIXMathJax_Arrows",
    DOUBLESTRUCKBOLDITALIC = "STIXMathJax_DoubleStruck-bold-italic",
    DOUBLESTRUCKBOLD = "STIXMathJax_DoubleStruck-bold",
    DOUBLESTRUCKITALIC = "STIXMathJax_DoubleStruck-italic",
    DOUBLESTRUCK = "STIXMathJax_DoubleStruck",
    FRAKTURBOLD = "STIXMathJax_Fraktur-bold",
    FRAKTUR = "STIXMathJax_Fraktur",
    LATINBOLDITALIC = "STIXMathJax_Latin-bold-italic",
    LATINBOLD = "STIXMathJax_Latin-bold",
    LATINITALIC = "STIXMathJax_Latin-italic",
    LATIN = "STIXMathJax_Latin",
    MAINBOLDITALIC = "STIXMathJax_Main-bold-italic",
    MAINBOLD = "STIXMathJax_Main-bold",
    MAINITALIC = "STIXMathJax_Main-italic",
    MAIN = "STIXMathJax_Main",
    MARKSBOLDITALIC = "STIXMathJax_Marks-bold-italic",
    MARKSBOLD = "STIXMathJax_Marks-bold",
    MARKSITALIC = "STIXMathJax_Marks-italic",
    MARKS = "STIXMathJax_Marks",
    MISCBOLDITALIC = "STIXMathJax_Misc-bold-italic",
    MISCBOLD = "STIXMathJax_Misc-bold",
    MISCITALIC = "STIXMathJax_Misc-italic",
    MISC = "STIXMathJax_Misc",
    MONOSPACE = "STIXMathJax_Monospace",
    NORMALBOLDITALIC = "STIXMathJax_Normal-bold-italic",
    NORMALBOLD = "STIXMathJax_Normal-bold",
    NORMALITALIC = "STIXMathJax_Normal-italic",
    OPERATORSBOLD = "STIXMathJax_Operators-bold",
    OPERATORS = "STIXMathJax_Operators",
    SANSSERIFBOLDITALIC = "STIXMathJax_SansSerif-bold-italic",
    SANSSERIFBOLD = "STIXMathJax_SansSerif-bold",
    SANSSERIFITALIC = "STIXMathJax_SansSerif-italic",
    SANSSERIF = "STIXMathJax_SansSerif",
    SCRIPTBOLDITALIC = "STIXMathJax_Script-bold-italic",
    SCRIPTITALIC = "STIXMathJax_Script-italic",
    SCRIPT = "STIXMathJax_Script",
    SHAPESBOLDITALIC = "STIXMathJax_Shapes-bold-italic",
    SHAPESBOLD = "STIXMathJax_Shapes-bold",
    SHAPES = "STIXMathJax_Shapes",
    SIZE1 = "STIXMathJax_Size1",
    SIZE2 = "STIXMathJax_Size2",
    SIZE3 = "STIXMathJax_Size3",
    SIZE4 = "STIXMathJax_Size4",
    SIZE5 = "STIXMathJax_Size5",
    SYMBOLSBOLD = "STIXMathJax_Symbols-bold",
    SYMBOLS = "STIXMathJax_Symbols",
    VARIANTSBOLDITALIC = "STIXMathJax_Variants-bold-italic",
    VARIANTSBOLD = "STIXMathJax_Variants-bold",
    VARIANTSITALIC = "STIXMathJax_Variants-italic",
    VARIANTS = "STIXMathJax_Variants";

  var H = "H",
    V = "V",
    EXTRAH = { load: "extra", dir: H },
    EXTRAV = { load: "extra", dir: V };
  var ARROWREP = [0x2212, MAIN, 0, 0, 0, -0.26, -0.26];

  HTMLCSS.Augment({
    FONTDATA: {
      version: VERSION,

      TeX_factor: 1.125,
      baselineskip: 1.2,
      lineH: 0.8,
      lineD: 0.2,

      hasStyleChar: true, // char 0xEFFD encodes font style

      FONTS: {
        "STIXMathJax_Alphabets-bold-italic": "Alphabets/BoldItalic/Main.js",
        "STIXMathJax_Alphabets-bold": "Alphabets/Bold/Main.js",
        "STIXMathJax_Alphabets-italic": "Alphabets/Italic/Main.js",
        STIXMathJax_Alphabets: "Alphabets/Regular/Main.js",
        "STIXMathJax_Arrows-bold": "Arrows/Bold/Main.js",
        STIXMathJax_Arrows: "Arrows/Regular/Main.js",
        "STIXMathJax_DoubleStruck-bold-italic":
          "DoubleStruck/BoldItalic/Main.js",
        "STIXMathJax_DoubleStruck-bold": "DoubleStruck/Bold/Main.js",
        "STIXMathJax_DoubleStruck-italic": "DoubleStruck/Italic/Main.js",
        STIXMathJax_DoubleStruck: "DoubleStruck/Regular/Main.js",
        "STIXMathJax_Fraktur-bold": "Fraktur/Bold/Main.js",
        STIXMathJax_Fraktur: "Fraktur/Regular/Main.js",
        "STIXMathJax_Latin-bold-italic": "Latin/BoldItalic/Main.js",
        "STIXMathJax_Latin-bold": "Latin/Bold/Main.js",
        "STIXMathJax_Latin-italic": "Latin/Italic/Main.js",
        STIXMathJax_Latin: "Latin/Regular/Main.js",
        "STIXMathJax_Main-bold-italic": "Main/BoldItalic/Main.js",
        "STIXMathJax_Main-bold": "Main/Bold/Main.js",
        "STIXMathJax_Main-italic": "Main/Italic/Main.js",
        STIXMathJax_Main: "Main/Regular/Main.js",
        "STIXMathJax_Marks-bold-italic": "Marks/BoldItalic/Main.js",
        "STIXMathJax_Marks-bold": "Marks/Bold/Main.js",
        "STIXMathJax_Marks-italic": "Marks/Italic/Main.js",
        STIXMathJax_Marks: "Marks/Regular/Main.js",
        "STIXMathJax_Misc-bold-italic": "Misc/BoldItalic/Main.js",
        "STIXMathJax_Misc-bold": "Misc/Bold/Main.js",
        "STIXMathJax_Misc-italic": "Misc/Italic/Main.js",
        STIXMathJax_Misc: "Misc/Regular/Main.js",
        STIXMathJax_Monospace: "Monospace/Regular/Main.js",
        "STIXMathJax_Normal-bold-italic": "Normal/BoldItalic/Main.js",
        "STIXMathJax_Normal-bold": "Normal/Bold/Main.js",
        "STIXMathJax_Normal-italic": "Normal/Italic/Main.js",
        "STIXMathJax_Operators-bold": "Operators/Bold/Main.js",
        STIXMathJax_Operators: "Operators/Regular/Main.js",
        "STIXMathJax_SansSerif-bold-italic": "SansSerif/BoldItalic/Main.js",
        "STIXMathJax_SansSerif-bold": "SansSerif/Bold/Main.js",
        "STIXMathJax_SansSerif-italic": "SansSerif/Italic/Main.js",
        STIXMathJax_SansSerif: "SansSerif/Regular/Main.js",
        "STIXMathJax_Script-bold-italic": "Script/BoldItalic/Main.js",
        "STIXMathJax_Script-italic": "Script/Italic/Main.js",
        STIXMathJax_Script: "Script/Regular/Main.js",
        "STIXMathJax_Shapes-bold-italic": "Shapes/BoldItalic/Main.js",
        "STIXMathJax_Shapes-bold": "Shapes/Bold/Main.js",
        STIXMathJax_Shapes: "Shapes/Regular/Main.js",
        STIXMathJax_Size1: "Size1/Regular/Main.js",
        STIXMathJax_Size2: "Size2/Regular/Main.js",
        STIXMathJax_Size3: "Size3/Regular/Main.js",
        STIXMathJax_Size4: "Size4/Regular/Main.js",
        STIXMathJax_Size5: "Size5/Regular/Main.js",
        "STIXMathJax_Symbols-bold": "Symbols/Bold/Main.js",
        STIXMathJax_Symbols: "Symbols/Regular/Main.js",
        "STIXMathJax_Variants-bold-italic": "Variants/BoldItalic/Main.js",
        "STIXMathJax_Variants-bold": "Variants/Bold/Main.js",
        "STIXMathJax_Variants-italic": "Variants/Italic/Main.js",
        STIXMathJax_Variants: "Variants/Regular/Main.js"
      },

      VARIANT: {
        normal: {
          fonts: [
            MAIN,
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
            SIZE1
          ],
          remap: { 0x007c: [0x007c, "-STIX-Web-variant"] }
        },
        bold: {
          fonts: [
            MAINBOLD,
            NORMALBOLD,
            FRAKTURBOLD,
            DOUBLESTRUCKBOLD,
            SANSSERIFBOLD,
            LATINBOLD,
            ALPHABETSBOLD,
            MARKSBOLD,
            ARROWSBOLD,
            OPERATORSBOLD,
            SYMBOLSBOLD,
            SHAPESBOLD,
            MISCBOLD,
            VARIANTSBOLD,
            SIZE1
          ],
          offsetA: 0x1d400,
          offsetG: 0x1d6a8,
          bold: true,
          remap: { 0x2202: 0x1d6db, 0x2207: 0x1d6c1 }
        },
        italic: {
          fonts: [
            MAINITALIC,
            NORMALITALIC,
            SCRIPTITALIC,
            DOUBLESTRUCKITALIC,
            SANSSERIFITALIC,
            LATINITALIC,
            ALPHABETSITALIC,
            MARKSITALIC,
            MISCITALIC,
            VARIANTSITALIC,
            SIZE1
          ],
          offsetA: 0x1d434,
          offsetG: 0x1d6e2,
          remap: { 0x1d455: 0x210e, 0x2202: 0x1d715, 0x2207: 0x1d6fb },
          italic: true
        },
        "bold-italic": {
          fonts: [
            MAINBOLDITALIC,
            NORMALBOLDITALIC,
            SCRIPTBOLDITALIC,
            DOUBLESTRUCKBOLDITALIC,
            SANSSERIFBOLDITALIC,
            LATINBOLDITALIC,
            ALPHABETSBOLDITALIC,
            MARKSBOLDITALIC,
            SHAPESBOLDITALIC,
            MISCBOLDITALIC,
            VARIANTSBOLDITALIC,
            SIZE1
          ],
          offsetA: 0x1d434,
          offsetG: 0x1d71c,
          remap: { 0x1d455: 0x210e, 0x2202: 0x1d74f, 0x2207: 0x1d735 },
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
          fonts: [FRAKTURBOLD],
          offsetA: 0x1d56c,
          bold: true
        },
        script: {
          fonts: [SCRIPTITALIC],
          offsetA: 0x1d49c,
          italic: true,
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
          fonts: [SCRIPTBOLDITALIC],
          offsetA: 0x1d4d0,
          bold: true,
          italic: true
        },
        "sans-serif": {
          fonts: [SANSSERIF],
          offsetA: 0x1d5a0,
          offsetN: 0x1d7e2,
          offsetP: 0xe17d,
          remap: { 0x2202: 0xe17c }
        },
        "bold-sans-serif": {
          fonts: [SANSSERIFBOLD],
          offsetA: 0x1d5d4,
          offsetN: 0x1d7ec,
          offsetG: 0x1d756,
          remap: { 0x2202: 0x1d789, 0x2207: 0x1d76f }
        },
        "sans-serif-italic": {
          fonts: [SANSSERIFITALIC],
          italic: true,
          offsetA: 0x1d608,
          offsetN: 0xe1b4,
          offsetP: 0xe1bf,
          remap: { 0x2202: 0xe1be },
          bold: true
        },
        "sans-serif-bold-italic": {
          fonts: [SANSSERIFBOLDITALIC],
          offsetA: 0x1d63c,
          offsetN: 0xe1f6,
          offsetG: 0x1d790,
          remap: { 0x2202: 0x1d7c3, 0x2207: 0x1d7a9 },
          bold: true,
          italic: true
        },
        monospace: {
          fonts: [MONOSPACE],
          offsetA: 0x1d670,
          offsetN: 0x1d7f6
        },
        "-STIX-Web-variant": {
          remap: {
            0x2a87: 0xe010,
            0x2a88: 0xe00f,
            0x25b3: 0x25b5,
            0x25bd: 0x25bf,
            0x007c: [0x007c, MML.VARIANT.NORMAL]
          },
          fonts: [
            VARIANTS,
            SHAPES,
            OPERATORS,
            MAIN,
            MONOSPACE,
            LATIN,
            ALPHABETS,
            MARKS,
            ARROWS,
            SYMBOLS,
            MISC,
            SIZE1
          ]
        },
        "-tex-caligraphic": {
          offsetA: 0xe22d,
          noLowerCase: 1,
          fonts: [
            VARIANTSITALIC,
            MAINITALIC,
            NORMALITALIC,
            SCRIPTITALIC,
            DOUBLESTRUCKITALIC,
            SANSSERIFITALIC,
            LATINITALIC,
            ALPHABETSITALIC,
            MARKSITALIC,
            MISCITALIC,
            SIZE1
          ],
          italic: true
        },
        "-tex-oldstyle": {
          offsetN: 0xe261,
          remap: {
            0xe262: 0xe265,
            0xe263: 0xe269,
            0xe264: 0xe26d,
            0xe265: 0xe271,
            0xe266: 0xe275,
            0xe267: 0xe279,
            0xe268: 0xe27d,
            0xe269: 0xe281,
            0xe26a: 0xe285
          },
          fonts: [
            VARIANTS,
            MAIN,
            MONOSPACE,
            LATIN,
            ALPHABETS,
            MARKS,
            ARROWS,
            OPERATORS,
            SYMBOLS,
            SHAPES,
            MISC,
            SIZE1
          ]
        },
        "-tex-caligraphic-bold": {
          offsetA: 0xe247,
          noLowerCase: 1,
          fonts: [
            VARIANTSBOLDITALIC,
            MAINBOLDITALIC,
            NORMALBOLDITALIC,
            SCRIPTBOLDITALIC,
            DOUBLESTRUCKBOLDITALIC,
            SANSSERIFBOLDITALIC,
            LATINBOLDITALIC,
            ALPHABETSBOLDITALIC,
            MARKSBOLDITALIC,
            SHAPESBOLDITALIC,
            MISCBOLDITALIC,
            SIZE1
          ],
          italic: true,
          bold: true
        },
        "-tex-oldstyle-bold": {
          offsetN: 0xe261,
          remap: {
            0xe264: 0xe267,
            0xe265: 0xe26b,
            0xe266: 0xe26f,
            0xe267: 0xe273,
            0xe268: 0xe277,
            0xe269: 0xe27b,
            0xe26a: 0xe27f,
            0xe26b: 0xe283,
            0xe26c: 0xe287
          },
          fonts: [
            VARIANTSBOLD,
            MAINBOLD,
            NORMALBOLD,
            FRAKTURBOLD,
            DOUBLESTRUCKBOLD,
            SANSSERIFBOLD,
            LATINBOLD,
            ALPHABETSBOLD,
            MARKSBOLD,
            ARROWSBOLD,
            OPERATORSBOLD,
            SYMBOLSBOLD,
            SHAPESBOLD,
            MISCBOLD,
            SIZE1
          ],
          bold: true
        },
        "-tex-mathit": {
          fonts: [
            MAINITALIC,
            NORMALITALIC,
            SCRIPTITALIC,
            DOUBLESTRUCKITALIC,
            SANSSERIFITALIC,
            LATINITALIC,
            ALPHABETSITALIC,
            MARKSITALIC,
            MISCITALIC,
            VARIANTSITALIC,
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
        { name: "Greek", low: 0x0391, high: 0x03a9, offset: "G" },
        {
          name: "vargreek",
          low: 0x03d1,
          high: 0x03f6,
          offset: "G",
          remapOnly: true,
          remap: {
            0x03f5: 52,
            0x03d1: 53,
            0x03f0: 54,
            0x03d5: 55,
            0x03f1: 56,
            0x03d6: 57,
            0x03f4: 17
          }
        },
        { name: "PUAgreek", low: 0x03b1, high: 0x03c9, offset: "P", add: 25 },
        { name: "PUAGreek", low: 0x0391, high: 0x03a9, offset: "P" },
        {
          name: "varPUAgreek",
          low: 0x03d1,
          high: 0x03f6,
          offset: "P",
          remapOnly: true,
          remap: {
            0x03f5: 50,
            0x03d1: 51,
            0x03d5: 52,
            0x03f1: 53,
            0x03d6: 54,
            0x03f4: 17
          }
        }
      ],

      RULECHAR: 0x23af,

      REMAP: {
        0xa: 0x20,
        0x3008: 0x27e8,
        0x3009: 0x27e9,
        0x2758: 0x2223,
        0x02f3: 0x02da,
        0x02f4: 0x02ca,
        0xfe37: 0x23de,
        0xfe38: 0x23df
      },

      REMAPACCENT: {
        "\u007E": "\u0303",
        "\u2192": "\u20D7",
        "\u2190": "\u20D6",
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
            [0.853, MAIN],
            [1.23, SIZE1],
            [1.35, SIZE1, 1.098],
            [1.845, SIZE2],
            [2.46, SIZE3],
            [3.075, SIZE4]
          ],
          stretch: {
            bot: [0xe000, SIZE5],
            ext: [0xe001, SIZE5],
            top: [0xe002, SIZE5]
          }
        },
        0x29: {
          dir: V,
          HW: [
            [0.853, MAIN],
            [1.23, SIZE1],
            [1.35, SIZE1, 1.098],
            [1.845, SIZE2],
            [2.46, SIZE3],
            [3.075, SIZE4]
          ],
          stretch: {
            bot: [0xe003, SIZE5],
            ext: [0xe004, SIZE5],
            top: [0xe005, SIZE5]
          }
        },
        0x2d: { alias: 0x23af, dir: H },
        0x2f: {
          dir: V,
          HW: [
            [0.69, MAIN],
            [1.23, SIZE1],
            [1.35, SIZE1, 1.098],
            [1.845, SIZE2],
            [2.46, SIZE3],
            [3.075, SIZE4]
          ]
        },
        0x3d: EXTRAH,
        0x5b: {
          dir: V,
          HW: [
            [0.818, MAIN],
            [1.23, SIZE1],
            [1.35, SIZE1, 1.098],
            [1.845, SIZE2],
            [2.46, SIZE3],
            [3.075, SIZE4]
          ],
          stretch: {
            bot: [0xe006, SIZE5],
            ext: [0xe007, SIZE5],
            top: [0xe008, SIZE5]
          }
        },
        0x5c: {
          dir: V,
          HW: [
            [0.69, MAIN],
            [1.23, SIZE1],
            [1.35, SIZE1, 1.098],
            [1.845, SIZE2],
            [2.46, SIZE3],
            [3.075, SIZE4]
          ]
        },
        0x5d: {
          dir: V,
          HW: [
            [0.818, MAIN],
            [1.23, SIZE1],
            [1.35, SIZE1, 1.098],
            [1.845, SIZE2],
            [2.46, SIZE3],
            [3.075, SIZE4]
          ],
          stretch: {
            bot: [0xe009, SIZE5],
            ext: [0xe00a, SIZE5],
            top: [0xe00b, SIZE5]
          }
        },
        0x5e: { alias: 0x2c6, dir: H },
        0x5f: { alias: 0x23af, dir: H },
        0x7b: {
          dir: V,
          HW: [
            [0.861, MAIN],
            [1.23, SIZE1],
            [1.35, SIZE1, 1.098],
            [1.845, SIZE2],
            [2.46, SIZE3],
            [3.075, SIZE4]
          ],
          stretch: {
            bot: [0xe00c, SIZE5],
            ext: [0xe00d, SIZE5],
            mid: [0xe00e, SIZE5],
            top: [0xe00f, SIZE5]
          }
        },
        0x7c: {
          dir: V,
          HW: [[0.69, MAIN]],
          stretch: { bot: [0x7c, MAIN], ext: [0x7c, MAIN] }
        },
        0x7d: {
          dir: V,
          HW: [
            [0.861, MAIN],
            [1.23, SIZE1],
            [1.35, SIZE1, 1.098],
            [1.845, SIZE2],
            [2.46, SIZE3],
            [3.075, SIZE4]
          ],
          stretch: {
            bot: [0xe010, SIZE5],
            ext: [0xe00d, SIZE5],
            mid: [0xe011, SIZE5],
            top: [0xe012, SIZE5]
          }
        },
        0x7e: { alias: 0x2dc, dir: H },
        0xaf: { alias: 0x23af, dir: H },
        0x2c6: {
          dir: H,
          HW: [
            [0.311, MAIN],
            [0.56, SIZE1],
            [0.979, SIZE2],
            [1.46, SIZE3],
            [1.886, SIZE4],
            [2.328, SIZE5]
          ]
        },
        0x2c7: EXTRAH,
        0x2c9: { alias: 0x23af, dir: H },
        0x2cd: EXTRAH,
        0x2dc: {
          dir: H,
          HW: [
            [0.33, MAIN],
            [0.56, SIZE1],
            [0.979, SIZE2],
            [1.46, SIZE3],
            [1.886, SIZE4],
            [2.328, SIZE5]
          ]
        },
        0x2f7: EXTRAH,
        0x302: {
          dir: H,
          HW: [
            [0.311, MAIN],
            [0.56, SIZE1],
            [0.979, SIZE2],
            [1.46, SIZE3],
            [1.886, SIZE4],
            [2.328, SIZE5]
          ]
        },
        0x303: {
          dir: H,
          HW: [
            [0.33, MAIN],
            [0.56, SIZE1],
            [0.979, SIZE2],
            [1.46, SIZE3],
            [1.886, SIZE4],
            [2.328, SIZE5]
          ]
        },
        0x305: {
          dir: H,
          HW: [
            [0.5, MARKS],
            [1.0, SIZE1],
            [1.5, SIZE2],
            [2.0, SIZE3],
            [2.5, SIZE4],
            [3.0, SIZE5]
          ],
          stretch: { left: [0xe013, SIZE5], rep: [0xe013, SIZE5] }
        },
        0x30c: {
          dir: H,
          HW: [
            [0.311, MAIN],
            [0.56, SIZE1],
            [0.979, SIZE2],
            [1.46, SIZE3],
            [1.886, SIZE4],
            [2.328, SIZE5]
          ]
        },
        0x330: {
          dir: H,
          HW: [
            [0.33, MARKS],
            [0.56, SIZE1],
            [0.979, SIZE2],
            [1.46, SIZE3],
            [1.886, SIZE4],
            [2.328, SIZE5]
          ]
        },
        0x332: {
          dir: H,
          HW: [
            [0.5, MARKS],
            [1.0, SIZE1],
            [1.5, SIZE2],
            [2.0, SIZE3],
            [2.5, SIZE4],
            [3.0, SIZE5]
          ],
          stretch: { left: [0xe014, SIZE5], rep: [0xe014, SIZE5] }
        },
        0x338: {
          dir: V,
          HW: [
            [0.818, MAIN],
            [0.553, SIZE1],
            [0.662, SIZE2],
            [0.818, SIZE3],
            [0.959, SIZE4],
            [1.414, SIZE5]
          ]
        },
        0x2015: { alias: 0x23af, dir: H },
        0x2016: {
          dir: V,
          HW: [[0.879, MAIN]],
          stretch: { bot: [0x2016, MAIN], ext: [0x2016, MAIN] }
        },
        0x2017: { alias: 0x23af, dir: H },
        0x203e: {
          dir: H,
          HW: [
            [0.5, MAIN],
            [1.0, SIZE1],
            [1.5, SIZE2],
            [2.0, SIZE3],
            [2.5, SIZE4],
            [3.0, SIZE5]
          ],
          stretch: { left: [0x203e, MAIN], rep: [0x203e, MAIN] }
        },
        0x20d0: EXTRAH,
        0x20d1: EXTRAH,
        0x20d6: EXTRAH,
        0x20d7: {
          dir: H,
          HW: [
            [0.436, MAIN],
            [0.872, SIZE1],
            [1.308, SIZE2],
            [1.744, SIZE3],
            [2.18, SIZE4],
            [3.0, SIZE5]
          ],
          stretch: { rep: [0xe016, SIZE5], right: [0xe019, SIZE5] }
        },
        0x20e1: EXTRAH,
        0x20ec: EXTRAH,
        0x20ed: EXTRAH,
        0x20ee: EXTRAH,
        0x20ef: EXTRAH,
        0x2140: EXTRAV,
        0x2190: {
          dir: H,
          HW: [[0.786, MAIN]],
          stretch: { left: [0x2190, MAIN], rep: ARROWREP }
        },
        0x2191: {
          dir: V,
          HW: [[0.818, MAIN]],
          stretch: { ext: [0x23d0, MAIN], top: [0x2191, MAIN] }
        },
        0x2192: {
          dir: H,
          HW: [[0.786, MAIN]],
          stretch: { rep: ARROWREP, right: [0x2192, MAIN] }
        },
        0x2193: {
          dir: V,
          HW: [[0.818, MAIN]],
          stretch: { bot: [0x2193, MAIN], ext: [0x23d0, MAIN] }
        },
        0x2194: {
          dir: H,
          HW: [[0.85, MAIN]],
          stretch: {
            left: [0x2190, MAIN],
            rep: ARROWREP,
            right: [0x2192, MAIN]
          }
        },
        0x2195: {
          dir: V,
          HW: [[0.954, MAIN]],
          stretch: {
            bot: [0x2193, MAIN],
            ext: [0x23d0, MAIN],
            top: [0x2191, MAIN]
          }
        },
        0x219e: EXTRAH,
        0x219f: EXTRAV,
        0x21a0: EXTRAH,
        0x21a1: EXTRAV,
        0x21a4: EXTRAH,
        0x21a5: EXTRAV,
        0x21a6: EXTRAH,
        0x21a7: EXTRAV,
        0x21a8: EXTRAV,
        0x21a9: EXTRAH,
        0x21aa: EXTRAH,
        0x21b0: EXTRAV,
        0x21b1: EXTRAV,
        0x21b2: EXTRAV,
        0x21b3: EXTRAV,
        0x21b4: EXTRAH,
        0x21b5: EXTRAV,
        0x21bc: EXTRAH,
        0x21bd: EXTRAH,
        0x21be: EXTRAV,
        0x21bf: EXTRAV,
        0x21c0: EXTRAH,
        0x21c1: EXTRAH,
        0x21c2: EXTRAV,
        0x21c3: EXTRAV,
        0x21cb: EXTRAH,
        0x21cc: EXTRAH,
        0x21d0: {
          dir: H,
          HW: [[0.806, MAIN]],
          stretch: { left: [0x21d0, MAIN], rep: [0xe01f, SIZE5] }
        },
        0x21d1: {
          dir: V,
          HW: [[0.818, MAIN]],
          stretch: { ext: [0xe020, SIZE5], top: [0x21d1, MAIN] }
        },
        0x21d2: {
          dir: H,
          HW: [[0.806, MAIN]],
          stretch: { rep: [0xe01f, SIZE5], right: [0x21d2, MAIN] }
        },
        0x21d3: {
          dir: V,
          HW: [[0.818, MAIN]],
          stretch: { bot: [0x21d3, MAIN], ext: [0xe020, SIZE5] }
        },
        0x21d4: {
          dir: H,
          HW: [[0.886, MAIN]],
          stretch: {
            left: [0x21d0, MAIN],
            rep: [0xe01f, SIZE5],
            right: [0x21d2, MAIN]
          }
        },
        0x21d5: {
          dir: V,
          HW: [[0.954, MAIN]],
          stretch: {
            bot: [0x21d3, MAIN],
            ext: [0xe020, SIZE5],
            top: [0x21d1, MAIN]
          }
        },
        0x21da: EXTRAH,
        0x21db: EXTRAH,
        0x21e0: EXTRAH,
        0x21e1: EXTRAV,
        0x21e2: EXTRAH,
        0x21e3: EXTRAV,
        0x21e4: EXTRAH,
        0x21e5: EXTRAH,
        0x21fd: EXTRAH,
        0x21fe: EXTRAH,
        0x21ff: EXTRAH,
        0x220f: EXTRAV,
        0x2210: EXTRAV,
        0x2211: EXTRAV,
        0x2212: { alias: 0x23af, dir: H },
        0x2215: { alias: 0x2f, dir: V },
        0x221a: {
          dir: V,
          HW: [[1.232, MAIN], [1.847, SIZE1], [2.46, SIZE2], [3.075, SIZE3]],
          stretch: {
            bot: [0xe022, SIZE5],
            ext: [0xe023, SIZE5],
            top: [0xe024, SIZE5]
          }
        },
        0x221b: EXTRAV,
        0x221c: EXTRAV,
        0x2223: {
          dir: V,
          HW: [[0.879, MAIN]],
          stretch: { ext: [0x2223, MAIN] }
        },
        0x2225: {
          dir: V,
          HW: [[0.879, MAIN]],
          stretch: { ext: [0x2225, MAIN] }
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
        0x22c0: EXTRAV,
        0x22c1: EXTRAV,
        0x22c2: EXTRAV,
        0x22c3: EXTRAV,
        0x2308: {
          dir: V,
          HW: [
            [0.926, MAIN],
            [1.23, SIZE1],
            [1.35, SIZE1, 1.098],
            [1.845, SIZE2],
            [2.46, SIZE3],
            [3.075, SIZE4]
          ],
          stretch: { ext: [0xe007, SIZE5], top: [0xe008, SIZE5] }
        },
        0x2309: {
          dir: V,
          HW: [
            [0.926, MAIN],
            [1.23, SIZE1],
            [1.35, SIZE1, 1.098],
            [1.845, SIZE2],
            [2.46, SIZE3],
            [3.075, SIZE4]
          ],
          stretch: { ext: [0xe00a, SIZE5], top: [0xe00b, SIZE5] }
        },
        0x230a: {
          dir: V,
          HW: [
            [0.926, MAIN],
            [1.23, SIZE1],
            [1.35, SIZE1, 1.098],
            [1.845, SIZE2],
            [2.46, SIZE3],
            [3.075, SIZE4]
          ],
          stretch: { bot: [0xe006, SIZE5], ext: [0xe007, SIZE5] }
        },
        0x230b: {
          dir: V,
          HW: [
            [0.926, MAIN],
            [1.23, SIZE1],
            [1.35, SIZE1, 1.098],
            [1.845, SIZE2],
            [2.46, SIZE3],
            [3.075, SIZE4]
          ],
          stretch: { bot: [0xe009, SIZE5], ext: [0xe00a, SIZE5] }
        },
        0x2312: { alias: 0x23dc, dir: H },
        0x2322: { alias: 0x23dc, dir: H },
        0x2323: { alias: 0x23dd, dir: H },
        0x2329: { alias: 0x27e8, dir: V },
        0x232a: { alias: 0x27e9, dir: V },
        0x23aa: EXTRAV,
        0x23af: {
          dir: H,
          HW: [[0.315, SYMBOLS]],
          stretch: { rep: [0x23af, SYMBOLS] }
        },
        0x23b0: {
          dir: V,
          HW: [[1.001, SIZE5, null, 0xe03a]],
          stretch: {
            top: [0xe00f, SIZE5],
            ext: [0xe00d, SIZE5],
            bot: [0xe010, SIZE5]
          }
        },
        0x23b1: {
          dir: V,
          HW: [[1.001, SIZE5, null, 0xe03b]],
          stretch: {
            top: [0xe012, SIZE5],
            ext: [0xe00d, SIZE5],
            bot: [0xe00c, SIZE5]
          }
        },
        0x23b4: EXTRAH,
        0x23b5: EXTRAH,
        0x23d0: EXTRAV,
        0x23dc: EXTRAH,
        0x23dd: EXTRAH,
        0x23de: {
          dir: H,
          HW: [
            [1.0, MAIN],
            [0.925, SIZE1],
            [1.46, SIZE2],
            [1.886, SIZE3],
            [2.328, SIZE4],
            [3.238, SIZE5]
          ],
          stretch: {
            left: [0xe031, SIZE5],
            rep: [0xe028, SIZE5],
            mid: [0xe032, SIZE5],
            right: [0xe033, SIZE5]
          }
        },
        0x23df: {
          dir: H,
          HW: [
            [1.0, MAIN],
            [0.925, SIZE1],
            [1.46, SIZE2],
            [1.886, SIZE3],
            [2.328, SIZE4],
            [3.238, SIZE5]
          ],
          stretch: {
            left: [0xe034, SIZE5],
            rep: [0xe02b, SIZE5],
            mid: [0xe035, SIZE5],
            right: [0xe036, SIZE5]
          }
        },
        0x23e0: EXTRAH,
        0x23e1: EXTRAH,
        0x2500: { alias: 0x2212, dir: H },
        0x2758: { alias: 0x2223, dir: V },
        0x2772: EXTRAV,
        0x2773: EXTRAV,
        0x27e6: EXTRAV,
        0x27e7: EXTRAV,
        0x27e8: {
          dir: V,
          HW: [
            [0.926, MAIN],
            [1.23, SIZE1],
            [1.35, SIZE1, 1.098],
            [1.845, SIZE2],
            [2.46, SIZE3],
            [3.075, SIZE4]
          ]
        },
        0x27e9: {
          dir: V,
          HW: [
            [0.926, MAIN],
            [1.23, SIZE1],
            [1.35, SIZE1, 1.098],
            [1.845, SIZE2],
            [2.46, SIZE3],
            [3.075, SIZE4]
          ]
        },
        0x27ea: EXTRAV,
        0x27eb: EXTRAV,
        0x27ee: {
          dir: V,
          HW: [[0.853, MAIN]],
          stretch: {
            bot: [0xe000, SIZE5],
            ext: [0xe001, SIZE5],
            top: [0xe002, SIZE5]
          }
        },
        0x27ef: {
          dir: V,
          HW: [[0.853, MAIN]],
          stretch: {
            bot: [0xe003, SIZE5],
            ext: [0xe004, SIZE5],
            top: [0xe005, SIZE5]
          }
        },
        0x27f0: EXTRAV,
        0x27f1: EXTRAV,
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
        0x2906: EXTRAH,
        0x2907: EXTRAH,
        0x290a: EXTRAV,
        0x290b: EXTRAV,
        0x2912: EXTRAV,
        0x2913: EXTRAV,
        0x294e: EXTRAH,
        0x294f: EXTRAV,
        0x2950: EXTRAH,
        0x2951: EXTRAV,
        0x2952: EXTRAH,
        0x2953: EXTRAH,
        0x2954: EXTRAV,
        0x2955: EXTRAV,
        0x2956: EXTRAH,
        0x2957: EXTRAH,
        0x2958: EXTRAV,
        0x2959: EXTRAV,
        0x295a: EXTRAH,
        0x295b: EXTRAH,
        0x295c: EXTRAV,
        0x295d: EXTRAV,
        0x295e: EXTRAH,
        0x295f: EXTRAH,
        0x2960: EXTRAV,
        0x2961: EXTRAV,
        0x2980: EXTRAV,
        0x2983: EXTRAV,
        0x2984: EXTRAV,
        0x2985: EXTRAV,
        0x2986: EXTRAV,
        0x2997: EXTRAV,
        0x2998: EXTRAV,
        0x29f8: {
          dir: V,
          HW: [[1.02, MAIN], [1.845, SIZE1]]
        },
        0x29f9: {
          dir: V,
          HW: [[1.02, MAIN], [1.845, SIZE1]]
        },
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
        0x2a0a: EXTRAV,
        0x2a0b: EXTRAV,
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
        0x2afc: EXTRAV,
        0x2aff: EXTRAV,
        0x2b45: EXTRAH,
        0x2b46: {
          dir: H,
          HW: [[0.818, SHAPES]],
          stretch: { rep: [0xe039, SIZE5], right: [0x2b46, SHAPES] }
        },
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
      HTMLCSS.FONTDATA.FONTS[MAIN][0x22ee][0] += 400; // adjust height for \vdots
      HTMLCSS.FONTDATA.FONTS[MAIN][0x22f1][0] += 500; // adjust height for \ddots
      HTMLCSS.FONTDATA.FONTS[MAIN][0x2212][0] =
        HTMLCSS.FONTDATA.FONTS[MAIN][0x002b][0]; // - needs height and depth of +
      HTMLCSS.FONTDATA.FONTS[MAIN][0x2212][1] =
        HTMLCSS.FONTDATA.FONTS[MAIN][0x002b][1]; // - needs height and depth of +
      HTMLCSS.FONTDATA.FONTS[MAIN][0x003d][1] += 100; // adjust depth for = (double arrow extender)
    }
  );
  MathJax.Hub.Register.LoadHook(
    HTMLCSS.fontDir + "/Size5/Regular/Main.js",
    function() {
      var u;
      u = HTMLCSS.FONTDATA.DELIMITERS[0x23de].stretch.rep[0];
      HTMLCSS.FONTDATA.FONTS[SIZE5][u][0] += 200; // adjust height for brace extender
      HTMLCSS.FONTDATA.FONTS[SIZE5][u][1] += 200; // adjust depth for brace extender
      u = HTMLCSS.FONTDATA.DELIMITERS[0x23df].stretch.rep[0];
      HTMLCSS.FONTDATA.FONTS[SIZE5][u][0] += 200; // adjust height for brace extender
      HTMLCSS.FONTDATA.FONTS[SIZE5][u][1] += 200; // adjust depth for brace extender
    }
  );

  AJAX.loadComplete(HTMLCSS.fontDir + "/fontdata.js");
})(MathJax.OutputJax["HTML-CSS"], MathJax.ElementJax.mml, MathJax.Ajax);
