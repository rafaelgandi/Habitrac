(function (self, z, Habitrac, ls, undefined) {
	Habitrac.Events = {
		exit: function () {
			Habitrac.Logic.exitApp();
		},
		buttonHighLight: function (e) {
			var $me = z(this),
				tapcolorclass = trim($me.attr('data-hlightclass')),
				etype = e.type.toLowerCase();
			if (etype === 'touchstart') {
				$me.addClass(tapcolorclass);	
			}
			else {
				$me.removeClass(tapcolorclass);	
			}			
		},
		gotoAddHabitPage: function () {
			Mui.gotoPage('new_habit_page');
		},
		gotoHabitListPage: function () {			
			Mui.gotoPage('habit_list_page');
		},
		
		addNewHabit: function () {
			var habit = trim(Util.getElementFromCache('#habit_input').val());
			if (habit === '') {
				alert('Where\'s the habit?');
				return;
			}
			Habitrac.Logic.saveNewHabit(habit);
			Mui.gotoPage('habit_list_page');
		},
		
		pressDidItButton: function () {
			var $me = z(this),
				habitId = trim($me.attr('data-habitid'));
			Habitrac.Logic.logUserHabitAction(habitId, 'didit');
		},
		
		pageEvents: {
			new_habit_page: function () {
				Util.getElementFromCache('#habit_input').val('').focus();
			},
			habit_list_page: function () {
				Habitrac.Logic.buildHabitList();
			}
		}
	};
	
	
	// Button highlighting //
	$root.on('touchstart touchmove touchend', 'button[data-hlightclass]',  Habitrac.Events.buttonHighLight);	
	$root.on('tap', '.exit', Habitrac.Events.exit);	// Exit //
	$root.on('tap', '#back2list', Habitrac.Events.gotoHabitListPage);
	$root.on('tap', '#add_habit_h_button', Habitrac.Events.gotoAddHabitPage);
	$root.on('tap', '#add_habit_button', Habitrac.Events.addNewHabit);
	$root.on('tap', 'button.didit_button', Habitrac.Events.pressDidItButton);
	
	// Page events //
	$root.on('new_habit_page', Habitrac.Events.pageEvents.new_habit_page);
	$root.on('habit_list_page', Habitrac.Events.pageEvents.habit_list_page);
	
	
})(self, Zepto, self.Habitrac, self.localStorage);