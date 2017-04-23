function myMap() {
  var latlng = new google.maps.LatLng(59.9691500, 30.3159592);
  var options = {
    mapTypeId: google.maps.MapTypeId.ROADMAP, // This value can be set to define the map type ROADMAP/SATELLITE/HYBRID/TERRAIN
    // disableDefaultUI: false,
    zoom: 17, // This number can be set to define the initial zoom level of the map
    center: latlng,
    zoomControl: true,
    scaleControl: true,
    disableDefaultUI: true,

    mapTypeControl: false,

    scrollwheel: false,
    fullscreenControl: false,

    // zoomControlOptions: {
    //     position: google.maps.ControlPosition.LEFT_CENTER
    // },
    streetViewControl: false,

    styles: [{
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{
        "color": "#dedede"
      }, {
        "lightness": 88
      }]
    }, {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [{
        "color": "#dedede"
      }, {
        "lightness": 21
      }]
    }, {
      "elementType": "labels.text.stroke",
      "stylers": [{
        "visibility": "on"
      }, {
        "color": "#ffffff"
      }, {
        "lightness": 16
      }]
    }, {
      "elementType": "labels.text.fill",
      "stylers": [{
        "saturation": 36
      }, {
        "color": "#333333"
      }, {
        "lightness": 40
      }]
    }, {
      "elementType": "labels.icon",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [{
        "color": "#f2f2f2"
      }, {
        "lightness": 19
      }]
    }, {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [{
        "color": "#fefefe"
      }, {
        "lightness": 20
      }]
    }, {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [{
        "color": "#fefefe"
      }, {
        "lightness": 17
      }, {
        "weight": 1.2
      }]
    }]
  };
  var map = new google.maps.Map(document.getElementById('googleMap'), options);

  // Define Marker properties
  var image = new google.maps.MarkerImage('../img/map-logo.png',
    // This marker is 129 pixels wide by 42 pixels tall.
    new google.maps.Size(125, 75),
    // The origin for this image is 0,0.
    new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at 18,42.
    new google.maps.Point(18, 42)
  );

  // Add Marker
  var marker1 = new google.maps.Marker({
    position: new google.maps.LatLng(59.9692200, 30.3165000),
    map: map,
    icon: image // This path is the custom pin to be shown. Remove this line and the proceeding comma to use default pin
  });

  // Add listener for a click on the pin
  google.maps.event.addListener(marker1, 'click', function () {
    infowindow1.open(map, marker1);
  });

  // Add information window
  var infowindow1 = new google.maps.InfoWindow({
    content: createInfo('КДЦ  "Club House"', 'пр. Медиков, 3 к.1, г. Санкт-Петербург<br />')
  });

  infowindow1.open(map, marker1);

  function createInfo(title, content) {
    return '<div class="infowindow"><h4>' + title + '</h4>' + content + '</div>';
  }
}

$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();
  $('.navbar a, footer a[href=\'#myPage\']').on('click', function (event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 900, function () {
        window.location.hash = hash;
      });
    }
  });
  $('.register').magnificPopup({
    mainClass: 'register-frame',
    items: {
      src: 'register.html'
    },
    type: 'iframe'
  });
});


function openVideo() {
  $.magnificPopup.open({
    items: {
      src: 'https://vimeo.com/163001915'
    },
    type: 'iframe'
  });
}