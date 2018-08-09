/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

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
ibxDragDropManager.dragSourceClass = "ibx-drag-source";
ibxDragDropManager.dragTargetClass = "ibx-drop-target";
ibxDragDropManager.dragImageClass = "ibx-drag-image";
ibxDragDropManager.dragStartDistanceX = 5;
ibxDragDropManager.dragStartDistanceY = 5;

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
					this.curTarget.removeClass(this.dragTargetClass);
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

//# sourceURL=dragdrop.ibx.js