/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxSortable", $.Widget, 
{
	options:
	{
		"direction":"column",
	},
	_widgetClass:"ibx-sortable",
	_create:function()
	{
		this._super();
		this.element.on("focusin", this._onDragEvent.bind(this));

		var el = this.element[0];
		el.addEventListener("mousedown", this._onDragEvent, true);
		el.addEventListener("mouseup", this._onDragEvent, true);
		el.addEventListener("mousemove", this._onDragEvent, true);
	},
	_destroy:function()
	{
		this._super();
	},
	_onDragEvent:function(e)
	{
		var eType = e.type;
		if(eType == "mousedown")
		{
			this._inDrag = true;
			this._eLast = e;
			var de = this._dragElement = $(e.target);
			var ph = this._placeholder = de.clone().css("visibility", "hidden");
			var width = de.width();
			var height = de.height();
			var pos = de.position();
			de.css({"pointerEvents":"none", "position":"absolute", "left":pos.left, "top":pos.top, "width":width, "height":height});
			ph.insertAfter(de);
		}
		else
		if(eType == "mouseup")
		{
			this._dragElement.css({"pointerEvents":"", "position":"", "width":"", "height":"", "left":"", "top":""});
			this._placeholder.remove();
			delete this._placeholder;
			delete this._eLast;
			this._inDrag = false;
		}
		else
		if(eType == "mousemove")
		{
			var eLast = this._eLast
			if(this._inDrag && eLast)
			{
				var dx = e.clientX - eLast.clientX;
				var dy = e.clientY - eLast.clientY
				var pos = this._dragElement.position();
				this._dragElement.css({"left": pos.left + dx, "top": pos.top + dy});
				this._eLast = e;
			}
		}
	},
	_refresh:function()
	{
		var options = this.options;
		this._super();
	}
});

//# sourceURL=sortable.ibx.js

