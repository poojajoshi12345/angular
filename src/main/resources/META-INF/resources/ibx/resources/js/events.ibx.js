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
	document.documentElement.addEventListener("dragover", ibxDragDropManager._onNativeDragEvent.bind(ibxDragDropManager), true);
	document.documentElement.addEventListener("drop", ibxDragDropManager._onNativeDragEvent.bind(ibxDragDropManager), true);
}
ibxDragDropManager.dragPrevented = false;
ibxDragDropManager.dragElement = null;
ibxDragDropManager.curTarget = null;
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

	if(this.curTarget)
	{
		this.curTarget.classList.remove(this.dragTargetClass);
		this.curTarget.style.cursor = this.curTarget.dataset.ibxDragTargetCursorOrig;
		delete this.curTarget.dataset.ibxDragTargetCursorOrig;
		this.curTarget = null;
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
			this._dispatchDragEvent(e, "ibx_drop", this.curTarget, true, true);

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
			if(this.curTarget !== elTarget)
			{
				//spit out events for source/target
				dEvent = this._dispatchDragEvent(e, "ibx_dragleave", this.curTarget, true);
				dEvent = this._dispatchDragEvent(e, "ibx_dragenter", elTarget, true, true);

				//reset last drag target
				if(this.curTarget)
				{
					this.curTarget.classList.remove(this.dragTargetClass);
					this.curTarget.style.cursor = this.curTarget.dataset.ibxDragTargetCursorOrig;
					delete this.curTarget.dataset.ibxDragTargetCursorOrig;
				}

				//save new drag target
				this.curTarget = elTarget;
				if(this.curTarget)
				{
					this.curTarget.dataset.ibxDragTargetCursorOrig = this.curTarget.style.cursor;
					this.curTarget.classList.add(this.dragTargetClass);
				}
			}

			if(this.curTarget)
			{
				//send drag messages if 'ibx_dragover' was not prevented
				dEvent = this._dispatchDragEvent(e, "ibx_drag", this.dragElement, true, true);
				dEvent = this._dispatchDragEvent(e, "ibx_dragover", this.curTarget, true, true);
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
				this.curTarget.style.cursor = cursor;
				this.curTarget.offsetHeight;
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
		"type":-1,							//-1 - navigation only, 0 - single selection, 1 - multiple selection
		"escClearSelection":true,			//clear the selection on the escape key
		"focusRoot":false,					//keep focus circular within this element
		"focusDefault":false,				//focus the first item in root. (can be a select pattern).
		"focusResetOnBlur":true,			//when widget loses focus, reset the current active navKey child.
		"navKeyRoot":false,					//arrow keys will move you circularly through the items.
		"navKeyDir":"both",					//horizontal = left/right, vertical = up/down, or both
		"navKeys":[$.ui.keyCode.LEFT, $.ui.keyCode.RIGHT, $.ui.keyCode.UP, $.ui.keyCode.DOWN, $.ui.keyCode.ESCAPE, $.ui.keyCode.ENTER, $.ui.keyCode.SPACE, $.ui.keyCode.HOME, $.ui.keyCode.END],
	},
	_widgetClass:"ibx-selection-manager",
	_create:function()
	{
		this._super();
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
	preDispacthEvent:function(eventInfo){return eventInfo;},
	_dispatchEvent:function(eType, data, canBubble, cancelable, relatedTarget)
	{
		var parms = this.preDispacthEvent({"eType":eType, "data":data, "canBubble":canBubble, "cancelable":cancelable, "relatedTarget":relatedTarget});
		return this.element.dispatchEvent(parms.eType, parms.data, parms.canBubble, parms.cancelable, parms.relatedTarget);
	},
	_onFocusIn:function(e)
	{
		var options = this.options;
		var isTarget = this.element.is(e.target);
		var ownsTarget = $.contains(this.element[0], e.target);

		//make sure the manager is in the focused state.
		this.focusMgr(true);

		//do the default focusing when manager is directly focused (not one of its children).
		if(isTarget && (options.focusDefault !== false))
		{
			//focus default item...otherwise find first focusable item (ARIA needs SOMETHING to be focused on the popup)
			var defItem = this.focused();
			if(!defItem)
			{
				var defItem = this.element.find(options.focusDefault);
				defItem = defItem.length ? defItem : this.selectableChildren().first();
			}
			defItem.focus();
		}

		//focus the selected item
		if(!isTarget && ownsTarget)
			this.focused(e.target, true);
	},
	_onFocusOut:function(e)
	{
		//make sure the manager is in the blurred stated when some external element is focused.
		var isTarget = this.element.is(e.target);
		var ownsRelTarget = $.contains(this.element[0], e.relatedTarget);
		if(!isTarget && !ownsRelTarget)
			this.focusMgr(false);
	},
	_onMouseDown:function(e)
	{
		this.focusMgr(true);

		var options = this.options;
		var isTarget = this.element.is(e.target);
		if(isTarget || (!e.shiftKey && !e.ctrlKey))
			this.deselectAll();

		var selTarget = this.mapToSelectable(e.target);

		if(e.shiftKey && options.type == 1)
		{
			var selChildren = this.selectableChildren();
			var idxAnchor = selChildren.index(this._anchor[0]);
			var idxSel = selChildren.index(selTarget[0]);
			var idxStart = Math.min(idxAnchor, idxSel);
			var idxEnd = Math.max(idxAnchor, idxSel);
			this.toggleSelected(selChildren.slice(idxStart, idxEnd + 1), this.isSelected(this._anchor), false);
		}
		else
			this.toggleSelected(selTarget);
	},
	_onKeyDown:function(e)
	{
		var options = this.options;
		if(!options.focusRoot && !options.navKeyRoot)
			return;
		var selChildren = this.selectableChildren();

		//manage circulat tabbing if desired.
		if(options.focusRoot && e.keyCode == $.ui.keyCode.TAB)
		{
			var selChildren = this.selectableChildren();
			var target = null;
			var firstKid = selChildren.first();
			var lastKid = selChildren.last();
			if(firstKid.length && lastKid.length)
			{
				if((firstKid.is(e.target) || $.contains(firstKid[0], e.target)) && e.shiftKey)
					target = selChildren.last();
				else
				if((lastKid.is(e.target) || $.contains(lastKid[0], e.target)) && !e.shiftKey)
					target = selChildren.first();
			}

			//target means first/last item and need to loop...or no kids, so do nothing.
			if(target || !selChildren.length)
			{
				target = $(target);
				target.focus();
				e.preventDefault();
				e.stopPropagation();
			}
		}

		//manage arrow navigation if desired.
		if(options.navKeyRoot)
		{
			var focusedItem = this.focused();
			var idxFocused = selChildren.index(focusedItem);
			var goPrev = (e.keyCode == $.ui.keyCode.LEFT || e.keyCode == $.ui.keyCode.UP);
			var goNext = (e.keyCode == $.ui.keyCode.RIGHT || e.keyCode == $.ui.keyCode.DOWN);
			var vert = (options.navKeyDir == "horizontal" || options.navKeyDir == "both") && (e.keyCode == $.ui.keyCode.LEFT || e.keyCode == $.ui.keyCode.RIGHT);
			var horz = (options.navKeyDir == "vertical" || options.navKeyDir == "both") && (e.keyCode == $.ui.keyCode.UP || e.keyCode == $.ui.keyCode.DOWN);

			if(goPrev && (vert || horz))
			{
				var focusItem = (idxFocused > 0) ? selChildren[idxFocused - 1] : selChildren.last();
				focusItem.focus();
			}
			else
			if(goNext && vert || horz)
			{
				var focusItem = (idxFocused < selChildren.length-1) ? selChildren[idxFocused + 1] : selChildren.first()[0];
				focusItem.focus();
			}
		}

		//manage selection, and focus jumping
		if(e.keyCode == $.ui.keyCode.ENTER || e.keyCode == $.ui.keyCode.SPACE)
		{
			if(!e.shiftKey && !e.ctrlKey)
				this.deselectAll();

			if(e.shiftKey)
			{
				var idxAnchor = selChildren.index(this._anchor[0]);
				var idxSel = selChildren.index(this.focused());
				var idxStart = Math.min(idxAnchor, idxSel);
				var idxEnd = Math.max(idxAnchor, idxSel);
				this.toggleSelected(selChildren.slice(idxStart, idxEnd + 1), this.isSelected(this._anchor), false);
			}
			else
				this.toggleSelected(this.focused());
		}
		else
		if(e.keyCode == $.ui.keyCode.HOME)
			selChildren.first().focus();
		else
		if(e.keyCode == $.ui.keyCode.END)
			selChildren.last().focus();
		else
		if(e.keyCode == $.ui.keyCode.ESCAPE && options.escClearSelection)
			this.deselectAll();
	},
	mapToSelectable:function(el)
	{
		return $(el).closest(".ibx-selectable", this.element[0]);
	},
	selectableChildren:function(selector)
	{
		var options = this.options;
		var e = this._dispatchEvent("ibx_selectablechildren", null, false, true);
		var pattern = sformat(":ibxFocusable({1}, {2})", options.navKeyRoot ? -1 : 0, options.focusRoot ? Infinity : -1);
		var children = e.isDefaultPrevented() ? $(e.data) : this.element.children(pattern);
		children = selector ? children.filter(selector) : children;
		children.addClass("ibx-selectable");
		return children;
	},
	isSelected:function(el){return $(el).hasClass("ibx-sm-selected")},
	selected:function(el, select, anchor)
	{
		if(el === undefined)
			return this.selectableChildren(".ibx-sm-selected");

		//by default set the anchor item
		anchor = (anchor === undefined) ? true : false;
		if(select)
		{
			//handle selection types...
			var options = this.options;
			if(options.type == -1)//none
				el = $();
			else
			if(options.type == 0)//single
			{
				this.deselectAll();
				el = $(el).first(":not(.ibx-sm-selected)");
			}
			else//multi
				el = $(el).filter(":not(.ibx-sm-selected)");

			var evt = this._dispatchEvent("ibx_selecting", el, false, true);
			if(!evt.isDefaultPrevented())
			{
				el = $(evt.data);
				el.addClass("ibx-sm-selected");
				if(anchor)
					this.anchor(el.last());
			}
		}
		else
		{
			el = $(el).filter(".ibx-sm-selected");
			var evt = this._dispatchEvent("ibx_deselecting", el, false, true);
			if(!evt.isDefaultPrevented())
			{
				el = evt.data;
				el.removeClass("ibx-sm-selected");
				if(anchor)
					this.anchor(el.last());
			}
		}
		this._dispatchEvent("ibx_selchange", {"selected": select, "items":el}, false, false);
	},
	toggleSelected:function(el, selected, anchor)
	{
		selected = (selected === undefined) ? !this.isSelected(el) : selected;
		this.selected(el, selected, anchor);
	},
	selectAll:function(selector)
	{
		this.selected(this.selectableChildren(), true);
	},
	deselectAll:function()
	{
		this.selected(this.selected(), false);
	},
	_anchor:null,
	anchor:function(el)
	{
		if(el === undefined)
			return this.selectableChildren(".ibx-sm-anchor");

		if(this._anchor)
			this._anchor.removeClass("ibx-sm-anchor");
		this._anchor = $(el).first();
		this._anchor.addClass("ibx-sm-anchor");
	},
	focused:function(el, focus)
	{
		if(el === undefined)
			return this.selectableChildren(".ibx-sm-focused")[0];

		el = this.mapToSelectable(el);

		this.selectableChildren(".ibx-sm-focused").removeClass("ibx-sm-focused ibx-ie-pseudo-focus");
		if(el.length && focus)
		{
			el.addClass("ibx-sm-focused " + (ibxPlatformCheck.isIE ? "ibx-ie-pseudo-focus" : ""));
			this.element.attr("aria-active-descendant", el.prop("id"));
		}
		else
			this.element.attr("aria-active-descendant", el.prop("id"));

		var evt = this._dispatchEvent("ibx_focused", {"focused":focus, "item":el}, true, false);
	},
	focusMgr:function(focus)
	{
		if(this._focus != focus)
		{
			var options = this.options;
			var selChildren = this.selectableChildren();
			if(focus)
			{
				this.element.addClass("ibx-selmgr-focused");

				//take the element out of the tab order so shift+tab will work and not focus this container.
				if(options.focusDefault)
					this.element.data("ibxFocDefSavedTabIndex", this.element.prop("tabindex")).prop("tabindex", -1);
			}
			else
			{
				if(this.options.focusResetOnBlur)
					this.focused(null, false);
				this.element.removeClass("ibx-selmgr-focused");

				//put this element back in the tab order...so that next tab into will will do auto-focus.
				this.element.prop("tabIndex", this.element.data("ibxFocDefSavedTabIndex")).removeData("ibxFocDefSavedTabIndex");
			}
			this._focus = focus
		}
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		this.element.toggleClass("ibx-focus-root", options.focusRoot);
		this.element.toggleClass("ibx-nav-key-root", options.navKeyRoot);
	}
});
$.widget("ibi.ibxSelMgrNavigator", $.ibi.ibxSelectionManager, {options:{"type":-1}});
$.widget("ibi.ibxSelMgrSingle", $.ibi.ibxSelectionManager, {options:{"type":0}});
$.widget("ibi.ibxSelMgrMulti", $.ibi.ibxSelectionManager, {options:{"type":1}});
//# sourceURL=events.ibx.js
