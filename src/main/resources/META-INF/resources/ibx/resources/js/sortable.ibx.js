/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxSortable", $.Widget, 
{
	options:
	{
		"direction":"all",
	},
	_widgetClass:"ibx-sortable",
	_create:function()
	{
		this._super();
		this.element.addClass(this._widgetClass);
		var el = this.element[0];
		el.addEventListener("mousedown", this._onDragEvent.bind(this), true);
		el.addEventListener("mouseup", this._onDragEvent.bind(this), true);
		el.addEventListener("mousemove", this._onDragEvent.bind(this), true);
	},
	_destroy:function()
	{
		this._super();
		this.removeClass(this._widgetClass);
	},
	_dragElement:$(),
	_placeholder:$(),
	_inDrag: false,
	_onDragEvent:function(e)
	{
		var target = $(e.target);

		var eType = e.type;
		if(eType == "mousedown")
		{
			//can only sort direct children
			this._stopDrag();//kill any left over drag (you dragged out of bounds and confused the world).

			this._inDrag = true;
			var de = this._dragElement = $(this.element.directChild(e.target));
			var ph = this._placeholder = de.clone().addClass("ibx-sortable-placeholder").css("visibility", "hidden");
			var width = de.width();
			var height = de.height();
			var pos = de.position();
			de.css({"pointerEvents":"none", "position":"absolute", "left":pos.left, "top":pos.top, "width":width, "height":height}).addClass("ibx-sortable-dragging");
			ph.insertAfter(de);
		}
		else
		if(eType == "mouseup")
		{
			if(this._dragElement)
				this._dragElement.insertAfter(this._placeholder);
			this._stopDrag();
		}
		else
		if(eType == "mousemove")
		{
			if(this._inDrag && this._eLast)
			{
				var eLast = this._eLast
				var dx = e.clientX - eLast.clientX;
				var dy = e.clientY - eLast.clientY
				var pos = this._dragElement.position();
				this._dragElement.css({"left": pos.left + dx, "top": pos.top + dy});

				if(!this.element.is(target) && !this._placeholder.is(target))
				{
					//can only sort direct children
					var target = $(this.element.directChild(e.target));
					var tBounds = target.bounds();
					if(e.clientY > (tBounds.top + (tBounds.height / 2)))
						this._placeholder.insertAfter(target);
					else
						this._placeholder.insertBefore(target);
				}
			}
			this._eLast = e;
		}
	},
	_stopDrag:function()
	{
		this._dragElement.css({"pointerEvents":"", "position":"", "width":"", "height":"", "left":"", "top":""}).removeClass("ibx-sortable-dragging");
		delete this._dragElement;
		this._placeholder.remove();
		delete this._placeholder;
		delete this._eLast;
		this._inDrag = false;
	},
});
$.widget("ibi.ibxHSortable", $.ibi.ibxSortable, {options:{direction:"horizontal"}}); 
$.widget("ibi.ibxVSortable", $.ibi.ibxSortable, {options:{direction:"vertical"}}); 
//# sourceURL=sortable.ibx.js

