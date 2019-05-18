/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.2 $:

/******************************************************************************
IOH wrapper
******************************************************************************/
function ioh(webAppContext, sesAuthParm, sesAuthVal, options)
{
	var iohOptions = 
	{
		sesAuthParm:sesAuthParm,
		sesAuthVal:sesAuthVal,
		eNamespace:"ibfs",
		webAppName:"wfirs"//[IBX-39]
	};
	options = $.extend({}, iohOptions, options);

	WebApi.call(this, webAppContext, options);
	this._baseImagePath = this._defaultExInfo.appContext + "/resource/image/bid/";
}
var _p = ioh.prototype = new WebApi();
ioh.base = WebApi.prototype;

_p._getExInfo = function()
{
	var exInfo = ioh.base._getExInfo.call(this);
	return exInfo;
};

_p.exec = function(options)
{
	return ioh.base.exec.call(this, options);
};

//check to see if ioh call succeeded...if base returns then there was an xhr error.
_p._errorCheck = function(xhr, res, exInfo)
{
	var error = ioh.base._errorCheck(xhr, res, exInfo);
	return error;
};

_p._handleError = function(error, res, exInfo)
{
	if($(window).dispatchEvent(WebApi.genEventType(exInfo.eError, exInfo), exInfo) && exInfo.errorHandling)
	{
		var options = 
		{
			'opaque': true,
			"resizable":true,
			"type":"std error",
			"caption":ibx.resourceMgr.getString("ioh Error"),
			"messageOptions":{text: sformat("{1} {2}", "Error Info:", error.name)},
			"buttons":"ok"
		};
		var info = ibx.resourceMgr.getResource(".ibfs-dlg-error", false);
		var dlg = $.ibi.ibxDialog.createMessageDialog(options).addClass("ibfs-error-dialog");
		dlg.ibxWidget("add", info.children()).resizable();
		ibx.bindElements(dlg[0]);
		widget = dlg.data("ibxWidget");
		widget._errDetails.ibxWidget("option", "text", this._getErrorDetails(error, exInfo));
		dlg.ibxWidget("open");
	}
};

_p._getErrorDetails = function(error, exInfo)
{
	var strMsg = error.message + ":\n  " + exInfo.ajax.url + "\n";
	var strParms = "Parameters:" + "\n";
	for(var parm in exInfo.parms)
		strParms = sformat("{1}  {2}: {3}\n", strParms, parm, exInfo.parms[parm]);
	var strDoc = ibx.resourceMgr.getString("IDS_IBFS_ERROR_DETAILS_RET_DOC") + "\n" + exInfo.xhr.responseText;
	var strErr = sformat("{1}\n{2}\n{3}", strMsg, strParms, strDoc);
	return strErr;
};

ioh.ioh = null;//Static load instance of ioh.
ioh.loaded = null;
ioh.load = function (webAppContext, sesAuthParm, sesAuthVal, options)
{
	if(!ioh.loaded)
	{
		/*used to get system info here for ibfs*/
	}
	return ioh.loaded;
};

ioh.DEFINES = 
{
	RETURN_CODES:
	{
		SUCCESS:"10000"
	},
	ITEM_TYPE_INFO:
	{
		/**** BUILT IN WEBFOCUS TYPES ****/
		"WebFOCUSComponent":{"bContainer":true, "strMask":"", "icon":"folder_closed_16.png", "iconSel":"folder_open_16.png", "extension":"", "glyph":"", "glyphClasses": "ibx-icons ibx-glyph-plus"},
		"MRFolder": { "bContainer": true, "strMask": "", "icon": "folder_closed_16.png", "iconSel": "folder_open_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-plus" },
		"ReposStructure": { "bContainer": true, "strMask": "", "icon": "folder_closed_16.png", "iconSel": "folder_open_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-plus" },
		"IBFSFolder": { "bContainer": true, "strMask": "", "icon": "folder_closed_16.png", "iconSel": "folder_open_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-plus" },
		"RecycleBin": { "bContainer": true, "strMask": "", "icon": "recycle_16.png", "iconSel": "recycle_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-plus" },
		"IBFSFile": { "bContainer": false, "strMask": "", "icon": "new_document_lined_16_h.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-unknown" },
		"MRRepository": { "bContainer": true, "strMask": "", "icon": "discovery_domain_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-plus" },
		"MyReportFolder": { "bContainer": true, "strMask": "", "icon": "myfolder_closed_16.png", "iconSel": "myfolder_open_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-plus" },
		"MemoryVirtualFolder": { "bContainer": true, "strMask": "", "icon": "folder_closed_16.png", "iconSel": "folder_open_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-plus" },
		"WEBFolder": { "bContainer": true, "strMask": "", "icon": "folder_closed_16.png", "iconSel": "folder_open_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-plus" },
		"EDANode": { "bContainer": true, "strMask": "", "icon": "reporting_server_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-plus" },
		"BipPortalsSubArea": { "bContainer": true, "strMask": "", "icon": "bip_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-plus" },
		"BipPortalsPortal": { "bContainer": false, "strMask": "", "icon": "portal_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-portal" },
		"BIPWFCPortalPageItem": { "bContainer": false, "strMask": "", "icon": "portal_pagev4_16.png", "extension": ".page", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-page" },
		"BIPWFCPortalItem": { "bContainer": false, "strMask": "", "icon": "portalv4_16.png", "extension": ".prtl", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-unknown" },
		"URLFile": { "bContainer": false, "strMask": "*.url", "icon": "url_16.png", "extension": "url", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-url" },
		"ROFexFile": { "bContainer": false, "strMask": "*.fex", "icon": "reporting_objects_16.png", "extension": ".fex", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-reporting-object" },
		"DeferredOutput": { "bContainer": false, "strMask": "*.orw", "icon": "deferred_output_16.png", "extension": ".orw", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-deferred-output" },
		"CasterSchedule": { "bContainer": false, "strMask": "*.sch", "icon": "schedule_16.png", "extension": ".sch", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-schedule" },
		"CasterAccessList": { "bContainer": false, "strMask": "*.acl", "icon": "library_accesslist_16.png", "extension": ".acl", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-access-list" },
		"CasterDistributionList": { "bContainer": false, "strMask": "*.adr", "icon": "", "extension": ".adr", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-address-book" },
		"CasterLibrary": { "bContainer": false, "strMask": "*.lib", "icon": "library_16.png", "extension": ".lib", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-library" },
		"Group": { "bContainer": true, "strMask": "", "icon": "group_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-plus" },
		"User": { "bContainer": false, "strMask": "", "icon": "user_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-address-book" },
		"PermissionSet": { "bContainer": false, "icon": "permissionset_16.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-unknown" },
		"HtmlFile": { "bContainer": false, "icon": "html_16.png", "extension": ".htm", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-html" },
		"LinkItem": { "bContainer": false, "icon": "", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-shortcut" },
		"blog": { "bContainer": false, "icon": "annotation_restore.png", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-blog" },
		"PGXBundle": { "bContainer": false, "icon": "", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-page" },
		"PRTLXBundle": { "bContainer": false, "icon": "", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-portal" },
		"BIPWFCPortalItem": { "bContainer": false, "icon": "", "extension": "", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-portal" },
		"StyFile": { "bContainer": false, "strMask": "*.sty", "icon": "", "extension": ".sty", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-sty" },
		"Property": { "bContainer": false, "strMask": "*.prop", "icon": "", "extension": ".prop", "glyph": "", "glyphClasses": "fa fa-cog" },
		"WhatIfFile": { "bContainer": false, "strMask": "*.wif", "icon": "", "extension": ".wif", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-what-if-icon" },
		
		/**** FEX FILES ARE SPECIAL. See the '_ppdir' function to see how they are handled separately. ****/
		"FexFile": { "bContainer": false, "strMask": "*.fex", "icon": "new_document_lined_16_h.png", "extension": ".fex", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-fex-document" },
		"FexEditor": { "bContainer": false, "strMask": "*.fex", "icon": "new_document_lined_16_h.png", "extension": ".fex", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-fex-document" },
		"FexChart": { "bContainer": false, "strMask": "*.fex", "icon": "output_chart_16.png", "extension": ".fex", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-fex-chart" },
		"FexInsight": { "bContainer": false, "strMask": "*.fex", "icon": "enhanced_run_32.png", "extension": ".fex", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-insight" },
		"FexCompose": { "bContainer": false, "strMask": "*.fex", "icon": "document_16.png", "extension": ".fex", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-fex-document" },
		"FexAlert": { "bContainer": false, "strMask": "*.fex", "icon": "alert_16.png", "extension": ".fex", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-fex-document" },
		"FexInfoMini": { "bContainer": false, "strMask": "*.fex", "icon": "infomini_report_16.png", "extension": ".fex", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-fex-document" },
		"FexDataVis": { "bContainer": false, "strMask": "*.fex", "icon": "ID_dashboard_16.png", "extension": ".fex", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-fex-visualization" },
		"FexDataPrep": { "bContainer": false, "strMask": "*.fex", "icon": "data_extract_16.png", "extension": ".fex", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-fex-document" },
		"fex": { "bContainer": false, "strMask": "*.fex", "icon": "new_document_lined_16_h.png", "extension": ".fex", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-fex-document" },

		/**** STANDARD FILE TYPES ****/
		"mas": { "bContainer": false, "strMask": "*.mas", "icon": "master_16.png", "extension": ".mas", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-master" },
		"sty": { "bContainer": false, "strMask": "*.sty", "icon": "sty_16.png", "extension": ".sty", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-sty" },
		"jpg": { "bContainer": false, "strMask": "*.jpg", "icon": "jpeg_16.png", "extension": ".jpg", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-image" },
		"jpeg": { "bContainer": false, "strMask": "*.jpeg", "icon": "jpeg_16.png", "extension": ".jpeg", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-image" },
		"gif": { "bContainer": false, "strMask": "*.gif", "icon": "gif_16.png", "extension": ".gif", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-image" },
		"png": { "bContainer": false, "strMask": "*.png", "icon": "png_16.png", "extension": ".png", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-image" },
		"bmp": { "bContainer": false, "strMask": "*.bmp", "icon": "bmp_16.png", "extension": ".bmp", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-image" },
		"htm": { "bContainer": false, "strMask": "*.htm", "icon": "html_16.png", "extension": ".htm", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-html" },
		"html": { "bContainer": false, "strMask": "*.html", "icon": "html_16.png", "extension": ".html", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-html" },
		"pdf": { "bContainer": false, "strMask": "*.pdf", "icon": "format_pdf_16.png", "extension": ".pdf", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-pdf" },
		"acl": { "bContainer": false, "strMask": "*.acl", "icon": "library_accesslist_16.png", "extension": ".acl", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-access-list" },
		"adr": { "bContainer": false, "strMask": "*.adr", "icon": "distributionlist_16.png", "extension": ".adr", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-address-book" },
		"css": { "bContainer": false, "strMask": "*.css", "icon": "css_16.png", "extension": ".css", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-css" },
		"CssFile": { "bContainer": false, "strMask": "*.css", "icon": "css_16.png", "extension": ".css", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-css" },
		"wri": { "bContainer": false, "strMask": "*.wri", "icon": "mr_ex_wri.png", "extension": ".wri", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-unknown" },
		"xls": { "bContainer": false, "strMask": "*.xls", "icon": "format_excel_16.png", "extension": ".xls", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-excel" },
		"xlsx": { "bContainer": false, "strMask": "*.xlsx", "icon": "format_excel_16.png", "extension": ".xlsx", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-excel" },
		"doc": { "bContainer": false, "strMask": "*.doc", "icon": "word_16.png", "extension": ".doc", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-word" },
		"docx": { "bContainer": false, "strMask": "*.docx", "icon": "word_16.png", "extension": ".docx", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-word" },
		"ppt": { "bContainer": false, "strMask": "*.ppt", "icon": "format_ppt_16.png", "extension": ".ppt", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-powerpoint" },
		"pptx": { "bContainer": false, "strMask": "*.pptx", "icon": "format_ppt_16.png", "extension": ".pptx", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-powerpoint" },
		"svg": { "bContainer": false, "strMask": "*.svg", "icon": "svg_16.png", "extension": ".svg", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-image" },
		"xml": { "bContainer": false, "strMask": "*.xml", "icon": "format_xml_16.png", "extension": ".xml", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-xml" },
		"txt": { "bContainer": false, "strMask": "*.txt", "icon": "new_document_lined_16_h.png", "extension": ".txt", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-text" },
		"csv": { "bContainer": false, "strMask": "*.txt", "icon": "new_document_lined_16_h.png", "extension": ".txt", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-text" },
		"tab": { "bContainer": false, "strMask": "*.txt", "icon": "new_document_lined_16_h.png", "extension": ".txt", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-text" },
		"ftm": { "bContainer": false, "strMask": "*.txt", "icon": "new_document_lined_16_h.png", "extension": ".txt", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-text" },
		"ps": { "bContainer": false, "strMask": "*.txt", "icon": "new_document_lined_16_h.png", "extension": ".txt", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-text" },
		"wp": { "bContainer": false, "strMask": "*.txt", "icon": "new_document_lined_16_h.png", "extension": ".txt", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-text" },
		"wk1": { "bContainer": false, "strMask": "*.txt", "icon": "new_document_lined_16_h.png", "extension": ".txt", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-text" },
		"mht": { "bContainer": false, "strMask": "*.txt", "icon": "new_document_lined_16_h.png", "extension": ".txt", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-html" },
		"swf": { "bContainer": false, "strMask": "*.txt", "icon": "new_document_lined_16_h.png", "extension": ".txt", "glyph": "", "glyphClasses": "fa fa-file-video-o" },		
		"xht": { "bContainer": false, "strMask": "*.xht", "icon": "format_excel_16.png", "extension": ".xht", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-excel" },
		"zip": { "bContainer": false, "strMask": "*.zip", "icon": "format_zip_16.png", "extension": ".zip", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-zip" },
		"ely": { "bContainer": false, "strMask": "*.ely", "icon": "format_ely_16.png", "extension": ".ely", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-ely" },
		"wif": { "bContainer": false, "strMask": "*.wif", "icon": "format_wif_16.png", "extension": ".wif", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-what-if-icon" },
		"js": { "bContainer": false, "strMask": "*.js", "icon": "new_document_lined_16_h.png", "extension": ".js", "glyph": "", "glyphClasses": " ibx-icons ibx-glyph-file-text" },
		"py": { "bContainer": false, "strMask": "*.py", "icon": "new_document_lined_16_h.png", "extension": ".py", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-text" },
		"r": { "bContainer": false, "strMask": "*.r", "icon": "new_document_lined_16_h.png", "extension": ".r", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-text" },
		"prop": { "bContainer": false, "strMask": "*.prop", "icon": "new_document_lined_16_h.png", "extension": ".prop", "glyph": "", "glyphClasses": "fa fa-cog" },
		"foc": { "bContainer": false, "strMask": "*.foc", "icon": "new_document_lined_16_h.png", "extension": ".foc", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-text" },
		"acx": { "bContainer": false, "strMask": "*.acx", "icon": "new_document_lined_16_h.png", "extension": ".acx", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-text" },
		"dat": { "bContainer": false, "strMask": "*.dat", "icon": "new_document_lined_16_h.png", "extension": ".dat", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-text" },
		"sql": { "bContainer": false, "strMask": "*.sql", "icon": "new_document_lined_16_h.png", "extension": ".sql", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-text" },

		/**** DEFAULT UNKNOWN FILE TYPE ****/
		"unknownType": { "bContainer": false, "strMask": "", "icon": "new_document_lined_16_h.png", "extension": "*", "glyph": "", "glyphClasses": "ibx-icons ibx-glyph-file-unknown" }
	}
};

ioh.isIohPath = function(path)
{
	return (-1 != path.search(/IOH:\/WFC/i));
};

ioh.decodePolicy = function(base64Policy)
{
	var opInfo = ioh.systemInfo.roleInfo.operations;
	base64Policy = base64Policy || "";
	var retPolicy = {};
	for(var op in opInfo)
	{
		var char64 = base64Policy.charCodeAt(opInfo[op].byteOffset);
		var nbyte = 0;
		if(47 < char64 && char64 < 58)
			nbyte = (char64 + 4);
		else if(64 < char64 && char64 < 91)
			nbyte = (char64 - 65);
		else if(96 < char64 && char64 < 123)
			nbyte = (char64 - 71);
		else if(43 == char64)
			nbyte = 62;
		else if(47 == char64)
			nbyte = 63;
		retPolicy[op] = ((opInfo[op].bitMask & nbyte) != 0);
	}
	return retPolicy;
};

ioh.DEFINES.EVENTS.LIST_ITEMS = "list_items";
_p.listItems = function(strPath, depth, flatten, options)
{
	//overload so you can just pass the path if you want.
	if(depth instanceof Object)
	{
		options = depth;
		depth = 1;
	}

	var parms = 
	{
		"IBFS_action":"list",
		"IBFS_path":strPath,
		"IBFS_flatten": flatten || "false",
		"IBFS_recursionDepth": depth || "1",
		"IBFS_options":""
	};
	options = WebApi.genExecOptions(parms, null, null, options);
	options.clientSort = (options.clientSort === undefined) ? false : options.clientSort;
	options.clientSortDescending = (options.clientSortDescending === undefined) ? false : options.clientSortDescending;
	options.clientSortAttr = options.clientSortAttr || "description";
	options.eSuccess = ioh.DEFINES.EVENTS.LIST_ITEMS;
	options.ppFun = options.ppFun || this._pplistItems;
	options.ppPattern = "rootObject > item";
	return this.exec(options);
};
_p._pplistItems = function(res, exInfo)
{
	var result = res;
	return result;
};


//# sourceURL=ioh.js
