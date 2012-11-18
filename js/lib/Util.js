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
	}
};