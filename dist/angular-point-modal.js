(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular-point"), require("lodash"), require("toastr"));
	else if(typeof define === 'function' && define.amd)
		define(["angular-point", "lodash", "toastr"], factory);
	else if(typeof exports === 'object')
		exports["angular-point-modal"] = factory(require("angular-point"), require("lodash"), require("toastr"));
	else
		root["angular-point-modal"] = factory(root["angular-point"], root["lodash"], root["toastr"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_toastr__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_toastr___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_toastr__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* unused harmony export APModal */
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return APModalService; });


var $uibModal, $q;
var APModal = (function () {
    function APModal(listItem, $uibModalInstance) {
        var _this = this;
        this.fullControl = false;
        this.negotiatingWithServer = false;
        this.userCanApprove = false;
        this.userCanDelete = false;
        this.userCanEdit = false;
        //Manually declare to make it more obvious what's available to all child classes
        this.listItem = listItem;
        this.$uibModalInstance = $uibModalInstance;
        var resolvePermissions = function (permObj) {
            var userPermMask = permObj.resolvePermissions();
            _this.userCanEdit = userPermMask.EditListItems;
            _this.userCanDelete = userPermMask.DeleteListItems;
            _this.userCanApprove = userPermMask.ApproveItems;
            _this.fullControl = userPermMask.FullMask;
        };
        if (listItem && listItem.id && listItem.resolvePermissions) {
            resolvePermissions(listItem);
        }
        else if (listItem.getModel && listItem.getModel().resolvePermissions) {
            /** Fallback to retrieve permissions from the model when a list item isn't available */
            resolvePermissions(listItem.getModel());
        }
        /** Check if it's a new form */
        if (!listItem || !listItem.id) {
            this.displayMode = 'New';
        }
        else if (this.userCanEdit) {
            this.displayMode = 'Edit';
        }
        else {
            this.displayMode = 'View';
        }
    }
    APModal.prototype.cancel = function () {
        this.$uibModalInstance.dismiss('cancel');
    };
    /**
     * @ngdoc function
     * @name angularPoint.apModalService:deleteListItem
     * @methodOf angularPoint.apModalService
     * @description
     * Prompts for confirmation of deletion, then deletes and closes modal
     * @example
     *
     * <pre>
     * <button type="button" class="btn btn-danger" ng-click="$ctrl.deleteListItem()"
     *          ng-show="$ctrl.projectDocument.id && $ctrl.userCanDelete"
     *          title="Delete this document.">
     *      <i class="fa fa-trash-o"></i>
     *  </button>
     * </pre>
     */
    APModal.prototype.deleteListItem = function () {
        var _this = this;
        var confirmation = window.confirm('Are you sure you want to delete this record?');
        if (confirmation) {
            /** Disable form buttons */
            this.negotiatingWithServer = true;
            return this.listItem.deleteItem()
                .then(function () {
                __WEBPACK_IMPORTED_MODULE_0_toastr__["success"]('Record deleted successfully');
                return _this.$uibModalInstance.close();
            }).catch(function (err) {
                throw _this.generateError('deleting', err);
            });
        }
    };
    /**
     * @ngdoc function
     * @name angularPoint.apModalService:saveListItem
     * @methodOf angularPoint.apModalService
     * @description
     * Creates a new record if necessary, updates list item if it already exists, and closes
     * if no significant changes have been made.
     * @param {object} [options] Options to pass to ListItem.saveChanges().
     * @example
     * <pre>
     *  <button class="btn btn-primary" type="submit"
     *      ng-disabled="$ctrl.form.$invalid || !$ctrl.userCanEdit">Save</button>
     * </pre>
     */
    APModal.prototype.saveListItem = function (options) {
        var _this = this;
        var promise;
        if (this.listItem.id && this.listItem.isPristine()) {
            promise = $q.when(this.listItem);
            //No significant changes have been made so just close
            this.cancel();
        }
        else {
            promise = this.listItem.saveChanges(options);
            promise
                .then(function () {
                __WEBPACK_IMPORTED_MODULE_0_toastr__["success"]('Record updated');
                _this.$uibModalInstance.close();
            })
                .catch(function (err) {
                throw _this.generateError('updating', err);
            });
        }
        return promise;
    };
    APModal.prototype.generateError = function (action, err) {
        __WEBPACK_IMPORTED_MODULE_0_toastr__["error"]("There was a problem " + action + " this record.  We've logged the issue and are looking into it.  Any additional information you can provide would be appreciated.");
        return new Error("Summary: Error " + action + " list item from modal.\n                Error: " + err + "\n                ListItem: " + JSON.stringify(this.listItem, null, 2));
    };
    return APModal;
}());

var APModalService = (function () {
    function APModalService(_$uibModal_, _$q_) {
        $uibModal = _$uibModal_;
        $q = _$q_;
    }
    /**
     * @ngdoc function
     * @name angularPoint.apModalService:modalModelProvider
     * @methodOf angularPoint.apModalService
     * @description
     * Extends a model to allow us to easily attach a modal form that accepts and injects a
     * dynamic number of arguments.
     * @param {object} config Configuration object.
     * @param {string} config.templateUrl Reference to the modal view.
     * @param {string} config.controller Name of the modal controller.
     * @param {function} [config.resolver] Pass arguments received to this function which creates the necessary resolve object.
     * @param {boolean} [config.lock] Use sync service to register a lock event.
     * @returns {function(any=): angular.IPromise<any>} Function which returns openModal that in turn returns a promise.
     *
     * @example
     * <pre>
     *    model.openModal = apModalService.modalModelProvider({
         *        template: require('modules/comp_request/views/comp_request_modal_view.html',
         *        controller: 'compRequestModalCtrl',
         *        controllerAs: '$ctrl',
         *        resolver: function(project) {
         *            return {
         *                project: () => project
         *            }
         *        }
         *    });
     * </pre>
     */
    APModalService.prototype.modalModelProvider = function (config) {
        return function openModal(listItem) {
            var model = this;
            var lockInfo;
            listItem = listItem || model.createEmptyItem();
            var defaults = {
                controller: config.controller,
                resolve: {}
            };
            if (config.templateUrl) {
                defaults.templateUrl = config.templateUrl;
            }
            else if (config.template) {
                defaults.template = config.template;
            }
            /** Pass through any arguments to the resolver function to allow for dynamic resolve object
             * to be created with the only assumption being the list item being edited is the first param */
            if (__WEBPACK_IMPORTED_MODULE_1_lodash__["isFunction"](config.resolver)) {
                defaults.resolve = config.resolver.apply(config.resolver, arguments);
            }
            /** Optionally lock the list item for editing if the the sync service is included */
            if (config.lock) {
                lockInfo = listItem.lock();
                defaults.resolve.lockInfo = function () { return lockInfo; };
            }
            var modalConfig = __WEBPACK_IMPORTED_MODULE_1_lodash__["assign"]({}, defaults, config);
            var modalInstance = $uibModal.open(modalConfig);
            if (listItem.id) {
                modalInstance.result
                    .then(function () {
                    unlockOnClose(config.lock, lockInfo);
                })
                    .catch(function () {
                    /** Revert back any changes that were made to editable fields, leaving changes made
                     * to readonly fields like attachments */
                    listItem.setPristine(listItem);
                    unlockOnClose(config.lock, lockInfo);
                });
            }
            return modalInstance.result;
        };
    };
    return APModalService;
}());

APModalService.$inject = ['$uibModal', '$q'];
function unlockOnClose(lock, lockInfo) {
    if (lock) {
        //Users without sufficient permissions won't be able to lock so only unlock in the event
        lockInfo.then(function (resolvedInfo) { return __WEBPACK_IMPORTED_MODULE_1_lodash__["isFunction"](resolvedInfo.unlock) ? resolvedInfo.unlock() : undefined; });
    }
}


/***/ },
/* 1 */
/***/ function(module, exports) {

module.exports = require("angular-point");

/***/ },
/* 2 */
/***/ function(module, exports) {

module.exports = require("lodash");

/***/ },
/* 3 */
/***/ function(module, exports) {

module.exports = require("toastr");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_point_modal_service__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_point__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_point___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular_point__);


/**
 * @ngdoc service
 * @name apModalService
 * @description
 * Extends a modal form to include many standard functions
 *
 */
__WEBPACK_IMPORTED_MODULE_1_angular_point__["AngularPointModule"]
    .service('apModalService', __WEBPACK_IMPORTED_MODULE_0__angular_point_modal_service__["a" /* APModalService */]);


/***/ }
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBjNTNmZTQ3ZTM0MWU2OGE1MDUzMyIsIndlYnBhY2s6Ly8vLi9zcmMvYW5ndWxhci1wb2ludC1tb2RhbC1zZXJ2aWNlLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcImFuZ3VsYXItcG9pbnRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJsb2Rhc2hcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ0b2FzdHJcIiIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDOURpQztBQUNMO0FBSTVCLElBQUksU0FBd0IsRUFBRSxFQUFnQixDQUFDO0FBd0IvQztJQVVJLGlCQUFZLFFBQXVCLEVBQUUsaUJBQXdDO1FBQTdFLGlCQTZCQztRQXBDRCxnQkFBVyxHQUFHLEtBQUssQ0FBQztRQUVwQiwwQkFBcUIsR0FBRyxLQUFLLENBQUM7UUFDOUIsbUJBQWMsR0FBRyxLQUFLLENB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QUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFFZCxhQUFhLENBQUMsTUFBTTtxQkFDZixJQUFJLENBQUM7b0JBQ0YsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ3pDLENBQUMsQ0FBQztxQkFDRCxLQUFLLENBQUM7b0JBQ0g7NkRBQ3lDO29CQUN6QyxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUMvQixhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDekMsQ0FBQyxDQUFDLENBQUM7WUFDWCxDQUFDO1lBRUQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7UUFDaEMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUdMLHFCQUFDO0FBQUQsQ0FBQzs7QUF0RlUsc0JBQU8sR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQXdGekMsdUJBQXVCLElBQUksRUFBRSxRQUFRO0lBQ2pDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDUCx3RkFBd0Y7UUFDeEYsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFDLFlBQVksSUFBSyx5REFBWSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLEdBQUcsU0FBUyxFQUFyRSxDQUFxRSxDQUFDLENBQUM7SUFDM0csQ0FBQztBQUNMLENBQUM7Ozs7Ozs7QUNyUEQsMEM7Ozs7OztBQ0FBLG1DOzs7Ozs7QUNBQSxtQzs7Ozs7Ozs7OztBQ0E2RDtBQUNaO0FBRWpEOzs7Ozs7R0FNRztBQUNILGlFQUFrQjtLQUNiLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxvRkFBYyxDQUFDLENBQUMiLCJmaWxlIjoiYW5ndWxhci1wb2ludC1tb2RhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcImFuZ3VsYXItcG9pbnRcIiksIHJlcXVpcmUoXCJsb2Rhc2hcIiksIHJlcXVpcmUoXCJ0b2FzdHJcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wiYW5ndWxhci1wb2ludFwiLCBcImxvZGFzaFwiLCBcInRvYXN0clwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJhbmd1bGFyLXBvaW50LW1vZGFsXCJdID0gZmFjdG9yeShyZXF1aXJlKFwiYW5ndWxhci1wb2ludFwiKSwgcmVxdWlyZShcImxvZGFzaFwiKSwgcmVxdWlyZShcInRvYXN0clwiKSk7XG5cdGVsc2Vcblx0XHRyb290W1wiYW5ndWxhci1wb2ludC1tb2RhbFwiXSA9IGZhY3Rvcnkocm9vdFtcImFuZ3VsYXItcG9pbnRcIl0sIHJvb3RbXCJsb2Rhc2hcIl0sIHJvb3RbXCJ0b2FzdHJcIl0pO1xufSkodGhpcywgZnVuY3Rpb24oX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8xX18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMl9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzNfXykge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9yeSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb3J5IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHR9KTtcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDQpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGM1M2ZlNDdlMzQxZTY4YTUwNTMzIiwiaW1wb3J0ICogYXMgdG9hc3RyIGZyb20gJ3RvYXN0cic7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge0lNb2RhbFNlcnZpY2UsIElNb2RhbFNlcnZpY2VJbnN0YW5jZX0gZnJvbSAnYW5ndWxhci11aS1ib290c3RyYXAnO1xuaW1wb3J0IHtMaXN0SXRlbX0gZnJvbSAnYW5ndWxhci1wb2ludCc7XG5cbnZhciAkdWliTW9kYWw6IElNb2RhbFNlcnZpY2UsICRxOiBuZy5JUVNlcnZpY2U7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVBlcm1PYmplY3Qge1xuICAgIHJlc29sdmVQZXJtaXNzaW9ucygpOiB7XG4gICAgICAgIEVkaXRMaXN0SXRlbXM6IGJvb2xlYW47XG4gICAgICAgIERlbGV0ZUxpc3RJdGVtczogYm9vbGVhbjtcbiAgICAgICAgQXBwcm92ZUl0ZW1zOiBib29sZWFuO1xuICAgICAgICBGdWxsTWFzazogYm9vbGVhbjtcbiAgICB9O1xufVxuZXhwb3J0IGludGVyZmFjZSBNb2RhbENvbmZpZyB7XG4gICAgdGVtcGxhdGVVcmw/OiBzdHJpbmc7XG4gICAgdGVtcGxhdGU/OiBzdHJpbmc7XG4gICAgY29udHJvbGxlcjogc3RyaW5nO1xuICAgIHJlc29sdmVyPzogRnVuY3Rpb247XG4gICAgc2l6ZT86IHN0cmluZztcbiAgICBjb250cm9sbGVyQXM/OiBzdHJpbmc7XG4gICAgbG9jaz86IGJvb2xlYW47XG59XG5pbnRlcmZhY2UgTW9kYWxDb25maWdPcHRpb25zIGV4dGVuZHMgTW9kYWxDb25maWcge1xuICAgIHJlc29sdmU6IHtcbiAgICAgICAgW2tleTogc3RyaW5nXTogYW55XG4gICAgfTtcbn1cbmV4cG9ydCBjbGFzcyBBUE1vZGFsIHtcbiAgICAkdWliTW9kYWxJbnN0YW5jZTogSU1vZGFsU2VydmljZUluc3RhbmNlO1xuICAgIGRpc3BsYXlNb2RlOiBzdHJpbmc7XG4gICAgZnVsbENvbnRyb2wgPSBmYWxzZTtcbiAgICBsaXN0SXRlbTogTGlzdEl0ZW08YW55PlxuICAgIG5lZ290aWF0aW5nV2l0aFNlcnZlciA9IGZhbHNlO1xuICAgIHVzZXJDYW5BcHByb3ZlID0gZmFsc2U7XG4gICAgdXNlckNhbkRlbGV0ZSA9IGZhbHNlO1xuICAgIHVzZXJDYW5FZGl0ID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcihsaXN0SXRlbTogTGlzdEl0ZW08YW55PiwgJHVpYk1vZGFsSW5zdGFuY2U6IElNb2RhbFNlcnZpY2VJbnN0YW5jZSkge1xuXG4gICAgICAgIC8vTWFudWFsbHkgZGVjbGFyZSB0byBtYWtlIGl0IG1vcmUgb2J2aW91cyB3aGF0J3MgYXZhaWxhYmxlIHRvIGFsbCBjaGlsZCBjbGFzc2VzXG4gICAgICAgIHRoaXMubGlzdEl0ZW0gPSBsaXN0SXRlbTtcbiAgICAgICAgdGhpcy4kdWliTW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbEluc3RhbmNlO1xuXG4gICAgICAgIHZhciByZXNvbHZlUGVybWlzc2lvbnMgPSAocGVybU9iajogSVBlcm1PYmplY3QpID0+IHtcbiAgICAgICAgICAgIHZhciB1c2VyUGVybU1hc2sgPSBwZXJtT2JqLnJlc29sdmVQZXJtaXNzaW9ucygpO1xuICAgICAgICAgICAgdGhpcy51c2VyQ2FuRWRpdCA9IHVzZXJQZXJtTWFzay5FZGl0TGlzdEl0ZW1zO1xuICAgICAgICAgICAgdGhpcy51c2VyQ2FuRGVsZXRlID0gdXNlclBlcm1NYXNrLkRlbGV0ZUxpc3RJdGVtcztcbiAgICAgICAgICAgIHRoaXMudXNlckNhbkFwcHJvdmUgPSB1c2VyUGVybU1hc2suQXBwcm92ZUl0ZW1zO1xuICAgICAgICAgICAgdGhpcy5mdWxsQ29udHJvbCA9IHVzZXJQZXJtTWFzay5GdWxsTWFzaztcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAobGlzdEl0ZW0gJiYgbGlzdEl0ZW0uaWQgJiYgbGlzdEl0ZW0ucmVzb2x2ZVBlcm1pc3Npb25zKSB7XG4gICAgICAgICAgICByZXNvbHZlUGVybWlzc2lvbnMobGlzdEl0ZW0pO1xuICAgICAgICB9IGVsc2UgaWYgKGxpc3RJdGVtLmdldE1vZGVsICYmIGxpc3RJdGVtLmdldE1vZGVsKCkucmVzb2x2ZVBlcm1pc3Npb25zKSB7XG4gICAgICAgICAgICAvKiogRmFsbGJhY2sgdG8gcmV0cmlldmUgcGVybWlzc2lvbnMgZnJvbSB0aGUgbW9kZWwgd2hlbiBhIGxpc3QgaXRlbSBpc24ndCBhdmFpbGFibGUgKi9cbiAgICAgICAgICAgIHJlc29sdmVQZXJtaXNzaW9ucyhsaXN0SXRlbS5nZXRNb2RlbCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKiBDaGVjayBpZiBpdCdzIGEgbmV3IGZvcm0gKi9cbiAgICAgICAgaWYgKCFsaXN0SXRlbSB8fCAhbGlzdEl0ZW0uaWQpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheU1vZGUgPSAnTmV3JztcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnVzZXJDYW5FZGl0KSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlNb2RlID0gJ0VkaXQnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5TW9kZSA9ICdWaWV3JztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNhbmNlbCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy4kdWliTW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICAgKiBAbmFtZSBhbmd1bGFyUG9pbnQuYXBNb2RhbFNlcnZpY2U6ZGVsZXRlTGlzdEl0ZW1cbiAgICAgKiBAbWV0aG9kT2YgYW5ndWxhclBvaW50LmFwTW9kYWxTZXJ2aWNlXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUHJvbXB0cyBmb3IgY29uZmlybWF0aW9uIG9mIGRlbGV0aW9uLCB0aGVuIGRlbGV0ZXMgYW5kIGNsb3NlcyBtb2RhbFxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiA8cHJlPlxuICAgICAqIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kYW5nZXJcIiBuZy1jbGljaz1cIiRjdHJsLmRlbGV0ZUxpc3RJdGVtKClcIlxuICAgICAqICAgICAgICAgIG5nLXNob3c9XCIkY3RybC5wcm9qZWN0RG9jdW1lbnQuaWQgJiYgJGN0cmwudXNlckNhbkRlbGV0ZVwiXG4gICAgICogICAgICAgICAgdGl0bGU9XCJEZWxldGUgdGhpcyBkb2N1bWVudC5cIj5cbiAgICAgKiAgICAgIDxpIGNsYXNzPVwiZmEgZmEtdHJhc2gtb1wiPjwvaT5cbiAgICAgKiAgPC9idXR0b24+XG4gICAgICogPC9wcmU+XG4gICAgICovXG4gICAgZGVsZXRlTGlzdEl0ZW0oKTogbmcuSVByb21pc2U8YW55PiB7XG4gICAgICAgIHZhciBjb25maXJtYXRpb24gPSB3aW5kb3cuY29uZmlybSgnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSB0aGlzIHJlY29yZD8nKTtcbiAgICAgICAgaWYgKGNvbmZpcm1hdGlvbikge1xuICAgICAgICAgICAgLyoqIERpc2FibGUgZm9ybSBidXR0b25zICovXG4gICAgICAgICAgICB0aGlzLm5lZ290aWF0aW5nV2l0aFNlcnZlciA9IHRydWU7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxpc3RJdGVtLmRlbGV0ZUl0ZW0oKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLnN1Y2Nlc3MoJ1JlY29yZCBkZWxldGVkIHN1Y2Nlc3NmdWxseScpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy4kdWliTW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgdGhpcy5nZW5lcmF0ZUVycm9yKCdkZWxldGluZycsIGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICAgKiBAbmFtZSBhbmd1bGFyUG9pbnQuYXBNb2RhbFNlcnZpY2U6c2F2ZUxpc3RJdGVtXG4gICAgICogQG1ldGhvZE9mIGFuZ3VsYXJQb2ludC5hcE1vZGFsU2VydmljZVxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIENyZWF0ZXMgYSBuZXcgcmVjb3JkIGlmIG5lY2Vzc2FyeSwgdXBkYXRlcyBsaXN0IGl0ZW0gaWYgaXQgYWxyZWFkeSBleGlzdHMsIGFuZCBjbG9zZXNcbiAgICAgKiBpZiBubyBzaWduaWZpY2FudCBjaGFuZ2VzIGhhdmUgYmVlbiBtYWRlLlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gT3B0aW9ucyB0byBwYXNzIHRvIExpc3RJdGVtLnNhdmVDaGFuZ2VzKCkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiA8cHJlPlxuICAgICAqICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCIgdHlwZT1cInN1Ym1pdFwiXG4gICAgICogICAgICBuZy1kaXNhYmxlZD1cIiRjdHJsLmZvcm0uJGludmFsaWQgfHwgISRjdHJsLnVzZXJDYW5FZGl0XCI+U2F2ZTwvYnV0dG9uPlxuICAgICAqIDwvcHJlPlxuICAgICAqL1xuICAgIHNhdmVMaXN0SXRlbShvcHRpb25zPyk6IG5nLklQcm9taXNlPGFueT4ge1xuICAgICAgICBsZXQgcHJvbWlzZTtcblxuICAgICAgICBpZiAodGhpcy5saXN0SXRlbS5pZCAmJiB0aGlzLmxpc3RJdGVtLmlzUHJpc3RpbmUoKSkge1xuICAgICAgICAgICAgcHJvbWlzZSA9ICRxLndoZW4odGhpcy5saXN0SXRlbSk7XG4gICAgICAgICAgICAvL05vIHNpZ25pZmljYW50IGNoYW5nZXMgaGF2ZSBiZWVuIG1hZGUgc28ganVzdCBjbG9zZVxuICAgICAgICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb21pc2UgPSB0aGlzLmxpc3RJdGVtLnNhdmVDaGFuZ2VzKG9wdGlvbnMpO1xuXG4gICAgICAgICAgICBwcm9taXNlXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuc3VjY2VzcygnUmVjb3JkIHVwZGF0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kdWliTW9kYWxJbnN0YW5jZS5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgdGhpcy5nZW5lcmF0ZUVycm9yKCd1cGRhdGluZycsIGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdlbmVyYXRlRXJyb3IoYWN0aW9uOiBzdHJpbmcsIGVycik6IEVycm9yIHtcbiAgICAgICAgdG9hc3RyLmVycm9yKGBUaGVyZSB3YXMgYSBwcm9ibGVtICR7YWN0aW9ufSB0aGlzIHJlY29yZC4gIFdlJ3ZlIGxvZ2dlZCB0aGUgaXNzdWUgYW5kIGFyZSBsb29raW5nIGludG8gaXQuICBBbnkgYWRkaXRpb25hbCBpbmZvcm1hdGlvbiB5b3UgY2FuIHByb3ZpZGUgd291bGQgYmUgYXBwcmVjaWF0ZWQuYCk7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoYFN1bW1hcnk6IEVycm9yICR7YWN0aW9ufSBsaXN0IGl0ZW0gZnJvbSBtb2RhbC5cbiAgICAgICAgICAgICAgICBFcnJvcjogJHtlcnJ9XG4gICAgICAgICAgICAgICAgTGlzdEl0ZW06ICR7SlNPTi5zdHJpbmdpZnkodGhpcy5saXN0SXRlbSwgbnVsbCwgMikgfWApO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFQTW9kYWxTZXJ2aWNlIHtcbiAgICBzdGF0aWMgJGluamVjdCA9IFsnJHVpYk1vZGFsJywgJyRxJ107XG5cbiAgICBjb25zdHJ1Y3RvcihfJHVpYk1vZGFsXywgXyRxXykge1xuICAgICAgICAkdWliTW9kYWwgPSBfJHVpYk1vZGFsXztcbiAgICAgICAgJHEgPSBfJHFfO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgICAqIEBuYW1lIGFuZ3VsYXJQb2ludC5hcE1vZGFsU2VydmljZTptb2RhbE1vZGVsUHJvdmlkZXJcbiAgICAgKiBAbWV0aG9kT2YgYW5ndWxhclBvaW50LmFwTW9kYWxTZXJ2aWNlXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogRXh0ZW5kcyBhIG1vZGVsIHRvIGFsbG93IHVzIHRvIGVhc2lseSBhdHRhY2ggYSBtb2RhbCBmb3JtIHRoYXQgYWNjZXB0cyBhbmQgaW5qZWN0cyBhXG4gICAgICogZHluYW1pYyBudW1iZXIgb2YgYXJndW1lbnRzLlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgQ29uZmlndXJhdGlvbiBvYmplY3QuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy50ZW1wbGF0ZVVybCBSZWZlcmVuY2UgdG8gdGhlIG1vZGFsIHZpZXcuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNvbmZpZy5jb250cm9sbGVyIE5hbWUgb2YgdGhlIG1vZGFsIGNvbnRyb2xsZXIuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2NvbmZpZy5yZXNvbHZlcl0gUGFzcyBhcmd1bWVudHMgcmVjZWl2ZWQgdG8gdGhpcyBmdW5jdGlvbiB3aGljaCBjcmVhdGVzIHRoZSBuZWNlc3NhcnkgcmVzb2x2ZSBvYmplY3QuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbY29uZmlnLmxvY2tdIFVzZSBzeW5jIHNlcnZpY2UgdG8gcmVnaXN0ZXIgYSBsb2NrIGV2ZW50LlxuICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbihhbnk9KTogYW5ndWxhci5JUHJvbWlzZTxhbnk+fSBGdW5jdGlvbiB3aGljaCByZXR1cm5zIG9wZW5Nb2RhbCB0aGF0IGluIHR1cm4gcmV0dXJucyBhIHByb21pc2UuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIDxwcmU+XG4gICAgICogICAgbW9kZWwub3Blbk1vZGFsID0gYXBNb2RhbFNlcnZpY2UubW9kYWxNb2RlbFByb3ZpZGVyKHtcbiAgICAgICAgICogICAgICAgIHRlbXBsYXRlOiByZXF1aXJlKCdtb2R1bGVzL2NvbXBfcmVxdWVzdC92aWV3cy9jb21wX3JlcXVlc3RfbW9kYWxfdmlldy5odG1sJyxcbiAgICAgICAgICogICAgICAgIGNvbnRyb2xsZXI6ICdjb21wUmVxdWVzdE1vZGFsQ3RybCcsXG4gICAgICAgICAqICAgICAgICBjb250cm9sbGVyQXM6ICckY3RybCcsXG4gICAgICAgICAqICAgICAgICByZXNvbHZlcjogZnVuY3Rpb24ocHJvamVjdCkge1xuICAgICAgICAgKiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAqICAgICAgICAgICAgICAgIHByb2plY3Q6ICgpID0+IHByb2plY3RcbiAgICAgICAgICogICAgICAgICAgICB9XG4gICAgICAgICAqICAgICAgICB9XG4gICAgICAgICAqICAgIH0pO1xuICAgICAqIDwvcHJlPlxuICAgICAqL1xuICAgIG1vZGFsTW9kZWxQcm92aWRlcihjb25maWc6IE1vZGFsQ29uZmlnKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBvcGVuTW9kYWwobGlzdEl0ZW0/OiBMaXN0SXRlbTxhbnk+IHwgYW55KSB7XG4gICAgICAgICAgICBsZXQgbW9kZWwgPSB0aGlzO1xuICAgICAgICAgICAgbGV0IGxvY2tJbmZvO1xuICAgICAgICAgICAgbGlzdEl0ZW0gPSBsaXN0SXRlbSB8fCBtb2RlbC5jcmVhdGVFbXB0eUl0ZW0oKTtcblxuICAgICAgICAgICAgY29uc3QgZGVmYXVsdHM6IE1vZGFsQ29uZmlnT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBjb25maWcuY29udHJvbGxlcixcbiAgICAgICAgICAgICAgICByZXNvbHZlOiA8YW55Pnt9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAoY29uZmlnLnRlbXBsYXRlVXJsKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdHMudGVtcGxhdGVVcmwgPSBjb25maWcudGVtcGxhdGVVcmw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvbmZpZy50ZW1wbGF0ZSkge1xuICAgICAgICAgICAgICAgIGRlZmF1bHRzLnRlbXBsYXRlID0gY29uZmlnLnRlbXBsYXRlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiogUGFzcyB0aHJvdWdoIGFueSBhcmd1bWVudHMgdG8gdGhlIHJlc29sdmVyIGZ1bmN0aW9uIHRvIGFsbG93IGZvciBkeW5hbWljIHJlc29sdmUgb2JqZWN0XG4gICAgICAgICAgICAgKiB0byBiZSBjcmVhdGVkIHdpdGggdGhlIG9ubHkgYXNzdW1wdGlvbiBiZWluZyB0aGUgbGlzdCBpdGVtIGJlaW5nIGVkaXRlZCBpcyB0aGUgZmlyc3QgcGFyYW0gKi9cbiAgICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24oY29uZmlnLnJlc29sdmVyKSkge1xuICAgICAgICAgICAgICAgIGRlZmF1bHRzLnJlc29sdmUgPSBjb25maWcucmVzb2x2ZXIuYXBwbHkoY29uZmlnLnJlc29sdmVyLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiogT3B0aW9uYWxseSBsb2NrIHRoZSBsaXN0IGl0ZW0gZm9yIGVkaXRpbmcgaWYgdGhlIHRoZSBzeW5jIHNlcnZpY2UgaXMgaW5jbHVkZWQgKi9cbiAgICAgICAgICAgIGlmIChjb25maWcubG9jaykge1xuICAgICAgICAgICAgICAgIGxvY2tJbmZvID0gbGlzdEl0ZW0ubG9jaygpO1xuICAgICAgICAgICAgICAgIGRlZmF1bHRzLnJlc29sdmUubG9ja0luZm8gPSAoKSA9PiBsb2NrSW5mbztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbW9kYWxDb25maWcgPSBfLmFzc2lnbih7fSwgZGVmYXVsdHMsIGNvbmZpZyk7XG4gICAgICAgICAgICBjb25zdCBtb2RhbEluc3RhbmNlID0gJHVpYk1vZGFsLm9wZW4obW9kYWxDb25maWcpO1xuXG4gICAgICAgICAgICBpZiAobGlzdEl0ZW0uaWQpIHtcblxuICAgICAgICAgICAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0XG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVubG9ja09uQ2xvc2UoY29uZmlnLmxvY2ssIGxvY2tJbmZvKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKiBSZXZlcnQgYmFjayBhbnkgY2hhbmdlcyB0aGF0IHdlcmUgbWFkZSB0byBlZGl0YWJsZSBmaWVsZHMsIGxlYXZpbmcgY2hhbmdlcyBtYWRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiB0byByZWFkb25seSBmaWVsZHMgbGlrZSBhdHRhY2htZW50cyAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdEl0ZW0uc2V0UHJpc3RpbmUobGlzdEl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdW5sb2NrT25DbG9zZShjb25maWcubG9jaywgbG9ja0luZm8pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG1vZGFsSW5zdGFuY2UucmVzdWx0O1xuICAgICAgICB9O1xuICAgIH1cblxuXG59XG5cbmZ1bmN0aW9uIHVubG9ja09uQ2xvc2UobG9jaywgbG9ja0luZm8pIHtcbiAgICBpZiAobG9jaykge1xuICAgICAgICAvL1VzZXJzIHdpdGhvdXQgc3VmZmljaWVudCBwZXJtaXNzaW9ucyB3b24ndCBiZSBhYmxlIHRvIGxvY2sgc28gb25seSB1bmxvY2sgaW4gdGhlIGV2ZW50XG4gICAgICAgIGxvY2tJbmZvLnRoZW4oKHJlc29sdmVkSW5mbykgPT4gXy5pc0Z1bmN0aW9uKHJlc29sdmVkSW5mby51bmxvY2spID8gcmVzb2x2ZWRJbmZvLnVubG9jaygpIDogdW5kZWZpbmVkKTtcbiAgICB9XG59XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vdHNsaW50LWxvYWRlciEuL3NyYy9hbmd1bGFyLXBvaW50LW1vZGFsLXNlcnZpY2UudHMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhbmd1bGFyLXBvaW50XCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiYW5ndWxhci1wb2ludFwiXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImxvZGFzaFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImxvZGFzaFwiXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInRvYXN0clwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInRvYXN0clwiXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7QVBNb2RhbFNlcnZpY2V9IGZyb20gJy4vYW5ndWxhci1wb2ludC1tb2RhbC1zZXJ2aWNlJztcbmltcG9ydCB7QW5ndWxhclBvaW50TW9kdWxlfSBmcm9tICdhbmd1bGFyLXBvaW50JztcblxuLyoqXG4gKiBAbmdkb2Mgc2VydmljZVxuICogQG5hbWUgYXBNb2RhbFNlcnZpY2VcbiAqIEBkZXNjcmlwdGlvblxuICogRXh0ZW5kcyBhIG1vZGFsIGZvcm0gdG8gaW5jbHVkZSBtYW55IHN0YW5kYXJkIGZ1bmN0aW9uc1xuICpcbiAqL1xuQW5ndWxhclBvaW50TW9kdWxlXG4gICAgLnNlcnZpY2UoJ2FwTW9kYWxTZXJ2aWNlJywgQVBNb2RhbFNlcnZpY2UpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2luZGV4LnRzIl0sInNvdXJjZVJvb3QiOiIifQ==