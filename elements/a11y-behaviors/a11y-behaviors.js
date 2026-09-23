export const A11yBehaviors = function (SuperClass) {
  return class extends SuperClass {
    /**
     * Get a a11y safe text color based on background color
     * @prop {string} bgColor hexadecimal value for the color
     * @return {string} hexadecimal value for the color
     */
    getTextContrastColor(bgColor) {
      // strip hash from string
      let colorBuffer = bgColor.replace("#", "");
      // expand 3-digit hex (abc) to 6-digit (aabbcc)
      if (colorBuffer.length === 3) {
        colorBuffer = colorBuffer.replace(/./g, (c) => c + c);
      }
      // convert rrggbb to decimal
      const rgb = parseInt(colorBuffer, 16);
      // extract RGB
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      // linearize an sRGB channel (0-255) per WCAG 2.x
      const linearize = (channel) => {
        const c = channel / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      };
      // calculate relative luminance per WCAG 2.x
      const luma =
        0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
      // contrast ratios against white and black; their product is always 21,
      // so the larger one is always >= 4.58:1 and passes WCAG AA (4.5:1)
      const whiteContrast = 1.05 / (luma + 0.05);
      const blackContrast = (luma + 0.05) / 0.05;
      // return whichever text color has the higher contrast ratio
      return whiteContrast >= blackContrast ? "#ffffff" : "#000000";
    }
    /**
     * Validate and modify the text contrast to ensure the correct contrast
     */
    computeTextPropContrast(textprop, bgprop) {
      // verify the value is hex value
      if (this[bgprop].includes("#")) {
        const color = this.getTextContrastColor(this[bgprop]);
        // Set color and background color vars
        this.set(textprop, color);
      }
    }
  };
};
