const express = require('express');
const cors=require('cors')
const crypto = require("crypto");
const { custData} = require("./custData.js");
const app = express();
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
    
  
  app.use(cors());
let fs=require ("fs")
let fname="customers.json"
app.get("/resetData",function(req,res){
    let data=JSON.stringify(custData);
    fs.writeFile(fname,data,function(err){
        if(err)res.status(404).send(err);
        else res.send("Data in file is reset");
    })
});
app.get("/customers",function(req,res){
    fs.readFile(fname,"utf8",function(err,data){
        if(err)res.status(404).send(err);
        else {
            let customersArray=JSON.parse(data);
            res.send(customersArray);
    
    }
    })
});
app.get("/customers/:id",function(req,res){
    let id=+req.params.id;
    fs.readFile(fname,"utf8",function(err,data){
        if(err)res.status(404).send(err);
        else {
            let customersArray=JSON.parse(data);
            let student=customersArray.find((st)=>st.id===id);
            if(student)res.send(student);
            else res.status(404).send("No student found");
    
    }
    })
});

app.post("/customers",function (req,res){
    let body =req.body;
    fs.readFile(fname,"utf8",function(err,data){
        if(err)res.status(404).send(err);
        else {
            let customersArray=JSON.parse(data);
           
            var randomId = crypto.randomInt(10000, 99999).toString(36);
            var firstTwoDigits = randomId.substring(0, 5);
var randomAlphabeticId = crypto.randomInt(10, 35).toString(36) + firstTwoDigits;
if(customersArray.find((cust)=>cust.id===randomAlphabeticId)!==undefined) {
     randomId = crypto.randomInt(10000, 99999).toString(36);
    firstTwoDigits = randomId.substring(0, 5);
    randomAlphabeticId = crypto.randomInt(10, 35).toString(36) + firstTwoDigits;
}
            let newStudent={...body,id:randomAlphabeticId.toUpperCase()};
            customersArray.push(newStudent);
            let data1=JSON.stringify(customersArray);
            fs.writeFile(fname,data1,function(err){
                if(err)res.status(404).send(err);
                else res.send(newStudent)
            })
        }
    })
})
app.put("/customers/:id",function(req,res){
    let body=req.body;
    let id = +req.params.id;
    fs.readFile(fname,"utf8",function (err,data){
        if(err) res.status(404).send(err);
        else{
            let customersArray=JSON.parse(data);
            let index=customersArray.findIndex((st)=>st.id===id);
            if(index>=0){
                let updatedStudent={...customersArray[index],...body};
                customersArray[index]=updatedStudent;
                let data1=JSON.stringify(customersArray);
                fs.writeFile(fname,data1,function (err){
                    if(err) res.status(404).send(err);
                    else res.send(updatedStudent);
                });

            }else res.status(404).send("No student found");
        }
    })
})
app.get("/",(req,res)=>{
    res.send("backend is working fine");
    })
app.delete("/customers/:id",function(req,res){
    let body=req.body;
    let id = req.params.id;
    fs.readFile(fname,"utf8",function (err,data){
        if(err) res.status(404).send(err);
        else{
            let customersArray=JSON.parse(data);
            let index=customersArray.findIndex((st)=>st.id===id.toString());
            if(index>=0){
                let deletedCust=customersArray.splice(index,1)
                let data1=JSON.stringify(customersArray);
                fs.writeFile(fname,data1,function (err){
                    if(err) res.status(404).send(err);
                    else res.send(deletedCust);
                });

            }else res.status(404).send("No customer found");
        }
    })
})
const PORT = 2410;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
