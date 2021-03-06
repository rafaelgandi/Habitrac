/* 
	Run When JS
		- Javascript code dependency checker	
	See: https://github.com/rafaelgandi/RunWhen
	LM: 09-30-12 
	Version: 0.1
 */
var runwhen = (function (self) {
	var cachedChecks = {},
		check = function (_checks) {
			var i = _checks.length;
			while (i--) {
				if (!! cachedChecks[_checks[i]]) { continue; } // Check cache, try to avoid eval()
				try {
					eval('if(typeof '+_checks[i]+' === \'undefined\'){throw \'e\';}');
					cachedChecks[_checks[i]] = !0;
				} 
				catch(e) { return !1; }	
			}	
			return !0;
		};
	return function (_checks, _run) {	
		var CHECK_DURATION = 1;
		if (! (_checks instanceof Array)) { _checks = [_checks]; } // Force _checks to be array
		(function loop () {
			if (check(_checks)) { _run.call(self); }
			else {
				// After 200 checks, call callback function //
				if (CHECK_DURATION > 200) { _run.call(self); return; }
				CHECK_DURATION++;
				self.setTimeout(loop, 10);
			}
		})();
	};
})(self);