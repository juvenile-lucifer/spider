var mysql = require('mysql');
var cont = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '',
	database : 'tieba'
});
cont.connect();
cont.query('SELECT reply_number FROM post WHERE ')
exports.insert = function(data, emitter){
	cont.query('INSERT INTO `post` SET ?', data,  function(error, rows, fields){
		emitter.emit('finish', {sql : data.url});
		if (error) 
			console.log(error);
		
	});
}
