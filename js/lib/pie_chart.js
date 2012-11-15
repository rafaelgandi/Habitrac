// See: http://blog.crondesign.com/2012/05/simple-javascript-pie-chart-using-html5.html
// See: http://reubencrane.com/blog/?p=4
var pieProps = new Object();

function pieChart(canvas, radius, percentages, n, colors) {
 var canvas = document.getElementById(canvas)
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
}

function W(x,y,r,u,v) {
 var a = pieProps.a
 r ? a.beginPath() | a.fill(a.moveTo(x,y)|a.arc(x,y,r,(u||0)/50*Math.PI,(v||7)/50*Math.PI,0)|a.lineTo(x,y))
 : a.fillStyle = '#'+pieProps.colors[pieProps.i++];
 return W;
}

/** /
//ADD THIS TO YOUR PAGE SOMEWHERE:
<canvas id="c"> Your browser does not support the canvas element. </canvas>

//EXAMPLE USAGE:
<body onload="pieChart('c', 100, [70,25,15], ['Carbs','Protein','Fat'], ['CCCCCC','FFBF43','FF850D'])">
/**/