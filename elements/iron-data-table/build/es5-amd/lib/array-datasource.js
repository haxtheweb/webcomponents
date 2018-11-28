function ArrayDataSource(arr) {
  function _filter(items, filter) {
    if (0 === filter.length) {
      return items;
    }
    return Array.prototype.filter.call(items, function(item, index) {
      for (var i = 0, value; i < filter.length; i++) {
        value = Polymer.Base.get(filter[i].path, item);
        if (-1 < [void 0, null, ""].indexOf(filter[i].filter)) {
          continue;
        } else if (
          -1 < [void 0, null].indexOf(value) ||
          -1 ===
            value
              .toString()
              .toLowerCase()
              .indexOf(filter[i].filter.toString().toLowerCase())
        ) {
          return !1;
        }
      }
      return !0;
    });
  }
  function _compare(a, b) {
    return (
      (a === void 0) - (b === void 0) ||
      ("" === a) - ("" === b) ||
      (null === a) - (null === b) ||
      +(a > b) ||
      -(a < b)
    );
  }
  function _sort(items, sortOrder) {
    if (!sortOrder || 0 === sortOrder.length) {
      return items;
    }
    var multiSort = function multiSort() {
      return function(a, b) {
        return sortOrder
          .map(function(sort) {
            if ("asc" === sort.direction) {
              return _compare(
                Polymer.Base.get(sort.path, a),
                Polymer.Base.get(sort.path, b)
              );
            } else if ("desc" === sort.direction) {
              return _compare(
                Polymer.Base.get(sort.path, b),
                Polymer.Base.get(sort.path, a)
              );
            }
            return 0;
          })
          .reduce(function firstNonZeroValue(p, n) {
            return p ? p : n;
          }, 0);
      };
    };
    return Array.prototype.sort.call(items.slice(0), multiSort(sortOrder));
  }
  return function(opts, cb, err) {
    var filteredItems = _filter(arr, opts.filter),
      sortedItems = _sort(filteredItems, opts.sortOrder),
      start = opts.page * opts.pageSize,
      end = start + opts.pageSize,
      slice = sortedItems.slice(start, end);
    cb(slice, filteredItems.length);
  };
}
