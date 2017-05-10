const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const invoice = require('./controllers/invoiceController')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alpha')
mongoose.Promise = global.Promise

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/node_modules', express.static('node_modules'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  res.sendfile('./public/views/index.html')
})

app.use('/api', invoice)

app.listen(3000)
console.log('Listening to 3000')

module.exports = app

// mongoimport --db alpha --collection invoice --drop --jsonArray --file ~/WDI/angular/MOCK_DATA.json
