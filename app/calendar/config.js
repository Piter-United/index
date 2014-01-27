app.config(function($routeProvider, $locationProvider) {

    $routeProvider.when('/calendar', {
        templateUrl: 'app/calendar/views/page/template.html',
        fullWidth: true
    });
});
