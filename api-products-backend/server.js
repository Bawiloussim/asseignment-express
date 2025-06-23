const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');

const MONGO_URI = 'mongodb://localhost:27017/productdb';
const PORT = 3000;


const app = express();
app.use(cors());
app.use(express.json());
app.use('/products', productRoutes);


mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Err:', err));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

