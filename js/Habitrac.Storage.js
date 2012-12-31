(function (self, z, Habitrac, ls, undefined) {
	Habitrac.Storage = {};
	
	/* 
		Sample stored json data:
		habits => {"1353214748646":"gdsgdsgsfdg","1353214754325":"dsfgertewt rt sgdfgsdg","1353214759533":"dgfdg dfgdfg dgdfgdfg"}
		habit_times => {"1353214748646":[],"1353214754325":[{"t":1353214767216,"d":1,"f":0},{"t":1353214769752,"d":0,"f":1},{"t":1353214770872,"d":1,"f":0}],"1353214759533":[{"t":1353214771976,"d":1,"f":0}]}
	*/
	
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
		Habitrac.Log.report('All habits stored in local storage.');
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
		Habitrac.Log.report('ALL LOCALSTORAGE DATA DELETED!');
	};
	
	Habitrac.Storage.import = function (_data) {
		// JSON parsing borrowed from Skycable app //
		_data = trim(_data);
		try { r = JSON.parse(_data); }
		catch (e) { 
			try {
				eval('r='+_data+';');
			}
			catch(lastResort){
				alert('Unable to import, invalid JSON found.');
				Habitrac.Log.report('INVALID JSON FOUND ON IMPORT');
				Habitrac.Log.report(lastResort.toString());
				return false;
			}						
		}
		Habitrac.Storage.clear();
		Habitrac.Globals.habits = r.habits;
		Habitrac.Globals.habitTimes = r.habitTimes;
		Habitrac.Storage.store();
		Habitrac.Log.report('Import from ' + r.date);
		return true;
	};
	
	
})(self, Zepto, self.Habitrac, self.localStorage);

Habitrac.Log.report('Storage script loaded');