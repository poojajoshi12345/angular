/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.122 $:


/****
	UTILITY FUNCTION FOR DERIVING CLASSES IN BASE CLASS CHECK TO SEE IF
	_ibxInPrototype = true, and return before doing anything
	eg:
		function myBaseClass()
		{
			if(_ibxInPrototype)return;
			IF NOT THEN DO CONSTRUCTION AS USUAL
		}
	THIS STOPS PROTOTYPE FROM FULLY CONSTRUCTING.
****/
var _jsDerivingClass = false;
function jsDeriveClass(fnClass, fnBase)
{
	_jsDerivingClass = true;
	var p = fnClass.prototype = new fnBase;
	p.constructor = fnClass;
	_jsDerivingClass = false;
	return p;
}


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

//polyfill for Object.assign
if (typeof Object.assign !== 'function') {
	// Must be writable: true, enumerable: false, configurable: true
	Object.defineProperty(Object, "assign", {
	  value: function assign(target, varArgs) { // .length of function is 2
		'use strict';
		if (target === null || target === undefined) {
		  throw new TypeError('Cannot convert undefined or null to object');
		}
  
		var to = Object(target);
  
		for (var index = 1; index < arguments.length; index++) {
		  var nextSource = arguments[index];
  
		  if (nextSource !== null && nextSource !== undefined) {
			for (var nextKey in nextSource) {
			  // Avoid bugs when hasOwnProperty is shadowed
			  if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
				to[nextKey] = nextSource[nextKey];
			  }
			}
		  }
		}
		return to;
	  },
	  writable: true,
	  configurable: true
	});
  }

(function()
{
	/**** Platform checks ****/
	var ua = navigator.userAgent;
	var pc = window.ibxPlatformCheck = 
	{
		"isEdge": ((ua.match(/.*Windows NT 10.0.*/) != null) && (ua.match(".*Edge*.") != null)),
		"isIE": (ua.match(/.*Trident.*/) != null),
		"isFirefox": (ua.match(/.*Firefox.*/) != null),
		"isAndroid": (ua.match(/.*Android.*/) != null),
		"isChrome": (ua.match(/.*Chrome.*/) != null),
		"isiPad": ((ua.match(/.*iPad.*/) != null)),
		"isiPhone": ((ua.match(/.*iPhone.*/) != null))
	};
	$.extend(pc, 
	{
		"isSafari":(ua.match(/.*Safari.*/) && !pc.isChrome),
		"isIOS": (pc.isiPad || pc.isiPhone),
		"isMobile": (pc.isiPad || pc.isiPhone || pc.isAndroid)
	});
})();

//Custom jQuery selectors
jQuery.expr[":"]["displayNone"] = function(elem)
{
	return ($(elem).css("display") == "none");
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
	var name = meta[3];
	var selector = sformat(".ibx-radio-group-control-{1}", name);
	return elem.is(selector);
};
jQuery.expr[":"]["ibxFocusable"] = function(elem, idx, meta, stack)
{
	var el = $(elem);
	var tMin = 0, tMax = NaN;
	if(meta[3])
	{
		var range = meta[3].split(",");
		tMin = parseInt(range[0], 10);
		tMax = parseInt(range[1], 10);
	}
	tMax = isNaN(tMax) ? Infinity : tMax;

	var tabIndex = parseInt(el.attr("tabIndex"), 10);
	var ret = (tabIndex >= tMin && tabIndex <= tMax);
	return ret && el.is(":ibxVisible:ibxEnabled");
};
jQuery.expr[":"]["ibxNavFocusable"] = function(elem, idx, meta, stack)
{
	var arrowsOnly = meta[3] ? (meta[3].toLowercase() == "true") : false;
	return $(elem).is(":ibxFocusable(-1)");
};
jQuery.expr[":"]["ibxVisible"] = function(elem, idx, meta, stack)
{
	elem = $(elem);
	return elem.is(":visible") && (elem.css("visibility") !== "hidden");
}
jQuery.expr[":"]["ibxEnabled"] = function(elem, idx, meta, stack)
{
	elem = $(elem);
	return !elem.is(".ibx-widget-disabled");
}
jQuery.expr[":"]["inViewport"] = function(elem, idx, meta, stack)
{
	console.warn("[ibx Not Implemented] This filter is not currently implemented!");
	return false;
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
jQuery.expr[':'].containsNoCase = function(a, i, m)
{
  return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) != -1;
};


//Implement the native element classList api as alternate to jQuery...much faster than the jQuery add/removeClass functions.
//of course, for IE...don't do anything fancy, as it is stinko.
ibx.useCustomClassAPI = true;
jQuery.fn.extend(
{
	ibxAddClass:function(classes)
	{
		if(!ibx.useCustomClassAPI)
			return this.addClass(classes);

		if(!classes)
			return this;

		var args = Array.isArray(classes) ? classes : classes.trim().replace(/ +/g, " ").split(" ");
		if(!args.length)
			return this;
		
		var i = 0;
		while((elem = this[ i++ ]))
		{
			if(ibxPlatformCheck.isIE)
			{
				for(var j = 0; elem.classList && j < args.length; ++j)
					elem.classList.add(args[j]);
			}
			else
				DOMTokenList.prototype.add.apply(elem.classList, args);
		}

		return this;
	},
	ibxRemoveClass:function(classes)
	{
		if(!ibx.useCustomClassAPI)
			return this.removeClass(classes);

		if(!classes)
			return this;

		var args = Array.isArray(classes) ? classes : classes.trim().replace(/ +/g, " ").split(" ");
		if(!args.length)
			return this;

		var i = 0;
		while((elem = this[ i++ ]))
		{
			if(ibxPlatformCheck.isIE)
			{
				for(var j = 0; elem.classList && j < args.length; ++j)
					elem.classList.remove(args[j]);
			}
			else
				DOMTokenList.prototype.remove.apply(elem.classList, args);
		}
		return this;
	},
	ibxToggleClass:function(value, stateVal)
	{
		if(!ibx.useCustomClassAPI)
			return this.toggleClass(value, stateVal);

		if(!value)
			return this;

		var args = Array.isArray(value) ? value : value.trim().replace(/ +/g, " ").split(" ");
		if(!args.length)
			return this;

		var i = 0;
		while((elem = this[ i++ ]))
		{
			for(var j = 0; j < args.length; ++j)
			{
				var arg = args[j];
				if(ibxPlatformCheck.isIE)
				{
					if(elem.classList)
					{
						if(stateVal === undefined)
							elem.classList.toggle(arg);
						else
							(!stateVal) ? elem.classList.remove(arg) : elem.classList.add(arg);//of course, IE doesn't handle toggle correctly (so, polyfill)
					}
				}
				else
					elem.classList.toggle(arg, stateVal);
			}
		}
		return this;
	},
	ibxReplaceClass:function(oldClass, newClass)
	{
		var i = 0;
		while((elem = this[ i++ ]))
		{
			if(ibxPlatformCheck.isIE)
			{
				if(elem.classList)
					$(elem).removeClass(oldClass).addClass(newClass)
			}
			else
				elem.classList.replace(oldClass, newClass);
		}
		return this;
	},
	ibxHasClass:function(className)
	{
		if(!ibx.useCustomClassAPI)
			return this.hasClass(className);

		var i = 0;
		while((elem = this[ i++ ]))
		{
			if(elem.classList.contains(className))
				return true;
		}
		return false;
	},
	ibxItemClass:function(nItem)
	{
		return this[0] ? this[0].classList.item(nItem) : null;
	},
});

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
		});
	},
	// Support function.
	_nativeHandler: function (fn, event)
	{
		return fn(event, event.data);
	},
});

//is the first element the focused element.
jQuery.fn.isFocused = function()
{
	var el = this[0];
	var isFocused = !!(el && (el === document.activeElement && (el.nodeType || el.href)));
	return isFocused;
};

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

jQuery.fn.bounds = function(inner)
{
	var bounds = this.position();
	bounds.width = inner ? this.width() : this.outerWidth();
	bounds.height = inner ? this.height() : this.outerHeight();
	bounds.right = bounds.left + bounds.width;
	bounds.bottom = bounds.top + bounds.height;
	return bounds;
};

//regardless of layers of DOM...is a descendent 'logically' a child of this element
jQuery.fn.logicalChildren = function(parentSelector, childSelector)
{
	var children = this.find(childSelector);
	var ret = children.filter(function(idx, el)
	{
		return $(el.parentNode).closest(parentSelector, this).is(this);
	}.bind(this));
	return ret;
};

//
jQuery.fn.directChild = function(el)
{
	var child = $(el);
	while(child.length && !child.parent().is(this))
	{
		child = child.parent();
	}
	return child[0];
};


//force redraw/repaint element...I'm dubious about whether this actually works...got from:
//https://stackoverflow.com/questions/3485365/how-can-i-force-webkit-to-redraw-repaint-to-propagate-style-changes
jQuery.fn.redraw = function()
{
	this.each(function(idx, el)
	{
		el.offsetHeight;
	});
	return this;
};

//create a native browser event.
function createNativeEvent(type, data, canBubble, cancelable, relatedTarget, ctxDocument)
{
	doc = ctxDocument || document;
	canBubble = canBubble !== undefined ? canBubble : true;
	cancelable = cancelable !== undefined ? cancelable : true;

	/*[IBX-191] ie/edge don't allow cross document dispatching of events...so events must be created in the target document context*/
	var e = null;
	if(typeof(Event) === "function" && (!ibxPlatformCheck.isEdge && !ibxPlatformCheck.isIE))
	{
		e = new Event(type, {"bubbles":canBubble, "cancelable":cancelable});
		e.isDefaultPrevented = function(){return this.defaultPrevented;};
	}
	else
	{
		//this crap about the preventDefault is because it appears preventDefault doesn't work on CustoEvents in IE...Thanks IE!
		e = doc.createEvent("CustomEvent");
		e.initCustomEvent(type, canBubble, cancelable, null);
		e.ieDefaultPrevented = false;
		e.preventDefault = function(){this.ieDefaultPrevented = true;};
		e.isDefaultPrevented = function(){return this.ieDefaultPrevented;};
	}

	e.data = data;
	e.relatedTarget = relatedTarget;
	return e;
}

//take a native event and create a new event, then copy all fields from native to new.
function cloneNativeEvent(e, type, data, canBubble, cancelable, relatedTarget, ctxDocument)
{
	var evt = createNativeEvent(type, data, canBubble, cancelable, relatedTarget, ctxDocument);
	for(var key in e)
	{
		var prop = e[key];
		if((prop instanceof Function))
			continue;
		evt[key] = prop;
	}
	return evt;
}

//let jQuery dispatch custom native events
jQuery.fn.dispatchEvent = function(eType, data, canBubble, cancelable, relatedTarget, ctxDocument)
{
	var evt = (typeof(eType) == "object") ? cloneNativeEvent(eType, eType.type, data, ctxDocument) : createNativeEvent(eType, data, canBubble, cancelable, relatedTarget, ctxDocument);
	this.each(function(evt, idx, el)
	{
		el.dispatchEvent(evt);
	}.bind(this, evt));
	return evt;
};

//just returns metrics/info for an element.
jQuery.fn.metrics = function()
{
	element = this[0];
	if(!element)
		return;

	var style = window.getComputedStyle(element);
	var elInfo = {el:element, "style":style, "isBorderSizing":(style.boxSizing === "border-box")};
	var html = document.documentElement;

	var viewportBox = elInfo.pageViewportBox = element.getBoundingClientRect();
	var pageBox = elInfo.pageBox = 
	{
		left: viewportBox.left + html.scrollLeft,
		top: viewportBox.top + html.scrollTop,
		right:viewportBox.left + viewportBox.width,
		bottom: viewportBox.top + viewportBox.height,
		width: viewportBox.width,
		height: viewportBox.height
	};

	var marginBox = elInfo.marginBox = 
    {
    	left: element.offsetLeft - parseFloat(style.marginLeft),
    	top: element.offsetTop - parseFloat(style.marginTop),
    };
	marginBox.right = element.offsetLeft + element.offsetWidth + parseFloat(style.marginRight || 0);
	marginBox.bottom = element.offsetTop + element.offsetHeight + parseFloat(style.marginBottom || 0);
	marginBox.width = marginBox.right - marginBox.left;
	marginBox.height = marginBox.bottom - marginBox.top;

	var borderBox = elInfo.borderBox = 
    {
    	left: element.offsetLeft,
    	top: element.offsetTop,
    };
	borderBox.right = element.offsetLeft + element.offsetWidth;
	borderBox.bottom = element.offsetTop + element.offsetHeight;
	borderBox.width = element.offsetWidth;
	borderBox.height = element.offsetHeight;

	var contentBox = elInfo.contentBox = 
    {
    	left: borderBox.left + parseFloat(style.borderLeft || 0),
    	top: borderBox.top + parseFloat(style.borderTop || 0),
    };
	contentBox.right = borderBox.right - parseFloat(style.borderRight || 0);
	contentBox.bottom = borderBox.bottom - parseFloat(style.borderBottom || 0);
	contentBox.width = contentBox.right - contentBox.left;
	contentBox.height = contentBox.bottom - contentBox.top;

	var innerBox = elInfo.innerBox = 
    {
    	left: contentBox.left + parseFloat(style.paddingLeft || 0),
    	top: contentBox.top + parseFloat(style.paddingTop || 0),
    };
	innerBox.right = contentBox.right - parseFloat(style.paddingRight || 0);
	innerBox.bottom = contentBox.bottom - parseFloat(style.paddingBottom || 0);
	innerBox.width = innerBox.right - innerBox.left;
	innerBox.height = innerBox.bottom - innerBox.top;

	var positioned = (style.position != "static");
	var viewportBox = elInfo.viewportBox = 
    {
    	left: positioned ? element.scrollLeft : contentBox.left + element.scrollLeft,
    	top: positioned ? element.scrollTop : contentBox.top + element.scrollTop
    };
	viewportBox.right = viewportBox.left + contentBox.width;
	viewportBox.bottom = viewportBox.top + contentBox.height;
	viewportBox.width = viewportBox.right - viewportBox.left;
	viewportBox.height = viewportBox.bottom - viewportBox.top;

	return elInfo;
};

jQuery.fn.visInfo = function(box, pBox)
{
	var elMetrics = this.metrics();
	var elBox = elMetrics[box || "borderBox"];
	var pBox = pBox || this.parent().metrics().viewportBox;
	var ret = 
	{
		"lVis": (elBox.left > pBox.left && elBox.left < pBox.right),
		"rVis": (elBox.right > pBox.left && elBox.right < pBox.right),
		"tVis": (elBox.top > pBox.top && elBox.top < pBox.bottom ),
		"bVis": (elBox.bottom > pBox.top && elBox.bottom < pBox.bottom)
	};
	ret.total = (ret.lVis && ret.rVis && ret.tVis && ret.bVis);
	ret.partial = (ret.lVis || ret.rVis) && (ret.tVis || ret.bVis);
	ret.partial = ret.partial || rectIntersect(elBox, pBox);
	return ret;
};

function rectIntersect(r1, r2)
{
    return r1.left < r2.right && r2.left < r1.right &&
            r1.top < r2.bottom && r2.top < r1.bottom;
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


//does the keyboard event match the shortcut string (CTRL+C, eg.)
//[IBX-79](extend jQueryUI's key aliases to include abreviated versions)
$.extend($.ui.keyCode, 
{
	"BACK":8,
	"DEL":46,
	"ESC":27,
	"PG-DOWN":34,
	"PG-UP":33,
});
function eventMatchesShortcut(shortcut, evtKey)
{
	var ret = false;
	if(shortcut)
	{
		var sc = shortcut.toUpperCase();
		var match = (-1 != sc.indexOf("CTRL")) ? evtKey.ctrlKey : !evtKey.ctrlKey;
		match &= match & (-1 != sc.indexOf("ALT")) ? evtKey.altKey : !evtKey.altKey;
		match &= match & (-1 != sc.indexOf("SHIFT")) ? evtKey.shiftKey : !evtKey.shiftKey;

		sc = sc.replace(/CTRL|ALT|SHIFT|\+| /gi, "");
		ret = match & (($.ui.keyCode[sc] == evtKey.keyCode) || (parseInt(sc, 10) == evtKey.keyCode) || (evtKey.key && sc == evtKey.key.toUpperCase()));
	}
	return ret;
}

//general function for sorting dom elements on a given attribute.
function fnAttrSort(attr, fmt, caseInsensitive, el1, el2)
{
	el1 = jQuery(el1);
	el2 = jQuery(el2);

	var v1 = el1.attr(attr);
	v1 = (fmt == "numeric") ? Number(v1) : (caseInsensitive) ? v1.toLowercase() : v1;
	var v2 = el2.attr(attr);
	v2 = (fmt == "numeric") ? Number(v2) : (caseInsensitive) ? v2.toLowercase() : v2;

	if(v1 < v2)
		return -1;
	if(v1 > v2)
		return 1;
	return 0;
}

//Sorts elements on zIndex (in descending order).
function fnSortZIndex(el1, el2)
{
	el1 = jQuery(el1);
	el2 = jQuery(el2);

	var z1 = parseInt(el1.css("zIndex"), 10);
	var z2 = parseInt(el2.css("zIndex"), 10);

	if(z1 > z2)
		return -1;
	if(z1 < z2)
		return 1;
	return 0;
}

//generate a pseudo random number between limits.
function GetRandomInt(min, max)
{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

//find the current screen dpu based on unit
function dpu(unit, dir)
{
	var sizeRef = $("<div>").appendTo("body");
	sizeRef.css({width:"1"+unit, height:"1"+unit});
	var pxSize = {dpuH:Math.round(sizeRef.width()), dpuV:Math.round(sizeRef.height())};
	sizeRef.detach();

	if(dir == "horizontal")
		pxSize = pxSize.dpuH;
	else
	if(dir == "vertical")
		pxSize = pxSize.dpuV;
	return pxSize;
}

/*
//just returns metrics/info for an element.
function GetElementInfo(element, withMargin)
{
	withMargin = !!withMargin;
	el = $(element);
	var style = window.getComputedStyle(element);
	var positioned = (el.css("position") != "static");
	var elInfo = el.position() || {};
	elInfo.el = element;
	elInfo.left = element.offsetLeft - (withMargin ? parseFloat(style.marginLeft) : 0);
	elInfo.top = element.offsetTop - (withMargin ? parseFloat(style.marginTop) : 0);
	elInfo.width = el.outerWidth(withMargin);
	elInfo.height = el.outerHeight(withMargin);
	elInfo.right = elInfo.left + elInfo.width;
	elInfo.bottom = elInfo.top + elInfo.height;
	elInfo.viewPort = 
	{
		"left": element.scrollLeft + element.clientLeft + parseFloat(style.paddingLeft) + (positioned ? 0 : element.offsetLeft),
		"top": element.scrollTop + element.clientTop + parseFloat(style.paddingTop) + (positioned ? 0 : element.offsetLeft)
	}
	elInfo.viewPort.right = elInfo.viewPort.left + element.clientWidth - parseFloat(style.paddingRight);
	elInfo.viewPort.bottom = elInfo.viewPort.top + element.clientHeight - parseFloat(style.paddingBottom);
	return elInfo;
}

function GetVisibilty(element, withMargin)
{
	var elInfo = GetElementInfo(element, withMargin);
	var pInfo = GetElementInfo(element.parentNode);
	var ret = 
	{
		"lVis": (elInfo.left >= pInfo.viewPort.left && elInfo.left <= pInfo.viewPort.right),
		"rVis": (elInfo.right >= pInfo.viewPort.left && elInfo.right <= pInfo.viewPort.right),
		"tVis": (elInfo.top >= pInfo.viewPort.top && elInfo.top <= pInfo.viewPort.bottom ),
		"bVis": (elInfo.bottom >= pInfo.viewPort.top && elInfo.bottom <= pInfo.viewPort.bottom)
	}
	ret.total = (ret.lVis && ret.rVis && ret.tVis && ret.bVis);
	ret.partial = (ret.lVis || ret.rVis) && (ret.tVis || ret.bVis);
	return ret;
}
*/

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

function getScrollbarWidth() {
	if(this._scrollbarWidth)
		return this._scrollbarWidth;

    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";

    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);        

    var widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return this._scrollbarWidth = (widthNoScroll - widthWithScroll);
}

//is there currently a scrollbar visible
function HasScrollbar(el, horizontal)
{
    return horizontal ? el.scrollWidth > el.clientWidth : el.scrollHeight > el.clientHeight;
};

//was an event on a scrollbar
function ClickOnScrollbar(el, clientX, clientY)
{
	var rBounds = el.getBoundingClientRect();
	var vBar = HasScrollbar(el, false);
	var hBar = HasScrollbar(el, true);
	var size = getScrollbarWidth();
	return (vBar && (clientX > (rBounds.right - size))) || (hBar && (clientY > (rBounds.bottom - size)));
};

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
	Simple functions to convert between hex and rgba
****/
function hexToRgba(hex, opacity)
{
	//special handling for transparent
	if(hex === "transparent")
	{
		hex = "#ffffff";
		opacity = 0;
	}

	hex = hex || "#000000";
	opacity = (opacity === undefined) ? 1 : opacity;

	var ret = {"rgba":null, "r":null, "g":null, "b":null, "a":null};
	var c;
	if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex))
	{
		c= hex.substring(1).split('');
		if(c.length== 3)
			c= [c[0], c[0], c[1], c[1], c[2], c[2]];
		c= '0x'+c.join('');
		ret.r = (c>>16)&255;
		ret.g = (c>>8)&255;
		ret.b = c&255;
		ret.a = Number(opacity.toFixed(2));
		ret.rgb = sformat("rgba({1}, {2}, {3})", ret.r, ret.g, ret.b);
		ret.rgba = sformat("rgba({1}, {2}, {3}, {4})", ret.r, ret.g, ret.b, ret.a);
	}
	return ret;
};
function rgbToHex(r, g, b)
{
	function fmt(val)
	{
		var hex = null;
		if(val !== undefined)
		{
			hex = val.toString(16);
			hex = hex.length == 1 ? "0" + hex : hex;
		};
		return hex;
	}

	if(typeof(r) === "string")
	{
		var r = r.replace(/[rgb|rgba|(|)| ]/g, "");
		var parts = r.split(",");
		r = parseInt(parts[0], 10);
		g = parseInt(parts[1], 10);
		b = parseInt(parts[2], 10);
	}
	return ('#' + fmt(r) + fmt(g) + fmt(b));
};

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
	$(window).dispatchEvent(MediaQuery.EVENT_MEDIA_CHANGE, mql, false, false);
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
	if(_jsDerivingClass)return;

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
var _p = jsDeriveClass(WebApi, Object);

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
		ePreExec:"pre_exec",
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

		/*
			=====> PROMISE STUFF...IMPORTANT READ THIS <=====
			These functions DO NOT return the deferred, as you might expect.  They return
			this, if you want the deferred, then use .deferred on this.
			=====> PROMISE STUFF...IMPORTANT READ THIS <=====
		*/
		deferred:null,
		done:function(fn)
		{
			this.deferred.done(fn);
			return this;//support chaining.
		},
		fail:function(fn)
		{
			this.deferred.fail(fn);
			return this;//support chaining.
		},
		always:function(fn)
		{
			this.deferred.always(fn);
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

	//give people a chance to monkey with the exInfo right before we actually commit to the send.
	$(window).dispatchEvent(WebApi.genEventType(exInfo.ePreExec, exInfo), exInfo, false, false);
	$.ajax(exInfo.ajax);
	return exInfo;
};

_p._getExInfo = function()
{
	var exInfo = $.extend(true, {}, this.getExOptions());
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
	$(window).dispatchEvent(WebApi.genEventType(exInfo.ePreCall, exInfo), exInfo, false, false);
};
_p._onSuccess = function(exInfo, res, status, xhr)
{
	$(window).dispatchEvent("webapi_success", exInfo);
	/*default does nothing*/
};
_p._onError = function(exInfo, xhr, error, errorType)
{
	$(window).dispatchEvent("webapi_error", exInfo);
	/*default does nothing*/
};
_p._onComplete = function(exInfo, xhr, status)
{
	exInfo.tComplete = new Date();
	xhr.exInfo = exInfo;

	var res = xhr.responseXML || xhr.responseJSON || xhr.responseText;
	var error = this._errorCheck(xhr, res, exInfo);
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
	$(window).dispatchEvent("webapi_complete", exInfo);
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
	//empty in base
};

//# sourceURL=util.ibx.js
