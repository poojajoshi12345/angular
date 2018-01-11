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
		pagePrev:"SHIFT+LEFT",
		pageNext:"SHIFT+RIGHT",
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

		navKeyRoot:true,
		navKeyAutoFocus:true,
		navKeyKeys:
		{
			"hprev":"CTRL+LEFT",
			"hnext":"CTRL+RIGHT",
			"vprev":"CTRL+UP",
			"vnext":"CTRL+DOWN",
		},


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
		this.element.on("ibx_resize", this._onResize.bind(this));
		this._prevBtn.on("click mousedown mouseup mouseleave", this._onPrevNext.bind(this));
		this._nextBtn.on("click mousedown mouseup mouseleave", this._onPrevNext.bind(this));
		this._itemsBox.on("ibx_widgetfocus", this._onItemsBoxFocus.bind(this)).on("keydown", this._onItemsBoxKeyDown.bind(this)).ibxDragScrolling({overflowY:"hidden"}).on("scroll", this._onItemsBoxScroll.bind(this));	
		this.add(children);

		this._onPageMarkerScrollEndBound = this._onPageMarkerScrollEnd.bind(this);
	},
	_setAccessibility:function(accessible, aria)
	{
		this._super(accessible, aria);
		this._itemsBox.ibxWidget("option", "aria", {"role":"listbox", "label":ibx.resourceMgr.getString("IBX_CAROUSEL_ITEMS")}).ibxWidget("setAccessibility", this.options.aria.accessible);
		this._pageMarkers.ibxWidget("option", "aria", {"role":"listbox", "label":ibx.resourceMgr.getString("IBX_CAROUSEL_PAGES")}).ibxWidget("setAccessibility", this.options.aria.accessible);
		return aria;
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
	navKeyChildren:function(selector)
	{
		//return the specific high level elements of the carousel, but only the ones that can be focused.
		var ret = $([this._prevBtn[0], this._itemsBox[0], this._nextBtn[0], this._pageMarkers[0]]);
		return ret.filter(selector || ":ibxNavFocusable()");
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
	page:function(pageNo, stepRate, relative)
	{
		var info = this.getPageInfo();
		if(pageNo === undefined)
			return info.curPage;

		var pages = relative ? pageNo : (pageNo - info.curPage);
		this.scroll(pages, "page", stepRate, true);
	},
	stop:function()
	{
		if(this._scrollInfo)
			this._scrollInfo.stop = true;
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
			"scrollType": scrollType,
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
			info.frameDelta = info.forward ? Math.ceil(info.stepSize) : Math.floor(info.stepSize);
			info.steps = info.nFrames = 1;
		}

		var fnFrame = function(info, timeStamp)
		{
			var newScroll = this._itemsBox.prop(info.scrollAxis) + info.frameDelta;
			if(this._scrollInfo.stop || (info.forward && newScroll >= info.scrollEndPos) || (!info.forward && newScroll <= info.scrollEndPos))
			{
				newScroll = info.scrollEndPos;
				info.curFrame = info.nFrames;
			}
			this._itemsBox.prop(info.scrollAxis, newScroll);

			info.animationFrameId = window.requestAnimationFrame(fnFrame.bind(this, info));
			if(++info.curFrame >= info.nFrames)
			{
				if(info.stop || --info.steps <= 0)
				{
					//we done...stop scrolling...let world know.
					window.cancelAnimationFrame(info.animationFrameId)
					this._scrollInfo = null;
					window.setTimeout(function()
					{
						this._trigger("carouselscrollend", null, [this._itemsBox, info, this.getPageInfo()]);
					}.bind(this), 20);
					return;
				}
				else
				{
					info.stepSize = this._calcScrollStepSize(info.scrollType, info.forward);
					info.scrollEndPos = newScroll + info.stepSize;
					info.frameDelta = info.forward ? Math.ceil(info.stepSize/info.nFrames) : Math.floor(info.stepSize/info.nFrames);
					info.curFrame = 0;
				}
			}
		}.bind(this, info);

		if(!this._trigger("beforescarouselcroll", null, [this._itemsBox, info,  this.getPageInfo()]))
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
			var scrollChild = this.getScrollChild(forward);
			if(scrollChild)
			{
				var props = options.scrollProps[(forward) ? "forward" : "backward"];
				delta = Math.abs(scrollChild[props.child] - pageInfo[props.page]);
			}
		}
		return forward ? delta : -delta;
	},
	_onItemsBoxScroll:function(e)
	{
		this._adjustPageMarkers();
		var evt = this.element.dispatchEvent("ibx_carouselscroll", [this._scrollInfo, this.getPageInfo()], false, true, this._itemsBox); 
		if(evt.defaultPrevented && this._scrollInfo)
			this._scrollInfo.stop = true;
	},
	_onItemsBoxFocus:function(e)
	{
		//don't do the focusing if selected item is already a child.
		if($(e.target).ibxWidget("navKeyActive"))
		{
			var oEvent = e.originalEvent.data;
			if(!$.contains(e.target, oEvent.target))
			{
				//if the current active item is not in the viewport, then focus the first child that is.
				var visChildren = this.children(":inViewport(true)");
				if(!visChildren.filter(".ibx-nav-item-active").length)
					visChildren.first().focus();
			}
		}
	},
	_onItemsBoxKeyDown:function(e)
	{
		var options = this.options;
		if(eventMatchesCommand(options.pagePrev, e))
			this.page(-1, null, true);
		else
		if(eventMatchesCommand(options.pageNext, e))
			this.page(1, null, true);
	},
	_onPrevNext:function(e)
	{
		var forward = this._nextBtn.is(e.target) ? true : false;
		if(e.type == "mousedown")
			this.scroll(forward ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY)
		else
		if(e.type == "mouseup" || e.type == "mouseleave")
			this.stop();
		else
		if(e.type == "click")
			this.scroll(forward ? 1 : -1);
	},
	_onPageMarkerKeyEvent:function(e)
	{
		if(e.keyCode == $.ui.keyCode.ENTER || e.keyCode == $.ui.keyCode.SPACE)
			$(e.target).trigger("click");
	},
	_onPageMarkerClick:function(e)
	{
		var markerInfo = $(e.currentTarget).data("ibxPageMarkerInfo");
		this.page(markerInfo.pageNo);
		this.element.on("ibx_carouselscrollend", this._onPageMarkerScrollEndBound);
	},
	_onPageMarkerScrollEnd:function(e)
	{
		this._pageMarkers.find("."+this.options.pageMarkerSelectedClass).focus()
		this.element.off("ibx_carouselscrollend", this._onPageMarkerScrollEndBound);
	},
	_adjustPageMarkers:function()
	{
		this._pageMarkers.empty();
		var pageInfo = this.getPageInfo();
		for(var i = 0; i < pageInfo.pages; ++i)
		{
			var isCurPage = (i == pageInfo.curPage);
			var pageMarker = $(sformat("<div role='option' class='{1} {2}' tabIndex='-1'>", this.options.pageMarkerClass, isCurPage ? this.options.pageMarkerSelectedClass : ""));
			pageMarker.prop("title", sformat("{1} {2}", ibx.resourceMgr.getString("IBX_CAROUSEL_PAGE"), i+1));
			pageMarker.data("ibxPageMarkerInfo", {"pageNo":i, "pageInfo":pageInfo}).on("click", this._onPageMarkerClick.bind(this)).on("keyup", this._onPageMarkerKeyEvent.bind(this));

			if(this.options.aria.accessible)
				pageMarker.attr({"role":"option", "aria-checked": isCurPage})
			this._pageMarkers.append(pageMarker)
		}

		var options = this.options;
		var disabled = pageInfo.scrollLeft <= 0;
		this._prevBtn.ibxWidget("option", "disabled", disabled).toggleClass("csl-btn-hidden", (disabled && options.hideDisabledButtons));

		disabled = (pageInfo.scrollLeft + pageInfo.pageWidth) >= pageInfo.scrollWidth;
		this._nextBtn.ibxWidget("option", "disabled", disabled).toggleClass("csl-btn-hidden", (disabled && options.hideDisabledButtons));
	},
	getScrollChild:function(forward)
	{
		var childInfo = null;
		var pageInfo = this.getPageInfo();
		var children = this.children();
		for(var i = 0; i < children.length; ++i)
		{
			var child = children[i];
			var info = GetElementInfo(child);
			if((forward === true) && (info.right > pageInfo.scrollRight))
				childInfo = info;
			else
			if((forward === false) && info.left >= pageInfo.scrollLeft)
				childInfo = GetElementInfo(child.previousSibling);

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
		navKeyDir:"vertical",
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
		this._itemsBox.ibxWidget("option", {"navKeyDir":"vertical", "direction":"column"}).ibxDragScrolling({overflowX:"hidden", overflowY:"auto"});
		this._pageMarkers.ibxWidget("option", "direction", "column");
		this._prevBtn.ibxWidget("option", {"iconPosition": "top"});
		this._nextBtn.ibxWidget("option", {"iconPosition": "top"});
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
	getScrollChild:function(forward)
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
			if((forward === false) && info.bottom >= pageInfo.scrollTop)
				childInfo = GetElementInfo(child.previousSibling);

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
