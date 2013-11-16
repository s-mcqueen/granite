
$(function() {

  // the offset for the sticky div
  var sticky_offset_top = $('#sticky').offset().top;

  var sticky = function() {
    var scroll_top = $(window).scrollTop();
    if (scroll_top > sticky_offset_top) { 
      $('#sticky').css({ 'position': 'fixed', 'top':0, 'left':0 });
    } else {
      $('#sticky').css({ 'position': 'relative' }); 
    }   
  };
  
  // run file on load   
  sticky();
     
  // run again on every scroll
  $(window).scroll(function() {
    sticky();
  });
});
