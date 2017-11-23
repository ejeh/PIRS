var paymentStep1  = require('./paymentStep1.js');
var paymentStep2  = require('./paymentStep2.js');
var revenue       = require('./revenue.js');


function route(app){
    
            paymentStep1.route(app);
            paymentStep2.route(app);
            revenue.route(app);
         }

module.exports.route = route;