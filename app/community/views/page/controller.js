app.controller('CommunityPageCtrl', function($scope, $routeParams, $location, $window, Community, Auth) {

    $window.scrollTo(0,0);

    var creating = $routeParams.communityId ? false : true,
        emptyCommunity = {
            logo: "app/community/img/no_logo.jpg"
        },
        community = creating ? angular.extend({}, emptyCommunity) : Community.get({id: $routeParams.communityId}),
        communityUpd = angular.copy(community),
        newId,
        today = new Date(),
        editor = {
            info: creating,
            note: false
        },
        tabs = {
            events: true,
            note: false,
            members: false
        };

    //Переходим на таб соответствующий url
    if ($routeParams.tabId) {
        for (var k in tabs) {
            tabs[k] = k == $routeParams.tabId;
        }
    }
    $scope.creating = creating;
    $scope.community = community;
    $scope.communityUpd = communityUpd;
    $scope.editor = editor;
    $scope.tab = tabs;

    $scope.edit = function(key) {
        angular.extend(communityUpd, community);
        $scope.editor[key] = true;
    };
    $scope.cancel = function(key) {
        $scope.editor[key] = false;
    };
    $scope.create = function(){
        communityUpd.date = today.getTime();
        communityUpd.owner = Auth.$current.user.id;
        newId = Community.addWithId(communityUpd);
        $location.path("/community/" + newId);
    };
    $scope.save = function(){
        angular.extend(community, communityUpd);
        community.$save();
        editor.info = false;
        communityUpd = {};
    };
    $scope.saveNote = function(){
        community.note = communityUpd.note;
        community.$save('note');
        editor.note = false;
        communityUpd = {};
    };
    $scope.remove = function (){
        community.$set(null);
        $location.path("/communities");
    };

//  TODO: Change url when current tab changed
//    $scope.$watch('tab', function(newVal, oldVal) {
//        if (newVal !== oldVal) {
//            var activeTab
//            for (var k in newVal) {
//                if (newVal[k]) {
//                    if (activeTab) {
//                        return;
//                    }
//                    activeTab = k;
//                }
//            }
//            $location.path("/community/" + $routeParams.communityId + "/" + activeTab);
//        }
//    }, true);
});