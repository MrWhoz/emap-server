var i = localStorage.getItem("temp");
    console.log(i);
    var array = i.split(',');
    console.log(array);
    document.getElementById('nodeid').value = array[0];
    document.getElementById('nodeid').disabled = true;
    document.getElementById('lat').value = array[1];
    document.getElementById('lng').value = array[2];
    document.getElementById('phone').value = array[3];
    // console.log(i[0]);

    function updatingnode(){
      var node_id = document.getElementById("nodeid").value;
      var lat = document.getElementById("lat").value;

      var lng = document.getElementById("lng").value;

      var phone = document.getElementById("phone").value;
      //window.location.replace("/updatenode?node="+nodeid+"&lat="+lat+"&lng="+lng+"&phone="+phone);
      $.ajax({
          type: "POST",
          url: '/updatenode',
          data: {
              'node_id': node_id,
              'lat': lat,
              'lng': lng,
              'phone': phone
          },
          dataType: 'json',
          success: function(response) {
              // you will get response from your php page (what you echo or print)
              console.log(response);
          },
          error: function(jqXHR, textStatus, errorThrown) {
              console.log(textStatus, errorThrown);
          }
      });
    }