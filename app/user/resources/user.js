app.factory('User', function($firebaseRes) {
    return $firebaseRes("https://piterunited.firebaseio.com/users/:id");
})