var map;
var markers = [];
var tempmarkers = [];
var NodeID = [];
var lat = [];
var lng = [];
var phone = [];
var temp;
var circle = [];
var CoEveNumber = [];
var DustEveNumber = [];
var TempEveNumber = [];
var GasEveNumber = [];
// get data
var nodeNumber;
document.getElementById("hometag").className = "active";
$.ajax({
    type: "GET",
    url: "/node/getinfo?list=1&status=1", // <-- Here
    dataType: "json",
    success: function(data) {

        myVariable = data;
        count = Object.keys(myVariable).length;
        nodeNumber = count;
        // console.log(count);
        for (var i = 0; i < count; i++) {
            NodeID.push(Number(myVariable[i].node_id));
            lat.push(Number(myVariable[i].location.lat));
            lng.push(Number(myVariable[i].location.lng));
            phone.push(Number(myVariable[i].phone));

        }

        temp = lat.length;
        // document.getElementById("nodeactive").innerHTML = '<i class="fa fa-list" aria-hidden="true"></i>' +'<span style="color:red;">Node Active:      </span>'  + '<a href="#">' + temp + '</a>' + '<span style="color:red;">' + "(" + '<i class="fa fa-hand-o-left" aria-hidden="true"></i>' + "Click here for Node Info" + ")" + '</span>';
        function call() {
            var table = document.getElementById("list");
            if (table != null) {
                for (var i = 0; i < table.rows.length; i++) {
                    // do update
                    table.rows[i].cells[0].className = 'color1';
                    table.rows[i].cells[2].className = 'color2';
                    table.rows[i].cells[3].className = 'color3';

                    //   table.rows[i].cells[5].onclick = function () {
                    //       tableText(this);
                    //   };
                    // // do replace
                    // table.rows[i].cells[6].onclick = function () {
                    //     tableText1(this);
                    // };
                }
            }
        }

        function drowtable() {
            for (var i = 0; i < NodeID.length; i++) {
                var rows = "";
                var link = "http://www.codingyourfuture.com/graph?id=" + NodeID[i];
                console.log(link);
                rows += "<tr><td>" + NodeID[i] + "</td><td>" + lat[i] + "</td><td>" + lng[i] + "</td><td>" + phone[i] + "</td><td>" + "1" + "</td><td>" + '<a href="' + link + '">' + "View" + '</a>' + "</td><td>" + "</td></tr>";

                $(rows).appendTo("#list tbody");
            }
            call();
        }
        drowtable();
        initMap();
    }

});

function initMap() {
 

    // console.log(temp);

    var j = [];
    var t = [];
    var z = [];
    for (var i = 0; i < temp; i++) {
        j.push(parseFloat(lat[i]));
        t.push(parseFloat(lng[i]));
        z.push(parseInt(NodeID[i]));
    }
    // console.log(j);

    if (temp > 1) {
        var lat_lng = {
            lat: j[0],
            lng: t[0]
        };
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            center: lat_lng,
            mapTypeId: google.maps.MapTypeId.roadmap
        });
        addMarker(lat_lng, z[0]);
        for (var i = 1; i < temp; i++) {
            var lat_lng = {
                lat: j[i],
                lng: t[i]
            };
            addMarker(lat_lng, z[i]);
        }
    } else {
        var lat_lng = {
            lat: 10.773283,
            lng: 106.657639
        };

        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            center: lat_lng,
            mapTypeId: google.maps.MapTypeId.roadmap
        });

        // // This event listener will call addMarker() when the map is clicked.
        // map.addListener('click', function(event) {
        //   addMarker(event.latLng);
        // });

        // Adds a marker at the center of the map.
        addMarker(lat_lng, 1);
    }
}

function addMarker(location, nodeid) {
    var marker = new google.maps.Marker({
        position: location,
        map: map

    });
    var temp = markers.length;
    addInfoWindow(marker, nodeid);

    markers.push(marker);
    if (temp == 0) {
        for (var i = 0; i < markers.length; i++) {
            circle[i] = new google.maps.Circle({
                map: map,
                radius: 1200,
                fillColor: '#5EAEDC'
            });
            circle[i].bindTo('center', markers[i], 'position');
        }
    } else {
        for (var i = temp; i < markers.length; i++) {
            circle[i] = new google.maps.Circle({
                map: map,
                radius: 1200,
                fillColor: '#5EAEDC'
            });
            circle[i].bindTo('center', markers[i], 'position');
        }
    }


}

function addInfoWindow(marker, message) {
    var temp = "/graph?id=" + message;
    var static = "/static";

    var infoWindow = new google.maps.InfoWindow({
        content: "Node: " + message + '<br/>' + '<a href="' + temp + '">' + "View Graph" + '</a>' + '<br/>' + '<a href="' + static + '">' + "View Static" + '</a>'
            // stastic later----------------
    });

    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker);
    });
}



function addmarker() {
    alert("Click in google map for direct adding node!")
    document.getElementById("addmarker").style.color = "blue";
    var tempNode = document.getElementById("newNodeid").value;
    var newNode = parseInt(tempNode);
    var tempPhone = document.getElementById("newPhone").value;
    var newPhone = parseInt(tempPhone);
    console.log(newPhone);
    map.addListener('click', function(event) {
        var i = temp;

        i++;
        temp++;
        var phone = newPhone;

        nodeNumber = newNode;
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();
        addMarker(event.latLng, nodeNumber);
        // alert(event.latLng.lat());
        //TODO
        $.ajax({
            type: "POST",
            url: '/node/initnew',
            data: {
                'node_id': nodeNumber,
                'lat': lat,
                'lng': lng,
                'phone': phone
            },
            dataType: 'json',
            success: function(response) {
                // you will get response from your php page (what you echo or print)
                console.log(response);
                document.getElementById("addmarker").style.color = "black";
                google.maps.event.clearListeners(map, 'click');
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
        //window.location.replace("/initnew?node="+i+"&lat="+lat+"&lng="+len+"&phone="+phone);
    });


}
// Stop add markers
function stopAdd() {
    document.getElementById("addmarker").style.color = "black";
    google.maps.event.clearListeners(map, 'click');
}

function configMarkers() {
    window.location.href = "/node/config";
}

function clearOverlays(){
    for (var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
        circle[i].setMap(null);
        
    }
    markers.length = 0;
    
}


// TODO: Make a variable for field name CO, DUST, ....

function drawCoMarkers(Enumber,lat,lng,i){
    var lat_lng = {
        lat: lat,
        lng: lng
    };
    var marker = new google.maps.Marker({
        position: lat_lng,
        map: map

    });
    addInfoWindow(marker, i);
    markers.push(marker);
    var temp = markers.length;
    if(Enumber < 220){
        circle[temp-1] = new google.maps.Circle({
                map: map,
                radius: 1200,
                fillColor: '#65B853'
        });
        circle[temp-1].bindTo('center', markers[temp-1], 'position');
    }else if(Enumber >= 220 && Enumber < 240){
        circle[temp-1] = new google.maps.Circle({
                map: map,
                radius: 1200,
                fillColor: '#F9FF42'
        });
        circle[temp-1].bindTo('center', markers[temp-1], 'position');
    }
    else{
        circle[temp-1] = new google.maps.Circle({
                map: map,
                radius: 1200,
                fillColor: 'red'
        });
        circle[temp-1].bindTo('center', markers[temp-1], 'position');
    }
    
    
}

// create Dust markers
function drawDustMarkers(Enumber,lat,lng,i){
    var lat_lng = {
        lat: lat,
        lng: lng
    };
    var marker = new google.maps.Marker({
        position: lat_lng,
        map: map

    });
    addInfoWindow(marker, i);
    markers.push(marker);
    var temp = markers.length;
    if(Enumber < 0.3){
        circle[temp-1] = new google.maps.Circle({
                map: map,
                radius: 1200,
                fillColor: '#65B853'
        });
        circle[temp-1].bindTo('center', markers[temp-1], 'position');
    }else if(Enumber >= 0.3 && Enumber < 0.6){
        circle[temp-1] = new google.maps.Circle({
                map: map,
                radius: 1200,
                fillColor: '#F9FF42'
        });
        circle[temp-1].bindTo('center', markers[temp-1], 'position');
    }
    else{
        circle[temp-1] = new google.maps.Circle({
                map: map,
                radius: 1200,
                fillColor: 'red'
        });
        circle[temp-1].bindTo('center', markers[temp-1], 'position');
    }
    
    
}

// Draw Temp markers
function drawTempMarkers(Enumber,lat,lng,i){
    var lat_lng = {
        lat: lat,
        lng: lng
    };
    var marker = new google.maps.Marker({
        position: lat_lng,
        map: map

    });
    addInfoWindow(marker, i);
    markers.push(marker);
    var temp = markers.length;
    if(Enumber < 32){
        circle[temp-1] = new google.maps.Circle({
                map: map,
                radius: 1200,
                fillColor: '#65B853'
        });
        circle[temp-1].bindTo('center', markers[temp-1], 'position');
    }else if(Enumber >= 32 && Enumber < 35){
        circle[temp-1] = new google.maps.Circle({
                map: map,
                radius: 1200,
                fillColor: '#F9FF42'
        });
        circle[temp-1].bindTo('center', markers[temp-1], 'position');
    }
    else{
        circle[temp-1] = new google.maps.Circle({
                map: map,
                radius: 1200,
                fillColor: 'red'
        });
        circle[temp-1].bindTo('center', markers[temp-1], 'position');
    }
    
    
}

// Draw gas markers
function drawGasMarkers(Enumber,lat,lng,i){
    var lat_lng = {
        lat: lat,
        lng: lng
    };
    var marker = new google.maps.Marker({
        position: lat_lng,
        map: map

    });
    addInfoWindow(marker, i);
    markers.push(marker);
    var temp = markers.length;
    if(Enumber < 150){
        circle[temp-1] = new google.maps.Circle({
                map: map,
                radius: 1200,
                fillColor: '#65B853'
        });
        circle[temp-1].bindTo('center', markers[temp-1], 'position');
    }else if(Enumber >= 150 && Enumber < 250){
        circle[temp-1] = new google.maps.Circle({
                map: map,
                radius: 1200,
                fillColor: '#F9FF42'
        });
        circle[temp-1].bindTo('center', markers[temp-1], 'position');
    }
    else{
        circle[temp-1] = new google.maps.Circle({
                map: map,
                radius: 1200,
                fillColor: 'red'
        });
        circle[temp-1].bindTo('center', markers[temp-1], 'position');
    }  
}

// Why need to call average for each field? and does average number help?

function getEverageCoNumber(i,lat,lng){
    var co = [];
    var xaxis = [];
    var xtemp = [];
    var j = 0;
    var Numbers;
    var Enumber;
    var sum = 0;
    var nodeid = i;
    $.ajax({ 	// should we get 1 and store it at global variable? why call every time for this?
        type: "GET",
        url: "/node/getdata?id=" + i, 
        dataType: "json",
        success: function(data) {
            var myVariable = data;
            var count = Object.keys(myVariable).length;
            for (var i = 0; i < count; i++) {
                co.push(Number(myVariable[i].data.co));
                var d = new Date(myVariable[i].time);
                xaxis.push(d);
            }
            var d = new Date(myVariable[count-1].time);
            xtemp.push(d);
            var ngay = xtemp[0].getDate();
            var thang = xtemp[0].getMonth();
            for(var t = 0; t < xaxis.length; t++){
                if (xaxis[t].getDate() == ngay && xaxis[t].getMonth() == thang){
                    j = t;
                    Numbers = xaxis.length - j;
                    break;
                }
            }
            for(var i = j; i < xaxis.length; i ++){
                sum = sum + co[i];
            }
            Enumber = parseInt(sum/Numbers);
            CoEveNumber.push(Enumber);
            drawCoMarkers(Enumber,lat,lng,nodeid);
            console.log(CoEveNumber);
            
        }
    });
}

// dust everage
function getEverageDustNumber(i,lat,lng){
    var dust = [];
    var xaxis = [];
    var xtemp = [];
    var j = 0;
    var Numbers;
    var Enumber;
    var sum = 0;
    var nodeid = i;
    $.ajax({
        type: "GET",
        url: "/node/getdata?id=" + i, 
        dataType: "json",
        success: function(data) {
            var myVariable = data;
            var count = Object.keys(myVariable).length;
            for (var i = 0; i < count; i++) {
                dust.push(Number(myVariable[i].data.dust));
                var d = new Date(myVariable[i].time);
                xaxis.push(d);
            }
            var d = new Date(myVariable[count-1].time);
            xtemp.push(d);
            console.log(xtemp);
            var ngay = xtemp[0].getDate();
            var thang = xtemp[0].getMonth();
            for(var t = 0; t < xaxis.length; t++){
                if (xaxis[t].getDate() == ngay && xaxis[t].getMonth() == thang){
                    j = t;
                    Numbers = xaxis.length - j;
                    break;
                }
            }
            for(var i = j; i < xaxis.length; i ++){
                sum = sum + dust[i];
            }
            Enumber = (sum/Numbers);
            DustEveNumber.push(Enumber);
            drawDustMarkers(Enumber,lat,lng,nodeid);
            console.log(DustEveNumber);
            
        }
    });
}

// Temp everage 
function getEverageTempNumber(i,lat,lng){
    var temp = [];
    var xaxis = [];
    var xtemp = [];
    var j = 0;
    var Numbers;
    var Enumber;
    var sum = 0;
    var nodeid = i;
    $.ajax({
        type: "GET",
        url: "/node/getdata?id=" + i, 
        dataType: "json",
        success: function(data) {
            var myVariable = data;
            var count = Object.keys(myVariable).length;
            for (var i = 0; i < count; i++) {
                temp.push(Number(myVariable[i].data.temp));
                var d = new Date(myVariable[i].time);
                xaxis.push(d);
            }
            var d = new Date(myVariable[count-1].time);
            xtemp.push(d);
            var ngay = xtemp[0].getDate();
            var thang = xtemp[0].getMonth();
            for(var t = 0; t < xaxis.length; t++){
                if (xaxis[t].getDate() == ngay && xaxis[t].getMonth() == thang){
                    j = t;
                    Numbers = xaxis.length - j;
                    break;
                }
            }
            for(var i = j; i < xaxis.length; i ++){
                sum = sum + temp[i];
            }
            Enumber = (sum/Numbers);
            TempEveNumber.push(Enumber);
            drawTempMarkers(Enumber,lat,lng,nodeid);
            console.log(TempEveNumber);
            
        }
    });
}

// Gas everage
function getEverageGasNumber(i,lat,lng){
    var gas = [];
    var xaxis = [];
    var xtemp = [];
    var j = 0;
    var Numbers;
    var Enumber;
    var sum = 0;
    var nodeid = i;
    $.ajax({
        type: "GET",
        url: "/node/getdata?id=" + i, 
        dataType: "json",
        success: function(data) {
            var myVariable = data;
            var count = Object.keys(myVariable).length;
            for (var i = 0; i < count; i++) {
                gas.push(Number(myVariable[i].data.gas));
                var d = new Date(myVariable[i].time);
                xaxis.push(d);
            }
            var d = new Date(myVariable[count-1].time);
            xtemp.push(d);
            var ngay = xtemp[0].getDate();
            var thang = xtemp[0].getMonth();
            for(var t = 0; t < xaxis.length; t++){
                if (xaxis[t].getDate() == ngay && xaxis[t].getMonth() == thang){
                    j = t;
                    Numbers = xaxis.length - j;
                    break;
                }
            }
            for(var i = j; i < xaxis.length; i ++){
                sum = sum + gas[i];
            }
            Enumber = (sum/Numbers);
            GasEveNumber.push(Enumber);
            drawGasMarkers(Enumber,lat,lng,nodeid); 
            console.log(GasEveNumber);
            
        }
    });
}


$("#para").on("change", function() {
    var para_temp = document.getElementById("para");
    var para = para_temp.options[para_temp.selectedIndex].value;
    
    if(para == "CO"){
        clearOverlays();
        CoEveNumber = [];
        for(var i = 0; i < NodeID.length; i ++){
            getEverageCoNumber(NodeID[i],lat[i],lng[i]);
        }
    }
    if(para == "dust"){
        clearOverlays();
        DustEveNumber = [];
        for(var i = 1; i < NodeID.length; i ++){
            getEverageDustNumber(NodeID[i],lat[i],lng[i]);
        }
    }
    if(para == "temp"){
        clearOverlays();
        TempEveNumber = [];
        for(var i = 1; i < NodeID.length; i ++){
            getEverageTempNumber(NodeID[i],lat[i],lng[i]);
        }
    }
    if(para == "gas"){
        clearOverlays();
        GasEveNumber = [];
        for(var i = 1; i < NodeID.length; i ++){
            getEverageGasNumber(NodeID[i],lat[i],lng[i]);
        }
    }
    if(para == "none"){
        window.location.href = '/home';
    }

});