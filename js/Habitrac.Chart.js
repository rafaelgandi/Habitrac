(function (self, z, Habitrac, ls, undefined) {
	Habitrac.Chart = {};
	var doneDatePickerSetup = false;
	
	// See: http://blog.crondesign.com/2012/05/simple-javascript-pie-chart-using-html5.html
	// See: http://reubencrane.com/blog/?p=4
	var pieProps = {};
	/* function W(x,y,r,u,v) {
		// LM: 09-23-2014
		// fill() bug here won't work on desktop chrome browser, but seems
		// to be working fine on the device.
		// See: https://github.com/ericdrowell/KineticJS/issues/244
		var a = pieProps.a
		r ? a.beginPath() | a.fill(a.moveTo(x,y)|a.arc(x,y,r,(u||0)/50*Math.PI,(v||7)/50*Math.PI,0)|a.lineTo(x,y))
		: a.fillStyle = '#'+pieProps.colors[pieProps.i++];
		return W;
	} */
	
	// LM: 04-28-2015 [fixed fill() bug]
	function W(x, y, r, u, v) {
		var a = pieProps.a;
		if (r) {
			a.beginPath();
			a.moveTo(x, y);
			a.arc(x, y, r, (u || 0) / 50 * Math.PI, (v || 7) / 50 * Math.PI, 0);
			a.lineTo(x, y);
			a.fill();
		} else {
			a.fillStyle = '#'+pieProps.colors[pieProps.i++];
		}
		return W;
	}
	
	// LM: 10-02-1014
	// Function to completely wipe a canvas element by replacing it with a 
	// clone of the old canvas element.
	function canvasWipe(_id) {
		var $canvasOld = z('#'+_id),
			$clone, $parent;
		if (! $canvasOld.length) { return document.getElementById(_id); }
		$parent = $canvasOld.parent();
		$clone = $canvasOld.clone();
		$canvasOld.remove();
		$parent.append($clone);
		return $clone[0];
	}
	
	Habitrac.Chart.pie = function (canvas, radius, percentages, n, colors) {
		Habitrac.Log.report('Making pie chart now');
		//var canvas = document.getElementById(canvas);
		var canvas = canvasWipe(canvas); // LM: 10-02-1014
		var a = pieProps.a = canvas.getContext("2d");
		// LM: 09-23-2014
		// Clear the canvas content first.
		// See: http://www.html5canvastutorials.com/advanced/html5-clear-canvas/
		a.clearRect(0, 0, canvas.width, canvas.height);	
		pieProps.colors = colors;
		pieProps.i = 0;
		canvas.width = 3.5*radius;
		canvas.height = 2.5*radius;
		x = y = canvas.height/2;
		a.font = "bold 11px Arial";
		var u = 0;
		var v = 0;
		for (i=0;i < percentages.length;i++) {
			v += percentages[i];
			W(i)(x,y,radius,u,v);
			u = v;
			a.fillText(n[i], x+radius+10, y-radius/2+i*18);
		}
	};
	
	Habitrac.Chart.setUpMobiscroll = function () {
		var $dateField = Util.getElementFromCache('#chart_date_from, #chart_date_to'),
			$header = Util.getElementFromCache('#mui_header');
		// See: http://docs.mobiscroll.com/
		$dateField.scroller({
			theme: 'android-ics light',
			//mode: 'scroller', // Scroller acts wierd on android 4.0.4
			mode: 'clickpick',
			preset: 'date',
			display: 'modal',
			// Mobiscorll issue on android 4.0+ workaround.
			// See: http://code.google.com/p/mobiscroll/issues/detail?id=96
			onShow: function (html, inst) {
				$header.css('position', 'absolute');
				setTimeout(function () {
					z('div.android-ics').eq(0).css({
						'top': '20px',
						'visibility': 'visible'
					});
					z('div.dwbg').trigger('tochstart').css({
						'-webkit-transform': 'scale(1)'
					});
				}, 30);				
			},
			onClose: function (html, inst) {
				$header.css('position', 'fixed');
			}
		});
	};
	
	Habitrac.Chart.setUpDatePickerPGPlugin = function () {
		if (self.datePicker === undefined) {
			// If datePicker phonegap plugin does not exist, then do nothing.
			// This should run when on desktop mode(development).
			return; // Do nothing.
		}
		if (doneDatePickerSetup) { return; } //Run only once
		doneDatePickerSetup = true;
		Habitrac.Log.report('Doing pg datepicker plugin setup...');
		$root.on('touchend', '#chart_date_from, #chart_date_to', function (e) {
			var $me = z(this),
				defaultDate = new Date();
			if (trim($me.val()) !== '') {
				// LM: 10-03-2014
				defaultDate = new Date(trim($me.val()));
			}	
			$me.val('');
			// Run datepicker pg plugin
			// See: https://github.com/InformationLogisticsTeam/cordova-plugin-datepicker/blob/31cded7/README.md
			self.datePicker.show({
				date: defaultDate,
				mode: 'date'
			}, function (date) {
				if (date.toString().toLowerCase().indexOf('invalid date') !== -1) { return; } // Only accept valid dates
				Habitrac.Log.report('window.datePicker() plugin result: ' + date);  
				$me.val(date).blur();
			});
		});
	};
	
	Habitrac.Chart.normalizeDate = function (_dateVar) {
		_dateVar = _dateVar || (new Date()).getTime();
		var d = new Date(_dateVar);
		d.setHours(0);
		d.setMinutes(59);
		d.setSeconds(59);
		d.setMilliseconds(0);
		return d;
	};
	
	Habitrac.Chart.collectHabitTimes = function (_habitId, _from, _to) {		
		if (trim(_from) === '' && trim(_to) === '') {
			// This runs on the initial load of a pie //
			return Habitrac.Globals.habitTimes[_habitId];
		}
		var d = Habitrac.Chart.normalizeDate(),
			now = d.getTime(),
			from = (trim(_from) === '') ? now : Habitrac.Chart.normalizeDate(_from).getTime(),
			to = (trim(_to) === '') ? now : Habitrac.Chart.normalizeDate(_to).getTime(),
			hid = _habitId,
			finalArr = [],
			timestamp; 
		Habitrac.Globals.habitTimes[hid].forEach(function (ht) {
			timestamp = Habitrac.Chart.normalizeDate(parseInt(ht.t, 10)).getTime();
			if (timestamp >= from && timestamp <= to) {
				finalArr.push(ht);
			}
		});
		return finalArr;
	};
	
	Habitrac.Chart.extractData = function (_datesArr) {
		if (! _datesArr.length) { return false; }
		var returnObj = {
			didit: 0,
			fail: 0,
			total: 0
		};
		_datesArr.forEach(function (log) {
			if (parseInt(log.d, 10) === 1) {
				returnObj.didit++;
			}
			else {
				returnObj.fail++;
			}
			returnObj.total++;
		});
		return returnObj;
	};
	
	Habitrac.Chart.writeCountLabels = function (_didit, _fail) {
		_didit = _didit || 0;
		_fail = _fail || 0;
		Util.getElementFromCache('#didit_count').text(_didit);
		Util.getElementFromCache('#fail_count').text(_fail);
	};
	
	Habitrac.Chart.getLatestHabitLogDateByHabitId = function (_habitId) {
		// LM: 09-28-2014 [Method used to get the latest log timestamp of a habit.]
		if (Habitrac.Globals.habitTimes[_habitId] === undefined) {
			Habitrac.Log.report('Unknown habit id passed to Habitrac.Chart.getLatestHabitLogDateByHabitId() method. id "'+_habitId+'"');
			return false;
		}
		var maxTime = 0,
			dateTime;
		for (var p in Habitrac.Globals.habitTimes[_habitId]) {
			dateTime = pint(Habitrac.Globals.habitTimes[_habitId][p].t);
			if (dateTime > maxTime) {
				maxTime = dateTime;
			}
		}
		return maxTime;
	};
	
	Habitrac.Chart.calculateHabitAgeInDays = (function () {
		var dateDiffs = {},
			startDates = {};
		return function (_habitId) {
			if (! dateDiffs[_habitId]) {
				var habitBirthDate = parseInt(_habitId, 10) / 1000,
					now = (new Date()).getTime() / 1000,
					timeDiffInSec, timeDiffInHrs, timeDiffInDays;
				// This is the calculated difference in seconds //		
				timeDiffInSec = now - habitBirthDate;	
				// This is the calculated difference in hours //	
				timeDiffInHrs = (timeDiffInSec / 60) / 60;
				// This is the calculated difference in days //	
				timeDiffInDays = timeDiffInHrs / 24;
				dateDiffs[_habitId] = Math.ceil(timeDiffInDays); 
				startDates[_habitId] = (new Date(parseInt(_habitId, 10))).toString();
			}
			var lastHabitLoggedDate = (new Date(parseInt(Habitrac.Chart.getLatestHabitLogDateByHabitId(_habitId), 10))).toString();
			Util.getElementFromCache('#habit_days_diff').text(dateDiffs[_habitId]);
			Util.getElementFromCache('#habit_date_added').text(startDates[_habitId]);
			Util.getElementFromCache('#last_habit_logged_date').text(lastHabitLoggedDate);
		};
	})();
	
	Habitrac.Chart.makePieChartForHabit = function (_habitId, _from, _to) {
		var datesArr = Habitrac.Chart.collectHabitTimes(_habitId, _from, _to),
			chartData = Habitrac.Chart.extractData(datesArr),
			didit = 0,
			fail = 0;
		if (! chartData) {
			Habitrac.Chart.writeCountLabels();
			Habitrac.Chart.calculateHabitAgeInDays(_habitId);  
			// Make empty pie		
			Habitrac.Chart.pie('habit_pie', 100, [100], ['None'], ['D4D0C8']);
			return;
		}
		// Calculate percentage here //
		didit = (chartData.didit / chartData.total) * 100;	
		fail = (chartData.fail / chartData.total) * 100;	
		Habitrac.Chart.writeCountLabels(chartData.didit, chartData.fail); 
		Habitrac.Chart.calculateHabitAgeInDays(_habitId);
		Habitrac.Chart.pie('habit_pie', 100, [fail, didit], [Math.round(fail)+'%', Math.round(didit)+'%'], ['E33331', '85C708']);
	};
	
	Habitrac.Chart.getQuickBarGraphData = function (_habitId, _percentLimit) {
		var datesArr = Habitrac.Chart.collectHabitTimes(_habitId, '', ''),
			barData = Habitrac.Chart.extractData(datesArr),
			didit = 0,
			fail = 0;
		_percentLimit = parseInt(_percentLimit, 10) || 60;	
		if (! barData) {
			return { didit: 0, fail: 0 };
		}
		// Calculate percentage here //
		didit = (barData.didit / barData.total) * _percentLimit;	
		fail = (barData.fail / barData.total) * _percentLimit;
		return { 
			didit: didit, 
			fail: fail
		};
	};
	
})(self, Zepto, self.Habitrac, self.localStorage);
Habitrac.Log.report('Habitrac.Chart.js loaded');