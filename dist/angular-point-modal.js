/// <reference path="../typings/tsd.d.ts" />
var ap;
(function (ap) {
    var modal;
    (function (modal) {
        'use strict';
        var toastr, $modal, $q;
        var APModal = (function () {
            function APModal(listItem, $modalInstance) {
                var _this = this;
                this.fullControl = false;
                this.negotiatingWithServer = false;
                this.userCanApprove = false;
                this.userCanDelete = false;
                this.userCanEdit = false;
                //Manually declare to make it more obvious what's available to all child classes
                this.listItem = listItem;
                this.$modalInstance = $modalInstance;
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
                    return this.listItem.deleteItem(options)
                        .then(function () {
                        toastr.success('Record deleted successfully');
                        return _this.$modalInstance.close();
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
             *      ng-disabled="vm.form.$invalid || !vm.userCanEdit">Save</button>
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
                        toastr.success('Record updated');
                        _this.$modalInstance.close();
                    })
                        .catch(function (err) {
                        throw _this.generateError('updating', err);
                    });
                }
                return promise;
            };
            APModal.prototype.generateError = function (action, err) {
                toastr.error("There was a problem " + action + " this record.  We've logged the issue and are looking into it.  Any additional information you can provide would be appreciated.");
                return new Error("Summary: Error " + action + " list item from modal.\n                Error: " + err + "\n                ListItem: " + JSON.stringify(this.listItem));
            };
            return APModal;
        })();
        modal.APModal = APModal;
        var APModalService = (function () {
            function APModalService(_toastr_, _$modal_, _$q_) {
                toastr = _toastr_;
                $modal = _$modal_;
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
            APModalService.$inject = ['toastr', '$modal', '$q'];
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