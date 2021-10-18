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

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/Minimap2D/MinimapStyle.css":
/*!****************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/Minimap2D/MinimapStyle.css ***!
  \****************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".minimap-canvas-container {\n  position: relative;\n  margin: 15px 5px 10px 5px; }\n\n.minimap-canvas-base {\n  position: absolute;\n  left: 0px;\n  top: 0px; }\n\n.minimap-canvas-background {\n  /*z-index: 100;*/ }\n\n.minimap-canvas-highlight {\n  /*z-index: 101;*/ }\n\n.minimap-unavailable {\n  color: #dbdbdb;\n  margin: 10px;\n  text-align: center; }\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var _i = 0; _i < this.length; _i++) {
        var id = this[_i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i2 = 0; _i2 < modules.length; _i2++) {
      var item = [].concat(modules[_i2]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/noSourceMaps.js":
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/noSourceMaps.js ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ "./extensions/Minimap2D/MinimapCanvas.js":
/*!***********************************************!*\
  !*** ./extensions/Minimap2D/MinimapCanvas.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MinimapCanvas)
/* harmony export */ });
/* harmony import */ var _MinimapStyle_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MinimapStyle.css */ "./extensions/Minimap2D/MinimapStyle.css");
/* harmony import */ var _MinimapThumbnail__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MinimapThumbnail */ "./extensions/Minimap2D/MinimapThumbnail.js");
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}


var av = Autodesk.Viewing;var

MinimapCanvas = /*#__PURE__*/function (_Autodesk$Viewing$Eve) {_inherits(MinimapCanvas, _Autodesk$Viewing$Eve);var _super = _createSuper(MinimapCanvas);
  function MinimapCanvas(backgroundImgs, docWidth, docHeight) {var _this;var initialSize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'large';_classCallCheck(this, MinimapCanvas);
    _this = _super.call(this);
    _this.minimapSize = _MinimapThumbnail__WEBPACK_IMPORTED_MODULE_1__.thumbnailSizes[initialSize];
    var maxDimension = Math.max(docWidth, docHeight);
    _this.widthFactor = docWidth / maxDimension;
    _this.heightFactor = docHeight / maxDimension;

    _this._initBackground();
    _this._initHighlight();
    _this._initContainer();

    _this.backgroundImgs = backgroundImgs;
    // Keep a cache of different sizes if needed
    _this.backgroundImg = new Image(); // The current image
    return _this;}_createClass(MinimapCanvas, [{ key: "_initContainer", value: function _initContainer()

    {
      var _document = this.getDocument();
      this.canvasContainer = _document.createElement('div');
      this.canvasContainer.className = 'minimap-canvas-container';
      this.canvasContainer.appendChild(this.backgroundCanvas);
      this.canvasContainer.appendChild(this.highlightCanvas);
      this._updateCanvasContainerSize();
    } }, { key: "_updateCanvasContainerSize", value: function _updateCanvasContainerSize()

    {
      this.canvasContainer.style.width = this.backgroundCanvas.width + 'px';
      this.canvasContainer.style.height = this.backgroundCanvas.height + 'px';
    } }, { key: "_initBackground", value: function _initBackground()

    {
      var _document = this.getDocument();
      this.backgroundCanvas = _document.createElement('canvas');
      this.backgroundCanvas.className = 'minimap-canvas-base minimap-canvas-background';
    } }, { key: "_initHighlight", value: function _initHighlight()

    {
      var _document = this.getDocument();
      this.highlightCanvas = _document.createElement('canvas');
      this.highlightCanvas.className = 'minimap-canvas-base minimap-canvas-highlight';
    } }, { key: "setSize", value: function setSize(

    newSize) {var _this2 = this;
      newSize = typeof newSize === 'string' ? _MinimapThumbnail__WEBPACK_IMPORTED_MODULE_1__.thumbnailSizes[newSize] : newSize;
      return new Promise(function (resolve, reject) {
        _this2.backgroundCanvas.width = _this2.highlightCanvas.width = Math.round(newSize * _this2.widthFactor);
        _this2.backgroundCanvas.height = _this2.highlightCanvas.height = Math.round(newSize * _this2.heightFactor);
        _this2._updateCanvasContainerSize();

        var lowestBound = Number.MAX_VALUE;
        var thumbnailSize = 'large';
        for (var size in _MinimapThumbnail__WEBPACK_IMPORTED_MODULE_1__.thumbnailSizes) {
          if (newSize <= _MinimapThumbnail__WEBPACK_IMPORTED_MODULE_1__.thumbnailSizes[size] && _MinimapThumbnail__WEBPACK_IMPORTED_MODULE_1__.thumbnailSizes[size] < lowestBound && Object.prototype.hasOwnProperty.call(_this2.backgroundImgs, size)) {
            thumbnailSize = size;
            lowestBound = _MinimapThumbnail__WEBPACK_IMPORTED_MODULE_1__.thumbnailSizes[size];
          }
        }

        _this2.setBackground(thumbnailSize).then(function () {
          _this2.drawBackground();
          resolve();
        });

        _this2.minimapSize = newSize;
      });
    } }, { key: "setBackground", value: function setBackground(

    thumbnailSize) {var _this3 = this;
      return new Promise(function (resolve, reject) {
        if (!Object.prototype.hasOwnProperty.call(_this3.backgroundImgs, thumbnailSize)) {
          reject('thumbnail size not found');
          return;
        }

        if (_this3.backgroundImg.src === _this3.backgroundImgs[thumbnailSize]) {
          resolve();
          return;
        }

        _this3.backgroundImg.onload = function () {
          _this3.setBackgroundSourceSize(thumbnailSize);
          resolve();
        };
        _this3.backgroundImg.src = _this3.backgroundImgs[thumbnailSize];
      });
    } }, { key: "setBackgroundSourceSize", value: function setBackgroundSourceSize(

    thumbnailSize) {
      var size = _MinimapThumbnail__WEBPACK_IMPORTED_MODULE_1__.thumbnailSizes[thumbnailSize];
      this.backgroundWidth = Math.round(size * this.widthFactor);
      this.backgroundHeight = Math.round(size * this.heightFactor);
      this.backgroundOffsetX = (size - this.backgroundWidth) / 2;
      this.backgroundOffsetY = (size - this.backgroundHeight) / 2;
    } }, { key: "drawBackground", value: function drawBackground()

    {
      var ctx = this.backgroundCanvas.getContext('2d');
      // TODO: Consider using smoothing only if size is not power of 2 (or odd number)
      ctx.mozImageSmoothingEnabled = false; // These parameters are reset when resizing the canvas
      ctx.webkitImageSmoothingEnabled = false;
      ctx.msImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(this.backgroundImg, this.backgroundOffsetX, this.backgroundOffsetY, this.backgroundWidth, this.backgroundHeight,
      0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);
    } }, { key: "drawHighlight", value: function drawHighlight(

    bottomLeft, topRight) {
      var startPos = { x: Math.round(bottomLeft.x), y: Math.round(topRight.y) };
      var width = Math.round(Math.max(topRight.x - bottomLeft.x, 2));
      var height = Math.round(Math.max(bottomLeft.y - topRight.y, 2));

      var ctx = this.highlightCanvas.getContext('2d');
      ctx.clearRect(0, 0, this.highlightCanvas.width, this.highlightCanvas.height);

      ctx.beginPath();
      ctx.lineWidth = '2';
      ctx.strokeStyle = '#CC3B3B';
      ctx.fillStyle = 'rgba(204, 59, 59, 0.2)'; // Same color but in rgba
      ctx.rect(startPos.x, startPos.y, width, height);
      ctx.fill();
      ctx.stroke();
    } }, { key: "setVisibility", value: function setVisibility(

    isVisible) {
      this.backgroundCanvas.style.visibility = isVisible ? 'visible' : 'hidden';
      this.highlightCanvas.style.visibility = isVisible ? 'visible' : 'hidden';
    } }, { key: "addListenerToCanvas", value: function addListenerToCanvas(

    event, callback) {
      this.highlightCanvas.addEventListener(event, callback);
    } }, { key: "removeListenerFromCanvas", value: function removeListenerFromCanvas(

    event, callback) {
      this.highlightCanvas.removeEventListener(event, callback);
    } }, { key: "getBoundingClientRect", value: function getBoundingClientRect()

    {
      return this.highlightCanvas.getBoundingClientRect();
    } }, { key: "unload", value: function unload()

    {
      var _window = this.getWindow();
      var urlCreator = _window.URL || _window.webkitURL;
      this.backgroundImg = null;
      for (var img in this.backgroundImgs) {
        urlCreator.revokeObjectURL(this.backgroundImgs[img]);
      }
    } }, { key: "width", get: function get()

    {
      return this.highlightCanvas.width;
    } }, { key: "height", get: function get()

    {
      return this.highlightCanvas.height;
    } }]);return MinimapCanvas;}(Autodesk.Viewing.EventDispatcher);


av.GlobalManagerMixin.call(MinimapCanvas.prototype);

/***/ }),

/***/ "./extensions/Minimap2D/MinimapPanel.js":
/*!**********************************************!*\
  !*** ./extensions/Minimap2D/MinimapPanel.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MinimapPanel)
/* harmony export */ });
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _get(target, property, receiver) {if (typeof Reflect !== "undefined" && Reflect.get) {_get = Reflect.get;} else {_get = function _get(target, property, receiver) {var base = _superPropBase(target, property);if (!base) return;var desc = Object.getOwnPropertyDescriptor(base, property);if (desc.get) {return desc.get.call(receiver);}return desc.value;};}return _get(target, property, receiver || target);}function _superPropBase(object, property) {while (!Object.prototype.hasOwnProperty.call(object, property)) {object = _getPrototypeOf(object);if (object === null) break;}return object;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}var MinimapPanel = /*#__PURE__*/function (_Autodesk$Viewing$UI$) {_inherits(MinimapPanel, _Autodesk$Viewing$UI$);var _super = _createSuper(MinimapPanel);
  function MinimapPanel(parentContainer, x, y, options) {var _this;_classCallCheck(this, MinimapPanel);
    _this = _super.call(this, parentContainer, 'MinimapPanel', 'Minimap', options);
    _this.container.style.left = x + 'px';
    _this.container.style.top = y + 'px';
    _this.container.classList.add("docking-panel-container-solid-color-b");

    _this.fadeIn = 'opacity 0.5s';
    _this.fadeOut = 'opacity 0.1s';
    _this.container.addEventListener('transitionend', function (e) {
      if (_this.container.style.opacity === '0') {
        _this.container.style.display = 'none';
      }
    });return _this;

  }_createClass(MinimapPanel, [{ key: "_addNoMinimapElem", value: function _addNoMinimapElem()

    {
      var _document = this.getDocument();
      this.noMinimapDiv = _document.createElement('div');
      this.noMinimapDiv.innerHTML = Autodesk.Viewing.i18n.translate('Minimap not available');
      this.noMinimapDiv.className = 'minimap-unavailable';
      this.container.appendChild(this.noMinimapDiv);
    } }, { key: "_removeNoMinimapElem", value: function _removeNoMinimapElem()

    {
      if (this.container.contains(this.noMinimapDiv)) {
        this.container.removeChild(this.noMinimapDiv);
      }
    } }, { key: "initialize", value: function initialize()

    {
      _get(_getPrototypeOf(MinimapPanel.prototype), "initialize", this).call(this);
      this._addNoMinimapElem();
    } }, { key: "appendElement", value: function appendElement(

    elem) {
      this._removeNoMinimapElem();
      this.container.appendChild(elem);
    } }, { key: "addListenerToCloseButton", value: function addListenerToCloseButton(

    cb) {
      this.addEventListener(this.closer, 'click', cb, false);
    } }, { key: "_triggerReflow", value: function _triggerReflow()

    {
      return this.container.offsetWidth;
    } }, { key: "_isVisible", value: function _isVisible()

    {
      return this.container.style.display === 'block';
    } }, { key: "setVisible", value: function setVisible(

    show, withTransition) {
      if (withTransition) {
        this.setVisibleWithTransition(show);
      } else {
        this.container.style.display = show ? 'block' : 'none';
        this.container.style.opacity = show ? '1' : '0';
      }
    } }, { key: "setVisibleWithTransition", value: function setVisibleWithTransition(

    show) {
      if (show) {
        var wasVisible = this._isVisible();
        this.container.style.transition = this.fadeIn;
        this.container.style.display = 'block';
        if (!wasVisible) {
          this.container.style.opacity = '0';
          this._triggerReflow();
        }
        this.container.style.opacity = '1';
      } else {
        this.container.style.transition = this.fadeOut;
        this.container.style.opacity = '0';

      }
    } }]);return MinimapPanel;}(Autodesk.Viewing.UI.DockingPanel);

/***/ }),

/***/ "./extensions/Minimap2D/MinimapThumbnail.js":
/*!**************************************************!*\
  !*** ./extensions/Minimap2D/MinimapThumbnail.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "thumbnailSizes": () => (/* binding */ thumbnailSizes),
/* harmony export */   "thumbnailDefaultSizes": () => (/* binding */ thumbnailDefaultSizes),
/* harmony export */   "fetchThumbnail": () => (/* binding */ fetchThumbnail)
/* harmony export */ });
var thumbnailSizes = {
  'small': 100,
  'medium': 200,
  'large': 400 };


var thumbnailDefaultSizes = {
  'mobile': 200,
  'web': 300 };


function fetchThumbnail(document, node, thumbnailSize, images) {
  return new Promise(function (resolve, reject) {
    var size = typeof thumbnailSize === 'string' ? thumbnailSizes[thumbnailSize] : thumbnailSize;
    var options = document.getThumbnailOptions(node.data, size, size);

    Autodesk.Viewing.Document.requestThumbnailWithSecurity(options, function (error, response) {
      if (error) {
        reject('Error requesting thumbnail');
        return;
      }
      var urlCreator = window.URL || window.webkitURL;
      images[thumbnailSize] = urlCreator.createObjectURL(response);
      resolve();
    });
  });
}

/***/ }),

/***/ "./extensions/Minimap2D/ThumbnailUtils.js":
/*!************************************************!*\
  !*** ./extensions/Minimap2D/ThumbnailUtils.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var ThumbnailUtils = {};

ThumbnailUtils.isThumbnailValid = function (canvas) {
  var predominantColorPercentage = ThumbnailUtils.getPredominantColorPercentage(canvas);
  return predominantColorPercentage < ThumbnailUtils.MAX_PREDOMINANT_COLOR_PERCENTAGE;
};

ThumbnailUtils.getPredominantColorPercentage = function (canvas) {
  var ctx = canvas.getContext('2d');
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var pixels = imageData.data;

  var colors = {};
  // Create a set for the pixels. Compare what percentage the largest color has
  for (var i = 0, n = pixels.length; i < n; i += 4) {
    var hexColor = ThumbnailUtils.rgba2hex(pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]);
    colors[hexColor] = Object.prototype.hasOwnProperty.call(colors, hexColor) ? colors[hexColor] + 1 : 1;
  }

  var predominantColorCount = Object.keys(colors).reduce(function (previous, key) {return colors[key] > previous ? colors[key] : previous;}, 0);
  var predominantColorPercentage = predominantColorCount / (pixels.length / 4);
  // console.log('Percent of predominant color', predominantColorPercentage);

  return predominantColorPercentage;
};

// convert RGBA color data to hex
ThumbnailUtils.rgba2hex = function (r, g, b, a) {
  if (r > 255 || g > 255 || b > 255 || a > 255) {
    throw 'Invalid color component';
  }
  return (256 + r).toString(16).substr(1) + ((1 << 24) + (g << 16) | b << 8 | a).toString(16).substr(1);
};

ThumbnailUtils.MAX_PREDOMINANT_COLOR_PERCENTAGE = 0.97;


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ThumbnailUtils);

/***/ }),

/***/ "./extensions/Minimap2D/MinimapStyle.css":
/*!***********************************************!*\
  !*** ./extensions/Minimap2D/MinimapStyle.css ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_MinimapStyle_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./MinimapStyle.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/Minimap2D/MinimapStyle.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_MinimapStyle_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_MinimapStyle_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_MinimapStyle_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_MinimapStyle_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var style = document.createElement("style");
  options.setAttributes(style, options.attributes);
  options.insert(style);
  return style;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(style) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    style.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute("media", media);
  } else {
    style.removeAttribute("media");
  }

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, style);
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


function domAPI(options) {
  var style = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(style, options, obj);
    },
    remove: function remove() {
      removeStyleElement(style);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, style) {
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

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
/******/ 			id: moduleId,
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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/*!*******************************************!*\
  !*** ./extensions/Minimap2D/Minimap2D.js ***!
  \*******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MinimapExtension)
/* harmony export */ });
/* harmony import */ var _MinimapThumbnail__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MinimapThumbnail */ "./extensions/Minimap2D/MinimapThumbnail.js");
/* harmony import */ var _MinimapCanvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MinimapCanvas */ "./extensions/Minimap2D/MinimapCanvas.js");
/* harmony import */ var _MinimapPanel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MinimapPanel */ "./extensions/Minimap2D/MinimapPanel.js");
/* harmony import */ var _ThumbnailUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ThumbnailUtils */ "./extensions/Minimap2D/ThumbnailUtils.js");
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}




var namespace = AutodeskNamespace('Autodesk.BIM360.Minimap');

var MIN_SIZE = 100;
var MAX_SIZE = 400;

var SETTINGS_PROP = 'showMinimap2D';

/**
                                      * Provides a 2d Minimap to show the view of the current document.
                                      * 
                                      * The extension id is: `Autodesk.BIM360.Minimap`
                                      * 
                                      * @example
                                      *   viewer.loadExtension('Autodesk.BIM360.Minimap')
                                      *  
                                      * @memberof Autodesk.Viewing.Extensions
                                      * @alias Autodesk.Viewing.Extensions.MinimapExtension
                                      * @see {@link Autodesk.Viewing.Extension} for common inherited methods.
                                      * @class
                                      */var

MinimapExtension = /*#__PURE__*/function (_Autodesk$Viewing$Ext) {_inherits(MinimapExtension, _Autodesk$Viewing$Ext);var _super = _createSuper(MinimapExtension);
  function MinimapExtension(viewer) {var _this;var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};_classCallCheck(this, MinimapExtension);
    _this = _super.call(this, viewer, options);
    _this._isEnabled = false;
    _this.isMobile = Autodesk.Viewing.isMobileDevice();
    _this.initialSize = _this.options.initialSize || null;
    _this.wasInit = false;

    _this.onMouseDown = _this.onMouseDown.bind(_assertThisInitialized(_this));
    _this.onMouseMove = _this.onMouseMove.bind(_assertThisInitialized(_this));
    _this.onMouseUp = _this.onMouseUp.bind(_assertThisInitialized(_this));
    _this.onMouseLeave = _this.onMouseLeave.bind(_assertThisInitialized(_this));
    _this.onMouseWheel = _this.onMouseWheel.bind(_assertThisInitialized(_this));

    _this.onCameraChange = _this.onCameraChange.bind(_assertThisInitialized(_this), true); // Binded with transition=true
    _this.update = _this.update.bind(_assertThisInitialized(_this));
    _this.onCloseButton = _this.onCloseButton.bind(_assertThisInitialized(_this));
    _this.setEnabled = _this.setEnabled.bind(_assertThisInitialized(_this));
    _this.updateSettingsPanel = _this.updateSettingsPanel.bind(_assertThisInitialized(_this));return _this;
  }

  /**
     * Set the minimap extension to be enabled / disabled.
     *
     * @param {boolean} isEnabled - True if enabling the minimap extension.
     * @private
     */_createClass(MinimapExtension, [{ key: "setEnabled", value: function () {var _setEnabled = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(
      isEnabled) {return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (!
                isEnabled) {_context.next = 8;break;}if (
                this.wasInit) {_context.next = 4;break;}_context.next = 4;return (
                  this.init());case 4:

                // Enable only after init finished
                this._isEnabled = true;
                // Will show minimap according to camera bounds
                this.onCameraChange(false);_context.next = 10;break;case 8:

                // Disable so that _setVisibility will hide the panel
                this._isEnabled = false;
                this._setVisibility(false, false);case 10:case "end":return _context.stop();}}}, _callee, this);}));function setEnabled(_x) {return _setEnabled.apply(this, arguments);}return setEnabled;}() }, { key: "findAndSetSuitableModel", value: function findAndSetSuitableModel()



    {
      var models = this.viewer.impl.modelQueue().getModels();

      if (models.length === 1 && models[0].is2d()) {
        var model = models[0];
        var node = model.getDocumentNode();
        var doc = node && node.getDocument();

        if (doc) {
          this.model = model;
          this.node = node;
          this.document = doc;

          return true;
        }
      }

      return false;
    } }, { key: "createPanel", value: function createPanel()

    {
      if (!this.panel) {
        this.panel = new _MinimapPanel__WEBPACK_IMPORTED_MODULE_2__["default"](this.viewer.container, 10, 10, { isMobile: this.isMobile, addFooter: false });
        this.panel.setGlobalManager(this.globalManager);
      }
    }

    /**
       * Creates the minimap extension's canvas.
       *
       * @private
       */ }, { key: "createMinimapCanvas", value: function createMinimapCanvas()
    {
      if (!this.minimapCanvas) {
        this.minimapCanvas = new _MinimapCanvas__WEBPACK_IMPORTED_MODULE_1__["default"](this.backgroundImgs || {}, this.modelWidth, this.modelHeight);
        this.minimapCanvas.setGlobalManager(this.globalManager);
      } else {
        // Just update the images
        this.minimapCanvas.backgroundImgs = this.backgroundImgs;
      }
    } }, { key: "setBoundariesFromModel", value: function setBoundariesFromModel()

    {
      this.modelBBox = this.model.getBoundingBox().clone();
      this.modelStartPoint = this.modelBBox.min;
      this.modelWidth = this.modelBBox.max.x - this.modelBBox.min.x;
      this.modelHeight = this.modelBBox.max.y - this.modelBBox.min.y;
      this.epsX = 0.02 * this.modelWidth;
      this.epsY = 0.02 * this.modelHeight;
    }

    /**
       * Initializing the minimap extension and getting the thumbnail.
       *
       * @private
       */ }, { key: "init", value: function () {var _init = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {var model, modelData, hasToCheckThumbnail;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:

                this.mouseDown = false;
                this.mouseDownPos = { x: null, y: null };
                this.isTransitionInactive = true;if (

                this.model) {_context2.next = 5;break;}return _context2.abrupt("return");case 5:



                this.createPanel();
                this.setBoundariesFromModel();

                this.wasInit = true;
                model = this.model; // Check that model hasn't changed during async operation (or that unload wasn't called)
                _context2.prev = 9;_context2.next = 12;return (

                  this.prefetchThumbnails(['large']));case 12:if (!(

                model !== this.model)) {_context2.next = 14;break;}throw (
                  new Error('loadCanceled'));case 14:


                this.createMinimapCanvas();_context2.next = 17;return (

                  this.minimapCanvas.setSize(this.getInitialSize()));case 17:if (!(

                model !== this.model)) {_context2.next = 19;break;}throw (
                  new Error('loadCanceled'));case 19:


                modelData = this.model.getData();
                hasToCheckThumbnail = !this.model.isLeaflet() && modelData.loadOptions.fileExt !== 'rvt';
                if (hasToCheckThumbnail && !_ThumbnailUtils__WEBPACK_IMPORTED_MODULE_3__["default"].isThumbnailValid(this.minimapCanvas.backgroundCanvas)) {
                  console.error('Invalid thumbnail!');
                } else {
                  this.panel.appendElement(this.minimapCanvas.canvasContainer);
                }
                this.addListeners();_context2.next = 29;break;case 25:_context2.prev = 25;_context2.t0 = _context2["catch"](9);

                console.info('Minimap error: ', _context2.t0.message);
                if (!this.minimapCanvas && _context2.t0.message !== 'loadCanceled') {// Create mock canvas
                  this.createMinimapCanvas();
                  this.addListeners();
                }case 29:case "end":return _context2.stop();}}}, _callee2, this, [[9, 25]]);}));function init() {return _init.apply(this, arguments);}return init;}()



    /**
                                                                                                                                                                       * Get's the minimap extension's initial size.
                                                                                                                                                                       *
                                                                                                                                                                       * @private
                                                                                                                                                                       */ }, { key: "getInitialSize", value: function getInitialSize()
    {
      if (this.initialSize !== null) {
        return Math.min(Math.max(this.initialSize, MIN_SIZE), MAX_SIZE);
      }
      return this.isMobile ? _MinimapThumbnail__WEBPACK_IMPORTED_MODULE_0__.thumbnailDefaultSizes.mobile : _MinimapThumbnail__WEBPACK_IMPORTED_MODULE_0__.thumbnailDefaultSizes.web;
    }

    /**
       * Sets the minimap extension's canvas's size.
       *
       * @param {number} size - The minimap's canvas's size.
       * @private
       */ }, { key: "setSize", value: function setSize(
    size) {
      if (this.minimapCanvas) {
        size = Math.min(Math.max(size, MIN_SIZE), MAX_SIZE);
        this.minimapCanvas.setSize(size);
      } else {
        this.initialSize = size;
      }
    }

    /**
       * @param {number} requestedSizes - The thumbnails's size.
       * @returns {Promise} Promises of fetching the thumbnails
       * @private
       */ }, { key: "prefetchThumbnails", value: function prefetchThumbnails(
    requestedSizes) {var _this2 = this;
      this.backgroundImgs = {};
      var requests = requestedSizes.map(function (val) {return (0,_MinimapThumbnail__WEBPACK_IMPORTED_MODULE_0__.fetchThumbnail)(_this2.document, _this2.node, val, _this2.backgroundImgs);});
      return Promise.all(requests);
    }

    /**
       * @alias Autodesk.Viewing.Extensions.MinimapExtension#_isTouch
       * @returns {boolean} True is it is a touch device 
       * @private
       */ }, { key: "_isTouch", value: function _isTouch()
    {
      return Autodesk.Viewing.isTouchDevice();
    }

    /**
       * Addes listeners to user interactions and camera changes
       *
       * @private
       */ }, { key: "addListeners", value: function addListeners()
    {
      if (this._isTouch()) {
        this.minimapCanvas.addListenerToCanvas('touchstart', this.onMouseDown);
        this.minimapCanvas.addListenerToCanvas('touchmove', this.onMouseMove);
        this.minimapCanvas.addListenerToCanvas('touchend', this.onMouseUp);
      }

      if (!this.isMobile) {
        this.minimapCanvas.addListenerToCanvas('mousedown', this.onMouseDown);
        this.minimapCanvas.addListenerToCanvas('mousemove', this.onMouseMove);
        this.minimapCanvas.addListenerToCanvas('mouseup', this.onMouseUp);

        this.minimapCanvas.addListenerToCanvas('mouseleave', this.onMouseLeave);
        this.minimapCanvas.addListenerToCanvas('mousewheel', this.onMouseWheel);
        this.minimapCanvas.addListenerToCanvas('DOMMouseScroll', this.onMouseWheel); // firefox
      }

      this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onCameraChange);
      this.panel.addListenerToCloseButton(this.onCloseButton);
    }

    /**
       * @private
       */ }, { key: "onCloseButton", value: function onCloseButton()
    {
      this.viewer.prefs.set(SETTINGS_PROP, false);
      this.setEnabled(false);
    }

    /**
       * @param {Event} event - Mouse / Touch event.
       * @returns {object} returns an object with x and y coordinates.
       * @private
       */ }, { key: "getCursorPositionOnCanvas", value: function getCursorPositionOnCanvas(
    event) {
      var rect = this.minimapCanvas.getBoundingClientRect();
      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      return { x: x, y: y };
    } }, { key: "onMouseDown", value: function onMouseDown(

    e) {
      if (e.type === 'touchstart') {
        e.clientX = e.touches[0].clientX;
        e.clientY = e.touches[0].clientY;
      }
      this.mouseDown = true;
      this.mouseDownPos.x = e.clientX;
      this.mouseDownPos.y = e.clientY;
      this.onMinimapClicked(e, false);
      this.isTransitionInactive = false;
    } }, { key: "onMouseMove", value: function onMouseMove(

    e) {
      if (!this.mouseDown) {
        return;
      }
      if (e.type === 'touchmove') {
        e.clientX = e.touches[0].clientX;
        e.clientY = e.touches[0].clientY;
      }

      if (this.isTransitionInactive || Math.abs(this.mouseDownPos.x - e.clientX) > 5 || Math.abs(this.mouseDownPos.y - e.clientY) > 5) {
        if (this.viewer.autocam.elapsedTime !== undefined) {
          this.viewer.autocam.elapsedTime = this.viewer.autocam.shotParams.duration;
          this.isTransitionInactive = true;
        }

        this.onMinimapClicked(e, true);
      }
    } }, { key: "onMouseWheel", value: function onMouseWheel(

    e) {
      // Propagate mouse wheel event to viewer
      this.viewer.toolController.mousewheel(e);
    } }, { key: "onMouseUp", value: function onMouseUp()

    {
      this.resetMove();
    } }, { key: "onMouseLeave", value: function onMouseLeave()

    {
      this.resetMove();
    }

    /**
       * @private
       */ }, { key: "resetMove", value: function resetMove()
    {
      this.mouseDown = false;
      this.mouseDownPos.x = null;
      this.mouseDownPos.y = null;
    }

    /**
       * @private
       * @param {event} e the mouse/touch event
       * @param {boolean} isImmediate wethere the transition has to be done immidiatly or with a transition
       */ }, { key: "onMinimapClicked", value: function onMinimapClicked(
    e, isImmediate) {
      var clickedCoords = this.minimapToModelCoords(this.getCursorPositionOnCanvas(e));

      var oldTarget = this.viewer.navigation.getTarget();
      var oldPos = this.viewer.navigation.getPosition();
      var eye = oldTarget.clone().sub(oldPos);

      var newPos = new THREE.Vector3(clickedCoords.x, clickedCoords.y, oldPos.z);
      var newTarget = newPos.clone().add(eye);

      if (isImmediate) {
        this.viewer.navigation.setView(newPos, newTarget);
      } else {
        this.viewer.navigation.setRequestTransitionWithUp(true, newPos, newTarget, this.viewer.impl.camera.fov, this.viewer.impl.camera.up);
      }
      this.viewer.navigation.setPivotPoint(newTarget);
      this.viewer.navigation.setPivotSetFlag(true);
    } }, { key: "highlightCurrentArea", value: function highlightCurrentArea(

    bottomLeft, topRight) {
      this.minimapCanvas.drawHighlight(bottomLeft, topRight);
    }

    /**
       * @private
       * @param {object} position Position in model coordinates
       * @returns {object} The position in minimap coordinates
       */ }, { key: "modelToMinimapCoords", value: function modelToMinimapCoords(
    position) {
      // Canvas starts from top left, with x growing rightwards, and y growing downwards
      return {
        x: (position.x - this.modelStartPoint.x) * this.minimapCanvas.width / this.modelWidth,
        y: -(position.y - this.modelStartPoint.y - this.modelHeight) * this.minimapCanvas.height / this.modelHeight };

    }

    /**
       * @private
       * @param {object} position Position in minimap caretCoordinates
       * @returns {object} The position in model coordinates
       */ }, { key: "minimapToModelCoords", value: function minimapToModelCoords(
    position) {
      return {
        x: position.x * this.modelWidth / this.minimapCanvas.width + this.modelStartPoint.x,
        y: -(position.y * this.modelHeight / this.minimapCanvas.height) + this.modelHeight + this.modelStartPoint.y };

    }

    /**
       * @private
       * @param {boolean} isVisible Change the visibility of the minimap
       * @param {boolean} withTransition Change the visibility with / without a transition
       */ }, { key: "_setVisibility", value: function _setVisibility(
    isVisible, withTransition) {
      if (this.panel) {
        this.panel.setVisible(this._isEnabled && isVisible, withTransition);
      }
    }

    /**
       * Gets the area of the document currently in view
       *
       * @private
       */ }, { key: "getViewableArea", value: function getViewableArea()
    {
      var bounds = this.modelBBox.clone();
      var left = this.viewer.impl.camera.left + this.viewer.impl.camera.position.x;
      var right = this.viewer.impl.camera.right + this.viewer.impl.camera.position.x;
      var bottom = this.viewer.impl.camera.bottom + this.viewer.impl.camera.position.y;
      var top = this.viewer.impl.camera.top + this.viewer.impl.camera.position.y;
      if (left > bounds.min.x + this.epsX) {
        bounds.min.x = left;
      }
      if (right < bounds.max.x - this.epsX) {
        bounds.max.x = right;
      }
      if (bottom > bounds.min.y + this.epsY) {
        bounds.min.y = bottom;
      }
      if (top < bounds.max.y - this.epsY) {
        bounds.max.y = top;
      }

      return bounds;
    }

    /**
       * Adding the option to enable/disable the extension in the settings by adding a check box.
       *
       * @private
       */ }, { key: "updateSettingsPanel", value: function updateSettingsPanel()
    {
      var settingsPanel = this.viewer.getSettingsPanel && this.viewer.getSettingsPanel();

      if (!settingsPanel || settingsPanel.is3dMode || settingsPanel.minimapSettingsCheckboxId)
      return;

      var navTab = Autodesk.Viewing.Extensions.ViewerSettingTab.Navigation;

      settingsPanel.minimapSettingsLabel = settingsPanel.addLabel(navTab, "Minimap");
      settingsPanel.minimapSettingsCheckboxId = settingsPanel.addCheckbox(
      navTab,
      'Show minimap',
      'Toggles availability of the Minimap',
      true,
      this.setEnabled,
      SETTINGS_PROP);

    }

    /**
       * Load the minimap extension.
       *
       * @returns {boolean} True if minimap extension is loaded successfully.
       * @alias Autodesk.Viewing.Extensions.MinimapExtension#load
       */ }, { key: "load", value: function load()
    {
      this.viewer.addEventListener(Autodesk.Viewing.MODEL_ADDED_EVENT, this.update);
      this.viewer.addEventListener(Autodesk.Viewing.MODEL_REMOVED_EVENT, this.update);
      this.viewer.addEventListener(Autodesk.Viewing.SETTINGS_PANEL_CREATED_EVENT, this.updateSettingsPanel);

      this.viewer.prefs.add(SETTINGS_PROP, true, '2d');
      this.updateSettingsPanel();

      this.update();

      return true;
    }

    /**
       * Unload the minimap extension.
       *
       * @returns {boolean} True if minimap extension is unloaded successfully.
       *
       * @alias Autodesk.Viewing.Extensions.MinimapExtension#unload
       */ }, { key: "unload", value: function unload()
    {
      if (this.minimapCanvas) {
        if (this._isTouch()) {
          this.minimapCanvas.removeListenerFromCanvas('touchstart', this.onMouseDown);
          this.minimapCanvas.removeListenerFromCanvas('touchmove', this.onMouseMove);
          this.minimapCanvas.removeListenerFromCanvas('touchend', this.onMouseUp);
        }

        if (!this.isMobile) {
          this.minimapCanvas.removeListenerFromCanvas('mousedown', this.onMouseDown);
          this.minimapCanvas.removeListenerFromCanvas('mousemove', this.onMouseMove);
          this.minimapCanvas.removeListenerFromCanvas('mouseup', this.onMouseUp);

          this.minimapCanvas.removeListenerFromCanvas('mouseleave', this.onMouseLeave);
          this.minimapCanvas.removeListenerFromCanvas('mousewheel', this.onMouseWheel);
          this.minimapCanvas.removeListenerFromCanvas('DOMMouseScroll', this.onMouseWheel); // firefox
        }

        this.minimapCanvas.unload();
        this.minimapCanvas = null;
      }
      this.viewer.removeEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onCameraChange);

      this.viewer.removeEventListener(Autodesk.Viewing.MODEL_ADDED_EVENT, this.update);
      this.viewer.removeEventListener(Autodesk.Viewing.MODEL_REMOVED_EVENT, this.update);
      this.viewer.removeEventListener(Autodesk.Viewing.SETTINGS_PANEL_CREATED_EVENT, this.updateSettingsPanel);

      this.destroyUI();
      this.model = null;
      this.document = null;
      this.node = null;

      return true;
    } }, { key: "update", value: function update()

    {
      this.wasInit = false;
      if (this.findAndSetSuitableModel()) {
        this.setEnabled(this.viewer.prefs && this.viewer.prefs.get(SETTINGS_PROP));
      } else {
        this.setEnabled(false);
      }
    }

    /**
       * Occurs when camera changes
       *
       * @alias Autodesk.Viewing.Extensions.MinimapExtension#onCameraChange
       * @param {boolean} withTransition - True if cameara changed with a transition.
       */ }, { key: "onCameraChange", value: function onCameraChange(
    withTransition) {
      var bounds = this.getViewableArea();
      var isVisible = !bounds.equals(this.modelBBox);
      this._setVisibility(isVisible, withTransition);
      if (isVisible && this.minimapCanvas) {
        this.highlightCurrentArea(this.modelToMinimapCoords(bounds.min), this.modelToMinimapCoords(bounds.max));
      }
    }

    /**
       * Destroys minimap's UI
       * 
       * @alias Autodesk.Viewing.Extensions.MinimapExtension#destroyUI
       */ }, { key: "destroyUI", value: function destroyUI()
    {
      var settingsPanel = this.viewer.getSettingsPanel && this.viewer.getSettingsPanel();
      if (settingsPanel && settingsPanel.minimapSettingsCheckboxId) {
        this.viewer.viewerSettingsPanel.removeCheckbox(settingsPanel.minimapSettingsCheckboxId);
        this.viewer.viewerSettingsPanel.removeControl(settingsPanel.minimapSettingsLabel);
        settingsPanel.minimapSettingsLabel = null;
        settingsPanel.minimapSettingsCheckboxId = null;
      }

      if (this.panel) {
        this.panel.uninitialize();
        this.panel = null;
      }
    } }]);return MinimapExtension;}(Autodesk.Viewing.Extension);


namespace.MinimapExtension = MinimapExtension;
Autodesk.Viewing.theExtensionManager.registerExtension('Autodesk.BIM360.Minimap', MinimapExtension);
})();

Autodesk.Extensions.Minimap2D = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=Minimap2D.js.map