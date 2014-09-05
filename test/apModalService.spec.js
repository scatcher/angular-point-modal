"use strict";

describe("Factory: apDecodeService", function () {

    beforeEach(module("angularPoint"));

    var apDecodeService,
        mockModel,
        mockXMLService;

    beforeEach(inject(function (_apDecodeService_, _mockXMLService_, _mockModel_) {
        apDecodeService = _apDecodeService_;
        mockXMLService = _mockXMLService_;
        mockModel = _mockModel_;

    }));

    it('sees the service', function () {
        expect(apDecodeService).toBeDefined();
    });

});