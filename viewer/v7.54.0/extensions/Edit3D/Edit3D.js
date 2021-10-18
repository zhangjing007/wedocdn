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

/***/ "./extensions/Edit3D/CoordPicker.js":
/*!******************************************!*\
  !*** ./extensions/Edit3D/CoordPicker.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CoordPicker)
/* harmony export */ });
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(Object(source), true).forEach(function (key) {_defineProperty(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(Object(source)).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var ToolName = 'ModelAlignment.CoordPicker';

var Events = {
  POINT_CLICKED: 'pointClicked',
  POINT_HOVERED: 'pointHovered', // point param may be undefined if no object was hit at the current mouse position 
  ESCAPE: 'escape' };var


CoordPicker = /*#__PURE__*/function () {

  function CoordPicker(viewer, snapper) {_classCallCheck(this, CoordPicker);
    this.viewer = viewer;
    this.snapper = snapper;

    // Bind function so that we can use it for event listeners
    this.onCameraChanged = this.onCameraChanged.bind(this);

    Autodesk.Viewing.EventDispatcher.prototype.apply(this);

    // Optional: If a plane is set, we select points on this plane instead of the model 
    this.selectionPlane = null;

    this.enableSnapper = true;
    this.snapperActive = false;
    this.isDragging = false;

    this.keyMap = {
      SnapKey: Autodesk.Viewing.KeyCode.SHIFT // Holding this key suppresses snapping
    };

    // Track last mouse position in canvas coords. Note that derived classes must call
    // the base class mouse handlers to keep this value valid.
    this.canvasPos = new THREE.Vector2();

    this.tmpPoint = new THREE.Vector3();
    this.tmpMatrix3 = new THREE.Matrix3();

    // Last successful hit under mouse.
    this.lastHit = null;
    this.consumeClickEvents = true;

    this.snapFilter = null; // Optional snapping filter, based on snapResult. (snapResult) => boolean.

    // Set default cursor.
    this.setCursor();
  }

  // @param {THREE.Plane} [plane] - If a plane is set, we are selecting points on that plane instead of the model. 
  _createClass(CoordPicker, [{ key: "setSelectionPlane", value: function setSelectionPlane(plane) {
      this.selectionPlane = plane;
    } }, { key: "getName", value: function getName()

    {
      return ToolName;
    } }, { key: "getNames", value: function getNames()

    {
      return [ToolName];
    } }, { key: "setCursor", value: function setCursor(

    cursor) {
      this.cursor = cursor ? cursor : 'crosshair';
    } }, { key: "getCursor", value: function getCursor()

    {
      return this.isDragging ? 'grabbing' : this.active && this.lastHit ? this.cursor : null;
    } }, { key: "snapperOn", value: function snapperOn()

    {
      if (!this.snapperActive) {
        this.viewer.toolController.activateTool(this.snapper.getName());
        this.snapperActive = true;
      }
    } }, { key: "snapperOff", value: function snapperOff()

    {
      if (this.snapperActive) {
        this.viewer.toolController.deactivateTool(this.snapper.getName());
        this.snapperActive = false;
      }
    } }, { key: "setSnapperEnabled", value: function setSnapperEnabled(

    enabled) {
      this.enableSnapper = enabled;
      if (enabled) {
        this.snapperOn();
      } else {
        this.snapperOff();
      }
    } }, { key: "setSnapFilter", value: function setSnapFilter(

    snapFilter) {
      this.snapFilter = snapFilter;
      this.snapper.setSnapFilter(snapFilter);
    } }, { key: "activate", value: function activate()

    {
      this.active = true;

      if (this.enableSnapper) {
        this.snapperOn();
      }

      this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onCameraChanged);
      this.viewer.impl.pauseHighlight(true);
    } }, { key: "deactivate", value: function deactivate()

    {
      this.active = false;
      this.isDragging = false;
      this.lastHit = null;

      this.snapperOff();

      this.viewer.removeEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onCameraChanged);
      this.viewer.impl.pauseHighlight(false);
    } }, { key: "register", value: function register()

    {}

    // Remember last mouse position
  }, { key: "trackMousePos", value: function trackMousePos(e) {
      this.canvasPos.set(e.canvasX, e.canvasY);
    } }, { key: "handleMouseMove", value: function handleMouseMove(

    event) {
      this.trackMousePos(event);

      // Make sure that snapping result is up-to-date
      this.snapper.onMouseMove({ x: event.canvasX, y: event.canvasY });

      if (this.snapper.indicator) {
        this.snapper.indicator.render();
      }

      // Note that we always fire, even if hit is undefined. This is needed to clear indicators and edit 
      // values if the mouse is not on an object anymore.
      var result = this.getHitResultUnderMouse(event);
      this.fireEvent(_objectSpread({ type: Events.POINT_HOVERED }, result));

      return this.isDragging;
    }

    // Returns hitPoint under mouse or null if no object under mouse.
  }, { key: "getHitResultUnderMouse", value: function getHitResultUnderMouse(event) {

      var point = null;
      var normal = null;
      var modelId = null;
      var dbId = null;

      if (this.snapperActive && this.snapper.isSnapped()) {
        // Get snapped position.
        var hitResult = this.snapper.getSnapResult();
        point = Autodesk.Viewing.MeasureCommon.getSnapResultPosition(hitResult, this.viewer);
        normal = hitResult === null || hitResult === void 0 ? void 0 : hitResult.faceNormal;
        modelId = hitResult === null || hitResult === void 0 ? void 0 : hitResult.modelId;
        dbId = hitResult === null || hitResult === void 0 ? void 0 : hitResult.snapNode;
      } else {var _hitResult$face, _hitResult$model;
        // When snapper is not active, or no point resulted, perform a simple hit test.
        var _hitResult = this.viewer.impl.hitTest(event.canvasX, event.canvasY);
        point = _hitResult === null || _hitResult === void 0 ? void 0 : _hitResult.point;

        // Extract normal
        if (_hitResult === null || _hitResult === void 0 ? void 0 : (_hitResult$face = _hitResult.face) === null || _hitResult$face === void 0 ? void 0 : _hitResult$face.normal) {
          var mesh = this.viewer.impl.getRenderProxy(_hitResult.model, _hitResult.fragId);
          var normalMatrix = this.tmpMatrix3.getNormalMatrix(mesh.matrixWorld);
          normal = _hitResult.face.normal.clone().applyMatrix3(normalMatrix).normalize();
        }

        modelId = _hitResult === null || _hitResult === void 0 ? void 0 : (_hitResult$model = _hitResult.model) === null || _hitResult$model === void 0 ? void 0 : _hitResult$model.id;
        dbId = _hitResult === null || _hitResult === void 0 ? void 0 : _hitResult.dbId;
      }

      if (this.snapFilter && !this.snapFilter({ modelId: modelId })) {
        point = null;
        normal = null;
        modelId = null;
        dbId = null;
      }

      // If selection plane is set, project the hit point on the plane.
      if (point && this.selectionPlane) {
        point = this.selectionPlane.projectPoint(point, this.tmpPoint);
      }

      var result = { point: point, normal: normal, modelId: modelId, dbId: dbId };

      // Update lastHit only if we have an actual hit.
      this.lastHit = point ? result : null;

      return result;
    } }, { key: "setConsumeClickEvents", value: function setConsumeClickEvents(

    consumeClickEvents) {
      this.consumeClickEvents = consumeClickEvents;
    } }, { key: "handleSingleClick", value: function handleSingleClick(

    event, button) {
      this.trackMousePos(event);

      // Only respond to left button
      if (button !== 0) {
        return false;
      }

      var result = this.getHitResultUnderMouse(event);

      this.fireEvent(_objectSpread({ type: Events.POINT_CLICKED }, result));

      return this.consumeClickEvents;
    } }, { key: "handleDoubleClick", value: function handleDoubleClick(

    event) {
      this.trackMousePos(event);
    } }, { key: "handleButtonDown", value: function handleButtonDown(

    event) {
      this.trackMousePos(event);

      // In case of start dragging, make sure to turn on the snapper first.
      if (this.isDragging) {
        this.snapperOn();
      }

      return this.handleMouseMove(event);
    } }, { key: "handleButtonUp", value: function handleButtonUp(

    event) {
      this.trackMousePos(event);
      return this.isDragging;
    }

    // Simulate mouse move instantly when snapper is being toggled.
  }, { key: "onSnappingToggled", value: function onSnappingToggled() {
      this.handleMouseMove({
        canvasX: this.canvasPos.x,
        canvasY: this.canvasPos.y });

    } }, { key: "handleKeyDown", value: function handleKeyDown(

    event, keyCode) {
      switch (keyCode) {
        case Autodesk.Viewing.KeyCode.BACKSPACE:
        case Autodesk.Viewing.KeyCode.DELETE:
        case Autodesk.Viewing.KeyCode.ESCAPE:
          this.fireEvent({ type: Events.ESCAPE });
          return true;
        case this.keyMap.SnapKey:
          if (this.snapperActive) {
            this.snapperOff();
            this.onSnappingToggled();
            return true;
          }
          return false;
        default:
          break;}


      return false;
    } }, { key: "handleKeyUp", value: function handleKeyUp(


    event, keyCode) {
      switch (keyCode) {
        case this.keyMap.SnapKey:
          if (!this.snapperActive && this.enableSnapper) {
            this.snapperOn();
            this.onSnappingToggled();
            return true;
          }
          return false;
        default:
          break;}


      return false;
    } }, { key: "onCameraChanged", value: function onCameraChanged()

    {
      if (this.snapper.indicator) {
        this.snapper.indicator.render();
      }
    } }, { key: "setDragging", value: function setDragging(

    isDragging) {
      this.isDragging = isDragging;
    } }, { key: "getDragging", value: function getDragging()

    {
      return this.isDragging;
    } }]);return CoordPicker;}();


CoordPicker.Events = Events;
CoordPicker.Name = ToolName;

/***/ }),

/***/ "./extensions/Edit3D/Gizmo3D.js":
/*!**************************************!*\
  !*** ./extensions/Edit3D/Gizmo3D.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Gizmo3D)
/* harmony export */ });
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}
var nextId = 1;

// Helper class for displaying a 3D shape that is scaled to keep approximately constant screen-size.
// Example:
//   const gizmo = new Gizmo3D(viewer).makeCube();
//   gizmo.setPosition(10, 10, 10);
//   gizmo.setVisible(true);
var Gizmo3D = /*#__PURE__*/function () {

  // @param {Viewer3d} viewer
  // @param {number}   [pixelSize]   - Size of the gizmo in pixels
  // @param {Vector3}  [pos]         - Initial position. Default (0,0,0)
  // @param {string}   [overlayName] - Name of an (existing) viewer overlay used to display the gizmo. If not specified, the Gizmo creates its own.
  function Gizmo3D(viewer) {var pixelSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;var pos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;var overlayName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;_classCallCheck(this, Gizmo3D);

    this.viewer = viewer;

    // The shape is auto-scaled in a way that the projected screen-size of the unitBox diagonal
    // keeps equal to this value. 
    this.pixelSize = pixelSize;

    // Container for the gizmo shape. Matrix of this scene is controlled by the gizmo
    this.scene = new THREE.Scene();

    // Shape or scene to be displayed. BBox should be the unit box [-0.5, 0.5]^2, so that
    // uto-scaling works properly.
    this.shape = null;

    // Connect event listener
    this.onCameraChange = this.onCameraChange.bind(this);
    this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onCameraChange);

    // Make sure that matrix is recomputed after position/scale changes.
    this.scene.matrixAutoUpdate = true;

    // Overlay name that we use to display the gizmo
    this.overlayName = overlayName;

    // create own overlay if none specified
    this.overlayOwned = !overlayName;
    if (this.overlayOwned) {
      this.overlayName = "Gizmo3D_Overlay_".concat(this.id);
      this.viewer.impl.createOverlayScene(this.overlayName);
    }

    this.visible = false;

    this.id = nextId++;

    if (pos) {
      this.setPosition(pos);
    }
  }_createClass(Gizmo3D, [{ key: "setPosition", value: function setPosition(

    x, y, z) {

      // Suppoer call with single Vec3 param
      if (_typeof(x) === 'object') {
        this.scene.position.copy(x);
      } else {
        this.scene.position.set(x, y, z);
      }
      this.scene.matrixWorldNeedsUpdate;

      this.update();

      return this;
    } }, { key: "dtor", value: function dtor()

    {
      this.viewer.removeEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onCameraChange);

      if (this.overlayOwned) {
        this.viewer.impl.removeOverlayScene(this.overlayName);
      }
    } }, { key: "clearShape", value: function clearShape()

    {
      if (this.shape) {
        this.scene.remove(this.shape);
        this.shape = null;
      }
    }

    // Set a gizmo shape to display. Must be scaled to unitBox.
  }, { key: "setShape", value: function setShape(shape) {
      this.clearShape();
      this.shape = shape;
      this.scene.add(shape);
      return this;
    }

    // Set shape to sphere
  }, { key: "makeSphere", value: function makeSphere() {var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0xff0000;

      // create sphere mesh, centered at (0,0,0) 
      var radius = 0.5;
      var widthSegments = 22;
      var heightSegments = 16;
      var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
      var material = new THREE.MeshPhongMaterial({ color: color });
      var shape = new THREE.Mesh(geometry, material);

      return this.setShape(shape);
    } }, { key: "makeCube", value: function makeCube()

    {var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0xff0000;

      // create box mesh of edgeLength 1, centered at (0,0,0)
      var geometry = new THREE.BoxGeometry(1, 1, 1);
      var material = new THREE.MeshPhongMaterial({ color: color });
      var shape = new THREE.Mesh(geometry, material);
      return this.setShape(shape);
    } }, { key: "setVisible", value: function setVisible(

    visible) {
      if (this.visible == visible) {
        return;
      }

      if (visible) {
        this.viewer.impl.addOverlay(this.overlayName, this.scene);
      } else {
        this.viewer.impl.removeOverlay(this.overlayName, this.scene);
      }

      this.visible = visible;

      // trigger overlay update
      this.viewer.impl.invalidate(false, false, true);

      return this;
    } }, { key: "update", value: function update()

    {
      // compute screenSize that we get with scaling 1.0
      var dist = this.viewer.impl.camera.position.distanceTo(this.scene.position);
      var worldToPixelScale = this.viewer.impl.camera.pixelsPerUnitAtDistance(dist);

      // compute and apply scale in world-space
      var scale = this.pixelSize / worldToPixelScale;
      this.scene.scale.set(scale, scale, scale);

      // make sure that scale changes takes effect 
      this.scene.matrixWorldNeedsUpdate = true;

      this.viewer.impl.invalidate(false, false, true);
    }

    // On camera changes, update scaling to keep constant pixel-size
  }, { key: "onCameraChange", value: function onCameraChange() {
      this.update();
    } }]);return Gizmo3D;}();

/***/ }),

/***/ "./extensions/Edit3D/Label3D.js":
/*!**************************************!*\
  !*** ./extensions/Edit3D/Label3D.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Label3D)
/* harmony export */ });
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}
var av = Autodesk.Viewing;
var avp = Autodesk.Viewing.Private;

// Given two points p1, p2 in worldSpace, this function computes
// the pixel distance of their screen projections.
var getPixelDistance = function getPixelDistance(viewer, p1, p2) {

  var p1Screen = viewer.impl.worldToClient(p1);
  var p2Screen = viewer.impl.worldToClient(p2);

  var dx = p2Screen.x - p1Screen.x;
  var dy = p2Screen.y - p1Screen.y;
  return Math.sqrt(dx * dx + dy * dy);
};

var Events = {
  DRAG_START: "dragStart",
  DRAG_END: "dragEnd" };


// A Label3D is an html div whose position is synchronized with a fixed world-space position in LMV.
var Label3D = /*#__PURE__*/function (_Autodesk$Viewing$Eve) {_inherits(Label3D, _Autodesk$Viewing$Eve);var _super = _createSuper(Label3D);

  // @param {Viewer3D}      viewer
  // @param {THREE.Vector3} [pos3D] - By default (0,0,0). Can be set later by changing this.pos3D.
  // @param {string}        [text]  - If undefined, label will be empty/invisible by default and you have to configure this.container yourself.
  function Label3D(viewer) {var _this;var pos3D = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new THREE.Vector3();var text = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '<Empty>';_classCallCheck(this, Label3D);
    _this = _super.call(this);
    _this.viewer = viewer;
    _this.pos3D = pos3D;
    _this.pos2D = new THREE.Vector3(); // updated automatically. z is the depth value
    _this.draggable = false;

    _this.setGlobalManager(viewer.globalManager);

    // keep position in-sync with camera changes
    _this.cameraChangeCb = _this.update.bind(_assertThisInitialized(_this));
    _this.viewer.addEventListener(av.CAMERA_CHANGE_EVENT, _this.cameraChangeCb);
    _this.viewer.addEventListener(av.VIEWER_RESIZE_EVENT, _this.cameraChangeCb);

    // Create container
    var document = viewer.canvasWrap.ownerDocument; // (might be != global document in popout scenarios)
    _this.container = document.createElement('div');

    // Note: It's essential that we add it to viewer.canvasWrap instead of viewer.container:
    //       ToolController listens to events on canvasWrap. Therefore, if we would add
    //       it to viewer.container, all mouse events captured would never reach the ToolController
    //       no matter whether the gizmo handles them or not.
    viewer.canvasWrap.appendChild(_this.container);

    // For fadeIn/Out effects
    var setOpacity = function setOpacity(t) {
      _this.container.style.opacity = t;
    };
    _this.opacityParam = new avp.AnimatedParam(0.0, setOpacity, 0.5);

    // Initial fade-in
    _this.opacityParam.fadeTo(1.0);

    // We control position via transform. So, left/top usually keep (0,0)
    _this.container.style.left = '0px';
    _this.container.style.top = '0px';
    _this.container.style.position = 'absolute';
    _this.container.style.pointerEvents = 'none';

    // Only used for text labels
    _this.textDiv = null;
    if (text) {
      _this.setText(text);
    }

    // Level-of-detail (optional)
    _this.worldBox = null;
    _this.minPixels = 0;

    // Update position and fade-in
    _this.setVisible(true);

    _this.onMouseDown = _this.onMouseDown.bind(_assertThisInitialized(_this));return _this;
  }

  // Decides if the label should be shown or hidden.
  // We hide the label the projected box diagonal falls below this.minPixels.
  _createClass(Label3D, [{ key: "shouldBeHidden", value: function shouldBeHidden() {
      if (!this.worldBox) {
        return false;
      }

      var boxSizeScreen = getPixelDistance(this.viewer, this.worldBox.min, this.worldBox.max);
      return boxSizeScreen < this.minPixels;
    }

    // Optional: WorldBox of the annotated object. Used for level-of-detail: We only show the label
    //           if the projected screen-size of the box is >= a given minimum pixel size.
    // @param {Box3}   worldBox
    // @param {number} minPixels
  }, { key: "setWorldBox", value: function setWorldBox(box, minPixels) {
      this.worldBox = box;
      this.minPixels = minPixels;
      this.update(); // hide this label immediately if projected world-box is very small
    }

    // Configure this label to display text
  }, { key: "initTextLabel", value: function initTextLabel() {

      // Create textDiv child div
      var document = this.viewer.container.ownerDocument;
      this.textDiv = document.createElement('div');
      this.container.appendChild(this.textDiv);

      // Use measure-tool styles by default
      this.container.classList.add('measure-length');
      this.container.classList.add('visible');
      this.textDiv.classList.add('measure-length-text');
    } }, { key: "setText", value: function setText(

    text) {
      if (!this.textDiv) {
        this.initTextLabel();
      }
      this.textDiv.textContent = Autodesk.Viewing.i18n.translate(text);
    } }, { key: "dtor", value: function dtor()

    {
      this.container.remove();
      this.viewer.removeEventListener(av.CAMERA_CHANGE_EVENT, this.cameraChangeCb);
      this.viewer.removeEventListener(av.VIEWER_RESIZE_EVENT, this.cameraChangeCb);
    }

    // To change the position, just modify this.pos3D directly and call update().
  }, { key: "update", value: function update() {var _this2 = this;
      // Get canvas position corresponding to this.pos3D
      var _this$viewer$impl$wor = this.viewer.impl.worldToClient(this.pos3D),x = _this$viewer$impl$wor.x,y = _this$viewer$impl$wor.y;

      // Transform the div, so that its center is anchored in (x,y)
      this.container.style.transform = "translate(calc(".concat(x, "px - 50%), calc(").concat(y, "px - 50%))");

      // Hide label if the annotated object is small on screen
      var hidden = !this.visible || this.shouldBeHidden();

      // If the label should be visible, immediately restore the container visibility, so the fade-in will be displayed.
      if (!hidden) {
        this.changeContainerVisibility(!hidden);
      }

      // this.opacityParam.skipAnim();
      this.opacityParam.fadeTo(hidden ? 0.0 : 1.0, function () {
        // If the label should be hidden, change container visibility only after the fade-out animation finished.
        // This is needed in order that the element won't be touchable while hidden.
        _this2.changeContainerVisibility(!hidden);
      });
    }

    // Necessary in addition to the opacity change, in order to remove from the DOM rendering.
  }, { key: "changeContainerVisibility", value: function changeContainerVisibility(show) {
      if (!show && !this.styleHidden) {
        this.styleHidden = true;
        this.container.style.display = 'none';
      } else if (show && this.styleHidden) {
        this.styleHidden = false;
        this.container.style.display = 'block';
      }
    } }, { key: "setPosition", value: function setPosition(

    pos) {
      this.pos3D.copy(pos);
      this.update();
    } }, { key: "setVisible", value: function setVisible(

    visible) {
      this.visible = visible;
      this.update();
    }

    // Fade out and dispose label when done
  }, { key: "dispose", value: function dispose() {var _this3 = this;
      this.setVisible(false);

      // Make sure that we clean up when fading is done.
      window.setTimeout(function () {return _this3.dtor();}, 1000 * this.opacityParam.animTime);
    }

    // @param {number} offset - Optional: Vertical offset in screen-pixels. Positive values shift down.
  }, { key: "setVerticalOffset", value: function setVerticalOffset(offset) {
      this.container.style.top = offset + 'px';
    } }, { key: "onMouseDown", value: function onMouseDown(

    event) {var _this4 = this;
      this.container.style.cursor = "grabbing";

      this.viewer.toolController.__clientToCanvasCoords(event);

      this.fireEvent({ type: Events.DRAG_START, event: event });

      var handleMouseUp = function handleMouseUp(e) {
        _this4.onMouseUp(e);
        _this4.removeDocumentEventListener("mouseup", handleMouseUp);
      };

      this.addDocumentEventListener("mouseup", handleMouseUp);
    } }, { key: "onMouseUp", value: function onMouseUp(

    event) {
      this.container.style.cursor = "grab";

      this.viewer.toolController.__clientToCanvasCoords(event);

      this.fireEvent({ type: Events.DRAG_END, event: event });
    } }, { key: "setDraggable", value: function setDraggable(

    draggable) {
      if (draggable && !this.draggable) {
        this.container.addEventListener("mousedown", this.onMouseDown);
        this.container.style.cursor = "grab";
        this.container.style.pointerEvents = 'auto';
      } else if (!draggable && this.draggable) {
        this.container.removeEventListener("mousedown", this.onMouseDown);
        this.container.style.cursor = "";
        this.container.style.pointerEvents = 'none';
      }

      this.draggable = draggable;
    } }]);return Label3D;}(Autodesk.Viewing.EventDispatcher);


av.GlobalManagerMixin.call(Label3D.prototype);

Label3D.Events = Events;

/***/ }),

/***/ "./extensions/Edit3D/NPointPicker.js":
/*!*******************************************!*\
  !*** ./extensions/Edit3D/NPointPicker.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NPointPicker)
/* harmony export */ });
/* harmony import */ var _CoordPicker_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CoordPicker.js */ "./extensions/Edit3D/CoordPicker.js");
/* harmony import */ var _PointMarker_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PointMarker.js */ "./extensions/Edit3D/PointMarker.js");
function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}


// Controls the user interaction workflow for picking N points

var Events = {
  POINT_SELECTED: "pointSelected",
  POINT_HOVERED: "pointHovered",
  POINT_SELECTION_STARTED: "pointSelectionStarted",
  CLEAR: "clear" };


var Colors = {
  Blue: "rgb(6, 150, 215)", // adskBlue500
  Red: "rgb(236, 74, 65)", // red500
  Black: "rgb(0,0,0)",
  White: "rgb(255,255,255)" };


var ConnectorTypes = {
  Line: "line",
  Arrow: "arrow" };


// N point picker - allows picking N points.
//  @param {Viewer3D}      viewer
//  @param {CoordPicker}   coordPicker
//  @param {ScreenOverlay} screenOverlay
//  @param {number}        N - number of points to select
//  @param {Object}        [options]
//  @param {Boolean}          [options.draggable] -      Whether points are draggable or not
//  @param {String[]}      [options.colors] -         Array of colors
//  @param {String[]}      [options.labels] -         Array of labels
//  @param {String[]}      [options.icons] -          Array of icons
//  @param {Object[]}      [options.connections] -    Array of point connections metadata.
//  @param {Object[]}      [options.stops] -          Array of point indexes that the tool shouldn't automatically continue positioning new points after them.
var NPointPicker = /*#__PURE__*/function () {
  function NPointPicker(viewer, coordPicker, screenOverlay, N) {var _this = this;var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};_classCallCheck(this, NPointPicker);
    this.viewer = viewer;
    this.options = options;
    this.coordPicker = coordPicker;
    this.N = N;

    Autodesk.Viewing.EventDispatcher.prototype.apply(this);

    // Current active point - the one that is currently being picked or hovered.
    this.selectingIndex = -1;

    // Last valid point that was selected. Drag an exising previous point won't change this value.
    this.lastSelectedPoint = -1;

    this.coordPicker.addEventListener(
    _CoordPicker_js__WEBPACK_IMPORTED_MODULE_0__["default"].Events.POINT_CLICKED,
    function (event) {return _this.onPointClicked(event);});

    this.coordPicker.addEventListener(
    _CoordPicker_js__WEBPACK_IMPORTED_MODULE_0__["default"].Events.POINT_HOVERED,
    function (event) {return _this.onPointHovered(event);});

    this.coordPicker.addEventListener(_CoordPicker_js__WEBPACK_IMPORTED_MODULE_0__["default"].Events.ESCAPE, function () {
      // Reset point only when dragging.
      if (_this.coordPicker.isDragging) {
        _this.cancelPointSelection();
      }
    });

    this.points = [];
    this.pointValid = [];
    this.markers = [];
    this.showMarkers = this.options.showMarkers || new Array(this.N).fill(true); // If showMarkers array is not supplied, default to true.
    var _loop = function _loop(
    i) {
      _this.points.push(new THREE.Vector3());
      _this.pointValid.push(false);
      var color = options.colors ? options.colors[i] : Colors.Blue;
      var label = options.labels ? options.labels[i] : undefined;
      var icon = options.icons ? options.icons[i] : undefined;
      var marker = new _PointMarker_js__WEBPACK_IMPORTED_MODULE_1__["default"](_this.viewer, undefined, label, icon);
      _this.markers.push(marker);

      if (_this.options.draggable) {
        marker.addEventListener(_PointMarker_js__WEBPACK_IMPORTED_MODULE_1__["default"].Events.DRAG_START, function () {return (
            _this.startSelectPoint(i, true));});

        marker.addEventListener(_PointMarker_js__WEBPACK_IMPORTED_MODULE_1__["default"].Events.DRAG_END, function (event) {return (
            _this.onDragEnded(event));});

      }

      // Hide the markers until we have valid from/to point
      marker.setVisible(false);
      marker.setColor(color);

      // Custom label style
      if (options.labelStyles && options.labelStyles[i]) {
        Object.keys(options.labelStyles[i]).forEach(function (key) {
          marker.label.container.style[key] = options.labelStyles[i][key];
        });
      }};for (var i = 0; i < this.N; i++) {_loop(i);
    }

    // {Autodesk.Edit2D.ScreenOverlay}
    this.screenOverlay = screenOverlay;

    var connectionsData = this.options.connections || [];
    this.connectors = [];var _loop2 = function _loop2(

    _i) {
      var connectionData = connectionsData[_i];

      // Configure style of line/arrow connection
      var lineStyle = new Autodesk.Edit2D.Style({
        lineStyle: 10,
        lineWidth: 1.5,
        lineColor: connectionData.color || Colors.Blue });


      var gizmo = void 0;
      var attachableObject = void 0;
      var setFrom = void 0;
      var setTo = void 0;

      if (connectionData.type === ConnectorTypes.Line) {
        // Dashed line connecting from/to point
        gizmo = new Autodesk.Edit2D.ScreenOverlay.Line3DGizmo();
        gizmo.line2D.style.copy(lineStyle);

        // Define attachable object for the label
        attachableObject = gizmo.line2D;

        // Define position setters
        setFrom = gizmo.a.copy.bind(gizmo.a);
        setTo = gizmo.b.copy.bind(gizmo.b);
      } else if (connectionData.type === ConnectorTypes.Arrow) {
        // Dashed arrow connecting from/to point
        gizmo = new Autodesk.Edit2D.ScreenOverlay.Arrow3DGizmo();
        gizmo.arrow.line.style.copy(lineStyle);
        gizmo.arrow.head.style.fillColor = lineStyle.lineColor;
        gizmo.arrow.setHeadLength(18); // in pixels, because layer is screen-aligned
        gizmo.arrow.setHeadAngle(40); // in degrees

        // Define attachable object for the label
        attachableObject = gizmo.arrow.line;

        // Define position setters
        setFrom = gizmo.setFrom.bind(gizmo);
        setTo = gizmo.setTo.bind(gizmo);
      } else {
        console.warn("Invalid connector type.");
        return "continue";
      }

      var label = void 0;

      if (connectionData.getEdgeLabelText) {
        label = new Autodesk.Edit2D.EdgeLabel(screenOverlay.layer);
        label.attachToEdge(attachableObject, 0, 0);

        // Custom label style
        if (connectionData.labelStyle) {
          Object.keys(connectionData.labelStyle).forEach(function (key) {
            label.container.style[key] = connectionData.labelStyle[key];
          });
        }
      }

      _this.connectors.push({
        fromIndex: connectionData.fromIndex,
        toIndex: connectionData.toIndex,
        getEdgeLabelText: connectionData.getEdgeLabelText,
        gizmo: gizmo,
        label: label,
        setFrom: setFrom,
        setTo: setTo });};for (var _i = 0; _i < connectionsData.length; _i++) {var _ret = _loop2(_i);if (_ret === "continue") continue;

    }

    this.visible = true;

    this.stops = this.options.stops || [];

    this.onModelTransformChanged = this.onModelTransformChanged.bind(this);

    this.modelsToPointsMap = {}; // { modelId: [indexes] }
  }_createClass(NPointPicker, [{ key: "dtor", value: function dtor()

    {
      this.viewer.removeEventListener(Autodesk.Viewing.MODEL_TRANSFORM_CHANGED_EVENT, this.onModelTransformChanged);
    } }, { key: "startSelectPoint", value: function startSelectPoint(

    index, enableDrag) {
      // Backup current point's position in case the drag won't be valid. In this case, we'll restore the current point.
      this.pointBackup = this.pointValid[index] ?
      this.points[index].clone() :
      null;

      // Start coord picker
      if (!this.viewer.toolController.isToolActivated(this.coordPicker.getName())) {
        this.viewer.toolController.activateTool(this.coordPicker.getName());
      }

      this.selectingIndex = index;

      if (this.options.draggable) {
        this.coordPicker.setDragging(enableDrag);
        this.setMarkersDraggable(false);
      }

      this.fireEvent({
        type: Events.POINT_SELECTION_STARTED,
        index: this.selectingIndex });

    } }, { key: "onDragEnded", value: function onDragEnded(_ref)

    {var event = _ref.event;
      if (!this.coordPicker.getDragging()) {
        return;
      }

      this.coordPicker.handleSingleClick(event, 0);
      this.coordPicker.setDragging(false);
    } }, { key: "startSelect", value: function startSelect()

    {
      this.isActive = true;
      this.continuePointSelectionIfNeeded();
    }

    // @param {Vector3} [from] - Use null/undefined for clearing the fromPoint.
  }, { key: "setPoint", value: function setPoint(index, point) {
      this.pointValid[index] = !!point;

      if (this.pointValid[index]) {
        this.points[index].copy(point);

        // update point marker
        this.markers[index].setPosition(point);
      }

      this.updateGizmos();
    } }, { key: "updateGizmoVisibility", value: function updateGizmoVisibility(

    gizmo, visible, skipFade) {
      if (visible || skipFade) {
        // Show/Hide immediately.
        this.screenOverlay.setGizmoVisible(gizmo, visible);
      } else {
        // By default, hiding is done as smooth fadeout.
        this.screenOverlay.fadeOutGizmo(gizmo);
      }
    }

    // Show dashed line or arrow if from/to are both valid
  }, { key: "updateGizmos", value: function updateGizmos(skipFade) {
      for (var i = 0; i < this.N; i++) {
        var visible = this.showMarkers[i] && this.visible && this.pointValid[i];
        this.markers[i].setVisible(visible);
      }

      for (var _i2 = 0; _i2 < this.connectors.length; _i2++) {
        var connector = this.connectors[_i2];
        // Decide whether to show the connection between both points
        var showGizmo =
        this.visible &&
        this.pointValid[connector.fromIndex] &&
        this.pointValid[connector.toIndex];

        this.updateGizmoVisibility(connector.gizmo, showGizmo, skipFade);

        if (showGizmo) {
          connector.setFrom(this.points[connector.fromIndex]);
          connector.setTo(this.points[connector.toIndex]);
        }

        if (connector.label) {
          connector.label.setOpacity(showGizmo ? 1 : 0, true);

          // Update distance value only if label is visible.
          if (showGizmo) {
            var text = connector.getEdgeLabelText(_i2);
            connector.label.setText(text);
          }
        }
      }

      // ensure refresh if only position has changed
      this.screenOverlay.update();
    } }, { key: "clearPoint", value: function clearPoint(

    index) {
      this.pointValid[index] = false;
      this.markers[index].setVisible(false);

      this.updateGizmos();
    } }, { key: "clear", value: function clear()

    {
      this.cancelPointSelection();

      for (var i = 0; i < this.N; i++) {
        this.pointValid[i] = false;
        this.markers[i].setVisible(false);
      }

      this.selectingIndex = -1;
      this.lastSelectedPoint = -1;

      this.updateGizmos();

      this.isActive = false;

      this.fireEvent({ type: Events.CLEAR });
    } }, { key: "onPointHovered", value: function onPointHovered(

    event) {
      if (this.selectingIndex === -1) {
        return;
      }

      this.setPoint(this.selectingIndex, event.point);
      this.fireEvent({
        type: Events.POINT_HOVERED,
        point: event.point,
        index: this.selectingIndex });

    } }, { key: "onPointClicked", value: function onPointClicked(_ref2)

    {var point = _ref2.point;var pickAnother = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      if (this.selectingIndex === -1) {
        return;
      }

      // In case not point was selected, try restoring point backup.
      point = point || this.pointBackup;

      // Clear point backup
      this.pointBackup = null;

      // TODO: Avoid this hack. For this, the OrbitDollyPanTool should stop locking the ToolController and
      //       properly handle the case to be disabled within an interaction - without global blocking the ToolController.
      this.viewer.toolController.setIsLocked(false);
      this.viewer.toolController.deactivateTool(this.coordPicker.getName());

      if (point) {
        // Set pivot to selected point, so that we can orbit around it
        this.viewer.impl.camera.pivot.copy(point);
        this.viewer.impl.camera.dirty = true;
      }

      this.setPoint(this.selectingIndex, point);

      this.setMarkersDraggable(true);

      var index = this.selectingIndex;

      this.selectingIndex = -1;

      if (point) {
        this.lastSelectedPoint = Math.max(index, this.lastSelectedPoint);
        this.fireEvent({ type: Events.POINT_SELECTED, point: point, index: index });
      }

      // Start picking another point if:
      // - pickAnother flag is set
      // - We just selected a point, and it's not a stop point index.
      if (pickAnother && !(point && this.stops.includes(this.lastSelectedPoint))) {
        this.continuePointSelectionIfNeeded();
      }
    } }, { key: "setMarkersDraggable", value: function setMarkersDraggable(

    enable) {
      if (!this.options.draggable) {
        return;
      }

      for (var i = 0; i < this.N; i++) {
        var draggable =
        enable && this.visible && this.pointValid[i] && this.showMarkers[i];
        this.markers[i].setDraggable(draggable);
      }
    } }, { key: "cancelPointSelection", value: function cancelPointSelection()

    {
      this.onPointClicked({}, false);
    } }, { key: "continuePointSelectionIfNeeded", value: function continuePointSelectionIfNeeded()

    {
      if (!this.isPickerActive()) {
        return;
      }

      // Make sure the tool is visible.
      this.setVisible(true);

      for (var i = 0; i < this.N; i++) {
        if (!this.pointValid[i]) {
          this.startSelectPoint(i, false);
          break;
        }
      }
    }

    // Note: By default, setVisible(false) triggers a smooth fadeout. Use skipFade=true if you want to ensure that everything is instantly hidden.
  }, { key: "setVisible", value: function setVisible(visible, skipFade) {
      if (visible !== this.visible) {
        this.visible = visible;
        this.updateGizmos(skipFade);
      }
    }

    // Shortcut for readability: Hide immediately without any fade-out.
  }, { key: "forceHide", value: function forceHide() {
      this.setVisible(false, true);
    } }, { key: "areAllPointsSet", value: function areAllPointsSet()

    {
      if (this.selectingIndex !== -1) {
        return false;
      }

      for (var i = 0; i < this.N; i++) {
        if (!this.pointValid[i]) {
          return false;
        }
      }

      return true;
    } }, { key: "isPickerActive", value: function isPickerActive()

    {
      return this.isActive;
    } }, { key: "attachPointsToModel", value: function attachPointsToModel(

    model, points) {
      this.setModelsToPointsMap(Object.assign({}, this.modelsToPointsMap, _defineProperty({}, model.id, points)));
    }

    // ModelsToPointsMap is used to define a connection between points and specific models.
    // It is currently being used in order to update the points according to model transform changes.
    // Could be also used in the future for limiting the snapper to snap only on the attached model.
  }, { key: "setModelsToPointsMap", value: function setModelsToPointsMap(map) {var _this2 = this;
      this.modelsToPointsMap = map;

      var ids = Object.keys(this.modelsToPointsMap);

      if (ids.length > 0) {
        ids.forEach(function (id) {var _model$getModelTransf;
          var model = _this2.viewer.impl.findModel(Number(id), true);

          // Used in order to calculate the initial transform diff later.
          var matrix = (_model$getModelTransf = model.getModelTransform()) === null || _model$getModelTransf === void 0 ? void 0 : _model$getModelTransf.clone();
          _this2.modelsToPointsMap[id].matrix = matrix || new Autodesk.Viewing.Private.LmvMatrix4(true);
        });

        if (!this.viewer.hasEventListener(Autodesk.Viewing.MODEL_TRANSFORM_CHANGED_EVENT, this.onModelTransformChanged)) {
          this.viewer.addEventListener(Autodesk.Viewing.MODEL_TRANSFORM_CHANGED_EVENT, this.onModelTransformChanged);
        }

      } else {
        // Remove event if there is no mapping.
        this.viewer.removeEventListener(Autodesk.Viewing.MODEL_TRANSFORM_CHANGED_EVENT, this.onModelTransformChanged);
      }
    }

    // Update points that are attached to a specific model, in case it moved.
  }, { key: "onModelTransformChanged", value: function onModelTransformChanged(_ref3) {var model = _ref3.model,matrix = _ref3.matrix;
      // No map;
      if (!this.modelsToPointsMap) {
        return;
      }

      var pointIndexes = this.modelsToPointsMap[model.id];

      // Model not in map - nothing to update.
      if (!pointIndexes) {
        return;
      }

      // Calculate diff matrix.
      var previousMatrix = this.modelsToPointsMap[model.id].matrix;
      var diffMatrix = previousMatrix.invert();
      diffMatrix.multiplyMatrices(matrix, diffMatrix);

      // Update for next time.
      this.modelsToPointsMap[model.id].matrix = matrix.clone();

      for (var i = 0; i < this.N; i++) {
        if (pointIndexes.includes(i) && this.pointValid[i]) {

          var point = this.points[i];
          point.applyMatrix4(diffMatrix);
          this.setPoint(i, point);
        }
      }
    } }]);return NPointPicker;}();


NPointPicker.Events = Events;
NPointPicker.Colors = Colors;
NPointPicker.ConnectorTypes = ConnectorTypes;

/***/ }),

/***/ "./extensions/Edit3D/PointMarker.js":
/*!******************************************!*\
  !*** ./extensions/Edit3D/PointMarker.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PointMarker)
/* harmony export */ });
/* harmony import */ var _Label3D_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Label3D.js */ "./extensions/Edit3D/Label3D.js");
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _get(target, property, receiver) {if (typeof Reflect !== "undefined" && Reflect.get) {_get = Reflect.get;} else {_get = function _get(target, property, receiver) {var base = _superPropBase(target, property);if (!base) return;var desc = Object.getOwnPropertyDescriptor(base, property);if (desc.get) {return desc.get.call(receiver);}return desc.value;};}return _get(target, property, receiver || target);}function _superPropBase(object, property) {while (!Object.prototype.hasOwnProperty.call(object, property)) {object = _getPrototypeOf(object);if (object === null) break;}return object;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}


var createIcon = function createIcon(icon) {
  return [
  '<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
  '<g stroke-width="2" stroke="currentColor" fill="none">',
  icon,
  '</g>',
  '</svg>'].
  join('');
};

var Icons = {
  Cross: '<path d="M0 25 L50 25 M25 0 L25 50"/>',
  Circle: '<circle r="5" cx="25" cy="27.5" fill="currentColor" stroke-width="0" />',
  Empty: '' };var


PointMarker = /*#__PURE__*/function (_Label3D) {_inherits(PointMarker, _Label3D);var _super = _createSuper(PointMarker);

  function PointMarker(viewer, pos3D, labelText) {var _this;var icon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Icons.Cross;_classCallCheck(this, PointMarker);
    _this = _super.call(this, viewer, pos3D, null);

    _this.container.innerHTML = createIcon(icon);

    // Create another label for the text
    if (labelText) {
      _this.label = new _Label3D_js__WEBPACK_IMPORTED_MODULE_0__["default"](viewer, pos3D, labelText);

      // Center text above the actual position
      _this.label.setVerticalOffset(-45);
    }

    // Set label visible by default. If text is empty, it is hidden anyway. 
    _this.labelVisible = true;return _this;
  }

  // @param {string} Color string in css style (e.g. 'rgb(255, 255, 255)');
  _createClass(PointMarker, [{ key: "setColor", value: function setColor(color) {
      this.container.style.color = color;
    } }, { key: "setPosition", value: function setPosition(

    pos) {
      _get(_getPrototypeOf(PointMarker.prototype), "setPosition", this).call(this, pos);
      this.label && this.label.setPosition(pos);
    } }, { key: "setVisible", value: function setVisible(

    visible) {
      _get(_getPrototypeOf(PointMarker.prototype), "setVisible", this).call(this, visible);
      this.label && this.label.setVisible(this.labelVisible && visible);
    } }, { key: "setLabelVisible", value: function setLabelVisible(

    visible) {
      this.label && this.label.setVisible(this.visible && visible);
    } }]);return PointMarker;}(_Label3D_js__WEBPACK_IMPORTED_MODULE_0__["default"]);


PointMarker.Events = _Label3D_js__WEBPACK_IMPORTED_MODULE_0__["default"].Events;
PointMarker.Icons = Icons;

/***/ }),

/***/ "./extensions/Edit3D/TwoPointPicker.js":
/*!*********************************************!*\
  !*** ./extensions/Edit3D/TwoPointPicker.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TwoPointPicker)
/* harmony export */ });
/* harmony import */ var _NPointPicker_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NPointPicker.js */ "./extensions/Edit3D/NPointPicker.js");
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}

// Controls the user interaction workflow for aligning a model based on two selected points

// Extend NPointPicker events.
var Events = Object.assign({}, _NPointPicker_js__WEBPACK_IMPORTED_MODULE_0__["default"].Events, {
  FROM_POINT_SELECTED: 'fromPointSelected',
  TO_POINT_SELECTED: 'toPointSelected',
  FROM_POINT_HOVERED: 'fromPointHovered',
  TO_POINT_HOVERED: 'toPointHovered' });


// Implements the interaction to select two points: A 'fromPoint' and a 'toPoint'.
var TwoPointPicker = /*#__PURE__*/function (_NPointPicker) {_inherits(TwoPointPicker, _NPointPicker);var _super = _createSuper(TwoPointPicker);

  function TwoPointPicker(viewer, coordPicker, screenOverlay, options) {var _this;_classCallCheck(this, TwoPointPicker);
    _this = _super.call(this, viewer, coordPicker, screenOverlay, 2, options);

    _this.addEventListener(_NPointPicker_js__WEBPACK_IMPORTED_MODULE_0__["default"].Events.POINT_SELECTED, function (_ref) {var point = _ref.point,index = _ref.index;
      if (index === 0) {
        _this.fireEvent({ type: Events.FROM_POINT_SELECTED, point: point });
      } else {
        _this.fireEvent({ type: Events.TO_POINT_SELECTED, point: point });
      }
    });

    _this.addEventListener(_NPointPicker_js__WEBPACK_IMPORTED_MODULE_0__["default"].Events.POINT_HOVERED, function (_ref2) {var point = _ref2.point,index = _ref2.index;
      if (index === 0) {
        _this.fireEvent({ type: Events.FROM_POINT_HOVERED, point: point });
      } else {
        _this.fireEvent({ type: Events.TO_POINT_HOVERED, point: point });
      }
    });return _this;
  }_createClass(TwoPointPicker, [{ key: "setOffset", value: function setOffset(

    offset) {
      this.offset.copy(offset);
    } }, { key: "startSelectFrom", value: function startSelectFrom()

    {
      this.startSelectPoint(0);
    } }, { key: "startSelectTo", value: function startSelectTo()

    {
      this.startSelectPoint(1);
    } }]);return TwoPointPicker;}(_NPointPicker_js__WEBPACK_IMPORTED_MODULE_0__["default"]);


TwoPointPicker.Events = Events;

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
/*!*************************************!*\
  !*** ./extensions/Edit3D/Edit3D.js ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit3DExtension)
/* harmony export */ });
/* harmony import */ var _Gizmo3D_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Gizmo3D.js */ "./extensions/Edit3D/Gizmo3D.js");
/* harmony import */ var _Label3D_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Label3D.js */ "./extensions/Edit3D/Label3D.js");
/* harmony import */ var _PointMarker_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PointMarker.js */ "./extensions/Edit3D/PointMarker.js");
/* harmony import */ var _CoordPicker_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CoordPicker.js */ "./extensions/Edit3D/CoordPicker.js");
/* harmony import */ var _TwoPointPicker_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./TwoPointPicker.js */ "./extensions/Edit3D/TwoPointPicker.js");
/* harmony import */ var _NPointPicker_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./NPointPicker.js */ "./extensions/Edit3D/NPointPicker.js");
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}
var av = Autodesk.Viewing;
var namespace = AutodeskNamespace('Autodesk.Edit3D');
var myExtensionName = 'Autodesk.Edit3D';








/** 
                                               * Edit3D extension is a collection of general-purpose helper classes to faciliate 
                                               * implementation of 3D EditTools.
                                               * Loading the extension does not add UI or changes behavior in the viewer. Its purpose is only
                                               * to provide a basis for other extensions and client applications.
                                               * 
                                               * The extension id is: `Autodesk.Edit3D`
                                               * 
                                               * @example
                                               *   viewer.loadExtension('Autodesk.Edit3D')
                                               *
                                               * @memberof Autodesk.Viewing.Extensions
                                               * @see {@link Autodesk.Viewing.Extension} for common inherited methods.
                                               * @alias Autodesk.Viewing.Extensions.Edit3DExtension
                                               * @class
                                               */var
Edit3DExtension = /*#__PURE__*/function (_av$Extension) {_inherits(Edit3DExtension, _av$Extension);var _super = _createSuper(Edit3DExtension);
  function Edit3DExtension(viewer, options) {_classCallCheck(this, Edit3DExtension);return _super.call(this,
    viewer, options);
  }return Edit3DExtension;}(av.Extension);


namespace.Gizmo3D = _Gizmo3D_js__WEBPACK_IMPORTED_MODULE_0__["default"];
namespace.Label3D = _Label3D_js__WEBPACK_IMPORTED_MODULE_1__["default"];
namespace.PointMarker = _PointMarker_js__WEBPACK_IMPORTED_MODULE_2__["default"];
namespace.CoordPicker = _CoordPicker_js__WEBPACK_IMPORTED_MODULE_3__["default"];
namespace.TwoPointPicker = _TwoPointPicker_js__WEBPACK_IMPORTED_MODULE_4__["default"];
namespace.NPointPicker = _NPointPicker_js__WEBPACK_IMPORTED_MODULE_5__["default"];

// Register the extension with the extension manager.
av.theExtensionManager.registerExtension(myExtensionName, Edit3DExtension);
})();

Autodesk.Extensions.Edit3D = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=Edit3D.js.map