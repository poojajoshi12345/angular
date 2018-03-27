/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxSortable", $.Widget, 
{
	options:
	{
		"direction":"vertical",
		"lockDragAxis":false,
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

			if(!target.is(this.element))
			{
				this._inDrag = true;
				var de = this._dragElement = $(this.element.directChild(e.target));
				var ph = this._placeholder = de.clone().addClass("ibx-sortable-placeholder").css("visibility", "hidden");
				var width = de.width();
				var height = de.height();
				var pos = de.position();
				de.css({"pointerEvents":"none", "position":"absolute", "left":pos.left, "top":pos.top, "width":width, "height":height}).addClass("ibx-sortable-dragging");
				ph.insertAfter(de);
			}
		}
		else
		if(eType == "mouseup")
		{
			
			var e = this.element.dispatchEvent("ibx_sortend", {"sortElement":this._dragElement, "beforeElement":this._placeholder.prev(), "afterElement":this._placeholder.next(), "originalEvent":e}, false);
			if(this._dragElement && !e.defaultPrevented)
				this._dragElement.insertAfter(this._placeholder);
			this._stopDrag();
		}
		else
		if(eType == "mousemove")
		{
			if(this._inDrag && this._eLast)
			{
				var options = this.options;
				var eLast = this._eLast
				var dx = e.clientX - eLast.clientX;
				var dy = e.clientY - eLast.clientY
				var pos = this._dragElement.position();
				var vert = this.options.direction == "vertical";

				//move within axis only if specified
				if(options.lockDragAxis)
					this._dragElement.css({"left": (!vert) ? pos.left + dx : 0, "top":  vert ? pos.top + dy : 0});
				else
					this._dragElement.css({"left": pos.left + dx, "top":  pos.top + dy});

				if(!this.element.is(target) && !this._placeholder.is(target))
				{
					//can only sort direct children
					var target = $(this.element.directChild(e.target));
					var tBounds = target.bounds();
					var after = false;
					
					if(vert)
						after = e.clientY > (tBounds.top + (tBounds.height / 2));
					else
						after = e.clientX > (tBounds.left + (tBounds.width / 2));

					this.element.dispatchEvent("ibx_sortmove", {"sortElement":this._dragElement, "targetElement":target, "tBounds":tBounds, "after":after, "originalEvent":e}, false);

					if(after)
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
$.widget("ibi.ibxVSortable", $.ibi.ibxSortable, {}); 
$.widget("ibi.ibxHSortable", $.ibi.ibxSortable, {options:{direction:"horizontal"}}); 
//# sourceURL=sortable.ibx.js

