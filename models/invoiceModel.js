const mongoose = require('mongoose')

const InvoiceSchema = new mongoose.Schema({
  customer: { type: String, required: true, maxlength: 150 },
  amount: { type: Number, required: true },
  date: { type: String, required: true }
})

module.exports = mongoose.model('Invoice', InvoiceSchema)
