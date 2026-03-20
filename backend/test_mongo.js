const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB connection SUCCESS to new cluster');
    process.exit(0);
})
.catch(err => {
    console.error('Error connecting to new cluster', err);
    process.exit(1);
});
