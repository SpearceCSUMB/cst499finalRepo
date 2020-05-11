function createReports(event, elem) {
  var elementId = $(elem).attr("id");
  var val = 0;
  $.ajax({
    method: "post",
    url: "/api/createReports",
    data: {"id": elementId},
    success: function(rows) {
      if (elementId == 'planes') {
        rows.forEach(function(row) {
          val = row.numberOfAircraft;
          $("#reportOutput").html("");
          $("#reportOutput").append(" The number of Aircrafts in the inventory are: <strong>" + val + "</strong>");
      })
      } else if (elementId == 'passFail') {
        $("#reportOutput").html("");
        $("#reportOutput").append(" The number of Aircrafts that passed inspection are: <strong>" + rows[0] + "</strong>");
        $("#reportOutput").append(" The number of Aircrafts that failed inspection are: <strong>" + rows[1] + "</strong>");
      } else {
        rows.forEach(function(row) {
          val = row.average;
        })
        $("#reportOutput").html("");
        $("#reportOutput").append("The average price for our Aircrafts are : <strong>$" + val + "</strong>");
      }
      
    }
  })
  //console.log(elementId + " This is the id");
}

function modifyEntry(event, elem) {
  console.log("modifyEntry")
    var elementId = $(elem).attr("id");
    var parts = elementId.split("_");
    var operation = parts[0];
    var id = parseInt(parts[1]);
  if(operation == 'delete'){
    if(confirm("Click OK to delete item from database.")){ 
      $.ajax({
        method: "post",
           url: "/api/deleteAircraft",
          data: {"id": id},
       success: function(){location.reload(true)}
       
      })
   }
  }else{
    location.href="/modifyAircraft?id=" + id;
       }
}

function addCart(event, elem) {
      var elementId = $(elem).attr("id");
      var parts = elementId.split("_");
      var id = parseInt(parts[1]);
  $.ajax({
    method:"post",
    url:"/api/cartSession",
    success: function(){
    console.log("in success")
            $.ajax({
            method: "post",
               url: "/api/addCart",
              data: {"id": id},
           success: function(){location.reload(true)

           }
            }) 
  }
  })  
}   

function deleteCart(event, elem) {
    var elementId = $(elem).attr("id");
    var parts = elementId.split("_");
    var id = parseInt(parts[1]);
    if(confirm("Click OK to remove the airplane from your cart")){ 
      $.ajax({
        method: "post",
           url: "/api/deleteCart",
          data: {"id": id},
       success: function(){location.reload(true)}
       
      })
     
       }
}  
function confirmOrder(){
  console.log("confirm function")
  location.href="/confirmOrder"
}
