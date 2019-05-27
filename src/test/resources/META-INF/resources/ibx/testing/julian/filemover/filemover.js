const EventEmitter = require("events");
const cproc = require("child_process");
const util = require("util");
const fs = require("fs");

function gitFileMover(workingDir, parms)
{
	EventEmitter.call(this);
	this._parms = parms;
	parms.ignore = eval(parms.ignore) || [];
	parms.ignore.push(".git");

	this._wd = workingDir;
	this.monitor();
}
util.inherits(gitFileMover, EventEmitter);
var _p = gitFileMover.prototype;

_p.monitor = function()
{
	this._fsw = fs.watch(this._parms.indir || __dirname, {recursive:true}, function(eventType, fileName)
	{
		var idx = Math.max(fileName.lastIndexOf("/"), fileName.lastIndexOf("\\"));
		var dir = fileName.substring(0, idx);

		if(-1 == this._parms.ignore.indexOf(dir))
		{
			var args = {};
			cproc.exec("git status --porcelain --ignored", args, function(error, stdOut, stdErr)
			{
				var status = stdOut.split("\n");
				status.map(function(val, idx, array)
				{
					var fileInfo = val.split(" ");
					process.stdout.write(fileInfo.join(" "));   
				}.bind(this));
			}.bind(this));
		}
	}.bind(this));
};

var argv = process.argv.slice(2);
args = {};
while(argv.length)
{
	var cmd = argv.shift().substring(1);
	var val = null;
	if(argv[0] && argv[0][0] != "-")
		val = argv.shift();
	args[cmd] = val;
}
var gt = new gitFileMover(__dirname, args);
