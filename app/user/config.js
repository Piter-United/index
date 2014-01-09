app.config(function($routeProvider) {

    $routeProvider.when('/users', {
        templateUrl: 'app/user/views/list/template.html'
    });
    $routeProvider.when('/user/:userId', {
        templateUrl: 'app/user/views/page/template.html'
    });
});

app.run(function($rootScope, $route, Auth) {

    $rootScope.auth = Auth.$current;

    Auth.$login();

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        Auth.$routeAllow("/users", ['admin','moderator'], next, current);
    });

    $rootScope.$on('$firebaseAuth:login', function() {
        $route.reload();
    });

    $rootScope.$on('$firebaseAuth:logout', function() {
        $route.reload();
    });
});