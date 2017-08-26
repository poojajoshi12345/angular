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
		prevNextButtonPos:"ends",	//ends/start/end
		showPrevButton:true,
		showNextButton:true,
		hideDisabledButtons:false,
		alignChildren:"center",

		scrollType:"fractional",	//page/integral/fractional
		scrollStep:25,				//page:1, integral:1, fractional:25px
		scrollStepRate:25,			//page:500, integral:250, fractional:25ms
		scrollProps:{"axis":"scrollLeft", "size":"offsetWidth"},//html props to use for calculating scroll position/delta
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
		this.element.on("keydown keyup", this._onItemsKeyEvent.bind(this)).on("ibx_resize", this._onResize.bind(this));
		this._prevBtn.on("mousedown mouseup mouseleave", this._onPrev.bind(this));
		this._nextBtn.on("mousedown mouseup mouseleave", this._onNext.bind(this));
		this._itemsBox.ibxDragScrolling({overflowY:"hidden"}).on("ibxscroll", this._onItemsBoxScroll.bind(this));
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
		e.type == "mousedown" ? this.scroll($.ibi.ibxCarousel.BACKWARD) : this.stop();
	},
	_onNext:function(e)
	{
		e.type == "mousedown" ? this.scroll($.ibi.ibxCarousel.FORWARD) : this.stop();
	},
	_onItemsKeyEvent:function(e)
	{
		if(e.type == "keydown")
		{
			if(e.keyCode == 37)
				this.scroll($.ibi.ibxCarousel.BACKWARD);
			else
			if(e.keyCode == 39)
				this.scroll($.ibi.ibxCarousel.FORWARD);
		}
		else
			this.stop();
	},
	_onResize:function()
	{
		this._adjustPageMarkers();
	},
	_onItemsBoxScroll:function(e)
	{
		this._adjustPageMarkers();
	},
	_scrollInfo:null,
	scroll:function(direction)
	{
		if(this._scrollInfo)
			return;

		//how far is the next step
		var options = this.options;
		var delta = 0;
		if(options.scrollType == "fractional")
			delta = options.scrollStep;
		else
		if(options.scrollType == "integral")
			delta = options.scrollStep * 202;/*Working on it*/
		else
		if(options.scrollType == "page")
			delta =  options.scrollStep *  this._itemsBox.prop(options.scrollProps.size);

		this._scrollInfo = scrollInfo = 
		{
			"nFrames": (options.scrollStepRate/1000) * 60,
			"curFrame": 0,
			"scrollAxis": options.scrollProps.axis,
			"direction": direction,
			"delta": (direction == $.ibi.ibxCarousel.FORWARD) ? delta : -delta,
			"animationFrameId": null
		};
		scrollInfo.scrollEnd = this._itemsBox.prop(scrollInfo.scrollAxis) + scrollInfo.delta;
		scrollInfo.stepSize = Math.ceil(scrollInfo.delta/scrollInfo.nFrames);

		var fnFrame = function(info, timeStamp)
		{
			var curScroll = this._itemsBox.prop(info.scrollAxis);
			var newScroll = curScroll + info.stepSize;
			if((info.direction == $.ibi.ibxCarousel.FORWARD && newScroll >= info.scrollEnd) || (info.direction == $.ibi.ibxCarousel.BACKWARD && newScroll <= info.scrollEnd))
				newScroll = info.scrollEnd;

			this._trigger("beforescroll", null, this._itemsBox, info);
			this._itemsBox.prop(info.scrollAxis, newScroll);
			this._adjustPageMarkers();

			console.log(info.scrollEnd, this._itemsBox.prop(info.scrollAxis), this._itemsBox.prop(info.scrollAxis), info);
			info.animationFrameId = window.requestAnimationFrame(fnFrame.bind(this, info));
			if(info.curFrame++ >= info.nFrames)
			{
				//end of step...do we want to stop, or keep scrolling for another step?
				if(info.stop)
				{
					window.cancelAnimationFrame(info.animationFrameId)
					this._trigger("scroll", null, this.getPageInfo());
					this._scrollInfo = null;
				}
				else
				{
					info.curFrame = 0;
					info.scrollEnd += info.delta;
				}
			}
		};
		scrollInfo.animationFrameId = window.requestAnimationFrame(fnFrame.bind(this, scrollInfo));
	},
	stop:function()
	{
		if(this._scrollInfo)
			this._scrollInfo.stop = true;
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
	option:function(key, value)
	{
		this._needsLayout = (key == "prevNextButtonPos" && value != this.options[key]);
		return this._superApply(arguments);
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		this._itemsBox.ibxDragScrolling("option", "disabled", !options.allowDragScrolling);
		this._prevBtn.css("display", options.showPrevButton ? "" : "none");
		this._nextBtn.css("display", options.showNextButton ? "" : "none");

		if(!this._created || this._needsLayout)
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
$.ibi.ibxCarousel.STD_PAGE =		{"scrollType":"page", "scrollStep":1, "scrollStepRate":500};
$.ibi.ibxCarousel.STD_INTEGRAL =	{"scrollType":"integral", "scrollStep":1, "scrollStepRate":250};
$.ibi.ibxCarousel.STD_FRACTIONAL =	{"scrollType":"fractional", "scrollStep":25, "scrollStepRate":25};
$.ibi.ibxCarousel.FORWARD = true;
$.ibi.ibxCarousel.BACKWARD = false;
$.ibi.ibxCarousel.STOP = -1;


$.widget("ibi.ibxHCarousel", $.ibi.ibxCarousel,{_widgetClass:"ibx-h-carousel"});
$.widget("ibi.ibxVCarousel", $.ibi.ibxCarousel,
{
	options:
	{
		direction:"row",
		scrollProps:{"axis":"scrollTop", "size":"offsetHeight"}
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
		if(e.type == "keydown")
		{
			if(e.keyCode == 38)
				this.scroll($.ibi.ibxCarousel.BACKWARD);
			else
			if(e.keyCode == 40)
				this.scroll($.ibi.ibxCarousel.FORWARD);
		}
		else
			this._super(e);
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
