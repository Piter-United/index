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

    $('#topmenu .ui.container a').click(function() {
      var target_id = $(this).attr('href');
      target_id = target_id.substring(1);      
      var target_y = $('#'+target_id).offset().top;      
      $('html, body').animate({
          scrollTop: target_y - 70
      }, 2000);
      return false;
    });

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