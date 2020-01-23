const mongoose = require('mongoose')
// let mongoUri = process.env.MONGO_URI  

if (process.env.NODE_ENV === 'testing') {
    mongoUri = 'mongodb://localhost:27017/famify-testing'
} else {
    mongoUri = 'mongodb://localhost:27017/famify-development'
    // mongoUri = process.env.MONGO_URI
}

const mongoConfig = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
    
}

mongoose.connect(mongoUri, mongoConfig, function(err) {
    if (err) console.log('db disconnected');
    else console.log('db connected');
    
})