(function() {
  var _Mathabs = Math.abs,
    _Mathfloor = Math.floor,
    _Mathceil = Math.ceil;
  Date.shortMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  Date.longMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  Date.shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  Date.longDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  var replaceChars = {
    d: function() {
      var d = this.getDate();
      return (10 > d ? "0" : "") + d;
    },
    D: function D() {
      return Date.shortDays[this.getDay()];
    },
    j: function j() {
      return this.getDate();
    },
    l: function l() {
      return Date.longDays[this.getDay()];
    },
    N: function() {
      var N = this.getDay();
      return 0 === N ? 7 : N;
    },
    S: function() {
      var S = this.getDate();
      return 1 === S % 10 && 11 !== S
        ? "st"
        : 2 === S % 10 && 12 !== S
          ? "nd"
          : 3 === S % 10 && 13 !== S
            ? "rd"
            : "th";
    },
    w: function w() {
      return this.getDay();
    },
    z: function z() {
      var d = new Date(this.getFullYear(), 0, 1);
      return _Mathceil((this - d) / 864e5);
    },
    W: function W() {
      var target = new Date(this.valueOf()),
        dayNr = (this.getDay() + 6) % 7;
      target.setDate(target.getDate() - dayNr + 3);
      var firstThursday = target.valueOf();
      target.setMonth(0, 1);
      if (4 !== target.getDay()) {
        target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
      }
      var retVal = 1 + _Mathceil((firstThursday - target) / 6048e5);
      return 10 > retVal ? "0" + retVal : retVal;
    },
    F: function F() {
      return Date.longMonths[this.getMonth()];
    },
    m: function() {
      var m = this.getMonth();
      return (9 > m ? "0" : "") + (m + 1);
    },
    M: function M() {
      return Date.shortMonths[this.getMonth()];
    },
    n: function n() {
      return this.getMonth() + 1;
    },
    t: function t() {
      var year = this.getFullYear(),
        nextMonth = this.getMonth() + 1;
      if (12 === nextMonth) {
        year = year++;
        nextMonth = 0;
      }
      return new Date(year, nextMonth, 0).getDate();
    },
    L: function() {
      var L = this.getFullYear();
      return 0 === L % 400 || (0 !== L % 100 && 0 === L % 4);
    },
    o: function o() {
      var d = new Date(this.valueOf());
      d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3);
      return d.getFullYear();
    },
    Y: function Y() {
      return this.getFullYear();
    },
    y: function y() {
      return ("" + this.getFullYear()).substr(2);
    },
    a: function a() {
      return 12 > this.getHours() ? "am" : "pm";
    },
    A: function A() {
      return 12 > this.getHours() ? "AM" : "PM";
    },
    B: function B() {
      return _Mathfloor(
        (1e3 *
          (((this.getUTCHours() + 1) % 24) +
            this.getUTCMinutes() / 60 +
            this.getUTCSeconds() / 3600)) /
          24
      );
    },
    g: function g() {
      return this.getHours() % 12 || 12;
    },
    G: function G() {
      return this.getHours();
    },
    h: function() {
      var h = this.getHours();
      return (10 > (h % 12 || 12) ? "0" : "") + (h % 12 || 12);
    },
    H: function() {
      var H = this.getHours();
      return (10 > H ? "0" : "") + H;
    },
    i: function() {
      var i = this.getMinutes();
      return (10 > i ? "0" : "") + i;
    },
    s: function() {
      var s = this.getSeconds();
      return (10 > s ? "0" : "") + s;
    },
    v: function() {
      var v = this.getMilliseconds();
      return (10 > v ? "00" : 100 > v ? "0" : "") + v;
    },
    e: function e() {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    },
    I: function I() {
      for (var DST = null, i = 0; 12 > i; ++i) {
        var d = new Date(this.getFullYear(), i, 1),
          offset = d.getTimezoneOffset();
        if (null === DST) DST = offset;
        else if (offset < DST) {
          DST = offset;
          break;
        } else if (offset > DST) break;
      }
      return 0 | (this.getTimezoneOffset() === DST);
    },
    O: function() {
      var O = this.getTimezoneOffset();
      return (
        (0 > -O ? "-" : "+") +
        (10 > _Mathabs(O / 60) ? "0" : "") +
        _Mathfloor(_Mathabs(O / 60)) +
        (0 === _Mathabs(O % 60)
          ? "00"
          : (10 > _Mathabs(O % 60) ? "0" : "") + _Mathabs(O % 60))
      );
    },
    P: function() {
      var P = this.getTimezoneOffset();
      return (
        (0 > -P ? "-" : "+") +
        (10 > _Mathabs(P / 60) ? "0" : "") +
        _Mathfloor(_Mathabs(P / 60)) +
        ":" +
        (0 === _Mathabs(P % 60)
          ? "00"
          : (10 > _Mathabs(P % 60) ? "0" : "") + _Mathabs(P % 60))
      );
    },
    T: function T() {
      var tz = this.toLocaleTimeString(navigator.language, {
        timeZoneName: "short"
      }).split(" ");
      return tz[tz.length - 1];
    },
    Z: function Z() {
      return 60 * -this.getTimezoneOffset();
    },
    c: function c() {
      return this.format("Y-m-d\\TH:i:sP");
    },
    r: function r() {
      return this.toString();
    },
    U: function U() {
      return _Mathfloor(this.getTime() / 1e3);
    }
  };
  Date.prototype.format = function(format) {
    var date = this;
    return format.replace(/(\\?)(.)/g, function(_, esc, chr) {
      return "" === esc && replaceChars[chr]
        ? replaceChars[chr].call(date)
        : chr;
    });
  };
}.call(this));
