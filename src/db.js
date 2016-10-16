var mysql = require('mysql');
var cont = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '',
	database : 'tieba'
});
// var post = {
// 	title : 'node测试',
// 	author : 'peter',
// 	date : '2016-10-04 23:44:15',
// 	reply_number : '82',
// 	url : 'github.com'
// };
cont.connect();
exports.insert = function(data, emitter){
	cont.query('INSERT INTO `post` SET ?', data,  function(error, rows, fields){
		emitter.emit('finish', {sql : data.url});
		if (error) 
			console.log(error);
		
	});
}
