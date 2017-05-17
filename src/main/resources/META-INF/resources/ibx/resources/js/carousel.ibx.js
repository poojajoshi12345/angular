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
		this._prevBtn.on("mousedown mouseup mouseleave", this._onPrev.bind(this));
		this._nextBtn.on("mousedown mouseup mouseleave", this._onNext.bind(this));
		this._itemsBox.ibxDragScrolling();
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
	_onPrev:function(e)
	{
		this._scroll(e.type == "mousedown", false) 
	},
	_onNext:function(e)
	{
		this._scroll(e.type == "mousedown", true) 
	},
	_scrollTimer:null,
	_scroll:function(startScrolling, beginning)
	{
		if(startScrolling)
		{
			this._scrollTimer = window.setInterval(function(itemsBox, beginning)
			{
				var sl = itemsBox.prop("scrollLeft");
				itemsBox.prop("scrollLeft", sl + (beginning ? this.options.step : -this.options.step));
			}.bind(this, this._itemsBox, beginning), this.options.stepRate); 
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

$.widget("ibi.ibxHCarousel", $.ibi.ibxCarousel,{_widgetClass:"_ibxHCarousel"});
$.widget("ibi.ibxVCarousel", $.ibi.ibxCarousel,
{
	options:
	{
		direction:"row",
	},
	_widgetClass:"_ibxVCarousel",
	_create:function()
	{
		this._super();
		this._itemsContainer.ibxWidget("option", "direction", "column");
		this._itemsBox.ibxWidget("option", "direction", "column");
		this._pageMarkers.ibxWidget("option", "direction", "column");
		this._prevBtn.ibxWidget("option", {"iconPosition": "top", "glyph": "keyboard_arrow_up"});
		this._nextBtn.ibxWidget("option", {"iconPosition": "top", "glyph": "keyboard_arrow_down"});
	},
	_scroll:function(startScrolling, beginning)
	{
		if(startScrolling)
		{
			this._scrollTimer = window.setInterval(function(itemsBox, beginning)
			{
				var sl = itemsBox.prop("scrollTop");
				itemsBox.prop("scrollTop", sl + (beginning ? this.options.step : -this.options.step));
			}.bind(this, this._itemsBox, beginning), this.options.stepRate); 
		}
		else
			window.clearInterval(this._scrollTimer);
	},
});

//# sourceURL=carousel.ibx.js
