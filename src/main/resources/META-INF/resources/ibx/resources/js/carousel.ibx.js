/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.120 $:

/******************************************************************************
Simple Carousel (Kind of a placeholder for when I have more time to do a better one!)
******************************************************************************/
$.widget("ibi.ibxCarousel", $.ibi.ibxVBox, 
{
	options:
	{
		wantResize:true,
		nameRoot:true,
		focusDefault:true,
		align:"stretch",
		allowDragScrolling:true,
		showPageMarkers:true,
		showSinglePageMarker:false,
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

		scrollType:"integral",													//page/integral/fractional
		scrollTime:{"page":250, "integral":250, "fractional":50, "jump":50},	//time per scroll unit (ms)
		scrollProps://html props to use for calculating scroll position/delta
		{
			"axis":"scrollLeft",
			"size":"offsetWidth",
			"pageSize":"pageWidth",
			"scrollSize":"scrollWidth",
			"fractionalStepSize":25,
			"forward":{"child":"right", "page":"scrollRight"},
			"backward":{"child":"left", "page":"scrollLeft"},
		},

		aria:
		{
			role:"region",
			label: ibx.resourceMgr.getString("IBX_CAROUSEL")
		}
	},
	_widgetClass:"ibx-carousel",
	_create:function()
	{
		this._super();
		var children = this.element.children();
		this._loadWidgetTemplate(".ibx-carousel-template");
		this.add(children);

		this.element.data("ibiIbxCarousel", this).on("ibx_resize", this._onResize.bind(this));
		this._prevBtn.on("click mousedown mouseup mouseleave", this._onPrevNext.bind(this));
		this._nextBtn.on("click mousedown mouseup mouseleave", this._onPrevNext.bind(this));
		this._itemsBox.on("ibx_widgetfocus", this._onItemsBoxFocus.bind(this)).on("keydown", this._onItemsBoxKeyDown.bind(this)).ibxDragScrolling({overflowY:"hidden"}).on("scroll", this._onItemsBoxScroll.bind(this));	
	},
	_setAccessibility:function(accessible, aria)
	{
		this._super(accessible, aria);
		var options = this.options;

		this._itemsBox.ibxWidget("option", "aria", {"role":"list", "label":ibx.resourceMgr.getString("IBX_CAROUSEL_ITEMS")}).ibxWidget("setAccessibility", this.options.aria.accessible);
		this._pageMarkers.ibxWidget("option", "aria", {"role":"radiogroup", "label":ibx.resourceMgr.getString("IBX_CAROUSEL_PAGES")}).ibxWidget("setAccessibility", this.options.aria.accessible);
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
	add:function(el, sibling, before, refresh)
	{
		el = $(el);
		el.ibxAddClass("ibx-csl-item").prop("tabIndex", -1).attr("role", "listitem");
		
		this._itemsBox.ibxWidget("add", el, sibling, before, refresh);
		if(refresh)
			this.refresh();
	},
	remove:function(el, destroy, refresh)
	{
		var children = this.children().filter(el || ".ibx-csl-item").ibxRemoveClass("ibx-csl-item");
		this._itemsBox.ibxWidget("remove", children, destroy, refresh);
		if(refresh)
			this.refresh();
	},
	_onResize:function()
	{
		if(this.options.sizeToFit)
		{
			var options = this.options;
			this._itemsBox.ibxAddClass("ibx-csl-calc-size"); //children must be hidden to correctly determine the items box size
			var pageInfo = this.getPageInfo();
			this._itemsBox.ibxRemoveClass("ibx-csl-calc-size"); //restore the children now that the bounds have been retrieved.
			var children = this.children();
			children.each(function(idx, child)
			{
				child = $(child);
				child.css({"margin":"0px", "width":pageInfo.pageWidth + "px", "height":pageInfo.pageHeight + "px"});
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
		this.scroll(pages, "page", this.options.scrollTime.jump);
	},
	_stopScrolling:false,
	scrolling:function(){return this.element.hasClass("ibx-csl-scrolling")},
	scroll:function(steps, scrollType, scrollTime)
	{
		this._itemsBox.clearQueue().stop()
		this._stopScrolling = false;

		var options = this.options;
		var infinite = (steps !== undefined) && !isFinite(steps);
		var forward = (steps >= 0);
		var scrollType = (scrollType !== undefined) ? scrollType : options.scrollType;
		var scrollInfo = 
		{
			"axis": options.scrollProps.axis,
			"forward":forward,
			"scrollType": scrollType,
			"scrollTime": (scrollTime !== undefined) ? scrollTime : this.options.scrollTime[scrollType],
			"steps": (steps !== undefined) ? steps : 1,
			"infinite":infinite,
			"animationProperties":{},
			"animationOptions":{"easing":"linear"}
		};
		scrollInfo.delta = this._calcScrollDelta(scrollInfo.steps, scrollInfo.scrollType);
		scrollInfo.endPos = this._itemsBox.prop(scrollInfo.axis) + scrollInfo.delta;
		scrollInfo.pageInfo = this.getPageInfo();
		scrollInfo.animationProperties[scrollInfo.axis] = scrollInfo.endPos;
		scrollInfo.animationOptions.duration = scrollInfo.scrollTime;

		var evt = this.element.dispatchEvent("ibx_beforescroll", scrollInfo, false, true);
		if(!evt.isDefaultPrevented())
		{
			scrollInfo.animationOptions = $.extend(
			{
				"start":function(scrollInfo, animation)
				{
				}.bind(this, scrollInfo),
				"progress":function(scrollInfo, animation, progress, remainingMs)
				{
					this.element.ibxAddClass("ibx-csl-scrolling")
				}.bind(this, scrollInfo),
				"done":function(scrollInfo, animation, jumpToEnd)
				{
					if(scrollInfo.infinite && !this._stopScrolling)
						this.scroll(scrollInfo.steps, scrollInfo.scrollType, scrollInfo.scrollTime);
					else
					{
						//emit the endscroll message after a short delay, so the screen will be updated.
						scrollInfo.pageInfo = this.getPageInfo();
						window.setTimeout(function(scrollInfo){
							this.element.dispatchEvent("ibx_endscroll", scrollInfo, false, false);
						}.bind(this, scrollInfo), 25);
					}
					this.element.ibxRemoveClass("ibx-csl-scrolling");
				}.bind(this, scrollInfo),
			}, evt.data.animationOptions);
			this._itemsBox.animate(scrollInfo.animationProperties, scrollInfo.animationOptions);
		}
	},
	scrollTo:function(el)
	{
		el = this.children().filter(el);
		var options = this.options;
		var pageInfo = this.getPageInfo();
		var metrics = el.metrics();
		var steps = 0;
		
		if(pageInfo.scrollRight < metrics.marginBox.right)
			steps = metrics.marginBox.right - pageInfo.scrollRight; 
		else
		if(pageInfo.scrollLeft > metrics.marginBox.left)
			steps = metrics.marginBox.left - pageInfo.scrollLeft;

		//We need to set the size here because when fractional scrolling is no we want to make the step size
		//bigger (25) so the control scrolls faster.  Here we need an exact 1px step for accuracy.
		var curSize = options.scrollProps.fractionalStepSize;
		options.scrollProps.fractionalStepSize = 1;
		this.scroll(steps, "fractional", options.scrollTime.jump);
		options.scrollProps.fractionalStepSize = curSize; //reset to default fractional size.
	},
	_calcScrollDelta:function(steps, scrollType)
	{
		var options = this.options;
		var delta = 0;
		steps = isFinite(steps) ? steps : (steps >= 0) ? 1 : -1;

		if(scrollType == "fractional")
			delta = steps * options.scrollProps.fractionalStepSize;
		else
		if(scrollType == "page")
			delta =  steps * this._itemsBox.prop(options.scrollProps.size);
		else
		if(scrollType == "integral")
		{
			var forward = (steps >= 0);
			var pageInfo = this.getPageInfo();
			var scrollChild = this.getScrollChild(forward);
			if(scrollChild)
			{
				var props = options.scrollProps[forward ? "forward" : "backward"];
				delta = scrollChild[props.child] - pageInfo[props.page];
			}
		}
		return delta;
	},
	getSelectionManager:function()
	{
		var sm = this._itemsBox.ibxSelectionManager("instance");
		return sm;
	},
	_onItemsBoxScroll:function(e)
	{
		this._adjustPageMarkers();
		var evt = this.element.dispatchEvent("ibx_carouselscroll", this.getPageInfo(), false, true, this._itemsBox); 
	},
	_onItemsBoxFocus:function(e)
	{
		/*COMMENTED OUT FOR NOW BECAUSE IT NEVER QUITE WORKED RIGHT!
		//the idea was that if nothing was focused, then when the items box is focused
		//automatically focus the first item visible in the carousel's viewport.
		//don't do the focusing if selected item is already a child.
		if($(e.target).ibxSelectionManager("active"))
		{
			var oEvent = e.originalEvent.data;
			if(!$.contains(e.target, oEvent.target))
			{
				//if the current active item is not in the viewport, then focus the first child that is.
				var visChildren = this.children(":inViewport()");
				if(!visChildren.filter(".ibx-nav-key-item-active").length)
					visChildren.first().focus();
			}
		}
		*/
	},
	_onItemsBoxKeyDown:function(e)
	{
		var options = this.options;
		if(eventMatchesShortcut(options.pagePrev, e))
			this.page(-1, null, true);
		else
		if(eventMatchesShortcut(options.pageNext, e))
			this.page(1, null, true);
	},
	_onPrevNext:function(e)
	{
		var forward = this._nextBtn.is(e.target) ? true : false;
		if(e.type == "mousedown")
			this.scroll(forward ? Infinity : -Infinity)
		else
		if(e.type == "click" && !this.scrolling())
			this.scroll(forward ? 1 : -1)
		else
		if(e.type == "mouseup" || e.type == "mouseleave")
			this._stopScrolling = true;
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
		this._pageMarkers.offsetHeight;

		//[IBX-537] focus the page marker after jumping to page.
		this.element.on('ibx_endscroll', function(pageNo, e){
			this.element.off('ibx_endscroll');
			var page = this._pageMarkers.find(':nth-child(' + (pageNo) + ')');
			page.focus();
		}.bind(this, ++markerInfo.pageNo));
	},
	_adjustPageMarkers:function()
	{
		this._pageMarkers.empty();
		var pageInfo = this.getPageInfo();
		for(var i = 0; i < pageInfo.pages; ++i)
		{
			var isCurPage = (i == pageInfo.curPage);
			var pageMarker = $(sformat("<div class='{1} {2}' tabIndex='-1'>", this.options.pageMarkerClass, isCurPage ? this.options.pageMarkerSelectedClass : ""));
			pageMarker.prop("title", sformat(ibx.resourceMgr.getString("IBX_CAROUSEL_PAGE"), i+1, pageInfo.pages));
			pageMarker.data("ibxPageMarkerInfo", {"pageNo":i, "pageInfo":pageInfo}).on("click", this._onPageMarkerClick.bind(this)).on("keyup", this._onPageMarkerKeyEvent.bind(this));

			if(this.options.aria.accessible)
				pageMarker.attr({"role":"radio", "aria-checked": isCurPage})
			this._pageMarkers.append(pageMarker)
		}

		this._pageMarkers.css("visibility", (!this.options.showSinglePageMarker && pageInfo.pages <= 1) ? "hidden" : ""); 

		var options = this.options;
		var disabled = pageInfo[options.scrollProps.axis] <= 0;
		this._prevBtn.ibxWidget("option", "disabled", disabled).ibxToggleClass("csl-btn-hidden", (disabled && options.hideDisabledButtons));

		disabled = (pageInfo[options.scrollProps.axis] + pageInfo[options.scrollProps.pageSize]) >= pageInfo[options.scrollProps.scrollSize];
		this._nextBtn.ibxWidget("option", "disabled", disabled).ibxToggleClass("csl-btn-hidden", (disabled && options.hideDisabledButtons));
	},
	getScrollChild:function(forward) 
	{ 
		 var childBox = null; 
		 var pageInfo = this.getPageInfo(); 
		 var children = this.children(); 
		 for(var i = 0; i < children.length; ++i) 
		 { 
			var child = $(children[i]);
			var box = child.metrics().marginBox; 
			if(box)
			{
				if((forward === true) && (Math.floor(box.right) > pageInfo.scrollRight)) 
					childBox = box; 
				else 
				if((forward === false) && (Math.floor(box.left) >= pageInfo.scrollLeft) && child.prev().length) 
					childBox = child.prev().metrics().marginBox; 

				if(childBox) 
				{
					childBox.child = child[0];
					childBox.nChildren = children.length;
					childBox.idx = i;
					break;
				}
			}
		 } 
		 return childBox; 
	},  
	getPageInfo:function()
	{
		var props = this.options.scrollProps;
		var info = 
		{
			scrollWidth:	this._itemsBox.prop("scrollWidth"),
			scrollHeight:	this._itemsBox.prop("scrollHeight"),
			scrollLeft:		this._itemsBox.prop("scrollLeft"),
			scrollTop:		this._itemsBox.prop("scrollTop"),
			pageWidth:		this._itemsBox.prop("offsetWidth") || 1,
			pageHeight:		this._itemsBox.prop("offsetHeight") || 1,
		};

		info.pageWidth = this._itemsBox.prop("offsetWidth") || 1;
		info.pageHeight = this._itemsBox.prop("offsetHeight") || 1;
		
		info.pages = Math.round(info[props.scrollSize] / info[props.pageSize]) || 1;
		info.curPage = Math.round(info[props.axis] / info[props.pageSize]);
		info.scrollRight = info.scrollLeft + info.pageWidth;
		info.scrollBottom = info.scrollTop + info.pageHeight;
		return info;
	},
	option:function(key, value, refresh)
	{
		this._needsLayout = (key == "prevNextButtonPos" || key == "floatButtons" && value != this.options[key]);
		if(key == "sizeToFit" && !value)
			this.children().css({"margin":"", "width":"", "height":""});
		return this._superApply(arguments);
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		
		//set various options for the items box...along with how selections work.
		this._itemsBox.ibxDragScrolling("option", {"disabled":!options.allowDragScrolling, "overflowX":"auto", "overflowY":"hidden"});
		this._itemsBox.ibxWidget("option", "align", options.alignChildren);
		this.getSelectionManager().option("type", options.selType);

		this._prevBtn.css("display", options.showPrevButton ? "" : "none");
		this._nextBtn.css("display", options.showNextButton ? "" : "none");

		//floated buttons force position to either end of the carousel
		this._prevBtn.ibxToggleClass("csl-btn-float", options.floatButtons);	
		this._nextBtn.ibxToggleClass("csl-btn-float", options.floatButtons);	
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
			"scrollSize":"scrollHeight",
			"fractionalSize":25,
			"forward":{"child":"bottom", "page":"scrollBottom"},
			"backward":{"child":"top", "page":"scrollTop"},
		},
	},
	_widgetClass:"ibx-v-carousel",
	_create:function()
	{
		this._super();
		this._itemsContainer.ibxWidget("option", "direction", "column");
		this._itemsBox.ibxWidget("option", {"navKeyDir":"vertical", "direction":"column"});
		this._pageMarkers.ibxWidget("option", "direction", "column");
		this._prevBtn.ibxWidget("option", {"iconPosition": "top"});
		this._nextBtn.ibxWidget("option", {"iconPosition": "top"});
	},
	getScrollChild:function(forward)
	{
		var childBox = null;
		var pageInfo = this.getPageInfo();
		var children = this.children();
		for(var i = 0; i < children.length; ++i)
		{
			var child = $(children[i]);
			var box = child.metrics().borderBox; 
			if(box)
			{
				if((forward === true) && (Math.floor(box.bottom) > pageInfo.scrollBottom)) 
					childBox = box; 
				else 
				if((forward === false) && (Math.floor(box.top) >= pageInfo.scrollTop) && child.prev().length) 
					childBox = child.prev().metrics().marginBox; 

				if(childBox) 
				{
					childBox.child = child[0];
					childBox.nChildren = children.length;
					childBox.idx = i;
					break;
				}
			}
		}
		return childBox;
	},
	_refresh:function()
	{
		this._super();
		this._itemsBox.ibxDragScrolling("option", {"overflowX":"hidden", "overflowY":"auto"});
	}
});

//# sourceURL=carousel.ibx.js
