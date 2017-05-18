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

		//propagate the dragscroll event to this object.
		this._itemsBox.on("scroll", function(e)
		{
			this._adjustPageMarkers();
			this._trigger("scroll", e, this);
		}.bind(this));
	},
	_destroy:function()
	{
		this.remove(this.children());
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
				this._trigger("scroll", null, this);
				this._adjustPageMarkers();
			}.bind(this, this._itemsBox, beginning), this.options.stepRate); 
		}
		else
			window.clearInterval(this._scrollTimer);
	},
	_adjustPageMarkers:function()
	{
		var metrics = 
		{
			scrollWidth:	this._itemsBox.css("overflow", "auto").prop("scrollWidth"),
			scrollHeight:	this._itemsBox.prop("scrollHeight"),
			scrollLeft:		this._itemsBox.prop("scrollLeft"),
			scrollTop:		this._itemsBox.prop("scrollTop"),
			pageWidth:		this._itemsBox.prop("offsetWidth"),
			pageHeight:		this._itemsBox.prop("offsetHeight"),
		};
		metrics = $.extend(metrics, 
		{
			hPages:			Math.floor(metrics.scrollWidth / metrics.pageWidth),
			vPages:			Math.floor(metrics.scrollHeight / metrics.pageHeight),
			hCurPage:		Math.floor(metrics.scrollLeft / metrics.pageWidth),
			vCurPage:		Math.floor(metrics.scrollTop / metrics.pageHeight),
		});

		this._pageMarkers.empty();
		for(var i = 0; i < metrics.hPages; ++i)
		{
			var pageMarker = $(sformat("<div class='ibx-csl-page-marker {1}'>", i == metrics.hCurPage ? "ibx-csl-page-selected" : ""));
			pageMarker.data("cslPageInfo", {"pageNo":i, "metrics":metrics});
			this._pageMarkers.append(pageMarker)
		}
		//console.log(scrollWidth, scrollHeight, hPages, vPages, hCurPage, vCurPage);
		this._itemsBox.css("overflow", "");
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

$.widget("ibi.ibxHCarousel", $.ibi.ibxCarousel,{_widgetClass:"ibx-h-carousel"});
$.widget("ibi.ibxVCarousel", $.ibi.ibxCarousel,
{
	options:
	{
		direction:"row",
	},
	_widgetClass:"ibx-v-carousel",
	_create:function()
	{
		this._super();
		this._itemsContainer.ibxWidget("option", "direction", "column");
		this._itemsBox.ibxWidget("option", "direction", "column");
		this._pageMarkers.ibxWidget("option", "direction", "column");
		this._prevBtn.ibxWidget("option", {"iconPosition": "top"});
		this._nextBtn.ibxWidget("option", {"iconPosition": "top"});
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
