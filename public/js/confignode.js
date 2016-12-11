function call(){
	var table = document.getElementById("list");
	if (table != null) {
    for (var i = 0; i < table.rows.length; i++) {
          // do update
          table.rows[i].cells[5].className = 'animation';
          table.rows[i].cells[6].className = 'animation';
        	table.rows[i].cells[5].onclick = function () {
            	tableText(this);
        	};
          // do replace
          table.rows[i].cells[6].onclick = function () {
              tableText1(this);
          };
    	}
	}
}

	function tableText(tableCell) {
    	var j;

    	var temp = tableCell.innerHTML;
    	var thenum = temp.replace( /^\D+/g, '');
    	var n1 = Number(thenum);
    	var n2;
    	console.log(n1);

    	var table = document.getElementById("list");
    	// console.log(table.rows[1].cells[0].innerHTML);
    	for(var i=1;i<table.rows.length;i++){
    		n2 = Number(table.rows[i].cells[0].innerHTML)

    		if(n1 == n2){
    			j = i;
    			console.log(j);
    			update(j);
    			return;
    		}
    	}


	}

  // function tabletext1

  function tableText1(tableCell) {
      var j;

      var temp = tableCell.innerHTML;
      var thenum = temp.replace( /^\D+/g, '');
      var n1 = Number(thenum);
      var n2;
      console.log(n1);

      var table = document.getElementById("list");
      // console.log(table.rows[1].cells[0].innerHTML);
      for(var i=1;i<table.rows.length;i++){
        n2 = Number(table.rows[i].cells[0].innerHTML)

        if(n1 == n2){
          j = i;
          replace(j);
          return;
        }
      }


  }

  //-------------------------------------
	function update(j){
		var arr = [];
		var table = document.getElementById("list");
		for(var i = 0; i<4; i++){
    		arr.push(table.rows[j].cells[i].innerHTML);
    	}
    	console.log(arr);
    	localStorage.setItem("temp", arr);
    	$.get("/node/update",
                    {
                        data: arr
                    },
                    function (data) {
                        location.href = "/node/update";
                    }
                );
	}

  // ---------------------------------------

  function replace(j){
    var arr = [];
    var table = document.getElementById("list");
    arr.push(table.rows[j].cells[0].innerHTML);
    localStorage.setItem("temp",arr);
    $.get("/node/replace",
                    {
                        data: arr
                    },
                    function (data) {
											console.log('gethere');
                        location.href = "/node/replace";
                    }
                );
  }
