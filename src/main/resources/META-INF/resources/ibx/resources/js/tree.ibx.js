/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxTree", $.ibi.ibxVBox, 
{
	options:
	{
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
	NODE_EVENTS: "dblclick ibx_nodeselect ibx_nodedeselect ibx_beforeexpand ibx_expand ibx_beforecollapse ibx_collapse",
	_create:function()
	{
		this._super();
		this.element.on(this.NODE_EVENTS, this._onNodeEvent.bind(this)).on("keydown", this._onTreeKeyEvent.bind(this));
	},
	_destroy:function()
	{
		this._super();
	},
	navKeyChildren:function(selector)
	{
		return this.element.find(".tnode-label:ibxFocusable(-1)").filter(selector || "*");
	},
	activeNode:function()
	{
		return this.navKeyActiveChild()[0];
	},
	selectedNode:function()
	{
		return this.element.find(".tnode-selected").parent()[0] || null;
	},
	_onNodeEvent:function(e)
	{
		//don't let the events bubble past the tree.
		if(e.type == "ibx_nodeselect")
			this.element.find(".ibx-tree-node").not(e.target).ibxWidget("select", false);
		e.stopPropagation();
	},
	_onTreeKeyEvent:function(e)
	{
		if(e.keyCode === $.ui.keyCode.ESCAPE)
			$(this.selectedNode()).ibxWidget("navKeyActive");
	},
	_refresh:function()
	{
		var options = this.options;
		this._super();
		this.element.find(".ibx-tree-node").ibxWidget("refresh");
	}
});

$.widget("ibi.ibxTreeNode", $.ibi.ibxVBox, 
{
	options:
	{
		"text":"", //tranfer the option to the inner label in refresh
		"labelOptions":{},
		"btnCollapsed":"tnode-btn-collapsed",
		"btnExpanded":"tnode-btn-expanded",
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
		this.nodeLabel.on("click dblclick", this._onLabelClickEvent.bind(this)).on("keydown", this._onLabelKeyEvent.bind(this));
		options.labelOptions.text = options.labelOptions.text || this.element.textNodes().remove().text().replace(/^\s*|\s*$/g, "");

		this.btnExpand = $("<div class='tnode-button'>").prependTo(this.nodeLabel).on("click", this._onBtnExpandClick.bind(this));

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
			this.select(true);
	},
	_onLabelClickEvent:function(e)
	{
		if(e.type == "dblclick")
			this.toggleExpanded();
		else
			this.select(true);
	},
	_onBtnExpandClick:function(e)
	{
		this.toggleExpanded();
		e.stopPropagation();//click on button should not change tree selection...this stops that
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
	selected:function()
	{
		return this.nodeLabel.is(".tnode-selected");
	},
	select:function(select)
	{
		var tree = this.tree();
		var selected = this.selected();
		if(select && !selected)
		{
			this.nodeLabel.toggleClass("tnode-selected", true)
			this.element.dispatchEvent("ibx_nodeselect", null, true, true, tree);
		}
		else
		if(!select && selected)
		{
			this.nodeLabel.toggleClass("tnode-selected", false)
			this.element.dispatchEvent("ibx_nodedeselect", null, true, true, tree);
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
				this.element.dispatchEvent(eType, null, true, true, tree);
			}
		}
		else
			this._super(key, value);
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

