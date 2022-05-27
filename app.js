const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000...");
});

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;

  //console.log(req.body.fName);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us13.api.mailchimp.com/3.0/lists/fe9144689f";
  const options = {
    method: "POST",
    auth: "nhung:042375b112ce5baaf4237edb686c38f9-us13"
  };

  const request = https.request(url, options, function(response){

    console.log("second value: " + response.statusCode);
    if(response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      //console.log(JSON.parse(data));
      var dataOutput = JSON.parse(data);
      console.log(dataOutput.error_count);

      // if(dataOutput.error_count === 0) {
      //   //response.sendFile(__dirname + "/success.html");
      //   response.statusCode = 200;
      // } else {
      //   response.sendFile(__dirname + "/failure.html");
      //   response.statusCode = 400;
      // }

      console.log("first value: " + response.statusCode);

    });

  });

  request.write(jsonData);
  request.end();
//console.log(response.statusCode);

});

app.post("/failure", function(req, res){
  res.redirect("/");
});

// mailchimp authentication key
// 042375b112ce5baaf4237edb686c38f9-us13

// Audience ID
// fe9144689f
