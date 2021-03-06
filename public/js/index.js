var map;
var markers = [];
var NodeID = [];
var lat = [];
var lng = [];
var temp;
// get data

$.ajax({
    type: "GET",
    url: "/node/getinfo?list=1&status=1", // <-- Here
    dataType: "json",
    success: function(data) {

        myVariable = data;
        count = Object.keys(myVariable).length;
        // console.log(count);
        for (var i = 0; i < count; i++) {
            NodeID.push(Number(myVariable[i].node_id));
            lat.push(Number(myVariable[i].location.lat));
            lng.push(Number(myVariable[i].location.lng));


        }

        temp = lat.length;
        initMap();
    }

});

function initMap() {
    var markers = [];

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
            var circle = new google.maps.Circle({
                map: map,
                radius: 1200,
                fillColor: '#AA0000'
            });
            circle.bindTo('center', markers[i], 'position');
        }
    } else {
        for (var i = temp; i < markers.length; i++) {
            var circle = new google.maps.Circle({
                map: map,
                radius: 1200,
                fillColor: '#AA0000'
            });
            circle.bindTo('center', markers[i], 'position');
        }
    }
}

function addInfoWindow(marker, message) {
    var temp = "/graph?id=" + message;

    var infoWindow = new google.maps.InfoWindow({
        content: "Node: " + message + '<br/>' + '<a href="' + temp + '">' + "View Graph" + '</a>' + '<br/>' + '<a href="#">' + "View Stastic" + '</a>'
            // stastic later----------------
    });

    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker);
    });
}

function addmarker() {
    document.getElementById("addmarker").style.color = "blue";

    map.addListener('click', function(event) {
        var i = temp;
        i++;
        temp++;
        var phone = 123456;
        var lat = event.latLng.lat();
        var len = event.latLng.lng();
        addMarker(event.latLng, i);
        // alert(event.latLng.lat());
        $.ajax({
            type: "POST",
            url: '/node/initnew',
            data: {
                'node_id': i,
                'lat': lat,
                'lng': lng,
                'phone': phone
            },
            dataType: 'json',
            success: function(response) {
                // you will get response from your php page (what you echo or print)
                console.log(response);
            }
        });
        //window.location.replace("/node/initnew?node=" + i + "&lat=" + lat + "&lng=" + len + "&phone=" + phone);
    });
}
// Stop add markers
function stopAdd() {
    document.getElementById("addmarker").style.color = "black";
    google.maps.event.clearListeners(map, 'click');
}

function configMarkers() {
    window.location.href = "/config";
}
