/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html } from "@polymer/polymer/polymer-element.js";
/**
 * `simple-colors-shared-styles-polymer`
 * a shared set of styles for Polymer @haxtheweb
 *
 * @pseudoElement
 * @polymer
 * @element simple-colors-shared-styles-polymer
 */

const StyleElement = globalThis.document.createElement("dom-module");

// styles
const css = html`
  <style>
    :host([dark]),
    :host [dark] {
      --simple-colors-default-theme-accent-1: #000000;
      --simple-colors-default-theme-accent-2: #111111;
      --simple-colors-default-theme-accent-3: #222222;
      --simple-colors-default-theme-accent-4: #333333;
      --simple-colors-default-theme-accent-5: #444444;
      --simple-colors-default-theme-accent-6: #666666;
      --simple-colors-default-theme-accent-7: #999999;
      --simple-colors-default-theme-accent-8: #bbbbbb;
      --simple-colors-default-theme-accent-9: #cccccc;
      --simple-colors-default-theme-accent-10: #dddddd;
      --simple-colors-default-theme-accent-11: #eeeeee;
      --simple-colors-default-theme-accent-12: #ffffff;

      --simple-colors-default-theme-grey-1: #000000;
      --simple-colors-default-theme-grey-2: #111111;
      --simple-colors-default-theme-grey-3: #222222;
      --simple-colors-default-theme-grey-4: #333333;
      --simple-colors-default-theme-grey-5: #444444;
      --simple-colors-default-theme-grey-6: #666666;
      --simple-colors-default-theme-grey-7: #999999;
      --simple-colors-default-theme-grey-8: #bbbbbb;
      --simple-colors-default-theme-grey-9: #cccccc;
      --simple-colors-default-theme-grey-10: #dddddd;
      --simple-colors-default-theme-grey-11: #eeeeee;
      --simple-colors-default-theme-grey-12: #ffffff;

      --simple-colors-default-theme-red-1: #3f0000;
      --simple-colors-default-theme-red-2: #520000;
      --simple-colors-default-theme-red-3: #670000;
      --simple-colors-default-theme-red-4: #850000;
      --simple-colors-default-theme-red-5: #ac0000;
      --simple-colors-default-theme-red-6: #ee0000;
      --simple-colors-default-theme-red-7: #ff2222;
      --simple-colors-default-theme-red-8: #fd5151;
      --simple-colors-default-theme-red-9: #ff7474;
      --simple-colors-default-theme-red-10: #ff8f8f;
      --simple-colors-default-theme-red-11: #ffaeae;
      --simple-colors-default-theme-red-12: #ffdddd;

      --simple-colors-default-theme-pink-1: #440019;
      --simple-colors-default-theme-pink-2: #5a0020;
      --simple-colors-default-theme-pink-3: #78002b;
      --simple-colors-default-theme-pink-4: #980036;
      --simple-colors-default-theme-pink-5: #b80042;
      --simple-colors-default-theme-pink-6: #da004e;
      --simple-colors-default-theme-pink-7: #ff3996;
      --simple-colors-default-theme-pink-8: #fd60aa;
      --simple-colors-default-theme-pink-9: #ff73b5;
      --simple-colors-default-theme-pink-10: #ff87c0;
      --simple-colors-default-theme-pink-11: #ffa5cf;
      --simple-colors-default-theme-pink-12: #ffe6f1;

      --simple-colors-default-theme-purple-1: #200025;
      --simple-colors-default-theme-purple-2: #33003a;
      --simple-colors-default-theme-purple-3: #490052;
      --simple-colors-default-theme-purple-4: #6c0079;
      --simple-colors-default-theme-purple-5: #8a009b;
      --simple-colors-default-theme-purple-6: #a500ba;
      --simple-colors-default-theme-purple-7: #e200ff;
      --simple-colors-default-theme-purple-8: #ed61ff;
      --simple-colors-default-theme-purple-9: #f07cff;
      --simple-colors-default-theme-purple-10: #f394ff;
      --simple-colors-default-theme-purple-11: #f4affd;
      --simple-colors-default-theme-purple-12: #fce6ff;

      --simple-colors-default-theme-deep-purple-1: #1d0033;
      --simple-colors-default-theme-deep-purple-2: #2a0049;
      --simple-colors-default-theme-deep-purple-3: #3a0063;
      --simple-colors-default-theme-deep-purple-4: #4c0081;
      --simple-colors-default-theme-deep-purple-5: #5d009f;
      --simple-colors-default-theme-deep-purple-6: #7e00d8;
      --simple-colors-default-theme-deep-purple-7: #a931ff;
      --simple-colors-default-theme-deep-purple-8: #b44aff;
      --simple-colors-default-theme-deep-purple-9: #bb63f9;
      --simple-colors-default-theme-deep-purple-10: #c97eff;
      --simple-colors-default-theme-deep-purple-11: #ddacff;
      --simple-colors-default-theme-deep-purple-12: #f3e4ff;

      --simple-colors-default-theme-indigo-1: #0a0030;
      --simple-colors-default-theme-indigo-2: #100049;
      --simple-colors-default-theme-indigo-3: #160063;
      --simple-colors-default-theme-indigo-4: #20008c;
      --simple-colors-default-theme-indigo-5: #2801b0;
      --simple-colors-default-theme-indigo-6: #3a00ff;
      --simple-colors-default-theme-indigo-7: #835fff;
      --simple-colors-default-theme-indigo-8: #9373ff;
      --simple-colors-default-theme-indigo-9: #9e82ff;
      --simple-colors-default-theme-indigo-10: #af97ff;
      --simple-colors-default-theme-indigo-11: #c3b2ff;
      --simple-colors-default-theme-indigo-12: #e5ddff;

      --simple-colors-default-theme-blue-1: #001333;
      --simple-colors-default-theme-blue-2: #001947;
      --simple-colors-default-theme-blue-3: #002569;
      --simple-colors-default-theme-blue-4: #003494;
      --simple-colors-default-theme-blue-5: #0041bb;
      --simple-colors-default-theme-blue-6: #0059ff;
      --simple-colors-default-theme-blue-7: #4083ff;
      --simple-colors-default-theme-blue-8: #5892fd;
      --simple-colors-default-theme-blue-9: #74a5ff;
      --simple-colors-default-theme-blue-10: #95baff;
      --simple-colors-default-theme-blue-11: #acc9ff;
      --simple-colors-default-theme-blue-12: #e2ecff;

      --simple-colors-default-theme-light-blue-1: #001b36;
      --simple-colors-default-theme-light-blue-2: #002850;
      --simple-colors-default-theme-light-blue-3: #003f7d;
      --simple-colors-default-theme-light-blue-4: #0055a8;
      --simple-colors-default-theme-light-blue-5: #0066ca;
      --simple-colors-default-theme-light-blue-6: #007ffc;
      --simple-colors-default-theme-light-blue-7: #41a1ff;
      --simple-colors-default-theme-light-blue-8: #58adff;
      --simple-colors-default-theme-light-blue-9: #65b3ff;
      --simple-colors-default-theme-light-blue-10: #92c9ff;
      --simple-colors-default-theme-light-blue-11: #a1d1ff;
      --simple-colors-default-theme-light-blue-12: #cde8ff;

      --simple-colors-default-theme-cyan-1: #001a20;
      --simple-colors-default-theme-cyan-2: #002c38;
      --simple-colors-default-theme-cyan-3: #003f50;
      --simple-colors-default-theme-cyan-4: #005970;
      --simple-colors-default-theme-cyan-5: #007999;
      --simple-colors-default-theme-cyan-6: #009dc7;
      --simple-colors-default-theme-cyan-7: #00c9ff;
      --simple-colors-default-theme-cyan-8: #1ccfff;
      --simple-colors-default-theme-cyan-9: #33d4ff;
      --simple-colors-default-theme-cyan-10: #77e2ff;
      --simple-colors-default-theme-cyan-11: #9beaff;
      --simple-colors-default-theme-cyan-12: #ddf8ff;

      --simple-colors-default-theme-teal-1: #001b14;
      --simple-colors-default-theme-teal-2: #002a20;
      --simple-colors-default-theme-teal-3: #003829;
      --simple-colors-default-theme-teal-4: #004e3a;
      --simple-colors-default-theme-teal-5: #007658;
      --simple-colors-default-theme-teal-6: #009d75;
      --simple-colors-default-theme-teal-7: #00ff9c;
      --simple-colors-default-theme-teal-8: #29ffac;
      --simple-colors-default-theme-teal-9: #56ffbd;
      --simple-colors-default-theme-teal-10: #79ffcb;
      --simple-colors-default-theme-teal-11: #98ffd7;
      --simple-colors-default-theme-teal-12: #d9fff0;

      --simple-colors-default-theme-green-1: #001d0c;
      --simple-colors-default-theme-green-2: #002a11;
      --simple-colors-default-theme-green-3: #003d18;
      --simple-colors-default-theme-green-4: #005a23;
      --simple-colors-default-theme-green-5: #00762e;
      --simple-colors-default-theme-green-6: #008c37;
      --simple-colors-default-theme-green-7: #00f961;
      --simple-colors-default-theme-green-8: #24ff70;
      --simple-colors-default-theme-green-9: #49ff88;
      --simple-colors-default-theme-green-10: #79ffa7;
      --simple-colors-default-theme-green-11: #acffc9;
      --simple-colors-default-theme-green-12: #e1ffeb;

      --simple-colors-default-theme-light-green-1: #0d2000;
      --simple-colors-default-theme-light-green-2: #143000;
      --simple-colors-default-theme-light-green-3: #1b3f00;
      --simple-colors-default-theme-light-green-4: #296100;
      --simple-colors-default-theme-light-green-5: #357f00;
      --simple-colors-default-theme-light-green-6: #429d00;
      --simple-colors-default-theme-light-green-7: #6fff00;
      --simple-colors-default-theme-light-green-8: #8efd38;
      --simple-colors-default-theme-light-green-9: #a1fd5a;
      --simple-colors-default-theme-light-green-10: #b1ff75;
      --simple-colors-default-theme-light-green-11: #c7ff9b;
      --simple-colors-default-theme-light-green-12: #ebffdb;

      --simple-colors-default-theme-lime-1: #182400;
      --simple-colors-default-theme-lime-2: #223400;
      --simple-colors-default-theme-lime-3: #293f00;
      --simple-colors-default-theme-lime-4: #3b5a00;
      --simple-colors-default-theme-lime-5: #4d7600;
      --simple-colors-default-theme-lime-6: #649900;
      --simple-colors-default-theme-lime-7: #aeff00;
      --simple-colors-default-theme-lime-8: #bdff2d;
      --simple-colors-default-theme-lime-9: #caff58;
      --simple-colors-default-theme-lime-10: #d4ff77;
      --simple-colors-default-theme-lime-11: #dfff9b;
      --simple-colors-default-theme-lime-12: #f1ffd2;

      --simple-colors-default-theme-yellow-1: #242400;
      --simple-colors-default-theme-yellow-2: #303000;
      --simple-colors-default-theme-yellow-3: #454400;
      --simple-colors-default-theme-yellow-4: #585700;
      --simple-colors-default-theme-yellow-5: #787700;
      --simple-colors-default-theme-yellow-6: #929100;
      --simple-colors-default-theme-yellow-7: #f6f600;
      --simple-colors-default-theme-yellow-8: #ffff3a;
      --simple-colors-default-theme-yellow-9: #ffff7c;
      --simple-colors-default-theme-yellow-10: #ffff90;
      --simple-colors-default-theme-yellow-11: #ffffac;
      --simple-colors-default-theme-yellow-12: #ffffd5;

      --simple-colors-default-theme-amber-1: #221a00;
      --simple-colors-default-theme-amber-2: #302500;
      --simple-colors-default-theme-amber-3: #413200;
      --simple-colors-default-theme-amber-4: #614b00;
      --simple-colors-default-theme-amber-5: #876800;
      --simple-colors-default-theme-amber-6: #b28900;
      --simple-colors-default-theme-amber-7: #ffc500;
      --simple-colors-default-theme-amber-8: #ffc235;
      --simple-colors-default-theme-amber-9: #ffcf5e;
      --simple-colors-default-theme-amber-10: #ffd677;
      --simple-colors-default-theme-amber-11: #ffdf92;
      --simple-colors-default-theme-amber-12: #fff2d4;

      --simple-colors-default-theme-orange-1: #2c1400;
      --simple-colors-default-theme-orange-2: #3d1c00;
      --simple-colors-default-theme-orange-3: #612d00;
      --simple-colors-default-theme-orange-4: #833d00;
      --simple-colors-default-theme-orange-5: #ae5100;
      --simple-colors-default-theme-orange-6: #e56a00;
      --simple-colors-default-theme-orange-7: #ff9625;
      --simple-colors-default-theme-orange-8: #ff9e36;
      --simple-colors-default-theme-orange-9: #ffb05c;
      --simple-colors-default-theme-orange-10: #ffbd75;
      --simple-colors-default-theme-orange-11: #ffca92;
      --simple-colors-default-theme-orange-12: #ffebd7;

      --simple-colors-default-theme-deep-orange-1: #240700;
      --simple-colors-default-theme-deep-orange-2: #3a0c00;
      --simple-colors-default-theme-deep-orange-3: #561100;
      --simple-colors-default-theme-deep-orange-4: #8a1c00;
      --simple-colors-default-theme-deep-orange-5: #b92500;
      --simple-colors-default-theme-deep-orange-6: #f53100;
      --simple-colors-default-theme-deep-orange-7: #ff6c3c;
      --simple-colors-default-theme-deep-orange-8: #ff7649;
      --simple-colors-default-theme-deep-orange-9: #ff8a64;
      --simple-colors-default-theme-deep-orange-10: #ffa588;
      --simple-colors-default-theme-deep-orange-11: #ffb299;
      --simple-colors-default-theme-deep-orange-12: #ffe7e0;

      --simple-colors-default-theme-brown-1: #200e09;
      --simple-colors-default-theme-brown-2: #2c140e;
      --simple-colors-default-theme-brown-3: #3b1e15;
      --simple-colors-default-theme-brown-4: #5b3328;
      --simple-colors-default-theme-brown-5: #724539;
      --simple-colors-default-theme-brown-6: #85574a;
      --simple-colors-default-theme-brown-7: #a47060;
      --simple-colors-default-theme-brown-8: #ac7868;
      --simple-colors-default-theme-brown-9: #b68373;
      --simple-colors-default-theme-brown-10: #c59485;
      --simple-colors-default-theme-brown-11: #e5b8aa;
      --simple-colors-default-theme-brown-12: #f0e2de;

      --simple-colors-default-theme-blue-grey-1: #0f1518;
      --simple-colors-default-theme-blue-grey-2: #182023;
      --simple-colors-default-theme-blue-grey-3: #1e282c;
      --simple-colors-default-theme-blue-grey-4: #2f3e45;
      --simple-colors-default-theme-blue-grey-5: #40535b;
      --simple-colors-default-theme-blue-grey-6: #56707c;
      --simple-colors-default-theme-blue-grey-7: #718892;
      --simple-colors-default-theme-blue-grey-8: #7a8f98;
      --simple-colors-default-theme-blue-grey-9: #8d9fa7;
      --simple-colors-default-theme-blue-grey-10: #9badb6;
      --simple-colors-default-theme-blue-grey-11: #b1c5ce;
      --simple-colors-default-theme-blue-grey-12: #e7eff1;
    }

    :host([accent-color="grey"]),
    :host [accent-color="grey"] {
      --simple-colors-default-theme-accent-1: #ffffff;
      --simple-colors-default-theme-accent-2: #eeeeee;
      --simple-colors-default-theme-accent-3: #dddddd;
      --simple-colors-default-theme-accent-4: #cccccc;
      --simple-colors-default-theme-accent-5: #bbbbbb;
      --simple-colors-default-theme-accent-6: #999999;
      --simple-colors-default-theme-accent-7: #666666;
      --simple-colors-default-theme-accent-8: #444444;
      --simple-colors-default-theme-accent-9: #333333;
      --simple-colors-default-theme-accent-10: #222222;
      --simple-colors-default-theme-accent-11: #111111;
      --simple-colors-default-theme-accent-12: #000000;
      --simple-colors-fixed-theme-accent-1: #ffffff;
      --simple-colors-fixed-theme-accent-2: #eeeeee;
      --simple-colors-fixed-theme-accent-3: #dddddd;
      --simple-colors-fixed-theme-accent-4: #cccccc;
      --simple-colors-fixed-theme-accent-5: #bbbbbb;
      --simple-colors-fixed-theme-accent-6: #999999;
      --simple-colors-fixed-theme-accent-7: #666666;
      --simple-colors-fixed-theme-accent-8: #444444;
      --simple-colors-fixed-theme-accent-9: #333333;
      --simple-colors-fixed-theme-accent-10: #222222;
      --simple-colors-fixed-theme-accent-11: #111111;
      --simple-colors-fixed-theme-accent-12: #000000;
    }

    :host([dark][accent-color="grey"]),
    :host([dark]) [accent-color="grey"],
    :host([accent-color="grey"]) [dark],
    :host [dark][accent-color="grey"] {
      --simple-colors-default-theme-accent-1: #000000;
      --simple-colors-default-theme-accent-2: #111111;
      --simple-colors-default-theme-accent-3: #222222;
      --simple-colors-default-theme-accent-4: #333333;
      --simple-colors-default-theme-accent-5: #444444;
      --simple-colors-default-theme-accent-6: #666666;
      --simple-colors-default-theme-accent-7: #999999;
      --simple-colors-default-theme-accent-8: #bbbbbb;
      --simple-colors-default-theme-accent-9: #cccccc;
      --simple-colors-default-theme-accent-10: #dddddd;
      --simple-colors-default-theme-accent-11: #eeeeee;
      --simple-colors-default-theme-accent-12: #ffffff;
    }

    :host([accent-color="red"]),
    :host [accent-color="red"] {
      --simple-colors-default-theme-accent-1: #ffdddd;
      --simple-colors-default-theme-accent-2: #ffaeae;
      --simple-colors-default-theme-accent-3: #ff8f8f;
      --simple-colors-default-theme-accent-4: #ff7474;
      --simple-colors-default-theme-accent-5: #fd5151;
      --simple-colors-default-theme-accent-6: #ff2222;
      --simple-colors-default-theme-accent-7: #ee0000;
      --simple-colors-default-theme-accent-8: #ac0000;
      --simple-colors-default-theme-accent-9: #850000;
      --simple-colors-default-theme-accent-10: #670000;
      --simple-colors-default-theme-accent-11: #520000;
      --simple-colors-default-theme-accent-12: #3f0000;
      --simple-colors-fixed-theme-accent-1: #ffdddd;
      --simple-colors-fixed-theme-accent-2: #ffaeae;
      --simple-colors-fixed-theme-accent-3: #ff8f8f;
      --simple-colors-fixed-theme-accent-4: #ff7474;
      --simple-colors-fixed-theme-accent-5: #fd5151;
      --simple-colors-fixed-theme-accent-6: #ff2222;
      --simple-colors-fixed-theme-accent-7: #ee0000;
      --simple-colors-fixed-theme-accent-8: #ac0000;
      --simple-colors-fixed-theme-accent-9: #850000;
      --simple-colors-fixed-theme-accent-10: #670000;
      --simple-colors-fixed-theme-accent-11: #520000;
      --simple-colors-fixed-theme-accent-12: #3f0000;
    }

    :host([dark][accent-color="red"]),
    :host([dark]) [accent-color="red"],
    :host([accent-color="red"]) [dark],
    :host [dark][accent-color="red"] {
      --simple-colors-default-theme-accent-1: #3f0000;
      --simple-colors-default-theme-accent-2: #520000;
      --simple-colors-default-theme-accent-3: #670000;
      --simple-colors-default-theme-accent-4: #850000;
      --simple-colors-default-theme-accent-5: #ac0000;
      --simple-colors-default-theme-accent-6: #ee0000;
      --simple-colors-default-theme-accent-7: #ff2222;
      --simple-colors-default-theme-accent-8: #fd5151;
      --simple-colors-default-theme-accent-9: #ff7474;
      --simple-colors-default-theme-accent-10: #ff8f8f;
      --simple-colors-default-theme-accent-11: #ffaeae;
      --simple-colors-default-theme-accent-12: #ffdddd;
    }

    :host([accent-color="pink"]),
    :host [accent-color="pink"] {
      --simple-colors-default-theme-accent-1: #ffe6f1;
      --simple-colors-default-theme-accent-2: #ffa5cf;
      --simple-colors-default-theme-accent-3: #ff87c0;
      --simple-colors-default-theme-accent-4: #ff73b5;
      --simple-colors-default-theme-accent-5: #fd60aa;
      --simple-colors-default-theme-accent-6: #ff3996;
      --simple-colors-default-theme-accent-7: #da004e;
      --simple-colors-default-theme-accent-8: #b80042;
      --simple-colors-default-theme-accent-9: #980036;
      --simple-colors-default-theme-accent-10: #78002b;
      --simple-colors-default-theme-accent-11: #5a0020;
      --simple-colors-default-theme-accent-12: #440019;
      --simple-colors-fixed-theme-accent-1: #ffe6f1;
      --simple-colors-fixed-theme-accent-2: #ffa5cf;
      --simple-colors-fixed-theme-accent-3: #ff87c0;
      --simple-colors-fixed-theme-accent-4: #ff73b5;
      --simple-colors-fixed-theme-accent-5: #fd60aa;
      --simple-colors-fixed-theme-accent-6: #ff3996;
      --simple-colors-fixed-theme-accent-7: #da004e;
      --simple-colors-fixed-theme-accent-8: #b80042;
      --simple-colors-fixed-theme-accent-9: #980036;
      --simple-colors-fixed-theme-accent-10: #78002b;
      --simple-colors-fixed-theme-accent-11: #5a0020;
      --simple-colors-fixed-theme-accent-12: #440019;
    }

    :host([dark][accent-color="pink"]),
    :host([dark]) [accent-color="pink"],
    :host([accent-color="pink"]) [dark],
    :host [dark][accent-color="pink"] {
      --simple-colors-default-theme-accent-1: #440019;
      --simple-colors-default-theme-accent-2: #5a0020;
      --simple-colors-default-theme-accent-3: #78002b;
      --simple-colors-default-theme-accent-4: #980036;
      --simple-colors-default-theme-accent-5: #b80042;
      --simple-colors-default-theme-accent-6: #da004e;
      --simple-colors-default-theme-accent-7: #ff3996;
      --simple-colors-default-theme-accent-8: #fd60aa;
      --simple-colors-default-theme-accent-9: #ff73b5;
      --simple-colors-default-theme-accent-10: #ff87c0;
      --simple-colors-default-theme-accent-11: #ffa5cf;
      --simple-colors-default-theme-accent-12: #ffe6f1;
    }

    :host([accent-color="purple"]),
    :host [accent-color="purple"] {
      --simple-colors-default-theme-accent-1: #fce6ff;
      --simple-colors-default-theme-accent-2: #f4affd;
      --simple-colors-default-theme-accent-3: #f394ff;
      --simple-colors-default-theme-accent-4: #f07cff;
      --simple-colors-default-theme-accent-5: #ed61ff;
      --simple-colors-default-theme-accent-6: #e200ff;
      --simple-colors-default-theme-accent-7: #a500ba;
      --simple-colors-default-theme-accent-8: #8a009b;
      --simple-colors-default-theme-accent-9: #6c0079;
      --simple-colors-default-theme-accent-10: #490052;
      --simple-colors-default-theme-accent-11: #33003a;
      --simple-colors-default-theme-accent-12: #200025;
      --simple-colors-fixed-theme-accent-1: #fce6ff;
      --simple-colors-fixed-theme-accent-2: #f4affd;
      --simple-colors-fixed-theme-accent-3: #f394ff;
      --simple-colors-fixed-theme-accent-4: #f07cff;
      --simple-colors-fixed-theme-accent-5: #ed61ff;
      --simple-colors-fixed-theme-accent-6: #e200ff;
      --simple-colors-fixed-theme-accent-7: #a500ba;
      --simple-colors-fixed-theme-accent-8: #8a009b;
      --simple-colors-fixed-theme-accent-9: #6c0079;
      --simple-colors-fixed-theme-accent-10: #490052;
      --simple-colors-fixed-theme-accent-11: #33003a;
      --simple-colors-fixed-theme-accent-12: #200025;
    }

    :host([dark][accent-color="purple"]),
    :host([dark]) [accent-color="purple"],
    :host([accent-color="purple"]) [dark],
    :host [dark][accent-color="purple"] {
      --simple-colors-default-theme-accent-1: #200025;
      --simple-colors-default-theme-accent-2: #33003a;
      --simple-colors-default-theme-accent-3: #490052;
      --simple-colors-default-theme-accent-4: #6c0079;
      --simple-colors-default-theme-accent-5: #8a009b;
      --simple-colors-default-theme-accent-6: #a500ba;
      --simple-colors-default-theme-accent-7: #e200ff;
      --simple-colors-default-theme-accent-8: #ed61ff;
      --simple-colors-default-theme-accent-9: #f07cff;
      --simple-colors-default-theme-accent-10: #f394ff;
      --simple-colors-default-theme-accent-11: #f4affd;
      --simple-colors-default-theme-accent-12: #fce6ff;
    }

    :host([accent-color="deep-purple"]),
    :host [accent-color="deep-purple"] {
      --simple-colors-default-theme-accent-1: #f3e4ff;
      --simple-colors-default-theme-accent-2: #ddacff;
      --simple-colors-default-theme-accent-3: #c97eff;
      --simple-colors-default-theme-accent-4: #bb63f9;
      --simple-colors-default-theme-accent-5: #b44aff;
      --simple-colors-default-theme-accent-6: #a931ff;
      --simple-colors-default-theme-accent-7: #7e00d8;
      --simple-colors-default-theme-accent-8: #5d009f;
      --simple-colors-default-theme-accent-9: #4c0081;
      --simple-colors-default-theme-accent-10: #3a0063;
      --simple-colors-default-theme-accent-11: #2a0049;
      --simple-colors-default-theme-accent-12: #1d0033;
      --simple-colors-fixed-theme-accent-1: #f3e4ff;
      --simple-colors-fixed-theme-accent-2: #ddacff;
      --simple-colors-fixed-theme-accent-3: #c97eff;
      --simple-colors-fixed-theme-accent-4: #bb63f9;
      --simple-colors-fixed-theme-accent-5: #b44aff;
      --simple-colors-fixed-theme-accent-6: #a931ff;
      --simple-colors-fixed-theme-accent-7: #7e00d8;
      --simple-colors-fixed-theme-accent-8: #5d009f;
      --simple-colors-fixed-theme-accent-9: #4c0081;
      --simple-colors-fixed-theme-accent-10: #3a0063;
      --simple-colors-fixed-theme-accent-11: #2a0049;
      --simple-colors-fixed-theme-accent-12: #1d0033;
    }

    :host([dark][accent-color="deep-purple"]),
    :host([dark]) [accent-color="deep-purple"],
    :host([accent-color="deep-purple"]) [dark],
    :host [dark][accent-color="deep-purple"] {
      --simple-colors-default-theme-accent-1: #1d0033;
      --simple-colors-default-theme-accent-2: #2a0049;
      --simple-colors-default-theme-accent-3: #3a0063;
      --simple-colors-default-theme-accent-4: #4c0081;
      --simple-colors-default-theme-accent-5: #5d009f;
      --simple-colors-default-theme-accent-6: #7e00d8;
      --simple-colors-default-theme-accent-7: #a931ff;
      --simple-colors-default-theme-accent-8: #b44aff;
      --simple-colors-default-theme-accent-9: #bb63f9;
      --simple-colors-default-theme-accent-10: #c97eff;
      --simple-colors-default-theme-accent-11: #ddacff;
      --simple-colors-default-theme-accent-12: #f3e4ff;
    }

    :host([accent-color="indigo"]),
    :host [accent-color="indigo"] {
      --simple-colors-default-theme-accent-1: #e5ddff;
      --simple-colors-default-theme-accent-2: #c3b2ff;
      --simple-colors-default-theme-accent-3: #af97ff;
      --simple-colors-default-theme-accent-4: #9e82ff;
      --simple-colors-default-theme-accent-5: #9373ff;
      --simple-colors-default-theme-accent-6: #835fff;
      --simple-colors-default-theme-accent-7: #3a00ff;
      --simple-colors-default-theme-accent-8: #2801b0;
      --simple-colors-default-theme-accent-9: #20008c;
      --simple-colors-default-theme-accent-10: #160063;
      --simple-colors-default-theme-accent-11: #100049;
      --simple-colors-default-theme-accent-12: #0a0030;
      --simple-colors-fixed-theme-accent-1: #e5ddff;
      --simple-colors-fixed-theme-accent-2: #c3b2ff;
      --simple-colors-fixed-theme-accent-3: #af97ff;
      --simple-colors-fixed-theme-accent-4: #9e82ff;
      --simple-colors-fixed-theme-accent-5: #9373ff;
      --simple-colors-fixed-theme-accent-6: #835fff;
      --simple-colors-fixed-theme-accent-7: #3a00ff;
      --simple-colors-fixed-theme-accent-8: #2801b0;
      --simple-colors-fixed-theme-accent-9: #20008c;
      --simple-colors-fixed-theme-accent-10: #160063;
      --simple-colors-fixed-theme-accent-11: #100049;
      --simple-colors-fixed-theme-accent-12: #0a0030;
    }

    :host([dark][accent-color="indigo"]),
    :host([dark]) [accent-color="indigo"],
    :host([accent-color="indigo"]) [dark],
    :host [dark][accent-color="indigo"] {
      --simple-colors-default-theme-accent-1: #0a0030;
      --simple-colors-default-theme-accent-2: #100049;
      --simple-colors-default-theme-accent-3: #160063;
      --simple-colors-default-theme-accent-4: #20008c;
      --simple-colors-default-theme-accent-5: #2801b0;
      --simple-colors-default-theme-accent-6: #3a00ff;
      --simple-colors-default-theme-accent-7: #835fff;
      --simple-colors-default-theme-accent-8: #9373ff;
      --simple-colors-default-theme-accent-9: #9e82ff;
      --simple-colors-default-theme-accent-10: #af97ff;
      --simple-colors-default-theme-accent-11: #c3b2ff;
      --simple-colors-default-theme-accent-12: #e5ddff;
    }

    :host([accent-color="blue"]),
    :host [accent-color="blue"] {
      --simple-colors-default-theme-accent-1: #e2ecff;
      --simple-colors-default-theme-accent-2: #acc9ff;
      --simple-colors-default-theme-accent-3: #95baff;
      --simple-colors-default-theme-accent-4: #74a5ff;
      --simple-colors-default-theme-accent-5: #5892fd;
      --simple-colors-default-theme-accent-6: #4083ff;
      --simple-colors-default-theme-accent-7: #0059ff;
      --simple-colors-default-theme-accent-8: #0041bb;
      --simple-colors-default-theme-accent-9: #003494;
      --simple-colors-default-theme-accent-10: #002569;
      --simple-colors-default-theme-accent-11: #001947;
      --simple-colors-default-theme-accent-12: #001333;
      --simple-colors-fixed-theme-accent-1: #e2ecff;
      --simple-colors-fixed-theme-accent-2: #acc9ff;
      --simple-colors-fixed-theme-accent-3: #95baff;
      --simple-colors-fixed-theme-accent-4: #74a5ff;
      --simple-colors-fixed-theme-accent-5: #5892fd;
      --simple-colors-fixed-theme-accent-6: #4083ff;
      --simple-colors-fixed-theme-accent-7: #0059ff;
      --simple-colors-fixed-theme-accent-8: #0041bb;
      --simple-colors-fixed-theme-accent-9: #003494;
      --simple-colors-fixed-theme-accent-10: #002569;
      --simple-colors-fixed-theme-accent-11: #001947;
      --simple-colors-fixed-theme-accent-12: #001333;
    }

    :host([dark][accent-color="blue"]),
    :host([dark]) [accent-color="blue"],
    :host([accent-color="blue"]) [dark],
    :host [dark][accent-color="blue"] {
      --simple-colors-default-theme-accent-1: #001333;
      --simple-colors-default-theme-accent-2: #001947;
      --simple-colors-default-theme-accent-3: #002569;
      --simple-colors-default-theme-accent-4: #003494;
      --simple-colors-default-theme-accent-5: #0041bb;
      --simple-colors-default-theme-accent-6: #0059ff;
      --simple-colors-default-theme-accent-7: #4083ff;
      --simple-colors-default-theme-accent-8: #5892fd;
      --simple-colors-default-theme-accent-9: #74a5ff;
      --simple-colors-default-theme-accent-10: #95baff;
      --simple-colors-default-theme-accent-11: #acc9ff;
      --simple-colors-default-theme-accent-12: #e2ecff;
    }

    :host([accent-color="light-blue"]),
    :host [accent-color="light-blue"] {
      --simple-colors-default-theme-accent-1: #cde8ff;
      --simple-colors-default-theme-accent-2: #a1d1ff;
      --simple-colors-default-theme-accent-3: #92c9ff;
      --simple-colors-default-theme-accent-4: #65b3ff;
      --simple-colors-default-theme-accent-5: #58adff;
      --simple-colors-default-theme-accent-6: #41a1ff;
      --simple-colors-default-theme-accent-7: #007ffc;
      --simple-colors-default-theme-accent-8: #0066ca;
      --simple-colors-default-theme-accent-9: #0055a8;
      --simple-colors-default-theme-accent-10: #003f7d;
      --simple-colors-default-theme-accent-11: #002850;
      --simple-colors-default-theme-accent-12: #001b36;
      --simple-colors-fixed-theme-accent-1: #cde8ff;
      --simple-colors-fixed-theme-accent-2: #a1d1ff;
      --simple-colors-fixed-theme-accent-3: #92c9ff;
      --simple-colors-fixed-theme-accent-4: #65b3ff;
      --simple-colors-fixed-theme-accent-5: #58adff;
      --simple-colors-fixed-theme-accent-6: #41a1ff;
      --simple-colors-fixed-theme-accent-7: #007ffc;
      --simple-colors-fixed-theme-accent-8: #0066ca;
      --simple-colors-fixed-theme-accent-9: #0055a8;
      --simple-colors-fixed-theme-accent-10: #003f7d;
      --simple-colors-fixed-theme-accent-11: #002850;
      --simple-colors-fixed-theme-accent-12: #001b36;
    }

    :host([dark][accent-color="light-blue"]),
    :host([dark]) [accent-color="light-blue"],
    :host([accent-color="light-blue"]) [dark],
    :host [dark][accent-color="light-blue"] {
      --simple-colors-default-theme-accent-1: #001b36;
      --simple-colors-default-theme-accent-2: #002850;
      --simple-colors-default-theme-accent-3: #003f7d;
      --simple-colors-default-theme-accent-4: #0055a8;
      --simple-colors-default-theme-accent-5: #0066ca;
      --simple-colors-default-theme-accent-6: #007ffc;
      --simple-colors-default-theme-accent-7: #41a1ff;
      --simple-colors-default-theme-accent-8: #58adff;
      --simple-colors-default-theme-accent-9: #65b3ff;
      --simple-colors-default-theme-accent-10: #92c9ff;
      --simple-colors-default-theme-accent-11: #a1d1ff;
      --simple-colors-default-theme-accent-12: #cde8ff;
    }

    :host([accent-color="cyan"]),
    :host [accent-color="cyan"] {
      --simple-colors-default-theme-accent-1: #ddf8ff;
      --simple-colors-default-theme-accent-2: #9beaff;
      --simple-colors-default-theme-accent-3: #77e2ff;
      --simple-colors-default-theme-accent-4: #33d4ff;
      --simple-colors-default-theme-accent-5: #1ccfff;
      --simple-colors-default-theme-accent-6: #00c9ff;
      --simple-colors-default-theme-accent-7: #009dc7;
      --simple-colors-default-theme-accent-8: #007999;
      --simple-colors-default-theme-accent-9: #005970;
      --simple-colors-default-theme-accent-10: #003f50;
      --simple-colors-default-theme-accent-11: #002c38;
      --simple-colors-default-theme-accent-12: #001a20;
      --simple-colors-fixed-theme-accent-1: #ddf8ff;
      --simple-colors-fixed-theme-accent-2: #9beaff;
      --simple-colors-fixed-theme-accent-3: #77e2ff;
      --simple-colors-fixed-theme-accent-4: #33d4ff;
      --simple-colors-fixed-theme-accent-5: #1ccfff;
      --simple-colors-fixed-theme-accent-6: #00c9ff;
      --simple-colors-fixed-theme-accent-7: #009dc7;
      --simple-colors-fixed-theme-accent-8: #007999;
      --simple-colors-fixed-theme-accent-9: #005970;
      --simple-colors-fixed-theme-accent-10: #003f50;
      --simple-colors-fixed-theme-accent-11: #002c38;
      --simple-colors-fixed-theme-accent-12: #001a20;
    }

    :host([dark][accent-color="cyan"]),
    :host([dark]) [accent-color="cyan"],
    :host([accent-color="cyan"]) [dark],
    :host [dark][accent-color="cyan"] {
      --simple-colors-default-theme-accent-1: #001a20;
      --simple-colors-default-theme-accent-2: #002c38;
      --simple-colors-default-theme-accent-3: #003f50;
      --simple-colors-default-theme-accent-4: #005970;
      --simple-colors-default-theme-accent-5: #007999;
      --simple-colors-default-theme-accent-6: #009dc7;
      --simple-colors-default-theme-accent-7: #00c9ff;
      --simple-colors-default-theme-accent-8: #1ccfff;
      --simple-colors-default-theme-accent-9: #33d4ff;
      --simple-colors-default-theme-accent-10: #77e2ff;
      --simple-colors-default-theme-accent-11: #9beaff;
      --simple-colors-default-theme-accent-12: #ddf8ff;
    }

    :host([accent-color="teal"]),
    :host [accent-color="teal"] {
      --simple-colors-default-theme-accent-1: #d9fff0;
      --simple-colors-default-theme-accent-2: #98ffd7;
      --simple-colors-default-theme-accent-3: #79ffcb;
      --simple-colors-default-theme-accent-4: #56ffbd;
      --simple-colors-default-theme-accent-5: #29ffac;
      --simple-colors-default-theme-accent-6: #00ff9c;
      --simple-colors-default-theme-accent-7: #009d75;
      --simple-colors-default-theme-accent-8: #007658;
      --simple-colors-default-theme-accent-9: #004e3a;
      --simple-colors-default-theme-accent-10: #003829;
      --simple-colors-default-theme-accent-11: #002a20;
      --simple-colors-default-theme-accent-12: #001b14;
      --simple-colors-fixed-theme-accent-1: #d9fff0;
      --simple-colors-fixed-theme-accent-2: #98ffd7;
      --simple-colors-fixed-theme-accent-3: #79ffcb;
      --simple-colors-fixed-theme-accent-4: #56ffbd;
      --simple-colors-fixed-theme-accent-5: #29ffac;
      --simple-colors-fixed-theme-accent-6: #00ff9c;
      --simple-colors-fixed-theme-accent-7: #009d75;
      --simple-colors-fixed-theme-accent-8: #007658;
      --simple-colors-fixed-theme-accent-9: #004e3a;
      --simple-colors-fixed-theme-accent-10: #003829;
      --simple-colors-fixed-theme-accent-11: #002a20;
      --simple-colors-fixed-theme-accent-12: #001b14;
    }

    :host([dark][accent-color="teal"]),
    :host([dark]) [accent-color="teal"],
    :host([accent-color="teal"]) [dark],
    :host [dark][accent-color="teal"] {
      --simple-colors-default-theme-accent-1: #001b14;
      --simple-colors-default-theme-accent-2: #002a20;
      --simple-colors-default-theme-accent-3: #003829;
      --simple-colors-default-theme-accent-4: #004e3a;
      --simple-colors-default-theme-accent-5: #007658;
      --simple-colors-default-theme-accent-6: #009d75;
      --simple-colors-default-theme-accent-7: #00ff9c;
      --simple-colors-default-theme-accent-8: #29ffac;
      --simple-colors-default-theme-accent-9: #56ffbd;
      --simple-colors-default-theme-accent-10: #79ffcb;
      --simple-colors-default-theme-accent-11: #98ffd7;
      --simple-colors-default-theme-accent-12: #d9fff0;
    }

    :host([accent-color="green"]),
    :host [accent-color="green"] {
      --simple-colors-default-theme-accent-1: #e1ffeb;
      --simple-colors-default-theme-accent-2: #acffc9;
      --simple-colors-default-theme-accent-3: #79ffa7;
      --simple-colors-default-theme-accent-4: #49ff88;
      --simple-colors-default-theme-accent-5: #24ff70;
      --simple-colors-default-theme-accent-6: #00f961;
      --simple-colors-default-theme-accent-7: #008c37;
      --simple-colors-default-theme-accent-8: #00762e;
      --simple-colors-default-theme-accent-9: #005a23;
      --simple-colors-default-theme-accent-10: #003d18;
      --simple-colors-default-theme-accent-11: #002a11;
      --simple-colors-default-theme-accent-12: #001d0c;
      --simple-colors-fixed-theme-accent-1: #e1ffeb;
      --simple-colors-fixed-theme-accent-2: #acffc9;
      --simple-colors-fixed-theme-accent-3: #79ffa7;
      --simple-colors-fixed-theme-accent-4: #49ff88;
      --simple-colors-fixed-theme-accent-5: #24ff70;
      --simple-colors-fixed-theme-accent-6: #00f961;
      --simple-colors-fixed-theme-accent-7: #008c37;
      --simple-colors-fixed-theme-accent-8: #00762e;
      --simple-colors-fixed-theme-accent-9: #005a23;
      --simple-colors-fixed-theme-accent-10: #003d18;
      --simple-colors-fixed-theme-accent-11: #002a11;
      --simple-colors-fixed-theme-accent-12: #001d0c;
    }

    :host([dark][accent-color="green"]),
    :host([dark]) [accent-color="green"],
    :host([accent-color="green"]) [dark],
    :host [dark][accent-color="green"] {
      --simple-colors-default-theme-accent-1: #001d0c;
      --simple-colors-default-theme-accent-2: #002a11;
      --simple-colors-default-theme-accent-3: #003d18;
      --simple-colors-default-theme-accent-4: #005a23;
      --simple-colors-default-theme-accent-5: #00762e;
      --simple-colors-default-theme-accent-6: #008c37;
      --simple-colors-default-theme-accent-7: #00f961;
      --simple-colors-default-theme-accent-8: #24ff70;
      --simple-colors-default-theme-accent-9: #49ff88;
      --simple-colors-default-theme-accent-10: #79ffa7;
      --simple-colors-default-theme-accent-11: #acffc9;
      --simple-colors-default-theme-accent-12: #e1ffeb;
    }

    :host([accent-color="light-green"]),
    :host [accent-color="light-green"] {
      --simple-colors-default-theme-accent-1: #ebffdb;
      --simple-colors-default-theme-accent-2: #c7ff9b;
      --simple-colors-default-theme-accent-3: #b1ff75;
      --simple-colors-default-theme-accent-4: #a1fd5a;
      --simple-colors-default-theme-accent-5: #8efd38;
      --simple-colors-default-theme-accent-6: #6fff00;
      --simple-colors-default-theme-accent-7: #429d00;
      --simple-colors-default-theme-accent-8: #357f00;
      --simple-colors-default-theme-accent-9: #296100;
      --simple-colors-default-theme-accent-10: #1b3f00;
      --simple-colors-default-theme-accent-11: #143000;
      --simple-colors-default-theme-accent-12: #0d2000;
      --simple-colors-fixed-theme-accent-1: #ebffdb;
      --simple-colors-fixed-theme-accent-2: #c7ff9b;
      --simple-colors-fixed-theme-accent-3: #b1ff75;
      --simple-colors-fixed-theme-accent-4: #a1fd5a;
      --simple-colors-fixed-theme-accent-5: #8efd38;
      --simple-colors-fixed-theme-accent-6: #6fff00;
      --simple-colors-fixed-theme-accent-7: #429d00;
      --simple-colors-fixed-theme-accent-8: #357f00;
      --simple-colors-fixed-theme-accent-9: #296100;
      --simple-colors-fixed-theme-accent-10: #1b3f00;
      --simple-colors-fixed-theme-accent-11: #143000;
      --simple-colors-fixed-theme-accent-12: #0d2000;
    }

    :host([dark][accent-color="light-green"]),
    :host([dark]) [accent-color="light-green"],
    :host([accent-color="light-green"]) [dark],
    :host [dark][accent-color="light-green"] {
      --simple-colors-default-theme-accent-1: #0d2000;
      --simple-colors-default-theme-accent-2: #143000;
      --simple-colors-default-theme-accent-3: #1b3f00;
      --simple-colors-default-theme-accent-4: #296100;
      --simple-colors-default-theme-accent-5: #357f00;
      --simple-colors-default-theme-accent-6: #429d00;
      --simple-colors-default-theme-accent-7: #6fff00;
      --simple-colors-default-theme-accent-8: #8efd38;
      --simple-colors-default-theme-accent-9: #a1fd5a;
      --simple-colors-default-theme-accent-10: #b1ff75;
      --simple-colors-default-theme-accent-11: #c7ff9b;
      --simple-colors-default-theme-accent-12: #ebffdb;
    }

    :host([accent-color="lime"]),
    :host [accent-color="lime"] {
      --simple-colors-default-theme-accent-1: #f1ffd2;
      --simple-colors-default-theme-accent-2: #dfff9b;
      --simple-colors-default-theme-accent-3: #d4ff77;
      --simple-colors-default-theme-accent-4: #caff58;
      --simple-colors-default-theme-accent-5: #bdff2d;
      --simple-colors-default-theme-accent-6: #aeff00;
      --simple-colors-default-theme-accent-7: #649900;
      --simple-colors-default-theme-accent-8: #4d7600;
      --simple-colors-default-theme-accent-9: #3b5a00;
      --simple-colors-default-theme-accent-10: #293f00;
      --simple-colors-default-theme-accent-11: #223400;
      --simple-colors-default-theme-accent-12: #182400;
      --simple-colors-fixed-theme-accent-1: #f1ffd2;
      --simple-colors-fixed-theme-accent-2: #dfff9b;
      --simple-colors-fixed-theme-accent-3: #d4ff77;
      --simple-colors-fixed-theme-accent-4: #caff58;
      --simple-colors-fixed-theme-accent-5: #bdff2d;
      --simple-colors-fixed-theme-accent-6: #aeff00;
      --simple-colors-fixed-theme-accent-7: #649900;
      --simple-colors-fixed-theme-accent-8: #4d7600;
      --simple-colors-fixed-theme-accent-9: #3b5a00;
      --simple-colors-fixed-theme-accent-10: #293f00;
      --simple-colors-fixed-theme-accent-11: #223400;
      --simple-colors-fixed-theme-accent-12: #182400;
    }

    :host([dark][accent-color="lime"]),
    :host([dark]) [accent-color="lime"],
    :host([accent-color="lime"]) [dark],
    :host [dark][accent-color="lime"] {
      --simple-colors-default-theme-accent-1: #182400;
      --simple-colors-default-theme-accent-2: #223400;
      --simple-colors-default-theme-accent-3: #293f00;
      --simple-colors-default-theme-accent-4: #3b5a00;
      --simple-colors-default-theme-accent-5: #4d7600;
      --simple-colors-default-theme-accent-6: #649900;
      --simple-colors-default-theme-accent-7: #aeff00;
      --simple-colors-default-theme-accent-8: #bdff2d;
      --simple-colors-default-theme-accent-9: #caff58;
      --simple-colors-default-theme-accent-10: #d4ff77;
      --simple-colors-default-theme-accent-11: #dfff9b;
      --simple-colors-default-theme-accent-12: #f1ffd2;
    }

    :host([accent-color="yellow"]),
    :host [accent-color="yellow"] {
      --simple-colors-default-theme-accent-1: #ffffd5;
      --simple-colors-default-theme-accent-2: #ffffac;
      --simple-colors-default-theme-accent-3: #ffff90;
      --simple-colors-default-theme-accent-4: #ffff7c;
      --simple-colors-default-theme-accent-5: #ffff3a;
      --simple-colors-default-theme-accent-6: #f6f600;
      --simple-colors-default-theme-accent-7: #929100;
      --simple-colors-default-theme-accent-8: #787700;
      --simple-colors-default-theme-accent-9: #585700;
      --simple-colors-default-theme-accent-10: #454400;
      --simple-colors-default-theme-accent-11: #303000;
      --simple-colors-default-theme-accent-12: #242400;
      --simple-colors-fixed-theme-accent-1: #ffffd5;
      --simple-colors-fixed-theme-accent-2: #ffffac;
      --simple-colors-fixed-theme-accent-3: #ffff90;
      --simple-colors-fixed-theme-accent-4: #ffff7c;
      --simple-colors-fixed-theme-accent-5: #ffff3a;
      --simple-colors-fixed-theme-accent-6: #f6f600;
      --simple-colors-fixed-theme-accent-7: #929100;
      --simple-colors-fixed-theme-accent-8: #787700;
      --simple-colors-fixed-theme-accent-9: #585700;
      --simple-colors-fixed-theme-accent-10: #454400;
      --simple-colors-fixed-theme-accent-11: #303000;
      --simple-colors-fixed-theme-accent-12: #242400;
    }

    :host([dark][accent-color="yellow"]),
    :host([dark]) [accent-color="yellow"],
    :host([accent-color="yellow"]) [dark],
    :host [dark][accent-color="yellow"] {
      --simple-colors-default-theme-accent-1: #242400;
      --simple-colors-default-theme-accent-2: #303000;
      --simple-colors-default-theme-accent-3: #454400;
      --simple-colors-default-theme-accent-4: #585700;
      --simple-colors-default-theme-accent-5: #787700;
      --simple-colors-default-theme-accent-6: #929100;
      --simple-colors-default-theme-accent-7: #f6f600;
      --simple-colors-default-theme-accent-8: #ffff3a;
      --simple-colors-default-theme-accent-9: #ffff7c;
      --simple-colors-default-theme-accent-10: #ffff90;
      --simple-colors-default-theme-accent-11: #ffffac;
      --simple-colors-default-theme-accent-12: #ffffd5;
    }

    :host([accent-color="amber"]),
    :host [accent-color="amber"] {
      --simple-colors-default-theme-accent-1: #fff2d4;
      --simple-colors-default-theme-accent-2: #ffdf92;
      --simple-colors-default-theme-accent-3: #ffd677;
      --simple-colors-default-theme-accent-4: #ffcf5e;
      --simple-colors-default-theme-accent-5: #ffc235;
      --simple-colors-default-theme-accent-6: #ffc500;
      --simple-colors-default-theme-accent-7: #b28900;
      --simple-colors-default-theme-accent-8: #876800;
      --simple-colors-default-theme-accent-9: #614b00;
      --simple-colors-default-theme-accent-10: #413200;
      --simple-colors-default-theme-accent-11: #302500;
      --simple-colors-default-theme-accent-12: #221a00;
      --simple-colors-fixed-theme-accent-1: #fff2d4;
      --simple-colors-fixed-theme-accent-2: #ffdf92;
      --simple-colors-fixed-theme-accent-3: #ffd677;
      --simple-colors-fixed-theme-accent-4: #ffcf5e;
      --simple-colors-fixed-theme-accent-5: #ffc235;
      --simple-colors-fixed-theme-accent-6: #ffc500;
      --simple-colors-fixed-theme-accent-7: #b28900;
      --simple-colors-fixed-theme-accent-8: #876800;
      --simple-colors-fixed-theme-accent-9: #614b00;
      --simple-colors-fixed-theme-accent-10: #413200;
      --simple-colors-fixed-theme-accent-11: #302500;
      --simple-colors-fixed-theme-accent-12: #221a00;
    }

    :host([dark][accent-color="amber"]),
    :host([dark]) [accent-color="amber"],
    :host([accent-color="amber"]) [dark],
    :host [dark][accent-color="amber"] {
      --simple-colors-default-theme-accent-1: #221a00;
      --simple-colors-default-theme-accent-2: #302500;
      --simple-colors-default-theme-accent-3: #413200;
      --simple-colors-default-theme-accent-4: #614b00;
      --simple-colors-default-theme-accent-5: #876800;
      --simple-colors-default-theme-accent-6: #b28900;
      --simple-colors-default-theme-accent-7: #ffc500;
      --simple-colors-default-theme-accent-8: #ffc235;
      --simple-colors-default-theme-accent-9: #ffcf5e;
      --simple-colors-default-theme-accent-10: #ffd677;
      --simple-colors-default-theme-accent-11: #ffdf92;
      --simple-colors-default-theme-accent-12: #fff2d4;
    }

    :host([accent-color="orange"]),
    :host [accent-color="orange"] {
      --simple-colors-default-theme-accent-1: #ffebd7;
      --simple-colors-default-theme-accent-2: #ffca92;
      --simple-colors-default-theme-accent-3: #ffbd75;
      --simple-colors-default-theme-accent-4: #ffb05c;
      --simple-colors-default-theme-accent-5: #ff9e36;
      --simple-colors-default-theme-accent-6: #ff9625;
      --simple-colors-default-theme-accent-7: #e56a00;
      --simple-colors-default-theme-accent-8: #ae5100;
      --simple-colors-default-theme-accent-9: #833d00;
      --simple-colors-default-theme-accent-10: #612d00;
      --simple-colors-default-theme-accent-11: #3d1c00;
      --simple-colors-default-theme-accent-12: #2c1400;
      --simple-colors-fixed-theme-accent-1: #ffebd7;
      --simple-colors-fixed-theme-accent-2: #ffca92;
      --simple-colors-fixed-theme-accent-3: #ffbd75;
      --simple-colors-fixed-theme-accent-4: #ffb05c;
      --simple-colors-fixed-theme-accent-5: #ff9e36;
      --simple-colors-fixed-theme-accent-6: #ff9625;
      --simple-colors-fixed-theme-accent-7: #e56a00;
      --simple-colors-fixed-theme-accent-8: #ae5100;
      --simple-colors-fixed-theme-accent-9: #833d00;
      --simple-colors-fixed-theme-accent-10: #612d00;
      --simple-colors-fixed-theme-accent-11: #3d1c00;
      --simple-colors-fixed-theme-accent-12: #2c1400;
    }

    :host([dark][accent-color="orange"]),
    :host([dark]) [accent-color="orange"],
    :host([accent-color="orange"]) [dark],
    :host [dark][accent-color="orange"] {
      --simple-colors-default-theme-accent-1: #2c1400;
      --simple-colors-default-theme-accent-2: #3d1c00;
      --simple-colors-default-theme-accent-3: #612d00;
      --simple-colors-default-theme-accent-4: #833d00;
      --simple-colors-default-theme-accent-5: #ae5100;
      --simple-colors-default-theme-accent-6: #e56a00;
      --simple-colors-default-theme-accent-7: #ff9625;
      --simple-colors-default-theme-accent-8: #ff9e36;
      --simple-colors-default-theme-accent-9: #ffb05c;
      --simple-colors-default-theme-accent-10: #ffbd75;
      --simple-colors-default-theme-accent-11: #ffca92;
      --simple-colors-default-theme-accent-12: #ffebd7;
    }

    :host([accent-color="deep-orange"]),
    :host [accent-color="deep-orange"] {
      --simple-colors-default-theme-accent-1: #ffe7e0;
      --simple-colors-default-theme-accent-2: #ffb299;
      --simple-colors-default-theme-accent-3: #ffa588;
      --simple-colors-default-theme-accent-4: #ff8a64;
      --simple-colors-default-theme-accent-5: #ff7649;
      --simple-colors-default-theme-accent-6: #ff6c3c;
      --simple-colors-default-theme-accent-7: #f53100;
      --simple-colors-default-theme-accent-8: #b92500;
      --simple-colors-default-theme-accent-9: #8a1c00;
      --simple-colors-default-theme-accent-10: #561100;
      --simple-colors-default-theme-accent-11: #3a0c00;
      --simple-colors-default-theme-accent-12: #240700;
      --simple-colors-fixed-theme-accent-1: #ffe7e0;
      --simple-colors-fixed-theme-accent-2: #ffb299;
      --simple-colors-fixed-theme-accent-3: #ffa588;
      --simple-colors-fixed-theme-accent-4: #ff8a64;
      --simple-colors-fixed-theme-accent-5: #ff7649;
      --simple-colors-fixed-theme-accent-6: #ff6c3c;
      --simple-colors-fixed-theme-accent-7: #f53100;
      --simple-colors-fixed-theme-accent-8: #b92500;
      --simple-colors-fixed-theme-accent-9: #8a1c00;
      --simple-colors-fixed-theme-accent-10: #561100;
      --simple-colors-fixed-theme-accent-11: #3a0c00;
      --simple-colors-fixed-theme-accent-12: #240700;
    }

    :host([dark][accent-color="deep-orange"]),
    :host([dark]) [accent-color="deep-orange"],
    :host([accent-color="deep-orange"]) [dark],
    :host [dark][accent-color="deep-orange"] {
      --simple-colors-default-theme-accent-1: #240700;
      --simple-colors-default-theme-accent-2: #3a0c00;
      --simple-colors-default-theme-accent-3: #561100;
      --simple-colors-default-theme-accent-4: #8a1c00;
      --simple-colors-default-theme-accent-5: #b92500;
      --simple-colors-default-theme-accent-6: #f53100;
      --simple-colors-default-theme-accent-7: #ff6c3c;
      --simple-colors-default-theme-accent-8: #ff7649;
      --simple-colors-default-theme-accent-9: #ff8a64;
      --simple-colors-default-theme-accent-10: #ffa588;
      --simple-colors-default-theme-accent-11: #ffb299;
      --simple-colors-default-theme-accent-12: #ffe7e0;
    }

    :host([accent-color="brown"]),
    :host [accent-color="brown"] {
      --simple-colors-default-theme-accent-1: #f0e2de;
      --simple-colors-default-theme-accent-2: #e5b8aa;
      --simple-colors-default-theme-accent-3: #c59485;
      --simple-colors-default-theme-accent-4: #b68373;
      --simple-colors-default-theme-accent-5: #ac7868;
      --simple-colors-default-theme-accent-6: #a47060;
      --simple-colors-default-theme-accent-7: #85574a;
      --simple-colors-default-theme-accent-8: #724539;
      --simple-colors-default-theme-accent-9: #5b3328;
      --simple-colors-default-theme-accent-10: #3b1e15;
      --simple-colors-default-theme-accent-11: #2c140e;
      --simple-colors-default-theme-accent-12: #200e09;
      --simple-colors-fixed-theme-accent-1: #f0e2de;
      --simple-colors-fixed-theme-accent-2: #e5b8aa;
      --simple-colors-fixed-theme-accent-3: #c59485;
      --simple-colors-fixed-theme-accent-4: #b68373;
      --simple-colors-fixed-theme-accent-5: #ac7868;
      --simple-colors-fixed-theme-accent-6: #a47060;
      --simple-colors-fixed-theme-accent-7: #85574a;
      --simple-colors-fixed-theme-accent-8: #724539;
      --simple-colors-fixed-theme-accent-9: #5b3328;
      --simple-colors-fixed-theme-accent-10: #3b1e15;
      --simple-colors-fixed-theme-accent-11: #2c140e;
      --simple-colors-fixed-theme-accent-12: #200e09;
    }

    :host([dark][accent-color="brown"]),
    :host([dark]) [accent-color="brown"],
    :host([accent-color="brown"]) [dark],
    :host [dark][accent-color="brown"] {
      --simple-colors-default-theme-accent-1: #200e09;
      --simple-colors-default-theme-accent-2: #2c140e;
      --simple-colors-default-theme-accent-3: #3b1e15;
      --simple-colors-default-theme-accent-4: #5b3328;
      --simple-colors-default-theme-accent-5: #724539;
      --simple-colors-default-theme-accent-6: #85574a;
      --simple-colors-default-theme-accent-7: #a47060;
      --simple-colors-default-theme-accent-8: #ac7868;
      --simple-colors-default-theme-accent-9: #b68373;
      --simple-colors-default-theme-accent-10: #c59485;
      --simple-colors-default-theme-accent-11: #e5b8aa;
      --simple-colors-default-theme-accent-12: #f0e2de;
    }

    :host([accent-color="blue-grey"]),
    :host [accent-color="blue-grey"] {
      --simple-colors-default-theme-accent-1: #e7eff1;
      --simple-colors-default-theme-accent-2: #b1c5ce;
      --simple-colors-default-theme-accent-3: #9badb6;
      --simple-colors-default-theme-accent-4: #8d9fa7;
      --simple-colors-default-theme-accent-5: #7a8f98;
      --simple-colors-default-theme-accent-6: #718892;
      --simple-colors-default-theme-accent-7: #56707c;
      --simple-colors-default-theme-accent-8: #40535b;
      --simple-colors-default-theme-accent-9: #2f3e45;
      --simple-colors-default-theme-accent-10: #1e282c;
      --simple-colors-default-theme-accent-11: #182023;
      --simple-colors-default-theme-accent-12: #0f1518;
      --simple-colors-fixed-theme-accent-1: #e7eff1;
      --simple-colors-fixed-theme-accent-2: #b1c5ce;
      --simple-colors-fixed-theme-accent-3: #9badb6;
      --simple-colors-fixed-theme-accent-4: #8d9fa7;
      --simple-colors-fixed-theme-accent-5: #7a8f98;
      --simple-colors-fixed-theme-accent-6: #718892;
      --simple-colors-fixed-theme-accent-7: #56707c;
      --simple-colors-fixed-theme-accent-8: #40535b;
      --simple-colors-fixed-theme-accent-9: #2f3e45;
      --simple-colors-fixed-theme-accent-10: #1e282c;
      --simple-colors-fixed-theme-accent-11: #182023;
      --simple-colors-fixed-theme-accent-12: #0f1518;
    }

    :host([dark][accent-color="blue-grey"]),
    :host([dark]) [accent-color="blue-grey"],
    :host([accent-color="blue-grey"]) [dark],
    :host [dark][accent-color="blue-grey"] {
      --simple-colors-default-theme-accent-1: #0f1518;
      --simple-colors-default-theme-accent-2: #182023;
      --simple-colors-default-theme-accent-3: #1e282c;
      --simple-colors-default-theme-accent-4: #2f3e45;
      --simple-colors-default-theme-accent-5: #40535b;
      --simple-colors-default-theme-accent-6: #56707c;
      --simple-colors-default-theme-accent-7: #718892;
      --simple-colors-default-theme-accent-8: #7a8f98;
      --simple-colors-default-theme-accent-9: #8d9fa7;
      --simple-colors-default-theme-accent-10: #9badb6;
      --simple-colors-default-theme-accent-11: #b1c5ce;
      --simple-colors-default-theme-accent-12: #e7eff1;
    }
  </style>
`;

StyleElement.appendChild(css);
StyleElement.register("simple-colors-shared-styles-polymer");

export { css };
