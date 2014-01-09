app.factory('Community', function($firebaseRes) {
    return $firebaseRes("https://piterunited.firebaseio.com/communities/:id");
});