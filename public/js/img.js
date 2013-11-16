$(function(){

  // upvote
  $('.ion-ios7-plus').on('click', function(e) {
    e.preventDefault();   

    var id = null;

    data = [id, 1];

    // $.post("/vote",function(data,status) {
    //   alert("Data: " + data + "\nStatus: " + status);
    // });
  });

  // downvote
  $('.icon.ion-minus-circled').on('click', function(e) {
    e.preventDefault();   


    var id = null;

    data = [id, 0];

    // $.post("vote",function(data,status) {
    //   alert("Data: " + data + "\nStatus: " + status);
    // });
  });

});