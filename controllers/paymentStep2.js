var paymentStep2 = require("../model/paymentStep2.js");
// var multer = require("multer");
// var upload = multer({dest:'uploads/'});
	 var _ = require('lodash');

	
function route(app) {
	
    
	app.post('/paymentStep2/create',(req, res) => {

		var form = {
		    
		
			account_id: req.body.account_id, 
			account_name: req.body.amount,
			amount: req.body.payment_for,
			methodofpayment: req.body.methodofpayment,
			card_number: req.body.card_number,
			card_number_pin: req.body.card_number_pin,
			
			
		};
		
	   if(
	       _.isEmpty(req.body.tin) || _.isEmpty(req.body.amount)|| _.isEmpty(req.body.payment_fo)
	     
	     )
		 
		  {
    			// return  res.json(form);
    			console.log("all fields are required");
		  }
				
		// var paymentStep2 = require("../model/paymentStep2.js");
		var pay = new paymentStep2();

		pay.create(form,(err,data) => {
		console.log(form);
		console.log(data);
			if(err){
				res.json(err);
				console.log("welcome");
				res.json({"status": 10, "message": "payment not found", err: err});
				console.log("Show this if any : "+ err);
			}
			else{
			res.json({"status": 10, "message": "payment found", data: data});
			console.log("Show this if any : "+data.tin);
			}
		}
		);


	});

	app.get('/payment/all', (req, res, next) => {

		var payment = require("../model/payment.js").payment;
		var pay = new payment();

		pay.findAll( (data) => {
			res.json({"status": 11, "message": "payment list", data: data});
		});
	});



}

module.exports.route = route;

