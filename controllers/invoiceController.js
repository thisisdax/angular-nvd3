const express = require('express')
const Invoice = require('../models/invoiceModel')
const router = express.Router()

router.get('/invoice/all', function (req, res) {
  Invoice.find({}, function (err, invoice) {
    if (err) return console.log(err)
    res.send(invoice)
  })
})

module.exports = router
