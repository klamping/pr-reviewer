/*globals prs:true*/
angular.module('prApp', [])
.controller('MainCtrl', function ($scope) {
    $scope.prs = prs;

    $scope.daysAgo = function (time) {
        var then = moment(time);

        return then.fromNow();
    };
});