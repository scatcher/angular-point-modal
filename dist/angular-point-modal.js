/// <reference path="../typings/tsd.d.ts" />
var ap;
(function (ap) {
    var modal;
    (function (modal) {
        'use strict';
        var toastr, $modal;
        var APModal = (function () {
            function APModal(listItem, $modalInstance) {
                var _this = this;
                this.listItem = listItem;
                this.$modalInstance = $modalInstance;
                this.fullControl = false;
                this.negotiatingWithServer = false;
                this.userCanApprove = false;
                this.userCanDelete = false;
                this.userCanEdit = false;
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
                this.$modalInstance.dismiss('cancel');
            };
            /**
             * @ngdoc function
             * @name angularPoint.apModalService:deleteListItem
             * @methodOf angularPoint.apModalService
             * @description
             * Prompts for confirmation of deletion, then deletes and closes modal
             * @param {object} [options] Options to pass to ListItem.deleteItem().
             * @example
             *
             * <pre>
             * <button type="button" class="btn btn-danger" ng-click="vm.deleteListItem()"
             *          ng-show="vm.projectDocument.id && vm.userCanDelete"
             *          title="Delete this document.">
             *      <i class="fa fa-trash-o"></i>
             *  </button>
             * </pre>
             */
            APModal.prototype.deleteListItem = function (options) {
                var _this = this;
                var confirmation = window.confirm('Are you sure you want to delete this record?');
                if (confirmation) {
                    /** Disable form buttons */
                    this.negotiatingWithServer = true;
                    return this.listItem.deleteItem(options).then(function () {
                        toastr.success('Record deleted successfully');
                        _this.$modalInstance.close();
                    }, function () {
                        toastr.error('Failed to delete record.  Please try again.');
                    });
                }
            };
            /**
             * @ngdoc function
             * @name angularPoint.apModalService:saveListItem
             * @methodOf angularPoint.apModalService
             * @description
             * Creates a new record if necessary, otherwise updates the existing record
             * @param {object} [options] Options to pass to ListItem.saveChanges().
             * @example
             * <pre>
             *  <button class="btn btn-primary" type="submit"
             *      ng-disabled="vm.form.$invalid || !vm.userCanEdit">Save</button>
             * </pre>
             */
            APModal.prototype.saveListItem = function (options) {
                var _this = this;
                var promise = this.listItem.saveChanges(options);
                promise.then(function () {
                    toastr.success('Record updated');
                    _this.$modalInstance.close();
                }, function () {
                    toastr.error('There was a problem updating this record.  Please try again.');
                });
                return promise;
            };
            return APModal;
        })();
        modal.APModal = APModal;
        var APModalService = (function () {
            function APModalService(_toastr_, _$modal_) {
                toastr = _toastr_;
                $modal = _$modal_;
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
             *        templateUrl: 'modules/comp_request/views/comp_request_modal_view.html',
             *        controller: 'compRequestModalCtrl',
             *        controllerAs: 'vm',
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
                    var model = this, lockInfo;
                    listItem = listItem || model.createEmptyItem();
                    var defaults = {
                        templateUrl: config.templateUrl,
                        controller: config.controller,
                        resolve: {}
                    };
                    /** Pass through any arguments to the resolver function to allow for dynamic resolve object
                     * to be created with the only assumption being the list item being edited is the first param */
                    if (_.isFunction(config.resolver)) {
                        defaults.resolve = config.resolver.apply(config.resolver, arguments);
                    }
                    /** Optionally lock the list item for editing if the the sync service is included */
                    if (config.lock) {
                        lockInfo = listItem.lock();
                        defaults.resolve.lockInfo = function () { return lockInfo; };
                    }
                    var modalConfig = _.assign({}, defaults, config);
                    var modalInstance = $modal.open(modalConfig);
                    if (listItem.id) {
                        modalInstance.result.then(function () {
                            unlockOnClose(config.lock, lockInfo);
                        }, function () {
                            /** Revert back any changes that were made to editable fields, leaving changes made
                             * to readonly fields like attachments */
                            listItem.setPristine(listItem);
                            unlockOnClose(config.lock, lockInfo);
                        });
                    }
                    return modalInstance.result;
                };
            };
            APModalService.$inject = ['toastr', '$modal'];
            return APModalService;
        })();
        modal.APModalService = APModalService;
        function unlockOnClose(lock, lockInfo) {
            if (lock) {
                //Users without sufficient permissions won't be able to lock so only unlock in the event 
                lockInfo.then(function (resolvedInfo) { return _.isFunction(resolvedInfo.unlock) ? resolvedInfo.unlock() : undefined; });
            }
        }
    })(modal = ap.modal || (ap.modal = {}));
})(ap || (ap = {}));

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/ap.d.ts" />
var ap;
(function (ap) {
    var modal;
    (function (modal) {
        'use strict';
        /**
     * @ngdoc service
     * @name ap.apModalService
     * @description
     * Extends a modal form to include many standard functions
     *
     */
        angular.module('apModal', ['angularPoint', 'ui.bootstrap', 'toastr'])
            .service('apModalService', modal.APModalService);
    })(modal = ap.modal || (ap.modal = {}));
})(ap || (ap = {}));

//# sourceMappingURL=angular-point-modal.js.map