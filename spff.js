/*
* This will include selected stuff from SPFF codeplex solution.
* Only need the text box stuff.
* 
* @requires jQuery 1.3.1
*/
//module pattern
(function(){
	var params=window.location.search.substring(1).split("&"),
	kv={};
	opts,
	sp=/%20|\+/g,
	datetime=/([1-9]|0[1-9]|1[012])[\-\/\.]([1-9]|0[1-9]|[12][0-9]|3[01])[\-\/\.](19|20)\d\d\s([0-1][0-2]|[0-9]):([0-9]{2})\s(A|P)M/i,
    date=/([1-9]|0[1-9]|1[012])[\-\/\.]([1-9]|0[1-9]|[12][0-9]|3[01])[\-\/\.](19|20)\d\d/,
    clean=function(str){
    	return str.replace(sp," ");
    },
    getKv=function(){
    	$.each(params,function(i,e){
    		var p=e.split("=");
    		kv[p[0]]=decodeURIComponent(p[1]);
    	});
    	return kv;
    },
    defaults={
    	lock:false,
    	lockColor:"#ccc",
    	lockBkg:{
    		"background":"url('/_layouts/images/IMNDND.png') no-repeat right"
    	}
    };
})