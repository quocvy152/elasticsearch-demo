const mongoose = require('mongoose');
const CONNECTION_URL = 'mongodb://127.0.0.1:27017/elasticsearch';

(async () => {
    try {
        await mongoose.connect(CONNECTION_URL);
        console.log('Connect database success!')
    } catch (error) {
        console.log({ error })
    }
})();

const userSchema = new mongoose.Schema({
    username: String,
    age: Number
});

const USER_COLL = mongoose.model('users', userSchema);

exports.USER_COLL = USER_COLL;