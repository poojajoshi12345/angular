/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
Simple Carousel (Kind of a placeholder for when I have more time to do a better one!)
******************************************************************************/
$.widget("ibi.ibxCarousel", $.ibi.ibxVBox, 
{
	options:
	{
		wantResize:true,
		nameRoot:true,
		align:"stretch",
		showPageMarkers:false,
		pageMarkersPos:"end",
		pageMarkerClass:"ibx-csl-page-marker",
		pageMarkerSelectedClass:"ibx-csl-page-selected",
		prevNextButtonPos:"ends", //ends/start/end
		showPrevButton:true,
		showNextButton:true,
		hideDisabledButtons:false,
		alignChildren:"center",

		scrollType:"fractional", //page/integral(child)/fractional(pixel)
		scrollStepRate:{"page":200, "integral":200, "fractional":25},//time in ms 
		scrollStep:25,//n children per scroll...if fractional then this is a pixel based increment per scroll
		allowDragScrolling:true
	},
	_widgetClass:"ibx-carousel",
	_create:function()
	{
		this._super();
		var children = this.element.children();
		var resBody = ibx.resourceMgr.getResource(".res-ibx-carousel-body", false);
		this.element.append(resBody.children());
		ibx.bindElements(this.element.children());
		this.element.on("keydown", this._onItemsKeyEvent.bind(this)).on("ibx_resize", this._onResize.bind(this));
		this._prevBtn.on("mousedown mouseup mouseleave", this._onPrev.bind(this));
		this._nextBtn.on("mousedown mouseup mouseleave", this._onNext.bind(this));
		this._itemsBox.ibxDragScrolling({overflowY:"hidden"}).on("ibx_scroll", this._onItemsBoxScroll.bind(this));
		this.add(children);
	},
	_destroy:function()
	{
		this._resSensor.detach();
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
		this.refresh();
	},
	remove:function(el, refresh)
	{
		this._itemsBox.ibxWidget("remove", el, refresh);
		$(el).removeClass("ibx-csl-item");
		this.refresh();
	},
	_onPrev:function(e)
	{
		this._scroll(e.type == "mousedown", false, true) 
	},
	_onNext:function(e)
	{
		this._scroll(e.type == "mousedown", true, true) 
	},
	_onItemsKeyEvent:function(e)
	{
		if(e.keyCode == 37)
			this._scroll(true, false);
		else
		if(e.keyCode == 39)
			this._scroll(true, true);
	},
	_onResize:function()
	{
		this._adjustPageMarkers();
	},
	_onItemsBoxScroll:function(e)
	{
		this._adjustPageMarkers();
	},
	_scrollTimer:null,
	_scroll:function(startScrolling, forward, continual)
	{
		var options = this.options;
		var scrollInfo = {"forward":forward};
		if(startScrolling)
		{
			var childInfo = this.getChildInfo();
			var metrics = this.getPageMetrics();
			var delta = 0;
			if(options.scrollType == "fractional")
				delta = options.scrollStep;
			else
			if(options.scrollType == "integral")
				;
			else
			if(options.scrollType == "page")
				delta = this._itemsBox.prop("offsetWidth");
			delta = forward ? delta : -delta;

			this._doScroll("scrollLeft", delta);

			if(continual)
			{
				this._scrollTimer = window.setInterval(function(forward, delta)
				{
					this._doScroll("scrollLeft", delta);
				}.bind(this, forward, delta), options.scrollStepRate[options.scrollType]); 
			}
			this._scrolling = true;
		}
		else
		if(this._scrolling)
		{
			this._scrolling = false;
			window.clearInterval(this._scrollTimer);
		}
	},
	_doScroll:function(scrollType, delta)
	{
		var curScroll = this._itemsBox.prop(scrollType);
		this._itemsBox.prop(scrollType, curScroll + delta);
		this._adjustPageMarkers();
		this._trigger("scroll", null, this.getPageInfo());
	},
	_onPageMarkerClick:function(e)
	{
		var pageMarker = $(e.currentTarget);
		var markerInfo = pageMarker.data("ibxPageMarkerInfo");
		this._itemsBox.prop("scrollLeft", markerInfo.metrics.pageWidth * markerInfo.pageNo);
		this._adjustPageMarkers();
	},
	_adjustPageMarkers:function()
	{
		this._pageMarkers.empty();
		var metrics = this.getPageMetrics();
		var pageInfo = this.getPageInfo(metrics);
		for(var i = 0; i < pageInfo.pages; ++i)
		{
			var pageMarker = $(sformat("<div class='{1} {2}' tabIndex='0'>", this.options.pageMarkerClass, i == pageInfo.curPage ? this.options.pageMarkerSelectedClass : ""));
			pageMarker.prop("title", "Page - " + (i + 1));
			pageMarker.data("ibxPageMarkerInfo", {"pageNo":i, "metrics":metrics}).on("click", this._onPageMarkerClick.bind(this));
			this._pageMarkers.append(pageMarker)
		}

		var options = this.options;
		var disabled = metrics.scrollLeft <= 0;
		this._prevBtn.ibxWidget("option", "disabled", disabled).toggleClass("csl-btn-hidden", (disabled && options.hideDisabledButtons));

		disabled = (metrics.scrollLeft + metrics.pageWidth) >= metrics.scrollWidth;
		this._nextBtn.ibxWidget("option", "disabled", disabled).toggleClass("csl-btn-hidden", (disabled && options.hideDisabledButtons));
	},
	getChildInfo:function(el)
	{
		var childInfo = 
		{
			startHidden:[],
			startPartial:null,
			visible:[],
			endPartial:null,
			endHidden:[]
		};

		var curChildren = [];
		var children = this.children(el);
		children.each(function(curChildren, idx, el)
		{
			var elInfo = this.getChildVisibility(el);
			var visFlags = elInfo.visFlags;
			
			if(childInfo.endPartial && (visFlags == $.ibi.ibxCarousel.VIS_FLAGS.NONE))
				childInfo.endHidden.push(elInfo);
			else
			if(!childInfo.startPartial && (visFlags == $.ibi.ibxCarousel.VIS_FLAGS.NONE))
				childInfo.startHidden.push(elInfo);
			else
			if(!(visFlags & $.ibi.ibxCarousel.VIS_FLAGS.LEFT) && (visFlags & $.ibi.ibxCarousel.VIS_FLAGS.RIGHT))
				childInfo.startPartial = elInfo
			else
			if(elInfo.visFlags == $.ibi.ibxCarousel.VIS_FLAGS.ALL)
				childInfo.visible.push(elInfo)
			else
			if(!(visFlags & $.ibi.ibxCarousel.VIS_FLAGS.RIGHT) && (visFlags & $.ibi.ibxCarousel.VIS_FLAGS.LEFT))
				childInfo.endPartial = elInfo
		}.bind(this, curChildren));
		return childInfo;
	},
	getChildVisibility:function(el)
	{
		var elInfo = this.getElementMetrics(el);
		var p = $(el.offsetParent);
		var pWidth = p.width();
		var pHeight = p.height();

		var flags = $.ibi.ibxCarousel.VIS_FLAGS;
		var visFlags = 0;
		visFlags |= (elInfo.left >= 0 && elInfo.left <= pWidth) ? flags.LEFT : 0;
		visFlags |= (elInfo.top >= 0 && elInfo.top <= pHeight) ? flags.TOP : 0;
		visFlags |= (elInfo.right >= 0 && elInfo.right <= pWidth) ? flags.RIGHT : 0;
		visFlags |= (elInfo.bottom >= 0 && elInfo.bottom <= pHeight) ? flags.BOTTOM: 0;
		visFlags = (!(visFlags & (flags.LEFT | flags.RIGHT)) || !(visFlags & (flags.TOP | flags.BOTTOM))) ? flags.NONE : visFlags;
		elInfo.visFlags = visFlags;
		return elInfo;
	},
	getElementMetrics:function(el)
	{
		el = $(el);
		var elInfo = el.position() || {};
		elInfo.width = el.outerWidth(true);
		elInfo.height = el.outerHeight(true);
		elInfo.right = elInfo.left + elInfo.width;
		elInfo.bottom = elInfo.top + elInfo.height;
		elInfo.el = el;
		return elInfo;
	},
	getPageMetrics:function()
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
		return metrics;
	},
	getPageInfo:function(metrics)
	{
		metrics = metrics || this.getPageMetrics();
		return {"pages": Math.floor(metrics.scrollWidth / metrics.pageWidth) || 1, "curPage": Math.floor(metrics.scrollLeft / metrics.pageWidth), "metrics":metrics};
	},
	page:function(pageNo)
	{
		var info = this.getPageInfo();
		if(pageNo === undefined)
			return info.curPage;

		var pageNo = (pageNo == -1) ? info.curPage : pageNo;
		if(pageNo <= info.pages-1)
		{
			this._itemsBox.prop("scrollLeft", info.metrics.pageWidth * pageNo);
			this._adjustPageMarkers();
		}
	},
	_setOption:function(key, value)
	{
		this._needsLayout = (key == "prevNextButtonPos" && value != this.options[key]);
		this._super(key, value);
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		this._itemsBox.ibxDragScrolling("option", "disabled", !options.allowDragScrolling);
		this._prevBtn.css("display", options.showPrevButton ? "" : "none");
		this._nextBtn.css("display", options.showNextButton ? "" : "none");

		if(this._needsLayout)
		{
			if(options.prevNextButtonPos == "ends")
				this._itemsContainer.append(this._prevBtn, this._itemsBox, this._nextBtn);
			else
			if(options.prevNextButtonPos == "start")
				this._itemsContainer.append(this._prevBtn, this._nextBtn, this._itemsBox);
			else
			if(options.prevNextButtonPos == "end")
				this._itemsContainer.append(this._itemsBox, this._prevBtn, this._nextBtn);
		}

		this._adjustPageMarkers();
		this._pageMarkers.css("display", options.showPageMarkers ? "" : "none");
		(options.pageMarkersPos == "start")
			? this._pageMarkers.insertBefore(this._itemsContainer)
			: this._pageMarkers.insertAfter(this._itemsContainer);
	}
});
$.ibi.ibxCarousel.VIS_FLAGS = 
{
	NONE:	0x00000000,
	LEFT:	0x00000001,
	TOP:	0x00000002,
	RIGHT:	0x00000004,
	BOTTOM:	0x00000008,
};
$.ibi.ibxCarousel.VIS_FLAGS.ALL = $.ibi.ibxCarousel.VIS_FLAGS.LEFT | $.ibi.ibxCarousel.VIS_FLAGS.TOP | $.ibi.ibxCarousel.VIS_FLAGS.RIGHT | $.ibi.ibxCarousel.VIS_FLAGS.BOTTOM;


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
	_onItemsKeyEvent:function(e)
	{
		if(e.keyCode == 38)
			this._scroll(true, false, false);
		else
		if(e.keyCode == 40)
			this._scroll(true, true, false);
	},
	_scroll:function(startScrolling, forward, continual)
	{
		var options = this.options;
		var scrollInfo = {"forward":forward};
		if(startScrolling)
		{
			var childInfo = this.getChildInfo();
			var metrics = this.getPageMetrics();
			var delta = 0;
			if(options.scrollType == "fractional")
				delta = options.scrollStep;
			else
			if(options.scrollType == "integral")
				;
			else
			if(options.scrollType == "page")
				delta = this._itemsBox.prop("offsetHeight");
			delta = forward ? delta : -delta;

			this._doScroll("scrollTop", delta);

			if(continual)
			{
				this._scrollTimer = window.setInterval(function(forward, delta)
				{
					this._doScroll("scrollTop", delta);
				}.bind(this, forward, delta), options.scrollStepRate[options.scrollType]); 
			}
			this._scrolling = true;
		}
		else
		if(this._scrolling)
		{
			this._scrolling = false;
			window.clearInterval(this._scrollTimer);
		}
	},
	_onPageMarkerClick:function(e)
	{
		var pageMarker = $(e.currentTarget);
		var markerInfo = pageMarker.data("ibxPageMarkerInfo");
		this._itemsBox.prop("scrollTop", markerInfo.metrics.pageHeight * markerInfo.pageNo);
		this._adjustPageMarkers();
	},
	_adjustPageMarkers:function()
	{
		this._super();
		var metrics = this.getPageMetrics();
		this._prevBtn.ibxWidget("option", "disabled", metrics.scrollTop <= 0);
		this._nextBtn.ibxWidget("option", "disabled", (metrics.scrollTop + metrics.pageHeight) >= metrics.scrollHeight);
	},
	getPageInfo:function(metrics)
	{
		metrics = metrics || this.getPageMetrics();
		return {pages: Math.floor(metrics.scrollHeight / metrics.pageHeight) || 1, curPage: Math.floor(metrics.scrollTop / metrics.pageHeight)};
	},
});

//# sourceURL=carousel.ibx.js
