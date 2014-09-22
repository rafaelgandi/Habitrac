function isMobileAndroid() {
	// This function only takes into consideration andorid devices.
	// See: http://www.abeautifulsite.net/blog/2011/11/detecting-mobile-devices-with-javascript/
	return !! navigator.userAgent.toLowerCase().match(/android/i);
}
// See: http://www.nczonline.net/blog/2009/06/23/loading-javascript-without-blocking/
function loadScript(url, callback){
    var script = document.createElement("script"),
		callback = callback || function () {};
    script.type = "text/javascript";  
	script.onload = function(){
		callback();
	};
	// Don't use  querystring cache busters as it will cause issues 
	// in android 4.0+ Use it only on the browser, hence the isMobileAndroid()
	// checker function.
	// See: http://code.google.com/p/android/issues/detail?id=17535
    //script.src = url + ((! isMobileAndroid()) ? '?'+(new Date()).getTime() : '');
    script.src = url + '?'+(new Date()).getTime();
    document.body.appendChild(script);
}


Zepto(function (z) {	
	Mui.setHeaderMarkup({
		'habit_list_page': {
			'label': '<img src="images/logo.png">Habitrac',
			'buttons': '<button id="add_habit_h_button" data-hlightclass="header_b_hlight"><img src="images/add_queue.png"></button>' +
					   '<button class="exit" data-hlightclass="header_b_hlight"><img src="images/x.png"></button>'			
		},
		'new_habit_page': {
			'label': '<img src="images/logo.png">New Habit',
			'buttons': '<button id="back2list" data-hlightclass="header_b_hlight"><img src="images/back_button.png"></button>' +	
					   '<button class="exit" data-hlightclass="header_b_hlight"><img src="images/x.png"></button>'			
		},
		'edit_habit_page': {
			'label': '<img src="images/logo.png">Edit Habit',
			'buttons': '<button id="back2list" data-hlightclass="header_b_hlight"><img src="images/back_button.png"></button>' +	
					   '<button class="exit" data-hlightclass="header_b_hlight"><img src="images/x.png"></button>'			
		},
		'chart_page': {
			'label': '<img src="images/logo.png">Habit Pie',
			'buttons': '<button id="back2list" data-hlightclass="header_b_hlight"><img src="images/back_button.png"></button>' +	
					   '<button class="exit" data-hlightclass="header_b_hlight"><img src="images/x.png"></button>'			
		},
		'menu_page': {
			'label': '<img src="images/logo.png">Settings',
			'buttons': '<button id="back2list" data-hlightclass="header_b_hlight"><img src="images/back_button.png"></button>' +	
					   '<button class="exit" data-hlightclass="header_b_hlight"><img src="images/x.png"></button>'			
		},
		'about_page': {
			'label': '<img src="images/logo.png">About',
			'buttons': '<button id="back2list" data-hlightclass="header_b_hlight"><img src="images/back_button.png"></button>' +	
					   '<button class="exit" data-hlightclass="header_b_hlight"><img src="images/x.png"></button>'			
		},
		'logs_page': {
			'label': '<img src="images/logo.png">Logs',
			'buttons': '<button id="back2list" data-hlightclass="header_b_hlight"><img src="images/back_button.png"></button>' +	
					   '<button class="exit" data-hlightclass="header_b_hlight"><img src="images/x.png"></button>'			
		}
	})
	.buildHeaderMarkupForPageId('habit_list_page');
	
});	