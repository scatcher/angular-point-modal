import {APModalService, APModal} from './angular-point-modal-service';
import {AngularPointModule} from 'angular-point';

export * from './angular-point-modal-service';

/**
 * @ngdoc service
 * @name apModalService
 * @description
 * Extends a modal form to include many standard functions
 *
 */
AngularPointModule
    .service('apModalService', APModalService);

