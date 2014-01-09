app.controller('UserListCtrl', function($scope, $cookies, $window, User) {

    $window.scrollTo(0,0);

    var users = User.query();

    $scope.users = users;

    $scope.change = function(id, value) {
        users.$child(id).$child("status").$set(value);
    }
    $scope.save = function(id) {
        users.$save(id);
    }
});