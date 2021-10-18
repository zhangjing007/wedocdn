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

/***/ "./extensions/AEC/ui/ListPanel.js":
/*!****************************************!*\
  !*** ./extensions/AEC/ui/ListPanel.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ListPanelEvents": () => (/* binding */ ListPanelEvents),
/* harmony export */   "ListPanel": () => (/* binding */ ListPanel)
/* harmony export */ });

var av = Autodesk.Viewing;
var avu = Autodesk.Viewing.UI;


var ListPanelEvents = {

  /**
                                * Fired when clicking on an item. (not fired when setting current item per code)
                                *  @property {Object} item  - data item being selected.
                                */
  ITEM_SELECT: 'itemSelect',

  /*
                              * Fired when toggling item visibility
                              *  @property {Object} item    - data item
                              *  @property {bool}   visible - whether item was toggled on or off
                              */
  ITEM_VISIBILITY_CHANGED: 'itemVisibibilityChanged',

  /**
                                                       * @property {Object} item - data item being selected.
                                                       */
  ITEM_MOUSE_ENTER: 'itemMouseEnter',
  ITEM_MOUSE_LEAVE: 'itemMouseLeave' };


function ListPanel(parentContainer, id, title, options) {

  avu.DockingPanel.call(this, parentContainer, id, title, options);

  av.EventDispatcher.prototype.apply(this);

  this.container.classList.add('list-panel');
  this.container.dockRight = true;
  this.createScrollContainer({ left: false, heightAdjustment: 65, marginTop: 0 });
}

ListPanel.prototype = Object.create(avu.DockingPanel.prototype);

// @param {Object[]} items - Array order defines display order top-down.
ListPanel.prototype.setItems = function (items) {

  this.buttons = [];
  this.items = items;

  // remove old list
  if (this.listDiv) {
    this.scrollContainer.removeChild(this.listDiv);
  }
  var _document = this.getDocument();
  this.listDiv = _document.createElement('div');
  this.listDiv.classList.add('itemList');

  this.scrollContainer.appendChild(this.listDiv);

  var scope = this;

  var createButton = function createButton(item) {

    var itemText = scope._getItemText ? scope._getItemText(item) : '<no item text>';

    var button = _document.createElement('div');
    button.classList.add('listItem');
    button.item = item;
    button.setAttribute('title', itemText);

    button.addEventListener('click', function () {
      scope.fireEvent({
        type: ListPanelEvents.ITEM_SELECT,
        item: item });

    });
    button.addEventListener('mouseenter', function () {
      scope.fireEvent({
        type: ListPanelEvents.ITEM_MOUSE_ENTER,
        item: item });

      button.classList.add('hover');
    });
    button.addEventListener('mouseleave', function () {
      scope.fireEvent({
        type: ListPanelEvents.ITEM_MOUSE_LEAVE,
        item: item });

      button.classList.remove('hover');
    });

    var textSpan = _document.createElement('span');
    textSpan.innerHTML = itemText;
    textSpan.classList.add("text");

    // This container DIV is required to enable proper text fade-out for long texts.
    var textContainerDiv = _document.createElement('div');
    textContainerDiv.classList.add("textContainer");
    textContainerDiv.appendChild(textSpan);
    button.appendChild(textContainerDiv);

    // Optional: Enable warning symbol per item
    if (scope.options.enableWarningSymbol) {
      var warnSpan = _document.createElement('span');
      warnSpan.classList.add("list-panel-item-warning");
      button.appendChild(warnSpan);
      button.warnSpan = warnSpan;
    }

    // Optional: Show checkmark for selected items
    if (scope.options.enableCheckmark) {
      var checkSpan = _document.createElement('span');
      checkSpan.classList.add("icon");
      button.appendChild(checkSpan);
    }

    // Optional: Show eye-symbol
    if (scope.options.enableVisibilityToggle) {
      var eyeSymbol = _document.createElement('div');
      eyeSymbol.classList.add("visibility");
      button.appendChild(eyeSymbol);

      eyeSymbol.addEventListener('click', function () {
        var wasVisible = scope._isVisible ? scope._isVisible(button.item) : true;
        scope.fireEvent({
          type: ListPanelEvents.ITEM_VISIBILITY_CHANGED,
          item: button.item,
          visible: !wasVisible });

        scope.updateItemStates();
      });
    }

    return button;
  };

  for (var index = 0; index < items.length; index++) {

    var item = items[index];
    var button = createButton(item);

    this.listDiv.appendChild(button);
    this.buttons.push(button);
  }

  this.updateItemStates();
};

// Trigger mouse-over highlighting on item. 
//  @param {function} filter - gets an item
ListPanel.prototype.rollOverItem = function (filter) {
  for (var i = 0; i < this.buttons.length; i++) {
    var button = this.buttons[i];
    if (filter(button.item)) {
      button.classList.add('hover');
    } else {
      button.classList.remove('hover');
    }
  }
};

ListPanel.prototype.updateItemStates = function () {

  if (!this.buttons) {
    return;
  }
  for (var i = 0; i < this.buttons.length; i++) {

    // set/unset blue color for selected items and show optional checkmark
    var button = this.buttons[i];
    button.classList.remove("selected");
    if (this._isSelected && this._isSelected(button.item)) {
      button.classList.add("selected");
    }

    // set/unset warning symbol
    if (this.options.enableWarningSymbol) {
      var warnText = this._getWarningText && this._getWarningText(button.item);
      button.warnSpan.style.visibility = warnText ? 'visible' : 'hidden';
      button.warnSpan.setAttribute('title', warnText || '');
    }

    // set state of visibility toggle (eye symbol)
    if (this.options.enableVisibilityToggle) {
      button.classList.remove("dim");
      var isVisible = this._isVisible ? this._isVisible(button.item) : true;
      if (!isVisible) {
        button.classList.add('dim');
      }
    }
  }
};

// Set functions to define how to handle each item
//  @param {function(item)} isSelected       - takes a list item (see setItems) and returns true for 'selected state'
//  @param {function(item)} getItemText      - returns the text to be displayed
//  @param {function(item)} [getWarningText] - Optional: Display a warning symbol. Function defines tooltip text.
//  @param {function(item)} [isVisible]      - Optional: State of visibility toggle. If set, an additional eye-symbol is shown to toggle visibility per item. 
ListPanel.prototype.setItemHandlers = function (isSelected, getItemText, getWarningText, isVisible) {
  this._isSelected = isSelected;
  this._getItemText = getItemText;
  this._getWarningText = getWarningText;
  this._isVisible = isVisible;
  this.updateItemStates();
};

avu.ListPanelEvents = ListPanelEvents;
avu.ListPanel = ListPanel;

/***/ }),

/***/ "./extensions/ModelsPanel/ModelsPanel.js":
/*!***********************************************!*\
  !*** ./extensions/ModelsPanel/ModelsPanel.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ModelsPanel)
/* harmony export */ });
/* harmony import */ var _AEC_ui_ListPanel_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../AEC/ui/ListPanel.js */ "./extensions/AEC/ui/ListPanel.js");
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _get(target, property, receiver) {if (typeof Reflect !== "undefined" && Reflect.get) {_get = Reflect.get;} else {_get = function _get(target, property, receiver) {var base = _superPropBase(target, property);if (!base) return;var desc = Object.getOwnPropertyDescriptor(base, property);if (desc.get) {return desc.get.call(receiver);}return desc.value;};}return _get(target, property, receiver || target);}function _superPropBase(object, property) {while (!Object.prototype.hasOwnProperty.call(object, property)) {object = _getPrototypeOf(object);if (object === null) break;}return object;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}
// Todo: If there are more uses of ListPanel, we should conisder moving it to LMV src/ui
//       to avoid such cross-referencing.
var

ModelsPanel = /*#__PURE__*/function (_ListPanel) {_inherits(ModelsPanel, _ListPanel);var _super = _createSuper(ModelsPanel);

  function ModelsPanel(viewer, id, title, options) {var _this;_classCallCheck(this, ModelsPanel);
    _this = _super.call(this, viewer.container, id, title, options);

    // Activate visibility toggles in ListPanel
    options.enableVisibilityToggle = true;

    _this.viewer = viewer;

    // Register item handlers for ListPanel
    var getText = function getText(item) {return item.name;};
    var isVisible = function isVisible(item) {return _this.viewer.getVisibleModels().indexOf(item.model) != -1;};
    var isSelected = function isSelected(item) {return item.model === _this.selectedModel;};

    _this.setItemHandlers(isSelected, getText, null, isVisible);

    _this.updateModels();

    // Bind event handlers
    _this.onVisibilityToggled = _this.onVisibilityToggled.bind(_assertThisInitialized(_this));
    _this.onItemEnter = _this.onItemEnter.bind(_assertThisInitialized(_this));
    _this.onItemLeave = _this.onItemLeave.bind(_assertThisInitialized(_this));
    _this.onHoverChanged = _this.onHoverChanged.bind(_assertThisInitialized(_this));
    _this.onItemSelected = _this.onItemSelected.bind(_assertThisInitialized(_this));
    _this.onSelectionChanged = _this.onSelectionChanged.bind(_assertThisInitialized(_this));

    // register item event listeners
    _this.addEventListener(Autodesk.Viewing.UI.ListPanelEvents.ITEM_VISIBILITY_CHANGED, _this.onVisibilityToggled);

    // register viewer event listeners
    _this.onModelsChanged = function () {return _this.updateModels();};
    _this.viewer.addEventListener(Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT, _this.onModelsChanged);
    _this.viewer.addEventListener(Autodesk.Viewing.MODEL_UNLOADED_EVENT, _this.onModelsChanged);

    // temporarily used to avoid recursive event handlers
    _this.blockEvents = false;

    // In model-selection mode, we override object selection with full-model selection
    _this.modelSelectionActive = false;

    // Color applied to selected models in selection mode
    _this.selectionColor = new THREE.Vector4(1, 1, 0, 0.25);return _this;
  }_createClass(ModelsPanel, [{ key: "dtor", value: function dtor()

    {
      _get(_getPrototypeOf(ModelsPanel.prototype), "uninitialize", this).call(this);

      // Make sure that model-selection listeners are unregistered too
      this.setModelSelectionModeEnabled(false);

      this.viewer.removeEventListener(Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT, this.onModelsChanged);
      this.viewer.removeEventListener(Autodesk.Viewing.MODEL_UNLOADED_EVENT, this.onModelsChanged);
    } }, { key: "registerSelectionListeners", value: function registerSelectionListeners()

    {
      // Panel item listeners
      this.addEventListener(Autodesk.Viewing.UI.ListPanelEvents.ITEM_MOUSE_ENTER, this.onItemEnter);
      this.addEventListener(Autodesk.Viewing.UI.ListPanelEvents.ITEM_MOUSE_LEAVE, this.onItemLeave);
      this.addEventListener(Autodesk.Viewing.UI.ListPanelEvents.ITEM_SELECT, this.onItemSelected);

      // Viewer listeners
      this.viewer.addEventListener(Autodesk.Viewing.OBJECT_UNDER_MOUSE_CHANGED, this.onHoverChanged);
      this.viewer.addEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, this.onSelectionChanged);
    } }, { key: "unregisterSelectionListeners", value: function unregisterSelectionListeners()

    {
      // Panel item listeners
      this.removeEventListener(Autodesk.Viewing.UI.ListPanelEvents.ITEM_MOUSE_ENTER, this.onItemEnter);
      this.removeEventListener(Autodesk.Viewing.UI.ListPanelEvents.ITEM_MOUSE_LEAVE, this.onItemLeave);
      this.removeEventListener(Autodesk.Viewing.UI.ListPanelEvents.ITEM_SELECT, this.onItemSelected);

      // Viewer listeners
      this.viewer.removeEventListener(Autodesk.Viewing.OBJECT_UNDER_MOUSE_CHANGED, this.onHoverChanged);
      this.viewer.removeEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, this.onSelectionChanged);
    } }, { key: "setModelSelectionModeEnabled", value: function setModelSelectionModeEnabled(

    enabled) {

      if (enabled === this.modelSelectionActive) {
        return;
      }

      // clear model selection on disable
      if (!enabled) {
        this.selectedModel = null;
      }

      // Register/deregister event listeners for model selection
      if (enabled) {
        this.registerSelectionListeners();
      } else {
        this.unregisterSelectionListeners();
      }

      this.modelSelectionActive = enabled;

      this.updateItemStates();
      this.updateColorTheming();
    } }, { key: "setSelectedModel", value: function setSelectedModel(

    model) {
      if (this.blockEvents) {
        return;
      }

      this.selectedModel = model;
      this.updateItemStates();
      this.updateColorTheming();

      // Clear object selection so that we don't mix both types.
      // Since we listen to selection changes, we must take care here that 
      // the selection-change does not unselect the model as well. 
      this.blockEvents = true;
      this.viewer.clearSelection();
      this.blockEvents = false;
    } }, { key: "uninitialize", value: function uninitialize()

    {
      _get(_getPrototypeOf(ModelsPanel.prototype), "uninitialize", this).call(this);
    } }, { key: "updateModels", value: function updateModels()

    {
      // add all visible models as items
      var models = this.viewer.getAllModels();
      var items = models.map(function (m) {
        return {
          name: m.getDocumentNode().getModelName(),
          model: m };

      });

      // sort items by name to avoid them to be timing-dependend.
      var byName = function byName(item1, item2) {
        var key1 = item1.name.toUpperCase();
        var key2 = item2.name.toUpperCase();
        return key1.localeCompare(key2);
      };
      items.sort(byName);

      this.setItems(items);
    } }, { key: "onVisibilityToggled", value: function onVisibilityToggled(

    event) {
      var model = event.item.model;
      if (event.visible) {
        this.viewer.showModel(model);
      } else {
        this.viewer.hideModel(model);
      }
    }

    // Trigger model mouse-over highlight
  }, { key: "onItemEnter", value: function onItemEnter(event) {
      var model = event.item.model;
      this.viewer.impl.renderer().rollOverModelId(model.id);
      this.viewer.impl.invalidate(false, false, true);
    } }, { key: "onItemLeave", value: function onItemLeave(

    event) {
      this.viewer.impl.clearHighlight();
    } }, { key: "onItemSelected", value: function onItemSelected(

    event) {

      // Click again to unselect
      if (event.item.model === this.selectedModel) {
        this.setSelectedModel(null);
      } else {
        this.setSelectedModel(event.item.model);
      }
    } }, { key: "updateColorTheming", value: function updateColorTheming()

    {
      // colorize selected model
      if (this.selectedModel) {
        var rootId = this.selectedModel.getRootId();
        this.viewer.setThemingColor(rootId, this.selectionColor, this.selectedModel, true);
      }

      // Make sure no other theming is leaked.
      for (var i = 0; i < this.items.length; i++) {
        var model = this.items[i].model;
        if (model !== this.selectedModel) {
          this.viewer.clearThemingColors(model);
        }
      }
    }

    // When hovering over model in the canvas, we apply hover-highlight to corresponding model
  }, { key: "onHoverChanged", value: function onHoverChanged(event) {
      var model = this.viewer.impl.findModel(event.modelId);
      this.rollOverItem(function (item) {return item.model === model;});

      // Extend hover-highlight to full model
      // Note that we call it on the renderer directly to avoid triggering an event again.
      //
      // TODO: This is a bit hacky and has drawbacks: E.g. hovering over the same model does
      //       restart the fade-in on each mouse move. A better solution would be to temporarily
      //       disable the automatic per-object highlighting here, instead of fighting against it.
      if (model) {
        this.viewer.impl.renderer().rollOverModelId(model.id);
      }
    }

    // Handle viewer selection-changes: Always select whole models and keep panel in-sync
  }, { key: "onSelectionChanged", value: function onSelectionChanged() {
      var selection = this.viewer.getAggregateSelection();
      if (selection.length != 1) {
        this.setSelectedModel(null);
        return;
      }

      var model = selection[0].model;
      this.setSelectedModel(model);
    } }]);return ModelsPanel;}(_AEC_ui_ListPanel_js__WEBPACK_IMPORTED_MODULE_0__.ListPanel);

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
  !*** ./extensions/ModelsPanel/index.js ***!
  \*****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ModelsPanelExtension)
/* harmony export */ });
/* harmony import */ var _ModelsPanel_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ModelsPanel.js */ "./extensions/ModelsPanel/ModelsPanel.js");
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);} /** 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * ModelsPanel extension provides a simple panel for toggling model visibility in aggregated views.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * @example
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         *   viewer.loadExtension('Autodesk.ModelsPanel')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * @memberof Autodesk.Viewing.Extensions
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * @see {@link Autodesk.Viewing.Extension} for common inherited methods.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * @alias Autodesk.Viewing.Extensions.ModelsPanel
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * @class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         */



var myExtensionName = 'Autodesk.ModelsPanel';
var av = Autodesk.Viewing;var

ModelsPanelExtension = /*#__PURE__*/function (_av$Extension) {_inherits(ModelsPanelExtension, _av$Extension);var _super = _createSuper(ModelsPanelExtension);
  function ModelsPanelExtension(viewer, options) {_classCallCheck(this, ModelsPanelExtension);return _super.call(this,
    viewer, options);
  }_createClass(ModelsPanelExtension, [{ key: "load", value: function () {var _load = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:


                this.panel = new _ModelsPanel_js__WEBPACK_IMPORTED_MODULE_0__["default"](this.viewer, 'ModelsPanel', 'Models', this.options);
                this.panel.setVisible(true);case 2:case "end":return _context.stop();}}}, _callee, this);}));function load() {return _load.apply(this, arguments);}return load;}() }, { key: "unload", value: function unload()


    {
      if (this.panel) {
        this.panel.uninitialize();
        this.panel = null;
      }
    } }]);return ModelsPanelExtension;}(av.Extension);


// Register the extension with the extension manager.
Autodesk.Viewing.theExtensionManager.registerExtension(myExtensionName, ModelsPanelExtension);
})();

Autodesk.Extensions.ModelsPanel = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=ModelsPanel.js.map