const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SellerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true},
    DOB: { type: Date, required: true }, 
    role: {type: String, enum: ['User', 'Seller'], required: true},
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    phone: { type: Number, required: true, match: /^[0-9]{10}$/, unique: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
});

SellerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Skip hashing if the password hasn't changed

    try {
        const salt = await bcrypt.genSalt(10); // Generate salt
        console.log("Generated Salt:", salt);
        this.password = await bcrypt.hash(this.password, salt); // Hash the password with the generated salt
        next(); // Proceed to save the document
    } catch (error) {
        console.log("Hashing Error:", error);
        next(error); // Pass the error to the next middleware
    }
});


const Seller = mongoose.model('Seller', SellerSchema, 'sellers');
module.exports = Seller;