const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

const ObjectId = require('mongodb').ObjectId;
const fileUpload = require('express-fileupload')

// dotenv
require('dotenv').config()

// middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4jhnt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("hexaWizards");
        const serviceCollection = database.collection("services");
        const teamCollection = database.collection("team");
        const messageCollection = database.collection("messages");
        // service get & post api
        app.post('/services', async (req, res) => {
            const name = req.body.name;
            const service = req.body.service;
            const pic = req.files.image;
            const picData = pic.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const services = {
                name,
                service,
                image: imageBuffer
            }
            const result = await serviceCollection.insertOne(services);
            res.json(result)
        })

        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        })
        // team get and post api
        app.post('/members', async (req, res) => {
            const name = req.body.name;
            const service = req.body.service;
            const designation = req.body.designation;
            const email = req.body.email;
            const number = req.body.number;
            const facebook = req.body.facebook;
            const linkedin = req.body.linkedin;
            const skill = req.body.skills;
            const pic = req.files.image;
            const picData = pic.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const details = {
                name,
                service,
                designation,
                email,
                number,
                facebook,
                linkedin,
                skill,
                image: imageBuffer
            }
            const result = await teamCollection.insertOne(details);
            res.json(result)
        })
        app.get('/members', async (req, res) => {
            const cursor = teamCollection.find({});
            const members = await cursor.toArray();
            res.json(members);
        })
        app.get('/members/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await teamCollection.findOne(query);
            res.json(product);
        })
        // DELETE MEMBERS
        app.delete('/members/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await teamCollection.deleteOne(query);
            res.json(result);
        })
        // message get & post api
        app.post('/messages', async (req, res) => {
            const name = req.body.name;
            const email = req.body.email;
            const subject = req.body.subject;
            const message = req.body.message;
            const messages = {
                name,
                email,
                subject,
                message
            }
            const result = await messageCollection.insertOne(messages);
            res.json(result)
        })

        app.get('/messages', async (req, res) => {
            const cursor = messageCollection.find({});
            const messages = await cursor.toArray();
            res.json(messages);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running port');
});

app.listen(port, () => {
    console.log('Running server on port', port);
})