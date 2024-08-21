const express = require("express");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cookieParser());;
app.use(cors({
    origin: [
        'http://localhost:5173'
    ],
    credentials: true
}));

app.get('/', (req, res) => {
    res.send('Server side running...')
})

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://mahadi_ecommerce:XdTtphTApdAK2nMB@cluster0.lyuai16.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    const productCollection = client.db("ecommerceDB").collection("product");

    // Add Product
    app.post('/add-product', async (req, res) => {
        const product = req.body;
        // console.log('11');
        console.log(product);
        const result = await productCollection.insertOne(product);
        console.log(`A document was inserted with the _id: ${result}`);
        res.send(result);
     })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})