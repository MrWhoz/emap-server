var map;
        var markers = [];
        var NodeID = [];
        var lat = [];
        var lng = [];
        var phone = [];
        var temp;
        // get data
        var nodeNumber;

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
                console.log(NodeID);
                // document.getElementById("nodeactive").innerHTML = '<i class="fa fa-list" aria-hidden="true"></i>' +'<span style="color:red;">Node Active:      </span>'  + '<a href="#">' + temp + '</a>' + '<span style="color:red;">' + "(" + '<i class="fa fa-hand-o-left" aria-hidden="true"></i>' + "Click here for Node Info" + ")" + '</span>';
                function call(){
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

                function drowtable(){
                    for(var i=0;i<NodeID.length;i++){
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
