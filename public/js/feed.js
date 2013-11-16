$(function(){

  // sample hashtag, change later
  var tag = "lasvegasstrip"; 

  // grab image data
  $.get("/images/" + tag, function(data) {    
    console.log( "Load was performed." );    
  }).done(populate);

  // populates the image feed
  function populate(data) {

    // iterate through image objects and append to DOM
    var num_img = data.length;
    for (var i = 0; i < num_img; i++) {
      
      // edit the template with the img metadata
      var url = data[i].url;
      var id = data[i].id;
      var templ = "<div class='img' id='id" + i + "' data-id='" + id + "' style='background: url(\"" + url + "\"); width: 320px; height: 320px;'>" +
                    "<div class='img-layer' style= 'width: 320px; height: 320px;'>" + 
                      "<div class='icon ion-minus-circled'> </div> " +
                      "<div class='icon ion-ios7-plus'> </div>" +                  
                    "</div>" +
                  "</div>";    

      // append the img templ to feed
      $('.feed').append(templ);
    }

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

    // upvote
    $('.ion-ios7-plus').on('click', function(e) {
      e.preventDefault();   

      var id = $(this).closest('.img').attr('data-id');      

      $.post("/vote", {id : id, vote: 1});
    });

    // downvote
    $('.icon.ion-minus-circled').on('click', function(e) {
      e.preventDefault();   

      var id = $(this).closest('.img').attr('data-id');

      $.post("/vote", {id : id, vote: 0});
    });

    $(".img").on('click', function(e) {
      e.preventDefault();

      var url = $(this).attr('style').split("url(\"")[1].split("\"")[0]; 
      var tempUrl = "<div class='modal-img' style='background: url(\"" + url + "\"); width: 600px; height: 600px;'>" +
                    "</div>";    

      $("#img-modal").modal("show");

      $('.modal-body').append(tempUrl);
    });

  }

});    