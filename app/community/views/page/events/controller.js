app.controller('CommunityPageEventsCtrl', function($scope, $routeParams, $location, $objToArr, Community, Event, Calendar, Auth) {

    var events = $objToArr(Community.get({id: $routeParams.communityId}).$child('events'));
    var today = new Date(),
        startTime = '19:00';
    setTime(today, startTime);

    var i, k, eventId, newDateId, oldDateId, tempDate, event, newEvent, timeArr, date, oldMonth, newMonth, oldYear, newYear,
        calendar = {
            'min': today.getTime(),
            'show-weeks': false,
            'opened': false,
            'open': function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                calendar.opened = !calendar.opened;
            }
        },
        emptyEvent = {
            startDate: today,
            startTime: startTime,
            endTime: '21:00'
        },
        eventUpd = angular.copy(emptyEvent);

    function setTime(dateObj, time) {
        timeArr = time.split(':');
        dateObj.setHours(Number(timeArr[0]));
        dateObj.setMinutes(Number(timeArr[1]));
    }
    function empty(obj) {
        for (k in obj) {
            delete obj[k];
        }
    }
    function clean(obj) {
        for (k in obj) {
            if (k.charAt(0) === '$') {
                delete obj[k];
            }
        }
        return obj;
    }
    function findById(arr, id) {
        for (i = 0; i < arr.length; i++) {
            if (arr[i].$id === id) {
                return arr[i];
            }
        }
        return null;
    }
    function edit(id) {
        event = id ? findById(events, id) : events[0];
        if (id && events[0].$creating) {
            events.shift();
        }
        for (i = 0; i < events.length; i++) {
            events[i].$editor = false;
        }
        event.$editor = true;
        event.startDate = event.startDate ? event.startDate instanceof Date ? event.startDate : new Date(event.startDate) : today;
        empty(eventUpd);
        angular.extend(eventUpd, emptyEvent, event);
    }
    function cancel(id) {
        event = id ? findById(events, id) : events[0];
        event.$editor = false;
        if (events[0].$creating) {
            events.shift();
        }
    }

    $scope.today = today.getTime();
    $scope.events = events;
    $scope.calendar = calendar;
    $scope.eventUpd = eventUpd;

    $scope.newEvent = function() {
        events.unshift({$creating: true});
        edit()
    };

    $scope.edit = edit;

    $scope.cancel = cancel;

    $scope.create = function() {
        setTime(eventUpd.startDate, eventUpd.startTime);
        newDateId = eventUpd.startDate.getFullYear() + '-' + (eventUpd.startDate.getMonth() + 1);
        tempDate = eventUpd.startDate;

        date = new Date();
        eventUpd.date = date.getTime();
        eventUpd.startDate = tempDate.getTime();
        eventUpd.owner = Auth.$current.user.id;
        clean(eventUpd);

        eventId = Event.addWithId(eventUpd);
        events.$child(eventId).$set(eventUpd);
        Calendar.addByKey(eventId, eventUpd, {date: newDateId, type: 'events'});

        eventUpd.startDate = tempDate;
        cancel();
    };

    $scope.save = function(id){
        event = id ? findById(events, id) : events[0];

        setTime(eventUpd.startDate, eventUpd.startTime);
        oldMonth = event.startDate.getMonth() + 1;
        newMonth = eventUpd.startDate.getMonth() + 1;
        oldYear  = event.startDate.getFullYear();
        newYear  = eventUpd.startDate.getFullYear();
        oldDateId = oldYear + '-' + oldMonth;
        newDateId = newYear + '-' + newMonth;

        tempDate = eventUpd.startDate;
        eventUpd.startDate = tempDate.getTime();
        clean(eventUpd);

        event = events.$child(id);
        angular.extend(event, eventUpd);
        event.$save();

        event = Event.get({id: id});
        angular.extend(event, eventUpd);
        event.$save();

        event = Calendar.get({date: oldDateId, type: 'events'}).$child(id);
        angular.extend(event, eventUpd);
        if (newDateId === oldDateId) {
            event.$save();
        } else {
            newEvent = angular.copy(event);
            clean(newEvent);
            Calendar.addByKey(id, newEvent, {date: newDateId, type: 'events'});
            event.$remove();
        }

        eventUpd.startDate = tempDate;
        cancel(id);
    };

    $scope.remove = function (id){
        event = id ? findById(events, id) : events[0];
        oldMonth = event.startDate.getMonth() + 1;
        oldYear  = event.startDate.getFullYear();
        oldDateId = oldYear + '-' + oldMonth;

        events.$child(id).$remove();
        Event.remove({id: id});
        Calendar.get({date: oldDateId, type: 'events'}).$child(id).$remove();

        cancel(id);
    };
});