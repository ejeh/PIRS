var mongoose              = require("mongoose");
    passportLocalMongoose = require('passport-local-mongoose');
    md5                   = require('md5');
    validator             = require('validator');
    mongodbErrorHandler   = require('mongoose-mongodb-errors')


var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: "Enter a valid email address",
            isAsync: false
        },
        required: 'Please supply an email address',
    },
    firstname: {
        type: String,
        trim: true,
        required: 'Please supply a name',
    },
    lastname: { 
        type: String,
        trim: true,
        required: 'Please supply a name',
    },
    tin:  { 
        type: String,
        trim: true,
        required: 'Please supply a name',
    }
});


UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(mongodbErrorHandler);
module.exports = mongoose.model("User", UserSchema);