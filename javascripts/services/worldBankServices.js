app.service("WorldBankService", ['$http', '$q', function ($http, $q) {
    var self = this;
    var pagedData = [];
    var baseURL = "http://api.worldbank.org/";
    var baseURLParamsStr = '?format=jsonP&prefix=JSON_CALLBACK&callback=JSON_CALLBACK';
    var headerArr = [
        {
            key: "name",
            value: "country"
        },
        {
            key: "iso2Code",
            value: "ISO2 code"
        },
        {
            key: "region",
            value: "Region"
        },
        {
            key: "capitalCity",
            value: "capital"
        },
        {
            key: "lendingType",
            value: "lending type"
        },
        {
            key: "incomeLevel",
            value: "income level"
        }
    ];
    var paramsStr = "";
    self.setFilters = function (filtersStr) {
        paramsStr = filtersStr;
        pagedData.length = 0;
    };

    self.getHeaders = function () {
        return headerArr;
    };

    self.getPaginationCount = function () {
        return pagedData.length;
    };

    self.getSubOptions = function (option) {
        var deferred = $q.defer();
        var url = baseURL + option + baseURLParamsStr;
        $http.jsonp(url).then(function (response) {
            var result = response.data;
            deferred.resolve(result[1]);
        });
        return deferred.promise;
    };

    self.getData = function (pageIndex) {
        var deferred = $q.defer();
        var url = baseURL + 'countries' + baseURLParamsStr + paramsStr + '&page=' + pageIndex;
        $http.jsonp(url).then(function (response) {
            var result = response.data;
            processData(result);
            deferred.resolve(processData(result));
        });
        return deferred.promise;
    };

    var processData = function (result) {
        var pageInfo = result[0];
        pagedData.length = pageInfo.pages;
        var data = result[1].map(function (item) {
            var obj = [];
            headerArr.forEach(function (headerItem) {
                if (typeof item[headerItem.key] === 'object') {
                    obj.push(item[headerItem.key].value);
                } else {
                    obj.push(item[headerItem.key]);
                }
            });
            return obj;
        });
        pagedData[pageInfo.page - 1] = data;
        return data;
    };

    self.getPageData = function (pageIndex) {
        var deferred = $q.defer();
        if (!pagedData[pageIndex]) {
            return self.getData(pageIndex + 1);
        } else {
            deferred.resolve(pagedData[pageIndex]);
        }
        return deferred.promise;
    }
}]);
