app.controller('CommunityListCtrl', function($scope, $window, Community, Auth) {

    $window.scrollTo(0,0);

    var communities = Community.query();
    var emptyCommunity = {
        logo: "app/community/img/no_logo.jpg"
    };
    var newCommunity = angular.extend({}, emptyCommunity);

    $scope.communities = communities;
    $scope.newCommunity = newCommunity;

    $scope.create = function(value) {
        if (!angular.isObject(value)) {
            value = newCommunity;
        }
        value.owner = Auth.$current.user.id;

        Community.addWithId(value);
        for (var k in newCommunity) {
            newCommunity[k] = emptyCommunity[k] ? emptyCommunity[k] : undefined;
        }
    }
    $scope.remove = function(id) {
        communities.$remove(id);
        // or
        // Test.remove({"id": id});
    }
    $scope.save = function(id) {
        communities.$save(id);
    }
});