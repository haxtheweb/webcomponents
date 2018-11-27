/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/Latin-Modern/fontdata-extra.js
 *  
 *  Adds extra stretchy characters to the Latin-Modern fonts

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

  var delim = {
    0x306: {
      dir: H,
      HW: [
        [0.374, MAIN],
        [0.658, SIZE1],
        [0.784, SIZE2],
        [0.937, SIZE3],
        [1.12, SIZE4],
        [1.341, SIZE5],
        [1.604, SIZE6],
        [1.92, SIZE7]
      ]
    },
    0x311: {
      dir: H,
      HW: [
        [0.374, MARKS],
        [0.658, SIZE1],
        [0.784, SIZE2],
        [0.937, SIZE3],
        [1.12, SIZE4],
        [1.341, SIZE5],
        [1.604, SIZE6],
        [1.92, SIZE7]
      ]
    },
    0x32c: {
      dir: H,
      HW: [
        [0.364, MARKS],
        [0.644, SIZE1],
        [0.768, SIZE2],
        [0.919, SIZE3],
        [1.1, SIZE4],
        [1.32, SIZE5],
        [1.581, SIZE6],
        [1.896, SIZE7]
      ]
    },
    0x32d: {
      dir: H,
      HW: [
        [0.364, MARKS],
        [0.644, SIZE1],
        [0.768, SIZE2],
        [0.919, SIZE3],
        [1.1, SIZE4],
        [1.32, SIZE5],
        [1.581, SIZE6],
        [1.896, SIZE7]
      ]
    },
    0x32e: {
      dir: H,
      HW: [
        [0.374, MARKS],
        [0.658, SIZE1],
        [0.784, SIZE2],
        [0.937, SIZE3],
        [1.12, SIZE4],
        [1.341, SIZE5],
        [1.604, SIZE6],
        [1.92, SIZE7]
      ]
    },
    0x32f: {
      dir: H,
      HW: [
        [0.374, MARKS],
        [0.658, SIZE1],
        [0.784, SIZE2],
        [0.937, SIZE3],
        [1.12, SIZE4],
        [1.341, SIZE5],
        [1.604, SIZE6],
        [1.92, SIZE7]
      ]
    },
    0x330: {
      dir: H,
      HW: [
        [0.37, MARKS],
        [0.652, SIZE1],
        [0.778, SIZE2],
        [0.931, SIZE3],
        [1.115, SIZE4],
        [1.335, SIZE5],
        [1.599, SIZE6],
        [1.915, SIZE7]
      ]
    },
    0x333: {
      dir: H,
      HW: [[0.392, MARKS], [0.568, SIZE1]],
      stretch: {
        left: [0xe0f8, SIZE7],
        rep: [0xe0f9, SIZE7],
        right: [0xe0fa, SIZE7]
      }
    },
    0x33f: {
      dir: H,
      HW: [[0.392, MARKS], [0.568, SIZE1]],
      stretch: {
        left: [0xe0fe, SIZE7],
        rep: [0xe0ff, SIZE7],
        right: [0xe100, SIZE7]
      }
    },
    0x20d0: {
      dir: H,
      HW: [[0.422, MARKS], [0.555, SIZE1]],
      stretch: {
        left: [0xe008, SIZE7],
        rep: [0xe009, SIZE7],
        right: [0xe00a, SIZE7]
      }
    },
    0x20d1: {
      dir: H,
      HW: [[0.422, MARKS], [0.555, SIZE1]],
      stretch: {
        left: [0xe00b, SIZE7],
        rep: [0xe00c, SIZE7],
        right: [0xe00d, SIZE7]
      }
    },
    0x20d6: {
      dir: H,
      HW: [[0.416, MARKS], [0.547, SIZE1]],
      stretch: {
        left: [0xe00e, SIZE7],
        rep: [0xe00f, SIZE7],
        right: [0xe010, SIZE7]
      }
    },
    0x20d7: {
      dir: H,
      HW: [[0.416, MAIN], [0.547, SIZE1]],
      stretch: {
        left: [0xe011, SIZE7],
        rep: [0xe012, SIZE7],
        right: [0xe013, SIZE7]
      }
    },
    0x20e1: {
      dir: H,
      HW: [[0.47, MARKS], [0.603, SIZE1]],
      stretch: {
        left: [0xe014, SIZE7],
        rep: [0xe015, SIZE7],
        right: [0xe016, SIZE7]
      }
    },
    0x20e9: {
      dir: H,
      HW: [
        [0.36, MARKS],
        [0.735, SIZE1],
        [1.11, SIZE2],
        [1.485, SIZE3],
        [1.86, SIZE4],
        [2.235, SIZE5],
        [2.61, SIZE6],
        [2.985, SIZE7]
      ],
      stretch: {
        left: [0xe11b, SIZE7],
        rep: [0xe11c, SIZE7],
        right: [0xe11d, SIZE7]
      }
    },
    0x20ec: {
      dir: H,
      HW: [[0.422, MARKS], [0.555, SIZE1]],
      stretch: {
        left: [0xe017, SIZE7],
        rep: [0xe018, SIZE7],
        right: [0xe019, SIZE7]
      }
    },
    0x20ed: {
      dir: H,
      HW: [[0.422, MARKS], [0.555, SIZE1]],
      stretch: {
        left: [0xe01a, SIZE7],
        rep: [0xe01b, SIZE7],
        right: [0xe01c, SIZE7]
      }
    },
    0x20ee: {
      dir: H,
      HW: [[0.416, MARKS], [0.547, SIZE1]],
      stretch: {
        left: [0xe01d, SIZE7],
        rep: [0xe01e, SIZE7],
        right: [0xe01f, SIZE7]
      }
    },
    0x20ef: {
      dir: H,
      HW: [[0.416, MARKS], [0.547, SIZE1]],
      stretch: {
        left: [0xe020, SIZE7],
        rep: [0xe021, SIZE7],
        right: [0xe022, SIZE7]
      }
    },
    0x2196: {
      dir: V,
      HW: [[0.917, MAIN], [1.383, SIZE1]]
    },
    0x2197: {
      dir: V,
      HW: [[0.917, MAIN], [1.383, SIZE1]]
    },
    0x2198: {
      dir: V,
      HW: [[0.917, MAIN], [1.383, SIZE1]]
    },
    0x2199: {
      dir: V,
      HW: [[0.917, MAIN], [1.383, SIZE1]]
    },
    0x219a: {
      dir: H,
      HW: [[0.885, MAIN], [1.351, SIZE1]],
      stretch: {
        left: [0xe02f, SIZE7],
        rep: [0xe030, SIZE7],
        mid: [0xe031, SIZE7],
        right: [0xe032, SIZE7]
      }
    },
    0x219b: {
      dir: H,
      HW: [[0.885, MAIN], [1.351, SIZE1]],
      stretch: {
        left: [0xe033, SIZE7],
        rep: [0xe034, SIZE7],
        mid: [0xe035, SIZE7],
        right: [0xe036, SIZE7]
      }
    },
    0x219e: {
      dir: H,
      HW: [[0.905, MAIN], [1.351, SIZE1]],
      stretch: {
        left: [0xe041, SIZE7],
        rep: [0xe042, SIZE7],
        right: [0xe043, SIZE7]
      }
    },
    0x219f: {
      dir: V,
      HW: [[0.902, ARROWS], [1.348, SIZE1]],
      stretch: {
        bot: [0xe047, SIZE7],
        ext: [0xe048, SIZE7],
        top: [0xe049, SIZE7]
      }
    },
    0x21a0: {
      dir: H,
      HW: [[0.905, MAIN], [1.351, SIZE1]],
      stretch: {
        left: [0xe044, SIZE7],
        rep: [0xe045, SIZE7],
        right: [0xe046, SIZE7]
      }
    },
    0x21a1: {
      dir: V,
      HW: [[0.902, ARROWS], [1.348, SIZE1]],
      stretch: {
        bot: [0xe04a, SIZE7],
        ext: [0xe04b, SIZE7],
        top: [0xe04c, SIZE7]
      }
    },
    0x21a2: {
      dir: H,
      HW: [[1.08, MAIN], [1.546, SIZE1]],
      stretch: {
        left: [0xe04d, SIZE7],
        rep: [0xe04e, SIZE7],
        right: [0xe04f, SIZE7]
      }
    },
    0x21a3: {
      dir: H,
      HW: [[1.08, MAIN], [1.546, SIZE1]],
      stretch: {
        left: [0xe050, SIZE7],
        rep: [0xe051, SIZE7],
        right: [0xe052, SIZE7]
      }
    },
    0x21a5: {
      dir: V,
      HW: [[0.862, ARROWS], [1.328, SIZE1]],
      stretch: {
        bot: [0xe059, SIZE7],
        ext: [0xe05a, SIZE7],
        top: [0xe05b, SIZE7]
      }
    },
    0x21a7: {
      dir: V,
      HW: [[0.862, ARROWS], [1.328, SIZE1]],
      stretch: {
        bot: [0xe05c, SIZE7],
        ext: [0xe05d, SIZE7],
        top: [0xe05e, SIZE7]
      }
    },
    0x21a9: {
      dir: H,
      HW: [[0.885, MAIN], [1.351, SIZE1]],
      stretch: {
        left: [0xe062, SIZE7],
        rep: [0xe063, SIZE7],
        right: [0xe064, SIZE7]
      }
    },
    0x21aa: {
      dir: H,
      HW: [[0.885, MAIN], [1.351, SIZE1]],
      stretch: {
        left: [0xe05f, SIZE7],
        rep: [0xe060, SIZE7],
        right: [0xe061, SIZE7]
      }
    },
    0x21ab: {
      dir: H,
      HW: [[0.885, MAIN], [1.351, SIZE1]],
      stretch: {
        left: [0xe068, SIZE7],
        rep: [0xe069, SIZE7],
        right: [0xe06a, SIZE7]
      }
    },
    0x21ac: {
      dir: H,
      HW: [[0.885, MAIN], [1.351, SIZE1]],
      stretch: {
        left: [0xe065, SIZE7],
        rep: [0xe066, SIZE7],
        right: [0xe067, SIZE7]
      }
    },
    0x21ad: {
      dir: H,
      HW: [[0.884, MAIN], [1.33, SIZE1]]
    },
    0x21ae: {
      dir: H,
      HW: [[0.884, MAIN], [1.33, SIZE1]],
      stretch: {
        left: [0xe03d, SIZE7],
        rep: [0xe03e, SIZE7],
        mid: [0xe03f, SIZE7],
        right: [0xe040, SIZE7]
      }
    },
    0x21b0: {
      dir: V,
      HW: [[0.858, MAIN], [1.168, SIZE1]]
    },
    0x21b1: {
      dir: V,
      HW: [[0.858, MAIN], [1.168, SIZE1]]
    },
    0x21b2: {
      dir: V,
      HW: [[0.858, ARROWS], [1.168, SIZE1]]
    },
    0x21b3: {
      dir: V,
      HW: [[0.858, ARROWS], [1.168, SIZE1]]
    },
    0x21b6: {
      dir: H,
      HW: [[0.868, MAIN], [1.218, SIZE1]]
    },
    0x21b7: {
      dir: H,
      HW: [[0.868, MAIN], [1.218, SIZE1]]
    },
    0x21bc: {
      dir: H,
      HW: [[0.9, MAIN], [1.366, SIZE1]],
      stretch: {
        left: [0xe06b, SIZE7],
        rep: [0xe06c, SIZE7],
        right: [0xe06d, SIZE7]
      }
    },
    0x21bd: {
      dir: H,
      HW: [[0.9, MAIN], [1.366, SIZE1]],
      stretch: {
        left: [0xe071, SIZE7],
        rep: [0xe072, SIZE7],
        right: [0xe073, SIZE7]
      }
    },
    0x21be: {
      dir: V,
      HW: [[0.9, MAIN], [1.366, SIZE1]],
      stretch: {
        bot: [0xe077, SIZE7],
        ext: [0xe078, SIZE7],
        top: [0xe079, SIZE7]
      }
    },
    0x21bf: {
      dir: V,
      HW: [[0.9, MAIN], [1.366, SIZE1]],
      stretch: {
        bot: [0xe07d, SIZE7],
        ext: [0xe07e, SIZE7],
        top: [0xe07f, SIZE7]
      }
    },
    0x21c0: {
      dir: H,
      HW: [[0.9, MAIN], [1.366, SIZE1]],
      stretch: {
        left: [0xe06e, SIZE7],
        rep: [0xe06f, SIZE7],
        right: [0xe070, SIZE7]
      }
    },
    0x21c1: {
      dir: H,
      HW: [[0.9, MAIN], [1.366, SIZE1]],
      stretch: {
        left: [0xe074, SIZE7],
        rep: [0xe075, SIZE7],
        right: [0xe076, SIZE7]
      }
    },
    0x21c2: {
      dir: V,
      HW: [[0.9, MAIN], [1.366, SIZE1]],
      stretch: {
        bot: [0xe07a, SIZE7],
        ext: [0xe07b, SIZE7],
        top: [0xe07c, SIZE7]
      }
    },
    0x21c3: {
      dir: V,
      HW: [[0.9, MAIN], [1.366, SIZE1]],
      stretch: {
        bot: [0xe080, SIZE7],
        ext: [0xe081, SIZE7],
        top: [0xe082, SIZE7]
      }
    },
    0x21c4: {
      dir: H,
      HW: [[0.906, MAIN], [1.372, SIZE1]],
      stretch: {
        left: [0xe083, SIZE7],
        rep: [0xe084, SIZE7],
        right: [0xe085, SIZE7]
      }
    },
    0x21c5: {
      dir: V,
      HW: [[0.906, ARROWS], [1.372, SIZE1]],
      stretch: {
        bot: [0xe089, SIZE7],
        ext: [0xe08a, SIZE7],
        top: [0xe08b, SIZE7]
      }
    },
    0x21c6: {
      dir: H,
      HW: [[0.906, MAIN], [1.372, SIZE1]],
      stretch: {
        left: [0xe086, SIZE7],
        rep: [0xe087, SIZE7],
        right: [0xe088, SIZE7]
      }
    },
    0x21c7: {
      dir: H,
      HW: [[0.885, MAIN], [1.351, SIZE1]],
      stretch: {
        left: [0xe08f, SIZE7],
        rep: [0xe090, SIZE7],
        right: [0xe091, SIZE7]
      }
    },
    0x21c8: {
      dir: V,
      HW: [[0.882, MAIN], [1.348, SIZE1]],
      stretch: {
        bot: [0xe095, SIZE7],
        ext: [0xe096, SIZE7],
        top: [0xe097, SIZE7]
      }
    },
    0x21c9: {
      dir: H,
      HW: [[0.885, MAIN], [1.351, SIZE1]],
      stretch: {
        left: [0xe092, SIZE7],
        rep: [0xe093, SIZE7],
        right: [0xe094, SIZE7]
      }
    },
    0x21ca: {
      dir: V,
      HW: [[0.882, MAIN], [1.348, SIZE1]],
      stretch: {
        bot: [0xe098, SIZE7],
        ext: [0xe099, SIZE7],
        top: [0xe09a, SIZE7]
      }
    },
    0x21cb: {
      dir: H,
      HW: [[0.906, MAIN], [1.372, SIZE1]],
      stretch: {
        left: [0xe0a1, SIZE7],
        rep: [0xe0a2, SIZE7],
        right: [0xe0a3, SIZE7]
      }
    },
    0x21cc: {
      dir: H,
      HW: [[0.906, MAIN], [1.372, SIZE1]],
      stretch: {
        left: [0xe0a4, SIZE7],
        rep: [0xe0a5, SIZE7],
        right: [0xe0a6, SIZE7]
      }
    },
    0x21cd: {
      dir: H,
      HW: [[0.879, MAIN], [1.345, SIZE1]],
      stretch: {
        left: [0xe0b9, SIZE7],
        rep: [0xe0ba, SIZE7],
        mid: [0xe0bb, SIZE7],
        right: [0xe0bc, SIZE7]
      }
    },
    0x21ce: {
      dir: H,
      HW: [[0.956, MAIN], [1.422, SIZE1]],
      stretch: {
        left: [0xe0c1, SIZE7],
        rep: [0xe0c2, SIZE7],
        mid: [0xe0c3, SIZE7],
        right: [0xe0c4, SIZE7]
      }
    },
    0x21cf: {
      dir: H,
      HW: [[0.879, MAIN], [1.345, SIZE1]],
      stretch: {
        left: [0xe0bd, SIZE7],
        rep: [0xe0be, SIZE7],
        mid: [0xe0bf, SIZE7],
        right: [0xe0c0, SIZE7]
      }
    },
    0x21d6: {
      dir: V,
      HW: [[0.954, ARROWS], [1.42, SIZE1]]
    },
    0x21d7: {
      dir: V,
      HW: [[0.954, ARROWS], [1.42, SIZE1]]
    },
    0x21d8: {
      dir: V,
      HW: [[0.954, ARROWS], [1.42, SIZE1]]
    },
    0x21d9: {
      dir: V,
      HW: [[0.954, ARROWS], [1.42, SIZE1]]
    },
    0x21da: {
      dir: H,
      HW: [[0.903, MAIN], [1.349, SIZE1]],
      stretch: {
        left: [0xe0cb, SIZE7],
        rep: [0xe0cc, SIZE7],
        right: [0xe0cd, SIZE7]
      }
    },
    0x21db: {
      dir: H,
      HW: [[0.903, MAIN], [1.349, SIZE1]],
      stretch: {
        left: [0xe0ce, SIZE7],
        rep: [0xe0cf, SIZE7],
        right: [0xe0d0, SIZE7]
      }
    },
    0x21dc: {
      dir: H,
      HW: [[0.885, ARROWS], [1.351, SIZE1]]
    },
    0x21dd: {
      dir: H,
      HW: [[0.885, MAIN], [1.351, SIZE1]]
    },
    0x21e6: {
      dir: H,
      HW: [[0.938, ARROWS], [1.384, SIZE1]],
      stretch: {
        left: [0xe0d1, SIZE7],
        rep: [0xe0d2, SIZE7],
        right: [0xe0d3, SIZE7]
      }
    },
    0x21e7: {
      dir: V,
      HW: [[0.938, ARROWS], [1.384, SIZE1]],
      stretch: {
        bot: [0xe0d7, SIZE7],
        ext: [0xe0d8, SIZE7],
        top: [0xe0d9, SIZE7]
      }
    },
    0x21e8: {
      dir: H,
      HW: [[0.938, ARROWS], [1.384, SIZE1]],
      stretch: {
        left: [0xe0d4, SIZE7],
        rep: [0xe0d5, SIZE7],
        right: [0xe0d6, SIZE7]
      }
    },
    0x21e9: {
      dir: V,
      HW: [[0.938, ARROWS], [1.384, SIZE1]],
      stretch: {
        bot: [0xe0da, SIZE7],
        ext: [0xe0db, SIZE7],
        top: [0xe0dc, SIZE7]
      }
    },
    0x21f3: {
      dir: V,
      HW: [[0.95, ARROWS], [1.396, SIZE1]],
      stretch: {
        bot: [0xe0dd, SIZE7],
        ext: [0xe0de, SIZE7],
        top: [0xe0df, SIZE7]
      }
    },
    0x21f5: {
      dir: V,
      HW: [[0.906, ARROWS], [1.372, SIZE1]],
      stretch: {
        bot: [0xe08c, SIZE7],
        ext: [0xe08d, SIZE7],
        top: [0xe08e, SIZE7]
      }
    },
    0x21f6: {
      dir: H,
      HW: [[0.885, ARROWS], [1.351, SIZE1]],
      stretch: {
        left: [0xe09b, SIZE7],
        rep: [0xe09c, SIZE7],
        right: [0xe09d, SIZE7]
      }
    },
    0x220f: {
      dir: V,
      HW: [[1.0, OPERATORS], [1.4, SIZE1]]
    },
    0x2210: {
      dir: V,
      HW: [[1.0, OPERATORS], [1.4, SIZE1]]
    },
    0x2211: {
      dir: V,
      HW: [[1.0, OPERATORS], [1.4, SIZE1]]
    },
    0x222b: {
      dir: V,
      HW: [[1.111, MAIN], [2.222, SIZE1]]
    },
    0x222c: {
      dir: V,
      HW: [[1.111, OPERATORS], [2.222, SIZE1]]
    },
    0x222d: {
      dir: V,
      HW: [[1.111, OPERATORS], [2.222, SIZE1]]
    },
    0x222e: {
      dir: V,
      HW: [[1.111, OPERATORS], [2.222, SIZE1]]
    },
    0x222f: {
      dir: V,
      HW: [[1.111, OPERATORS], [2.222, SIZE1]]
    },
    0x2230: {
      dir: V,
      HW: [[1.111, OPERATORS], [2.222, SIZE1]]
    },
    0x2231: {
      dir: V,
      HW: [[1.111, OPERATORS], [2.222, SIZE1]]
    },
    0x2232: {
      dir: V,
      HW: [[1.111, OPERATORS], [2.222, SIZE1]]
    },
    0x2233: {
      dir: V,
      HW: [[1.111, OPERATORS], [2.222, SIZE1]]
    },
    0x2261: {
      dir: H,
      HW: [[0.666, MAIN]],
      stretch: {
        left: [0xe12d, SIZE7],
        rep: [0xe12e, SIZE7],
        right: [0xe12f, SIZE7]
      }
    },
    0x2263: {
      dir: H,
      HW: [[0.666, OPERATORS]],
      stretch: {
        left: [0xe130, SIZE7],
        rep: [0xe131, SIZE7],
        right: [0xe132, SIZE7]
      }
    },
    0x22a2: {
      dir: V,
      HW: [[0.684, MAIN], [0.868, SIZE1]]
    },
    0x22a3: {
      dir: V,
      HW: [[0.684, MAIN], [0.868, SIZE1]]
    },
    0x22a4: {
      dir: V,
      HW: [[0.684, MAIN], [0.868, SIZE1]]
    },
    0x22a5: {
      dir: V,
      HW: [[0.684, MAIN], [0.868, SIZE1]]
    },
    0x22c0: {
      dir: V,
      HW: [[1.045, OPERATORS], [1.393, SIZE1]]
    },
    0x22c1: {
      dir: V,
      HW: [[1.045, OPERATORS], [1.393, SIZE1]]
    },
    0x22c2: {
      dir: V,
      HW: [[1.022, OPERATORS], [1.356, SIZE1]]
    },
    0x22c3: {
      dir: V,
      HW: [[1.022, OPERATORS], [1.356, SIZE1]]
    },
    0x23b4: {
      dir: H,
      HW: [
        [0.36, MAIN],
        [0.735, SIZE1],
        [1.11, SIZE2],
        [1.485, SIZE3],
        [1.86, SIZE4],
        [2.235, SIZE5],
        [2.61, SIZE6],
        [2.985, SIZE7]
      ],
      stretch: {
        left: [0xe11b, SIZE7],
        rep: [0xe11c, SIZE7],
        right: [0xe11d, SIZE7]
      }
    },
    0x23b5: {
      dir: H,
      HW: [
        [0.36, MAIN],
        [0.735, SIZE1],
        [1.11, SIZE2],
        [1.485, SIZE3],
        [1.86, SIZE4],
        [2.235, SIZE5],
        [2.61, SIZE6],
        [2.985, SIZE7]
      ],
      stretch: {
        left: [0xe11e, SIZE7],
        rep: [0xe11f, SIZE7],
        right: [0xe120, SIZE7]
      }
    },
    0x23dc: {
      dir: H,
      HW: [
        [0.504, MAIN],
        [1.006, SIZE1],
        [1.508, SIZE2],
        [2.012, SIZE3],
        [2.516, SIZE4],
        [3.02, SIZE5],
        [3.524, SIZE6],
        [4.032, SIZE7]
      ],
      stretch: {
        left: [0xe115, SIZE7],
        rep: [0xe116, SIZE7],
        right: [0xe117, SIZE7]
      }
    },
    0x23dd: {
      dir: H,
      HW: [
        [0.504, MAIN],
        [1.006, SIZE1],
        [1.508, SIZE2],
        [2.012, SIZE3],
        [2.516, SIZE4],
        [3.02, SIZE5],
        [3.524, SIZE6],
        [4.032, SIZE7]
      ],
      stretch: {
        left: [0xe118, SIZE7],
        rep: [0xe119, SIZE7],
        right: [0xe11a, SIZE7]
      }
    },
    0x23e0: {
      dir: H,
      HW: [
        [0.546, MAIN],
        [1.048, SIZE1],
        [1.55, SIZE2],
        [2.056, SIZE3],
        [2.564, SIZE4],
        [3.068, SIZE5],
        [3.574, SIZE6],
        [4.082, SIZE7]
      ],
      stretch: {
        left: [0xe121, SIZE7],
        rep: [0xe122, SIZE7],
        right: [0xe123, SIZE7]
      }
    },
    0x23e1: {
      dir: H,
      HW: [
        [0.546, MAIN],
        [1.048, SIZE1],
        [1.55, SIZE2],
        [2.056, SIZE3],
        [2.564, SIZE4],
        [3.068, SIZE5],
        [3.574, SIZE6],
        [4.082, SIZE7]
      ],
      stretch: {
        left: [0xe124, SIZE7],
        rep: [0xe125, SIZE7],
        right: [0xe126, SIZE7]
      }
    },
    0x27a1: {
      dir: H,
      HW: [[0.865, MISC], [1.311, SIZE1]],
      stretch: {
        left: [0xe0e6, SIZE7],
        rep: [0xe0e7, SIZE7],
        right: [0xe0e8, SIZE7]
      }
    },
    0x27e6: {
      dir: V,
      HW: [
        [1.0, SYMBOLS],
        [1.1, SIZE1],
        [1.2, SIZE2],
        [1.45, SIZE3],
        [1.8, SIZE4],
        [2.1, SIZE5],
        [2.4, SIZE6],
        [3.0, SIZE7]
      ],
      stretch: {
        bot: [0xe107, SIZE7],
        ext: [0xe108, SIZE7],
        top: [0xe109, SIZE7]
      }
    },
    0x27e7: {
      dir: V,
      HW: [
        [1.0, SYMBOLS],
        [1.1, SIZE1],
        [1.2, SIZE2],
        [1.45, SIZE3],
        [1.8, SIZE4],
        [2.1, SIZE5],
        [2.4, SIZE6],
        [3.0, SIZE7]
      ],
      stretch: {
        bot: [0xe10a, SIZE7],
        ext: [0xe10b, SIZE7],
        top: [0xe10c, SIZE7]
      }
    },
    0x27ea: {
      dir: V,
      HW: [
        [1.0, SYMBOLS],
        [1.1, SIZE1],
        [1.2, SIZE2],
        [1.45, SIZE3],
        [1.8, SIZE4],
        [2.1, SIZE5],
        [2.4, SIZE6],
        [3.0, SIZE7]
      ]
    },
    0x27eb: {
      dir: V,
      HW: [
        [1.0, SYMBOLS],
        [1.1, SIZE1],
        [1.2, SIZE2],
        [1.45, SIZE3],
        [1.8, SIZE4],
        [2.1, SIZE5],
        [2.4, SIZE6],
        [3.0, SIZE7]
      ]
    },
    0x2a00: {
      dir: V,
      HW: [[0.986, OPERATORS], [1.304, SIZE1]]
    },
    0x2a01: {
      dir: V,
      HW: [[0.986, OPERATORS], [1.304, SIZE1]]
    },
    0x2a02: {
      dir: V,
      HW: [[0.986, OPERATORS], [1.304, SIZE1]]
    },
    0x2a03: {
      dir: V,
      HW: [[1.022, OPERATORS], [1.356, SIZE1]]
    },
    0x2a04: {
      dir: V,
      HW: [[1.022, OPERATORS], [1.356, SIZE1]]
    },
    0x2a05: {
      dir: V,
      HW: [[1.028, OPERATORS], [1.372, SIZE1]]
    },
    0x2a06: {
      dir: V,
      HW: [[1.028, OPERATORS], [1.372, SIZE1]]
    },
    0x2a09: {
      dir: V,
      HW: [[0.981, OPERATORS], [1.26, SIZE1]]
    },
    0x2a0c: {
      dir: V,
      HW: [[1.111, OPERATORS], [2.222, SIZE1]]
    },
    0x2a11: {
      dir: V,
      HW: [[1.111, OPERATORS], [2.222, SIZE1]]
    },
    0x2b04: {
      dir: H,
      HW: [[0.95, SHAPES], [1.396, SIZE1]],
      stretch: {
        left: [0xe0e0, SIZE7],
        rep: [0xe0e1, SIZE7],
        right: [0xe0e2, SIZE7]
      }
    },
    0x2b05: {
      dir: H,
      HW: [[0.865, SHAPES], [1.311, SIZE1]],
      stretch: {
        left: [0xe0e3, SIZE7],
        rep: [0xe0e4, SIZE7],
        right: [0xe0e5, SIZE7]
      }
    },
    0x2b06: {
      dir: V,
      HW: [[0.865, SHAPES], [1.311, SIZE1]],
      stretch: {
        bot: [0xe0e9, SIZE7],
        ext: [0xe0ea, SIZE7],
        top: [0xe0eb, SIZE7]
      }
    },
    0x2b07: {
      dir: V,
      HW: [[0.865, SHAPES], [1.311, SIZE1]],
      stretch: {
        bot: [0xe0ec, SIZE7],
        ext: [0xe0ed, SIZE7],
        top: [0xe0ee, SIZE7]
      }
    },
    0x2b0c: {
      dir: H,
      HW: [[0.844, SHAPES], [1.29, SIZE1]],
      stretch: {
        left: [0xe0ef, SIZE7],
        rep: [0xe0f0, SIZE7],
        right: [0xe0f1, SIZE7]
      }
    },
    0x2b0d: {
      dir: V,
      HW: [[0.844, SHAPES], [1.29, SIZE1]],
      stretch: {
        bot: [0xe0f2, SIZE7],
        ext: [0xe0f3, SIZE7],
        top: [0xe0f4, SIZE7]
      }
    },
    0x2b31: {
      dir: H,
      HW: [[0.885, SHAPES], [1.351, SIZE1]],
      stretch: {
        left: [0xe09e, SIZE7],
        rep: [0xe09f, SIZE7],
        right: [0xe0a0, SIZE7]
      }
    }
  };

  for (var id in delim) {
    if (delim.hasOwnProperty(id)) {
      DELIMITERS[id] = delim[id];
    }
  }

  MathJax.Ajax.loadComplete(HTMLCSS.fontDir + "/fontdata-extra.js");
})(MathJax.OutputJax["HTML-CSS"]);
