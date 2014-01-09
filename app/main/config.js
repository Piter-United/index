app.config(function($routeProvider) {

    $routeProvider.when('/', {
        templateUrl: 'app/community/views/list/template.html',
        contentHeaderUrl: 'app/main/views/home/template.html'
    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });
});

app.run(function($routeParams, $route, $rootScope) {

    $rootScope.route = $route;

    $rootScope.$on('$routeChangeSuccess', function(e, current, previous) {

        $rootScope.routeData = angular.extend({
            //default sections
            navigationTopUrl: 'app/main/views/navigation/template.html',
            asideTopUrl:      'app/calendar/views/aside/template.html',
            asideMiddleUrl:   'app/community/views/aside/template.html',
            asideBottomUrl:   'app/banner/views/aside/template.html'

        }, current.$$route);
    })
})