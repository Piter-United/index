$(document)
  .ready(function() {
    // fix menu when passed
    $('#firstslide')
      .visibility({
        once: false,
        onBottomPassed: function() {
          $('#topmenu').transition('fade in');
        },
        onBottomPassedReverse: function() {
          $('#topmenu').transition('fade out');
        }
      })
    ; 


       

    $('.communities.column').click(function() {
      $('#programme')
      .modal('show')
      ;
      return false;
    });

    $('.ui.embed').embed(); 

    $('.photos .image')
      .dimmer({
        on: 'hover'        
      });  

    $('.photos .image').click(function() {      
      var src = $(this).find('img').attr('src');
      $('#photo').find('img').attr('src', src);
      $('#photo').modal('setting', 'transition', 'scale').modal('show');
      return false;
    });              
  })
;