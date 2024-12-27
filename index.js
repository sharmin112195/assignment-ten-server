const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT||5000;
const app = express();



app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.AT_USER}:${process.env.AT_PASS}@cluster0.emc8p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    // await client.connect();

    const equipmentCollection = client.db('equipmentDB').collection('equipment')

    app.get('/equipment',async(req,res) =>{
      const cursor = equipmentCollection.find().limit(6);
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/equipmentAll',async(req,res) =>{
      const cursor = equipmentCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    app.get('/emailMass',async(req,res) =>{
      const email = req.query.email
      const cursor = equipmentCollection.find({userEmail:email});
      const result = await cursor.toArray();
      res.send(result)
    })
    // id related single data and update
    app.get('/equipmentAll/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await equipmentCollection.findOne(query);
      res.send(result);
    })

    app.get('/sortData',async(req,res)=>{
      const cursor = equipmentCollection.find().sort({price:1});
      const result = await cursor.toArray();
      res.send(result)
    })
    

    app.post('/equipment',async(req,res)=>{
      const newEquipment = req.body;
      console.log(newEquipment);
      const result = await equipmentCollection.insertOne(newEquipment);
      res.send(result)
    })

    app.delete('/emailMass/:id',async(req,res)=>{
      const id = req.params.id;
      const query = { _id:new ObjectId(id) }
      const result = await equipmentCollection.deleteOne(query);
      res.send(result)
    })

    app.patch('/equipmentAll/:id',async(req,res)=>{
      const id = req.params.id;
      const updateData = req.body;
      const query = { _id:new ObjectId(id) };
      const update = {
        $set: updateData,
      }
      const result = await equipmentCollection.updateOne(query, update);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Assignment Ten CRUD Is Running')
})
app.listen(port,()=>{
    console.log(`Assignment Ten Crud is Running on Port : ${port}`)
})