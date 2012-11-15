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
	};
	
	Habitrac.Logic.buildHabitList = function () {
		var html = '';
		Habitrac.Builder.getTemplate('habit_list.html', function (tpl) {
			for (var habit in Habitrac.Globals.habits) {
				if (Habitrac.Globals.habits.hasOwnProperty(habit)) {
					html = tweetTpl(tpl, {
						'habit': Habitrac.Globals.habits[habit],
						'habit_id': habit
					})+html;
				}
			}
			Util.getElementFromCache('#habit_list').html(html);
		});
	};
	
	Habitrac.Logic.logUserHabitAction = function (_habitId, _type) {
		_type = _type || 'didit';
		_habitId = trim(_habitId);
		var obj = {
				time: (new Date()).toString()
			};
		if (Habitrac.Globals.habitTimes[_habitId] === undefined) {
			alert('Unable to find habit with id: '+_habitId);
			return;
		}
		if (_type === 'didit') {
			obj.didit = 1; obj.fail = 0;
		}
		else {
			obj.didit = 0; obj.fail = 1;
		}
		Habitrac.Globals.habitTimes[_habitId].push(obj);
		Habitrac.Storage.store();
	};
	
})(self, Zepto, self.Habitrac, self.localStorage);