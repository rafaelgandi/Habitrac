self.Habitrac = self.Habitrac || {};
(function (self, z, Habitrac, ls, undefined) {
	Habitrac.Log = {};	
	var logCon = document.getElementById('log_con'),
		nl = "\n";		
	Habitrac.Log.report = function (_msg) {
		var con = logCon.innerHTML;
		//logCon.innerHTML = '> '+_msg+nl+con+nl;
		logCon.innerHTML = con+nl+'> '+_msg;
		if (self.console) {
			console.log(_msg);
		}		
	};
})(self, Zepto, self.Habitrac, self.localStorage);

