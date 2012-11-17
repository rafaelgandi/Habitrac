(function (self, z, Habitrac, ls, undefined) {
	Habitrac.Builder = {};
	var tplDir = Habitrac.Globals.tplDir;
	
	Habitrac.Builder.ajaxTemplate = (function () {
		var cache = {};
		return function (_path, _callback) {
			_callback = _callback || function (r) {};
			if (!! cache[_path]) {
				_callback(cache[_path]);
				return;
			}
			z.get(tplDir+_path+'?_'+(new Date()).getTime(), function (res) {
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
	
	
})(self, Zepto, self.Habitrac, self.localStorage);