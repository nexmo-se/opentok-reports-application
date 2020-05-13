var express = require('express');
var router = express.Router();

var reportsRouter = require('./report');
var healthRouter = require('./health');


function Router() {
	console.log('Init Router function');
	/* GET home page. */
	router.get('/', function (req, res, next) {
		res.render('index', { title: 'Express' });
	});

	router.use('/report', reportsRouter());
	router.use('/health', healthRouter());
	
	return router;
}

module.exports = Router;
