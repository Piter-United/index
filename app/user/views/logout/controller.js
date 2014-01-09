app.controller('UserLogoutCtrl', function($scope, Auth) {

    $scope.logout = Auth.$logout;
});