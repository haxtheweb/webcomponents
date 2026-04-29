/**
 * Test if a variable along a given object path exists
 */
export function varExists(obj, path) {
  let g = objectValFromStringPos(obj, path, "__failedToFind__");
  if (g != "__failedToFind__") {
    return true;
  }
  return false;
}
/**
 * Return an object path or fallback value if not set
 */
export function varGet(obj, path, fallback = "") {
  return objectValFromStringPos(obj, path, fallback);
}

// helper to use strings for index in Objects
export function objectValFromStringPos(o, s, r = null) {
  s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  s = s.replace(/^\./, ""); // strip a leading dot
  var a = s.split(".");
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (o) {
      if (k in o) {
        o = o[k];
      } else {
        return r;
      }
    } else {
      return r;
    }
  }
  return o;
}
/**
 * Take an array of items and apply a map of values to generate a new
 * array that is the structure you're looking for with default values
 * filling in the gaps.
 */
export function valueMapTransform(items, map) {
  // ensure we have a map to render
  let tmpAry = [];
  if (map) {
    items.forEach((item) => {
      // create tag for the map
      let tmp = {};
      for (var key in map) {
        let value = map[key];
        // complex transform capability for values that need processing
        // prior to being set
        if (value === true || value === false || value === null) {
          tmp[key] = value;
        } else if (typeof value === "function") {
          try {
            tmp[key] = value(item);
          } catch (e) {
            console.warn(e);
          }
        }
        // only set the value in the node IF we have a match in the item for data
        // odd trap but the transform case can potentially miss above and this then pass
        // which varExists requires value be a string
        else if (typeof value === "string" && varExists(item, value)) {
          tmp[key] = varGet(item, value);
        } else {
          tmp[key] = value;
        }
      }
      tmpAry.push(tmp);
    });
  }
  return tmpAry;
}
