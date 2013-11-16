$(function(){

  var templ = "<div class=\"img\" style=\"background: url('/img/hack.png'); position: relative; width: 400px; height: 400px;\">" +
                "<div class=\"img-layer\" style= \"display:none; position: absolute; top: 0; left: 0; width: 400px; height: 400px; background-color: #666565; opacity:0.5; font-size: 60px;\">" + 
                  "<div class=\"icon ion-minus-circled\" style=\"position: relative; left: 15%; top: 70%;\"> </div> " +
                  "<div class=\"icon ion-ios7-plus\" style=\"position: relative; left: 55%; top: 70%;\"> </div>" +                  
                "</div>" +
              "</div>";

  // grab image data
  $.get("/update", function(data) {    
    console.log( "Load was performed." );    
  }).done(populate);

  // populates the image feed
  function populate(data) {

    // edit the template with the img metadata
    


    // iterate through image objects and append to DOM
    var num_img = null;
    for (var i = 0; i < num_img; i++) {
      $('.img').append(templ);
    }



  }



});    