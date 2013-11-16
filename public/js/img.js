$(function(){

  var $container = $('.feed');

  // initialize masonry
  $container.masonry({
    columnWidth: 0,
    gutterWidth: 0,
    itemSelector: '.img',
    isFitWidth: true
  });

  var msnry = $container.data('masonry');

});