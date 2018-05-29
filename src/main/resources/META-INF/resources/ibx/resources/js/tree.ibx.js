/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:
$.widget("ibi.ibxTree", $.ibi.ibxVBox, 
{
	options:
	{
		"multiSelect":true,
		"escClearSelection":true,
		"navKeyRoot":true,
		"navKeyDir":"vertical",
		"navKeyResetFocusOnBlur":false,
		"focusDefault":".ibx-tree-node",
		"inline":true,
		"align":"stretch",
		"aria":
		{
			"role":"tree",
			"readonly":true
		}
	},
	_widgetClass:"ibx-tree",
	NODE_EVENTS: "keydown keyup mousedown dblclick ibx_nodeselect ibx_nodedeselect ibx_nodeanchored ibx_nodeunanchored ibx_beforeexpand ibx_expand ibx_beforecollapse ibx_collapse",
	_create:function()
	{
		this._super();
		this.element.on(this.NODE_EVENTS, this._onNodeEvent.bind(this));
	},
	_destroy:function()
	{
		this._super();
	},
	navKeyChildren:function(selector)
	{
		return this.treeNodes(selector || ".ibx-tree-node:ibxNavFocusable");
	},
	treeNodes:function(selector)
	{
		return this.element.find(selector || ".ibx-tree-node");
	},
	active:function()
	{
		return this.navKeyActiveChild()[0];
	},
	anchor:function()
	{
		var anchor = this.treeNodes(".tnode-selection-anchor");
		return anchor[0] || null;
	},
	selected:function(el, selected, clearCurSel)
	{
		if(el === undefined)
			return this.treeNodes(".tnode-selected");

		if(!this._inSelection)
		{
			this._inSelection = true;
			var nodes = $(this.treeNodes());
			if(clearCurSel)
				nodes.ibxWidget("selected", false, true);
			nodes = nodes.filter(el);
			nodes = this.options.multiSelect ? nodes : nodes.first();
			nodes.ibxWidget("selected", selected, true);
			
			if(selected)
				nodes.first().ibxWidget("selected", true, false);

			this._inSelection = false;
		}
	},
	_onNodeEvent:function(e)
	{
		var targetNode = $(e.target).closest(".ibx-tree-node").data("ibxWidget");
		if(!targetNode)
			return;

		var options = this.options;
		var eType = e.type;

		//save this for multi-selection
		if(eType == "keydown" || eType == "keyup")
		{
			this._ctrlKeyDown = e.ctrlKey;
			this._shiftKeyDown = e.shiftKey;

			//escape will clear all selections back to anchor...this is questionable...really not sure we want this functionality
			if(e.keyCode === $.ui.keyCode.ESCAPE && options.escClearSelection)
			{
				var selected = $(this.selected());
				selected.ibxWidget("selected", null, false);
			}
		}
		if(eType == "ibx_nodeselect")
		{
			if(!options.multiSelect || (!this._ctrlKeyDown && !this._shiftKeyDown))
				this.selected(targetNode.element[0], true, true);
			else
			if(this._shiftKeyDown)//do contiguous selection
			{
				var navKids = this.navKeyChildren();
			}
		}
		else
		if(eType == "ibx_nodedeselect")
			this.selected(targetNode.element[0], false)

		//don't let the events bubble past the tree.
		e.stopPropagation();
	},
	_onNodeClickEvent:function(e)
	{
		if(!$(e.target).closest(".ibx-tree-node").is(this.element))
			return;

		var singleClickExpand = this.options.singleClickExpand;
		if(e.type == "dblclick" && !singleClickExpand)
			this.toggleExpanded();
		else
		if(e.type == "mousedown")
		{
			this.selected(true);
			if(this.options.singleClickExpand)
				this.toggleExpanded();
		}
	},
	refresh:function(withChildren)
	{
		this._super();
		if(withChildren)
			this.element.find(".ibx-tree-node").ibxWidget("refresh");
	},
	_refresh:function()
	{
		var options = this.options;
		this._super();
	}
});

$.widget("ibi.ibxTreeNode", $.ibi.ibxVBox, 
{
	options:
	{
		"labelOptions":{},
		"btnCollapsed":"tnode-btn-collapsed",
		"btnExpanded":"tnode-btn-expanded",
		"singleClickExpand":false,
		"expanded":false,
		"container":"auto",
		"indent":null, //can override the default indent for this node

		"align":"stretch",

		"aria":
		{
			"role":"treeitem",
		}
	},
	_widgetClass:"ibx-tree-node",
	_createWidget:function(options, element)
	{
		//set the static default tree indent...do it this way so we can define via css.
		if($.ibi.ibxTreeNode.defaultIndent === null)
		{
			var rules = FindStyleRules(".tnode-indent");
			$.ibi.ibxTreeNode.defaultIndent = parseFloat(rules[rules.length-1].style.paddingLeft);
		}
		this._super(options, element);
	},
	_create:function()
	{
		var options = this.options;
		this._super();
		this.element.attr("tabindex", -1);
		this.element.on("focus", this._onNodeFocusEvent.bind(this)).on("keydown", this._onNodeKeyEvent.bind(this)).on("mousedown click dblclick", this._onNodeMouseEvent.bind(this));
		this.nodeLabel = $("<div tabindex='-1' class='tnode-label'>").ibxLabel().appendTo(this.element);
		options.labelOptions.text = options.labelOptions.text || this.element.textNodes().remove().text().replace(/^\s*|\s*$/g, "");

		this.btnExpand = $("<div class='tnode-btn'>").prependTo(this.nodeLabel).on("mousedown click", this._onBtnExpandClick.bind(this));

		//add the markup children correctly.
		this._childBox = $("<div class='tnode-children'>").ibxVBox().appendTo(this.element);
		this.add(this.element.children(".ibx-tree-node"));
	},
	_setAccessibility:function(accessible, aria)
	{
		var options = this.options;
		this.hasChildren() ? this._childBox.attr("role", "group") : this._childBox.removeAttr("role");
		this.element.attr("aria-expanded", options.expanded);
		return aria
	},
	_destroy:function()
	{
		this._super();
	},
	children:function(selector)
	{
		return this._childBox.ibxWidget("children", selector || ".ibx-tree-node");
	},
	add:function(el, elSibling, before, refresh)
	{
		this._childBox.ibxWidget("add", el, elSibling, before, refresh)
		if(refresh)
			this.refresh();
	},
	remove:function(el, destroy, refresh)
	{
		this._childBox.ibxWidget("remove", el, destroy, refresh);
		if(refresh)
			this.refresh();
	},
	depth:function()
	{
		return this.element.parents(".ibx-tree-node").length;	
	},
	tree:function()
	{
		return this.element.closest(".ibx-tree")[0];
	},
	parentNode:function()
	{
		return this.element.parents(".ibx-tree-node").first()[0];
	},
	hasChildren:function()
	{
		return !!this._childBox.children(".ibx-tree-node").length;
	},
	_onNodeFocusEvent:function(e)
	{
		if(!this.btnExpand.is(e.target))
			this.nodeLabel.focus();
		else
			e.preventDefault();
	},
	_onNodeKeyEvent:function(e)
	{
		if(e.keyCode === $.ui.keyCode.RIGHT)
		{
			if(!this.expanded())
				this.toggleExpanded(true);
			else
				this.children().first().focus();
			e.stopPropagation();
		}
		else
		if(e.keyCode === $.ui.keyCode.LEFT)
		{
			if(this.expanded())
				this.toggleExpanded(false);
			else
				this.parentNode().focus();
			e.stopPropagation();
		}
		else
		if(e.keyCode === $.ui.keyCode.ENTER || e.keyCode === $.ui.keyCode.SPACE)
		{
			this.toggleSelected();
			e.stopPropagation();
		}
	},
	_onNodeMouseEvent:function(e)
	{
		var eType = e.type;
		if(eType == "mousedown")
			this.selected(true);
		else
		if(eType == "click" && this.options.singleClickExpand)
			this.toggleExpanded();
		else
		if(eType == "dblclick")
			this.toggleExpanded();
		e.stopPropagation();
	},
	_onBtnExpandClick:function(e)
	{
		if(e.type == "click")
			this.toggleExpanded();
		e.stopPropagation();//click/mousedown on button should not change tree selection...this stops that
	},
	toggleExpanded:function(expand)
	{
		expand = (expand === undefined) ? !this.options.expanded : expand;
		this.expanded(expand);
	},
	expanded:function(expanded)
	{
		if(expanded === undefined)
			return this.options.expanded;
		this.option("expanded", expanded);
	},
	toggleSelected:function(select, silent)
	{
		select = (select === undefined) ? !this.selected() : select;
		this.selected(select, silent);
	},
	selected:function(select, silent)
	{
		if(select === undefined)
			return this.element.is(".tnode-selected");

		var eType = null;
		var tree = this.tree();
		var selected = this.selected();
		if(select && !selected)
		{
			this.element.addClass("tnode-selected");
			eType = "ibx_nodeselect";
		}
		else
		if(!select && selected)
		{
			this.element.removeClass("tnode-selected");
			eType = "ibx_nodedeselect";
		}

		if(eType && !silent)
			this.element.dispatchEvent(eType, null, true, true, tree);
			
	},
	_setOption:function(key, value)
	{
		var options = this.options;
		var changed = (this.options[key] != value);
		if(changed && key == "expanded")
		{
			var tree = this.tree();
			var eType = value ? "ibx_beforeexpand" : "ibx_beforecollapse";
			var evt = this.element.dispatchEvent(eType, null, true, true, tree);
			if(!evt.defaultPrevented)
			{
				this._super(key, value);
				eType = value ? "ibx_expand" : "ibx_collapse";
				if(eType == "ibx_collapse")
					this.children().ibxWidget("selected", false);
				this.element.dispatchEvent(eType, null, true, true, tree);
			}
		}
		else
			this._super(key, value);
	},
	refresh:function(withChildren)
	{
		this._super();
		if(withChildren)
			this.children().ibxWidget("refresh");
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		var children = this.children();
		var container = (options.container == "auto") ? this.hasChildren() : options.container;
		var indent = (options.indent !== null) ? options.indent : $.ibi.ibxTreeNode.defaultIndent;
		
		options.labelOptions.text = options.text || options.labelOptions.text;
		this.nodeLabel.ibxWidget("option", options.labelOptions).css("padding-left", this.depth() * indent);
		this.element.toggleClass("tnode-is-container", options.container).toggleClass("tnode-expanded", options.expanded);
		this.btnExpand.removeClass(options.btnCollapsed).removeClass(options.btnExpanded);
		if (container)
		{
			if (options.expanded)
				this.btnExpand.addClass(options.btnExpanded);
			else
				this.btnExpand.addClass(options.btnCollapsed);
		}
	}
});
$.ibi.ibxTreeNode.defaultIndent = null;
//# sourceURL=tree.ibx.js
