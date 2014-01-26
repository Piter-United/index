app.factory('Calendar', function($firebaseRes) {
    return $firebaseRes("https://piterunited.firebaseio.com/calendar/:date/:type");
});