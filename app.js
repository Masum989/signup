const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const https = require('https');
const { rmSync } = require('fs');
// const {response} = require('express');


// we send data to server with help of bodyparser 
app.use(express.static("public"));  
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req,res){
    res.sendFile(__dirname + "/signup.html");
});
app.post('/',function(req,res){
   const fName= req.body.fName;
   const lName = req.body.lName;
   const email = req.body.email;

//  console.log(fName, lName, email);

const data = {  
    members :[{ 
        email_address: email,
        status: "subscribed",
        merge_fields:{ 
            FNAME: fName,
            LNAME: lName
         }

    }
       
    ]
};

const jsonData =JSON.stringify(data);
const url = "https://us11.api.mailchimp.com/3.0/lists/93166bfc6e";
const options ={
    method:"POST",
    auth: "masoom:a5b49c38d5c68cb0f6cbad3b766cf829-us11"
}
 const request = https.request(url, options,function(response){
  if(response.statusCode===200){
    res.sendFile(__dirname + "/success.html");
  }else{
    res.sendFile(__dirname+"/failure.html");
  }
  
  
  
    response.on("data", function(data){
    console.log(JSON.parse(data));
   })
})
 request.write(jsonData);
 request.end();


});
// now for failure route

app.post("/failure",function(req,res){
    res.redirect("/"); // it will redirect to home page
})

// i have used process.env.PORT(dynamic port, process object is defined by heroku)
// because we are not listening on local host that why other
//wise we can use 3000 or 8080 or whatever
// either listen on dynamic port or local port 3000
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is runnig at port 3000");
});

 

//  Api key :a5b49c38d5c68cb0f6cbad3b766cf829-us11
// list id or audience id :  93166bfc6e