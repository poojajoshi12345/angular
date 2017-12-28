/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

//Simple string formatting function
function sformat()
{
    var s = arguments[0];
	var i = arguments.length;
    while (i--)
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    return s;
}

(function()
{
	/**** Platform checks ****/
	var ua = navigator.userAgent;
	var pc = window.ibxPlatformCheck = 
	{
		"isEdge": ((ua.match(".*Windows NT 10.0.*") != null) && (ua.match(".*Edge*.") != null)),
		"isIE": (ua.match(".*Trident.*") != null),
		"isFirefox": (ua.match(".*Firefox.*") != null),
		"isAndroid": (ua.match(".*Android.*") != null),
		"isChrome": (ua.match(".*Chrome.*") != null),
		"isiPad": (ua.match(".*iPad.*") != null),
		"isiPhone": (ua.match(".*iPhone.*") != null)
	};
	$.extend(pc, 
	{
		"isSafari":(ua.match(".*Safari.*") && !pc.isChrome),
		"isIOS": (pc.isiPad || pc.isiPhone),
		"isMobile": (pc.isiPad || pc.isiPhone || pc.isAndroid)
	});
})();

//Custom jQuery selectors
jQuery.expr[":"]["displayNone"] = function(elem)
{
	return ($(elem).css("display") == "none")
};
jQuery.expr[":"]["biComponent"] = function(elem)
{
	return $(elem).prop("_biComponent") ? true : false;
};
jQuery.expr[":"]["biFocusRoot"] = function(elem)
{
	return elem._biComponent ? elem._biComponent.isFocusRoot() : false;
};
jQuery.expr[":"]["ibxWidget"] = function(elem)
{
	return $(elem).data("ibxWidget") ? true : false;
};
jQuery.expr[":"]["ibxNameRoot"] = function(elem)
{
	elem = $(elem);
	var widget = elem.data("ibxWidget");
	var nameRoot = widget ? widget.options.nameRoot : elem.attr("data-ibx-name-root");
	return nameRoot;
};
jQuery.expr[":"]["ibxRadioGroup"] = function(elem, idx, meta, stack)
{
	elem = $(elem);
	var name = meta[3]
	var selector = sformat(".ibx-radio-group-control-{1}", name);
	return elem.is(selector);
};
jQuery.expr[":"]["ibxFocusable"] = function(elem, idx, meta, stack)
{
	var el = $(elem);
	var tRanges = meta[3] ? meta[3].split(",") : [0, Infinity];
	var tMin = 0, tMax = NaN;
	if(meta[3])
	{
		var range = meta[3].split(",");
		tMin = parseInt(range[0], 10);
		tMax = parseInt(range[1], 10);
	}
	tMax = isNaN(tMax) ? Infinity : tMax;

	var tabIndex = parseInt(el.attr("tabIndex"), 10);
	var visible = (el.css("visibility") != "hidden" && el.css("display") != "none");
	var ret = (tabIndex >= tMin && tabIndex <= tMax && visible);
	return ret;
};
jQuery.expr[":"]["ibxNavFocusable"] = function(elem, idx, meta, stack)
{
	var arrowsOnly = meta[3] ? (meta[3].toLowercase() == "true") : false;
	return $(elem).is(":ibxFocusable(-1, -1)");
};
jQuery.expr[":"]["inViewport"] = function(elem, idx, meta, stack)
{
	var elInfo = GetElementInfo(elem);
	var pInfo = GetElementInfo(elem.offsetParent);
	var ret = false;
	if(meta[3] == "true")//is partially visible
		ret = !(elInfo.left > pInfo.viewPort.right || elInfo.right < pInfo.viewPort.left || elInfo.top > pInfo.viewPort.bottom ||elInfo.bottom < pInfo.viewPort.top);
	else
		ret = elInfo.left >= pInfo.viewPort.left && elInfo.top >= pInfo.viewPort.top && elInfo.right <= pInfo.viewPort.right && elInfo.bottom <= pInfo.viewPort.bottom;
	return ret;
};
jQuery.expr[":"]["openPopup"] = function(elem, idx, meta, stack)
{
	elem = $(elem);
	var zLimits = meta[3] ? meta[3].split(",") : [];
	var zMin = $.isNumeric(zLimits[0]) ? zLimits[0] : 0;
	var zMax = $.isNumeric(zLimits[1]) ? zLimits[1] : Infinity;
	var zIndex = parseInt(elem.css("zIndex"), 10);
	zIndex = $.isNumeric(zIndex) ? zIndex : 0;
	return (elem.is(".ibx-popup:not(.pop-closed)") &&  zIndex >= zMin && zIndex <= zMax);
};
jQuery.expr[":"]["modalPopup"] = function(elem)
{
	return $(elem).is(".ibx-popup.pop-modal");
};
jQuery.expr[":"]["menuPopup"] = function(elem)
{
	return $(elem).is(".ibx-popup.ibx-menu");
};
jQuery.expr[":"]["openMenuPopup"] = function(elem)
{
	return $(elem).is(":openPopup:menuPopup");
};
jQuery.expr[":"]["openModalPopup"] = function(elem)
{
	return $(elem).is(":openPopup:modalPopup");
};
jQuery.expr[":"]["autoClose"] = function(elem)
{
	elem = $(elem);
	return elem.ibxWidget("option", "autoClose");
};
jQuery.expr[":"]["hasSubMenu"] = function(elem)
{
	var subMenu = $(elem).data("ibxSubMenu") || $(elem).children(".ibx-menu").length;
	return subMenu ? true : false;
};

// trigger/on/off using native dom events
// helpful is you don't want the events to bubble
// but still want to pass a data object to the handler
jQuery.fn.extend({
	// Add an event handler for a custom event created with triggerNative.
	// See comments below on how to retrieve the data object attached to the event.
	onNative: function (type, fn)
	{
		this.each(function (index, el)
		{
			el.addEventListener(type, $.fn._nativeHandler.bind(null, fn));
		});
	},
	// Remove event handler added with onNative.
	offNative: function (type, fn)
	{
		this.each(function (index, el)
		{
			el.removeEventListener(type);
		});
	},
	// Create a dom custom event of the given type.
	// By default it will not bubble.
	// Use 'data' to pass an object to the handler.
	// 1. Use jquery 'on' to add an event handler like this:
	//		$('.myobject').on("myevent", function (event){ console.log(event.originalEvent.data);});
	// 2. Use jquery 'onNative' to add an event handler like this:
	//		$('.myobject').onNative("myevent", function (event, data){ console.log(data);});
	// 3. Use native addEventListener to add an event handler like this:
	//		myelement.addEventListener("myevent", function (event){ console.log(event.data);});
	triggerNative: function (type, data, bubble, cancelable)
	{
		var event = document.createEvent("CustomEvent");
		event.initEvent(type, bubble, cancelable);
		event.data = data;
		this.each(function (index, el)
		{
			el.dispatchEvent(event);
		})
	},
	// Support function.
	_nativeHandler: function (fn, event)
	{
		return fn(event, event.data);
	},
});

//simple plugin to get the zIndex of the 0th element.
jQuery.fn["zIndex"] = function()
{
	return parseInt(this.css("zIndex"), 10);
};

//simple plugin to get the first level text node children
jQuery.fn.textNodes = function()
{
	var ret = [];
	this.each(function(ret, idx, el)
	{
		var children = $(el.childNodes);
		for(var i = 0; i < children.length; ++i)
		{
			var child = children[i];
			(child.nodeType == 3) ? ret.push(child) : null;
		}
	}.bind(this, ret));
	return $(ret);
};

//create a native browser event.
function createNativeEvent(type, data, canBubble, cancelable, relatedTarget)
{
	canBubble = canBubble !== undefined ? canBubble : true;
	cancelable = cancelable !== undefined ? cancelable : true;

	data = data || {}
	var e = null;
	if(typeof(Event) === "function")
		e = new Event(type, {"bubbles":canBubble, "cancelable":true})
	else
	{
		e = document.createEvent("CustomEvent");
		e.initCustomEvent(type, canBubble, cancelable, null);
	}
	e.data = data;
	e.relatedTarget = relatedTarget;
	return e;
}

//let jQuery dispatch custom native events
jQuery.fn.dispatchEvent = function(type, data, canBubble, cancelable, relatedTarget)
{
	var e = createNativeEvent(type, data, canBubble, cancelable, relatedTarget);
	this.each(function(e, idx, el)
	{
		el.dispatchEvent(e);
	}.bind(this, e));
	return e;
}

//For accessibility we need to create ibx specific aria ids
jQuery.fn.extend( {
	ibxAriaId: ( function() {
		var ibxariaid = 0;

		return function() {
			return this.each( function() {
				if ( !this.id ) {
					this.id = "ibx-aria-id-" + ( ++ibxariaid );
				}
			} );
		};
	} )(),
	removeIbxAriaId: function() {
		return this.each( function() {
			if ( /^ibx-aria-id-\d+$/.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		} );
	},
	hasIbxAriaId:function()
	{
		return isIbxAriaId(this.prop("id"));
	}
});
(function()
{
	//using closure here so we don't keep redefining regEx
	var regEx = /^ibx-aria-id-/;
	window.isIbxAriaId = function(id)
	{
		return regEx.test(id);
	};
})();

//Sorts elements on zIndex (in descending order).
function fnSortZIndex(el1, el2)
{
	el1 = jQuery(el1);
	el2 = jQuery(el2);

	var z1 = parseInt(el1.css("zIndex"), 10);
	var z2 = parseInt(el2.css("zIndex"), 10);

	if(z1 == z2)
		return 0;
	if(z1 > z2)
		return -1;
	if(z1 < z2)
		return 1;
}

//generate a pseudo random number between limits.
function GetRandomInt(min, max)
{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

//just returns metrics/info for an element.
function GetElementInfo(el, withMargin)
{
	el = $(el);
	var elInfo = el.position() || {};
	elInfo.el = el;
	elInfo.left = el.prop("offsetLeft");
	elInfo.top = el.prop("offsetTop");
	elInfo.width = el.outerWidth(!!withMargin);
	elInfo.height = el.outerHeight(!!withMargin);
	elInfo.right = elInfo.left + elInfo.width;
	elInfo.bottom = elInfo.top + elInfo.height;
	elInfo.viewPort = 
	{
		"left":el.prop("scrollLeft"),
		"top":el.prop("scrollTop")
	}
	elInfo.viewPort.right = elInfo.viewPort.left + el.innerWidth();
	elInfo.viewPort.bottom = elInfo.viewPort.top + el.innerHeight();
	return elInfo;
}

//search currently loaded stylesheets for defined rules of selector.
function FindStyleRules(selector)
{
	selector = (selector instanceof RegExp) ? selector : selector.replace(".", "\.");
	var ret = [];
	var sheets = document.styleSheets;
	for(var i = 0; i < sheets.length; ++i)
	{
		var sheet = sheets[i];
		var rules = sheet.cssRules;
		for(var j = 0; j < rules.length; ++j)
		{
			var rule = rules[j];
			if(rule.selectorText && rule.selectorText.match(selector) != null)
				ret.push(rule);
		}
	}
	return ret;
}

/****
[133907]
Function you can call to take a string that might have single or double quotes in it, and get back a string you can
use inside an xpath select statement.
****/
function XPathStringLiteral(s)
{
	if (s.indexOf('"')===-1)
		return '"'+s+'"';
	if (s.indexOf("'")===-1)
		return "'"+s+"'";
	return 'concat("'+s.replace(/"/g, '",\'"\',"')+'")';
}

/****
Function you can call to handel relative pathing.
Takes:	IBFS:/SSYS/USERS/../../EDA/EDASERVE/./ibisamp
Return:	IBFS:/EDA/EDASERVE/ibisamp
****/
function CanonicalizePath(strPath)
{
	var arPathOut = [];
	var arPathIn = strPath.replace("http://", "http:>>").split("/");
	while(arPathIn.length)
	{
		var strPathElem = arPathIn.shift();
		if(strPathElem == "..")
			arPathOut.pop();
		else
		if(!strPathElem || strPathElem == ".")
			/*do nothing*/;
		else
			arPathOut.push(strPathElem);
	}
	return arPathOut.join("/").replace("http:>>", "http://");
}

/**
*
*  Simple function to escape a string used as an attribute value in xml.
*  it will replace & with &amp;, < with &lt;, > with &gt;, ' with &apos;, and " with &quot;
*  use it when generating xml string in javascript code
*
**/
function escapeXmlString(string) 
{
    var s = "" + string;
    return s.replace(/\&/g,'&'+'amp;').replace(/</g,'&'+'lt;').replace(/>/g,'&'+'gt;').replace(/\'/g,'&'+'apos;').replace(/\"/g,'&'+'quot;');
}
function unescapeXmlString(string) 
{
    var s = "" + string;
    return s.replace(/&amp;/g, '&').replace(/&lt/g, '<').replace(/&gt;/g, '>').replace(/&apos;/g, '\'').replace(/&quot;/g, '\"');
}


/****
	MediaQuery is used to wrap the idea of creating javascript breakpoints to our code.  Also allows
	manipulation of the <meta name="viewport"> tag.
****/
function MediaQuery()
{
	/* Default Resgistered Media Query Lists */
	MediaQuery.addQuery("iPad", "(min-device-width: 768px) and (max-device-width: 1024px)");
	MediaQuery.addQuery("iPadPortrait", "(min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait)");
	MediaQuery.addQuery("iPadLandscape", "(min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape)");

	MediaQuery.addQuery("iPhone4", "(min-device-width: 320px) and (max-device-width: 480px)");
	MediaQuery.addQuery("iPhone4Portrait", "(min-device-width: 320px) and (max-device-width: 480px) and (orientation: portrait)");
	MediaQuery.addQuery("iPhone4Landscape", "(min-device-width: 320px) and (max-device-width: 480px) and (orientation: landscape)");

	MediaQuery.addQuery("iPhone5", "(min-device-width: 320px) and (max-device-width: 568px)");
	MediaQuery.addQuery("iPhone5Portrait", "(min-device-width: 320px) and (max-device-width: 568px) and (orientation: portrait)");
	MediaQuery.addQuery("iPhone5Landscape", "(min-device-width: 320px) and (max-device-width: 568px) and (orientation: landscape)");

	MediaQuery.addQuery("iPhone6", "(min-device-width: 375px) and (max-device-width: 667px)");
	MediaQuery.addQuery("iPhone6Portrait", "(min-device-width: 375px) and (max-device-width: 667px) and (orientation: portrait)");
	MediaQuery.addQuery("iPhone6Landscape", "(min-device-width: 375px) and (max-device-width: 667px) and (orientation: landscape)");

	MediaQuery.addQuery("iPhone6P", "(min-device-width: 414px) and (max-device-width: 736px)");
	MediaQuery.addQuery("iPhone6PPortrait", "(min-device-width: 414px) and (max-device-width: 736px) and (orientation: portrait)");
	MediaQuery.addQuery("iPhone6PLandscape", "(min-device-width: 414px) and (max-device-width: 736px) and (orientation: landscape)");
};
MediaQuery.EVENT_MEDIA_CHANGE = "mediaqueryhange";
MediaQuery._queries = {};
MediaQuery.getQueries = function getQueries(bMatches)
{
	return bMatches ? $.map(MediaQuery._queries, function(mql){return mql.matches ? mql : null;}) : MediaQuery._queries;
};
MediaQuery.refresh = function refresh()
{
	for(var key in MediaQuery._queries)
		MediaQuery._onMediaQueryListEvent(MediaQuery._queries[key]);
};
MediaQuery.addQuery = function(name, query)
{
	if(!window.matchMedia) //[BIP-580] Not supported in IE9
		return;

	if(MediaQuery._queries[name])
		MediaQuery.removeQuery(name);

	MediaQuery._queries[name] = mql = window.matchMedia(query);
	mql.name = name;
	mql.addListener(MediaQuery._onMediaQueryListEvent);
	MediaQuery._onMediaQueryListEvent(mql);
	return mql;
};
MediaQuery.removeQuery = function (name)
{
	mql = this._queries[name];
	mql.removeListener(MediaQuery._onMediaQueryListEvent);
	delete MediaQuery._queries[name];
	return mql;
};
MediaQuery._onMediaQueryListEvent = function(mql)
{
	var mql = (mql.target) ? mql.target : mql;
	$(window).trigger(MediaQuery.EVENT_MEDIA_CHANGE, mql);
};
MediaQuery.setViewPort = function(vpInfo)
{
	var vpElem = document.querySelector("meta[name=viewport]");
	if(vpInfo)
	{
		var vpCurrent = MediaQuery.getViewPort();
		for(var key in vpInfo)
			vpCurrent[key] = vpInfo[key];

		var strContent = "";
		for(var key in vpCurrent)
			strContent += key + "=" + vpCurrent[key] + ",";
		strContent = strContent.substring(0, strContent.lastIndexOf(","));

		if(vpElem)
			vpElem.setAttribute("content", strContent);
		else
		{
			vpElem = document.createElement("meta");
			vpElem.setAttribute("name", "viewport");
			vpElem.setAttribute("content", strContent);
			document.querySelector("head").appendChild(vpElem);
		}
	}
	else
	if(vpElem)
		vpElem.parentNode.removeChild(vpElem);

};
MediaQuery.getViewPort = function()
{
	var vpInfo = {};
	var vpElem = document.querySelector("meta[name=viewport]");
	if(vpElem)
	{
		var arContent = vpElem.getAttribute("content").split(",");
		for(var i = 0; i < arContent.length; ++i)
		{
			var keyVal = arContent[i].split("=");
			vpInfo[keyVal[0].replace(/ /g, "")] = keyVal[1].replace(/ /g, "");
		}
	}
	return vpInfo;
};
if(window.matchMedia)//Declare the static singleton if browser supports the matchMedia functionality.
	new MediaQuery();

/******************************************************************************
		USED FOR BUILDING WEBAPI WRAPPERS
******************************************************************************/
function WebApi(webAppContext, options)
{
	//[IBX-39] webAppName now passed as an option, not a parameter...so people can set when creating an ibfs, or derived, object.
	options = options || {};
	var webApiOptions = 
	{
		appContext: webAppContext,
		appName: options.webAppName,
		ppCtx: this,
		ajax:
		{
			context:this
		}
	};
	options = $.extend(true, {},  WebApi.statics.defaultExInfo, webApiOptions, options);
	this.setExOptions(options);
}
var _p = WebApi.prototype = new Object();

WebApi.statics = 
{
	defaultExInfo:
	{
		webApi:null,
		appContext:"",
		appName:"",
		relPath:"",
		parms:{},
		data:{},
		public:true,
		ppCtx:null,
		ppFun:null,
		result:null,
		error:null,
		errorHandling:true,
		jqNamespace:false,
		eNamespace:"webapi",
		ePreCall:"pre_call",
		ePostCall:"post_call",
		eSuccess:"success",
		eError:"error",
		tStart:null,
		tReturn:null,
		tComplete:null,

		//async and dataType are exposed at root object because they are commonly set.
		//they get copied into the ajax options in _p.exec.
		//note: ajax.context is set in WebApi constructor, as it's instance based.
		url:null,
		async:true,
		dataType:"xml",
		ajax:
		{
			cache:false,
			contentType:"application/x-www-form-urlencoded;charset=utf-8",
			context:null,
			data:{},
			method:"POST",
			url:"",
		},

		//promise stuff.
		deferred:null,
		done:function(fn)
		{
			this.deferred.done(fn);
			return this;//support chaining.
		}
	}
};

WebApi.genEventType = function(eventType, exInfo)
{
	return sformat("{1}{2}{3}", exInfo.eNamespace, exInfo.jqNamespace ? "" : "_",  eventType);
};

WebApi.genExecOptions = function(parms, data, ajax, options)
{
	options = $.extend(true, {parms:{}, data:{}, ajax:{data:{}}}, options);
	options.parms = $.extend(true, parms, options.parms);
	options.data = $.extend(true, data, options.data);
	options.ajax = $.extend(true, ajax, options.ajax);
	return options;
};

_p.getExOptions = function(){return this._defaultExInfo;};
_p.setExOptions = function(options)
{
	this._defaultExInfo = $.extend(true, this._defaultExInfo, options);
};

_p.exec = function exec(options)
{
	var exInfo = this._getExInfo();
	$.extend(true, exInfo, options);
	$.extend(true, exInfo.ajax.data, exInfo.parms);
	exInfo.deferred = $.Deferred();
	
	//copy outer values to actual ajax options.
	exInfo.ajax.url =  options.url || sformat("{1}/{2}{3}", exInfo.appContext, exInfo.appName,  exInfo.relPath ? ("/" + exInfo.relPath) : "");
	exInfo.ajax.async = exInfo.async;
	exInfo.ajax.dataType = exInfo.dataType;
	$.ajax(exInfo.ajax);

	return exInfo;
};

_p._getExInfo = function()
{
	var exInfo = $.extend(true, {}, this.getExOptions())
	exInfo.webApi = this;
	exInfo.deferred = $.Deferred();
	exInfo.ajax.beforeSend = this._onBeforeSend.bind(this, exInfo);
	exInfo.ajax.complete = this._onComplete.bind(this, exInfo);
	exInfo.ajax.success = this._onSuccess.bind(this, exInfo);
	exInfo.ajax.error = this._onError.bind(this, exInfo);
	return exInfo;
};
_p._onBeforeSend = function(exInfo, xhr, settings)
{
	exInfo.xhr = xhr;
	exInfo.tStart = new Date();
	$(window).trigger(WebApi.genEventType(exInfo.ePreCall, exInfo), exInfo);
};
_p._onSuccess = function(exInfo, res, status, xhr)
{
	/*default does nothing*/
};
_p._onError = function(exInfo, xhr, error, errorType)
{
	/*default does nothing*/
};
_p._onComplete = function(exInfo, xhr, status)
{
	exInfo.tComplete = new Date();
	xhr.exInfo = exInfo;

	var res = xhr.responseXML || xhr.responseJSON || xhr.responseText;
	var error = this._errorCheck(xhr, res, exInfo)
	if(!error)
	{
		exInfo.result = (exInfo.ppFun) ? exInfo.ppFun.call(exInfo.ppCtx, res, exInfo) : res;
		if(exInfo.public || exInfo.async)
			$(window).dispatchEvent(WebApi.genEventType(exInfo.eSuccess, exInfo), exInfo);
		exInfo.deferred.resolve(exInfo);
	}
	else
	{
		exInfo.deferred.reject(exInfo);
		this._handleError(error, res, exInfo);
	}
	$(window).dispatchEvent(WebApi.genEventType(exInfo.ePostCall, exInfo), exInfo);
};
_p._errorCheck = function(xhr, res, exInfo)
{
	var error = null;
	if(xhr.status != 200)
	{
		
		error = exInfo.error = new Error(sformat("{1} ({2})", xhr.statusText, xhr.status));
		error.name = xhr.statusText;
		error.code = xhr.status;
	}
	return error;
};
_p._handleError = function(error, res, exInfo)
{
	if($(window).dispatchEvent(WebApi.genEventType(exInfo.eError, exInfo), exInfo) && exInfo.errorHandling)
	{
		var options = 
		{
			"resizable":true,
			"type":"std error",
			"caption":"Ibfs Error",
			"messageOptions":{text:"Error: " + error.name},
			"buttons":"ok"
		};
		var info = ibx.resourceMgr.getResource(".ibfs-dlg-error", false);
		var dlg = $.ibi.ibxDialog.createMessageDialog(options).addClass("ibfs-error-dialog");
		dlg.ibxWidget("add", info.children()).resizable();
		ibx.bindElements(dlg[0])
		widget = dlg.data("ibxWidget");
		widget._errDetails.ibxWidget("option", "text", this._getErrorDetails(error, exInfo));
		dlg.ibxWidget("open");
	}
}
_p._getErrorDetails = function(error, exInfo)
{
	var strMsg = error.message + ":\n  " + exInfo.ajax.url + "\n";
	var strParms = ibx.resourceMgr.getString("IDS_IBFS_ERROR_DETAILS_PARMS") + "\n";
	for(var parm in exInfo.parms)
		strParms = sformat("{1}  {2}: {3}\n", strParms, parm, exInfo.parms[parm]);
	var strDoc = ibx.resourceMgr.getString("IDS_IBFS_ERROR_DETAILS_RET_DOC") + "\n" + exInfo.xhr.responseText;
	var strErr = sformat("{1}\n{2}\n{3}", strMsg, strParms, strDoc);
	return strErr;
}

//# sourceURL=util.ibx.js
