/* -*- Mode: Javascript; indent-tabs-mode:nil; js-indent-level: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */

/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/STIX/fontdata-extra.js
 *
 *  Adds extra stretchy characters to the STIX data.
 *
 *  ---------------------------------------------------------------------
 *
 *  Copyright (c) 2011-2018 The MathJax Consortium
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

  var GENERAL = "STIXGeneral",
    BOLD = "STIXGeneral-bold",
    VARIANT = "STIXVariants",
    NONUNI = "STIXNonUnicode",
    SIZE1 = "STIXSizeOneSym",
    SIZE2 = "STIXSizeTwoSym",
    SIZE3 = "STIXSizeThreeSym",
    SIZE4 = "STIXSizeFourSym",
    SIZE5 = "STIXSizeFiveSym",
    INTD = "STIXIntegralsD";
  var H = "H",
    V = "V";

  var delim = {
    // equal sign
    0x003d: {
      dir: H,
      HW: [[0.685, GENERAL]],
      stretch: { rep: [0x003d, GENERAL] }
    },
    // left two-headed arrow
    0x219e: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: { left: [0x219e, GENERAL], rep: [0x2212, GENERAL] }
    },
    // right two-headed arrow
    0x21a0: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: { right: [0x21a0, GENERAL], rep: [0x2212, GENERAL] }
    },
    // left arrow from bar
    0x21a4: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: {
        left: [0x2190, VARIANT],
        rep: [0x2212, GENERAL],
        right: [0x22a3, BOLD, 0, 0.1, 0.6]
      }
    },
    // up arrow from bar
    0x21a5: {
      dir: V,
      HW: [[0.816, GENERAL]],
      stretch: {
        bot: [0x5f, GENERAL, 0.05, -0.01, 0.8],
        ext: [0x23d0, GENERAL],
        top: [0x2191, GENERAL]
      }
    },
    // right arrow from bar
    0x21a6: {
      dir: H,
      HW: [[1, GENERAL]],
      stretch: {
        left: [0xe0b6, NONUNI],
        rep: [0x2212, GENERAL],
        right: [0x2192, GENERAL]
      }
    },
    // down arrow from bar
    0x21a7: {
      dir: V,
      HW: [[0.816, GENERAL]],
      stretch: {
        top: [0x22a4, BOLD, 0.04, 0, 0.6],
        ext: [0x23d0, GENERAL],
        bot: [0x2193, GENERAL]
      }
    },
    // up arrow with top leftwards
    0x21b0: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: { top: [0x21b0, GENERAL], ext: [0x23d0, GENERAL, 0.152] }
    },
    // up arrow with top right
    0x21b1: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: { top: [0x21b1, GENERAL], ext: [0x23d0, GENERAL, -0.195] }
    },
    // left harpoon with barb up
    0x21bc: {
      dir: H,
      HW: [[0.955, GENERAL]],
      stretch: { left: [0x21bc, GENERAL], rep: [0x2212, GENERAL] }
    },
    // left harpoon with barb down
    0x21bd: {
      dir: H,
      HW: [[0.955, GENERAL]],
      stretch: { left: [0x21bd, GENERAL], rep: [0x2212, GENERAL] }
    },
    // up harpoon with barb right
    0x21be: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: { top: [0x21be, GENERAL], ext: [0x23d0, GENERAL] }
    },
    // up harpoon with barb left
    0x21bf: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: { top: [0x21bf, GENERAL], ext: [0x23d0, GENERAL] }
    },
    // right harpoon with barb up
    0x21c0: {
      dir: H,
      HW: [[0.955, GENERAL]],
      stretch: { right: [0x21c0, GENERAL], rep: [0x2212, GENERAL] }
    },
    // right harpoon with barb down
    0x21c1: {
      dir: H,
      HW: [[0.955, GENERAL]],
      stretch: { right: [0x21c1, GENERAL], rep: [0x2212, GENERAL] }
    },
    // down harpoon with barb right
    0x21c2: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: { bot: [0x21c2, GENERAL], ext: [0x23d0, GENERAL] }
    },
    // down harpoon with barb left
    0x21c3: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: { bot: [0x21c3, GENERAL], ext: [0x23d0, GENERAL] }
    },
    // left triple arrow
    0x21da: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: { left: [0x21da, GENERAL], rep: [0x2261, GENERAL] }
    },
    // right triple arrow
    0x21db: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: { right: [0x21db, GENERAL], rep: [0x2261, GENERAL] }
    },
    // integral
    0x222b: {
      dir: V,
      HW: [[0.607, GENERAL], [0.979, INTD]],
      stretch: {
        top: [0x2320, SIZE1],
        ext: [0x23ae, SIZE1],
        bot: [0x2321, SIZE1]
      }
    },
    // top square bracket
    0x23b4: {
      dir: H,
      HW: [
        [0.926, GENERAL],
        [1.063, SIZE1],
        [1.606, SIZE2],
        [2.147, SIZE3],
        [2.692, SIZE4],
        [3.237, SIZE5]
      ],
      stretch: {
        left: [0x2310, GENERAL],
        rep: [0x2212, GENERAL, 0, 0.12],
        right: [0xac, GENERAL]
      }
    },
    // bottom square bracket
    0x23b5: {
      dir: H,
      HW: [
        [0.926, GENERAL],
        [1.063, SIZE1],
        [1.606, SIZE2],
        [2.147, SIZE3],
        [2.692, SIZE4],
        [3.237, SIZE5]
      ],
      stretch: {
        left: [0x2a3d, GENERAL, 0, 0.12],
        rep: [0x2212, GENERAL, 0, 0, 0, 0.12],
        right: [0x2a3c, GENERAL, 0, 0.12]
      }
    },
    // top paren
    0x23dc: {
      dir: H,
      HW: [
        [0.926, SIZE1],
        [1, GENERAL],
        [1.46, SIZE2],
        [1.886, SIZE3],
        [2.328, SIZE4],
        [3.237, SIZE5]
      ],
      stretch: {
        left: [0xe13b, NONUNI],
        right: [0xe13c, NONUNI],
        rep: [0xe14a, NONUNI]
      }
    },
    // bottom paren
    0x23dd: {
      dir: H,
      HW: [
        [0.926, SIZE1],
        [1, GENERAL],
        [1.46, SIZE2],
        [1.886, SIZE3],
        [2.328, SIZE4],
        [3.237, SIZE5]
      ],
      stretch: {
        left: [0xe13d, NONUNI],
        right: [0xe13e, NONUNI],
        rep: [0xe14b, NONUNI]
      }
    },
    // top tortoise shell
    0x23e0: {
      dir: H,
      HW: [
        [1, GENERAL],
        [1.46, SIZE1],
        [1.886, SIZE2],
        [2.312, SIZE3],
        [2.738, SIZE4],
        [3.164, SIZE5]
      ],
      stretch: {
        left: [0xe10d, NONUNI, -0.1, -0.1],
        rep: [0x2212, GENERAL, 0, 0.05],
        right: [0xe10c, NONUNI, 0, -0.1],
        fullExtenders: true
      }
    },
    // bottom tortoise shell
    0x23e1: {
      dir: H,
      HW: [
        [1, GENERAL],
        [1.46, SIZE1],
        [1.886, SIZE2],
        [2.312, SIZE3],
        [2.738, SIZE4],
        [3.164, SIZE5]
      ],
      stretch: {
        left: [0xe10c, NONUNI, -0.1, 0.1],
        rep: [0x2212, GENERAL, 0, -0.1, 0, 0.1],
        right: [0xe10d, NONUNI, 0, 0.1],
        fullExtenders: true
      }
    },
    // leftwards double arrow from bar
    0x2906: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: {
        left: [0x21d0, GENERAL],
        rep: [0x3d, GENERAL],
        right: [0x2ae4, GENERAL, 0, -0.09]
      }
    },
    // rightwards double arrow from bar
    0x2907: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: {
        left: [0x22a8, GENERAL, 0, -0.09],
        rep: [0x3d, GENERAL],
        right: [0x21d2, GENERAL]
      }
    },
    // left barb up right barb up harpoon
    0x294e: {
      dir: H,
      HW: [],
      stretch: {
        left: [0x21bc, GENERAL],
        rep: [0x2212, GENERAL],
        right: [0x21c0, GENERAL]
      }
    },
    // up barb right down barb right harpoon
    0x294f: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: {
        top: [0x21be, GENERAL],
        ext: [0x23d0, GENERAL],
        bot: [0x21c2, GENERAL]
      }
    },
    // left barb dow right barb down harpoon
    0x2950: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: {
        left: [0x21bd, GENERAL],
        rep: [0x2212, GENERAL],
        right: [0x21c1, GENERAL]
      }
    },
    // up barb left down barb left harpoon
    0x2951: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: {
        top: [0x21bf, GENERAL],
        ext: [0x23d0, GENERAL],
        bot: [0x21c3, GENERAL]
      }
    },
    // leftwards harpoon with barb up from bar
    0x295a: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: {
        left: [0x21bc, GENERAL],
        rep: [0x2212, GENERAL],
        right: [0x22a3, BOLD, 0, 0.1, 0.6]
      }
    },
    // rightwards harpoon with barb up from bar
    0x295b: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: {
        left: [0xe0b6, NONUNI],
        rep: [0x2212, GENERAL],
        right: [0x21c0, GENERAL]
      }
    },
    // up harpoon with barb right from bar
    0x295c: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: {
        bot: [0x5f, GENERAL, 0.05, -0.01, 0.8],
        ext: [0x23d0, GENERAL],
        top: [0x21be, GENERAL]
      }
    },
    // down harpoon with barb right from bar
    0x295d: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: {
        top: [0x22a4, BOLD, 0.04, 0, 0.6],
        ext: [0x23d0, GENERAL],
        bot: [0x21c2, GENERAL]
      }
    },
    // leftwards harpoon with barb down from bar
    0x295e: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: {
        left: [0x21bd, GENERAL],
        rep: [0x2212, GENERAL],
        right: [0x22a3, BOLD, 0, 0.1, 0.6]
      }
    },
    // rightwards harpoon with barb down from bar
    0x295f: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: {
        left: [0xe0b6, NONUNI],
        rep: [0x2212, GENERAL],
        right: [0x21c1, GENERAL]
      }
    },
    // up harpoon with barb left from bar
    0x2960: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: {
        bot: [0x5f, GENERAL, 0.05, -0.01, 0.8],
        ext: [0x23d0, GENERAL],
        top: [0x21bf, GENERAL]
      }
    },
    // down harpoon with barb left from bar
    0x2961: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: {
        top: [0x22a4, BOLD, 0.04, 0, 0.6],
        ext: [0x23d0, GENERAL],
        bot: [0x21c3, GENERAL]
      }
    },

    // caron
    0x02c7: {
      dir: H,
      HW: [
        [0.333, GENERAL],
        [0.56, SIZE1],
        [0.979, SIZE2],
        [1.458, SIZE3],
        [1.886, SIZE4],
        [2.328, SIZE5]
      ]
    },
    // low macron
    0x02cd: {
      dir: H,
      HW: [[0.334, GENERAL]],
      stretch: { rep: [0x2cd, GENERAL] }
    },
    // low tilde
    0x02f7: {
      dir: H,
      HW: [
        [0.558, SIZE1],
        [0.977, SIZE2],
        [1.458, SIZE3],
        [1.886, SIZE4],
        [2.328, SIZE5]
      ]
    },
    // upwards two headed arrow
    0x219f: {
      dir: V,
      HW: [[0.816, GENERAL]],
      stretch: { ext: [0x23d0, GENERAL], top: [0x219f, GENERAL] }
    },
    // downwards two headed arrow
    0x21a1: {
      dir: V,
      HW: [[0.816, GENERAL]],
      stretch: { ext: [0x23d0, GENERAL], bot: [0x21a1, GENERAL] }
    },
    // up down arrow with base
    0x21a8: {
      dir: V,
      HW: [[0.816, GENERAL]],
      stretch: {
        top: [0x2191, GENERAL],
        ext: [0x23d0, GENERAL],
        bot: [0x2913, GENERAL]
      }
    },
    // left hook arrow
    0x21a9: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: {
        left: [0x2190, GENERAL],
        rep: [0x2212, GENERAL],
        right: [0xe0b5, NONUNI]
      }
    },
    // right hook arrow
    0x21aa: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: {
        left: [0xe0b4, NONUNI],
        rep: [0x2212, GENERAL],
        right: [0x2192, GENERAL]
      }
    },
    // down arrow with tip left
    0x21b2: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: { bot: [0x21b2, GENERAL], ext: [0x23d0, GENERAL, 0.152] }
    },
    // down arrow with tip right
    0x21b3: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: { bot: [0x21b3, GENERAL], ext: [0x23d0, GENERAL, -0.195] }
    },
    // right arrow with corner down
    0x21b4: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: { rep: [0x2212, GENERAL, 0, 0.4], right: [0x21b4, GENERAL] }
    },
    // down arrow with corner left
    0x21b5: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: { bot: [0x21b5, GENERAL], ext: [0x23d0, GENERAL, 0.57] }
    },
    // left harpoon over right harpoon
    0x21cb: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: {
        left: [0x296a, GENERAL],
        rep: [0x3d, GENERAL],
        right: [0x296d, GENERAL]
      }
    },
    // right harpoon over left harpoon
    0x21cc: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: {
        left: [0x296b, GENERAL],
        rep: [0x3d, GENERAL],
        right: [0x296c, GENERAL]
      }
    },
    // left dashed arrow
    0x21e0: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: {
        left: [0x21e0, GENERAL],
        rep: [0xe121, NONUNI, 0, 0, 0, 0, 0.1],
        fullExtenders: true
      }
    },
    // up dashed arrow
    0x21e1: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: {
        ext: [0xe12d, NONUNI],
        top: [0x21e1, GENERAL],
        fullExtenders: true
      }
    },
    // right dashed arrow
    0x21e2: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: {
        right: [0x21e2, VARIANT],
        rep: [0xe12e, NONUNI, 0, 0, 0, 0, 0.1],
        fullExtenders: true
      }
    },
    // down dashed arrow
    0x21e3: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: {
        ext: [0xe12c, NONUNI],
        bot: [0x21e3, GENERAL],
        fullExtenders: true
      }
    },
    // left arrow to bar
    0x21e4: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: { left: [0x21e4, GENERAL], rep: [0x2212, GENERAL] }
    },
    // right arrow to bar
    0x21e5: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: { right: [0x21e5, GENERAL], rep: [0x2212, GENERAL] }
    },
    // left open-headed arrow
    0x21fd: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: { left: [0x21fd, GENERAL], rep: [0x2212, GENERAL] }
    },
    // right open-headed arrow
    0x21fe: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: { right: [0x21fe, GENERAL], rep: [0x2212, GENERAL] }
    },
    // left right open-headed arrow
    0x21ff: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: {
        left: [0x21fd, GENERAL],
        rep: [0x2212, GENERAL],
        right: [0x21fe, GENERAL]
      }
    },
    // left white square bracket
    0x27e6: {
      dir: V,
      HW: [
        [0.93, GENERAL],
        [1.23, SIZE1],
        [1.845, SIZE2],
        [2.46, SIZE3],
        [3.075, SIZE4]
      ],
      stretch: {
        top: [0x2553, GENERAL],
        ext: [0x2551, GENERAL],
        bot: [0x2559, GENERAL]
      }
    },
    // right white square bracket
    0x27e7: {
      dir: V,
      HW: [
        [0.93, GENERAL],
        [1.23, SIZE1],
        [1.845, SIZE2],
        [2.46, SIZE3],
        [3.075, SIZE4]
      ],
      stretch: {
        top: [0x2556, GENERAL],
        ext: [0x2551, GENERAL],
        bot: [0x255c, GENERAL]
      }
    },
    // left double angle bracket
    0x27ea: {
      dir: V,
      HW: [
        [0.931, GENERAL],
        [1.23, SIZE1],
        [1.845, SIZE2],
        [2.461, SIZE3],
        [3.075, SIZE4]
      ]
    },
    // right double angle bracket
    0x27eb: {
      dir: V,
      HW: [
        [0.931, GENERAL],
        [1.23, SIZE1],
        [1.845, SIZE2],
        [2.461, SIZE3],
        [3.075, SIZE4]
      ]
    },
    // up triple arrow
    0x290a: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: { top: [0x290a, GENERAL], ext: [0xe135, NONUNI] }
    },
    // down triple arrow
    0x290b: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: { bot: [0x290b, GENERAL], ext: [0xe135, NONUNI] }
    },
    // up arrow to bar
    0x2912: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: { top: [0x2912, GENERAL], ext: [0x23d0, GENERAL] }
    },
    // down arrow to bar
    0x2913: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: { bot: [0x2913, GENERAL], ext: [0x23d0, GENERAL] }
    },
    // left harpoon with barb up to bar
    0x2952: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: { left: [0x2952, GENERAL], rep: [0x2212, GENERAL] }
    },
    // right harpoon with barb up to bar
    0x2953: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: { right: [0x2953, GENERAL], rep: [0x2212, GENERAL] }
    },
    // up harpoon with barb right to bar
    0x2954: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: { top: [0x2954, GENERAL], ext: [0x23d0, GENERAL] }
    },
    // down harpoon with barb right to bar
    0x2955: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: { bot: [0x2955, GENERAL], ext: [0x23d0, GENERAL] }
    },
    // left harpoon with barb down to bar
    0x2956: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: { left: [0x2956, GENERAL], rep: [0x2212, GENERAL] }
    },
    // right harpoon with barb down to bar
    0x2957: {
      dir: H,
      HW: [[0.926, GENERAL]],
      stretch: { right: [0x2957, GENERAL], rep: [0x2212, GENERAL] }
    },
    // up harpoon with barb left to bar
    0x2958: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: { top: [0x2958, GENERAL], ext: [0x23d0, GENERAL] }
    },
    // down harpoon with barb left to bar
    0x2959: {
      dir: V,
      HW: [[0.818, GENERAL]],
      stretch: { bot: [0x2959, GENERAL], ext: [0x23d0, GENERAL] }
    },
    // triple vertical bar
    0x2980: {
      dir: V,
      HW: [[0.874, GENERAL]],
      stretch: { ext: [0x2980, GENERAL] }
    },
    // left black tortoise shell
    0x2997: {
      dir: V,
      HW: [[0.932, GENERAL]],
      stretch: {
        top: [0xe10d, NONUNI, 0.1, 0.05],
        ext: [0x23d0, GENERAL, -0.1],
        bot: [0xe10c, NONUNI, 0.1]
      }
    },
    // right black tortoise shell
    0x2998: {
      dir: V,
      HW: [[0.932, GENERAL]],
      stretch: {
        top: [0xe10c, NONUNI, -0.1, 0.05],
        ext: [0x23d0, GENERAL],
        bot: [0xe10d, NONUNI, -0.1]
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
