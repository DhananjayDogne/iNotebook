const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')



connectToMongo();

const app = express()
app.use(cors())
const port = 5000

app.use(express.json()) // This is a middleware to parse JSON data from the request body

// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/group', require('./routes/group'));


app.listen(port, () => {
    console.log(`Example app listening on port at: http://www.localhost:${port}`)
})