/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css } from "lit";

/* Form / answer status tokens (--ddd-status-*). Opt-in: only elements that
   draw answer states (QuestionElement and its family, sorting-option,
   self-check) include this block in their styles, so the tokens are not
   parsed on every page or in every DDDSuper shadow root. Values reference
   the DDDVariables palette, which inherits from the page. The token build
   (design-system/lib/source.js) reads this block alongside DDDVariables. */
export const DDDStatusTokens = css`
  :root,
  :host {
    /* ===========================================
       FORM STATUS
       State of an answer or field in learning content and forms.
       Each state names a signal colour (border and icon), an ink colour
       (the status word), a background and a line style, so states read
       apart by line, icon and word as well as by colour. Correct and
       incorrect pair green with purple, which stays distinct for
       red-green colour blindness and differs in lightness.
       Usage: border: 2px var(--ddd-status-correct-line)
                var(--ddd-status-correct-signal);
       =========================================== */
    --ddd-status-default-signal: light-dark(
      var(--ddd-theme-default-limestoneLight),
      var(--ddd-theme-default-limestoneGray)
    );
    --ddd-status-default-ink: light-dark(
      var(--ddd-theme-default-coalyGray),
      var(--ddd-theme-default-white)
    );
    --ddd-status-default-bg: light-dark(
      var(--ddd-theme-default-white),
      var(--ddd-theme-default-coalyGray)
    );
    --ddd-status-default-line: solid;
    --ddd-status-answered-signal: light-dark(
      var(--ddd-theme-default-nittanyNavy),
      var(--ddd-theme-default-linkLight)
    );
    --ddd-status-answered-ink: light-dark(
      var(--ddd-theme-default-nittanyNavy),
      var(--ddd-theme-default-linkLight)
    );
    --ddd-status-answered-bg: light-dark(
      var(--ddd-theme-default-limestoneMaxLight),
      var(--ddd-theme-default-potentialMidnight)
    );
    --ddd-status-answered-line: solid;
    --ddd-status-correct-signal: light-dark(
      var(--ddd-theme-default-opportunityGreen),
      var(--ddd-theme-default-futureLime)
    );
    --ddd-status-correct-ink: light-dark(
      var(--ddd-theme-default-success),
      var(--ddd-theme-default-futureLime)
    );
    --ddd-status-correct-bg: light-dark(
      var(--ddd-theme-default-white),
      var(--ddd-theme-default-coalyGray)
    );
    --ddd-status-correct-line: solid;
    --ddd-status-incorrect-signal: light-dark(
      var(--ddd-theme-default-wonderPurple),
      var(--ddd-theme-default-athertonViolet)
    );
    --ddd-status-incorrect-ink: light-dark(
      var(--ddd-theme-default-wonderPurple),
      var(--ddd-theme-default-athertonViolet)
    );
    --ddd-status-incorrect-bg: light-dark(
      var(--ddd-theme-default-white),
      var(--ddd-theme-default-coalyGray)
    );
    --ddd-status-incorrect-line: dotted;
    --ddd-status-revealed-signal: light-dark(
      var(--ddd-theme-default-link),
      var(--ddd-theme-default-linkLight)
    );
    --ddd-status-revealed-ink: light-dark(
      var(--ddd-theme-default-link),
      var(--ddd-theme-default-linkLight)
    );
    --ddd-status-revealed-bg: light-dark(
      var(--ddd-theme-default-white),
      var(--ddd-theme-default-coalyGray)
    );
    --ddd-status-revealed-line: dashed;
    --ddd-status-required-ink: light-dark(
      var(--ddd-theme-default-nittanyNavy),
      var(--ddd-theme-default-linkLight)
    );
    --ddd-status-missing-signal: light-dark(
      var(--ddd-theme-default-error),
      var(--ddd-theme-default-errorLight)
    );
    --ddd-status-missing-ink: light-dark(
      var(--ddd-theme-default-error),
      var(--ddd-theme-default-errorLight)
    );
    --ddd-status-missing-bg: light-dark(
      var(--ddd-theme-default-errorLight),
      var(--ddd-theme-default-potentialMidnight)
    );
    --ddd-status-missing-line: solid;
    --ddd-status-disabled-signal: var(--ddd-theme-default-limestoneGray);
    --ddd-status-disabled-ink: light-dark(
      var(--ddd-theme-default-slateGray),
      var(--ddd-theme-default-limestoneGray)
    );
    --ddd-status-disabled-bg: light-dark(
      var(--ddd-theme-default-limestoneMaxLight),
      var(--ddd-theme-default-potentialMidnight)
    );
    --ddd-status-disabled-line: dashed;
  }
`;
