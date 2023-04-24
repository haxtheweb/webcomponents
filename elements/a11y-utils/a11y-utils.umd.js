import { css } from "lit";

export const screenreaderOnlyCSS = css`
  .sr-only {
    position: absolute;
    left: -10000px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }
`;
