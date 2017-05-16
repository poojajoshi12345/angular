/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
Simple Carousel (Kind of a placeholder for when I have more time to do a better one!)
******************************************************************************/
$.widget("ibi.ibxCarousel", $.ibi.ibxVBox, 
{
	options:
	{
		nameRoot:true,
		align:"stretch",
		showPageMarkers:false,
		showPrevButton:true,
		showNextButton:true,
		step:25,
		stepRate:25,
	},
	_widgetClass:"ibx-carousel",
	_create:function()
	{
		this._super();
		var children = this.element.children();
		var resBody = ibxResourceMgr.getResource(".res-ibx-carousel-body", false);
		this.element.append(resBody.children());
		ibx.bindElements(this.element);
		this._prevBtn.on("mousedown mouseup", this._onPrev.bind(this));
		this._nextBtn.on("mousedown mouseup", this._onNext.bind(this));
		
		//on ios let the device do the scrolling...otherwise we handle it.
		if(ibxPlatformCheck.isIOS)
			this._itemsBox.css({"overflow":"auto", "-webkit-overflow-scrolling":"touch"});
		else
			this._itemsBox.on("mousedown mouseup mousemove mouseleave", this._onDragScroll.bind(this));

		this.add(children);
	},
	children:function(selector)
	{
		selector = selector || ".ibx-csl-item";
		return this._itemsBox.children(selector);
	},
	add:function(el, sibling, before, refresh)
	{
		$(el).addClass("ibx-csl-item");
		this._itemsBox.ibxWidget("add", el, sibling, before, refresh);
	},
	remove:function(el, refresh)
	{
		$(el).removeClass("ibx-csl-item");
		this._itemsBox.ibxWidget("remove", el, refresh);
	},
	_onDragScroll:function(e)
	{
		if(ibxPlatformCheck.isIOS)
		{
		}
		if(e.type == "mousedown")
		{
			this._eLast = e;
			this._scrolling = true;
			e.preventDefault();
		}
		else
		if(e.type == "mouseup" || e.type == "mouseleave")
			this._scrolling = false;
		else
		if(this._scrolling && e.type == "mousemove")
		{
			var dx = e.screenX - this._eLast.screenX;
			var dy = e.screenY - this._eLast.screenY;
			var sl = this._itemsBox.prop("scrollLeft");
			this._itemsBox.prop("scrollLeft", sl - dx);
			this._eLast = e;
		}
	},
	_onPrev:function(e)
	{
		var bDown = (e.type == "mousedown");
		this._scroll(bDown, false) 
	},
	_onNext:function(e)
	{
		var bDown = (e.type == "mousedown");
		this._scroll(bDown, true) 
	},
	_scrollTimer:null,
	_scroll:function(start, right)
	{
		if(start)
		{
			this._scrollTimer = window.setInterval(function(itemsBox, right)
			{
				var sl = itemsBox.prop("scrollLeft");
				itemsBox.prop("scrollLeft", sl + (right ? this.options.step : -this.options.step));
			}.bind(this, this._itemsBox, right), this.options.stepRate); 
		}
		else
			window.clearInterval(this._scrollTimer);
	},
	refresh:function()
	{
		this._super();
		var options = this.options;
		this._pageMarkers.css("display", options.showPageMarkers ? "" : "none");
		this._prevBtn.css("display", options.showPrevButton ? "" : "none");
		this._nextBtn.css("display", options.showNextButton ? "" : "none");
	}
});
