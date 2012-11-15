Zepto(function (z) {	
	Mui.setHeaderMarkup({
		'habit_list_page': {
			'label': '<img src="images/logo.png">Habitrac',
			'buttons': '<button id="add_habit_h_button" data-hlightclass="header_b_hlight">Add</button>' +
					   '<button class="exit" data-hlightclass="header_b_hlight"><img src="images/x.png"></button>'			
		},
		'new_habit_page': {
			'label': '<img src="images/logo.png">New Habit',
			'buttons': '<button id="back2list" data-hlightclass="header_b_hlight"><img src="images/back_button.png"></button>' +	
					   '<button class="exit" data-hlightclass="header_b_hlight"><img src="images/x.png"></button>'			
		},
	})
	.buildHeaderMarkupForPageId('habit_list_page');
	
});	