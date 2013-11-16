$(function(){
  $('.img').mouseenter(function(e) {
    e.preventDefault();

    $('.img-layer').show();
    console.log("here");
  });

  $('.img').mouseleave(function(e) {
    e.preventDefault();

    $('.img-layer').hide();
    console.log("here");
  });
});