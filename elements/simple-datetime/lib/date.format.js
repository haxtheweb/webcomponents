/* eslint no-extend-native: 0 */

(function () {
  // Defining locale
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
    "Dec",
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
    "December",
  ];
  Date.shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  Date.longDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // Defining patterns
  let replaceChars = {
    // Day
    d: function () {
      let d = this.getDate();
      return (d < 10 ? "0" : "") + d;
    },
    D: function () {
      return Date.shortDays[this.getDay()];
    },
    j: function () {
      return this.getDate();
    },
    l: function () {
      return Date.longDays[this.getDay()];
    },
    N: function () {
      let N = this.getDay();
      return N === 0 ? 7 : N;
    },
    S: function () {
      let S = this.getDate();
      return S % 10 === 1 && S !== 11
        ? "st"
        : S % 10 === 2 && S !== 12
          ? "nd"
          : S % 10 === 3 && S !== 13
            ? "rd"
            : "th";
    },
    w: function () {
      return this.getDay();
    },
    z: function () {
      let d = new Date(this.getFullYear(), 0, 1);
      return Math.ceil((this - d) / 86400000);
    },
    // Week
    W: function () {
      let target = new Date(this.valueOf());
      let dayNr = (this.getDay() + 6) % 7;
      target.setDate(target.getDate() - dayNr + 3);
      let firstThursday = target.valueOf();
      target.setMonth(0, 1);
      if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
      }
      let retVal = 1 + Math.ceil((firstThursday - target) / 604800000);

      return retVal < 10 ? "0" + retVal : retVal;
    },
    // Month
    F: function () {
      return Date.longMonths[this.getMonth()];
    },
    m: function () {
      let m = this.getMonth();
      return (m < 9 ? "0" : "") + (m + 1);
    },
    M: function () {
      return Date.shortMonths[this.getMonth()];
    },
    n: function () {
      return this.getMonth() + 1;
    },
    t: function () {
      let year = this.getFullYear();
      let nextMonth = this.getMonth() + 1;
      if (nextMonth === 12) {
        year = year + 1;
        nextMonth = 0;
      }
      return new Date(year, nextMonth, 0).getDate();
    },
    // Year
    L: function () {
      let L = this.getFullYear();
      return L % 400 === 0 || (L % 100 !== 0 && L % 4 === 0);
    },
    o: function () {
      let d = new Date(this.valueOf());
      d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3);
      return d.getFullYear();
    },
    Y: function () {
      return this.getFullYear();
    },
    y: function () {
      return ("" + this.getFullYear()).substr(2);
    },
    // Time
    a: function () {
      return this.getHours() < 12 ? "am" : "pm";
    },
    A: function () {
      return this.getHours() < 12 ? "AM" : "PM";
    },
    B: function () {
      return Math.floor(
        ((((this.getUTCHours() + 1) % 24) +
          this.getUTCMinutes() / 60 +
          this.getUTCSeconds() / 3600) *
          1000) /
          24,
      );
    },
    g: function () {
      return this.getHours() % 12 || 12;
    },
    G: function () {
      return this.getHours();
    },
    h: function () {
      let h = this.getHours();
      return ((h % 12 || 12) < 10 ? "0" : "") + (h % 12 || 12);
    },
    H: function () {
      let H = this.getHours();
      return (H < 10 ? "0" : "") + H;
    },
    i: function () {
      let i = this.getMinutes();
      return (i < 10 ? "0" : "") + i;
    },
    s: function () {
      let s = this.getSeconds();
      return (s < 10 ? "0" : "") + s;
    },
    v: function () {
      let v = this.getMilliseconds();
      return (v < 10 ? "00" : v < 100 ? "0" : "") + v;
    },
    // Timezone
    e: function () {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    },
    I: function () {
      // compare the smallest and largest monthly offsets of the year; a
      // timezone without any variation never observes DST (PHP returns 0)
      let min = null;
      let max = null;
      for (let i = 0; i < 12; ++i) {
        let offset = new Date(this.getFullYear(), i, 1).getTimezoneOffset();
        if (min === null || offset < min) min = offset;
        if (max === null || offset > max) max = offset;
      }
      if (min === max) {
        return 0;
      }
      // daylight time is the smaller offset of the two
      return (this.getTimezoneOffset() === min) | 0;
    },
    O: function () {
      let O = this.getTimezoneOffset();
      return (
        (-O < 0 ? "-" : "+") +
        (Math.abs(O / 60) < 10 ? "0" : "") +
        Math.floor(Math.abs(O / 60)) +
        (Math.abs(O % 60) === 0
          ? "00"
          : (Math.abs(O % 60) < 10 ? "0" : "") + Math.abs(O % 60))
      );
    },
    P: function () {
      let P = this.getTimezoneOffset();
      return (
        (-P < 0 ? "-" : "+") +
        (Math.abs(P / 60) < 10 ? "0" : "") +
        Math.floor(Math.abs(P / 60)) +
        ":" +
        (Math.abs(P % 60) === 0
          ? "00"
          : (Math.abs(P % 60) < 10 ? "0" : "") + Math.abs(P % 60))
      );
    },
    T: function () {
      let tz = this.toLocaleTimeString(navigator.language, {
        timeZoneName: "short",
      }).split(" ");
      return tz[tz.length - 1];
    },
    Z: function () {
      return -this.getTimezoneOffset() * 60;
    },
    // Full Date/Time
    c: function () {
      return this.format("Y-m-d\\TH:i:sP");
    },
    r: function () {
      return this.toString();
    },
    U: function () {
      return Math.floor(this.getTime() / 1000);
    },
  };

  // Simulates PHP's date function
  Date.prototype.format = function (format) {
    let date = this;
    return format.replace(/(\\?)(.)/g, function (_, esc, chr) {
      return esc === "" && replaceChars[chr]
        ? replaceChars[chr].call(date)
        : chr;
    });
  };
}).call(this);
