const mongoose=require('mongoose');
const bcrypt= require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true},
    DOB: { type: Date, required: true }, 
    role: {type: String, enum: ['User', 'Seller'], required: true},
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    phone: { type: Number, required: true, match: /^[0-9]{10}$/, unique: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
});

// Middleware to hash the password before saving the user
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10); // Use a consistent salt round
        console.log("Generated Salt:", salt); // Check if salt is generated
        this.password = await bcrypt.hash(this.password, salt);
        console.log("Hashed Password:", this.password); // Verify hashed password
        next();
    } catch (error) {
        console.error("Hashing Error:", error);
        next(error);
    }
});

const User= mongoose.model('User', UserSchema, 'users');
module.exports = User;