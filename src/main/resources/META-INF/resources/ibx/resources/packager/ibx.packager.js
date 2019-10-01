/*Copyright 1996-2019 Information Builders, Inc. All rights reserved.*/

"use strict";

const fs = require("fs");
const fsPath = require("path");
const EventEmitter = require("events");

//XML DOM support: https://www.npmjs.com/package/xmldom
const xmldom = require("xmldom");
const DOMParser = xmldom.DOMParser;
const XMLSerializer = xmldom.XMLSerializer;

//compression/obfuscation
var UglifyJS = require("uglify-es");

//Simple string formatting function
function sformat()
{
    let s = arguments[0];
	let i = arguments.length;
    while (i--)
	{
		let val = (arguments[i] === undefined || arguments[i] === null) ? "" : arguments[i];
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), val);
	}
    return s;
}
function log(str, depth)
{
	var padding = ("  ").repeat(depth || 0);
	console.log(padding + sformat(str, arguments));
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
		var tStart = new Date();
		log("ibx packaging started: " + tStart);

		this.config = config;
		for(let i = 0; i < config.bundles.length; ++i)
		{
			let bundleInfo = config.bundles[i];
			let resBundle = this._resBundles[bundleInfo.src] = new ibxResourceBundle(bundleInfo, config);
			resBundle.package()
			this.saveBundle(resBundle);
		}

		log(sformat("ibx packaging finished: {1}ms", (new Date()) - tStart));
	}
	saveBundle(resBundle)
	{
		let src = resBundle.bundleInfo.src;
		let filePath = resBundle.getResPath("", "bundle");
		let fileExt = fsPath.extname(src);
		let fileName = fsPath.basename(src, fileExt);
		let fullPath = fsPath.resolve(sformat("{1}/{2}.ibxpackaged{3}", filePath, fileName, fileExt));
		let strBundle = resBundle.serialize();
		fs.writeFileSync(fullPath, strBundle);
		log(sformat("[SAVED {1} ==> {2}]", src, fullPath), resBundle.depth);
	}
}
class ibxResourceBundle extends EventEmitter
{
	constructor(bundleInfo, globalConfig, parentResBundle)
	{
		super();
		this.globalConfig = globalConfig;
		this.bundleInfo = bundleInfo;
		this.bundle = null;
		this.depth = parentResBundle ? parentResBundle.depth + 1 : 1;
		this.resMap = parentResBundle ? parentResBundle.resMap : {};
		this.pkg = parentResBundle ? parentResBundle.pkg : null;
		this.parentResBundle = parentResBundle;
		this._init();
	}
	_init()
	{
		let bundlePath = this.bundleInfo.fullPath = this.getResPath(this.bundleInfo.src, this.bundleInfo.loadContext);
		let bundle = fs.readFileSync(bundlePath, "utf8");
		this.bundle = new DOMParser().parseFromString(bundle);

		let parentBundle = this.parentResBundle;
		while(parentBundle)
		{
			let parentBundleInfo = parentBundle.bundleInfo;
			this.bundleInfo = Object.assign({}, parentBundleInfo, this.bundleInfo);
			parentBundle = parentBundle.parentResBundle;
		}

		let template = this._template = fs.readFileSync(this.globalConfig.template, "utf8");
		this.pkg = this.pkg || new DOMParser().parseFromString(template);
		this.pkg.documentElement.setAttribute("name", this.bundle.documentElement.getAttribute("name"))
		this.pkg.documentElement.setAttribute("loadContext", this.bundle.documentElement.getAttribute("loadContext"))
	}
	_elementToObject(element)
	{
		let oRet = {};
		for(var i = 0; i < element.attributes.length; ++i)
		{
			let attr = element.attributes[i];
			let val = attr.value;
			if(val == "true" || val == "false")
				val = (val == "true") ? true : false;
			else
			if(!isNaN(val))
				val = Number(val);
			oRet[attr.nodeName.replace("pkg-", "")] = val;
		}
		return oRet;
	}
	_getLoadContext(element)
	{
		var loadContext = null;
		while(element)
		{
			loadContext = element.getAttribute("loadContext");
			if(loadContext)
				break;

			element = element.parentNode;

			if(element && !element.tagName)//root element
				element = null;
		}
		return loadContext;
	}
	getResPath(src, loadContext)
	{
		src = src.replace(/{context}/gm, this.globalConfig.contexts.webRoot);
			
		let ctxPath = "";
		if(loadContext == "ibx")
			ctxPath = this.globalConfig.contexts.ibx;
		else
		if(loadContext == "app")
			ctxPath = this.bundleInfo.appContext;
		else
		if(loadContext == "bundle")
			ctxPath = fsPath.dirname(this.bundleInfo.fullPath);
		
		//only adjust path if the src is not an absolute path from root.
		let resPath = fsPath.resolve(this.globalConfig.contexts.webRoot, ctxPath, src);

		return resPath;
	}
	getResFile(src)
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
	_preprocessFileContent(type, content)
	{
		if(type == "script-file" || type == "script-block")
		{
			content = content.replace(/<!\[CDATA/gmi, "");
			content = content.replace(/\]\]>/gmi, "");
		}
		return content;
	}
	package()
	{
		//now add the assets into the package
		let pkg = this.pkg;
		let bundleRoot = this.bundle.documentElement;

		log(`>>START packagaing ibx resoure bundle ${this.bundleInfo.fullPath}`, this.depth)

		//do recursived dependency bundles first...add ibx once, if required.
		let resBundles = Array.from(bundleRoot.getElementsByTagName("ibx-res-bundle"));
		if(this.bundleInfo.includeIbx && !this.bundleInfo.ibxIncluded)
		{
			let ibxBundle = this.bundle.createElement("ibx-res-bundle");
			ibxBundle.setAttribute("src", "./ibx_resource_bundle.xml");
			ibxBundle.setAttribute("loadContext", "ibx");
			resBundles.unshift(ibxBundle);
			this.bundleInfo.ibxIncluded = true;
		}
		this._importItems(resBundles);

		//markup
		this._importItems(Array.from(bundleRoot.getElementsByTagName("markup-file")));
		this._importItems(Array.from(bundleRoot.getElementsByTagName("markup-block")));

		//strings
		this._importItems(Array.from(bundleRoot.getElementsByTagName("string-file")));
		this._importItems(Array.from(bundleRoot.getElementsByTagName("string-bundle")));

		//styles
		this._importItems(Array.from(bundleRoot.getElementsByTagName("style-file")));
		this._importItems(Array.from(bundleRoot.getElementsByTagName("style-sheet")));

		//scripts
		this._importItems(Array.from(bundleRoot.getElementsByTagName("script-file")));
		this._importItems(Array.from(bundleRoot.getElementsByTagName("script-block")));

		//recurse bundles forward dependencies
		this._importItems(Array.from(bundleRoot.getElementsByTagName("res-packages")));

		log(`<<END packaging ibxResourceBundle ${this.bundleInfo.fullPath}`, this.depth)
		return pkg;
	}
	_importItems(items)
	{
		let pkg = this.pkg;
		items = (items instanceof Array) ? items : [items];
		for(var i = 0; i < items.length; ++i)
		{
			let item = items[i];
			let itemType = item.tagName;
			let importInfo = ibxResourceBundle.importTypeMap[itemType];
			let src = item.getAttribute("src");
			let loadContext = this._getLoadContext(item);
			let path = this.getResPath(src, loadContext);
			let parentNode = pkg.documentElement.getElementsByTagName(importInfo.group)[0] || pkg.documentElement;
			let howPackaged = "";
			let tStart = new Date();

			//resource was already processed...no duplicate entries
			if(!this.globalConfig.allowDuplicates && importInfo.importType == "file" && (this.resMap[path] !== undefined))
				continue;	

			//nodes that don't get packaged...just copied.
			if(item.getAttribute("nopackage") == "true" || (/{res}/g).test(src))
			{
				let element = pkg.importNode(item, true);
				element.setAttribute("src", src);
				element.setAttribute("loadContext", loadContext);
				parentNode.appendChild(element);
				howPackaged = "reference";
			}
			else
			if(importInfo.importType == "ibxresbundle")
			{
				let bundleInfo = Object.assign({}, this.bundleInfo, this._elementToObject(item));//copy our bundle info...overlay item's values.
				let subBundle = new ibxResourceBundle(bundleInfo, this.globalConfig, this);
				subBundle.package();
				howPackaged = "imported";
			}
			else
			if(importInfo.importType == "inline")
			{
				let element = pkg.importNode(item, true);
				element.setAttribute("src", this.bundleInfo.src);
				parentNode.appendChild(element);
				howPackaged = "inline";
			}
			else
			if(importInfo.importType == "file")
			{
				//try to inline the file.
				try
				{
					let content = this.getResFile(path);
					if(itemType == "script-file" && this.bundleInfo.minify)
					{
						let result = UglifyJS.minify(content);
						content = result.code + "//# sourceURL=" + fsPath.basename(path);//add source mapping back in for debuggin.
					}

					content = this._preprocessFileContent(itemType, content);
					let element = this._createInlineBlock(importInfo.nodeType, content, src);
					parentNode.appendChild(element);
					howPackaged = "inline";
				}
				catch(ex)
				{
					if(!this.globalConfig.addUnresolvedLinks)
						continue;

					let element = pkg.importNode(item, true);
					element.setAttribute("src", src);
					element.setAttribute("ibx-packager-import-fail", ex.message);
					parentNode.appendChild(element);
					howPackaged = "reference due to import error: " + ex.message;
				}
			}

			//add to resource map.
			this.resMap[path] = howPackaged;
			log(sformat("Packaged {1}: {2} ({3} {4}ms)", itemType, path, howPackaged, (new Date())-tStart), this.depth+1);
		}
	}
	serialize()
	{
		let xs = new XMLSerializer();
		return xs.serializeToString(this.pkg);
	}
}
ibxResourceBundle.logIndent = "  ";
ibxResourceBundle.importTypeMap = 
{
	"string-file":{"importType":"file", "nodeType":"string-bundle", "group":"strings"},
	"string-bundle":{"importType":"inline", "nodeType":"string-bundle", "group":"strings"},
	"style-file":{"importType":"file", "nodeType":"style-sheet", "group":"styles"},
	"style-sheet":{"importType":"inline", "nodeType":"script-sheet", "group":"styles"},
	"script-file":{"importType":"file", "nodeType":"script-block", "group":"scripts"},
	"script-block":{"importType":"inline", "nodeType":"script-block", "group":"scripts"},
	"markup-file":{"importType":"file", "nodeType":"markup-block", "group":"markup"},
	"markup-block":{"importType":"inline", "nodeType":"markup-block", "group":"markup"},
	"ibx-res-bundle":{"importType":"ibxresbundle", "nodeType":"ibx-res-bundle", "group":"res-bundles"},
	"ibx-res-package":{"importType":"ibxresbundle", "nodeType":"ibx-res-package", "group":"res-packages"},
};


//read config...kick off packaging.
let argv = process.argv.slice(2);
let config = fs.readFileSync(process.cwd() + "/" + argv[0]);
config = JSON.parse(config);
let pkg = new ibxPackager();
pkg.package(config);
