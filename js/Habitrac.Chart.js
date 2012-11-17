(function (self, z, Habitrac, ls, undefined) {
	Habitrac.Chart = {};
	
	// See: http://blog.crondesign.com/2012/05/simple-javascript-pie-chart-using-html5.html
	// See: http://reubencrane.com/blog/?p=4
	var pieProps = new Object();
	function W(x,y,r,u,v) {
		var a = pieProps.a
		r ? a.beginPath() | a.fill(a.moveTo(x,y)|a.arc(x,y,r,(u||0)/50*Math.PI,(v||7)/50*Math.PI,0)|a.lineTo(x,y))
		: a.fillStyle = '#'+pieProps.colors[pieProps.i++];
		return W;
	}
	
	Habitrac.Chart.pie = function (canvas, radius, percentages, n, colors) {
		var canvas = document.getElementById(canvas);
		var a = pieProps.a = canvas.getContext("2d");
		pieProps.colors = colors
		pieProps.i = 0
		canvas.width = 3.5*radius;
		canvas.height = 2.5*radius;
		x = y = canvas.height/2;
		a.font = "bold 12px Arial";
		var u = 0;
		var v = 0;
		for (i=0;i < percentages.length;i++) {
			v += percentages[i];
			W(i)(x,y,radius,u,v);
			u = v;
			a.fillText(n[i], x+radius+10, y-radius/2+i*18);
		}
	};
	
})(self, Zepto, self.Habitrac, self.localStorage);