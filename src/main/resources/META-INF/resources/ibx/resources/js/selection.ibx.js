/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.68 $:

$.widget("ibi.ibxSelectionManager", $.Widget, 
{
	options:
	{
		"type":"none",						//none - no selection, single - single selection, multi - multiple selection
		"toggleSelection":false,			//clicking on an item will select/deselect.
		"escClearSelection":true,			//clear the selection on the escape key
		"selectButtons":[0, 2],				//which buttons trigger a select 0 = left, 1 = middle, 2 = right
		"selectKeys":[13, 32],				//which keys trigger a select 13 = ENTER, 32 = SPACE
		"focusRoot":false,					//keep focus circular within this element
		"focusDefault":false,				//focus the first item in root. (can be a select pattern).
		"focusResetOnBlur":true,			//when widget loses focus, reset the current active navKey child.
		"navKeyRoot":false,					//arrow keys will move you circularly through the items.
		"navKeyDir":"both",					//horizontal = left/right, vertical = up/down, or both
		"rubberBand":false,					//selection by rubberband
		"rubberBandPartialSelect":false,	//rubberband must fully enclose the item for selection
		"selectableChildren":null,			//class for what children are selectable.
		"cacheSelectableChildren":false,	//when true, save last retreived to save time
	},
	_create:function()
	{
		this._super();
		$.extend(true, this.options, ibx.getIbxMarkupOptions(this.element));//we aren't an ibxWidget, so get the markup options.
		this.option(this.options);//force initial update.

		this.element.ibxAddClass("ibx-selection-manager");
		this.element.data("ibiIbxSelectionManager", this);//plymorphism
		this.element[0].addEventListener("focusin", this._focusInBound = this._onFocusIn.bind(this), true);
		this.element[0].addEventListener("focusout", this._focusOutBound = this._onFocusOut.bind(this), true);
		this.element[0].addEventListener("mousedown", this._onMouseEventBound = this._onMouseEvent.bind(this), true);
		this.element[0].addEventListener("mouseup", this._onMouseEventBound, true);
		this.element[0].addEventListener("keydown", this._onKeyDownBound = this._onKeyDown.bind(this), true);
		this.element[0].addEventListener("ibx_rubberbandchange", this._onRubberBandEventBound = this._onRubberBandEvent.bind(this), true);

	},
	_destroy:function()
	{
		if(this.element.is(".ibx-rubber-band"))
			this.element.ibxRubberBand("destroy");

		this.element.ibxRemoveClass([this._widgetClass, "ibx-sm-selection-root", "ibx-sm-focus-root", "ibx-sm-nav-key-root", "ibx-sm-focus-default"]);
		this.element[0].removeEventListener("focusin", this._focusInBound, true);
		this.element[0].removeEventListener("focusout", this._focusOutBound, true);
		this.element[0].removeEventListener("mousedown", this._onMouseEventBound, true);
		this.element[0].removeEventListener("mouseup", this._onMouseEventBound, true);
		this.element[0].removeEventListener("mouseup", this._onMouseUpBound, true);
		this.element[0].removeEventListener("keydown", this._onKeyDownBound, true);
		this.element[0].removeEventListener("ibx_rubberbandchange", this._onRubberBandEventBound, true);
		this._super();
	},
	_onFocusIn:function(e)
	{
		var options = this.options;
		var isTarget = this.element.is(e.target);
		var ownsTarget = $.contains(this.element[0], e.target) && $(e.target.parentElement).closest(".ibx-selection-manager").is(this.element);
		var ownsRelTarget = $.contains(this.element[0], e.relatedTarget);

		//make sure the manager is in the focused state.
		this._activate(true);
		
		//do the default focusing when manager is directly focused - not one of its children, and not when clicked on its scrollbar.
		var onScrollBar = this._eLastMouseDown ? ClickOnScrollbar(this.element[0], this._eLastMouseDown.clientX, this._eLastMouseDown.clientY) : false;
		if(isTarget && !onScrollBar && !this._focusedOnScrollBar && !ownsRelTarget && options.focusDefault !== false)
		{
			var defItem = this._focus();
			if(!defItem)
			{
				var defItem = this.element.find(options.focusDefault);
				defItem = defItem.length ? defItem : this.selectableChildren(":ibxVisible").first();
			}

			//this will cuase _onFocusIn to recurse with the default item being the e.target element.
			$(defItem).focus();
			return;
		}

		//focus the selected item
		if(!isTarget && ownsTarget)
			this._focus(e.target);
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
		var ownsTarget = $.contains(this.element[0], e.target) && $(e.target.parentElement).closest(".ibx-selection-manager").is(this.element); //is there a deeper selection manager?!

		//this aint the selectionmanager you're looking for...get out of Dodge!
		if((!options.focusRoot && !options.navKeyRoot) || !ownsTarget)
			return;

		//manage circular tabbing if desired.
		if(options.focusRoot && e.keyCode == $.ui.keyCode.TAB)
		{
			var focusKids = this.element.logicalChildren(".ibx-sm-focus-root", ":ibxFocusable:ibxVisible");
			var target = null;
			var firstKid = focusKids.first();
			var lastKid = focusKids.last();

			if(firstKid.length && lastKid.length)
			{
				if((firstKid.is(e.target) || $.contains(firstKid[0], e.target)) && e.shiftKey)
					target = focusKids.last();
				else
				if((lastKid.is(e.target) || $.contains(lastKid[0], e.target)) && !e.shiftKey)
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
			var navKids = this.selectableChildren(":ibxVisible");
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
				//focus the target
				focusItem.focus();
				e.preventDefault();
				e.stopPropagation();//propagation can conflict with outer selection managers.
			}
		}

		//manage selection, and focus jumping
		if(options.selectKeys.indexOf(e.keyCode) != -1)
		{
			var focusedItem = this._focus();
			var isMulti = options.type == "multi";
			if(isMulti && !e.shiftKey && !e.ctrlKey && !this.isSelected(focusedItem) && !options.toggleSelection)
				this.deselectAll(true, false);

			if(e.shiftKey)
			{
				var selChildren = this.selectableChildren(":ibxVisible");
				var idxAnchor = selChildren.index(this._anchor());
				var idxSel = selChildren.index(this._focus());
				var idxStart = Math.min(idxAnchor, idxSel);
				var idxEnd = Math.max(idxAnchor, idxSel);
				this.toggleSelected(selChildren.slice(idxStart, idxEnd + 1), true, false);
			}
			else
			if(isMulti && e.ctrlKey)
				this.toggleSelected(focusedItem);//toggle the target!
			else
				this.toggleSelected(focusedItem, (options.toggleSelection ? undefined : true));
		}
		else
		if((e.keyCode == $.ui.keyCode.HOME) && ibxEventManager.isInputEventToIgnore(e))
		{
			this.selectableChildren(":ibxVisible").first().focus();
			e.preventDefault();
		}
		else
		if((e.keyCode == $.ui.keyCode.END) && ibxEventManager.isInputEventToIgnore(e))
		{
			this.selectableChildren(":ibxVisible").last().focus();
			e.preventDefault();
		}
		else
		if(e.keyCode == $.ui.keyCode.ESCAPE && options.escClearSelection)
			this.deselectAll(true);
	},
	_eLastMouseDown:null,//used to know if click is on scrollbar for focusin
	_onMouseEvent:function(e)
	{
		var options = this.options;
		var ownsTarget = $.contains(this.element[0], e.target) && $(e.target.parentElement).closest(".ibx-selection-manager").is(this.element); //is there a deeper selection manager?!

		//deselect all when clicking on whitespace.
		if(e.type == "mousedown" && this.element.is(e.target))
			this.deselectAll()

		//if we don't directly own the target, then, Neo, you aren't the one.
		if(!ownsTarget)
			return;

		if(e.type == "mousedown")
		{
			this._eLastMouseDown = e;//save last mousedown so on activate we can check to see if it's on the scrollbar and not do focusDefault.
			this._activate(true);//mousedown happens before focus, so make us active before anything.

			//stop if we don't care about selection.
			if(options.type == "none" || options.selectButtons.indexOf(e.button) == -1)
				return;

			var isTarget = this.element.is(e.target);
			var isMulti = options.type == "multi";
			var selChildren = this.selectableChildren(":ibxVisible");
			var selTarget = this.mapToSelectable(e.target);

			//don't deselect if clicking on scrollbar.
			if(!ClickOnScrollbar(e.target, e.clientX, e.clientY))
			{
				if(isTarget || (isMulti && !e.shiftKey && !e.ctrlKey && !this.isSelected(selTarget) && !options.toggleSelection))
					this.deselectAll(true);
			}
				
			//focus the target
			this.focus(selTarget, true);

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
					this.toggleSelected(selChildren.slice(idxStart, idxEnd + 1), true, false, false);
				}
				else
				if(isMulti && e.ctrlKey)
					this.toggleSelected(selTarget);//toggle the target!
				else
				if(isMulti)
					this.toggleSelected(selTarget, options.toggleSelection ? undefined : true);
				else
					this.toggleSelected(selTarget, true);
			}
		}
		else
		if(e.type == "mouseup")
		{
			this._eLastMouseDown = null;
		}
	},
	_onRubberBandEvent:function(e)
	{
		if(e.type == "ibx_rubberbandchange")
		{
			var anchor = null;
			var focus = null;
			var options = this.options;
			var selBox = e.data;
			selBox.right = selBox.left + selBox.width;
			selBox.bottom = selBox.top + selBox.height;

			var children = this.selectableChildren(":ibxVisible");
			for(var i = 0; i < children.length; ++i)
			{
				var child = children[i];
				var inBox = $(child).visInfo("borderBox", selBox);
				var select = options.rubberBandPartialSelect ? inBox.partial : inBox.total;
				this.selected(child, select, false);
				if(!anchor && select)
					anchor = child;
				focus = select ? child : focus;
			}

			this.anchor(anchor);
			this.focus(focus);
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
		el = $(el)
		var selChildren = this.options.selectableChildren;
		return $(el).closest(".ibx-sm-selectable" + (selChildren ? (", " + selChildren) : ""));
	},
	mapFromSelectable:function(el)
	{
		return $(el);
	},
	_cachedSelectableChildren:$(),
	updateSelectableCache:function(children)
	{
		this._cachedSelectableChildren.ibxRemoveClass("ibx-sm-selectable");
		this._cachedSelectableChildren = $(children);
		return;
	},
	selectableChildren:function(selector)
	{
		var options = this.options;
		var children = $();
		if(options.cacheSelectableChildren && this._cachedSelectableChildren.length)
			children = selector ? this._cachedSelectableChildren.filter(selector) : this._cachedSelectableChildren;
		else
		{
			var e = this._dispatchEvent("ibx_selectablechildren", {"items":null}, false, true, undefined, false);
			var children = e.data.items
				? $(e.data.items)
				: this.element.logicalChildren(".ibx-sm-selection-root, .ibx-sm-nav-key-root, .ibx-sm-focus-root, .ibx-sm-focus-default", ":ibxFocusable(-1)");			

			if(options.selectableChildren)
				children =  children.filter(options.selectableChildren);

			this.updateSelectableCache(children);
			children.ibxAddClass("ibx-sm-selectable");
			children =  selector ? children.filter(selector) : children;
		}
		return children;
	},
	isSelected:function(el){return $(el).hasClass("ibx-sm-selected");},
	selected:function(el, select, anchor, focus)
	{
		//public interface needs to map nodes...think tree from ibxTreeNode to it's selectable label.
		el = $(el, this.element);
		el = this.mapToSelectable(el);
		el = this._selected(el, select, anchor, focus);
		return el ? this.mapFromSelectable(el) : undefined;
	},
	_selected:function(el, select, anchor, focus)
	{
		//return the selected children.
		if(!el.length)
		{
			select = (select !== false) ? ".ibx-sm-selected" : ":not(.ibx-sm-selected)";
			return this.element.logicalChildren(".ibx-sm-selection-root", select);
		}

		//only children that are direct descendants of this root can be manipulated.
		el = this.element.logicalChildren(".ibx-sm-selection-root", el);

		//by default set the anchor/focus item
		anchor = (select && (anchor === undefined)) ? true : anchor;
		focus = (select && (focus === undefined)) ? true : focus;

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
				var evt = this._dispatchEvent("ibx_beforeselchange", {"selected":select, "items":el, "selMgr":this, "anchor":this._elAnchor, "focus":this._elFocus}, true, true);
				if(!evt.isDefaultPrevented())
				{
					el = evt.data.items;
					el.ibxAddClass("ibx-sm-selected").attr("aria-selected", true);
					if(anchor)
						this.anchor(el.first());
					if(focus)
						this.focus(el.last());
					this._dispatchEvent("ibx_selchange", {"selected":select, "items":el, "selMgr":this, "anchor":this._elAnchor, "focus":this._elFocus}, true, false);
				}
			}
		}
		else
		{
			el = $(el).filter(".ibx-sm-selected");
			if(el.length)
			{
				var evt = this._dispatchEvent("ibx_beforeselchange",{"selected":select, "items":el, "selMgr":this, "anchor":this._elAnchor, "focus":this._elFocus}, true, true);
				if(!evt.isDefaultPrevented())
				{
					el.ibxRemoveClass("ibx-sm-selected").attr("aria-selected", null);
					if(anchor && el.is(this._elAnchor))
						this.anchor(null);
					if(focus && el.is(this._elFocus))
						this.focus(null);
					this._dispatchEvent("ibx_selchange", {"selected":select, "items":el, "selMgr":this, "anchor":this._elAnchor, "focus":this._elFocus}, true, false);
				}
			}
		}
	},
	toggleSelected:function(el, selected, anchor, focus)
	{
		selected = (selected === undefined) ? !this.isSelected(el) : selected;
		this.selected(el, selected, anchor, focus);
	},
	selectAll:function(selector)
	{
		this.selected(":not(.ibx-sm-selected)", true);
	},
	deselectAll:function(andAnchor, andFocus)
	{
		andAnchor = (andAnchor == undefined) ? true : andAnchor;
		andFocus = (andFocus == undefined) ? true : andFocus;
		
		this.selected(".ibx-sm-selected", false);
		if(andAnchor)
			this.anchor(null);
		if(andFocus)
			this.focus(null);
	},
	_elAnchor:$(),
	anchor:function(el)
	{
		//public interface needs to map nodes...think tree from ibxTreeNode to it's selectable label.
		el = el ? this.mapToSelectable(el)[0] : el;
		el = this._anchor(el);
		return el ? this.mapFromSelectable(el) : undefined;
	},
	_anchor:function(el)
	{
		if(el === undefined)
			return this._elAnchor[0];

		if(!this._elAnchor.is(el))
		{
			var relTarget = this._elAnchor[0];
			this._elAnchor.ibxRemoveClass("ibx-sm-anchor");
			this._elAnchor = $(el).first().ibxAddClass("ibx-sm-anchor");
			var evt = this._dispatchEvent("ibx_anchored", {"anchor":this._elAnchor[0], "focus":this._elFocus[0], "selMgr":this}, true, false, relTarget);
		}
		return this._elAnchor[0];
	},
	_elFocus:$(),
	focus:function(el)
	{
		//public interface needs to map nodes...think tree from ibxTreeNode to it's selectable label.
		el = el ? this.mapToSelectable(el)[0] : el;
		el = this._focus(el);
		return el ? this.mapFromSelectable(el) : undefined;
	},
	_focus:function(el)
	{
		if(el === undefined)
			return this._elFocus[0];

		if(!this._elFocus.is(el))
		{
			var relTarget = this._elFocus[0];
			this._elFocus.ibxRemoveClass("ibx-sm-focused ibx-ie-pseudo-focus");
			this._elFocus = $(el).first().ibxAddClass("ibx-sm-focused " + (ibxPlatformCheck.isIE ? "ibx-ie-pseudo-focus" : ""));
			if(!this._elFocus.is(document.activeElement))
			{
				this._elFocus.focus();
				this._dispatchEvent("ibx_focused", {"focus":this._elFocus[0], "anchor":this._elAnchor[0], "selMgr":this}, true, false, relTarget);
			}
			var idFocus = this._elFocus.prop("id");
			this.element.attr("aria-activedescendant", idFocus || null);
		}
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
				this.element.ibxAddClass("ibx-sm-active");

				//take the element out of the tab order so shift+tab will work and not focus this container.
				//if(options.focusDefault)
				//	this.element.data("ibxFocDefSavedTabIndex", this.element.prop("tabindex")).prop("tabindex", -1);
			}
			else
			{
				if(this.options.focusResetOnBlur)
					this._focus(null);
				this.element.ibxRemoveClass("ibx-sm-active");

				//put this element back in the tab order...so that next tab into will will do auto-focus.
				//this.element.prop("tabIndex", this.element.data("ibxFocDefSavedTabIndex")).removeData("ibxFocDefSavedTabIndex");
			}
			this._active = active;
		}
	},
	option:function(key, value)
	{
		return this._superApply(arguments);
	},
	_setOption:function(key, value)
	{
		var options = this.options;
		var changed = this.options[key] != value;
		if(key == "type")
		{
			this.element.ibxToggleClass("ibx-sm-selection-root", (value != "none"));
			if(changed)
			{
				(value == "multi") ? this.element.attr("aria-multiselectable", true) : (this.element.removeAttr("aria-multiselectable"));
				this.deselectAll(true);
			}
		}
		else
		if(key == "focusRoot")
			this.element.ibxToggleClass("ibx-sm-focus-root", value);
		else
		if(key == "navKeyRoot")
			this.element.ibxToggleClass("ibx-sm-nav-key-root", value);
		else
		if(key == "focusDefault")
			this.element.ibxToggleClass("ibx-sm-focus-default", !!value);
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
		"startDistanceX":5,
		"startDistanceY":5,
	},
	_create:function()
	{
		this._super();
		this.element.ibxAutoScroll().ibxAddClass("ibx-rubber-band");
		this._onMouseEventBound = this._onMouseEvent.bind(this);
		this.element[0].addEventListener("mousedown", this._onMouseEventBound);
		this.element[0].addEventListener("mouseup", this._onMouseEventBound);
		this.element[0].addEventListener("mousemove", this._onMouseEventBound);
	},
	_init:function()
	{
		this._super();
	},
	_destroy:function()
	{
		this.element.ibxAutoScroll("destroy").ibxRemoveClass("ibx-rubber-band");
		this.element[0].removeEventListener("mousedown", this._onMouseEventBound);
		this.element[0].removeEventListener("mouseup", this._onMouseEventBound);
		this.element[0].removeEventListener("mousemove", this._onMouseEventBound);
		this._super();
	},
	_onMouseEvent:function(e)
	{
		var eType = e.type;
		if(eType == "mousedown")
		{
			this.stop();
			this._startPoint = {"x":e.clientX, "y":e.clientY};
		}
		else
		if(eType == "mouseup")
			this.stop();
		else
		if(eType == "mousemove" && this._startPoint)
		{
			var isActive = this.isActive();
			var options = this.options;
			if(!isActive && (Math.abs(this._startPoint.x - e.clientX) >= options.startDistanceX || Math.abs(this._startPoint.y - e.clientY) >= options.startDistanceY))
			{
				var event = this.element.dispatchEvent("ibx_beforerubberbandstart", null, true, true);
				if(!event.isDefaultPrevented())
				{
					//start rubberbanding!
					var pos = this.element.css("position");
					if(pos != "absolute")
						this.element.css("position", "relative").data("ibxSelMgrRubberBandOrigPos", pos);
					this.element.ibxAddClass("ibx-sm-rubber-band-active");
					this._rubberBand = $("<div class='ibx-sm-rubber-band'>").css({"left":eTrueX, "top":eTrueY}).appendTo(this.element);
					this.element.ibxAutoScroll("start");
					this.element.dispatchEvent("ibx_rubberbandstart", null, true, false, this._rubberBand[0]);

					//have to recalculate the start point in terms of the grid, and not the target cell
					var isTarget = this.element.is(e.target);
					this._startPoint = {"x":(isTarget ? 0 : e.target.offsetLeft) + e.offsetX, "y":(isTarget ? 0 : e.target.offsetTop) + e.offsetY};
				}
			}
			else
			if(isActive)
			{
				var eTrueX = e.offsetX + this.element.prop("scrollLeft");
				var eTrueY = e.offsetY + this.element.prop("scrollTop");
				var left = Math.min(this._startPoint.x, eTrueX);
				var top = Math.min(this._startPoint.y, eTrueY);
				var width = Math.abs(this._startPoint.x - eTrueX);
				var height = Math.abs(this._startPoint.y - eTrueY);
				var rBounds = {"left": left, "top":top, "width":width, "height":height};
				this._rubberBand.css(rBounds);
				this.element.dispatchEvent("ibx_rubberbandchange", rBounds, true, false, this._rubberBand[0]);
			}
		}
	},
	stop:function(e)
	{
		if(this.isActive())
			this.element.dispatchEvent("ibx_rubberbandend", null, true, false, this._rubberBand[0]);

		this.element.ibxRemoveClass("ibx-sm-rubber-band-active").css("position", this.element.data("ibxSelMgrRubberBandOrigPos"));
		this.element.ibxAutoScroll("stop");
		delete this._startPoint;

		if(this._rubberBand)
			this._rubberBand.remove();
		delete this._rubberBand;
	},
	isActive:function()
	{
		return this.element.is(".ibx-sm-rubber-band-active");
	},
	_setOption:function(key, value)
	{
		var options = this.options;
		var changed = options[key] != value;
		this._super(key, value);
	}
});

//# sourceURL=selection.ibx.js
