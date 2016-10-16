var emitter = require('./emiter.js')();
var mysql = require('mysql');
var pool = mysql.createPool({
	host : 'localhost',
	user : 'root',
	password : '',
	database : 'tieba' ,
	connectionLimit : 300,
});
function insert (table, data) {
	pool.getConnection ( function (err, connection) {
		if (err) {
			console.log(err);
		} else{
		connection.query ('INSERT INTO `' + table + '` SET ?', data, function (err, rows) {
			if(err) {
				console.log(err) ;
			}
			if (connection) {

				connection.release();
			};
			console.log('db----pool _freeConnections length');
			console.log(pool._freeConnections.length)
			// console.log('pool _freeConnections')
			// console.log(pool._freeConnections.length);
			// console.log('pool _connectionQueue')
			console.log(pool._connectionQueue.length);
		})
	}
	})
}

var storeData = function(pageData, theme){
	if(theme && theme.id){
		insert('theme1', theme);
	}
	for (var i of pageData) {
		insert ('reply1', i)
	}	
	// emitter.emit('next')
}

emitter.on('db', storeData);
