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

/***/ "./extensions/Geolocation/Ellipsoid.js":
/*!*********************************************!*\
  !*** ./extensions/Geolocation/Ellipsoid.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Ellipsoid": () => (/* binding */ Ellipsoid)
/* harmony export */ });
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

// from InfraWorks' Ellipsoid.h
var _a = 6378137.0; // meters
var _f = 298.257223563;
var _f_inv = 1.0 / _f;
var _b = _a * (1.0 - _f_inv);
var _e2 = (2.0 - _f_inv) * _f_inv;

/**
                                    * Ellipsoid values for WGS84
                                    */
var Ellipsoid = /*#__PURE__*/function () {function Ellipsoid() {_classCallCheck(this, Ellipsoid);}_createClass(Ellipsoid, null, [{ key: "a", value: function a()

    {return _a;} }, { key: "MajorRadius", value: function MajorRadius()
    {return _a;} }, { key: "f", value: function f()

    {return _f_inv;} }, { key: "InverseFlattening", value: function InverseFlattening()
    {return _f_inv;} }, { key: "b", value: function b()

    {return _b;} }, { key: "MinorRadius", value: function MinorRadius()
    {return _b;} }, { key: "e2", value: function e2()

    {return _e2;} }, { key: "EccentricitySquared", value: function EccentricitySquared()
    {return _e2;} }]);return Ellipsoid;}();

/***/ }),

/***/ "./extensions/Geolocation/GlobeMath.js":
/*!*********************************************!*\
  !*** ./extensions/Geolocation/GlobeMath.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "degToRad": () => (/* binding */ degToRad),
/* harmony export */   "radToDeg": () => (/* binding */ radToDeg),
/* harmony export */   "ll2Geocentric": () => (/* binding */ ll2Geocentric),
/* harmony export */   "geocentric2LL": () => (/* binding */ geocentric2LL)
/* harmony export */ });
/* harmony import */ var _Ellipsoid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Ellipsoid */ "./extensions/Geolocation/Ellipsoid.js");



var _pi = Math.PI; // 3.14159265358979; // Same as Revit
var _degToRadFactor = _pi / 180;
var _radToDegFactor = 180 / _pi;

var avp = Autodesk.Viewing.Private;

function degToRad(degrees) {
  return degrees * _degToRadFactor;
}

function radToDeg(radians) {
  return radians * _radToDegFactor;
}

/**
   * Converts a WGS84-coordinate (longitude, latitude, height) 
   * into a 3D-coordinate in geocentric ECEF format.
   * 
   * @param {LmvVector3} wgsCoord 
   * @param {number} wgsCoord.x - in as Longitude
   * @param {number} wgsCoord.y - in as Latitude
   * @param {number} wgsCoord.z - in as Height in meters
   * 
   * @returns {lmvVector3} coordinate in ECEF, meters.
   */
function ll2Geocentric(wgsCoord) {

  var lambda = degToRad(wgsCoord.x); // longitude
  var phi = degToRad(wgsCoord.y); // latitude
  var h = wgsCoord.z;

  var sinPhi = Math.sin(phi);
  var cosPhi = Math.cos(phi);
  var sinL = Math.sin(lambda);
  var cosL = Math.cos(lambda);

  var v = _Ellipsoid__WEBPACK_IMPORTED_MODULE_0__.Ellipsoid.a() / Math.sqrt(1.0 - _Ellipsoid__WEBPACK_IMPORTED_MODULE_0__.Ellipsoid.e2() * (sinPhi * sinPhi));
  var tmp = (v + h) * cosPhi;

  var x = tmp * cosL;
  var y = tmp * sinL;
  var z = ((1.0 - _Ellipsoid__WEBPACK_IMPORTED_MODULE_0__.Ellipsoid.e2()) * v + h) * sinPhi;
  return new avp.LmvVector3(x, y, z);
}

/**
   * Converts a 3D-coordinate in geocentric ECEF format
   * into a WGS84-coordinate (longitude, latitude, height)
   * 
   * @param {LmvVector3} geoPoint - ECEF position in meters.
   * @returns {lmvVector3} WGS84-coordinate (longitude, latitude, height).
   */
function geocentric2LL(geoPoint) {

  var x = geoPoint.x;
  var y = geoPoint.y;
  var z = geoPoint.z;

  var b = _Ellipsoid__WEBPACK_IMPORTED_MODULE_0__.Ellipsoid.b();
  var epsilon = _Ellipsoid__WEBPACK_IMPORTED_MODULE_0__.Ellipsoid.e2() / (1.0 - _Ellipsoid__WEBPACK_IMPORTED_MODULE_0__.Ellipsoid.e2());

  var p = Math.sqrt(x * x + y * y);
  var q = Math.atan2(z * _Ellipsoid__WEBPACK_IMPORTED_MODULE_0__.Ellipsoid.a(), p * b);

  // sin^3(q) and cos^3(q)
  var sin3q = Math.sin(q);
  var cos3q = Math.cos(q);
  sin3q = sin3q * sin3q * sin3q;
  cos3q = cos3q * cos3q * cos3q;

  var phi = Math.atan2(z + epsilon * b * sin3q, p - _Ellipsoid__WEBPACK_IMPORTED_MODULE_0__.Ellipsoid.e2() * _Ellipsoid__WEBPACK_IMPORTED_MODULE_0__.Ellipsoid.a() * cos3q);
  var lambda = Math.atan2(y, x);

  var sin2phi = Math.sin(phi);
  sin2phi = sin2phi * sin2phi;

  var v = _Ellipsoid__WEBPACK_IMPORTED_MODULE_0__.Ellipsoid.a() / Math.sqrt(1.0 - _Ellipsoid__WEBPACK_IMPORTED_MODULE_0__.Ellipsoid.e2() * sin2phi);
  var h = p / Math.cos(phi) - v;

  var xx = radToDeg(lambda); // longitude
  var yy = radToDeg(phi); // latitude
  var zz = h; // height(m)
  return new avp.LmvVector3(xx, yy, zz);
}

/***/ }),

/***/ "./extensions/Geolocation/LocalCS.js":
/*!*******************************************!*\
  !*** ./extensions/Geolocation/LocalCS.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LocalCS": () => (/* binding */ LocalCS)
/* harmony export */ });
/* harmony import */ var _GlobeMath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GlobeMath */ "./extensions/Geolocation/GlobeMath.js");
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var avp = Autodesk.Viewing.Private;

// from InfraWorks' LocalCS.h
var LocalCS = /*#__PURE__*/function () {

  /**
                                                * Initializes a transformation context that can convert from LMV space to Latitude Longitude,
                                                * based on georeference attributes of a specific SVF model.
                                                * @param {LmvVector3} originLL84 - WGS84 world position expressed in { x: longitude, y: latutude, z: 0 }
                                                */
  function LocalCS(originLL84, geoRefTransform, unitToMeter, modelToLmv) {_classCallCheck(this, LocalCS);

    this.m_originLL84 = originLL84.clone();

    var worldOrigin = (0,_GlobeMath__WEBPACK_IMPORTED_MODULE_0__.ll2Geocentric)(originLL84);

    //Converts model coordinates to meters
    var unitScale = new avp.LmvMatrix4(true);
    unitScale.elements[0] = unitScale.elements[5] = unitScale.elements[10] = unitToMeter || 1.0;

    //Adds geocentric origin offset of the local ENU origin
    var translation = new avp.LmvMatrix4(true);
    translation.elements[12] = worldOrigin.x;
    translation.elements[13] = worldOrigin.y;
    translation.elements[14] = worldOrigin.z;

    //Rotates from ENU to geocentric basis
    var enu2ecefOrientation = LocalCS.createEnu2Ecef({ x: originLL84.x, y: originLL84.y });

    if (!geoRefTransform)
    geoRefTransform = new avp.LmvMatrix4(true);

    if (!modelToLmv)
    modelToLmv = new avp.LmvMatrix4(true);

    var lmvToModel = new avp.LmvMatrix4(true);
    lmvToModel.copy(modelToLmv).invert();

    this.m_model2ecef = translation //add geocentric origin
    .multiply(enu2ecefOrientation) //geocentric orientation
    .multiply(unitScale) //scale refpoint space to meters
    .multiply(geoRefTransform) //from model local to refPoint (ENU) space
    .multiply(lmvToModel); //from LMV scene to model local

    this.m_ecef2model = new avp.LmvMatrix4(true);
    this.m_ecef2model.copy(this.m_model2ecef).invert();
  }_createClass(LocalCS, [{ key: "getLL84", value: function getLL84()

    {
      return this.m_originLL84;
    }

    /**
       * Conversion from global geocentric coords to ENU coords (= local)
       * @param {LmvVector3} point - in global geocentric coords
       * @returns {LmvVector3} - point in ENU coords
       */ }, { key: "LL842LmvPoint", value: function LL842LmvPoint(
    point) {
      var localPoint = (0,_GlobeMath__WEBPACK_IMPORTED_MODULE_0__.ll2Geocentric)(point);
      localPoint = this.m_ecef2model.transformPoint(localPoint);
      return localPoint;
    }

    /**
       * Conversion from ENU coords (= local) to global geocentric coords
       * @param {LmvVector3} point - in ENU coords
       * @returns {LmvVector3} - point in global geocentric coords
       */ }, { key: "lmv2LL84Point", value: function lmv2LL84Point(
    point) {
      var worldPoint = this.m_model2ecef.transformPoint(point.clone());
      return (0,_GlobeMath__WEBPACK_IMPORTED_MODULE_0__.geocentric2LL)(worldPoint);
    }

    /**
       * Computes the orientation matrix M for a local ENU system.
       * A point p in geocentric space can be converted to the ENU system point p' 
       * by p' = M*(p-anchor), where anchor is the origin in geocentric space.
       * 
       * ECEF = Earth-Centered, Earth-Fixed
       * ENU = East/North/Up
       * 
       * @param {LmvVector3} originLL84
       * @returns {LmvMatrix4}
       */ }], [{ key: "createEnu2Ecef", value: function createEnu2Ecef(
    originLL84) {

      var lambda = (0,_GlobeMath__WEBPACK_IMPORTED_MODULE_0__.degToRad)(originLL84.x);
      var phi = (0,_GlobeMath__WEBPACK_IMPORTED_MODULE_0__.degToRad)(originLL84.y);

      var sinLambda = Math.sin(lambda);
      var cosLambda = Math.cos(lambda);
      var sinPhi = Math.sin(phi);
      var cosPhi = Math.cos(phi);

      var ret = new avp.LmvMatrix4(true);
      ret.set(
      -sinLambda, -sinPhi * cosLambda, cosPhi * cosLambda, 0,
      cosLambda, -sinPhi * sinLambda, cosPhi * sinLambda, 0,
      0, cosPhi, sinPhi, 0,
      0, 0, 0, 1);

      return ret;
    } }, { key: "createFromModel", value: function createFromModel(

    model) {

      var metadata = model.getData().metadata || {};
      var geoRef = metadata.georeference || {};
      if (!Array.isArray(geoRef.positionLL84)) {
        return null;
      }

      //NOTE: [TS] The elevation of the LL84 point comes in as 0. However,
      //I suspect that the LMV reference point is not always given at sea level,
      //so we need to use a more appropriate elevation for the LL84 point. Otherwise
      //the elevation values will be incorrect (by some fixed but unknown offset).
      var ll84 = geoRef.positionLL84;
      var originLL84 = new avp.LmvVector3(ll84[0], ll84[1], ll84[2]);

      var localCS = new LocalCS(originLL84, model.getData().refPointTransform, model.getUnitScale(), model.getData().placementWithOffset);

      return localCS;
    } }]);return LocalCS;}();

/***/ }),

/***/ "./extensions/Geolocation/Maps.js":
/*!****************************************!*\
  !*** ./extensions/Geolocation/Maps.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getGoogleMapsUrl": () => (/* binding */ getGoogleMapsUrl)
/* harmony export */ });


function getGoogleMapsUrl(pointLL84) {

  if (!pointLL84)
  return null;

  var longitude = pointLL84.x;
  var latitude = pointLL84.y;

  var URL = "https://www.google.com/maps/search/?api=1&query=".concat(latitude, ",").concat(longitude);
  return URL;
}

/***/ }),

/***/ "./extensions/Geolocation/ui/canvas.js":
/*!*********************************************!*\
  !*** ./extensions/Geolocation/ui/canvas.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CanvasPoints": () => (/* binding */ CanvasPoints)
/* harmony export */ });
/* harmony import */ var _canvasPoint__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvasPoint */ "./extensions/Geolocation/ui/canvasPoint.js");
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var av = Autodesk.Viewing;

/**
                            * Maintains a list of 3D points on screen.
                            */
var CanvasPoints = /*#__PURE__*/function () {

  function CanvasPoints(extension) {_classCallCheck(this, CanvasPoints);
    this.extension = extension;
    this.viewer = extension.viewer;
    this.setGlobalManager(this.viewer.globalManager);
    this._points = [];

    this.onCameraChange = this.onCameraChange.bind(this);
  }_createClass(CanvasPoints, [{ key: "pushPoint", value: function pushPoint(

    pointData) {

      if (!this.divContainer) {
        var _document = this.getDocument();
        this.divContainer = _document.createElement('div');
        this.divContainer.style.position = 'absolute';
        this.divContainer.style.top = "0";
        this.divContainer.style.left = "0";
        this.divContainer.style.width = "100%";
        this.divContainer.style.height = "100%";
        this.divContainer.style['pointer-events'] = "none";
        this.viewer.container.appendChild(this.divContainer);

        this.viewer.addEventListener(av.CAMERA_CHANGE_EVENT, this.onCameraChange);
      }

      var canvasPoint = new _canvasPoint__WEBPACK_IMPORTED_MODULE_0__.CanvasPoint(this.viewer, pointData, this.divContainer);
      this._points.push(canvasPoint);
    } }, { key: "removePoint", value: function removePoint(

    pointData) {
      var index = -1;
      for (var i = 0; i < this._points.length; ++i) {
        if (this._points[i].hasData(pointData)) {
          index = i;
          break;
        }
      }
      if (index === -1)
      return;
      var canvasPoint = this._points[index];
      canvasPoint.destroy();
      this._points.splice(index, 1);
    } }, { key: "destroy", value: function destroy()

    {
      if (this._points) {
        this._points.forEach(function (canvasPoint) {
          canvasPoint.destroy();
        });
        this._points = null;
      }
      if (this.divContainer) {
        this.divContainer.parentElement.removeChild(this.divContainer);
        this.divContainer = null;
      }

      this.extension = null;

      this.viewer.removeEventListener(av.CAMERA_CHANGE_EVENT, this.onCameraChange);
      this.viewer = null;
    } }, { key: "onCameraChange", value: function onCameraChange(

    event) {
      this._points.forEach(function (canvasPoint) {
        canvasPoint.onCameraChange(event);
      });
    } }]);return CanvasPoints;}();


av.GlobalManagerMixin.call(CanvasPoints.prototype);

/***/ }),

/***/ "./extensions/Geolocation/ui/canvasPoint.js":
/*!**************************************************!*\
  !*** ./extensions/Geolocation/ui/canvasPoint.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CanvasPoint": () => (/* binding */ CanvasPoint)
/* harmony export */ });
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}
var av = Autodesk.Viewing;

var CanvasPoint = /*#__PURE__*/function () {

  function CanvasPoint(viewer, data, parentDiv) {_classCallCheck(this, CanvasPoint);
    this.viewer = viewer;
    this.setGlobalManager(this.viewer.globalManager);
    this.data = data;

    var _document = this.getDocument();
    this.div = _document.createElement('div');
    this.div.style.position = 'absolute';
    this.div.style.background = 'rgb(14, 14, 14)';
    this.div.textContent = data.__id;
    this.onCameraChange();

    parentDiv.appendChild(this.div);
  }_createClass(CanvasPoint, [{ key: "hasData", value: function hasData(

    data) {
      return this.data === data;
    } }, { key: "onCameraChange", value: function onCameraChange()

    {
      var clientPos = this.viewer.worldToClient(this.data.point);
      this.div.style.left = clientPos.x + "px";
      this.div.style.top = clientPos.y + "px";
    } }, { key: "destroy", value: function destroy()

    {
      if (this.div) {
        this.div.parentElement.removeChild(this.div);
        this.div = null;
      }
      this.viewer = null;
      this.data = null;
    } }]);return CanvasPoint;}();




av.GlobalManagerMixin.call(CanvasPoint.prototype);

/***/ }),

/***/ "./extensions/Geolocation/ui/panel.js":
/*!********************************************!*\
  !*** ./extensions/Geolocation/ui/panel.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Panel": () => (/* binding */ Panel)
/* harmony export */ });
/* harmony import */ var _point_template_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./point_template.html */ "./extensions/Geolocation/ui/point_template.html");
/* harmony import */ var _geo_template_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./geo_template.html */ "./extensions/Geolocation/ui/geo_template.html");
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _get(target, property, receiver) {if (typeof Reflect !== "undefined" && Reflect.get) {_get = Reflect.get;} else {_get = function _get(target, property, receiver) {var base = _superPropBase(target, property);if (!base) return;var desc = Object.getOwnPropertyDescriptor(base, property);if (desc.get) {return desc.get.call(receiver);}return desc.value;};}return _get(target, property, receiver || target);}function _superPropBase(object, property) {while (!Object.prototype.hasOwnProperty.call(object, property)) {object = _getPrototypeOf(object);if (object === null) break;}return object;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}


var avu = Autodesk.Viewing.UI;
var HEIGHT_ADJUSTMENT = 80;

/**
                             * The panel is meant to be used during debugging only.
                             */
var Panel = /*#__PURE__*/function (_avu$DockingPanel) {_inherits(Panel, _avu$DockingPanel);var _super = _createSuper(Panel);

  function Panel(extension) {var _this;_classCallCheck(this, Panel);
    _this = _super.call(this, extension.viewer.container, 'lmv-points-extension', 'Points', {});
    _this.setGlobalManager(extension.globalManager);

    _this.title.classList.add("docking-panel-delimiter-shadow");
    _this.container.classList.add('property-panel');
    _this.extension = extension;
    _this.viewer = extension.viewer;
    _this.nonScrollingContentHeight = 0;return _this;
  }_createClass(Panel, [{ key: "destroy", value: function destroy()

    {
      if (this.myTree) {
        this.myTree.destroy();
        this.myTree = null;
      }
      if (this.container) {
        this.container.parentElement.removeChild(this.container);
        this.container = null;
      }
      this.extension = null;
      this.viewer = null;
    }

    /**
       * 
       * @param {Object} pointData - Containing a 3D position along with additional data 
       * @param {Autodesk.Viewing.Model} pointData.model - The model that has been intersected
       * @param {number} pointData.dbId - The model's database id of the object intersected 
       * @param {number} pointData.fragId - The fragment id within the object
       * @param {Object} pointData.point - Position { x, y, z } number values, which include globalOffset.
       * @param {number} pointData.__id - identifier
       * @param {Object} pointData.__viewerState - viewport state when the point was added.
       */ }, { key: "pushPoint", value: function pushPoint(
    pointData) {
      var parent = this.myTree.myRootContainer;
      this.myTree.createElement_(pointData, parent);
    } }, { key: "removePoint", value: function removePoint(

    pointData) {
      var elem = this.myTree.getElementForNode(pointData);
      this.myTree.myRootContainer.removeChild(elem);
    } }, { key: "setVisible", value: function setVisible(

    show) {
      _get(_getPrototypeOf(Panel.prototype), "setVisible", this).call(this, show);
      show && this._create();
    }

    /**
       * Invoked by resizeToContent()
       */ }, { key: "getContentSize", value: function getContentSize()
    {
      return {
        height: this.scrollContainer.scrollHeight + HEIGHT_ADJUSTMENT + this.nonScrollingContentHeight,
        width: this.scrollContainer.scrollWidth };

    } }, { key: "_create", value: function _create()

    {
      if (this.myTree) return;

      this.container.style.top = '20px';
      this.container.style.width = '420px';
      this.container.style.height = '480px';

      var _document = this.getDocument();
      // Present geolocation metadata
      var geoDiv = _document.createElement('div');
      geoDiv.className = 'docking-panel-container-solid-color-a';
      geoDiv.style['font-size'] = '12px';
      geoDiv.style['padding'] = '0px 6px';
      geoDiv.style['border'] = 'solid 5px green';
      geoDiv.innerHTML = _geo_template_html__WEBPACK_IMPORTED_MODULE_1__["default"];
      this.container.appendChild(geoDiv);


      this._setGeolocationMetadata(geoDiv, this.viewer.model);

      // Scrolling panel
      this.nonScrollingContentHeight = geoDiv.clientHeight;
      var extraHeight = HEIGHT_ADJUSTMENT + this.nonScrollingContentHeight;
      this.createScrollContainer({ left: false, heightAdjustment: extraHeight, marginTop: 0 });

      // which contains a tree view
      var delegate = this._createDelegate();var options = {};
      this.myTree = new Autodesk.Viewing.UI.Tree(delegate, null, this.scrollContainer, options);

      // Bring footer forward
      this.container.removeChild(this.footer);
      this.container.appendChild(this.footer);

      this.resizeToContent();
    } }, { key: "_createDelegate", value: function _createDelegate()

    {var _this2 = this;
      var delegate = new Autodesk.Viewing.UI.TreeDelegate();
      delegate.setGlobalManager(this.globalManager);
      delegate.extension = this.extension;
      delegate.viewer = this.viewer;
      delegate.getTreeNodeId = function (node) {
        return node.__id;
      };
      delegate.getTreeNodeLabel = function (node) {
        return node.__id;
      };
      delegate.getTreeNodeClass = function (node) {
        return null;
      };
      delegate.isTreeNodeGroup = function (node) {
        return false;
      };
      delegate.shouldCreateTreeNode = function (node) {
        return true;
      };
      // Adds additional HTML and styling to the created entry
      delegate.createTreeNode = function (node, header, options, type, depth) {

        header.innerHTML = _point_template_html__WEBPACK_IMPORTED_MODULE_0__["default"];

        // Label for point identification
        header.querySelector('label').textContent = node.__id;

        // LMV { x, y, z } values
        var row = header.querySelector('tr[user-data="lmv"]');
        var xyz = row.querySelectorAll('td');
        setTextContent(xyz[1], node.point.x); // skip first cell
        setTextContent(xyz[2], node.point.y);
        setTextContent(xyz[3], node.point.z);

        // LonLat/WGS84 values
        row = header.querySelector('tr[user-data="wgs84"]');
        if (this.extension.hasGeolocationData()) {
          var lonLat = this.extension.lmvToLonLat(node.point);
          xyz = row.querySelectorAll('td');
          setTextContent(xyz[1], lonLat.x); // skip first cell
          setTextContent(xyz[2], lonLat.y);
          setTextContent(xyz[3], lonLat.z);
        } else {
          // Hide
          row.style.display = 'none';
        }


        // Hide "Map" button when there's no geolocation data for the model
        if (!this.extension.hasGeolocationData()) {
          header.querySelector('[user-data=map]').style.display = 'none';
        }
      };
      delegate.onTreeNodeClick = function (tree, node, event) {

        if (event.target.tagName === 'BUTTON') {

          var action = event.target.getAttribute('user-data');
          var _window = _this2.getWindow();
          switch (action) {
            case 'close':{
                _this2.extension.removePoint(node);
                return;
              }

            case 'map':{
                var lonLat = _this2.extension.lmvToLonLat(node.point);
                var mapsUrl = _this2.extension.getGoogleMapsUrl(lonLat);
                console.log(mapsUrl);
                _window.open(mapsUrl);
                return;
              }}


          return;
        }

        // Restore camera position
        _this2.viewer.restoreState(node.__viewerState);
        //console.log(node.point);
      };

      return delegate;
    }

    /**
       * @private
       * Renders model's geolocation data onto an HTML div
       * 
       * @param {HtmlDiv} geoDiv 
       * @param {Object} model
       */ }, { key: "_setGeolocationMetadata", value: function _setGeolocationMetadata(
    geoDiv, model) {
      // Refer to geo_template.html
      var row;
      var metadata = model.getData().metadata || {};
      var geoRef = metadata.georeference || {};
      var otherVals = metadata['custom values'] || {};
      var globalOffset = model.getData().globalOffset || { x: 0, y: 0, z: 0 };
      var distanceUnit = model.getDisplayUnit();

      // globalOffset
      row = geoDiv.querySelector('[user-data=row-globalOffset]');
      setTextContent(row.children[1], globalOffset.x);
      setTextContent(row.children[2], globalOffset.y);
      setTextContent(row.children[3], globalOffset.z);

      // positionLL84
      row = geoDiv.querySelector('[user-data=row-positionLL84]');
      setTextContent(row.children[1], Array.isArray(geoRef.positionLL84) ? geoRef.positionLL84[0] : 'N/A');
      setTextContent(row.children[2], Array.isArray(geoRef.positionLL84) ? geoRef.positionLL84[1] : 'N/A');
      setTextContent(row.children[3], Array.isArray(geoRef.positionLL84) ? geoRef.positionLL84[2] : 'N/A');

      // refPointLMV
      row = geoDiv.querySelector('[user-data=row-refPointLMV]');
      setTextContent(row.children[1], Array.isArray(geoRef.refPointLMV) ? geoRef.refPointLMV[0] : 'N/A');
      setTextContent(row.children[2], Array.isArray(geoRef.refPointLMV) ? geoRef.refPointLMV[1] : 'N/A');
      setTextContent(row.children[3], Array.isArray(geoRef.refPointLMV) ? geoRef.refPointLMV[2] : 'N/A');

      // angleToTrueNorth
      row = geoDiv.querySelector('[user-data=row-angleToTrueNorth]');
      setTextContent(row.children[1], otherVals.angleToTrueNorth !== undefined ? otherVals.angleToTrueNorth : 'N/A');

      // scaleFactor
      row = geoDiv.querySelector('[user-data=row-scaleFactor]');
      setTextContent(row.children[1], otherVals.scaleFactor !== undefined ? otherVals.scaleFactor : 'N/A');

      // refPointTransform
      row = geoDiv.querySelector('[user-data=row-refPointTransform]');
      setTextContent(row.children[1], Array.isArray(otherVals.refPointTransform) ? 'Available' : 'N/A');

      // distanceUnit
      row = geoDiv.querySelector('[user-data=row-distanceUnit]');
      setTextContent(row.children[1], distanceUnit || 'N/A');

    } }]);return Panel;}(avu.DockingPanel);


function setTextContent(div, value, decimals) {
  decimals = decimals || 6;
  div.textContent = typeof value === 'number' ? value.toFixed(decimals) : value;
  div.setAttribute('title', value);
}

/***/ }),

/***/ "./extensions/Geolocation/ui/tool.js":
/*!*******************************************!*\
  !*** ./extensions/Geolocation/ui/tool.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PointTool": () => (/* binding */ PointTool)
/* harmony export */ });

var av = Autodesk.Viewing;

function PointTool(extension) {

  av.ToolInterface.call(this);
  this.names = ['pointTool'];
  this.extension = extension;
  this.viewer = extension.viewer;

  this.handleSingleClick = function (event, button) {

    // Process only primary button
    if (button !== 0)
    return false;

    var canvasX = event.canvasX;
    var canvasY = event.canvasY;
    var res = this.viewer.clientToWorld(canvasX, canvasY);

    if (!res)
    return false;

    this.extension.pushPoint(res);
    return true;
  };

  this.activate = function (name, viewerApi) {
    this.viewer.impl.pauseHighlight(true);
    this.viewer.clearSelection();
  };

  this.deactivate = function () {
    this.viewer.impl.pauseHighlight(false);
  };

  this.destroy = function () {
    this.viewer = null;
  };

}

/***/ }),

/***/ "./extensions/Geolocation/ui/uiController.js":
/*!***************************************************!*\
  !*** ./extensions/Geolocation/ui/uiController.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UiController": () => (/* binding */ UiController)
/* harmony export */ });
/* harmony import */ var _panel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./panel */ "./extensions/Geolocation/ui/panel.js");
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./canvas */ "./extensions/Geolocation/ui/canvas.js");
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}


var UiController = /*#__PURE__*/function () {

  function UiController(extension) {_classCallCheck(this, UiController);

    this.extension = extension;
    this.panel = new _panel__WEBPACK_IMPORTED_MODULE_0__.Panel(extension);
    this.canvas = new _canvas__WEBPACK_IMPORTED_MODULE_1__.CanvasPoints(extension);
  }_createClass(UiController, [{ key: "pushPoint", value: function pushPoint(

    pointData) {

      if (!pointData)
      return;

      // Make sure the panel is visible
      this.panel.setVisible(true);
      this.panel.pushPoint(pointData);

      this.canvas.pushPoint(pointData);
    } }, { key: "removePoint", value: function removePoint(

    pointData) {

      if (!pointData)
      return;

      this.panel.removePoint(pointData);
      this.canvas.removePoint(pointData);
    } }, { key: "activate", value: function activate()

    {
      this.panel.setVisible(true);
    } }, { key: "deactivate", value: function deactivate()

    {
      this.panel.setVisible(false);
    } }, { key: "destroy", value: function destroy()

    {
      this.extension = null;
      if (this.panel) {
        this.panel.destroy();
        this.panel = null;
      }
      if (this.canvas) {
        this.canvas.destroy();
        this.canvas = null;
      }
    } }]);return UiController;}();

/***/ }),

/***/ "./extensions/Geolocation/ui/geo_template.html":
/*!*****************************************************!*\
  !*** ./extensions/Geolocation/ui/geo_template.html ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("\n<table style=\"width:100%;\">\n    <tr user-data=\"row-positionLL84\" style=\"color: #2cd86a;\">\n        <td>GPS (positionLL84)</td>\n        <td style=\"border: 1px solid black\">_latitude_</td>\n        <td style=\"border: 1px solid black;\">_longitude_</td>\n        <td style=\"border: 1px solid black;\">_height_meters_</td>\n    </tr>\n    <tr user-data=\"row-refPointLMV\">\n        <td>Viewer (refPointLMV)</td>\n        <td style=\"border: 1px solid black\">_x_</td>\n        <td style=\"border: 1px solid black;\">_y_</td>\n        <td style=\"border: 1px solid black;\">_z_</td>\n    </tr>\n    <tr user-data=\"row-angleToTrueNorth\">\n        <td>angleToTrueNorth</td>\n        <td style=\"border: 1px solid black\" colspan=\"3\">_angle_deg_</td>\n    </tr>\n    <tr user-data=\"row-scaleFactor\">\n        <td>scaleFactor</td>\n        <td style=\"border: 1px solid black\" colspan=\"3\">_scale_num_</td>\n    </tr>\n    <tr user-data=\"row-refPointTransform\">\n        <td>refPointTransform</td>\n        <td style=\"border: 1px solid black\" colspan=\"3\">_yes_or_no_</td>\n    </tr>\n    <tr user-data=\"row-distanceUnit\">\n        <td>distanceUnit</td>\n        <td style=\"border: 1px solid black\" colspan=\"3\">_meters_or_inches_or_etc_</td>\n    </tr>\n    <tr user-data=\"row-globalOffset\">\n        <td>globalOffset</td>\n        <td style=\"border: 1px solid black\">_x_</td>\n        <td style=\"border: 1px solid black;\">_y_</td>\n        <td style=\"border: 1px solid black;\">_z_</td>\n    </tr>\n    \n</table>\n");

/***/ }),

/***/ "./extensions/Geolocation/ui/point_template.html":
/*!*******************************************************!*\
  !*** ./extensions/Geolocation/ui/point_template.html ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<label style=\"font-size:22px;\">id</label>\n<div style=\"float:right; margin-top:6px; \">\n    <button user-data=\"map\" style=\"margin-right:10px;\">Map</button> \n    <button user-data=\"close\" style=\"margin-right:10px;\">X</button> \n</div>\n<table style=\"width:100%;\">\n    <tr user-data=\"lmv\" title=\"Coordinates in LMV space, obtained via viewer.clientToWorld(mouseX, mouseY);\">\n        <td style=\"border: 1px solid black;\">LMV</td>\n        <td style=\"border: 1px solid #F44336;\">x</td>\n        <td style=\"border: 1px solid #4CAF50;\">y</td>\n        <td style=\"border: 1px solid #2196F3;\">z</td>\n    </tr>\n    <tr user-data=\"wgs84\" title=\"Longitude, Latitude, and Height in WGS84.\">\n        <td style=\"border: 1px solid black;\">LonLat</td>\n        <td style=\"border: 1px solid #F44336;\">lon</td>\n        <td style=\"border: 1px solid #4CAF50;\">lat</td>\n        <td style=\"border: 1px solid #2196F3;\">height</td>\n    </tr>\n</table>");

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
/*!*****************************************!*\
  !*** ./extensions/Geolocation/index.js ***!
  \*****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LocalCS": () => (/* reexport safe */ _LocalCS__WEBPACK_IMPORTED_MODULE_2__.LocalCS),
/* harmony export */   "GeolocationExtension": () => (/* binding */ GeolocationExtension)
/* harmony export */ });
/* harmony import */ var _ui_tool__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui/tool */ "./extensions/Geolocation/ui/tool.js");
/* harmony import */ var _ui_uiController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui/uiController */ "./extensions/Geolocation/ui/uiController.js");
/* harmony import */ var _LocalCS__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LocalCS */ "./extensions/Geolocation/LocalCS.js");
/* harmony import */ var _Maps__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Maps */ "./extensions/Geolocation/Maps.js");
/* harmony import */ var _GlobeMath__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./GlobeMath */ "./extensions/Geolocation/GlobeMath.js");
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}






var av = Autodesk.Viewing;
var avp = Autodesk.Viewing.Private;



/**
                            * Provides functions for converting GPS coordinates in WGS-84 format { x: Longitude, y: Latitude, z: Height(m) } into
                            * Viewer scene coordinates, and back. Supports a single model loaded into the scene.
                            * 
                            * The extension id is: `Autodesk.Geolocation`
                            * 
                            * @example
                            *   viewer.loadExtension('Autodesk.Geolocation')
                            * 
                            * @memberof Autodesk.Viewing.Extensions
                            * @alias Autodesk.Viewing.Extensions.GeolocationExtension
                            * @see {@link Autodesk.Viewing.Extension} for common inherited methods.
                            */
var GeolocationExtension = /*#__PURE__*/function (_av$Extension) {_inherits(GeolocationExtension, _av$Extension);var _super = _createSuper(GeolocationExtension);

  /**
                                                                                                                                                                          * @param {Autodesk.Viewing.Viewer3D} viewer - The Viewer instance
                                                                                                                                                                          * @param {object} [options] - Not used
                                                                                                                                                                          */
  function GeolocationExtension(viewer, options) {var _this;_classCallCheck(this, GeolocationExtension);
    _this = _super.call(this, viewer, options);
    _this.nextPointId = 0;return _this;
  }_createClass(GeolocationExtension, [{ key: "load", value: function load()





    {

      this.ui = new _ui_uiController__WEBPACK_IMPORTED_MODULE_1__.UiController(this),
      this.tool = new _ui_tool__WEBPACK_IMPORTED_MODULE_0__.PointTool(this);
      this.viewer.toolController.registerTool(this.tool);

      return true;
    } }, { key: "unload", value: function unload()

    {

      this.deactivate();

      if (this.tool) {
        this.viewer.toolController.deregisterTool(this.tool);
        this.tool.destroy();
        this.tool = null;
      }

      if (this.ui) {
        this.ui.destroy();
        this.ui = null;
      }

      this.viewer = null;

      return true;
    }

    /**
       * When active, the extension will detect clicks on the model and will
       * place a marker on the model. A panel will be displayed containing vertices clicked
       * on the model. Each point-entry will also contain GPS its associated GPS position.
       * 
       * @alias Autodesk.Viewing.Extensions.GeolocationExtension#activate
       */ }, { key: "activate", value: function activate()
    {
      if (!this.viewer.model)
      return false;
      if (this.isActive())
      return true;
      this.ui.activate();
      this.viewer.toolController.activateTool(this.tool.getName());
      if (this.viewer.model.is3d()) {
        this.viewer.getExtension('Autodesk.ViewCubeUi', function (ext) {
          ext.showTriad(true);
        });
      }
      return true;
    }

    /**
       * Stops detecting click events on the canvas and closes the Panel.
       * 
       * @alias Autodesk.Viewing.Extensions.GeolocationExtension#deactivate
       */ }, { key: "deactivate", value: function deactivate()
    {
      if (!this.isActive())
      return true;
      this.ui.deactivate();
      this.viewer.toolController.deactivateTool(this.tool.getName());
      if (this.viewer.model && this.viewer.model.is3d()) {
        this.viewer.getExtension('Autodesk.ViewCubeUi', function (ext) {
          ext.showTriad(false);
        });
      }
      return true;
    }

    /**
       * Whether the extension is active.
       * When the extension is active, click events will be processed and added
       * into a Panel.
       * 
       * @returns {boolean} True if the extension is active.
       * 
       * @alias Autodesk.Viewing.Extensions.GeolocationExtension#isActive
       */ }, { key: "isActive", value: function isActive()
    {
      var toolActive = this.viewer.toolController.isToolActivated(this.tool.getName());
      return toolActive;
    }

    /**
       * User has clicked on the canvas and a new point is to be added.
       *
       * @param {object} pointData 
       * @private
       */ }, { key: "pushPoint", value: function pushPoint(
    pointData) {
      pointData.__id = this.nextPointId++;
      pointData.__viewerState = this.viewer.getState({ viewport: true });
      this.ui.pushPoint(pointData);
    }

    /**
       * Invoked by Panel UI; removes a point from the canvas.
       *
       * @param pointData
       * @private
       */ }, { key: "removePoint", value: function removePoint(
    pointData) {
      this.ui.removePoint(pointData);
    }

    /**
       * @private
       */ }, { key: "getLocalCS", value: function getLocalCS()
    {
      if (!this._localCS) {
        this._localCS = _LocalCS__WEBPACK_IMPORTED_MODULE_2__.LocalCS.createFromModel(this.viewer.model);
      }
      return this._localCS;
    }

    /**
       * @returns {boolean} true when the model contains geolocation data.
       * 
       * @alias Autodesk.Viewing.Extensions.GeolocationExtension#hasGeolocationData
       */ }, { key: "hasGeolocationData", value: function hasGeolocationData()
    {
      var localCs = this.getLocalCS();
      return !!localCs;
    }

    /**
       * Converts viewer coordinates (obtained with something like `viewer.clientToWorld()`)
       * into { x: Longitude, y: Latitude, z: Height (meters) } in WGS-84 format.
       * 
       * @param {THREE.Vector3} lmvPoint - 3D point in the scene
       * @returns {THREE.Vector3} GPS coordinate in WGS-84 format: { x: Longitude, y: Latitude, z: Height }
       * 
       * @alias Autodesk.Viewing.Extensions.GeolocationExtension#lmvToLonLat
       */ }, { key: "lmvToLonLat", value: function lmvToLonLat(
    lmvPoint) {
      var thePoint = new avp.LmvVector3(lmvPoint.x, lmvPoint.y, lmvPoint.z);
      var localCS = this.getLocalCS();
      var lonLat = localCS.lmv2LL84Point(thePoint);
      return lonLat;
    }

    /**
       * Converts coordinates from { x: Longitude, y: Latitude, z: Height (meters) } in WGS-84 format
       * into viewer scene coordinates.
       * 
       * @param {THREE.Vector3} lonLat - GPS coordinate in WGS-84 format: { x: Longitude, y: Latitude, z: Height }
       * @returns {THREE.Vector3} 3D point in the scene
       * 
       * @alias Autodesk.Viewing.Extensions.GeolocationExtension#lonLatToLmv
       */ }, { key: "lonLatToLmv", value: function lonLatToLmv(
    lonLat) {
      var lonLatPoint = new avp.LmvVector3(lonLat.x, lonLat.y, lonLat.z || 0);
      var localCS = this.getLocalCS();
      var lmvPoint = localCS.LL842LmvPoint(lonLatPoint);
      return lmvPoint;
    }

    /**
       * Returns a Google Maps URL with a PIN on the specified GPS location.
       * When no argument is provided, the URL will use the Model's geolocation if available.
       * 
       * @param {THREE.Vector3} [pointLL84] - GPS location in WGS-84 format: { x: Longitude, y: Latitude }. Height is ignored.
       * 
       * @alias Autodesk.Viewing.Extensions.GeolocationExtension#openGoogleMaps
       */ }, { key: "getGoogleMapsUrl", value: function getGoogleMapsUrl(
    pointLL84) {

      var localCS = this.getLocalCS();
      if (!pointLL84 && !localCS) {
        console.warn("Model doesn't contain geolocation data.");
        return;
      }

      var wgs84 = pointLL84 || localCS.getLL84();
      return (0,_Maps__WEBPACK_IMPORTED_MODULE_3__.getGoogleMapsUrl)(wgs84);
    }

    /**
       * Returns a Promise that resolves with a position in Viewer-space coordinates based on the
       * device's real world GPS position.
       * 
       * @returns {Promise} that resolves with a THREE.Vector3 containing Viewer-space coordinates. It rejects if device's real world GPS position is not available.
       *
       * @alias Autodesk.Viewing.Extensions.GeolocationExtension#getCurrentPositionLmv
       */ }, { key: "getCurrentPositionLmv", value: function getCurrentPositionLmv()
    {var _this2 = this;

      if (!this.hasGeolocationData()) {
        return Promise.reject("Model doesn't contain geolocation data.");
      }

      return new Promise(function (resolve, reject) {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(function (position) {
            var lmvPos = _this2.lonLatToLmv({ x: position.coords.longitude, y: position.coords.latitude, z: 0 });
            resolve(lmvPos);
          });
        } else {
          reject('geolocation API not available on this device.');
        }
      });
    } }], [{ key: "getGlobeMath", value: function getGlobeMath() {return _GlobeMath__WEBPACK_IMPORTED_MODULE_4__;} }]);return GeolocationExtension;}(av.Extension);




av.theExtensionManager.registerExtension('Autodesk.Geolocation', GeolocationExtension);
})();

Autodesk.Extensions.Geolocation = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=Geolocation.js.map