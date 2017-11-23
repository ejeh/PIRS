var paymentStep1 = require("../model/paymentStep1.js");
var _ = require('lodash');
	 

	
function route(app){
	
	app.post('/paymentStep1/create',(req, res) => {
    	
    	function randomElement(array) {
            return array[Math.floor(Math.random() * array.length)];
                    }
                    
                    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split(''),
                        result = '';
                    for (var i = 0; i < 11; i++) {
                        result += randomElement(characters);
                    }
        console.log(result);
        
        this.username = result;
    	

		var form = {
			
			tin:			req.body.tin,
			payment_for:	req.body.payment_for,
			amount:			req.body.amount,
			username:		this.username,
			

		};
		
	   if(
	       _.isEmpty(req.body.tin) || _.isEmpty(req.body.payment_for)|| _.isEmpty(req.body.amount) 
	     //|| _.isEmpty(req.body.brn)
	     
	     )
		 
		  {
    			// return  res.json(form);
    			// console.log("all fields are required");
		  }
				
		var paymentStep1 = require("../model/paymentStep1");
		// var Reve = new paymentStep1();

		paymentStep1.create(form,(err,data) => {
		console.log(form);
		console.log(data);
			if(err){
				res.render('paymentStep2');
				console.log("welcome");
				// res.json({"status": 10, "message": "paymentStep1 not found", err: err});
				
			}
			else{
			res.render('paymentStep2');
			console.log("Show this if any : "+data.firstName);
			}
		}
		);


	});

	// app.post('/payment/create',(req, res) => {
	    
 //       function randomElement (array) {
 //           return array[Math.floor(Math.random() * array.length)];
 //                   }
                    
 //                   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split(''),
 //                       result = '';
 //                   for (var i = 0; i < 8; i++) {
 //                       result += randomElement(characters);
 //                   }
 //       console.log(result) 
        
 //       var brn = result;

	// 	var form = {
		    
	// 		tin: req.body.tin,
	// 		payment_for: req.body.payment_for,
	// 		amount: req.body.amount,
	// 		brn: req.body.brn,
			
	// 	};
		
	//   var pay = new paymentStep1();

	// 	pay.create(form,(data,err) => {
	// 	console.log(form);
	// 	console.log(data);
	// 		if(err){
	// 			res.json({status: -200, message: "error processing your request, please try again", err: err});
	// 			console.log("Show this if any : "+ err);
	// 		}
	// 		else{
	// 		res.json({status: 200, message: "payment processing", data: data});
	// 		console.log("Show this if any : "+data);
	// 		}
			
	// 		console.log(data);
	// 	});

	
 //   });
}

module.exports.route = route;