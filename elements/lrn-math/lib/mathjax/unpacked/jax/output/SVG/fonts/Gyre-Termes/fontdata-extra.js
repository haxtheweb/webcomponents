/*************************************************************
 *
 *  MathJax/jax/output/SVG/fonts/Gyre-Termes/fontdata-extra.js
 *  
 *  Adds extra stretchy characters to the Gyre-Termes fonts

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

(function(SVG) {
  var VERSION = "2.7.5";

  var DELIMITERS = SVG.FONTDATA.DELIMITERS;

  var H = "H",
    V = "V";

  var ALPHABETS = "GyreTermesMathJax_Alphabets",
    ARROWS = "GyreTermesMathJax_Arrows",
    DOUBLESTRUCK = "GyreTermesMathJax_DoubleStruck",
    FRAKTUR = "GyreTermesMathJax_Fraktur",
    LATIN = "GyreTermesMathJax_Latin",
    MAIN = "GyreTermesMathJax_Main",
    MARKS = "GyreTermesMathJax_Marks",
    MISC = "GyreTermesMathJax_Misc",
    MONOSPACE = "GyreTermesMathJax_Monospace",
    NONUNICODE = "GyreTermesMathJax_NonUnicode",
    NORMAL = "GyreTermesMathJax_Normal",
    OPERATORS = "GyreTermesMathJax_Operators",
    SANSSERIF = "GyreTermesMathJax_SansSerif",
    SCRIPT = "GyreTermesMathJax_Script",
    SHAPES = "GyreTermesMathJax_Shapes",
    SIZE1 = "GyreTermesMathJax_Size1",
    SIZE2 = "GyreTermesMathJax_Size2",
    SIZE3 = "GyreTermesMathJax_Size3",
    SIZE4 = "GyreTermesMathJax_Size4",
    SIZE5 = "GyreTermesMathJax_Size5",
    SIZE6 = "GyreTermesMathJax_Size6",
    SYMBOLS = "GyreTermesMathJax_Symbols",
    VARIANTS = "GyreTermesMathJax_Variants";

  var delim = {
    0x306: {
      dir: H,
      HW: [
        [350, MAIN],
        [620, SIZE1],
        [740, SIZE2],
        [885, SIZE3],
        [1058, SIZE4],
        [1266, SIZE5],
        [1515, SIZE6]
      ]
    },
    0x311: {
      dir: H,
      HW: [
        [350, MARKS],
        [620, SIZE1],
        [740, SIZE2],
        [885, SIZE3],
        [1058, SIZE4],
        [1266, SIZE5],
        [1515, SIZE6]
      ]
    },
    0x32c: {
      dir: H,
      HW: [
        [342, MARKS],
        [608, SIZE1],
        [727, SIZE2],
        [870, SIZE3],
        [1041, SIZE4],
        [1249, SIZE5],
        [1496, SIZE6]
      ]
    },
    0x32d: {
      dir: H,
      HW: [
        [342, MARKS],
        [608, SIZE1],
        [727, SIZE2],
        [870, SIZE3],
        [1041, SIZE4],
        [1249, SIZE5],
        [1496, SIZE6]
      ]
    },
    0x32e: {
      dir: H,
      HW: [
        [350, MARKS],
        [620, SIZE1],
        [740, SIZE2],
        [885, SIZE3],
        [1058, SIZE4],
        [1266, SIZE5],
        [1515, SIZE6]
      ]
    },
    0x32f: {
      dir: H,
      HW: [
        [350, MARKS],
        [620, SIZE1],
        [740, SIZE2],
        [885, SIZE3],
        [1058, SIZE4],
        [1266, SIZE5],
        [1515, SIZE6]
      ]
    },
    0x330: {
      dir: H,
      HW: [
        [334, MARKS],
        [601, SIZE1],
        [720, SIZE2],
        [863, SIZE3],
        [1037, SIZE4],
        [1241, SIZE5],
        [1491, SIZE6]
      ]
    },
    0x333: {
      dir: H,
      HW: [[333, MARKS], [500, SIZE1]],
      stretch: {
        left: [0xe0f8, SIZE6],
        rep: [0xe0f9, SIZE6],
        right: [0xe0fa, SIZE6]
      }
    },
    0x33f: {
      dir: H,
      HW: [[333, MARKS], [500, SIZE1]],
      stretch: {
        left: [0xe0fe, SIZE6],
        rep: [0xe0ff, SIZE6],
        right: [0xe100, SIZE6]
      }
    },
    0x20d0: {
      dir: H,
      HW: [[376, MARKS], [500, SIZE1]],
      stretch: {
        left: [0xe008, SIZE6],
        rep: [0xe009, SIZE6],
        right: [0xe00a, SIZE6]
      }
    },
    0x20d1: {
      dir: H,
      HW: [[376, MARKS], [500, SIZE1]],
      stretch: {
        left: [0xe00b, SIZE6],
        rep: [0xe00c, SIZE6],
        right: [0xe00d, SIZE6]
      }
    },
    0x20d6: {
      dir: H,
      HW: [[386, MARKS], [510, SIZE1]],
      stretch: {
        left: [0xe00e, SIZE6],
        rep: [0xe00f, SIZE6],
        right: [0xe010, SIZE6]
      }
    },
    0x20d7: {
      dir: H,
      HW: [[386, MAIN], [510, SIZE1]],
      stretch: {
        left: [0xe011, SIZE6],
        rep: [0xe012, SIZE6],
        right: [0xe013, SIZE6]
      }
    },
    0x20e1: {
      dir: H,
      HW: [[458, MARKS], [582, SIZE1]],
      stretch: {
        left: [0xe014, SIZE6],
        rep: [0xe015, SIZE6],
        right: [0xe016, SIZE6]
      }
    },
    0x20e9: {
      dir: H,
      HW: [
        [375, MARKS],
        [750, SIZE1],
        [1125, SIZE2],
        [1500, SIZE3],
        [1875, SIZE4],
        [2250, SIZE5],
        [2625, SIZE6]
      ],
      stretch: {
        left: [0xe11b, SIZE6],
        rep: [0xe11c, SIZE6],
        right: [0xe11d, SIZE6]
      }
    },
    0x20ec: {
      dir: H,
      HW: [[376, MARKS], [500, SIZE1]],
      stretch: {
        left: [0xe017, SIZE6],
        rep: [0xe018, SIZE6],
        right: [0xe019, SIZE6]
      }
    },
    0x20ed: {
      dir: H,
      HW: [[376, MARKS], [500, SIZE1]],
      stretch: {
        left: [0xe01a, SIZE6],
        rep: [0xe01b, SIZE6],
        right: [0xe01c, SIZE6]
      }
    },
    0x20ee: {
      dir: H,
      HW: [[386, MARKS], [510, SIZE1]],
      stretch: {
        left: [0xe01d, SIZE6],
        rep: [0xe01e, SIZE6],
        right: [0xe01f, SIZE6]
      }
    },
    0x20ef: {
      dir: H,
      HW: [[386, MARKS], [510, SIZE1]],
      stretch: {
        left: [0xe020, SIZE6],
        rep: [0xe021, SIZE6],
        right: [0xe022, SIZE6]
      }
    },
    0x2196: {
      dir: V,
      HW: [[506, MAIN], [733, SIZE1]]
    },
    0x2197: {
      dir: V,
      HW: [[506, MAIN], [733, SIZE1]]
    },
    0x2198: {
      dir: V,
      HW: [[506, MAIN], [733, SIZE1]]
    },
    0x2199: {
      dir: V,
      HW: [[506, MAIN], [733, SIZE1]]
    },
    0x219a: {
      dir: H,
      HW: [[690, MAIN], [1010, SIZE1]],
      stretch: {
        left: [0xe02f, SIZE6],
        rep: [0xe030, SIZE6],
        mid: [0xe031, SIZE6],
        right: [0xe032, SIZE6]
      }
    },
    0x219b: {
      dir: H,
      HW: [[690, MAIN], [1010, SIZE1]],
      stretch: {
        left: [0xe033, SIZE6],
        rep: [0xe034, SIZE6],
        mid: [0xe035, SIZE6],
        right: [0xe036, SIZE6]
      }
    },
    0x219e: {
      dir: H,
      HW: [[870, MAIN], [1190, SIZE1]],
      stretch: {
        left: [0xe041, SIZE6],
        rep: [0xe042, SIZE6],
        right: [0xe043, SIZE6]
      }
    },
    0x219f: {
      dir: V,
      HW: [[870, ARROWS], [1190, SIZE1]],
      stretch: {
        bot: [0xe047, SIZE6],
        ext: [0xe048, SIZE6],
        top: [0xe049, SIZE6]
      }
    },
    0x21a0: {
      dir: H,
      HW: [[870, MAIN], [1190, SIZE1]],
      stretch: {
        left: [0xe044, SIZE6],
        rep: [0xe045, SIZE6],
        right: [0xe046, SIZE6]
      }
    },
    0x21a1: {
      dir: V,
      HW: [[870, ARROWS], [1190, SIZE1]],
      stretch: {
        bot: [0xe04a, SIZE6],
        ext: [0xe04b, SIZE6],
        top: [0xe04c, SIZE6]
      }
    },
    0x21a2: {
      dir: H,
      HW: [[880, MAIN], [1200, SIZE1]],
      stretch: {
        left: [0xe04d, SIZE6],
        rep: [0xe04e, SIZE6],
        right: [0xe04f, SIZE6]
      }
    },
    0x21a3: {
      dir: H,
      HW: [[880, MAIN], [1200, SIZE1]],
      stretch: {
        left: [0xe050, SIZE6],
        rep: [0xe051, SIZE6],
        right: [0xe052, SIZE6]
      }
    },
    0x21a5: {
      dir: V,
      HW: [[690, ARROWS], [1010, SIZE1]],
      stretch: {
        bot: [0xe059, SIZE6],
        ext: [0xe05a, SIZE6],
        top: [0xe05b, SIZE6]
      }
    },
    0x21a7: {
      dir: V,
      HW: [[690, ARROWS], [1010, SIZE1]],
      stretch: {
        bot: [0xe05c, SIZE6],
        ext: [0xe05d, SIZE6],
        top: [0xe05e, SIZE6]
      }
    },
    0x21a9: {
      dir: H,
      HW: [[716, MAIN], [1036, SIZE1]],
      stretch: {
        left: [0xe062, SIZE6],
        rep: [0xe063, SIZE6],
        right: [0xe064, SIZE6]
      }
    },
    0x21aa: {
      dir: H,
      HW: [[716, MAIN], [1036, SIZE1]],
      stretch: {
        left: [0xe05f, SIZE6],
        rep: [0xe060, SIZE6],
        right: [0xe061, SIZE6]
      }
    },
    0x21ab: {
      dir: H,
      HW: [[716, MAIN], [1036, SIZE1]],
      stretch: {
        left: [0xe068, SIZE6],
        rep: [0xe069, SIZE6],
        right: [0xe06a, SIZE6]
      }
    },
    0x21ac: {
      dir: H,
      HW: [[716, MAIN], [1036, SIZE1]],
      stretch: {
        left: [0xe065, SIZE6],
        rep: [0xe066, SIZE6],
        right: [0xe067, SIZE6]
      }
    },
    0x21ad: {
      dir: H,
      HW: [[880, MAIN], [1200, SIZE1]]
    },
    0x21ae: {
      dir: H,
      HW: [[880, MAIN], [1200, SIZE1]],
      stretch: {
        left: [0xe03d, SIZE6],
        rep: [0xe03e, SIZE6],
        mid: [0xe03f, SIZE6],
        right: [0xe040, SIZE6]
      }
    },
    0x21b0: {
      dir: V,
      HW: [[696, MAIN], [888, SIZE1]]
    },
    0x21b1: {
      dir: V,
      HW: [[696, MAIN], [888, SIZE1]]
    },
    0x21b2: {
      dir: V,
      HW: [[696, ARROWS], [888, SIZE1]]
    },
    0x21b3: {
      dir: V,
      HW: [[696, ARROWS], [888, SIZE1]]
    },
    0x21b6: {
      dir: H,
      HW: [[639, MAIN], [879, SIZE1]]
    },
    0x21b7: {
      dir: H,
      HW: [[639, MAIN], [879, SIZE1]]
    },
    0x21bc: {
      dir: H,
      HW: [[680, MAIN], [1000, SIZE1]],
      stretch: {
        left: [0xe06b, SIZE6],
        rep: [0xe06c, SIZE6],
        right: [0xe06d, SIZE6]
      }
    },
    0x21bd: {
      dir: H,
      HW: [[680, MAIN], [1000, SIZE1]],
      stretch: {
        left: [0xe071, SIZE6],
        rep: [0xe072, SIZE6],
        right: [0xe073, SIZE6]
      }
    },
    0x21be: {
      dir: V,
      HW: [[680, MAIN], [1000, SIZE1]],
      stretch: {
        bot: [0xe077, SIZE6],
        ext: [0xe078, SIZE6],
        top: [0xe079, SIZE6]
      }
    },
    0x21bf: {
      dir: V,
      HW: [[680, MAIN], [1000, SIZE1]],
      stretch: {
        bot: [0xe07d, SIZE6],
        ext: [0xe07e, SIZE6],
        top: [0xe07f, SIZE6]
      }
    },
    0x21c0: {
      dir: H,
      HW: [[680, MAIN], [1000, SIZE1]],
      stretch: {
        left: [0xe06e, SIZE6],
        rep: [0xe06f, SIZE6],
        right: [0xe070, SIZE6]
      }
    },
    0x21c1: {
      dir: H,
      HW: [[680, MAIN], [1000, SIZE1]],
      stretch: {
        left: [0xe074, SIZE6],
        rep: [0xe075, SIZE6],
        right: [0xe076, SIZE6]
      }
    },
    0x21c2: {
      dir: V,
      HW: [[680, MAIN], [1000, SIZE1]],
      stretch: {
        bot: [0xe07a, SIZE6],
        ext: [0xe07b, SIZE6],
        top: [0xe07c, SIZE6]
      }
    },
    0x21c3: {
      dir: V,
      HW: [[680, MAIN], [1000, SIZE1]],
      stretch: {
        bot: [0xe080, SIZE6],
        ext: [0xe081, SIZE6],
        top: [0xe082, SIZE6]
      }
    },
    0x21c4: {
      dir: H,
      HW: [[700, MAIN], [1020, SIZE1]],
      stretch: {
        left: [0xe083, SIZE6],
        rep: [0xe084, SIZE6],
        right: [0xe085, SIZE6]
      }
    },
    0x21c5: {
      dir: V,
      HW: [[700, ARROWS], [1020, SIZE1]],
      stretch: {
        bot: [0xe089, SIZE6],
        ext: [0xe08a, SIZE6],
        top: [0xe08b, SIZE6]
      }
    },
    0x21c6: {
      dir: H,
      HW: [[700, MAIN], [1020, SIZE1]],
      stretch: {
        left: [0xe086, SIZE6],
        rep: [0xe087, SIZE6],
        right: [0xe088, SIZE6]
      }
    },
    0x21c7: {
      dir: H,
      HW: [[690, MAIN], [1010, SIZE1]],
      stretch: {
        left: [0xe08f, SIZE6],
        rep: [0xe090, SIZE6],
        right: [0xe091, SIZE6]
      }
    },
    0x21c8: {
      dir: V,
      HW: [[690, MAIN], [1010, SIZE1]],
      stretch: {
        bot: [0xe095, SIZE6],
        ext: [0xe096, SIZE6],
        top: [0xe097, SIZE6]
      }
    },
    0x21c9: {
      dir: H,
      HW: [[690, MAIN], [1010, SIZE1]],
      stretch: {
        left: [0xe092, SIZE6],
        rep: [0xe093, SIZE6],
        right: [0xe094, SIZE6]
      }
    },
    0x21ca: {
      dir: V,
      HW: [[690, MAIN], [1010, SIZE1]],
      stretch: {
        bot: [0xe098, SIZE6],
        ext: [0xe099, SIZE6],
        top: [0xe09a, SIZE6]
      }
    },
    0x21cb: {
      dir: H,
      HW: [[680, MAIN], [1000, SIZE1]],
      stretch: {
        left: [0xe0a1, SIZE6],
        rep: [0xe0a2, SIZE6],
        right: [0xe0a3, SIZE6]
      }
    },
    0x21cc: {
      dir: H,
      HW: [[680, MAIN], [1000, SIZE1]],
      stretch: {
        left: [0xe0a4, SIZE6],
        rep: [0xe0a5, SIZE6],
        right: [0xe0a6, SIZE6]
      }
    },
    0x21cd: {
      dir: H,
      HW: [[690, MAIN], [1010, SIZE1]],
      stretch: {
        left: [0xe0b9, SIZE6],
        rep: [0xe0ba, SIZE6],
        mid: [0xe0bb, SIZE6],
        right: [0xe0bc, SIZE6]
      }
    },
    0x21ce: {
      dir: H,
      HW: [[880, MAIN], [1200, SIZE1]],
      stretch: {
        left: [0xe0c1, SIZE6],
        rep: [0xe0c2, SIZE6],
        mid: [0xe0c3, SIZE6],
        right: [0xe0c4, SIZE6]
      }
    },
    0x21cf: {
      dir: H,
      HW: [[690, MAIN], [1010, SIZE1]],
      stretch: {
        left: [0xe0bd, SIZE6],
        rep: [0xe0be, SIZE6],
        mid: [0xe0bf, SIZE6],
        right: [0xe0c0, SIZE6]
      }
    },
    0x21d6: {
      dir: V,
      HW: [[560, ARROWS], [787, SIZE1]]
    },
    0x21d7: {
      dir: V,
      HW: [[560, ARROWS], [787, SIZE1]]
    },
    0x21d8: {
      dir: V,
      HW: [[560, ARROWS], [787, SIZE1]]
    },
    0x21d9: {
      dir: V,
      HW: [[560, ARROWS], [787, SIZE1]]
    },
    0x21da: {
      dir: H,
      HW: [[870, MAIN], [1190, SIZE1]],
      stretch: {
        left: [0xe0cb, SIZE6],
        rep: [0xe0cc, SIZE6],
        right: [0xe0cd, SIZE6]
      }
    },
    0x21db: {
      dir: H,
      HW: [[870, MAIN], [1190, SIZE1]],
      stretch: {
        left: [0xe0ce, SIZE6],
        rep: [0xe0cf, SIZE6],
        right: [0xe0d0, SIZE6]
      }
    },
    0x21dc: {
      dir: H,
      HW: [[690, ARROWS], [1010, SIZE1]]
    },
    0x21dd: {
      dir: H,
      HW: [[690, MAIN], [1010, SIZE1]]
    },
    0x21e6: {
      dir: H,
      HW: [[913, ARROWS], [1233, SIZE1]],
      stretch: {
        left: [0xe0d1, SIZE6],
        rep: [0xe0d2, SIZE6],
        right: [0xe0d3, SIZE6]
      }
    },
    0x21e7: {
      dir: V,
      HW: [[913, ARROWS], [1233, SIZE1]],
      stretch: {
        bot: [0xe0d7, SIZE6],
        ext: [0xe0d8, SIZE6],
        top: [0xe0d9, SIZE6]
      }
    },
    0x21e8: {
      dir: H,
      HW: [[913, ARROWS], [1233, SIZE1]],
      stretch: {
        left: [0xe0d4, SIZE6],
        rep: [0xe0d5, SIZE6],
        right: [0xe0d6, SIZE6]
      }
    },
    0x21e9: {
      dir: V,
      HW: [[913, ARROWS], [1233, SIZE1]],
      stretch: {
        bot: [0xe0da, SIZE6],
        ext: [0xe0db, SIZE6],
        top: [0xe0dc, SIZE6]
      }
    },
    0x21f3: {
      dir: V,
      HW: [[930, ARROWS], [1250, SIZE1]],
      stretch: {
        bot: [0xe0dd, SIZE6],
        ext: [0xe0de, SIZE6],
        top: [0xe0df, SIZE6]
      }
    },
    0x21f5: {
      dir: V,
      HW: [[700, ARROWS], [1020, SIZE1]],
      stretch: {
        bot: [0xe08c, SIZE6],
        ext: [0xe08d, SIZE6],
        top: [0xe08e, SIZE6]
      }
    },
    0x21f6: {
      dir: H,
      HW: [[690, ARROWS], [1010, SIZE1]],
      stretch: {
        left: [0xe09b, SIZE6],
        rep: [0xe09c, SIZE6],
        right: [0xe09d, SIZE6]
      }
    },
    0x220f: {
      dir: V,
      HW: [[954, OPERATORS], [1374, SIZE1]]
    },
    0x2210: {
      dir: V,
      HW: [[954, OPERATORS], [1374, SIZE1]]
    },
    0x2211: {
      dir: V,
      HW: [[954, OPERATORS], [1374, SIZE1]]
    },
    0x222b: {
      dir: V,
      HW: [[1092, MAIN], [2025, SIZE1]],
      stretch: {
        top: [0xe135, SIZE6],
        ext: [0x23ae, SYMBOLS],
        bot: [0xe136, SIZE6]
      }
    },
    0x222c: {
      dir: V,
      HW: [[1092, OPERATORS], [2025, SIZE1]],
      stretch: {
        top: [0xe137, SIZE6],
        ext: [0xe138, SIZE6],
        bot: [0xe139, SIZE6]
      }
    },
    0x222d: {
      dir: V,
      HW: [[1092, OPERATORS], [2025, SIZE1]],
      stretch: {
        top: [0xe13a, SIZE6],
        ext: [0xe13b, SIZE6],
        bot: [0xe13c, SIZE6]
      }
    },
    0x222e: {
      dir: V,
      HW: [[1092, OPERATORS, null, 0x222f], [2025, SIZE1]]
    },
    0x222f: {
      dir: V,
      HW: [[1092, OPERATORS], [2025, SIZE1]]
    },
    0x2230: {
      dir: V,
      HW: [[1092, OPERATORS], [2025, SIZE1]]
    },
    0x2231: {
      dir: V,
      HW: [[1092, OPERATORS], [2025, SIZE1]]
    },
    0x2232: {
      dir: V,
      HW: [[1092, OPERATORS], [2025, SIZE1]]
    },
    0x2233: {
      dir: V,
      HW: [[1092, OPERATORS], [2025, SIZE1]]
    },
    0x2261: {
      dir: H,
      HW: [[500, MAIN]],
      stretch: {
        left: [0xe12d, SIZE6],
        rep: [0xe12e, SIZE6],
        right: [0xe12f, SIZE6]
      }
    },
    0x2263: {
      dir: H,
      HW: [[500, OPERATORS]],
      stretch: {
        left: [0xe130, SIZE6],
        rep: [0xe131, SIZE6],
        right: [0xe132, SIZE6]
      }
    },
    0x22a2: {
      dir: V,
      HW: [[650, MAIN], [800, SIZE1]]
    },
    0x22a3: {
      dir: V,
      HW: [[650, MAIN], [800, SIZE1]]
    },
    0x22a4: {
      dir: V,
      HW: [[650, MAIN], [800, SIZE1]]
    },
    0x22a5: {
      dir: V,
      HW: [[650, MAIN], [800, SIZE1]]
    },
    0x22c0: {
      dir: V,
      HW: [[888, OPERATORS], [1165, SIZE1]]
    },
    0x22c1: {
      dir: V,
      HW: [[888, OPERATORS], [1165, SIZE1]]
    },
    0x22c2: {
      dir: V,
      HW: [[898, OPERATORS], [1170, SIZE1]]
    },
    0x22c3: {
      dir: V,
      HW: [[898, OPERATORS], [1170, SIZE1]]
    },
    0x23b4: {
      dir: H,
      HW: [
        [375, MAIN],
        [750, SIZE1],
        [1125, SIZE2],
        [1500, SIZE3],
        [1875, SIZE4],
        [2250, SIZE5],
        [2625, SIZE6]
      ],
      stretch: {
        left: [0xe11b, SIZE6],
        rep: [0xe11c, SIZE6],
        right: [0xe11d, SIZE6]
      }
    },
    0x23b5: {
      dir: H,
      HW: [
        [375, MAIN],
        [750, SIZE1],
        [1125, SIZE2],
        [1500, SIZE3],
        [1875, SIZE4],
        [2250, SIZE5],
        [2625, SIZE6]
      ],
      stretch: {
        left: [0xe11e, SIZE6],
        rep: [0xe11f, SIZE6],
        right: [0xe120, SIZE6]
      }
    },
    0x23dc: {
      dir: H,
      HW: [
        [514, MAIN],
        [1014, SIZE1],
        [1514, SIZE2],
        [2013, SIZE3],
        [2514, SIZE4],
        [3014, SIZE5],
        [3514, SIZE6]
      ],
      stretch: {
        left: [0xe115, SIZE6],
        rep: [0xe116, SIZE6],
        right: [0xe117, SIZE6]
      }
    },
    0x23dd: {
      dir: H,
      HW: [
        [514, MAIN],
        [1014, SIZE1],
        [1514, SIZE2],
        [2013, SIZE3],
        [2514, SIZE4],
        [3014, SIZE5],
        [3514, SIZE6]
      ],
      stretch: {
        left: [0xe118, SIZE6],
        rep: [0xe119, SIZE6],
        right: [0xe11a, SIZE6]
      }
    },
    0x23e0: {
      dir: H,
      HW: [
        [562, MAIN],
        [1066, SIZE1],
        [1568, SIZE2],
        [2072, SIZE3],
        [2576, SIZE4],
        [3080, SIZE5],
        [3584, SIZE6]
      ],
      stretch: {
        left: [0xe121, SIZE6],
        rep: [0xe122, SIZE6],
        right: [0xe123, SIZE6]
      }
    },
    0x23e1: {
      dir: H,
      HW: [
        [562, MAIN],
        [1066, SIZE1],
        [1568, SIZE2],
        [2072, SIZE3],
        [2576, SIZE4],
        [3080, SIZE5],
        [3584, SIZE6]
      ],
      stretch: {
        left: [0xe124, SIZE6],
        rep: [0xe125, SIZE6],
        right: [0xe126, SIZE6]
      }
    },
    0x27a1: {
      dir: H,
      HW: [[870, MISC], [1190, SIZE1]],
      stretch: {
        left: [0xe0e6, SIZE6],
        rep: [0xe0e7, SIZE6],
        right: [0xe0e8, SIZE6]
      }
    },
    0x27e6: {
      dir: V,
      HW: [
        [836, SYMBOLS],
        [998, SIZE1],
        [1190, SIZE2],
        [1422, SIZE3],
        [1698, SIZE4],
        [2032, SIZE5],
        [2432, SIZE6]
      ],
      stretch: {
        bot: [0xe107, SIZE6],
        ext: [0xe108, SIZE6],
        top: [0xe109, SIZE6]
      }
    },
    0x27e7: {
      dir: V,
      HW: [
        [836, SYMBOLS],
        [998, SIZE1],
        [1190, SIZE2],
        [1422, SIZE3],
        [1698, SIZE4],
        [2032, SIZE5],
        [2432, SIZE6]
      ],
      stretch: {
        bot: [0xe10a, SIZE6],
        ext: [0xe10b, SIZE6],
        top: [0xe10c, SIZE6]
      }
    },
    0x27ea: {
      dir: V,
      HW: [
        [812, SYMBOLS],
        [1060, SIZE1],
        [1382, SIZE2],
        [1806, SIZE3],
        [2364, SIZE4],
        [3092, SIZE5],
        [4048, SIZE6]
      ]
    },
    0x27eb: {
      dir: V,
      HW: [
        [812, SYMBOLS],
        [1060, SIZE1],
        [1382, SIZE2],
        [1806, SIZE3],
        [2364, SIZE4],
        [3092, SIZE5],
        [4048, SIZE6]
      ]
    },
    0x2a00: {
      dir: V,
      HW: [[876, OPERATORS], [1132, SIZE1]]
    },
    0x2a01: {
      dir: V,
      HW: [[876, OPERATORS], [1132, SIZE1]]
    },
    0x2a02: {
      dir: V,
      HW: [[876, OPERATORS], [1132, SIZE1]]
    },
    0x2a03: {
      dir: V,
      HW: [[898, OPERATORS], [1170, SIZE1]]
    },
    0x2a04: {
      dir: V,
      HW: [[898, OPERATORS], [1170, SIZE1]]
    },
    0x2a05: {
      dir: V,
      HW: [[880, OPERATORS], [1152, SIZE1]]
    },
    0x2a06: {
      dir: V,
      HW: [[880, OPERATORS], [1152, SIZE1]]
    },
    0x2a09: {
      dir: V,
      HW: [[716, OPERATORS], [906, SIZE1]]
    },
    0x2a0c: {
      dir: V,
      HW: [[1092, OPERATORS], [2025, SIZE1]]
    },
    0x2a11: {
      dir: V,
      HW: [[1092, OPERATORS], [2025, SIZE1]]
    },
    0x2b04: {
      dir: H,
      HW: [[931, SHAPES], [1251, SIZE1]],
      stretch: {
        left: [0xe0e0, SIZE6],
        rep: [0xe0e1, SIZE6],
        right: [0xe0e2, SIZE6]
      }
    },
    0x2b05: {
      dir: H,
      HW: [[870, SHAPES], [1190, SIZE1]],
      stretch: {
        left: [0xe0e3, SIZE6],
        rep: [0xe0e4, SIZE6],
        right: [0xe0e5, SIZE6]
      }
    },
    0x2b06: {
      dir: V,
      HW: [[870, SHAPES], [1190, SIZE1]],
      stretch: {
        bot: [0xe0e9, SIZE6],
        ext: [0xe0ea, SIZE6],
        top: [0xe0eb, SIZE6]
      }
    },
    0x2b07: {
      dir: V,
      HW: [[870, SHAPES], [1190, SIZE1]],
      stretch: {
        bot: [0xe0ec, SIZE6],
        ext: [0xe0ed, SIZE6],
        top: [0xe0ee, SIZE6]
      }
    },
    0x2b0c: {
      dir: H,
      HW: [[880, SHAPES], [1200, SIZE1]],
      stretch: {
        left: [0xe0ef, SIZE6],
        rep: [0xe0f0, SIZE6],
        right: [0xe0f1, SIZE6]
      }
    },
    0x2b0d: {
      dir: V,
      HW: [[880, SHAPES], [1200, SIZE1]],
      stretch: {
        bot: [0xe0f2, SIZE6],
        ext: [0xe0f3, SIZE6],
        top: [0xe0f4, SIZE6]
      }
    },
    0x2b31: {
      dir: H,
      HW: [[690, SHAPES], [1010, SIZE1]],
      stretch: {
        left: [0xe09e, SIZE6],
        rep: [0xe09f, SIZE6],
        right: [0xe0a0, SIZE6]
      }
    }
  };

  for (var id in delim) {
    if (delim.hasOwnProperty(id)) {
      DELIMITERS[id] = delim[id];
    }
  }

  MathJax.Ajax.loadComplete(SVG.fontDir + "/fontdata-extra.js");
})(MathJax.OutputJax["SVG"]);
