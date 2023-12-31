const express = require('express');
const multer = require('multer');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

const mongoURL = 'mongodb+srv://rsabishek003:abishekRSKA2003@cluster0.meiyjny.mongodb.net/';
const dbName = 'deepvision';

// Define the MongoDB collection and schema
let collection;

const connectToMongoDB = async () => {
  try {
    const client = await MongoClient.connect(mongoURL);
    const db = client.db(dbName);
    collection = db.collection('anime');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

connectToMongoDB();
app.use(cors());

// File upload route
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
      const { originalname: fileName, mimetype, path } = req.file;
      const animations = JSON.parse(req.body.animations); // Retrieve animation names
  
      const fileLog = {
        fileName,
        numberOfAnimations: animations.length,
        animations,
        uploadedAt: new Date(),
      };
  
      // Insert the file log into MongoDB
      await collection.insertOne(fileLog);
      console.log('File log inserted into MongoDB');
  
      res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  });
  

// Start the server
const port = 9000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
