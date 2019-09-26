/*Copyright 1996-2019 Information Builders, Inc. All rights reserved.*/
const fs = require("fs");

class ibxPackager
{
	constructor()
	{
	}

	package(config)
	{
		this._config = config;

		var template = fs.readFileSync(config.contexts.ibx + "/ibx_compiler_bundle.xml", "utf8");

		for(let i = 0; i < config.bundles.length; ++i)
		{
			let bundle = config.bundles[i];
			let srcFile = fs.readFileSync(bundle.src, "utf8");
			console.log(srcFile);

		}
	}
}

function log()
{
	let str = '[filemover] ';
	for(var i = 0; i < arguments.length; ++i)
		str += arguments[i];
	console.dir(str);
}

//create the file movers for each watch in the config file.
let argv = process.argv.slice(2);
let config = fs.readFileSync(process.cwd() + "/" + argv[0]);
config = JSON.parse(config);
let pkg = new ibxPackager();
pkg.package(config);

process.stdin.setEncoding("utf8");
process.stdin.on('readable', function()
{
	let chunk;
	while ((chunk = process.stdin.read()) !== null)
	{
		chunk = chunk.replace(/[\n\r]*/g, "");
		if(chunk == "cls")
			console.clear();
		else
		if(chunk == "q" || chunk == "quit" || chunk == "exit")
		{
			for(let id in fileMovers)
				fileMovers[id].stop();
			process.exit(1);
		}			
	}

});