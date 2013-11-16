$(function(){
	$('.img').mouseenter(function(e) {
		e.preventDefault();

		$('.img-layer').show();		

  });

  $('.img').mouseleave(function(e) {
		e.preventDefault();

		$('.img-layer').hide();		

  });


});