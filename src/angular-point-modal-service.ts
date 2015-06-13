/// <reference path="../typings/ap.d.ts" />
module ap.modal {
    'use strict';


    var toastr, $modal: angular.ui.bootstrap.IModalService;

    export interface IPermObject {
        resolvePermissions(): {
            EditListItems: boolean;
            DeleteListItems: boolean;
            ApproveItems: boolean;
            FullMask: boolean;
        };
    }

    export class APModal {
        displayMode: string;
        fullControl = false;
        negotiatingWithServer = false;
        userCanApprove = false;
        userCanDelete = false;
        userCanEdit = false;

        constructor(private listItem, private $modalInstance) {


            var resolvePermissions = (permObj: IPermObject) => {
                var userPermMask = permObj.resolvePermissions();
                this.userCanEdit = userPermMask.EditListItems;
                this.userCanDelete = userPermMask.DeleteListItems;
                this.userCanApprove = userPermMask.ApproveItems;
                this.fullControl = userPermMask.FullMask;
            };

            if (listItem && listItem.id && listItem.resolvePermissions) {
                resolvePermissions(listItem);
            } else if (listItem.getModel && listItem.getModel().resolvePermissions) {
                /** Fallback to retrieve permissions from the model when a list item isn't available */
                resolvePermissions(listItem.getModel());
            }

            /** Check if it's a new form */
            if (!listItem || !listItem.id) {
                this.displayMode = 'New';
            } else if (this.userCanEdit) {
                this.displayMode = 'Edit';
            } else {
                this.displayMode = 'View';
            }
        }

        cancel(): void {
            this.$modalInstance.dismiss('cancel');
        }

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
        deleteListItem(options?): ng.IPromise<any> {
            var confirmation = window.confirm('Are you sure you want to delete this record?');
            if (confirmation) {
                /** Disable form buttons */
                this.negotiatingWithServer = true;

                return this.listItem.deleteItem(options).then(() => {
                    toastr.success('Record deleted successfully');
                    this.$modalInstance.close();
                }, function() {
                    toastr.error('Failed to delete record.  Please try again.');
                });
            }
        }

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
        saveListItem(options?): ng.IPromise<any> {
            var promise = this.listItem.saveChanges(options);

            promise.then(() => {
                toastr.success('Record updated');
                this.$modalInstance.close();
            }, () => {
                toastr.error('There was a problem updating this record.  Please try again.');
            });

            return promise;
        }
    }

    /** Create a copy of all non-readonly fields so we can restore those values if necessary */
    function takeListItemSnapshot(listItem): Object {
        var model = listItem.getModel();
        var snapshot = {};
        _.each(model.list.fields, function(fieldDefinition) {
            if (!fieldDefinition.readOnly) {
                snapshot[fieldDefinition.mappedName] = listItem[fieldDefinition.mappedName];
            }
        });
        return snapshot;
    }

    export class APModalService {
        static $inject = ['toastr', '$modal'];
        
        constructor(_toastr_, _$modal_) {
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
        modalModelProvider(config: { templateUrl: string; controller: string; resolver?: Function; size?: string; controllerAs?: string; lock?: boolean; }): (listItem?) => angular.IPromise<any> {
            return function openModal(listItem?) {
                var model = this, snapshot, lockInfo;
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
                    defaults.resolve.lockInfo = () => lockInfo;
                }

                var modalConfig = _.assign({}, defaults, config);
                var modalInstance = $modal.open(modalConfig);

                if (listItem.id) {

                    /** Create a copy in case we need to revert back */
                    snapshot = takeListItemSnapshot(listItem);

                    modalInstance.result.then(function() {
                        if (config.lock) {
                            lockInfo.then((resolvedInfo) => resolvedInfo.unlock());
                        }

                    }, function() {
                        /** Revert back any changes that were made to editable fields, leaving changes made
                         * to readonly fields like attachments */
                        _.assign(listItem, snapshot);

                        if (config.lock) {
                            lockInfo.then((resolvedInfo) => resolvedInfo.unlock());
                        }
                    });
                }

                return modalInstance.result;
            };
        }

    }

    /**
     * @ngdoc service
     * @name ap.apModalService
     * @description
     * Extends a modal form to include many standard functions
     *
     */
    angular.module('angularPoint')
        .service('apModalService', APModalService);

}
