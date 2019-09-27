/*Copyright 1996-2019 Information Builders, Inc. All rights reserved.*/
const fs = require("fs");
const fsPath = require("path");
const EventEmitter = require("events");

//XML DOM support: https://www.npmjs.com/package/xmldom
const xmldom = require("xmldom");
const DOMParser = xmldom.DOMParser;
const XMLSerializer = xmldom.XMLSerializer;

//Simple string formatting function
function sformat()
{
    var s = arguments[0];
	var i = arguments.length;
    while (i--)
	{
		val = (arguments[i] === undefined || arguments[i] === null) ? "" : arguments[i];
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), val);
	}
    return s;
}

class ibxPackager extends EventEmitter
{
	constructor()
	{
		super();
		this._resBundles = {};
	}
	package(config)
	{
		this._config = config;
		for(let i = 0; i < config.bundles.length; ++i)
		{
			let bundleInfo = config.bundles[i];
			let resBundle = this._resBundles[bundleInfo.src] = new ibxResourceBundle(bundleInfo, config);
			resBundle.package(true);
		}
	}
}
class ibxResourceBundle extends EventEmitter
{
	constructor(bundleInfo, config, parentResBundle)
	{
		super();
		this._config = config;
		this._bundleInfo = bundleInfo;
		this.bundle = null;
		this.resMap = parentResBundle ? parentResBundle.resMap : {};
		this.pkg = parentResBundle ? parentResBundle.pkg : null;
		this._init();
	}
	_init()
	{
		let template = this._template = fs.readFileSync(this._config.template, "utf8");
		this.pkg = this.pkg || new DOMParser().parseFromString(template);

		let bundle = fs.readFileSync(this._getResPath(this._bundleInfo.src, this._bundleInfo.loadContext), "utf8");
		this.bundle = new DOMParser().parseFromString(bundle);
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
		var ctxPath = "";
		if(loadContext == "ibx")
			ctxPath = this._config.contexts.ibx;
		else
		if(loadContext == "app")
			ctxPath = this._bundleInfo.appContext;
		else
		if(loadContext == "bundle")
			ctxPath = this._bundleInfo.src.substr(0, this._bundleInfo.src.lastIndexOf("/"));
		return sformat("{1}/{2}/{3}", this._config.contexts.webRoot, ctxPath, src);
	}
	_getResFile(src)
	{
		let content = this._bundle = fs.readFileSync(src, "utf8");
		return content;
	}
	_createInlineBlock(type, content, src)
	{
		var cData = this.pkg.createCDATASection(content);
		var element = this.pkg.createElement(type);
		element.setAttribute("src", src);
		element.appendChild(cData);
		return element;
	}
	package(andSave)
	{
		if(this._bundleInfo.includeIbx)
		{
			let bundleInfo = {includeIbx:false, loadContext:"ibx", src:"ibx_resource_bundle.xml"};
			let ibxBundle = new ibxResourceBundle(bundleInfo, this._config, this);
			ibxBundle.package();
		}

		let pkg = this.pkg;
		let rootNode = pkg.documentElement;
		let parentNode = pkg.getElementsByTagName("scripts")[0];
		let items = this.bundle.getElementsByTagName("script-file");
		for(var i = 0; i < items.length; ++i)
		{
			let item = items[i];
			let src = item.getAttribute("src");
			let path = this._getResPath(src, this._getLoadContext(item));
			let howPackaged = "";

			//resource was already processed
			if(this.resMap[path] !== undefined)
				continue;	

			if(item.getAttribute("nopackage") == "true")
			{
				//nopackage means add the existing link to file
				let element = pkg.importNode(item, true);
				parentNode.appendChild(element);
				howPackaged = "reference";
			}
			else
			{
				//try to inline the file.
				try
				{
					let content = this._getResFile(path);
					let element = this._createInlineBlock("script-block", content, path);
					parentNode.appendChild(element);
					howPackaged = "inline";
				}
				catch(ex)
				{
					if(!this._config.addUnresolvedLinks)
						continue;

					let element = pkg.importNode(item, true);
					element.setAttribute("ibx-packager-import-fail", ex.message);
					parentNode.appendChild(element);
					howPackaged = "reference due to error: " + ex.message;
				}
			}

			//add to resource map.
			this.resMap[path] = howPackaged;
		}

		if(andSave)
			this.save();
		return pkg;
	}
	serialize()
	{
		let xs = new XMLSerializer();
		return xs.serializeToString(this.pkg);
	}
	save()
	{
		let src = this._bundleInfo.src;
		let filePath = this._getResPath("", "bundle");
		let fileExt = fsPath.extname(src);
		let fileName = fsPath.basename(src, fileExt);
		let fullPath = fsPath.resolve(sformat("{1}/{2}.ibxpackaged{3}", filePath, fileName, fileExt));
		fs.writeFileSync(fullPath, this.serialize(false))
	}
}
ibxResourceBundle.resTypeMap = 
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
