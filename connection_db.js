const mongoose = require('mongoose');
const DB_CONFIG = require('./db.config');
const CONNECTION_URL = DB_CONFIG.url || 'mongodb://127.0.0.1:27017/elasticsearch';

(async () => {
    try {
        await mongoose.connect(CONNECTION_URL, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });
        console.log('Connect database success!')
    } catch (error) {
        console.log({ 
            error,
            message: 'Connect database fail!'
        })
    }
})();

const userSchema = new mongoose.Schema({
    username: String,
    age: Number
});

const USER_COLL = mongoose.model('users', userSchema);

exports.USER_COLL = USER_COLL;