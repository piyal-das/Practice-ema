
const express = require('express')
var bodyParser = require('body-parser').json()
var cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const app = express()
app.use(bodyParser)
app.use(cors())
const uri = ` mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yrjsh.mongodb.net/myFirstDatabase?retryWrites=true `;
const client = new MongoClient(uri, { useNewUrlParser: true ,  useUnifiedTopology: true});

const port = 5000;



client.connect(err => {
  const collection = client.db("emaJohnSimple").collection("products");
  const orderCollection = client.db("emaJohnSimple").collection("orders");

  app.post('/addProduct', (req, res) => {
      const product = req.body;
      collection.insertOne(product)
      .then(result =>{
          console.log(result)
      })
  })
  app.get('/products', (req, res) => {
    collection.find({})
    .toArray( (err, documents) =>{
      res.send(documents)
    })
  })
  app.get('/products:key', (req, res) => {
    collection.find({key: req.params.key})
    .toArray( (err, documents) =>{
      res.send(documents[0])
    })
  })

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
      collection.find({key: {$in: productKeys}})
      .toArray( (err, documents) =>{
        res.send(documents)
      })
  })

  app.post('/addOrder' , (req, res) => {
    const order = req.body
    orderCollection.insertOne(order)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

//   client.close();
});





app.get('/', (req, res) => {
  res.send("Hey Look, it's working!")
})

app.listen(process.env.port || port)
