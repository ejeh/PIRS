var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');


var TaxSchema= new mongoose.Schema({
    valueAdded:    String,
    capitalGains:  String,
    education:     String,
    personnalIncome:String,
    company:        String
});

TaxSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Tax", TaxSchema);