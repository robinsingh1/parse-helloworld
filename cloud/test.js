var Parse = require('parse').Parse
Parse.initialize("N85QOkteEEQkuZVJKAvt8MVes0sjG6qNpEGqQFVJ", "faJHtVc1CZNRuGjznDmsRs0UbqaktQbNKosKTbIo");
 

var Press = Parse.Object.extend("Press")
var query = new Parse.Query(Press);

//console.log(request)
//console.log(request.object.get("link"))
//query.equalTo("link", request.object.get("link"))
query.equalTo("link", "lol")
query.find({
  success: function(res) {
    console.log("exists")
    console.log(res)
    //response.error()
  },
  error: function(err) {
    console.log("doesnt exist")
    //response.success()
  },
})
