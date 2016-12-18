document.getElementById("contacttag").className = "active";
$(document).ready(function(){

    // Validation E-mail

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }


    var to,subject,text;
    $("#send_email").click(function(){  
      if(validateEmail($("#to").val())){
        document.getElementById("validation").innerHTML = "";
        to="Mail from" + $("#to").val();
        subject = to;
        text=$("#content").val();
        $("#message").text("Sending E-mail...Please wait!");
        $.get("/send",{to:to,subject:subject,text:text},function(data){
        if(data=='sent')
        {
          $("#message").empty().html("Email is been sent from "+ '<i style="color:red">'+$("#to").val()+'</i>'+" .Please check inbox!");
        }
      });
    }else{
      document.getElementById("validation").innerHTML = "Please enter valid E-mail!"
    }
      

    });
  });