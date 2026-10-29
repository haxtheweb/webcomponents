/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Expressions and poses are drawn as cells on the same 22x28 grid as the art
 * files (cell col c, row r covers x = 3 + 5c, y = 2 + 5r, 5x5) so they can be
 * colored to match whichever skin the character has. Cells are "row.col.color"
 * where color "S" is the skin tone and the rest come from overlayColors.
 */
export const skinColors = [
  "#f7dece",
  "#f3d2a2",
  "#a7a7a7",
  "#d5ab88",
  "#af7e57",
  "#7c533e",
  "#ffdc5d",
  "#5db1ff",
  "#66de52",
  "#d772c7",
];

export const overlayColors = {
  K: "#000000",
  X: "#000000",
  t: "#64b5f6",
  r: "#e57373",
  z: "#90caf9",
  m: "#969696",
};

export const expressionArt = {
  happy: "13.8.K 13.11.K 14.9.K 14.10.K",
  sad: "13.6.t 13.9.K 13.10.K 14.8.K 14.11.K",
  surprised: "11.6.K 11.13.K 13.9.K 13.10.K 14.9.K 14.10.K",
  angry:
    "11.6.K 11.7.K 11.12.K 11.13.K 13.5.r 13.14.r 14.8.K 14.9.K 14.10.K 14.11.K",
  sleepy:
    "1.20.z 1.21.z 2.21.z 3.18.z 3.19.z 3.20.z 4.19.z 5.18.z 5.19.z 5.20.z 12.5.K 12.7.K 12.12.K 12.14.K 14.9.K 14.10.K",
  wink: "12.5.K 12.7.K 13.8.K 13.11.K 14.9.K 14.10.K",
};

// hide: which lowered arm(s) to clip out of the skin, shirt and outline
export const poseArt = {
  wave: {
    hide: ["right"],
    cells:
      "10.18.X 10.19.X 11.17.X 11.18.S 11.19.S 11.20.X 12.17.X 12.18.S 12.19.S 12.20.X 13.17.X 13.18.S 13.19.X 14.16.X 14.17.S 14.18.S 14.19.X 15.15.X 15.16.S 15.17.S 15.18.X 16.14.X 16.15.S 16.16.S 16.17.X 17.14.X 17.15.S 17.16.X 18.15.X 10.21.m 13.21.m",
  },
  cheer: {
    hide: ["right", "left"],
    cells:
      "6.0.X 6.1.X 6.19.X 6.20.X 7.0.S 7.1.S 7.2.X 7.18.X 7.19.S 7.20.S 7.21.X 8.0.S 8.1.S 8.2.X 8.18.X 8.19.S 8.20.S 8.21.X 9.0.X 9.1.S 9.2.X 9.18.X 9.19.S 9.20.X 10.0.X 10.1.S 10.2.X 10.18.X 10.19.S 10.20.X 11.0.X 11.1.S 11.2.X 11.18.X 11.19.S 11.20.X 12.0.X 12.1.S 12.2.S 12.3.X 12.17.X 12.18.S 12.19.S 12.20.X 13.1.X 13.2.S 13.3.X 13.17.X 13.18.S 13.19.X 14.1.X 14.2.S 14.3.S 14.4.X 14.16.X 14.17.S 14.18.S 14.19.X 15.2.X 15.3.S 15.4.S 15.5.X 15.15.X 15.16.S 15.17.S 15.18.X 16.3.X 16.4.S 16.5.S 16.6.X 16.14.X 16.15.S 16.16.S 16.17.X 17.4.X 17.5.S 17.6.X 17.14.X 17.15.S 17.16.X 18.5.X 18.15.X",
  },
};

// art-space rectangles of the lowered arms: [x, y, width, height]
export const armRegions = { right: [78, 87, 15, 35], left: [18, 87, 15, 35] };

export const parseCells = (cells) =>
  cells.split(" ").map((cell) => {
    const [r, c, color] = cell.split(".");
    return [Number(r), Number(c), color];
  });
