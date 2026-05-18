const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- ADD THIS LINE BELOW ---
const productRoutes = require('./routes/productRoutes'); 

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(" Local MongoDB connected successfully!"))
    .catch((err) => console.error("Database connection error:", err));

app.get('/', (req, res) => {
    res.send("Inventory Manager API is running smoothly!");
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', productRoutes); // Now this works!

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server is successfully running on port ${PORT}`);
});