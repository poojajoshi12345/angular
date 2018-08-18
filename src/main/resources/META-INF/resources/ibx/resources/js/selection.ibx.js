/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxSelectionManager", $.Widget, 
{
	options:
	{
		"type":"none",						//none - no selection, nav - navigation only, single - single selection, multi - multiple selection
		"toggleSelection":true,				//clicking on an item will select/deselect.
		"escClearSelection":true,			//clear the selection on the escape key
		"focusRoot":false,					//keep focus circular within this element
		"focusDefault":false,				//focus the first item in root. (can be a select pattern).
		"focusResetOnBlur":true,			//when widget loses focus, reset the current active navKey child.
		"navKeyRoot":false,					//arrow keys will move you circularly through the items.
		"navKeyDir":"both",					//horizontal = left/right, vertical = up/down, or both
		"rubberBand":false,					//selection by rubberband
		"rubberBandPartialSelect":false		//rubberband must fully enclose the item for selection
	},
	_widgetClass:"ibx-selection-manager",
	_create:function()
	{
		this._super();
		$.extend(true, this.options, ibx.getIbxMarkupOptions(this.element));//we aren't an ibxWidget, so get the markup options.
		this.option(this.options);//force initial update.

		this.element.addClass(this._widgetClass);
		this.element.data("ibiIbxSelectionManager", this);//plymorphism
		this.element[0].addEventListener("focusin", this._onFocusIn.bind(this), true);
		this.element[0].addEventListener("focusout", this._onFocusOut.bind(this), true);
		this.element[0].addEventListener("mousedown", this._onMouseDown.bind(this), false);
		this.element[0].addEventListener("keydown", this._onKeyDown.bind(this), false);
		this.element[0].addEventListener("ibx_rubberbandchange", this._onRubberBandEvent.bind(this), false);

	},
	_destroy:function()
	{
		this._super();
	},
	_onFocusIn:function(e)
	{
		var options = this.options;
		var isTarget = this.element.is(e.target);
		var ownsTarget = $.contains(this.element[0], e.target);
		var ownsRelTarget = $.contains(this.element[0], e.relatedTarget);

		//make sure the manager is in the focused state.
		this._activate(true);

		//do the default focusing when manager is directly focused (not one of its children).
		if(isTarget && !ownsRelTarget && options.focusDefault !== false)
		{
			var defItem = this._focus();
			if(!defItem)
			{
				var defItem = this.element.find(options.focusDefault);
				defItem = defItem.length ? defItem : this.selectableChildren().first();
			}
			$(defItem).focus();
			return;
		}

		//focus the selected item
		if(!isTarget && ownsTarget)
			this._focus(e.target, true);
	},
	_onFocusOut:function(e)
	{
		//make sure the manager is in the blurred stated when some external element is focused.
		var isTarget = this.element.is(e.target);
		var ownsRelTarget = $.contains(this.element[0], e.relatedTarget);
		
		if(!isTarget && !ownsRelTarget)
			this._activate(false);
	},
	_onKeyDown:function(e)
	{
		var options = this.options;
		if(!options.focusRoot && !options.navKeyRoot)
			return;

		//manage circular tabbing if desired.
		if(options.focusRoot && e.keyCode == $.ui.keyCode.TAB)
		{
			var focusKids = this.element.logicalChildren(".ibx-sm-focus-root", ":ibxFocusable");
			var target = null;
			var firstKid = focusKids.first();
			var lastKid = focusKids.last();

			if(firstKid.length && lastKid.length)
			{
				var mappedTarget = this.mapToSelectable(e.target);
				if((firstKid.is(mappedTarget) || $.contains(firstKid[0], mappedTarget)) && e.shiftKey)
					target = focusKids.last();
				else
				if((lastKid.is(mappedTarget) || $.contains(lastKid[0], mappedTarget)) && !e.shiftKey)
					target = focusKids.first();
			}

			//target means first/last item and need to loop...or no kids, so do nothing.
			if(target || !focusKids.length)
			{
				target = $(target);
				target.focus();
				e.preventDefault();
				e.stopPropagation();
			}
		}

		//manage arrow navigation if desired.
		if(options.navKeyRoot && [$.ui.keyCode.LEFT, $.ui.keyCode.RIGHT, $.ui.keyCode.UP, $.ui.keyCode.DOWN].indexOf(e.keyCode) != -1)
		{
			var navKids = this.selectableChildren();
			var focusedItem = this._focus();
			var idxFocused = navKids.index(focusedItem);
			var goPrev = (e.keyCode == $.ui.keyCode.LEFT || e.keyCode == $.ui.keyCode.UP);
			var goNext = (e.keyCode == $.ui.keyCode.RIGHT || e.keyCode == $.ui.keyCode.DOWN);
			var vert = (options.navKeyDir == "horizontal" || options.navKeyDir == "both") && (e.keyCode == $.ui.keyCode.LEFT || e.keyCode == $.ui.keyCode.RIGHT);
			var horz = (options.navKeyDir == "vertical" || options.navKeyDir == "both") && (e.keyCode == $.ui.keyCode.UP || e.keyCode == $.ui.keyCode.DOWN);
			var focusItem = $();

			if(this.element.is(document.activeElement))
				focusItem = (focusedItem) ? focusedItem : navKids.first();
			else
			if(goPrev && (vert || horz))
				focusItem = (idxFocused > 0) ? navKids[idxFocused - 1] : navKids.last();
			else
			if(goNext && vert || horz)
				focusItem = (idxFocused < navKids.length-1) ? navKids[idxFocused + 1] : navKids.first();
			
			//don't focus for just shift/ctrl keys
			if(e.keyCode != 17 && e.keyCode != 16)
			{
				focusItem.focus();
				e.preventDefault();
			}
		}

		//manage selection, and focus jumping
		if(e.keyCode == $.ui.keyCode.ENTER || e.keyCode == $.ui.keyCode.SPACE)
		{
			if((options.type == "multi") && !e.shiftKey && !e.ctrlKey)
				this.deselectAll(true);

			if(e.shiftKey)
			{
				var selChildren = this.selectableChildren();
				var idxAnchor = selChildren.index(this._anchor());
				var idxSel = selChildren.index(this._focus());
				var idxStart = Math.min(idxAnchor, idxSel);
				var idxEnd = Math.max(idxAnchor, idxSel);
				this.toggleSelected(selChildren.slice(idxStart, idxEnd + 1), true, false);
			}
			else
				this.toggleSelected(this._focus());
		}
		else
		if((e.keyCode == $.ui.keyCode.HOME) && ibxEventManager.isInputEventToIgnore(e))
			this.selectableChildren().first().focus();
		else
		if((e.keyCode == $.ui.keyCode.END) && ibxEventManager.isInputEventToIgnore(e))
			this.selectableChildren().last().focus();
		else
		if(e.keyCode == $.ui.keyCode.ESCAPE && options.escClearSelection)
			this.deselectAll(true);
	},
	_onMouseDown:function(e)
	{
		var options = this.options;

		//mousedown happens before focus, so make us active before anything.
		this._activate(true);

		//stop if we don't care about selection.
		if(options.type == "nav" || options.type == "none")
			return;

		var isTarget = this.element.is(e.target);
		var isMulti = options.type == "multi";
		var selChildren = this.selectableChildren();
		var selTarget = this.mapToSelectable(e.target);

		//don't deselect if clicking on scrollbar.
		if(!this.element.clickOnScrollbar(e.clientX, e.clientY))
		{
			if(isTarget || (isMulti && !e.shiftKey && !e.ctrlKey && !this.isSelected(selTarget)))
				this.deselectAll(true);
		}

		//event could happen on child element...map back to something we know can be selected
		//and can actually be selected by this selection manager.
		if(selChildren.index(selTarget) != -1)
		{
			if(options.type == "multi" && e.shiftKey)
			{
				var idxAnchor = selChildren.index(this._anchor());
				var idxSel = selChildren.index(selTarget[0]);
				var idxStart = Math.min(idxAnchor, idxSel);
				var idxEnd = Math.max(idxAnchor, idxSel);
				this.toggleSelected(selChildren.slice(idxStart, idxEnd + 1), true, false);
			}
			else
			if(isMulti && !e.ctrlKey)
				this.toggleSelected(selTarget, true);
			else
				this.toggleSelected(selTarget, (isMulti && e.ctrlKey) || options.toggleSelection ? undefined : true);
		}
	},
	_onRubberBandEvent:function(e)
	{
		if(e.type == "ibx_rubberbandchange")
		{
			var options = this.options;
			var selBox = e.data;
			selBox.right = selBox.left + selBox.width;
			selBox.bottom = selBox.top + selBox.height;

			var selChildren = this.selectableChildren();
			for(var i = 0; i < selChildren.length; ++i)
			{
				var child = selChildren[i];
				var inBox = $(child).visInfo("borderBox", selBox);
				var select = options.rubberBandPartialSelect ? inBox.partial : inBox.total;
				this.selected(child, select, select && !this.anchor());
			}
		}
	},
	preDispacthEvent:function(eventInfo){return eventInfo;},
	_dispatchEvent:function(eType, data, canBubble, cancelable, relatedTarget, mapItems)
	{
		mapItems = (mapItems === undefined) ? true : mapItems;
		data.items = mapItems ? this.mapFromSelectable(data.items) : data.items;
		var parms = this.preDispacthEvent({"eType":eType, "data":data, "canBubble":canBubble, "cancelable":cancelable, "relatedTarget":relatedTarget});
		var evt = this.element.dispatchEvent(parms.eType, parms.data, parms.canBubble, parms.cancelable, parms.relatedTarget);
		evt.data.items = mapItems ? this.mapToSelectable(data.items) : data.items;
		return evt;
	},
	mapToSelectable:function(el)
	{
		return $(el).closest(".ibx-sm-selectable");
	},
	mapFromSelectable:function(el)
	{
		return $(el);
	},
	selectableChildren:function(selector)
	{
		var options = this.options;
		var e = this._dispatchEvent("ibx_selectablechildren", {"items":null}, false, true, undefined, false);
		var children = e.data.items ? $(e.data.items) : this.element.logicalChildren(".ibx-sm-selection-root, .ibx-sm-nav-key-root, .ibx-sm-focus-root, .ibx-sm-focus-default", ":ibxFocusable(-1)");			
		children.addClass("ibx-sm-selectable");
		return selector ? children.filter(selector) : children;
	},
	isSelected:function(el){return $(el).hasClass("ibx-sm-selected");},
	selected:function(el, select, anchor)
	{
		//public interface needs to map nodes...think tree from ibxTreeNode to it's selectable label.
		el = $(el, this.element)
		el = this.mapToSelectable(el);
		el = this._selected(el, select, anchor);
		return el ? this.mapFromSelectable(el) : undefined;
	},
	_selected:function(el, select, anchor)
	{
		if(!el.length)
		{
			select = (select !== false) ? ".ibx-sm-selected" : ":not(.ibx-sm-selected)";
			return this.selectableChildren(select);
		}

		//only children that are direct descendants of this root can be manipulated.
		el = this.element.logicalChildren(".ibx-sm-selection-root", el);

		//by default set the anchor item
		anchor = (select && (anchor === undefined)) ? true : anchor;

		if(select)
		{
			//handle selection types...
			var options = this.options;
			if(options.type == "single")//single selection
			{
				this.deselectAll(true);
				el = $(el).first(":not(.ibx-sm-selected)");
			}
			else//multi
			if(options.type == "multi")//multiple selection
				el = $(el).filter(":not(.ibx-sm-selected)");
			else
				el = $();//default just nav, no selection.

			if(el.length)
			{
				var evt = this._dispatchEvent("ibx_beforeselchange", {"selected":select, "items":el}, true, true);
				if(!evt.isDefaultPrevented())
				{
					el = evt.data.items;
					el.addClass("ibx-sm-selected");
					if(anchor)
						this._anchor(el.first());
					this._dispatchEvent("ibx_selchange", {"selected":select, "items":el}, true, false);
				}
			}
		}
		else
		{
			el = $(el).filter(".ibx-sm-selected");
			if(el.length)
			{
				var evt = this._dispatchEvent("ibx_beforeselchange", {"selected":select, "items":el}, true, true);
				if(!evt.isDefaultPrevented())
				{
					el.removeClass("ibx-sm-selected");
					if(anchor)
						this._anchor(el.first());
					this._dispatchEvent("ibx_selchange", {"selected":select, "items":el}, true, false);
				}
			}
		}
	},
	toggleSelected:function(el, selected, anchor)
	{
		selected = (selected === undefined) ? !this.isSelected(el) : selected;
		this.selected(el, selected, anchor);
	},
	selectAll:function(selector)
	{
		this.selected(this.selectableChildren(":not(.ibx-sm-selected)"), true);
	},
	deselectAll:function(andAnchor)
	{
		this.selected(this.selectableChildren(".ibx-sm-selected"), false);
		if(andAnchor)
			this.anchor(null);
	},
	_elAnchor:$(),
	anchor:function(el)
	{
		//public interface needs to map nodes...think tree from ibxTreeNode to it's selectable label.
		el = $(el, this.element);
		el = this.mapToSelectable(el);
		el = this._anchor(el[0]);
		return el ? this.mapFromSelectable(el) : undefined;
	},
	_anchor:function(el)
	{
		if(el === undefined)
			return this._elAnchor[0];

		this._elAnchor.removeClass("ibx-sm-anchor");
		this._elAnchor = $(el).first().addClass("ibx-sm-anchor");
		var evt = this._dispatchEvent("ibx_anchored", {"items":this._elAnchor}, true, false);
	},
	_elFocus:$(),
	focus:function(el, focus)
	{
		//public interface needs to map nodes...think tree from ibxTreeNode to it's selectable label.
		el = $(el, this.element);
		el = this.mapToSelectable(el);
		el = this._focus(el[0], focus);
		return el ? this.mapFromSelectable(el) : undefined;
	},
	_focus:function(el, focus)
	{
		if(el === undefined)
			return this._elFocus[0];

		this._elFocus.removeClass("ibx-sm-focused ibx-ie-pseudo-focus");
		this._elFocus = $(el).first().addClass("ibx-sm-focused " + (ibxPlatformCheck.isIE ? "ibx-ie-pseudo-focus" : ""));
		this._elFocus ? this.element.attr("aria-active-descendant", this._elFocus.prop("id")) : this.element.removeAttr("aria-active-descendant");
		this._elFocus.focus();
		var evt = this._dispatchEvent("ibx_focused", {"items":this._elFocus}, true, false);
		return this._elFocus[0];
	},
	_active:false,
	active:function()
	{
		return this._active;
	},
	_activate:function(active)
	{
		if(active === undefined)
			return this._active;

		if(this._active != active)
		{
			var options = this.options;
			if(active)
			{
				this.element.addClass("ibx-sm-active");

				//take the element out of the tab order so shift+tab will work and not focus this container.
				//if(options.focusDefault)
				//	this.element.data("ibxFocDefSavedTabIndex", this.element.prop("tabindex")).prop("tabindex", -1);
			}
			else
			{
				if(this.options.focusResetOnBlur)
					this._focus(null, false);
				this.element.removeClass("ibx-sm-active");

				//put this element back in the tab order...so that next tab into will will do auto-focus.
				//this.element.prop("tabIndex", this.element.data("ibxFocDefSavedTabIndex")).removeData("ibxFocDefSavedTabIndex");
			}
			this._active = active;
		}
	},
	option:function(key, value)
	{
		this._super(key, value);
	},
	_setOption:function(key, value)
	{
		if(key == "type" && value != this.options[key])
			this.deselectAll(true);

		if(key == "type")
			this.element.toggleClass("ibx-sm-selection-root", (value != "none"));
		else
		if(key == "focusRoot")
			this.element.toggleClass("ibx-sm-focus-root", value);
		else
		if(key == "navKeyRoot")
			this.element.toggleClass("ibx-sm-nav-key-root", value);
		else
		if(key == "focusDefault")
			this.element.toggleClass("ibx-sm-focus-default", !!value);
		else
		if(key == "rubberBand")
		{
			if(this.element.is(".ibx-rubber-band") && value === false)
				this.element.ibxRubberBand("destroy");
			else
			if(value)
				this.element.ibxRubberBand();
		}

		this._super(key, value);
	},
});

$.widget("ibi.ibxRubberBand", $.Widget, 
{
	options:
	{
	},
	_create:function()
	{
		this._super();
		this.element.ibxAutoScroll().addClass("ibx-rubber-band");
		this.element[0].addEventListener("mousedown", this._onMouseEvent.bind(this), false);
		this.element[0].addEventListener("mouseup", this._onMouseEvent.bind(this), false);
		this.element[0].addEventListener("mousemove", this._onMouseEvent.bind(this), false);
	},
	_init:function()
	{
		this._super();
	},
	_destroy:function()
	{
		this.element.ibxAutoScroll("destroy").removeClass("ibx-rubber-band");
		this._super();
	},
	_onMouseEvent:function(e)
	{
		var eType = e.type;
		var eTrueX = e.offsetX + this.element.prop("scrollLeft");
		var eTrueY = e.offsetY + this.element.prop("scrollTop");
		var options = this.options;
		var isTarget = this.element.is(e.target);

		if(eType == "mousedown" && isTarget)
		{
			this.stop();

			var event = this.element.dispatchEvent("ibx_beforerubberbandstart", null, true, true);
			if(!event.isDefaultPrevented())
			{
				var pos = this.element.css("position");
				if(pos != "absolute")
					this.element.css("position", "relative").data("ibxSelMgrRubberBandOrigPos", pos);
				this._startPoint = {"x":eTrueX, "y":eTrueY};
				this.element.addClass("ibx-sm-rubber-band-active");
				this._rubberBand = $("<div class='ibx-sm-rubber-band'>").css({"left":eTrueX, "top":eTrueY}).appendTo(this.element);
				this.element.ibxAutoScroll("start");
				this.element.dispatchEvent("ibx_rubberbandstart", null, true, false, this._rubberBand[0]);
			}
		}
		else
		if(eType == "mouseup" && this._rubberBand)
		{
			this.stop();
			this.element.ibxAutoScroll("stop");
		}
		else
		if(eType == "mousemove" && this._rubberBand)
		{
			var left = Math.min(this._startPoint.x, eTrueX);
			var top = Math.min(this._startPoint.y, eTrueY);
			var width = Math.abs(this._startPoint.x - eTrueX);
			var height = Math.abs(this._startPoint.y - eTrueY);
			var rBounds = {"left": left, "top":top, "width":width, "height":height};
			this._rubberBand.css(rBounds);
			this.element.dispatchEvent("ibx_rubberbandchange", rBounds, true, false, this._rubberBand[0]);
		}
	},
	stop:function(e)
	{
		if(this._rubberBand)
		{
			this.element.dispatchEvent("ibx_rubberbandend", null, true, false, this._rubberBand[0]);
			this.element.removeClass("ibx-sm-rubber-band-active").css("position", this.element.data("ibxSelMgrRubberBandOrigPos"));
			this._rubberBand.remove();
			delete this._rubberBand;
			delete this._startPoint;
		}
	},
	_setOption:function(key, value)
	{
		var options = this.options;
		var changed = options[key] != value;
		this._super(key, value);
	}
});

//# sourceURL=selection.ibx.js
