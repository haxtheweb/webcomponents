/*************************************************************
 *
 *  MathJax/jax/output/SVG/fonts/Asana-Math/fontdata-extra.js
 *  
 *  Adds extra stretchy characters to the Asana-Math fonts

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

  var delim = {
    0x306: {
      dir: H,
      HW: [[282, MAIN], [384, SIZE1], [542, SIZE2], [922, SIZE3], [1762, SIZE4]]
    },
    0x333: {
      dir: H,
      HW: [[433, MARKS], [511, SIZE1], [675, SIZE2], [1127, SIZE3]],
      stretch: { rep: [0xe003, SIZE6], right: [0xe003, SIZE6] }
    },
    0x33f: {
      dir: H,
      HW: [[433, MARKS], [511, SIZE1], [675, SIZE2], [1127, SIZE3]],
      stretch: { rep: [0xe004, SIZE6], right: [0xe004, SIZE6] }
    },
    0x2045: {
      dir: V,
      HW: [[910, MARKS], [1344, SIZE1], [1862, SIZE2], [2328, SIZE3]],
      stretch: {
        bot: [0xe006, SIZE6],
        ext: [0xe007, SIZE6],
        mid: [0xe008, SIZE6],
        top: [0xe009, SIZE6]
      }
    },
    0x2046: {
      dir: V,
      HW: [[910, MARKS], [1344, SIZE1], [1862, SIZE2], [2328, SIZE3]],
      stretch: {
        bot: [0xe00a, SIZE6],
        ext: [0xe00b, SIZE6],
        mid: [0xe00c, SIZE6],
        top: [0xe00d, SIZE6]
      }
    },
    0x20d0: {
      dir: H,
      HW: [[558, MARKS]],
      stretch: { left: [0x20d0, MARKS], rep: [0xe00e, SIZE6] }
    },
    0x20d1: {
      dir: H,
      HW: [[558, MARKS]],
      stretch: { rep: [0xe00e, SIZE6], right: [0x20d1, MARKS] }
    },
    0x20d6: {
      dir: H,
      HW: [
        [558, MARKS],
        [807, SIZE1],
        [1127, SIZE2],
        [1878, SIZE3],
        [3579, SIZE4]
      ],
      stretch: { left: [0x20d6, MARKS], rep: [0xe00e, SIZE6] }
    },
    0x20d7: {
      dir: H,
      HW: [
        [558, MAIN],
        [807, SIZE1],
        [1127, SIZE2],
        [1878, SIZE3],
        [3579, SIZE4]
      ],
      stretch: { rep: [0xe00e, SIZE6], right: [0x20d7, MAIN] }
    },
    0x20e1: {
      dir: H,
      HW: [[557, MARKS]],
      stretch: {
        left: [0x20d6, MARKS],
        rep: [0xe00e, SIZE6],
        right: [0x20d7, MAIN]
      }
    },
    0x20e9: {
      dir: H,
      HW: [[630, MARKS]],
      stretch: {
        left: [0xe00f, SIZE6],
        rep: [0xe010, SIZE6],
        right: [0xe011, SIZE6]
      }
    },
    0x20ee: {
      dir: H,
      HW: [[557, MARKS]],
      stretch: { left: [0x20ee, MARKS], rep: [0xe012, SIZE6] }
    },
    0x20ef: {
      dir: H,
      HW: [[557, MARKS]],
      stretch: { rep: [0xe012, SIZE6], right: [0x20ef, MARKS] }
    },
    0x21a9: {
      dir: H,
      HW: [[884, MAIN]],
      stretch: {
        left: [0xe013, SIZE6],
        rep: [0x23af, SYMBOLS],
        right: [0xe01a, SIZE6]
      }
    },
    0x21aa: {
      dir: H,
      HW: [[884, MAIN]],
      stretch: {
        left: [0xe01b, SIZE6],
        rep: [0x23af, SYMBOLS],
        right: [0xe017, SIZE6]
      }
    },
    0x2210: {
      dir: V,
      HW: [[937, OPERATORS], [1349, SIZE1], [1942, SIZE2], [2797, SIZE3]]
    },
    0x2211: {
      dir: V,
      HW: [[930, OPERATORS], [1339, SIZE1], [1928, SIZE2], [2776, SIZE3]]
    },
    0x2229: {
      dir: V,
      HW: [[603, MAIN], [1559, SIZE1], [2245, SIZE2], [2588, SIZE3]]
    },
    0x222b: {
      dir: V,
      HW: [[1327, MAIN], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]],
      stretch: {
        bot: [0x2321, SYMBOLS],
        ext: [0x23ae, SYMBOLS],
        top: [0x2320, SYMBOLS]
      }
    },
    0x222c: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x222d: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x222e: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x222f: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x2230: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x2231: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x2232: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x2233: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x22c0: {
      dir: V,
      HW: [[939, OPERATORS], [1559, SIZE1], [2588, SIZE2]]
    },
    0x22c1: {
      dir: V,
      HW: [[939, OPERATORS], [1559, SIZE1], [2588, SIZE2]]
    },
    0x22c2: {
      dir: V,
      HW: [[939, OPERATORS], [1559, SIZE1], [2588, SIZE2]]
    },
    0x22c3: {
      dir: V,
      HW: [[939, OPERATORS], [1559, SIZE1], [2245, SIZE2], [2588, SIZE3]]
    },
    0x23b4: {
      dir: H,
      HW: [[602, MAIN], [978, SIZE1], [1353, SIZE2], [1690, SIZE3]],
      stretch: {
        left: [0xe00f, SIZE6],
        rep: [0xe010, SIZE6],
        right: [0xe011, SIZE6]
      }
    },
    0x23b5: {
      dir: H,
      HW: [[602, MAIN], [978, SIZE1], [1353, SIZE2], [1690, SIZE3]],
      stretch: {
        left: [0xe023, SIZE6],
        rep: [0xe024, SIZE6],
        right: [0xe025, SIZE6]
      }
    },
    0x23dc: {
      dir: H,
      HW: [[942, MAIN], [973, SIZE1], [1349, SIZE2], [1686, SIZE3]],
      stretch: {
        left: [0xe026, SIZE6],
        rep: [0xe027, SIZE6],
        right: [0xe028, SIZE6]
      }
    },
    0x23dd: {
      dir: H,
      HW: [[942, MAIN], [973, SIZE1], [1349, SIZE2], [1686, SIZE3]],
      stretch: {
        left: [0xe029, SIZE6],
        rep: [0xe02a, SIZE6],
        right: [0xe02b, SIZE6]
      }
    },
    0x23e0: {
      dir: H,
      HW: [[900, MAIN], [1360, SIZE1], [2056, SIZE2], [3108, SIZE3]]
    },
    0x23e1: {
      dir: H,
      HW: [[900, MAIN], [1360, SIZE1], [2056, SIZE2], [3108, SIZE3]]
    },
    0x27e6: {
      dir: V,
      HW: [
        [910, SYMBOLS],
        [1025, SIZE1],
        [1535, SIZE2],
        [2045, SIZE3],
        [2556, SIZE4]
      ]
    },
    0x27e7: {
      dir: V,
      HW: [
        [910, SYMBOLS],
        [1025, SIZE1],
        [1535, SIZE2],
        [2045, SIZE3],
        [2556, SIZE4]
      ]
    },
    0x27ea: {
      dir: V,
      HW: [[885, SYMBOLS], [1020, SIZE1], [2041, SIZE2], [2552, SIZE3]]
    },
    0x27eb: {
      dir: V,
      HW: [[885, SYMBOLS], [1020, SIZE1], [2041, SIZE2], [2552, SIZE3]]
    },
    0x29fc: {
      dir: V,
      HW: [[953, SYMBOLS], [1372, SIZE1], [1893, SIZE2], [2366, SIZE3]]
    },
    0x29fd: {
      dir: V,
      HW: [[953, SYMBOLS], [1372, SIZE1], [1893, SIZE2], [2366, SIZE3]]
    },
    0x2a00: {
      dir: V,
      HW: [[1146, OPERATORS], [1650, SIZE1], [2376, SIZE2]]
    },
    0x2a01: {
      dir: V,
      HW: [[1149, OPERATORS], [1650, SIZE1], [2376, SIZE2]]
    },
    0x2a02: {
      dir: V,
      HW: [[1149, OPERATORS], [1650, SIZE1], [2376, SIZE2]]
    },
    0x2a03: {
      dir: V,
      HW: [[939, OPERATORS], [1559, SIZE1], [2588, SIZE2]]
    },
    0x2a04: {
      dir: V,
      HW: [[939, OPERATORS], [1559, SIZE1], [2588, SIZE2]]
    },
    0x2a05: {
      dir: V,
      HW: [[926, OPERATORS], [1537, SIZE1], [2552, SIZE2]]
    },
    0x2a06: {
      dir: V,
      HW: [[926, OPERATORS], [1537, SIZE1], [2552, SIZE2]]
    },
    0x2a07: {
      dir: V,
      HW: [[939, OPERATORS], [1559, SIZE1], [2588, SIZE2]]
    },
    0x2a08: {
      dir: V,
      HW: [[939, OPERATORS], [1559, SIZE1], [2588, SIZE2]]
    },
    0x2a09: {
      dir: V,
      HW: [[926, OPERATORS], [1333, SIZE1], [1920, SIZE2]]
    },
    0x2a0c: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x2a0d: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x2a0e: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x2a0f: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x2a10: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x2a11: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x2a12: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x2a13: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x2a14: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x2a15: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x2a16: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x2a17: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x2a18: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x2a19: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x2a1a: {
      dir: V,
      HW: [[1327, OPERATORS], [1964, SIZE1], [2711, SIZE2], [3470, SIZE3]]
    },
    0x2a1b: {
      dir: V,
      HW: [[1436, OPERATORS], [2125, SIZE1], [2933, SIZE2], [3754, SIZE3]]
    },
    0x2a1c: {
      dir: V,
      HW: [[1436, OPERATORS], [2125, SIZE1], [2933, SIZE2], [3754, SIZE3]]
    }
  };

  for (var id in delim) {
    if (delim.hasOwnProperty(id)) {
      DELIMITERS[id] = delim[id];
    }
  }

  MathJax.Ajax.loadComplete(SVG.fontDir + "/fontdata-extra.js");
})(MathJax.OutputJax["SVG"]);
