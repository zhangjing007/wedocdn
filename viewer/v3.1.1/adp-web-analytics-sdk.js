(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Adp = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * ADP Analytics Javascript SDK Module
 * @author Micaela Lopez <micaela.lopez@autodesk.com>
 * @type {exports}
 */
var $ = require('./libraries/jquery.min.js');
var Bacon = require('baconjs').Bacon;
var Util = require('./Utils.js');
var Constants = require('./Constants.js');

if($.support) {
    $.support.cors = true;
}

/**
 * Constructor
 * @param facets required, object with registration facets
 * @param config optional, contains the configuration for the SDK
 * @param deviceId optional, unique device identifier
 * @returns {{login: _login, logout: _logout, setFacets: _setFacets, getFacets: _getFacets, trackEvent: _trackEvent, trackEventWithTypeAndScope: _trackEventWithTypeAndScope, addEventType: _addEventType}}
 * @constructor
 */
function Tracker(facets, config, deviceId) {

  // Ensuring that Product facet is present
  if (!facets || !facets.product || !facets.product.id)
    throw new Error('You need to specify the product facet with the product id to instantiate the tracker')

  // SDK Configuration
  var conf = Util.buildConf(config);

  if (!Util.isValidProduct(facets.product))
    _warn ('The product facet should be specified with the id, name & id_provider to instantiate the tracker');

  if (!Util.isValidProductIdProvider(facets.product.id_provider)) _warn("The provider id_provider is not a valid one");

  // SDK Context
  var context = {};
  context.device_id = deviceId;
  context.session_id = Util.genGuid();
  context.facets = Util.buildFacets(facets);

  // Add the user to the context
  if (facets.user) _login(facets.user);

  // Add Geo info to context
  if (!facets.geo && conf.enable_geo_data) _updateGeo();

  // Configure envents queue
  var eventsBus = new Bacon.Bus();
  $.support.cors = true;

  eventsBus.flatMap(function (data) {
    return Bacon.retry({
      source: function () {
        return Bacon.fromPromise(
          $.ajax({
            url: conf.server,
            type: 'post',
            dataType: 'json',
            data: JSON.stringify(data || {}),
            crossDomain: true,
            contentType: "application/json; charset=utf-8"
          }));
      },
      retries: 3,
      isRetryable: function (response) {
        return response.status !== 200;
      },
      delay: function (context) {
        return context.retriesDone * 900;
      }
    })
  }).onValue(function (value) {
  });

  // Session messages
  if (conf.enable_session_messages) {
    eventsBus.push(Util.buildMsg(context, 'S', 'S', conf));
    var _onunload = window.onunload;
    window.onunload = function() {
      eventsBus.push(Util.buildMsg(context, 'S', 'E', conf));
      if (typeof _onunload === 'function')
        _onunload();
    };
    var _onbeforeunload = window.onbeforeunload;
    window.onbeforeunload = function() {
      eventsBus.push(Util.buildMsg(context, 'S', 'E', conf));
      if (typeof _onbeforeunload === 'function')
        return _onbeforeunload();
    };
  }

  function _updateGeo() {
    Bacon.fromCallback(navigator.geolocation.getCurrentPosition(function (it) {
      context.facets.geo = context.facets.geo || {};
      context.facets.geo.lat = it.coords.latitude;
      context.facets.geo.lon = it.coords.longitude;
    }, function (error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          _warn("User denied the request for geo-location");
          break;
        case error.POSITION_UNAVAILABLE:
          _warn("Location information is unavailable");
          break;
        case error.TIMEOUT:
          _warn("The request to get user location timed out");
          break;
        case error.UNKNOWN_ERR:
          _warn("An unknown error occurred while requesting geo-location");
          break;
      }
    }));
  }

  function _sendEvent(type, scope, facets, duration) {
    if (!facets.geo && conf.enable_geo_data) _updateGeo();
    context.duration = duration;
    eventsBus.push(Util.buildMsg(context, type, scope, conf, facets));
  }

  function _warn(msg) {
    if (!conf.suppress_warnings) {
      console.warn(msg);
    }
  }

  /**
   * Tracks an event, sends the corresponding information for tracking events to ASE services
   * @param eventType required, type of the event
   * @param facets optional, the facets used for API operation or product operations
   * @param duration optional, the facets used for API operation or product operations
   * @private
   */
  function _trackEvent(eventType, facets, duration) {
    var event = Constants.getValues(eventType);
    if (!event) console.error('A valid eventType needs to be specified to track an event');
    else {
      _sendEvent(event.type, event.scope, facets, duration);
    }
  };

  /**
   * Tracks an event, sends the corresponding information for tracking events to ASE services
   * @param type required, type of the event
   * @param scope required, type of the event
   * @param facets optional, the facets used for API operation or product operations
   * @param duration optional, the facets used for API operation or product operations
   * @private
   */
  function _trackEventWithTypeAndScope(type, scope, facets, duration) {
    if (!type) console.error('The type needs to be specified to track an event');
    else if (!scope) console.error('The Scope needs to be specified to track an event');
    else if (!Constants.isValidScope(scope)) console.error(scope + ' is not a valid scope');
    else if (!Constants.isValidType(type)) console.error(type + ' is not a valid type');
    else {
      _sendEvent(type, scope, facets, duration);
    }
  };

  /**
   * Adds an event type to the SDK
   * @param eventName
   * @param type
   * @param scope
   * @private
   */
  function _addEventType(eventName, type, scope) {
    Constants.addEventType(eventName, type, scope);
  }

  /**
   * Overrides the facets specified during the registration
   * @param facets
   * @private
   */
  function _setFacets(facets) {
    context.facets = Util.buildFacets(facets, context.facets);
  };

  /**
   * Returns the facets stored internally
   * @returns {*|context.facets}
   * @private
   */
  function _getFacets() {
    return context.facets;
  }

  /**
   * Adds the user information to the SDK
   * @param user required, the information of the user that logged in
   * @private
   */
  function _login(user) {
    if (!user) console.error('The information of the user that logged in needs to be specified');
    else if (!user.user_id) console.error('The user_id needs to be specified to log in a user');
    else if (!user.provider_name) console.error('The provider_name needs to be specified to log in a user');
    else {
      user.logged_in = true;
      context.facets.user_info[user.user_id + '_' + user.provider_name] = user;
      context.user_id = user.user_id;
      context.provider_name = user.provider_name;
    }
  };

  /**
   * Sets the specified user as currently logged out
   * @param userId
   * @private
   */
  function _logout(userId, providerName) {
    if (!userId) console.error('The user_id needs to be specified to log out a user');
    else if (!providerName) console.error('The provider_name needs to be specified to log out a user');
    else if (context.facets.user_info[userId + '_' + providerName]) {
      context.facets.user_info[userId + '_' + providerName].logged_in = false;
    } else {
      _warn("The user " + userId + ' / ' + providerName + " does not exist.");
    }
  };

  return{
    login: _login,
    logout: _logout,
    setFacets: _setFacets,
    getFacets: _getFacets,
    trackEvent: _trackEvent,
    trackEventWithTypeAndScope: _trackEventWithTypeAndScope,
    addEventType: _addEventType
  }
};

module.exports = function (facets, config, deviceId) {
  return new Tracker(facets, config, deviceId);
}

},{"./Constants.js":2,"./Utils.js":4,"./libraries/jquery.min.js":5,"baconjs":6}],2:[function(require,module,exports){
/**
 * Constants
 * @author Micaela Lopez <micaela.lopez@autodesk.com>
 * @type {exports}
 */
var Constants = (function () {

  var constants = {

    // Session
    SESSION_START: { type: 'S', scope: 'S'},
    SESSION_END: { type: 'S', scope: 'E'},
    SESSION_DETAILS: { type: 'S', scope: 'D'},
    SESSION_FULL: { type: 'S', scope: 'F'},

    // Project
    PROJECT_START: { type: 'P', scope: 'S'},
    PROJECT_END: { type: 'P', scope: 'E'},
    PROJECT_FULL: { type: 'P', scope: 'F'},
    PROJECT_NAME: { type: 'P', scope: 'N'},

    // Document
    DOCUMENT_START: { type: 'D', scope: 'S'},
    DOCUMENT_END: { type: 'D', scope: 'E'},
    DOCUMENT_FULL: { type: 'D', scope: 'F'},
    DOCUMENT_NAME: { type: 'D', scope: 'N'},
    DOCUMENT_TYPE: { type: 'D', scope: 'T'},

    // Click
    CLICK_PAGE: { type: 'C', scope: 'P'},
    CLICK_COMPONENT: { type: 'C', scope: 'C'},
    CLICK_DISPLAY: { type: 'C', scope: 'D'},
    CLICK_OPERATION: { type: 'C', scope: 'O'},

    // Metrics
    METRICS_COMPONENT: { type: 'M', scope: 'C'},
    METRICS_SESSION: { type: 'M', scope: 'S'},

    // Gesture
    GESTURE_COMPONENT: { type: 'G', scope: 'C'},

    // Hover
    HOVER_COMPONENT: { type: 'H', scope: 'C'},

    // Background
    BACKGROUND_CALL: { type: 'B', scope: 'C'},
    BACKGROUND_UPDATE: { type: 'B', scope: 'U'},
    BACKGROUND_DOWNLOAD: { type: 'B', scope: 'D'},
    BACKGROUND_INSTALL: { type: 'B', scope: 'I'},
    BACKGROUND_JOB: { type: 'B', scope: 'J'},

    // View
    USER_VIEW: { type: 'V', scope: 'U'},
    APPLICATION_VIEW: { type: 'V', scope: 'A'},
    OTHER_VIEW: { type: 'V', scope: 'O'}
  };

  function _getValues(eventType) {
    var values = constants[eventType];
    if (values) {
      return values;
    } else {
      console.error('The event type: ' + eventType + ' does not exist.');
    }
  }

  function _isValidType(type) {
    if (type == 'S' || type == 'P' || type == 'D' || type == 'C' || type == 'M' || type == 'G' ||
      type == 'H' || type == 'B' || type == 'V')
      return true;
    else
      return false;
  }

  function _isValidScope(scope) {
    if (scope.length == 1) {
      return true;
    } else {
      return false;
    }
  }

  function _addEventType(eventName, type, scope) {
    if (!_isValidScope(scope))
      console.error(type + ' is not a valid scope.');
    else if (!_isValidType(type)) console.error(type + ' is not a valid type.');
    else if (eventName == null || !(typeof eventName == "string" && eventName.length > 0))
      console.error(eventName + 'is not a valid event name.');
    else {
      constants[eventName] = {
        type: type,
        scope: scope
      }
    }
  }

  return{
    /**
     * Possible types of events
     */
    types: constants,
    getValues: _getValues,
    isValidType: _isValidType,
    isValidScope: _isValidScope,
    addEventType: _addEventType

  }

})();

module.exports = Constants;








},{}],3:[function(require,module,exports){
/**
 * Created by micaelalopez on 5/25/15.
 */

module.exports = (function (window, JSON) {
  /**
   * MD5 Checksum calculation, generates a MD5Hash out of a string provided
   * @param {string} str required, string to hash
   * @return {string}
   */
  function _stringToMD5(str) {
    var hexcase = 0, chrsz = 8, cmc5 = function (x, e) {
      x[e >> 5] |= 0x80 << ((e) % 32);
      x[(((e + 64) >>> 9) << 4) + 14] = e;
      var a = 1732584193;
      var b = -271733879;
      var c = -1732584194;
      var d = 271733878;
      for (var i = 0; i < x.length; i += 16) {
        var f = a;
        var g = b;
        var h = c;
        var j = d;
        a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = safe_add(a, f);
        b = safe_add(b, g);
        c = safe_add(c, h);
        d = safe_add(d, j)
      }
      return Array(a, b, c, d)
    }, md5_cmn = function (q, a, b, x, s, t) {
      return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
    }, md5_ff = function (a, b, c, d, x, s, t) {
      return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
    }, md5_gg = function (a, b, c, d, x, s, t) {
      return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
    }, md5_hh = function (a, b, c, d, x, s, t) {
      return md5_cmn(b ^ c ^ d, a, b, x, s, t)
    }, md5_ii = function (a, b, c, d, x, s, t) {
      return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
    }, safe_add = function (x, y) {
      var a = (x & 0xFFFF) + (y & 0xFFFF);
      var b = (x >> 16) + (y >> 16) + (a >> 16);
      return (b << 16) | (a & 0xFFFF)
    }, bit_rol = function (a, b) {
      return (a << b) | (a >>> (32 - b))
    }, s2b = function (a) {
      var b = Array();
      var c = (1 << chrsz) - 1;
      for (var i = 0; i < a.length * chrsz; i += chrsz) b[i >> 5] |= (a.charCodeAt(i / chrsz) & c) << (i % 32);
      return b
    }, b2h = function (a) {
      var b = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
      var c = "";
      for (var i = 0; i < a.length * 4; i++) {
        c += b.charAt((a[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) + b.charAt((a[i >> 2] >> ((i % 4) * 8)) & 0xF)
      }
      return c;
    };
    return b2h(cmc5(s2b(str), str.length * chrsz))
  }

  /**
   * Collects the User Agent information
   * @return {string}
   */
  function _userAgent() {
    return window.navigator.userAgent || "Unknown User gent";
  };

  /**
   * Collects the Display-String information
   * @return {string}
   */
  function _display() {
    var screen = {};
    for (var property in window.screen) {
      if (typeof window.screen[property] != 'function') {
        screen[property] = window.screen[property];
      }
    }
    return JSON.stringify(screen);
  };

  /**
   * Collects the Time Zone information
   * @return {string}
   */
  function _timezoneOffset() {
    return _stringToMD5(new Date().getTimezoneOffset() + '');
  };

  /**
   * Generates the fingerprint string with all the collected information
   * @return {string}
   */
  function _fingerprint() {
    return _stringToMD5(_userAgent()) + '-' + _stringToMD5(_display()) + '-' + _stringToMD5(_timezoneOffset());
  }

  /**
   * Gets the type of browser where the app is running
   * @return {string}
   */
  function _browserType() {
    var ua = window.navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE';
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\bOPR\/(\d+)/)
      if (tem != null) {
        return 'Opera';
      }
    }
    return M[1];
  }


  /**
   * Generates the facet with the browser info
   * @return {string}
   */
  function _browserFacet() {
    return  {
      type: _browserType(),
      user_agent: window.navigator.userAgent.replace(';',','),
      platform: window.navigator.platform,
      language: window.navigator.languages || [window.navigator.language] || []
    };
  }

  return {
    fingerprint: _fingerprint,
    browserFacet: _browserFacet
  };
})(window, JSON);
},{}],4:[function(require,module,exports){
/**
 * ADP Utils
 * @author Micaela Lopez <micaela.lopez@autodesk.com>
 * @type {exports}
 */
var DEFAULT_SERVER = "//ase-dev.autodesk.com";
var SCHEMA_VERSION = "3.0.0";
var TRACK_ENDPOINT = "/adp/v1/analytics/upload";
var SDK_VERSION = "js_web-1.0.3";

var fp = require('./Fingerprint.js');

module.exports = (function () {

  /**
   * The current timestamp
   * @returns {string}
   * @private
   */
  function _timestamp() {
    var now = new Date(),
      tzo = -now.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function (num) {
        var norm = Math.abs(Math.floor(num));
        return (norm < 10 ? '0' : '') + norm;
      };
    return now.getFullYear()
      + '-' + pad(now.getMonth() + 1)
      + '-' + pad(now.getDate())
      + 'T' + pad(now.getHours())
      + ':' + pad(now.getMinutes())
      + ':' + pad(now.getSeconds())
      + '.' + now.getMilliseconds()
      + dif + pad(tzo / 60)
      + ':' + pad(tzo % 60);
  };

  function _buildConf(config) {
    var conf = {};
    if (config && 'undefined' !== typeof config.server)
      conf.server = config.server + TRACK_ENDPOINT;
    else
      conf.server = DEFAULT_SERVER + TRACK_ENDPOINT;
    if (config && 'undefined' !== typeof config.enable_geo_data)
      conf.enable_geo_data = config.enable_geo_data;
    else
      conf.enable_geo_data = true;
    if (config && 'undefined' !== typeof config.enable_browser_data)
      conf.enable_browser_data = config.enable_browser_data;
    else
      conf.enable_browser_data = true;
    if (config && 'undefined' !== typeof config.enable_session_messages)
      conf.enable_session_messages = config.enable_session_messages;
    else
      conf.enable_session_messages = true;
    if (config && 'undefined' !== typeof config.suppress_warnings)
      conf.suppress_warnings = config.suppress_warnings;
    else
      conf.suppress_warnings = false;
    return conf;
  }

  /**
   * Builds the facets
   * @param conf a map with the sdk configuration
   * @param fts the facets to set
   * @param ctxFts the facets that are already in place in the SDK context
   * @private
   */
  function _buildFacets(fts, ctxFts) {
    var facets = ctxFts || {};
    if (fts) {
      _facetsCoercion(fts);
      if (fts.browser) facets.browser = fts.browser || facets.browser;
      if (fts.geo) facets.geo = fts.geo || facets.geo;
      if (fts.product) facets.product = fts.product || facets.product;
      if (fts.device) facets.device = fts.device || facets.device;
      if (fts.operation) facets.operation = fts.operation || facets.operation;
      if (fts.entitlement) facets.entitlement = fts.entitlement || facets.entitlement;
      if (fts.component) facets.component = fts.component || facets.component;
      if (fts.content) facets.content = fts.content || facets.content;
      if (fts.http) facets.http = fts.http || facets.http;
      if (fts.experiment_info) facets.experiment_info = fts.experiment_info || facets.experiment_info;
      if (fts.search) facets.search = fts.search || facets.experiment_info;
      facets.user_info = facets.user_info || {};
    }
    return facets;
  }

  /**
   * Generates an GUID RFC-4122 compliant
   * @returns {string}
   * @private
   */
  function _genGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  /**
   * Fingerprint generation
   * @returns {String}
   * @private
   */
  function _createFingerprint() {
    return fp.fingerprint();
  };

  /**
   * Creates the message to be sent to ASE services
   * @param regInfo the id of the user that logged in
   * @param type required, type of the event
   * @param config the SDK configuration
   * @param trackFts operation facets
   * @returns {{}}
   * @private
   */
  function _buildMsg(regInfo, type, scope, config, trackFts) {
    var data = {};

    // API Settingse
    data.version = SCHEMA_VERSION;
    data.sdk_version = SDK_VERSION;
    data.status = 'OK';
    data.session_id = regInfo.session_id;
    data.device_id = regInfo.device_id || _createFingerprint();

    // App Settings
    data.user_id = regInfo.user_id;
    data.provider_name = regInfo.provider_name;

    data.device_time = _timestamp();
    data.duration = regInfo.duration || -1;
    data.event_id = _genGuid();
    data.type = type;
    data.scope = scope;

    data.cur_service_id = regInfo.cur_service_id;
    data.cur_service_name = regInfo.cur_service_name;

    data.module_name = 'ASE';
    data.method_name = '/upload';

    // Browser facets
    trackFts = trackFts || {};
    _facetsCoercion(trackFts);
    if (config.enable_browser_data) {
      trackFts.browser = trackFts.browser || fp.browserFacet() || {};
    }

    var facetsList = [];
    for (name in regInfo.facets) {
      if ('undefined' == typeof trackFts[name])
        trackFts[name] = regInfo.facets[name];
    }
    for (name in trackFts) {
      if (name === "user_info") {
        var users = [];
        for (prop in trackFts[name]) users.push(trackFts[name][prop]);
        if (users.length > 0) {
          data.user_info = users;
          facetsList.push("user_info");
        }
      } else {
        facetsList.push(name);
        for (prop in trackFts[name]) {
          data[name + '_' + prop] = trackFts[name][prop];
        }
      }
    }
    data.facets = facetsList;
    return data;
  };

  /**
   * Validates product facets
   * @param product
   * @returns {boolean} true if it's valid
   * @private
   */

  function _isValidProduct(product) {
    if (product) {
      if (!product.id || !product.name || !product.id_provider) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  /**
   * Validates the identity provider of the product
   * @param product
   * @returns {boolean} true if it's valid
   * @private
   */
  function _isValidProductIdProvider(provider) {
    var upper = String(provider).toLocaleUpperCase();
    if (upper == 'APPKEY' || upper == 'UPI1' || upper == 'UPI2')
      return true;
    else
      return false;
  }

 /**
  * Force the facet's map attributes to fulfill the desired field spec
  * @param fts facets
  * @private
  */
  function _facetsCoercion(fts) {
     if (fts) {
        if(fts.product) {
           fts.product.id_provider = _stringToLowerCase(fts.product.id_provider);
        }
        if (fts.operation) {
            _forceMapValuesToString(fts.operation.meta);
        }
        if (fts.entitlement) {
            _forceMapValuesToString(fts.entitlement.properties);
        }
        if (fts.component) {
            _forceMapValuesToString(fts.component.attributes);
            _forceMapValuesToString(fts.component.metrics);
        }
        if (fts.content) {
            _forceMapValuesToString(fts.content.meta);
        }
        if (fts.http) {
            _forceMapValuesToString(fts.http.form_params);
            _forceMapValuesToString(fts.http.request_headers);
            _forceMapValuesToString(fts.http.response_headers);
        }
     }
  }

 /**
  * Force map's values to be of String type
  * @param map
  * @private
  */
  function _forceMapValuesToString(map) {
     if(map){
        for (var key in map) {
           if(map[key]) map[key] = map[key] +'';
        }
     }
  }

 /**
  * Converts string characters to lower cases.
  * @param str
  * @private
  */
  function _stringToLowerCase(str) {
     if(str) {
         return String(str).toLocaleLowerCase()
     }
     return undefined;
  }

  return{
    buildConf: _buildConf,
    buildFacets: _buildFacets,
    buildMsg: _buildMsg,
    genGuid: _genGuid,
    isValidProduct: _isValidProduct,
    isValidProductIdProvider: _isValidProductIdProvider
  }
})
();
},{"./Fingerprint.js":3}],5:[function(require,module,exports){
/*! jQuery v3.0.0-pre -css,-css/addGetHookIf,-css/adjustCSS,-css/curCSS,-css/hiddenVisibleSelectors,-css/showHide,-css/support,-css/var/cssExpand,-css/var/getStyles,-css/var/isHidden,-css/var/rmargin,-css/var/rnumnonpx,-css/var/swap,-effects,-effects/Tween,-effects/animatedSelector,-dimensions,-offset,-deprecated,-event/alias,-wrap,-ajax/jsonp | (c) jQuery Foundation | jquery.org/license */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=a.document,e=c.slice,f=c.concat,g=c.push,h=c.indexOf,i={},j=i.toString,k=i.hasOwnProperty,l={},m="3.0.0-pre -css,-css/addGetHookIf,-css/adjustCSS,-css/curCSS,-css/hiddenVisibleSelectors,-css/showHide,-css/support,-css/var/cssExpand,-css/var/getStyles,-css/var/isHidden,-css/var/rmargin,-css/var/rnumnonpx,-css/var/swap,-effects,-effects/Tween,-effects/animatedSelector,-dimensions,-offset,-deprecated,-event/alias,-wrap,-ajax/jsonp",n=function(a,b){return new n.fn.init(a,b)},o=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,p=/^-ms-/,q=/-([a-z])/g,r=function(a,b){return b.toUpperCase()};n.fn=n.prototype={jquery:m,constructor:n,length:0,toArray:function(){return e.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:e.call(this)},pushStack:function(a){var b=n.merge(this.constructor(),a);return b.prevObject=this,b},each:function(a){return n.each(this,a)},map:function(a){return this.pushStack(n.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(e.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:g,sort:c.sort,splice:c.splice},n.extend=n.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||n.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(n.isPlainObject(d)||(e=n.isArray(d)))?(e?(e=!1,f=c&&n.isArray(c)?c:[]):f=c&&n.isPlainObject(c)?c:{},g[b]=n.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},n.extend({expando:"jQuery"+(m+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===n.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){return!n.isArray(a)&&a-parseFloat(a)+1>=0},isPlainObject:function(a){return"object"!==n.type(a)||a.nodeType||n.isWindow(a)?!1:a.constructor&&!k.call(a.constructor.prototype,"isPrototypeOf")?!1:!0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?i[j.call(a)]||"object":typeof a},globalEval:function(a){var b=d.createElement("script");b.text=a,d.head.appendChild(b).parentNode.removeChild(b)},camelCase:function(a){return a.replace(p,"ms-").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b){var c,d=0;if(s(a)){for(c=a.length;c>d;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(o,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?n.merge(c,"string"==typeof a?[a]:a):g.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:h.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;c>d;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,g=0,h=[];if(s(a))for(d=a.length;d>g;g++)e=b(a[g],g,c),null!=e&&h.push(e);else for(g in a)e=b(a[g],g,c),null!=e&&h.push(e);return f.apply([],h)},guid:1,proxy:function(a,b){var c,d,f;return"string"==typeof b&&(c=a[b],b=a,a=c),n.isFunction(a)?(d=e.call(arguments,2),f=function(){return a.apply(b||this,d.concat(e.call(arguments)))},f.guid=a.guid=a.guid||n.guid++,f):void 0},now:Date.now,support:l}),"function"==typeof Symbol&&(n.fn[Symbol.iterator]=c[Symbol.iterator]),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){i["[object "+b+"]"]=b.toLowerCase()});function s(a){var b=!!a&&"length"in a&&a.length,c=n.type(a);return"function"===c||n.isWindow(a)?!1:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ga(),z=ga(),A=ga(),B=function(a,b){return a===b&&(l=!0),0},C=1<<31,D={}.hasOwnProperty,E=[],F=E.pop,G=E.push,H=E.push,I=E.slice,J=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},K="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",L="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",N="\\["+L+"*("+M+")(?:"+L+"*([*^$|!~]?=)"+L+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+M+"))|)"+L+"*\\]",O=":("+M+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+N+")*)|.*)\\)|)",P=new RegExp(L+"+","g"),Q=new RegExp("^"+L+"+|((?:^|[^\\\\])(?:\\\\.)*)"+L+"+$","g"),R=new RegExp("^"+L+"*,"+L+"*"),S=new RegExp("^"+L+"*([>+~]|"+L+")"+L+"*"),T=new RegExp("="+L+"*([^\\]'\"]*?)"+L+"*\\]","g"),U=new RegExp(O),V=new RegExp("^"+M+"$"),W={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),TAG:new RegExp("^("+M+"|[*])"),ATTR:new RegExp("^"+N),PSEUDO:new RegExp("^"+O),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+L+"*(even|odd|(([+-]|)(\\d*)n|)"+L+"*(?:([+-]|)"+L+"*(\\d+)|))"+L+"*\\)|)","i"),bool:new RegExp("^(?:"+K+")$","i"),needsContext:new RegExp("^"+L+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+L+"*((?:-\\d)?\\d*)"+L+"*\\)|)(?=[^-]|$)","i")},X=/^(?:input|select|textarea|button)$/i,Y=/^h\d$/i,Z=/^[^{]+\{\s*\[native \w/,$=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,_=/[+~]/,aa=/'|\\/g,ba=new RegExp("\\\\([\\da-f]{1,6}"+L+"?|("+L+")|.)","ig"),ca=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},da=function(){m()};try{H.apply(E=I.call(v.childNodes),v.childNodes),E[v.childNodes.length].nodeType}catch(ea){H={apply:E.length?function(a,b){G.apply(a,I.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function fa(a,b,d,e){var f,h,j,k,l,o,r,s=b&&b.ownerDocument,w=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==w&&9!==w&&11!==w)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==w&&(l=$.exec(a)))if(f=l[1]){if(9===w){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(s&&(j=s.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(l[2])return H.apply(d,b.getElementsByTagName(a)),d;if((f=l[3])&&c.getElementsByClassName&&b.getElementsByClassName)return H.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==w)s=b,r=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(aa,"\\$&"):b.setAttribute("id",k=u),o=g(a),h=o.length;while(h--)o[h]="[id='"+k+"'] "+qa(o[h]);r=o.join(","),s=_.test(a)&&oa(b.parentNode)||b}if(r)try{return H.apply(d,s.querySelectorAll(r)),d}catch(x){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(Q,"$1"),b,d,e)}function ga(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ha(a){return a[u]=!0,a}function ia(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ja(a,b){var c=a.split("|"),e=a.length;while(e--)d.attrHandle[c[e]]=b}function ka(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||C)-(~a.sourceIndex||C);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function la(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function na(a){return ha(function(b){return b=+b,ha(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function oa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=fa.support={},f=fa.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=fa.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),n.documentMode&&(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ia(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ia(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Z.test(n.getElementsByClassName),c.getById=ia(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}},d.filter.ID=function(a){var b=a.replace(ba,ca);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(ba,ca);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return"undefined"!=typeof b.getElementsByClassName&&p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=Z.test(n.querySelectorAll))&&(ia(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+L+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+L+"*(?:value|"+K+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ia(function(a){var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+L+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Z.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ia(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",O)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Z.test(o.compareDocumentPosition),t=b||Z.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?J(k,a)-J(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?J(k,a)-J(k,b):0;if(e===f)return ka(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?ka(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},fa.matches=function(a,b){return fa(a,null,null,b)},fa.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(T,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return fa(b,n,null,[a]).length>0},fa.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},fa.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&D.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},fa.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},fa.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=fa.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=fa.selectors={cacheLength:50,createPseudo:ha,match:W,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(ba,ca),a[3]=(a[3]||a[4]||a[5]||"").replace(ba,ca),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||fa.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&fa.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return W.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&U.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(ba,ca).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+L+")"+a+"("+L+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=fa.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(P," ")+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||fa.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ha(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=J(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ha(function(a){var b=[],c=[],d=h(a.replace(Q,"$1"));return d[u]?ha(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ha(function(a){return function(b){return fa(a,b).length>0}}),contains:ha(function(a){return a=a.replace(ba,ca),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ha(function(a){return V.test(a||"")||fa.error("unsupported lang: "+a),a=a.replace(ba,ca).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Y.test(a.nodeName)},input:function(a){return X.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:na(function(){return[0]}),last:na(function(a,b){return[b-1]}),eq:na(function(a,b,c){return[0>c?c+b:c]}),even:na(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:na(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:na(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:na(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=la(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=ma(b);function pa(){}pa.prototype=d.filters=d.pseudos,d.setFilters=new pa,g=fa.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=R.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=S.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(Q," ")}),h=h.slice(c.length));for(g in d.filter)!(e=W[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?fa.error(a):z(a,i).slice(0)};function qa(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function ra(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j,k=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(j=b[u]||(b[u]={}),i=j[b.uniqueID]||(j[b.uniqueID]={}),(h=i[d])&&h[0]===w&&h[1]===f)return k[2]=h[2];if(i[d]=k,k[2]=a(b,c,g))return!0}}}function sa(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function ta(a,b,c){for(var d=0,e=b.length;e>d;d++)fa(a,b[d],c);return c}function ua(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function va(a,b,c,d,e,f){return d&&!d[u]&&(d=va(d)),e&&!e[u]&&(e=va(e,f)),ha(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||ta(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:ua(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=ua(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?J(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=ua(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):H.apply(g,r)})}function wa(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ra(function(a){return a===b},h,!0),l=ra(function(a){return J(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];f>i;i++)if(c=d.relative[a[i].type])m=[ra(sa(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return va(i>1&&sa(m),i>1&&qa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(Q,"$1"),c,e>i&&wa(a.slice(i,e)),f>e&&wa(a=a.slice(e)),f>e&&qa(a))}m.push(c)}return sa(m)}function xa(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=F.call(i));u=ua(u)}H.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&fa.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ha(f):f}return h=fa.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=wa(b[c]),f[u]?d.push(f):e.push(f);f=A(a,xa(e,d)),f.selector=a}return f},i=fa.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(ba,ca),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=W.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(ba,ca),_.test(j[0].type)&&oa(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&qa(j),!a)return H.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,!b||_.test(a)&&oa(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ia(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),ia(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ja("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ia(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ja("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),ia(function(a){return null==a.getAttribute("disabled")})||ja(K,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),fa}(a);n.find=t,n.expr=t.selectors,n.expr[":"]=n.expr.pseudos,n.uniqueSort=n.unique=t.uniqueSort,n.text=t.getText,n.isXMLDoc=t.isXML,n.contains=t.contains;var u=n.expr.match.needsContext,v=/^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,w=/^.[^:#\[\.,]*$/;function x(a,b,c){if(n.isFunction(b))return n.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return n.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(w.test(b))return n.filter(b,a,c);b=n.filter(b,a)}return n.grep(a,function(a){return h.call(b,a)>-1!==c})}n.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?n.find.matchesSelector(d,a)?[d]:[]:n.find.matches(a,n.grep(b,function(a){return 1===a.nodeType}))},n.fn.extend({find:function(a){var b,c=this.length,d=[],e=this;if("string"!=typeof a)return this.pushStack(n(a).filter(function(){for(b=0;c>b;b++)if(n.contains(e[b],this))return!0}));for(b=0;c>b;b++)n.find(a,e[b],d);return this.pushStack(c>1?n.uniqueSort(d):d)},filter:function(a){return this.pushStack(x(this,a||[],!1))},not:function(a){return this.pushStack(x(this,a||[],!0))},is:function(a){return!!x(this,"string"==typeof a&&u.test(a)?n(a):a||[],!1).length}});var y,z=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,A=n.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||y,"string"==typeof a){if(e="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:z.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof n?b[0]:b,n.merge(this,n.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),v.test(e[1])&&n.isPlainObject(b))for(e in b)n.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}return f=d.getElementById(e[2]),f&&(this[0]=f,this.length=1),this}return a.nodeType?(this[0]=a,this.length=1,this):n.isFunction(a)?void 0!==c.ready?c.ready(a):a(n):n.makeArray(a,this)};A.prototype=n.fn,y=n(d);var B=/^(?:parents|prev(?:Until|All))/,C={children:!0,contents:!0,next:!0,prev:!0};n.extend({dir:function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&n(a).is(c))break;d.push(a)}return d},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}}),n.fn.extend({has:function(a){var b=n(a,this),c=b.length;return this.filter(function(){for(var a=0;c>a;a++)if(n.contains(this,b[a]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=u.test(a)||"string"!=typeof a?n(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&n.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?n.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?h.call(n(a),this[0]):h.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(n.uniqueSort(n.merge(this.get(),n(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function D(a,b){while((a=a[b])&&1!==a.nodeType);return a}n.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return n.dir(a,"parentNode")},parentsUntil:function(a,b,c){return n.dir(a,"parentNode",c)},next:function(a){return D(a,"nextSibling")},prev:function(a){return D(a,"previousSibling")},nextAll:function(a){return n.dir(a,"nextSibling")},prevAll:function(a){return n.dir(a,"previousSibling")},nextUntil:function(a,b,c){return n.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return n.dir(a,"previousSibling",c)},siblings:function(a){return n.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return n.sibling(a.firstChild)},contents:function(a){return a.contentDocument||n.merge([],a.childNodes)}},function(a,b){n.fn[a]=function(c,d){var e=n.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=n.filter(d,e)),this.length>1&&(C[a]||n.uniqueSort(e),B.test(a)&&e.reverse()),this.pushStack(e)}});var E=/\S+/g;function F(a){var b={};return n.each(a.match(E)||[],function(a,c){b[c]=!0}),b}n.Callbacks=function(a){a="string"==typeof a?F(a):n.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){n.each(b,function(b,c){n.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==n.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return n.each(arguments,function(a,b){var c;while((c=n.inArray(b,f,c))>-1)f.splice(c,1),h>=c&&h--}),this},has:function(a){return a?n.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=g=[],c||b||(f=c=""),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j};function G(a){return a}function H(a){throw a}n.extend({Deferred:function(b){var c=[["notify","progress",n.Callbacks("memory"),n.Callbacks("memory"),2],["resolve","done",n.Callbacks("once memory"),n.Callbacks("once memory"),0,"resolved"],["reject","fail",n.Callbacks("once memory"),n.Callbacks("once memory"),1,"rejected"]],d="pending",e={state:function(){return d},always:function(){return f.done(arguments).fail(arguments),this},"catch":function(a){return e.then(null,a)},pipe:function(){var a=arguments;return n.Deferred(function(b){n.each(c,function(c,d){var g=n.isFunction(a[d[4]])&&a[d[4]];f[d[1]](function(){var a=g&&g.apply(this,arguments);a&&n.isFunction(a.promise)?a.promise().progress(b.notify).done(b.resolve).fail(b.reject):b[d[0]+"With"](this===e?b.promise():this,g?[a]:arguments)})}),a=null}).promise()},then:function(b,d,f){var g=0;function h(b,c,d,f){return function(){var i=this===e?void 0:this,j=arguments,k=function(){var a,e;if(!(g>b)){if(a=d.apply(i,j),a===c.promise())throw new TypeError("Thenable self-resolution");e=a&&("object"==typeof a||"function"==typeof a)&&a.then,n.isFunction(e)?f?e.call(a,h(g,c,G,f),h(g,c,H,f)):(g++,e.call(a,h(g,c,G,f),h(g,c,H,f),h(g,c,G,c.notify))):(d!==G&&(i=void 0,j=[a]),(f||c.resolveWith)(i||c.promise(),j))}},l=f?k:function(){try{k()}catch(a){b+1>=g&&(d!==H&&(i=void 0,j=[a]),c.rejectWith(i||c.promise(),j))}};b?l():a.setTimeout(l)}}return n.Deferred(function(a){c[0][3].add(h(0,a,n.isFunction(f)?f:G,a.notifyWith)),c[1][3].add(h(0,a,n.isFunction(b)?b:G)),c[2][3].add(h(0,a,n.isFunction(d)?d:H))}).promise()},promise:function(a){return null!=a?n.extend(a,e):e}},f={};return n.each(c,function(a,b){var g=b[2],h=b[5];e[b[1]]=g.add,h&&g.add(function(){d=h},c[3-a][2].disable,c[0][2].lock),g.add(b[3].fire),f[b[0]]=function(){return f[b[0]+"With"](this===f?e:this,arguments),this},f[b[0]+"With"]=g.fireWith}),e.promise(f),b&&b.call(f,f),f},when:function(a){var b,c=0,d=e.call(arguments),f=d.length,g=1!==f||a&&n.isFunction(a.promise)?f:0,h=1===g?a:n.Deferred(),i=function(a,b,c){return function(d){b[a]=this,c[a]=arguments.length>1?e.call(arguments):d,c===j?h.notifyWith(b,c):--g||h.resolveWith(b,c)}},j,k,l;if(f>1)for(j=new Array(f),k=new Array(f),l=new Array(f);f>c;c++)d[c]&&n.isFunction(b=d[c].promise)?b.call(d[c]).progress(i(c,k,j)).done(i(c,l,d)).fail(h.reject):d[c]&&n.isFunction(b=d[c].then)?b.call(d[c],i(c,l,d),h.reject,i(c,k,j)):--g;return g||h.resolveWith(l,d),h.promise()}});var I;n.fn.ready=function(a){return n.ready.promise().done(a),this},n.extend({isReady:!1,readyWait:1,holdReady:function(a){a?n.readyWait++:n.ready(!0)},ready:function(a){(a===!0?--n.readyWait:n.isReady)||(n.isReady=!0,a!==!0&&--n.readyWait>0||I.resolveWith(d,[n]))}});function J(){d.removeEventListener("DOMContentLoaded",J),a.removeEventListener("load",J),n.ready()}n.ready.promise=function(b){return I||(I=n.Deferred(),"complete"===d.readyState?a.setTimeout(n.ready):(d.addEventListener("DOMContentLoaded",J),a.addEventListener("load",J))),I.promise(b)},n.ready.promise();var K=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===n.type(c)){e=!0;for(h in c)K(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,n.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(n(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f};n.acceptData=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function L(){this.expando=n.expando+L.uid++}L.uid=1,L.accepts=n.acceptData,L.prototype={register:function(a){var b={};return a.nodeType?a[this.expando]=b:Object.defineProperty(a,this.expando,{value:b,writable:!0,configurable:!0}),a[this.expando]},cache:function(a){if(!L.accepts(a))return{};var b=a[this.expando];return b?b:this.register(a)},set:function(a,b,c){var d,e=this.cache(a);if("string"==typeof b)e[n.camelCase(b)]=c;else for(d in b)e[n.camelCase(d)]=b[d];return e},get:function(a,b){var c=this.cache(a);return void 0===b?c:c[n.camelCase(b)]},access:function(a,b,c){
return void 0===b||b&&"string"==typeof b&&void 0===c?this.get(a,b):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d=a[this.expando];if(void 0!==d){if(void 0!==b){n.isArray(b)?b=b.map(n.camelCase):(b=n.camelCase(b),b=b in d?[b]:b.match(E)||[]),c=b.length;while(c--)delete d[b[c]]}(void 0===b||n.isEmptyObject(d))&&delete a[this.expando]}},hasData:function(a){var b=a[this.expando];return void 0!==b&&!n.isEmptyObject(b)}};var M=new L,N=new L,O=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,P=/[A-Z]/g;function Q(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(P,"-$&").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:O.test(c)?n.parseJSON(c):c}catch(e){}N.set(a,b,c)}else c=void 0;return c}n.extend({hasData:function(a){return N.hasData(a)||M.hasData(a)},data:function(a,b,c){return N.access(a,b,c)},removeData:function(a,b){N.remove(a,b)},_data:function(a,b,c){return M.access(a,b,c)},_removeData:function(a,b){M.remove(a,b)}}),n.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=N.get(f),1===f.nodeType&&!M.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=n.camelCase(d.slice(5)),Q(f,d,e[d])));M.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){N.set(this,a)}):K(this,function(b){var c;if(f&&void 0===b){if(c=N.get(f,a),void 0!==c)return c;if(c=Q(f,a),void 0!==c)return c}else this.each(function(){N.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){N.remove(this,a)})}}),n.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=M.get(a,b),c&&(!d||n.isArray(c)?d=M.access(a,b,n.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=n.queue(a,b),d=c.length,e=c.shift(),f=n._queueHooks(a,b),g=function(){n.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return M.get(a,c)||M.access(a,c,{empty:n.Callbacks("once memory").add(function(){M.remove(a,[b+"queue",c])})})}}),n.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?n.queue(this[0],a):void 0===b?this:this.each(function(){var c=n.queue(this,a,b);n._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&n.dequeue(this,a)})},dequeue:function(a){return this.each(function(){n.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=n.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=M.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var R=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,S=new RegExp("^(?:([+-])=|)("+R+")([a-z%]*)$","i"),T=/^(?:checkbox|radio)$/i,U=/<([\w:-]+)/,V=/^$|\/(?:java|ecma)script/i,W={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table>","</table>"],td:[3,"<table>","</table>"],_default:[0,"",""]};W.optgroup=W.option,W.tbody=W.tfoot=W.colgroup=W.caption=W.thead,W.th=W.td;function X(a,b){var c="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):[];return void 0===b||b&&n.nodeName(a,b)?n.merge([a],c):c}function Y(a,b){for(var c=0,d=a.length;d>c;c++)M.set(a[c],"globalEval",!b||M.get(b[c],"globalEval"))}var Z=/<|&#?\w+;/;function $(a,b,c,d,e){for(var f,g,h,i,j,k,l=b.createDocumentFragment(),m=[],o=0,p=a.length;p>o;o++)if(f=a[o],f||0===f)if("object"===n.type(f))n.merge(m,f.nodeType?[f]:f);else if(Z.test(f)){g=g||l.appendChild(b.createElement("div")),h=(U.exec(f)||["",""])[1].toLowerCase(),i=W[h]||W._default,g.innerHTML=i[1]+n.htmlPrefilter(f)+i[2],k=i[0];while(k--)g=g.lastChild;n.merge(m,g.childNodes),g=l.firstChild,g.textContent=""}else m.push(b.createTextNode(f));l.textContent="",o=0;while(f=m[o++])if(d&&n.inArray(f,d)>-1)e&&e.push(f);else if(j=n.contains(f.ownerDocument,f),g=X(l.appendChild(f),"script"),j&&Y(g),c){k=0;while(f=g[k++])V.test(f.type||"")&&c.push(f)}return l}!function(){var a=d.createDocumentFragment(),b=a.appendChild(d.createElement("div")),c=d.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),l.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",l.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}(),l.focusin="onfocusin"in a;var _=/^key/,aa=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,ba=/^(?:focusinfocus|focusoutblur)$/,ca=/^([^.]*)(?:\.(.+)|)/;function da(){return!0}function ea(){return!1}function fa(){try{return d.activeElement}catch(a){}}function ga(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)ga(a,h,c,d,b[h],f);return a}return null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1&&(e=ea),1===f&&(g=e,e=function(a){return n().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=n.guid++)),a.each(function(){n.event.add(this,b,e,d,c)})}n.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=M.get(a);if(r){c.handler&&(f=c,c=f.handler,e=f.selector),c.guid||(c.guid=n.guid++),(i=r.events)||(i=r.events={}),(g=r.handle)||(g=r.handle=function(b){return"undefined"!=typeof n&&n.event.triggered!==b.type?n.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(E)||[""],j=b.length;while(j--)h=ca.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o&&(l=n.event.special[o]||{},o=(e?l.delegateType:l.bindType)||o,l=n.event.special[o]||{},k=n.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&n.expr.match.needsContext.test(e),namespace:p.join(".")},f),(m=i[o])||(m=i[o]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,p,g)!==!1||a.addEventListener&&a.addEventListener(o,g)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),n.event.global[o]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=M.hasData(a)&&M.get(a);if(r&&(i=r.events)){b=(b||"").match(E)||[""],j=b.length;while(j--)if(h=ca.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=n.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,m=i[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&q!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||n.removeEvent(a,o,r.handle),delete i[o])}else for(o in i)n.event.remove(a,o+b[j],c,d,!0);n.isEmptyObject(i)&&M.remove(a,"handle events")}},trigger:function(b,c,e,f){var g,h,i,j,l,m,o,p=[e||d],q=k.call(b,"type")?b.type:b,r=k.call(b,"namespace")?b.namespace.split("."):[];if(h=i=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!ba.test(q+n.event.triggered)&&(q.indexOf(".")>-1&&(r=q.split("."),q=r.shift(),r.sort()),l=q.indexOf(":")<0&&"on"+q,b=b[n.expando]?b:new n.Event(q,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=r.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+r.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:n.makeArray(c,[b]),o=n.event.special[q]||{},f||!o.trigger||o.trigger.apply(e,c)!==!1)){if(!f&&!o.noBubble&&!n.isWindow(e)){for(j=o.delegateType||q,ba.test(j+q)||(h=h.parentNode);h;h=h.parentNode)p.push(h),i=h;i===(e.ownerDocument||d)&&p.push(i.defaultView||i.parentWindow||a)}g=0;while((h=p[g++])&&!b.isPropagationStopped())b.type=g>1?j:o.bindType||q,m=(M.get(h,"events")||{})[b.type]&&M.get(h,"handle"),m&&m.apply(h,c),m=l&&h[l],m&&m.apply&&n.acceptData(h)&&(b.result=m.apply(h,c),b.result===!1&&b.preventDefault());return b.type=q,f||b.isDefaultPrevented()||o._default&&o._default.apply(p.pop(),c)!==!1||!n.acceptData(e)||l&&n.isFunction(e[q])&&!n.isWindow(e)&&(i=e[l],i&&(e[l]=null),n.event.triggered=q,e[q](),n.event.triggered=void 0,i&&(e[l]=i)),b.result}},dispatch:function(a){a=n.event.fix(a);var b,c,d,f,g,h=[],i=e.call(arguments),j=(M.get(this,"events")||{})[a.type]||[],k=n.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=n.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,c=0;while((g=f.handlers[c++])&&!a.isImmediatePropagationStopped())(!a.rnamespace||a.rnamespace.test(g.namespace))&&(a.handleObj=g,a.data=g.data,d=((n.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==d&&(a.result=d)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&(!a.button||"click"!==a.type))for(;i!==this;i=i.parentNode||this)if(1===i.nodeType&&(i.disabled!==!0||"click"!==a.type)){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?n(e,this).index(i)>-1:n.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},props:"altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,e,f,g=b.button;return null==a.pageX&&null!=b.clientX&&(c=a.target.ownerDocument||d,e=c.documentElement,f=c.body,a.pageX=b.clientX+(e&&e.scrollLeft||f&&f.scrollLeft||0)-(e&&e.clientLeft||f&&f.clientLeft||0),a.pageY=b.clientY+(e&&e.scrollTop||f&&f.scrollTop||0)-(e&&e.clientTop||f&&f.clientTop||0)),a.which||void 0===g||(a.which=1&g?1:2&g?3:4&g?2:0),a}},fix:function(a){if(a[n.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];g||(this.fixHooks[e]=g=aa.test(e)?this.mouseHooks:_.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new n.Event(f),b=d.length;while(b--)c=d[b],a[c]=f[c];return 3===a.target.nodeType&&(a.target=a.target.parentNode),g.filter?g.filter(a,f):a},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==fa()&&this.focus?(this.focus(),!1):void 0},delegateType:"focusin"},blur:{trigger:function(){return this===fa()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&n.nodeName(this,"input")?(this.click(),!1):void 0},_default:function(a){return n.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c){var d=n.extend(new n.Event,c,{type:a,isSimulated:!0});n.event.trigger(d,null,b),d.isDefaultPrevented()&&c.preventDefault()}},n.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)},n.Event=function(a,b){return this instanceof n.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?da:ea):this.type=a,b&&n.extend(this,b),this.timeStamp=a&&a.timeStamp||n.now(),void(this[n.expando]=!0)):new n.Event(a,b)},n.Event.prototype={constructor:n.Event,isDefaultPrevented:ea,isPropagationStopped:ea,isImmediatePropagationStopped:ea,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=da,a&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=da,a&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=da,a&&a.stopImmediatePropagation(),this.stopPropagation()}},n.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){n.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!n.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),l.focusin||n.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){n.event.simulate(b,a.target,n.event.fix(a))};n.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=M.access(d,b);e||d.addEventListener(a,c,!0),M.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=M.access(d,b)-1;e?M.access(d,b,e):(d.removeEventListener(a,c,!0),M.remove(d,b))}}}),n.fn.extend({on:function(a,b,c,d){return ga(this,a,b,c,d)},one:function(a,b,c,d){return ga(this,a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,n(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=ea),this.each(function(){n.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){n.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?n.event.trigger(a,b,c,!0):void 0}});var ha=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,ia=/<(?:script|style|link)/i,ja=/checked\s*(?:[^=]|=\s*.checked.)/i,ka=/^true\/(.*)/,la=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function ma(a,b){return n.nodeName(a,"table")&&n.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a:a}function na(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function oa(a){var b=ka.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function pa(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(M.hasData(a)&&(f=M.access(a),g=M.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;d>c;c++)n.event.add(b,e,j[e][c])}N.hasData(a)&&(h=N.access(a),i=n.extend({},h),N.set(b,i))}}function qa(a,b){var c=b.nodeName.toLowerCase();"input"===c&&T.test(a.type)?b.checked=a.checked:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}function ra(a,b,c,d){b=f.apply([],b);var e,g,h,i,j,k,m=0,o=a.length,p=o-1,q=b[0],r=n.isFunction(q);if(r||o>1&&"string"==typeof q&&!l.checkClone&&ja.test(q))return a.each(function(e){var f=a.eq(e);r&&(b[0]=q.call(this,e,f.html())),ra(f,b,c,d)});if(o&&(e=$(b,a[0].ownerDocument,!1,a,d),g=e.firstChild,1===e.childNodes.length&&(e=g),g||d)){for(h=n.map(X(e,"script"),na),i=h.length;o>m;m++)j=e,m!==p&&(j=n.clone(j,!0,!0),i&&n.merge(h,X(j,"script"))),c.call(a[m],j,m);if(i)for(k=h[h.length-1].ownerDocument,n.map(h,oa),m=0;i>m;m++)j=h[m],V.test(j.type||"")&&!M.access(j,"globalEval")&&n.contains(k,j)&&(j.src?n._evalUrl&&n._evalUrl(j.src):n.globalEval(j.textContent.replace(la,"")))}return a}function sa(a,b,c){for(var d,e=b?n.filter(b,a):a,f=0;null!=(d=e[f]);f++)c||1!==d.nodeType||n.cleanData(X(d)),d.parentNode&&(c&&n.contains(d.ownerDocument,d)&&Y(X(d,"script")),d.parentNode.removeChild(d));return a}n.extend({htmlPrefilter:function(a){return a.replace(ha,"<$1></$2>")},clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=n.contains(a.ownerDocument,a);if(!(l.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||n.isXMLDoc(a)))for(g=X(h),f=X(a),d=0,e=f.length;e>d;d++)qa(f[d],g[d]);if(b)if(c)for(f=f||X(a),g=g||X(h),d=0,e=f.length;e>d;d++)pa(f[d],g[d]);else pa(a,h);return g=X(h,"script"),g.length>0&&Y(g,!i&&X(a,"script")),h},cleanData:function(a){for(var b,c,d,e=n.event.special,f=0;void 0!==(c=a[f]);f++)if(n.acceptData(c)){if(b=c[M.expando]){if(b.events)for(d in b.events)e[d]?n.event.remove(c,d):n.removeEvent(c,d,b.handle);delete c[M.expando]}c[N.expando]&&delete c[N.expando]}}}),n.fn.extend({detach:function(a){return sa(this,a,!0)},remove:function(a){return sa(this,a)},text:function(a){return K(this,function(a){return void 0===a?n.text(this):this.empty().each(function(){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&(this.textContent=a)})},null,a,arguments.length)},append:function(){return ra(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=ma(this,a);b.appendChild(a)}})},prepend:function(){return ra(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=ma(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return ra(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return ra(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(n.cleanData(X(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return n.clone(this,a,b)})},html:function(a){return K(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!ia.test(a)&&!W[(U.exec(a)||["",""])[1].toLowerCase()]){a=n.htmlPrefilter(a);try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(n.cleanData(X(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=[];return ra(this,arguments,function(b){var c=this.parentNode;n.inArray(this,a)<0&&(n.cleanData(X(this)),c&&c.replaceChild(b,this))},a)}}),n.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){n.fn[a]=function(a){for(var c,d=[],e=n(a),f=e.length-1,h=0;f>=h;h++)c=h===f?this:this.clone(!0),n(e[h])[b](c),g.apply(d,c.get());return this.pushStack(d)}});var ta=d.documentElement;n.fn.delay=function(b,c){return b=n.fx?n.fx.speeds[b]||b:b,c=c||"fx",this.queue(c,function(c,d){var e=a.setTimeout(c,b);d.stop=function(){a.clearTimeout(e)}})},function(){var a=d.createElement("input"),b=d.createElement("select"),c=b.appendChild(d.createElement("option"));a.type="checkbox",l.checkOn=""!==a.value,l.optSelected=c.selected,b.disabled=!0,l.optDisabled=!c.disabled,a=d.createElement("input"),a.value="t",a.type="radio",l.radioValue="t"===a.value}();var ua,va=n.expr.attrHandle;n.fn.extend({attr:function(a,b){return K(this,n.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){n.removeAttr(this,a)})}}),n.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return"undefined"==typeof a.getAttribute?n.prop(a,b,c):(1===f&&n.isXMLDoc(a)||(b=b.toLowerCase(),e=n.attrHooks[b]||(n.expr.match.bool.test(b)?ua:void 0)),void 0!==c?null===c?void n.removeAttr(a,b):e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:(a.setAttribute(b,c+""),c):e&&"get"in e&&null!==(d=e.get(a,b))?d:(d=n.find.attr(a,b),null==d?void 0:d))},attrHooks:{type:{set:function(a,b){if(!l.radioValue&&"radio"===b&&n.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(E);if(f&&1===a.nodeType)while(c=f[e++])d=n.propFix[c]||c,n.expr.match.bool.test(c)&&(a[d]=!1),a.removeAttribute(c)}}),ua={set:function(a,b,c){return b===!1?n.removeAttr(a,c):a.setAttribute(c,c),c}},n.each(n.expr.match.bool.source.match(/\w+/g),function(a,b){var c=va[b]||n.find.attr;va[b]=function(a,b,d){var e,f;return d||(f=va[b],va[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,va[b]=f),e}});var wa=/^(?:input|select|textarea|button)$/i;n.fn.extend({prop:function(a,b){return K(this,n.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[n.propFix[a]||a]})}}),n.extend({prop:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return 1===f&&n.isXMLDoc(a)||(b=n.propFix[b]||b,e=n.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){return a.hasAttribute("tabindex")||wa.test(a.nodeName)||a.href?a.tabIndex:-1}}},propFix:{"for":"htmlFor","class":"className"}}),l.optSelected||(n.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null}}),n.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){n.propFix[this.toLowerCase()]=this});var xa=/[\t\r\n\f]/g;function ya(a){return a.getAttribute&&a.getAttribute("class")||""}n.fn.extend({addClass:function(a){var b,c,d,e,f,g,h,i="string"==typeof a&&a,j=0,k=this.length;if(n.isFunction(a))return this.each(function(b){n(this).addClass(a.call(this,b,ya(this)))});if(i)for(b=(a||"").match(E)||[];k>j;j++)if(c=this[j],e=ya(c),d=1===c.nodeType&&(" "+e+" ").replace(xa," ")){g=0;while(f=b[g++])d.indexOf(" "+f+" ")<0&&(d+=f+" ");h=n.trim(d),e!==h&&c.setAttribute("class",h)}return this},removeClass:function(a){var b,c,d,e,f,g,h,i=0===arguments.length||"string"==typeof a&&a,j=0,k=this.length;if(n.isFunction(a))return this.each(function(b){n(this).removeClass(a.call(this,b,ya(this)))});if(i)for(b=(a||"").match(E)||[];k>j;j++)if(c=this[j],e=ya(c),d=1===c.nodeType&&(" "+e+" ").replace(xa," ")){g=0;while(f=b[g++])while(d.indexOf(" "+f+" ")>-1)d=d.replace(" "+f+" "," ");h=a?n.trim(d):"",e!==h&&c.setAttribute("class",h)}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):n.isFunction(a)?this.each(function(c){n(this).toggleClass(a.call(this,c,ya(this),b),b)}):this.each(function(){var b,d,e,f;if("string"===c){d=0,e=n(this),f=a.match(E)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else(void 0===a||"boolean"===c)&&(b=ya(this),b&&M.set(this,"__className__",b),this.setAttribute&&this.setAttribute("class",b||a===!1?"":M.get(this,"__className__")||""))})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+ya(this[c])+" ").replace(xa," ").indexOf(b)>-1)return!0;return!1}});var za=/\r/g;n.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=n.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,n(this).val()):a,null==e?e="":"number"==typeof e?e+="":n.isArray(e)&&(e=n.map(e,function(a){return null==a?"":a+""})),b=n.valHooks[this.type]||n.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=n.valHooks[e.type]||n.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(za,""):null==c?"":c)}}}),n.extend({valHooks:{option:{get:function(a){return n.trim(a.value)}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],(c.selected||i===e)&&(l.optDisabled?!c.disabled:null===c.getAttribute("disabled"))&&(!c.parentNode.disabled||!n.nodeName(c.parentNode,"optgroup"))){if(b=n(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=n.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=n.inArray(n.valHooks.option.get(d),f)>-1)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),n.each(["radio","checkbox"],function(){n.valHooks[this]={set:function(a,b){return n.isArray(b)?a.checked=n.inArray(n(a).val(),b)>-1:void 0}},l.checkOn||(n.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var Aa=a.location,Ba=n.now(),Ca=/\?/;n.parseJSON=function(a){return JSON.parse(a+"")},n.parseXML=function(b){var c;if(!b||"string"!=typeof b)return null;try{c=(new a.DOMParser).parseFromString(b,"text/xml")}catch(d){c=void 0}return(!c||c.getElementsByTagName("parsererror").length)&&n.error("Invalid XML: "+b),c};var Da=/#.*$/,Ea=/([?&])_=[^&]*/,Fa=/^(.*?):[ \t]*([^\r\n]*)$/gm,Ga=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Ha=/^(?:GET|HEAD)$/,Ia=/^\/\//,Ja={},Ka={},La="*/".concat("*"),Ma=d.createElement("a");Ma.href=Aa.href;function Na(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(E)||[];if(n.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Oa(a,b,c,d){var e={},f=a===Ka;function g(h){var i;return e[h]=!0,n.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Pa(a,b){var c,d,e=n.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&n.extend(!0,a,d),a}function Qa(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function Ra(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}n.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Aa.href,type:"GET",isLocal:Ga.test(Aa.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":La,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":n.parseJSON,"text xml":n.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Pa(Pa(a,n.ajaxSettings),b):Pa(n.ajaxSettings,a)},ajaxPrefilter:Na(Ja),ajaxTransport:Na(Ka),ajax:function(b,c){"object"==typeof b&&(c=b,b=void 0),c=c||{};var e,f,g,h,i,j,k,l,m=n.ajaxSetup({},c),o=m.context||m,p=m.context&&(o.nodeType||o.jquery)?n(o):n.event,q=n.Deferred(),r=n.Callbacks("once memory"),s=m.statusCode||{},t={},u={},v=0,w="canceled",x={readyState:0,getResponseHeader:function(a){var b;if(2===v){if(!h){h={};while(b=Fa.exec(g))h[b[1].toLowerCase()]=b[2]}b=h[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===v?g:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return v||(a=u[c]=u[c]||a,t[a]=b),this},overrideMimeType:function(a){return v||(m.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>v)for(b in a)s[b]=[s[b],a[b]];else x.always(a[x.status]);return this},abort:function(a){var b=a||w;return e&&e.abort(b),z(0,b),this}};if(q.promise(x),m.url=((b||m.url||Aa.href)+"").replace(Da,"").replace(Ia,Aa.protocol+"//"),m.type=c.method||c.type||m.method||m.type,m.dataTypes=n.trim(m.dataType||"*").toLowerCase().match(E)||[""],null==m.crossDomain){j=d.createElement("a");try{j.href=m.url,j.href=j.href,m.crossDomain=Ma.protocol+"//"+Ma.host!=j.protocol+"//"+j.host}catch(y){m.crossDomain=!0}}if(m.data&&m.processData&&"string"!=typeof m.data&&(m.data=n.param(m.data,m.traditional)),Oa(Ja,m,c,x),2===v)return x;k=n.event&&m.global,k&&0===n.active++&&n.event.trigger("ajaxStart"),m.type=m.type.toUpperCase(),m.hasContent=!Ha.test(m.type),f=m.url,m.hasContent||(m.data&&(f=m.url+=(Ca.test(f)?"&":"?")+m.data,delete m.data),m.cache===!1&&(m.url=Ea.test(f)?f.replace(Ea,"$1_="+Ba++):f+(Ca.test(f)?"&":"?")+"_="+Ba++)),m.ifModified&&(n.lastModified[f]&&x.setRequestHeader("If-Modified-Since",n.lastModified[f]),n.etag[f]&&x.setRequestHeader("If-None-Match",n.etag[f])),(m.data&&m.hasContent&&m.contentType!==!1||c.contentType)&&x.setRequestHeader("Content-Type",m.contentType),x.setRequestHeader("Accept",m.dataTypes[0]&&m.accepts[m.dataTypes[0]]?m.accepts[m.dataTypes[0]]+("*"!==m.dataTypes[0]?", "+La+"; q=0.01":""):m.accepts["*"]);for(l in m.headers)x.setRequestHeader(l,m.headers[l]);if(m.beforeSend&&(m.beforeSend.call(o,x,m)===!1||2===v))return x.abort();if(w="abort",r.add(m.complete),x.done(m.success),x.fail(m.error),e=Oa(Ka,m,c,x)){if(x.readyState=1,k&&p.trigger("ajaxSend",[x,m]),2===v)return x;m.async&&m.timeout>0&&(i=a.setTimeout(function(){x.abort("timeout")},m.timeout));try{v=1,e.send(t,z)}catch(y){if(!(2>v))throw y;z(-1,y)}}else z(-1,"No Transport");function z(b,c,d,h){var j,l,t,u,w,y=c;2!==v&&(v=2,i&&a.clearTimeout(i),e=void 0,g=h||"",x.readyState=b>0?4:0,j=b>=200&&300>b||304===b,d&&(u=Qa(m,x,d)),u=Ra(m,u,x,j),j?(m.ifModified&&(w=x.getResponseHeader("Last-Modified"),w&&(n.lastModified[f]=w),w=x.getResponseHeader("etag"),w&&(n.etag[f]=w)),204===b||"HEAD"===m.type?y="nocontent":304===b?y="notmodified":(y=u.state,l=u.data,t=u.error,j=!t)):(t=y,(b||!y)&&(y="error",0>b&&(b=0))),x.status=b,x.statusText=(c||y)+"",j?q.resolveWith(o,[l,y,x]):q.rejectWith(o,[x,y,t]),x.statusCode(s),s=void 0,k&&p.trigger(j?"ajaxSuccess":"ajaxError",[x,m,j?l:t]),r.fireWith(o,[x,y]),k&&(p.trigger("ajaxComplete",[x,m]),--n.active||n.event.trigger("ajaxStop")))}return x},getJSON:function(a,b,c){return n.get(a,b,c,"json")},getScript:function(a,b){return n.get(a,void 0,b,"script")}}),n.each(["get","post"],function(a,b){n[b]=function(a,c,d,e){return n.isFunction(c)&&(e=e||d,d=c,c=void 0),n.ajax(n.extend({url:a,type:b,dataType:e,data:c,success:d},n.isPlainObject(a)&&a))}}),n._evalUrl=function(a){return n.ajax({url:a,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})};var Sa=/%20/g,Ta=/\[\]$/,Ua=/\r?\n/g,Va=/^(?:submit|button|image|reset|file)$/i,Wa=/^(?:input|select|textarea|keygen)/i;function Xa(a,b,c,d){var e;if(n.isArray(b))n.each(b,function(b,e){c||Ta.test(a)?d(a,e):Xa(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==n.type(b))d(a,b);else for(e in b)Xa(a+"["+e+"]",b[e],c,d)}n.param=function(a,b){var c,d=[],e=function(a,b){b=n.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=n.ajaxSettings&&n.ajaxSettings.traditional),n.isArray(a)||a.jquery&&!n.isPlainObject(a))n.each(a,function(){e(this.name,this.value)});else for(c in a)Xa(c,a[c],b,e);return d.join("&").replace(Sa,"+")},n.fn.extend({serialize:function(){return n.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=n.prop(this,"elements");return a?n.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!n(this).is(":disabled")&&Wa.test(this.nodeName)&&!Va.test(a)&&(this.checked||!T.test(a))}).map(function(a,b){var c=n(this).val();return null==c?null:n.isArray(c)?n.map(c,function(a){return{name:b.name,value:a.replace(Ua,"\r\n")}}):{name:b.name,value:c.replace(Ua,"\r\n")}}).get()}}),n.ajaxSettings.xhr=function(){try{return new a.XMLHttpRequest}catch(b){}};var Ya={0:200,1223:204},Za=n.ajaxSettings.xhr();l.cors=!!Za&&"withCredentials"in Za,l.ajax=Za=!!Za,n.ajaxTransport(function(a){var b;return l.cors||Za&&!a.crossDomain?{send:function(c,d){var e,f=a.xhr();if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),a.crossDomain||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest");for(e in c)f.setRequestHeader(e,c[e]);b=function(a){return function(){b&&(b=f.onload=f.onerror=null,"abort"===a?f.abort():"error"===a?d(f.status,f.statusText):d(Ya[f.status]||f.status,f.statusText,"string"==typeof f.responseText?{
text:f.responseText}:void 0,f.getAllResponseHeaders()))}},f.onload=b(),f.onerror=b("error"),b=b("abort");try{f.send(a.hasContent&&a.data||null)}catch(g){if(b)throw g}},abort:function(){b&&b()}}:void 0}),n.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return n.globalEval(a),a}}}),n.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),n.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(e,f){b=n("<script>").prop({charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&f("error"===a.type?404:200,a.type)}),d.head.appendChild(b[0])},abort:function(){c&&c()}}}}),l.createHTMLDocument=function(){var a=d.implementation.createHTMLDocument("").body;return a.innerHTML="<form></form><form></form>",2===a.childNodes.length}(),n.parseHTML=function(a,b,c){if("string"!=typeof a)return[];"boolean"==typeof b&&(c=b,b=!1),b=b||(l.createHTMLDocument?d.implementation.createHTMLDocument(""):d);var e=v.exec(a),f=!c&&[];return e?[b.createElement(e[1])]:(e=$([a],b,f),f&&f.length&&n(f).remove(),n.merge([],e.childNodes))},n.fn.load=function(a,b,c){var d,e,f,g=this,h=a.indexOf(" ");return h>-1&&(d=n.trim(a.slice(h)),a=a.slice(0,h)),n.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&n.ajax({url:a,type:e||"GET",dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?n("<div>").append(n.parseHTML(a)).find(d):a)}).always(c&&function(a,b){g.each(function(){c.apply(g,f||[a.responseText,b,a])})}),this},n.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){n.fn[b]=function(a){return this.on(b,a)}}),"function"==typeof define&&define.amd&&define("jquery",[],function(){return n});var $a=a.jQuery,_a=a.$;return n.noConflict=function(b){return a.$===n&&(a.$=_a),b&&a.jQuery===n&&(a.jQuery=$a),n},b||(a.jQuery=a.$=n),n});

},{}],6:[function(require,module,exports){
(function (global){
(function() {
var _slice = Array.prototype.slice;
var Bacon = {
  toString: function () {
    return "Bacon";
  }
};

Bacon.version = '0.7.84';

var Exception = (typeof global !== "undefined" && global !== null ? global : this).Error;
var nop = function () {};
var latter = function (_, x) {
  return x;
};
var former = function (x, _) {
  return x;
};
var cloneArray = function (xs) {
  return xs.slice(0);
};
var assert = function (message, condition) {
  if (!condition) {
    throw new Exception(message);
  }
};
var assertObservableIsProperty = function (x) {
  if ((x != null ? x._isObservable : void 0) && !(x != null ? x._isProperty : void 0)) {
    throw new Exception("Observable is not a Property : " + x);
  }
};
var assertEventStream = function (event) {
  if (!(event != null ? event._isEventStream : void 0)) {
    throw new Exception("not an EventStream : " + event);
  }
};

var assertObservable = function (event) {
  if (!(event != null ? event._isObservable : void 0)) {
    throw new Exception("not an Observable : " + event);
  }
};
var assertFunction = function (f) {
  return assert("not a function : " + f, _.isFunction(f));
};
var isArray = function (xs) {
  return xs instanceof Array;
};
var isObservable = function (x) {
  return x && x._isObservable;
};
var assertArray = function (xs) {
  if (!isArray(xs)) {
    throw new Exception("not an array : " + xs);
  }
};
var assertNoArguments = function (args) {
  return assert("no arguments supported", args.length === 0);
};
var assertString = function (x) {
  if (typeof x === "string") {
    throw new Exception("not a string : " + x);
  }
};

var extend = function (target) {
  var length = arguments.length;
  for (var i = 1; 1 < length ? i < length : i > length; 1 < length ? i++ : i--) {
    for (var prop in arguments[i]) {
      target[prop] = arguments[i][prop];
    }
  }
  return target;
};

var inherit = function (child, parent) {
  var hasProp = ({}).hasOwnProperty;
  var ctor = function () {};
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
  for (var key in parent) {
    if (hasProp.call(parent, key)) {
      child[key] = parent[key];
    }
  }
  return child;
};

var _ = {
  indexOf: (function () {
    if (Array.prototype.indexOf) {
      return function (xs, x) {
        return xs.indexOf(x);
      };
    } else {
      return function (xs, x) {
        for (var i = 0, y; i < xs.length; i++) {
          y = xs[i];
          if (x === y) {
            return i;
          }
        }
        return -1;
      };
    }
  })(),
  indexWhere: function (xs, f) {
    for (var i = 0, y; i < xs.length; i++) {
      y = xs[i];
      if (f(y)) {
        return i;
      }
    }
    return -1;
  },
  head: function (xs) {
    return xs[0];
  },
  always: function (x) {
    return function () {
      return x;
    };
  },
  negate: function (f) {
    return function (x) {
      return !f(x);
    };
  },
  empty: function (xs) {
    return xs.length === 0;
  },
  tail: function (xs) {
    return xs.slice(1, xs.length);
  },
  filter: function (f, xs) {
    var filtered = [];
    for (var i = 0, x; i < xs.length; i++) {
      x = xs[i];
      if (f(x)) {
        filtered.push(x);
      }
    }
    return filtered;
  },
  map: function (f, xs) {
    return (function () {
      var result = [];
      for (var i = 0, x; i < xs.length; i++) {
        x = xs[i];
        result.push(f(x));
      }
      return result;
    })();
  },
  each: function (xs, f) {
    for (var key in xs) {
      if (Object.prototype.hasOwnProperty.call(xs, key)) {
        var value = xs[key];
        f(key, value);
      }
    }
  },
  toArray: function (xs) {
    return isArray(xs) ? xs : [xs];
  },
  contains: function (xs, x) {
    return _.indexOf(xs, x) !== -1;
  },
  id: function (x) {
    return x;
  },
  last: function (xs) {
    return xs[xs.length - 1];
  },
  all: function (xs) {
    var f = arguments.length <= 1 || arguments[1] === undefined ? _.id : arguments[1];

    for (var i = 0, x; i < xs.length; i++) {
      x = xs[i];
      if (!f(x)) {
        return false;
      }
    }
    return true;
  },
  any: function (xs) {
    var f = arguments.length <= 1 || arguments[1] === undefined ? _.id : arguments[1];

    for (var i = 0, x; i < xs.length; i++) {
      x = xs[i];
      if (f(x)) {
        return true;
      }
    }
    return false;
  },
  without: function (x, xs) {
    return _.filter(function (y) {
      return y !== x;
    }, xs);
  },
  remove: function (x, xs) {
    var i = _.indexOf(xs, x);
    if (i >= 0) {
      return xs.splice(i, 1);
    }
  },
  fold: function (xs, seed, f) {
    for (var i = 0, x; i < xs.length; i++) {
      x = xs[i];
      seed = f(seed, x);
    }
    return seed;
  },
  flatMap: function (f, xs) {
    return _.fold(xs, [], function (ys, x) {
      return ys.concat(f(x));
    });
  },
  cached: function (f) {
    var value = None;
    return function () {
      if (typeof value !== "undefined" && value !== null ? value._isNone : undefined) {
        value = f();
        f = undefined;
      }
      return value;
    };
  },
  bind: function (fn, me) {
    return function () {
      return fn.apply(me, arguments);
    };
  },
  isFunction: function (f) {
    return typeof f === "function";
  },
  toString: function (obj) {
    var internals, key, value;
    var hasProp = ({}).hasOwnProperty;
    try {
      recursionDepth++;
      if (obj == null) {
        return "undefined";
      } else if (_.isFunction(obj)) {
        return "function";
      } else if (isArray(obj)) {
        if (recursionDepth > 5) {
          return "[..]";
        }
        return "[" + _.map(_.toString, obj).toString() + "]";
      } else if ((obj != null ? obj.toString : void 0) != null && obj.toString !== Object.prototype.toString) {
        return obj.toString();
      } else if (typeof obj === "object") {
        if (recursionDepth > 5) {
          return "{..}";
        }
        internals = (function () {
          var results = [];
          for (key in obj) {
            if (!hasProp.call(obj, key)) continue;
            value = (function () {
              var error;
              try {
                return obj[key];
              } catch (error) {
                return error;
              }
            })();
            results.push(_.toString(key) + ":" + _.toString(value));
          }
          return results;
        })();
        return "{" + internals + "}";
      } else {
        return obj;
      }
    } finally {
      recursionDepth--;
    }
  }
};

var recursionDepth = 0;

Bacon._ = _;

var UpdateBarrier = Bacon.UpdateBarrier = (function () {
  var rootEvent;
  var waiterObs = [];
  var waiters = {};
  var afters = [];
  var aftersIndex = 0;
  var flushed = {};

  var afterTransaction = function (f) {
    if (rootEvent) {
      return afters.push(f);
    } else {
      return f();
    }
  };

  var whenDoneWith = function (obs, f) {
    if (rootEvent) {
      var obsWaiters = waiters[obs.id];
      if (!(typeof obsWaiters !== "undefined" && obsWaiters !== null)) {
        obsWaiters = waiters[obs.id] = [f];
        return waiterObs.push(obs);
      } else {
        return obsWaiters.push(f);
      }
    } else {
      return f();
    }
  };

  var flush = function () {
    while (waiterObs.length > 0) {
      flushWaiters(0, true);
    }
    flushed = {};
  };

  var flushWaiters = function (index, deps) {
    var obs = waiterObs[index];
    var obsId = obs.id;
    var obsWaiters = waiters[obsId];
    waiterObs.splice(index, 1);
    delete waiters[obsId];
    if (deps && waiterObs.length > 0) {
      flushDepsOf(obs);
    }
    for (var i = 0, f; i < obsWaiters.length; i++) {
      f = obsWaiters[i];
      f();
    }
  };

  var flushDepsOf = function (obs) {
    if (flushed[obs.id]) return;
    var deps = obs.internalDeps();
    for (var i = 0, dep; i < deps.length; i++) {
      dep = deps[i];
      flushDepsOf(dep);
      if (waiters[dep.id]) {
        var index = _.indexOf(waiterObs, dep);
        flushWaiters(index, false);
      }
    }
    flushed[obs.id] = true;
  };

  var inTransaction = function (event, context, f, args) {
    if (rootEvent) {
      return f.apply(context, args);
    } else {
      rootEvent = event;
      try {
        var result = f.apply(context, args);

        flush();
      } finally {
        rootEvent = undefined;
        while (aftersIndex < afters.length) {
          var after = afters[aftersIndex];
          aftersIndex++;
          after();
        }
        aftersIndex = 0;
        afters = [];
      }
      return result;
    }
  };

  var currentEventId = function () {
    return rootEvent ? rootEvent.id : undefined;
  };

  var wrappedSubscribe = function (obs, sink) {
    var unsubd = false;
    var shouldUnsub = false;
    var doUnsub = function () {
      shouldUnsub = true;
      return shouldUnsub;
    };
    var unsub = function () {
      unsubd = true;
      return doUnsub();
    };
    doUnsub = obs.dispatcher.subscribe(function (event) {
      return afterTransaction(function () {
        if (!unsubd) {
          var reply = sink(event);
          if (reply === Bacon.noMore) {
            return unsub();
          }
        }
      });
    });
    if (shouldUnsub) {
      doUnsub();
    }
    return unsub;
  };

  var hasWaiters = function () {
    return waiterObs.length > 0;
  };

  return { whenDoneWith: whenDoneWith, hasWaiters: hasWaiters, inTransaction: inTransaction, currentEventId: currentEventId, wrappedSubscribe: wrappedSubscribe, afterTransaction: afterTransaction };
})();

function Source(obs, sync) {
  var lazy = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  this.obs = obs;
  this.sync = sync;
  this.lazy = lazy;
  this.queue = [];
}

extend(Source.prototype, {
  _isSource: true,

  subscribe: function (sink) {
    return this.obs.dispatcher.subscribe(sink);
  },
  toString: function () {
    return this.obs.toString();
  },
  markEnded: function () {
    this.ended = true;
    return true;
  },
  consume: function () {
    if (this.lazy) {
      return { value: _.always(this.queue[0]) };
    } else {
      return this.queue[0];
    }
  },
  push: function (x) {
    this.queue = [x];
    return [x];
  },
  mayHave: function () {
    return true;
  },
  hasAtLeast: function () {
    return this.queue.length;
  },
  flatten: true
});

function ConsumingSource() {
  Source.apply(this, arguments);
}

inherit(ConsumingSource, Source);
extend(ConsumingSource.prototype, {
  consume: function () {
    return this.queue.shift();
  },
  push: function (x) {
    return this.queue.push(x);
  },
  mayHave: function (c) {
    return !this.ended || this.queue.length >= c;
  },
  hasAtLeast: function (c) {
    return this.queue.length >= c;
  },
  flatten: false
});

function BufferingSource(obs) {
  Source.call(this, obs, true);
}

inherit(BufferingSource, Source);
extend(BufferingSource.prototype, {
  consume: function () {
    var values = this.queue;
    this.queue = [];
    return {
      value: function () {
        return values;
      }
    };
  },
  push: function (x) {
    return this.queue.push(x.value());
  },
  hasAtLeast: function () {
    return true;
  }
});

Source.isTrigger = function (s) {
  if (s != null ? s._isSource : void 0) {
    return s.sync;
  } else {
    return s != null ? s._isEventStream : void 0;
  }
};

Source.fromObservable = function (s) {
  if (s != null ? s._isSource : void 0) {
    return s;
  } else if (s != null ? s._isProperty : void 0) {
    return new Source(s, false);
  } else {
    return new ConsumingSource(s, true);
  }
};

function Desc(context, method, args) {
  this.context = context;
  this.method = method;
  this.args = args;
}

extend(Desc.prototype, {
  _isDesc: true,
  deps: function () {
    if (!this.cached) {
      this.cached = findDeps([this.context].concat(this.args));
    }
    return this.cached;
  },
  toString: function () {
    return _.toString(this.context) + "." + _.toString(this.method) + "(" + _.map(_.toString, this.args) + ")";
  }
});

var describe = function (context, method) {
  var ref = context || method;
  if (ref && ref._isDesc) {
    return context || method;
  } else {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return new Desc(context, method, args);
  }
};

var withDesc = function (desc, obs) {
  obs.desc = desc;
  return obs;
};

var findDeps = function (x) {
  if (isArray(x)) {
    return _.flatMap(findDeps, x);
  } else if (isObservable(x)) {
    return [x];
  } else if (typeof x !== "undefined" && x !== null ? x._isSource : undefined) {
    return [x.obs];
  } else {
    return [];
  }
};

Bacon.Desc = Desc;
Bacon.Desc.empty = new Bacon.Desc("", "", []);

var withMethodCallSupport = function (wrapped) {
  return function (f) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    if (typeof f === "object" && args.length) {
      var context = f;
      var methodName = args[0];
      f = function () {
        return context[methodName].apply(context, arguments);
      };
      args = args.slice(1);
    }
    return wrapped.apply(undefined, [f].concat(args));
  };
};

var makeFunctionArgs = function (args) {
  args = Array.prototype.slice.call(args);
  return makeFunction_.apply(undefined, args);
};

var partiallyApplied = function (f, applied) {
  return function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return f.apply(undefined, applied.concat(args));
  };
};

var toSimpleExtractor = function (args) {
  return function (key) {
    return function (value) {
      if (!(typeof value !== "undefined" && value !== null)) {
        return;
      } else {
        var fieldValue = value[key];
        if (_.isFunction(fieldValue)) {
          return fieldValue.apply(value, args);
        } else {
          return fieldValue;
        }
      }
    };
  };
};

var toFieldExtractor = function (f, args) {
  var parts = f.slice(1).split(".");
  var partFuncs = _.map(toSimpleExtractor(args), parts);
  return function (value) {
    for (var i = 0, f; i < partFuncs.length; i++) {
      f = partFuncs[i];
      value = f(value);
    }
    return value;
  };
};

var isFieldKey = function (f) {
  return typeof f === "string" && f.length > 1 && f.charAt(0) === ".";
};

var makeFunction_ = withMethodCallSupport(function (f) {
  for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    args[_key4 - 1] = arguments[_key4];
  }

  if (_.isFunction(f)) {
    if (args.length) {
      return partiallyApplied(f, args);
    } else {
      return f;
    }
  } else if (isFieldKey(f)) {
    return toFieldExtractor(f, args);
  } else {
    return _.always(f);
  }
});

var makeFunction = function (f, args) {
  return makeFunction_.apply(undefined, [f].concat(args));
};

var convertArgsToFunction = function (obs, f, args, method) {
  if (typeof f !== "undefined" && f !== null ? f._isProperty : undefined) {
    var sampled = f.sampledBy(obs, function (p, s) {
      return [p, s];
    });
    return method.call(sampled, function (_ref) {
      var p = _ref[0];
      var s = _ref[1];
      return p;
    }).map(function (_ref2) {
      var p = _ref2[0];
      var s = _ref2[1];
      return s;
    });
  } else {
    f = makeFunction(f, args);
    return method.call(obs, f);
  }
};

var toCombinator = function (f) {
  if (_.isFunction(f)) {
    return f;
  } else if (isFieldKey(f)) {
    var key = toFieldKey(f);
    return function (left, right) {
      return left[key](right);
    };
  } else {
    throw new Exception("not a function or a field key: " + f);
  }
};

var toFieldKey = function (f) {
  return f.slice(1);
};

function Some(value) {
  this.value = value;
}

extend(Some.prototype, {
  _isSome: true,
  getOrElse: function () {
    return this.value;
  },
  get: function () {
    return this.value;
  },
  filter: function (f) {
    if (f(this.value)) {
      return new Some(this.value);
    } else {
      return None;
    }
  },
  map: function (f) {
    return new Some(f(this.value));
  },
  forEach: function (f) {
    return f(this.value);
  },
  isDefined: true,
  toArray: function () {
    return [this.value];
  },
  inspect: function () {
    return "Some(" + this.value + ")";
  },
  toString: function () {
    return this.inspect();
  }
});

var None = {
  _isNone: true,
  getOrElse: function (value) {
    return value;
  },
  filter: function () {
    return None;
  },
  map: function () {
    return None;
  },
  forEach: function () {},
  isDefined: false,
  toArray: function () {
    return [];
  },
  inspect: function () {
    return "None";
  },
  toString: function () {
    return this.inspect();
  }
};

var toOption = function (v) {
  if ((typeof v !== "undefined" && v !== null ? v._isSome : undefined) || (typeof v !== "undefined" && v !== null ? v._isNone : undefined)) {
    return v;
  } else {
    return new Some(v);
  }
};

Bacon.noMore = "<no-more>";
Bacon.more = "<more>";

var eventIdCounter = 0;

function Event() {
  this.id = ++eventIdCounter;
}

Event.prototype._isEvent = true;
Event.prototype.isEvent = function () {
  return true;
};
Event.prototype.isEnd = function () {
  return false;
};
Event.prototype.isInitial = function () {
  return false;
};
Event.prototype.isNext = function () {
  return false;
};
Event.prototype.isError = function () {
  return false;
};
Event.prototype.hasValue = function () {
  return false;
};
Event.prototype.filter = function () {
  return true;
};
Event.prototype.inspect = function () {
  return this.toString();
};
Event.prototype.log = function () {
  return this.toString();
};

function Next(valueF, eager) {
  if (!(this instanceof Next)) {
    return new Next(valueF, eager);
  }

  Event.call(this);

  if (!eager && _.isFunction(valueF) || (valueF != null ? valueF._isNext : void 0)) {
    this.valueF = valueF;
    this.valueInternal = void 0;
  } else {
    this.valueF = void 0;
    this.valueInternal = valueF;
  }
}

inherit(Next, Event);

Next.prototype.isNext = function () {
  return true;
};
Next.prototype.hasValue = function () {
  return true;
};
Next.prototype.value = function () {
  var ref;
  if ((ref = this.valueF) != null ? ref._isNext : void 0) {
    this.valueInternal = this.valueF.value();
    this.valueF = void 0;
  } else if (this.valueF) {
    this.valueInternal = this.valueF();
    this.valueF = void 0;
  }
  return this.valueInternal;
};

Next.prototype.fmap = function (f) {
  var event, value;
  if (this.valueInternal) {
    value = this.valueInternal;
    return this.apply(function () {
      return f(value);
    });
  } else {
    event = this;
    return this.apply(function () {
      return f(event.value());
    });
  }
};

Next.prototype.apply = function (value) {
  return new Next(value);
};
Next.prototype.filter = function (f) {
  return f(this.value());
};
Next.prototype.toString = function () {
  return _.toString(this.value());
};
Next.prototype.log = function () {
  return this.value();
};
Next.prototype._isNext = true;

function Initial(valueF, eager) {
  if (!(this instanceof Initial)) {
    return new Initial(valueF, eager);
  }
  Next.call(this, valueF, eager);
}

inherit(Initial, Next);
Initial.prototype._isInitial = true;
Initial.prototype.isInitial = function () {
  return true;
};
Initial.prototype.isNext = function () {
  return false;
};
Initial.prototype.apply = function (value) {
  return new Initial(value);
};
Initial.prototype.toNext = function () {
  return new Next(this);
};

function End() {
  if (!(this instanceof End)) {
    return new End();
  }
  Event.call(this);
}

inherit(End, Event);
End.prototype.isEnd = function () {
  return true;
};
End.prototype.fmap = function () {
  return this;
};
End.prototype.apply = function () {
  return this;
};
End.prototype.toString = function () {
  return "<end>";
};

function Error(error) {
  if (!(this instanceof Error)) {
    return new Error(error);
  }
  this.error = error;
  Event.call(this);
}

inherit(Error, Event);
Error.prototype.isError = function () {
  return true;
};
Error.prototype.fmap = function () {
  return this;
};
Error.prototype.apply = function () {
  return this;
};
Error.prototype.toString = function () {
  return "<error> " + _.toString(this.error);
};

Bacon.Event = Event;
Bacon.Initial = Initial;
Bacon.Next = Next;
Bacon.End = End;
Bacon.Error = Error;

var initialEvent = function (value) {
  return new Initial(value, true);
};
var nextEvent = function (value) {
  return new Next(value, true);
};
var endEvent = function () {
  return new End();
};
var toEvent = function (x) {
  if (x && x._isEvent) {
    return x;
  } else {
    return nextEvent(x);
  }
};

var idCounter = 0;
var registerObs = function () {};

function Observable(desc) {
  this.desc = desc;
  this.id = ++idCounter;
  this.initialDesc = this.desc;
}

extend(Observable.prototype, {
  _isObservable: true,

  subscribe: function (sink) {
    return UpdateBarrier.wrappedSubscribe(this, sink);
  },

  subscribeInternal: function (sink) {
    return this.dispatcher.subscribe(sink);
  },

  onValue: function () {
    var f = makeFunctionArgs(arguments);
    return this.subscribe(function (event) {
      if (event.hasValue()) {
        return f(event.value());
      }
    });
  },

  onValues: function (f) {
    return this.onValue(function (args) {
      return f.apply(undefined, args);
    });
  },

  onError: function () {
    var f = makeFunctionArgs(arguments);
    return this.subscribe(function (event) {
      if (event.isError()) {
        return f(event.error);
      }
    });
  },

  onEnd: function () {
    var f = makeFunctionArgs(arguments);
    return this.subscribe(function (event) {
      if (event.isEnd()) {
        return f();
      }
    });
  },

  name: function (name) {
    this._name = name;
    return this;
  },

  withDescription: function () {
    this.desc = describe.apply(undefined, arguments);
    return this;
  },

  toString: function () {
    if (this._name) {
      return this._name;
    } else {
      return this.desc.toString();
    }
  },

  internalDeps: function () {
    return this.initialDesc.deps();
  }
});

Observable.prototype.assign = Observable.prototype.onValue;
Observable.prototype.forEach = Observable.prototype.onValue;
Observable.prototype.inspect = Observable.prototype.toString;

Bacon.Observable = Observable;

function CompositeUnsubscribe() {
  var ss = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

  this.unsubscribe = _.bind(this.unsubscribe, this);
  this.unsubscribed = false;
  this.subscriptions = [];
  this.starting = [];
  for (var i = 0, s; i < ss.length; i++) {
    s = ss[i];
    this.add(s);
  }
}

extend(CompositeUnsubscribe.prototype, {
  add: function (subscription) {
    var _this2 = this;

    if (this.unsubscribed) {
      return;
    }
    var ended = false;
    var unsub = nop;
    this.starting.push(subscription);
    var unsubMe = function () {
      if (_this2.unsubscribed) {
        return;
      }
      ended = true;
      _this2.remove(unsub);
      return _.remove(subscription, _this2.starting);
    };
    unsub = subscription(this.unsubscribe, unsubMe);
    if (!(this.unsubscribed || ended)) {
      this.subscriptions.push(unsub);
    } else {
      unsub();
    }
    _.remove(subscription, this.starting);
    return unsub;
  },

  remove: function (unsub) {
    if (this.unsubscribed) {
      return;
    }
    if (_.remove(unsub, this.subscriptions) !== undefined) {
      return unsub();
    }
  },

  unsubscribe: function () {
    if (this.unsubscribed) {
      return;
    }
    this.unsubscribed = true;
    var iterable = this.subscriptions;
    for (var i = 0; i < iterable.length; i++) {
      iterable[i]();
    }
    this.subscriptions = [];
    this.starting = [];
    return [];
  },

  count: function () {
    if (this.unsubscribed) {
      return 0;
    }
    return this.subscriptions.length + this.starting.length;
  },

  empty: function () {
    return this.count() === 0;
  }
});

Bacon.CompositeUnsubscribe = CompositeUnsubscribe;

function Dispatcher(_subscribe, _handleEvent) {
  this._subscribe = _subscribe;
  this._handleEvent = _handleEvent;
  this.subscribe = _.bind(this.subscribe, this);
  this.handleEvent = _.bind(this.handleEvent, this);
  this.pushing = false;
  this.ended = false;
  this.prevError = undefined;
  this.unsubSrc = undefined;
  this.subscriptions = [];
  this.queue = [];
}

Dispatcher.prototype.hasSubscribers = function () {
  return this.subscriptions.length > 0;
};

Dispatcher.prototype.removeSub = function (subscription) {
  this.subscriptions = _.without(subscription, this.subscriptions);
  return this.subscriptions;
};

Dispatcher.prototype.push = function (event) {
  if (event.isEnd()) {
    this.ended = true;
  }
  return UpdateBarrier.inTransaction(event, this, this.pushIt, [event]);
};

Dispatcher.prototype.pushToSubscriptions = function (event) {
  try {
    var tmp = this.subscriptions;
    var len = tmp.length;
    for (var i = 0; i < len; i++) {
      var sub = tmp[i];
      var reply = sub.sink(event);
      if (reply === Bacon.noMore || event.isEnd()) {
        this.removeSub(sub);
      }
    }
    return true;
  } catch (error) {
    this.pushing = false;
    this.queue = [];
    throw error;
  }
};

Dispatcher.prototype.pushIt = function (event) {
  if (!this.pushing) {
    if (event === this.prevError) {
      return;
    }
    if (event.isError()) {
      this.prevError = event;
    }
    this.pushing = true;
    this.pushToSubscriptions(event);
    this.pushing = false;
    while (this.queue.length) {
      event = this.queue.shift();
      this.push(event);
    }
    if (this.hasSubscribers()) {
      return Bacon.more;
    } else {
      this.unsubscribeFromSource();
      return Bacon.noMore;
    }
  } else {
    this.queue.push(event);
    return Bacon.more;
  }
};

Dispatcher.prototype.handleEvent = function (event) {
  if (this._handleEvent) {
    return this._handleEvent(event);
  } else {
    return this.push(event);
  }
};

Dispatcher.prototype.unsubscribeFromSource = function () {
  if (this.unsubSrc) {
    this.unsubSrc();
  }
  this.unsubSrc = undefined;
};

Dispatcher.prototype.subscribe = function (sink) {
  var subscription;
  if (this.ended) {
    sink(endEvent());
    return nop;
  } else {
    assertFunction(sink);
    subscription = {
      sink: sink
    };
    this.subscriptions.push(subscription);
    if (this.subscriptions.length === 1) {
      this.unsubSrc = this._subscribe(this.handleEvent);
      assertFunction(this.unsubSrc);
    }
    return (function (_this) {
      return function () {
        _this.removeSub(subscription);
        if (!_this.hasSubscribers()) {
          return _this.unsubscribeFromSource();
        }
      };
    })(this);
  }
};

Bacon.Dispatcher = Dispatcher;

function EventStream(desc, subscribe, handler) {
  if (!(this instanceof EventStream)) {
    return new EventStream(desc, subscribe, handler);
  }
  if (_.isFunction(desc)) {
    handler = subscribe;
    subscribe = desc;
    desc = Desc.empty;
  }
  Observable.call(this, desc);
  assertFunction(subscribe);
  this.dispatcher = new Dispatcher(subscribe, handler);
  registerObs(this);
}

inherit(EventStream, Observable);
extend(EventStream.prototype, {
  _isEventStream: true,

  toProperty: function (initValue_) {
    var initValue = arguments.length === 0 ? None : toOption(function () {
      return initValue_;
    });
    var disp = this.dispatcher;
    var desc = new Bacon.Desc(this, "toProperty", [initValue_]);
    return new Property(desc, function (sink) {
      var initSent = false;
      var subbed = false;
      var unsub = nop;
      var reply = Bacon.more;
      var sendInit = function () {
        if (!initSent) {
          return initValue.forEach(function (value) {
            initSent = true;
            reply = sink(new Initial(value));
            if (reply === Bacon.noMore) {
              unsub();
              unsub = nop;
              return nop;
            }
          });
        }
      };

      unsub = disp.subscribe(function (event) {
        if (event.hasValue()) {
          if (event.isInitial() && !subbed) {
            initValue = new Some(function () {
              return event.value();
            });
            return Bacon.more;
          } else {
            if (!event.isInitial()) {
              sendInit();
            }
            initSent = true;
            initValue = new Some(event);
            return sink(event);
          }
        } else {
          if (event.isEnd()) {
            reply = sendInit();
          }
          if (reply !== Bacon.noMore) {
            return sink(event);
          }
        }
      });
      subbed = true;
      sendInit();
      return unsub;
    });
  },

  toEventStream: function () {
    return this;
  },

  withHandler: function (handler) {
    return new EventStream(new Bacon.Desc(this, "withHandler", [handler]), this.dispatcher.subscribe, handler);
  }
});

Bacon.EventStream = EventStream;

Bacon.never = function () {
  return new EventStream(describe(Bacon, "never"), function (sink) {
    sink(endEvent());
    return nop;
  });
};

Bacon.when = function () {
  if (arguments.length === 0) {
    return Bacon.never();
  }
  var len = arguments.length;
  var usage = "when: expecting arguments in the form (Observable+,function)+";

  assert(usage, len % 2 === 0);
  var sources = [];
  var pats = [];
  var i = 0;
  var patterns = [];
  while (i < len) {
    patterns[i] = arguments[i];
    patterns[i + 1] = arguments[i + 1];
    var patSources = _.toArray(arguments[i]);
    var f = constantToFunction(arguments[i + 1]);
    var pat = { f: f, ixs: [] };
    var triggerFound = false;
    for (var j = 0, s; j < patSources.length; j++) {
      s = patSources[j];
      var index = _.indexOf(sources, s);
      if (!triggerFound) {
        triggerFound = Source.isTrigger(s);
      }
      if (index < 0) {
        sources.push(s);
        index = sources.length - 1;
      }
      for (var k = 0, ix; k < pat.ixs.length; k++) {
        ix = pat.ixs[k];
        if (ix.index === index) {
          ix.count++;
        }
      }
      pat.ixs.push({ index: index, count: 1 });
    }

    assert("At least one EventStream required", triggerFound || !patSources.length);

    if (patSources.length > 0) {
      pats.push(pat);
    }
    i = i + 2;
  }

  if (!sources.length) {
    return Bacon.never();
  }

  sources = _.map(Source.fromObservable, sources);
  var needsBarrier = _.any(sources, function (s) {
    return s.flatten;
  }) && containsDuplicateDeps(_.map(function (s) {
    return s.obs;
  }, sources));

  var desc = new Bacon.Desc(Bacon, "when", patterns);
  var resultStream = new EventStream(desc, function (sink) {
    var triggers = [];
    var ends = false;
    var match = function (p) {
      for (var i1 = 0, i; i1 < p.ixs.length; i1++) {
        i = p.ixs[i1];
        if (!sources[i.index].hasAtLeast(i.count)) {
          return false;
        }
      }
      return true;
    };
    var cannotSync = function (source) {
      return !source.sync || source.ended;
    };
    var cannotMatch = function (p) {
      for (var i1 = 0, i; i1 < p.ixs.length; i1++) {
        i = p.ixs[i1];
        if (!sources[i.index].mayHave(i.count)) {
          return true;
        }
      }
    };
    var nonFlattened = function (trigger) {
      return !trigger.source.flatten;
    };
    var part = function (source) {
      return function (unsubAll) {
        var flushLater = function () {
          return UpdateBarrier.whenDoneWith(resultStream, flush);
        };
        var flushWhileTriggers = function () {
          if (triggers.length > 0) {
            var reply = Bacon.more;
            var trigger = triggers.pop();
            for (var i1 = 0, p; i1 < pats.length; i1++) {
              p = pats[i1];
              if (match(p)) {
                var events = (function () {
                  var result = [];
                  for (var i2 = 0, i; i2 < p.ixs.length; i2++) {
                    i = p.ixs[i2];
                    result.push(sources[i.index].consume());
                  }
                  return result;
                })();
                reply = sink(trigger.e.apply(function () {
                  var _p;

                  var values = (function () {
                    var result = [];
                    for (var i2 = 0, event; i2 < events.length; i2++) {
                      event = events[i2];
                      result.push(event.value());
                    }
                    return result;
                  })();

                  return (_p = p).f.apply(_p, values);
                }));
                if (triggers.length) {
                  triggers = _.filter(nonFlattened, triggers);
                }
                if (reply === Bacon.noMore) {
                  return reply;
                } else {
                  return flushWhileTriggers();
                }
              }
            }
          } else {
            return Bacon.more;
          }
        };
        var flush = function () {
          var reply = flushWhileTriggers();
          if (ends) {
            if (_.all(sources, cannotSync) || _.all(pats, cannotMatch)) {
              reply = Bacon.noMore;
              sink(endEvent());
            }
          }
          if (reply === Bacon.noMore) {
            unsubAll();
          }

          return reply;
        };
        return source.subscribe(function (e) {
          if (e.isEnd()) {
            ends = true;
            source.markEnded();
            flushLater();
          } else if (e.isError()) {
            var reply = sink(e);
          } else {
            source.push(e);
            if (source.sync) {
              triggers.push({ source: source, e: e });
              if (needsBarrier || UpdateBarrier.hasWaiters()) {
                flushLater();
              } else {
                flush();
              }
            }
          }
          if (reply === Bacon.noMore) {
            unsubAll();
          }
          return reply || Bacon.more;
        });
      };
    };

    return new Bacon.CompositeUnsubscribe((function () {
      var result = [];
      for (var i1 = 0, s; i1 < sources.length; i1++) {
        s = sources[i1];
        result.push(part(s));
      }
      return result;
    })()).unsubscribe;
  });
  return resultStream;
};

var containsDuplicateDeps = function (observables) {
  var state = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  var checkObservable = function (obs) {
    if (_.contains(state, obs)) {
      return true;
    } else {
      var deps = obs.internalDeps();
      if (deps.length) {
        state.push(obs);
        return _.any(deps, checkObservable);
      } else {
        state.push(obs);
        return false;
      }
    }
  };

  return _.any(observables, checkObservable);
};

var constantToFunction = function (f) {
  if (_.isFunction(f)) {
    return f;
  } else {
    return _.always(f);
  }
};

Bacon.groupSimultaneous = function () {
  for (var _len5 = arguments.length, streams = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    streams[_key5] = arguments[_key5];
  }

  if (streams.length === 1 && isArray(streams[0])) {
    streams = streams[0];
  }
  var sources = (function () {
    var result = [];
    for (var i = 0, s; i < streams.length; i++) {
      s = streams[i];
      result.push(new BufferingSource(s));
    }
    return result;
  })();
  return withDesc(new Bacon.Desc(Bacon, "groupSimultaneous", streams), Bacon.when(sources, function () {
    for (var _len6 = arguments.length, xs = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      xs[_key6] = arguments[_key6];
    }

    return xs;
  }));
};

function PropertyDispatcher(property, subscribe, handleEvent) {
  Dispatcher.call(this, subscribe, handleEvent);
  this.property = property;
  this.subscribe = _.bind(this.subscribe, this);
  this.current = None;
  this.currentValueRootId = undefined;
  this.propertyEnded = false;
}

inherit(PropertyDispatcher, Dispatcher);
extend(PropertyDispatcher.prototype, {
  push: function (event) {
    if (event.isEnd()) {
      this.propertyEnded = true;
    }
    if (event.hasValue()) {
      this.current = new Some(event);
      this.currentValueRootId = UpdateBarrier.currentEventId();
    }
    return Dispatcher.prototype.push.call(this, event);
  },

  maybeSubSource: function (sink, reply) {
    if (reply === Bacon.noMore) {
      return nop;
    } else if (this.propertyEnded) {
      sink(endEvent());
      return nop;
    } else {
      return Dispatcher.prototype.subscribe.call(this, sink);
    }
  },

  subscribe: function (sink) {
    var _this3 = this;

    var initSent = false;

    var reply = Bacon.more;

    if (this.current.isDefined && (this.hasSubscribers() || this.propertyEnded)) {
      var dispatchingId = UpdateBarrier.currentEventId();
      var valId = this.currentValueRootId;
      if (!this.propertyEnded && valId && dispatchingId && dispatchingId !== valId) {
        UpdateBarrier.whenDoneWith(this.property, function () {
          if (_this3.currentValueRootId === valId) {
            return sink(initialEvent(_this3.current.get().value()));
          }
        });

        return this.maybeSubSource(sink, reply);
      } else {
        UpdateBarrier.inTransaction(undefined, this, function () {
          reply = sink(initialEvent(this.current.get().value()));
          return reply;
        }, []);
        return this.maybeSubSource(sink, reply);
      }
    } else {
      return this.maybeSubSource(sink, reply);
    }
  }
});

function Property(desc, subscribe, handler) {
  Observable.call(this, desc);
  assertFunction(subscribe);
  this.dispatcher = new PropertyDispatcher(this, subscribe, handler);
  registerObs(this);
}

inherit(Property, Observable);
extend(Property.prototype, {
  _isProperty: true,

  changes: function () {
    var _this4 = this;

    return new EventStream(new Bacon.Desc(this, "changes", []), function (sink) {
      return _this4.dispatcher.subscribe(function (event) {
        if (!event.isInitial()) {
          return sink(event);
        }
      });
    });
  },

  withHandler: function (handler) {
    return new Property(new Bacon.Desc(this, "withHandler", [handler]), this.dispatcher.subscribe, handler);
  },

  toProperty: function () {
    assertNoArguments(arguments);
    return this;
  },

  toEventStream: function () {
    var _this5 = this;

    return new EventStream(new Bacon.Desc(this, "toEventStream", []), function (sink) {
      return _this5.dispatcher.subscribe(function (event) {
        if (event.isInitial()) {
          event = event.toNext();
        }
        return sink(event);
      });
    });
  }
});

Bacon.Property = Property;

Bacon.constant = function (value) {
  return new Property(new Bacon.Desc(Bacon, "constant", [value]), function (sink) {
    sink(initialEvent(value));
    sink(endEvent());
    return nop;
  });
};

Bacon.fromBinder = function (binder) {
  var eventTransformer = arguments.length <= 1 || arguments[1] === undefined ? _.id : arguments[1];

  var desc = new Bacon.Desc(Bacon, "fromBinder", [binder, eventTransformer]);
  return new EventStream(desc, function (sink) {
    var unbound = false;
    var shouldUnbind = false;
    var unbind = function () {
      if (!unbound) {
        if (typeof unbinder !== "undefined" && unbinder !== null) {
          unbinder();
          return unbound = true;
        } else {
          return shouldUnbind = true;
        }
      }
    };
    var unbinder = binder(function () {
      var ref;

      for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }

      var value = eventTransformer.apply(this, args);
      if (!(isArray(value) && ((ref = _.last(value)) != null ? ref._isEvent : undefined))) {
        value = [value];
      }
      var reply = Bacon.more;
      for (var i = 0, event; i < value.length; i++) {
        event = value[i];
        reply = sink(event = toEvent(event));
        if (reply === Bacon.noMore || event.isEnd()) {
          unbind();
          return reply;
        }
      }
      return reply;
    });
    if (shouldUnbind) {
      unbind();
    }
    return unbind;
  });
};

Bacon.Observable.prototype.map = function (p) {
  for (var _len8 = arguments.length, args = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
    args[_key8 - 1] = arguments[_key8];
  }

  return convertArgsToFunction(this, p, args, function (f) {
    return withDesc(new Bacon.Desc(this, "map", [f]), this.withHandler(function (event) {
      return this.push(event.fmap(f));
    }));
  });
};

var argumentsToObservables = function (args) {
  if (isArray(args[0])) {
    return args[0];
  } else {
    return Array.prototype.slice.call(args);
  }
};

var argumentsToObservablesAndFunction = function (args) {
  if (_.isFunction(args[0])) {
    return [argumentsToObservables(Array.prototype.slice.call(args, 1)), args[0]];
  } else {
    return [argumentsToObservables(Array.prototype.slice.call(args, 0, args.length - 1)), _.last(args)];
  }
};

Bacon.combineAsArray = function () {
  var streams = argumentsToObservables(arguments);
  for (var index = 0, stream; index < streams.length; index++) {
    stream = streams[index];
    if (!isObservable(stream)) {
      streams[index] = Bacon.constant(stream);
    }
  }
  if (streams.length) {
    var sources = (function () {
      var result = [];
      for (var i = 0, s; i < streams.length; i++) {
        s = streams[i];
        result.push(new Source(s, true));
      }
      return result;
    })();
    return withDesc(new Bacon.Desc(Bacon, "combineAsArray", streams), Bacon.when(sources, function () {
      for (var _len9 = arguments.length, xs = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        xs[_key9] = arguments[_key9];
      }

      return xs;
    }).toProperty());
  } else {
    return Bacon.constant([]);
  }
};

Bacon.onValues = function () {
  for (var _len10 = arguments.length, streams = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
    streams[_key10] = arguments[_key10];
  }

  return Bacon.combineAsArray(streams.slice(0, streams.length - 1)).onValues(streams[streams.length - 1]);
};

Bacon.combineWith = function () {
  var _argumentsToObservablesAndFunction = argumentsToObservablesAndFunction(arguments);

  var streams = _argumentsToObservablesAndFunction[0];
  var f = _argumentsToObservablesAndFunction[1];

  var desc = new Bacon.Desc(Bacon, "combineWith", [f].concat(streams));
  return withDesc(desc, Bacon.combineAsArray(streams).map(function (values) {
    return f.apply(undefined, values);
  }));
};

Bacon.Observable.prototype.combine = function (other, f) {
  var combinator = toCombinator(f);
  var desc = new Bacon.Desc(this, "combine", [other, f]);
  return withDesc(desc, Bacon.combineAsArray(this, other).map(function (values) {
    return combinator(values[0], values[1]);
  }));
};

Bacon.Observable.prototype.withStateMachine = function (initState, f) {
  var state = initState;
  var desc = new Bacon.Desc(this, "withStateMachine", [initState, f]);
  return withDesc(desc, this.withHandler(function (event) {
    var fromF = f(state, event);
    var newState = fromF[0];
    var outputs = fromF[1];

    state = newState;
    var reply = Bacon.more;
    for (var i = 0, output; i < outputs.length; i++) {
      output = outputs[i];
      reply = this.push(output);
      if (reply === Bacon.noMore) {
        return reply;
      }
    }
    return reply;
  }));
};

var equals = function (a, b) {
  return a === b;
};

var isNone = function (object) {
  return typeof object !== "undefined" && object !== null ? object._isNone : false;
};

Bacon.Observable.prototype.skipDuplicates = function () {
  var isEqual = arguments.length <= 0 || arguments[0] === undefined ? equals : arguments[0];

  var desc = new Bacon.Desc(this, "skipDuplicates", []);
  return withDesc(desc, this.withStateMachine(None, function (prev, event) {
    if (!event.hasValue()) {
      return [prev, [event]];
    } else if (event.isInitial() || isNone(prev) || !isEqual(prev.get(), event.value())) {
      return [new Some(event.value()), [event]];
    } else {
      return [prev, []];
    }
  }));
};

Bacon.Observable.prototype.awaiting = function (other) {
  var desc = new Bacon.Desc(this, "awaiting", [other]);
  return withDesc(desc, Bacon.groupSimultaneous(this, other).map(function (values) {
    return values[1].length === 0;
  }).toProperty(false).skipDuplicates());
};

Bacon.Observable.prototype.not = function () {
  return withDesc(new Bacon.Desc(this, "not", []), this.map(function (x) {
    return !x;
  }));
};

Bacon.Property.prototype.and = function (other) {
  return withDesc(new Bacon.Desc(this, "and", [other]), this.combine(other, function (x, y) {
    return x && y;
  }));
};

Bacon.Property.prototype.or = function (other) {
  return withDesc(new Bacon.Desc(this, "or", [other]), this.combine(other, function (x, y) {
    return x || y;
  }));
};

Bacon.scheduler = {
  setTimeout: function (f, d) {
    return setTimeout(f, d);
  },
  setInterval: function (f, i) {
    return setInterval(f, i);
  },
  clearInterval: function (id) {
    return clearInterval(id);
  },
  clearTimeout: function (id) {
    return clearTimeout(id);
  },
  now: function () {
    return new Date().getTime();
  }
};

Bacon.EventStream.prototype.bufferWithTime = function (delay) {
  return withDesc(new Bacon.Desc(this, "bufferWithTime", [delay]), this.bufferWithTimeOrCount(delay, Number.MAX_VALUE));
};

Bacon.EventStream.prototype.bufferWithCount = function (count) {
  return withDesc(new Bacon.Desc(this, "bufferWithCount", [count]), this.bufferWithTimeOrCount(undefined, count));
};

Bacon.EventStream.prototype.bufferWithTimeOrCount = function (delay, count) {
  var flushOrSchedule = function (buffer) {
    if (buffer.values.length === count) {
      return buffer.flush();
    } else if (delay !== undefined) {
      return buffer.schedule();
    }
  };
  var desc = new Bacon.Desc(this, "bufferWithTimeOrCount", [delay, count]);
  return withDesc(desc, this.buffer(delay, flushOrSchedule, flushOrSchedule));
};

Bacon.EventStream.prototype.buffer = function (delay) {
  var onInput = arguments.length <= 1 || arguments[1] === undefined ? nop : arguments[1];
  var onFlush = arguments.length <= 2 || arguments[2] === undefined ? nop : arguments[2];

  var buffer = {
    scheduled: null,
    end: undefined,
    values: [],
    flush: function () {
      if (this.scheduled) {
        Bacon.scheduler.clearTimeout(this.scheduled);
        this.scheduled = null;
      }
      if (this.values.length > 0) {
        var valuesToPush = this.values;
        this.values = [];
        var reply = this.push(nextEvent(valuesToPush));
        if (this.end != null) {
          return this.push(this.end);
        } else if (reply !== Bacon.noMore) {
          return onFlush(this);
        }
      } else {
        if (this.end != null) {
          return this.push(this.end);
        }
      }
    },
    schedule: function () {
      var _this6 = this;

      if (!this.scheduled) {
        return this.scheduled = delay(function () {
          return _this6.flush();
        });
      }
    }
  };
  var reply = Bacon.more;
  if (!_.isFunction(delay)) {
    var delayMs = delay;
    delay = function (f) {
      return Bacon.scheduler.setTimeout(f, delayMs);
    };
  }
  return withDesc(new Bacon.Desc(this, "buffer", []), this.withHandler(function (event) {
    var _this7 = this;

    buffer.push = function (event) {
      return _this7.push(event);
    };
    if (event.isError()) {
      reply = this.push(event);
    } else if (event.isEnd()) {
      buffer.end = event;
      if (!buffer.scheduled) {
        buffer.flush();
      }
    } else {
      buffer.values.push(event.value());

      onInput(buffer);
    }
    return reply;
  }));
};

Bacon.Observable.prototype.filter = function (f) {
  assertObservableIsProperty(f);

  for (var _len11 = arguments.length, args = Array(_len11 > 1 ? _len11 - 1 : 0), _key11 = 1; _key11 < _len11; _key11++) {
    args[_key11 - 1] = arguments[_key11];
  }

  return convertArgsToFunction(this, f, args, function (f) {
    return withDesc(new Bacon.Desc(this, "filter", [f]), this.withHandler(function (event) {
      if (event.filter(f)) {
        return this.push(event);
      } else {
        return Bacon.more;
      }
    }));
  });
};

Bacon.once = function (value) {
  return new EventStream(new Desc(Bacon, "once", [value]), function (sink) {
    sink(toEvent(value));
    sink(endEvent());
    return nop;
  });
};

Bacon.EventStream.prototype.concat = function (right) {
  var left = this;
  return new EventStream(new Bacon.Desc(left, "concat", [right]), function (sink) {
    var unsubRight = nop;
    var unsubLeft = left.dispatcher.subscribe(function (e) {
      if (e.isEnd()) {
        unsubRight = right.dispatcher.subscribe(sink);
        return unsubRight;
      } else {
        return sink(e);
      }
    });
    return function () {
      return (unsubLeft(), unsubRight());
    };
  });
};

Bacon.Observable.prototype.flatMap = function () {
  return flatMap_(this, makeSpawner(arguments));
};

Bacon.Observable.prototype.flatMapFirst = function () {
  return flatMap_(this, makeSpawner(arguments), true);
};

var makeSpawner = function (args) {
  if (args.length === 1 && isObservable(args[0])) {
    return _.always(args[0]);
  } else {
    return makeFunctionArgs(args);
  }
};

var makeObservable = function (x) {
  if (isObservable(x)) {
    return x;
  } else {
    return Bacon.once(x);
  }
};

var flatMap_ = function (root, f, firstOnly, limit) {
  var rootDep = [root];
  var childDeps = [];
  var desc = new Bacon.Desc(root, "flatMap" + (firstOnly ? "First" : ""), [f]);
  var result = new EventStream(desc, function (sink) {
    var composite = new CompositeUnsubscribe();
    var queue = [];
    var spawn = function (event) {
      var child = makeObservable(f(event.value()));
      childDeps.push(child);
      return composite.add(function (unsubAll, unsubMe) {
        return child.dispatcher.subscribe(function (event) {
          if (event.isEnd()) {
            _.remove(child, childDeps);
            checkQueue();
            checkEnd(unsubMe);
            return Bacon.noMore;
          } else {
            if (typeof event !== "undefined" && event !== null ? event._isInitial : undefined) {
              event = event.toNext();
            }
            var reply = sink(event);
            if (reply === Bacon.noMore) {
              unsubAll();
            }
            return reply;
          }
        });
      });
    };
    var checkQueue = function () {
      var event = queue.shift();
      if (event) {
        return spawn(event);
      }
    };
    var checkEnd = function (unsub) {
      unsub();
      if (composite.empty()) {
        return sink(endEvent());
      }
    };
    composite.add(function (__, unsubRoot) {
      return root.dispatcher.subscribe(function (event) {
        if (event.isEnd()) {
          return checkEnd(unsubRoot);
        } else if (event.isError()) {
          return sink(event);
        } else if (firstOnly && composite.count() > 1) {
          return Bacon.more;
        } else {
          if (composite.unsubscribed) {
            return Bacon.noMore;
          }
          if (limit && composite.count() > limit) {
            return queue.push(event);
          } else {
            return spawn(event);
          }
        }
      });
    });
    return composite.unsubscribe;
  });
  result.internalDeps = function () {
    if (childDeps.length) {
      return rootDep.concat(childDeps);
    } else {
      return rootDep;
    }
  };
  return result;
};

Bacon.Observable.prototype.flatMapWithConcurrencyLimit = function (limit) {
  for (var _len12 = arguments.length, args = Array(_len12 > 1 ? _len12 - 1 : 0), _key12 = 1; _key12 < _len12; _key12++) {
    args[_key12 - 1] = arguments[_key12];
  }

  var desc = new Bacon.Desc(this, "flatMapWithConcurrencyLimit", [limit].concat(args));
  return withDesc(desc, flatMap_(this, makeSpawner(args), false, limit));
};

Bacon.Observable.prototype.flatMapConcat = function () {
  var desc = new Bacon.Desc(this, "flatMapConcat", Array.prototype.slice.call(arguments, 0));
  return withDesc(desc, this.flatMapWithConcurrencyLimit.apply(this, [1].concat(_slice.call(arguments))));
};

Bacon.later = function (delay, value) {
  return withDesc(new Bacon.Desc(Bacon, "later", [delay, value]), Bacon.fromBinder(function (sink) {
    var sender = function () {
      return sink([value, endEvent()]);
    };
    var id = Bacon.scheduler.setTimeout(sender, delay);
    return function () {
      return Bacon.scheduler.clearTimeout(id);
    };
  }));
};

Bacon.Observable.prototype.bufferingThrottle = function (minimumInterval) {
  var desc = new Bacon.Desc(this, "bufferingThrottle", [minimumInterval]);
  return withDesc(desc, this.flatMapConcat(function (x) {
    return Bacon.once(x).concat(Bacon.later(minimumInterval).filter(false));
  }));
};

Bacon.Property.prototype.bufferingThrottle = function () {
  return Bacon.Observable.prototype.bufferingThrottle.apply(this, arguments).toProperty();
};

function Bus() {
  if (!(this instanceof Bus)) {
    return new Bus();
  }

  this.unsubAll = _.bind(this.unsubAll, this);
  this.subscribeAll = _.bind(this.subscribeAll, this);
  this.guardedSink = _.bind(this.guardedSink, this);

  this.sink = undefined;
  this.subscriptions = [];
  this.ended = false;
  EventStream.call(this, new Bacon.Desc(Bacon, "Bus", []), this.subscribeAll);
}

inherit(Bus, EventStream);
extend(Bus.prototype, {
  unsubAll: function () {
    var iterable = this.subscriptions;
    for (var i = 0, sub; i < iterable.length; i++) {
      sub = iterable[i];
      if (typeof sub.unsub === "function") {
        sub.unsub();
      }
    }
  },

  subscribeAll: function (newSink) {
    if (this.ended) {
      newSink(endEvent());
    } else {
      this.sink = newSink;
      var iterable = cloneArray(this.subscriptions);
      for (var i = 0, subscription; i < iterable.length; i++) {
        subscription = iterable[i];
        this.subscribeInput(subscription);
      }
    }
    return this.unsubAll;
  },

  guardedSink: function (input) {
    var _this8 = this;

    return function (event) {
      if (event.isEnd()) {
        _this8.unsubscribeInput(input);
        return Bacon.noMore;
      } else {
        return _this8.sink(event);
      }
    };
  },

  subscribeInput: function (subscription) {
    subscription.unsub = subscription.input.dispatcher.subscribe(this.guardedSink(subscription.input));
    return subscription.unsub;
  },

  unsubscribeInput: function (input) {
    var iterable = this.subscriptions;
    for (var i = 0, sub; i < iterable.length; i++) {
      sub = iterable[i];
      if (sub.input === input) {
        if (typeof sub.unsub === "function") {
          sub.unsub();
        }
        this.subscriptions.splice(i, 1);
        return;
      }
    }
  },

  plug: function (input) {
    var _this9 = this;

    assertObservable(input);
    if (this.ended) {
      return;
    }
    var sub = { input: input };
    this.subscriptions.push(sub);
    if (typeof this.sink !== "undefined") {
      this.subscribeInput(sub);
    }
    return function () {
      return _this9.unsubscribeInput(input);
    };
  },

  end: function () {
    this.ended = true;
    this.unsubAll();
    if (typeof this.sink === "function") {
      return this.sink(endEvent());
    }
  },

  push: function (value) {
    if (!this.ended && typeof this.sink === "function") {
      return this.sink(nextEvent(value));
    }
  },

  error: function (error) {
    if (typeof this.sink === "function") {
      return this.sink(new Error(error));
    }
  }
});

Bacon.Bus = Bus;

var liftCallback = function (desc, wrapped) {
  return withMethodCallSupport(function (f) {
    var stream = partiallyApplied(wrapped, [function (values, callback) {
      return f.apply(undefined, values.concat([callback]));
    }]);

    for (var _len13 = arguments.length, args = Array(_len13 > 1 ? _len13 - 1 : 0), _key13 = 1; _key13 < _len13; _key13++) {
      args[_key13 - 1] = arguments[_key13];
    }

    return withDesc(new Bacon.Desc(Bacon, desc, [f].concat(args)), Bacon.combineAsArray(args).flatMap(stream));
  });
};

Bacon.fromCallback = liftCallback("fromCallback", function (f) {
  for (var _len14 = arguments.length, args = Array(_len14 > 1 ? _len14 - 1 : 0), _key14 = 1; _key14 < _len14; _key14++) {
    args[_key14 - 1] = arguments[_key14];
  }

  return Bacon.fromBinder(function (handler) {
    makeFunction(f, args)(handler);
    return nop;
  }, function (value) {
    return [value, endEvent()];
  });
});

Bacon.fromNodeCallback = liftCallback("fromNodeCallback", function (f) {
  for (var _len15 = arguments.length, args = Array(_len15 > 1 ? _len15 - 1 : 0), _key15 = 1; _key15 < _len15; _key15++) {
    args[_key15 - 1] = arguments[_key15];
  }

  return Bacon.fromBinder(function (handler) {
    makeFunction(f, args)(handler);
    return nop;
  }, function (error, value) {
    if (error) {
      return [new Error(error), endEvent()];
    }
    return [value, endEvent()];
  });
});

Bacon.combineTemplate = function (template) {
  function current(ctxStack) {
    return ctxStack[ctxStack.length - 1];
  }
  function setValue(ctxStack, key, value) {
    current(ctxStack)[key] = value;
    return value;
  }
  function applyStreamValue(key, index) {
    return function (ctxStack, values) {
      return setValue(ctxStack, key, values[index]);
    };
  }
  function constantValue(key, value) {
    return function (ctxStack) {
      return setValue(ctxStack, key, value);
    };
  }

  function mkContext(template) {
    return isArray(template) ? [] : {};
  }

  function pushContext(key, value) {
    return function (ctxStack) {
      var newContext = mkContext(value);
      setValue(ctxStack, key, newContext);
      return ctxStack.push(newContext);
    };
  }

  function compile(key, value) {
    if (isObservable(value)) {
      streams.push(value);
      return funcs.push(applyStreamValue(key, streams.length - 1));
    } else if (value && (value.constructor == Object || value.constructor == Array)) {
      var popContext = function (ctxStack) {
        return ctxStack.pop();
      };
      funcs.push(pushContext(key, value));
      compileTemplate(value);
      return funcs.push(popContext);
    } else {
      return funcs.push(constantValue(key, value));
    }
  }

  function combinator(values) {
    var rootContext = mkContext(template);
    var ctxStack = [rootContext];
    for (var i = 0, f; i < funcs.length; i++) {
      f = funcs[i];
      f(ctxStack, values);
    }
    return rootContext;
  }

  function compileTemplate(template) {
    return _.each(template, compile);
  }

  var funcs = [];
  var streams = [];

  compileTemplate(template);

  return withDesc(new Bacon.Desc(Bacon, "combineTemplate", [template]), Bacon.combineAsArray(streams).map(combinator));
};

var addPropertyInitValueToStream = function (property, stream) {
  var justInitValue = new EventStream(describe(property, "justInitValue"), function (sink) {
    var value = undefined;
    var unsub = property.dispatcher.subscribe(function (event) {
      if (!event.isEnd()) {
        value = event;
      }
      return Bacon.noMore;
    });
    UpdateBarrier.whenDoneWith(justInitValue, function () {
      if (typeof value !== "undefined" && value !== null) {
        sink(value);
      }
      return sink(endEvent());
    });
    return unsub;
  });
  return justInitValue.concat(stream).toProperty();
};

Bacon.Observable.prototype.mapEnd = function () {
  var f = makeFunctionArgs(arguments);
  return withDesc(new Bacon.Desc(this, "mapEnd", [f]), this.withHandler(function (event) {
    if (event.isEnd()) {
      this.push(nextEvent(f(event)));
      this.push(endEvent());
      return Bacon.noMore;
    } else {
      return this.push(event);
    }
  }));
};

Bacon.Observable.prototype.skipErrors = function () {
  return withDesc(new Bacon.Desc(this, "skipErrors", []), this.withHandler(function (event) {
    if (event.isError()) {
      return Bacon.more;
    } else {
      return this.push(event);
    }
  }));
};

Bacon.EventStream.prototype.takeUntil = function (stopper) {
  var endMarker = {};
  return withDesc(new Bacon.Desc(this, "takeUntil", [stopper]), Bacon.groupSimultaneous(this.mapEnd(endMarker), stopper.skipErrors()).withHandler(function (event) {
    if (!event.hasValue()) {
      return this.push(event);
    } else {
      var _event$value = event.value();

      var data = _event$value[0];
      var stopper = _event$value[1];

      if (stopper.length) {
        return this.push(endEvent());
      } else {
        var reply = Bacon.more;
        for (var i = 0, value; i < data.length; i++) {
          value = data[i];
          if (value === endMarker) {
            reply = this.push(endEvent());
          } else {
            reply = this.push(nextEvent(value));
          }
        }
        return reply;
      }
    }
  }));
};

Bacon.Property.prototype.takeUntil = function (stopper) {
  var changes = this.changes().takeUntil(stopper);
  return withDesc(new Bacon.Desc(this, "takeUntil", [stopper]), addPropertyInitValueToStream(this, changes));
};

Bacon.Observable.prototype.flatMapLatest = function () {
  var f = makeSpawner(arguments);
  var stream = this.toEventStream();
  return withDesc(new Bacon.Desc(this, "flatMapLatest", [f]), stream.flatMap(function (value) {
    return makeObservable(f(value)).takeUntil(stream);
  }));
};

Bacon.Property.prototype.delayChanges = function (desc, f) {
  return withDesc(desc, addPropertyInitValueToStream(this, f(this.changes())));
};

Bacon.EventStream.prototype.delay = function (delay) {
  return withDesc(new Bacon.Desc(this, "delay", [delay]), this.flatMap(function (value) {
    return Bacon.later(delay, value);
  }));
};

Bacon.Property.prototype.delay = function (delay) {
  return this.delayChanges(new Bacon.Desc(this, "delay", [delay]), function (changes) {
    return changes.delay(delay);
  });
};

Bacon.EventStream.prototype.debounce = function (delay) {
  return withDesc(new Bacon.Desc(this, "debounce", [delay]), this.flatMapLatest(function (value) {
    return Bacon.later(delay, value);
  }));
};

Bacon.Property.prototype.debounce = function (delay) {
  return this.delayChanges(new Bacon.Desc(this, "debounce", [delay]), function (changes) {
    return changes.debounce(delay);
  });
};

Bacon.EventStream.prototype.debounceImmediate = function (delay) {
  return withDesc(new Bacon.Desc(this, "debounceImmediate", [delay]), this.flatMapFirst(function (value) {
    return Bacon.once(value).concat(Bacon.later(delay).filter(false));
  }));
};

Bacon.Observable.prototype.decode = function (cases) {
  return withDesc(new Bacon.Desc(this, "decode", [cases]), this.combine(Bacon.combineTemplate(cases), function (key, values) {
    return values[key];
  }));
};

Bacon.Observable.prototype.scan = function (seed, f) {
  var _this10 = this;

  var resultProperty;
  f = toCombinator(f);
  var acc = toOption(seed);
  var initHandled = false;
  var subscribe = function (sink) {
    var initSent = false;
    var unsub = nop;
    var reply = Bacon.more;
    var sendInit = function () {
      if (!initSent) {
        return acc.forEach(function (value) {
          initSent = initHandled = true;
          reply = sink(new Initial(function () {
            return value;
          }));
          if (reply === Bacon.noMore) {
            unsub();
            unsub = nop;
            return unsub;
          }
        });
      }
    };
    unsub = _this10.dispatcher.subscribe(function (event) {
      if (event.hasValue()) {
        if (initHandled && event.isInitial()) {
          return Bacon.more;
        } else {
            if (!event.isInitial()) {
              sendInit();
            }
            initSent = initHandled = true;
            var prev = acc.getOrElse(undefined);
            var next = f(prev, event.value());

            acc = new Some(next);
            return sink(event.apply(function () {
              return next;
            }));
          }
      } else {
        if (event.isEnd()) {
          reply = sendInit();
        }
        if (reply !== Bacon.noMore) {
          return sink(event);
        }
      }
    });
    UpdateBarrier.whenDoneWith(resultProperty, sendInit);
    return unsub;
  };
  resultProperty = new Property(new Bacon.Desc(this, "scan", [seed, f]), subscribe);
  return resultProperty;
};

Bacon.Observable.prototype.diff = function (start, f) {
  f = toCombinator(f);
  return withDesc(new Bacon.Desc(this, "diff", [start, f]), this.scan([start], function (prevTuple, next) {
    return [next, f(prevTuple[0], next)];
  }).filter(function (tuple) {
    return tuple.length === 2;
  }).map(function (tuple) {
    return tuple[1];
  }));
};

Bacon.Observable.prototype.doAction = function () {
  var f = makeFunctionArgs(arguments);
  return withDesc(new Bacon.Desc(this, "doAction", [f]), this.withHandler(function (event) {
    if (event.hasValue()) {
      f(event.value());
    }
    return this.push(event);
  }));
};

Bacon.Observable.prototype.doEnd = function () {
  var f = makeFunctionArgs(arguments);
  return withDesc(new Bacon.Desc(this, "doEnd", [f]), this.withHandler(function (event) {
    if (event.isEnd()) {
      f();
    }
    return this.push(event);
  }));
};

Bacon.Observable.prototype.doError = function () {
  var f = makeFunctionArgs(arguments);
  return withDesc(new Bacon.Desc(this, "doError", [f]), this.withHandler(function (event) {
    if (event.isError()) {
      f(event.error);
    }
    return this.push(event);
  }));
};

Bacon.Observable.prototype.doLog = function () {
  for (var _len16 = arguments.length, args = Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
    args[_key16] = arguments[_key16];
  }

  return withDesc(new Bacon.Desc(this, "doLog", args), this.withHandler(function (event) {
    if (typeof console !== "undefined" && console !== null && typeof console.log === "function") {
      console.log.apply(console, args.concat([event.log()]));
    }
    return this.push(event);
  }));
};

Bacon.Observable.prototype.endOnError = function (f) {
  if (!(typeof f !== "undefined" && f !== null)) {
    f = true;
  }

  for (var _len17 = arguments.length, args = Array(_len17 > 1 ? _len17 - 1 : 0), _key17 = 1; _key17 < _len17; _key17++) {
    args[_key17 - 1] = arguments[_key17];
  }

  return convertArgsToFunction(this, f, args, function (f) {
    return withDesc(new Bacon.Desc(this, "endOnError", []), this.withHandler(function (event) {
      if (event.isError() && f(event.error)) {
        this.push(event);
        return this.push(endEvent());
      } else {
        return this.push(event);
      }
    }));
  });
};

Observable.prototype.errors = function () {
  return withDesc(new Bacon.Desc(this, "errors", []), this.filter(function () {
    return false;
  }));
};

Bacon.Observable.prototype.take = function (count) {
  if (count <= 0) {
    return Bacon.never();
  }
  return withDesc(new Bacon.Desc(this, "take", [count]), this.withHandler(function (event) {
    if (!event.hasValue()) {
      return this.push(event);
    } else {
      count--;
      if (count > 0) {
        return this.push(event);
      } else {
        if (count === 0) {
          this.push(event);
        }
        this.push(endEvent());
        return Bacon.noMore;
      }
    }
  }));
};

Bacon.Observable.prototype.first = function () {
  return withDesc(new Bacon.Desc(this, "first", []), this.take(1));
};

Bacon.Observable.prototype.mapError = function () {
  var f = makeFunctionArgs(arguments);
  return withDesc(new Bacon.Desc(this, "mapError", [f]), this.withHandler(function (event) {
    if (event.isError()) {
      return this.push(nextEvent(f(event.error)));
    } else {
      return this.push(event);
    }
  }));
};

Bacon.Observable.prototype.flatMapError = function (fn) {
  var desc = new Bacon.Desc(this, "flatMapError", [fn]);
  return withDesc(desc, this.mapError(function (err) {
    return new Error(err);
  }).flatMap(function (x) {
    if (x instanceof Error) {
      return fn(x.error);
    } else {
      return Bacon.once(x);
    }
  }));
};

Bacon.EventStream.prototype.sampledBy = function (sampler, combinator) {
  return withDesc(new Bacon.Desc(this, "sampledBy", [sampler, combinator]), this.toProperty().sampledBy(sampler, combinator));
};

Bacon.Property.prototype.sampledBy = function (sampler, combinator) {
  var lazy = false;
  if (typeof combinator !== "undefined" && combinator !== null) {
    combinator = toCombinator(combinator);
  } else {
    lazy = true;
    combinator = function (f) {
      return f.value();
    };
  }
  var thisSource = new Source(this, false, lazy);
  var samplerSource = new Source(sampler, true, lazy);
  var stream = Bacon.when([thisSource, samplerSource], combinator);
  var result = sampler._isProperty ? stream.toProperty() : stream;
  return withDesc(new Bacon.Desc(this, "sampledBy", [sampler, combinator]), result);
};

Bacon.Property.prototype.sample = function (interval) {
  return withDesc(new Bacon.Desc(this, "sample", [interval]), this.sampledBy(Bacon.interval(interval, {})));
};

Bacon.Observable.prototype.map = function (p) {
  if (p && p._isProperty) {
    return p.sampledBy(this, former);
  } else {
    for (var _len18 = arguments.length, args = Array(_len18 > 1 ? _len18 - 1 : 0), _key18 = 1; _key18 < _len18; _key18++) {
      args[_key18 - 1] = arguments[_key18];
    }

    return convertArgsToFunction(this, p, args, function (f) {
      return withDesc(new Bacon.Desc(this, "map", [f]), this.withHandler(function (event) {
        return this.push(event.fmap(f));
      }));
    });
  }
};

Bacon.Observable.prototype.fold = function (seed, f) {
  return withDesc(new Bacon.Desc(this, "fold", [seed, f]), this.scan(seed, f).sampledBy(this.filter(false).mapEnd().toProperty()));
};

Observable.prototype.reduce = Observable.prototype.fold;

var eventMethods = [["addEventListener", "removeEventListener"], ["addListener", "removeListener"], ["on", "off"], ["bind", "unbind"]];

var findHandlerMethods = function (target) {
  var pair;
  for (var i = 0; i < eventMethods.length; i++) {
    pair = eventMethods[i];
    var methodPair = [target[pair[0]], target[pair[1]]];
    if (methodPair[0] && methodPair[1]) {
      return methodPair;
    }
  }
  for (var j = 0; j < eventMethods.length; j++) {
    pair = eventMethods[j];
    var addListener = target[pair[0]];
    if (addListener) {
      return [addListener, function () {}];
    }
  }
  throw new Error("No suitable event methods in " + target);
};

Bacon.fromEventTarget = function (target, eventName, eventTransformer) {
  var _findHandlerMethods = findHandlerMethods(target);

  var sub = _findHandlerMethods[0];
  var unsub = _findHandlerMethods[1];

  var desc = new Bacon.Desc(Bacon, "fromEvent", [target, eventName]);
  return withDesc(desc, Bacon.fromBinder(function (handler) {
    sub.call(target, eventName, handler);
    return function () {
      return unsub.call(target, eventName, handler);
    };
  }, eventTransformer));
};

Bacon.fromEvent = Bacon.fromEventTarget;

Bacon.fromPoll = function (delay, poll) {
  var desc = new Bacon.Desc(Bacon, "fromPoll", [delay, poll]);
  return withDesc(desc, Bacon.fromBinder(function (handler) {
    var id = Bacon.scheduler.setInterval(handler, delay);
    return function () {
      return Bacon.scheduler.clearInterval(id);
    };
  }, poll));
};

function valueAndEnd(value) {
  return [value, endEvent()];
}

Bacon.fromPromise = function (promise, abort) {
  var eventTransformer = arguments.length <= 2 || arguments[2] === undefined ? valueAndEnd : arguments[2];

  return withDesc(new Bacon.Desc(Bacon, "fromPromise", [promise]), Bacon.fromBinder(function (handler) {
    var bound = promise.then(handler, function (e) {
      return handler(new Error(e));
    });
    if (bound && typeof bound.done === "function") {
      bound.done();
    }

    if (abort) {
      return function () {
        if (typeof promise.abort === "function") {
          return promise.abort();
        }
      };
    } else {
      return function () {};
    }
  }, eventTransformer));
};

Bacon.Observable.prototype.groupBy = function (keyF) {
  var limitF = arguments.length <= 1 || arguments[1] === undefined ? Bacon._.id : arguments[1];

  var streams = {};
  var src = this;
  return src.filter(function (x) {
    return !streams[keyF(x)];
  }).map(function (x) {
    var key = keyF(x);
    var similar = src.filter(function (x) {
      return keyF(x) === key;
    });
    var data = Bacon.once(x).concat(similar);
    var limited = limitF(data, x).withHandler(function (event) {
      this.push(event);
      if (event.isEnd()) {
        return delete streams[key];
      }
    });
    streams[key] = limited;
    return limited;
  });
};

Bacon.fromArray = function (values) {
  assertArray(values);
  if (!values.length) {
    return withDesc(new Bacon.Desc(Bacon, "fromArray", values), Bacon.never());
  } else {
    var i = 0;
    return new EventStream(new Bacon.Desc(Bacon, "fromArray", [values]), function (sink) {
      var unsubd = false;
      var reply = Bacon.more;
      var pushing = false;
      var pushNeeded = false;
      var push = function () {
        pushNeeded = true;
        if (pushing) {
          return;
        }
        pushing = true;
        while (pushNeeded) {
          pushNeeded = false;
          if (reply !== Bacon.noMore && !unsubd) {
            var value = values[i++];
            reply = sink(toEvent(value));
            if (reply !== Bacon.noMore) {
              if (i === values.length) {
                sink(endEvent());
              } else {
                UpdateBarrier.afterTransaction(push);
              }
            }
          }
        }
        pushing = false;
        return pushing;
      };

      push();
      return function () {
        unsubd = true;
        return unsubd;
      };
    });
  }
};

Bacon.EventStream.prototype.holdWhen = function (valve) {
  var onHold = false;
  var bufferedValues = [];
  var src = this;
  var srcIsEnded = false;
  return new EventStream(new Bacon.Desc(this, "holdWhen", [valve]), function (sink) {
    var composite = new CompositeUnsubscribe();
    var subscribed = false;
    var endIfBothEnded = function (unsub) {
      if (typeof unsub === "function") {
        unsub();
      }
      if (composite.empty() && subscribed) {
        return sink(endEvent());
      }
    };
    composite.add(function (unsubAll, unsubMe) {
      return valve.subscribeInternal(function (event) {
        if (event.hasValue()) {
          onHold = event.value();
          if (!onHold) {
            var toSend = bufferedValues;
            bufferedValues = [];
            return (function () {
              var result = [];
              for (var i = 0, value; i < toSend.length; i++) {
                value = toSend[i];
                result.push(sink(nextEvent(value)));
              }
              if (srcIsEnded) {
                result.push(sink(endEvent()));
                unsubMe();
              }
              return result;
            })();
          }
        } else if (event.isEnd()) {
          return endIfBothEnded(unsubMe);
        } else {
          return sink(event);
        }
      });
    });
    composite.add(function (unsubAll, unsubMe) {
      return src.subscribeInternal(function (event) {
        if (onHold && event.hasValue()) {
          return bufferedValues.push(event.value());
        } else if (event.isEnd() && bufferedValues.length) {
          srcIsEnded = true;
          return endIfBothEnded(unsubMe);
        } else {
          return sink(event);
        }
      });
    });
    subscribed = true;
    endIfBothEnded();
    return composite.unsubscribe;
  });
};

Bacon.interval = function (delay) {
  var value = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return withDesc(new Bacon.Desc(Bacon, "interval", [delay, value]), Bacon.fromPoll(delay, function () {
    return nextEvent(value);
  }));
};

Bacon.$ = {};
Bacon.$.asEventStream = function (eventName, selector, eventTransformer) {
  var _this11 = this;

  if (_.isFunction(selector)) {
    eventTransformer = selector;
    selector = undefined;
  }

  return withDesc(new Bacon.Desc(this.selector || this, "asEventStream", [eventName]), Bacon.fromBinder(function (handler) {
    _this11.on(eventName, selector, handler);
    return function () {
      return _this11.off(eventName, selector, handler);
    };
  }, eventTransformer));
};

if (typeof jQuery !== "undefined" && jQuery) {
  jQuery.fn.asEventStream = Bacon.$.asEventStream;
}

if (typeof Zepto !== "undefined" && Zepto) {
  Zepto.fn.asEventStream = Bacon.$.asEventStream;
}

Bacon.Observable.prototype.last = function () {
  var lastEvent;

  return withDesc(new Bacon.Desc(this, "last", []), this.withHandler(function (event) {
    if (event.isEnd()) {
      if (lastEvent) {
        this.push(lastEvent);
      }
      this.push(endEvent());
      return Bacon.noMore;
    } else {
      lastEvent = event;
    }
  }));
};

Bacon.Observable.prototype.log = function () {
  for (var _len19 = arguments.length, args = Array(_len19), _key19 = 0; _key19 < _len19; _key19++) {
    args[_key19] = arguments[_key19];
  }

  this.subscribe(function (event) {
    if (typeof console !== "undefined" && typeof console.log === "function") {
      console.log.apply(console, args.concat([event.log()]));
    }
  });
  return this;
};

Bacon.EventStream.prototype.merge = function (right) {
  assertEventStream(right);
  var left = this;
  return withDesc(new Bacon.Desc(left, "merge", [right]), Bacon.mergeAll(this, right));
};

Bacon.mergeAll = function () {
  var streams = argumentsToObservables(arguments);
  if (streams.length) {
    return new EventStream(new Bacon.Desc(Bacon, "mergeAll", streams), function (sink) {
      var ends = 0;
      var smartSink = function (obs) {
        return function (unsubBoth) {
          return obs.dispatcher.subscribe(function (event) {
            if (event.isEnd()) {
              ends++;
              if (ends === streams.length) {
                return sink(endEvent());
              } else {
                return Bacon.more;
              }
            } else {
              var reply = sink(event);
              if (reply === Bacon.noMore) {
                unsubBoth();
              }
              return reply;
            }
          });
        };
      };
      var sinks = _.map(smartSink, streams);
      return new Bacon.CompositeUnsubscribe(sinks).unsubscribe;
    });
  } else {
    return Bacon.never();
  }
};

Bacon.repeatedly = function (delay, values) {
  var index = 0;
  return withDesc(new Bacon.Desc(Bacon, "repeatedly", [delay, values]), Bacon.fromPoll(delay, function () {
    return values[index++ % values.length];
  }));
};

Bacon.repeat = function (generator) {
  var index = 0;
  return Bacon.fromBinder(function (sink) {
    var flag = false;
    var reply = Bacon.more;
    var unsub = function () {};
    function handleEvent(event) {
      if (event.isEnd()) {
        if (!flag) {
          return flag = true;
        } else {
          return subscribeNext();
        }
      } else {
        return reply = sink(event);
      }
    };
    function subscribeNext() {
      var next;
      flag = true;
      while (flag && reply !== Bacon.noMore) {
        next = generator(index++);
        flag = false;
        if (next) {
          unsub = next.subscribeInternal(handleEvent);
        } else {
          sink(endEvent());
        }
      }
      return flag = true;
    };
    subscribeNext();
    return function () {
      return unsub();
    };
  });
};

Bacon.retry = function (options) {
  if (!_.isFunction(options.source)) {
    throw new Exception("'source' option has to be a function");
  }
  var source = options.source;
  var retries = options.retries || 0;
  var maxRetries = options.maxRetries || retries;
  var delay = options.delay || function () {
    return 0;
  };
  var isRetryable = options.isRetryable || function () {
    return true;
  };
  var finished = false;
  var error = null;

  return withDesc(new Bacon.Desc(Bacon, "retry", [options]), Bacon.repeat(function () {
    function valueStream() {
      return source().endOnError().withHandler(function (event) {
        if (event.isError()) {
          error = event;
          if (!(isRetryable(error.error) && retries > 0)) {
            finished = true;
            return this.push(event);
          }
        } else {
          if (event.hasValue()) {
            error = null;
            finished = true;
          }
          return this.push(event);
        }
      });
    }

    if (finished) {
      return null;
    } else if (error) {
      var context = {
        error: error.error,
        retriesDone: maxRetries - retries
      };
      var pause = Bacon.later(delay(context)).filter(false);
      retries = retries - 1;
      return pause.concat(Bacon.once().flatMap(valueStream));
    } else {
      return valueStream();
    }
  }));
};

Bacon.sequentially = function (delay, values) {
  var index = 0;
  return withDesc(new Bacon.Desc(Bacon, "sequentially", [delay, values]), Bacon.fromPoll(delay, function () {
    var value = values[index++];
    if (index < values.length) {
      return value;
    } else if (index === values.length) {
      return [value, endEvent()];
    } else {
      return endEvent();
    }
  }));
};

Bacon.Observable.prototype.skip = function (count) {
  return withDesc(new Bacon.Desc(this, "skip", [count]), this.withHandler(function (event) {
    if (!event.hasValue()) {
      return this.push(event);
    } else if (count > 0) {
      count--;
      return Bacon.more;
    } else {
      return this.push(event);
    }
  }));
};

Bacon.EventStream.prototype.skipUntil = function (starter) {
  var started = starter.take(1).map(true).toProperty(false);
  return withDesc(new Bacon.Desc(this, "skipUntil", [starter]), this.filter(started));
};

Bacon.EventStream.prototype.skipWhile = function (f) {
  assertObservableIsProperty(f);
  var ok = false;

  for (var _len20 = arguments.length, args = Array(_len20 > 1 ? _len20 - 1 : 0), _key20 = 1; _key20 < _len20; _key20++) {
    args[_key20 - 1] = arguments[_key20];
  }

  return convertArgsToFunction(this, f, args, function (f) {
    return withDesc(new Bacon.Desc(this, "skipWhile", [f]), this.withHandler(function (event) {
      if (ok || !event.hasValue() || !f(event.value())) {
        if (event.hasValue()) {
          ok = true;
        }
        return this.push(event);
      } else {
        return Bacon.more;
      }
    }));
  });
};

Bacon.Observable.prototype.slidingWindow = function (n) {
  var minValues = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  return withDesc(new Bacon.Desc(this, "slidingWindow", [n, minValues]), this.scan([], function (window, value) {
    return window.concat([value]).slice(-n);
  }).filter(function (values) {
    return values.length >= minValues;
  }));
};

var spies = [];
var registerObs = function (obs) {
  if (spies.length) {
    if (!registerObs.running) {
      try {
        registerObs.running = true;
        spies.forEach(function (spy) {
          spy(obs);
        });
      } finally {
        delete registerObs.running;
      }
    }
  }
};

Bacon.spy = function (spy) {
  return spies.push(spy);
};

Bacon.Property.prototype.startWith = function (seed) {
  return withDesc(new Bacon.Desc(this, "startWith", [seed]), this.scan(seed, function (prev, next) {
    return next;
  }));
};

Bacon.EventStream.prototype.startWith = function (seed) {
  return withDesc(new Bacon.Desc(this, "startWith", [seed]), Bacon.once(seed).concat(this));
};

Bacon.Observable.prototype.takeWhile = function (f) {
  assertObservableIsProperty(f);

  for (var _len21 = arguments.length, args = Array(_len21 > 1 ? _len21 - 1 : 0), _key21 = 1; _key21 < _len21; _key21++) {
    args[_key21 - 1] = arguments[_key21];
  }

  return convertArgsToFunction(this, f, args, function (f) {
    return withDesc(new Bacon.Desc(this, "takeWhile", [f]), this.withHandler(function (event) {
      if (event.filter(f)) {
        return this.push(event);
      } else {
        this.push(endEvent());
        return Bacon.noMore;
      }
    }));
  });
};

Bacon.EventStream.prototype.throttle = function (delay) {
  return withDesc(new Bacon.Desc(this, "throttle", [delay]), this.bufferWithTime(delay).map(function (values) {
    return values[values.length - 1];
  }));
};

Bacon.Property.prototype.throttle = function (delay) {
  return this.delayChanges(new Bacon.Desc(this, "throttle", [delay]), function (changes) {
    return changes.throttle(delay);
  });
};

Observable.prototype.firstToPromise = function (PromiseCtr) {
  var _this12 = this;

  if (typeof PromiseCtr !== "function") {
    if (typeof Promise === "function") {
      PromiseCtr = Promise;
    } else {
      throw new Exception("There isn't default Promise, use shim or parameter");
    }
  }

  return new PromiseCtr(function (resolve, reject) {
    return _this12.subscribe(function (event) {
      if (event.hasValue()) {
        resolve(event.value());
      }
      if (event.isError()) {
        reject(event.error);
      }

      return Bacon.noMore;
    });
  });
};

Observable.prototype.toPromise = function (PromiseCtr) {
  return this.last().firstToPromise(PromiseCtr);
};

Bacon["try"] = function (f) {
  return function (value) {
    try {
      return Bacon.once(f(value));
    } catch (e) {
      return new Bacon.Error(e);
    }
  };
};

Bacon.update = function (initial) {
  function lateBindFirst(f) {
    return function () {
      for (var _len23 = arguments.length, args = Array(_len23), _key23 = 0; _key23 < _len23; _key23++) {
        args[_key23] = arguments[_key23];
      }

      return function (i) {
        return f.apply(undefined, [i].concat(args));
      };
    };
  }

  for (var _len22 = arguments.length, patterns = Array(_len22 > 1 ? _len22 - 1 : 0), _key22 = 1; _key22 < _len22; _key22++) {
    patterns[_key22 - 1] = arguments[_key22];
  }

  var i = patterns.length - 1;
  while (i > 0) {
    if (!(patterns[i] instanceof Function)) {
      patterns[i] = _.always(patterns[i]);
    }
    patterns[i] = lateBindFirst(patterns[i]);
    i = i - 2;
  }
  return withDesc(new Bacon.Desc(Bacon, "update", [initial].concat(patterns)), Bacon.when.apply(Bacon, patterns).scan(initial, function (x, f) {
    return f(x);
  }));
};

Bacon.zipAsArray = function () {
  for (var _len24 = arguments.length, args = Array(_len24), _key24 = 0; _key24 < _len24; _key24++) {
    args[_key24] = arguments[_key24];
  }

  var streams = argumentsToObservables(args);
  return withDesc(new Bacon.Desc(Bacon, "zipAsArray", streams), Bacon.zipWith(streams, function () {
    for (var _len25 = arguments.length, xs = Array(_len25), _key25 = 0; _key25 < _len25; _key25++) {
      xs[_key25] = arguments[_key25];
    }

    return xs;
  }));
};

Bacon.zipWith = function () {
  for (var _len26 = arguments.length, args = Array(_len26), _key26 = 0; _key26 < _len26; _key26++) {
    args[_key26] = arguments[_key26];
  }

  var observablesAndFunction = argumentsToObservablesAndFunction(args);
  var streams = observablesAndFunction[0];
  var f = observablesAndFunction[1];

  streams = _.map(function (s) {
    return s.toEventStream();
  }, streams);
  return withDesc(new Bacon.Desc(Bacon, "zipWith", [f].concat(streams)), Bacon.when(streams, f));
};

Bacon.Observable.prototype.zip = function (other, f) {
  return withDesc(new Bacon.Desc(this, "zip", [other]), Bacon.zipWith([this, other], f || Array));
};

if (typeof define !== "undefined" && define !== null && define.amd != null) {
  define([], function () {
    return Bacon;
  });
  if (typeof this !== "undefined" && this !== null) {
    this.Bacon = Bacon;
  }
} else if (typeof module !== "undefined" && module !== null && module.exports != null) {
  module.exports = Bacon;
  Bacon.Bacon = Bacon;
} else {
    this.Bacon = Bacon;
  }
}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9BRFBBbmFseXRpY3MuanMiLCJqcy9Db25zdGFudHMuanMiLCJqcy9GaW5nZXJwcmludC5qcyIsImpzL1V0aWxzLmpzIiwianMvbGlicmFyaWVzL2pxdWVyeS5taW4uanMiLCJub2RlX21vZHVsZXMvYmFjb25qcy9kaXN0L0JhY29uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIEFEUCBBbmFseXRpY3MgSmF2YXNjcmlwdCBTREsgTW9kdWxlXG4gKiBAYXV0aG9yIE1pY2FlbGEgTG9wZXogPG1pY2FlbGEubG9wZXpAYXV0b2Rlc2suY29tPlxuICogQHR5cGUge2V4cG9ydHN9XG4gKi9cbnZhciAkID0gcmVxdWlyZSgnLi9saWJyYXJpZXMvanF1ZXJ5Lm1pbi5qcycpO1xudmFyIEJhY29uID0gcmVxdWlyZSgnYmFjb25qcycpLkJhY29uO1xudmFyIFV0aWwgPSByZXF1aXJlKCcuL1V0aWxzLmpzJyk7XG52YXIgQ29uc3RhbnRzID0gcmVxdWlyZSgnLi9Db25zdGFudHMuanMnKTtcblxuaWYoJC5zdXBwb3J0KSB7XG4gICAgJC5zdXBwb3J0LmNvcnMgPSB0cnVlO1xufVxuXG4vKipcbiAqIENvbnN0cnVjdG9yXG4gKiBAcGFyYW0gZmFjZXRzIHJlcXVpcmVkLCBvYmplY3Qgd2l0aCByZWdpc3RyYXRpb24gZmFjZXRzXG4gKiBAcGFyYW0gY29uZmlnIG9wdGlvbmFsLCBjb250YWlucyB0aGUgY29uZmlndXJhdGlvbiBmb3IgdGhlIFNES1xuICogQHBhcmFtIGRldmljZUlkIG9wdGlvbmFsLCB1bmlxdWUgZGV2aWNlIGlkZW50aWZpZXJcbiAqIEByZXR1cm5zIHt7bG9naW46IF9sb2dpbiwgbG9nb3V0OiBfbG9nb3V0LCBzZXRGYWNldHM6IF9zZXRGYWNldHMsIGdldEZhY2V0czogX2dldEZhY2V0cywgdHJhY2tFdmVudDogX3RyYWNrRXZlbnQsIHRyYWNrRXZlbnRXaXRoVHlwZUFuZFNjb3BlOiBfdHJhY2tFdmVudFdpdGhUeXBlQW5kU2NvcGUsIGFkZEV2ZW50VHlwZTogX2FkZEV2ZW50VHlwZX19XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gVHJhY2tlcihmYWNldHMsIGNvbmZpZywgZGV2aWNlSWQpIHtcblxuICAvLyBFbnN1cmluZyB0aGF0IFByb2R1Y3QgZmFjZXQgaXMgcHJlc2VudFxuICBpZiAoIWZhY2V0cyB8fCAhZmFjZXRzLnByb2R1Y3QgfHwgIWZhY2V0cy5wcm9kdWN0LmlkKVxuICAgIHRocm93IG5ldyBFcnJvcignWW91IG5lZWQgdG8gc3BlY2lmeSB0aGUgcHJvZHVjdCBmYWNldCB3aXRoIHRoZSBwcm9kdWN0IGlkIHRvIGluc3RhbnRpYXRlIHRoZSB0cmFja2VyJylcblxuICAvLyBTREsgQ29uZmlndXJhdGlvblxuICB2YXIgY29uZiA9IFV0aWwuYnVpbGRDb25mKGNvbmZpZyk7XG5cbiAgaWYgKCFVdGlsLmlzVmFsaWRQcm9kdWN0KGZhY2V0cy5wcm9kdWN0KSlcbiAgICBfd2FybiAoJ1RoZSBwcm9kdWN0IGZhY2V0IHNob3VsZCBiZSBzcGVjaWZpZWQgd2l0aCB0aGUgaWQsIG5hbWUgJiBpZF9wcm92aWRlciB0byBpbnN0YW50aWF0ZSB0aGUgdHJhY2tlcicpO1xuXG4gIGlmICghVXRpbC5pc1ZhbGlkUHJvZHVjdElkUHJvdmlkZXIoZmFjZXRzLnByb2R1Y3QuaWRfcHJvdmlkZXIpKSBfd2FybihcIlRoZSBwcm92aWRlciBpZF9wcm92aWRlciBpcyBub3QgYSB2YWxpZCBvbmVcIik7XG5cbiAgLy8gU0RLIENvbnRleHRcbiAgdmFyIGNvbnRleHQgPSB7fTtcbiAgY29udGV4dC5kZXZpY2VfaWQgPSBkZXZpY2VJZDtcbiAgY29udGV4dC5zZXNzaW9uX2lkID0gVXRpbC5nZW5HdWlkKCk7XG4gIGNvbnRleHQuZmFjZXRzID0gVXRpbC5idWlsZEZhY2V0cyhmYWNldHMpO1xuXG4gIC8vIEFkZCB0aGUgdXNlciB0byB0aGUgY29udGV4dFxuICBpZiAoZmFjZXRzLnVzZXIpIF9sb2dpbihmYWNldHMudXNlcik7XG5cbiAgLy8gQWRkIEdlbyBpbmZvIHRvIGNvbnRleHRcbiAgaWYgKCFmYWNldHMuZ2VvICYmIGNvbmYuZW5hYmxlX2dlb19kYXRhKSBfdXBkYXRlR2VvKCk7XG5cbiAgLy8gQ29uZmlndXJlIGVudmVudHMgcXVldWVcbiAgdmFyIGV2ZW50c0J1cyA9IG5ldyBCYWNvbi5CdXMoKTtcbiAgJC5zdXBwb3J0LmNvcnMgPSB0cnVlO1xuXG4gIGV2ZW50c0J1cy5mbGF0TWFwKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgcmV0dXJuIEJhY29uLnJldHJ5KHtcbiAgICAgIHNvdXJjZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gQmFjb24uZnJvbVByb21pc2UoXG4gICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogY29uZi5zZXJ2ZXIsXG4gICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoZGF0YSB8fCB7fSksXG4gICAgICAgICAgICBjcm9zc0RvbWFpbjogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIlxuICAgICAgICAgIH0pKTtcbiAgICAgIH0sXG4gICAgICByZXRyaWVzOiAzLFxuICAgICAgaXNSZXRyeWFibGU6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2Uuc3RhdHVzICE9PSAyMDA7XG4gICAgICB9LFxuICAgICAgZGVsYXk6IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiBjb250ZXh0LnJldHJpZXNEb25lICogOTAwO1xuICAgICAgfVxuICAgIH0pXG4gIH0pLm9uVmFsdWUoZnVuY3Rpb24gKHZhbHVlKSB7XG4gIH0pO1xuXG4gIC8vIFNlc3Npb24gbWVzc2FnZXNcbiAgaWYgKGNvbmYuZW5hYmxlX3Nlc3Npb25fbWVzc2FnZXMpIHtcbiAgICBldmVudHNCdXMucHVzaChVdGlsLmJ1aWxkTXNnKGNvbnRleHQsICdTJywgJ1MnLCBjb25mKSk7XG4gICAgdmFyIF9vbnVubG9hZCA9IHdpbmRvdy5vbnVubG9hZDtcbiAgICB3aW5kb3cub251bmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGV2ZW50c0J1cy5wdXNoKFV0aWwuYnVpbGRNc2coY29udGV4dCwgJ1MnLCAnRScsIGNvbmYpKTtcbiAgICAgIGlmICh0eXBlb2YgX29udW5sb2FkID09PSAnZnVuY3Rpb24nKVxuICAgICAgICBfb251bmxvYWQoKTtcbiAgICB9O1xuICAgIHZhciBfb25iZWZvcmV1bmxvYWQgPSB3aW5kb3cub25iZWZvcmV1bmxvYWQ7XG4gICAgd2luZG93Lm9uYmVmb3JldW5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICBldmVudHNCdXMucHVzaChVdGlsLmJ1aWxkTXNnKGNvbnRleHQsICdTJywgJ0UnLCBjb25mKSk7XG4gICAgICBpZiAodHlwZW9mIF9vbmJlZm9yZXVubG9hZCA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgcmV0dXJuIF9vbmJlZm9yZXVubG9hZCgpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBfdXBkYXRlR2VvKCkge1xuICAgIEJhY29uLmZyb21DYWxsYmFjayhuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uIChpdCkge1xuICAgICAgY29udGV4dC5mYWNldHMuZ2VvID0gY29udGV4dC5mYWNldHMuZ2VvIHx8IHt9O1xuICAgICAgY29udGV4dC5mYWNldHMuZ2VvLmxhdCA9IGl0LmNvb3Jkcy5sYXRpdHVkZTtcbiAgICAgIGNvbnRleHQuZmFjZXRzLmdlby5sb24gPSBpdC5jb29yZHMubG9uZ2l0dWRlO1xuICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgc3dpdGNoIChlcnJvci5jb2RlKSB7XG4gICAgICAgIGNhc2UgZXJyb3IuUEVSTUlTU0lPTl9ERU5JRUQ6XG4gICAgICAgICAgX3dhcm4oXCJVc2VyIGRlbmllZCB0aGUgcmVxdWVzdCBmb3IgZ2VvLWxvY2F0aW9uXCIpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGVycm9yLlBPU0lUSU9OX1VOQVZBSUxBQkxFOlxuICAgICAgICAgIF93YXJuKFwiTG9jYXRpb24gaW5mb3JtYXRpb24gaXMgdW5hdmFpbGFibGVcIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgZXJyb3IuVElNRU9VVDpcbiAgICAgICAgICBfd2FybihcIlRoZSByZXF1ZXN0IHRvIGdldCB1c2VyIGxvY2F0aW9uIHRpbWVkIG91dFwiKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBlcnJvci5VTktOT1dOX0VSUjpcbiAgICAgICAgICBfd2FybihcIkFuIHVua25vd24gZXJyb3Igb2NjdXJyZWQgd2hpbGUgcmVxdWVzdGluZyBnZW8tbG9jYXRpb25cIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gX3NlbmRFdmVudCh0eXBlLCBzY29wZSwgZmFjZXRzLCBkdXJhdGlvbikge1xuICAgIGlmICghZmFjZXRzLmdlbyAmJiBjb25mLmVuYWJsZV9nZW9fZGF0YSkgX3VwZGF0ZUdlbygpO1xuICAgIGNvbnRleHQuZHVyYXRpb24gPSBkdXJhdGlvbjtcbiAgICBldmVudHNCdXMucHVzaChVdGlsLmJ1aWxkTXNnKGNvbnRleHQsIHR5cGUsIHNjb3BlLCBjb25mLCBmYWNldHMpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF93YXJuKG1zZykge1xuICAgIGlmICghY29uZi5zdXBwcmVzc193YXJuaW5ncykge1xuICAgICAgY29uc29sZS53YXJuKG1zZyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrcyBhbiBldmVudCwgc2VuZHMgdGhlIGNvcnJlc3BvbmRpbmcgaW5mb3JtYXRpb24gZm9yIHRyYWNraW5nIGV2ZW50cyB0byBBU0Ugc2VydmljZXNcbiAgICogQHBhcmFtIGV2ZW50VHlwZSByZXF1aXJlZCwgdHlwZSBvZiB0aGUgZXZlbnRcbiAgICogQHBhcmFtIGZhY2V0cyBvcHRpb25hbCwgdGhlIGZhY2V0cyB1c2VkIGZvciBBUEkgb3BlcmF0aW9uIG9yIHByb2R1Y3Qgb3BlcmF0aW9uc1xuICAgKiBAcGFyYW0gZHVyYXRpb24gb3B0aW9uYWwsIHRoZSBmYWNldHMgdXNlZCBmb3IgQVBJIG9wZXJhdGlvbiBvciBwcm9kdWN0IG9wZXJhdGlvbnNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIF90cmFja0V2ZW50KGV2ZW50VHlwZSwgZmFjZXRzLCBkdXJhdGlvbikge1xuICAgIHZhciBldmVudCA9IENvbnN0YW50cy5nZXRWYWx1ZXMoZXZlbnRUeXBlKTtcbiAgICBpZiAoIWV2ZW50KSBjb25zb2xlLmVycm9yKCdBIHZhbGlkIGV2ZW50VHlwZSBuZWVkcyB0byBiZSBzcGVjaWZpZWQgdG8gdHJhY2sgYW4gZXZlbnQnKTtcbiAgICBlbHNlIHtcbiAgICAgIF9zZW5kRXZlbnQoZXZlbnQudHlwZSwgZXZlbnQuc2NvcGUsIGZhY2V0cywgZHVyYXRpb24pO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogVHJhY2tzIGFuIGV2ZW50LCBzZW5kcyB0aGUgY29ycmVzcG9uZGluZyBpbmZvcm1hdGlvbiBmb3IgdHJhY2tpbmcgZXZlbnRzIHRvIEFTRSBzZXJ2aWNlc1xuICAgKiBAcGFyYW0gdHlwZSByZXF1aXJlZCwgdHlwZSBvZiB0aGUgZXZlbnRcbiAgICogQHBhcmFtIHNjb3BlIHJlcXVpcmVkLCB0eXBlIG9mIHRoZSBldmVudFxuICAgKiBAcGFyYW0gZmFjZXRzIG9wdGlvbmFsLCB0aGUgZmFjZXRzIHVzZWQgZm9yIEFQSSBvcGVyYXRpb24gb3IgcHJvZHVjdCBvcGVyYXRpb25zXG4gICAqIEBwYXJhbSBkdXJhdGlvbiBvcHRpb25hbCwgdGhlIGZhY2V0cyB1c2VkIGZvciBBUEkgb3BlcmF0aW9uIG9yIHByb2R1Y3Qgb3BlcmF0aW9uc1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gX3RyYWNrRXZlbnRXaXRoVHlwZUFuZFNjb3BlKHR5cGUsIHNjb3BlLCBmYWNldHMsIGR1cmF0aW9uKSB7XG4gICAgaWYgKCF0eXBlKSBjb25zb2xlLmVycm9yKCdUaGUgdHlwZSBuZWVkcyB0byBiZSBzcGVjaWZpZWQgdG8gdHJhY2sgYW4gZXZlbnQnKTtcbiAgICBlbHNlIGlmICghc2NvcGUpIGNvbnNvbGUuZXJyb3IoJ1RoZSBTY29wZSBuZWVkcyB0byBiZSBzcGVjaWZpZWQgdG8gdHJhY2sgYW4gZXZlbnQnKTtcbiAgICBlbHNlIGlmICghQ29uc3RhbnRzLmlzVmFsaWRTY29wZShzY29wZSkpIGNvbnNvbGUuZXJyb3Ioc2NvcGUgKyAnIGlzIG5vdCBhIHZhbGlkIHNjb3BlJyk7XG4gICAgZWxzZSBpZiAoIUNvbnN0YW50cy5pc1ZhbGlkVHlwZSh0eXBlKSkgY29uc29sZS5lcnJvcih0eXBlICsgJyBpcyBub3QgYSB2YWxpZCB0eXBlJyk7XG4gICAgZWxzZSB7XG4gICAgICBfc2VuZEV2ZW50KHR5cGUsIHNjb3BlLCBmYWNldHMsIGR1cmF0aW9uKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gZXZlbnQgdHlwZSB0byB0aGUgU0RLXG4gICAqIEBwYXJhbSBldmVudE5hbWVcbiAgICogQHBhcmFtIHR5cGVcbiAgICogQHBhcmFtIHNjb3BlXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBfYWRkRXZlbnRUeXBlKGV2ZW50TmFtZSwgdHlwZSwgc2NvcGUpIHtcbiAgICBDb25zdGFudHMuYWRkRXZlbnRUeXBlKGV2ZW50TmFtZSwgdHlwZSwgc2NvcGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlcyB0aGUgZmFjZXRzIHNwZWNpZmllZCBkdXJpbmcgdGhlIHJlZ2lzdHJhdGlvblxuICAgKiBAcGFyYW0gZmFjZXRzXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBfc2V0RmFjZXRzKGZhY2V0cykge1xuICAgIGNvbnRleHQuZmFjZXRzID0gVXRpbC5idWlsZEZhY2V0cyhmYWNldHMsIGNvbnRleHQuZmFjZXRzKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZmFjZXRzIHN0b3JlZCBpbnRlcm5hbGx5XG4gICAqIEByZXR1cm5zIHsqfGNvbnRleHQuZmFjZXRzfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gX2dldEZhY2V0cygpIHtcbiAgICByZXR1cm4gY29udGV4dC5mYWNldHM7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGUgdXNlciBpbmZvcm1hdGlvbiB0byB0aGUgU0RLXG4gICAqIEBwYXJhbSB1c2VyIHJlcXVpcmVkLCB0aGUgaW5mb3JtYXRpb24gb2YgdGhlIHVzZXIgdGhhdCBsb2dnZWQgaW5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIF9sb2dpbih1c2VyKSB7XG4gICAgaWYgKCF1c2VyKSBjb25zb2xlLmVycm9yKCdUaGUgaW5mb3JtYXRpb24gb2YgdGhlIHVzZXIgdGhhdCBsb2dnZWQgaW4gbmVlZHMgdG8gYmUgc3BlY2lmaWVkJyk7XG4gICAgZWxzZSBpZiAoIXVzZXIudXNlcl9pZCkgY29uc29sZS5lcnJvcignVGhlIHVzZXJfaWQgbmVlZHMgdG8gYmUgc3BlY2lmaWVkIHRvIGxvZyBpbiBhIHVzZXInKTtcbiAgICBlbHNlIGlmICghdXNlci5wcm92aWRlcl9uYW1lKSBjb25zb2xlLmVycm9yKCdUaGUgcHJvdmlkZXJfbmFtZSBuZWVkcyB0byBiZSBzcGVjaWZpZWQgdG8gbG9nIGluIGEgdXNlcicpO1xuICAgIGVsc2Uge1xuICAgICAgdXNlci5sb2dnZWRfaW4gPSB0cnVlO1xuICAgICAgY29udGV4dC5mYWNldHMudXNlcl9pbmZvW3VzZXIudXNlcl9pZCArICdfJyArIHVzZXIucHJvdmlkZXJfbmFtZV0gPSB1c2VyO1xuICAgICAgY29udGV4dC51c2VyX2lkID0gdXNlci51c2VyX2lkO1xuICAgICAgY29udGV4dC5wcm92aWRlcl9uYW1lID0gdXNlci5wcm92aWRlcl9uYW1lO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogU2V0cyB0aGUgc3BlY2lmaWVkIHVzZXIgYXMgY3VycmVudGx5IGxvZ2dlZCBvdXRcbiAgICogQHBhcmFtIHVzZXJJZFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gX2xvZ291dCh1c2VySWQsIHByb3ZpZGVyTmFtZSkge1xuICAgIGlmICghdXNlcklkKSBjb25zb2xlLmVycm9yKCdUaGUgdXNlcl9pZCBuZWVkcyB0byBiZSBzcGVjaWZpZWQgdG8gbG9nIG91dCBhIHVzZXInKTtcbiAgICBlbHNlIGlmICghcHJvdmlkZXJOYW1lKSBjb25zb2xlLmVycm9yKCdUaGUgcHJvdmlkZXJfbmFtZSBuZWVkcyB0byBiZSBzcGVjaWZpZWQgdG8gbG9nIG91dCBhIHVzZXInKTtcbiAgICBlbHNlIGlmIChjb250ZXh0LmZhY2V0cy51c2VyX2luZm9bdXNlcklkICsgJ18nICsgcHJvdmlkZXJOYW1lXSkge1xuICAgICAgY29udGV4dC5mYWNldHMudXNlcl9pbmZvW3VzZXJJZCArICdfJyArIHByb3ZpZGVyTmFtZV0ubG9nZ2VkX2luID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIF93YXJuKFwiVGhlIHVzZXIgXCIgKyB1c2VySWQgKyAnIC8gJyArIHByb3ZpZGVyTmFtZSArIFwiIGRvZXMgbm90IGV4aXN0LlwiKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJue1xuICAgIGxvZ2luOiBfbG9naW4sXG4gICAgbG9nb3V0OiBfbG9nb3V0LFxuICAgIHNldEZhY2V0czogX3NldEZhY2V0cyxcbiAgICBnZXRGYWNldHM6IF9nZXRGYWNldHMsXG4gICAgdHJhY2tFdmVudDogX3RyYWNrRXZlbnQsXG4gICAgdHJhY2tFdmVudFdpdGhUeXBlQW5kU2NvcGU6IF90cmFja0V2ZW50V2l0aFR5cGVBbmRTY29wZSxcbiAgICBhZGRFdmVudFR5cGU6IF9hZGRFdmVudFR5cGVcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZmFjZXRzLCBjb25maWcsIGRldmljZUlkKSB7XG4gIHJldHVybiBuZXcgVHJhY2tlcihmYWNldHMsIGNvbmZpZywgZGV2aWNlSWQpO1xufVxuIiwiLyoqXG4gKiBDb25zdGFudHNcbiAqIEBhdXRob3IgTWljYWVsYSBMb3BleiA8bWljYWVsYS5sb3BlekBhdXRvZGVzay5jb20+XG4gKiBAdHlwZSB7ZXhwb3J0c31cbiAqL1xudmFyIENvbnN0YW50cyA9IChmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGNvbnN0YW50cyA9IHtcblxuICAgIC8vIFNlc3Npb25cbiAgICBTRVNTSU9OX1NUQVJUOiB7IHR5cGU6ICdTJywgc2NvcGU6ICdTJ30sXG4gICAgU0VTU0lPTl9FTkQ6IHsgdHlwZTogJ1MnLCBzY29wZTogJ0UnfSxcbiAgICBTRVNTSU9OX0RFVEFJTFM6IHsgdHlwZTogJ1MnLCBzY29wZTogJ0QnfSxcbiAgICBTRVNTSU9OX0ZVTEw6IHsgdHlwZTogJ1MnLCBzY29wZTogJ0YnfSxcblxuICAgIC8vIFByb2plY3RcbiAgICBQUk9KRUNUX1NUQVJUOiB7IHR5cGU6ICdQJywgc2NvcGU6ICdTJ30sXG4gICAgUFJPSkVDVF9FTkQ6IHsgdHlwZTogJ1AnLCBzY29wZTogJ0UnfSxcbiAgICBQUk9KRUNUX0ZVTEw6IHsgdHlwZTogJ1AnLCBzY29wZTogJ0YnfSxcbiAgICBQUk9KRUNUX05BTUU6IHsgdHlwZTogJ1AnLCBzY29wZTogJ04nfSxcblxuICAgIC8vIERvY3VtZW50XG4gICAgRE9DVU1FTlRfU1RBUlQ6IHsgdHlwZTogJ0QnLCBzY29wZTogJ1MnfSxcbiAgICBET0NVTUVOVF9FTkQ6IHsgdHlwZTogJ0QnLCBzY29wZTogJ0UnfSxcbiAgICBET0NVTUVOVF9GVUxMOiB7IHR5cGU6ICdEJywgc2NvcGU6ICdGJ30sXG4gICAgRE9DVU1FTlRfTkFNRTogeyB0eXBlOiAnRCcsIHNjb3BlOiAnTid9LFxuICAgIERPQ1VNRU5UX1RZUEU6IHsgdHlwZTogJ0QnLCBzY29wZTogJ1QnfSxcblxuICAgIC8vIENsaWNrXG4gICAgQ0xJQ0tfUEFHRTogeyB0eXBlOiAnQycsIHNjb3BlOiAnUCd9LFxuICAgIENMSUNLX0NPTVBPTkVOVDogeyB0eXBlOiAnQycsIHNjb3BlOiAnQyd9LFxuICAgIENMSUNLX0RJU1BMQVk6IHsgdHlwZTogJ0MnLCBzY29wZTogJ0QnfSxcbiAgICBDTElDS19PUEVSQVRJT046IHsgdHlwZTogJ0MnLCBzY29wZTogJ08nfSxcblxuICAgIC8vIE1ldHJpY3NcbiAgICBNRVRSSUNTX0NPTVBPTkVOVDogeyB0eXBlOiAnTScsIHNjb3BlOiAnQyd9LFxuICAgIE1FVFJJQ1NfU0VTU0lPTjogeyB0eXBlOiAnTScsIHNjb3BlOiAnUyd9LFxuXG4gICAgLy8gR2VzdHVyZVxuICAgIEdFU1RVUkVfQ09NUE9ORU5UOiB7IHR5cGU6ICdHJywgc2NvcGU6ICdDJ30sXG5cbiAgICAvLyBIb3ZlclxuICAgIEhPVkVSX0NPTVBPTkVOVDogeyB0eXBlOiAnSCcsIHNjb3BlOiAnQyd9LFxuXG4gICAgLy8gQmFja2dyb3VuZFxuICAgIEJBQ0tHUk9VTkRfQ0FMTDogeyB0eXBlOiAnQicsIHNjb3BlOiAnQyd9LFxuICAgIEJBQ0tHUk9VTkRfVVBEQVRFOiB7IHR5cGU6ICdCJywgc2NvcGU6ICdVJ30sXG4gICAgQkFDS0dST1VORF9ET1dOTE9BRDogeyB0eXBlOiAnQicsIHNjb3BlOiAnRCd9LFxuICAgIEJBQ0tHUk9VTkRfSU5TVEFMTDogeyB0eXBlOiAnQicsIHNjb3BlOiAnSSd9LFxuICAgIEJBQ0tHUk9VTkRfSk9COiB7IHR5cGU6ICdCJywgc2NvcGU6ICdKJ30sXG5cbiAgICAvLyBWaWV3XG4gICAgVVNFUl9WSUVXOiB7IHR5cGU6ICdWJywgc2NvcGU6ICdVJ30sXG4gICAgQVBQTElDQVRJT05fVklFVzogeyB0eXBlOiAnVicsIHNjb3BlOiAnQSd9LFxuICAgIE9USEVSX1ZJRVc6IHsgdHlwZTogJ1YnLCBzY29wZTogJ08nfVxuICB9O1xuXG4gIGZ1bmN0aW9uIF9nZXRWYWx1ZXMoZXZlbnRUeXBlKSB7XG4gICAgdmFyIHZhbHVlcyA9IGNvbnN0YW50c1tldmVudFR5cGVdO1xuICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoZSBldmVudCB0eXBlOiAnICsgZXZlbnRUeXBlICsgJyBkb2VzIG5vdCBleGlzdC4nKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfaXNWYWxpZFR5cGUodHlwZSkge1xuICAgIGlmICh0eXBlID09ICdTJyB8fCB0eXBlID09ICdQJyB8fCB0eXBlID09ICdEJyB8fCB0eXBlID09ICdDJyB8fCB0eXBlID09ICdNJyB8fCB0eXBlID09ICdHJyB8fFxuICAgICAgdHlwZSA9PSAnSCcgfHwgdHlwZSA9PSAnQicgfHwgdHlwZSA9PSAnVicpXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBfaXNWYWxpZFNjb3BlKHNjb3BlKSB7XG4gICAgaWYgKHNjb3BlLmxlbmd0aCA9PSAxKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9hZGRFdmVudFR5cGUoZXZlbnROYW1lLCB0eXBlLCBzY29wZSkge1xuICAgIGlmICghX2lzVmFsaWRTY29wZShzY29wZSkpXG4gICAgICBjb25zb2xlLmVycm9yKHR5cGUgKyAnIGlzIG5vdCBhIHZhbGlkIHNjb3BlLicpO1xuICAgIGVsc2UgaWYgKCFfaXNWYWxpZFR5cGUodHlwZSkpIGNvbnNvbGUuZXJyb3IodHlwZSArICcgaXMgbm90IGEgdmFsaWQgdHlwZS4nKTtcbiAgICBlbHNlIGlmIChldmVudE5hbWUgPT0gbnVsbCB8fCAhKHR5cGVvZiBldmVudE5hbWUgPT0gXCJzdHJpbmdcIiAmJiBldmVudE5hbWUubGVuZ3RoID4gMCkpXG4gICAgICBjb25zb2xlLmVycm9yKGV2ZW50TmFtZSArICdpcyBub3QgYSB2YWxpZCBldmVudCBuYW1lLicpO1xuICAgIGVsc2Uge1xuICAgICAgY29uc3RhbnRzW2V2ZW50TmFtZV0gPSB7XG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIHNjb3BlOiBzY29wZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybntcbiAgICAvKipcbiAgICAgKiBQb3NzaWJsZSB0eXBlcyBvZiBldmVudHNcbiAgICAgKi9cbiAgICB0eXBlczogY29uc3RhbnRzLFxuICAgIGdldFZhbHVlczogX2dldFZhbHVlcyxcbiAgICBpc1ZhbGlkVHlwZTogX2lzVmFsaWRUeXBlLFxuICAgIGlzVmFsaWRTY29wZTogX2lzVmFsaWRTY29wZSxcbiAgICBhZGRFdmVudFR5cGU6IF9hZGRFdmVudFR5cGVcblxuICB9XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uc3RhbnRzO1xuXG5cblxuXG5cblxuXG4iLCIvKipcbiAqIENyZWF0ZWQgYnkgbWljYWVsYWxvcGV6IG9uIDUvMjUvMTUuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKHdpbmRvdywgSlNPTikge1xuICAvKipcbiAgICogTUQ1IENoZWNrc3VtIGNhbGN1bGF0aW9uLCBnZW5lcmF0ZXMgYSBNRDVIYXNoIG91dCBvZiBhIHN0cmluZyBwcm92aWRlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIHJlcXVpcmVkLCBzdHJpbmcgdG8gaGFzaFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBfc3RyaW5nVG9NRDUoc3RyKSB7XG4gICAgdmFyIGhleGNhc2UgPSAwLCBjaHJzeiA9IDgsIGNtYzUgPSBmdW5jdGlvbiAoeCwgZSkge1xuICAgICAgeFtlID4+IDVdIHw9IDB4ODAgPDwgKChlKSAlIDMyKTtcbiAgICAgIHhbKCgoZSArIDY0KSA+Pj4gOSkgPDwgNCkgKyAxNF0gPSBlO1xuICAgICAgdmFyIGEgPSAxNzMyNTg0MTkzO1xuICAgICAgdmFyIGIgPSAtMjcxNzMzODc5O1xuICAgICAgdmFyIGMgPSAtMTczMjU4NDE5NDtcbiAgICAgIHZhciBkID0gMjcxNzMzODc4O1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4Lmxlbmd0aDsgaSArPSAxNikge1xuICAgICAgICB2YXIgZiA9IGE7XG4gICAgICAgIHZhciBnID0gYjtcbiAgICAgICAgdmFyIGggPSBjO1xuICAgICAgICB2YXIgaiA9IGQ7XG4gICAgICAgIGEgPSBtZDVfZmYoYSwgYiwgYywgZCwgeFtpICsgMF0sIDcsIC02ODA4NzY5MzYpO1xuICAgICAgICBkID0gbWQ1X2ZmKGQsIGEsIGIsIGMsIHhbaSArIDFdLCAxMiwgLTM4OTU2NDU4Nik7XG4gICAgICAgIGMgPSBtZDVfZmYoYywgZCwgYSwgYiwgeFtpICsgMl0sIDE3LCA2MDYxMDU4MTkpO1xuICAgICAgICBiID0gbWQ1X2ZmKGIsIGMsIGQsIGEsIHhbaSArIDNdLCAyMiwgLTEwNDQ1MjUzMzApO1xuICAgICAgICBhID0gbWQ1X2ZmKGEsIGIsIGMsIGQsIHhbaSArIDRdLCA3LCAtMTc2NDE4ODk3KTtcbiAgICAgICAgZCA9IG1kNV9mZihkLCBhLCBiLCBjLCB4W2kgKyA1XSwgMTIsIDEyMDAwODA0MjYpO1xuICAgICAgICBjID0gbWQ1X2ZmKGMsIGQsIGEsIGIsIHhbaSArIDZdLCAxNywgLTE0NzMyMzEzNDEpO1xuICAgICAgICBiID0gbWQ1X2ZmKGIsIGMsIGQsIGEsIHhbaSArIDddLCAyMiwgLTQ1NzA1OTgzKTtcbiAgICAgICAgYSA9IG1kNV9mZihhLCBiLCBjLCBkLCB4W2kgKyA4XSwgNywgMTc3MDAzNTQxNik7XG4gICAgICAgIGQgPSBtZDVfZmYoZCwgYSwgYiwgYywgeFtpICsgOV0sIDEyLCAtMTk1ODQxNDQxNyk7XG4gICAgICAgIGMgPSBtZDVfZmYoYywgZCwgYSwgYiwgeFtpICsgMTBdLCAxNywgLTQyMDYzKTtcbiAgICAgICAgYiA9IG1kNV9mZihiLCBjLCBkLCBhLCB4W2kgKyAxMV0sIDIyLCAtMTk5MDQwNDE2Mik7XG4gICAgICAgIGEgPSBtZDVfZmYoYSwgYiwgYywgZCwgeFtpICsgMTJdLCA3LCAxODA0NjAzNjgyKTtcbiAgICAgICAgZCA9IG1kNV9mZihkLCBhLCBiLCBjLCB4W2kgKyAxM10sIDEyLCAtNDAzNDExMDEpO1xuICAgICAgICBjID0gbWQ1X2ZmKGMsIGQsIGEsIGIsIHhbaSArIDE0XSwgMTcsIC0xNTAyMDAyMjkwKTtcbiAgICAgICAgYiA9IG1kNV9mZihiLCBjLCBkLCBhLCB4W2kgKyAxNV0sIDIyLCAxMjM2NTM1MzI5KTtcbiAgICAgICAgYSA9IG1kNV9nZyhhLCBiLCBjLCBkLCB4W2kgKyAxXSwgNSwgLTE2NTc5NjUxMCk7XG4gICAgICAgIGQgPSBtZDVfZ2coZCwgYSwgYiwgYywgeFtpICsgNl0sIDksIC0xMDY5NTAxNjMyKTtcbiAgICAgICAgYyA9IG1kNV9nZyhjLCBkLCBhLCBiLCB4W2kgKyAxMV0sIDE0LCA2NDM3MTc3MTMpO1xuICAgICAgICBiID0gbWQ1X2dnKGIsIGMsIGQsIGEsIHhbaSArIDBdLCAyMCwgLTM3Mzg5NzMwMik7XG4gICAgICAgIGEgPSBtZDVfZ2coYSwgYiwgYywgZCwgeFtpICsgNV0sIDUsIC03MDE1NTg2OTEpO1xuICAgICAgICBkID0gbWQ1X2dnKGQsIGEsIGIsIGMsIHhbaSArIDEwXSwgOSwgMzgwMTYwODMpO1xuICAgICAgICBjID0gbWQ1X2dnKGMsIGQsIGEsIGIsIHhbaSArIDE1XSwgMTQsIC02NjA0NzgzMzUpO1xuICAgICAgICBiID0gbWQ1X2dnKGIsIGMsIGQsIGEsIHhbaSArIDRdLCAyMCwgLTQwNTUzNzg0OCk7XG4gICAgICAgIGEgPSBtZDVfZ2coYSwgYiwgYywgZCwgeFtpICsgOV0sIDUsIDU2ODQ0NjQzOCk7XG4gICAgICAgIGQgPSBtZDVfZ2coZCwgYSwgYiwgYywgeFtpICsgMTRdLCA5LCAtMTAxOTgwMzY5MCk7XG4gICAgICAgIGMgPSBtZDVfZ2coYywgZCwgYSwgYiwgeFtpICsgM10sIDE0LCAtMTg3MzYzOTYxKTtcbiAgICAgICAgYiA9IG1kNV9nZyhiLCBjLCBkLCBhLCB4W2kgKyA4XSwgMjAsIDExNjM1MzE1MDEpO1xuICAgICAgICBhID0gbWQ1X2dnKGEsIGIsIGMsIGQsIHhbaSArIDEzXSwgNSwgLTE0NDQ2ODE0NjcpO1xuICAgICAgICBkID0gbWQ1X2dnKGQsIGEsIGIsIGMsIHhbaSArIDJdLCA5LCAtNTE0MDM3ODQpO1xuICAgICAgICBjID0gbWQ1X2dnKGMsIGQsIGEsIGIsIHhbaSArIDddLCAxNCwgMTczNTMyODQ3Myk7XG4gICAgICAgIGIgPSBtZDVfZ2coYiwgYywgZCwgYSwgeFtpICsgMTJdLCAyMCwgLTE5MjY2MDc3MzQpO1xuICAgICAgICBhID0gbWQ1X2hoKGEsIGIsIGMsIGQsIHhbaSArIDVdLCA0LCAtMzc4NTU4KTtcbiAgICAgICAgZCA9IG1kNV9oaChkLCBhLCBiLCBjLCB4W2kgKyA4XSwgMTEsIC0yMDIyNTc0NDYzKTtcbiAgICAgICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2kgKyAxMV0sIDE2LCAxODM5MDMwNTYyKTtcbiAgICAgICAgYiA9IG1kNV9oaChiLCBjLCBkLCBhLCB4W2kgKyAxNF0sIDIzLCAtMzUzMDk1NTYpO1xuICAgICAgICBhID0gbWQ1X2hoKGEsIGIsIGMsIGQsIHhbaSArIDFdLCA0LCAtMTUzMDk5MjA2MCk7XG4gICAgICAgIGQgPSBtZDVfaGgoZCwgYSwgYiwgYywgeFtpICsgNF0sIDExLCAxMjcyODkzMzUzKTtcbiAgICAgICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2kgKyA3XSwgMTYsIC0xNTU0OTc2MzIpO1xuICAgICAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSArIDEwXSwgMjMsIC0xMDk0NzMwNjQwKTtcbiAgICAgICAgYSA9IG1kNV9oaChhLCBiLCBjLCBkLCB4W2kgKyAxM10sIDQsIDY4MTI3OTE3NCk7XG4gICAgICAgIGQgPSBtZDVfaGgoZCwgYSwgYiwgYywgeFtpICsgMF0sIDExLCAtMzU4NTM3MjIyKTtcbiAgICAgICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2kgKyAzXSwgMTYsIC03MjI1MjE5NzkpO1xuICAgICAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSArIDZdLCAyMywgNzYwMjkxODkpO1xuICAgICAgICBhID0gbWQ1X2hoKGEsIGIsIGMsIGQsIHhbaSArIDldLCA0LCAtNjQwMzY0NDg3KTtcbiAgICAgICAgZCA9IG1kNV9oaChkLCBhLCBiLCBjLCB4W2kgKyAxMl0sIDExLCAtNDIxODE1ODM1KTtcbiAgICAgICAgYyA9IG1kNV9oaChjLCBkLCBhLCBiLCB4W2kgKyAxNV0sIDE2LCA1MzA3NDI1MjApO1xuICAgICAgICBiID0gbWQ1X2hoKGIsIGMsIGQsIGEsIHhbaSArIDJdLCAyMywgLTk5NTMzODY1MSk7XG4gICAgICAgIGEgPSBtZDVfaWkoYSwgYiwgYywgZCwgeFtpICsgMF0sIDYsIC0xOTg2MzA4NDQpO1xuICAgICAgICBkID0gbWQ1X2lpKGQsIGEsIGIsIGMsIHhbaSArIDddLCAxMCwgMTEyNjg5MTQxNSk7XG4gICAgICAgIGMgPSBtZDVfaWkoYywgZCwgYSwgYiwgeFtpICsgMTRdLCAxNSwgLTE0MTYzNTQ5MDUpO1xuICAgICAgICBiID0gbWQ1X2lpKGIsIGMsIGQsIGEsIHhbaSArIDVdLCAyMSwgLTU3NDM0MDU1KTtcbiAgICAgICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2kgKyAxMl0sIDYsIDE3MDA0ODU1NzEpO1xuICAgICAgICBkID0gbWQ1X2lpKGQsIGEsIGIsIGMsIHhbaSArIDNdLCAxMCwgLTE4OTQ5ODY2MDYpO1xuICAgICAgICBjID0gbWQ1X2lpKGMsIGQsIGEsIGIsIHhbaSArIDEwXSwgMTUsIC0xMDUxNTIzKTtcbiAgICAgICAgYiA9IG1kNV9paShiLCBjLCBkLCBhLCB4W2kgKyAxXSwgMjEsIC0yMDU0OTIyNzk5KTtcbiAgICAgICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2kgKyA4XSwgNiwgMTg3MzMxMzM1OSk7XG4gICAgICAgIGQgPSBtZDVfaWkoZCwgYSwgYiwgYywgeFtpICsgMTVdLCAxMCwgLTMwNjExNzQ0KTtcbiAgICAgICAgYyA9IG1kNV9paShjLCBkLCBhLCBiLCB4W2kgKyA2XSwgMTUsIC0xNTYwMTk4MzgwKTtcbiAgICAgICAgYiA9IG1kNV9paShiLCBjLCBkLCBhLCB4W2kgKyAxM10sIDIxLCAxMzA5MTUxNjQ5KTtcbiAgICAgICAgYSA9IG1kNV9paShhLCBiLCBjLCBkLCB4W2kgKyA0XSwgNiwgLTE0NTUyMzA3MCk7XG4gICAgICAgIGQgPSBtZDVfaWkoZCwgYSwgYiwgYywgeFtpICsgMTFdLCAxMCwgLTExMjAyMTAzNzkpO1xuICAgICAgICBjID0gbWQ1X2lpKGMsIGQsIGEsIGIsIHhbaSArIDJdLCAxNSwgNzE4Nzg3MjU5KTtcbiAgICAgICAgYiA9IG1kNV9paShiLCBjLCBkLCBhLCB4W2kgKyA5XSwgMjEsIC0zNDM0ODU1NTEpO1xuICAgICAgICBhID0gc2FmZV9hZGQoYSwgZik7XG4gICAgICAgIGIgPSBzYWZlX2FkZChiLCBnKTtcbiAgICAgICAgYyA9IHNhZmVfYWRkKGMsIGgpO1xuICAgICAgICBkID0gc2FmZV9hZGQoZCwgailcbiAgICAgIH1cbiAgICAgIHJldHVybiBBcnJheShhLCBiLCBjLCBkKVxuICAgIH0sIG1kNV9jbW4gPSBmdW5jdGlvbiAocSwgYSwgYiwgeCwgcywgdCkge1xuICAgICAgcmV0dXJuIHNhZmVfYWRkKGJpdF9yb2woc2FmZV9hZGQoc2FmZV9hZGQoYSwgcSksIHNhZmVfYWRkKHgsIHQpKSwgcyksIGIpXG4gICAgfSwgbWQ1X2ZmID0gZnVuY3Rpb24gKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgICAgIHJldHVybiBtZDVfY21uKChiICYgYykgfCAoKH5iKSAmIGQpLCBhLCBiLCB4LCBzLCB0KVxuICAgIH0sIG1kNV9nZyA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XG4gICAgICByZXR1cm4gbWQ1X2NtbigoYiAmIGQpIHwgKGMgJiAofmQpKSwgYSwgYiwgeCwgcywgdClcbiAgICB9LCBtZDVfaGggPSBmdW5jdGlvbiAoYSwgYiwgYywgZCwgeCwgcywgdCkge1xuICAgICAgcmV0dXJuIG1kNV9jbW4oYiBeIGMgXiBkLCBhLCBiLCB4LCBzLCB0KVxuICAgIH0sIG1kNV9paSA9IGZ1bmN0aW9uIChhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XG4gICAgICByZXR1cm4gbWQ1X2NtbihjIF4gKGIgfCAofmQpKSwgYSwgYiwgeCwgcywgdClcbiAgICB9LCBzYWZlX2FkZCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICB2YXIgYSA9ICh4ICYgMHhGRkZGKSArICh5ICYgMHhGRkZGKTtcbiAgICAgIHZhciBiID0gKHggPj4gMTYpICsgKHkgPj4gMTYpICsgKGEgPj4gMTYpO1xuICAgICAgcmV0dXJuIChiIDw8IDE2KSB8IChhICYgMHhGRkZGKVxuICAgIH0sIGJpdF9yb2wgPSBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIChhIDw8IGIpIHwgKGEgPj4+ICgzMiAtIGIpKVxuICAgIH0sIHMyYiA9IGZ1bmN0aW9uIChhKSB7XG4gICAgICB2YXIgYiA9IEFycmF5KCk7XG4gICAgICB2YXIgYyA9ICgxIDw8IGNocnN6KSAtIDE7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoICogY2hyc3o7IGkgKz0gY2hyc3opIGJbaSA+PiA1XSB8PSAoYS5jaGFyQ29kZUF0KGkgLyBjaHJzeikgJiBjKSA8PCAoaSAlIDMyKTtcbiAgICAgIHJldHVybiBiXG4gICAgfSwgYjJoID0gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHZhciBiID0gaGV4Y2FzZSA/IFwiMDEyMzQ1Njc4OUFCQ0RFRlwiIDogXCIwMTIzNDU2Nzg5YWJjZGVmXCI7XG4gICAgICB2YXIgYyA9IFwiXCI7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoICogNDsgaSsrKSB7XG4gICAgICAgIGMgKz0gYi5jaGFyQXQoKGFbaSA+PiAyXSA+PiAoKGkgJSA0KSAqIDggKyA0KSkgJiAweEYpICsgYi5jaGFyQXQoKGFbaSA+PiAyXSA+PiAoKGkgJSA0KSAqIDgpKSAmIDB4RilcbiAgICAgIH1cbiAgICAgIHJldHVybiBjO1xuICAgIH07XG4gICAgcmV0dXJuIGIyaChjbWM1KHMyYihzdHIpLCBzdHIubGVuZ3RoICogY2hyc3opKVxuICB9XG5cbiAgLyoqXG4gICAqIENvbGxlY3RzIHRoZSBVc2VyIEFnZW50IGluZm9ybWF0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIF91c2VyQWdlbnQoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50IHx8IFwiVW5rbm93biBVc2VyIGdlbnRcIjtcbiAgfTtcblxuICAvKipcbiAgICogQ29sbGVjdHMgdGhlIERpc3BsYXktU3RyaW5nIGluZm9ybWF0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIF9kaXNwbGF5KCkge1xuICAgIHZhciBzY3JlZW4gPSB7fTtcbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB3aW5kb3cuc2NyZWVuKSB7XG4gICAgICBpZiAodHlwZW9mIHdpbmRvdy5zY3JlZW5bcHJvcGVydHldICE9ICdmdW5jdGlvbicpIHtcbiAgICAgICAgc2NyZWVuW3Byb3BlcnR5XSA9IHdpbmRvdy5zY3JlZW5bcHJvcGVydHldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoc2NyZWVuKTtcbiAgfTtcblxuICAvKipcbiAgICogQ29sbGVjdHMgdGhlIFRpbWUgWm9uZSBpbmZvcm1hdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBfdGltZXpvbmVPZmZzZXQoKSB7XG4gICAgcmV0dXJuIF9zdHJpbmdUb01ENShuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCkgKyAnJyk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyB0aGUgZmluZ2VycHJpbnQgc3RyaW5nIHdpdGggYWxsIHRoZSBjb2xsZWN0ZWQgaW5mb3JtYXRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZnVuY3Rpb24gX2ZpbmdlcnByaW50KCkge1xuICAgIHJldHVybiBfc3RyaW5nVG9NRDUoX3VzZXJBZ2VudCgpKSArICctJyArIF9zdHJpbmdUb01ENShfZGlzcGxheSgpKSArICctJyArIF9zdHJpbmdUb01ENShfdGltZXpvbmVPZmZzZXQoKSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdHlwZSBvZiBicm93c2VyIHdoZXJlIHRoZSBhcHAgaXMgcnVubmluZ1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmdW5jdGlvbiBfYnJvd3NlclR5cGUoKSB7XG4gICAgdmFyIHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQsIHRlbSwgTSA9IHVhLm1hdGNoKC8ob3BlcmF8Y2hyb21lfHNhZmFyaXxmaXJlZm94fG1zaWV8dHJpZGVudCg/PVxcLykpXFwvP1xccyooXFxkKykvaSkgfHwgW107XG4gICAgaWYgKC90cmlkZW50L2kudGVzdChNWzFdKSkge1xuICAgICAgdGVtID0gL1xcYnJ2WyA6XSsoXFxkKykvZy5leGVjKHVhKSB8fCBbXTtcbiAgICAgIHJldHVybiAnSUUnO1xuICAgIH1cbiAgICBpZiAoTVsxXSA9PT0gJ0Nocm9tZScpIHtcbiAgICAgIHRlbSA9IHVhLm1hdGNoKC9cXGJPUFJcXC8oXFxkKykvKVxuICAgICAgaWYgKHRlbSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiAnT3BlcmEnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gTVsxXTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyB0aGUgZmFjZXQgd2l0aCB0aGUgYnJvd3NlciBpbmZvXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIF9icm93c2VyRmFjZXQoKSB7XG4gICAgcmV0dXJuICB7XG4gICAgICB0eXBlOiBfYnJvd3NlclR5cGUoKSxcbiAgICAgIHVzZXJfYWdlbnQ6IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnJlcGxhY2UoJzsnLCcsJyksXG4gICAgICBwbGF0Zm9ybTogd2luZG93Lm5hdmlnYXRvci5wbGF0Zm9ybSxcbiAgICAgIGxhbmd1YWdlOiB3aW5kb3cubmF2aWdhdG9yLmxhbmd1YWdlcyB8fCBbd2luZG93Lm5hdmlnYXRvci5sYW5ndWFnZV0gfHwgW11cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBmaW5nZXJwcmludDogX2ZpbmdlcnByaW50LFxuICAgIGJyb3dzZXJGYWNldDogX2Jyb3dzZXJGYWNldFxuICB9O1xufSkod2luZG93LCBKU09OKTsiLCIvKipcbiAqIEFEUCBVdGlsc1xuICogQGF1dGhvciBNaWNhZWxhIExvcGV6IDxtaWNhZWxhLmxvcGV6QGF1dG9kZXNrLmNvbT5cbiAqIEB0eXBlIHtleHBvcnRzfVxuICovXG52YXIgREVGQVVMVF9TRVJWRVIgPSBcIiRERUZBVUxUX1NFUlZFUlwiO1xudmFyIFNDSEVNQV9WRVJTSU9OID0gXCIkU0NIRU1BX1ZFUlNJT05cIjtcbnZhciBUUkFDS19FTkRQT0lOVCA9IFwiJFRSQUNLX0VORFBPSU5UXCI7XG52YXIgU0RLX1ZFUlNJT04gPSBcImpzX3dlYi0kUEtHX1ZFUlNJT05cIjtcblxudmFyIGZwID0gcmVxdWlyZSgnLi9GaW5nZXJwcmludC5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoKSB7XG5cbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50IHRpbWVzdGFtcFxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gX3RpbWVzdGFtcCgpIHtcbiAgICB2YXIgbm93ID0gbmV3IERhdGUoKSxcbiAgICAgIHR6byA9IC1ub3cuZ2V0VGltZXpvbmVPZmZzZXQoKSxcbiAgICAgIGRpZiA9IHR6byA+PSAwID8gJysnIDogJy0nLFxuICAgICAgcGFkID0gZnVuY3Rpb24gKG51bSkge1xuICAgICAgICB2YXIgbm9ybSA9IE1hdGguYWJzKE1hdGguZmxvb3IobnVtKSk7XG4gICAgICAgIHJldHVybiAobm9ybSA8IDEwID8gJzAnIDogJycpICsgbm9ybTtcbiAgICAgIH07XG4gICAgcmV0dXJuIG5vdy5nZXRGdWxsWWVhcigpXG4gICAgICArICctJyArIHBhZChub3cuZ2V0TW9udGgoKSArIDEpXG4gICAgICArICctJyArIHBhZChub3cuZ2V0RGF0ZSgpKVxuICAgICAgKyAnVCcgKyBwYWQobm93LmdldEhvdXJzKCkpXG4gICAgICArICc6JyArIHBhZChub3cuZ2V0TWludXRlcygpKVxuICAgICAgKyAnOicgKyBwYWQobm93LmdldFNlY29uZHMoKSlcbiAgICAgICsgJy4nICsgbm93LmdldE1pbGxpc2Vjb25kcygpXG4gICAgICArIGRpZiArIHBhZCh0em8gLyA2MClcbiAgICAgICsgJzonICsgcGFkKHR6byAlIDYwKTtcbiAgfTtcblxuICBmdW5jdGlvbiBfYnVpbGRDb25mKGNvbmZpZykge1xuICAgIHZhciBjb25mID0ge307XG4gICAgaWYgKGNvbmZpZyAmJiAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGNvbmZpZy5zZXJ2ZXIpXG4gICAgICBjb25mLnNlcnZlciA9IGNvbmZpZy5zZXJ2ZXIgKyBUUkFDS19FTkRQT0lOVDtcbiAgICBlbHNlXG4gICAgICBjb25mLnNlcnZlciA9IERFRkFVTFRfU0VSVkVSICsgVFJBQ0tfRU5EUE9JTlQ7XG4gICAgaWYgKGNvbmZpZyAmJiAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGNvbmZpZy5lbmFibGVfZ2VvX2RhdGEpXG4gICAgICBjb25mLmVuYWJsZV9nZW9fZGF0YSA9IGNvbmZpZy5lbmFibGVfZ2VvX2RhdGE7XG4gICAgZWxzZVxuICAgICAgY29uZi5lbmFibGVfZ2VvX2RhdGEgPSB0cnVlO1xuICAgIGlmIChjb25maWcgJiYgJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBjb25maWcuZW5hYmxlX2Jyb3dzZXJfZGF0YSlcbiAgICAgIGNvbmYuZW5hYmxlX2Jyb3dzZXJfZGF0YSA9IGNvbmZpZy5lbmFibGVfYnJvd3Nlcl9kYXRhO1xuICAgIGVsc2VcbiAgICAgIGNvbmYuZW5hYmxlX2Jyb3dzZXJfZGF0YSA9IHRydWU7XG4gICAgaWYgKGNvbmZpZyAmJiAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGNvbmZpZy5lbmFibGVfc2Vzc2lvbl9tZXNzYWdlcylcbiAgICAgIGNvbmYuZW5hYmxlX3Nlc3Npb25fbWVzc2FnZXMgPSBjb25maWcuZW5hYmxlX3Nlc3Npb25fbWVzc2FnZXM7XG4gICAgZWxzZVxuICAgICAgY29uZi5lbmFibGVfc2Vzc2lvbl9tZXNzYWdlcyA9IHRydWU7XG4gICAgaWYgKGNvbmZpZyAmJiAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIGNvbmZpZy5zdXBwcmVzc193YXJuaW5ncylcbiAgICAgIGNvbmYuc3VwcHJlc3Nfd2FybmluZ3MgPSBjb25maWcuc3VwcHJlc3Nfd2FybmluZ3M7XG4gICAgZWxzZVxuICAgICAgY29uZi5zdXBwcmVzc193YXJuaW5ncyA9IGZhbHNlO1xuICAgIHJldHVybiBjb25mO1xuICB9XG5cbiAgLyoqXG4gICAqIEJ1aWxkcyB0aGUgZmFjZXRzXG4gICAqIEBwYXJhbSBjb25mIGEgbWFwIHdpdGggdGhlIHNkayBjb25maWd1cmF0aW9uXG4gICAqIEBwYXJhbSBmdHMgdGhlIGZhY2V0cyB0byBzZXRcbiAgICogQHBhcmFtIGN0eEZ0cyB0aGUgZmFjZXRzIHRoYXQgYXJlIGFscmVhZHkgaW4gcGxhY2UgaW4gdGhlIFNESyBjb250ZXh0XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBfYnVpbGRGYWNldHMoZnRzLCBjdHhGdHMpIHtcbiAgICB2YXIgZmFjZXRzID0gY3R4RnRzIHx8IHt9O1xuICAgIGlmIChmdHMpIHtcbiAgICAgIF9mYWNldHNDb2VyY2lvbihmdHMpO1xuICAgICAgaWYgKGZ0cy5icm93c2VyKSBmYWNldHMuYnJvd3NlciA9IGZ0cy5icm93c2VyIHx8IGZhY2V0cy5icm93c2VyO1xuICAgICAgaWYgKGZ0cy5nZW8pIGZhY2V0cy5nZW8gPSBmdHMuZ2VvIHx8IGZhY2V0cy5nZW87XG4gICAgICBpZiAoZnRzLnByb2R1Y3QpIGZhY2V0cy5wcm9kdWN0ID0gZnRzLnByb2R1Y3QgfHwgZmFjZXRzLnByb2R1Y3Q7XG4gICAgICBpZiAoZnRzLmRldmljZSkgZmFjZXRzLmRldmljZSA9IGZ0cy5kZXZpY2UgfHwgZmFjZXRzLmRldmljZTtcbiAgICAgIGlmIChmdHMub3BlcmF0aW9uKSBmYWNldHMub3BlcmF0aW9uID0gZnRzLm9wZXJhdGlvbiB8fCBmYWNldHMub3BlcmF0aW9uO1xuICAgICAgaWYgKGZ0cy5lbnRpdGxlbWVudCkgZmFjZXRzLmVudGl0bGVtZW50ID0gZnRzLmVudGl0bGVtZW50IHx8IGZhY2V0cy5lbnRpdGxlbWVudDtcbiAgICAgIGlmIChmdHMuY29tcG9uZW50KSBmYWNldHMuY29tcG9uZW50ID0gZnRzLmNvbXBvbmVudCB8fCBmYWNldHMuY29tcG9uZW50O1xuICAgICAgaWYgKGZ0cy5jb250ZW50KSBmYWNldHMuY29udGVudCA9IGZ0cy5jb250ZW50IHx8IGZhY2V0cy5jb250ZW50O1xuICAgICAgaWYgKGZ0cy5odHRwKSBmYWNldHMuaHR0cCA9IGZ0cy5odHRwIHx8IGZhY2V0cy5odHRwO1xuICAgICAgaWYgKGZ0cy5leHBlcmltZW50X2luZm8pIGZhY2V0cy5leHBlcmltZW50X2luZm8gPSBmdHMuZXhwZXJpbWVudF9pbmZvIHx8IGZhY2V0cy5leHBlcmltZW50X2luZm87XG4gICAgICBpZiAoZnRzLnNlYXJjaCkgZmFjZXRzLnNlYXJjaCA9IGZ0cy5zZWFyY2ggfHwgZmFjZXRzLmV4cGVyaW1lbnRfaW5mbztcbiAgICAgIGZhY2V0cy51c2VyX2luZm8gPSBmYWNldHMudXNlcl9pbmZvIHx8IHt9O1xuICAgIH1cbiAgICByZXR1cm4gZmFjZXRzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhbiBHVUlEIFJGQy00MTIyIGNvbXBsaWFudFxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZnVuY3Rpb24gX2dlbkd1aWQoKSB7XG4gICAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24gKGMpIHtcbiAgICAgIHZhciByID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMCwgdiA9IGMgPT09ICd4JyA/IHIgOiAociAmIDB4MyB8IDB4OCk7XG4gICAgICByZXR1cm4gdi50b1N0cmluZygxNik7XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEZpbmdlcnByaW50IGdlbmVyYXRpb25cbiAgICogQHJldHVybnMge1N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIF9jcmVhdGVGaW5nZXJwcmludCgpIHtcbiAgICByZXR1cm4gZnAuZmluZ2VycHJpbnQoKTtcbiAgfTtcblxuICAvKipcbiAgICogQ3JlYXRlcyB0aGUgbWVzc2FnZSB0byBiZSBzZW50IHRvIEFTRSBzZXJ2aWNlc1xuICAgKiBAcGFyYW0gcmVnSW5mbyB0aGUgaWQgb2YgdGhlIHVzZXIgdGhhdCBsb2dnZWQgaW5cbiAgICogQHBhcmFtIHR5cGUgcmVxdWlyZWQsIHR5cGUgb2YgdGhlIGV2ZW50XG4gICAqIEBwYXJhbSBjb25maWcgdGhlIFNESyBjb25maWd1cmF0aW9uXG4gICAqIEBwYXJhbSB0cmFja0Z0cyBvcGVyYXRpb24gZmFjZXRzXG4gICAqIEByZXR1cm5zIHt7fX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIF9idWlsZE1zZyhyZWdJbmZvLCB0eXBlLCBzY29wZSwgY29uZmlnLCB0cmFja0Z0cykge1xuICAgIHZhciBkYXRhID0ge307XG5cbiAgICAvLyBBUEkgU2V0dGluZ3NlXG4gICAgZGF0YS52ZXJzaW9uID0gU0NIRU1BX1ZFUlNJT047XG4gICAgZGF0YS5zZGtfdmVyc2lvbiA9IFNES19WRVJTSU9OO1xuICAgIGRhdGEuc3RhdHVzID0gJ09LJztcbiAgICBkYXRhLnNlc3Npb25faWQgPSByZWdJbmZvLnNlc3Npb25faWQ7XG4gICAgZGF0YS5kZXZpY2VfaWQgPSByZWdJbmZvLmRldmljZV9pZCB8fCBfY3JlYXRlRmluZ2VycHJpbnQoKTtcblxuICAgIC8vIEFwcCBTZXR0aW5nc1xuICAgIGRhdGEudXNlcl9pZCA9IHJlZ0luZm8udXNlcl9pZDtcbiAgICBkYXRhLnByb3ZpZGVyX25hbWUgPSByZWdJbmZvLnByb3ZpZGVyX25hbWU7XG5cbiAgICBkYXRhLmRldmljZV90aW1lID0gX3RpbWVzdGFtcCgpO1xuICAgIGRhdGEuZHVyYXRpb24gPSByZWdJbmZvLmR1cmF0aW9uIHx8IC0xO1xuICAgIGRhdGEuZXZlbnRfaWQgPSBfZ2VuR3VpZCgpO1xuICAgIGRhdGEudHlwZSA9IHR5cGU7XG4gICAgZGF0YS5zY29wZSA9IHNjb3BlO1xuXG4gICAgZGF0YS5jdXJfc2VydmljZV9pZCA9IHJlZ0luZm8uY3VyX3NlcnZpY2VfaWQ7XG4gICAgZGF0YS5jdXJfc2VydmljZV9uYW1lID0gcmVnSW5mby5jdXJfc2VydmljZV9uYW1lO1xuXG4gICAgZGF0YS5tb2R1bGVfbmFtZSA9ICdBU0UnO1xuICAgIGRhdGEubWV0aG9kX25hbWUgPSAnL3VwbG9hZCc7XG5cbiAgICAvLyBCcm93c2VyIGZhY2V0c1xuICAgIHRyYWNrRnRzID0gdHJhY2tGdHMgfHwge307XG4gICAgX2ZhY2V0c0NvZXJjaW9uKHRyYWNrRnRzKTtcbiAgICBpZiAoY29uZmlnLmVuYWJsZV9icm93c2VyX2RhdGEpIHtcbiAgICAgIHRyYWNrRnRzLmJyb3dzZXIgPSB0cmFja0Z0cy5icm93c2VyIHx8IGZwLmJyb3dzZXJGYWNldCgpIHx8IHt9O1xuICAgIH1cblxuICAgIHZhciBmYWNldHNMaXN0ID0gW107XG4gICAgZm9yIChuYW1lIGluIHJlZ0luZm8uZmFjZXRzKSB7XG4gICAgICBpZiAoJ3VuZGVmaW5lZCcgPT0gdHlwZW9mIHRyYWNrRnRzW25hbWVdKVxuICAgICAgICB0cmFja0Z0c1tuYW1lXSA9IHJlZ0luZm8uZmFjZXRzW25hbWVdO1xuICAgIH1cbiAgICBmb3IgKG5hbWUgaW4gdHJhY2tGdHMpIHtcbiAgICAgIGlmIChuYW1lID09PSBcInVzZXJfaW5mb1wiKSB7XG4gICAgICAgIHZhciB1c2VycyA9IFtdO1xuICAgICAgICBmb3IgKHByb3AgaW4gdHJhY2tGdHNbbmFtZV0pIHVzZXJzLnB1c2godHJhY2tGdHNbbmFtZV1bcHJvcF0pO1xuICAgICAgICBpZiAodXNlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGRhdGEudXNlcl9pbmZvID0gdXNlcnM7XG4gICAgICAgICAgZmFjZXRzTGlzdC5wdXNoKFwidXNlcl9pbmZvXCIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmYWNldHNMaXN0LnB1c2gobmFtZSk7XG4gICAgICAgIGZvciAocHJvcCBpbiB0cmFja0Z0c1tuYW1lXSkge1xuICAgICAgICAgIGRhdGFbbmFtZSArICdfJyArIHByb3BdID0gdHJhY2tGdHNbbmFtZV1bcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZGF0YS5mYWNldHMgPSBmYWNldHNMaXN0O1xuICAgIHJldHVybiBkYXRhO1xuICB9O1xuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZXMgcHJvZHVjdCBmYWNldHNcbiAgICogQHBhcmFtIHByb2R1Y3RcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaXQncyB2YWxpZFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cblxuICBmdW5jdGlvbiBfaXNWYWxpZFByb2R1Y3QocHJvZHVjdCkge1xuICAgIGlmIChwcm9kdWN0KSB7XG4gICAgICBpZiAoIXByb2R1Y3QuaWQgfHwgIXByb2R1Y3QubmFtZSB8fCAhcHJvZHVjdC5pZF9wcm92aWRlcikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZXMgdGhlIGlkZW50aXR5IHByb3ZpZGVyIG9mIHRoZSBwcm9kdWN0XG4gICAqIEBwYXJhbSBwcm9kdWN0XG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIGl0J3MgdmFsaWRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIF9pc1ZhbGlkUHJvZHVjdElkUHJvdmlkZXIocHJvdmlkZXIpIHtcbiAgICB2YXIgdXBwZXIgPSBTdHJpbmcocHJvdmlkZXIpLnRvTG9jYWxlVXBwZXJDYXNlKCk7XG4gICAgaWYgKHVwcGVyID09ICdBUFBLRVknIHx8IHVwcGVyID09ICdVUEkxJyB8fCB1cHBlciA9PSAnVVBJMicpXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuIC8qKlxuICAqIEZvcmNlIHRoZSBmYWNldCdzIG1hcCBhdHRyaWJ1dGVzIHRvIGZ1bGZpbGwgdGhlIGRlc2lyZWQgZmllbGQgc3BlY1xuICAqIEBwYXJhbSBmdHMgZmFjZXRzXG4gICogQHByaXZhdGVcbiAgKi9cbiAgZnVuY3Rpb24gX2ZhY2V0c0NvZXJjaW9uKGZ0cykge1xuICAgICBpZiAoZnRzKSB7XG4gICAgICAgIGlmKGZ0cy5wcm9kdWN0KSB7XG4gICAgICAgICAgIGZ0cy5wcm9kdWN0LmlkX3Byb3ZpZGVyID0gX3N0cmluZ1RvTG93ZXJDYXNlKGZ0cy5wcm9kdWN0LmlkX3Byb3ZpZGVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZnRzLm9wZXJhdGlvbikge1xuICAgICAgICAgICAgX2ZvcmNlTWFwVmFsdWVzVG9TdHJpbmcoZnRzLm9wZXJhdGlvbi5tZXRhKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZnRzLmVudGl0bGVtZW50KSB7XG4gICAgICAgICAgICBfZm9yY2VNYXBWYWx1ZXNUb1N0cmluZyhmdHMuZW50aXRsZW1lbnQucHJvcGVydGllcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZ0cy5jb21wb25lbnQpIHtcbiAgICAgICAgICAgIF9mb3JjZU1hcFZhbHVlc1RvU3RyaW5nKGZ0cy5jb21wb25lbnQuYXR0cmlidXRlcyk7XG4gICAgICAgICAgICBfZm9yY2VNYXBWYWx1ZXNUb1N0cmluZyhmdHMuY29tcG9uZW50Lm1ldHJpY3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmdHMuY29udGVudCkge1xuICAgICAgICAgICAgX2ZvcmNlTWFwVmFsdWVzVG9TdHJpbmcoZnRzLmNvbnRlbnQubWV0YSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZ0cy5odHRwKSB7XG4gICAgICAgICAgICBfZm9yY2VNYXBWYWx1ZXNUb1N0cmluZyhmdHMuaHR0cC5mb3JtX3BhcmFtcyk7XG4gICAgICAgICAgICBfZm9yY2VNYXBWYWx1ZXNUb1N0cmluZyhmdHMuaHR0cC5yZXF1ZXN0X2hlYWRlcnMpO1xuICAgICAgICAgICAgX2ZvcmNlTWFwVmFsdWVzVG9TdHJpbmcoZnRzLmh0dHAucmVzcG9uc2VfaGVhZGVycyk7XG4gICAgICAgIH1cbiAgICAgfVxuICB9XG5cbiAvKipcbiAgKiBGb3JjZSBtYXAncyB2YWx1ZXMgdG8gYmUgb2YgU3RyaW5nIHR5cGVcbiAgKiBAcGFyYW0gbWFwXG4gICogQHByaXZhdGVcbiAgKi9cbiAgZnVuY3Rpb24gX2ZvcmNlTWFwVmFsdWVzVG9TdHJpbmcobWFwKSB7XG4gICAgIGlmKG1hcCl7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBtYXApIHtcbiAgICAgICAgICAgaWYobWFwW2tleV0pIG1hcFtrZXldID0gbWFwW2tleV0gKycnO1xuICAgICAgICB9XG4gICAgIH1cbiAgfVxuXG4gLyoqXG4gICogQ29udmVydHMgc3RyaW5nIGNoYXJhY3RlcnMgdG8gbG93ZXIgY2FzZXMuXG4gICogQHBhcmFtIHN0clxuICAqIEBwcml2YXRlXG4gICovXG4gIGZ1bmN0aW9uIF9zdHJpbmdUb0xvd2VyQ2FzZShzdHIpIHtcbiAgICAgaWYoc3RyKSB7XG4gICAgICAgICByZXR1cm4gU3RyaW5nKHN0cikudG9Mb2NhbGVMb3dlckNhc2UoKVxuICAgICB9XG4gICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm57XG4gICAgYnVpbGRDb25mOiBfYnVpbGRDb25mLFxuICAgIGJ1aWxkRmFjZXRzOiBfYnVpbGRGYWNldHMsXG4gICAgYnVpbGRNc2c6IF9idWlsZE1zZyxcbiAgICBnZW5HdWlkOiBfZ2VuR3VpZCxcbiAgICBpc1ZhbGlkUHJvZHVjdDogX2lzVmFsaWRQcm9kdWN0LFxuICAgIGlzVmFsaWRQcm9kdWN0SWRQcm92aWRlcjogX2lzVmFsaWRQcm9kdWN0SWRQcm92aWRlclxuICB9XG59KVxuKCk7IiwiLyohIGpRdWVyeSB2My4wLjAtcHJlIC1jc3MsLWNzcy9hZGRHZXRIb29rSWYsLWNzcy9hZGp1c3RDU1MsLWNzcy9jdXJDU1MsLWNzcy9oaWRkZW5WaXNpYmxlU2VsZWN0b3JzLC1jc3Mvc2hvd0hpZGUsLWNzcy9zdXBwb3J0LC1jc3MvdmFyL2Nzc0V4cGFuZCwtY3NzL3Zhci9nZXRTdHlsZXMsLWNzcy92YXIvaXNIaWRkZW4sLWNzcy92YXIvcm1hcmdpbiwtY3NzL3Zhci9ybnVtbm9ucHgsLWNzcy92YXIvc3dhcCwtZWZmZWN0cywtZWZmZWN0cy9Ud2VlbiwtZWZmZWN0cy9hbmltYXRlZFNlbGVjdG9yLC1kaW1lbnNpb25zLC1vZmZzZXQsLWRlcHJlY2F0ZWQsLWV2ZW50L2FsaWFzLC13cmFwLC1hamF4L2pzb25wIHwgKGMpIGpRdWVyeSBGb3VuZGF0aW9uIHwganF1ZXJ5Lm9yZy9saWNlbnNlICovXG4hZnVuY3Rpb24oYSxiKXtcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlJiZcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlLmV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9YS5kb2N1bWVudD9iKGEsITApOmZ1bmN0aW9uKGEpe2lmKCFhLmRvY3VtZW50KXRocm93IG5ldyBFcnJvcihcImpRdWVyeSByZXF1aXJlcyBhIHdpbmRvdyB3aXRoIGEgZG9jdW1lbnRcIik7cmV0dXJuIGIoYSl9OmIoYSl9KFwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93OnRoaXMsZnVuY3Rpb24oYSxiKXt2YXIgYz1bXSxkPWEuZG9jdW1lbnQsZT1jLnNsaWNlLGY9Yy5jb25jYXQsZz1jLnB1c2gsaD1jLmluZGV4T2YsaT17fSxqPWkudG9TdHJpbmcsaz1pLmhhc093blByb3BlcnR5LGw9e30sbT1cIjMuMC4wLXByZSAtY3NzLC1jc3MvYWRkR2V0SG9va0lmLC1jc3MvYWRqdXN0Q1NTLC1jc3MvY3VyQ1NTLC1jc3MvaGlkZGVuVmlzaWJsZVNlbGVjdG9ycywtY3NzL3Nob3dIaWRlLC1jc3Mvc3VwcG9ydCwtY3NzL3Zhci9jc3NFeHBhbmQsLWNzcy92YXIvZ2V0U3R5bGVzLC1jc3MvdmFyL2lzSGlkZGVuLC1jc3MvdmFyL3JtYXJnaW4sLWNzcy92YXIvcm51bW5vbnB4LC1jc3MvdmFyL3N3YXAsLWVmZmVjdHMsLWVmZmVjdHMvVHdlZW4sLWVmZmVjdHMvYW5pbWF0ZWRTZWxlY3RvciwtZGltZW5zaW9ucywtb2Zmc2V0LC1kZXByZWNhdGVkLC1ldmVudC9hbGlhcywtd3JhcCwtYWpheC9qc29ucFwiLG49ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbmV3IG4uZm4uaW5pdChhLGIpfSxvPS9eW1xcc1xcdUZFRkZcXHhBMF0rfFtcXHNcXHVGRUZGXFx4QTBdKyQvZyxwPS9eLW1zLS8scT0vLShbYS16XSkvZyxyPWZ1bmN0aW9uKGEsYil7cmV0dXJuIGIudG9VcHBlckNhc2UoKX07bi5mbj1uLnByb3RvdHlwZT17anF1ZXJ5Om0sY29uc3RydWN0b3I6bixsZW5ndGg6MCx0b0FycmF5OmZ1bmN0aW9uKCl7cmV0dXJuIGUuY2FsbCh0aGlzKX0sZ2V0OmZ1bmN0aW9uKGEpe3JldHVybiBudWxsIT1hPzA+YT90aGlzW2ErdGhpcy5sZW5ndGhdOnRoaXNbYV06ZS5jYWxsKHRoaXMpfSxwdXNoU3RhY2s6ZnVuY3Rpb24oYSl7dmFyIGI9bi5tZXJnZSh0aGlzLmNvbnN0cnVjdG9yKCksYSk7cmV0dXJuIGIucHJldk9iamVjdD10aGlzLGJ9LGVhY2g6ZnVuY3Rpb24oYSl7cmV0dXJuIG4uZWFjaCh0aGlzLGEpfSxtYXA6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMucHVzaFN0YWNrKG4ubWFwKHRoaXMsZnVuY3Rpb24oYixjKXtyZXR1cm4gYS5jYWxsKGIsYyxiKX0pKX0sc2xpY2U6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wdXNoU3RhY2soZS5hcHBseSh0aGlzLGFyZ3VtZW50cykpfSxmaXJzdDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmVxKDApfSxsYXN0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZXEoLTEpfSxlcTpmdW5jdGlvbihhKXt2YXIgYj10aGlzLmxlbmd0aCxjPSthKygwPmE/YjowKTtyZXR1cm4gdGhpcy5wdXNoU3RhY2soYz49MCYmYj5jP1t0aGlzW2NdXTpbXSl9LGVuZDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnByZXZPYmplY3R8fHRoaXMuY29uc3RydWN0b3IobnVsbCl9LHB1c2g6Zyxzb3J0OmMuc29ydCxzcGxpY2U6Yy5zcGxpY2V9LG4uZXh0ZW5kPW4uZm4uZXh0ZW5kPWZ1bmN0aW9uKCl7dmFyIGEsYixjLGQsZSxmLGc9YXJndW1lbnRzWzBdfHx7fSxoPTEsaT1hcmd1bWVudHMubGVuZ3RoLGo9ITE7Zm9yKFwiYm9vbGVhblwiPT10eXBlb2YgZyYmKGo9ZyxnPWFyZ3VtZW50c1toXXx8e30saCsrKSxcIm9iamVjdFwiPT10eXBlb2YgZ3x8bi5pc0Z1bmN0aW9uKGcpfHwoZz17fSksaD09PWkmJihnPXRoaXMsaC0tKTtpPmg7aCsrKWlmKG51bGwhPShhPWFyZ3VtZW50c1toXSkpZm9yKGIgaW4gYSljPWdbYl0sZD1hW2JdLGchPT1kJiYoaiYmZCYmKG4uaXNQbGFpbk9iamVjdChkKXx8KGU9bi5pc0FycmF5KGQpKSk/KGU/KGU9ITEsZj1jJiZuLmlzQXJyYXkoYyk/YzpbXSk6Zj1jJiZuLmlzUGxhaW5PYmplY3QoYyk/Yzp7fSxnW2JdPW4uZXh0ZW5kKGosZixkKSk6dm9pZCAwIT09ZCYmKGdbYl09ZCkpO3JldHVybiBnfSxuLmV4dGVuZCh7ZXhwYW5kbzpcImpRdWVyeVwiKyhtK01hdGgucmFuZG9tKCkpLnJlcGxhY2UoL1xcRC9nLFwiXCIpLGlzUmVhZHk6ITAsZXJyb3I6ZnVuY3Rpb24oYSl7dGhyb3cgbmV3IEVycm9yKGEpfSxub29wOmZ1bmN0aW9uKCl7fSxpc0Z1bmN0aW9uOmZ1bmN0aW9uKGEpe3JldHVyblwiZnVuY3Rpb25cIj09PW4udHlwZShhKX0saXNBcnJheTpBcnJheS5pc0FycmF5LGlzV2luZG93OmZ1bmN0aW9uKGEpe3JldHVybiBudWxsIT1hJiZhPT09YS53aW5kb3d9LGlzTnVtZXJpYzpmdW5jdGlvbihhKXtyZXR1cm4hbi5pc0FycmF5KGEpJiZhLXBhcnNlRmxvYXQoYSkrMT49MH0saXNQbGFpbk9iamVjdDpmdW5jdGlvbihhKXtyZXR1cm5cIm9iamVjdFwiIT09bi50eXBlKGEpfHxhLm5vZGVUeXBlfHxuLmlzV2luZG93KGEpPyExOmEuY29uc3RydWN0b3ImJiFrLmNhbGwoYS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsXCJpc1Byb3RvdHlwZU9mXCIpPyExOiEwfSxpc0VtcHR5T2JqZWN0OmZ1bmN0aW9uKGEpe3ZhciBiO2ZvcihiIGluIGEpcmV0dXJuITE7cmV0dXJuITB9LHR5cGU6ZnVuY3Rpb24oYSl7cmV0dXJuIG51bGw9PWE/YStcIlwiOlwib2JqZWN0XCI9PXR5cGVvZiBhfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBhP2lbai5jYWxsKGEpXXx8XCJvYmplY3RcIjp0eXBlb2YgYX0sZ2xvYmFsRXZhbDpmdW5jdGlvbihhKXt2YXIgYj1kLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7Yi50ZXh0PWEsZC5oZWFkLmFwcGVuZENoaWxkKGIpLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYil9LGNhbWVsQ2FzZTpmdW5jdGlvbihhKXtyZXR1cm4gYS5yZXBsYWNlKHAsXCJtcy1cIikucmVwbGFjZShxLHIpfSxub2RlTmFtZTpmdW5jdGlvbihhLGIpe3JldHVybiBhLm5vZGVOYW1lJiZhLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk9PT1iLnRvTG93ZXJDYXNlKCl9LGVhY2g6ZnVuY3Rpb24oYSxiKXt2YXIgYyxkPTA7aWYocyhhKSl7Zm9yKGM9YS5sZW5ndGg7Yz5kO2QrKylpZihiLmNhbGwoYVtkXSxkLGFbZF0pPT09ITEpYnJlYWt9ZWxzZSBmb3IoZCBpbiBhKWlmKGIuY2FsbChhW2RdLGQsYVtkXSk9PT0hMSlicmVhaztyZXR1cm4gYX0sdHJpbTpmdW5jdGlvbihhKXtyZXR1cm4gbnVsbD09YT9cIlwiOihhK1wiXCIpLnJlcGxhY2UobyxcIlwiKX0sbWFrZUFycmF5OmZ1bmN0aW9uKGEsYil7dmFyIGM9Ynx8W107cmV0dXJuIG51bGwhPWEmJihzKE9iamVjdChhKSk/bi5tZXJnZShjLFwic3RyaW5nXCI9PXR5cGVvZiBhP1thXTphKTpnLmNhbGwoYyxhKSksY30saW5BcnJheTpmdW5jdGlvbihhLGIsYyl7cmV0dXJuIG51bGw9PWI/LTE6aC5jYWxsKGIsYSxjKX0sbWVyZ2U6ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9K2IubGVuZ3RoLGQ9MCxlPWEubGVuZ3RoO2M+ZDtkKyspYVtlKytdPWJbZF07cmV0dXJuIGEubGVuZ3RoPWUsYX0sZ3JlcDpmdW5jdGlvbihhLGIsYyl7Zm9yKHZhciBkLGU9W10sZj0wLGc9YS5sZW5ndGgsaD0hYztnPmY7ZisrKWQ9IWIoYVtmXSxmKSxkIT09aCYmZS5wdXNoKGFbZl0pO3JldHVybiBlfSxtYXA6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkLGUsZz0wLGg9W107aWYocyhhKSlmb3IoZD1hLmxlbmd0aDtkPmc7ZysrKWU9YihhW2ddLGcsYyksbnVsbCE9ZSYmaC5wdXNoKGUpO2Vsc2UgZm9yKGcgaW4gYSllPWIoYVtnXSxnLGMpLG51bGwhPWUmJmgucHVzaChlKTtyZXR1cm4gZi5hcHBseShbXSxoKX0sZ3VpZDoxLHByb3h5OmZ1bmN0aW9uKGEsYil7dmFyIGMsZCxmO3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBiJiYoYz1hW2JdLGI9YSxhPWMpLG4uaXNGdW5jdGlvbihhKT8oZD1lLmNhbGwoYXJndW1lbnRzLDIpLGY9ZnVuY3Rpb24oKXtyZXR1cm4gYS5hcHBseShifHx0aGlzLGQuY29uY2F0KGUuY2FsbChhcmd1bWVudHMpKSl9LGYuZ3VpZD1hLmd1aWQ9YS5ndWlkfHxuLmd1aWQrKyxmKTp2b2lkIDB9LG5vdzpEYXRlLm5vdyxzdXBwb3J0Omx9KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJihuLmZuW1N5bWJvbC5pdGVyYXRvcl09Y1tTeW1ib2wuaXRlcmF0b3JdKSxuLmVhY2goXCJCb29sZWFuIE51bWJlciBTdHJpbmcgRnVuY3Rpb24gQXJyYXkgRGF0ZSBSZWdFeHAgT2JqZWN0IEVycm9yXCIuc3BsaXQoXCIgXCIpLGZ1bmN0aW9uKGEsYil7aVtcIltvYmplY3QgXCIrYitcIl1cIl09Yi50b0xvd2VyQ2FzZSgpfSk7ZnVuY3Rpb24gcyhhKXt2YXIgYj0hIWEmJlwibGVuZ3RoXCJpbiBhJiZhLmxlbmd0aCxjPW4udHlwZShhKTtyZXR1cm5cImZ1bmN0aW9uXCI9PT1jfHxuLmlzV2luZG93KGEpPyExOlwiYXJyYXlcIj09PWN8fDA9PT1ifHxcIm51bWJlclwiPT10eXBlb2YgYiYmYj4wJiZiLTEgaW4gYX12YXIgdD1mdW5jdGlvbihhKXt2YXIgYixjLGQsZSxmLGcsaCxpLGosayxsLG0sbixvLHAscSxyLHMsdCx1PVwic2l6emxlXCIrMSpuZXcgRGF0ZSx2PWEuZG9jdW1lbnQsdz0wLHg9MCx5PWdhKCksej1nYSgpLEE9Z2EoKSxCPWZ1bmN0aW9uKGEsYil7cmV0dXJuIGE9PT1iJiYobD0hMCksMH0sQz0xPDwzMSxEPXt9Lmhhc093blByb3BlcnR5LEU9W10sRj1FLnBvcCxHPUUucHVzaCxIPUUucHVzaCxJPUUuc2xpY2UsSj1mdW5jdGlvbihhLGIpe2Zvcih2YXIgYz0wLGQ9YS5sZW5ndGg7ZD5jO2MrKylpZihhW2NdPT09YilyZXR1cm4gYztyZXR1cm4tMX0sSz1cImNoZWNrZWR8c2VsZWN0ZWR8YXN5bmN8YXV0b2ZvY3VzfGF1dG9wbGF5fGNvbnRyb2xzfGRlZmVyfGRpc2FibGVkfGhpZGRlbnxpc21hcHxsb29wfG11bHRpcGxlfG9wZW58cmVhZG9ubHl8cmVxdWlyZWR8c2NvcGVkXCIsTD1cIltcXFxceDIwXFxcXHRcXFxcclxcXFxuXFxcXGZdXCIsTT1cIig/OlxcXFxcXFxcLnxbXFxcXHctXXxbXlxcXFx4MDAtXFxcXHhhMF0pK1wiLE49XCJcXFxcW1wiK0wrXCIqKFwiK00rXCIpKD86XCIrTCtcIiooWypeJHwhfl0/PSlcIitMK1wiKig/OicoKD86XFxcXFxcXFwufFteXFxcXFxcXFwnXSkqKSd8XFxcIigoPzpcXFxcXFxcXC58W15cXFxcXFxcXFxcXCJdKSopXFxcInwoXCIrTStcIikpfClcIitMK1wiKlxcXFxdXCIsTz1cIjooXCIrTStcIikoPzpcXFxcKCgoJygoPzpcXFxcXFxcXC58W15cXFxcXFxcXCddKSopJ3xcXFwiKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcXFxcIl0pKilcXFwiKXwoKD86XFxcXFxcXFwufFteXFxcXFxcXFwoKVtcXFxcXV18XCIrTitcIikqKXwuKilcXFxcKXwpXCIsUD1uZXcgUmVnRXhwKEwrXCIrXCIsXCJnXCIpLFE9bmV3IFJlZ0V4cChcIl5cIitMK1wiK3woKD86XnxbXlxcXFxcXFxcXSkoPzpcXFxcXFxcXC4pKilcIitMK1wiKyRcIixcImdcIiksUj1uZXcgUmVnRXhwKFwiXlwiK0wrXCIqLFwiK0wrXCIqXCIpLFM9bmV3IFJlZ0V4cChcIl5cIitMK1wiKihbPit+XXxcIitMK1wiKVwiK0wrXCIqXCIpLFQ9bmV3IFJlZ0V4cChcIj1cIitMK1wiKihbXlxcXFxdJ1xcXCJdKj8pXCIrTCtcIipcXFxcXVwiLFwiZ1wiKSxVPW5ldyBSZWdFeHAoTyksVj1uZXcgUmVnRXhwKFwiXlwiK00rXCIkXCIpLFc9e0lEOm5ldyBSZWdFeHAoXCJeIyhcIitNK1wiKVwiKSxDTEFTUzpuZXcgUmVnRXhwKFwiXlxcXFwuKFwiK00rXCIpXCIpLFRBRzpuZXcgUmVnRXhwKFwiXihcIitNK1wifFsqXSlcIiksQVRUUjpuZXcgUmVnRXhwKFwiXlwiK04pLFBTRVVETzpuZXcgUmVnRXhwKFwiXlwiK08pLENISUxEOm5ldyBSZWdFeHAoXCJeOihvbmx5fGZpcnN0fGxhc3R8bnRofG50aC1sYXN0KS0oY2hpbGR8b2YtdHlwZSkoPzpcXFxcKFwiK0wrXCIqKGV2ZW58b2RkfCgoWystXXwpKFxcXFxkKilufClcIitMK1wiKig/OihbKy1dfClcIitMK1wiKihcXFxcZCspfCkpXCIrTCtcIipcXFxcKXwpXCIsXCJpXCIpLGJvb2w6bmV3IFJlZ0V4cChcIl4oPzpcIitLK1wiKSRcIixcImlcIiksbmVlZHNDb250ZXh0Om5ldyBSZWdFeHAoXCJeXCIrTCtcIipbPit+XXw6KGV2ZW58b2RkfGVxfGd0fGx0fG50aHxmaXJzdHxsYXN0KSg/OlxcXFwoXCIrTCtcIiooKD86LVxcXFxkKT9cXFxcZCopXCIrTCtcIipcXFxcKXwpKD89W14tXXwkKVwiLFwiaVwiKX0sWD0vXig/OmlucHV0fHNlbGVjdHx0ZXh0YXJlYXxidXR0b24pJC9pLFk9L15oXFxkJC9pLFo9L15bXntdK1xce1xccypcXFtuYXRpdmUgXFx3LywkPS9eKD86IyhbXFx3LV0rKXwoXFx3Kyl8XFwuKFtcXHctXSspKSQvLF89L1srfl0vLGFhPS8nfFxcXFwvZyxiYT1uZXcgUmVnRXhwKFwiXFxcXFxcXFwoW1xcXFxkYS1mXXsxLDZ9XCIrTCtcIj98KFwiK0wrXCIpfC4pXCIsXCJpZ1wiKSxjYT1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9XCIweFwiK2ItNjU1MzY7cmV0dXJuIGQhPT1kfHxjP2I6MD5kP1N0cmluZy5mcm9tQ2hhckNvZGUoZCs2NTUzNik6U3RyaW5nLmZyb21DaGFyQ29kZShkPj4xMHw1NTI5NiwxMDIzJmR8NTYzMjApfSxkYT1mdW5jdGlvbigpe20oKX07dHJ5e0guYXBwbHkoRT1JLmNhbGwodi5jaGlsZE5vZGVzKSx2LmNoaWxkTm9kZXMpLEVbdi5jaGlsZE5vZGVzLmxlbmd0aF0ubm9kZVR5cGV9Y2F0Y2goZWEpe0g9e2FwcGx5OkUubGVuZ3RoP2Z1bmN0aW9uKGEsYil7Ry5hcHBseShhLEkuY2FsbChiKSl9OmZ1bmN0aW9uKGEsYil7dmFyIGM9YS5sZW5ndGgsZD0wO3doaWxlKGFbYysrXT1iW2QrK10pO2EubGVuZ3RoPWMtMX19fWZ1bmN0aW9uIGZhKGEsYixkLGUpe3ZhciBmLGgsaixrLGwsbyxyLHM9YiYmYi5vd25lckRvY3VtZW50LHc9Yj9iLm5vZGVUeXBlOjk7aWYoZD1kfHxbXSxcInN0cmluZ1wiIT10eXBlb2YgYXx8IWF8fDEhPT13JiY5IT09dyYmMTEhPT13KXJldHVybiBkO2lmKCFlJiYoKGI/Yi5vd25lckRvY3VtZW50fHxiOnYpIT09biYmbShiKSxiPWJ8fG4scCkpe2lmKDExIT09dyYmKGw9JC5leGVjKGEpKSlpZihmPWxbMV0pe2lmKDk9PT13KXtpZighKGo9Yi5nZXRFbGVtZW50QnlJZChmKSkpcmV0dXJuIGQ7aWYoai5pZD09PWYpcmV0dXJuIGQucHVzaChqKSxkfWVsc2UgaWYocyYmKGo9cy5nZXRFbGVtZW50QnlJZChmKSkmJnQoYixqKSYmai5pZD09PWYpcmV0dXJuIGQucHVzaChqKSxkfWVsc2V7aWYobFsyXSlyZXR1cm4gSC5hcHBseShkLGIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoYSkpLGQ7aWYoKGY9bFszXSkmJmMuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSYmYi5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKXJldHVybiBILmFwcGx5KGQsYi5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGYpKSxkfWlmKGMucXNhJiYhQVthK1wiIFwiXSYmKCFxfHwhcS50ZXN0KGEpKSl7aWYoMSE9PXcpcz1iLHI9YTtlbHNlIGlmKFwib2JqZWN0XCIhPT1iLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpeyhrPWIuZ2V0QXR0cmlidXRlKFwiaWRcIikpP2s9ay5yZXBsYWNlKGFhLFwiXFxcXCQmXCIpOmIuc2V0QXR0cmlidXRlKFwiaWRcIixrPXUpLG89ZyhhKSxoPW8ubGVuZ3RoO3doaWxlKGgtLSlvW2hdPVwiW2lkPSdcIitrK1wiJ10gXCIrcWEob1toXSk7cj1vLmpvaW4oXCIsXCIpLHM9Xy50ZXN0KGEpJiZvYShiLnBhcmVudE5vZGUpfHxifWlmKHIpdHJ5e3JldHVybiBILmFwcGx5KGQscy5xdWVyeVNlbGVjdG9yQWxsKHIpKSxkfWNhdGNoKHgpe31maW5hbGx5e2s9PT11JiZiLnJlbW92ZUF0dHJpYnV0ZShcImlkXCIpfX19cmV0dXJuIGkoYS5yZXBsYWNlKFEsXCIkMVwiKSxiLGQsZSl9ZnVuY3Rpb24gZ2EoKXt2YXIgYT1bXTtmdW5jdGlvbiBiKGMsZSl7cmV0dXJuIGEucHVzaChjK1wiIFwiKT5kLmNhY2hlTGVuZ3RoJiZkZWxldGUgYlthLnNoaWZ0KCldLGJbYytcIiBcIl09ZX1yZXR1cm4gYn1mdW5jdGlvbiBoYShhKXtyZXR1cm4gYVt1XT0hMCxhfWZ1bmN0aW9uIGlhKGEpe3ZhciBiPW4uY3JlYXRlRWxlbWVudChcImRpdlwiKTt0cnl7cmV0dXJuISFhKGIpfWNhdGNoKGMpe3JldHVybiExfWZpbmFsbHl7Yi5wYXJlbnROb2RlJiZiLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYiksYj1udWxsfX1mdW5jdGlvbiBqYShhLGIpe3ZhciBjPWEuc3BsaXQoXCJ8XCIpLGU9YS5sZW5ndGg7d2hpbGUoZS0tKWQuYXR0ckhhbmRsZVtjW2VdXT1ifWZ1bmN0aW9uIGthKGEsYil7dmFyIGM9YiYmYSxkPWMmJjE9PT1hLm5vZGVUeXBlJiYxPT09Yi5ub2RlVHlwZSYmKH5iLnNvdXJjZUluZGV4fHxDKS0ofmEuc291cmNlSW5kZXh8fEMpO2lmKGQpcmV0dXJuIGQ7aWYoYyl3aGlsZShjPWMubmV4dFNpYmxpbmcpaWYoYz09PWIpcmV0dXJuLTE7cmV0dXJuIGE/MTotMX1mdW5jdGlvbiBsYShhKXtyZXR1cm4gZnVuY3Rpb24oYil7dmFyIGM9Yi5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO3JldHVyblwiaW5wdXRcIj09PWMmJmIudHlwZT09PWF9fWZ1bmN0aW9uIG1hKGEpe3JldHVybiBmdW5jdGlvbihiKXt2YXIgYz1iLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7cmV0dXJuKFwiaW5wdXRcIj09PWN8fFwiYnV0dG9uXCI9PT1jKSYmYi50eXBlPT09YX19ZnVuY3Rpb24gbmEoYSl7cmV0dXJuIGhhKGZ1bmN0aW9uKGIpe3JldHVybiBiPStiLGhhKGZ1bmN0aW9uKGMsZCl7dmFyIGUsZj1hKFtdLGMubGVuZ3RoLGIpLGc9Zi5sZW5ndGg7d2hpbGUoZy0tKWNbZT1mW2ddXSYmKGNbZV09IShkW2VdPWNbZV0pKX0pfSl9ZnVuY3Rpb24gb2EoYSl7cmV0dXJuIGEmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBhLmdldEVsZW1lbnRzQnlUYWdOYW1lJiZhfWM9ZmEuc3VwcG9ydD17fSxmPWZhLmlzWE1MPWZ1bmN0aW9uKGEpe3ZhciBiPWEmJihhLm93bmVyRG9jdW1lbnR8fGEpLmRvY3VtZW50RWxlbWVudDtyZXR1cm4gYj9cIkhUTUxcIiE9PWIubm9kZU5hbWU6ITF9LG09ZmEuc2V0RG9jdW1lbnQ9ZnVuY3Rpb24oYSl7dmFyIGIsZSxnPWE/YS5vd25lckRvY3VtZW50fHxhOnY7cmV0dXJuIGchPT1uJiY5PT09Zy5ub2RlVHlwZSYmZy5kb2N1bWVudEVsZW1lbnQ/KG49ZyxvPW4uZG9jdW1lbnRFbGVtZW50LHA9IWYobiksbi5kb2N1bWVudE1vZGUmJihlPW4uZGVmYXVsdFZpZXcpJiZlLnRvcCE9PWUmJihlLmFkZEV2ZW50TGlzdGVuZXI/ZS5hZGRFdmVudExpc3RlbmVyKFwidW5sb2FkXCIsZGEsITEpOmUuYXR0YWNoRXZlbnQmJmUuYXR0YWNoRXZlbnQoXCJvbnVubG9hZFwiLGRhKSksYy5hdHRyaWJ1dGVzPWlhKGZ1bmN0aW9uKGEpe3JldHVybiBhLmNsYXNzTmFtZT1cImlcIiwhYS5nZXRBdHRyaWJ1dGUoXCJjbGFzc05hbWVcIil9KSxjLmdldEVsZW1lbnRzQnlUYWdOYW1lPWlhKGZ1bmN0aW9uKGEpe3JldHVybiBhLmFwcGVuZENoaWxkKG4uY3JlYXRlQ29tbWVudChcIlwiKSksIWEuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCIqXCIpLmxlbmd0aH0pLGMuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZT1aLnRlc3Qobi5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKSxjLmdldEJ5SWQ9aWEoZnVuY3Rpb24oYSl7cmV0dXJuIG8uYXBwZW5kQ2hpbGQoYSkuaWQ9dSwhbi5nZXRFbGVtZW50c0J5TmFtZXx8IW4uZ2V0RWxlbWVudHNCeU5hbWUodSkubGVuZ3RofSksYy5nZXRCeUlkPyhkLmZpbmQuSUQ9ZnVuY3Rpb24oYSxiKXtpZihcInVuZGVmaW5lZFwiIT10eXBlb2YgYi5nZXRFbGVtZW50QnlJZCYmcCl7dmFyIGM9Yi5nZXRFbGVtZW50QnlJZChhKTtyZXR1cm4gYz9bY106W119fSxkLmZpbHRlci5JRD1mdW5jdGlvbihhKXt2YXIgYj1hLnJlcGxhY2UoYmEsY2EpO3JldHVybiBmdW5jdGlvbihhKXtyZXR1cm4gYS5nZXRBdHRyaWJ1dGUoXCJpZFwiKT09PWJ9fSk6KGRlbGV0ZSBkLmZpbmQuSUQsZC5maWx0ZXIuSUQ9ZnVuY3Rpb24oYSl7dmFyIGI9YS5yZXBsYWNlKGJhLGNhKTtyZXR1cm4gZnVuY3Rpb24oYSl7dmFyIGM9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGEuZ2V0QXR0cmlidXRlTm9kZSYmYS5nZXRBdHRyaWJ1dGVOb2RlKFwiaWRcIik7cmV0dXJuIGMmJmMudmFsdWU9PT1ifX0pLGQuZmluZC5UQUc9Yy5nZXRFbGVtZW50c0J5VGFnTmFtZT9mdW5jdGlvbihhLGIpe3JldHVyblwidW5kZWZpbmVkXCIhPXR5cGVvZiBiLmdldEVsZW1lbnRzQnlUYWdOYW1lP2IuZ2V0RWxlbWVudHNCeVRhZ05hbWUoYSk6Yy5xc2E/Yi5xdWVyeVNlbGVjdG9yQWxsKGEpOnZvaWQgMH06ZnVuY3Rpb24oYSxiKXt2YXIgYyxkPVtdLGU9MCxmPWIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoYSk7aWYoXCIqXCI9PT1hKXt3aGlsZShjPWZbZSsrXSkxPT09Yy5ub2RlVHlwZSYmZC5wdXNoKGMpO3JldHVybiBkfXJldHVybiBmfSxkLmZpbmQuQ0xBU1M9Yy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lJiZmdW5jdGlvbihhLGIpe3JldHVyblwidW5kZWZpbmVkXCIhPXR5cGVvZiBiLmdldEVsZW1lbnRzQnlDbGFzc05hbWUmJnA/Yi5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGEpOnZvaWQgMH0scj1bXSxxPVtdLChjLnFzYT1aLnRlc3Qobi5xdWVyeVNlbGVjdG9yQWxsKSkmJihpYShmdW5jdGlvbihhKXtvLmFwcGVuZENoaWxkKGEpLmlubmVySFRNTD1cIjxhIGlkPSdcIit1K1wiJz48L2E+PHNlbGVjdCBpZD0nXCIrdStcIi1cXHJcXFxcJyBtc2FsbG93Y2FwdHVyZT0nJz48b3B0aW9uIHNlbGVjdGVkPScnPjwvb3B0aW9uPjwvc2VsZWN0PlwiLGEucXVlcnlTZWxlY3RvckFsbChcIlttc2FsbG93Y2FwdHVyZV49JyddXCIpLmxlbmd0aCYmcS5wdXNoKFwiWypeJF09XCIrTCtcIiooPzonJ3xcXFwiXFxcIilcIiksYS5xdWVyeVNlbGVjdG9yQWxsKFwiW3NlbGVjdGVkXVwiKS5sZW5ndGh8fHEucHVzaChcIlxcXFxbXCIrTCtcIiooPzp2YWx1ZXxcIitLK1wiKVwiKSxhLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbaWR+PVwiK3UrXCItXVwiKS5sZW5ndGh8fHEucHVzaChcIn49XCIpLGEucXVlcnlTZWxlY3RvckFsbChcIjpjaGVja2VkXCIpLmxlbmd0aHx8cS5wdXNoKFwiOmNoZWNrZWRcIiksYS5xdWVyeVNlbGVjdG9yQWxsKFwiYSNcIit1K1wiKypcIikubGVuZ3RofHxxLnB1c2goXCIuIy4rWyt+XVwiKX0pLGlhKGZ1bmN0aW9uKGEpe3ZhciBiPW4uY3JlYXRlRWxlbWVudChcImlucHV0XCIpO2Iuc2V0QXR0cmlidXRlKFwidHlwZVwiLFwiaGlkZGVuXCIpLGEuYXBwZW5kQ2hpbGQoYikuc2V0QXR0cmlidXRlKFwibmFtZVwiLFwiRFwiKSxhLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbbmFtZT1kXVwiKS5sZW5ndGgmJnEucHVzaChcIm5hbWVcIitMK1wiKlsqXiR8IX5dPz1cIiksYS5xdWVyeVNlbGVjdG9yQWxsKFwiOmVuYWJsZWRcIikubGVuZ3RofHxxLnB1c2goXCI6ZW5hYmxlZFwiLFwiOmRpc2FibGVkXCIpLGEucXVlcnlTZWxlY3RvckFsbChcIiosOnhcIikscS5wdXNoKFwiLC4qOlwiKX0pKSwoYy5tYXRjaGVzU2VsZWN0b3I9Wi50ZXN0KHM9by5tYXRjaGVzfHxvLndlYmtpdE1hdGNoZXNTZWxlY3Rvcnx8by5tb3pNYXRjaGVzU2VsZWN0b3J8fG8ub01hdGNoZXNTZWxlY3Rvcnx8by5tc01hdGNoZXNTZWxlY3RvcikpJiZpYShmdW5jdGlvbihhKXtjLmRpc2Nvbm5lY3RlZE1hdGNoPXMuY2FsbChhLFwiZGl2XCIpLHMuY2FsbChhLFwiW3MhPScnXTp4XCIpLHIucHVzaChcIiE9XCIsTyl9KSxxPXEubGVuZ3RoJiZuZXcgUmVnRXhwKHEuam9pbihcInxcIikpLHI9ci5sZW5ndGgmJm5ldyBSZWdFeHAoci5qb2luKFwifFwiKSksYj1aLnRlc3Qoby5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiksdD1ifHxaLnRlc3Qoby5jb250YWlucyk/ZnVuY3Rpb24oYSxiKXt2YXIgYz05PT09YS5ub2RlVHlwZT9hLmRvY3VtZW50RWxlbWVudDphLGQ9YiYmYi5wYXJlbnROb2RlO3JldHVybiBhPT09ZHx8ISghZHx8MSE9PWQubm9kZVR5cGV8fCEoYy5jb250YWlucz9jLmNvbnRhaW5zKGQpOmEuY29tcGFyZURvY3VtZW50UG9zaXRpb24mJjE2JmEuY29tcGFyZURvY3VtZW50UG9zaXRpb24oZCkpKX06ZnVuY3Rpb24oYSxiKXtpZihiKXdoaWxlKGI9Yi5wYXJlbnROb2RlKWlmKGI9PT1hKXJldHVybiEwO3JldHVybiExfSxCPWI/ZnVuY3Rpb24oYSxiKXtpZihhPT09YilyZXR1cm4gbD0hMCwwO3ZhciBkPSFhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uLSFiLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uO3JldHVybiBkP2Q6KGQ9KGEub3duZXJEb2N1bWVudHx8YSk9PT0oYi5vd25lckRvY3VtZW50fHxiKT9hLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGIpOjEsMSZkfHwhYy5zb3J0RGV0YWNoZWQmJmIuY29tcGFyZURvY3VtZW50UG9zaXRpb24oYSk9PT1kP2E9PT1ufHxhLm93bmVyRG9jdW1lbnQ9PT12JiZ0KHYsYSk/LTE6Yj09PW58fGIub3duZXJEb2N1bWVudD09PXYmJnQodixiKT8xOms/SihrLGEpLUooayxiKTowOjQmZD8tMToxKX06ZnVuY3Rpb24oYSxiKXtpZihhPT09YilyZXR1cm4gbD0hMCwwO3ZhciBjLGQ9MCxlPWEucGFyZW50Tm9kZSxmPWIucGFyZW50Tm9kZSxnPVthXSxoPVtiXTtpZighZXx8IWYpcmV0dXJuIGE9PT1uPy0xOmI9PT1uPzE6ZT8tMTpmPzE6az9KKGssYSktSihrLGIpOjA7aWYoZT09PWYpcmV0dXJuIGthKGEsYik7Yz1hO3doaWxlKGM9Yy5wYXJlbnROb2RlKWcudW5zaGlmdChjKTtjPWI7d2hpbGUoYz1jLnBhcmVudE5vZGUpaC51bnNoaWZ0KGMpO3doaWxlKGdbZF09PT1oW2RdKWQrKztyZXR1cm4gZD9rYShnW2RdLGhbZF0pOmdbZF09PT12Py0xOmhbZF09PT12PzE6MH0sbik6bn0sZmEubWF0Y2hlcz1mdW5jdGlvbihhLGIpe3JldHVybiBmYShhLG51bGwsbnVsbCxiKX0sZmEubWF0Y2hlc1NlbGVjdG9yPWZ1bmN0aW9uKGEsYil7aWYoKGEub3duZXJEb2N1bWVudHx8YSkhPT1uJiZtKGEpLGI9Yi5yZXBsYWNlKFQsXCI9JyQxJ11cIiksYy5tYXRjaGVzU2VsZWN0b3ImJnAmJiFBW2IrXCIgXCJdJiYoIXJ8fCFyLnRlc3QoYikpJiYoIXF8fCFxLnRlc3QoYikpKXRyeXt2YXIgZD1zLmNhbGwoYSxiKTtpZihkfHxjLmRpc2Nvbm5lY3RlZE1hdGNofHxhLmRvY3VtZW50JiYxMSE9PWEuZG9jdW1lbnQubm9kZVR5cGUpcmV0dXJuIGR9Y2F0Y2goZSl7fXJldHVybiBmYShiLG4sbnVsbCxbYV0pLmxlbmd0aD4wfSxmYS5jb250YWlucz1mdW5jdGlvbihhLGIpe3JldHVybihhLm93bmVyRG9jdW1lbnR8fGEpIT09biYmbShhKSx0KGEsYil9LGZhLmF0dHI9ZnVuY3Rpb24oYSxiKXsoYS5vd25lckRvY3VtZW50fHxhKSE9PW4mJm0oYSk7dmFyIGU9ZC5hdHRySGFuZGxlW2IudG9Mb3dlckNhc2UoKV0sZj1lJiZELmNhbGwoZC5hdHRySGFuZGxlLGIudG9Mb3dlckNhc2UoKSk/ZShhLGIsIXApOnZvaWQgMDtyZXR1cm4gdm9pZCAwIT09Zj9mOmMuYXR0cmlidXRlc3x8IXA/YS5nZXRBdHRyaWJ1dGUoYik6KGY9YS5nZXRBdHRyaWJ1dGVOb2RlKGIpKSYmZi5zcGVjaWZpZWQ/Zi52YWx1ZTpudWxsfSxmYS5lcnJvcj1mdW5jdGlvbihhKXt0aHJvdyBuZXcgRXJyb3IoXCJTeW50YXggZXJyb3IsIHVucmVjb2duaXplZCBleHByZXNzaW9uOiBcIithKX0sZmEudW5pcXVlU29ydD1mdW5jdGlvbihhKXt2YXIgYixkPVtdLGU9MCxmPTA7aWYobD0hYy5kZXRlY3REdXBsaWNhdGVzLGs9IWMuc29ydFN0YWJsZSYmYS5zbGljZSgwKSxhLnNvcnQoQiksbCl7d2hpbGUoYj1hW2YrK10pYj09PWFbZl0mJihlPWQucHVzaChmKSk7d2hpbGUoZS0tKWEuc3BsaWNlKGRbZV0sMSl9cmV0dXJuIGs9bnVsbCxhfSxlPWZhLmdldFRleHQ9ZnVuY3Rpb24oYSl7dmFyIGIsYz1cIlwiLGQ9MCxmPWEubm9kZVR5cGU7aWYoZil7aWYoMT09PWZ8fDk9PT1mfHwxMT09PWYpe2lmKFwic3RyaW5nXCI9PXR5cGVvZiBhLnRleHRDb250ZW50KXJldHVybiBhLnRleHRDb250ZW50O2ZvcihhPWEuZmlyc3RDaGlsZDthO2E9YS5uZXh0U2libGluZyljKz1lKGEpfWVsc2UgaWYoMz09PWZ8fDQ9PT1mKXJldHVybiBhLm5vZGVWYWx1ZX1lbHNlIHdoaWxlKGI9YVtkKytdKWMrPWUoYik7cmV0dXJuIGN9LGQ9ZmEuc2VsZWN0b3JzPXtjYWNoZUxlbmd0aDo1MCxjcmVhdGVQc2V1ZG86aGEsbWF0Y2g6VyxhdHRySGFuZGxlOnt9LGZpbmQ6e30scmVsYXRpdmU6e1wiPlwiOntkaXI6XCJwYXJlbnROb2RlXCIsZmlyc3Q6ITB9LFwiIFwiOntkaXI6XCJwYXJlbnROb2RlXCJ9LFwiK1wiOntkaXI6XCJwcmV2aW91c1NpYmxpbmdcIixmaXJzdDohMH0sXCJ+XCI6e2RpcjpcInByZXZpb3VzU2libGluZ1wifX0scHJlRmlsdGVyOntBVFRSOmZ1bmN0aW9uKGEpe3JldHVybiBhWzFdPWFbMV0ucmVwbGFjZShiYSxjYSksYVszXT0oYVszXXx8YVs0XXx8YVs1XXx8XCJcIikucmVwbGFjZShiYSxjYSksXCJ+PVwiPT09YVsyXSYmKGFbM109XCIgXCIrYVszXStcIiBcIiksYS5zbGljZSgwLDQpfSxDSElMRDpmdW5jdGlvbihhKXtyZXR1cm4gYVsxXT1hWzFdLnRvTG93ZXJDYXNlKCksXCJudGhcIj09PWFbMV0uc2xpY2UoMCwzKT8oYVszXXx8ZmEuZXJyb3IoYVswXSksYVs0XT0rKGFbNF0/YVs1XSsoYVs2XXx8MSk6MiooXCJldmVuXCI9PT1hWzNdfHxcIm9kZFwiPT09YVszXSkpLGFbNV09KyhhWzddK2FbOF18fFwib2RkXCI9PT1hWzNdKSk6YVszXSYmZmEuZXJyb3IoYVswXSksYX0sUFNFVURPOmZ1bmN0aW9uKGEpe3ZhciBiLGM9IWFbNl0mJmFbMl07cmV0dXJuIFcuQ0hJTEQudGVzdChhWzBdKT9udWxsOihhWzNdP2FbMl09YVs0XXx8YVs1XXx8XCJcIjpjJiZVLnRlc3QoYykmJihiPWcoYywhMCkpJiYoYj1jLmluZGV4T2YoXCIpXCIsYy5sZW5ndGgtYiktYy5sZW5ndGgpJiYoYVswXT1hWzBdLnNsaWNlKDAsYiksYVsyXT1jLnNsaWNlKDAsYikpLGEuc2xpY2UoMCwzKSl9fSxmaWx0ZXI6e1RBRzpmdW5jdGlvbihhKXt2YXIgYj1hLnJlcGxhY2UoYmEsY2EpLnRvTG93ZXJDYXNlKCk7cmV0dXJuXCIqXCI9PT1hP2Z1bmN0aW9uKCl7cmV0dXJuITB9OmZ1bmN0aW9uKGEpe3JldHVybiBhLm5vZGVOYW1lJiZhLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk9PT1ifX0sQ0xBU1M6ZnVuY3Rpb24oYSl7dmFyIGI9eVthK1wiIFwiXTtyZXR1cm4gYnx8KGI9bmV3IFJlZ0V4cChcIihefFwiK0wrXCIpXCIrYStcIihcIitMK1wifCQpXCIpKSYmeShhLGZ1bmN0aW9uKGEpe3JldHVybiBiLnRlc3QoXCJzdHJpbmdcIj09dHlwZW9mIGEuY2xhc3NOYW1lJiZhLmNsYXNzTmFtZXx8XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGEuZ2V0QXR0cmlidXRlJiZhLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpfHxcIlwiKX0pfSxBVFRSOmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gZnVuY3Rpb24oZCl7dmFyIGU9ZmEuYXR0cihkLGEpO3JldHVybiBudWxsPT1lP1wiIT1cIj09PWI6Yj8oZSs9XCJcIixcIj1cIj09PWI/ZT09PWM6XCIhPVwiPT09Yj9lIT09YzpcIl49XCI9PT1iP2MmJjA9PT1lLmluZGV4T2YoYyk6XCIqPVwiPT09Yj9jJiZlLmluZGV4T2YoYyk+LTE6XCIkPVwiPT09Yj9jJiZlLnNsaWNlKC1jLmxlbmd0aCk9PT1jOlwifj1cIj09PWI/KFwiIFwiK2UucmVwbGFjZShQLFwiIFwiKStcIiBcIikuaW5kZXhPZihjKT4tMTpcInw9XCI9PT1iP2U9PT1jfHxlLnNsaWNlKDAsYy5sZW5ndGgrMSk9PT1jK1wiLVwiOiExKTohMH19LENISUxEOmZ1bmN0aW9uKGEsYixjLGQsZSl7dmFyIGY9XCJudGhcIiE9PWEuc2xpY2UoMCwzKSxnPVwibGFzdFwiIT09YS5zbGljZSgtNCksaD1cIm9mLXR5cGVcIj09PWI7cmV0dXJuIDE9PT1kJiYwPT09ZT9mdW5jdGlvbihhKXtyZXR1cm4hIWEucGFyZW50Tm9kZX06ZnVuY3Rpb24oYixjLGkpe3ZhciBqLGssbCxtLG4sbyxwPWYhPT1nP1wibmV4dFNpYmxpbmdcIjpcInByZXZpb3VzU2libGluZ1wiLHE9Yi5wYXJlbnROb2RlLHI9aCYmYi5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLHM9IWkmJiFoLHQ9ITE7aWYocSl7aWYoZil7d2hpbGUocCl7bT1iO3doaWxlKG09bVtwXSlpZihoP20ubm9kZU5hbWUudG9Mb3dlckNhc2UoKT09PXI6MT09PW0ubm9kZVR5cGUpcmV0dXJuITE7bz1wPVwib25seVwiPT09YSYmIW8mJlwibmV4dFNpYmxpbmdcIn1yZXR1cm4hMH1pZihvPVtnP3EuZmlyc3RDaGlsZDpxLmxhc3RDaGlsZF0sZyYmcyl7bT1xLGw9bVt1XXx8KG1bdV09e30pLGs9bFttLnVuaXF1ZUlEXXx8KGxbbS51bmlxdWVJRF09e30pLGo9a1thXXx8W10sbj1qWzBdPT09dyYmalsxXSx0PW4mJmpbMl0sbT1uJiZxLmNoaWxkTm9kZXNbbl07d2hpbGUobT0rK24mJm0mJm1bcF18fCh0PW49MCl8fG8ucG9wKCkpaWYoMT09PW0ubm9kZVR5cGUmJisrdCYmbT09PWIpe2tbYV09W3csbix0XTticmVha319ZWxzZSBpZihzJiYobT1iLGw9bVt1XXx8KG1bdV09e30pLGs9bFttLnVuaXF1ZUlEXXx8KGxbbS51bmlxdWVJRF09e30pLGo9a1thXXx8W10sbj1qWzBdPT09dyYmalsxXSx0PW4pLHQ9PT0hMSl3aGlsZShtPSsrbiYmbSYmbVtwXXx8KHQ9bj0wKXx8by5wb3AoKSlpZigoaD9tLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk9PT1yOjE9PT1tLm5vZGVUeXBlKSYmKyt0JiYocyYmKGw9bVt1XXx8KG1bdV09e30pLGs9bFttLnVuaXF1ZUlEXXx8KGxbbS51bmlxdWVJRF09e30pLGtbYV09W3csdF0pLG09PT1iKSlicmVhaztyZXR1cm4gdC09ZSx0PT09ZHx8dCVkPT09MCYmdC9kPj0wfX19LFBTRVVETzpmdW5jdGlvbihhLGIpe3ZhciBjLGU9ZC5wc2V1ZG9zW2FdfHxkLnNldEZpbHRlcnNbYS50b0xvd2VyQ2FzZSgpXXx8ZmEuZXJyb3IoXCJ1bnN1cHBvcnRlZCBwc2V1ZG86IFwiK2EpO3JldHVybiBlW3VdP2UoYik6ZS5sZW5ndGg+MT8oYz1bYSxhLFwiXCIsYl0sZC5zZXRGaWx0ZXJzLmhhc093blByb3BlcnR5KGEudG9Mb3dlckNhc2UoKSk/aGEoZnVuY3Rpb24oYSxjKXt2YXIgZCxmPWUoYSxiKSxnPWYubGVuZ3RoO3doaWxlKGctLSlkPUooYSxmW2ddKSxhW2RdPSEoY1tkXT1mW2ddKX0pOmZ1bmN0aW9uKGEpe3JldHVybiBlKGEsMCxjKX0pOmV9fSxwc2V1ZG9zOntub3Q6aGEoZnVuY3Rpb24oYSl7dmFyIGI9W10sYz1bXSxkPWgoYS5yZXBsYWNlKFEsXCIkMVwiKSk7cmV0dXJuIGRbdV0/aGEoZnVuY3Rpb24oYSxiLGMsZSl7dmFyIGYsZz1kKGEsbnVsbCxlLFtdKSxoPWEubGVuZ3RoO3doaWxlKGgtLSkoZj1nW2hdKSYmKGFbaF09IShiW2hdPWYpKX0pOmZ1bmN0aW9uKGEsZSxmKXtyZXR1cm4gYlswXT1hLGQoYixudWxsLGYsYyksYlswXT1udWxsLCFjLnBvcCgpfX0pLGhhczpoYShmdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oYil7cmV0dXJuIGZhKGEsYikubGVuZ3RoPjB9fSksY29udGFpbnM6aGEoZnVuY3Rpb24oYSl7cmV0dXJuIGE9YS5yZXBsYWNlKGJhLGNhKSxmdW5jdGlvbihiKXtyZXR1cm4oYi50ZXh0Q29udGVudHx8Yi5pbm5lclRleHR8fGUoYikpLmluZGV4T2YoYSk+LTF9fSksbGFuZzpoYShmdW5jdGlvbihhKXtyZXR1cm4gVi50ZXN0KGF8fFwiXCIpfHxmYS5lcnJvcihcInVuc3VwcG9ydGVkIGxhbmc6IFwiK2EpLGE9YS5yZXBsYWNlKGJhLGNhKS50b0xvd2VyQ2FzZSgpLGZ1bmN0aW9uKGIpe3ZhciBjO2RvIGlmKGM9cD9iLmxhbmc6Yi5nZXRBdHRyaWJ1dGUoXCJ4bWw6bGFuZ1wiKXx8Yi5nZXRBdHRyaWJ1dGUoXCJsYW5nXCIpKXJldHVybiBjPWMudG9Mb3dlckNhc2UoKSxjPT09YXx8MD09PWMuaW5kZXhPZihhK1wiLVwiKTt3aGlsZSgoYj1iLnBhcmVudE5vZGUpJiYxPT09Yi5ub2RlVHlwZSk7cmV0dXJuITF9fSksdGFyZ2V0OmZ1bmN0aW9uKGIpe3ZhciBjPWEubG9jYXRpb24mJmEubG9jYXRpb24uaGFzaDtyZXR1cm4gYyYmYy5zbGljZSgxKT09PWIuaWR9LHJvb3Q6ZnVuY3Rpb24oYSl7cmV0dXJuIGE9PT1vfSxmb2N1czpmdW5jdGlvbihhKXtyZXR1cm4gYT09PW4uYWN0aXZlRWxlbWVudCYmKCFuLmhhc0ZvY3VzfHxuLmhhc0ZvY3VzKCkpJiYhIShhLnR5cGV8fGEuaHJlZnx8fmEudGFiSW5kZXgpfSxlbmFibGVkOmZ1bmN0aW9uKGEpe3JldHVybiBhLmRpc2FibGVkPT09ITF9LGRpc2FibGVkOmZ1bmN0aW9uKGEpe3JldHVybiBhLmRpc2FibGVkPT09ITB9LGNoZWNrZWQ6ZnVuY3Rpb24oYSl7dmFyIGI9YS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO3JldHVyblwiaW5wdXRcIj09PWImJiEhYS5jaGVja2VkfHxcIm9wdGlvblwiPT09YiYmISFhLnNlbGVjdGVkfSxzZWxlY3RlZDpmdW5jdGlvbihhKXtyZXR1cm4gYS5wYXJlbnROb2RlJiZhLnBhcmVudE5vZGUuc2VsZWN0ZWRJbmRleCxhLnNlbGVjdGVkPT09ITB9LGVtcHR5OmZ1bmN0aW9uKGEpe2ZvcihhPWEuZmlyc3RDaGlsZDthO2E9YS5uZXh0U2libGluZylpZihhLm5vZGVUeXBlPDYpcmV0dXJuITE7cmV0dXJuITB9LHBhcmVudDpmdW5jdGlvbihhKXtyZXR1cm4hZC5wc2V1ZG9zLmVtcHR5KGEpfSxoZWFkZXI6ZnVuY3Rpb24oYSl7cmV0dXJuIFkudGVzdChhLm5vZGVOYW1lKX0saW5wdXQ6ZnVuY3Rpb24oYSl7cmV0dXJuIFgudGVzdChhLm5vZGVOYW1lKX0sYnV0dG9uOmZ1bmN0aW9uKGEpe3ZhciBiPWEubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtyZXR1cm5cImlucHV0XCI9PT1iJiZcImJ1dHRvblwiPT09YS50eXBlfHxcImJ1dHRvblwiPT09Yn0sdGV4dDpmdW5jdGlvbihhKXt2YXIgYjtyZXR1cm5cImlucHV0XCI9PT1hLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkmJlwidGV4dFwiPT09YS50eXBlJiYobnVsbD09KGI9YS5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpKXx8XCJ0ZXh0XCI9PT1iLnRvTG93ZXJDYXNlKCkpfSxmaXJzdDpuYShmdW5jdGlvbigpe3JldHVyblswXX0pLGxhc3Q6bmEoZnVuY3Rpb24oYSxiKXtyZXR1cm5bYi0xXX0pLGVxOm5hKGZ1bmN0aW9uKGEsYixjKXtyZXR1cm5bMD5jP2MrYjpjXX0pLGV2ZW46bmEoZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9MDtiPmM7Yys9MilhLnB1c2goYyk7cmV0dXJuIGF9KSxvZGQ6bmEoZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9MTtiPmM7Yys9MilhLnB1c2goYyk7cmV0dXJuIGF9KSxsdDpuYShmdW5jdGlvbihhLGIsYyl7Zm9yKHZhciBkPTA+Yz9jK2I6YzstLWQ+PTA7KWEucHVzaChkKTtyZXR1cm4gYX0pLGd0Om5hKGZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGQ9MD5jP2MrYjpjOysrZDxiOylhLnB1c2goZCk7cmV0dXJuIGF9KX19LGQucHNldWRvcy5udGg9ZC5wc2V1ZG9zLmVxO2ZvcihiIGlue3JhZGlvOiEwLGNoZWNrYm94OiEwLGZpbGU6ITAscGFzc3dvcmQ6ITAsaW1hZ2U6ITB9KWQucHNldWRvc1tiXT1sYShiKTtmb3IoYiBpbntzdWJtaXQ6ITAscmVzZXQ6ITB9KWQucHNldWRvc1tiXT1tYShiKTtmdW5jdGlvbiBwYSgpe31wYS5wcm90b3R5cGU9ZC5maWx0ZXJzPWQucHNldWRvcyxkLnNldEZpbHRlcnM9bmV3IHBhLGc9ZmEudG9rZW5pemU9ZnVuY3Rpb24oYSxiKXt2YXIgYyxlLGYsZyxoLGksaixrPXpbYStcIiBcIl07aWYoaylyZXR1cm4gYj8wOmsuc2xpY2UoMCk7aD1hLGk9W10saj1kLnByZUZpbHRlcjt3aGlsZShoKXsoIWN8fChlPVIuZXhlYyhoKSkpJiYoZSYmKGg9aC5zbGljZShlWzBdLmxlbmd0aCl8fGgpLGkucHVzaChmPVtdKSksYz0hMSwoZT1TLmV4ZWMoaCkpJiYoYz1lLnNoaWZ0KCksZi5wdXNoKHt2YWx1ZTpjLHR5cGU6ZVswXS5yZXBsYWNlKFEsXCIgXCIpfSksaD1oLnNsaWNlKGMubGVuZ3RoKSk7Zm9yKGcgaW4gZC5maWx0ZXIpIShlPVdbZ10uZXhlYyhoKSl8fGpbZ10mJiEoZT1qW2ddKGUpKXx8KGM9ZS5zaGlmdCgpLGYucHVzaCh7dmFsdWU6Yyx0eXBlOmcsbWF0Y2hlczplfSksaD1oLnNsaWNlKGMubGVuZ3RoKSk7aWYoIWMpYnJlYWt9cmV0dXJuIGI/aC5sZW5ndGg6aD9mYS5lcnJvcihhKTp6KGEsaSkuc2xpY2UoMCl9O2Z1bmN0aW9uIHFhKGEpe2Zvcih2YXIgYj0wLGM9YS5sZW5ndGgsZD1cIlwiO2M+YjtiKyspZCs9YVtiXS52YWx1ZTtyZXR1cm4gZH1mdW5jdGlvbiByYShhLGIsYyl7dmFyIGQ9Yi5kaXIsZT1jJiZcInBhcmVudE5vZGVcIj09PWQsZj14Kys7cmV0dXJuIGIuZmlyc3Q/ZnVuY3Rpb24oYixjLGYpe3doaWxlKGI9YltkXSlpZigxPT09Yi5ub2RlVHlwZXx8ZSlyZXR1cm4gYShiLGMsZil9OmZ1bmN0aW9uKGIsYyxnKXt2YXIgaCxpLGosaz1bdyxmXTtpZihnKXt3aGlsZShiPWJbZF0paWYoKDE9PT1iLm5vZGVUeXBlfHxlKSYmYShiLGMsZykpcmV0dXJuITB9ZWxzZSB3aGlsZShiPWJbZF0paWYoMT09PWIubm9kZVR5cGV8fGUpe2lmKGo9Ylt1XXx8KGJbdV09e30pLGk9altiLnVuaXF1ZUlEXXx8KGpbYi51bmlxdWVJRF09e30pLChoPWlbZF0pJiZoWzBdPT09dyYmaFsxXT09PWYpcmV0dXJuIGtbMl09aFsyXTtpZihpW2RdPWssa1syXT1hKGIsYyxnKSlyZXR1cm4hMH19fWZ1bmN0aW9uIHNhKGEpe3JldHVybiBhLmxlbmd0aD4xP2Z1bmN0aW9uKGIsYyxkKXt2YXIgZT1hLmxlbmd0aDt3aGlsZShlLS0paWYoIWFbZV0oYixjLGQpKXJldHVybiExO3JldHVybiEwfTphWzBdfWZ1bmN0aW9uIHRhKGEsYixjKXtmb3IodmFyIGQ9MCxlPWIubGVuZ3RoO2U+ZDtkKyspZmEoYSxiW2RdLGMpO3JldHVybiBjfWZ1bmN0aW9uIHVhKGEsYixjLGQsZSl7Zm9yKHZhciBmLGc9W10saD0wLGk9YS5sZW5ndGgsaj1udWxsIT1iO2k+aDtoKyspKGY9YVtoXSkmJighY3x8YyhmLGQsZSkpJiYoZy5wdXNoKGYpLGomJmIucHVzaChoKSk7cmV0dXJuIGd9ZnVuY3Rpb24gdmEoYSxiLGMsZCxlLGYpe3JldHVybiBkJiYhZFt1XSYmKGQ9dmEoZCkpLGUmJiFlW3VdJiYoZT12YShlLGYpKSxoYShmdW5jdGlvbihmLGcsaCxpKXt2YXIgaixrLGwsbT1bXSxuPVtdLG89Zy5sZW5ndGgscD1mfHx0YShifHxcIipcIixoLm5vZGVUeXBlP1toXTpoLFtdKSxxPSFhfHwhZiYmYj9wOnVhKHAsbSxhLGgsaSkscj1jP2V8fChmP2E6b3x8ZCk/W106ZzpxO2lmKGMmJmMocSxyLGgsaSksZCl7aj11YShyLG4pLGQoaixbXSxoLGkpLGs9ai5sZW5ndGg7d2hpbGUoay0tKShsPWpba10pJiYocltuW2tdXT0hKHFbbltrXV09bCkpfWlmKGYpe2lmKGV8fGEpe2lmKGUpe2o9W10saz1yLmxlbmd0aDt3aGlsZShrLS0pKGw9cltrXSkmJmoucHVzaChxW2tdPWwpO2UobnVsbCxyPVtdLGosaSl9az1yLmxlbmd0aDt3aGlsZShrLS0pKGw9cltrXSkmJihqPWU/SihmLGwpOm1ba10pPi0xJiYoZltqXT0hKGdbal09bCkpfX1lbHNlIHI9dWEocj09PWc/ci5zcGxpY2UobyxyLmxlbmd0aCk6ciksZT9lKG51bGwsZyxyLGkpOkguYXBwbHkoZyxyKX0pfWZ1bmN0aW9uIHdhKGEpe2Zvcih2YXIgYixjLGUsZj1hLmxlbmd0aCxnPWQucmVsYXRpdmVbYVswXS50eXBlXSxoPWd8fGQucmVsYXRpdmVbXCIgXCJdLGk9Zz8xOjAsaz1yYShmdW5jdGlvbihhKXtyZXR1cm4gYT09PWJ9LGgsITApLGw9cmEoZnVuY3Rpb24oYSl7cmV0dXJuIEooYixhKT4tMX0saCwhMCksbT1bZnVuY3Rpb24oYSxjLGQpe3ZhciBlPSFnJiYoZHx8YyE9PWopfHwoKGI9Yykubm9kZVR5cGU/ayhhLGMsZCk6bChhLGMsZCkpO3JldHVybiBiPW51bGwsZX1dO2Y+aTtpKyspaWYoYz1kLnJlbGF0aXZlW2FbaV0udHlwZV0pbT1bcmEoc2EobSksYyldO2Vsc2V7aWYoYz1kLmZpbHRlclthW2ldLnR5cGVdLmFwcGx5KG51bGwsYVtpXS5tYXRjaGVzKSxjW3VdKXtmb3IoZT0rK2k7Zj5lO2UrKylpZihkLnJlbGF0aXZlW2FbZV0udHlwZV0pYnJlYWs7cmV0dXJuIHZhKGk+MSYmc2EobSksaT4xJiZxYShhLnNsaWNlKDAsaS0xKS5jb25jYXQoe3ZhbHVlOlwiIFwiPT09YVtpLTJdLnR5cGU/XCIqXCI6XCJcIn0pKS5yZXBsYWNlKFEsXCIkMVwiKSxjLGU+aSYmd2EoYS5zbGljZShpLGUpKSxmPmUmJndhKGE9YS5zbGljZShlKSksZj5lJiZxYShhKSl9bS5wdXNoKGMpfXJldHVybiBzYShtKX1mdW5jdGlvbiB4YShhLGIpe3ZhciBjPWIubGVuZ3RoPjAsZT1hLmxlbmd0aD4wLGY9ZnVuY3Rpb24oZixnLGgsaSxrKXt2YXIgbCxvLHEscj0wLHM9XCIwXCIsdD1mJiZbXSx1PVtdLHY9aix4PWZ8fGUmJmQuZmluZC5UQUcoXCIqXCIsaykseT13Kz1udWxsPT12PzE6TWF0aC5yYW5kb20oKXx8LjEsej14Lmxlbmd0aDtmb3IoayYmKGo9Zz09PW58fGd8fGspO3MhPT16JiZudWxsIT0obD14W3NdKTtzKyspe2lmKGUmJmwpe289MCxnfHxsLm93bmVyRG9jdW1lbnQ9PT1ufHwobShsKSxoPSFwKTt3aGlsZShxPWFbbysrXSlpZihxKGwsZ3x8bixoKSl7aS5wdXNoKGwpO2JyZWFrfWsmJih3PXkpfWMmJigobD0hcSYmbCkmJnItLSxmJiZ0LnB1c2gobCkpfWlmKHIrPXMsYyYmcyE9PXIpe289MDt3aGlsZShxPWJbbysrXSlxKHQsdSxnLGgpO2lmKGYpe2lmKHI+MCl3aGlsZShzLS0pdFtzXXx8dVtzXXx8KHVbc109Ri5jYWxsKGkpKTt1PXVhKHUpfUguYXBwbHkoaSx1KSxrJiYhZiYmdS5sZW5ndGg+MCYmcitiLmxlbmd0aD4xJiZmYS51bmlxdWVTb3J0KGkpfXJldHVybiBrJiYodz15LGo9diksdH07cmV0dXJuIGM/aGEoZik6Zn1yZXR1cm4gaD1mYS5jb21waWxlPWZ1bmN0aW9uKGEsYil7dmFyIGMsZD1bXSxlPVtdLGY9QVthK1wiIFwiXTtpZighZil7Ynx8KGI9ZyhhKSksYz1iLmxlbmd0aDt3aGlsZShjLS0pZj13YShiW2NdKSxmW3VdP2QucHVzaChmKTplLnB1c2goZik7Zj1BKGEseGEoZSxkKSksZi5zZWxlY3Rvcj1hfXJldHVybiBmfSxpPWZhLnNlbGVjdD1mdW5jdGlvbihhLGIsZSxmKXt2YXIgaSxqLGssbCxtLG49XCJmdW5jdGlvblwiPT10eXBlb2YgYSYmYSxvPSFmJiZnKGE9bi5zZWxlY3Rvcnx8YSk7aWYoZT1lfHxbXSwxPT09by5sZW5ndGgpe2lmKGo9b1swXT1vWzBdLnNsaWNlKDApLGoubGVuZ3RoPjImJlwiSURcIj09PShrPWpbMF0pLnR5cGUmJmMuZ2V0QnlJZCYmOT09PWIubm9kZVR5cGUmJnAmJmQucmVsYXRpdmVbalsxXS50eXBlXSl7aWYoYj0oZC5maW5kLklEKGsubWF0Y2hlc1swXS5yZXBsYWNlKGJhLGNhKSxiKXx8W10pWzBdLCFiKXJldHVybiBlO24mJihiPWIucGFyZW50Tm9kZSksYT1hLnNsaWNlKGouc2hpZnQoKS52YWx1ZS5sZW5ndGgpfWk9Vy5uZWVkc0NvbnRleHQudGVzdChhKT8wOmoubGVuZ3RoO3doaWxlKGktLSl7aWYoaz1qW2ldLGQucmVsYXRpdmVbbD1rLnR5cGVdKWJyZWFrO2lmKChtPWQuZmluZFtsXSkmJihmPW0oay5tYXRjaGVzWzBdLnJlcGxhY2UoYmEsY2EpLF8udGVzdChqWzBdLnR5cGUpJiZvYShiLnBhcmVudE5vZGUpfHxiKSkpe2lmKGouc3BsaWNlKGksMSksYT1mLmxlbmd0aCYmcWEoaiksIWEpcmV0dXJuIEguYXBwbHkoZSxmKSxlO2JyZWFrfX19cmV0dXJuKG58fGgoYSxvKSkoZixiLCFwLGUsIWJ8fF8udGVzdChhKSYmb2EoYi5wYXJlbnROb2RlKXx8YiksZX0sYy5zb3J0U3RhYmxlPXUuc3BsaXQoXCJcIikuc29ydChCKS5qb2luKFwiXCIpPT09dSxjLmRldGVjdER1cGxpY2F0ZXM9ISFsLG0oKSxjLnNvcnREZXRhY2hlZD1pYShmdW5jdGlvbihhKXtyZXR1cm4gMSZhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKG4uY3JlYXRlRWxlbWVudChcImRpdlwiKSl9KSxpYShmdW5jdGlvbihhKXtyZXR1cm4gYS5pbm5lckhUTUw9XCI8YSBocmVmPScjJz48L2E+XCIsXCIjXCI9PT1hLmZpcnN0Q2hpbGQuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKX0pfHxqYShcInR5cGV8aHJlZnxoZWlnaHR8d2lkdGhcIixmdW5jdGlvbihhLGIsYyl7cmV0dXJuIGM/dm9pZCAwOmEuZ2V0QXR0cmlidXRlKGIsXCJ0eXBlXCI9PT1iLnRvTG93ZXJDYXNlKCk/MToyKX0pLGMuYXR0cmlidXRlcyYmaWEoZnVuY3Rpb24oYSl7cmV0dXJuIGEuaW5uZXJIVE1MPVwiPGlucHV0Lz5cIixhLmZpcnN0Q2hpbGQuc2V0QXR0cmlidXRlKFwidmFsdWVcIixcIlwiKSxcIlwiPT09YS5maXJzdENoaWxkLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpfSl8fGphKFwidmFsdWVcIixmdW5jdGlvbihhLGIsYyl7cmV0dXJuIGN8fFwiaW5wdXRcIiE9PWEubm9kZU5hbWUudG9Mb3dlckNhc2UoKT92b2lkIDA6YS5kZWZhdWx0VmFsdWV9KSxpYShmdW5jdGlvbihhKXtyZXR1cm4gbnVsbD09YS5nZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKX0pfHxqYShLLGZ1bmN0aW9uKGEsYixjKXt2YXIgZDtyZXR1cm4gYz92b2lkIDA6YVtiXT09PSEwP2IudG9Mb3dlckNhc2UoKTooZD1hLmdldEF0dHJpYnV0ZU5vZGUoYikpJiZkLnNwZWNpZmllZD9kLnZhbHVlOm51bGx9KSxmYX0oYSk7bi5maW5kPXQsbi5leHByPXQuc2VsZWN0b3JzLG4uZXhwcltcIjpcIl09bi5leHByLnBzZXVkb3Msbi51bmlxdWVTb3J0PW4udW5pcXVlPXQudW5pcXVlU29ydCxuLnRleHQ9dC5nZXRUZXh0LG4uaXNYTUxEb2M9dC5pc1hNTCxuLmNvbnRhaW5zPXQuY29udGFpbnM7dmFyIHU9bi5leHByLm1hdGNoLm5lZWRzQ29udGV4dCx2PS9ePChbXFx3LV0rKVxccypcXC8/Pig/OjxcXC9cXDE+fCkkLyx3PS9eLlteOiNcXFtcXC4sXSokLztmdW5jdGlvbiB4KGEsYixjKXtpZihuLmlzRnVuY3Rpb24oYikpcmV0dXJuIG4uZ3JlcChhLGZ1bmN0aW9uKGEsZCl7cmV0dXJuISFiLmNhbGwoYSxkLGEpIT09Y30pO2lmKGIubm9kZVR5cGUpcmV0dXJuIG4uZ3JlcChhLGZ1bmN0aW9uKGEpe3JldHVybiBhPT09YiE9PWN9KTtpZihcInN0cmluZ1wiPT10eXBlb2YgYil7aWYody50ZXN0KGIpKXJldHVybiBuLmZpbHRlcihiLGEsYyk7Yj1uLmZpbHRlcihiLGEpfXJldHVybiBuLmdyZXAoYSxmdW5jdGlvbihhKXtyZXR1cm4gaC5jYWxsKGIsYSk+LTEhPT1jfSl9bi5maWx0ZXI9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWJbMF07cmV0dXJuIGMmJihhPVwiOm5vdChcIithK1wiKVwiKSwxPT09Yi5sZW5ndGgmJjE9PT1kLm5vZGVUeXBlP24uZmluZC5tYXRjaGVzU2VsZWN0b3IoZCxhKT9bZF06W106bi5maW5kLm1hdGNoZXMoYSxuLmdyZXAoYixmdW5jdGlvbihhKXtyZXR1cm4gMT09PWEubm9kZVR5cGV9KSl9LG4uZm4uZXh0ZW5kKHtmaW5kOmZ1bmN0aW9uKGEpe3ZhciBiLGM9dGhpcy5sZW5ndGgsZD1bXSxlPXRoaXM7aWYoXCJzdHJpbmdcIiE9dHlwZW9mIGEpcmV0dXJuIHRoaXMucHVzaFN0YWNrKG4oYSkuZmlsdGVyKGZ1bmN0aW9uKCl7Zm9yKGI9MDtjPmI7YisrKWlmKG4uY29udGFpbnMoZVtiXSx0aGlzKSlyZXR1cm4hMH0pKTtmb3IoYj0wO2M+YjtiKyspbi5maW5kKGEsZVtiXSxkKTtyZXR1cm4gdGhpcy5wdXNoU3RhY2soYz4xP24udW5pcXVlU29ydChkKTpkKX0sZmlsdGVyOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnB1c2hTdGFjayh4KHRoaXMsYXx8W10sITEpKX0sbm90OmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnB1c2hTdGFjayh4KHRoaXMsYXx8W10sITApKX0saXM6ZnVuY3Rpb24oYSl7cmV0dXJuISF4KHRoaXMsXCJzdHJpbmdcIj09dHlwZW9mIGEmJnUudGVzdChhKT9uKGEpOmF8fFtdLCExKS5sZW5ndGh9fSk7dmFyIHksej0vXig/OlxccyooPFtcXHdcXFddKz4pW14+XSp8IyhbXFx3LV0rKSkkLyxBPW4uZm4uaW5pdD1mdW5jdGlvbihhLGIsYyl7dmFyIGUsZjtpZighYSlyZXR1cm4gdGhpcztpZihjPWN8fHksXCJzdHJpbmdcIj09dHlwZW9mIGEpe2lmKGU9XCI8XCI9PT1hWzBdJiZcIj5cIj09PWFbYS5sZW5ndGgtMV0mJmEubGVuZ3RoPj0zP1tudWxsLGEsbnVsbF06ei5leGVjKGEpLCFlfHwhZVsxXSYmYilyZXR1cm4hYnx8Yi5qcXVlcnk/KGJ8fGMpLmZpbmQoYSk6dGhpcy5jb25zdHJ1Y3RvcihiKS5maW5kKGEpO2lmKGVbMV0pe2lmKGI9YiBpbnN0YW5jZW9mIG4/YlswXTpiLG4ubWVyZ2UodGhpcyxuLnBhcnNlSFRNTChlWzFdLGImJmIubm9kZVR5cGU/Yi5vd25lckRvY3VtZW50fHxiOmQsITApKSx2LnRlc3QoZVsxXSkmJm4uaXNQbGFpbk9iamVjdChiKSlmb3IoZSBpbiBiKW4uaXNGdW5jdGlvbih0aGlzW2VdKT90aGlzW2VdKGJbZV0pOnRoaXMuYXR0cihlLGJbZV0pO3JldHVybiB0aGlzfXJldHVybiBmPWQuZ2V0RWxlbWVudEJ5SWQoZVsyXSksZiYmKHRoaXNbMF09Zix0aGlzLmxlbmd0aD0xKSx0aGlzfXJldHVybiBhLm5vZGVUeXBlPyh0aGlzWzBdPWEsdGhpcy5sZW5ndGg9MSx0aGlzKTpuLmlzRnVuY3Rpb24oYSk/dm9pZCAwIT09Yy5yZWFkeT9jLnJlYWR5KGEpOmEobik6bi5tYWtlQXJyYXkoYSx0aGlzKX07QS5wcm90b3R5cGU9bi5mbix5PW4oZCk7dmFyIEI9L14oPzpwYXJlbnRzfHByZXYoPzpVbnRpbHxBbGwpKS8sQz17Y2hpbGRyZW46ITAsY29udGVudHM6ITAsbmV4dDohMCxwcmV2OiEwfTtuLmV4dGVuZCh7ZGlyOmZ1bmN0aW9uKGEsYixjKXt2YXIgZD1bXSxlPXZvaWQgMCE9PWM7d2hpbGUoKGE9YVtiXSkmJjkhPT1hLm5vZGVUeXBlKWlmKDE9PT1hLm5vZGVUeXBlKXtpZihlJiZuKGEpLmlzKGMpKWJyZWFrO2QucHVzaChhKX1yZXR1cm4gZH0sc2libGluZzpmdW5jdGlvbihhLGIpe2Zvcih2YXIgYz1bXTthO2E9YS5uZXh0U2libGluZykxPT09YS5ub2RlVHlwZSYmYSE9PWImJmMucHVzaChhKTtyZXR1cm4gY319KSxuLmZuLmV4dGVuZCh7aGFzOmZ1bmN0aW9uKGEpe3ZhciBiPW4oYSx0aGlzKSxjPWIubGVuZ3RoO3JldHVybiB0aGlzLmZpbHRlcihmdW5jdGlvbigpe2Zvcih2YXIgYT0wO2M+YTthKyspaWYobi5jb250YWlucyh0aGlzLGJbYV0pKXJldHVybiEwfSl9LGNsb3Nlc3Q6ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGMsZD0wLGU9dGhpcy5sZW5ndGgsZj1bXSxnPXUudGVzdChhKXx8XCJzdHJpbmdcIiE9dHlwZW9mIGE/bihhLGJ8fHRoaXMuY29udGV4dCk6MDtlPmQ7ZCsrKWZvcihjPXRoaXNbZF07YyYmYyE9PWI7Yz1jLnBhcmVudE5vZGUpaWYoYy5ub2RlVHlwZTwxMSYmKGc/Zy5pbmRleChjKT4tMToxPT09Yy5ub2RlVHlwZSYmbi5maW5kLm1hdGNoZXNTZWxlY3RvcihjLGEpKSl7Zi5wdXNoKGMpO2JyZWFrfXJldHVybiB0aGlzLnB1c2hTdGFjayhmLmxlbmd0aD4xP24udW5pcXVlU29ydChmKTpmKX0saW5kZXg6ZnVuY3Rpb24oYSl7cmV0dXJuIGE/XCJzdHJpbmdcIj09dHlwZW9mIGE/aC5jYWxsKG4oYSksdGhpc1swXSk6aC5jYWxsKHRoaXMsYS5qcXVlcnk/YVswXTphKTp0aGlzWzBdJiZ0aGlzWzBdLnBhcmVudE5vZGU/dGhpcy5maXJzdCgpLnByZXZBbGwoKS5sZW5ndGg6LTF9LGFkZDpmdW5jdGlvbihhLGIpe3JldHVybiB0aGlzLnB1c2hTdGFjayhuLnVuaXF1ZVNvcnQobi5tZXJnZSh0aGlzLmdldCgpLG4oYSxiKSkpKX0sYWRkQmFjazpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5hZGQobnVsbD09YT90aGlzLnByZXZPYmplY3Q6dGhpcy5wcmV2T2JqZWN0LmZpbHRlcihhKSl9fSk7ZnVuY3Rpb24gRChhLGIpe3doaWxlKChhPWFbYl0pJiYxIT09YS5ub2RlVHlwZSk7cmV0dXJuIGF9bi5lYWNoKHtwYXJlbnQ6ZnVuY3Rpb24oYSl7dmFyIGI9YS5wYXJlbnROb2RlO3JldHVybiBiJiYxMSE9PWIubm9kZVR5cGU/YjpudWxsfSxwYXJlbnRzOmZ1bmN0aW9uKGEpe3JldHVybiBuLmRpcihhLFwicGFyZW50Tm9kZVwiKX0scGFyZW50c1VudGlsOmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gbi5kaXIoYSxcInBhcmVudE5vZGVcIixjKX0sbmV4dDpmdW5jdGlvbihhKXtyZXR1cm4gRChhLFwibmV4dFNpYmxpbmdcIil9LHByZXY6ZnVuY3Rpb24oYSl7cmV0dXJuIEQoYSxcInByZXZpb3VzU2libGluZ1wiKX0sbmV4dEFsbDpmdW5jdGlvbihhKXtyZXR1cm4gbi5kaXIoYSxcIm5leHRTaWJsaW5nXCIpfSxwcmV2QWxsOmZ1bmN0aW9uKGEpe3JldHVybiBuLmRpcihhLFwicHJldmlvdXNTaWJsaW5nXCIpfSxuZXh0VW50aWw6ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBuLmRpcihhLFwibmV4dFNpYmxpbmdcIixjKX0scHJldlVudGlsOmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gbi5kaXIoYSxcInByZXZpb3VzU2libGluZ1wiLGMpfSxzaWJsaW5nczpmdW5jdGlvbihhKXtyZXR1cm4gbi5zaWJsaW5nKChhLnBhcmVudE5vZGV8fHt9KS5maXJzdENoaWxkLGEpfSxjaGlsZHJlbjpmdW5jdGlvbihhKXtyZXR1cm4gbi5zaWJsaW5nKGEuZmlyc3RDaGlsZCl9LGNvbnRlbnRzOmZ1bmN0aW9uKGEpe3JldHVybiBhLmNvbnRlbnREb2N1bWVudHx8bi5tZXJnZShbXSxhLmNoaWxkTm9kZXMpfX0sZnVuY3Rpb24oYSxiKXtuLmZuW2FdPWZ1bmN0aW9uKGMsZCl7dmFyIGU9bi5tYXAodGhpcyxiLGMpO3JldHVyblwiVW50aWxcIiE9PWEuc2xpY2UoLTUpJiYoZD1jKSxkJiZcInN0cmluZ1wiPT10eXBlb2YgZCYmKGU9bi5maWx0ZXIoZCxlKSksdGhpcy5sZW5ndGg+MSYmKENbYV18fG4udW5pcXVlU29ydChlKSxCLnRlc3QoYSkmJmUucmV2ZXJzZSgpKSx0aGlzLnB1c2hTdGFjayhlKX19KTt2YXIgRT0vXFxTKy9nO2Z1bmN0aW9uIEYoYSl7dmFyIGI9e307cmV0dXJuIG4uZWFjaChhLm1hdGNoKEUpfHxbXSxmdW5jdGlvbihhLGMpe2JbY109ITB9KSxifW4uQ2FsbGJhY2tzPWZ1bmN0aW9uKGEpe2E9XCJzdHJpbmdcIj09dHlwZW9mIGE/RihhKTpuLmV4dGVuZCh7fSxhKTt2YXIgYixjLGQsZSxmPVtdLGc9W10saD0tMSxpPWZ1bmN0aW9uKCl7Zm9yKGU9YS5vbmNlLGQ9Yj0hMDtnLmxlbmd0aDtoPS0xKXtjPWcuc2hpZnQoKTt3aGlsZSgrK2g8Zi5sZW5ndGgpZltoXS5hcHBseShjWzBdLGNbMV0pPT09ITEmJmEuc3RvcE9uRmFsc2UmJihoPWYubGVuZ3RoLGM9ITEpfWEubWVtb3J5fHwoYz0hMSksYj0hMSxlJiYoZj1jP1tdOlwiXCIpfSxqPXthZGQ6ZnVuY3Rpb24oKXtyZXR1cm4gZiYmKGMmJiFiJiYoaD1mLmxlbmd0aC0xLGcucHVzaChjKSksZnVuY3Rpb24gZChiKXtuLmVhY2goYixmdW5jdGlvbihiLGMpe24uaXNGdW5jdGlvbihjKT9hLnVuaXF1ZSYmai5oYXMoYyl8fGYucHVzaChjKTpjJiZjLmxlbmd0aCYmXCJzdHJpbmdcIiE9PW4udHlwZShjKSYmZChjKX0pfShhcmd1bWVudHMpLGMmJiFiJiZpKCkpLHRoaXN9LHJlbW92ZTpmdW5jdGlvbigpe3JldHVybiBuLmVhY2goYXJndW1lbnRzLGZ1bmN0aW9uKGEsYil7dmFyIGM7d2hpbGUoKGM9bi5pbkFycmF5KGIsZixjKSk+LTEpZi5zcGxpY2UoYywxKSxoPj1jJiZoLS19KSx0aGlzfSxoYXM6ZnVuY3Rpb24oYSl7cmV0dXJuIGE/bi5pbkFycmF5KGEsZik+LTE6Zi5sZW5ndGg+MH0sZW1wdHk6ZnVuY3Rpb24oKXtyZXR1cm4gZiYmKGY9W10pLHRoaXN9LGRpc2FibGU6ZnVuY3Rpb24oKXtyZXR1cm4gZT1nPVtdLGY9Yz1cIlwiLHRoaXN9LGRpc2FibGVkOmZ1bmN0aW9uKCl7cmV0dXJuIWZ9LGxvY2s6ZnVuY3Rpb24oKXtyZXR1cm4gZT1nPVtdLGN8fGJ8fChmPWM9XCJcIiksdGhpc30sbG9ja2VkOmZ1bmN0aW9uKCl7cmV0dXJuISFlfSxmaXJlV2l0aDpmdW5jdGlvbihhLGMpe3JldHVybiBlfHwoYz1jfHxbXSxjPVthLGMuc2xpY2U/Yy5zbGljZSgpOmNdLGcucHVzaChjKSxifHxpKCkpLHRoaXN9LGZpcmU6ZnVuY3Rpb24oKXtyZXR1cm4gai5maXJlV2l0aCh0aGlzLGFyZ3VtZW50cyksdGhpc30sZmlyZWQ6ZnVuY3Rpb24oKXtyZXR1cm4hIWR9fTtyZXR1cm4gan07ZnVuY3Rpb24gRyhhKXtyZXR1cm4gYX1mdW5jdGlvbiBIKGEpe3Rocm93IGF9bi5leHRlbmQoe0RlZmVycmVkOmZ1bmN0aW9uKGIpe3ZhciBjPVtbXCJub3RpZnlcIixcInByb2dyZXNzXCIsbi5DYWxsYmFja3MoXCJtZW1vcnlcIiksbi5DYWxsYmFja3MoXCJtZW1vcnlcIiksMl0sW1wicmVzb2x2ZVwiLFwiZG9uZVwiLG4uQ2FsbGJhY2tzKFwib25jZSBtZW1vcnlcIiksbi5DYWxsYmFja3MoXCJvbmNlIG1lbW9yeVwiKSwwLFwicmVzb2x2ZWRcIl0sW1wicmVqZWN0XCIsXCJmYWlsXCIsbi5DYWxsYmFja3MoXCJvbmNlIG1lbW9yeVwiKSxuLkNhbGxiYWNrcyhcIm9uY2UgbWVtb3J5XCIpLDEsXCJyZWplY3RlZFwiXV0sZD1cInBlbmRpbmdcIixlPXtzdGF0ZTpmdW5jdGlvbigpe3JldHVybiBkfSxhbHdheXM6ZnVuY3Rpb24oKXtyZXR1cm4gZi5kb25lKGFyZ3VtZW50cykuZmFpbChhcmd1bWVudHMpLHRoaXN9LFwiY2F0Y2hcIjpmdW5jdGlvbihhKXtyZXR1cm4gZS50aGVuKG51bGwsYSl9LHBpcGU6ZnVuY3Rpb24oKXt2YXIgYT1hcmd1bWVudHM7cmV0dXJuIG4uRGVmZXJyZWQoZnVuY3Rpb24oYil7bi5lYWNoKGMsZnVuY3Rpb24oYyxkKXt2YXIgZz1uLmlzRnVuY3Rpb24oYVtkWzRdXSkmJmFbZFs0XV07ZltkWzFdXShmdW5jdGlvbigpe3ZhciBhPWcmJmcuYXBwbHkodGhpcyxhcmd1bWVudHMpO2EmJm4uaXNGdW5jdGlvbihhLnByb21pc2UpP2EucHJvbWlzZSgpLnByb2dyZXNzKGIubm90aWZ5KS5kb25lKGIucmVzb2x2ZSkuZmFpbChiLnJlamVjdCk6YltkWzBdK1wiV2l0aFwiXSh0aGlzPT09ZT9iLnByb21pc2UoKTp0aGlzLGc/W2FdOmFyZ3VtZW50cyl9KX0pLGE9bnVsbH0pLnByb21pc2UoKX0sdGhlbjpmdW5jdGlvbihiLGQsZil7dmFyIGc9MDtmdW5jdGlvbiBoKGIsYyxkLGYpe3JldHVybiBmdW5jdGlvbigpe3ZhciBpPXRoaXM9PT1lP3ZvaWQgMDp0aGlzLGo9YXJndW1lbnRzLGs9ZnVuY3Rpb24oKXt2YXIgYSxlO2lmKCEoZz5iKSl7aWYoYT1kLmFwcGx5KGksaiksYT09PWMucHJvbWlzZSgpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJUaGVuYWJsZSBzZWxmLXJlc29sdXRpb25cIik7ZT1hJiYoXCJvYmplY3RcIj09dHlwZW9mIGF8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGEpJiZhLnRoZW4sbi5pc0Z1bmN0aW9uKGUpP2Y/ZS5jYWxsKGEsaChnLGMsRyxmKSxoKGcsYyxILGYpKTooZysrLGUuY2FsbChhLGgoZyxjLEcsZiksaChnLGMsSCxmKSxoKGcsYyxHLGMubm90aWZ5KSkpOihkIT09RyYmKGk9dm9pZCAwLGo9W2FdKSwoZnx8Yy5yZXNvbHZlV2l0aCkoaXx8Yy5wcm9taXNlKCksaikpfX0sbD1mP2s6ZnVuY3Rpb24oKXt0cnl7aygpfWNhdGNoKGEpe2IrMT49ZyYmKGQhPT1IJiYoaT12b2lkIDAsaj1bYV0pLGMucmVqZWN0V2l0aChpfHxjLnByb21pc2UoKSxqKSl9fTtiP2woKTphLnNldFRpbWVvdXQobCl9fXJldHVybiBuLkRlZmVycmVkKGZ1bmN0aW9uKGEpe2NbMF1bM10uYWRkKGgoMCxhLG4uaXNGdW5jdGlvbihmKT9mOkcsYS5ub3RpZnlXaXRoKSksY1sxXVszXS5hZGQoaCgwLGEsbi5pc0Z1bmN0aW9uKGIpP2I6RykpLGNbMl1bM10uYWRkKGgoMCxhLG4uaXNGdW5jdGlvbihkKT9kOkgpKX0pLnByb21pc2UoKX0scHJvbWlzZTpmdW5jdGlvbihhKXtyZXR1cm4gbnVsbCE9YT9uLmV4dGVuZChhLGUpOmV9fSxmPXt9O3JldHVybiBuLmVhY2goYyxmdW5jdGlvbihhLGIpe3ZhciBnPWJbMl0saD1iWzVdO2VbYlsxXV09Zy5hZGQsaCYmZy5hZGQoZnVuY3Rpb24oKXtkPWh9LGNbMy1hXVsyXS5kaXNhYmxlLGNbMF1bMl0ubG9jayksZy5hZGQoYlszXS5maXJlKSxmW2JbMF1dPWZ1bmN0aW9uKCl7cmV0dXJuIGZbYlswXStcIldpdGhcIl0odGhpcz09PWY/ZTp0aGlzLGFyZ3VtZW50cyksdGhpc30sZltiWzBdK1wiV2l0aFwiXT1nLmZpcmVXaXRofSksZS5wcm9taXNlKGYpLGImJmIuY2FsbChmLGYpLGZ9LHdoZW46ZnVuY3Rpb24oYSl7dmFyIGIsYz0wLGQ9ZS5jYWxsKGFyZ3VtZW50cyksZj1kLmxlbmd0aCxnPTEhPT1mfHxhJiZuLmlzRnVuY3Rpb24oYS5wcm9taXNlKT9mOjAsaD0xPT09Zz9hOm4uRGVmZXJyZWQoKSxpPWZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gZnVuY3Rpb24oZCl7YlthXT10aGlzLGNbYV09YXJndW1lbnRzLmxlbmd0aD4xP2UuY2FsbChhcmd1bWVudHMpOmQsYz09PWo/aC5ub3RpZnlXaXRoKGIsYyk6LS1nfHxoLnJlc29sdmVXaXRoKGIsYyl9fSxqLGssbDtpZihmPjEpZm9yKGo9bmV3IEFycmF5KGYpLGs9bmV3IEFycmF5KGYpLGw9bmV3IEFycmF5KGYpO2Y+YztjKyspZFtjXSYmbi5pc0Z1bmN0aW9uKGI9ZFtjXS5wcm9taXNlKT9iLmNhbGwoZFtjXSkucHJvZ3Jlc3MoaShjLGssaikpLmRvbmUoaShjLGwsZCkpLmZhaWwoaC5yZWplY3QpOmRbY10mJm4uaXNGdW5jdGlvbihiPWRbY10udGhlbik/Yi5jYWxsKGRbY10saShjLGwsZCksaC5yZWplY3QsaShjLGssaikpOi0tZztyZXR1cm4gZ3x8aC5yZXNvbHZlV2l0aChsLGQpLGgucHJvbWlzZSgpfX0pO3ZhciBJO24uZm4ucmVhZHk9ZnVuY3Rpb24oYSl7cmV0dXJuIG4ucmVhZHkucHJvbWlzZSgpLmRvbmUoYSksdGhpc30sbi5leHRlbmQoe2lzUmVhZHk6ITEscmVhZHlXYWl0OjEsaG9sZFJlYWR5OmZ1bmN0aW9uKGEpe2E/bi5yZWFkeVdhaXQrKzpuLnJlYWR5KCEwKX0scmVhZHk6ZnVuY3Rpb24oYSl7KGE9PT0hMD8tLW4ucmVhZHlXYWl0Om4uaXNSZWFkeSl8fChuLmlzUmVhZHk9ITAsYSE9PSEwJiYtLW4ucmVhZHlXYWl0PjB8fEkucmVzb2x2ZVdpdGgoZCxbbl0pKX19KTtmdW5jdGlvbiBKKCl7ZC5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLEopLGEucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRcIixKKSxuLnJlYWR5KCl9bi5yZWFkeS5wcm9taXNlPWZ1bmN0aW9uKGIpe3JldHVybiBJfHwoST1uLkRlZmVycmVkKCksXCJjb21wbGV0ZVwiPT09ZC5yZWFkeVN0YXRlP2Euc2V0VGltZW91dChuLnJlYWR5KTooZC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLEopLGEuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIixKKSkpLEkucHJvbWlzZShiKX0sbi5yZWFkeS5wcm9taXNlKCk7dmFyIEs9ZnVuY3Rpb24oYSxiLGMsZCxlLGYsZyl7dmFyIGg9MCxpPWEubGVuZ3RoLGo9bnVsbD09YztpZihcIm9iamVjdFwiPT09bi50eXBlKGMpKXtlPSEwO2ZvcihoIGluIGMpSyhhLGIsaCxjW2hdLCEwLGYsZyl9ZWxzZSBpZih2b2lkIDAhPT1kJiYoZT0hMCxuLmlzRnVuY3Rpb24oZCl8fChnPSEwKSxqJiYoZz8oYi5jYWxsKGEsZCksYj1udWxsKTooaj1iLGI9ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBqLmNhbGwobihhKSxjKX0pKSxiKSlmb3IoO2k+aDtoKyspYihhW2hdLGMsZz9kOmQuY2FsbChhW2hdLGgsYihhW2hdLGMpKSk7cmV0dXJuIGU/YTpqP2IuY2FsbChhKTppP2IoYVswXSxjKTpmfTtuLmFjY2VwdERhdGE9ZnVuY3Rpb24oYSl7cmV0dXJuIDE9PT1hLm5vZGVUeXBlfHw5PT09YS5ub2RlVHlwZXx8ISthLm5vZGVUeXBlfTtmdW5jdGlvbiBMKCl7dGhpcy5leHBhbmRvPW4uZXhwYW5kbytMLnVpZCsrfUwudWlkPTEsTC5hY2NlcHRzPW4uYWNjZXB0RGF0YSxMLnByb3RvdHlwZT17cmVnaXN0ZXI6ZnVuY3Rpb24oYSl7dmFyIGI9e307cmV0dXJuIGEubm9kZVR5cGU/YVt0aGlzLmV4cGFuZG9dPWI6T2JqZWN0LmRlZmluZVByb3BlcnR5KGEsdGhpcy5leHBhbmRvLHt2YWx1ZTpiLHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH0pLGFbdGhpcy5leHBhbmRvXX0sY2FjaGU6ZnVuY3Rpb24oYSl7aWYoIUwuYWNjZXB0cyhhKSlyZXR1cm57fTt2YXIgYj1hW3RoaXMuZXhwYW5kb107cmV0dXJuIGI/Yjp0aGlzLnJlZ2lzdGVyKGEpfSxzZXQ6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkLGU9dGhpcy5jYWNoZShhKTtpZihcInN0cmluZ1wiPT10eXBlb2YgYillW24uY2FtZWxDYXNlKGIpXT1jO2Vsc2UgZm9yKGQgaW4gYillW24uY2FtZWxDYXNlKGQpXT1iW2RdO3JldHVybiBlfSxnZXQ6ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLmNhY2hlKGEpO3JldHVybiB2b2lkIDA9PT1iP2M6Y1tuLmNhbWVsQ2FzZShiKV19LGFjY2VzczpmdW5jdGlvbihhLGIsYyl7XG5yZXR1cm4gdm9pZCAwPT09Ynx8YiYmXCJzdHJpbmdcIj09dHlwZW9mIGImJnZvaWQgMD09PWM/dGhpcy5nZXQoYSxiKToodGhpcy5zZXQoYSxiLGMpLHZvaWQgMCE9PWM/YzpiKX0scmVtb3ZlOmZ1bmN0aW9uKGEsYil7dmFyIGMsZD1hW3RoaXMuZXhwYW5kb107aWYodm9pZCAwIT09ZCl7aWYodm9pZCAwIT09Yil7bi5pc0FycmF5KGIpP2I9Yi5tYXAobi5jYW1lbENhc2UpOihiPW4uY2FtZWxDYXNlKGIpLGI9YiBpbiBkP1tiXTpiLm1hdGNoKEUpfHxbXSksYz1iLmxlbmd0aDt3aGlsZShjLS0pZGVsZXRlIGRbYltjXV19KHZvaWQgMD09PWJ8fG4uaXNFbXB0eU9iamVjdChkKSkmJmRlbGV0ZSBhW3RoaXMuZXhwYW5kb119fSxoYXNEYXRhOmZ1bmN0aW9uKGEpe3ZhciBiPWFbdGhpcy5leHBhbmRvXTtyZXR1cm4gdm9pZCAwIT09YiYmIW4uaXNFbXB0eU9iamVjdChiKX19O3ZhciBNPW5ldyBMLE49bmV3IEwsTz0vXig/Olxce1tcXHdcXFddKlxcfXxcXFtbXFx3XFxXXSpcXF0pJC8sUD0vW0EtWl0vZztmdW5jdGlvbiBRKGEsYixjKXt2YXIgZDtpZih2b2lkIDA9PT1jJiYxPT09YS5ub2RlVHlwZSlpZihkPVwiZGF0YS1cIitiLnJlcGxhY2UoUCxcIi0kJlwiKS50b0xvd2VyQ2FzZSgpLGM9YS5nZXRBdHRyaWJ1dGUoZCksXCJzdHJpbmdcIj09dHlwZW9mIGMpe3RyeXtjPVwidHJ1ZVwiPT09Yz8hMDpcImZhbHNlXCI9PT1jPyExOlwibnVsbFwiPT09Yz9udWxsOitjK1wiXCI9PT1jPytjOk8udGVzdChjKT9uLnBhcnNlSlNPTihjKTpjfWNhdGNoKGUpe31OLnNldChhLGIsYyl9ZWxzZSBjPXZvaWQgMDtyZXR1cm4gY31uLmV4dGVuZCh7aGFzRGF0YTpmdW5jdGlvbihhKXtyZXR1cm4gTi5oYXNEYXRhKGEpfHxNLmhhc0RhdGEoYSl9LGRhdGE6ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBOLmFjY2VzcyhhLGIsYyl9LHJlbW92ZURhdGE6ZnVuY3Rpb24oYSxiKXtOLnJlbW92ZShhLGIpfSxfZGF0YTpmdW5jdGlvbihhLGIsYyl7cmV0dXJuIE0uYWNjZXNzKGEsYixjKX0sX3JlbW92ZURhdGE6ZnVuY3Rpb24oYSxiKXtNLnJlbW92ZShhLGIpfX0pLG4uZm4uZXh0ZW5kKHtkYXRhOmZ1bmN0aW9uKGEsYil7dmFyIGMsZCxlLGY9dGhpc1swXSxnPWYmJmYuYXR0cmlidXRlcztpZih2b2lkIDA9PT1hKXtpZih0aGlzLmxlbmd0aCYmKGU9Ti5nZXQoZiksMT09PWYubm9kZVR5cGUmJiFNLmdldChmLFwiaGFzRGF0YUF0dHJzXCIpKSl7Yz1nLmxlbmd0aDt3aGlsZShjLS0pZ1tjXSYmKGQ9Z1tjXS5uYW1lLDA9PT1kLmluZGV4T2YoXCJkYXRhLVwiKSYmKGQ9bi5jYW1lbENhc2UoZC5zbGljZSg1KSksUShmLGQsZVtkXSkpKTtNLnNldChmLFwiaGFzRGF0YUF0dHJzXCIsITApfXJldHVybiBlfXJldHVyblwib2JqZWN0XCI9PXR5cGVvZiBhP3RoaXMuZWFjaChmdW5jdGlvbigpe04uc2V0KHRoaXMsYSl9KTpLKHRoaXMsZnVuY3Rpb24oYil7dmFyIGM7aWYoZiYmdm9pZCAwPT09Yil7aWYoYz1OLmdldChmLGEpLHZvaWQgMCE9PWMpcmV0dXJuIGM7aWYoYz1RKGYsYSksdm9pZCAwIT09YylyZXR1cm4gY31lbHNlIHRoaXMuZWFjaChmdW5jdGlvbigpe04uc2V0KHRoaXMsYSxiKX0pfSxudWxsLGIsYXJndW1lbnRzLmxlbmd0aD4xLG51bGwsITApfSxyZW1vdmVEYXRhOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtOLnJlbW92ZSh0aGlzLGEpfSl9fSksbi5leHRlbmQoe3F1ZXVlOmZ1bmN0aW9uKGEsYixjKXt2YXIgZDtyZXR1cm4gYT8oYj0oYnx8XCJmeFwiKStcInF1ZXVlXCIsZD1NLmdldChhLGIpLGMmJighZHx8bi5pc0FycmF5KGMpP2Q9TS5hY2Nlc3MoYSxiLG4ubWFrZUFycmF5KGMpKTpkLnB1c2goYykpLGR8fFtdKTp2b2lkIDB9LGRlcXVldWU6ZnVuY3Rpb24oYSxiKXtiPWJ8fFwiZnhcIjt2YXIgYz1uLnF1ZXVlKGEsYiksZD1jLmxlbmd0aCxlPWMuc2hpZnQoKSxmPW4uX3F1ZXVlSG9va3MoYSxiKSxnPWZ1bmN0aW9uKCl7bi5kZXF1ZXVlKGEsYil9O1wiaW5wcm9ncmVzc1wiPT09ZSYmKGU9Yy5zaGlmdCgpLGQtLSksZSYmKFwiZnhcIj09PWImJmMudW5zaGlmdChcImlucHJvZ3Jlc3NcIiksZGVsZXRlIGYuc3RvcCxlLmNhbGwoYSxnLGYpKSwhZCYmZiYmZi5lbXB0eS5maXJlKCl9LF9xdWV1ZUhvb2tzOmZ1bmN0aW9uKGEsYil7dmFyIGM9YitcInF1ZXVlSG9va3NcIjtyZXR1cm4gTS5nZXQoYSxjKXx8TS5hY2Nlc3MoYSxjLHtlbXB0eTpuLkNhbGxiYWNrcyhcIm9uY2UgbWVtb3J5XCIpLmFkZChmdW5jdGlvbigpe00ucmVtb3ZlKGEsW2IrXCJxdWV1ZVwiLGNdKX0pfSl9fSksbi5mbi5leHRlbmQoe3F1ZXVlOmZ1bmN0aW9uKGEsYil7dmFyIGM9MjtyZXR1cm5cInN0cmluZ1wiIT10eXBlb2YgYSYmKGI9YSxhPVwiZnhcIixjLS0pLGFyZ3VtZW50cy5sZW5ndGg8Yz9uLnF1ZXVlKHRoaXNbMF0sYSk6dm9pZCAwPT09Yj90aGlzOnRoaXMuZWFjaChmdW5jdGlvbigpe3ZhciBjPW4ucXVldWUodGhpcyxhLGIpO24uX3F1ZXVlSG9va3ModGhpcyxhKSxcImZ4XCI9PT1hJiZcImlucHJvZ3Jlc3NcIiE9PWNbMF0mJm4uZGVxdWV1ZSh0aGlzLGEpfSl9LGRlcXVldWU6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe24uZGVxdWV1ZSh0aGlzLGEpfSl9LGNsZWFyUXVldWU6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMucXVldWUoYXx8XCJmeFwiLFtdKX0scHJvbWlzZTpmdW5jdGlvbihhLGIpe3ZhciBjLGQ9MSxlPW4uRGVmZXJyZWQoKSxmPXRoaXMsZz10aGlzLmxlbmd0aCxoPWZ1bmN0aW9uKCl7LS1kfHxlLnJlc29sdmVXaXRoKGYsW2ZdKX07XCJzdHJpbmdcIiE9dHlwZW9mIGEmJihiPWEsYT12b2lkIDApLGE9YXx8XCJmeFwiO3doaWxlKGctLSljPU0uZ2V0KGZbZ10sYStcInF1ZXVlSG9va3NcIiksYyYmYy5lbXB0eSYmKGQrKyxjLmVtcHR5LmFkZChoKSk7cmV0dXJuIGgoKSxlLnByb21pc2UoYil9fSk7dmFyIFI9L1srLV0/KD86XFxkKlxcLnwpXFxkKyg/OltlRV1bKy1dP1xcZCt8KS8uc291cmNlLFM9bmV3IFJlZ0V4cChcIl4oPzooWystXSk9fCkoXCIrUitcIikoW2EteiVdKikkXCIsXCJpXCIpLFQ9L14oPzpjaGVja2JveHxyYWRpbykkL2ksVT0vPChbXFx3Oi1dKykvLFY9L14kfFxcLyg/OmphdmF8ZWNtYSlzY3JpcHQvaSxXPXtvcHRpb246WzEsXCI8c2VsZWN0IG11bHRpcGxlPSdtdWx0aXBsZSc+XCIsXCI8L3NlbGVjdD5cIl0sdGhlYWQ6WzEsXCI8dGFibGU+XCIsXCI8L3RhYmxlPlwiXSxjb2w6WzIsXCI8dGFibGU+PGNvbGdyb3VwPlwiLFwiPC9jb2xncm91cD48L3RhYmxlPlwiXSx0cjpbMixcIjx0YWJsZT5cIixcIjwvdGFibGU+XCJdLHRkOlszLFwiPHRhYmxlPlwiLFwiPC90YWJsZT5cIl0sX2RlZmF1bHQ6WzAsXCJcIixcIlwiXX07Vy5vcHRncm91cD1XLm9wdGlvbixXLnRib2R5PVcudGZvb3Q9Vy5jb2xncm91cD1XLmNhcHRpb249Vy50aGVhZCxXLnRoPVcudGQ7ZnVuY3Rpb24gWChhLGIpe3ZhciBjPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBhLmdldEVsZW1lbnRzQnlUYWdOYW1lP2EuZ2V0RWxlbWVudHNCeVRhZ05hbWUoYnx8XCIqXCIpOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBhLnF1ZXJ5U2VsZWN0b3JBbGw/YS5xdWVyeVNlbGVjdG9yQWxsKGJ8fFwiKlwiKTpbXTtyZXR1cm4gdm9pZCAwPT09Ynx8YiYmbi5ub2RlTmFtZShhLGIpP24ubWVyZ2UoW2FdLGMpOmN9ZnVuY3Rpb24gWShhLGIpe2Zvcih2YXIgYz0wLGQ9YS5sZW5ndGg7ZD5jO2MrKylNLnNldChhW2NdLFwiZ2xvYmFsRXZhbFwiLCFifHxNLmdldChiW2NdLFwiZ2xvYmFsRXZhbFwiKSl9dmFyIFo9Lzx8JiM/XFx3KzsvO2Z1bmN0aW9uICQoYSxiLGMsZCxlKXtmb3IodmFyIGYsZyxoLGksaixrLGw9Yi5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksbT1bXSxvPTAscD1hLmxlbmd0aDtwPm87bysrKWlmKGY9YVtvXSxmfHwwPT09ZilpZihcIm9iamVjdFwiPT09bi50eXBlKGYpKW4ubWVyZ2UobSxmLm5vZGVUeXBlP1tmXTpmKTtlbHNlIGlmKFoudGVzdChmKSl7Zz1nfHxsLmFwcGVuZENoaWxkKGIuY3JlYXRlRWxlbWVudChcImRpdlwiKSksaD0oVS5leGVjKGYpfHxbXCJcIixcIlwiXSlbMV0udG9Mb3dlckNhc2UoKSxpPVdbaF18fFcuX2RlZmF1bHQsZy5pbm5lckhUTUw9aVsxXStuLmh0bWxQcmVmaWx0ZXIoZikraVsyXSxrPWlbMF07d2hpbGUoay0tKWc9Zy5sYXN0Q2hpbGQ7bi5tZXJnZShtLGcuY2hpbGROb2RlcyksZz1sLmZpcnN0Q2hpbGQsZy50ZXh0Q29udGVudD1cIlwifWVsc2UgbS5wdXNoKGIuY3JlYXRlVGV4dE5vZGUoZikpO2wudGV4dENvbnRlbnQ9XCJcIixvPTA7d2hpbGUoZj1tW28rK10paWYoZCYmbi5pbkFycmF5KGYsZCk+LTEpZSYmZS5wdXNoKGYpO2Vsc2UgaWYoaj1uLmNvbnRhaW5zKGYub3duZXJEb2N1bWVudCxmKSxnPVgobC5hcHBlbmRDaGlsZChmKSxcInNjcmlwdFwiKSxqJiZZKGcpLGMpe2s9MDt3aGlsZShmPWdbaysrXSlWLnRlc3QoZi50eXBlfHxcIlwiKSYmYy5wdXNoKGYpfXJldHVybiBsfSFmdW5jdGlvbigpe3ZhciBhPWQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLGI9YS5hcHBlbmRDaGlsZChkLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpLGM9ZC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7Yy5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsXCJyYWRpb1wiKSxjLnNldEF0dHJpYnV0ZShcImNoZWNrZWRcIixcImNoZWNrZWRcIiksYy5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsXCJ0XCIpLGIuYXBwZW5kQ2hpbGQoYyksbC5jaGVja0Nsb25lPWIuY2xvbmVOb2RlKCEwKS5jbG9uZU5vZGUoITApLmxhc3RDaGlsZC5jaGVja2VkLGIuaW5uZXJIVE1MPVwiPHRleHRhcmVhPng8L3RleHRhcmVhPlwiLGwubm9DbG9uZUNoZWNrZWQ9ISFiLmNsb25lTm9kZSghMCkubGFzdENoaWxkLmRlZmF1bHRWYWx1ZX0oKSxsLmZvY3VzaW49XCJvbmZvY3VzaW5cImluIGE7dmFyIF89L15rZXkvLGFhPS9eKD86bW91c2V8cG9pbnRlcnxjb250ZXh0bWVudXxkcmFnfGRyb3ApfGNsaWNrLyxiYT0vXig/OmZvY3VzaW5mb2N1c3xmb2N1c291dGJsdXIpJC8sY2E9L14oW14uXSopKD86XFwuKC4rKXwpLztmdW5jdGlvbiBkYSgpe3JldHVybiEwfWZ1bmN0aW9uIGVhKCl7cmV0dXJuITF9ZnVuY3Rpb24gZmEoKXt0cnl7cmV0dXJuIGQuYWN0aXZlRWxlbWVudH1jYXRjaChhKXt9fWZ1bmN0aW9uIGdhKGEsYixjLGQsZSxmKXt2YXIgZyxoO2lmKFwib2JqZWN0XCI9PXR5cGVvZiBiKXtcInN0cmluZ1wiIT10eXBlb2YgYyYmKGQ9ZHx8YyxjPXZvaWQgMCk7Zm9yKGggaW4gYilnYShhLGgsYyxkLGJbaF0sZik7cmV0dXJuIGF9cmV0dXJuIG51bGw9PWQmJm51bGw9PWU/KGU9YyxkPWM9dm9pZCAwKTpudWxsPT1lJiYoXCJzdHJpbmdcIj09dHlwZW9mIGM/KGU9ZCxkPXZvaWQgMCk6KGU9ZCxkPWMsYz12b2lkIDApKSxlPT09ITEmJihlPWVhKSwxPT09ZiYmKGc9ZSxlPWZ1bmN0aW9uKGEpe3JldHVybiBuKCkub2ZmKGEpLGcuYXBwbHkodGhpcyxhcmd1bWVudHMpfSxlLmd1aWQ9Zy5ndWlkfHwoZy5ndWlkPW4uZ3VpZCsrKSksYS5lYWNoKGZ1bmN0aW9uKCl7bi5ldmVudC5hZGQodGhpcyxiLGUsZCxjKX0pfW4uZXZlbnQ9e2dsb2JhbDp7fSxhZGQ6ZnVuY3Rpb24oYSxiLGMsZCxlKXt2YXIgZixnLGgsaSxqLGssbCxtLG8scCxxLHI9TS5nZXQoYSk7aWYocil7Yy5oYW5kbGVyJiYoZj1jLGM9Zi5oYW5kbGVyLGU9Zi5zZWxlY3RvciksYy5ndWlkfHwoYy5ndWlkPW4uZ3VpZCsrKSwoaT1yLmV2ZW50cyl8fChpPXIuZXZlbnRzPXt9KSwoZz1yLmhhbmRsZSl8fChnPXIuaGFuZGxlPWZ1bmN0aW9uKGIpe3JldHVyblwidW5kZWZpbmVkXCIhPXR5cGVvZiBuJiZuLmV2ZW50LnRyaWdnZXJlZCE9PWIudHlwZT9uLmV2ZW50LmRpc3BhdGNoLmFwcGx5KGEsYXJndW1lbnRzKTp2b2lkIDB9KSxiPShifHxcIlwiKS5tYXRjaChFKXx8W1wiXCJdLGo9Yi5sZW5ndGg7d2hpbGUoai0tKWg9Y2EuZXhlYyhiW2pdKXx8W10sbz1xPWhbMV0scD0oaFsyXXx8XCJcIikuc3BsaXQoXCIuXCIpLnNvcnQoKSxvJiYobD1uLmV2ZW50LnNwZWNpYWxbb118fHt9LG89KGU/bC5kZWxlZ2F0ZVR5cGU6bC5iaW5kVHlwZSl8fG8sbD1uLmV2ZW50LnNwZWNpYWxbb118fHt9LGs9bi5leHRlbmQoe3R5cGU6byxvcmlnVHlwZTpxLGRhdGE6ZCxoYW5kbGVyOmMsZ3VpZDpjLmd1aWQsc2VsZWN0b3I6ZSxuZWVkc0NvbnRleHQ6ZSYmbi5leHByLm1hdGNoLm5lZWRzQ29udGV4dC50ZXN0KGUpLG5hbWVzcGFjZTpwLmpvaW4oXCIuXCIpfSxmKSwobT1pW29dKXx8KG09aVtvXT1bXSxtLmRlbGVnYXRlQ291bnQ9MCxsLnNldHVwJiZsLnNldHVwLmNhbGwoYSxkLHAsZykhPT0hMXx8YS5hZGRFdmVudExpc3RlbmVyJiZhLmFkZEV2ZW50TGlzdGVuZXIobyxnKSksbC5hZGQmJihsLmFkZC5jYWxsKGEsayksay5oYW5kbGVyLmd1aWR8fChrLmhhbmRsZXIuZ3VpZD1jLmd1aWQpKSxlP20uc3BsaWNlKG0uZGVsZWdhdGVDb3VudCsrLDAsayk6bS5wdXNoKGspLG4uZXZlbnQuZ2xvYmFsW29dPSEwKX19LHJlbW92ZTpmdW5jdGlvbihhLGIsYyxkLGUpe3ZhciBmLGcsaCxpLGosayxsLG0sbyxwLHEscj1NLmhhc0RhdGEoYSkmJk0uZ2V0KGEpO2lmKHImJihpPXIuZXZlbnRzKSl7Yj0oYnx8XCJcIikubWF0Y2goRSl8fFtcIlwiXSxqPWIubGVuZ3RoO3doaWxlKGotLSlpZihoPWNhLmV4ZWMoYltqXSl8fFtdLG89cT1oWzFdLHA9KGhbMl18fFwiXCIpLnNwbGl0KFwiLlwiKS5zb3J0KCksbyl7bD1uLmV2ZW50LnNwZWNpYWxbb118fHt9LG89KGQ/bC5kZWxlZ2F0ZVR5cGU6bC5iaW5kVHlwZSl8fG8sbT1pW29dfHxbXSxoPWhbMl0mJm5ldyBSZWdFeHAoXCIoXnxcXFxcLilcIitwLmpvaW4oXCJcXFxcLig/Oi4qXFxcXC58KVwiKStcIihcXFxcLnwkKVwiKSxnPWY9bS5sZW5ndGg7d2hpbGUoZi0tKWs9bVtmXSwhZSYmcSE9PWsub3JpZ1R5cGV8fGMmJmMuZ3VpZCE9PWsuZ3VpZHx8aCYmIWgudGVzdChrLm5hbWVzcGFjZSl8fGQmJmQhPT1rLnNlbGVjdG9yJiYoXCIqKlwiIT09ZHx8IWsuc2VsZWN0b3IpfHwobS5zcGxpY2UoZiwxKSxrLnNlbGVjdG9yJiZtLmRlbGVnYXRlQ291bnQtLSxsLnJlbW92ZSYmbC5yZW1vdmUuY2FsbChhLGspKTtnJiYhbS5sZW5ndGgmJihsLnRlYXJkb3duJiZsLnRlYXJkb3duLmNhbGwoYSxwLHIuaGFuZGxlKSE9PSExfHxuLnJlbW92ZUV2ZW50KGEsbyxyLmhhbmRsZSksZGVsZXRlIGlbb10pfWVsc2UgZm9yKG8gaW4gaSluLmV2ZW50LnJlbW92ZShhLG8rYltqXSxjLGQsITApO24uaXNFbXB0eU9iamVjdChpKSYmTS5yZW1vdmUoYSxcImhhbmRsZSBldmVudHNcIil9fSx0cmlnZ2VyOmZ1bmN0aW9uKGIsYyxlLGYpe3ZhciBnLGgsaSxqLGwsbSxvLHA9W2V8fGRdLHE9ay5jYWxsKGIsXCJ0eXBlXCIpP2IudHlwZTpiLHI9ay5jYWxsKGIsXCJuYW1lc3BhY2VcIik/Yi5uYW1lc3BhY2Uuc3BsaXQoXCIuXCIpOltdO2lmKGg9aT1lPWV8fGQsMyE9PWUubm9kZVR5cGUmJjghPT1lLm5vZGVUeXBlJiYhYmEudGVzdChxK24uZXZlbnQudHJpZ2dlcmVkKSYmKHEuaW5kZXhPZihcIi5cIik+LTEmJihyPXEuc3BsaXQoXCIuXCIpLHE9ci5zaGlmdCgpLHIuc29ydCgpKSxsPXEuaW5kZXhPZihcIjpcIik8MCYmXCJvblwiK3EsYj1iW24uZXhwYW5kb10/YjpuZXcgbi5FdmVudChxLFwib2JqZWN0XCI9PXR5cGVvZiBiJiZiKSxiLmlzVHJpZ2dlcj1mPzI6MyxiLm5hbWVzcGFjZT1yLmpvaW4oXCIuXCIpLGIucm5hbWVzcGFjZT1iLm5hbWVzcGFjZT9uZXcgUmVnRXhwKFwiKF58XFxcXC4pXCIrci5qb2luKFwiXFxcXC4oPzouKlxcXFwufClcIikrXCIoXFxcXC58JClcIik6bnVsbCxiLnJlc3VsdD12b2lkIDAsYi50YXJnZXR8fChiLnRhcmdldD1lKSxjPW51bGw9PWM/W2JdOm4ubWFrZUFycmF5KGMsW2JdKSxvPW4uZXZlbnQuc3BlY2lhbFtxXXx8e30sZnx8IW8udHJpZ2dlcnx8by50cmlnZ2VyLmFwcGx5KGUsYykhPT0hMSkpe2lmKCFmJiYhby5ub0J1YmJsZSYmIW4uaXNXaW5kb3coZSkpe2ZvcihqPW8uZGVsZWdhdGVUeXBlfHxxLGJhLnRlc3QoaitxKXx8KGg9aC5wYXJlbnROb2RlKTtoO2g9aC5wYXJlbnROb2RlKXAucHVzaChoKSxpPWg7aT09PShlLm93bmVyRG9jdW1lbnR8fGQpJiZwLnB1c2goaS5kZWZhdWx0Vmlld3x8aS5wYXJlbnRXaW5kb3d8fGEpfWc9MDt3aGlsZSgoaD1wW2crK10pJiYhYi5pc1Byb3BhZ2F0aW9uU3RvcHBlZCgpKWIudHlwZT1nPjE/ajpvLmJpbmRUeXBlfHxxLG09KE0uZ2V0KGgsXCJldmVudHNcIil8fHt9KVtiLnR5cGVdJiZNLmdldChoLFwiaGFuZGxlXCIpLG0mJm0uYXBwbHkoaCxjKSxtPWwmJmhbbF0sbSYmbS5hcHBseSYmbi5hY2NlcHREYXRhKGgpJiYoYi5yZXN1bHQ9bS5hcHBseShoLGMpLGIucmVzdWx0PT09ITEmJmIucHJldmVudERlZmF1bHQoKSk7cmV0dXJuIGIudHlwZT1xLGZ8fGIuaXNEZWZhdWx0UHJldmVudGVkKCl8fG8uX2RlZmF1bHQmJm8uX2RlZmF1bHQuYXBwbHkocC5wb3AoKSxjKSE9PSExfHwhbi5hY2NlcHREYXRhKGUpfHxsJiZuLmlzRnVuY3Rpb24oZVtxXSkmJiFuLmlzV2luZG93KGUpJiYoaT1lW2xdLGkmJihlW2xdPW51bGwpLG4uZXZlbnQudHJpZ2dlcmVkPXEsZVtxXSgpLG4uZXZlbnQudHJpZ2dlcmVkPXZvaWQgMCxpJiYoZVtsXT1pKSksYi5yZXN1bHR9fSxkaXNwYXRjaDpmdW5jdGlvbihhKXthPW4uZXZlbnQuZml4KGEpO3ZhciBiLGMsZCxmLGcsaD1bXSxpPWUuY2FsbChhcmd1bWVudHMpLGo9KE0uZ2V0KHRoaXMsXCJldmVudHNcIil8fHt9KVthLnR5cGVdfHxbXSxrPW4uZXZlbnQuc3BlY2lhbFthLnR5cGVdfHx7fTtpZihpWzBdPWEsYS5kZWxlZ2F0ZVRhcmdldD10aGlzLCFrLnByZURpc3BhdGNofHxrLnByZURpc3BhdGNoLmNhbGwodGhpcyxhKSE9PSExKXtoPW4uZXZlbnQuaGFuZGxlcnMuY2FsbCh0aGlzLGEsaiksYj0wO3doaWxlKChmPWhbYisrXSkmJiFhLmlzUHJvcGFnYXRpb25TdG9wcGVkKCkpe2EuY3VycmVudFRhcmdldD1mLmVsZW0sYz0wO3doaWxlKChnPWYuaGFuZGxlcnNbYysrXSkmJiFhLmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkKCkpKCFhLnJuYW1lc3BhY2V8fGEucm5hbWVzcGFjZS50ZXN0KGcubmFtZXNwYWNlKSkmJihhLmhhbmRsZU9iaj1nLGEuZGF0YT1nLmRhdGEsZD0oKG4uZXZlbnQuc3BlY2lhbFtnLm9yaWdUeXBlXXx8e30pLmhhbmRsZXx8Zy5oYW5kbGVyKS5hcHBseShmLmVsZW0saSksdm9pZCAwIT09ZCYmKGEucmVzdWx0PWQpPT09ITEmJihhLnByZXZlbnREZWZhdWx0KCksYS5zdG9wUHJvcGFnYXRpb24oKSkpfXJldHVybiBrLnBvc3REaXNwYXRjaCYmay5wb3N0RGlzcGF0Y2guY2FsbCh0aGlzLGEpLGEucmVzdWx0fX0saGFuZGxlcnM6ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGUsZixnPVtdLGg9Yi5kZWxlZ2F0ZUNvdW50LGk9YS50YXJnZXQ7aWYoaCYmaS5ub2RlVHlwZSYmKCFhLmJ1dHRvbnx8XCJjbGlja1wiIT09YS50eXBlKSlmb3IoO2khPT10aGlzO2k9aS5wYXJlbnROb2RlfHx0aGlzKWlmKDE9PT1pLm5vZGVUeXBlJiYoaS5kaXNhYmxlZCE9PSEwfHxcImNsaWNrXCIhPT1hLnR5cGUpKXtmb3IoZD1bXSxjPTA7aD5jO2MrKylmPWJbY10sZT1mLnNlbGVjdG9yK1wiIFwiLHZvaWQgMD09PWRbZV0mJihkW2VdPWYubmVlZHNDb250ZXh0P24oZSx0aGlzKS5pbmRleChpKT4tMTpuLmZpbmQoZSx0aGlzLG51bGwsW2ldKS5sZW5ndGgpLGRbZV0mJmQucHVzaChmKTtkLmxlbmd0aCYmZy5wdXNoKHtlbGVtOmksaGFuZGxlcnM6ZH0pfXJldHVybiBoPGIubGVuZ3RoJiZnLnB1c2goe2VsZW06dGhpcyxoYW5kbGVyczpiLnNsaWNlKGgpfSksZ30scHJvcHM6XCJhbHRLZXkgYnViYmxlcyBjYW5jZWxhYmxlIGN0cmxLZXkgY3VycmVudFRhcmdldCBkZXRhaWwgZXZlbnRQaGFzZSBtZXRhS2V5IHJlbGF0ZWRUYXJnZXQgc2hpZnRLZXkgdGFyZ2V0IHRpbWVTdGFtcCB2aWV3IHdoaWNoXCIuc3BsaXQoXCIgXCIpLGZpeEhvb2tzOnt9LGtleUhvb2tzOntwcm9wczpcImNoYXIgY2hhckNvZGUga2V5IGtleUNvZGVcIi5zcGxpdChcIiBcIiksZmlsdGVyOmZ1bmN0aW9uKGEsYil7cmV0dXJuIG51bGw9PWEud2hpY2gmJihhLndoaWNoPW51bGwhPWIuY2hhckNvZGU/Yi5jaGFyQ29kZTpiLmtleUNvZGUpLGF9fSxtb3VzZUhvb2tzOntwcm9wczpcImJ1dHRvbiBidXR0b25zIGNsaWVudFggY2xpZW50WSBvZmZzZXRYIG9mZnNldFkgcGFnZVggcGFnZVkgc2NyZWVuWCBzY3JlZW5ZIHRvRWxlbWVudFwiLnNwbGl0KFwiIFwiKSxmaWx0ZXI6ZnVuY3Rpb24oYSxiKXt2YXIgYyxlLGYsZz1iLmJ1dHRvbjtyZXR1cm4gbnVsbD09YS5wYWdlWCYmbnVsbCE9Yi5jbGllbnRYJiYoYz1hLnRhcmdldC5vd25lckRvY3VtZW50fHxkLGU9Yy5kb2N1bWVudEVsZW1lbnQsZj1jLmJvZHksYS5wYWdlWD1iLmNsaWVudFgrKGUmJmUuc2Nyb2xsTGVmdHx8ZiYmZi5zY3JvbGxMZWZ0fHwwKS0oZSYmZS5jbGllbnRMZWZ0fHxmJiZmLmNsaWVudExlZnR8fDApLGEucGFnZVk9Yi5jbGllbnRZKyhlJiZlLnNjcm9sbFRvcHx8ZiYmZi5zY3JvbGxUb3B8fDApLShlJiZlLmNsaWVudFRvcHx8ZiYmZi5jbGllbnRUb3B8fDApKSxhLndoaWNofHx2b2lkIDA9PT1nfHwoYS53aGljaD0xJmc/MToyJmc/Mzo0Jmc/MjowKSxhfX0sZml4OmZ1bmN0aW9uKGEpe2lmKGFbbi5leHBhbmRvXSlyZXR1cm4gYTt2YXIgYixjLGQsZT1hLnR5cGUsZj1hLGc9dGhpcy5maXhIb29rc1tlXTtnfHwodGhpcy5maXhIb29rc1tlXT1nPWFhLnRlc3QoZSk/dGhpcy5tb3VzZUhvb2tzOl8udGVzdChlKT90aGlzLmtleUhvb2tzOnt9KSxkPWcucHJvcHM/dGhpcy5wcm9wcy5jb25jYXQoZy5wcm9wcyk6dGhpcy5wcm9wcyxhPW5ldyBuLkV2ZW50KGYpLGI9ZC5sZW5ndGg7d2hpbGUoYi0tKWM9ZFtiXSxhW2NdPWZbY107cmV0dXJuIDM9PT1hLnRhcmdldC5ub2RlVHlwZSYmKGEudGFyZ2V0PWEudGFyZ2V0LnBhcmVudE5vZGUpLGcuZmlsdGVyP2cuZmlsdGVyKGEsZik6YX0sc3BlY2lhbDp7bG9hZDp7bm9CdWJibGU6ITB9LGZvY3VzOnt0cmlnZ2VyOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMhPT1mYSgpJiZ0aGlzLmZvY3VzPyh0aGlzLmZvY3VzKCksITEpOnZvaWQgMH0sZGVsZWdhdGVUeXBlOlwiZm9jdXNpblwifSxibHVyOnt0cmlnZ2VyOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXM9PT1mYSgpJiZ0aGlzLmJsdXI/KHRoaXMuYmx1cigpLCExKTp2b2lkIDB9LGRlbGVnYXRlVHlwZTpcImZvY3Vzb3V0XCJ9LGNsaWNrOnt0cmlnZ2VyOmZ1bmN0aW9uKCl7cmV0dXJuXCJjaGVja2JveFwiPT09dGhpcy50eXBlJiZ0aGlzLmNsaWNrJiZuLm5vZGVOYW1lKHRoaXMsXCJpbnB1dFwiKT8odGhpcy5jbGljaygpLCExKTp2b2lkIDB9LF9kZWZhdWx0OmZ1bmN0aW9uKGEpe3JldHVybiBuLm5vZGVOYW1lKGEudGFyZ2V0LFwiYVwiKX19LGJlZm9yZXVubG9hZDp7cG9zdERpc3BhdGNoOmZ1bmN0aW9uKGEpe3ZvaWQgMCE9PWEucmVzdWx0JiZhLm9yaWdpbmFsRXZlbnQmJihhLm9yaWdpbmFsRXZlbnQucmV0dXJuVmFsdWU9YS5yZXN1bHQpfX19LHNpbXVsYXRlOmZ1bmN0aW9uKGEsYixjKXt2YXIgZD1uLmV4dGVuZChuZXcgbi5FdmVudCxjLHt0eXBlOmEsaXNTaW11bGF0ZWQ6ITB9KTtuLmV2ZW50LnRyaWdnZXIoZCxudWxsLGIpLGQuaXNEZWZhdWx0UHJldmVudGVkKCkmJmMucHJldmVudERlZmF1bHQoKX19LG4ucmVtb3ZlRXZlbnQ9ZnVuY3Rpb24oYSxiLGMpe2EucmVtb3ZlRXZlbnRMaXN0ZW5lciYmYS5yZW1vdmVFdmVudExpc3RlbmVyKGIsYyl9LG4uRXZlbnQ9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcyBpbnN0YW5jZW9mIG4uRXZlbnQ/KGEmJmEudHlwZT8odGhpcy5vcmlnaW5hbEV2ZW50PWEsdGhpcy50eXBlPWEudHlwZSx0aGlzLmlzRGVmYXVsdFByZXZlbnRlZD1hLmRlZmF1bHRQcmV2ZW50ZWR8fHZvaWQgMD09PWEuZGVmYXVsdFByZXZlbnRlZCYmYS5yZXR1cm5WYWx1ZT09PSExP2RhOmVhKTp0aGlzLnR5cGU9YSxiJiZuLmV4dGVuZCh0aGlzLGIpLHRoaXMudGltZVN0YW1wPWEmJmEudGltZVN0YW1wfHxuLm5vdygpLHZvaWQodGhpc1tuLmV4cGFuZG9dPSEwKSk6bmV3IG4uRXZlbnQoYSxiKX0sbi5FdmVudC5wcm90b3R5cGU9e2NvbnN0cnVjdG9yOm4uRXZlbnQsaXNEZWZhdWx0UHJldmVudGVkOmVhLGlzUHJvcGFnYXRpb25TdG9wcGVkOmVhLGlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkOmVhLHByZXZlbnREZWZhdWx0OmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5vcmlnaW5hbEV2ZW50O3RoaXMuaXNEZWZhdWx0UHJldmVudGVkPWRhLGEmJmEucHJldmVudERlZmF1bHQoKX0sc3RvcFByb3BhZ2F0aW9uOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5vcmlnaW5hbEV2ZW50O3RoaXMuaXNQcm9wYWdhdGlvblN0b3BwZWQ9ZGEsYSYmYS5zdG9wUHJvcGFnYXRpb24oKX0sc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5vcmlnaW5hbEV2ZW50O3RoaXMuaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQ9ZGEsYSYmYS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKSx0aGlzLnN0b3BQcm9wYWdhdGlvbigpfX0sbi5lYWNoKHttb3VzZWVudGVyOlwibW91c2VvdmVyXCIsbW91c2VsZWF2ZTpcIm1vdXNlb3V0XCIscG9pbnRlcmVudGVyOlwicG9pbnRlcm92ZXJcIixwb2ludGVybGVhdmU6XCJwb2ludGVyb3V0XCJ9LGZ1bmN0aW9uKGEsYil7bi5ldmVudC5zcGVjaWFsW2FdPXtkZWxlZ2F0ZVR5cGU6YixiaW5kVHlwZTpiLGhhbmRsZTpmdW5jdGlvbihhKXt2YXIgYyxkPXRoaXMsZT1hLnJlbGF0ZWRUYXJnZXQsZj1hLmhhbmRsZU9iajtyZXR1cm4oIWV8fGUhPT1kJiYhbi5jb250YWlucyhkLGUpKSYmKGEudHlwZT1mLm9yaWdUeXBlLGM9Zi5oYW5kbGVyLmFwcGx5KHRoaXMsYXJndW1lbnRzKSxhLnR5cGU9YiksY319fSksbC5mb2N1c2lufHxuLmVhY2goe2ZvY3VzOlwiZm9jdXNpblwiLGJsdXI6XCJmb2N1c291dFwifSxmdW5jdGlvbihhLGIpe3ZhciBjPWZ1bmN0aW9uKGEpe24uZXZlbnQuc2ltdWxhdGUoYixhLnRhcmdldCxuLmV2ZW50LmZpeChhKSl9O24uZXZlbnQuc3BlY2lhbFtiXT17c2V0dXA6ZnVuY3Rpb24oKXt2YXIgZD10aGlzLm93bmVyRG9jdW1lbnR8fHRoaXMsZT1NLmFjY2VzcyhkLGIpO2V8fGQuYWRkRXZlbnRMaXN0ZW5lcihhLGMsITApLE0uYWNjZXNzKGQsYiwoZXx8MCkrMSl9LHRlYXJkb3duOmZ1bmN0aW9uKCl7dmFyIGQ9dGhpcy5vd25lckRvY3VtZW50fHx0aGlzLGU9TS5hY2Nlc3MoZCxiKS0xO2U/TS5hY2Nlc3MoZCxiLGUpOihkLnJlbW92ZUV2ZW50TGlzdGVuZXIoYSxjLCEwKSxNLnJlbW92ZShkLGIpKX19fSksbi5mbi5leHRlbmQoe29uOmZ1bmN0aW9uKGEsYixjLGQpe3JldHVybiBnYSh0aGlzLGEsYixjLGQpfSxvbmU6ZnVuY3Rpb24oYSxiLGMsZCl7cmV0dXJuIGdhKHRoaXMsYSxiLGMsZCwxKX0sb2ZmOmZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlO2lmKGEmJmEucHJldmVudERlZmF1bHQmJmEuaGFuZGxlT2JqKXJldHVybiBkPWEuaGFuZGxlT2JqLG4oYS5kZWxlZ2F0ZVRhcmdldCkub2ZmKGQubmFtZXNwYWNlP2Qub3JpZ1R5cGUrXCIuXCIrZC5uYW1lc3BhY2U6ZC5vcmlnVHlwZSxkLnNlbGVjdG9yLGQuaGFuZGxlciksdGhpcztpZihcIm9iamVjdFwiPT10eXBlb2YgYSl7Zm9yKGUgaW4gYSl0aGlzLm9mZihlLGIsYVtlXSk7cmV0dXJuIHRoaXN9cmV0dXJuKGI9PT0hMXx8XCJmdW5jdGlvblwiPT10eXBlb2YgYikmJihjPWIsYj12b2lkIDApLGM9PT0hMSYmKGM9ZWEpLHRoaXMuZWFjaChmdW5jdGlvbigpe24uZXZlbnQucmVtb3ZlKHRoaXMsYSxjLGIpfSl9LHRyaWdnZXI6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7bi5ldmVudC50cmlnZ2VyKGEsYix0aGlzKX0pfSx0cmlnZ2VySGFuZGxlcjpmdW5jdGlvbihhLGIpe3ZhciBjPXRoaXNbMF07cmV0dXJuIGM/bi5ldmVudC50cmlnZ2VyKGEsYixjLCEwKTp2b2lkIDB9fSk7dmFyIGhhPS88KD8hYXJlYXxicnxjb2x8ZW1iZWR8aHJ8aW1nfGlucHV0fGxpbmt8bWV0YXxwYXJhbSkoKFtcXHc6LV0rKVtePl0qKVxcLz4vZ2ksaWE9LzwoPzpzY3JpcHR8c3R5bGV8bGluaykvaSxqYT0vY2hlY2tlZFxccyooPzpbXj1dfD1cXHMqLmNoZWNrZWQuKS9pLGthPS9edHJ1ZVxcLyguKikvLGxhPS9eXFxzKjwhKD86XFxbQ0RBVEFcXFt8LS0pfCg/OlxcXVxcXXwtLSk+XFxzKiQvZztmdW5jdGlvbiBtYShhLGIpe3JldHVybiBuLm5vZGVOYW1lKGEsXCJ0YWJsZVwiKSYmbi5ub2RlTmFtZSgxMSE9PWIubm9kZVR5cGU/YjpiLmZpcnN0Q2hpbGQsXCJ0clwiKT9hLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGJvZHlcIilbMF18fGE6YX1mdW5jdGlvbiBuYShhKXtyZXR1cm4gYS50eXBlPShudWxsIT09YS5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpKStcIi9cIithLnR5cGUsYX1mdW5jdGlvbiBvYShhKXt2YXIgYj1rYS5leGVjKGEudHlwZSk7cmV0dXJuIGI/YS50eXBlPWJbMV06YS5yZW1vdmVBdHRyaWJ1dGUoXCJ0eXBlXCIpLGF9ZnVuY3Rpb24gcGEoYSxiKXt2YXIgYyxkLGUsZixnLGgsaSxqO2lmKDE9PT1iLm5vZGVUeXBlKXtpZihNLmhhc0RhdGEoYSkmJihmPU0uYWNjZXNzKGEpLGc9TS5zZXQoYixmKSxqPWYuZXZlbnRzKSl7ZGVsZXRlIGcuaGFuZGxlLGcuZXZlbnRzPXt9O2ZvcihlIGluIGopZm9yKGM9MCxkPWpbZV0ubGVuZ3RoO2Q+YztjKyspbi5ldmVudC5hZGQoYixlLGpbZV1bY10pfU4uaGFzRGF0YShhKSYmKGg9Ti5hY2Nlc3MoYSksaT1uLmV4dGVuZCh7fSxoKSxOLnNldChiLGkpKX19ZnVuY3Rpb24gcWEoYSxiKXt2YXIgYz1iLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XCJpbnB1dFwiPT09YyYmVC50ZXN0KGEudHlwZSk/Yi5jaGVja2VkPWEuY2hlY2tlZDooXCJpbnB1dFwiPT09Y3x8XCJ0ZXh0YXJlYVwiPT09YykmJihiLmRlZmF1bHRWYWx1ZT1hLmRlZmF1bHRWYWx1ZSl9ZnVuY3Rpb24gcmEoYSxiLGMsZCl7Yj1mLmFwcGx5KFtdLGIpO3ZhciBlLGcsaCxpLGosayxtPTAsbz1hLmxlbmd0aCxwPW8tMSxxPWJbMF0scj1uLmlzRnVuY3Rpb24ocSk7aWYocnx8bz4xJiZcInN0cmluZ1wiPT10eXBlb2YgcSYmIWwuY2hlY2tDbG9uZSYmamEudGVzdChxKSlyZXR1cm4gYS5lYWNoKGZ1bmN0aW9uKGUpe3ZhciBmPWEuZXEoZSk7ciYmKGJbMF09cS5jYWxsKHRoaXMsZSxmLmh0bWwoKSkpLHJhKGYsYixjLGQpfSk7aWYobyYmKGU9JChiLGFbMF0ub3duZXJEb2N1bWVudCwhMSxhLGQpLGc9ZS5maXJzdENoaWxkLDE9PT1lLmNoaWxkTm9kZXMubGVuZ3RoJiYoZT1nKSxnfHxkKSl7Zm9yKGg9bi5tYXAoWChlLFwic2NyaXB0XCIpLG5hKSxpPWgubGVuZ3RoO28+bTttKyspaj1lLG0hPT1wJiYoaj1uLmNsb25lKGosITAsITApLGkmJm4ubWVyZ2UoaCxYKGosXCJzY3JpcHRcIikpKSxjLmNhbGwoYVttXSxqLG0pO2lmKGkpZm9yKGs9aFtoLmxlbmd0aC0xXS5vd25lckRvY3VtZW50LG4ubWFwKGgsb2EpLG09MDtpPm07bSsrKWo9aFttXSxWLnRlc3Qoai50eXBlfHxcIlwiKSYmIU0uYWNjZXNzKGosXCJnbG9iYWxFdmFsXCIpJiZuLmNvbnRhaW5zKGssaikmJihqLnNyYz9uLl9ldmFsVXJsJiZuLl9ldmFsVXJsKGouc3JjKTpuLmdsb2JhbEV2YWwoai50ZXh0Q29udGVudC5yZXBsYWNlKGxhLFwiXCIpKSl9cmV0dXJuIGF9ZnVuY3Rpb24gc2EoYSxiLGMpe2Zvcih2YXIgZCxlPWI/bi5maWx0ZXIoYixhKTphLGY9MDtudWxsIT0oZD1lW2ZdKTtmKyspY3x8MSE9PWQubm9kZVR5cGV8fG4uY2xlYW5EYXRhKFgoZCkpLGQucGFyZW50Tm9kZSYmKGMmJm4uY29udGFpbnMoZC5vd25lckRvY3VtZW50LGQpJiZZKFgoZCxcInNjcmlwdFwiKSksZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpKTtyZXR1cm4gYX1uLmV4dGVuZCh7aHRtbFByZWZpbHRlcjpmdW5jdGlvbihhKXtyZXR1cm4gYS5yZXBsYWNlKGhhLFwiPCQxPjwvJDI+XCIpfSxjbG9uZTpmdW5jdGlvbihhLGIsYyl7dmFyIGQsZSxmLGcsaD1hLmNsb25lTm9kZSghMCksaT1uLmNvbnRhaW5zKGEub3duZXJEb2N1bWVudCxhKTtpZighKGwubm9DbG9uZUNoZWNrZWR8fDEhPT1hLm5vZGVUeXBlJiYxMSE9PWEubm9kZVR5cGV8fG4uaXNYTUxEb2MoYSkpKWZvcihnPVgoaCksZj1YKGEpLGQ9MCxlPWYubGVuZ3RoO2U+ZDtkKyspcWEoZltkXSxnW2RdKTtpZihiKWlmKGMpZm9yKGY9Znx8WChhKSxnPWd8fFgoaCksZD0wLGU9Zi5sZW5ndGg7ZT5kO2QrKylwYShmW2RdLGdbZF0pO2Vsc2UgcGEoYSxoKTtyZXR1cm4gZz1YKGgsXCJzY3JpcHRcIiksZy5sZW5ndGg+MCYmWShnLCFpJiZYKGEsXCJzY3JpcHRcIikpLGh9LGNsZWFuRGF0YTpmdW5jdGlvbihhKXtmb3IodmFyIGIsYyxkLGU9bi5ldmVudC5zcGVjaWFsLGY9MDt2b2lkIDAhPT0oYz1hW2ZdKTtmKyspaWYobi5hY2NlcHREYXRhKGMpKXtpZihiPWNbTS5leHBhbmRvXSl7aWYoYi5ldmVudHMpZm9yKGQgaW4gYi5ldmVudHMpZVtkXT9uLmV2ZW50LnJlbW92ZShjLGQpOm4ucmVtb3ZlRXZlbnQoYyxkLGIuaGFuZGxlKTtkZWxldGUgY1tNLmV4cGFuZG9dfWNbTi5leHBhbmRvXSYmZGVsZXRlIGNbTi5leHBhbmRvXX19fSksbi5mbi5leHRlbmQoe2RldGFjaDpmdW5jdGlvbihhKXtyZXR1cm4gc2EodGhpcyxhLCEwKX0scmVtb3ZlOmZ1bmN0aW9uKGEpe3JldHVybiBzYSh0aGlzLGEpfSx0ZXh0OmZ1bmN0aW9uKGEpe3JldHVybiBLKHRoaXMsZnVuY3Rpb24oYSl7cmV0dXJuIHZvaWQgMD09PWE/bi50ZXh0KHRoaXMpOnRoaXMuZW1wdHkoKS5lYWNoKGZ1bmN0aW9uKCl7KDE9PT10aGlzLm5vZGVUeXBlfHwxMT09PXRoaXMubm9kZVR5cGV8fDk9PT10aGlzLm5vZGVUeXBlKSYmKHRoaXMudGV4dENvbnRlbnQ9YSl9KX0sbnVsbCxhLGFyZ3VtZW50cy5sZW5ndGgpfSxhcHBlbmQ6ZnVuY3Rpb24oKXtyZXR1cm4gcmEodGhpcyxhcmd1bWVudHMsZnVuY3Rpb24oYSl7aWYoMT09PXRoaXMubm9kZVR5cGV8fDExPT09dGhpcy5ub2RlVHlwZXx8OT09PXRoaXMubm9kZVR5cGUpe3ZhciBiPW1hKHRoaXMsYSk7Yi5hcHBlbmRDaGlsZChhKX19KX0scHJlcGVuZDpmdW5jdGlvbigpe3JldHVybiByYSh0aGlzLGFyZ3VtZW50cyxmdW5jdGlvbihhKXtpZigxPT09dGhpcy5ub2RlVHlwZXx8MTE9PT10aGlzLm5vZGVUeXBlfHw5PT09dGhpcy5ub2RlVHlwZSl7dmFyIGI9bWEodGhpcyxhKTtiLmluc2VydEJlZm9yZShhLGIuZmlyc3RDaGlsZCl9fSl9LGJlZm9yZTpmdW5jdGlvbigpe3JldHVybiByYSh0aGlzLGFyZ3VtZW50cyxmdW5jdGlvbihhKXt0aGlzLnBhcmVudE5vZGUmJnRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYSx0aGlzKX0pfSxhZnRlcjpmdW5jdGlvbigpe3JldHVybiByYSh0aGlzLGFyZ3VtZW50cyxmdW5jdGlvbihhKXt0aGlzLnBhcmVudE5vZGUmJnRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoYSx0aGlzLm5leHRTaWJsaW5nKX0pfSxlbXB0eTpmdW5jdGlvbigpe2Zvcih2YXIgYSxiPTA7bnVsbCE9KGE9dGhpc1tiXSk7YisrKTE9PT1hLm5vZGVUeXBlJiYobi5jbGVhbkRhdGEoWChhLCExKSksYS50ZXh0Q29udGVudD1cIlwiKTtyZXR1cm4gdGhpc30sY2xvbmU6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYT1udWxsPT1hPyExOmEsYj1udWxsPT1iP2E6Yix0aGlzLm1hcChmdW5jdGlvbigpe3JldHVybiBuLmNsb25lKHRoaXMsYSxiKX0pfSxodG1sOmZ1bmN0aW9uKGEpe3JldHVybiBLKHRoaXMsZnVuY3Rpb24oYSl7dmFyIGI9dGhpc1swXXx8e30sYz0wLGQ9dGhpcy5sZW5ndGg7aWYodm9pZCAwPT09YSYmMT09PWIubm9kZVR5cGUpcmV0dXJuIGIuaW5uZXJIVE1MO2lmKFwic3RyaW5nXCI9PXR5cGVvZiBhJiYhaWEudGVzdChhKSYmIVdbKFUuZXhlYyhhKXx8W1wiXCIsXCJcIl0pWzFdLnRvTG93ZXJDYXNlKCldKXthPW4uaHRtbFByZWZpbHRlcihhKTt0cnl7Zm9yKDtkPmM7YysrKWI9dGhpc1tjXXx8e30sMT09PWIubm9kZVR5cGUmJihuLmNsZWFuRGF0YShYKGIsITEpKSxiLmlubmVySFRNTD1hKTtiPTB9Y2F0Y2goZSl7fX1iJiZ0aGlzLmVtcHR5KCkuYXBwZW5kKGEpfSxudWxsLGEsYXJndW1lbnRzLmxlbmd0aCl9LHJlcGxhY2VXaXRoOmZ1bmN0aW9uKCl7dmFyIGE9W107cmV0dXJuIHJhKHRoaXMsYXJndW1lbnRzLGZ1bmN0aW9uKGIpe3ZhciBjPXRoaXMucGFyZW50Tm9kZTtuLmluQXJyYXkodGhpcyxhKTwwJiYobi5jbGVhbkRhdGEoWCh0aGlzKSksYyYmYy5yZXBsYWNlQ2hpbGQoYix0aGlzKSl9LGEpfX0pLG4uZWFjaCh7YXBwZW5kVG86XCJhcHBlbmRcIixwcmVwZW5kVG86XCJwcmVwZW5kXCIsaW5zZXJ0QmVmb3JlOlwiYmVmb3JlXCIsaW5zZXJ0QWZ0ZXI6XCJhZnRlclwiLHJlcGxhY2VBbGw6XCJyZXBsYWNlV2l0aFwifSxmdW5jdGlvbihhLGIpe24uZm5bYV09ZnVuY3Rpb24oYSl7Zm9yKHZhciBjLGQ9W10sZT1uKGEpLGY9ZS5sZW5ndGgtMSxoPTA7Zj49aDtoKyspYz1oPT09Zj90aGlzOnRoaXMuY2xvbmUoITApLG4oZVtoXSlbYl0oYyksZy5hcHBseShkLGMuZ2V0KCkpO3JldHVybiB0aGlzLnB1c2hTdGFjayhkKX19KTt2YXIgdGE9ZC5kb2N1bWVudEVsZW1lbnQ7bi5mbi5kZWxheT1mdW5jdGlvbihiLGMpe3JldHVybiBiPW4uZng/bi5meC5zcGVlZHNbYl18fGI6YixjPWN8fFwiZnhcIix0aGlzLnF1ZXVlKGMsZnVuY3Rpb24oYyxkKXt2YXIgZT1hLnNldFRpbWVvdXQoYyxiKTtkLnN0b3A9ZnVuY3Rpb24oKXthLmNsZWFyVGltZW91dChlKX19KX0sZnVuY3Rpb24oKXt2YXIgYT1kLmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKSxiPWQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKSxjPWIuYXBwZW5kQ2hpbGQoZC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpKTthLnR5cGU9XCJjaGVja2JveFwiLGwuY2hlY2tPbj1cIlwiIT09YS52YWx1ZSxsLm9wdFNlbGVjdGVkPWMuc2VsZWN0ZWQsYi5kaXNhYmxlZD0hMCxsLm9wdERpc2FibGVkPSFjLmRpc2FibGVkLGE9ZC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiksYS52YWx1ZT1cInRcIixhLnR5cGU9XCJyYWRpb1wiLGwucmFkaW9WYWx1ZT1cInRcIj09PWEudmFsdWV9KCk7dmFyIHVhLHZhPW4uZXhwci5hdHRySGFuZGxlO24uZm4uZXh0ZW5kKHthdHRyOmZ1bmN0aW9uKGEsYil7cmV0dXJuIEsodGhpcyxuLmF0dHIsYSxiLGFyZ3VtZW50cy5sZW5ndGg+MSl9LHJlbW92ZUF0dHI6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe24ucmVtb3ZlQXR0cih0aGlzLGEpfSl9fSksbi5leHRlbmQoe2F0dHI6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkLGUsZj1hLm5vZGVUeXBlO2lmKDMhPT1mJiY4IT09ZiYmMiE9PWYpcmV0dXJuXCJ1bmRlZmluZWRcIj09dHlwZW9mIGEuZ2V0QXR0cmlidXRlP24ucHJvcChhLGIsYyk6KDE9PT1mJiZuLmlzWE1MRG9jKGEpfHwoYj1iLnRvTG93ZXJDYXNlKCksZT1uLmF0dHJIb29rc1tiXXx8KG4uZXhwci5tYXRjaC5ib29sLnRlc3QoYik/dWE6dm9pZCAwKSksdm9pZCAwIT09Yz9udWxsPT09Yz92b2lkIG4ucmVtb3ZlQXR0cihhLGIpOmUmJlwic2V0XCJpbiBlJiZ2b2lkIDAhPT0oZD1lLnNldChhLGMsYikpP2Q6KGEuc2V0QXR0cmlidXRlKGIsYytcIlwiKSxjKTplJiZcImdldFwiaW4gZSYmbnVsbCE9PShkPWUuZ2V0KGEsYikpP2Q6KGQ9bi5maW5kLmF0dHIoYSxiKSxudWxsPT1kP3ZvaWQgMDpkKSl9LGF0dHJIb29rczp7dHlwZTp7c2V0OmZ1bmN0aW9uKGEsYil7aWYoIWwucmFkaW9WYWx1ZSYmXCJyYWRpb1wiPT09YiYmbi5ub2RlTmFtZShhLFwiaW5wdXRcIikpe3ZhciBjPWEudmFsdWU7cmV0dXJuIGEuc2V0QXR0cmlidXRlKFwidHlwZVwiLGIpLGMmJihhLnZhbHVlPWMpLGJ9fX19LHJlbW92ZUF0dHI6ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGU9MCxmPWImJmIubWF0Y2goRSk7aWYoZiYmMT09PWEubm9kZVR5cGUpd2hpbGUoYz1mW2UrK10pZD1uLnByb3BGaXhbY118fGMsbi5leHByLm1hdGNoLmJvb2wudGVzdChjKSYmKGFbZF09ITEpLGEucmVtb3ZlQXR0cmlidXRlKGMpfX0pLHVhPXtzZXQ6ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBiPT09ITE/bi5yZW1vdmVBdHRyKGEsYyk6YS5zZXRBdHRyaWJ1dGUoYyxjKSxjfX0sbi5lYWNoKG4uZXhwci5tYXRjaC5ib29sLnNvdXJjZS5tYXRjaCgvXFx3Ky9nKSxmdW5jdGlvbihhLGIpe3ZhciBjPXZhW2JdfHxuLmZpbmQuYXR0cjt2YVtiXT1mdW5jdGlvbihhLGIsZCl7dmFyIGUsZjtyZXR1cm4gZHx8KGY9dmFbYl0sdmFbYl09ZSxlPW51bGwhPWMoYSxiLGQpP2IudG9Mb3dlckNhc2UoKTpudWxsLHZhW2JdPWYpLGV9fSk7dmFyIHdhPS9eKD86aW5wdXR8c2VsZWN0fHRleHRhcmVhfGJ1dHRvbikkL2k7bi5mbi5leHRlbmQoe3Byb3A6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gSyh0aGlzLG4ucHJvcCxhLGIsYXJndW1lbnRzLmxlbmd0aD4xKX0scmVtb3ZlUHJvcDpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7ZGVsZXRlIHRoaXNbbi5wcm9wRml4W2FdfHxhXX0pfX0pLG4uZXh0ZW5kKHtwcm9wOmZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlLGY9YS5ub2RlVHlwZTtpZigzIT09ZiYmOCE9PWYmJjIhPT1mKXJldHVybiAxPT09ZiYmbi5pc1hNTERvYyhhKXx8KGI9bi5wcm9wRml4W2JdfHxiLGU9bi5wcm9wSG9va3NbYl0pLHZvaWQgMCE9PWM/ZSYmXCJzZXRcImluIGUmJnZvaWQgMCE9PShkPWUuc2V0KGEsYyxiKSk/ZDphW2JdPWM6ZSYmXCJnZXRcImluIGUmJm51bGwhPT0oZD1lLmdldChhLGIpKT9kOmFbYl19LHByb3BIb29rczp7dGFiSW5kZXg6e2dldDpmdW5jdGlvbihhKXtyZXR1cm4gYS5oYXNBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiKXx8d2EudGVzdChhLm5vZGVOYW1lKXx8YS5ocmVmP2EudGFiSW5kZXg6LTF9fX0scHJvcEZpeDp7XCJmb3JcIjpcImh0bWxGb3JcIixcImNsYXNzXCI6XCJjbGFzc05hbWVcIn19KSxsLm9wdFNlbGVjdGVkfHwobi5wcm9wSG9va3Muc2VsZWN0ZWQ9e2dldDpmdW5jdGlvbihhKXt2YXIgYj1hLnBhcmVudE5vZGU7cmV0dXJuIGImJmIucGFyZW50Tm9kZSYmYi5wYXJlbnROb2RlLnNlbGVjdGVkSW5kZXgsbnVsbH19KSxuLmVhY2goW1widGFiSW5kZXhcIixcInJlYWRPbmx5XCIsXCJtYXhMZW5ndGhcIixcImNlbGxTcGFjaW5nXCIsXCJjZWxsUGFkZGluZ1wiLFwicm93U3BhblwiLFwiY29sU3BhblwiLFwidXNlTWFwXCIsXCJmcmFtZUJvcmRlclwiLFwiY29udGVudEVkaXRhYmxlXCJdLGZ1bmN0aW9uKCl7bi5wcm9wRml4W3RoaXMudG9Mb3dlckNhc2UoKV09dGhpc30pO3ZhciB4YT0vW1xcdFxcclxcblxcZl0vZztmdW5jdGlvbiB5YShhKXtyZXR1cm4gYS5nZXRBdHRyaWJ1dGUmJmEuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIil8fFwiXCJ9bi5mbi5leHRlbmQoe2FkZENsYXNzOmZ1bmN0aW9uKGEpe3ZhciBiLGMsZCxlLGYsZyxoLGk9XCJzdHJpbmdcIj09dHlwZW9mIGEmJmEsaj0wLGs9dGhpcy5sZW5ndGg7aWYobi5pc0Z1bmN0aW9uKGEpKXJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oYil7bih0aGlzKS5hZGRDbGFzcyhhLmNhbGwodGhpcyxiLHlhKHRoaXMpKSl9KTtpZihpKWZvcihiPShhfHxcIlwiKS5tYXRjaChFKXx8W107az5qO2orKylpZihjPXRoaXNbal0sZT15YShjKSxkPTE9PT1jLm5vZGVUeXBlJiYoXCIgXCIrZStcIiBcIikucmVwbGFjZSh4YSxcIiBcIikpe2c9MDt3aGlsZShmPWJbZysrXSlkLmluZGV4T2YoXCIgXCIrZitcIiBcIik8MCYmKGQrPWYrXCIgXCIpO2g9bi50cmltKGQpLGUhPT1oJiZjLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsaCl9cmV0dXJuIHRoaXN9LHJlbW92ZUNsYXNzOmZ1bmN0aW9uKGEpe3ZhciBiLGMsZCxlLGYsZyxoLGk9MD09PWFyZ3VtZW50cy5sZW5ndGh8fFwic3RyaW5nXCI9PXR5cGVvZiBhJiZhLGo9MCxrPXRoaXMubGVuZ3RoO2lmKG4uaXNGdW5jdGlvbihhKSlyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGIpe24odGhpcykucmVtb3ZlQ2xhc3MoYS5jYWxsKHRoaXMsYix5YSh0aGlzKSkpfSk7aWYoaSlmb3IoYj0oYXx8XCJcIikubWF0Y2goRSl8fFtdO2s+ajtqKyspaWYoYz10aGlzW2pdLGU9eWEoYyksZD0xPT09Yy5ub2RlVHlwZSYmKFwiIFwiK2UrXCIgXCIpLnJlcGxhY2UoeGEsXCIgXCIpKXtnPTA7d2hpbGUoZj1iW2crK10pd2hpbGUoZC5pbmRleE9mKFwiIFwiK2YrXCIgXCIpPi0xKWQ9ZC5yZXBsYWNlKFwiIFwiK2YrXCIgXCIsXCIgXCIpO2g9YT9uLnRyaW0oZCk6XCJcIixlIT09aCYmYy5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLGgpfXJldHVybiB0aGlzfSx0b2dnbGVDbGFzczpmdW5jdGlvbihhLGIpe3ZhciBjPXR5cGVvZiBhO3JldHVyblwiYm9vbGVhblwiPT10eXBlb2YgYiYmXCJzdHJpbmdcIj09PWM/Yj90aGlzLmFkZENsYXNzKGEpOnRoaXMucmVtb3ZlQ2xhc3MoYSk6bi5pc0Z1bmN0aW9uKGEpP3RoaXMuZWFjaChmdW5jdGlvbihjKXtuKHRoaXMpLnRvZ2dsZUNsYXNzKGEuY2FsbCh0aGlzLGMseWEodGhpcyksYiksYil9KTp0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgYixkLGUsZjtpZihcInN0cmluZ1wiPT09Yyl7ZD0wLGU9bih0aGlzKSxmPWEubWF0Y2goRSl8fFtdO3doaWxlKGI9ZltkKytdKWUuaGFzQ2xhc3MoYik/ZS5yZW1vdmVDbGFzcyhiKTplLmFkZENsYXNzKGIpfWVsc2Uodm9pZCAwPT09YXx8XCJib29sZWFuXCI9PT1jKSYmKGI9eWEodGhpcyksYiYmTS5zZXQodGhpcyxcIl9fY2xhc3NOYW1lX19cIixiKSx0aGlzLnNldEF0dHJpYnV0ZSYmdGhpcy5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLGJ8fGE9PT0hMT9cIlwiOk0uZ2V0KHRoaXMsXCJfX2NsYXNzTmFtZV9fXCIpfHxcIlwiKSl9KX0saGFzQ2xhc3M6ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPVwiIFwiK2ErXCIgXCIsYz0wLGQ9dGhpcy5sZW5ndGg7ZD5jO2MrKylpZigxPT09dGhpc1tjXS5ub2RlVHlwZSYmKFwiIFwiK3lhKHRoaXNbY10pK1wiIFwiKS5yZXBsYWNlKHhhLFwiIFwiKS5pbmRleE9mKGIpPi0xKXJldHVybiEwO3JldHVybiExfX0pO3ZhciB6YT0vXFxyL2c7bi5mbi5leHRlbmQoe3ZhbDpmdW5jdGlvbihhKXt2YXIgYixjLGQsZT10aGlzWzBdO3tpZihhcmd1bWVudHMubGVuZ3RoKXJldHVybiBkPW4uaXNGdW5jdGlvbihhKSx0aGlzLmVhY2goZnVuY3Rpb24oYyl7dmFyIGU7MT09PXRoaXMubm9kZVR5cGUmJihlPWQ/YS5jYWxsKHRoaXMsYyxuKHRoaXMpLnZhbCgpKTphLG51bGw9PWU/ZT1cIlwiOlwibnVtYmVyXCI9PXR5cGVvZiBlP2UrPVwiXCI6bi5pc0FycmF5KGUpJiYoZT1uLm1hcChlLGZ1bmN0aW9uKGEpe3JldHVybiBudWxsPT1hP1wiXCI6YStcIlwifSkpLGI9bi52YWxIb29rc1t0aGlzLnR5cGVdfHxuLnZhbEhvb2tzW3RoaXMubm9kZU5hbWUudG9Mb3dlckNhc2UoKV0sYiYmXCJzZXRcImluIGImJnZvaWQgMCE9PWIuc2V0KHRoaXMsZSxcInZhbHVlXCIpfHwodGhpcy52YWx1ZT1lKSl9KTtpZihlKXJldHVybiBiPW4udmFsSG9va3NbZS50eXBlXXx8bi52YWxIb29rc1tlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCldLGImJlwiZ2V0XCJpbiBiJiZ2b2lkIDAhPT0oYz1iLmdldChlLFwidmFsdWVcIikpP2M6KGM9ZS52YWx1ZSxcInN0cmluZ1wiPT10eXBlb2YgYz9jLnJlcGxhY2UoemEsXCJcIik6bnVsbD09Yz9cIlwiOmMpfX19KSxuLmV4dGVuZCh7dmFsSG9va3M6e29wdGlvbjp7Z2V0OmZ1bmN0aW9uKGEpe3JldHVybiBuLnRyaW0oYS52YWx1ZSl9fSxzZWxlY3Q6e2dldDpmdW5jdGlvbihhKXtmb3IodmFyIGIsYyxkPWEub3B0aW9ucyxlPWEuc2VsZWN0ZWRJbmRleCxmPVwic2VsZWN0LW9uZVwiPT09YS50eXBlfHwwPmUsZz1mP251bGw6W10saD1mP2UrMTpkLmxlbmd0aCxpPTA+ZT9oOmY/ZTowO2g+aTtpKyspaWYoYz1kW2ldLChjLnNlbGVjdGVkfHxpPT09ZSkmJihsLm9wdERpc2FibGVkPyFjLmRpc2FibGVkOm51bGw9PT1jLmdldEF0dHJpYnV0ZShcImRpc2FibGVkXCIpKSYmKCFjLnBhcmVudE5vZGUuZGlzYWJsZWR8fCFuLm5vZGVOYW1lKGMucGFyZW50Tm9kZSxcIm9wdGdyb3VwXCIpKSl7aWYoYj1uKGMpLnZhbCgpLGYpcmV0dXJuIGI7Zy5wdXNoKGIpfXJldHVybiBnfSxzZXQ6ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGU9YS5vcHRpb25zLGY9bi5tYWtlQXJyYXkoYiksZz1lLmxlbmd0aDt3aGlsZShnLS0pZD1lW2ddLChkLnNlbGVjdGVkPW4uaW5BcnJheShuLnZhbEhvb2tzLm9wdGlvbi5nZXQoZCksZik+LTEpJiYoYz0hMCk7cmV0dXJuIGN8fChhLnNlbGVjdGVkSW5kZXg9LTEpLGZ9fX19KSxuLmVhY2goW1wicmFkaW9cIixcImNoZWNrYm94XCJdLGZ1bmN0aW9uKCl7bi52YWxIb29rc1t0aGlzXT17c2V0OmZ1bmN0aW9uKGEsYil7cmV0dXJuIG4uaXNBcnJheShiKT9hLmNoZWNrZWQ9bi5pbkFycmF5KG4oYSkudmFsKCksYik+LTE6dm9pZCAwfX0sbC5jaGVja09ufHwobi52YWxIb29rc1t0aGlzXS5nZXQ9ZnVuY3Rpb24oYSl7cmV0dXJuIG51bGw9PT1hLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpP1wib25cIjphLnZhbHVlfSl9KTt2YXIgQWE9YS5sb2NhdGlvbixCYT1uLm5vdygpLENhPS9cXD8vO24ucGFyc2VKU09OPWZ1bmN0aW9uKGEpe3JldHVybiBKU09OLnBhcnNlKGErXCJcIil9LG4ucGFyc2VYTUw9ZnVuY3Rpb24oYil7dmFyIGM7aWYoIWJ8fFwic3RyaW5nXCIhPXR5cGVvZiBiKXJldHVybiBudWxsO3RyeXtjPShuZXcgYS5ET01QYXJzZXIpLnBhcnNlRnJvbVN0cmluZyhiLFwidGV4dC94bWxcIil9Y2F0Y2goZCl7Yz12b2lkIDB9cmV0dXJuKCFjfHxjLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwicGFyc2VyZXJyb3JcIikubGVuZ3RoKSYmbi5lcnJvcihcIkludmFsaWQgWE1MOiBcIitiKSxjfTt2YXIgRGE9LyMuKiQvLEVhPS8oWz8mXSlfPVteJl0qLyxGYT0vXiguKj8pOlsgXFx0XSooW15cXHJcXG5dKikkL2dtLEdhPS9eKD86YWJvdXR8YXBwfGFwcC1zdG9yYWdlfC4rLWV4dGVuc2lvbnxmaWxlfHJlc3x3aWRnZXQpOiQvLEhhPS9eKD86R0VUfEhFQUQpJC8sSWE9L15cXC9cXC8vLEphPXt9LEthPXt9LExhPVwiKi9cIi5jb25jYXQoXCIqXCIpLE1hPWQuY3JlYXRlRWxlbWVudChcImFcIik7TWEuaHJlZj1BYS5ocmVmO2Z1bmN0aW9uIE5hKGEpe3JldHVybiBmdW5jdGlvbihiLGMpe1wic3RyaW5nXCIhPXR5cGVvZiBiJiYoYz1iLGI9XCIqXCIpO3ZhciBkLGU9MCxmPWIudG9Mb3dlckNhc2UoKS5tYXRjaChFKXx8W107aWYobi5pc0Z1bmN0aW9uKGMpKXdoaWxlKGQ9ZltlKytdKVwiK1wiPT09ZFswXT8oZD1kLnNsaWNlKDEpfHxcIipcIiwoYVtkXT1hW2RdfHxbXSkudW5zaGlmdChjKSk6KGFbZF09YVtkXXx8W10pLnB1c2goYyl9fWZ1bmN0aW9uIE9hKGEsYixjLGQpe3ZhciBlPXt9LGY9YT09PUthO2Z1bmN0aW9uIGcoaCl7dmFyIGk7cmV0dXJuIGVbaF09ITAsbi5lYWNoKGFbaF18fFtdLGZ1bmN0aW9uKGEsaCl7dmFyIGo9aChiLGMsZCk7cmV0dXJuXCJzdHJpbmdcIiE9dHlwZW9mIGp8fGZ8fGVbal0/Zj8hKGk9aik6dm9pZCAwOihiLmRhdGFUeXBlcy51bnNoaWZ0KGopLGcoaiksITEpfSksaX1yZXR1cm4gZyhiLmRhdGFUeXBlc1swXSl8fCFlW1wiKlwiXSYmZyhcIipcIil9ZnVuY3Rpb24gUGEoYSxiKXt2YXIgYyxkLGU9bi5hamF4U2V0dGluZ3MuZmxhdE9wdGlvbnN8fHt9O2ZvcihjIGluIGIpdm9pZCAwIT09YltjXSYmKChlW2NdP2E6ZHx8KGQ9e30pKVtjXT1iW2NdKTtyZXR1cm4gZCYmbi5leHRlbmQoITAsYSxkKSxhfWZ1bmN0aW9uIFFhKGEsYixjKXt2YXIgZCxlLGYsZyxoPWEuY29udGVudHMsaT1hLmRhdGFUeXBlczt3aGlsZShcIipcIj09PWlbMF0paS5zaGlmdCgpLHZvaWQgMD09PWQmJihkPWEubWltZVR5cGV8fGIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIikpO2lmKGQpZm9yKGUgaW4gaClpZihoW2VdJiZoW2VdLnRlc3QoZCkpe2kudW5zaGlmdChlKTticmVha31pZihpWzBdaW4gYylmPWlbMF07ZWxzZXtmb3IoZSBpbiBjKXtpZighaVswXXx8YS5jb252ZXJ0ZXJzW2UrXCIgXCIraVswXV0pe2Y9ZTticmVha31nfHwoZz1lKX1mPWZ8fGd9cmV0dXJuIGY/KGYhPT1pWzBdJiZpLnVuc2hpZnQoZiksY1tmXSk6dm9pZCAwfWZ1bmN0aW9uIFJhKGEsYixjLGQpe3ZhciBlLGYsZyxoLGksaj17fSxrPWEuZGF0YVR5cGVzLnNsaWNlKCk7aWYoa1sxXSlmb3IoZyBpbiBhLmNvbnZlcnRlcnMpaltnLnRvTG93ZXJDYXNlKCldPWEuY29udmVydGVyc1tnXTtmPWsuc2hpZnQoKTt3aGlsZShmKWlmKGEucmVzcG9uc2VGaWVsZHNbZl0mJihjW2EucmVzcG9uc2VGaWVsZHNbZl1dPWIpLCFpJiZkJiZhLmRhdGFGaWx0ZXImJihiPWEuZGF0YUZpbHRlcihiLGEuZGF0YVR5cGUpKSxpPWYsZj1rLnNoaWZ0KCkpaWYoXCIqXCI9PT1mKWY9aTtlbHNlIGlmKFwiKlwiIT09aSYmaSE9PWYpe2lmKGc9altpK1wiIFwiK2ZdfHxqW1wiKiBcIitmXSwhZylmb3IoZSBpbiBqKWlmKGg9ZS5zcGxpdChcIiBcIiksaFsxXT09PWYmJihnPWpbaStcIiBcIitoWzBdXXx8altcIiogXCIraFswXV0pKXtnPT09ITA/Zz1qW2VdOmpbZV0hPT0hMCYmKGY9aFswXSxrLnVuc2hpZnQoaFsxXSkpO2JyZWFrfWlmKGchPT0hMClpZihnJiZhW1widGhyb3dzXCJdKWI9ZyhiKTtlbHNlIHRyeXtiPWcoYil9Y2F0Y2gobCl7cmV0dXJue3N0YXRlOlwicGFyc2VyZXJyb3JcIixlcnJvcjpnP2w6XCJObyBjb252ZXJzaW9uIGZyb20gXCIraStcIiB0byBcIitmfX19cmV0dXJue3N0YXRlOlwic3VjY2Vzc1wiLGRhdGE6Yn19bi5leHRlbmQoe2FjdGl2ZTowLGxhc3RNb2RpZmllZDp7fSxldGFnOnt9LGFqYXhTZXR0aW5nczp7dXJsOkFhLmhyZWYsdHlwZTpcIkdFVFwiLGlzTG9jYWw6R2EudGVzdChBYS5wcm90b2NvbCksZ2xvYmFsOiEwLHByb2Nlc3NEYXRhOiEwLGFzeW5jOiEwLGNvbnRlbnRUeXBlOlwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04XCIsYWNjZXB0czp7XCIqXCI6TGEsdGV4dDpcInRleHQvcGxhaW5cIixodG1sOlwidGV4dC9odG1sXCIseG1sOlwiYXBwbGljYXRpb24veG1sLCB0ZXh0L3htbFwiLGpzb246XCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L2phdmFzY3JpcHRcIn0sY29udGVudHM6e3htbDoveG1sLyxodG1sOi9odG1sLyxqc29uOi9qc29uL30scmVzcG9uc2VGaWVsZHM6e3htbDpcInJlc3BvbnNlWE1MXCIsdGV4dDpcInJlc3BvbnNlVGV4dFwiLGpzb246XCJyZXNwb25zZUpTT05cIn0sY29udmVydGVyczp7XCIqIHRleHRcIjpTdHJpbmcsXCJ0ZXh0IGh0bWxcIjohMCxcInRleHQganNvblwiOm4ucGFyc2VKU09OLFwidGV4dCB4bWxcIjpuLnBhcnNlWE1MfSxmbGF0T3B0aW9uczp7dXJsOiEwLGNvbnRleHQ6ITB9fSxhamF4U2V0dXA6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYj9QYShQYShhLG4uYWpheFNldHRpbmdzKSxiKTpQYShuLmFqYXhTZXR0aW5ncyxhKX0sYWpheFByZWZpbHRlcjpOYShKYSksYWpheFRyYW5zcG9ydDpOYShLYSksYWpheDpmdW5jdGlvbihiLGMpe1wib2JqZWN0XCI9PXR5cGVvZiBiJiYoYz1iLGI9dm9pZCAwKSxjPWN8fHt9O3ZhciBlLGYsZyxoLGksaixrLGwsbT1uLmFqYXhTZXR1cCh7fSxjKSxvPW0uY29udGV4dHx8bSxwPW0uY29udGV4dCYmKG8ubm9kZVR5cGV8fG8uanF1ZXJ5KT9uKG8pOm4uZXZlbnQscT1uLkRlZmVycmVkKCkscj1uLkNhbGxiYWNrcyhcIm9uY2UgbWVtb3J5XCIpLHM9bS5zdGF0dXNDb2RlfHx7fSx0PXt9LHU9e30sdj0wLHc9XCJjYW5jZWxlZFwiLHg9e3JlYWR5U3RhdGU6MCxnZXRSZXNwb25zZUhlYWRlcjpmdW5jdGlvbihhKXt2YXIgYjtpZigyPT09dil7aWYoIWgpe2g9e307d2hpbGUoYj1GYS5leGVjKGcpKWhbYlsxXS50b0xvd2VyQ2FzZSgpXT1iWzJdfWI9aFthLnRvTG93ZXJDYXNlKCldfXJldHVybiBudWxsPT1iP251bGw6Yn0sZ2V0QWxsUmVzcG9uc2VIZWFkZXJzOmZ1bmN0aW9uKCl7cmV0dXJuIDI9PT12P2c6bnVsbH0sc2V0UmVxdWVzdEhlYWRlcjpmdW5jdGlvbihhLGIpe3ZhciBjPWEudG9Mb3dlckNhc2UoKTtyZXR1cm4gdnx8KGE9dVtjXT11W2NdfHxhLHRbYV09YiksdGhpc30sb3ZlcnJpZGVNaW1lVHlwZTpmdW5jdGlvbihhKXtyZXR1cm4gdnx8KG0ubWltZVR5cGU9YSksdGhpc30sc3RhdHVzQ29kZTpmdW5jdGlvbihhKXt2YXIgYjtpZihhKWlmKDI+dilmb3IoYiBpbiBhKXNbYl09W3NbYl0sYVtiXV07ZWxzZSB4LmFsd2F5cyhhW3guc3RhdHVzXSk7cmV0dXJuIHRoaXN9LGFib3J0OmZ1bmN0aW9uKGEpe3ZhciBiPWF8fHc7cmV0dXJuIGUmJmUuYWJvcnQoYikseigwLGIpLHRoaXN9fTtpZihxLnByb21pc2UoeCksbS51cmw9KChifHxtLnVybHx8QWEuaHJlZikrXCJcIikucmVwbGFjZShEYSxcIlwiKS5yZXBsYWNlKElhLEFhLnByb3RvY29sK1wiLy9cIiksbS50eXBlPWMubWV0aG9kfHxjLnR5cGV8fG0ubWV0aG9kfHxtLnR5cGUsbS5kYXRhVHlwZXM9bi50cmltKG0uZGF0YVR5cGV8fFwiKlwiKS50b0xvd2VyQ2FzZSgpLm1hdGNoKEUpfHxbXCJcIl0sbnVsbD09bS5jcm9zc0RvbWFpbil7aj1kLmNyZWF0ZUVsZW1lbnQoXCJhXCIpO3RyeXtqLmhyZWY9bS51cmwsai5ocmVmPWouaHJlZixtLmNyb3NzRG9tYWluPU1hLnByb3RvY29sK1wiLy9cIitNYS5ob3N0IT1qLnByb3RvY29sK1wiLy9cIitqLmhvc3R9Y2F0Y2goeSl7bS5jcm9zc0RvbWFpbj0hMH19aWYobS5kYXRhJiZtLnByb2Nlc3NEYXRhJiZcInN0cmluZ1wiIT10eXBlb2YgbS5kYXRhJiYobS5kYXRhPW4ucGFyYW0obS5kYXRhLG0udHJhZGl0aW9uYWwpKSxPYShKYSxtLGMseCksMj09PXYpcmV0dXJuIHg7az1uLmV2ZW50JiZtLmdsb2JhbCxrJiYwPT09bi5hY3RpdmUrKyYmbi5ldmVudC50cmlnZ2VyKFwiYWpheFN0YXJ0XCIpLG0udHlwZT1tLnR5cGUudG9VcHBlckNhc2UoKSxtLmhhc0NvbnRlbnQ9IUhhLnRlc3QobS50eXBlKSxmPW0udXJsLG0uaGFzQ29udGVudHx8KG0uZGF0YSYmKGY9bS51cmwrPShDYS50ZXN0KGYpP1wiJlwiOlwiP1wiKSttLmRhdGEsZGVsZXRlIG0uZGF0YSksbS5jYWNoZT09PSExJiYobS51cmw9RWEudGVzdChmKT9mLnJlcGxhY2UoRWEsXCIkMV89XCIrQmErKyk6ZisoQ2EudGVzdChmKT9cIiZcIjpcIj9cIikrXCJfPVwiK0JhKyspKSxtLmlmTW9kaWZpZWQmJihuLmxhc3RNb2RpZmllZFtmXSYmeC5zZXRSZXF1ZXN0SGVhZGVyKFwiSWYtTW9kaWZpZWQtU2luY2VcIixuLmxhc3RNb2RpZmllZFtmXSksbi5ldGFnW2ZdJiZ4LnNldFJlcXVlc3RIZWFkZXIoXCJJZi1Ob25lLU1hdGNoXCIsbi5ldGFnW2ZdKSksKG0uZGF0YSYmbS5oYXNDb250ZW50JiZtLmNvbnRlbnRUeXBlIT09ITF8fGMuY29udGVudFR5cGUpJiZ4LnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixtLmNvbnRlbnRUeXBlKSx4LnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIixtLmRhdGFUeXBlc1swXSYmbS5hY2NlcHRzW20uZGF0YVR5cGVzWzBdXT9tLmFjY2VwdHNbbS5kYXRhVHlwZXNbMF1dKyhcIipcIiE9PW0uZGF0YVR5cGVzWzBdP1wiLCBcIitMYStcIjsgcT0wLjAxXCI6XCJcIik6bS5hY2NlcHRzW1wiKlwiXSk7Zm9yKGwgaW4gbS5oZWFkZXJzKXguc2V0UmVxdWVzdEhlYWRlcihsLG0uaGVhZGVyc1tsXSk7aWYobS5iZWZvcmVTZW5kJiYobS5iZWZvcmVTZW5kLmNhbGwobyx4LG0pPT09ITF8fDI9PT12KSlyZXR1cm4geC5hYm9ydCgpO2lmKHc9XCJhYm9ydFwiLHIuYWRkKG0uY29tcGxldGUpLHguZG9uZShtLnN1Y2Nlc3MpLHguZmFpbChtLmVycm9yKSxlPU9hKEthLG0sYyx4KSl7aWYoeC5yZWFkeVN0YXRlPTEsayYmcC50cmlnZ2VyKFwiYWpheFNlbmRcIixbeCxtXSksMj09PXYpcmV0dXJuIHg7bS5hc3luYyYmbS50aW1lb3V0PjAmJihpPWEuc2V0VGltZW91dChmdW5jdGlvbigpe3guYWJvcnQoXCJ0aW1lb3V0XCIpfSxtLnRpbWVvdXQpKTt0cnl7dj0xLGUuc2VuZCh0LHopfWNhdGNoKHkpe2lmKCEoMj52KSl0aHJvdyB5O3ooLTEseSl9fWVsc2UgeigtMSxcIk5vIFRyYW5zcG9ydFwiKTtmdW5jdGlvbiB6KGIsYyxkLGgpe3ZhciBqLGwsdCx1LHcseT1jOzIhPT12JiYodj0yLGkmJmEuY2xlYXJUaW1lb3V0KGkpLGU9dm9pZCAwLGc9aHx8XCJcIix4LnJlYWR5U3RhdGU9Yj4wPzQ6MCxqPWI+PTIwMCYmMzAwPmJ8fDMwND09PWIsZCYmKHU9UWEobSx4LGQpKSx1PVJhKG0sdSx4LGopLGo/KG0uaWZNb2RpZmllZCYmKHc9eC5nZXRSZXNwb25zZUhlYWRlcihcIkxhc3QtTW9kaWZpZWRcIiksdyYmKG4ubGFzdE1vZGlmaWVkW2ZdPXcpLHc9eC5nZXRSZXNwb25zZUhlYWRlcihcImV0YWdcIiksdyYmKG4uZXRhZ1tmXT13KSksMjA0PT09Ynx8XCJIRUFEXCI9PT1tLnR5cGU/eT1cIm5vY29udGVudFwiOjMwND09PWI/eT1cIm5vdG1vZGlmaWVkXCI6KHk9dS5zdGF0ZSxsPXUuZGF0YSx0PXUuZXJyb3Isaj0hdCkpOih0PXksKGJ8fCF5KSYmKHk9XCJlcnJvclwiLDA+YiYmKGI9MCkpKSx4LnN0YXR1cz1iLHguc3RhdHVzVGV4dD0oY3x8eSkrXCJcIixqP3EucmVzb2x2ZVdpdGgobyxbbCx5LHhdKTpxLnJlamVjdFdpdGgobyxbeCx5LHRdKSx4LnN0YXR1c0NvZGUocykscz12b2lkIDAsayYmcC50cmlnZ2VyKGo/XCJhamF4U3VjY2Vzc1wiOlwiYWpheEVycm9yXCIsW3gsbSxqP2w6dF0pLHIuZmlyZVdpdGgobyxbeCx5XSksayYmKHAudHJpZ2dlcihcImFqYXhDb21wbGV0ZVwiLFt4LG1dKSwtLW4uYWN0aXZlfHxuLmV2ZW50LnRyaWdnZXIoXCJhamF4U3RvcFwiKSkpfXJldHVybiB4fSxnZXRKU09OOmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gbi5nZXQoYSxiLGMsXCJqc29uXCIpfSxnZXRTY3JpcHQ6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbi5nZXQoYSx2b2lkIDAsYixcInNjcmlwdFwiKX19KSxuLmVhY2goW1wiZ2V0XCIsXCJwb3N0XCJdLGZ1bmN0aW9uKGEsYil7bltiXT1mdW5jdGlvbihhLGMsZCxlKXtyZXR1cm4gbi5pc0Z1bmN0aW9uKGMpJiYoZT1lfHxkLGQ9YyxjPXZvaWQgMCksbi5hamF4KG4uZXh0ZW5kKHt1cmw6YSx0eXBlOmIsZGF0YVR5cGU6ZSxkYXRhOmMsc3VjY2VzczpkfSxuLmlzUGxhaW5PYmplY3QoYSkmJmEpKX19KSxuLl9ldmFsVXJsPWZ1bmN0aW9uKGEpe3JldHVybiBuLmFqYXgoe3VybDphLHR5cGU6XCJHRVRcIixkYXRhVHlwZTpcInNjcmlwdFwiLGNhY2hlOiEwLGFzeW5jOiExLGdsb2JhbDohMSxcInRocm93c1wiOiEwfSl9O3ZhciBTYT0vJTIwL2csVGE9L1xcW1xcXSQvLFVhPS9cXHI/XFxuL2csVmE9L14oPzpzdWJtaXR8YnV0dG9ufGltYWdlfHJlc2V0fGZpbGUpJC9pLFdhPS9eKD86aW5wdXR8c2VsZWN0fHRleHRhcmVhfGtleWdlbikvaTtmdW5jdGlvbiBYYShhLGIsYyxkKXt2YXIgZTtpZihuLmlzQXJyYXkoYikpbi5lYWNoKGIsZnVuY3Rpb24oYixlKXtjfHxUYS50ZXN0KGEpP2QoYSxlKTpYYShhK1wiW1wiKyhcIm9iamVjdFwiPT10eXBlb2YgZT9iOlwiXCIpK1wiXVwiLGUsYyxkKX0pO2Vsc2UgaWYoY3x8XCJvYmplY3RcIiE9PW4udHlwZShiKSlkKGEsYik7ZWxzZSBmb3IoZSBpbiBiKVhhKGErXCJbXCIrZStcIl1cIixiW2VdLGMsZCl9bi5wYXJhbT1mdW5jdGlvbihhLGIpe3ZhciBjLGQ9W10sZT1mdW5jdGlvbihhLGIpe2I9bi5pc0Z1bmN0aW9uKGIpP2IoKTpudWxsPT1iP1wiXCI6YixkW2QubGVuZ3RoXT1lbmNvZGVVUklDb21wb25lbnQoYSkrXCI9XCIrZW5jb2RlVVJJQ29tcG9uZW50KGIpfTtpZih2b2lkIDA9PT1iJiYoYj1uLmFqYXhTZXR0aW5ncyYmbi5hamF4U2V0dGluZ3MudHJhZGl0aW9uYWwpLG4uaXNBcnJheShhKXx8YS5qcXVlcnkmJiFuLmlzUGxhaW5PYmplY3QoYSkpbi5lYWNoKGEsZnVuY3Rpb24oKXtlKHRoaXMubmFtZSx0aGlzLnZhbHVlKX0pO2Vsc2UgZm9yKGMgaW4gYSlYYShjLGFbY10sYixlKTtyZXR1cm4gZC5qb2luKFwiJlwiKS5yZXBsYWNlKFNhLFwiK1wiKX0sbi5mbi5leHRlbmQoe3NlcmlhbGl6ZTpmdW5jdGlvbigpe3JldHVybiBuLnBhcmFtKHRoaXMuc2VyaWFsaXplQXJyYXkoKSl9LHNlcmlhbGl6ZUFycmF5OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uKCl7dmFyIGE9bi5wcm9wKHRoaXMsXCJlbGVtZW50c1wiKTtyZXR1cm4gYT9uLm1ha2VBcnJheShhKTp0aGlzfSkuZmlsdGVyKGZ1bmN0aW9uKCl7dmFyIGE9dGhpcy50eXBlO3JldHVybiB0aGlzLm5hbWUmJiFuKHRoaXMpLmlzKFwiOmRpc2FibGVkXCIpJiZXYS50ZXN0KHRoaXMubm9kZU5hbWUpJiYhVmEudGVzdChhKSYmKHRoaXMuY2hlY2tlZHx8IVQudGVzdChhKSl9KS5tYXAoZnVuY3Rpb24oYSxiKXt2YXIgYz1uKHRoaXMpLnZhbCgpO3JldHVybiBudWxsPT1jP251bGw6bi5pc0FycmF5KGMpP24ubWFwKGMsZnVuY3Rpb24oYSl7cmV0dXJue25hbWU6Yi5uYW1lLHZhbHVlOmEucmVwbGFjZShVYSxcIlxcclxcblwiKX19KTp7bmFtZTpiLm5hbWUsdmFsdWU6Yy5yZXBsYWNlKFVhLFwiXFxyXFxuXCIpfX0pLmdldCgpfX0pLG4uYWpheFNldHRpbmdzLnhocj1mdW5jdGlvbigpe3RyeXtyZXR1cm4gbmV3IGEuWE1MSHR0cFJlcXVlc3R9Y2F0Y2goYil7fX07dmFyIFlhPXswOjIwMCwxMjIzOjIwNH0sWmE9bi5hamF4U2V0dGluZ3MueGhyKCk7bC5jb3JzPSEhWmEmJlwid2l0aENyZWRlbnRpYWxzXCJpbiBaYSxsLmFqYXg9WmE9ISFaYSxuLmFqYXhUcmFuc3BvcnQoZnVuY3Rpb24oYSl7dmFyIGI7cmV0dXJuIGwuY29yc3x8WmEmJiFhLmNyb3NzRG9tYWluP3tzZW5kOmZ1bmN0aW9uKGMsZCl7dmFyIGUsZj1hLnhocigpO2lmKGYub3BlbihhLnR5cGUsYS51cmwsYS5hc3luYyxhLnVzZXJuYW1lLGEucGFzc3dvcmQpLGEueGhyRmllbGRzKWZvcihlIGluIGEueGhyRmllbGRzKWZbZV09YS54aHJGaWVsZHNbZV07YS5taW1lVHlwZSYmZi5vdmVycmlkZU1pbWVUeXBlJiZmLm92ZXJyaWRlTWltZVR5cGUoYS5taW1lVHlwZSksYS5jcm9zc0RvbWFpbnx8Y1tcIlgtUmVxdWVzdGVkLVdpdGhcIl18fChjW1wiWC1SZXF1ZXN0ZWQtV2l0aFwiXT1cIlhNTEh0dHBSZXF1ZXN0XCIpO2ZvcihlIGluIGMpZi5zZXRSZXF1ZXN0SGVhZGVyKGUsY1tlXSk7Yj1mdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oKXtiJiYoYj1mLm9ubG9hZD1mLm9uZXJyb3I9bnVsbCxcImFib3J0XCI9PT1hP2YuYWJvcnQoKTpcImVycm9yXCI9PT1hP2QoZi5zdGF0dXMsZi5zdGF0dXNUZXh0KTpkKFlhW2Yuc3RhdHVzXXx8Zi5zdGF0dXMsZi5zdGF0dXNUZXh0LFwic3RyaW5nXCI9PXR5cGVvZiBmLnJlc3BvbnNlVGV4dD97XG50ZXh0OmYucmVzcG9uc2VUZXh0fTp2b2lkIDAsZi5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSkpfX0sZi5vbmxvYWQ9YigpLGYub25lcnJvcj1iKFwiZXJyb3JcIiksYj1iKFwiYWJvcnRcIik7dHJ5e2Yuc2VuZChhLmhhc0NvbnRlbnQmJmEuZGF0YXx8bnVsbCl9Y2F0Y2goZyl7aWYoYil0aHJvdyBnfX0sYWJvcnQ6ZnVuY3Rpb24oKXtiJiZiKCl9fTp2b2lkIDB9KSxuLmFqYXhTZXR1cCh7YWNjZXB0czp7c2NyaXB0OlwidGV4dC9qYXZhc2NyaXB0LCBhcHBsaWNhdGlvbi9qYXZhc2NyaXB0LCBhcHBsaWNhdGlvbi9lY21hc2NyaXB0LCBhcHBsaWNhdGlvbi94LWVjbWFzY3JpcHRcIn0sY29udGVudHM6e3NjcmlwdDovKD86amF2YXxlY21hKXNjcmlwdC99LGNvbnZlcnRlcnM6e1widGV4dCBzY3JpcHRcIjpmdW5jdGlvbihhKXtyZXR1cm4gbi5nbG9iYWxFdmFsKGEpLGF9fX0pLG4uYWpheFByZWZpbHRlcihcInNjcmlwdFwiLGZ1bmN0aW9uKGEpe3ZvaWQgMD09PWEuY2FjaGUmJihhLmNhY2hlPSExKSxhLmNyb3NzRG9tYWluJiYoYS50eXBlPVwiR0VUXCIpfSksbi5hamF4VHJhbnNwb3J0KFwic2NyaXB0XCIsZnVuY3Rpb24oYSl7aWYoYS5jcm9zc0RvbWFpbil7dmFyIGIsYztyZXR1cm57c2VuZDpmdW5jdGlvbihlLGYpe2I9bihcIjxzY3JpcHQ+XCIpLnByb3Aoe2NoYXJzZXQ6YS5zY3JpcHRDaGFyc2V0LHNyYzphLnVybH0pLm9uKFwibG9hZCBlcnJvclwiLGM9ZnVuY3Rpb24oYSl7Yi5yZW1vdmUoKSxjPW51bGwsYSYmZihcImVycm9yXCI9PT1hLnR5cGU/NDA0OjIwMCxhLnR5cGUpfSksZC5oZWFkLmFwcGVuZENoaWxkKGJbMF0pfSxhYm9ydDpmdW5jdGlvbigpe2MmJmMoKX19fX0pLGwuY3JlYXRlSFRNTERvY3VtZW50PWZ1bmN0aW9uKCl7dmFyIGE9ZC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQoXCJcIikuYm9keTtyZXR1cm4gYS5pbm5lckhUTUw9XCI8Zm9ybT48L2Zvcm0+PGZvcm0+PC9mb3JtPlwiLDI9PT1hLmNoaWxkTm9kZXMubGVuZ3RofSgpLG4ucGFyc2VIVE1MPWZ1bmN0aW9uKGEsYixjKXtpZihcInN0cmluZ1wiIT10eXBlb2YgYSlyZXR1cm5bXTtcImJvb2xlYW5cIj09dHlwZW9mIGImJihjPWIsYj0hMSksYj1ifHwobC5jcmVhdGVIVE1MRG9jdW1lbnQ/ZC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVIVE1MRG9jdW1lbnQoXCJcIik6ZCk7dmFyIGU9di5leGVjKGEpLGY9IWMmJltdO3JldHVybiBlP1tiLmNyZWF0ZUVsZW1lbnQoZVsxXSldOihlPSQoW2FdLGIsZiksZiYmZi5sZW5ndGgmJm4oZikucmVtb3ZlKCksbi5tZXJnZShbXSxlLmNoaWxkTm9kZXMpKX0sbi5mbi5sb2FkPWZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlLGYsZz10aGlzLGg9YS5pbmRleE9mKFwiIFwiKTtyZXR1cm4gaD4tMSYmKGQ9bi50cmltKGEuc2xpY2UoaCkpLGE9YS5zbGljZSgwLGgpKSxuLmlzRnVuY3Rpb24oYik/KGM9YixiPXZvaWQgMCk6YiYmXCJvYmplY3RcIj09dHlwZW9mIGImJihlPVwiUE9TVFwiKSxnLmxlbmd0aD4wJiZuLmFqYXgoe3VybDphLHR5cGU6ZXx8XCJHRVRcIixkYXRhVHlwZTpcImh0bWxcIixkYXRhOmJ9KS5kb25lKGZ1bmN0aW9uKGEpe2Y9YXJndW1lbnRzLGcuaHRtbChkP24oXCI8ZGl2PlwiKS5hcHBlbmQobi5wYXJzZUhUTUwoYSkpLmZpbmQoZCk6YSl9KS5hbHdheXMoYyYmZnVuY3Rpb24oYSxiKXtnLmVhY2goZnVuY3Rpb24oKXtjLmFwcGx5KGcsZnx8W2EucmVzcG9uc2VUZXh0LGIsYV0pfSl9KSx0aGlzfSxuLmVhY2goW1wiYWpheFN0YXJ0XCIsXCJhamF4U3RvcFwiLFwiYWpheENvbXBsZXRlXCIsXCJhamF4RXJyb3JcIixcImFqYXhTdWNjZXNzXCIsXCJhamF4U2VuZFwiXSxmdW5jdGlvbihhLGIpe24uZm5bYl09ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMub24oYixhKX19KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQmJmRlZmluZShcImpxdWVyeVwiLFtdLGZ1bmN0aW9uKCl7cmV0dXJuIG59KTt2YXIgJGE9YS5qUXVlcnksX2E9YS4kO3JldHVybiBuLm5vQ29uZmxpY3Q9ZnVuY3Rpb24oYil7cmV0dXJuIGEuJD09PW4mJihhLiQ9X2EpLGImJmEualF1ZXJ5PT09biYmKGEualF1ZXJ5PSRhKSxufSxifHwoYS5qUXVlcnk9YS4kPW4pLG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWpxdWVyeS5taW4ubWFwIiwiKGZ1bmN0aW9uKCkge1xudmFyIF9zbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbnZhciBCYWNvbiA9IHtcbiAgdG9TdHJpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gXCJCYWNvblwiO1xuICB9XG59O1xuXG5CYWNvbi52ZXJzaW9uID0gJzAuNy44NCc7XG5cbnZhciBFeGNlcHRpb24gPSAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBnbG9iYWwgIT09IG51bGwgPyBnbG9iYWwgOiB0aGlzKS5FcnJvcjtcbnZhciBub3AgPSBmdW5jdGlvbiAoKSB7fTtcbnZhciBsYXR0ZXIgPSBmdW5jdGlvbiAoXywgeCkge1xuICByZXR1cm4geDtcbn07XG52YXIgZm9ybWVyID0gZnVuY3Rpb24gKHgsIF8pIHtcbiAgcmV0dXJuIHg7XG59O1xudmFyIGNsb25lQXJyYXkgPSBmdW5jdGlvbiAoeHMpIHtcbiAgcmV0dXJuIHhzLnNsaWNlKDApO1xufTtcbnZhciBhc3NlcnQgPSBmdW5jdGlvbiAobWVzc2FnZSwgY29uZGl0aW9uKSB7XG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihtZXNzYWdlKTtcbiAgfVxufTtcbnZhciBhc3NlcnRPYnNlcnZhYmxlSXNQcm9wZXJ0eSA9IGZ1bmN0aW9uICh4KSB7XG4gIGlmICgoeCAhPSBudWxsID8geC5faXNPYnNlcnZhYmxlIDogdm9pZCAwKSAmJiAhKHggIT0gbnVsbCA/IHguX2lzUHJvcGVydHkgOiB2b2lkIDApKSB7XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIk9ic2VydmFibGUgaXMgbm90IGEgUHJvcGVydHkgOiBcIiArIHgpO1xuICB9XG59O1xudmFyIGFzc2VydEV2ZW50U3RyZWFtID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIGlmICghKGV2ZW50ICE9IG51bGwgPyBldmVudC5faXNFdmVudFN0cmVhbSA6IHZvaWQgMCkpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwibm90IGFuIEV2ZW50U3RyZWFtIDogXCIgKyBldmVudCk7XG4gIH1cbn07XG5cbnZhciBhc3NlcnRPYnNlcnZhYmxlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIGlmICghKGV2ZW50ICE9IG51bGwgPyBldmVudC5faXNPYnNlcnZhYmxlIDogdm9pZCAwKSkge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJub3QgYW4gT2JzZXJ2YWJsZSA6IFwiICsgZXZlbnQpO1xuICB9XG59O1xudmFyIGFzc2VydEZ1bmN0aW9uID0gZnVuY3Rpb24gKGYpIHtcbiAgcmV0dXJuIGFzc2VydChcIm5vdCBhIGZ1bmN0aW9uIDogXCIgKyBmLCBfLmlzRnVuY3Rpb24oZikpO1xufTtcbnZhciBpc0FycmF5ID0gZnVuY3Rpb24gKHhzKSB7XG4gIHJldHVybiB4cyBpbnN0YW5jZW9mIEFycmF5O1xufTtcbnZhciBpc09ic2VydmFibGUgPSBmdW5jdGlvbiAoeCkge1xuICByZXR1cm4geCAmJiB4Ll9pc09ic2VydmFibGU7XG59O1xudmFyIGFzc2VydEFycmF5ID0gZnVuY3Rpb24gKHhzKSB7XG4gIGlmICghaXNBcnJheSh4cykpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwibm90IGFuIGFycmF5IDogXCIgKyB4cyk7XG4gIH1cbn07XG52YXIgYXNzZXJ0Tm9Bcmd1bWVudHMgPSBmdW5jdGlvbiAoYXJncykge1xuICByZXR1cm4gYXNzZXJ0KFwibm8gYXJndW1lbnRzIHN1cHBvcnRlZFwiLCBhcmdzLmxlbmd0aCA9PT0gMCk7XG59O1xudmFyIGFzc2VydFN0cmluZyA9IGZ1bmN0aW9uICh4KSB7XG4gIGlmICh0eXBlb2YgeCA9PT0gXCJzdHJpbmdcIikge1xuICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJub3QgYSBzdHJpbmcgOiBcIiArIHgpO1xuICB9XG59O1xuXG52YXIgZXh0ZW5kID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDE7IDEgPCBsZW5ndGggPyBpIDwgbGVuZ3RoIDogaSA+IGxlbmd0aDsgMSA8IGxlbmd0aCA/IGkrKyA6IGktLSkge1xuICAgIGZvciAodmFyIHByb3AgaW4gYXJndW1lbnRzW2ldKSB7XG4gICAgICB0YXJnZXRbcHJvcF0gPSBhcmd1bWVudHNbaV1bcHJvcF07XG4gICAgfVxuICB9XG4gIHJldHVybiB0YXJnZXQ7XG59O1xuXG52YXIgaW5oZXJpdCA9IGZ1bmN0aW9uIChjaGlsZCwgcGFyZW50KSB7XG4gIHZhciBoYXNQcm9wID0gKHt9KS5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIGN0b3IgPSBmdW5jdGlvbiAoKSB7fTtcbiAgY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlO1xuICBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpO1xuICBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7XG4gICAgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIHtcbiAgICAgIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNoaWxkO1xufTtcblxudmFyIF8gPSB7XG4gIGluZGV4T2Y6IChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKEFycmF5LnByb3RvdHlwZS5pbmRleE9mKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKHhzLCB4KSB7XG4gICAgICAgIHJldHVybiB4cy5pbmRleE9mKHgpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICh4cywgeCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgeTsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgeSA9IHhzW2ldO1xuICAgICAgICAgIGlmICh4ID09PSB5KSB7XG4gICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfTtcbiAgICB9XG4gIH0pKCksXG4gIGluZGV4V2hlcmU6IGZ1bmN0aW9uICh4cywgZikge1xuICAgIGZvciAodmFyIGkgPSAwLCB5OyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHkgPSB4c1tpXTtcbiAgICAgIGlmIChmKHkpKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTE7XG4gIH0sXG4gIGhlYWQ6IGZ1bmN0aW9uICh4cykge1xuICAgIHJldHVybiB4c1swXTtcbiAgfSxcbiAgYWx3YXlzOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4geDtcbiAgICB9O1xuICB9LFxuICBuZWdhdGU6IGZ1bmN0aW9uIChmKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh4KSB7XG4gICAgICByZXR1cm4gIWYoeCk7XG4gICAgfTtcbiAgfSxcbiAgZW1wdHk6IGZ1bmN0aW9uICh4cykge1xuICAgIHJldHVybiB4cy5sZW5ndGggPT09IDA7XG4gIH0sXG4gIHRhaWw6IGZ1bmN0aW9uICh4cykge1xuICAgIHJldHVybiB4cy5zbGljZSgxLCB4cy5sZW5ndGgpO1xuICB9LFxuICBmaWx0ZXI6IGZ1bmN0aW9uIChmLCB4cykge1xuICAgIHZhciBmaWx0ZXJlZCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCB4OyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHggPSB4c1tpXTtcbiAgICAgIGlmIChmKHgpKSB7XG4gICAgICAgIGZpbHRlcmVkLnB1c2goeCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmaWx0ZXJlZDtcbiAgfSxcbiAgbWFwOiBmdW5jdGlvbiAoZiwgeHMpIHtcbiAgICByZXR1cm4gKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCB4OyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgeCA9IHhzW2ldO1xuICAgICAgICByZXN1bHQucHVzaChmKHgpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSkoKTtcbiAgfSxcbiAgZWFjaDogZnVuY3Rpb24gKHhzLCBmKSB7XG4gICAgZm9yICh2YXIga2V5IGluIHhzKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHhzLCBrZXkpKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHhzW2tleV07XG4gICAgICAgIGYoa2V5LCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICB0b0FycmF5OiBmdW5jdGlvbiAoeHMpIHtcbiAgICByZXR1cm4gaXNBcnJheSh4cykgPyB4cyA6IFt4c107XG4gIH0sXG4gIGNvbnRhaW5zOiBmdW5jdGlvbiAoeHMsIHgpIHtcbiAgICByZXR1cm4gXy5pbmRleE9mKHhzLCB4KSAhPT0gLTE7XG4gIH0sXG4gIGlkOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB4O1xuICB9LFxuICBsYXN0OiBmdW5jdGlvbiAoeHMpIHtcbiAgICByZXR1cm4geHNbeHMubGVuZ3RoIC0gMV07XG4gIH0sXG4gIGFsbDogZnVuY3Rpb24gKHhzKSB7XG4gICAgdmFyIGYgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBfLmlkIDogYXJndW1lbnRzWzFdO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIHg7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgeCA9IHhzW2ldO1xuICAgICAgaWYgKCFmKHgpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIGFueTogZnVuY3Rpb24gKHhzKSB7XG4gICAgdmFyIGYgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBfLmlkIDogYXJndW1lbnRzWzFdO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIHg7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgeCA9IHhzW2ldO1xuICAgICAgaWYgKGYoeCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgd2l0aG91dDogZnVuY3Rpb24gKHgsIHhzKSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGZ1bmN0aW9uICh5KSB7XG4gICAgICByZXR1cm4geSAhPT0geDtcbiAgICB9LCB4cyk7XG4gIH0sXG4gIHJlbW92ZTogZnVuY3Rpb24gKHgsIHhzKSB7XG4gICAgdmFyIGkgPSBfLmluZGV4T2YoeHMsIHgpO1xuICAgIGlmIChpID49IDApIHtcbiAgICAgIHJldHVybiB4cy5zcGxpY2UoaSwgMSk7XG4gICAgfVxuICB9LFxuICBmb2xkOiBmdW5jdGlvbiAoeHMsIHNlZWQsIGYpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgeDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB4ID0geHNbaV07XG4gICAgICBzZWVkID0gZihzZWVkLCB4KTtcbiAgICB9XG4gICAgcmV0dXJuIHNlZWQ7XG4gIH0sXG4gIGZsYXRNYXA6IGZ1bmN0aW9uIChmLCB4cykge1xuICAgIHJldHVybiBfLmZvbGQoeHMsIFtdLCBmdW5jdGlvbiAoeXMsIHgpIHtcbiAgICAgIHJldHVybiB5cy5jb25jYXQoZih4KSk7XG4gICAgfSk7XG4gIH0sXG4gIGNhY2hlZDogZnVuY3Rpb24gKGYpIHtcbiAgICB2YXIgdmFsdWUgPSBOb25lO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInVuZGVmaW5lZFwiICYmIHZhbHVlICE9PSBudWxsID8gdmFsdWUuX2lzTm9uZSA6IHVuZGVmaW5lZCkge1xuICAgICAgICB2YWx1ZSA9IGYoKTtcbiAgICAgICAgZiA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICB9LFxuICBiaW5kOiBmdW5jdGlvbiAoZm4sIG1lKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmbi5hcHBseShtZSwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9LFxuICBpc0Z1bmN0aW9uOiBmdW5jdGlvbiAoZikge1xuICAgIHJldHVybiB0eXBlb2YgZiA9PT0gXCJmdW5jdGlvblwiO1xuICB9LFxuICB0b1N0cmluZzogZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciBpbnRlcm5hbHMsIGtleSwgdmFsdWU7XG4gICAgdmFyIGhhc1Byb3AgPSAoe30pLmhhc093blByb3BlcnR5O1xuICAgIHRyeSB7XG4gICAgICByZWN1cnNpb25EZXB0aCsrO1xuICAgICAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBcInVuZGVmaW5lZFwiO1xuICAgICAgfSBlbHNlIGlmIChfLmlzRnVuY3Rpb24ob2JqKSkge1xuICAgICAgICByZXR1cm4gXCJmdW5jdGlvblwiO1xuICAgICAgfSBlbHNlIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgICAgaWYgKHJlY3Vyc2lvbkRlcHRoID4gNSkge1xuICAgICAgICAgIHJldHVybiBcIlsuLl1cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJbXCIgKyBfLm1hcChfLnRvU3RyaW5nLCBvYmopLnRvU3RyaW5nKCkgKyBcIl1cIjtcbiAgICAgIH0gZWxzZSBpZiAoKG9iaiAhPSBudWxsID8gb2JqLnRvU3RyaW5nIDogdm9pZCAwKSAhPSBudWxsICYmIG9iai50b1N0cmluZyAhPT0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZykge1xuICAgICAgICByZXR1cm4gb2JqLnRvU3RyaW5nKCk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgaWYgKHJlY3Vyc2lvbkRlcHRoID4gNSkge1xuICAgICAgICAgIHJldHVybiBcInsuLn1cIjtcbiAgICAgICAgfVxuICAgICAgICBpbnRlcm5hbHMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciByZXN1bHRzID0gW107XG4gICAgICAgICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAoIWhhc1Byb3AuY2FsbChvYmosIGtleSkpIGNvbnRpbnVlO1xuICAgICAgICAgICAgdmFsdWUgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2YXIgZXJyb3I7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChfLnRvU3RyaW5nKGtleSkgKyBcIjpcIiArIF8udG9TdHJpbmcodmFsdWUpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybiBcIntcIiArIGludGVybmFscyArIFwifVwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgcmVjdXJzaW9uRGVwdGgtLTtcbiAgICB9XG4gIH1cbn07XG5cbnZhciByZWN1cnNpb25EZXB0aCA9IDA7XG5cbkJhY29uLl8gPSBfO1xuXG52YXIgVXBkYXRlQmFycmllciA9IEJhY29uLlVwZGF0ZUJhcnJpZXIgPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgcm9vdEV2ZW50O1xuICB2YXIgd2FpdGVyT2JzID0gW107XG4gIHZhciB3YWl0ZXJzID0ge307XG4gIHZhciBhZnRlcnMgPSBbXTtcbiAgdmFyIGFmdGVyc0luZGV4ID0gMDtcbiAgdmFyIGZsdXNoZWQgPSB7fTtcblxuICB2YXIgYWZ0ZXJUcmFuc2FjdGlvbiA9IGZ1bmN0aW9uIChmKSB7XG4gICAgaWYgKHJvb3RFdmVudCkge1xuICAgICAgcmV0dXJuIGFmdGVycy5wdXNoKGYpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZigpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgd2hlbkRvbmVXaXRoID0gZnVuY3Rpb24gKG9icywgZikge1xuICAgIGlmIChyb290RXZlbnQpIHtcbiAgICAgIHZhciBvYnNXYWl0ZXJzID0gd2FpdGVyc1tvYnMuaWRdO1xuICAgICAgaWYgKCEodHlwZW9mIG9ic1dhaXRlcnMgIT09IFwidW5kZWZpbmVkXCIgJiYgb2JzV2FpdGVycyAhPT0gbnVsbCkpIHtcbiAgICAgICAgb2JzV2FpdGVycyA9IHdhaXRlcnNbb2JzLmlkXSA9IFtmXTtcbiAgICAgICAgcmV0dXJuIHdhaXRlck9icy5wdXNoKG9icyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gb2JzV2FpdGVycy5wdXNoKGYpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZigpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgZmx1c2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgd2hpbGUgKHdhaXRlck9icy5sZW5ndGggPiAwKSB7XG4gICAgICBmbHVzaFdhaXRlcnMoMCwgdHJ1ZSk7XG4gICAgfVxuICAgIGZsdXNoZWQgPSB7fTtcbiAgfTtcblxuICB2YXIgZmx1c2hXYWl0ZXJzID0gZnVuY3Rpb24gKGluZGV4LCBkZXBzKSB7XG4gICAgdmFyIG9icyA9IHdhaXRlck9ic1tpbmRleF07XG4gICAgdmFyIG9ic0lkID0gb2JzLmlkO1xuICAgIHZhciBvYnNXYWl0ZXJzID0gd2FpdGVyc1tvYnNJZF07XG4gICAgd2FpdGVyT2JzLnNwbGljZShpbmRleCwgMSk7XG4gICAgZGVsZXRlIHdhaXRlcnNbb2JzSWRdO1xuICAgIGlmIChkZXBzICYmIHdhaXRlck9icy5sZW5ndGggPiAwKSB7XG4gICAgICBmbHVzaERlcHNPZihvYnMpO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMCwgZjsgaSA8IG9ic1dhaXRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGYgPSBvYnNXYWl0ZXJzW2ldO1xuICAgICAgZigpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgZmx1c2hEZXBzT2YgPSBmdW5jdGlvbiAob2JzKSB7XG4gICAgaWYgKGZsdXNoZWRbb2JzLmlkXSkgcmV0dXJuO1xuICAgIHZhciBkZXBzID0gb2JzLmludGVybmFsRGVwcygpO1xuICAgIGZvciAodmFyIGkgPSAwLCBkZXA7IGkgPCBkZXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBkZXAgPSBkZXBzW2ldO1xuICAgICAgZmx1c2hEZXBzT2YoZGVwKTtcbiAgICAgIGlmICh3YWl0ZXJzW2RlcC5pZF0pIHtcbiAgICAgICAgdmFyIGluZGV4ID0gXy5pbmRleE9mKHdhaXRlck9icywgZGVwKTtcbiAgICAgICAgZmx1c2hXYWl0ZXJzKGluZGV4LCBmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZsdXNoZWRbb2JzLmlkXSA9IHRydWU7XG4gIH07XG5cbiAgdmFyIGluVHJhbnNhY3Rpb24gPSBmdW5jdGlvbiAoZXZlbnQsIGNvbnRleHQsIGYsIGFyZ3MpIHtcbiAgICBpZiAocm9vdEV2ZW50KSB7XG4gICAgICByZXR1cm4gZi5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm9vdEV2ZW50ID0gZXZlbnQ7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gZi5hcHBseShjb250ZXh0LCBhcmdzKTtcblxuICAgICAgICBmbHVzaCgpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgcm9vdEV2ZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICB3aGlsZSAoYWZ0ZXJzSW5kZXggPCBhZnRlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgdmFyIGFmdGVyID0gYWZ0ZXJzW2FmdGVyc0luZGV4XTtcbiAgICAgICAgICBhZnRlcnNJbmRleCsrO1xuICAgICAgICAgIGFmdGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgYWZ0ZXJzSW5kZXggPSAwO1xuICAgICAgICBhZnRlcnMgPSBbXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICB9O1xuXG4gIHZhciBjdXJyZW50RXZlbnRJZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gcm9vdEV2ZW50ID8gcm9vdEV2ZW50LmlkIDogdW5kZWZpbmVkO1xuICB9O1xuXG4gIHZhciB3cmFwcGVkU3Vic2NyaWJlID0gZnVuY3Rpb24gKG9icywgc2luaykge1xuICAgIHZhciB1bnN1YmQgPSBmYWxzZTtcbiAgICB2YXIgc2hvdWxkVW5zdWIgPSBmYWxzZTtcbiAgICB2YXIgZG9VbnN1YiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNob3VsZFVuc3ViID0gdHJ1ZTtcbiAgICAgIHJldHVybiBzaG91bGRVbnN1YjtcbiAgICB9O1xuICAgIHZhciB1bnN1YiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHVuc3ViZCA9IHRydWU7XG4gICAgICByZXR1cm4gZG9VbnN1YigpO1xuICAgIH07XG4gICAgZG9VbnN1YiA9IG9icy5kaXNwYXRjaGVyLnN1YnNjcmliZShmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHJldHVybiBhZnRlclRyYW5zYWN0aW9uKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF1bnN1YmQpIHtcbiAgICAgICAgICB2YXIgcmVwbHkgPSBzaW5rKGV2ZW50KTtcbiAgICAgICAgICBpZiAocmVwbHkgPT09IEJhY29uLm5vTW9yZSkge1xuICAgICAgICAgICAgcmV0dXJuIHVuc3ViKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAoc2hvdWxkVW5zdWIpIHtcbiAgICAgIGRvVW5zdWIoKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuc3ViO1xuICB9O1xuXG4gIHZhciBoYXNXYWl0ZXJzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB3YWl0ZXJPYnMubGVuZ3RoID4gMDtcbiAgfTtcblxuICByZXR1cm4geyB3aGVuRG9uZVdpdGg6IHdoZW5Eb25lV2l0aCwgaGFzV2FpdGVyczogaGFzV2FpdGVycywgaW5UcmFuc2FjdGlvbjogaW5UcmFuc2FjdGlvbiwgY3VycmVudEV2ZW50SWQ6IGN1cnJlbnRFdmVudElkLCB3cmFwcGVkU3Vic2NyaWJlOiB3cmFwcGVkU3Vic2NyaWJlLCBhZnRlclRyYW5zYWN0aW9uOiBhZnRlclRyYW5zYWN0aW9uIH07XG59KSgpO1xuXG5mdW5jdGlvbiBTb3VyY2Uob2JzLCBzeW5jKSB7XG4gIHZhciBsYXp5ID0gYXJndW1lbnRzLmxlbmd0aCA8PSAyIHx8IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBhcmd1bWVudHNbMl07XG5cbiAgdGhpcy5vYnMgPSBvYnM7XG4gIHRoaXMuc3luYyA9IHN5bmM7XG4gIHRoaXMubGF6eSA9IGxhenk7XG4gIHRoaXMucXVldWUgPSBbXTtcbn1cblxuZXh0ZW5kKFNvdXJjZS5wcm90b3R5cGUsIHtcbiAgX2lzU291cmNlOiB0cnVlLFxuXG4gIHN1YnNjcmliZTogZnVuY3Rpb24gKHNpbmspIHtcbiAgICByZXR1cm4gdGhpcy5vYnMuZGlzcGF0Y2hlci5zdWJzY3JpYmUoc2luayk7XG4gIH0sXG4gIHRvU3RyaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMub2JzLnRvU3RyaW5nKCk7XG4gIH0sXG4gIG1hcmtFbmRlZDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZW5kZWQgPSB0cnVlO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBjb25zdW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMubGF6eSkge1xuICAgICAgcmV0dXJuIHsgdmFsdWU6IF8uYWx3YXlzKHRoaXMucXVldWVbMF0pIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnF1ZXVlWzBdO1xuICAgIH1cbiAgfSxcbiAgcHVzaDogZnVuY3Rpb24gKHgpIHtcbiAgICB0aGlzLnF1ZXVlID0gW3hdO1xuICAgIHJldHVybiBbeF07XG4gIH0sXG4gIG1heUhhdmU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgaGFzQXRMZWFzdDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnF1ZXVlLmxlbmd0aDtcbiAgfSxcbiAgZmxhdHRlbjogdHJ1ZVxufSk7XG5cbmZ1bmN0aW9uIENvbnN1bWluZ1NvdXJjZSgpIHtcbiAgU291cmNlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmluaGVyaXQoQ29uc3VtaW5nU291cmNlLCBTb3VyY2UpO1xuZXh0ZW5kKENvbnN1bWluZ1NvdXJjZS5wcm90b3R5cGUsIHtcbiAgY29uc3VtZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnF1ZXVlLnNoaWZ0KCk7XG4gIH0sXG4gIHB1c2g6IGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHRoaXMucXVldWUucHVzaCh4KTtcbiAgfSxcbiAgbWF5SGF2ZTogZnVuY3Rpb24gKGMpIHtcbiAgICByZXR1cm4gIXRoaXMuZW5kZWQgfHwgdGhpcy5xdWV1ZS5sZW5ndGggPj0gYztcbiAgfSxcbiAgaGFzQXRMZWFzdDogZnVuY3Rpb24gKGMpIHtcbiAgICByZXR1cm4gdGhpcy5xdWV1ZS5sZW5ndGggPj0gYztcbiAgfSxcbiAgZmxhdHRlbjogZmFsc2Vcbn0pO1xuXG5mdW5jdGlvbiBCdWZmZXJpbmdTb3VyY2Uob2JzKSB7XG4gIFNvdXJjZS5jYWxsKHRoaXMsIG9icywgdHJ1ZSk7XG59XG5cbmluaGVyaXQoQnVmZmVyaW5nU291cmNlLCBTb3VyY2UpO1xuZXh0ZW5kKEJ1ZmZlcmluZ1NvdXJjZS5wcm90b3R5cGUsIHtcbiAgY29uc3VtZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZXMgPSB0aGlzLnF1ZXVlO1xuICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICBwdXNoOiBmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiB0aGlzLnF1ZXVlLnB1c2goeC52YWx1ZSgpKTtcbiAgfSxcbiAgaGFzQXRMZWFzdDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59KTtcblxuU291cmNlLmlzVHJpZ2dlciA9IGZ1bmN0aW9uIChzKSB7XG4gIGlmIChzICE9IG51bGwgPyBzLl9pc1NvdXJjZSA6IHZvaWQgMCkge1xuICAgIHJldHVybiBzLnN5bmM7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHMgIT0gbnVsbCA/IHMuX2lzRXZlbnRTdHJlYW0gOiB2b2lkIDA7XG4gIH1cbn07XG5cblNvdXJjZS5mcm9tT2JzZXJ2YWJsZSA9IGZ1bmN0aW9uIChzKSB7XG4gIGlmIChzICE9IG51bGwgPyBzLl9pc1NvdXJjZSA6IHZvaWQgMCkge1xuICAgIHJldHVybiBzO1xuICB9IGVsc2UgaWYgKHMgIT0gbnVsbCA/IHMuX2lzUHJvcGVydHkgOiB2b2lkIDApIHtcbiAgICByZXR1cm4gbmV3IFNvdXJjZShzLCBmYWxzZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBDb25zdW1pbmdTb3VyY2UocywgdHJ1ZSk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIERlc2MoY29udGV4dCwgbWV0aG9kLCBhcmdzKSB7XG4gIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIHRoaXMubWV0aG9kID0gbWV0aG9kO1xuICB0aGlzLmFyZ3MgPSBhcmdzO1xufVxuXG5leHRlbmQoRGVzYy5wcm90b3R5cGUsIHtcbiAgX2lzRGVzYzogdHJ1ZSxcbiAgZGVwczogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5jYWNoZWQpIHtcbiAgICAgIHRoaXMuY2FjaGVkID0gZmluZERlcHMoW3RoaXMuY29udGV4dF0uY29uY2F0KHRoaXMuYXJncykpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jYWNoZWQ7XG4gIH0sXG4gIHRvU3RyaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF8udG9TdHJpbmcodGhpcy5jb250ZXh0KSArIFwiLlwiICsgXy50b1N0cmluZyh0aGlzLm1ldGhvZCkgKyBcIihcIiArIF8ubWFwKF8udG9TdHJpbmcsIHRoaXMuYXJncykgKyBcIilcIjtcbiAgfVxufSk7XG5cbnZhciBkZXNjcmliZSA9IGZ1bmN0aW9uIChjb250ZXh0LCBtZXRob2QpIHtcbiAgdmFyIHJlZiA9IGNvbnRleHQgfHwgbWV0aG9kO1xuICBpZiAocmVmICYmIHJlZi5faXNEZXNjKSB7XG4gICAgcmV0dXJuIGNvbnRleHQgfHwgbWV0aG9kO1xuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDIgPyBfbGVuIC0gMiA6IDApLCBfa2V5ID0gMjsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5IC0gMl0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBEZXNjKGNvbnRleHQsIG1ldGhvZCwgYXJncyk7XG4gIH1cbn07XG5cbnZhciB3aXRoRGVzYyA9IGZ1bmN0aW9uIChkZXNjLCBvYnMpIHtcbiAgb2JzLmRlc2MgPSBkZXNjO1xuICByZXR1cm4gb2JzO1xufTtcblxudmFyIGZpbmREZXBzID0gZnVuY3Rpb24gKHgpIHtcbiAgaWYgKGlzQXJyYXkoeCkpIHtcbiAgICByZXR1cm4gXy5mbGF0TWFwKGZpbmREZXBzLCB4KTtcbiAgfSBlbHNlIGlmIChpc09ic2VydmFibGUoeCkpIHtcbiAgICByZXR1cm4gW3hdO1xuICB9IGVsc2UgaWYgKHR5cGVvZiB4ICE9PSBcInVuZGVmaW5lZFwiICYmIHggIT09IG51bGwgPyB4Ll9pc1NvdXJjZSA6IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBbeC5vYnNdO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBbXTtcbiAgfVxufTtcblxuQmFjb24uRGVzYyA9IERlc2M7XG5CYWNvbi5EZXNjLmVtcHR5ID0gbmV3IEJhY29uLkRlc2MoXCJcIiwgXCJcIiwgW10pO1xuXG52YXIgd2l0aE1ldGhvZENhbGxTdXBwb3J0ID0gZnVuY3Rpb24gKHdyYXBwZWQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7XG4gICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgYXJnc1tfa2V5MiAtIDFdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGYgPT09IFwib2JqZWN0XCIgJiYgYXJncy5sZW5ndGgpIHtcbiAgICAgIHZhciBjb250ZXh0ID0gZjtcbiAgICAgIHZhciBtZXRob2ROYW1lID0gYXJnc1swXTtcbiAgICAgIGYgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjb250ZXh0W21ldGhvZE5hbWVdLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgYXJncyA9IGFyZ3Muc2xpY2UoMSk7XG4gICAgfVxuICAgIHJldHVybiB3cmFwcGVkLmFwcGx5KHVuZGVmaW5lZCwgW2ZdLmNvbmNhdChhcmdzKSk7XG4gIH07XG59O1xuXG52YXIgbWFrZUZ1bmN0aW9uQXJncyA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzKTtcbiAgcmV0dXJuIG1ha2VGdW5jdGlvbl8uYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbn07XG5cbnZhciBwYXJ0aWFsbHlBcHBsaWVkID0gZnVuY3Rpb24gKGYsIGFwcGxpZWQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMyksIF9rZXkzID0gMDsgX2tleTMgPCBfbGVuMzsgX2tleTMrKykge1xuICAgICAgYXJnc1tfa2V5M10gPSBhcmd1bWVudHNbX2tleTNdO1xuICAgIH1cblxuICAgIHJldHVybiBmLmFwcGx5KHVuZGVmaW5lZCwgYXBwbGllZC5jb25jYXQoYXJncykpO1xuICB9O1xufTtcblxudmFyIHRvU2ltcGxlRXh0cmFjdG9yID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAoISh0eXBlb2YgdmFsdWUgIT09IFwidW5kZWZpbmVkXCIgJiYgdmFsdWUgIT09IG51bGwpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBmaWVsZFZhbHVlID0gdmFsdWVba2V5XTtcbiAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihmaWVsZFZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiBmaWVsZFZhbHVlLmFwcGx5KHZhbHVlLCBhcmdzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmllbGRWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH07XG59O1xuXG52YXIgdG9GaWVsZEV4dHJhY3RvciA9IGZ1bmN0aW9uIChmLCBhcmdzKSB7XG4gIHZhciBwYXJ0cyA9IGYuc2xpY2UoMSkuc3BsaXQoXCIuXCIpO1xuICB2YXIgcGFydEZ1bmNzID0gXy5tYXAodG9TaW1wbGVFeHRyYWN0b3IoYXJncyksIHBhcnRzKTtcbiAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBmOyBpIDwgcGFydEZ1bmNzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmID0gcGFydEZ1bmNzW2ldO1xuICAgICAgdmFsdWUgPSBmKHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xufTtcblxudmFyIGlzRmllbGRLZXkgPSBmdW5jdGlvbiAoZikge1xuICByZXR1cm4gdHlwZW9mIGYgPT09IFwic3RyaW5nXCIgJiYgZi5sZW5ndGggPiAxICYmIGYuY2hhckF0KDApID09PSBcIi5cIjtcbn07XG5cbnZhciBtYWtlRnVuY3Rpb25fID0gd2l0aE1ldGhvZENhbGxTdXBwb3J0KGZ1bmN0aW9uIChmKSB7XG4gIGZvciAodmFyIF9sZW40ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW40ID4gMSA/IF9sZW40IC0gMSA6IDApLCBfa2V5NCA9IDE7IF9rZXk0IDwgX2xlbjQ7IF9rZXk0KyspIHtcbiAgICBhcmdzW19rZXk0IC0gMV0gPSBhcmd1bWVudHNbX2tleTRdO1xuICB9XG5cbiAgaWYgKF8uaXNGdW5jdGlvbihmKSkge1xuICAgIGlmIChhcmdzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHBhcnRpYWxseUFwcGxpZWQoZiwgYXJncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc0ZpZWxkS2V5KGYpKSB7XG4gICAgcmV0dXJuIHRvRmllbGRFeHRyYWN0b3IoZiwgYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIF8uYWx3YXlzKGYpO1xuICB9XG59KTtcblxudmFyIG1ha2VGdW5jdGlvbiA9IGZ1bmN0aW9uIChmLCBhcmdzKSB7XG4gIHJldHVybiBtYWtlRnVuY3Rpb25fLmFwcGx5KHVuZGVmaW5lZCwgW2ZdLmNvbmNhdChhcmdzKSk7XG59O1xuXG52YXIgY29udmVydEFyZ3NUb0Z1bmN0aW9uID0gZnVuY3Rpb24gKG9icywgZiwgYXJncywgbWV0aG9kKSB7XG4gIGlmICh0eXBlb2YgZiAhPT0gXCJ1bmRlZmluZWRcIiAmJiBmICE9PSBudWxsID8gZi5faXNQcm9wZXJ0eSA6IHVuZGVmaW5lZCkge1xuICAgIHZhciBzYW1wbGVkID0gZi5zYW1wbGVkQnkob2JzLCBmdW5jdGlvbiAocCwgcykge1xuICAgICAgcmV0dXJuIFtwLCBzXTtcbiAgICB9KTtcbiAgICByZXR1cm4gbWV0aG9kLmNhbGwoc2FtcGxlZCwgZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgIHZhciBwID0gX3JlZlswXTtcbiAgICAgIHZhciBzID0gX3JlZlsxXTtcbiAgICAgIHJldHVybiBwO1xuICAgIH0pLm1hcChmdW5jdGlvbiAoX3JlZjIpIHtcbiAgICAgIHZhciBwID0gX3JlZjJbMF07XG4gICAgICB2YXIgcyA9IF9yZWYyWzFdO1xuICAgICAgcmV0dXJuIHM7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgZiA9IG1ha2VGdW5jdGlvbihmLCBhcmdzKTtcbiAgICByZXR1cm4gbWV0aG9kLmNhbGwob2JzLCBmKTtcbiAgfVxufTtcblxudmFyIHRvQ29tYmluYXRvciA9IGZ1bmN0aW9uIChmKSB7XG4gIGlmIChfLmlzRnVuY3Rpb24oZikpIHtcbiAgICByZXR1cm4gZjtcbiAgfSBlbHNlIGlmIChpc0ZpZWxkS2V5KGYpKSB7XG4gICAgdmFyIGtleSA9IHRvRmllbGRLZXkoZik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChsZWZ0LCByaWdodCkge1xuICAgICAgcmV0dXJuIGxlZnRba2V5XShyaWdodCk7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwibm90IGEgZnVuY3Rpb24gb3IgYSBmaWVsZCBrZXk6IFwiICsgZik7XG4gIH1cbn07XG5cbnZhciB0b0ZpZWxkS2V5ID0gZnVuY3Rpb24gKGYpIHtcbiAgcmV0dXJuIGYuc2xpY2UoMSk7XG59O1xuXG5mdW5jdGlvbiBTb21lKHZhbHVlKSB7XG4gIHRoaXMudmFsdWUgPSB2YWx1ZTtcbn1cblxuZXh0ZW5kKFNvbWUucHJvdG90eXBlLCB7XG4gIF9pc1NvbWU6IHRydWUsXG4gIGdldE9yRWxzZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICB9LFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfSxcbiAgZmlsdGVyOiBmdW5jdGlvbiAoZikge1xuICAgIGlmIChmKHRoaXMudmFsdWUpKSB7XG4gICAgICByZXR1cm4gbmV3IFNvbWUodGhpcy52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBOb25lO1xuICAgIH1cbiAgfSxcbiAgbWFwOiBmdW5jdGlvbiAoZikge1xuICAgIHJldHVybiBuZXcgU29tZShmKHRoaXMudmFsdWUpKTtcbiAgfSxcbiAgZm9yRWFjaDogZnVuY3Rpb24gKGYpIHtcbiAgICByZXR1cm4gZih0aGlzLnZhbHVlKTtcbiAgfSxcbiAgaXNEZWZpbmVkOiB0cnVlLFxuICB0b0FycmF5OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFt0aGlzLnZhbHVlXTtcbiAgfSxcbiAgaW5zcGVjdDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBcIlNvbWUoXCIgKyB0aGlzLnZhbHVlICsgXCIpXCI7XG4gIH0sXG4gIHRvU3RyaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zcGVjdCgpO1xuICB9XG59KTtcblxudmFyIE5vbmUgPSB7XG4gIF9pc05vbmU6IHRydWUsXG4gIGdldE9yRWxzZTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9LFxuICBmaWx0ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gTm9uZTtcbiAgfSxcbiAgbWFwOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE5vbmU7XG4gIH0sXG4gIGZvckVhY2g6IGZ1bmN0aW9uICgpIHt9LFxuICBpc0RlZmluZWQ6IGZhbHNlLFxuICB0b0FycmF5OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9LFxuICBpbnNwZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFwiTm9uZVwiO1xuICB9LFxuICB0b1N0cmluZzogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmluc3BlY3QoKTtcbiAgfVxufTtcblxudmFyIHRvT3B0aW9uID0gZnVuY3Rpb24gKHYpIHtcbiAgaWYgKCh0eXBlb2YgdiAhPT0gXCJ1bmRlZmluZWRcIiAmJiB2ICE9PSBudWxsID8gdi5faXNTb21lIDogdW5kZWZpbmVkKSB8fCAodHlwZW9mIHYgIT09IFwidW5kZWZpbmVkXCIgJiYgdiAhPT0gbnVsbCA/IHYuX2lzTm9uZSA6IHVuZGVmaW5lZCkpIHtcbiAgICByZXR1cm4gdjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IFNvbWUodik7XG4gIH1cbn07XG5cbkJhY29uLm5vTW9yZSA9IFwiPG5vLW1vcmU+XCI7XG5CYWNvbi5tb3JlID0gXCI8bW9yZT5cIjtcblxudmFyIGV2ZW50SWRDb3VudGVyID0gMDtcblxuZnVuY3Rpb24gRXZlbnQoKSB7XG4gIHRoaXMuaWQgPSArK2V2ZW50SWRDb3VudGVyO1xufVxuXG5FdmVudC5wcm90b3R5cGUuX2lzRXZlbnQgPSB0cnVlO1xuRXZlbnQucHJvdG90eXBlLmlzRXZlbnQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0cnVlO1xufTtcbkV2ZW50LnByb3RvdHlwZS5pc0VuZCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufTtcbkV2ZW50LnByb3RvdHlwZS5pc0luaXRpYWwgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG5FdmVudC5wcm90b3R5cGUuaXNOZXh0ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZmFsc2U7XG59O1xuRXZlbnQucHJvdG90eXBlLmlzRXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG5FdmVudC5wcm90b3R5cGUuaGFzVmFsdWUgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG5FdmVudC5wcm90b3R5cGUuZmlsdGVyID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdHJ1ZTtcbn07XG5FdmVudC5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbn07XG5FdmVudC5wcm90b3R5cGUubG9nID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xufTtcblxuZnVuY3Rpb24gTmV4dCh2YWx1ZUYsIGVhZ2VyKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBOZXh0KSkge1xuICAgIHJldHVybiBuZXcgTmV4dCh2YWx1ZUYsIGVhZ2VyKTtcbiAgfVxuXG4gIEV2ZW50LmNhbGwodGhpcyk7XG5cbiAgaWYgKCFlYWdlciAmJiBfLmlzRnVuY3Rpb24odmFsdWVGKSB8fCAodmFsdWVGICE9IG51bGwgPyB2YWx1ZUYuX2lzTmV4dCA6IHZvaWQgMCkpIHtcbiAgICB0aGlzLnZhbHVlRiA9IHZhbHVlRjtcbiAgICB0aGlzLnZhbHVlSW50ZXJuYWwgPSB2b2lkIDA7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy52YWx1ZUYgPSB2b2lkIDA7XG4gICAgdGhpcy52YWx1ZUludGVybmFsID0gdmFsdWVGO1xuICB9XG59XG5cbmluaGVyaXQoTmV4dCwgRXZlbnQpO1xuXG5OZXh0LnByb3RvdHlwZS5pc05leHQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0cnVlO1xufTtcbk5leHQucHJvdG90eXBlLmhhc1ZhbHVlID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdHJ1ZTtcbn07XG5OZXh0LnByb3RvdHlwZS52YWx1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJlZjtcbiAgaWYgKChyZWYgPSB0aGlzLnZhbHVlRikgIT0gbnVsbCA/IHJlZi5faXNOZXh0IDogdm9pZCAwKSB7XG4gICAgdGhpcy52YWx1ZUludGVybmFsID0gdGhpcy52YWx1ZUYudmFsdWUoKTtcbiAgICB0aGlzLnZhbHVlRiA9IHZvaWQgMDtcbiAgfSBlbHNlIGlmICh0aGlzLnZhbHVlRikge1xuICAgIHRoaXMudmFsdWVJbnRlcm5hbCA9IHRoaXMudmFsdWVGKCk7XG4gICAgdGhpcy52YWx1ZUYgPSB2b2lkIDA7XG4gIH1cbiAgcmV0dXJuIHRoaXMudmFsdWVJbnRlcm5hbDtcbn07XG5cbk5leHQucHJvdG90eXBlLmZtYXAgPSBmdW5jdGlvbiAoZikge1xuICB2YXIgZXZlbnQsIHZhbHVlO1xuICBpZiAodGhpcy52YWx1ZUludGVybmFsKSB7XG4gICAgdmFsdWUgPSB0aGlzLnZhbHVlSW50ZXJuYWw7XG4gICAgcmV0dXJuIHRoaXMuYXBwbHkoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGYodmFsdWUpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGV2ZW50ID0gdGhpcztcbiAgICByZXR1cm4gdGhpcy5hcHBseShmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZihldmVudC52YWx1ZSgpKTtcbiAgICB9KTtcbiAgfVxufTtcblxuTmV4dC5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIG5ldyBOZXh0KHZhbHVlKTtcbn07XG5OZXh0LnByb3RvdHlwZS5maWx0ZXIgPSBmdW5jdGlvbiAoZikge1xuICByZXR1cm4gZih0aGlzLnZhbHVlKCkpO1xufTtcbk5leHQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gXy50b1N0cmluZyh0aGlzLnZhbHVlKCkpO1xufTtcbk5leHQucHJvdG90eXBlLmxvZyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMudmFsdWUoKTtcbn07XG5OZXh0LnByb3RvdHlwZS5faXNOZXh0ID0gdHJ1ZTtcblxuZnVuY3Rpb24gSW5pdGlhbCh2YWx1ZUYsIGVhZ2VyKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBJbml0aWFsKSkge1xuICAgIHJldHVybiBuZXcgSW5pdGlhbCh2YWx1ZUYsIGVhZ2VyKTtcbiAgfVxuICBOZXh0LmNhbGwodGhpcywgdmFsdWVGLCBlYWdlcik7XG59XG5cbmluaGVyaXQoSW5pdGlhbCwgTmV4dCk7XG5Jbml0aWFsLnByb3RvdHlwZS5faXNJbml0aWFsID0gdHJ1ZTtcbkluaXRpYWwucHJvdG90eXBlLmlzSW5pdGlhbCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRydWU7XG59O1xuSW5pdGlhbC5wcm90b3R5cGUuaXNOZXh0ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZmFsc2U7XG59O1xuSW5pdGlhbC5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIG5ldyBJbml0aWFsKHZhbHVlKTtcbn07XG5Jbml0aWFsLnByb3RvdHlwZS50b05leHQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBuZXcgTmV4dCh0aGlzKTtcbn07XG5cbmZ1bmN0aW9uIEVuZCgpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEVuZCkpIHtcbiAgICByZXR1cm4gbmV3IEVuZCgpO1xuICB9XG4gIEV2ZW50LmNhbGwodGhpcyk7XG59XG5cbmluaGVyaXQoRW5kLCBFdmVudCk7XG5FbmQucHJvdG90eXBlLmlzRW5kID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdHJ1ZTtcbn07XG5FbmQucHJvdG90eXBlLmZtYXAgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzO1xufTtcbkVuZC5wcm90b3R5cGUuYXBwbHkgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzO1xufTtcbkVuZC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBcIjxlbmQ+XCI7XG59O1xuXG5mdW5jdGlvbiBFcnJvcihlcnJvcikge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgRXJyb3IpKSB7XG4gICAgcmV0dXJuIG5ldyBFcnJvcihlcnJvcik7XG4gIH1cbiAgdGhpcy5lcnJvciA9IGVycm9yO1xuICBFdmVudC5jYWxsKHRoaXMpO1xufVxuXG5pbmhlcml0KEVycm9yLCBFdmVudCk7XG5FcnJvci5wcm90b3R5cGUuaXNFcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRydWU7XG59O1xuRXJyb3IucHJvdG90eXBlLmZtYXAgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzO1xufTtcbkVycm9yLnByb3RvdHlwZS5hcHBseSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXM7XG59O1xuRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gXCI8ZXJyb3I+IFwiICsgXy50b1N0cmluZyh0aGlzLmVycm9yKTtcbn07XG5cbkJhY29uLkV2ZW50ID0gRXZlbnQ7XG5CYWNvbi5Jbml0aWFsID0gSW5pdGlhbDtcbkJhY29uLk5leHQgPSBOZXh0O1xuQmFjb24uRW5kID0gRW5kO1xuQmFjb24uRXJyb3IgPSBFcnJvcjtcblxudmFyIGluaXRpYWxFdmVudCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gbmV3IEluaXRpYWwodmFsdWUsIHRydWUpO1xufTtcbnZhciBuZXh0RXZlbnQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIG5ldyBOZXh0KHZhbHVlLCB0cnVlKTtcbn07XG52YXIgZW5kRXZlbnQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBuZXcgRW5kKCk7XG59O1xudmFyIHRvRXZlbnQgPSBmdW5jdGlvbiAoeCkge1xuICBpZiAoeCAmJiB4Ll9pc0V2ZW50KSB7XG4gICAgcmV0dXJuIHg7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5leHRFdmVudCh4KTtcbiAgfVxufTtcblxudmFyIGlkQ291bnRlciA9IDA7XG52YXIgcmVnaXN0ZXJPYnMgPSBmdW5jdGlvbiAoKSB7fTtcblxuZnVuY3Rpb24gT2JzZXJ2YWJsZShkZXNjKSB7XG4gIHRoaXMuZGVzYyA9IGRlc2M7XG4gIHRoaXMuaWQgPSArK2lkQ291bnRlcjtcbiAgdGhpcy5pbml0aWFsRGVzYyA9IHRoaXMuZGVzYztcbn1cblxuZXh0ZW5kKE9ic2VydmFibGUucHJvdG90eXBlLCB7XG4gIF9pc09ic2VydmFibGU6IHRydWUsXG5cbiAgc3Vic2NyaWJlOiBmdW5jdGlvbiAoc2luaykge1xuICAgIHJldHVybiBVcGRhdGVCYXJyaWVyLndyYXBwZWRTdWJzY3JpYmUodGhpcywgc2luayk7XG4gIH0sXG5cbiAgc3Vic2NyaWJlSW50ZXJuYWw6IGZ1bmN0aW9uIChzaW5rKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hlci5zdWJzY3JpYmUoc2luayk7XG4gIH0sXG5cbiAgb25WYWx1ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBmID0gbWFrZUZ1bmN0aW9uQXJncyhhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzLnN1YnNjcmliZShmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC5oYXNWYWx1ZSgpKSB7XG4gICAgICAgIHJldHVybiBmKGV2ZW50LnZhbHVlKCkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIG9uVmFsdWVzOiBmdW5jdGlvbiAoZikge1xuICAgIHJldHVybiB0aGlzLm9uVmFsdWUoZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICAgIHJldHVybiBmLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgfSk7XG4gIH0sXG5cbiAgb25FcnJvcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBmID0gbWFrZUZ1bmN0aW9uQXJncyhhcmd1bWVudHMpO1xuICAgIHJldHVybiB0aGlzLnN1YnNjcmliZShmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC5pc0Vycm9yKCkpIHtcbiAgICAgICAgcmV0dXJuIGYoZXZlbnQuZXJyb3IpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIG9uRW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGYgPSBtYWtlRnVuY3Rpb25BcmdzKGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXMuc3Vic2NyaWJlKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYgKGV2ZW50LmlzRW5kKCkpIHtcbiAgICAgICAgcmV0dXJuIGYoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICBuYW1lOiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHdpdGhEZXNjcmlwdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZGVzYyA9IGRlc2NyaWJlLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICB0b1N0cmluZzogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl9uYW1lKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZGVzYy50b1N0cmluZygpO1xuICAgIH1cbiAgfSxcblxuICBpbnRlcm5hbERlcHM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pbml0aWFsRGVzYy5kZXBzKCk7XG4gIH1cbn0pO1xuXG5PYnNlcnZhYmxlLnByb3RvdHlwZS5hc3NpZ24gPSBPYnNlcnZhYmxlLnByb3RvdHlwZS5vblZhbHVlO1xuT2JzZXJ2YWJsZS5wcm90b3R5cGUuZm9yRWFjaCA9IE9ic2VydmFibGUucHJvdG90eXBlLm9uVmFsdWU7XG5PYnNlcnZhYmxlLnByb3RvdHlwZS5pbnNwZWN0ID0gT2JzZXJ2YWJsZS5wcm90b3R5cGUudG9TdHJpbmc7XG5cbkJhY29uLk9ic2VydmFibGUgPSBPYnNlcnZhYmxlO1xuXG5mdW5jdGlvbiBDb21wb3NpdGVVbnN1YnNjcmliZSgpIHtcbiAgdmFyIHNzID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gW10gOiBhcmd1bWVudHNbMF07XG5cbiAgdGhpcy51bnN1YnNjcmliZSA9IF8uYmluZCh0aGlzLnVuc3Vic2NyaWJlLCB0aGlzKTtcbiAgdGhpcy51bnN1YnNjcmliZWQgPSBmYWxzZTtcbiAgdGhpcy5zdWJzY3JpcHRpb25zID0gW107XG4gIHRoaXMuc3RhcnRpbmcgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIHM7IGkgPCBzcy5sZW5ndGg7IGkrKykge1xuICAgIHMgPSBzc1tpXTtcbiAgICB0aGlzLmFkZChzKTtcbiAgfVxufVxuXG5leHRlbmQoQ29tcG9zaXRlVW5zdWJzY3JpYmUucHJvdG90eXBlLCB7XG4gIGFkZDogZnVuY3Rpb24gKHN1YnNjcmlwdGlvbikge1xuICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMudW5zdWJzY3JpYmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBlbmRlZCA9IGZhbHNlO1xuICAgIHZhciB1bnN1YiA9IG5vcDtcbiAgICB0aGlzLnN0YXJ0aW5nLnB1c2goc3Vic2NyaXB0aW9uKTtcbiAgICB2YXIgdW5zdWJNZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChfdGhpczIudW5zdWJzY3JpYmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGVuZGVkID0gdHJ1ZTtcbiAgICAgIF90aGlzMi5yZW1vdmUodW5zdWIpO1xuICAgICAgcmV0dXJuIF8ucmVtb3ZlKHN1YnNjcmlwdGlvbiwgX3RoaXMyLnN0YXJ0aW5nKTtcbiAgICB9O1xuICAgIHVuc3ViID0gc3Vic2NyaXB0aW9uKHRoaXMudW5zdWJzY3JpYmUsIHVuc3ViTWUpO1xuICAgIGlmICghKHRoaXMudW5zdWJzY3JpYmVkIHx8IGVuZGVkKSkge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2godW5zdWIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB1bnN1YigpO1xuICAgIH1cbiAgICBfLnJlbW92ZShzdWJzY3JpcHRpb24sIHRoaXMuc3RhcnRpbmcpO1xuICAgIHJldHVybiB1bnN1YjtcbiAgfSxcblxuICByZW1vdmU6IGZ1bmN0aW9uICh1bnN1Yikge1xuICAgIGlmICh0aGlzLnVuc3Vic2NyaWJlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoXy5yZW1vdmUodW5zdWIsIHRoaXMuc3Vic2NyaXB0aW9ucykgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHVuc3ViKCk7XG4gICAgfVxuICB9LFxuXG4gIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMudW5zdWJzY3JpYmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMudW5zdWJzY3JpYmVkID0gdHJ1ZTtcbiAgICB2YXIgaXRlcmFibGUgPSB0aGlzLnN1YnNjcmlwdGlvbnM7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVyYWJsZS5sZW5ndGg7IGkrKykge1xuICAgICAgaXRlcmFibGVbaV0oKTtcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gW107XG4gICAgdGhpcy5zdGFydGluZyA9IFtdO1xuICAgIHJldHVybiBbXTtcbiAgfSxcblxuICBjb3VudDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnVuc3Vic2NyaWJlZCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN1YnNjcmlwdGlvbnMubGVuZ3RoICsgdGhpcy5zdGFydGluZy5sZW5ndGg7XG4gIH0sXG5cbiAgZW1wdHk6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3VudCgpID09PSAwO1xuICB9XG59KTtcblxuQmFjb24uQ29tcG9zaXRlVW5zdWJzY3JpYmUgPSBDb21wb3NpdGVVbnN1YnNjcmliZTtcblxuZnVuY3Rpb24gRGlzcGF0Y2hlcihfc3Vic2NyaWJlLCBfaGFuZGxlRXZlbnQpIHtcbiAgdGhpcy5fc3Vic2NyaWJlID0gX3N1YnNjcmliZTtcbiAgdGhpcy5faGFuZGxlRXZlbnQgPSBfaGFuZGxlRXZlbnQ7XG4gIHRoaXMuc3Vic2NyaWJlID0gXy5iaW5kKHRoaXMuc3Vic2NyaWJlLCB0aGlzKTtcbiAgdGhpcy5oYW5kbGVFdmVudCA9IF8uYmluZCh0aGlzLmhhbmRsZUV2ZW50LCB0aGlzKTtcbiAgdGhpcy5wdXNoaW5nID0gZmFsc2U7XG4gIHRoaXMuZW5kZWQgPSBmYWxzZTtcbiAgdGhpcy5wcmV2RXJyb3IgPSB1bmRlZmluZWQ7XG4gIHRoaXMudW5zdWJTcmMgPSB1bmRlZmluZWQ7XG4gIHRoaXMuc3Vic2NyaXB0aW9ucyA9IFtdO1xuICB0aGlzLnF1ZXVlID0gW107XG59XG5cbkRpc3BhdGNoZXIucHJvdG90eXBlLmhhc1N1YnNjcmliZXJzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5zdWJzY3JpcHRpb25zLmxlbmd0aCA+IDA7XG59O1xuXG5EaXNwYXRjaGVyLnByb3RvdHlwZS5yZW1vdmVTdWIgPSBmdW5jdGlvbiAoc3Vic2NyaXB0aW9uKSB7XG4gIHRoaXMuc3Vic2NyaXB0aW9ucyA9IF8ud2l0aG91dChzdWJzY3JpcHRpb24sIHRoaXMuc3Vic2NyaXB0aW9ucyk7XG4gIHJldHVybiB0aGlzLnN1YnNjcmlwdGlvbnM7XG59O1xuXG5EaXNwYXRjaGVyLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIGlmIChldmVudC5pc0VuZCgpKSB7XG4gICAgdGhpcy5lbmRlZCA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIFVwZGF0ZUJhcnJpZXIuaW5UcmFuc2FjdGlvbihldmVudCwgdGhpcywgdGhpcy5wdXNoSXQsIFtldmVudF0pO1xufTtcblxuRGlzcGF0Y2hlci5wcm90b3R5cGUucHVzaFRvU3Vic2NyaXB0aW9ucyA9IGZ1bmN0aW9uIChldmVudCkge1xuICB0cnkge1xuICAgIHZhciB0bXAgPSB0aGlzLnN1YnNjcmlwdGlvbnM7XG4gICAgdmFyIGxlbiA9IHRtcC5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmFyIHN1YiA9IHRtcFtpXTtcbiAgICAgIHZhciByZXBseSA9IHN1Yi5zaW5rKGV2ZW50KTtcbiAgICAgIGlmIChyZXBseSA9PT0gQmFjb24ubm9Nb3JlIHx8IGV2ZW50LmlzRW5kKCkpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVTdWIoc3ViKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhpcy5wdXNoaW5nID0gZmFsc2U7XG4gICAgdGhpcy5xdWV1ZSA9IFtdO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5EaXNwYXRjaGVyLnByb3RvdHlwZS5wdXNoSXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgaWYgKCF0aGlzLnB1c2hpbmcpIHtcbiAgICBpZiAoZXZlbnQgPT09IHRoaXMucHJldkVycm9yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChldmVudC5pc0Vycm9yKCkpIHtcbiAgICAgIHRoaXMucHJldkVycm9yID0gZXZlbnQ7XG4gICAgfVxuICAgIHRoaXMucHVzaGluZyA9IHRydWU7XG4gICAgdGhpcy5wdXNoVG9TdWJzY3JpcHRpb25zKGV2ZW50KTtcbiAgICB0aGlzLnB1c2hpbmcgPSBmYWxzZTtcbiAgICB3aGlsZSAodGhpcy5xdWV1ZS5sZW5ndGgpIHtcbiAgICAgIGV2ZW50ID0gdGhpcy5xdWV1ZS5zaGlmdCgpO1xuICAgICAgdGhpcy5wdXNoKGV2ZW50KTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaGFzU3Vic2NyaWJlcnMoKSkge1xuICAgICAgcmV0dXJuIEJhY29uLm1vcmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudW5zdWJzY3JpYmVGcm9tU291cmNlKCk7XG4gICAgICByZXR1cm4gQmFjb24ubm9Nb3JlO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aGlzLnF1ZXVlLnB1c2goZXZlbnQpO1xuICAgIHJldHVybiBCYWNvbi5tb3JlO1xuICB9XG59O1xuXG5EaXNwYXRjaGVyLnByb3RvdHlwZS5oYW5kbGVFdmVudCA9IGZ1bmN0aW9uIChldmVudCkge1xuICBpZiAodGhpcy5faGFuZGxlRXZlbnQpIHtcbiAgICByZXR1cm4gdGhpcy5faGFuZGxlRXZlbnQoZXZlbnQpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLnB1c2goZXZlbnQpO1xuICB9XG59O1xuXG5EaXNwYXRjaGVyLnByb3RvdHlwZS51bnN1YnNjcmliZUZyb21Tb3VyY2UgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLnVuc3ViU3JjKSB7XG4gICAgdGhpcy51bnN1YlNyYygpO1xuICB9XG4gIHRoaXMudW5zdWJTcmMgPSB1bmRlZmluZWQ7XG59O1xuXG5EaXNwYXRjaGVyLnByb3RvdHlwZS5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoc2luaykge1xuICB2YXIgc3Vic2NyaXB0aW9uO1xuICBpZiAodGhpcy5lbmRlZCkge1xuICAgIHNpbmsoZW5kRXZlbnQoKSk7XG4gICAgcmV0dXJuIG5vcDtcbiAgfSBlbHNlIHtcbiAgICBhc3NlcnRGdW5jdGlvbihzaW5rKTtcbiAgICBzdWJzY3JpcHRpb24gPSB7XG4gICAgICBzaW5rOiBzaW5rXG4gICAgfTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChzdWJzY3JpcHRpb24pO1xuICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICB0aGlzLnVuc3ViU3JjID0gdGhpcy5fc3Vic2NyaWJlKHRoaXMuaGFuZGxlRXZlbnQpO1xuICAgICAgYXNzZXJ0RnVuY3Rpb24odGhpcy51bnN1YlNyYyk7XG4gICAgfVxuICAgIHJldHVybiAoZnVuY3Rpb24gKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpcy5yZW1vdmVTdWIoc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgaWYgKCFfdGhpcy5oYXNTdWJzY3JpYmVycygpKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLnVuc3Vic2NyaWJlRnJvbVNvdXJjZSgpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pKHRoaXMpO1xuICB9XG59O1xuXG5CYWNvbi5EaXNwYXRjaGVyID0gRGlzcGF0Y2hlcjtcblxuZnVuY3Rpb24gRXZlbnRTdHJlYW0oZGVzYywgc3Vic2NyaWJlLCBoYW5kbGVyKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBFdmVudFN0cmVhbSkpIHtcbiAgICByZXR1cm4gbmV3IEV2ZW50U3RyZWFtKGRlc2MsIHN1YnNjcmliZSwgaGFuZGxlcik7XG4gIH1cbiAgaWYgKF8uaXNGdW5jdGlvbihkZXNjKSkge1xuICAgIGhhbmRsZXIgPSBzdWJzY3JpYmU7XG4gICAgc3Vic2NyaWJlID0gZGVzYztcbiAgICBkZXNjID0gRGVzYy5lbXB0eTtcbiAgfVxuICBPYnNlcnZhYmxlLmNhbGwodGhpcywgZGVzYyk7XG4gIGFzc2VydEZ1bmN0aW9uKHN1YnNjcmliZSk7XG4gIHRoaXMuZGlzcGF0Y2hlciA9IG5ldyBEaXNwYXRjaGVyKHN1YnNjcmliZSwgaGFuZGxlcik7XG4gIHJlZ2lzdGVyT2JzKHRoaXMpO1xufVxuXG5pbmhlcml0KEV2ZW50U3RyZWFtLCBPYnNlcnZhYmxlKTtcbmV4dGVuZChFdmVudFN0cmVhbS5wcm90b3R5cGUsIHtcbiAgX2lzRXZlbnRTdHJlYW06IHRydWUsXG5cbiAgdG9Qcm9wZXJ0eTogZnVuY3Rpb24gKGluaXRWYWx1ZV8pIHtcbiAgICB2YXIgaW5pdFZhbHVlID0gYXJndW1lbnRzLmxlbmd0aCA9PT0gMCA/IE5vbmUgOiB0b09wdGlvbihmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gaW5pdFZhbHVlXztcbiAgICB9KTtcbiAgICB2YXIgZGlzcCA9IHRoaXMuZGlzcGF0Y2hlcjtcbiAgICB2YXIgZGVzYyA9IG5ldyBCYWNvbi5EZXNjKHRoaXMsIFwidG9Qcm9wZXJ0eVwiLCBbaW5pdFZhbHVlX10pO1xuICAgIHJldHVybiBuZXcgUHJvcGVydHkoZGVzYywgZnVuY3Rpb24gKHNpbmspIHtcbiAgICAgIHZhciBpbml0U2VudCA9IGZhbHNlO1xuICAgICAgdmFyIHN1YmJlZCA9IGZhbHNlO1xuICAgICAgdmFyIHVuc3ViID0gbm9wO1xuICAgICAgdmFyIHJlcGx5ID0gQmFjb24ubW9yZTtcbiAgICAgIHZhciBzZW5kSW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFpbml0U2VudCkge1xuICAgICAgICAgIHJldHVybiBpbml0VmFsdWUuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGluaXRTZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIHJlcGx5ID0gc2luayhuZXcgSW5pdGlhbCh2YWx1ZSkpO1xuICAgICAgICAgICAgaWYgKHJlcGx5ID09PSBCYWNvbi5ub01vcmUpIHtcbiAgICAgICAgICAgICAgdW5zdWIoKTtcbiAgICAgICAgICAgICAgdW5zdWIgPSBub3A7XG4gICAgICAgICAgICAgIHJldHVybiBub3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHVuc3ViID0gZGlzcC5zdWJzY3JpYmUoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5oYXNWYWx1ZSgpKSB7XG4gICAgICAgICAgaWYgKGV2ZW50LmlzSW5pdGlhbCgpICYmICFzdWJiZWQpIHtcbiAgICAgICAgICAgIGluaXRWYWx1ZSA9IG5ldyBTb21lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGV2ZW50LnZhbHVlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBCYWNvbi5tb3JlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWV2ZW50LmlzSW5pdGlhbCgpKSB7XG4gICAgICAgICAgICAgIHNlbmRJbml0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbml0U2VudCA9IHRydWU7XG4gICAgICAgICAgICBpbml0VmFsdWUgPSBuZXcgU29tZShldmVudCk7XG4gICAgICAgICAgICByZXR1cm4gc2luayhldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChldmVudC5pc0VuZCgpKSB7XG4gICAgICAgICAgICByZXBseSA9IHNlbmRJbml0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXBseSAhPT0gQmFjb24ubm9Nb3JlKSB7XG4gICAgICAgICAgICByZXR1cm4gc2luayhldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHN1YmJlZCA9IHRydWU7XG4gICAgICBzZW5kSW5pdCgpO1xuICAgICAgcmV0dXJuIHVuc3ViO1xuICAgIH0pO1xuICB9LFxuXG4gIHRvRXZlbnRTdHJlYW06IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICB3aXRoSGFuZGxlcjogZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICByZXR1cm4gbmV3IEV2ZW50U3RyZWFtKG5ldyBCYWNvbi5EZXNjKHRoaXMsIFwid2l0aEhhbmRsZXJcIiwgW2hhbmRsZXJdKSwgdGhpcy5kaXNwYXRjaGVyLnN1YnNjcmliZSwgaGFuZGxlcik7XG4gIH1cbn0pO1xuXG5CYWNvbi5FdmVudFN0cmVhbSA9IEV2ZW50U3RyZWFtO1xuXG5CYWNvbi5uZXZlciA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIG5ldyBFdmVudFN0cmVhbShkZXNjcmliZShCYWNvbiwgXCJuZXZlclwiKSwgZnVuY3Rpb24gKHNpbmspIHtcbiAgICBzaW5rKGVuZEV2ZW50KCkpO1xuICAgIHJldHVybiBub3A7XG4gIH0pO1xufTtcblxuQmFjb24ud2hlbiA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gQmFjb24ubmV2ZXIoKTtcbiAgfVxuICB2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgdmFyIHVzYWdlID0gXCJ3aGVuOiBleHBlY3RpbmcgYXJndW1lbnRzIGluIHRoZSBmb3JtIChPYnNlcnZhYmxlKyxmdW5jdGlvbikrXCI7XG5cbiAgYXNzZXJ0KHVzYWdlLCBsZW4gJSAyID09PSAwKTtcbiAgdmFyIHNvdXJjZXMgPSBbXTtcbiAgdmFyIHBhdHMgPSBbXTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgcGF0dGVybnMgPSBbXTtcbiAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICBwYXR0ZXJuc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICBwYXR0ZXJuc1tpICsgMV0gPSBhcmd1bWVudHNbaSArIDFdO1xuICAgIHZhciBwYXRTb3VyY2VzID0gXy50b0FycmF5KGFyZ3VtZW50c1tpXSk7XG4gICAgdmFyIGYgPSBjb25zdGFudFRvRnVuY3Rpb24oYXJndW1lbnRzW2kgKyAxXSk7XG4gICAgdmFyIHBhdCA9IHsgZjogZiwgaXhzOiBbXSB9O1xuICAgIHZhciB0cmlnZ2VyRm91bmQgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBqID0gMCwgczsgaiA8IHBhdFNvdXJjZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIHMgPSBwYXRTb3VyY2VzW2pdO1xuICAgICAgdmFyIGluZGV4ID0gXy5pbmRleE9mKHNvdXJjZXMsIHMpO1xuICAgICAgaWYgKCF0cmlnZ2VyRm91bmQpIHtcbiAgICAgICAgdHJpZ2dlckZvdW5kID0gU291cmNlLmlzVHJpZ2dlcihzKTtcbiAgICAgIH1cbiAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgc291cmNlcy5wdXNoKHMpO1xuICAgICAgICBpbmRleCA9IHNvdXJjZXMubGVuZ3RoIC0gMTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGsgPSAwLCBpeDsgayA8IHBhdC5peHMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgaXggPSBwYXQuaXhzW2tdO1xuICAgICAgICBpZiAoaXguaW5kZXggPT09IGluZGV4KSB7XG4gICAgICAgICAgaXguY291bnQrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcGF0Lml4cy5wdXNoKHsgaW5kZXg6IGluZGV4LCBjb3VudDogMSB9KTtcbiAgICB9XG5cbiAgICBhc3NlcnQoXCJBdCBsZWFzdCBvbmUgRXZlbnRTdHJlYW0gcmVxdWlyZWRcIiwgdHJpZ2dlckZvdW5kIHx8ICFwYXRTb3VyY2VzLmxlbmd0aCk7XG5cbiAgICBpZiAocGF0U291cmNlcy5sZW5ndGggPiAwKSB7XG4gICAgICBwYXRzLnB1c2gocGF0KTtcbiAgICB9XG4gICAgaSA9IGkgKyAyO1xuICB9XG5cbiAgaWYgKCFzb3VyY2VzLmxlbmd0aCkge1xuICAgIHJldHVybiBCYWNvbi5uZXZlcigpO1xuICB9XG5cbiAgc291cmNlcyA9IF8ubWFwKFNvdXJjZS5mcm9tT2JzZXJ2YWJsZSwgc291cmNlcyk7XG4gIHZhciBuZWVkc0JhcnJpZXIgPSBfLmFueShzb3VyY2VzLCBmdW5jdGlvbiAocykge1xuICAgIHJldHVybiBzLmZsYXR0ZW47XG4gIH0pICYmIGNvbnRhaW5zRHVwbGljYXRlRGVwcyhfLm1hcChmdW5jdGlvbiAocykge1xuICAgIHJldHVybiBzLm9icztcbiAgfSwgc291cmNlcykpO1xuXG4gIHZhciBkZXNjID0gbmV3IEJhY29uLkRlc2MoQmFjb24sIFwid2hlblwiLCBwYXR0ZXJucyk7XG4gIHZhciByZXN1bHRTdHJlYW0gPSBuZXcgRXZlbnRTdHJlYW0oZGVzYywgZnVuY3Rpb24gKHNpbmspIHtcbiAgICB2YXIgdHJpZ2dlcnMgPSBbXTtcbiAgICB2YXIgZW5kcyA9IGZhbHNlO1xuICAgIHZhciBtYXRjaCA9IGZ1bmN0aW9uIChwKSB7XG4gICAgICBmb3IgKHZhciBpMSA9IDAsIGk7IGkxIDwgcC5peHMubGVuZ3RoOyBpMSsrKSB7XG4gICAgICAgIGkgPSBwLml4c1tpMV07XG4gICAgICAgIGlmICghc291cmNlc1tpLmluZGV4XS5oYXNBdExlYXN0KGkuY291bnQpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgIHZhciBjYW5ub3RTeW5jID0gZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgcmV0dXJuICFzb3VyY2Uuc3luYyB8fCBzb3VyY2UuZW5kZWQ7XG4gICAgfTtcbiAgICB2YXIgY2Fubm90TWF0Y2ggPSBmdW5jdGlvbiAocCkge1xuICAgICAgZm9yICh2YXIgaTEgPSAwLCBpOyBpMSA8IHAuaXhzLmxlbmd0aDsgaTErKykge1xuICAgICAgICBpID0gcC5peHNbaTFdO1xuICAgICAgICBpZiAoIXNvdXJjZXNbaS5pbmRleF0ubWF5SGF2ZShpLmNvdW50KSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgbm9uRmxhdHRlbmVkID0gZnVuY3Rpb24gKHRyaWdnZXIpIHtcbiAgICAgIHJldHVybiAhdHJpZ2dlci5zb3VyY2UuZmxhdHRlbjtcbiAgICB9O1xuICAgIHZhciBwYXJ0ID0gZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICh1bnN1YkFsbCkge1xuICAgICAgICB2YXIgZmx1c2hMYXRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gVXBkYXRlQmFycmllci53aGVuRG9uZVdpdGgocmVzdWx0U3RyZWFtLCBmbHVzaCk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBmbHVzaFdoaWxlVHJpZ2dlcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKHRyaWdnZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciByZXBseSA9IEJhY29uLm1vcmU7XG4gICAgICAgICAgICB2YXIgdHJpZ2dlciA9IHRyaWdnZXJzLnBvcCgpO1xuICAgICAgICAgICAgZm9yICh2YXIgaTEgPSAwLCBwOyBpMSA8IHBhdHMubGVuZ3RoOyBpMSsrKSB7XG4gICAgICAgICAgICAgIHAgPSBwYXRzW2kxXTtcbiAgICAgICAgICAgICAgaWYgKG1hdGNoKHApKSB7XG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50cyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgICAgICAgICBmb3IgKHZhciBpMiA9IDAsIGk7IGkyIDwgcC5peHMubGVuZ3RoOyBpMisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGkgPSBwLml4c1tpMl07XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHNvdXJjZXNbaS5pbmRleF0uY29uc3VtZSgpKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICByZXBseSA9IHNpbmsodHJpZ2dlci5lLmFwcGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBfcDtcblxuICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaTIgPSAwLCBldmVudDsgaTIgPCBldmVudHMubGVuZ3RoOyBpMisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgZXZlbnQgPSBldmVudHNbaTJdO1xuICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGV2ZW50LnZhbHVlKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuXG4gICAgICAgICAgICAgICAgICByZXR1cm4gKF9wID0gcCkuZi5hcHBseShfcCwgdmFsdWVzKTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgaWYgKHRyaWdnZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgdHJpZ2dlcnMgPSBfLmZpbHRlcihub25GbGF0dGVuZWQsIHRyaWdnZXJzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlcGx5ID09PSBCYWNvbi5ub01vcmUpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiByZXBseTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGZsdXNoV2hpbGVUcmlnZ2VycygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gQmFjb24ubW9yZTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHZhciBmbHVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgcmVwbHkgPSBmbHVzaFdoaWxlVHJpZ2dlcnMoKTtcbiAgICAgICAgICBpZiAoZW5kcykge1xuICAgICAgICAgICAgaWYgKF8uYWxsKHNvdXJjZXMsIGNhbm5vdFN5bmMpIHx8IF8uYWxsKHBhdHMsIGNhbm5vdE1hdGNoKSkge1xuICAgICAgICAgICAgICByZXBseSA9IEJhY29uLm5vTW9yZTtcbiAgICAgICAgICAgICAgc2luayhlbmRFdmVudCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlcGx5ID09PSBCYWNvbi5ub01vcmUpIHtcbiAgICAgICAgICAgIHVuc3ViQWxsKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHJlcGx5O1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGlmIChlLmlzRW5kKCkpIHtcbiAgICAgICAgICAgIGVuZHMgPSB0cnVlO1xuICAgICAgICAgICAgc291cmNlLm1hcmtFbmRlZCgpO1xuICAgICAgICAgICAgZmx1c2hMYXRlcigpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZS5pc0Vycm9yKCkpIHtcbiAgICAgICAgICAgIHZhciByZXBseSA9IHNpbmsoZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNvdXJjZS5wdXNoKGUpO1xuICAgICAgICAgICAgaWYgKHNvdXJjZS5zeW5jKSB7XG4gICAgICAgICAgICAgIHRyaWdnZXJzLnB1c2goeyBzb3VyY2U6IHNvdXJjZSwgZTogZSB9KTtcbiAgICAgICAgICAgICAgaWYgKG5lZWRzQmFycmllciB8fCBVcGRhdGVCYXJyaWVyLmhhc1dhaXRlcnMoKSkge1xuICAgICAgICAgICAgICAgIGZsdXNoTGF0ZXIoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmbHVzaCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXBseSA9PT0gQmFjb24ubm9Nb3JlKSB7XG4gICAgICAgICAgICB1bnN1YkFsbCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVwbHkgfHwgQmFjb24ubW9yZTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IEJhY29uLkNvbXBvc2l0ZVVuc3Vic2NyaWJlKChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICBmb3IgKHZhciBpMSA9IDAsIHM7IGkxIDwgc291cmNlcy5sZW5ndGg7IGkxKyspIHtcbiAgICAgICAgcyA9IHNvdXJjZXNbaTFdO1xuICAgICAgICByZXN1bHQucHVzaChwYXJ0KHMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSkoKSkudW5zdWJzY3JpYmU7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0U3RyZWFtO1xufTtcblxudmFyIGNvbnRhaW5zRHVwbGljYXRlRGVwcyA9IGZ1bmN0aW9uIChvYnNlcnZhYmxlcykge1xuICB2YXIgc3RhdGUgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBbXSA6IGFyZ3VtZW50c1sxXTtcblxuICB2YXIgY2hlY2tPYnNlcnZhYmxlID0gZnVuY3Rpb24gKG9icykge1xuICAgIGlmIChfLmNvbnRhaW5zKHN0YXRlLCBvYnMpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGRlcHMgPSBvYnMuaW50ZXJuYWxEZXBzKCk7XG4gICAgICBpZiAoZGVwcy5sZW5ndGgpIHtcbiAgICAgICAgc3RhdGUucHVzaChvYnMpO1xuICAgICAgICByZXR1cm4gXy5hbnkoZGVwcywgY2hlY2tPYnNlcnZhYmxlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXRlLnB1c2gob2JzKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICByZXR1cm4gXy5hbnkob2JzZXJ2YWJsZXMsIGNoZWNrT2JzZXJ2YWJsZSk7XG59O1xuXG52YXIgY29uc3RhbnRUb0Z1bmN0aW9uID0gZnVuY3Rpb24gKGYpIHtcbiAgaWYgKF8uaXNGdW5jdGlvbihmKSkge1xuICAgIHJldHVybiBmO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBfLmFsd2F5cyhmKTtcbiAgfVxufTtcblxuQmFjb24uZ3JvdXBTaW11bHRhbmVvdXMgPSBmdW5jdGlvbiAoKSB7XG4gIGZvciAodmFyIF9sZW41ID0gYXJndW1lbnRzLmxlbmd0aCwgc3RyZWFtcyA9IEFycmF5KF9sZW41KSwgX2tleTUgPSAwOyBfa2V5NSA8IF9sZW41OyBfa2V5NSsrKSB7XG4gICAgc3RyZWFtc1tfa2V5NV0gPSBhcmd1bWVudHNbX2tleTVdO1xuICB9XG5cbiAgaWYgKHN0cmVhbXMubGVuZ3RoID09PSAxICYmIGlzQXJyYXkoc3RyZWFtc1swXSkpIHtcbiAgICBzdHJlYW1zID0gc3RyZWFtc1swXTtcbiAgfVxuICB2YXIgc291cmNlcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBzOyBpIDwgc3RyZWFtcy5sZW5ndGg7IGkrKykge1xuICAgICAgcyA9IHN0cmVhbXNbaV07XG4gICAgICByZXN1bHQucHVzaChuZXcgQnVmZmVyaW5nU291cmNlKHMpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSkoKTtcbiAgcmV0dXJuIHdpdGhEZXNjKG5ldyBCYWNvbi5EZXNjKEJhY29uLCBcImdyb3VwU2ltdWx0YW5lb3VzXCIsIHN0cmVhbXMpLCBCYWNvbi53aGVuKHNvdXJjZXMsIGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBfbGVuNiA9IGFyZ3VtZW50cy5sZW5ndGgsIHhzID0gQXJyYXkoX2xlbjYpLCBfa2V5NiA9IDA7IF9rZXk2IDwgX2xlbjY7IF9rZXk2KyspIHtcbiAgICAgIHhzW19rZXk2XSA9IGFyZ3VtZW50c1tfa2V5Nl07XG4gICAgfVxuXG4gICAgcmV0dXJuIHhzO1xuICB9KSk7XG59O1xuXG5mdW5jdGlvbiBQcm9wZXJ0eURpc3BhdGNoZXIocHJvcGVydHksIHN1YnNjcmliZSwgaGFuZGxlRXZlbnQpIHtcbiAgRGlzcGF0Y2hlci5jYWxsKHRoaXMsIHN1YnNjcmliZSwgaGFuZGxlRXZlbnQpO1xuICB0aGlzLnByb3BlcnR5ID0gcHJvcGVydHk7XG4gIHRoaXMuc3Vic2NyaWJlID0gXy5iaW5kKHRoaXMuc3Vic2NyaWJlLCB0aGlzKTtcbiAgdGhpcy5jdXJyZW50ID0gTm9uZTtcbiAgdGhpcy5jdXJyZW50VmFsdWVSb290SWQgPSB1bmRlZmluZWQ7XG4gIHRoaXMucHJvcGVydHlFbmRlZCA9IGZhbHNlO1xufVxuXG5pbmhlcml0KFByb3BlcnR5RGlzcGF0Y2hlciwgRGlzcGF0Y2hlcik7XG5leHRlbmQoUHJvcGVydHlEaXNwYXRjaGVyLnByb3RvdHlwZSwge1xuICBwdXNoOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQuaXNFbmQoKSkge1xuICAgICAgdGhpcy5wcm9wZXJ0eUVuZGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGV2ZW50Lmhhc1ZhbHVlKCkpIHtcbiAgICAgIHRoaXMuY3VycmVudCA9IG5ldyBTb21lKGV2ZW50KTtcbiAgICAgIHRoaXMuY3VycmVudFZhbHVlUm9vdElkID0gVXBkYXRlQmFycmllci5jdXJyZW50RXZlbnRJZCgpO1xuICAgIH1cbiAgICByZXR1cm4gRGlzcGF0Y2hlci5wcm90b3R5cGUucHVzaC5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgfSxcblxuICBtYXliZVN1YlNvdXJjZTogZnVuY3Rpb24gKHNpbmssIHJlcGx5KSB7XG4gICAgaWYgKHJlcGx5ID09PSBCYWNvbi5ub01vcmUpIHtcbiAgICAgIHJldHVybiBub3A7XG4gICAgfSBlbHNlIGlmICh0aGlzLnByb3BlcnR5RW5kZWQpIHtcbiAgICAgIHNpbmsoZW5kRXZlbnQoKSk7XG4gICAgICByZXR1cm4gbm9wO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gRGlzcGF0Y2hlci5wcm90b3R5cGUuc3Vic2NyaWJlLmNhbGwodGhpcywgc2luayk7XG4gICAgfVxuICB9LFxuXG4gIHN1YnNjcmliZTogZnVuY3Rpb24gKHNpbmspIHtcbiAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgIHZhciBpbml0U2VudCA9IGZhbHNlO1xuXG4gICAgdmFyIHJlcGx5ID0gQmFjb24ubW9yZTtcblxuICAgIGlmICh0aGlzLmN1cnJlbnQuaXNEZWZpbmVkICYmICh0aGlzLmhhc1N1YnNjcmliZXJzKCkgfHwgdGhpcy5wcm9wZXJ0eUVuZGVkKSkge1xuICAgICAgdmFyIGRpc3BhdGNoaW5nSWQgPSBVcGRhdGVCYXJyaWVyLmN1cnJlbnRFdmVudElkKCk7XG4gICAgICB2YXIgdmFsSWQgPSB0aGlzLmN1cnJlbnRWYWx1ZVJvb3RJZDtcbiAgICAgIGlmICghdGhpcy5wcm9wZXJ0eUVuZGVkICYmIHZhbElkICYmIGRpc3BhdGNoaW5nSWQgJiYgZGlzcGF0Y2hpbmdJZCAhPT0gdmFsSWQpIHtcbiAgICAgICAgVXBkYXRlQmFycmllci53aGVuRG9uZVdpdGgodGhpcy5wcm9wZXJ0eSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmIChfdGhpczMuY3VycmVudFZhbHVlUm9vdElkID09PSB2YWxJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHNpbmsoaW5pdGlhbEV2ZW50KF90aGlzMy5jdXJyZW50LmdldCgpLnZhbHVlKCkpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLm1heWJlU3ViU291cmNlKHNpbmssIHJlcGx5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFVwZGF0ZUJhcnJpZXIuaW5UcmFuc2FjdGlvbih1bmRlZmluZWQsIHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXBseSA9IHNpbmsoaW5pdGlhbEV2ZW50KHRoaXMuY3VycmVudC5nZXQoKS52YWx1ZSgpKSk7XG4gICAgICAgICAgcmV0dXJuIHJlcGx5O1xuICAgICAgICB9LCBbXSk7XG4gICAgICAgIHJldHVybiB0aGlzLm1heWJlU3ViU291cmNlKHNpbmssIHJlcGx5KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMubWF5YmVTdWJTb3VyY2Uoc2luaywgcmVwbHkpO1xuICAgIH1cbiAgfVxufSk7XG5cbmZ1bmN0aW9uIFByb3BlcnR5KGRlc2MsIHN1YnNjcmliZSwgaGFuZGxlcikge1xuICBPYnNlcnZhYmxlLmNhbGwodGhpcywgZGVzYyk7XG4gIGFzc2VydEZ1bmN0aW9uKHN1YnNjcmliZSk7XG4gIHRoaXMuZGlzcGF0Y2hlciA9IG5ldyBQcm9wZXJ0eURpc3BhdGNoZXIodGhpcywgc3Vic2NyaWJlLCBoYW5kbGVyKTtcbiAgcmVnaXN0ZXJPYnModGhpcyk7XG59XG5cbmluaGVyaXQoUHJvcGVydHksIE9ic2VydmFibGUpO1xuZXh0ZW5kKFByb3BlcnR5LnByb3RvdHlwZSwge1xuICBfaXNQcm9wZXJ0eTogdHJ1ZSxcblxuICBjaGFuZ2VzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICByZXR1cm4gbmV3IEV2ZW50U3RyZWFtKG5ldyBCYWNvbi5EZXNjKHRoaXMsIFwiY2hhbmdlc1wiLCBbXSksIGZ1bmN0aW9uIChzaW5rKSB7XG4gICAgICByZXR1cm4gX3RoaXM0LmRpc3BhdGNoZXIuc3Vic2NyaWJlKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAoIWV2ZW50LmlzSW5pdGlhbCgpKSB7XG4gICAgICAgICAgcmV0dXJuIHNpbmsoZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICB3aXRoSGFuZGxlcjogZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb3BlcnR5KG5ldyBCYWNvbi5EZXNjKHRoaXMsIFwid2l0aEhhbmRsZXJcIiwgW2hhbmRsZXJdKSwgdGhpcy5kaXNwYXRjaGVyLnN1YnNjcmliZSwgaGFuZGxlcik7XG4gIH0sXG5cbiAgdG9Qcm9wZXJ0eTogZnVuY3Rpb24gKCkge1xuICAgIGFzc2VydE5vQXJndW1lbnRzKGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgdG9FdmVudFN0cmVhbTogZnVuY3Rpb24gKCkge1xuICAgIHZhciBfdGhpczUgPSB0aGlzO1xuXG4gICAgcmV0dXJuIG5ldyBFdmVudFN0cmVhbShuZXcgQmFjb24uRGVzYyh0aGlzLCBcInRvRXZlbnRTdHJlYW1cIiwgW10pLCBmdW5jdGlvbiAoc2luaykge1xuICAgICAgcmV0dXJuIF90aGlzNS5kaXNwYXRjaGVyLnN1YnNjcmliZShmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LmlzSW5pdGlhbCgpKSB7XG4gICAgICAgICAgZXZlbnQgPSBldmVudC50b05leHQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2luayhldmVudCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufSk7XG5cbkJhY29uLlByb3BlcnR5ID0gUHJvcGVydHk7XG5cbkJhY29uLmNvbnN0YW50ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiBuZXcgUHJvcGVydHkobmV3IEJhY29uLkRlc2MoQmFjb24sIFwiY29uc3RhbnRcIiwgW3ZhbHVlXSksIGZ1bmN0aW9uIChzaW5rKSB7XG4gICAgc2luayhpbml0aWFsRXZlbnQodmFsdWUpKTtcbiAgICBzaW5rKGVuZEV2ZW50KCkpO1xuICAgIHJldHVybiBub3A7XG4gIH0pO1xufTtcblxuQmFjb24uZnJvbUJpbmRlciA9IGZ1bmN0aW9uIChiaW5kZXIpIHtcbiAgdmFyIGV2ZW50VHJhbnNmb3JtZXIgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBfLmlkIDogYXJndW1lbnRzWzFdO1xuXG4gIHZhciBkZXNjID0gbmV3IEJhY29uLkRlc2MoQmFjb24sIFwiZnJvbUJpbmRlclwiLCBbYmluZGVyLCBldmVudFRyYW5zZm9ybWVyXSk7XG4gIHJldHVybiBuZXcgRXZlbnRTdHJlYW0oZGVzYywgZnVuY3Rpb24gKHNpbmspIHtcbiAgICB2YXIgdW5ib3VuZCA9IGZhbHNlO1xuICAgIHZhciBzaG91bGRVbmJpbmQgPSBmYWxzZTtcbiAgICB2YXIgdW5iaW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCF1bmJvdW5kKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdW5iaW5kZXIgIT09IFwidW5kZWZpbmVkXCIgJiYgdW5iaW5kZXIgIT09IG51bGwpIHtcbiAgICAgICAgICB1bmJpbmRlcigpO1xuICAgICAgICAgIHJldHVybiB1bmJvdW5kID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gc2hvdWxkVW5iaW5kID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgdmFyIHVuYmluZGVyID0gYmluZGVyKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciByZWY7XG5cbiAgICAgIGZvciAodmFyIF9sZW43ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW43KSwgX2tleTcgPSAwOyBfa2V5NyA8IF9sZW43OyBfa2V5NysrKSB7XG4gICAgICAgIGFyZ3NbX2tleTddID0gYXJndW1lbnRzW19rZXk3XTtcbiAgICAgIH1cblxuICAgICAgdmFyIHZhbHVlID0gZXZlbnRUcmFuc2Zvcm1lci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgIGlmICghKGlzQXJyYXkodmFsdWUpICYmICgocmVmID0gXy5sYXN0KHZhbHVlKSkgIT0gbnVsbCA/IHJlZi5faXNFdmVudCA6IHVuZGVmaW5lZCkpKSB7XG4gICAgICAgIHZhbHVlID0gW3ZhbHVlXTtcbiAgICAgIH1cbiAgICAgIHZhciByZXBseSA9IEJhY29uLm1vcmU7XG4gICAgICBmb3IgKHZhciBpID0gMCwgZXZlbnQ7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBldmVudCA9IHZhbHVlW2ldO1xuICAgICAgICByZXBseSA9IHNpbmsoZXZlbnQgPSB0b0V2ZW50KGV2ZW50KSk7XG4gICAgICAgIGlmIChyZXBseSA9PT0gQmFjb24ubm9Nb3JlIHx8IGV2ZW50LmlzRW5kKCkpIHtcbiAgICAgICAgICB1bmJpbmQoKTtcbiAgICAgICAgICByZXR1cm4gcmVwbHk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXBseTtcbiAgICB9KTtcbiAgICBpZiAoc2hvdWxkVW5iaW5kKSB7XG4gICAgICB1bmJpbmQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuYmluZDtcbiAgfSk7XG59O1xuXG5CYWNvbi5PYnNlcnZhYmxlLnByb3RvdHlwZS5tYXAgPSBmdW5jdGlvbiAocCkge1xuICBmb3IgKHZhciBfbGVuOCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuOCA+IDEgPyBfbGVuOCAtIDEgOiAwKSwgX2tleTggPSAxOyBfa2V5OCA8IF9sZW44OyBfa2V5OCsrKSB7XG4gICAgYXJnc1tfa2V5OCAtIDFdID0gYXJndW1lbnRzW19rZXk4XTtcbiAgfVxuXG4gIHJldHVybiBjb252ZXJ0QXJnc1RvRnVuY3Rpb24odGhpcywgcCwgYXJncywgZnVuY3Rpb24gKGYpIHtcbiAgICByZXR1cm4gd2l0aERlc2MobmV3IEJhY29uLkRlc2ModGhpcywgXCJtYXBcIiwgW2ZdKSwgdGhpcy53aXRoSGFuZGxlcihmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnB1c2goZXZlbnQuZm1hcChmKSk7XG4gICAgfSkpO1xuICB9KTtcbn07XG5cbnZhciBhcmd1bWVudHNUb09ic2VydmFibGVzID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgaWYgKGlzQXJyYXkoYXJnc1swXSkpIHtcbiAgICByZXR1cm4gYXJnc1swXTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJncyk7XG4gIH1cbn07XG5cbnZhciBhcmd1bWVudHNUb09ic2VydmFibGVzQW5kRnVuY3Rpb24gPSBmdW5jdGlvbiAoYXJncykge1xuICBpZiAoXy5pc0Z1bmN0aW9uKGFyZ3NbMF0pKSB7XG4gICAgcmV0dXJuIFthcmd1bWVudHNUb09ic2VydmFibGVzKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MsIDEpKSwgYXJnc1swXV07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFthcmd1bWVudHNUb09ic2VydmFibGVzKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MsIDAsIGFyZ3MubGVuZ3RoIC0gMSkpLCBfLmxhc3QoYXJncyldO1xuICB9XG59O1xuXG5CYWNvbi5jb21iaW5lQXNBcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHN0cmVhbXMgPSBhcmd1bWVudHNUb09ic2VydmFibGVzKGFyZ3VtZW50cyk7XG4gIGZvciAodmFyIGluZGV4ID0gMCwgc3RyZWFtOyBpbmRleCA8IHN0cmVhbXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgc3RyZWFtID0gc3RyZWFtc1tpbmRleF07XG4gICAgaWYgKCFpc09ic2VydmFibGUoc3RyZWFtKSkge1xuICAgICAgc3RyZWFtc1tpbmRleF0gPSBCYWNvbi5jb25zdGFudChzdHJlYW0pO1xuICAgIH1cbiAgfVxuICBpZiAoc3RyZWFtcy5sZW5ndGgpIHtcbiAgICB2YXIgc291cmNlcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMCwgczsgaSA8IHN0cmVhbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcyA9IHN0cmVhbXNbaV07XG4gICAgICAgIHJlc3VsdC5wdXNoKG5ldyBTb3VyY2UocywgdHJ1ZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9KSgpO1xuICAgIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyhCYWNvbiwgXCJjb21iaW5lQXNBcnJheVwiLCBzdHJlYW1zKSwgQmFjb24ud2hlbihzb3VyY2VzLCBmdW5jdGlvbiAoKSB7XG4gICAgICBmb3IgKHZhciBfbGVuOSA9IGFyZ3VtZW50cy5sZW5ndGgsIHhzID0gQXJyYXkoX2xlbjkpLCBfa2V5OSA9IDA7IF9rZXk5IDwgX2xlbjk7IF9rZXk5KyspIHtcbiAgICAgICAgeHNbX2tleTldID0gYXJndW1lbnRzW19rZXk5XTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHhzO1xuICAgIH0pLnRvUHJvcGVydHkoKSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIEJhY29uLmNvbnN0YW50KFtdKTtcbiAgfVxufTtcblxuQmFjb24ub25WYWx1ZXMgPSBmdW5jdGlvbiAoKSB7XG4gIGZvciAodmFyIF9sZW4xMCA9IGFyZ3VtZW50cy5sZW5ndGgsIHN0cmVhbXMgPSBBcnJheShfbGVuMTApLCBfa2V5MTAgPSAwOyBfa2V5MTAgPCBfbGVuMTA7IF9rZXkxMCsrKSB7XG4gICAgc3RyZWFtc1tfa2V5MTBdID0gYXJndW1lbnRzW19rZXkxMF07XG4gIH1cblxuICByZXR1cm4gQmFjb24uY29tYmluZUFzQXJyYXkoc3RyZWFtcy5zbGljZSgwLCBzdHJlYW1zLmxlbmd0aCAtIDEpKS5vblZhbHVlcyhzdHJlYW1zW3N0cmVhbXMubGVuZ3RoIC0gMV0pO1xufTtcblxuQmFjb24uY29tYmluZVdpdGggPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXJndW1lbnRzVG9PYnNlcnZhYmxlc0FuZEZ1bmN0aW9uID0gYXJndW1lbnRzVG9PYnNlcnZhYmxlc0FuZEZ1bmN0aW9uKGFyZ3VtZW50cyk7XG5cbiAgdmFyIHN0cmVhbXMgPSBfYXJndW1lbnRzVG9PYnNlcnZhYmxlc0FuZEZ1bmN0aW9uWzBdO1xuICB2YXIgZiA9IF9hcmd1bWVudHNUb09ic2VydmFibGVzQW5kRnVuY3Rpb25bMV07XG5cbiAgdmFyIGRlc2MgPSBuZXcgQmFjb24uRGVzYyhCYWNvbiwgXCJjb21iaW5lV2l0aFwiLCBbZl0uY29uY2F0KHN0cmVhbXMpKTtcbiAgcmV0dXJuIHdpdGhEZXNjKGRlc2MsIEJhY29uLmNvbWJpbmVBc0FycmF5KHN0cmVhbXMpLm1hcChmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgcmV0dXJuIGYuYXBwbHkodW5kZWZpbmVkLCB2YWx1ZXMpO1xuICB9KSk7XG59O1xuXG5CYWNvbi5PYnNlcnZhYmxlLnByb3RvdHlwZS5jb21iaW5lID0gZnVuY3Rpb24gKG90aGVyLCBmKSB7XG4gIHZhciBjb21iaW5hdG9yID0gdG9Db21iaW5hdG9yKGYpO1xuICB2YXIgZGVzYyA9IG5ldyBCYWNvbi5EZXNjKHRoaXMsIFwiY29tYmluZVwiLCBbb3RoZXIsIGZdKTtcbiAgcmV0dXJuIHdpdGhEZXNjKGRlc2MsIEJhY29uLmNvbWJpbmVBc0FycmF5KHRoaXMsIG90aGVyKS5tYXAoZnVuY3Rpb24gKHZhbHVlcykge1xuICAgIHJldHVybiBjb21iaW5hdG9yKHZhbHVlc1swXSwgdmFsdWVzWzFdKTtcbiAgfSkpO1xufTtcblxuQmFjb24uT2JzZXJ2YWJsZS5wcm90b3R5cGUud2l0aFN0YXRlTWFjaGluZSA9IGZ1bmN0aW9uIChpbml0U3RhdGUsIGYpIHtcbiAgdmFyIHN0YXRlID0gaW5pdFN0YXRlO1xuICB2YXIgZGVzYyA9IG5ldyBCYWNvbi5EZXNjKHRoaXMsIFwid2l0aFN0YXRlTWFjaGluZVwiLCBbaW5pdFN0YXRlLCBmXSk7XG4gIHJldHVybiB3aXRoRGVzYyhkZXNjLCB0aGlzLndpdGhIYW5kbGVyKGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBmcm9tRiA9IGYoc3RhdGUsIGV2ZW50KTtcbiAgICB2YXIgbmV3U3RhdGUgPSBmcm9tRlswXTtcbiAgICB2YXIgb3V0cHV0cyA9IGZyb21GWzFdO1xuXG4gICAgc3RhdGUgPSBuZXdTdGF0ZTtcbiAgICB2YXIgcmVwbHkgPSBCYWNvbi5tb3JlO1xuICAgIGZvciAodmFyIGkgPSAwLCBvdXRwdXQ7IGkgPCBvdXRwdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvdXRwdXQgPSBvdXRwdXRzW2ldO1xuICAgICAgcmVwbHkgPSB0aGlzLnB1c2gob3V0cHV0KTtcbiAgICAgIGlmIChyZXBseSA9PT0gQmFjb24ubm9Nb3JlKSB7XG4gICAgICAgIHJldHVybiByZXBseTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcGx5O1xuICB9KSk7XG59O1xuXG52YXIgZXF1YWxzID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgcmV0dXJuIGEgPT09IGI7XG59O1xuXG52YXIgaXNOb25lID0gZnVuY3Rpb24gKG9iamVjdCkge1xuICByZXR1cm4gdHlwZW9mIG9iamVjdCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBvYmplY3QgIT09IG51bGwgPyBvYmplY3QuX2lzTm9uZSA6IGZhbHNlO1xufTtcblxuQmFjb24uT2JzZXJ2YWJsZS5wcm90b3R5cGUuc2tpcER1cGxpY2F0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpc0VxdWFsID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gZXF1YWxzIDogYXJndW1lbnRzWzBdO1xuXG4gIHZhciBkZXNjID0gbmV3IEJhY29uLkRlc2ModGhpcywgXCJza2lwRHVwbGljYXRlc1wiLCBbXSk7XG4gIHJldHVybiB3aXRoRGVzYyhkZXNjLCB0aGlzLndpdGhTdGF0ZU1hY2hpbmUoTm9uZSwgZnVuY3Rpb24gKHByZXYsIGV2ZW50KSB7XG4gICAgaWYgKCFldmVudC5oYXNWYWx1ZSgpKSB7XG4gICAgICByZXR1cm4gW3ByZXYsIFtldmVudF1dO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQuaXNJbml0aWFsKCkgfHwgaXNOb25lKHByZXYpIHx8ICFpc0VxdWFsKHByZXYuZ2V0KCksIGV2ZW50LnZhbHVlKCkpKSB7XG4gICAgICByZXR1cm4gW25ldyBTb21lKGV2ZW50LnZhbHVlKCkpLCBbZXZlbnRdXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFtwcmV2LCBbXV07XG4gICAgfVxuICB9KSk7XG59O1xuXG5CYWNvbi5PYnNlcnZhYmxlLnByb3RvdHlwZS5hd2FpdGluZyA9IGZ1bmN0aW9uIChvdGhlcikge1xuICB2YXIgZGVzYyA9IG5ldyBCYWNvbi5EZXNjKHRoaXMsIFwiYXdhaXRpbmdcIiwgW290aGVyXSk7XG4gIHJldHVybiB3aXRoRGVzYyhkZXNjLCBCYWNvbi5ncm91cFNpbXVsdGFuZW91cyh0aGlzLCBvdGhlcikubWFwKGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICByZXR1cm4gdmFsdWVzWzFdLmxlbmd0aCA9PT0gMDtcbiAgfSkudG9Qcm9wZXJ0eShmYWxzZSkuc2tpcER1cGxpY2F0ZXMoKSk7XG59O1xuXG5CYWNvbi5PYnNlcnZhYmxlLnByb3RvdHlwZS5ub3QgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyh0aGlzLCBcIm5vdFwiLCBbXSksIHRoaXMubWFwKGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuICF4O1xuICB9KSk7XG59O1xuXG5CYWNvbi5Qcm9wZXJ0eS5wcm90b3R5cGUuYW5kID0gZnVuY3Rpb24gKG90aGVyKSB7XG4gIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyh0aGlzLCBcImFuZFwiLCBbb3RoZXJdKSwgdGhpcy5jb21iaW5lKG90aGVyLCBmdW5jdGlvbiAoeCwgeSkge1xuICAgIHJldHVybiB4ICYmIHk7XG4gIH0pKTtcbn07XG5cbkJhY29uLlByb3BlcnR5LnByb3RvdHlwZS5vciA9IGZ1bmN0aW9uIChvdGhlcikge1xuICByZXR1cm4gd2l0aERlc2MobmV3IEJhY29uLkRlc2ModGhpcywgXCJvclwiLCBbb3RoZXJdKSwgdGhpcy5jb21iaW5lKG90aGVyLCBmdW5jdGlvbiAoeCwgeSkge1xuICAgIHJldHVybiB4IHx8IHk7XG4gIH0pKTtcbn07XG5cbkJhY29uLnNjaGVkdWxlciA9IHtcbiAgc2V0VGltZW91dDogZnVuY3Rpb24gKGYsIGQpIHtcbiAgICByZXR1cm4gc2V0VGltZW91dChmLCBkKTtcbiAgfSxcbiAgc2V0SW50ZXJ2YWw6IGZ1bmN0aW9uIChmLCBpKSB7XG4gICAgcmV0dXJuIHNldEludGVydmFsKGYsIGkpO1xuICB9LFxuICBjbGVhckludGVydmFsOiBmdW5jdGlvbiAoaWQpIHtcbiAgICByZXR1cm4gY2xlYXJJbnRlcnZhbChpZCk7XG4gIH0sXG4gIGNsZWFyVGltZW91dDogZnVuY3Rpb24gKGlkKSB7XG4gICAgcmV0dXJuIGNsZWFyVGltZW91dChpZCk7XG4gIH0sXG4gIG5vdzogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfVxufTtcblxuQmFjb24uRXZlbnRTdHJlYW0ucHJvdG90eXBlLmJ1ZmZlcldpdGhUaW1lID0gZnVuY3Rpb24gKGRlbGF5KSB7XG4gIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyh0aGlzLCBcImJ1ZmZlcldpdGhUaW1lXCIsIFtkZWxheV0pLCB0aGlzLmJ1ZmZlcldpdGhUaW1lT3JDb3VudChkZWxheSwgTnVtYmVyLk1BWF9WQUxVRSkpO1xufTtcblxuQmFjb24uRXZlbnRTdHJlYW0ucHJvdG90eXBlLmJ1ZmZlcldpdGhDb3VudCA9IGZ1bmN0aW9uIChjb3VudCkge1xuICByZXR1cm4gd2l0aERlc2MobmV3IEJhY29uLkRlc2ModGhpcywgXCJidWZmZXJXaXRoQ291bnRcIiwgW2NvdW50XSksIHRoaXMuYnVmZmVyV2l0aFRpbWVPckNvdW50KHVuZGVmaW5lZCwgY291bnQpKTtcbn07XG5cbkJhY29uLkV2ZW50U3RyZWFtLnByb3RvdHlwZS5idWZmZXJXaXRoVGltZU9yQ291bnQgPSBmdW5jdGlvbiAoZGVsYXksIGNvdW50KSB7XG4gIHZhciBmbHVzaE9yU2NoZWR1bGUgPSBmdW5jdGlvbiAoYnVmZmVyKSB7XG4gICAgaWYgKGJ1ZmZlci52YWx1ZXMubGVuZ3RoID09PSBjb3VudCkge1xuICAgICAgcmV0dXJuIGJ1ZmZlci5mbHVzaCgpO1xuICAgIH0gZWxzZSBpZiAoZGVsYXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGJ1ZmZlci5zY2hlZHVsZSgpO1xuICAgIH1cbiAgfTtcbiAgdmFyIGRlc2MgPSBuZXcgQmFjb24uRGVzYyh0aGlzLCBcImJ1ZmZlcldpdGhUaW1lT3JDb3VudFwiLCBbZGVsYXksIGNvdW50XSk7XG4gIHJldHVybiB3aXRoRGVzYyhkZXNjLCB0aGlzLmJ1ZmZlcihkZWxheSwgZmx1c2hPclNjaGVkdWxlLCBmbHVzaE9yU2NoZWR1bGUpKTtcbn07XG5cbkJhY29uLkV2ZW50U3RyZWFtLnByb3RvdHlwZS5idWZmZXIgPSBmdW5jdGlvbiAoZGVsYXkpIHtcbiAgdmFyIG9uSW5wdXQgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyBub3AgOiBhcmd1bWVudHNbMV07XG4gIHZhciBvbkZsdXNoID0gYXJndW1lbnRzLmxlbmd0aCA8PSAyIHx8IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8gbm9wIDogYXJndW1lbnRzWzJdO1xuXG4gIHZhciBidWZmZXIgPSB7XG4gICAgc2NoZWR1bGVkOiBudWxsLFxuICAgIGVuZDogdW5kZWZpbmVkLFxuICAgIHZhbHVlczogW10sXG4gICAgZmx1c2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLnNjaGVkdWxlZCkge1xuICAgICAgICBCYWNvbi5zY2hlZHVsZXIuY2xlYXJUaW1lb3V0KHRoaXMuc2NoZWR1bGVkKTtcbiAgICAgICAgdGhpcy5zY2hlZHVsZWQgPSBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMudmFsdWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIHZhbHVlc1RvUHVzaCA9IHRoaXMudmFsdWVzO1xuICAgICAgICB0aGlzLnZhbHVlcyA9IFtdO1xuICAgICAgICB2YXIgcmVwbHkgPSB0aGlzLnB1c2gobmV4dEV2ZW50KHZhbHVlc1RvUHVzaCkpO1xuICAgICAgICBpZiAodGhpcy5lbmQgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnB1c2godGhpcy5lbmQpO1xuICAgICAgICB9IGVsc2UgaWYgKHJlcGx5ICE9PSBCYWNvbi5ub01vcmUpIHtcbiAgICAgICAgICByZXR1cm4gb25GbHVzaCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuZW5kICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5wdXNoKHRoaXMuZW5kKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgc2NoZWR1bGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfdGhpczYgPSB0aGlzO1xuXG4gICAgICBpZiAoIXRoaXMuc2NoZWR1bGVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNjaGVkdWxlZCA9IGRlbGF5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXM2LmZsdXNoKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgdmFyIHJlcGx5ID0gQmFjb24ubW9yZTtcbiAgaWYgKCFfLmlzRnVuY3Rpb24oZGVsYXkpKSB7XG4gICAgdmFyIGRlbGF5TXMgPSBkZWxheTtcbiAgICBkZWxheSA9IGZ1bmN0aW9uIChmKSB7XG4gICAgICByZXR1cm4gQmFjb24uc2NoZWR1bGVyLnNldFRpbWVvdXQoZiwgZGVsYXlNcyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gd2l0aERlc2MobmV3IEJhY29uLkRlc2ModGhpcywgXCJidWZmZXJcIiwgW10pLCB0aGlzLndpdGhIYW5kbGVyKGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBfdGhpczcgPSB0aGlzO1xuXG4gICAgYnVmZmVyLnB1c2ggPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHJldHVybiBfdGhpczcucHVzaChldmVudCk7XG4gICAgfTtcbiAgICBpZiAoZXZlbnQuaXNFcnJvcigpKSB7XG4gICAgICByZXBseSA9IHRoaXMucHVzaChldmVudCk7XG4gICAgfSBlbHNlIGlmIChldmVudC5pc0VuZCgpKSB7XG4gICAgICBidWZmZXIuZW5kID0gZXZlbnQ7XG4gICAgICBpZiAoIWJ1ZmZlci5zY2hlZHVsZWQpIHtcbiAgICAgICAgYnVmZmVyLmZsdXNoKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1ZmZlci52YWx1ZXMucHVzaChldmVudC52YWx1ZSgpKTtcblxuICAgICAgb25JbnB1dChidWZmZXIpO1xuICAgIH1cbiAgICByZXR1cm4gcmVwbHk7XG4gIH0pKTtcbn07XG5cbkJhY29uLk9ic2VydmFibGUucHJvdG90eXBlLmZpbHRlciA9IGZ1bmN0aW9uIChmKSB7XG4gIGFzc2VydE9ic2VydmFibGVJc1Byb3BlcnR5KGYpO1xuXG4gIGZvciAodmFyIF9sZW4xMSA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMTEgPiAxID8gX2xlbjExIC0gMSA6IDApLCBfa2V5MTEgPSAxOyBfa2V5MTEgPCBfbGVuMTE7IF9rZXkxMSsrKSB7XG4gICAgYXJnc1tfa2V5MTEgLSAxXSA9IGFyZ3VtZW50c1tfa2V5MTFdO1xuICB9XG5cbiAgcmV0dXJuIGNvbnZlcnRBcmdzVG9GdW5jdGlvbih0aGlzLCBmLCBhcmdzLCBmdW5jdGlvbiAoZikge1xuICAgIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyh0aGlzLCBcImZpbHRlclwiLCBbZl0pLCB0aGlzLndpdGhIYW5kbGVyKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYgKGV2ZW50LmZpbHRlcihmKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdXNoKGV2ZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBCYWNvbi5tb3JlO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfSk7XG59O1xuXG5CYWNvbi5vbmNlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiBuZXcgRXZlbnRTdHJlYW0obmV3IERlc2MoQmFjb24sIFwib25jZVwiLCBbdmFsdWVdKSwgZnVuY3Rpb24gKHNpbmspIHtcbiAgICBzaW5rKHRvRXZlbnQodmFsdWUpKTtcbiAgICBzaW5rKGVuZEV2ZW50KCkpO1xuICAgIHJldHVybiBub3A7XG4gIH0pO1xufTtcblxuQmFjb24uRXZlbnRTdHJlYW0ucHJvdG90eXBlLmNvbmNhdCA9IGZ1bmN0aW9uIChyaWdodCkge1xuICB2YXIgbGVmdCA9IHRoaXM7XG4gIHJldHVybiBuZXcgRXZlbnRTdHJlYW0obmV3IEJhY29uLkRlc2MobGVmdCwgXCJjb25jYXRcIiwgW3JpZ2h0XSksIGZ1bmN0aW9uIChzaW5rKSB7XG4gICAgdmFyIHVuc3ViUmlnaHQgPSBub3A7XG4gICAgdmFyIHVuc3ViTGVmdCA9IGxlZnQuZGlzcGF0Y2hlci5zdWJzY3JpYmUoZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmIChlLmlzRW5kKCkpIHtcbiAgICAgICAgdW5zdWJSaWdodCA9IHJpZ2h0LmRpc3BhdGNoZXIuc3Vic2NyaWJlKHNpbmspO1xuICAgICAgICByZXR1cm4gdW5zdWJSaWdodDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzaW5rKGUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gKHVuc3ViTGVmdCgpLCB1bnN1YlJpZ2h0KCkpO1xuICAgIH07XG4gIH0pO1xufTtcblxuQmFjb24uT2JzZXJ2YWJsZS5wcm90b3R5cGUuZmxhdE1hcCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGZsYXRNYXBfKHRoaXMsIG1ha2VTcGF3bmVyKGFyZ3VtZW50cykpO1xufTtcblxuQmFjb24uT2JzZXJ2YWJsZS5wcm90b3R5cGUuZmxhdE1hcEZpcnN0ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZmxhdE1hcF8odGhpcywgbWFrZVNwYXduZXIoYXJndW1lbnRzKSwgdHJ1ZSk7XG59O1xuXG52YXIgbWFrZVNwYXduZXIgPSBmdW5jdGlvbiAoYXJncykge1xuICBpZiAoYXJncy5sZW5ndGggPT09IDEgJiYgaXNPYnNlcnZhYmxlKGFyZ3NbMF0pKSB7XG4gICAgcmV0dXJuIF8uYWx3YXlzKGFyZ3NbMF0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBtYWtlRnVuY3Rpb25BcmdzKGFyZ3MpO1xuICB9XG59O1xuXG52YXIgbWFrZU9ic2VydmFibGUgPSBmdW5jdGlvbiAoeCkge1xuICBpZiAoaXNPYnNlcnZhYmxlKHgpKSB7XG4gICAgcmV0dXJuIHg7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIEJhY29uLm9uY2UoeCk7XG4gIH1cbn07XG5cbnZhciBmbGF0TWFwXyA9IGZ1bmN0aW9uIChyb290LCBmLCBmaXJzdE9ubHksIGxpbWl0KSB7XG4gIHZhciByb290RGVwID0gW3Jvb3RdO1xuICB2YXIgY2hpbGREZXBzID0gW107XG4gIHZhciBkZXNjID0gbmV3IEJhY29uLkRlc2Mocm9vdCwgXCJmbGF0TWFwXCIgKyAoZmlyc3RPbmx5ID8gXCJGaXJzdFwiIDogXCJcIiksIFtmXSk7XG4gIHZhciByZXN1bHQgPSBuZXcgRXZlbnRTdHJlYW0oZGVzYywgZnVuY3Rpb24gKHNpbmspIHtcbiAgICB2YXIgY29tcG9zaXRlID0gbmV3IENvbXBvc2l0ZVVuc3Vic2NyaWJlKCk7XG4gICAgdmFyIHF1ZXVlID0gW107XG4gICAgdmFyIHNwYXduID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICB2YXIgY2hpbGQgPSBtYWtlT2JzZXJ2YWJsZShmKGV2ZW50LnZhbHVlKCkpKTtcbiAgICAgIGNoaWxkRGVwcy5wdXNoKGNoaWxkKTtcbiAgICAgIHJldHVybiBjb21wb3NpdGUuYWRkKGZ1bmN0aW9uICh1bnN1YkFsbCwgdW5zdWJNZSkge1xuICAgICAgICByZXR1cm4gY2hpbGQuZGlzcGF0Y2hlci5zdWJzY3JpYmUoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgaWYgKGV2ZW50LmlzRW5kKCkpIHtcbiAgICAgICAgICAgIF8ucmVtb3ZlKGNoaWxkLCBjaGlsZERlcHMpO1xuICAgICAgICAgICAgY2hlY2tRdWV1ZSgpO1xuICAgICAgICAgICAgY2hlY2tFbmQodW5zdWJNZSk7XG4gICAgICAgICAgICByZXR1cm4gQmFjb24ubm9Nb3JlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGV2ZW50ICE9PSBcInVuZGVmaW5lZFwiICYmIGV2ZW50ICE9PSBudWxsID8gZXZlbnQuX2lzSW5pdGlhbCA6IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBldmVudCA9IGV2ZW50LnRvTmV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHJlcGx5ID0gc2luayhldmVudCk7XG4gICAgICAgICAgICBpZiAocmVwbHkgPT09IEJhY29uLm5vTW9yZSkge1xuICAgICAgICAgICAgICB1bnN1YkFsbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlcGx5O1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHZhciBjaGVja1F1ZXVlID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGV2ZW50ID0gcXVldWUuc2hpZnQoKTtcbiAgICAgIGlmIChldmVudCkge1xuICAgICAgICByZXR1cm4gc3Bhd24oZXZlbnQpO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGNoZWNrRW5kID0gZnVuY3Rpb24gKHVuc3ViKSB7XG4gICAgICB1bnN1YigpO1xuICAgICAgaWYgKGNvbXBvc2l0ZS5lbXB0eSgpKSB7XG4gICAgICAgIHJldHVybiBzaW5rKGVuZEV2ZW50KCkpO1xuICAgICAgfVxuICAgIH07XG4gICAgY29tcG9zaXRlLmFkZChmdW5jdGlvbiAoX18sIHVuc3ViUm9vdCkge1xuICAgICAgcmV0dXJuIHJvb3QuZGlzcGF0Y2hlci5zdWJzY3JpYmUoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5pc0VuZCgpKSB7XG4gICAgICAgICAgcmV0dXJuIGNoZWNrRW5kKHVuc3ViUm9vdCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuaXNFcnJvcigpKSB7XG4gICAgICAgICAgcmV0dXJuIHNpbmsoZXZlbnQpO1xuICAgICAgICB9IGVsc2UgaWYgKGZpcnN0T25seSAmJiBjb21wb3NpdGUuY291bnQoKSA+IDEpIHtcbiAgICAgICAgICByZXR1cm4gQmFjb24ubW9yZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoY29tcG9zaXRlLnVuc3Vic2NyaWJlZCkge1xuICAgICAgICAgICAgcmV0dXJuIEJhY29uLm5vTW9yZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGxpbWl0ICYmIGNvbXBvc2l0ZS5jb3VudCgpID4gbGltaXQpIHtcbiAgICAgICAgICAgIHJldHVybiBxdWV1ZS5wdXNoKGV2ZW50KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHNwYXduKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiBjb21wb3NpdGUudW5zdWJzY3JpYmU7XG4gIH0pO1xuICByZXN1bHQuaW50ZXJuYWxEZXBzID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChjaGlsZERlcHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gcm9vdERlcC5jb25jYXQoY2hpbGREZXBzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJvb3REZXA7XG4gICAgfVxuICB9O1xuICByZXR1cm4gcmVzdWx0O1xufTtcblxuQmFjb24uT2JzZXJ2YWJsZS5wcm90b3R5cGUuZmxhdE1hcFdpdGhDb25jdXJyZW5jeUxpbWl0ID0gZnVuY3Rpb24gKGxpbWl0KSB7XG4gIGZvciAodmFyIF9sZW4xMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMTIgPiAxID8gX2xlbjEyIC0gMSA6IDApLCBfa2V5MTIgPSAxOyBfa2V5MTIgPCBfbGVuMTI7IF9rZXkxMisrKSB7XG4gICAgYXJnc1tfa2V5MTIgLSAxXSA9IGFyZ3VtZW50c1tfa2V5MTJdO1xuICB9XG5cbiAgdmFyIGRlc2MgPSBuZXcgQmFjb24uRGVzYyh0aGlzLCBcImZsYXRNYXBXaXRoQ29uY3VycmVuY3lMaW1pdFwiLCBbbGltaXRdLmNvbmNhdChhcmdzKSk7XG4gIHJldHVybiB3aXRoRGVzYyhkZXNjLCBmbGF0TWFwXyh0aGlzLCBtYWtlU3Bhd25lcihhcmdzKSwgZmFsc2UsIGxpbWl0KSk7XG59O1xuXG5CYWNvbi5PYnNlcnZhYmxlLnByb3RvdHlwZS5mbGF0TWFwQ29uY2F0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZGVzYyA9IG5ldyBCYWNvbi5EZXNjKHRoaXMsIFwiZmxhdE1hcENvbmNhdFwiLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApKTtcbiAgcmV0dXJuIHdpdGhEZXNjKGRlc2MsIHRoaXMuZmxhdE1hcFdpdGhDb25jdXJyZW5jeUxpbWl0LmFwcGx5KHRoaXMsIFsxXS5jb25jYXQoX3NsaWNlLmNhbGwoYXJndW1lbnRzKSkpKTtcbn07XG5cbkJhY29uLmxhdGVyID0gZnVuY3Rpb24gKGRlbGF5LCB2YWx1ZSkge1xuICByZXR1cm4gd2l0aERlc2MobmV3IEJhY29uLkRlc2MoQmFjb24sIFwibGF0ZXJcIiwgW2RlbGF5LCB2YWx1ZV0pLCBCYWNvbi5mcm9tQmluZGVyKGZ1bmN0aW9uIChzaW5rKSB7XG4gICAgdmFyIHNlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBzaW5rKFt2YWx1ZSwgZW5kRXZlbnQoKV0pO1xuICAgIH07XG4gICAgdmFyIGlkID0gQmFjb24uc2NoZWR1bGVyLnNldFRpbWVvdXQoc2VuZGVyLCBkZWxheSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBCYWNvbi5zY2hlZHVsZXIuY2xlYXJUaW1lb3V0KGlkKTtcbiAgICB9O1xuICB9KSk7XG59O1xuXG5CYWNvbi5PYnNlcnZhYmxlLnByb3RvdHlwZS5idWZmZXJpbmdUaHJvdHRsZSA9IGZ1bmN0aW9uIChtaW5pbXVtSW50ZXJ2YWwpIHtcbiAgdmFyIGRlc2MgPSBuZXcgQmFjb24uRGVzYyh0aGlzLCBcImJ1ZmZlcmluZ1Rocm90dGxlXCIsIFttaW5pbXVtSW50ZXJ2YWxdKTtcbiAgcmV0dXJuIHdpdGhEZXNjKGRlc2MsIHRoaXMuZmxhdE1hcENvbmNhdChmdW5jdGlvbiAoeCkge1xuICAgIHJldHVybiBCYWNvbi5vbmNlKHgpLmNvbmNhdChCYWNvbi5sYXRlcihtaW5pbXVtSW50ZXJ2YWwpLmZpbHRlcihmYWxzZSkpO1xuICB9KSk7XG59O1xuXG5CYWNvbi5Qcm9wZXJ0eS5wcm90b3R5cGUuYnVmZmVyaW5nVGhyb3R0bGUgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBCYWNvbi5PYnNlcnZhYmxlLnByb3RvdHlwZS5idWZmZXJpbmdUaHJvdHRsZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpLnRvUHJvcGVydHkoKTtcbn07XG5cbmZ1bmN0aW9uIEJ1cygpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1cykpIHtcbiAgICByZXR1cm4gbmV3IEJ1cygpO1xuICB9XG5cbiAgdGhpcy51bnN1YkFsbCA9IF8uYmluZCh0aGlzLnVuc3ViQWxsLCB0aGlzKTtcbiAgdGhpcy5zdWJzY3JpYmVBbGwgPSBfLmJpbmQodGhpcy5zdWJzY3JpYmVBbGwsIHRoaXMpO1xuICB0aGlzLmd1YXJkZWRTaW5rID0gXy5iaW5kKHRoaXMuZ3VhcmRlZFNpbmssIHRoaXMpO1xuXG4gIHRoaXMuc2luayA9IHVuZGVmaW5lZDtcbiAgdGhpcy5zdWJzY3JpcHRpb25zID0gW107XG4gIHRoaXMuZW5kZWQgPSBmYWxzZTtcbiAgRXZlbnRTdHJlYW0uY2FsbCh0aGlzLCBuZXcgQmFjb24uRGVzYyhCYWNvbiwgXCJCdXNcIiwgW10pLCB0aGlzLnN1YnNjcmliZUFsbCk7XG59XG5cbmluaGVyaXQoQnVzLCBFdmVudFN0cmVhbSk7XG5leHRlbmQoQnVzLnByb3RvdHlwZSwge1xuICB1bnN1YkFsbDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBpdGVyYWJsZSA9IHRoaXMuc3Vic2NyaXB0aW9ucztcbiAgICBmb3IgKHZhciBpID0gMCwgc3ViOyBpIDwgaXRlcmFibGUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN1YiA9IGl0ZXJhYmxlW2ldO1xuICAgICAgaWYgKHR5cGVvZiBzdWIudW5zdWIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBzdWIudW5zdWIoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgc3Vic2NyaWJlQWxsOiBmdW5jdGlvbiAobmV3U2luaykge1xuICAgIGlmICh0aGlzLmVuZGVkKSB7XG4gICAgICBuZXdTaW5rKGVuZEV2ZW50KCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNpbmsgPSBuZXdTaW5rO1xuICAgICAgdmFyIGl0ZXJhYmxlID0gY2xvbmVBcnJheSh0aGlzLnN1YnNjcmlwdGlvbnMpO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIHN1YnNjcmlwdGlvbjsgaSA8IGl0ZXJhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHN1YnNjcmlwdGlvbiA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICB0aGlzLnN1YnNjcmliZUlucHV0KHN1YnNjcmlwdGlvbik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnVuc3ViQWxsO1xuICB9LFxuXG4gIGd1YXJkZWRTaW5rOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICB2YXIgX3RoaXM4ID0gdGhpcztcblxuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC5pc0VuZCgpKSB7XG4gICAgICAgIF90aGlzOC51bnN1YnNjcmliZUlucHV0KGlucHV0KTtcbiAgICAgICAgcmV0dXJuIEJhY29uLm5vTW9yZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBfdGhpczguc2luayhldmVudCk7XG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuICBzdWJzY3JpYmVJbnB1dDogZnVuY3Rpb24gKHN1YnNjcmlwdGlvbikge1xuICAgIHN1YnNjcmlwdGlvbi51bnN1YiA9IHN1YnNjcmlwdGlvbi5pbnB1dC5kaXNwYXRjaGVyLnN1YnNjcmliZSh0aGlzLmd1YXJkZWRTaW5rKHN1YnNjcmlwdGlvbi5pbnB1dCkpO1xuICAgIHJldHVybiBzdWJzY3JpcHRpb24udW5zdWI7XG4gIH0sXG5cbiAgdW5zdWJzY3JpYmVJbnB1dDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgdmFyIGl0ZXJhYmxlID0gdGhpcy5zdWJzY3JpcHRpb25zO1xuICAgIGZvciAodmFyIGkgPSAwLCBzdWI7IGkgPCBpdGVyYWJsZS5sZW5ndGg7IGkrKykge1xuICAgICAgc3ViID0gaXRlcmFibGVbaV07XG4gICAgICBpZiAoc3ViLmlucHV0ID09PSBpbnB1dCkge1xuICAgICAgICBpZiAodHlwZW9mIHN1Yi51bnN1YiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgc3ViLnVuc3ViKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnNwbGljZShpLCAxKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBwbHVnOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICB2YXIgX3RoaXM5ID0gdGhpcztcblxuICAgIGFzc2VydE9ic2VydmFibGUoaW5wdXQpO1xuICAgIGlmICh0aGlzLmVuZGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBzdWIgPSB7IGlucHV0OiBpbnB1dCB9O1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHN1Yik7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnNpbmsgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMuc3Vic2NyaWJlSW5wdXQoc3ViKTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBfdGhpczkudW5zdWJzY3JpYmVJbnB1dChpbnB1dCk7XG4gICAgfTtcbiAgfSxcblxuICBlbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmVuZGVkID0gdHJ1ZTtcbiAgICB0aGlzLnVuc3ViQWxsKCk7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnNpbmsgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgcmV0dXJuIHRoaXMuc2luayhlbmRFdmVudCgpKTtcbiAgICB9XG4gIH0sXG5cbiAgcHVzaDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKCF0aGlzLmVuZGVkICYmIHR5cGVvZiB0aGlzLnNpbmsgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgcmV0dXJuIHRoaXMuc2luayhuZXh0RXZlbnQodmFsdWUpKTtcbiAgICB9XG4gIH0sXG5cbiAgZXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge1xuICAgIGlmICh0eXBlb2YgdGhpcy5zaW5rID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHJldHVybiB0aGlzLnNpbmsobmV3IEVycm9yKGVycm9yKSk7XG4gICAgfVxuICB9XG59KTtcblxuQmFjb24uQnVzID0gQnVzO1xuXG52YXIgbGlmdENhbGxiYWNrID0gZnVuY3Rpb24gKGRlc2MsIHdyYXBwZWQpIHtcbiAgcmV0dXJuIHdpdGhNZXRob2RDYWxsU3VwcG9ydChmdW5jdGlvbiAoZikge1xuICAgIHZhciBzdHJlYW0gPSBwYXJ0aWFsbHlBcHBsaWVkKHdyYXBwZWQsIFtmdW5jdGlvbiAodmFsdWVzLCBjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIGYuYXBwbHkodW5kZWZpbmVkLCB2YWx1ZXMuY29uY2F0KFtjYWxsYmFja10pKTtcbiAgICB9XSk7XG5cbiAgICBmb3IgKHZhciBfbGVuMTMgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjEzID4gMSA/IF9sZW4xMyAtIDEgOiAwKSwgX2tleTEzID0gMTsgX2tleTEzIDwgX2xlbjEzOyBfa2V5MTMrKykge1xuICAgICAgYXJnc1tfa2V5MTMgLSAxXSA9IGFyZ3VtZW50c1tfa2V5MTNdO1xuICAgIH1cblxuICAgIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyhCYWNvbiwgZGVzYywgW2ZdLmNvbmNhdChhcmdzKSksIEJhY29uLmNvbWJpbmVBc0FycmF5KGFyZ3MpLmZsYXRNYXAoc3RyZWFtKSk7XG4gIH0pO1xufTtcblxuQmFjb24uZnJvbUNhbGxiYWNrID0gbGlmdENhbGxiYWNrKFwiZnJvbUNhbGxiYWNrXCIsIGZ1bmN0aW9uIChmKSB7XG4gIGZvciAodmFyIF9sZW4xNCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMTQgPiAxID8gX2xlbjE0IC0gMSA6IDApLCBfa2V5MTQgPSAxOyBfa2V5MTQgPCBfbGVuMTQ7IF9rZXkxNCsrKSB7XG4gICAgYXJnc1tfa2V5MTQgLSAxXSA9IGFyZ3VtZW50c1tfa2V5MTRdO1xuICB9XG5cbiAgcmV0dXJuIEJhY29uLmZyb21CaW5kZXIoZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICBtYWtlRnVuY3Rpb24oZiwgYXJncykoaGFuZGxlcik7XG4gICAgcmV0dXJuIG5vcDtcbiAgfSwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIFt2YWx1ZSwgZW5kRXZlbnQoKV07XG4gIH0pO1xufSk7XG5cbkJhY29uLmZyb21Ob2RlQ2FsbGJhY2sgPSBsaWZ0Q2FsbGJhY2soXCJmcm9tTm9kZUNhbGxiYWNrXCIsIGZ1bmN0aW9uIChmKSB7XG4gIGZvciAodmFyIF9sZW4xNSA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMTUgPiAxID8gX2xlbjE1IC0gMSA6IDApLCBfa2V5MTUgPSAxOyBfa2V5MTUgPCBfbGVuMTU7IF9rZXkxNSsrKSB7XG4gICAgYXJnc1tfa2V5MTUgLSAxXSA9IGFyZ3VtZW50c1tfa2V5MTVdO1xuICB9XG5cbiAgcmV0dXJuIEJhY29uLmZyb21CaW5kZXIoZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICBtYWtlRnVuY3Rpb24oZiwgYXJncykoaGFuZGxlcik7XG4gICAgcmV0dXJuIG5vcDtcbiAgfSwgZnVuY3Rpb24gKGVycm9yLCB2YWx1ZSkge1xuICAgIGlmIChlcnJvcikge1xuICAgICAgcmV0dXJuIFtuZXcgRXJyb3IoZXJyb3IpLCBlbmRFdmVudCgpXTtcbiAgICB9XG4gICAgcmV0dXJuIFt2YWx1ZSwgZW5kRXZlbnQoKV07XG4gIH0pO1xufSk7XG5cbkJhY29uLmNvbWJpbmVUZW1wbGF0ZSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICBmdW5jdGlvbiBjdXJyZW50KGN0eFN0YWNrKSB7XG4gICAgcmV0dXJuIGN0eFN0YWNrW2N0eFN0YWNrLmxlbmd0aCAtIDFdO1xuICB9XG4gIGZ1bmN0aW9uIHNldFZhbHVlKGN0eFN0YWNrLCBrZXksIHZhbHVlKSB7XG4gICAgY3VycmVudChjdHhTdGFjaylba2V5XSA9IHZhbHVlO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBmdW5jdGlvbiBhcHBseVN0cmVhbVZhbHVlKGtleSwgaW5kZXgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGN0eFN0YWNrLCB2YWx1ZXMpIHtcbiAgICAgIHJldHVybiBzZXRWYWx1ZShjdHhTdGFjaywga2V5LCB2YWx1ZXNbaW5kZXhdKTtcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIGNvbnN0YW50VmFsdWUoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoY3R4U3RhY2spIHtcbiAgICAgIHJldHVybiBzZXRWYWx1ZShjdHhTdGFjaywga2V5LCB2YWx1ZSk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1rQ29udGV4dCh0ZW1wbGF0ZSkge1xuICAgIHJldHVybiBpc0FycmF5KHRlbXBsYXRlKSA/IFtdIDoge307XG4gIH1cblxuICBmdW5jdGlvbiBwdXNoQ29udGV4dChrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChjdHhTdGFjaykge1xuICAgICAgdmFyIG5ld0NvbnRleHQgPSBta0NvbnRleHQodmFsdWUpO1xuICAgICAgc2V0VmFsdWUoY3R4U3RhY2ssIGtleSwgbmV3Q29udGV4dCk7XG4gICAgICByZXR1cm4gY3R4U3RhY2sucHVzaChuZXdDb250ZXh0KTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gY29tcGlsZShrZXksIHZhbHVlKSB7XG4gICAgaWYgKGlzT2JzZXJ2YWJsZSh2YWx1ZSkpIHtcbiAgICAgIHN0cmVhbXMucHVzaCh2YWx1ZSk7XG4gICAgICByZXR1cm4gZnVuY3MucHVzaChhcHBseVN0cmVhbVZhbHVlKGtleSwgc3RyZWFtcy5sZW5ndGggLSAxKSk7XG4gICAgfSBlbHNlIGlmICh2YWx1ZSAmJiAodmFsdWUuY29uc3RydWN0b3IgPT0gT2JqZWN0IHx8IHZhbHVlLmNvbnN0cnVjdG9yID09IEFycmF5KSkge1xuICAgICAgdmFyIHBvcENvbnRleHQgPSBmdW5jdGlvbiAoY3R4U3RhY2spIHtcbiAgICAgICAgcmV0dXJuIGN0eFN0YWNrLnBvcCgpO1xuICAgICAgfTtcbiAgICAgIGZ1bmNzLnB1c2gocHVzaENvbnRleHQoa2V5LCB2YWx1ZSkpO1xuICAgICAgY29tcGlsZVRlbXBsYXRlKHZhbHVlKTtcbiAgICAgIHJldHVybiBmdW5jcy5wdXNoKHBvcENvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZnVuY3MucHVzaChjb25zdGFudFZhbHVlKGtleSwgdmFsdWUpKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjb21iaW5hdG9yKHZhbHVlcykge1xuICAgIHZhciByb290Q29udGV4dCA9IG1rQ29udGV4dCh0ZW1wbGF0ZSk7XG4gICAgdmFyIGN0eFN0YWNrID0gW3Jvb3RDb250ZXh0XTtcbiAgICBmb3IgKHZhciBpID0gMCwgZjsgaSA8IGZ1bmNzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBmID0gZnVuY3NbaV07XG4gICAgICBmKGN0eFN0YWNrLCB2YWx1ZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcm9vdENvbnRleHQ7XG4gIH1cblxuICBmdW5jdGlvbiBjb21waWxlVGVtcGxhdGUodGVtcGxhdGUpIHtcbiAgICByZXR1cm4gXy5lYWNoKHRlbXBsYXRlLCBjb21waWxlKTtcbiAgfVxuXG4gIHZhciBmdW5jcyA9IFtdO1xuICB2YXIgc3RyZWFtcyA9IFtdO1xuXG4gIGNvbXBpbGVUZW1wbGF0ZSh0ZW1wbGF0ZSk7XG5cbiAgcmV0dXJuIHdpdGhEZXNjKG5ldyBCYWNvbi5EZXNjKEJhY29uLCBcImNvbWJpbmVUZW1wbGF0ZVwiLCBbdGVtcGxhdGVdKSwgQmFjb24uY29tYmluZUFzQXJyYXkoc3RyZWFtcykubWFwKGNvbWJpbmF0b3IpKTtcbn07XG5cbnZhciBhZGRQcm9wZXJ0eUluaXRWYWx1ZVRvU3RyZWFtID0gZnVuY3Rpb24gKHByb3BlcnR5LCBzdHJlYW0pIHtcbiAgdmFyIGp1c3RJbml0VmFsdWUgPSBuZXcgRXZlbnRTdHJlYW0oZGVzY3JpYmUocHJvcGVydHksIFwianVzdEluaXRWYWx1ZVwiKSwgZnVuY3Rpb24gKHNpbmspIHtcbiAgICB2YXIgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVuc3ViID0gcHJvcGVydHkuZGlzcGF0Y2hlci5zdWJzY3JpYmUoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZiAoIWV2ZW50LmlzRW5kKCkpIHtcbiAgICAgICAgdmFsdWUgPSBldmVudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBCYWNvbi5ub01vcmU7XG4gICAgfSk7XG4gICAgVXBkYXRlQmFycmllci53aGVuRG9uZVdpdGgoanVzdEluaXRWYWx1ZSwgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICBzaW5rKHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzaW5rKGVuZEV2ZW50KCkpO1xuICAgIH0pO1xuICAgIHJldHVybiB1bnN1YjtcbiAgfSk7XG4gIHJldHVybiBqdXN0SW5pdFZhbHVlLmNvbmNhdChzdHJlYW0pLnRvUHJvcGVydHkoKTtcbn07XG5cbkJhY29uLk9ic2VydmFibGUucHJvdG90eXBlLm1hcEVuZCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGYgPSBtYWtlRnVuY3Rpb25BcmdzKGFyZ3VtZW50cyk7XG4gIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyh0aGlzLCBcIm1hcEVuZFwiLCBbZl0pLCB0aGlzLndpdGhIYW5kbGVyKGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmIChldmVudC5pc0VuZCgpKSB7XG4gICAgICB0aGlzLnB1c2gobmV4dEV2ZW50KGYoZXZlbnQpKSk7XG4gICAgICB0aGlzLnB1c2goZW5kRXZlbnQoKSk7XG4gICAgICByZXR1cm4gQmFjb24ubm9Nb3JlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5wdXNoKGV2ZW50KTtcbiAgICB9XG4gIH0pKTtcbn07XG5cbkJhY29uLk9ic2VydmFibGUucHJvdG90eXBlLnNraXBFcnJvcnMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyh0aGlzLCBcInNraXBFcnJvcnNcIiwgW10pLCB0aGlzLndpdGhIYW5kbGVyKGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmIChldmVudC5pc0Vycm9yKCkpIHtcbiAgICAgIHJldHVybiBCYWNvbi5tb3JlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5wdXNoKGV2ZW50KTtcbiAgICB9XG4gIH0pKTtcbn07XG5cbkJhY29uLkV2ZW50U3RyZWFtLnByb3RvdHlwZS50YWtlVW50aWwgPSBmdW5jdGlvbiAoc3RvcHBlcikge1xuICB2YXIgZW5kTWFya2VyID0ge307XG4gIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyh0aGlzLCBcInRha2VVbnRpbFwiLCBbc3RvcHBlcl0pLCBCYWNvbi5ncm91cFNpbXVsdGFuZW91cyh0aGlzLm1hcEVuZChlbmRNYXJrZXIpLCBzdG9wcGVyLnNraXBFcnJvcnMoKSkud2l0aEhhbmRsZXIoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgaWYgKCFldmVudC5oYXNWYWx1ZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5wdXNoKGV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIF9ldmVudCR2YWx1ZSA9IGV2ZW50LnZhbHVlKCk7XG5cbiAgICAgIHZhciBkYXRhID0gX2V2ZW50JHZhbHVlWzBdO1xuICAgICAgdmFyIHN0b3BwZXIgPSBfZXZlbnQkdmFsdWVbMV07XG5cbiAgICAgIGlmIChzdG9wcGVyLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdXNoKGVuZEV2ZW50KCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlcGx5ID0gQmFjb24ubW9yZTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHZhbHVlOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhbHVlID0gZGF0YVtpXTtcbiAgICAgICAgICBpZiAodmFsdWUgPT09IGVuZE1hcmtlcikge1xuICAgICAgICAgICAgcmVwbHkgPSB0aGlzLnB1c2goZW5kRXZlbnQoKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcGx5ID0gdGhpcy5wdXNoKG5leHRFdmVudCh2YWx1ZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVwbHk7XG4gICAgICB9XG4gICAgfVxuICB9KSk7XG59O1xuXG5CYWNvbi5Qcm9wZXJ0eS5wcm90b3R5cGUudGFrZVVudGlsID0gZnVuY3Rpb24gKHN0b3BwZXIpIHtcbiAgdmFyIGNoYW5nZXMgPSB0aGlzLmNoYW5nZXMoKS50YWtlVW50aWwoc3RvcHBlcik7XG4gIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyh0aGlzLCBcInRha2VVbnRpbFwiLCBbc3RvcHBlcl0pLCBhZGRQcm9wZXJ0eUluaXRWYWx1ZVRvU3RyZWFtKHRoaXMsIGNoYW5nZXMpKTtcbn07XG5cbkJhY29uLk9ic2VydmFibGUucHJvdG90eXBlLmZsYXRNYXBMYXRlc3QgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBmID0gbWFrZVNwYXduZXIoYXJndW1lbnRzKTtcbiAgdmFyIHN0cmVhbSA9IHRoaXMudG9FdmVudFN0cmVhbSgpO1xuICByZXR1cm4gd2l0aERlc2MobmV3IEJhY29uLkRlc2ModGhpcywgXCJmbGF0TWFwTGF0ZXN0XCIsIFtmXSksIHN0cmVhbS5mbGF0TWFwKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBtYWtlT2JzZXJ2YWJsZShmKHZhbHVlKSkudGFrZVVudGlsKHN0cmVhbSk7XG4gIH0pKTtcbn07XG5cbkJhY29uLlByb3BlcnR5LnByb3RvdHlwZS5kZWxheUNoYW5nZXMgPSBmdW5jdGlvbiAoZGVzYywgZikge1xuICByZXR1cm4gd2l0aERlc2MoZGVzYywgYWRkUHJvcGVydHlJbml0VmFsdWVUb1N0cmVhbSh0aGlzLCBmKHRoaXMuY2hhbmdlcygpKSkpO1xufTtcblxuQmFjb24uRXZlbnRTdHJlYW0ucHJvdG90eXBlLmRlbGF5ID0gZnVuY3Rpb24gKGRlbGF5KSB7XG4gIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyh0aGlzLCBcImRlbGF5XCIsIFtkZWxheV0pLCB0aGlzLmZsYXRNYXAoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIEJhY29uLmxhdGVyKGRlbGF5LCB2YWx1ZSk7XG4gIH0pKTtcbn07XG5cbkJhY29uLlByb3BlcnR5LnByb3RvdHlwZS5kZWxheSA9IGZ1bmN0aW9uIChkZWxheSkge1xuICByZXR1cm4gdGhpcy5kZWxheUNoYW5nZXMobmV3IEJhY29uLkRlc2ModGhpcywgXCJkZWxheVwiLCBbZGVsYXldKSwgZnVuY3Rpb24gKGNoYW5nZXMpIHtcbiAgICByZXR1cm4gY2hhbmdlcy5kZWxheShkZWxheSk7XG4gIH0pO1xufTtcblxuQmFjb24uRXZlbnRTdHJlYW0ucHJvdG90eXBlLmRlYm91bmNlID0gZnVuY3Rpb24gKGRlbGF5KSB7XG4gIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyh0aGlzLCBcImRlYm91bmNlXCIsIFtkZWxheV0pLCB0aGlzLmZsYXRNYXBMYXRlc3QoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIEJhY29uLmxhdGVyKGRlbGF5LCB2YWx1ZSk7XG4gIH0pKTtcbn07XG5cbkJhY29uLlByb3BlcnR5LnByb3RvdHlwZS5kZWJvdW5jZSA9IGZ1bmN0aW9uIChkZWxheSkge1xuICByZXR1cm4gdGhpcy5kZWxheUNoYW5nZXMobmV3IEJhY29uLkRlc2ModGhpcywgXCJkZWJvdW5jZVwiLCBbZGVsYXldKSwgZnVuY3Rpb24gKGNoYW5nZXMpIHtcbiAgICByZXR1cm4gY2hhbmdlcy5kZWJvdW5jZShkZWxheSk7XG4gIH0pO1xufTtcblxuQmFjb24uRXZlbnRTdHJlYW0ucHJvdG90eXBlLmRlYm91bmNlSW1tZWRpYXRlID0gZnVuY3Rpb24gKGRlbGF5KSB7XG4gIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyh0aGlzLCBcImRlYm91bmNlSW1tZWRpYXRlXCIsIFtkZWxheV0pLCB0aGlzLmZsYXRNYXBGaXJzdChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gQmFjb24ub25jZSh2YWx1ZSkuY29uY2F0KEJhY29uLmxhdGVyKGRlbGF5KS5maWx0ZXIoZmFsc2UpKTtcbiAgfSkpO1xufTtcblxuQmFjb24uT2JzZXJ2YWJsZS5wcm90b3R5cGUuZGVjb2RlID0gZnVuY3Rpb24gKGNhc2VzKSB7XG4gIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyh0aGlzLCBcImRlY29kZVwiLCBbY2FzZXNdKSwgdGhpcy5jb21iaW5lKEJhY29uLmNvbWJpbmVUZW1wbGF0ZShjYXNlcyksIGZ1bmN0aW9uIChrZXksIHZhbHVlcykge1xuICAgIHJldHVybiB2YWx1ZXNba2V5XTtcbiAgfSkpO1xufTtcblxuQmFjb24uT2JzZXJ2YWJsZS5wcm90b3R5cGUuc2NhbiA9IGZ1bmN0aW9uIChzZWVkLCBmKSB7XG4gIHZhciBfdGhpczEwID0gdGhpcztcblxuICB2YXIgcmVzdWx0UHJvcGVydHk7XG4gIGYgPSB0b0NvbWJpbmF0b3IoZik7XG4gIHZhciBhY2MgPSB0b09wdGlvbihzZWVkKTtcbiAgdmFyIGluaXRIYW5kbGVkID0gZmFsc2U7XG4gIHZhciBzdWJzY3JpYmUgPSBmdW5jdGlvbiAoc2luaykge1xuICAgIHZhciBpbml0U2VudCA9IGZhbHNlO1xuICAgIHZhciB1bnN1YiA9IG5vcDtcbiAgICB2YXIgcmVwbHkgPSBCYWNvbi5tb3JlO1xuICAgIHZhciBzZW5kSW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghaW5pdFNlbnQpIHtcbiAgICAgICAgcmV0dXJuIGFjYy5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgIGluaXRTZW50ID0gaW5pdEhhbmRsZWQgPSB0cnVlO1xuICAgICAgICAgIHJlcGx5ID0gc2luayhuZXcgSW5pdGlhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgfSkpO1xuICAgICAgICAgIGlmIChyZXBseSA9PT0gQmFjb24ubm9Nb3JlKSB7XG4gICAgICAgICAgICB1bnN1YigpO1xuICAgICAgICAgICAgdW5zdWIgPSBub3A7XG4gICAgICAgICAgICByZXR1cm4gdW5zdWI7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHVuc3ViID0gX3RoaXMxMC5kaXNwYXRjaGVyLnN1YnNjcmliZShmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC5oYXNWYWx1ZSgpKSB7XG4gICAgICAgIGlmIChpbml0SGFuZGxlZCAmJiBldmVudC5pc0luaXRpYWwoKSkge1xuICAgICAgICAgIHJldHVybiBCYWNvbi5tb3JlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFldmVudC5pc0luaXRpYWwoKSkge1xuICAgICAgICAgICAgICBzZW5kSW5pdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaW5pdFNlbnQgPSBpbml0SGFuZGxlZCA9IHRydWU7XG4gICAgICAgICAgICB2YXIgcHJldiA9IGFjYy5nZXRPckVsc2UodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIHZhciBuZXh0ID0gZihwcmV2LCBldmVudC52YWx1ZSgpKTtcblxuICAgICAgICAgICAgYWNjID0gbmV3IFNvbWUobmV4dCk7XG4gICAgICAgICAgICByZXR1cm4gc2luayhldmVudC5hcHBseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChldmVudC5pc0VuZCgpKSB7XG4gICAgICAgICAgcmVwbHkgPSBzZW5kSW5pdCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXBseSAhPT0gQmFjb24ubm9Nb3JlKSB7XG4gICAgICAgICAgcmV0dXJuIHNpbmsoZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgVXBkYXRlQmFycmllci53aGVuRG9uZVdpdGgocmVzdWx0UHJvcGVydHksIHNlbmRJbml0KTtcbiAgICByZXR1cm4gdW5zdWI7XG4gIH07XG4gIHJlc3VsdFByb3BlcnR5ID0gbmV3IFByb3BlcnR5KG5ldyBCYWNvbi5EZXNjKHRoaXMsIFwic2NhblwiLCBbc2VlZCwgZl0pLCBzdWJzY3JpYmUpO1xuICByZXR1cm4gcmVzdWx0UHJvcGVydHk7XG59O1xuXG5CYWNvbi5PYnNlcnZhYmxlLnByb3RvdHlwZS5kaWZmID0gZnVuY3Rpb24gKHN0YXJ0LCBmKSB7XG4gIGYgPSB0b0NvbWJpbmF0b3IoZik7XG4gIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyh0aGlzLCBcImRpZmZcIiwgW3N0YXJ0LCBmXSksIHRoaXMuc2Nhbihbc3RhcnRdLCBmdW5jdGlvbiAocHJldlR1cGxlLCBuZXh0KSB7XG4gICAgcmV0dXJuIFtuZXh0LCBmKHByZXZUdXBsZVswXSwgbmV4dCldO1xuICB9KS5maWx0ZXIoZnVuY3Rpb24gKHR1cGxlKSB7XG4gICAgcmV0dXJuIHR1cGxlLmxlbmd0aCA9PT0gMjtcbiAgfSkubWFwKGZ1bmN0aW9uICh0dXBsZSkge1xuICAgIHJldHVybiB0dXBsZVsxXTtcbiAgfSkpO1xufTtcblxuQmFjb24uT2JzZXJ2YWJsZS5wcm90b3R5cGUuZG9BY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBmID0gbWFrZUZ1bmN0aW9uQXJncyhhcmd1bWVudHMpO1xuICByZXR1cm4gd2l0aERlc2MobmV3IEJhY29uLkRlc2ModGhpcywgXCJkb0FjdGlvblwiLCBbZl0pLCB0aGlzLndpdGhIYW5kbGVyKGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmIChldmVudC5oYXNWYWx1ZSgpKSB7XG4gICAgICBmKGV2ZW50LnZhbHVlKCkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wdXNoKGV2ZW50KTtcbiAgfSkpO1xufTtcblxuQmFjb24uT2JzZXJ2YWJsZS5wcm90b3R5cGUuZG9FbmQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBmID0gbWFrZUZ1bmN0aW9uQXJncyhhcmd1bWVudHMpO1xuICByZXR1cm4gd2l0aERlc2MobmV3IEJhY29uLkRlc2ModGhpcywgXCJkb0VuZFwiLCBbZl0pLCB0aGlzLndpdGhIYW5kbGVyKGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmIChldmVudC5pc0VuZCgpKSB7XG4gICAgICBmKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnB1c2goZXZlbnQpO1xuICB9KSk7XG59O1xuXG5CYWNvbi5PYnNlcnZhYmxlLnByb3RvdHlwZS5kb0Vycm9yID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZiA9IG1ha2VGdW5jdGlvbkFyZ3MoYXJndW1lbnRzKTtcbiAgcmV0dXJuIHdpdGhEZXNjKG5ldyBCYWNvbi5EZXNjKHRoaXMsIFwiZG9FcnJvclwiLCBbZl0pLCB0aGlzLndpdGhIYW5kbGVyKGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmIChldmVudC5pc0Vycm9yKCkpIHtcbiAgICAgIGYoZXZlbnQuZXJyb3IpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wdXNoKGV2ZW50KTtcbiAgfSkpO1xufTtcblxuQmFjb24uT2JzZXJ2YWJsZS5wcm90b3R5cGUuZG9Mb2cgPSBmdW5jdGlvbiAoKSB7XG4gIGZvciAodmFyIF9sZW4xNiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMTYpLCBfa2V5MTYgPSAwOyBfa2V5MTYgPCBfbGVuMTY7IF9rZXkxNisrKSB7XG4gICAgYXJnc1tfa2V5MTZdID0gYXJndW1lbnRzW19rZXkxNl07XG4gIH1cblxuICByZXR1cm4gd2l0aERlc2MobmV3IEJhY29uLkRlc2ModGhpcywgXCJkb0xvZ1wiLCBhcmdzKSwgdGhpcy53aXRoSGFuZGxlcihmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIgJiYgY29uc29sZSAhPT0gbnVsbCAmJiB0eXBlb2YgY29uc29sZS5sb2cgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJncy5jb25jYXQoW2V2ZW50LmxvZygpXSkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wdXNoKGV2ZW50KTtcbiAgfSkpO1xufTtcblxuQmFjb24uT2JzZXJ2YWJsZS5wcm90b3R5cGUuZW5kT25FcnJvciA9IGZ1bmN0aW9uIChmKSB7XG4gIGlmICghKHR5cGVvZiBmICE9PSBcInVuZGVmaW5lZFwiICYmIGYgIT09IG51bGwpKSB7XG4gICAgZiA9IHRydWU7XG4gIH1cblxuICBmb3IgKHZhciBfbGVuMTcgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjE3ID4gMSA/IF9sZW4xNyAtIDEgOiAwKSwgX2tleTE3ID0gMTsgX2tleTE3IDwgX2xlbjE3OyBfa2V5MTcrKykge1xuICAgIGFyZ3NbX2tleTE3IC0gMV0gPSBhcmd1bWVudHNbX2tleTE3XTtcbiAgfVxuXG4gIHJldHVybiBjb252ZXJ0QXJnc1RvRnVuY3Rpb24odGhpcywgZiwgYXJncywgZnVuY3Rpb24gKGYpIHtcbiAgICByZXR1cm4gd2l0aERlc2MobmV3IEJhY29uLkRlc2ModGhpcywgXCJlbmRPbkVycm9yXCIsIFtdKSwgdGhpcy53aXRoSGFuZGxlcihmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC5pc0Vycm9yKCkgJiYgZihldmVudC5lcnJvcikpIHtcbiAgICAgICAgdGhpcy5wdXNoKGV2ZW50KTtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVzaChlbmRFdmVudCgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1c2goZXZlbnQpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfSk7XG59O1xuXG5PYnNlcnZhYmxlLnByb3RvdHlwZS5lcnJvcnMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyh0aGlzLCBcImVycm9yc1wiLCBbXSksIHRoaXMuZmlsdGVyKGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pKTtcbn07XG5cbkJhY29uLk9ic2VydmFibGUucHJvdG90eXBlLnRha2UgPSBmdW5jdGlvbiAoY291bnQpIHtcbiAgaWYgKGNvdW50IDw9IDApIHtcbiAgICByZXR1cm4gQmFjb24ubmV2ZXIoKTtcbiAgfVxuICByZXR1cm4gd2l0aERlc2MobmV3IEJhY29uLkRlc2ModGhpcywgXCJ0YWtlXCIsIFtjb3VudF0pLCB0aGlzLndpdGhIYW5kbGVyKGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmICghZXZlbnQuaGFzVmFsdWUoKSkge1xuICAgICAgcmV0dXJuIHRoaXMucHVzaChldmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvdW50LS07XG4gICAgICBpZiAoY291bnQgPiAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1c2goZXZlbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5wdXNoKGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnB1c2goZW5kRXZlbnQoKSk7XG4gICAgICAgIHJldHVybiBCYWNvbi5ub01vcmU7XG4gICAgICB9XG4gICAgfVxuICB9KSk7XG59O1xuXG5CYWNvbi5PYnNlcnZhYmxlLnByb3RvdHlwZS5maXJzdCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHdpdGhEZXNjKG5ldyBCYWNvbi5EZXNjKHRoaXMsIFwiZmlyc3RcIiwgW10pLCB0aGlzLnRha2UoMSkpO1xufTtcblxuQmFjb24uT2JzZXJ2YWJsZS5wcm90b3R5cGUubWFwRXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBmID0gbWFrZUZ1bmN0aW9uQXJncyhhcmd1bWVudHMpO1xuICByZXR1cm4gd2l0aERlc2MobmV3IEJhY29uLkRlc2ModGhpcywgXCJtYXBFcnJvclwiLCBbZl0pLCB0aGlzLndpdGhIYW5kbGVyKGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmIChldmVudC5pc0Vycm9yKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnB1c2gobmV4dEV2ZW50KGYoZXZlbnQuZXJyb3IpKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnB1c2goZXZlbnQpO1xuICAgIH1cbiAgfSkpO1xufTtcblxuQmFjb24uT2JzZXJ2YWJsZS5wcm90b3R5cGUuZmxhdE1hcEVycm9yID0gZnVuY3Rpb24gKGZuKSB7XG4gIHZhciBkZXNjID0gbmV3IEJhY29uLkRlc2ModGhpcywgXCJmbGF0TWFwRXJyb3JcIiwgW2ZuXSk7XG4gIHJldHVybiB3aXRoRGVzYyhkZXNjLCB0aGlzLm1hcEVycm9yKGZ1bmN0aW9uIChlcnIpIHtcbiAgICByZXR1cm4gbmV3IEVycm9yKGVycik7XG4gIH0pLmZsYXRNYXAoZnVuY3Rpb24gKHgpIHtcbiAgICBpZiAoeCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICByZXR1cm4gZm4oeC5lcnJvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBCYWNvbi5vbmNlKHgpO1xuICAgIH1cbiAgfSkpO1xufTtcblxuQmFjb24uRXZlbnRTdHJlYW0ucHJvdG90eXBlLnNhbXBsZWRCeSA9IGZ1bmN0aW9uIChzYW1wbGVyLCBjb21iaW5hdG9yKSB7XG4gIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyh0aGlzLCBcInNhbXBsZWRCeVwiLCBbc2FtcGxlciwgY29tYmluYXRvcl0pLCB0aGlzLnRvUHJvcGVydHkoKS5zYW1wbGVkQnkoc2FtcGxlciwgY29tYmluYXRvcikpO1xufTtcblxuQmFjb24uUHJvcGVydHkucHJvdG90eXBlLnNhbXBsZWRCeSA9IGZ1bmN0aW9uIChzYW1wbGVyLCBjb21iaW5hdG9yKSB7XG4gIHZhciBsYXp5ID0gZmFsc2U7XG4gIGlmICh0eXBlb2YgY29tYmluYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjb21iaW5hdG9yICE9PSBudWxsKSB7XG4gICAgY29tYmluYXRvciA9IHRvQ29tYmluYXRvcihjb21iaW5hdG9yKTtcbiAgfSBlbHNlIHtcbiAgICBsYXp5ID0gdHJ1ZTtcbiAgICBjb21iaW5hdG9yID0gZnVuY3Rpb24gKGYpIHtcbiAgICAgIHJldHVybiBmLnZhbHVlKCk7XG4gICAgfTtcbiAgfVxuICB2YXIgdGhpc1NvdXJjZSA9IG5ldyBTb3VyY2UodGhpcywgZmFsc2UsIGxhenkpO1xuICB2YXIgc2FtcGxlclNvdXJjZSA9IG5ldyBTb3VyY2Uoc2FtcGxlciwgdHJ1ZSwgbGF6eSk7XG4gIHZhciBzdHJlYW0gPSBCYWNvbi53aGVuKFt0aGlzU291cmNlLCBzYW1wbGVyU291cmNlXSwgY29tYmluYXRvcik7XG4gIHZhciByZXN1bHQgPSBzYW1wbGVyLl9pc1Byb3BlcnR5ID8gc3RyZWFtLnRvUHJvcGVydHkoKSA6IHN0cmVhbTtcbiAgcmV0dXJuIHdpdGhEZXNjKG5ldyBCYWNvbi5EZXNjKHRoaXMsIFwic2FtcGxlZEJ5XCIsIFtzYW1wbGVyLCBjb21iaW5hdG9yXSksIHJlc3VsdCk7XG59O1xuXG5CYWNvbi5Qcm9wZXJ0eS5wcm90b3R5cGUuc2FtcGxlID0gZnVuY3Rpb24gKGludGVydmFsKSB7XG4gIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyh0aGlzLCBcInNhbXBsZVwiLCBbaW50ZXJ2YWxdKSwgdGhpcy5zYW1wbGVkQnkoQmFjb24uaW50ZXJ2YWwoaW50ZXJ2YWwsIHt9KSkpO1xufTtcblxuQmFjb24uT2JzZXJ2YWJsZS5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24gKHApIHtcbiAgaWYgKHAgJiYgcC5faXNQcm9wZXJ0eSkge1xuICAgIHJldHVybiBwLnNhbXBsZWRCeSh0aGlzLCBmb3JtZXIpO1xuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIF9sZW4xOCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMTggPiAxID8gX2xlbjE4IC0gMSA6IDApLCBfa2V5MTggPSAxOyBfa2V5MTggPCBfbGVuMTg7IF9rZXkxOCsrKSB7XG4gICAgICBhcmdzW19rZXkxOCAtIDFdID0gYXJndW1lbnRzW19rZXkxOF07XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnZlcnRBcmdzVG9GdW5jdGlvbih0aGlzLCBwLCBhcmdzLCBmdW5jdGlvbiAoZikge1xuICAgICAgcmV0dXJuIHdpdGhEZXNjKG5ldyBCYWNvbi5EZXNjKHRoaXMsIFwibWFwXCIsIFtmXSksIHRoaXMud2l0aEhhbmRsZXIoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1c2goZXZlbnQuZm1hcChmKSk7XG4gICAgICB9KSk7XG4gICAgfSk7XG4gIH1cbn07XG5cbkJhY29uLk9ic2VydmFibGUucHJvdG90eXBlLmZvbGQgPSBmdW5jdGlvbiAoc2VlZCwgZikge1xuICByZXR1cm4gd2l0aERlc2MobmV3IEJhY29uLkRlc2ModGhpcywgXCJmb2xkXCIsIFtzZWVkLCBmXSksIHRoaXMuc2NhbihzZWVkLCBmKS5zYW1wbGVkQnkodGhpcy5maWx0ZXIoZmFsc2UpLm1hcEVuZCgpLnRvUHJvcGVydHkoKSkpO1xufTtcblxuT2JzZXJ2YWJsZS5wcm90b3R5cGUucmVkdWNlID0gT2JzZXJ2YWJsZS5wcm90b3R5cGUuZm9sZDtcblxudmFyIGV2ZW50TWV0aG9kcyA9IFtbXCJhZGRFdmVudExpc3RlbmVyXCIsIFwicmVtb3ZlRXZlbnRMaXN0ZW5lclwiXSwgW1wiYWRkTGlzdGVuZXJcIiwgXCJyZW1vdmVMaXN0ZW5lclwiXSwgW1wib25cIiwgXCJvZmZcIl0sIFtcImJpbmRcIiwgXCJ1bmJpbmRcIl1dO1xuXG52YXIgZmluZEhhbmRsZXJNZXRob2RzID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICB2YXIgcGFpcjtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBldmVudE1ldGhvZHMubGVuZ3RoOyBpKyspIHtcbiAgICBwYWlyID0gZXZlbnRNZXRob2RzW2ldO1xuICAgIHZhciBtZXRob2RQYWlyID0gW3RhcmdldFtwYWlyWzBdXSwgdGFyZ2V0W3BhaXJbMV1dXTtcbiAgICBpZiAobWV0aG9kUGFpclswXSAmJiBtZXRob2RQYWlyWzFdKSB7XG4gICAgICByZXR1cm4gbWV0aG9kUGFpcjtcbiAgICB9XG4gIH1cbiAgZm9yICh2YXIgaiA9IDA7IGogPCBldmVudE1ldGhvZHMubGVuZ3RoOyBqKyspIHtcbiAgICBwYWlyID0gZXZlbnRNZXRob2RzW2pdO1xuICAgIHZhciBhZGRMaXN0ZW5lciA9IHRhcmdldFtwYWlyWzBdXTtcbiAgICBpZiAoYWRkTGlzdGVuZXIpIHtcbiAgICAgIHJldHVybiBbYWRkTGlzdGVuZXIsIGZ1bmN0aW9uICgpIHt9XTtcbiAgICB9XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKFwiTm8gc3VpdGFibGUgZXZlbnQgbWV0aG9kcyBpbiBcIiArIHRhcmdldCk7XG59O1xuXG5CYWNvbi5mcm9tRXZlbnRUYXJnZXQgPSBmdW5jdGlvbiAodGFyZ2V0LCBldmVudE5hbWUsIGV2ZW50VHJhbnNmb3JtZXIpIHtcbiAgdmFyIF9maW5kSGFuZGxlck1ldGhvZHMgPSBmaW5kSGFuZGxlck1ldGhvZHModGFyZ2V0KTtcblxuICB2YXIgc3ViID0gX2ZpbmRIYW5kbGVyTWV0aG9kc1swXTtcbiAgdmFyIHVuc3ViID0gX2ZpbmRIYW5kbGVyTWV0aG9kc1sxXTtcblxuICB2YXIgZGVzYyA9IG5ldyBCYWNvbi5EZXNjKEJhY29uLCBcImZyb21FdmVudFwiLCBbdGFyZ2V0LCBldmVudE5hbWVdKTtcbiAgcmV0dXJuIHdpdGhEZXNjKGRlc2MsIEJhY29uLmZyb21CaW5kZXIoZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICBzdWIuY2FsbCh0YXJnZXQsIGV2ZW50TmFtZSwgaGFuZGxlcik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB1bnN1Yi5jYWxsKHRhcmdldCwgZXZlbnROYW1lLCBoYW5kbGVyKTtcbiAgICB9O1xuICB9LCBldmVudFRyYW5zZm9ybWVyKSk7XG59O1xuXG5CYWNvbi5mcm9tRXZlbnQgPSBCYWNvbi5mcm9tRXZlbnRUYXJnZXQ7XG5cbkJhY29uLmZyb21Qb2xsID0gZnVuY3Rpb24gKGRlbGF5LCBwb2xsKSB7XG4gIHZhciBkZXNjID0gbmV3IEJhY29uLkRlc2MoQmFjb24sIFwiZnJvbVBvbGxcIiwgW2RlbGF5LCBwb2xsXSk7XG4gIHJldHVybiB3aXRoRGVzYyhkZXNjLCBCYWNvbi5mcm9tQmluZGVyKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgdmFyIGlkID0gQmFjb24uc2NoZWR1bGVyLnNldEludGVydmFsKGhhbmRsZXIsIGRlbGF5KTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIEJhY29uLnNjaGVkdWxlci5jbGVhckludGVydmFsKGlkKTtcbiAgICB9O1xuICB9LCBwb2xsKSk7XG59O1xuXG5mdW5jdGlvbiB2YWx1ZUFuZEVuZCh2YWx1ZSkge1xuICByZXR1cm4gW3ZhbHVlLCBlbmRFdmVudCgpXTtcbn1cblxuQmFjb24uZnJvbVByb21pc2UgPSBmdW5jdGlvbiAocHJvbWlzZSwgYWJvcnQpIHtcbiAgdmFyIGV2ZW50VHJhbnNmb3JtZXIgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDIgfHwgYXJndW1lbnRzWzJdID09PSB1bmRlZmluZWQgPyB2YWx1ZUFuZEVuZCA6IGFyZ3VtZW50c1syXTtcblxuICByZXR1cm4gd2l0aERlc2MobmV3IEJhY29uLkRlc2MoQmFjb24sIFwiZnJvbVByb21pc2VcIiwgW3Byb21pc2VdKSwgQmFjb24uZnJvbUJpbmRlcihmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgIHZhciBib3VuZCA9IHByb21pc2UudGhlbihoYW5kbGVyLCBmdW5jdGlvbiAoZSkge1xuICAgICAgcmV0dXJuIGhhbmRsZXIobmV3IEVycm9yKGUpKTtcbiAgICB9KTtcbiAgICBpZiAoYm91bmQgJiYgdHlwZW9mIGJvdW5kLmRvbmUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgYm91bmQuZG9uZSgpO1xuICAgIH1cblxuICAgIGlmIChhYm9ydCkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwcm9taXNlLmFib3J0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICByZXR1cm4gcHJvbWlzZS5hYm9ydCgpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge307XG4gICAgfVxuICB9LCBldmVudFRyYW5zZm9ybWVyKSk7XG59O1xuXG5CYWNvbi5PYnNlcnZhYmxlLnByb3RvdHlwZS5ncm91cEJ5ID0gZnVuY3Rpb24gKGtleUYpIHtcbiAgdmFyIGxpbWl0RiA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IEJhY29uLl8uaWQgOiBhcmd1bWVudHNbMV07XG5cbiAgdmFyIHN0cmVhbXMgPSB7fTtcbiAgdmFyIHNyYyA9IHRoaXM7XG4gIHJldHVybiBzcmMuZmlsdGVyKGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuICFzdHJlYW1zW2tleUYoeCldO1xuICB9KS5tYXAoZnVuY3Rpb24gKHgpIHtcbiAgICB2YXIga2V5ID0ga2V5Rih4KTtcbiAgICB2YXIgc2ltaWxhciA9IHNyYy5maWx0ZXIoZnVuY3Rpb24gKHgpIHtcbiAgICAgIHJldHVybiBrZXlGKHgpID09PSBrZXk7XG4gICAgfSk7XG4gICAgdmFyIGRhdGEgPSBCYWNvbi5vbmNlKHgpLmNvbmNhdChzaW1pbGFyKTtcbiAgICB2YXIgbGltaXRlZCA9IGxpbWl0RihkYXRhLCB4KS53aXRoSGFuZGxlcihmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIHRoaXMucHVzaChldmVudCk7XG4gICAgICBpZiAoZXZlbnQuaXNFbmQoKSkge1xuICAgICAgICByZXR1cm4gZGVsZXRlIHN0cmVhbXNba2V5XTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBzdHJlYW1zW2tleV0gPSBsaW1pdGVkO1xuICAgIHJldHVybiBsaW1pdGVkO1xuICB9KTtcbn07XG5cbkJhY29uLmZyb21BcnJheSA9IGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgYXNzZXJ0QXJyYXkodmFsdWVzKTtcbiAgaWYgKCF2YWx1ZXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHdpdGhEZXNjKG5ldyBCYWNvbi5EZXNjKEJhY29uLCBcImZyb21BcnJheVwiLCB2YWx1ZXMpLCBCYWNvbi5uZXZlcigpKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgaSA9IDA7XG4gICAgcmV0dXJuIG5ldyBFdmVudFN0cmVhbShuZXcgQmFjb24uRGVzYyhCYWNvbiwgXCJmcm9tQXJyYXlcIiwgW3ZhbHVlc10pLCBmdW5jdGlvbiAoc2luaykge1xuICAgICAgdmFyIHVuc3ViZCA9IGZhbHNlO1xuICAgICAgdmFyIHJlcGx5ID0gQmFjb24ubW9yZTtcbiAgICAgIHZhciBwdXNoaW5nID0gZmFsc2U7XG4gICAgICB2YXIgcHVzaE5lZWRlZCA9IGZhbHNlO1xuICAgICAgdmFyIHB1c2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHB1c2hOZWVkZWQgPSB0cnVlO1xuICAgICAgICBpZiAocHVzaGluZykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBwdXNoaW5nID0gdHJ1ZTtcbiAgICAgICAgd2hpbGUgKHB1c2hOZWVkZWQpIHtcbiAgICAgICAgICBwdXNoTmVlZGVkID0gZmFsc2U7XG4gICAgICAgICAgaWYgKHJlcGx5ICE9PSBCYWNvbi5ub01vcmUgJiYgIXVuc3ViZCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdmFsdWVzW2krK107XG4gICAgICAgICAgICByZXBseSA9IHNpbmsodG9FdmVudCh2YWx1ZSkpO1xuICAgICAgICAgICAgaWYgKHJlcGx5ICE9PSBCYWNvbi5ub01vcmUpIHtcbiAgICAgICAgICAgICAgaWYgKGkgPT09IHZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBzaW5rKGVuZEV2ZW50KCkpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFVwZGF0ZUJhcnJpZXIuYWZ0ZXJUcmFuc2FjdGlvbihwdXNoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwdXNoaW5nID0gZmFsc2U7XG4gICAgICAgIHJldHVybiBwdXNoaW5nO1xuICAgICAgfTtcblxuICAgICAgcHVzaCgpO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdW5zdWJkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHVuc3ViZDtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbn07XG5cbkJhY29uLkV2ZW50U3RyZWFtLnByb3RvdHlwZS5ob2xkV2hlbiA9IGZ1bmN0aW9uICh2YWx2ZSkge1xuICB2YXIgb25Ib2xkID0gZmFsc2U7XG4gIHZhciBidWZmZXJlZFZhbHVlcyA9IFtdO1xuICB2YXIgc3JjID0gdGhpcztcbiAgdmFyIHNyY0lzRW5kZWQgPSBmYWxzZTtcbiAgcmV0dXJuIG5ldyBFdmVudFN0cmVhbShuZXcgQmFjb24uRGVzYyh0aGlzLCBcImhvbGRXaGVuXCIsIFt2YWx2ZV0pLCBmdW5jdGlvbiAoc2luaykge1xuICAgIHZhciBjb21wb3NpdGUgPSBuZXcgQ29tcG9zaXRlVW5zdWJzY3JpYmUoKTtcbiAgICB2YXIgc3Vic2NyaWJlZCA9IGZhbHNlO1xuICAgIHZhciBlbmRJZkJvdGhFbmRlZCA9IGZ1bmN0aW9uICh1bnN1Yikge1xuICAgICAgaWYgKHR5cGVvZiB1bnN1YiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHVuc3ViKCk7XG4gICAgICB9XG4gICAgICBpZiAoY29tcG9zaXRlLmVtcHR5KCkgJiYgc3Vic2NyaWJlZCkge1xuICAgICAgICByZXR1cm4gc2luayhlbmRFdmVudCgpKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGNvbXBvc2l0ZS5hZGQoZnVuY3Rpb24gKHVuc3ViQWxsLCB1bnN1Yk1lKSB7XG4gICAgICByZXR1cm4gdmFsdmUuc3Vic2NyaWJlSW50ZXJuYWwoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5oYXNWYWx1ZSgpKSB7XG4gICAgICAgICAgb25Ib2xkID0gZXZlbnQudmFsdWUoKTtcbiAgICAgICAgICBpZiAoIW9uSG9sZCkge1xuICAgICAgICAgICAgdmFyIHRvU2VuZCA9IGJ1ZmZlcmVkVmFsdWVzO1xuICAgICAgICAgICAgYnVmZmVyZWRWYWx1ZXMgPSBbXTtcbiAgICAgICAgICAgIHJldHVybiAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCB2YWx1ZTsgaSA8IHRvU2VuZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdG9TZW5kW2ldO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHNpbmsobmV4dEV2ZW50KHZhbHVlKSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChzcmNJc0VuZGVkKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goc2luayhlbmRFdmVudCgpKSk7XG4gICAgICAgICAgICAgICAgdW5zdWJNZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9KSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5pc0VuZCgpKSB7XG4gICAgICAgICAgcmV0dXJuIGVuZElmQm90aEVuZGVkKHVuc3ViTWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBzaW5rKGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgY29tcG9zaXRlLmFkZChmdW5jdGlvbiAodW5zdWJBbGwsIHVuc3ViTWUpIHtcbiAgICAgIHJldHVybiBzcmMuc3Vic2NyaWJlSW50ZXJuYWwoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChvbkhvbGQgJiYgZXZlbnQuaGFzVmFsdWUoKSkge1xuICAgICAgICAgIHJldHVybiBidWZmZXJlZFZhbHVlcy5wdXNoKGV2ZW50LnZhbHVlKCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmlzRW5kKCkgJiYgYnVmZmVyZWRWYWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgc3JjSXNFbmRlZCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuIGVuZElmQm90aEVuZGVkKHVuc3ViTWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBzaW5rKGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgc3Vic2NyaWJlZCA9IHRydWU7XG4gICAgZW5kSWZCb3RoRW5kZWQoKTtcbiAgICByZXR1cm4gY29tcG9zaXRlLnVuc3Vic2NyaWJlO1xuICB9KTtcbn07XG5cbkJhY29uLmludGVydmFsID0gZnVuY3Rpb24gKGRlbGF5KSB7XG4gIHZhciB2YWx1ZSA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzFdO1xuXG4gIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyhCYWNvbiwgXCJpbnRlcnZhbFwiLCBbZGVsYXksIHZhbHVlXSksIEJhY29uLmZyb21Qb2xsKGRlbGF5LCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5leHRFdmVudCh2YWx1ZSk7XG4gIH0pKTtcbn07XG5cbkJhY29uLiQgPSB7fTtcbkJhY29uLiQuYXNFdmVudFN0cmVhbSA9IGZ1bmN0aW9uIChldmVudE5hbWUsIHNlbGVjdG9yLCBldmVudFRyYW5zZm9ybWVyKSB7XG4gIHZhciBfdGhpczExID0gdGhpcztcblxuICBpZiAoXy5pc0Z1bmN0aW9uKHNlbGVjdG9yKSkge1xuICAgIGV2ZW50VHJhbnNmb3JtZXIgPSBzZWxlY3RvcjtcbiAgICBzZWxlY3RvciA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyh0aGlzLnNlbGVjdG9yIHx8IHRoaXMsIFwiYXNFdmVudFN0cmVhbVwiLCBbZXZlbnROYW1lXSksIEJhY29uLmZyb21CaW5kZXIoZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICBfdGhpczExLm9uKGV2ZW50TmFtZSwgc2VsZWN0b3IsIGhhbmRsZXIpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gX3RoaXMxMS5vZmYoZXZlbnROYW1lLCBzZWxlY3RvciwgaGFuZGxlcik7XG4gICAgfTtcbiAgfSwgZXZlbnRUcmFuc2Zvcm1lcikpO1xufTtcblxuaWYgKHR5cGVvZiBqUXVlcnkgIT09IFwidW5kZWZpbmVkXCIgJiYgalF1ZXJ5KSB7XG4gIGpRdWVyeS5mbi5hc0V2ZW50U3RyZWFtID0gQmFjb24uJC5hc0V2ZW50U3RyZWFtO1xufVxuXG5pZiAodHlwZW9mIFplcHRvICE9PSBcInVuZGVmaW5lZFwiICYmIFplcHRvKSB7XG4gIFplcHRvLmZuLmFzRXZlbnRTdHJlYW0gPSBCYWNvbi4kLmFzRXZlbnRTdHJlYW07XG59XG5cbkJhY29uLk9ic2VydmFibGUucHJvdG90eXBlLmxhc3QgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBsYXN0RXZlbnQ7XG5cbiAgcmV0dXJuIHdpdGhEZXNjKG5ldyBCYWNvbi5EZXNjKHRoaXMsIFwibGFzdFwiLCBbXSksIHRoaXMud2l0aEhhbmRsZXIoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmlzRW5kKCkpIHtcbiAgICAgIGlmIChsYXN0RXZlbnQpIHtcbiAgICAgICAgdGhpcy5wdXNoKGxhc3RFdmVudCk7XG4gICAgICB9XG4gICAgICB0aGlzLnB1c2goZW5kRXZlbnQoKSk7XG4gICAgICByZXR1cm4gQmFjb24ubm9Nb3JlO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXN0RXZlbnQgPSBldmVudDtcbiAgICB9XG4gIH0pKTtcbn07XG5cbkJhY29uLk9ic2VydmFibGUucHJvdG90eXBlLmxvZyA9IGZ1bmN0aW9uICgpIHtcbiAgZm9yICh2YXIgX2xlbjE5ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4xOSksIF9rZXkxOSA9IDA7IF9rZXkxOSA8IF9sZW4xOTsgX2tleTE5KyspIHtcbiAgICBhcmdzW19rZXkxOV0gPSBhcmd1bWVudHNbX2tleTE5XTtcbiAgfVxuXG4gIHRoaXMuc3Vic2NyaWJlKGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgY29uc29sZS5sb2cgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJncy5jb25jYXQoW2V2ZW50LmxvZygpXSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuQmFjb24uRXZlbnRTdHJlYW0ucHJvdG90eXBlLm1lcmdlID0gZnVuY3Rpb24gKHJpZ2h0KSB7XG4gIGFzc2VydEV2ZW50U3RyZWFtKHJpZ2h0KTtcbiAgdmFyIGxlZnQgPSB0aGlzO1xuICByZXR1cm4gd2l0aERlc2MobmV3IEJhY29uLkRlc2MobGVmdCwgXCJtZXJnZVwiLCBbcmlnaHRdKSwgQmFjb24ubWVyZ2VBbGwodGhpcywgcmlnaHQpKTtcbn07XG5cbkJhY29uLm1lcmdlQWxsID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc3RyZWFtcyA9IGFyZ3VtZW50c1RvT2JzZXJ2YWJsZXMoYXJndW1lbnRzKTtcbiAgaWYgKHN0cmVhbXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG5ldyBFdmVudFN0cmVhbShuZXcgQmFjb24uRGVzYyhCYWNvbiwgXCJtZXJnZUFsbFwiLCBzdHJlYW1zKSwgZnVuY3Rpb24gKHNpbmspIHtcbiAgICAgIHZhciBlbmRzID0gMDtcbiAgICAgIHZhciBzbWFydFNpbmsgPSBmdW5jdGlvbiAob2JzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodW5zdWJCb3RoKSB7XG4gICAgICAgICAgcmV0dXJuIG9icy5kaXNwYXRjaGVyLnN1YnNjcmliZShmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5pc0VuZCgpKSB7XG4gICAgICAgICAgICAgIGVuZHMrKztcbiAgICAgICAgICAgICAgaWYgKGVuZHMgPT09IHN0cmVhbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNpbmsoZW5kRXZlbnQoKSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEJhY29uLm1vcmU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHZhciByZXBseSA9IHNpbmsoZXZlbnQpO1xuICAgICAgICAgICAgICBpZiAocmVwbHkgPT09IEJhY29uLm5vTW9yZSkge1xuICAgICAgICAgICAgICAgIHVuc3ViQm90aCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiByZXBseTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgICB2YXIgc2lua3MgPSBfLm1hcChzbWFydFNpbmssIHN0cmVhbXMpO1xuICAgICAgcmV0dXJuIG5ldyBCYWNvbi5Db21wb3NpdGVVbnN1YnNjcmliZShzaW5rcykudW5zdWJzY3JpYmU7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIEJhY29uLm5ldmVyKCk7XG4gIH1cbn07XG5cbkJhY29uLnJlcGVhdGVkbHkgPSBmdW5jdGlvbiAoZGVsYXksIHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAwO1xuICByZXR1cm4gd2l0aERlc2MobmV3IEJhY29uLkRlc2MoQmFjb24sIFwicmVwZWF0ZWRseVwiLCBbZGVsYXksIHZhbHVlc10pLCBCYWNvbi5mcm9tUG9sbChkZWxheSwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB2YWx1ZXNbaW5kZXgrKyAlIHZhbHVlcy5sZW5ndGhdO1xuICB9KSk7XG59O1xuXG5CYWNvbi5yZXBlYXQgPSBmdW5jdGlvbiAoZ2VuZXJhdG9yKSB7XG4gIHZhciBpbmRleCA9IDA7XG4gIHJldHVybiBCYWNvbi5mcm9tQmluZGVyKGZ1bmN0aW9uIChzaW5rKSB7XG4gICAgdmFyIGZsYWcgPSBmYWxzZTtcbiAgICB2YXIgcmVwbHkgPSBCYWNvbi5tb3JlO1xuICAgIHZhciB1bnN1YiA9IGZ1bmN0aW9uICgpIHt9O1xuICAgIGZ1bmN0aW9uIGhhbmRsZUV2ZW50KGV2ZW50KSB7XG4gICAgICBpZiAoZXZlbnQuaXNFbmQoKSkge1xuICAgICAgICBpZiAoIWZsYWcpIHtcbiAgICAgICAgICByZXR1cm4gZmxhZyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHN1YnNjcmliZU5leHQoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlcGx5ID0gc2luayhldmVudCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBmdW5jdGlvbiBzdWJzY3JpYmVOZXh0KCkge1xuICAgICAgdmFyIG5leHQ7XG4gICAgICBmbGFnID0gdHJ1ZTtcbiAgICAgIHdoaWxlIChmbGFnICYmIHJlcGx5ICE9PSBCYWNvbi5ub01vcmUpIHtcbiAgICAgICAgbmV4dCA9IGdlbmVyYXRvcihpbmRleCsrKTtcbiAgICAgICAgZmxhZyA9IGZhbHNlO1xuICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgIHVuc3ViID0gbmV4dC5zdWJzY3JpYmVJbnRlcm5hbChoYW5kbGVFdmVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2luayhlbmRFdmVudCgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZsYWcgPSB0cnVlO1xuICAgIH07XG4gICAgc3Vic2NyaWJlTmV4dCgpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdW5zdWIoKTtcbiAgICB9O1xuICB9KTtcbn07XG5cbkJhY29uLnJldHJ5ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgaWYgKCFfLmlzRnVuY3Rpb24ob3B0aW9ucy5zb3VyY2UpKSB7XG4gICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIidzb3VyY2UnIG9wdGlvbiBoYXMgdG8gYmUgYSBmdW5jdGlvblwiKTtcbiAgfVxuICB2YXIgc291cmNlID0gb3B0aW9ucy5zb3VyY2U7XG4gIHZhciByZXRyaWVzID0gb3B0aW9ucy5yZXRyaWVzIHx8IDA7XG4gIHZhciBtYXhSZXRyaWVzID0gb3B0aW9ucy5tYXhSZXRyaWVzIHx8IHJldHJpZXM7XG4gIHZhciBkZWxheSA9IG9wdGlvbnMuZGVsYXkgfHwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAwO1xuICB9O1xuICB2YXIgaXNSZXRyeWFibGUgPSBvcHRpb25zLmlzUmV0cnlhYmxlIHx8IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbiAgdmFyIGZpbmlzaGVkID0gZmFsc2U7XG4gIHZhciBlcnJvciA9IG51bGw7XG5cbiAgcmV0dXJuIHdpdGhEZXNjKG5ldyBCYWNvbi5EZXNjKEJhY29uLCBcInJldHJ5XCIsIFtvcHRpb25zXSksIEJhY29uLnJlcGVhdChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gdmFsdWVTdHJlYW0oKSB7XG4gICAgICByZXR1cm4gc291cmNlKCkuZW5kT25FcnJvcigpLndpdGhIYW5kbGVyKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQuaXNFcnJvcigpKSB7XG4gICAgICAgICAgZXJyb3IgPSBldmVudDtcbiAgICAgICAgICBpZiAoIShpc1JldHJ5YWJsZShlcnJvci5lcnJvcikgJiYgcmV0cmllcyA+IDApKSB7XG4gICAgICAgICAgICBmaW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wdXNoKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGV2ZW50Lmhhc1ZhbHVlKCkpIHtcbiAgICAgICAgICAgIGVycm9yID0gbnVsbDtcbiAgICAgICAgICAgIGZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMucHVzaChldmVudCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChmaW5pc2hlZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIGlmIChlcnJvcikge1xuICAgICAgdmFyIGNvbnRleHQgPSB7XG4gICAgICAgIGVycm9yOiBlcnJvci5lcnJvcixcbiAgICAgICAgcmV0cmllc0RvbmU6IG1heFJldHJpZXMgLSByZXRyaWVzXG4gICAgICB9O1xuICAgICAgdmFyIHBhdXNlID0gQmFjb24ubGF0ZXIoZGVsYXkoY29udGV4dCkpLmZpbHRlcihmYWxzZSk7XG4gICAgICByZXRyaWVzID0gcmV0cmllcyAtIDE7XG4gICAgICByZXR1cm4gcGF1c2UuY29uY2F0KEJhY29uLm9uY2UoKS5mbGF0TWFwKHZhbHVlU3RyZWFtKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWx1ZVN0cmVhbSgpO1xuICAgIH1cbiAgfSkpO1xufTtcblxuQmFjb24uc2VxdWVudGlhbGx5ID0gZnVuY3Rpb24gKGRlbGF5LCB2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gMDtcbiAgcmV0dXJuIHdpdGhEZXNjKG5ldyBCYWNvbi5EZXNjKEJhY29uLCBcInNlcXVlbnRpYWxseVwiLCBbZGVsYXksIHZhbHVlc10pLCBCYWNvbi5mcm9tUG9sbChkZWxheSwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZSA9IHZhbHVlc1tpbmRleCsrXTtcbiAgICBpZiAoaW5kZXggPCB2YWx1ZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSBlbHNlIGlmIChpbmRleCA9PT0gdmFsdWVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIFt2YWx1ZSwgZW5kRXZlbnQoKV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBlbmRFdmVudCgpO1xuICAgIH1cbiAgfSkpO1xufTtcblxuQmFjb24uT2JzZXJ2YWJsZS5wcm90b3R5cGUuc2tpcCA9IGZ1bmN0aW9uIChjb3VudCkge1xuICByZXR1cm4gd2l0aERlc2MobmV3IEJhY29uLkRlc2ModGhpcywgXCJza2lwXCIsIFtjb3VudF0pLCB0aGlzLndpdGhIYW5kbGVyKGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmICghZXZlbnQuaGFzVmFsdWUoKSkge1xuICAgICAgcmV0dXJuIHRoaXMucHVzaChldmVudCk7XG4gICAgfSBlbHNlIGlmIChjb3VudCA+IDApIHtcbiAgICAgIGNvdW50LS07XG4gICAgICByZXR1cm4gQmFjb24ubW9yZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucHVzaChldmVudCk7XG4gICAgfVxuICB9KSk7XG59O1xuXG5CYWNvbi5FdmVudFN0cmVhbS5wcm90b3R5cGUuc2tpcFVudGlsID0gZnVuY3Rpb24gKHN0YXJ0ZXIpIHtcbiAgdmFyIHN0YXJ0ZWQgPSBzdGFydGVyLnRha2UoMSkubWFwKHRydWUpLnRvUHJvcGVydHkoZmFsc2UpO1xuICByZXR1cm4gd2l0aERlc2MobmV3IEJhY29uLkRlc2ModGhpcywgXCJza2lwVW50aWxcIiwgW3N0YXJ0ZXJdKSwgdGhpcy5maWx0ZXIoc3RhcnRlZCkpO1xufTtcblxuQmFjb24uRXZlbnRTdHJlYW0ucHJvdG90eXBlLnNraXBXaGlsZSA9IGZ1bmN0aW9uIChmKSB7XG4gIGFzc2VydE9ic2VydmFibGVJc1Byb3BlcnR5KGYpO1xuICB2YXIgb2sgPSBmYWxzZTtcblxuICBmb3IgKHZhciBfbGVuMjAgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIwID4gMSA/IF9sZW4yMCAtIDEgOiAwKSwgX2tleTIwID0gMTsgX2tleTIwIDwgX2xlbjIwOyBfa2V5MjArKykge1xuICAgIGFyZ3NbX2tleTIwIC0gMV0gPSBhcmd1bWVudHNbX2tleTIwXTtcbiAgfVxuXG4gIHJldHVybiBjb252ZXJ0QXJnc1RvRnVuY3Rpb24odGhpcywgZiwgYXJncywgZnVuY3Rpb24gKGYpIHtcbiAgICByZXR1cm4gd2l0aERlc2MobmV3IEJhY29uLkRlc2ModGhpcywgXCJza2lwV2hpbGVcIiwgW2ZdKSwgdGhpcy53aXRoSGFuZGxlcihmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmIChvayB8fCAhZXZlbnQuaGFzVmFsdWUoKSB8fCAhZihldmVudC52YWx1ZSgpKSkge1xuICAgICAgICBpZiAoZXZlbnQuaGFzVmFsdWUoKSkge1xuICAgICAgICAgIG9rID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5wdXNoKGV2ZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBCYWNvbi5tb3JlO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfSk7XG59O1xuXG5CYWNvbi5PYnNlcnZhYmxlLnByb3RvdHlwZS5zbGlkaW5nV2luZG93ID0gZnVuY3Rpb24gKG4pIHtcbiAgdmFyIG1pblZhbHVlcyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IDAgOiBhcmd1bWVudHNbMV07XG5cbiAgcmV0dXJuIHdpdGhEZXNjKG5ldyBCYWNvbi5EZXNjKHRoaXMsIFwic2xpZGluZ1dpbmRvd1wiLCBbbiwgbWluVmFsdWVzXSksIHRoaXMuc2NhbihbXSwgZnVuY3Rpb24gKHdpbmRvdywgdmFsdWUpIHtcbiAgICByZXR1cm4gd2luZG93LmNvbmNhdChbdmFsdWVdKS5zbGljZSgtbik7XG4gIH0pLmZpbHRlcihmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgcmV0dXJuIHZhbHVlcy5sZW5ndGggPj0gbWluVmFsdWVzO1xuICB9KSk7XG59O1xuXG52YXIgc3BpZXMgPSBbXTtcbnZhciByZWdpc3Rlck9icyA9IGZ1bmN0aW9uIChvYnMpIHtcbiAgaWYgKHNwaWVzLmxlbmd0aCkge1xuICAgIGlmICghcmVnaXN0ZXJPYnMucnVubmluZykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVnaXN0ZXJPYnMucnVubmluZyA9IHRydWU7XG4gICAgICAgIHNwaWVzLmZvckVhY2goZnVuY3Rpb24gKHNweSkge1xuICAgICAgICAgIHNweShvYnMpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGRlbGV0ZSByZWdpc3Rlck9icy5ydW5uaW5nO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuQmFjb24uc3B5ID0gZnVuY3Rpb24gKHNweSkge1xuICByZXR1cm4gc3BpZXMucHVzaChzcHkpO1xufTtcblxuQmFjb24uUHJvcGVydHkucHJvdG90eXBlLnN0YXJ0V2l0aCA9IGZ1bmN0aW9uIChzZWVkKSB7XG4gIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyh0aGlzLCBcInN0YXJ0V2l0aFwiLCBbc2VlZF0pLCB0aGlzLnNjYW4oc2VlZCwgZnVuY3Rpb24gKHByZXYsIG5leHQpIHtcbiAgICByZXR1cm4gbmV4dDtcbiAgfSkpO1xufTtcblxuQmFjb24uRXZlbnRTdHJlYW0ucHJvdG90eXBlLnN0YXJ0V2l0aCA9IGZ1bmN0aW9uIChzZWVkKSB7XG4gIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyh0aGlzLCBcInN0YXJ0V2l0aFwiLCBbc2VlZF0pLCBCYWNvbi5vbmNlKHNlZWQpLmNvbmNhdCh0aGlzKSk7XG59O1xuXG5CYWNvbi5PYnNlcnZhYmxlLnByb3RvdHlwZS50YWtlV2hpbGUgPSBmdW5jdGlvbiAoZikge1xuICBhc3NlcnRPYnNlcnZhYmxlSXNQcm9wZXJ0eShmKTtcblxuICBmb3IgKHZhciBfbGVuMjEgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIxID4gMSA/IF9sZW4yMSAtIDEgOiAwKSwgX2tleTIxID0gMTsgX2tleTIxIDwgX2xlbjIxOyBfa2V5MjErKykge1xuICAgIGFyZ3NbX2tleTIxIC0gMV0gPSBhcmd1bWVudHNbX2tleTIxXTtcbiAgfVxuXG4gIHJldHVybiBjb252ZXJ0QXJnc1RvRnVuY3Rpb24odGhpcywgZiwgYXJncywgZnVuY3Rpb24gKGYpIHtcbiAgICByZXR1cm4gd2l0aERlc2MobmV3IEJhY29uLkRlc2ModGhpcywgXCJ0YWtlV2hpbGVcIiwgW2ZdKSwgdGhpcy53aXRoSGFuZGxlcihmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC5maWx0ZXIoZikpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVzaChldmVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnB1c2goZW5kRXZlbnQoKSk7XG4gICAgICAgIHJldHVybiBCYWNvbi5ub01vcmU7XG4gICAgICB9XG4gICAgfSkpO1xuICB9KTtcbn07XG5cbkJhY29uLkV2ZW50U3RyZWFtLnByb3RvdHlwZS50aHJvdHRsZSA9IGZ1bmN0aW9uIChkZWxheSkge1xuICByZXR1cm4gd2l0aERlc2MobmV3IEJhY29uLkRlc2ModGhpcywgXCJ0aHJvdHRsZVwiLCBbZGVsYXldKSwgdGhpcy5idWZmZXJXaXRoVGltZShkZWxheSkubWFwKGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICByZXR1cm4gdmFsdWVzW3ZhbHVlcy5sZW5ndGggLSAxXTtcbiAgfSkpO1xufTtcblxuQmFjb24uUHJvcGVydHkucHJvdG90eXBlLnRocm90dGxlID0gZnVuY3Rpb24gKGRlbGF5KSB7XG4gIHJldHVybiB0aGlzLmRlbGF5Q2hhbmdlcyhuZXcgQmFjb24uRGVzYyh0aGlzLCBcInRocm90dGxlXCIsIFtkZWxheV0pLCBmdW5jdGlvbiAoY2hhbmdlcykge1xuICAgIHJldHVybiBjaGFuZ2VzLnRocm90dGxlKGRlbGF5KTtcbiAgfSk7XG59O1xuXG5PYnNlcnZhYmxlLnByb3RvdHlwZS5maXJzdFRvUHJvbWlzZSA9IGZ1bmN0aW9uIChQcm9taXNlQ3RyKSB7XG4gIHZhciBfdGhpczEyID0gdGhpcztcblxuICBpZiAodHlwZW9mIFByb21pc2VDdHIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgIGlmICh0eXBlb2YgUHJvbWlzZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBQcm9taXNlQ3RyID0gUHJvbWlzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlRoZXJlIGlzbid0IGRlZmF1bHQgUHJvbWlzZSwgdXNlIHNoaW0gb3IgcGFyYW1ldGVyXCIpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXcgUHJvbWlzZUN0cihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgcmV0dXJuIF90aGlzMTIuc3Vic2NyaWJlKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYgKGV2ZW50Lmhhc1ZhbHVlKCkpIHtcbiAgICAgICAgcmVzb2x2ZShldmVudC52YWx1ZSgpKTtcbiAgICAgIH1cbiAgICAgIGlmIChldmVudC5pc0Vycm9yKCkpIHtcbiAgICAgICAgcmVqZWN0KGV2ZW50LmVycm9yKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIEJhY29uLm5vTW9yZTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG5PYnNlcnZhYmxlLnByb3RvdHlwZS50b1Byb21pc2UgPSBmdW5jdGlvbiAoUHJvbWlzZUN0cikge1xuICByZXR1cm4gdGhpcy5sYXN0KCkuZmlyc3RUb1Byb21pc2UoUHJvbWlzZUN0cik7XG59O1xuXG5CYWNvbltcInRyeVwiXSA9IGZ1bmN0aW9uIChmKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEJhY29uLm9uY2UoZih2YWx1ZSkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBuZXcgQmFjb24uRXJyb3IoZSk7XG4gICAgfVxuICB9O1xufTtcblxuQmFjb24udXBkYXRlID0gZnVuY3Rpb24gKGluaXRpYWwpIHtcbiAgZnVuY3Rpb24gbGF0ZUJpbmRGaXJzdChmKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGZvciAodmFyIF9sZW4yMyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMjMpLCBfa2V5MjMgPSAwOyBfa2V5MjMgPCBfbGVuMjM7IF9rZXkyMysrKSB7XG4gICAgICAgIGFyZ3NbX2tleTIzXSA9IGFyZ3VtZW50c1tfa2V5MjNdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgcmV0dXJuIGYuYXBwbHkodW5kZWZpbmVkLCBbaV0uY29uY2F0KGFyZ3MpKTtcbiAgICAgIH07XG4gICAgfTtcbiAgfVxuXG4gIGZvciAodmFyIF9sZW4yMiA9IGFyZ3VtZW50cy5sZW5ndGgsIHBhdHRlcm5zID0gQXJyYXkoX2xlbjIyID4gMSA/IF9sZW4yMiAtIDEgOiAwKSwgX2tleTIyID0gMTsgX2tleTIyIDwgX2xlbjIyOyBfa2V5MjIrKykge1xuICAgIHBhdHRlcm5zW19rZXkyMiAtIDFdID0gYXJndW1lbnRzW19rZXkyMl07XG4gIH1cblxuICB2YXIgaSA9IHBhdHRlcm5zLmxlbmd0aCAtIDE7XG4gIHdoaWxlIChpID4gMCkge1xuICAgIGlmICghKHBhdHRlcm5zW2ldIGluc3RhbmNlb2YgRnVuY3Rpb24pKSB7XG4gICAgICBwYXR0ZXJuc1tpXSA9IF8uYWx3YXlzKHBhdHRlcm5zW2ldKTtcbiAgICB9XG4gICAgcGF0dGVybnNbaV0gPSBsYXRlQmluZEZpcnN0KHBhdHRlcm5zW2ldKTtcbiAgICBpID0gaSAtIDI7XG4gIH1cbiAgcmV0dXJuIHdpdGhEZXNjKG5ldyBCYWNvbi5EZXNjKEJhY29uLCBcInVwZGF0ZVwiLCBbaW5pdGlhbF0uY29uY2F0KHBhdHRlcm5zKSksIEJhY29uLndoZW4uYXBwbHkoQmFjb24sIHBhdHRlcm5zKS5zY2FuKGluaXRpYWwsIGZ1bmN0aW9uICh4LCBmKSB7XG4gICAgcmV0dXJuIGYoeCk7XG4gIH0pKTtcbn07XG5cbkJhY29uLnppcEFzQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gIGZvciAodmFyIF9sZW4yNCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMjQpLCBfa2V5MjQgPSAwOyBfa2V5MjQgPCBfbGVuMjQ7IF9rZXkyNCsrKSB7XG4gICAgYXJnc1tfa2V5MjRdID0gYXJndW1lbnRzW19rZXkyNF07XG4gIH1cblxuICB2YXIgc3RyZWFtcyA9IGFyZ3VtZW50c1RvT2JzZXJ2YWJsZXMoYXJncyk7XG4gIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyhCYWNvbiwgXCJ6aXBBc0FycmF5XCIsIHN0cmVhbXMpLCBCYWNvbi56aXBXaXRoKHN0cmVhbXMsIGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBfbGVuMjUgPSBhcmd1bWVudHMubGVuZ3RoLCB4cyA9IEFycmF5KF9sZW4yNSksIF9rZXkyNSA9IDA7IF9rZXkyNSA8IF9sZW4yNTsgX2tleTI1KyspIHtcbiAgICAgIHhzW19rZXkyNV0gPSBhcmd1bWVudHNbX2tleTI1XTtcbiAgICB9XG5cbiAgICByZXR1cm4geHM7XG4gIH0pKTtcbn07XG5cbkJhY29uLnppcFdpdGggPSBmdW5jdGlvbiAoKSB7XG4gIGZvciAodmFyIF9sZW4yNiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMjYpLCBfa2V5MjYgPSAwOyBfa2V5MjYgPCBfbGVuMjY7IF9rZXkyNisrKSB7XG4gICAgYXJnc1tfa2V5MjZdID0gYXJndW1lbnRzW19rZXkyNl07XG4gIH1cblxuICB2YXIgb2JzZXJ2YWJsZXNBbmRGdW5jdGlvbiA9IGFyZ3VtZW50c1RvT2JzZXJ2YWJsZXNBbmRGdW5jdGlvbihhcmdzKTtcbiAgdmFyIHN0cmVhbXMgPSBvYnNlcnZhYmxlc0FuZEZ1bmN0aW9uWzBdO1xuICB2YXIgZiA9IG9ic2VydmFibGVzQW5kRnVuY3Rpb25bMV07XG5cbiAgc3RyZWFtcyA9IF8ubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgcmV0dXJuIHMudG9FdmVudFN0cmVhbSgpO1xuICB9LCBzdHJlYW1zKTtcbiAgcmV0dXJuIHdpdGhEZXNjKG5ldyBCYWNvbi5EZXNjKEJhY29uLCBcInppcFdpdGhcIiwgW2ZdLmNvbmNhdChzdHJlYW1zKSksIEJhY29uLndoZW4oc3RyZWFtcywgZikpO1xufTtcblxuQmFjb24uT2JzZXJ2YWJsZS5wcm90b3R5cGUuemlwID0gZnVuY3Rpb24gKG90aGVyLCBmKSB7XG4gIHJldHVybiB3aXRoRGVzYyhuZXcgQmFjb24uRGVzYyh0aGlzLCBcInppcFwiLCBbb3RoZXJdKSwgQmFjb24uemlwV2l0aChbdGhpcywgb3RoZXJdLCBmIHx8IEFycmF5KSk7XG59O1xuXG5pZiAodHlwZW9mIGRlZmluZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBkZWZpbmUgIT09IG51bGwgJiYgZGVmaW5lLmFtZCAhPSBudWxsKSB7XG4gIGRlZmluZShbXSwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBCYWNvbjtcbiAgfSk7XG4gIGlmICh0eXBlb2YgdGhpcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0aGlzICE9PSBudWxsKSB7XG4gICAgdGhpcy5CYWNvbiA9IEJhY29uO1xuICB9XG59IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlICE9PSBudWxsICYmIG1vZHVsZS5leHBvcnRzICE9IG51bGwpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBCYWNvbjtcbiAgQmFjb24uQmFjb24gPSBCYWNvbjtcbn0gZWxzZSB7XG4gICAgdGhpcy5CYWNvbiA9IEJhY29uO1xuICB9XG59KS5jYWxsKHRoaXMpO1xuIl19
