const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const User = require('../backend/models/User');

const checkAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admins = await User.find({ role: 'admin' });
        console.log('Admins found:');
        admins.forEach(admin => {
            console.log(`Email: ${admin.email}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkAdmins();
