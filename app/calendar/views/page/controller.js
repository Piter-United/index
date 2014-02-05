app.controller('CalendarPageCtrl', function($scope, $objToArr, Calendar) {
    var calendar = {},
        msInDay = 86400000,
        today = new Date(),
        todayFullYear = today.getFullYear(),
        todayMonth = today.getMonth(),
        todayDate = today.getDate(),
        monthNames = [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь'
        ],
        dayNames = [
            'Понедельник',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятница',
            'Суббота',
            'Воскресенье'
        ];

    calendar.thisMonth = todayMonth;
    calendar.thisYear = todayFullYear;

    function setMonth() {
        var i, currentWeek, countDate, countMonth, startDate, otherMonth, countDateNumber,
            dateEvents = [],
            thisDate = new Date(calendar.thisYear, calendar.thisMonth),
            thisDateDay = thisDate.getDay(),
            dateTimeCounter = (new Date(thisDate.getTime()-msInDay*thisDateDay)).getTime(),
            dateId = thisDate.getFullYear() + '-' + (thisDate.getMonth() + 1);

        var events = $objToArr(Calendar.get({date: dateId, type: 'events'}));
        calendar.month = [];

        while (true) {
            currentWeek = calendar.month.push([])-1;
            for (i = 0; i < 7; i++) {
                dateTimeCounter += msInDay;
                countDate = new Date(dateTimeCounter);
                countMonth = countDate.getMonth();
                countDateNumber = countDate.getDate();
                otherMonth = countMonth !== calendar.thisMonth;

                if (!otherMonth) {
                    dateEvents[countDateNumber] = [];
                }
                calendar.month[currentWeek].push({
                    $date: countDate,
                    $isToday: countDate.getFullYear() === todayFullYear && countDate.getMonth() === todayMonth && countDate.getDate() === todayDate,
                    $fullDate: countDate.toLocaleDateString(),
                    $otherMonth: otherMonth,
                    events: dateEvents[countDateNumber]
                });
            }
            if (countMonth !== calendar.thisMonth) {
                break;
            }
        }
        i = 0;
        events.$on('change', function(){
            if (events[i]) {
                startDate = new Date(events[i].startDate);
                dateEvents[startDate.getDate()].push(events[i]);
                i++;
            }
        })
    }
    setMonth();

    $scope.calendar = calendar;
    $scope.monthNames = monthNames;
    $scope.dayNames = dayNames;

    $scope.nextMonth = function() {
        calendar.thisMonth = calendar.thisMonth < 11 ? calendar.thisMonth + 1 : 0;
        calendar.thisYear = calendar.thisMonth ? calendar.thisYear : calendar.thisYear + 1;
        setMonth();
    };
    $scope.prevMonth = function() {
        calendar.thisMonth = calendar.thisMonth > 0 ? calendar.thisMonth - 1 : 11;
        calendar.thisYear = calendar.thisMonth !== 11 ? calendar.thisYear : calendar.thisYear - 1;
        setMonth();
    }
});