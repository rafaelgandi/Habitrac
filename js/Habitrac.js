self.Habitrac = self.Habitrac || {};
window.$root = z(document);
window.trim = z.trim;
Habitrac.Globals = {
	habits: {},
	habitTimes: {},
	tplDir: 'templates/',
	backupFile: 'habitrac.txt'
};
Habitrac.Log.report('Habitrac.js script loaded');
// touch events
// https://github.com/bebraw/jswiki/wiki/Touch