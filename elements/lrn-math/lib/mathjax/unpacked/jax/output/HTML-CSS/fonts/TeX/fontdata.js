/* -*- Mode: Javascript; indent-tabs-mode:nil; js-indent-level: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */

/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/TeX/fontdata.js
 *
 *  Initializes the HTML-CSS OutputJax to use the MathJax TeX fonts
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

(function(HTMLCSS, MML, AJAX) {
  var VERSION = "2.7.5";

  var MAIN = "MathJax_Main",
    BOLD = "MathJax_Main-bold",
    ITALIC = "MathJax_Math-italic",
    AMS = "MathJax_AMS",
    SIZE1 = "MathJax_Size1",
    SIZE2 = "MathJax_Size2",
    SIZE3 = "MathJax_Size3",
    SIZE4 = "MathJax_Size4";
  var H = "H",
    V = "V",
    EXTRAH = { load: "extra", dir: H },
    EXTRAV = { load: "extra", dir: V };
  var ARROWREP = [0x2212, MAIN, 0, 0, 0, -0.31, -0.31]; // remove extra height/depth added below
  var DARROWREP = [0x3d, MAIN, 0, 0, 0, 0, 0.1]; // add depth for arrow extender

  HTMLCSS.Augment({
    FONTDATA: {
      version: VERSION,

      TeX_factor: 1, // TeX em's to font em's
      baselineskip: 1.2,
      lineH: 0.8,
      lineD: 0.2,

      hasStyleChar: true, // char 0xEFFD encodes font style

      FONTS: {
        MathJax_Main: "Main/Regular/Main.js",
        "MathJax_Main-bold": "Main/Bold/Main.js",
        "MathJax_Main-italic": "Main/Italic/Main.js",
        "MathJax_Math-italic": "Math/Italic/Main.js",
        "MathJax_Math-bold-italic": "Math/BoldItalic/Main.js",
        MathJax_Caligraphic: "Caligraphic/Regular/Main.js",
        MathJax_Size1: "Size1/Regular/Main.js",
        MathJax_Size2: "Size2/Regular/Main.js",
        MathJax_Size3: "Size3/Regular/Main.js",
        MathJax_Size4: "Size4/Regular/Main.js",
        MathJax_AMS: "AMS/Regular/Main.js",
        MathJax_Fraktur: "Fraktur/Regular/Main.js",
        "MathJax_Fraktur-bold": "Fraktur/Bold/Main.js",
        MathJax_SansSerif: "SansSerif/Regular/Main.js",
        "MathJax_SansSerif-bold": "SansSerif/Bold/Main.js",
        "MathJax_SansSerif-italic": "SansSerif/Italic/Main.js",
        MathJax_Script: "Script/Regular/Main.js",
        MathJax_Typewriter: "Typewriter/Regular/Main.js",
        "MathJax_Caligraphic-bold": "Caligraphic/Bold/Main.js"
      },

      VARIANT: {
        normal: {
          fonts: [MAIN, SIZE1, AMS],
          offsetG: 0x03b1,
          variantG: "italic",
          remap: {
            0x391: 0x41,
            0x392: 0x42,
            0x395: 0x45,
            0x396: 0x5a,
            0x397: 0x48,
            0x399: 0x49,
            0x39a: 0x4b,
            0x39c: 0x4d,
            0x39d: 0x4e,
            0x39f: 0x4f,
            0x3a1: 0x50,
            0x3a4: 0x54,
            0x3a7: 0x58,
            0x2016: 0x2225,
            0x2216: [0x2216, "-TeX-variant"], // \smallsetminus
            0x210f: [0x210f, "-TeX-variant"], // \hbar
            0x2032: [0x27, "sans-serif-italic"], // HACK: a smaller prime
            0x29f8: [0x002f, MML.VARIANT.ITALIC]
          }
        },
        bold: {
          fonts: [BOLD, SIZE1, AMS],
          bold: true,
          offsetG: 0x03b1,
          variantG: "bold-italic",
          remap: {
            0x391: 0x41,
            0x392: 0x42,
            0x395: 0x45,
            0x396: 0x5a,
            0x397: 0x48,
            0x399: 0x49,
            0x39a: 0x4b,
            0x39c: 0x4d,
            0x39d: 0x4e,
            0x39f: 0x4f,
            0x3a1: 0x50,
            0x3a4: 0x54,
            0x3a7: 0x58,
            0x29f8: [0x002f, "bold-italic"],
            0x2016: 0x2225,
            0x219a: "\u2190\u0338",
            0x219b: "\u2192\u0338",
            0x21ae: "\u2194\u0338",
            0x21cd: "\u21D0\u0338",
            0x21ce: "\u21D4\u0338",
            0x21cf: "\u21D2\u0338",
            0x2204: "\u2203\u0338",
            0x2224: "\u2223\u0338",
            0x2226: "\u2225\u0338",
            0x2241: "\u223C\u0338",
            0x2247: "\u2245\u0338",
            0x226e: "<\u0338",
            0x226f: ">\u0338",
            0x2270: "\u2264\u0338",
            0x2271: "\u2265\u0338",
            0x2280: "\u227A\u0338",
            0x2281: "\u227B\u0338",
            0x2288: "\u2286\u0338",
            0x2289: "\u2287\u0338",
            0x22ac: "\u22A2\u0338",
            0x22ad: "\u22A8\u0338",
            //                         0x22AE:"\u22A9\u0338", 0x22AF:"\u22AB\u0338",
            0x22e0: "\u227C\u0338",
            0x22e1: "\u227D\u0338" //,
            //                         0x22EA:"\u22B2\u0338", 0x22EB:"\u22B3\u0338",
            //                         0x22EC:"\u22B4\u0338", 0x22ED:"\u22B5\u0338"
          }
        },
        italic: {
          fonts: [ITALIC, "MathJax_Main-italic", MAIN, SIZE1, AMS],
          italic: true,
          remap: {
            0x391: 0x41,
            0x392: 0x42,
            0x395: 0x45,
            0x396: 0x5a,
            0x397: 0x48,
            0x399: 0x49,
            0x39a: 0x4b,
            0x39c: 0x4d,
            0x39d: 0x4e,
            0x39f: 0x4f,
            0x3a1: 0x50,
            0x3a4: 0x54,
            0x3a7: 0x58
          }
        },
        "bold-italic": {
          fonts: ["MathJax_Math-bold-italic", BOLD, SIZE1, AMS],
          bold: true,
          italic: true,
          remap: {
            0x391: 0x41,
            0x392: 0x42,
            0x395: 0x45,
            0x396: 0x5a,
            0x397: 0x48,
            0x399: 0x49,
            0x39a: 0x4b,
            0x39c: 0x4d,
            0x39d: 0x4e,
            0x39f: 0x4f,
            0x3a1: 0x50,
            0x3a4: 0x54,
            0x3a7: 0x58
          }
        },
        "double-struck": { fonts: [AMS, MAIN] },
        fraktur: { fonts: ["MathJax_Fraktur", MAIN, SIZE1, AMS] },
        "bold-fraktur": {
          fonts: ["MathJax_Fraktur-bold", BOLD, SIZE1, AMS],
          bold: true
        },
        script: { fonts: ["MathJax_Script", MAIN, SIZE1, AMS] },
        "bold-script": {
          fonts: ["MathJax_Script", BOLD, SIZE1, AMS],
          bold: true
        },
        "sans-serif": { fonts: ["MathJax_SansSerif", MAIN, SIZE1, AMS] },
        "bold-sans-serif": {
          fonts: ["MathJax_SansSerif-bold", BOLD, SIZE1, AMS],
          bold: true
        },
        "sans-serif-italic": {
          fonts: [
            "MathJax_SansSerif-italic",
            "MathJax_Main-italic",
            SIZE1,
            AMS
          ],
          italic: true
        },
        "sans-serif-bold-italic": {
          fonts: [
            "MathJax_SansSerif-italic",
            "MathJax_Main-italic",
            SIZE1,
            AMS
          ],
          bold: true,
          italic: true
        },
        monospace: { fonts: ["MathJax_Typewriter", MAIN, SIZE1, AMS] },
        "-tex-caligraphic": {
          fonts: ["MathJax_Caligraphic", MAIN],
          offsetA: 0x41,
          variantA: "italic"
        },
        "-tex-oldstyle": { fonts: ["MathJax_Caligraphic", MAIN] },
        "-tex-mathit": {
          fonts: ["MathJax_Main-italic", ITALIC, MAIN, SIZE1, AMS],
          italic: true,
          noIC: true,
          remap: {
            0x391: 0x41,
            0x392: 0x42,
            0x395: 0x45,
            0x396: 0x5a,
            0x397: 0x48,
            0x399: 0x49,
            0x39a: 0x4b,
            0x39c: 0x4d,
            0x39d: 0x4e,
            0x39f: 0x4f,
            0x3a1: 0x50,
            0x3a4: 0x54,
            0x3a7: 0x58
          }
        },
        "-TeX-variant": {
          fonts: [AMS, MAIN, SIZE1], // HACK: to get larger prime for \prime
          remap: {
            0x2268: 0xe00c,
            0x2269: 0xe00d,
            0x2270: 0xe011,
            0x2271: 0xe00e,
            0x2a87: 0xe010,
            0x2a88: 0xe00f,
            0x2224: 0xe006,
            0x2226: 0xe007,
            0x2288: 0xe016,
            0x2289: 0xe018,
            0x228a: 0xe01a,
            0x228b: 0xe01b,
            0x2acb: 0xe017,
            0x2acc: 0xe019,
            0x03dc: 0xe008,
            0x03f0: 0xe009,
            0x2216: [0x2216, MML.VARIANT.NORMAL], // \setminus
            0x210f: [0x210f, MML.VARIANT.NORMAL] // \hslash
          }
        },
        "-largeOp": { fonts: [SIZE2, SIZE1, MAIN] },
        "-smallOp": { fonts: [SIZE1, MAIN] },
        "-tex-caligraphic-bold": {
          fonts: [
            "MathJax_Caligraphic-bold",
            "MathJax_Main-bold",
            "MathJax_Main",
            "MathJax_Math",
            "MathJax_Size1"
          ],
          bold: true,
          offsetA: 0x41,
          variantA: "bold-italic"
        },
        "-tex-oldstyle-bold": {
          fonts: [
            "MathJax_Caligraphic-bold",
            "MathJax_Main-bold",
            "MathJax_Main",
            "MathJax_Math",
            "MathJax_Size1"
          ],
          bold: true
        }
      },

      RANGES: [
        { name: "alpha", low: 0x61, high: 0x7a, offset: "A", add: 32 },
        { name: "number", low: 0x30, high: 0x39, offset: "N" },
        { name: "greek", low: 0x03b1, high: 0x03f6, offset: "G" }
      ],

      RULECHAR: 0x2212,

      REMAP: {
        0xa: 0x20, // newline
        0x203e: 0x2c9, // overline
        0x20d0: 0x21bc,
        0x20d1: 0x21c0, // combining left and right harpoons
        0x20d6: 0x2190,
        0x20e1: 0x2194, // combining left arrow and lef-right arrow
        0x20ec: 0x21c1,
        0x20ed: 0x21bd, // combining low right and left harpoons
        0x20ee: 0x2190,
        0x20ef: 0x2192, // combining low left and right arrows
        0x20f0: 0x2a, // combining asterisk
        0xfe37: 0x23de,
        0xfe38: 0x23df, // OverBrace, UnderBrace

        0xb7: 0x22c5, // center dot
        0x2b9: 0x2032, // prime,
        0x3d2: 0x3a5, // Upsilon
        0x2206: 0x394, // increment
        0x2015: 0x2014,
        0x2017: 0x5f, // horizontal bars
        0x2022: 0x2219,
        0x2044: 0x2f, // bullet, fraction slash
        0x2305: 0x22bc,
        0x2306: 0x2a5e, // barwedge, doublebarwedge
        0x25aa: 0x25a0,
        0x25b4: 0x25b2, // blacksquare, blacktriangle
        0x25b5: 0x25b3,
        0x25b8: 0x25b6, // triangle, blacktriangleright
        0x25be: 0x25bc,
        0x25bf: 0x25bd, // blacktriangledown, triangledown
        0x25c2: 0x25c0, // blacktriangleleft
        0x2329: 0x27e8,
        0x232a: 0x27e9, // langle, rangle
        0x3008: 0x27e8,
        0x3009: 0x27e9, // langle, rangle
        0x2758: 0x2223, // VerticalSeparator
        0x2a2f: 0xd7, // cross product

        0x25fb: 0x25a1,
        0x25fc: 0x25a0, // square, blacksquare

        //
        //  Letter-like symbols (that appear elsewhere)
        //
        0x2102: [0x0043, MML.VARIANT.DOUBLESTRUCK],
        //      0x210A: [0x0067,MML.VARIANT.SCRIPT],
        0x210b: [0x0048, MML.VARIANT.SCRIPT],
        0x210c: [0x0048, MML.VARIANT.FRAKTUR],
        0x210d: [0x0048, MML.VARIANT.DOUBLESTRUCK],
        0x210e: [0x0068, MML.VARIANT.ITALIC],
        0x2110: [0x004a, MML.VARIANT.SCRIPT],
        0x2111: [0x0049, MML.VARIANT.FRAKTUR],
        0x2112: [0x004c, MML.VARIANT.SCRIPT],
        0x2115: [0x004e, MML.VARIANT.DOUBLESTRUCK],
        0x2119: [0x0050, MML.VARIANT.DOUBLESTRUCK],
        0x211a: [0x0051, MML.VARIANT.DOUBLESTRUCK],
        0x211b: [0x0052, MML.VARIANT.SCRIPT],
        0x211c: [0x0052, MML.VARIANT.FRAKTUR],
        0x211d: [0x0052, MML.VARIANT.DOUBLESTRUCK],
        0x2124: [0x005a, MML.VARIANT.DOUBLESTRUCK],
        0x2126: [0x03a9, MML.VARIANT.NORMAL],
        0x2128: [0x005a, MML.VARIANT.FRAKTUR],
        0x212c: [0x0042, MML.VARIANT.SCRIPT],
        0x212d: [0x0043, MML.VARIANT.FRAKTUR],
        //      0x212F: [0x0065,MML.VARIANT.SCRIPT],
        0x2130: [0x0045, MML.VARIANT.SCRIPT],
        0x2131: [0x0046, MML.VARIANT.SCRIPT],
        0x2133: [0x004d, MML.VARIANT.SCRIPT],
        //      0x2134: [0x006F,MML.VARIANT.SCRIPT],

        0x2247: 0x2246, // wrong placement of this character
        0x231c: 0x250c,
        0x231d: 0x2510, // wrong placement of \ulcorner, \urcorner
        0x231e: 0x2514,
        0x231f: 0x2518, // wrong placement of \llcorner, \lrcorner

        //
        //  compound symbols not in these fonts
        //
        0x2204: "\u2203\u0338", // \not\exists
        0x220c: "\u220B\u0338", // \not\ni
        0x2244: "\u2243\u0338", // \not\simeq
        0x2249: "\u2248\u0338", // \not\approx
        0x2262: "\u2261\u0338", // \not\equiv
        0x226d: "\u224D\u0338", // \not\asymp
        0x2274: "\u2272\u0338", // \not\lesssim
        0x2275: "\u2273\u0338", // \not\gtrsim
        0x2278: "\u2276\u0338", // \not\lessgtr
        0x2279: "\u2277\u0338", // \not\gtrless
        0x2284: "\u2282\u0338", // \not\subset
        0x2285: "\u2283\u0338", // \not\supset
        0x22e2: "\u2291\u0338", // \not\sqsubseteq
        0x22e3: "\u2292\u0338", // \not\sqsupseteq

        0x2a0c: "\u222C\u222C", // quadruple integral

        0x2033: "\u2032\u2032", // double prime
        0x2034: "\u2032\u2032\u2032", // triple prime
        0x2036: "\u2035\u2035", // double back prime
        0x2037: "\u2035\u2035\u2035", // trile back prime
        0x2057: "\u2032\u2032\u2032\u2032", // quadruple prime
        0x20db: "...", // combining three dots above (only works with mover/under)
        0x20dc: "...." // combining four dots above (only works with mover/under)
      },

      REMAPACCENT: {
        "\u2192": "\u20D7",
        "\u2032": "'",
        "\u2035": "`"
      },
      REMAPACCENTUNDER: {},

      PLANE1MAP: [
        [0x1d400, 0x1d419, 0x41, MML.VARIANT.BOLD],
        [0x1d41a, 0x1d433, 0x61, MML.VARIANT.BOLD],
        [0x1d434, 0x1d44d, 0x41, MML.VARIANT.ITALIC],
        [0x1d44e, 0x1d467, 0x61, MML.VARIANT.ITALIC],
        [0x1d468, 0x1d481, 0x41, MML.VARIANT.BOLDITALIC],
        [0x1d482, 0x1d49b, 0x61, MML.VARIANT.BOLDITALIC],
        [0x1d49c, 0x1d4b5, 0x41, MML.VARIANT.SCRIPT],
        //      [0x1D4B6,0x1D4CF, 0x61, MML.VARIANT.SCRIPT],
        //      [0x1D4D0,0x1D4E9, 0x41, MML.VARIANT.BOLDSCRIPT],
        //      [0x1D4EA,0x1D503, 0x61, MML.VARIANT.BOLDSCRIPT],
        [0x1d504, 0x1d51d, 0x41, MML.VARIANT.FRAKTUR],
        [0x1d51e, 0x1d537, 0x61, MML.VARIANT.FRAKTUR],
        [0x1d538, 0x1d551, 0x41, MML.VARIANT.DOUBLESTRUCK],
        //      [0x1D552,0x1D56B, 0x61, MML.VARIANT.DOUBLESTRUCK],
        [0x1d56c, 0x1d585, 0x41, MML.VARIANT.BOLDFRAKTUR],
        [0x1d586, 0x1d59f, 0x61, MML.VARIANT.BOLDFRAKTUR],
        [0x1d5a0, 0x1d5b9, 0x41, MML.VARIANT.SANSSERIF],
        [0x1d5ba, 0x1d5d3, 0x61, MML.VARIANT.SANSSERIF],
        [0x1d5d4, 0x1d5ed, 0x41, MML.VARIANT.BOLDSANSSERIF],
        [0x1d5ee, 0x1d607, 0x61, MML.VARIANT.BOLDSANSSERIF],
        [0x1d608, 0x1d621, 0x41, MML.VARIANT.SANSSERIFITALIC],
        [0x1d622, 0x1d63b, 0x61, MML.VARIANT.SANSSERIFITALIC],
        //      [0x1D63C,0x1D655, 0x41, MML.VARIANT.SANSSERIFBOLDITALIC],
        //      [0x1D656,0x1D66F, 0x61, MML.VARIANT.SANSSERIFBOLDITALIC],
        [0x1d670, 0x1d689, 0x41, MML.VARIANT.MONOSPACE],
        [0x1d68a, 0x1d6a3, 0x61, MML.VARIANT.MONOSPACE],

        [0x1d6a8, 0x1d6c1, 0x391, MML.VARIANT.BOLD],
        //      [0x1D6C2,0x1D6E1, 0x3B1, MML.VARIANT.BOLD],
        [0x1d6e2, 0x1d6fa, 0x391, MML.VARIANT.ITALIC],
        [0x1d6fc, 0x1d71b, 0x3b1, MML.VARIANT.ITALIC],
        [0x1d71c, 0x1d734, 0x391, MML.VARIANT.BOLDITALIC],
        [0x1d736, 0x1d755, 0x3b1, MML.VARIANT.BOLDITALIC],
        [0x1d756, 0x1d76e, 0x391, MML.VARIANT.BOLDSANSSERIF],
        //      [0x1D770,0x1D78F, 0x3B1, MML.VARIANT.BOLDSANSSERIF],
        [0x1d790, 0x1d7a8, 0x391, MML.VARIANT.SANSSERIFBOLDITALIC],
        //      [0x1D7AA,0x1D7C9, 0x3B1, MML.VARIANT.SANSSERIFBOLDITALIC],

        [0x1d7ce, 0x1d7d7, 0x30, MML.VARIANT.BOLD],
        //      [0x1D7D8,0x1D7E1, 0x30, MML.VARIANT.DOUBLESTRUCK],
        [0x1d7e2, 0x1d7eb, 0x30, MML.VARIANT.SANSSERIF],
        [0x1d7ec, 0x1d7f5, 0x30, MML.VARIANT.BOLDSANSSERIF],
        [0x1d7f6, 0x1d7ff, 0x30, MML.VARIANT.MONOSPACE]
      ],

      REMAPGREEK: {
        0x391: 0x41,
        0x392: 0x42,
        0x395: 0x45,
        0x396: 0x5a,
        0x397: 0x48,
        0x399: 0x49,
        0x39a: 0x4b,
        0x39c: 0x4d,
        0x39d: 0x4e,
        0x39f: 0x4f,
        0x3a1: 0x50,
        0x3a2: 0x398,
        0x3a4: 0x54,
        0x3a7: 0x58,
        0x3aa: 0x2207,
        0x3ca: 0x2202,
        0x3cb: 0x3f5,
        0x3cc: 0x3d1,
        0x3cd: 0x3f0,
        0x3ce: 0x3d5,
        0x3cf: 0x3f1,
        0x3d0: 0x3d6
      },

      RemapPlane1: function(n, variant) {
        for (var i = 0, m = this.PLANE1MAP.length; i < m; i++) {
          if (n < this.PLANE1MAP[i][0]) break;
          if (n <= this.PLANE1MAP[i][1]) {
            n = n - this.PLANE1MAP[i][0] + this.PLANE1MAP[i][2];
            if (this.REMAPGREEK[n]) {
              n = this.REMAPGREEK[n];
            }
            variant = this.VARIANT[this.PLANE1MAP[i][3]];
            break;
          }
        }
        return { n: n, variant: variant };
      },

      DELIMITERS: {
        // (
        0x0028: {
          dir: V,
          HW: [
            [1, MAIN],
            [1.2, SIZE1],
            [1.8, SIZE2],
            [2.4, SIZE3],
            [3.0, SIZE4]
          ],
          stretch: {
            top: [0x239b, SIZE4],
            ext: [0x239c, SIZE4],
            bot: [0x239d, SIZE4]
          }
        },
        // )
        0x0029: {
          dir: V,
          HW: [
            [1, MAIN],
            [1.2, SIZE1],
            [1.8, SIZE2],
            [2.4, SIZE3],
            [3.0, SIZE4]
          ],
          stretch: {
            top: [0x239e, SIZE4],
            ext: [0x239f, SIZE4],
            bot: [0x23a0, SIZE4]
          }
        },
        // /
        0x002f: {
          dir: V,
          HW: [
            [1, MAIN],
            [1.2, SIZE1],
            [1.8, SIZE2],
            [2.4, SIZE3],
            [3.0, SIZE4]
          ]
        },
        // [
        0x005b: {
          dir: V,
          HW: [
            [1, MAIN],
            [1.2, SIZE1],
            [1.8, SIZE2],
            [2.4, SIZE3],
            [3.0, SIZE4]
          ],
          stretch: {
            top: [0x23a1, SIZE4],
            ext: [0x23a2, SIZE4],
            bot: [0x23a3, SIZE4]
          }
        },
        // \
        0x005c: {
          dir: V,
          HW: [
            [1, MAIN],
            [1.2, SIZE1],
            [1.8, SIZE2],
            [2.4, SIZE3],
            [3.0, SIZE4]
          ]
        },
        // ]
        0x005d: {
          dir: V,
          HW: [
            [1, MAIN],
            [1.2, SIZE1],
            [1.8, SIZE2],
            [2.4, SIZE3],
            [3.0, SIZE4]
          ],
          stretch: {
            top: [0x23a4, SIZE4],
            ext: [0x23a5, SIZE4],
            bot: [0x23a6, SIZE4]
          }
        },
        // {
        0x007b: {
          dir: V,
          HW: [
            [1, MAIN],
            [1.2, SIZE1],
            [1.8, SIZE2],
            [2.4, SIZE3],
            [3.0, SIZE4]
          ],
          stretch: {
            top: [0x23a7, SIZE4],
            mid: [0x23a8, SIZE4],
            bot: [0x23a9, SIZE4],
            ext: [0x23aa, SIZE4]
          }
        },
        // |
        0x007c: {
          dir: V,
          HW: [[1, MAIN]],
          stretch: { ext: [0x2223, MAIN] }
        },
        // }
        0x007d: {
          dir: V,
          HW: [
            [1, MAIN],
            [1.2, SIZE1],
            [1.8, SIZE2],
            [2.4, SIZE3],
            [3.0, SIZE4]
          ],
          stretch: {
            top: [0x23ab, SIZE4],
            mid: [0x23ac, SIZE4],
            bot: [0x23ad, SIZE4],
            ext: [0x23aa, SIZE4]
          }
        },
        // macron
        0x00af: {
          dir: H,
          HW: [[0.59, MAIN]],
          stretch: { rep: [0xaf, MAIN] }
        },
        // wide hat
        0x02c6: {
          dir: H,
          HW: [
            [0.267 + 0.25, MAIN],
            [0.567 + 0.25, SIZE1],
            [1.005 + 0.33, SIZE2],
            [1.447 + 0.33, SIZE3],
            [1.909, SIZE4]
          ]
        },
        // wide tilde
        0x02dc: {
          dir: H,
          HW: [
            [0.333 + 0.25, MAIN],
            [0.555 + 0.25, SIZE1],
            [1 + 0.33, SIZE2],
            [1.443 + 0.33, SIZE3],
            [1.887, SIZE4]
          ]
        },
        // en-dash
        0x2013: {
          dir: H,
          HW: [[0.5, MAIN]],
          stretch: { rep: [0x2013, MAIN] }
        },
        // vertical arrow extension
        0x2016: {
          dir: V,
          HW: [[0.602, SIZE1], [1, MAIN, null, 0x2225]],
          stretch: { ext: [0x2225, MAIN] }
        },
        // left arrow
        0x2190: {
          dir: H,
          HW: [[1, MAIN]],
          stretch: { left: [0x2190, MAIN], rep: ARROWREP }
        },
        // \uparrow
        0x2191: {
          dir: V,
          HW: [[0.888, MAIN]],
          stretch: { top: [0x2191, SIZE1], ext: [0x23d0, SIZE1] }
        },
        // right arrow
        0x2192: {
          dir: H,
          HW: [[1, MAIN]],
          stretch: { rep: ARROWREP, right: [0x2192, MAIN] }
        },
        // \downarrow
        0x2193: {
          dir: V,
          HW: [[0.888, MAIN]],
          stretch: { ext: [0x23d0, SIZE1], bot: [0x2193, SIZE1] }
        },
        // left-right arrow
        0x2194: {
          dir: H,
          HW: [[1, MAIN]],
          stretch: {
            left: [0x2190, MAIN],
            rep: ARROWREP,
            right: [0x2192, MAIN]
          }
        },
        // \updownarrow
        0x2195: {
          dir: V,
          HW: [[1.044, MAIN]],
          stretch: {
            top: [0x2191, SIZE1],
            ext: [0x23d0, SIZE1],
            bot: [0x2193, SIZE1]
          }
        },
        // left double arrow
        0x21d0: {
          dir: H,
          HW: [[1, MAIN]],
          stretch: { left: [0x21d0, MAIN], rep: DARROWREP }
        },
        // \Uparrow
        0x21d1: {
          dir: V,
          HW: [[0.888, MAIN]],
          stretch: { top: [0x21d1, SIZE1], ext: [0x2016, SIZE1] }
        },
        // right double arrow
        0x21d2: {
          dir: H,
          HW: [[1, MAIN]],
          stretch: { rep: DARROWREP, right: [0x21d2, MAIN] }
        },
        // \Downarrow
        0x21d3: {
          dir: V,
          HW: [[0.888, MAIN]],
          stretch: { ext: [0x2016, SIZE1], bot: [0x21d3, SIZE1] }
        },
        // left-right double arrow
        0x21d4: {
          dir: H,
          HW: [[1, MAIN]],
          stretch: {
            left: [0x21d0, MAIN],
            rep: DARROWREP,
            right: [0x21d2, MAIN]
          }
        },
        // \Updownarrow
        0x21d5: {
          dir: V,
          HW: [[1.044, MAIN]],
          stretch: {
            top: [0x21d1, SIZE1],
            ext: [0x2016, SIZE1],
            bot: [0x21d3, SIZE1]
          }
        },
        // horizontal line
        0x2212: {
          dir: H,
          HW: [[0.5, MAIN, 0, 0x2013]],
          stretch: { rep: ARROWREP }
        },
        // \surd
        0x221a: {
          dir: V,
          HW: [[1, MAIN], [1.2, SIZE1], [1.8, SIZE2], [2.4, SIZE3], [3, SIZE4]],
          stretch: {
            top: [0xe001, SIZE4],
            ext: [0xe000, SIZE4],
            bot: [0x23b7, SIZE4],
            fullExtenders: true
          }
        },
        // \vert
        0x2223: {
          dir: V,
          HW: [[1, MAIN]],
          stretch: { ext: [0x2223, MAIN] }
        },
        // \Vert
        0x2225: {
          dir: V,
          HW: [[1, MAIN]],
          stretch: { ext: [0x2225, MAIN] }
        },
        // \lceil
        0x2308: {
          dir: V,
          HW: [
            [1, MAIN],
            [1.2, SIZE1],
            [1.8, SIZE2],
            [2.4, SIZE3],
            [3.0, SIZE4]
          ],
          stretch: { top: [0x23a1, SIZE4], ext: [0x23a2, SIZE4] }
        },
        // \rceil
        0x2309: {
          dir: V,
          HW: [
            [1, MAIN],
            [1.2, SIZE1],
            [1.8, SIZE2],
            [2.4, SIZE3],
            [3.0, SIZE4]
          ],
          stretch: { top: [0x23a4, SIZE4], ext: [0x23a5, SIZE4] }
        },
        // \lfloor
        0x230a: {
          dir: V,
          HW: [
            [1, MAIN],
            [1.2, SIZE1],
            [1.8, SIZE2],
            [2.4, SIZE3],
            [3.0, SIZE4]
          ],
          stretch: { ext: [0x23a2, SIZE4], bot: [0x23a3, SIZE4] }
        },
        // \rfloor
        0x230b: {
          dir: V,
          HW: [
            [1, MAIN],
            [1.2, SIZE1],
            [1.8, SIZE2],
            [2.4, SIZE3],
            [3.0, SIZE4]
          ],
          stretch: { ext: [0x23a5, SIZE4], bot: [0x23a6, SIZE4] }
        },
        // \bracevert
        0x23aa: {
          dir: V,
          HW: [[0.32, SIZE4]],
          stretch: {
            top: [0x23aa, SIZE4],
            ext: [0x23aa, SIZE4],
            bot: [0x23aa, SIZE4]
          }
        },
        // \lmoustache
        0x23b0: {
          dir: V,
          HW: [[0.989, MAIN]],
          stretch: {
            top: [0x23a7, SIZE4],
            ext: [0x23aa, SIZE4],
            bot: [0x23ad, SIZE4]
          }
        },
        // \rmoustache
        0x23b1: {
          dir: V,
          HW: [[0.989, MAIN]],
          stretch: {
            top: [0x23ab, SIZE4],
            ext: [0x23aa, SIZE4],
            bot: [0x23a9, SIZE4]
          }
        },
        // vertical line extension
        0x23d0: {
          dir: V,
          HW: [[0.602, SIZE1], [1, MAIN, null, 0x2223]],
          stretch: { ext: [0x2223, MAIN] }
        },
        // horizontal brace down
        0x23de: {
          dir: H,
          HW: [],
          stretch: {
            min: 0.9,
            left: [0xe150, SIZE4],
            mid: [[0xe153, 0xe152], SIZE4],
            right: [0xe151, SIZE4],
            rep: [0xe154, SIZE4]
          }
        },
        // horizontal brace up
        0x23df: {
          dir: H,
          HW: [],
          stretch: {
            min: 0.9,
            left: [0xe152, SIZE4],
            mid: [[0xe151, 0xe150], SIZE4],
            right: [0xe153, SIZE4],
            rep: [0xe154, SIZE4]
          }
        },
        // \langle
        0x27e8: {
          dir: V,
          HW: [
            [1, MAIN],
            [1.2, SIZE1],
            [1.8, SIZE2],
            [2.4, SIZE3],
            [3.0, SIZE4]
          ]
        },
        // \rangle
        0x27e9: {
          dir: V,
          HW: [
            [1, MAIN],
            [1.2, SIZE1],
            [1.8, SIZE2],
            [2.4, SIZE3],
            [3.0, SIZE4]
          ]
        },
        // \lgroup
        0x27ee: {
          dir: V,
          HW: [[0.989, MAIN]],
          stretch: {
            top: [0x23a7, SIZE4],
            ext: [0x23aa, SIZE4],
            bot: [0x23a9, SIZE4]
          }
        },
        // \rgroup
        0x27ef: {
          dir: V,
          HW: [[0.989, MAIN]],
          stretch: {
            top: [0x23ab, SIZE4],
            ext: [0x23aa, SIZE4],
            bot: [0x23ad, SIZE4]
          }
        },
        0x002d: { alias: 0x2212, dir: H }, // minus
        0x005e: { alias: 0x02c6, dir: H }, // wide hat
        0x005f: { alias: 0x2013, dir: H }, // low line
        0x007e: { alias: 0x02dc, dir: H }, // wide tilde
        0x02c9: { alias: 0x00af, dir: H }, // macron
        0x0302: { alias: 0x02c6, dir: H }, // wide hat
        0x0303: { alias: 0x02dc, dir: H }, // wide tilde
        0x030c: { alias: 0x02c7, dir: H }, // wide caron
        0x0332: { alias: 0x2013, dir: H }, // combining low line
        0x2014: { alias: 0x2013, dir: H }, // em-dash
        0x2015: { alias: 0x2013, dir: H }, // horizontal line
        0x2017: { alias: 0x2013, dir: H }, // horizontal line
        0x203e: { alias: 0x00af, dir: H }, // overline
        0x20d7: { alias: 0x2192, dir: H }, // combinining over right arrow (vector arrow)
        0x2215: { alias: 0x002f, dir: V }, // division slash
        0x2329: { alias: 0x27e8, dir: V }, // langle
        0x232a: { alias: 0x27e9, dir: V }, // rangle
        0x23af: { alias: 0x2013, dir: H }, // horizontal line extension
        0x2500: { alias: 0x2013, dir: H }, // horizontal line
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
        0x27fe: { alias: 0x2907, dir: H } // long right double arrow from bar
      }
    }
  });

  //
  //  Handle error with reversed glyphs for \bigcap and \bigcup in version 1 of fonts
  //
  HTMLCSS.Font.oldLoadComplete = HTMLCSS.Font.loadComplete;
  HTMLCSS.Font.loadComplete = function(font, n, done, status) {
    if (n != null) {
      this.oldLoadComplete(font, n, done, status);
    }
    if (font.family === SIZE1 || font.family === SIZE2) {
      if (font.version === 1) {
        HTMLCSS.FONTDATA.VARIANT["-largeOp"].remap = {
          0x22c2: 0x22c3,
          0x22c3: 0x22c2
        };
        HTMLCSS.FONTDATA.VARIANT["-smallOp"].remap = {
          0x22c2: 0x22c3,
          0x22c3: 0x22c2
        };
      }
    }
  };

  HTMLCSS.FONTDATA.FONTS["MathJax_Caligraphic"] = {
    directory: "Caligraphic/Regular",
    family: "MathJax_Caligraphic",
    testString: "MATHJAX CALIGRAPHIC",
    skew: {
      0x41: 0.194,
      0x42: 0.139,
      0x43: 0.139,
      0x44: 0.0833,
      0x45: 0.111,
      0x46: 0.111,
      0x47: 0.111,
      0x48: 0.111,
      0x49: 0.0278,
      0x4a: 0.167,
      0x4b: 0.0556,
      0x4c: 0.139,
      0x4d: 0.139,
      0x4e: 0.0833,
      0x4f: 0.111,
      0x50: 0.0833,
      0x51: 0.111,
      0x52: 0.0833,
      0x53: 0.139,
      0x54: 0.0278,
      0x55: 0.0833,
      0x56: 0.0278,
      0x57: 0.0833,
      0x58: 0.139,
      0x59: 0.0833,
      0x5a: 0.139
    },
    0x20: [0, 0, 250, 0, 0], // SPACE
    0x30: [452, 22, 500, 39, 460], // DIGIT ZERO
    0x31: [453, 0, 500, 86, 426], // DIGIT ONE
    0x32: [453, 0, 500, 44, 449], // DIGIT TWO
    0x33: [452, 216, 500, 42, 456], // DIGIT THREE
    0x34: [464, 194, 500, 28, 471], // DIGIT FOUR
    0x35: [453, 216, 500, 50, 448], // DIGIT FIVE
    0x36: [665, 22, 500, 42, 456], // DIGIT SIX
    0x37: [463, 216, 500, 55, 485], // DIGIT SEVEN
    0x38: [666, 21, 500, 43, 456], // DIGIT EIGHT
    0x39: [453, 216, 500, 42, 457], // DIGIT NINE
    0x41: [728, 50, 798, 30, 819], // LATIN CAPITAL LETTER A
    0x42: [705, 22, 657, 32, 664], // LATIN CAPITAL LETTER B
    0x43: [705, 25, 527, 12, 533], // LATIN CAPITAL LETTER C
    0x44: [683, 0, 771, 19, 766], // LATIN CAPITAL LETTER D
    0x45: [705, 22, 528, 30, 564], // LATIN CAPITAL LETTER E
    0x46: [683, 32, 719, 18, 829], // LATIN CAPITAL LETTER F
    0x47: [704, 119, 595, 44, 599], // LATIN CAPITAL LETTER G
    0x48: [683, 48, 845, 18, 803], // LATIN CAPITAL LETTER H
    0x49: [683, 0, 545, -30, 642], // LATIN CAPITAL LETTER I
    0x4a: [683, 119, 678, 47, 839], // LATIN CAPITAL LETTER J
    0x4b: [705, 22, 762, 32, 732], // LATIN CAPITAL LETTER K
    0x4c: [705, 22, 690, 32, 656], // LATIN CAPITAL LETTER L
    0x4d: [705, 50, 1201, 28, 1137], // LATIN CAPITAL LETTER M
    0x4e: [789, 50, 820, -27, 979], // LATIN CAPITAL LETTER N
    0x4f: [705, 22, 796, 58, 777], // LATIN CAPITAL LETTER O
    0x50: [683, 57, 696, 19, 733], // LATIN CAPITAL LETTER P
    0x51: [705, 131, 817, 114, 787], // LATIN CAPITAL LETTER Q
    0x52: [682, 22, 848, 19, 837], // LATIN CAPITAL LETTER R
    0x53: [705, 22, 606, 18, 642], // LATIN CAPITAL LETTER S
    0x54: [717, 68, 545, 34, 833], // LATIN CAPITAL LETTER T
    0x55: [683, 28, 626, -17, 687], // LATIN CAPITAL LETTER U
    0x56: [683, 52, 613, 25, 658], // LATIN CAPITAL LETTER V
    0x57: [683, 53, 988, 25, 1034], // LATIN CAPITAL LETTER W
    0x58: [683, 0, 713, 52, 807], // LATIN CAPITAL LETTER X
    0x59: [683, 143, 668, 31, 714], // LATIN CAPITAL LETTER Y
    0x5a: [683, 0, 725, 37, 767], // LATIN CAPITAL LETTER Z
    0xa0: [0, 0, 250, 0, 0] // NO-BREAK SPACE
  };

  HTMLCSS.FONTDATA.FONTS["MathJax_Main-bold"] = {
    directory: "Main/Bold",
    family: "MathJax_Main",
    weight: "bold",
    testString: "MathJax Main ^ \u210F \u2223",
    skew: {
      0x131: 0.0319,
      0x237: 0.0958,
      0x210f: -0.0319,
      0x2113: 0.128,
      0x2202: 0.0958
    },
    Ranges: [
      [0xa0, 0xff, "Latin1Supplement"],
      [0x100, 0x17f, "LatinExtendedA"],
      [0x180, 0x24f, "LatinExtendedB"],
      [0x2b0, 0x2ff, "SpacingModLetters"],
      [0x300, 0x36f, "CombDiacritMarks"],
      [0x2000, 0x206f, "GeneralPunctuation"],
      [0x20d0, 0x20ff, "CombDiactForSymbols"],
      [0x2100, 0x214f, "LetterlikeSymbols"],
      [0x2190, 0x21ff, "Arrows"],
      [0x2200, 0x22ff, "MathOperators"],
      [0x2300, 0x23ff, "MiscTechnical"],
      [0x25a0, 0x25ff, "GeometricShapes"],
      [0x2600, 0x26ff, "MiscSymbols"],
      [0x27c0, 0x27ef, "MiscMathSymbolsA"],
      [0x27f0, 0x27ff, "SupplementalArrowsA"],
      [0x2a00, 0x2aff, "SuppMathOperators"]
    ],
    0x20: [0, 0, 250, 0, 0], // SPACE
    0x21: [705, -1, 350, 89, 260], // EXCLAMATION MARK
    0x22: [694, -329, 603, 38, 492], // QUOTATION MARK
    0x23: [694, 193, 958, 64, 893], // NUMBER SIGN
    0x24: [750, 56, 575, 64, 510], // DOLLAR SIGN
    0x25: [750, 56, 958, 65, 893], // PERCENT SIGN
    0x26: [705, 11, 894, 48, 836], // AMPERSAND
    0x27: [694, -329, 319, 74, 261], // APOSTROPHE
    0x28: [750, 249, 447, 103, 382], // LEFT PARENTHESIS
    0x29: [750, 249, 447, 64, 343], // RIGHT PARENTHESIS
    0x2a: [750, -306, 575, 73, 501], // ASTERISK
    0x2b: [633, 131, 894, 64, 829], // PLUS SIGN
    0x2c: [171, 194, 319, 74, 258], // COMMA
    0x2d: [278, -166, 383, 13, 318], // HYPHEN-MINUS
    0x2e: [171, -1, 319, 74, 245], // FULL STOP
    0x2f: [750, 250, 575, 63, 511], // SOLIDUS
    0x30: [654, 10, 575, 45, 529], // DIGIT ZERO
    0x31: [655, 0, 575, 80, 494], // DIGIT ONE
    0x32: [654, 0, 575, 57, 517], // DIGIT TWO
    0x33: [655, 11, 575, 47, 526], // DIGIT THREE
    0x34: [656, 0, 575, 32, 542], // DIGIT FOUR
    0x35: [655, 11, 575, 57, 517], // DIGIT FIVE
    0x36: [655, 11, 575, 48, 526], // DIGIT SIX
    0x37: [676, 11, 575, 64, 558], // DIGIT SEVEN
    0x38: [654, 11, 575, 48, 526], // DIGIT EIGHT
    0x39: [654, 11, 575, 48, 526], // DIGIT NINE
    0x3a: [444, -1, 319, 74, 245], // COLON
    0x3b: [444, 194, 319, 74, 248], // SEMICOLON
    0x3c: [587, 85, 894, 96, 797], // LESS-THAN SIGN
    0x3d: [393, -109, 894, 64, 829], // EQUALS SIGN
    0x3e: [587, 85, 894, 96, 797], // GREATER-THAN SIGN
    0x3f: [700, -1, 543, 65, 478], // QUESTION MARK
    0x40: [699, 6, 894, 64, 829], // COMMERCIAL AT
    0x41: [698, 0, 869, 40, 828], // LATIN CAPITAL LETTER A
    0x42: [686, 0, 818, 39, 752], // LATIN CAPITAL LETTER B
    0x43: [697, 11, 831, 64, 766], // LATIN CAPITAL LETTER C
    0x44: [686, 0, 882, 39, 817], // LATIN CAPITAL LETTER D
    0x45: [680, 0, 756, 39, 723], // LATIN CAPITAL LETTER E
    0x46: [680, 0, 724, 39, 675], // LATIN CAPITAL LETTER F
    0x47: [697, 10, 904, 64, 845], // LATIN CAPITAL LETTER G
    0x48: [686, 0, 900, 39, 860], // LATIN CAPITAL LETTER H
    0x49: [686, 0, 436, 25, 410], // LATIN CAPITAL LETTER I
    0x4a: [686, 11, 594, 8, 527], // LATIN CAPITAL LETTER J
    0x4b: [686, 0, 901, 39, 852], // LATIN CAPITAL LETTER K
    0x4c: [686, 0, 692, 39, 643], // LATIN CAPITAL LETTER L
    0x4d: [686, 0, 1092, 39, 1052], // LATIN CAPITAL LETTER M
    0x4e: [686, 0, 900, 39, 860], // LATIN CAPITAL LETTER N
    0x4f: [696, 10, 864, 64, 798], // LATIN CAPITAL LETTER O
    0x50: [686, 0, 786, 39, 721], // LATIN CAPITAL LETTER P
    0x51: [696, 193, 864, 64, 805], // LATIN CAPITAL LETTER Q
    0x52: [686, 11, 862, 39, 858], // LATIN CAPITAL LETTER R
    0x53: [697, 11, 639, 64, 574], // LATIN CAPITAL LETTER S
    0x54: [675, 0, 800, 41, 758], // LATIN CAPITAL LETTER T
    0x55: [686, 11, 885, 39, 845], // LATIN CAPITAL LETTER U
    0x56: [686, 7, 869, 25, 843], // LATIN CAPITAL LETTER V
    0x57: [686, 7, 1189, 24, 1164], // LATIN CAPITAL LETTER W
    0x58: [686, 0, 869, 33, 835], // LATIN CAPITAL LETTER X
    0x59: [686, 0, 869, 19, 849], // LATIN CAPITAL LETTER Y
    0x5a: [686, 0, 703, 64, 645], // LATIN CAPITAL LETTER Z
    0x5b: [750, 250, 319, 128, 293], // LEFT SQUARE BRACKET
    0x5c: [750, 250, 575, 63, 511], // REVERSE SOLIDUS
    0x5d: [750, 250, 319, 25, 190], // RIGHT SQUARE BRACKET
    0x5e: [694, -520, 575, 126, 448], // CIRCUMFLEX ACCENT
    0x5f: [-10, 61, 575, 0, 574], // LOW LINE
    0x60: [706, -503, 575, 114, 338], // GRAVE ACCENT
    0x61: [453, 6, 559, 32, 558], // LATIN SMALL LETTER A
    0x62: [694, 6, 639, 29, 600], // LATIN SMALL LETTER B
    0x63: [453, 6, 511, 39, 478], // LATIN SMALL LETTER C
    0x64: [694, 6, 639, 38, 609], // LATIN SMALL LETTER D
    0x65: [452, 6, 527, 32, 494], // LATIN SMALL LETTER E
    0x66: [700, 0, 351, 40, 452], // LATIN SMALL LETTER F
    0x67: [455, 201, 575, 30, 558], // LATIN SMALL LETTER G
    0x68: [694, 0, 639, 37, 623], // LATIN SMALL LETTER H
    0x69: [695, 0, 319, 40, 294], // LATIN SMALL LETTER I
    0x6a: [695, 200, 351, -71, 274], // LATIN SMALL LETTER J
    0x6b: [694, 0, 607, 29, 587], // LATIN SMALL LETTER K
    0x6c: [694, 0, 319, 40, 301], // LATIN SMALL LETTER L
    0x6d: [450, 0, 958, 37, 942], // LATIN SMALL LETTER M
    0x6e: [450, 0, 639, 37, 623], // LATIN SMALL LETTER N
    0x6f: [452, 5, 575, 32, 542], // LATIN SMALL LETTER O
    0x70: [450, 194, 639, 29, 600], // LATIN SMALL LETTER P
    0x71: [450, 194, 607, 38, 609], // LATIN SMALL LETTER Q
    0x72: [450, 0, 474, 29, 442], // LATIN SMALL LETTER R
    0x73: [453, 6, 454, 38, 414], // LATIN SMALL LETTER S
    0x74: [635, 5, 447, 21, 382], // LATIN SMALL LETTER T
    0x75: [450, 6, 639, 37, 623], // LATIN SMALL LETTER U
    0x76: [444, 3, 607, 26, 580], // LATIN SMALL LETTER V
    0x77: [444, 4, 831, 25, 805], // LATIN SMALL LETTER W
    0x78: [444, 0, 607, 21, 586], // LATIN SMALL LETTER X
    0x79: [444, 200, 607, 23, 580], // LATIN SMALL LETTER Y
    0x7a: [444, 0, 511, 32, 462], // LATIN SMALL LETTER Z
    0x7b: [750, 250, 575, 70, 504], // LEFT CURLY BRACKET
    0x7c: [750, 249, 319, 129, 190], // VERTICAL LINE
    0x7d: [750, 250, 575, 70, 504], // RIGHT CURLY BRACKET
    0x7e: [344, -202, 575, 96, 478], // TILDE
    0x393: [680, 0, 692, 39, 643], // GREEK CAPITAL LETTER GAMMA
    0x394: [698, 0, 958, 56, 901], // GREEK CAPITAL LETTER DELTA
    0x398: [696, 10, 894, 64, 829], // GREEK CAPITAL LETTER THETA
    0x39b: [698, 0, 806, 40, 765], // GREEK CAPITAL LETTER LAMDA
    0x39e: [675, 0, 767, 48, 718], // GREEK CAPITAL LETTER XI
    0x3a0: [680, 0, 900, 39, 860], // GREEK CAPITAL LETTER PI
    0x3a3: [686, 0, 831, 63, 766], // GREEK CAPITAL LETTER SIGMA
    0x3a5: [697, 0, 894, 64, 829], // GREEK CAPITAL LETTER UPSILON
    0x3a6: [686, 0, 831, 64, 766], // GREEK CAPITAL LETTER PHI
    0x3a8: [686, 0, 894, 64, 829], // GREEK CAPITAL LETTER PSI
    0x3a9: [696, 0, 831, 51, 779] // GREEK CAPITAL LETTER OMEGA
  };

  HTMLCSS.FONTDATA.FONTS["MathJax_Main-italic"] = {
    directory: "Main/Italic",
    family: "MathJax_Main",
    style: "italic",
    testString: "MathJax Main ^ \u210F \u2223",
    Ranges: [
      [0xa0, 0xff, "Latin1Supplement"],
      [0x300, 0x36f, "CombDiacritMarks"],
      [0x2000, 0x206f, "GeneralPunctuation"],
      [0x2100, 0x214f, "LetterlikeSymbols"]
    ],
    0x20: [0, 0, 250, 0, 0], // SPACE
    0x21: [716, 0, 307, 107, 380], // EXCLAMATION MARK
    0x22: [694, -379, 514, 176, 538], // QUOTATION MARK
    0x23: [694, 194, 818, 115, 828], // NUMBER SIGN
    0x25: [750, 56, 818, 145, 847], // PERCENT SIGN
    0x26: [716, 22, 767, 127, 802], // AMPERSAND
    0x27: [694, -379, 307, 213, 377], // APOSTROPHE
    0x28: [750, 250, 409, 144, 517], // LEFT PARENTHESIS
    0x29: [750, 250, 409, 17, 390], // RIGHT PARENTHESIS
    0x2a: [750, -320, 511, 195, 584], // ASTERISK
    0x2b: [557, 57, 767, 139, 753], // PLUS SIGN
    0x2c: [121, 194, 307, 69, 232], // COMMA
    0x2d: [251, -180, 358, 84, 341], // HYPHEN-MINUS
    0x2e: [121, 0, 307, 107, 231], // FULL STOP
    0x2f: [750, 250, 511, 19, 617], // SOLIDUS
    0x30: [665, 21, 511, 110, 562], // DIGIT ZERO
    0x31: [666, 0, 511, 110, 468], // DIGIT ONE
    0x32: [666, 22, 511, 76, 551], // DIGIT TWO
    0x33: [666, 22, 511, 96, 562], // DIGIT THREE
    0x34: [666, 194, 511, 46, 478], // DIGIT FOUR
    0x35: [666, 22, 511, 106, 567], // DIGIT FIVE
    0x36: [665, 22, 511, 120, 565], // DIGIT SIX
    0x37: [666, 22, 511, 136, 634], // DIGIT SEVEN
    0x38: [666, 21, 511, 99, 553], // DIGIT EIGHT
    0x39: [666, 22, 511, 107, 553], // DIGIT NINE
    0x3a: [431, 0, 307, 107, 308], // COLON
    0x3b: [431, 194, 307, 70, 308], // SEMICOLON
    0x3d: [367, -133, 767, 116, 776], // EQUALS SIGN
    0x3f: [716, 0, 511, 195, 551], // QUESTION MARK
    0x40: [705, 11, 767, 152, 789], // COMMERCIAL AT
    0x41: [716, 0, 743, 58, 696], // LATIN CAPITAL LETTER A
    0x42: [683, 0, 704, 57, 732], // LATIN CAPITAL LETTER B
    0x43: [705, 21, 716, 150, 812], // LATIN CAPITAL LETTER C
    0x44: [683, 0, 755, 56, 775], // LATIN CAPITAL LETTER D
    0x45: [680, 0, 678, 54, 743], // LATIN CAPITAL LETTER E
    0x46: [680, -1, 653, 54, 731], // LATIN CAPITAL LETTER F
    0x47: [705, 22, 774, 150, 812], // LATIN CAPITAL LETTER G
    0x48: [683, 0, 743, 54, 860], // LATIN CAPITAL LETTER H
    0x49: [683, 0, 386, 49, 508], // LATIN CAPITAL LETTER I
    0x4a: [683, 21, 525, 78, 622], // LATIN CAPITAL LETTER J
    0x4b: [683, 0, 769, 54, 859], // LATIN CAPITAL LETTER K
    0x4c: [683, 0, 627, 54, 628], // LATIN CAPITAL LETTER L
    0x4d: [683, 0, 897, 58, 1010], // LATIN CAPITAL LETTER M
    0x4e: [683, 0, 743, 54, 860], // LATIN CAPITAL LETTER N
    0x4f: [704, 22, 767, 149, 788], // LATIN CAPITAL LETTER O
    0x50: [683, 0, 678, 55, 729], // LATIN CAPITAL LETTER P
    0x51: [704, 194, 767, 149, 788], // LATIN CAPITAL LETTER Q
    0x52: [683, 22, 729, 55, 723], // LATIN CAPITAL LETTER R
    0x53: [705, 22, 562, 74, 633], // LATIN CAPITAL LETTER S
    0x54: [677, 0, 716, 171, 806], // LATIN CAPITAL LETTER T
    0x55: [683, 22, 743, 194, 860], // LATIN CAPITAL LETTER U
    0x56: [683, 22, 743, 205, 868], // LATIN CAPITAL LETTER V
    0x57: [683, 22, 999, 205, 1124], // LATIN CAPITAL LETTER W
    0x58: [683, 0, 743, 50, 825], // LATIN CAPITAL LETTER X
    0x59: [683, 0, 743, 198, 875], // LATIN CAPITAL LETTER Y
    0x5a: [683, 0, 613, 80, 704], // LATIN CAPITAL LETTER Z
    0x5b: [750, 250, 307, 73, 446], // LEFT SQUARE BRACKET
    0x5d: [750, 250, 307, -14, 359], // RIGHT SQUARE BRACKET
    0x5e: [694, -527, 511, 260, 528], // CIRCUMFLEX ACCENT
    0x5f: [-25, 62, 511, 91, 554], // LOW LINE
    0x61: [442, 11, 511, 101, 543], // LATIN SMALL LETTER A
    0x62: [694, 11, 460, 108, 467], // LATIN SMALL LETTER B
    0x63: [441, 10, 460, 103, 469], // LATIN SMALL LETTER C
    0x64: [694, 11, 511, 101, 567], // LATIN SMALL LETTER D
    0x65: [442, 10, 460, 107, 470], // LATIN SMALL LETTER E
    0x66: [705, 204, 307, -23, 450], // LATIN SMALL LETTER F
    0x67: [442, 205, 460, 46, 494], // LATIN SMALL LETTER G
    0x68: [694, 11, 511, 69, 544], // LATIN SMALL LETTER H
    0x69: [656, 10, 307, 75, 340], // LATIN SMALL LETTER I
    0x6a: [656, 204, 307, -32, 364], // LATIN SMALL LETTER J
    0x6b: [694, 11, 460, 69, 498], // LATIN SMALL LETTER K
    0x6c: [694, 11, 256, 87, 312], // LATIN SMALL LETTER L
    0x6d: [442, 11, 818, 75, 851], // LATIN SMALL LETTER M
    0x6e: [442, 11, 562, 75, 595], // LATIN SMALL LETTER N
    0x6f: [442, 11, 511, 103, 517], // LATIN SMALL LETTER O
    0x70: [442, 194, 511, 6, 518], // LATIN SMALL LETTER P
    0x71: [442, 194, 460, 101, 504], // LATIN SMALL LETTER Q
    0x72: [442, 11, 422, 75, 484], // LATIN SMALL LETTER R
    0x73: [442, 11, 409, 76, 418], // LATIN SMALL LETTER S
    0x74: [626, 11, 332, 87, 373], // LATIN SMALL LETTER T
    0x75: [441, 11, 537, 75, 570], // LATIN SMALL LETTER U
    0x76: [443, 10, 460, 75, 492], // LATIN SMALL LETTER V
    0x77: [443, 11, 664, 75, 696], // LATIN SMALL LETTER W
    0x78: [442, 11, 464, 58, 513], // LATIN SMALL LETTER X
    0x79: [441, 205, 486, 75, 522], // LATIN SMALL LETTER Y
    0x7a: [442, 11, 409, 54, 466], // LATIN SMALL LETTER Z
    0x7e: [318, -208, 511, 246, 571], // TILDE
    0xa3: [714, 11, 769, 88, 699], // POUND SIGN
    0x131: [441, 10, 307, 75, 340], // LATIN SMALL LETTER DOTLESS I
    0x237: [442, 204, 332, -32, 327], // LATIN SMALL LETTER DOTLESS J
    0x393: [680, 0, 627, 54, 705], // GREEK CAPITAL LETTER GAMMA
    0x394: [716, 0, 818, 70, 751], // GREEK CAPITAL LETTER DELTA
    0x398: [704, 22, 767, 149, 788], // GREEK CAPITAL LETTER THETA
    0x39b: [716, 0, 692, 58, 646], // GREEK CAPITAL LETTER LAMDA
    0x39e: [677, 0, 664, 74, 754], // GREEK CAPITAL LETTER XI
    0x3a0: [680, 0, 743, 54, 859], // GREEK CAPITAL LETTER PI
    0x3a3: [683, 0, 716, 80, 782], // GREEK CAPITAL LETTER SIGMA
    0x3a5: [705, 0, 767, 213, 832], // GREEK CAPITAL LETTER UPSILON
    0x3a6: [683, 0, 716, 159, 728], // GREEK CAPITAL LETTER PHI
    0x3a8: [683, 0, 767, 207, 824], // GREEK CAPITAL LETTER PSI
    0x3a9: [705, 0, 716, 100, 759] // GREEK CAPITAL LETTER OMEGA
  };

  HTMLCSS.FONTDATA.FONTS["MathJax_Main"] = {
    directory: "Main/Regular",
    family: "MathJax_Main",
    testString: "MathJax Main ^ \u210F \u2223",
    skew: {
      0x131: 0.0278,
      0x237: 0.0833,
      0x2113: 0.111,
      0x2118: 0.111,
      0x2202: 0.0833
    },
    Ranges: [
      [0x2b0, 0x2ff, "SpacingModLetters"],
      [0x300, 0x36f, "CombDiacritMarks"],
      [0x25a0, 0x25ff, "GeometricShapes"],
      [0x2600, 0x26ff, "MiscSymbols"]
    ],
    0x20: [0, 0, 250, 0, 0], // SPACE
    0x21: [716, -1, 278, 78, 199], // EXCLAMATION MARK
    0x22: [694, -379, 500, 34, 372], // QUOTATION MARK
    0x23: [694, 194, 833, 56, 777], // NUMBER SIGN
    0x24: [750, 56, 500, 55, 444], // DOLLAR SIGN
    0x25: [750, 56, 833, 56, 776], // PERCENT SIGN
    0x26: [716, 22, 778, 42, 727], // AMPERSAND
    0x27: [694, -379, 278, 78, 212], // APOSTROPHE
    0x28: [750, 250, 389, 94, 333], // LEFT PARENTHESIS
    0x29: [750, 250, 389, 55, 294], // RIGHT PARENTHESIS
    0x2a: [750, -320, 500, 64, 435], // ASTERISK
    0x2b: [583, 82, 778, 56, 722], // PLUS SIGN
    0x2c: [121, 194, 278, 78, 210], // COMMA
    0x2d: [252, -179, 333, 11, 277], // HYPHEN-MINUS
    0x2e: [120, 0, 278, 78, 199], // FULL STOP
    0x2f: [750, 250, 500, 56, 445], // SOLIDUS
    0x30: [666, 22, 500, 39, 460], // DIGIT ZERO
    0x31: [666, 0, 500, 83, 427], // DIGIT ONE
    0x32: [666, 0, 500, 50, 449], // DIGIT TWO
    0x33: [665, 22, 500, 42, 457], // DIGIT THREE
    0x34: [677, 0, 500, 28, 471], // DIGIT FOUR
    0x35: [666, 22, 500, 50, 449], // DIGIT FIVE
    0x36: [666, 22, 500, 42, 456], // DIGIT SIX
    0x37: [676, 22, 500, 55, 485], // DIGIT SEVEN
    0x38: [666, 22, 500, 43, 457], // DIGIT EIGHT
    0x39: [666, 22, 500, 42, 456], // DIGIT NINE
    0x3a: [430, 0, 278, 78, 199], // COLON
    0x3b: [430, 194, 278, 78, 202], // SEMICOLON
    0x3c: [540, 40, 778, 83, 694], // LESS-THAN SIGN
    0x3d: [367, -133, 778, 56, 722], // EQUALS SIGN
    0x3e: [540, 40, 778, 83, 694], // GREATER-THAN SIGN
    0x3f: [705, -1, 472, 55, 416], // QUESTION MARK
    0x40: [705, 11, 778, 56, 722], // COMMERCIAL AT
    0x41: [716, 0, 750, 32, 717], // LATIN CAPITAL LETTER A
    0x42: [683, 0, 708, 28, 651], // LATIN CAPITAL LETTER B
    0x43: [705, 21, 722, 56, 666], // LATIN CAPITAL LETTER C
    0x44: [683, 0, 764, 27, 708], // LATIN CAPITAL LETTER D
    0x45: [680, 0, 681, 25, 652], // LATIN CAPITAL LETTER E
    0x46: [680, 0, 653, 25, 610], // LATIN CAPITAL LETTER F
    0x47: [705, 22, 785, 56, 735], // LATIN CAPITAL LETTER G
    0x48: [683, 0, 750, 25, 724], // LATIN CAPITAL LETTER H
    0x49: [683, 0, 361, 21, 339], // LATIN CAPITAL LETTER I
    0x4a: [683, 22, 514, 25, 465], // LATIN CAPITAL LETTER J
    0x4b: [683, 0, 778, 25, 736], // LATIN CAPITAL LETTER K
    0x4c: [683, 0, 625, 25, 582], // LATIN CAPITAL LETTER L
    0x4d: [683, 0, 917, 29, 887], // LATIN CAPITAL LETTER M
    0x4e: [683, 0, 750, 25, 724], // LATIN CAPITAL LETTER N
    0x4f: [705, 22, 778, 56, 722], // LATIN CAPITAL LETTER O
    0x50: [683, 0, 681, 27, 624], // LATIN CAPITAL LETTER P
    0x51: [705, 193, 778, 56, 728], // LATIN CAPITAL LETTER Q
    0x52: [683, 22, 736, 27, 732], // LATIN CAPITAL LETTER R
    0x53: [705, 22, 556, 55, 500], // LATIN CAPITAL LETTER S
    0x54: [677, 0, 722, 36, 685], // LATIN CAPITAL LETTER T
    0x55: [683, 22, 750, 25, 724], // LATIN CAPITAL LETTER U
    0x56: [683, 22, 750, 19, 730], // LATIN CAPITAL LETTER V
    0x57: [683, 22, 1028, 18, 1009], // LATIN CAPITAL LETTER W
    0x58: [683, 0, 750, 23, 726], // LATIN CAPITAL LETTER X
    0x59: [683, 0, 750, 11, 738], // LATIN CAPITAL LETTER Y
    0x5a: [683, 0, 611, 55, 560], // LATIN CAPITAL LETTER Z
    0x5b: [750, 250, 278, 118, 255], // LEFT SQUARE BRACKET
    0x5c: [750, 250, 500, 56, 444], // REVERSE SOLIDUS
    0x5d: [750, 250, 278, 22, 159], // RIGHT SQUARE BRACKET
    0x5e: [694, -531, 500, 112, 387], // CIRCUMFLEX ACCENT
    0x5f: [-25, 62, 500, 0, 499], // LOW LINE
    0x60: [699, -505, 500, 106, 295], // GRAVE ACCENT
    0x61: [448, 11, 500, 34, 493], // LATIN SMALL LETTER A
    0x62: [694, 11, 556, 20, 522], // LATIN SMALL LETTER B
    0x63: [448, 11, 444, 34, 415], // LATIN SMALL LETTER C
    0x64: [694, 11, 556, 34, 535], // LATIN SMALL LETTER D
    0x65: [448, 11, 444, 28, 415], // LATIN SMALL LETTER E
    0x66: [705, 0, 306, 26, 372], // LATIN SMALL LETTER F
    0x67: [453, 206, 500, 29, 485], // LATIN SMALL LETTER G
    0x68: [694, 0, 556, 25, 542], // LATIN SMALL LETTER H
    0x69: [669, 0, 278, 26, 255], // LATIN SMALL LETTER I
    0x6a: [669, 205, 306, -55, 218], // LATIN SMALL LETTER J
    0x6b: [694, 0, 528, 20, 511], // LATIN SMALL LETTER K
    0x6c: [694, 0, 278, 26, 263], // LATIN SMALL LETTER L
    0x6d: [442, 0, 833, 25, 819], // LATIN SMALL LETTER M
    0x6e: [442, 0, 556, 25, 542], // LATIN SMALL LETTER N
    0x6f: [448, 10, 500, 28, 471], // LATIN SMALL LETTER O
    0x70: [442, 194, 556, 20, 522], // LATIN SMALL LETTER P
    0x71: [442, 194, 528, 33, 535], // LATIN SMALL LETTER Q
    0x72: [442, 0, 392, 20, 364], // LATIN SMALL LETTER R
    0x73: [448, 11, 394, 33, 359], // LATIN SMALL LETTER S
    0x74: [615, 10, 389, 18, 333], // LATIN SMALL LETTER T
    0x75: [442, 11, 556, 25, 542], // LATIN SMALL LETTER U
    0x76: [431, 11, 528, 19, 508], // LATIN SMALL LETTER V
    0x77: [431, 11, 722, 18, 703], // LATIN SMALL LETTER W
    0x78: [431, 0, 528, 11, 516], // LATIN SMALL LETTER X
    0x79: [431, 204, 528, 19, 508], // LATIN SMALL LETTER Y
    0x7a: [431, 0, 444, 28, 401], // LATIN SMALL LETTER Z
    0x7b: [750, 250, 500, 65, 434], // LEFT CURLY BRACKET
    0x7c: [750, 249, 278, 119, 159], // VERTICAL LINE
    0x7d: [750, 250, 500, 65, 434], // RIGHT CURLY BRACKET
    0x7e: [318, -215, 500, 83, 416], // TILDE
    0xa0: [0, 0, 250, 0, 0], // NO-BREAK SPACE
    0xa8: [669, -554, 500, 95, 404], // DIAERESIS
    0xac: [356, -89, 667, 56, 611], // NOT SIGN
    0xaf: [590, -544, 500, 69, 430], // MACRON
    0xb0: [715, -542, 500, 147, 352], // DEGREE SIGN
    0xb1: [666, 0, 778, 56, 722], // PLUS-MINUS SIGN
    0xb4: [699, -505, 500, 203, 393], // ACUTE ACCENT
    0xd7: [491, -9, 778, 147, 630], // MULTIPLICATION SIGN
    0xf7: [537, 36, 778, 56, 721], // DIVISION SIGN
    0x131: [442, 0, 278, 26, 255], // LATIN SMALL LETTER DOTLESS I
    0x237: [442, 205, 306, -55, 218], // LATIN SMALL LETTER DOTLESS J
    0x2c6: [694, -531, 500, 112, 387], // MODIFIER LETTER CIRCUMFLEX ACCENT
    0x2c7: [644, -513, 500, 114, 385], // CARON
    0x2c9: [590, -544, 500, 69, 430], // MODIFIER LETTER MACRON
    0x2ca: [699, -505, 500, 203, 393], // MODIFIER LETTER ACUTE ACCENT
    0x2cb: [699, -505, 500, 106, 295], // MODIFIER LETTER GRAVE ACCENT
    0x2d8: [694, -515, 500, 92, 407], // BREVE
    0x2d9: [669, -549, 500, 190, 309], // DOT ABOVE
    0x2dc: [668, -565, 500, 83, 416], // SMALL TILDE
    0x393: [680, 0, 625, 25, 582], // GREEK CAPITAL LETTER GAMMA
    0x394: [716, 0, 833, 46, 786], // GREEK CAPITAL LETTER DELTA
    0x398: [705, 22, 778, 56, 722], // GREEK CAPITAL LETTER THETA
    0x39b: [716, 0, 694, 32, 661], // GREEK CAPITAL LETTER LAMDA
    0x39e: [677, 0, 667, 42, 624], // GREEK CAPITAL LETTER XI
    0x3a0: [680, 0, 750, 25, 724], // GREEK CAPITAL LETTER PI
    0x3a3: [683, 0, 722, 55, 666], // GREEK CAPITAL LETTER SIGMA
    0x3a5: [705, 0, 778, 55, 722], // GREEK CAPITAL LETTER UPSILON
    0x3a6: [683, 0, 722, 56, 665], // GREEK CAPITAL LETTER PHI
    0x3a8: [683, 0, 778, 55, 722], // GREEK CAPITAL LETTER PSI
    0x3a9: [704, 0, 722, 44, 677], // GREEK CAPITAL LETTER OMEGA
    0x2002: [0, 0, 500, 0, 0], // ??
    0x2003: [0, 0, 999, 0, 0], // ??
    0x2004: [0, 0, 333, 0, 0], // ??
    0x2005: [0, 0, 250, 0, 0], // ??
    0x2006: [0, 0, 167, 0, 0], // ??
    0x2009: [0, 0, 167, 0, 0], // ??
    0x200a: [0, 0, 83, 0, 0], // ??
    0x2013: [285, -248, 500, 0, 499], // EN DASH
    0x2014: [285, -248, 1000, 0, 999], // EM DASH
    0x2018: [694, -379, 278, 64, 198], // LEFT SINGLE QUOTATION MARK
    0x2019: [694, -379, 278, 78, 212], // RIGHT SINGLE QUOTATION MARK
    0x201c: [694, -379, 500, 128, 466], // LEFT DOUBLE QUOTATION MARK
    0x201d: [694, -379, 500, 34, 372], // RIGHT DOUBLE QUOTATION MARK
    0x2020: [705, 216, 444, 55, 389], // DAGGER
    0x2021: [705, 205, 444, 55, 389], // DOUBLE DAGGER
    0x2026: [120, 0, 1172, 78, 1093], // HORIZONTAL ELLIPSIS
    0x2032: [560, -43, 275, 30, 262], // PRIME
    0x20d7: [714, -516, 0, -471, -29], // COMBINING RIGHT ARROW ABOVE
    0x210f: [695, 13, 540, 42, 562], // stix-/hbar - Planck's over 2pi
    0x2111: [705, 10, 722, 55, 693], // BLACK-LETTER CAPITAL I
    0x2113: [705, 20, 417, 6, 397], // SCRIPT SMALL L
    0x2118: [453, 216, 636, 67, 625], // SCRIPT CAPITAL P
    0x211c: [716, 22, 722, 40, 715], // BLACK-LETTER CAPITAL R
    0x2135: [694, 0, 611, 55, 555], // ALEF SYMBOL
    0x2190: [511, 11, 1000, 55, 944], // LEFTWARDS ARROW
    0x2191: [694, 193, 500, 17, 483], // UPWARDS ARROW
    0x2192: [511, 11, 1000, 56, 944], // RIGHTWARDS ARROW
    0x2193: [694, 194, 500, 17, 483], // DOWNWARDS ARROW
    0x2194: [511, 11, 1000, 55, 944], // LEFT RIGHT ARROW
    0x2195: [772, 272, 500, 17, 483], // UP DOWN ARROW
    0x2196: [720, 195, 1000, 29, 944], // NORTH WEST ARROW
    0x2197: [720, 195, 1000, 55, 970], // NORTH EAST ARROW
    0x2198: [695, 220, 1000, 55, 970], // SOUTH EAST ARROW
    0x2199: [695, 220, 1000, 29, 944], // SOUTH WEST ARROW
    0x21a6: [511, 11, 1000, 55, 944], // RIGHTWARDS ARROW FROM BAR
    0x21a9: [511, 11, 1126, 55, 1070], // LEFTWARDS ARROW WITH HOOK
    0x21aa: [511, 11, 1126, 55, 1070], // RIGHTWARDS ARROW WITH HOOK
    0x21bc: [511, -230, 1000, 55, 944], // LEFTWARDS HARPOON WITH BARB UPWARDS
    0x21bd: [270, 11, 1000, 55, 944], // LEFTWARDS HARPOON WITH BARB DOWNWARDS
    0x21c0: [511, -230, 1000, 56, 944], // RIGHTWARDS HARPOON WITH BARB UPWARDS
    0x21c1: [270, 11, 1000, 56, 944], // RIGHTWARDS HARPOON WITH BARB DOWNWARDS
    0x21cc: [671, 11, 1000, 55, 944], // RIGHTWARDS HARPOON OVER LEFTWARDS HARPOON
    0x21d0: [525, 24, 1000, 56, 944], // LEFTWARDS DOUBLE ARROW
    0x21d1: [694, 194, 611, 31, 579], // UPWARDS DOUBLE ARROW
    0x21d2: [525, 24, 1000, 56, 944], // RIGHTWARDS DOUBLE ARROW
    0x21d3: [694, 194, 611, 31, 579], // DOWNWARDS DOUBLE ARROW
    0x21d4: [526, 25, 1000, 34, 966], // LEFT RIGHT DOUBLE ARROW
    0x21d5: [772, 272, 611, 31, 579], // UP DOWN DOUBLE ARROW
    0x2200: [694, 22, 556, 0, 556], // FOR ALL
    0x2202: [715, 22, 531, 42, 566], // PARTIAL DIFFERENTIAL
    0x2203: [694, 0, 556, 56, 500], // THERE EXISTS
    0x2205: [772, 78, 500, 39, 460], // EMPTY SET
    0x2207: [683, 33, 833, 46, 786], // NABLA
    0x2208: [540, 40, 667, 84, 583], // ELEMENT OF
    0x2209: [716, 215, 667, 84, 583], // stix-negated (vert) set membership, variant
    0x220b: [540, 40, 667, 83, 582], // CONTAINS AS MEMBER
    0x2212: [270, -230, 778, 84, 694], // MINUS SIGN
    0x2213: [500, 166, 778, 56, 722], // MINUS-OR-PLUS SIGN
    0x2215: [750, 250, 500, 56, 445], // DIVISION SLASH
    0x2216: [750, 250, 500, 56, 444], // SET MINUS
    0x2217: [465, -35, 500, 64, 435], // ASTERISK OPERATOR
    0x2218: [444, -55, 500, 55, 444], // RING OPERATOR
    0x2219: [444, -55, 500, 55, 444], // BULLET OPERATOR
    0x221a: [800, 200, 833, 72, 853], // SQUARE ROOT
    0x221d: [442, 11, 778, 56, 722], // PROPORTIONAL TO
    0x221e: [442, 11, 1000, 55, 944], // INFINITY
    0x2220: [694, 0, 722, 55, 666], // ANGLE
    0x2223: [750, 249, 278, 119, 159], // DIVIDES
    0x2225: [750, 250, 500, 132, 367], // PARALLEL TO
    0x2227: [598, 22, 667, 55, 611], // LOGICAL AND
    0x2228: [598, 22, 667, 55, 611], // LOGICAL OR
    0x2229: [598, 22, 667, 55, 611], // stix-intersection, serifs
    0x222a: [598, 22, 667, 55, 611], // stix-union, serifs
    0x222b: [716, 216, 417, 55, 472], // INTEGRAL
    0x223c: [367, -133, 778, 55, 722], // TILDE OPERATOR
    0x2240: [583, 83, 278, 55, 222], // WREATH PRODUCT
    0x2243: [464, -36, 778, 55, 722], // ASYMPTOTICALLY EQUAL TO
    0x2245: [589, -22, 1000, 55, 722], // APPROXIMATELY EQUAL TO
    0x2248: [483, -55, 778, 55, 722], // ALMOST EQUAL TO
    0x224d: [484, -16, 778, 55, 722], // EQUIVALENT TO
    0x2250: [670, -133, 778, 56, 722], // APPROACHES THE LIMIT
    0x2260: [716, 215, 778, 56, 722], // stix-not (vert) equals
    0x2261: [464, -36, 778, 56, 722], // IDENTICAL TO
    0x2264: [636, 138, 778, 83, 694], // LESS-THAN OR EQUAL TO
    0x2265: [636, 138, 778, 83, 694], // GREATER-THAN OR EQUAL TO
    0x226a: [568, 67, 1000, 56, 944], // MUCH LESS-THAN
    0x226b: [567, 67, 1000, 55, 944], // MUCH GREATER-THAN
    0x227a: [539, 41, 778, 84, 694], // PRECEDES
    0x227b: [539, 41, 778, 83, 694], // SUCCEEDS
    0x2282: [540, 40, 778, 84, 694], // SUBSET OF
    0x2283: [540, 40, 778, 83, 693], // SUPERSET OF
    0x2286: [636, 138, 778, 84, 694], // SUBSET OF OR EQUAL TO
    0x2287: [636, 138, 778, 83, 693], // SUPERSET OF OR EQUAL TO
    0x228e: [598, 22, 667, 55, 611], // MULTISET UNION
    0x2291: [636, 138, 778, 84, 714], // SQUARE IMAGE OF OR EQUAL TO
    0x2292: [636, 138, 778, 64, 694], // SQUARE ORIGINAL OF OR EQUAL TO
    0x2293: [598, 0, 667, 61, 605], // stix-square intersection, serifs
    0x2294: [598, 0, 667, 61, 605], // stix-square union, serifs
    0x2295: [583, 83, 778, 56, 722], // stix-circled plus (with rim)
    0x2296: [583, 83, 778, 56, 722], // CIRCLED MINUS
    0x2297: [583, 83, 778, 56, 722], // stix-circled times (with rim)
    0x2298: [583, 83, 778, 56, 722], // CIRCLED DIVISION SLASH
    0x2299: [583, 83, 778, 56, 722], // CIRCLED DOT OPERATOR
    0x22a2: [694, 0, 611, 55, 555], // RIGHT TACK
    0x22a3: [694, 0, 611, 55, 555], // LEFT TACK
    0x22a4: [668, 0, 778, 55, 723], // DOWN TACK
    0x22a5: [668, 0, 778, 55, 723], // UP TACK
    0x22a8: [750, 249, 867, 119, 811], // TRUE
    0x22c4: [488, -12, 500, 12, 488], // DIAMOND OPERATOR
    0x22c5: [310, -190, 278, 78, 199], // DOT OPERATOR
    0x22c6: [486, -16, 500, 3, 497], // STAR OPERATOR
    0x22c8: [505, 5, 900, 26, 873], // BOWTIE
    0x22ee: [900, 30, 278, 78, 199], // VERTICAL ELLIPSIS
    0x22ef: [310, -190, 1172, 78, 1093], // MIDLINE HORIZONTAL ELLIPSIS
    0x22f1: [820, -100, 1282, 133, 1148], // DOWN RIGHT DIAGONAL ELLIPSIS
    0x2308: [750, 250, 444, 174, 422], // LEFT CEILING
    0x2309: [750, 250, 444, 21, 269], // RIGHT CEILING
    0x230a: [750, 250, 444, 174, 422], // LEFT FLOOR
    0x230b: [750, 250, 444, 21, 269], // RIGHT FLOOR
    0x2322: [388, -122, 1000, 55, 944], // stix-small down curve
    0x2323: [378, -134, 1000, 55, 944], // stix-small up curve
    0x23b0: [744, 244, 412, 55, 357], // UPPER LEFT OR LOWER RIGHT CURLY BRACKET SECTION
    0x23b1: [744, 244, 412, 56, 357], // UPPER RIGHT OR LOWER LEFT CURLY BRACKET SECTION
    0x27e8: [750, 250, 389, 110, 333], // MATHEMATICAL LEFT ANGLE BRACKET
    0x27e9: [750, 250, 389, 55, 278], // MATHEMATICAL RIGHT ANGLE BRACKET
    0x27ee: [744, 244, 412, 173, 357], // MATHEMATICAL LEFT FLATTENED PARENTHESIS
    0x27ef: [744, 244, 412, 56, 240], // MATHEMATICAL RIGHT FLATTENED PARENTHESIS
    0x27f5: [511, 11, 1609, 55, 1525], // LONG LEFTWARDS ARROW
    0x27f6: [511, 11, 1638, 84, 1553], // LONG RIGHTWARDS ARROW
    0x27f7: [511, 11, 1859, 55, 1803], // LONG LEFT RIGHT ARROW
    0x27f8: [525, 24, 1609, 56, 1553], // LONG LEFTWARDS DOUBLE ARROW
    0x27f9: [525, 24, 1638, 56, 1582], // LONG RIGHTWARDS DOUBLE ARROW
    0x27fa: [525, 24, 1858, 56, 1802], // LONG LEFT RIGHT DOUBLE ARROW
    0x27fc: [511, 11, 1638, 55, 1553], // LONG RIGHTWARDS ARROW FROM BAR
    0x2a3f: [683, 0, 750, 28, 721], // AMALGAMATION OR COPRODUCT
    0x2aaf: [636, 138, 778, 84, 694], // PRECEDES ABOVE SINGLE-LINE EQUALS SIGN
    0x2ab0: [636, 138, 778, 83, 694] // SUCCEEDS ABOVE SINGLE-LINE EQUALS SIGN
  };

  HTMLCSS.FONTDATA.FONTS["MathJax_Math-italic"] = {
    directory: "Math/Italic",
    family: "MathJax_Math",
    style: "italic",
    testString: "MathJax Math \u03A5",
    skew: {
      0x41: 0.139,
      0x42: 0.0833,
      0x43: 0.0833,
      0x44: 0.0556,
      0x45: 0.0833,
      0x46: 0.0833,
      0x47: 0.0833,
      0x48: 0.0556,
      0x49: 0.111,
      0x4a: 0.167,
      0x4b: 0.0556,
      0x4c: 0.0278,
      0x4d: 0.0833,
      0x4e: 0.0833,
      0x4f: 0.0833,
      0x50: 0.0833,
      0x51: 0.0833,
      0x52: 0.0833,
      0x53: 0.0833,
      0x54: 0.0833,
      0x55: 0.0278,
      0x58: 0.0833,
      0x5a: 0.0833,
      0x63: 0.0556,
      0x64: 0.167,
      0x65: 0.0556,
      0x66: 0.167,
      0x67: 0.0278,
      0x68: -0.0278,
      0x6c: 0.0833,
      0x6f: 0.0556,
      0x70: 0.0833,
      0x71: 0.0833,
      0x72: 0.0556,
      0x73: 0.0556,
      0x74: 0.0833,
      0x75: 0.0278,
      0x76: 0.0278,
      0x77: 0.0833,
      0x78: 0.0278,
      0x79: 0.0556,
      0x7a: 0.0556,
      0x393: 0.0833,
      0x394: 0.167,
      0x398: 0.0833,
      0x39b: 0.167,
      0x39e: 0.0833,
      0x3a0: 0.0556,
      0x3a3: 0.0833,
      0x3a5: 0.0556,
      0x3a6: 0.0833,
      0x3a8: 0.0556,
      0x3a9: 0.0833,
      0x3b1: 0.0278,
      0x3b2: 0.0833,
      0x3b4: 0.0556,
      0x3b5: 0.0833,
      0x3b6: 0.0833,
      0x3b7: 0.0556,
      0x3b8: 0.0833,
      0x3b9: 0.0556,
      0x3bc: 0.0278,
      0x3bd: 0.0278,
      0x3be: 0.111,
      0x3bf: 0.0556,
      0x3c1: 0.0833,
      0x3c2: 0.0833,
      0x3c4: 0.0278,
      0x3c5: 0.0278,
      0x3c6: 0.0833,
      0x3c7: 0.0556,
      0x3c8: 0.111,
      0x3d1: 0.0833,
      0x3d5: 0.0833,
      0x3f1: 0.0833,
      0x3f5: 0.0556
    },
    0x20: [0, 0, 250, 0, 0], // SPACE
    0x2f: [716, 215, 778, 139, 638], // SOLIDUS
    0x41: [716, 0, 750, 35, 726], // LATIN CAPITAL LETTER A
    0x42: [683, 0, 759, 35, 756], // LATIN CAPITAL LETTER B
    0x43: [705, 22, 715, 50, 760], // LATIN CAPITAL LETTER C
    0x44: [683, 0, 828, 33, 803], // LATIN CAPITAL LETTER D
    0x45: [680, 0, 738, 31, 764], // LATIN CAPITAL LETTER E
    0x46: [680, 0, 643, 31, 749], // LATIN CAPITAL LETTER F
    0x47: [705, 22, 786, 50, 760], // LATIN CAPITAL LETTER G
    0x48: [683, 0, 831, 31, 888], // LATIN CAPITAL LETTER H
    0x49: [683, 0, 440, 26, 504], // LATIN CAPITAL LETTER I
    0x4a: [683, 22, 555, 57, 633], // LATIN CAPITAL LETTER J
    0x4b: [683, 0, 849, 31, 889], // LATIN CAPITAL LETTER K
    0x4c: [683, 0, 681, 32, 647], // LATIN CAPITAL LETTER L
    0x4d: [683, 0, 970, 35, 1051], // LATIN CAPITAL LETTER M
    0x4e: [683, 0, 803, 31, 888], // LATIN CAPITAL LETTER N
    0x4f: [704, 22, 763, 50, 740], // LATIN CAPITAL LETTER O
    0x50: [683, 0, 642, 33, 751], // LATIN CAPITAL LETTER P
    0x51: [704, 194, 791, 50, 740], // LATIN CAPITAL LETTER Q
    0x52: [683, 21, 759, 33, 755], // LATIN CAPITAL LETTER R
    0x53: [705, 22, 613, 52, 645], // LATIN CAPITAL LETTER S
    0x54: [677, 0, 584, 21, 704], // LATIN CAPITAL LETTER T
    0x55: [683, 22, 683, 60, 767], // LATIN CAPITAL LETTER U
    0x56: [683, 22, 583, 52, 769], // LATIN CAPITAL LETTER V
    0x57: [683, 22, 944, 51, 1048], // LATIN CAPITAL LETTER W
    0x58: [683, 0, 828, 26, 852], // LATIN CAPITAL LETTER X
    0x59: [683, -1, 581, 30, 763], // LATIN CAPITAL LETTER Y
    0x5a: [683, 0, 683, 58, 723], // LATIN CAPITAL LETTER Z
    0x61: [441, 10, 529, 33, 506], // LATIN SMALL LETTER A
    0x62: [694, 11, 429, 40, 422], // LATIN SMALL LETTER B
    0x63: [442, 11, 433, 34, 429], // LATIN SMALL LETTER C
    0x64: [694, 10, 520, 33, 523], // LATIN SMALL LETTER D
    0x65: [442, 11, 466, 39, 429], // LATIN SMALL LETTER E
    0x66: [705, 205, 490, 55, 550], // LATIN SMALL LETTER F
    0x67: [442, 205, 477, 10, 480], // LATIN SMALL LETTER G
    0x68: [694, 11, 576, 48, 555], // LATIN SMALL LETTER H
    0x69: [661, 11, 345, 21, 302], // LATIN SMALL LETTER I
    0x6a: [661, 204, 412, -12, 403], // LATIN SMALL LETTER J
    0x6b: [694, 11, 521, 48, 503], // LATIN SMALL LETTER K
    0x6c: [694, 11, 298, 38, 266], // LATIN SMALL LETTER L
    0x6d: [442, 11, 878, 21, 857], // LATIN SMALL LETTER M
    0x6e: [442, 11, 600, 21, 580], // LATIN SMALL LETTER N
    0x6f: [441, 11, 485, 34, 476], // LATIN SMALL LETTER O
    0x70: [442, 194, 503, -39, 497], // LATIN SMALL LETTER P
    0x71: [442, 194, 446, 33, 460], // LATIN SMALL LETTER Q
    0x72: [442, 11, 451, 21, 430], // LATIN SMALL LETTER R
    0x73: [442, 10, 469, 53, 419], // LATIN SMALL LETTER S
    0x74: [626, 11, 361, 19, 330], // LATIN SMALL LETTER T
    0x75: [442, 11, 572, 21, 551], // LATIN SMALL LETTER U
    0x76: [443, 11, 485, 21, 467], // LATIN SMALL LETTER V
    0x77: [443, 11, 716, 21, 690], // LATIN SMALL LETTER W
    0x78: [442, 11, 572, 35, 522], // LATIN SMALL LETTER X
    0x79: [442, 205, 490, 21, 496], // LATIN SMALL LETTER Y
    0x7a: [442, 11, 465, 35, 468], // LATIN SMALL LETTER Z
    0xa0: [0, 0, 250, 0, 0], // NO-BREAK SPACE
    0x393: [680, -1, 615, 31, 721], // GREEK CAPITAL LETTER GAMMA
    0x394: [716, 0, 833, 48, 788], // GREEK CAPITAL LETTER DELTA
    0x398: [704, 22, 763, 50, 740], // GREEK CAPITAL LETTER THETA
    0x39b: [716, 0, 694, 35, 670], // GREEK CAPITAL LETTER LAMDA
    0x39e: [677, 0, 742, 53, 777], // GREEK CAPITAL LETTER XI
    0x3a0: [680, 0, 831, 31, 887], // GREEK CAPITAL LETTER PI
    0x3a3: [683, 0, 780, 58, 806], // GREEK CAPITAL LETTER SIGMA
    0x3a5: [705, 0, 583, 28, 700], // GREEK CAPITAL LETTER UPSILON
    0x3a6: [683, 0, 667, 24, 642], // GREEK CAPITAL LETTER PHI
    0x3a8: [683, 0, 612, 21, 692], // GREEK CAPITAL LETTER PSI
    0x3a9: [704, 0, 772, 80, 786], // GREEK CAPITAL LETTER OMEGA
    0x3b1: [442, 11, 640, 34, 603], // GREEK SMALL LETTER ALPHA
    0x3b2: [705, 194, 566, 23, 573], // GREEK SMALL LETTER BETA
    0x3b3: [441, 216, 518, 11, 543], // GREEK SMALL LETTER GAMMA
    0x3b4: [717, 10, 444, 36, 451], // GREEK SMALL LETTER DELTA
    0x3b5: [452, 22, 466, 27, 428], // GREEK SMALL LETTER EPSILON
    0x3b6: [704, 204, 438, 44, 471], // GREEK SMALL LETTER ZETA
    0x3b7: [442, 216, 497, 21, 503], // GREEK SMALL LETTER ETA
    0x3b8: [705, 10, 469, 35, 462], // GREEK SMALL LETTER THETA
    0x3b9: [442, 10, 354, 48, 332], // GREEK SMALL LETTER IOTA
    0x3ba: [442, 11, 576, 49, 554], // GREEK SMALL LETTER KAPPA
    0x3bb: [694, 12, 583, 47, 556], // GREEK SMALL LETTER LAMDA
    0x3bc: [442, 216, 603, 23, 580], // GREEK SMALL LETTER MU
    0x3bd: [442, 2, 494, 45, 530], // GREEK SMALL LETTER NU
    0x3be: [704, 205, 438, 21, 443], // GREEK SMALL LETTER XI
    0x3bf: [441, 11, 485, 34, 476], // GREEK SMALL LETTER OMICRON
    0x3c0: [431, 11, 570, 19, 573], // GREEK SMALL LETTER PI
    0x3c1: [442, 216, 517, 23, 510], // GREEK SMALL LETTER RHO
    0x3c2: [442, 107, 363, 31, 405], // GREEK SMALL LETTER FINAL SIGMA
    0x3c3: [431, 11, 571, 31, 572], // GREEK SMALL LETTER SIGMA
    0x3c4: [431, 13, 437, 18, 517], // GREEK SMALL LETTER TAU
    0x3c5: [443, 10, 540, 21, 523], // GREEK SMALL LETTER UPSILON
    0x3c6: [442, 218, 654, 50, 618], // GREEK SMALL LETTER PHI
    0x3c7: [442, 204, 626, 25, 600], // GREEK SMALL LETTER CHI
    0x3c8: [694, 205, 651, 21, 634], // GREEK SMALL LETTER PSI
    0x3c9: [443, 11, 622, 15, 604], // GREEK SMALL LETTER OMEGA
    0x3d1: [705, 11, 591, 21, 563], // GREEK THETA SYMBOL
    0x3d5: [694, 205, 596, 43, 579], // GREEK PHI SYMBOL
    0x3d6: [431, 10, 828, 19, 823], // GREEK PI SYMBOL
    0x3f1: [442, 194, 517, 67, 510], // GREEK RHO SYMBOL
    0x3f5: [431, 11, 406, 40, 382] // GREEK LUNATE EPSILON SYMBOL
  };

  HTMLCSS.FONTDATA.FONTS["MathJax_Size1"] = {
    directory: "Size1/Regular",
    family: "MathJax_Size1",
    testString: "() [] {}",
    0x20: [0, 0, 250, 0, 0], // SPACE
    0x28: [850, 349, 458, 152, 422], // LEFT PARENTHESIS
    0x29: [850, 349, 458, 35, 305], // RIGHT PARENTHESIS
    0x2f: [850, 349, 578, 55, 522], // SOLIDUS
    0x5b: [850, 349, 417, 202, 394], // LEFT SQUARE BRACKET
    0x5c: [850, 349, 578, 54, 522], // REVERSE SOLIDUS
    0x5d: [850, 349, 417, 22, 214], // RIGHT SQUARE BRACKET
    0x7b: [850, 349, 583, 105, 477], // LEFT CURLY BRACKET
    0x7d: [850, 349, 583, 105, 477], // RIGHT CURLY BRACKET
    0xa0: [0, 0, 250, 0, 0], // NO-BREAK SPACE
    0x2c6: [744, -551, 556, -8, 564], // MODIFIER LETTER CIRCUMFLEX ACCENT
    0x2dc: [722, -597, 556, 1, 554], // SMALL TILDE
    0x302: [744, -551, 0, -564, 8], // COMBINING CIRCUMFLEX ACCENT
    0x303: [722, -597, 0, -555, -2], // COMBINING TILDE
    0x2016: [602, 0, 778, 257, 521], // DOUBLE VERTICAL LINE
    0x2191: [600, 0, 667, 112, 555], // UPWARDS ARROW
    0x2193: [600, 0, 667, 112, 555], // DOWNWARDS ARROW
    0x21d1: [599, 0, 778, 57, 721], // UPWARDS DOUBLE ARROW
    0x21d3: [600, -1, 778, 57, 721], // DOWNWARDS DOUBLE ARROW
    0x220f: [750, 250, 944, 55, 888], // N-ARY PRODUCT
    0x2210: [750, 250, 944, 55, 888], // N-ARY COPRODUCT
    0x2211: [750, 250, 1056, 56, 999], // N-ARY SUMMATION
    0x221a: [850, 350, 1000, 111, 1020], // SQUARE ROOT
    0x2223: [627, 15, 333, 145, 188], // DIVIDES
    0x2225: [627, 15, 556, 145, 410], // PARALLEL TO
    0x222b: [805, 306, 472, 55, 610], // INTEGRAL
    0x222c: [805, 306, 819, 55, 957], // DOUBLE INTEGRAL
    0x222d: [805, 306, 1166, 55, 1304], // TRIPLE INTEGRAL
    0x222e: [805, 306, 472, 55, 610], // CONTOUR INTEGRAL
    0x22c0: [750, 249, 833, 55, 777], // N-ARY LOGICAL AND
    0x22c1: [750, 249, 833, 55, 777], // N-ARY LOGICAL OR
    0x22c2: [750, 249, 833, 55, 777], // N-ARY INTERSECTION
    0x22c3: [750, 249, 833, 55, 777], // N-ARY UNION
    0x2308: [850, 349, 472, 202, 449], // LEFT CEILING
    0x2309: [850, 349, 472, 22, 269], // RIGHT CEILING
    0x230a: [850, 349, 472, 202, 449], // LEFT FLOOR
    0x230b: [850, 349, 472, 22, 269], // RIGHT FLOOR
    0x23d0: [602, 0, 667, 312, 355], // VERTICAL LINE EXTENSION (used to extend arrows)
    0x27e8: [850, 350, 472, 97, 394], // MATHEMATICAL LEFT ANGLE BRACKET
    0x27e9: [850, 350, 472, 77, 374], // MATHEMATICAL RIGHT ANGLE BRACKET
    0x2a00: [750, 250, 1111, 56, 1054], // N-ARY CIRCLED DOT OPERATOR
    0x2a01: [750, 250, 1111, 56, 1054], // N-ARY CIRCLED PLUS OPERATOR
    0x2a02: [750, 250, 1111, 56, 1054], // N-ARY CIRCLED TIMES OPERATOR
    0x2a04: [750, 249, 833, 55, 777], // N-ARY UNION OPERATOR WITH PLUS
    0x2a06: [750, 249, 833, 55, 777] // N-ARY SQUARE UNION OPERATOR
  };

  HTMLCSS.FONTDATA.FONTS["MathJax_Size2"] = {
    directory: "Size2/Regular",
    family: "MathJax_Size2",
    testString: "() [] {}",
    0x20: [0, 0, 250, 0, 0], // SPACE
    0x28: [1150, 649, 597, 180, 561], // LEFT PARENTHESIS
    0x29: [1150, 649, 597, 35, 416], // RIGHT PARENTHESIS
    0x2f: [1150, 649, 811, 56, 754], // SOLIDUS
    0x5b: [1150, 649, 472, 224, 455], // LEFT SQUARE BRACKET
    0x5c: [1150, 649, 811, 54, 754], // REVERSE SOLIDUS
    0x5d: [1150, 649, 472, 16, 247], // RIGHT SQUARE BRACKET
    0x7b: [1150, 649, 667, 119, 547], // LEFT CURLY BRACKET
    0x7d: [1150, 649, 667, 119, 547], // RIGHT CURLY BRACKET
    0xa0: [0, 0, 250, 0, 0], // NO-BREAK SPACE
    0x2c6: [772, -565, 1000, -5, 1004], // MODIFIER LETTER CIRCUMFLEX ACCENT
    0x2dc: [750, -611, 1000, 0, 999], // SMALL TILDE
    0x302: [772, -565, 0, -1005, 4], // COMBINING CIRCUMFLEX ACCENT
    0x303: [750, -611, 0, -1000, -1], // COMBINING TILDE
    0x220f: [950, 450, 1278, 56, 1221], // N-ARY PRODUCT
    0x2210: [950, 450, 1278, 56, 1221], // N-ARY COPRODUCT
    0x2211: [950, 450, 1444, 55, 1388], // N-ARY SUMMATION
    0x221a: [1150, 650, 1000, 111, 1020], // SQUARE ROOT
    0x222b: [1360, 862, 556, 55, 944], // INTEGRAL
    0x222c: [1360, 862, 1084, 55, 1472], // DOUBLE INTEGRAL
    0x222d: [1360, 862, 1592, 55, 1980], // TRIPLE INTEGRAL
    0x222e: [1360, 862, 556, 55, 944], // CONTOUR INTEGRAL
    0x22c0: [950, 450, 1111, 55, 1055], // N-ARY LOGICAL AND
    0x22c1: [950, 450, 1111, 55, 1055], // N-ARY LOGICAL OR
    0x22c2: [949, 450, 1111, 55, 1055], // N-ARY INTERSECTION
    0x22c3: [950, 449, 1111, 55, 1055], // N-ARY UNION
    0x2308: [1150, 649, 528, 224, 511], // LEFT CEILING
    0x2309: [1150, 649, 528, 16, 303], // RIGHT CEILING
    0x230a: [1150, 649, 528, 224, 511], // LEFT FLOOR
    0x230b: [1150, 649, 528, 16, 303], // RIGHT FLOOR
    0x27e8: [1150, 649, 611, 112, 524], // MATHEMATICAL LEFT ANGLE BRACKET
    0x27e9: [1150, 649, 611, 85, 498], // MATHEMATICAL RIGHT ANGLE BRACKET
    0x2a00: [949, 449, 1511, 56, 1454], // N-ARY CIRCLED DOT OPERATOR
    0x2a01: [949, 449, 1511, 56, 1454], // N-ARY CIRCLED PLUS OPERATOR
    0x2a02: [949, 449, 1511, 56, 1454], // N-ARY CIRCLED TIMES OPERATOR
    0x2a04: [950, 449, 1111, 55, 1055], // N-ARY UNION OPERATOR WITH PLUS
    0x2a06: [950, 450, 1111, 55, 1055] // N-ARY SQUARE UNION OPERATOR
  };

  HTMLCSS.FONTDATA.FONTS["MathJax_Size3"] = {
    directory: "Size3/Regular",
    family: "MathJax_Size3",
    testString: "() [] {}",
    0x20: [0, 0, 250, 0, 0], // SPACE
    0x28: [1450, 949, 736, 209, 701], // LEFT PARENTHESIS
    0x29: [1450, 949, 736, 34, 526], // RIGHT PARENTHESIS
    0x2f: [1450, 949, 1044, 55, 989], // SOLIDUS
    0x5b: [1450, 949, 528, 247, 516], // LEFT SQUARE BRACKET
    0x5c: [1450, 949, 1044, 56, 988], // REVERSE SOLIDUS
    0x5d: [1450, 949, 528, 11, 280], // RIGHT SQUARE BRACKET
    0x7b: [1450, 949, 750, 130, 618], // LEFT CURLY BRACKET
    0x7d: [1450, 949, 750, 131, 618], // RIGHT CURLY BRACKET
    0xa0: [0, 0, 250, 0, 0], // NO-BREAK SPACE
    0x2c6: [772, -564, 1444, -4, 1447], // MODIFIER LETTER CIRCUMFLEX ACCENT
    0x2dc: [749, -610, 1444, 1, 1442], // SMALL TILDE
    0x302: [772, -564, 0, -1448, 3], // COMBINING CIRCUMFLEX ACCENT
    0x303: [749, -610, 0, -1443, -2], // COMBINING TILDE
    0x221a: [1450, 950, 1000, 111, 1020], // SQUARE ROOT
    0x2308: [1450, 949, 583, 246, 571], // LEFT CEILING
    0x2309: [1450, 949, 583, 11, 336], // RIGHT CEILING
    0x230a: [1450, 949, 583, 246, 571], // LEFT FLOOR
    0x230b: [1450, 949, 583, 11, 336], // RIGHT FLOOR
    0x27e8: [1450, 950, 750, 126, 654], // MATHEMATICAL LEFT ANGLE BRACKET
    0x27e9: [1450, 949, 750, 94, 623] // MATHEMATICAL RIGHT ANGLE BRACKET
  };

  HTMLCSS.FONTDATA.FONTS["MathJax_Size4"] = {
    directory: "Size4/Regular",
    family: "MathJax_Size4",
    testString: "() [] {}",
    0x20: [0, 0, 250, 0, 0], // SPACE
    0x28: [1750, 1249, 792, 237, 758], // LEFT PARENTHESIS
    0x29: [1750, 1249, 792, 33, 554], // RIGHT PARENTHESIS
    0x2f: [1750, 1249, 1278, 56, 1221], // SOLIDUS
    0x5b: [1750, 1249, 583, 269, 577], // LEFT SQUARE BRACKET
    0x5c: [1750, 1249, 1278, 56, 1221], // REVERSE SOLIDUS
    0x5d: [1750, 1249, 583, 5, 313], // RIGHT SQUARE BRACKET
    0x7b: [1750, 1249, 806, 144, 661], // LEFT CURLY BRACKET
    0x7d: [1750, 1249, 806, 144, 661], // RIGHT CURLY BRACKET
    0xa0: [0, 0, 250, 0, 0], // NO-BREAK SPACE
    0x2c6: [845, -561, 1889, -14, 1902], // MODIFIER LETTER CIRCUMFLEX ACCENT
    0x2dc: [823, -583, 1889, 1, 1885], // SMALL TILDE
    0x302: [845, -561, 0, -1903, 13], // COMBINING CIRCUMFLEX ACCENT
    0x303: [823, -583, 0, -1888, -4], // COMBINING TILDE
    0x221a: [1750, 1250, 1000, 111, 1020], // SQUARE ROOT
    0x2308: [1750, 1249, 639, 269, 633], // LEFT CEILING
    0x2309: [1750, 1249, 639, 5, 369], // RIGHT CEILING
    0x230a: [1750, 1249, 639, 269, 633], // LEFT FLOOR
    0x230b: [1750, 1249, 639, 5, 369], // RIGHT FLOOR
    0x239b: [1154, 655, 875, 291, 843], // LEFT PARENTHESIS UPPER HOOK
    0x239c: [610, 10, 875, 291, 417], // LEFT PARENTHESIS EXTENSION
    0x239d: [1165, 644, 875, 291, 843], // LEFT PARENTHESIS LOWER HOOK
    0x239e: [1154, 655, 875, 31, 583], // RIGHT PARENTHESIS UPPER HOOK
    0x239f: [610, 10, 875, 457, 583], // RIGHT PARENTHESIS EXTENSION
    0x23a0: [1165, 644, 875, 31, 583], // RIGHT PARENTHESIS LOWER HOOK
    0x23a1: [1154, 645, 667, 319, 666], // LEFT SQUARE BRACKET UPPER CORNER
    0x23a2: [602, 0, 667, 319, 403], // LEFT SQUARE BRACKET EXTENSION
    0x23a3: [1155, 644, 667, 319, 666], // LEFT SQUARE BRACKET LOWER CORNER
    0x23a4: [1154, 645, 667, 0, 347], // RIGHT SQUARE BRACKET UPPER CORNER
    0x23a5: [602, 0, 667, 263, 347], // RIGHT SQUARE BRACKET EXTENSION
    0x23a6: [1155, 644, 667, 0, 347], // RIGHT SQUARE BRACKET LOWER CORNER
    0x23a7: [899, 10, 889, 384, 718], // LEFT CURLY BRACKET UPPER HOOK
    0x23a8: [1160, 660, 889, 170, 504], // LEFT CURLY BRACKET MIDDLE PIECE
    0x23a9: [10, 899, 889, 384, 718], // LEFT CURLY BRACKET LOWER HOOK
    0x23aa: [310, 10, 889, 384, 504], // CURLY BRACKET EXTENSION
    0x23ab: [899, 10, 889, 170, 504], // RIGHT CURLY BRACKET UPPER HOOK
    0x23ac: [1160, 660, 889, 384, 718], // RIGHT CURLY BRACKET MIDDLE PIECE
    0x23ad: [10, 899, 889, 170, 504], // RIGHT CURLY BRACKET LOWER HOOK
    0x23b7: [935, 885, 1056, 111, 742], // RADICAL SYMBOL BOTTOM
    0x27e8: [1750, 1248, 806, 140, 703], // MATHEMATICAL LEFT ANGLE BRACKET
    0x27e9: [1750, 1248, 806, 103, 665], // MATHEMATICAL RIGHT ANGLE BRACKET
    0xe000: [625, 14, 1056, 702, 742], // stix-radical symbol vertical extender
    0xe001: [605, 14, 1056, 702, 1076], // stix-radical symbol top corner piece
    0xe150: [120, 213, 450, -24, 460], // stix-horizontal brace, down left piece
    0xe151: [120, 213, 450, -10, 474], // stix-horizontal brace, down right piece
    0xe152: [333, 0, 450, -24, 460], // stix-horizontal brace, upper left piece
    0xe153: [333, 0, 450, -10, 474], // stix-horizontal brace, upper right piece
    0xe154: [120, 0, 400, -10, 410] // stix-oblique open face capital letter A
  };

  HTMLCSS.FONTDATA.FONTS[MAIN][0x2212][0] =
    HTMLCSS.FONTDATA.FONTS[MAIN][0x002b][0]; // minus is sized as plus
  HTMLCSS.FONTDATA.FONTS[MAIN][0x2212][1] =
    HTMLCSS.FONTDATA.FONTS[MAIN][0x002b][1]; // minus is sized as plus
  HTMLCSS.FONTDATA.FONTS[MAIN][0x22ee][0] += 400; // adjust height for \vdots
  HTMLCSS.FONTDATA.FONTS[MAIN][0x22f1][0] += 700; // adjust height for \ddots
  HTMLCSS.FONTDATA.FONTS[SIZE4][0xe154][0] += 200; // adjust height for brace extender
  HTMLCSS.FONTDATA.FONTS[SIZE4][0xe154][1] += 200; // adjust depth for brace extender
  HTMLCSS.FONTDATA.FONTS[MAIN][0x2245][2] -= 222; // fix error in character's right bearing
  HTMLCSS.FONTDATA.FONTS[MAIN][0x2245][5] = { rfix: -222 }; // fix error in character's right bearing
  MathJax.Hub.Register.LoadHook(
    HTMLCSS.fontDir + "/Main/Bold/MathOperators.js",
    function() {
      HTMLCSS.FONTDATA.FONTS[BOLD][0x2245][2] -= 106; // fix error in character's right bearing
      HTMLCSS.FONTDATA.FONTS[BOLD][0x2245][5] = { rfix: -106 }; // fix error in character's right bearing
    }
  );
  MathJax.Hub.Register.LoadHook(
    HTMLCSS.fontDir + "/Typewriter/Regular/BasicLatin.js",
    function() {
      HTMLCSS.FONTDATA.FONTS["MathJax_Typewriter"][0x20][2] += 275; // fix error in character width
      HTMLCSS.FONTDATA.FONTS["MathJax_Typewriter"][0x20][5] = { rfix: 275 }; // fix error in character width
    }
  );
  MathJax.Hub.Register.LoadHook(
    HTMLCSS.fontDir + "/Typewriter/Regular/Other.js",
    function() {
      HTMLCSS.FONTDATA.FONTS["MathJax_Typewriter"][0xa0][2] += 275; // fix error in character width
      HTMLCSS.FONTDATA.FONTS["MathJax_Typewriter"][0xa0][5] = { rfix: 275 }; // fix error in character width
    }
  );

  //
  //  Add some spacing characters (more will come later)
  //
  MathJax.Hub.Insert(HTMLCSS.FONTDATA.FONTS[MAIN], {
    0xeee0: [0, 0, -575, 0, 0, { space: 1 }],
    0xeee1: [0, 0, -300, 0, 0, { space: 1 }],
    0xeee8: [0, 0, 25, 0, 0, { space: 1 }]
  });

  if (!HTMLCSS.imgFonts) {
    MathJax.Hub.Browser.Select({
      MSIE: function(browser) {
        if (
          HTMLCSS.config.availableFonts &&
          HTMLCSS.config.availableFonts.length
        ) {
          HTMLCSS.FONTDATA.REMAP[0x2c9] = 0xaf; // macron
          HTMLCSS.FONTDATA.REMAP[0x2ca] = 0xb4; // acute
          HTMLCSS.FONTDATA.REMAP[0x2cb] = 0x60; // grave
          HTMLCSS.FONTDATA.REMAP[0x2da] = 0xb0; // ring above

          var testString =
            String.fromCharCode(0x393) +
            " " +
            String.fromCharCode(0x3a5) +
            " " +
            String.fromCharCode(0x39b);

          HTMLCSS.FONTDATA.RANGES.push({
            name: "IEgreek",
            low: 0x03b1,
            high: 0x03c9,
            offset: "IEG",
            add: 32
          });
          HTMLCSS.FONTDATA.RANGES.push({
            name: "IEGreek",
            low: 0x0391,
            high: 0x03f6,
            offset: "IEG"
          });

          if (
            HTMLCSS.Font.testFont({
              family: "MathJax_Greek",
              testString: testString
            })
          ) {
            HTMLCSS.Augment({
              FONTDATA: {
                VARIANT: {
                  normal: { offsetIEG: 0x391, variantIEG: "-Greek" },
                  fraktur: { offsetIEG: 0x391, variantIEG: "-Greek" },
                  script: { offsetIEG: 0x391, variantIEG: "-Greek" },
                  "-tex-caligraphic": {
                    offsetIEG: 0x391,
                    variantIEG: "-Greek"
                  },
                  "-tex-oldstyle": { offsetIEG: 0x391, variantIEG: "-Greek" },
                  "-Greek": { fonts: ["MathJax_Greek"] }
                }
              }
            });

            HTMLCSS.FONTDATA.FONTS["MathJax_Greek"] = {
              directory: "Greek/Regular",
              family: "MathJax_Greek",
              testString: "\u0393 \u03A5 \u039B",
              0x20: [0, 0, 250, 0, 0], // SPACE
              0xa0: [0, 0, 250, 0, 0], // NO-BREAK SPACE
              0x393: [680, 0, 625, 25, 582], // GREEK CAPITAL LETTER GAMMA
              0x394: [716, 0, 833, 46, 786], // GREEK CAPITAL LETTER DELTA
              0x398: [705, 22, 778, 56, 722], // GREEK CAPITAL LETTER THETA
              0x39b: [716, 0, 694, 32, 661], // GREEK CAPITAL LETTER LAMDA
              0x39e: [677, 0, 667, 42, 624], // GREEK CAPITAL LETTER XI
              0x3a0: [680, 0, 750, 25, 724], // GREEK CAPITAL LETTER PI
              0x3a3: [683, 0, 722, 55, 666], // GREEK CAPITAL LETTER SIGMA
              0x3a5: [705, 0, 778, 55, 722], // GREEK CAPITAL LETTER UPSILON
              0x3a6: [683, 0, 722, 56, 665], // GREEK CAPITAL LETTER PHI
              0x3a8: [683, 0, 778, 55, 722], // GREEK CAPITAL LETTER PSI
              0x3a9: [704, 0, 722, 44, 677] // GREEK CAPITAL LETTER OMEGA
            };
          }

          if (
            HTMLCSS.Font.testFont({
              family: "MathJax_Greek",
              weight: "bold",
              testString: testString
            })
          ) {
            HTMLCSS.Augment({
              FONTDATA: {
                VARIANT: {
                  bold: { offsetIEG: 0x391, variantIEG: "-Greek-Bold" },
                  "bold-fraktur": {
                    offsetIEG: 0x391,
                    variantIEG: "-Greek-Bold"
                  },
                  "bold-script": {
                    offsetIEG: 0x391,
                    variantIEG: "-Greek-Bold"
                  },
                  "-Greek-Bold": { fonts: ["MathJax_Greek-bold"] }
                }
              }
            });

            HTMLCSS.FONTDATA.FONTS["MathJax_Greek-bold"] = {
              directory: "Greek/Bold",
              family: "MathJax_Greek",
              weight: "bold",
              testString: "\u0393 \u03A5 \u039B",
              0x20: [0, 0, 250, 0, 0], // SPACE
              0xa0: [0, 0, 250, 0, 0], // NO-BREAK SPACE
              0x393: [680, 0, 692, 39, 643], // GREEK CAPITAL LETTER GAMMA
              0x394: [698, 0, 958, 56, 901], // GREEK CAPITAL LETTER DELTA
              0x398: [696, 10, 894, 64, 829], // GREEK CAPITAL LETTER THETA
              0x39b: [698, 0, 806, 40, 765], // GREEK CAPITAL LETTER LAMDA
              0x39e: [675, 0, 767, 48, 718], // GREEK CAPITAL LETTER XI
              0x3a0: [680, 0, 900, 39, 860], // GREEK CAPITAL LETTER PI
              0x3a3: [686, 0, 831, 64, 766], // GREEK CAPITAL LETTER SIGMA
              0x3a5: [697, 0, 894, 64, 829], // GREEK CAPITAL LETTER UPSILON
              0x3a6: [686, 0, 831, 64, 766], // GREEK CAPITAL LETTER PHI
              0x3a8: [686, 0, 894, 64, 829], // GREEK CAPITAL LETTER PSI
              0x3a9: [696, 1, 831, 51, 779] // GREEK CAPITAL LETTER OMEGA
            };
          }

          if (
            HTMLCSS.Font.testFont({
              family: "MathJax_Greek",
              style: "italic",
              testString: testString
            })
          ) {
            HTMLCSS.Augment({
              FONTDATA: {
                VARIANT: {
                  italic: { offsetIEG: 0x391, variantIEG: "-Greek-Italic" },
                  "-Greek-Italic": { fonts: ["MathJax_Greek-italic"] }
                }
              }
            });

            HTMLCSS.FONTDATA.FONTS["MathJax_Greek-italic"] = {
              directory: "Greek/Italic",
              family: "MathJax_Greek",
              style: "italic",
              testString: "\u0393 \u03A5 \u039B",
              skew: {
                0x393: 0.0833,
                0x394: 0.167,
                0x398: 0.0833,
                0x39b: 0.167,
                0x39e: 0.0833,
                0x3a0: 0.0556,
                0x3a3: 0.0833,
                0x3a5: 0.0556,
                0x3a6: 0.0833,
                0x3a8: 0.0556,
                0x3a9: 0.0833,
                0x3b1: 0.0278,
                0x3b2: 0.0833,
                0x3b4: 0.0556,
                0x3b5: 0.0833,
                0x3b6: 0.0833,
                0x3b7: 0.0556,
                0x3b8: 0.0833,
                0x3b9: 0.0556,
                0x3bc: 0.0278,
                0x3bd: 0.0278,
                0x3be: 0.111,
                0x3bf: 0.0556,
                0x3c1: 0.0833,
                0x3c2: 0.0833,
                0x3c4: 0.0278,
                0x3c5: 0.0278,
                0x3c6: 0.0833,
                0x3c7: 0.0556,
                0x3c8: 0.111,
                0x3d1: 0.0833,
                0x3d5: 0.0833,
                0x3f1: 0.0833,
                0x3f5: 0.0556
              },
              0x20: [0, 0, 250, 0, 0], // SPACE
              0xa0: [0, 0, 250, 0, 0], // NO-BREAK SPACE
              0x393: [680, -1, 615, 31, 721], // GREEK CAPITAL LETTER GAMMA
              0x394: [716, 0, 833, 48, 788], // GREEK CAPITAL LETTER DELTA
              0x398: [704, 22, 763, 50, 740], // GREEK CAPITAL LETTER THETA
              0x39b: [716, 0, 694, 35, 670], // GREEK CAPITAL LETTER LAMDA
              0x39e: [678, 0, 742, 53, 777], // GREEK CAPITAL LETTER XI
              0x3a0: [681, 0, 831, 31, 887], // GREEK CAPITAL LETTER PI
              0x3a3: [683, 0, 780, 58, 806], // GREEK CAPITAL LETTER SIGMA
              0x3a5: [705, 0, 583, 28, 700], // GREEK CAPITAL LETTER UPSILON
              0x3a6: [683, 0, 667, 24, 642], // GREEK CAPITAL LETTER PHI
              0x3a8: [683, 0, 612, 21, 692], // GREEK CAPITAL LETTER PSI
              0x3a9: [704, 0, 772, 80, 786], // GREEK CAPITAL LETTER OMEGA
              0x3b1: [442, 11, 640, 34, 603], // GREEK SMALL LETTER ALPHA
              0x3b2: [705, 194, 566, 23, 573], // GREEK SMALL LETTER BETA
              0x3b3: [441, 216, 518, 11, 543], // GREEK SMALL LETTER GAMMA
              0x3b4: [717, 10, 444, 36, 451], // GREEK SMALL LETTER DELTA
              0x3b5: [452, 22, 466, 27, 428], // GREEK SMALL LETTER EPSILON
              0x3b6: [704, 204, 438, 44, 471], // GREEK SMALL LETTER ZETA
              0x3b7: [442, 216, 497, 21, 503], // GREEK SMALL LETTER ETA
              0x3b8: [705, 10, 469, 35, 462], // GREEK SMALL LETTER THETA
              0x3b9: [442, 10, 354, 48, 332], // GREEK SMALL LETTER IOTA
              0x3ba: [442, 11, 576, 49, 554], // GREEK SMALL LETTER KAPPA
              0x3bb: [694, 12, 583, 47, 556], // GREEK SMALL LETTER LAMDA
              0x3bc: [442, 216, 603, 23, 580], // GREEK SMALL LETTER MU
              0x3bd: [442, 2, 494, 45, 530], // GREEK SMALL LETTER NU
              0x3be: [704, 205, 438, 21, 443], // GREEK SMALL LETTER XI
              0x3bf: [441, 11, 485, 34, 476], // GREEK SMALL LETTER OMICRON
              0x3c0: [431, 11, 570, 19, 573], // GREEK SMALL LETTER PI
              0x3c1: [442, 216, 517, 23, 510], // GREEK SMALL LETTER RHO
              0x3c2: [442, 107, 363, 31, 405], // GREEK SMALL LETTER FINAL SIGMA
              0x3c3: [431, 11, 571, 31, 572], // GREEK SMALL LETTER SIGMA
              0x3c4: [431, 13, 437, 18, 517], // GREEK SMALL LETTER TAU
              0x3c5: [443, 10, 540, 21, 523], // GREEK SMALL LETTER UPSILON
              0x3c6: [442, 218, 654, 50, 618], // GREEK SMALL LETTER PHI
              0x3c7: [442, 204, 626, 25, 600], // GREEK SMALL LETTER CHI
              0x3c8: [694, 205, 651, 21, 634], // GREEK SMALL LETTER PSI
              0x3c9: [443, 11, 622, 15, 604], // GREEK SMALL LETTER OMEGA
              0x3d1: [705, 11, 591, 21, 563], // GREEK THETA SYMBOL
              0x3d5: [694, 205, 596, 43, 579], // GREEK PHI SYMBOL
              0x3d6: [431, 10, 828, 19, 823], // GREEK PI SYMBOL
              0x3f1: [442, 194, 517, 67, 510], // GREEK RHO SYMBOL
              0x3f5: [431, 11, 406, 40, 382] // GREEK LUNATE EPSILON SYMBOL
            };
          }

          if (
            HTMLCSS.Font.testFont({
              family: "MathJax_Greek",
              weight: "bold",
              style: "italic",
              testString: testString
            })
          ) {
            HTMLCSS.Augment({
              FONTDATA: {
                VARIANT: {
                  "bold-italic": {
                    offsetG: 0x391,
                    variantG: "-Greek-Bold-Italic"
                  },
                  "-Greek-Bold-Italic": { fonts: ["MathJax_Greek-bold-italic"] }
                },
                FONTS: {
                  "MathJax_Greek-bold-italic": "Greek/BoldItalic/Main.js"
                }
              }
            });
          }
        }

        if (HTMLCSS.msieIE6) {
          var WinIE6 = "MathJax_WinIE6";
          HTMLCSS.FONTDATA.FONTS[WinIE6] = "WinIE6/Regular/Main.js";
          HTMLCSS.FONTDATA.RANGES.push({
            name: "arrows",
            low: 0x2190,
            high: 0x2199,
            offset: "AR"
          });

          var REMAP = {
            variant: "-WinIE6",
            0x21d2: 0xe20a,
            0x21d4: 0xe20b, // \Rightarrow, \Leftrightarrow
            0x2200: 0xe20c,
            0x2202: 0xe20d,
            0x2203: 0xe20e,
            0x2207: 0xe20f, // \forall, \partial, \exists, \nabla
            0x2208: 0xe210,
            0x220b: 0xe211,
            0x2215: 0xe212,
            0x221a: 0xe213, // \in, \ni, /, \surd
            0x221d: 0xe214,
            0x221e: 0xe215,
            0x2220: 0xe216,
            0x2223: 0xe217, // \propto, \infty, \angle, \vert
            0x2225: 0xe218,
            0x2227: 0xe219,
            0x2228: 0xe21a,
            0x2229: 0xe21b, // \Vert, \wedge, \vee, \cap
            0x222a: 0xe21c,
            0x222b: 0xe21d,
            0x223c: 0xe21e,
            0x2248: 0xe21f, // \cup, \int, \sim, \approx
            0x2260: 0xe220,
            0x2261: 0xe221,
            0x2264: 0xe222,
            0x2265: 0xe223, // \ne, \equiv, \le, \ge
            0x226a: 0xe224,
            0x226b: 0xe225,
            0x2282: 0xe226,
            0x2283: 0xe227, // \ll, \gg, \subset, \supset
            0x2286: 0xe228,
            0x2287: 0xe229,
            0x2295: 0xe22a,
            0x2299: 0xe22b, // \subseteq, \supseteq, \oplus, \odot
            0x22a5: 0xe22c,
            0x25b3: 0xe22d,
            0x25bd: 0xe22e,
            0x25ef: 0xe22f, // \bot, \bigtriangleup, \bigtriangledown, \bigcirc
            0x2660: 0xe230,
            0x2661: 0xe231,
            0x2662: 0xe232,
            0x2663: 0xe233, // \spadesuit, \heartsuit, \diamondsuit, \clubsuit
            0x266d: 0xe234,
            0x266e: 0xe235,
            0x266f: 0xe236, // \flat, \naturl, \sharp
            0x2266: 0xe2c5,
            0x2267: 0xe2c6,
            0x226e: 0xe2c7,
            0x226f: 0xe2c8, // \leqq, \geqq, \nless, \ngtr
            0x231c: 0xe2ca,
            0x231d: 0xe2cb,
            0x231e: 0xe2cc,
            0x231f: 0xe2cd, // corners
            0x250c: 0xe2ca,
            0x2510: 0xe2cb,
            0x2514: 0xe2cc,
            0x2518: 0xe2cd, // corners (wrong positions)
            0x2571: 0xe2ce,
            0x2572: 0xe2cf,
            0x25a0: 0xe2d0,
            0x25a1: 0xe2d1, // \diagup, \diagdown, \blacksquare, \square
            0x25b2: 0xe2d2,
            0x25b6: 0xe2d4,
            0x25bc: 0xe2d5, // \blacktriangle, \blacktriangleright, \blacktriangledown
            0x25bd: 0xe2d6,
            0x25c0: 0xe2d7,
            0x25ca: 0xe2d8, // \vartriangledown, \blacktriangleleft, \lozenge
            0x2234: 0xe2d9,
            0x2235: 0xe2da,
            0x2252: 0xe2db,
            0x2605: 0xe2dc, // \therefore, \because, \fallingdotseq, \bigstar
            0x223d: 0xe2dd // \backsim
          };
          var REMAPBOLD = {
            variant: "-WinIE6",
            0x21d2: 0xe24a,
            0x21d4: 0xe24b, // \Rightarrow, \Leftrightarrow
            0x2200: 0xe24c,
            0x2202: 0xe24d,
            0x2203: 0xe24e,
            0x2207: 0xe24f, // \forall, \partial, \exists, \nabla
            0x2208: 0xe250,
            0x220b: 0xe251,
            0x2215: 0xe252,
            0x221a: 0xe253, // \in, \ni, /, \surd
            0x221d: 0xe254,
            0x221e: 0xe255,
            0x2220: 0xe256,
            0x2223: 0xe257, // \propto, \infty, \angle, \vert
            0x2225: 0xe258,
            0x2227: 0xe259,
            0x2228: 0xe25a,
            0x2229: 0xe25b, // \Vert, \wedge, \vee, \cap
            0x222a: 0xe25c,
            0x222b: 0xe25d,
            0x223c: 0xe25e,
            0x2248: 0xe25f, // \cup, \int, \sim, \approx
            0x2260: 0xe260,
            0x2261: 0xe261,
            0x2264: 0xe262,
            0x2265: 0xe263, // \ne, \equiv, \le, \ge
            0x226a: 0xe264,
            0x226b: 0xe265,
            0x2282: 0xe266,
            0x2283: 0xe267, // \ll, \gg, \subset, \supset
            0x2286: 0xe268,
            0x2287: 0xe269,
            0x2295: 0xe26a,
            0x2299: 0xe26b, // \subseteq, \supseteq, \oplus, \odot
            0x22a5: 0xe26c,
            0x25b3: 0xe26d,
            0x25bd: 0xe26e,
            0x25ef: 0xe26f, // \bot, \bigtriangleup, \bigtriangledown, \bigcirc
            0x2660: 0xe270,
            0x2661: 0xe271,
            0x2662: 0xe272,
            0x2663: 0xe273, // \spadesuit, \heartsuit, \diamondsuit, \clubsuit
            0x266d: 0xe274,
            0x266e: 0xe275,
            0x266f: 0xe276, // \flat, \naturl, \sharp
            0x2266: 0xe2c5,
            0x2267: 0xe2c6,
            0x226e: 0xe2c7,
            0x226f: 0xe2c8, // \leqq, \geqq, \nless, \ngtr
            0x231c: 0xe2ca,
            0x231d: 0xe2cb,
            0x231e: 0xe2cc,
            0x231f: 0xe2cd, // corners
            0x250c: 0xe2ca,
            0x2510: 0xe2cb,
            0x2514: 0xe2cc,
            0x2518: 0xe2cd, // corners (wrong positions)
            0x2571: 0xe2ce,
            0x2572: 0xe2cf,
            0x25a0: 0xe2d0,
            0x25a1: 0xe2d1, // \diagup, \diagdown, \blacksquare, \square
            0x25b2: 0xe2d2,
            0x25b6: 0xe2d4,
            0x25bc: 0xe2d5, // \blacktriangle, \blacktriangleright, \blacktriangledown
            0x25bd: 0xe2d6,
            0x25c0: 0xe2d7,
            0x25ca: 0xe2d8, // \vartriangledown, \blacktriangleleft, \lozenge
            0x2234: 0xe2d9,
            0x2235: 0xe2da,
            0x2252: 0xe2db,
            0x2605: 0xe2dc, // \therefore, \because, \fallingdotseq, \bigstar
            0x223d: 0xe2dd // \backsim
          };
          var VARNORMAL = {
            offsetAR: 0xe200,
            variantAR: "-WinIE6",
            remap: REMAP
          };
          var VARBOLD = {
            offsetAR: 0xe240,
            variantAR: "-WinIE6",
            remap: REMAPBOLD
          };

          HTMLCSS.Augment({
            FONTDATA: {
              VARIANT: {
                normal: VARNORMAL,
                bold: VARBOLD,
                italic: VARNORMAL,
                "bold-italic": VARBOLD,
                "-TeX-variant": {
                  remap: {
                    0x2190: [0xe2c1, "-WinIE6"],
                    0x2192: [0xe2c0, "-WinIE6"],
                    0x2223: [0xe2c2, "-WinIE6"],
                    0x2225: [0xe2c3, "-WinIE6"],
                    0x223c: [0xe2c4, "-WinIE6"],
                    0x25b3: [0xe2d3, "-WinIE6"]
                  }
                },
                "-largeOp": {
                  fonts: [WinIE6, SIZE2, SIZE1, MAIN],
                  remap: {
                    0x220f: 0xe290,
                    0x2211: 0xe291,
                    0x222b: 0xe295,
                    0x222e: 0xe296
                  }
                },
                "-smallOp": {
                  fonts: [WinIE6, SIZE1, MAIN],
                  remap: {
                    0x220f: 0xe280,
                    0x2211: 0xe281,
                    0x222b: 0xe285,
                    0x222e: 0xe286
                  }
                },
                "-WinIE6": { fonts: [WinIE6] }
              },
              DELIMITERS: {
                0x221a: {
                  HW: {
                    0: [1, WinIE6, null, 0xe213],
                    1: [1.2, WinIE6, null, 0xe282],
                    2: [1.8, WinIE6, null, 0xe292],
                    3: [2.4, WinIE6, null, 0xe2a2],
                    4: [3, WinIE6, null, 0xe2b2]
                  }
                },
                0x007c: { stretch: { ext: [0xe217, WinIE6] } },
                0x2223: {
                  HW: { 0: [1, WinIE6, null, 0xe217] },
                  stretch: { ext: [0xe217, WinIE6] }
                },
                0x23d0: {
                  HW: { 1: [1, WinIE6, null, 0xe217] },
                  stretch: { ext: [0xe217, WinIE6] }
                },
                0x2225: {
                  HW: { 0: [1, WinIE6, null, 0xe218] },
                  stretch: { ext: [0xe218, WinIE6] }
                },
                0x2190: {
                  HW: { 0: [0.889, WinIE6, null, 0xe200] },
                  stretch: { left: [0xe200, WinIE6] }
                },
                0x2191: {
                  HW: { 0: [0.888, WinIE6, null, 0xe201] },
                  stretch: { top: [0xe287, WinIE6], ext: [0xe289, WinIE6] }
                },
                0x2192: {
                  HW: { 0: [0.889, WinIE6, null, 0xe202] },
                  stretch: { right: [0xe202, WinIE6] }
                },
                0x2193: {
                  HW: { 0: [0.888, WinIE6, null, 0xe203] },
                  stretch: { bot: [0xe288, WinIE6], ext: [0xe289, WinIE6] }
                },
                0x2194: {
                  HW: { 0: [1, WinIE6, null, 0xe204] },
                  stretch: { left: [0xe200, WinIE6], right: [0xe202, WinIE6] }
                },
                0x2195: {
                  HW: { 0: [1.044, WinIE6, null, 0xe203] },
                  stretch: {
                    top: [0xe287, WinIE6],
                    bot: [0xe288, WinIE6],
                    ext: [0xe289, WinIE6]
                  }
                }
              }
            }
          });
        }
      },

      Chrome: function(browser) {
        if (browser.isPC && navigator.userAgent.match(/Windows NT (5|6.0)/)) {
          //
          //  Chrome on XP and Vista don't seem to handle four combining characters,
          //  so work around them as best we can.
          //
          HTMLCSS.Augment({
            FONTDATA: {
              REMAP: { 0x338: "\uEEE0/\uEEE8" }, // combining long solidas
              REMAPACCENT: {
                "\u0307": ".", // combining dot above
                "\u030B": "\u00B4\uEEE1\u00B4", // combining double acute accent
                "\u20D7": "\u2192" // combining arrow above
              }
            }
          });
          delete HTMLCSS.FONTDATA.REMAPACCENT["\u2192"];
        }
        if (browser.isPC && !MathJax.Hub.Browser.versionAtLeast("5.0")) {
          var WinChrome = "-WinChrome";
          HTMLCSS.Augment({
            FONTDATA: {
              VARIANT: {
                normal: { remap: { 0x3e: [0x3e, WinChrome] } },
                bold: { remap: { 0xe2f1: [0x3e, WinChrome] } },
                italic: { remap: { 0x64: [0x64, WinChrome] } },
                "-tex-caligraphic": { remap: { 0x54: [0x54, WinChrome] } },
                "-tex-caligraphic-bold": {
                  remap: { 0x54: [0xe2f0, WinChrome] }
                },
                "-largeOp": { remap: { 0x2a00: [0x2a00, WinChrome] } },
                "-smallOp": { remap: { 0x22c3: [0x22c3, WinChrome] } },
                "-WinChrome": { fonts: ["MathJax_WinChrome"] }
              },
              DELIMITERS: {
                0x005d: { stretch: { bot: [0x23a6, "MathJax_WinChrome"] } },
                0x230b: { stretch: { bot: [0x23a6, "MathJax_WinChrome"] } }
              }
            }
          });

          HTMLCSS.FONTDATA.FONTS["MathJax_WinChrome"] = {
            directory: "WinChrome/Regular",
            family: "MathJax_WinChrome",
            testString: "> T d \u23A6 \u2A00",
            skew: {
              0x54: 0.0278,
              0xe2f0: 0.0319
            },
            0x20: [0, 0, 250, 0, 0], // SPACE
            0x3e: [540, 40, 778, 83, 694], // GREATER-THAN SIGN
            0x54: [717, 68, 545, 34, 833], // LATIN CAPITAL LETTER T
            0x64: [694, 11, 511, 101, 567], // LATIN SMALL LETTER D
            0xa0: [0, 0, 250, 0, 0], // NO-BREAK SPACE
            0x22c3: [750, 249, 833, 55, 777], // N-ARY UNION
            0x23a6: [1155, 644, 667, 0, 347], // RIGHT SQUARE BRACKET LOWER CORNER
            0x2a00: [949, 449, 1511, 56, 1454], // N-ARY CIRCLED DOT OPERATOR
            0xe2f0: [720, 69, 644, 38, 947], // stix-lowercase u italic slashed
            0xe2f1: [587, 85, 894, 96, 797] // stix-lowercase u bold italic slashed
          };
        }
      }
    });
  }

  //
  //  Create @font-face stylesheet for the declared fonts
  //
  (function() {
    var FONTS = HTMLCSS.FONTDATA.FONTS,
      AVAIL = HTMLCSS.config.availableFonts;
    var name,
      faces = [];
    if (HTMLCSS.allowWebFonts) {
      for (name in FONTS) {
        if (FONTS[name].family) {
          if (AVAIL && AVAIL.length && HTMLCSS.Font.testFont(FONTS[name])) {
            FONTS[name].available = true;
            HTMLCSS.Font.loadComplete(FONTS[name]);
          } else {
            FONTS[name].isWebFont = true;
            if (HTMLCSS.FontFaceBug) {
              FONTS[name].family = name;
            }
            faces.push(HTMLCSS.Font.fontFace(name));
          }
        }
      }
      if (!HTMLCSS.config.preloadWebFonts) {
        HTMLCSS.config.preloadWebFonts = [];
      }
      HTMLCSS.config.preloadWebFonts.push(MAIN, ITALIC, SIZE1);
      if (faces.length) {
        HTMLCSS.config.styles["@font-face"] = faces;
      }
    } else if (AVAIL && AVAIL.length) {
      for (name in FONTS) {
        if (FONTS[name].family && HTMLCSS.Font.testFont(FONTS[name])) {
          FONTS[name].available = true;
          HTMLCSS.Font.loadComplete(FONTS[name]);
        }
      }
    }
  })();

  AJAX.loadComplete(HTMLCSS.fontDir + "/fontdata.js");
})(MathJax.OutputJax["HTML-CSS"], MathJax.ElementJax.mml, MathJax.Ajax);
