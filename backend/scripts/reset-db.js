const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const clearData = async () => {
    await connectDB();

    try {
        console.log('Clearing Users...');
        await mongoose.connection.collection('users').deleteMany({});
        console.log('✓ Users cleared');

        console.log('Clearing Login History...');
        try {
            await mongoose.connection.collection('loginhistories').deleteMany({});
            console.log('✓ Login History cleared');
        } catch (e) {
            console.log('! Login History collection might not exist, skipping.');
        }

        console.log('All data cleared successfully.');
        process.exit(0);
    } catch (error) {
        console.error(`Error clearing data: ${error.message}`);
        process.exit(1);
    }
};

clearData();
