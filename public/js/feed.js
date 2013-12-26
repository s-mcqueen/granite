// McQueen 12/25/13: this would be a lot cleaner in AngularJS. 
// Porting it is probably a project for a later date though.

// Edit 12/25/13: Using handlebars.js as a partial fix

$(function(){

  // placeholder to keep track of image pagination
  var imageScrollTimestamp = 0;

  // immediately grab images when pages loads
  $.get("/images/" + $('#searchbar').val(), function(data) {    
    populate(data)
  });

  // bind search bar to image grabbing for later
  $('#searchbar').bind('keypress', function(e) {
    if(e.keyCode==13){
      $.get("/images/" + $('#searchbar').val(), function(data) {    
        imageScrollTimestamp = 0; // reset timestamp
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

    // remove all old images, if they exist
    var img = $('.img');
    if (img != null) {
      $('.img').remove();
    }

   // if new search, append first page of images to the DOM
   if (imageScrollTimestamp === 0) {
      // grab only the first 20 images
      images = images.slice(0,20);

      imageScrollTimestamp = images[images.length - 1].timestamp;

      appendImagesToDom(images);

      setupJQueryEffects()
    } 

        // endless scrolling
    $(window).endlessScroll({
      inflowPixels: 1000,     
      insertAfter: false,
      content: function(p) {
        if (imageScrollTimestamp !== 0) {

          var newImages = [],
              newTimestamp = imageScrollTimestamp + 30000;

          // append images with specified timestamp criteria
          for (var i in images) {
            if (images[i].timestamp < newTimestamp && images[i].timestamp > imageScrollTimestamp) {
              newImages.append(images[i]);
            }
          }

          imageScrollTimestamp = newTimestamp;
          images = newImages;
        }

        appendImagesToDom(images);

        setupJQueryEffects()
      }
    });
  
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
