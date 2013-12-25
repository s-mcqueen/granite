// McQueen 12/25/13: this would be a lot cleaner in AngularJS. 
// Porting it is probably a project for a later date though.

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
    // remove all old images, if they exist
    var img = $('.img');
    if (img != null) {
      $('.img').remove();
    }

    // append new images to DOM
    for (var i in images) {
      appendImageToDom(images[i])
    }

    // reload masonry tiling
    $('.feed').masonry( 'reload' );

    setupJQueryEffects()
  }

  /*
   * appendImageToDom
   * Render an image correctly in HTML and append it to the DOM.
   * 
   * @param {JSON image from backend} image -- image for rendering, formatting 
   *   in HTML and appending to the DOM
   */
  function appendImageToDom(image) {
    var url = image.url,
        largeRes = image.largeRes,
        id = image.id,
        hashtag = $('#searchbar').val();
        user = image.user,
        status = image.status;

    // get img and font dimensions
    var dim = getDim(image.size),
        fontDim = getFontDim(image.size);

    var style= "style='background: url(\"" + url + "\"); width:" + dim + "px; height:" + dim + "px; background-size:" + dim + "px " + dim + "px;'>"      

    // @TODO: Fix this HTML sting. JESUS CHRIST.
    var templ = "<div class='img' largeRes='" + largeRes + "' data-id='" + id + "' data-hashtag='" + hashtag + "' data-user='" + user + "' data-status='" + status + "'" + style +                    
                  "<div class='img-layer' style= 'width:" + dim + "px; height: " + dim + "px; font-size:" + fontDim + "px;'>" + 
                    "<div class='icon ion-minus-circled'> </div> " +
                    "<div class='icon ion-ios7-plus'> </div>" +                  
                  "</div>" +
                "</div>";

    $('.feed').append(templ);
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
   * setupJQueryEffects
   * Setup handlers for hovering, modals and AJAX upvoting and downvoting 
   */
  function setupJQueryEffects() {

    var UPVOTE_COLOR = "#36F343"
    var DOWNVOTE_COLOR = "#FF5757"

    // hover effects
    $('.img').mouseenter(function(e) {
        e.preventDefault();        
        $(this).children().show()
      });
    $('.img').mouseleave(function(e) {
      e.preventDefault();
      $(this).children().hide()
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
        
        // @TODO: we need a better way to get modal url than reading the DOM
        // Also the HTML string...
        var largeRes = $(this).attr('largeRes')
        var tempUrl = "<div class='modal-img' style='background: url(\"" + largeRes + "\");" +
                      "width: 600px; height: 600px;'>" +
                      "</div>";    

        $("#img-modal").modal("show");
        $('.modal-body').append(tempUrl);           
      }

      vote = false;
    });  
  }

// closure close
});    
