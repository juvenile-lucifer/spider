var http = require('http');
var emitter = require('./emiter.js')();
require('./parse.js');
require('./db.js');
http.globalAgent.keepAlive = true;
var httpConsole = function () {
	console.log('http...globalAgent......');
	console.log(http.globalAgent._eventsCount);
	console.log(http.globalAgent.requests);
};
var cont ={
	homePage : 'http://tieba.baidu.com/f?kw=%E6%AD%A6%E6%B1%89%E7%BA%BA%E7%BB%87%E5%A4%A7%E5%AD%A6&ie=utf-8&pn=',
	pn : 114000,
	waitTime : 0
};
var URLPool = ( function () {
	var pn =0;
	var pools = new Array(1000);
	var head = 0;
	console.log(pools[0]);
	console.log('18');
	var nextUrl = function () {
		var url = pools[head];
		pools[head] = null;
		if ( head ) {
			head--;
		} 
		console.log(url);
		console.log('get----send a url');
		return url;
	};
	var addUrl = function (url) {
		if ( url instanceof Array ) {
			var conTest =[];
			for (var i of url ) {
				if( head <= 1000 ) {
					head++;
					pools[head] = i;
					conTest.push(i);
				} else break;
			}
			console.log(conTest);
			console.log('add[' + url.length +']url');
		} else if (typeof url === 'string' ) {
			if ( head <= 1000 ) {
				head++;
				pools[head] = url;
				console.log(url);
				console.log('get----add one url')
			}
		}
	};
	var getHead = function () {
		return head;
	}
	return {
		pn : pn,
		addUrl : addUrl,
		nextUrl : nextUrl,
		getHead : getHead
	}
})();


var client = function(url){
	done(url);
	function done (url) {
		http.get(url, function(res){
			httpConsole();
			var byt = [];
			res.on('data', function(chunk){
				byt.push(chunk);
			});
			res.on('end', function(){
				try {
				var xml = Buffer.concat(byt).toString();
				if (url.match(/\/p\/\d*/)) {
					/*帖子页面*/
					var tmpTitle = xml.match(/<title>[^<]*/g);
					if ( tmpTitle && tmpTitle[0].match('武汉纺织大学吧') ) {
						if (xml.match( getNextPageUrl (url) ) ) {
							URLPool.addUrl (getNextPageUrl (url) );
						};
						var xmlPost = xml.match(/<div class="left_section" >[\s\S]*<div class="right_section/g)[0].split('<div class="right_section')[0];
						var xmlComt = xml.match(/ppb\/widget\/postList[\s\S]*ppb\/widget\/scrollEvent/g)[0].match(/\[[\s\S]*\]/g)[0];
						emitter.emit('xml', xmlPost, xmlComt, url);
						emitter.emit('next');
						console.log('get----emit a effective xml');
					} else {
						console.log('get----the url is probably a AD, to next');
						emitter.emit('next');
					}
				} else if (url.match('%E6%AD%A6%E6%B1%89%E7%BA%BA%E7%BB%87%E5%A4%A7%E5%AD%A6')) {
					/**首页贴*/
					if ( URLPool.getHead() < 900) {
						URLPool.addUrl( findUrl( xml ) );
						console.log('get----add a page of url');
					} 
					emitter.emit ('next');
				} else{
					console.log( 'get----the url is not in target area , to next' );
					emitter.emit('next');
				}
			} catch (e) {console.log(e);emitter.emit('next')};
			});
		}).on('error', function(e){
			console.log(e.message);
			emitter.emit('next');
		});
	}
};
var findUrl = function(xml){
	var realUrls = [];
	var hrefs = xml.match(/<\s*a[^<>]*>/g);
	for(var i = 0,j = hrefs.length; i < j; i++){
		if(hrefs[i].match(/href\s*=\s*"\/p[^"]*"/g)){
			realUrls.push('http://tieba.baidu.com' + hrefs[i].match(/href\s*=\s*"\/p[^"]*"/g)[0].split('"')[1]);
		}
	}
	console.log(realUrls);
	return realUrls;
};
var getNextPageUrl = function(url){
	var pn;
	var parseUrl = url.split('?');
	var baseUrl = parseUrl[0];
	if (parseUrl[1]) {
		if ( parseUrl[1].match(/pn=\d+/) ) {
			pn = parseInt( parseUrl[1].split( '=' )[1] );
		}
	} else {
		pn = 1;
	}
	return baseUrl + '?pn=' + pn;
}

var controlFun = function () {
	try {
		var head = URLPool.getHead ();
		if (head <= 50 ) {
			URLPool.pn += 50;
			client (cont.homePage + URLPool.pn)
			console.log('head');
			console.log(head);
		} else {
			var url = URLPool.nextUrl();
			if ( url ) {
				cont.waitTime = 0;
				client( url );
			} else { 
				if (cont.waitTime < 5 ) {
					cont.waitTime++;
					setTimeout (controlFun, 5000);
				} else {
					console.log('get----five times have no url');
					URLPool.pn += 50;
					client (cont.homePage + URLPool.pn);
				}
			}
		}
	} catch(e) {
		console.log('pn');
		console.log(URLPool.pn);
		console.log('head');
		console.log(URLPool.getHead());
		console.log(url);
		controlFun();
	}
};
emitter.on ('next' ,controlFun)

function start () {
	var url = cont.homePage + URLPool.pn;
	client(url);client(url);
	setTimeout(function(){
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
	}, 5000);
		setTimeout(function(){
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
	}, 6000);
			setTimeout(function(){
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
	}, 7000);
				setTimeout(function(){
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
		controlFun();controlFun();
	}, 8000);
};
start();