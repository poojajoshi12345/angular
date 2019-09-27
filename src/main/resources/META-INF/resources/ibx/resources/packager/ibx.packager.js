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
		var bundlePath = this._bundleInfo.fullPath = this._getResPath(this._bundleInfo.src, this._bundleInfo.loadContext);
		let bundle = fs.readFileSync(bundlePath, "utf8");
		this.bundle = new DOMParser().parseFromString(bundle);

		let template = this._template = fs.readFileSync(this._config.template, "utf8");
		this.pkg = this.pkg || new DOMParser().parseFromString(template);
		this.pkg.documentElement.setAttribute("name", this.bundle.documentElement.getAttribute("name"))
		this.pkg.documentElement.setAttribute("loadContext", this.bundle.documentElement.getAttribute("loadContext"))
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

			if(element && !element.tagName)//root element
				element = null;
		}
		return loadContext;
	}
	_getResPath(src, loadContext)
	{
		let ctxPath = "";
		if(loadContext == "ibx")
			ctxPath = this._config.contexts.ibx;
		else
		if(loadContext == "app")
			ctxPath = this._bundleInfo.appContext;
		else
		if(loadContext == "bundle")
			ctxPath = fsPath.dirname(this._bundleInfo.fullPath);
		
		//only adjust path if the src is not an absolute path from root.
		let resPath = fsPath.resolve(this._config.contexts.webRoot, ctxPath, src);
		return resPath;
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
		//should ibx be embedded in this package
		if(this._bundleInfo.includeIbx)
		{
			let bundleInfo = {includeIbx:false, loadContext:"ibx", src:"ibx_resource_bundle.xml"};
			let ibxBundle = new ibxResourceBundle(bundleInfo, this._config, this);
			ibxBundle.package();
		}

		//now add the assets into the package
		let pkg = this.pkg;
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

			//nodes that don't get packaged...just copied.
			if(item.getAttribute("nopackage") == "true" || (/{context}|{res}/g).test(src))
			{
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
					howPackaged = "reference due to import error: " + ex.message;
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
