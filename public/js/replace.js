var i = localStorage.getItem("temp");
    console.log(i);
    var array = i.split(',');
    console.log(array);
    document.getElementById('oldnodeid').value = array[0];
    document.getElementById('oldnodeid').disabled = true;
