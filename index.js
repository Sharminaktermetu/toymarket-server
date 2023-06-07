const express = require('express');
const cors = require('cors');
const app=express();
require('dotenv').config()
const port =process.env.PORT ||5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
// middlewars
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.Db_User}:${process.env.Db_Pass}@cluster0.pjt1xjf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {


// Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const toyCollection = client.db('tinytoy').collection('toys');
    
    app.post('/toy',async(req,res)=>{
      const toy =req.body;
      console.log(toy);
      const result = await toyCollection.insertOne(toy);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




// simple ckeck connection
app.get('/',(req,res)=>{
    res.send('Toy town is open')
})
app.listen(port,()=>{
    console.log(`Toy town is running on port ${port}`);
})