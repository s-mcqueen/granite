$(function(){

  // grab image data
  $.get("/images", function(data) {    
    console.log( "Load was performed." );    
  }).done(populate);

  // populates the image feed
  function populate(data) {

    // iterate through image objects and append to DOM
    var num_img = data.length;
    for (var i = 0; i < num_img; i++) {
      
      // edit the template with the img metadata
      var url = data[i].url;
      var templ = "<div class='img' id='id" + i + "' style='background: url(\"" + url + "\"); width: 400px; height: 400px;'>" +
                    "<div class='img-layer' style= 'width: 400px; height: 400px;'>" + 
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

  }

});    