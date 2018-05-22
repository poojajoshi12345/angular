/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

function ibxEventManager()
{
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
window["ibxEventMgr"] = new ibxEventManager();


/****
 	Drag/Drop Management
****/
function ibxDataTransfer()
{
	this.items = {};
	this.effectAllowed = "all";
	this.dropEffect = "not-allowed";
}
_p = ibxDataTransfer.prototype = new Object();
_p.items = null;
_p.getData = function(type){return this.items[type]};
_p.setData = function(type, data){this.items[type] = data;};
_p.clearData = function(type){delete this.items[type];};
_p._dragImage = null;
_p.dragXOffset = 8;
_p.dragYOffset = 8;
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
	var evt = createNativeEvent(type, data, bubbles, cancelable, null);
	for(var key in e)
	{
		var prop = e[key];
		if((prop instanceof Function))
			continue;
		evt[key] = prop;
	}
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

	if(this.dragElement)
	{
		this.dragElement.classList.remove(this.dragSourceClass);
		this.dragElement = null;
		this.dragPrevented = false;
	}

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
			this._dataTransfer = new ibxDataTransfer();
			dEvent = this._dispatchDragEvent(e, "ibx_dragstart", this.dragElement, true, true);
			if(!dEvent.isDefaultPrevented())
			{
				//start dragging...and also set default drag image if not already set...default the offest for drag image to where dragged on 
				if(!this._dataTransfer._dragImage)
				{
					var bRect = this.dragElement.getBoundingClientRect();
					var offsetX = bRect.left - this._mDownLoc.x;
					var offsetY = bRect.top - this._mDownLoc.y;
					this._dataTransfer.setDragImage(this.getDefaultDragImage(this.dragElement), offsetX, offsetY);
				}
			}
			isDragging = true;
			this.dragElement.classList.add(this.dragSourceClass);
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
			}

			//manage the drag cursor
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
window["ibxDragDropMgr"] = new ibxDragDropManager();

//# sourceURL=events.ibx.js
