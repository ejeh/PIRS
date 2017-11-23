var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');


var paymentStep2Schema = new mongoose.Schema({
    account_name:   String,
    account_id:     String,
    amount:         Number,
    methodofpayment:String,
    card_number:    Number,
    pin:            Number
});



paymentStep2Schema.plugin(passportLocalMongoose);

module.exports = mongoose.model("paymentStep2", paymentStep2Schema);