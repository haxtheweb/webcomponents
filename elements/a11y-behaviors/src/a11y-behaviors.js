export const A11yBehaviors = function (SuperClass) {
  return class extends SuperClass {
    /**
     * Get a a11y safe text color based on background color
     * @prop {string} bgColor hexadecimal value for the color
     * @return {string} hexadecimal value for the color
     */
    getTextContrastColor(bgColor) {
      // verify the value is hex value
      let color = "";
      // strip hash from string
      const colorBuffer = bgColor.replace("#", "");
      // convert rrggbb to decimal
      const rgb = parseInt(colorBuffer, 16);
      // extract RGB
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      // calculate luma
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
      // if the luma is to low switch to white text
      if (luma < 141) {
        color = "#ffffff";
      } else {
        color = "#000000";
      }
      // Set color and background color vars
      return color;
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
