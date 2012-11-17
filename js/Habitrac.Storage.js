(function (self, z, Habitrac, ls, undefined) {
	Habitrac.Storage = {};
	
	Habitrac.Globals.habits = (function () {
		if (!! ls.getItem('habits')) {
			return JSON.parse(ls.getItem('habits'));
		}
		else {
			ls.setItem('habits', '{}');
			return {};
		}
	})();
	Habitrac.Globals.habitTimes = (function () {
		if (!! ls.getItem('habit_times')) {
			return JSON.parse(ls.getItem('habit_times'));
		}
		else {
			ls.setItem('habit_times', '{}');
			return {};
		}
	})();

	Habitrac.Storage.store = function () {
		ls.setItem('habits', JSON.stringify(Habitrac.Globals.habits));
		ls.setItem('habit_times',  JSON.stringify(Habitrac.Globals.habitTimes));
	};
	
	Habitrac.Storage.deleteHabit = function (_habitId) {
		delete Habitrac.Globals.habits[_habitId];
		delete Habitrac.Globals.habitTimes[_habitId];
		Habitrac.Storage.store();
		try {Habitrac.Logic.notify('Habit with id '+_habitId+' has been deleted');} catch(e){}
	};
	
	Habitrac.Storage.clear = function () {
		ls.clear();
		ls.setItem('habits', '{}');
		ls.setItem('habit_times', '{}');
	};
	
	
})(self, Zepto, self.Habitrac, self.localStorage);