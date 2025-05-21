const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const {routes:approutes} = require('./routes/approutes');
const connectDB = require('./config/dbconnect');
const transformRoutes = require('./routes/transformRoutes');
const bodyParser = require('body-parser');
const ocrRoutes = require('./routes/ocr');
const createRoutes = require('./routes/createRoutes');
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
connectDB(MONGO_URI);


app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/docs', transformRoutes);
app.use('/api/create', createRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api', approutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}
);