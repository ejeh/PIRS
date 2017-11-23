var revenue = require("../model/revenue.js");
// var multer = require("multer");
// var upload = multer({dest:'uploads/'});
	 var _ = require('lodash');

	
function route(app) {
	
    
	app.post('/revenue/create',(req, res) => {

		var form = {
		
			firstName: req.body.firstName,
			lastName: req.body. lastName,
			username: req.body.username,
			password:req.body.password,
			tin:req.body.tin,
			email: req.body.email,

		};
		
	   if(
	       _.isEmpty(req.body.firstName) || _.isEmpty(req.body.lastName)|| _.isEmpty(req.body.phone_no) 
	     || _.isEmpty(req.body.password)   || _.isEmpty(req.body.tin)|| _.isEmpty(req.body.email)
	     
	     )
		 
		  {
    			// return  res.json(form);
    			console.log("all fields are required");
		  }
				
		var revenue = require("../models/revenue.js");
		var Reve = new revenue();

		Reve.create(form,(data,err) => {
		console.log(form);
		console.log(data);
			if(err){
				res.json(err);
				console.log("welcome");
				res.json({"status": 10, "message": "revenue not found", err: err});
				console.log("Show this if any : "+ err);
			}
			else{
			res.json({"status": 10, "message": "revenue found", data: data});
			console.log("Show this if any : "+data.firstName);
			}
		}
		);


	});

	app.get('/revenue/all', (req, res, next) => {

		var revenue = require("../models/revenue.js").revenue;
		var Reve = new revenue();

		Reve.findAll( (data) => {
			res.json({"status": 11, "message": "revenue list", data: data});
		});
	});



	app.get('/revenue/l/:id', (req, res, next) => {

		// var nWatch = require("../models/revenue.js").revenue;

		var Reve = new revenue();

		if (req.params.id === "") {
			
			res.json({ "status": "-102", "info": "(id) parameter is required" });
			return;
		}

		var id = req.params.id;
		Reve.findById(id, (data) => {
			res.json({"status": 11,"message": "revenue found", data: data});
		});
	});

	app.put('/revenue/update/:id', (req, res) => {
	    
		var form = {
		    
			firstName: req.body.firstName,
			lastName: req.body. lastName,
			username: req.body.username,
			password:req.body.password,
			tin:req.body.tin,
			email: req.body.email,
		};
	
		var Reve= new revenue();
		Reve.findByIdAndUpdate(req.params.id, form,  (data, err) => {
			console.log(data);
			res.json({"status": 12, "message": "revenue record updated", data: data});
		});

	});

	app.delete('/revenue/delete/:id', (req, res, next) => {

		var revenue = require("../models/revenue.js");
		var Reve = new revenue();

		if (req.params.id === "") {
			res.json({ "status": "-102", "info": "(id) parameter is required" });
			return;
		}
		var id = req.params.id;
		
		Reve.deleteById(id, (data) => {
		    
			res.json({"status": 13, "message": "record deleted successfully", data: data});
		});
	});



}

module.exports.route = route;

