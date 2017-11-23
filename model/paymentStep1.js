var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');


var paymentStep1Schema = new mongoose.Schema({
    
    tin:            String,
    payment_for:    String,
    amount:         Number,
    username:       String,
    
    });



paymentStep1Schema.plugin(passportLocalMongoose);

module.exports = mongoose.model("paymentStep1", paymentStep1Schema);