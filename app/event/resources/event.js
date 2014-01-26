app.factory('Event', function($firebaseRes) {
    var Event = $firebaseRes("https://piterunited.firebaseio.com/events/:id");
//    var get = Event.get;
//
//    Event.get = function(url, params) {
//        var event = get(url, params);
//        console.log(event);
//        var save = event.$save;
//        var add = event.$add.bind(event);
//        event.$save = function(key) {
//            event.$save(key);
//            //var CalendarEvent = $firebaseRes("https://piterunited.firebaseio.com/calendar/:id");
//
//        };
//        -JD6PgP4tlHt5eZz9BME
//        event.$add = function(key) {
//            add(key);
//            //var CalendarEvent = $firebaseRes("https://piterunited.firebaseio.com/calendar/:id");
//
//        };
//        return event;
//    };
//
//    Event.$save = function(key) {
//
//    };
//    console.log(Event);
////    $save([key])
////    'get': function(url, params) {
    return Event;
});