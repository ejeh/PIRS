
var paymentStep1 = require("../model/paymentStep1.js");


function route(app){
	
	function randomElement (array) {
            return array[Math.floor(Math.random() * array.length)];
                    }
                    
                    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split(''),
                        result = '';
                    for (var i = 0; i < 8; i++) {
                        result += randomElement(characters);
                    }
        console.log(result);
        
        this.brn = result;

	app.post('/payment/create',(req, res) => {
	    
        

		var form = {
		    
			tin: req.body.tin,
			payment_for: req.body.payment_for,
			amount: req.body.amount,
			brn: this.brn,
			
		};
		
	  
		paymentStep1().create(form,(data,err) => {
		console.log(form);
		console.log(data);
			if(err){
				res.json({status: -200, message: "error processing your request, please try again", err: err});
				console.log("Show this if any : "+ err);
			}
			else{
			res.json({status: 200, message: "payment processing", data: data});
			console.log("Show this if any : "+data);
			}
			
			console.log(data);
		});

	
    });
}

module.exports.route = route;