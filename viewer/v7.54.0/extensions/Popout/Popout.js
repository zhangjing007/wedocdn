/*!
 * LMV v7.54.0
 *
 * Copyright 2021 Autodesk, Inc.
 * All rights reserved.
 *
 * This computer source code and related instructions and comments are the
 * unpublished confidential and proprietary information of Autodesk, Inc.
 * and are protected under Federal copyright and state trade secret law.
 * They may not be disclosed to, copied or used by any third party without
 * the prior written consent of Autodesk, Inc.
 *
 * Autodesk Forge Viewer Usage Limitations:
 *
 * The Autodesk Forge Viewer JavaScript must be delivered from an
 * Autodesk-hosted URL.
 */
/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "./extensions/Popout/thirdparty/popout.js":
/*!************************************************!*\
  !*** ./extensions/Popout/thirdparty/popout.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Popout": () => (/* binding */ Popout),
/* harmony export */   "resetImageBlobUrls": () => (/* binding */ resetImageBlobUrls)
/* harmony export */ });
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(Object(source), true).forEach(function (key) {_defineProperty(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(Object(source)).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}
// MIT License

// Copyright (c) Microsoft Corporation. All rights reserved.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE


/**
 * This is a modified version of poput source code without react dependency
 * from https://github.com/microsoft/react-popout-component
 */


var av = Autodesk.Viewing;
var _window = av.getGlobal();

/**
                               * Generates feature string for window open
                               */
function generateWindowFeaturesString(optionsProp) {
  var valueOf = function valueOf(val) {
    if (typeof val === 'boolean') {
      return val ? '1' : '0';
    } else if (val) {
      return String(val);
    }
  };

  var options = {
    left: 0,
    top: 0,
    height: 600,
    width: 800,
    location: false,
    menubar: false,
    resizable: false,
    scrollbars: false,
    status: false,
    toolbar: false };


  // merge options
  options = _objectSpread(_objectSpread({}, options), optionsProp);

  return Object.getOwnPropertyNames(options).
  map(function (key) {return "".concat(key, "=").concat(valueOf(options[key]));}).
  join(',');
}

function crossBrowserCloneNode(element, targetDocument) {
  var cloned = targetDocument.createElement(element.tagName);
  cloned.innerHTML = element.innerHTML;

  if (element.hasAttributes()) {
    var attribute;
    for (var i = 0; i < element.attributes.length; i++) {
      attribute = element.attributes[i];
      cloned.setAttribute(attribute.name, attribute.value);
    }
  }

  return cloned;
}

var globalContext = {
  id: '__$$VIEWER_POPOUT_COMPONENT$$__',

  set: function set(key, value) {
    _window[this.id] = _window[this.id] || {};
    _window[this.id][key] = value;
  },

  get: function get(key) {
    return _window[this.id] && _window[this.id][key];
  } };


var popouts = {};

var monitors = {};

var delay = 250;

function start(id /*: string*/) {
  var monitor = function monitor() {
    if (popouts[id] && popouts[id].props.onClose) {
      if (!popouts[id].child || popouts[id].child.closed) {
        stop(id);
        popouts[id].props.onClose();
        popouts[id].child = null;
      } else {
        monitors[id] = setTimeout(monitor, delay);
      }
    }
  };

  monitors[id] = setTimeout(monitor, delay);
}

function stop(id /*: string*/) {
  if (monitors[id]) {
    clearTimeout(monitors[id]);
    delete monitors[id];
  }
}

globalContext.set('startMonitor', start);

/** Added by LMV */
globalContext.set('dispose', function dispose(id) {
  delete popouts[id];
});

function validateUrl(url /*: string*/) {
  if (!url) {
    return;
  }

  var parser = document.createElement('a');
  parser.href = url;

  var current = _window.location;

  if (
  parser.hostname && current.hostname != parser.hostname ||
  parser.protocol && current.protocol != parser.protocol)
  {
    throw new Error("react-popup-component error: cross origin URLs are not supported (window=".concat(

    current.protocol, "//").concat(
    current.hostname, "; popout=").concat(parser.protocol, "//").concat(parser.hostname, ")"));

  }
}

function validatePopupBlocker(child /*: Window*/) {
  if (!child || child.closed || typeof child == 'undefined' || typeof child.closed == 'undefined') {
    return null;
  }

  return child;
}

function isChildWindowOpened(child /*: Window | null*/) {
  return child && !child.closed;
}

function getWindowName(name /*: string*/) {
  return (
    name ||
    Math.random().
    toString(12).
    slice(2));

}

function forEachStyleElement(
nodeList /*: NodeList*/,
callback /*: (element: HTMLElement, index?: number) => void*/,
scope /*?: any*/)
{
  var element /*: HTMLElement*/;

  for (var i = 0; i < nodeList.length; i++) {
    element = nodeList[i] /* as HTMLElement*/;
    if (element.tagName == 'STYLE') {
      callback.call(scope, element, i);
    }
  }
}

function isBrowserIEOrEdge() {
  var userAgent = typeof navigator != 'undefined' && navigator.userAgent ? navigator.userAgent : '';
  return /Edge/.test(userAgent) || /Trident/.test(userAgent);
}var

Popout = /*#__PURE__*/function () {
  function Popout(props) {_classCallCheck(this, Popout);
    this.container = null;
    this.setupAttempts = 0;
    this.styleElement = null;
    this.child = null;

    /* props
                       {
                       html,
                       url,
                       options,
                       name,
                       onBlocked,
                           hidden
                       }
                       */
    this.props = props;
    this.styleCount = 0;
  }_createClass(Popout, [{ key: "setupOnCloseHandler", value: function setupOnCloseHandler(

    id /*: string*/, child /*: Window*/) {var _this = this;
      // For Edge, IE browsers, the document.head might not exist here yet. We will just simply attempt again when RAF is called
      // For Firefox, on the setTimeout, the child window might actually be set to null after the first attempt if there is a popup blocker
      if (this.setupAttempts >= 5) {
        return;
      }

      if (child && child.document && child.document.head) {
        var unloadScriptContainer = child.document.createElement('script');
        var onBeforeUnloadLogic = "\n            window.onbeforeunload = function(e) {\n                var result = window.opener.".concat(

        globalContext.id, ".onBeforeUnload.call(window, '").concat(id, "', e);\n\n                if (result) {\n                    window.opener.").concat(


        globalContext.id, ".startMonitor.call(window.opener, '").concat(id, "');\n\n                    e.returnValue = result;\n                    return result;\n                } else {\n                    window.opener.").concat(




        globalContext.id, ".onChildClose.call(window.opener, '").concat(id, "');\n                }\n\n                // Added by LMV - free memory\n                window.opener.").concat(



        globalContext.id, ".dispose.call(window.opener, '").concat(id, "');\n            }");


        // Use onload for most URL scenarios to allow time for the page to load first
        // Safari 11.1 is aggressive, so it will call onbeforeunload prior to the page being created.
        unloadScriptContainer.innerHTML = "\n            window.onload = function(e) {\n                ".concat(

        onBeforeUnloadLogic, "\n            };\n            ");



        // For edge and IE, they don't actually execute the onload logic, so we just want the onBeforeUnload logic.
        // If this isn't a URL scenario, we have to bind onBeforeUnload directly too.
        if (isBrowserIEOrEdge() || !this.props.url) {
          unloadScriptContainer.innerHTML = onBeforeUnloadLogic;
        }

        child.document.head.appendChild(unloadScriptContainer);

        this.setupCleanupCallbacks();
      } else {
        this.setupAttempts++;
        setTimeout(function () {return _this.setupOnCloseHandler(id, child);}, 50);
      }
    } }, { key: "setupCleanupCallbacks", value: function setupCleanupCallbacks()

    {var _this2 = this;
      // Close the popout if main window is closed.
      window.addEventListener('unload', function (e) {return _this2.closeChildWindowIfOpened();});

      globalContext.set('onChildClose', function (id /*: string*/) {
        if (popouts[id] && popouts[id].props.onClose) {
          popouts[id].props.onClose();
        }
      });

      globalContext.set('onBeforeUnload', function (id /*: string*/, evt /*: BeforeUnloadEvent*/) {
        if (popouts[id] && popouts[id].props.onBeforeUnload) {
          return popouts[id].props.onBeforeUnload(evt);
        }
      });
    } }, { key: "setupStyleElement", value: function setupStyleElement(

    child /*: Window*/) {
      this.styleElement = child.document.createElement('style');
      this.styleElement.setAttribute('data-this-styles', 'true');
      this.styleElement.type = 'text/css';

      child.document.head.appendChild(this.styleElement);
    } }, { key: "injectHtml", value: function injectHtml(

    id /*: string*/, child /*: Window*/) {
      var container /*: HTMLDivElement*/;

      if (this.props.html) {
        child.document.write(this.props.html);
        this.copyStyles(child);
        container = child.document.getElementById(id);
        if (!container) {
          container = child.document.createElement('div');
          container.id = id;
          child.document.body.appendChild(container);
        }
      } else {
        var childHtml = '<!DOCTYPE html><html><head>';
        for (var i = window.document.styleSheets.length - 1; i >= 0; i--) {
          var styleSheet = window.document.styleSheets[i]; /* as CSSStyleSheet*/
          try {
            var cssText = styleSheet.cssText;
            childHtml += "<style>".concat(cssText, "</style>");
          } catch (_unused) {
            // IE11 will throw a security exception sometimes when accessing cssText.
            // There's no good way to detect this, so we capture the exception instead.
          }
        }
        childHtml += "</head><body><div id=\"".concat(id, "\"></div></body></html>");
        child.document.write(childHtml);
        container = child.document.getElementById(id) /*! as HTMLDivElement*/;
      }

      // Create a document with the styles of the parent window first
      this.setupStyleElement(child);

      return container;
    }

    /** Added by LMV */ }, { key: "copyStyles", value: function copyStyles(
    child) {
      var head = child.document.head;

      var cssText = '';
      var rules = null;

      for (var i = _window.document.styleSheets.length - 1; i >= 0; i--) {
        var styleSheet = _window.document.styleSheets[i]; /* as CSSStyleSheet*/
        try {
          rules = styleSheet.cssRules;
        } catch (_unused2) {
          // We're primarily looking for a security exception here.
          // See https://bugs.chromium.org/p/chromium/issues/detail?id=775525
          // Try to just embed the style element instead.
          var styleElement = child.document.createElement('link');
          styleElement.type = styleSheet.type;
          styleElement.rel = 'stylesheet';
          styleElement.href = styleSheet.href;
          head.appendChild(styleElement);
        } finally {
          if (rules) {
            for (var j = 0; j < rules.length; j++) {
              try {
                cssText += rules[j].cssText;
              } catch (_unused3) {
                // IE11 will throw a security exception sometimes when accessing cssText.
                // There's no good way to detect this, so we capture the exception instead.
              }
            }
          }
        }

        rules = null;
      }

      var style = child.document.createElement('style');
      style.innerHTML = cssText;

      head.appendChild(style);
    } }, { key: "setupStyleObserver", value: function setupStyleObserver(

    child /*: Window*/) {
      // Add style observer for legacy style node additions
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.type == 'childList') {
            forEachStyleElement(mutation.addedNodes, function (element) {
              child.document.head.appendChild(crossBrowserCloneNode(element, child.document));
            });
          }
        });
      });

      var config = { childList: true };

      observer.observe(document.head, config);
    } }, { key: "initializeChildWindow", value: function initializeChildWindow(

    id /*: string*/, child /*: Window*/) {
      popouts[id] = this;

      if (!this.props.url) {
        var container /*: HTMLDivElement*/ = this.injectHtml(id, child);
        this.setupStyleObserver(child);
        this.setupOnCloseHandler(id, child);
        return container;
      } else {
        this.setupOnCloseHandler(id, child);

        return null;
      }
    }

    /** Added by LMV */ }, { key: "setupChild", value: function setupChild(
    element, child, setupStyleObserver) {
      this.child = child;
      this.container = element;
      popouts[element.id] = this;

      setupStyleObserver && this.setupStyleObserver(child);
      this.setupOnCloseHandler(element.id, child);
    } }, { key: "openChildWindow", value: function openChildWindow()

    {
      var options = generateWindowFeaturesString(this.props.options || {});

      var name = getWindowName(this.props.name);

      this.child = validatePopupBlocker(window.open(this.props.url || 'about:blank', name, options));

      if (!this.child) {
        if (this.props.onBlocked) {
          this.props.onBlocked();
        }
        this.container = null;
      } else {
        var id = "__".concat(name, "_container__");
        this.container = this.initializeChildWindow(id, this.child);
      }
    } }, { key: "closeChildWindowIfOpened", value: function closeChildWindowIfOpened()

    {
      if (isChildWindowOpened(this.child)) {
        this.child.close();

        // sometimes having the popup's dev console 
        // open may not close the popup
        // calling close again should close it
        this.child.close();

        this.child = null;
        if (this.props.onClose) {
          this.props.onClose();
        }
      }
    } }, { key: "renderChildWindow", value: function renderChildWindow()

    {
      validateUrl(this.props.url);

      if (!this.props.hidden) {
        if (!isChildWindowOpened(this.child)) {
          this.openChildWindow();
        }
      } else {
        this.closeChildWindowIfOpened();
      }
    } }]);return Popout;}();



/** Added by LMV */
function canvasFromImage(img) {
  var canvas = img.ownerDocument.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  return canvas;
}

/** Added by LMV */
function resetImageBlobUrls(el) {

  // all img descendants of el
  var images = el.querySelectorAll('img');var _loop = function _loop(
  i) {

    var img = images[i];

    // Skip non-blobs
    if (img.src.indexOf('blob:') !== 0) {
      return "continue";
    }

    img.onload = function () {
      URL.revokeObjectURL(img.src);
    };

    // createObjectURLs from images
    var canvas = canvasFromImage(img);
    canvas.toBlob(function (blob) {
      var url = URL.createObjectURL(blob);
      img.src = url;
    }, 'image/png');

    // so we don't see console errors if image src contains
    // previously revoked url
    img.src = '';};for (var i = 0; i < images.length; ++i) {var _ret = _loop(i);if (_ret === "continue") continue;

  }

}



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************************!*\
  !*** ./extensions/Popout/index.js ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PopoutExtension)
/* harmony export */ });
/* harmony import */ var _thirdparty_popout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./thirdparty/popout */ "./extensions/Popout/thirdparty/popout.js");
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}

var av = Autodesk.Viewing;
var avp = av.Private;

/**
                       * Extension to popout the viewer into child windows
                       * 
                       * The extension id is: `Autodesk.Viewing.Popout`
                       * 
                       * @example
                       *  viewer.loadExtension('Autodesk.Viewing.Popout');
                       * 
                       * @see {@link Autodesk.Viewing.Extension} for common inherited methods.
                       * @memberof Autodesk.Viewing.Extensions
                       * @alias Autodesk.Viewing.Extensions.PopoutExtension
                       */var
PopoutExtension = /*#__PURE__*/function (_av$Extension) {_inherits(PopoutExtension, _av$Extension);var _super = _createSuper(PopoutExtension);
  /**
                                                                                                                                                * @class
                                                                                                                                                * @param {Autodesk.Viewing.Viewer3D} viewer - Viewer instance.
                                                                                                                                                * @param {object} options - Not used.
                                                                                                                                                */
  function PopoutExtension(viewer) {var _this;var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};_classCallCheck(this, PopoutExtension);
    _this = _super.call(this, viewer, options);
    _this._viewer = viewer;
    _this._popoutInstance = null;
    _this._viewerParentNode = null;
    _this._onBeforeUnload = _this._onBeforeUnload.bind(_assertThisInitialized(_this));return _this;
  }

  /**
     * Extension interface method - loads the extension
     *
     * @alias Autodesk.Viewing.Extensions.PopoutExtension#load
     * @returns {boolean}
     */_createClass(PopoutExtension, [{ key: "load", value: function load()
    {
      return true;
    }

    /**
       * Extension interface method - unloads the extension
       *
       * @alias Autodesk.Viewing.Extensions.PopoutExtension#unload
       * @returns {boolean}
       */ }, { key: "unload", value: function unload()
    {
      return true;
    }

    /**
       * Use this to pop the viewer out to an existing window
       * 
       * @param {object} child - Already open window created with window.open()
       * @param {string} elementid - The dom element id in the child where the viewer will be moved to
       * @param {boolean} [copyStyles=true] - Flag to copy the styles from the current window to the child. 
       *                                      Set this to false if you intend to copy the styles yourself
       * @param {boolean} [setupStyleObserver=true] -  Style observers clone dynamically added <style></style> (from extensions loading) into child.
       *                                               This is required for extensions to work.
       *                                               Set this to false if you intend to set up the cloning with mutation observers yourself
       * 
       * @alias Autodesk.Viewing.Extensions.PopoutExtension#popoutToChild
       */ }, { key: "popoutToChild", value: function popoutToChild(
    child, elementid) {var copyStyles = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;var setupStyleObserver = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      var viewer = this.viewer;
      var logger = avp.logger;

      // validate input
      if (!child) {
        logger.error('Invalid child');
        return;
      }

      var elem = child.document.getElementById(elementid);
      if (!elem) {
        logger.error("Invalid element ".concat(elementid));
        return;
      }

      if (!viewer.container) {
        logger.error('Viewer is not part of DOM');
        return;
      }

      if (this._isPoppedOut()) {
        logger.info('Already popped out');
        return;
      }

      this._popoutInstance = new _thirdparty_popout__WEBPACK_IMPORTED_MODULE_0__.Popout({ hidden: false, onBeforeUnload: this._onBeforeUnload });

      // Copy all styles
      copyStyles && this._popoutInstance.copyStyles(child);
      // Set up style observers and close handlers
      this._popoutInstance.setupChild(elem, child, setupStyleObserver);
      // Popout
      this._moveViewerTo(child, elementid);
    }

    /**
       * Use this to pop the viewer out to a new blank window
       * 
       * @param {object} [options] - windowFeature options
       * @param {Function} [onBeforeUnload] - Called before the popout window is unloaded
       * @param {Function} [onClose] - Called when popout window is closed
       * @param {Function} [onBlocked] - Called when popup blockers block creating child window
       * 
       * @alias Autodesk.Viewing.Extensions.PopoutExtension#popoutToBlank
       */ }, { key: "popoutToBlank", value: function popoutToBlank(
    options, onBeforeUnload, onClose, onBlocked) {var _this2 = this;
      var viewer = this.viewer;
      var logger = avp.logger;

      if (!viewer.container) {
        logger.error('Viewer is not part of DOM');
        return;
      }

      if (this._isPoppedOut()) {
        logger.info('Already popped out');
        return;
      }

      // empty html body
      var html = "<!DOCTYPE html><html><head></head><body></body></html>";

      // Callback for onbeforeunloa, which handles closing the popout window
      var onBeforeUnloadCb = function onBeforeUnloadCb() {for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
        // Call user's version first
        if (onBeforeUnload) {
          onBeforeUnload.apply(null, args);
        }

        // call ours
        _this2._onBeforeUnload.apply(null, args);
      };

      // Create and show the popout
      var props = {
        options: options,
        hidden: false,
        html: html,
        onBeforeUnload: onBeforeUnloadCb,
        onClose: onClose,
        onBlocked: onBlocked };

      this._popoutInstance = new _thirdparty_popout__WEBPACK_IMPORTED_MODULE_0__.Popout(props);
      this._popoutInstance.renderChildWindow();

      // pop out
      if (this._popoutInstance.child && !this._popoutInstance.child.closed) {
        this._moveViewerTo(this._popoutInstance.child, this._popoutInstance.container.id);
      }
    }

    /**
       * Closes the popout window and moves the viewer back to the main window
       *
       * @alias Autodesk.Viewing.Extensions.PopoutExtension#popin
       */ }, { key: "popin", value: function popin()
    {
      if (this._popoutInstance) {
        this._popoutInstance.closeChildWindowIfOpened();
      }
    }

    /**
       * window.onbeforeunload callback
       *
       * @private
       */ }, { key: "_onBeforeUnload", value: function _onBeforeUnload()
    {
      this._moveViewerBack();
      this._popoutInstance = null;
    }

    /**
       * Call this to pop the viewer into a child window
       *
       * For this to work,
       *  1. The viewer's style.css link and other css added by the viewer  must be present in the child document's <head> tag and
       *  2. A mutationobserver should be set up to clone the style elements into the child as they appear (from other extension loading)
       *
       * @param {object} child - popout window
       * @param {*} elementid - the element id to append the viewer to
       * @private
       */ }, { key: "_moveViewerTo", value: function _moveViewerTo(
    child, elementid) {
      if (this._isPoppedOut()) {
        avp.logger.info('Already popped out');
        return;
      }

      // Move the viewer element
      var container = child.document.getElementById(elementid);
      if (container) {
        // Store parent node so we can come back
        this._viewerParentNode = this.viewer.container.parentNode;

        // re-get previously revoked image urls
        (0,_thirdparty_popout__WEBPACK_IMPORTED_MODULE_0__.resetImageBlobUrls)(this.viewer.container);

        // Move viewer dom into new container
        container.appendChild(this.viewer.container);

        // Change viewers window
        this.setWindow(child);
      }
    }

    /**
       * Moves the viewer back to the main window
       *
       * @private
       */ }, { key: "_moveViewerBack", value: function _moveViewerBack()
    {
      if (!this._isPoppedOut()) {
        avp.logger.info('Not popped out');
        return;
      }

      // re-get previously revoked image urls
      (0,_thirdparty_popout__WEBPACK_IMPORTED_MODULE_0__.resetImageBlobUrls)(this.viewer.container);

      // Move viewer element from popout back into main window
      this._viewerParentNode.appendChild(this.viewer.container);

      // change viewers window from popout to main
      this.setWindow(av.getGlobal());

      // bring viewer back to original size
      this.viewer.resize();
    }

    /**
       * Returns true if viewer has been moved to a child window
       *
       * @private
       */ }, { key: "_isPoppedOut", value: function _isPoppedOut()
    {
      return this.getWindow().opener === av.getGlobal();
    } }]);return PopoutExtension;}(av.Extension);


av.theExtensionManager.registerExtension('Autodesk.Viewing.Popout', PopoutExtension);
})();

Autodesk.Extensions.Popout = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=Popout.js.map