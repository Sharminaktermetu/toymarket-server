const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const categoryCollection = client.db('tinytoy').collection('tabsToy');

    // tabs category
    app.get('/tabs', async (req, res) => {
      const cursor = categoryCollection.find();
      const result = await cursor.toArray()
      res.send(result)
    })
    // single item of category
    app.get('/tabs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await categoryCollection.findOne(query);
      res.send(result)
    })

    // toy collection
    app.get('/toy', async (req, res) => {
      let query = {};
      if (req.query?.sellerEmail) {
        query = { sellerEmail: req.query.sellerEmail }
      }
      const result = await toyCollection.find(query).toArray();
      res.send(result)

    })
    // 
    // Assuming you have an existing route for fetching all toys
    app.get('/toy', (req, res) => {
      const searchQuery = req.query.searchQuery;
      const filteredToys = toys.filter(toy =>
        toy.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      res.json(filteredToys);
    });


    // get added all toys 
    app.get('/toy', async (req, res) => {
      const cursor = toyCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    // get an unique toy for details
    app.get('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.findOne(query);
      res.send(result)
    })
    // add a toy 
    app.post('/toy', async (req, res) => {
      const toy = req.body;
      console.log(toy);
      const result = await toyCollection.insertOne(toy);
      res.send(result)
    })
    // delete a toy from my toys
    app.delete('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.deleteOne(query)
      res.send(result)
    })
    // update a toy from my toys
    app.put('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedtoy = req.body;
      const toy = {
        $set: {
          price: updatedtoy.price,
          quantity: updatedtoy.quantity,
          description: updatedtoy.description,

        }
      }
      const result = await toyCollection.updateOne(filter, toy, options)
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
app.get('/', (req, res) => {
  res.send('Toy town is open')
})
app.listen(port, () => {
  console.log(`Toy town is running on port ${port}`);
})