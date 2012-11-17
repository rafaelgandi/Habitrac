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
			Habitrac.Logic.highlightList($me.parents('li'), $me.attr('data-hlightclass'));		
		},
		pressFailedButton: function () {
			var $me = z(this),
				habitId = trim($me.attr('data-habitid'));		
			Habitrac.Logic.logUserHabitAction(habitId, 'failed');
			Habitrac.Logic.highlightList($me.parents('li'), $me.attr('data-hlightclass'));		
		},
		showHabitListMenu: function () {
			var $me = z(this),
				habitId = trim($me.attr('data-habitid'));
			Habitrac.Logic.showHabitListMenu(habitId);	
		},
		phoneBackButton: function () {
			// other stuff should go here //
			if (Mui.$CURRENT_PAGE.attr('id') === 'new_habit_page') {
				Mui.gotoPage('habit_list_page');
			}
			Habitrac.Logic.hideHabitListMenu();
		},
		deleteHabitMenuClicked: function () {
			var $me = z(this),
				habitId = trim($me.attr('data-habitid'));
			Util.confirm({
				message: 'Do you really want to delete this habit?',
				callback: function (button) {
					if (button === 1 || button === true) {
						Habitrac.Storage.deleteHabit(habitId);
						Util.getElementFromCache('#habit_list').find('li[data-habitid="'+habitId+'"]').remove();
						Habitrac.Logic.hideHabitListMenu();	
					}
				},
				title: 'Delete Habit',
				buttons: 'Yep,Nope'
			});							
		},
		editHabitMenuClicked: function () {
			var $me = z(this),
				habitId = trim($me.attr('data-habitid'));
			Mui.gotoPage('edit_habit_page', {
				habitId: habitId,
				habit: Habitrac.Globals.habits[habitId]
			});		
		},
		editNewHabit: function () {
			var $me = z(this),
				habit = trim(Util.getElementFromCache('#edit_habit_input').val()),
				habitId = trim($me.data('habitid'));
			if (habit === '') {
				alert('I don\'t see any habit.');
				return;
			}					
			Habitrac.Logic.saveEdittedHabit(habitId, habit);
		},
		chartMenuClicked: function () {
			var $me = z(this),
				habitId = trim($me.attr('data-habitid'));
			Habitrac.Logic.showChart(habitId);
			Habitrac.Logic.hideHabitListMenu();
		},
		habitContextMenuBlur: (function () {
				// On Menu Blur //
			var timer;
			return function () {
				clearTimeout(timer);
				timer = setTimeout(function () {
					Habitrac.Logic.hideHabitListMenu();
				}, 300);					
			};
		})(),
		pageEvents: {
			new_habit_page: function () {
				Util.getElementFromCache('#habit_input').val('').focus();
			},
			habit_list_page: function () {
				Habitrac.Logic.buildHabitList();
			},
			edit_habit_page: function (e, $page, data) {
				Util.getElementFromCache('#edit_habit_input').val(data.habit).focus();
				Util.getElementFromCache('#save_edit_habit_button').data('habitid', data.habitId);
				Habitrac.Logic.hideHabitListMenu();
			},
			chart_page: function (e, $page, habitId) {
				lab.script('js/Habitrac.Chart.js').wait(function () {
					Habitrac.Chart.pie('habit_pie', 100, [40, 60], ['Failed', 'Did it!'], ['E33331', '82B221']);
				});
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
	$root.on('tap', 'button.failed_button', Habitrac.Events.pressDidItButton);
	$root.on('tap', '#save_edit_habit_button', Habitrac.Events.editNewHabit);
	$root.on('longTap', 'span.habit_label', Habitrac.Events.showHabitListMenu);
	$root.on('touchstart', Habitrac.Events.habitContextMenuBlur);
	
	$root.on('tap', '#delete_habit_button', Habitrac.Events.deleteHabitMenuClicked);
	$root.on('tap', '#edit_habit_button', Habitrac.Events.editHabitMenuClicked);
	$root.on('tap', '#habit_chart_menu_button', Habitrac.Events.chartMenuClicked);
	
	//Phonegap events//
	document.addEventListener('backbutton', Habitrac.Events.phoneBackButton, false);	
	
	// Page events //
	$root.on('new_habit_page', Habitrac.Events.pageEvents.new_habit_page);
	$root.on('habit_list_page', Habitrac.Events.pageEvents.habit_list_page);
	$root.on('edit_habit_page', Habitrac.Events.pageEvents.edit_habit_page);
	$root.on('chart_page', Habitrac.Events.pageEvents.chart_page);
	
	
})(self, Zepto, self.Habitrac, self.localStorage);