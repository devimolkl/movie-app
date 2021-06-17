const mongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();


const url =process.env.NODE_ENV;
//const url ="mongodb://localhost:27017"; /// LocalDatabase 
const app= express();
const port= 3000;

const dbname = "movie-app";
const collectionName = "movies";
let client = "";

app.use(bodyParser.json());

app.get('/list/active', async (req,res) => {
       const collection = client.db(dbname).collection(collectionName);
    const response = await collection.find({status: { "$eq": "active" }}).toArray();
    res.send(JSON.stringify(response));

})

app.get('/list/inactive', async (req, res) => {
    const collection = client.db(dbname).collection(collectionName);
    const response = await collection.find({ status: { "$eq": "inactive" } }).toArray();
    return res.send(JSON.stringify(response));
})


app.post('/create', async (req,res) =>{
    const {name,year} = req.body;
    const collection = client.db(dbname).collection(collectionName);
    const response= await collection.insertOne({name : name , year: year});
    res.send(JSON.stringify(response.result));

})

app.put('/update/deactive/:name', async (req,res) =>{
    const {name} = req.params;
    const collection = client.db(dbname).collection(collectionName);
    const response= await collection.updateOne(
        {name: name},
        {
            $set : {status :"inactive"}
        });
    res.send(JSON.stringify(response.result));
})
app.delete('/delete/:name', async (req, res) => {
    const { name} = req.params;
    const collection = client.db(dbname).collection(collectionName);
    const response = await collection.deleteOne({ name: name });

    return res.json(response.result);
})

app.listen(port, ()=>{
    console.log(`app listening to http://localhost:${port}`)
   
})



const connectToDatabase = async () =>{
    console.log("Connected to the database successful !!!");
    client = await mongoClient.connect(url);
  
}
connectToDatabase();