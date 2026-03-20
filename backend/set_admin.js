const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            admin = new User({
                name: 'System Admin',
                email: 'admin@xolo.com',
                password: 'admin',
                phone: '1234567890',
                role: 'admin'
            });
        }
        
        admin.password = 'admin123';
        await admin.save();
        
        console.log(`SUCCESS: Admin email is ${admin.email} and password was reset to admin123`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
