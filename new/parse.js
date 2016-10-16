var env = require('jsdom').env;
var emitter = require('./emiter.js')();


var getContent = function(doc, content){
		for(var j of content.childNodes){
			if( j && j.nodeType === 3){
				var tmp = doc.createElement('div');
				tmp.appendChild(j);
				var s = tmp.innerHTML.replace(/[\n\r\s\t]*/, '');
				if(s.length > 224){
					s = s.slice(0,224);
				}
				 return s;
			}
		}
};
var formateDate  = function(date){
	if(typeof date === 'number'){
		var realD = new Date(date);
	}else if(date.getTime){
		var realD = date;
	}
	var month = realD.getMonth()+1;
	return  realD.getFullYear() + '-' + month + '-' + realD.getDate() + ' ' + 
					realD.getHours() + ':' + realD.getMinutes() + ':' + realD.getSeconds();
};

var getComment = function(comment, themeHref){
	var post =[];
	for (key in comment['commentList']){
		if(comment['commentList'][key].length){
			for(var com of comment['commentList'][key]){
				if(comment['userList'][com['user_id']]){
					post.push({
						id : com['comment_id'],
						content : com['content'],
						author : comment['userList'][com['user_id']]['user_name'],
						create_time : formateDate(parseInt(com['now_time'])*1000),
						author_sex : 0,
						open_type : '',
						href : themeHref + '?pid=' + com['comment_id'] + '&cid=#' + com['comment_id'],
						theme_id: parseInt(comment['firstPost']['thread_id'])
					})
				}
			}
		}
	};
	return post;
};

var getLists = function(doc){
	var filterLists = [];
	var lists = doc.getElementsByClassName('l_post j_l_post l_post_bright');
	for(var list of lists){
		if(list.getAttribute('data-field')){
			filterLists.push(list);
		}
	};
	return filterLists;
};

var getReply = function(doc, list, themeHref, themeId){
	var post =[];
	for(var i = list.length, j = 0; j < i; j++){
		var json = JSON.parse(list[j].getAttribute('data-field'));
		var cont = getContent(doc, list[j].getElementsByClassName('d_post_content j_d_post_content')[0]);
		var author = json.author['user_name'];
		var postid = json.content['post_id'];
		var date = json.content['date'];
		var sexReference = {
			'0' : 0,
			'1' : '男',
			'2' : '女'
		};
		var userSex = sexReference[json.author['user_sex'].toString()];
		var openType = json.content['open_type'];
		post.push({
			id : postid,
			content : cont,
			author : author,
			create_time : date,
			author_sex : userSex,
			open_type : openType,
			href :themeHref + '?pid=' + postid + '&cid=#' + postid,
			theme_id : themeId
		});
	};
	return post;
};


var parseXML = function(xmlPost, xmlComt, themeHref){
	console.log('parse ing----parsed one comment xml');
	try {
		var commentData = JSON.parse(xmlComt.split(/<[^>]*>/g).join('【图片】').split('\\/').join('/').split("'").join('"'))[0];
		var comments = getComment(commentData, themeHref);
		var themeId = parseInt(commentData['firstPost']['thread_id']);
		env(xmlPost, function(errors, window){
			var doc = window.document;
			try{
				console.log('parse ing----parsed one reply xml in env');
				var Replys = getReply(doc, getLists(doc), themeHref, themeId);
				var pageData = Array.prototype.concat(Replys, comments);
				if( themeHref.match('pn=') ) {
					console.log('parse end----perpare insert pageData');
					emitter.emit ( 'db', pageData, false);
				} else {
					var theme = {
						id : themeId,
						date : Replys[0].create_time,
						author : Replys[0].author,
						title : commentData['firstPost']['title'],
						href : themeHref
					};
					console.log('parse end----perpare insert theme and pageData');
					emitter.emit('db', pageData, theme);
				}
				// console.log(theme);
				// console.log(pageData);
			} catch(e) {
				console.log(e.message);
				emitter.emit('next');
				// emitter.emit('err',themeHref);
			}
		});
	} catch(e) {
		console.log(e.message);
		emitter.emit('next')
	}
};

emitter.on('xml', parseXML);
