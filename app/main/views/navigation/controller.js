app.controller('MainNavigationCtrl', function($scope, $route) {

    $scope.active = function (name) {
        return $route.current.originalPath == name ? 'active' : '';
    }
});