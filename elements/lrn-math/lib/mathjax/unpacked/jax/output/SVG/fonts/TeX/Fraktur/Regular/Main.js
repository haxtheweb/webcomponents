/*************************************************************
 *
 *  MathJax/jax/output/SVG/fonts/TeX/svg/Fraktur/Regular/Main.js
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
 *
 */

MathJax.OutputJax.SVG.FONTDATA.FONTS["MathJax_Fraktur"] = {
  directory: "Fraktur/Regular",
  family: "MathJax_Fraktur",
  id: "MJFRAK",
  Ranges: [
    [0x0, 0x7f, "BasicLatin"],
    [0x80, 0xdfff, "Other"],
    [0xe300, 0xe310, "PUA"]
  ]
};

MathJax.Ajax.loadComplete(
  MathJax.OutputJax.SVG.fontDir + "/Fraktur/Regular/Main.js"
);
