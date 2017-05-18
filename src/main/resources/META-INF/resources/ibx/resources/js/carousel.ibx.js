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
		pageMarkersPos:"end",
		showPrevButton:true,
		showNextButton:true,
		step:25,
		stepRate:25,
		alignChildren:"center"
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
		this._itemsBox.ibxDragScrolling({overflowY:"hidden"});
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
		this.refresh()
	},
	remove:function(el, refresh)
	{
		this._itemsBox.ibxWidget("remove", el, refresh);
		$(el).removeClass("ibx-csl-item");
		this.refresh();
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
				this.refresh();
			}.bind(this, this._itemsBox, beginning), this.options.stepRate); 
		}
		else
			window.clearInterval(this._scrollTimer);
	},
	_onPageMarkerClick:function(e)
	{
		var pageMarker = $(e.currentTarget);
		var markerInfo = pageMarker.data("ibxPageMarkerInfo");
		this._itemsBox.prop("scrollLeft", markerInfo.metrics.pageWidth * markerInfo.pageNo);
	},
	_adjustPageMarkers:function()
	{
		var overFlow = this._itemsBox.css("overflow");
		var metrics = 
		{
			scrollWidth:	this._itemsBox.css("overflow", "auto").prop("scrollWidth"),
			scrollHeight:	this._itemsBox.prop("scrollHeight"),
			scrollLeft:		this._itemsBox.prop("scrollLeft"),
			scrollTop:		this._itemsBox.prop("scrollTop"),
			pageWidth:		this._itemsBox.prop("offsetWidth") || 1,
			pageHeight:		this._itemsBox.prop("offsetHeight") || 1,
		};
		this._itemsBox.css("overflow", overFlow);

		this._pageMarkers.empty();
		var pageInfo = this._getPageInfo(metrics);
		for(var i = 0; i < pageInfo.pages; ++i)
		{
			var pageMarker = $(sformat("<div class='ibx-csl-page-marker {1}'>", i == pageInfo.curPage ? "ibx-csl-page-selected" : ""));
			pageMarker.prop("title", "Page - " + (i + 1));
			pageMarker.data("ibxPageMarkerInfo", {"pageNo":i, "metrics":metrics}).on("click", this._onPageMarkerClick.bind(this));
			this._pageMarkers.append(pageMarker)
		}
	},
	_getPageInfo:function(metrics)
	{
		return {pages: Math.floor(metrics.scrollWidth / metrics.pageWidth) || 1, curPage: Math.floor(metrics.scrollLeft / metrics.pageWidth)};
	},
	refresh:function()
	{
		this._super();
		var options = this.options;
		this._prevBtn.css("display", options.showPrevButton ? "" : "none");
		this._nextBtn.css("display", options.showNextButton ? "" : "none");
		this._itemsBox.ibxWidget("option", "align", options.alignChildren);

		this._adjustPageMarkers();
		this._pageMarkers.css("display", options.showPageMarkers ? "" : "none");
		(options.pageMarkersPos == "start")
			? this._pageMarkers.insertBefore(this._itemsContainer)
			: this._pageMarkers.insertAfter(this._itemsContainer);
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
		this._itemsBox.ibxDragScrolling({overflowX:"hidden", overflowY:"auto"});
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
	_getPageInfo:function(metrics)
	{
		return {pages: Math.floor(metrics.scrollHeight / metrics.pageHeight) || 1, curPage: Math.floor(metrics.scrollTop / metrics.pageHeight)};
	},
	_onPageMarkerClick:function(e)
	{
		var pageMarker = $(e.currentTarget);
		var markerInfo = pageMarker.data("ibxPageMarkerInfo");
		this._itemsBox.prop("scrollTop", markerInfo.metrics.pageHeight * markerInfo.pageNo);
	},
});

//# sourceURL=carousel.ibx.js
