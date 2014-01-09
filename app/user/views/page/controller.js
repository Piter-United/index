app.controller('UserPageCtrl', function($scope, $routeParams, $window, Auth, User) {

    $window.scrollTo(0,0);

    var user = User.get({id: $routeParams.userId}),
        profile = user.$child('profile'),
        profileUpd = angular.copy(profile),
        editor = {
            info: false
        };
    $scope.user = user;
    $scope.profile = profile;
    $scope.profileUpd = profileUpd;
    $scope.editor = editor;

    $scope.edit = function(key) {
        angular.extend(profileUpd, profile);
        $scope.editor[key] = true;
    };
    $scope.cancel = function(key) {
        $scope.editor[key] = false;
    };
    $scope.save = function(){
        angular.extend(profile, profileUpd);
        profile.$save();
        editor.info = false;
        profileUpd = {};
    }
    $scope.remove = Auth.$unregisterUser;

    $scope.restore = function(){
        user.$child('status').$set('registered');
    }

// TODO: close editor if we didn't change something
//    $scope.save = function(key){
//        profile.$save(key);
//        if (!key) {
//            profile.$on("change", function() {
//                editor.info = false;
//            });
//        }
//    }

});