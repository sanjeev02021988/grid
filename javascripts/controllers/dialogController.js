app.controller("dialogController", ['$scope', 'WorldBankService', function ($scope, WorldBankService) {
    var self = this;
    self.filterCondition = [
        {
            key: "",
            value: ""
        }
    ];
    self.options = {
        lendingTypes: {
            key: "Lending Type",
            values: []
        },
        incomeLevels: {
            key: "Income Level",
            values: []
        },
        regions: {
            key: "Region",
            values: []
        }
    };
    WorldBankService.getSubOptions("incomeLevels").then(function (response) {
        self.options.incomeLevels.values = response;
    });
    WorldBankService.getSubOptions("lendingTypes").then(function (response) {
        self.options.lendingTypes.values = response;
    });
    WorldBankService.getSubOptions("regions").then(function (response) {
        self.options.regions.values = response.map(function (item) {
            var obj = {};
            obj.id = item.code;
            obj.value = item.name;
            return obj;
        });
    });
    self.getSubOptions = function (key) {
        if (self.options[key]) {
            return self.options[key].values;
        }
        return [];
    };
    self.showFilterDialog = false;
    self.fnShowFilterDialog = function () {
        self.showFilterDialog = !self.showFilterDialog;
    };
    self.apply = function () {
        var filterStrArr = '';
        self.filterCondition.forEach(function (filter) {
            filterStrArr += '&' + filter.key + '=' + filter.value;
        });
        WorldBankService.setFilters(filterStrArr);
        self.close();
        $scope.$emit('updateGrid');
    };
    self.addCondition = function (index) {
        self.filterCondition.splice(index + 1, 0, {
            key: "",
            value: ""
        });
    };
    self.removeCondition = function (index) {
        self.filterCondition.splice(index, 1);
        if(self.filterCondition.length === 0){
          self.filterCondition.push({
            key: "",
            value: ""
          });
        }
    };
    self.close = function () {
        self.showFilterDialog = false;
    };
}]);
