const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    NODE_ENV: process.env.NODE_ENV || 'development',
};

if (!config.MONGODB_URI) {
    console.error('MongoDB URI is not defined in the environment variables.');
    process.exit(1);
}

if (!config.JWT_SECRET) {
    console.error('JWT Secret is not defined in the environment variables.');
    process.exit(1);
}

module.exports = config;