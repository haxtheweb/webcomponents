/**
 * `smooth-scroll`
 * @customElement smooth-scroll
 * @demo demo/index.html
 * @microcopy - this is element provides methods to be called for smooth scrolling
 * - scroll()
 */
export class SmoothScroll {
  /**
   * Smooth scroll an elment into view
   * @target {Node} DOM node object
   * @options {object}
   *           - align (top, center, bottom)
   *           - delay
   *           - duration
   *           - scrollElement
   */
  scroll(target, options) {
    // define default options
    const defaultOptions = {
      align: "top",
      delay: 0,
      duration: 300,
      scrollElement: window
    };
    // combine default and user defined options
    const _options = Object.assign({}, defaultOptions, options);
    // get the bound client
    const targetPosition = target.getBoundingClientRect();
    // get the scroll Element position
    const scrollElementPosition = _options.scrollElement.getBoundingClientRect();
    // get the height of the scroll Element
    const scrollElementHeight =
      _options.scrollElement.getBoundingClientRect().bottom -
      _options.scrollElement.getBoundingClientRect().top;
    // get the height of the element target
    const targetHeight = targetPosition.bottom - targetPosition.top;
    // get the offset of the scroll Element
    const startPosition = _options.scrollElement.scrollTop;
    // get the distance between the top of the scroll and the top of the bounding rectangles
    let distance =
      target.getBoundingClientRect().top -
      _options.scrollElement.getBoundingClientRect().top;
    /**
     * @todo weird trick to position the scroll over the target
     * I'm still not sure why this works :)
     */
    distance = distance - scrollElementHeight / 2;
    // see where the user wants to align the scroll
    switch (_options.align) {
      case "center":
        distance = distance + targetHeight / 2;
        break;
      case "bottom":
        distance = distance + targetHeight;
        break;
      default:
        break;
    }
    // record start time
    let startTime = null;
    // internal animation function
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      let timeElapsed = currentTime - startTime;
      let run = ease(timeElapsed, startPosition, distance, _options.duration);
      _options.scrollElement.scrollTop = run;
      if (timeElapsed < _options.duration) requestAnimationFrame(animation);
    }
    // define a ease-in-out
    function ease(t, b, c, d) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
      return (-c / 2) * (--t * (t - 2) - 1) + b;
    }
    // start animation
    requestAnimationFrame(animation);
  }
}
