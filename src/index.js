var http = require('http');
var fs = require('fs');
var parse = require('./parse.js');
var env = require('jsdom').env;
var events = require('events');
var emitter = new events.EventEmitter();
var pn = 0;
var url1,url2;
var done = function(){
	http.get('http://tieba.baidu.com/f?kw=%E6%AD%A6%E6%B1%89%E7%BA%BA%E7%BB%87%E5%A4%A7%E5%AD%A6&ie=utf-8&pn=' + pn, function(res){
	var byt = [];
	res.on('data', function(chunk){
		byt.push(chunk);
	})
	res.on('end', function(){
		var xml = Buffer.concat(byt).toString();
		parse(xml,emitter);
	})
});
	pn+=50;
}
done();
var coor = function(ob){
	console.log(ob);
	if(ob.dom){
		url1 = ob.dom;
	}else{
		url2 = ob.sql;
		console.log(url1);
		console.log(url2);
		if(url2 ===url1){
			console.log('complete');
			done();
		}
	}
}
emitter.on("finish", coor);