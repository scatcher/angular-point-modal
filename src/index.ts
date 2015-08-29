/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/ap.d.ts" />

module ap.modal {
    'use strict';
	
    /**
     * @ngdoc service
     * @name ap.apModalService
     * @description
     * Extends a modal form to include many standard functions
     *
     */
    angular.module('apModal', ['angularPoint', 'ui.bootstrap', 'toastr'])
        .service('apModalService', APModalService);
}