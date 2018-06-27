/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

function ibxEventManager()
{
	if(ibx.eventMgr)
		return;

	window.addEventListener("touchstart", ibxEventManager._onTouchEvent.bind(this), true)
	window.addEventListener("touchend", ibxEventManager._onTouchEvent, true)
	window.addEventListener("touchmove", ibxEventManager._onTouchEvent, true)
	window.addEventListener("contextmenu", ibxEventManager._onContextMenu);
	window.addEventListener("keydown", ibxEventManager._onKeyDown);

	document.body.addEventListener("touchstart", ibxEventManager._onNoScrollTouchEvent);
}
ibxEventManager.noBrowserCtxMenu = true;
ibxEventManager.noBackspaceNavigate = true;
ibxEventManager.noSpaceScroll = true;
ibxEventManager.noIOSBodyScroll = false;
ibxEventManager.msDblClick = 300;
ibxEventManager.msCtxMenu = 500;
ibxEventManager.createMouseEvent = function(eType, e)
{
	var touch = (e instanceof TouchEvent) ? e.touches[0] : null;
	var eLast = ((e instanceof TouchEvent) && ibxEventManager._eLast) ? ibxEventManager._eLast.touches[0] : null;
	var eInit = $.extend({}, e, touch);
	eInit.movementX = eLast ? (eInit.screenX - eLast.screenX) : 0;
	eInit.movementY = eLast ? (eInit.screenY - eLast.screenY) : 0;

	var event = new MouseEvent(eType, eInit);
	event.movementX = eInit.movementX;//for IOS...they don't allow arbitrary properties in new MouseEvent.
	event.movementY = eInit.movementY;//for IOS...they don't allow arbitrary properties in new MouseEvent.
	event.originalEvent = e;
	return event;
};


ibxEventManager._onTouchEvent = function(e)
{
	var eType = e.type;
	if(eType == "touchstart")
	{
		ibxEventManager._hasSwiped = false;
		if(ibxPlatformCheck.isIOS)
		{
			var me = ibxEventManager.createMouseEvent("mousedown", e);
			e.target.dispatchEvent(me);
			ibxEventManager._eLast = e;

			ibxEventManager._ctxMenuTimer = window.setTimeout(function(e)
			{
				var me = ibxEventManager.createMouseEvent("contextmenu", e);
				e.target.dispatchEvent(me);
				ibxEventManager._eLast = e;
			}.bind(ibxEventManager, e), ibxEventManager.msCtxMenu);
		}
		else
			ibxEventManager._eLast = e;
	}
	else
	if(eType == "touchend")
	{
		window.clearTimeout(ibxEventManager._ctxMenuTimer);//cancel context menu

		if(ibxPlatformCheck.isIOS)
		{
			var me = ibxEventManager.createMouseEvent("mouseup", e);
			e.target.dispatchEvent(me);
			ibxEventManager._eLast = e;
		}

		var dblClick = false;
		if(ibxEventManager._eLast.type != "contextmenu")
		{
			var dt = ibxEventManager._eLastClick ? (e.timeStamp - ibxEventManager._eLastClick.timeStamp) : Infinity;
			dblClick = (dt < ibxEventManager.msDblClick);
			ibxEventManager._eLast = e;
			ibxEventManager._eLastClick = e;
		}

		if(dblClick)
		{
			var me = ibxEventManager.createMouseEvent("dblclick", e);
			e.target.dispatchEvent(me);
			e.preventDefault();//[IBX-40]stop double tap zoom on ios.
		}

		ibxEventManager._eLast = null;
		ibxEventManager._hasMoved = false;
	}
	else
	if(eType == "touchmove")
	{
		window.clearTimeout(ibxEventManager._ctxMenuTimer);//cancel context menu

		//figure out swiping
		var touch = e.touches[0];
		if(!ibxEventManager._hasSwiped)
		{
			var tElapsed = e.timeStamp - ibxEventManager._eLast.timeStamp;
			var dx = touch.clientX - ibxEventManager._eLast.touches[0].clientX;
			var dy = touch.clientY - ibxEventManager._eLast.touches[0].clientY;
			var sEvent = null;
			if(dx > 30)
				sEvent = "swiperight";
			else
			if(dx < -30)
				sEvent = "swipeleft";

			if(sEvent && tElapsed <= 300)
			{
				var se = ibxEventManager.createMouseEvent(sEvent, e);
				ibxEventManager._hasSwiped = true
				e.target.dispatchEvent(se);
			}

			sEvent = null;
			if(dy > 30)
				sEvent = "swipedown";
			else
			if(dy < -30)
				sEvent = "swipeup";
			
			if(sEvent && tElapsed <= 300)
			{
				var se = ibxEventManager.createMouseEvent(sEvent, e);
				ibxEventManager._hasSwiped = true
				e.target.dispatchEvent(se);
			}
		}

		var me = ibxEventManager.createMouseEvent("mousemove", e);
		e.target.dispatchEvent(me);
		ibxEventManager._eLast = e;
		ibxEventManager._hasMoved = true;//stop possible dblclick on touchend
	}
};

ibxEventManager._onContextMenu = function(e)
{
	if(ibxEventManager.noBrowserCtxMenu)
		e.preventDefault();
};

//[HOME-183] stop backspace from navigating
//see: https://stackoverflow.com/questions/1495219/how-can-i-prevent-the-backspace-key-from-navigating-back
ibxEventManager._onKeyDown = function(event)
{
	if((ibxEventManager.noBackspaceNavigate && (event.keyCode === $.ui.keyCode.BACKSPACE)) || (ibxEventManager.noSpaceScroll && (event.keyCode === $.ui.keyCode.SPACE)))
	{
		var doPrevent = true;
		var types = ["text", "password", "file", "search", "email", "number", "date", "color", "datetime", "datetime-local", "month", "range", "search", "tel", "time", "url", "week"];
		var d = $(event.srcElement || event.target);
		var disabled = d.prop("readonly") || d.prop("disabled");

		if(!disabled)
		{
			if(d[0].isContentEditable)
				doPrevent = false;
			else
			if(d.is("input"))
			{
				var type = d.attr("type");
				if(type)
					type = type.toLowerCase();
				if(types.indexOf(type) > -1)
					doPrevent = false;
			}
			else
			if(d.is("textarea"))
				doPrevent = false;
		}

		if(doPrevent)
		{
			event.preventDefault();
			return false;
		}
	}
};

//ios has an annoying habit of attempting to scroll the body element even when it has nothing to scroll.  This stops that!
ibxEventManager._onNoScrollTouchEvent = function(e)
{
	//THIS IS NOT WORKING CORRECTLY YET...DO NOT UNCOMMENT!!!!
	//if(ibxPlatformCheck.isIOS && ibxEventManager.noIOSBodyScroll && e.target === document.body)
	//	e.preventDefault();
};

//singleton event manager object.
ibx.eventMgr = new ibxEventManager();


/****
 	Drag/Drop Management
****/
function ibxDataTransfer()
{
	this.items = {};
	this.types = [];
	this.effectAllowed = "all";
	this.dropEffect = "not-allowed";
}
_p = ibxDataTransfer.prototype = new Object();
_p.dataLock = false;
_p.items = null;
_p.types = null;
_p.getData = function(type){return this.items[type]};
_p.setData = function(type, data)
{
	if(this.dataLock)
	{
		console.warn("[ibx Warning] ibxDataTransfer - set/clear data is not technically supported in drag/drop once drag has started.  You can set dataLock to false to enable if you must.");
		return;
	}

	this.items[type] = data;
	if(-1 == this.types.indexOf(type))
		this.types.push(type);
};
_p.clearData = function(type)
{
	if(this.dataLock)
	{
		console.warn("[ibx Warning] ibxDataTransfer - set/clear data is not technically supported in drag/drop once drag has started.  You can set dataLock to false to enable if you must.");
		return;
	}

	delete this.items[type];
	this.types.splice(this.types.indexOf(type), 1);
};
_p.dragXOffset = 8;
_p.dragYOffset = 8;
_p._dragImage = null;
_p.setDragImage = function(img, xOffset, yOffset)
{
	if(this._dragImage)
	{
		this._dragImage.style.position = "";
		this._dragImage.classList.remove(ibxDragDropManager.dragImageClass);
	}
	
	this._dragImage = img ? img : this._dragImage;
	if(this._dragImage)
	{
		this._dragImage.style.position = "absolute";
		this._dragImage.classList.add(ibxDragDropManager.dragImageClass);
	}
	this.dragXOffset = xOffset || this.dragXOffset;
	this.dragYOffset = yOffset || this.dragYOffset;
};

function ibxDragDropManager()
{
	if(ibx.dragDropMgr)
		return;

	document.documentElement.addEventListener("keydown", ibxDragDropManager._onKeyEvent.bind(ibxDragDropManager), true);
	document.documentElement.addEventListener("mousedown", ibxDragDropManager._onMouseEvent.bind(ibxDragDropManager), true);
	document.documentElement.addEventListener("mouseup", ibxDragDropManager._onMouseEvent.bind(ibxDragDropManager), true);
	document.documentElement.addEventListener("mousemove", ibxDragDropManager._onMouseEvent.bind(ibxDragDropManager), true);
	document.documentElement.addEventListener("dragover", ibxDragDropManager._onNativeDragEvent.bind(ibxDragDropManager), false);
	document.documentElement.addEventListener("drop", ibxDragDropManager._onNativeDragEvent.bind(ibxDragDropManager), false);
}
ibxDragDropManager.dragPrevented = false;
ibxDragDropManager.dragElement = null;
ibxDragDropManager.curTarget = $();
ibxDragDropManager.dragSourceClass = "ibx-drag-source",
ibxDragDropManager.dragTargetClass = "ibx-drop-target",
ibxDragDropManager.dragImageClass = "ibx-drag-image",
ibxDragDropManager.dragStartDistanceX = 5,
ibxDragDropManager.dragStartDistanceY = 5,

ibxDragDropManager.getDefaultDragImage = function(el)
{
	//clone the node and make sure the width/height are preserved so it lays out correctly.
	el = $(el);
	var width = el.width();
	var height = el.height();
	var clone = el.clone().css({"width":width + "px", "height":height + "px", "margin":"0px"});
	return clone[0];
};
ibxDragDropManager._dispatchDragEvent = function(e, type, target, bubbles, cancelable, data)
{
	var evt = cloneNativeEvent(e, type, data, bubbles, cancelable, null);
	evt.dataTransfer = this._dataTransfer || e.dataTransfer;
	if(target)
		target.dispatchEvent(evt);
	return evt;
};
ibxDragDropManager.endDrag = function(eType, e)
{
	if(eType && this.isDragging())//[IA-7558] Only spit out event if dragging.
		this._dispatchDragEvent(e, eType, this.dragElement, true);
			
	if(this._dataTransfer)
		$(this._dataTransfer._dragImage).remove();

	if(this.curTarget.length)
	{
		this.curTarget.removeClass(this.dragTargetClass);
		this.curTarget.css("cursor", this.curTarget.data("ibxDragTargetCursorOrig")); 
		this.curTarget.removeData("ibxDragTargetCursorOrig");
		this.curTarget = $();
	}

	//reset body cursor
	document.body.style.cursor = document.body.dataset.ibxOrigDragCursor;
	delete document.body.dataset.ibxOrigDragCursor;


	if(this.dragElement)
	{
		this.dragElement.classList.remove(this.dragSourceClass);
		this.dragElement = null;
		this.dragPrevented = false;
	}
	document.body.classList.remove("ibx-dragging");

	delete this._dataTransfer;
	delete this._mDownLoc;
};
ibxDragDropManager._onKeyEvent = function(e)
{
	if(this.isDragging() && e.keyCode == $.ui.keyCode.ESCAPE)
		this.endDrag("ibx_dragcancel", e);
};
ibxDragDropManager.isDragging = function()
{
	return (this.dragElement && this.dragElement.classList.contains(this.dragSourceClass));
}
ibxDragDropManager._onMouseEvent = function(e)
{
	var eType = e.type;
	if(eType == "mousedown" && !this.isDragging())
	{
		this.dragElement = $(e.target).closest(".ibx-draggable")[0];
		this._mDownLoc = {"x":e.clientX, "y":e.clientY};
	}
	else
	if(eType == "mouseup")
	{
		//if allowed let target know it was dropped on
		if(!this.dragPrevented && this.isDragging())
			this._dispatchDragEvent(e, "ibx_drop", this.curTarget[0], true, true);

		//end the drag operation
		this.endDrag("ibx_dragend", e);
	}
	else
	if(eType == "mousemove" && this.dragElement)
	{
		var dEvent = null;
		var dx = e.clientX - this._mDownLoc.x;
		var dy = e.clientY - this._mDownLoc.y;
		var isDragging = this.isDragging();
		if(!isDragging && (Math.abs(dx) >= this.dragStartDistanceX || Math.abs(dy) >= this.dragStartDistanceY))
		{
			var dt = this._dataTransfer = new ibxDataTransfer();
			dEvent = this._dispatchDragEvent(e, "ibx_dragstart", this.dragElement, true, true);
			if(!dEvent.isDefaultPrevented())
			{
				//start dragging...and also set default drag image if not already set...default the offest for drag image to where dragged on 
				if(!dt._dragImage)
				{
					var bRect = this.dragElement.getBoundingClientRect();
					var offsetX = bRect.left - this._mDownLoc.x;
					var offsetY = bRect.top - this._mDownLoc.y;
					dt.setDragImage(this.getDefaultDragImage(this.dragElement), offsetX, offsetY);
				}
			}
			isDragging = true;
			dt.dataLock = true;
			this.dragElement.classList.add(this.dragSourceClass);
			document.body.classList.add("ibx-dragging");
			document.body.dataset.ibxOrigDragCursor = document.body.style.cursor;
		}

		if(isDragging)
		{
			//find the element under the mouse.
			var elTarget = document.elementFromPoint(e.clientX, e.clientY);

			//new drop target so reset the effect.
			this._dataTransfer.dropEffect = "not-allowed";

			//manage the current target
			if(!this.curTarget.is(elTarget))
			{
				console.dir(this.curTarget);
				//spit out events for source/target
				dEvent = this._dispatchDragEvent(e, "ibx_dragleave", this.curTarget[0], true);
				dEvent = this._dispatchDragEvent(e, "ibx_dragenter", elTarget, true, true);

				//reset last drag target
				if(this.curTarget.length)
				{
					this.curTarget.removeClass(this.dragTargetClass);
					this.curTarget.css("cursor", this.curTarget.data("ibxDragTargetCursorOrig"));
					this.curTarget.removeData("ibxDragTargetCursorOrig");
				}

				//save new drag target
				this.curTarget = $(elTarget);
				if(this.curTarget.length)
				{
					//[IA-8982] when dragging over an svg node in IE (of course) there is no style property...so just ignore in that case.
					var cursor = this.curTarget[0].style ? this.curTarget[0].style.cursor : ""
					this.curTarget.data("ibxDragTargetCursorOrig", cursor);
					this.curTarget.addClass(this.dragTargetClass);
				}
			}

			if(this.curTarget.length)
			{
				//send drag messages if 'ibx_dragover' was not prevented
				dEvent = this._dispatchDragEvent(e, "ibx_drag", this.dragElement, true, true);
				dEvent = this._dispatchDragEvent(e, "ibx_dragover", this.curTarget[0], true, true);
				this.dragPrevented = !dEvent.isDefaultPrevented();

				//figure out the cursor
				var cursor = "not-allowed";
				if(!this.dragPrevented)
				{
					if(this._dataTransfer.effectAllowed == "all")
						cursor = this._dataTransfer.dropEffect;
					else
					if(this._dataTransfer.effectAllowed == this._dataTransfer.dropEffect)
						cursor = this._dataTransfer.dropEffect;
				}
				this.curTarget.css("cursor", cursor);
				this.curTarget[0].offsetHeight;
				document.body.style.cursor = cursor;
			}

			//manage the drag image
			if(this._dataTransfer._dragImage)
			{
				var dragImage = this._dataTransfer._dragImage;
				var xOffset = (this._dataTransfer.dragXOffset == "center") ? -(dragImage.width()/2) : this._dataTransfer.dragXOffset;
				var yOffset = (this._dataTransfer.dragYOffset == "center") ? -(dragImage.height()/2) : this._dataTransfer.dragYOffset;
				$(this._dataTransfer._dragImage).css(
				{
					"left":e.clientX + xOffset + "px",
					"top":e.clientY + yOffset + "px",
				}).appendTo("body.ibx-root");
			}
		}
	}
};
ibxDragDropManager._onNativeDragEvent = function(e)
{
	var dropTarget = $(e.target).closest(".ibx-external-drop-target")[0];
	if(!dropTarget)
		return;

	var eType = e.type;
	if(eType == "dragover")
		e.preventDefault();
	else
	if(eType == "drop")
	{
		var dt = e.dataTransfer;
		if(dt.files.length)
		{
			var formData = new FormData();
			$.each(dt.files, function(idx, file)
			{
				formData.append(file.name, file);
			});
			var ajaxOptions = 
			{
				"method":"POST",
				"contentType":false,
				"processData":false,
				"data":formData,
				"url":"",
				"dataTransfer":dt
			};

			if(this._dispatchDragEvent(e, "ibx_beforefilesupload", e.target, ajaxOptions).isDefaultPrevented())
				return;

			var deferred = $.ajax(ajaxOptions);
			this._dispatchDragEvent(e, "ibx_filesuploading", e.target, deferred);
		}
		e.preventDefault();
	}
};

//singleton drag/drop manager object.
ibx.dragDropMgr = new ibxDragDropManager();


$.widget("ibi.ibxSelectionManager", $.Widget, 
{
	options:
	{
		"seltype":"nav",					//nav - navigation only, single - single selection, multi - multiple selection
		"toggleSelection":true,				//clicking on an item will select/deselect.
		"escClearSelection":true,			//clear the selection on the escape key
		"focusRoot":false,					//keep focus circular within this element
		"focusDefault":false,				//focus the first item in root. (can be a select pattern).
		"focusResetOnBlur":true,			//when widget loses focus, reset the current active navKey child.
		"navKeyRoot":false,					//arrow keys will move you circularly through the items.
		"navKeyDir":"both",					//horizontal = left/right, vertical = up/down, or both
	},
	_widgetClass:"ibx-selection-manager",
	_create:function()
	{
		this._super();
		this.option(this.options);//force initial update.
		this.element.data("ibiIbxSelectionManager", this);//plymorphism
		this.element[0].addEventListener("focusin", this._onFocusIn.bind(this), true);
		this.element[0].addEventListener("focusout", this._onFocusOut.bind(this), true);
		this.element[0].addEventListener("mousedown", this._onMouseDown.bind(this), false);
		this.element[0].addEventListener("keydown", this._onKeyDown.bind(this), false);
	},
	_destroy:function()
	{
		this._super();
	},
	_onFocusIn:function(e)
	{
		var options = this.options;
		var isTarget = this.element.is(e.target);
		var ownsTarget = $.contains(this.element[0], e.target);
		var ownsRelTarget = $.contains(this.element[0], e.relatedTarget);

		//make sure the manager is in the focused state.
		this._activate(true);

		//do the default focusing when manager is directly focused (not one of its children).
		if(isTarget && !ownsRelTarget && options.focusDefault !== false)
		{
			var defItem = this._focus();
			if(!defItem.length)
			{
				var defItem = this.element.find(options.focusDefault);
				defItem = defItem.length ? defItem : this.selectableChildren().first();
			}
			defItem.focus();
			return;
		}

		//focus the selected item
		if(!isTarget && ownsTarget)
			this._focus(e.target, true);
	},
	_onFocusOut:function(e)
	{
		//make sure the manager is in the blurred stated when some external element is focused.
		var isTarget = this.element.is(e.target);
		var ownsRelTarget = $.contains(this.element[0], e.relatedTarget);
		
		if(!isTarget && !ownsRelTarget)
			this._activate(false);
	},
	_onKeyDown:function(e)
	{
		var options = this.options;
		if(!options.focusRoot && !options.navKeyRoot)
			return;

		//manage circular tabbing if desired.
		if(options.focusRoot && e.keyCode == $.ui.keyCode.TAB)
		{
			var focusKids = this.element.logicalChildren(".ibx-sm-focus-root", ":ibxFocusable");
			var target = null;
			var firstKid = focusKids.first();
			var lastKid = focusKids.last();

			if(firstKid.length && lastKid.length)
			{
				var mappedTarget = this.mapToSelectable(e.target);
				if((firstKid.is(mappedTarget) || $.contains(firstKid[0], mappedTarget)) && e.shiftKey)
					target = focusKids.last();
				else
				if((lastKid.is(mappedTarget) || $.contains(lastKid[0], mappedTarget)) && !e.shiftKey)
					target = focusKids.first();
			}

			//target means first/last item and need to loop...or no kids, so do nothing.
			if(target || !focusKids.length)
			{
				target = $(target);
				target.focus();
				e.preventDefault();
				e.stopPropagation();
			}
		}

		//manage arrow navigation if desired.
		if(options.navKeyRoot && [$.ui.keyCode.LEFT, $.ui.keyCode.RIGHT, $.ui.keyCode.UP, $.ui.keyCode.DOWN].indexOf(e.keyCode) != -1)
		{
			var navKids = this.selectableChildren();
			var focusedItem = this._focus()[0];
			var idxFocused = navKids.index(focusedItem);
			var goPrev = (e.keyCode == $.ui.keyCode.LEFT || e.keyCode == $.ui.keyCode.UP);
			var goNext = (e.keyCode == $.ui.keyCode.RIGHT || e.keyCode == $.ui.keyCode.DOWN);
			var vert = (options.navKeyDir == "horizontal" || options.navKeyDir == "both") && (e.keyCode == $.ui.keyCode.LEFT || e.keyCode == $.ui.keyCode.RIGHT);
			var horz = (options.navKeyDir == "vertical" || options.navKeyDir == "both") && (e.keyCode == $.ui.keyCode.UP || e.keyCode == $.ui.keyCode.DOWN);
			var focusItem = $();

			if(this.element.is(document.activeElement))
				focusItem = (focusedItem) ? focusedItem : navKids.first();
			else
			if(goPrev && (vert || horz))
				focusItem = (idxFocused > 0) ? navKids[idxFocused - 1] : navKids.last();
			else
			if(goNext && vert || horz)
				focusItem = (idxFocused < navKids.length-1) ? navKids[idxFocused + 1] : navKids.first();
			
			//don't focus for just shift/ctrl keys
			if(e.keyCode != 17 && e.keyCode != 16)
			{
				focusItem.focus();
				e.preventDefault();
			}
		}

		//manage selection, and focus jumping
		if(e.keyCode == $.ui.keyCode.ENTER || e.keyCode == $.ui.keyCode.SPACE)
		{
			if((options.type == "multi") && !e.shiftKey && !e.ctrlKey)
				this.deselectAll();

			if(e.shiftKey)
			{
				var selChildren = this.selectableChildren();
				var idxAnchor = selChildren.index(this._anchor());
				var idxSel = selChildren.index(this._focus()[0]);
				var idxStart = Math.min(idxAnchor, idxSel);
				var idxEnd = Math.max(idxAnchor, idxSel);
				this.toggleSelected(selChildren.slice(idxStart, idxEnd + 1), this.isSelected(this._anchor()), false);
			}
			else
				this.toggleSelected(this._focus());
		}
		else
		if(e.keyCode == $.ui.keyCode.HOME)
			this.selectableChildren().first().focus();
		else
		if(e.keyCode == $.ui.keyCode.END)
			this.selectableChildren().last().focus();
		else
		if(e.keyCode == $.ui.keyCode.ESCAPE && options.escClearSelection)
			this.deselectAll();
	},
	_onMouseDown:function(e)
	{
		var options = this.options;
		var isTarget = this.element.is(e.target);
		var isMulti = options.type == "multi";

		//mousedown happens before focus, so make us active before anything.
		this._activate(true);

		//don't deselect if clicking on scrollbar.
		if(!this.element.clickOnScrollbar(e.clientX, e.clientY))
		{
			if(isTarget || (isMulti && !e.shiftKey && !e.ctrlKey))
				this.deselectAll();
		}

		//event could happen on child element...map back to something we know can be selected
		var selTarget = this.mapToSelectable(e.target);
		if(e.shiftKey && options.type == "multi")
		{
			var selChildren = this.selectableChildren();
			var idxAnchor = selChildren.index(this._anchor());
			var idxSel = selChildren.index(selTarget[0]);
			var idxStart = Math.min(idxAnchor, idxSel);
			var idxEnd = Math.max(idxAnchor, idxSel);
			this.toggleSelected(selChildren.slice(idxStart, idxEnd + 1), this.isSelected(this._anchor()), false);
		}
		else
			this.toggleSelected(selTarget, (isMulti && e.ctrlKey) || options.toggleSelection ? undefined : true);
	},
	preDispacthEvent:function(eventInfo){return eventInfo;},
	_dispatchEvent:function(eType, data, canBubble, cancelable, relatedTarget, mapItems)
	{
		mapItems = (mapItems === undefined) ? true : mapItems;
		data.items = mapItems ? this.mapFromSelectable(data.items) : data.items;
		var parms = this.preDispacthEvent({"eType":eType, "data":data, "canBubble":canBubble, "cancelable":cancelable, "relatedTarget":relatedTarget});
		var evt = this.element.dispatchEvent(parms.eType, parms.data, parms.canBubble, parms.cancelable, parms.relatedTarget);
		evt.data.items = mapItems ? this.mapToSelectable(data.items) : data.items;
		return evt;
	},
	mapToSelectable:function(el)
	{
		return $(el).closest(".ibx-sm-selectable");
	},
	mapFromSelectable:function(el)
	{
		return $(el);
	},
	selectableChildren:function(selector)
	{
		var options = this.options;
		var e = this._dispatchEvent("ibx_selectablechildren", {"items":null}, false, true, undefined, false);
		var children = e.data.items ? $(e.data.items) : this.element.logicalChildren(".ibx-sm-nav-key-root, .ibx-sm-focus-default", ":ibxFocusable(-1)");			
		children.addClass("ibx-sm-selectable");
		return selector ? children.filter(selector) : children;
	},
	isSelected:function(el){return $(el).hasClass("ibx-sm-selected")},
	selected:function(el, select, anchor)
	{
		//public interface needs to map nodes...think tree from ibxTreeNode to it's selectable label.
		el = el ? this.mapToSelectable(el) : el;
		el = this._selected(el, select, anchor);
		return el ? this.mapFromSelectable(el) : undefined;
	},
	_selected:function(el, select, anchor)
	{
		if(el === undefined)
		{
			select = (select !== false) ? ".ibx-sm-selected" : ":not(.ibx-sm-selected)";
			return this.selectableChildren(select);
		}

		//only children that are direct descendants of this root can be manipulated.
		el = this.element.logicalChildren(".ibx-sm-selection-root", el);

		//by default set the anchor item
		anchor = (anchor === undefined) ? true : false;

		if(select)
		{
			//handle selection types...
			var options = this.options;
			if(options.type == "single")//single selection
			{
				this.deselectAll();
				el = $(el).first(":not(.ibx-sm-selected)");
			}
			else//multi
			if(options.type == "multi")//multiple selection
				el = $(el).filter(":not(.ibx-sm-selected)");
			else
				el = $();//default just nav, no selection.

			if(el.length)
			{
				var evt = this._dispatchEvent("ibx_beforeselchange", {"selected":select, "items":el}, false, true);
				if(!evt.isDefaultPrevented())
				{
					el = evt.data.items;
					el.addClass("ibx-sm-selected");
					if(anchor)
						this._anchor(el.last());
					this._dispatchEvent("ibx_selchange", {"selected":select, "items":el}, false, false);
				}
			}
		}
		else
		{
			el = $(el).filter(".ibx-sm-selected");
			if(el.length)
			{
				var evt = this._dispatchEvent("ibx_beforeselchange", {"selected":select, "items":el}, false, true);
				if(!evt.isDefaultPrevented())
				{
					el.removeClass("ibx-sm-selected");
					if(anchor)
						this._anchor(el.last());
					this._dispatchEvent("ibx_selchange", {"selected":select, "items":el}, false, false);
				}
			}
		}
	},
	toggleSelected:function(el, selected, anchor)
	{
		selected = (selected === undefined) ? !this.isSelected(el) : selected;
		this.selected(el, selected, anchor);
	},
	selectAll:function(selector)
	{
		this.selected(this.selectableChildren(":not(.ibx-sm-selected)"), true);
	},
	deselectAll:function()
	{
		this.selected(this.selectableChildren(".ibx-sm-selected"), false);
	},
	_elAnchor:$(),
	anchor:function(el)
	{
		//public interface needs to map nodes...think tree from ibxTreeNode to it's selectable label.
		el = el ? this.mapToSelectable(el) : el;
		el = this._anchor(el);
		return el ? this.mapFromSelectable(el) : undefined;
	},
	_anchor:function(el)
	{
		if(el === undefined)
			return this._elAnchor;

		this._elAnchor.removeClass("ibx-sm-anchor");
		this._elAnchor = $(el).first().addClass("ibx-sm-anchor");
		var evt = this._dispatchEvent("ibx_anchored", {"items":this._elAnchor}, true, false);
	},
	_elFocus:$(),
	focus:function(el, focus)
	{
		//public interface needs to map nodes...think tree from ibxTreeNode to it's selectable label.
		el = el ? this.mapToSelectable(el) : el;
		el = this._focus(el, focus);
		return el ? this.mapFromSelectable(el) : undefined;
	},
	_focus:function(el, focus)
	{
		if(el === undefined)
			return this._elFocus;

		this._elFocus.removeClass("ibx-sm-focused ibx-ie-pseudo-focus");
		this._elFocus = $(el).first().addClass("ibx-sm-focused " + (ibxPlatformCheck.isIE ? "ibx-ie-pseudo-focus" : ""));
		this._elFocus ? this.element.attr("aria-active-descendant", this._elFocus.prop("id")) : this.element.removeAttr("aria-active-descendant");
		var evt = this._dispatchEvent("ibx_focused", {"items":this._elFocus}, true, false);
	},
	_active:false,
	active:function()
	{
		return this._active;
	},
	_activate:function(active)
	{
		if(active === undefined)
			return this._active;

		if(this._active != active)
		{
			var options = this.options;
			if(active)
			{
				this.element.addClass("ibx-sm-active");
				this.selectableChildren();

				//take the element out of the tab order so shift+tab will work and not focus this container.
				//if(options.focusDefault)
				//	this.element.data("ibxFocDefSavedTabIndex", this.element.prop("tabindex")).prop("tabindex", -1);
			}
			else
			{
				if(this.options.focusResetOnBlur)
					this._focus(null, false);
				this.element.removeClass("ibx-sm-active");

				//put this element back in the tab order...so that next tab into will will do auto-focus.
				//this.element.prop("tabIndex", this.element.data("ibxFocDefSavedTabIndex")).removeData("ibxFocDefSavedTabIndex");
			}
			this._active = active;
		}
	},
	option:function(key, value)
	{
		this._super(key, value);
	},
	_setOption:function(key, value)
	{
		if(key == "type" && value != this.options[key])
			this.deselectAll();
		if(key == "type")
			this.element.toggleClass("ibx-sm-selection-root", (value != "nav"));
		else
		if(key == "focusRoot")
			this.element.toggleClass("ibx-sm-focus-root", value);
		else
		if(key == "navKeyRoot")
			this.element.toggleClass("ibx-sm-nav-key-root", value);
		else
		if(key == "focusDefault")
			this.element.toggleClass("ibx-sm-focus-default", !!value);
		
		this._super(key, value);
	},
});
$.widget("ibi.ibxSelMgrNavigator", $.ibi.ibxSelectionManager, {options:{"type":"none"}});
$.widget("ibi.ibxSelMgrSingle", $.ibi.ibxSelectionManager, {options:{"type":"single"}});
$.widget("ibi.ibxSelMgrMulti", $.ibi.ibxSelectionManager, {options:{"type":"multi"}});
//# sourceURL=events.ibx.js
