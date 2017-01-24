app.directive("grid", ['$interval', '$timeout', function ($interval, $timeout) {
    return{
        restrict: 'E',
        scope: {
            conf: "="
        },
        template: '<div class="grid">' +
            '<div class="container">' +
            '<div class="header">' +
            '<div class="row"><div ng-repeat="header in conf.headers">{{header.value}}</div></div>' +
            '</div>' +
            '<div class="content">' +
            '<div class="row" ng-repeat="row in conf.data">' +
            '<div ng-repeat="cell in row track by $index">{{cell}}</div>' +
            '</div>' +
            '</div>' +
            '<div class="footer">' +
            '<div><i ng-click="updatePageStartIndex(-1)" class="material-icons icon">navigate_before</i></div>' +
            '<div class="pages"><div ng-show="isPageVisible($index)" ng-class="{selected:isPageSelected($index)}" ng-repeat="n in [].constructor(conf.pageCount) track by $index" ng-click="getPageData($index)">{{$index + 1}}</div></div>' +
            '<div><i ng-click="updatePageStartIndex(1)" class="material-icons icon">navigate_next</i></div>' +
            '</div>' +
            '<div class="overlay" ng-show="conf.showLoader">' +
            '<div class="background"></div>' +
            '<div class="content">' +
            '<div class="loader"></div>' +
            '</div>' +
            '</div>' +
            '</div>',
        link: function ($scope, $element) {
            var currentPage = 0;
            var pageStartIndex = 0;
            var numberOfPages = 5;
            $('.content').scroll(function () {
                var left = $(this).scrollLeft();
                $('.header').css('left', -1 * left);
            });
            $scope.isPageVisible = function (index) {
                return index >= pageStartIndex && index < (pageStartIndex + numberOfPages);
            };
            $scope.updatePageStartIndex = function (count) {
                pageStartIndex += count;
                if (pageStartIndex > $scope.conf.pageCount - numberOfPages) {
                    pageStartIndex = $scope.conf.pageCount - numberOfPages;
                } else if (pageStartIndex < 0) {
                    pageStartIndex = 0;
                }
            };
            $scope.isPageSelected = function (index) {
                return currentPage === index;
            };
            $scope.getPageData = function (index) {
                $scope.conf.showLoader = true;
                $scope.conf.pageDataCallback(index);
                currentPage = index;
            }
        }
    };
}]);
