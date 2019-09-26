/*Copyright 1996-2019 Information Builders, Inc. All rights reserved.*/
const fs = require("fs");
const EventEmitter = require("events");

function log()
{
	let str = '[filemover] ';
	for(var i = 0; i < arguments.length; ++i)
		str += arguments[i];
	console.dir(str);
}

// process.stdin.setEncoding("utf8");
// process.stdin.on('readable', function()
// {
// 	let chunk;
// 	while ((chunk = process.stdin.read()) !== null)
// 	{
// 		chunk = chunk.replace(/[\n\r]*/g, "");
// 		if(chunk == "cls")
// 			console.clear();
// 		else
// 		if(chunk == "q" || chunk == "quit" || chunk == "exit")
// 		{
// 			for(let id in fileMovers)
// 				fileMovers[id].stop();
// 			process.exit(1);
// 		}			
// 	}

// });
class ibxPackager extends EventEmitter
{
	constructor()
	{
		super();
		this._bundles = {};
	}

	package(config)
	{
		this._config = config;
		for(let i = 0; i < config.bundles.length; ++i)
		{
			let bundle = config.bundles[i];
			this._bundles[bundle.src] = new ibxResrouceBundle(bundle);
		}
	}
}

class ibxResrouceBundle extends EventEmitter
{
	constructor(bundle)
	{
		super();
		this._bundle = bundle;
		console.log(bundle.src);
	}
}


//create the file movers for each watch in the config file.
let argv = process.argv.slice(2);
let config = fs.readFileSync(process.cwd() + "/" + argv[0]);
config = JSON.parse(config);
let pkg = new ibxPackager();
pkg.package(config);
