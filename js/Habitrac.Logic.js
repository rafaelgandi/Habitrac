(function (self, z, Habitrac, ls, undefined) {
	Habitrac.Logic = {};
	Habitrac.Logic.exitApp = function () {
		Habitrac.Storage.store();
		try {
			navigator.app.exitApp();
		}
		catch(e) {
			alert('ERROR: navigator.app.exitApp() - '+e.toString());
			navigator.device.exitApp();
		}
	};
	
	Habitrac.Logic.saveNewHabit = function (_habit) {
		var habit = trim(_habit),
			d = new Date(),
			time = d.getTime();
		Habitrac.Globals.habits[time] = habit;
		Habitrac.Globals.habitTimes[time] = [];
		Habitrac.Storage.store();
		Habitrac.Logic.notify('New habit saved!');
	};
	
	Habitrac.Logic.saveEdittedHabit = function (_habitId, _habit) {
		var habit = trim(_habit),
			scrollPos = Mui.getPageScrollPosition('habit_list_page');
		Habitrac.Globals.habits[_habitId] = habit;
		Habitrac.Storage.store();
		Habitrac.Logic.notify('Habit updated!');		
		Mui.gotoPage('habit_list_page');
		setTimeout(function () {
			self.scrollTo(0, scrollPos);
		}, 100);
	};
	
	Habitrac.Logic.buildHabitList = function () {
		var html = '',
			tpl = document.getElementById('habit_list_tpl').innerHTML,
			bar;
		Util.getElementFromCache('#habit_list').html('');	
		for (var habit in Habitrac.Globals.habits) {
			if (Habitrac.Globals.habits.hasOwnProperty(habit)) {
				bar = Habitrac.Chart.getQuickBarGraphData(habit);
				html = Habitrac.Builder.replace(tpl, {
					'habit': Habitrac.Globals.habits[habit],
					'habit_id': habit,
					'fail_bar': bar.fail,
					'didit_bar': bar.didit
				}) + html;
			}
		}
		Util.getElementFromCache('#habit_list').html(html)
	    // See: http://stackoverflow.com/a/4448972
	    .find('span.habit_label').attr('unselectable', 'on')
	   .each(function () {
			// See: http://stackoverflow.com/a/2310809
			if (typeof this.onselectstart != 'undefined') {
				this.onselectstart = function() { return false; };
			}
			var $me = z(this),
				width = $me.width();
			$me.append('<div class="habit_label_cover">&nbsp;<div>')
			   .find('div.habit_label_cover')
			   .css('width', width+'px');
	    });
		
		// See: http://stackoverflow.com/a/11893084
		Util.getElementFromCache('#habit_list_page').css('height', '100%');
		
	};
	
	Habitrac.Logic.highlightList = function (_$li, _class) {
		_$li.addClass(_class);
		setTimeout(function () {
			_$li.removeClass(_class);
		}, 200);
	};
	
	Habitrac.Logic.notify = (function () {
		var timer;
		return function (_msg) {
			clearTimeout(timer);
			Util.getElementFromCache('#notification span').html(_msg);
			Util.getElementFromCache('#notification').show().css({opacity:1});				
			timer = setTimeout(function () {
				Util.getElementFromCache('#notification').animate({opacity: 0}, {
					duration: 300,
					complete: function () {
						Util.getElementFromCache('#notification span').html('---');
						Util.getElementFromCache('#notification').hide();
					}
				});
			}, 3e3);
		};
	})();
	
	Habitrac.Logic.showHabitListMenu = function (_habitId) {
		var html = '';
		Habitrac.Builder.ajaxTemplate('habit_list_menu.html', function (tpl) {
			html = Habitrac.Builder.replace(tpl, {			
				'habit_id': _habitId
			});
			Util.getElementFromCache('#habitrac_menu_list').html(html);
			Util.getElementFromCache('#habitrac_menu_popup_con').removeClass('hide');
			// LM: 09-28-2014 [Add scale animation]
			// Easing:
			// See: http://codepen.io/jamesdelaneyie/pen/yidkA/
			// See: http://matthewlein.com/ceaser/
			Util.getElementFromCache('#habitrac_menu_popup_con').animate({
				scale:'1'
			// "Swift Out" material design easing(cubic-bezier)
			// See: http://www.google.com/design/spec/animation/authentic-motion.html#authentic-motion-mass-weight	
			}, 80, Habitrac.Globals.materialDesignEasingSwiftOut);
		});
	};
	
	Habitrac.Logic.hideHabitListMenu = function () {		
		Util.getElementFromCache('#habitrac_menu_list').html('');
		Util.getElementFromCache('#habitrac_menu_popup_con').addClass('hide');
		// LM: 09-28-2014 [Shrink scale]
		Util.getElementFromCache('#habitrac_menu_popup_con').animate({
			scale: '0.5'
		}, 0);
	};
	
	Habitrac.Logic.logUserHabitAction = function (_habitId, _type) {
		_type = _type || 'didit';
		_habitId = trim(_habitId);
		var obj = {
				t: (new Date()).getTime()
			};
		if (Habitrac.Globals.habitTimes[_habitId] === undefined) {
			alert('Unable to find habit with id: '+_habitId);
			return;
		}
		if (_type === 'didit') {
			obj.d = 1; obj.f = 0;
		}
		else {
			obj.d = 0; obj.f = 1;
		}
		Habitrac.Globals.habitTimes[_habitId].push(obj);
		Habitrac.Storage.store();
	};
	
	Habitrac.Logic.showChart = function (_habitId) {
		_habitId = trim(_habitId);
		Mui.gotoPage('chart_page', _habitId);
	};
	
	Habitrac.Logic.deviceDiagnostics = function () {
		// Device diagnostics //
		try {
			Habitrac.Log.report('---------- DEVICE DIAGNOSTICS ---------');
			Habitrac.Log.report(navigator.userAgent);
			Habitrac.Log.report('SCREEN WIDTH: '+screen.width);
			Habitrac.Log.report('SCREEN HEIGHT: '+screen.height);
			Habitrac.Log.report('availwidth: '+screen.availWidth);
			Habitrac.Log.report('availheight: '+screen.availHeight);
			Habitrac.Log.report('colorDepth: '+screen.colorDepth);
			Habitrac.Log.report('window.console: ' + (typeof self.console));
			
			// phonegap stuff //
			Habitrac.Log.report('device name: '+device.name);
			Habitrac.Log.report('cordova: '+device.cordova);
			Habitrac.Log.report('platform: '+device.platform);
			Habitrac.Log.report('os version: '+device.version);
			Habitrac.Log.report('model: '+device.model);
			Habitrac.Log.report('uuid: '+device.uuid);			
			Habitrac.Log.report('---------------------------------------');
		}
		catch (err) {
			Habitrac.Log.report('Unable to get screen.width');
		}		
	};

	
})(self, Zepto, self.Habitrac, self.localStorage);
Habitrac.Log.report('Habitrac.Logic.js loaded');