const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5002;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4ffbuav.mongodb.net/?retryWrites=true&w=majority`;

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

    // service.json file theke id gula remove kore banano collection
    const serviceCollection = client.db('carDoctor').collection('services');

    // client side er user er info niye banano collection(new json file hobe)
    const bookingCollection = client.db('carDoctor').collection('bookings');


    // to read the data from database(database er data server side e dekha jabe)
    app.get('/services', async (req, res) => {
        const cursor = serviceCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })


    app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }

        const options = {
            // Include only the `title` and `imdb` fields in the returned document
            projection: { title: 1, price: 1, service_id: 1, img: 1 },
        };

        const result = await serviceCollection.findOne(query, options);
        res.send(result);
    })

    // bookings

    // some data read(email diye)
    app.get('/bookings', async (req, res) => {
        console.log(req.query.email);
        let query = {};
        if (req.query?.email) {
            query = { email: req.query.email }
        }
        const result = await bookingCollection.find(query).toArray();
        res.send(result);
    })

    // (WRITE)data client side theke server side/database e jacche
    app.post('/bookings', async (req, res) => {
        const booking = req.body;
        console.log(booking);
        const result = await bookingCollection.insertOne(booking);
        res.send(result);
    });





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('doctor is running')
})

app.listen(port, () => {
    console.log(`Car Doctor Server is running on port ${port}`)
})