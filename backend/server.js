const express=require('express');
const mongoose = require('mongoose');
const cors= require('cors');
require('dotenv').config();
const userRoute = require('./routes/userRoute');
const sellerRoute = require('./routes/sellerRoute');
const adminRoute = require('./routes/adminRoute');
const productRoute = require('./routes/productRoute');
const orderRoute = require('./routes/orderRoute');

const app=express();
const PORT= 5000;

//Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGODB_URL, {}) 
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.log(err);
    });

app.use('/user', userRoute);
app.use('/seller', sellerRoute);
app.use('/admin', adminRoute);
app.use('/product',productRoute);
app.use('/order',orderRoute);
    
app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});