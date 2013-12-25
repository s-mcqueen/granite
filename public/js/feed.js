$(function(){

  // search bar
  $('#searchbar').bind('keypress', function(e) {
    if(e.keyCode==13){
      $.get("/images/" + $('#searchbar').val(), function(data) {    
        console.log( "Load was performed." );    
      }).done(populate);
    }
  });

  // grab image data
  $.get("/images/" + $('#searchbar').val(), function(data) {    
    console.log( "Load was performed." );    
  }).done(populate);

  // populates the image feed
  function populate(data) {

    // endless scrolling
    $(window).endlessScroll({
      inflowPixels: 10,     
      insertAfter: true,
      content: function(p) {
        $('.feed').append('<div class="img masonry-brick" id="id2" data-id="589845859648605344_214781474" data-hashtag="sunrise" data-user="undefined" data-status="" style="background-image: url(http://blog.heartland.org/wp-content/uploads/2013/07/Google.jpg); width: 80px; height: 80px; background-size: 80px; position: absolute; top: 0px; left: 160px; background-position: initial initial; background-repeat: initial initial;"><div class="img-layer" style="width: 80px; height: 80px; font-size: 15px; display: none;"><div class="icon ion-minus-circled"> </div> <div class="icon ion-ios7-plus"> </div></div></div>');
        $('.feed').masonry( 'reload' );
      }
    });

    var img = $('.img');
    if (img != null) {
      $('.img').remove();
    }

    // iterate through image objects and append to DOM
    var num_img = data.length;
    for (var i = 0; i < num_img; i++) {
      
      // edit the template with the img metadata
      var url = data[i].url,
          id = data[i].id,
          hashtag = $('#searchbar').val();
          user = data[i].user,
          status = data[i].status;

      // get img and font dims
      var dim = getDim(data[i].size),
          fontDim = getFontDim(data[i].size);

      var style= "style='background: url(\"" + url + "\"); width:" + dim + "px; height:" + dim + "px; background-size:" + dim + "px " + dim + "px;'>"      

      var templ = "<div class='img' id='id" + i + "' data-id='" + id + "' data-hashtag='" + hashtag + "' data-user='" + user + "' data-status='" + status + "'" + style +                    
                    "<div class='img-layer' style= 'width:" + dim + "px; height: " + dim + "px; font-size:" + fontDim + "px;'>" + 
                      "<div class='icon ion-minus-circled'> </div> " +
                      "<div class='icon ion-ios7-plus'> </div>" +                  
                    "</div>" +
                  "</div>";


      // append the img templ to feed
      $('.feed').append(templ);
    }

    $('.feed').masonry( 'reload' );

    // after this is finishes, enable hover effects
    $('.img').mouseenter(function(e) {
        e.preventDefault();        

        $(this).children().show()
        console.log("here");
      });

    $('.img').mouseleave(function(e) {
      e.preventDefault();

      $(this).children().hide()
      console.log("here");
    });

    var vote = false;

    // upvote
    $('.ion-ios7-plus').on('click', function(e) {
      e.preventDefault();   

      vote = true;

      var id = $(this).closest('.img').attr('data-id');   

      $(this).css('color','#36F343');   

      $.post("/vote", {id : id, vote: 1});
    });

    // downvote
    $('.icon.ion-minus-circled').on('click', function(e) {
      e.preventDefault();   

      vote = true;

      var id = $(this).closest('.img').attr('data-id');

      $(this).css('color','#FF5757');  

      $.post("/vote", {id : id, vote: 0});
    });

    // modal
    $(".img").on('click', function(e) {
      e.preventDefault();

      if (vote == false) {


        if ($(".modal-img") != null) {
          $(".modal-img").remove();
        }

        var url = $(this).attr('style').split("url(")[1].split(")")[0];
        var tempUrl = "<div class='modal-img' style='background: url(\"" + url + "\"); width: 600px; height: 600px;'>" +
                      "</div>";    

        $("#img-modal").modal("show");

        $('.modal-body').append(tempUrl);           

      }

      vote = false;
    });
    
  }



    function getDim(size) {
      if (size == 1) {
        return 80;
      } else if (size == 2 ) {
        return 160;
      } else if (size == 3 ) {
        return 320;
      }
    }

    function getFontDim(size) {
      if (size == 1) {
        return 15;
      } else if (size == 2 ) {
        return 30;
      } else if (size == 3 ) {  
        return 60;
      }
    }

});    