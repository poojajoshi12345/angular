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
		showPageMarkers:true,
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
		scrollProps:
		{
			"axis":"scrollLeft",
			"size":"offsetWidth",
			"forward":{"child":"right", "page":"scrollRight"},
			"backward":{"child":"left", "page":"scrollLeft"},
		},//html props to use for calculating scroll position/delta
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
		if(refresh)
			this.refresh();
	},
	remove:function(el, refresh)
	{
		this._itemsBox.ibxWidget("remove", el, refresh);
		$(el).removeClass("ibx-csl-item");
		if(refresh)
			this.refresh();
	},
	_onPrev:function(e)
	{
		e.type == "mousedown" ? this.scroll(false) : this.stop();
	},
	_onNext:function(e)
	{
		e.type == "mousedown" ? this.scroll(true) : this.stop();
	},
	_onItemsKeyEvent:function(e)
	{
		if(e.type == "keydown")
		{
			if(e.keyCode == 37)
				this.scroll(false);
			else
			if(e.keyCode == 39)
				this.scroll(true);
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
	scroll:function(forward, scrollType, steps, stepSize, stepRate)
	{
		if(this._scrollInfo)
			return;

		var options = this.options;
		scrollType = scrollType || options.scrollType;
		stepRate = stepRate || options.scrollStepRate;
		var stepSize = stepSize || this._calcScrollstepSize(forward, scrollType);
		this._scrollInfo = info = 
		{
			"steps": steps || -1,
			"scrollType": scrollType,
			"nFrames": (stepRate/1000) * 60,
			"curFrame": 0,
			"scrollAxis": options.scrollProps.axis,
			"startScroll": this._itemsBox.prop(options.scrollProps.axis),
			"forward": forward,
			"stepSize": stepSize,
			"animationFrameId": null
		};
		info.stepFrame = (forward) ? Math.ceil(info.stepSize/info.nFrames) : Math.floor(info.stepSize/info.nFrames);

		var fnFrame = function(info, timeStamp)
		{
			var curScroll = this._itemsBox.prop(info.scrollAxis);
			var newScroll = curScroll + info.stepFrame;
			var scrollEnd = info.startScroll + info.stepSize;
			if((forward && newScroll > scrollEnd) || (!forward && newScroll < scrollEnd))
			{
				newScroll = scrollEnd;
				info.curFrame = info.nFrames;
			}

			this._itemsBox.prop(info.scrollAxis, newScroll);
			if(!this._trigger("scroll", null, [this._itemsBox, info, this.getPageInfo()]))
				return;

			info.animationFrameId = window.requestAnimationFrame(fnFrame.bind(this, info));
			if(++info.curFrame >= info.nFrames)
			{
				this._adjustPageMarkers();
				if(info.stop || --info.steps == 0)
				{
					window.cancelAnimationFrame(info.animationFrameId)
					this._scrollInfo = null;
					this._trigger("scrollend", null, [this._itemsBox, info, this.getPageInfo()]);
				}
				else
				{
					info.stepSize = this._calcScrollstepSize(info.forward, info.scrollType);
					info.stepFrame = (forward) ? Math.ceil(info.stepSize/info.nFrames) : Math.floor(info.stepSize/info.nFrames);
					info.startScroll = this._itemsBox.prop(info.scrollAxis);
					info.curFrame = 0;
				}
			}
		};

		if(!this._trigger("beforescroll", null, [this._itemsBox, info,  this.getPageInfo()]))
			return;
		info.animationFrameId = window.requestAnimationFrame(fnFrame.bind(this, info));
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
		this._itemsBox.prop("scrollLeft", markerInfo.pageInfo.pageWidth * markerInfo.pageNo);
		this._adjustPageMarkers();
	},
	_adjustPageMarkers:function()
	{
		this._pageMarkers.empty();
		var pageInfo = this.getPageInfo();
		for(var i = 0; i < pageInfo.pages; ++i)
		{
			var pageMarker = $(sformat("<div class='{1} {2}' tabIndex='0'>", this.options.pageMarkerClass, i == pageInfo.curPage ? this.options.pageMarkerSelectedClass : ""));
			pageMarker.prop("title", "Page - " + (i + 1));
			pageMarker.data("ibxPageMarkerInfo", {"pageNo":i, "pageInfo":pageInfo}).on("click", this._onPageMarkerClick.bind(this));
			this._pageMarkers.append(pageMarker)
		}

		var options = this.options;
		var disabled = pageInfo.scrollLeft <= 0;
		this._prevBtn.ibxWidget("option", "disabled", disabled).toggleClass("csl-btn-hidden", (disabled && options.hideDisabledButtons));

		disabled = (pageInfo.scrollLeft + pageInfo.pageWidth) >= pageInfo.scrollWidth;
		this._nextBtn.ibxWidget("option", "disabled", disabled).toggleClass("csl-btn-hidden", (disabled && options.hideDisabledButtons));
	},
	_calcScrollstepSize:function(forward, scrollType)
	{
		var options = this.options;
		var delta = 0;
		if(scrollType == "fractional")
			delta = options.scrollStep;
		else
		if(scrollType == "page")
			delta =  this._itemsBox.prop(options.scrollProps.size);
		else
		if(scrollType == "integral")
		{
			var pageInfo = this.getPageInfo();
			var scrollChild = this._getScrollChild(forward);
			if(scrollChild)
			{
				props = options.scrollProps[forward ? "forward" : "backward"];
				delta = Math.abs(scrollChild[props.child] - pageInfo[props.page]);
			}
		}
		return forward ? delta : -delta;
	},
	_getScrollChild:function(forward)
	{
		var childInfo = null;
		var pageInfo = this.getPageInfo();
		var children = this.children();
		for(var i = 0; i < children.length; ++i)
		{
			var child = children[i];
			var info = GetElementInfo(child);
			if(forward && (info.right > pageInfo.scrollRight))
				childInfo = info;
			else
			if(!forward && (info.left < pageInfo.scrollLeft && info.right >= pageInfo.scrollLeft))
				childInfo = info;
			if(childInfo)
				break;
		}
		return childInfo;
	},
	getPageInfo:function(metrics)
	{
		var info = 
		{
			scrollWidth:	this._itemsBox.prop("scrollWidth"),
			scrollHeight:	this._itemsBox.prop("scrollHeight"),
			scrollLeft:		this._itemsBox.prop("scrollLeft"),
			scrollTop:		this._itemsBox.prop("scrollTop"),
			pageWidth:		this._itemsBox.prop("offsetWidth") || 1,
			pageHeight:		this._itemsBox.prop("offsetHeight") || 1,
		};
		info.pages = Math.floor(info.scrollWidth / info.pageWidth) || 1;
		info.curPage = Math.floor(info.scrollLeft / info.pageWidth);
		info.scrollRight = info.scrollLeft + info.pageWidth;
		info.scrollBottom = info.scrollTop + info.pageHeight;
		return info;
	},
	page:function(pageNo)
	{
		var info = this.getPageInfo();
		if(pageNo === undefined)
			return info.curPage;

		var pageNo = (pageNo == -1) ? info.curPage : pageNo;
		if(pageNo <= info.pages-1)
		{
			this._itemsBox.prop("scrollLeft", info.pageWidth * pageNo);
			this._adjustPageMarkers();
		}
		return this;
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

$.widget("ibi.ibxHCarousel", $.ibi.ibxCarousel,{_widgetClass:"ibx-h-carousel"});
$.widget("ibi.ibxVCarousel", $.ibi.ibxCarousel,
{
	options:
	{
		direction:"row",
		scrollProps://html props to use for calculating scroll position/delta
		{
			"axis":"scrollTop",
			"size":"offsetHeight",
			"forward":{"child":"bottom", "page":"scrollBottom"},
			"backward":{"child":"top", "page":"scrollTop"},
		},
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
				this.scroll(false);
			else
			if(e.keyCode == 40)
				this.scroll(true);
		}
		else
			this._super(e);
	},
	_onPageMarkerClick:function(e)
	{
		var pageMarker = $(e.currentTarget);
		var markerInfo = pageMarker.data("ibxPageMarkerInfo");
		this._itemsBox.prop("scrollTop", markerInfo.pageHeight * markerInfo.pageNo);
		this._adjustPageMarkers();
	},
	_adjustPageMarkers:function()
	{
		this._super();
		var pageInfo = this.getPageInfo();
		this._prevBtn.ibxWidget("option", "disabled", pageInfo.scrollTop <= 0);
		this._nextBtn.ibxWidget("option", "disabled", (pageInfo.scrollTop + pageInfo.pageHeight) >= pageInfo.scrollHeight);
	},
	_getScrollChild:function(forward)
	{
		var childInfo = null;
		var pageInfo = this.getPageInfo();
		var children = this.children();
		for(var i = 0; i < children.length; ++i)
		{
			var child = children[i];
			var info = GetElementInfo(child);
			if(forward && (info.bottom > pageInfo.scrollBottom))
				childInfo = info;
			else
			if(!forward && (info.top < pageInfo.scrollTop && info.bottom >= pageInfo.scrollTop))
				childInfo = info;
			if(childInfo)
				break;
		}
		return childInfo;
	},
	getPageInfo:function(metrics)
	{
		var info = this._super();
		info.pages = Math.floor(info.scrollHeight / info.pageHeight) || 1;
		info.curPage = Math.floor(info.scrollTop / info.pageHeight);
		return info;
	},
});

//# sourceURL=carousel.ibx.js
