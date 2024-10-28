require('express-async-errors');
const winston = require('winston');
module.exports = function(){
	winston.add(winston.transports.File,{filename:'logfile.log'});
	winston.handleExceptions(
	new winston.transports.Console({colorize:true, prettyPrint:true}),
	new winston.transports.File({filename:'uncoughtException.log'}));

	
	process.on('unhandledRejection',(ex)=>{
		throw ex;
	});
}