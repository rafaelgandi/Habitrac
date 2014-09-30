(function (self, z, Habitrac, ls, undefined) {
	Habitrac.Events = {
		exit: function () {
			try {
				var data = {
					date: (new Date()).toString(),
					habits: Habitrac.Globals.habits,
					habitTimes: Habitrac.Globals.habitTimes
				};
				Habitrac.File.writeBackUp(JSON.stringify(data), function () {
					Habitrac.Logic.notify('Backup made!!!');
					setTimeout(function () {
						Habitrac.Logic.exitApp();
					}, 400);					
				});
			}
			catch (e) {
				Habitrac.Log.report('Error on file backup, try again');
				Habitrac.Logic.exitApp();
			}
			
		},
		buttonHighLight: function (e) {
			var $me = z(this),
				tapcolorclass = trim($me.attr('data-hlightclass')),
				etype = e.type.toLowerCase(),
				animateShadow = tapcolorclass.indexOf('animate_shadow') !== -1;			
			if (etype === 'touchstart') {
				$me.addClass(tapcolorclass);
				if (animateShadow) {
					$me.animate({
						boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.19), 0 8px 17px 0 rgba(0, 0, 0, 0.2)'
					}, 0);	
				}			
			}
			else {
				$me.removeClass(tapcolorclass);
				if (animateShadow) {
					$me.animate({
						boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)'
					}, 50, Habitrac.Globals.materialDesignEasingSwiftOut);
				}				
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
		pressedHabitLogButton: (function () {
			var timer,
				barCons = {};
			return function () {
				var $me = z(this),
					habitId = trim($me.attr('data-habitid'));
				// LM: 09-30-2014	
				// Give a little delay for the animation(pressing button) to show.	
				setTimeout(function () { 
					Util.confirm({
						message: 'Continue with log?',
						callback: function (button) {
							if (button === 2 || button === true) {
								Habitrac.Logic.logUserHabitAction(habitId, ($me.hasClass('didit_button')) ? 'didit' : 'failed');	
								Habitrac.Logic.highlightList($me.parents('li'), $me.attr('data-hlightclass'));
								clearTimeout(timer);
								// Update the bar graph here //
								timer = setTimeout(function () {
									Habitrac.Log.report('Quick bargraph being made.');
									var bar = Habitrac.Chart.getQuickBarGraphData(habitId),
										$barCon = (barCons[habitId] === undefined)
															? $me.parent().parent().find('div.habit_quick_bar_con')
															: barCons[habitId];
										$barCon.find('div.bar_fail').css('height', bar.fail+'px');
										$barCon.find('div.bar_didit').css('height', bar.didit+'px');							
								}, 1e3);	
							}
						},
						title: 'Habit Log',
						buttons: 'Nope,Yep'
					});
				}, 200);						
			};		
		})(),
		showHabitListMenu: function () {		
			var $me = z(this),
				habitId = trim($me.attr('data-habitid'));	
			Habitrac.Logic.highlightList($me.parents('li'), 'show_popup_menu');	
			Habitrac.Logic.showHabitListMenu(habitId);	
		},
		phoneBackButton: function () {
			// For some reason when text field is in focus and you press
			// the phones back button, the app automatically exits. Trying
			// to blur the any text field first here. Not sure if this will
			// work.
			// LM: 12-31-12
			z('input[type=text]').blur();
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
			
			// Load file module if not yet loaded. //
			if (! Habitrac.File) {
				loadScript('js/Habitrac.File.js', function () {
					Habitrac.Log.report('File module loaded');
				});		
			}
						
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
			//alert(habitId);	return;
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
		pereventSelection: function (e) {
			// See: http://stackoverflow.com/a/2744656
			e.preventDefault();
			return false;
		},
		pereventBorderOnTextField: function () {
			// Does not work on android 4.0.4
			// as of 12-09-2012
			z(this).css({
				'border-top': '0px',
				'border-left': '0px',
				'border-right': '0px'
			});
		},
		gotoLogsPage: function (e) {
			Mui.gotoPage('logs_page');
		},
		makeFileBackup: function (e) {
			if (! Habitrac.File) {
				alert('Please try again');
				return;
			}
			Util.confirm({
				message: 'Continue with backup?',
				callback: function (button) {
					if (button === 2 || button === true) {
						try {
							var data = {
								date: (new Date()).toString(),
								habits: Habitrac.Globals.habits,
								habitTimes: Habitrac.Globals.habitTimes
							};
							Habitrac.File.writeBackUp(JSON.stringify(data), function () {
								Habitrac.Log.report('Backup made!!!');
								Habitrac.Logic.notify('Backup made!!!');
							});
						}
						catch (e) {
							Habitrac.Log.report('Error on file backup, try again');
						}	
					}
				},
				title: 'Backup',
				buttons: 'Nope,Backup'
			});	
		},
		restoreFromFileBackup: function (e) {
			if (! Habitrac.File) {
				alert('Please try again');
				return;
			}
			Util.confirm({
				message: 'Continue with restore? This will OVERWRITE THE BACKUP FILE!',
				callback: function (button) {
					if (button === 2 || button === true) {
						Util.confirm({
							message: 'ARE YOU SURE ABOUT THIS?',
							callback: function (b) {
								if (b === 2 || b === true) {
									Habitrac.File.readBackUp(function (res) {
										if (Habitrac.Storage.import(res)) {
											Mui.gotoPage('habit_list_page');
											Habitrac.Logic.notify('Finished restoring data.');
										}
										else {
											alert('Sorry, unable to restore data.');
										}
									});		
								}
							},
							title: 'Are you really sure?',
							buttons: 'Nevermind, Yes I\'m sure'
						});						
					}
				},
				title: 'Restore',
				buttons: 'Nope,Restore'
			});	
		},
		pageEvents: {
			new_habit_page: function () {
				Util.getElementFromCache('#habit_input').val('').focus();
			},
			habit_list_page: function () {
				Habitrac.Logic.buildHabitList();		
			},
			edit_habit_page: function (e, $page, data) {
				Util.getElementFromCache('#edit_habit_input').val(data.habit); 				
				Util.getElementFromCache('#save_edit_habit_button').data('habitid', data.habitId);
				Habitrac.Logic.hideHabitListMenu();
			},
			chart_page: function (e, $page, habitId) {
				// Check if mobiscroll already is loaded //
				if (z.fn.scroller !== undefined) { runChart(); }
				else {
					loadScript('js/lib/mobiscroll-2.1.custom.min.js', function () {						
						Habitrac.Chart.setUpMobiscroll();
						Habitrac.Log.report('Setting up mobiscroll..');
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
				
			},
			afterPageChange: function (e, _$page) {
				//NOT USED AS OF 12-31-2012
			}		
		}
	};
	
	$root.on('touchstart touchmove touchend', 'button[data-hlightclass]',  Habitrac.Events.buttonHighLight); // Button highlighting		
	$root.on('click', 'button.exit', Habitrac.Events.exit); // Exit //
	$root.on('click', '#back2list', Habitrac.Events.gotoHabitListPage);
	$root.on('click', '#add_habit_h_button', Habitrac.Events.gotoAddHabitPage);
	$root.on('click', '#add_habit_button', Habitrac.Events.addNewHabit);
	$root.on('click', 'button.didit_button, button.failed_button', Habitrac.Events.pressedHabitLogButton);
	$root.on('click', '#save_edit_habit_button', Habitrac.Events.editNewHabit);	
	$root.on('longTap', 'span.habit_label, div.habit_quick_bar_con', Habitrac.Events.showHabitListMenu);
	$root.on('touchstart', Habitrac.Events.habitContextMenuBlur);
	$root.on('blur', 'input[type="text"]', Habitrac.Events.inputTextBlur);	
	$root.on('click', '#calculate_pie_chart_button', Habitrac.Events.calculateHabitPieChartButtonPressed);
	$root.on('click', '#goto_about_page_button', Habitrac.Events.gotoAboutPageButtonPressed);	
	$root.on('selectstart dragstart', 'span.habit_label', Habitrac.Events.pereventSelection);	
	$root.on('focus', '#habit_input,#edit_habit_input', Habitrac.Events.pereventBorderOnTextField);	
	$root.on('click', '#goto_logs_page_button', Habitrac.Events.gotoLogsPage);	
	$root.on('click', '#make_file_backup_button', Habitrac.Events.makeFileBackup);	
	$root.on('click', '#restore_from_backup_file_button', Habitrac.Events.restoreFromFileBackup);	
	// Habit list context menu events // 
	// LM: 09-20-2014 [Fix menu buttons not working by replacing "click" with "touchend" event]
	$root.on('touchend', '#delete_habit_button', Habitrac.Events.deleteHabitMenuClicked);
	$root.on('touchend', '#edit_habit_button', Habitrac.Events.editHabitMenuClicked);
	$root.on('touchend', '#habit_chart_menu_button', Habitrac.Events.chartMenuClicked);    
	//Phonegap events//
	document.addEventListener('backbutton', Habitrac.Events.phoneBackButton, false);		
	document.addEventListener('menubutton', Habitrac.Events.phoneMenuButton, false);		
	// Page events //
	$root.on('new_habit_page', Habitrac.Events.pageEvents.new_habit_page);
	$root.on('habit_list_page', Habitrac.Events.pageEvents.habit_list_page);
	$root.on('edit_habit_page', Habitrac.Events.pageEvents.edit_habit_page);
	$root.on('chart_page', Habitrac.Events.pageEvents.chart_page);
	$root.on('mui_afterpagechange', Habitrac.Events.pageEvents.afterPageChange);	
	
})(self, Zepto, self.Habitrac, self.localStorage);
Habitrac.Log.report('Habitrac.Events.js loaded');