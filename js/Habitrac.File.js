(function (self, z, Habitrac, ls, undefined) {
	Habitrac.File = {};	
	Habitrac.File.FILE_SYS = 0;
	Habitrac.File.FILE_ENTRY = 0;
	Habitrac.File.writeBackUp = function (_a, _b) {};
	Habitrac.File.readBackUp = function (_a) {};
	function failFS(evt) {
		Habitrac.Log.report("File System Error: " + evt.target.error.code);
	}
	var readFail, writeFail;
	readFail = writeFail = function (error) {
		Habitrac.Log.report("Create/Write Error: " + error.code);
	}
	
	// See: http://www.azoft.com/spotlight/2011/02/02/filesystem-apifile-api.html
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	self.PERSISTENT = (typeof LocalFileSystem !== 'undefined') ? LocalFileSystem.PERSISTENT : self.PERSISTENT;
	if (window.webkitStorageInfo !== undefined) { // Required for desktop testing
		var MB5 = (5*1024*1024);
		Habitrac.Log.report('Webkit quota being used');
		window.webkitStorageInfo.requestQuota(self.PERSISTENT, MB5, runAll, failFS);
	}
	else { runAll(0); }
	
	function runAll(_bytes) {
		Habitrac.Log.report('Running file system');
		try {
			function createGotNewFile(file){
				Habitrac.Log.report("Created: '" + file.fullPath + "'")
			}
			function createGotFileEntry(fileEntry) {
				Habitrac.File.FILE_ENTRY = fileEntry;
				fileEntry.file(createGotNewFile, writeFail);
			}
			function gotFS(fileSystem) {
				Habitrac.Log.report('window.requestFileSystem worked!');
				Habitrac.File.FILE_SYS = fileSystem;
				Habitrac.Log.report('fileSystem.name: '+fileSystem.name);
				Habitrac.Log.report('fileSystem.root.name: '+fileSystem.root.name);
				fileSystem.root.getFile(Habitrac.Globals.backupFile, {create: true, exclusive: false}, createGotFileEntry, writeFail);
			}		
			if (Habitrac.File.FILE_SYS) {
				gotFS(Habitrac.File.FILE_SYS);
			} else {
				window.requestFileSystem(self.PERSISTENT, _bytes, gotFS, failFS);
			}
			
			function isPermitted() {
				var msg = 'Sorry backup and restore functionality is currently turned off. Please set the Habitrac.Globals.BACKUP_AND_RESTORE property in Habitrac.js';
				if (! Habitrac.Globals.BACKUP_AND_RESTORE) {				
					alert(msg);
					Habitrac.Log.report(msg);	
					return false;
				}
				return true;
			}
			
			// Writing to file/backup //
			Habitrac.File.writeBackUp = function (_backupString, _callback) {
				if (! isPermitted()) { return; }
				var data = 	(! isMobileAndroid()) ? (new Blob([_backupString],{})) : (_backupString+'');
				_callback = _callback || function () {};
				if (Habitrac.File.FILE_ENTRY) {
					Habitrac.File.FILE_ENTRY.createWriter(function (writer) {
						Habitrac.Log.report('created writer');
						try {
							// If something went wrong while writing to file. //
							writer.onerror = function (evt) {
								Habitrac.Log.report('File writer error, unable to write data.');
							};
						}
						catch (err) {
							// If the onerror event did not worked //
							Habitrac.Log.report('File writer onerror event failed.');
						}					
						writer.onwriteend = function (evt) {
							_callback();
							Habitrac.Log.report('New backup has been made!');
						};									
						writer.write(data);																				
					}, writeFail);
				}
				else {
					Habitrac.Log.report('because FILE_ENTRY was not set.');
					Habitrac.Log.report('ERROR: Unable to write backup');
				}
			};
			
			// Read from file/backup //
			Habitrac.File.readBackUp = function (_callback) {
				if (! isPermitted()) { return; }
				_callback = _callback || function (res) {};
				if (Habitrac.File.FILE_ENTRY) {
					Habitrac.File.FILE_ENTRY.file(function (file) {
						// Read as text //
						var reader = new FileReader();
						 reader.onloadend = function (evt) {
							//console.log(evt.target.result);
							Habitrac.Log.report('Finished reading backup file.');
							_callback(evt.target.result);
						};
						reader.readAsText(file);
					}, readFail);
				}
				else {
					Habitrac.Log.report('because FILE_ENTRY was not set.');
					Habitrac.Log.report('ERROR: Unable to read backup');
				}
			};
		}
		catch (fileErr) {
			Habitrac.Log.report('FILE SYSTEM FAILED!!!');
		}	
	}	
	
})(self, Zepto, self.Habitrac, self.localStorage);
Habitrac.Log.report('Habitrac.File.js loaded');