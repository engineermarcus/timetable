const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// ✅ Load MongoDB URI from .env
const mongoURI = process.env.MONGO_URI;
const dbName = 'TIMETABLE'; // ✅ Set database name here

if (!mongoURI) {
    console.error('❌ MONGO_URI is not defined in .env file');
    process.exit(1);
}

const adminSchema = new mongoose.Schema({
    username: String,
    password: String
}, { collection: 'admins' }); // ✅ Explicit collection name

const Admin = mongoose.model('Admin', adminSchema, 'admins'); // ✅ Ensure collection name

(async () => {
    try {
        await mongoose.connect(mongoURI, {
            dbName, // ✅ Set database name dynamically
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('✅ MongoDB Connected to:', dbName);

        const username = 'admin';
        const password = 'node';

        const adminExists = await Admin.findOne({ username });

        if (adminExists) {
            console.log('✅ Admin already exists');
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await Admin.create({ username, password: hashedPassword });

            console.log('✅ Admin created successfully!');
            console.log(`🔹 Username: ${username}`);
            console.log(`🔹 Password: ${password} (hashed in DB)`);
        }

        process.exit();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
})();
