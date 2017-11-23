var paymentStep1 = require("../model/paymentStep1.js");
// var _ = require('lodash');


function randomElement (array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandom(){
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
    var result = '';
    for (var i = 0; i < 11; i++) {
        result += randomElement(characters);
    }
    this.brn = result;
}


function insertBRN(brn, req, res, data){

    brn.create(data, (err, rslt) => {
        if(err){
            //KNock yaSE;LF Out
        }
        else{
            res.send({status: 11, message: "BRN generated", data: data})
        }
    });

}

function generateBRN_bruteforce(brn, req, res, iteration_limit){
    var value = getRandom();
    brn.findById(value, (err, data) => {
        if(err){
            data = req.body; 
            data['brn'] = value;
            insertBRN(brn, req, res, data);
        }else{
            if(iteration_limit >= 10){
                console.log("Random Token generation is failing...");
                res.send({status: -10, message: "BRN generator failed", data: data});
            }
            else{
                generateBRN_bruteforce(brn, req, res, iteration_limit + 1); 
            }
        }
    });
}

function route(app){
app.post('/generate_brn', (req, res, next) => {
        var pay = new paymentStep1();
        //! TODO: validate req.body to required params
        generateBRN_bruteforce(this.brn, req, res, 0);
        
		var form = {
		    
			tin: req.body.tin,
			payment_for: req.body.payment_for,
			amount: req.body.amount,
			brn: this.brn,
			
		};
		
	  
		pay.create(form,(data,err) => {
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

	
    
        
        generateBRN_bruteforce(this.brn, req, res, 0);		
});

}

module.exports.route = route;