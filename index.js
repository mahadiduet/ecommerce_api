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
    'http://localhost:5173',
    // 'https://ecommerce-743b3.web.app'
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
    // ****************Start Collection **********************
    const productCollection = client.db("ecommerceDB").collection("product");
    const brandCollection = client.db("ecommerceDB").collection("brand");
    const categoryCollection = client.db("ecommerceDB").collection("category");
    // ****************End Collection**********************


    // ****************Start Product API**********************
    // Add Product
    app.post('/add-product', async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    })


    // Product count
    app.get('/allProductCount', async (req, res) => {
      const dataCount = await productCollection.countDocuments();
      res.send(String(dataCount));
    })

    // All Product get
    app.get('/all-product', async (req, res) => {
      const data = await productCollection.find().sort({ _id: -1 }).toArray();
      res.send(data);
    })

    // Specific product get for edit product data
    app.get('/edit-product/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const item = await productCollection.findOne({ _id: new ObjectId(id) });
      res.send(item);
    })

    // Product Update 
    app.patch('/edit-product/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateData = {
        $set: req.body
      };
      const result = await productCollection.updateOne(filter, updateData, options);
      res.send(result);
    })

    // Product Search
    app.get('/search', async (req, res) => {
      const searchValue = req.query.query;
      try {
        const searchQuery = { productName: { $regex: searchValue, $options: 'i' } };
        const data = await productCollection.find(searchQuery).sort({ _id: -1 }).toArray();
        res.send(data);
      } catch (error) {
        res.status(500).json({ message: err.message });
      }

    })
    // ****************End Product**********************

    // ****************Start Brand**********************
    // Add Brand
    app.post('/add-brand', async (req, res) => {
      const brand = req.body;
      const result = await brandCollection.insertOne(brand);
      res.send(result);
    })

    // All Brand 
    app.get('/brand', async (req, res) => {
      const data = await brandCollection.find().sort({ _id: -1 }).toArray();
      res.send(data);
    })
    // ****************End Brand************************
    // ****************Start Category************************
    // Add Category
    app.post('/add-category', async (req, res) => {
      const brand = req.body;
      const result = await categoryCollection.insertOne(brand);
      res.send(result);
    })

    // All Category 
    app.get('/category', async (req, res) => {
      const data = await categoryCollection.find().toArray();
      res.send(data);
    })
    // ****************End Category************************

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  } finally {
    // await client.close(); 
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})