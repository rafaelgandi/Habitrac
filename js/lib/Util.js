window.Util = {		
	// See: http://stackoverflow.com/a/2673229
	isEmptyObject: function (obj) {
	  for (var prop in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, prop)) {
		  return false;
		}
	  }
	  return true;
	},
	
	today : (function () {
		var today = new Date(),
			d = (today.getDate() < 10) ? ('0'+today.getDate()) : today.getDate(),
			m = (today.getMonth()+1);
		m = (m < 10) ? ('0'+m) : m;				
		return {
			dateBare: today.getDate(),
			date: d,
			month: m,
			year: today.getFullYear(),
			timestamp: Math.floor(today.getTime() / 1000),
			dateFormatted: (m+'/'+d+'/'+today.getFullYear()) // format: MM/DD/YYYY
		};
	})(),
	
	getDayName: (function () {
		var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
			cache = {};
		return function (_date) {
			if (!(_date in cache)) {
				cache[_date] = days[(new Date(_date)).getDay()];
			}
			return cache[_date];
		};
	})(),
	
	removeEmptyObjects: function (_objs) {
		for (var p in _objs) {
			if (_objs.hasOwnProperty(p)) {
				if (Util.isEmptyObject(_objs[p])) {
					delete _objs[p];
				}
			}
		}
		return _objs;
	},
	
	getElementFromCache: (function () {
		var elems = {};
		return function (_selector, _useKey) {
			var selector = (typeof _useKey !== 'undefined') ? _useKey : _selector;		
			if (!elems[_selector]) {
				elems[_selector] = (typeof selector.selector !== 'undefined') ? selector : z(selector);
			}
			return elems[_selector];
		};			
	})(),
	
	confirm: function (_o) {
		if (typeof navigator.notification.confirm !== 'undefined') {
			navigator.notification.confirm(
				_o.message,
				function (button) {
					_o.callback.call(this, button);
				},
				_o.title, _o.buttons
			);
		}
		else { // old fashioned			
			_o.callback.call(this, confirm(_o.message));
		}
	},
	
	findPos: function (obj) {
		// See: http://clifgriffin.com/2008/10/14/using-javascript-to-scroll-to-a-specific-elementobject/
		var curtop = 0;
		if (obj.offsetParent) {
			do {
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
		return curtop;
		}
	},
	
	scrollTo: function (_elem) {
		// No really sure why i need a timeout here, but it only scrolls with a timeout.
		setTimeout(function () { 
			self.scrollTo(0, Util.findPos(_elem));
		}, 0);	
	},
	
	sortTime: (function () {
		var cache = {};				
		return function (_arr) {
			var date = Util.today.dateFormatted;
			_arr.sort(function (a, b) {
				var akey = date+' '+a.time,
					bkey = date+' '+b.time;
				if (!(akey in cache)) {
					cache[akey] = (new Date(akey)).getTime();
				}
				if (!(bkey in cache)) {
					cache[bkey] = (new Date(bkey)).getTime();
				}
				var aTime = cache[akey], bTime = cache[bkey];
				aTime = (isNaN(aTime)) ? 0 : aTime;	
				bTime = (isNaN(bTime)) ? 0 : bTime;						
				return (aTime < bTime) 
							? -1
							: (aTime > bTime) ? 1 : 0;
			});
			return _arr;
		};
	})()
};