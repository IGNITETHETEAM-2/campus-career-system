const mongoose = require('mongoose');
const uri = "mongodb+srv://mohammedmuzhirtaha:Muzhir123@cluster0.annsvcl.mongodb.net/campus-management-system?retryWrites=true&w=majority";

const UserSchema = new mongoose.Schema({
    email: String,
    name: String
}, { strict: false });

const User = mongoose.model('User', UserSchema);

async function checkUser() {
    try {
        await mongoose.connect(uri);
        console.log("✓ Connected to Atlas");
        const user = await User.findOne({ email: 'mohammedmuzhirtaha@gmail.com' });
        if (user) {
            console.log("✓ User FOUND:", user.name, "(" + user.email + ")");
        } else {
            console.log("✗ User NOT FOUND. Seeding now...");
            // I'll seed him if he doesn't exist to make sure the login works
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('Muzhir123', 10);
            const newUser = new User({
                name: 'Muzhir Taha Mohammed',
                email: 'mohammedmuzhirtaha@gmail.com',
                password: hashedPassword,
                role: 'student'
            });
            await newUser.save();
            console.log("✓ User CREATED successfully with password 'Muzhir123'");
        }
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("✗ Error:", err.message);
        process.exit(1);
    }
}

checkUser();
