$(function(){

  var $container = $('.feed');

  // initialize masonry
  $container.masonry({
    columnWidth: 200,
    itemSelector: '.img'
  });

  var msnry = $container.data('masonry');

});