app.controller("gridController", ['$scope', 'WorldBankService', function ($scope, WorldBankService) {
    var self = this;
    self.gridConfig = {
        data: [],
        metaData: [],
        pageDataCallback: null,
        pageCount: 0,
        showLoader: false
    };
    self.gridConfig.headers = WorldBankService.getHeaders();
    var getPageData = function (index) {
        WorldBankService.getPageData(index).then(function (response) {
            self.gridConfig.data = response;
            self.gridConfig.pageCount = WorldBankService.getPaginationCount();
            self.gridConfig.showLoader = false;
        });
    };
    self.gridConfig.pageDataCallback = getPageData;
    self.gridConfig.showLoader = true;
    getPageData(0);
    $scope.$on('updateGrid', function () {
        self.gridConfig.showLoader = true;
        getPageData(0);
    });
}]);
