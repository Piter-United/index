app = angular.module('app', ['ngRoute','firebase'],
        function($routeProvider, $locationProvider) {
          $routeProvider.when('/', {
            templateUrl: 'views/home.html',
            controller: HomeCntl
          });

          $routeProvider.when('/meetups', {
            templateUrl: 'views/meetups.html',
            controller: MeetupsCntl
          });

          $routeProvider.when('/communities', {
            templateUrl: 'views/communities.html',
            controller: CommunitiesCntl
          });

          $routeProvider.when('/communities/new', {
            templateUrl: 'views/new-community.html',
            controller: NewCommunityCntl
          });

          $routeProvider.when('/communities/edit/:id', {
            templateUrl: 'views/new-community.html',
            controller: EditCommunityCntl
          });
        });


app.filter('csearch', function() {
  return function(input, term) {
    term = $.trim(term).toLowerCase();
    if(!term){ return input; }
    var res = {}
    for(var key in input){
      var item = input[key];
      if(item.abstract.toLowerCase().indexOf(term) > -1 || item.title.toLowerCase().indexOf(term) > -1) {
        res[key] = item;
      }
    }
    return res;
  };
});

app.directive('navItem', function($location) {
  return {
    replace: true,
    restrict: 'E',
    transclude: true,
    scope: { href: '@' },
    template: '<li ng-class="{active: active}"><a href="#{{href}}" ng-transclude></a></li>',
    link: function (scope, element) {
      scope.$on('$locationChangeSuccess', function(){
        scope.active = ($location.path() == scope.href)
      })
    }
  };
});

function HomeCntl($scope, $route, $routeParams, $location, angularFire) { }

function AuthController($scope, $rootScope) {
  var chatRef = new Firebase("https://piter-united.firebaseio.com");
  var auth = new FirebaseSimpleLogin(chatRef, function(error, user) {
    $scope.$apply(function(){
      if(user){ $rootScope.user = user; } else { $rootScope.user = null }
    });
  });

  $scope.login = function(provider){ auth.login(provider); }

  $scope.logout = function(){ auth.logout(); }
}

function MeetupsCntl($scope, $http, $routeParams) {
  var url = "http://www.google.com/calendar/feeds/piterunited@gmail.com/public/full?alt=json-in-script&callback=JSON_CALLBACK&orderby=starttime&max-results=15&singleevents=true&sortorder=ascending&futureevents=true";
  $http.jsonp(url).success(function(data){
    // console.log(data.feed.entry);
    $scope.events = data.feed.entry;
  });
}

app.factory('communityService', function communityService(angularFire) {
  var _url = "https://piter-united.firebaseio.com/communities";
  var _ref = new Firebase(_url)

  return {
    setListToScope: function(scope, localScopeVarName) {
      angularFire(_ref, scope, localScopeVarName);
    },
    find: function(id, scope, localScopeVarName){
      var itemRef = new Firebase(_url + '/' + id);
      angularFire(itemRef, scope, localScopeVarName);
    },
    addItem: function(item){
      _ref.push(item);
    },
    deleteItem: function(id){
      var itemRef = new Firebase(_url + '/' + id);
      itemRef.remove();
    }
  };
});

function CommunitiesCntl($scope, communityService, $location) {
  communityService.setListToScope($scope, 'communities')
}

function NewCommunityCntl($scope, communityService, $location) {
  $scope.community = {};

  $scope.save = function(){
    var community = $scope.community;
    communityService.addItem(community);
    console.log('create', community);
    $scope.community = {}
    $location.path('/communities')
  }
}

function EditCommunityCntl($scope, communityService, $location, $routeParams) {
  var id = $routeParams.id;
  communityService.find(id, $scope, 'community');
  $scope.save = function(){
    $location.path('/communities')
  }
}
