/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
Simple Carousel (Kind of a placeholder for when I have more time to do a better one!)
******************************************************************************/
$.widget("ibi.ibxCarousel", $.ibi.ibxVBox, 
{
	options:
	{
		navKeyRoot:true,
		navKeyAutoFocus:true,
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
		floatButtons:false,
		hideDisabledButtons:false,
		alignChildren:"center",
		sizeToFit:false,	//sizes each child to fit exactly one page.

		scrollType:"integral",											//page/integral/fractional
		scrollStep:{"page":1, "integral":1, "fractional":25},			//units of type to scroll
		scrollStepRate:{"page":300, "integral":250, "fractional":25},	//time per scroll unit (ms)
		scrollProps:
		{
			"axis":"scrollLeft",
			"size":"offsetWidth",
			"pageSize":"pageWidth",
			"forward":{"child":"right", "page":"scrollRight"},
			"backward":{"child":"left", "page":"scrollLeft"},
		},//html props to use for calculating scroll position/delta
		allowDragScrolling:true,

		aria:
		{
			role:"listbox"
		}
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
		this.remove(this.children());
		this._super();
	},
	children:function(selector)
	{
		selector = selector || ".ibx-csl-item";
		return this._itemsBox.ibxWidget("children", selector);
	},
	add:function(el, sibling, before, refresh)
	{
		el = $(el);
		el.addClass("ibx-csl-item").prop("tabIndex", -1).attr("role", "listitem");
		
		this._itemsBox.ibxWidget("add", el, sibling, before, refresh);
		if(refresh)
			this.refresh();
	},
	remove:function(el, destroy, refresh)
	{
		var children = (!el || typeof(el) === "string") ? this.children(el) : $(el);
		children.removeClass("ibx-csl-item");
		this._itemsBox.ibxWidget("remove", children, destroy, refresh);
		if(refresh)
			this.refresh();
	},
	_onPrev:function(e)
	{
		e.type == "mousedown" ? this.scroll(-Infinity) : this.stop();
	},
	_onNext:function(e)
	{
		e.type == "mousedown" ? this.scroll(Infinity) : this.stop();
	},
	_onItemsKeyEvent:function(e)
	{
		if(e.type == "keydown")
		{
			if(e.keyCode == 37)
				this.scroll(-Infinity);
			else
			if(e.keyCode == 39)
				this.scroll(Infinity);
		}
		else
			this.stop();
	},
	_onResize:function()
	{
		if(this.options.sizeToFit)
		{
			var options = this.options;
			var pageInfo = this.getPageInfo();
			var children = this.children();
			children.each(function(idx, child)
			{
				child = $(child);
				child.css({"width":pageInfo.pageWidth + "px", "height":pageInfo.pageHeight + "px"});
			}.bind(this));
			var curPage = this._pageMarkers.ibxWidget("children", "." + options.pageMarkerSelectedClass).data("ibxPageMarkerInfo");
			curPage = curPage ? curPage.pageNo : 9999;
			this._itemsBox.prop(options.scrollProps.axis, curPage * pageInfo[options.scrollProps.pageSize]);
		}
		this._adjustPageMarkers();
	},
	_onItemsBoxScroll:function(e)
	{
		this._adjustPageMarkers();
	},
	_scrollInfo:null,
	scroll:function(steps, scrollType, stepRate, jumpScroll)
	{
		if(this._scrollInfo || !steps)
			return;

		//use defaults if no value specified
		var options = this.options;
		scrollType = (scrollType !== undefined) ? scrollType : options.scrollType;
		steps = (steps !== undefined) ? steps : options.scrollStep[scrollType];
		stepRate = (stepRate !== undefined) ? stepRate : this.options.scrollStepRate[scrollType];

		var options = this.options;
		this._scrollInfo = info = 
		{
			"forward": (steps >= 0),
			"scrollType": scrollType || options.scrollType,
			"steps": Math.abs(steps),
			"nFrames": Math.ceil((stepRate/1000) * 60),
			"curFrame": 0,
			"scrollAxis": options.scrollProps.axis,
			"animationFrameId": null
		};
		info.stepSize = this._calcScrollStepSize(info.scrollType, info.forward);
		info.scrollEndPos = this._itemsBox.prop(info.scrollAxis) + info.stepSize;
		info.frameDelta = info.forward ? Math.ceil(info.stepSize/info.nFrames) : Math.floor(info.stepSize/info.nFrames);

		//do the all steps in one jump
		if(jumpScroll)
		{
			info.stepSize = info.stepSize * info.steps;
			info.scrollEndPos = this._itemsBox.prop(info.scrollAxis) + info.stepSize;
			info.frameDelta = info.forward ? Math.ceil(info.stepSize/info.nFrames) : Math.floor(info.stepSize/info.nFrames);
			info.steps = 1;
		}

		var fnFrame = function(info, timeStamp)
		{
			var newScroll = this._itemsBox.prop(info.scrollAxis) + info.frameDelta;
			if((info.forward && newScroll >= info.scrollEndPos) || (!info.forward && newScroll <= info.scrollEndPos))
			{
				newScroll = info.scrollEndPos;
				info.curFrame = info.nFrames;
			}

			this._itemsBox.prop(info.scrollAxis, newScroll);
			if(!this._trigger("scroll", null, [this._itemsBox, info, this.getPageInfo()]))
				return;

			info.animationFrameId = window.requestAnimationFrame(fnFrame.bind(this, info));
			if(++info.curFrame >= info.nFrames)
			{
				this._adjustPageMarkers();
				if(info.stop || --info.steps <= 0)
				{
					window.cancelAnimationFrame(info.animationFrameId)
					this._scrollInfo = null;
					this._trigger("scrollend", null, [this._itemsBox, info, this.getPageInfo()]);
				}
				else
				{
					info.stepSize = this._calcScrollStepSize(info.scrollType, info.forward);
					info.scrollEndPos = newScroll + info.stepSize;
					info.frameDelta = info.forward ? Math.ceil(info.stepSize/info.nFrames) : Math.floor(info.stepSize/info.nFrames);
					info.curFrame = 0;
				}
			}
		};

		if(!this._trigger("beforescroll", null, [this._itemsBox, info,  this.getPageInfo()]))
			return;
		info.animationFrameId = window.requestAnimationFrame(fnFrame.bind(this, info));
	},
	_calcScrollStepSize:function(scrollType, forward)
	{
		var options = this.options;
		var delta = 0;
		if(scrollType == "fractional")
			delta = options.scrollStep[scrollType];
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
				var props = options.scrollProps[(forward) ? "forward" : "backward"];
				delta = Math.abs(scrollChild[props.child] - pageInfo[props.page]);
			}
		}
		return forward ? delta : -delta;
	},
	stop:function()
	{
		if(this._scrollInfo)
			this._scrollInfo.stop = true;
	},
	page:function(pageNo, stepRate)
	{
		var info = this.getPageInfo();
		if(pageNo === undefined)
			return info.curPage;

		var pages = (pageNo - info.curPage);
		this.scroll(pages, "page", stepRate, true);
	},
	_onPageMarkerClick:function(e)
	{
		var markerInfo = $(e.currentTarget).data("ibxPageMarkerInfo");
		this.page(markerInfo.pageNo);
	},
	_onPageMarkerKeyDown:function(e)
	{
		if(e.keyCode == $.ui.keyCode.ENTER || e.keyCode == $.ui.keyCode.SPACE)
		{		
			var markerInfo = $(e.target).data("ibxPageMarkerInfo");
			this.page(markerInfo.pageNo);
			e.target.focus();
		}
	},
	_adjustPageMarkers:function()
	{
		this._pageMarkers.empty();
		var pageInfo = this.getPageInfo();
		for(var i = 0; i < pageInfo.pages; ++i)
		{
			var pageMarker = $(sformat("<div role='radio' class='{1} {2}' tabIndex='-1'>", this.options.pageMarkerClass, i == pageInfo.curPage ? this.options.pageMarkerSelectedClass : ""));
			pageMarker.prop("title", "Page " + (i + 1));
			pageMarker.data("ibxPageMarkerInfo", {"pageNo":i, "pageInfo":pageInfo}).on("click", this._onPageMarkerClick.bind(this)).on("keydown", this._onPageMarkerKeyDown.bind(this));
			this._pageMarkers.append(pageMarker)
		}

		var options = this.options;
		var disabled = pageInfo.scrollLeft <= 0;
		this._prevBtn.ibxWidget("option", "disabled", disabled).toggleClass("csl-btn-hidden", (disabled && options.hideDisabledButtons));

		disabled = (pageInfo.scrollLeft + pageInfo.pageWidth) >= pageInfo.scrollWidth;
		this._nextBtn.ibxWidget("option", "disabled", disabled).toggleClass("csl-btn-hidden", (disabled && options.hideDisabledButtons));
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
		info.pages = Math.round(info.scrollWidth / info.pageWidth) || 1;
		info.curPage = Math.round(info.scrollLeft / info.pageWidth);
		info.scrollRight = info.scrollLeft + info.pageWidth;
		info.scrollBottom = info.scrollTop + info.pageHeight;
		return info;
	},
	option:function(key, value)
	{
		this._needsLayout = (key == "prevNextButtonPos" || key == "floatButtons" && value != this.options[key]);
		return this._superApply(arguments);
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		this._itemsBox.ibxDragScrolling("option", "disabled", !options.allowDragScrolling);
		this._itemsBox.ibxWidget("option", "align", options.alignChildren);
		this._prevBtn.css("display", options.showPrevButton ? "" : "none");
		this._nextBtn.css("display", options.showNextButton ? "" : "none");

		//floated buttons force position to either end of the carousel
		this._prevBtn.toggleClass("csl-btn-float", options.floatButtons);	
		this._nextBtn.toggleClass("csl-btn-float", options.floatButtons);	
		if(options.floatButtons)
			options.prevNextButtonPos = "ends";

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

		//size to fit needs to adjust all elements for the current items box size...it'll adjust the page markers.
		if(options.sizeToFit)
			this._onResize()
		else
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
			"pageSize":"pageHeight",
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
		var markerInfo = $(e.currentTarget).data("ibxPageMarkerInfo");
		this.page(markerInfo.pageNo);
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
		info.pages = Math.round(info.scrollHeight / info.pageHeight) || 1;
		info.curPage = Math.round(info.scrollTop / info.pageHeight);
		return info;
	},
});

//# sourceURL=carousel.ibx.js
