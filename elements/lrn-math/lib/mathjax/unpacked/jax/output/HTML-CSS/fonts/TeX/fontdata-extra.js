/* -*- Mode: Javascript; indent-tabs-mode:nil; js-indent-level: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */

/*************************************************************
 *
 *  MathJax/jax/output/HTML-CSS/fonts/TeX/fontdata-extra.js
 *
 *  Adds extra stretchy characters to the TeX font data.
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

  var MAIN = "MathJax_Main",
    BOLD = "MathJax_Main-bold",
    AMS = "MathJax_AMS",
    SIZE1 = "MathJax_Size1",
    SIZE4 = "MathJax_Size4";
  var H = "H",
    V = "V";
  var ARROWREP = [0x2212, MAIN, 0, 0, 0, -0.3, -0.3]; // remove extra height/depth added below
  var DARROWREP = [0x3d, MAIN, 0, 0, 0, 0, 0.1]; // add depth for arrow extender

  var delim = {
    // equal sign
    0x003d: {
      dir: H,
      HW: [[0.767, MAIN]],
      stretch: { rep: [0x003d, MAIN] }
    },
    // left two-headed arrow
    0x219e: {
      dir: H,
      HW: [[1, AMS]],
      stretch: { left: [0x219e, AMS], rep: ARROWREP }
    },
    // right two-headed arrow
    0x21a0: {
      dir: H,
      HW: [[1, AMS]],
      stretch: { right: [0x21a0, AMS], rep: ARROWREP }
    },
    // left arrow from bar
    0x21a4: {
      dir: H,
      HW: [],
      stretch: {
        min: 1,
        left: [0x2190, MAIN],
        rep: ARROWREP,
        right: [0x2223, SIZE1, 0, -0.05, 0.9]
      }
    },
    // up arrow from bar
    0x21a5: {
      dir: V,
      HW: [],
      stretch: {
        min: 0.6,
        bot: [0x22a5, BOLD, 0, 0, 0.75],
        ext: [0x23d0, SIZE1],
        top: [0x2191, SIZE1]
      }
    },
    // right arrow from bar
    0x21a6: {
      dir: H,
      HW: [[1, MAIN]],
      stretch: {
        left: [0x2223, SIZE1, -0.09, -0.05, 0.9],
        rep: ARROWREP,
        right: [0x2192, MAIN]
      }
    },
    // down arrow from bar
    0x21a7: {
      dir: V,
      HW: [],
      stretch: {
        min: 0.6,
        top: [0x22a4, BOLD, 0, 0, 0.75],
        ext: [0x23d0, SIZE1],
        bot: [0x2193, SIZE1]
      }
    },
    // up arrow with top leftwards
    0x21b0: {
      dir: V,
      HW: [[0.722, AMS]],
      stretch: { top: [0x21b0, AMS], ext: [0x23d0, SIZE1, 0.097] }
    },
    // up arrow with top right
    0x21b1: {
      dir: V,
      HW: [[0.722, AMS]],
      stretch: { top: [0x21b1, AMS, 0.27], ext: [0x23d0, SIZE1] }
    },
    // left harpoon with barb up
    0x21bc: {
      dir: H,
      HW: [[1, MAIN]],
      stretch: { left: [0x21bc, MAIN], rep: ARROWREP }
    },
    // left harpoon with barb down
    0x21bd: {
      dir: H,
      HW: [[1, MAIN]],
      stretch: { left: [0x21bd, MAIN], rep: ARROWREP }
    },
    // up harpoon with barb right
    0x21be: {
      dir: V,
      HW: [[0.888, AMS]],
      stretch: { top: [0x21be, AMS, 0.12, 0, 1.1], ext: [0x23d0, SIZE1] }
    },
    // up harpoon with barb left
    0x21bf: {
      dir: V,
      HW: [[0.888, AMS]],
      stretch: { top: [0x21bf, AMS, 0.12, 0, 1.1], ext: [0x23d0, SIZE1] }
    },
    // right harpoon with barb up
    0x21c0: {
      dir: H,
      HW: [[1, MAIN]],
      stretch: { right: [0x21c0, MAIN], rep: ARROWREP }
    },
    // right harpoon with barb down
    0x21c1: {
      dir: H,
      HW: [[1, MAIN]],
      stretch: { right: [0x21c1, MAIN], rep: ARROWREP }
    },
    // down harpoon with barb right
    0x21c2: {
      dir: V,
      HW: [[0.888, AMS]],
      stretch: { bot: [0x21c2, AMS, 0.12, 0, 1.1], ext: [0x23d0, SIZE1] }
    },
    // down harpoon with barb left
    0x21c3: {
      dir: V,
      HW: [[0.888, AMS]],
      stretch: { bot: [0x21c3, AMS, 0.12, 0, 1.1], ext: [0x23d0, SIZE1] }
    },
    // left triple arrow
    0x21da: {
      dir: H,
      HW: [[1, AMS]],
      stretch: { left: [0x21da, AMS], rep: [0x2261, MAIN] }
    },
    // right triple arrow
    0x21db: {
      dir: H,
      HW: [[1, AMS]],
      stretch: { right: [0x21db, AMS], rep: [0x2261, MAIN] }
    },
    // top square bracket
    0x23b4: {
      dir: H,
      HW: [],
      stretch: {
        min: 0.5,
        left: [0x250c, AMS, 0, -0.1],
        rep: [0x2212, MAIN, 0, 0.35],
        right: [0x2510, AMS, 0, -0.1]
      }
    },
    // bottom square bracket
    0x23b5: {
      dir: H,
      HW: [],
      stretch: {
        min: 0.5,
        left: [0x2514, AMS, 0, 0.26],
        rep: [0x2212, MAIN, 0, 0, 0, 0.25],
        right: [0x2518, AMS, 0, 0.26]
      }
    },
    // top paren
    0x23dc: {
      dir: H,
      HW: [[0.778, AMS, 0, 0x2322], [1, MAIN, 0, 0x2322]],
      stretch: {
        left: [0xe150, SIZE4],
        rep: [0xe154, SIZE4],
        right: [0xe151, SIZE4]
      }
    },
    // bottom paren
    0x23dd: {
      dir: H,
      HW: [[0.778, AMS, 0, 0x2323], [1, MAIN, 0, 0x2323]],
      stretch: {
        left: [0xe152, SIZE4],
        rep: [0xe154, SIZE4],
        right: [0xe153, SIZE4]
      }
    },
    // top tortoise shell
    0x23e0: {
      dir: H,
      HW: [],
      stretch: {
        min: 1.25,
        left: [0x2ca, MAIN, -0.1],
        rep: [0x2c9, MAIN, 0, 0.13],
        right: [0x2cb, MAIN],
        fullExtenders: true
      }
    },
    // bottom tortoise shell
    0x23e1: {
      dir: H,
      HW: [],
      stretch: {
        min: 1.5,
        left: [0x2cb, MAIN, -0.1, 0.1],
        rep: [0x2c9, MAIN],
        right: [0x2ca, MAIN, -0.1, 0.1],
        fullExtenders: true
      }
    },
    // leftwards double arrow from bar
    0x2906: {
      dir: H,
      HW: [],
      stretch: {
        min: 1,
        left: [0x21d0, MAIN],
        rep: DARROWREP,
        right: [0x2223, SIZE1, 0, -0.1]
      }
    },
    // rightwards double arrow from bar
    0x2907: {
      dir: H,
      HW: [],
      stretch: {
        min: 0.7,
        left: [0x22a8, AMS, 0, -0.12],
        rep: DARROWREP,
        right: [0x21d2, MAIN]
      }
    },
    // left barb up right barb up harpoon
    0x294e: {
      dir: H,
      HW: [],
      stretch: {
        min: 0.5,
        left: [0x21bc, MAIN],
        rep: ARROWREP,
        right: [0x21c0, MAIN]
      }
    },
    // up barb right down barb right harpoon
    0x294f: {
      dir: V,
      HW: [],
      stretch: {
        min: 0.5,
        top: [0x21be, AMS, 0.12, 0, 1.1],
        ext: [0x23d0, SIZE1],
        bot: [0x21c2, AMS, 0.12, 0, 1.1]
      }
    },
    // left barb dow right barb down harpoon
    0x2950: {
      dir: H,
      HW: [],
      stretch: {
        min: 0.5,
        left: [0x21bd, MAIN],
        rep: ARROWREP,
        right: [0x21c1, MAIN]
      }
    },
    // up barb left down barb left harpoon
    0x2951: {
      dir: V,
      HW: [],
      stretch: {
        min: 0.5,
        top: [0x21bf, AMS, 0.12, 0, 1.1],
        ext: [0x23d0, SIZE1],
        bot: [0x21c3, AMS, 0.12, 0, 1.1]
      }
    },
    // leftwards harpoon with barb up from bar
    0x295a: {
      dir: H,
      HW: [],
      stretch: {
        min: 1,
        left: [0x21bc, MAIN],
        rep: ARROWREP,
        right: [0x2223, SIZE1, 0, -0.05, 0.9]
      }
    },
    // rightwards harpoon with barb up from bar
    0x295b: {
      dir: H,
      HW: [],
      stretch: {
        min: 1,
        left: [0x2223, SIZE1, -0.05, -0.05, 0.9],
        rep: ARROWREP,
        right: [0x21c0, MAIN]
      }
    },
    // up harpoon with barb right from bar
    0x295c: {
      dir: V,
      HW: [],
      stretch: {
        min: 0.7,
        bot: [0x22a5, BOLD, 0, 0, 0.75],
        ext: [0x23d0, SIZE1],
        top: [0x21be, AMS, 0.12, 0, 1.1]
      }
    },
    // down harpoon with barb right from bar
    0x295d: {
      dir: V,
      HW: [],
      stretch: {
        min: 0.7,
        top: [0x22a4, BOLD, 0, 0, 0.75],
        ext: [0x23d0, SIZE1],
        bot: [0x21c2, AMS, 0.12, 0, 1.1]
      }
    },
    // leftwards harpoon with barb down from bar
    0x295e: {
      dir: H,
      HW: [],
      stretch: {
        min: 1,
        left: [0x21bd, MAIN],
        rep: ARROWREP,
        right: [0x2223, SIZE1, 0, -0.05, 0.9]
      }
    },
    // rightwards harpoon with barb down from bar
    0x295f: {
      dir: H,
      HW: [],
      stretch: {
        min: 1,
        left: [0x2223, SIZE1, -0.05, -0.05, 0.9],
        rep: ARROWREP,
        right: [0x21c1, MAIN]
      }
    },
    // up harpoon with barb left from bar
    0x2960: {
      dir: V,
      HW: [],
      stretch: {
        min: 0.7,
        bot: [0x22a5, BOLD, 0, 0, 0.75],
        ext: [0x23d0, SIZE1],
        top: [0x21bf, AMS, 0.12, 0, 1.1]
      }
    },
    // down harpoon with barb left from bar
    0x2961: {
      dir: V,
      HW: [],
      stretch: {
        min: 0.7,
        top: [0x22a4, BOLD, 0, 0, 0.75],
        ext: [0x23d0, SIZE1],
        bot: [0x21c3, AMS, 0.12, 0, 1.1]
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
