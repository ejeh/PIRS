var mongoose = require("mongoose"); 
// var db = global.db();

var CONN_DISCONNECTED = 0,
    CONN_DISCONNECTING = 3,
    CONN_CONNECTED = 1;

mongoose.promise = require("bluebird");

// var MONGOURL = "mongodb://revenue:revenue@ds249605.mlab.com:49605/revenue";
var MONGOURL = "mongodb://revenue:123456@ds157475.mlab.com:57475/revenue";


var options = {
	useMongoClient: true,
	socketTimeoutMS: 0,
	keepAlive: true,
	reconnectTries: 30
};

mongoose.connect(MONGOURL, options);
//var db = mongoose.connection;

var openConnection = function(callback) {

    if (mongoose.connection === undefined ||
                    mongoose.connection.readyState === CONN_DISCONNECTED ||
                    mongoose.connection.readyState === CONN_DISCONNECTING) {

        mongoose.connection.on('connected', function() {

            console.log('Db connected');

            if (callback) {
                callback(true);
            }
        });

        mongoose.connection.on('error', function(e) {
            console.log('Db connection error');
            if (callback) {
                callback(e);
            }else {
                console.log(e);
            }
        });

        mongoose.connect(MONGOURL);
    }else {
        if (callback) {
            callback(true);
        }
    }

};

var closeConnection = function () {
    if (mongoose.connection && mongoose.connection.readyState === CONN_CONNECTED) {
        mongoose.disconnect();

        mongoose.connection.removeAllListeners('connected');

        mongoose.connection.removeAllListeners('error');
    }
};


function Db(callback) {
    this.close = function() {
        closeConnection();
    };

    this.open = function(callback) {
        openConnection(callback);
        return mongoose;
    };

    //Let mongoose open and close the connection as we like.
    mongoose.open  = function(callback) {
        openConnection(callback);
        return mongoose;
    };

    mongoose.close = function() {
      closeConnection();
    };

    openConnection(callback);

    return mongoose;
}


module.exports = Db;