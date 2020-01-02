import { css } from "lit-element/lit-element.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
const materialCssStyles = css`
  .red {
    background-color: #f44336;
  }

  .red-text {
    color: #f44336;
  }

  .red.lighten-5 {
    background-color: #ffebee;
  }

  .red-text.text-lighten-5 {
    color: #ffebee;
  }

  .red.lighten-4 {
    background-color: #ffcdd2;
  }

  .red-text.text-lighten-4 {
    color: #ffcdd2;
  }

  .red.lighten-3 {
    background-color: #ef9a9a;
  }

  .red-text.text-lighten-3 {
    color: #ef9a9a;
  }

  .red.lighten-2 {
    background-color: #e57373;
  }

  .red-text.text-lighten-2 {
    color: #e57373;
  }

  .red.lighten-1 {
    background-color: #ef5350;
  }

  .red-text.text-lighten-1 {
    color: #ef5350;
  }

  .red.darken-1 {
    background-color: #e53935;
  }

  .red-text.text-darken-1 {
    color: #e53935;
  }

  .red.darken-2 {
    background-color: #d32f2f;
  }

  .red-text.text-darken-2 {
    color: #d32f2f;
  }

  .red.darken-3 {
    background-color: #c62828;
  }

  .red-text.text-darken-3 {
    color: #c62828;
  }

  .red.darken-4 {
    background-color: #b71c1c;
  }

  .red-text.text-darken-4 {
    color: #b71c1c;
  }

  .red.accent-1 {
    background-color: #ff8a80;
  }

  .red-text.text-accent-1 {
    color: #ff8a80;
  }

  .red.accent-2 {
    background-color: #ff5252;
  }

  .red-text.text-accent-2 {
    color: #ff5252;
  }

  .red.accent-3 {
    background-color: #ff1744;
  }

  .red-text.text-accent-3 {
    color: #ff1744;
  }

  .red.accent-4 {
    background-color: #d50000;
  }

  .red-text.text-accent-4 {
    color: #d50000;
  }

  .pink {
    background-color: #e91e63;
  }

  .pink-text {
    color: #e91e63;
  }

  .pink.lighten-5 {
    background-color: #fce4ec;
  }

  .pink-text.text-lighten-5 {
    color: #fce4ec;
  }

  .pink.lighten-4 {
    background-color: #f8bbd0;
  }

  .pink-text.text-lighten-4 {
    color: #f8bbd0;
  }

  .pink.lighten-3 {
    background-color: #f48fb1;
  }

  .pink-text.text-lighten-3 {
    color: #f48fb1;
  }

  .pink.lighten-2 {
    background-color: #f06292;
  }

  .pink-text.text-lighten-2 {
    color: #f06292;
  }

  .pink.lighten-1 {
    background-color: #ec407a;
  }

  .pink-text.text-lighten-1 {
    color: #ec407a;
  }

  .pink.darken-1 {
    background-color: #d81b60;
  }

  .pink-text.text-darken-1 {
    color: #d81b60;
  }

  .pink.darken-2 {
    background-color: #c2185b;
  }

  .pink-text.text-darken-2 {
    color: #c2185b;
  }

  .pink.darken-3 {
    background-color: #ad1457;
  }

  .pink-text.text-darken-3 {
    color: #ad1457;
  }

  .pink.darken-4 {
    background-color: #880e4f;
  }

  .pink-text.text-darken-4 {
    color: #880e4f;
  }

  .pink.accent-1 {
    background-color: #ff80ab;
  }

  .pink-text.text-accent-1 {
    color: #ff80ab;
  }

  .pink.accent-2 {
    background-color: #ff4081;
  }

  .pink-text.text-accent-2 {
    color: #ff4081;
  }

  .pink.accent-3 {
    background-color: #f50057;
  }

  .pink-text.text-accent-3 {
    color: #f50057;
  }

  .pink.accent-4 {
    background-color: #c51162;
  }

  .pink-text.text-accent-4 {
    color: #c51162;
  }

  .purple {
    background-color: #9c27b0;
  }

  .purple-text {
    color: #9c27b0;
  }

  .purple.lighten-5 {
    background-color: #f3e5f5;
  }

  .purple-text.text-lighten-5 {
    color: #f3e5f5;
  }

  .purple.lighten-4 {
    background-color: #e1bee7;
  }

  .purple-text.text-lighten-4 {
    color: #e1bee7;
  }

  .purple.lighten-3 {
    background-color: #ce93d8;
  }

  .purple-text.text-lighten-3 {
    color: #ce93d8;
  }

  .purple.lighten-2 {
    background-color: #ba68c8;
  }

  .purple-text.text-lighten-2 {
    color: #ba68c8;
  }

  .purple.lighten-1 {
    background-color: #ab47bc;
  }

  .purple-text.text-lighten-1 {
    color: #ab47bc;
  }

  .purple.darken-1 {
    background-color: #8e24aa;
  }

  .purple-text.text-darken-1 {
    color: #8e24aa;
  }

  .purple.darken-2 {
    background-color: #7b1fa2;
  }

  .purple-text.text-darken-2 {
    color: #7b1fa2;
  }

  .purple.darken-3 {
    background-color: #6a1b9a;
  }

  .purple-text.text-darken-3 {
    color: #6a1b9a;
  }

  .purple.darken-4 {
    background-color: #4a148c;
  }

  .purple-text.text-darken-4 {
    color: #4a148c;
  }

  .purple.accent-1 {
    background-color: #ea80fc;
  }

  .purple-text.text-accent-1 {
    color: #ea80fc;
  }

  .purple.accent-2 {
    background-color: #e040fb;
  }

  .purple-text.text-accent-2 {
    color: #e040fb;
  }

  .purple.accent-3 {
    background-color: #d500f9;
  }

  .purple-text.text-accent-3 {
    color: #d500f9;
  }

  .purple.accent-4 {
    background-color: #aa00ff;
  }

  .purple-text.text-accent-4 {
    color: #aa00ff;
  }

  .deep-purple {
    background-color: #673ab7;
  }

  .deep-purple-text {
    color: #673ab7;
  }

  .deep-purple.lighten-5 {
    background-color: #ede7f6;
  }

  .deep-purple-text.text-lighten-5 {
    color: #ede7f6;
  }

  .deep-purple.lighten-4 {
    background-color: #d1c4e9;
  }

  .deep-purple-text.text-lighten-4 {
    color: #d1c4e9;
  }

  .deep-purple.lighten-3 {
    background-color: #b39ddb;
  }

  .deep-purple-text.text-lighten-3 {
    color: #b39ddb;
  }

  .deep-purple.lighten-2 {
    background-color: #9575cd;
  }

  .deep-purple-text.text-lighten-2 {
    color: #9575cd;
  }

  .deep-purple.lighten-1 {
    background-color: #7e57c2;
  }

  .deep-purple-text.text-lighten-1 {
    color: #7e57c2;
  }

  .deep-purple.darken-1 {
    background-color: #5e35b1;
  }

  .deep-purple-text.text-darken-1 {
    color: #5e35b1;
  }

  .deep-purple.darken-2 {
    background-color: #512da8;
  }

  .deep-purple-text.text-darken-2 {
    color: #512da8;
  }

  .deep-purple.darken-3 {
    background-color: #4527a0;
  }

  .deep-purple-text.text-darken-3 {
    color: #4527a0;
  }

  .deep-purple.darken-4 {
    background-color: #311b92;
  }

  .deep-purple-text.text-darken-4 {
    color: #311b92;
  }

  .deep-purple.accent-1 {
    background-color: #b388ff;
  }

  .deep-purple-text.text-accent-1 {
    color: #b388ff;
  }

  .deep-purple.accent-2 {
    background-color: #7c4dff;
  }

  .deep-purple-text.text-accent-2 {
    color: #7c4dff;
  }

  .deep-purple.accent-3 {
    background-color: #651fff;
  }

  .deep-purple-text.text-accent-3 {
    color: #651fff;
  }

  .deep-purple.accent-4 {
    background-color: #6200ea;
  }

  .deep-purple-text.text-accent-4 {
    color: #6200ea;
  }

  .indigo {
    background-color: #3f51b5;
  }

  .indigo-text {
    color: #3f51b5;
  }

  .indigo.lighten-5 {
    background-color: #e8eaf6;
  }

  .indigo-text.text-lighten-5 {
    color: #e8eaf6;
  }

  .indigo.lighten-4 {
    background-color: #c5cae9;
  }

  .indigo-text.text-lighten-4 {
    color: #c5cae9;
  }

  .indigo.lighten-3 {
    background-color: #9fa8da;
  }

  .indigo-text.text-lighten-3 {
    color: #9fa8da;
  }

  .indigo.lighten-2 {
    background-color: #7986cb;
  }

  .indigo-text.text-lighten-2 {
    color: #7986cb;
  }

  .indigo.lighten-1 {
    background-color: #5c6bc0;
  }

  .indigo-text.text-lighten-1 {
    color: #5c6bc0;
  }

  .indigo.darken-1 {
    background-color: #3949ab;
  }

  .indigo-text.text-darken-1 {
    color: #3949ab;
  }

  .indigo.darken-2 {
    background-color: #303f9f;
  }

  .indigo-text.text-darken-2 {
    color: #303f9f;
  }

  .indigo.darken-3 {
    background-color: #283593;
  }

  .indigo-text.text-darken-3 {
    color: #283593;
  }

  .indigo.darken-4 {
    background-color: #1a237e;
  }

  .indigo-text.text-darken-4 {
    color: #1a237e;
  }

  .indigo.accent-1 {
    background-color: #8c9eff;
  }

  .indigo-text.text-accent-1 {
    color: #8c9eff;
  }

  .indigo.accent-2 {
    background-color: #536dfe;
  }

  .indigo-text.text-accent-2 {
    color: #536dfe;
  }

  .indigo.accent-3 {
    background-color: #3d5afe;
  }

  .indigo-text.text-accent-3 {
    color: #3d5afe;
  }

  .indigo.accent-4 {
    background-color: #304ffe;
  }

  .indigo-text.text-accent-4 {
    color: #304ffe;
  }

  .blue {
    background-color: #2196f3;
  }

  .blue-text {
    color: #2196f3;
  }

  .blue.lighten-5 {
    background-color: #e3f2fd;
  }

  .blue-text.text-lighten-5 {
    color: #e3f2fd;
  }

  .blue.lighten-4 {
    background-color: #bbdefb;
  }

  .blue-text.text-lighten-4 {
    color: #bbdefb;
  }

  .blue.lighten-3 {
    background-color: #90caf9;
  }

  .blue-text.text-lighten-3 {
    color: #90caf9;
  }

  .blue.lighten-2 {
    background-color: #64b5f6;
  }

  .blue-text.text-lighten-2 {
    color: #64b5f6;
  }

  .blue.lighten-1 {
    background-color: #42a5f5;
  }

  .blue-text.text-lighten-1 {
    color: #42a5f5;
  }

  .blue.darken-1 {
    background-color: #1e88e5;
  }

  .blue-text.text-darken-1 {
    color: #1e88e5;
  }

  .blue.darken-2 {
    background-color: #1976d2;
  }

  .blue-text.text-darken-2 {
    color: #1976d2;
  }

  .blue.darken-3 {
    background-color: #1565c0;
  }

  .blue-text.text-darken-3 {
    color: #1565c0;
  }

  .blue.darken-4 {
    background-color: #0d47a1;
  }

  .blue-text.text-darken-4 {
    color: #0d47a1;
  }

  .blue.accent-1 {
    background-color: #82b1ff;
  }

  .blue-text.text-accent-1 {
    color: #82b1ff;
  }

  .blue.accent-2 {
    background-color: #448aff;
  }

  .blue-text.text-accent-2 {
    color: #448aff;
  }

  .blue.accent-3 {
    background-color: #2979ff;
  }

  .blue-text.text-accent-3 {
    color: #2979ff;
  }

  .blue.accent-4 {
    background-color: #2962ff;
  }

  .blue-text.text-accent-4 {
    color: #2962ff;
  }

  .light-blue {
    background-color: #03a9f4;
  }

  .light-blue-text {
    color: #03a9f4;
  }

  .light-blue.lighten-5 {
    background-color: #e1f5fe;
  }

  .light-blue-text.text-lighten-5 {
    color: #e1f5fe;
  }

  .light-blue.lighten-4 {
    background-color: #b3e5fc;
  }

  .light-blue-text.text-lighten-4 {
    color: #b3e5fc;
  }

  .light-blue.lighten-3 {
    background-color: #81d4fa;
  }

  .light-blue-text.text-lighten-3 {
    color: #81d4fa;
  }

  .light-blue.lighten-2 {
    background-color: #4fc3f7;
  }

  .light-blue-text.text-lighten-2 {
    color: #4fc3f7;
  }

  .light-blue.lighten-1 {
    background-color: #29b6f6;
  }

  .light-blue-text.text-lighten-1 {
    color: #29b6f6;
  }

  .light-blue.darken-1 {
    background-color: #039be5;
  }

  .light-blue-text.text-darken-1 {
    color: #039be5;
  }

  .light-blue.darken-2 {
    background-color: #0288d1;
  }

  .light-blue-text.text-darken-2 {
    color: #0288d1;
  }

  .light-blue.darken-3 {
    background-color: #0277bd;
  }

  .light-blue-text.text-darken-3 {
    color: #0277bd;
  }

  .light-blue.darken-4 {
    background-color: #01579b;
  }

  .light-blue-text.text-darken-4 {
    color: #01579b;
  }

  .light-blue.accent-1 {
    background-color: #80d8ff;
  }

  .light-blue-text.text-accent-1 {
    color: #80d8ff;
  }

  .light-blue.accent-2 {
    background-color: #40c4ff;
  }

  .light-blue-text.text-accent-2 {
    color: #40c4ff;
  }

  .light-blue.accent-3 {
    background-color: #00b0ff;
  }

  .light-blue-text.text-accent-3 {
    color: #00b0ff;
  }

  .light-blue.accent-4 {
    background-color: #0091ea;
  }

  .light-blue-text.text-accent-4 {
    color: #0091ea;
  }

  .cyan {
    background-color: #00bcd4;
  }

  .cyan-text {
    color: #00bcd4;
  }

  .cyan.lighten-5 {
    background-color: #e0f7fa;
  }

  .cyan-text.text-lighten-5 {
    color: #e0f7fa;
  }

  .cyan.lighten-4 {
    background-color: #b2ebf2;
  }

  .cyan-text.text-lighten-4 {
    color: #b2ebf2;
  }

  .cyan.lighten-3 {
    background-color: #80deea;
  }

  .cyan-text.text-lighten-3 {
    color: #80deea;
  }

  .cyan.lighten-2 {
    background-color: #4dd0e1;
  }

  .cyan-text.text-lighten-2 {
    color: #4dd0e1;
  }

  .cyan.lighten-1 {
    background-color: #26c6da;
  }

  .cyan-text.text-lighten-1 {
    color: #26c6da;
  }

  .cyan.darken-1 {
    background-color: #00acc1;
  }

  .cyan-text.text-darken-1 {
    color: #00acc1;
  }

  .cyan.darken-2 {
    background-color: #0097a7;
  }

  .cyan-text.text-darken-2 {
    color: #0097a7;
  }

  .cyan.darken-3 {
    background-color: #00838f;
  }

  .cyan-text.text-darken-3 {
    color: #00838f;
  }

  .cyan.darken-4 {
    background-color: #006064;
  }

  .cyan-text.text-darken-4 {
    color: #006064;
  }

  .cyan.accent-1 {
    background-color: #84ffff;
  }

  .cyan-text.text-accent-1 {
    color: #84ffff;
  }

  .cyan.accent-2 {
    background-color: #18ffff;
  }

  .cyan-text.text-accent-2 {
    color: #18ffff;
  }

  .cyan.accent-3 {
    background-color: #00e5ff;
  }

  .cyan-text.text-accent-3 {
    color: #00e5ff;
  }

  .cyan.accent-4 {
    background-color: #00b8d4;
  }

  .cyan-text.text-accent-4 {
    color: #00b8d4;
  }

  .teal {
    background-color: #009688;
  }

  .teal-text {
    color: #009688;
  }

  .teal.lighten-5 {
    background-color: #e0f2f1;
  }

  .teal-text.text-lighten-5 {
    color: #e0f2f1;
  }

  .teal.lighten-4 {
    background-color: #b2dfdb;
  }

  .teal-text.text-lighten-4 {
    color: #b2dfdb;
  }

  .teal.lighten-3 {
    background-color: #80cbc4;
  }

  .teal-text.text-lighten-3 {
    color: #80cbc4;
  }

  .teal.lighten-2 {
    background-color: #4db6ac;
  }

  .teal-text.text-lighten-2 {
    color: #4db6ac;
  }

  .teal.lighten-1 {
    background-color: #26a69a;
  }

  .teal-text.text-lighten-1 {
    color: #26a69a;
  }

  .teal.darken-1 {
    background-color: #00897b;
  }

  .teal-text.text-darken-1 {
    color: #00897b;
  }

  .teal.darken-2 {
    background-color: #00796b;
  }

  .teal-text.text-darken-2 {
    color: #00796b;
  }

  .teal.darken-3 {
    background-color: #00695c;
  }

  .teal-text.text-darken-3 {
    color: #00695c;
  }

  .teal.darken-4 {
    background-color: #004d40;
  }

  .teal-text.text-darken-4 {
    color: #004d40;
  }

  .teal.accent-1 {
    background-color: #a7ffeb;
  }

  .teal-text.text-accent-1 {
    color: #a7ffeb;
  }

  .teal.accent-2 {
    background-color: #64ffda;
  }

  .teal-text.text-accent-2 {
    color: #64ffda;
  }

  .teal.accent-3 {
    background-color: #1de9b6;
  }

  .teal-text.text-accent-3 {
    color: #1de9b6;
  }

  .teal.accent-4 {
    background-color: #00bfa5;
  }

  .teal-text.text-accent-4 {
    color: #00bfa5;
  }

  .green {
    background-color: #4caf50;
  }

  .green-text {
    color: #4caf50;
  }

  .green.lighten-5 {
    background-color: #e8f5e9;
  }

  .green-text.text-lighten-5 {
    color: #e8f5e9;
  }

  .green.lighten-4 {
    background-color: #c8e6c9;
  }

  .green-text.text-lighten-4 {
    color: #c8e6c9;
  }

  .green.lighten-3 {
    background-color: #a5d6a7;
  }

  .green-text.text-lighten-3 {
    color: #a5d6a7;
  }

  .green.lighten-2 {
    background-color: #81c784;
  }

  .green-text.text-lighten-2 {
    color: #81c784;
  }

  .green.lighten-1 {
    background-color: #66bb6a;
  }

  .green-text.text-lighten-1 {
    color: #66bb6a;
  }

  .green.darken-1 {
    background-color: #43a047;
  }

  .green-text.text-darken-1 {
    color: #43a047;
  }

  .green.darken-2 {
    background-color: #388e3c;
  }

  .green-text.text-darken-2 {
    color: #388e3c;
  }

  .green.darken-3 {
    background-color: #2e7d32;
  }

  .green-text.text-darken-3 {
    color: #2e7d32;
  }

  .green.darken-4 {
    background-color: #1b5e20;
  }

  .green-text.text-darken-4 {
    color: #1b5e20;
  }

  .green.accent-1 {
    background-color: #b9f6ca;
  }

  .green-text.text-accent-1 {
    color: #b9f6ca;
  }

  .green.accent-2 {
    background-color: #69f0ae;
  }

  .green-text.text-accent-2 {
    color: #69f0ae;
  }

  .green.accent-3 {
    background-color: #00e676;
  }

  .green-text.text-accent-3 {
    color: #00e676;
  }

  .green.accent-4 {
    background-color: #00c853;
  }

  .green-text.text-accent-4 {
    color: #00c853;
  }

  .light-green {
    background-color: #8bc34a;
  }

  .light-green-text {
    color: #8bc34a;
  }

  .light-green.lighten-5 {
    background-color: #f1f8e9;
  }

  .light-green-text.text-lighten-5 {
    color: #f1f8e9;
  }

  .light-green.lighten-4 {
    background-color: #dcedc8;
  }

  .light-green-text.text-lighten-4 {
    color: #dcedc8;
  }

  .light-green.lighten-3 {
    background-color: #c5e1a5;
  }

  .light-green-text.text-lighten-3 {
    color: #c5e1a5;
  }

  .light-green.lighten-2 {
    background-color: #aed581;
  }

  .light-green-text.text-lighten-2 {
    color: #aed581;
  }

  .light-green.lighten-1 {
    background-color: #9ccc65;
  }

  .light-green-text.text-lighten-1 {
    color: #9ccc65;
  }

  .light-green.darken-1 {
    background-color: #7cb342;
  }

  .light-green-text.text-darken-1 {
    color: #7cb342;
  }

  .light-green.darken-2 {
    background-color: #689f38;
  }

  .light-green-text.text-darken-2 {
    color: #689f38;
  }

  .light-green.darken-3 {
    background-color: #558b2f;
  }

  .light-green-text.text-darken-3 {
    color: #558b2f;
  }

  .light-green.darken-4 {
    background-color: #33691e;
  }

  .light-green-text.text-darken-4 {
    color: #33691e;
  }

  .light-green.accent-1 {
    background-color: #ccff90;
  }

  .light-green-text.text-accent-1 {
    color: #ccff90;
  }

  .light-green.accent-2 {
    background-color: #b2ff59;
  }

  .light-green-text.text-accent-2 {
    color: #b2ff59;
  }

  .light-green.accent-3 {
    background-color: #76ff03;
  }

  .light-green-text.text-accent-3 {
    color: #76ff03;
  }

  .light-green.accent-4 {
    background-color: #64dd17;
  }

  .light-green-text.text-accent-4 {
    color: #64dd17;
  }

  .lime {
    background-color: #cddc39;
  }

  .lime-text {
    color: #cddc39;
  }

  .lime.lighten-5 {
    background-color: #f9fbe7;
  }

  .lime-text.text-lighten-5 {
    color: #f9fbe7;
  }

  .lime.lighten-4 {
    background-color: #f0f4c3;
  }

  .lime-text.text-lighten-4 {
    color: #f0f4c3;
  }

  .lime.lighten-3 {
    background-color: #e6ee9c;
  }

  .lime-text.text-lighten-3 {
    color: #e6ee9c;
  }

  .lime.lighten-2 {
    background-color: #dce775;
  }

  .lime-text.text-lighten-2 {
    color: #dce775;
  }

  .lime.lighten-1 {
    background-color: #d4e157;
  }

  .lime-text.text-lighten-1 {
    color: #d4e157;
  }

  .lime.darken-1 {
    background-color: #c0ca33;
  }

  .lime-text.text-darken-1 {
    color: #c0ca33;
  }

  .lime.darken-2 {
    background-color: #afb42b;
  }

  .lime-text.text-darken-2 {
    color: #afb42b;
  }

  .lime.darken-3 {
    background-color: #9e9d24;
  }

  .lime-text.text-darken-3 {
    color: #9e9d24;
  }

  .lime.darken-4 {
    background-color: #827717;
  }

  .lime-text.text-darken-4 {
    color: #827717;
  }

  .lime.accent-1 {
    background-color: #f4ff81;
  }

  .lime-text.text-accent-1 {
    color: #f4ff81;
  }

  .lime.accent-2 {
    background-color: #eeff41;
  }

  .lime-text.text-accent-2 {
    color: #eeff41;
  }

  .lime.accent-3 {
    background-color: #c6ff00;
  }

  .lime-text.text-accent-3 {
    color: #c6ff00;
  }

  .lime.accent-4 {
    background-color: #aeea00;
  }

  .lime-text.text-accent-4 {
    color: #aeea00;
  }

  .yellow {
    background-color: #ffeb3b;
  }

  .yellow-text {
    color: #ffeb3b;
  }

  .yellow.lighten-5 {
    background-color: #fffde7;
  }

  .yellow-text.text-lighten-5 {
    color: #fffde7;
  }

  .yellow.lighten-4 {
    background-color: #fff9c4;
  }

  .yellow-text.text-lighten-4 {
    color: #fff9c4;
  }

  .yellow.lighten-3 {
    background-color: #fff59d;
  }

  .yellow-text.text-lighten-3 {
    color: #fff59d;
  }

  .yellow.lighten-2 {
    background-color: #fff176;
  }

  .yellow-text.text-lighten-2 {
    color: #fff176;
  }

  .yellow.lighten-1 {
    background-color: #ffee58;
  }

  .yellow-text.text-lighten-1 {
    color: #ffee58;
  }

  .yellow.darken-1 {
    background-color: #fdd835;
  }

  .yellow-text.text-darken-1 {
    color: #fdd835;
  }

  .yellow.darken-2 {
    background-color: #fbc02d;
  }

  .yellow-text.text-darken-2 {
    color: #fbc02d;
  }

  .yellow.darken-3 {
    background-color: #f9a825;
  }

  .yellow-text.text-darken-3 {
    color: #f9a825;
  }

  .yellow.darken-4 {
    background-color: #f57f17;
  }

  .yellow-text.text-darken-4 {
    color: #f57f17;
  }

  .yellow.accent-1 {
    background-color: #ffff8d;
  }

  .yellow-text.text-accent-1 {
    color: #ffff8d;
  }

  .yellow.accent-2 {
    background-color: #ffff00;
  }

  .yellow-text.text-accent-2 {
    color: #ffff00;
  }

  .yellow.accent-3 {
    background-color: #ffea00;
  }

  .yellow-text.text-accent-3 {
    color: #ffea00;
  }

  .yellow.accent-4 {
    background-color: #ffd600;
  }

  .yellow-text.text-accent-4 {
    color: #ffd600;
  }

  .amber {
    background-color: #ffc107;
  }

  .amber-text {
    color: #ffc107;
  }

  .amber.lighten-5 {
    background-color: #fff8e1;
  }

  .amber-text.text-lighten-5 {
    color: #fff8e1;
  }

  .amber.lighten-4 {
    background-color: #ffecb3;
  }

  .amber-text.text-lighten-4 {
    color: #ffecb3;
  }

  .amber.lighten-3 {
    background-color: #ffe082;
  }

  .amber-text.text-lighten-3 {
    color: #ffe082;
  }

  .amber.lighten-2 {
    background-color: #ffd54f;
  }

  .amber-text.text-lighten-2 {
    color: #ffd54f;
  }

  .amber.lighten-1 {
    background-color: #ffca28;
  }

  .amber-text.text-lighten-1 {
    color: #ffca28;
  }

  .amber.darken-1 {
    background-color: #ffb300;
  }

  .amber-text.text-darken-1 {
    color: #ffb300;
  }

  .amber.darken-2 {
    background-color: #ffa000;
  }

  .amber-text.text-darken-2 {
    color: #ffa000;
  }

  .amber.darken-3 {
    background-color: #ff8f00;
  }

  .amber-text.text-darken-3 {
    color: #ff8f00;
  }

  .amber.darken-4 {
    background-color: #ff6f00;
  }

  .amber-text.text-darken-4 {
    color: #ff6f00;
  }

  .amber.accent-1 {
    background-color: #ffe57f;
  }

  .amber-text.text-accent-1 {
    color: #ffe57f;
  }

  .amber.accent-2 {
    background-color: #ffd740;
  }

  .amber-text.text-accent-2 {
    color: #ffd740;
  }

  .amber.accent-3 {
    background-color: #ffc400;
  }

  .amber-text.text-accent-3 {
    color: #ffc400;
  }

  .amber.accent-4 {
    background-color: #ffab00;
  }

  .amber-text.text-accent-4 {
    color: #ffab00;
  }

  .orange {
    background-color: #ff9800;
  }

  .orange-text {
    color: #ff9800;
  }

  .orange.lighten-5 {
    background-color: #fff3e0;
  }

  .orange-text.text-lighten-5 {
    color: #fff3e0;
  }

  .orange.lighten-4 {
    background-color: #ffe0b2;
  }

  .orange-text.text-lighten-4 {
    color: #ffe0b2;
  }

  .orange.lighten-3 {
    background-color: #ffcc80;
  }

  .orange-text.text-lighten-3 {
    color: #ffcc80;
  }

  .orange.lighten-2 {
    background-color: #ffb74d;
  }

  .orange-text.text-lighten-2 {
    color: #ffb74d;
  }

  .orange.lighten-1 {
    background-color: #ffa726;
  }

  .orange-text.text-lighten-1 {
    color: #ffa726;
  }

  .orange.darken-1 {
    background-color: #fb8c00;
  }

  .orange-text.text-darken-1 {
    color: #fb8c00;
  }

  .orange.darken-2 {
    background-color: #f57c00;
  }

  .orange-text.text-darken-2 {
    color: #f57c00;
  }

  .orange.darken-3 {
    background-color: #ef6c00;
  }

  .orange-text.text-darken-3 {
    color: #ef6c00;
  }

  .orange.darken-4 {
    background-color: #e65100;
  }

  .orange-text.text-darken-4 {
    color: #e65100;
  }

  .orange.accent-1 {
    background-color: #ffd180;
  }

  .orange-text.text-accent-1 {
    color: #ffd180;
  }

  .orange.accent-2 {
    background-color: #ffab40;
  }

  .orange-text.text-accent-2 {
    color: #ffab40;
  }

  .orange.accent-3 {
    background-color: #ff9100;
  }

  .orange-text.text-accent-3 {
    color: #ff9100;
  }

  .orange.accent-4 {
    background-color: #ff6d00;
  }

  .orange-text.text-accent-4 {
    color: #ff6d00;
  }

  .deep-orange {
    background-color: #ff5722;
  }

  .deep-orange-text {
    color: #ff5722;
  }

  .deep-orange.lighten-5 {
    background-color: #fbe9e7;
  }

  .deep-orange-text.text-lighten-5 {
    color: #fbe9e7;
  }

  .deep-orange.lighten-4 {
    background-color: #ffccbc;
  }

  .deep-orange-text.text-lighten-4 {
    color: #ffccbc;
  }

  .deep-orange.lighten-3 {
    background-color: #ffab91;
  }

  .deep-orange-text.text-lighten-3 {
    color: #ffab91;
  }

  .deep-orange.lighten-2 {
    background-color: #ff8a65;
  }

  .deep-orange-text.text-lighten-2 {
    color: #ff8a65;
  }

  .deep-orange.lighten-1 {
    background-color: #ff7043;
  }

  .deep-orange-text.text-lighten-1 {
    color: #ff7043;
  }

  .deep-orange.darken-1 {
    background-color: #f4511e;
  }

  .deep-orange-text.text-darken-1 {
    color: #f4511e;
  }

  .deep-orange.darken-2 {
    background-color: #e64a19;
  }

  .deep-orange-text.text-darken-2 {
    color: #e64a19;
  }

  .deep-orange.darken-3 {
    background-color: #d84315;
  }

  .deep-orange-text.text-darken-3 {
    color: #d84315;
  }

  .deep-orange.darken-4 {
    background-color: #bf360c;
  }

  .deep-orange-text.text-darken-4 {
    color: #bf360c;
  }

  .deep-orange.accent-1 {
    background-color: #ff9e80;
  }

  .deep-orange-text.text-accent-1 {
    color: #ff9e80;
  }

  .deep-orange.accent-2 {
    background-color: #ff6e40;
  }

  .deep-orange-text.text-accent-2 {
    color: #ff6e40;
  }

  .deep-orange.accent-3 {
    background-color: #ff3d00;
  }

  .deep-orange-text.text-accent-3 {
    color: #ff3d00;
  }

  .deep-orange.accent-4 {
    background-color: #dd2c00;
  }

  .deep-orange-text.text-accent-4 {
    color: #dd2c00;
  }

  .brown {
    background-color: #795548;
  }

  .brown-text {
    color: #795548;
  }

  .brown.lighten-5 {
    background-color: #efebe9;
  }

  .brown-text.text-lighten-5 {
    color: #efebe9;
  }

  .brown.lighten-4 {
    background-color: #d7ccc8;
  }

  .brown-text.text-lighten-4 {
    color: #d7ccc8;
  }

  .brown.lighten-3 {
    background-color: #bcaaa4;
  }

  .brown-text.text-lighten-3 {
    color: #bcaaa4;
  }

  .brown.lighten-2 {
    background-color: #a1887f;
  }

  .brown-text.text-lighten-2 {
    color: #a1887f;
  }

  .brown.lighten-1 {
    background-color: #8d6e63;
  }

  .brown-text.text-lighten-1 {
    color: #8d6e63;
  }

  .brown.darken-1 {
    background-color: #6d4c41;
  }

  .brown-text.text-darken-1 {
    color: #6d4c41;
  }

  .brown.darken-2 {
    background-color: #5d4037;
  }

  .brown-text.text-darken-2 {
    color: #5d4037;
  }

  .brown.darken-3 {
    background-color: #4e342e;
  }

  .brown-text.text-darken-3 {
    color: #4e342e;
  }

  .brown.darken-4 {
    background-color: #3e2723;
  }

  .brown-text.text-darken-4 {
    color: #3e2723;
  }

  .blue-grey {
    background-color: #607d8b;
  }

  .blue-grey-text {
    color: #607d8b;
  }

  .blue-grey.lighten-5 {
    background-color: #eceff1;
  }

  .blue-grey-text.text-lighten-5 {
    color: #eceff1;
  }

  .blue-grey.lighten-4 {
    background-color: #cfd8dc;
  }

  .blue-grey-text.text-lighten-4 {
    color: #cfd8dc;
  }

  .blue-grey.lighten-3 {
    background-color: #b0bec5;
  }

  .blue-grey-text.text-lighten-3 {
    color: #b0bec5;
  }

  .blue-grey.lighten-2 {
    background-color: #90a4ae;
  }

  .blue-grey-text.text-lighten-2 {
    color: #90a4ae;
  }

  .blue-grey.lighten-1 {
    background-color: #78909c;
  }

  .blue-grey-text.text-lighten-1 {
    color: #78909c;
  }

  .blue-grey.darken-1 {
    background-color: #546e7a;
  }

  .blue-grey-text.text-darken-1 {
    color: #546e7a;
  }

  .blue-grey.darken-2 {
    background-color: #455a64;
  }

  .blue-grey-text.text-darken-2 {
    color: #455a64;
  }

  .blue-grey.darken-3 {
    background-color: #37474f;
  }

  .blue-grey-text.text-darken-3 {
    color: #37474f;
  }

  .blue-grey.darken-4 {
    background-color: #263238;
  }

  .blue-grey-text.text-darken-4 {
    color: #263238;
  }

  .grey {
    background-color: #9e9e9e;
  }

  .grey-text {
    color: #9e9e9e;
  }

  .grey.lighten-5 {
    background-color: #fafafa;
  }

  .grey-text.text-lighten-5 {
    color: #fafafa;
  }

  .grey.lighten-4 {
    background-color: #f5f5f5;
  }

  .grey-text.text-lighten-4 {
    color: #f5f5f5;
  }

  .grey.lighten-3 {
    background-color: #eeeeee;
  }

  .grey-text.text-lighten-3 {
    color: #eeeeee;
  }

  .grey.lighten-2 {
    background-color: #e0e0e0;
  }

  .grey-text.text-lighten-2 {
    color: #e0e0e0;
  }

  .grey.lighten-1 {
    background-color: #bdbdbd;
  }

  .grey-text.text-lighten-1 {
    color: #bdbdbd;
  }

  .grey.darken-1 {
    background-color: #757575;
  }

  .grey-text.text-darken-1 {
    color: #757575;
  }

  .grey.darken-2 {
    background-color: #616161;
  }

  .grey-text.text-darken-2 {
    color: #616161;
  }

  .grey.darken-3 {
    background-color: #424242;
  }

  .grey-text.text-darken-3 {
    color: #424242;
  }

  .grey.darken-4 {
    background-color: #212121;
  }

  .grey-text.text-darken-4 {
    color: #212121;
  }

  .black {
    background-color: #000000;
  }

  .black-text {
    color: #000000;
  }

  .white {
    background-color: #ffffff;
  }

  .white-text {
    color: #ffffff;
  }

  .transparent {
    background-color: transparent;
  }

  .transparent-text {
    color: transparent;
  }

  /* Materialize Outline classes */
  .indigo-outline {
    outline-color: #3f51b5;
  }
  .blue-outline {
    outline-color: #2962ff;
  }
  .amber-outline {
    outline-color: #ffab00;
  }
  .green-border {
    outline-color: #4caf50;
  }
  .teal-outline {
    outline-color: #00bfa5;
  }
  .yellow-outline {
    outline-color: #ffd600;
  }
  .grey-outline {
    outline-color: #212121;
  }
  .cyan-outline {
    outline-color: #00b8d4;
  }
  .orange-outline {
    outline-color: #ff6d00;
  }
  .red-outline {
    outline-color: #d50000;
  }
  .deep-orange-outline {
    outline-color: #dd2c00;
  }
  .lime-outline {
    outline-color: #aeea00;
  }
  .pink-outline {
    outline-color: #c51162;
  }
  .purple-outline {
    outline-color: #aa00ff;
  }
  .light-green-outline {
    outline-color: #64dd17;
  }
  .light-blue-outline {
    outline-color: #01579b;
  }
  .white-outline {
    outline-color: #ffffff;
  }

  /* Materialize Border classes */
  .indigo-border {
    border-color: #3f51b5;
  }
  .blue-border {
    border-color: #2196f3;
  }
  .amber-border {
    border-color: #ffc107;
  }
  .green-border {
    border-color: #4caf50;
  }
  .teal-border {
    border-color: #009688;
  }
  .yellow-border {
    border-color: #ffeb3b;
  }
  .grey-border {
    border-color: #9e9e9e;
  }
  .cyan-border {
    border-color: #00bcd4;
  }
  .orange-border {
    border-color: #ff9800;
  }
  .red-border {
    border-color: #f44336;
  }
  .deep-orange-border {
    border-color: #ff5722;
  }
  .lime-border {
    border-color: #cddc39;
  }
  .pink-border {
    border-color: #e91e63;
  }
  .purple-border {
    border-color: #9c27b0;
  }
  .light-green-border {
    border-color: #8bc34a;
  }
  .light-blue-border {
    border-color: #03a9f4;
  }
  .white-border {
    border-color: #ffffff;
  }
  /* Materialize accessible text variants */
  .accessible-indigo-text {
    color: #1a237e;
  }
  .accessible-green-text {
    color: #1b5e20;
  }
  .accessible-purple-text {
    color: #581663;
  }
  .accessible-cyan-text {
    color: #006064;
  }
  .accessible-blue-text {
    color: #085390;
  }
  .accessible-deep-orange-text {
    color: #a72700;
  }
  .accessible-red-text {
    color: #a41309;
  }
  .accessible-amber-text {
    color: #833900;
  }
  .accessible-teal-text {
    color: #00554d;
  }
  .accessible-orange-text {
    color: #653c00;
  }
  .accessible-yellow-text {
    color: #463f00;
  }
  .accessible-lime-text {
    color: #474d0e;
  }
  .accessible-light-blue-text {
    color: #025277;
  }
  .accessible-light-green-text {
    color: #3c571d;
  }
  .accessible-pink-text {
    color: #9d0f3f;
  }
  .accessible-grey-text {
    color: #212121;
  }
`;
$_documentContainer.innerHTML = `<dom-module id="materializecss-styles-colors">
  <template>
    <custom-style>
    <style is="custom-style">
    .red {
      background-color: #F44336;
    }
    
    .red-text {
      color: #F44336;
    }
    
    .red.lighten-5 {
      background-color: #FFEBEE;
    }
    
    .red-text.text-lighten-5 {
      color: #FFEBEE;
    }
    
    .red.lighten-4 {
      background-color: #FFCDD2;
    }
    
    .red-text.text-lighten-4 {
      color: #FFCDD2;
    }
    
    .red.lighten-3 {
      background-color: #EF9A9A;
    }
    
    .red-text.text-lighten-3 {
      color: #EF9A9A;
    }
    
    .red.lighten-2 {
      background-color: #E57373;
    }
    
    .red-text.text-lighten-2 {
      color: #E57373;
    }
    
    .red.lighten-1 {
      background-color: #EF5350;
    }
    
    .red-text.text-lighten-1 {
      color: #EF5350;
    }
    
    .red.darken-1 {
      background-color: #E53935;
    }
    
    .red-text.text-darken-1 {
      color: #E53935;
    }
    
    .red.darken-2 {
      background-color: #D32F2F;
    }
    
    .red-text.text-darken-2 {
      color: #D32F2F;
    }
    
    .red.darken-3 {
      background-color: #C62828;
    }
    
    .red-text.text-darken-3 {
      color: #C62828;
    }
    
    .red.darken-4 {
      background-color: #B71C1C;
    }
    
    .red-text.text-darken-4 {
      color: #B71C1C;
    }
    
    .red.accent-1 {
      background-color: #FF8A80;
    }
    
    .red-text.text-accent-1 {
      color: #FF8A80;
    }
    
    .red.accent-2 {
      background-color: #FF5252;
    }
    
    .red-text.text-accent-2 {
      color: #FF5252;
    }
    
    .red.accent-3 {
      background-color: #FF1744;
    }
    
    .red-text.text-accent-3 {
      color: #FF1744;
    }
    
    .red.accent-4 {
      background-color: #D50000;
    }
    
    .red-text.text-accent-4 {
      color: #D50000;
    }
    
    .pink {
      background-color: #e91e63;
    }
    
    .pink-text {
      color: #e91e63;
    }
    
    .pink.lighten-5 {
      background-color: #fce4ec;
    }
    
    .pink-text.text-lighten-5 {
      color: #fce4ec;
    }
    
    .pink.lighten-4 {
      background-color: #f8bbd0;
    }
    
    .pink-text.text-lighten-4 {
      color: #f8bbd0;
    }
    
    .pink.lighten-3 {
      background-color: #f48fb1;
    }
    
    .pink-text.text-lighten-3 {
      color: #f48fb1;
    }
    
    .pink.lighten-2 {
      background-color: #f06292;
    }
    
    .pink-text.text-lighten-2 {
      color: #f06292;
    }
    
    .pink.lighten-1 {
      background-color: #ec407a;
    }
    
    .pink-text.text-lighten-1 {
      color: #ec407a;
    }
    
    .pink.darken-1 {
      background-color: #d81b60;
    }
    
    .pink-text.text-darken-1 {
      color: #d81b60;
    }
    
    .pink.darken-2 {
      background-color: #c2185b;
    }
    
    .pink-text.text-darken-2 {
      color: #c2185b;
    }
    
    .pink.darken-3 {
      background-color: #ad1457;
    }
    
    .pink-text.text-darken-3 {
      color: #ad1457;
    }
    
    .pink.darken-4 {
      background-color: #880e4f;
    }
    
    .pink-text.text-darken-4 {
      color: #880e4f;
    }
    
    .pink.accent-1 {
      background-color: #ff80ab;
    }
    
    .pink-text.text-accent-1 {
      color: #ff80ab;
    }
    
    .pink.accent-2 {
      background-color: #ff4081;
    }
    
    .pink-text.text-accent-2 {
      color: #ff4081;
    }
    
    .pink.accent-3 {
      background-color: #f50057;
    }
    
    .pink-text.text-accent-3 {
      color: #f50057;
    }
    
    .pink.accent-4 {
      background-color: #c51162;
    }
    
    .pink-text.text-accent-4 {
      color: #c51162;
    }
    
    .purple {
      background-color: #9c27b0;
    }
    
    .purple-text {
      color: #9c27b0;
    }
    
    .purple.lighten-5 {
      background-color: #f3e5f5;
    }
    
    .purple-text.text-lighten-5 {
      color: #f3e5f5;
    }
    
    .purple.lighten-4 {
      background-color: #e1bee7;
    }
    
    .purple-text.text-lighten-4 {
      color: #e1bee7;
    }
    
    .purple.lighten-3 {
      background-color: #ce93d8;
    }
    
    .purple-text.text-lighten-3 {
      color: #ce93d8;
    }
    
    .purple.lighten-2 {
      background-color: #ba68c8;
    }
    
    .purple-text.text-lighten-2 {
      color: #ba68c8;
    }
    
    .purple.lighten-1 {
      background-color: #ab47bc;
    }
    
    .purple-text.text-lighten-1 {
      color: #ab47bc;
    }
    
    .purple.darken-1 {
      background-color: #8e24aa;
    }
    
    .purple-text.text-darken-1 {
      color: #8e24aa;
    }
    
    .purple.darken-2 {
      background-color: #7b1fa2;
    }
    
    .purple-text.text-darken-2 {
      color: #7b1fa2;
    }
    
    .purple.darken-3 {
      background-color: #6a1b9a;
    }
    
    .purple-text.text-darken-3 {
      color: #6a1b9a;
    }
    
    .purple.darken-4 {
      background-color: #4a148c;
    }
    
    .purple-text.text-darken-4 {
      color: #4a148c;
    }
    
    .purple.accent-1 {
      background-color: #ea80fc;
    }
    
    .purple-text.text-accent-1 {
      color: #ea80fc;
    }
    
    .purple.accent-2 {
      background-color: #e040fb;
    }
    
    .purple-text.text-accent-2 {
      color: #e040fb;
    }
    
    .purple.accent-3 {
      background-color: #d500f9;
    }
    
    .purple-text.text-accent-3 {
      color: #d500f9;
    }
    
    .purple.accent-4 {
      background-color: #aa00ff;
    }
    
    .purple-text.text-accent-4 {
      color: #aa00ff;
    }
    
    .deep-purple {
      background-color: #673ab7;
    }
    
    .deep-purple-text {
      color: #673ab7;
    }
    
    .deep-purple.lighten-5 {
      background-color: #ede7f6;
    }
    
    .deep-purple-text.text-lighten-5 {
      color: #ede7f6;
    }
    
    .deep-purple.lighten-4 {
      background-color: #d1c4e9;
    }
    
    .deep-purple-text.text-lighten-4 {
      color: #d1c4e9;
    }
    
    .deep-purple.lighten-3 {
      background-color: #b39ddb;
    }
    
    .deep-purple-text.text-lighten-3 {
      color: #b39ddb;
    }
    
    .deep-purple.lighten-2 {
      background-color: #9575cd;
    }
    
    .deep-purple-text.text-lighten-2 {
      color: #9575cd;
    }
    
    .deep-purple.lighten-1 {
      background-color: #7e57c2;
    }
    
    .deep-purple-text.text-lighten-1 {
      color: #7e57c2;
    }
    
    .deep-purple.darken-1 {
      background-color: #5e35b1;
    }
    
    .deep-purple-text.text-darken-1 {
      color: #5e35b1;
    }
    
    .deep-purple.darken-2 {
      background-color: #512da8;
    }
    
    .deep-purple-text.text-darken-2 {
      color: #512da8;
    }
    
    .deep-purple.darken-3 {
      background-color: #4527a0;
    }
    
    .deep-purple-text.text-darken-3 {
      color: #4527a0;
    }
    
    .deep-purple.darken-4 {
      background-color: #311b92;
    }
    
    .deep-purple-text.text-darken-4 {
      color: #311b92;
    }
    
    .deep-purple.accent-1 {
      background-color: #b388ff;
    }
    
    .deep-purple-text.text-accent-1 {
      color: #b388ff;
    }
    
    .deep-purple.accent-2 {
      background-color: #7c4dff;
    }
    
    .deep-purple-text.text-accent-2 {
      color: #7c4dff;
    }
    
    .deep-purple.accent-3 {
      background-color: #651fff;
    }
    
    .deep-purple-text.text-accent-3 {
      color: #651fff;
    }
    
    .deep-purple.accent-4 {
      background-color: #6200ea;
    }
    
    .deep-purple-text.text-accent-4 {
      color: #6200ea;
    }
    
    .indigo {
      background-color: #3f51b5;
    }
    
    .indigo-text {
      color: #3f51b5;
    }
    
    .indigo.lighten-5 {
      background-color: #e8eaf6;
    }
    
    .indigo-text.text-lighten-5 {
      color: #e8eaf6;
    }
    
    .indigo.lighten-4 {
      background-color: #c5cae9;
    }
    
    .indigo-text.text-lighten-4 {
      color: #c5cae9;
    }
    
    .indigo.lighten-3 {
      background-color: #9fa8da;
    }
    
    .indigo-text.text-lighten-3 {
      color: #9fa8da;
    }
    
    .indigo.lighten-2 {
      background-color: #7986cb;
    }
    
    .indigo-text.text-lighten-2 {
      color: #7986cb;
    }
    
    .indigo.lighten-1 {
      background-color: #5c6bc0;
    }
    
    .indigo-text.text-lighten-1 {
      color: #5c6bc0;
    }
    
    .indigo.darken-1 {
      background-color: #3949ab;
    }
    
    .indigo-text.text-darken-1 {
      color: #3949ab;
    }
    
    .indigo.darken-2 {
      background-color: #303f9f;
    }
    
    .indigo-text.text-darken-2 {
      color: #303f9f;
    }
    
    .indigo.darken-3 {
      background-color: #283593;
    }
    
    .indigo-text.text-darken-3 {
      color: #283593;
    }
    
    .indigo.darken-4 {
      background-color: #1a237e;
    }
    
    .indigo-text.text-darken-4 {
      color: #1a237e;
    }
    
    .indigo.accent-1 {
      background-color: #8c9eff;
    }
    
    .indigo-text.text-accent-1 {
      color: #8c9eff;
    }
    
    .indigo.accent-2 {
      background-color: #536dfe;
    }
    
    .indigo-text.text-accent-2 {
      color: #536dfe;
    }
    
    .indigo.accent-3 {
      background-color: #3d5afe;
    }
    
    .indigo-text.text-accent-3 {
      color: #3d5afe;
    }
    
    .indigo.accent-4 {
      background-color: #304ffe;
    }
    
    .indigo-text.text-accent-4 {
      color: #304ffe;
    }
    
    .blue {
      background-color: #2196F3;
    }
    
    .blue-text {
      color: #2196F3;
    }
    
    .blue.lighten-5 {
      background-color: #E3F2FD;
    }
    
    .blue-text.text-lighten-5 {
      color: #E3F2FD;
    }
    
    .blue.lighten-4 {
      background-color: #BBDEFB;
    }
    
    .blue-text.text-lighten-4 {
      color: #BBDEFB;
    }
    
    .blue.lighten-3 {
      background-color: #90CAF9;
    }
    
    .blue-text.text-lighten-3 {
      color: #90CAF9;
    }
    
    .blue.lighten-2 {
      background-color: #64B5F6;
    }
    
    .blue-text.text-lighten-2 {
      color: #64B5F6;
    }
    
    .blue.lighten-1 {
      background-color: #42A5F5;
    }
    
    .blue-text.text-lighten-1 {
      color: #42A5F5;
    }
    
    .blue.darken-1 {
      background-color: #1E88E5;
    }
    
    .blue-text.text-darken-1 {
      color: #1E88E5;
    }
    
    .blue.darken-2 {
      background-color: #1976D2;
    }
    
    .blue-text.text-darken-2 {
      color: #1976D2;
    }
    
    .blue.darken-3 {
      background-color: #1565C0;
    }
    
    .blue-text.text-darken-3 {
      color: #1565C0;
    }
    
    .blue.darken-4 {
      background-color: #0D47A1;
    }
    
    .blue-text.text-darken-4 {
      color: #0D47A1;
    }
    
    .blue.accent-1 {
      background-color: #82B1FF;
    }
    
    .blue-text.text-accent-1 {
      color: #82B1FF;
    }
    
    .blue.accent-2 {
      background-color: #448AFF;
    }
    
    .blue-text.text-accent-2 {
      color: #448AFF;
    }
    
    .blue.accent-3 {
      background-color: #2979FF;
    }
    
    .blue-text.text-accent-3 {
      color: #2979FF;
    }
    
    .blue.accent-4 {
      background-color: #2962FF;
    }
    
    .blue-text.text-accent-4 {
      color: #2962FF;
    }
    
    .light-blue {
      background-color: #03a9f4;
    }
    
    .light-blue-text {
      color: #03a9f4;
    }
    
    .light-blue.lighten-5 {
      background-color: #e1f5fe;
    }
    
    .light-blue-text.text-lighten-5 {
      color: #e1f5fe;
    }
    
    .light-blue.lighten-4 {
      background-color: #b3e5fc;
    }
    
    .light-blue-text.text-lighten-4 {
      color: #b3e5fc;
    }
    
    .light-blue.lighten-3 {
      background-color: #81d4fa;
    }
    
    .light-blue-text.text-lighten-3 {
      color: #81d4fa;
    }
    
    .light-blue.lighten-2 {
      background-color: #4fc3f7;
    }
    
    .light-blue-text.text-lighten-2 {
      color: #4fc3f7;
    }
    
    .light-blue.lighten-1 {
      background-color: #29b6f6;
    }
    
    .light-blue-text.text-lighten-1 {
      color: #29b6f6;
    }
    
    .light-blue.darken-1 {
      background-color: #039be5;
    }
    
    .light-blue-text.text-darken-1 {
      color: #039be5;
    }
    
    .light-blue.darken-2 {
      background-color: #0288d1;
    }
    
    .light-blue-text.text-darken-2 {
      color: #0288d1;
    }
    
    .light-blue.darken-3 {
      background-color: #0277bd;
    }
    
    .light-blue-text.text-darken-3 {
      color: #0277bd;
    }
    
    .light-blue.darken-4 {
      background-color: #01579b;
    }
    
    .light-blue-text.text-darken-4 {
      color: #01579b;
    }
    
    .light-blue.accent-1 {
      background-color: #80d8ff;
    }
    
    .light-blue-text.text-accent-1 {
      color: #80d8ff;
    }
    
    .light-blue.accent-2 {
      background-color: #40c4ff;
    }
    
    .light-blue-text.text-accent-2 {
      color: #40c4ff;
    }
    
    .light-blue.accent-3 {
      background-color: #00b0ff;
    }
    
    .light-blue-text.text-accent-3 {
      color: #00b0ff;
    }
    
    .light-blue.accent-4 {
      background-color: #0091ea;
    }
    
    .light-blue-text.text-accent-4 {
      color: #0091ea;
    }
    
    .cyan {
      background-color: #00bcd4;
    }
    
    .cyan-text {
      color: #00bcd4;
    }
    
    .cyan.lighten-5 {
      background-color: #e0f7fa;
    }
    
    .cyan-text.text-lighten-5 {
      color: #e0f7fa;
    }
    
    .cyan.lighten-4 {
      background-color: #b2ebf2;
    }
    
    .cyan-text.text-lighten-4 {
      color: #b2ebf2;
    }
    
    .cyan.lighten-3 {
      background-color: #80deea;
    }
    
    .cyan-text.text-lighten-3 {
      color: #80deea;
    }
    
    .cyan.lighten-2 {
      background-color: #4dd0e1;
    }
    
    .cyan-text.text-lighten-2 {
      color: #4dd0e1;
    }
    
    .cyan.lighten-1 {
      background-color: #26c6da;
    }
    
    .cyan-text.text-lighten-1 {
      color: #26c6da;
    }
    
    .cyan.darken-1 {
      background-color: #00acc1;
    }
    
    .cyan-text.text-darken-1 {
      color: #00acc1;
    }
    
    .cyan.darken-2 {
      background-color: #0097a7;
    }
    
    .cyan-text.text-darken-2 {
      color: #0097a7;
    }
    
    .cyan.darken-3 {
      background-color: #00838f;
    }
    
    .cyan-text.text-darken-3 {
      color: #00838f;
    }
    
    .cyan.darken-4 {
      background-color: #006064;
    }
    
    .cyan-text.text-darken-4 {
      color: #006064;
    }
    
    .cyan.accent-1 {
      background-color: #84ffff;
    }
    
    .cyan-text.text-accent-1 {
      color: #84ffff;
    }
    
    .cyan.accent-2 {
      background-color: #18ffff;
    }
    
    .cyan-text.text-accent-2 {
      color: #18ffff;
    }
    
    .cyan.accent-3 {
      background-color: #00e5ff;
    }
    
    .cyan-text.text-accent-3 {
      color: #00e5ff;
    }
    
    .cyan.accent-4 {
      background-color: #00b8d4;
    }
    
    .cyan-text.text-accent-4 {
      color: #00b8d4;
    }
    
    .teal {
      background-color: #009688;
    }
    
    .teal-text {
      color: #009688;
    }
    
    .teal.lighten-5 {
      background-color: #e0f2f1;
    }
    
    .teal-text.text-lighten-5 {
      color: #e0f2f1;
    }
    
    .teal.lighten-4 {
      background-color: #b2dfdb;
    }
    
    .teal-text.text-lighten-4 {
      color: #b2dfdb;
    }
    
    .teal.lighten-3 {
      background-color: #80cbc4;
    }
    
    .teal-text.text-lighten-3 {
      color: #80cbc4;
    }
    
    .teal.lighten-2 {
      background-color: #4db6ac;
    }
    
    .teal-text.text-lighten-2 {
      color: #4db6ac;
    }
    
    .teal.lighten-1 {
      background-color: #26a69a;
    }
    
    .teal-text.text-lighten-1 {
      color: #26a69a;
    }
    
    .teal.darken-1 {
      background-color: #00897b;
    }
    
    .teal-text.text-darken-1 {
      color: #00897b;
    }
    
    .teal.darken-2 {
      background-color: #00796b;
    }
    
    .teal-text.text-darken-2 {
      color: #00796b;
    }
    
    .teal.darken-3 {
      background-color: #00695c;
    }
    
    .teal-text.text-darken-3 {
      color: #00695c;
    }
    
    .teal.darken-4 {
      background-color: #004d40;
    }
    
    .teal-text.text-darken-4 {
      color: #004d40;
    }
    
    .teal.accent-1 {
      background-color: #a7ffeb;
    }
    
    .teal-text.text-accent-1 {
      color: #a7ffeb;
    }
    
    .teal.accent-2 {
      background-color: #64ffda;
    }
    
    .teal-text.text-accent-2 {
      color: #64ffda;
    }
    
    .teal.accent-3 {
      background-color: #1de9b6;
    }
    
    .teal-text.text-accent-3 {
      color: #1de9b6;
    }
    
    .teal.accent-4 {
      background-color: #00bfa5;
    }
    
    .teal-text.text-accent-4 {
      color: #00bfa5;
    }
    
    .green {
      background-color: #4CAF50;
    }
    
    .green-text {
      color: #4CAF50;
    }
    
    .green.lighten-5 {
      background-color: #E8F5E9;
    }
    
    .green-text.text-lighten-5 {
      color: #E8F5E9;
    }
    
    .green.lighten-4 {
      background-color: #C8E6C9;
    }
    
    .green-text.text-lighten-4 {
      color: #C8E6C9;
    }
    
    .green.lighten-3 {
      background-color: #A5D6A7;
    }
    
    .green-text.text-lighten-3 {
      color: #A5D6A7;
    }
    
    .green.lighten-2 {
      background-color: #81C784;
    }
    
    .green-text.text-lighten-2 {
      color: #81C784;
    }
    
    .green.lighten-1 {
      background-color: #66BB6A;
    }
    
    .green-text.text-lighten-1 {
      color: #66BB6A;
    }
    
    .green.darken-1 {
      background-color: #43A047;
    }
    
    .green-text.text-darken-1 {
      color: #43A047;
    }
    
    .green.darken-2 {
      background-color: #388E3C;
    }
    
    .green-text.text-darken-2 {
      color: #388E3C;
    }
    
    .green.darken-3 {
      background-color: #2E7D32;
    }
    
    .green-text.text-darken-3 {
      color: #2E7D32;
    }
    
    .green.darken-4 {
      background-color: #1B5E20;
    }
    
    .green-text.text-darken-4 {
      color: #1B5E20;
    }
    
    .green.accent-1 {
      background-color: #B9F6CA;
    }
    
    .green-text.text-accent-1 {
      color: #B9F6CA;
    }
    
    .green.accent-2 {
      background-color: #69F0AE;
    }
    
    .green-text.text-accent-2 {
      color: #69F0AE;
    }
    
    .green.accent-3 {
      background-color: #00E676;
    }
    
    .green-text.text-accent-3 {
      color: #00E676;
    }
    
    .green.accent-4 {
      background-color: #00C853;
    }
    
    .green-text.text-accent-4 {
      color: #00C853;
    }
    
    .light-green {
      background-color: #8bc34a;
    }
    
    .light-green-text {
      color: #8bc34a;
    }
    
    .light-green.lighten-5 {
      background-color: #f1f8e9;
    }
    
    .light-green-text.text-lighten-5 {
      color: #f1f8e9;
    }
    
    .light-green.lighten-4 {
      background-color: #dcedc8;
    }
    
    .light-green-text.text-lighten-4 {
      color: #dcedc8;
    }
    
    .light-green.lighten-3 {
      background-color: #c5e1a5;
    }
    
    .light-green-text.text-lighten-3 {
      color: #c5e1a5;
    }
    
    .light-green.lighten-2 {
      background-color: #aed581;
    }
    
    .light-green-text.text-lighten-2 {
      color: #aed581;
    }
    
    .light-green.lighten-1 {
      background-color: #9ccc65;
    }
    
    .light-green-text.text-lighten-1 {
      color: #9ccc65;
    }
    
    .light-green.darken-1 {
      background-color: #7cb342;
    }
    
    .light-green-text.text-darken-1 {
      color: #7cb342;
    }
    
    .light-green.darken-2 {
      background-color: #689f38;
    }
    
    .light-green-text.text-darken-2 {
      color: #689f38;
    }
    
    .light-green.darken-3 {
      background-color: #558b2f;
    }
    
    .light-green-text.text-darken-3 {
      color: #558b2f;
    }
    
    .light-green.darken-4 {
      background-color: #33691e;
    }
    
    .light-green-text.text-darken-4 {
      color: #33691e;
    }
    
    .light-green.accent-1 {
      background-color: #ccff90;
    }
    
    .light-green-text.text-accent-1 {
      color: #ccff90;
    }
    
    .light-green.accent-2 {
      background-color: #b2ff59;
    }
    
    .light-green-text.text-accent-2 {
      color: #b2ff59;
    }
    
    .light-green.accent-3 {
      background-color: #76ff03;
    }
    
    .light-green-text.text-accent-3 {
      color: #76ff03;
    }
    
    .light-green.accent-4 {
      background-color: #64dd17;
    }
    
    .light-green-text.text-accent-4 {
      color: #64dd17;
    }
    
    .lime {
      background-color: #cddc39;
    }
    
    .lime-text {
      color: #cddc39;
    }
    
    .lime.lighten-5 {
      background-color: #f9fbe7;
    }
    
    .lime-text.text-lighten-5 {
      color: #f9fbe7;
    }
    
    .lime.lighten-4 {
      background-color: #f0f4c3;
    }
    
    .lime-text.text-lighten-4 {
      color: #f0f4c3;
    }
    
    .lime.lighten-3 {
      background-color: #e6ee9c;
    }
    
    .lime-text.text-lighten-3 {
      color: #e6ee9c;
    }
    
    .lime.lighten-2 {
      background-color: #dce775;
    }
    
    .lime-text.text-lighten-2 {
      color: #dce775;
    }
    
    .lime.lighten-1 {
      background-color: #d4e157;
    }
    
    .lime-text.text-lighten-1 {
      color: #d4e157;
    }
    
    .lime.darken-1 {
      background-color: #c0ca33;
    }
    
    .lime-text.text-darken-1 {
      color: #c0ca33;
    }
    
    .lime.darken-2 {
      background-color: #afb42b;
    }
    
    .lime-text.text-darken-2 {
      color: #afb42b;
    }
    
    .lime.darken-3 {
      background-color: #9e9d24;
    }
    
    .lime-text.text-darken-3 {
      color: #9e9d24;
    }
    
    .lime.darken-4 {
      background-color: #827717;
    }
    
    .lime-text.text-darken-4 {
      color: #827717;
    }
    
    .lime.accent-1 {
      background-color: #f4ff81;
    }
    
    .lime-text.text-accent-1 {
      color: #f4ff81;
    }
    
    .lime.accent-2 {
      background-color: #eeff41;
    }
    
    .lime-text.text-accent-2 {
      color: #eeff41;
    }
    
    .lime.accent-3 {
      background-color: #c6ff00;
    }
    
    .lime-text.text-accent-3 {
      color: #c6ff00;
    }
    
    .lime.accent-4 {
      background-color: #aeea00;
    }
    
    .lime-text.text-accent-4 {
      color: #aeea00;
    }
    
    .yellow {
      background-color: #ffeb3b;
    }
    
    .yellow-text {
      color: #ffeb3b;
    }
    
    .yellow.lighten-5 {
      background-color: #fffde7;
    }
    
    .yellow-text.text-lighten-5 {
      color: #fffde7;
    }
    
    .yellow.lighten-4 {
      background-color: #fff9c4;
    }
    
    .yellow-text.text-lighten-4 {
      color: #fff9c4;
    }
    
    .yellow.lighten-3 {
      background-color: #fff59d;
    }
    
    .yellow-text.text-lighten-3 {
      color: #fff59d;
    }
    
    .yellow.lighten-2 {
      background-color: #fff176;
    }
    
    .yellow-text.text-lighten-2 {
      color: #fff176;
    }
    
    .yellow.lighten-1 {
      background-color: #ffee58;
    }
    
    .yellow-text.text-lighten-1 {
      color: #ffee58;
    }
    
    .yellow.darken-1 {
      background-color: #fdd835;
    }
    
    .yellow-text.text-darken-1 {
      color: #fdd835;
    }
    
    .yellow.darken-2 {
      background-color: #fbc02d;
    }
    
    .yellow-text.text-darken-2 {
      color: #fbc02d;
    }
    
    .yellow.darken-3 {
      background-color: #f9a825;
    }
    
    .yellow-text.text-darken-3 {
      color: #f9a825;
    }
    
    .yellow.darken-4 {
      background-color: #f57f17;
    }
    
    .yellow-text.text-darken-4 {
      color: #f57f17;
    }
    
    .yellow.accent-1 {
      background-color: #ffff8d;
    }
    
    .yellow-text.text-accent-1 {
      color: #ffff8d;
    }
    
    .yellow.accent-2 {
      background-color: #ffff00;
    }
    
    .yellow-text.text-accent-2 {
      color: #ffff00;
    }
    
    .yellow.accent-3 {
      background-color: #ffea00;
    }
    
    .yellow-text.text-accent-3 {
      color: #ffea00;
    }
    
    .yellow.accent-4 {
      background-color: #ffd600;
    }
    
    .yellow-text.text-accent-4 {
      color: #ffd600;
    }
    
    .amber {
      background-color: #ffc107;
    }
    
    .amber-text {
      color: #ffc107;
    }
    
    .amber.lighten-5 {
      background-color: #fff8e1;
    }
    
    .amber-text.text-lighten-5 {
      color: #fff8e1;
    }
    
    .amber.lighten-4 {
      background-color: #ffecb3;
    }
    
    .amber-text.text-lighten-4 {
      color: #ffecb3;
    }
    
    .amber.lighten-3 {
      background-color: #ffe082;
    }
    
    .amber-text.text-lighten-3 {
      color: #ffe082;
    }
    
    .amber.lighten-2 {
      background-color: #ffd54f;
    }
    
    .amber-text.text-lighten-2 {
      color: #ffd54f;
    }
    
    .amber.lighten-1 {
      background-color: #ffca28;
    }
    
    .amber-text.text-lighten-1 {
      color: #ffca28;
    }
    
    .amber.darken-1 {
      background-color: #ffb300;
    }
    
    .amber-text.text-darken-1 {
      color: #ffb300;
    }
    
    .amber.darken-2 {
      background-color: #ffa000;
    }
    
    .amber-text.text-darken-2 {
      color: #ffa000;
    }
    
    .amber.darken-3 {
      background-color: #ff8f00;
    }
    
    .amber-text.text-darken-3 {
      color: #ff8f00;
    }
    
    .amber.darken-4 {
      background-color: #ff6f00;
    }
    
    .amber-text.text-darken-4 {
      color: #ff6f00;
    }
    
    .amber.accent-1 {
      background-color: #ffe57f;
    }
    
    .amber-text.text-accent-1 {
      color: #ffe57f;
    }
    
    .amber.accent-2 {
      background-color: #ffd740;
    }
    
    .amber-text.text-accent-2 {
      color: #ffd740;
    }
    
    .amber.accent-3 {
      background-color: #ffc400;
    }
    
    .amber-text.text-accent-3 {
      color: #ffc400;
    }
    
    .amber.accent-4 {
      background-color: #ffab00;
    }
    
    .amber-text.text-accent-4 {
      color: #ffab00;
    }
    
    .orange {
      background-color: #ff9800;
    }
    
    .orange-text {
      color: #ff9800;
    }
    
    .orange.lighten-5 {
      background-color: #fff3e0;
    }
    
    .orange-text.text-lighten-5 {
      color: #fff3e0;
    }
    
    .orange.lighten-4 {
      background-color: #ffe0b2;
    }
    
    .orange-text.text-lighten-4 {
      color: #ffe0b2;
    }
    
    .orange.lighten-3 {
      background-color: #ffcc80;
    }
    
    .orange-text.text-lighten-3 {
      color: #ffcc80;
    }
    
    .orange.lighten-2 {
      background-color: #ffb74d;
    }
    
    .orange-text.text-lighten-2 {
      color: #ffb74d;
    }
    
    .orange.lighten-1 {
      background-color: #ffa726;
    }
    
    .orange-text.text-lighten-1 {
      color: #ffa726;
    }
    
    .orange.darken-1 {
      background-color: #fb8c00;
    }
    
    .orange-text.text-darken-1 {
      color: #fb8c00;
    }
    
    .orange.darken-2 {
      background-color: #f57c00;
    }
    
    .orange-text.text-darken-2 {
      color: #f57c00;
    }
    
    .orange.darken-3 {
      background-color: #ef6c00;
    }
    
    .orange-text.text-darken-3 {
      color: #ef6c00;
    }
    
    .orange.darken-4 {
      background-color: #e65100;
    }
    
    .orange-text.text-darken-4 {
      color: #e65100;
    }
    
    .orange.accent-1 {
      background-color: #ffd180;
    }
    
    .orange-text.text-accent-1 {
      color: #ffd180;
    }
    
    .orange.accent-2 {
      background-color: #ffab40;
    }
    
    .orange-text.text-accent-2 {
      color: #ffab40;
    }
    
    .orange.accent-3 {
      background-color: #ff9100;
    }
    
    .orange-text.text-accent-3 {
      color: #ff9100;
    }
    
    .orange.accent-4 {
      background-color: #ff6d00;
    }
    
    .orange-text.text-accent-4 {
      color: #ff6d00;
    }
    
    .deep-orange {
      background-color: #ff5722;
    }
    
    .deep-orange-text {
      color: #ff5722;
    }
    
    .deep-orange.lighten-5 {
      background-color: #fbe9e7;
    }
    
    .deep-orange-text.text-lighten-5 {
      color: #fbe9e7;
    }
    
    .deep-orange.lighten-4 {
      background-color: #ffccbc;
    }
    
    .deep-orange-text.text-lighten-4 {
      color: #ffccbc;
    }
    
    .deep-orange.lighten-3 {
      background-color: #ffab91;
    }
    
    .deep-orange-text.text-lighten-3 {
      color: #ffab91;
    }
    
    .deep-orange.lighten-2 {
      background-color: #ff8a65;
    }
    
    .deep-orange-text.text-lighten-2 {
      color: #ff8a65;
    }
    
    .deep-orange.lighten-1 {
      background-color: #ff7043;
    }
    
    .deep-orange-text.text-lighten-1 {
      color: #ff7043;
    }
    
    .deep-orange.darken-1 {
      background-color: #f4511e;
    }
    
    .deep-orange-text.text-darken-1 {
      color: #f4511e;
    }
    
    .deep-orange.darken-2 {
      background-color: #e64a19;
    }
    
    .deep-orange-text.text-darken-2 {
      color: #e64a19;
    }
    
    .deep-orange.darken-3 {
      background-color: #d84315;
    }
    
    .deep-orange-text.text-darken-3 {
      color: #d84315;
    }
    
    .deep-orange.darken-4 {
      background-color: #bf360c;
    }
    
    .deep-orange-text.text-darken-4 {
      color: #bf360c;
    }
    
    .deep-orange.accent-1 {
      background-color: #ff9e80;
    }
    
    .deep-orange-text.text-accent-1 {
      color: #ff9e80;
    }
    
    .deep-orange.accent-2 {
      background-color: #ff6e40;
    }
    
    .deep-orange-text.text-accent-2 {
      color: #ff6e40;
    }
    
    .deep-orange.accent-3 {
      background-color: #ff3d00;
    }
    
    .deep-orange-text.text-accent-3 {
      color: #ff3d00;
    }
    
    .deep-orange.accent-4 {
      background-color: #dd2c00;
    }
    
    .deep-orange-text.text-accent-4 {
      color: #dd2c00;
    }
    
    .brown {
      background-color: #795548;
    }
    
    .brown-text {
      color: #795548;
    }
    
    .brown.lighten-5 {
      background-color: #efebe9;
    }
    
    .brown-text.text-lighten-5 {
      color: #efebe9;
    }
    
    .brown.lighten-4 {
      background-color: #d7ccc8;
    }
    
    .brown-text.text-lighten-4 {
      color: #d7ccc8;
    }
    
    .brown.lighten-3 {
      background-color: #bcaaa4;
    }
    
    .brown-text.text-lighten-3 {
      color: #bcaaa4;
    }
    
    .brown.lighten-2 {
      background-color: #a1887f;
    }
    
    .brown-text.text-lighten-2 {
      color: #a1887f;
    }
    
    .brown.lighten-1 {
      background-color: #8d6e63;
    }
    
    .brown-text.text-lighten-1 {
      color: #8d6e63;
    }
    
    .brown.darken-1 {
      background-color: #6d4c41;
    }
    
    .brown-text.text-darken-1 {
      color: #6d4c41;
    }
    
    .brown.darken-2 {
      background-color: #5d4037;
    }
    
    .brown-text.text-darken-2 {
      color: #5d4037;
    }
    
    .brown.darken-3 {
      background-color: #4e342e;
    }
    
    .brown-text.text-darken-3 {
      color: #4e342e;
    }
    
    .brown.darken-4 {
      background-color: #3e2723;
    }
    
    .brown-text.text-darken-4 {
      color: #3e2723;
    }
    
    .blue-grey {
      background-color: #607d8b;
    }
    
    .blue-grey-text {
      color: #607d8b;
    }
    
    .blue-grey.lighten-5 {
      background-color: #eceff1;
    }
    
    .blue-grey-text.text-lighten-5 {
      color: #eceff1;
    }
    
    .blue-grey.lighten-4 {
      background-color: #cfd8dc;
    }
    
    .blue-grey-text.text-lighten-4 {
      color: #cfd8dc;
    }
    
    .blue-grey.lighten-3 {
      background-color: #b0bec5;
    }
    
    .blue-grey-text.text-lighten-3 {
      color: #b0bec5;
    }
    
    .blue-grey.lighten-2 {
      background-color: #90a4ae;
    }
    
    .blue-grey-text.text-lighten-2 {
      color: #90a4ae;
    }
    
    .blue-grey.lighten-1 {
      background-color: #78909c;
    }
    
    .blue-grey-text.text-lighten-1 {
      color: #78909c;
    }
    
    .blue-grey.darken-1 {
      background-color: #546e7a;
    }
    
    .blue-grey-text.text-darken-1 {
      color: #546e7a;
    }
    
    .blue-grey.darken-2 {
      background-color: #455a64;
    }
    
    .blue-grey-text.text-darken-2 {
      color: #455a64;
    }
    
    .blue-grey.darken-3 {
      background-color: #37474f;
    }
    
    .blue-grey-text.text-darken-3 {
      color: #37474f;
    }
    
    .blue-grey.darken-4 {
      background-color: #263238;
    }
    
    .blue-grey-text.text-darken-4 {
      color: #263238;
    }
    
    .grey {
      background-color: #9e9e9e;
    }
    
    .grey-text {
      color: #9e9e9e;
    }
    
    .grey.lighten-5 {
      background-color: #fafafa;
    }
    
    .grey-text.text-lighten-5 {
      color: #fafafa;
    }
    
    .grey.lighten-4 {
      background-color: #f5f5f5;
    }
    
    .grey-text.text-lighten-4 {
      color: #f5f5f5;
    }
    
    .grey.lighten-3 {
      background-color: #eeeeee;
    }
    
    .grey-text.text-lighten-3 {
      color: #eeeeee;
    }
    
    .grey.lighten-2 {
      background-color: #e0e0e0;
    }
    
    .grey-text.text-lighten-2 {
      color: #e0e0e0;
    }
    
    .grey.lighten-1 {
      background-color: #bdbdbd;
    }
    
    .grey-text.text-lighten-1 {
      color: #bdbdbd;
    }
    
    .grey.darken-1 {
      background-color: #757575;
    }
    
    .grey-text.text-darken-1 {
      color: #757575;
    }
    
    .grey.darken-2 {
      background-color: #616161;
    }
    
    .grey-text.text-darken-2 {
      color: #616161;
    }
    
    .grey.darken-3 {
      background-color: #424242;
    }
    
    .grey-text.text-darken-3 {
      color: #424242;
    }
    
    .grey.darken-4 {
      background-color: #212121;
    }
    
    .grey-text.text-darken-4 {
      color: #212121;
    }
    
    .black {
      background-color: #000000;
    }
    
    .black-text {
      color: #000000;
    }
    
    .white {
      background-color: #FFFFFF;
    }
    
    .white-text {
      color: #FFFFFF;
    }
    
    .transparent {
      background-color: transparent;
    }
    
    .transparent-text {
      color: transparent;
    }
    
    /* Materialize Outline classes */
    .indigo-outline {
      outline-color: #3f51b5;
    }
    .blue-outline {
      outline-color: #2962ff;
    }
    .amber-outline {
      outline-color: #ffab00;
    }
    .green-border {
      outline-color: #4caf50;
    }
    .teal-outline {
      outline-color: #00bfa5;
    }
    .yellow-outline {
      outline-color: #ffd600;
    }
    .grey-outline {
      outline-color: #212121;
    }
    .cyan-outline {
      outline-color: #00b8d4;
    }
    .orange-outline {
      outline-color: #ff6d00;
    }
    .red-outline {
      outline-color: #d50000;
    }
    .deep-orange-outline {
      outline-color: #dd2c00;
    }
    .lime-outline {
      outline-color: #aeea00;
    }
    .pink-outline {
      outline-color: #c51162;
    }
    .purple-outline {
      outline-color: #aa00ff;
    }
    .light-green-outline {
      outline-color: #64dd17;
    }
    .light-blue-outline {
      outline-color: #01579b;
    }
    .white-outline {
      outline-color: #ffffff;
    }
    
    /* Materialize Border classes */
    .indigo-border {
      border-color: #3f51b5;
    }
    .blue-border {
      border-color: #2196F3;
    }
    .amber-border {
      border-color: #ffc107;
    }
    .green-border {
      border-color: #4caf50;
    }
    .teal-border {
      border-color: #009688;
    }
    .yellow-border {
      border-color: #ffeb3b;
    }
    .grey-border {
      border-color: #9e9e9e;
    }
    .cyan-border {
      border-color: #00bcd4;
    }
    .orange-border {
      border-color: #ff9800;
    }
    .red-border {
      border-color: #f44336;
    }
    .deep-orange-border {
      border-color: #ff5722;
    }
    .lime-border {
      border-color: #cddc39;
    }
    .pink-border {
      border-color: #e91e63;
    }
    .purple-border {
      border-color: #9c27b0;
    }
    .light-green-border {
      border-color: #8bc34a;
    }
    .light-blue-border {
      border-color: #03a9f4;
    }
    .white-border {
      border-color: #ffffff;
    }
    /* Materialize accessible text variants */
    .accessible-indigo-text {
      color: #1a237e;
    }
    .accessible-green-text {
      color: #1b5e20;
    }
    .accessible-purple-text {
      color: #581663;
    }
    .accessible-cyan-text {
      color: #006064;
    }
    .accessible-blue-text {
      color: #085390;
    }
    .accessible-deep-orange-text {
      color: #a72700;
    }
    .accessible-red-text {
      color: #a41309;
    }
    .accessible-amber-text {
      color: #833900;
    }
    .accessible-teal-text {
      color: #00554d;
    }
    .accessible-orange-text {
      color: #653c00;
    }
    .accessible-yellow-text {
      color: #463f00;
    }
    .accessible-lime-text {
      color: #474d0e;
    }
    .accessible-light-blue-text {
      color: #025277;
    }
    .accessible-light-green-text {
      color: #3c571d;
    }
    .accessible-pink-text {
      color: #9d0f3f;
    }
    .accessible-grey-text {
      color: #212121;
    }
    </style>
    </custom-style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer);
/**
`materializecss-styles`
Some styling helpers from the materializecss project

* @demo demo/index.html
*/
export { materialCssStyles };
