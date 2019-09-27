/*Copyright 1996-2019 Information Builders, Inc. All rights reserved.*/
const fs = require("fs");
const EventEmitter = require("events");

//XML DOM support: https://www.npmjs.com/package/xmldom
const xmldom = require("xmldom");
const DOMParser = xmldom.DOMParser;
const XMLSerializer = xmldom.XMLSerializer;

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
	constructor(bundleInfo, config, xPackageBundle)
	{
		super();
		this._bundleInfo = bundleInfo;
		this._config = config;
		this._parentBundle;
		this._xBundle = null;
		this._xPackageBundle = xPackageBundle;
		this._init();
		this._package();
	}
	_init()
	{
		let template = this._template = fs.readFileSync(this._bundleInfo.template || this._config.template, "utf8");
		this._xPackageBundle = this._xPackageBundle || new DOMParser().parseFromString(template);

		let bundle = this._bundle = fs.readFileSync(this._getResPath(this._bundleInfo.src, this._bundleInfo.loadContext), "utf8");
		this._xBundle = new DOMParser().parseFromString(bundle);
	}
	_getLoadContext(element)
	{
		var loadContext = null;
		while(element)
		{
			var loadContext = element.getAttribute("loadContext");
			if(loadContext)
				break;
			element = element.parentNode;
			if(!element)
				loadContext = this._config.contexts.loadContext;
		}
		return loadContext;
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
		return path + "/" + src;
	}
	_getResFile(src)
	{
		let content = this._bundle = fs.readFileSync(src, "utf8");
		return content;
	}
	_createInlineBlock(type, content, src)
	{
		var cData = this._xPackageBundle.createCDATASection(content);
		var element = this._xPackageBundle.createElement(type);
		element.setAttribute("src", src);
		element.appendChild(cData);
		return element;
	}
	_package()
	{
		let parentNode = this._xPackageBundle.getElementsByTagName("scripts")[0];
		let items = this._xBundle.getElementsByTagName("script-file");
		
		for(var i = 0; i < items.length; ++i)
		{
			let item = items[i];
			if(item.getAttribute("nopackage") == "true")
				continue;

			let src = item.getAttribute("src");
			let path = this._getResPath(src, this._getLoadContext(item));
			let content = this._getResFile(path);
			if(content)
			{
				let element = this._createInlineBlock("script-block", content, path);
				parentNode.appendChild(element);
			}
		}
		// _packageFile()
		// {
		// 	if()
		// }

		//dump file for debug.
		let xs = new XMLSerializer();
		let strBundle = xs.serializeToString(this._xPackageBundle);
		console.clear();
		console.log(strBundle);
	}
}
ibxResourceBundle.typeMap = 
{
	"script-file":"script-block",
	"style-file":"style-block",
	"markup-file":"markup-block",
	"string-file":"string-bundle"
}


//read config...kick off packaging.
let argv = process.argv.slice(2);
let config = fs.readFileSync(process.cwd() + "/" + argv[0]);
config = JSON.parse(config);
let pkg = new ibxPackager();
pkg.package(config);
