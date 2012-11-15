(function (self, z, Habitrac, ls, undefined) {
	Habitrac.Builder = {};
	var tplDir = Habitrac.Globals.tplDir;
	
	Habitrac.Builder.getTemplate = (function () {
		var cache = {};
		return function (_path, _callback) {
			_callback = _callback || function (r) {};
			if (!! cache[_path]) {
				_callback(cache[_path]);
				return;
			}
			z.get(tplDir+_path, function (res) {
				 cache[_path] = res;
				 _callback(cache[_path]);
			});
		};
	})();
	
})(self, Zepto, self.Habitrac, self.localStorage);