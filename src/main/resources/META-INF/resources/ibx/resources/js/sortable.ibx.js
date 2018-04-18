/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxSortable", $.Widget, 
{
	options:
	{
		"direction":"vertical",
		"lockDragAxis":false,
		"startDragDistanceX":5,
		"startDragDistanceY":5,
		"sortItemClasses":"",
		"placeholderClasses":"",
		"sortableItems":"*",
	},
	_widgetClass:"ibx-sortable",
	_create:function()
	{
		this._super();
		var options = this.options;
		var curPos = this.element.css("position");
		this.element.addClass(this._widgetClass).ibxAutoScroll({"direction":options.direction});
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
	_createPlaceholder:function(dragElement)
	{
		var ph = dragElement.clone().addClass("ibx-sortable-placeholder " + this.options.placeholderClasses);
		var e = this.element.dispatchEvent("ibx_createplaceholder", ph, false);
		ph = e.data;
		return ph;
	},
	_dragElement:null,
	_placeholder:null,
	_inDrag: false,
	_onDragEvent:function(e)
	{
		var target = $(e.target);
		var eType = e.type;
		if(eType == "mousedown")
		{
			//can only sort direct children
			this._stopDrag();//kill any left over drag (you dragged out of bounds and confused the world).
			var directChild = $(this.element.directChild(e.target));
			if(directChild.is(this.options.sortableItems))
			{
				this._dragElement = directChild;
				this._eMouseDown = e;
			}
		}
		else
		if(eType == "mouseup")
		{
			if(this._inDrag && this._dragElement)
			{							
				var evt = this.element.dispatchEvent("ibx_sortend", {"sortElement":this._dragElement, "beforeElement":this._placeholder.prev(), "afterElement":this._placeholder.next(), "originalEvent":e}, false);
				if(!evt.defaultPrevented)
					this._dragElement.insertAfter(this._placeholder);
			}
			this._stopDrag();
		}
		else
		if(eType == "mousemove")
		{
			var options = this.options;
			if(!this._inDrag && this._dragElement)
			{
				var vert = this.options.direction == "vertical";
				var dx = Math.abs(e.clientX - this._eMouseDown.clientX);
				var dy = Math.abs(e.clientY - this._eMouseDown.clientY);
				if(!vert && dx >= options.startDragDistanceX || vert && dy >= options.startDragDistanceY)
				{
					var evt = this.element.dispatchEvent("ibx_beforesort", this._dragElement, false);
					if(!evt.defaultPrevented)
					{
						this._inDrag = true;
						var de = this._dragElement;
						var mx = de.metrics();
						var sizeBox = mx.isBorderSizing ? mx.borderBox : mx.innerBox;
						var ph = this._placeholder = this._createPlaceholder(de);
						de.css({"zIndex":100000, "pointerEvents":"none", "position":"absolute", "left":mx.marginBox.left, "top":mx.marginBox.top, "width":sizeBox.width, "height":sizeBox.height});
						de.addClass("ibx-sortable-dragging " + options.sortItemClasses);
						ph.insertAfter(de);
						this.element.ibxAutoScroll("start");
					}
				}
			}
			else
			if(this._inDrag && this._eLast)
			{
				var eLast = this._eLast
				var mx = this._dragElement.metrics();
				var dx = e.clientX - eLast.clientX;
				var dy = e.clientY - eLast.clientY
				var vert = this.options.direction == "vertical";

				//move within axis only if specified
				if(options.lockDragAxis)
					this._dragElement.css({"left": mx.marginBox.left + (!vert ? dx : 0), "top": mx.marginBox.top + (vert ? dy : 0)});
				else
					this._dragElement.css({"left": mx.marginBox.left + dx, "top":  mx.marginBox.top + dy});

				if(!this.element.is(target) && !this._placeholder.is(target))
				{
					//can only sort direct children
					var target = $(this.element.directChild(e.target));
					if(target.is(options.sortableItems))
					{
						var tBounds = target[0].getBoundingClientRect();
						var after = false;
					
						if(vert)
							after = e.clientY > (tBounds.top + (tBounds.height / 2));
						else
							after = e.clientX > (tBounds.left + (tBounds.width / 2));

						//let the world know we are doing a sort move...can't cancel
						this.element.dispatchEvent("ibx_sortmove", {"sortElement":this._dragElement, "targetElement":target, "tBounds":tBounds, "after":after, "originalEvent":e}, false, false);

						if(after)
							this._placeholder.insertAfter(target);
						else
							this._placeholder.insertBefore(target);
					}
				}
			}
			this._eLast = e;
		}
	},
	_stopDrag:function()
	{
		this.element.ibxAutoScroll("stop");
		if(this._dragElement)
			this._dragElement.css({"zIndex":"", "pointerEvents":"", "position":"", "width":"", "height":"", "left":"", "top":""}).removeClass("ibx-sortable-dragging " + this.options.sortItemClasses);
		delete this._dragElement;
		if(this._placeholder)
			this._placeholder.remove();
		delete this._placeholder;
		delete this._eLast;
		delete this._eMouseDown;
		this._inDrag = false;
	},
});
$.widget("ibi.ibxVSortable", $.ibi.ibxSortable, {options:{direction:"vertical", lockDragAxis:true}}); 
$.widget("ibi.ibxHSortable", $.ibi.ibxSortable, {options:{direction:"horizontal", lockDragAxis:true}}); 
//# sourceURL=sortable.ibx.js

