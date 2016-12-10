$('.message a').click(function() {
    $('form').animate({
        height: "toggle",
        opacity: "toggle"
    }, "slow");

});

function checkLogin() {
  var user = null;
    $.ajax({
        url: '/isLogged',
        type: 'GET',
        dataType: "json",
        success: function(data) {
            console.log('this is data', data);
            if (data.username) {
                var strtmp = '<li data-toggle="modal" data-target="#myModal1" id="modalbox"> <a href="#">' + data.username + '</a></li>';
                console.log(strtmp);
                $("#name").html(data.name)
                $("#navbar").append('<li data-toggle="modal" data-target="#myModal1" id="modalbox"> <a href="#">' + data.username + '</a></li>')
                getData(data);
            } else {
                $("#navbar").append('<li data-toggle="modal" data-target="#myModal" id="modalbox"><a href="#" id="user">LOGIN</a></li>')
            }
        }
    });
    function getData(data){
      user = data;
    }
    return user;
};
