const connectToMongo = require('./db');
const express = require('express')

connectToMongo();

const app = express()
const port = 5000

app.use(express.json());

app.use('/api/auth', require('./routes/auth.js'));

// app.get('/', (req, res) => {
//   res.send('Hello World! this is test.')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})