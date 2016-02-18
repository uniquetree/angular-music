/**
 * Created by 郑树聪 on 2016/2/18.
 */

// 页面权限验证
var indexController = function ($scope, $rootScope, $http, $location, blockUI) {

    $scope.$on('$routeChangeStart', function (scope, next, current) {

        $scope.authenicateUser($location.path(),
        $scope.authenicateUserComplete, $scope.authenicateUserError);
    });
    $scope.authenicateUser = function (route, successFunction, errorFunction) {
        var authenication = {};
        authenication.route = route;
        $scope.AjaxGet(authenication, "/api/main/AuthenicateUser", successFunction, errorFunction);
    };
    $scope.authenicateUserComplete = function (response) {
        if (!response.IsAuthenicated)
        {
            window.location = "/";
        }
    };
};

