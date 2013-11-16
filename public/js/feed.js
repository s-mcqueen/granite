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
      var templ = "<div class='img' id='id" + i + "' style='background: url(\"" + url + "\"); position: relative; width: 400px; height: 400px;'>" +
                    "<div class='img-layer' style= 'display:none; position: absolute; top: 0; left: 0; width: 400px; height: 400px; background-color: #666565; opacity:0.5; font-size: 60px;'>" + 
                      "<div class='icon ion-minus-circled' style='position: relative; left: 15%; top: 70%;'> </div> " +
                      "<div class='icon ion-ios7-plus' style='position: relative; left: 55%; top: 70%;'> </div>" +                  
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