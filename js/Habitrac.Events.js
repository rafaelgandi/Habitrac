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
		pressedHabitLogButton: function () {
			var $me = z(this),
				habitId = trim($me.attr('data-habitid'));
			Util.confirm({
				message: 'Check a log for this habit?',
				callback: function (button) {
					if (button === 2 || button === true) {
						Habitrac.Logic.logUserHabitAction(habitId, ($me.hasClass('didit_button')) ? 'didit' : 'failed');	
						Habitrac.Logic.highlightList($me.parents('li'), $me.attr('data-hlightclass'));	
					}
				},
				title: 'Habit Checkin',
				buttons: 'Nope,Yep'
			});							
		},
		showHabitListMenu: function () {
			var $me = z(this),
				habitId = trim($me.attr('data-habitid'));
			Habitrac.Logic.showHabitListMenu(habitId);	
		},
		phoneBackButton: function () {
			var currPageId = Mui.$CURRENT_PAGE.attr('id');
			if (currPageId === 'habit_list_page') {
				// Check if the habit context menu is hdden, if it is then the user(me)
				// probably wants to close the app.
				if (Util.getElementFromCache('#habitrac_menu_popup_con').hasClass('hide')) {
					// If the phones back button is pressed in the habit_list_page, and the
					// habit list context menu is closed this automatically closes the app.
					Habitrac.Logic.exitApp();
					return;					
				}			
			}
			if (currPageId === 'chart_page') {
				// If we are in the "chart_page" and mobiscroll is visible. The back button
				// will close mobiscroll rather than navigate to "habit_list_page".
				if (z('div.android-ics').length) {
					// See: http://docs.mobiscroll.com/21/mobiscroll-core
					Util.getElementFromCache('#chart_date_from, #chart_date_to').scroller('hide');
					return;
				}
			}
			// Currently the back button mostly goes to 
			// the "habit_list_page" page. 
			// LM: 11-18-12
			Mui.gotoPage('habit_list_page');
			Habitrac.Logic.hideHabitListMenu();
		},
		phoneMenuButton: function () {
			Habitrac.Logic.hideHabitListMenu();
			if (Mui.$CURRENT_PAGE.attr('id') !== 'menu_page') {
				Mui.gotoPage('menu_page');
			}
			else {
				Mui.gotoPage('habit_list_page');
			}
		},
		deleteHabitMenuClicked: function () {
			var $me = z(this),
				habitId = trim($me.attr('data-habitid'));
			Util.confirm({
				message: 'Do you really want to delete this habit?',
				callback: function (button) {
					if (button === 2 || button === true) {
						Habitrac.Storage.deleteHabit(habitId);
						Util.getElementFromCache('#habit_list').find('li[data-habitid="'+habitId+'"]').remove();
						Habitrac.Logic.hideHabitListMenu();	
					}
				},
				title: 'Delete Habit',
				buttons: 'Nope,Yep'
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
		inputTextBlur: function () {
			self.scrollTo(0, 0);
		},
		calculateHabitPieChartButtonPressed: function () {
			var from = trim(Util.getElementFromCache('#chart_date_from').val()),
				to = trim(Util.getElementFromCache('#chart_date_to').val()),
				habitId = trim($(this).data('habitid'));
			// Generate pie chart here //	
			Habitrac.Chart.makePieChartForHabit(habitId, from, to);
		},
		gotoAboutPageButtonPressed: function () {
			Mui.gotoPage('about_page');
		},
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
				if (Habitrac.Chart !== undefined) { runChart(); }
				else {
					lab.script('js/lib/mobiscroll-2.1.custom.min.js')
					   .script('js/Habitrac.Chart.js?_'+Math.random()).wait(function () {
							Habitrac.Chart.setUpMobiscroll();
							runChart();
						});	
				}				
				function runChart() {
					Util.getElementFromCache('#chart_date_from').val('');
					Util.getElementFromCache('#chart_date_to').val('');					
					Util.getElementFromCache('#calculate_pie_chart_button').data('habitid', trim(habitId));
					// Make initial pie chart. The 'from' and 'to' variables here
					// should be empty.
					Habitrac.Chart.makePieChartForHabit(trim(habitId), '', '');
					Util.getElementFromCache('#pie_chart_h2').text(Habitrac.Globals.habits[habitId]);
				}
				
			}
		}
	};
	
	
	$root.on('touchstart touchmove touchend', 'button[data-hlightclass]',  Habitrac.Events.buttonHighLight); // Button highlighting	
	$root.on('tap', 'button.exit', Habitrac.Events.exit);	// Exit //
	$root.on('tap', '#back2list', Habitrac.Events.gotoHabitListPage);
	$root.on('tap', '#add_habit_h_button', Habitrac.Events.gotoAddHabitPage);
	$root.on('tap', '#add_habit_button', Habitrac.Events.addNewHabit);
	$root.on('tap', 'button.didit_button, button.failed_button', Habitrac.Events.pressedHabitLogButton);
	$root.on('tap', '#save_edit_habit_button', Habitrac.Events.editNewHabit);
	$root.on('longTap', 'span.habit_label', Habitrac.Events.showHabitListMenu);
	$root.on('touchstart', Habitrac.Events.habitContextMenuBlur);
	$root.on('blur', 'input[type="text"]', Habitrac.Events.inputTextBlur);
	$root.on('tap', '#calculate_pie_chart_button', Habitrac.Events.calculateHabitPieChartButtonPressed);	
	$root.on('tap', '#goto_about_page_button', Habitrac.Events.gotoAboutPageButtonPressed);	
	// Habit list context menu events //
	$root.on('tap', '#delete_habit_button', Habitrac.Events.deleteHabitMenuClicked);
	$root.on('tap', '#edit_habit_button', Habitrac.Events.editHabitMenuClicked);
	$root.on('tap', '#habit_chart_menu_button', Habitrac.Events.chartMenuClicked);	
	//Phonegap events//
	document.addEventListener('backbutton', Habitrac.Events.phoneBackButton, false);		
	document.addEventListener('menubutton', Habitrac.Events.phoneMenuButton, false);		
	// Page events //
	$root.on('new_habit_page', Habitrac.Events.pageEvents.new_habit_page);
	$root.on('habit_list_page', Habitrac.Events.pageEvents.habit_list_page);
	$root.on('edit_habit_page', Habitrac.Events.pageEvents.edit_habit_page);
	$root.on('chart_page', Habitrac.Events.pageEvents.chart_page);
	
	
})(self, Zepto, self.Habitrac, self.localStorage);