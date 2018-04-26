/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxTree", $.ibi.ibxVBox, 
{
	options:
	{
		"navKeyRoot":true,
		"navKeyDir":"vertical",
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
	_create:function()
	{
		this._super();
		this.element.on("ibx_before_expand ibx_expand ibx_before_collapse ibx_collapse", this._onItemExpandEvent.bind(this));
	},
	_destroy:function()
	{
		this._super();
	},
	navKeyChildren:function(selector)
	{
		return this.element.find(".tnode-label:ibxFocusable(-1)").filter(selector || "*");
	},
	_onItemExpandEvent:function(e)
	{
		if(!this.element.is(e.target))
		{
			var evt = this.element.dispatchEvent(e.type, e.target, false);
			if(evt.defaultPrevented)
				e.preventDefault();
			e.stopImmediatePropagation();
		}
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
		"expanded":false,
		"container":"auto",
		"aria":
		{
			"role":"listitem",
		}
	},
	_widgetClass:"ibx-tree-node",
	_create:function()
	{
		var options = this.options;
		this._super();
		this.nodeLabel = $("<div tabindex='-1' class='tnode-label'>").ibxLabel().appendTo(this.element);
		this.nodeLabel.on("dblclick", this._onNodeMouseEvent.bind(this)).on("keydown", this._onNodeKeyEvent.bind(this));
		options.labelOptions.text = options.labelOptions.text || this.element.textNodes().remove().text().replace(/^\s*|\s*$/g, "");

		this.btnExpand = $("<div class='tnode-button'>").prependTo(this.nodeLabel).on("click", this._onNodeMouseEvent.bind(this));

		this._childBox = $("<div class='tnode-children'>").ibxVBox().appendTo(this.element);
		var childNodes = this.element.children(".ibx-tree-node");
		childNodes.appendTo(this._childBox);
		options.hasChildren = !!childNodes.length;
	},
	_destroy:function()
	{
		this._super();
	},
	tree:function()
	{
		return this.element.closest(".ibx-tree");
	},
	parentNode:function()
	{
		return this.element.parents(".ibx-tree-node").first();
	},
	hasChildren:function()
	{
		return !!this._childBox.children(".ibx-tree-node").length;
	},
	_onNodeKeyEvent:function(e)
	{
		var options = this.options;
		if(e.keyCode === $.ui.keyCode.RIGHT)
		{
			if(!options.expanded)
				this._toggleExpanded(true);
			else
				this._childBox.children(":first-child").focus();
		}
		else
		if(e.keyCode === $.ui.keyCode.LEFT)
		{
			if(options.expanded)
				this._toggleExpanded(false);
		}
	},
	_onNodeMouseEvent:function(e)
	{
		this._toggleExpanded();
	},
	_toggleExpanded:function(expand)
	{
		expand = (expand === undefined) ? !this.options.expanded : expand;
		this.option("expanded", expand);
	},
	_setOption:function(key, value)
	{
		var changed = (this.options[key] != value);
		if(changed && key == "expanded")
		{
			var eType = value ? "ibx_before_expand" : "ibx_before_collapse";
			var evt = this.element.dispatchEvent(eType, null);
			if(!evt.defaultPrevented)
			{
				this._super(key, value);
				eType = value ? "ibx_expand" : "ibx_collapse";
				this.element.dispatchEvent(eType, null);
			}
		}
		else
			this._super(key, value);
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		var container = (options.container == "auto") ? this.hasChildren() : options.container;

		this.nodeLabel.ibxWidget("option", options.labelOptions);
		this.element.toggleClass("tnode-has-children", options.hasChildren).toggleClass("tnode-expanded", options.expanded);
		this.btnExpand.toggleClass(options.btnCollapsed, container && !options.expanded).toggleClass(options.btnExpanded, container && options.expanded)
	}
});
$.widget("ibi.ibxTreeRootNode", $.ibi.ibxTreeNode, {"_widgetClass":"ibx-tree-root-node"}); 

//# sourceURL=tree.ibx.js

