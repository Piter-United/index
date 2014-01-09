app.config(function($routeProvider) {

    $routeProvider.when('/communities', {
        templateUrl: 'app/community/views/list/template.html'
    });
    $routeProvider.when('/community/new', {
        templateUrl: 'app/community/views/page/template.html',
        asideMiddleUrl: ''
    });
    $routeProvider.when('/community/:communityId/:tabId?', {
        templateUrl: 'app/community/views/page/template.html'
    });
});