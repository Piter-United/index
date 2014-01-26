app.controller('EventListCtrl', function($scope, Event) {
    console.log('event list');
    $scope.events = Event.get();
});