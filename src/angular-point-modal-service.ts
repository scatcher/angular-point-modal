import * as toastr from "toastr";
import * as _ from "lodash";
import {
  IModalService,
  IModalServiceInstance,
  IModalSettings,
} from "angular-ui-bootstrap";
import { ListItem } from "angular-point";

let $uibModal: IModalService, $q: ng.IQService;

export interface IPermObject {
  resolvePermissions(): {
    EditListItems: boolean;
    DeleteListItems: boolean;
    ApproveItems: boolean;
    FullMask: boolean;
  };
}

export interface ModalConfig extends IModalSettings {
  templateUrl?: string;
  template?: string;
  controller: string;
  resolver?: Function;
  size?: string;
  controllerAs?: string;
  lock?: boolean;
}

interface ModalConfigOptions extends ModalConfig {
  resolve: {
    [key: string]: any;
  };
}

export class APModal {
  $uibModalInstance: IModalServiceInstance;
  displayMode: string;
  fullControl = false;
  listItem: ListItem<any>;
  negotiatingWithServer = false;
  userCanApprove = false;
  userCanDelete = false;
  userCanEdit = false;

  constructor(
    listItem: ListItem<any>,
    $uibModalInstance: IModalServiceInstance
  ) {
    // Manually declare to make it more obvious what's available to all child classes
    this.listItem = listItem;
    this.$uibModalInstance = $uibModalInstance;

    const resolvePermissions = (permObj: IPermObject) => {
      const userPermMask = permObj.resolvePermissions();
      this.userCanEdit = userPermMask.EditListItems;
      this.userCanDelete = userPermMask.DeleteListItems;
      this.userCanApprove = userPermMask.ApproveItems;
      this.fullControl = userPermMask.FullMask;
    };

    if (this.listItem && this.listItem.id && this.listItem.resolvePermissions) {
      resolvePermissions(this.listItem);
    } else if (
      this.listItem.getModel &&
      this.listItem.getModel().resolvePermissions
    ) {
      /** Fallback to retrieve permissions from the model when a list item isn't available */
      resolvePermissions(this.listItem.getModel());
    }

    /** Check if it's a new form */
    if (!this.listItem || !this.listItem.id) {
      this.displayMode = "New";
    } else if (this.userCanEdit) {
      this.displayMode = "Edit";
    } else {
      this.displayMode = "View";
    }
  }

  // Lifecycle hook in case we need it
  $onInit() {}

  cancel(): void {
    this.$uibModalInstance.dismiss("cancel");
  }

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
  deleteListItem(): ng.IPromise<any> {
    const confirmation = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (confirmation) {
      /** Disable form buttons */
      this.negotiatingWithServer = true;

      return this.listItem
        .deleteItem()
        .then(() => {
          toastr.success("Record deleted successfully");
          return this.$uibModalInstance.close();
        })
        .catch((err) => {
          throw this.generateError("deleting", err);
        });
    }
  }

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
  saveListItem(options?): ng.IPromise<any> {
    let promise;

    if (this.listItem.id && this.listItem.isPristine()) {
      promise = $q.when(this.listItem);
      // No significant changes have been made so just close
      this.cancel();
    } else {
      promise = this.listItem.saveChanges(options);

      promise
        .then((updatedListItem) => {
          toastr.success("Record updated");
          this.$uibModalInstance.close(updatedListItem);
        })
        .catch((err) => {
          throw this.generateError("updating", err);
        });
    }

    return promise;
  }

  private generateError(action: string, err): Error {
    toastr.error(
      `There was a problem ${action} this record.  We've logged the issue and are looking into it.  Any additional information you can provide would be appreciated.`
    );
    return new Error(`Summary: Error ${action} list item from modal.
                Error: ${err}
                ListItem: ${JSON.stringify(this.listItem, null, 2)}`);
  }
}

export class APModalService {
  static $inject = ["$uibModal", "$q"];

  constructor(_$uibModal_, _$q_) {
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
  modalModelProvider(config: ModalConfig) {
    return function openModal(listItem?: ListItem<any> | any) {
      let model = this;
      let lockInfo;
      listItem = listItem || model.createEmptyItem();

      const defaults: ModalConfigOptions = {
        controller: config.controller,
        resolve: <any>{},
      };

      if (config.templateUrl) {
        defaults.templateUrl = config.templateUrl;
      } else if (config.template) {
        defaults.template = config.template;
      }

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

      const modalConfig = _.assign({}, defaults, config);
      const modalInstance = $uibModal.open(modalConfig);

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
  }
}

function unlockOnClose(lock, lockInfo) {
  if (lock) {
    // Users without sufficient permissions won't be able to lock so only unlock in the event
    lockInfo.then((resolvedInfo) =>
      _.isFunction(resolvedInfo.unlock) ? resolvedInfo.unlock() : undefined
    );
  }
}
