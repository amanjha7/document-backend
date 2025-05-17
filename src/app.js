const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const {routes:approutes} = require('./routes/approutes');
const connectDB = require('./config/dbconnect');
const docToPdfRoutes = require('./routes/docToPdfRoutes');

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
connectDB(MONGO_URI);


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/docs', docToPdfRoutes);
app.use('/api', approutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}
);