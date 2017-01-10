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
/* harmony export (binding) */ __webpack_require__.d(exports, "a", function() { return APModal; });
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return APModalService; });


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
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "APModal", function() { return __WEBPACK_IMPORTED_MODULE_0__angular_point_modal_service__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(exports, "APModalService", function() { return __WEBPACK_IMPORTED_MODULE_0__angular_point_modal_service__["b"]; });



/**
 * @ngdoc service
 * @name apModalService
 * @description
 * Extends a modal form to include many standard functions
 *
 */
__WEBPACK_IMPORTED_MODULE_1_angular_point__["AngularPointModule"]
    .service('apModalService', __WEBPACK_IMPORTED_MODULE_0__angular_point_modal_service__["b" /* APModalService */]);


/***/ }
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBmMTBhMDhiYjhlNWI0MzdlNTFhNCIsIndlYnBhY2s6Ly8vLi9zcmMvYW5ndWxhci1wb2ludC1tb2RhbC1zZXJ2aWNlLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcImFuZ3VsYXItcG9pbnRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJsb2Rhc2hcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ0b2FzdHJcIiIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDOURpQztBQUNMO0FBSTVCLElBQUksU0FBd0IsRUFBRSxFQUFnQixDQUFDO0FBd0IvQztJQVVJLGlCQUFZLFFBQXVCLEVBQUUsaUJBQXdDO1FBQTdFLGlCQTZCQztRQXBDRCxnQkFBVyxHQUFHLEtBQUssQ0FBQztRQUVwQiwwQkFBcUIsR0FBRyxLQUFLLENBQUM7UUFDOUIsbUJBQWMsR0FBRyxLQUFLLENB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QUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFFZCxhQUFhLENBQUMsTUFBTTtxQkFDZixJQUFJLENBQUM7b0JBQ0YsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ3pDLENBQUMsQ0FBQztxQkFDRCxLQUFLLENBQUM7b0JBQ0g7NkRBQ3lDO29CQUN6QyxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUMvQixhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDekMsQ0FBQyxDQUFDLENBQUM7WUFDWCxDQUFDO1lBRUQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7UUFDaEMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUdMLHFCQUFDO0FBQUQsQ0FBQzs7QUF0RlUsc0JBQU8sR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztBQXdGekMsdUJBQXVCLElBQUksRUFBRSxRQUFRO0lBQ2pDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDUCx3RkFBd0Y7UUFDeEYsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFDLFlBQVksSUFBSyx5REFBWSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxFQUFFLEdBQUcsU0FBUyxFQUFyRSxDQUFxRSxDQUFDLENBQUM7SUFDM0csQ0FBQztBQUNMLENBQUM7Ozs7Ozs7QUNyUEQsMEM7Ozs7OztBQ0FBLG1DOzs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7O0FDQXNFO0FBQ3JCO0FBRUg7QUFFOUM7Ozs7OztHQU1HO0FBQ0gsaUVBQWtCO0tBQ2IsT0FBTyxDQUFDLGdCQUFnQixFQUFFLG9GQUFjLENBQUMsQ0FBQyIsImZpbGUiOiJhbmd1bGFyLXBvaW50LW1vZGFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwiYW5ndWxhci1wb2ludFwiKSwgcmVxdWlyZShcImxvZGFzaFwiKSwgcmVxdWlyZShcInRvYXN0clwiKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJhbmd1bGFyLXBvaW50XCIsIFwibG9kYXNoXCIsIFwidG9hc3RyXCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImFuZ3VsYXItcG9pbnQtbW9kYWxcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJhbmd1bGFyLXBvaW50XCIpLCByZXF1aXJlKFwibG9kYXNoXCIpLCByZXF1aXJlKFwidG9hc3RyXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJhbmd1bGFyLXBvaW50LW1vZGFsXCJdID0gZmFjdG9yeShyb290W1wiYW5ndWxhci1wb2ludFwiXSwgcm9vdFtcImxvZGFzaFwiXSwgcm9vdFtcInRvYXN0clwiXSk7XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzFfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8yX18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfM19fKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb3J5IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vcnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdH0pO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZjEwYTA4YmI4ZTViNDM3ZTUxYTQiLCJpbXBvcnQgKiBhcyB0b2FzdHIgZnJvbSAndG9hc3RyJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7SU1vZGFsU2VydmljZSwgSU1vZGFsU2VydmljZUluc3RhbmNlfSBmcm9tICdhbmd1bGFyLXVpLWJvb3RzdHJhcCc7XG5pbXBvcnQge0xpc3RJdGVtfSBmcm9tICdhbmd1bGFyLXBvaW50JztcblxudmFyICR1aWJNb2RhbDogSU1vZGFsU2VydmljZSwgJHE6IG5nLklRU2VydmljZTtcblxuZXhwb3J0IGludGVyZmFjZSBJUGVybU9iamVjdCB7XG4gICAgcmVzb2x2ZVBlcm1pc3Npb25zKCk6IHtcbiAgICAgICAgRWRpdExpc3RJdGVtczogYm9vbGVhbjtcbiAgICAgICAgRGVsZXRlTGlzdEl0ZW1zOiBib29sZWFuO1xuICAgICAgICBBcHByb3ZlSXRlbXM6IGJvb2xlYW47XG4gICAgICAgIEZ1bGxNYXNrOiBib29sZWFuO1xuICAgIH07XG59XG5leHBvcnQgaW50ZXJmYWNlIE1vZGFsQ29uZmlnIHtcbiAgICB0ZW1wbGF0ZVVybD86IHN0cmluZztcbiAgICB0ZW1wbGF0ZT86IHN0cmluZztcbiAgICBjb250cm9sbGVyOiBzdHJpbmc7XG4gICAgcmVzb2x2ZXI/OiBGdW5jdGlvbjtcbiAgICBzaXplPzogc3RyaW5nO1xuICAgIGNvbnRyb2xsZXJBcz86IHN0cmluZztcbiAgICBsb2NrPzogYm9vbGVhbjtcbn1cbmludGVyZmFjZSBNb2RhbENvbmZpZ09wdGlvbnMgZXh0ZW5kcyBNb2RhbENvbmZpZyB7XG4gICAgcmVzb2x2ZToge1xuICAgICAgICBba2V5OiBzdHJpbmddOiBhbnlcbiAgICB9O1xufVxuZXhwb3J0IGNsYXNzIEFQTW9kYWwge1xuICAgICR1aWJNb2RhbEluc3RhbmNlOiBJTW9kYWxTZXJ2aWNlSW5zdGFuY2U7XG4gICAgZGlzcGxheU1vZGU6IHN0cmluZztcbiAgICBmdWxsQ29udHJvbCA9IGZhbHNlO1xuICAgIGxpc3RJdGVtOiBMaXN0SXRlbTxhbnk+XG4gICAgbmVnb3RpYXRpbmdXaXRoU2VydmVyID0gZmFsc2U7XG4gICAgdXNlckNhbkFwcHJvdmUgPSBmYWxzZTtcbiAgICB1c2VyQ2FuRGVsZXRlID0gZmFsc2U7XG4gICAgdXNlckNhbkVkaXQgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKGxpc3RJdGVtOiBMaXN0SXRlbTxhbnk+LCAkdWliTW9kYWxJbnN0YW5jZTogSU1vZGFsU2VydmljZUluc3RhbmNlKSB7XG5cbiAgICAgICAgLy9NYW51YWxseSBkZWNsYXJlIHRvIG1ha2UgaXQgbW9yZSBvYnZpb3VzIHdoYXQncyBhdmFpbGFibGUgdG8gYWxsIGNoaWxkIGNsYXNzZXNcbiAgICAgICAgdGhpcy5saXN0SXRlbSA9IGxpc3RJdGVtO1xuICAgICAgICB0aGlzLiR1aWJNb2RhbEluc3RhbmNlID0gJHVpYk1vZGFsSW5zdGFuY2U7XG5cbiAgICAgICAgdmFyIHJlc29sdmVQZXJtaXNzaW9ucyA9IChwZXJtT2JqOiBJUGVybU9iamVjdCkgPT4ge1xuICAgICAgICAgICAgdmFyIHVzZXJQZXJtTWFzayA9IHBlcm1PYmoucmVzb2x2ZVBlcm1pc3Npb25zKCk7XG4gICAgICAgICAgICB0aGlzLnVzZXJDYW5FZGl0ID0gdXNlclBlcm1NYXNrLkVkaXRMaXN0SXRlbXM7XG4gICAgICAgICAgICB0aGlzLnVzZXJDYW5EZWxldGUgPSB1c2VyUGVybU1hc2suRGVsZXRlTGlzdEl0ZW1zO1xuICAgICAgICAgICAgdGhpcy51c2VyQ2FuQXBwcm92ZSA9IHVzZXJQZXJtTWFzay5BcHByb3ZlSXRlbXM7XG4gICAgICAgICAgICB0aGlzLmZ1bGxDb250cm9sID0gdXNlclBlcm1NYXNrLkZ1bGxNYXNrO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChsaXN0SXRlbSAmJiBsaXN0SXRlbS5pZCAmJiBsaXN0SXRlbS5yZXNvbHZlUGVybWlzc2lvbnMpIHtcbiAgICAgICAgICAgIHJlc29sdmVQZXJtaXNzaW9ucyhsaXN0SXRlbSk7XG4gICAgICAgIH0gZWxzZSBpZiAobGlzdEl0ZW0uZ2V0TW9kZWwgJiYgbGlzdEl0ZW0uZ2V0TW9kZWwoKS5yZXNvbHZlUGVybWlzc2lvbnMpIHtcbiAgICAgICAgICAgIC8qKiBGYWxsYmFjayB0byByZXRyaWV2ZSBwZXJtaXNzaW9ucyBmcm9tIHRoZSBtb2RlbCB3aGVuIGEgbGlzdCBpdGVtIGlzbid0IGF2YWlsYWJsZSAqL1xuICAgICAgICAgICAgcmVzb2x2ZVBlcm1pc3Npb25zKGxpc3RJdGVtLmdldE1vZGVsKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqIENoZWNrIGlmIGl0J3MgYSBuZXcgZm9ybSAqL1xuICAgICAgICBpZiAoIWxpc3RJdGVtIHx8ICFsaXN0SXRlbS5pZCkge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5TW9kZSA9ICdOZXcnO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMudXNlckNhbkVkaXQpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheU1vZGUgPSAnRWRpdCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlNb2RlID0gJ1ZpZXcnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FuY2VsKCk6IHZvaWQge1xuICAgICAgICB0aGlzLiR1aWJNb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgICAqIEBuYW1lIGFuZ3VsYXJQb2ludC5hcE1vZGFsU2VydmljZTpkZWxldGVMaXN0SXRlbVxuICAgICAqIEBtZXRob2RPZiBhbmd1bGFyUG9pbnQuYXBNb2RhbFNlcnZpY2VcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBQcm9tcHRzIGZvciBjb25maXJtYXRpb24gb2YgZGVsZXRpb24sIHRoZW4gZGVsZXRlcyBhbmQgY2xvc2VzIG1vZGFsXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqIDxwcmU+XG4gICAgICogPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRhbmdlclwiIG5nLWNsaWNrPVwiJGN0cmwuZGVsZXRlTGlzdEl0ZW0oKVwiXG4gICAgICogICAgICAgICAgbmctc2hvdz1cIiRjdHJsLnByb2plY3REb2N1bWVudC5pZCAmJiAkY3RybC51c2VyQ2FuRGVsZXRlXCJcbiAgICAgKiAgICAgICAgICB0aXRsZT1cIkRlbGV0ZSB0aGlzIGRvY3VtZW50LlwiPlxuICAgICAqICAgICAgPGkgY2xhc3M9XCJmYSBmYS10cmFzaC1vXCI+PC9pPlxuICAgICAqICA8L2J1dHRvbj5cbiAgICAgKiA8L3ByZT5cbiAgICAgKi9cbiAgICBkZWxldGVMaXN0SXRlbSgpOiBuZy5JUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgdmFyIGNvbmZpcm1hdGlvbiA9IHdpbmRvdy5jb25maXJtKCdBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoaXMgcmVjb3JkPycpO1xuICAgICAgICBpZiAoY29uZmlybWF0aW9uKSB7XG4gICAgICAgICAgICAvKiogRGlzYWJsZSBmb3JtIGJ1dHRvbnMgKi9cbiAgICAgICAgICAgIHRoaXMubmVnb3RpYXRpbmdXaXRoU2VydmVyID0gdHJ1ZTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlzdEl0ZW0uZGVsZXRlSXRlbSgpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuc3VjY2VzcygnUmVjb3JkIGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5Jyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLiR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyB0aGlzLmdlbmVyYXRlRXJyb3IoJ2RlbGV0aW5nJywgZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgICAqIEBuYW1lIGFuZ3VsYXJQb2ludC5hcE1vZGFsU2VydmljZTpzYXZlTGlzdEl0ZW1cbiAgICAgKiBAbWV0aG9kT2YgYW5ndWxhclBvaW50LmFwTW9kYWxTZXJ2aWNlXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQ3JlYXRlcyBhIG5ldyByZWNvcmQgaWYgbmVjZXNzYXJ5LCB1cGRhdGVzIGxpc3QgaXRlbSBpZiBpdCBhbHJlYWR5IGV4aXN0cywgYW5kIGNsb3Nlc1xuICAgICAqIGlmIG5vIHNpZ25pZmljYW50IGNoYW5nZXMgaGF2ZSBiZWVuIG1hZGUuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSBPcHRpb25zIHRvIHBhc3MgdG8gTGlzdEl0ZW0uc2F2ZUNoYW5nZXMoKS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIDxwcmU+XG4gICAgICogIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiB0eXBlPVwic3VibWl0XCJcbiAgICAgKiAgICAgIG5nLWRpc2FibGVkPVwiJGN0cmwuZm9ybS4kaW52YWxpZCB8fCAhJGN0cmwudXNlckNhbkVkaXRcIj5TYXZlPC9idXR0b24+XG4gICAgICogPC9wcmU+XG4gICAgICovXG4gICAgc2F2ZUxpc3RJdGVtKG9wdGlvbnM/KTogbmcuSVByb21pc2U8YW55PiB7XG4gICAgICAgIGxldCBwcm9taXNlO1xuXG4gICAgICAgIGlmICh0aGlzLmxpc3RJdGVtLmlkICYmIHRoaXMubGlzdEl0ZW0uaXNQcmlzdGluZSgpKSB7XG4gICAgICAgICAgICBwcm9taXNlID0gJHEud2hlbih0aGlzLmxpc3RJdGVtKTtcbiAgICAgICAgICAgIC8vTm8gc2lnbmlmaWNhbnQgY2hhbmdlcyBoYXZlIGJlZW4gbWFkZSBzbyBqdXN0IGNsb3NlXG4gICAgICAgICAgICB0aGlzLmNhbmNlbCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvbWlzZSA9IHRoaXMubGlzdEl0ZW0uc2F2ZUNoYW5nZXMob3B0aW9ucyk7XG5cbiAgICAgICAgICAgIHByb21pc2VcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ci5zdWNjZXNzKCdSZWNvcmQgdXBkYXRlZCcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLiR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyB0aGlzLmdlbmVyYXRlRXJyb3IoJ3VwZGF0aW5nJywgZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2VuZXJhdGVFcnJvcihhY3Rpb246IHN0cmluZywgZXJyKTogRXJyb3Ige1xuICAgICAgICB0b2FzdHIuZXJyb3IoYFRoZXJlIHdhcyBhIHByb2JsZW0gJHthY3Rpb259IHRoaXMgcmVjb3JkLiAgV2UndmUgbG9nZ2VkIHRoZSBpc3N1ZSBhbmQgYXJlIGxvb2tpbmcgaW50byBpdC4gIEFueSBhZGRpdGlvbmFsIGluZm9ybWF0aW9uIHlvdSBjYW4gcHJvdmlkZSB3b3VsZCBiZSBhcHByZWNpYXRlZC5gKTtcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihgU3VtbWFyeTogRXJyb3IgJHthY3Rpb259IGxpc3QgaXRlbSBmcm9tIG1vZGFsLlxuICAgICAgICAgICAgICAgIEVycm9yOiAke2Vycn1cbiAgICAgICAgICAgICAgICBMaXN0SXRlbTogJHtKU09OLnN0cmluZ2lmeSh0aGlzLmxpc3RJdGVtLCBudWxsLCAyKSB9YCk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQVBNb2RhbFNlcnZpY2Uge1xuICAgIHN0YXRpYyAkaW5qZWN0ID0gWyckdWliTW9kYWwnLCAnJHEnXTtcblxuICAgIGNvbnN0cnVjdG9yKF8kdWliTW9kYWxfLCBfJHFfKSB7XG4gICAgICAgICR1aWJNb2RhbCA9IF8kdWliTW9kYWxfO1xuICAgICAgICAkcSA9IF8kcV87XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAgICogQG5hbWUgYW5ndWxhclBvaW50LmFwTW9kYWxTZXJ2aWNlOm1vZGFsTW9kZWxQcm92aWRlclxuICAgICAqIEBtZXRob2RPZiBhbmd1bGFyUG9pbnQuYXBNb2RhbFNlcnZpY2VcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBFeHRlbmRzIGEgbW9kZWwgdG8gYWxsb3cgdXMgdG8gZWFzaWx5IGF0dGFjaCBhIG1vZGFsIGZvcm0gdGhhdCBhY2NlcHRzIGFuZCBpbmplY3RzIGFcbiAgICAgKiBkeW5hbWljIG51bWJlciBvZiBhcmd1bWVudHMuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyBDb25maWd1cmF0aW9uIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLnRlbXBsYXRlVXJsIFJlZmVyZW5jZSB0byB0aGUgbW9kYWwgdmlldy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY29uZmlnLmNvbnRyb2xsZXIgTmFtZSBvZiB0aGUgbW9kYWwgY29udHJvbGxlci5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBbY29uZmlnLnJlc29sdmVyXSBQYXNzIGFyZ3VtZW50cyByZWNlaXZlZCB0byB0aGlzIGZ1bmN0aW9uIHdoaWNoIGNyZWF0ZXMgdGhlIG5lY2Vzc2FyeSByZXNvbHZlIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjb25maWcubG9ja10gVXNlIHN5bmMgc2VydmljZSB0byByZWdpc3RlciBhIGxvY2sgZXZlbnQuXG4gICAgICogQHJldHVybnMge2Z1bmN0aW9uKGFueT0pOiBhbmd1bGFyLklQcm9taXNlPGFueT59IEZ1bmN0aW9uIHdoaWNoIHJldHVybnMgb3Blbk1vZGFsIHRoYXQgaW4gdHVybiByZXR1cm5zIGEgcHJvbWlzZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogPHByZT5cbiAgICAgKiAgICBtb2RlbC5vcGVuTW9kYWwgPSBhcE1vZGFsU2VydmljZS5tb2RhbE1vZGVsUHJvdmlkZXIoe1xuICAgICAgICAgKiAgICAgICAgdGVtcGxhdGU6IHJlcXVpcmUoJ21vZHVsZXMvY29tcF9yZXF1ZXN0L3ZpZXdzL2NvbXBfcmVxdWVzdF9tb2RhbF92aWV3Lmh0bWwnLFxuICAgICAgICAgKiAgICAgICAgY29udHJvbGxlcjogJ2NvbXBSZXF1ZXN0TW9kYWxDdHJsJyxcbiAgICAgICAgICogICAgICAgIGNvbnRyb2xsZXJBczogJyRjdHJsJyxcbiAgICAgICAgICogICAgICAgIHJlc29sdmVyOiBmdW5jdGlvbihwcm9qZWN0KSB7XG4gICAgICAgICAqICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICogICAgICAgICAgICAgICAgcHJvamVjdDogKCkgPT4gcHJvamVjdFxuICAgICAgICAgKiAgICAgICAgICAgIH1cbiAgICAgICAgICogICAgICAgIH1cbiAgICAgICAgICogICAgfSk7XG4gICAgICogPC9wcmU+XG4gICAgICovXG4gICAgbW9kYWxNb2RlbFByb3ZpZGVyKGNvbmZpZzogTW9kYWxDb25maWcpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG9wZW5Nb2RhbChsaXN0SXRlbT86IExpc3RJdGVtPGFueT4gfCBhbnkpIHtcbiAgICAgICAgICAgIGxldCBtb2RlbCA9IHRoaXM7XG4gICAgICAgICAgICBsZXQgbG9ja0luZm87XG4gICAgICAgICAgICBsaXN0SXRlbSA9IGxpc3RJdGVtIHx8IG1vZGVsLmNyZWF0ZUVtcHR5SXRlbSgpO1xuXG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0czogTW9kYWxDb25maWdPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbmZpZy5jb250cm9sbGVyLFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IDxhbnk+e31cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChjb25maWcudGVtcGxhdGVVcmwpIHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0cy50ZW1wbGF0ZVVybCA9IGNvbmZpZy50ZW1wbGF0ZVVybDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY29uZmlnLnRlbXBsYXRlKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdHMudGVtcGxhdGUgPSBjb25maWcudGVtcGxhdGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKiBQYXNzIHRocm91Z2ggYW55IGFyZ3VtZW50cyB0byB0aGUgcmVzb2x2ZXIgZnVuY3Rpb24gdG8gYWxsb3cgZm9yIGR5bmFtaWMgcmVzb2x2ZSBvYmplY3RcbiAgICAgICAgICAgICAqIHRvIGJlIGNyZWF0ZWQgd2l0aCB0aGUgb25seSBhc3N1bXB0aW9uIGJlaW5nIHRoZSBsaXN0IGl0ZW0gYmVpbmcgZWRpdGVkIGlzIHRoZSBmaXJzdCBwYXJhbSAqL1xuICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihjb25maWcucmVzb2x2ZXIpKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdHMucmVzb2x2ZSA9IGNvbmZpZy5yZXNvbHZlci5hcHBseShjb25maWcucmVzb2x2ZXIsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKiBPcHRpb25hbGx5IGxvY2sgdGhlIGxpc3QgaXRlbSBmb3IgZWRpdGluZyBpZiB0aGUgdGhlIHN5bmMgc2VydmljZSBpcyBpbmNsdWRlZCAqL1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5sb2NrKSB7XG4gICAgICAgICAgICAgICAgbG9ja0luZm8gPSBsaXN0SXRlbS5sb2NrKCk7XG4gICAgICAgICAgICAgICAgZGVmYXVsdHMucmVzb2x2ZS5sb2NrSW5mbyA9ICgpID0+IGxvY2tJbmZvO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBtb2RhbENvbmZpZyA9IF8uYXNzaWduKHt9LCBkZWZhdWx0cywgY29uZmlnKTtcbiAgICAgICAgICAgIGNvbnN0IG1vZGFsSW5zdGFuY2UgPSAkdWliTW9kYWwub3Blbihtb2RhbENvbmZpZyk7XG5cbiAgICAgICAgICAgIGlmIChsaXN0SXRlbS5pZCkge1xuXG4gICAgICAgICAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHRcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdW5sb2NrT25DbG9zZShjb25maWcubG9jaywgbG9ja0luZm8pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyoqIFJldmVydCBiYWNrIGFueSBjaGFuZ2VzIHRoYXQgd2VyZSBtYWRlIHRvIGVkaXRhYmxlIGZpZWxkcywgbGVhdmluZyBjaGFuZ2VzIG1hZGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAqIHRvIHJlYWRvbmx5IGZpZWxkcyBsaWtlIGF0dGFjaG1lbnRzICovXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0SXRlbS5zZXRQcmlzdGluZShsaXN0SXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB1bmxvY2tPbkNsb3NlKGNvbmZpZy5sb2NrLCBsb2NrSW5mbyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbW9kYWxJbnN0YW5jZS5yZXN1bHQ7XG4gICAgICAgIH07XG4gICAgfVxuXG5cbn1cblxuZnVuY3Rpb24gdW5sb2NrT25DbG9zZShsb2NrLCBsb2NrSW5mbykge1xuICAgIGlmIChsb2NrKSB7XG4gICAgICAgIC8vVXNlcnMgd2l0aG91dCBzdWZmaWNpZW50IHBlcm1pc3Npb25zIHdvbid0IGJlIGFibGUgdG8gbG9jayBzbyBvbmx5IHVubG9jayBpbiB0aGUgZXZlbnRcbiAgICAgICAgbG9ja0luZm8udGhlbigocmVzb2x2ZWRJbmZvKSA9PiBfLmlzRnVuY3Rpb24ocmVzb2x2ZWRJbmZvLnVubG9jaykgPyByZXNvbHZlZEluZm8udW5sb2NrKCkgOiB1bmRlZmluZWQpO1xuICAgIH1cbn1cblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2FuZ3VsYXItcG9pbnQtbW9kYWwtc2VydmljZS50cyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFuZ3VsYXItcG9pbnRcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJhbmd1bGFyLXBvaW50XCJcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibG9kYXNoXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwibG9kYXNoXCJcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidG9hc3RyXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwidG9hc3RyXCJcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHtBUE1vZGFsU2VydmljZSwgQVBNb2RhbH0gZnJvbSAnLi9hbmd1bGFyLXBvaW50LW1vZGFsLXNlcnZpY2UnO1xuaW1wb3J0IHtBbmd1bGFyUG9pbnRNb2R1bGV9IGZyb20gJ2FuZ3VsYXItcG9pbnQnO1xuXG5leHBvcnQgKiBmcm9tICcuL2FuZ3VsYXItcG9pbnQtbW9kYWwtc2VydmljZSc7XG5cbi8qKlxuICogQG5nZG9jIHNlcnZpY2VcbiAqIEBuYW1lIGFwTW9kYWxTZXJ2aWNlXG4gKiBAZGVzY3JpcHRpb25cbiAqIEV4dGVuZHMgYSBtb2RhbCBmb3JtIHRvIGluY2x1ZGUgbWFueSBzdGFuZGFyZCBmdW5jdGlvbnNcbiAqXG4gKi9cbkFuZ3VsYXJQb2ludE1vZHVsZVxuICAgIC5zZXJ2aWNlKCdhcE1vZGFsU2VydmljZScsIEFQTW9kYWxTZXJ2aWNlKTtcblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vfi90c2xpbnQtbG9hZGVyIS4vc3JjL2luZGV4LnRzIl0sInNvdXJjZVJvb3QiOiIifQ==