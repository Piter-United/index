function OldCommunitiesCntl($scope, $http, $routeParams) {
  var url = "https://spreadsheets.google.com/feeds/list/0AhI9eP7t1xJedGg3VFVnbHBJUFBsQ1FONDN5WUY5dFE/1/public/values?alt=json-in-script&callback=JSON_CALLBACK";
  $http.jsonp(url).success(function(data){
    $scope.communities = data.feed.entry.map(function(item){
      // console.log(item);
      var comm = {}
      for(var key in item) {
        // console.log(key);
        if(key.match(/^gsx\$/)){
          attr = key.replace('gsx$','')
      comm[attr] = item[key].$t
        }
      }
      return comm;
    })
  });
}
