/* -*- Mode: Javascript; indent-tabs-mode:nil; js-indent-level: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */

/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/font/STIX/fontdata.js
 *
 *  Initializes the HTML-CSS OutputJax to use the STIX fonts
 *  for displaying mathematics.
 *
 *  ---------------------------------------------------------------------
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
 */

(function(HTMLCSS, MML, HTML) {
  var VERSION = "2.7.5";

  HTMLCSS.allowWebFonts = false;

  var GENERAL = "STIXGeneral",
    BOLD = "STIXGeneral-bold",
    ITALIC = "STIXGeneral-italic",
    BITALIC = "STIXGeneral-bold-italic",
    NONUNI = "STIXNonUnicode",
    NONUNII = "STIXNonUnicode-italic",
    SIZE1 = "STIXSizeOneSym",
    SIZE2 = "STIXSizeTwoSym",
    SIZE3 = "STIXSizeThreeSym",
    SIZE4 = "STIXSizeFourSym",
    SIZE5 = "STIXSizeFiveSym";
  var H = "H",
    V = "V",
    EXTRAH = { load: "extra", dir: H },
    EXTRAV = { load: "extra", dir: V };
  var ARROWREP = [0x2212, GENERAL, 0, 0, 0, -0.26, -0.26]; // remove extra height/depth added below

  HTMLCSS.Augment({
    FONTDATA: {
      version: VERSION,
      STIXversion: "1.1",

      TeX_factor: 1.125, // TeX em's to STIX em's seem to need this
      baselineskip: 1.2,
      lineH: 0.8,
      lineD: 0.2,

      FONTS: {
        STIXGeneral: "General/Regular/Main.js",
        "STIXGeneral-italic": "General/Italic/Main.js",
        "STIXGeneral-bold": "General/Bold/Main.js",
        "STIXGeneral-bold-italic": "General/BoldItalic/Main.js",
        STIXNonUnicode: "NonUnicode/Regular/Main.js",
        "STIXNonUnicode-italic": "NonUnicode/Italic/Main.js",
        "STIXNonUnicode-bold": "NonUnicode/Bold/Main.js",
        "STIXNonUnicode-bold-italic": "NonUnicode/BoldItalic/Main.js",
        STIXVariants: "Variants/Regular/All.js",
        STIXSizeOneSym: "SizeOneSym/Regular/All.js",
        STIXSizeTwoSym: "SizeTwoSym/Regular/All.js",
        STIXSizeThreeSym: "SizeThreeSym/Regular/All.js",
        STIXSizeFourSym: "SizeFourSym/Regular/All.js",
        STIXSizeFiveSym: "SizeFiveSym/Regular/All.js",
        STIXIntegralsD: "IntegralsD/Regular/All.js"
      },

      VARIANT: {
        normal: {
          fonts: [GENERAL, NONUNI, SIZE1],
          remap: {
            0x2205: [0x2205, "-STIX-variant"], // \emptyset
            0x7c: [0x7c, "-STIX-variant"]
          }
        }, // absolute value
        bold: {
          fonts: [BOLD, "STIXNonUnicode-bold", "STIXSizeOneSym-bold"],
          offsetA: 0x1d400,
          offsetG: 0x1d6a8,
          bold: true,
          remap: { 0x2202: 0x1d6db, 0x2207: 0x1d6c1 }
        },
        italic: {
          fonts: [ITALIC, NONUNII, GENERAL, NONUNI, SIZE1],
          offsetA: 0x1d434,
          offsetG: 0x1d6e2,
          italic: true,
          remap: { 0x1d455: 0x210e, 0x2202: 0x1d715, 0x2207: 0x1d6fb }
        },
        "bold-italic": {
          fonts: [BITALIC, "STIXNonUnicode-bold-italic"],
          offsetA: 0x1d434,
          offsetG: 0x1d71c,
          bold: true,
          italic: true,
          remap: { 0x1d455: 0x210e, 0x2202: 0x1d74f, 0x2207: 0x1d735 }
        },
        "double-struck": {
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
          offsetA: 0x1d504,
          remap: {
            0x1d506: 0x212d,
            0x1d50b: 0x210c,
            0x1d50c: 0x2111,
            0x1d515: 0x211c,
            0x1d51d: 0x2128
          }
        },
        "bold-fraktur": { fonts: [BOLD], offsetA: 0x1d56c, bold: true },
        script: {
          fonts: [ITALIC],
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
          fonts: [BITALIC],
          offsetA: 0x1d4d0,
          bold: true,
          italic: true
        },
        "sans-serif": {
          offsetA: 0x1d5a0,
          offsetN: 0x1d7e2,
          offsetP: 0xe17d,
          remap: { 0x2202: 0xe17c }
        },
        "bold-sans-serif": {
          offsetA: 0x1d5d4,
          offsetG: 0x1d756,
          offsetN: 0x1d7ec,
          bold: true,
          remap: { 0x2202: 0x1d789, 0x2207: 0x1d76f }
        },
        "sans-serif-italic": {
          fonts: [ITALIC, NONUNII],
          offsetA: 0x1d608,
          offsetN: 0xe1b4,
          offsetP: 0xe1bf,
          italic: true,
          remap: { 0x2202: 0xe1be }
        },
        "sans-serif-bold-italic": {
          fonts: [BITALIC, "STIXNonUnicode-bold-italic"],
          offsetA: 0x1d63c,
          offsetN: 0xe1f6,
          offsetG: 0x1d790,
          bold: true,
          italic: true,
          remap: { 0x2202: 0x1d7c3, 0x2207: 0x1d7a9 }
        },
        monospace: {
          offsetA: 0x1d670,
          offsetN: 0x1d7f6,
          remap: {
            0x20: [0x20, "-STIX-variant"],
            0xa0: [0xa0, "-STIX-variant"]
          }
        }, // use a special space for monospace (see below)
        "-STIX-variant": {
          fonts: ["STIXVariants", NONUNI, GENERAL],
          remap: {
            0x2a87: 0xe010,
            0x2a88: 0xe00f,
            0x2270: 0xe011,
            0x2271: 0xe00e,
            0x22e0: 0xe04b,
            0x22e1: 0xe04f,
            0x2288: 0xe016,
            0x2289: 0xe018,
            0x25b3: 0x25b5,
            0x25bd: 0x25bf,
            0x2205: [0x2205, MML.VARIANT.NORMAL], // \varnothing
            0x007c: [0x007c, MML.VARIANT.NORMAL]
          }
        }, // absolute value
        "-tex-caligraphic": {
          fonts: [ITALIC, NONUNII, NONUNI, SIZE1],
          offsetA: 0xe22d,
          noLowerCase: 1
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
          }
        },
        "-tex-mathit": {
          fonts: [ITALIC, NONUNII, GENERAL, NONUNI, SIZE1],
          italic: true,
          noIC: true
        },
        "-largeOp": { fonts: [SIZE1, "STIXIntegralsD", NONUNI, GENERAL] },
        "-smallOp": {},
        "-tex-caligraphic-bold": {
          fonts: [
            "STIXGeneral-bold-italic",
            "STIXNonUnicode-bold-italic",
            "STIXNonUnicode",
            "STIXGeneral",
            "STIXSizeOneSym"
          ],
          bold: true,
          offsetA: 0xe247,
          noLowerCase: 1
        },
        "-tex-oldstyle-bold": {
          fonts: [
            "STIXGeneral-bold",
            "STIXNonUnicode-bold",
            "STIXGeneral",
            "STIXSizeOneSym"
          ],
          bold: true,
          offsetN: 0xe263,
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
          }
        }
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

      RULECHAR: 0x203e,

      REMAP: {
        0xa: 0x20, // newline
        0x2f3: 0x2da,
        0x2f4: 0x2ca, // ring below, middle grave
        0xfe37: 0x23de,
        0xfe38: 0x23df, // OverBrace, UnderBrace
        0x3008: 0x27e8,
        0x3009: 0x27e9, // langle, rangle
        0x2758: 0x2223 // VerticalSeparator
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
        // (
        0x0028: {
          dir: V,
          HW: [
            [0.844, GENERAL],
            [1.23, SIZE1],
            [1.353, SIZE1, 1.1],
            [1.845, SIZE2],
            [2.048, SIZE2, 1.11],
            [2.46, SIZE3],
            [2.472, SIZE3, 1.005],
            [3.075, SIZE4]
          ],
          stretch: {
            top: [0x239b, SIZE1],
            ext: [0x239c, SIZE1],
            bot: [0x239d, SIZE1]
          }
        },
        // )
        0x0029: {
          dir: V,
          HW: [
            [0.844, GENERAL],
            [1.23, SIZE1],
            [1.353, SIZE1, 1.1],
            [1.845, SIZE2],
            [2.048, SIZE2, 1.11],
            [2.46, SIZE3],
            [2.472, SIZE3, 1.005],
            [3.075, SIZE4]
          ],
          stretch: {
            top: [0x239e, SIZE1],
            ext: [0x239f, SIZE1],
            bot: [0x23a0, SIZE1]
          }
        },
        // /
        0x002f: {
          dir: V,
          HW: [
            [0.69, GENERAL],
            [1.23, SIZE1],
            [1.353, SIZE1, 1.1],
            [1.845, SIZE2],
            [2.048, SIZE2, 1.11],
            [2.46, SIZE3],
            [2.472, SIZE3, 1.005],
            [3.075, SIZE4]
          ]
        },
        // [
        0x005b: {
          dir: V,
          HW: [
            [0.818, GENERAL],
            [1.23, SIZE1],
            [1.353, SIZE1, 1.1],
            [1.845, SIZE2],
            [2.048, SIZE2, 1.11],
            [2.46, SIZE3],
            [2.472, SIZE3, 1.005],
            [3.075, SIZE4]
          ],
          stretch: {
            top: [0x23a1, SIZE1],
            ext: [0x23a2, SIZE1],
            bot: [0x23a3, SIZE1]
          }
        },
        // \
        0x005c: {
          dir: V,
          HW: [
            [0.69, GENERAL],
            [1.23, SIZE1],
            [1.353, SIZE1, 1.1],
            [1.845, SIZE2],
            [2.048, SIZE2, 1.11],
            [2.46, SIZE3],
            [2.472, SIZE3, 1.005],
            [3.075, SIZE4]
          ]
        },
        // ]
        0x005d: {
          dir: V,
          HW: [
            [0.818, GENERAL],
            [1.23, SIZE1],
            [1.353, SIZE1, 1.1],
            [1.845, SIZE2],
            [2.048, SIZE2, 1.11],
            [2.46, SIZE3],
            [2.472, SIZE3, 1.005],
            [3.075, SIZE4]
          ],
          stretch: {
            top: [0x23a4, SIZE1],
            ext: [0x23a5, SIZE1],
            bot: [0x23a6, SIZE1]
          }
        },
        // {
        0x007b: {
          dir: V,
          HW: [
            [0.861, GENERAL],
            [1.23, SIZE1],
            [1.353, SIZE1, 1.1],
            [1.845, SIZE2],
            [2.048, SIZE2, 1.11],
            [2.46, SIZE3],
            [2.472, SIZE3, 1.005],
            [3.075, SIZE4]
          ],
          stretch: {
            top: [0x23a7, SIZE1],
            mid: [0x23a8, SIZE1],
            bot: [0x23a9, SIZE1],
            ext: [0x23aa, SIZE1]
          }
        },
        // |
        0x007c: {
          dir: V,
          HW: [[0.69, GENERAL]],
          stretch: { ext: [0x2223, GENERAL] }
        },
        // }
        0x007d: {
          dir: V,
          HW: [
            [0.861, GENERAL],
            [1.23, SIZE1],
            [1.353, SIZE1, 1.1],
            [1.845, SIZE2],
            [2.048, SIZE2, 1.11],
            [2.46, SIZE3],
            [2.472, SIZE3, 1.005],
            [3.075, SIZE4]
          ],
          stretch: {
            top: [0x23ab, SIZE1],
            mid: [0x23ac, SIZE1],
            bot: [0x23ad, SIZE1],
            ext: [0x23aa, SIZE1]
          }
        },
        // wide hat
        0x02c6: {
          dir: H,
          HW: [
            [0.333, GENERAL],
            [0.56, SIZE1],
            [0.979, SIZE2],
            [1.46, SIZE3],
            [1.886, SIZE4],
            [2.328, SIZE5]
          ]
        },
        // wide caron
        0x02c7: {
          dir: H,
          HW: [
            [0.333, GENERAL],
            [0.56, SIZE1],
            [0.979, SIZE2],
            [1.46, SIZE3],
            [1.886, SIZE4],
            [2.328, SIZE5]
          ]
        },
        // wide tilde
        0x02dc: {
          dir: H,
          HW: [
            [0.333, GENERAL],
            [0.558, SIZE1],
            [0.978, SIZE2],
            [1.458, SIZE3],
            [1.886, SIZE4],
            [2.328, SIZE5]
          ]
        },
        // double vertical line
        0x2016: {
          dir: V,
          HW: [[0.879, GENERAL]],
          stretch: { ext: [0x2016, GENERAL] }
        },
        // horizontal line
        0x203e: {
          dir: H,
          HW: [[0.5, GENERAL]],
          stretch: { rep: [0x203e, GENERAL] }
        },
        // left arrow
        0x2190: {
          dir: H,
          HW: [[0.926, GENERAL]],
          stretch: { left: [0x2190, GENERAL], rep: ARROWREP }
        },
        // \uparrow
        0x2191: {
          dir: V,
          HW: [[0.818, GENERAL]],
          stretch: { top: [0x2191, GENERAL], ext: [0x23d0, GENERAL] }
        },
        // right arrow
        0x2192: {
          dir: H,
          HW: [[0.926, GENERAL]],
          stretch: { rep: ARROWREP, right: [0x2192, GENERAL] }
        },
        // \downarrow
        0x2193: {
          dir: V,
          HW: [[0.818, GENERAL]],
          stretch: { ext: [0x23d0, GENERAL], bot: [0x2193, GENERAL] }
        },
        // left-right arrow
        0x2194: {
          dir: H,
          HW: [[0.926, GENERAL]],
          stretch: {
            left: [0x2190, GENERAL],
            rep: ARROWREP,
            right: [0x2192, GENERAL]
          }
        },
        // \updownarrow
        0x2195: {
          dir: V,
          HW: [[0.818, GENERAL]],
          stretch: {
            top: [0x2191, GENERAL],
            ext: [0x23d0, GENERAL],
            bot: [0x2193, GENERAL]
          }
        },
        // left double arrow
        0x21d0: {
          dir: H,
          HW: [[0.926, GENERAL]],
          stretch: { left: [0x21d0, GENERAL], rep: [0x3d, GENERAL] }
        },
        // \Uparrow
        0x21d1: {
          dir: V,
          HW: [[0.818, GENERAL]],
          stretch: { top: [0x21d1, GENERAL], ext: [0x2225, GENERAL, 0.082] }
        },
        // right double arrow
        0x21d2: {
          dir: H,
          HW: [[0.926, GENERAL]],
          stretch: { rep: [0x3d, GENERAL], right: [0x21d2, GENERAL] }
        },
        // \Downarrow
        0x21d3: {
          dir: V,
          HW: [[0.818, GENERAL]],
          stretch: { ext: [0x2225, GENERAL, 0.082], bot: [0x21d3, GENERAL] }
        },
        // left-right double arrow
        0x21d4: {
          dir: H,
          HW: [[0.926, GENERAL]],
          stretch: {
            left: [0x21d0, GENERAL],
            rep: [0x3d, GENERAL],
            right: [0x21d2, GENERAL]
          }
        },
        // \Updownarrow
        0x21d5: {
          dir: V,
          HW: [[0.818, GENERAL]],
          stretch: {
            top: [0x21d1, GENERAL],
            ext: [0x2225, GENERAL, 0.082],
            bot: [0x21d3, GENERAL]
          }
        },
        // \surd
        0x221a: {
          dir: V,
          HW: [
            [0.954, "STIXVariants"],
            [1.232, GENERAL],
            [1.847, SIZE1],
            [2.46, SIZE2],
            [3.075, SIZE3]
          ],
          stretch: {
            top: [0xe001, NONUNI],
            ext: [0xe000, NONUNI],
            bot: [0x23b7, SIZE1],
            fullExtenders: true
          }
        },
        // \vert
        0x2223: {
          dir: V,
          HW: [[0.879, GENERAL]],
          stretch: { ext: [0x2223, GENERAL] }
        },
        // \Vert
        0x2225: {
          dir: V,
          HW: [[0.879, GENERAL]],
          stretch: { ext: [0x2225, GENERAL] }
        },
        // \lceil
        0x2308: {
          dir: V,
          HW: [
            [0.926, GENERAL],
            [1.23, SIZE1],
            [1.353, SIZE1, 1.1],
            [1.845, SIZE2],
            [2.048, SIZE2, 1.11],
            [2.46, SIZE3],
            [2.472, SIZE3, 1.005],
            [3.075, SIZE4]
          ],
          stretch: { top: [0x23a1, SIZE1], ext: [0x23a2, SIZE1] }
        },
        // \rceil
        0x2309: {
          dir: V,
          HW: [
            [0.926, GENERAL],
            [1.23, SIZE1],
            [1.353, SIZE1, 1.1],
            [1.845, SIZE2],
            [2.048, SIZE2, 1.11],
            [2.46, SIZE3],
            [2.472, SIZE3, 1.005],
            [3.075, SIZE4]
          ],
          stretch: { top: [0x23a4, SIZE1], ext: [0x23a5, SIZE1] }
        },
        // \lfloor
        0x230a: {
          dir: V,
          HW: [
            [0.926, GENERAL],
            [1.23, SIZE1],
            [1.353, SIZE1, 1.1],
            [1.845, SIZE2],
            [2.048, SIZE2, 1.11],
            [2.46, SIZE3],
            [2.472, SIZE3, 1.005],
            [3.075, SIZE4]
          ],
          stretch: { ext: [0x23a2, SIZE1], bot: [0x23a3, SIZE1] }
        },
        // \rfloor
        0x230b: {
          dir: V,
          HW: [
            [0.926, GENERAL],
            [1.23, SIZE1],
            [1.353, SIZE1, 1.1],
            [1.845, SIZE2],
            [2.048, SIZE2, 1.11],
            [2.46, SIZE3],
            [2.472, SIZE3, 1.005],
            [3.075, SIZE4]
          ],
          stretch: { ext: [0x23a5, SIZE1], bot: [0x23a6, SIZE1] }
        },
        // \bracevert
        0x23aa: {
          dir: V,
          HW: [[1.01, SIZE1]],
          stretch: {
            top: [0x23aa, SIZE1],
            ext: [0x23aa, SIZE1],
            bot: [0x23aa, SIZE1]
          }
        },
        // horizontal line
        0x23af: {
          dir: H,
          HW: [[0.315, GENERAL]],
          stretch: { rep: [0x23af, GENERAL] }
        },
        // \lmoustache
        0x23b0: {
          dir: V,
          HW: [[1.0, SIZE1]],
          stretch: {
            top: [0x23a7, SIZE1],
            ext: [0x23aa, SIZE1],
            bot: [0x23ad, SIZE1]
          }
        },
        // \rmoustache
        0x23b1: {
          dir: V,
          HW: [[1.0, SIZE1]],
          stretch: {
            top: [0x23ab, SIZE1],
            ext: [0x23aa, SIZE1],
            bot: [0x23a9, SIZE1]
          }
        },
        // vertical line extension
        0x23d0: {
          dir: V,
          HW: [
            [0.304, GENERAL],
            [0.69, GENERAL, null, 0x7c],
            [0.879, GENERAL, null, 0x2223]
          ],
          stretch: { ext: [0x2223, GENERAL] }
        },
        // horizontal brace down
        0x23de: {
          dir: H,
          HW: [
            [0.926, SIZE1],
            [1, GENERAL],
            [1.46, SIZE2],
            [1.886, SIZE3],
            [2.328, SIZE4],
            [3.238, SIZE5]
          ],
          stretch: {
            left: [0xe13b, NONUNI],
            mid: [0xe140, NONUNI],
            right: [0xe13c, NONUNI],
            rep: [0xe14a, NONUNI]
          }
        },
        // horizontal brace up
        0x23df: {
          dir: H,
          HW: [
            [0.926, SIZE1],
            [1, GENERAL],
            [1.46, SIZE2],
            [1.886, SIZE3],
            [2.328, SIZE4],
            [3.238, SIZE5]
          ],
          stretch: {
            left: [0xe13d, NONUNI],
            mid: [0xe141, NONUNI],
            right: [0xe13e, NONUNI],
            rep: [0xe14b, NONUNI]
          }
        },
        // \langle
        0x27e8: {
          dir: V,
          HW: [
            [0.926, GENERAL],
            [1.23, SIZE1],
            [1.353, SIZE1, 1.1],
            [1.845, SIZE2],
            [2.048, SIZE2, 1.11],
            [2.46, SIZE3],
            [2.472, SIZE3, 1.005],
            [3.075, SIZE4]
          ]
        },
        // \rangle
        0x27e9: {
          dir: V,
          HW: [
            [0.926, GENERAL],
            [1.23, SIZE1],
            [1.353, SIZE1, 1.1],
            [1.845, SIZE2],
            [2.048, SIZE2, 1.11],
            [2.46, SIZE3],
            [2.472, SIZE3, 1.005],
            [3.075, SIZE4]
          ]
        },
        // \lgroup
        0x27ee: {
          dir: V,
          HW: [[0.853, GENERAL]],
          stretch: {
            top: [0x23a7, SIZE1],
            ext: [0x23aa, SIZE1],
            bot: [0x23a9, SIZE1]
          }
        },
        // \rgroup
        0x27ef: {
          dir: V,
          HW: [[0.853, GENERAL]],
          stretch: {
            top: [0x23ab, SIZE1],
            ext: [0x23aa, SIZE1],
            bot: [0x23ad, SIZE1]
          }
        },
        0x002d: { alias: 0x23af, dir: H }, // minus
        0x005e: { alias: 0x02c6, dir: H }, // wide hat
        0x005f: { alias: 0x23af, dir: H }, // low line
        0x007e: { alias: 0x02dc, dir: H }, // wide tilde
        0x00af: { alias: 0x23af, dir: H }, // macron
        0x02c9: { alias: 0x23af, dir: H }, // macron
        0x0302: { alias: 0x02c6, dir: H }, // wide hat
        0x0303: { alias: 0x02dc, dir: H }, // wide tilde
        0x030c: { alias: 0x02c7, dir: H }, // wide caron
        0x0332: { alias: 0x23af, dir: H }, // combining low line
        0x2015: { alias: 0x23af, dir: H }, // horizontal line
        0x2017: { alias: 0x23af, dir: H }, // horizontal line
        0x20d7: { alias: 0x2192, dir: H }, // combinining over right arrow (vector arrow)
        0x2212: { alias: 0x23af, dir: H }, // minus
        0x2215: { alias: 0x002f, dir: V }, // division slash
        0x2329: { alias: 0x27e8, dir: V }, // langle
        0x232a: { alias: 0x27e9, dir: V }, // rangle
        0x2500: { alias: 0x2212, dir: H }, // horizontal line
        0x2758: { alias: 0x2223, dir: V }, // vertical separator
        0x3008: { alias: 0x27e8, dir: V }, // langle
        0x3009: { alias: 0x27e9, dir: V }, // rangle
        0xfe37: { alias: 0x23de, dir: H }, // horizontal brace down
        0xfe38: { alias: 0x23df, dir: H }, // horizontal brace up

        0x003d: EXTRAH, // equal sign
        0x219e: EXTRAH, // left two-headed arrow
        0x21a0: EXTRAH, // right two-headed arrow
        0x21a4: EXTRAH, // left arrow from bar
        0x21a5: EXTRAV, // up arrow from bar
        0x21a6: EXTRAH, // right arrow from bar
        0x21a7: EXTRAV, // down arrow from bar
        0x21b0: EXTRAV, // up arrow with top leftwards
        0x21b1: EXTRAV, // up arrow with top right
        0x21bc: EXTRAH, // left harpoon with barb up
        0x21bd: EXTRAH, // left harpoon with barb down
        0x21be: EXTRAV, // up harpoon with barb right
        0x21bf: EXTRAV, // up harpoon with barb left
        0x21c0: EXTRAH, // right harpoon with barb up
        0x21c1: EXTRAH, // right harpoon with barb down
        0x21c2: EXTRAV, // down harpoon with barb right
        0x21c3: EXTRAV, // down harpoon with barb left
        0x21da: EXTRAH, // left triple arrow
        0x21db: EXTRAH, // right triple arrow
        0x222b: EXTRAV, // integral
        0x23b4: EXTRAH, // top square bracket
        0x23b5: EXTRAH, // bottom square bracket
        0x23dc: EXTRAH, // top paren
        0x23dd: EXTRAH, // bottom paren
        0x23e0: EXTRAH, // top tortoise shell
        0x23e1: EXTRAH, // bottom tortoise shell
        0x2906: EXTRAH, // leftwards double arrow from bar
        0x2907: EXTRAH, // rightwards double arrow from bar
        0x294e: EXTRAH, // left barb up right barb up harpoon
        0x294f: EXTRAV, // up barb right down barb right harpoon
        0x2950: EXTRAH, // left barb dow right barb down harpoon
        0x2951: EXTRAV, // up barb left down barb left harpoon
        0x295a: EXTRAH, // leftwards harpoon with barb up from bar
        0x295b: EXTRAH, // rightwards harpoon with barb up from bar
        0x295c: EXTRAV, // up harpoon with barb right from bar
        0x295d: EXTRAV, // down harpoon with barb right from bar
        0x295e: EXTRAH, // leftwards harpoon with barb down from bar
        0x295f: EXTRAH, // rightwards harpoon with barb down from bar
        0x2960: EXTRAV, // up harpoon with barb left from bar
        0x2961: EXTRAV, // down harpoon with barb left from bar
        0x2312: { alias: 0x23dc, dir: H }, // arc
        0x2322: { alias: 0x23dc, dir: H }, // frown
        0x2323: { alias: 0x23dd, dir: H }, // smile
        0x27f5: { alias: 0x2190, dir: H }, // long left arrow
        0x27f6: { alias: 0x2192, dir: H }, // long right arrow
        0x27f7: { alias: 0x2194, dir: H }, // long left-right arrow
        0x27f8: { alias: 0x21d0, dir: H }, // long left double arrow
        0x27f9: { alias: 0x21d2, dir: H }, // long right double arrow
        0x27fa: { alias: 0x21d4, dir: H }, // long left-right double arrow
        0x27fb: { alias: 0x21a4, dir: H }, // long left arrow from bar
        0x27fc: { alias: 0x21a6, dir: H }, // long right arrow from bar
        0x27fd: { alias: 0x2906, dir: H }, // long left double arrow from bar
        0x27fe: { alias: 0x2907, dir: H }, // long right double arrow from bar

        0x02c7: EXTRAH, // caron
        0x02cd: EXTRAH, // low macron
        0x02f7: EXTRAH, // low tilde
        0x219f: EXTRAV, // upwards two headed arrow
        0x21a1: EXTRAV, // downwards two headed arrow
        0x21a8: EXTRAV, // up down arrow with base
        0x21a9: EXTRAH, // left hook arrow
        0x21aa: EXTRAH, // right hook arrow
        0x21b2: EXTRAV, // down arrow with tip left
        0x21b3: EXTRAV, // down arrow with tip right
        0x21b4: EXTRAH, // right arrow with corner down
        0x21b5: EXTRAV, // down arrow with corner left
        0x21cb: EXTRAH, // left harpoon over right harpoon
        0x21cc: EXTRAH, // right harpoon over left harpoon
        0x21e0: EXTRAH, // left dashed arrow
        0x21e1: EXTRAV, // up dashed arrow
        0x21e2: EXTRAH, // right dashed arrow
        0x21e3: EXTRAV, // down dahsed arrow
        0x21e4: EXTRAH, // left arrow to bar
        0x21e5: EXTRAH, // right arrow to bar
        0x21fd: EXTRAH, // left open-headed arrow
        0x21fe: EXTRAH, // right open-headed arrow
        0x21ff: EXTRAH, // left right open-headed arrow
        0x27e6: EXTRAV, // left white square bracket
        0x27e7: EXTRAV, // right white square bracket
        0x27ea: EXTRAV, // left double angle bracket
        0x27eb: EXTRAV, // right double angle bracket
        0x290a: EXTRAV, // up triple arrow
        0x290b: EXTRAV, // down triple arrow
        0x2912: EXTRAV, // up arrow to bar
        0x2913: EXTRAV, // down arrow to bar
        0x2952: EXTRAH, // left harpoon with barb up to bar
        0x2953: EXTRAH, // right harpoon with barb up to bar
        0x2954: EXTRAV, // up harpoon with barb right to bar
        0x2955: EXTRAV, // down harpoon with barb right to bar
        0x2956: EXTRAH, // left harpoon with barb down to bar
        0x2957: EXTRAH, // right harpoon with barb down to bar
        0x2958: EXTRAV, // up harpoon with barb left to bar
        0x2959: EXTRAV, // down harpoon with barb left to bar
        0x2980: EXTRAV, // triple vertical bar
        0x2997: EXTRAV, // left balck tortoise shell
        0x2998: EXTRAV // right balck tortoise shell
      }
    }
  });

  HTMLCSS.FONTDATA.FONTS["STIXGeneral"] = {
    directory: "General/Regular",
    family: "STIXGeneral",
    Ranges: [
      [0xa0, 0xff, "Latin1Supplement"],
      [0x100, 0x17f, "LatinExtendedA"],
      [0x180, 0x24f, "LatinExtendedB"],
      [0x250, 0x2af, "IPAExtensions"],
      [0x2b0, 0x2ff, "SpacingModLetters"],
      [0x300, 0x36f, "CombDiacritMarks"],
      [0x370, 0x3ff, "GreekAndCoptic"],
      [0x400, 0x4ff, "Cyrillic"],
      [0x1d00, 0x1dbf, "PhoneticExtensions"],
      [0x1e00, 0x1eff, "LatinExtendedAdditional"],
      [0x2000, 0x206f, "GeneralPunctuation"],
      [0x2070, 0x209f, "SuperAndSubscripts"],
      [0x20a0, 0x20cf, "CurrencySymbols"],
      [0x20d0, 0x20ff, "CombDiactForSymbols"],
      [0x2100, 0x214f, "LetterlikeSymbols"],
      [0x2150, 0x218f, "NumberForms"],
      [0x2190, 0x21ff, "Arrows"],
      [0x2200, 0x22ff, "MathOperators"],
      [0x2300, 0x23ff, "MiscTechnical"],
      [0x2400, 0x243f, "ControlPictures"],
      [0x2460, 0x24ff, "EnclosedAlphanum"],
      [0x2500, 0x257f, "BoxDrawing"],
      [0x2580, 0x259f, "BlockElements"],
      [0x25a0, 0x25ff, "GeometricShapes"],
      [0x2600, 0x26ff, "MiscSymbols"],
      [0x2700, 0x27bf, "Dingbats"],
      [0x27c0, 0x27ef, "MiscMathSymbolsA"],
      [0x27f0, 0x27ff, "SupplementalArrowsA"],
      [0x2900, 0x297f, "SupplementalArrowsB"],
      [0x2980, 0x29ff, "MiscMathSymbolsB"],
      [0x2a00, 0x2aff, "SuppMathOperators"],
      [0x2b00, 0x2bff, "MiscSymbolsAndArrows"],
      [0x3000, 0x303f, "CJK"],
      [0x3040, 0x309f, "Hiragana"],
      [0xa720, 0xa7ff, "LatinExtendedD"],
      [0xfb00, 0xfb4f, "AlphaPresentForms"],
      [0xfff0, 0xffff, "Specials"],
      [0x1d400, 0x1d433, "MathBold"],
      [0x1d434, 0x1d467, "MathItalic"],
      [0x1d468, 0x1d49b, "MathBoldItalic"],
      [0x1d49c, 0x1d4cf, "MathScript"],
      [0x1d4d0, 0x1d503, "MathBoldScript"],
      [0x1d504, 0x1d537, "Fraktur"],
      [0x1d538, 0x1d56b, "BBBold"],
      [0x1d56c, 0x1d59f, "BoldFraktur"],
      [0x1d5a0, 0x1d5d3, "MathSS"],
      [0x1d5d4, 0x1d607, "MathSSBold"],
      [0x1d608, 0x1d63b, "MathSSItalic"],
      [0x1d63c, 0x1d66f, "MathSSItalicBold"],
      [0x1d670, 0x1d6a3, "MathTT"],
      [0x1d6a4, 0x1d6a5, "ij"],
      [0x1d6a8, 0x1d6e1, "GreekBold"],
      [0x1d6e2, 0x1d71b, "GreekItalic"],
      [0x1d71c, 0x1d755, "GreekBoldItalic"],
      [0x1d756, 0x1d78f, "GreekSSBold"],
      [0x1d790, 0x1d7c9, "GreekSSBoldItalic"],
      [0x1d7ce, 0x1d7d7, "MathBold"],
      [0x1d7d8, 0x1d7e1, "BBBold"],
      [0x1d7e2, 0x1d7eb, "MathSS"],
      [0x1d7ec, 0x1d7f6, "MathSSBold"],
      [0x1d7f6, 0x1d7ff, "MathTT"]
    ],
    0x20: [0, 0, 250, 0, 0], // SPACE
    0x21: [676, 9, 333, 130, 236], // EXCLAMATION MARK
    0x22: [676, -431, 408, 77, 331], // QUOTATION MARK
    0x23: [662, 0, 500, 6, 495], // NUMBER SIGN
    0x24: [727, 87, 500, 44, 458], // DOLLAR SIGN
    0x25: [706, 19, 747, 61, 686], // PERCENT SIGN
    0x26: [676, 13, 778, 42, 750], // AMPERSAND
    0x27: [676, -431, 180, 48, 133], // APOSTROPHE
    0x28: [676, 177, 333, 48, 304], // LEFT PARENTHESIS
    0x29: [676, 177, 333, 29, 285], // RIGHT PARENTHESIS
    0x2a: [676, -265, 500, 68, 433], // ASTERISK
    0x2b: [547, 41, 685, 48, 636], // PLUS SIGN
    0x2c: [102, 141, 250, 55, 195], // COMMA
    0x2d: [257, -194, 333, 39, 285], // HYPHEN-MINUS
    0x2e: [100, 11, 250, 70, 181], // FULL STOP
    0x2f: [676, 14, 278, -9, 287], // SOLIDUS
    0x30: [676, 14, 500, 24, 476], // DIGIT ZERO
    0x31: [676, 0, 500, 111, 394], // DIGIT ONE
    0x32: [676, 0, 500, 29, 474], // DIGIT TWO
    0x33: [676, 14, 500, 41, 431], // DIGIT THREE
    0x34: [676, 0, 500, 12, 473], // DIGIT FOUR
    0x35: [688, 14, 500, 31, 438], // DIGIT FIVE
    0x36: [684, 14, 500, 34, 468], // DIGIT SIX
    0x37: [662, 8, 500, 20, 449], // DIGIT SEVEN
    0x38: [676, 14, 500, 56, 445], // DIGIT EIGHT
    0x39: [676, 22, 500, 30, 459], // DIGIT NINE
    0x3a: [459, 11, 278, 81, 192], // COLON
    0x3b: [459, 141, 278, 80, 219], // SEMICOLON
    0x3c: [534, 24, 685, 56, 621], // LESS-THAN SIGN
    0x3d: [386, -120, 685, 48, 637], // EQUALS SIGN
    0x3e: [534, 24, 685, 56, 621], // GREATER-THAN SIGN
    0x3f: [676, 8, 444, 68, 414], // QUESTION MARK
    0x40: [676, 14, 921, 116, 809], // COMMERCIAL AT
    0x41: [674, 0, 722, 15, 707], // LATIN CAPITAL LETTER A
    0x42: [662, 0, 667, 17, 593], // LATIN CAPITAL LETTER B
    0x43: [676, 14, 667, 28, 633], // LATIN CAPITAL LETTER C
    0x44: [662, 0, 722, 16, 685], // LATIN CAPITAL LETTER D
    0x45: [662, 0, 611, 12, 597], // LATIN CAPITAL LETTER E
    0x46: [662, 0, 556, 11, 546], // LATIN CAPITAL LETTER F
    0x47: [676, 14, 722, 32, 709], // LATIN CAPITAL LETTER G
    0x48: [662, 0, 722, 18, 703], // LATIN CAPITAL LETTER H
    0x49: [662, 0, 333, 18, 315], // LATIN CAPITAL LETTER I
    0x4a: [662, 14, 373, -6, 354], // LATIN CAPITAL LETTER J
    0x4b: [662, 0, 722, 33, 723], // LATIN CAPITAL LETTER K
    0x4c: [662, 0, 611, 12, 598], // LATIN CAPITAL LETTER L
    0x4d: [662, 0, 889, 12, 864], // LATIN CAPITAL LETTER M
    0x4e: [662, 11, 722, 12, 707], // LATIN CAPITAL LETTER N
    0x4f: [676, 14, 722, 34, 688], // LATIN CAPITAL LETTER O
    0x50: [662, 0, 557, 16, 542], // LATIN CAPITAL LETTER P
    0x51: [676, 177, 722, 34, 701], // LATIN CAPITAL LETTER Q
    0x52: [662, 0, 667, 17, 660], // LATIN CAPITAL LETTER R
    0x53: [676, 14, 556, 43, 491], // LATIN CAPITAL LETTER S
    0x54: [662, 0, 611, 17, 593], // LATIN CAPITAL LETTER T
    0x55: [662, 14, 722, 14, 705], // LATIN CAPITAL LETTER U
    0x56: [662, 11, 722, 16, 697], // LATIN CAPITAL LETTER V
    0x57: [662, 11, 944, 5, 932], // LATIN CAPITAL LETTER W
    0x58: [662, 0, 722, 10, 704], // LATIN CAPITAL LETTER X
    0x59: [662, 0, 722, 22, 703], // LATIN CAPITAL LETTER Y
    0x5a: [662, 0, 612, 10, 598], // LATIN CAPITAL LETTER Z
    0x5b: [662, 156, 333, 88, 299], // LEFT SQUARE BRACKET
    0x5c: [676, 14, 278, -9, 287], // REVERSE SOLIDUS
    0x5d: [662, 156, 333, 34, 245], // RIGHT SQUARE BRACKET
    0x5e: [662, -297, 469, 24, 446], // CIRCUMFLEX ACCENT
    0x5f: [-75, 125, 500, 0, 500], // LOW LINE
    0x60: [678, -507, 333, 18, 242], // GRAVE ACCENT
    0x61: [460, 10, 444, 37, 442], // LATIN SMALL LETTER A
    0x62: [683, 10, 500, 3, 468], // LATIN SMALL LETTER B
    0x63: [460, 10, 444, 25, 412], // LATIN SMALL LETTER C
    0x64: [683, 10, 500, 27, 491], // LATIN SMALL LETTER D
    0x65: [460, 10, 444, 25, 424], // LATIN SMALL LETTER E
    0x66: [683, 0, 333, 20, 383], // LATIN SMALL LETTER F
    0x67: [460, 218, 500, 28, 470], // LATIN SMALL LETTER G
    0x68: [683, 0, 500, 9, 487], // LATIN SMALL LETTER H
    0x69: [683, 0, 278, 16, 253], // LATIN SMALL LETTER I
    0x6a: [683, 218, 278, -70, 194], // LATIN SMALL LETTER J
    0x6b: [683, 0, 500, 7, 505], // LATIN SMALL LETTER K
    0x6c: [683, 0, 278, 19, 257], // LATIN SMALL LETTER L
    0x6d: [460, 0, 778, 16, 775], // LATIN SMALL LETTER M
    0x6e: [460, 0, 500, 16, 485], // LATIN SMALL LETTER N
    0x6f: [460, 10, 500, 29, 470], // LATIN SMALL LETTER O
    0x70: [460, 217, 500, 5, 470], // LATIN SMALL LETTER P
    0x71: [460, 217, 500, 24, 488], // LATIN SMALL LETTER Q
    0x72: [460, 0, 333, 5, 335], // LATIN SMALL LETTER R
    0x73: [459, 10, 389, 51, 348], // LATIN SMALL LETTER S
    0x74: [579, 10, 278, 13, 279], // LATIN SMALL LETTER T
    0x75: [450, 10, 500, 9, 480], // LATIN SMALL LETTER U
    0x76: [450, 14, 500, 19, 477], // LATIN SMALL LETTER V
    0x77: [450, 14, 722, 21, 694], // LATIN SMALL LETTER W
    0x78: [450, 0, 500, 17, 479], // LATIN SMALL LETTER X
    0x79: [450, 218, 500, 14, 475], // LATIN SMALL LETTER Y
    0x7a: [450, 0, 444, 27, 418], // LATIN SMALL LETTER Z
    0x7b: [680, 181, 480, 100, 350], // LEFT CURLY BRACKET
    0x7c: [676, 14, 200, 67, 133], // VERTICAL LINE
    0x7d: [680, 181, 480, 130, 380], // RIGHT CURLY BRACKET
    0x7e: [325, -183, 541, 40, 502], // TILDE
    0xa0: [0, 0, 250, 0, 0], // NO-BREAK SPACE
    0xa8: [622, -523, 333, 18, 316], // DIAERESIS
    0xac: [393, -115, 600, 48, 552], // NOT SIGN
    0xaf: [601, -547, 333, 11, 322], // MACRON
    0xb1: [502, 87, 685, 48, 637], // PLUS-MINUS SIGN
    0xb7: [310, -199, 250, 70, 181], // MIDDLE DOT
    0xd7: [529, 25, 640, 43, 597], // MULTIPLICATION SIGN
    0xf7: [516, 10, 564, 30, 534], // DIVISION SIGN
    0x131: [460, 0, 278, 16, 253], // LATIN SMALL LETTER DOTLESS I
    0x237: [460, 218, 278, -70, 193], // LATIN SMALL LETTER DOTLESS J
    0x2c6: [674, -507, 333, 11, 322], // MODIFIER LETTER CIRCUMFLEX ACCENT
    0x2c7: [674, -507, 333, 11, 322], // CARON
    0x2c9: [601, -547, 334, 11, 322], // MODIFIER LETTER MACRON
    0x2ca: [679, -509, 333, 93, 320], // MODIFIER LETTER ACUTE ACCENT
    0x2cb: [679, -509, 333, 22, 249], // MODIFIER LETTER GRAVE ACCENT
    0x2d8: [664, -507, 335, 27, 308], // BREVE
    0x2d9: [622, -523, 333, 118, 217], // DOT ABOVE
    0x2dc: [638, -532, 333, 1, 331], // SMALL TILDE
    0x300: [678, -507, 0, -371, -147], // COMBINING GRAVE ACCENT
    0x301: [678, -507, 0, -371, -147], // COMBINING ACUTE ACCENT
    0x302: [674, -507, 0, -386, -75], // COMBINING CIRCUMFLEX ACCENT
    0x303: [638, -532, 0, -395, -65], // COMBINING TILDE
    0x304: [601, -547, 0, -385, -74], // COMBINING MACRON
    0x306: [664, -507, 0, -373, -92], // COMBINING BREVE
    0x307: [622, -523, 0, -280, -181], // COMBINING DOT ABOVE
    0x308: [622, -523, 0, -379, -81], // COMBINING DIAERESIS
    0x30a: [711, -512, 0, -329, -130], // COMBINING RING ABOVE
    0x30b: [678, -507, 0, -401, -22], // COMBINING DOUBLE ACUTE ACCENT
    0x30c: [674, -507, 0, -385, -74], // COMBINING CARON
    0x338: [662, 156, 0, -380, 31], // COMBINING LONG SOLIDUS OVERLAY
    0x393: [662, 0, 587, 11, 577], // GREEK CAPITAL LETTER GAMMA
    0x394: [674, 0, 722, 48, 675], // GREEK CAPITAL LETTER DELTA
    0x398: [676, 14, 722, 34, 688], // GREEK CAPITAL LETTER THETA
    0x39b: [674, 0, 702, 15, 687], // GREEK CAPITAL LETTER LAMDA
    0x39e: [662, 0, 643, 29, 614], // GREEK CAPITAL LETTER XI
    0x3a0: [662, 0, 722, 18, 703], // GREEK CAPITAL LETTER PI
    0x3a3: [662, 0, 624, 30, 600], // GREEK CAPITAL LETTER SIGMA
    0x3a5: [674, 0, 722, 29, 703], // GREEK CAPITAL LETTER UPSILON
    0x3a6: [662, 0, 763, 35, 728], // GREEK CAPITAL LETTER PHI
    0x3a8: [690, 0, 746, 22, 724], // GREEK CAPITAL LETTER PSI
    0x3a9: [676, 0, 744, 29, 715], // GREEK CAPITAL LETTER OMEGA
    0x2020: [676, 149, 500, 59, 442], // DAGGER
    0x2021: [676, 153, 500, 58, 442], // DOUBLE DAGGER
    0x2026: [100, 11, 1000, 111, 888], // HORIZONTAL ELLIPSIS
    0x2032: [678, -402, 289, 75, 214], // PRIME
    0x203e: [820, -770, 500, 0, 500], // OVERLINE
    0x20d7: [760, -548, 0, -453, -17], // COMBINING RIGHT ARROW ABOVE
    0x2111: [695, 34, 762, 45, 711], // BLACK-LETTER CAPITAL I
    0x2118: [547, 217, 826, 52, 799], // SCRIPT CAPITAL P
    0x211c: [704, 22, 874, 50, 829], // BLACK-LETTER CAPITAL R
    0x2135: [677, 13, 682, 43, 634], // ALEF SYMBOL
    0x2190: [449, -58, 926, 71, 857], // LEFTWARDS ARROW
    0x2191: [662, 156, 511, 60, 451], // UPWARDS ARROW
    0x2192: [448, -57, 926, 70, 856], // RIGHTWARDS ARROW
    0x2193: [662, 156, 511, 60, 451], // DOWNWARDS ARROW
    0x2194: [449, -57, 926, 38, 888], // LEFT RIGHT ARROW
    0x2195: [730, 224, 511, 60, 451], // UP DOWN ARROW
    0x2196: [662, 156, 926, 70, 856], // NORTH WEST ARROW
    0x2197: [662, 156, 926, 70, 856], // NORTH EAST ARROW
    0x2198: [662, 156, 926, 70, 856], // SOUTH EAST ARROW
    0x2199: [662, 156, 926, 70, 856], // SOUTH WEST ARROW
    0x21a6: [450, -57, 926, 70, 857], // RIGHTWARDS ARROW FROM BAR
    0x21a9: [553, -57, 926, 70, 856], // LEFTWARDS ARROW WITH HOOK
    0x21aa: [553, -57, 926, 70, 856], // RIGHTWARDS ARROW WITH HOOK
    0x21bc: [494, -220, 955, 54, 901], // LEFTWARDS HARPOON WITH BARB UPWARDS
    0x21bd: [286, -12, 955, 54, 901], // LEFTWARDS HARPOON WITH BARB DOWNWARDS
    0x21c0: [494, -220, 955, 54, 901], // RIGHTWARDS HARPOON WITH BARB UPWARDS
    0x21c1: [286, -12, 955, 54, 901], // RIGHTWARDS HARPOON WITH BARB DOWNWARDS
    0x21cc: [539, 33, 926, 70, 856], // RIGHTWARDS HARPOON OVER LEFTWARDS HARPOON
    0x21d0: [551, 45, 926, 60, 866], // LEFTWARDS DOUBLE ARROW
    0x21d1: [662, 156, 685, 45, 641], // UPWARDS DOUBLE ARROW
    0x21d2: [551, 45, 926, 60, 866], // RIGHTWARDS DOUBLE ARROW
    0x21d3: [662, 156, 685, 45, 641], // DOWNWARDS DOUBLE ARROW
    0x21d4: [517, 10, 926, 20, 906], // LEFT RIGHT DOUBLE ARROW
    0x21d5: [730, 224, 685, 45, 641], // UP DOWN DOUBLE ARROW
    0x2200: [662, 0, 560, 2, 558], // FOR ALL
    0x2202: [668, 11, 471, 40, 471], // PARTIAL DIFFERENTIAL
    0x2203: [662, 0, 560, 73, 487], // THERE EXISTS
    0x2205: [583, 79, 762, 50, 712], // EMPTY SET
    0x2207: [662, 12, 731, 63, 667], // NABLA
    0x2208: [531, 27, 685, 60, 625], // ELEMENT OF
    0x2209: [662, 157, 685, 60, 625], // stix-negated (vert) set membership, variant
    0x220b: [531, 27, 685, 60, 625], // CONTAINS AS MEMBER
    0x220f: [763, 259, 1000, 52, 948], // N-ARY PRODUCT
    0x2210: [763, 259, 1000, 52, 948], // N-ARY COPRODUCT
    0x2211: [763, 259, 914, 58, 856], // N-ARY SUMMATION
    0x2212: [286, -220, 685, 64, 621], // MINUS SIGN
    0x2213: [502, 87, 685, 48, 637], // MINUS-OR-PLUS SIGN
    0x2215: [710, 222, 523, 46, 478], // DIVISION SLASH
    0x2216: [411, -93, 428, 25, 403], // SET MINUS
    0x2217: [471, -33, 523, 67, 457], // ASTERISK OPERATOR
    0x2218: [387, -117, 350, 40, 310], // RING OPERATOR
    0x2219: [387, -117, 350, 40, 310], // BULLET OPERATOR
    0x221a: [973, 259, 928, 112, 963], // SQUARE ROOT
    0x221d: [430, 0, 685, 41, 643], // PROPORTIONAL TO
    0x221e: [430, 0, 926, 70, 854], // INFINITY
    0x2220: [547, 0, 685, 23, 643], // ANGLE
    0x2223: [690, 189, 266, 100, 166], // DIVIDES
    0x2225: [690, 189, 523, 129, 394], // PARALLEL TO
    0x2227: [536, 29, 620, 31, 589], // LOGICAL AND
    0x2228: [536, 29, 620, 31, 589], // LOGICAL OR
    0x2229: [536, 31, 620, 48, 572], // stix-intersection, serifs
    0x222a: [536, 31, 620, 48, 572], // stix-union, serifs
    0x222b: [824, 320, 459, 32, 639], // INTEGRAL
    0x223c: [362, -148, 685, 48, 637], // TILDE OPERATOR
    0x2240: [547, 42, 286, 35, 249], // WREATH PRODUCT
    0x2243: [445, -55, 685, 48, 637], // ASYMPTOTICALLY EQUAL TO
    0x2245: [532, 27, 685, 48, 637], // APPROXIMATELY EQUAL TO
    0x2248: [475, -25, 685, 48, 637], // ALMOST EQUAL TO
    0x224d: [498, -8, 685, 48, 637], // EQUIVALENT TO
    0x2250: [611, -120, 685, 48, 637], // APPROACHES THE LIMIT
    0x2260: [662, 156, 685, 48, 637], // stix-not (vert) equals
    0x2261: [478, -28, 685, 48, 637], // IDENTICAL TO
    0x2264: [609, 103, 685, 64, 629], // LESS-THAN OR EQUAL TO
    0x2265: [609, 103, 685, 64, 629], // GREATER-THAN OR EQUAL TO
    0x226a: [532, 26, 933, 25, 908], // MUCH LESS-THAN
    0x226b: [532, 26, 933, 25, 908], // MUCH GREATER-THAN
    0x227a: [532, 26, 685, 64, 621], // PRECEDES
    0x227b: [532, 26, 685, 64, 621], // SUCCEEDS
    0x227c: [628, 120, 685, 64, 621], // PRECEDES OR EQUAL TO
    0x227d: [629, 119, 685, 64, 621], // SUCCEEDS OR EQUAL TO
    0x2282: [531, 25, 685, 64, 621], // SUBSET OF
    0x2283: [531, 25, 685, 64, 621], // SUPERSET OF
    0x2286: [607, 103, 685, 64, 621], // SUBSET OF OR EQUAL TO
    0x2287: [607, 103, 685, 64, 621], // SUPERSET OF OR EQUAL TO
    0x228e: [536, 31, 620, 48, 572], // MULTISET UNION
    0x2291: [607, 103, 685, 64, 621], // SQUARE IMAGE OF OR EQUAL TO
    0x2292: [607, 103, 685, 64, 621], // SQUARE ORIGINAL OF OR EQUAL TO
    0x2293: [536, 31, 620, 48, 572], // stix-square intersection, serifs
    0x2294: [536, 31, 620, 48, 572], // stix-square union, serifs
    0x2295: [623, 119, 842, 50, 792], // stix-circled plus (with rim)
    0x2296: [623, 119, 842, 50, 792], // CIRCLED MINUS
    0x2297: [623, 119, 842, 50, 792], // stix-circled times (with rim)
    0x2298: [623, 119, 842, 50, 792], // CIRCLED DIVISION SLASH
    0x2299: [583, 79, 762, 50, 712], // CIRCLED DOT OPERATOR
    0x22a2: [662, 0, 685, 64, 621], // RIGHT TACK
    0x22a3: [662, 0, 685, 64, 621], // LEFT TACK
    0x22a4: [662, 0, 685, 48, 637], // DOWN TACK
    0x22a5: [662, 0, 685, 48, 637], // UP TACK
    0x22a8: [662, 0, 685, 64, 621], // TRUE
    0x22c0: [763, 259, 924, 54, 870], // N-ARY LOGICAL AND
    0x22c1: [763, 259, 924, 54, 870], // N-ARY LOGICAL OR
    0x22c2: [778, 254, 924, 94, 830], // N-ARY INTERSECTION
    0x22c3: [768, 264, 924, 94, 830], // N-ARY UNION
    0x22c4: [488, -16, 523, 26, 497], // DIAMOND OPERATOR
    0x22c5: [313, -193, 286, 83, 203], // DOT OPERATOR
    0x22c6: [597, 13, 700, 35, 665], // STAR OPERATOR
    0x22c8: [582, 80, 810, 54, 756], // BOWTIE
    0x22ee: [606, 104, 511, 192, 319], // VERTICAL ELLIPSIS
    0x22ef: [316, -189, 926, 108, 818], // MIDLINE HORIZONTAL ELLIPSIS
    0x22f1: [520, 18, 926, 194, 732], // DOWN RIGHT DIAGONAL ELLIPSIS
    0x2308: [713, 213, 469, 188, 447], // LEFT CEILING
    0x2309: [713, 213, 469, 27, 286], // RIGHT CEILING
    0x230a: [713, 213, 469, 188, 447], // LEFT FLOOR
    0x230b: [713, 213, 469, 27, 286], // RIGHT FLOOR
    0x2322: [360, -147, 1019, 54, 965], // stix-small down curve
    0x2323: [360, -147, 1019, 54, 965], // stix-small up curve
    0x23af: [286, -220, 315, 0, 315], // HORIZONTAL LINE EXTENSION
    0x23d0: [405, -101, 511, 222, 288], // VERTICAL LINE EXTENSION (used to extend arrows)
    0x25b3: [811, 127, 1145, 35, 1110], // WHITE UP-POINTING TRIANGLE
    0x25b9: [555, 50, 660, 80, 605], // WHITE RIGHT-POINTING SMALL TRIANGLE
    0x25bd: [811, 127, 1145, 35, 1110], // WHITE DOWN-POINTING TRIANGLE
    0x25c3: [554, 51, 660, 55, 580], // WHITE LEFT-POINTING SMALL TRIANGLE
    0x25ef: [785, 282, 1207, 70, 1137], // LARGE CIRCLE
    0x2660: [609, 99, 685, 34, 651], // BLACK SPADE SUIT
    0x2661: [603, 105, 685, 34, 651], // WHITE HEART SUIT
    0x2662: [609, 105, 685, 41, 643], // WHITE DIAMOND SUIT
    0x2663: [603, 99, 685, 34, 651], // BLACK CLUB SUIT
    0x266d: [768, 10, 426, 57, 346], // MUSIC FLAT SIGN
    0x266e: [768, 181, 426, 75, 350], // MUSIC NATURAL SIGN
    0x266f: [768, 181, 426, 41, 386], // MUSIC SHARP SIGN
    0x27e8: [713, 213, 400, 77, 335], // MATHEMATICAL LEFT ANGLE BRACKET
    0x27e9: [713, 213, 400, 65, 323], // MATHEMATICAL RIGHT ANGLE BRACKET
    0x27ee: [676, 177, 233, 56, 211], // MATHEMATICAL LEFT FLATTENED PARENTHESIS
    0x27ef: [676, 177, 233, 22, 177], // MATHEMATICAL RIGHT FLATTENED PARENTHESIS
    0x27f5: [449, -58, 1574, 55, 1519], // LONG LEFTWARDS ARROW
    0x27f6: [449, -57, 1574, 55, 1519], // LONG RIGHTWARDS ARROW
    0x27f7: [449, -57, 1574, 55, 1519], // LONG LEFT RIGHT ARROW
    0x27f8: [551, 45, 1574, 55, 1519], // LONG LEFTWARDS DOUBLE ARROW
    0x27f9: [551, 45, 1574, 55, 1519], // LONG RIGHTWARDS DOUBLE ARROW
    0x27fa: [517, 10, 1574, 55, 1519], // LONG LEFT RIGHT DOUBLE ARROW
    0x27fb: [450, -57, 1574, 55, 1519], // LONG LEFTWARDS ARROW FROM BAR
    0x27fc: [450, -57, 1574, 55, 1519], // LONG RIGHTWARDS ARROW FROM BAR
    0x29f5: [710, 222, 523, 46, 478], // REVERSE SOLIDUS OPERATOR
    0x2a00: [763, 259, 1126, 53, 1073], // N-ARY CIRCLED DOT OPERATOR
    0x2a01: [763, 259, 1126, 53, 1073], // N-ARY CIRCLED PLUS OPERATOR
    0x2a02: [763, 259, 1126, 53, 1073], // N-ARY CIRCLED TIMES OPERATOR
    0x2a03: [768, 264, 924, 94, 830], // N-ARY UNION OPERATOR WITH DOT
    0x2a04: [768, 264, 924, 94, 830], // N-ARY UNION OPERATOR WITH PLUS
    0x2a05: [763, 259, 924, 94, 830], // N-ARY SQUARE INTERSECTION OPERATOR
    0x2a06: [763, 259, 924, 94, 830], // N-ARY SQUARE UNION OPERATOR
    0x2a3f: [662, 0, 694, 30, 664], // AMALGAMATION OR COPRODUCT
    0x2aaf: [609, 103, 685, 64, 621], // PRECEDES ABOVE SINGLE-LINE EQUALS SIGN
    0x2ab0: [609, 103, 685, 64, 621] // SUCCEEDS ABOVE SINGLE-LINE EQUALS SIGN
  };

  HTMLCSS.FONTDATA.FONTS["STIXGeneral-bold"] = {
    directory: "General/Bold",
    family: "STIXGeneral",
    weight: "bold",
    Ranges: [
      [0xa0, 0xff, "Latin1Supplement"],
      [0x100, 0x17f, "LatinExtendedA"],
      [0x180, 0x24f, "LatinExtendedB"],
      [0x250, 0x2af, "IPAExtensions"],
      [0x2b0, 0x2ff, "SpacingModLetters"],
      [0x300, 0x36f, "CombDiacritMarks"],
      [0x370, 0x3ff, "GreekAndCoptic"],
      [0x400, 0x4ff, "Cyrillic"],
      [0x1d00, 0x1dbf, "PhoneticExtensions"],
      [0x1e00, 0x1eff, "LatinExtendedAdditional"],
      [0x2000, 0x206f, "GeneralPunctuation"],
      [0x2070, 0x209f, "SuperAndSubscripts"],
      [0x20a0, 0x20cf, "CurrencySymbols"],
      [0x20d0, 0x20ff, "CombDiactForSymbols"],
      [0x2100, 0x214f, "LetterlikeSymbols"],
      [0x2150, 0x218f, "NumberForms"],
      [0x2190, 0x21ff, "Arrows"],
      [0x2200, 0x22ff, "MathOperators"],
      [0x2300, 0x23ff, "MiscTechnical"],
      [0x2400, 0x243f, "ControlPictures"],
      [0x2460, 0x24ff, "EnclosedAlphanum"],
      [0x2500, 0x257f, "BoxDrawing"],
      [0x25a0, 0x25ff, "GeometricShapes"],
      [0x2600, 0x26ff, "MiscSymbols"],
      [0x27c0, 0x27ef, "MiscMathSymbolsA"],
      [0x2980, 0x29ff, "MiscMathSymbolsB"],
      [0x2a00, 0x2aff, "SuppMathOperators"],
      [0xa720, 0xa7ff, "LatinExtendedD"],
      [0xfb00, 0xfb4f, "AlphaPresentForms"],
      [0x1d400, 0x1d433, "MathBold"],
      [0x1d538, 0x1d56b, "BBBold"],
      [0x1d56c, 0x1d59f, "BoldFraktur"],
      [0x1d5d4, 0x1d607, "MathSSBold"],
      [0x1d6a8, 0x1d6e1, "GreekBold"],
      [0x1d756, 0x1d78f, "GreekSSBold"],
      [0x1d7ce, 0x1d7d7, "MathBold"],
      [0x1d7ec, 0x1d7f6, "MathSSBold"]
    ],
    0x20: [0, 0, 250, 0, 0], // SPACE
    0x21: [691, 13, 333, 81, 251], // EXCLAMATION MARK
    0x22: [691, -404, 555, 83, 472], // QUOTATION MARK
    0x23: [700, 0, 500, 5, 495], // NUMBER SIGN
    0x24: [750, 99, 500, 29, 472], // DOLLAR SIGN
    0x25: [706, 29, 749, 61, 688], // PERCENT SIGN
    0x26: [691, 16, 833, 62, 789], // AMPERSAND
    0x27: [691, -404, 278, 75, 204], // APOSTROPHE
    0x28: [694, 168, 333, 46, 306], // LEFT PARENTHESIS
    0x29: [694, 168, 333, 27, 287], // RIGHT PARENTHESIS
    0x2a: [691, -255, 500, 56, 448], // ASTERISK
    0x2b: [563, 57, 750, 65, 685], // PLUS SIGN
    0x2c: [155, 180, 250, 39, 223], // COMMA
    0x2d: [287, -171, 333, 44, 287], // HYPHEN-MINUS
    0x2e: [156, 13, 250, 41, 210], // FULL STOP
    0x2f: [691, 19, 278, -24, 302], // SOLIDUS
    0x30: [688, 13, 500, 24, 476], // DIGIT ZERO
    0x31: [688, 0, 500, 65, 441], // DIGIT ONE
    0x32: [688, 0, 500, 17, 478], // DIGIT TWO
    0x33: [688, 14, 500, 16, 468], // DIGIT THREE
    0x34: [688, 0, 500, 19, 476], // DIGIT FOUR
    0x35: [676, 8, 500, 22, 470], // DIGIT FIVE
    0x36: [688, 13, 500, 28, 475], // DIGIT SIX
    0x37: [676, 0, 500, 17, 477], // DIGIT SEVEN
    0x38: [688, 13, 500, 28, 472], // DIGIT EIGHT
    0x39: [688, 13, 500, 26, 473], // DIGIT NINE
    0x3a: [472, 13, 333, 82, 251], // COLON
    0x3b: [472, 180, 333, 82, 266], // SEMICOLON
    0x3c: [534, 24, 750, 80, 670], // LESS-THAN SIGN
    0x3d: [399, -107, 750, 68, 682], // EQUALS SIGN
    0x3e: [534, 24, 750, 80, 670], // GREATER-THAN SIGN
    0x3f: [689, 13, 500, 57, 445], // QUESTION MARK
    0x40: [691, 19, 930, 108, 822], // COMMERCIAL AT
    0x41: [690, 0, 722, 9, 689], // LATIN CAPITAL LETTER A
    0x42: [676, 0, 667, 16, 619], // LATIN CAPITAL LETTER B
    0x43: [691, 19, 722, 49, 687], // LATIN CAPITAL LETTER C
    0x44: [676, 0, 722, 14, 690], // LATIN CAPITAL LETTER D
    0x45: [676, 0, 667, 16, 641], // LATIN CAPITAL LETTER E
    0x46: [676, 0, 611, 16, 583], // LATIN CAPITAL LETTER F
    0x47: [691, 19, 778, 37, 755], // LATIN CAPITAL LETTER G
    0x48: [676, 0, 778, 21, 759], // LATIN CAPITAL LETTER H
    0x49: [676, 0, 389, 20, 370], // LATIN CAPITAL LETTER I
    0x4a: [676, 96, 500, 3, 478], // LATIN CAPITAL LETTER J
    0x4b: [676, 0, 778, 30, 769], // LATIN CAPITAL LETTER K
    0x4c: [677, 0, 667, 19, 638], // LATIN CAPITAL LETTER L
    0x4d: [676, 0, 944, 14, 921], // LATIN CAPITAL LETTER M
    0x4e: [676, 18, 722, 16, 701], // LATIN CAPITAL LETTER N
    0x4f: [691, 19, 778, 35, 743], // LATIN CAPITAL LETTER O
    0x50: [676, 0, 611, 16, 600], // LATIN CAPITAL LETTER P
    0x51: [691, 176, 778, 35, 743], // LATIN CAPITAL LETTER Q
    0x52: [676, 0, 722, 26, 716], // LATIN CAPITAL LETTER R
    0x53: [692, 19, 556, 35, 513], // LATIN CAPITAL LETTER S
    0x54: [676, 0, 667, 31, 636], // LATIN CAPITAL LETTER T
    0x55: [676, 19, 722, 16, 701], // LATIN CAPITAL LETTER U
    0x56: [676, 18, 722, 16, 701], // LATIN CAPITAL LETTER V
    0x57: [676, 15, 1000, 19, 981], // LATIN CAPITAL LETTER W
    0x58: [676, 0, 722, 16, 699], // LATIN CAPITAL LETTER X
    0x59: [676, 0, 722, 15, 699], // LATIN CAPITAL LETTER Y
    0x5a: [676, 0, 667, 28, 634], // LATIN CAPITAL LETTER Z
    0x5b: [678, 149, 333, 67, 301], // LEFT SQUARE BRACKET
    0x5c: [691, 19, 278, -25, 303], // REVERSE SOLIDUS
    0x5d: [678, 149, 333, 32, 266], // RIGHT SQUARE BRACKET
    0x5e: [676, -311, 581, 73, 509], // CIRCUMFLEX ACCENT
    0x5f: [-75, 125, 500, 0, 500], // LOW LINE
    0x60: [713, -528, 333, 8, 246], // GRAVE ACCENT
    0x61: [473, 14, 500, 25, 488], // LATIN SMALL LETTER A
    0x62: [676, 14, 556, 17, 521], // LATIN SMALL LETTER B
    0x63: [473, 14, 444, 25, 430], // LATIN SMALL LETTER C
    0x64: [676, 14, 556, 25, 534], // LATIN SMALL LETTER D
    0x65: [473, 14, 444, 25, 427], // LATIN SMALL LETTER E
    0x66: [691, 0, 333, 14, 389], // LATIN SMALL LETTER F
    0x67: [473, 206, 500, 28, 483], // LATIN SMALL LETTER G
    0x68: [676, 0, 556, 15, 534], // LATIN SMALL LETTER H
    0x69: [691, 0, 278, 15, 256], // LATIN SMALL LETTER I
    0x6a: [691, 203, 333, -57, 263], // LATIN SMALL LETTER J
    0x6b: [676, 0, 556, 22, 543], // LATIN SMALL LETTER K
    0x6c: [676, 0, 278, 15, 256], // LATIN SMALL LETTER L
    0x6d: [473, 0, 833, 15, 814], // LATIN SMALL LETTER M
    0x6e: [473, 0, 556, 21, 539], // LATIN SMALL LETTER N
    0x6f: [473, 14, 500, 25, 476], // LATIN SMALL LETTER O
    0x70: [473, 205, 556, 19, 524], // LATIN SMALL LETTER P
    0x71: [473, 205, 556, 34, 536], // LATIN SMALL LETTER Q
    0x72: [473, 0, 444, 28, 434], // LATIN SMALL LETTER R
    0x73: [473, 14, 389, 25, 361], // LATIN SMALL LETTER S
    0x74: [630, 12, 333, 19, 332], // LATIN SMALL LETTER T
    0x75: [461, 14, 556, 16, 538], // LATIN SMALL LETTER U
    0x76: [461, 14, 500, 21, 485], // LATIN SMALL LETTER V
    0x77: [461, 14, 722, 23, 707], // LATIN SMALL LETTER W
    0x78: [461, 0, 500, 12, 484], // LATIN SMALL LETTER X
    0x79: [461, 205, 500, 16, 482], // LATIN SMALL LETTER Y
    0x7a: [461, 0, 444, 21, 420], // LATIN SMALL LETTER Z
    0x7b: [698, 175, 394, 22, 340], // LEFT CURLY BRACKET
    0x7c: [691, 19, 220, 66, 154], // VERTICAL LINE
    0x7d: [698, 175, 394, 54, 372], // RIGHT CURLY BRACKET
    0x7e: [333, -173, 520, 29, 491], // TILDE
    0x393: [676, 0, 620, 16, 593], // GREEK CAPITAL LETTER GAMMA
    0x394: [690, 0, 722, 33, 673], // GREEK CAPITAL LETTER DELTA
    0x398: [692, 18, 778, 35, 743], // GREEK CAPITAL LETTER THETA
    0x39b: [690, 0, 707, 9, 674], // GREEK CAPITAL LETTER LAMDA
    0x39e: [676, 0, 647, 40, 607], // GREEK CAPITAL LETTER XI
    0x3a0: [676, 0, 778, 21, 759], // GREEK CAPITAL LETTER PI
    0x3a3: [676, 0, 671, 28, 641], // GREEK CAPITAL LETTER SIGMA
    0x3a5: [692, 0, 703, 7, 693], // GREEK CAPITAL LETTER UPSILON
    0x3a6: [676, 0, 836, 18, 818], // GREEK CAPITAL LETTER PHI
    0x3a8: [692, 0, 808, 15, 797], // GREEK CAPITAL LETTER PSI
    0x3a9: [692, 0, 768, 28, 740] // GREEK CAPITAL LETTER OMEGA
  };

  HTMLCSS.FONTDATA.FONTS["STIXGeneral-italic"] = {
    directory: "General/Italic",
    family: "STIXGeneral",
    style: "italic",
    Ranges: [
      [0xa0, 0xff, "Latin1Supplement"],
      [0x100, 0x17f, "LatinExtendedA"],
      [0x180, 0x24f, "LatinExtendedB"],
      [0x250, 0x2af, "IPAExtensions"],
      [0x2b0, 0x2ff, "SpacingModLetters"],
      [0x370, 0x3ff, "GreekAndCoptic"],
      [0x400, 0x4ff, "Cyrillic"],
      [0x1e00, 0x1eff, "LatinExtendedAdditional"],
      [0x2000, 0x206f, "GeneralPunctuation"],
      [0x20a0, 0x20cf, "CurrencySymbols"],
      [0x20d0, 0x20ff, "CombDiactForSymbols"],
      [0x2100, 0x214f, "LetterlikeSymbols"],
      [0x2200, 0x22ff, "MathOperators"],
      [0x2400, 0x243f, "ControlPictures"],
      [0x2460, 0x24ff, "EnclosedAlphanum"],
      [0x2500, 0x257f, "BoxDrawing"],
      [0xfb00, 0xfb4f, "AlphaPresentForms"],
      [0x1d434, 0x1d467, "MathItalic"],
      [0x1d49c, 0x1d4cf, "MathScript"],
      [0x1d608, 0x1d63b, "MathSSItalic"],
      [0x1d6a4, 0x1d6a5, "ij"],
      [0x1d6e2, 0x1d71b, "GreekItalic"]
    ],
    0x20: [0, 0, 250, 0, 0], // SPACE
    0x21: [667, 11, 333, 39, 304], // EXCLAMATION MARK
    0x22: [666, -421, 420, 144, 432], // QUOTATION MARK
    0x23: [676, 0, 501, 2, 540], // NUMBER SIGN
    0x24: [731, 89, 500, 32, 497], // DOLLAR SIGN
    0x25: [706, 19, 755, 80, 705], // PERCENT SIGN
    0x26: [666, 18, 778, 76, 723], // AMPERSAND
    0x27: [666, -421, 214, 132, 241], // APOSTROPHE
    0x28: [669, 181, 333, 42, 315], // LEFT PARENTHESIS
    0x29: [669, 180, 333, 16, 289], // RIGHT PARENTHESIS
    0x2a: [666, -255, 500, 128, 492], // ASTERISK
    0x2b: [506, 0, 675, 86, 590], // PLUS SIGN
    0x2c: [101, 129, 250, -5, 135], // COMMA
    0x2d: [255, -192, 333, 49, 282], // HYPHEN-MINUS
    0x2e: [100, 11, 250, 27, 138], // FULL STOP
    0x2f: [666, 18, 278, -65, 386], // SOLIDUS
    0x30: [676, 7, 500, 32, 497], // DIGIT ZERO
    0x31: [676, 0, 500, 50, 409], // DIGIT ONE
    0x32: [676, 0, 500, 12, 452], // DIGIT TWO
    0x33: [676, 7, 500, 16, 465], // DIGIT THREE
    0x34: [676, 0, 500, 1, 479], // DIGIT FOUR
    0x35: [666, 7, 500, 15, 491], // DIGIT FIVE
    0x36: [686, 7, 500, 30, 521], // DIGIT SIX
    0x37: [666, 8, 500, 75, 537], // DIGIT SEVEN
    0x38: [676, 7, 500, 30, 493], // DIGIT EIGHT
    0x39: [676, 17, 500, 23, 492], // DIGIT NINE
    0x3a: [441, 11, 333, 50, 261], // COLON
    0x3b: [441, 129, 333, 26, 261], // SEMICOLON
    0x3c: [516, 10, 675, 84, 592], // LESS-THAN SIGN
    0x3d: [386, -120, 675, 86, 590], // EQUALS SIGN
    0x3e: [516, 10, 675, 84, 592], // GREATER-THAN SIGN
    0x3f: [664, 12, 500, 132, 472], // QUESTION MARK
    0x40: [666, 18, 920, 118, 806], // COMMERCIAL AT
    0x41: [668, 0, 611, -51, 564], // LATIN CAPITAL LETTER A
    0x42: [653, 0, 611, -8, 588], // LATIN CAPITAL LETTER B
    0x43: [666, 18, 667, 66, 689], // LATIN CAPITAL LETTER C
    0x44: [653, 0, 722, -8, 700], // LATIN CAPITAL LETTER D
    0x45: [653, 0, 611, -1, 634], // LATIN CAPITAL LETTER E
    0x46: [653, 0, 611, 8, 645], // LATIN CAPITAL LETTER F
    0x47: [666, 18, 722, 52, 722], // LATIN CAPITAL LETTER G
    0x48: [653, 0, 722, -8, 769], // LATIN CAPITAL LETTER H
    0x49: [653, 0, 333, -8, 384], // LATIN CAPITAL LETTER I
    0x4a: [653, 18, 444, -6, 491], // LATIN CAPITAL LETTER J
    0x4b: [653, 0, 667, 7, 722], // LATIN CAPITAL LETTER K
    0x4c: [653, 0, 556, -8, 559], // LATIN CAPITAL LETTER L
    0x4d: [653, 0, 833, -18, 872], // LATIN CAPITAL LETTER M
    0x4e: [653, 15, 667, -20, 727], // LATIN CAPITAL LETTER N
    0x4f: [667, 18, 722, 60, 699], // LATIN CAPITAL LETTER O
    0x50: [653, 0, 611, 0, 605], // LATIN CAPITAL LETTER P
    0x51: [666, 182, 722, 59, 699], // LATIN CAPITAL LETTER Q
    0x52: [653, 0, 611, -13, 588], // LATIN CAPITAL LETTER R
    0x53: [667, 18, 500, 17, 508], // LATIN CAPITAL LETTER S
    0x54: [653, 0, 556, 59, 633], // LATIN CAPITAL LETTER T
    0x55: [653, 18, 722, 102, 765], // LATIN CAPITAL LETTER U
    0x56: [653, 18, 611, 76, 688], // LATIN CAPITAL LETTER V
    0x57: [653, 18, 833, 71, 906], // LATIN CAPITAL LETTER W
    0x58: [653, 0, 611, -29, 655], // LATIN CAPITAL LETTER X
    0x59: [653, 0, 556, 78, 633], // LATIN CAPITAL LETTER Y
    0x5a: [653, 0, 556, -6, 606], // LATIN CAPITAL LETTER Z
    0x5b: [663, 153, 389, 21, 391], // LEFT SQUARE BRACKET
    0x5c: [666, 18, 278, -41, 319], // REVERSE SOLIDUS
    0x5d: [663, 153, 389, 12, 382], // RIGHT SQUARE BRACKET
    0x5e: [666, -301, 422, 0, 422], // CIRCUMFLEX ACCENT
    0x5f: [-75, 125, 500, 0, 500], // LOW LINE
    0x60: [664, -492, 333, 120, 311], // GRAVE ACCENT
    0x61: [441, 11, 501, 17, 476], // LATIN SMALL LETTER A
    0x62: [683, 11, 500, 23, 473], // LATIN SMALL LETTER B
    0x63: [441, 11, 444, 30, 425], // LATIN SMALL LETTER C
    0x64: [683, 13, 500, 15, 527], // LATIN SMALL LETTER D
    0x65: [441, 11, 444, 31, 412], // LATIN SMALL LETTER E
    0x66: [678, 207, 278, -147, 424], // LATIN SMALL LETTER F
    0x67: [441, 206, 500, 8, 471], // LATIN SMALL LETTER G
    0x68: [683, 9, 500, 19, 478], // LATIN SMALL LETTER H
    0x69: [654, 11, 278, 49, 264], // LATIN SMALL LETTER I
    0x6a: [652, 207, 278, -124, 279], // LATIN SMALL LETTER J
    0x6b: [683, 11, 444, 14, 461], // LATIN SMALL LETTER K
    0x6c: [683, 11, 278, 41, 279], // LATIN SMALL LETTER L
    0x6d: [441, 9, 722, 12, 704], // LATIN SMALL LETTER M
    0x6e: [441, 9, 500, 14, 474], // LATIN SMALL LETTER N
    0x6f: [441, 11, 500, 27, 468], // LATIN SMALL LETTER O
    0x70: [441, 205, 504, -75, 472], // LATIN SMALL LETTER P
    0x71: [441, 209, 500, 25, 484], // LATIN SMALL LETTER Q
    0x72: [441, 0, 389, 45, 412], // LATIN SMALL LETTER R
    0x73: [442, 13, 389, 16, 366], // LATIN SMALL LETTER S
    0x74: [546, 11, 278, 38, 296], // LATIN SMALL LETTER T
    0x75: [441, 11, 500, 42, 475], // LATIN SMALL LETTER U
    0x76: [441, 18, 444, 20, 426], // LATIN SMALL LETTER V
    0x77: [441, 18, 667, 15, 648], // LATIN SMALL LETTER W
    0x78: [441, 11, 444, -27, 447], // LATIN SMALL LETTER X
    0x79: [441, 206, 444, -24, 426], // LATIN SMALL LETTER Y
    0x7a: [428, 81, 389, -2, 380], // LATIN SMALL LETTER Z
    0x7b: [687, 177, 400, 51, 407], // LEFT CURLY BRACKET
    0x7c: [666, 18, 275, 105, 171], // VERTICAL LINE
    0x7d: [687, 177, 400, -7, 349], // RIGHT CURLY BRACKET
    0x7e: [323, -183, 541, 40, 502], // TILDE
    0x131: [441, 11, 278, 47, 235], // LATIN SMALL LETTER DOTLESS I
    0x237: [441, 207, 278, -124, 246], // LATIN SMALL LETTER DOTLESS J
    0x393: [653, 0, 611, 8, 645], // GREEK CAPITAL LETTER GAMMA
    0x394: [668, 0, 611, -32, 526], // GREEK CAPITAL LETTER DELTA
    0x398: [667, 18, 722, 60, 699], // GREEK CAPITAL LETTER THETA
    0x39b: [668, 0, 611, -51, 564], // GREEK CAPITAL LETTER LAMDA
    0x39e: [653, 0, 651, -6, 680], // GREEK CAPITAL LETTER XI
    0x3a0: [653, 0, 722, -8, 769], // GREEK CAPITAL LETTER PI
    0x3a3: [653, 0, 620, -6, 659], // GREEK CAPITAL LETTER SIGMA
    0x3a5: [668, 0, 556, 78, 648], // GREEK CAPITAL LETTER UPSILON
    0x3a6: [653, 0, 741, 50, 731], // GREEK CAPITAL LETTER PHI
    0x3a8: [667, 0, 675, 77, 778], // GREEK CAPITAL LETTER PSI
    0x3a9: [666, 0, 762, -6, 739], // GREEK CAPITAL LETTER OMEGA
    0x3b1: [441, 11, 552, 27, 549], // GREEK SMALL LETTER ALPHA
    0x3b2: [678, 205, 506, -40, 514], // GREEK SMALL LETTER BETA
    0x3b3: [435, 206, 410, 19, 438], // GREEK SMALL LETTER GAMMA
    0x3b4: [668, 11, 460, 24, 460], // GREEK SMALL LETTER DELTA
    0x3b5: [441, 11, 444, 30, 425], // GREEK SMALL LETTER EPSILON
    0x3b6: [683, 185, 454, 30, 475], // GREEK SMALL LETTER ZETA
    0x3b7: [441, 205, 474, 14, 442], // GREEK SMALL LETTER ETA
    0x3b8: [678, 11, 480, 27, 494], // GREEK SMALL LETTER THETA
    0x3b9: [441, 11, 278, 49, 235], // GREEK SMALL LETTER IOTA
    0x3ba: [441, 13, 444, 14, 465], // GREEK SMALL LETTER KAPPA
    0x3bb: [678, 16, 458, -12, 431], // GREEK SMALL LETTER LAMDA
    0x3bc: [428, 205, 526, -33, 483], // GREEK SMALL LETTER MU
    0x3bd: [441, 18, 470, 20, 459], // GREEK SMALL LETTER NU
    0x3be: [683, 185, 454, 30, 446], // GREEK SMALL LETTER XI
    0x3bf: [441, 11, 500, 27, 468], // GREEK SMALL LETTER OMICRON
    0x3c0: [428, 18, 504, 19, 536], // GREEK SMALL LETTER PI
    0x3c1: [441, 205, 504, -40, 471], // GREEK SMALL LETTER RHO
    0x3c2: [441, 185, 454, 30, 453], // GREEK SMALL LETTER FINAL SIGMA
    0x3c3: [428, 11, 498, 27, 531], // GREEK SMALL LETTER SIGMA
    0x3c4: [428, 11, 410, 12, 426], // GREEK SMALL LETTER TAU
    0x3c5: [441, 10, 478, 19, 446], // GREEK SMALL LETTER UPSILON
    0x3c6: [441, 205, 622, 27, 590], // GREEK SMALL LETTER PHI
    0x3c7: [441, 207, 457, -108, 498], // GREEK SMALL LETTER CHI
    0x3c8: [441, 205, 584, 15, 668], // GREEK SMALL LETTER PSI
    0x3c9: [439, 11, 686, 27, 654], // GREEK SMALL LETTER OMEGA
    0x3d1: [678, 10, 556, 19, 526], // GREEK THETA SYMBOL
    0x3d5: [683, 205, 627, 27, 595], // GREEK PHI SYMBOL
    0x3d6: [428, 11, 792, 17, 832], // GREEK PI SYMBOL
    0x3f1: [441, 205, 516, 27, 484], // GREEK RHO SYMBOL
    0x3f5: [441, 11, 444, 30, 420], // GREEK LUNATE EPSILON SYMBOL
    0x2113: [687, 11, 579, 48, 571] // SCRIPT SMALL L
  };

  HTMLCSS.FONTDATA.FONTS["STIXIntegralsD"] = {
    directory: "IntegralsD/Regular",
    family: "STIXIntegralsD",
    Ranges: [
      [0x20, 0x20, "All"],
      [0xa0, 0xa0, "All"],
      [0x222b, 0x2233, "All"],
      [0x2a0b, 0x2a1c, "All"]
    ],
    0x222b: [2000, 269, 585, 56, 1035], // INTEGRAL
    0x222e: [2000, 269, 635, 56, 1035] // CONTOUR INTEGRAL
  };

  HTMLCSS.FONTDATA.FONTS["STIXNonUnicode"] = {
    directory: "NonUnicode/Regular",
    family: "STIXNonUnicode",
    Ranges: [
      [0x20, 0x20, "All"],
      [0xa0, 0xa0, "All"],
      [0xe000, 0xf8ff, "PrivateUse"]
    ],
    0xe000: [610, 25, 1184, 829, 895], // stix-radical symbol vertical extender
    0xe001: [667, -41, 1184, 829, 1211], // stix-radical symbol top corner piece
    0xe138: [634, -584, 480, -10, 490], // stix-horizontal extender for multiple character over accent arrows, harpoons, line
    0xe139: [-127, 177, 480, -10, 490], // stix-horizontal extender for multiple character under accent arrows, harpoons, line
    0xe13b: [955, -512, 897, -25, 908], // stix-left end of extensible overbrace (CMEX10 x3A rotated 90deg)
    0xe13c: [955, -512, 897, -11, 922], // stix-right end of extensible overbrace (CMEX10 x38 rotated 90deg)
    0xe13d: [182, 261, 897, -25, 908], // stix-left end of extensible underbrace (CMEX10 x3B rotated 90deg)
    0xe13e: [182, 261, 897, -11, 922], // stix-right end of extensible underbrace (CMEX10 x39 rotated 90deg)
    0xe140: [1218, -820, 1844, -10, 1854], // stix-center of extensible overbrace (CMEX10 x3C rotated 90deg)
    0xe141: [-126, 524, 1844, -10, 1854], // stix-center of extensible underbrace (CMEX10 x3D rotated 90deg)
    0xe14a: [955, -820, 633, -1, 634], // stix-extensible horizontal for over paren or square bracket (CMEX10 x42 rotated 90deg)
    0xe14b: [-126, 261, 633, -1, 634], // stix-extensible horizontal for under paren or square bracket (CMEX10 x43 rotated 90deg)
    0xe261: [422, 10, 523, 41, 481], // stix-old style digit 0
    0xe265: [421, 0, 523, 127, 405], // stix-old style digit 1
    0xe269: [421, 0, 523, 68, 455], // stix-old style digit 2
    0xe26d: [424, 198, 523, 47, 463], // stix-old style digit 3
    0xe271: [420, 198, 523, 58, 480], // stix-old style digit 4
    0xe275: [421, 198, 523, 66, 457], // stix-old style digit 5
    0xe279: [612, 8, 523, 37, 486], // stix-old style digit 6
    0xe27d: [421, 198, 523, 25, 490], // stix-old style digit 7
    0xe281: [606, 12, 523, 47, 477], // stix-old style digit 8
    0xe285: [421, 200, 523, 41, 483], // stix-old style digit 9
    0xe28f: [135, 0, 325, -1, 326], // stix-short horizontal extender at baseline
    0xe290: [135, 0, 633, -1, 634] // stix-long horizontal extender at baseline
  };

  HTMLCSS.FONTDATA.FONTS["STIXNonUnicode-bold"] = {
    directory: "NonUnicode/Bold",
    family: "STIXNonUnicode",
    weight: "bold",
    Ranges: [
      [0x20, 0x20, "All"],
      [0xa0, 0xa0, "All"],
      [0xe000, 0xf8ff, "PrivateUse"]
    ]
  };

  HTMLCSS.FONTDATA.FONTS["STIXNonUnicode-italic"] = {
    directory: "NonUnicode/Italic",
    family: "STIXNonUnicode",
    style: "italic",
    Ranges: [
      [0x20, 0x20, "All"],
      [0xa0, 0xa0, "All"],
      [0xe000, 0xf8ff, "PrivateUse"]
    ],
    0xe22d: [677, 45, 852, 43, 812], // stix-mathematical calligraphic capital A
    0xe22e: [670, 3, 724, 35, 709], // stix-mathematical calligraphic capital B
    0xe22f: [671, 11, 569, 43, 586], // stix-mathematical calligraphic capital C
    0xe230: [662, 0, 801, 34, 788], // stix-mathematical calligraphic capital D
    0xe231: [670, 4, 553, 40, 599], // stix-mathematical calligraphic capital E
    0xe232: [662, 0, 652, 43, 710], // stix-mathematical calligraphic capital F
    0xe233: [671, 131, 580, 40, 580], // stix-mathematical calligraphic capital G
    0xe234: [664, 21, 831, 41, 845], // stix-mathematical calligraphic capital H
    0xe235: [662, 0, 575, 38, 591], // stix-mathematical calligraphic capital I
    0xe236: [662, 120, 632, 31, 785], // stix-mathematical calligraphic capital J
    0xe237: [670, 13, 809, 30, 783], // stix-mathematical calligraphic capital K
    0xe238: [670, 7, 693, 30, 653], // stix-mathematical calligraphic capital L
    0xe239: [671, 45, 1166, 40, 1128], // stix-mathematical calligraphic capital M
    0xe23a: [795, 37, 957, 40, 1064], // stix-mathematical calligraphic capital N
    0xe23b: [669, 10, 737, 38, 729], // stix-mathematical calligraphic capital O
    0xe23c: [662, 0, 667, 38, 709], // stix-mathematical calligraphic capital P
    0xe23d: [671, 131, 744, 43, 704], // stix-mathematical calligraphic capital Q
    0xe23e: [662, 3, 854, 38, 816], // stix-mathematical calligraphic capital R
    0xe23f: [671, 0, 634, 38, 671], // stix-mathematical calligraphic capital S
    0xe240: [721, 0, 509, 41, 730], // stix-mathematical calligraphic capital T
    0xe241: [672, 13, 817, 37, 950], // stix-mathematical calligraphic capital U
    0xe242: [677, 33, 638, 33, 680], // stix-mathematical calligraphic capital V
    0xe243: [685, 32, 956, 33, 998], // stix-mathematical calligraphic capital W
    0xe244: [672, 13, 692, 38, 739], // stix-mathematical calligraphic capital X
    0xe245: [675, 131, 719, 34, 763], // stix-mathematical calligraphic capital Y
    0xe246: [664, 94, 752, 38, 714] // stix-mathematical calligraphic capital Z
  };

  HTMLCSS.FONTDATA.FONTS["STIXSizeOneSym"] = {
    directory: "SizeOneSym/Regular",
    family: "STIXSizeOneSym",
    Ranges: [
      [0x2b0, 0x2ff, "All"],
      [0x300, 0x338, "All"],
      [0x203e, 0x203e, "All"],
      [0x20d0, 0x20ef, "All"],
      [0x2140, 0x2140, "All"],
      [0x221a, 0x221c, "All"],
      [0x2320, 0x2321, "All"],
      [0x239b, 0x23b9, "All"],
      [0x23dc, 0x23e1, "All"],
      [0x2772, 0x2773, "All"],
      [0x27e6, 0x27eb, "All"],
      [0x2983, 0x2986, "All"],
      [0x29f8, 0x29f9, "All"],
      [0x2a00, 0x2a0a, "All"],
      [0x2afc, 0x2aff, "All"]
    ],
    0x20: [0, 0, 250, 0, 0], // SPACE
    0x28: [1066, 164, 468, 139, 382], // LEFT PARENTHESIS
    0x29: [1066, 164, 468, 86, 329], // RIGHT PARENTHESIS
    0x2f: [1066, 164, 579, 25, 552], // SOLIDUS
    0x5b: [1066, 164, 383, 180, 363], // LEFT SQUARE BRACKET
    0x5c: [1066, 164, 579, 27, 552], // REVERSE SOLIDUS
    0x5d: [1066, 164, 383, 20, 203], // RIGHT SQUARE BRACKET
    0x5f: [-127, 177, 1000, 0, 1000], // LOW LINE
    0x7b: [1066, 164, 575, 114, 466], // LEFT CURLY BRACKET
    0x7d: [1066, 164, 575, 109, 461], // RIGHT CURLY BRACKET
    0xa0: [0, 0, 250, 0, 0], // NO-BREAK SPACE
    0x302: [767, -554, 0, -720, -160], // COMBINING CIRCUMFLEX ACCENT
    0x303: [750, -598, 0, -722, -162], // COMBINING TILDE
    0x220f: [1500, -49, 1355, 50, 1305], // N-ARY PRODUCT
    0x2210: [1500, -49, 1355, 50, 1305], // N-ARY COPRODUCT
    0x2211: [1499, -49, 1292, 90, 1202], // N-ARY SUMMATION
    0x221a: [1552, 295, 1057, 112, 1089], // SQUARE ROOT
    0x22c0: [1500, -49, 1265, 60, 1205], // N-ARY LOGICAL AND
    0x22c1: [1500, -49, 1265, 60, 1205], // N-ARY LOGICAL OR
    0x22c2: [1510, -49, 1265, 118, 1147], // N-ARY INTERSECTION
    0x22c3: [1500, -39, 1265, 118, 1147], // N-ARY UNION
    0x2308: [1066, 164, 453, 180, 426], // LEFT CEILING
    0x2309: [1066, 164, 453, 25, 273], // RIGHT CEILING
    0x230a: [1066, 164, 453, 180, 428], // LEFT FLOOR
    0x230b: [1066, 164, 453, 27, 273], // RIGHT FLOOR
    0x239b: [700, 305, 450, 50, 400], // LEFT PARENTHESIS UPPER HOOK
    0x239c: [705, 305, 450, 50, 174], // LEFT PARENTHESIS EXTENSION
    0x239d: [705, 300, 450, 50, 400], // LEFT PARENTHESIS LOWER HOOK
    0x239e: [700, 305, 450, 50, 400], // RIGHT PARENTHESIS UPPER HOOK
    0x239f: [705, 305, 450, 276, 400], // RIGHT PARENTHESIS EXTENSION
    0x23a0: [705, 300, 450, 50, 400], // RIGHT PARENTHESIS LOWER HOOK
    0x23a1: [682, 323, 450, 50, 415], // LEFT SQUARE BRACKET UPPER CORNER
    0x23a2: [687, 323, 450, 50, 150], // LEFT SQUARE BRACKET EXTENSION
    0x23a3: [687, 318, 450, 50, 415], // LEFT SQUARE BRACKET LOWER CORNER
    0x23a4: [682, 323, 450, 35, 400], // RIGHT SQUARE BRACKET UPPER CORNER
    0x23a5: [687, 323, 450, 300, 400], // RIGHT SQUARE BRACKET EXTENSION
    0x23a6: [687, 318, 450, 35, 400], // RIGHT SQUARE BRACKET LOWER CORNER
    0x23a7: [700, 305, 640, 260, 600], // LEFT CURLY BRACKET UPPER HOOK
    0x23a8: [705, 305, 640, 40, 380], // LEFT CURLY BRACKET MIDDLE PIECE
    0x23a9: [705, 300, 640, 260, 600], // LEFT CURLY BRACKET LOWER HOOK
    0x23aa: [705, 305, 640, 260, 380], // CURLY BRACKET EXTENSION
    0x23ab: [700, 305, 640, 40, 380], // RIGHT CURLY BRACKET UPPER HOOK
    0x23ac: [705, 305, 640, 260, 600], // RIGHT CURLY BRACKET MIDDLE PIECE
    0x23ad: [705, 300, 640, 40, 380], // RIGHT CURLY BRACKET LOWER HOOK
    0x23ae: [610, 25, 688, 294, 394], // INTEGRAL EXTENSION
    0x23b0: [700, 301, 600, 35, 566], // UPPER LEFT OR LOWER RIGHT CURLY BRACKET SECTION
    0x23b1: [700, 301, 600, 35, 566], // UPPER RIGHT OR LOWER LEFT CURLY BRACKET SECTION
    0x23b7: [1510, 345, 1184, 112, 895], // RADICAL SYMBOL BOTTOM
    0x23b8: [1566, 289, 721, 0, 66], // LEFT VERTICAL BOX LINE
    0x23b9: [1566, 289, 721, 655, 721], // RIGHT VERTICAL BOX LINE
    0x23de: [136, 89, 926, 0, 925], // TOP CURLY BRACKET (mathematical use)
    0x23df: [789, -564, 926, 0, 925], // BOTTOM CURLY BRACKET (mathematical use)
    0x27e8: [1066, 164, 578, 116, 462], // MATHEMATICAL LEFT ANGLE BRACKET
    0x27e9: [1066, 164, 578, 116, 462], // MATHEMATICAL RIGHT ANGLE BRACKET
    0x2a00: [1500, -49, 1555, 52, 1503], // N-ARY CIRCLED DOT OPERATOR
    0x2a01: [1500, -49, 1555, 52, 1503], // N-ARY CIRCLED PLUS OPERATOR
    0x2a02: [1500, -49, 1555, 52, 1503], // N-ARY CIRCLED TIMES OPERATOR
    0x2a04: [1500, -39, 1265, 118, 1147], // N-ARY UNION OPERATOR WITH PLUS
    0x2a05: [1500, -49, 1153, 82, 1071], // N-ARY SQUARE INTERSECTION OPERATOR
    0x2a06: [1500, -49, 1153, 82, 1071] // N-ARY SQUARE UNION OPERATOR
  };

  HTMLCSS.FONTDATA.FONTS["STIXSizeTwoSym"] = {
    directory: "SizeTwoSym/Regular",
    family: "STIXSizeTwoSym",
    Ranges: [
      [0x2b0, 0x2ff, "All"],
      [0x300, 0x338, "All"],
      [0x203e, 0x203e, "All"],
      [0x20d0, 0x20ef, "All"],
      [0x221a, 0x221c, "All"],
      [0x239b, 0x23b9, "All"],
      [0x23dc, 0x23e1, "All"],
      [0x2772, 0x2773, "All"],
      [0x27e6, 0x27eb, "All"],
      [0x2983, 0x2986, "All"],
      [0x2afc, 0x2aff, "All"]
    ],
    0x20: [0, 0, 250, 0, 0], // SPACE
    0x28: [1566, 279, 589, 139, 503], // LEFT PARENTHESIS
    0x29: [1566, 279, 608, 114, 478], // RIGHT PARENTHESIS
    0x2f: [1566, 279, 806, 25, 781], // SOLIDUS
    0x5b: [1566, 279, 459, 190, 422], // LEFT SQUARE BRACKET
    0x5c: [1566, 279, 806, 25, 781], // REVERSE SOLIDUS
    0x5d: [1566, 279, 459, 37, 269], // RIGHT SQUARE BRACKET
    0x5f: [-127, 177, 1500, 0, 1500], // LOW LINE
    0x7b: [1566, 279, 717, 124, 531], // LEFT CURLY BRACKET
    0x7d: [1566, 279, 717, 186, 593], // RIGHT CURLY BRACKET
    0xa0: [0, 0, 250, 0, 0], // NO-BREAK SPACE
    0x302: [777, -564, 0, -1150, -171], // COMBINING CIRCUMFLEX ACCENT
    0x303: [760, -608, 0, -1152, -173], // COMBINING TILDE
    0x221a: [2056, 404, 1124, 110, 1157], // SQUARE ROOT
    0x2308: [1566, 279, 524, 190, 479], // LEFT CEILING
    0x2309: [1566, 279, 526, 47, 336], // RIGHT CEILING
    0x230a: [1566, 279, 524, 190, 479], // LEFT FLOOR
    0x230b: [1566, 279, 526, 47, 336], // RIGHT FLOOR
    0x23de: [143, 81, 1460, 0, 1460], // TOP CURLY BRACKET (mathematical use)
    0x23df: [797, -573, 1460, 0, 1460], // BOTTOM CURLY BRACKET (mathematical use)
    0x27e8: [1566, 279, 622, 95, 531], // MATHEMATICAL LEFT ANGLE BRACKET
    0x27e9: [1566, 279, 622, 91, 527] // MATHEMATICAL RIGHT ANGLE BRACKET
  };

  HTMLCSS.FONTDATA.FONTS["STIXSizeThreeSym"] = {
    directory: "SizeThreeSym/Regular",
    family: "STIXSizeThreeSym",
    Ranges: [
      [0x2b0, 0x2ff, "All"],
      [0x300, 0x338, "All"],
      [0x203e, 0x203e, "All"],
      [0x20d0, 0x20ef, "All"],
      [0x221a, 0x221c, "All"],
      [0x239b, 0x23b9, "All"],
      [0x23dc, 0x23e1, "All"],
      [0x2772, 0x2773, "All"],
      [0x27e6, 0x27eb, "All"],
      [0x2983, 0x2986, "All"]
    ],
    0x20: [0, 0, 250, 0, 0], // SPACE
    0x28: [2066, 394, 750, 182, 667], // LEFT PARENTHESIS
    0x29: [2066, 394, 750, 83, 568], // RIGHT PARENTHESIS
    0x2f: [2066, 394, 1101, 30, 1071], // SOLIDUS
    0x5b: [2066, 394, 508, 225, 491], // LEFT SQUARE BRACKET
    0x5c: [2066, 394, 1101, 30, 1071], // REVERSE SOLIDUS
    0x5d: [2066, 394, 508, 17, 283], // RIGHT SQUARE BRACKET
    0x5f: [-127, 177, 2000, 0, 2000], // LOW LINE
    0x7b: [2066, 394, 906, 143, 717], // LEFT CURLY BRACKET
    0x7d: [2066, 394, 906, 189, 763], // RIGHT CURLY BRACKET
    0xa0: [0, 0, 250, 0, 0], // NO-BREAK SPACE
    0x302: [777, -564, 0, -1610, -150], // COMBINING CIRCUMFLEX ACCENT
    0x303: [774, -608, 0, -1612, -152], // COMBINING TILDE
    0x221a: [2565, 510, 1076, 112, 1110], // SQUARE ROOT
    0x2308: [2066, 394, 565, 225, 550], // LEFT CEILING
    0x2309: [2066, 394, 565, 15, 340], // RIGHT CEILING
    0x230a: [2066, 394, 565, 225, 550], // LEFT FLOOR
    0x230b: [2066, 394, 565, 15, 340], // RIGHT FLOOR
    0x23de: [157, 86, 1886, 0, 1886], // TOP CURLY BRACKET (mathematical use)
    0x23df: [815, -572, 1886, 0, 1886], // BOTTOM CURLY BRACKET (mathematical use)
    0x27e8: [2066, 394, 765, 96, 670], // MATHEMATICAL LEFT ANGLE BRACKET
    0x27e9: [2066, 394, 765, 95, 669] // MATHEMATICAL RIGHT ANGLE BRACKET
  };

  HTMLCSS.FONTDATA.FONTS["STIXSizeFourSym"] = {
    directory: "SizeFourSym/Regular",
    family: "STIXSizeFourSym",
    Ranges: [
      [0x2b0, 0x2ff, "All"],
      [0x300, 0x338, "All"],
      [0x203e, 0x203e, "All"],
      [0x20d0, 0x20ef, "All"],
      [0x221a, 0x221c, "All"],
      [0x239b, 0x23b9, "All"],
      [0x23dc, 0x23e1, "All"],
      [0x2772, 0x2773, "All"],
      [0x27e6, 0x27eb, "All"],
      [0x2983, 0x2986, "All"]
    ],
    0x20: [0, 0, 250, 0, 0], // SPACE
    0x28: [2566, 509, 808, 124, 732], // LEFT PARENTHESIS
    0x29: [2566, 509, 808, 76, 684], // RIGHT PARENTHESIS
    0x2f: [2566, 509, 1309, 16, 1293], // SOLIDUS
    0x5b: [2566, 509, 661, 295, 634], // LEFT SQUARE BRACKET
    0x5c: [2566, 509, 1309, 16, 1293], // REVERSE SOLIDUS
    0x5d: [2566, 509, 661, 27, 366], // RIGHT SQUARE BRACKET
    0x5f: [-127, 177, 2500, 0, 2500], // LOW LINE
    0x7b: [2566, 509, 1076, 173, 882], // LEFT CURLY BRACKET
    0x7d: [2566, 509, 1076, 194, 903], // RIGHT CURLY BRACKET
    0xa0: [0, 0, 250, 0, 0], // NO-BREAK SPACE
    0x302: [796, -573, 0, -2040, -154], // COMBINING CIRCUMFLEX ACCENT
    0x303: [771, -608, 0, -2040, -154], // COMBINING TILDE
    0x221a: [1510, 345, 1184, 112, 895], // SQUARE ROOT
    0x2308: [2566, 509, 682, 295, 655], // LEFT CEILING
    0x2309: [2566, 509, 682, 27, 387], // RIGHT CEILING
    0x230a: [2566, 509, 682, 295, 655], // LEFT FLOOR
    0x230b: [2566, 509, 682, 27, 387], // RIGHT FLOOR
    0x23de: [175, 90, 2328, 0, 2328], // TOP CURLY BRACKET (mathematical use)
    0x23df: [837, -572, 2328, 0, 2328], // BOTTOM CURLY BRACKET (mathematical use)
    0x27e8: [2566, 509, 908, 113, 796], // MATHEMATICAL LEFT ANGLE BRACKET
    0x27e9: [2566, 509, 908, 112, 795] // MATHEMATICAL RIGHT ANGLE BRACKET
  };

  HTMLCSS.FONTDATA.FONTS["STIXSizeFiveSym"] = {
    directory: "SizeFiveSym/Regular",
    family: "STIXSizeFiveSym",
    Ranges: [
      [0x2b0, 0x2ff, "All"],
      [0x300, 0x338, "All"],
      [0x203e, 0x203e, "All"],
      [0x20d0, 0x20ef, "All"],
      [0x239b, 0x23b9, "All"],
      [0x23dc, 0x23e1, "All"]
    ],
    0x20: [0, 0, 250, 0, 0], // SPACE
    0x5f: [-127, 177, 3000, 0, 3000], // LOW LINE
    0xa0: [0, 0, 250, 0, 0], // NO-BREAK SPACE
    0x302: [816, -572, 0, -2485, -157], // COMBINING CIRCUMFLEX ACCENT
    0x303: [780, -617, 0, -2485, -157], // COMBINING TILDE
    0x23de: [181, 90, 3238, 0, 3238], // TOP CURLY BRACKET (mathematical use)
    0x23df: [844, -573, 3238, 0, 3238] // BOTTOM CURLY BRACKET (mathematical use)
  };

  HTMLCSS.FONTDATA.FONTS["STIXVariants"] = {
    directory: "Variants/Regular",
    family: "STIXVariants",
    Ranges: [
      [0x20, 0x20, "All"],
      [0x77, 0x7c, "All"],
      [0xa0, 0xa0, "All"],
      [0x19b, 0x19b, "All"],
      [0x264, 0x264, "All"],
      [0x2032, 0x2057, "All"],
      [0x2140, 0x2140, "All"],
      [0x2190, 0x2193, "All"],
      [0x21d1, 0x21e2, "All"],
      [0x2205, 0x22ed, "All"],
      [0x2322, 0x2323, "All"],
      [0x2423, 0x2423, "All"],
      [0x25a9, 0x25a9, "All"],
      [0x2a3c, 0x2aee, "All"]
    ],
    0x2032: [565, -28, 340, 44, 295], // PRIME
    0x210f: [683, 10, 579, 47, 547], // stix-/hbar - Planck's over 2pi
    0x2205: [729, 74, 523, 28, 502], // EMPTY SET
    0x2216: [710, 222, 523, 46, 478], // SET MINUS
    0x221a: [943, 11, 737, 67, 767] // SQUARE ROOT
  };

  HTMLCSS.FONTDATA.FONTS["STIXGeneral"][0x2212][0] =
    HTMLCSS.FONTDATA.FONTS["STIXGeneral"][0x002b][0]; // minus is sized as plus
  HTMLCSS.FONTDATA.FONTS["STIXGeneral"][0x2212][1] =
    HTMLCSS.FONTDATA.FONTS["STIXGeneral"][0x002b][1]; // minus is sized as plus
  HTMLCSS.FONTDATA.FONTS["STIXGeneral"][0x22ee][0] += 400; // adjust height for \vdots
  HTMLCSS.FONTDATA.FONTS["STIXGeneral"][0x22f1][0] += 500; // adjust height for \ddots
  HTMLCSS.FONTDATA.FONTS["STIXGeneral"][0x2212][1] += 100; // adjust depth for minus (arrow extender)
  HTMLCSS.FONTDATA.FONTS["STIXGeneral"][0x003d][1] += 100; // adjust depth for = (double arrow extender)
  HTMLCSS.FONTDATA.FONTS["STIXNonUnicode"][0xe14a][0] += 200; // adjust height for brace extender
  HTMLCSS.FONTDATA.FONTS["STIXNonUnicode"][0xe14a][1] += 200; // adjust depth for brace extender
  HTMLCSS.FONTDATA.FONTS["STIXNonUnicode"][0xe14b][0] += 200; // adjust height for brace extender
  HTMLCSS.FONTDATA.FONTS["STIXNonUnicode"][0xe14b][1] += 200; // adjust depth for brace extender
  MathJax.Hub.Register.LoadHook(
    HTMLCSS.fontDir + "/Variants/Regular/All.js",
    function() {
      // monospace mathvariant uses space from STIXVariants, so make it the right size
      HTMLCSS.FONTDATA.FONTS["STIXVariants"][0x20][2] += 275; // fix error in character width
      HTMLCSS.FONTDATA.FONTS["STIXVariants"][0x20][5] = { rfix: 275 }; // fix error in character width
      HTMLCSS.FONTDATA.FONTS["STIXVariants"][0xa0][2] += 275; // fix error in character width
      HTMLCSS.FONTDATA.FONTS["STIXVariants"][0xa0][5] = { rfix: 275 }; // fix error in character width
    }
  );

  //
  //  Add some spacing characters (more will come later)
  //
  MathJax.Hub.Insert(HTMLCSS.FONTDATA.FONTS["STIXGeneral"], {
    0x2000: [0, 0, 500, 0, 0, { space: 1 }], // en quad
    0x2001: [0, 0, 1000, 0, 0, { space: 1 }], // em quad
    0x2002: [0, 0, 500, 0, 0, { space: 1 }], // en space
    0x2003: [0, 0, 1000, 0, 0, { space: 1 }], // em space
    0x2004: [0, 0, 333, 0, 0, { space: 1 }], // 3-per-em space
    0x2005: [0, 0, 250, 0, 0, { space: 1 }], // 4-per-em space
    0x2006: [0, 0, 167, 0, 0, { space: 1 }], // 6-per-em space
    0x2009: [0, 0, 167, 0, 0, { space: 1 }], // thin space
    0x200a: [0, 0, 83, 0, 0, { space: 1 }], // hair space
    0x200b: [0, 0, 0, 0, 0, { space: 1 }] // zero-width space
  });

  MathJax.Hub.Browser.Select({
    MSIE: function(browser) {
      if (!browser.versionAtLeast("8.0") || document.documentMode < 8) {
        var FONTDATA = HTMLCSS.FONTDATA;
        // MSIE Can't access the Spacing Modifier positions
        FONTDATA.REMAP[0x2c9] = 0xaf; // macron
        FONTDATA.REMAP[0x2ca] = 0xb4; // acute
        FONTDATA.REMAP[0x2cb] = 0x60; // grave
        FONTDATA.REMAP[0x2da] = 0xb0; // ring above
        // MSIE can't access Greek block
        FONTDATA.RANGES[5] = FONTDATA.RANGES[4];
        FONTDATA.RANGES[4] = FONTDATA.RANGES[3];
        FONTDATA.RANGES[3] = {
          name: "greek",
          low: 0x03b1,
          high: 0x03f6,
          offset: "GG",
          remap: {
            0x03f5: 26,
            0x03d1: 27,
            0x03f0: 28,
            0x03d5: 29,
            0x03f1: 30,
            0x03d6: 31
          }
        };
        FONTDATA.VARIANT["bold"].offsetGG = 0x1d6c2;
        FONTDATA.VARIANT["bold"].offsetG = 0x1d6a8;
        FONTDATA.VARIANT["italic"].offsetGG = 0x1d6fc;
        FONTDATA.VARIANT["italic"].offsetG = 0x1d6e2;
        FONTDATA.VARIANT["bold-italic"].offsetGG = 0x1d736;
        FONTDATA.VARIANT["bold-italic"].offsetG = 0x1d71c;
      }
    },
    Safari: function(browser) {
      browser.STIXfontBug = browser.versionAtLeast("5.1") && browser.isMac;
    },
    Chrome: function(browser) {
      if (browser.isMac) {
        var match = navigator.appVersion.match(/AppleWebKit\/(\d+)/);
        if (match && parseInt(match[1]) > 534) {
          browser.STIXfontBug = true;
        }
      }
    }
  });

  //
  //  Fix WebKit problem with STIX fonts in OS X Lion
  //
  if (MathJax.Hub.Browser.STIXfontBug) {
    HTMLCSS.FONTDATA.FONTS["STIXGeneral"].family = "STIXGeneral-Regular";
    HTMLCSS.FONTDATA.FONTS["STIXGeneral-italic"].family = "STIXGeneral-Italic";
    delete HTMLCSS.FONTDATA.FONTS["STIXGeneral-italic"].style;
    HTMLCSS.FONTDATA.FONTS["STIXNonUnicode"].family = "STIXNonUnicode-Regular";
    HTMLCSS.FONTDATA.FONTS["STIXNonUnicode-italic"].family =
      "STIXNonUnicode-Italic";
    delete HTMLCSS.FONTDATA.FONTS["STIXNonUnicode-italic"].style;
  }

  //
  //  Check for STIX font version
  //
  var QUEUE = [];

  //
  //  Test for v1.1 rather than v1.0 (double-struck alphabet was moved from
  //  user-defined area in STIXNonUnicode to STIXGeneral math alphabet)
  //
  var DIV = HTMLCSS.Font.div;
  HTML.addElement(
    DIV,
    "span",
    {
      style: {
        display: "inline-block",
        "font-family": "STIXNonUnicode",
        "font-weight": "bold"
      }
    },
    ["\uE38C\uE38C\uE38C\uE38C\uE38C"]
  );
  HTML.addElement(
    DIV,
    "span",
    {
      style: {
        display: "inline-block",
        "font-family": "STIXNonUnicode",
        "font-weight": "bold"
      }
    },
    ["\uE39A\uE39A\uE39A\uE39A\uE39A"]
  );
  if (DIV.lastChild.previousSibling.offsetWidth < DIV.lastChild.offsetWidth) {
    QUEUE.push(["Require", MathJax.Ajax, HTMLCSS.fontDir + "/fontdata-1.0.js"]);
  }
  DIV.removeChild(DIV.lastChild);
  DIV.removeChild(DIV.lastChild);

  //
  //  Text for 1.0-beta version (U+02C56 was added in 1.0)
  //
  if (
    !HTMLCSS.Font.testFont({ family: "STIXSizeOneSym", testString: "\u02C6" })
  ) {
    QUEUE.push([
      "Require",
      MathJax.Ajax,
      HTMLCSS.fontDir + "/fontdata-beta.js"
    ]);
  }

  //
  //  Load any patch files and then call loadComplete()
  //
  QUEUE.push(["loadComplete", MathJax.Ajax, HTMLCSS.fontDir + "/fontdata.js"]);
  MathJax.Callback.Queue.apply(MathJax.Callback, QUEUE);
})(MathJax.OutputJax["HTML-CSS"], MathJax.ElementJax.mml, MathJax.HTML);
