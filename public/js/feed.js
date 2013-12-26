// McQueen 12/25/13: this would be a lot cleaner in AngularJS. 
// Porting it is probably a project for a later date though.

// Edit 12/25/13: Using handlebars.js as a partial fix

$(function(){

  // immediately grab images when pages loads
  $.get("/images/" + $('#searchbar').val(), function(data) {    
    populate(data)
  });

  // bind search bar to image grabbing for later
  $('#searchbar').bind('keypress', function(e) {
    if(e.keyCode==13){
      $.get("/images/" + $('#searchbar').val(), function(data) {    
        populate(data)
      });
    }
  });

  /*
   * populate
   * Formats and appends images to the DOM
   *
   * @param {JSON object} images - Images object from the backend
   */
  function populate(images) {

    // endless scrolling
    $(window).endlessScroll({
      inflowPixels: 10,     
      insertAfter: true,
      content: function(p) {
        $('#feed').append('<div class="img masonry-brick" id="id2" data-id="589845859648605344_214781474" data-hashtag="sunrise" data-user="undefined" data-status="" style="background-image: url(http://blog.heartland.org/wp-content/uploads/2013/07/Google.jpg); width: 80px; height: 80px; background-size: 80px; position: absolute; top: 0px; left: 160px; background-position: initial initial; background-repeat: initial initial;"><div class="img-layer" style="width: 80px; height: 80px; font-size: 15px; display: none;"><div class="icon ion-minus-circled"> </div> <div class="icon ion-ios7-plus"> </div></div></div>');
        $('#feed').masonry('reload');
      }
    });

    // remove all old images, if they exist
    var img = $('.img');
    if (img != null) {
      $('.img').remove();
    }

    appendImagesToDom(images);

    setupJQueryEffects()
  
  }

  /* image dimension helper */
  function getDim(size) {
    if (size == 1) {
      return 80;
    } else if (size == 2) {
      return 160;
    } else if (size == 3) {
      return 320;
    }
  }

  /* font dimension helper */
  function getFontDim(size) {
    if (size == 1) {
      return 15;
    } else if (size == 2 ) {
      return 30;
    } else if (size == 3 ) {  
      return 60;
    }
  }

  /*
    * appendImagesToDom
    * Update the images object and display it on the DOM with handlebars
    * 
    * @param {list of JSON images from backend} images -- image for rendering, formatting 
    *   in HTML and appending to the DOM
    */
  function appendImagesToDom(images) {

    // @TODO: do this on the server side
    // add hashtag and dim attributes to each image
    for (var i in images) {
      images[i].hashtag = $('#searchbar').val();
      images[i].dim = getDim(images[i].size);
      images[i].fontDim = getFontDim(images[i].size);
    }
    
    // send data to the img template
    var source = $("#img-template").html();
    var template = Handlebars.compile(source);
    var data = {images: images};

    // append image templates to the DOM
    $("#feed").html(template(data));

    // reload masonry tiling
    $('#feed').masonry('reload');

  }

  /*
   * setupJQueryEffects
   * Setup handlers for hovering, modals and AJAX upvoting and downvoting 
   */
  function setupJQueryEffects() {

    var UPVOTE_COLOR = "#36F343";
    var DOWNVOTE_COLOR = "#FF5757";

    // hover effects
    $('.img').mouseenter(function(e) {
        e.preventDefault();        
        $(this).children().show();
      });
    $('.img').mouseleave(function(e) {
      e.preventDefault();
      $(this).children().hide();
    });

    // @TODO: we need a better way to track voting than with this boolean
    var vote = false;

    // upvote handler
    $('.ion-ios7-plus').on('click', function(e) {
      e.preventDefault();   
      // only allow one vote
      if (!vote) {
        $(this).css('color', UPVOTE_COLOR);   
        var id = $(this).closest('.img').attr('data-id');   
        $.post("/vote", {id : id, vote: 1});
        vote = true;
      }
    });

    // downvote handler    
    $('.icon.ion-minus-circled').on('click', function(e) {
      e.preventDefault();   
      // only allow one vote
      if (!vote) {
        $(this).css('color',DOWNVOTE_COLOR);  
        var id = $(this).closest('.img').attr('data-id');
        $.post("/vote", {id : id, vote: 0});
        vote = true;
      }
    });

    // modal handler
    $(".img").on('click', function(e) {
      e.preventDefault();

      // make sure we don't open modal on vote
      if (!vote) {
        if ($(".modal-img") != null) {
          $(".modal-img").remove();
        }
        
        // show the modal
        $("#img-modal").modal("show");

        // send data to the modal template
        var source = $("#modal-template").html();
        var template = Handlebars.compile(source);
        var data = {url: $(this).attr('largeRes')};

        // append image templates to the DOM
        $(".modal-body").append(template(data));
         
      }

      vote = false;
    });  
  }

// closure close
});    
