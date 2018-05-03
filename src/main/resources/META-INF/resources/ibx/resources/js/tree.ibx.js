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
	NODE_EVENTS: "keydown keyup mousedown click dblclick ibx_nodeselect ibx_nodedeselect ibx_nodeanchored ibx_nodeunanchored ibx_beforeexpand ibx_expand ibx_beforecollapse ibx_collapse",
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
		return this.element.find(".tnode-label:ibxFocusable(-1)").filter(selector || "*");
	},
	treeNodes:function(pattern)
	{
		return this.element.find(pattern || ".ibx-tree-node");
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
	selected:function(el, selected, add)
	{
		if(el === undefined)
			return this.treeNodes(".tnode-selected");

		var nodes = this.treeNodes();
		if(!add)
			nodes.ibxWidget("selected", false);
		nodes = nodes.filter(el);
		nodes = this.options.multiSelect ? nodes : nodes.first();

		this._internalSelect = true;
		nodes.ibxWidget("selected", selected);
		this._internalSelect = false;
	},
	_onNodeEvent:function(e)
	{
		var options = this.options;
		var eType = e.type;

		//save this for multi-selection
		if(eType == "keydown" || eType == "keyup" || e.type == "mousedown")
		{
			this._ctrlKeyDown = e.ctrlKey;
			this._shiftKeyDown = e.shiftKey;

			//escape will clear all selections back to anchor...this is questionable...really not sure we want this functionality
			if(options.escClearSelection && (e.keyCode === $.ui.keyCode.ESCAPE))
			{
				var selected = $(this.selected());
				selected.ibxWidget("selected", false).ibxWidget("anchor", false);
			}
		}
		else
		if(eType == "ibx_nodeselect")
		{
			if(!this._internalSelect)
			{
				var target = $(e.target);
				var curSelNodes = $(this.selected().not(target));
				
				curSelNodes.ibxWidget("anchor", false);

				//not multiselect, or no selection meta key is down...clear selection start again.
				if(!options.multiSelect || (!this._ctrlKeyDown && !this._shiftKeyDown))
					curSelNodes.ibxWidget("selected", false);
				else
				if(this._shiftKeyDown)//do contiguous selection
				{
				}
			}
		}

		//don't let the events bubble past the tree.
		e.stopPropagation();
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
		this.nodeLabel = $("<div tabindex='-1' class='tnode-label'>").ibxLabel().appendTo(this.element);
		this.nodeLabel.on("mousedown dblclick", this._onLabelClickEvent.bind(this)).on("keydown", this._onLabelKeyEvent.bind(this));
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
	_onLabelKeyEvent:function(e)
	{
		var options = this.options;
		if(e.keyCode === $.ui.keyCode.RIGHT)
		{
			if(!options.expanded)
				this.toggleExpanded(true);
			else
				this.children().first().ibxWidget("focusNode");
		}
		else
		if(e.keyCode === $.ui.keyCode.LEFT)
		{
			if(options.expanded)
				this.toggleExpanded(false);
			else
				$(this.parentNode()).ibxWidget("focusNode");
		}
		else
		if(e.keyCode === $.ui.keyCode.ENTER || e.keyCode === $.ui.keyCode.SPACE)
			this.selected(true);
	},
	_onLabelClickEvent:function(e)
	{
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
	_onBtnExpandClick:function(e)
	{
		if(e.type == "click")
			this.toggleExpanded();
		e.stopPropagation();//click/mousedown on button should not change tree selection...this stops that
	},
	toggleExpanded:function(expand)
	{
		expand = (expand === undefined) ? !this.options.expanded : expand;
		this.option("expanded", expand);
	},
	focusNode:function()
	{
		this.nodeLabel.focus();
	},
	anchor:function(anchor)
	{
		if(anchor === undefined)
			return this.element.is(".tnode-selection-anchor");

		var tree = this.tree();
		var anchored = this.anchor();
		if(anchor && !anchored)
		{
			this.element.toggleClass("tnode-selection-anchor", true);
			this.element.dispatchEvent("ibx_nodeanchored", null, true, true, tree);
		}
		else
		if(!anchor && anchored)
		{
			this.element.toggleClass("tnode-selection-anchor", false)
			this.element.dispatchEvent("ibx_nodeunanchored", null, true, true, tree);
		}
	},
	selected:function(select)
	{
		if(select === undefined)
			return this.element.is(".tnode-selected");

		var tree = this.tree();
		var selected = this.selected();
		if(select && !selected)
		{
			var evt = this.element.dispatchEvent("ibx_nodeselect", null, true, true, tree);
			if(!evt.defaultPrevented)
			{
				this.anchor(true);
				this.element.toggleClass("tnode-selected", true);
				this.focusNode();
			}	
		}
		else
		if(!select && selected)
		{
			
			var evt = this.element.dispatchEvent("ibx_nodedeselect", null, true, true, tree);
			if(!evt.defaultPrevented)
			{
				this.anchor(false);
				this.element.toggleClass("tnode-selected", false)
			}
		}
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
		if(!withChildren)
			this.navKeyChildren().ibxWidget("refresh");
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		var children = this.children();
		var container = (options.container == "auto") ? this.hasChildren() : options.container;
		var indent = options.indent || $.ibi.ibxTreeNode.defaultIndent;
		
		options.labelOptions.text = options.text || options.labelOptions.text;
		this.nodeLabel.ibxWidget("option", options.labelOptions).css("padding-left", this.depth() * indent);
		this.element.toggleClass("tnode-is-container", options.container).toggleClass("tnode-expanded", options.expanded);
		this.btnExpand.toggleClass(options.btnCollapsed, container && !options.expanded).toggleClass(options.btnExpanded, container && options.expanded)
	}
});
$.ibi.ibxTreeNode.defaultIndent = null;
//# sourceURL=tree.ibx.js

