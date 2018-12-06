/**
 * `secure-request`
 * `Wrapper behavior to provide the basis for a secure XHR`
 *
 * @demo demo/index.html
 * @polymerBehavior
 * @polymer
 */
window.SecureRequest = window.SecureRequest || {};
window.SecureRequest.xhr = {
  // Call this function in your root component.
  setCookies: function(endPoint, csrfToken) {
    this._eraseCookie("securerequest-endpoint");
    this._eraseCookie("securerequest-csrftoken");
    this._createCookie("securerequest-endpoint", endPoint, 30, endPoint);
    this._createCookie("securerequest-csrftoken", csrfToken, 30, endPoint);
  },
  // call this function from your child components to generate secure urls
  generateUrl: function(url) {
    const endPoint = this.getEndPoint();
    const csrfToken = this.getCsrfToken();
    if (endPoint && csrfToken) {
      return endPoint + url + "?token=" + csrfToken;
    }
    return null;
  },
  getEndPoint: function() {
    return this._readCookie("securerequest-endpoint");
  },
  getCsrfToken: function() {
    return this._readCookie("securerequest-csrftoken");
  },
  _createCookie: function(name, value, days, path) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=" + path;
  },
  _readCookie: function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },
  _eraseCookie: function(name) {
    this._createCookie(name, "", -1);
  }
};
