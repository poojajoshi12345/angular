/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.10 $:

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
_p.getData = function(type){return this.items[type];};
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
		if(this._dragImage.parentNode)
			this._dragImage.parentNode.removeChild(this._dragImage);
	}
	
	this._dragImage = img ? img : this._dragImage;
	if(this._dragImage)
	{
		this._dragImage.style.position = "absolute";
		this._dragImage.classList.add(ibxDragDropManager.dragImageClass);
		document.body.appendChild(this._dragImage);
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
ibxDragDropManager.dragSourceClass = "ibx-drag-source";
ibxDragDropManager.dragTargetClass = "ibx-drop-target";
ibxDragDropManager.dragImageClass = "ibx-drag-image";
ibxDragDropManager.dragStartDistanceX = 5;
ibxDragDropManager.dragStartDistanceY = 5;

ibxDragDropManager.getDefaultDragImage = function(el)
{
	//clone the node and make sure the width/height are preserved so it lays out correctly.
	el = $(el);
	var width = el.outerWidth();
	var height = el.outerHeight();
	var clone = el.clone().css({"width":width + "px", "height":height + "px", "margin":"0px"}).removeAttr("id");
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
		//when canceling a drag target gets a dragleave
		if(eType == "ibx_dragcancel")
			this._dispatchDragEvent(e, "ibx_dragleave", this.curTarget, true)

		this.curTarget.ibxRemoveClass(this.dragTargetClass);
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
};
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

				isDragging = true;
				dt.dataLock = true;
				this.dragElement.classList.add(this.dragSourceClass);
				document.body.classList.add("ibx-dragging");
				document.body.dataset.ibxOrigDragCursor = document.body.style.cursor;
			}
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
				//spit out events for source/target
				dEvent = this._dispatchDragEvent(e, "ibx_dragleave", this.curTarget[0], true);
				dEvent = this._dispatchDragEvent(e, "ibx_dragenter", elTarget, true, true);

				//reset last drag target
				if(this.curTarget.length)
				{
					this.curTarget.ibxRemoveClass(this.dragTargetClass);
					this.curTarget.css("cursor", this.curTarget.data("ibxDragTargetCursorOrig"));
					this.curTarget.removeData("ibxDragTargetCursorOrig");
				}

				//save new drag target
				this.curTarget = $(elTarget);
				if(this.curTarget.length)
				{
					//[IA-8982] when dragging over an svg node in IE (of course) there is no style property...so just ignore in that case.
					var cursor = this.curTarget[0].style ? this.curTarget[0].style.cursor : "";
					this.curTarget.data("ibxDragTargetCursorOrig", cursor);
					this.curTarget.ibxAddClass(this.dragTargetClass);
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
				});
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
	if(eType == "drop" && !e.defaultPrevented)
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


/******************************************************************************
Drag scrolling allows any object to be scrolled by dragging its content area (panning)
******************************************************************************/
$.widget("ibi.ibxDragScrolling", $.Widget, 
{
	options:
	{
		overflowX:"auto",
		overflowY:"auto",
	},
	_create:function()
	{
		this._super();
		this.widgetEventPrefix = "ibx_";
		this._onDragScrollBound = this._onDragScroll.bind(this);

		this.element.on("wheel", function(e)
		{
			this._onDragScroll(e);
		}.bind(this));

		//on mobile let the device do the scrolling...otherwise we handle it.
		if(ibxPlatformCheck.isMobile)
			this.element.css({"overflow":"auto", "-webkit-overflow-scrolling":"touch"});
		else
			this.element.on("mousedown mouseup mousemove mouseleave", this._onDragScrollBound);
	},
	_destroy:function()
	{
		this._super();
		this.element.off("mousedown mouseup mousemove mouseleave", this._onDragScrollBound);
	},
	_onDragScroll:function(e)
	{
		if(this.options.disabled)
			return;

		if(e.type == "mousedown")
		{
			if(!this.element.dispatchEvent("ibx_beforescroll", null, true, true).isDefaultPrevented())
			{
				this._scrolling = true;
				this._eLast = e;
			}
		}
		else
		if(e.type == "mouseup" || e.type == "mouseleave" && this._scrolling)
		{
			this._scrolling = false;
			this.element.dispatchEvent("ibx_endscroll", null, true, false);
		}
		else
		if(this._scrolling && e.type == "mousemove" && this._scrolling)
		{
			var dx = e.screenX - this._eLast.screenX;
			var dy = e.screenY - this._eLast.screenY;
			this._scroll(dx, dy);
			this._eLast = e;
		}
		else
		if(e.type == "wheel")
		{
			//firefox always seems to report a delta of 1...chrome/ie 100...go figure.
			var dx = (e.originalEvent.deltaX * -1) * (ibxPlatformCheck.isFirefox ? 100 : 1);
			var dy = (e.originalEvent.deltaY * -1) * (ibxPlatformCheck.isFirefox ? 100 : 1);
			this._scroll(dx, dy);

			//if we don't allow y scrolling then we aren't handling it...and we are not gonna prevent default;
			if(this.options.overflowY != "hidden")
				e.preventDefault();

		}
	},
	_scroll:function(dx, dy)
	{
		var options = this.options;
		dx = options.overflowX != "hidden" ? dx : 0;
		dy = options.overflowY != "hidden" ? dy : 0;

		var sl = this.element.prop("scrollLeft");
		var st = this.element.prop("scrollTop");
		this.element.prop({"scrollLeft": sl - dx, "scrollTop": st - dy});
	},
	_refresh:function()
	{
		this._super();
	}
});

//# sourceURL=dragdrop.ibx.js
