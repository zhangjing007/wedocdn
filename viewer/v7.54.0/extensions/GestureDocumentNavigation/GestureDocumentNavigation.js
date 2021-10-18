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

/***/ "./extensions/GestureDocumentNavigation/BubbleUtils.js":
/*!*************************************************************!*\
  !*** ./extensions/GestureDocumentNavigation/BubbleUtils.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "parseBubble": () => (/* binding */ parseBubble)
/* harmony export */ });
/* harmony import */ var _ModelUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ModelUtils */ "./extensions/GestureDocumentNavigation/ModelUtils.js");


var parseBubble = function parseBubble(viewerDoc) {
  var doc = viewerDoc;
  var viewableItem = doc.getRoot().findAllViewables()[0];
  var fileExtension = _ModelUtils__WEBPACK_IMPORTED_MODULE_0__["default"].getModelExtension(viewableItem.name());

  function buildTree(node, role) {
    // Don't save nodes with type other than 'folder' or 'view' or 'geometry'.
    if (!(node.type() === 'folder' || node.type() === 'view' || node.type() === 'geometry')) {
      return null;
    }

    // Don't save a geometry with a different role than the given one (2d or 3d).
    if (node.type() === 'geometry' && node.data.role !== role) {
      return null;
    }

    var outputNode = {
      guid: node.guid(),
      name: node.name(),
      type: node.type() };


    if (node.type() === 'geometry') {
      outputNode.order = node.data.order;
      outputNode.status = node.data.status;
      outputNode.role = node.data.role;
      outputNode.hasThumbnail = node.data.hasThumbnail && node.data.hasThumbnail.toLowerCase() === 'true';
    }

    if (node.children) {
      // build the subtree of the node's children.
      var outputChildren = node.children.map(function (child) {return buildTree(child, role);}).filter(function (child) {return !!child;});

      if (outputChildren.length > 0) {
        outputNode.children = outputChildren;
      }
    }

    // Don't save empty folders
    if (node.type() === 'folder' && !outputNode.children) {
      return null;
    }

    return outputNode;
  }

  var getGeometries = function getGeometries(tree) {
    if (!tree) {
      return [];
    }
    var wrapper = new Autodesk.Viewing.BubbleNode(tree);
    var geometries = wrapper.search({ type: 'geometry' });
    if (geometries) {
      return geometries.map(function (geometry) {return geometry.data;});
    }

    return null;
  };

  var modifyGeometries = function modifyGeometries(geometries) {
    geometries.forEach(function (geometry) {
      // PDFs can have only one single view - so if there are more, remove them.
      if (fileExtension === 'pdf' && geometry.children && geometry.children.length > 1) {
        geometry.children = [geometry.children[0]];
      }
    });


    // If current document is PDF, then sort geometries by 'order' property.
    // Since pdf extractor will handle pdf by parallel process, the geometries list may out of order.
    if (fileExtension === 'pdf') {
      geometries.sort(function (a, b) {
        return a.order - b.order;
      });
    } else {
      geometries.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    }

    return geometries;
  };

  var filterGeometries = function filterGeometries(geometries) {
    return geometries.filter(function (geometry) {return (
        // NWD extractor doesn't support 2d files. If they do appear, ignore them.
        !(fileExtension === 'nwd' && geometry.role === '2d'));});


    // In case you want to add another filter here, just compose like this: a.filter(b => b>2).filter(c => c>3).
  };

  if (fileExtension === 'pdf') {
    var pdfItems = filterGeometries(modifyGeometries(getGeometries(buildTree(viewableItem, '2d'))));

    return [{ type: 'PDF', sheets: pdfItems }];
  } else {
    var geometries3D = filterGeometries(modifyGeometries(getGeometries(buildTree(viewableItem, '3d'))));
    var geometries2D = filterGeometries(modifyGeometries(getGeometries(buildTree(viewableItem, '2d'))));

    return [
    { type: '2D', sheets: geometries2D },
    { type: '3D', sheets: geometries3D }];

  }
};

/***/ }),

/***/ "./extensions/GestureDocumentNavigation/CameraUtils.js":
/*!*************************************************************!*\
  !*** ./extensions/GestureDocumentNavigation/CameraUtils.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _GeometryUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GeometryUtils */ "./extensions/GestureDocumentNavigation/GeometryUtils.js");


var CameraUtils = {};

// Same as viewer.worldToClient, but with a camera as argument.
CameraUtils.worldToClient = function (viewer, point, camera) {
  var p = new THREE.Vector4(point.x, point.y, point.z, 1);
  p.applyMatrix4(camera.matrixWorldInverse);
  p.applyMatrix4(camera.projectionMatrix);

  // Don't want to mirror values with negative z (behind camera)
  if (p.w > 0) {
    p.x /= p.w;
    p.y /= p.w;
    p.z /= p.w;
  }

  return viewer.impl.viewportToClient(p.x, p.y);
};

CameraUtils.getCameraEyeVector = function (camera) {
  return camera.target.clone().sub(camera.position).normalize();
};

CameraUtils.getCameraRightVector = function (camera) {
  var eye = CameraUtils.getCameraEyeVector(camera);
  return new THREE.Vector3().crossVectors(eye, camera.up).normalize();
};

CameraUtils.getCameraUpVector = function (camera) {
  var right = CameraUtils.getCameraRightVector(camera);
  var eye = CameraUtils.getCameraEyeVector(camera);
  return new THREE.Vector3().crossVectors(right, eye).normalize();
};

CameraUtils.getCameraRotation = function (camera) {
  return _GeometryUtils__WEBPACK_IMPORTED_MODULE_0__["default"].getSignedAngle(CameraUtils.getCameraUpVector(camera), new THREE.Vector3(0, 1, 0), CameraUtils.getCameraEyeVector(camera));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CameraUtils);

/***/ }),

/***/ "./extensions/GestureDocumentNavigation/GeometryUtils.js":
/*!***************************************************************!*\
  !*** ./extensions/GestureDocumentNavigation/GeometryUtils.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var GeometryUtils = {};

GeometryUtils.radiansToDegrees = function (radians) {
  return radians * (180 / Math.PI);
};

GeometryUtils.degreesToRadians = function (degrees) {
  return degrees * (Math.PI / 180);
};

GeometryUtils.applyRotation = function (points, angle, pivot, frontVector) {
  if (!(points instanceof Array)) {
    points = [points];
  }

  points.forEach(function (point) {
    point.sub(pivot);
    point.applyAxisAngle(frontVector, angle);
    point.add(pivot);
  });
};

GeometryUtils.getSignedAngle = function (v1, v2, eyeVector) {
  var angle = v1.angleTo(v2);

  var n = v1.clone().cross(v2).normalize();
  var sign = eyeVector.dot(n) > 0 ? 1 : -1;

  return angle * sign;
};

GeometryUtils.swapBoundingBoxY = function (boundingBox) {var _ref =
  [boundingBox.min.y, boundingBox.max.y];boundingBox.max.y = _ref[0];boundingBox.min.y = _ref[1];

  return boundingBox;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GeometryUtils);

/***/ }),

/***/ "./extensions/GestureDocumentNavigation/GestureDocumentNavigationConstants.js":
/*!************************************************************************************!*\
  !*** ./extensions/GestureDocumentNavigation/GestureDocumentNavigationConstants.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NAVIGATION_DISTANCE_2D": () => (/* binding */ NAVIGATION_DISTANCE_2D),
/* harmony export */   "NAVIGATION_DISTANCE_3D": () => (/* binding */ NAVIGATION_DISTANCE_3D),
/* harmony export */   "NAVIGATION_VELOCITY_2D": () => (/* binding */ NAVIGATION_VELOCITY_2D),
/* harmony export */   "NAVIGATION_VELOCITY_3D": () => (/* binding */ NAVIGATION_VELOCITY_3D)
/* harmony export */ });
var NAVIGATION_DISTANCE_2D = 50;
var NAVIGATION_DISTANCE_3D = 350; // In order to prevent unwanted navigation, the minimum navigation distance is pretty high.
var NAVIGATION_VELOCITY_2D = 0.7;
var NAVIGATION_VELOCITY_3D = 1.1;

/***/ }),

/***/ "./extensions/GestureDocumentNavigation/GestureDocumentNavigationTool.js":
/*!*******************************************************************************!*\
  !*** ./extensions/GestureDocumentNavigation/GestureDocumentNavigationTool.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GestureDocumentNavigationTool)
/* harmony export */ });
/* harmony import */ var _GeometryUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GeometryUtils */ "./extensions/GestureDocumentNavigation/GeometryUtils.js");
/* harmony import */ var _GestureDocumentNavigationConstants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GestureDocumentNavigationConstants */ "./extensions/GestureDocumentNavigation/GestureDocumentNavigationConstants.js");
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}
var

GestureDocumentNavigationTool = /*#__PURE__*/function () {
  function GestureDocumentNavigationTool(extension) {_classCallCheck(this, GestureDocumentNavigationTool);
    this.viewer = extension.viewer;
    this.navigationDistance = this.viewer.impl.is2d ? _GestureDocumentNavigationConstants__WEBPACK_IMPORTED_MODULE_1__.NAVIGATION_DISTANCE_2D : _GestureDocumentNavigationConstants__WEBPACK_IMPORTED_MODULE_1__.NAVIGATION_DISTANCE_3D;
    this.navigationVelocity = this.viewer.impl.is2d ? _GestureDocumentNavigationConstants__WEBPACK_IMPORTED_MODULE_1__.NAVIGATION_VELOCITY_2D : _GestureDocumentNavigationConstants__WEBPACK_IMPORTED_MODULE_1__.NAVIGATION_VELOCITY_3D;

    this.documents = extension.documents;
    this.sheets = extension.sheets;

    this.extension = extension;

    this.names = ['gesture-document-navigation'];

    this.leftDirection = new THREE.Vector3(1, 0, 0);
    this.rightDirection = new THREE.Vector3(-1, 0, 0);
    this.upDirection = new THREE.Vector3(0, 1, 0);
    this.downDirection = new THREE.Vector3(0, -1, 0);
    this.eyeVector = new THREE.Vector3(0, 0, 1);

    this.currentDirection = null;
  }_createClass(GestureDocumentNavigationTool, [{ key: "getNames", value: function getNames()

    {
      return this.names;
    } }, { key: "getName", value: function getName()

    {
      return this.names[0];
    } }, { key: "activate", value: function activate(

    name) {
      if (name === this.getName()) {
        this.isActive = true;
      }
    } }, { key: "deactivate", value: function deactivate(

    name) {
      if (name === this.getName()) {
        this.isActive = false;
      }
    } }, { key: "isActive", value: function isActive()

    {
      return this.isActive;
    } }, { key: "getPriority", value: function getPriority()

    {
      return 100;
    } }, { key: "_isCanvasContainsViewport", value: function _isCanvasContainsViewport()

    {
      var bounds = Autodesk.Viewing.ScreenShot.getSceneClientBounds(this.viewer, this.viewer.navigation.getCamera());
      var containerBounds = this.viewer.impl.getCanvasBoundingClientRect();

      return bounds.min.x > containerBounds.left &&
      bounds.max.x < containerBounds.right &&
      bounds.min.y > containerBounds.height - containerBounds.bottom &&
      bounds.max.y < containerBounds.height - containerBounds.top;

    }

    /**
       * On Drag event, gets the the right item to switch to, based on user gesture's direction,
       * @returns {boolean} True if there is an item to move to.
       * @param {boolean} event - Dragmove event.
       * @private
      */ }, { key: "onDrag", value: function onDrag(
    event) {
      var v = new THREE.Vector3(event.canvasX, event.canvasY, 0).sub(this.startPoint);
      var length = v.length();

      var angle = _GeometryUtils__WEBPACK_IMPORTED_MODULE_0__["default"].getSignedAngle(v, this.leftDirection, this.eyeVector);

      if (angle < 0) {
        angle += 2 * Math.PI;
      }

      var indexToLoad = null;
      var isSheet;
      var isDocument;

      if (angle > 5 / 4 * Math.PI && angle < 7 / 4 * Math.PI && this.sheets.length > 1) {
        this.currentDirection = this.upDirection;

        if (this.extension.currentSheetIndex === 0) {
          if (this.extension.options.enableCyclicSwipe) {
            indexToLoad = this.sheets.length - 1;
          }
        } else {
          indexToLoad = this.extension.currentSheetIndex - 1;
        }

        isSheet = true;
      } else if (angle > 1 / 4 * Math.PI && angle <= 3 / 4 * Math.PI && this.sheets.length > 1) {
        this.currentDirection = this.downDirection;

        if (this.extension.currentSheetIndex === this.sheets.length - 1) {
          if (this.extension.options.enableCyclicSwipe) {
            indexToLoad = 0;
          }
        } else {
          indexToLoad = this.extension.currentSheetIndex + 1;
        }

        isSheet = true;
      } else if (angle > 3 / 4 * Math.PI && angle <= 5 / 4 * Math.PI && this.documents.length > 1) {
        this.currentDirection = this.leftDirection;

        if (this.extension.currentDocumentIndex === this.documents.length - 1) {
          if (this.extension.options.enableCyclicSwipe) {
            indexToLoad = 0;
          }
        } else {
          indexToLoad = this.extension.currentDocumentIndex + 1;
        }

        isDocument = true;
      } else if ((angle > 7 / 4 * Math.PI || angle <= 1 / 4 * Math.PI) && this.documents.length > 1) {
        this.currentDirection = this.rightDirection;

        if (this.extension.currentDocumentIndex === 0) {
          if (this.extension.options.enableCyclicSwipe) {
            indexToLoad = this.documents.length - 1;
          }
        } else {
          indexToLoad = this.extension.currentDocumentIndex - 1;
        }

        isDocument = true;
      }

      var hasItem = indexToLoad !== null && (isSheet || isDocument);

      if (hasItem && length >= this.navigationDistance) {
        if (isSheet) {var
          guid = this.sheets[indexToLoad].guid;
          this.extension.changeSheetRequired(guid);
        } else if (isDocument) {var _this$documents$index =
          this.documents[indexToLoad],urn = _this$documents$index.urn,_guid = _this$documents$index.guid;
          this.extension.changeDocumentRequired(urn, _guid);
        }

        this.changing = true;
      }

      return hasItem;
    } }, { key: "_isSwipeEnabled", value: function _isSwipeEnabled()

    {
      return this.viewer.model.is3d() || this._isCanvasContainsViewport();
    } }, { key: "handleGesture", value: function handleGesture(

    event) {
      switch (event.type) {
        case 'dragstart':
          this.isSwipeEnabled = this._isSwipeEnabled();
          if (this.isSwipeEnabled) {
            this.startPoint = new THREE.Vector3(event.canvasX, event.canvasY, 0);
          }

          this.swiping = false;
          this.changing = false;

          return false;
        case 'dragmove':
          if (this.changing) {
            return true;
          } else if (this.swiping || this.isSwipeEnabled && Math.abs(event.overallVelocity) > this.navigationVelocity) {
            this.swiping = true;
            return this.onDrag(event);
          }

          return false;
        case 'dragend':
          // When finish swiping, prevent the camera from orbiting. Relevant for 3D only - there is no camera orbit for 2D.
          // I limited this to 3D only, because of a bug I found when returning true when swiping from a 2D document to 3D document - It was blocking orbit.
          return this.changing && this.viewer.model.is3d();

        default:
          break;}


      return false;
    } }]);return GestureDocumentNavigationTool;}();

/***/ }),

/***/ "./extensions/GestureDocumentNavigation/ModelUtils.js":
/*!************************************************************!*\
  !*** ./extensions/GestureDocumentNavigation/ModelUtils.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var ModelUtils = {};

ModelUtils.getModelExtension = function (url) {
  var match = url && url.toLowerCase().match(/\.([a-z0-9]+)(\?|$)/);
  var fileExtension = match ? match[1] : null;
  return fileExtension;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ModelUtils);

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
/*!***************************************************************************!*\
  !*** ./extensions/GestureDocumentNavigation/GestureDocumentNavigation.js ***!
  \***************************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GestureDocumentNavigationExtension)
/* harmony export */ });
/* harmony import */ var _CameraUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CameraUtils */ "./extensions/GestureDocumentNavigation/CameraUtils.js");
/* harmony import */ var _GeometryUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GeometryUtils */ "./extensions/GestureDocumentNavigation/GeometryUtils.js");
/* harmony import */ var _BubbleUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BubbleUtils */ "./extensions/GestureDocumentNavigation/BubbleUtils.js");
/* harmony import */ var _GestureDocumentNavigationTool__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./GestureDocumentNavigationTool */ "./extensions/GestureDocumentNavigation/GestureDocumentNavigationTool.js");
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === "string") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === "Object" && o.constructor) n = o.constructor.name;if (n === "Map" || n === "Set") return Array.from(o);if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _iterableToArray(iter) {if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) return _arrayLikeToArray(arr);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}




/**
                                                                              * Provide an option to switch sheets and documents, using gestures.
                                                                              * 
                                                                              * The extension id is: `Autodesk.BIM360.GestureDocumentNavigation`
                                                                              * 
                                                                              * @example
                                                                              *   viewer.loadExtension('Autodesk.BIM360.GestureDocumentNavigation')
                                                                              *  
                                                                              * @memberof Autodesk.Viewing.Extensions
                                                                              * @alias Autodesk.Viewing.Extensions.GestureDocumentNavigationExtension
                                                                              * @see {@link Autodesk.Viewing.Extension} for common inherited methods.
                                                                              */var
GestureDocumentNavigationExtension = /*#__PURE__*/function (_Autodesk$Viewing$Ext) {_inherits(GestureDocumentNavigationExtension, _Autodesk$Viewing$Ext);var _super = _createSuper(GestureDocumentNavigationExtension);function GestureDocumentNavigationExtension() {_classCallCheck(this, GestureDocumentNavigationExtension);return _super.apply(this, arguments);}_createClass(GestureDocumentNavigationExtension, [{ key: "load",
    /**
                                                                                                                                                                                                                                                                                                                                                                                                                                        * Load the GestureDocumentNavigation extension.
                                                                                                                                                                                                                                                                                                                                                                                                                                        *
                                                                                                                                                                                                                                                                                                                                                                                                                                        * @returns {boolean} True if measure extension is loaded successfully.
                                                                                                                                                                                                                                                                                                                                                                                                                                        * 
                                                                                                                                                                                                                                                                                                                                                                                                                                        * @alias Autodesk.Viewing.Extensions.GestureDocumentNavigationExtension#load
                                                                                                                                                                                                                                                                                                                                                                                                                                        */value: function () {var _load = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {var _this = this;var documentNode, viewerDoc, items, items2D, items3D, prevLock, cache, translation, negativeTranslation;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:

                documentNode = this.viewer.impl.model.getDocumentNode();
                viewerDoc = documentNode.getRootNode().lmvDocument;

                this.currentGuid = documentNode.guid();
                this.currentUrn = viewerDoc.myData.urn;

                this.documents = [{ urn: this.currentUrn, guid: this.currentGuid }];

                items = (0,_BubbleUtils__WEBPACK_IMPORTED_MODULE_2__.parseBubble)(viewerDoc);
                items2D = items[0] && items[0].sheets || [];
                items3D = items[1] && items[1].sheets || [];
                this.sheets = [].concat(_toConsumableArray(items2D), _toConsumableArray(items3D));

                this.pivot = new THREE.Vector3();

                this.currentSheetIndex = this.sheets.findIndex(function (sheet) {return sheet.guid === _this.currentGuid;});
                this.updateCurrentDocumentIndex();

                this.tool = new _GestureDocumentNavigationTool__WEBPACK_IMPORTED_MODULE_3__["default"](this);

                this.viewer.toolController.registerTool(this.tool);

                prevLock = this.viewer.toolController.setIsLocked(false);
                this.viewer.toolController.activateTool(this.tool.getName());
                this.viewer.toolController.setIsLocked(prevLock);

                cache = this.getCache();if (!

                this.viewer.impl.is2d) {_context2.next = 28;break;}
                this.viewer.fitToView(undefined, undefined, true);if (!

                cache.direction) {_context2.next = 26;break;}
                translation = this.getTranslation(cache.direction);
                negativeTranslation = translation.clone().negate();_context2.next = 25;return (
                  this.translateCamera(negativeTranslation, true));case 25:
                this.viewer.addEventListener(Autodesk.Viewing.RENDER_PRESENTED_EVENT, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
                            _this.translateCamera(translation, false));case 2:
                          cache.direction = undefined;case 3:case "end":return _context.stop();}}}, _callee);})),
                { once: true });case 26:_context2.next = 29;break;case 28:


                cache.direction = undefined;case 29:return _context2.abrupt("return",


                true);case 30:case "end":return _context2.stop();}}}, _callee2, this);}));function load() {return _load.apply(this, arguments);}return load;}()


    /**
                                                                                                                                                                 * Unload the measure extension.
                                                                                                                                                                 *
                                                                                                                                                                 * @returns {boolean} True if measure extension is unloaded successfully.
                                                                                                                                                                 * 
                                                                                                                                                                 * @alias Autodesk.Viewing.Extensions.GestureDocumentNavigationExtension#unload
                                                                                                                                                                 */ }, { key: "unload", value: function unload()
    {
      if (this.tool) {
        this.viewer.toolController.deregisterTool(this.tool);
        this.tool = null;
      }

      this.viewer = null;
      this.options = null;

      return true;
    } }, { key: "updateNextDocument", value: function updateNextDocument(

    urn, guid) {
      this.documents.push({ urn: urn, guid: guid });
      this.updateCurrentDocumentIndex();
    } }, { key: "updatePrevDocument", value: function updatePrevDocument(

    urn, guid) {
      this.documents.unshift({ urn: urn, guid: guid });
      this.updateCurrentDocumentIndex();
    } }, { key: "updateCurrentDocumentIndex", value: function updateCurrentDocumentIndex()

    {var _this2 = this;
      this.currentDocumentIndex = this.documents.findIndex(
      function (doc) {return doc.urn === _this2.currentUrn && doc.guid === _this2.currentGuid;});

    }

    /**
       * Prepare current document before switching sheet / document.
       *
       * @param {Function} cb - This callback is called after current document is ready to switch.
       * @alias Autodesk.Viewing.Extensions.GestureDocumentNavigationExtension#prepareChange
       */ }, { key: "prepareChange", value: function () {var _prepareChange = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(
      cb) {var _this3 = this;var onDone, translation;return regeneratorRuntime.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                onDone = function onDone() {
                  var cache = _this3.getCache();
                  cache.direction = _this3.tool.currentDirection;
                  cb();
                };if (!

                this.viewer.model.is3d()) {_context3.next = 5;break;}
                onDone();_context3.next = 9;break;case 5:

                translation = this.getTranslation(this.tool.currentDirection);_context3.next = 8;return (
                  this.translateCamera(translation, false));case 8:
                onDone();case 9:case "end":return _context3.stop();}}}, _callee3, this);}));function prepareChange(_x) {return _prepareChange.apply(this, arguments);}return prepareChange;}()



    /**
                                                                                                                                                                                                * Change a sheet.
                                                                                                                                                                                                *
                                                                                                                                                                                                * @param {number} guid - The guid of the desired sheet.
                                                                                                                                                                                                * @alias Autodesk.Viewing.Extensions.GestureDocumentNavigationExtension#changeSheetRequired
                                                                                                                                                                                                */ }, { key: "changeSheetRequired", value: function changeSheetRequired(
    guid) {var _this4 = this;
      if (!this.options.enableSheetSwipe || !guid) {
        return;
      }

      this.prepareChange(function () {
        _this4.viewer.dispatchEvent({ type: Autodesk.Viewing.GestureDocumentNavigationEvents.CHANGE_SHEET_REQUIRED, guid: guid });
      });
    }

    /**
       * Change a document.
       *
       * @param {number} urn - The urn of the desired document.
       * @param {number} guid - The guid of the desired sheet.
       * @alias Autodesk.Viewing.Extensions.GestureDocumentNavigationExtension#changeSheetRequired
       */ }, { key: "changeDocumentRequired", value: function changeDocumentRequired(
    urn, guid) {var _this5 = this;
      if (!urn) {
        return;
      }

      this.prepareChange(function () {
        _this5.viewer.dispatchEvent({ type: Autodesk.Viewing.GestureDocumentNavigationEvents.CHANGE_DOCUMENT_REQUIRED, urn: urn, guid: guid });
      });
    } }, { key: "getTranslation", value: function getTranslation(

    direction) {
      var camera = this.viewer.getCamera();
      var size = Math.max(camera.top - camera.bottom, camera.right - camera.left);
      var translation = direction.clone().multiplyScalar(size);

      var cameraRotation = _CameraUtils__WEBPACK_IMPORTED_MODULE_0__["default"].getCameraRotation(camera);
      var eyeVec = _CameraUtils__WEBPACK_IMPORTED_MODULE_0__["default"].getCameraEyeVector(camera);
      _GeometryUtils__WEBPACK_IMPORTED_MODULE_1__["default"].applyRotation(translation, -cameraRotation, this.pivot, eyeVec);

      return translation;
    } }, { key: "translateCamera", value: function () {var _translateCamera = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(

      translation, immediate) {var camera, position, target;return regeneratorRuntime.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                this.viewer.utilities.autocam.endInteraction();

                camera = this.viewer.getCamera();

                position = camera.position.clone().add(translation);
                target = camera.target.clone().add(translation);if (!

                immediate) {_context4.next = 8;break;}
                this.viewer.navigation.setView(position, target);_context4.next = 11;break;case 8:

                this.viewer.navigation.setRequestTransitionWithUp(true, position, target, camera.fov, camera.up);_context4.next = 11;return (
                  Autodesk.Viewing.EventUtils.waitUntilTransitionEnded(this.viewer));case 11:case "end":return _context4.stop();}}}, _callee4, this);}));function translateCamera(_x2, _x3) {return _translateCamera.apply(this, arguments);}return translateCamera;}() }]);return GestureDocumentNavigationExtension;}(Autodesk.Viewing.Extension);




Autodesk.Viewing.GestureDocumentNavigationEvents = {};
Autodesk.Viewing.GestureDocumentNavigationEvents.CHANGE_DOCUMENT_REQUIRED = 'change.document.required';
Autodesk.Viewing.GestureDocumentNavigationEvents.CHANGE_SHEET_REQUIRED = 'change.sheet.required';

GestureDocumentNavigationExtension.extensionName = 'Autodesk.BIM360.GestureDocumentNavigation';

Autodesk.Viewing.theExtensionManager.registerExtension(GestureDocumentNavigationExtension.extensionName, GestureDocumentNavigationExtension);
})();

Autodesk.Extensions.GestureDocumentNavigation = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=GestureDocumentNavigation.js.map