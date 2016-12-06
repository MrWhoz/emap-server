var i = localStorage.getItem("temp");
    console.log(i);
    var array = i.split(',');
    console.log(array);
    document.getElementById('oldnodeid').value = array[0];
    document.getElementById('oldnodeid').disabled = true;
    
    // console.log(i[0]);

    function replacingnode(){
      var newnodeid = document.getElementById("newnodeid").value;

      // var lat = document.getElementById("lat").value;
    
      // var lng = document.getElementById("lng").value;
    
      // var phone = document.getElementById("phone").value;
      window.location.replace("/replace?node="+array[0]+"&node_new="+newnodeid);
    }