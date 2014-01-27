app.controller('CalendarAsideCtrl', function($scope, Event) {

    var events = Event.query(),
        today = new Date();

    $scope.events = events;
    $scope.today = today.getTime();

});