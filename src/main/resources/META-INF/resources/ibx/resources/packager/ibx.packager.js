/*Copyright 1996-2019 Information Builders, Inc. All rights reserved.*/
const fs = require("fs");
const EventEmitter = require("events");
const xml2js = require("xml2js"); 

function log()
{
	let str = '[filemover] ';
	for(var i = 0; i < arguments.length; ++i)
		str += arguments[i];
	console.dir(str);
}
class ibxPackager extends EventEmitter
{
	constructor()
	{
		super();
		this._bundles = {};
	}
	package(config)
	{
		let ibxBundle = 
		{
			"includeIbx":false,
			"loadContext":"ibx",
			"src":"./ibx_resource_bundle.xml",
		}
		this._ibxBundle = new ibxResourceBundle(ibxBundle, config);

		return;
		this._config = config;
		for(let i = 0; i < config.bundles.length; ++i)
		{
			let bundle = config.bundles[i];
			this._bundles[bundle.src] = new ibxResouceBundle(bundle, config);
		}
	}
}

class ibxResourceBundle extends EventEmitter
{
	constructor(bundleInfo, config)
	{
		super();
		this._bundleInfo = bundleInfo;
		this._config = config;
		this._init();
		this._package();
	}
	_init()
	{
		let template = fs.readFileSync(this._bundleInfo.template || this._config.template, "utf8");
		xml2js.parseString(template, {trim:true}, (err, result)=>
		{
			this._bundleInfo._oTemplate = result;
			let bundle = fs.readFileSync(this._bundleInfo.src, "utf8");
			xml2js.parseString(bundle, {trim:true}, (err, result)=>
			{
				this._bundleInfo._oBundle = JSON.parse(JSON.stringify(result));

				debugger;
			})
		});		
	}
	_getResPath(src, loadContext)
	{
		var path = this._config.contexts.webRoot;
		if(loadContext == "ibx")
			path = this._config.contexts.ibx;
		else
		if(loadContext == "app")
			path = this._bundleInfo.appContext;
		else
		if(loadContext == "bundle")
			path = this._config.src.substr(0, this._config.src.lastIndexOf("/"));
		return path + src;
	}
	_package()
	{

	}
}

//read config...kick off packaging.
let argv = process.argv.slice(2);
let config = fs.readFileSync(process.cwd() + "/" + argv[0]);
config = JSON.parse(config);
let pkg = new ibxPackager();
pkg.package(config);
