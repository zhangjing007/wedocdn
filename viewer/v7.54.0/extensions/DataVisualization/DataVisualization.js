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
/******/ 	var __webpack_modules__ = ({

/***/ "./extensions/DataVisualization/Constants.js":
/*!***************************************************!*\
  !*** ./extensions/DataVisualization/Constants.js ***!
  \***************************************************/
/***/ ((module) => {

module.exports = {
  MOUSE_HOVERING: "DATAVIZ_OBJECT_HOVERING",
  MOUSE_CLICK: "DATAVIZ_OBJECT_CLICK",
  MOUSE_CLICK_OUT: "DATAVIZ_CLICK_OUT" };

/***/ }),

/***/ "./extensions/DataVisualization/CustomViewables.js":
/*!*********************************************************!*\
  !*** ./extensions/DataVisualization/CustomViewables.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ViewableStyle": () => (/* binding */ ViewableStyle),
/* harmony export */   "SpriteViewable": () => (/* binding */ SpriteViewable),
/* harmony export */   "CustomViewable": () => (/* binding */ CustomViewable),
/* harmony export */   "ViewableData": () => (/* binding */ ViewableData),
/* harmony export */   "ViewableType": () => (/* binding */ ViewableType)
/* harmony export */ });
/* harmony import */ var _SpriteAtlas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SpriteAtlas */ "./extensions/DataVisualization/SpriteAtlas.js");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === "string") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === "Object" && o.constructor) n = o.constructor.name;if (n === "Map" || n === "Set") return Array.from(o);if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _iterableToArray(iter) {if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) return _arrayLikeToArray(arr);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var ViewableType = {
  SPRITE: 1,
  GEOMETRY: 2 };


/**
                  * A visual style definition for a CustomViewable object.
                  *
                  * @class
                  * @memberof Autodesk.DataVisualization.Core
                  * @alias Autodesk.DataVisualization.Core.ViewableStyle
                  */var
ViewableStyle = /*#__PURE__*/function () {
  /**
                                           * Constructs an instance of `ViewableStyle` object that describes the style
                                           * to be applied for any given `CustomViewable` object.
                                           *
                                           * @param {number} type The type of viewable. Possible values are listed
                                           * in `ViewableType`.
                                           * @param {THREE.Color} color The color of the viewable, default to white.
                                           * @param {string} url The URL of the sprite to be used for the viewable.
                                           * Image formats supported are the same as those of `HTMLImageElement`.
                                           * @param {THREE.Color} highlightedColor The highlighted color of the viewable,
                                           * default to white. This color will be used when a `CustomViewable` is
                                           * highlighted with a call to `highlightViewables` API.
                                           * @param {string} highlightedUrl The URL of the highlighted sprite to be used
                                           * for the viewable. This sprite will be used when a `CustomViewable` is
                                           * highlighted with a call to `highlightViewables` API. Image formats
                                           * supported are the same as those of `HTMLImageElement`.
                                           * @param {string[]} animatedUrls Array of sprite urls that can be used to 
                                           * animate the icon.
                                           * 
                                           * @example
                                           *  const white = 0xffffff;
                                           *  const iconUrl = "http://localhost:9081/images/device-type-01.svg";
                                           *
                                           *  const style = new Autodesk.DataVisualization.Core.ViewableStyle(
                                           *      "DeviceType01",
                                           *      Autodesk.DataVisualization.Core.ViewableType.SPRITE,
                                           *      new THREE.Color(white),
                                           *      iconUrl
                                           *  );
                                           */
  function ViewableStyle()






  {var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ViewableType.SPRITE;var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new THREE.Color(0xffffff);var url = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";var highlightedColor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new THREE.Color(0xffffff);var highlightedUrl = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";var animatedUrls = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];_classCallCheck(this, ViewableStyle);
    this.type = type;
    this.color = color;
    this.url = url;
    this.highlightedColor = highlightedColor;
    this.highlightedUrl = highlightedUrl;

    /** @type {Set<string>} */
    this.spriteUrls = new Set(animatedUrls);
  }

  /**
     * An array of sprite URL strings to be preloaded.
     * @returns {string[]} An array of sprite URL strings to be preloaded.
     */_createClass(ViewableStyle, [{ key: "preloadSprite",




    /**
                                                             * Preloads a sprite into `ViewableStyle` object for later use.
                                                             *
                                                             * @param {string} spriteUrl The URL of the sprite image to be preloaded for
                                                             * subsequent use in `CustomViewable` objects. Image formats supported are
                                                             * the same as those of `HTMLImageElement`. Calling this method with the same
                                                             * URL will only preload the image once.
                                                             *
                                                             * @alias Autodesk.DataVisualization.Core.ViewableStyle#preloadSprite
                                                             */value: function preloadSprite(
    spriteUrl) {
      this.spriteUrls.add(spriteUrl);
    } }, { key: "preloadedSprites", get: function get() {return _toConsumableArray(this.spriteUrls.values());} }]);return ViewableStyle;}();


/**
                                                                                                                                              * The generic base class of custom viewable types.
                                                                                                                                              *
                                                                                                                                              * @class
                                                                                                                                              * @memberof Autodesk.DataVisualization.Core
                                                                                                                                              * @alias Autodesk.DataVisualization.Core.CustomViewable
                                                                                                                                              */var
CustomViewable = /*#__PURE__*/function () {
  /**
                                            * Constructs an instance of `CustomViewable` object. This class is not meant to be
                                            * used directly, use the `SpriteViewable` class instead.
                                            *
                                            * @param {THREE.Vector3} position The position of the viewable in world coordinates.
                                            * @param {ViewableStyle} style The style definition of this custom viewable object.
                                            * @param {number} dbId The `DbId` of this custom viewable object. This value is used
                                            * to identify the viewable when user input events such as mouse clicks are handled.
                                            */
  function CustomViewable(position, style, dbId) {_classCallCheck(this, CustomViewable);
    this._style = style;
    this._position = position;
    this._dbId = dbId;
  }

  /**
     * The style definition of this viewable object.
     * @returns {ViewableStyle} The style definition of this viewable object.
     */_createClass(CustomViewable, [{ key: "style", get: function get()
    {
      return this._style;
    }

    /**
       * The position of the viewable object in world coordinates.
       * @returns {THREE.Vector3} The position of the viewable object in world coordinates.
       */ }, { key: "position", get: function get()
    {
      return this._position;
    }

    /**
       * The `DbId` of this viewable object. This value is used to identify the
       * viewable when user input events such as mouse clicks are handled.
       * @returns {number} The `DbId` of this viewable object. This value is used to
       * identify the viewable when user input events such as mouse clicks are handled.
       */ }, { key: "dbId", get: function get()
    {
      return this._dbId;
    } }]);return CustomViewable;}();


/**
                                      * A sprite (image) based custom viewable object.
                                      *
                                      * @class
                                      * @memberof Autodesk.DataVisualization.Core
                                      * @alias Autodesk.DataVisualization.Core.SpriteViewable
                                      * @augments CustomViewable
                                      */var
SpriteViewable = /*#__PURE__*/function (_CustomViewable) {_inherits(SpriteViewable, _CustomViewable);var _super = _createSuper(SpriteViewable);
  /**
                                                                                                                                                 * Constructs an instance of `SpriteViewable` object
                                                                                                                                                 *
                                                                                                                                                 * @param {THREE.Vector3} position The position of the viewable in world coordinates.
                                                                                                                                                 * @param {ViewableStyle} style The style definition of this custom viewable object.
                                                                                                                                                 * @param {number} dbId The `DbId` of this custom viewable object. This value is used
                                                                                                                                                 * to identify the viewable when user input events such as mouse clicks are handled.
                                                                                                                                                 *
                                                                                                                                                 * @example
                                                                                                                                                 *  const dbId = 100;
                                                                                                                                                 *  const positions = [
                                                                                                                                                 *      {
                                                                                                                                                 *          x: -97.94954550038506,
                                                                                                                                                 *          y: -50.21776820050724,
                                                                                                                                                 *          z: 12.444056161946492,
                                                                                                                                                 *      },
                                                                                                                                                 *      {
                                                                                                                                                 *          x: -12.59026829087645,
                                                                                                                                                 *          y: -50.20446526068116,
                                                                                                                                                 *          z: 14.35526278705748,
                                                                                                                                                 *      },
                                                                                                                                                 *  ];
                                                                                                                                                 *
                                                                                                                                                 *  const viewables = [];
                                                                                                                                                 *
                                                                                                                                                 *  // Create multiple SpriteViewable that share the same 'style'.
                                                                                                                                                 *  positions.forEach((pos) => {
                                                                                                                                                 *      const viewable = new Autodesk.DataVisualization.Core.SpriteViewable(
                                                                                                                                                 *          pos, style, dbId);
                                                                                                                                                 *
                                                                                                                                                 *      dbId++; // Assign each viewable a unique identifier
                                                                                                                                                 *      viewables.push(viewable);
                                                                                                                                                 *  });
                                                                                                                                                 */
  function SpriteViewable(position, style, dbId) {_classCallCheck(this, SpriteViewable);
    // eslint-disable-next-line no-console
    console.assert(style.type == ViewableType.SPRITE);return _super.call(this,
    position, style, dbId);
  }

  /**
     * The type of this `SpriteViewable` object. This value will always
     * be equal to `ViewableType.SPRITE`.
     * @returns {number} The type of this `SpriteViewable` object.
     * This value will always be equal to `ViewableType.SPRITE`.
     */_createClass(SpriteViewable, [{ key: "type", get: function get()
    {
      return ViewableType.SPRITE;
    }

    /**
       * The color of this `SpriteViewable` object. The color is multiplied with
       * the sprite pixel colors in shader prior to display.
       * @returns {THREE.Color} The color of this `SpriteViewable` object. The color
       * is multiplied with the sprite pixel colors in shader prior to display.
       */ }, { key: "color", get: function get()
    {
      return this.style.color;
    }

    /**
       * The color of this sprite viewable object. The color is multiplied with the
       * highlighted sprite pixel colors in shader for display.
       * @returns {THREE.Color} The color of this sprite viewable object. The color is
       * multiplied with the highlighted sprite pixel colors in shader for display.
       */ }, { key: "highlightedColor", get: function get()
    {
      return this.style.highlightedColor;
    } }]);return SpriteViewable;}(CustomViewable);


/**
                                                    * An object that manages a collection of `CustomViewable` object. A `ViewableData`
                                                    * object is added for display through `DataVisualization.addViewables` API before
                                                    * any of its `CustomViewable` can be displayed.
                                                    *
                                                    * @class
                                                    * @memberof Autodesk.DataVisualization.Core
                                                    * @alias Autodesk.DataVisualization.Core.ViewableData
                                                    */var
ViewableData = /*#__PURE__*/function () {
  /**
                                          * Constructs an instance of `ViewableData` object
                                          *
                                          * @param {Object} options The options to configure `ViewableData` object with.
                                          * @param {number} options.atlasWidth The initial sprite atlas width in
                                          * pixels, to accommodate subsequent `CustomViewable` object that are added.
                                          * If not specified, the atlas width of `1920` pixels is used.
                                          * @param {number} options.atlasHeight The initial sprite atlas height in
                                          * pixels, to accommodate subsequent `CustomViewable` object that are added.
                                          * If not specified, the atlas height of `1080` pixels is used.
                                          *
                                          * @example
                                          *  const viewableData = new Autodesk.DataVisualization.Core.ViewableData({
                                          *    atlasWidth: 512,
                                          *    atlasHeight: 512
                                          *  });
                                          */
  function ViewableData() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};_classCallCheck(this, ViewableData);
    this._styleMap = new Map();
    this._viewablesMap = new Map();
    this._spriteAtlas = new _SpriteAtlas__WEBPACK_IMPORTED_MODULE_0__.SpriteAtlas(
    options.atlasWidth || 1920,
    options.atlasHeight || 1080,
    2);

  }

  /**
     * All the `CustomViewable` that are added to this `ViewableData` object.
     * @returns {CustomViewable[]} All the `CustomViewable` that are added to
     * this `ViewableData` object.
     */_createClass(ViewableData, [{ key: "addViewable",












    /**
                                                          * Adds a custom viewable object to the `ViewableData`.
                                                          *
                                                          * @param {CustomViewable} viewable The custom viewable to be added
                                                          * to the `ViewableData` object.
                                                          */value: function addViewable(
    viewable) {var _this = this;
      if (viewable.type == ViewableType.SPRITE) {
        /** @type {Set<string>} */
        var spriteUrls = new Set();
        spriteUrls.add(viewable.style.url);

        if (viewable.style.highlightedUrl) {
          spriteUrls.add(viewable.style.highlightedUrl);
        }

        viewable.style.preloadedSprites.forEach(function (url) {return spriteUrls.add(url);});
        spriteUrls.forEach(function (url) {return _this.spriteAtlas.addSprite(url);});
      }

      this._viewablesMap.set(viewable.dbId, viewable);
    }

    /**
       * @private
       * Gets the texture coordinates corresponding to a given sprite URL.
       *
       * @param {string} url A URL of sprite for which UV texture coordinates is
       * to be obtained. This URL should be one of the values specified through
       * the constructor of `ViewableStyle` or `preloadSprite` API.
       *
       * @returns {{ x: number, y: number, w: number, h: number}} The texture
       * coordinates of the top-left and bottom-right corner of the sprite. Note
       * that `w` and `h` represent the actual texture coordinates of the
       * bottom-right corner of the sprite, not its width or height.
       */ }, { key: "getSpriteUV", value: function getSpriteUV(
    url) {
      return this._spriteAtlas.spriteUV(url);
    }

    /**
       * Get the UV values of a viewable from the sprite atlas
       *
       * @param {String} dbId Id of the viewable to obtain the UV of.
       * @param {boolean} highlighted Boolean value to obtain the normal sprite UV or the highlighted version
       * @returns {Object} UV values of the requested viewable
       */ }, { key: "getViewableUV", value: function getViewableUV(
    dbId, highlighted) {
      var style = this._viewablesMap.get(dbId).style;
      if (highlighted && style.highlightedUrl) {
        return this._spriteAtlas.spriteUV(style.highlightedUrl);
      } else {
        return this._spriteAtlas.spriteUV(style.url);
      }
    }

    /**
       * Get the color values of a viewable
       *
       * @param {String} dbId Id of the viewable to obtain the UV of.
       * @param {boolean} highlighted Boolean value to obtain the normal sprite UV or the highlighted version
       * @returns {THREE.Color} Color of the requested viewable
       */ }, { key: "getViewableColor", value: function getViewableColor(
    dbId, highlighted) {
      var style = this._viewablesMap.get(dbId).style;
      if (highlighted) {
        return style.highlightedColor;
      } else {
        return style.color;
      }
    }

    /**
       * Marks the `ViewableData` as completed. The final sprite atlas will be
       * generated based on all the `CustomViewable` objects added prior to this.
       * This function must be called before the `ViewableData` is added for display
       * through `DataVisualization.addViewables` API.
       */ }, { key: "finish", value: function () {var _finish = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (

                  this._spriteAtlas.finish());case 2:case "end":return _context.stop();}}}, _callee, this);}));function finish() {return _finish.apply(this, arguments);}return finish;}() }, { key: "viewables", get: function get() {return _toConsumableArray(this._viewablesMap.values());} /**
                                                                                                                                                                                                                                                                                                 * @private
                                                                                                                                                                                                                                                                                                 * @returns {SpriteAtlas} For internal use only.
                                                                                                                                                                                                                                                                                                 */ }, { key: "spriteAtlas", get: function get() {return this._spriteAtlas;} }]);return ViewableData;}();


/***/ }),

/***/ "./extensions/DataVisualization/ModelStructureInfo.js":
/*!************************************************************!*\
  !*** ./extensions/DataVisualization/ModelStructureInfo.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Room": () => (/* binding */ Room),
/* harmony export */   "LevelRoomsMap": () => (/* binding */ LevelRoomsMap),
/* harmony export */   "ModelStructureInfo": () => (/* binding */ ModelStructureInfo)
/* harmony export */ });
/* harmony import */ var _heatmap_SurfaceShadingData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./heatmap/SurfaceShadingData */ "./extensions/DataVisualization/heatmap/SurfaceShadingData.js");
/* harmony import */ var _heatmap_SurfaceShadingData__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_heatmap_SurfaceShadingData__WEBPACK_IMPORTED_MODULE_0__);
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

/**
                                 * The object that defines the structure of a Device in a Room.
                                 *
                                 * @typedef {Object} RoomDevice
                                 * @property {string} id An ID to identify this device
                                 * @property {Object} position World coordinates of this device
                                 * @property {number} position.x X coordinates of this device
                                 * @property {number} position.y Y coordinates of this device
                                 * @property {number} position.z Z coordinates of this device
                                 * @property {Array.<string>} sensorTypes The types/properties this device exposes
                                 * @property {string} type A type identifier for this device. Ex: Thermometer
                                 * @property {string} [name] An optional name identifier for the device
                                 * @example
                                 *  {
                                 *      id: "cafeteria-entrace-01",
                                 *      position: { x: -159.2782, y: -50.4998, z: -16.9196 },
                                 *      sensorTypes: ["temperature", "humidity"],
                                 *      type: 'thermometer'
                                 *  },
                                 */

/**
                                     * A class that represents a room found in the model. See
                                     * {@link Autodesk.DataVisualization.Core.LevelRoomsMap|LevelRoomsMap} for more details.
                                     *
                                     * @class
                                     * @memberof Autodesk.DataVisualization.Core
                                     * @alias Autodesk.DataVisualization.Core.Room
                                     */var
Room = /*#__PURE__*/function () {
  /**
                                  * Constructs an instance of `Room` object. Client code should not construct
                                  * rooms directly, but to obtain them from `LevelRoomsMap.getRoomsOnLevel` API.
                                  *
                                  * @param {number} id The `DbId` of the room
                                  * @param {string} name The name of the room
                                  * @param {THREE.Box3} bounds The bounding box of the room
                                  */
  function Room(id, name, bounds) {_classCallCheck(this, Room);
    this._id = id;
    this._name = name;
    this._bounds = bounds;

    /**
                            * @private
                            * @type {RoomDevice[]}
                            */
    this._devices = [];
  }

  /**
     * @private
     * @param {{properties: any[]}} value For internal use only
     */_createClass(Room, [{ key: "addDevice",















































    /**
                                                * Adds a {@link RoomDevice} to the {@link Room}
                                                *
                                                * @param {RoomDevice} device The `Device` to be added to the room
                                                */value: function addDevice(
    device) {
      this._devices.push(device);
    } }, { key: "info", set: function set(value) {this._info = value;} /**
                                                                        * Returns the `DbId` of the room
                                                                        * @returns {number} The `DbId` of the room
                                                                        */, /**
                                                                             * @private
                                                                             * @returns {{properties: any[]}} For internal use only
                                                                             */get: function get() {return this._info;} }, { key: "id", get: function get() {return this._id;} /**
                                                                                                                                                                                * Returns the name of the room
                                                                                                                                                                                * @returns {string} The name of the room
                                                                                                                                                                                */ }, { key: "name", get: function get() {return this._name;} /**
                                                                                                                                                                                                                                               * Returns the bounding box of the room
                                                                                                                                                                                                                                               * @returns {THREE.Box3} The bounding box of the room
                                                                                                                                                                                                                                               */ }, { key: "bounds", get: function get() {return this._bounds;} /**
                                                                                                                                                                                                                                                                                                                  * Gets the list of all `Device` objects in the room. If the room does
                                                                                                                                                                                                                                                                                                                  * not contain any devices, an empty array will be returned.
                                                                                                                                                                                                                                                                                                                  * @returns {RoomDevice[]} The list of all `Device` objects in the room.
                                                                                                                                                                                                                                                                                                                  * If the room does not contain any devices, an empty array
                                                                                                                                                                                                                                                                                                                  * will be returned.
                                                                                                                                                                                                                                                                                                                  */ }, { key: "devices", get: function get() {return this._devices;} }]);return Room;}(); /**
                                                                                                                                                                                                                                                                                                                                                                                                            * A class that maps level names to one or more `Room` objects that are found
                                                                                                                                                                                                                                                                                                                                                                                                            * on the corresponding levels. See
                                                                                                                                                                                                                                                                                                                                                                                                            * {@link Autodesk.DataVisualization.Core.Room|Room} for details
                                                                                                                                                                                                                                                                                                                                                                                                            *
                                                                                                                                                                                                                                                                                                                                                                                                            * @class
                                                                                                                                                                                                                                                                                                                                                                                                            * @memberof Autodesk.DataVisualization.Core
                                                                                                                                                                                                                                                                                                                                                                                                            * @alias Autodesk.DataVisualization.Core.LevelRoomsMap
                                                                                                                                                                                                                                                                                                                                                                                                            *
                                                                                                                                                                                                                                                                                                                                                                                                            *
                                                                                                                                                                                                                                                                                                                                                                                                            * @example
                                                                                                                                                                                                                                                                                                                                                                                                            *  // Gets the level-to-rooms mapping from the structural model
                                                                                                                                                                                                                                                                                                                                                                                                            *  const info = new Autodesk.DataVisualization.Core.ModelStructureInfo(model);
                                                                                                                                                                                                                                                                                                                                                                                                            *  const levelRoomsMap = await info.getLevelRoomsMap();
                                                                                                                                                                                                                                                                                                                                                                                                            */var LevelRoomsMap = /*#__PURE__*/function () {function LevelRoomsMap() {_classCallCheck(this, LevelRoomsMap);}_createClass(LevelRoomsMap, [{ key: "addRoomToLevel", /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Adds a {@link Room} object to a named level.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * @param {string} levelName Name of the level to add the `Room` to.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * @param {Autodesk.DataVisualization.Core.Room} room The `Room`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * object to be added to the level.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * @alias Autodesk.DataVisualization.Core.LevelRoomsMap#addRoomToLevel
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   */value: function addRoomToLevel(levelName, room) {if (!this[levelName]) {this[levelName] = [];}this[levelName].push(room);} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * Gets all the rooms on a given level.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * @param {string} levelName Name of the level for which rooms
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * are to be retrieved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * @param {boolean} onlyRoomsWithDevices Set this to `true` to return only rooms
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * with devices in them, or `false` to return all rooms on the level.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * @returns {Room[]} List of all the rooms found on the level, or an empty list
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * if no room is found.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * @alias Autodesk.DataVisualization.Core.LevelRoomsMap#getRoomsOnLevel
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 * @example
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 *  // Get all Room objects on "Level 1", with or without devices
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 *  const roomsOnLevelOne = levelRoomsMap.getRoomsOnLevel("Level 1", false);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 *  // Get only Room objects on "Level 1" that contain devices
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 *  const roomsWithDevices = levelRoomsMap.getRoomsOnLevel("Level 1", true);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 */ }, { key: "getRoomsOnLevel", value: function getRoomsOnLevel(levelName, onlyRoomsWithDevices) {/** @type {Room[]} */var rooms = this[levelName] || [];
      if (onlyRoomsWithDevices) {
        return rooms.filter(function (room) {return room.devices.length > 0;});
      } else {
        return rooms;
      }
    } }]);return LevelRoomsMap;}();


/**
                                     * Data class to deal with the structural information of a model.
                                     *
                                     * @class
                                     * @memberof Autodesk.DataVisualization.Core
                                     * @alias Autodesk.DataVisualization.Core.ModelStructureInfo
                                     */var
ModelStructureInfo = /*#__PURE__*/function () {
  /**
                                                * Constructs an instance of `ModelStructureInfo` object.
                                                *
                                                * @param {Model} model The model from which structural information
                                                * is to be generated.
                                                *
                                                * @example
                                                *  function onModelLoaded(event) {
                                                *    const model = event.model;
                                                *    const info = new Autodesk.DataVisualization.Core.ModelStructureInfo(model);
                                                *  }
                                                *
                                                *  // Register to be notified when the model is fully loaded
                                                *  viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
                                                *    onModelLoaded, { once: true });
                                                */
  function ModelStructureInfo(model) {_classCallCheck(this, ModelStructureInfo);
    this.model = model;

    /**
                         * @private
                         * @type {Room[]}
                         */
    this.rooms = null;
  }

  /**
     * @private
     * Given a parent node, gets the immediate child nodes by its name.
     *
     * @param {string} name Name to filter the child node with.
     * @param {number} [parentId] An optional parent node `DbId` for which the
     * immediate child nodes are to be searched. Root ID of the model will
     * be used if this parameter is omitted.
     *
     * @returns {Array.<number>} A list of all child node `DbId`s that match
     * the filter name.
     * @memberof Autodesk.DataVisualization.Core
     * @alias Autodesk.DataVisualization.Core.ModelStructureInfo#getImmediateChildNodesByName
     */_createClass(ModelStructureInfo, [{ key: "getImmediateChildNodesByName", value: function getImmediateChildNodesByName(
    name, parentId) {
      var model = this.model;
      var it = model.getInstanceTree();
      var childIds = [];

      if (it) {
        parentId = parentId == undefined ? it.getRootId() : parentId;

        it.enumNodeChildren(
        parentId,
        function (id) {
          var n = it.getNodeName(id, true);

          // some time, the name is `Rooms (11)`
          if (n && n.indexOf && n.indexOf(name) >= 0) {
            childIds.push(id);
          }
        },
        false);

      }

      return childIds;
    }

    /**
       * Gets the structural info and build level-to-rooms map.
       *
       * @param {boolean} [keepRoomDetail=false] Whether to keep the room
       * detailed properties after this call completes.
       * @param {string} [nodeName] Optional. Name of the node whose immediate
       * child nodes are to be retrieved. If this parameter is not supplied, or
       * if it is an empty string, then the default value "Rooms" will be used.
       *
       * @returns {LevelRoomsMap} The level-to-rooms map
       */ }, { key: "getLevelRoomsMap", value: function () {var _getLevelRoomsMap = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {var _this = this;var keepRoomDetail,nodeName,levelRoomsMap,rooms,_args = arguments;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                keepRoomDetail = _args.length > 0 && _args[0] !== undefined ? _args[0] : false;nodeName = _args.length > 1 ? _args[1] : undefined;if (
                this.levelRoomsMap) {_context.next = 9;break;}
                levelRoomsMap = new LevelRoomsMap();_context.next = 6;return (
                  this.getRoomList(nodeName));case 6:rooms = _context.sent;
                rooms.forEach(function (room) {
                  var levelName = _this.getLevel(room);
                  if (!keepRoomDetail) {
                    room.info = undefined;
                  }

                  if (levelName != undefined) {
                    levelRoomsMap.addRoomToLevel(levelName, room);
                  }
                });

                this.levelRoomsMap = levelRoomsMap;case 9:return _context.abrupt("return",


                this.levelRoomsMap);case 10:case "end":return _context.stop();}}}, _callee, this);}));function getLevelRoomsMap() {return _getLevelRoomsMap.apply(this, arguments);}return getLevelRoomsMap;}()


    /**
                                                                                                                                                                                                                 * @private
                                                                                                                                                                                                                 * Gets the name of the level from the given room, if any is specified.
                                                                                                                                                                                                                 *
                                                                                                                                                                                                                 * @param {Room} room The room for which the level name is to be retrieved.
                                                                                                                                                                                                                 * @returns {string|undefined} The name of level if one is specified,
                                                                                                                                                                                                                 * or `undefined` otherwise.
                                                                                                                                                                                                                 */ }, { key: "getLevel", value: function getLevel(
    room) {
      if (room && room.info && room.info.properties) {
        var prop = room.info.properties.find(function (p) {
          return p.type == 20 && p.attributeName == "Level";
        });

        return prop ? prop.displayValue : undefined;
      }
    }

    /**
       * @private
       * Gets a list of rooms found in the current model.
       *
       * @param {string} [nodeName] Optional. Name of the node whose immediate
       * child nodes are to be retrieved. If this parameter is not supplied, or
       * if it is an empty string, then the default value "Rooms" will be used.
       *
       * @returns {Room[]}
       */ }, { key: "getRoomList", value: function () {var _getRoomList = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(
      nodeName) {var _this2 = this;var roomNode, model, rooms, roomsRootId, it, promises;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:if (
                this.rooms) {_context2.next = 10;break;}
                // Default value for parameter does not prevent empty
                // string from being passed in, so this check is necessary.
                nodeName = nodeName ? nodeName : "Rooms";

                roomNode = this.getImmediateChildNodesByName(nodeName);
                model = this.model;

                /** @type {Room[]} */
                rooms = [];

                if (roomNode && roomNode.length > 0) {
                  roomsRootId = roomNode[0];

                  it = model.getInstanceTree();
                  if (it) {
                    it.enumNodeChildren(
                    roomsRootId,
                    function (id) {
                      var name = it.getNodeName(id, true);
                      var bounds = _this2.getRoomBounds(id);
                      rooms.push(new Room(id, name, bounds));
                    },
                    false);

                  }
                }

                // Extract detailed room properties.
                promises = rooms.map(function (room) {
                  return new Promise(function (resolve, reject) {
                    model.getProperties2(
                    room.id,
                    function (info) {
                      room.info = info;
                      resolve(room);
                    },
                    function (error) {
                      resolve(room);
                    });

                  });
                });_context2.next = 9;return (

                  Promise.all(promises));case 9:
                this.rooms = rooms;case 10:return _context2.abrupt("return",


                this.rooms);case 11:case "end":return _context2.stop();}}}, _callee2, this);}));function getRoomList(_x) {return _getRoomList.apply(this, arguments);}return getRoomList;}()


    /**
                                                                                                                                                                                              * @private
                                                                                                                                                                                              * Gets the bounding box of a room given its `DbId`. The bounding box is
                                                                                                                                                                                              * expanded to include bounding boxes of all the fragments that made up
                                                                                                                                                                                              * the room.
                                                                                                                                                                                              *
                                                                                                                                                                                              * @param {number} roomId The `DbId` of the room.
                                                                                                                                                                                              * @returns {THREE.Box3} The bounding box of the room with given `DbId`.
                                                                                                                                                                                              */ }, { key: "getRoomBounds", value: function getRoomBounds(
    roomId) {
      var bounds = new THREE.Box3();
      var fragBounds = new THREE.Box3();
      var it = this.model.getInstanceTree();
      var fragList = this.model.getFragmentList();

      if (it) {
        it.enumNodeFragments(
        roomId,
        function (fragId) {
          fragList.getWorldBounds(fragId, fragBounds);
          bounds.union(fragBounds);
        },
        true);

      }

      return bounds;
    }

    /**
       * @private
       * Assign cient-defined devices to rooms based on their 3D space positions
       * and the bounding box of each room.
       *
       * @param {RoomDevice[]} [devices] The devices to be assigned to loaded rooms.
       * @param {string} [nodeName] Optional. Name of the node whose immediate
       * child nodes are to be retrieved. If this parameter is not supplied, or
       * if it is an empty string, then the default value "Rooms" will be used.
       */ }, { key: "mapDevicesInRoom", value: function () {var _mapDevicesInRoom = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {var devices,nodeName,rooms,i,room,j,device,names,_args3 = arguments;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                devices = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : [];nodeName = _args3.length > 1 ? _args3[1] : undefined;_context3.next = 4;return (



                  this.getRoomList(nodeName));case 4:rooms = _context3.sent;
                devices = devices.slice(0);

                for (i = 0; devices.length > 0 && i < rooms.length; i++) {
                  room = rooms[i];

                  for (j = 0; j < devices.length; j++) {
                    device = devices[j];

                    if (this.roomGeomContainsPoint(room, device.position)) {
                      // Build bi-directional references
                      device.roomId = room.id;
                      room.addDevice(device);

                      // Remove the device from the list, to avoid future iteration
                      devices.splice(j, 1);
                      j--;
                    }
                  }
                }

                if (devices.length > 0) {
                  names = devices.map(function (dev) {return "".concat(dev.id, " (").concat(dev.name, ")");});
                  console.warn("Some devices did not map to a room: ".concat(names.join(", ")));
                }case 8:case "end":return _context3.stop();}}}, _callee3, this);}));function mapDevicesInRoom() {return _mapDevicesInRoom.apply(this, arguments);}return mapDevicesInRoom;}()


    /**
                                                                                                                                                                                               * Assigns client-defined devices to rooms based on their 3D space positions
                                                                                                                                                                                               * and the bounding box of each room, then generate hierarchical shading data
                                                                                                                                                                                               * based on the assignment.
                                                                                                                                                                                               *
                                                                                                                                                                                               * @param {RoomDevice[]} devices The devices to be assigned to loaded rooms.
                                                                                                                                                                                               * @param {LevelRoomsMap} [levels] Optional. The level-to-rooms map. If none
                                                                                                                                                                                               * is supplied, one will be generated internally.
                                                                                                                                                                                               * @param {string} [nodeName] Optional. Name of the node whose immediate
                                                                                                                                                                                               * child nodes are to be retrieved. If this parameter is not supplied, or
                                                                                                                                                                                               * if it is an empty string, then the default value "Rooms" will be used.
                                                                                                                                                                                               * @returns {SurfaceShadingData} The resulting `SurfaceShadingData` object.
                                                                                                                                                                                               *
                                                                                                                                                                                               * @alias Autodesk.DataVisualization.Core.ModelStructureInfo#generateSurfaceShadingData
                                                                                                                                                                                               *
                                                                                                                                                                                               * @example
                                                                                                                                                                                               *  // 'devices' is a list of 'Device' objects in a 'Room'.
                                                                                                                                                                                               *  const info = new Autodesk.DataVisualization.Core.ModelStructureInfo(model);
                                                                                                                                                                                               *  const shadingData = await info.generateSurfaceShadingData(devices);
                                                                                                                                                                                               *  dataVizExtn.setupSurfaceShading(model, shadingData);
                                                                                                                                                                                               */ }, { key: "generateSurfaceShadingData", value: function () {var _generateSurfaceShadingData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {var devices,levels,nodeName,shadingData,_loop,levelName,_args4 = arguments;return regeneratorRuntime.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                devices = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : [];levels = _args4.length > 1 ? _args4[1] : undefined;nodeName = _args4.length > 2 ? _args4[2] : undefined;if (
                levels) {_context4.next = 9;break;}_context4.next = 6;return (
                  this.getLevelRoomsMap(false, nodeName));case 6:levels = _context4.sent;_context4.next = 9;return (
                  this.mapDevicesInRoom(devices, nodeName));case 9:


                shadingData = new _heatmap_SurfaceShadingData__WEBPACK_IMPORTED_MODULE_0__.SurfaceShadingData();_loop = function _loop(
                levelName) {
                  var rooms = levels[levelName];
                  var subGroup = new _heatmap_SurfaceShadingData__WEBPACK_IMPORTED_MODULE_0__.SurfaceShadingGroup(levelName);

                  rooms.forEach(function (room) {
                    var node = new _heatmap_SurfaceShadingData__WEBPACK_IMPORTED_MODULE_0__.SurfaceShadingNode(room.name, room.id);
                    room.devices.forEach(function (device) {
                      var styleId = device.deviceModel ? device.deviceModel.id : device.type;
                      node.addPoint(
                      new _heatmap_SurfaceShadingData__WEBPACK_IMPORTED_MODULE_0__.SurfaceShadingPoint(
                      device.id,
                      device.position,
                      device.sensorTypes,
                      device.name,
                      { styleId: styleId }));


                    });

                    subGroup.addChild(node);
                  });

                  shadingData.addChild(subGroup);};for (levelName in levels) {_loop(levelName);
                }

                shadingData.initialize(this.model);return _context4.abrupt("return",
                shadingData);case 14:case "end":return _context4.stop();}}}, _callee4, this);}));function generateSurfaceShadingData() {return _generateSurfaceShadingData.apply(this, arguments);}return generateSurfaceShadingData;}()


    /**
                                                                                                                                                                                                                                          * @private
                                                                                                                                                                                                                                          * Checks if a given point is within the bounds of a room.
                                                                                                                                                                                                                                          *
                                                                                                                                                                                                                                          * @param {Room} room The room against which a point is checked.
                                                                                                                                                                                                                                          * @param {{x: number, y: number, z: number}} point The point to be checked.
                                                                                                                                                                                                                                          * @returns {boolean} `true` if the point is within the bounds of the
                                                                                                                                                                                                                                          * room, or `false` otherwise.
                                                                                                                                                                                                                                          */ }, { key: "roomGeomContainsPoint", value: function roomGeomContainsPoint(
    room, point) {
      return room.bounds && room.bounds.containsPoint(point);
    } }]);return ModelStructureInfo;}();




/***/ }),

/***/ "./extensions/DataVisualization/SceneTool.js":
/*!***************************************************!*\
  !*** ./extensions/DataVisualization/SceneTool.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SceneTool": () => (/* binding */ SceneTool)
/* harmony export */ });
/* harmony import */ var _Constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants.js */ "./extensions/DataVisualization/Constants.js");
/* harmony import */ var _Constants_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Constants_js__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * Tool that will handle the selection/hightlight for the model created by the CustomModelScene
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       */



var av = Autodesk.Viewing;
var GlobalManagerMixin = av.GlobalManagerMixin;

var SceneTool = /*#__PURE__*/function (_av$ToolInterface) {_inherits(SceneTool, _av$ToolInterface);var _super = _createSuper(SceneTool);
  function SceneTool(viewer) {var _this;var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};_classCallCheck(this, SceneTool);
    _this = _super.call(this);
    _this.names = ["HyperionTool"];

    _this.options = options;
    _this.setGlobalManager(viewer.globalManager);

    _this.viewer = viewer;
    _this.delegate = options.delegate;

    _this.init();

    _this.hoveringDbId = 0;
    _this.selectedDbId = 0;return _this;
  }_createClass(SceneTool, [{ key: "init", value: function init()

    {var _this2 = this;
      var viewerImpl = this.viewer.impl;

      this.activate = function (name) {
        _this2.active = true;
      };

      this.deactivate = function (name) {
        _this2.clearMarkedObject();
        _this2.active = false;
      };

      this.handleSingleClick = function (event, button) {
        var isEventHandled = false;

        if (button === 0) {
          var res = [];
          var vpVec = viewerImpl.clientToViewport(event.canvasX, event.canvasY);

          var renderer = viewerImpl.renderer();
          var overlayIdTarget = renderer.getOverlayIdTarget();
          if (!overlayIdTarget) {
            return false;
          }

          var dbId = renderer.idAtPixel(vpVec.x, vpVec.y, res, [overlayIdTarget]);

          // This handles two scenarios: (1) there is a change in selection
          // (i.e. going between with/without selection, or go from one selection to
          // another selection); (2) user continues to click outside all the sprites.
          //
          if (_this2.selectedDbId != dbId || _this2.selectedDbId == 0) {
            // When `dbId === 0` user clicks on an empty spot with no sprite.
            // If there was a selected sprite, then we need to dispatch a
            // `MOUSE_CLICK_OUT` event so client code has the chance to clear
            // any changes that came with the previous click-selection event.
            //
            if (_this2.selectedDbId) {
              var _clickEvent = {
                type: _Constants_js__WEBPACK_IMPORTED_MODULE_0__.MOUSE_CLICK_OUT,
                dbId: _this2.selectedDbId,
                originalEvent: event };


              _this2.viewer.dispatchEvent(_clickEvent);
              if (!_clickEvent.hasStopped) {
                _this2.clearMarkedObject();
                _this2.viewer.impl.invalidate(false, false, true);
              }
            }

            // Update selection to the new `dbId` (even if it is `0`)
            _this2.selectedDbId = dbId;
            var clickedViewPoint = viewerImpl.hitTestViewport(vpVec.clone(), false);

            // If there is a new selection, raise selection event.
            var clickEvent = {
              type: _Constants_js__WEBPACK_IMPORTED_MODULE_0__.MOUSE_CLICK,
              dbId: dbId,
              clickInfo: clickedViewPoint,
              originalEvent: event };


            _this2.viewer.dispatchEvent(clickEvent);
            if (!clickEvent.hasStopped) {
              _this2.markObject([dbId]);
              _this2.viewer.impl.invalidate(false, false, true);
            }

            // Setting 'isEventHandled = true' causes default viewer object selecction
            // to be turned off (i.e. no object that is clicked on will be selected).
            // We only want that when user clicks on any sprite, otherwise the default
            // viewer selection should be allowed to continue.
            //
            if (_this2.selectedDbId) {
              isEventHandled = true;
            }
          }
        }

        return isEventHandled;
      };

      this.handleSingleTap = function (event) {
        return _this2.handleSingleClick(event, 0);
      };

      this.handleDoubleClick = function (event, button) {
        return false;
      };

      this.handleButtonDown = function (event) {
        _this2.buttonDown = true;
        return false;
      };

      this.handleButtonUp = function (event) {
        _this2.buttonDown = false;
        return false;
      };

      this.handleMouseMove = function (event) {
        if (!_this2.buttonDown) {
          var vpVec = viewerImpl.clientToViewport(event.canvasX, event.canvasY);
          var overlayIdTarget = viewerImpl.renderer().getOverlayIdTarget();

          if (!overlayIdTarget) {
            return false;
          }

          var res = [];
          var dbId = viewerImpl.
          renderer().
          idAtPixel(vpVec.x, vpVec.y, res, [overlayIdTarget]);

          // There is a change in sprite that is hovered over
          if (_this2.hoveringDbId != dbId) {
            // The mouse has either hovered over a new sprite, or hovered off
            // an existing sprite. When the mouse first hovers over a sprite,
            // the `targetDbId` should be the `dbId` of the sprite that the mouse
            // cursor just entered. When the mouse hovers off an existing sprite
            // it was on (i.e. when `dbId` becomes `0`), then the `targetDbId`
            // should be the `dbId` of that existing sprite (which in this case,
            // is the `hoveringDbId`).
            //
            var targetDbId = dbId != 0 ? dbId : _this2.hoveringDbId;
            _this2.hoveringDbId = dbId;

            var hovering = dbId != 0;
            _this2.viewer.dispatchEvent({
              type: _Constants_js__WEBPACK_IMPORTED_MODULE_0__.MOUSE_HOVERING,
              dbId: targetDbId,
              hovering: hovering,
              originalEvent: event });


            return true; // Dispatched the event.
          }
        }
      };

      this.markObject = function (dbIds) {
        if (!(dbIds instanceof Array)) {
          dbIds = [dbIds];
        }

        if (!_this2.delegate.hasViewables) {
          return; // There's no viewable in the scene
        }

        var geometries = _this2.delegate.mapDbIdsToGeometries(dbIds);
        var dbIdIndex = new Set(dbIds);

        geometries.map(function (geometry) {
          // here we need to update the attribute of the geometry
          if (geometry && geometry.attributes["id"] && geometry.attributes["pointScale"]) {
            var scale = geometry.attributes["pointScale"].array;
            var uvp = geometry.attributes["uvp"].array;
            var colors = geometry.attributes["color"].array;
            var ids = geometry.attributes["id"].array;

            for (var i = 0; i < ids.length; i += 3) {
              var id = ids[i] + (ids[i + 1] << 8) + (ids[i + 2] << 16);
              var index = i / 3;
              var isHighlighted = dbIdIndex.has(id);
              scale[index] = isHighlighted ? 1.5 : 1;
              var uv = _this2.delegate.viewableData.getViewableUV(id, isHighlighted);

              if (uv) {
                uvp[index * 4] = uv.x;
                uvp[index * 4 + 1] = uv.y;
                uvp[index * 4 + 2] = uv.w;
                uvp[index * 4 + 3] = uv.h;
              }

              var color = _this2.delegate.viewableData.getViewableColor(id, isHighlighted);

              if (color) {
                colors[index * 3] = color.r * 255;
                colors[index * 3 + 1] = color.g * 255;
                colors[index * 3 + 2] = color.b * 255;
              }
            }

            geometry.attributes["pointScale"].needsUpdate = true;
            geometry.attributes["uvp"].needsUpdate = true;
            geometry.attributes["color"].needsUpdate = true;
          }
        });

        _this2.markedFragments = geometries;
      };

      this.clearMarkedObject = function () {
        if (!_this2.delegate.hasViewables) {
          _this2.markedFragments = [];
          return; // There's no viewable in the scene
        }

        var fragments = _this2.markedFragments || [];
        _this2.markedFragments = []; // Clear internal references.

        if (fragments) {
          fragments.map(function (geometry) {
            // here we need to update the attribute of the geometry
            if (geometry && geometry.attributes["pointScale"]) {
              var scale = geometry.attributes["pointScale"].array;
              var uvp = geometry.attributes["uvp"].array;
              var colors = geometry.attributes["color"].array;
              var ids = geometry.attributes["id"].array;
              for (var i = 0; i < ids.length; i += 3) {
                var id = ids[i] + (ids[i + 1] << 8) + (ids[i + 2] << 16);
                var index = i / 3;
                scale[index] = 1;
                var uv = _this2.delegate.viewableData.getViewableUV(id, false);
                if (uv) {
                  uvp[index * 4] = uv.x;
                  uvp[index * 4 + 1] = uv.y;
                  uvp[index * 4 + 2] = uv.w;
                  uvp[index * 4 + 3] = uv.h;
                }
                var color = _this2.delegate.viewableData.getViewableColor(id, false);
                if (color) {
                  colors[index * 3] = color.r * 255;
                  colors[index * 3 + 1] = color.g * 255;
                  colors[index * 3 + 2] = color.b * 255;
                }
              }
              geometry.attributes["pointScale"].needsUpdate = true;
              geometry.attributes["uvp"].needsUpdate = true;
              geometry.attributes["color"].needsUpdate = true;
            }
          });

          _this2.viewer.impl.invalidate(false, false, true);
        }
      };

      this.invalidateViewablesDirect = function (dbIds, meshes, viewableData, callback) {
        if (!dbIds || !meshes || !callback) {
          throw new Error("Parameters of 'invalidateViewables' are mandatory");
        }

        if (!(dbIds instanceof Array)) {
          dbIds = [dbIds];
        }

        var dbIdSet = new Set(dbIds);

        /** @type {Map<number, CustomViewable>} */
        var viewables = new Map();
        viewableData.viewables.forEach(function (v) {return viewables.set(v.dbId, v);});

        var sceneUpdated = false;

        var mesh = meshes[0];
        var geometry = mesh.geometry;
        var ids = geometry.attributes["id"].array;

        for (var i = 0; i < ids.length; i += 3) {
          var dbId = ids[i] + (ids[i + 1] << 8) + (ids[i + 2] << 16);
          if (!dbIdSet.has(dbId)) {
            continue;
          }

          var updates = callback(viewables.get(dbId));
          if (!updates) {
            continue;
          }

          var pointIndex = i / 3;
          if (updates.position) {
            var positions = geometry.attributes["position"].array;
            geometry.attributes["position"].needsUpdate = true;
            positions[pointIndex * 3 + 0] = updates.position.x;
            positions[pointIndex * 3 + 1] = updates.position.y;
            positions[pointIndex * 3 + 2] = updates.position.z;

            sceneUpdated = true;
          }

          if (updates.url) {
            var uv = viewableData.getSpriteUV(updates.url);
            if (uv) {
              var uvp = geometry.attributes["uvp"].array;
              geometry.attributes["uvp"].needsUpdate = true;
              uvp[pointIndex * 4 + 0] = uv.x;
              uvp[pointIndex * 4 + 1] = uv.y;
              uvp[pointIndex * 4 + 2] = uv.w;
              uvp[pointIndex * 4 + 3] = uv.h;

              sceneUpdated = true;
            }
          }

          if (updates.color) {
            var colors = geometry.attributes["color"].array;
            geometry.attributes["color"].needsUpdate = true;
            colors[pointIndex * 3 + 0] = updates.color.r * 255;
            colors[pointIndex * 3 + 1] = updates.color.g * 255;
            colors[pointIndex * 3 + 2] = updates.color.b * 255;

            sceneUpdated = true;
          }

          if (updates.scale !== undefined) {
            if (updates.scale > 2.0 || updates.scale < 0) {
              var msg = "invalidateViewables: 'scale' of '".concat(updates.scale, "' out of range [0, 2]");
              console.warn(msg);
            }
            var scale = geometry.attributes["pointScale"].array;
            geometry.attributes["pointScale"].needsUpdate = true;
            scale[pointIndex] = updates.scale;

            sceneUpdated = true;
          }
        }

        if (sceneUpdated) {
          _this2.viewer.impl.invalidate(false, false, true);
        }
      };
    } }]);return SceneTool;}(av.ToolInterface);


GlobalManagerMixin.call(SceneTool.prototype);

/***/ }),

/***/ "./extensions/DataVisualization/SpriteAtlas.js":
/*!*****************************************************!*\
  !*** ./extensions/DataVisualization/SpriteAtlas.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpriteAtlas": () => (/* binding */ SpriteAtlas)
/* harmony export */ });
/* harmony import */ var maxrects_packer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! maxrects-packer */ "./node_modules/maxrects-packer/dist/maxrects-packer.mjs");
/* harmony import */ var q__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! q */ "./extensions/DataVisualization/node_modules/q/q.js");
/* harmony import */ var q__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(q__WEBPACK_IMPORTED_MODULE_1__);
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}


var avp = Autodesk.Viewing.Private;var

SpriteAtlas = /*#__PURE__*/function () {
  function SpriteAtlas() {var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1920;var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1080;var padding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;_classCallCheck(this, SpriteAtlas);
    this.width = width;
    this.height = height;
    this.padding = padding;

    this.spritesMap = {};
    this.pending = [];
    this.images = [];

    this.logger = avp.logger;
    this.packer = new maxrects_packer__WEBPACK_IMPORTED_MODULE_0__.MaxRectsPacker(this.width, this.height, this.padding, {
      smart: true,
      pot: false,
      square: false,
      allowRotation: false,
      tag: false,
      border: 0 });

    this.canvas = document.createElement("canvas");
    this.hasContent = false;
  }_createClass(SpriteAtlas, [{ key: "addSprite", value: function addSprite(

    url) {var _this = this;
      if (this.spritesMap[url] == undefined) {
        var defer = q__WEBPACK_IMPORTED_MODULE_1___default().defer();
        var image = new Image();
        image.crossOrigin = "anonymous";

        image.onload = function () {
          _this.images.push({
            url: url,
            image: image,
            width: image.width,
            height: image.height });

          defer.resolve();
        };

        image.onerror = function (error) {
          _this.logger.error(error);
          defer.resolve();
        };

        image.src = url;
        this.spritesMap[url] = 1;
        this.pending.push(defer.promise);
      }
    } }, { key: "finish", value: function () {var _finish = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {var _this2 = this;var canvas;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (










                  q__WEBPACK_IMPORTED_MODULE_1___default().all(this.pending));case 2:
                canvas = this.canvas;

                this.packer.addArray(this.images);

                this.images.length = 0;
                this.packer.bins.forEach(function (bin) {
                  canvas.width = bin.width;
                  canvas.height = bin.height;

                  var ctx = canvas.getContext("2d");

                  bin.rects.forEach(function (rect) {
                    if (rect.image) {
                      ctx.drawImage(rect.image, rect.x, rect.y);
                      rect.image = undefined;

                      _this2.spritesMap[rect.url] = rect;
                      rect.url = undefined;
                    }
                  });
                });case 6:case "end":return _context.stop();}}}, _callee, this);}));function finish() {return _finish.apply(this, arguments);}return finish;}() }, { key: "spriteUV", value: function spriteUV(


    url) {
      var item = this.spritesMap[url];
      if (item) {
        return {
          x: item.x / this.canvasWidth,
          y: item.y / this.canvasHeight,
          w: (item.x + item.width) / this.canvasWidth,
          h: (item.y + item.height) / this.canvasHeight };

      } else {
        return {
          x: 0,
          y: 0,
          w: 1,
          h: 1 };

      }
    } }, { key: "canvasWidth", get: function get() {return this.canvas.width;} }, { key: "canvasHeight", get: function get() {return this.canvas.height;} }]);return SpriteAtlas;}();




/***/ }),

/***/ "./extensions/DataVisualization/SpriteMeshBuilder.js":
/*!***********************************************************!*\
  !*** ./extensions/DataVisualization/SpriteMeshBuilder.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;} // 64K

var THREE = __webpack_require__(/*! three */ "three");

var MAX_VCOUNT = 65535;var

SpriteMeshBuilder = /*#__PURE__*/function () {"use strict";

  function SpriteMeshBuilder(meshCallback) {_classCallCheck(this, SpriteMeshBuilder);
    this.meshCallback = meshCallback;
    this.dbIds = [];
    this.reset();
  }_createClass(SpriteMeshBuilder, [{ key: "addPoint", value: function addPoint(

    viewable, spriteAtlas) {
      if (this.vcount + 1 > MAX_VCOUNT) {
        this.flushBuffer();

        this.reset();
      }

      var index = this.vcount;
      this.ib[index] = index;

      this.vb[index * 3] = viewable.position.x;
      this.vb[index * 3 + 1] = viewable.position.y;
      this.vb[index * 3 + 2] = viewable.position.z;

      this.idb[index * 3] = viewable.dbId & 0xFF;
      this.idb[index * 3 + 1] = viewable.dbId >> 8 & 0xFF;
      this.idb[index * 3 + 2] = viewable.dbId >> 16 & 0xFF;

      this.colorb[index * 3] = viewable.color.r * 255;
      this.colorb[index * 3 + 1] = viewable.color.g * 255;
      this.colorb[index * 3 + 2] = viewable.color.b * 255;

      if (spriteAtlas) {
        var uv = spriteAtlas.spriteUV(viewable.style.url);
        if (uv) {
          this.uv[index * 4] = uv.x;
          this.uv[index * 4 + 1] = uv.y;
          this.uv[index * 4 + 2] = uv.w;
          this.uv[index * 4 + 3] = uv.h;
        }
      }

      this.scale[index] = 1;
      this.dbIds.push(viewable.dbId);
      this.vcount++;
    } }, { key: "reset", value: function reset()

    {
      this.vcount = 0;

      this.ib = new Uint16Array(MAX_VCOUNT);
      this.idb = new Uint8Array(MAX_VCOUNT * 3);
      this.vb = new Float32Array(MAX_VCOUNT * 3);
      this.colorb = new Uint8Array(MAX_VCOUNT * 3);
      this.scale = new Float32Array(MAX_VCOUNT);
      this.uv = new Float32Array(MAX_VCOUNT * 4);
    } }, { key: "flushBuffer", value: function flushBuffer()

    {
      var geometry = new THREE.BufferGeometry();
      var idAttribute = new THREE.BufferAttribute(new Uint8Array(this.idb.slice(0, this.vcount * 3)), 3);
      idAttribute.bytesPerItem = 1;
      idAttribute.normalized = true;

      var positionAttribute = new THREE.BufferAttribute(new Float32Array(this.vb.slice(0, this.vcount * 3)), 3);
      positionAttribute.bytesPerItem = 4;

      var colorAttribute = new THREE.BufferAttribute(new Uint8Array(this.colorb.slice(0, this.vcount * 3)), 3);
      colorAttribute.bytesPerItem = 1;
      colorAttribute.normalized = true;

      var indexAttribute = new THREE.BufferAttribute(new Uint16Array(this.ib.slice(0, this.vcount)), 1);

      var uvAttribute = new THREE.BufferAttribute(new Float32Array(this.uv.slice(0, this.vcount * 4)), 4);

      var scaleAttribute = new THREE.BufferAttribute(new Float32Array(this.scale.slice(0, this.vcount)), 1);

      geometry.setAttribute("id", idAttribute);
      geometry.setIndex(indexAttribute);
      geometry.setAttribute("position", positionAttribute);
      geometry.setAttribute("color", colorAttribute);
      geometry.setAttribute("uvp", uvAttribute);
      geometry.setAttribute("pointScale", scaleAttribute);

      geometry.isPoints = true;
      geometry.dbIds = this.dbIds.slice(0);
      this.dbIds.length = 0;

      if (this.meshCallback) {
        this.meshCallback(geometry);
      }
      this.vcount = 0;
    } }]);return SpriteMeshBuilder;}();


module.exports = {
  SpriteMeshBuilder: SpriteMeshBuilder };

/***/ }),

/***/ "./extensions/DataVisualization/TextureUtils.js":
/*!******************************************************!*\
  !*** ./extensions/DataVisualization/TextureUtils.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TextureUtility": () => (/* binding */ TextureUtility)
/* harmony export */ });
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var TextureUtility = /*#__PURE__*/function () {
  function TextureUtility(viewer) {_classCallCheck(this, TextureUtility);
    this.viewer = viewer;
    this._textures = {};
    this._colors = {};
    this._excluded = [
    "__defaultMaterial__",
    "__fadeMaterial__",
    "__highlightMaterial__",
    "__dataVizSpriteMaterial__"];

  }_createClass(TextureUtility, [{ key: "show", value: function show()

    {
      // this.viewer.setLightPreset(this._dataModel.dasherSettings.noTexturesLighting);
      this.hideTextures();
      this.regen();
      return true;
    } }, { key: "hide", value: function hide()

    {
      // this.viewer.setLightPreset(this._dataModel.dasherSettings.initialLighting);
      this.showTextures();
      this.regen();
      return true;
    } }, { key: "regen", value: function regen()

    {
      this.viewer.refresh(true);
      // this.viewer.impl.invalidate(true, true, false);
    } }, { key: "hideTextures", value: function hideTextures()

    {
      var store = Object.keys(this._textures).length === 0;
      var white = new THREE.Color(1, 1, 1);

      var mats = this.viewer.impl.matman()._materials;
      for (var p in mats) {
        if (this._excluded.indexOf(p) === -1) {
          var m = mats[p];
          if (store) {
            this._textures[p] = m.map;
            this._colors[p] = m.color;
          }
          m.map = null;
          m.color = white;
          m.needsUpdate = true;
        }
      }
      this.regen();
    } }, { key: "showTextures", value: function showTextures()

    {
      if (Object.keys(this._textures).length > 0) {
        var mats = this.viewer.impl.matman()._materials;
        for (var p in mats) {
          if (this._excluded.indexOf(p) === -1) {
            var m = mats[p];
            var mat = this._textures[p];
            if (mat) {
              m.map = mat;
            }
            var col = this._colors[p];
            if (col) {
              m.color = col;
            }
            m.needsUpdate = true;
          }
        }
      }
      this.regen();
    } }]);return TextureUtility;}();

/***/ }),

/***/ "./extensions/DataVisualization/heatmap/HeatmapMaterial.js":
/*!*****************************************************************!*\
  !*** ./extensions/DataVisualization/heatmap/HeatmapMaterial.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HeatmapMaterial": () => (/* binding */ HeatmapMaterial),
/* harmony export */   "createColorStops": () => (/* binding */ createColorStops)
/* harmony export */ });
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * A material for heatmap rendering.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * @param {Array.<THREE.Vector4>} sensorVals The value of sensors where
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * x, y, z components carry the position of a sensor, and w component
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * represents the normalized value of a sensor in the range of 0.0 to 1.0.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * If the w component is a negative number, the sensor will not have any
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * influence towards the color of the material.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * @param {Array.<THREE.Vector3>} colors An array of Vector3 each representing a
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * color value of a stop in the grandient. The length of this array must be the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * same as stops parameter.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * @param {Array.<number>} stops An array of normalized numbers each representing
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * a stop in the gradient. The numbers in this array must be in ascending order,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * and the array length must be the same as colors parameter.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * @property {number} confidence The distance from the sensor that its value will
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * affect the heatmap before dropping off. Measured in world coordinates of the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * current model.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * @param {number} [powerParameter] Optional. A positive real number. Greater
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * values of power parameter assign greater influence to values closest to the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * interpolated point. This parameter is default to `2.0`.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * @param {number} [alpha] Optional. The transparency level of the resulting
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * fragment on the heatmap, ranging from `0.0` (completely transparent) to `1.0`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * (fully opaque). The default value is `1.0`.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       */var
HeatmapMaterial = /*#__PURE__*/function (_THREE$ShaderMaterial) {_inherits(HeatmapMaterial, _THREE$ShaderMaterial);var _super = _createSuper(HeatmapMaterial);
  function HeatmapMaterial(sensorVals, colors, stops, confidence) {var powerParameter = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 2.0;var alpha = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1.0;_classCallCheck(this, HeatmapMaterial);
    if (colors.length < 2 || colors.length != stops.length) {
      throw new Error("Heatmap requires at least two colors to work");
    }
    if (confidence < 0.0) {
      throw new Error("Heatmap 'confidence' must be a positive number");
    }
    if (powerParameter < 0.0) {
      throw new Error("Heatmap 'powerParameter' must be a positive number");
    }
    if (alpha < 0.0 || alpha > 1.0) {
      throw new Error("Heatmap 'alpha' must range between 0.0 and 1.0");
    }

    var uniforms = {
      uPower: { type: "f", value: powerParameter },
      uAlpha: { type: "f", value: alpha },
      uConfidence: { type: "f", value: confidence },
      uSensors: { type: "v4v", value: sensorVals.map(function (v) {return v;}) },
      uStops: { type: "fv1", value: stops },
      uColors: { type: "v3v", value: colors } };


    var colorCount = colors.length;
    var sensorCount = sensorVals.length;

    var vertexShader = "\n            varying vec4 worldCoord;\n\n            void main()\n            {\n                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n                worldCoord = modelMatrix * vec4(position, 1.0);\n                gl_Position = projectionMatrix * mvPosition;\n            }\n        ";










    var fragmentShader = "\n            varying vec4 worldCoord;\n            uniform float uPower;\n            uniform float uAlpha;\n            uniform float uConfidence;\n            uniform vec4 uSensors [".concat(




    sensorCount, "];\n            uniform float uStops[").concat(
    colorCount, "];\n            uniform vec3 uColors[").concat(
    colorCount, "];\n\n            const float dotSize = 6.0;\n            const float h_var1 = 0.4;\n            const float h_var2 = 0.25;\n            const float two_pi = 2.0 * 3.1415927;\n            \n            float lmap(float value, float inMin, float inMax, float outMin, float outMax)\n            {\n                return clamp(outMin + ((outMax - outMin) * (value - inMin)) / (inMax - inMin), outMin, outMax);\n            }\n\n            // Gradient with multiple colors in non-equal intervals\n            vec3 colormap(float x)\n            {\n                for (int i = 1; i < ").concat(














    colorCount, "; i++) {\n                    if (x <= uStops[i]) {\n                        float stopPct = lmap(x, uStops[i-1], uStops[i], 0.0, 1.0);\n                        return mix(uColors[i-1], uColors[i], stopPct);\n                    }\n                }\n            \n                // In case 'x' goes beyond upper bound.\n                return uColors[").concat(







    colorCount, " - 1];\n            }\n\n            vec2 get_pix(float angle) {\n                float rad = radians(angle);\n                float c = cos(rad);\n                float s = sin(rad);\n                mat2 R = mat2(vec2(c, -s), vec2(s, c));\n                return R * gl_FragCoord.xy;\n            }\n\n            vec3 halftone(float tone, vec3 dotColor, vec3 backgroundColor) {\n                vec2 u = get_pix(-45.0) / (dotSize);\n                float h = (h_var1 + h_var2 * cos(u.x*two_pi));\n                const float e = 0.05;\n                float gradient = smoothstep(-e, e, h - tone);\n                return mix(dotColor, backgroundColor, gradient);\n            }\n\n            void main(void) {\n                vec3 fragPos = vec3(worldCoord.x, worldCoord.y, worldCoord.z);\n                float result = 0.0;\n                float sum = 0.0;\n                float wsum = 0.000001;\n                float minDist = 999999999.0;\n                bool found = false; // at exact location of the sensor\n                int validSensors = 0;\n\n                for (int i=0; i < ").concat(



























    sensorCount, "; i++) {\n                    float mydist = distance(fragPos, vec3(uSensors[i][0], uSensors[i][1], uSensors[i][2]));\n                    if (uSensors[i][3] >= 0.0) {\n                        if (mydist < 0.00001) {\n                            result = uSensors[i][3];\n                            found = true;\n                        } else {\n                            float w = (1.0 / (pow(mydist, uPower)));\n                            sum += (uSensors[i][3] * w);\n                            wsum += w;\n                        }\n                        validSensors += 1;\n                        if (mydist < minDist) {\n                            minDist = mydist;\n                        }\n                    }\n                }\n\n                if (validSensors == 0) {\n                    result = -1.0;\n                } else if (!found) {\n                    result = sum / wsum;\n                }\n\n                // Defaults without influence from any sensor\n                float confidence = 0.0;\n                vec3 sensorColor = vec3(0.5, 0.5, 0.5);\n\n                if (result >= 0.0) {\n                    result = clamp(result, 0.0, 1.0);\n                    confidence = 1.0 - clamp(minDist / uConfidence, 0.0, 1.0);\n                    sensorColor = colormap(result);\n                }\n\n                vec3 confidenceColor = halftone(clamp(confidence, 0.3, 0.9), vec3(0.7, 0.7, 0.7), vec3(1.0, 1.0, 1.0));\n                gl_FragColor = vec4(mix(confidenceColor, sensorColor, clamp(confidence, 0.0, 1.0)), uAlpha);\n            }\n        ");return _super.call(this,






































    {
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: false });

  }

  /**
     * Update HeatmapMaterial with new sensor values, and optionally additional
     * configuration.
     *
     * @param {Array.<THREE.Vector4>} sensorVals The value of sensors where x, y, z
     * components carry the position of a sensor, and w component represents the
     * normalized value of a sensor in the range of 0.0 to 1.0.
     * If the w component is a negative number, the sensor will not have any
     * influence towards the color of the material.
     * @property {number} [confidence] Optional. The distance from the sensor that its
     * value will affect the heatmap before dropping off. Measured in world coordinates
     * of the current model. The default value is `160.0`.
     * @property {number} [powerParameter] Optional. A positive real number. Greater
     * values of power parameter assign greater influence to values closest to the
     * interpolated point. This parameter is default to `2.0`.
     * @property {number} [alpha] Optional. The transparency level of the resulting
     * fragment on the heatmap, ranging from `0.0` (completely transparent) to `1.0`
     * (fully opaque). The default value is `1.0`.
     */_createClass(HeatmapMaterial, [{ key: "update", value: function update(
    sensorVals, confidence, powerParameter, alpha) {
      // Note: `isNaN(null) == false` so special handling.
      if (!isNaN(confidence) && confidence !== null) {
        this.uniforms.uConfidence.value = confidence;
      }
      if (!isNaN(powerParameter) && powerParameter !== null) {
        this.uniforms.uPower.value = powerParameter;
      }
      if (!isNaN(alpha) && alpha !== null) {
        this.uniforms.uAlpha.value = alpha;
      }

      this.uniforms.uSensors.value = sensorVals;
    } }]);return HeatmapMaterial;}(THREE.ShaderMaterial);


function createColorStops(n) {
  var res = [];
  var inc = 1 / (n - 1);
  for (var i = 0; i < n; i++) {
    res.push(inc * i);
  }
  return res;
}



/***/ }),

/***/ "./extensions/DataVisualization/heatmap/IDWDataProcessor.js":
/*!******************************************************************!*\
  !*** ./extensions/DataVisualization/heatmap/IDWDataProcessor.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "IDWDataProcessor": () => (/* binding */ IDWDataProcessor),
/* harmony export */   "IDWProcessMaterial": () => (/* binding */ IDWProcessMaterial)
/* harmony export */ });
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * The position of the vertex whose value is to be determined by influences
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * from scattered nearby data points. The interpolation is done by Inverse
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * distance weighting (IDW) method.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * IDW: Inverse distance weighting
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * https://en.wikipedia.org/wiki/Inverse_distance_weighting
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       */var
IDWProcessMaterial = /*#__PURE__*/function (_THREE$ShaderMaterial) {_inherits(IDWProcessMaterial, _THREE$ShaderMaterial);var _super = _createSuper(IDWProcessMaterial);
  function IDWProcessMaterial(vertexTexture, dataTexture, dataCount) {var _this;var power = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;_classCallCheck(this, IDWProcessMaterial);
    power = parseFloat(power).toFixed(3);

    var uniforms = {
      dataTexture: { type: "t", value: null },
      vertexTexture: { type: "t", value: null },
      uPower: { type: "f", value: power },
      uDataCount: { type: "i", value: dataCount },
      uDataTextureWidth: { type: "i", value: 1 } };


    var vertexShader = "\n            varying vec2 vUV;\n\n            void main()\n            {\n                vUV = uv;\n                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n                gl_Position = projectionMatrix * mvPosition;\n            }\n        ";










    var fragmentShader = "\n            varying vec2 vUV;\n\n            uniform float uPower;\n            uniform int uDataCount;\n            uniform int uDataTextureWidth;\n            \n            uniform sampler2D dataTexture;\n            uniform sampler2D vertexTexture;\n            \n            void main(void) {\n                // The position of the vertex whose value is to be determined.\n                vec4 vertex = texture2D(vertexTexture, vUV);\n            \n                if (vertex.w < 0.) {\n                    // This is an invalid vertex, mark as transparent.\n                    gl_FragColor = vec4(0., 0., 0., 1.);\n                    return;\n                }\n            \n                float sum = 0.;\n                float wsum = 0.;\n                float factor = 1. / float(uDataTextureWidth);\n                float textureWidth = float(uDataTextureWidth);\n            \n                // Compute weighted influence from all the data points.\n                for (int index = 0; index < uDataCount; index++)\n                {\n                    float i = float(index);\n                    float y = floor(i / textureWidth);\n                    float x = mod(i, textureWidth);\n            \n                    vec2 dUV = vec2((x + 0.5) * factor, (y + 0.5) * factor);\n                    vec4 dataPoint = texture2D(dataTexture, dUV);\n            \n                    float dist = distance(vertex.xyz, dataPoint.xyz);\n            \n                    if (dist < 0.0001) {\n                        gl_FragColor = vec4(dataPoint.w, 0., 0., 1.);\n                        return;\n                    }\n            \n                    float w = 1. / dist;\n                    w = pow(w, uPower);\n            \n                    sum += dataPoint.w * w;\n                    wsum += w;\n                }\n            \n                gl_FragColor = vec4(sum/wsum , 0., 0., 1.);\n            }\n        ";




















































    _this = _super.call(this, {
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: true });


    _this.vertexTexture = vertexTexture;
    _this.dataTexture = dataTexture;return _this;
  }

  /**
     * Texture for vertice
     */_createClass(IDWProcessMaterial, [{ key: "vertexTexture", set: function set(
    value) {
      if (value) {
        this.uniforms.vertexTexture.value = value;
      }
    }

    /**
       * Texture for sensor locations
       */ }, { key: "dataTexture", set: function set(
    value) {
      if (value) {
        this.uniforms.dataTexture.value = value;
        this.uniforms.uDataTextureWidth.value = value.image.width;
      }
    } }]);return IDWProcessMaterial;}(THREE.ShaderMaterial);var


IDWDataProcessor = /*#__PURE__*/function () {
  /**
                                              * Constructs an instance of `IDWDataProcessor` object.
                                              *
                                              * @param {Viewer3D} viewer The viewer object.
                                              * @param {number[]} vertices The input vertex positions in the form of `[x, y, z, ...]`
                                              * @param {number[]} dataPoints The input data point positions and values in the form
                                              * of `[x, y, z, w, ...]` where `w` represents the value of the corresponding data point.
                                              * @param {Object} [options] The optional configuration for `IDWDataProcessor` object.
                                              * @param {number} [min] Optional. The smallest `w` value found in `dataPoints` list.
                                              * If this value is not specified, it is derived from the given `dataPoints` parameter.
                                              * @param {number} [max] Optional. The largest `w` value found in `dataPoints` list.
                                              * If this value is not specified, it is derived from the given `dataPoints` parameter.
                                              * @param {number[]} [colors] Optional. An array of color values. See `setColors`
                                              * function for more details.
                                              */
  function IDWDataProcessor(viewer, vertices, dataPoints) {var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};_classCallCheck(this, IDWDataProcessor);
    this.viewer = viewer;

    this.min = options.min;
    this.max = options.max;var

    colors = options.colors;
    if (colors) {
      this.setColors(colors);
    } else {
      this.setColors([0x0000ff, 0x00ffff, 0x00ff00, 0xffff00, 0xff0000]);
    }

    this.setVertices(vertices);
    this.setDataPoints(dataPoints);

    this.initializeRender();
  }

  /**
     * Sets the list of mesh vertex positions.
     *
     * @param {number[]} vertices The input vertex positions in the form of `[x, y, z, ...]`
     */_createClass(IDWDataProcessor, [{ key: "setVertices", value: function setVertices(
    vertices) {
      if (this.vertexTexture) {
        this.vertexTexture.dispose();
        this.vertexTexture = null;
      }

      var textureSize = Math.ceil(Math.sqrt(vertices.length / 3));
      var verticesData = new Float32Array(textureSize * textureSize * 4);
      verticesData.fill(-1);

      for (var i = 0, count = vertices.length / 3; i < count; i++) {
        verticesData[i * 4] = vertices[i * 3];
        verticesData[i * 4 + 1] = vertices[i * 3 + 1];
        verticesData[i * 4 + 2] = vertices[i * 3 + 2];
        verticesData[i * 4 + 3] = 1;
      }

      var vertexTexture = new THREE.DataTexture(
      verticesData,
      textureSize,
      textureSize,
      THREE.RGBAFormat,
      THREE.FloatType,
      THREE.UVMapping,
      THREE.ClampToEdgeWrapping,
      THREE.ClampToEdgeWrapping,
      THREE.NearestFilter,
      THREE.NearestFilter);


      vertexTexture.generateMipmaps = false;
      vertexTexture.needsUpdate = true;
      this.vertexTexture = vertexTexture;
      this.verticesLength = vertices.length;

      // Create a buffer to read computed vertex values.
      this.vertexValues = new Uint8Array(textureSize * textureSize * 4);
    }

    /**
       * Sets the list of data point positions and values.
       *
       * @param {number[]} dataPoints The input data point positions and values in the form
       * of `[x, y, z, w, ...]` where `w` represents the value of the corresponding data point.
       */ }, { key: "setDataPoints", value: function setDataPoints(
    dataPoints) {
      if (this.dataTexture) {
        this.dataTexture.dispose();
        this.dataTexture = null;
      }

      var textureSize = Math.ceil(Math.sqrt(dataPoints.length / 4));
      var dataBuffer = new Float32Array(textureSize * textureSize * 4);var

      min = this.min,max = this.max;
      if (min == undefined || max == undefined) {
        min = Infinity, max = -Infinity;

        for (var i = 0; i < dataPoints.length; i += 4) {
          min = Math.min(min, dataPoints[i + 3]);
          max = Math.max(max, dataPoints[i + 3]);
        }
      }

      var delta = max - min || 1;
      for (var _i = 0; _i < dataPoints.length; _i += 4) {
        dataBuffer[_i] = dataPoints[_i];
        dataBuffer[_i + 1] = dataPoints[_i + 1];
        dataBuffer[_i + 2] = dataPoints[_i + 2];
        dataBuffer[_i + 3] = (dataPoints[_i + 3] - min) / delta;
      }

      var dataTexture = new THREE.DataTexture(
      dataBuffer,
      textureSize,
      textureSize,
      THREE.RGBAFormat,
      THREE.FloatType,
      THREE.UVMapping,
      THREE.ClampToEdgeWrapping,
      THREE.ClampToEdgeWrapping,
      THREE.NearestFilter,
      THREE.NearestFilter);


      dataTexture.generateMipmaps = false;
      dataTexture.needsUpdate = true;
      this.dataTexture = dataTexture;
      this.dataCount = dataPoints.length / 4;
    }

    /**
       * Setup rendering related code
       */ }, { key: "initializeRender", value: function initializeRender()
    {
      var idwMaterial = new IDWProcessMaterial(
      this.vertexTexture,
      this.dataTexture,
      this.dataCount);


      var planeGeometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1);
      var orthCamera = new THREE.OrthographicCamera(-1, 1, -1, 1, 0, 1);

      var targetSize = this.vertexTexture.image.width;
      var renderTarget = new THREE.WebGLRenderTarget(targetSize, targetSize, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        // type: THREE.FloatType,
        stencilBuffer: false,
        depthBuffer: false });


      var planeMesh = new THREE.Mesh(planeGeometry, idwMaterial);
      planeMesh.frustumCulled = false;
      this.scene = new THREE.Scene();
      this.scene.add(planeMesh);

      this.material = idwMaterial;
      this.renderTarget = renderTarget;
      this.planeGeometry = planeGeometry;
      this.camera = orthCamera;
    }

    /**
       * Registers color stops for use in color interpolation. The specified color
       * stops evenly spread out across the spectrum that represents the normalized
       * data values ranging between 0.0 and 1.0.
       *
       * Expose this API to help user to try differnt color theme
       * @param {number[]} colors An array of color values, each expressed in a
       * 3-byte (24-bit) numerical value. Note that it is possible to specify a
       * 4-byte (32-bit) number as color, but only 3 lower bytes will be taken.
       * Each of the three bytes represents the intensity value between `0` and `255`,
       * of red, green, blue color component respectively. For example, `0xff0000`
       * represents a red color with full intensity.
       *
       * @example
       *  // Register 3 color stops to visualize normalized data.
       *  dataProcessor.setColors([0x0f2027, 0x203a43, 0x2c5364]);
       */ }, { key: "setColors", value: function setColors(
    colors) {
      if (colors) {
        this.colors = colors.map(function (color) {return new THREE.Color(color);});
        this.stops = this._createColorStops(colors.length);

        // Pre-generate the lookup table will save lots of time and GC pressure
        this.colorMapData = [];
        for (var i = 0; i < 256; i++) {
          this.colorMapData.push(this._mapValueToColor(i / 255));
        }
      }
    }

    /**
       * @private
       * @param {number} n
       * @returns
       */ }, { key: "_createColorStops", value: function _createColorStops(
    n) {
      var res = [];
      var inc = 1 / (n - 1);
      for (var i = 0; i < n; i++) {
        res.push(inc * i);
      }
      return res;
    }

    /**
       * @private
       * @param {number} value
       * @returns {{r,g,b}} color
       */ }, { key: "_mapValueToColor", value: function _mapValueToColor(
    value) {var
      colors = this.colors,stops = this.stops;

      function mix(l, r, p) {
        return l * (1 - p) + r * p;
      }

      function mixColor(c1, c2, p) {
        var result = new THREE.Color();
        result.r = mix(c1.r, c2.r, p);
        result.g = mix(c1.g, c2.g, p);
        result.b = mix(c1.b, c2.b, p);

        return result;
      }

      var result = colors[stops.length - 1];
      for (var i = 1; i < stops.length; i++) {
        if (value <= stops[i]) {
          var p = (value - stops[i - 1]) / (stops[i] - stops[i - 1]);
          result = mixColor(colors[i - 1], colors[i], p);
          break;
        }
      }

      var r = Math.round(255 * result.r);
      var g = Math.round(255 * result.g);
      var b = Math.round(255 * result.b);

      return { r: r, g: g, b: b };
    }

    /**
       * Process input vertex and data points to produce per-vertex color data.
       *
       * @param {{colors: number[], power: number, outputTarget}} [options] The
       * optional configuration object for the processing.
       */ }, { key: "process", value: function process()
    {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};var
      colors = options.colors,power = options.power,outputTarget = options.outputTarget;

      if (colors) {
        this.setColors(colors);
      }

      if (power === undefined || power === null) {
        power = 1;
      }

      this.material.uniforms["uPower"].value = power;

      var targetSize = this.vertexTexture.image.width;
      if (this.renderTarget.width != targetSize) {
        this.renderTarget.setSize(targetSize, targetSize);
      }

      var renderer = this.viewer.impl.glrenderer();
      renderer.render(this.scene, this.camera, this.renderTarget, true);

      renderer.readRenderTargetPixels(
      this.renderTarget,
      0,
      0,
      targetSize,
      targetSize,
      this.vertexValues);


      return this._getColorValues(outputTarget);
    }

    /**
       * @private
       * Compute color values for each vertex processed by `IDWDataProcessor`.
       *
       * @param {Uint8Array} [outputTarget] The output `Uint8Array` where color
       * data is to be written. The output content is in the form of `[r, g, b, ...]`
       * where each color component is in the range of `[0, 255]`.
       *
       * @returns If a valid object was passed in as the `outputTarget` parameter,
       * then the same object is returned. Otherwise this function returns a new
       * `Uint8Array` that contains the color data. The output content is in the form
       * of `[r, g, b, ...]` where each color component is in the range of `[0, 255]`.
       */ }, { key: "_getColorValues", value: function _getColorValues(
    outputTarget) {
      var colors;
      if (outputTarget && outputTarget.length == this.verticesLength) {
        colors = outputTarget;
      } else {
        colors = new Uint8Array(this.verticesLength);
      }

      var outputValues = this.vertexValues;
      for (var i = 0, count = this.verticesLength / 3; i < count; i++) {
        var index = i * 4;
        var alpha = outputValues[index + 3];

        if (alpha < 128) {
          continue;
        }

        var value = outputValues[index];
        var color = this.colorMapData[value];

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }

      return colors;
    }

    /**
       * Release the resources to avoid OOM
       */ }, { key: "cleanUp", value: function cleanUp()
    {var _this2 = this;
      // There is webgl warnings if immidiately dispose the resources
      setTimeout(function () {
        if (_this2.vertexTexture) {
          _this2.vertexTexture.dispose();
          _this2.vertexTexture = null;
        }

        if (_this2.dataTexture) {
          _this2.dataTexture.dispose();
          _this2.dataTexture = null;
        }

        if (_this2.renderTarget) {
          _this2.renderTarget.dispose();
          _this2.renderTarget = null;
        }

        if (_this2.material) {
          _this2.material.dispose();
          _this2.material = null;
        }

        if (_this2.planeGeometry) {
          _this2.planeGeometry.dispose();
          _this2.planeGeometry = null;
        }
      }, 32);
    } }]);return IDWDataProcessor;}();




/***/ }),

/***/ "./extensions/DataVisualization/heatmap/PlanarHeatmap.js":
/*!***************************************************************!*\
  !*** ./extensions/DataVisualization/heatmap/PlanarHeatmap.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PlanarHeatmap": () => (/* binding */ PlanarHeatmap)
/* harmony export */ });
/* harmony import */ var _SurfaceShadingData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SurfaceShadingData */ "./extensions/DataVisualization/heatmap/SurfaceShadingData.js");
/* harmony import */ var _SurfaceShadingData__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_SurfaceShadingData__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var heatmap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! heatmap.js */ "./extensions/DataVisualization/node_modules/heatmap.js/build/heatmap.js");
/* harmony import */ var heatmap_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(heatmap_js__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _createForOfIteratorHelper(o, allowArrayLike) {var it;if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {if (it) o = it;var i = 0;var F = function F() {};return { s: F, n: function n() {if (i >= o.length) return { done: true };return { done: false, value: o[i++] };}, e: function e(_e) {throw _e;}, f: F };}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}var normalCompletion = true,didErr = false,err;return { s: function s() {it = o[Symbol.iterator]();}, n: function n() {var step = it.next();normalCompletion = step.done;return step;}, e: function e(_e2) {didErr = true;err = _e2;}, f: function f() {try {if (!normalCompletion && it.return != null) it.return();} finally {if (didErr) throw err;}} };}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === "string") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === "Object" && o.constructor) n = o.constructor.name;if (n === "Map" || n === "Set") return Array.from(o);if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}


var surfaceShadingOverlay = "DataVizPlanarHeatmap";var
PlanarHeatmap = /*#__PURE__*/function () {
  function PlanarHeatmap(viewer, model, shadingData) {var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};_classCallCheck(this, PlanarHeatmap);
    options = this._handleLegacyOptions(options);var _options =

    options,width = _options.width,height = _options.height,minOpacity = _options.minOpacity,maxOpacity = _options.maxOpacity;
    this.options = options;

    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    this.config = {
      canvas: canvas,
      width: width,
      height: height,
      minOpacity: minOpacity,
      maxOpacity: maxOpacity,
      radius: 20 };


    this.model = model;
    this.viewer = viewer;
    this.shadingData = shadingData;

    var texture = new THREE.Texture(canvas, THREE.UVMapping);
    texture.minFilter = THREE.LinearFilter;
    texture.flipY = false;

    this.material = new THREE.MeshBasicMaterial({
      map: texture,
      // color: 0xFFFF00FF,
      depthTest: true,
      depthWrite: false,
      transparent: true,
      side: THREE.DoubleSide });


    this.gradientMap = {};
  }

  /**
     * @private
     * 
     * For legacy client code, `slicingPosition` was provided as `position`,
     * while `placementPosition` was provided as `placePosition`. We do not
     * attempt to introduce the defaults for `position` and `placePosition`
     * anymore here so if those values are specified, they will be converted
     * to `slicingPosition` and `placementPosition` respectively.
     */_createClass(PlanarHeatmap, [{ key: "_handleLegacyOptions", value: function _handleLegacyOptions(
    options) {
      options = Object.assign(
      {
        width: 1024,
        height: 1024,
        slicingEnabled: true },

      options);


      if (typeof options.position === "string") {
        var values = { "min": 0.0, "middle": 0.5, "max": 1.0 };
        options.slicingPosition = values[options.position];
      }

      if (typeof options.placePosition === "string") {
        var _values = { "min": 0.0, "max": 1.0 };
        options.placementPosition = _values[options.placePosition];
      }

      // Remove legacy options.
      delete options.position;
      delete options.placePosition;

      function validateValueRange(value, defaultValue) {
        if (value === undefined || value === null) {
          return defaultValue;
        }

        if (typeof value !== "number") return defaultValue;
        if (value < 0.0) return 0.0; // Capped at minimum
        if (value > 1.0) return 1.0; // Capped at maximum
        return value; // Valid value stays unchanged
      }

      // If the above did not result in a valid `slicingPosition` or `placementPosition`,
      // then it means the client code did not use any legacy option, and did not supply
      // a value for these two options. We will use default values for them.
      //
      options.slicingPosition = validateValueRange(options.slicingPosition, 0.5);
      options.placementPosition = validateValueRange(options.placementPosition, 0.0);

      return options;
    }

    /**
       * Internal function, setup the heatmap instance and geometry with UV
       * @private
       * @param {String|[String]} nodeId - Shading data group id
       * @param {String} sensorType - Current Shading Sensor Type
       * @param {number} radius
       */ }, { key: "_setup", value: function _setup(
    nodeIds, sensorType) {var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;
      // cacluate the bounds for the shading area
      var model = this.model,shadingData = this.shadingData;
      var totalBounds = new THREE.Box3();
      var instanceTree = model.getInstanceTree();

      var leafs = [];
      var boundsMap = {};
      var dst = [];
      var pointDataMap = {};

      if (this.gradientMap[sensorType]) {
        this.config.gradient = this.gradientMap[sensorType];
      }
      this.config.radius = radius;


      function isLeafContainsSensor(leaf) {
        if (leaf.shadingPoints == null || leaf.shadingPoints &&
        leaf.shadingPoints.length == 0) {
          return false;
        }

        return !(leaf.shadingPoints.find(function (item) {return item.types.find(function (t) {return t == sensorType;});}) == null);
      }

      nodeIds.forEach(function (nodeId) {return shadingData.getLeafsById(nodeId, leafs);});

      // get the total bounds
      for (var i = 0; i < leafs.length; i++) {
        if (isLeafContainsSensor(leafs[i])) {
          leafs[i].dbIds.forEach(function (dbId) {
            instanceTree.getNodeBox(dbId, dst);

            if (dst[0] != Infinity) {
              var bound = new THREE.Box3(new THREE.Vector3(dst[0], dst[1], dst[2]), new THREE.Vector3(dst[3], dst[4], dst[5]));

              totalBounds.union(bound);
              boundsMap[dbId] = bound;
            }
          });
        }
      }

      var x0 = totalBounds.min.x;
      var y0 = totalBounds.min.y;
      var w0 = totalBounds.max.x - x0;
      var h0 = totalBounds.max.y - y0;

      // resize the canvas to keep the ratio constant
      var _this$options = this.options,slicingEnabled = _this$options.slicingEnabled,width = _this$options.width,height = _this$options.height;

      if (w0 > h0) {
        height = width / w0 * h0;
      } else {
        width = height / h0 * w0;
      }

      this.config.canvas.width = width;
      this.config.canvas.height = height;
      this.config.width = width;
      this.config.height = height;

      if (!this.heatmapInstance) {

        /** {@link https://www.patrick-wied.at/static/heatmapjs/docs.html} */
        // 'HeatmapJS requires a 'container' to be passed in the config (from which
        // computed styles are obtained by calling 'getComputedStyle' API). 
        // If it isn't passed in the library throws an exception. To satisfy that 
        // requirement, we create a dummy <div> element to avoid the crash.

        var container = document.createElement("div"); // Container for heatmap.js instance
        container.width = width;
        container.height = height;

        this.config.container = container;
        this.heatmapInstance = heatmap_js__WEBPACK_IMPORTED_MODULE_1___default().create(this.config);

        // Another side effect of 'h337.create()' is that it adds 'config.canvas'
        // as a child element of 'config.container'. That obviously is undesirable so 
        // here we remove the canvas from container, before removing the reference to 
        // 'config.container' to avoid resource leak.
        // 
        container.removeChild(this.config.canvas);
        delete this.config.container;
      } else {
        // Reuse the heatmap object so that it won't be disconnected
        // from the corresponding graphics resources (e.g. textures).
        this.heatmapInstance.configure(this.config);
      }

      // prepare for the geometry
      // make assumption that the geometry is not that complex, means more than 65536 vertices
      var positions = [];
      var uv = [];
      var indices = [];

      var cg = Autodesk.Viewing.Extensions.CompGeom;
      var slicingPosition = this.options.slicingPosition;
      var placementPosition = this.options.placementPosition;
      var frags = model.getFragmentList();

      for (var _i = 0; _i < leafs.length; _i++) {
        var currentLeafNode = leafs[_i];

        // Only process shading points with the matching sensor types.
        var matchingShadingPoints = (0,_SurfaceShadingData__WEBPACK_IMPORTED_MODULE_0__.filterShadingPointsByType)(
        currentLeafNode.shadingPoints,
        sensorType);


        if (matchingShadingPoints.length <= 0) {
          continue;
        }

        if (slicingEnabled) {var





          intersects;(function () {var normal = new THREE.Vector3(0, 0, 1); // assume we are doing only for simple geometry section
            // if we decide to support very complex geometry, we need put this process in Async style
            // mark this as TODO, don't want to over engineer this part until we have the request or hit performance threshold
            intersects = [];currentLeafNode.dbIds.forEach(function (dbId) {var bounds = boundsMap[dbId];var
              min = bounds.min,max = bounds.max;

              var zSlicing = min.z + (max.z - min.z) * slicingPosition;
              var zPlacement = min.z + (max.z - min.z) * placementPosition;

              var plane = new THREE.Plane(normal, -zSlicing);

              var toPlaneCoords = cg.makePlaneBasis(plane);

              var recursive = true;
              instanceTree.enumNodeFragments(dbId, function (fragId) {
                var m = frags.getVizmesh(fragId);
                if (m.geometry && !m.geometry.is2d && !m.geometry.isLines && m.material.cutplanes) {
                  cg.xMeshPlane(plane, m, intersects);
                }
              }, recursive);


              // now we have all the intersection points
              // Code Reference from SectionTool: updateCapMeshes
              var bbox = new THREE.Box3();
              cg.convertToPlaneCoords(toPlaneCoords, intersects, bbox);

              var eset = new cg.EdgeSet(intersects, bbox, bbox.getSize(new THREE.Vector3()).length() * 1e-6);
              eset.snapEdges();
              eset.sanitizeEdges();
              eset.stitchContours();

              //Create the 3D mesh
              var cset = eset.triangulate();

              // TODO: if required in future, the triangulate is not robuts, and it failed very frequently
              // If we need more robust way of doing the triangulation, we can spend more time on it
              // For simple room geometry, this is good enough
              if (cset && !cset.triangulationFailed) {
                var bg = cset.toPolygonMesh();

                var indexStart = positions.length / 3;

                var bgPosition = bg.attributes["position"].array;

                for (var j = 0, count = bgPosition.length; j < count; j += 3) {
                  positions.push(
                  bgPosition[j],
                  bgPosition[j + 1],
                  zPlacement);


                  uv.push(
                  (bgPosition[j] - x0) / w0,
                  (bgPosition[j + 1] - y0) / h0);

                }

                var bgIndices = bg.index.array;
                for (var _j = 0, _count = bgIndices.length; _j < _count; _j++) {
                  indices.push(bgIndices[_j] + indexStart);
                }
              }
            });})();

        } else {
          currentLeafNode.dbIds.forEach(function (dbId) {
            var bounds = boundsMap[dbId];

            if (!bounds.isEmpty()) {var
              min = bounds.min,max = bounds.max;
              var zPlacement = min.z + (max.z - min.z) * placementPosition;

              var index = positions.length / 3;

              indices.push(index, index + 2, index + 1, index, index + 3, index + 2);
              positions.push(
              min.x, min.y, zPlacement,
              min.x, max.y, zPlacement,
              max.x, max.y, zPlacement,
              max.x, min.y, zPlacement);


              uv.push(
              (min.x - x0) / w0, (min.y - y0) / h0,
              (min.x - x0) / w0, (max.y - y0) / h0,
              (max.x - x0) / w0, (max.y - y0) / h0,
              (max.x - x0) / w0, (min.y - y0) / h0);

            }
          });
        }

        // Only add shading point that matches the specific sensor type.
        var _iterator = _createForOfIteratorHelper(matchingShadingPoints),_step;try {for (_iterator.s(); !(_step = _iterator.n()).done;) {var point = _step.value;
            var pData = {
              x: Math.round((point.position.x - x0) / w0 * width), // in texture space: X, integer please!
              y: Math.round((point.position.y - y0) / h0 * height), // in texture space: Y, integer please!
              value: 0 };


            pointDataMap[point.id] = {
              data: pData,
              shadingPoint: point };

          }} catch (err) {_iterator.e(err);} finally {_iterator.f();}
      }

      positions = new Float32Array(positions);
      uv = new Float32Array(uv);
      indices = new Uint16Array(indices);

      // create the buffer geometry
      var geometry = new THREE.BufferGeometry();
      var positionAttribute = new THREE.BufferAttribute(positions, 3);
      positionAttribute.bytesPerItem = 4;

      var uvAttribute = new THREE.BufferAttribute(uv, 2);
      uvAttribute.bytesPerItem = 4;

      var indexAttribute = new THREE.BufferAttribute(indices, 1);

      geometry.setIndex(indexAttribute);
      geometry.setAttribute("position", positionAttribute);
      geometry.setAttribute("uv", uvAttribute);



      // 
      this.geometry = geometry;
      var viewerImp = this.viewer.impl;
      viewerImp.createOverlayScene(surfaceShadingOverlay);

      var mesh = new THREE.Mesh(geometry, this.material);
      viewerImp.addOverlay(surfaceShadingOverlay, mesh);

      this.totalBounds = totalBounds;
      this.pointDataMap = pointDataMap;
      this.currentSensorType = sensorType;
    }

    /**
       * Renders one or more nodes with the given identifiers. This call creates
       * necessary resources like overlay scene and materials, therefore is by 
       * design to be called only when necessary (i.e., when surface shading needs
       * to be updated due to geometry changes). For more light weight rendering,
       * updateShading API should be used instead.
       * 
       * @param {string|string[]} nodeId One or more identifiers of nodes
       * to render. These identifiers are among the ones provided through
       * SurfaceShadingData when the SurfaceShading object is constructed.
       * @param {string} sensorType The type of sensor to render the shading for.
       * @param {SensorValueCallback} sensorValueCallback The callback function that
       * will be invoked when SurfaceShading requires the sensor value to render.
       * @param {HeatmapConfig} [heatmapConfig] Optional. The configuration of the
       * heatmap. See documentation for `HeatmapConfig` for more details.
       */ }, { key: "render", value: function render(
    nodeIds, sensorType, sensorValueCallback, heatmapConfig) {
      // See `SurfaceShading.render()` function for more details on how 
      // backward compatibility is being maintained with the following checks.
      //
      var confidenceSize = 200.0;
      if (typeof heatmapConfig === "number") {
        confidenceSize = Math.abs(heatmapConfig);
      } else if (_typeof(heatmapConfig) === "object") {
        if (heatmapConfig.confidence) {
          confidenceSize = heatmapConfig.confidence;
        }
      }

      if (this.geometry) {
        this.geometry.dispose();
        this.geometry = null;
      }

      nodeIds = nodeIds instanceof Array ? nodeIds : [nodeIds];
      this._setup(nodeIds, sensorType, confidenceSize);

      this.updateShading(sensorValueCallback);
    }

    /**
       * This function is useful when in timeline triggered replay scenario
       *
       * @param {SensorValueCallback} sensorValueCallback Return a sensor value for the time context
       */ }, { key: "updateShading", value: function updateShading(
    sensorValueCallback) {
      var dataPoints = [];

      for (var key in this.pointDataMap) {
        var point = this.pointDataMap[key];

        // Pass the data in, in case user want to change the radius
        var value = sensorValueCallback(
        point.shadingPoint,
        this.currentSensorType,
        point.data);


        // Heatmap.js does not handle absolute `0.0` well (it treats it as
        // max value), it needs to be bumped slightly above `0.0` for it to
        // work correctly. Also, value of `NaN` will now be excluded from 
        // contributing to the heatmap.
        // 
        point.data.value = value === 0.0 ? 0.0001 : value;
        if (!isNaN(point.data.value)) {
          dataPoints.push(point.data);
        }
      }

      this.heatmapInstance.setData({ data: dataPoints, min: 0.0, max: 1.0 });

      this.material.map.needsUpdate = true;
      this.viewer.impl.invalidate(false, false, true);
    }

    /**
       * Cleans up overlay used for the surface shading, as well as the materials
       * created to render surface shading.
       */ }, { key: "cleanUp", value: function cleanUp()
    {
      this.removeShading();

      if (this.geometry) {
        this.geometry.dispose();
        this.geometry = null;
      }

      if (this.material) {
        this.material.dispose();
        this.material = null;
      }
    }

    /**
       * Removes any surface shading created by clearing the overlay which holds
       * the meshes used as heatmap representation. Note that this call does not
       * release other resources like materials created.
       */ }, { key: "removeShading", value: function removeShading()
    {
      this.viewer.impl.removeOverlayScene(surfaceShadingOverlay);
      this.viewer.impl.invalidate(false, false, true);
    }


    /**
       *
       * @param {string} sensorType
       * @param {number[]} colors
       */ }, { key: "registerSensorColors", value: function registerSensorColors(
    sensorType, colors) {
      var gradient = {};
      var size = colors.length - 1;

      function intToRGB(color) {
        var b = color & 0xFF;
        var g = color >> 8 & 0xFF;
        var r = color >> 16 & 0xFF;

        return "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")");
      }

      for (var i = 0; i < colors.length; i++) {
        gradient[(i / size).toFixed(3)] = intToRGB(colors[i]);
      }

      this.gradientMap[sensorType] = gradient;
    } }]);return PlanarHeatmap;}();




/***/ }),

/***/ "./extensions/DataVisualization/heatmap/SurfaceShading.js":
/*!****************************************************************!*\
  !*** ./extensions/DataVisualization/heatmap/SurfaceShading.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SurfaceShading": () => (/* binding */ SurfaceShading)
/* harmony export */ });
/* harmony import */ var _HeatmapMaterial__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HeatmapMaterial */ "./extensions/DataVisualization/heatmap/HeatmapMaterial.js");
/* harmony import */ var _SurfaceShadingData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SurfaceShadingData */ "./extensions/DataVisualization/heatmap/SurfaceShadingData.js");
/* harmony import */ var _SurfaceShadingData__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_SurfaceShadingData__WEBPACK_IMPORTED_MODULE_1__);
function _createForOfIteratorHelper(o, allowArrayLike) {var it;if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {if (it) o = it;var i = 0;var F = function F() {};return { s: F, n: function n() {if (i >= o.length) return { done: true };return { done: false, value: o[i++] };}, e: function e(_e) {throw _e;}, f: F };}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}var normalCompletion = true,didErr = false,err;return { s: function s() {it = o[Symbol.iterator]();}, n: function n() {var step = it.next();normalCompletion = step.done;return step;}, e: function e(_e2) {didErr = true;err = _e2;}, f: function f() {try {if (!normalCompletion && it.return != null) it.return();} finally {if (didErr) throw err;}} };}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === "string") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === "Object" && o.constructor) n = o.constructor.name;if (n === "Map" || n === "Set") return Array.from(o);if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}



var surfaceShadingOverlay = "DataVizSurfaceShading";
var LARGE_FLOAT = 9999999.9;
var avp = Autodesk.Viewing.Private;var

SurfaceShading = /*#__PURE__*/function () {
  /**
                                            * Constructs an instance of SurfaceShading object based on the given model
                                            * and shading data.
                                            *
                                            * @param {GUIViewer3D} viewer The viewer in which SurfaceShading is created.
                                            * @param {Model} model The model based on which SurfaceShading is created.
                                            * @param {SurfaceShadingData} shadingData The data for SurfaceShading.
                                            */
  function SurfaceShading(viewer, model, shadingData) {_classCallCheck(this, SurfaceShading);
    this.viewer = viewer;
    this.model = model;
    this.shadingData = shadingData;

    this.activeShadingPoints = [];
    this.settings = {};

    // TODO: These are to be defined by client code based on device/property combinations.
    this.registerSensorColors("hatchPattern", [0xffffff, 0xffffff], 0.7);
    this.registerSensorColors("__defaultSensor__", [0x0000ff, 0x00ff00, 0xffff00, 0xff0000], 0.7);
  }

  /**
     * Removes any surface shading created by clearing the overlay which holds
     * the meshes used as heatmap representation. Note that this call does not
     * release other resources like materials created.
     */_createClass(SurfaceShading, [{ key: "removeShading", value: function removeShading()
    {
      this.viewer.impl.removeOverlayScene(surfaceShadingOverlay);
      this.viewer.impl.invalidate(false, false, true);
    }

    /**
       * Cleans up overlay used for the surface shading, as well as the materials
       * created to render surface shading.
       */ }, { key: "cleanUp", value: function cleanUp()
    {
      this.removeShading();
      this._clearActiveShadingPoints();

      if (this.hatchMaterial) {
        this.hatchMaterial.dispose();
        delete this.hatchMaterial;
      }
    } }, { key: "_clearActiveShadingPoints", value: function _clearActiveShadingPoints()

    {
      this.activeShadingPoints.forEach(function (s) {return s.heatmapMaterial.dispose();});
      this.activeShadingPoints = [];
    } }, { key: "_createHatchMaterial", value: function _createHatchMaterial()

    {
      var setting = this.settings["hatchPattern"];
      var material = new _HeatmapMaterial__WEBPACK_IMPORTED_MODULE_0__.HeatmapMaterial(
      [new THREE.Vector4(LARGE_FLOAT, LARGE_FLOAT, LARGE_FLOAT, -1)],
      setting.colors,
      setting.stops,
      60,
      2.0,
      setting.alpha);


      return material;
    }

    /**
       *
       * @param {string} sensorType
       * @param {number[]} colors
       * @param {number} alpha Alpha channel of the heatmap
       */ }, { key: "registerSensorColors", value: function registerSensorColors(
    sensorType, colors) {var alpha = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.7;
      this.settings[sensorType] = {
        stops: (0,_HeatmapMaterial__WEBPACK_IMPORTED_MODULE_0__.createColorStops)(colors.length),
        colors: colors.
        map(function (c) {return new THREE.Color(c);}).
        map(function (color) {return new THREE.Vector3(color.r, color.g, color.b);}),
        alpha: alpha };

    } }, { key: "getSetting", value: function getSetting(

    sensorType) {
      if (this.settings[sensorType]) {
        return this.settings[sensorType];
      } else {
        return this.settings["__defaultSensor__"];
      }
    }

    /**
       * Renders one or more nodes with the given identifiers. This call creates
       * necessary resources like overlay scene and materials, therefore is by
       * design to be called only when necessary (i.e., when surface shading needs
       * to be updated due to geometry changes). For more light weight rendering,
       * `updateShading` API should be used instead.
       *
       * @param {string|string[]} nodeId One or more identifiers of nodes
       *  to render. These identifiers are among the ones provided through
       *  SurfaceShadingData when the SurfaceShading object is constructed.
       * @param {string} sensorType The type of sensor to render the shading for.
       * @param {SensorValueCallback} sensorValueCallback The callback function that
       *  will be invoked when SurfaceShading requires the sensor value to render.
       * @param {HeatmapConfig} [heatmapConfig] Optional. The configuration of the
       * heatmap. See documentation for `HeatmapConfig` for more details.
       */ }, { key: "render", value: function render(
    nodeId, sensorType, sensorValueCallback, heatmapConfig) {var _this = this;
      // sanitize the input, make sure confidenceSize is positive number when it exists
      var confidenceSize = heatmapConfig ? heatmapConfig.confidence : 0;
      confidenceSize = !isNaN(confidenceSize) ? Math.abs(confidenceSize) : 0;

      // Defaulting `powerParameter` to `2.0`
      var powerParameter = 2.0;
      if (heatmapConfig && typeof heatmapConfig.powerParameter === "number") {
        powerParameter = heatmapConfig.powerParameter;
      }

      /** @type {SurfaceShadingNode[]} */
      var nodes = [];
      if (nodeId instanceof Array) {
        nodeId.forEach(function (id) {return _this.shadingData.getLeafsById(id, nodes);});
      } else {
        nodes = this.shadingData.getLeafsById(nodeId);
      }

      var it = this.model.getInstanceTree();
      this._clearActiveShadingPoints();

      var viewerImp = this.viewer.impl;
      var activeShadingPoints = this.activeShadingPoints;

      viewerImp.createOverlayScene(surfaceShadingOverlay);
      if (!this.hatchMaterial) {
        this.hatchMaterial = this._createHatchMaterial();
      }

      function addMeshToOverlay(fragId, material) {
        // add geometry into the overlay
        var geometry = it.fragList.getGeometry(fragId);
        if (!geometry) {
          avp.logger.error("Geometry for the fragment is empty, FragId:", fragId);
          return;
        }
        var mesh = new THREE.Mesh(geometry, material);
        var m = new THREE.Matrix4();
        it.fragList.getWorldMatrix(fragId, m);

        mesh.matrix.copy(m);
        mesh.matrixWorldNeedsUpdate = true;
        mesh.matrixAutoUpdate = false;
        mesh.frustumCulled = false;

        viewerImp.addOverlay(surfaceShadingOverlay, mesh);
      }

      var settingsForSensorType = this.getSetting(sensorType);var _loop = function _loop(

      i) {
        var node = nodes[i];
        var shadingPoints = (0,_SurfaceShadingData__WEBPACK_IMPORTED_MODULE_1__.filterShadingPointsByType)(node.shadingPoints, sensorType);

        // Set default material to hatch material type which allows fragments
        // without any shading point to render with a hatch pattern. If there
        // are any associated shading points, then this material will be set
        // to the newly created `HeatmapMaterial` with actual sensor values.
        //
        var heatmapMaterial = _this.hatchMaterial;

        if (shadingPoints.length > 0) {
          var confidence = confidenceSize;

          // Caculate the confidence value if node.bounds exists
          if (node.bounds && !confidenceSize) {
            var bmax = node.bounds.max;
            var bmin = node.bounds.min;
            confidence = bmax.x - bmin.x + (bmax.y - bmin.y) + (bmax.z - bmin.z);
          }

          confidence = confidence || 160;

          /** @type {THREE.Vector4[]} */
          var sensorValues = [];

          // render the sufaceMap with current sensor value
          shadingPoints.forEach(function (shadingPoint) {
            var p = shadingPoint.position;
            var value = sensorValueCallback(shadingPoint, sensorType);
            var sensorValue = new THREE.Vector4(p.x, p.y, p.z, value);

            sensorValues.push(sensorValue);
          });

          heatmapMaterial = new _HeatmapMaterial__WEBPACK_IMPORTED_MODULE_0__.HeatmapMaterial(
          sensorValues,
          settingsForSensorType.colors,
          settingsForSensorType.stops,
          confidence,
          powerParameter,
          settingsForSensorType.alpha);


          activeShadingPoints.push({
            shadingPoints: shadingPoints,
            sensorType: sensorType,
            heatmapMaterial: heatmapMaterial });

        }

        // Add a mesh per fragment for the current `SurfaceShadingNode`, with
        // and without `SurfaceShadingPoint` (those nodes without valid shading 
        // points will simply be rendered as white colored, hatched volume).
        // 
        node.fragIds.forEach(function (fragId) {return addMeshToOverlay(fragId, heatmapMaterial);});};for (var i = 0; nodes && i < nodes.length; i++) {_loop(i);
      }
    }

    /**
       * This function is meant to update heatmap rapidly without recreation
       * of the underlying materials. It is useful for scenarios where frequent
       * redraw of the heatmap is necessary (e.g. playback of timeline control).
       *
       * @param {SensorValueCallback} sensorValueCallback Return a sensor value
       * for the time context
       * @param {HeatmapConfig} [heatmapConfig] Optional. The configuration of
       * the heatmap. See documentation for `HeatmapConfig` for more details.
       */ }, { key: "updateShading", value: function updateShading(
    sensorValueCallback, heatmapConfig) {
      var confidence, powerParameter, alpha;
      if (heatmapConfig) {
        confidence = heatmapConfig.confidence;
        powerParameter = heatmapConfig.powerParameter;
        alpha = heatmapConfig.alpha;
      }

      for (var i = 0; i < this.activeShadingPoints.length; i++) {var _this$activeShadingPo =
        this.activeShadingPoints[i],shadingPoints = _this$activeShadingPo.shadingPoints,sensorType = _this$activeShadingPo.sensorType,heatmapMaterial = _this$activeShadingPo.heatmapMaterial;
        var sensorValue = [];var _iterator = _createForOfIteratorHelper(

        shadingPoints),_step;try {for (_iterator.s(); !(_step = _iterator.n()).done;) {var shadingPoint = _step.value;
            var p = shadingPoint.position;
            var value = sensorValueCallback(shadingPoint, sensorType);
            sensorValue.push(new THREE.Vector4(p.x, p.y, p.z, value));
          }} catch (err) {_iterator.e(err);} finally {_iterator.f();}

        heatmapMaterial.update(sensorValue, confidence, powerParameter, alpha);
      }

      this.viewer.impl.invalidate(false, false, true);
    } }]);return SurfaceShading;}();




/***/ }),

/***/ "./extensions/DataVisualization/heatmap/SurfaceShadingData.js":
/*!********************************************************************!*\
  !*** ./extensions/DataVisualization/heatmap/SurfaceShadingData.js ***!
  \********************************************************************/
/***/ ((module) => {

function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * Generic Data Structure to enable the Heatmap/SurfaceShading
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       */

/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * A `SurfaceShadingPoint` object is used to represent a real-world entity that
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * has a physical position within the model. A `SurfaceShadingPoint` contains
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * one or more properties. Surface shading (i.e. heatmap) mechanism queries
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * values of these properties in order to determine the color of the point where
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * this `SurfaceShadingPoint` object is located.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * For an example, consider an IoT scenario of a physical sensor device, one that
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * occupies a physical location and exposes multiple sensor properties (such as
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * "temperature" and "humidity"), each of which has its own numeric values.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * In this scenario, a `SurfaceShadingPoint` can be used to represent the physical
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * sensor device, where properties such as "temperature" and "humidity" are `types`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * defined in the `SurfaceShadingPoint` object.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * @class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * @memberof Autodesk.DataVisualization.Core
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * @alias Autodesk.DataVisualization.Core.SurfaceShadingPoint
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           */var
SurfaceShadingPoint = /*#__PURE__*/function () {"use strict";
  /**
                                                               * Constructs an instance of `SurfaceShadingPoint` object.
                                                               *
                                                               * @param {string} id The identifier of this `SurfaceShadingPoint` object.
                                                               * @param {{x:number, y: number, z: number}} position The position of
                                                               *  this `SurfaceShadingPoint` object in the world space.
                                                               * @param {string[]} types The types (of sensors, or properties) that are
                                                               *  exposed by this `SurfaceShadingPoint` object.
                                                               * @param {string} [name]  Optional identifier associated with
                                                               *  this `SurfaceShadingPoint` object. Equivalent to `id` by default.
                                                               * @param {Object} [contextData] Optional object used to track any
                                                               *  additional information for this `SurfaceShadingPoint` object.
                                                               *
                                                               * @example
                                                               *  const sensorId = "cafeteria-entrace-01";
                                                               *  const position = { x: -159.2780, y: -50.4998, z: -16.9196 };
                                                               *  const types = ["temperature", "humidity"];
                                                               *
                                                               *  const shadingPoint = new Autodesk.DataVisualization.Core.SurfaceShadingPoint(
                                                               *      sensorId, position, types);
                                                               */
  function SurfaceShadingPoint(id, position, types) {var name = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : id;var contextData = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};_classCallCheck(this, SurfaceShadingPoint);
    this.id = id;
    this.position = position;
    this.types = types;
    this.name = name;
    this.contextData = contextData;

    this.dbId = null;
  }

  /**
     * Derives the position of a `SurfaceShadingPoint` from a given `DbId`.
     * The position is calculated by taking the centroid of the union of all the
     * geometry bounding boxes that this `DbId` corresponds to. This function is
     * useful if a position is not supplied at the construction time.
     *
     * @param {Model} model The model that contains the given `DbId`.
     * @param {number} dbId The `DbId` of the object to derive the center point from.
     *
     * @alias Autodesk.DataVisualization.Core.SurfaceShadingPoint#positionFromDBId
     *
     * @example
     *  const sensorId = "cafeteria-entrace-01";
     *  const types = ["temperature", "humidity"];
     *
     *  // Position of the shading point is unknown at construction time
     *  const shadingPoint = new Autodesk.DataVisualization.Core.SurfaceShadingPoint(
     *      sensorId, undefined, types);
     *
     *  shadingPoint.positionFromDBId(model, sensorDbId);
     */_createClass(SurfaceShadingPoint, [{ key: "positionFromDBId", value: function positionFromDBId(
    model, dbId) {
      var it = model.getData().instanceTree;
      var bounds = new THREE.Box3();
      var fragBounds = new THREE.Box3();
      var fragList = model.getFragmentList();
      this.dbId = dbId;

      it.enumNodeFragments(
      dbId,
      function (fragId) {
        // get the center of this fragId
        fragList.getWorldBounds(fragId, fragBounds);
        bounds.union(fragBounds);
      },
      true);


      this.position = bounds.getCenter(new THREE.Vector3()) || this.position;
    } }]);return SurfaceShadingPoint;}();


/**
                                           * A basic rendering unit that represents one or more `DbId`, each corresponds
                                           * to a geometry.
                                           *
                                           * @class
                                           * @memberof Autodesk.DataVisualization.Core
                                           * @alias Autodesk.DataVisualization.Core.SurfaceShadingNode
                                           */var
SurfaceShadingNode = /*#__PURE__*/function () {"use strict";
  /**
                                                              * Constructs an instance of `SurfaceShadingNode` object that represents a
                                                              * basic rendering unit. A `SurfaceShadingNode` contains one or more `DbId`,
                                                              * each corresponds a geometry.
                                                              *
                                                              * @param {string} id The identifier of this `SurfaceShadingNode` object.
                                                              * @param {(number|number[])} dbIds A `DbId` or an array of `DbIds`, each of
                                                              * which represents a geometry that will be rendered when the `SurfaceShadingNode`
                                                              * is included in calls to `renderSurfaceShading` or `updateSurfaceShading` APIs.
                                                              * @param {SurfaceShadingPoint[]} shadingPoints An optional array
                                                              * of `SurfaceShadingPoint` objects.
                                                              * @param {string} [name] Optional identifier associated with
                                                              * this `SurfaceShadingNode` object. Equivalent to `id` by default.
                                                              *
                                                              * @example
                                                              *  const id = "engine-cylinder-02";
                                                              *  const dbIds = [1060, 1062, 1064, 1065]; // Objects to be shaded together as one.
                                                              *  const shadingNode = new Autodesk.DataVisualization.Core.SurfaceShadingNode(id, dbIds);
                                                              *
                                                              *  const vibrationSensor02 = new Autodesk.DataVisualization.Core.SurfaceShadingPoint(...);
                                                              *  shadingNode.addPoint(vibrationSensor02); // Associate a sensor to the cylinder.
                                                              *
                                                              *  // User selects to visualize one cylinder from the UI
                                                              *  onEngineCylinderSelected(cylinderName) {
                                                              *      const sensorType = "vibration";
                                                              *      const confidenceSize = 300;
                                                              *
                                                              *      // 'cylinderName' can be "engine-cylinder-02"
                                                              *      dataVizExt.renderSurfaceShading([cylinderName],
                                                              *          sensorType, getSensorValue, confidenceSize);
                                                              *  }
                                                              */
  function SurfaceShadingNode(id, dbIds, shadingPoints) {var name = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : id;_classCallCheck(this, SurfaceShadingNode);
    if (typeof dbIds == "number") {
      dbIds = [dbIds];
    }

    this.dbIds = dbIds;
    this.shadingPoints = shadingPoints || [];
    this.isLeaf = true;
    this.fragIds = [];
    this.id = id;
    this.name = name;
    this.bounds = new THREE.Box3();
  }

  /**
     * Adds a `SurfaceShadingPoint` object to the `SurfaceShadingNode` object.
     *
     * @param {SurfaceShadingPoint} point The `SurfaceShadingPoint` object to be
     * added to the `SurfaceShadingNode` object.
     *
     * @alias Autodesk.DataVisualization.Core.SurfaceShadingNode#addPoint
     */_createClass(SurfaceShadingNode, [{ key: "addPoint", value: function addPoint(
    point) {
      this.shadingPoints.push(point);
    }

    /**
       * @private
       * Updates the `SurfaceShadingNode` object by storing the fragment IDs that
       * are found for each of its dbIds list.
       *
       * @param {Model} model The model from which fragment IDs are to be obtained.
       *
       * @alias Autodesk.DataVisualization.Core.SurfaceShadingNode#update
       */ }, { key: "update", value: function update(
    model) {var _this = this;
      var it = model.getData().instanceTree;
      var hashSet = new Set(this.fragIds);
      var fragBounds = new THREE.Box3();
      var fragList = model.getFragmentList();

      var recursive = true;
      this.dbIds.forEach(function (dbId) {
        it.enumNodeFragments(dbId, function (fragId) {
          if (!hashSet.has(fragId)) {
            _this.fragIds.push(fragId);
            fragList.getWorldBounds(fragId, fragBounds);
            _this.bounds.union(fragBounds);
          }
        }, recursive);
      });
    } }]);return SurfaceShadingNode;}();


/**
                                          * A grouping data structure that allows rendering units to be
                                          * organized in a hierarchical manner. It can contain zero or more
                                          * sub-groups and/or `SurfaceShadingNode` leaf nodes as child.
                                          *
                                          * @class
                                          * @memberof Autodesk.DataVisualization.Core
                                          * @alias Autodesk.DataVisualization.Core.SurfaceShadingGroup
                                          */var
SurfaceShadingGroup = /*#__PURE__*/function () {"use strict";
  /**
                                                               * Constructs an instance of `SurfaceShadingGroup` object.
                                                               *
                                                               * @param {string} id The identifier of the group.
                                                               * @param {string} [name]  Optional identifier associated with this `SurfaceShadingGroup` object. Equivalent to id by default.
                                                               * @example
                                                               *  const cylinders = [
                                                               *      new Autodesk.DataVisualization.Core.SurfaceShadingNode("engine-cylinder-00", ...),
                                                               *      new Autodesk.DataVisualization.Core.SurfaceShadingNode("engine-cylinder-01", ...),
                                                               *      new Autodesk.DataVisualization.Core.SurfaceShadingNode("engine-cylinder-02", ...),
                                                               *      new Autodesk.DataVisualization.Core.SurfaceShadingNode("engine-cylinder-03", ...),
                                                               *  ];
                                                               *
                                                               *  const groupName = "front-cylinders";
                                                               *  const frontCylinders = new Autodesk.DataVisualization.Core.SurfaceShadingGroup(groupName);
                                                               *  cylinders.forEach(cylinder => frontCylinders.addChild(cylinder));
                                                               *
                                                               *  // User selects to visualize a group of cylinders from the UI
                                                               *  onEngineCylinderGroupSelected(cylinderGroupName) {
                                                               *      const sensorType = "vibration";
                                                               *      const confidenceSize = 300;
                                                               *
                                                               *      // 'cylinderGroupName' can be "front-cylinders"
                                                               *      dataVizExt.renderSurfaceShading([cylinderGroupName],
                                                               *          sensorType, getSensorValue, confidenceSize);
                                                               *  }
                                                               */
  function SurfaceShadingGroup(id) {var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : id;_classCallCheck(this, SurfaceShadingGroup);
    this.id = id;
    this._children = [];
    this.isGroup = true;
    this.name = name;
  }

  /**
     * The child nodes, each of which is either another shading group, or a
     * shading leaf node.
     * @returns {SurfaceShadingGroup[]|SurfaceShadingNode[]} The child nodes,
     * each of which is either another shading group, or a shading leaf node.
     */_createClass(SurfaceShadingGroup, [{ key: "addChild",




    /**
                                                              * Adds a child node to the shading group.
                                                              *
                                                              * @param {SurfaceShadingGroup|SurfaceShadingNode} child The
                                                              * child node to be added to the shading group. A child node can
                                                              * either be another `SurfaceShadingGroup`, or `SurfaceShadingNode`.
                                                              *
                                                              * @alias Autodesk.DataVisualization.Core.SurfaceShadingGroup#addChild
                                                              */value: function addChild(
    child) {
      this.children.push(child);
    }

    /**
       * @private
       * Recursively updates all the leaf nodes.
       * @param {Model} model The model from which fragment IDs are to be obtained.
       * @alias Autodesk.DataVisualization.Core.SurfaceShadingGroup#update
       */ }, { key: "update", value: function update(
    model) {
      this.children.forEach(function (child) {return child.update(model);});
    }

    /**
       * @private
       * For internal use only. Retrieves all the leaf nodes of a shading group,
       * or a particular leaf node with the given identifier.
       *
       * @param {string} id The identifier of the leaf node to retrieve.
       * @param {SurfaceShadingNode[]} results The input/output result list of
       * SurfaceShadingNode that matches the search criteria.
       * @returns {SurfaceShadingNode[]} The resulting list of SurfaceShadingNode
       * that matches the search criteria.
       *
       * @alias Autodesk.DataVisualization.Core.SurfaceShadingGroup#getLeafsById
       */ }, { key: "getLeafsById", value: function getLeafsById(
    id, results) {
      results = results || [];

      for (var i = 0; i < this.children.length; i++) {
        var child = this.children[i];
        if (child.id === id) {
          if (child.isLeaf) {
            results.push(child);
          } else if (child.isGroup) {
            child.getChildLeafs(results);
          }
        } else if (child.isGroup) {
          child.getLeafsById(id, results);
        }
      }

      return results;
    }

    /**
       *
       * Find a child node by matching the id
       *
       * @param {string} id node id
       * @returns {SurfaceShadingGroup|SurfaceShadingNode}
       */ }, { key: "getNodeById", value: function getNodeById(
    id) {
      for (var i = 0; i < this.children.length; i++) {
        var child = this.children[i];
        if (child.id === id) {
          return child;
        } else if (child.isGroup) {
          var result = child.getNodeById(id);
          if (result) {
            return result;
          }
        }
      }
    }

    /**
       * @private
       * For internal use only. Recursively retrieves all the leaf nodes
       * of this shading group.
       *
       * @param {SurfaceShadingNode[]} results The resulting list of all
       * the leaf nodes. This call always appends leaf nodes into the
       * parameter without first clearing any existing entries in results.
       *
       * @alias Autodesk.DataVisualization.Core.SurfaceShadingGroup#getChildLeafs
       */ }, { key: "getChildLeafs", value: function getChildLeafs(
    results) {
      for (var i = 0; i < this.children.length; i++) {
        var child = this.children[i];
        if (child.isLeaf) {
          results.push(child);
        } else if (child.isGroup) {
          child.getChildLeafs(results);
        }
      }
    } }, { key: "children", get: function get() {return this._children;} }]);return SurfaceShadingGroup;}();


/**
                                                                                                              * Data that describes the hierarchical object relationship the surface shading is based on.
                                                                                                              *
                                                                                                              * @class
                                                                                                              * @memberof Autodesk.DataVisualization.Core
                                                                                                              * @alias Autodesk.DataVisualization.Core.SurfaceShadingData
                                                                                                              */var
SurfaceShadingData = /*#__PURE__*/function (_SurfaceShadingGroup) {"use strict";_inherits(SurfaceShadingData, _SurfaceShadingGroup);var _super = _createSuper(SurfaceShadingData);function SurfaceShadingData() {_classCallCheck(this, SurfaceShadingData);return _super.apply(this, arguments);}_createClass(SurfaceShadingData, [{ key: "initialize",
    /**
                                                                                                                                                                                                                                                                                                                                                         * Initialize the `SurfaceShadingData` object so that it can be used as an
                                                                                                                                                                                                                                                                                                                                                         * input to `setupSurfaceShading` API.
                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                         * @param {Model} model The model to initialize the surface shading for.
                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                         * @alias Autodesk.DataVisualization.Core.SurfaceShadingData#initialize
                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                         * @example
                                                                                                                                                                                                                                                                                                                                                         *  const id = "engine-cylinder-02";
                                                                                                                                                                                                                                                                                                                                                         *  const dbIds = [1060, 1062, 1064, 1065]; // Objects to be shaded together as one.
                                                                                                                                                                                                                                                                                                                                                         *  const shadingNode = new Autodesk.DataVisualization.Core.SurfaceShadingNode(id, dbIds);
                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                         *  const vibrationSensor02 = new Autodesk.DataVisualization.Core.SurfaceShadingPoint(...);
                                                                                                                                                                                                                                                                                                                                                         *  shadingNode.addPoint(vibrationSensor02); // Associate a sensor to the cylinder.
                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                         *  const shadingData = new Autodesk.DataVisualization.Core.SurfaceShadingData();
                                                                                                                                                                                                                                                                                                                                                         *  shadingData.addChild(shadingNode);
                                                                                                                                                                                                                                                                                                                                                         *  shadingData.initialize(model);
                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                         *  dataVizExt.setupSurfaceShading(model, shadingData);
                                                                                                                                                                                                                                                                                                                                                         */value: function initialize(
    model) {
      this.update(model);
    } }]);return SurfaceShadingData;}(SurfaceShadingGroup);


/**
                                                             * Filters out shading points that expose the specified sensor type.
                                                             *
                                                             * @param {SurfaceShadingPoint[]} shadingPoints The shading points to filter from.
                                                             * @param {string} sensorType The type of sensors to filter device with.
                                                             * @returns {SurfaceShadingPoint[]} The shading points that expose the given sensor type.
                                                             */
function filterShadingPointsByType(shadingPoints, sensorType) {
  shadingPoints = shadingPoints || [];
  return shadingPoints.filter(function (d) {return d.types && d.types.includes(sensorType);});
}

module.exports = {
  SurfaceShadingData: SurfaceShadingData,
  SurfaceShadingGroup: SurfaceShadingGroup,
  SurfaceShadingNode: SurfaceShadingNode,
  SurfaceShadingPoint: SurfaceShadingPoint,
  filterShadingPointsByType: filterShadingPointsByType };

/***/ }),

/***/ "./extensions/DataVisualization/node_modules/heatmap.js/build/heatmap.js":
/*!*******************************************************************************!*\
  !*** ./extensions/DataVisualization/node_modules/heatmap.js/build/heatmap.js ***!
  \*******************************************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
 * heatmap.js v2.0.5 | JavaScript Heatmap Library
 *
 * Copyright 2008-2016 Patrick Wied <heatmapjs@patrick-wied.at> - All rights reserved.
 * Dual licensed under MIT and Beerware license 
 *
 * :: 2016-09-05 01:16
 */
;(function (name, context, factory) {

  // Supports UMD. AMD, CommonJS/Node.js and browser context
  if ( true && module.exports) {
    module.exports = factory();
  } else if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

})("h337", this, function () {

  // Heatmap Config stores default values and will be merged with instance config
  var HeatmapConfig = {
    defaultRadius: 40,
    defaultRenderer: 'canvas2d',
    defaultGradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)" },
    defaultMaxOpacity: 1,
    defaultMinOpacity: 0,
    defaultBlur: .85,
    defaultXField: 'x',
    defaultYField: 'y',
    defaultValueField: 'value',
    plugins: {} };

  var Store = function StoreClosure() {

    var Store = function Store(config) {
      this._coordinator = {};
      this._data = [];
      this._radi = [];
      this._min = 10;
      this._max = 1;
      this._xField = config['xField'] || config.defaultXField;
      this._yField = config['yField'] || config.defaultYField;
      this._valueField = config['valueField'] || config.defaultValueField;

      if (config["radius"]) {
        this._cfgRadius = config["radius"];
      }
    };

    var defaultRadius = HeatmapConfig.defaultRadius;

    Store.prototype = {
      // when forceRender = false -> called from setData, omits renderall event
      _organiseData: function _organiseData(dataPoint, forceRender) {
        var x = dataPoint[this._xField];
        var y = dataPoint[this._yField];
        var radi = this._radi;
        var store = this._data;
        var max = this._max;
        var min = this._min;
        var value = dataPoint[this._valueField] || 1;
        var radius = dataPoint.radius || this._cfgRadius || defaultRadius;

        if (!store[x]) {
          store[x] = [];
          radi[x] = [];
        }

        if (!store[x][y]) {
          store[x][y] = value;
          radi[x][y] = radius;
        } else {
          store[x][y] += value;
        }
        var storedVal = store[x][y];

        if (storedVal > max) {
          if (!forceRender) {
            this._max = storedVal;
          } else {
            this.setDataMax(storedVal);
          }
          return false;
        } else if (storedVal < min) {
          if (!forceRender) {
            this._min = storedVal;
          } else {
            this.setDataMin(storedVal);
          }
          return false;
        } else {
          return {
            x: x,
            y: y,
            value: value,
            radius: radius,
            min: min,
            max: max };

        }
      },
      _unOrganizeData: function _unOrganizeData() {
        var unorganizedData = [];
        var data = this._data;
        var radi = this._radi;

        for (var x in data) {
          for (var y in data[x]) {

            unorganizedData.push({
              x: x,
              y: y,
              radius: radi[x][y],
              value: data[x][y] });


          }
        }
        return {
          min: this._min,
          max: this._max,
          data: unorganizedData };

      },
      _onExtremaChange: function _onExtremaChange() {
        this._coordinator.emit('extremachange', {
          min: this._min,
          max: this._max });

      },
      addData: function addData() {
        if (arguments[0].length > 0) {
          var dataArr = arguments[0];
          var dataLen = dataArr.length;
          while (dataLen--) {
            this.addData.call(this, dataArr[dataLen]);
          }
        } else {
          // add to store  
          var organisedEntry = this._organiseData(arguments[0], true);
          if (organisedEntry) {
            // if it's the first datapoint initialize the extremas with it
            if (this._data.length === 0) {
              this._min = this._max = organisedEntry.value;
            }
            this._coordinator.emit('renderpartial', {
              min: this._min,
              max: this._max,
              data: [organisedEntry] });

          }
        }
        return this;
      },
      setData: function setData(data) {
        var dataPoints = data.data;
        var pointsLen = dataPoints.length;


        // reset data arrays
        this._data = [];
        this._radi = [];

        for (var i = 0; i < pointsLen; i++) {
          this._organiseData(dataPoints[i], false);
        }
        this._max = data.max;
        this._min = data.min || 0;

        this._onExtremaChange();
        this._coordinator.emit('renderall', this._getInternalData());
        return this;
      },
      removeData: function removeData() {
        // TODO: implement
      },
      setDataMax: function setDataMax(max) {
        this._max = max;
        this._onExtremaChange();
        this._coordinator.emit('renderall', this._getInternalData());
        return this;
      },
      setDataMin: function setDataMin(min) {
        this._min = min;
        this._onExtremaChange();
        this._coordinator.emit('renderall', this._getInternalData());
        return this;
      },
      setCoordinator: function setCoordinator(coordinator) {
        this._coordinator = coordinator;
      },
      _getInternalData: function _getInternalData() {
        return {
          max: this._max,
          min: this._min,
          data: this._data,
          radi: this._radi };

      },
      getData: function getData() {
        return this._unOrganizeData();
      } /*,
          TODO: rethink.
        getValueAt: function(point) {
         var value;
         var radius = 100;
         var x = point.x;
         var y = point.y;
         var data = this._data;
          if (data[x] && data[x][y]) {
           return data[x][y];
         } else {
           var values = [];
           // radial search for datapoints based on default radius
           for(var distance = 1; distance < radius; distance++) {
             var neighbors = distance * 2 +1;
             var startX = x - distance;
             var startY = y - distance;
              for(var i = 0; i < neighbors; i++) {
               for (var o = 0; o < neighbors; o++) {
                 if ((i == 0 || i == neighbors-1) || (o == 0 || o == neighbors-1)) {
                   if (data[startY+i] && data[startY+i][startX+o]) {
                     values.push(data[startY+i][startX+o]);
                   }
                 } else {
                   continue;
                 } 
               }
             }
           }
           if (values.length > 0) {
             return Math.max.apply(Math, values);
           }
         }
         return false;
        }*/ };







    return Store;
  }();

  var Canvas2dRenderer = function Canvas2dRendererClosure() {

    var _getColorPalette = function _getColorPalette(config) {
      var gradientConfig = config.gradient || config.defaultGradient;
      var paletteCanvas = document.createElement('canvas');
      var paletteCtx = paletteCanvas.getContext('2d');

      paletteCanvas.width = 256;
      paletteCanvas.height = 1;

      var gradient = paletteCtx.createLinearGradient(0, 0, 256, 1);
      for (var key in gradientConfig) {
        gradient.addColorStop(key, gradientConfig[key]);
      }

      paletteCtx.fillStyle = gradient;
      paletteCtx.fillRect(0, 0, 256, 1);

      return paletteCtx.getImageData(0, 0, 256, 1).data;
    };

    var _getPointTemplate = function _getPointTemplate(radius, blurFactor) {
      var tplCanvas = document.createElement('canvas');
      var tplCtx = tplCanvas.getContext('2d');
      var x = radius;
      var y = radius;
      tplCanvas.width = tplCanvas.height = radius * 2;

      if (blurFactor == 1) {
        tplCtx.beginPath();
        tplCtx.arc(x, y, radius, 0, 2 * Math.PI, false);
        tplCtx.fillStyle = 'rgba(0,0,0,1)';
        tplCtx.fill();
      } else {
        var gradient = tplCtx.createRadialGradient(x, y, radius * blurFactor, x, y, radius);
        gradient.addColorStop(0, 'rgba(0,0,0,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        tplCtx.fillStyle = gradient;
        tplCtx.fillRect(0, 0, 2 * radius, 2 * radius);
      }



      return tplCanvas;
    };

    var _prepareData = function _prepareData(data) {
      var renderData = [];
      var min = data.min;
      var max = data.max;
      var radi = data.radi;
      var data = data.data;

      var xValues = Object.keys(data);
      var xValuesLen = xValues.length;

      while (xValuesLen--) {
        var xValue = xValues[xValuesLen];
        var yValues = Object.keys(data[xValue]);
        var yValuesLen = yValues.length;
        while (yValuesLen--) {
          var yValue = yValues[yValuesLen];
          var value = data[xValue][yValue];
          var radius = radi[xValue][yValue];
          renderData.push({
            x: xValue,
            y: yValue,
            value: value,
            radius: radius });

        }
      }

      return {
        min: min,
        max: max,
        data: renderData };

    };


    function Canvas2dRenderer(config) {
      var container = config.container;
      var shadowCanvas = this.shadowCanvas = document.createElement('canvas');
      var canvas = this.canvas = config.canvas || document.createElement('canvas');
      var renderBoundaries = this._renderBoundaries = [10000, 10000, 0, 0];

      var computed = getComputedStyle(config.container) || {};

      canvas.className = 'heatmap-canvas';

      this._width = canvas.width = shadowCanvas.width = config.width || +computed.width.replace(/px/, '');
      this._height = canvas.height = shadowCanvas.height = config.height || +computed.height.replace(/px/, '');

      this.shadowCtx = shadowCanvas.getContext('2d');
      this.ctx = canvas.getContext('2d');

      // @TODO:
      // conditional wrapper

      canvas.style.cssText = shadowCanvas.style.cssText = 'position:absolute;left:0;top:0;';

      container.style.position = 'relative';
      container.appendChild(canvas);

      this._palette = _getColorPalette(config);
      this._templates = {};

      this._setStyles(config);
    };

    Canvas2dRenderer.prototype = {
      renderPartial: function renderPartial(data) {
        if (data.data.length > 0) {
          this._drawAlpha(data);
          this._colorize();
        }
      },
      renderAll: function renderAll(data) {
        // reset render boundaries
        this._clear();
        if (data.data.length > 0) {
          this._drawAlpha(_prepareData(data));
          this._colorize();
        }
      },
      _updateGradient: function _updateGradient(config) {
        this._palette = _getColorPalette(config);
      },
      updateConfig: function updateConfig(config) {
        if (config['gradient']) {
          this._updateGradient(config);
        }
        this._setStyles(config);
      },
      setDimensions: function setDimensions(width, height) {
        this._width = width;
        this._height = height;
        this.canvas.width = this.shadowCanvas.width = width;
        this.canvas.height = this.shadowCanvas.height = height;
      },
      _clear: function _clear() {
        this.shadowCtx.clearRect(0, 0, this._width, this._height);
        this.ctx.clearRect(0, 0, this._width, this._height);
      },
      _setStyles: function _setStyles(config) {
        this._blur = config.blur == 0 ? 0 : config.blur || config.defaultBlur;

        if (config.backgroundColor) {
          this.canvas.style.backgroundColor = config.backgroundColor;
        }

        this._width = this.canvas.width = this.shadowCanvas.width = config.width || this._width;
        this._height = this.canvas.height = this.shadowCanvas.height = config.height || this._height;


        this._opacity = (config.opacity || 0) * 255;
        this._maxOpacity = (config.maxOpacity || config.defaultMaxOpacity) * 255;
        this._minOpacity = (config.minOpacity || config.defaultMinOpacity) * 255;
        this._useGradientOpacity = !!config.useGradientOpacity;
      },
      _drawAlpha: function _drawAlpha(data) {
        var min = this._min = data.min;
        var max = this._max = data.max;
        var data = data.data || [];
        var dataLen = data.length;
        // on a point basis?
        var blur = 1 - this._blur;

        while (dataLen--) {

          var point = data[dataLen];

          var x = point.x;
          var y = point.y;
          var radius = point.radius;
          // if value is bigger than max
          // use max as value
          var value = Math.min(point.value, max);
          var rectX = x - radius;
          var rectY = y - radius;
          var shadowCtx = this.shadowCtx;




          var tpl;
          if (!this._templates[radius]) {
            this._templates[radius] = tpl = _getPointTemplate(radius, blur);
          } else {
            tpl = this._templates[radius];
          }
          // value from minimum / value range
          // => [0, 1]
          var templateAlpha = (value - min) / (max - min);
          // this fixes #176: small values are not visible because globalAlpha < .01 cannot be read from imageData
          shadowCtx.globalAlpha = templateAlpha < .01 ? .01 : templateAlpha;

          shadowCtx.drawImage(tpl, rectX, rectY);

          // update renderBoundaries
          if (rectX < this._renderBoundaries[0]) {
            this._renderBoundaries[0] = rectX;
          }
          if (rectY < this._renderBoundaries[1]) {
            this._renderBoundaries[1] = rectY;
          }
          if (rectX + 2 * radius > this._renderBoundaries[2]) {
            this._renderBoundaries[2] = rectX + 2 * radius;
          }
          if (rectY + 2 * radius > this._renderBoundaries[3]) {
            this._renderBoundaries[3] = rectY + 2 * radius;
          }

        }
      },
      _colorize: function _colorize() {
        var x = this._renderBoundaries[0];
        var y = this._renderBoundaries[1];
        var width = this._renderBoundaries[2] - x;
        var height = this._renderBoundaries[3] - y;
        var maxWidth = this._width;
        var maxHeight = this._height;
        var opacity = this._opacity;
        var maxOpacity = this._maxOpacity;
        var minOpacity = this._minOpacity;
        var useGradientOpacity = this._useGradientOpacity;

        if (x < 0) {
          x = 0;
        }
        if (y < 0) {
          y = 0;
        }
        if (x + width > maxWidth) {
          width = maxWidth - x;
        }
        if (y + height > maxHeight) {
          height = maxHeight - y;
        }

        var img = this.shadowCtx.getImageData(x, y, width, height);
        var imgData = img.data;
        var len = imgData.length;
        var palette = this._palette;


        for (var i = 3; i < len; i += 4) {
          var alpha = imgData[i];
          var offset = alpha * 4;


          if (!offset) {
            continue;
          }

          var finalAlpha;
          if (opacity > 0) {
            finalAlpha = opacity;
          } else {
            if (alpha < maxOpacity) {
              if (alpha < minOpacity) {
                finalAlpha = minOpacity;
              } else {
                finalAlpha = alpha;
              }
            } else {
              finalAlpha = maxOpacity;
            }
          }

          imgData[i - 3] = palette[offset];
          imgData[i - 2] = palette[offset + 1];
          imgData[i - 1] = palette[offset + 2];
          imgData[i] = useGradientOpacity ? palette[offset + 3] : finalAlpha;

        }

        img.data = imgData;
        this.ctx.putImageData(img, x, y);

        this._renderBoundaries = [1000, 1000, 0, 0];

      },
      getValueAt: function getValueAt(point) {
        var value;
        var shadowCtx = this.shadowCtx;
        var img = shadowCtx.getImageData(point.x, point.y, 1, 1);
        var data = img.data[3];
        var max = this._max;
        var min = this._min;

        value = Math.abs(max - min) * (data / 255) >> 0;

        return value;
      },
      getDataURL: function getDataURL() {
        return this.canvas.toDataURL();
      } };



    return Canvas2dRenderer;
  }();


  var Renderer = function RendererClosure() {

    var rendererFn = false;

    if (HeatmapConfig['defaultRenderer'] === 'canvas2d') {
      rendererFn = Canvas2dRenderer;
    }

    return rendererFn;
  }();


  var Util = {
    merge: function merge() {
      var merged = {};
      var argsLen = arguments.length;
      for (var i = 0; i < argsLen; i++) {
        var obj = arguments[i];
        for (var key in obj) {
          merged[key] = obj[key];
        }
      }
      return merged;
    } };

  // Heatmap Constructor
  var Heatmap = function HeatmapClosure() {

    var Coordinator = function CoordinatorClosure() {

      function Coordinator() {
        this.cStore = {};
      };

      Coordinator.prototype = {
        on: function on(evtName, callback, scope) {
          var cStore = this.cStore;

          if (!cStore[evtName]) {
            cStore[evtName] = [];
          }
          cStore[evtName].push(function (data) {
            return callback.call(scope, data);
          });
        },
        emit: function emit(evtName, data) {
          var cStore = this.cStore;
          if (cStore[evtName]) {
            var len = cStore[evtName].length;
            for (var i = 0; i < len; i++) {
              var callback = cStore[evtName][i];
              callback(data);
            }
          }
        } };


      return Coordinator;
    }();


    var _connect = function _connect(scope) {
      var renderer = scope._renderer;
      var coordinator = scope._coordinator;
      var store = scope._store;

      coordinator.on('renderpartial', renderer.renderPartial, renderer);
      coordinator.on('renderall', renderer.renderAll, renderer);
      coordinator.on('extremachange', function (data) {
        scope._config.onExtremaChange &&
        scope._config.onExtremaChange({
          min: data.min,
          max: data.max,
          gradient: scope._config['gradient'] || scope._config['defaultGradient'] });

      });
      store.setCoordinator(coordinator);
    };


    function Heatmap() {
      var config = this._config = Util.merge(HeatmapConfig, arguments[0] || {});
      this._coordinator = new Coordinator();
      if (config['plugin']) {
        var pluginToLoad = config['plugin'];
        if (!HeatmapConfig.plugins[pluginToLoad]) {
          throw new Error('Plugin \'' + pluginToLoad + '\' not found. Maybe it was not registered.');
        } else {
          var plugin = HeatmapConfig.plugins[pluginToLoad];
          // set plugin renderer and store
          this._renderer = new plugin.renderer(config);
          this._store = new plugin.store(config);
        }
      } else {
        this._renderer = new Renderer(config);
        this._store = new Store(config);
      }
      _connect(this);
    };

    // @TODO:
    // add API documentation
    Heatmap.prototype = {
      addData: function addData() {
        this._store.addData.apply(this._store, arguments);
        return this;
      },
      removeData: function removeData() {
        this._store.removeData && this._store.removeData.apply(this._store, arguments);
        return this;
      },
      setData: function setData() {
        this._store.setData.apply(this._store, arguments);
        return this;
      },
      setDataMax: function setDataMax() {
        this._store.setDataMax.apply(this._store, arguments);
        return this;
      },
      setDataMin: function setDataMin() {
        this._store.setDataMin.apply(this._store, arguments);
        return this;
      },
      configure: function configure(config) {
        this._config = Util.merge(this._config, config);
        this._renderer.updateConfig(this._config);
        this._coordinator.emit('renderall', this._store._getInternalData());
        return this;
      },
      repaint: function repaint() {
        this._coordinator.emit('renderall', this._store._getInternalData());
        return this;
      },
      getData: function getData() {
        return this._store.getData();
      },
      getDataURL: function getDataURL() {
        return this._renderer.getDataURL();
      },
      getValueAt: function getValueAt(point) {

        if (this._store.getValueAt) {
          return this._store.getValueAt(point);
        } else if (this._renderer.getValueAt) {
          return this._renderer.getValueAt(point);
        } else {
          return null;
        }
      } };


    return Heatmap;

  }();


  // core
  var heatmapFactory = {
    create: function create(config) {
      return new Heatmap(config);
    },
    register: function register(pluginKey, plugin) {
      HeatmapConfig.plugins[pluginKey] = plugin;
    } };


  return heatmapFactory;


});

/***/ }),

/***/ "./extensions/DataVisualization/node_modules/q/q.js":
/*!**********************************************************!*\
  !*** ./extensions/DataVisualization/node_modules/q/q.js ***!
  \**********************************************************/
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);} // vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2017 Kris Kowal under the terms of the MIT
 * license found at https://github.com/kriskowal/q/blob/v1/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function (definition) {
  "use strict";

  // This file will function properly as a <script> tag, or a module
  // using CommonJS and NodeJS or RequireJS module formats.  In
  // Common/Node/RequireJS, the module exports the Q API and when
  // executed as a simple <script>, it creates a Q global instead.

  // Montage Require
  if (typeof bootstrap === "function") {
    bootstrap("promise", definition);

    // CommonJS
  } else if (( false ? 0 : _typeof(exports)) === "object" && ( false ? 0 : _typeof(module)) === "object") {
    module.exports = definition();

    // RequireJS
  } else if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

    // SES (Secure EcmaScript)
  } else { var previousQ, global; }

})(function () {
  "use strict";

  var hasStacks = false;
  try {
    throw new Error();
  } catch (e) {
    hasStacks = !!e.stack;
  }

  // All code after this point will be filtered from stack traces reported
  // by Q.
  var qStartingLine = captureLine();
  var qFileName;

  // shims

  // used for fallback in "allResolved"
  var noop = function noop() {};

  // Use the fastest possible means to execute a task in a future turn
  // of the event loop.
  var nextTick = function () {
    // linked list of tasks (single, with head node)
    var head = { task: void 0, next: null };
    var tail = head;
    var flushing = false;
    var requestTick = void 0;
    var isNodeJS = false;
    // queue for late tasks, used by unhandled rejection tracking
    var laterQueue = [];

    function flush() {
      /* jshint loopfunc: true */
      var task, domain;

      while (head.next) {
        head = head.next;
        task = head.task;
        head.task = void 0;
        domain = head.domain;

        if (domain) {
          head.domain = void 0;
          domain.enter();
        }
        runSingle(task, domain);

      }
      while (laterQueue.length) {
        task = laterQueue.pop();
        runSingle(task);
      }
      flushing = false;
    }
    // runs a single function in the async queue
    function runSingle(task, domain) {
      try {
        task();

      } catch (e) {
        if (isNodeJS) {
          // In node, uncaught exceptions are considered fatal errors.
          // Re-throw them synchronously to interrupt flushing!

          // Ensure continuation if the uncaught exception is suppressed
          // listening "uncaughtException" events (as domains does).
          // Continue in next event to avoid tick recursion.
          if (domain) {
            domain.exit();
          }
          setTimeout(flush, 0);
          if (domain) {
            domain.enter();
          }

          throw e;

        } else {
          // In browsers, uncaught exceptions are not fatal.
          // Re-throw them asynchronously to avoid slow-downs.
          setTimeout(function () {
            throw e;
          }, 0);
        }
      }

      if (domain) {
        domain.exit();
      }
    }

    nextTick = function nextTick(task) {
      tail = tail.next = {
        task: task,
        domain: isNodeJS && process.domain,
        next: null };


      if (!flushing) {
        flushing = true;
        requestTick();
      }
    };

    if ((typeof process === "undefined" ? "undefined" : _typeof(process)) === "object" &&
    process.toString() === "[object process]" && process.nextTick) {
      // Ensure Q is in a real Node environment, with a `process.nextTick`.
      // To see through fake Node environments:
      // * Mocha test runner - exposes a `process` global without a `nextTick`
      // * Browserify - exposes a `process.nexTick` function that uses
      //   `setTimeout`. In this case `setImmediate` is preferred because
      //    it is faster. Browserify's `process.toString()` yields
      //   "[object Object]", while in a real Node environment
      //   `process.toString()` yields "[object process]".
      isNodeJS = true;

      requestTick = function requestTick() {
        process.nextTick(flush);
      };

    } else if (typeof setImmediate === "function") {
      // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
      if (typeof window !== "undefined") {
        requestTick = setImmediate.bind(window, flush);
      } else {
        requestTick = function requestTick() {
          setImmediate(flush);
        };
      }

    } else if (typeof MessageChannel !== "undefined") {
      // modern browsers
      // http://www.nonblocking.io/2011/06/windownexttick.html
      var channel = new MessageChannel();
      // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
      // working message ports the first time a page loads.
      channel.port1.onmessage = function () {
        requestTick = requestPortTick;
        channel.port1.onmessage = flush;
        flush();
      };
      var requestPortTick = function requestPortTick() {
        // Opera requires us to provide a message payload, regardless of
        // whether we use it.
        channel.port2.postMessage(0);
      };
      requestTick = function requestTick() {
        setTimeout(flush, 0);
        requestPortTick();
      };

    } else {
      // old browsers
      requestTick = function requestTick() {
        setTimeout(flush, 0);
      };
    }
    // runs a task after all other tasks have been run
    // this is useful for unhandled rejection tracking that needs to happen
    // after all `then`d tasks have been run.
    nextTick.runAfter = function (task) {
      laterQueue.push(task);
      if (!flushing) {
        flushing = true;
        requestTick();
      }
    };
    return nextTick;
  }();

  // Attempt to make generics safe in the face of downstream
  // modifications.
  // There is no situation where this is necessary.
  // If you need a security guarantee, these primordials need to be
  // deeply frozen anyway, and if you don’t need a security guarantee,
  // this is just plain paranoid.
  // However, this **might** have the nice side-effect of reducing the size of
  // the minified code by reducing x.call() to merely x()
  // See Mark Miller’s explanation of what this does.
  // http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
  var call = Function.call;
  function uncurryThis(f) {
    return function () {
      return call.apply(f, arguments);
    };
  }
  // This is equivalent, but slower:
  // uncurryThis = Function_bind.bind(Function_bind.call);
  // http://jsperf.com/uncurrythis

  var array_slice = uncurryThis(Array.prototype.slice);

  var array_reduce = uncurryThis(
  Array.prototype.reduce || function (callback, basis) {
    var index = 0,
    length = this.length;
    // concerning the initial value, if one is not provided
    if (arguments.length === 1) {
      // seek to the first value in the array, accounting
      // for the possibility that is is a sparse array
      do {
        if (index in this) {
          basis = this[index++];
          break;
        }
        if (++index >= length) {
          throw new TypeError();
        }
      } while (1);
    }
    // reduce
    for (; index < length; index++) {
      // account for the possibility that the array is sparse
      if (index in this) {
        basis = callback(basis, this[index], index);
      }
    }
    return basis;
  });


  var array_indexOf = uncurryThis(
  Array.prototype.indexOf || function (value) {
    // not a very good shim, but good enough for our one use of it
    for (var i = 0; i < this.length; i++) {
      if (this[i] === value) {
        return i;
      }
    }
    return -1;
  });


  var array_map = uncurryThis(
  Array.prototype.map || function (callback, thisp) {
    var self = this;
    var collect = [];
    array_reduce(self, function (undefined, value, index) {
      collect.push(callback.call(thisp, value, index, self));
    }, void 0);
    return collect;
  });


  var object_create = Object.create || function (prototype) {
    function Type() {}
    Type.prototype = prototype;
    return new Type();
  };

  var object_defineProperty = Object.defineProperty || function (obj, prop, descriptor) {
    obj[prop] = descriptor.value;
    return obj;
  };

  var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

  var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
      if (object_hasOwnProperty(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };

  var object_toString = uncurryThis(Object.prototype.toString);

  function isObject(value) {
    return value === Object(value);
  }

  // generator related shims

  // FIXME: Remove this function once ES6 generators are in SpiderMonkey.
  function isStopIteration(exception) {
    return (
      object_toString(exception) === "[object StopIteration]" ||
      exception instanceof QReturnValue);

  }

  // FIXME: Remove this helper and Q.return once ES6 generators are in
  // SpiderMonkey.
  var QReturnValue;
  if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
  } else {
    QReturnValue = function QReturnValue(value) {
      this.value = value;
    };
  }

  // long stack traces

  var STACK_JUMP_SEPARATOR = "From previous event:";

  function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
    promise.stack &&
    _typeof(error) === "object" &&
    error !== null &&
    error.stack)
    {
      var stacks = [];
      for (var p = promise; !!p; p = p.source) {
        if (p.stack && (!error.__minimumStackCounter__ || error.__minimumStackCounter__ > p.stackCounter)) {
          object_defineProperty(error, "__minimumStackCounter__", { value: p.stackCounter, configurable: true });
          stacks.unshift(p.stack);
        }
      }
      stacks.unshift(error.stack);

      var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
      var stack = filterStackString(concatedStacks);
      object_defineProperty(error, "stack", { value: stack, configurable: true });
    }
  }

  function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
      var line = lines[i];

      if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
        desiredLines.push(line);
      }
    }
    return desiredLines.join("\n");
  }

  function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
    stackLine.indexOf("(node.js:") !== -1;
  }

  function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
      return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
      return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
      return [attempt3[1], Number(attempt3[2])];
    }
  }

  function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
      return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
    lineNumber >= qStartingLine &&
    lineNumber <= qEndingLine;
  }

  // discover own file name and line number range for filtering stack
  // traces
  function captureLine() {
    if (!hasStacks) {
      return;
    }

    try {
      throw new Error();
    } catch (e) {
      var lines = e.stack.split("\n");
      var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
      var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
      if (!fileNameAndLineNumber) {
        return;
      }

      qFileName = fileNameAndLineNumber[0];
      return fileNameAndLineNumber[1];
    }
  }

  function deprecate(callback, name, alternative) {
    return function () {
      if (typeof console !== "undefined" &&
      typeof console.warn === "function") {
        console.warn(name + " is deprecated, use " + alternative +
        " instead.", new Error("").stack);
      }
      return callback.apply(callback, arguments);
    };
  }

  // end of shims
  // beginning of real work

  /**
   * Constructs a promise for an immediate reference, passes promises through, or
   * coerces promises from different systems.
   * @param value immediate reference or promise
   */
  function Q(value) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (value instanceof Promise) {
      return value;
    }

    // assimilate thenables
    if (isPromiseAlike(value)) {
      return coerce(value);
    } else {
      return fulfill(value);
    }
  }
  Q.resolve = Q;

  /**
                  * Performs a task in a future turn of the event loop.
                  * @param {Function} task
                  */
  Q.nextTick = nextTick;

  /**
                          * Controls whether or not long stack traces will be on
                          */
  Q.longStackSupport = false;

  /**
                               * The counter is used to determine the stopping point for building
                               * long stack traces. In makeStackTraceLong we walk backwards through
                               * the linked list of promises, only stacks which were created before
                               * the rejection are concatenated.
                               */
  var longStackCounter = 1;

  // enable long stacks if Q_DEBUG is set
  if ((typeof process === "undefined" ? "undefined" : _typeof(process)) === "object" && process && process.env && process.env.Q_DEBUG) {
    Q.longStackSupport = true;
  }

  /**
     * Constructs a {promise, resolve, reject} object.
     *
     * `resolve` is a callback to invoke with a more resolved value for the
     * promise. To fulfill the promise, invoke `resolve` with any value that is
     * not a thenable. To reject the promise, invoke `resolve` with a rejected
     * thenable, or invoke `reject` with the reason directly. To resolve the
     * promise to another thenable, thus putting it in the same state, invoke
     * `resolve` with that other thenable.
     */
  Q.defer = defer;
  function defer() {
    // if "messages" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the messages array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the `resolve` function because it handles both fully
    // non-thenable values and other thenables gracefully.
    var messages = [],progressListeners = [],resolvedPromise;

    var deferred = object_create(defer.prototype);
    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, operands) {
      var args = array_slice(arguments);
      if (messages) {
        messages.push(args);
        if (op === "when" && operands[1]) {// progress operand
          progressListeners.push(operands[1]);
        }
      } else {
        Q.nextTick(function () {
          resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
        });
      }
    };

    // XXX deprecated
    promise.valueOf = function () {
      if (messages) {
        return promise;
      }
      var nearerValue = nearer(resolvedPromise);
      if (isPromise(nearerValue)) {
        resolvedPromise = nearerValue; // shorten chain
      }
      return nearerValue;
    };

    promise.inspect = function () {
      if (!resolvedPromise) {
        return { state: "pending" };
      }
      return resolvedPromise.inspect();
    };

    if (Q.longStackSupport && hasStacks) {
      try {
        throw new Error();
      } catch (e) {
        // NOTE: don't try to use `Error.captureStackTrace` or transfer the
        // accessor around; that causes memory leaks as per GH-111. Just
        // reify the stack trace as a string ASAP.
        //
        // At the same time, cut off the first line; it's always just
        // "[object Promise]\n", as per the `toString`.
        promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
        promise.stackCounter = longStackCounter++;
      }
    }

    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
    // consolidating them into `become`, since otherwise we'd create new
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

    function become(newPromise) {
      resolvedPromise = newPromise;

      if (Q.longStackSupport && hasStacks) {
        // Only hold a reference to the new promise if long stacks
        // are enabled to reduce memory usage
        promise.source = newPromise;
      }

      array_reduce(messages, function (undefined, message) {
        Q.nextTick(function () {
          newPromise.promiseDispatch.apply(newPromise, message);
        });
      }, void 0);

      messages = void 0;
      progressListeners = void 0;
    }

    deferred.promise = promise;
    deferred.resolve = function (value) {
      if (resolvedPromise) {
        return;
      }

      become(Q(value));
    };

    deferred.fulfill = function (value) {
      if (resolvedPromise) {
        return;
      }

      become(fulfill(value));
    };
    deferred.reject = function (reason) {
      if (resolvedPromise) {
        return;
      }

      become(reject(reason));
    };
    deferred.notify = function (progress) {
      if (resolvedPromise) {
        return;
      }

      array_reduce(progressListeners, function (undefined, progressListener) {
        Q.nextTick(function () {
          progressListener(progress);
        });
      }, void 0);
    };

    return deferred;
  }

  /**
     * Creates a Node-style callback that will resolve or reject the deferred
     * promise.
     * @returns a nodeback
     */
  defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
      if (error) {
        self.reject(error);
      } else if (arguments.length > 2) {
        self.resolve(array_slice(arguments, 1));
      } else {
        self.resolve(value);
      }
    };
  };

  /**
      * @param resolver {Function} a function that returns nothing and accepts
      * the resolve, reject, and notify functions for a deferred.
      * @returns a promise that may be resolved with the given resolve and reject
      * functions, or rejected by a thrown exception in resolver
      */
  Q.Promise = promise; // ES6
  Q.promise = promise;
  function promise(resolver) {
    if (typeof resolver !== "function") {
      throw new TypeError("resolver must be a function.");
    }
    var deferred = defer();
    try {
      resolver(deferred.resolve, deferred.reject, deferred.notify);
    } catch (reason) {
      deferred.reject(reason);
    }
    return deferred.promise;
  }

  promise.race = race; // ES6
  promise.all = all; // ES6
  promise.reject = reject; // ES6
  promise.resolve = Q; // ES6

  // XXX experimental.  This method is a way to denote that a local value is
  // serializable and should be immediately dispatched to a remote upon request,
  // instead of passing a reference.
  Q.passByCopy = function (object) {
    //freeze(object);
    //passByCopies.set(object, true);
    return object;
  };

  Promise.prototype.passByCopy = function () {
    //freeze(object);
    //passByCopies.set(object, true);
    return this;
  };

  /**
      * If two promises eventually fulfill to the same value, promises that value,
      * but otherwise rejects.
      * @param x {Any*}
      * @param y {Any*}
      * @returns {Any*} a promise for x and y if they are the same, but a rejection
      * otherwise.
      *
      */
  Q.join = function (x, y) {
    return Q(x).join(y);
  };

  Promise.prototype.join = function (that) {
    return Q([this, that]).spread(function (x, y) {
      if (x === y) {
        // TODO: "===" should be Object.is or equiv
        return x;
      } else {
        throw new Error("Q can't join: not the same: " + x + " " + y);
      }
    });
  };

  /**
      * Returns a promise for the first of an array of promises to become settled.
      * @param answers {Array[Any*]} promises to race
      * @returns {Any*} the first promise to be settled
      */
  Q.race = race;
  function race(answerPs) {
    return promise(function (resolve, reject) {
      // Switch to this once we can assume at least ES5
      // answerPs.forEach(function (answerP) {
      //     Q(answerP).then(resolve, reject);
      // });
      // Use this in the meantime
      for (var i = 0, len = answerPs.length; i < len; i++) {
        Q(answerPs[i]).then(resolve, reject);
      }
    });
  }

  Promise.prototype.race = function () {
    return this.then(Q.race);
  };

  /**
      * Constructs a Promise with a promise descriptor object and optional fallback
      * function.  The descriptor contains methods like when(rejected), get(name),
      * set(name, value), post(name, args), and delete(name), which all
      * return either a value, a promise for a value, or a rejection.  The fallback
      * accepts the operation name, a resolver, and any further arguments that would
      * have been forwarded to the appropriate method above had a method been
      * provided with the proper name.  The API makes no guarantees about the nature
      * of the returned object, apart from that it is usable whereever promises are
      * bought and sold.
      */
  Q.makePromise = Promise;
  function Promise(descriptor, fallback, inspect) {
    if (fallback === void 0) {
      fallback = function fallback(op) {
        return reject(new Error(
        "Promise does not support operation: " + op));

      };
    }
    if (inspect === void 0) {
      inspect = function inspect() {
        return { state: "unknown" };
      };
    }

    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, args) {
      var result;
      try {
        if (descriptor[op]) {
          result = descriptor[op].apply(promise, args);
        } else {
          result = fallback.call(promise, op, args);
        }
      } catch (exception) {
        result = reject(exception);
      }
      if (resolve) {
        resolve(result);
      }
    };

    promise.inspect = inspect;

    // XXX deprecated `valueOf` and `exception` support
    if (inspect) {
      var inspected = inspect();
      if (inspected.state === "rejected") {
        promise.exception = inspected.reason;
      }

      promise.valueOf = function () {
        var inspected = inspect();
        if (inspected.state === "pending" ||
        inspected.state === "rejected") {
          return promise;
        }
        return inspected.value;
      };
    }

    return promise;
  }

  Promise.prototype.toString = function () {
    return "[object Promise]";
  };

  Promise.prototype.then = function (fulfilled, rejected, progressed) {
    var self = this;
    var deferred = defer();
    var done = false; // ensure the untrusted promise makes at most a
    // single call to one of the callbacks

    function _fulfilled(value) {
      try {
        return typeof fulfilled === "function" ? fulfilled(value) : value;
      } catch (exception) {
        return reject(exception);
      }
    }

    function _rejected(exception) {
      if (typeof rejected === "function") {
        makeStackTraceLong(exception, self);
        try {
          return rejected(exception);
        } catch (newException) {
          return reject(newException);
        }
      }
      return reject(exception);
    }

    function _progressed(value) {
      return typeof progressed === "function" ? progressed(value) : value;
    }

    Q.nextTick(function () {
      self.promiseDispatch(function (value) {
        if (done) {
          return;
        }
        done = true;

        deferred.resolve(_fulfilled(value));
      }, "when", [function (exception) {
        if (done) {
          return;
        }
        done = true;

        deferred.resolve(_rejected(exception));
      }]);
    });

    // Progress propagator need to be attached in the current tick.
    self.promiseDispatch(void 0, "when", [void 0, function (value) {
      var newValue;
      var threw = false;
      try {
        newValue = _progressed(value);
      } catch (e) {
        threw = true;
        if (Q.onerror) {
          Q.onerror(e);
        } else {
          throw e;
        }
      }

      if (!threw) {
        deferred.notify(newValue);
      }
    }]);

    return deferred.promise;
  };

  Q.tap = function (promise, callback) {
    return Q(promise).tap(callback);
  };

  /**
      * Works almost like "finally", but not called for rejections.
      * Original resolution value is passed through callback unaffected.
      * Callback may return a promise that will be awaited for.
      * @param {Function} callback
      * @returns {Q.Promise}
      * @example
      * doSomething()
      *   .then(...)
      *   .tap(console.log)
      *   .then(...);
      */
  Promise.prototype.tap = function (callback) {
    callback = Q(callback);

    return this.then(function (value) {
      return callback.fcall(value).thenResolve(value);
    });
  };

  /**
      * Registers an observer on a promise.
      *
      * Guarantees:
      *
      * 1. that fulfilled and rejected will be called only once.
      * 2. that either the fulfilled callback or the rejected callback will be
      *    called, but not both.
      * 3. that fulfilled and rejected will not be called in this turn.
      *
      * @param value      promise or immediate reference to observe
      * @param fulfilled  function to be called with the fulfilled value
      * @param rejected   function to be called with the rejection exception
      * @param progressed function to be called on any progress notifications
      * @return promise for the return value from the invoked callback
      */
  Q.when = when;
  function when(value, fulfilled, rejected, progressed) {
    return Q(value).then(fulfilled, rejected, progressed);
  }

  Promise.prototype.thenResolve = function (value) {
    return this.then(function () {return value;});
  };

  Q.thenResolve = function (promise, value) {
    return Q(promise).thenResolve(value);
  };

  Promise.prototype.thenReject = function (reason) {
    return this.then(function () {throw reason;});
  };

  Q.thenReject = function (promise, reason) {
    return Q(promise).thenReject(reason);
  };

  /**
      * If an object is not a promise, it is as "near" as possible.
      * If a promise is rejected, it is as "near" as possible too.
      * If it’s a fulfilled promise, the fulfillment value is nearer.
      * If it’s a deferred promise and the deferred has been resolved, the
      * resolution is "nearer".
      * @param object
      * @returns most resolved (nearest) form of the object
      */

  // XXX should we re-do this?
  Q.nearer = nearer;
  function nearer(value) {
    if (isPromise(value)) {
      var inspected = value.inspect();
      if (inspected.state === "fulfilled") {
        return inspected.value;
      }
    }
    return value;
  }

  /**
     * @returns whether the given object is a promise.
     * Otherwise it is a fulfilled value.
     */
  Q.isPromise = isPromise;
  function isPromise(object) {
    return object instanceof Promise;
  }

  Q.isPromiseAlike = isPromiseAlike;
  function isPromiseAlike(object) {
    return isObject(object) && typeof object.then === "function";
  }

  /**
     * @returns whether the given object is a pending promise, meaning not
     * fulfilled or rejected.
     */
  Q.isPending = isPending;
  function isPending(object) {
    return isPromise(object) && object.inspect().state === "pending";
  }

  Promise.prototype.isPending = function () {
    return this.inspect().state === "pending";
  };

  /**
      * @returns whether the given object is a value or fulfilled
      * promise.
      */
  Q.isFulfilled = isFulfilled;
  function isFulfilled(object) {
    return !isPromise(object) || object.inspect().state === "fulfilled";
  }

  Promise.prototype.isFulfilled = function () {
    return this.inspect().state === "fulfilled";
  };

  /**
      * @returns whether the given object is a rejected promise.
      */
  Q.isRejected = isRejected;
  function isRejected(object) {
    return isPromise(object) && object.inspect().state === "rejected";
  }

  Promise.prototype.isRejected = function () {
    return this.inspect().state === "rejected";
  };

  //// BEGIN UNHANDLED REJECTION TRACKING

  // This promise library consumes exceptions thrown in handlers so they can be
  // handled by a subsequent promise.  The exceptions get added to this array when
  // they are created, and removed when they are handled.  Note that in ES6 or
  // shimmed environments, this would naturally be a `Set`.
  var unhandledReasons = [];
  var unhandledRejections = [];
  var reportedUnhandledRejections = [];
  var trackUnhandledRejections = true;

  function resetUnhandledRejections() {
    unhandledReasons.length = 0;
    unhandledRejections.length = 0;

    if (!trackUnhandledRejections) {
      trackUnhandledRejections = true;
    }
  }

  function trackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
      return;
    }
    if ((typeof process === "undefined" ? "undefined" : _typeof(process)) === "object" && typeof process.emit === "function") {
      Q.nextTick.runAfter(function () {
        if (array_indexOf(unhandledRejections, promise) !== -1) {
          process.emit("unhandledRejection", reason, promise);
          reportedUnhandledRejections.push(promise);
        }
      });
    }

    unhandledRejections.push(promise);
    if (reason && typeof reason.stack !== "undefined") {
      unhandledReasons.push(reason.stack);
    } else {
      unhandledReasons.push("(no stack) " + reason);
    }
  }

  function untrackRejection(promise) {
    if (!trackUnhandledRejections) {
      return;
    }

    var at = array_indexOf(unhandledRejections, promise);
    if (at !== -1) {
      if ((typeof process === "undefined" ? "undefined" : _typeof(process)) === "object" && typeof process.emit === "function") {
        Q.nextTick.runAfter(function () {
          var atReport = array_indexOf(reportedUnhandledRejections, promise);
          if (atReport !== -1) {
            process.emit("rejectionHandled", unhandledReasons[at], promise);
            reportedUnhandledRejections.splice(atReport, 1);
          }
        });
      }
      unhandledRejections.splice(at, 1);
      unhandledReasons.splice(at, 1);
    }
  }

  Q.resetUnhandledRejections = resetUnhandledRejections;

  Q.getUnhandledReasons = function () {
    // Make a copy so that consumers can't interfere with our internal state.
    return unhandledReasons.slice();
  };

  Q.stopUnhandledRejectionTracking = function () {
    resetUnhandledRejections();
    trackUnhandledRejections = false;
  };

  resetUnhandledRejections();

  //// END UNHANDLED REJECTION TRACKING

  /**
   * Constructs a rejected promise.
   * @param reason value describing the failure
   */
  Q.reject = reject;
  function reject(reason) {
    var rejection = Promise({
      "when": function when(rejected) {
        // note that the error has been handled
        if (rejected) {
          untrackRejection(this);
        }
        return rejected ? rejected(reason) : this;
      } },
    function fallback() {
      return this;
    }, function inspect() {
      return { state: "rejected", reason: reason };
    });

    // Note that the reason has not been handled.
    trackRejection(rejection, reason);

    return rejection;
  }

  /**
     * Constructs a fulfilled promise for an immediate reference.
     * @param value immediate reference
     */
  Q.fulfill = fulfill;
  function fulfill(value) {
    return Promise({
      "when": function when() {
        return value;
      },
      "get": function get(name) {
        return value[name];
      },
      "set": function set(name, rhs) {
        value[name] = rhs;
      },
      "delete": function _delete(name) {
        delete value[name];
      },
      "post": function post(name, args) {
        // Mark Miller proposes that post with no name should apply a
        // promised function.
        if (name === null || name === void 0) {
          return value.apply(void 0, args);
        } else {
          return value[name].apply(value, args);
        }
      },
      "apply": function apply(thisp, args) {
        return value.apply(thisp, args);
      },
      "keys": function keys() {
        return object_keys(value);
      } },
    void 0, function inspect() {
      return { state: "fulfilled", value: value };
    });
  }

  /**
     * Converts thenables to Q promises.
     * @param promise thenable promise
     * @returns a Q promise
     */
  function coerce(promise) {
    var deferred = defer();
    Q.nextTick(function () {
      try {
        promise.then(deferred.resolve, deferred.reject, deferred.notify);
      } catch (exception) {
        deferred.reject(exception);
      }
    });
    return deferred.promise;
  }

  /**
     * Annotates an object such that it will never be
     * transferred away from this process over any promise
     * communication channel.
     * @param object
     * @returns promise a wrapping of that object that
     * additionally responds to the "isDef" message
     * without a rejection.
     */
  Q.master = master;
  function master(object) {
    return Promise({
      "isDef": function isDef() {} },
    function fallback(op, args) {
      return dispatch(object, op, args);
    }, function () {
      return Q(object).inspect();
    });
  }

  /**
     * Spreads the values of a promised array of arguments into the
     * fulfillment callback.
     * @param fulfilled callback that receives variadic arguments from the
     * promised array
     * @param rejected callback that receives the exception if the promise
     * is rejected.
     * @returns a promise for the return value or thrown exception of
     * either callback.
     */
  Q.spread = spread;
  function spread(value, fulfilled, rejected) {
    return Q(value).spread(fulfilled, rejected);
  }

  Promise.prototype.spread = function (fulfilled, rejected) {
    return this.all().then(function (array) {
      return fulfilled.apply(void 0, array);
    }, rejected);
  };

  /**
      * The async function is a decorator for generator functions, turning
      * them into asynchronous generators.  Although generators are only part
      * of the newest ECMAScript 6 drafts, this code does not cause syntax
      * errors in older engines.  This code should continue to work and will
      * in fact improve over time as the language improves.
      *
      * ES6 generators are currently part of V8 version 3.19 with the
      * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
      * for longer, but under an older Python-inspired form.  This function
      * works on both kinds of generators.
      *
      * Decorates a generator function such that:
      *  - it may yield promises
      *  - execution will continue when that promise is fulfilled
      *  - the value of the yield expression will be the fulfilled value
      *  - it returns a promise for the return value (when the generator
      *    stops iterating)
      *  - the decorated function returns a promise for the return value
      *    of the generator or the first rejected promise among those
      *    yielded.
      *  - if an error is thrown in the generator, it propagates through
      *    every following yield until it is caught, or until it escapes
      *    the generator function altogether, and is translated into a
      *    rejection for the promise returned by the decorated generator.
      */
  Q.async = async;
  function async(makeGenerator) {
    return function () {
      // when verb is "send", arg is a value
      // when verb is "throw", arg is an exception
      function continuer(verb, arg) {
        var result;

        // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
        // engine that has a deployed base of browsers that support generators.
        // However, SM's generators use the Python-inspired semantics of
        // outdated ES6 drafts.  We would like to support ES6, but we'd also
        // like to make it possible to use generators in deployed browsers, so
        // we also support Python-style generators.  At some point we can remove
        // this block.

        if (typeof StopIteration === "undefined") {
          // ES6 Generators
          try {
            result = generator[verb](arg);
          } catch (exception) {
            return reject(exception);
          }
          if (result.done) {
            return Q(result.value);
          } else {
            return when(result.value, callback, errback);
          }
        } else {
          // SpiderMonkey Generators
          // FIXME: Remove this case when SM does ES6 generators.
          try {
            result = generator[verb](arg);
          } catch (exception) {
            if (isStopIteration(exception)) {
              return Q(exception.value);
            } else {
              return reject(exception);
            }
          }
          return when(result, callback, errback);
        }
      }
      var generator = makeGenerator.apply(this, arguments);
      var callback = continuer.bind(continuer, "next");
      var errback = continuer.bind(continuer, "throw");
      return callback();
    };
  }

  /**
     * The spawn function is a small wrapper around async that immediately
     * calls the generator and also ends the promise chain, so that any
     * unhandled errors are thrown instead of forwarded to the error
     * handler. This is useful because it's extremely common to run
     * generators at the top-level to work with libraries.
     */
  Q.spawn = spawn;
  function spawn(makeGenerator) {
    Q.done(Q.async(makeGenerator)());
  }

  // FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
  /**
   * Throws a ReturnValue exception to stop an asynchronous generator.
   *
   * This interface is a stop-gap measure to support generator return
   * values in older Firefox/SpiderMonkey.  In browsers that support ES6
   * generators like Chromium 29, just use "return" in your generator
   * functions.
   *
   * @param value the return value for the surrounding generator
   * @throws ReturnValue exception with the value.
   * @example
   * // ES6 style
   * Q.async(function* () {
   *      var foo = yield getFooPromise();
   *      var bar = yield getBarPromise();
   *      return foo + bar;
   * })
   * // Older SpiderMonkey style
   * Q.async(function () {
   *      var foo = yield getFooPromise();
   *      var bar = yield getBarPromise();
   *      Q.return(foo + bar);
   * })
   */
  Q["return"] = _return;
  function _return(value) {
    throw new QReturnValue(value);
  }

  /**
     * The promised function decorator ensures that any promise arguments
     * are settled and passed as values (`this` is also settled and passed
     * as a value).  It will also ensure that the result of a function is
     * always a promise.
     *
     * @example
     * var add = Q.promised(function (a, b) {
     *     return a + b;
     * });
     * add(Q(a), Q(B));
     *
     * @param {function} callback The function to decorate
     * @returns {function} a function that has been decorated.
     */
  Q.promised = promised;
  function promised(callback) {
    return function () {
      return spread([this, all(arguments)], function (self, args) {
        return callback.apply(self, args);
      });
    };
  }

  /**
     * sends a message to a value in a future turn
     * @param object* the recipient
     * @param op the name of the message operation, e.g., "when",
     * @param args further arguments to be forwarded to the operation
     * @returns result {Promise} a promise for the result of the operation
     */
  Q.dispatch = dispatch;
  function dispatch(object, op, args) {
    return Q(object).dispatch(op, args);
  }

  Promise.prototype.dispatch = function (op, args) {
    var self = this;
    var deferred = defer();
    Q.nextTick(function () {
      self.promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
  };

  /**
      * Gets the value of a property in a future turn.
      * @param object    promise or immediate reference for target object
      * @param name      name of property to get
      * @return promise for the property value
      */
  Q.get = function (object, key) {
    return Q(object).dispatch("get", [key]);
  };

  Promise.prototype.get = function (key) {
    return this.dispatch("get", [key]);
  };

  /**
      * Sets the value of a property in a future turn.
      * @param object    promise or immediate reference for object object
      * @param name      name of property to set
      * @param value     new value of property
      * @return promise for the return value
      */
  Q.set = function (object, key, value) {
    return Q(object).dispatch("set", [key, value]);
  };

  Promise.prototype.set = function (key, value) {
    return this.dispatch("set", [key, value]);
  };

  /**
      * Deletes a property in a future turn.
      * @param object    promise or immediate reference for target object
      * @param name      name of property to delete
      * @return promise for the return value
      */
  Q.del = // XXX legacy
  Q["delete"] = function (object, key) {
    return Q(object).dispatch("delete", [key]);
  };

  Promise.prototype.del = // XXX legacy
  Promise.prototype["delete"] = function (key) {
    return this.dispatch("delete", [key]);
  };

  /**
      * Invokes a method in a future turn.
      * @param object    promise or immediate reference for target object
      * @param name      name of method to invoke
      * @param value     a value to post, typically an array of
      *                  invocation arguments for promises that
      *                  are ultimately backed with `resolve` values,
      *                  as opposed to those backed with URLs
      *                  wherein the posted value can be any
      *                  JSON serializable object.
      * @return promise for the return value
      */
  // bound locally because it is used by other methods
  Q.mapply = // XXX As proposed by "Redsandro"
  Q.post = function (object, name, args) {
    return Q(object).dispatch("post", [name, args]);
  };

  Promise.prototype.mapply = // XXX As proposed by "Redsandro"
  Promise.prototype.post = function (name, args) {
    return this.dispatch("post", [name, args]);
  };

  /**
      * Invokes a method in a future turn.
      * @param object    promise or immediate reference for target object
      * @param name      name of method to invoke
      * @param ...args   array of invocation arguments
      * @return promise for the return value
      */
  Q.send = // XXX Mark Miller's proposed parlance
  Q.mcall = // XXX As proposed by "Redsandro"
  Q.invoke = function (object, name /*...args*/) {
    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
  };

  Promise.prototype.send = // XXX Mark Miller's proposed parlance
  Promise.prototype.mcall = // XXX As proposed by "Redsandro"
  Promise.prototype.invoke = function (name /*...args*/) {
    return this.dispatch("post", [name, array_slice(arguments, 1)]);
  };

  /**
      * Applies the promised function in a future turn.
      * @param object    promise or immediate reference for target function
      * @param args      array of application arguments
      */
  Q.fapply = function (object, args) {
    return Q(object).dispatch("apply", [void 0, args]);
  };

  Promise.prototype.fapply = function (args) {
    return this.dispatch("apply", [void 0, args]);
  };

  /**
      * Calls the promised function in a future turn.
      * @param object    promise or immediate reference for target function
      * @param ...args   array of application arguments
      */
  Q["try"] =
  Q.fcall = function (object /* ...args*/) {
    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
  };

  Promise.prototype.fcall = function () /*...args*/{
    return this.dispatch("apply", [void 0, array_slice(arguments)]);
  };

  /**
      * Binds the promised function, transforming return values into a fulfilled
      * promise and thrown errors into a rejected one.
      * @param object    promise or immediate reference for target function
      * @param ...args   array of application arguments
      */
  Q.fbind = function (object /*...args*/) {
    var promise = Q(object);
    var args = array_slice(arguments, 1);
    return function fbound() {
      return promise.dispatch("apply", [
      this,
      args.concat(array_slice(arguments))]);

    };
  };
  Promise.prototype.fbind = function () /*...args*/{
    var promise = this;
    var args = array_slice(arguments);
    return function fbound() {
      return promise.dispatch("apply", [
      this,
      args.concat(array_slice(arguments))]);

    };
  };

  /**
      * Requests the names of the owned properties of a promised
      * object in a future turn.
      * @param object    promise or immediate reference for target object
      * @return promise for the keys of the eventually settled object
      */
  Q.keys = function (object) {
    return Q(object).dispatch("keys", []);
  };

  Promise.prototype.keys = function () {
    return this.dispatch("keys", []);
  };

  /**
      * Turns an array of promises into a promise for an array.  If any of
      * the promises gets rejected, the whole array is rejected immediately.
      * @param {Array*} an array (or promise for an array) of values (or
      * promises for values)
      * @returns a promise for an array of the corresponding values
      */
  // By Mark Miller
  // http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
  Q.all = all;
  function all(promises) {
    return when(promises, function (promises) {
      var pendingCount = 0;
      var deferred = defer();
      array_reduce(promises, function (undefined, promise, index) {
        var snapshot;
        if (
        isPromise(promise) &&
        (snapshot = promise.inspect()).state === "fulfilled")
        {
          promises[index] = snapshot.value;
        } else {
          ++pendingCount;
          when(
          promise,
          function (value) {
            promises[index] = value;
            if (--pendingCount === 0) {
              deferred.resolve(promises);
            }
          },
          deferred.reject,
          function (progress) {
            deferred.notify({ index: index, value: progress });
          });

        }
      }, void 0);
      if (pendingCount === 0) {
        deferred.resolve(promises);
      }
      return deferred.promise;
    });
  }

  Promise.prototype.all = function () {
    return all(this);
  };

  /**
      * Returns the first resolved promise of an array. Prior rejected promises are
      * ignored.  Rejects only if all promises are rejected.
      * @param {Array*} an array containing values or promises for values
      * @returns a promise fulfilled with the value of the first resolved promise,
      * or a rejected promise if all promises are rejected.
      */
  Q.any = any;

  function any(promises) {
    if (promises.length === 0) {
      return Q.resolve();
    }

    var deferred = Q.defer();
    var pendingCount = 0;
    array_reduce(promises, function (prev, current, index) {
      var promise = promises[index];

      pendingCount++;

      when(promise, onFulfilled, onRejected, onProgress);
      function onFulfilled(result) {
        deferred.resolve(result);
      }
      function onRejected(err) {
        pendingCount--;
        if (pendingCount === 0) {
          var rejection = err || new Error("" + err);

          rejection.message = "Q can't get fulfillment value from any promise, all " +
          "promises were rejected. Last error message: " + rejection.message;

          deferred.reject(rejection);
        }
      }
      function onProgress(progress) {
        deferred.notify({
          index: index,
          value: progress });

      }
    }, undefined);

    return deferred.promise;
  }

  Promise.prototype.any = function () {
    return any(this);
  };

  /**
      * Waits for all promises to be settled, either fulfilled or
      * rejected.  This is distinct from `all` since that would stop
      * waiting at the first rejection.  The promise returned by
      * `allResolved` will never be rejected.
      * @param promises a promise for an array (or an array) of promises
      * (or values)
      * @return a promise for an array of promises
      */
  Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
  function allResolved(promises) {
    return when(promises, function (promises) {
      promises = array_map(promises, Q);
      return when(all(array_map(promises, function (promise) {
        return when(promise, noop, noop);
      })), function () {
        return promises;
      });
    });
  }

  Promise.prototype.allResolved = function () {
    return allResolved(this);
  };

  /**
      * @see Promise#allSettled
      */
  Q.allSettled = allSettled;
  function allSettled(promises) {
    return Q(promises).allSettled();
  }

  /**
     * Turns an array of promises into a promise for an array of their states (as
     * returned by `inspect`) when they have all settled.
     * @param {Array[Any*]} values an array (or promise for an array) of values (or
     * promises for values)
     * @returns {Array[State]} an array of states for the respective values.
     */
  Promise.prototype.allSettled = function () {
    return this.then(function (promises) {
      return all(array_map(promises, function (promise) {
        promise = Q(promise);
        function regardless() {
          return promise.inspect();
        }
        return promise.then(regardless, regardless);
      }));
    });
  };

  /**
      * Captures the failure of a promise, giving an oportunity to recover
      * with a callback.  If the given promise is fulfilled, the returned
      * promise is fulfilled.
      * @param {Any*} promise for something
      * @param {Function} callback to fulfill the returned promise if the
      * given promise is rejected
      * @returns a promise for the return value of the callback
      */
  Q.fail = // XXX legacy
  Q["catch"] = function (object, rejected) {
    return Q(object).then(void 0, rejected);
  };

  Promise.prototype.fail = // XXX legacy
  Promise.prototype["catch"] = function (rejected) {
    return this.then(void 0, rejected);
  };

  /**
      * Attaches a listener that can respond to progress notifications from a
      * promise's originating deferred. This listener receives the exact arguments
      * passed to ``deferred.notify``.
      * @param {Any*} promise for something
      * @param {Function} callback to receive any progress notifications
      * @returns the given promise, unchanged
      */
  Q.progress = progress;
  function progress(object, progressed) {
    return Q(object).then(void 0, void 0, progressed);
  }

  Promise.prototype.progress = function (progressed) {
    return this.then(void 0, void 0, progressed);
  };

  /**
      * Provides an opportunity to observe the settling of a promise,
      * regardless of whether the promise is fulfilled or rejected.  Forwards
      * the resolution to the returned promise when the callback is done.
      * The callback can return a promise to defer completion.
      * @param {Any*} promise
      * @param {Function} callback to observe the resolution of the given
      * promise, takes no arguments.
      * @returns a promise for the resolution of the given promise when
      * ``fin`` is done.
      */
  Q.fin = // XXX legacy
  Q["finally"] = function (object, callback) {
    return Q(object)["finally"](callback);
  };

  Promise.prototype.fin = // XXX legacy
  Promise.prototype["finally"] = function (callback) {
    if (!callback || typeof callback.apply !== "function") {
      throw new Error("Q can't apply finally callback");
    }
    callback = Q(callback);
    return this.then(function (value) {
      return callback.fcall().then(function () {
        return value;
      });
    }, function (reason) {
      // TODO attempt to recycle the rejection with "this".
      return callback.fcall().then(function () {
        throw reason;
      });
    });
  };

  /**
      * Terminates a chain of promises, forcing rejections to be
      * thrown as exceptions.
      * @param {Any*} promise at the end of a chain of promises
      * @returns nothing
      */
  Q.done = function (object, fulfilled, rejected, progress) {
    return Q(object).done(fulfilled, rejected, progress);
  };

  Promise.prototype.done = function (fulfilled, rejected, progress) {
    var onUnhandledError = function onUnhandledError(error) {
      // forward to a future turn so that ``when``
      // does not catch it and turn it into a rejection.
      Q.nextTick(function () {
        makeStackTraceLong(error, promise);
        if (Q.onerror) {
          Q.onerror(error);
        } else {
          throw error;
        }
      });
    };

    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
    var promise = fulfilled || rejected || progress ?
    this.then(fulfilled, rejected, progress) :
    this;

    if ((typeof process === "undefined" ? "undefined" : _typeof(process)) === "object" && process && process.domain) {
      onUnhandledError = process.domain.bind(onUnhandledError);
    }

    promise.then(void 0, onUnhandledError);
  };

  /**
      * Causes a promise to be rejected if it does not get fulfilled before
      * some milliseconds time out.
      * @param {Any*} promise
      * @param {Number} milliseconds timeout
      * @param {Any*} custom error message or Error object (optional)
      * @returns a promise for the resolution of the given promise if it is
      * fulfilled before the timeout, otherwise rejected.
      */
  Q.timeout = function (object, ms, error) {
    return Q(object).timeout(ms, error);
  };

  Promise.prototype.timeout = function (ms, error) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
      if (!error || "string" === typeof error) {
        error = new Error(error || "Timed out after " + ms + " ms");
        error.code = "ETIMEDOUT";
      }
      deferred.reject(error);
    }, ms);

    this.then(function (value) {
      clearTimeout(timeoutId);
      deferred.resolve(value);
    }, function (exception) {
      clearTimeout(timeoutId);
      deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
  };

  /**
      * Returns a promise for the given value (or promised value), some
      * milliseconds after it resolved. Passes rejections immediately.
      * @param {Any*} promise
      * @param {Number} milliseconds
      * @returns a promise for the resolution of the given promise after milliseconds
      * time has elapsed since the resolution of the given promise.
      * If the given promise rejects, that is passed immediately.
      */
  Q.delay = function (object, timeout) {
    if (timeout === void 0) {
      timeout = object;
      object = void 0;
    }
    return Q(object).delay(timeout);
  };

  Promise.prototype.delay = function (timeout) {
    return this.then(function (value) {
      var deferred = defer();
      setTimeout(function () {
        deferred.resolve(value);
      }, timeout);
      return deferred.promise;
    });
  };

  /**
      * Passes a continuation to a Node function, which is called with the given
      * arguments provided as an array, and returns a promise.
      *
      *      Q.nfapply(FS.readFile, [__filename])
      *      .then(function (content) {
      *      })
      *
      */
  Q.nfapply = function (callback, args) {
    return Q(callback).nfapply(args);
  };

  Promise.prototype.nfapply = function (args) {
    var deferred = defer();
    var nodeArgs = array_slice(args);
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
  };

  /**
      * Passes a continuation to a Node function, which is called with the given
      * arguments provided individually, and returns a promise.
      * @example
      * Q.nfcall(FS.readFile, __filename)
      * .then(function (content) {
      * })
      *
      */
  Q.nfcall = function (callback /*...args*/) {
    var args = array_slice(arguments, 1);
    return Q(callback).nfapply(args);
  };

  Promise.prototype.nfcall = function () /*...args*/{
    var nodeArgs = array_slice(arguments);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
  };

  /**
      * Wraps a NodeJS continuation passing function and returns an equivalent
      * version that returns a promise.
      * @example
      * Q.nfbind(FS.readFile, __filename)("utf-8")
      * .then(console.log)
      * .done()
      */
  Q.nfbind =
  Q.denodeify = function (callback /*...args*/) {
    if (callback === undefined) {
      throw new Error("Q can't wrap an undefined function");
    }
    var baseArgs = array_slice(arguments, 1);
    return function () {
      var nodeArgs = baseArgs.concat(array_slice(arguments));
      var deferred = defer();
      nodeArgs.push(deferred.makeNodeResolver());
      Q(callback).fapply(nodeArgs).fail(deferred.reject);
      return deferred.promise;
    };
  };

  Promise.prototype.nfbind =
  Promise.prototype.denodeify = function () /*...args*/{
    var args = array_slice(arguments);
    args.unshift(this);
    return Q.denodeify.apply(void 0, args);
  };

  Q.nbind = function (callback, thisp /*...args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
      var nodeArgs = baseArgs.concat(array_slice(arguments));
      var deferred = defer();
      nodeArgs.push(deferred.makeNodeResolver());
      function bound() {
        return callback.apply(thisp, arguments);
      }
      Q(bound).fapply(nodeArgs).fail(deferred.reject);
      return deferred.promise;
    };
  };

  Promise.prototype.nbind = function () /*thisp, ...args*/{
    var args = array_slice(arguments, 0);
    args.unshift(this);
    return Q.nbind.apply(void 0, args);
  };

  /**
      * Calls a method of a Node-style object that accepts a Node-style
      * callback with a given array of arguments, plus a provided callback.
      * @param object an object that has the named method
      * @param {String} name name of the method of object
      * @param {Array} args arguments to pass to the method; the callback
      * will be provided by Q and appended to these arguments.
      * @returns a promise for the value or error
      */
  Q.nmapply = // XXX As proposed by "Redsandro"
  Q.npost = function (object, name, args) {
    return Q(object).npost(name, args);
  };

  Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
  Promise.prototype.npost = function (name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
  };

  /**
      * Calls a method of a Node-style object that accepts a Node-style
      * callback, forwarding the given variadic arguments, plus a provided
      * callback argument.
      * @param object an object that has the named method
      * @param {String} name name of the method of object
      * @param ...args arguments to pass to the method; the callback will
      * be provided by Q and appended to these arguments.
      * @returns a promise for the value or error
      */
  Q.nsend = // XXX Based on Mark Miller's proposed "send"
  Q.nmcall = // XXX Based on "Redsandro's" proposal
  Q.ninvoke = function (object, name /*...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
  };

  Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
  Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
  Promise.prototype.ninvoke = function (name /*...args*/) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
  };

  /**
      * If a function would like to support both Node continuation-passing-style and
      * promise-returning-style, it can end its internal promise chain with
      * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
      * elects to use a nodeback, the result will be sent there.  If they do not
      * pass a nodeback, they will receive the result promise.
      * @param object a result (or a promise for a result)
      * @param {Function} nodeback a Node.js-style callback
      * @returns either the promise or nothing
      */
  Q.nodeify = nodeify;
  function nodeify(object, nodeback) {
    return Q(object).nodeify(nodeback);
  }

  Promise.prototype.nodeify = function (nodeback) {
    if (nodeback) {
      this.then(function (value) {
        Q.nextTick(function () {
          nodeback(null, value);
        });
      }, function (error) {
        Q.nextTick(function () {
          nodeback(error);
        });
      });
    } else {
      return this;
    }
  };

  Q.noConflict = function () {
    throw new Error("Q.noConflict only works when Q is used as a global");
  };

  // All code before this point will be filtered from stack traces.
  var qEndingLine = captureLine();

  return Q;

});

/***/ }),

/***/ "./extensions/DataVisualization/streamline/StreamLine.js":
/*!***************************************************************!*\
  !*** ./extensions/DataVisualization/streamline/StreamLine.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StreamLine": () => (/* binding */ StreamLine)
/* harmony export */ });
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function memcpy(src, srcOffset, dst, dstOffset, length) {
  src = src.subarray || src.slice ? src : src.buffer;
  dst = dst.subarray || dst.slice ? dst : dst.buffer;

  src = srcOffset ?
  src.subarray ?
  src.subarray(srcOffset, length && srcOffset + length) :
  src.slice(srcOffset, length && srcOffset + length) :
  src;

  if (dst.set) {
    dst.set(src, dstOffset);
  } else {
    for (var i = 0; i < src.length; i++) {
      dst[i + dstOffset] = src[i];
    }
  }

  return dst;
}var

StreamLine = /*#__PURE__*/function () {
  function StreamLine() {_classCallCheck(this, StreamLine);
    this._position = [];
    this._prev = [];
    this._next = [];
    this._side = [];
    this._width = [];
    this._index = [];

    this._widthCallback = null;
    this._geometry = null; // THREE.BufferGeometry();
  }_createClass(StreamLine, [{ key: "dispose", value: function dispose()





    {
      if (this._geometry) {
        this._geometry.dispose();
        this._geometry = null;
      }
    } }, { key: "setPoints", value: function setPoints(

    points, wcb) {
      if (!(points instanceof Float32Array) || points.length === 0) {
        throw new Error("Input points must be of Float32Array type");
      }

      this._widthCallback = wcb;
      this._position = [];

      for (var j = 0; j < points.length; j += 3) {
        this._position.push(points[j], points[j + 1], points[j + 2]);
        this._position.push(points[j], points[j + 1], points[j + 2]);
      }

      this.process();
    } }, { key: "compareV3", value: function compareV3(

    a, b) {
      var aa = a * 6;
      var ab = b * 6;

      return (
        this._position[aa] === this._position[ab] &&
        this._position[aa + 1] === this._position[ab + 1] &&
        this._position[aa + 2] === this._position[ab + 2]);

    } }, { key: "copyV3", value: function copyV3(

    a) {
      var aa = a * 6;
      return {
        x: this._position[aa],
        y: this._position[aa + 1],
        z: this._position[aa + 2] };

    } }, { key: "updateAttribute", value: function updateAttribute(

    attribute, dataArray) {
      attribute.set(dataArray);
      attribute.needsUpdate = true;
    } }, { key: "process", value: function process()

    {
      var l = this._position.length / 6;

      this._prev = [];
      this._next = [];
      this._side = [];
      this._width = [];
      this._index = [];

      var isLoop = this.compareV3(0, l - 1);

      {
        // Create a 'previous point' for the first point of line. This 'previous'
        // point of the first point can either be the same as the first point itself
        // (when the line does not form a loop), or the second last point (when the
        // line is a loop).
        //
        var copyFromIndex = isLoop ? l - 2 : 0;var _this$copyV =
        this.copyV3(copyFromIndex),x = _this$copyV.x,y = _this$copyV.y,z = _this$copyV.z;

        this._prev.push(x, y, z);
        this._prev.push(x, y, z);
      }

      for (var j = 0; j < l; j++) {
        // sides
        this._side.push(1);
        this._side.push(-1);

        // widths
        var w = 1.0;
        if (this._widthCallback) {
          w = this._widthCallback(j / (l - 1));
        }

        this._width.push(w);
        this._width.push(w);

        if (j < l - 1) {
          // points prev to poisitions
          var _this$copyV2 = this.copyV3(j),_x = _this$copyV2.x,_y = _this$copyV2.y,_z = _this$copyV2.z;
          this._prev.push(_x, _y, _z);
          this._prev.push(_x, _y, _z);

          // indices
          var n = j * 2;
          this._index.push(n, n + 1, n + 2);
          this._index.push(n + 2, n + 1, n + 3);
        }
        if (j > 0) {
          // points after poisitions
          var _this$copyV3 = this.copyV3(j),_x2 = _this$copyV3.x,_y2 = _this$copyV3.y,_z2 = _this$copyV3.z;
          this._next.push(_x2, _y2, _z2);
          this._next.push(_x2, _y2, _z2);
        }
      }

      {
        // Create a 'next point' for the last point in the line. This 'next' point
        // of the last point in line can either be the same as the last point itself
        // (when the line does not form a loop), or the second point in line (when
        // the line is a loop).
        //
        var _copyFromIndex = isLoop ? 1 : l - 1;var _this$copyV4 =
        this.copyV3(_copyFromIndex),_x3 = _this$copyV4.x,_y3 = _this$copyV4.y,_z3 = _this$copyV4.z;

        this._next.push(_x3, _y3, _z3);
        this._next.push(_x3, _y3, _z3);
      }

      var positionArray = new Float32Array(this._position);
      var prevArray = new Float32Array(this._prev);
      var nextArray = new Float32Array(this._next);
      var sideArray = new Float32Array(this._side);
      var widthArray = new Float32Array(this._width);
      var indexArray = new Uint16Array(this._index);

      if (!this._attributes || this._attributes.position.length !== this._position.length) {
        this._attributes = {
          position: new THREE.BufferAttribute(positionArray, 3),
          prev: new THREE.BufferAttribute(prevArray, 3),
          next: new THREE.BufferAttribute(nextArray, 3),
          side: new THREE.BufferAttribute(sideArray, 1),
          width: new THREE.BufferAttribute(widthArray, 1),
          index: new THREE.BufferAttribute(indexArray, 1) };

      } else {
        this.updateAttribute(this._attributes.position, positionArray);
        this.updateAttribute(this._attributes.prev, prevArray);
        this.updateAttribute(this._attributes.next, nextArray);
        this.updateAttribute(this._attributes.side, sideArray);
        this.updateAttribute(this._attributes.width, widthArray);
        this.updateAttribute(this._attributes.index, indexArray);
      }

      if (!this._geometry) {
        this._geometry = new THREE.BufferGeometry();
      }

      this._geometry.setAttribute("position", this._attributes.position);
      this._geometry.setAttribute("prev", this._attributes.prev);
      this._geometry.setAttribute("next", this._attributes.next);
      this._geometry.setAttribute("side", this._attributes.side);
      this._geometry.setAttribute("width", this._attributes.width);
      this._geometry.setIndex(this._attributes.index);

      this._geometry.computeBoundingSphere();
      this._geometry.computeBoundingBox();
      this._geometry.visible = true;
    }

    /**
       * Fast method to advance the line by one position.  The oldest position is removed.
       * @param position
       */ }, { key: "advance", value: function advance(
    position) {
      var positions = this._attributes.position.array;
      var prev = this._attributes.prev.array;
      var next = this._attributes.next.array;
      var l = positions.length;

      // PREV
      memcpy(positions, 0, prev, 0, l);

      // POSITIONS
      memcpy(positions, 6, positions, 0, l - 6);

      positions[l - 6] = position.x;
      positions[l - 5] = position.y;
      positions[l - 4] = position.z;
      positions[l - 3] = position.x;
      positions[l - 2] = position.y;
      positions[l - 1] = position.z;

      // NEXT
      memcpy(positions, 6, next, 0, l - 6);

      next[l - 6] = position.x;
      next[l - 5] = position.y;
      next[l - 4] = position.z;
      next[l - 3] = position.x;
      next[l - 2] = position.y;
      next[l - 1] = position.z;

      this._attributes.position.needsUpdate = true;
      this._attributes.prev.needsUpdate = true;
      this._attributes.next.needsUpdate = true;
    } }, { key: "geometry", get: function get() {return this._geometry;} }]);return StreamLine;}();




/***/ }),

/***/ "./extensions/DataVisualization/streamline/StreamLineBuilder.js":
/*!**********************************************************************!*\
  !*** ./extensions/DataVisualization/streamline/StreamLineBuilder.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StreamLineBuilder": () => (/* binding */ StreamLineBuilder)
/* harmony export */ });
/* harmony import */ var _StreamLine_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StreamLine.js */ "./extensions/DataVisualization/streamline/StreamLine.js");
/* harmony import */ var _StreamLineMaterial_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StreamLineMaterial.js */ "./extensions/DataVisualization/streamline/StreamLineMaterial.js");
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}


/**
                                                               * A callback function that will be invoked when `StreamLineBuilder` needs to determine the
                                                               * line thickness for a given point along the `StreamLine`. This callback function can be
                                                               * specified in a call to `StreamLineBuilder.createStreamLine` API.
                                                               *
                                                               * @callback GetLineWidthScaleFunc
                                                               * @param {number} fraction The fraction number indicating the point this call is meant for.
                                                               * For example, for point `200` in a line segment with `250` points, this value will be `0.8`.
                                                               * @returns {number} The fraction of line thickness for this given point on the line. If this
                                                               * value is `1.0`, the line thickness at this point will be equivalent to the thickness value
                                                               * specified in `StreamLineSpecs.lineWidth`. If this value is `1.5` then the line thickness at
                                                               * this point will be `1.5` times the value of `StreamLineSpecs.lineWidth`.
                                                               */

/**
                                                                   * An object which carries the coordinates and colors of points that made up the line.
                                                                   *
                                                                   * @typedef {Object} StreamLineData
                                                                   * @property {Float32Array} points The point array specified as `Float32Array`. It is a linear
                                                                   * array that carries the coordinates of the points forming the line `[x0, y0, z0, x1, ... ]`.
                                                                   * @property {Float32Array} [colors] The colors for each point specified in the `points`
                                                                   * array. This array is specified as a `Float32Array` and carries point colors in the form
                                                                   * of `[ r0, g0, b0, r1, g1, ... ]`. If this parameter is specified, it should contain as many
                                                                   * elements as there are in `points` parameter.
                                                                   * @property {GetLineWidthScaleFunc} [scaleCallback] The callback for line segment thickness.
                                                                   * See `GetLineWidthScaleFunc` for further details.
                                                                   */

/**
                                                                       * An object representing the specifications of a stream line to be created. This object is
                                                                       * used in `StreamLineBuilder.createStreamLine` API.
                                                                       *
                                                                       * @typedef {Object} StreamLineSpecs
                                                                       * @property {number} lineWidth The width of the `StreamLine` object in terms of pixels.
                                                                       * Individual line segment widths can be specified as a fraction of this value through
                                                                       * `scaleCallback` function. See `GetLineWidthScaleFunc` for more details.
                                                                       * @property {THREE.Color} lineColor The global uniform line color. Individual segment colors
                                                                       * can be specified through `StreamLineData.colors` array. See `StreamLineData` for more
                                                                       * details.
                                                                       * @property {number} opacity The global uniform line opacity in the range of `[0.0, 1.0]`.
                                                                       * @property {StreamLineData} lineData The point data to initialize the `StreamLine` object
                                                                       * with. See `StreamLineData` for more details.
                                                                       */

var overlayName = "StreamLineOverlay";

/**
                                        * An object that assists in building `StreamLine` objects.
                                        * @class
                                        * @memberof Autodesk.DataVisualization.Core
                                        * @alias Autodesk.DataVisualization.Core.StreamLineBuilder
                                        */var
StreamLineBuilder = /*#__PURE__*/function () {
  /**
                                               * Constructs an instance of `StreamLineBuilder` object. For proper resource management
                                               * it is recommended to obtain a `StreamLineBuilder` through `DataVisualization` class.
                                               *
                                               * @param {Viewer3D} viewer The instance a `Viewer3D` to associate this object with.
                                               *
                                               * @example
                                               *  const dataVizExtn = await viewer.loadExtension("Autodesk.DataVisualization");
                                               *  const streamLineBuilder = dataVizExtn.streamLineBuilder;
                                               */
  function StreamLineBuilder(viewer) {_classCallCheck(this, StreamLineBuilder);
    this._viewer = viewer;
    this._overlayCreated = false;
    this._streamLines = [];
    this._cachedMaterials = {};
  }

  /**
     * Dispose of all the underlying `StreamLine` objects that are associated with this
     * `StreamLineBuilder` object. This also releases their corresponding material and
     * geometrical data.
     * @alias Autodesk.DataVisualization.Core.StreamLineBuilder#dispose
     */_createClass(StreamLineBuilder, [{ key: "dispose", value: function dispose()
    {var _this = this;
      // Dispose of all the 'Mesh' and 'StreamLine' objects first.
      this._streamLines.forEach(function (_ref) {var streamLine = _ref.streamLine,mesh = _ref.mesh;
        _this._removeMeshFromScene(mesh);
        streamLine.dispose();
      });

      this._streamLines = [];

      // Dispose of all 'StreamLineMaterial' instances.
      var materials = Object.values(this._cachedMaterials);
      materials.forEach(function (cachedMaterial) {return cachedMaterial.dispose();});
      this._cachedMaterials = {};

      if (this._overlayCreated) {
        this._overlayCreated = false;
        this._viewer.impl.removeOverlayScene(overlayName);
      }
    }

    /**
       * Creates `StreamLine` objects using the {@link StreamLineSpecs} and associates them with the
       * `StreamLineBuilder` object.
       * @param {StreamLineSpecs} streamLineSpecs See `StreamLineSpecs` for more details.
       * @returns {StreamLine}
       * @alias Autodesk.DataVisualization.Core.StreamLineBuilder#createStreamLine
       */ }, { key: "createStreamLine", value: function createStreamLine(
    streamLineSpecs) {
      var streamLine = new _StreamLine_js__WEBPACK_IMPORTED_MODULE_0__.StreamLine();
      streamLine.setPoints(new Float32Array(streamLineSpecs.lineData.points));

      var material = this._getOrCreateMaterial(streamLineSpecs);
      var mesh = new THREE.Mesh(streamLine.geometry, material);
      this._addMeshToScene(mesh);

      this._streamLines.push({ streamLine: streamLine, mesh: mesh });
      return streamLine;
    }

    /**
       * Removes the `StreamLine` object from the scene. This
       * method releases the geometrical data associated with the `StreamLine` object.
       * @alias Autodesk.DataVisualization.Core.StreamLineBuilder#destroyStreamLine
       * @param {StreamLine} streamLine The `StreamLine` object to be disposed of.
       * @alias Autodesk.DataVisualization.Core.StreamLineBuilder#destroyStreamLine
       */ }, { key: "destroyStreamLine", value: function destroyStreamLine(
    streamLine) {
      var index = this._streamLines.findIndex(function (entry) {
        return entry.streamLine === streamLine;
      });

      if (index >= 0) {
        var removed = this._streamLines.splice(index, 1);
        this._removeMeshFromScene(removed[0].mesh);
        removed[0].streamLine.dispose();
      }
    }

    /**
       * @private
       * @param {THREE.Mesh} mesh
       */ }, { key: "_addMeshToScene", value: function _addMeshToScene(
    mesh) {
      if (!this._overlayCreated) {
        this._overlayCreated = true;
        this._viewer.impl.createOverlayScene(overlayName);
      }

      this._viewer.impl.addOverlay(overlayName, mesh);
    }

    /**
       * @private
       * @param {THREE.Mesh} mesh
       */ }, { key: "_removeMeshFromScene", value: function _removeMeshFromScene(
    mesh) {
      if (this._overlayCreated) {
        this._viewer.impl.removeOverlay(overlayName, mesh);
      }
    }

    /**
       * @private
       * @param {StreamLineSpecs} streamLineSpecs
       */ }, { key: "_getOrCreateMaterial", value: function _getOrCreateMaterial(
    streamLineSpecs) {
      var lineColor = streamLineSpecs.lineColor;
      var opacity = streamLineSpecs.opacity;
      var lineWidth = streamLineSpecs.lineWidth;

      var id = _StreamLineMaterial_js__WEBPACK_IMPORTED_MODULE_1__.StreamLineMaterial.generateId(lineColor, opacity, lineWidth);
      var cachedMaterial = this._cachedMaterials[id];

      if (!cachedMaterial) {
        cachedMaterial = new _StreamLineMaterial_js__WEBPACK_IMPORTED_MODULE_1__.StreamLineMaterial({ lineColor: lineColor, opacity: opacity, lineWidth: lineWidth });
        this._cachedMaterials[id] = cachedMaterial;
      }

      return cachedMaterial;
    } }]);return StreamLineBuilder;}();




/***/ }),

/***/ "./extensions/DataVisualization/streamline/StreamLineMaterial.js":
/*!***********************************************************************!*\
  !*** ./extensions/DataVisualization/streamline/StreamLineMaterial.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StreamLineMaterial": () => (/* binding */ StreamLineMaterial)
/* harmony export */ });
/* harmony import */ var _StreamLineShaders_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StreamLineShaders.js */ "./extensions/DataVisualization/streamline/StreamLineShaders.js");


function StreamLineMaterial(parameters) {
  function check(v, d) {
    return v === undefined ? d : v;
  }

  THREE.Material.call(this);

  parameters = parameters || {};
  parameters = Object.assign(parameters, {
    side: THREE.DoubleSide,
    depthTest: true,
    depthWrite: false });


  this.lineColor = check(parameters.lineColor, new THREE.Color(0xffffff));
  this.opacity = check(parameters.opacity, 1.0);
  this.lineWidth = check(parameters.lineWidth, 6.0);

  delete parameters.lineColor;
  delete parameters.opacity;
  delete parameters.lineWidth;

  var vertexShader = _StreamLineShaders_js__WEBPACK_IMPORTED_MODULE_0__.StreamLineVert;
  var fragmentShader = _StreamLineShaders_js__WEBPACK_IMPORTED_MODULE_0__.StreamLineFrag;

  var material = new THREE.RawShaderMaterial({
    uniforms: {
      lineWidth: { type: "f", value: this.lineWidth },
      color: { type: "c", value: this.lineColor },
      opacity: { type: "f", value: this.opacity },
      resolution: { type: "v2", value: new THREE.Vector2(1920, 1080) },
      sizeAttenuation: { type: "f", value: 0.0 } },

    attributes: {
      position: { type: "v3", value: new THREE.Vector3() },
      prev: { type: "v3", value: new THREE.Vector3() },
      next: { type: "v3", value: new THREE.Vector3() },
      side: { type: "f", value: 0.0 },
      width: { type: "f", value: 0.0 } },

    vertexShader: vertexShader,
    fragmentShader: fragmentShader });


  material.type = "StreamLineMaterial";
  material.setValues(parameters);
  return material;
}

StreamLineMaterial.prototype = Object.create(THREE.Material.prototype);
StreamLineMaterial.prototype.constructor = StreamLineMaterial;

StreamLineMaterial.prototype.copy = function (source) {
  THREE.Material.prototype.copy.call(this, source);
  return this;
};

StreamLineMaterial.prototype.id = function () {
  return StreamLineMaterial.generateId(this.lineColor, this.opacity, this.lineWidth);
};

// Static function on 'StreamLineMaterial' object.
StreamLineMaterial.generateId = function (lineColor, opacity, lineWidth) {
  var _lineColor = lineColor.getHexString();
  var _opacity = opacity.toFixed(4);
  var _lineWidth = lineWidth.toFixed(4);
  return "".concat(_lineColor, "-").concat(_opacity, "-").concat(_lineWidth);
};



/***/ }),

/***/ "./extensions/DataVisualization/streamline/StreamLineShaders.js":
/*!**********************************************************************!*\
  !*** ./extensions/DataVisualization/streamline/StreamLineShaders.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StreamLineVert": () => (/* binding */ StreamLineVert),
/* harmony export */   "StreamLineFrag": () => (/* binding */ StreamLineFrag)
/* harmony export */ });
var StreamLineVert = "\n    attribute vec3 position;\n    attribute vec3 prev;\n    attribute vec3 next;\n    attribute float side;\n    attribute float width;\n\n    uniform mat4 projectionMatrix;\n    uniform mat4 modelViewMatrix;\n    uniform vec2 resolution;\n    uniform float lineWidth;\n    uniform vec3 color;\n    uniform float opacity;\n    uniform float sizeAttenuation;\n\n    varying vec4 vColor;\n\n    vec2 fix( vec4 i, float aspect ) {\n\n        vec2 res = i.xy / i.w;\n        res.x *= aspect;\n        return res;\n    }\n\n    void main() {\n        float aspect = resolution.x / resolution.y;\n\n        vColor = vec4( color, opacity );\n\n        mat4 m = projectionMatrix * modelViewMatrix;\n        vec4 finalPosition = m * vec4( position, 1.0 );\n        vec4 prevPos = m * vec4( prev, 1.0 );\n        vec4 nextPos = m * vec4( next, 1.0 );\n\n        vec2 currP = fix( finalPosition, aspect );\n        vec2 prevP = fix( prevPos, aspect );\n        vec2 nextP = fix( nextPos, aspect );\n\n        float w = lineWidth * width;\n\n        vec2 dir;\n        if ( nextP == currP ) {\n            dir = normalize( currP - prevP );\n        }\n        else if( prevP == currP ) {\n            dir = normalize( nextP - currP );\n        }\n        else {\n            vec2 dir1 = normalize( currP - prevP );\n            vec2 dir2 = normalize( nextP - currP );\n            dir = normalize( dir1 + dir2 );\n\n            vec2 perp = vec2( -dir1.y, dir1.x );\n            vec2 miter = vec2( -dir.y, dir.x );\n            w = clamp( w / dot( miter, perp ), 0., 4. * lineWidth * width );\n        }\n\n        vec4 normal = vec4( -dir.y, dir.x, 0., 1. );\n        normal.xy *= .5 * w;\n        normal *= projectionMatrix;\n\n        if ( sizeAttenuation == 0. ) {\n            normal.xy *= finalPosition.w;\n            normal.xy /= ( vec4( resolution, 0., 1. ) * projectionMatrix ).xy;\n        }\n\n        finalPosition.xy += normal.xy * side;\n        gl_Position = finalPosition;\n    }\n";






































































var StreamLineFrag = "\n    varying vec4 vColor;\n\n    void main() {\n        gl_FragColor = vColor;\n    }\n";









/***/ }),

/***/ "three":
/*!************************!*\
  !*** external "THREE" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = THREE;

/***/ }),

/***/ "./node_modules/maxrects-packer/dist/maxrects-packer.mjs":
/*!***************************************************************!*\
  !*** ./node_modules/maxrects-packer/dist/maxrects-packer.mjs ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Bin": () => (/* binding */ Bin),
/* harmony export */   "MaxRectsBin": () => (/* binding */ MaxRectsBin),
/* harmony export */   "MaxRectsPacker": () => (/* binding */ MaxRectsPacker),
/* harmony export */   "OversizedElementBin": () => (/* binding */ OversizedElementBin),
/* harmony export */   "PACKING_LOGIC": () => (/* binding */ PACKING_LOGIC),
/* harmony export */   "Rectangle": () => (/* binding */ Rectangle)
/* harmony export */ });
class Rectangle {
    /**
     * Creates an instance of Rectangle.
     *
     * @param {number} [width=0]
     * @param {number} [height=0]
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @param {boolean} [rot=false]
     * @param {boolean} [allowRotation=false]
     * @memberof Rectangle
     */
    constructor(width = 0, height = 0, x = 0, y = 0, rot = false, allowRotation = undefined) {
        /**
         * Oversized tag on rectangle which is bigger than packer itself.
         *
         * @type {boolean}
         * @memberof Rectangle
         */
        this.oversized = false;
        this._rot = false;
        this._allowRotation = undefined;
        this._dirty = 0;
        this._width = width;
        this._height = height;
        this._x = x;
        this._y = y;
        this._data = {};
        this._rot = rot;
        this._allowRotation = allowRotation;
    }
    /**
     * Test if two given rectangle collide each other
     *
     * @static
     * @param {IRectangle} first
     * @param {IRectangle} second
     * @returns
     * @memberof Rectangle
     */
    static Collide(first, second) { return first.collide(second); }
    /**
     * Test if the first rectangle contains the second one
     *
     * @static
     * @param {IRectangle} first
     * @param {IRectangle} second
     * @returns
     * @memberof Rectangle
     */
    static Contain(first, second) { return first.contain(second); }
    /**
     * Get the area (w * h) of the rectangle
     *
     * @returns {number}
     * @memberof Rectangle
     */
    area() { return this.width * this.height; }
    /**
     * Test if the given rectangle collide with this rectangle.
     *
     * @param {IRectangle} rect
     * @returns {boolean}
     * @memberof Rectangle
     */
    collide(rect) {
        return (rect.x < this.x + this.width &&
            rect.x + rect.width > this.x &&
            rect.y < this.y + this.height &&
            rect.y + rect.height > this.y);
    }
    /**
     * Test if this rectangle contains the given rectangle.
     *
     * @param {IRectangle} rect
     * @returns {boolean}
     * @memberof Rectangle
     */
    contain(rect) {
        return (rect.x >= this.x && rect.y >= this.y &&
            rect.x + rect.width <= this.x + this.width && rect.y + rect.height <= this.y + this.height);
    }
    get width() { return this._width; }
    set width(value) {
        if (value === this._width)
            return;
        this._width = value;
        this._dirty++;
    }
    get height() { return this._height; }
    set height(value) {
        if (value === this._height)
            return;
        this._height = value;
        this._dirty++;
    }
    get x() { return this._x; }
    set x(value) {
        if (value === this._x)
            return;
        this._x = value;
        this._dirty++;
    }
    get y() { return this._y; }
    set y(value) {
        if (value === this._y)
            return;
        this._y = value;
        this._dirty++;
    }
    /**
     * If the rectangle is rotated
     *
     * @type {boolean}
     * @memberof Rectangle
     */
    get rot() { return this._rot; }
    /**
     * Set the rotate tag of the rectangle.
     *
     * note: after `rot` is set, `width/height` of this rectangle is swaped.
     *
     * @memberof Rectangle
     */
    set rot(value) {
        if (this._allowRotation === false)
            return;
        if (this._rot !== value) {
            const tmp = this.width;
            this.width = this.height;
            this.height = tmp;
            this._rot = value;
            this._dirty++;
        }
    }
    /**
     * If the rectangle allow rotation
     *
     * @type {boolean}
     * @memberof Rectangle
     */
    get allowRotation() { return this._allowRotation; }
    /**
     * Set the allowRotation tag of the rectangle.
     *
     * @memberof Rectangle
     */
    set allowRotation(value) {
        if (this._allowRotation !== value) {
            this._allowRotation = value;
            this._dirty++;
        }
    }
    get data() { return this._data; }
    set data(value) {
        if (value === null || value === this._data)
            return;
        this._data = value;
        // extract allowRotation settings
        if (typeof value === "object" && value.hasOwnProperty("allowRotation")) {
            this._allowRotation = value.allowRotation;
        }
        this._dirty++;
    }
    get dirty() { return this._dirty > 0; }
    setDirty(value = true) { this._dirty = value ? this._dirty + 1 : 0; }
}

class Bin {
    constructor() {
        this._dirty = 0;
    }
    get dirty() { return this._dirty > 0 || this.rects.some(rect => rect.dirty); }
    /**
     * Set bin dirty status
     *
     * @memberof Bin
     */
    setDirty(value = true) {
        this._dirty = value ? this._dirty + 1 : 0;
        if (!value) {
            for (let rect of this.rects) {
                if (rect.setDirty)
                    rect.setDirty(false);
            }
        }
    }
}

class MaxRectsBin extends Bin {
    constructor(maxWidth = EDGE_MAX_VALUE, maxHeight = EDGE_MAX_VALUE, padding = 0, options = {}) {
        super();
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.padding = padding;
        this.freeRects = [];
        this.rects = [];
        this.verticalExpand = false;
        this.options = {
            smart: true,
            pot: true,
            square: true,
            allowRotation: false,
            tag: false,
            exclusiveTag: true,
            border: 0,
            logic: PACKING_LOGIC.MAX_EDGE
        };
        this.options = Object.assign(Object.assign({}, this.options), options);
        this.width = this.options.smart ? 0 : maxWidth;
        this.height = this.options.smart ? 0 : maxHeight;
        this.border = this.options.border ? this.options.border : 0;
        this.freeRects.push(new Rectangle(this.maxWidth + this.padding - this.border * 2, this.maxHeight + this.padding - this.border * 2, this.border, this.border));
        this.stage = new Rectangle(this.width, this.height);
    }
    add(...args) {
        let data;
        let rect;
        if (args.length === 1) {
            if (typeof args[0] !== 'object')
                throw new Error("MacrectsBin.add(): Wrong parameters");
            rect = args[0];
            // Check if rect.tag match bin.tag, if bin.tag not defined, it will accept any rect
            let tag = (rect.data && rect.data.tag) ? rect.data.tag : rect.tag ? rect.tag : undefined;
            if (this.options.tag && this.options.exclusiveTag && this.tag !== tag)
                return undefined;
        }
        else {
            data = args.length > 2 ? args[2] : null;
            // Check if data.tag match bin.tag, if bin.tag not defined, it will accept any rect
            if (this.options.tag && this.options.exclusiveTag) {
                if (data && this.tag !== data.tag)
                    return undefined;
                if (!data && this.tag)
                    return undefined;
            }
            rect = new Rectangle(args[0], args[1]);
            rect.data = data;
            rect.setDirty(false);
        }
        const result = this.place(rect);
        if (result)
            this.rects.push(result);
        return result;
    }
    repack() {
        let unpacked = [];
        this.reset();
        // re-sort rects from big to small
        this.rects.sort((a, b) => {
            const result = Math.max(b.width, b.height) - Math.max(a.width, a.height);
            if (result === 0 && a.hash && b.hash) {
                return a.hash > b.hash ? -1 : 1;
            }
            else
                return result;
        });
        for (let rect of this.rects) {
            if (!this.place(rect)) {
                unpacked.push(rect);
            }
        }
        for (let rect of unpacked)
            this.rects.splice(this.rects.indexOf(rect), 1);
        return unpacked.length > 0 ? unpacked : undefined;
    }
    reset(deepReset = false, resetOption = false) {
        if (deepReset) {
            if (this.data)
                delete this.data;
            if (this.tag)
                delete this.tag;
            this.rects = [];
            if (resetOption) {
                this.options = {
                    smart: true,
                    pot: true,
                    square: true,
                    allowRotation: false,
                    tag: false,
                    border: 0
                };
            }
        }
        this.width = this.options.smart ? 0 : this.maxWidth;
        this.height = this.options.smart ? 0 : this.maxHeight;
        this.border = this.options.border ? this.options.border : 0;
        this.freeRects = [new Rectangle(this.maxWidth + this.padding - this.border * 2, this.maxHeight + this.padding - this.border * 2, this.border, this.border)];
        this.stage = new Rectangle(this.width, this.height);
        this._dirty = 0;
    }
    clone() {
        let clonedBin = new MaxRectsBin(this.maxWidth, this.maxHeight, this.padding, this.options);
        for (let rect of this.rects) {
            clonedBin.add(rect);
        }
        return clonedBin;
    }
    place(rect) {
        // recheck if tag matched
        let tag = (rect.data && rect.data.tag) ? rect.data.tag : rect.tag ? rect.tag : undefined;
        if (this.options.tag && this.options.exclusiveTag && this.tag !== tag)
            return undefined;
        let node;
        let allowRotation;
        // getter/setter do not support hasOwnProperty()
        if (rect.hasOwnProperty("_allowRotation") && rect.allowRotation !== undefined) {
            allowRotation = rect.allowRotation; // Per Rectangle allowRotation override packer settings
        }
        else {
            allowRotation = this.options.allowRotation;
        }
        node = this.findNode(rect.width + this.padding, rect.height + this.padding, allowRotation);
        if (node) {
            this.updateBinSize(node);
            let numRectToProcess = this.freeRects.length;
            let i = 0;
            while (i < numRectToProcess) {
                if (this.splitNode(this.freeRects[i], node)) {
                    this.freeRects.splice(i, 1);
                    numRectToProcess--;
                    i--;
                }
                i++;
            }
            this.pruneFreeList();
            this.verticalExpand = this.width > this.height ? true : false;
            rect.x = node.x;
            rect.y = node.y;
            if (rect.rot === undefined)
                rect.rot = false;
            rect.rot = node.rot ? !rect.rot : rect.rot;
            this._dirty++;
            return rect;
        }
        else if (!this.verticalExpand) {
            if (this.updateBinSize(new Rectangle(rect.width + this.padding, rect.height + this.padding, this.width + this.padding - this.border, this.border)) || this.updateBinSize(new Rectangle(rect.width + this.padding, rect.height + this.padding, this.border, this.height + this.padding - this.border))) {
                return this.place(rect);
            }
        }
        else {
            if (this.updateBinSize(new Rectangle(rect.width + this.padding, rect.height + this.padding, this.border, this.height + this.padding - this.border)) || this.updateBinSize(new Rectangle(rect.width + this.padding, rect.height + this.padding, this.width + this.padding - this.border, this.border))) {
                return this.place(rect);
            }
        }
        return undefined;
    }
    findNode(width, height, allowRotation) {
        let score = Number.MAX_VALUE;
        let areaFit;
        let r;
        let bestNode;
        for (let i in this.freeRects) {
            r = this.freeRects[i];
            if (r.width >= width && r.height >= height) {
                areaFit = (this.options.logic === PACKING_LOGIC.MAX_AREA) ?
                    r.width * r.height - width * height :
                    Math.min(r.width - width, r.height - height);
                if (areaFit < score) {
                    bestNode = new Rectangle(width, height, r.x, r.y);
                    score = areaFit;
                }
            }
            if (!allowRotation)
                continue;
            // Continue to test 90-degree rotated rectangle
            if (r.width >= height && r.height >= width) {
                areaFit = (this.options.logic === PACKING_LOGIC.MAX_AREA) ?
                    r.width * r.height - height * width :
                    Math.min(r.height - width, r.width - height);
                if (areaFit < score) {
                    bestNode = new Rectangle(height, width, r.x, r.y, true); // Rotated node
                    score = areaFit;
                }
            }
        }
        return bestNode;
    }
    splitNode(freeRect, usedNode) {
        // Test if usedNode intersect with freeRect
        if (!freeRect.collide(usedNode))
            return false;
        // Do vertical split
        if (usedNode.x < freeRect.x + freeRect.width && usedNode.x + usedNode.width > freeRect.x) {
            // New node at the top side of the used node
            if (usedNode.y > freeRect.y && usedNode.y < freeRect.y + freeRect.height) {
                let newNode = new Rectangle(freeRect.width, usedNode.y - freeRect.y, freeRect.x, freeRect.y);
                this.freeRects.push(newNode);
            }
            // New node at the bottom side of the used node
            if (usedNode.y + usedNode.height < freeRect.y + freeRect.height) {
                let newNode = new Rectangle(freeRect.width, freeRect.y + freeRect.height - (usedNode.y + usedNode.height), freeRect.x, usedNode.y + usedNode.height);
                this.freeRects.push(newNode);
            }
        }
        // Do Horizontal split
        if (usedNode.y < freeRect.y + freeRect.height &&
            usedNode.y + usedNode.height > freeRect.y) {
            // New node at the left side of the used node.
            if (usedNode.x > freeRect.x && usedNode.x < freeRect.x + freeRect.width) {
                let newNode = new Rectangle(usedNode.x - freeRect.x, freeRect.height, freeRect.x, freeRect.y);
                this.freeRects.push(newNode);
            }
            // New node at the right side of the used node.
            if (usedNode.x + usedNode.width < freeRect.x + freeRect.width) {
                let newNode = new Rectangle(freeRect.x + freeRect.width - (usedNode.x + usedNode.width), freeRect.height, usedNode.x + usedNode.width, freeRect.y);
                this.freeRects.push(newNode);
            }
        }
        return true;
    }
    pruneFreeList() {
        // Go through each pair of freeRects and remove any rects that is redundant
        let i = 0;
        let j = 0;
        let len = this.freeRects.length;
        while (i < len) {
            j = i + 1;
            let tmpRect1 = this.freeRects[i];
            while (j < len) {
                let tmpRect2 = this.freeRects[j];
                if (tmpRect2.contain(tmpRect1)) {
                    this.freeRects.splice(i, 1);
                    i--;
                    len--;
                    break;
                }
                if (tmpRect1.contain(tmpRect2)) {
                    this.freeRects.splice(j, 1);
                    j--;
                    len--;
                }
                j++;
            }
            i++;
        }
    }
    updateBinSize(node) {
        if (!this.options.smart)
            return false;
        if (this.stage.contain(node))
            return false;
        let tmpWidth = Math.max(this.width, node.x + node.width - this.padding + this.border);
        let tmpHeight = Math.max(this.height, node.y + node.height - this.padding + this.border);
        if (this.options.allowRotation) {
            // do extra test on rotated node whether it's a better choice
            const rotWidth = Math.max(this.width, node.x + node.height - this.padding + this.border);
            const rotHeight = Math.max(this.height, node.y + node.width - this.padding + this.border);
            if (rotWidth * rotHeight < tmpWidth * tmpHeight) {
                tmpWidth = rotWidth;
                tmpHeight = rotHeight;
            }
        }
        if (this.options.pot) {
            tmpWidth = Math.pow(2, Math.ceil(Math.log(tmpWidth) * Math.LOG2E));
            tmpHeight = Math.pow(2, Math.ceil(Math.log(tmpHeight) * Math.LOG2E));
        }
        if (this.options.square) {
            tmpWidth = tmpHeight = Math.max(tmpWidth, tmpHeight);
        }
        if (tmpWidth > this.maxWidth + this.padding || tmpHeight > this.maxHeight + this.padding) {
            return false;
        }
        this.expandFreeRects(tmpWidth + this.padding, tmpHeight + this.padding);
        this.width = this.stage.width = tmpWidth;
        this.height = this.stage.height = tmpHeight;
        return true;
    }
    expandFreeRects(width, height) {
        this.freeRects.forEach((freeRect, index) => {
            if (freeRect.x + freeRect.width >= Math.min(this.width + this.padding - this.border, width)) {
                freeRect.width = width - freeRect.x - this.border;
            }
            if (freeRect.y + freeRect.height >= Math.min(this.height + this.padding - this.border, height)) {
                freeRect.height = height - freeRect.y - this.border;
            }
        }, this);
        this.freeRects.push(new Rectangle(width - this.width - this.padding, height - this.border * 2, this.width + this.padding - this.border, this.border));
        this.freeRects.push(new Rectangle(width - this.border * 2, height - this.height - this.padding, this.border, this.height + this.padding - this.border));
        this.freeRects = this.freeRects.filter(freeRect => {
            return !(freeRect.width <= 0 || freeRect.height <= 0 || freeRect.x < this.border || freeRect.y < this.border);
        });
        this.pruneFreeList();
    }
}

class OversizedElementBin extends Bin {
    constructor(...args) {
        super();
        this.rects = [];
        if (args.length === 1) {
            if (typeof args[0] !== 'object')
                throw new Error("OversizedElementBin: Wrong parameters");
            const rect = args[0];
            this.rects = [rect];
            this.width = rect.width;
            this.height = rect.height;
            this.data = rect.data;
            rect.oversized = true;
        }
        else {
            this.width = args[0];
            this.height = args[1];
            this.data = args.length > 2 ? args[2] : null;
            const rect = new Rectangle(this.width, this.height);
            rect.oversized = true;
            rect.data = this.data;
            this.rects.push(rect);
        }
        this.freeRects = [];
        this.maxWidth = this.width;
        this.maxHeight = this.height;
        this.options = { smart: false, pot: false, square: false };
    }
    add() { return undefined; }
    reset(deepReset = false) {
        // nothing to do here
    }
    repack() { return undefined; }
    clone() {
        let clonedBin = new OversizedElementBin(this.rects[0]);
        return clonedBin;
    }
}

const EDGE_MAX_VALUE = 4096;
var PACKING_LOGIC;
(function (PACKING_LOGIC) {
    PACKING_LOGIC[PACKING_LOGIC["MAX_AREA"] = 0] = "MAX_AREA";
    PACKING_LOGIC[PACKING_LOGIC["MAX_EDGE"] = 1] = "MAX_EDGE";
})(PACKING_LOGIC || (PACKING_LOGIC = {}));
class MaxRectsPacker {
    /**
     * Creates an instance of MaxRectsPacker.
     * @param {number} width of the output atlas (default is 4096)
     * @param {number} height of the output atlas (default is 4096)
     * @param {number} padding between glyphs/images (default is 0)
     * @param {IOption} [options={}] (Optional) packing options
     * @memberof MaxRectsPacker
     */
    constructor(width = EDGE_MAX_VALUE, height = EDGE_MAX_VALUE, padding = 0, options = {}) {
        this.width = width;
        this.height = height;
        this.padding = padding;
        /**
         * Options for MaxRect Packer
         * @property {boolean} options.smart Smart sizing packer (default is true)
         * @property {boolean} options.pot use power of 2 sizing (default is true)
         * @property {boolean} options.square use square size (default is false)
         * @property {boolean} options.allowRotation allow rotation packing (default is false)
         * @property {boolean} options.tag allow auto grouping based on `rect.tag` (default is false)
         * @property {boolean} options.exclusiveTag tagged rects will have dependent bin, if set to `false`, packer will try to put tag rects into the same bin (default is true)
         * @property {boolean} options.border atlas edge spacing (default is 0)
         * @property {PACKING_LOGIC} options.logic MAX_AREA or MAX_EDGE based sorting logic (default is MAX_EDGE)
         * @export
         * @interface Option
         */
        this.options = {
            smart: true,
            pot: true,
            square: false,
            allowRotation: false,
            tag: false,
            exclusiveTag: true,
            border: 0,
            logic: PACKING_LOGIC.MAX_EDGE
        };
        this._currentBinIndex = 0;
        this.bins = [];
        this.options = Object.assign(Object.assign({}, this.options), options);
    }
    add(...args) {
        if (args.length === 1) {
            if (typeof args[0] !== 'object')
                throw new Error("MacrectsPacker.add(): Wrong parameters");
            const rect = args[0];
            if (rect.width > this.width || rect.height > this.height) {
                this.bins.push(new OversizedElementBin(rect));
            }
            else {
                let added = this.bins.slice(this._currentBinIndex).find(bin => bin.add(rect) !== undefined);
                if (!added) {
                    let bin = new MaxRectsBin(this.width, this.height, this.padding, this.options);
                    let tag = (rect.data && rect.data.tag) ? rect.data.tag : rect.tag ? rect.tag : undefined;
                    if (this.options.tag && tag)
                        bin.tag = tag;
                    bin.add(rect);
                    this.bins.push(bin);
                }
            }
            return rect;
        }
        else {
            const rect = new Rectangle(args[0], args[1]);
            if (args.length > 2)
                rect.data = args[2];
            if (rect.width > this.width || rect.height > this.height) {
                this.bins.push(new OversizedElementBin(rect));
            }
            else {
                let added = this.bins.slice(this._currentBinIndex).find(bin => bin.add(rect) !== undefined);
                if (!added) {
                    let bin = new MaxRectsBin(this.width, this.height, this.padding, this.options);
                    if (this.options.tag && rect.data.tag)
                        bin.tag = rect.data.tag;
                    bin.add(rect);
                    this.bins.push(bin);
                }
            }
            return rect;
        }
    }
    /**
     * Add an Array of bins/rectangles to the packer.
     *
     * `Javascript`: Any object has property: { width, height, ... } is accepted.
     *
     * `Typescript`: object shall extends `MaxrectsPacker.IRectangle`.
     *
     * note: object has `hash` property will have more stable packing result
     *
     * @param {IRectangle[]} rects Array of bin/rectangles
     * @memberof MaxRectsPacker
     */
    addArray(rects) {
        if (!this.options.tag || this.options.exclusiveTag) {
            // if not using tag or using exclusiveTag, old approach
            this.sort(rects, this.options.logic).forEach(rect => this.add(rect));
        }
        else {
            // sort rects by tags first
            if (rects.length === 0)
                return;
            rects.sort((a, b) => {
                const aTag = (a.data && a.data.tag) ? a.data.tag : a.tag ? a.tag : undefined;
                const bTag = (b.data && b.data.tag) ? b.data.tag : b.tag ? b.tag : undefined;
                return bTag === undefined ? -1 : aTag === undefined ? 1 : bTag > aTag ? -1 : 1;
            });
            // iterate all bins to find the first bin which can place rects with same tag
            //
            let currentTag;
            let currentIdx = 0;
            let targetBin = this.bins.slice(this._currentBinIndex).find(bin => {
                let testBin = bin.clone();
                for (let i = currentIdx; i < rects.length; i++) {
                    const rect = rects[i];
                    const tag = (rect.data && rect.data.tag) ? rect.data.tag : rect.tag ? rect.tag : undefined;
                    // initialize currentTag
                    if (i === 0)
                        currentTag = tag;
                    if (tag !== currentTag) {
                        // all current tag memeber tested successfully
                        currentTag = tag;
                        // do addArray()
                        this.sort(rects.slice(currentIdx, i), this.options.logic).forEach(r => bin.add(r));
                        currentIdx = i;
                        // recrusively addArray() with remaining rects
                        this.addArray(rects.slice(i));
                        return true;
                    }
                    // remaining untagged rect will use normal addArray()
                    if (tag === undefined) {
                        // do addArray()
                        this.sort(rects.slice(i), this.options.logic).forEach(r => this.add(r));
                        currentIdx = rects.length;
                        // end test
                        return true;
                    }
                    // still in the same tag group
                    if (testBin.add(rect) === undefined) {
                        // current bin cannot contain all tag members
                        // procceed to test next bin
                        return false;
                    }
                }
                // all rects tested
                // do addArray() to the remaining tag group
                this.sort(rects.slice(currentIdx), this.options.logic).forEach(r => bin.add(r));
                return true;
            });
            // create a new bin if no current bin fit
            if (!targetBin) {
                const rect = rects[currentIdx];
                const bin = new MaxRectsBin(this.width, this.height, this.padding, this.options);
                const tag = (rect.data && rect.data.tag) ? rect.data.tag : rect.tag ? rect.tag : undefined;
                if (this.options.tag && this.options.exclusiveTag && tag)
                    bin.tag = tag;
                this.bins.push(bin);
                this.addArray(rects.slice(currentIdx));
            }
        }
    }
    /**
     * Reset entire packer to initial states, keep settings
     *
     * @memberof MaxRectsPacker
     */
    reset() {
        this.bins = [];
        this._currentBinIndex = 0;
    }
    /**
     * Repack all elements inside bins
     *
     * @param {boolean} [quick=true] quick repack only dirty bins
     * @returns {void}
     * @memberof MaxRectsPacker
     */
    repack(quick = true) {
        if (quick) {
            let unpack = [];
            for (let bin of this.bins) {
                if (bin.dirty) {
                    let up = bin.repack();
                    if (up)
                        unpack.push(...up);
                }
            }
            this.addArray(unpack);
            return;
        }
        if (!this.dirty)
            return;
        const allRects = this.rects;
        this.reset();
        this.addArray(allRects);
    }
    /**
     * Stop adding new element to the current bin and return a new bin.
     *
     * note: After calling `next()` all elements will no longer added to previous bins.
     *
     * @returns {Bin}
     * @memberof MaxRectsPacker
     */
    next() {
        this._currentBinIndex = this.bins.length;
        return this._currentBinIndex;
    }
    /**
     * Load bins to the packer, overwrite exist bins
     * @param {MaxRectsBin[]} bins MaxRectsBin objects
     * @memberof MaxRectsPacker
     */
    load(bins) {
        bins.forEach((bin, index) => {
            if (bin.maxWidth > this.width || bin.maxHeight > this.height) {
                this.bins.push(new OversizedElementBin(bin.width, bin.height, {}));
            }
            else {
                let newBin = new MaxRectsBin(this.width, this.height, this.padding, bin.options);
                newBin.freeRects.splice(0);
                bin.freeRects.forEach((r, i) => {
                    newBin.freeRects.push(new Rectangle(r.width, r.height, r.x, r.y));
                });
                newBin.width = bin.width;
                newBin.height = bin.height;
                if (bin.tag)
                    newBin.tag = bin.tag;
                this.bins[index] = newBin;
            }
        }, this);
    }
    /**
     * Output current bins to save
     * @memberof MaxRectsPacker
     */
    save() {
        let saveBins = [];
        this.bins.forEach((bin => {
            let saveBin = {
                width: bin.width,
                height: bin.height,
                maxWidth: bin.maxWidth,
                maxHeight: bin.maxHeight,
                freeRects: [],
                rects: [],
                options: bin.options
            };
            if (bin.tag)
                saveBin = Object.assign(Object.assign({}, saveBin), { tag: bin.tag });
            bin.freeRects.forEach(r => {
                saveBin.freeRects.push({
                    x: r.x,
                    y: r.y,
                    width: r.width,
                    height: r.height
                });
            });
            saveBins.push(saveBin);
        }));
        return saveBins;
    }
    /**
     * Sort the given rects based on longest edge or surface area.
     *
     * If rects have the same sort value, will sort by second key `hash` if presented.
     *
     * @private
     * @param {T[]} rects
     * @param {PACKING_LOGIC} [logic=PACKING_LOGIC.MAX_EDGE] sorting logic, "area" or "edge"
     * @returns
     * @memberof MaxRectsPacker
     */
    sort(rects, logic = PACKING_LOGIC.MAX_EDGE) {
        return rects.slice().sort((a, b) => {
            const result = (logic === PACKING_LOGIC.MAX_EDGE) ?
                Math.max(b.width, b.height) - Math.max(a.width, a.height) :
                b.width * b.height - a.width * a.height;
            if (result === 0 && a.hash && b.hash) {
                return a.hash > b.hash ? -1 : 1;
            }
            else
                return result;
        });
    }
    /**
     * Return current functioning bin index, perior to this wont accept any new elements
     *
     * @readonly
     * @type {number}
     * @memberof MaxRectsPacker
     */
    get currentBinIndex() { return this._currentBinIndex; }
    /**
     * Returns dirty status of all child bins
     *
     * @readonly
     * @type {boolean}
     * @memberof MaxRectsPacker
     */
    get dirty() { return this.bins.some(bin => bin.dirty); }
    /**
     * Return all rectangles in this packer
     *
     * @readonly
     * @type {T[]}
     * @memberof MaxRectsPacker
     */
    get rects() {
        let allRects = [];
        for (let bin of this.bins) {
            allRects.push(...bin.rects);
        }
        return allRects;
    }
}


//# sourceMappingURL=maxrects-packer.mjs.map


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
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***********************************************!*\
  !*** ./extensions/DataVisualization/index.js ***!
  \***********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants.js */ "./extensions/DataVisualization/Constants.js");
/* harmony import */ var _Constants_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Constants_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _SceneTool_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SceneTool.js */ "./extensions/DataVisualization/SceneTool.js");
/* harmony import */ var _SpriteMeshBuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SpriteMeshBuilder */ "./extensions/DataVisualization/SpriteMeshBuilder.js");
/* harmony import */ var _SpriteMeshBuilder__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_SpriteMeshBuilder__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _CustomViewables__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CustomViewables */ "./extensions/DataVisualization/CustomViewables.js");
/* harmony import */ var _ModelStructureInfo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ModelStructureInfo */ "./extensions/DataVisualization/ModelStructureInfo.js");
/* harmony import */ var _heatmap_SurfaceShading__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./heatmap/SurfaceShading */ "./extensions/DataVisualization/heatmap/SurfaceShading.js");
/* harmony import */ var _heatmap_PlanarHeatmap__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./heatmap/PlanarHeatmap */ "./extensions/DataVisualization/heatmap/PlanarHeatmap.js");
/* harmony import */ var _TextureUtils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./TextureUtils */ "./extensions/DataVisualization/TextureUtils.js");
/* harmony import */ var _heatmap_IDWDataProcessor__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./heatmap/IDWDataProcessor */ "./extensions/DataVisualization/heatmap/IDWDataProcessor.js");
/* harmony import */ var _heatmap_SurfaceShadingData__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./heatmap/SurfaceShadingData */ "./extensions/DataVisualization/heatmap/SurfaceShadingData.js");
/* harmony import */ var _heatmap_SurfaceShadingData__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_heatmap_SurfaceShadingData__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _streamline_StreamLineBuilder_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./streamline/StreamLineBuilder.js */ "./extensions/DataVisualization/streamline/StreamLineBuilder.js");
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * Extension Entry file
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * Examples about how to use this extension can be found:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * https://git.autodesk.com/A360/hyperion/blob/develop/client/pages/Heatmap.jsx
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * https://git.autodesk.com/A360/hyperion/blob/develop/client/pages/Dot.jsx
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * https://git.autodesk.com/A360/hyperion/blob/develop/client/pages/EngineSimulation.jsx
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * https://git.autodesk.com/A360/hyperion/blob/develop/client/pages/ReferenceApp.jsx
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         */













var extnName = "Autodesk.DataVisualization";
var extNameSpace = extnName + ".Core";
var ns = AutodeskNamespace(extNameSpace);
ns = Object.assign(ns, _CustomViewables__WEBPACK_IMPORTED_MODULE_3__);
ns = Object.assign(ns, (_Constants_js__WEBPACK_IMPORTED_MODULE_0___default()));
ns = Object.assign(ns, _heatmap_SurfaceShadingData__WEBPACK_IMPORTED_MODULE_9__);

ns.Room = _ModelStructureInfo__WEBPACK_IMPORTED_MODULE_4__.Room;
ns.LevelRoomsMap = _ModelStructureInfo__WEBPACK_IMPORTED_MODULE_4__.LevelRoomsMap;
ns.ModelStructureInfo = _ModelStructureInfo__WEBPACK_IMPORTED_MODULE_4__.ModelStructureInfo;
ns.SurfaceShading = _heatmap_SurfaceShading__WEBPACK_IMPORTED_MODULE_5__.SurfaceShading;
ns.PlanarHeatmap = _heatmap_PlanarHeatmap__WEBPACK_IMPORTED_MODULE_6__.PlanarHeatmap;
ns.IDWDataProcessor = _heatmap_IDWDataProcessor__WEBPACK_IMPORTED_MODULE_8__.IDWDataProcessor;
ns.IDWProcessMaterial = _heatmap_IDWDataProcessor__WEBPACK_IMPORTED_MODULE_8__.IDWProcessMaterial;

var av = Autodesk.Viewing;
var avp = av.Private;
var datavizDotOverlay = "DataVizDots";

/**
                                        * Callback function to retrieve the normalized value of a sensor given a
                                        * device identifier and sensor type. The callback function should return a
                                        * normalized value in the range of `[0.0, 1.0]`.
                                        *
                                        * @callback SensorValueCallback
                                        * @property {SurfaceShadingPoint} shadingPoint The generated SurfaceShadingPoint from
                                        * a prior call to `ModelStructureInfo.generateSurfaceShadingData` method or one from
                                        * a manually created {@link SurfaceShadingData}.
                                        * @property {string} sensorType An sensor type that was specified when
                                        * the `Device` was created.
                                        * @property {Object} data Previous data only defined when rendering or
                                        * updating {@link PlanarHeatmap}
                                        * @returns {number} A normalized sensor value in the range of `[0.0, 1.0]`.
                                        * If `NaN` (not a number) is returned, the sensor will have no influence in the
                                        * resulting heatmap color (it is as though the sensor did not exist).
                                        */

/**
                                            * The object that includes the value for one or more `CustomViewable` properties
                                            * to be updated when the viewable is being invalidated. If a property is omitted,
                                            * its value in `CustomViewable` will remain unchanged.
                                            *
                                            * @typedef {Object} PropertyUpdates
                                            * @property {number} [scale] An optional property that updates the scale
                                            * of the `CustomViewable` must be in the range [0.0, 2.0].
                                            * @property {string} [url] An optional property that represents the sprite URL
                                            * to be used for the `CustomViewable` as part of its update. If provided, this
                                            * value should match one of the values added through `ViewableStyle.preloadSprite`
                                            * API.
                                            * @property {THREE.Color} [color] An optional property that represents the color
                                            * to be used for the `CustomViewable` as part of its update.
                                            * @property {THREE.Vector3} [position] An optional property that represents the
                                            * position to be used for the `CustomViewable` as part of its update.
                                            */

/**
                                                * The configuration used in `renderSurfaceShading` and `updateSurfaceShading` APIs
                                                * to control the appearance of the resulting heatmap.
                                                *
                                                * @typedef {Object} HeatmapConfig
                                                * @property {number} [confidence] Optional. The distance from the sensor that its
                                                * value will affect the heatmap before dropping off. Measured in world coordinates
                                                * of the current model. The default value is `160.0`.
                                                * @property {number} [powerParameter] Optional. A positive real number. Greater
                                                * values of power parameter assign greater influence to values closest to the
                                                * interpolated point. This parameter is default to `2.0`.
                                                * @property {number} [alpha] Optional. The transparency level of the resulting
                                                * fragment on the heatmap, ranging from `0.0` (completely transparent) to `1.0`
                                                * (fully opaque). The default value is `1.0`.
                                                */

/**
                                                    * Callback function invoked when a `CustomViewable` is being invalidated through
                                                    * a call to `invalidateViewable` API. Client code can optionally modify one or
                                                    * more properties of `CustomViewable` during this call.
                                                    *
                                                    * @callback ViewableInvalidatedCallback
                                                    * @param {CustomViewable} viewable The viewable object that is being invalidated.
                                                    * @returns {PropertyUpdates} Object that specifies the properties to be updated.
                                                    */

/**
                                                        * Data Visualization extension provides an API for building scenes with
                                                        * custom sprites (dots) and heatmaps (surface shading) within model boundaries.
                                                        *
                                                        * The extension id is: `Autodesk.DataVisualization`
                                                        *
                                                        * @example
                                                        *   const ext = await viewer.loadExtension("Autodesk.DataVisualization")
                                                        *
                                                        * @class
                                                        * @memberof Autodesk.DataVisualization.Core
                                                        * @alias Autodesk.DataVisualization.Core.DataVisualization
                                                        * @see {@link Autodesk.Viewing.Extension} for common inherited methods.
                                                        */var
DataVisualization = /*#__PURE__*/function (_av$Extension) {_inherits(DataVisualization, _av$Extension);var _super = _createSuper(DataVisualization);
  /**
                                                                                                                                                      * @param {Viewer3D} viewer - Viewer instance
                                                                                                                                                      * @param {object} options - Configurations for the extension
                                                                                                                                                      * @class
                                                                                                                                                      */
  function DataVisualization(viewer) {var _this;var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};_classCallCheck(this, DataVisualization);
    _this = _super.call(this, viewer, options);
    _this.textureUtility = new _TextureUtils__WEBPACK_IMPORTED_MODULE_7__.TextureUtility(viewer);
    _this.pointMeshes = [];
    _this._streamLineBuilder = null;
    _this._onInstanceTreeReady = _this._onInstanceTreeReady.bind(_assertThisInitialized(_this));return _this;
  }_createClass(DataVisualization, [{ key: "load", value: function () {var _load = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {var _this2 = this;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:


                this.tool = new _SceneTool_js__WEBPACK_IMPORTED_MODULE_1__.SceneTool(this.viewer, {
                  delegate: this });


                this.viewer.toolController.registerTool(this.tool);
                this.activate();

                this.instanceTreeReadyPromise = new Promise(function (resolve, reject) {
                  _this2.instanceTreeReadyPromiseResolve = resolve;
                  _this2.instanceTreeReadyPromiseReject = reject;
                });

                this.datavizDotOverlay = this.viewer.impl.createOverlayScene(
                datavizDotOverlay,
                null,
                null,
                null,
                true,
                true);


                this.viewer.addEventListener(
                Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
                this._onInstanceTreeReady);

                this.deviceDepthOcclusion = false;return _context.abrupt("return",
                true);case 8:case "end":return _context.stop();}}}, _callee, this);}));function load() {return _load.apply(this, arguments);}return load;}() }, { key: "unload", value: function unload()


    {
      this.viewer.toolController.deregisterTool(this.tool);
      this.viewer.removeEventListener(
      Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
      this._onInstanceTreeReady);


      this.removeSurfaceShading();
      this.surfaceShading = null;
      this.deactivate();
      return true;
    } }, { key: "activate", value: function activate()

    {
      this.viewer.toolController.activateTool(this.tool.getName());
      return true;
    } }, { key: "deactivate", value: function deactivate()

    {
      if (this._streamLineBuilder) {
        this._streamLineBuilder.dispose();
        this._streamLineBuilder = null;
      }

      this.viewer.toolController.deactivateTool(this.tool.getName());
      this.removeSurfaceShading();
      this.showTextures();
      this.removeAllViewables();
      return true;
    } }, { key: "_onInstanceTreeReady", value: function _onInstanceTreeReady(

    event) {
      if (this.instanceTreeReadyPromiseResolve) {
        this.instanceTreeReadyPromiseResolve();
      }
    } }, { key: "waitForInstanceTree", value: function () {var _waitForInstanceTree = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(

      model) {return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:if (!
                model.getInstanceTree()) {_context2.next = 4;break;}
                this.instanceTreeReadyPromiseResolve();_context2.next = 6;break;case 4:_context2.next = 6;return (

                  this.instanceTreeReadyPromise);case 6:case "end":return _context2.stop();}}}, _callee2, this);}));function waitForInstanceTree(_x) {return _waitForInstanceTree.apply(this, arguments);}return waitForInstanceTree;}() }, { key: "mapDbIdsToGeometries",















    /**
                                                                                                                                                                                                                                                                            * @private
                                                                                                                                                                                                                                                                            *
                                                                                                                                                                                                                                                                            * Obtains a list of corresponding geometries given a list of `DbId`.
                                                                                                                                                                                                                                                                            * @param {number[]} dbIds An array of `DbId` whose corresponding geometries
                                                                                                                                                                                                                                                                            * are to be obtained.
                                                                                                                                                                                                                                                                            * @returns The array of geometries correspond to the input `DbId` list.
                                                                                                                                                                                                                                                                            */value: function mapDbIdsToGeometries(
    dbIds) {
      var idToGeometryMap = this.dbId2Geometry || {};

      var geometries = new Set();
      dbIds.map(function (id) {
        var geometry = idToGeometryMap[id];
        if (geometry) geometries.add(geometry);
      });

      return Array.from(geometries);
    }

    /**
       * Adds a collection of `CustomViewable` objects for display through
       * the `ViewableData` object that contains them.
       *
       * @alias Autodesk.DataVisualization.Core.DataVisualization#addViewables
       * @param {ViewableData} data The `ViewableData` that contains all
       * the `CustomViewable` objects which are to be added for display.
       */ }, { key: "addViewables", value: function addViewables(
    data) {var _this3 = this;
      var sprite = THREE.ImageUtils.loadTexture(data.spriteAtlas.canvas.toDataURL());
      sprite.minFilter = THREE.LinearFilter;
      sprite.maxFilter = THREE.LinearFilter;
      sprite.flipY = false;

      var material = new THREE.PointCloudMaterial({
        size: data.spriteSize * this.getWindow().devicePixelRatio,
        map: sprite,
        vertexColors: THREE.VertexColors,
        alphaTest: 0.5,
        transparent: true,
        occlusion: 1,
        depthTest: true,
        depthWrite: true });


      material.skipMrtNormals = true;

      function updateDepthUniforms(viewer, mat) {
        // When AmbientOclution is off, there is no depthTarget
        var depthTarget = viewer.impl.renderer().getDepthTarget();

        if (depthTarget) {
          var res = new THREE.Vector2(1 / depthTarget.width, 1 / depthTarget.height);
          mat.uniforms = Object.assign(mat.uniforms || {}, {
            "tDepthTest": { type: "t", value: depthTarget },
            "tDepthResolution": { type: "v2", value: res } });

        }
      }

      updateDepthUniforms(this.viewer, material);

      material.defines = Object.assign(material.defines || {}, {
        PARTICLE_FRAGMENT: 1,
        USE_VERTEX_ID: 1,
        DEPTH_OCCLUSION: this.deviceDepthOcclusion ? 1 : 0,
        PARTICLE_UV: 1,
        PARTICLE_FLAGS: "" });


      var viewerImpl = this.viewer.impl;
      var matman = viewerImpl.matman();
      matman.addMaterial("__dataVizSpriteMaterial__", material, true);

      this.pointMaterial = material;
      this.viewableData = data;
      this.dbId2Geometry = {};

      this.viewer.addEventListener(av.VIEWER_RESIZE_EVENT, function () {
        updateDepthUniforms(_this3.viewer, material);
      });

      var thisObject = this;
      function geometryCallback(geometry) {
        geometry.dbIds.forEach(function (dbId) {
          thisObject.dbId2Geometry[dbId] = geometry;
        });

        var mesh = new THREE.Mesh(geometry, material);
        viewerImpl.addOverlay(datavizDotOverlay, mesh);
        thisObject.pointMeshes.push(mesh);

        setTimeout(function () {
          viewerImpl.invalidate(false, false, true);
        }, 16);
      }

      var builder = new _SpriteMeshBuilder__WEBPACK_IMPORTED_MODULE_2__.SpriteMeshBuilder(geometryCallback);
      var viewables = data.viewables;
      viewables.map(function (item) {
        if (item.position) {
          builder.addPoint(item, data.spriteAtlas);
        }
      });

      builder.flushBuffer();
    }

    /**
       * Removes all viewables from display.
       *
       * @alias Autodesk.DataVisualization.Core.DataVisualization#removeAllViewables
       */ }, { key: "removeAllViewables", value: function removeAllViewables()
    {
      // remove all the drawable mesh from the overlay
      if (this.pointMeshes && this.pointMeshes.length > 0) {
        var viewerImpl = this.viewer.impl;
        this.pointMeshes.forEach(function (mesh) {
          viewerImpl.removeOverlay(datavizDotOverlay, mesh);
          mesh.geometry.dispose();
          mesh.material.dispose();
        });

        viewerImpl.invalidate(false, false, true);
      }

      // Reset viewable variables.
      this.pointMeshes = [];
      delete this.dbId2Geometry;
      delete this.viewableData;
    }

    /**
       * @description Enables or disables depth testing for custom viewable objects.
       * When depth testing is enabled for custom viewables, they will be occluded
       * by objects in the scene that are nearer to the camera. If depth testing is
       * disabled for custom viewables, they will always be visible regardless of
       * other objects that may be blocking them.
       *
       * @alias Autodesk.DataVisualization.Core.DataVisualization#changeOcclusion
       * @param {boolean} enable Indicates if occlusion should be enabled. Set
       * this parameter to `true` to enable depth testing for custom viewables,
       * or `false` otherwise.
       */ }, { key: "changeOcclusion", value: function changeOcclusion(
    enable) {
      if (this.deviceDepthOcclusion != enable) {
        this.deviceDepthOcclusion = enable;
        var occlusion = enable ? 1 : 0;

        if (this.pointMaterial && this.pointMaterial.program) {
          this.pointMaterial.defines["DEPTH_OCCLUSION"] = occlusion;
          this.pointMaterial.needsUpdate = true;
        }
        this.viewer.impl.invalidate(false, false, true);
      }
    }

    /**
       * Sets the visibility and occlusion for these custom viewables.
       *
       * @alias Autodesk.DataVisualization.Core.DataVisualization#showHideViewables
       * @param {boolean} visible Indicates if all custom viewables should be visible.
       * Set this to `true` to display all custom viewables, or `false` otherwise.
       * @param {boolean} occlusion Indicates if occlusion should be enabled. If
       * this parameter is set to `true`, depth testing will be enabled for custom
       * viewables, causing them to be occluded by objects that are nearer to the
       * camera. Set this to `false` in order to always display custom viewables on
       * top of the view and not be occluded by other objects in the scene.
       */ }, { key: "showHideViewables", value: function showHideViewables(
    visible, occlusion) {
      this.changeOcclusion(occlusion);

      if (this.pointMaterial) {
        this.pointMaterial.visible = visible;
        this.pointMaterial.needsUpdate = true;
      }

      this.viewer.impl.invalidate(false, false, true);
    }

    /**
       * Highlights one or more existing custom viewables in the scene.
       * Highlighted viewables can be cleared with `clearHighlightedViewables` API.
       *
       * @alias Autodesk.DataVisualization.Core.DataVisualization#highlightViewables
       * @param {number|number[]} dbIds The `DbId` of one or more custom viewables
       * to highlight.
       */ }, { key: "highlightViewables", value: function highlightViewables(
    dbIds) {
      if (this.tool) {
        this.tool.markObject(dbIds);
      }
    }

    /**
       * Clears any existing highlighted custom viewable that was highlighted
       * with a prior call to `highlightViewables` API.
       *
       * @alias Autodesk.DataVisualization.Core.DataVisualization#clearHighlightedViewables
       */ }, { key: "clearHighlightedViewables", value: function clearHighlightedViewables()
    {
      if (this.tool) {
        this.tool.clearMarkedObject();
      }
    }

    /**
       * Invalidates one or more `CustomViewable` objects, causing them to update
       * with new properties (e.g. sprite image, position, etc.). Since this call
       * updates all relevant viewable objects in a single batch, it is recommended
       * that more viewables to be batched in less number of `invalidateViewables`
       * calls.
       *
       * @alias Autodesk.DataVisualization.Core.DataVisualization#invalidateViewables
       *
       * @param {number|number[]} dbIds One or more `DbId` values of viewables to
       * be updated in this call.
       * @param {ViewableInvalidatedCallback} callback The client specified callback
       * function to be invoked for each of the `CustomViewable` objects being
       * invalidated. The callback function should return new property values that
       * the `CustomViewable` object is to be updated with.
       */ }, { key: "invalidateViewables", value: function invalidateViewables(
    dbIds, callback) {
      if (!dbIds || dbIds.length <= 0) {
        console.warn("All parameters of 'invalidateViewables' are mandatory");
        return;
      }

      if (!this.pointMeshes || this.pointMeshes.length <= 0 || !this.viewableData) {
        console.warn("'addViewables' must be called before 'invalidateViewables'");
        return;
      }

      if (this.tool) {
        this.tool.invalidateViewablesDirect(
        dbIds,
        this.pointMeshes,
        this.viewableData,
        callback);

      }
    }

    /**
       * Enables texture display in the current scene.
       *
       * @alias Autodesk.DataVisualization.Core.DataVisualization#showTextures
       */ }, { key: "showTextures", value: function showTextures()
    {
      this.textureUtility.showTextures();
    }

    /**
       * Disables texture display in the current scene.
       *
       * @alias Autodesk.DataVisualization.Core.DataVisualization#hideTextures
       */ }, { key: "hideTextures", value: function hideTextures()
    {
      this.textureUtility.hideTextures();
    }

    /**
       * Sets up surface shading (heatmap display) for the model.
       *
       * @alias Autodesk.DataVisualization.Core.DataVisualization#setupSurfaceShading
       * @param {Model} model The model to set up the shading for. It is used to
       * establish connections between `DbId` and the corresponding fragments
       * so that heatmap can be rendered. Note that this model may not always
       * be the same one representing the main loaded model. If the shading is
       * set up for models built by `SceneBuilder`, then this parameter should
       * be the model within that same `SceneBuilder`. See example for more.
       * @param {SurfaceShadingData} shadingData The surface shading data generated
       * with a prior call to `ModelStructureInfo.generateSurfaceShadingData`.
       * This value is used to set up the surface shading.
       * @param {Object} [options] Extra configuration options for surface shading.
       * The `options` parameter is only used for setting up `PlanarHeatmap` (i.e.
       * when `options.type` is set to `PlanarHeatmap`).
       * @param {string} options.type To create a planar heatmap, this must be set
       * to `"PlanarHeatmap"`.
       * @param {number} [options.width] Optional. The width in pixels of the
       * underlying texture used for rendering the heatmap. If the bounding box of
       * the geometry turns out to be portrait, then `width` value will be adjusted
       * with respect to `height` value to retain the aspect ratio. If unspecified,
       * the default value of `1024` pixels is used.
       * @param {number} [options.height] Optional. The height in pixels of the
       * underlying texture used for rendering the heatmap. If the bounding box of
       * the geometry turns out to be landscape, then `height` value will be
       * adjusted with respect to `width` value to retain the aspect ratio.
       * If unspecified, the default value of `1024` pixels is used.
       * @param {boolean} [options.slicingEnabled] Optional. Set this to `true` to
       * enable geometry slicing through the use of `CompGeom` viewer extension.
       * This allows edges to be built as boundaries for irregularly shaped geometries,
       * but may fail for complex geometries. When set to `false`, the axis-aligned
       * bounding boxes of relevant geometries will be used to display heatmap texture.
       * If unspecified, this parameter will be set to `true`.
       * @param {number} [options.slicingPosition] Optional. A number representing the
       * point at which slicing should happen. Valid value range is `[0.0, 1.0]`. If
       * unspecified, the default value of `0.5` will be used, slicing geometry through
       * the vertical mid-point of the bounding box. This value will be used only
       * if `options.slicingEnabled` is set to `true`.
       * @param {number} [options.placementPosition] Optional. A number in the range
       * of `[0.0, 1.0]`, indicating the placement position of the resulting plane.
       * When set to `0.0`, the plane will be positioned at the lowest `z` coordinate
       * of the bounding box. When set to `1.0`, the plane will be positioned at the
       * highest point of the bounding box. If unspecified, the default value of `0.0`
       * will be used.
       * @param {number} [options.minOpacity] Optional. The minimum opacity the lowest
       * value in the heatmap will have. This value is in the range of `[0.0, 1.0]`. If
       * unspecified the default value of `0.0` will be used.
       * @param {number} [options.maxOpacity] Optional. The maximal opacity the highest
       * value in the heatmap will have. This value is in the range of `[0.0, 1.0]`. If
       * unspecified the default value of `1.0` will be used.
       *
       * @example
       *  // 'devices' is a list of 'Device' objects
       *  const info = new Autodesk.DataVisualization.Core.ModelStructureInfo(model);
       *  const shadingData = await info.generateSurfaceShadingData(devices);
       *
       *  // The call to 'generateSurfaceShadingData' above generates 'shadingData'
       *  // based on 'model' that is passed to 'ModelStructureInfo', therefore the
       *  // 'DbId' within 'shadingData' are all originated from the same 'model'.
       *  // In this case, the first parameter is the same 'model' above.
       *  //
       *  dataVizExtn.setupSurfaceShading(model, shadingData);
       *
       *  // If the 'SurfaceShadingData' passed to 'setupSurfaceShading' is constructed
       *  // with 'DbId' coming from a 'SceneBuilder', then the first parameter must be
       *  // the same model that 'SurfaceShadingData' was created from:
       *  //
       *  // const anotherModel = sceneBuilder.modelBuilder.model;
       *  // dataVizExtn.setupSurfaceShading(anotherModel, shadingData);
       */ }, { key: "setupSurfaceShading", value: function () {var _setupSurfaceShading = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(
      model, shadingData) {var _this4 = this;var options,createSetup,_args4 = arguments;return regeneratorRuntime.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:options = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : {};
                createSetup = /*#__PURE__*/function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                            if (_this4.surfaceShading) {
                              _this4.surfaceShading.cleanUp();
                            }if (!(

                            options.type == "PlanarHeatmap")) {_context3.next = 7;break;}_context3.next = 4;return (
                              _this4.viewer.loadExtension("Autodesk.CompGeom"));case 4:
                            _this4.surfaceShading = new _heatmap_PlanarHeatmap__WEBPACK_IMPORTED_MODULE_6__.PlanarHeatmap(_this4.viewer, model, shadingData, options);_context3.next = 8;break;case 7:

                            _this4.surfaceShading = new _heatmap_SurfaceShading__WEBPACK_IMPORTED_MODULE_5__.SurfaceShading(_this4.viewer, model, shadingData);case 8:case "end":return _context3.stop();}}}, _callee3);}));return function createSetup() {return _ref.apply(this, arguments);};}();_context4.next = 4;return (



                  this.waitForInstanceTree(model));case 4:return _context4.abrupt("return",
                createSetup());case 5:case "end":return _context4.stop();}}}, _callee4, this);}));function setupSurfaceShading(_x2, _x3) {return _setupSurfaceShading.apply(this, arguments);}return setupSurfaceShading;}()


    /**
                                                                                                                                                                                                                              * Renders one or more nodes with the given identifiers. This call creates
                                                                                                                                                                                                                              * necessary resources like overlay scene and materials, therefore is by
                                                                                                                                                                                                                              * design to be called only when necessary (i.e., when surface shading needs
                                                                                                                                                                                                                              * to be updated due to geometry changes). For more lightweight
                                                                                                                                                                                                                              * rendering, `updateSurfaceShading` API should be used instead.
                                                                                                                                                                                                                              *
                                                                                                                                                                                                                              * @alias Autodesk.DataVisualization.Core.DataVisualization#renderSurfaceShading
                                                                                                                                                                                                                              * @param {string|string[]} nodeIds One or more identifiers of nodes
                                                                                                                                                                                                                              * to render. These identifiers are among the ones provided
                                                                                                                                                                                                                              * through `SurfaceShadingData` in a prior call to `setupSurfaceShading` API.
                                                                                                                                                                                                                              * @param {string} sensorType The type of sensor to render the shading for.
                                                                                                                                                                                                                              * @param {SensorValueCallback} valueCallback The callback function that
                                                                                                                                                                                                                              * will be invoked when surface shading requires the sensor value to render.
                                                                                                                                                                                                                              * @param {HeatmapConfig} [heatmapConfig] Optional. The configuration of
                                                                                                                                                                                                                              * the heatmap. See documentation for `HeatmapConfig` for more details.
                                                                                                                                                                                                                              *
                                                                                                                                                                                                                              * @example
                                                                                                                                                                                                                              *  // This callback will be invoked multiple times for each call to
                                                                                                                                                                                                                              *  // 'renderSurfaceShading' below, once for each of the devices on
                                                                                                                                                                                                                              *  // the floor.
                                                                                                                                                                                                                              *  function getSensorValue(deviceInfo, sensorType) {
                                                                                                                                                                                                                              *      const deviceId = deviceInfo.id;
                                                                                                                                                                                                                              *      const sensorValue = readSensorValue(deviceId, sensorType);
                                                                                                                                                                                                                              *      return clamp(sensorValue, 0.0, 1.0); // Normalize sensor value
                                                                                                                                                                                                                              *  }
                                                                                                                                                                                                                              *
                                                                                                                                                                                                                              *  function onFloorSelectedOnUi(floorName) {
                                                                                                                                                                                                                              *      const sensorType = "CO₂";
                                                                                                                                                                                                                              *      dataVizExtn.renderSurfaceShading(floorName, sensorType, getSensorValue);
                                                                                                                                                                                                                              *  }
                                                                                                                                                                                                                              */ }, { key: "renderSurfaceShading", value: function renderSurfaceShading(
    nodeIds, sensorType, valueCallback, heatmapConfig) {
      // The following handles the API update without breaking existing client
      // codes that can be in one of two categories: code that omits the 4th
      // parameter (i.e. `confidenceSize`), and code that specifies a number as
      // the 4th parameter. For the first category, `confidenceSize` defaults
      // to `160.0` while for the second category, `confidenceSize` will be set
      // to the number client code provides.
      //
      // For newer client code that provides `HeatmapConfig`, its value will be
      // further validated in volumetric and planar heatmap, depending on the
      // values that make sense of them.
      //
      if (heatmapConfig === null || typeof heatmapConfig === "undefined") {
        heatmapConfig = { confidence: 160.0 };
      } else if (typeof heatmapConfig === "number") {
        heatmapConfig = { confidence: Math.abs(heatmapConfig) };
      }

      if (this.surfaceShading) {
        this.surfaceShading.render(nodeIds, sensorType, valueCallback, heatmapConfig);
      } else {
        avp.logger.error("Please call setupSurfaceShading first");
      }
    }

    /**
       * Updates the surface shading (heatmap) with the latest sensor values.
       * This API simply updates the resources created in a prior call to
       * the `renderSurfaceShading` without recreating them, therefore it is
       * a more lightweight alternatives suited for high frequency calls.
       * @alias Autodesk.DataVisualization.Core.DataVisualization#updateSurfaceShading
       * @param {SensorValueCallback} valueCallback The callback function that
       * will be invoked when surface shading requires the sensor value to render.
       * @param {HeatmapConfig} [heatmapConfig] Optional. The configuration of
       * the heatmap. See documentation for `HeatmapConfig` for more details.
       *
       * @example
       *  let seconds; // Selected time on the UI
       *
       *  // This callback will be invoked multiple times for each call to
       *  // 'renderSurfaceShading' below, once for each of the devices on
       *  // the floor.
       *  function getSensorValue(deviceInfo, sensorType) {
       *      const deviceId = deviceInfo.id;
       *      const sensorValue = readSensorValue(deviceId, sensorType, seconds);
       *      return clamp(sensorValue, 0.0, 1.0); // Normalize sensor value
       *  }
       *
       *  // Handler for slider events that is triggered rapidly
       *  function onTimeSliderValueChanged(timeInSeconds) {
       *      seconds = timeInSeconds;
       *      dataVizExtn.updateSurfaceShading(getSensorValue);
       *  }
       */ }, { key: "updateSurfaceShading", value: function updateSurfaceShading(
    valueCallback, heatmapConfig) {
      if (this.surfaceShading) {
        this.surfaceShading.updateShading(valueCallback, heatmapConfig);
      } else {
        avp.logger.error("Please call setupSurfaceShading first");
      }
    }

    /**
       * Registers color stops for use in heatmap colorization. The specified color
       * stops evenly spread out across the spectrum that represents the normalized
       * sensor values ranging between 0.0 and 1.0.
       *
       * @alias Autodesk.DataVisualization.Core.DataVisualization#registerSurfaceShadingColors
       *
       * @param {string} sensorType The sensor type to define the color stops for.
       * @param {number[]} colors An array of color values, each expressed in a
       * 3-byte (24-bit) numerical value. Note that it is possible to specify a
       * 4-byte (32-bit) number as color, but only 3 lower bytes will be taken.
       * Each of the three bytes represents the intensity value between `0` and `255`,
       * of red, green, blue color component respectively. For example, `0xff0000`
       * represents a red color with full intensity.
       *
       * @param {number} alpha The opacity of the heatmap for the specified sensorType
       *
       * @example
       *  // Register 3 color stops for CO₂ sensor values
       *  const dataVizExt = await viewer.loadExtension("Autodesk.DataVisualization");
       *  dataVizExt.registerSurfaceShadingColors("CO₂", [0x0f2027, 0x203a43, 0x2c5364]);
       */ }, { key: "registerSurfaceShadingColors", value: function registerSurfaceShadingColors(
    sensorType, colors) {var alpha = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.7;
      if (this.surfaceShading) {
        this.surfaceShading.registerSensorColors(sensorType, colors, alpha);
      } else {
        avp.logger.error("Please call setupSurfaceShading first");
      }
    }

    /**
       * Removes any surface shading created by clearing the overlay
       * which holds the meshes used as heatmap representation.
       *
       * @alias Autodesk.DataVisualization.Core.DataVisualization#removeSurfaceShading
       */ }, { key: "removeSurfaceShading", value: function removeSurfaceShading()
    {
      if (this.surfaceShading) {
        this.surfaceShading.removeShading();
      }
    } }, { key: "hasViewables", get: function get() {return this.pointMeshes && this.pointMeshes.length > 0 && this.viewableData;} }, { key: "streamLineBuilder", get: function get() {if (!this._streamLineBuilder) {this._streamLineBuilder = new _streamline_StreamLineBuilder_js__WEBPACK_IMPORTED_MODULE_10__.StreamLineBuilder(this.viewer);}return this._streamLineBuilder;} }]);return DataVisualization;}(av.Extension);


av.theExtensionManager.registerExtension(extnName, DataVisualization);
})();

Autodesk.Extensions.DataVisualization = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=DataVisualization.js.map