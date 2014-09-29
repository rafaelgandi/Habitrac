(function (self, z, Habitrac, ls, undefined) {
	Habitrac.Builder = {};
	var tplDir = Habitrac.Globals.tplDir;
	
	// See: https://groups.google.com/forum/#!topic/phonegap/wdQ4ga5Lkp0
	// See: https://code.google.com/p/android/issues/detail?id=21177
	// See: http://simonmacdonald.blogspot.com/2011/12/on-third-day-of-phonegapping-getting.html
	// See: https://groups.google.com/forum/#!msg/phonegap/1e0z4I9Ps68/pfxXSbzWIoMJ
	// See: http://stackoverflow.com/questions/13639736/xmlhttprequest-read-local-file-not-working-on-all-browsers
	Habitrac.Builder.get = function (_path, _callback) {
		_callback = _callback || function (res) {};
		// See: http://osdir.com/ml/phonegap/2012-10/msg00885.html
		var req = new XMLHttpRequest(),
			//path = _path + ((! isMobileAndroid()) ? '?'+(new Date()).getTime() : '');
			path = _path + '?' + (new Date()).getTime(); // LM: 09-28-2014 [Always add a cache buster]
		req.open("GET", path, true);
		req.onreadystatechange = function () {
		  if (req.readyState == 4) {
			if (req.status == 200 || req.status == 0) {
			  _callback(req.responseText);
			}
		  }
		};
		req.send(null);
	};
	
	Habitrac.Builder.ajaxTemplate = (function () {
		var cache = {};
		return function (_path, _callback) {
			_callback = _callback || function (r) {};
			if (!! cache[_path]) {
				_callback(cache[_path]);
				return;
			}
			Habitrac.Builder.get(tplDir+_path, function (res) {
				 cache[_path] = res;
				 _callback(cache[_path]);
			});
		};
	})();
	
	// Tweet Size Template Engine
	// See: http://mir.aculo.us/2011/03/09/little-helpers-a-tweet-sized-javascript-templating-engine/
	Habitrac.Builder.replace = function(s,d) {
		for(var p in d)
			s=s.replace(new RegExp('{'+p+'}','g'), d[p]);
		return s;
	};
	
	Habitrac.Builder.buildPages = function () {
		Habitrac.Builder.ajaxTemplate('menu_page.html', function (html) {
			Util.getElementFromCache('#app_menu_list').html(html);
		});
		Habitrac.Builder.ajaxTemplate('about_page.html', function (html) {
			Util.getElementFromCache('#about_page').html(html);
		});				
		Habitrac.Builder.ajaxTemplate('chart_page.html', function (html) {
			Util.getElementFromCache('#pie_con').html(html);
		});
		Habitrac.Builder.ajaxTemplate('new_habit_page.html', function (html) {
			Util.getElementFromCache('#new_habit_page').html(html);
		});
		Habitrac.Builder.ajaxTemplate('edit_habit_page.html', function (html) {
			Util.getElementFromCache('#edit_habit_page').html(html);
		});
	};
	
	
})(self, Zepto, self.Habitrac, self.localStorage);
Habitrac.Log.report('Habitrac.Builder.js loaded');