/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/STIX-Web/fontdata-extra.js
 *  
 *  Adds extra stretchy characters to the STIX-Web fonts

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

(function(HTMLCSS) {
  var VERSION = "2.7.5";

  var DELIMITERS = HTMLCSS.FONTDATA.DELIMITERS;

  var H = "H",
    V = "V";
  var ARROWREP = [0x2212, MAIN, 0, 0, 0, -0.26, -0.26];

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

  var delim = {
    0x3d: {
      dir: H,
      HW: [[0.589, MAIN]],
      stretch: { rep: [0x3d, MAIN] }
    },
    0x2c7: {
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
    0x2cd: {
      dir: H,
      HW: [[0.312, MARKS]],
      stretch: { rep: [0x2cd, MARKS] }
    },
    0x2f7: {
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
    0x20d0: {
      dir: H,
      HW: [
        [0.436, MARKS],
        [0.871, SIZE1],
        [1.308, SIZE2],
        [1.744, SIZE3],
        [2.18, SIZE4],
        [3.0, SIZE5]
      ],
      stretch: { left: [0xe015, SIZE5], rep: [0xe016, SIZE5] }
    },
    0x20d1: {
      dir: H,
      HW: [
        [0.436, MARKS],
        [0.871, SIZE1],
        [1.308, SIZE2],
        [1.744, SIZE3],
        [2.18, SIZE4],
        [3.0, SIZE5]
      ],
      stretch: { rep: [0xe016, SIZE5], right: [0xe017, SIZE5] }
    },
    0x20d6: {
      dir: H,
      HW: [
        [0.436, MARKS],
        [0.872, SIZE1],
        [1.308, SIZE2],
        [1.744, SIZE3],
        [2.18, SIZE4],
        [3.0, SIZE5]
      ],
      stretch: { left: [0xe018, SIZE5], rep: [0xe016, SIZE5] }
    },
    0x20e1: {
      dir: H,
      HW: [[0.478, MARKS]],
      stretch: {
        left: [0xe018, SIZE5],
        rep: [0xe016, SIZE5],
        right: [0xe019, SIZE5]
      }
    },
    0x20ec: {
      dir: H,
      HW: [
        [0.436, MARKS],
        [0.871, SIZE1],
        [1.308, SIZE2],
        [1.744, SIZE3],
        [2.18, SIZE4],
        [3.0, SIZE5]
      ],
      stretch: { rep: [0xe01a, SIZE5], right: [0xe01b, SIZE5] }
    },
    0x20ed: {
      dir: H,
      HW: [
        [0.436, MARKS],
        [0.871, SIZE1],
        [1.308, SIZE2],
        [1.744, SIZE3],
        [2.18, SIZE4],
        [3.0, SIZE5]
      ],
      stretch: { left: [0xe01c, SIZE5], rep: [0xe01a, SIZE5] }
    },
    0x20ee: {
      dir: H,
      HW: [
        [0.436, MARKS],
        [0.872, SIZE1],
        [1.308, SIZE2],
        [1.744, SIZE3],
        [2.18, SIZE4],
        [3.0, SIZE5]
      ],
      stretch: { left: [0xe01d, SIZE5], rep: [0xe01a, SIZE5] }
    },
    0x20ef: {
      dir: H,
      HW: [
        [0.436, MARKS],
        [0.872, SIZE1],
        [1.308, SIZE2],
        [1.744, SIZE3],
        [2.18, SIZE4],
        [3.0, SIZE5]
      ],
      stretch: { rep: [0xe01a, SIZE5], right: [0xe01e, SIZE5] }
    },
    0x2140: {
      dir: V,
      HW: [[1.022, DOUBLESTRUCK], [1.45, SIZE1]]
    },
    0x219e: {
      dir: H,
      HW: [[0.786, MAIN]],
      stretch: { left: [0x219e, MAIN], rep: ARROWREP }
    },
    0x219f: {
      dir: V,
      HW: [[0.816, ARROWS]],
      stretch: { ext: [0x23d0, MAIN], top: [0x219f, ARROWS] }
    },
    0x21a0: {
      dir: H,
      HW: [[0.786, MAIN]],
      stretch: { right: [0x21a0, MAIN], rep: ARROWREP }
    },
    0x21a1: {
      dir: V,
      HW: [[0.816, ARROWS]],
      stretch: { ext: [0x23d0, MAIN], bot: [0x21a1, ARROWS] }
    },
    0x21a4: {
      dir: H,
      HW: [[0.787, ARROWS]],
      stretch: {
        left: [0x2190, MAIN],
        rep: [0x23af, SYMBOLS],
        right: [0x27de, SYMBOLS]
      }
    },
    0x21a5: {
      dir: V,
      HW: [[0.816, ARROWS]],
      stretch: {
        bot: [0x5f, MAIN, 0.05, -0.01, 0.8],
        ext: [0x23d0, MAIN],
        top: [0x2191, MAIN]
      }
    },
    0x21a6: {
      dir: H,
      HW: [[0.787, MAIN]],
      stretch: {
        left: [0x27dd, SYMBOLS],
        rep: [0x23af, SYMBOLS],
        right: [0x2192, MAIN]
      }
    },
    0x21a7: {
      dir: V,
      HW: [[0.816, ARROWS]],
      stretch: {
        top: [0x22a4, MAINBOLD, 0.04, 0.0, 0.6],
        ext: [0x23d0, MAIN],
        bot: [0x2193, MAIN]
      }
    },
    0x21a8: {
      dir: V,
      HW: [[0.816, ARROWS]],
      stretch: {
        top: [0x2191, MAIN],
        ext: [0x23d0, MAIN],
        bot: [0x2913, ARROWS]
      }
    },
    0x21a9: {
      dir: H,
      HW: [[0.786, MAIN]],
      stretch: { left: [0x2190, MAIN], rep: ARROWREP, right: [0xe0b5, ARROWS] }
    },
    0x21aa: {
      dir: H,
      HW: [[0.786, MAIN]],
      stretch: { left: [0xe0b4, ARROWS], rep: ARROWREP, right: [0x2192, MAIN] }
    },
    0x21b0: {
      dir: V,
      HW: [[0.818, MAIN]],
      stretch: { top: [0x21b0, MAIN], ext: [0x23d0, MAIN, 0.152] }
    },
    0x21b1: {
      dir: V,
      HW: [[0.818, MAIN]],
      stretch: { top: [0x21b1, MAIN], ext: [0x23d0, MAIN, -0.195] }
    },
    0x21b2: {
      dir: V,
      HW: [[0.816, ARROWS]],
      stretch: { bot: [0x21b2, ARROWS], ext: [0x23d0, MAIN, 0.152] }
    },
    0x21b3: {
      dir: V,
      HW: [[0.816, ARROWS]],
      stretch: { bot: [0x21b3, ARROWS], ext: [0x23d0, MAIN, -0.195] }
    },
    0x21b4: {
      dir: H,
      HW: [[0.786, ARROWS]],
      stretch: { rep: [0x2212, MAIN, 0.0, 0.4], right: [0x21b4, ARROWS] }
    },
    0x21b5: {
      dir: V,
      HW: [[0.818, ARROWS]],
      stretch: { bot: [0x21b5, ARROWS], ext: [0x23d0, MAIN, 0.57] }
    },
    0x21bc: {
      dir: H,
      HW: [[0.847, MAIN]],
      stretch: { left: [0x21bc, MAIN], rep: [0x23af, SYMBOLS] }
    },
    0x21bd: {
      dir: H,
      HW: [[0.847, MAIN]],
      stretch: { left: [0x21bd, MAIN], rep: [0x23af, SYMBOLS] }
    },
    0x21be: {
      dir: V,
      HW: [[0.818, MAIN]],
      stretch: { ext: [0x23d0, MAIN], top: [0x21be, MAIN] }
    },
    0x21bf: {
      dir: V,
      HW: [[0.818, MAIN]],
      stretch: { ext: [0x23d0, MAIN], top: [0x21bf, MAIN] }
    },
    0x21c0: {
      dir: H,
      HW: [[0.847, MAIN]],
      stretch: { rep: [0x23af, SYMBOLS], right: [0x21c0, MAIN] }
    },
    0x21c1: {
      dir: H,
      HW: [[0.847, MAIN]],
      stretch: { right: [0x21c1, MAIN], rep: ARROWREP }
    },
    0x21c2: {
      dir: V,
      HW: [[0.818, MAIN]],
      stretch: { bot: [0x21c2, MAIN], ext: [0x23d0, MAIN] }
    },
    0x21c3: {
      dir: V,
      HW: [[0.818, MAIN]],
      stretch: { bot: [0x21c3, MAIN], ext: [0x23d0, MAIN] }
    },
    0x21cb: {
      dir: H,
      HW: [[0.786, MAIN]],
      stretch: {
        left: [0x296a, ARROWS],
        rep: [0x3d, MAIN],
        right: [0x296d, ARROWS]
      }
    },
    0x21cc: {
      dir: H,
      HW: [[0.786, MAIN]],
      stretch: {
        left: [0x296b, ARROWS],
        rep: [0x3d, MAIN],
        right: [0x296c, ARROWS]
      }
    },
    0x21da: {
      dir: H,
      HW: [[0.806, MAIN]],
      stretch: { left: [0x21da, MAIN], rep: [0xe021, SIZE5] }
    },
    0x21db: {
      dir: H,
      HW: [[0.806, MAIN]],
      stretch: { rep: [0xe021, SIZE5], right: [0x21db, MAIN] }
    },
    0x21e0: {
      dir: H,
      HW: [[0.806, MAIN]],
      stretch: { left: [0x21e0, MAIN], rep: [0xe121, ARROWS] }
    },
    0x21e1: {
      dir: V,
      HW: [[0.818, ARROWS]],
      stretch: { ext: [0xe12d, ARROWS], top: [0x21e1, ARROWS] }
    },
    0x21e2: {
      dir: H,
      HW: [[0.806, MAIN]],
      stretch: { right: [0x21e2, MAIN], rep: [0xe12e, ARROWS] }
    },
    0x21e3: {
      dir: V,
      HW: [[0.818, ARROWS]],
      stretch: { ext: [0xe12c, ARROWS], bot: [0x21e3, ARROWS] }
    },
    0x21e4: {
      dir: H,
      HW: [[0.806, ARROWS]],
      stretch: { left: [0x21e4, ARROWS], rep: ARROWREP }
    },
    0x21e5: {
      dir: H,
      HW: [[0.806, ARROWS]],
      stretch: { right: [0x21e5, ARROWS], rep: ARROWREP }
    },
    0x21fd: {
      dir: H,
      HW: [[0.806, ARROWS]],
      stretch: { left: [0x21fd, ARROWS], rep: ARROWREP }
    },
    0x21fe: {
      dir: H,
      HW: [[0.806, ARROWS]],
      stretch: { right: [0x21fe, ARROWS], rep: ARROWREP }
    },
    0x21ff: {
      dir: H,
      HW: [[0.886, ARROWS]],
      stretch: {
        left: [0x21fd, ARROWS],
        rep: ARROWREP,
        right: [0x21fe, ARROWS]
      }
    },
    0x220f: {
      dir: V,
      HW: [[1.022, OPERATORS], [1.451, SIZE1]]
    },
    0x2210: {
      dir: V,
      HW: [[1.022, OPERATORS], [1.451, SIZE1]]
    },
    0x2211: {
      dir: V,
      HW: [[1.022, OPERATORS], [1.45, SIZE1]]
    },
    0x221b: {
      dir: V,
      HW: [[1.232, OPERATORS], [1.847, SIZE1], [2.46, SIZE2], [3.075, SIZE3]],
      stretch: {
        bot: [0xe025, SIZE5],
        ext: [0xe023, SIZE5],
        top: [0xe024, SIZE5]
      }
    },
    0x221c: {
      dir: V,
      HW: [[1.232, OPERATORS], [1.847, SIZE1], [2.46, SIZE2], [3.075, SIZE3]],
      stretch: {
        bot: [0xe026, SIZE5],
        ext: [0xe023, SIZE5],
        top: [0xe024, SIZE5]
      }
    },
    0x222b: {
      dir: V,
      HW: [[0.607, MAIN], [0.979, SIZE1]],
      stretch: {
        top: [0xe03c, SIZE5],
        ext: [0xe03d, SIZE5],
        bot: [0xe03e, SIZE5]
      }
    },
    0x222c: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x222d: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x222e: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x222f: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x2230: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x2231: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x2232: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x2233: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x22c0: {
      dir: V,
      HW: [[1.022, OPERATORS], [1.451, SIZE1]]
    },
    0x22c1: {
      dir: V,
      HW: [[1.022, OPERATORS], [1.451, SIZE1]]
    },
    0x22c2: {
      dir: V,
      HW: [[1.032, OPERATORS], [1.461, SIZE1]]
    },
    0x22c3: {
      dir: V,
      HW: [[1.032, OPERATORS], [1.461, SIZE1]]
    },
    0x23aa: {
      dir: V,
      HW: [[1.01, SIZE5, null, 0xe00d]],
      stretch: {
        top: [0xe00d, SIZE5],
        ext: [0xe00d, SIZE5],
        bot: [0xe00d, SIZE5]
      }
    },
    0x23b4: {
      dir: H,
      HW: [
        [0.816, MAIN],
        [0.925, SIZE1],
        [1.458, SIZE2],
        [1.991, SIZE3],
        [2.524, SIZE4],
        [3.057, SIZE5]
      ],
      stretch: {
        left: [0xe027, SIZE5],
        rep: [0xe028, SIZE5],
        right: [0xe029, SIZE5]
      }
    },
    0x23b5: {
      dir: H,
      HW: [
        [0.816, MAIN],
        [0.925, SIZE1],
        [1.458, SIZE2],
        [1.991, SIZE3],
        [2.524, SIZE4],
        [3.057, SIZE5]
      ],
      stretch: {
        left: [0xe02a, SIZE5],
        rep: [0xe02b, SIZE5],
        right: [0xe02c, SIZE5]
      }
    },
    0x23d0: {
      dir: V,
      HW: [
        [0.304, MAIN],
        [0.69, SIZE1],
        [0.879, SIZE2],
        [1.35, SIZE2, 1.536],
        [1.827, SIZE2, 2.078],
        [2.303, SIZE2, 2.62],
        [2.78, SIZE2, 3.162]
      ],
      stretch: { ext: [0x2223, MAIN] }
    },
    0x23dc: {
      dir: H,
      HW: [
        [1.0, MAIN],
        [0.926, SIZE1],
        [1.46, SIZE2],
        [1.886, SIZE3],
        [2.328, SIZE4],
        [3.237, SIZE5]
      ],
      stretch: {
        left: [0xe02d, SIZE5],
        rep: [0xe028, SIZE5],
        right: [0xe02e, SIZE5]
      }
    },
    0x23dd: {
      dir: H,
      HW: [
        [1.0, MAIN],
        [0.926, SIZE1],
        [1.46, SIZE2],
        [1.886, SIZE3],
        [2.328, SIZE4],
        [3.237, SIZE5]
      ],
      stretch: {
        left: [0xe02f, SIZE5],
        rep: [0xe02b, SIZE5],
        right: [0xe030, SIZE5]
      }
    },
    0x23e0: {
      dir: H,
      HW: [
        [1.0, MAIN],
        [1.46, SIZE1],
        [1.886, SIZE2],
        [2.312, SIZE3],
        [2.738, SIZE4],
        [3.164, SIZE5]
      ]
    },
    0x23e1: {
      dir: H,
      HW: [
        [1.0, MAIN],
        [1.46, SIZE1],
        [1.886, SIZE2],
        [2.312, SIZE3],
        [2.738, SIZE4],
        [3.164, SIZE5]
      ]
    },
    0x2772: {
      dir: V,
      HW: [
        [0.932, MISC],
        [1.23, SIZE1],
        [1.845, SIZE2],
        [2.459, SIZE3],
        [3.075, SIZE4]
      ]
    },
    0x2773: {
      dir: V,
      HW: [
        [0.932, MISC],
        [1.23, SIZE1],
        [1.845, SIZE2],
        [2.459, SIZE3],
        [3.075, SIZE4]
      ]
    },
    0x27e6: {
      dir: V,
      HW: [
        [0.93, SYMBOLS],
        [1.23, SIZE1],
        [1.845, SIZE2],
        [2.46, SIZE3],
        [3.075, SIZE4]
      ],
      stretch: {
        top: [0x2553, SHAPES],
        ext: [0x2551, SHAPES],
        bot: [0x2559, SHAPES]
      }
    },
    0x27e7: {
      dir: V,
      HW: [
        [0.93, SYMBOLS],
        [1.23, SIZE1],
        [1.845, SIZE2],
        [2.46, SIZE3],
        [3.075, SIZE4]
      ],
      stretch: {
        top: [0x2556, SHAPES],
        ext: [0x2551, SHAPES],
        bot: [0x255c, SHAPES]
      }
    },
    0x27ea: {
      dir: V,
      HW: [
        [0.932, SYMBOLS],
        [1.23, SIZE1],
        [1.845, SIZE2],
        [2.461, SIZE3],
        [3.075, SIZE4]
      ]
    },
    0x27eb: {
      dir: V,
      HW: [
        [0.932, SYMBOLS],
        [1.23, SIZE1],
        [1.845, SIZE2],
        [2.461, SIZE3],
        [3.075, SIZE4]
      ]
    },
    0x27f0: {
      dir: V,
      HW: [[0.818, ARROWS]],
      stretch: { ext: [0xe037, SIZE5], top: [0x27f0, ARROWS] }
    },
    0x27f1: {
      dir: V,
      HW: [[0.818, ARROWS]],
      stretch: { bot: [0x27f1, ARROWS], ext: [0xe037, SIZE5] }
    },
    0x2906: {
      dir: H,
      HW: [[0.816, ARROWS]],
      stretch: {
        left: [0x21d0, MAIN],
        rep: [0x3d, MAIN],
        right: [0x2ae4, OPERATORS, 0.0, -0.09]
      }
    },
    0x2907: {
      dir: H,
      HW: [[0.816, ARROWS]],
      stretch: {
        left: [0x22a8, MAIN, 0.0, -0.09],
        rep: [0x3d, MAIN],
        right: [0x21d2, MAIN]
      }
    },
    0x290a: {
      dir: V,
      HW: [[0.818, ARROWS]],
      stretch: { ext: [0xe038, SIZE5], top: [0x290a, ARROWS] }
    },
    0x290b: {
      dir: V,
      HW: [[0.818, ARROWS]],
      stretch: { bot: [0x290b, ARROWS], ext: [0xe038, SIZE5] }
    },
    0x2912: {
      dir: V,
      HW: [[0.818, ARROWS]],
      stretch: { top: [0x2912, ARROWS], ext: [0x23d0, MAIN] }
    },
    0x2913: {
      dir: V,
      HW: [[0.818, ARROWS]],
      stretch: { bot: [0x2913, ARROWS], ext: [0x23d0, MAIN] }
    },
    0x294e: {
      dir: H,
      HW: [[0.85, ARROWS]],
      stretch: { left: [0x21bc, MAIN], rep: ARROWREP, right: [0x21c0, MAIN] }
    },
    0x294f: {
      dir: V,
      HW: [[0.818, ARROWS]],
      stretch: { top: [0x21be, MAIN], ext: [0x23d0, MAIN], bot: [0x21c2, MAIN] }
    },
    0x2950: {
      dir: H,
      HW: [[0.85, ARROWS]],
      stretch: { left: [0x21bd, MAIN], rep: ARROWREP, right: [0x21c1, MAIN] }
    },
    0x2951: {
      dir: V,
      HW: [[0.818, ARROWS]],
      stretch: { top: [0x21bf, MAIN], ext: [0x23d0, MAIN], bot: [0x21c3, MAIN] }
    },
    0x2952: {
      dir: H,
      HW: [[0.816, ARROWS]],
      stretch: { left: [0x2952, ARROWS], rep: ARROWREP }
    },
    0x2953: {
      dir: H,
      HW: [[0.816, ARROWS]],
      stretch: { right: [0x2953, ARROWS], rep: ARROWREP }
    },
    0x2954: {
      dir: V,
      HW: [[0.818, ARROWS]],
      stretch: { top: [0x2954, ARROWS], ext: [0x23d0, MAIN] }
    },
    0x2955: {
      dir: V,
      HW: [[0.818, ARROWS]],
      stretch: { bot: [0x2955, ARROWS], ext: [0x23d0, MAIN] }
    },
    0x2956: {
      dir: H,
      HW: [[0.816, ARROWS]],
      stretch: { left: [0x2956, ARROWS], rep: ARROWREP }
    },
    0x2957: {
      dir: H,
      HW: [[0.816, ARROWS]],
      stretch: { right: [0x2957, ARROWS], rep: ARROWREP }
    },
    0x2958: {
      dir: V,
      HW: [[0.818, ARROWS]],
      stretch: { top: [0x2958, ARROWS], ext: [0x23d0, MAIN] }
    },
    0x2959: {
      dir: V,
      HW: [[0.818, ARROWS]],
      stretch: { bot: [0x2959, ARROWS], ext: [0x23d0, MAIN] }
    },
    0x295a: {
      dir: H,
      HW: [[0.816, ARROWS]],
      stretch: {
        left: [0x21bc, MAIN],
        rep: ARROWREP,
        right: [0x22a3, MAINBOLD, 0.0, 0.1, 0.6]
      }
    },
    0x295b: {
      dir: H,
      HW: [[0.816, ARROWS]],
      stretch: { left: [0xe0b6, ARROWS], rep: ARROWREP, right: [0x21c0, MAIN] }
    },
    0x295c: {
      dir: V,
      HW: [[0.818, ARROWS]],
      stretch: {
        bot: [0x5f, MAIN, 0.05, -0.01, 0.8],
        ext: [0x23d0, MAIN],
        top: [0x21be, MAIN]
      }
    },
    0x295d: {
      dir: V,
      HW: [[0.818, ARROWS]],
      stretch: {
        top: [0x22a4, MAINBOLD, 0.04, 0.0, 0.6],
        ext: [0x23d0, MAIN],
        bot: [0x21c2, MAIN]
      }
    },
    0x295e: {
      dir: H,
      HW: [[0.816, ARROWS]],
      stretch: {
        left: [0x21bd, MAIN],
        rep: ARROWREP,
        right: [0x22a3, MAINBOLD, 0.0, 0.1, 0.6]
      }
    },
    0x295f: {
      dir: H,
      HW: [[0.816, ARROWS]],
      stretch: { left: [0xe0b6, ARROWS], rep: ARROWREP, right: [0x21c1, MAIN] }
    },
    0x2960: {
      dir: V,
      HW: [[0.818, ARROWS]],
      stretch: {
        bot: [0x5f, MAIN, 0.05, -0.01, 0.8],
        ext: [0x23d0, MAIN],
        top: [0x21bf, MAIN]
      }
    },
    0x2961: {
      dir: V,
      HW: [[0.818, ARROWS]],
      stretch: {
        top: [0x22a4, MAINBOLD, 0.04, 0.0, 0.6],
        ext: [0x23d0, MAIN],
        bot: [0x21c3, MAIN]
      }
    },
    0x2980: {
      dir: V,
      HW: [[0.884, SYMBOLS]],
      stretch: { ext: [0x2980, SYMBOLS] }
    },
    0x2983: {
      dir: V,
      HW: [
        [0.932, SYMBOLS],
        [1.23, SIZE1],
        [1.845, SIZE2],
        [2.46, SIZE3],
        [3.075, SIZE4]
      ]
    },
    0x2984: {
      dir: V,
      HW: [
        [0.932, SYMBOLS],
        [1.23, SIZE1],
        [1.845, SIZE2],
        [2.46, SIZE3],
        [3.075, SIZE4]
      ]
    },
    0x2985: {
      dir: V,
      HW: [
        [0.932, SYMBOLS],
        [1.23, SIZE1],
        [1.848, SIZE2],
        [2.459, SIZE3],
        [3.075, SIZE4]
      ]
    },
    0x2986: {
      dir: V,
      HW: [
        [0.932, SYMBOLS],
        [1.23, SIZE1],
        [1.848, SIZE2],
        [2.459, SIZE3],
        [3.075, SIZE4]
      ]
    },
    0x2997: {
      dir: V,
      HW: [[0.932, MAIN]],
      stretch: {
        top: [0xe10d, SHAPES, 0.1, 0.05],
        ext: [0x23d0, MAIN, -0.1],
        bot: [0xe10c, SHAPES, 0.1]
      }
    },
    0x2998: {
      dir: V,
      HW: [[0.932, MAIN]],
      stretch: {
        top: [0xe10c, SHAPES, -0.1, 0.05],
        ext: [0x23d0, MAIN],
        bot: [0xe10d, SHAPES, -0.1]
      }
    },
    0x2a00: {
      dir: V,
      HW: [[1.022, OPERATORS], [1.451, SIZE1]]
    },
    0x2a01: {
      dir: V,
      HW: [[1.022, OPERATORS], [1.451, SIZE1]]
    },
    0x2a02: {
      dir: V,
      HW: [[1.022, OPERATORS], [1.451, SIZE1]]
    },
    0x2a03: {
      dir: V,
      HW: [[1.032, OPERATORS], [1.461, SIZE1]]
    },
    0x2a04: {
      dir: V,
      HW: [[1.032, OPERATORS], [1.461, SIZE1]]
    },
    0x2a05: {
      dir: V,
      HW: [[1.022, OPERATORS], [1.451, SIZE1]]
    },
    0x2a06: {
      dir: V,
      HW: [[1.022, OPERATORS], [1.451, SIZE1]]
    },
    0x2a07: {
      dir: V,
      HW: [[1.022, OPERATORS], [1.451, SIZE1]]
    },
    0x2a08: {
      dir: V,
      HW: [[1.022, OPERATORS], [1.451, SIZE1]]
    },
    0x2a09: {
      dir: V,
      HW: [[1.022, OPERATORS], [1.451, SIZE1]]
    },
    0x2a0a: {
      dir: V,
      HW: [[1.022, OPERATORS], [1.45, SIZE1]]
    },
    0x2a0b: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x2a0c: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x2a0d: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x2a0e: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x2a0f: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x2a10: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x2a11: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x2a12: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x2a13: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x2a14: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x2a15: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x2a16: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x2a17: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x2a18: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x2a19: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x2a1a: {
      dir: V,
      HW: [[1.144, OPERATORS], [2.269, SIZE1]]
    },
    0x2a1b: {
      dir: V,
      HW: [[1.267, OPERATORS], [2.426, SIZE1]]
    },
    0x2a1c: {
      dir: V,
      HW: [[1.267, OPERATORS], [2.426, SIZE1]]
    },
    0x2afc: {
      dir: V,
      HW: [[1.022, OPERATORS], [1.23, SIZE1], [1.875, SIZE2]]
    },
    0x2aff: {
      dir: V,
      HW: [[1.022, OPERATORS], [1.23, SIZE1], [1.875, SIZE2]]
    },
    0x2b45: {
      dir: H,
      HW: [[0.818, SHAPES]],
      stretch: { left: [0x2b45, SHAPES], rep: [0xe039, SIZE5] }
    }
  };

  for (var id in delim) {
    if (delim.hasOwnProperty(id)) {
      DELIMITERS[id] = delim[id];
    }
  }

  MathJax.Ajax.loadComplete(HTMLCSS.fontDir + "/fontdata-extra.js");
})(MathJax.OutputJax["HTML-CSS"]);
