var env = require('jsdom').env;
var db = require('./db.js');
var dateTra = function(str){
	var date;
	var l = str.split('-');
	if(l[0].length === 4){
		date = l[0] + '-' + l[1] + '-01 11:11:11';
	}else{
		date = new Date().getUTCFullYear().toString() + '-' + str + ' 00:00:00';
	}
	return date;
}
module.exports = function(xml, emitter){
	var s = xml.match(/<ul id="thread_list"[\s\S]*<div class="thread_list_bottom clearfix">/g)[0]
						.split('<div class="thread_list_bottom clearfix">')[0];
	env(s, function(errors, window){
		if(errors){
			console.log(errors);
		};
		var document = window.document;
		var ul = document.getElementById('thread_list');
		var lis = ul.getElementsByClassName('j_thread_list');
		for(var i =0, j= lis.length; i < j; i++){
			try{
				if(lis[i].parentNode === ul ){
					var reply_number = lis[i].getElementsByClassName('threadlist_rep_num')[0].innerHTML;
					var titleEle = lis[i].getElementsByClassName('threadlist_title')[0].getElementsByTagName('a')[0];
					var title = titleEle.title;
					var href = titleEle.href;
					var authorEle = lis[i].getElementsByClassName('threadlist_author')[0].getElementsByTagName('a')[0];
					var createTime = lis[i].getElementsByClassName('threadlist_author')[0].getElementsByClassName('is_show_create_time')[0].innerHTML;
					var author = authorEle.innerHTML;
					var authorHref = authorEle.href;
					// console.log(createTime);
					db.insert({
						title : title,
						author : author,
						date : dateTra(createTime),
						reply_number : reply_number,
						url : href
					}, emitter);
				emitter.emit('finish',{dom:href});
				};
			}catch(e){
				console.log(e);
			}
		}
	});
}