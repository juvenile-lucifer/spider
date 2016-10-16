var events = require('events');
var emitter = new events.EventEmitter();
module.exports = function(){
	return emitter;
}