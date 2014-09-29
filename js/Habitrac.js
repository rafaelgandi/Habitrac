self.Habitrac = self.Habitrac || {};
window.$root = z(document);
window.trim = z.trim;
Habitrac.Globals = {
	habits: {},
	habitTimes: {},
	tplDir: 'templates/',
	backupFile: 'habitrac.txt',
	// LM: 09-28-2014 [Controls if a backup/restore is permitted. Useful in development to avoid any unwanted backup/restore to happen]
	BACKUP_AND_RESTORE: true
};
Habitrac.Log.report('Habitrac.js script loaded');
// touch events
// https://github.com/bebraw/jswiki/wiki/Touch