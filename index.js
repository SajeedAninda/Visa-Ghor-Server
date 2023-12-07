require('dotenv').config()
const express = require('express')
let cors = require("cors");
const app = express()

app.use(cors());
app.use(express.json());


const port = process.env.PORT || 5000

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `${process.env.MONGO_URI}`;

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
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        let slipPriceCollection = client.db("VisaGhor").collection("slipPricing");

        // GET SLIP PRICES 
        app.get("/slipPrices", async (req, res) => {
            const result = await slipPriceCollection.find().toArray();
            res.send(result);
        });

        // ADD SLIP PRICES 
        app.post("/addSlip", async (req, res) => {
            const slipDetails = req.body;
            const result = await slipPriceCollection.insertOne(slipDetails);
            res.send(result);
        });

        // DELETE SLIPS 
        app.delete("/slipList/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = {
                _id: new ObjectId(id),
            };
            const result = await slipPriceCollection.deleteOne(query);
            res.send(result);
        });




        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Visa Ghor Server!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})