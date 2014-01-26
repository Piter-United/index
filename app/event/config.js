app.config(function($routeProvider, $locationProvider) {

    $routeProvider.when('/events', {
        templateUrl: 'app/event/views/list/template.html'
    });
});
