/* Author:
    Max Degterev @suprMax
	See: http://maxdegterev.name/javascript-2/fast-buttons-for-webapps/

    Zepto fast buttons without nasty ghostclicks.
    Supports event delegation and handlers removal.
    Highly inspired by http://code.google.com/mobile/articles/fast_buttons.html

    Usage:

    bind:
    $('#someid').onpress(function(event){});
    $('#someid').offpress(function(event){});

    delegation:
    $('#someid').onpress('.childNode', function(event){});
    $('#someid').offpress('.childNode', function(event){});

    Word of advice:
    Never ever try to attach this event handlers to: document, html, body.
    All sorts of weirdness going to happen. Use onclick instead.
*/
;(function(a){a.os.touch=typeof window.ontouchstart!="undefined";var b=1e3,c=function(a){var b,c;return typeof a[0]=="function"?b=a[0]:(c=a[0],b=a[1]),[c,b]};if(a.os.touch){var d=[],e=[],f=[],g=a(document),h=function(){d.splice(0,2)},i=function(a){for(var b=0,c=d.length;b<c;b+=2)Math.abs(a.pageX-d[b])<25&&Math.abs(a.pageY-d[b+1])<25&&(a.stopPropagation(),a.preventDefault())};g.on("click",i),a.fn.onpress=function(){if(!arguments.length||!this.length||!this[0].nodeType||this[0].nodeType!==1&&this[0].nodeType!==11)return;var a=[],i=this,j=c(arguments),k=function(b){b.stopPropagation();var c=b.touches?b.touches[0]:b;a[0]=c.pageX,a[1]=c.pageY,g.on("touchmove.onpress",l),j[0]?i.on("touchend.onpress",j[0],m):i.on("touchend.onpress",m)},l=function(b){(Math.abs(b.touches[0].pageX-a[0])>10||Math.abs(b.touches[0].pageY-a[1])>10)&&n()},m=function(c){n(),j[1].call(this,c),c.type==="touchend"&&(d.push(a[0],a[1]),window.setTimeout(h,b))},n=function(){g.off("touchmove.onpress",l),j[0]?i.off("touchend.onpress",j[0],m):i.off("touchend.onpress",m)};e.push(j[1]),f.push(k),j[0]?(this.on("touchstart.onpress",j[0],k),this.on("press.onpress",j[0],j[1])):(this.on("touchstart.onpress",k),this.on("press.onpress",j[1]))},a.fn.offpress=function(){var a=c(arguments),b;if(a[1]){b=e.indexOf(a[1]);if(b<0)return;a[0]?(this.off("touchstart.onpress",a[0],f[b]),this.off("press.onpress",a[0],a[1])):(this.off("touchstart.onpress",f[b]),this.off("press.onpress",a[1])),e.splice(b,1),f.splice(b,1)}else a[0]?(this.off("touchstart.onpress",a[0]),this.off("press.onpress",a[0])):(this.off("touchstart.onpress"),this.off("press.onpress"))}}else a.fn.onpress=function(){var a=c(arguments);a[0]?(this.on("click.onpress",a[0],a[1]),this.on("press.onpress",a[0],a[1])):(this.on("click.onpress",a[1]),this.on("press.onpress",a[1]))},a.fn.offpress=function(){var a=c(arguments);a[0]?this.off(".onpress",a[0],a[1]):this.off(".onpress",a[1])}})(window.Zepto||window.jQuery);

