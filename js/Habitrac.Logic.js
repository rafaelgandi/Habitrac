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
			tpl = document.getElementById('habit_list_tpl').innerHTML;
		Util.getElementFromCache('#habit_list').html('');	
		for (var habit in Habitrac.Globals.habits) {
			if (Habitrac.Globals.habits.hasOwnProperty(habit)) {
				html = Habitrac.Builder.replace(tpl, {
					'habit': Habitrac.Globals.habits[habit],
					'habit_id': habit
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
		});
	};
	
	Habitrac.Logic.hideHabitListMenu = function () {		
		Util.getElementFromCache('#habitrac_menu_list').html('');
		Util.getElementFromCache('#habitrac_menu_popup_con').addClass('hide');
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

	
})(self, Zepto, self.Habitrac, self.localStorage);