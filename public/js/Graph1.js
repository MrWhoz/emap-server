

            var count;

            var Node;
      function initMap(lat,lng,message) {
        var myLatLng = {lat: lat, lng: lng};

        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 17,
          center: myLatLng
        });

        var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          title: 'Hello World!'
        });
        addInfoWindow(marker,message);
      }

      function addInfoWindow(marker, message) {


            var infoWindow = new google.maps.InfoWindow({
                content: "Node ID: " + message
                    // stastic later----------------
            });

            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.open(map, marker);
            });
        }



                function drowchart(xaxis,co,dust,gas,temp,bat) {
                        // alert(xaxis);
                        $(function() {
                            $('#chart').highcharts({
                                title: {
                                    text: 'Node: ' + Node,
                                    x: -20 //center
                                },
                                subtitle: {
                                    text: '',
                                    x: -20
                                },
                                xAxis: {
                                    categories: xaxis
                                },
                                yAxis: {
                                    title: {
                                        text: 'Value'
                                    },
                                    plotLines: [{
                                        value: 0,
                                        width: 1,
                                        color: '#808080'
                                    }]
                                },
                                tooltip: {
                                    // valueSuffix: '°C'
                                },
                                legend: {
                                    layout: 'vertical',
                                    align: 'right',
                                    verticalAlign: 'middle',
                                    borderWidth: 0
                                },
                                series: [{
                                    name: 'MQ07(CO_ppm)',
                                    data: co
                                }, {
                                    name: 'TEMP(°C)',
                                    data: temp
                                }, {
                                    name: 'DUST(ppm)',
                                    data: dust
                                }, {
                                    name: 'MQ135(GAS_ppm)',
                                    data: gas
                                }, {
                                    name: 'BATTERY(%)',
                                    data: bat
                                }]
                            });
                        });
                    }
                function removeOptions(selectbox)
                {
                    var i;
                    for(i = selectbox.options.length - 1 ; i >= 0 ; i--)
                    {
                        selectbox.remove(i);
                    }
                }

                function createDateOptions(date,co,dust,temp,gas,bat,xaxis){
                    var select = document.getElementById("date");
                    for(var i = 0, l = date.length; i < l; i++){
                        var option = date[i];
                        var temp = String(option);
                        var temp1 = temp.substring(0,16);
                        var el = document.createElement("option");
                        el.textContent = temp1;
                        el.value = option;
                        select.appendChild(el);
                        // console.log(temp.substring(0,16));
                    }
                    var ngay = xaxis[0].getDate();
                    var thang = xaxis[0].getMonth();
                    var co1 = [];
                    var dust1 = [];
                    var temp1 = [];
                    var gas1 = [];
                    var bat1 = [];
                    var x = [];
                    for(var i = 0; i < xaxis.length; i++){
                        if(xaxis[i].getDate() == ngay && xaxis[i].getMonth() ==  thang){
                            co1.push(co[i]);
                            dust1.push(dust[i]);
                            temp1.push(temp[i]);
                            gas1.push(gas[i]);
                            bat1.push(bat[i]);
                            x.push(xaxis[i]);
                        }
                    }
                    var x1 = [];
                    for(var t = 0; t < x.length; t++){
                        x1.push(x[t].getHours()+":"+x[t].getMinutes() + ":" + x[t].getSeconds());
                    }
                    console.log(x1);
                    drowchart(x1,co1,dust1,gas1,temp1,bat1);
                }
                function action(xaxis){
                        var i = 0;
                        var j;
                    var long = xaxis.length;
                    console.log(long);
                    for(var t=0;t<long;t++){
                        if(xaxis[t] == date){
                            j = t;
                            break;
                        }
                    }

                    var ngay = xaxis[j].getDate();

                    var thang = xaxis[j].getMonth();
                    var co1 = [];
                    var dust1 = [];
                    var temp1 = [];
                    var gas1 = [];
                    var bat1 = [];
                    var x = [];
                    for(z=j;z<long;z++){
                        if(z==j){
                            co1.push(co[z]);
                            dust1.push(dust[z]);
                            temp1.push(temp[z]);
                            gas1.push(gas[z]);
                            bat1.push(bat[z]);
                            x.push(xaxis[z]);
                        }
                        else{
                            if(xaxis[z].getDate() == ngay && xaxis[z].getMonth()==thang){
                                co1.push(co[z]);
                                dust1.push(dust[z]);
                                temp1.push(temp[z]);
                                gas1.push(gas[z]);
                                bat1.push(bat[z]);
                                x.push(xaxis[z]);
                            }
                        }

                    }
                    var x1 = [];
                    for(var t = 0; t < x.length; t++){
                        x1.push(x[t].getHours()+":"+x[t].getMinutes() + ":" + x[t].getSeconds());
                    }

                    // Drow new chart
                    drowchart(x1,co1,dust1,gas1,temp1,bat1,t);
                }

                $("#date").on("change", function() {
                    var node_temp =  document.getElementById("sources");

                    var t = node_temp.options[node_temp.selectedIndex].value;
                    var e = document.getElementById("date");
                    Node = t;
                    date = e.options[e.selectedIndex].value;
                    var co = [];
                    var dust = [];
                    var gas = [];
                    var temp = [];
                    var xaxis = [];
                    var bat = [];
                    $.ajax({
                        type: "GET",
                        url: "/node/getdata?id=" + t,
                        dataType: "json",
                        success: function(data) {
                            var myVariable = data;
                            var count = Object.keys(myVariable).length;

                            t = myVariable[0].data_id;
                            console.log('this is dataid', myVariable[0].t);
                            for (var i = 0; i < count; i++) {
                                co.push(Number(myVariable[i].data.co));
                                dust.push(Number(myVariable[i].data.dust));
                                temp.push(Number(myVariable[i].data.temp));
                                gas.push(Number(myVariable[i].data.gas));
                                bat.push(Number(myVariable[i].data.bat));
                                var d = new Date(myVariable[i].time);
                                xaxis.push(d);
                            }
                            action(xaxis);
                        }

                    });
                    


                    });
                function display(node_id) {
                    var co = [];
                    var dust = [];
                    var gas = [];
                    var temp = [];
                    var xaxis = [];
                    var bat = [];
                    // Get node data
                    $.ajax({
                        type: "GET",
                        url: "/node/getdata?id=" + node_id,
                        dataType: "json",
                        success: function(data) {
                            var myVariable = data;
                            var count = Object.keys(myVariable).length;
                            // console.log(count);
                            data_id = myVariable[0].data_id;
                            console.log('this is dataid', myVariable[0].data_id);
                            for (var i = 0; i < count; i++) {
                                co.push(Number(myVariable[i].data.co));
                                dust.push(Number(myVariable[i].data.dust));
                                temp.push(Number(myVariable[i].data.temp));
                                gas.push(Number(myVariable[i].data.gas));
                                bat.push(Number(myVariable[i].data.bat));
                                var d = new Date(myVariable[i].time);
                                xaxis.push(d);
                            }
                            var lastdate = String(xaxis[count-1]).substring(0,25);
                            console.log(lastdate);
                            document.getElementById("update").innerHTML = '<span style="font-weight:bold">'+"DATE: "+'</span>' + lastdate + '<hr/>'
                                + '<span style="font-weight:bold;">MQ07(CO): </span>'+co[count-1] + 'ppm'+'<span style="padding-left:110px"></span>'
                                + '<span style="font-weight:bold;">DUST: </span>' + dust[count-1] +'ppm'+ '<span style="padding-left:110px"></span>'
                                + '<span style="font-weight:bold;">TEMP: </span>' + temp[count-1] +'°C' + '<span style="padding-left:110px"></span>'
                                + '<span style="font-weight:bold;">MQ135(GAS): </span>' + gas[count-1] +'ppm'+ '<span style="padding-left:110px"></span>'
                                + '<span style="font-weight:bold;">BATTERY: </span>' + bat[count-1]+'%'
                                ;

                            console.log(xaxis[0]);
                            var date = [];
                            for(var i=0;i<count;i++){

                                if(i==0){
                                    date.push(xaxis[i]);

                                }else{
                                    var long = date.length;
                                    var lastelement = date[long-1];
                                    var ngay = lastelement.getDate();
                                    var thang = lastelement.getMonth();
                                    if(xaxis[i].getDate()!=ngay || xaxis[i].getMonth()!=thang){
                                        date.push(xaxis[i]);
                                    }
                                }
                            }


                            console.log(date);
                            removeOptions(document.getElementById("date"));
                            createDateOptions(date,co,dust,temp,gas,bat,xaxis);
                            // drowchart();
                        }
                    });
                    // Get node info
                    $.ajax({
                        type: "GET",
                        url: "/node/getinfo?id=" + node_id,
                        dataType: "json",
                        success: function(data) {
                            Nodeinfo = data;
                            InsertInfo(Nodeinfo.node_id, Nodeinfo.phone, Nodeinfo.location.lat, Nodeinfo.location.lng);
                            console.log(Nodeinfo.location.lat);
                            initMap(Nodeinfo.location.lat,Nodeinfo.location.lng,Nodeinfo.node_id);

                        }
                    });
                    socket.off('rdata');
                    socket.on('rdata', function(updateData) {
                        console.log(data_id, '==', updateData.new_val.data_id);
                        if (data_id === updateData.new_val.data_id) {
                            console.log('get data', updateData.new_val.data);
                            co.push(Number(updateData.new_val.data.co));
                            dust.push(Number(updateData.new_val.data.dust));
                            temp.push(Number(updateData.new_val.data.temp));
                            gas.push(Number(updateData.new_val.data.gas));
                            bat.push(Number(updateData.new_val.data.bat));
                            xaxis.push(updateData.new_val.time);
                            drowchart(xaxis,co,dust,gas,temp,bat);
                        }
                    });


                    //Display node info
                    function InsertInfo(nodeid, phone, lat, lng) {
                        document.getElementById("NodeID").value = nodeid;
                        document.getElementById('NodeID').disabled = true;
                        document.getElementById("Phone").value = phone;
                        document.getElementById('Phone').disabled = true;
                        document.getElementById("Latitude").value = lat;
                        document.getElementById('Latitude').disabled = true;
                        document.getElementById("Longitude").value = lng;
                        document.getElementById('Longitude').disabled = true;
                    }


                }
                // Check Node Input
                function check(NodeIDList,Nodeint){
                    var j = 0;
                    console.log(NodeList);
                    for(var i = 0; i < NodeIDList.length;i++){
                        if(Nodeint == NodeIDList[i]){
                            j ++;
                            break;
                        }
                    }
                    if(j != 0){
                        $('#sources').val(Node);
                        display(Node);
                    }else{
                        alert("Node doesnt exist!");
                    }
                }
                function NodeInput(){
                    var NodeList = [];
                    Node = document.getElementById("chooseNode").value;
                    var Nodeint = parseInt(Node);
                    $.ajax({
                        type: "GET",
                        url: "/node/getinfo?list=1&status=1", // <-- Here
                        dataType: "json",
                        success: function(data) {
                            var myVariable = data;
                            var count = Object.keys(myVariable).length;
                            // console.log(count);
                            for (var i = 0; i < count; i++) {
                                NodeList.push(Number(myVariable[i].node_id));
                            }
                            check(NodeList,Nodeint);

                        }
                    });

                }

                function EditNode(){
                    var lat = document.getElementById("Latitude").value;
                    var nodeid = document.getElementById("NodeID").value;
                    console.log(nodeid-1);

                    if(nodeid-1<0){

                        alert("Empty Node");

                    }else{
                        $('#Latitude').removeAttr('disabled');
                        $('#Longitude').removeAttr('disabled');
                        $('#Phone').removeAttr('disabled');
                    }
                }

                function EditConfirm(){
                    var node_id = document.getElementById("NodeID").value;
                    var lat = document.getElementById("Latitude").value;
                    var lng = document.getElementById("Longitude").value;
                    var phone = document.getElementById("Phone").value;
                    console.log(phone);
                    console.log(node_id);
                    console.log(lat);
                    console.log(lng);
                    $.ajax({
                      type: "POST",
                      url: '/node/updatenode',
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
                    $('#Latitude').attr('disabled', 'disabled');
                            $('#Longitude').attr('disabled', 'disabled');
                            $('#Phone').attr('disabled', 'disabled');
                            alert("Update success!");
                }

                // refresh lastupdate
                function doRefresh(){
                    var e = document.getElementById("sources");
                    var node_id = e.options[e.selectedIndex].value;
                    var co = [];
                    var dust = [];
                    var temp = [];
                    var gas = [];
                    var bat = [];
                    var xaxis = [];
                    $.ajax({
                        type: "GET",
                        url: "/node/getdata?id=" + node_id,
                        dataType: "json",
                        success: function(data) {
                            var myVariable = data;
                            var count = Object.keys(myVariable).length;
                            // console.log(count);
                            data_id = myVariable[0].data_id;
                            console.log('this is dataid', myVariable[0].data_id);

                            co.push(Number(myVariable[count-1].data.co));
                            dust.push(Number(myVariable[count-1].data.dust));
                            temp.push(Number(myVariable[count-1].data.temp));
                            gas.push(Number(myVariable[count-1].data.gas));
                            bat.push(Number(myVariable[count-1].data.bat));
                            var d = new Date(myVariable[count-1].time);
                            xaxis.push(d);

                            var lastdate = String(xaxis[0]).substring(0,25);
                            console.log(lastdate);

                            document.getElementById("update").innerHTML = '<span style="font-weight:bold">'+"DATE: "+'</span>' + lastdate+ '<hr/>'
                                + '<span style="font-weight:bold;">MQ07(CO): </span>'+co[0] + 'ppm'+'<span style="padding-left:110px"></span>'
                                + '<span style="font-weight:bold;">DUST: </span>' + dust[0] +'ppm'+ '<span style="padding-left:110px"></span>'
                                + '<span style="font-weight:bold;">TEMP: </span>' + temp[0] +'°C' + '<span style="padding-left:110px"></span>'
                                + '<span style="font-weight:bold;">MQ135(GAS): </span>' + gas[0] +'ppm'+ '<span style="padding-left:110px"></span>'
                                + '<span style="font-weight:bold;">BATTERY: </span>' + bat[0]+'%' ;

                                alert("Refresh done!");
                            }


                        });
                }
